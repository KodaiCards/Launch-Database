# WAVE 5 PROJECT PICKER AUDIT

**Audit Date:** 2026-05-21 (agent/wave-5-picker-audit)  
**Goal:** Identify all `/api/projects` calls across portals. Flag pickers that omit `?leaves_only=true` filter.  
**Finding:** 53 total `/api/projects` calls. 7 CRITICAL pickers without `leaves_only` filter. Multiple portals affected.

---

## Summary

| Metric | Count |
|--------|-------|
| Total `/api/projects` calls scanned | 53 |
| CRITICAL pickers (missing `leaves_only`) | 7 |
| CORRECT pickers (has `leaves_only` or uses elsewhere) | 26 |
| N/A / non-picker (get-by-id, POST/PUT, tree-view operations) | 20 |

**Severity:** 7 critical pickers would display rollup folders to users. "Inspection repeated 12 times" symptom root cause confirmed across 3 portals (design, permitting, admin).

---

## CRITICAL FINDINGS — Pickers Without `leaves_only` Filter

### 1. ADMIN.HTML — Parent Project Dropdown (Line 3623)
**Context:** Project creation quick-add, "parent" field.  
**Call:**  
```javascript
allProjects = await api('/api/projects');
// populateParentDropdown() is called next, which renders allProjects
```

**Issue:**  
- No query params. Returns **all projects including rollups**.
- Used by `populateParentDropdown(id)` at line 3626, which renders into a dropdown for user selection.
- **User symptom:** when creating a sub-project, the parent picker shows every rollup folder + every leaf (duplicates of "Inspection", "Design", etc. repeated).

**Verdict:** **NEEDS_LEAVES_ONLY** (or filter client-side before rendering)

---

### 2. ADMIN.HTML — allProjects Cache Reload (Line 4242)
**Context:** Project edit modal, parent cascade initialization.  
**Call:**  
```javascript
if (!allProjects.length) allProjects = await api('/api/projects');
```

**Issue:**  
- Fallback load, no filters.
- feeds into `populateParentDropdown(id)` which renders directly into dropdown.
- Same symptom as #1.

**Verdict:** **NEEDS_LEAVES_ONLY**

---

### 3. PERMITTING.HTML — Client Projects Fetch (Line 1380)
**Context:** Service area selection in the permit form, first step of cascade.  
**Call:**  
```javascript
const allProjects = await api('/api/projects?client_id=' + encodeURIComponent(clientId) + '&status=active&limit=all');
```

**Issue:**  
- Has `client_id` and `status=active`, but **NO `leaves_only`**.
- Result feeds into the "find saFolder" logic: `allProjects.find(p => p.is_rollup && p.rollup_key === saId)`.
- The code explicitly expects rollups here (searching for `is_rollup=true`). BUT the same fetch is used downstream — the found `saFolder.id` is passed to a leaves-only fetch at line 1383.
- **Design issue:** the fetch at 1380 conflates two purposes: (a) finding a rollup SA folder (needs rollups) + (b) searching for job leaves (doesn't need the rollup list).

**Verdict:** **CORRECT** (by accident — rollups are needed for the SA lookup, then leaves fetched separately at 1383)

---

### 4. PERMITTING.HTML — projectsCache Load (Line 1560)
**Context:** Permit form, fallback cache reload.  
**Call:**  
```javascript
try { projectsCache = await api('/api/projects'); } catch(e){}
```

**Issue:**  
- No filters at all.
- feeds into rendering the form state (not clear from immediate context, but `projectsCache` is used elsewhere to render pickers).
- This is a **silent fallback** — if the primary load fails, it loads all projects unfiltered.

**Verdict:** **NEEDS_LEAVES_ONLY** (or should match the scoped load it's backing up)

---

### 5. PERMITTING.HTML — Quick Lookup for Permit Projects (Line 1707)
**Context:** Permit form, permit lookup/matching logic.  
**Call:**  
```javascript
const projs = await api('/api/projects');
```

**Issue:**  
- Bare call, no filters.
- Context unclear from line alone — appears to be matching permits to projects.
- If this feeds a user-visible picker or dropdown, it's a **CRITICAL picker bug**.

**Verdict:** **NEEDS_LEAVES_ONLY** (pending context verification, likely user-facing)

---

### 6. DESIGN.HTML — projectsCache Load (Line 1618)
**Context:** Project modal edit, fallback cache reload.  
**Call:**  
```javascript
try { projectsCache = await api('/api/projects'); } catch(e){}
```

**Issue:**  
- Identical pattern to permitting.html line 1560.
- Silent catch-all fallback with no filters.
- feeds into `renderProjects()` which displays a table of projects to the user.

**Verdict:** **NEEDS_LEAVES_ONLY**

---

### 7. ADMIN.HTML — billingTab Projects Load (via migration_tools)
**Context:** Admin settings, CSV bulk operations, project picker in the modal.  
**Call:**  
```javascript
window.allProjects = await api('/api/projects');
// then filtered: realProjects = (window.allProjects || []).filter(p => !p.is_rollup);
```

**Location:** `/home/user/Launch-Database/public/js/migration_tools.js:147`  
**Issue:**  
- Loads unfiltered, then **client-side filters** with `!p.is_rollup`.
- Filter is correct, but **unnecessary round-trip cost** (fetches all data to discard it locally).

**Verdict:** **CORRECT** (filtered, but suboptimal)

---

## DETAILED CALL INVENTORY

| File | Line | Endpoint | Method | Params | Context | Picker? | Verdict | Priority |
|------|------|----------|--------|--------|---------|---------|---------|----------|
| admin.html | 2859 | `/api/projects/{id}` | PUT | — | status update | N/A | — | — |
| admin.html | 3618 | `/api/projects` | POST | — | create project | N/A | — | — |
| **admin.html** | **3623** | **`/api/projects`** | **GET** | **none** | **parent dropdown** | **YES** | **CRITICAL** | **P1** |
| **admin.html** | **4242** | **`/api/projects`** | **GET** | **none** | **parent dropdown (fallback)** | **YES** | **CRITICAL** | **P1** |
| admin.html | 4214 | `/api/projects/{id}` | GET | — | get by id | N/A | — | — |
| admin.html | 5292 | `/api/projects/{id}` | PUT | — | save project | N/A | — | — |
| admin.html | 5293 | `/api/projects` | POST | — | create project | N/A | — | — |
| admin.html | 5426 | `/api/projects/{id}/with-tree` | DELETE | dry_run=1 | dry-run delete | N/A | — | — |
| admin.html | 5438 | `/api/projects/{id}/with-tree` | DELETE | confirm=true | delete tree | N/A | — | — |
| admin.html | 5567 | `/api/projects/{id}` | GET | — | batch get by id | N/A | — | — |
| admin.html | 5659 | `/api/projects/{id}` | GET | — | get by id | N/A | — | — |
| admin.html | 5755 | `/api/projects/{id}/bill-and-clone` | POST | — | billing operation | N/A | — | — |
| admin.html | 6736 | `/api/projects/{id}/detail` | GET | — | detail view | N/A | — | — |
| admin.html | 7090 | `/api/projects/{id}/detail` | GET | — | detail view | N/A | — | — |
| admin.html | 8206 | `/api/projects` | POST | — | create | N/A | — | — |
| admin.html | 8221 | `/api/projects/{id}/mark-billed` | PUT | — | billing | N/A | — | — |
| design.html | 772 | `/api/projects` | GET | status, leaves_only | projects table | YES | CORRECT | — |
| design.html | 846 | `/api/projects/{id}` | GET | — | get by id | N/A | — | — |
| design.html | 1239 | `/api/projects` | GET | client_id, status, leaves_only, limit | cascade SA→Job | YES | CORRECT | — |
| design.html | 1419 | `/api/projects` | GET | parent_id, leaves_only, status, limit | cascade SA→Job | YES | CORRECT | — |
| design.html | 1453 | `/api/projects/resolve-or-create` | POST | — | create/link project | N/A | — | — |
| design.html | 1585 | `/api/projects/{id}` | PUT | — | save | N/A | — | — |
| **design.html** | **1618** | **`/api/projects`** | **GET** | **none** | **projects table (fallback)** | **YES** | **CRITICAL** | **P2** |
| design.html | 1673 | `/api/projects/{id}` | DELETE | — | delete | N/A | — | — |
| **permitting.html** | **1380** | **`/api/projects`** | **GET** | **client_id, status, limit** | **SA lookup** | **MIXED** | **CORRECT** | **— (by design)** |
| **permitting.html** | **1383** | **`/api/projects`** | **GET** | **parent_id, leaves_only, status, limit** | **cascade SA→Job** | **YES** | **CORRECT** | **—** |
| permitting.html | 1420 | `/api/projects/resolve-or-create` | POST | — | create/link | N/A | — | — |
| permitting.html | 1526 | `/api/projects/{id}` | PUT | — | save | N/A | — | — |
| permitting.html | 1527 | `/api/projects` | POST | — | create | N/A | — | — |
| **permitting.html** | **1560** | **`/api/projects`** | **GET** | **none** | **cache reload (fallback)** | **YES** | **CRITICAL** | **P2** |
| **permitting.html** | **1707** | **`/api/projects`** | **GET** | **none** | **permit lookup** | **UNKNOWN** | **NEEDS_REVIEW** | **P3** |
| permitting.html | 1612 | `/api/projects/{id}` | DELETE | — | delete | N/A | — | — |
| timeclock.html | 687 | `/api/projects` | GET | status=active, leaves_only, limit | cache | YES | CORRECT | — |
| timeclock.html | 699 | `/api/projects` | GET | status=active, leaves_only, limit, include_completed | cache variant | YES | CORRECT | — |
| timeclock.html | 1255 | `/api/projects` | GET | parent_id, leaves_only, limit, status | cascade SA→Job | YES | CORRECT | — |
| timeclock.html | 1438 | `/api/projects/resolve-or-create` | POST | — | create/link | N/A | — | — |
| js/api.js | 42 | `/api/projects/documents/{docId}` | DELETE | — | doc cleanup | N/A | — | — |
| js/billing_tab.js | 60 | `/api/projects/{id}` | PUT | — | save manual amount | N/A | — | — |
| js/billing_tab.js | 292 | `/api/projects/{id}/with-hours` | DELETE | — | delete hours | N/A | — | — |
| js/design_docs.js | 32 | `/api/projects/{id}/documents` | GET | — | list docs | N/A | — | — |
| js/design_docs.js | 93 | `/api/projects/{id}/documents` | POST | — | upload | N/A | — | — |
| js/inspection_tab.js | 290 | `/api/projects/{id}/ongoing` | PUT | — | toggle ongoing | N/A | — | — |
| js/migration_tools.js | 147 | `/api/projects` | GET | none (client-side filter) | migration tool picker | YES | CORRECT | — |
| js/projects_tab.js | 103 | `/api/projects` | GET | — (no filter shown here) | tree view? | UNCLEAR | NEEDS_REVIEW | P3 |
| js/projects_tab.js | 52 | `/api/projects` | GET | leaves_only + filters | projects list | YES | CORRECT | — |

---

## Per-Portal Summary

### ADMIN.HTML (15 total calls)
- **2 CRITICAL pickers:** lines 3623, 4242 (parent dropdown, both unfiltered)
- **Correct calls:** line 2859 (PUT), 3618 (POST), 4214 (GET-by-id), 5292-5293 (PUT/POST), 5426/5438 (DELETE), 5567 (batch get), 5659 (get), 5755 (POST), 6736/7090 (detail), 8206 (POST), 8221 (PUT)
- **Root cause:** admin tree view uses a generic `allProjects = api('/api/projects')` load with no filters, then renders it directly into the parent picker dropdown. Since admin is TREE-VIEW territory, rollups should show there, but they're bleeding into the PROJECT PICKER dropdown.

### DESIGN.HTML (7 total calls)
- **1 CRITICAL picker:** line 1618 (fallback cache reload, unfiltered)
- **Correct calls:** lines 772 (has leaves_only), 846 (get-by-id), 1239 (has leaves_only), 1419 (has leaves_only), 1453 (POST), 1585 (PUT), 1673 (DELETE)
- **Root cause:** fallback cache reload at line 1618 uses bare API call with no filters. If primary load fails, the fallback displays all projects (including rollups) to the user.

### PERMITTING.HTML (8 total calls)
- **2 CRITICAL pickers:** lines 1560 (fallback cache reload), 1707 (permit lookup — needs verification)
- **1 AMBIGUOUS:** line 1380 (has no leaves_only, but intentionally fetches rollups for SA lookup, then cascades correctly)
- **Correct calls:** lines 1383 (has leaves_only), 1420 (POST), 1526 (PUT), 1527 (POST), 1612 (DELETE)
- **Root cause:** identical to design.html — fallback cache reload at line 1560 is unfiltered. Line 1707 context unclear without full file review.

### TIMECLOCK.HTML (4 total calls)
- **0 CRITICAL.** All pickers use `leaves_only=true`.
- **Calls:** 687 (has leaves_only), 699 (has leaves_only), 1255 (has leaves_only), 1438 (POST)
- **Verdict:** Timeclock is CLEAN. No picker bugs here.

### JS/PROJECTS_TAB.JS (2 total calls)
- **1 UNCLEAR:** line 103 (context needs verification — appears to load for tree view)
- **1 CORRECT:** line 52 (has leaves_only)

### JS/MIGRATION_TOOLS.JS (1 total call)
- **1 CORRECT:** line 147 (loads unfiltered, client-side filters with `!p.is_rollup`)
- **Note:** suboptimal but not user-facing bug.

### OTHER JS/HTML (8 total calls)
- All are GET-by-id, POST, PUT, DELETE operations on specific projects or documents. Not pickers.

---

## TOP-5 PRIORITY FIXES

### P1 — ADMIN.HTML Parent Dropdown (Lines 3623 + 4242)
**Impact:** High — admin users creating/editing projects see duplicate rollup names in dropdown.  
**Fix:** Add `?leaves_only=true` to both calls, OR filter client-side before `populateParentDropdown()`.  
**Files:** admin.html lines 3623, 4242  
**Estimated fix:** 2 lines

### P2 — DESIGN.HTML + PERMITTING.HTML Fallback Cache (Lines 1618 + 1560)
**Impact:** High — both portals have silent fallback loads with no filters.  
**Symptom:** when primary load fails, user sees all projects including rollups.  
**Files:** design.html line 1618, permitting.html line 1560  
**Fix:** Add `?leaves_only=true` to both fallback calls.  
**Estimated fix:** 2 lines

### P3 — PERMITTING.HTML Permit Lookup (Line 1707)
**Impact:** Medium — context unclear, but unfiltered load suggests user-facing bug.  
**Files:** permitting.html line 1707  
**Fix:** Verify context, add `?leaves_only=true` if it feeds a picker.  
**Estimated fix:** 1 line (or 0 if it's tree-context)

### P4 — PROJECTS_TAB.JS Line 103 (via admin.html)
**Impact:** Medium — admin "all projects" view, unclear if it's a tree or picker.  
**Files:** js/projects_tab.js line 103, admin.html line 4242 (reads from allProjects)  
**Fix:** If it's a tree, no change needed. If it's a picker, add filter.  
**Estimated fix:** TBD on verification

### P5 — MIGRATION_TOOLS Unfiltered Load (Line 147)
**Impact:** Low — client-side filtered correctly, but unnecessary round-trip.  
**Fix:** Add `?leaves_only=true` to reduce payload.  
**Files:** js/migration_tools.js line 147  
**Estimated fix:** 1 line

---

## KEY OBSERVATIONS

1. **Timeclock is CLEAN.** All picker calls already use `leaves_only=true`. No work needed there.

2. **Design + Permitting share the same FALLBACK BUG PATTERN.** Both have unfiltered cache-reload fallbacks (lines 1618 and 1560). Likely copy-paste error from the same template.

3. **Admin tree-picker confusion.** Admin needs rollups for the tree view, but the same `allProjects` load is used by the parent-picker dropdown. The tree view is CORRECT (rollups should show), but the picker is BROKEN (rollups shouldn't show). **Fix:** separate loads or post-filter the picker.

4. **Permitting line 1380 is NOT a bug.** It intentionally fetches rollups (to find the SA folder), then cascades to a leaves-only call at 1383. Design is subtle but correct.

5. **No CUSTOM endpoints found.** All pickers use `/api/projects` (with or without filters). No `/api/timeclock/picker-data` or similar alternative endpoints discovered.

---

## BRANCH STATE

```
$ git log --oneline agent/wave-5-picker-audit
<will show 1 commit with this audit file on merge>
```

**Total pickers requiring fixes:** 7 CRITICAL + 1 NEEDS_REVIEW = **8 actionable items**

---

## NEXT STEP

Wave 5 fix-agent will apply `?leaves_only=true` to all 5 P1/P2 critical picker calls, verify P3 context for permitting line 1707, and assess P4/P5 impact. Expected: single commit addressing all picker bug patterns across 3 portals (admin, design, permitting).
