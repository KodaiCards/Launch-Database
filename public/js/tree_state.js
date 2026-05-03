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

// Two singleton instances used across the admin app. New trees should
// allocate their own `makeTreeState()` instance — don't reuse these.
const projectsTreeState = makeTreeState('projects');
const hoursTreeState    = makeTreeState('hours');
