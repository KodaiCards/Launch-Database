# Agent Protocol — `kodaicards/launch-database` (current as of 2026-05-17)

> Reference this file from agent prompts instead of re-inlining boilerplate.
> Every agent reads this once at start of run.
> Working branch is **`main`** (post-2026-05-15-evening lock).

## 1. Setup

1. GitHub access via env. Working branch: **`main`**.
2. `git fetch origin main && git -c commit.gpgsign=false merge FETCH_HEAD --no-edit` before every push (signing-wrapper-safe; do NOT use `git pull --rebase`).
3. Confirm HEAD matches dispatching prompt; if not, ask before proceeding.

## 2. Universal hard rules

- **Push policy.** Signing wrapper returns 400. Unsigned commits are working norm. Use `git -c commit.gpgsign=false commit ...`. Never `--no-verify`. Never amend published commits.
- **STOP and surface** on safety-net failures (lint/type-check/test/pre-commit). Do NOT bypass — orchestrator decides.
- **No scope creep.** Implement only items in prompt. Surface adjacent observations as report notes, never as additional commits or findings.
- **Branch discipline.** Push only to `main`. Never push elsewhere.
- **No PR creation** unless prompt explicitly says to.

## 3. Signing-wrapper workaround

| Operation | Command |
|---|---|
| Regular commit | `git -c commit.gpgsign=false commit -m "..."` |
| Merge commit | `git -c commit.gpgsign=false merge FETCH_HEAD --no-edit` |
| Pre-push sync | `git fetch origin` then `git -c commit.gpgsign=false merge FETCH_HEAD --no-edit` |
| Recovery | `git reset --hard origin/main`, re-apply edits, commit, push fast-forward |

**NEVER** `git pull --rebase`, `--force`, `--force-with-lease`, `--no-verify`.

## 4. Parallel-push collision handling

Multiple agents may push to `main`. Before every push:
1. `git fetch origin`
2. `git -c commit.gpgsign=false merge FETCH_HEAD --no-edit`
3. `git push origin main`

On collision/rejection, retry fetch → merge → push up to **5×** with **30s gaps**. Network failure → retry up to 4× with exponential backoff (2s/4s/8s/16s).

## 5. Role-write separation (STRICT)

| Role | Write access |
|---|---|
| Research/audit agent | Own report file ONLY (allowlist in prompt). NO lesson files. NO canonicals. NO CLAUDE.md. |
| Red Team verifier | Own report file ONLY. READ-ONLY on code/content. |
| Fix-agent / Polish-agent | Lesson files in scope + notes file. NO CLAUDE.md / ARCH.md / course-catalog.js / SLEEP_SNAPSHOT.md / HANDOFF.md / pending-dispatches.md / public/training/. |
| Post-fix RT | Own report file ONLY. READ-ONLY. |

**Write-path allowlist is enforced in every prompt.** If your prompt lists `audit-output/X.md` as allowlist, you may write ONLY that file plus your own commits/notes if explicitly named.

## 6. Anti-patterns — EVERY agent MUST NOT

- Use Edit/Write/NotebookEdit on files outside write-path allowlist
- Create/modify `*_CANONICAL.md` or `*_FIX_*.md` (orchestrator-only artifacts) unless prompt explicitly names them
- Modify CLAUDE.md / ARCH.md / course-catalog.js / SLEEP_SNAPSHOT.md / HANDOFF.md / pending-dispatches.md / public/training/ (orchestrator-only)
- Impersonate orchestrator (no "Prepared by Orchestrator", "Next dispatchable", "Ready to dispatch", "I cannot dispatch")
- Dispatch follow-up rounds (R-4, RT-C etc.) — orchestrator-only
- Issue "GREEN closure" claims — orchestrator decides
- Apply fixes when role is audit/RT — REPORT only
- Trust prior agents' "primary-source verified" claims blindly — re-verify

## 7. Closeout requirements (every agent)

Every result message MUST include:

1. **First line:** acknowledge write-path constraints verbatim
2. `git log -3 --oneline` paste showing your commits
3. `git diff --stat origin/main..HEAD` paste — only files in allowlist
4. Vite build result if you touched code: `cd osp-training && npm run build` — must succeed
5. For fix/polish agents: BEFORE → AFTER verbatim snippets per canonical item
6. For agents claiming citation/numeric corrections: PRIMARY-SOURCE VERIFICATION LOG with URLs + verbatim quotes BEFORE listing edits

## 8. Primary-source verification — REGISTRY-FIRST mandate (cascade-defense)

Cascade precedents: T02 OM5 28000 fabricated, T09 Biden PM 86 FR 7491 not 7667, T08 §1.1413→§1.1411(i).

**Verification workflow — STOP redundant re-verification:**

1. **REGISTRY FIRST.** Open `audit-output/citation-registry.md`. Search for the citation.
2. **Registry hit + Last Verified within 90 days + not flagged `CONFLICT PENDING`** → **USE the registry entry. DO NOT re-verify from primary source.** Cite the registry entry's "Verified By" SHA in your closeout instead of repeating the lookup.
3. **Registry hit but `CONFLICT PENDING` or stale (>90 days)** → primary-source lookup, then UPDATE the registry with new "Last Verified" date + your commit SHA.
4. **Registry miss** → primary-source lookup (eCFR, NIST, NIOSH, NESC, IEEE Xplore, FCC ECFS — not Wikipedia or secondary blogs), then APPEND to registry.

**Only do primary-source lookup when registry actually requires it.** The registry IS the cascade-defense. Skipping the lookup when registry is fresh is the cost-cut.

**Apply-replacement rule** (still mandatory):
- Before applying ANY numeric/citation/regulation replacement, the replacement value must be either (a) registry-verified fresh, or (b) you primary-source-verified it just now and added to registry.
- If primary source disagrees with canonical's claim → REPORT and STOP — do not apply.

**RT-β duplicate-verification skip:** When pair-mate RT-α has already primary-source-verified an item in the same wave, RT-β trusts RT-α's verification for that specific item (RT-α's closeout will be in the wave's `audit-output/` dir). RT-β's "different framing" applies to NEW items / under-audited surfaces / cascade sweeps — not to re-doing the same citation lookups. Rotation across waves prevents single-RT capture: orchestrator alternates which RT does primary-source-first.

## 9. Audit prompt patterns (baseline)

- **Traceability:** every finding includes `Verified by reading: <file>:<startLine>-<endLine>` + 3-10 line code snippet
- **Negative findings:** force a section of what you checked AND confirmed clean
- **Coverage gaps:** explicit "what I didn't reach + why"
- **Same scope, distinct framings** across paired RTs (NOT split scopes)
- **Forbid reading other auditor outputs** unless role is "prior-context" framing
- **Word budget:** specified per prompt (usually ≤1200-1500)
- **End sentinel:** `=== <AGENT NAME> REPORT END ===`

## 10. Conflict resolution

Two agents return conflicting findings on same item → orchestrator dispatches tiebreaker BEFORE fix-agent runs:
- Citation/fact conflicts → Haiku ground-truth primary-source lookup (~10-30K tokens)
- Interpretation/judgment conflicts → Sonnet third framing
Conflicts CANNOT be deferred past fix-agent dispatch.

## 11. Token budget caps (per agent class)

| Role | Cap |
|---|---|
| Research/audit | 200K |
| RT (post-fix or final-verify) | 120-150K |
| Fix-agent (scoped canonical) | 250K |
| Polish-agent | 180K |
| Haiku ground-truth | 75K |

**STOP if approaching cap.** Write your report immediately. Do not continue into "let me also fix this" patterns.

## 12. Vite build check (any agent touching osp-training/)

`cd osp-training && npm run build` after changes. Must succeed (zero errors). Flag RED if build fails — topic is not GREEN if it doesn't build.

## 13. Acknowledgment first line

Your first line must paste back the write-path allowlist verbatim. Example:

> "Write-path constraints acknowledged: only `audit-output/<wave>/<agent>.md` written."

Drift-prevention.

## 14. Registry usage — save tokens, avoid redundant lookups

Three infrastructure tools now exist. Use them BEFORE doing manual checks.

### 14a. Citation lookup → `audit-output/citation-registry.md` (HARD RULE)

Before looking up any primary source (47 CFR section, NESC rule, OSHA regulation, ITU-T standard, ANSI standard, chemical safety value):

1. Open `audit-output/citation-registry.md`
2. Search for the citation
3. If found AND `Last Verified` date is within 90 days of today AND not flagged `CONFLICT PENDING`: **USE the entry. SKIP the lookup. Cite the registry's "Verified By" SHA in your closeout — DO NOT repeat the primary-source query.**
4. If absent or stale or CONFLICT PENDING: do the primary-source lookup, then **append/update** the entry with your commit SHA + today's date

**This is the cost-cut.** Agents that re-verify registry-fresh citations waste 10-50K tokens per dispatch. Don't.

**Reverse-priming for cascade-defense:** the registry's "Notes" column captures past wrong-answers (e.g., §32.2210 was wrongly claimed by two prior agents to be "Land" / "Cable & Wire" before primary-source said "Central office—switching"). Reading the Notes column protects against re-creating the same cascade.

**Format for new entries:**
```
| 47 CFR §X.YYYY | "Verbatim title from eCFR" | https://ecfr.gov/current/... | YYYY-MM-DD | <your-commit-sha> | Notes |
```

Entries marked "CONFLICT RESOLVED" or "CASCADE BUG FIXED" document cases where multiple prior agents got
the value wrong. These entries are the ground truth — do not re-open without a primary-source citation
that explicitly contradicts the entry.

### 14b. DAG pointer checks → `audit-output/dag-registry.json`

Instead of manually reading JSX files to check `vocabulary_assumed` pointer correctness:

1. Open `audit-output/dag-registry.json`
2. Check `vocabulary_assumed_pointers` array — filter for `"verified": false` entries in the lesson you're auditing
3. Check `duplicate_introductions` for terms that appear in multiple lessons (these cause confusion about which lesson "owns" the term)
4. Check `lessons_with_no_vocabulary_assumed` for lessons that should have assumed vocabulary but declare none

**Regenerate the registry** after any lesson edits touching `vocabulary_introduced` or `vocabulary_assumed`:
```bash
node osp-training/scripts/build-dag-registry.js
```

### 14c. Schema + Flashcard compliance → `validate-lesson-schema.js`

Instead of manually checking whether lessons have `key_terms`, `<Quiz>`, and `<Flashcard>` components:

```bash
# Check specific topic
node osp-training/scripts/validate-lesson-schema.js T08

# Check all topics
node osp-training/scripts/validate-lesson-schema.js
```

Output format:
- `PASS` = lesson compliant
- `FAIL` = actionable gap (e.g., missing `learning_objectives`, no `<Quiz>`, missing `vocabulary_assumed`)
- `WARN` = likely gap worth checking manually (e.g., key_terms count > Flashcard card count)

**Run this instead of manually reading lesson files to count Flashcard cards.** Saves per-topic audit time.

### 14d. New citations go into the registry

When your audit or RT pass verifies a primary source that isn't in the registry:
1. Add it to `audit-output/citation-registry.md` in the appropriate section
2. Include your commit SHA in the `Verified By` column
3. Commit the updated registry file as part of your wave's commit sequence

This ensures future agents inherit your verification instead of re-doing the lookup.

### 14e. Known-cascade-patterns FIRST → `audit-output/known-cascade-patterns.md`

**Every audit / RT / fix-agent reads this file's pattern list BEFORE looking for novel bugs.** Pattern-match-first is cheaper than rediscovery. The patterns catalogue cascade bugs that have already cost the curriculum multiple round-trips (P1 §32.2210, P6 OM1/OM2 Flashcards, P7 G.655/G.656, P9 §32.2411, etc.).

**Audit step 1:** grep the topic under audit for each listed pattern. Report occurrences. THEN look for novel bugs.

**RT step 1:** verify fix-agent's changes did NOT re-introduce or perpetuate any pattern.

**Fix-agent step 1:** before applying any citation/value/regulation replacement, check whether the replacement value matches a known wrong-value in the register. If so → STOP and report.
