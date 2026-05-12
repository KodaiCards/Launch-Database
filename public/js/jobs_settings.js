// public/js/jobs_settings.js — Jobs management Settings panel.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Inline-editable Jobs table inside the Settings modal. Each row has
// per-cell edits for name / billing_code / billing_type / rate / team /
// permit-calc / PSC / Other flags, plus action buttons:
//   - reset-override (un-pin manual changes; reverts to canonical on next deploy)
//   - propagate-rate (apply this job's rate to every project using it)
//   - delete (soft-deactivates; existing projects keep their history)
//
// Globals this module reads:
//   api(), esc()                    — global helpers
//   jobsCache                       — global cache loaded by loadJobs()
//   loadJobs()                      — global loader
//   populatePricingFormDropdowns()  — Pricing form populator (still inline)
//   refreshSettingsDot()            — settings unread badge (still inline)
//
// Functions exposed on window for inline event handlers:
//   renderJobsList, setJobTeam, setJobRate, setJobBillingType,
//   resetJobOverride, setJobField, setJobFlag, propagateJobRate,
//   updateRateLabel, saveNewJob, deleteJob

(function () {
  function renderJobsList() {
    const root = document.getElementById('jobs-list-body');
    if (!root) return;
    const cache = (typeof jobsCache !== 'undefined' && jobsCache) ? jobsCache : [];
    if (!cache.length) { root.innerHTML = '<div class="empty-state" style="padding:12px;text-align:center;color:var(--text-muted)">No jobs yet.</div>'; return; }
    root.innerHTML = `<table style="width:100%;font-size:13px;border-collapse:collapse">
      <thead><tr style="color:var(--text-muted);font-size:11px;text-transform:uppercase">
        <th style="text-align:left;padding:6px 8px">Name</th>
        <th style="text-align:left;padding:6px 8px">Code</th>
        <th style="text-align:left;padding:6px 8px">Billing</th>
        <th style="text-align:right;padding:6px 8px">Rate</th>
        <th style="text-align:center;padding:6px 8px">Team</th>
        <th style="text-align:center;padding:6px 8px;white-space:nowrap">Permit<br>Calc</th>
        <th style="text-align:center;padding:6px 8px;white-space:nowrap" title="RUS jobs require a billing code; Non-RUS don't. Shared shows in both contexts.">Program<br>Scope</th>
        <th></th>
      </tr></thead>
      <tbody>${cache.map(j => {
        const label = j.name;
        const rateNullish = j.default_rate === null || j.default_rate === undefined || j.default_rate === '';
        const billType = j.default_billing_type === 'footage' ? 'footage' : 'hourly';
        const rateUnit = billType === 'footage' ? '/mile' : '/hr';
        return `<tr style="border-top:1px solid var(--gray-border)">
        <td style="padding:6px 8px">
          <input type="text" value="${esc(label)}" onchange="setJobField('${j.id}','name',this.value)" style="width:100%;font-weight:600;font-size:13px;padding:3px 6px;border:1px solid transparent;border-radius:4px;background:transparent" onfocus="this.style.borderColor='var(--gray-border)';this.style.background='var(--surface-2)'" onblur="this.style.borderColor='transparent';this.style.background='transparent'" title="Click to rename">
        </td>
        <td style="padding:6px 8px">
          <input type="text" value="${esc(j.billing_code || '')}" placeholder="—" onchange="setJobField('${j.id}','billing_code',this.value)" style="width:90px;font-family:monospace;font-size:11px;color:var(--text-muted);padding:2px 6px;border:1px solid transparent;border-radius:4px;background:transparent" onfocus="this.style.borderColor='var(--gray-border)';this.style.background='var(--surface-2)'" onblur="this.style.borderColor='transparent';this.style.background='transparent'" title="RUS billing code">
        </td>
        <td style="padding:6px 8px">
          <select onchange="setJobBillingType('${j.id}', this.value)" style="font-size:11px;padding:2px 4px;border:1px solid var(--gray-border);border-radius:4px;background:var(--surface-2)" title="Switch hourly vs footage billing">
            <option value="hourly"  ${billType==='hourly'  ? 'selected':''}>hourly</option>
            <option value="footage" ${billType==='footage' ? 'selected':''}>footage</option>
          </select>
        </td>
        <td style="padding:6px 8px;text-align:right;white-space:nowrap">
          <input type="number" step="0.01" placeholder="—" value="${rateNullish ? '' : j.default_rate}" data-job-id="${j.id}" onchange="setJobRate('${j.id}', this.value)" style="width:80px;text-align:right;font-size:12px;padding:2px 6px;border:1px solid var(--gray-border);border-radius:4px">
          <span style="font-size:11px;color:var(--text-muted)">${rateUnit}</span>
        </td>
        <td style="padding:6px 8px;text-align:center">
          <select onchange="setJobTeam('${j.id}', this.value)" style="font-size:11px;padding:2px 4px;border:1px solid var(--gray-border);border-radius:4px;background:var(--surface-2)">
            <option value="" ${!j.team ? 'selected':''}>—</option>
            <option value="design" ${j.team==='design' ? 'selected':''}>Design</option>
            <option value="permitting" ${j.team==='permitting' ? 'selected':''}>Permitting</option>
            <option value="construction" ${(j.team==='construction'||j.team==='inspection') ? 'selected':''}>Construction</option>
            <option value="both" ${j.team==='both' ? 'selected':''}>Both</option>
          </select>
        </td>
        <td style="padding:6px 8px;text-align:center"><input type="checkbox" ${j.is_permitting ? 'checked' : ''} onchange="setJobField('${j.id}','is_permitting',this.checked)" title="Counts toward permit calc when checked"></td>
        <td style="padding:6px 8px;text-align:center">
          <select onchange="setJobField('${j.id}','program_scope',this.value)" style="font-size:11px;padding:2px 4px;border:1px solid var(--gray-border);border-radius:4px;background:var(--surface-2)" title="RUS = USDA work (billing code required). Non-RUS = ordinary work. Shared = shows in both contexts.">
            <option value="rus"     ${j.program_scope==='rus'     ? 'selected':''}>RUS</option>
            <option value="non_rus" ${j.program_scope==='non_rus' ? 'selected':''}>Non-RUS</option>
            <option value="shared"  ${j.program_scope==='shared'  ? 'selected':''}>Shared</option>
          </select>
        </td>
        <td style="padding:6px 8px;text-align:right;white-space:nowrap">
          ${j.manually_overridden_at ? `<button class="btn btn-sm btn-icon" style="color:var(--warning);background:transparent;border:1px solid var(--gray-border)" onclick="resetJobOverride('${j.id}','${esc(j.name)}')" title="Manual override active — click to reset to system default on next deploy"><i class="fa-solid fa-thumbtack"></i></button>` : ''}
          <button class="btn btn-sm btn-icon" style="color:var(--primary);background:transparent;border:1px solid var(--gray-border)" onclick="openJobAssignmentsModal('${j.id}','${esc(j.name)}')" title="Manage scope pins — control which clients / ECs / teams see this job"><i class="fa-solid fa-link"></i></button>
          <button class="btn btn-sm btn-icon" style="color:var(--primary);background:transparent;border:1px solid var(--gray-border)" onclick="propagateJobRate('${j.id}','${esc(j.name)}')" title="Apply current rate to all existing projects using this job"><i class="fa-solid fa-arrow-right-arrow-left"></i></button>
          <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="deleteJob('${j.id}','${esc(j.name)}')" title="Deactivate (preserves history)"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
      }).join('')}</tbody></table>
      <div style="font-size:11px;color:var(--text-muted);margin-top:8px;padding:6px 4px;line-height:1.5">
        <i class="fa-solid fa-circle-info"></i> Inline edits to <b>Billing</b>, <b>Rate</b>, <b>Team</b>, or <b>Program Scope</b> become a <b>manual override</b> — they survive deploys and the system stops trying to revert them. A <i class="fa-solid fa-thumbtack" style="color:var(--warning)"></i> pin appears on overridden rows; click it to reset to system defaults. Click <i class="fa-solid fa-arrow-right-arrow-left"></i> to push the current rate to <b>all existing projects</b> using this job. Click <i class="fa-solid fa-link"></i> to manage <b>scope pins</b> — when any pin is set, the job appears <em>only</em> in those scopes instead of using the program-based heuristic.
      </div>`;
  }

  // Inline team change from the Jobs table — updates immediately.
  async function setJobTeam(jobId, team) {
    try {
      await api('/api/jobs/' + jobId, 'PUT', { team: team || null });
      await loadJobs();
      renderJobsList();
    } catch (e) { alert('Failed to set team: ' + e.message); }
  }

  // Inline rate change — saves the new default_rate to the job.
  async function setJobRate(jobId, value) {
    const rate = value === '' ? null : parseFloat(value);
    if (value !== '' && (isNaN(rate) || rate < 0)) return alert('Enter a valid non-negative rate.');
    try {
      await api('/api/jobs/' + jobId, 'PUT', { default_rate: rate });
      await loadJobs();
      // No re-render — the input keeps its value and other rows aren't affected.
    } catch (e) { alert('Failed to set rate: ' + e.message); }
  }

  async function setJobBillingType(jobId, billingType) {
    if (billingType !== 'hourly' && billingType !== 'footage') return;
    try {
      await api('/api/jobs/' + jobId, 'PUT', { default_billing_type: billingType });
      await loadJobs();
      renderJobsList();
    } catch (e) { alert('Failed to set billing type: ' + e.message); }
  }

  async function resetJobOverride(jobId, jobName) {
    if (!confirm(`Reset "${jobName}" to system defaults?\n\nThis removes the manual-override lock. On the next deploy, the system will reset team, billing type, rate (if it has a canonical value), and PSC/Other flags back to the hardcoded canonical values.\n\nUseful if you overrode something by mistake. Your current values stay until the next deploy.`)) return;
    try {
      await api('/api/jobs/' + jobId + '/reset-override', 'POST');
      await loadJobs();
      renderJobsList();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function setJobField(jobId, fieldName, value) {
    if (fieldName === 'name') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        alert('Job name cannot be empty.');
        await loadJobs(); renderJobsList();  // restore old value
        return;
      }
      value = trimmed;
    }
    try {
      await api('/api/jobs/' + jobId, 'PUT', { [fieldName]: value });
      await loadJobs();
      // Only re-render the whole list when name/code change (visual
      // order or labels affected). For boolean flags or rates, in-place
      // input keeps its value and we skip re-render to avoid losing
      // focus on adjacent edits.
      if (fieldName === 'name' || fieldName === 'billing_code' || fieldName === 'is_permitting') {
        renderJobsList();
      }
    } catch (e) { alert('Failed to update ' + fieldName + ': ' + e.message); }
  }

  async function setJobFlag(jobId, flagName, checked) {
    try {
      await api('/api/jobs/' + jobId, 'PUT', { [flagName]: !!checked });
      await loadJobs();
    } catch (e) { alert('Failed to update flag: ' + e.message); }
  }

  async function propagateJobRate(jobId, jobName) {
    if (!confirm(`Apply the current default rate of "${jobName}" to ALL existing projects that use this job?\n\nThis updates billing_rate on every matching project. Cannot be undone individually.`)) return;
    try {
      const r = await api('/api/jobs/' + jobId + '/propagate-rate', 'PUT');
      alert(`✓ Updated ${r.updated} project${r.updated === 1 ? '' : 's'} to rate ${r.applied_rate ?? '(null)'}.`);
    } catch (e) { alert('Failed: ' + e.message); }
  }

  // Toggle Add-Job rate label between $/hr and $/mile based on selected billing type.
  function updateRateLabel() {
    const bt = document.getElementById('new-job-bt').value;
    const lbl = document.getElementById('new-job-rate-label');
    if (lbl) lbl.textContent = bt === 'footage' ? 'Default Rate ($/mile)' : 'Default Rate ($/hr)';
  }

  async function saveNewJob() {
    const name = document.getElementById('new-job-name').value.trim();
    const billing_code = document.getElementById('new-job-code').value.trim() || null;
    const default_billing_type = document.getElementById('new-job-bt').value;
    const default_rate = parseFloat(document.getElementById('new-job-rate').value);
    const is_permitting = document.getElementById('new-job-perm').checked;
    const team = document.getElementById('new-job-team').value || null;
    const program_scope = (document.getElementById('new-job-scope')?.value) || 'rus';
    // Owner rule: RUS jobs require a billing code; non-RUS jobs don't.
    // Surface that immediately so admin can't create a malformed RUS job.
    if (program_scope === 'rus' && !billing_code) {
      return alert('RUS jobs require a billing code. Add a billing code or change the program scope to Non-RUS / Shared.');
    }
    if (!name) return alert('Job name is required');
    try {
      await api('/api/jobs', 'POST', {
        name,
        billing_code,
        default_billing_type,
        default_rate: isNaN(default_rate) ? null : default_rate,
        is_permitting,
        team,
        program_scope,
        // Legacy boolean pair still accepted by the route; mirror the new
        // enum so older code paths see consistent values until the
        // legacy columns are dropped in a follow-up migration.
        for_psc_client:     program_scope === 'rus'     || program_scope === 'shared',
        for_generic_client: program_scope === 'non_rus' || program_scope === 'shared',
      });
      ['new-job-name','new-job-code','new-job-rate'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('new-job-perm').checked = false;
      document.getElementById('new-job-team').value = '';
      const scopeEl = document.getElementById('new-job-scope');
      if (scopeEl) scopeEl.value = 'rus';
      document.getElementById('jobs-add-form').style.display = 'none';
      await loadJobs();
      if (typeof populatePricingFormDropdowns === 'function') populatePricingFormDropdowns();
      renderJobsList();
      if (typeof refreshSettingsDot === 'function') refreshSettingsDot();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function deleteJob(id, name) {
    if (!confirm(`Delete job "${name}"?\n\nExisting projects keep their history. The job will just be hidden from new selections.`)) return;
    try {
      await api('/api/jobs/' + id, 'DELETE');
      await loadJobs();
      if (typeof populatePricingFormDropdowns === 'function') populatePricingFormDropdowns();
      renderJobsList();
      if (typeof refreshSettingsDot === 'function') refreshSettingsDot();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  // ── Job Assignments (scope pin) modal ─────────────────────────────────────
  // Opens a lightweight modal listing the current pins for a job and letting
  // the admin add or remove them. Each pin ties the job to a client, EC,
  // team, or any combination thereof.
  //
  // When any pins exist for the request scope, GET /api/jobs uses ONLY those
  // pinned jobs — the program_scope heuristic is bypassed entirely. Pins
  // without ANY set on a job mean the job falls back to the heuristic.

  let _jamJobId   = null;   // job currently being managed
  let _jamJobName = null;

  function _ensureJamModal() {
    if (document.getElementById('jam-modal')) return;
    const el = document.createElement('div');
    el.id = 'jam-modal';
    el.style.cssText = [
      'display:none', 'position:fixed', 'inset:0', 'z-index:9999',
      'background:rgba(0,0,0,.55)', 'align-items:center', 'justify-content:center'
    ].join(';');
    el.innerHTML = `
      <div style="background:var(--surface-1);border:1px solid var(--border-weak);border-radius:10px;
                  width:min(540px,95vw);max-height:85vh;display:flex;flex-direction:column;
                  box-shadow:0 8px 32px rgba(0,0,0,.35)">
        <div style="display:flex;align-items:center;justify-content:space-between;
                    padding:14px 18px 10px;border-bottom:1px solid var(--border-weak)">
          <div>
            <div style="font-size:15px;font-weight:600;color:var(--text)" id="jam-title">Scope Pins</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px">
              Job appears <em>only</em> in pinned scopes when any pin is set. Leave empty to use the program heuristic.
            </div>
          </div>
          <button onclick="closeJobAssignmentsModal()" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:18px;padding:4px 8px" title="Close">&times;</button>
        </div>

        <!-- Existing pins list -->
        <div id="jam-pins-list" style="flex:1;overflow-y:auto;padding:12px 18px;min-height:60px"></div>

        <!-- Add-pin form -->
        <div style="padding:12px 18px;border-top:1px solid var(--border-weak);background:var(--surface-2);border-radius:0 0 10px 10px">
          <div style="font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Add pin</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px;align-items:end">
            <div>
              <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px">Client</label>
              <select id="jam-add-client" style="width:100%;font-size:12px;padding:5px 7px;border:1px solid var(--border-weak);border-radius:5px;background:var(--surface-1)">
                <option value="">Any</option>
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px">Engineering Contract</label>
              <select id="jam-add-ec" style="width:100%;font-size:12px;padding:5px 7px;border:1px solid var(--border-weak);border-radius:5px;background:var(--surface-1)">
                <option value="">Any</option>
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px">Team</label>
              <select id="jam-add-team" style="width:100%;font-size:12px;padding:5px 7px;border:1px solid var(--border-weak);border-radius:5px;background:var(--surface-1)">
                <option value="">Any</option>
                <option value="design">Design</option>
                <option value="permitting">Permitting</option>
                <option value="construction">Construction</option>
              </select>
            </div>
            <button class="btn btn-sm" style="background:var(--primary);color:#fff;border:none;padding:5px 12px;border-radius:5px;cursor:pointer;white-space:nowrap"
                    onclick="addJobAssignmentPin()">Add pin</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px">
            "Any" means that axis is not restricted — e.g. Client=PSC + EC=Any pins the job for all of PSC's ECs.
          </div>
        </div>
      </div>`;
    document.body.appendChild(el);
    // Close on backdrop click
    el.addEventListener('click', e => { if (e.target === el) closeJobAssignmentsModal(); });
  }

  async function openJobAssignmentsModal(jobId, jobName) {
    _jamJobId   = jobId;
    _jamJobName = jobName;
    _ensureJamModal();

    document.getElementById('jam-title').textContent = `Scope Pins — ${jobName}`;

    // Populate client dropdown
    const clientSel = document.getElementById('jam-add-client');
    const allClients = (typeof window.clients !== 'undefined' ? window.clients : []);
    clientSel.innerHTML = '<option value="">Any</option>' +
      allClients.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');

    // Populate EC dropdown
    const ecSel = document.getElementById('jam-add-ec');
    const allECs = (window.engineeringContractsCache || []);
    ecSel.innerHTML = '<option value="">Any</option>' +
      allECs.map(ec => `<option value="${ec.id}">${esc(ec.name)}</option>`).join('');

    const modal = document.getElementById('jam-modal');
    modal.style.display = 'flex';

    await _jamRefreshPins();
  }

  function closeJobAssignmentsModal() {
    const modal = document.getElementById('jam-modal');
    if (modal) modal.style.display = 'none';
    _jamJobId = _jamJobName = null;
  }

  async function _jamRefreshPins() {
    const listEl = document.getElementById('jam-pins-list');
    if (!listEl || !_jamJobId) return;
    listEl.innerHTML = '<div style="color:var(--text-muted);font-size:13px">Loading…</div>';
    try {
      const pins = await api('/api/jobs/' + _jamJobId + '/assignments');
      if (!pins.length) {
        listEl.innerHTML = '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px 0">' +
          'No pins — using the program heuristic for this job.</div>';
        return;
      }
      listEl.innerHTML = `<table style="width:100%;font-size:13px;border-collapse:collapse">
        <thead><tr style="color:var(--text-muted);font-size:11px;text-transform:uppercase">
          <th style="text-align:left;padding:4px 8px">Client</th>
          <th style="text-align:left;padding:4px 8px">Engineering Contract</th>
          <th style="text-align:left;padding:4px 8px">Team</th>
          <th></th>
        </tr></thead>
        <tbody>${pins.map(p => `
          <tr style="border-top:1px solid var(--border-weak)">
            <td style="padding:5px 8px">${p.client_name ? esc(p.client_name) : '<span style="color:var(--text-muted)">Any</span>'}</td>
            <td style="padding:5px 8px">${p.ec_name ? esc(p.ec_name) : '<span style="color:var(--text-muted)">Any</span>'}</td>
            <td style="padding:5px 8px">${p.team ? esc(p.team.charAt(0).toUpperCase() + p.team.slice(1)) : '<span style="color:var(--text-muted)">Any</span>'}</td>
            <td style="padding:5px 8px;text-align:right">
              <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)"
                      onclick="removeJobAssignmentPin('${p.id}')" title="Remove this pin">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>`).join('')}
        </tbody></table>`;
    } catch (e) {
      listEl.innerHTML = '<div style="color:var(--danger);font-size:13px">Failed to load pins.</div>';
    }
  }

  async function addJobAssignmentPin() {
    if (!_jamJobId) return;
    const clientId = document.getElementById('jam-add-client').value || null;
    const ecId     = document.getElementById('jam-add-ec').value     || null;
    const team     = document.getElementById('jam-add-team').value   || null;

    if (!clientId && !ecId && !team) {
      return alert('Select at least one of Client, Engineering Contract, or Team to add a pin.\n\nA pin with all three set to "Any" would be identical to having no pins at all.');
    }
    try {
      await api('/api/jobs/' + _jamJobId + '/assignments', 'POST', {
        client_id: clientId,
        engineering_contract_id: ecId,
        team
      });
      // Reset add-form selects
      document.getElementById('jam-add-client').value = '';
      document.getElementById('jam-add-ec').value     = '';
      document.getElementById('jam-add-team').value   = '';
      await _jamRefreshPins();
    } catch (e) {
      alert('Failed to add pin: ' + (e.message || 'unknown error'));
    }
  }

  async function removeJobAssignmentPin(pinId) {
    try {
      await api('/api/job-assignments/' + pinId, 'DELETE');
      await _jamRefreshPins();
    } catch (e) {
      alert('Failed to remove pin: ' + (e.message || 'unknown error'));
    }
  }

  window.renderJobsList = renderJobsList;
  window.setJobTeam = setJobTeam;
  window.setJobRate = setJobRate;
  window.setJobBillingType = setJobBillingType;
  window.resetJobOverride = resetJobOverride;
  window.setJobField = setJobField;
  window.setJobFlag = setJobFlag;
  window.propagateJobRate = propagateJobRate;
  window.updateRateLabel = updateRateLabel;
  window.saveNewJob = saveNewJob;
  window.deleteJob = deleteJob;
  window.openJobAssignmentsModal  = openJobAssignmentsModal;
  window.closeJobAssignmentsModal = closeJobAssignmentsModal;
  window.addJobAssignmentPin      = addJobAssignmentPin;
  window.removeJobAssignmentPin   = removeJobAssignmentPin;

  // ── SSE live-update hooks ──────────────────────────────────────────────────
  let _jobsStaleTimer = null;

  function _jobsSseRefresh() {
    clearTimeout(_jobsStaleTimer);
    _jobsStaleTimer = setTimeout(async () => {
      await loadJobs();
      renderJobsList();
    }, 500);
  }

  ['job_added', 'job_updated', 'job_deleted'].forEach(ev =>
    document.addEventListener('sse:' + ev, _jobsSseRefresh)
  );
})();
