// public/js/project_types.js — Project Types settings (chips + add).
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Renders project_types as removable chips inside the Settings modal.
// Add/delete are admin-only; existing projects keep their type when one
// is deleted (the API soft-flags active=false; the chip just stops
// showing up in new-project pickers).
//
// Globals this module reads:
//   api(), esc()                    — global helpers
//   projectTypesCache               — global cache loaded by loadProjectTypes()
//   loadProjectTypes()              — global loader
//   populatePricingFormDropdowns()  — re-populates Pricing form selects;
//                                     still inline because Pricing reads
//                                     both projectTypesCache + jobsCache
//   refreshSettingsDot()            — global helper
//
// Functions exposed on window:
//   renderProjectTypesList, saveNewProjectType, deleteProjectType

(function () {
  function renderProjectTypesList() {
    const root = document.getElementById('project-types-list-body');
    if (!root) return;
    const cache = (typeof projectTypesCache !== 'undefined' && projectTypesCache) ? projectTypesCache : [];
    if (!cache.length) { root.innerHTML = '<span style="color:var(--text-muted);font-size:12px">None.</span>'; return; }
    root.innerHTML = cache.map(pt => `
      <span style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;background:var(--primary-light);color:var(--primary);border-radius:14px;font-size:12px;font-weight:600">
        ${esc(pt.name)}
        <button onclick="deleteProjectType('${pt.id}','${esc(pt.name)}')" style="background:transparent;border:none;color:var(--primary);cursor:pointer;padding:0;font-size:14px;line-height:1">×</button>
      </span>
    `).join('');
  }

  async function saveNewProjectType() {
    const name = document.getElementById('new-pt-name').value.trim();
    if (!name) return alert('Name required');
    try {
      await api('/api/project-types', 'POST', { name });
      document.getElementById('new-pt-name').value = '';
      if (typeof loadProjectTypes === 'function') await loadProjectTypes();
      if (typeof populatePricingFormDropdowns === 'function') populatePricingFormDropdowns();
      renderProjectTypesList();
      if (typeof refreshSettingsDot === 'function') refreshSettingsDot();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function deleteProjectType(id, name) {
    if (!confirm(`Delete project type "${name}"?\n\nExisting projects keep their type. The type will just be hidden from new selections.`)) return;
    try {
      await api('/api/project-types/' + id, 'DELETE');
      if (typeof loadProjectTypes === 'function') await loadProjectTypes();
      if (typeof populatePricingFormDropdowns === 'function') populatePricingFormDropdowns();
      renderProjectTypesList();
      if (typeof refreshSettingsDot === 'function') refreshSettingsDot();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  window.renderProjectTypesList = renderProjectTypesList;
  window.saveNewProjectType = saveNewProjectType;
  window.deleteProjectType = deleteProjectType;
})();
