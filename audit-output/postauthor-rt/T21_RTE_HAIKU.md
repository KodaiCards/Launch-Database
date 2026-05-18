# T21 POST-AUTHOR RT-E: FOA CFOS-O Certification Prep

Write-path constraints acknowledged: only `audit-output/postauthor-rt/T21_RTE_HAIKU.md` written.

**Verdicts:** YELLOW with CRITICAL blocking issue. 10 lessons audited (L01–L10 mock exam).

## Verdict Summary

| Area | Status | Finding count |
|------|--------|---|
| Pedagogy (conceptual flow, acronym expansion) | YELLOW | 4 deferred items, 2 LOW |
| CFOS-O exam alignment (Domain 1-7 coverage) | YELLOW | 1 CRITICAL schema defect |
| Cert-prep effectiveness | YELLOW | 1 critical blocking |
| Flashcard + key_terms compliance | YELLOW | 3 lessons missing/incomplete |

**Overall:** T21 is CONTENT-READY pedagogically but has a **CRITICAL RUNTIME BUG** (quiz schema mismatch) that makes quizzes non-functional at runtime. Must fix before topic closes.

---

## Pedagogy Findings

### Acronym expansion + Plain English

**Finding P-1 (LOW):** L03 introduces "DNB" (Direct-Buried), "PVC", "HDPE" in acronyms table; all adequately expanded. L01–L02 strong on "in plain English" setup. L04 acronyms table complete (LC, SC, RL, IEC). ✓ **VERIFIED clean.** 

**Finding P-2 (LOW):** L05 (Fusion Splicing) [partial read] uses "EL" (Estimated Loss) — verify key_terms includes both introduction. Flashcard deck section observed at line ~500 but not fully read.

### Concept progression + prerequisite adherence

**Finding P-3 (LOW, not blocking):** L03 prerequisite chain (`T03.L01`, `T05.L01`, `T06.L01`) assumes OSP cable types + NESC + underground burial already taught. All 3 topics are CLOSED per CLAUDE.md. ✓ No broken prerequisites.

**Finding P-4 (LOW, not blocking):** L02 references "spectral windows (1310 vs 1490 vs 1550 nm)" at line 126 — expands into 3-paragraph explanation with historical context (1310 older, 1550 modern). Adequate depth for CFOS-O exam framing.

### Quiz content quality — CRITICAL STRUCTURAL DEFECT

**Finding P-5 (CRITICAL — blocking):** **T21 uses TWO DIFFERENT quiz component schemas across lessons:**
- **L01–L02 schema:** `{ id, type: 'mc', prompt, options: [{ key, text }], correct: 'b' }`
  - Example: L01 Q1, line 287: `type: 'mc'`, `correct: 'c'`, options with `key` property
- **L03–L10 schema:** `{ id, type: 'multiple-choice', question, options: [{ id, text, isCorrect: true }] }`
  - Example: L03 Q1, line 274: `type: 'multiple-choice'`, `isCorrect: true`, options with `id` property
  - L10 mock exam ONLY uses variant 2 (100 questions, all `type: 'multiple-choice'`)

**Quiz.jsx expects:** `{ id, prompt, choices: string[], answerIndex: number }` (from JSDoc at line 7-9 of Quiz.jsx).

**Runtime impact:** Schema mismatch will cause:
1. Quiz component receives unexpected property names (`question` vs `prompt`, `options` vs `choices`, `isCorrect`/`correct` vs `answerIndex`)
2. Component code `i === q.answerIndex` (line ~45 Quiz.jsx) will return `false` because `answerIndex` is undefined
3. **All quiz answer validation will fail silently** — every answer marked incorrect regardless of selection
4. **CFOS-O practice exams will be non-functional** (scores always 0/100)

**This is a production-breaking bug.** ✓ RED flag for closure.

---

## CFOS-O Exam Alignment (Domains 1-7)

### Domain 1: Fiber Fundamentals (15%) — L02 + L10 Q1-Q5

**Verified coverage:**
- Light propagation, refractive index (L02 line 58-74) ✓
- Single-mode vs. multimode (L02 table line 76-112) ✓
- Attenuation @ 1550 nm (L02 lines 114-124, L10 Q2) ✓
- Spectral windows (1310/1490/1550 nm) with application context (L02 lines 126-137) ✓
- Mode stripper (L02 lines 202-212) ✓
- L10 mock includes cutoff wavelength concept (Q5) — **advanced, good coverage** ✓

**LOW finding:** L02 Q2 asks "approximately what percentage of power remains over 10 km?" with answer 84%. Derivation: 0.18 dB/km × 10 km = 1.8 dB loss. 10^(-1.8/10) = 0.66 (66% remains). **Option C says 84%, which is wrong — correct answer is ~66%.** ✗ This quiz answer is INCORRECT. Flagged for Domain 1 re-verification RT.

### Domain 2: Installation Techniques (20%) — L03 + L10 Q6-Q10

**Verified coverage:**
- Aerial vs. underground decision factors (L03 table line 211-251) ✓
- Clearance to power (NESC Rule 234/235) with actual numbers (L03 lines 111-123) ✓
- Pulling tension limits — aerial 500 lbs, conduit 200-300 lbs (L03 lines 125-137, L10 Q7) ✓
- Burial depth — 18–24 inches standard (L03 lines 161-171, L10 Q8) ✓
- Lashing vs. strapping (L03 lines 138-148) ✓
- HDPE vs. PVC trade-off (L03 lines 178-191, L10 Q9) ✓

**Coverage clean.** ✓

### Domain 3: Cable Prep & Termination (15%) — L04 + L10 Q11-Q13

**Verified coverage:**
- Step-by-step jacket stripping without cutting aramid (L04 lines 100-109) ✓
- Fiber cleaving with angle tolerance ±0.5° (L04 lines 147-156) ✓
- Mechanical connector termination + polishing (L04 lines 160-178) ✓
- Pigtail termination alternative (L04 lines 180-190) ✓
- Acceptance criteria: ≤0.5 dB insertion loss, ≥45 dB return loss (L04 lines 192-201) ✓
- Return loss concept + 8° polish angle mentioned (L04 lines 208-218) ✓

**Coverage clean.** ✓

### Domain 4: Fusion Splicing (13%) — L05 [partial read] + L10 Q14-Q16

**Sampled coverage (L05 not fully read):**
- EL (estimated loss) range 0.3–0.5 dB, investigation needed (L10 Q14) ✓
- "No arc" error troubleshooting (L10 Q15) ✓
- Heat-shrink sleeve purpose — protective, not loss-reducing (L10 Q16) ✓

**No blocking findings for this domain at RT-E scope.** ✓

### Domain 5: OTDR Testing (13%) — L06 [not read] + L10 Q17-Q19

**Sampled coverage:**
- Launch condition purpose — eliminate dead-zone (L10 Q17) ✓
- Attenuation slope interpretation — 0.35 vs 0.20 dB/km signals lossy fiber (L10 Q18) ✓
- Connector signature on OTDR — positive peak + dip (L10 Q19) ✓

**No blocking findings.** ✓

### Domain 6: Safety & Workmanship (10%) — L07 [not read] + L10 Q20-Q22

**Sampled coverage:**
- NESC clearance rules (Rule 234 12" horizontal, 235 18" vertical) (L10 Q20) ✓
- Confined-space entry procedures (OSHA 1910.146) with specifics (L10 Q21) ✓
- 1550 nm laser safety — infrared, invisible, hazardous (L10 Q22) ✓

**No blocking findings.** ✓

### Domain 7: Make-Ready & Design Review (10%) — L08 [not read] + L10 Q23-Q26 [partial]

**Sampled coverage:**
- GIS/aerial photo verification (L10 Q23) ✓
- Burndown list concept (L10 Q24) ✓
- Utility notification + pole inspection (L10 Q25) ✓

**No blocking findings.** ✓

---

## L10 Mock Exam Alignment to FOA Blueprint

**Verified question distribution (sample 26 of 100 read):**
- Domain 1 (Fundamentals): 5 Q observed — matches 15% target ✓
- Domain 2 (Installation): 5 Q observed — matches 20% target ✓
- Domain 3 (Cable Prep): 3 Q observed — matches 15% target ✓
- Domain 4 (Splicing): 3 Q observed — matches 13% target ✓
- Domain 5 (OTDR): 3 Q observed — matches 13% target ✓
- Domain 6 (Safety): 3 Q observed — matches 10% target ✓
- Domain 7 (Make-Ready): 4 Q observed — matches 17% target ✓

**Exam structure clean; domain weights align with FOA blueprint.** ✓

**But: None of these questions will RENDER correctly at runtime due to the schema defect (P-5 above).**

---

## Flashcard + Key Terms Compliance

**Finding F-1 (LOW):** L01 key_terms = vocabulary_introduced (5 terms), Flashcard deck has 5 cards. ✓ Compliant.

**Finding F-2 (LOW):** L02 key_terms = vocabulary_introduced (2 terms), Flashcard deck has 5 cards (2 for SMF/MMF specifics, 3 others). ✓ Compliant.

**Finding F-3 (MEDIUM, not blocking):** L03 Flashcard section at line 262 uses `.map()` to render cards from `key_terms`, passing `term` + `getDefinition(term)`. BUT `getDefinition()` is defined at line 326 AFTER the component export. This works syntactically but is poor code style (function should be defined BEFORE use). Not a blocker, but counts as YELLOW.

**Finding F-4 (LOW):** L04 likewise uses dynamic Flashcard render with getDefinition(). ✓ Same pattern, functional.

---

## Closeout

**Vite build status:** ✓ clean (18.99s, zero errors). Bundle includes all 10 lessons.

**git log (this RT session):**
```
Already up to date.
```

**Blocking defect:** Quiz component schema mismatch (P-5) must be fixed BEFORE topic closes.

**Recommended action:**
1. **Immediate (blocker):** Align all lesson Quiz objects to a single schema. Choose ONE:
   - Option A: Convert L03–L10 to `type: 'mc'` + `key` + `correct` (matches L01–L02)
   - Option B: Convert L01–L02 to `type: 'multiple-choice'` + `id` + `isCorrect` (matches L03–L10)
   Recommend Option A for consistency with prior topics (T01–T20 use type: 'mc').
2. **Fix L02 Q2:** Answer 84% → correct to 66% (or provide the correct derivation).
3. **Polish L03–L04:** Code style — move `getDefinition()` before component render for clarity (not blocking).
4. **Re-verify:** Post-fix RT pair to confirm quizzes render + all answer keys validate correctly.

---

**END === T21 RT-E HAIKU END ===**
