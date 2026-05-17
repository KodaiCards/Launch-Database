# T14 Polish-F Notes — key_terms / vocabulary_assumed conflict sweep

**Canonical from RT-θ `d101f3d`:** L02 MGN in key_terms but in vocab_assumed → T01.L08 (not vocab_introduced). Same schema-inconsistency pattern as Polish-E fixed for L05 IBT/GES.

**Scope:** All T14 lessons L01–L12. Parse key_terms array; check each term against vocabulary_assumed. If term appears in both, it is assumed from another lesson (not introduced here) → remove from key_terms.

---

## Findings — key_terms / vocabulary_assumed conflicts

### L02.mgn-multi-grounded-neutral.jsx — `MGN` CONFLICT

- **key_terms:** `MGN`, `neutral wire`, `grounds per mile`, `neutral-to-ground bond`
- **vocabulary_introduced:** `neutral wire`, `grounds per mile`, `neutral-to-ground bond`
- **vocabulary_assumed:** includes `{ term: 'MGN', source_lesson_id: 'T01.L08' }`
- **Result:** MGN introduced at T01.L08, not L02. L02 assumes it; L02's `vocabulary_introduced` omits it. Flashcard definition for MGN belongs to T01.L08.
- **Fix:** Removed MGN entry from L02 `key_terms`. Remaining: `neutral wire`, `grounds per mile`, `neutral-to-ground bond` (all in vocabulary_introduced — correct).

BEFORE:
```js
key_terms: [
  { term: 'MGN', definition: 'Multi-Grounded Neutral — ...' },
  { term: 'neutral wire', ... },
  ...
]
```
AFTER:
```js
key_terms: [
  { term: 'neutral wire', ... },
  ...
]
```

---

### L07.surge-arresters-lightning-protection.jsx — `primary protector` CONFLICT

- **key_terms:** `surge arrester`, `primary protector`, `MOV`, `gas-tube arrester`, `VPL`, `ground ring`
- **vocabulary_introduced:** `surge arrester`, `MOV`, `gas-tube arrester`, `VPL`, `ground ring`
- **vocabulary_assumed:** includes `{ term: 'primary protector', source_lesson_id: 'T19.L06' }`
- **Result:** primary protector introduced at T19.L06, not L07. L07 assumes it; vocabulary_introduced omits it.
- **Fix:** Removed `primary protector` entry from L07 `key_terms`. Remaining 5 entries all match vocabulary_introduced — correct.

BEFORE:
```js
key_terms: [
  { term: 'surge arrester', ... },
  { term: 'primary protector', definition: 'A listed surge protective device ...' },
  { term: 'MOV', ... },
  ...
]
```
AFTER:
```js
key_terms: [
  { term: 'surge arrester', ... },
  { term: 'MOV', ... },
  ...
]
```

---

### L11.nesc-grounds-per-mile.jsx — `grounds per mile` CONFLICT

- **key_terms:** `grounds per mile`, `grounding interval`
- **vocabulary_introduced:** `grounding interval` only
- **vocabulary_assumed:** includes `{ term: 'grounds per mile', source_lesson_id: 'T14.L02' }`
- **Result:** grounds per mile introduced at T14.L02, not L11. L11 only introduces `grounding interval`.
- **Fix:** Removed `grounds per mile` entry from L11 `key_terms`. Remaining: `grounding interval` only — correct.

BEFORE:
```js
key_terms: [
  { term: 'grounds per mile', definition: 'The minimum number of ...' },
  { term: 'grounding interval', ... },
]
```
AFTER:
```js
key_terms: [
  { term: 'grounding interval', ... },
]
```

---

## Clean lessons (no key_terms/vocab_assumed conflicts)

- L01: 5 key_terms, all in vocabulary_introduced — CLEAN
- L03: 6 key_terms, all in vocabulary_introduced — CLEAN
- L04: 7 key_terms, all in vocabulary_introduced — CLEAN
- L05: 3 key_terms, all in vocabulary_introduced — CLEAN
- L06: 6 key_terms, all in vocabulary_introduced — CLEAN
- L08: 5 key_terms, all in vocabulary_introduced — CLEAN
- L09: 7 key_terms, all in vocabulary_introduced — CLEAN
- L10: 2 key_terms, both in vocabulary_introduced — CLEAN
- L12: empty key_terms — CLEAN

---

## Validator + Build

- `node validate-lesson-schema.js T14` → 12/12 PASS, 0 FAIL, 0 WARN
- `npm run build` → ✓ built in 6.48s, zero errors
- DAG registry regenerated (`build-dag-registry.js`)
