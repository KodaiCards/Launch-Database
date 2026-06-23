/* service_areas_filters.js — additive search + program filter for service-areas sidebar.
 * Does NOT modify service_areas_ui.js. Uses MutationObserver to re-apply filters
 * whenever the sidebar re-renders (after create/delete/load). */

(function () {
  'use strict';

  function applyFilters() {
    const q       = (document.getElementById('sa-search')?.value || '').toLowerCase().trim();
    const program = (document.getElementById('sa-filter-program')?.value || '').toLowerCase();
    const list    = document.getElementById('clientList');
    if (!list) return;

    list.querySelectorAll('.client-group').forEach(group => {
      let anyVisible = false;
      group.querySelectorAll('.sa-item').forEach(item => {
        const text  = item.textContent.toLowerCase();
        const badge = (item.querySelector('.badge')?.textContent || '').toLowerCase();
        const matchQ = !q || text.includes(q);
        const matchP = !program || badge === program || badge.startsWith(program);
        const show = matchQ && matchP;
        item.style.display = show ? '' : 'none';
        if (show) anyVisible = true;
      });
      group.style.display = anyVisible ? '' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const search  = document.getElementById('sa-search');
    const progSel = document.getElementById('sa-filter-program');
    if (search)  search.addEventListener('input', applyFilters);
    if (progSel) progSel.addEventListener('change', applyFilters);

    // Re-apply whenever the sidebar re-renders
    const list = document.getElementById('clientList');
    if (list) {
      new MutationObserver(applyFilters).observe(list, { childList: true, subtree: true });
    }
  });
})();
