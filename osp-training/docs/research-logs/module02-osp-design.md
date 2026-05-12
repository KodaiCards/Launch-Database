# Module 2 — OSP Design research log

> Author: Curriculum Architect (Agent A). Audience: Red Team / QA (Agent C).
>
> Editorial principle: textbook answers (NESC IEEE C2 2023, BICSI OSPDRM 6th,
> TIA-758-C) and field practice diverge constantly in OSP. This document
> records what was used, what was inferred from secondary sources, and what
> still needs a paid standards purchase to nail down. Numbers are tagged as
> **VERIFIED-public-source**, **VERIFIED-via-secondary-source**, or
> **UNVERIFIED-needs-paid-doc**. The author does not type NESC table values
> from memory.

---

## 1. Standards & official sources consulted

The primary standards governing Module 2 — NESC IEEE C2-2023, BICSI OSPDRM
6th, and TIA-758-C — are all paywalled. Every claim below is therefore
either (a) drawn from a public summary of the standard, (b) drawn from a
utility's own design manual that reproduces or paraphrases the standard,
or (c) flagged as needing the paid document.

### 1.1 NESC (IEEE C2-2023)

- **Authoritative landing page** —
  https://standards.ieee.org/ieee/C2/10814/ — confirms the 2023 edition,
  scope (overhead and underground supply and communication lines, work
  rules), and major revisions including communications/wireless clearance
  clarifications (revised Rule 235H, new Rule 238F for wireless on poles).
  **VERIFIED-public-source** for scope and edition; **does not** print
  table values.
- **IEEE summary / what changed** —
  https://innovate.ieee.org/national-electrical-safety-code-2023/ — used
  for high-level "what's new in 2023" framing (Rule 235H revised, Rule
  238F new, communication-space clarifications).
- **Wikipedia summary** —
  https://en.wikipedia.org/wiki/National_Electrical_Safety_Code — useful
  for the overall structure (Parts 1–4, Sections 230–290 cover overhead
  lines, etc.), but should never be a primary citation in module text.
- **Public ATIS slide deck (Bowmer / Gallo, 2024)** —
  https://peg.atis.org/wp-content/uploads/2024/04/09-National-Electrical-Safety-Code-NESC-Trevor-Bowmer-Bunya-Telesom-Consulting-Ernie-Gallo-NEBScore.pdf
  — vendor-neutral overview suitable for student-facing framing of NESC's
  role.
- **Application Guide for 2023 NESC Table 232-1 (GDS Associates / Hi-Line)** —
  https://www.gdsassociates.com/wp-content/uploads/2022/11/Hi-Line-NESC-2023-Clearance-Charts.pdf
  — secondary publication of the Table 232-1 clearance chart structure.
  **VERIFIED-via-secondary-source** for the *shape* of the table (what
  rows/columns exist); the absolute numbers in the table itself are still
  copyrighted NESC content and the public PDF should be re-checked, not
  paraphrased into module text wholesale.
- **NY State Department of Public Service Rule 232 excerpt** —
  https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BD265F620-E060-4AEB-B79F-8297FC735926%7D
  — a state regulator's reproduction of NESC Rule 232 vertical-clearance
  text. **VERIFIED-via-secondary-source** for Rule 232 structure.
- **Kerrville PUB NESC info sheet** —
  https://www.kpub.com/wp-content/uploads/2021/03/KPUB-NESC-Info.pdf —
  utility-published clearance sketches consistent with NESC.

### 1.2 Pole loading, grades of construction, weather districts

- **ikeGPS, "NESC Grades of Construction"** —
  https://ikegps.com/ikewire/nesc-grades-of-construction/ — used for
  Grade B vs Grade C application framing (Grade B for railroad/highway
  crossings and higher-consequence locations; Grade C for typical
  distribution and joint-use). Note: the utility-vendor blog cites
  numerical safety factors (commonly framed as "4-to-1 for Grade B,
  2-to-1 for Grade C"), which is a *paraphrase* of NESC Section 26 load
  and strength factors. **UNVERIFIED-needs-paid-doc** for the exact load
  and strength factor matrix in NESC IEEE C2-2023 Section 26.
- **ikeGPS, "NESC Weather Loadings"** —
  https://ikegps.com/ikewire/nesc-weather-loadings/ — used for the three
  loading districts (Heavy / Medium / Light) and Rule 250B/250C/250D
  framing. Districts and the existence of radial-ice + concurrent-wind
  loading are public knowledge; the *exact* radial-ice thicknesses and
  wind pressures per district are NESC Table 250-1 values. The widely
  republished "½ in / ¼ in / 0 in radial ice with 4 / 4 / 9 psf wind"
  appears in multiple secondary sources but Module 2 should cite "Per
  NESC Rule 250B, Table 250-1 (paid)" rather than reproducing the table.
  **VERIFIED-via-secondary-source** for district names + concept;
  **UNVERIFIED-needs-paid-doc** for the table values to be quoted as
  authoritative.
- **USDA Rural Utilities Service, Bulletin 1724E-150** —
  https://www.rd.usda.gov/files/UEP_Bulletin_1724E-150.pdf — federal
  design bulletin for electric distribution. Useful as a public reference
  for pole-loading methodology (RUS adopts NESC).
- **Powline.com "Loadings and Structure Groups" handout (Clark, 2013)** —
  https://www.powline.com/usrgroup/madison13/handouts/Loadings_and_Structure_Groups.pdf
  — engineering-class slide deck on NESC loading; secondary, but
  consistent with the IEEE/ikeGPS framing.
- **ASCE Practice Periodical, "New NESC Extreme Ice Loading"** —
  https://ascelibrary.com/doi/10.1061/(ASCE)1084-0680(2009)14:1(36) —
  abstract is public; cites Rule 250D as the extreme-ice-with-concurrent-
  wind district map. Useful as a peer-reviewed pointer that 250D exists,
  not as a source for the values themselves.

### 1.3 Joint-use poles and pole attachment

- **NRECA "Guide for the Application of Clearance Requirements on
  Joint-Use Poles" (May 2025)** —
  https://www.cooperative.com/people-networking/tdec/Documents/Guide-for-the-Application-of-Clearance-Requirements-on-Joint-Use-Poles-May-2025.pdf
  (the URL returned 403 to WebFetch this session but is a known public
  NRECA document). Treated as the most useful secondary source for joint-
  use clearance application; Red Team should pull the live PDF.
- **OJUA "Joint Inspection Best Practices" (2012 NESC reference)** —
  https://www.ojua.org/wp-content/uploads/2017/02/Joint-Inspection-Best-Practices-v-1.2-2017-1-9.pdf
  — useful for inspection workflow and what each attaching party is
  responsible for. Predates 2023 NESC; framing still valid, numbers
  should be re-checked against 2023.
- **Alden Systems, "Difference in Power Space and Communication Space"** —
  https://info.aldensys.com/joint-use/the-difference-in-power-space-and-communication-space-in-the-race-to-attach
  — used for the supply / neutral / communication zone framing.
- **ikeGPS, "Communication Worker Safety Zone"** —
  https://ikegps.com/ikewire/communication-worker-safety-zone/ — public
  summary stating the **40-inch** minimum supply-to-communication
  separation at the pole. **VERIFIED-via-secondary-source.**
- **North Central Electric "NESC Communication Clearance Guide"** —
  https://northcentralelectric.com/files/NESC%20Communication%20Clearance%20Guide.pdf
  — public utility leaflet. Notes a permitted reduction (commonly stated
  as 30 in. midspan if the communication messenger is bonded to the
  neutral) — historical NESC language predating the 1987 edition. The
  utility leaflet is **VERIFIED-via-secondary-source** for the
  bonded-messenger reduction concept; the *current* NESC 2023 number
  must be re-checked.
- **Chelan PUD pole attachment standards** —
  https://www.chelanpud.org/docs/default-source/default-document-library/ccpud-pole-attachment-construction-standards.pdf
  — public utility design manual; useful as a real-world example of how
  a utility translates NESC into its own attachment policy.
- **We Energies / WPS joint-use standards (JU10)** —
  https://www.we-energies.com/joint-use-management/ju-standards/JU10markup-full-version.pdf
  — Wisconsin investor-owned utility's published joint-use book.
- **Oncor Joint Use Standards Section 103** —
  https://www.oncor.com/content/dam/oncorwww/documents/about-us/electric-distribution-system/joint-use-management/Oncor%20Joint%20Use%20Standards%20-%20Section%20103%20(10-16-2023).pdf.coredownload.pdf
  — Texas IOU published joint-use standards.
- **Appalachian Power Pole Attachment Policy (2025)** —
  https://www.appalachianpower.com/lib/docs/business/b2b/APCO_Pole_Attachment_Policy.pdf
- **Tacoma Public Utilities pole attachment requirements** —
  https://www.mytpu.org/wp-content/uploads/C-OH-1060-Attach-Reqs-for-Telecom-240628.pdf

### 1.4 Aerial vs underground, and FOA OSP reference

- **FOA OSP Construction — Aerial Cable Installation** —
  https://www.thefoa.org/tech/ref/OSP_Construction/Aerial%20Cable%20Installation.html
  — public, free, attribution-only. Module 2's go-to public source for
  field-side aerial guidance. Notes the "less than 2% sag" and "less
  than 30% of MBS tension" guidance. **VERIFIED-public-source.**
- **FOA OSP Construction — Underground Installation** —
  https://foa.org/tech/ref/OSP_Construction/Underground_Installation.html
- **FOA Aerial Workmanship** —
  https://www.foa.org/tech/ref/OSP_Construction/Aerial_Workmanship.html
- **FOA 2025 Installation Standard PDF** —
  https://www.thefoa.org/tech/ref/1pstandards/FOA%20Installation%20Standard%202025%20V1.pdf
- **Electrical Contractor Magazine, "Looking Good!"** —
  https://www.ecmag.com/magazine/articles/article-detail/looking-good!-guidelines-for-aerial-fiber-optic-cable-installation
  — magazine-grade summary of aerial workmanship, useful as a citable
  public secondary.
- **Cartesian / Fiber Broadband Association cost report (covered by
  Fierce Network)** —
  https://www.fierce-network.com/broadband/underground-fiber-drives-deployment-costs
  — **VERIFIED-public-source**: median underground cost ≈ **$16.25/ft**
  (2x aerial median ≈ **$6.49/ft**). Refreshed values cited as ≈ $18/ft
  underground vs ≈ $8/ft aerial.
- **Lanshack, "Fiber Installation Costs: Real Numbers"** —
  https://www.lanshack.com/Underground-vs-Aerial-Installation — vendor
  blog, secondary corroboration.
- **CTC Technology Santa Cruz FTTP cost estimate (2015)** —
  https://www.tellusventure.com/downloads/santacruz/ctc_santa_cruz_ftth_estimate_may2015.pdf
  — older but still cited public benchmark from a respected consultancy.

### 1.5 Right-of-way / easements

- **MRSC "Easements" reference** —
  https://mrsc.org/explore-topics/facilities/rights-of-way/easements
  — local-government-association public reference; clean public-source
  for the ROW vs easement distinction.
- **Hutchinson Cox "Law of Easements in Oregon"** —
  https://www.eugenelaw.com/resources/blog/easement-law-guide — used
  for prescriptive-easement framing.
- **Gateway Fiber and Ziply Fiber consumer-facing easement explainers**
  — https://www.gatewayfiber.com/blog/understanding-easements-and-right-of-ways
  and https://ziplyfiber.com/blogs/article/utility-easement — useful as
  examples of how providers explain ROW to homeowners; not authoritative.

---

## 2. Forums & community practice

WebFetch was blocked from Reddit in this session, and Google's
`site:reddit.com` queries returned no hits via the available WebSearch
backend. Forum references below are therefore drawn from Google-indexed
threads on adjacent professional forums (Mike Holt, Quora, IAEI Magazine
discussion sites, Autodesk community), plus Reddit references that the
Red Team will need to follow up on directly. Each thread is logged with
URL, approximate date, and a short paraphrase of what it says about
field practice.

- **Mike Holt forum, "underground fiber optic conduit"** —
  https://forums.mikeholt.com/threads/underground-fiber-optic-conduit.6578/
  — long-running electrician thread (multiple years). Key paraphrase:
  fiber-optic conduit sizing in the field is dominated by *future-proofing*
  (oversize for re-pull), not by a strict ratio rule. Field practice on
  pull tape, lubricant choice, and bend radius is heavily contractor-
  dependent. Tells us: the textbook 40% conduit fill rule is a planning
  ceiling, not how crews actually pick conduit size.
- **Mike Holt forum, "Fiber Install Question"** —
  https://forums.mikeholt.com/threads/fiber-install-question.141261/ —
  electrician/low-voltage discussion of bend radius, mule-tape pulls,
  and joint occupancy with power. Field consensus: keep fiber on its
  own innerduct or its own conduit even when not strictly required.
- **Mike Holt forum, "how do you calculate conduit sizes for Fiber"** —
  https://forums.mikeholt.com/threads/how-do-you-calculate-the-sizes-of-a-conduit-for-fiber.124546/
  — discussion confirms most installers fall back to a vendor-supplied
  jam-ratio / fill-ratio rule of thumb rather than computing it cleanly.
- **IAEI Magazine, "This Pole Is Not Big Enough for Both of Us"
  (Sept 2000)** —
  https://iaeimagazine.org/2000/2000september/this-pole-is-not-big-enough-for-both-of-us/
  — older but the author is an electrical inspector; explains the
  inspector-side view of joint-use disputes. Field paraphrase: real
  joint-use disputes are 90% about *who pays for make-ready*, not
  about whether the clearance is achievable.
- **Autodesk community, "Symbols for Fiber Optic Network diagramming"** —
  https://forums.autodesk.com/t5/autocad-electrical-forum/symbols-for-fiber-optic-network-diagramming/td-p/8343712
  — practitioners ask why AutoCAD ships no native OSP block library;
  the answer in practice is "every shop builds its own or buys a 3rd
  party set." Tells us the textbook diagram in BICSI OSPDRM is *not*
  what an OSP designer's screen actually looks like.
- **Quora, "Can you pull a fiber optic cable through a conduit?"** —
  https://www.quora.com/Can-you-pull-a-fiber-optic-cable-through-a-conduit
  — illustrative of the gulf between the textbook answer (yes, observe
  bend radius and tension) and the field reality (innerduct, lubricant,
  pull tension monitoring, sometimes air-blow instead).
- **Reddit r/fiberoptics, r/telecom, r/RCDD — Red Team to verify** —
  WebFetch blocked Reddit at fetch time. Threads referenced indirectly
  via the FOA, ikeGPS, and Katapult posts above. Specific recurring
  themes the Red Team should search for: (a) "make-ready timeline pain"
  threads — universal field complaint that pole owners delay surveys
  for months; (b) "midspan sag" threads — crews quoting their internal
  sag tables, not NESC numbers; (c) "communication worker safety zone"
  threads — periodic confusion about whether the 40 in. is at-pole or
  at-midspan and what bonding does to the allowed reduction.

---

## 3. Field vs. textbook gaps (with concrete examples)

### 3.1 Vertical clearance over roads (Rule 232 territory)

| Source | Approximate value | Tag |
|---|---|---|
| NESC 2023 Table 232-1 (paid) | Specific clearance varies by surface (road, rail, pedestrian-only), conductor type, and voltage class | **UNVERIFIED-needs-paid-doc** |
| Public secondary summaries (Katapult, ikeGPS, utility leaflets) | Communication cables over roads commonly cited at **15.5 ft** to ground; **9.5 ft** over pedestrian-only areas | **VERIFIED-via-secondary-source** |
| Field practice | Crews target a buffer above NESC minimum (often 1–2 ft of margin) to absorb seasonal sag and re-grade | Field rule of thumb; not a standard |

**Editorial gap:** Module 2 must not print the NESC table in module text.
It must cite the rule (232) and the secondary source (Katapult or
utility manual) for the planning value, and tell students the AHJ may
require more.

### 3.2 Communication-to-supply vertical separation at pole

| Source | Value | Tag |
|---|---|---|
| NESC 2023 (Rule 235 family, paid) | Minimum vertical separation between supply <8.7 kV and communication on a joint-use pole | **UNVERIFIED-needs-paid-doc** for exact 2023 wording |
| ikeGPS / Alden / utility manuals | **40 in.** (often cited as the "communication worker safety zone") | **VERIFIED-via-secondary-source** |
| North Central Electric leaflet | Reduced separation (commonly cited as **30 in.** midspan when communication messenger is effectively bonded to the supply neutral) — historical NESC concept | **VERIFIED-via-secondary-source** for the *concept*; current 2023 number to be re-checked |
| Field practice | Many CLEC contractors install at the lowest legal point in the comm space and let the utility's own attacher worry about supply-side spacing — *until* an audit says otherwise | Field rule of thumb |

### 3.3 Grades of construction (Grade B vs Grade C)

- Textbook (NESC framing): Grade B for crossings and higher-consequence
  locations (railroad, limited-access highway); Grade C for normal
  distribution and joint-use.
- Public secondary safety-factor numbers (ikeGPS): the widely quoted
  "4-to-1 Grade B, 2-to-1 Grade C" is a *colloquial* summary of NESC
  Section 26's load and strength factors and should be treated as a
  teaching aid, not a quote.
  **UNVERIFIED-needs-paid-doc** for the precise 2023 factor matrix.
- Field reality: many utilities default every joint-use pole on a
  trunk corridor to Grade B — not because NESC requires it, but because
  it gives the design margin to keep adding attachers without re-running
  loading later. This is *internal practice*, not standard.

### 3.4 Loading districts (Rule 250)

- Textbook: three districts (Heavy / Medium / Light) per Rule 250B,
  with Rule 250C extreme wind and Rule 250D extreme ice with concurrent
  wind layered on top.
- The radial-ice and wind-pressure values per district are republished
  in many places (utility manuals, line-design textbooks). They appear
  to be widely consistent at "½ in / ¼ in / 0 in radial ice; 4, 4, 9
  psf wind." Module 2 should cite these *via the secondary source* and
  flag that the authoritative table is NESC Table 250-1 (paid).
  **VERIFIED-via-secondary-source.**
- Field reality: in coastal hurricane zones (Gulf, FL Atlantic, parts
  of NC) the AHJ commonly mandates Rule 250C extreme-wind loading on
  top of the district loading. Florida PSC has post-2004-hurricane
  design standards that go beyond NESC minima; Module 2 should call
  this out as the canonical example.

### 3.5 Aerial vs underground cost

- Textbook (BICSI/FOA): aerial is faster and cheaper; underground is
  more reliable and longer-lived; choice is project-specific.
- Public industry data (Cartesian/FBA via Fierce Network):
  - Underground median ≈ **$16.25/ft** (legacy) → **~$18/ft** (recent).
  - Aerial median ≈ **$6.49/ft** (legacy) → **~$8/ft** (recent).
  - **VERIFIED-public-source** via Fierce Network reporting on the
    Cartesian/FBA study.
- Field reality (lanshack and contractor blogs): "aerial is half the
  cost" is roughly right *if* there is no make-ready. Once make-ready
  enters the picture — pole replacement, transfers, and remediating
  prior attachers' violations — aerial cost can equal or exceed
  underground on poorly maintained corridors.

### 3.6 Right-of-way: ROW vs easement vs prescriptive

- Textbook: ROW is the public corridor managed by a municipality / DOT;
  easement is a recorded right to use private land; prescriptive easement
  arises from continuous-open-hostile use over a statutory period (often
  ~10 years, varies by state).
- Field reality: for OSP designers, the practical question is rarely
  "which legal category?" but "do I have a recordable document I can
  hand the AHJ?" Many older fiber routes ride on prescriptive easements
  the original telco established decades ago and the new owner cannot
  produce a clean recorded grant. Module 2 should warn students that
  ROW/easement uncertainty is a permitting blocker more often than a
  design blocker.

### 3.7 Joint-use poles and OTMR

- Textbook (FCC framing): OTMR — One-Touch Make-Ready, FCC 18-111,
  third report — allows a new attacher's approved contractor to perform
  *simple* communication-space make-ready in a single field visit.
  Pole owner has 10 days to accept/reject, must notify existing
  attachers ≥ 3 days before survey.
  **VERIFIED-public-source**: https://docs.fcc.gov/public/attachments/doc-352544a1.pdf
  and https://en.wikipedia.org/wiki/One_Touch_Make_Ready
- Field reality: a meaningful fraction of make-ready jobs disqualify
  for OTMR because they are *complex* (any cable splicing, any work in
  supply space, antennas, or any reasonable expectation of outage),
  and reverting to sequential make-ready can add months. CT Mirror /
  Pew / Benton coverage:
  - https://ctmirror.org/2022/02/24/make-ready-delays-high-speed-fiber-rollouts-michael/
  - https://www.pew.org/en/research-and-analysis/issue-briefs/2025/03/broadband-expansion-may-hinge-on-states-processes-for-attaching-lines-to-utility-poles
  - https://www.benton.org/blog/fcc-adopts-new-pole-attachment-rules-speed-broadband-deployment
  Field paraphrase: "make-ready took longer than the build."

---

## 4. Open questions for Red Team / user

1. **NESC edition target.** The mission brief says students are studying
   for BICSI OSP. The 2025/2026 OSP exam should be keyed to NESC 2023.
   Red Team to confirm exam alignment before Module 2 prints any rule
   numbers. Source to cross-check: BICSI candidate handbook (paid).
2. **Whether to print the 40 in. number.** Multiple public secondary
   sources (ikeGPS, Alden, utility manuals) cite **40 in.** at pole.
   The author's editorial preference is to cite "40 in. (NESC Rule 235
   family, public summaries)" rather than "40 in. (NESC 2023)" so that
   if the Red Team finds a 2023 nuance the wording survives.
3. **District loading values.** Same posture as #2: cite "½ / ¼ / 0 in
   radial ice with 4 / 4 / 9 psf wind, per public summaries of NESC
   Rule 250B Table 250-1" and flag that the authoritative table is the
   paid NESC.
4. **AHJ override examples.** Should Module 2 use Florida (post-2004
   hurricane) and Pacific Northwest (heavy ice) as canonical AHJ
   override case studies? Both have public utility documents; both
   illustrate the principle that NESC is a floor, not a ceiling.
5. **Joint-use vs joint-pole vendor terminology.** OJUA / utilities use
   "joint use"; FCC uses "pole attachment." Pick one for the module's
   primary noun and cross-reference the other.
6. **OTMR worked example.** Worth walking the student through one
   simple OTMR scenario and one scenario that fails the simple-MR test
   and reverts to sequential — that single comparison teaches the gap
   better than reciting rule numbers.

---

## 5. Recommended editorial defaults for the module

1. **No NESC table values typed from memory.** Every clearance, every
   separation, every load factor is either cited via a public secondary
   (utility design manual, ikeGPS post, Katapult blog) or marked
   **UNVERIFIED-needs-paid-doc**. Module text should say "per public
   summaries of NESC Rule X (IEEE C2-2023, paid)" rather than reproduce
   the table.
2. **Lead with Rule numbers, not values.** Teach the student to find
   Rule 232 (vertical clearance), Rule 235 (separation), Rule 250
   (loading), Rule 261 (grades of construction). The exam asks
   conceptual questions about which rule covers what; field work asks
   you to look up the value.
3. **Communication worker safety zone framing.** Use the supply /
   neutral / communication zoned-pole diagram as the first illustration.
   Cite **40 in.** at pole as the canonical separation; tag it
   **VERIFIED-via-secondary-source**.
4. **Loading districts are a map, not a number-list.** Show the Heavy /
   Medium / Light district map (public secondary), then state that the
   exact ice and wind values come from Table 250-1.
5. **Grades of construction as a decision.** Start from "where is this
   structure?" (highway crossing → Grade B, normal joint-use → Grade C);
   then tell students the safety factors come from Section 26 and many
   utilities default to Grade B everywhere as internal practice.
6. **Aerial vs underground as a cost-and-risk tradeoff.** Use the
   Cartesian/FBA $/ft numbers (public, citable) plus a make-ready
   caveat. Give one urban-aerial example, one suburban-underground
   example, one rural-mixed example.
7. **ROW / easement / AHJ.** Three-paragraph treatment: ROW is the
   municipality's corridor; easement is the recorded right to cross
   private land; prescriptive easement is what older telco routes
   actually have. Tell the student they will spend more time on the
   document than the design.
8. **OTMR explained as a *timeline*, not a rule.** The real lesson is
   the FCC 18-111 timeline (10 days, 3 days, 15 days, etc.) and
   the simple-vs-complex split. Use the FCC fact sheet
   (https://docs.fcc.gov/public/attachments/doc-352544a1.pdf) as the
   single citable public source.
9. **Field-vs-textbook callout on every sub-topic.** Every clearance
   number gets a "textbook says / field crews actually do" sidebar.
   This is the editorial promise of the platform.
10. **Citation hygiene.** Every standard cited by year and section
    (e.g., "NESC IEEE C2-2023, Rule 235H"). Every secondary source
    cited by URL. Every field rule of thumb explicitly tagged "field."
