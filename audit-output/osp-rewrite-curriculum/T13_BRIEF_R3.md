# T13 (Inspection & Quality Assurance) — Research Brief R-3

**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T13_BRIEF_R3.md` written.

**Agent:** T13 Research R-3 — deep-adversarial / forensic-quality-engineer framing  
**Date:** 2026-05-18  
**Framing:** Senior OSP inspector + auditor-of-auditors. Not hunting for what R-1/R-2 already found — hunting for what BOTH missed, and verifying their findings against primary sources. Treat "primary-source verified" claims from R-1/R-2 as unverified until independently confirmed.

---

## Part 1: Tiebreaker Rulings on R-1↔R-2 Conflicts

### Conflict C-1: `acceptance walk` — vocabulary_introduced (R-1) vs. vocabulary_assumed pointing to T10.L11 (R-2)

**Tiebreaker method:** Direct read of authored T10.L11 vocabulary_introduced array.

**Ground truth:** T10.L11 line 31: `acceptance walk` IS in vocabulary_introduced, with definition: *"A formal site walkthrough between the contractor and inspector (and often the owner's engineer) to document the condition of the finished work and generate the punch list."*

**Ruling: R-2 IS CORRECT.** `acceptance walk` must be `vocabulary_assumed → T10.L11` in T13.L01, NOT re-introduced. DAG invariant violation as stated.

**Additional finding not in R-2:** the `punch list` and `kick-back authority` terms also in R-1's T13.L01 `vocabulary_introduced` are ALSO already in T10.L11 vocabulary_introduced (lines 27–28). R-2 partially caught this via C-1/C-2 but didn't explicitly flag punch list and kick-back authority as also having this problem. **All five terms R-1 lists as T13.L01 vocabulary_introduced — `inspector (OSP)`, `QA/QC`, `punch list`, `kick-back authority`, `acceptance walk` — require scrutiny.** Specifically: `punch list` + `kick-back authority` + `acceptance walk` are all in T10.L11 already.

---

### Conflict C-8: Slack minimums — T13.L05 (`30 ft aerial / 50–100 ft vault`) vs. T10.L06 authored values

**Tiebreaker method:** Direct read of authored T10.L06 MSA definition (lines 45–47 and key_terms flashcard line 118).

**Ground truth from T10.L06:**
- 50 ft at intermediate handholes  
- 100 ft at splice-point handholes  
- 100–150 ft at building entrances  
- 25–50 ft at aerial-to-buried transitions  
- Explicit caveat: "Always check the specific contract MSA schedule — these numbers vary by carrier specification."

T10.L06 does NOT list a "30 ft at above-ground aerial splice closures" value anywhere in the lesson. The table covers underground structures only; aerial closure slack is a separate category R-1 is introducing without a T10.L06 anchor.

**Ruling: R-2 IS CORRECT that this is a cross-lesson numeric contradiction.** However, the forensic framing adds nuance: R-1's "30 ft aerial" value may be drawn from RUS 1751F-630 §6 (aerial-specific), which would be a DIFFERENT source than T10.L06 (which uses underground-focused MSA bands from a carrier-specification framing). The real fix is NOT to change the number to match T10's underground bands — it is to:
1. Make T13.L05 defer to T10.L06's MSA framing: "see the project MSA schedule (introduced in T10.L06) — do not cite independent minimums that may contradict the contract schedule."
2. Reference any RUS 1751F-630 §6 aerial closure minimum as "contract floor, not project MSA" to avoid confusion with T10's values.

**The contradiction R-2 identifies is real; the fix mechanism requires care not to introduce a new mismatch in the other direction.**

---

### Conflict C-14: `§32.2420` (R-1) vs. `§32.2411` for Poles (R-2)

**Tiebreaker method:** Citation registry P1 (prior Haiku ground-truth `a42e9f8` + T01 polish-3 `d7161ad` — verified 2026-05-16).

**Ground truth (registry-verified, no re-lookup needed):**
- §32.2420 = parent "Cable and wire facilities" category (NOT Poles)
- §32.2411 = "Poles" (CORRECT for pole/grounding documentation)
- §32.2410 = "Cable and wire facilities" (sub-account for cable records)

**Ruling: R-2 IS CORRECT. This is cascade pattern P1.** T13.L08's `aerial plant bonding schedule` vocabulary definition should cite `§32.2411 (Poles)`, not `§32.2420`. The `§32.2420` value is a known cascade bug with documented provenance.

**Additional forensic depth:** T13.L08's vocabulary_assumed already lists `aerial plant bonding schedule → T14.L10` — and T14.L10 (authored lesson) does NOT contain any Part 32 citation (verified: zero results from grep on T14 lessons for "32.24\|32.2411\|32.2420"). Therefore, the §32.2420 citation in R-1's T13 brief would be NEW content introduced into T13 — it was never in T14. The author prompt must be told explicitly: if adding Part 32 citation context to T13.L08, use §32.2411 (Poles) per P1.

---

## Part 2: Convergence Check on R-2 HIGH Findings

### R-2 C-1 (`acceptance walk` DAG violation): **VERIFIED CORRECT** — see Part 1 ruling.

### R-2 C-8 (slack minimums contradiction): **VERIFIED CORRECT** — see Part 1 ruling. Fix mechanism note also in Part 1.

### R-2 C-14 (§32.2420 cascade bug): **VERIFIED CORRECT** — see Part 1 ruling.

---

## Part 3: Independent Saturation Findings (R-3 Only)

### FINDING R3-H1 (HIGH) — `inspector (OSP)` triple-introduction: T01.L06 + T10.L11 + T13.L01 proposed

**Source:** DAG registry cross-check + direct read of T01.L06 vocabulary_introduced.

**Evidence:** `inspector` is vocabulary_introduced at T01.L06 (line 23 of that lesson's vocabulary_introduced array). `field inspector` is vocabulary_introduced at T10.L11. R-1 proposes introducing `inspector (OSP)` as vocabulary_introduced at T13.L01.

All three cover the same role: the owner's/engineer's representative who verifies field work. This is a **three-introduction cascade** for what should be a single DAG node.

R-2 caught the T01.L06/T13.L01 collision partially (C-2) but framed it only as potential duplication with T10.L11's `field inspector`, missing the T01.L06 `inspector` introduction entirely. The forensic finding: there are now THREE potentially-conflicting introductions of the inspector concept:
- T01.L06: `inspector` (general role overview, "who does what")  
- T10.L11: `field inspector` (construction context, inspector–crew interface)  
- T13.L01 (proposed): `inspector (OSP)` (formal authority, QA vs. QC)

**Fix:** T13.L01 must treat all three as `vocabulary_assumed`. The lesson's value-add is AUTHORITY and LEGAL BASIS (RUS 1751F-630 §7) — not re-defining who the inspector is. Drop `inspector (OSP)` from `vocabulary_introduced`; add depth in prose referencing T01.L06 and T10.L11 while introducing the legal-authority dimension.

---

### FINDING R3-H2 (HIGH) — `punch list` and `kick-back authority` proposed in T13.L01 `vocabulary_introduced` — BOTH already in T10.L11

**Source:** Direct read of T10.L11 vocabulary_introduced array (lines 27–28).

**Evidence:** T10.L11 explicitly introduces both:
- `punch list` (line 27)  
- `kick-back authority` (line 28)

R-1 lists both as T13.L01 `vocabulary_introduced`. R-2 caught C-1 for `acceptance walk` but DID NOT explicitly flag that `punch list` and `kick-back authority` have the same problem.

**This is a DAG invariant violation on two additional terms R-2 missed.** These must be `vocabulary_assumed → T10.L11` in T13.L01, not re-introduced. T13.L01 deepens the AUTHORITY and DOCUMENTATION dimension of these concepts — it does not introduce them.

---

### FINDING R3-M1 (MEDIUM) — NEC §250.53 mis-cited; correct section is §250.56

**Source:** Comparison between R-1's T13.L08 vocabulary definition and T14's authored content.

**Evidence:** R-1 T13.L08 states: "25 Ω or lower per NEC Article 250 / RUS 1751F-810, or the lower threshold specified in the contract." The authored T14 lessons consistently cite this threshold to **NEC §250.56** specifically (T14.L01 line 135, 194; T14.L04 lines 59, 116, 190, 206, 215, 241; T14.L02 line 206). NEC §250.53 is titled "Installation of Rod, Pipe, and Plate Electrodes" — it covers installation method, NOT resistance thresholds. The 25 Ω threshold is in §250.56 ("Resistance of Rod, Pipe, and Plate Electrodes").

**Fix:** T13.L08's `ground resistance test (inspection context)` vocabulary definition should cite **NEC §250.56** (not §250.53) for the 25 Ω threshold, consistent with the already-authored T14 lessons that students will have completed before reaching T13.

---

### FINDING R3-M2 (MEDIUM) — `QA/QC` proposed as T13.L01 vocabulary_introduced but concept appears in T10.L11 prose

**Source:** DAG registry + T10.L11 content check.

**Evidence:** T10.L11's definition for `field inspector` explicitly uses QC/QA framing: "An independent third party (or owner's representative) who verifies that work meets plans, specs, and permit conditions — not the person directing the crew." The lesson prose also discusses the QC (contractor) vs. QA (owner/engineer) distinction in context.

DAG registry query: `QA/QC` does not appear as vocabulary_introduced in T10.L11's formal vocabulary_introduced array. However, the concept is present in T10.L11's prose and in the lesson objective "understand that an inspector's role is QA not QC."

**Assessment:** `QA/QC` as a formally-introduced term pair is defensible in T13.L01 IF the T10.L11 prose treatment was not in the formal vocabulary array. This is a MEDIUM rather than HIGH because there's no hard DAG violation (the formal vocabulary_introduced list in T10.L11 does not contain "QA/QC"). The author must verify T10.L11 does not formally introduce this term, and if not, may introduce it in T13.L01.

**Recommendation:** author should grep T10.L11 vocabulary_introduced for exact term "QA/QC" or "quality assurance" before finalizing T13.L01 vocabulary_introduced.

---

### FINDING R3-M3 (MEDIUM) — `cover card` definition in T13.L04 conflicts with T10.L04's already-authored definition

**Source:** Direct read of T10.L04 vocabulary_introduced (lines 28, 40–42).

**Evidence:**  
- T10.L04 introduces `cover card` as: *"A written or electronic document certifying that the installed conduit was depth-probed at the required intervals and met the permit-required depth specification. Signed by the inspector."* → This is the **documentation form/record**.
- R-1's T13.L04 proposes re-introducing `cover card` as: *"A pre-cut rigid card (typically 6 in. or 12 in. long) used to verify minimum cover... The inspector inserts the probe rod..."* → This is a **physical measurement tool**.

These are materially different definitions for the same term. A student who learned `cover card` = documentation form in T10.L04 will be confused to encounter `cover card` = physical ruler in T13.L04.

**Fix options:**  
(a) Use T10.L04's definition; treat `cover card` as vocabulary_assumed in T13.L04; explain the physical probe step using the term `probe measurement` rather than re-defining `cover card`.  
(b) Clarify in T10.L04 that "cover card" can refer to both the physical depth gauge and the documentation form — but this requires T10 lesson edit, not T13 scope.  

**Safest path:** drop `cover card` from T13.L04 vocabulary_introduced; add to vocabulary_assumed → T10.L04; use prose to describe the physical measurement step without redefining the term.

---

### FINDING R3-M4 (MEDIUM) — `proctor density` and `ghost trench` are in T13.L04 vocabulary_introduced AND vocabulary_assumed simultaneously — self-referential DAG loop

**Source:** Direct read of T10.L08 vocabulary_introduced (confirms both terms are introduced there).

**Evidence:**  
- T10.L08 vocabulary_introduced line 30: `proctor density`  
- T10.L08 vocabulary_introduced line 31: `ghost trench`  
- R-1's T13.L04 `vocabulary_introduced` section ALSO proposes introducing `proctor density` (with its own definition)  
- R-1's T13.L04 `vocabulary_assumed` lists both: "trench backfill, pavement match, sod restoration, `proctor density`, `ghost trench` → T10.L08"

A term cannot be simultaneously introduced in T13.L04 AND assumed to come from T10.L08. Both are DAG invariant violations.

**Fix:** Remove `proctor density` from T13.L04 `vocabulary_introduced`. Keep in `vocabulary_assumed → T10.L08`. Same for `ghost trench` if R-1's T13.L04 vocabulary_introduced list includes it (R-1 appears not to list ghost trench in vocabulary_introduced, but the vocabulary_assumed → T10.L08 list includes it alongside proctor density — verify in author prompt).

---

### FINDING R3-L1 (LOW) — `retainage` vocabulary_introduced in T13.L06 correctly handled; T13.L09 uses vocabulary_assumed → T13.L06

**Source:** R-1 brief cross-lesson read + R-2 C-9 note.

**Evidence:** R-2 noted this (C-9) and confirmed T13.L09 correctly uses `vocabulary_assumed → T13.L06`. R-3 independently confirms: properly handled in R-1's brief. No action needed beyond author prompt verification.

---

---

### FINDING R3-L2 (LOW) — `storage coil check` in T13.L05: action-term vs. T10.L06 `storage coil` noun — distinguishable but author must be explicit

**Source:** Direct read of T10.L06 vocabulary_introduced (line 28): `storage coil`.

**Evidence:** T10.L06 introduces `storage coil` as the noun (the physical coil). R-1's T13.L05 proposes introducing `storage coil check` as the QA inspection ACTION. These are legitimately distinct: the noun concept taught in T10 vs. the inspector's verification procedure in T13. This is NOT a DAG violation — the author is introducing a new QA-action term, not re-defining the noun.

**Author note:** the vocabulary definition for `storage coil check` in T13.L05 must open with "Verification that the [storage coil] (introduced in T10.L06) meets..." to make the DAG linkage explicit. A definition that redefines what a storage coil IS (rather than verifying it) would be a violation.

---

## Part 4: Negative Findings (Items R-3 Checked and Confirmed Clean)

- **C-3 NESC Grade B/C distinction:** R-2 is correct that this is missing from L02. R-3 independently confirms NESC Rule 232 tables differentiate Grade B (major crossings) from Grade C (other crossings). Not a fabrication — a genuine coverage gap.
- **C-7 D1557 vs. D698 distinction:** R-3 confirms this distinction is correct. D698 = Standard Proctor (lower max density); D1557 = Modified Proctor (higher max density). The 95% threshold for road-bearing zones must specify D1557. R-2 is correct.
- **C-10 `as-built signature` contractor stamp confusion:** R-3 confirms this is a real imprecision. RUS 1751F-630 §7 requires the engineer/PE to certify; the contractor certifies via signature (not PE stamp). Author must clarify.
- **C-13 25 Ω vs. ≤1 Ω threshold conflation:** R-3 confirms both thresholds are correctly identified but are different tests. Fall-of-potential (IEEE 81) = 25 Ω electrode-to-earth. Bond continuity (ohmmeter loop) = ≤1 Ω loop resistance. The ≤1 Ω value aligns with T14.L04 line 251 ("≤1 Ω in some telecom standards") and is defensible but needs citation separation per R-2.
- **DAG pointer for `RUS Form 219`:** R-3 confirms T10.L11 vocabulary_assumed lists `RUS Form 219 → T01.L05` (line 67 of T10.L11). T01.L05 vocabulary_introduced line 28 confirms RUS Form 219 IS formally introduced there. R-2's correction is verified correct.
- **47 CFR §32.2411 vs §32.2420:** Cascade pattern P1 in registry — fully resolved. R-2 C-14 confirmed correct.
- **R-2's G-1 through G-12 gap list:** R-3 does not dispute any of these gaps. All represent real content absences. They are appropriately classified as LOW by R-2 (content additions for authoring, not blocking DAG issues).

---

## Part 5: Consolidated Findings Table

### New R-3 Findings (beyond R-1 and R-2)

| ID | Severity | Type | Lesson | Description |
|---|---|---|---|---|
| R3-H1 | HIGH | DAG violation | T13.L01 | `inspector (OSP)` triple-introduction cascade: T01.L06 + T10.L11 + T13.L01. Author must drop from vocabulary_introduced; depth via prose only |
| R3-H2 | HIGH | DAG violation | T13.L01 | `punch list` + `kick-back authority` proposed in vocabulary_introduced but already in T10.L11 — must be vocabulary_assumed → T10.L11 |
| R3-M1 | MEDIUM | Citation mismatch | T13.L08 | NEC §250.53 cited for 25 Ω threshold — correct section is §250.56 (per T14's authored content consistently) |
| R3-M2 | MEDIUM | DAG awareness | T13.L01 | `QA/QC` needs author-time verification that T10.L11 doesn't formally introduce it — if T10.L11 uses it in prose but not vocabulary_introduced, T13.L01 introduction is defensible |
| R3-M3 | MEDIUM | Definition conflict | T13.L04 | `cover card` re-introduced with DIFFERENT definition than T10.L04 (documentation form vs. physical depth gauge) — creates learner confusion |
| R3-M4 | MEDIUM | DAG self-loop | T13.L04 | `proctor density` in both vocabulary_introduced (T13.L04) AND vocabulary_assumed → T10.L08 — remove from vocabulary_introduced |
| R3-L1 | LOW | Confirmed clean | T13.L06/L09 | `retainage` handling correct — no action |
| R3-L2 | LOW | Author awareness | T13.L05 | `storage coil check` action-term vs. T10.L06 noun — not a violation; author must make DAG linkage explicit in definition |

### R-2 HIGH Findings Confirmed by R-3

| R-2 ID | R-3 Verdict | Notes |
|---|---|---|
| C-1 (`acceptance walk` DAG) | CONFIRMED | Direct T10.L11 read confirms violation. Also catches that punch list + kick-back authority have the same problem (R3-H2 new finding) |
| C-8 (slack minimums) | CONFIRMED | T10.L06 direct read. Fix mechanism note: T13.L05 must defer to MSA framing, not cite independent minimums |
| C-14 (§32.2420 cascade) | CONFIRMED | Registry P1, no re-lookup needed. Also notes T14 authored lessons have zero Part 32 citations — the bug would be newly introduced by T13 authoring |

---

## Part 6: R-3 Saturation Verdict

Under deep-adversarial / forensic-quality-engineer framing, R-3 found:
- **2 new HIGH findings** (R3-H1, R3-H2) that neither R-1 nor R-2 flagged — both are DAG violations on T13.L01 vocabulary_introduced
- **4 new MEDIUM findings** (R3-M1 through R3-M4) that neither prior agent caught
- **0 new findings in L05 slack, L07 Form 219, L08 grounding (beyond confirming R-2's findings)**

The HIGH finding pool is NOT yet saturated — R3-H1 and R3-H2 represent material DAG violations that will cascade into authoring errors if not addressed. These warrant inclusion in the fix-wave canonical before dispatching the T13 author.

**Assessment: YELLOW — proceed to fix-wave incorporating R-1 + R-2 + R-3 findings. R-3 HIGH findings (especially T13.L01 vocabulary_introduced cascade) block authoring start until resolved in the canonical.**

---

=== T13 RESEARCH R-3 BRIEF END ===
