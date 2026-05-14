---
title: "Lesson 4.14: RUS/USDA Bulletins — Program Requirements and Deliverable Matrix"
slug: l4-14-rus-bulletins
duration_min: 30
topic: osp-domain-4-standards-codes
order: 14
bicsi_alignment:
  - "OSP-DRD Ch. 2.9: RUS/USDA telecommunications loan program standards"
sources:
  - "RUS Bulletin 1751F-630 — Telecommunications Standards for Aerial Construction (current edition)"
  - "RUS Bulletin 1751F-635 — Telecommunications Standards for Underground Construction"
  - "RUS Bulletin 1715E-110 — Electric and Telephone Borrower Design Guide"
  - "RUS Form 219 — Materials and Equipment Inventory (approval chain)"
  - "7 CFR Part 1755 — Telecommunications Loan Program — Subpart D: OSP Construction Standards (regulatory authority anchoring the 1751F bulletin series)"
  - "BICSI OSP-DRD Manual, Ch. 2.9"
  - "ANSI/TIA-758-C (referenced by 1751F bulletins for conduit fill and acceptance)"
---

# RUS/USDA Bulletins — Program Requirements and Deliverable Matrix

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Identify the three primary RUS bulletins applicable to OSP construction (1751F-630 aerial, 1751F-635 underground, 1715E-110 design guide) and match each to its project scope
- Explain the role of 7 CFR Part 1755 Subpart D as the regulatory authority anchoring the RUS 1751F bulletin series
- Apply the RUS Form 219 approval chain to a project scenario — identifying when pre-approval is required, what materials qualify, and what the close-out documentation package must contain
- Select the correct bulletin and form for a mixed aerial-conduit project scenario involving RUS financing

---

## Reading Content

### What RUS Is and Why It Matters to OSP Engineers

The Rural Utilities Service (RUS) is a USDA agency that administers the federal Telecommunications Loan Program — providing low-interest loans and grants to rural telecommunications providers to build and improve broadband infrastructure in underserved areas. For OSP engineers at firms like Launch Fiber Services (Macon, GA), RUS means PSC: the primary client (PSC) works on RUS telecom engineering contracts, and the OSP work they commission must meet RUS standards or the loan is at risk.

**This is not paperwork overhead.** RUS compliance is a contractual and regulatory obligation that determines whether the borrower (the telecom provider) can draw loan funds and whether the contractor's work is accepted for final payment. Non-compliant materials or construction methods can result in draw rejection, retesting, and reconstruction costs that fall on the contractor or engineer of record. Understanding which bulletin, which form, and which specification governs each project type is core competency for OSP design at a RUS-funded shop. [RUS Bulletin 1751F-630 §1; 7 CFR Part 1755]

### The Regulatory Foundation: 7 CFR Part 1755

The RUS 1751F bulletin series derives its authority from **7 CFR Part 1755 — Telecommunications Standards for Loan Purposes** (Title 7, Code of Federal Regulations, Part 1755). Subpart D of Part 1755 specifically covers **OSP construction standards** — the regulatory text that makes RUS bulletins enforceable as loan conditions rather than advisory guidance.

**Why this citation matters:** RUS Bulletin 1751F-630 and 1751F-635 are implementation documents — they translate the regulatory requirements in 7 CFR Part 1755 Subpart D into engineering specifications. When a project specification says "per RUS Bulletin 1751F-630," the legal basis is 7 CFR Part 1755 Subpart D. Design engineers and inspectors need to know both levels:

- **Regulatory level:** 7 CFR Part 1755 Subpart D (the "what must be achieved" requirement)
- **Implementation level:** RUS Bulletins 1751F-630 and 1751F-635 (the "how to achieve it" specifications)

[7 CFR Part 1755, Subpart D; RUS Bulletin 1751F-630 §1]

**RUS Bulletin 1738 / ReConnect / BIP distinction:** RUS Bulletin 1738 covers the Electric Borrowers Program (rural electric cooperatives), not the Telecommunications Loan Program. For FDH (fiber distribution hub) equipment lists and OSP telecom materials on telecom-program projects, **cite 7 CFR Part 1755 and the 1751F series** — not 1738. The ReConnect Program (broadband grant program) and BIP (Broadband Initiatives Program) also have their own specifications; do not conflate telecom loan program 1751F series requirements with ReConnect or BIP specifications. [7 CFR Part 1755; RUS Bulletin 1751F-630]

### Bulletin 1751F-630 — Aerial Construction

**Scope:** Aerial OSP construction — overhead telephone and fiber cable systems supported by strand on poles. The definitive RUS specification for lashed-strand aerial construction in the telecom program.

**Key §§ for OSP engineers:**

| Section | Content |
|---|---|
| §1 | Introduction, scope, regulatory authority (references 7 CFR Part 1755 Subpart D) |
| §2 | Safety — OSHA and NESC compliance references (see L4.4 and L4.13) |
| §3 | Materials — cable, strand, hardware specifications (references TIA-568.3-D for fiber/connector; ASTM A475 for strand) |
| §4 | Aerial construction — pole placement, attachment heights, clearances (references NESC C2-2023 Rules 230–252) |
| §5 | Guying and anchoring |
| §6 | Grounding and bonding (references NEC Art. 250 — see L4.7) |
| §7 | Crossings (references NESC, DOT, RR permit requirements — see L4.15) |
| §9 | Acceptance testing (references TIA-526-14 [confirm edition] and TIA-598-D — see L4.11) |
| §10 | Closeout documentation requirements |

[RUS Bulletin 1751F-630]

**Primary application:** Any RUS-funded project where fiber cable is carried aerially on poles — lashed strand construction, ADSS on utility poles, joint-use aerial routes.

### Bulletin 1751F-635 — Underground Construction

**Scope:** Underground OSP construction — buried conduit, direct-buried cable, and underground splice systems. The RUS specification for trenching, boring, and conduit systems in the telecom program.

**Key §§ for OSP engineers:**

| Section | Content |
|---|---|
| §1 | Introduction, scope, references 7 CFR Part 1755 Subpart D |
| §2 | Safety — OSHA confined space + excavation safety references |
| §3 | Materials — conduit, innerduct, pull tape, cable jacket specifications |
| §4 | Trench construction — depth requirements, bedding, backfill, compaction (references NESC Rules 320–355 — see L4.3) |
| §5 | Horizontal directional drilling (HDD) requirements |
| §7 | Crossings — road, rail, water bore depth and casing requirements (see L4.15) |
| §9 | Acceptance testing — optical loss, OTDR per TIA-526-14 [confirm edition] |

[RUS Bulletin 1751F-635]

**Primary application:** Any RUS-funded project where fiber is installed in conduit, direct-buried, or horizontally bored — buried distribution cable, underground laterals, conduit infrastructure.

### Bulletin 1715E-110 — Design Guide

**Scope:** Not a construction specification — this is the engineering design guide for RUS borrowers and their consulting engineers. 1715E-110 covers the design and specification process: how to structure a project for RUS loan approval, how to prepare drawings and specifications that will pass RUS review, and how to document that design meets 1751F requirements.

**Key use cases:** OSP design firms (like Launch Fiber Services) reference 1715E-110 when preparing design packages for RUS borrower clients — the guide specifies the format and content of plans and specifications that the borrower submits to RUS for loan approval. Understanding 1715E-110 is essential for engineers who produce the deliverables, not just those who implement in the field. [RUS Bulletin 1715E-110]

### RUS Form 219 — Materials and Equipment Inventory

**Purpose:** The RUS Form 219 is the materials and equipment inventory form used in the RUS loan approval and draw process. It serves as the pre-approved materials list and the close-out accounting document.

**Approval chain:**

1. **Pre-approval:** Before construction begins, the consulting engineer prepares a Form 219 listing all materials and equipment to be used on the project. This list is submitted to RUS for approval as part of the loan drawdown package. **Only materials on an approved Form 219 can be charged to the loan.** Using substitute materials not on the approved Form 219 — even materials of equivalent quality — can result in a draw rejection and may require re-approval before payment.

2. **Construction:** The contractor purchases and installs materials per the approved Form 219 list.

3. **Close-out:** As part of the final loan drawdown and project close-out, an as-built Form 219 is submitted showing actual quantities installed vs. approved quantities. Material overages and underruns must be reconciled.

4. **OTDR traces and acceptance records:** The Form 219 close-out package must include acceptance testing documentation — OTDR traces for all splices (per TIA-526-14 [confirm edition] and 1751F-630 §9), splice records, and conduit as-built drawings. These documents confirm that the cable plant meets RUS construction standards and is eligible for the final draw. [RUS Form 219; RUS Bulletin 1751F-630 §10; 7 CFR Part 1755 Subpart D]

### Worked Example: 48-Count SM Aerial + Conduit Route, RUS-Funded

**Scenario:** Launch Fiber Services is designing a 7-mile OSP route for PSC (RUS telecom program). The route uses:
- Aerial construction: 5 miles of 48-count OS2 SM cable, lashed strand on existing joint-use poles
- Underground conduit: 2 miles of 2-in. Sch 40 PVC direct burial with 48F cable in a residential subdivision

**Step 1: Bulletin selection**

| Route segment | Governing RUS bulletin |
|---|---|
| 5-mile aerial strand | **RUS Bulletin 1751F-630** (aerial construction standard) |
| 2-mile conduit/underground | **RUS Bulletin 1751F-635** (underground construction standard) |

Both bulletins apply to the same project. The design package must demonstrate compliance with both. The engineering design guide for the overall project: **RUS Bulletin 1715E-110**.

**Step 2: Form 219 triggers**

The Form 219 must be prepared and submitted for pre-approval before construction. Materials to list (partial):
- 48F OS2 SM aerial cable (specify count, sheath type, ADSS or lashed-strand)
- 5.4M ASTM A475 strand (size per loading district — Light district, Macon GA)
- Lashing wire, pole hardware, splice closures
- 2-in. Sch 40 PVC conduit, fittings, pull tape
- 48F OS2 SM underground cable
- Splice closure (IP68 rated, direct-bury per IEC 60529)

**Step 3: Closeout documentation requirements**

Per 1751F-630 §10 and 7 CFR Part 1755 Subpart D, the close-out package must include:
- As-built construction drawings (aerial route + conduit route)
- OTDR trace files for all fusion splices (bidirectional, Tier 2 per TIA-526-14 [confirm edition] + FOTP-61)
- Splice records showing per-splice IL for all splices (≤ 0.1 dB per splice per RUS standard)
- Form 219 as-built (actual quantities vs. approved quantities)
- Permit close-out documentation for any crossings (DOT, RR, USACE — see L4.15)

**Step 4: Regulatory anchor**

The legal basis for all of the above: **7 CFR Part 1755, Subpart D** (OSP construction standards for the Telecommunications Loan Program). The bulletins implement it; the CFR provision enforces it.

### Bulletin Selection Quick Reference

| Project type | Primary bulletin | Design guide | Form |
|---|---|---|---|
| Aerial-only RUS project | 1751F-630 | 1715E-110 | Form 219 |
| Underground-only RUS project | 1751F-635 | 1715E-110 | Form 219 |
| Mixed aerial + underground | Both 1751F-630 + 1751F-635 | 1715E-110 | Form 219 |
| Non-RUS aerial project | TIA-758-C (customer-owned) | — | — |

---

## Key Terms (Flashcard Candidates)

**7 CFR Part 1755, Subpart D**
The regulatory authority (Code of Federal Regulations) for OSP construction standards under the USDA RUS Telecommunications Loan Program. Subpart D makes RUS 1751F bulletins enforceable as loan conditions. The regulatory level above the bulletins: bulletins implement it; Subpart D mandates it. Not to be confused with 7 CFR Part 1738 (electric borrowers program) or ReConnect/BIP specifications. [7 CFR Part 1755, Subpart D]

**RUS Bulletin 1751F-630**
RUS specification for aerial OSP telecommunications construction (lashed strand, ADSS). Covers materials (§3), aerial construction (§4), clearances (NESC reference), grounding (§6), crossings (§7), acceptance testing (§9), and closeout (§10). Primary document for RUS-funded aerial fiber routes. [RUS Bulletin 1751F-630]

**RUS Bulletin 1751F-635**
RUS specification for underground OSP telecommunications construction (conduit, direct-bury, HDD). Covers materials (§3), trench construction (§4), boring (§5), crossings (§7), and acceptance testing (§9). Primary document for RUS-funded buried or conduit fiber routes. [RUS Bulletin 1751F-635]

**RUS Bulletin 1715E-110**
Engineering design guide for RUS borrowers and consulting engineers. Specifies the format, content, and process for design packages submitted for RUS loan approval. Not a construction specification — a design and documentation framework for RUS-program engineering firms. [RUS Bulletin 1715E-110]

**RUS Form 219**
Materials and equipment inventory form used in the RUS loan process. Pre-approval: submitted before construction to obtain RUS approval for planned materials. Closeout: submitted after construction showing as-built quantities. Only Form 219-approved materials may be charged to the loan. Closeout package includes OTDR traces, splice records, and permit documentation. [RUS Form 219]

**Per-splice loss limit (RUS)**
RUS 1751F bulletins specify maximum per-splice insertion loss of ≤ 0.1 dB for fusion splices on RUS-funded cable plants. OTDR traces demonstrating compliance with this limit are required in the close-out package. [RUS Bulletin 1751F-630 §9; 7 CFR Part 1755 Subpart D]

---

## Interactive: Scenario — Aerial + Conduit Deliverable Matrix

**[image:rus-deliverable-matrix.svg]**

*Image description for SVG illustrator:*

A project summary card at top: "7-mile mixed RUS route — 5 miles aerial, 2 miles conduit, 48F OS2 SM." Below: a three-column table labeled "Governing Bulletin," "Form Required," and "Close-out Documents."

Three rows:
1. Aerial segment: 1751F-630 | Form 219 | OTDR traces (aerial splices), splice records, as-built drawings, DOT/RR permits
2. Underground segment: 1751F-635 | Form 219 | OTDR traces (conduit splices), splice records, conduit route drawing, bore logs
3. Regulatory basis: 7 CFR Part 1755 Subpart D | — | Overall loan compliance

**Learning mechanic:** Learner drags deliverable items from a pool to the correct project segment column.

---

## Multiple-Choice Quiz

---

**Q1.** A PSC telecom project is a 6-mile aerial-only fiber route on existing joint-use poles, funded by a RUS telecom loan. Which bulletin and form are required?

- A) RUS Bulletin 1751F-635 + Form 219
- B) RUS Bulletin 1751F-630 + Form 219 **[CORRECT]**
- C) RUS Bulletin 1738 + Form 219
- D) RUS Bulletin 1751F-630 + no form required for aerial-only routes

*Rationale:*
- **A — Incorrect.** 1751F-635 is the underground construction standard. An aerial-only route on existing joint-use poles is governed by **1751F-630** (aerial construction standard), not 1751F-635. [RUS Bulletin 1751F-630; RUS Bulletin 1751F-635]
- **B — Correct.** Aerial OSP construction on a RUS telecom loan → **RUS Bulletin 1751F-630** (aerial standard) + **RUS Form 219** (materials inventory — pre-approval and close-out). The regulatory basis is 7 CFR Part 1755 Subpart D. Acceptance testing per 1751F-630 §9 and OTDR traces are required in the close-out package. [RUS Bulletin 1751F-630; RUS Form 219; 7 CFR Part 1755 Subpart D]
- **C — Incorrect.** RUS Bulletin 1738 covers the Electric Borrowers Program (rural electric cooperatives) — not the Telecommunications Loan Program. PSC is a telecom borrower; the governing bulletin is 1751F-630, not 1738. This is a critical distinction: citing 1738 on a telecom-program project specification is a regulatory mismatch. [7 CFR Part 1755; RUS Bulletin 1751F-630]
- **D — Incorrect.** RUS Form 219 is required for all RUS-funded projects, including aerial-only routes. The Form 219 is the materials pre-approval and close-out accounting mechanism for the loan drawdown — there is no aerial-only exemption. [RUS Form 219; 7 CFR Part 1755 Subpart D]

---

**Q2.** What is the regulatory authority that makes RUS Bulletin 1751F-630 enforceable as a loan condition, and which subpart specifically covers OSP construction standards?

- A) 7 CFR Part 1738, Subpart A — Electric Borrowers Program
- B) 7 CFR Part 1755, Subpart D — Telecommunications Loan Program, OSP Construction Standards **[CORRECT]**
- C) 29 CFR Part 1926 Subpart V — OSHA construction (the federal safety authority)
- D) ANSI/TIA-758-C §1 — the OSP standard's scope section makes it enforceable as a loan condition

*Rationale:*
- **A — Incorrect.** 7 CFR Part 1738 covers the Electric Borrowers Program (rural electric cooperatives, not telecom). Telecom loan program standards are in 7 CFR Part 1755. PSC is a telecom borrower; 1738 has no applicability. [7 CFR Part 1738; 7 CFR Part 1755]
- **B — Correct.** **7 CFR Part 1755, Subpart D** (Telecommunications Standards for Loan Purposes — OSP Construction Standards) is the regulatory authority for the RUS 1751F bulletin series. The bulletins (1751F-630, 1751F-635) are implementation documents that translate Subpart D's regulatory requirements into engineering specifications. When a project specification invokes 1751F-630, the legal basis is 7 CFR Part 1755 Subpart D, which makes compliance a condition of the telecom loan. [7 CFR Part 1755, Subpart D; RUS Bulletin 1751F-630 §1]
- **C — Incorrect.** 29 CFR 1926 Subpart V is an OSHA safety standard governing approach distances near energized power transmission lines during construction — it has no role in making RUS bulletins enforceable as loan conditions. Safety compliance (referenced in 1751F-630 §2) is a separate obligation from the loan-condition authority of 7 CFR Part 1755. [7 CFR Part 1755; 29 CFR 1926]
- **D — Incorrect.** ANSI/TIA-758-C is a private voluntary consensus standard — it is not a federal regulation and does not independently make anything enforceable as a loan condition. RUS 1751F-630 references TIA-758-C for conduit fill and acceptance (it incorporates TIA-758-C by reference), but the enforceability derives from 7 CFR Part 1755 Subpart D, not from TIA-758-C §1. [7 CFR Part 1755, Subpart D; ANSI/TIA-758-C]

---

**Q3.** A close-out package for a RUS-funded aerial splice project must include OTDR traces. A contractor submits an end-to-end Tier 1 OLTS loss test only, arguing the cable plant passed the loss budget. Is this acceptable?

- A) Yes — Tier 1 OLTS demonstrating a passing end-to-end loss is sufficient for RUS close-out on aerial routes
- B) No — RUS Bulletin 1751F-630 §9 and 7 CFR Part 1755 Subpart D require OTDR traces for individual splice characterization; Tier 1 OLTS alone is insufficient **[CORRECT]**
- C) Yes — OTDR traces are only required when the Tier 1 test fails; a passing Tier 1 result satisfies RUS acceptance
- D) No — OTDR traces from the manufacturer's factory testing are required, not field OTDR

*Rationale:*
- **A — Incorrect.** Tier 1 OLTS (end-to-end loss) confirms the cable plant is within the overall loss budget but does not document individual splice performance. RUS Bulletin 1751F-630 §9 requires per-splice characterization — each fusion splice must demonstrate ≤ 0.1 dB per the RUS standard — which requires Tier 2 OTDR traces, not just a Tier 1 end-to-end measurement. [RUS Bulletin 1751F-630 §9; 7 CFR Part 1755 Subpart D; L4.11]
- **B — Correct.** RUS Bulletin 1751F-630 §9 and its regulatory basis in **7 CFR Part 1755 Subpart D** require OTDR traces as part of the close-out package for aerial splice projects. These traces must document per-splice insertion loss for each fusion splice (≤ 0.1 dB per splice) using bidirectional OTDR per TIA-526-14 [confirm edition] and FOTP-61 (L4.11 Tier 2). A Tier 1 OLTS result alone — even a passing one — does not satisfy the RUS close-out requirement. The submittal must be rejected and Tier 2 OTDR testing performed before the close-out can be approved. [RUS Bulletin 1751F-630 §9; 7 CFR Part 1755 Subpart D; L4.11]
- **C — Incorrect.** OTDR traces are required for close-out regardless of the Tier 1 result. The per-splice characterization requirement exists even when the end-to-end loss passes — it is not a conditional requirement triggered by failure. The RUS close-out package always includes OTDR traces on spliced cable plants. [RUS Bulletin 1751F-630 §9]
- **D — Incorrect.** RUS requires field OTDR traces from the completed installed cable plant — not factory test data. Factory attenuation testing verifies fiber performance before installation; field OTDR testing after installation verifies splice quality and that the installed cable plant (splices, connectors, conduit bends) meets the RUS acceptance standard. Both are separate and distinct requirements. [RUS Bulletin 1751F-630 §9]

---

**Q4.** A contractor proposes substituting a conduit product not listed on the approved Form 219 with an equivalent product they claim meets the same specifications. Is this acceptable without further action?

- A) Yes — equivalent quality is sufficient; the Form 219 is advisory guidance, not a binding list
- B) No — materials not on the approved Form 219 cannot be charged to the RUS loan without re-approval, regardless of technical equivalence **[CORRECT]**
- C) Yes — substitutions are permitted as long as the final acceptance test (OTDR) passes
- D) No — any change to approved materials voids the entire loan and requires starting over

*Rationale:*
- **A — Incorrect.** The Form 219 is not advisory — it is the binding materials approval list for the RUS loan drawdown. Materials charged to the loan must match the approved Form 219; the form is part of the loan agreement conditions under 7 CFR Part 1755 Subpart D. [RUS Form 219; 7 CFR Part 1755 Subpart D]
- **B — Correct.** Only Form 219-approved materials may be charged to the RUS loan. A substitution — even one that is technically equivalent — requires submission of a Form 219 amendment and RUS approval before the substitute material is used and charged to the loan. Using unapproved materials risks draw rejection at close-out. The contractor must obtain RUS re-approval for the substitution before proceeding. This is not a technicality — it protects the borrower from draw rejections that delay final payment. [RUS Form 219; 7 CFR Part 1755 Subpart D]
- **C — Incorrect.** A passing acceptance test does not cure a Form 219 compliance issue. The loan accounting requires that approved materials were used; a substituted material that passes the acceptance test may still create a draw rejection if it was not on the approved list. Technical performance and procurement compliance are separate requirements. [RUS Form 219; 7 CFR Part 1755 Subpart D]
- **D — Incorrect.** A material substitution does not void the entire loan. It requires a Form 219 amendment and RUS approval for the specific substitution. The project can proceed with re-approval; it does not require starting over. [RUS Form 219; 7 CFR Part 1755 Subpart D]

---

**Q5.** An OSP engineer specifies materials for a RUS-funded underground conduit project by citing "FDH equipment per RUS Bulletin 1738." What is wrong with this citation?

- A) Nothing — Bulletin 1738 is the correct reference for FDH equipment on all RUS projects
- B) Bulletin 1738 applies to the Electric Borrowers Program (rural electric cooperatives), not the Telecommunications Loan Program; FDH and OSP materials on telecom projects are governed by 7 CFR Part 1755 and the 1751F series **[CORRECT]**
- C) Bulletin 1738 applies only to aerial construction; underground projects must cite 1751F-635 regardless of FDH equipment lists
- D) Bulletin 1738 is superseded by 1715E-110; the engineer should cite 1715E-110 instead

*Rationale:*
- **A — Incorrect.** RUS Bulletin 1738 is not correct for telecom program projects. 1738 covers the Electric Borrowers Program. PSC is a telecom borrower; the governing regulatory framework is 7 CFR Part 1755 and the 1751F bulletin series. Using 1738 in a telecom-program specification is a regulatory mismatch that could create compliance issues during loan approval. [7 CFR Part 1755; RUS Bulletin 1751F-635; RUS Bulletin 1738]
- **B — Correct.** **RUS Bulletin 1738** covers rural electric cooperative borrowers under the Electric Loan Program — not telecom borrowers under the Telecommunications Loan Program. For a RUS telecom-program underground project, FDH equipment and OSP materials are governed by **7 CFR Part 1755, Subpart D** and implemented through **RUS Bulletin 1751F-635** (underground construction). The ReConnect and BIP programs also have their own specifications separate from the 1751F series — do not conflate them. [7 CFR Part 1755 Subpart D; RUS Bulletin 1751F-635; RUS Bulletin 1738]
- **C — Incorrect.** The distinction between 1738 and the telecom bulletins is not aerial vs. underground — it is electric program vs. telecom program. Even for aerial construction, the telecom program bulletin is 1751F-630, not 1738. 1738 has no aerial vs. underground dimension relevant to telecom. [7 CFR Part 1755; RUS Bulletin 1751F-630; RUS Bulletin 1738]
- **D — Incorrect.** 1715E-110 is the engineering design guide (not a construction specification). It was not superseded by 1738 and does not replace it — they are completely different documents serving different functions. 1715E-110 guides the design and documentation process; it does not specify FDH equipment. [RUS Bulletin 1715E-110; RUS Bulletin 1738]

---

## Final Check: Pulse Questions Before Lesson 4.15

**Pulse 1.** A 12-mile mixed-route RUS project for PSC includes 8 miles of aerial strand and 4 miles of conduit (HDD bores at two road crossings). Map this project to: (a) governing bulletins, (b) regulatory authority, (c) Form 219 triggers, and (d) close-out documentation.

*Expected answer:*
(a) **Governing bulletins:** 8-mile aerial → RUS Bulletin **1751F-630**; 4-mile conduit/HDD → RUS Bulletin **1751F-635**; design documentation package → RUS Bulletin **1715E-110**.
(b) **Regulatory authority:** **7 CFR Part 1755, Subpart D** (Telecommunications Loan Program, OSP Construction Standards) — the legal basis for both bulletins and the Form 219 requirement.
(c) **Form 219:** Pre-approval of all materials and equipment before construction begins; both aerial and underground materials on a single Form 219. Any material substitution requires Form 219 amendment and RUS re-approval.
(d) **Close-out documentation:** OTDR traces (bidirectional, Tier 2) for all fusion splices on aerial and conduit segments; per-splice IL ≤ 0.1 dB; as-built drawings for aerial and conduit routes; bore logs for HDD crossings; DOT and RR crossing permit close-out; Form 219 as-built quantities. All assembled per 1751F-630 §10, 1751F-635 §9, and 7 CFR Part 1755 Subpart D requirements. [RUS Bulletins 1751F-630, 1751F-635, 1715E-110; RUS Form 219; 7 CFR Part 1755 Subpart D]

**Pulse 2.** What is the regulatory difference between 7 CFR Part 1755 Subpart D and RUS Bulletin 1751F-630, and why does this distinction matter to an OSP engineer?

*Expected answer:* 7 CFR Part 1755 Subpart D is the **regulatory authority** — the enforceable Code of Federal Regulations provision that makes OSP construction compliance a condition of the RUS telecommunications loan. RUS Bulletin 1751F-630 is the **implementation document** — the engineering specification that translates the Subpart D requirement into specific construction standards (materials, clearances, testing, closeout). The distinction matters because: (1) when a project dispute arises over whether a standard is contractually binding, the CFR is the legal authority; (2) when a non-telecom borrower (e.g., electric cooperative) cites 1751F-630, the engineer can trace back to 7 CFR Part 1755 to confirm the bulletin's regulatory scope is telecom-program only; (3) in bid specifications and design documents, citing both the bulletin and the regulatory authority (e.g., "per RUS Bulletin 1751F-630 implementing 7 CFR Part 1755 Subpart D") is the technically complete reference. [7 CFR Part 1755, Subpart D; RUS Bulletin 1751F-630 §1]

---

## Glossary Cross-References

- **7 CFR Part 1755 Subpart D** → L4.3 (NESC underground cover — 1751F-635 references NESC Rules 320-355 for cover depth); L4.15 (DOT/RR/USACE permits — crossing permits required in RUS close-out per 1751F-630 §7)
- **RUS Form 219 close-out** → L4.11 (TIA-526 Tier 2 OTDR — OTDR traces required in Form 219 close-out package); L4.10 (TIA-598-D color records required in splice records submitted with close-out)
- **RUS Bulletin 1751F-630 §4 (aerial clearances)** → L4.2a (NESC Part 2 clearances — 1751F-630 §4 references NESC C2-2023 Rules 230-238 for clearance design)
- **RUS Bulletin 1751F-635 §4 (underground cover)** → L4.3 (NESC Part 3 underground cover — cross-reference); T3 L3.5 (cover depth derivation for direct-bury and conduit)
- **RUS Bulletin 1751F-630 §9 (acceptance)** → L4.8 (TIA-758-C §9 acceptance — parallel standard for customer-owned segments); L4.11 (Tier 2 OTDR — the RUS close-out documentation requirement)
