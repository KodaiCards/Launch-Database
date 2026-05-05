// public/js/project_types.js — read-only program enum display.
//
// Phase 3b (2026-05-04): the project_types CRUD table was retired.
// Programs are now a fixed enum on engineering_contracts.program. This
// module renders the enum as informational chips (no delete buttons,
// no add form) so the existing Settings → Project Types panel still
// shows something meaningful when admin opens it. The add-form helper
// surfaces a clear message that programs are no longer admin-editable.
//
// Globals this module reads:
//   esc()                            — global helper
//
// Functions exposed on window:
//   renderProjectTypesList, saveNewProjectType, deleteProjectType

(function () {
  // Mirror the engineering_contracts.program enum + the migration's CHECK list.
  const PROGRAMS = [
    { code: 'rus',   label: 'RUS' },
    { code: 'bau',   label: 'BAU' },
    { code: 'gfr',   label: 'GF(R)' },
    { code: 'other', label: 'Other' },
  ];

  function renderProjectTypesList() {
    const root = document.getElementById('project-types-list-body');
    if (!root) return;
    root.innerHTML = `
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;line-height:1.5">
        Programs are now a fixed enum, not an admin-editable list. Set the program on each engineering contract via the Engineering Contracts panel above.
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${PROGRAMS.map(p => `
          <span title="program=${esc(p.code)}" style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;background:var(--primary-light);color:var(--primary);border-radius:14px;font-size:12px;font-weight:600">
            ${esc(p.label)}
          </span>
        `).join('')}
      </div>`;
  }

  function saveNewProjectType() {
    alert('Programs are a fixed enum (RUS / BAU / GF(R) / Other). Set the program on each engineering contract instead — see the Engineering Contracts settings panel.');
  }

  function deleteProjectType() {
    alert('Programs are a fixed enum and cannot be deleted.');
  }

  window.renderProjectTypesList = renderProjectTypesList;
  window.saveNewProjectType = saveNewProjectType;
  window.deleteProjectType = deleteProjectType;
})();
