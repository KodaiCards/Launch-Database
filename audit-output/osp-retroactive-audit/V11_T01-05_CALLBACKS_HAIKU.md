# V11: T01-T05 Spaced-Repetition Callbacks Integrity

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/V11_T01-05_CALLBACKS_HAIKU.md` written.**

## Verification Scope

Audited all 59 lessons across T01–T05 (10 + 12 + 12 + 10 + 15 respectively) for:
1. **Callbacks to prior-topic terms** — explicit prose references back to earlier lessons where foundational vocabulary was introduced
2. **"Tying It Together" closing sections** — metacognitive closing that links current lesson to downstream application
3. **Refresher content** — spaced-repetition callouts for terms introduced 3+ lessons back

---

## Findings by Topic

### T01 — Fundamentals & Vocabulary (10 lessons)

| Lesson | vocab_assumed refs | Tying Together? | Callbacks? | Refresher? | Status |
|---|---|---|---|---|---|
| L01 — OSP vs ISP | 0 | ✗ | ✗ | ✗ | **OPEN** — no foundational prereqs; could reference cable/pole/splice concepts ahead |
| L02 — Parts of a Pole | 1 | ✓ | ✗ | ✗ | **YELLOW** — Tying Together present; missing explicit callback sentence |
| L03 — Parts of a Cable | 2 | ✓ | ✗ | ✗ | **YELLOW** — Tying Together present; missing callback to L02 pole-cable relationship |
| L04 — Inside a Splice Case | 2 | ✗ | ✗ | ✗ | **RED** — no Tying Together; no callback to L02/L03 fiber/components |
| L05 — OSP Project Lifecycle | 3 | ✓ | ✗ | ✗ | **YELLOW** — Tying Together present; missing callback to phases ahead |
| L06 — Who Does What | 2 | ✗ | ✗ | ✗ | **RED** — no Tying Together; could reference L05 roles/phases |
| L07 — Reading a Strand Map | 5 | ✗ | ✗ | ✗ | **RED** — no Tying Together; high vocab_assumed count (L01-05 closure references) missing |
| L08 — Key Acronyms (reference) | 4 | ✗ | ✗ | ✓ | **YELLOW** — refresher/reference format acceptable; but no Tying Together for closing |
| L09 — OSP Standards Landscape | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; could reference T02-T05 scope ahead |
| L10 — Capstone Quiz | 9 | ✗ | ✗ | ✗ | **OPEN** — capstone format; Tying Together N/A by design |

**T01 Summary:** 7/10 lessons missing Tying Together section. 0/10 have explicit callback sentences ("From L02 you learned…"). L01, L04, L06, L07, L09 = RED (structural gaps).

---

### T02 — Fiber Physics (12 lessons)

| Lesson | vocab_assumed refs | Tying Together? | Callbacks? | Refresher? | Status |
|---|---|---|---|---|---|
| L01 — Why Light Travels in Glass | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; should close with T02.L02 preview |
| L02 — Attenuation | 3 | ✓ | ✗ | ✗ | **YELLOW** — Tying Together present; missing T02.L06 callback |
| L03 — Dispersion | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; could reference L02 attenuation + L05 dB |
| L04 — Macrobend & Microbend | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; could reference L02 attenuation loss impact |
| L05 — Decibels (algebra-free) | 2 | ✗ | ✗ | ✗ | **RED** — no Tying Together; references L02/L03 but no Tying Together explicit |
| L06 — Link Budget (worked example) | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; should close with T02.L07 wavelength preview |
| L07 — Wavelength Windows | 6 | ✗ | ✗ | ✗ | **RED** — no Tying Together; should reference attenuation-by-wavelength from L02 |
| L08 — SMF vs MMF Choosing | 5 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T01.L08 acronym callback + T03 cable context |
| L09 — Polarization Mode Dispersion | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; should reference dispersion from L03 |
| L10 — Fiber Characterization Testing | 5 | ✗ | ✓ | ✗ | **YELLOW** — callback present ("recall from T02.L02"); missing Tying Together |
| L11 — Fiber Physics: Field vs Book | 4 | ✗ | ✓ | ✗ | **YELLOW** — callback present (field-vs-spec review); missing formal Tying Together |
| L12 — Capstone Quiz | 9 | ✗ | ✗ | ✗ | **OPEN** — capstone format |

**T02 Summary:** 9/12 lessons missing Tying Together. 2/12 have explicit callbacks (L10, L11). Lessons L01, L03–L09 = RED (no closure linking to prior or next lessons).

---

### T03 — Cable Selection (12 lessons)

| Lesson | vocab_assumed refs | Tying Together? | Callbacks? | Refresher? | Status |
|---|---|---|---|---|---|
| L01 — Loose Tube / Tight Buffer / Ribbon | 5 | ✗ | ✗ | ✗ | **RED** — high vocab_assumed; no Tying Together linking to T02 fiber types |
| L02 — OSP Riser (indoor/outdoor) | 4 | ✗ | ✗ | ✗ | **RED** — no Tying Together; could reference T01 indoor/outdoor concepts |
| L03 — Armor / Jacket Selection | 4 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing environmental/route context from T04 preview |
| L04 — Messenger (lashed vs ADSS) | 6 | ✗ | ✗ | ✗ | **RED** — high vocab_assumed; no Tying Together; missing T05 loading callback |
| L05 — G.652 vs G.657 (bend insensitive) | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; should reference T02.L08 multimode/SMF choice |
| L06 — Cable Sheath / Jacket Material | 4 | ✗ | ✗ | ✗ | **RED** — no Tying Together; environmental durability context missing |
| L07 — Armor Deep Dive | 3 | ✗ | ✓ | ✓ | **YELLOW** — callback + refresher present; but no formal Tying Together section |
| L08 — Drop Cable Selection | 5 | ✗ | ✗ | ✗ | **RED** — no Tying Together; could reference T04 site context |
| L09 — ADSS Span / Wind / Ice Loading | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T05 Rule 250 callback (loading districts) |
| L10 — ICEA / CFR Standards Compliance | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T04 regulatory callback |
| L11 — Cable Spec Reading (datasheet) | 8 | ✗ | ✓ | ✗ | **YELLOW** — callback present (datasheet application); missing Tying Together |
| L12 — Capstone | 16 | ✗ | ✗ | ✗ | **OPEN** — capstone format |

**T03 Summary:** 11/12 lessons missing Tying Together. 2/12 have callbacks (L07, L11). Lessons L01–L06, L08–L10 = RED (significant closure gap; high vocab_assumed not linked back to T02).

---

### T04 — Site Survey & Pre-Engineering (10 lessons)

| Lesson | vocab_assumed refs | Tying Together? | Callbacks? | Refresher? | Status |
|---|---|---|---|---|---|
| L01 — Site Walk (hazard recon) | 9 | ✗ | ✗ | ✗ | **RED** — very high vocab_assumed; no Tying Together; missing T18 safety callback |
| L02 — Drone / LIDAR Survey | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; could reference L01 hazard-context |
| L03 — GIS / Landbase / Coordinates | 4 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T01 strand-map callback |
| L04 — Pole Audit (attachment measurement) | 8 | ✗ | ✗ | ✗ | **RED** — high vocab_assumed; no Tying Together; missing T01 pole-parts callback |
| L05 — Route Alternatives | 5 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T03 cable-environment reference |
| L06 — KMZ / Shapefile / PDF Deliverables | 4 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T03 cable-spec reference |
| L07 — 47 CFR Part 32 Record Keeping | 4 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T05 NESC callback |
| L08 — Handoff to Design | 10 | ✗ | ✗ | ✓ | **YELLOW** — refresher present; missing Tying Together + callback |
| L09 — RUS Pre-Engineering | 9 | ✗ | ✗ | ✓ | **YELLOW** — refresher present; missing Tying Together + callback |
| L10 — Capstone | 10 | ✗ | ✗ | ✗ | **OPEN** — capstone format |

**T04 Summary:** 10/10 lessons missing Tying Together. 0/10 have explicit callbacks. L01–L07 = RED (very high vocab_assumed with no closure linking back to T01–T03).

---

### T05 — NESC & Pole Loading (15 lessons)

| Lesson | vocab_assumed refs | Tying Together? | Callbacks? | Refresher? | Status |
|---|---|---|---|---|---|
| L01 — What NESC Is (how to read it) | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; should preview Rule 232 ahead |
| L02 — Vertical Clearance (Rule 232) | 2 | ✗ | ✗ | ✓ | **YELLOW** — refresher present; missing Tying Together + explicit callback to L01 |
| L03 — Comm-to-Supply Separation (Rule 235) | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; could reference L02 clearance principle |
| L04 — Grades of Construction | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T01/T02 cable-grade callback |
| L05 — Pole Loading (forces on a pole) | 5 | ✗ | ✗ | ✗ | **RED** — high vocab_assumed; no Tying Together; missing T01 pole-parts callback |
| L06 — Loading Districts (Rule 250) | 7 | ✗ | ✗ | ✗ | **RED** — high vocab_assumed; no Tying Together; missing T04 geography callback |
| L07 — Sag & Tension (how cable hangs) | 7 | ✗ | ✗ | ✗ | **RED** — high vocab_assumed; no Tying Together; missing T03 cable-span callback |
| L08 — Joint Use (who owns what) | 4 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T01 utility-types callback |
| L09 — OTMR in Aerial Design | 3 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T03/T05 loading callback |
| L10 — ADSS Aerial Design | 8 | ✗ | ✗ | ✗ | **RED** — high vocab_assumed; no Tying Together; missing T03/T05 callback |
| L11 — OPGW & Hybrid Cables | 7 | ✗ | ✗ | ✗ | **RED** — high vocab_assumed; no Tying Together; missing T03 cable-type callback |
| L12 — PON/FTTH Aerial Topology | 9 | ✗ | ✗ | ✗ | **RED** — high vocab_assumed; no Tying Together; missing T02 wavelength callback |
| L13 — Make-Ready in Design | 6 | ✗ | ✗ | ✗ | **RED** — no Tying Together; missing T01/T04 context callback |
| L14 — Aerial Design QA Checklist | 11 | ✗ | ✗ | ✗ | **RED** — very high vocab_assumed; no Tying Together; could integrate T01–T04 cross-refs |
| L15 — Capstone | 13 | ✗ | ✗ | ✗ | **OPEN** — capstone format |

**T05 Summary:** 14/15 lessons missing Tying Together. 0/15 have explicit callbacks. L01–L14 = RED (highest vocab_assumed counts across all topics; closure entirely absent).

---

## Aggregate Verdict

| Topic | Total | Tying Together | Callbacks | Refresher | RED lessons | YELLOW lessons |
|---|---|---|---|---|---|---|
| **T01** | 10 | 3 (30%) | 0 (0%) | 1 (10%) | 6 | 3 |
| **T02** | 12 | 1 (8%) | 2 (17%) | 0 (0%) | 9 | 2 |
| **T03** | 12 | 0 (0%) | 2 (17%) | 1 (8%) | 10 | 2 |
| **T04** | 10 | 0 (0%) | 0 (0%) | 2 (20%) | 7 | 2 |
| **T05** | 15 | 0 (0%) | 0 (0%) | 1 (7%) | 14 | 1 |
| **Total** | 59 | 4 (7%) | 4 (7%) | 5 (8%) | 46 | 10 |

---

## Key Gaps

1. **Tying It Together sections missing in 55/59 non-capstone lessons (93%).** The spaced-repetition mandate requires every lesson to close with an explicit link-ahead or link-back ("From T02.L01, you learned…"; "Next in T02.L07, we'll…"). Only T01 (30%) has moderate coverage; T02–T05 average 2% coverage.

2. **Explicit callbacks absent in 55/59 lessons (93%).** "Recall from L02" or "Remember from T01.L03" prose references are the primary spaced-repetition mechanism for <1% error bar. Currently 4 lessons have them; 55 do not.

3. **Refresher content rare (5/59 = 8%).** For lessons with high vocab_assumed counts (T05.L14 has 11 upstream vocabulary items), a refresher section re-introducing terms 3+ lessons back is missing.

4. **T05 worst affected.** As the last foundational topic before cert tracks, T05 lessons have the highest vocab_assumed density (avg 5.6 per lesson) but ZERO Tying Together sections and ZERO callbacks. Learners finish T05 with no closure signal before cert prep.

---

## Closure

The curriculum violates the prerequisite-invariant closure requirement: lessons must explicitly re-anchor learners to prior-lesson foundations before introducing new vocabulary. This gap is systematic across all 5 topics and poses a concrete <1% error risk for learners attempting cert exams without spaced-repetition anchors.

**Severity: MEDIUM.** No syntax errors or missing-component blockers. Content integrity unaffected. But pedagogical effectiveness is compromised for learners who skip back through lessons out of sequence — they lack the explicit closure signals that re-establish context.

**Recommendation:** Author a follow-up wave to add Tying Together sections + callback sentences to every non-capstone lesson per topic. Estimate ~30-60 min per topic.

---

=== V11 HAIKU END ===
