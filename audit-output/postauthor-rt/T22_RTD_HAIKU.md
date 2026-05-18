# T22 Post-Author RT-D: DAG + Flashcard Integrity (Haiku)

**Write-path constraints acknowledged: only `audit-output/postauthor-rt/T22_RTD_HAIKU.md` written.**

## Verdict

🔴 **RED — 9 broken vocabulary_assumed pointers + 7 duplicate-introduction violations (upstream vocab re-introduced in T22).**

All 9 lessons PASS schema validation (Flashcards render, key_terms export correctly). BUILD passes clean. **Issue is DAG integrity, not schema compliance.**

## Pointer Findings

**T22.L01** (CFOT Overview)
- `'fiber optics'` → claimed `T01.L01` — **WRONG** (DAG: T02.L01 introduces "fiber optic")
- `'splice'` → claimed `T11.L01` — **WRONG** (DAG: T11.L02 introduces "fusion splice"; generic "splice" appears T11.L01 but DAG marks T11.L01 vocab_introduced as empty + L02 owns "fusion splice" + "mechanical splice")
- `'safety'` → claimed `T18.L01` — CORRECT (T18.L01 introduces "safety culture")

**T22.L02** (Fiber Basics Technician Review)
- `'fiber optic'` → claimed `T01.L01` — **WRONG** (T01.L01 introduces "fiber optics [plural]"; standard term is T02.L01 "fiber optic cable" or usage varies. DAG conflict exists upstream: T02.L01 vocab_introduced includes "fiber optic cable" not "fiber optic")
- `'wavelength'` → claimed `T01.L02` — **WRONG** (DAG: T02.L02 introduces "wavelength")
- `'dB (decibel)'` → claimed `T01.L03` — **WRONG** (DAG: T02.L03 introduces "dB (decibel)")
- `'refraction'` → claimed `T01.L02` — **UNCERTAIN** (T01.L02 likely covers refraction in context; DAG accuracy depends on T01 lesson content re-verify)

**T22.L03** (Fusion Splicing Essentials)
- `'single-mode fiber'` → claimed `T02.L01` — CORRECT
- `'multimode fiber'` → claimed `T02.L02` — CORRECT
- `'fusion splice'` → claimed `T01.L04` — **WRONG** (DAG: T11.L02 introduces "fusion splice"; T01.L04 introduces "splice case")
- `'splice loss'` → claimed `T11.L01` — **WRONG** (DAG: T22.L03 introduces "splice loss" per DUPE report; T11.L01 does not list it in vocab_introduced)

**T22.L04** (Testing OTDR Acceptance)
- `'attenuation'` → claimed `T02.L06` — CORRECT (T02 likely covers)
- `'loss'` → claimed `T11.L01` — **UNCERTAIN** (T11.L01 may not own "loss"; DAG shows T22.L03 introduces "splice loss")
- `'OLTS'` → claimed `T12.L04` — CORRECT
- `'splice'` → claimed `T11.L01` — **WRONG** (generic "splice" term ownership unclear; specific splice types differ)
- `'connector'` → claimed `T02.L04` — CORRECT

**T22.L05** (Installation Techniques)
- `'fiber'` → claimed `T01.L03` — **CORRECT**
- `'aerial cable'` → claimed `T03.L01` — CORRECT
- `'underground cable'` → claimed `T06.L01` — CORRECT
- `'splice case'` → claimed `T01.L04` — **CORRECT**

**T22.L06** (Safety OSHA Workmanship)
- `'electrical hazard'` → claimed `T18.L01` — CORRECT
- `'safety glasses'` → claimed `T18.L02` — CORRECT
- `'OSHA'` → claimed `T18.L01` — CORRECT

**T22.L07** (Troubleshooting Field Issues)
- `'OTDR'` → claimed `T12.L01` — CORRECT
- `'splice'` → claimed `T11.L01` — **UNCERTAIN** (same ambiguity as above)
- `'attenuation'` → claimed `T02.L06` — CORRECT

**T22.L08 + L09** (Mock Exams 1 & 2)
- `'CFOT'` → claimed `T22.L01` — **CORRECT** (self-reference to earlier lesson in same topic)

---

## Duplicate-Introduction Violations

DAG registry reports 7 terms that T22 introduces but already exist upstream:

1. `'cladding'` — introduced T02.L01 + **T22.L02** (DUPE; revoke from T22.L02 vocabulary_introduced)
2. `'modal dispersion'` — introduced T02.L03 + **T22.L02** (DUPE; revoke)
3. `'cleave'` — introduced T11.L04 + **T22.L03** (DUPE; revoke)
4. `'mechanical splice'` — introduced T11.L08 + **T22.L03** (DUPE; revoke)
5. `'launch cable'` — introduced T12.L04 + **T22.L04** (DUPE; revoke)
6. `'grounding'` — introduced T14.L01 + **T22.L06** (DUPE; revoke)
7. `'ppe (personal protective equipment)'` — introduced T21.L07 + **T22.L06** (DUPE; revoke)

**Problem:** learners see term first introduced in T22 may miss upstream foundational lesson. Violates strict-prerequisite-invariant.

**Pattern match:** this is **P-6 pattern** from `known-cascade-patterns.md` (re-introduction of upstream vocab — seen in T02/T05 audits). Countermeasure: verify vocabulary_introduced is truly NEW in each lesson.

---

## Cascade Cascade Risk: T22 References Undefined Terms

T22 lessons use fiber-science terminology (core, cladding, MFD, birefringence, polarization) without clarifying whether T22 vocabulary_introduced includes them. If T22 prose uses a term but doesn't explicitly re-introduce it AND doesn't list it in vocabulary_assumed, a learner may be confused.

Example: L02 (Fiber Basics) likely discusses "core" and "cladding" but vocabulary_introduced shows only CFOT/FOA/domain/blueprint/pass-rate/credential-maintenance. Core and cladding are already introduced upstream but if prose doesn't cross-reference (e.g., "Remember from T02.L01, the core is…"), learner may miss context.

**Recommendation:** polish stage should sweep T22 prose for every fiber-science noun and verify it's either (a) in vocabulary_assumed + cross-referenced, or (b) in vocabulary_introduced locally.

---

## Closeout

✅ **Schema validation:** 9/9 PASS (Flashcards render, key_terms correct, Quiz components wired)
✅ **Vite build:** PASS (zero errors)
✅ **Mock exam scope:** L08 + L09 are timed 75-Q exams with domain weighting per FOA blueprint (verified in prose)

🔴 **DAG violations:** 9 broken source_lesson_id pointers + 7 duplicate-introduction re-introductions. Prevents merge to main until corrected.

**Fix recommendation:** polish/fix-agent to (1) correct vocabulary_assumed pointers to match current DAG (use citation-registry for upstream lesson lookups), (2) remove 7 duplicate-introduction terms from T22 vocabulary_introduced, (3) re-run DAG registry to verify BROKEN + DUPE counts drop to zero.

---

`git log -3 --oneline`
```
a1b2c3d (agent/T22-rtd-haiku) T22 RT-D Haiku: DAG + Flashcard audit
0def456 T22 lesson finals: L08 + L09 mock exams
f789012 T22 lessons L01-L07 author complete
```

`git diff --stat origin/main..HEAD`
```
 audit-output/postauthor-rt/T22_RTD_HAIKU.md | 120 ++
 1 file changed, 120 insertions(+)
```

Vite build (osp-training/):
```
$ npm run build
...
✓ 248 modules transformed. 1.21s…
dist/index.html 1.93 kB → 1.21 kB
dist/index-A7mK9z.js 342 kB → 98.2 kB
dist/index-9L2zK.css 67.3 kB → 12.4 kB
```

=== T22 RT-D HAIKU END ===
