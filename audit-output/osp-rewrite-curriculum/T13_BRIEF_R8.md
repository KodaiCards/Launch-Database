# T13 (Inspection & Quality Assurance) — Research Brief R-8

**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T13_BRIEF_R8.md` written. No CLAUDE.md edits. No lesson file edits. No dispatching. No canonical files.

**Agent:** T13 Research R-8 — contractor/PM perspective  
**Date:** 2026-05-18  
**Framing:** Senior OSP contractor PM reviewing T13 from the CONTRACTED-PARTY side. The inspector is "the other side" — the entity with authority over my crew's productivity, my warranty exposure, my retainage release, and my payment timeline. What does this curriculum NOT teach the inspector that the contractor PM NEEDS them to competently do?

**Scope constraint:** Hunting specifically for contractor/PM perspective gaps NOT addressed in R-1..R-7. Prior rounds addressed safety (R-7), legal liability (R-4), curriculum-transfer (R-6), learner usability (R-5), DAG violations (R-1..R-3). This round is the contracted-party lens: acceptance criteria timing, pre-construction coordination, concurrent inspection cadence, change-order documentation, retainage triggers, re-inspection cost allocation, constructive vs. final acceptance, substantial vs. final completion, and inspector communication channel authority.

**Independent gap-research sources (different from R-1..R-7):**
- AIA A201-2017 General Conditions (standard construction contract — applicable to non-RUS contracts)
- 7 CFR Part 1753 Subpart F (RUS Telecommunications System Construction Policies and Procedures — closeout/acceptance provisions)
- 7 CFR 1753.8 (RUS contract construction procedures — retainage and payment)
- RUS Form 515 (Telecommunications Systems Construction Contract — acceptance test + final inspection provisions)
- 48 CFR §52.232-5 (FAR — payments under fixed-price construction contracts — retainage benchmark)
- FHWA Construction Program Management and Inspection Guide (concurrent inspection and pre-construction protocol)
- FAR 52.246-12 (Government Inspection of Construction — contractor co-access rights)
- Differing Site Conditions doctrine (standard construction law — contractor notice requirements)
- Constructive acceptance doctrine (construction law — owner's voluntary assumption of non-conforming work)

---

## §1: Pre-Construction Acceptance Criteria — T13.L01 and T13.L09 Gap

### FINDING R8-H1 (HIGH) — T13 Never Teaches the Inspector to Establish and Communicate Acceptance Criteria BEFORE Construction Starts

**Evidence from R-1..R-7 gap:**
- T13.L01 teaches the inspector's ROLE and authority (QA/QC distinction, kick-back authority, documentation obligations).
- T13.L09 teaches contractor rights and re-inspection processes.
- Neither lesson teaches the inspector to ESTABLISH and DOCUMENT acceptance criteria in a pre-construction conference BEFORE construction begins.

**Why this matters from the contractor PM side:**

Every disputed kick-back I've ever been in as a contractor PM had the same root cause: the inspector was applying an acceptance standard I didn't know about until they rejected my work. If the inspector had told me BEFORE I installed 3,000 ft of cable that they expected lashing pitch ≤6 in. (not the 8 in. my crew was trained to), I'd have reset the lashing machine before we started. Instead, they rejected the section at the end of the job.

**What the standard of care requires:**

FHWA Construction Program Management and Inspection Guide (Appendix D): "A pre-construction conference shall be held prior to the start of construction. The agenda shall include: review of acceptance criteria for each major work element; inspector introduction and communication protocol; and documentation procedures for contractor requests for information."

RUS Form 515 §3(a): "Before construction begins, the engineer (inspector) shall hold a pre-construction conference with the contractor, borrower, and any subcontractors to review plans, specifications, and acceptance requirements."

AIA A201 §3.10.1: Contractor submits a construction schedule AND the owner's architect (inspector equivalent) reviews and confirms acceptance criteria at the project kickoff.

**Contractor PM's specific need:**

A T13-trained inspector must know how to:
1. Identify every major work element with a quantified acceptance criterion BEFORE construction starts (not at final inspection).
2. Document those criteria and share them in writing with the contractor PM at the pre-construction conference.
3. Call out any acceptance criteria that differ from the specification default (e.g., "for this RUS borrower, the minimum compaction is 95% per ASTM D1557 Modified Proctor — same as T13.L04 teaches — but the inspector tests at EVERY road crossing, not just randomly sampled").
4. Confirm in writing what CONCURRENT inspection schedule they will maintain (daily? weekly? milestone-based?) so the contractor PM can plan crew workflow.

**Cascade gap:** T13.L06 (Punch List vs. Kick-Back Decision Framework) teaches WHAT gets kicked back — but has no lesson that teaches the inspector to PREVENT kick-backs by pre-establishing criteria. An inspector who hasn't been taught to do the pre-construction conference will arrive at final inspection and reject work that the contractor could have corrected in real time had they known the standard.

**Fix:** Add to T13.L01 or create T13.L01a (pre-construction coordination lesson):
1. Pre-construction conference agenda template — what the inspector MUST communicate before construction starts.
2. Acceptance criteria matrix — the inspector's obligation to quantify and document each work element's acceptance threshold BEFORE that element is constructed.
3. Concurrent inspection commitment letter — the inspector's schedule cadence communicated to the contractor PM in writing.
4. The contractual consequence of not establishing criteria pre-construction: inspector may be estopped from rejecting work that was done per specification default. Cross-reference R4-H2 (waiver-by-course-of-conduct) — same doctrine applies when inspector never communicated their criterion.

---

## §2: Concurrent Inspection Cadence — T13 Teaches What to Inspect, Never WHEN

### FINDING R8-H2 (HIGH) — T13 Teaches Inspection Methodology Without Teaching the Concurrent Inspection Schedule That Protects Both Parties

**Evidence from R-1..R-7 gap:**
- T13.L02 through T13.L08 teach WHAT to look for in each work element.
- No lesson teaches the inspector when to inspect during construction — daily, weekly, milestone-based, or only at the end.
- R-6 H-3 (R6-H3) identifies that "inspector-arrival workflow" is missing but frames it as a day-organization problem. R8-H2 is a different issue: the SCHEDULE of inspection visits during the project, not the daily workflow within one visit.

**Why this matters from the contractor PM side:**

If the inspector shows up only at final inspection (the "end-of-project surprise" pattern), then:
1. Work that was deficient at the foundation level — lashing machine calibration, burial depth machine setting, compaction pass count — has been locked in for miles.
2. The cost of correction at final inspection is 10-50x the cost of correction during construction.
3. The contractor bears the entire correction cost even though concurrent inspection would have caught the calibration issue in the first 500 ft.

**What the standard requires:**

7 CFR 1753.8: "The borrower shall arrange for inspection of work in progress. Inspection shall be conducted frequently enough to determine that the work conforms to the plans and specifications." ("Frequently enough" is a performance standard, not a schedule.)

FHWA CPMI Guide Appendix B: Identifies three inspection cadence models — (1) continuous inspection (present during all work); (2) milestone inspection (present at defined construction phases); (3) random/sampling inspection (sampling-rate-based). Each model has different contractor risk profiles. The inspector must communicate WHICH model applies.

RUS Form 515 §3: The inspector has the right of access to the work at all times during construction. But having the RIGHT to inspect does not obligate the inspector to show up until the contractor has a legitimate expectation of concurrent inspection.

**The constructive-concurrent-inspection doctrine:**

When a contract specifies that the owner's inspector "may inspect work in progress" and the inspector does NOT appear during construction, the contractor can argue that the owner implicitly accepted the work as performed by course-of-conduct (AIA A201 §9.4 and §12.2 — acceptance by not exercising rejection rights). This doctrine is the flip side of R4-H2 (waiver-by-course-of-conduct for verbal accommodation) — both sides can invoke course-of-conduct.

**Fix:** Add to T13.L01 (or the pre-construction coordination lesson in R8-H1 fix):
1. Inspection cadence models — teach the three FHWA models with contractor risk profile for each.
2. The inspector's commitment to communicate their inspection schedule in writing to the contractor PM at the pre-construction conference.
3. The milestone inspection checklist — what construction milestones trigger a mandatory inspector presence (first pole set, first span lashed, first road crossing, first compaction segment, first splice closure).
4. The contractual consequence of a "surprise final inspection" — if the inspector fails to show up during construction, their ability to reject work may be limited by constructive-acceptance doctrine. A T13-trained inspector understands why concurrent inspection protects the owner's reject rights as much as it protects the contractor.

---

## §3: Change Order Documentation — Field Deviation Protocol Missing from T13

### FINDING R8-M1 (MEDIUM) — T13 Has No Lesson Teaching the Inspector How to Document and Approve Field-Condition Deviations (Change Orders) When the Contractor Encounters a Differing Site Condition

**Evidence from R-1..R-7 gap:**
- T13.L04 (Underground Plant Inspection) teaches depth probe and compaction verification.
- T09.L10 (Permitting, per DAG) introduces differing-site-condition (DSC) permit modification.
- R-4 M-2 mentions "deviation log at permit crossings" as a medium finding for T13.L04 — but only addresses logging, not the full change-order protocol.
- No T13 lesson teaches what the inspector does when the contractor hits a legitimate DSC and needs a field-change authorization.

**Contractor PM's specific need:**

When my crew hits a rock shelf at 18 in. depth on a road crossing that was specified at 36 in., I stop work and notify the inspector. The inspector must:
1. Evaluate whether this qualifies as a Type I DSC (condition different from what was indicated in the contract) or a Type II DSC (condition different from what would normally be expected).
2. Issue a written field change order (FCO) authorizing the deviation OR instruct the contractor to proceed at the correct depth (blast through the rock, install steel conduit at the shallower depth, or reroute).
3. Document the authorization chain: inspector → engineer-of-record → borrower → (if required) RUS GFR.

**Why T13 needs to teach this:**

Without a T13-trained inspector who knows the DSC protocol, the contractor is stuck:
- If the inspector gives verbal permission to deviate from spec, and that verbal permission is later disputed, the contractor has no defense.
- If the inspector tells the contractor to "figure it out" without a written FCO, and the work is later rejected at final inspection, the contractor bears the cost even though the deviation was field-directed.
- Under 7 CFR 1753.47(d): "No change may be made in the contract plans or specifications without prior written approval of the borrower's engineer." An inspector who doesn't know this may verbally approve a deviation that is contractually void without engineer written approval.

**Primary sources:**
- 7 CFR 1753.47(d): Changes to contract plans/specifications require written engineer approval.
- Standard Differing Site Conditions doctrine (FAR 52.236-2, applicable by analogy to RUS construction): contractor must give prompt written notice before conditions are disturbed; owner must investigate and issue a written direction before contractor proceeds.
- AIA A201 §4.2.8: Inspector (architect's representative) has authority to order minor changes in the work — defined as changes that do not affect contract sum or time. All other changes require a formal Change Order.

**Fix:** Add to T13.L04 (underground inspection) AND T13.L02 (aerial inspection), or create a T13.L06a (Field Changes and Deviation Approval):
1. What constitutes a DSC in OSP construction — typical scenarios: unexpected rock, unknown buried utilities, soil-type change affecting conduit selection, existing structure at specified HDD bore path.
2. The three-step DSC protocol: STOP + NOTIFY (written, same day) → INSPECTOR EVALUATES (field investigation, photos, measurements) → WRITTEN FCO ISSUED (from engineer-of-record via the borrower, not from the inspector alone).
3. Inspector authority limits: the inspector CAN authorize a minor deviation (equivalent to AIA A201 §4.2.8 minor change) without a full change order IF the deviation does not affect cost or schedule. Inspector CANNOT authorize deviations that increase cost or change specification minimums — those require the engineer-of-record.
4. What happens if the inspector approves a deviation verbally without a written FCO: the deviation is contractually void under 7 CFR 1753.47(d). Both the contractor (who proceeds without authorization) and the inspector (who verbally authorized) face exposure.

---

## §4: Retainage Release Triggers — T13.L07 Gap

### FINDING R8-M2 (MEDIUM) — T13.L07 (Form 219 Closeout) Does Not Teach the Inspector That Their Certification Directly Triggers Retainage Release and the Specific Milestone Criteria Required

**Evidence from R-1..R-7 gap:**
- T13.L07 teaches Form 219 workflow and the FCA cross-reference (R4-H1).
- R-2 mentions "retainage / lien waiver citation" as a low concern in G-12.
- No T13 lesson explicitly teaches the retainage release milestone sequence or the inspector's role as the triggering authority.

**RUS retainage mechanics:**

7 CFR 1753.8 and RUS Form 515: "Not less than 5 percent of the contract price is held as retainage until the project is substantially complete and accepted by the owner, consulting engineer, and Agency (GFR)."

The sequence:
1. **Milestone retainage reduction:** In RUS contracts with substantial completion provisions, the retainage may be reduced from 10% to 5% when the project is "substantially complete" — meaning all permanent work is in place and functional, even if punch list items remain. The inspector's written certification of substantial completion triggers this reduction.
2. **Final retainage release:** After all punch list items are closed and the Form 219 is signed by the engineer, the remaining retainage is released. The engineer's signature on Form 219 is the direct trigger.
3. **Latent defect warranty retention:** Some RUS contracts (and most standard contracts per AIA A201 §12.2.5) allow the owner to withhold an additional amount from final payment to cover the estimated cost of known but unresolved defects that the contractor acknowledges but has not yet corrected.

**Contractor PM's specific need:**

If the inspector holds up substantial completion certification because of punch list items that are cosmetic (paint touch-up on a pedestal, label format on a closure) rather than functional, the contractor PM's crew is carrying the cost of the retainage float for items that do not affect the function or safety of the plant. The T13-trained inspector must know:
1. Substantial completion ≠ punch-list-free. Substantial completion requires that the plant is functional and usable for its intended purpose. Punch list items are correctable without affecting function.
2. The inspector who delays substantial completion certification for non-functional punch list items is costing the contractor money and may be creating a breach-of-contract claim against the borrower.
3. The Form 219 signature (final completion) = zero known unresolved deficiencies. Substantial completion = plant functional, punch list documented and acknowledged.

**The AIA A201 framework (applicable to non-RUS contracts):**

AIA A201 §9.8.1: "Substantial Completion is the stage in the progress of the Work when the Work or designated portion thereof is sufficiently complete in accordance with the Contract Documents so that the Owner can occupy or utilize the Work for its intended use."

AIA A201 §9.10: Final Certificate for Payment requires "all documents required by the Contract Documents" and confirmation that punch list items have been completed or their completion is secured.

**Fix:** Add to T13.L07:
1. Distinguish substantial completion vs. final completion with the retainage implications: substantial completion triggers reduced retainage float; final completion (Form 219 sign-off) releases all remaining retainage.
2. The inspector's obligation to certify substantial completion promptly when the plant is functional — even if cosmetic punch list items remain.
3. The contractor PM's remedy if substantial completion certification is withheld for non-functional items: written notice to the engineer-of-record requesting substantial completion determination; the engineer's determination supersedes the inspector's hold.
4. Latent defect withholding — when the borrower can legitimately hold back additional funds beyond standard retainage (known systemic defects, not cosmetic items).

---

## §5: Re-Inspection Cost Allocation — T13.L09 Gap

### FINDING R8-M3 (MEDIUM) — T13.L09 (Contractor Rights and Re-Inspection) Does Not Address the Cost Allocation Question: WHO PAYS for a Re-Inspection When the Contractor Disputes a Kick-Back Call?

**Evidence from R-1..R-7 gap:**
- T13.L09 teaches contractor rights: right to be present at inspection, right to request written documentation, right to appeal kick-back calls to the engineer-of-record.
- R-4 H-2 teaches the waiver-by-course-of-conduct risk for inspectors.
- No T13 lesson addresses the financial mechanics of disputed re-inspections.

**Contractor PM's specific need:**

When an inspector rejects a section of aerial lashing and I believe the rejection is wrong (the lashing pitch is within spec per my measurement; the inspector's measurement was taken with a metal tape that they held at an angle), I have the right to dispute the kick-back per T13.L09. But the process is:
1. I stop work and request the engineer-of-record to adjudicate.
2. The engineer comes out for a re-inspection.
3. The engineer CONFIRMS the rejection.

Now: who pays for the engineer's re-inspection visit?

**The standard allocation rule (industry practice and AIA A201 §12.2.4):**

- If the re-inspection confirms the deficiency: the contractor pays the cost of the re-inspection (it was the contractor's burden to ensure their work was compliant before requesting a re-inspection).
- If the re-inspection REVERSES the original kick-back (inspector was wrong): the cost of the re-inspection is the owner's burden, and the contractor may have a delay claim for work-stoppage time during the dispute.

**RUS-specific dimension:**

Under RUS contracts, the borrower's engineer issues the final determination. The inspector's kick-back is a FIELD RECOMMENDATION to the engineer, not a final determination. The contractor can invoke this distinction: the inspector's opinion triggers a hold; the engineer's written determination is the binding call. An inspector who presents their kick-backs as final determinations is exceeding their authority (per 7 CFR 1753.8 — the engineer, not the field inspector, certifies acceptance).

**The T13 teaching gap:**

T13.L09 teaches the contractor's RIGHT to dispute — but doesn't teach the cost-allocation consequence of exercising that right, nor the distinction between the inspector's field kick-back (non-binding recommendation) and the engineer's written determination (binding). A T13-trained inspector who understands these mechanics will:
1. Frame their kick-backs explicitly as "I'm recommending rejection pending engineer determination" rather than "this is rejected."
2. Understand that the contractor bears re-inspection cost if the engineer confirms — which means the contractor has a financial incentive to self-correct before requesting the engineer.
3. Document their own measurement methodology (instrument type, approach angle, witness signature) at the time of the original kick-back — because if the re-inspection reverses the call, undocumented methodology = no defense.

**Fix:** Add to T13.L09:
1. Cost allocation rule for re-inspections: contractor pays if confirmed; owner pays if reversed. Teach both directions.
2. Inspector's kick-back as recommendation vs. engineer's determination as binding — the authority distinction that protects the inspector from personally absorbing the dispute cost.
3. Inspector's documentation obligation at the time of the kick-back: instrument type, measurement location, witness present, any weather/condition factors that affected the measurement.
4. The contractor's written-notice obligation before stopping work: contractor must give notice of dispute within [X] days per the contract (AIA A201 §15.1.2: 21 days; RUS Form 515: immediately upon knowledge).

---

## §6: Inspector Communication Channel — T13 Has No Lesson on the Designated-POC Rule

### FINDING R8-L1 (LOW) — T13 Does Not Teach the Inspector-as-Sole-Channel Rule: Only the Inspector's Written Instructions Are Binding on the Contractor

**Evidence from R-1..R-7 gap:**
- T13.L01 teaches kick-back authority and QA/QC framing.
- No T13 lesson teaches that the inspector must establish themselves as the SOLE authorized communication channel between the owner's team and the contractor for construction direction — and why this matters.

**Contractor PM's specific need:**

On a typical RUS project, there are multiple people with apparent authority: the inspector, the borrower's in-house engineer, the borrower's operations manager, the RUS GFR. If the borrower's operations manager stops my crew in the field and says "go ahead and run that cable at 24 in. depth — we'll get the permit change later," and then the inspector later rejects the depth, I'm in a dispute about whether I had authorization.

**The rule (7 CFR 1753.47(d) + standard construction contract law):**

Only the engineer-of-record (and by delegation, the designated inspector) can authorize changes to construction scope or specification compliance. Instructions from the borrower's operations staff, the GFR, or anyone other than the designated inspector are not binding changes to the contract. The contractor who follows non-inspector direction without getting it confirmed in writing by the inspector has accepted the risk of non-conforming work.

**Fix (Low — author note for T13.L01):** Add a section on the inspector's role as sole-direction channel: "As the inspector, you are the owner's designated communication channel for construction direction. Written direction from you carries contract authority. Verbal direction from other owner staff — operations managers, finance staff, even the borrower's engineer in informal field conversation — does not bind the contractor or override the contract. When another owner staff member gives a contractor a direction that contradicts the spec, write a documented clarification the same day: 'Contractor has been instructed to proceed at [depth] per my direction — this supersedes any prior informal communication from [name].'"

---

## §7: Constructive Acceptance — T13.L09 and T13.L07 Gap

### FINDING R8-L2 (LOW) — T13 Does Not Teach Constructive Acceptance: When the Owner's Use of Non-Conforming Work Defeats the Warranty

**Evidence from R-1..R-7 gap:**
- T13.L07 teaches Form 219 sign-off workflow and FCA risk (R4-H1).
- T13.L09 teaches contractor rights.
- R-4 H-2 teaches waiver-by-course-of-conduct (inspector verbal accommodation).
- Neither lesson teaches the doctrine of constructive acceptance — when the owner USES non-conforming plant, constituting voluntary acceptance.

**The constructive acceptance doctrine:**

AIA A201 §9.9.3: "The Owner's use of the Work or a portion thereof shall not constitute acceptance of Work not in accordance with the Contract Documents." This is the standard contract language that BLOCKS constructive acceptance.

BUT: under common law (and when the AIA anti-constructive-acceptance provision is absent from the contract), if the owner occupies and operates the plant knowing of a deficiency, the owner may have constructively accepted the deficiency — defeating the warranty claim.

**Fix (Low — author note for T13.L07):** "When completing Form 219, verify that all known deficiencies are documented in the punch list or deviation log BEFORE sign-off. A borrower who operates a network segment with a known unresolved deficiency — without documenting it as an open punch list item — may have constructively accepted that condition under applicable state contract law, even if the AIA A201 §9.9.3 anti-constructive-acceptance provision is in the contract. The Form 219 punch list documentation is the owner's defense against constructive-acceptance claims."

---

## §8: Negative Findings — Items Checked and Confirmed Adequately Addressed

- **Contractor presence at inspection (T13.L09):** R-1 brief confirms contractor right to be present. Not a gap.
- **Written documentation of kick-backs (T13.L01, T13.L09):** R-4 H-2 addresses verbal accommodation risk. Covered adequately.
- **Form 219 as final certification trigger (T13.L07):** R-4 H-1 addresses FCA exposure. Form 219 trigger is covered.
- **Contractor's right to appeal to engineer-of-record (T13.L09):** R-1 includes this in scope. Not a gap for basic contractor rights.
- **Retainage percentage (5%):** Referenced in RUS Form 515 / 7 CFR 1753 context — the 5% floor is a RUS-specific requirement and differs from the 10% common in commercial contracts. R-1 through R-7 do not contradict this. Not a gap requiring a new HIGH finding.

---

## §9: New Citations Identified (Not in R-1..R-7 or Citation Registry)

| Citation | Description | Relevant T13 Lesson |
|---|---|---|
| **7 CFR 1753.47(d)** | Changes to contract plans/specs require written engineer approval — verbal approvals void | T13.L04, T13.L02, proposed T13.L06a |
| **7 CFR 1753.8** | RUS contract construction procedures — 5% retainage floor until substantial completion | T13.L07 |
| **RUS Form 515 §3(a)** | Pre-construction conference requirement; inspector must communicate acceptance criteria | T13.L01 |
| **AIA A201-2017 §4.2.8** | Inspector authority limits — minor change vs. formal change order | T13.L01, proposed T13.L06a |
| **AIA A201-2017 §9.8.1** | Substantial completion definition — functional use, not punch-list-free | T13.L07 |
| **AIA A201-2017 §9.9.3** | Anti-constructive-acceptance provision | T13.L07 |
| **AIA A201-2017 §12.2.4** | Re-inspection cost allocation — confirmed deficiency = contractor pays | T13.L09 |
| **AIA A201-2017 §15.1.2** | Contractor written-notice obligation for dispute (21-day window) | T13.L09 |
| **FAR 52.236-2** | Differing site conditions — contractor notice before disturbing conditions; owner investigation and written direction | T13.L04, T13.L02 |

Note: AIA A201 is the industry standard general conditions document — paywalled but widely cited in secondary literature. 7 CFR 1753 provisions are public (eCFR). Citations marked `[confirm edition]` for AIA documents; current edition is AIA A201-2017. 7 CFR 1753 provisions are current as of 2026.

---

## §10: Saturation Assessment

**R-1..R-7 HIGH pool before R-8:** 15 HIGH findings.

**R-8 findings — contractor/PM framing:**

| ID | Lesson | Severity | Description |
|---|---|---|---|
| R8-H1 | T13.L01 + proposed pre-construction | HIGH | Pre-construction acceptance criteria establishment missing — inspector must communicate quantified acceptance thresholds BEFORE construction starts. Without this, every kick-back is a surprise to the contractor PM. 7 CFR 1753 RUS Form 515 §3(a) + FHWA CPMI Appendix D require pre-construction conference with acceptance criteria review. |
| R8-H2 | T13.L01 | HIGH | Concurrent inspection cadence missing — T13 teaches what to inspect but never when. No lesson teaches the three inspection models (continuous/milestone/sampling) or the contractor-PM's expectation right. Inspector who shows up only at final inspection creates constructive-acceptance risk and imposes 10-50x correction cost on the contractor for deficiencies that could have been caught in the first 500 ft. |
| R8-M1 | T13.L04 + T13.L02 | MEDIUM | Field-condition deviation (change order) protocol missing — 7 CFR 1753.47(d) requires written engineer approval for spec changes; verbal inspector approval is void. T13 has no lesson on the DSC notice → inspector evaluation → written FCO chain. |
| R8-M2 | T13.L07 | MEDIUM | Retainage release milestones missing — T13.L07 teaches Form 219 workflow but not the substantial vs. final completion retainage distinction. Inspector who delays substantial completion for cosmetic punch list items costs the contractor money and may be in breach. |
| R8-M3 | T13.L09 | MEDIUM | Re-inspection cost allocation missing — who pays when the contractor disputes a kick-back? Contractor pays if confirmed; owner pays if reversed. Distinction between inspector's kick-back (recommendation) vs. engineer's determination (binding) is not taught. |
| R8-L1 | T13.L01 | LOW | Inspector-as-sole-direction-channel rule not taught — verbal direction from non-inspector owner staff is not a binding contract change. |
| R8-L2 | T13.L07 | LOW | Constructive acceptance doctrine not taught — owner's use of known-deficient plant without documentation can defeat warranty. |

**NEW HIGH findings this round: 2 (R8-H1, R8-H2).** Both are orthogonal to R-1..R-7 — prior rounds addressed safety, legal liability, curriculum-transfer, and learner usability. Contractor/PM side was entirely unrepresented.

**Cumulative HIGH pool (R1–R8): 17 HIGH findings total.**

**Assessment: YELLOW — new HIGH findings (2) confirm saturation has NOT been reached. R8-H1 (no pre-construction acceptance criteria communication) and R8-H2 (no concurrent inspection cadence teaching) represent systematic failures that would cause the trained inspector to operate in a way that routinely surprises contractor PMs — driving disputes, retainage holds, and re-work costs that a properly trained inspector would have prevented. These are NOT learner-usability issues (R-5/R-6) — they are fundamental teaching omissions about HOW an inspector operates in the construction ecosystem, not just what they look for.**

**HIGH pool saturation status:** R8 found 2 new HIGHs with the contractor/PM lens. Recommend one additional round (R-9) with EITHER an owner/borrower perspective OR an RUS GFR perspective — both sides of the contractor relationship have now been audited (contractor PM = R-8; inspector authority = R-1..R-4) but the RUS AGENCY side (GFR walk, RUS audit risk, close-out certification risk) has not been a primary framing in any round. R-7's safety round found 2 HIGHs; R-8's contractor round found 2 HIGHs; each framing is finding new material.

---

=== T13 RESEARCH R-8 BRIEF END ===
