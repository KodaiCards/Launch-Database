# Side-channel audit: claude/add-audit-log-hours-x0XCd

## Stack snapshot (≤80 words)

Branch `claude/add-audit-log-hours-x0XCd` was authored against the old `public/index.html` monolith architecture (pre-PR #43). Current `main` has been fundamentally rearchitected: `public/index.html` is gone, replaced by `public/admin.html` (8,498 lines); `routes/ai.js` has grown from ~1,772 to ~2,730 lines with rate limiting, nudge detection, and expanded tool coverage. Every substantive code change in these 10 commits is either IDENTICAL in main or SUPERSEDED by a more advanced version.

---

## Per-commit audit (10 rows)

| SHA | Title | Files | Real fix? | Risk if merged | Conflict potential | Recommendation |
|---|---|---|---|---|---|---|
| `e0c7650` | Add SESSION_HANDOFF.md | SESSION_HANDOFF.md | Docs only — historical context for an old branch state | None (additive doc) | None (file absent from main) | SCRAP — references `public/index.html` monolith, PR #43 pre-merge state, fabricated SHAs. Obsolete as of 2026-05-15 reality reconciliation. |
| `0553c21` | Add shared openOverlayModal helper, dedupe 4 dynamic-overlay callers | public/index.html, public/js/bulk_bill_modal.js, public/js/hours_tab.js, public/js/overlay_modal.js | Real refactor — extracted duplicated modal scaffolding | HIGH if merged — targets `public/index.html` which no longer exists in main | Immediate hard conflict (`public/index.html` absent; `overlay_modal.js` already at same content in main) | SCRAP — `public/js/overlay_modal.js` is identical in main. The `index.html` callers were migrated to `admin.html` during the rearchitecture. No value to merge. |
| `4ffcd95` | Address /simplify deferrals: tree-toggle factory + UX consistency + N+1 | public/index.html, public/js/dashboard_views.js, public/js/permits_tab.js, public/js/projects_tab.js, public/js/revenue_tab.js, public/js/tree_state.js | Real refactor — consolidated 3 near-identical tree-toggle functions into `makeTreeToggle` factory | HIGH if merged — targets `public/index.html`; main's `tree_state.js` is a SUPERSET of branch's (adds `billingHistoryTreeState` + `revenueTreeState`, richer comments) | Hard conflict on `index.html`; functional regression risk on `tree_state.js` if merged (would DOWNGRADE to older 2-state version) | SCRAP — main's `tree_state.js` already has `makeTreeToggle` AND more tree instances. Merging this would downgrade state management. |
| `f80dc04` | Code review pass: fix regression risk + dedupe + remove dead code | public/index.html, public/js/api.js, public/js/design_docs.js, public/js/hours_tab.js, public/js/permits_tab.js, routes/ai.js, tests/ai_user_wants_action.test.js | Mixed — some real fixes (deleteProjectDoc helper) + ai.js tightening | HIGH if merged — `routes/ai.js` in main is ~960 lines larger with rate limiting, nudge detection, expanded userWantsAction regex; merging branch version would be a massive downgrade | Hard conflict on ai.js (branch=1,772 lines vs main=2,730 lines); index.html absent | SCRAP — the `deleteProjectDoc` helper already exists in main's `public/js/api.js`. The ai.js changes are superseded by far more advanced work in main. |
| `3764160` | Tests: schema-shape smoke test | tests/schema_shape.test.js | Real test — 7 assertions on bootstrap table/column shape | None | IDENTICAL content in main (diff confirmed zero bytes differ) | SCRAP — already in main, byte-for-byte identical. |
| `7adfa14` | AI: clean 503 when ANTHROPIC_API_KEY missing | routes/ai.js | Real UX fix — actionable error vs generic SDK error | HIGH if merged — would downgrade ai.js to 1,781 line version | Same hard ai.js conflict | SCRAP — 503 clean error already present in main's `routes/ai.js` (confirmed at line 2373–2376). |
| `196b45f` | NEXT_STEPS.md: prune stale items, refresh smoke list | NEXT_STEPS.md | Docs only — historical task list for old architecture | None (additive doc) | None (file absent from main) | SCRAP — references old architecture, pre-rearchitecture roadmap. Replaced by CLAUDE.md §4 wave queue. |
| `d709c4b` | HANDOFF.md: refresh known-issues section | HANDOFF.md | Docs only — old-architecture handoff state | None | DIFFER — main's HANDOFF.md is the current canonical doc (updated 2026-05-15, references PR #43, main branch, corrected SHAs). Branch version is from 2026-05-03, pre-merger. | SCRAP — branch HANDOFF.md is obsolete. Main's version is accurate and current. Merging would corrupt the live handoff doc. |
| `c1107e9` | Untrack package-lock.json | .gitignore, package-lock.json | Real housekeeping — removes 4,250-line noise file | None | `package-lock.json` already excluded in main's `.gitignore` (confirmed) | SCRAP — already done in main. |
| `471e01d` | AI: unit-test userWantsAction classifier (10 cases) | package-lock.json, routes/ai.js, tests/ai_user_wants_action.test.js | Real tests — 10 unit cases for pure function | HIGH if merged — would downgrade ai.js; brings back package-lock.json briefly | `tests/ai_user_wants_action.test.js` IDENTICAL in main (diff confirmed zero bytes differ); ai.js hard conflict | SCRAP — test file already in main. The ai.js change in this commit is the version main evolved FROM. |

---

## SESSION_HANDOFF.md highlights

The SESSION_HANDOFF.md describes state as of **2026-05-04** — PR #8 merged into main after a hung CI run. Key context documented there:

- CI was broken by a `schema.sql` forward-reference FK issue (fixed in `26b7997`) — ALREADY in main
- AI tool_choice='any' + `userWantsAction` classifier added — ALREADY in main  
- `makeTreeToggle` factory + `openOverlayModal` helper — ALREADY in main
- `schema_shape.test.js` — ALREADY in main
- Playwright CI step was hanging (not a code-quality issue) — main has since added proper Playwright setup

The document's "What's NOT verified — owner needs to spot-check" list describes features that were subsequently verified and built upon in the main-branch rearchitecture. The spot-check items (chevron tree, hours tile drilldown, permits delete, etc.) have all been addressed in the 100+ commits that followed this branch.

---

## Conflict assessment

This branch has **no merge base with current `main`** — `git merge-base` returns empty. The two histories diverged when `main` merged PR #43 (which brought in a completely rearchitected codebase with `admin.html` replacing the `index.html` monolith).

**Hard conflicts if merge attempted:**
- `public/index.html` — exists only on branch (6,745 lines); main has no such file. Git would add it back as a new file, immediately breaking the portal launcher architecture.
- `routes/ai.js` — branch=1,772 lines; main=2,730 lines. Every branch change is at an earlier evolutionary state. Merge would introduce hundreds of conflicting hunks.
- `public/js/tree_state.js` — branch has 2 tree instances; main has 4. Merge would downgrade state management.
- `public/js/hours_tab.js` — branch=610 lines; main=726 lines. Main has additional features (unbilled hours panel, etc.).
- `HANDOFF.md` — branch version is 2026-05-03 pre-architecture; main version is 2026-05-15 post-reconciliation. Merging would corrupt current live handoff.

**No conflicts on:**
- `tests/schema_shape.test.js` — identical, but there's nothing to merge.
- `tests/ai_user_wants_action.test.js` — identical, nothing to merge.
- `public/js/overlay_modal.js` — identical, nothing to merge.
- `.gitignore` — `package-lock.json` entry already present in main.

---

## Final recommendation

**SCRAP**

All 10 commits are either (a) already present in main with identical or superior content, or (b) built against an obsolete architecture (`public/index.html` monolith) that no longer exists. There is no cherry-pickable value — every real code change (503 error, userWantsAction tests, overlay helper, tree-toggle factory, schema_shape tests, package-lock exclusion) was already propagated into main through the PR merge history. The only files unique to the branch (`SESSION_HANDOFF.md`, `NEXT_STEPS.md`) are historical docs describing an architecture that was superseded by PR #43. Merging this branch would introduce hard conflicts across 5+ files and would risk downgrading `routes/ai.js` and `public/js/tree_state.js` to older, less capable versions.

Recommend: close the branch without merging. No action required.

=== ADD-AUDIT-LOG-HOURS BRANCH AUDIT END ===
