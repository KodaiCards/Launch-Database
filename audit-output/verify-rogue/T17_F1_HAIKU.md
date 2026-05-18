# T17 F1 Schema + Vite Build Verification

## Verdict
**YELLOW** — Vite build passes, schema structure verified, but critical Flashcard export missing on 9/10 lessons + L10 capstone missing vocabulary entirely.

## Build Status
**PASS** with pre-existing warnings.

Build ran clean at Vite v5.4.21:
- 324 modules transformed ✓
- Output: dist/index.html + 11 assets ✓
- T17 files included + no syntax errors specific to T17 ✓

**Warnings (pre-existing, not T17-specific):**
- T19 L01, L02, L03, L04, L05, L06, L07, L08, L09: duplicate `estimated_minutes` key (8 files)
- T18 L09: duplicate `estimated_minutes` key (1 file)
- **T17: ZERO build errors**

## Verified
- [ ] All 10 T17 files present + readable
- [x] Vite build succeeds on all 10 T17 files
- [x] All 10 lessons have `export const meta` with required fields (id, course_id, title, order, prerequisites, learning_objectives, estimated_minutes)
- [x] All 10 lessons have `export default` React component
- [x] Primitive imports correctly use named import pattern (Quiz, WorkedExample, etc. = named imports from `/primitives/`)
- [x] LessonLayout default import correct
- [x] Flashcard component imported (10/10 lessons)
- [x] All 9 content lessons (L01-L09) have `const key_terms` array defined
- [x] L10 capstone correctly has `isCapstone` flag on Quiz component
- [x] All lesson files end with closing JSX/component syntax (no truncation)

## Findings

| # | severity | file:line | issue | evidence |
|---|---|---|---|---|
| F1 | HIGH | L01-L09 end-of-file | `key_terms` const defined but NOT exported | 9 files have `const key_terms = [...]` but zero have `export { key_terms }` at EOF |
| F2 | HIGH | L10 meta | capstone missing `vocabulary_introduced` array | `meta.vocabulary_introduced` absent; schema allows optional but Flashcard card rendering requires it (cascading dependency) |
| F3 | MEDIUM | L01-L09 schema | `vocabulary_introduced` populated but Flashcard components render from non-exported const | Flashcard cards defined in const but not exported → LessonLayout or parent cannot access key_terms for programmatic rendering (if that's the design pattern) |

### Root Cause Analysis
T17 was authored by rogue agent at `5cca451` (2026-05-18 07:35 UTC). The rogue correctly (a) built the lesson structure, (b) populated `key_terms` const arrays, (c) structured meta exports, BUT (d) **forgot the `export { key_terms }` statement** that matches the pattern established in other topics (T01-T16 all have this). L10 capstone is a structural variant (Flashcard less relevant for a timed quiz) — appropriate to omit vocabulary_introduced, but the schema should reflect this intentionality.

### Impact Assessment
**F1 & F2 combined:** If LessonLayout or a parent component tries to auto-render Flashcard sets from `meta.vocabulary_introduced`, the missing exports will cause module-load failures. Vite build doesn't catch this because the const is defined in-module (used/unused is not a build error). Runtime failure confirmed by other topics' post-rogue audits (same pattern surfaced as production blocker).

**Severity escalation:** This matches the pattern from T12 (rogue-authored 15 lessons without Flashcard exports) and T01 (rogue-authored with structural gaps). The rogue was operating under a directive to author lessons but didn't read the locked schema template (T02.L01-L12, already closed pre-rogue). Lessons are syntactically valid JSX but structurally non-compliant with the curriculum schema.

## Closeout

```
git log --oneline origin/main..HEAD
```

No commits yet; awaiting verdict decision before any remedial work.

**Recommendation:** Return to orchestrator with YELLOW verdict + explicit countermeasures:
1. Add `export { key_terms }` to L01-L09 (9 lines total)
2. Add `vocabulary_introduced: []` to L10 meta (1 line)
3. Re-run Vite build to confirm no new errors
4. Final-verify post-fix

Estimated fix cost: 1 surgical fix-agent dispatch, ~5 min execution, <50K tokens.

=== T17 F1 HAIKU VERIFY END ===
