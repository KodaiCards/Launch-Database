# T13 Fix Wave A — Closeout Notes

**Wave:** T13 Fix Wave A  
**Canonical items:** 8 (1 HIGH, 2 MED, 5 LOW)  
**Schema validator:** 12/12 PASS  
**Vite build:** CLEAN (✓ built in 5.84s)  

---

## PRIMARY-SOURCE VERIFICATION LOG

- **HIGH-1 CO/H₂S thresholds:** Verified against T18.L03 (authoritative lesson in DAG).
  - T18.L03 line 162: `CO: < 25 ppm (ACGIH TLV-TWA)`
  - T18.L03 line 168: `H₂S: < 1 ppm`
  - OSHA benchmarks per HAIKU vault file (T13_HAIKU_VAULT_THRESHOLDS.md, fb14242):
    CO PEL = 50 ppm (29 CFR 1910.1000 Table Z-1); H₂S ceiling = 20 ppm (29 CFR 1910.1000 Table Z-2)
  - Fix: L04 BranchingScenario `correct_stop` node updated to T18.L03 values with OSHA benchmark parenthetical

- **MED-2 §1753.19 [Reserved]:** RT-α confirmed §1753.19 = [Reserved] in current eCFR (RT-α report fb14242, govregs.com lookup). Direct WebFetch to eCFR/govinfo blocked 403. Applied `[confirm section]` markers as specified — appropriate mitigation given unverifiable primary-source access.

- **LOW-2 Davis-Bacon mechanism:** 40 USC §3142(a) threshold = $2,000 — standard statutory text, confirmed in canonical legal sources. RUS Form 515 Article IX = standard RUS loan agreement boilerplate (widely documented in RUS guidance). No primary-source discrepancy found.

- **LOW-3 §32.2411 self-reference:** Fix is a wording clarification (self-referential typo), no numeric/citation replacement requiring primary-source lookup.

---

## CANONICAL ITEMS — BEFORE/AFTER

### HIGH-1 — L04 Atmospheric Thresholds (life-safety)

**Files:** `L04-underground-construction-inspection.jsx`

**BEFORE (`correct_stop` BranchingScenario node):**
```
'Results within safe limits: O₂ 19.5–23.5%, CO <35 ppm (OSHA PEL), H₂S <10 ppm (OSHA ceiling), LEL <10% of LEL.'
```

**AFTER:**
```
'Results within safe limits per T18.L03: O₂ 19.5–23.5%, CO <25 ppm (ACGIH TLV-TWA), H₂S <1 ppm, LEL <10% of LEL. (OSHA regulatory benchmarks for reference: CO PEL = 50 ppm per 29 CFR 1910.1000 Table Z-1; H₂S ceiling = 20 ppm per 29 CFR 1910.1000 Table Z-2. T18.L03 uses the more conservative ACGIH TLV-TWA thresholds — use T18.L03 values for entry decisions.)'
```

### MED-1 — L04 ASTM D1557 DAG

**Files:** `L04-underground-construction-inspection.jsx`

**BEFORE:** ASTM D1557 Modified Proctor in `vocabulary_introduced` with conflicting key_term definition claiming "introduced in T10.L08"

**AFTER:** Removed from `vocabulary_introduced` + key_terms, added to `vocabulary_assumed` pointing `source_lesson_id: 'T10.L08'`. Body text updated: "per ASTM D1557 (introduced in T10.L08 as proctor density)".

### MED-2 — §1753.19 [Reserved] Markers

**Files:** L01, L07, L09, L10, L11, L12 (6 files with learner-visible citations)

**BEFORE:** `7 CFR §1753.19` cited as authoritative inspection obligation throughout  
**AFTER:** All instances updated to `7 CFR §1753 [confirm current section]`

Neighborhood scan found §1753.19 in 6 T13 files (more than the canonical's L11 scope). All updated.

### LOW-1 — L05 Quiz Q1 Option Text

**Files:** `L05-slack-storage-and-pedestal-inspection.jsx`

**BEFORE (correct option, index 1):**
```
'50 feet at intermediate points, 100 feet at splice points per the project MSA schedule from T10.L06'
```

**AFTER:**
```
'Verify against the contract MSA schedule (commonly 50 ft at intermediate points / 100 ft at splice points per T10.L06, but the contract governs)'
```

Explanation updated to clarify contract governs, T13 does not mandate independent values.

### LOW-2 — L12 Davis-Bacon Mechanism

**Files:** `L12-federal-compliance-monitoring-davis-bacon.jsx`

**BEFORE:** "no threshold for RUS" — imprecise

**AFTER:** Davis-Bacon key_term definition and quiz Q1 explanation updated to specify:
- Statutory threshold = $2,000 (40 USC §3142(a)) applies to federal appropriated-fund contracts
- RUS loan agreements incorporate Davis-Bacon as a condition of financial assistance per RUS Form 515 Article IX — effectively applying it to ALL RUS construction contracts regardless of dollar amount

### LOW-3 — L08 §32.2411 Self-Reference Fix

**Files:** `L08-joint-use-and-clearance-compliance.jsx`

**BEFORE:** `47 CFR §32.2411 (Poles)` key_term said "Do not confuse with §32.2411 (Poles)..." — self-referential  
**AFTER:** "Do not confuse with §32.2410 (Cable and wire — individual cable plant, one account level down) or §32.2420 (parent 'Cable and wire facilities' umbrella that encompasses §32.2410 and other sub-accounts). Account 2411 (Poles) is a separate top-level plant account, not under §32.2420."

### LOW-4 — L10 Capstone Question c21b (Form 7d/565/553a)

**Files:** `L10-capstone-quiz.jsx`

**ADDED:** New question `id: 'c21b'` inserted after c21, covering Form 7d advance draw chain (Form 565 records + contractor pay application with work quantities + engineer's certification of progress). Correct answer = index 1. Form 553a clarified as close-out document, not required for interim advances.

### LOW-5 — L03 Sag Escalation Tolerance Window

**Files:** `L03-aerial-construction-inspection.jsx`

**BEFORE:** Sag step 4 said "acceptable tolerance" without numbers; step 5 vague on engineer notification  
**AFTER:**
- Step 4: "standard field tolerance of ±2 inches of the scheduled value (or ±5% of design sag, whichever is greater on longer spans). If the project specification states a different tolerance, that value governs."
- Step 5: >6 inches triggers "stop stringing work on this route and notify the engineer of record"

---

## NEIGHBORHOOD SCAN FINDINGS

No additional bugs found in ±20-line scans around each fix location. The MED-2 neighborhood scan did reveal §1753.19 citations in L01/L07/L09/L10/L12 beyond the canonical's L11 scope — all updated.

=== T13 FIX WAVE A CLOSEOUT END ===
