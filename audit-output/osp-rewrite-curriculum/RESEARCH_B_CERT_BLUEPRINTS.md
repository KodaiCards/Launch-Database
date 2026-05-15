# OSP-RW Curriculum Scoping — Research Agent B — Cert Blueprints

## Stack snapshot

Researched the three cert tracks Carter locked (BICSI OSP Designer, BICSI RCDD, FOA CFOS/CFOT). BICSI's PDF endpoints return 403 to programmatic fetch, so blueprint detail was extracted via WebSearch snippets that quote the official BICSI/FOA pages and handbooks plus corroborating training-vendor pages. RCDD v15 blueprint percentages and full TDMM-15 chapter list confirmed from multiple sources. OSP Designer (OSP-002) blueprint percentages are NOT publicly published — BICSI references "nine core competencies" and an "exam content outline" without weights; only exam length, item types, and prep manual are disclosed. FOA cert structure fully public (FOA is more transparent than BICSI). All findings carry source URLs. Where percentages couldn't be confirmed, that is stated explicitly — no fabricated weights.

---

## Cert 1: BICSI OSP Designer (OSP / OSP-002)

### Exam blueprint

BICSI does NOT publish per-domain percentage weights for the OSP Designer exam. The Job Task Analysis (JTA) identifies **nine core competencies** that form the blueprint, but the specific competency names + weights are gated behind the OSP Certification Handbook PDF and BICSI does not list them on the public certification page. What is publicly stated: OSP Designers cover "design, supervision of the design and inspection of the interbuilding cabling and infrastructure, including planning pathways and spaces, entrance facilities, terminations, testing, determining media type, creating bonding and grounding design plans, investigating and coordinating rights-of-way, developing system documentation requirements, applying required codes and standards within the design, and verifying the implementation and/or the installation of the design plan" (bicsi.org/osp page).

| Domain (inferred from BICSI's stated scope, NOT official %) | Estimated % weight | Notes |
|---|---|---|
| Site survey + investigation + ROW coordination | unpublished | "investigating and coordinating rights-of-way" |
| Pathways + spaces design (aerial, UG, direct-burial) | unpublished | OSPDRM Ch. 4 anchor |
| Media selection (copper / fiber / hybrid) | unpublished | "determining media type" |
| Entrance facilities + terminations | unpublished | |
| Bonding + grounding design plans | unpublished | "creating bonding and grounding design plans" |
| Codes + standards application (NESC / NEC / RUS / TIA / FCC) | unpublished | "applying required codes and standards" |
| Testing + acceptance | unpublished | |
| Documentation + as-builts | unpublished | "developing system documentation requirements" |
| Inspection + verification of installation | unpublished | "verifying the implementation" |

These nine map cleanly onto our existing General Curriculum Module 02 (OSP Design) + Module 03 (Permitting) + Module 09 (OSP Construction) + chunks of Module 04 (Splicing) and Module 08 (Testing). Mock exam should approximately equally-weight the nine until BICSI publishes weights.

### Format / time / prereqs

- **100 items, 2 hours** (cert handbook + bicsi.org).
- **Item types:** multiple choice, multiple response, enhanced matching.
- **Eligibility (3 paths):** (1) hold a current RCDD; OR (2) 2 yrs FTE OSP design/install field experience + 32 hrs documented continuing education in OSP design/install; OR (3) 2 yrs FTE OSP design/install + current BICSI Technician / DCDC / RTPM credential.
- **Pass score:** BICSI does not publish the cut score; pass/fail report only. Third-party prep sites quote ~70% as the conventional threshold, but unconfirmed.
- **Recertification:** 3-year cycle, CECs required; one BICSI ethics course per cycle.

### Recommended prep materials

- **OSPDRM 6th Edition** (Outside Plant Design Reference Manual) — primary anchor. 11 chapters + 6 appendices + glossary. New to 6th: PON, ADSS aerial, RFoG, dedicated maintenance/restoration chapter.
- **BICSI OSP series courses:** OSP100 (Intro), OSP102 (Applied OSP Design).
- Third-party prep: Udemy practice exams, Amazon "BICSI OSP Exam Practice Guide: 500 Questions" (B0FKSMBDQW).

### Overlap with our general curriculum

Our 8 General Learning Courses cover ~80-90% of OSP Designer scope already:
- M01 Fiber Physics → testing + media selection
- M02 OSP Design (Aerial/NESC/OTMR) → pathways + spaces + ROW
- M03 Permitting & Planning → ROW coordination + codes
- M04 Splicing → terminations
- M07 Fiber Topology + Splice Matrix → documentation + as-builts
- M08 Testing OTDR → testing + acceptance
- M09 OSP Construction → underground pathways + entrance facilities
- M11 Revenue & Estimation → tangentially supports cost estimation in design

### Cert-specific topics NOT (or under-covered) in general curriculum

1. **Bonding/grounding design plans** — covered in pieces but no dedicated lesson on B&G design as deliverable.
2. **Inspection + verification methodology** — practical inspection workflows beyond construction QA.
3. **Maintenance + restoration of OSP** (OSPDRM 6th Ed. new chapter) — break/fix workflows post-deployment.
4. **PON-specific OSP design** (RFoG / split ratios / power budget at distribution level).
5. **ADSS (all-dielectric self-supporting) aerial design** — span tension calcs without a messenger.
6. **Cross-domain integration** — combining all 9 competencies into a single annotated design package for a sample greenfield project.

### Proposed cert-track lessons (8 lessons)

1. OSP Designer exam orientation + JTA walkthrough + study plan
2. Bonding & grounding design plans deep-dive (NEC 250 + NESC + RUS 1751F-802)
3. Inspection & verification workflows (construction QA, punch lists, as-built sign-off)
4. Maintenance & restoration of OSP (OSPDRM Ch. 11)
5. PON / RFoG OSP design (split ratios, power budget, FTTH topologies)
6. ADSS aerial design + sag-tension worked examples
7. Integrated design package case study (greenfield, all 9 competencies woven)
8. Full mock exam + retrospective + remediation lesson

### Mock exam recommended spec

- **100 items, 120 minutes** (mirror real exam).
- **Item mix:** ~70 multiple choice, ~20 multiple response (select-all-that-apply), ~10 enhanced matching (drag-to-pair).
- **Domain weighting:** equal across 9 BICSI core competencies (~11 items each) until BICSI publishes weights.
- **Pass threshold:** 70% (conservative proxy, configurable per Carter).
- **Randomization:** item-pool ≥ 250, draw 100 stratified by domain.
- **Result detail:** domain-level scoring + remediation links to general/cert lessons.

---

## Cert 2: BICSI RCDD (v15)

### Exam blueprint (v15 — current as of 2024 release of TDMM 15th Ed.)

| Domain | % weight | Items (of 100) | Notes |
|---|---|---|---|
| Define Scope of Project | 10% | 10 | Client requirements, in/out of scope |
| Design ICT Solutions | 63% | 63 | Largest section by far — codes, standards, AHJ, all 22 TDMM chapters of design content |
| Support ICT Bid/Tender Process | 11% | 11 | RFP/RFQ, BOM, specs |
| Support ICT Installation Process | 16% | 16 | Inspection, acceptance, project execution |

V14 was 10% / 66% / 9% / 15% — v15 redistributed 3% out of Design into Bid/Tender + Installation. Source: BICSI v14 + v15 RCDD exam blueprint PDFs (bicsi.org).

### Format / time / prereqs

- **100 items, 2.5 hours.**
- **Item types:** multiple choice, multiple response, enhanced matching.
- **Eligibility (3 paths):** (1) 2 yrs FTE ICT design + current BICSI TECH / RTPM / DCDC / OSP; OR (2) 2 yrs FTE ICT design + 2 yrs of higher education ICT coursework; OR (3) 5 yrs verifiable ICT experience.
- **Pass score:** BICSI does not publish; pass/fail report only.
- **Recertification:** 3-year cycle, CECs required.

### Recommended prep materials

- **TDMM 15th Edition** (Telecommunications Distribution Methods Manual) — 22 chapters, 2 volumes, ~2100 pages. Released Jan 2024. Primary anchor.
- **RCDD Test Prep course** (BICSI shop).
- **RCDD Exam Blueprint v15 + Cred Handbook v15** (free PDFs).
- Cabling Installation & Maintenance, Let's Talk Cabling RCDD Study Group ($249), PassYourCert/RCDD prep sites.
- "12 core parts of the TDMM make up 80% of the 100 questions" — cited recommended reading order: 3, 4, 5, 13, 6, 7, 11, 12, 1, 8, 9, 10, 2, 21.

### Overlap with our general curriculum

Modest. Our general curriculum is OSP-heavy; RCDD is ICT-design heavy with structured cabling, telecom spaces, and inside-plant focus. Direct overlap:
- M01 Fiber Physics → TDMM Ch. 1 Principles of Transmission
- M02 OSP Design → TDMM Ch. 13 Outside Plant
- M04 Splicing → portion of TDMM Ch. 7 ICT Cables
- M07 Fiber Topology → portion of TDMM Ch. 12 Field Testing
- M08 Testing OTDR → TDMM Ch. 12 Field Testing
- Existing M05 (Inside Plant — TIA-568/569/606/607) and M06 (RCDD Core — Firestopping/EMC/TDMM) explicitly map to RCDD content already.

### Cert-specific topics NOT in general curriculum

The bulk of TDMM 15 chapters are inside-plant / structured-cabling / building-systems content not natural to general OSP training:
- Ch. 2 Electromagnetic Compatibility (depth)
- Ch. 3 Data Networks (LAN/SAN/network architecture)
- Ch. 4 Telecommunications Spaces (TR, ER, EF design)
- Ch. 5 Backbone Distribution Systems
- Ch. 6 Horizontal Distribution Systems
- Ch. 8 Firestop Systems
- Ch. 10 Power Distribution
- Ch. 11 Telecommunications Administration (TIA-606)
- Ch. 14 Audiovisual Systems
- Ch. 15 Intelligent Building Systems
- Ch. 16 Wireless Networks
- Ch. 17 Electronic Safety and Security
- Ch. 18 Data Centers
- Ch. 19 Health Care
- Ch. 20 Residential Cabling
- Ch. 21 Project Administration, Execution, and Risk Management
- Ch. 22 Special Design Considerations

### Proposed cert-track lessons (15 lessons)

1. RCDD exam orientation + v15 blueprint + 5-yr ICT verification + study plan
2. TDMM Ch. 1 Principles of Transmission — RCDD-depth review
3. TDMM Ch. 2 EMC — coupling modes, mitigation, separation
4. TDMM Ch. 3 Data Networks — topologies, protocols, application classes
5. TDMM Ch. 4 Telecommunications Spaces — TR/ER/EF sizing per TIA-569
6. TDMM Ch. 5 + 6 Backbone + Horizontal Distribution per TIA-568
7. TDMM Ch. 7 ICT Cables + Connecting Hardware (cat ratings, fiber categories)
8. TDMM Ch. 8 Firestop systems + UL listings
9. TDMM Ch. 9 Bonding & Grounding (TIA-607)
10. TDMM Ch. 10 + 11 Power Distribution + Telecom Administration (TIA-606)
11. TDMM Ch. 12 Field Testing (RCDD-depth, copper cat-cert + fiber)
12. TDMM Ch. 17 + 18 Electronic Safety/Security + Data Centers (TIA-942)
13. TDMM Ch. 19 + 20 + 22 Health Care + Residential + Special Considerations
14. TDMM Ch. 21 Project Admin (RFP/RFQ/BOM/scheduling) — covers Bid/Tender + Install Support 27% of exam
15. Full mock exam + retrospective + remediation lesson

### Mock exam recommended spec

- **100 items, 150 minutes** (2.5 hours, mirror real exam).
- **Item mix:** ~70 MC, ~20 multi-response, ~10 enhanced matching.
- **Domain weighting (v15):** 10 / 63 / 11 / 16. Stratified random sample.
- **Pass threshold:** 70% (proxy).
- **Randomization:** item-pool ≥ 300 (RCDD scope is much broader than OSP), draw 100 stratified.
- **Result detail:** chapter-level + domain-level scoring + remediation links.

---

## Cert 3: FOA CFOS / CFOT — recommend SPLIT into TWO tracks

CFOT = base technician cert. CFOS = specialist cert layered on top. They have different audiences (CFOT for entry-level techs; CFOS/O for experienced OSP installers). Treat as two cert tracks for clarity.

### Cert 3a: FOA CFOT (Certified Fiber Optic Technician — base)

**Exam blueprint** (FOA does not publish per-domain percentages; topic list from FOA curriculum requirements):

| Domain | Notes |
|---|---|
| Fiber optic applications + installations overview | Where fiber is used + project lifecycle |
| Fiber types (SM / MM / specialty) | OS1/OS2/OM1-OM5, propagation modes |
| Cables (loose tube, tight buffered, ribbon, ADSS, OPGW, indoor/outdoor) | Construction + selection |
| Components (connectors, splices, splitters, WDM) | Identification + use |
| Transmission systems (light sources, detectors, link budget) | |
| Design and documentation basics | High-level — deeper cert is CFOS/D |
| Hands-on skills | Stripping, cleaving, fusion + mechanical splicing, termination (MM, A/P, PPS), microscope inspection, continuity, insertion-loss testing, OTDR |

**Format / time / prereqs:**
- **Written exam: 100 questions** (multiple choice, matching, true-false). Pass = 70%.
- **Hands-on practical** must also pass at 70% (separate from written).
- **No prereqs** for CFOT — entry-level cert (training program OR prior experience eligible).
- **Validity:** 3 years, renewable.

**Recommended prep materials:** FOA Reference Guide to Fiber Optics (Jim Hayes), Fiber U Self-Study (free), FOA-Approved school course (typically 3-day instructor-led).

**Overlap with general curriculum:** strong. M01 Fiber Physics + M04 Splicing + M07 Fiber Topology + M08 Testing OTDR cover ~70% of CFOT written content. Hands-on practical is NOT something we can replicate in software — must be acknowledged as out-of-scope (cert candidate does that at FOA-Approved school).

**Cert-specific topics NOT in general curriculum:** detailed component-vendor recognition (specific splice closures, splitter cassettes by form factor), light-source/detector module specs, the actual hands-on skill set (we can teach the procedure conceptually but not the muscle memory).

**Proposed cert-track lessons (6 lessons):**
1. CFOT exam orientation + FOA structure + 3-yr renewal flow
2. Fiber types deep dive (SM, MM, specialty — beyond M01 depth, includes vendor naming conventions)
3. Cable + component identification (OSP + premises + DC)
4. Transmission systems — light sources/detectors, link budget worked examples
5. Hands-on procedure walkthrough (video + interactive diagrams — cleave, fusion splice, terminator polish, microscope inspection, continuity, insertion-loss, OTDR shoot)
6. Full mock written exam (no hands-on; we can't simulate)

**Mock exam spec:**
- **100 items, 90 minutes** (FOA doesn't publish a written exam time; 90 min is industry-typical for 100-Q multiple choice).
- **Item mix:** ~60 multiple choice, ~25 matching, ~15 true-false (mirror FOA format).
- **Pass threshold:** 70% (FOA-published).
- **Randomization:** item-pool ≥ 200, draw 100.
- **Hands-on portion:** flagged as "scheduled at FOA-Approved school — not simulated here."

### Cert 3b: FOA CFOS/O (OSP Specialist — primary fiber cert for our business)

**Exam blueprint** (FOA does not publish weights; topic list from FOA + training-vendor sites):

| Domain | Notes |
|---|---|
| OSP cable types + identification | Loose tube, ribbon, ADSS, OPGW, armored, gel-filled |
| OSP closure types | Aerial, pedestal, vault, butt-splice, dome |
| OSP cable preparation | Sheath removal, gel cleanup, fiber identification, prep for splicing |
| Fusion splicing for concatenation + termination | Splice trays, mass-fusion, single |
| OSP-specific testing — OTDR focus | Bidirectional, launch fiber, dynamic range, event analysis |
| Aerial cable installation methods | Lashed, ADSS, OPGW, attachment hardware |
| Underground installation | Direct burial, conduit, vaults, handholes |
| Standards + safety for OSP | NESC, OSHA, RUS-applicable practices |

**Format / time / prereqs:**
- **Written + hands-on**, both at 70% pass.
- **Prereq:** CFOT + 2 yrs field experience (incl. documented OSP install/test work).
- **Validity:** 3 years.

**Recommended prep materials:** FOA Reference Guide to Outside Plant Fiber Optics + Fiber U OSP Self-Study + FOA-Approved school OSP course.

**Overlap with general curriculum:** very strong. M02 + M04 + M07 + M08 + M09 cover the technical body ~85%. Gap is OSP-specific vendor closures + OSP-specific OTDR shooting techniques.

**Cert-specific topics NOT in general curriculum:**
1. OSP closure/enclosure vendor families (Corning, CommScope, Preformed, etc.)
2. Bidirectional OTDR averaging methodology
3. Mass-fusion ribbon splicing technique
4. ADSS vs OPGW attachment hardware specifics

**Proposed cert-track lessons (6 lessons):**
1. CFOS/O exam orientation + 2-yr OSP experience documentation + study plan
2. OSP closure families deep dive (vendor-neutral naming + selection criteria)
3. Bidirectional OTDR methodology + advanced trace analysis
4. Mass-fusion ribbon splicing — procedure + alignment
5. ADSS / OPGW attachment hardware + installation tension control
6. Full mock written exam (hands-on flagged as off-platform)

**Mock exam spec:**
- **100 items, 90 minutes.**
- **Item mix:** same as CFOT (~60 MC, ~25 matching, ~15 T/F).
- **Pass threshold:** 70%.
- **Randomization:** item-pool ≥ 200, draw 100.

---

## Cross-cert reuse opportunities

| Topic | Reusable across | Recommendation |
|---|---|---|
| Bonding & grounding design plans | OSP Designer + RCDD | Single deep-dive lesson, surfaced in both tracks |
| OTDR testing methodology | OSP Designer + CFOT + CFOS/O | M08 generalized; cert-track lessons add cert-specific item pool |
| ICT cable/connector identification | RCDD + CFOT | Single lesson, dual-tagged |
| Project administration / RFP-RFQ basics | RCDD + OSP Designer | Light shared lesson + RCDD-deep variant |
| Codes + standards application (NESC/NEC/TIA/RUS) | OSP Designer + RCDD + CFOS/O | Reuse general curriculum M03; cert-track lessons add the recall drill |
| Hands-on procedure walkthroughs | CFOT + CFOS/O | Single video-+-AnnotatedDiagram lesson set, both tracks reference |

**Estimated reuse savings:** ~6-8 lessons could serve double-duty across tracks, dropping the unique-lesson count.

---

## Cert-track DAG dependencies (general topics required first)

| Cert track | Required general topics (must be 100% complete to unlock cert track) |
|---|---|
| BICSI OSP Designer | M01, M02, M03, M04, M07, M08, M09, M11 (the full general curriculum) |
| BICSI RCDD | M01, M02, M04, M07, M08 + the existing M05 (Inside Plant) and M06 (RCDD Core) lessons absorbed into the cert-prep track |
| FOA CFOT | M01 + M04 + M08 (subset; CFOT is entry-level) |
| FOA CFOS/O | M01, M02, M04, M07, M08, M09 + completion of CFOT cert track first |

Carter's product treats Certification Prep as a separate splash section accessed AFTER General Learning. Recommend gating each cert track on its prerequisite general topics being marked "complete" in `training_progress` — surfacing the gate as "Complete the prerequisite general courses to unlock this cert prep" with a link to the missing course(s).

---

## Topics in cert blueprints that AREN'T in our general curriculum scope

Recommendations per topic (add to general OR keep cert-only):

| Topic | Cert | Recommend |
|---|---|---|
| Bonding/grounding design as a deliverable | OSP, RCDD | **Add to general** (M02 or new lesson in M03) — applies to every OSP/ICT job |
| PON / FTTH OSP design (split ratios, power budget) | OSP, CFOS/O | **Add to general** (extend M02 or new lesson) — Carter's business is fiber-heavy |
| Maintenance & restoration of OSP | OSP | **Cert-only** — niche post-deploy work |
| ADSS aerial design | OSP, CFOS/O | **Add to general** (extend M02) — common in PSC/RUS jobs |
| Mass-fusion ribbon splicing | CFOS/O | **Cert-only** — vendor-specific |
| TDMM Ch. 4 Telecom Spaces sizing (TR/ER/EF) | RCDD | **Cert-only** — inside-plant focus |
| TDMM Ch. 8 Firestop systems | RCDD | **Cert-only** — inside-plant focus |
| TDMM Ch. 14-20 (AV / IBS / wireless / safety / DC / health care / residential) | RCDD | **Cert-only** — outside our OSP scope |
| Hands-on fiber procedure walkthroughs | CFOT, CFOS/O | **Add to general** (M04 + M08) — useful for everyone, also feeds certs |

**Net change to general curriculum from cert research:** add 3-4 lessons across M02/M03/M04/M08 to support cert prep AND raise general OSP quality. Specifically:
- M02: ADSS + PON/FTTH OSP design lessons (2 new)
- M03: Bonding/grounding design as a deliverable lesson (1 new)
- M04 + M08: hands-on procedure walkthrough lessons (1-2 new, with AnnotatedDiagram + video stubs)

---

## Total cert-prep lesson count summary

| Track | Lessons |
|---|---|
| BICSI OSP Designer | 8 |
| BICSI RCDD | 15 |
| FOA CFOT | 6 |
| FOA CFOS/O | 6 |
| **Total** | **35 cert-prep lessons** |

With ~6-8 reuse-shareable lessons, the unique-authoring count is ~27-29 lessons.

---

## Source references

- BICSI OSP Designer page — https://www.bicsi.org/education-certification/certification/osp
- BICSI OSP Certification Handbook (2025) — https://www.bicsi.org/docs/default-source/handbooks/osp_cred_handbook_09102025_1147.pdf
- BICSI RCDD page — https://www.bicsi.org/education-certification/certification/rcdd
- BICSI RCDD v15 prep page — https://www.bicsi.org/education-certification/certification/rcdd/how-to-prepare-for-the-rcdd-exam
- BICSI RCDD v14 Exam Blueprint PDF — https://www.bicsi.org/docs/default-source/default-document-library/rcdd-exam-blueprint.pdf
- BICSI RCDD v15 Cred Handbook — https://www.bicsi.org/docs/default-source/handbooks/rcdd-cred-handbook_v15_09112025_0916.pdf
- BICSI TDMM 15th Edition — https://www.bicsi.org/education-certification/education-@-bicsi-learning-academy/technical-publications/telecommunications-distribution-methods-manual
- BICSI TDMM 15 release news (Jan 2024) — https://www.bicsi.org/about-us/about-bicsi/news-events/bicsi-news/2024/01/12/bicsi-releases-15th-edition-of-tdmm-for-cabling-design
- BICSI OSPDRM 6th Edition — https://www.bicsi.org/education-certification/education-@-bicsi-learning-academy/technical-publications/outside-plant-design
- BICSI OSPDRM 6th Ed deep dive — https://shop.bicsi.org/a-deep-dive-into-the-ospdrm-6th-edition
- BICSI Continuing Education / CECs — https://www.bicsi.org/education-certification/certification/bicsi-continuing-education-credits-cecs
- BICSI Recertification — https://www.bicsi.org/education-certification/certification/bicsi-credential-renewal
- COOL OSP Designer cert summary (DoD) — https://www.cool.osd.mil/dciv/credential/index.html?cert=osp1399
- LinkedIn OSP Designer review (Eron) — https://www.linkedin.com/pulse/bicsi-outside-plant-osp-designer-certification-review-eron
- FOA Certifications overview — https://www.thefoa.org/Certs.htm
- FOA CFOT page — https://www.thefoa.org/cfot.htm
- FOA Specialist Certifications — https://www.thefoa.org/adv-cert.htm
- FOA Curriculum Requirements — https://www.thefoa.org/instructors/class-reqs.htm
- FOA KSAs — https://foa.org/KSAs.html
- FOA Reference Guide to OSP Fiber Optics — https://www.thefoa.org/FOArgOSP.html
- Fiber U Self-Study — https://fiberu.org/
- BDI Datalynk CFOS/O — https://www.bdidatalynk.com/cfoso.html
- Fiber Optic Academy CFOS-O — https://thefiberopticacademy.com/courses/CFOS-O
- Cabling Installation & Maintenance RCDD study guide — https://www.cablinginstall.com/home/article/16469020/studying-for-the-rcdd-exam
- Let's Talk Cabling RCDD Study Group — https://letstalkcabling.com/rcdd-study-group-249-00/

Note on citation hygiene: all blueprint percentages cited for RCDD v14/v15 trace to the BICSI RCDD Exam Blueprint PDF (linked above) via WebSearch snippet quoting. OSP Designer per-domain weights are NOT publicly published — table cells are marked "unpublished" rather than fabricated. FOA does not publish per-domain percentages on any cert; topic lists are taken from FOA's curriculum-requirements + KSA pages.

=== RESEARCH AGENT B REPORT END ===
