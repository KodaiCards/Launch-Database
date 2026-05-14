# Wave 3 FE-A11y Fix-B — Label Linkage Fix Report

> **Scope:** H-6 + M-3 (form label linkage across all portals and JS modules)
> **Items addressed:** H-6 (admin.html 171 lacking, splice.html 105 lacking) + M-3 (highest-traffic subsets)
> **Approach:** Case A (add `for=` to sibling label), Case B (add `for=` + `id=`), Case C (`aria-label=` for standalone / dynamic-ID controls)

---

## Per-file counts

| File | Before (unlabeled) | After (unlabeled) | Fixes applied |
|---|---|---|---|
| `public/timeclock.html` | 5 | 0 | 5 (3× `for=` on sibling labels, 2× `aria-label=` on filter/scroll controls) |
| `public/permitting.html` | ~18 | 1 (CSS comment FP) | ~17 (mix of `for=`, `aria-label=` on filter shims) |
| `public/design.html` | ~22 | 1 (CSS comment FP) | ~21 (same pattern as permitting + design-only potential permit form) |
| `public/admin.html` | 171 | 10 (all FP/accessible) | ~162 (all dashboard/hours/billing/revenue/AI filters, all modal form fields, all dynamic template rows) |
| `public/splice.html` | 111 | 1 (multi-line label wrapper FP) | ~110 (style editor labels, matrix toolbar, all modal forms, dynamic template rows, comment inputs) |
| `public/js/bulk_bill_modal.js` | 3 | 0 | 3 (`for=` on invoice number, date, name) |
| `public/js/clients_settings.js` | 4 | 0 | 4 (`aria-label=` on flag checkboxes, inline edit inputs) |
| `public/js/construction_contracts.js` | 4 | 0 | 4 (`aria-label=` on inline edit table row inputs) |
| `public/js/engineering_contracts.js` | 14 | 0 | 14 (`aria-label=` on SA/WO add + edit inline inputs) |
| `public/js/jobs_settings.js` | 10 | 0 | 10 (`aria-label=` on inline table cells, `for=` on jam-add-* selects) |
| `public/js/migration_tools.js` | 2 | 0 | 2 (`aria-label=` on orphan project selects) |
| `public/js/projects_tab.js` | 1 | 0 | 1 (`aria-label=` on bulk-row checkbox) |

**Total fixes: ~253 inputs across 12 files**

---

## Commits

| SHA | Files | Changes |
|---|---|---|
| `42acb7a` | `public/timeclock.html`, `public/permitting.html`, `public/design.html`, `public/admin.html` | timeclock (5), permitting (~17), design (~21), admin (~162) fixes |
| `e1190bc` (post-rebase: `e1190bc`) | `public/splice.html`, `public/js/bulk_bill_modal.js`, `public/js/clients_settings.js`, `public/js/construction_contracts.js`, `public/js/engineering_contracts.js`, `public/js/jobs_settings.js`, `public/js/migration_tools.js`, `public/js/projects_tab.js` | splice (~110) + 7 JS modules (38) |

---

## Fix patterns used

### Case A — sibling `<label>` without `for=`
Added `for="<id>"` to the label element. Used for all static modal form fields where the label and input are adjacent (e.g., `<label>Project *</label><input id="ci-project">`).

### Case B — input with no ID, sibling label exists
Generated stable ID from semantic context, added both `id=` and `for=`. Used rarely — most unlabeled elements already had IDs.

### Case C — no associated label text (standalone controls)
Added `aria-label="<descriptive text>"`. Used for:
- Filter toolbar controls (matrix-filter-text, matrix-filter-closure, etc.)
- Dynamic template rows where IDs contain `${variable}` and can't be referenced by `for=`
- Inline table edit cells (jobs_settings, engineering_contracts, etc.)
- Comment textareas in splice inspector panels

---

## False positives / already-accessible (not fixed)

| Location | Reason |
|---|---|
| `admin.html` L155, `permitting.html` L83, `design.html` L84 | CSS comment text containing `<select>` — not real HTML elements |
| `admin.html` L1484, L2025/2028/2031, L5255, L5796, L7519 | Checkboxes inside multi-line `<label>` wrappers — already accessible via wrapping label |
| `admin.html` L6890, L6899 | Dynamic IDs `ovr-team-${sr.id}` / `ovr-rate-${sr.id}` — have matching `<label for=...>` already; script couldn't verify dynamic match |
| `splice.html` L848 | `matrix-select-all` checkbox inside `<label>...Select all</label>` — multi-line wrapper, already accessible |

---

## Scope compliance

- H-1 (modal focus management): NOT touched — Fix-A scope
- H-7 (splice fiber grid keyboard nav): NOT touched — Fix-D scope
- H-8 (contrast): NOT touched — Fix-C scope
- Input behavior: unchanged — only `for=`/`id=`/`aria-label=` attributes added
- No functional code altered

=== FIX REPORT B LABELS END ===
