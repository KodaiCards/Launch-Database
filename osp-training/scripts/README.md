# osp-training/scripts — Infrastructure Tooling

Build 2026-05-17. Eliminates ~13M Sonnet/session of manual audit waste across three patterns.

---

## Scripts

### `validate-lesson-schema.js`

Validates all lesson JSX files for schema compliance and Flashcard mandate.

**What it checks:**
1. `meta` export exists with required fields (`id`, `course_id`, `title`, `order`, `prerequisites`, `learning_objectives`, `estimated_minutes`)
2. `vocabulary_introduced`, `vocabulary_assumed`, `key_terms` present (in meta or as top-level exports)
3. Per-lesson `<Quiz>` component rendered
4. Flashcard mandate: if `key_terms` is non-empty, a `<Flashcard>` component renders for those terms

**Usage:**
```bash
# All topics (from repo root)
node osp-training/scripts/validate-lesson-schema.js

# Specific topic
node osp-training/scripts/validate-lesson-schema.js T08

# CI integration — exit code 1 if any failures
node osp-training/scripts/validate-lesson-schema.js && echo "PASS" || echo "FAIL"
```

**Output format:**
```
  PASS  T08/L01-otmr-vs-multi-party.jsx
  FAIL  T08/L07-reading-a-make-ready-estimate.jsx: meta missing: vocabulary_assumed
  WARN  T09/L02-nepa-ce-ea-eis.jsx: key_terms has 8 terms but Flashcard deck has only 7 cards
```

**Exit codes:** 0 = all pass, 1 = any FAIL (WARNs do not fail).

**Notes for audit/RT agents:** Run this instead of manual Flashcard-presence checks.
Saves ~2.8M Sonnet/session vs retroactive patching.

---

### `build-dag-registry.js`

Walks all lessons, extracts `vocabulary_introduced` and `vocabulary_assumed` arrays, and
cross-checks every `vocabulary_assumed` pointer against the actual `vocabulary_introduced` table.

**Output:** `audit-output/dag-registry.json`

**Usage:**
```bash
# All topics (from repo root)
node osp-training/scripts/build-dag-registry.js

# Single topic (partial — broken pointers may reference other topics)
node osp-training/scripts/build-dag-registry.js --topic T04
```

**Output JSON shape:**
```json
{
  "generated_at": "ISO timestamp",
  "lesson_count": 125,
  "vocabulary_introduced_by_lesson": { "T01.L02": ["sag", "span", ...] },
  "all_vocabulary_introduced": { "sag": ["T01.L02"] },
  "duplicate_introductions": [{ "term": "otmr", "introduced_by": ["T01.L05", "T05.L09"] }],
  "vocabulary_assumed_pointers": [
    { "from_lesson": "T07.L02", "term": "contour", "claimed_source": "T04.L03",
      "verified": false, "reason": "T04.L03 does not introduce 'contour'" }
  ],
  "verified_pointers_count": 1042,
  "broken_pointers_count": 155,
  "missing_source_lesson_pointers": [...],
  "lessons_with_no_vocabulary_assumed": [...],
  "vocabulary_assumed_without_source_id": [...]
}
```

**Notes for audit/RT agents:** Query `audit-output/dag-registry.json` instead of manually
reading JSX files. Saves ~3.5M Sonnet/session vs per-audit DAG walking.

**Regenerate after any lesson edits** that touch `vocabulary_introduced` or `vocabulary_assumed`.

---

## Supporting registry files

### `audit-output/citation-registry.md`

Shared verified-citation cache. **Before any primary-source lookup:**
1. Check this file for the citation
2. If present AND `Last Verified` is within 90 days, skip lookup and use the entry here
3. If absent or stale, do the lookup, then **append** your verified result with your commit SHA

**Saves ~1.8M Sonnet/session** vs repeated primary-source lookups across audit waves.

**Cascade defense:** entries marked "CONFLICT RESOLVED" document the correct primary-source
value after a multi-agent dispute was settled. Never trust a prior agent's "verified" claim
for these — the entry shows why the others were wrong.

---

## CI integration

Add to CI pipeline (after `npm run build`):

```yaml
- name: Validate lesson schemas
  run: node osp-training/scripts/validate-lesson-schema.js
  working-directory: .
```

The DAG registry can be regenerated on-demand; it doesn't need to run in every CI build
(it's expensive to run across 125 files). Recommended: run it in audit waves, not CI.

---

## Known issues in current curriculum (2026-05-17)

From initial run of both scripts:

**Schema validator (125 lessons):**
- 47 FAIL: 38 lessons across T02/T03/T04/T18/T19 missing `learning_objectives` in meta; 7 lessons in T06/T07/T08 have `vocabulary_assumed` as top-level export instead of in meta (validator now handles both patterns — these PASS)
- 10 WARN: Flashcard deck card count < key_terms count in T02.L08, T03.L04, T03.L09, T07.L08, T09.L02, T09.L04, T09.L05, T09.L06, T19.L03, T19.L07

**DAG registry (125 lessons):**
- 155 broken pointers (source lesson doesn't introduce the claimed term)
- 1 missing source lesson (T19.L08 → T11.L01, which doesn't exist yet)
- 41 duplicate introductions (same term introduced in multiple lessons)

These are documented bugs — each fix belongs in the next polish/audit wave for the affected topic.
