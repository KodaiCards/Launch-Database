# Branch Audit: `claude/add-audit-log-hours-x0XCd`

**Auditor:** Read-only audit agent  
**Date:** 2026-05-15  
**Branch tip:** `e0c7650` (2026-05-04 13:09 UTC)  
**Current main HEAD:** `fd0bc2f`  
**Relationship:** No shared commit ancestor — branch lives on the repo's original linear history; main diverged through a series of PRs and is now a separate but evolved history.

---

## Verdict (≤80 words)

**SCRAP**

Every code change in the 10 post-merge-PR-#6 commits has been independently re-implemented and expanded in `main`. The branch's `public/index.html` was replaced wholesale by `public/admin.html` in main (a superset rewrite). The only unique artifacts are `NEXT_STEPS.md` and `SESSION_HANDOFF.md` — both are stale 2026-05-04 docs, superseded by `HANDOFF.md` + `CLAUDE.md` on main. No cherry-picks required; main already contains everything of value.

---

## Branch structure clarification

The branch predates the current `main` history entirely — there is no `git merge-base` between them (`fatal: no merge base`). The branch went through a series of PRs (#3 through #6) that periodically merged `main` into the branch. After PR #6 merged on 2026-05-04, 10 additional commits landed. Those 10 commits are what this audit evaluates.

The 10 commits span: `471e01d` → `e0c7650` (from the PR #6 merge on 2026-05-04T01:55 UTC)

---

## Commit-by-commit assessment

| SHA | Title | Value | Main status | Recommendation |
|---|---|---|---|---|
| `471e01d` | AI: unit-test userWantsAction classifier (10 cases) | HIGH — tests a pure function critical to AI tool-forcing | `tests/ai_user_wants_action.test.js` present in main (108 lines) | SKIP — superseded |
| `d412761` | AI: force tool_choice='any' on confirmed actions | HIGH — root-cause fix for AI silent-skip bug | `routes/ai.js` has `userWantsAction` at line 84, expanded to 2730 lines vs branch's 1772 | SKIP — superseded + expanded |
| `c1107e9` | Untrack package-lock.json | LOW — git hygiene | `.gitignore` has `package-lock.json` at line 34 in main | SKIP — superseded |
| `d709c4b` | HANDOFF.md: refresh known-issues | DOC — continuity artifact | `HANDOFF.md` in main is massively updated (reality-reconciliation 2026-05-15) | SKIP — stale |
| `196b45f` | NEXT_STEPS.md: prune stale items | DOC — roadmap artifact | `NEXT_STEPS.md` NOT in main; content is 2026-05-04 roadmap, fully superseded by CLAUDE.md §4 | SCRAP |
| `7adfa14` | AI: clean 503 on missing ANTHROPIC_API_KEY | MEDIUM — UX/ops improvement | `routes/ai.js` line 2375-2378: identical guard present in main | SKIP — superseded |
| `3764160` | Tests: schema-shape smoke test | HIGH — catches silent schema failures | `tests/schema_shape.test.js` present in main (108 lines, identical scope) | SKIP — superseded |
| `f80dc04` | Code review pass: fix regression + dedupe | MEDIUM — expanded confirmation phrases, deleteProjectDoc helper | Confirmation phrases in `routes/ai.js:98` in main; `deleteProjectDoc` in `public/js/api.js:38` | SKIP — superseded |
| `4ffcd95` | tree-toggle factory + UX consistency + N+1 | MEDIUM — DRY refactor for tree-toggle | `makeTreeToggle` at `public/js/tree_state.js:86` in main | SKIP — superseded |
| `0553c21` | Shared openOverlayModal helper | MEDIUM — DRY refactor for overlay modals | `public/js/overlay_modal.js` exists in main (full implementation + a11y focus trap) | SKIP — superseded |
| `e0c7650` | Add SESSION_HANDOFF.md | DOC — 2026-05-04 session capture | Not in main; content is historical artifact, superseded by CLAUDE.md | SCRAP |

---

## Per-feature value matrix

| Feature | Branch commits | In main? | Main quality vs branch | Verdict |
|---|---|---|---|---|
| `userWantsAction` classifier + `tool_choice='any'` | `d412761`, `f80dc04` | YES — `routes/ai.js:84` | More mature: expanded regexes, runs on `messages || []` guard, more test cases | SUPERSEDED |
| userWantsAction unit tests | `471e01d`, `f80dc04` | YES — `tests/ai_user_wants_action.test.js` (108 lines identical) | Same scope | SUPERSEDED |
| AI 503 on missing API key | `7adfa14` | YES — `routes/ai.js:2375` | Identical | SUPERSEDED |
| AI hallucination guard future/progressive | `fbdaee8` (pre-PR-6, already merged) | YES — `routes/ai.js:2679` | Expanded | SUPERSEDED |
| Schema-shape smoke test | `3764160` | YES — `tests/schema_shape.test.js` (108 lines) | Same | SUPERSEDED |
| schema.sql forward-ref fix | `26b7997` (pre-PR-6) | YES — `schema.sql` is pg_dump regen (completely new format) | Complete | SUPERSEDED |
| Tree-toggle factory (`makeTreeToggle`) | `4ffcd95` | YES — `public/js/tree_state.js:86` | Identical function, integrated into admin.html | SUPERSEDED |
| Overlay modal helper (`openOverlayModal`) | `0553c21` | YES — `public/js/overlay_modal.js` | Main version has a11y focus-trap (upgraded) | SUPERSEDED + improved |
| `deleteProjectDoc` shared helper | `f80dc04` | YES — `public/js/api.js:38` | Identical | SUPERSEDED |
| Hours tab per-type drilldown | `fe75c36` (pre-PR-6) | YES — `public/js/hours_tab.js:626` | Identical | SUPERSEDED |
| Permit doc per-file delete | `b2ec20d` (pre-PR-6) | YES — `public/js/permits_tab.js:197` | Identical | SUPERSEDED |
| Staff inline quickAdd button | `3870783` (pre-PR-6) | YES — `public/admin.html:2052` | In admin.html (index.html replacement) | SUPERSEDED |
| 2GB upload cap | `b76a59a` (pre-PR-6) | YES — `routes/project_documents.js:26` | Identical | SUPERSEDED |
| package-lock in .gitignore | `c1107e9` | YES — `.gitignore:34` | Identical | SUPERSEDED |
| SESSION_HANDOFF.md | `e0c7650` | NO | Main has CLAUDE.md §4 + HANDOFF.md as the living doc system | STALE/SCRAP |
| NEXT_STEPS.md | `196b45f` | NO | Superseded by CLAUDE.md §4 queue | STALE/SCRAP |

---

## Conflict matrix

A merge of this branch into main is structurally impossible without `--allow-unrelated-histories` because the two have no common ancestor. Even with that flag, the conflict surface would be severe:

| File | Conflict risk | Reason |
|---|---|---|
| `public/index.html` | FATAL — file deleted from main | Branch modifies index.html; main replaced it with `public/admin.html` (completely different file path and content) |
| `schema.sql` | FATAL — format incompatible | Branch has hand-authored CREATE TABLE blocks; main has pg_dump format with completely different structure |
| `routes/ai.js` | HIGH — both evolved | Branch has 1772-line version; main has 2730-line version with major feature additions beyond branch |
| `public/js/tree_state.js` | MEDIUM — both evolved | Both have `makeTreeToggle` but main may have additional API extensions |
| `public/js/hours_tab.js` | MEDIUM | Both evolved past the branch's starting point |
| `HANDOFF.md` | MEDIUM — stale vs current | Branch has May-04 version; main has May-15 reality-reconciled version |
| All other touched files | LOW-MEDIUM | Main has evolved versions of all 20 files the branch touches |

**Merge is not feasible.** The unrelated-history problem plus the `public/index.html → public/admin.html` rename and the `schema.sql` format change would produce conflicts that cannot be auto-resolved.

---

## Main's evolution past the branch

| File | Main advances |
|---|---|
| `routes/ai.js` | +958 lines beyond branch tip: OSP training routes, expanded tool set, additional AI tools, more regression guards |
| `public/admin.html` | Replaces `public/index.html` entirely — the branch's index.html changes are captured in admin.html |
| `schema.sql` | Regenerated as pg_dump output (CI-verified deterministic format); branch's hand-authored SQL is superseded |
| `tests/` | Main has 18 test files vs branch's ~10; additional splice, training, OAuth2, audit tests |
| `public/js/overlay_modal.js` | Main added focus-trap a11y improvements not in branch |

---

## Recommended merge strategy

**SCRAP the branch.** No cherry-picks needed. Rationale:

1. **All code changes are superseded.** Every functional improvement in the 10 commits (AI tool forcing, test coverage, schema fix, DRY helpers) is already in `main`, often in a more mature form.
2. **The only unique files are stale docs.** `NEXT_STEPS.md` (2026-05-04 roadmap) and `SESSION_HANDOFF.md` (2026-05-04 session capture) are historical artifacts. The information they contained has been subsumed into `CLAUDE.md` §4 and `HANDOFF.md` on main.
3. **Merge is technically infeasible** without `--allow-unrelated-histories` and would produce severe conflicts on `public/index.html`, `schema.sql`, and `routes/ai.js`.
4. **No regression risk from scrapping.** Main is strictly a superset of this branch's functional work.

---

## Risk / blocker callouts

- **None blocking for scrap verdict.** All value has been preserved on main.
- **Low-value observation:** The branch's `SESSION_HANDOFF.md` contains a useful note about the 2026-05-04 CI hang (`npx playwright install --with-deps chromium` timeout). This edge-case is worth knowing about if Playwright CI hangs again — but it's not merge-critical; the test infrastructure on main has evolved significantly since then.
- **Not a risk, but worth noting:** Main's `public/admin.html` is substantially larger and richer than the branch's `public/index.html`. The branch's cleanup work (extracting tab-loader JS) laid the foundation for this expansion; that work was merged via PR #5/#6 before the 10 audit-relevant commits.

=== BRANCH AUDIT END ===
