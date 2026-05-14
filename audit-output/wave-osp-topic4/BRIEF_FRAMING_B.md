# OSP Topic 4 — Codes & Standards: Learner-Outcome Framing Brief (Agent B)

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Discovery / Brief — READ-ONLY (lesson files untouched)
**Framing:** Learner outcomes + daily-job applicability
**Word cap:** 1500 words

---

## §1 Topic 4 Learner Outcome

By end of Topic 4, a learner should be able to:

- **Identify** which code or standard governs a given OSP scenario (NESC, NEC, TIA, IEC, OSHA, RUS, or federal permit) and explain why the others are secondary.
- **Apply** NESC clearance and cover rules to verify aerial and buried designs during route design review.
- **Select** the correct NEC Article 770 fire-rating class for a given OSP-to-building transition.
- **Look up** TIA color-code position and TIA-606 identifier for a specific fiber in a multi-tube cable (daily splice-plan task).
- **Specify** TIA-526 test tier (Tier 1 vs. Tier 2) appropriate to the project type and contract.
- **Retrieve** the RUS bulletin and form number governing a given deliverable — drawing set, BOM, or close-out package.
- **Determine** which federal agency permit governs a crossing type (DOT / railroad / USACE) and the critical-path timeline.
- **Cross-reference** grounding, bonding, and safety requirements to Topics 6 and 9 — knowing where to look is the competency, not memorizing the depth of every standard.

---

## §2 Lesson Outline Proposal (15 lessons, ~4.75 hrs)

DISCOVERY.md 15-lesson structure is well-calibrated. Endorsed here with sequencing rationale. Order follows designer workflow: *structural rules → in-building/component rules → component identification/testing → program-specific regulatory requirements.*

| # | Title | Est. | Sequencing Rationale |
|---|---|---|---|
| 4.1 | NESC Overview: Purpose, Editions, Structure, Applicability | 20 min | Structural baseline for 4.2–4.4 |
| 4.2 | NESC Part 2 — Overhead Clearances and Loading | 25 min | Daily tool: verify aerial spans before stamping |
| 4.3 | NESC Part 3 — Underground Cover and Conduit Rules | 20 min | Daily tool: verify buried designs; annotate plan sheets |
| 4.4 | NESC Part 4 — Work Rules: Code-Citation Level | 20 min | Code-location skill; field safety practice in Topic 9 |
| 4.5 | NEC Article 770 — Optical Fiber In-Building Classification | 25 min | Every OSP route entering a building triggers this |
| 4.6 | NEC Article 800 + Chapter 8 — Communications Wiring | 20 min | Companion to 4.5; protector grounding, separation from power |
| 4.7 | NEC Article 250 — Grounding and Bonding Code Basis | 20 min | Code pointer only; Topic 6 owns installation depth |
| 4.8 | ANSI/TIA-758-C — Customer-Owned OSP Cabling Standard | 25 min | Primary authoring standard for every deliverable this team produces |
| 4.9 | ANSI/TIA-568.3-D — Fiber Components and Performance | 25 min | Component conformance: connectors, IL/RL, cable categories |
| 4.10 | TIA-598-D Color Codes + TIA-606 Labeling | 20 min | Daily mechanical task: color-to-position in splice plans and as-builts |
| 4.11 | ANSI/TIA-526 — Tier 1 vs. Tier 2 Acceptance Testing | 25 min | Places Topic 2 OTDR skills in the test-spec selection framework |
| 4.12 | IEC Standards: 60794, 61300, 61753, 60529 | 25 min | Datasheet literacy for procurement; IP rating selection |
| 4.13 | OSHA 1910 / 1926 — Code-Reference Overview | 20 min | Know which part controls and when to escalate; practice in Topic 9 |
| 4.14 | RUS / USDA Bulletins: 1751F-630/635, 1715E-110, Form 219 | 25 min | Daily document set for RUS-program projects |
| 4.15 | DOT, Railroad, and USACE Permit Code References | 20 min | Crossing permit identification + critical-path lead times |

---

## §3 + §4 Daily-Job Hooks and Failure Modes

| Lesson | Job trigger | Failure mode prevented |
|---|---|---|
| 4.1 | PM asks "does NESC apply?" | Misapplying NESC to customer-owned campus work, or missing it on utility-ROW work |
| 4.2 | Design-review checklist — aerial spans | Ice-load sag unchecked; cable fails clearance post-installation |
| 4.3 | Inspector asks "why 36 inches?" | Defaulting to 24 in. where NESC Rule 354 / RUS requires 36 in. |
| 4.4 | Foreman asks about approach distances on site | Designer guessing OSHA/NESC answers without authority; failing to cite rule number in submittal |
| 4.5 | Cable enters a building | Unlisted PE cable past 50-ft exception; fails electrical inspection |
| 4.6 | Drawing review — building-entry protector | Protector grounding omitted from design drawings |
| 4.7 | Riser detail — IBT placement | IBT missing from detail; crew improvises a non-compliant grounding path |
| 4.8 | Any OSP deliverable — slack, fill, labeling | Slack / conduit fill / labeling interval below TIA-758-C minimums; RUS inspector rejects as-built |
| 4.9 | Material submittal review | UPC specified where APC required; IL acceptance limit too loose on tight power-budget links |
| 4.10 | Splice plan authoring — fiber N, tube M | Color-code confusion on 24-fiber tubes; wrong pair spliced → field rework |
| 4.11 | Writing acceptance test spec | Tier 1-only on multi-splice route; bad splice passes OLTS budget, OTDR would have caught it |
| 4.12 | Datasheet review — closure in wet environment | IP54 closure in direct-bury application requiring IP68; floods at first rain |
| 4.13 | Crew leader asks about confined-space entry | Crew enters manhole without confined-space permit; designer failed to flag 1910.146 |
| 4.14 | RUS project BOM / drawing submittal | BOM not formatted for Form 219; reimbursement delayed; materials ordered off unapproved list |
| 4.15 | Route plan with railroad + waterway crossing | Permit not applied at kickoff; 6-month lead time discovered at 60% design |

---

## §5 Cross-Topic Dependencies

**Leans on:**
- T1 L1.7 → L4.5 (NEC 770 taxonomy: extend, don't re-teach)
- T1 L1.9/L1.11 → L4.9 (connector + IL/RL vocabulary prerequisite for TIA-568.3-D tables)
- T2 L2.10 → L4.11 (OTDR fundamentals prerequisite for TIA-526 test-tier selection)
- T3 L3.3 → L4.2 (NESC Rules 232/238 used as design tools; L4.2 gives them code-structure context)
- T3 L3.5/L3.8/L3.11 → L4.3/L4.15 (cover depths and crossing permits used in practice; Topic 4 provides the statutory basis)

**Leaves for Topics 5+:**
- Topic 5 — hardware installation depth (handholes, manholes, aerial hardware)
- Topic 6 — all grounding/bonding installation practice (L4.7 is code-pointer only)
- Topic 9 — all field safety execution (L4.4 and L4.13 locate the rules; Topic 9 owns the procedure)

---

## §6 Interactive Element Ideas

**Drag-and-drop (lessons with visual classification tasks):**
- 4.2: Aerial span cross-section — drag clearance measurement arrows to attachment point, sag midpoint, road surface
- 4.5: Cable pathway diagram (OSP → building entry → riser → horizontal) — drag correct NEC 770 cable type to each segment
- 4.10: 144-fiber / 12-tube cable — drag TIA-598-D color labels to correct tube and fiber positions

**Scenarios (decision-making from a field condition or data set):**
- 4.3: Mixed-installation route (HDD / direct-bury / conduit) — select minimum cover depth for each segment from NESC Rule 354 + TIA-758-C table
- 4.8: Subcontractor conduit plan at 85% fill — identify TIA-758-C violation, select corrective action
- 4.11: Three project types (campus OM3, rural RUS SM 8-splice, MDU riser SM) — select Tier 1 or Tier 2 with one-line rationale each
- 4.14: RUS aerial project — build deliverable matrix: which bulletin, which form, which deadline for drawing set / BOM / close-out
- 4.15: Route crossing state highway + Class I railroad + navigable creek — identify controlling agency, permit type, and critical-path timeline for each

**Flashcards (all 15 lessons):** 8–12 cards per lesson. Anchor rule numbers and applicability triggers, not prose definitions. E.g., "NESC Rule 354 → minimum cover depth for underground comm plant."

**Pulse questions (2 per lesson):** Applied scenario format, not recall. E.g., L4.11: "Rural RUS project, 14 splices, 22 km. Contract says 'TIA-526 acceptance.' Which tier do you specify and why?"

---

## §7 Open Questions for the Red Team / Orchestrator

1. **NESC framing depth for non-utility work:** Two options: (a) "rules you design to" — full loading district calc depth, or (b) "rules inspectors and AHJs cite — converse, verify, annotate drawings." DISCOVERY leans toward (b) since TIA-758-C is the primary design instrument. If this team stamps utility-commission submittals (make-ready, joint-use pole work), option (a) is warranted for L4.2 at minimum. Confirm: utility commission submittals or customer-owned-only?

2. **RUS lesson depth (L4.14 expansion vs. standalone topic):** RUS-program contracts are a primary project type per CLAUDE.md. Current L4.14 scope is 25 min / four bulletins / Form 219. Given daily-use frequency, should it expand to 35–40 min with a more detailed Form 219 scenario — or should a standalone "RUS Program Operations" topic be proposed for a future slot? Flag whether L4.14's 25-min scope is sufficient or if it's being asked to carry too much.

3. **IEC vs. TIA as primary procurement reference (L4.12 framing):** If the office specifies components by TIA-568.3-D performance tables and IEC ratings appear only on imported hardware datasheets, L4.12 should be framed as "datasheet literacy" not "how to specify by IEC class." If the office has international projects or IEC-only suppliers, the framing and scenario shift significantly. Confirm dominant procurement pattern.

---

=== T4 BRIEF FRAMING B END ===
