// public/js/migration_tools.js — Settings → Migration Tools handlers.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// One-time housekeeping flows surfaced in the Settings modal. All are
// idempotent on the server — safe to run multiple times.
//
//   runRenestMigration   — re-parents legacy projects under their right
//                          rollup chain (Client → Service Area →
//                          Project Type → Team).
//   scanOrphanFiles      — disk scan for files not linked to any
//                          permit_documents row; offers per-file or
//                          bulk attach to a project.
//   adoptOrphan          — single-file attach.
//   adoptOrphansBulk     — attach all to one project.
//   previewHoursBackfill — preview which time_entries can be linked
//                          to user accounts (via name match).
//   runHoursBackfill     — apply the backfill.
//
// Globals this module reads:
//   api(), esc()                          — global helpers
//   allProjects                           — global cache
//   loadProjects, loadDashboard           — global tab loaders
//
// Functions exposed on window:
//   runRenestMigration, scanOrphanFiles, adoptOrphan,
//   adoptOrphansBulk, previewHoursBackfill, runHoursBackfill,
//   previewOrphanPrune, runOrphanPrune

(function () {
  // Re-nest legacy projects: walks every real project and moves it under
  // the correct rollup chain. Empty rollups are KEPT (owner-curated folders
  // shouldn't be silently swept). Two-stage flow lets the operator preview
  // exactly which projects will move before any parent_id changes.
  async function runRenestMigration() {
    const result = document.getElementById('renest-result');
    result.style.display = 'block';
    result.style.color = 'var(--text-muted)';
    result.textContent = 'Previewing changes…';
    try {
      // Step 1: dry-run preview (no body → backend treats as preview)
      const preview = await api('/api/_admin/migrate-nesting', 'POST');
      if (preview.moved === 0) {
        result.style.color = 'var(--success)';
        result.textContent = preview.hint || 'Tree already nested correctly.';
        return;
      }
      let confirmMsg = `Re-nest ${preview.moved} of ${preview.processed} projects`;
      if (Array.isArray(preview.movements) && preview.movements.length) {
        confirmMsg += ':\n' + preview.movements.slice(0, 10)
          .map(m => `  • ${m.name}`).join('\n');
        if (preview.movements.length > 10) confirmMsg += `\n  …and ${preview.movements.length - 10} more`;
      }
      confirmMsg += '\n\nEmpty rollup folders will be left in place. Proceed?';
      if (!confirm(confirmMsg)) {
        result.style.color = 'var(--text-muted)';
        result.textContent = 'Cancelled.';
        return;
      }
      result.textContent = 'Applying…';
      const r = await api('/api/_admin/migrate-nesting', 'POST', { confirm: true });
      result.style.color = r.failed > 0 ? 'var(--warning)' : 'var(--success)';
      let summary = `Processed: ${r.processed}\nMoved:     ${r.moved}\nSkipped:   ${r.skipped}\nFailed:    ${r.failed}\n\n${r.hint || ''}`;
      if (r.errors && r.errors.length) {
        summary += '\n\nErrors:\n' + r.errors.map(e => `  • ${e.name}: ${e.error}`).join('\n');
      }
      result.textContent = summary;
      if (r.moved > 0) {
        if (typeof loadProjects === 'function') loadProjects();
        if (typeof loadDashboard === 'function') loadDashboard();
      }
    } catch (e) {
      result.style.color = 'var(--danger)';
      result.textContent = 'Failed: ' + e.message;
    }
  }

  // Preview / run the orphan-file prune. Same two-stage pattern: backend
  // is dry-run by default, second call carries {confirm: true} once the
  // operator acknowledges the destructive nature of the delete.
  async function previewOrphanPrune() {
    const result = document.getElementById('prune-result');
    result.style.display = 'block';
    result.style.color = 'var(--text-muted)';
    result.textContent = 'Scanning…';
    try {
      const r = await api('/api/_admin/prune-orphan-files', 'POST', {});
      result.style.color = r.candidates > 0 ? 'var(--warning)' : 'var(--success)';
      let summary = `Orphan candidates: ${r.candidates}\nWould free:        ${(r.bytes_freed / 1024 / 1024).toFixed(1)} MB\nKept (too recent): ${r.skipped_too_recent}\n\n${r.hint || ''}`;
      if (r.sample && r.sample.length) {
        summary += '\n\nSample:\n' + r.sample.slice(0, 8).map(s => `  • ${s.file_path} (${(s.file_size/1024).toFixed(0)} KB, ${s.age_hours.toFixed(0)}h old)`).join('\n');
      }
      result.textContent = summary;
    } catch (e) {
      result.style.color = 'var(--danger)';
      result.textContent = 'Failed: ' + e.message;
    }
  }

  async function runOrphanPrune() {
    const result = document.getElementById('prune-result');
    result.style.display = 'block';
    result.style.color = 'var(--text-muted)';
    result.textContent = 'Previewing…';
    try {
      const preview = await api('/api/_admin/prune-orphan-files', 'POST', {});
      if (preview.candidates === 0) {
        result.style.color = 'var(--success)';
        result.textContent = preview.hint || 'No orphans to prune.';
        return;
      }
      const ok = confirm(
        `Permanently delete ${preview.candidates} orphan file${preview.candidates === 1 ? '' : 's'}? ` +
        `(${(preview.bytes_freed / 1024 / 1024).toFixed(1)} MB will be freed.)\n\n` +
        `This cannot be undone.`
      );
      if (!ok) {
        result.style.color = 'var(--text-muted)';
        result.textContent = 'Cancelled.';
        return;
      }
      result.textContent = 'Deleting…';
      const r = await api('/api/_admin/prune-orphan-files', 'POST', { confirm: true });
      result.style.color = 'var(--success)';
      result.textContent = `Deleted: ${r.deleted}\nFreed:   ${(r.bytes_freed / 1024 / 1024).toFixed(1)} MB\nKept:    ${r.skipped_too_recent}\n\n${r.hint || ''}`;
    } catch (e) {
      result.style.color = 'var(--danger)';
      result.textContent = 'Failed: ' + e.message;
    }
  }

  // Scan disk for orphan files (no matching permit_documents row).
  // Renders a list with per-file project pickers + a "Bulk attach" path
  // for the common case where everything was for one project.
  async function scanOrphanFiles() {
    const result = document.getElementById('orphan-result');
    result.style.display = 'block';
    result.innerHTML = '<div style="padding:8px;color:var(--text-muted);font-size:12px">Scanning…</div>';
    try {
      const r = await api('/api/_admin/orphan-files');
      if (r.orphan_count === 0) {
        result.innerHTML = `<div style="padding:8px;background:var(--white);border-radius:6px;font-size:12px;color:var(--success)"><i class="fa-solid fa-circle-check"></i> ${esc(r.hint)}</div>`;
        return;
      }
      // Build a project picker (excluding rollups). We need allProjects loaded.
      if (!window.allProjects || !window.allProjects.length) {
        try { window.allProjects = await api('/api/projects'); } catch(e){}
      }
      const realProjects = (window.allProjects || []).filter(p => !p.is_rollup);
      const projectOptions = '<option value="">— choose a project —</option>' +
        realProjects.map(p => `<option value="${p.id}">${esc(p.name)}${p.client_name ? ' · ' + esc(p.client_name) : ''}</option>`).join('');

      const fmtSize = (b) => b > 1024 * 1024 ? (b / 1024 / 1024).toFixed(1) + ' MB' : (b / 1024).toFixed(0) + ' KB';

      result.innerHTML = `
        <div style="padding:8px;background:var(--primary-light);border-radius:6px;font-size:12px;margin-bottom:10px">
          <strong>${r.orphan_count} orphan file${r.orphan_count !== 1 ? 's' : ''} found.</strong> Pick a project for each, or use Bulk Attach to send all to one project.
        </div>
        <details style="margin-bottom:10px;padding:10px;background:var(--gray-light);border-radius:6px">
          <summary style="cursor:pointer;font-size:12px;font-weight:600">Bulk attach: send all ${r.orphan_count} to one project</summary>
          <div style="display:flex;gap:6px;margin-top:8px">
            <select id="orphan-bulk-project" aria-label="Select project for bulk attach" style="flex:1;font-size:12px;padding:4px 6px">${projectOptions}</select>
            <button class="btn btn-primary btn-sm" onclick="adoptOrphansBulk()">Attach All</button>
          </div>
        </details>
        <div style="max-height:300px;overflow-y:auto;border:1px solid var(--gray-border);border-radius:6px">
          <table style="width:100%;font-size:12px;border-collapse:collapse">
            <thead style="position:sticky;top:0;background:var(--gray-light)">
              <tr><th style="text-align:left;padding:6px 8px">File</th><th style="padding:6px 8px">Size</th><th style="text-align:left;padding:6px 8px">Project</th><th></th></tr>
            </thead>
            <tbody>${r.orphans.map((o, i) => `
              <tr style="border-top:1px solid var(--gray-border)">
                <td style="padding:6px 8px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(o.file_name)}">${esc(o.file_name)}</td>
                <td style="padding:6px 8px;text-align:right;color:var(--text-muted)">${fmtSize(o.file_size)}</td>
                <td style="padding:6px 8px"><select id="orphan-proj-${i}" aria-label="Select project for ${esc(o.file_name)}" style="font-size:11px;padding:2px 4px;width:100%">${projectOptions}</select></td>
                <td style="padding:6px 8px"><button class="btn btn-sm btn-primary" onclick="adoptOrphan('${esc(o.file_path)}', ${i})"><i class="fa-solid fa-link"></i></button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>`;
    } catch (e) {
      result.innerHTML = `<div style="padding:8px;color:var(--danger);font-size:12px">Scan failed: ${esc(e.message)}</div>`;
    }
  }

  async function adoptOrphan(filePath, idx) {
    const projectId = document.getElementById('orphan-proj-' + idx).value;
    if (!projectId) return alert('Pick a project for this file first.');
    try {
      await api('/api/_admin/adopt-orphan', 'POST', { project_id: projectId, file_path: filePath });
      // Re-scan to remove the row that was just adopted
      scanOrphanFiles();
    } catch (e) { alert('Adopt failed: ' + e.message); }
  }

  async function adoptOrphansBulk() {
    const projectId = document.getElementById('orphan-bulk-project').value;
    if (!projectId) return alert('Pick a project first.');
    if (!confirm('Attach ALL orphan files to this project?')) return;
    try {
      const r = await api('/api/_admin/adopt-orphans-bulk', 'POST', { project_id: projectId });
      alert(`Attached ${r.adopted} files to "${r.project_name}".`);
      scanOrphanFiles();
    } catch (e) { alert('Bulk adopt failed: ' + e.message); }
  }

  // ─── Backfill hours: link existing time_entries to user accounts ────
  async function previewHoursBackfill() {
    const result = document.getElementById('backfill-result');
    result.style.display = 'block';
    result.innerHTML = '<div style="padding:8px;color:var(--text-muted);font-size:12px">Scanning…</div>';
    try {
      const r = await api('/api/_admin/hours-backfill-preview');
      const s = r.summary;
      let html = `<div style="padding:10px;background:var(--white);border:1px solid var(--gray-border);border-radius:6px;font-size:12px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
          <div><strong style="color:var(--success)">${s.staff_with_user_match}</strong> staff names match a user</div>
          <div><strong style="color:var(--primary)">${s.time_entries_to_link}</strong> time entries ready to link</div>
          <div><strong style="color:var(--warning)">${s.staff_ambiguous}</strong> ambiguous (skip until resolved)</div>
          <div><strong style="color:var(--text-muted)">${s.staff_unmatched}</strong> have no matching user</div>
        </div>`;
      if (r.matched.length) {
        html += `<details style="margin-bottom:6px"><summary style="cursor:pointer;font-weight:600;color:var(--success)">✓ Will link (${r.matched.length})</summary>
          <table style="width:100%;font-size:11px;border-collapse:collapse;margin-top:6px">
            <tbody>${r.matched.map(m => `<tr style="border-top:1px solid var(--gray-border)"><td style="padding:3px 6px"><b>${esc(m.staff_name)}</b></td><td style="padding:3px 6px;color:var(--text-muted)">→</td><td style="padding:3px 6px;font-family:monospace">${esc(m.matched_username)}</td><td style="padding:3px 6px;text-align:right;color:var(--primary)">${m.entries_to_link} entries</td></tr>`).join('')}</tbody>
          </table></details>`;
      }
      if (r.ambiguous.length) {
        html += `<details style="margin-bottom:6px"><summary style="cursor:pointer;font-weight:600;color:var(--warning)">⚠ Ambiguous (${r.ambiguous.length}) — multiple users match this name</summary>
          <table style="width:100%;font-size:11px;border-collapse:collapse;margin-top:6px">
            <tbody>${r.ambiguous.map(m => `<tr style="border-top:1px solid var(--gray-border)"><td style="padding:3px 6px"><b>${esc(m.staff_name)}</b></td><td style="padding:3px 6px;color:var(--warning)">${m.match_count} matches</td><td style="padding:3px 6px;text-align:right">${m.entries_to_link} entries</td></tr>`).join('')}</tbody>
          </table>
          <div style="font-size:10px;color:var(--text-muted);margin-top:4px">Resolve by renaming users (Settings → Users) so only one user matches this staff name exactly.</div></details>`;
      }
      if (r.unmatched.length) {
        html += `<details><summary style="cursor:pointer;font-weight:600;color:var(--text-muted)">— No user match (${r.unmatched.length})</summary>
          <table style="width:100%;font-size:11px;border-collapse:collapse;margin-top:6px">
            <tbody>${r.unmatched.map(m => `<tr style="border-top:1px solid var(--gray-border)"><td style="padding:3px 6px">${esc(m.staff_name)}</td><td style="padding:3px 6px;text-align:right;color:var(--text-muted)">${m.entries_to_link} entries</td></tr>`).join('')}</tbody>
          </table>
          <div style="font-size:10px;color:var(--text-muted);margin-top:4px">Create a user with full_name set to the staff name, then re-run the preview.</div></details>`;
      }
      html += '</div>';
      result.innerHTML = html;
    } catch (e) {
      result.innerHTML = `<div style="padding:8px;color:var(--danger);font-size:12px">Preview failed: ${esc(e.message)}</div>`;
    }
  }

  async function runHoursBackfill() {
    if (!confirm('Backfill hours to user accounts?\n\nThis links time entries to users where the staff name matches a user\'s full_name (or username) exactly. Ambiguous matches (more than one user with the same name) are skipped.\n\nSafe to run multiple times — only blank user_id rows get updated.')) return;
    const result = document.getElementById('backfill-result');
    result.style.display = 'block';
    result.innerHTML = '<div style="padding:8px;color:var(--text-muted);font-size:12px">Linking…</div>';
    try {
      const r = await api('/api/_admin/hours-backfill', 'POST');
      result.innerHTML = `<div style="padding:10px;background:var(--white);border:1px solid var(--success);border-radius:6px;font-size:12px;color:var(--success)">
        <i class="fa-solid fa-check-circle"></i> ${esc(r.hint)}
      </div>`;
    } catch (e) {
      result.innerHTML = `<div style="padding:8px;color:var(--danger);font-size:12px">Backfill failed: ${esc(e.message)}</div>`;
    }
  }

  window.runRenestMigration = runRenestMigration;
  window.scanOrphanFiles = scanOrphanFiles;
  window.adoptOrphan = adoptOrphan;
  window.adoptOrphansBulk = adoptOrphansBulk;
  window.previewHoursBackfill = previewHoursBackfill;
  window.runHoursBackfill = runHoursBackfill;
  window.previewOrphanPrune = previewOrphanPrune;
  window.runOrphanPrune = runOrphanPrune;
})();
