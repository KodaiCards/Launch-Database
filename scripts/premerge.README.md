# `npm run premerge` — the merge floor

Implements GATES §premerge (spec: `specs/training-fix.md` WO-3). Runs four stages
**in order, fail-fast**; any red = nonzero exit = no merge. CI is dead (CLAUDE.md),
so this local run is the safety net the Registrar runs before every merge.

| # | Stage | Command | Needs DB? |
|---|-------|---------|-----------|
| 1 | Build the SPA | `npm run build:osp` | no |
| 2 | Static lint | `node scripts/premerge_lint.js` | no |
| 3 | Lesson walk (Playwright) | `npx playwright test tests/browser/training_lesson_walk.spec.js` | **yes** |
| 4 | Backend tests | `npm test` | **yes** |

- `npm run premerge` — full gate (needs `DATABASE_URL`; stages 3–4 boot `node server.js`).
- `npm run premerge -- --lint-only` — stages 1–2 only (build + lint), DB-free — what a
  foreman can run on a branch without DB access.
- `npm run premerge:lint` — just the static lint.

## Stage 2 — what the lint checks (`scripts/premerge_lint.js`)
1. **Internal-note / pipeline-vocabulary leakage** — research-log/brief refs, `UNVERIFIED`,
   all-caps `VERIFIED` QA stamps, "this session" hedges, internal `.md` refs, citation-gate /
   source-material notes, bracketed audit hedges. Scanned in trainee-visible pool fields
   (`prompt`/`choices`/`explanation`/`citation`/`fieldNote`/`label`) + rendered lesson bodies
   (comments stripped) + shared training UI.
2. **Positional-answer gameability** — a pool whose MC answers all sit at one index, or a
   choice whose own text telegraphs correct/incorrect.
3. **Pool draw-count sanity** — `pool.length ≥ drawCount`, `drawCount ≥ 1`, `passThreshold` 0–100.
4. **User-visible internal IDs** — raw `T0x`/`L0x` in trainee-visible pool fields, catalog
   titles, and rendered lesson `title="…"` props.

### Scope (`SCOPED_TOPICS` in the lint)
The leak + visible-ID checks run against topics that have cleared the readability gate
(currently the live-5: `T01, T18, T02, T03, T04`) so the floor catches **regressions in
cleared topics** without permanently blocking on topics not yet authored to the new bar.
**Add a topic ID the moment its WO-2 pass merges.** Draw-count + gameability run against ALL
pools (assessment-integrity, not readability).

### Note on green/red timing
premerge is an **integration** gate — it goes green once the wave's packages are merged
together and their content work has landed. On an individual mid-wave branch it will report
that branch's state plus still-pending wave work (e.g. WO-2 cross-reference renames, the
choice-shuffle gameability items). That is the gate working, not a bug in it.

> **Registrar:** please add the `ops/INVENTORY.md` row for `premerge` (ops/ is foreman-off-limits,
> so this doc lives beside the script instead).
