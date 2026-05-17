# T14 Polish-D Notes

**Wave:** T14 Polish-D  
**Commit:** `82a4236`  
**Source canonicals:** RT-γ `ba7942c` + RT-δ `9a43907`  
**Date:** 2026-05-17

## Fix 1 — L08 floating messenger self-referential vocabulary_assumed entry

**BEFORE:**
```js
{ term: 'messenger bond', source_lesson_id: 'T14.L03' },
{ term: 'floating messenger', source_lesson_id: 'T14.L08' },
{ term: 'NEC', source_lesson_id: 'T01.L08' },
```

**AFTER:**
```js
{ term: 'messenger bond', source_lesson_id: 'T14.L03' },
{ term: 'NEC', source_lesson_id: 'T01.L08' },
```

**Rationale:** `floating messenger` is in `vocabulary_introduced` at line 20. A `vocabulary_assumed` entry with `source_lesson_id: 'T14.L08'` is a self-reference — the lesson cannot assume a term it is introducing. Removed.

---

## Fix 2 — L12 Q17 source citation tail §9.4 → §9.3

**BEFORE:**
```
'...Only the fall-of-potential method per IEEE 81-2012 §9.3 gives a valid single-rod acceptance measurement. (Source: IEEE 81-2012 §9.4. T14.L06.)'
```

**AFTER:**
```
'...Only the fall-of-potential method per IEEE 81-2012 §9.3 gives a valid single-rod acceptance measurement. (Source: IEEE 81-2012 §9.3. T14.L06.)'
```

**Rationale:** Body of Q17 correctly cites §9.3 = fall-of-potential method throughout. Source tag erroneously read §9.4 (= clamp-on method, an unrelated section). Corrected to match body.

---

## Validation results

- Schema validator T14: **12/12 PASS, 0 FAIL, 0 WARN**
- Vite build: **✓ built in 6.30s** (clean, zero errors)
- git diff --stat: `2 files changed, 1 insertion(+), 2 deletions(-)` — L08 + L12 only, within write-path allowlist
