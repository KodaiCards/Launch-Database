# T5 Lesson Verification — Red Team B
**Framing:** Cross-lesson + cross-topic + boundary + brief-fidelity  
**Date:** 2026-05-14  
**Scope:** All 13 T5 lessons (L5.1 through L5.12, including L5.2a/b split)  
**Read-only — no code or content modified**

---

## 1. Brief-Fidelity Table

| Lesson | Scope match | Duration match | Intensity match | Citations match | Status |
|---|---|---|---|---|---|
| 5.1 Pole Hardware | ✓ ANSI O5.1 5-7 min section present; NACE SP0286 callout present | ✓ 30 min | ✓ HIGH-INTENSITY | ✓ All brief citations in YAML sources | PASS |
| 5.2a Strand Grade Selection | ✓ ADSS 2-paragraph sidebar; aluminum sidebar 1 paragraph | ✓ 25 min | ✓ HIGH-INTENSITY | ✓ A475/A475M cited correctly | PASS |
| 5.2b Sag-Tension Derivation | ✓ Full 6-step derivation; Macon GA Light; all three grades tested | ✓ 20 min | ✓ HIGH-INTENSITY | ✓ IEEE 1222 §5 primary | PASS |
| 5.3 Lashing Wire | ✓ Gap criterion flagged with authoring guard; gap quiz excluded | ✓ 20 min | ✓ STANDARD | ✓ TIA-758-C §5.3; ASTM A641 | PASS |
| 5.4 Cable Hangers | ✓ 3 contexts; J-hook, conduit hanger, aerial strand hanger | ✓ 20 min | ✓ STANDARD | ✓ NEC §800.24 | PASS |
| 5.5 Aerial Drop | ✓ 5 elements; service loop 2 ft; drip loop 12 in. | ✓ 20 min | ✓ STANDARD | ✓ TIA-758-C §5.4; NEC Art. 800 | PASS |
| 5.6 Underground Hardware | ✓ ANSI/SCTE 77 primary; Tier 22 explicitly banned from [CORRECT]; AASHTO cross-ref | ✓ 30 min | ✓ HIGH-INTENSITY | ✓ ANSI/SCTE 77; OSHA 1910.146 pointer | PASS |
| 5.7 Direct-Bury Marking | ✓ Three-layer system; tracer wire per RUS 1751F-635 §3; 500-ft marker interval | ✓ 20 min | ✓ HIGH-INTENSITY | ✓ TIA-758-C §6.4; APWA | PASS |
| 5.8 Pedestals/Cabinets | ✓ NEMA 1/3R/4/4X covered; T4 L4.12 ref present; no FDH grounding | ✓ 25 min | ✓ STANDARD | ✓ NEMA 250; RUS 1751F-635 §5 | PASS |
| 5.9 FDH | ✓ Growth factor 1.20; formula subscriber × 1.20 only; 7 CFR 1755 + PE-60; no grounding | ✓ 30 min | ✓ HIGH-INTENSITY | ✓ 7 CFR Part 1755; RUS PE-60 | PASS |
| 5.10 Terminals | ✓ Network layer diagram; MST specs; 7 CFR 1755 + PE-60 | ✓ 25 min | ✓ STANDARD | ✓ 7 CFR Part 1755; RUS PE-60 | PASS |
| 5.11 Storage | ✓ All 3 contexts; 18-in. pole bracket; 10 m slack; Velcro only | ✓ 20 min | ✓ STANDARD | ✓ TIA-758-C §6.4; RUS 1751F-635 §4 | PASS |
| 5.12 Labeling | ✓ Physical hardware only; cross-refs to T4 L4.10 and T3 L3.12 at open | ✓ 20 min | ✓ STANDARD | ✓ TIA-758-C §9; RUS 1751F-630 §9 | PASS |

**Brief-fidelity: 13/13 PASS**

---

## 2. Seven Pre-Resolved Decisions in Lessons

| Decision | Status | Location/Quote |
|---|---|---|
| G1 — NACE SP0286 callout in L5.1 | ✓ VERIFIED | L5.1 §"Galvanic Compatibility Callout Box": "galvanic isolation required … zinc-coated steel washers or stainless interface hardware … [NACE SP0286 §3.2, §4.1]" |
| G2 — ADSS 2-paragraph sidebar in L5.2a | ✓ VERIFIED | L5.2a §"ADSS Sidebar": two distinct paragraphs; office note present |
| G3 — ANSI O5.1 5-7 min section in L5.1 | ✓ VERIFIED | L5.1 §"ANSI O5.1 Pole Grading and Class Selection (5–7 min)" present with class table and worked example |
| D-L56 — ANSI/SCTE 77 primary; "Tier 22" banned from [CORRECT] | ✓ VERIFIED | L5.6 Q1 Option D: "D — Incorrect. 'Tier 22' is an informal vendor shorthand… correct citation is ANSI/SCTE 77 Class 22.5" |
| D-L59a — Growth factor 1.20; formula is subscriber × 1.20 only | ✓ VERIFIED | L5.9 §"FDH Sizing — Growth Factor 1.20 (LOCKED)": "Minimum required port count = subscriber count × 1.20"; Q2 option D explicitly refutes × split ratio × 1.20 |
| D-L59b/L510 — 7 CFR Part 1755 + RUS PE-60; NOT RUS 1738 | ✓ VERIFIED | L5.9 and L5.10 both cite 7 CFR Part 1755 + PE-60; both include explicit "NOT RUS 1738" notes |
| D-Moodle — Slug `osp-hardware-accessories` in YAML frontmatter | ✓ VERIFIED | All 13 lessons: `topic: osp-hardware-accessories` |

**7/7 decisions present in lessons.**

---

## 3. L5.12 Boundary Check

L5.12 is **clean**. Physical hardware owned correctly:
- Tag material (316 SS, UV-polyester): present
- Attachment method (lashing wire loop): present
- Marker post intervals: references L5.7 as authoritative (not re-derived)
- BOM placement table: present

**Not re-taught (boundary respected):**
- TIA-606-C identifier hierarchy → cross-refs T4 L4.10 at lesson open and in Q4 rationale
- TIA-598-D color codes → cross-refs T4 L4.10; Q2 rationale explicitly rejects it as the prohibition source
- As-built records / RUS Forms 515c + 219 → cross-refs T3 L3.12 at lesson open and Pulse Q1

**No boundary violations found.**

---

## 4. Cross-Topic Continuity

| Cross-ref thread | Expected treatment | Actual treatment | Status |
|---|---|---|---|
| L5.2b sag-tension ↔ T3 L3.4 + T4 L4.2b (parabolic, IEEE 1222 §5) | Reference only; same formula | L5.2b uses IEEE Std 1222-2011 §5 parabolic formula; explicitly notes "T3 L3.4 and T4 L4.2b use same method"; loading district given as T4 L4.2b input | ✓ CONSISTENT |
| L5.8 NEMA↔IEC table ↔ T4 L4.12 (authoritative; do not reproduce) | Reference T4 L4.12; apply operationally | L5.8 cites "T4 L4.12 is the authoritative source" in table note; does not re-derive. BUT: L5.8 lists NEMA 4 ≈ IP65; T4 L4.12 lists NEMA Type 4 = IP56. **Discrepancy.** | ✗ **CONFLICT** |
| L5.6 underground hardware ↔ T3 L3.5 burial depth / pull-box math | Reference T3 L3.5; do not re-derive | L5.6 cross-refs T3 L3.5 at lesson open and in Q-section; 8×/6× formulas not re-derived | ✓ CONSISTENT |
| L5.11 TIA-758-C §6.4 (10 m/33 ft) ↔ T4 L4.8 §7 (25 ft underground) | Different sections, different scenarios; must make distinction clear | L5.11 Q1 rationale correctly distinguishes: §6.4 = 10 m closure-side; §7 = 25 ft underground junction (citing T4 L4.8). Distinction is explicit. | ✓ CONSISTENT |
| RUS 1738 characterization ↔ T4 L4.14 | Both should describe 1738 consistently | T4 L4.14: RUS 1738 = "Electric Borrowers Program (rural electric cooperatives)". T5 L5.9 and L5.10: RUS 1738 = "Distance Learning and Telemedicine grant program." These are **different programs**. Consistent in the advice (don't cite it) but discrepant in **what** 1738 actually covers. | ✗ **CONFLICT** |

---

## 5. Cross-Lesson Consistency (Voice/Tone/Q-Structure)

All 13 lessons are consistent in:
- Q-structure format: stem → A/B/C/D → `[CORRECT]` inline → `*Rationale:*` italic → bold per-option sub-bullets → `---`
- Pulse question format: 2 per lesson with full worked `*Expected answer:*`
- Quiz density: exactly 5 questions per lesson (all verified)
- Citation style: inline brackets at sentence end
- Tone: professional, field-practical; consistent voice across authors A/B/C split

**No Q-structure drift found.**

**Minor issue:** YAML `order:` values — L5.6 has `order: 7` and L5.7 also has `order: 7`. L5.7 should be `order: 8`. Downstream Moodle import may sequence incorrectly if order values are used for sorting.

---

## 6. Vendor-Agnostic Enforcement

| Finding | Location | Assessment |
|---|---|---|
| "PLP (Preformed Line Products)" | L5.2a ADSS sidebar; L5.3 reading content and Q5 rationale | In reading/rationale only — not in quiz [CORRECT] answers. Brief authorizes "PLP lashing guide" as citation. ACCEPTABLE. |
| "Unistrut or equivalent" | L5.4 reading content and Key Terms | Name used as generic product class reference with "or equivalent" qualifier. ACCEPTABLE. |
| "Corning Pretium / CommScope FIST / Clearfield FieldSmart" | L5.9 port-count table note and Key Terms | Flagged PENDING USER CONFIRMATION per brief D-E1. Not in [CORRECT] answers. ACCEPTABLE per brief intent. |
| "OptiTap" | L5.10 throughout | Brief explicitly names OptiTap as PSC program standard connector. Not vendor-agnostic but brief-authorized. ACCEPTABLE. |

**No vendor name appears in a quiz [CORRECT] answer. Vendor-agnostic enforcement maintained at quiz level.**

---

## 7. T4 L4.12 RUS 1738 Check

Verified T4 L4.12 (`content/osp-domain-4-standards-codes/12-iec-standards.md`):

- **No RUS 1738 citation found in T4 L4.12.** The NEMA ↔ IEC 60529 table contains no RUS column. Author B's concern (that 1738 might appear in the NEMA row) is **NOT CONFIRMED** — L4.12 is clean on this point.

However, a related finding: **T4 L4.12 lists NEMA Type 4 = IP56** (NEMA 250 ↔ IEC 60529 cross-reference table, line 114: `| Type 4 | Watertight (hose-directed water) + dust | IP56 |`). T5 L5.8 states NEMA Type 4 ≈ **IP65** (watertight, water jets from any direction). These differ on the second digit: 6 vs. 5. This is a cross-topic conflict where T5 applies the table operationally but gives a different value than the T4 authoritative table. The correct IEC 60529 approximate for NEMA 4 is IP56 per NEMA 250 / IEC test methodology mapping (NEMA 4 hose-directed ≈ IP5x; dust-tight = 6x → both digits → IP56). T5 L5.8's IP65 appears to use an independent reference that differs from the T4 L4.12 authoritative table.

**Verdict: T4 L4.12 is RUS-1738-clean. But the NEMA 4 IP-value conflict (IP56 in T4 vs. IP65 in T5) is a real cross-topic inconsistency that must be resolved before exam authoring.**

---

## 8. Negative Findings

The following items were checked and found CLEAN:

- **Brief-fidelity:** All 13 lessons match briefed scope, duration, and intensity — no lessons over- or under-scope the brief.
- **"Tier 22" in [CORRECT] answers:** Not present. L5.6 Q1 explicitly gives "Tier 22" as a [D] — INCORRECT distractor.
- **FDH housing grounding in T5:** Not taught. L5.8, L5.9, L5.10 all include explicit deferral notes to T6 L6.7.
- **T3 L3.12 as-built re-teaching in L5.12:** Not found. L5.12 cross-refs at open and in Pulse Q1.
- **TIA-606-C identifier hierarchy re-taught in L5.12:** Not found.
- **RUS 1738 in quiz [CORRECT] answers:** Not found. L5.9 Q3 and L5.10 Q5 both correctly flag RUS 1738 options as [INCORRECT].
- **Parabolic formula used for ADSS in L5.2b:** Not applied to ADSS. ADSS caveat present in L5.2b Glossary Cross-References.
- **Growth factor × split ratio formula in quiz [CORRECT]:** Not present. L5.9 Q2 option D explicitly refutes the × split ratio version.
- **T6 forward-compatibility:** L5.1 defers strand bonding/grounding to T6 L6.3/L6.4. L5.8/L5.9 defer FDH grounding to T6 L6.7. Clean.
- **Burial depth or tape placement depth re-taught in L5.7:** Not re-derived. L5.7 cross-refs T3 L3.6 at lesson open.

---

## 9. Net Verdict

**NEEDS-FIX-ON-TWO-ITEMS before exam authoring proceeds:**

### Fix 1 — HIGH: NEMA Type 4 IP-rating conflict (T4 L4.12 vs. T5 L5.8)
- **T4 L4.12** (authoritative table): NEMA Type 4 = **IP56**
- **T5 L5.8** (applies operationally): NEMA Type 4 ≈ **IP65**
- These differ. L5.8 explicitly defers to T4 L4.12 as authoritative but presents a different value in its own table. When a learner cross-checks the authoritative table, they will find a contradiction. A fix-agent must either: (a) align L5.8 to use IP56 per the T4 authoritative table, or (b) confirm IP65 is the correct current mapping and update T4 L4.12 — but only ONE source can be authoritative.

### Fix 2 — LOW: RUS 1738 program description inconsistency
- **T4 L4.14**: 1738 = Electric Borrowers Program (rural electric cooperatives)
- **T5 L5.9 and L5.10**: 1738 = Distance Learning and Telemedicine grant program
- The practical teaching (don't cite it for telecom work) is the same, but the description of WHY it doesn't apply differs across topics. This creates a confusing inconsistency for learners who may look up both lessons. Resolution: align T5 to match T4 L4.14's description ("Electric Borrowers Program") and add parenthetical "(not the Distance Learning program, which has separate BIP/ReConnect specifications)" if the DLT distinction is also worth preserving.

### Fix 3 — LOW: YAML `order:` duplicate (L5.6 = order 7, L5.7 = order 7)
- L5.7 should be `order: 8`, L5.8 through L5.12 should increment accordingly (9 through 13).
- Current: 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12 — duplicate 7 will cause Moodle import ordering to be non-deterministic between L5.6 and L5.7.

---

=== T5 LESSON REDTEAM B END ===
