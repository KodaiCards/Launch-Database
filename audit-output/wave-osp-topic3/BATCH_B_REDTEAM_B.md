# OSP Topic 3 Batch B — Red-Team Verifier B Report
# Framing: Cross-lesson consistency + brief fidelity + voice continuity

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Commits in scope:** L3.5 `40e3a90`, L3.6 `d928db2`, L3.7 `a9df597`, L3.8 `50585b3`
**Verifier:** B (independent; did not read Verifier A output)
**Word count:** ~1480

---

## 1. Brief-Fidelity Table

| Lesson | Briefed scope | Delivered? | Gaps / overruns |
|---|---|---|---|
| **L3.5** | Burial depth by context (24/36/48 in.), separation (12/18 in.), conduit materials (Sch40/80 PVC, HDPE, RGS), duct banks, handhole spacing (500 ft), conduit fill 40%, marker tape, bore vs. open-cut decision | **FULL COVERAGE** | None. Conduit fill worked example present. Bore vs. open-cut covered and explicitly forward-refs L3.8. |
| **L3.6** | Plow vs. trench vs. rock saw, burial depths (24/36 in.), bedding/backfill, marker tape, restoration (agricultural, pavement, revegetation), cable plowability | **FULL COVERAGE** | RUS cropland 36-in. recommendation present alongside ANSI/TIA 24-in. minimum — correctly dual-cited. |
| **L3.7** | Full riser assembly (bracket → clamp → drip loop → weatherhead → conduit → ground bond), 8 ft riser height, drip loop 12-in. minimum, NESC Rule 352 bonding, continuous cable vs. splice decision | **FULL COVERAGE** | Guy wire / H-frame section added beyond brief scope but is a natural architectural dependency (dead-end pole requirement); not an off-brief intrusion. |
| **L3.8** | Road (bore/open-cut, depths, aerial option), rail (bore, casing, depth, permit classes), water (NWP 12, IP, Section 401, aerial/bore/open-cut methods), permit matrix | **FULL COVERAGE** | NWP 12 PCN trigger and 0.1-acre limit present. Regional conditions caveat present. Railroad permit class hedge present. FRA Section 214 signal-system detail added beyond brief scope but relevant and not contradictory. |

---

## 2. Cross-Lesson Contradiction Findings

### FINDING B-1 — MODERATE: L3.8 intro lead time vs. body lead time inconsistency (confirmed present)

**Location:** L3.8, line 37 (opening paragraph): *"A single railroad crossing on a rural OSP route may require 60–90 days of permit processing"*

**Body (line 76):** *"Short-line railroads may take 30–60 days; Class I railroads frequently require 90–180 days"*

The intro phrase generalizes the short-line scenario as the universal example. The body is internally correct and consistent with the L3.1 Batch A corrected value (L3.1, line 97: "90–180 days (short-line railroads); 6–12 months (Class I)"). A learner who reads only the intro and skips the body will anchor to "60–90 days" as the railroad permit norm — which understimates Class I timelines by a factor of 2–3×. The Batch C brief (§4 Red-Flag 1) already flags this for context. **L3.8 body is correct; the intro phrase is the only inconsistency.** This is a Batch B audit wave fix, not a Batch C issue.

### FINDING B-2 — LOW: Burial depth language inconsistency between L3.5 and L3.8 (railroad depth reference point)

**L3.5, Key Terms (Flashcard Candidates), "Burial depth — under railroads":** *"Minimum 48 in. (1,219 mm) below top of rail"*

**L3.5, Table (line 48):** *"48 in. (1,219 mm) minimum; railroad permit may require more"*

**L3.8, body (line 84):** *"ANSI/TIA-758-C §6.3 requires a minimum of 48 inches under the bottom of the railroad ties (or 48 inches below the top of rail as a conservative reference point)"*

**L3.8, Scenario Crossing 2 (line 218):** *"60 in. below top of rail (BNSF specification)"*

L3.5 uses "below top of rail" as the reference throughout; L3.8 correctly identifies that ANSI/TIA-758-C §6.3 measures from bottom of ties and notes "top of rail" as a conservative approximation. The L3.8 treatment is more precise and correct. L3.5's flashcard definition will produce a slightly inaccurate memory anchor ("48 in. below top of rail" when the standard actually measures from bottom of ties). Not a structural contradiction but worth noting — the two lessons should align on the measurement reference point. Recommend L3.5 flashcard adopt the L3.8 formulation.

### FINDING B-3 — LOW: L3.6 scenario uses "conduit" for road crossing segment — correct but unlabeled transition

L3.6 Scenario, Segment C: *"Install conduit (not bare cable) required under road crossing"*. This is correct and consistent with L3.5 (bore vs. open-cut introduces conduit requirement for road crossings). However, L3.6 is the direct-bury lesson and the reader may not yet have internalized why conduit appears in a direct-bury scenario. The lesson body does not explicitly call out the rule "direct-bury under roads requires conduit" — it appears only in the scenario. No inter-lesson contradiction, but a potential comprehension gap within L3.6.

---

## 3. Voice and Terminology Drift Findings

**No material drift found.** L3.5-3.8 maintain the same voice as L3.1-3.4:

- Declarative headings ("The Bore vs. Open-Cut Decision for Road Crossings"), active-construction body paragraphs, and the "Why X?" explanatory sub-pattern (established in L3.1 "Why Desk Research Comes First") all continue consistently.
- Citation density is consistent: inline bracketed citations at sentence or table-note level. No lessons shifted to footnote format.
- Flashcard count: L3.5 has 9 terms, L3.6 has 7, L3.7 has 7, L3.8 has 8. L3.1 had 6; L3.4 had 8. Range is consistent with prior lessons; no outliers.
- Quiz count: 3 questions per lesson except L3.7 (3 questions). Consistent with L3.1-3.4 (2–4 per lesson).
- Pulse questions: 2 per lesson — matches the Batch A-locked convention.
- Scenario present in L3.6 and L3.8 per brief spec; drag-and-drop in L3.5 and L3.7 per brief spec. All four interactive types correctly assigned.
- Vendor-agnostic: no proprietary product names found. Specific railroads (BNSF, CSX, NS, UP) are cited only as examples of Class I carriers, consistent with the permit-class vocabulary discussion — not product endorsements.
- RUS-primary: RUS bulletins cited alongside ANSI/TIA throughout. RUS 36-in. cropland recommendation called out explicitly over ANSI/TIA 24-in. minimum in L3.6. L3.8 cites RUS 1751F-630 §7 as the primary crossing requirements bulletin.

---

## 4. Batch C Brief Red-Flag Checks

### Red-Flag 1 — L3.8 intro vs. body railroad lead time inconsistency
**Status: CONFIRMED PRESENT**
L3.8 line 37 reads *"may require 60–90 days of permit processing"*; L3.8 line 76 correctly splits "30–60 days (short-line) / 90–180 days (Class I)." The inconsistency exists exactly as the Batch C brief describes. The body is correct; the intro is the problem. **Fix required in Batch B audit wave.**

### Red-Flag 2 — NWP 12 0.1-acre limit + regional suspension caveat in L3.8
**Status: CONFIRMED PRESENT — BOTH ELEMENTS**
- 0.1-acre limit: L3.8 line 110-113 — *"no more than 0.1 acre of permanent wetland or waterway fill per crossing"* and key terms flashcard definition. Present.
- Regional suspension caveat: L3.8 lines 117 — *"Some districts require PCN for all utility crossings in their region, or have suspended NWP 12 in certain waterbody types"*. Present.
Both elements are in L3.8. L3.11 must reproduce both when it summarizes the permit landscape.

### Red-Flag 3 — Railroad permit class terminology hedge in L3.8
**Status: CONFIRMED PRESENT — HEDGE CORRECTLY APPLIED**
L3.8, lines 93-95: *"Applicant-funded crossing permit (similar to what some carriers call 'Class A' or 'Facility Crossing Agreement')"* — the hedge is verbatim consistent with the Batch C brief's required language. The "Class B" frame (railroad-funded relocation) is also present with correct framing. L3.11 must not harden this into universal terminology.

### Red-Flag 4 — L3.12 cross-reference to Topic 2 OTDR output
**Status: NOT APPLICABLE TO SCOPE** (L3.12 is Batch C, not L3.5-3.8). Confirming: L3.7 Glossary Cross-References (line 206) already contains a forward reference to Topic 2: *"Topic 2 (splice and termination — mechanical splice and fusion splice quality standards apply if a transition splice is required)"*. This is the correct setup for the Topic 2 back-reference that L3.12 will complete. Red-Flag 4 check against L3.5-3.8 finds no contradiction with the planned L3.12 treatment.

---

## 5. Negative Findings (Confirmed Clean)

The following items were checked and confirmed clean:

- **Frontmatter compliance:** All four lessons (L3.5-3.8) include YAML frontmatter with `title`, `duration_min`, `topic: osp-survey-route`, `order` (5 through 8), `bicsi_alignment`, and `sources` fields. Format matches L3.1-3.4 exactly.
- **Section order:** Learning Objectives → Reading Content → Key Terms → Interactive(s) → Final Check → Glossary Cross-References — present in all four lessons in the correct Batch A-locked order.
- **Drag-and-drop format:** L3.5 and L3.7 use the correct two-column table with the *(In the course platform...)* introductory line. Matches the Batch A convention.
- **Q-structure fidelity:** All quiz questions follow stem → A/B/C/D → `[CORRECT]` inline → `*Rationale:*` block → per-option rationale with trailing citation. Italic `*Rationale:*` tag and bold `**A — Incorrect.**` / `**B — Correct.**` option labels are consistent across all questions.
- **Pulse format:** Bold `**Pulse N.**` label → question → blank line → italic `*Expected answer:*` with full worked answer. Two pulses per lesson. Consistent with Batch A standard.
- **Glossary cross-reference forward-back discipline:** Each lesson cross-references backward to the lessons where terms were introduced AND forward to later lessons. L3.5 refs L3.6, L3.8, L3.9, L3.10, L3.11, L3.12. L3.7 refs L3.3, L3.4, L3.5, L3.8, L3.9, L3.10 and Topic 2. L3.8 refs L3.1, L3.3, L3.4, L3.5, L3.7, L3.11, L3.12. Forward references to Batch C lessons are present throughout.
- **No vendor names in violation of vendor-agnostic policy:** "Schedule 40 PVC," "HDPE," and "RGS" are specifications, not brands. BNSF/CSX/NS/UP cited only as example Class I carriers in permit vocabulary context — appropriate.
- **RUS-primary framing:** Every lesson with dual-source depth or construction requirements cites RUS bulletin first or as equal co-citation alongside ANSI/TIA. L3.6 explicitly flags the RUS 36-in. recommendation as the working standard over the ANSI/TIA 24-in. minimum for cropland.
- **No content from L3.9-3.12 premature in L3.5-3.8:** Permit matrix is introduced in L3.8 as a structural tool but the full permit-landscape lesson (L3.11) is only forward-referenced, not pre-empted. Splice point placement (L3.9) is forward-referenced from L3.5 and L3.7 but not pre-taught. No Batch C scope cannibalized.

---

## 6. Coverage Gaps

- **No inspection of adjacent Batch A lessons (L3.1-3.4) beyond the specific cross-lesson data points** checked against L3.5-3.8 (lead times, burial depths, NWP 12). Did not re-audit full L3.1-3.4 content; assumed Batch A post-fix verification is authoritative.
- **Math in L3.5 Q3 (conduit fill) was cross-checked against the worked example in the body** and confirmed self-consistent (21.7% fill ratio for three 0.55-in. OD cables in a 2.047-in. ID conduit). Did not independently verify L3.3 or L3.4 sag-tension math (out of scope for this framing).
- **L3.8 Q3 aerial clearance math was verified:** attachment 24 ft − sag 5.2 ft = 18.8 ft above grade; high-water mark 2 ft above grade; clearance above high-water = 16.8 ft > 15 ft minimum. Confirmed correct.
- **RUS Bulletin 1751F-635 vs. 1751F-630 cross-usage not independently verified against actual bulletin documents** — assumed the citations are plausible per the discovery doc's citation matrix.

---

=== T3 BATCH B REDTEAM B END ===
