# OSP Topic 3 — Batch C Authoring Brief

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Discovery / Brief — READ-ONLY (lesson files untouched)
**Lessons in scope:** L3.9, L3.10, L3.11, L3.12 + Topic 3 Final Exam
**Brief word cap:** 1500 words

---

## §1 Scope Per Lesson

### L3.9 — Splice Point Placement and Slack Storage Strategy (20 min)

**What it covers:** Splice point placement decisions driven by cable reel breaks (2-km and 4-km standard reels); slack loop requirements at every closure (ANSI/TIA-758-C §6.4: ≥ 10 m per side; RUS 1751F-630 requires 15–20 m for aerial closures); closure placement criteria (accessible by standard equipment — ground-level pedestal, pole-mounted, or in handhole/manhole); figure-8 slack coil storage conventions; aerial slack loop storage at pole; prohibition on mid-span splices outside proper enclosures; splice point staking process before excavation.

**Primary citations:** ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 8.1; RUS Bulletin 1751F-630 §8; RUS Bulletin 1751F-635 §4

**Interactive types:** Flashcard set (mandatory) + multiple-choice quiz (mandatory) + scenario (given 7.4 km route, place valid splice points and flag invalid choices)

---

### L3.10 — Construction Drawings and Bill of Materials (25 min)

**What it covers:** Standard OSP drawing set — plan sheet (1:200 or 1:400, property lines, ROW, pole/handhole positions, cable route, crossings), profile sheet (elevation for underground, showing depths and separation), detail sheets (standard installation details: riser, handhole layout, aerial attachment, direct-bury cross-section), materials legend sheet; bill of materials (BOM) — itemized with quantities, specifications, part numbers, must match drawing quantities exactly for RUS/grant reimbursement; CAD/GIS drawing standards per ANSI/TIA-758-C Annex C and BICSI OSP-DRD; IFC (Issued for Construction) vs. As-Built revision cycle.

**Primary citations:** ANSI/TIA-758-C Annex C; BICSI OSP-DRD Manual, Ch. 10; RUS Bulletin 1751F-630 §9; RUS Form 515c

**Interactive types:** Flashcard set (mandatory) + multiple-choice quiz (mandatory) + drag-and-drop (identify labeled elements on a sample route plan-view excerpt)

---

### L3.11 — Route Permitting and Agency Approvals (25 min)

**What it covers:** Full permit landscape for a typical rural/suburban OSP route: state DOT utility permit (state road ROW, any class); railroad crossing permit (each railroad's process, Class A applicant-funded vs. railroad-funded, 60–180 day timeline — short-line vs. Class I — consistent with L3.1 and L3.8 values); USACE Section 404/10 (NWP 12 with 0.1-acre fill limit and regional suspension caveat, Individual Permit for larger impacts, 9–18 months); FCC Part 1 local zoning coordination for aerial poles; state 401 Water Quality Certification; THPO coordination for tribal lands; NHPA Section 106 for RUS-funded projects; building the permit matrix and estimating critical-path timeline.

**Primary citations:** USACE NWP 12 permit conditions; FHWA utility permit guidance; RUS Bulletin 1751F-630 §10; AASHTO utility accommodation policy; ANSI/TIA-758-C §6.1

**Interactive types:** Flashcard set (mandatory) + multiple-choice quiz (mandatory) + scenario (given three crossing types — state highway, navigable creek, active rail — build the permit matrix and identify critical-path permit)

---

### L3.12 — Final Route Documentation: RUS-Style and BICSI-Style As-Builts (20 min)

**What it covers:** Complete as-built set — revised plan and profile drawings with as-built depths, pole positions, splice point GPS coordinates; OTDR test files and splice loss logs (cross-referenced to Topic 2 output); GPS-tagged photo log at each splice point, crossing, and transition; installation diary (field deviations from IFC drawing set); final BOM reconciliation (ordered vs. installed); RUS-specific submission requirements: Form 515c (plant record), Form 219 (contractor material/labor completion certification), and project close-out package for RUS loan/grant reimbursement; BICSI OSP-DRD as-built standard (Ch. 10); version control — paper + GIS layer for 30+ year service life.

**Primary citations:** BICSI OSP-DRD Manual, Ch. 10; RUS Bulletin 1751F-630 §11; RUS Form 515c; RUS Form 219; ANSI/TIA-758-C §9

**Interactive types:** Flashcard set (mandatory) + multiple-choice quiz (mandatory) + scenario (compliance audit — identify missing as-built deliverables before RUS reimbursement can be requested)

---

## §2 Final Exam Outline

**File path:** `content/osp-survey-route/99-final-exam.md`
**Frontmatter keys:** `type: final-exam`, `pass_threshold_pct: 70`, `question_count: 25`
**Pass threshold:** 18/25 correct (70%)
**Format:** Identical to Topic 1 (cable-selection) and Topic 2 (splice-termination) final exams: question bank in lesson-number order for authoring; randomization occurs at Moodle import; `[CORRECT]` marker identifies correct answer regardless of display order; source citations in rationale blocks.

| Lesson | Approx. question count |
|---|---|
| 3.1 Pre-Survey Desk Research | 1 |
| 3.2 Field Survey Methodology | 2 |
| 3.3 NESC Clearances + ROW | 3 |
| 3.4 Aerial Route Design | 3 |
| 3.5 Underground Route Design | 2 |
| 3.6 Direct-Bury Route Design | 2 |
| 3.7 Aerial-to-Underground Transitions | 1 |
| 3.8 Crossings | 3 |
| 3.9 Splice Point Placement | 2 |
| 3.10 Construction Drawings + BOM | 2 |
| 3.11 Route Permitting | 2 |
| 3.12 Final Route Documentation | 2 |
| **Total** | **25** |

**Question type distribution:** Multiple-choice majority; 5–6 applied/scenario questions requiring decision-making from a field condition or given data set — consistent with Topics 1 and 2.

**Citation source matrix (exam-level):** Every question cites the governing standard in the `*Source:*` tag. Rationale blocks appear in the source file; Moodle displays them only on review, not during the exam.

---

## §3 Hand-Off Notes from Batch A + Batch B

### Conventions locked in (Batch A)

1. **Frontmatter block:** Every lesson opens with a YAML frontmatter block: `title`, `duration_min`, `topic: osp-survey-route`, `order` (integer), `bicsi_alignment` (list), `sources` (list). Batch C lessons are orders 9–12.

2. **Section structure (mandatory, always in this order):** Learning Objectives → Reading Content → Key Terms (Flashcard Candidates) → Interactive(s) → Final Check (Pulse questions with expected answers) → Glossary Cross-References.

3. **Citation format:** Inline bracketed citations on the sentence that contains the claim: `[BICSI OSP-DRD Manual, Ch. X; RUS Bulletin 1751F-630 §Y]`. Appears at the end of the body paragraph or table note, not in a separate footnote block.

4. **Q-structure format (quiz questions):** Stem → four options lettered A–D → `[CORRECT]` inline on the correct option → `*Rationale:*` block → four sub-bullets (A — Incorrect/Correct. [citation]) → horizontal rule `---` between questions. This structure is preserved exactly across all existing lessons.

5. **Pulse questions format:** Bold `**Pulse N.**` label → question text → blank line → `*Expected answer:*` on its own italic line with full worked answer. Two pulses per lesson is the standard.

6. **Glossary Cross-References format:** Bold term → arrow (`→`) → forward reference to lesson number and context where the term recurs. Always references future Batch C lessons or Topic 2 where relevant.

7. **Scenario interactives:** Introduced by `### Scenario` subheading → narrative → table or bulleted analysis → bracketed citation at the end. Segment-by-segment analysis (A/B/C...) for multi-part scenarios.

8. **Drag-and-drop interactives:** Introduced by `*(In the course platform, the learner drags each [X] card to the correct [Y]. Shown here in text form.)*` → two-column markdown table.

9. **RUS-primary framing:** RUS Bulletin is always cited alongside ANSI/TIA-758-C where both apply. RUS value is called out when it differs from ANSI/TIA minimum (e.g., L3.6: ANSI/TIA 24 in. general, RUS recommends 36 in. in active cropland). Vendor-agnostic — no specific manufacturer products referenced.

10. **Railroad permit lead times (Batch A B7 fix):** L3.1 was corrected to "90–180 days (short-line); 6–12 months (Class I: BNSF, CSX, NS, UP)." L3.8 uses "30–60 days (short-line) / 90–180 days (Class I)" which is internally consistent (the L3.1 corrected value of "90–180 days" describes the short-line-to-Class-I range, while L3.8 splits them explicitly). **L3.11 must use the split L3.8 values** (short-line 30–60 days, Class I 90–180 days) for internal consistency — not a flat value or the L3.8 intro text's "60–90 days" (which is a simplified introductory phrase in L3.8 line 37 describing a generic short-line scenario, not a general rule).

---

## §4 Red-Flag Items from Batch B Cross-Read

**RED-FLAG 1 — L3.8 intro vs. body railroad lead time inconsistency (internal, Batch B)**

L3.8, line 37 (opening paragraph): *"may require 60–90 days of permit processing"* — this is a simplified introductory phrase describing a hypothetical short-line scenario, but a learner reading only the intro could lock in "60–90 days" as the universal railroad permit timeline.

L3.8, line 76 (body): *"Short-line railroads may take 30–60 days; Class I railroads frequently require 90–180 days."*

The body is correct and consistent with the L3.1 fix (B7). The intro phrase is not technically wrong for a short-line case, but it creates a plausible-but-wrong memory anchor ("railroad = 60–90 days" when Class I is actually 90–180 days). **The Batch C authoring agent does not need to fix L3.8** (that belongs to a Batch B audit wave), but **L3.11 must not repeat the "60–90 day" flat framing** — use the body-level split values.

**RED-FLAG 2 — NWP 12 "regional suspension" language: ensure L3.11 matches L3.1 + L3.8**

The B6 fix in Batch A added NWP 12 0.1-acre fill limit and "regional suspension" caveat to L3.1 Q1 rationale. L3.8 separately covers NWP 12 conditions and regional conditions (line 117: "Some districts require PCN for all utility crossings in their region, or have suspended NWP 12 in certain waterbody types"). L3.11 is the lesson most likely to summarize NWP 12 at the permit-landscape level. **L3.11 must include both the 0.1-acre limit and the regional suspension caveat** — if it omits either, it contradicts L3.1 and L3.8 and recreates the B6 finding in a new lesson.

**RED-FLAG 3 — Class A/B permit class terminology: L3.8 uses hedged language; L3.11 must not harden it**

DISCOVERY doc §3.8 states "Class A permit (applicant-funded) vs. Class B (railroad-funded)." L3.8 as authored (line 94) uses: *"(similar to what some carriers call 'Class A' or 'Facility Crossing Agreement')"* — deliberately hedged because terminology varies by railroad. L3.11 must maintain this hedge. Do not present Class A / Class B as universal terms without the qualifier.

**RED-FLAG 4 — L3.12 cross-reference to Topic 2 (OTDR test files)**

L3.12 requires referencing Topic 2 OTDR output and splice loss logs as part of the as-built package. This cross-topic reference appears in the DISCOVERY doc and is critical for RUS learners. Ensure the Glossary Cross-References section in L3.12 explicitly points to Topic 2 lessons (OTDR testing and acceptance testing lessons) to close the loop.

---

## §5 Citation Source Matrix for Batch C

| Lesson | NESC C2-2023 | ANSI/TIA-758-C | BICSI OSP-DRD | RUS Bulletins / Forms | Other |
|---|---|---|---|---|---|
| 3.9 | — | §6.4 | Ch. 8.1 | 1751F-630 §8; 1751F-635 §4 | — |
| 3.10 | — | Annex C | Ch. 10 | 1751F-630 §9; Form 515c | — |
| 3.11 | — | §6.1 | Ch. 3.4 | 1751F-630 §10 | USACE NWP 12; FHWA utility permit guidance; AASHTO utility accommodation policy; NHPA Section 106 |
| 3.12 | — | §9 | Ch. 10 | 1751F-630 §11; Form 515c; Form 219 | — |
| Final Exam | Rules cited per-question | Multiple sections | Multiple chapters | Multiple bulletins + forms | Per-question as needed |

**Note on NHPA Section 106:** L3.11 is the only Batch C lesson that requires reference to NHPA Section 106 (RUS-funded project review) and THPO coordination. These are not in any Batch A/B lesson — the Batch C author must introduce them cleanly without creating a cross-lesson gap. NHPA Section 106 is a federal consultation requirement; it is triggered by federal agency funding (USDA RUS) and applies regardless of the physical crossing type. Introduce it as a separate non-crossing permit category in L3.11.

---

## §6 Style Checklist for Batch C Authoring Agent

1. **Q-structure fidelity:** Every quiz question follows the exact template: stem → A/B/C/D options → `[CORRECT]` inline on the correct option → `*Rationale:*` block → per-option rationale sub-bullets with trailing citation. No deviations in whitespace or formatting. The `*Rationale:*` tag is italic; option labels within it are bold: `**A — Incorrect.**`

2. **Math verification before committing:** L3.9 scenario involves a 7.4 km route and reel-break math. L3.10 has no math. L3.11 has no math. L3.12 has no math but includes a compliance checklist scenario. **Derive any numeric answer (reel counts, slack lengths, fill calculations) independently before writing the [CORRECT] tag.** The L3.4 Q2 error (Batch A finding A1) was a [CORRECT] tag on the wrong option — prevent recurrence by verifying math first.

3. **RUS-primary framing:** Every lesson must give primary treatment to the RUS bulletin requirement before the BICSI/ANSI/TIA treatment where both exist. RUS Form numbers (515c, 219) are explicitly called out in L3.12 — do not omit them. RUS is the daily-use standard for this team.

4. **Railroad lead time split:** Never use a flat railroad permit timeline. Always split: "short-line railroads 30–60 days; Class I railroads 90–180 days" and flag that the specific carrier should be confirmed. Match L3.8 body-level framing.

5. **Glossary Cross-References completeness:** Every Batch C lesson must cross-reference backward to the Batch A/B lesson where the term was introduced AND forward to adjacent Batch C lessons where the term recurs. L3.9 ↔ L3.7 (drip loop / pole-mounted closure); L3.10 ↔ L3.12 (IFC drawing set → as-built revision); L3.11 ↔ L3.8 (permit class vocabulary introduced in L3.8, summarized in L3.11); L3.12 ↔ Topic 2 (OTDR files, splice logs).

---

=== T3 BATCH C BRIEF END ===
