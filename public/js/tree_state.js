// public/js/tree_state.js — generic collapsible-tree state primitive.
//
// Replaces the bespoke `expandedRollups` (Projects + Dashboard + Revenue)
// and `expandedHrsKeys` (Hours) Sets that were each open-coding the same
// add/delete/has dance plus their own descendant-collapse helper. Now
// every consumer goes through the same shape; adding a new tree-shaped
// view is one `makeTreeState('foo')` call.
//
// API:
//   const state = makeTreeState('projects');
//   state.toggle(id)            → flips and returns new isExpanded
//   state.expand(id)            → mark expanded
//   state.collapse(id)          → mark collapsed
//   state.expandAll(ids)        → bulk expand (used by "Expand all")
//   state.collapseAll(ids)      → bulk collapse (used when collapsing a
//                                 parent, also collapse its descendants
//                                 so we don't end up with orphaned
//                                 grand-children showing)
//   state.collapseChildren(key) → collapse any tracked id that starts
//                                 with `key + '-'`. Used by Hours where
//                                 keys are hierarchy paths like
//                                 'jane-2026-04', 'jane-2026-04-WO123'.
//   state.isExpanded(id)        → boolean lookup
//   state.clear()               → collapse everything
//   state.keys()                → snapshot Array of currently-expanded ids
//
// `name` is purely diagnostic — useful when we eventually add localStorage
// persistence keyed by it, or for console-debugging.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.3.

function makeTreeState(name) {
  const expanded = new Set();
  return {
    name,
    toggle(id) {
      if (expanded.has(id)) { expanded.delete(id); return false; }
      expanded.add(id); return true;
    },
    expand(id) { expanded.add(id); },
    collapse(id) { expanded.delete(id); },
    expandAll(ids) { for (const id of ids) expanded.add(id); },
    collapseAll(ids) { for (const id of ids) expanded.delete(id); },
    collapseChildren(parentKey) {
      const childPrefix = parentKey + '-';
      for (const k of expanded) {
        if (k.startsWith(childPrefix)) expanded.delete(k);
      }
    },
    isExpanded(id) { return expanded.has(id); },
    clear() { expanded.clear(); },
    keys() { return [...expanded]; },
  };
}

// Singleton instances used across the admin app. New trees should
// allocate their own `makeTreeState()` instance — don't reuse these.
const projectsTreeState       = makeTreeState('projects');
const hoursTreeState          = makeTreeState('hours');
const billingHistoryTreeState = makeTreeState('billing-history');
// Revenue tree gets its own instance so expand/collapse in the Revenue tab
// does not bleed into the Projects or Dashboard trees (H-8 fix).
const revenueTreeState        = makeTreeState('revenue');

// Shared chevron-toggle for the three project-tree views (Projects,
// Dashboard, Revenue) that all reuse projectsTreeState. Each view picks
// its own DOM prefixes so two trees can co-exist on the same page
// without their CSS classes / chevron ids colliding.
//
// Returns a function with the same signature each tab was using before
// (projectId, groupKey, chevId). Behavior:
//   - Flip state in projectsTreeState.
//   - On collapse, cascade-collapse every descendant in projectsTreeState
//     (looked up via the global `allProjects` cache, same as the inline
//     versions did) so a re-render doesn't leave orphan-expanded grandkids.
//   - Apply the visual change to currently-rendered rows so the click
//     feels immediate, ahead of the next polling re-render.
//
// Config:
//   state            — required, usually projectsTreeState.
//   chevIdPrefix     — e.g. 'pc-' (project), 'dc-' (dashboard), 'rc-' (revenue).
//   groupKeyPrefix   — e.g. 'pt-', 'dt-', 'rv-'. Must match the prefix used
//                      when rendering the rows.
//   rowClassPrefix   — e.g. 'ptree-', 'dtree-', 'rtree-'. The class on every
//                      child row, suffixed with the parent's groupKey.
function makeTreeToggle({ state, chevIdPrefix, groupKeyPrefix, rowClassPrefix }) {
  return function treeToggle(projectId, groupKey, chevId) {
    const wasExpanded = state.isExpanded(projectId);
    if (wasExpanded) {
      state.collapse(projectId);
      // Cascade-collapse descendants. Reads window.allProjects (the cache
      // populated by loadProjects); when not present, the cascade is a
      // no-op and the next re-render still does the right thing because
      // the parent itself is collapsed.
      const list = (typeof allProjects !== 'undefined' && allProjects) ? allProjects : [];
      const collectDescendants = (parentId, acc) => {
        list.filter(p => p.parent_id === parentId).forEach(c => {
          acc.add(c.id);
          collectDescendants(c.id, acc);
        });
      };
      const descs = new Set();
      collectDescendants(projectId, descs);
      state.collapseAll([...descs]);
    } else {
      state.expand(projectId);
    }

    // Immediate visual feedback on rows already in the DOM. The next
    // re-render rebuilds from state and will be consistent regardless.
    const rows = document.querySelectorAll('.' + rowClassPrefix + groupKey);
    const chev = document.getElementById(chevId);
    rows.forEach(r => {
      r.style.display = wasExpanded ? 'none' : 'table-row';
      if (wasExpanded) {
        const nestedChevs = r.querySelectorAll('[id^="' + chevIdPrefix + '"]');
        nestedChevs.forEach(nc => {
          nc.style.transform = 'rotate(0deg)';
          const nestedKey = groupKeyPrefix + nc.id.slice(chevIdPrefix.length);
          document.querySelectorAll('.' + rowClassPrefix + nestedKey).forEach(n => {
            n.style.display = 'none';
          });
        });
      }
    });
    if (chev) chev.style.transform = wasExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
  };
}
