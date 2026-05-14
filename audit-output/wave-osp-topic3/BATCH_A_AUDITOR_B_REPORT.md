# OSP Topic 3 Batch A — Auditor B Report (Adversarial: Real-World OSP Designer / RUS PM Lens)

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Scope:** Lessons 3.1–3.4 — `content/osp-survey-route/01` through `04`
**Framing:** Senior OSP designer / RUS PM — US Southeast aerial + underground; BNSF / DOT permit experience; NESC Heavy + coastal wind zones; RUS Form 515c signatory lens

---

## Stack Snapshot

Four lessons covering pre-survey desk research, field survey methodology, NESC clearances + ROW, and aerial route design. Content is thorough and better than most BICSI-adjacent training. From a real-field lens, the main risk is not outright wrong facts but **silent omissions** and **"right answer / dangerous framing"** items that will cause a learner to miss a permit rejection, miscall a loading district, or sign easements on the wrong legal theory. Seven findings identified; one HIGH (L3.3: joint-use fee structure omitted — learner will sign make-ready that gets sent to collections), three MED, three LOW.

---

## Findings Table

| # | Severity | Category | File | Line Range | Snippet | Issue | Fix Shape | Confidence |
|---|---|---|---|---|---|---|---|---|
| 1 | HIGH | Critical Gotcha Missed | `03-nesc-clearances-row-requirements.md` | L117–119 | `Joint-use agreement: An agreement between two utilities allowing one utility's infrastructure to use the other's pole…` | Joint-use attachment fees (make-ready + annual attachment fees) are entirely absent. In practice, attaching to an electric utility's pole requires a make-ready analysis, a make-ready construction payment (often $500–$2,000 per pole), and annual pole-attachment rental (~$10–$20/pole/yr under FCC formula). A learner who reads this and goes to negotiate a joint-use agreement will be blindsided by the cost structure and may misrepresent project budget to their client. | Add 2–3 sentences in the joint-use section noting that joint-use agreements carry make-ready costs and annual attachment fees; reference FCC pole attachment rate formula or One Touch Make Ready rules as the governing framework | HIGH |
| 2 | MED | Plausibility Trap / Climate | `04-aerial-route-design.md` | L44–52 (loading district table) | `An additional Extreme Wind district applies in coastal areas where hurricane-force winds drive the design` | NESC Extreme Wind loading is the governing district for the US Southeast Atlantic coast and Gulf Coast — the primary operating territory for this user's office. The content presents Extreme Wind as a footnote ("check the map") rather than as a co-equal or primary concern for learners in this geography. A learner based in coastal Georgia or the Panhandle who treats Extreme Wind as a rare edge case could under-design attachment heights for the actual governing load case in their region. | Elevate Extreme Wind treatment: add a sentence making clear that for SE Atlantic and Gulf Coast routes Extreme Wind is the primary design district, and that the NESC loading district map must be checked before assuming Heavy district governs | HIGH |
| 3 | MED | Outdated / Incomplete Practice | `03-nesc-clearances-row-requirements.md` | L119 | `Joint-use attachment positions must comply with NESC Rule 238.` | No mention of NESC Rule 235 (clearances from buildings and other structures) or the requirement that new communication attachments on joint-use poles may require a **pole loading analysis** under NESC Rule 261 before the pole owner will approve make-ready. In real practice, the pole owner (electric utility) performs or approves the loading analysis; the attaching party pays for it and may be required to replace under-loaded poles. Omitting this means a learner will walk into a joint-use agreement without understanding that pole replacement can be a budget-stopper. | Add a note: new joint-use attachments require a make-ready loading analysis per NESC Rule 261; under-loaded poles must be replaced or reinforced at the attaching party's expense before attachment is permitted | MEDIUM |
| 4 | MED | Easement / ROW Gap — Missing RUS-Specific Requirement | `03-nesc-clearances-row-requirements.md` | L115–130 | `Utility easement: A recorded right to use a defined strip of private property…` | The content correctly describes easement types but omits the RUS-specific requirement: for RUS-financed OSP projects, easements must use RUS-approved form language (Form 770 or equivalent) and be submitted with the Form 515c package. A learner designing a RUS project who uses a generic state-law easement form (even correctly described in the content) will have their loan package rejected at the RUS state office review. | Add a callout: RUS-financed projects require RUS-approved easement form language (reference RUS Bulletin 1751F-630 §4 as the governing document — already cited); state-law forms are insufficient for RUS loan compliance | MEDIUM |
| 5 | LOW | Survey Methodology Gap | `02-field-survey-methodology.md` | L88–105 (crew + equipment list) | `WAAS-enabled, ±3 ft accuracy` | No mention of GPS accuracy budget relative to 811-mark positional accuracy (±3–10 ft) + cable centerline design tolerance. A learner using a WAAS phone GPS at ±3 ft to record a utility marking that itself has ±3–10 ft positional accuracy cannot resolve a conflict within ±6–13 ft combined error — which is a meaningful gap when the design separation standard is 2 ft horizontal. The content implies WAAS-grade GPS is sufficient for all reconnaissance documentation without flagging this compound error budget. | Add a note: WAAS-grade GPS (±3 ft) is sufficient for route track logging and station referencing, but utility conflict resolution within ±2 ft requires a survey-grade fix or vacuum-excavation physical measurement — not GPS alone | LOW |
| 6 | LOW | Right-Answer / Wrong-Reason Risk | `01-pre-survey-desk-research.md` | L156–159, Q1 rationale for B | `Nationwide Permit 12 for most OSP utility crossings, subject to conditions` | The mention of NWP 12 is technically accurate but dangerously incomplete: NWP 12 was subject to a Supreme Court challenge (Montana v. United States Army Corps of Engineers), and its availability for oil/gas/telecom crossings has had periods of suspension and reinstatement. A learner who internalizes "NWP 12 = default permit for OSP utility wetland crossings" without understanding that NWP 12 has conditions, acreage limits (≤0.1 acre fill), and can be regionally suspended will show up to a USACE pre-application meeting under-prepared. | Qualify NWP 12 reference: "NWP 12, subject to its current conditions, acreage limits, and regional conditions — confirm availability with the USACE district office for each project" | LOW |
| 7 | LOW | Outdated Practice Signal | `01-pre-survey-desk-research.md` | L97 (fatal-flaw table) | `Identify railroad owner; initiate permit process 90 days before construction` | 90-day lead time is an underestimate for Class I railroads (BNSF, CSX, Norfolk Southern) in current practice. Class I railroad utility crossing permits routinely take 6–12 months when engineering review, flagging plans, and insurance certificates are required. BNSF in particular has been running 180–360 day review cycles on new crossings. A learner who plans a 90-day lead for a railroad crossing permit will miss their construction window. | Change "90 days" to "90–180+ days for short-line railroads; 6–12 months for Class I railroads (BNSF, CSX, NS, UP)"; add note to confirm current lead times with specific carrier before committing to a project schedule | LOW |

---

## Negative Findings — Confirmed Clean Under My Framing

**L3.1 Pre-Survey Desk Research:**
- FIRM/SFHA treatment is correct for OSP purposes; scour discussion is accurate and appropriately cautious.
- 811 legal requirement framing ("all 50 states," liability for unmarked utilities) is correct.
- GIS accuracy bands (county parcel ±5–50 ft, USGS ±3–15 ft vertical, atlas ±3–10 ft) are realistic and appropriately conservative for training.
- NWI → Section 404 trigger chain is accurate; confirmed that field delineation requirement is correctly noted.
- NRCS corrosivity → dielectric armor recommendation is sound for real-field application.

**L3.2 Field Survey Methodology:**
- Station offset notation (X+XX feet, not meters) is US-correct; left/right convention (facing forward, increasing stations) is standard.
- 811 marking color code (red/yellow/blue/orange/green) matches APWA Uniform Color Code.
- Two-person minimum for design survey is correct for both safety and accuracy reasons.
- Pre-easement → reconnaissance → design survey sequencing is correct for real projects.
- Photo documentation requirements (GPS-tagged, perpendicular at obstacles) are appropriate for RUS as-built documentation.

**L3.3 NESC Clearances + ROW:**
- NESC Rule 232 values (15.5 ft roads, 26.5 ft railroad, 12.0 ft non-vehicle land) are consistent with current NESC C2 practice.
- Rule 234 navigable waterway → USACE determination is correct workflow.
- Rule 238 horizontal clearances (12 in at 0–8.7 kV, 24 in at 8.7–50 kV) are NESC-consistent.
- Communication space hierarchy (below supply, above ground clearance) is correct.
- Midspan clearance = attachment height − sag formula is correct.
- Fee-simple vs. easement vs. joint-use distinctions are legally accurate.
- AHJ hierarchy (NESC floor, state/DOT/railroad above) is correctly described.
- Design margin recommendation (2 ft above NESC minimum) is sound practice.

**L3.4 Aerial Route Design:**
- NESC loading district table (Light/Medium/Heavy ice and wind values) matches current NESC C2 practice.
- Parabolic sag formula (S = wL²/8H) is correct for the stated applicability range (<10% sag/span).
- EDS concept and IEEE 1222 reference are correct; creep → final sag requirement is correctly described.
- L_max formula derivation is algebraically correct.
- Worked example arithmetic (L_max ≈ 415 ft; table verification at 400 ft → 16.2 ft clearance) is correct.
- Pole loading three-component analysis (transverse/longitudinal/vertical) is NESC Rule 261-consistent.
- Guy wire requirement triggers (dead-end, corner >3–5°, excessive load) are correct.
- Grade B vs. Grade C application is correctly described for communication conductors.
- Scenario (350 ft span, 0.1 ft margin → recommend 300 ft) is exactly right engineering judgment.

**Cross-lesson consistency:** 811 treatment, clearance values, ROW/easement distinctions, and NESC citations are consistent across all four lessons.

---

## Coverage Gaps

Could not independently verify exact NESC C2-2023 table values (15.5 ft, 26.5 ft, 12 in / 24 in horizontal) against the standard text — consistent with industry practice from field experience, but standard text not available for line-by-line comparison. RUS Bulletin 1751F-630 section numbers (§2, §3, §4 assignments) not verified against document text — section assignments are plausible. One Touch Make Ready (FCC 2018 rule) referenced in Finding #1 as a framing for joint-use negotiation — OTMR availability varies by state; the more universal frame is the FCC pole attachment rate formula under 47 USC §224. (~110 words)

---

`=== TOPIC 3 BATCH A AUDITOR B END ===`

---

## Comparison with Auditor A (Content Verification Red-Team)

Auditor A's framing: math/citation verification. My framing: adversarial real-world designer/PM — can a learner mess up a real project?

**Overlap (findings both auditors agree on):**
- None of my findings directly overlap with Auditor A's four findings (Auditor A focused on L3.4 Q2 math error, garbled Option A rationale, EDS 18% vs. 20–25% inconsistency, and exposed platform build note). I confirmed all four of Auditor A's findings are real during my reading:
  - L3.4 Q2 `[CORRECT]` on 5.1 ft when formula yields 6.125 ft: confirmed, also noted.
  - Garbled Option A rationale (`÷ 2.5` fragment): confirmed.
  - EDS 18% vs. 20–25% body text: confirmed as Finding #3 by Auditor A (MEDIUM); I independently noticed but considered it within the stated "conservative design choice" framing and did not independently flag it as my primary concern given the explicit inline note in the worked example.
  - Platform build note exposure: confirmed.

**Complementary findings (my lens, not Auditor A's):**
- Finding #1 (HIGH): Joint-use attachment fee omission — real-world budget gotcha; Auditor A did not check for missing real-world cost context.
- Finding #2 (MED): Extreme Wind district underweighted for SE/Gulf Coast geography — Auditor A confirmed loading district table is internally consistent but did not evaluate geographic appropriateness for the user's operating territory.
- Finding #3 (MED): Make-ready loading analysis requirement missing from joint-use section — not a math issue, so outside Auditor A's scope.
- Finding #4 (MED): RUS Form 770 easement language requirement missing — Auditor A verified easement type descriptions are legally accurate but did not check RUS loan-compliance specifics.
- Findings #5–7 (LOW): GPS accuracy budget, NWP 12 conditions/suspension risk, railroad permit lead time — all real-world field/permit experience items outside Auditor A's math/citation framing.

**Summary assessment:** The two audits are strongly complementary. Auditor A caught the only outright math error (L3.4 Q2). My audit found zero additional math errors but identified seven real-world practice gaps that could cause a learner to miscall a budget, miss a permit, or under-design for the governing loading district in their actual geography. The combined canonical list should prioritize: Auditor A Finding #1 (math error, HIGH) + my Finding #1 (joint-use fees, HIGH) as the two mandatory fixes before any lesson ships.
