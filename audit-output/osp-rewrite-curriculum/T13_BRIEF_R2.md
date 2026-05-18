# T13 (Inspection & Quality Assurance) — Research Brief R-2

**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T13_BRIEF_R2.md` written.

**Agent:** T13 Research R-2 — corroboration-adversarial / high-recall framing  
**Date:** 2026-05-18  
**Framing:** Senior OSP inspector/QA engineer with adversarial-of-R-1 mindset. Hunting for:
1. Citations R-1 missed (broader sweep, secondary sources R-1 didn't use)
2. R-1 citations where edition/section may be wrong (corroborate via different secondary paths)
3. Field-practice gaps where R-1 over-relied on book references
4. Numeric claims needing primary-source verification against R-1's values
5. Concept ordering issues and DAG gaps R-1 missed

**Sources used (different from R-1 primary reliance):** FOA Reference Guide + BICSI OSPDR + OSHA 1910.268 primary text + CGA Best Practices + ASTM D698/D1557 abstracts + NEC Art. 250 structure + 7 CFR 1755 eCFR + eCFR primary text for cited regulations + T10 authored lessons (ground-truth for DAG) + T14 authored lessons (ground-truth for grounding vocab)

---

## Lesson-by-Lesson Adversarial Commentary

---

### T13.L01 — The Inspector's Role: Not the Enemy

#### Corroborations (R-1 was right)
- ✓ QA/QC distinction (owner/engineer vs. contractor) is correct per industry practice and FOA CFOS-O KSA framework.
- ✓ RUS Bulletin 1751F-630 §7 as authority for owner inspection rights on RUS-financed projects is accurate — registry-verified.
- ✓ Kick-back authority vs. punch list framing is appropriate for teaching position.

#### Corrections (R-1 was wrong or imprecise)
- **CORRECTION C-1: `acceptance walk` vocabulary claim is PARTIALLY DUPLICATED across T13.L01 and T10.L11.** R-1 lists `acceptance walk` in T13.L01 `vocabulary_introduced`, but the authored T10.L11 file (line 52, confirmed by direct read) already introduces this term: `'A formal site walkthrough between the contractor and inspector (and often the owner\'s engineer) to document the condition of the finished work and generate the punch list.'` T13.L01 should have `acceptance walk` in `vocabulary_assumed` pointing to T10.L11, NOT in `vocabulary_introduced`. **This is a DAG invariant violation** — re-introducing a term already introduced in T10.L11 violates the strict prerequisite invariant. Cascade pattern P6.

- **CORRECTION C-2: `inspector (OSP)` may conflict with T10.L11 introduction.** T10.L11 introduces `field inspector` (authored file line 43). R-1's T13.L01 proposes introducing `inspector (OSP)` as a distinct term. These are functionally the same concept — T10.L11's `field inspector` definition covers the same scope. Author needs to decide: either (a) use `vocabulary_assumed` pointer to T10.L11's `field inspector` in T13.L01 and NOT re-introduce, OR (b) explicitly distinguish `inspector (OSP)` as a more formal/legal concept vs the generic `field inspector` from T10. As written, R-1's brief introduces a concept already introduced, which is a prerequisite invariant violation. **Recommend: merge to `vocabulary_assumed` pointer to T10.L11.`field inspector`; add depth in T13.L01 prose without re-introducing via `vocabulary_introduced`.**

- **NOTED GAP N-1: AIA A201 referenced in T13.L09 (right-of-rejection) but not in T13.L01.** AIA A201 §12.2 is the standard construction contract general condition governing the right of rejection. Relevant context for L01's discussion of inspector authority would be strengthened by mentioning that standard construction contract general conditions (typically AIA A201) are what give the inspector the contractual backing for their authority on non-RUS projects, with RUS 1751F-630 §7 providing the RUS-specific authority. Not a correction to R-1, but a content addition.

#### New Citations Missed by R-1
- **NEW: 29 CFR §1910.268(a)** — The OSHA telecommunications standard explicitly defines "qualified person" for telecommunications field work, which directly impacts who can serve as an OSP field inspector. The qualified-person requirement is L01-level context (who IS an inspector?) that R-1's brief does not address. Citation: 29 CFR §1910.268(a) definition of qualified person. Registry-verified.

- **NEW: FOA Reference Guide — OSP inspection vocabulary.** FOA CFOS-O KSA 6.4.7 covers "Fiber Optic Premises/Outside Plant Installation and Testing: Documentation and Records." R-1 mentioned FOA CFOS-O KSAs but didn't cite the specific FOA framing for QA vs. QC. Adding as supporting secondary source for QA/QC distinction.

---

### T13.L02 — Aerial Inspection: What to Look For

#### Corroborations (R-1 was right)
- ✓ NESC Rule 232 for clearance verification — registry-verified.
- ✓ "Inspect against the design clearance, not just NESC minimum" — correct field practice. NESC sets floor; design adds margin.
- ✓ Visual sag check method (level-sight) is correct industry practice per BICSI OSPDR and RUS 1751F-630 commentary.
- ✓ Drip loop definition is accurate and the infiltration-prevention rationale is correct.

#### Corrections (R-1 was wrong or imprecise)
- **CORRECTION C-3: NESC Rule 232 applies to clearance over roads, railroads, and waterways — but R-1 does not distinguish Grade B vs. Grade C clearances.** NESC Section 24 grades construction — Grade B applies to crossings over railroads + navigable waterways + roads with heavy traffic (defined in §234). Grade C applies to normal road spans. The minimum clearances differ: Table 232-1 Grade B minimums are higher than Grade C. R-1's L02 worked example ("a span at 30°F with 10-ft sag over a road meets NESC Rule 232 for Light loading district Grade B") uses Grade B — which is correct for road crossings — but the lesson should explicitly teach the Grade B / Grade C distinction since the inspector needs to know WHICH grade standard applies at each span. R-1's brief conflates "road crossing = Grade B always" which is almost right (it's roads with heavy traffic per NESC §234 and roads in general for Grade B) but the nuance that quiet rural driveways may be Grade C needs a line in the lesson.

- **CORRECTION C-4: `hardware torque compliance` — reference to manufacturer spec is correct, but R-1 does not cite a specific standard for verification.** The industry source for hardware torque acceptance is typically the hardware manufacturer's installation instructions (which must be maintained on-site during construction per RUS contract requirements) — not ANSI O5.1 (which governs pole specs, not hardware torque). ANSI O5.1 context in R-1's L02 definition for `hardware torque compliance` is a stretch. The correct citation is: manufacturer installation instructions (AHJ-level) + RUS Bulletin 1751F-630 §5 which requires hardware installation per manufacturer specifications. ANSI O5.1 handles pole structural specs; hardware torque is manufacturer territory.

#### New Content Items R-1 Missed
- **GAP G-1: WIND-LOAD EFFECT ON INSPECTOR CLEARANCE JUDGMENT IS MISSING FROM L02.** NESC clearances are measured under loaded conditions (loaded = ice + wind per loading district). During a sunny-day field inspection in summer, neither ice loading nor wind loading is present — the cable is at its warm-unloaded, maximum-tension (high clearance) condition. R-1's book-vs-field section mentions "design margin includes future sag creep" but does NOT address this: inspectors must account for loaded-condition sag when comparing visual observations to design values. The design clearance (as drawn on the plan-and-profile at the design sag under loaded condition) is NOT the same as what the inspector sees on a hot July afternoon. This is a critical teaching point — the inspection must verify against the DESIGN value, which was calculated at loaded condition. Omitting this means learners will incorrectly accept summer-condition observations as representative of worst-case clearance. **Add to L02 book-vs-field section.**

- **GAP G-2: OVERLASH INSPECTION IS MENTIONED IN `lashing compliance` DEFINITION BUT NOT COVERED IN LESSON SCOPE.** R-1 defines `lashing compliance` as including "overlash attachment" with "intermediate lashing clamps at specified intervals" — but the lesson objectives and worked examples do not cover how to inspect overlash vs. primary lash vs. figure-8 configurations. Overlash is common in rural RUS builds (adding fiber to existing telephone strand). The inspector needs to know: (a) that overlash requires separate lashing wire (not shared with primary), (b) minimum intermediate clamp spacing for overlash per RUS 1751F-630 §5, (c) that an inspector signing off on a deficient overlash creates the same liability as signing off on deficient primary lash. Add to L02 scope.

---

### T13.L03 — Pole-Top Inspection

#### Corroborations (R-1 was right)
- ✓ ANSI O5.1 as primary source for wood pole inspection criteria — confirmed on allowlist.
- ✓ CCA treatment check definition and greenish coloration indicator are accurate.
- ✓ Bore-and-plug inspection method description is correct per ANSI O5.1 and USDA Forest Products Lab guidance.
- ✓ "Sound-of-tap" as a fast screen vs. formal documented inspection is accurate field practice.

#### Corrections
- **CORRECTION C-5: `checking (wood)` definition gives "≥ 1/3 pole diameter" as a rejection criterion, but ANSI O5.1 uses REMAINING WALL thickness, not checking depth as a fraction of diameter.** ANSI O5.1 rejection criteria for checking are expressed in terms of the effective cross-section for bending strength, which depends on the geometry of the crack relative to the load direction — not a simple "1/3 diameter" rule. The "deep checking ≥ 1/3 pole diameter" framing is a simplified field heuristic that appears in training materials but it IS the kind of number that can be misattributed to ANSI O5.1 when it's actually a derived rule-of-thumb. **Action:** verify this exact threshold against ANSI O5.1 §6 (Inspection Criteria) and the USDA FPL Wood Handbook. If not in ANSI O5.1 verbatim, mark as `[field practice guidance — verify against ANSI O5.1 at publication]`. Cascade risk: fabricated threshold at a safety-critical decision point (pole rejection vs. acceptance).

- **CORRECTION C-6: PPE ASSUMPTIONS FOR POLE-TOP INSPECTION ARE INCOMPLETE.** R-1's L03 `vocabulary_assumed` lists `PPE (fall protection at poles)` and `fall arrest system` → T18.L04. But T10.L11 (authored) also discusses inspector pole-access context. More importantly: T13.L03 teaches inspectors to climb poles for top-condition assessment — but OSHA 1910.268(g)(1) requires that all climbing above 4 ft on poles must meet climbing equipment requirements (gaffs, positioning strap, full-body harness + lanyard). R-1's L03 does not include this as a lesson element. An inspector who approaches pole-top assessment by hiring a qualified climber (contractor's crew) vs. climbing themselves is a real-world distinction — and the lesson needs to address the liability of an owner's inspector directing a contractor's climber to reach pole-top for inspection access. **Add to L03 lesson scope.**

#### New Content Items R-1 Missed
- **GAP G-3: POLE-CLASS CHANGE TRIGGER NOT ADDRESSED.** R-1 covers "pole that fails structural criteria" as a life-safety issue — but does not teach what the inspector actually does: specifically, that a failed pole on a RUS-financed project requires an engineering evaluation by the PE-of-record, which may result in a load calculation showing whether the existing (degraded) pole is still structurally adequate at the proposed loading or must be replaced. The inspector's role is to document and refer — not to independently calculate remaining strength. This workflow is missing from L03. **Add to L03 book-vs-field section.**

---

### T13.L04 — Underground Inspection: Depth and Cover

#### Corroborations (R-1 was right)
- ✓ ASTM D1557 (Modified Proctor) for proctor density specification — on allowlist.
- ✓ 95% modified Proctor for road-bearing zones / 90% for non-traffic zones is correct industry standard.
- ✓ "Measure from finished grade, not natural grade" — accurate and important book-vs-field distinction.
- ✓ NWP 57 for water crossings — registry-updated; replaces NWP 12 for telecom (cascade pattern P11).
- ✓ RUS Bulletin 1751F-635 §5 for crossing requirements — registry-verified.

#### Corrections
- **CORRECTION C-7: `proctor density` definition cites "ASTM D698, Standard Proctor; ASTM D1557, Modified Proctor" — but ASTM D698 is the STANDARD Proctor, NOT the Modified. R-1 correctly identifies both but creates potential confusion by saying "Proctor Compaction Test (ASTM D698, Standard Proctor; ASTM D1557, Modified Proctor)" in a way that implies both are equivalent references for the same test.** They are different tests with different energy levels: D698 (Standard) gives lower maximum dry density than D1557 (Modified). For road-bearing trench backfill on RUS projects, the specification is 95% of MODIFIED Proctor (D1557), NOT Standard Proctor. If a lesson says "95% Proctor" without specifying D1557, the contractor could claim 95% of Standard Proctor (D698) which passes at a lower actual density — a real inspection-dispute pattern. **L04 must explicitly specify D1557 (Modified) whenever stating the 95% threshold for road-bearing zones.**

- **NOTED: Depth verification at critical crossings — 23 CFR state DOT permit conditions are cited as authority.** This is correct directionally but note that many RUS projects in rural areas cross COUNTY roads (not state DOTs) — and county permit conditions vary. R-1's citation covers the state DOT case; the lesson should note that county road crossings have AHJ-specific cover requirements that may differ from state DOT minimums and that the controlling document is always the executed permit, not the minimum standard.

#### New Content Items R-1 Missed
- **GAP G-4: COMPACTION TESTING INTERVAL IS MISSING.** R-1 defines `proctor density` but the lesson scope does not address HOW OFTEN compaction is tested. Industry practice (per RUS 1751F-635 commentary and state DOT specifications): compaction testing typically required every 250–500 ft per lift in road-bearing zones, and at a minimum one test per HDD exit zone. T10.L08 (authored) mentions "every 250 ft per lift in the primary backfill zone" — so T13.L04 should cross-reference T10.L08's testing interval when teaching the inspector what to review. Without this, students learn WHAT the threshold is but not HOW to assess whether the contractor tested enough. **Add to L04 scope as: how to audit the contractor's compaction test frequency.**

- **GAP G-5: INSPECTOR'S ROLE DURING BACKFILL — NOT JUST POST-BACKFILL — IS MISSING FROM L04.** R-1 frames depth inspection as probing after the fact. But best practice on RUS projects: the inspector is supposed to be present (or have access to) the trench DURING backfilling, at minimum for the first lift verification. Depth deficiency found after full backfill requires excavation; deficiency found during first-lift backfill only requires cable repositioning. The lesson should teach the stage-by-stage inspection model: (1) pre-backfill depth probe while trench is still open; (2) first-lift compaction check; (3) post-backfill cover card confirmation at grade. Only item (3) is in R-1's scope — the earlier two stages are more efficient and less costly for both owner and contractor.

---

### T13.L05 — Slack, Storage, and Access Point Checks

#### Corroborations (R-1 was right)
- ✓ Minimum slack values (30 ft at above-ground closures / 50–100 ft at underground vaults) are in the right range per RUS 1751F-630 §6 and RUS 1751F-635 §7.
- ✓ Storage coil check definition (bend radius compliance, labeling) is accurate.
- ✓ TIA-606-D for labeling convention is on allowlist.

#### Corrections
- **CORRECTION C-8: SLACK MINIMUMS IN T13.L05 (`30 ft aerial / 50–100 ft vault`) CONFLICT WITH T10.L06 VALUES.** T10.L06 (authored, DAG-authoritative) teaches: `50 ft at intermediate handholes; 100 ft at splice-point handholes; 100–150 ft at building entrances; 25–50 ft at aerial-to-buried transitions.` T13.L05 R-1 brief states "30 ft at above-ground splice closures and 50–100 ft at underground vaults." These values are DIFFERENT from T10.L06's authored content. Since T10 is the prerequisite and introduces `MSA` (Minimum Slack Allowance), T13 cannot re-define MSA numbers differently from T10 without violating the prerequisite invariant. **T13.L05 must use the same numeric bands as T10.L06, OR explicitly reference MSA as a contract-variable specification (per T10.L06's own caveat: "Always check the specific contract MSA schedule — these numbers vary by carrier specification").** The lesson cannot teach concrete minimums that contradict the already-authored T10.L06 values. **This is a cross-lesson numeric contradiction — HIGH priority fix.**

- **NOTED: `NIU verify` definition references TIA-606-D labeling convention.** This is appropriate. The definition correctly ties NIU port labeling to TIA-606-D. Note: the introduced term `NIU verify` is new in T13 — and T13.L05 `vocabulary_assumed` lists `NIU slack` → T10.L06, and `FDH, NAP, drop` → T01.L07. The distinction between a `NIU` (introduced in T01.L07 per DAG) and `NIU verify` (new T13-specific QA action) is clear enough.

#### New Content Items R-1 Missed
- **GAP G-6: CABLE IDENTIFICATION LABELING AT CLOSURES IS NOT ADDRESSED.** RUS 1751F-630 §5 and §7 require that each closure be labeled with cable designation, fiber count, and route information matching the as-built drawings. R-1's L05 covers label presence for NIUs and pedestals but does not teach label-format compliance (e.g., that a label saying "FIBER CABLE" is not compliant — it needs the specific cable design designation per contract). Add to L05 pedestal access check or NIU verify scope.

- **GAP G-7: SLACK COIL DIRECTION (CLOCKWISE VS. COUNTERCLOCKWISE) IS OMITTED.** T10.L06 covers coil geometry; T13.L05 should reference that the inspector verifies coil direction (consistent with the splice team's preference — typically counterclockwise so the cable pays out without twist) in addition to diameter compliance. Minor but real inspection item on larger builds with dedicated splicing contractors.

---

### T13.L06 — What Triggers a Punch List vs. a Kick-Back

#### Corroborations (R-1 was right)
- ✓ Decision framework table (isolated/pattern/safety-threatening/wrong-material/re-excavation) is accurate and practical.
- ✓ `retainage` definition (5–10%, held until final acceptance) is correct per industry standard.
- ✓ `material deficiency` triggering kick-back is correct — cannot correct in-place.
- ✓ Book-vs-field: verbal punch lists vs. written documentation risk is accurate.

#### Corrections
- **CORRECTION C-9: `retainage` is introduced in T13.L06 but also appears in T13.L09 ("retainage release conditions").** R-1 introduces `retainage` in L06 (punch list context) and then has a section "retainage release conditions" as a learning objective in L09. This is fine IF L09 treats retainage as `vocabulary_assumed` pointing back to L06 — verify this is explicit in the author prompt. Currently R-1's L09 `vocabulary_assumed` lists `retainage → T13.L06` — so it is correct. Just flagging for clarity.

#### New Content Items R-1 Missed
- **GAP G-8: PAYMENT CONSEQUENCE TABLE IS INCOMPLETE — MISSING PARTIAL PAYMENT SCENARIO.** R-1's L06 covers "kick-back = no payment on that section" and "punch list = payment after correction" but does not address the real-world scenario of PARTIAL PAYMENT: owner releases payment for completed-and-accepted sections of a job while kicking back deficient sections. This is standard RUS practice — the inspector's role is to document which pay-items are accepted (payable) and which are not (held) by section. Teaching only "kick-back = all payment stops" creates a false impression that is corrected in field practice. Add to L06 or address in L07 Form 219 context.

---

### T13.L07 — RUS Form 219: Close-Out Package

#### Corroborations (R-1 was right)
- ✓ `7 CFR Part 1755 §1755.903` as loan draw authority — on allowlist.
- ✓ The 8-component Form 219 package list (as-built drawings, splice matrix, test reports, material certification, contractor completion statement, inspection logs, punch list disposition, engineer certification) is accurate per industry practice.
- ✓ "PE stamp = personal professional liability" framing is correct and important for the audience.
- ✓ RUS 1753F-401 for test report acceptance threshold — registry-verified (T11 additions).

#### Corrections
- **CORRECTION C-10: `as-built signature` definition says "contractor's stamped and signed acknowledgment."** RUS practice: contractors on RUS telecommunications projects are NOT typically required to have a licensed PE stamp the as-built drawings — that is the ENGINEER's role. The contractor certifies (via signature on the contractor completion statement) that work was done per design. The PE stamps the as-built drawings. The conflation of "contractor stamped" vs. "engineer stamped" in the `as-built signature` definition is a potential source of confusion. **Correct to: "The contractor's signed acknowledgment (not PE-stamped by contractor) that the construction has been completed in accordance with the design documents..." — reserve "PE stamp" language for the engineer certification definition.**

- **CORRECTION C-11: NECA/FOA 301 cited as test standard reference in Form 219 close-out package.** This is not incorrect per se, but NECA/FOA 301 is a INSTALLATION and TESTING standard (FOA/NECA) while the primary authority for OSP fiber acceptance testing referenced in RUS contracts is RUS Bulletin 1753F-401. The test reports that go into the Form 219 package should be cited as "per RUS 1753F-401 requirements" (since the RUS borrower is under RUS contract terms), with NECA/FOA 301 as a secondary reference. R-1's citation order should be reversed to avoid suggesting that NECA/FOA 301 is the primary RUS-program authority.

#### New Content Items R-1 Missed
- **GAP G-9: MATERIAL CERTIFICATION LETTERS ARE NOT DEFINED IN R-1'S VOCABULARY.** Component #4 of the Form 219 package is "material certification" but R-1 does not introduce this as a vocabulary term or explain what "RUS-listed material" means. RUS maintains a list of approved telecommunications materials through the RUS Telecommunications Standards program. "RUS-listed" means the material appears on the RUS MAST (Materials and Standards) approved product list. Installing non-listed materials on a RUS-funded project can trigger loan compliance issues. This is an important concept that needs explicit teaching in L07. R-1 mentions "manufacturer letters or QA records confirming RUS-listed materials were installed" in the workflow description but does not introduce the term or the compliance significance.

- **GAP G-10: PARTIAL CLOSE-OUT / PHASED DRAW IS NOT ADDRESSED.** On multi-segment RUS projects, borrowers do partial draws (Form 219 submitted per segment as construction is completed and tested). R-1 describes Form 219 as a single end-of-project package, which is conceptually correct but doesn't address the phased-draw reality. Inspectors on large projects assemble segment-level Form 219 packages monthly. This is in the RUS loan administration process and directly matches Carter's audience (PSC engineers doing exactly this for RUS clients).

---

### T13.L08 — Bonding and Grounding Inspection

#### Corroborations (R-1 was right)
- ✓ 25 Ω ground resistance threshold per NEC Article 250 / RUS 1751F-810 is correct. Registry note: NEC §250.53(A)(2) exception allows 25 Ω as the maximum single-rod resistance (with augmentation required if exceeded, unless two rods are used).
- ✓ IEEE 81 as fall-of-potential test method authority — on allowlist.
- ✓ T14.L06 `fall-of-potential` DAG pointer is correct (confirmed authored T14.L06 vocabulary_introduced).
- ✓ T14.L10 `aerial plant bonding schedule` DAG pointer is correct (confirmed authored T14.L10 vocabulary_introduced).

#### Corrections
- **CORRECTION C-12: R-1 says inspectors verify "10% of poles in a given segment" by spot-check.** This sampling rate is stated without a citation. RUS 1751F-810 §3 does NOT specify a minimum spot-check percentage — this is a field-practice norm that varies by project. R-1's L08 should present this as industry-practice guidance ("at least 10% is commonly used") rather than citing it as a RUS 1751F-810 requirement it doesn't contain. Mark as `(Industry practice — verify against contract requirements, which may specify a different sampling rate)`.

- **CORRECTION C-13: `bond continuity check` definition says "≤1 Ω loop resistance between the test point and the nearest established ground."** This is a commonly-cited continuity threshold, but the authoritative source for the ≤1 Ω continuity acceptance criterion should be cited. RUS 1751F-810 §3 and IEEE 487 (Wire-line communications protecting ground-potential-rise) are the references. The 1 Ω threshold specifically applies to the BONDING conductor loop resistance, not the ground rod-to-earth impedance (which is the 25 Ω threshold from a different test). R-1's definition conflates two different measurements. **Clarify: fall-of-potential (IEEE 81) tests the ground rod-to-earth resistance (≤25 Ω threshold); bond continuity (ohmmeter loop test) verifies the bonding conductor between points (≤1 Ω threshold — this is correct but needs clear citation separation from the 25 Ω value).**

- **CORRECTION C-14: `47 CFR §32.2420` cited in T13.L08 vocabulary_introduced under `aerial plant bonding schedule`.** Based on cascade pattern P1 in known-cascade-patterns.md: §32.2420 = parent "Cable and wire facilities" category (not Poles). The correct section for pole records is §32.2411 (Poles). R-1's L08 vocabulary definition for `aerial plant bonding schedule` says "47 CFR §32.2420" as documentation context — this repeats the known cascade error. **Correct to §32.2411 (Poles) and note §32.2410 (Cable and wire facilities) if referencing the broader plant account context.** This is a known cascade bug (P1).

#### New Content Items R-1 Missed
- **GAP G-11: PRIMARY PROTECTOR INSPECTION IS MISSING FROM T13.L08.** T19.L06 introduces the primary protector, IBT-entry, and GES-tie-in. T13.L08 (bonding and grounding QA inspection) should include visual and functional verification of the primary protector at the headend-side cable entry: presence of the protector, bonding conductor to the IBT-entry ground bar, and continuity from the protector housing to the GES. R-1's vocabulary_assumed for T13.L08 includes `TGB, IBT-entry, GES-tie-in → T19` — so the prerequisite is acknowledged — but the lesson scope does not include primary protector inspection as a QA item. Add to L08 scope.

---

### T13.L09 — Contractor vs. Owner Inspection Rights

#### Corroborations (R-1 was right)
- ✓ AIA A201 §12.2 for right of rejection — with `[confirm edition]` marker, which is correct.
- ✓ `final lien waiver` definition and subcontractor lien risk are accurate.
- ✓ `contractor QC` framing (self-inspection required before acceptance) is correct per RUS 1751F-630 §7.

#### Corrections
- **CORRECTION C-15: R-1 cites "RUS loan administration guidance" as authority for final lien waiver requirement without a specific citation.** For RUS-program projects, the lien waiver requirement comes from the construction contract terms, which are governed by the RUS standard construction contract (if the borrower uses one) or the borrower's own contract form meeting RUS requirements. The specific RUS citation for final lien waiver would be in 7 CFR Part 1755 (telecommunications standards) loan conditions or the RUS standard contract. Recommend: cite as "(Standard construction contract terms; consult 7 CFR Part 1755 for RUS-specific requirements)" rather than generic "RUS loan administration guidance."

#### New Content Items R-1 Missed
- **GAP G-12: STATE-SPECIFIC LIEN-WAIVER TIMING RULES ARE MISSING.** Many states have "prompt payment" laws that impose deadlines on lien waiver exchanges and retainage release. Georgia (Carter's location) has Georgia Prompt Payment Act (O.C.G.A. §13-11-1 et seq.). This is AHJ-dependent but worth flagging for the Georgia-based audience. Add a note: "State lien laws vary — some states require lien waiver exchange and retainage release on a statutory schedule. Verify with the project attorney."

---

### T13.L10 — T13 Capstone Quiz

#### Corroborations (R-1 was right)
- ✓ 20-question structure with domain breakdown is appropriate.
- ✓ Integrated BranchingScenario capstone (250-pole aerial build in Light loading district) covers the right cross-lesson topics.
- ✓ Quiz domain breakdown (30% aerial / 25% underground / 25% punch list/Form 219 / 20% grounding + rights) is reasonable.

#### Corrections
- **NOTE: Capstone integrative scenario combines 4 lessons into a single walkthrough — this is appropriate for capstone. However, the grounding inspection component (28 Ω at 5 of 60 poles) needs verification: is 28/25 Ω threshold decision (punch list vs. kick-back) consistent with R-1's L08 framework?** Per R-1's punch list vs. kick-back table: "Ground resistance above threshold, isolated = punch list (re-drive ground rod); Ground resistance above threshold, 10%+ of poles in segment = kick-back." 5/60 = 8.3% which is below the 10% threshold — so R-1's framework would say punch list. But 5 poles with failing resistance on an aerial run is genuinely a pattern that might warrant an engineering evaluation rather than a routine re-drive. The 10% threshold as the kick-back trigger is a field-practice norm without a specific RUS citation — flag for author review.

---

## Numeric Claims Requiring Primary-Source Verification

| Claim | Source per R-1 | Adversarial Assessment |
|---|---|---|
| 25 Ω ground resistance threshold | NEC 250.53 / RUS 1751F-810 | ✓ CORRECT — registry-verified |
| 95% Modified Proctor for road-bearing backfill | ASTM D1557 / RUS 1751F-635 §7 | ✓ CORRECT — D1557 is Modified; but verify R-1 text explicitly says D1557 not D698 |
| 30 ft slack at above-ground closures | RUS 1751F-630 §6 | ⚠️ CONFLICT — T10.L06 authored says "50 ft at intermediate handholes" (C-8 above) |
| 50–100 ft slack at underground vaults | RUS 1751F-635 §7 | ⚠️ CONFLICT — T10.L06 authored says "100 ft at splice-point handholes" (C-8 above) |
| "Checking ≥ 1/3 pole diameter = rejection" | Claimed as ANSI O5.1 | ⚠️ UNVERIFIED — may be field heuristic, not ANSI O5.1 verbatim (C-5 above) |
| 10% pole spot-check for grounding | RUS 1751F-810 §3 | ⚠️ UNVERIFIED — likely field practice norm, not in 1751F-810 verbatim (C-12) |
| ≤1 Ω bond continuity loop resistance | RUS 1751F-810 / IEEE 487 | ⚠️ NEEDS SEPARATION from 25 Ω threshold — different tests (C-13) |
| 5–10% retainage | RUS loan administration | ✓ ACCURATE range per standard construction contracts |

---

## DAG Pointer Corrections vs. R-1

| Term | R-1 Claimed Source | Adversarial Verification | Verdict |
|---|---|---|---|
| `acceptance walk` | T10.L11 (vocabulary_introduced) in T13.L01 | T10.L11 already introduces this term (authored file confirmed) | ⚠️ VIOLATION — T13.L01 should have `vocabulary_assumed` not `vocabulary_introduced` |
| `inspector (OSP)` | T13.L01 (vocabulary_introduced) | T10.L11 introduces `field inspector` covering same concept | ⚠️ POTENTIAL DUPLICATION — merge or distinguish |
| `pay application` | T10.L10 | T10.L10 vocabulary_introduced line 30 confirmed | ✓ CORRECT |
| `deviation log` | T10.L10 | T10.L10 vocabulary_introduced line 28 confirmed | ✓ CORRECT |
| `as-built redline` | T10.L10 | T10.L10 vocabulary_introduced line 29 confirmed | ✓ CORRECT |
| `MSA`, `NIU slack`, `expansion loop`, `storage coil` | T10.L06 | T10.L06 vocabulary_introduced lines 29-55 confirmed | ✓ CORRECT |
| `fall-of-potential` | T14.L06 | T14.L06 vocabulary_introduced line 19 confirmed | ✓ CORRECT |
| `clamp-on method` | T14.L06 | T14.L06 vocabulary_introduced line 23 confirmed | ✓ CORRECT |
| `ground test log` | T14.L10 | T14.L10 vocabulary_introduced line 19 confirmed | ✓ CORRECT |
| `aerial plant bonding schedule` | T14.L10 | T14.L10 vocabulary_introduced line 18 confirmed | ✓ CORRECT |
| `TGB`, `IBT-entry`, `GES-tie-in` | T19 | T19.L06 vocabulary_introduced for all three confirmed | ✓ CORRECT |
| `RUS Form 219` | T10.L10 (awareness) | T01.L05 is the primary introduction (vocabulary_introduced line 28 confirmed) — T10.L11 uses it as assumed → T01.L05 | ⚠️ CORRECTION — T13.L07 should point to T01.L05, not T10.L10, as RUS Form 219 source lesson |
| `punch list` | T10.L11 | T10.L11 vocabulary_introduced confirmed | ✓ CORRECT |
| `kick-back authority` | T10.L11 | T10.L11 vocabulary_introduced confirmed | ✓ CORRECT |

---

## New Citations R-2 Adds (Not in R-1)

| Citation | Title | Source | Scope |
|---|---|---|---|
| 29 CFR §1910.268(a) | OSHA Telecommunications — Qualified Person definition | https://ecfr.gov/current/title-29/section-1910.268 | T13.L01 — who can be an OSP inspector |
| 29 CFR §1910.268(g)(1) | Climbing above 4 ft — equipment requirements | https://ecfr.gov/current/title-29/section-1910.268 | T13.L03 — inspector pole-access liability |
| NEC §250.56 | Resistance of Rod Electrode / augmentation rule | NFPA 70-2023 §250.56 | T13.L08 — 25 Ω augmentation requirement (when exceeded, add second rod) |
| NEC §250.53(A)(2) | Exceptions to single-rod resistance requirement | NFPA 70-2023 §250.53 | T13.L08 — 25 Ω single-rod interpretation |
| ASTM D698 | Standard Test Methods for Laboratory Compaction Characteristics using Standard Effort | ASTM [paywalled] | T13.L04 — distinguish from D1557 (Modified Proctor) to prevent misapplication |
| 7 CFR Part 1755 (generally) | RUS Telecommunications Standards — material and construction requirements | https://ecfr.gov/current/title-7/part-1755 | T13.L07 — RUS-listed material compliance |
| Georgia O.C.G.A. §13-11-1 | Georgia Prompt Payment Act (state-level, AHJ-specific) | https://law.justia.com/codes/georgia/title-13/chapter-11/ | T13.L09 — lien waiver state-law note |
| FOA CFOS-O KSA 6.4.7 | Documentation and Records for OSP Installation | https://www.foa.org/cert/cfos.html | T13.L01 — QA/QC distinction secondary source |

---

## Summary of Adversarial Findings

### HIGH Priority (block or require author fix before publishing)
1. **C-1: `acceptance walk` re-introduced in T13.L01 — already in T10.L11 vocabulary_introduced.** DAG invariant violation.
2. **C-8: Slack minimums in T13.L05 (30 ft aerial / 50–100 ft vault) CONFLICT with T10.L06 authored values (50 ft intermediate / 100 ft splice-point).** Cross-lesson numeric contradiction.
3. **C-14: `§32.2420` in T13.L08 repeats known cascade bug P1.** Should be §32.2411 (Poles).

### MEDIUM Priority (require fix but non-blocking for authoring start)
4. **C-2: `inspector (OSP)` vs. `field inspector` from T10.L11 — potential duplicate introduction.**
5. **C-3: NESC Grade B / Grade C distinction missing from T13.L02 clearance inspection.**
6. **C-5: "Checking ≥ 1/3 diameter" threshold not verified against ANSI O5.1 verbatim — may be field heuristic mis-attributed.**
7. **C-7: D1557 vs. D698 Proctor distinction not explicit in R-1 — must specify Modified Proctor (D1557) in L04.**
8. **C-10: `as-built signature` conflates contractor signature with PE stamp.**
9. **C-12: 10% spot-check threshold in L08 cited as RUS 1751F-810 but likely field-practice norm.**
10. **C-13: 25 Ω threshold and ≤1 Ω continuity threshold conflated in `bond continuity check` definition.**
11. **DAG: `RUS Form 219` source lesson should be T01.L05, not T10.L10 (T10.L11 uses T01.L05 as the source).**

### LOW Priority (content gaps to add during authoring)
12. **G-1: Wind-load / season effect on clearance observations missing from L02.**
13. **G-2: Overlash inspection not in L02 scope.**
14. **G-3: Pole-class change trigger workflow (PE referral) missing from L03.**
15. **G-4: Compaction test frequency / audit missing from L04.**
16. **G-5: Pre-backfill vs. post-backfill inspection stages missing from L04.**
17. **G-6: Cable ID label format compliance missing from L05.**
18. **G-8: Partial payment scenario missing from L06.**
19. **G-9: RUS-listed material concept undefined in L07.**
20. **G-10: Phased draw / partial Form 219 submission missing from L07.**
21. **G-11: Primary protector inspection missing from L08.**
22. **G-12: State-specific lien waiver timing rules missing from L09.**

---

=== T13 RESEARCH R-2 BRIEF END ===
