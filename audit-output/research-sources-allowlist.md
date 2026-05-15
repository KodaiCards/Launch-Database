# OSP Training Research — Trusted Sources Allowlist

> Locked 2026-05-16. Every research agent dispatched for OSP-RW.4/.5/.6/.7 topic briefs MUST cite from this allowlist with section/clause numbers. RT verifies every citation exists + matches the claim. Hallucinations of section numbers will be caught.

## Primary anchors (RUS / RUS-program)

- **RUS Bulletin 1751F-630** — Aerial Plant Engineering Design + Construction
- **RUS Bulletin 1751F-635** — Buried Plant Engineering Design + Construction
- **RUS Bulletin 1751F-810** — Electrical Protection of Communication Facilities
- **RUS Bulletin 1724E-150** — Design Guide for Rural Electric Distribution Lines (aerial plant design, pole loading, construction standards; public USDA PDF at rural.eda.gov / energy.nih.gov). Primary use: pole loading design commentary, NESC loading district values, aerial span engineering. URL: https://www.rd.usda.gov/files/1724e-150.pdf
- **RUS Bulletin 1751F-815** — Bonding & Grounding (verify current state — may be incorporated into 810 or separate)
- **RUS Bulletin 1738** — Electric Borrowers Program (NOT the distance-learning bulletin — that's 7 CFR Part 1703)
- **7 CFR Part 1755** — RUS Telecommunications Standards
- **7 CFR Part 1740** — Distance Learning + Telemedicine Grant (separate from 1738)

## NESC (National Electrical Safety Code)

- **NESC C2-2023** (current edition; mark `[confirm edition]` for clauses not directly verifiable without paywalled access)
- Sections most relevant to OSP:
  - **Section 09** — Grounding methods for electric supply and communication systems
  - **Section 23** — Clearance (vertical / horizontal / over roadways)
  - **Section 24** — Strength requirements (pole loading, sag, tension)
  - **Section 25** — Loading districts (Light/Medium/Heavy/Extreme Wind)
  - **Section 27** — Line construction requirements for energized conductors
  - **Rule 232** — Vertical clearances of conductors above ground/rail/water
  - **Rule 235** — Clearance between conductors of different circuits / utilities

## BICSI

- **BICSI Outside Plant Design Reference Manual (OSPDR)** — primary OSP design reference; cite chapter + section
- **BICSI Telecommunications Distribution Methods Manual (TDMM) 15th Edition** — for RCDD-prep topics (chapter + section)
- **BICSI Information Transport Systems Installation Methods Manual (ITSIMM)** — for cabling installation specifics
- **BICSI OSP Designer Candidate Handbook** — exam blueprint for C01

## FOA (Fiber Optic Association)

- **FOA Reference Guide to Fiber Optics** (Hayes, current edition) — general fiber engineering practice
- **FOA Online Reference Guide** (foa.org/tech/ref/index.html) — public, current
- **FOA Certification standards** for CFOS/CFOT/CFOS-O/CFOS-T (foa.org/cert/)

## TIA / ANSI

- **TIA-568.3-D** — Optical Fiber Cabling Components Standard (OM1-OM5, OS1-OS2)
- **TIA-598-C** — Optical Fiber Cable Color Coding
- **TIA-606-D** — Administration Standard for Telecommunications Infrastructure
- **TIA-607-D** — Generic Telecommunications Bonding and Grounding for Customer Premises
- **TIA-758-C** — Customer-Owned Outside Plant Telecommunications Infrastructure
- **TIA-942-C** — Telecommunications Infrastructure Standard for Data Centers (for C02 RCDD prep)
- **TIA-526-14B** — Optical Power Loss Measurements of Installed Multimode Fiber Cable Plant
- **TIA-526-7A** — Optical Power Loss Measurements of Installed Single-Mode Fiber Cable Plant
- **TIA-492AAAC** — Detail Specification for 50µm OM3 multimode fiber

## ITU-T

- **G.652D** — Standard SMF (most common for OSP)
- **G.655** — Non-Zero Dispersion-Shifted SMF
- **G.657** — Bend-Insensitive SMF (2016 edition)
- **G.984.x** — GPON family
- **G.987.x** — XG-PON
- **G.989.x** — NG-PON2

## IEC

- **IEC 61300-3-35** — Fibre optic interconnecting devices and passive components — End-face quality assessment
- **IEC 61753-1** — Performance standard for fibre optic interconnecting devices + passive components (mark `[confirm edition]`)

## OSHA

- **29 CFR 1910.269** — Electric power generation, transmission, and distribution (covers utility/contractor work near energized)
- **29 CFR 1910.147** — Lockout/tagout (LOTO)
- **29 CFR 1910.333** — Selection and use of work practices
- **29 CFR 1926.1404-1442** — Cranes/derricks in construction
- **29 CFR 1926 Subpart V** — Power transmission and distribution

## FCC / Pole Attachment

- **47 CFR Part 1.1401-1.1424** — Pole attachment rules
- **FCC 18-111** (One-Touch Make-Ready / OTMR Order)

## USACE / Permitting

- **Nationwide Permit (NWP) 57** — Electric Utility Line + Telecommunications Activities (post-2021 reissuance; replaces former NWP 12 scope for telecom)
- **NWP 12** — Oil/Gas Pipelines ONLY (post-2021)
- **33 CFR Part 320-332** — Section 10 / Section 404 permit framework

## State / Federal Environmental

- **40 CFR Part 1500-1508** — NEPA implementing regulations
- **54 USC § 306108** (Section 106) — Historic preservation review
- **16 USC § 1531-1544** (Endangered Species Act) — ESA

## NEC / NFPA

- **NEC NFPA 70-2023** — National Electrical Code; cite article + section (e.g., NEC 250.52(A)(3) for Ufer electrode)
- **NFPA 70E** — Standard for Electrical Safety in the Workplace

## ANSI / ICEA

- **ANSI O5.1** — Wood Poles — Specifications and Dimensions
- **ICEA S-87-640** — Standard for Optical Fiber Outside Plant Communications Cable
- **ANSI/ATIS-0600336** — Network Equipment-Building System (NEBS) Generic Physical Design Requirements

## IEEE

- **IEEE 81** — Measuring Earth Resistance, Earth Surface Potentials, and Earth Surface Conductivity
- **IEEE Std 142** — Grounding of Industrial and Commercial Power Systems
- **IEEE 802.3** — Ethernet (relevant for premise interface)

## Standards Bodies / Other

- **AHJ (Authority Having Jurisdiction)** — state DOT, county/city, utility commission — mark as authoritative for jurisdiction-specific clearances
- **State PUC / DOT manuals** (cite specific state if used)

## Citation rules for research agents

1. **Mandatory format:** every factual claim with a number, threshold, or procedure MUST include `(Source: <doc> §<section>)` after the claim
2. **`[confirm edition]` marker** for any standard where the exact current edition isn't independently verifiable (TIA standards update frequently; NESC every 5 years)
3. **No citations not on this allowlist.** If a research agent finds a relevant source NOT on the list, flag it in the research brief's "proposed additions to allowlist" section — orchestrator reviews + adds.
4. **NO Wikipedia, blog posts, vendor marketing.** Vendor datasheets (Corning, OFS, CommScope, AFL, Belden, Panduit) are acceptable for product-specific technical specs ONLY (e.g., "Corning SMF-28 attenuation typically X dB/km"). Vendor opinion / best-practice posts are NOT.
5. **Field practice claims** (Book-vs-field divergence per Carter's training-voice rule) — cite the field practice with at least one industry-experienced source (e.g., RUS field operations manual, FOA reference guide field practice section, BICSI installation case studies, state DOT design manual). Field practice WITHOUT citation = flagged by RT.

## RT verification protocol

For each research brief:
1. RT-A pulls every citation, attempts to confirm it exists (WebSearch for the document + section)
2. RT-A reports VERIFIED / NOT-FOUND / WRONG-SECTION per citation
3. RT-B independently re-derives any math/threshold claims and verifies they match the cited source's value
4. RT-A + RT-B reports cross-checked by orchestrator
5. Findings: any HALLUCINATED citation → block author dispatch + redo research; any wrong section → flag for correction; minor inconsistencies → batch into author wave as known patches.

## Paywalled / inaccessible sources rule (added 2026-05-16, Carter)

Some primary sources are paywalled (NESC C2, BICSI OSPDR/TDMM, FOA full Reference Guide, ITU-T historical recommendations). When the citation can't be independently verified by hitting the source:

1. **Minimum 2 research agents** (not 1) for that topic — must independently derive the same number/threshold/procedure via DIFFERENT trusted-secondary sources (e.g., RUS Bulletin section that quotes the NESC clause + a state DOT design manual that re-states it). Convergence between independent paths is the verification.
2. **Both RTs run independent verification AND PROCESS CHECK.** Process check = "where did the researcher get this? Was the reasoning chain sound? Could a plausible-sounding-but-wrong number have slipped in from the agent's training data?" RT specifically traces the researcher's logic and flags any "feels right but unconfirmed" reasoning.
3. **If 2 research agents converge** AND both RTs verify the process is sound → claim is locked.
4. **If 2 research agents diverge** OR RT flags weak process → escalate: 3rd research agent, OR flag as `[paywalled — verify against NESC C2 §X.Y when accessible]` in the lesson body.
5. **If a number can't be verified at all** → omit from lesson OR mark "varies by jurisdiction / verify with AHJ" rather than guess.

The process-check is the anti-hallucination lever for paywalled content. Cross-source convergence + RT-of-reasoning catches "researcher's training data leaked into a citation that doesn't actually say that."

Goal: <1% margin of error per Carter's standard.
