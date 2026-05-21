# Admin Parent Project Picker Intent Verification

**Verifier:** READ-ONLY structural audit  
**Branch:** agent/parent-picker-intent-verify  
**Task:** Determine the intent of admin parent-project pickers and whether the Wave 5 fix (`leaves_only=true` filter) is correct.

---

## Per-Picker Intent Analysis

### Picker 1: `quickAddParent` (public/admin.html:3611)

**Code intent:**
- Creates a NEW project with `project_type: 'other'` (generic rollup folder)
- Passes it to POST `/api/projects` without explicit `parent_id`
- Then **re-populates** the parent dropdown and auto-selects the new project into `#proj-parent`
- The user can now pick any project from the dropdown to be the PARENT of future projects they add

**What should the dropdown show?**
- ALL projects (both rollups and leaves)
- The new folder just created should be visible and selectable as a parent
- Both rollup folders (Client, Team, Service Area) AND leaf projects are valid parents

**Verdict:** **INTENT-A** — Parent picker selects ANY project (rollup or leaf) to nest future projects under.

---

### Picker 2: `editProject` (public/admin.html:4242)

**Code intent:**
- When editing an existing project, loads that project's current data
- Calls `populateParentDropdown(id)` where `id` = the project being edited
- The function recursively builds a full hierarchy (both rollups and leaves) with indentation
- Excluded from the dropdown: the project being edited + all its descendants
- User can select ANY other project as the new parent

**Example workflow:**
- Edit "Job-001" (a leaf project under Design Team)
- Parent dropdown shows: Client → Design Team → Shared / Other → Job-002 → Job-003 (etc.)
- User can re-parent Job-001 under "Shared / Other" instead of Design Team
- User can also re-parent Job-001 under any other leaf project (weird but technically possible)

**Verdict:** **INTENT-A** — Parent picker selects ANY project (rollup or leaf) to nest the edited project under.

---

### Picker 3: `populateParentDropdown` (public/js/projects_tab.js:95-135)

**Code structure:**
```javascript
// Line 103: fetch ALL projects unfiltered
dropdownProjects = await api('/api/projects');

// Lines 122-124: build a map of parent→children and identify roots
childrenOf = {};
dropdownProjects.forEach(p => { if (p.parent_id) { (childrenOf[p.parent_id] = childrenOf[p.parent_id] || []).push(p); } });
roots = dropdownProjects.filter(p => !p.parent_id);

// Lines 126-134: recursively render the full tree with indentation
function addOptions(projects, depth) {
  for (const p of projects) {
    if (excluded.has(p.id)) continue;
    const indent = '   '.repeat(depth) + (depth > 0 ? '└ ' : '');
    pp.add(new Option(`${indent}${p.name} (${p.client_name || ''})`, p.id));
    addOptions(childrenOf[p.id] || [], depth + 1);  // recurse into children
  }
}
```

**Comment at line 94:**
> "Always fetches ALL projects (unfiltered) so new sub-projects appear immediately."

**Verdict:** Designed to show the full hierarchy. No filtering intended.

---

## Backend Validation

### POST /api/projects Handler (routes/projects.js:214-224)

```javascript
if (parent_id) {
  const parentCheck = await pool.query('SELECT id FROM projects WHERE id = $1', [parent_id]);
  if (!parentCheck.rows.length) {
    return res.status(400).json({ error: 'parent_id does not reference an existing project' });
  }
}
```

**Finding:** Backend validates that `parent_id` references a VALID project ID. There is NO restriction that the parent must be a rollup (`is_rollup=TRUE`). ANY project can be a parent.

### Auto-Nesting via `ensureRollupChain` (portal_module.js:72-176)

When `parent_id` is NOT explicitly provided, the system auto-creates a rollup chain:
- Client folder (rollup)
- Team folder (rollup) — Design/Permitting/Construction/Shared
- Service Area folder (rollup, optional)
- Project lands under this chain

When `parent_id` IS explicitly provided (admin manually picked one), the system respects that choice and skips auto-nesting.

**Finding:** Admin can override the auto-nesting by explicitly selecting a parent from the dropdown. No validation restricts the parent to rollups only.

---

## Wave 5 Fix Analysis

**What Wave 5 applied:**
- Added `?leaves_only=true` filter to `allProjects = await api('/api/projects')` in both `quickAddParent` and `editProject` workflows
- Changed `populateParentDropdown()` to fetch `/api/projects?leaves_only=true` instead of the unfiltered list
- Also changed `loadProjects()` in projects_tab.js to load leaves only for the main project-list table

**Effect:**
- Dropdown now shows ONLY leaf projects (projects where `is_rollup IS NOT TRUE`)
- All Client/Team/Service Area rollup folders are HIDDEN

**Consequence:**
- User cannot nest a project under a rollup folder (Client → Team → SA)
- User cannot create a new parent folder (quickAddParent creates the folder, but it won't appear in the dropdown to select it)
- Projects can only nest under other leaf projects — unusual and fragile

---

## VERDICT

### Admin Parent Picker Correctness

| Picker | Intent | Correct filter | Wave 5 filter | Verdict |
|---|---|---|---|---|
| `quickAddParent` | ANY project (rollup or leaf) | NONE (fetch all) | `leaves_only=true` | **INCORRECT** |
| `editProject` | ANY project (rollup or leaf) | NONE (fetch all) | `leaves_only=true` | **INCORRECT** |
| `populateParentDropdown` | Full hierarchy, all projects | NONE (fetch all) | `leaves_only=true` | **INCORRECT** |

**Recommendation: REVERT the `leaves_only=true` filter from the admin parent picker.**

---

## Why the Filter Was Wrong

The Wave 5 auditor likely **confused the admin parent picker with the timeclock project picker**. Both are project pickers, but with fundamentally different intents:

- **Timeclock picker (timeclock.html):** Selects a LEAF PROJECT to clock time against. Rollup folders don't accept hours, so filtering them out is correct.
- **Admin parent picker (admin.html):** Selects a PARENT PROJECT (any type) to nest the current project under. Rollup folders ARE valid parents.

### Timeclock picker (correct filtering):
- Should use `?leaves_only=true` ✓
- Only shows leaf projects
- User picks one to clock time against

### Admin parent picker (WRONG filtering):
- Should use NO filter (fetch all) ✓
- Shows full hierarchy (rollups + leaves)
- User picks a parent for nesting (can be rollup or leaf)

---

## Recommendation Summary

**ACTION: REVERT commit 6606abb changes to the admin parent picker.**

1. Remove `?leaves_only=true` from `quickAddParent()` — restore to `api('/api/projects')`
2. Remove `?leaves_only=true` from `editProject()` — restore to `api('/api/projects')`
3. Remove `?leaves_only=true` from `loadProjects()` in projects_tab.js — restore to `/api/projects?`
4. KEEP `?leaves_only=true` on the timeclock picker (`public/timeclock.html`), which is correct

**Files to revert:**
- `public/admin.html:3623` — quickAddParent
- `public/admin.html:4242` — editProject
- `public/js/projects_tab.js:line with loadProjects` — remove leaves_only from main table query

**Correct behavior after revert:**
- Admin parent picker shows full Client/Team/Service Area rollup hierarchy
- User can nest projects under rollups or other leaf projects (both valid)
- Admin can create a new parent folder and immediately see it available in the dropdown
- Timeclock clock-in picker remains filtered to leaves only (correct use case)

---

## Code Evidence

**quickAddParent stores to parent dropdown (admin.html:3626):**
```javascript
document.getElementById('proj-parent').value = p.id;
```
The newly created parent folder ID is stored; it must be fetchable to select it.

**editProject re-parents the project (admin.html:4244):**
```javascript
document.getElementById('proj-parent').value = p.parent_id || '';
```
The original parent (or any new parent from the dropdown) is set.

**populateParentDropdown builds full tree (projects_tab.js:131):**
```javascript
addOptions(childrenOf[p.id] || [], depth + 1);  // recurse into children of rollups too
```
The function walks ALL parent→child relationships, not just leaves.

**Backend accepts any parent (routes/projects.js:219):**
```javascript
if (parent_id) {
  const parentCheck = await pool.query('SELECT id FROM projects WHERE id = $1', [parent_id]);
```
No `is_rollup` check — ANY project ID is valid.

---

## End Verification

**Status:** READ-ONLY analysis complete  
**Finding:** Wave 5 admin parent picker filter is INCORRECT  
**Action:** REVERT — remove `?leaves_only=true` from admin pickers, keep it on timeclock only  
**Confidence:** HIGH — code intent and backend behavior both confirm admin pickers need full hierarchy
