---
title: "Lesson 4.4: NESC Part 4 — Work Rules"
duration_min: 20
topic: osp-domain-4-standards-codes
order: 5
bicsi_alignment:
  - "OSP-DRD Ch. 2.4: NESC Part 4 work rules"
sources:
  - "NESC C2-2023, Rules 400–499, Rules 420–424"
  - "BICSI OSP-DRD Manual, Ch. 2.4"
  - "RUS Bulletin 1751F-630, §2.2"
---

# NESC Part 4 — Work Rules

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- State the scope of NESC Part 4 (Rules 400–499) and why it applies to OSP communication crews
- Map the hazard categories in Part 4 to their corresponding rule number ranges
- Cite the applicable NESC rule number for a given aerial or underground crew scenario
- Distinguish the design-level function (code citation for hazard classification) from the field-execution function (Topic 9) for Part 4 requirements

> **Hard stop — scope boundary:** This lesson covers code structure and rule citation only. Field safety procedures, actual approach distances in feet, PPE selection, rescue procedures, and confined-space permit workflow are covered in Topic 9. Do not expand this lesson's content into those areas. Cross-reference Topic 9 explicitly where execution detail is needed.

---

## Reading Content

### Part 4 Scope: Why It Applies to Communication Crews

NESC Part 4 (Rules 400–499) governs the safety rules for work performed **on or near** electric supply and communication lines and equipment. Unlike Parts 2 and 3, which govern the design and installation of the infrastructure, Part 4 governs the **activities of personnel** working with, near, or on that infrastructure.

Part 4 applies to OSP communication crews because:

1. **Joint-use poles:** Communication crews work on the same poles as supply conductors. Approach distances from energized supply conductors are legally required during all communication work on joint-use poles. [NESC C2-2023, Rule 420]
2. **Underground manholes and vaults:** Communication cable manholes may contain hazardous gases (methane from adjacent infrastructure, CO from vehicle exhaust), oxygen deficiency, or electrical hazards from co-located supply cable. Confined-space entry rules apply. [NESC C2-2023, Rules 420–424]
3. **Electrical hazards during installation:** Cable pulling, splice work, and testing bring crews into proximity with energized conductors. The code sets minimum safe working distances.

**Part 4 is not optional for OSP design:** The design engineer must understand which Part 4 rules apply to crew activities on a given project and document them in the construction specifications. This is not merely a safety officer's responsibility — the code places the classification obligation on anyone directing work on or near utility facilities. [NESC C2-2023, Rule 410; BICSI OSP-DRD Manual, Ch. 2.4]

---

### Part 4 Structure: Rules 400–499

**Rules 400–410: General work rules and definitions**
Rule 400 establishes the scope. Rule 401 defines "qualified worker" — a person who has received training in the construction and operation of electric supply and communication equipment. Rule 410 states that all persons working on or near energized equipment must be qualified. The distinction between "qualified" and "unqualified" persons drives the applicable approach distances in Rules 420–424. [NESC C2-2023, Rules 400–410]

**Rules 420–424: Approach distances**
This rule group defines the minimum distance a worker may approach an energized conductor without insulation or de-energization. The approach distances are voltage-dependent: higher voltage → larger minimum approach distance.

**Hazard class → rule number mapping for OSP scenarios:**

| Work scenario | Applicable NESC rule(s) |
|---|---|
| Communication worker on joint-use pole with energized supply conductors present | Rule 420 (approach distances for unqualified and qualified workers near energized supply lines) |
| Aerial crew working in the supply space (make-ready on a joint-use pole above communication space) | Rule 421 (work in the supply space) |
| Crew entering an underground manhole or vault | Rule 422 (underground structure entry) |
| Crew working near high-voltage cable in an underground duct bank | Rule 423 (approach distances near underground supply conductors) |
| Crew restoring or splicing communication cable that has been determined to be de-energized | Rule 424 (de-energized work — lockout/tagout confirmation requirements) |

**Rules 430–450: Grounding and protective equipment**
Requirements for protective grounds, insulating tools, and personal protective equipment when working on or near supply facilities. Relevant to design specification when the construction specification must call out the protection level required. [NESC C2-2023, Rules 430–450]

**Rules 460–499: Vehicle, equipment, and miscellaneous**
Approach distances for equipment (bucket trucks, cranes) near energized conductors. Excavation and underground utility location requirements (also governed by state One-Call laws, which overlay NESC). [NESC C2-2023, Rules 460–499]

> **Topic 9 boundary:** The specific numerical approach distances (in feet/inches), the PPE selection matrix, the confined-space permit workflow, atmospheric testing protocol, and rescue procedures are all Topic 9 material. This lesson's function is to correctly cite the NESC rule number for the applicable hazard class so that the construction specification references the right rule. Field crews implement Topic 9 procedures; the design specification cites NESC Part 4 rules.

---

### Worked Example: Aerial and Underground Crew on the Same Project

**Scenario:** A PSC RUS fiber project requires: (1) an aerial crew installing a communication cable on joint-use utility poles alongside 4-kV distribution supply conductors; (2) an underground crew entering a splice manhole adjacent to the route to splice a buried section.

**Aerial crew — Rule citation:**
The aerial crew is on joint-use poles. The 4-kV supply conductors are energized and in the supply space above the communication space. The crew is qualified for communication work but not supply work.

- Applicable rule: **NESC Rule 420** — approach distances for qualified and unqualified workers near energized supply conductors on joint-use structures.
- Design specification note: "All aerial work on joint-use structures shall comply with NESC C2-2023 Rule 420. Workers must maintain minimum approach distances from 4-kV distribution conductors per Rule 420 at all times. Refer to Topic 9 (field safety procedures) for numerical approach distances and PPE requirements."

**Underground crew — Rule citation:**
The underground crew is entering a splice manhole. The manhole is a confined space under the definition in NESC Rule 422. Atmospheric testing is required before entry.

- Applicable rule: **NESC Rule 422** — requirements for entry into underground structures (manholes, vaults, and similar confined spaces).
- Design specification note: "Underground manhole entry shall comply with NESC C2-2023 Rule 422. Confined-space entry permit, atmospheric testing for oxygen deficiency and combustible gas, and rescue procedures are required per Rule 422 and applicable OSHA regulations (29 CFR 1910.146). Refer to Topic 9 for field execution procedures."

**Summary — rule citation function:**
The engineer's job is to cite **Rule 420** for the aerial scenario and **Rule 422** for the underground scenario in the construction specification. The field crew's job is to implement the numeric values and procedures those rules contain. This separation of roles (design citation vs. field execution) is explicit in the NESC structure. [NESC C2-2023, Rules 420, 422; BICSI OSP-DRD Manual, Ch. 2.4; 29 CFR 1910.146 cross-reference]

---

## Key Terms (Flashcard Candidates)

**NESC Part 4 scope**
Safety rules for work on or near electric supply and communication lines and equipment. Applies to all personnel performing work on or near utility facilities under NESC jurisdiction — including OSP communication crews on joint-use poles, in manholes, and near energized underground supply conductors. [NESC C2-2023, Rule 400]

**Qualified worker (NESC)**
A person who has received training in the construction and operation of electric supply and communication equipment and in the associated hazards, as defined in NESC Rule 401. Approach distances vary based on whether a worker is qualified or unqualified for the specific voltage class of supply conductor present. [NESC C2-2023, Rule 401]

**NESC Rule 420**
Approach distances for persons near energized supply conductors. The primary rule governing communication crews working on joint-use poles with energized supply conductors. Distances are voltage-dependent and worker-qualification-dependent. Numerical values are Topic 9 / field safety material. [NESC C2-2023, Rule 420]

**NESC Rule 422**
Requirements for entry into underground structures (manholes, vaults). Requires atmospheric testing for oxygen deficiency and combustible gas before entry, and establishment of a confined-space entry permit and rescue plan. The NESC rule citation for underground confined-space work; field procedure per 29 CFR 1910.146 (OSHA) and Topic 9. [NESC C2-2023, Rule 422]

**Approach distance**
The minimum distance a worker or equipment may come to an energized conductor without de-energization or insulation. Governed by Rules 420–424 for personnel, Rules 460–499 for equipment. Distances vary by voltage and worker qualification. Specific values are field-execution material in Topic 9, not repeated in this lesson.

**Lockout/tagout (LOTO) — NESC context**
NESC Rule 424 requires verification that a conductor is de-energized before work begins on it. The verification process (testing, grounding, permit workflow) is the NESC basis for the LOTO concept; OSHA 29 CFR 1910.147 and 29 CFR 1926.417 provide the regulatory lockout/tagout framework. Cross-reference both for underground supply cable adjacent to communication splicing work. [NESC C2-2023, Rule 424]

---

## Interactive: Flashcards — Rule to Hazard Category

**Flashcard set:**

**Card 1:** NESC Rule 420
What hazard category does NESC Rule 420 address?
*Answer:* Approach distances for workers near energized supply conductors — primary rule for communication crews working on joint-use poles with energized supply lines present. Numerical values are voltage- and qualification-dependent. [NESC C2-2023, Rule 420]

**Card 2:** NESC Rule 422
What hazard category does NESC Rule 422 address?
*Answer:* Entry requirements for underground structures (manholes, vaults, confined spaces). Requires atmospheric testing, confined-space entry permit, and rescue plan before entry. Cross-reference 29 CFR 1910.146 (OSHA confined-space) for regulatory requirement. [NESC C2-2023, Rule 422]

**Card 3:** NESC Rule 421
What hazard category does NESC Rule 421 address?
*Answer:* Work in the supply space of a joint-use pole — applicable when a crew must work above the communication space, adjacent to or among energized supply conductors. Higher hazard than communication-space-only work (Rule 420 applies to proximity; Rule 421 specifically governs in-supply-space activities). [NESC C2-2023, Rule 421]

**Card 4:** NESC Rule 424
What hazard category does NESC Rule 424 address?
*Answer:* De-energized work — requirements to verify and maintain de-energized status before and during work on facilities that contain or are adjacent to supply conductors. Foundation of the NESC lockout/tagout concept. [NESC C2-2023, Rule 424]

**Card 5:** NESC Rule 460–499
What hazard category does this rule range address?
*Answer:* Approach distances for vehicles and equipment (bucket trucks, boom cranes, excavators) operating near energized supply conductors. Relevant to design specification when the construction spec must note equipment exclusion zones around overhead supply conductors. [NESC C2-2023, Rules 460–499]

---

## Multiple-Choice Quiz

---

**Q1.** An OSP construction crew is working on joint-use utility poles stringing a communication cable. The distribution supply conductors at 7.2 kV are energized throughout the work. Which NESC Part 4 rule primarily governs the crew's approach to the supply conductors?

A) NESC Rule 400 — general work scope rule

B) NESC Rule 420 — approach distances for workers near energized supply conductors **[CORRECT]**

C) NESC Rule 422 — underground structure entry requirements

D) NESC Rule 460 — equipment approach distances

*Rationale:*
- **A — Incorrect.** Rule 400 establishes the scope of Part 4 — it is a definitional rule, not an operational requirement for approach distances. A crew performing actual aerial work on joint-use poles needs the operational approach distance rule. [NESC C2-2023, Rule 400]
- **B — Correct.** NESC Rule 420 specifically governs approach distances for personnel working near energized supply conductors. For an aerial communication crew on joint-use poles with energized 7.2 kV distribution supply conductors, Rule 420 is the applicable hazard-class rule. Numerical approach distances and PPE requirements are Topic 9 / field safety material; the design specification cites Rule 420. [NESC C2-2023, Rule 420; BICSI OSP-DRD Manual, Ch. 2.4]
- **C — Incorrect.** Rule 422 governs underground confined-space entry (manholes, vaults). The crew described is performing aerial work on poles — no underground structure is involved. [NESC C2-2023, Rule 422]
- **D — Incorrect.** Rules 460 and higher govern approach distances for vehicles and mechanical equipment, not personnel performing aerial pole work. If a bucket truck is used for the aerial work, Rule 460 applies to the truck itself; Rule 420 applies to the worker in the bucket. Both may be cited in a complete construction specification, but Rule 420 is primary for the worker. [NESC C2-2023, Rules 420, 460]

---

**Q2.** An OSP crew is directed to enter a utility splice manhole to reroute a fiber splice in the manhole. Per NESC Part 4, which rule governs the required pre-entry safety steps, and which additional federal regulation should the construction specification cross-reference for field execution?

A) NESC Rule 420; cross-reference 29 CFR 1910.147 (OSHA lockout/tagout)

B) NESC Rule 422; cross-reference 29 CFR 1910.146 (OSHA permit-required confined space) **[CORRECT]**

C) NESC Rule 424; cross-reference 29 CFR 1926 Subpart K (OSHA electrical safety for construction)

D) NESC Rule 400; no federal cross-reference required — NESC is the only applicable standard

*Rationale:*
- **A — Incorrect.** Rule 420 governs worker approach to energized supply conductors on aerial structures — not underground manhole entry. 29 CFR 1910.147 is the OSHA lockout/tagout standard, relevant when de-energizing electrical equipment; it is not the primary reference for confined-space gas testing and entry permits. [NESC C2-2023, Rule 420; 29 CFR 1910.146]
- **B — Correct.** NESC Rule 422 governs entry into underground structures including manholes. It requires atmospheric testing (oxygen deficiency, combustible gas) before entry and establishment of entry permits and rescue procedures. The federal cross-reference is **29 CFR 1910.146** — OSHA's permit-required confined space standard — which provides the regulatory enforcement framework for the same requirements. Construction specifications for underground manhole work should cite both. [NESC C2-2023, Rule 422; 29 CFR 1910.146; BICSI OSP-DRD Manual, Ch. 2.4]
- **C — Incorrect.** Rule 424 governs de-energized work on facilities with supply conductors — relevant if the crew is working near energized underground supply cable, but the primary manhole-entry safety requirement is Rule 422 (confined-space entry). 29 CFR 1926 Subpart K is relevant for construction projects with electrical exposure, but 29 CFR 1910.146 is the more specific and directly applicable confined-space standard for manhole entry. [NESC C2-2023, Rules 422, 424]
- **D — Incorrect.** NESC Part 4 and OSHA regulations are not mutually exclusive. OSP construction projects are subject to 29 CFR 1926 (construction), and general industry manhole-entry operations are subject to 29 CFR 1910.146. "NESC only" is legally insufficient; OSHA regulations apply independently and carry criminal enforcement authority that NESC by itself does not. [29 CFR 1910.146; NESC C2-2023, Rule 422]

---

## Final Check: Pulse Questions

**Pulse 1.** Name the NESC Part 4 rule that applies to each of the following: (A) aerial crew on joint-use pole near energized 4-kV supply; (B) underground crew entering a splice manhole; (C) de-energization verification before touching an adjacent supply cable. Cite the rule number and one-sentence description only. Refer to Topic 9 for field execution.

*Expected answer:*
- (A) **NESC Rule 420** — approach distances for personnel near energized supply conductors on joint-use structures. Field execution (numeric distances, PPE) → Topic 9.
- (B) **NESC Rule 422** — requirements for entering underground structures (manholes, vaults); atmospheric testing and confined-space entry permit required. Field execution → Topic 9 and 29 CFR 1910.146.
- (C) **NESC Rule 424** — de-energized work; verification of de-energized status and grounding before contact. Field execution → Topic 9, 29 CFR 1910.147 LOTO standard.

[NESC C2-2023, Rules 420, 422, 424]

**Pulse 2.** What is the distinction between a "qualified worker" and an "unqualified worker" under NESC Part 4, and why does this distinction affect the approach distance that applies to an OSP communication crew member on a joint-use pole?

*Expected answer:* NESC Rule 401 defines a **qualified worker** as one who has received training in the construction, operation, and hazards of electric supply and communication equipment. An **unqualified worker** has not received this training. Rule 420 approach distances are greater for unqualified workers than for qualified workers at the same supply voltage — reflecting the greater hazard posed by proximity to energized conductors for someone without training. An OSP crew member who is qualified for communication work (trained and certified for telecom cable installation) but NOT qualified for supply work (no high-voltage training) is unqualified relative to the 7.2-kV supply conductors, and the unqualified-worker approach distances apply. [NESC C2-2023, Rules 401, 420]

---

## Glossary Cross-References

- **NESC Rule 420 (approach distances)** → T9 L9.1 (OSHA/NESC approach distances for aerial utility work — the numerical values this lesson deliberately defers); T9 L9.3 (PPE selection for joint-use pole aerial work)
- **NESC Rule 422 (confined space entry)** → T9 L9.3 (manhole entry procedures); 29 CFR 1910.146 (OSHA confined-space regulatory standard)
- **NESC Part 4 scope** → L4.13 (OSHA 1910/1926 — parallel federal regulatory framework for the same hazards; NESC governs the engineering standard, OSHA governs the regulatory enforcement)
- **Qualified worker** → T9 L9.1 (the qualification training requirements that define who can approach energized supply conductors)
- **Lockout/tagout (Rule 424)** → T9 L9.3 (de-energization procedure field execution)
- **Joint-use poles** → L4.2a (Rule 238 communication space on joint-use pole); T3 L3.4 (pole loading at joint-use structures)
