# Module 5 — Networking Blueprints (ISP) research log

> Curriculum Architect (Agent A) research notes for the OSP/ISP/Splicing
> training platform. Audience: Agent C (Red Team / QA). Tag every numerical
> claim per the editorial constraints (VERIFIED-public-source /
> VERIFIED-via-secondary-source / UNVERIFIED-needs-paid-doc). Goal of this
> module: prepare students for the ISP / structured-cabling content tested in
> BICSI RCDD, the ISP-adjacent material in BICSI OSP, and the building-side
> portions of FOA CFOS/I.

---

## 0. Terminology: why we call this module "Networking Blueprints"

The platform's editorial brand uses **"Networking Blueprints"** as the title of
this module rather than the conventional "ISP" (Inside Plant). Reasoning:

1. **ISP collision with Internet Service Provider.** In every
   non-telecommunications discipline a student walks in with — IT, software,
   procurement, executive — "ISP" reads as Comcast, Verizon, AT&T. Every
   intake survey on the platform bears this out: students arrive expecting a
   module on *carriers*. We rebrand to remove that confusion before the first
   lesson.
2. **The actual subject is the inside-the-building cabling and spaces
   blueprint.** A telecom contractor reads architectural drawings, marks up
   pathways and rack elevations, and produces a structured-cabling design.
   "Networking Blueprints" describes that deliverable directly.
3. **Field still says ISP.** The platform always teaches the field
   vocabulary alongside the platform vocabulary. Module copy reads, on first
   use: *"Networking Blueprints (what BICSI and the field call **ISP** —
   Inside Plant — not to be confused with Internet Service Provider)."*

This is part of the editorial principle in the
`docs/field-vs-textbook-research.md` file: textbook and field practice diverge
and both must be presented. The terminology divergence is itself an example of
that principle.

---

## 1. Standards & official sources consulted

### 1.1 TIA family (paid; cited indirectly)

The TIA structured-cabling standards are paywalled. We use vendor and
training-house summaries for the numerical citations.

- **ANSI/TIA-568.0/.1/.2/.3 (current letter revisions: -E for the .0/.1/.2
  family, -D for .3).** Defines generic and commercial-building cabling,
  balanced twisted-pair, and optical fiber. Public summary: Anixter
  *Standards Reference Guide*
  (`https://corpapps.anixter.com/DocLib1/BCV9E8ZP/$file/8W0091X0_IA_Stand_Ref_Guide.pdf`),
  Wikipedia ANSI/TIA-568, FOA's TIA-568-C primer page
  (`https://www.thefoa.org/tech/ref/premises/TIA568C.html`), Fiber Optics Tech
  Consortium summary
  (`https://www.tiafotc.org/tia-standards-update/tia-568-1-e/`). [VERIFIED-via-secondary-source]
- **ANSI/TIA-569 (current revision -E).** Pathways and spaces. Public
  summary: Fiber Optics Tech Consortium update
  (`https://www.tiafotc.org/tia-standards-update/tia-569-e/`), Cabling
  Installation & Maintenance article on -E publication
  (`https://www.cablinginstall.com/standards/article/14035859/tia-569-e-telecom-pathways-and-spaces-standard-published`),
  Telecom Trend Watch -C summary. [VERIFIED-via-secondary-source]
- **ANSI/TIA-606-D (October 2021).** Administration, labeling, and
  identifier scheme (4-class system). Public summaries: Brady, DuraLabel,
  AnD Cable Products Medium post, Silver Fox Labeling guide. [VERIFIED-via-secondary-source]
- **ANSI/TIA-607-D (July 2019)** *Generic Telecommunications Bonding and
  Grounding (Earthing) for Customer Premises*. Critical revision: TIA-607-D
  renamed the busbars — TMGB → **PBB (Primary Bonding Busbar)**, TGB →
  **SBB (Secondary Bonding Busbar)**. Public summaries: PDU Cables "Ken's
  Korner" `https://www.pducables.com/kens-korners/2019/08/tia-607-d-latest-revision/`,
  ITSWired blog. TIA also published **607-E** later — the most recent
  (`https://tiaonline.org/standardannouncement/tia-publishes-new-standard-ansi-tia-607-e-generic-telecommunications-bonding-and-grounding-earthing-for-customer-premises/`).
  [VERIFIED-via-secondary-source]
- **NECA/BICSI 607-2011** *Standard for Telecommunications Bonding and
  Grounding Planning and Installation Methods for Commercial Buildings* —
  free PDF at `https://aux.bicsi.org/om/NECA-BICSI-607-2011.pdf`. Useful for
  installation-method numbers (busbar dimensions, conductor sizing tables)
  even though the parent TIA-607 standard is paid. [VERIFIED-public-source]

### 1.2 BICSI (paid except for selected standards)

- BICSI TDMM 15th Edition (paid, $$$). Cited only via published excerpts.
  Critical numbers we currently lift from secondary sources (room sizing,
  TR areas) need Red Team verification.
- BICSI OSP Design Reference Manual (paid). Used by BICSI OSP exam.
- BICSI Standards FAQ (free):
  `https://www.bicsi.org/standards/bicsi-standards/resources/standards-frequently-asked-questions`.

### 1.3 FOA (free, primary)

- FOA Reference for Premises Cabling (TIA-568-C primer):
  `https://www.thefoa.org/tech/ref/premises/TIA568C.html`. [VERIFIED-public-source]
- FOA Reference Guide to Premises Cabling (`https://www.thefoa.org/`,
  premises section). [VERIFIED-public-source]
- FOA Lesson Plan: Fiber Optic Network Design
  (`https://www.fiberu.org/Design/index.html`). [VERIFIED-public-source]

### 1.4 Vendor whitepapers (free)

- Anixter Standards Reference Guide (multi-section PDF). Comprehensive
  table of TIA distance limits, room sizes. [VERIFIED-public-source]
- CommScope *Bonding and grounding NETCONNECT copper cabling systems*
  whitepaper, `https://www.commscope.com/globalassets/digizuite/2075-bonding-and-grounding-netconnect-copper-cabling-systems-wp-111199-en.pdf`. [VERIFIED-public-source]
- Panduit grounding/bonding kit literature.
- Belden cabling reference cards (`https://www.belden.com`).
- Leviton structured-cabling design guides.
- Fluke Networks "101 Series" articles for testing/verification.

### 1.5 Public agency / institutional design guides (excellent sanity-check)

- Montana State University UIT *Wiring Guidelines: Rooms*
  `https://www.montana.edu/uit/wiringguidelines/rooms.html`. [VERIFIED-public-source]
- Fresno State *Telecommunications Infrastructure Design Standards v11*
  PDF. [VERIFIED-public-source]
- LSU *Communications Equipment Rooms* spec section 271100. [VERIFIED-public-source]
- University of Alberta *Telecommunications Room Requirements & Standards
  v3.2*. [VERIFIED-public-source]
- WSU *Telecommunications Distribution Design Guide* (June 2015 PDF). [VERIFIED-public-source]
- UNM IT *Grounding and Bonding for Communication Systems* spec. [VERIFIED-public-source]

These institutional guides cite TIA numbers directly and are written by
licensed RCDDs. They are the single most useful resource for confirming a
TIA number when we cannot read the standard ourselves.

---

## 2. Forums & community practice

- Reddit r/cabling — recurring "MDF vs IDF, what's the actual difference"
  threads. Field consensus paraphrase: in a single building most techs say
  "the MDF is where the demarc lives and the IDF is the closet on each
  floor." Outside the BICSI canon, "MDF" and "IDF" are used as roles, not
  the formal TIA names (Equipment Room / Telecommunications Room /
  Telecommunications Enclosure). [UNVERIFIED-needs-deep-link]
- Reddit r/networking — "What's an IDF actually?" Paraphrase: IT-side
  network engineers learn the terms MDF/IDF on the job and rarely read
  TIA-569; the term "wiring closet" is still used as a synonym for IDF.
- Reddit r/RCDD — small subreddit but high-signal. Recurring topic:
  "TIA-607-D renamed TMGB/TGB to PBB/SBB but everyone still says
  TMGB/TGB on drawings." Field practice routinely lags the standard by
  a revision. [UNVERIFIED-needs-deep-link; see TIA-607-D note in §3.4.]
- Reddit r/fiberoptics + r/HomeNetworking — frequent posts about
  90 m / 100 m horizontal limit being "broken" by techs running 110 m or
  more. Paraphrase: it usually works because the 90/100 split is a margin,
  not a cliff, but the test will fail certification.
- BICSI Community boards (members-only). Useful for RCDD-prep
  cross-checks: candidates discussing whether 568.0-E or 568.1-E governs a
  particular generic vs. commercial scenario.
- certforums.co.uk — UK practitioners. Value: mirror of US forums for
  identifying which gaps are universal vs. US-specific (e.g., grounding
  practice in UK refs ITU-T K-series alongside BS 6701, not TIA-607).
- Cabling Installation & Maintenance editorial archive
  (`https://www.cablinginstall.com`) — best free industry-press source on
  TIA standard revisions, including 569-E and 606-D publication articles
  used above.

> Red Team note: same caveat as Module 4 — the Reddit paraphrases are
> patterns-of-discussion, not single-post quotes. Tag every Reddit entry
> UNVERIFIED-deep-link-pending.

---

## 3. Field vs. textbook gaps (with concrete examples)

### 3.1 MDF vs. IDF vs. the TIA names

| Source class | Term | Notes |
|---|---|---|
| TIA-568.1 / TIA-569 (paid; per Anixter and FOA summaries) | Equipment Room (ER), Main Cross-connect (MC), Intermediate Cross-connect (IC), Horizontal Cross-connect (HC), Telecommunications Room (TR), Telecommunications Enclosure (TE), Entrance Facility (EF) | These are the formal names in the standard. |
| BICSI / RCDD vocabulary | Same as TIA, plus distributor levels (Main Distributor, Intermediate Distributor, Floor Distributor) borrowed from ISO/IEC 11801 | RCDD candidates must know both. |
| Field / IT vocabulary | "MDF" (Main Distribution Frame), "IDF" (Intermediate Distribution Frame), "BDF" (Building Distribution Frame), "wiring closet", "comm closet", "telecom closet" | Universal in conversation, drawings, BOMs, RFPs. The TIA standard does not use "MDF" or "IDF" formally. |

**Editorial framing:** module always introduces both. We teach the TIA names
as the *answer on the exam* and the MDF/IDF/BDF names as the *answer on the
job*. The "MDF" lives in the Equipment Room (ER); each "IDF" lives in a
Telecommunications Room (TR). [VERIFIED-via-secondary-source — Anixter,
Montana State UIT, FOA TIA-568-C page.]

### 3.2 Horizontal cabling distance: the famous 90/100 m

- TIA-568 horizontal cable: max 90 m permanent link, plus up to 5 m work-
  area patch and 5 m equipment-room patch, **100 m total channel.** [VERIFIED-via-secondary-source — Anixter, FOA, Wikipedia ANSI/TIA-568.]
- Field reality: the "100 m" limit is a *channel* limit, not a cliff. UTP
  Cat6/Cat6A can often run 110–115 m without obvious failure, but it will
  not certify and it is non-conformant. Module teaches 90/100 m as the
  conformance line and explains why margin exists.
- Combined horizontal + backbone + cords: typically not to exceed 300 m for
  multimode applications using older protocols; this is application-bounded
  rather than cabling-bounded. [VERIFIED-via-secondary-source — Anixter, FOA
  loss budget page.]

### 3.3 Backbone distance, by media

These are *application-dependent*; the cabling standard does not set a
single backbone distance. Numbers below are TIA-568.1 informative
guidance as cited by Anixter and FOA:

- Single-mode fiber backbone: up to 3000 m within the cabling standard's
  scope, but governed mainly by the active application (e.g., 10GBASE-LR
  10 km, 10GBASE-ER 40 km). [VERIFIED-via-secondary-source]
- Multimode fiber backbone OM3/OM4/OM5: 300/550/100 m respectively for
  10GBASE-SR (per IEEE 802.3 ae/by). [VERIFIED-via-secondary-source]
- Balanced twisted-pair backbone (voice grade): up to 800 m. [VERIFIED-via-secondary-source]
- Cross-connect jumpers: MC ≤20 m, IC ≤20 m, equipment cords ≤30 m. [VERIFIED-via-secondary-source — Anixter]

### 3.4 TIA-607: TMGB/TGB vs PBB/SBB — and the field still says TMGB

This is one of the cleanest field-vs-textbook gaps in the platform.

| Era | Standard | Main bonding busbar | Floor/closet bonding busbar |
|---|---|---|---|
| 2002–2015 | TIA-607-A through -B | TMGB (Telecommunications Main Grounding Busbar) | TGB (Telecommunications Grounding Busbar) |
| 2015–2019 | TIA-607-C | TMGB | TGB |
| **2019–present** | **TIA-607-D and -E** | **PBB (Primary Bonding Busbar)** | **SBB (Secondary Bonding Busbar)** |

- Source: PDU Cables "Ken's Korner" 2019 article on TIA-607-D revision;
  TIA announcement of -E. [VERIFIED-via-secondary-source]
- **Field reality:** drawings, RFPs, BOMs, and shop-floor talk still say
  TMGB and TGB, in 2026, for at least three reasons: (a) installed product
  is labeled with the old names; (b) most RCDDs trained pre-2019; (c) the
  acronym change is not breaking — the busbar's spec is the same physical
  object.
- BICSI exam content: has been updated to use PBB/SBB; legacy TMGB/TGB
  may still appear and should be recognized.

### 3.5 Busbar physical specs

| Spec | Value | Tag |
|---|---|---|
| TMGB / PBB minimum thickness | 6.3 mm (1/4 in) | VERIFIED-via-secondary-source — NECA/BICSI 607-2011, EC&M article, multiple uni IT specs |
| TMGB / PBB minimum width | 100 mm (4 in) | VERIFIED-via-secondary-source |
| TMGB / PBB length | variable per design | VERIFIED-via-secondary-source |
| TGB / SBB minimum thickness | 6.3 mm (1/4 in) | VERIFIED-via-secondary-source |
| TGB / SBB minimum width | 50 mm (2 in) | VERIFIED-via-secondary-source |
| TGB / SBB common length | 12 in (off-the-shelf), variable | VERIFIED-via-secondary-source |
| Busbar material | copper, non-anodized, predrilled | VERIFIED-via-secondary-source |
| Connector electrochemical-potential limit (connector to busbar) | <300 mV | VERIFIED-via-secondary-source — TIA-607-B excerpt at wiki.w9cr.net |
| Telecommunications Bonding Backbone (TBB) conductor minimum | 6 AWG copper minimum, sized up with length per NEC Article 250 / TIA tables | UNVERIFIED-needs-paid-doc — exact table is in TIA-607-D, we cite via NECA/BICSI 607-2011 and university specs. |

### 3.6 TIA-569: TR / ER / EF sizing and the famous "165 ft radius"

- TR (Telecommunications Room) center-of-floor placement, with no
  work-area outlet served by that TR more than ~165 ft (50 m) cable run
  from the TR. [VERIFIED-via-secondary-source — multiple uni design guides
  citing TIA-569.]
- TR sizing rule of thumb (cited as TIA / BICSI TDMM):
  - serving area ≤5,000 sq ft → TR 10 × 8 ft
  - 5,000–8,000 sq ft → TR 10 × 9 ft
  - 8,000–10,000 sq ft → TR 10 × 11 ft
  - >10,000 sq ft or runs >295 ft → add another TR. [VERIFIED-via-secondary-source — Tarrant County IT Wiring Closet Standards, BIDMC IS Tel/Data Room req., LSU 271100, WSU TDDG; ultimate primary is BICSI TDMM which is paid.]
- TR door: minimum 910 mm (36 in) wide × 2,000 mm (80 in) high, no sill,
  with lock. [VERIFIED-via-secondary-source — uni design guides citing
  TIA-569.]
- TR ceiling: minimum 2,440 mm (8 ft). [VERIFIED-via-secondary-source]
- Equipment Room: sized to known equipment plus future, with an explicit
  growth allowance commonly stated as 50% future expansion. [VERIFIED-via-secondary-source]
- Entrance Facility: must be sized to accommodate the demarc, the
  protector field, and any access-provider equipment; environmental and
  separation requirements (from power, from EMI sources). [VERIFIED-via-secondary-source]

### 3.7 TIA-606-D administration: the four classes

- Class 1: single equipment room, no backbone — small office.
- Class 2: one building, multiple TRs, with backbone.
- Class 3: campus, multiple buildings.
- Class 4: enterprise / multi-site / external connections.

Each level requires more identifier fields. The standard does not mandate a
specific format; it mandates *consistency* and *traceability*. Field
practice usually adopts a vendor template (Brady, Panduit, HellermannTyton,
Silver Fox) and customizes per project. [VERIFIED-via-secondary-source]

### 3.8 EF / ER / TR / TC layout — typical building

- **EF (Entrance Facility):** access-provider demarc enters here. Often the
  same room as the ER in small buildings.
- **ER (Equipment Room):** houses the main cross-connect (MC) and core
  network equipment. The "MDF" of field vocabulary.
- **TR (Telecommunications Room):** one per floor, ideally stacked
  vertically to share a riser. The "IDF" of field vocabulary.
- **TC / TE (Telecommunications Closet / Enclosure):** small, may serve a
  single zone; "TE" appears in TIA-569 as a smaller alternative to a TR.
- **Backbone cabling:** EF → ER → TR(s). Hierarchical star.
- **Horizontal cabling:** TR → work-area outlet, terminating in the
  workstation jack.

### 3.9 Work-area outlets

- Minimum two ports per work area per TIA-568. [VERIFIED-via-secondary-source]
- Mixed-media allowed (UTP + fiber to the same faceplate). [VERIFIED-via-secondary-source]
- T568A or T568B pinout — TIA recommends T568A; 568B is also conformant
  and widely used in the US, especially commercial. Module teaches both
  and shows the colour-pair ordering side by side. [VERIFIED-via-secondary-source]
- Work-area cord length: max 5 m. [VERIFIED-via-secondary-source]

### 3.10 Bonding-conductor sizing

NECA/BICSI 607-2011 (free) and university IT specs cite a sliding scale
for the TBB (Telecommunications Bonding Backbone) and the BCT (Bonding
Conductor for Telecommunications) based on length. We currently teach
6 AWG minimum and recommend reading TIA-607-D Table for the actual
length-vs-AWG mapping; module ships with UNVERIFIED tag on specific gauge
numbers until Red Team confirms.

---

## 4. Open questions for Red Team / user

1. **TIA-607-D conductor sizing table.** Need the exact AWG-vs-length
   table for TBB sizing. NECA/BICSI 607-2011 has *a* table; need to confirm
   whether 607-D's is identical or revised.
2. **TIA-569-E pathway numbers.** The 165 ft / 50 m rule and the door
   dimensions are widely cited but may have shifted between -C, -D, and -E.
3. **TR sizing tables.** The 10 × 8 ft / 10 × 9 ft / 10 × 11 ft scale is
   in the BICSI TDMM and gets re-cited in every university IT spec we
   read. Confirm against the current TDMM 15th edition.
4. **TIA-606-D identifier minimum-field list.** We teach the four-class
   model; the standard also specifies which ID fields are mandatory at
   each class. Need to confirm exactly.
5. **PBB/SBB rename — has the field caught up by 2026?** Reddit and
   forum signal says no. Recommend module continues to teach both.
6. **ANSI/TIA-568.0-E vs 568.1-E split.** Is "Generic" .0 informative or
   normative when commercial .1 also applies? Anixter glosses this; the
   standard itself is paid.
7. **Reddit deep-links.** Same as Module 4 — every Reddit paraphrase
   needs a URL+date.
8. **BICSI ITSIMM and OSP DRM.** Both paid. Currently we are using
   secondary cites only.

---

## 5. Recommended editorial defaults for the module

1. **Always introduce dual vocabulary.** Every TIA term is paired with the
   field term: ER/MDF, TR/IDF, MC/main cross-connect, HC/horizontal
   cross-connect, work-area outlet/jack/data drop. Always name the module
   "Networking Blueprints (ISP)" on first use.
2. **Always teach the 90/100 m rule as a *certification* rule, not a
   physics cliff.** Show the breakdown: 90 m permanent + 5 m work-area
   cord + 5 m equipment cord = 100 m channel.
3. **Always include the TIA-607-D rename explicitly.** Teach PBB/SBB as
   the current names and TMGB/TGB as the names still on drawings. Show a
   busbar photo with the legacy "TMGB" stamp.
4. **Busbar dimensions taught as:** PBB ≥6.3 mm × 100 mm; SBB ≥6.3 mm ×
   50 mm; copper, non-anodized, predrilled, insulated standoffs. Tag the
   <300 mV electrochemical-potential rule as an exam favorite.
5. **Teach the four-class TIA-606-D administration model** with a worked
   example identifier (e.g., `01-A-12-3` = building 01, floor A, rack 12,
   port 3) as a starter scheme that the student adapts to project.
6. **TR / ER / EF / TE diagram.** A single building floor plan with all
   four spaces called out; include the 165 ft / 50 m radius circle from
   the TR center.
7. **Backbone vs horizontal.** Always teach as a hierarchical star —
   EF→ER→TR(s)→work-area — with backbone (vertical) vs horizontal as the
   two cabling subsystems.
8. **Work-area outlet defaults.** Teach 2-port minimum, T568A as the
   recommended pinout (TIA preference), T568B as the still-common US
   alternative, and explicitly call out that mixing A and B ends on the
   same cable creates a crossover.
9. **Grounding/bonding conductor sizing** taught as: 6 AWG copper
   absolute minimum for TBB (NECA/BICSI 607-2011), but module ships with
   the AWG-by-length table tagged UNVERIFIED until Red Team confirms
   against TIA-607-D.
10. **Exam-vs-job framing.** End each lesson with two callouts: "On the
    BICSI/RCDD exam, the answer is X" and "On site, the contractor will
    say/do Y." This is the platform's editorial signature — never silently
    erase the divergence.
