# Module 3 — Permitting & Planning research log

> Author: Curriculum Architect (Agent A). Audience: Red Team / QA (Agent C).
>
> Module 3 is the messiest module in the curriculum because almost nothing
> on the permitting side is governed by a single citable industry standard.
> The dominant authorities are federal statutes (NEPA, NHPA, ESA), federal
> agency procedures (NTIA, FCC, USFWS, ACHP), state DOT manuals, and
> per-municipality codes. This research log records what was found in
> publicly available materials and where field practice diverges from the
> textbook framing.
>
> Tagging is the same as Module 2: **VERIFIED-public-source**,
> **VERIFIED-via-secondary-source**, **UNVERIFIED-needs-paid-doc**.

---

## 1. Standards & official sources consulted

### 1.1 Municipal codes and ROW permits

There is no single national standard for municipal ROW permitting. The
public references below are representative model codes and playbooks.

- **FCC Broadband Deployment Advisory Committee, Model Code for
  Municipalities** —
  https://www.fcc.gov/sites/default/files/bdac-07-2627-2018-model-code-for-municipalities-approved-rec.pdf
  — federal model code that municipalities can adopt. Useful for the
  *structure* of a typical ROW ordinance (application contents,
  timelines, fee categories). **VERIFIED-public-source.**
- **NTIA BroadbandUSA, Permitting 101 deck** —
  https://broadbandusa.ntia.gov/sites/default/files/2025-06/Permitting_101_Deck.pdf
  — agency-level overview of permitting categories.
- **California Local Jurisdiction Broadband Permitting Playbook (July
  2025)** —
  https://broadbandforall.cdt.ca.gov/wp-content/uploads/sites/19/2022/09/California-Local-Jurisdiction-Permitting-Playbook-1.pdf
  — state-level playbook that reproduces typical municipal application
  requirements and timelines. Useful as a citable example.
- **TxDOT Right-of-Way Manual, Broadband Accommodation, Section 4** —
  https://www.txdot.gov/manuals/row/utl/appendix-b--broadband-accommodation-process/section-4--broadband-technical-specifications.html
  — state DOT broadband technical specs. Citable example of state-level
  ROW manual.
- **City of Aurora (CO) fiber-optic permits** —
  https://www.auroragov.org/business_services/licenses___permits/fiber_optic
  — example of a city's published fiber permit page. Useful as a
  representative real-world municipal interface.
- **NARUC, "Municipal Broadband: A Review of Rules, Requirements, and
  Options"** —
  https://pubs.naruc.org/pub/FA86C96C-ECA3-B0C1-D5DC-B92FE52541C0 —
  state-PUC-level synthesis of municipal broadband permitting rules.
- **IMMCO, "Right of Way Permits in Fiber: Part 1"** —
  https://www.immcoinc.com/blog/right-of-way-permits-in-fiber-part-1
  — vendor blog summarising the typical three-step municipal application
  process; useful as a *student-facing* explainer of what a ROW packet
  contains.
  **VERIFIED-via-secondary-source** for the "three-step + ~60-day +
  30-day public comment" framing — note this is not a uniform national
  rule, it's representative.

### 1.2 NEPA and federally funded broadband (BEAD, BIP, FirstNet, RDOF)

- **NTIA Notice of Newly Adopted NEPA Categorical Exclusions** —
  https://broadbandusa.ntia.gov/funding-programs/policies-waivers/Notice_of_Newly_Adopted_NEPA_Categorical_Exclusions
  and **Newly Established Categorical Exclusions** —
  https://broadbandusa.ntia.gov/funding-programs/policies-waivers/Notice_of_Newly_Established_NEPA_Categorical_Exclusions
  — current set of NTIA CEs; **C-8** is the buried/aerial fiber CE that
  applies to most BEAD/MMG projects. **VERIFIED-public-source.**
- **NTIA Federal Register notice on NEPA procedures (2024)** —
  https://www.ntia.gov/federal-register-notice/2024/national-environmental-policy-act-procedures-and-categorical
  — formal regulatory text behind the CEs.
- **NTIA NEPA Categorical Exclusion / Extraordinary Circumstances slide
  deck** —
  https://broadbandusa.ntia.gov/sites/default/files/2024-08/NTIA_NEPA_Categorical_Exclusion_Extraordinary_Circumstances_NTIA-BLM_Permitting_Summit_Slides.pdf
  — explicit list of when a CE does *not* apply (T&E species, historic
  properties, sensitive habitat, migratory birds, traditional cultural
  properties).
- **NEPA for BEAD Milestone Schedule** —
  https://broadbandusa.ntia.gov/sites/default/files/2025-05/NEPA_for_BEAD_Milestone_Schedule_NEPA_Timeline.pdf
  — NTIA's published NEPA timeline for BEAD. Confirms the typical 90-day
  target and the EIS as the rare exception. **VERIFIED-public-source.**
- **NTIA ESAPTT (Environmental Screening and Permitting Tracking Tool)
  overview** —
  https://broadbandusa.ntia.gov/sites/default/files/2025-06/ESAPTT_Overview.pdf
  — Salesforce-based screening tool used by BEAD subgrantees.
- **NJ BEAD NEPA / NHPA Guidance (June 2025)** —
  https://www.nj.gov/connect/documents/bead/NJ_BEAD_NEPA_and_NHPA_Guidance.pdf
  — clean state-level reproduction of NEPA + NHPA process for fiber
  subgrantees. Useful as a teaching aid because it walks the actual
  state form sequence.
- **NC Broadband BEAD Environmental Permitting webinar slides** —
  https://www.ncbroadband.gov/bead-environmental-permitting-requirements-webinar-slides/download?attachment=
- **BroadbandBreakfast coverage of CEs** —
  https://broadbandbreakfast.com/ntia-adopts-nepa-exemptions-for-bead-projects/
  — trade-press summary of the 30 new + 6 adopted CEs (47 total).

### 1.3 Section 106 / NHPA, SHPO, THPO

- **NTIA NHPA Section 106 Consultation Process Fact Sheet (2025)** —
  https://broadbandusa.ntia.gov/sites/default/files/2025-08/EHP_NHPA_Sect_106_Consultation_Process_Fact_Sheet_2025.pdf
  — current NTIA consultation fact sheet (URL was 403 to WebFetch this
  session; Red Team to confirm).
- **2024 version (still useful as redundant citation)** —
  https://broadbandusa.ntia.gov/sites/default/files/2024-02/NHPA_Sect_106_Consultation_Process_Fact_Sheet_2024.pdf
- **ACHP Program Comment Flowchart** —
  https://broadbandusa.ntia.gov/sites/default/files/2025-06/EHP_NTIA_Section_106_Program_Comment_Flowchart.pdf
- **ACHP Consultation with Indian Tribes Handbook (June 2021)** —
  https://www.achp.gov/sites/default/files/2021-06/ConsultationwithIndianTribesHandbook6-11-21Final.pdf
  — authoritative ACHP handbook on tribal consultation in Section 106.
  **VERIFIED-public-source.**
- **ACHP FAQ on the Program Comment for federal communications
  projects** —
  https://www.achp.gov/digital-library-section-106-landing/frequently-asked-questions-pc-federal-communications
- **FHWA Tribal Section 106 Q&A** —
  https://www.fhwa.dot.gov/tribal/topics/historic/tcqa.htm — useful
  cross-agency framing.
- **NM Historic Preservation Division Section 106 page** —
  https://www.nmhistoricpreservation.org/programs/review-compliance/section-106.html
  — example of a SHPO's public guidance.
- **30-day SHPO comment window.** NTIA fact sheets and ACHP procedures
  describe a **30 calendar day** SHPO comment window once an adequately
  documented initiation letter is submitted.
  **VERIFIED-via-secondary-source** (NTIA fact sheet).

### 1.4 ESA / threatened and endangered species

- **USFWS Listed Bats Consultation & Conservation Strategy** —
  https://www.fws.gov/program/endangered-species/bat-consultation-conservation-strategy
  — current USFWS bat consultation hub.
- **USFWS Final NLEB / Tricolored Bat Voluntary Environmental Review
  Guidance, October 2024** — covered by:
  - https://www.endangeredspecieslawandpolicy.com/u-s-fish-and-wildlife-service-issues-final-northern-long-eared-bat-and-tricolored-bat-guidance
  - https://www.cecinc.com/blog/2024/10/25/usfws-finalizes-bat-protection-guidance-development-projects/
  - https://www.environmentallawandpolicy.com/2024/04/fws-prepares-for-tricolored-bat-listing-with-new-guidance/
  - https://www.enviroscienceinc.com/esa_compliance_nleb_tricolored_bats/
  - https://www.wetlands.com/bat-dkey-updates-2024fall/
  Key fact: **NLEB is endangered (reclassified 2022); tricolored bat
  proposed endangered (2022); Indiana bat endangered since 1966.**
  Tree-clearing time-of-year restrictions during the pup season are the
  most common project-level mitigation. **VERIFIED-via-secondary-source**.
- **USFWS IPaC and the Range-wide DKey** — public-facing screening tool.
  Project planners run their footprint through IPaC to enumerate
  potentially-affected listed species before designing mitigation.

### 1.5 AutoCAD design workflows

- **Lumen Detail Drawing Standards Manual** —
  https://assets.lumen.com/is/content/Lumen/detail-drawing-standards-manualpdf?Creativeid=515b10a8-37eb-4b1b-a0c1-4249e7d5d43e
  — a major ILEC's published OSP CAD standard. Real example of layer
  naming, sheet conventions, blocks. **VERIFIED-public-source.**
- **Port of Portland CAD Standards Manual** —
  https://cdn.portofportland.com/eng-specs-gdline/PART%203%20-%20CAD%20STANDARDS.pdf
  — public-agency CAD standard, useful as a counter-example to the
  carrier-specific Lumen standard.
- **CAD/CAM Services blog, "AutoCAD Fiber Optic Designs & Drawings"** —
  https://www.cadcam.org/blog/autocad-fiber-optic-designs-drawings
- **Phoenix Fiber, "CAD Drawings in Fiber Optic Networks"** —
  https://www.phoenix-fiber.com/posts/cad-drawings-in-fiber-optic-networks
- **Autodesk Civil 3D layer help** —
  https://help.autodesk.com/view/CIV3D/2024/ENU/?guid=GUID-54164E1A-185E-4C21-AE59-7F9EE15D1421
  — Civil 3D's NCS-aligned layer template documentation.
- **CADpro Tips, Civil 3D layers** —
  https://cadprotips.com/2023/12/28/understanding-layers-in-autocad-civil-3d-and-verticals/
- **Autodesk community fiber-network thread** —
  https://forums.autodesk.com/t5/autocad-electrical-forum/symbols-for-fiber-optic-network-diagramming/td-p/8343712
- **CAD Forum free-block library** —
  https://www.cadforum.cz/catalog_en/?q=fiber+optic
- **CAD Authority free utility/civil linetype library** —
  https://cadauthority.com/free-autocad-linetypes-download/

### 1.6 GIS as permit deliverable

- **Pleasanton, CA — Digital Submittal Requirements** —
  https://www.cityofpleasantonca.gov/assets/our-government/gis-mapping-data/digital-submittal-requirements.pdf
  — actual municipal example of a "GIS file is the deliverable" workflow.
  **VERIFIED-public-source.**
- **Florida Turnpike KMZ Standards (Oct 2020)** —
  https://floridasturnpike.com/wp-content/uploads/2020/10/Turnpike-KMZ-Standards.pdf
  — DOT-level KMZ deliverable spec. Real-world example.
  **VERIFIED-public-source.**
- **Whole Building Design Guide UFGS 01 78 30.00 23, "CADD Data for
  GIS Deliverables"** —
  https://www.wbdg.org/FFC/NAVFAC/NAVREG/NFGS%2001%2078%2030.00%2023.pdf
  — federal NAVFAC spec for handing off CAD into GIS as a contract
  deliverable.
- **Esri ArcGIS for fiber networks landing** —
  https://www.esri.com/en-us/industries/telecommunications/digital-divide/arcgis-software-for-fiber-networks
- **VETRO FiberMap** —
  https://vetrofibermap.com/ and review on Capterra
  https://www.capterra.com/p/193245/VETRO-FiberMap/reviews/ — note:
  Capterra reviews include a complaint that "Vetro does not have the
  capability of exporting out a nice drawing and legend for city use,"
  which is itself a useful field-vs-textbook example: even modern
  fiber-management GIS tools don't always emit a deliverable a
  municipality will accept.
- **Pipeline Magazine, "Geospatial Information Systems (GIS) for Fiber
  Broadband"** —
  https://pipelinepub.com/digital-customer-experience/geospatial-information-systems-GIS-for-fiber-broadband-deployments
- **AEX, "GIS Mapping for Fiber Network Planning"** —
  https://aexsoftware.com/blog/g/blog/gis-mapping-fiber-network-planning
- **Lightyear, "How To Use .KMZ Data When Evaluating Fiber Routing"** —
  https://lightyear.ai/blogs/how-to-use-kmz-data-when-evaluating-fiber-routing-options-for-dia-wan
- **IMMCO Fiber As-Builts & GIS case studies** —
  https://www.immcoinc.com/case-study-gis-as-built-us
- **Andy Arthur municipal broadband KMZ maps** —
  https://andyarthur.org/kml-maps-broadband-availability-by-municipality-fiber-optic-service-availability.html
  — example of KMZ deliverables published by a state (NY) program.

### 1.7 Make-ready engineering (cross-references Module 2)

Make-ready straddles Modules 2 and 3. Module 3 owns the *project-management
and timeline* side (FCC pole-attachment timeline, OTMR scheduling, who-pays);
Module 2 owns the design / clearance side. Sources:

- **FCC Fact Sheet, July 2018 (FCC 18-111)** —
  https://docs.fcc.gov/public/attachments/doc-352544a1.pdf
- **FCC public notice DA-18-1313** —
  https://docs.fcc.gov/public/attachments/DA-18-1313A1.pdf
- **OJUA OTMR explainer** —
  https://www.ojua.org/wp-content/uploads/2019/10/One-Touch-Make-Ready.pdf
- **FCC blog post on 2023 pole-attachment rules update** —
  https://www.fcclawblog.com/2023/12/articles/fcc/fcc-adopts-new-pole-attachment-rules-to-promote-broadband-expansion/
- **Wikipedia OTMR (last update tracked)** —
  https://en.wikipedia.org/wiki/One_Touch_Make_Ready
- **Pew Charitable Trusts, "Broadband Expansion May Hinge on States'
  Processes for Attaching Lines to Utility Poles" (March 2025)** —
  https://www.pew.org/en/research-and-analysis/issue-briefs/2025/03/broadband-expansion-may-hinge-on-states-processes-for-attaching-lines-to-utility-poles
- **Benton Institute summary** —
  https://www.benton.org/blog/fcc-adopts-new-pole-attachment-rules-speed-broadband-deployment
- **CT Mirror op-ed on make-ready delays** —
  https://ctmirror.org/2022/02/24/make-ready-delays-high-speed-fiber-rollouts-michael/
- **DQE Tech Talk explainer** —
  https://dqe.com/resources/tech-talk/understanding-fiber-make-ready/

---

## 2. Forums & community practice

WebFetch was blocked from Reddit in this session, so direct Reddit
threads are flagged for Red Team to retrieve. The non-Reddit forum and
practitioner-blog references below are usable as-is.

- **Autodesk community, "Symbols for Fiber Optic Network diagramming"** —
  https://forums.autodesk.com/t5/autocad-electrical-forum/symbols-for-fiber-optic-network-diagramming/td-p/8343712
  — multi-year thread. Field paraphrase: AutoCAD has no out-of-the-box
  OSP block library; every shop builds their own or buys a CAD-block
  package. Tells us: textbook descriptions of "the AutoCAD OSP workflow"
  describe a generic CAD interface, not a curated OSP template.
- **Capterra reviews of VETRO FiberMap** —
  https://www.capterra.com/p/193245/VETRO-FiberMap/reviews/ — multiple
  reviews from 2023–2025. Field paraphrase: GIS-as-permit is real for
  some cities but the export-to-the-format-the-AHJ-wants is the friction
  point. A platform that produces clean GIS internally still has to
  *also* produce a PDF set with title block for the city's planning
  department.
- **Mike Holt forums (referenced in Module 2 log)** —
  https://forums.mikeholt.com/threads/underground-fiber-optic-conduit.6578/ —
  electrician-side discussion of underground utility coordination,
  relevant to permitting because the locate-and-mark step crosses into
  the permitting envelope (one-call ticket required before digging).
- **Quora, "What do I need to install aerial fiber optic cable between
  two areas?"** —
  https://www.quora.com/What-do-I-need-to-install-aerial-fiber-optic-cable-between-two-areas
  — illustrative public-Q&A; field answer is dominated by ROW/permit
  questions, not technical questions.
- **CAD Forum free-block downloads thread/library** —
  https://www.cadforum.cz/catalog_en/?q=fiber+optic — community-curated
  block library; tells us the OSP CAD ecosystem is largely community-
  populated rather than vendor-shipped.
- **Reddit r/fiberoptics, r/telecom, r/RCDD, JLC online, lineman
  forums, BICSI community — Red Team to verify directly.** Recurring
  themes the Red Team should look for: (a) "permitting took longer
  than the build" threads — universal field complaint; (b) "AutoCAD
  vs GIS as deliverable" threads — periodic confusion about which file
  format the city actually opens; (c) "tribal consultation" threads —
  rare but high-value; field practitioners often underestimate THPO
  involvement on federally funded builds; (d) "USFWS bat" threads —
  field crews surprised to learn tree-clearing windows are restricted
  April–October-ish in NLEB range; (e) "make-ready" threads — see
  Module 2 for the same theme.

---

## 3. Field vs. textbook gaps (with concrete examples)

### 3.1 Municipal permitting timeline

| Source | Timeline framing | Tag |
|---|---|---|
| FCC BDAC Model Code | Adoption-jurisdiction-defined; encourages shot clocks | **VERIFIED-public-source** |
| IMMCO blog typical-city framing | ~3 application steps, ~60-day completion target after revisions, 30-day public comment | **VERIFIED-via-secondary-source** |
| Field reality (state playbooks, BroadbandUSA) | Real timelines vary 30 days to 12+ months. Outliers driven by historic districts, environmental overlays, parallel state-DOT permits, and city-staff backlog. | Field practice |

**Editorial gap:** Module 3 must teach the *shape* of a ROW packet
(application form, route maps, traffic plan, bonding/insurance, fee
schedule) without pretending there is a universal timeline.

### 3.2 NEPA categorical exclusion vs full review

- Textbook: NEPA imagines three tiers — Categorical Exclusion (CE),
  Environmental Assessment (EA), Environmental Impact Statement (EIS).
- Field reality (BEAD): NTIA has adopted **47 categorical exclusions**
  (30 newly established + 6 adopted from FirstNet + 11 prior). For
  most BEAD fiber builds the relevant CE is **C-8** (aerial or buried
  utility/communication using existing ROW). EISes are rare. Most
  effort is consumed by *demonstrating CE eligibility* and ruling out
  "extraordinary circumstances" (T&E species, historic properties,
  sensitive habitat, migratory birds, traditional cultural properties).
  **VERIFIED-public-source** via NTIA documents above.

### 3.3 Section 106 / SHPO

- Textbook (statute): Federal action affecting a property listed or
  eligible for the National Register triggers Section 106 review with
  the SHPO and any THPO whose lands are affected.
- SHPO comment window: **30 calendar days** after an adequately
  documented initiation letter. **VERIFIED-via-secondary-source**
  (NTIA fact sheet).
- Field reality: many fiber routes ride existing ROW corridors which
  are presumed disturbed; a "no historic properties affected" finding
  is the most common outcome and SHPO often concurs by silence at the
  end of 30 days. The hard cases are: routes through downtown historic
  districts, routes touching Native American traditional cultural
  properties, and routes that involve any new pole holes outside an
  existing trench. Module 3 should explicitly tell students that a
  buried fiber project that *deviates from the existing ROW* — even by
  a few feet — is the case where Section 106 actually slows the build.

### 3.4 ESA / T&E species and bats

- Textbook: ESA Section 7 consultation triggers when a federal-nexus
  project may affect a listed species or critical habitat.
- Field reality: for OSP fiber, the dominant project-level mitigation
  is **time-of-year tree-clearing restrictions** for NLEB / Indiana
  bat / tricolored bat. Range-wide, this means tree-clearing windows
  that exclude pup season (commonly framed as June 1 – July 31, with
  broader avoidance April – October recommended in some ranges). The
  exact dates are USFWS-state/range specific and the **DKey** in IPaC
  generates project-specific guidance. **VERIFIED-via-secondary-source**
  (multiple law-firm and consultant summaries cited above).
- Common student misconception: that ESA only matters for "wild"
  routes. In reality, urban tree-clearing for aerial route makes-ready
  is a frequent NLEB/tricolored-bat trigger because urban canopy still
  qualifies as roost habitat in much of the eastern U.S.

### 3.5 AutoCAD design workflow

- Textbook (BICSI OSPDRM 6e): describes a generic CAD process — layered
  drawings of poles, anchors, ducts, splice cases — and is largely tool-
  agnostic.
- Field reality:
  - Most large carriers run **AutoCAD or Civil 3D for the
    construction-document set** *plus* a fiber-management system
    (3-GIS, VETRO FiberMap, IQGeo, Bentley OpenComms, FiberDB) for
    the network-as-graph (nodes, splices, fiber assignments).
  - The CAD set is the **permit deliverable**; the fiber-management
    system is the **operational record**.
  - AutoCAD ships *no* OSP block library. Every shop either licenses
    a third-party block set or maintains an internal one. The Lumen
    Detail Drawing Standards Manual is one of the few publicly readable
    examples of a real carrier's CAD standard.
  - Students who learn "AutoCAD for OSP" without learning the parallel
    fiber-management-system layer will not survive their first month
    on a real OSP team.

### 3.6 GIS as permit deliverable

- Textbook framing (older BICSI/TIA): permit set is paper / DWG.
- Current practice: a growing number of municipalities and DOTs accept
  **PDF + KMZ** or **PDF + shapefile** as the primary deliverable, with
  CAD only as a backup. Concrete public examples:
  - **Pleasanton, CA** publishes a digital submittal requirements
    document specifying coordinate system, file naming, and layer
    structure for the GIS deliverable.
  - **Florida Turnpike** publishes a KMZ-deliverable standard (Oct
    2020) for any project touching its ROW.
  - **NAVFAC UFGS 01 78 30.00 23** specifies CADD-to-GIS handoff for
    federal builds.
  - **NY State broadband program** publishes municipal-broadband
    availability as KMZ.
- **VERIFIED-public-source** on each example above.
- Field reality: even where a city's website says "we accept GIS,"
  the planning department often *also* requires a PDF with title
  block, signed by a PE in the relevant state. The GIS is the
  *operational* artifact; the stamped PDF is the *legal* artifact.
  Module 3 must teach students that "GIS deliverable" rarely
  *replaces* the stamped CAD — it is *additional*.

### 3.7 Make-ready engineering

- Textbook (FCC framing): one-touch make-ready for *simple*
  communication-space work, sequential make-ready for everything else,
  with FCC shot-clock timelines.
- Field reality (CT Mirror, Pew, Benton coverage):
  - "Make-ready takes longer than the build" is a near-universal
    field complaint.
  - Pole-owner survey delays are the dominant slip. Pew's 2025
    issue brief notes states are now actively legislating to enforce
    pole-attachment timelines because FCC enforcement alone is too
    slow for BEAD calendars.
  - Many "simple" jobs reclassify to "complex" mid-project because
    a previous attacher's installation is non-compliant; the new
    attacher inherits the cost of fixing the existing violation.
  - Field paraphrase: "You will spend more time on the make-ready
    spreadsheet than on the splice plan."

---

## 4. Open questions for Red Team / user

1. **CE C-8 wording.** Is the precise CE C-8 text in the 2024 NTIA
   Federal Register notice the controlling text, or has 2025/2026
   guidance superseded it? Red Team to verify against the most recent
   NTIA Federal Register notice.
2. **Bat tree-clearing windows.** Module 3 should state the *concept*
   ("tree-clearing windows are restricted in NLEB range") and tell
   students to run IPaC for the actual dates. Acceptable, or does the
   user want a specific date range cited?
3. **Stamped-PE-on-PDF requirement.** This varies by state. Module 3
   currently frames it as "many states require." If the user wants a
   citable list of states that require PE stamps on broadband ROW
   submittals, that is a separate research pass.
4. **Tribal consultation.** Should Module 3 include a worked example
   of a route crossing tribal land, with the THPO replacing the SHPO?
   The ACHP handbook supports it. The author's preference is yes —
   it's a high-impact teaching moment students otherwise miss.
5. **AutoCAD vs GIS module structure.** Should Module 3 include a
   hands-on "import a KMZ into AutoCAD Civil 3D" walkthrough? It
   would be the most concrete-skill exercise in the module but
   requires an Autodesk-licensed environment.
6. **Make-ready in Module 2 vs Module 3.** Author has split the topic:
   Module 2 = clearance / design side, Module 3 = timeline / project
   management side. Confirm with user that this split is acceptable.
7. **State-DOT permit examples.** TxDOT is cited; are FDOT, Caltrans,
   and PennDOT also worth citing as second/third examples to show the
   range?

---

## 5. Recommended editorial defaults for the module

1. **Permitting is *layered*.** Teach students the layer cake: federal
   (NEPA/NHPA/ESA, only when there is a federal nexus), state
   (DOT manual, environmental overlays), municipal (ROW ordinance, fee
   schedule), and private (easements). Most projects touch at least
   two layers; BEAD-funded projects touch all four.
2. **Lead with "is there a federal nexus?"** If yes, NEPA + NHPA + ESA
   apply. If no, only state and local apply. This is the single most
   common student confusion.
3. **CE C-8 as the BEAD default.** Teach **C-8** by name as the
   categorical exclusion most BEAD fiber builds rely on, then teach
   the *extraordinary circumstances* checklist (T&E species, historic
   properties, sensitive habitat, migratory birds, traditional cultural
   properties) as the list of things that *break* the CE.
4. **Section 106 = 30 days, but only after adequacy.** Cite the 30-day
   SHPO comment window from the NTIA fact sheet, then warn students
   that the clock only starts when the initiation letter is *adequate*
   — incomplete packets reset the clock.
5. **Bats deserve a dedicated callout.** A one-paragraph callout on
   NLEB / tricolored / Indiana bat with a link to USFWS IPaC. This is
   the single most common ESA trigger for OSP fiber and students who
   have never seen the IPaC tool will fail their first project.
6. **AutoCAD as the *permit* tool, GIS as the *operational* tool.**
   Frame the two systems as complementary, not competing. Show one
   real example of each: Lumen's CAD standards (carrier-side) and
   Pleasanton's digital submittal requirements (city-side).
7. **GIS-as-permit-deliverable is a *trend*, not a *standard*.** Do
   not tell students "your city accepts KMZ." Tell them: check the
   city's published submittal requirements, and assume a stamped PDF
   is also required.
8. **Make-ready timeline as a project-management lesson.** Teach the
   FCC pole-attachment timeline (10/3/15/45/etc. day milestones) as
   a *schedule* the student must defend in a project plan, not a rule
   to memorise. Use the CT Mirror / Pew material as the field-reality
   counterweight.
9. **Cite per-paragraph, not per-document.** Every claim about a
   timeline, a CE number, or a SHPO comment window names its source
   inline. The Red Team should be able to verify each sentence by
   following the URL in the same paragraph.
10. **Mark all uncertain values.** Same posture as Module 2: any
    value the author is not 100% sure of is tagged
    **UNVERIFIED-needs-paid-doc** (paid docs here are mainly the BICSI
    OSPDRM 6e and any state-specific manuals behind a paywall) or
    **VERIFIED-via-secondary-source**, never silently shipped.
