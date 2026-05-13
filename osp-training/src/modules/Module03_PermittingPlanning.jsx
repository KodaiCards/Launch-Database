import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';

/**
 * Module 3 — Permitting & Planning
 *
 * Editorial posture (per docs/research-logs/module03-permitting-planning.md):
 *  - There is no single national standard for municipal ROW permitting.
 *    Timelines and packet requirements cited here come from FCC BDAC Model
 *    Code (public), NTIA BroadbandUSA materials (public), the California
 *    permitting playbook, and the IMMCO blog — all tagged accordingly.
 *  - NEPA categorical exclusion C-8 and extraordinary circumstances are
 *    cited from NTIA's publicly released CE documents.
 *  - SHPO 30-day window is VERIFIED-via-secondary-source (NTIA fact sheet).
 *  - Bat / T&E information is VERIFIED-via-secondary-source (law firm and
 *    consultant summaries; the primary USFWS guidance documents are public
 *    but the research session could not directly confirm all dates).
 *  - AutoCAD workflow framing is from the Lumen Drawing Standards Manual
 *    (public) and the Autodesk community forum thread.
 *  - GIS-as-deliverable framing is from Pleasanton CA (public) and Florida
 *    Turnpike KMZ Standards (public).
 *  - Make-ready timeline is from FCC 18-111 (public) + Pew 2025, CT Mirror,
 *    Benton Institute coverage.
 *  - AHJ override is universal in permitting — stated explicitly throughout.
 */
export default function Module03_PermittingPlanning() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={3}
        title="Permitting & Planning"
        intro="Municipal ROW permits, federal environmental review (NEPA, NHPA, ESA), AutoCAD and GIS workflows as permit deliverables, and make-ready as a project-management timeline problem. Almost nothing on the permitting side is governed by a single citable industry standard — this module teaches the layer cake and the field reality of navigating it."
      />

      <Section title="3.1 The permitting layer cake">
        <p>
          Every OSP fiber project must resolve permitting at multiple layers
          simultaneously. The layers stack from federal down to private:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>Federal</strong> — NEPA environmental review, Section 106
            (NHPA) historic-property review, and ESA Section 7 threatened-and-
            endangered-species consultation. These layers only apply when there
            is a <em>federal nexus</em> — a federal permit, federal funding
            (BEAD, BIP, RDOF, FirstNet, E-Rate), or a federal license.
          </li>
          <li>
            <strong>State</strong> — State DOT right-of-way permits (TxDOT,
            FDOT, Caltrans, etc.), state environmental overlay programs,
            state-level Section 106 processes routed through the State Historic
            Preservation Officer (SHPO).
          </li>
          <li>
            <strong>Municipal</strong> — ROW ordinance, encroachment or
            excavation permit, traffic-control plan, bonding and insurance
            requirements, fee schedules. These vary city to city with no
            national standard.
          </li>
          <li>
            <strong>Private</strong> — Easements, railroad agreements, private
            property crossing licenses. Recorded at the county; not part of
            any public permit process but often on the critical path.
          </li>
        </ul>

        <Callout kind="field" title="The single most important question: is there a federal nexus?">
          If the project takes federal money or requires a federal permit,
          NEPA + NHPA + ESA apply. If not, only state and local layers apply.
          This distinction is where many first-time project managers waste
          weeks — starting an EA when the project has no federal nexus, or
          skipping NEPA when it clearly applies because the grant was accepted.
          Ask the question on day one.
        </Callout>

        <Callout kind="book" title="BEAD specifically touches all four layers">
          NTIA's BEAD program (Broadband Equity, Access, and Deployment) is
          federally funded, so subgrantees must address all four layers.
          NTIA's published NEPA procedures and categorical exclusions (CE)
          are designed specifically for this use case. See Section 3.2.
          Source: NTIA NEPA procedures Federal Register notice, 2024
          (VERIFIED-public-source).
        </Callout>
      </Section>

      <Section title="3.2 Federal environmental review — NEPA, CE C-8, and extraordinary circumstances">
        <p>
          The <strong>National Environmental Policy Act (NEPA)</strong> requires
          federal agencies to evaluate the environmental impact of their actions
          before proceeding. For BEAD and similar broadband grants, NTIA is the
          federal agency. NEPA recognizes three tiers of review:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>Categorical Exclusion (CE)</strong> — a class of actions
            that individually and cumulatively have no significant environmental
            impact and therefore do not require an EA or EIS. The fastest path.
          </li>
          <li>
            <strong>Environmental Assessment (EA)</strong> — a focused analysis
            to determine whether a Finding of No Significant Impact (FONSI) is
            appropriate, or whether a full EIS is required.
          </li>
          <li>
            <strong>Environmental Impact Statement (EIS)</strong> — full review
            for major actions with significant impact. Rare for fiber builds;
            typically measured in years.
          </li>
        </ul>

        <Callout kind="book" title="CE C-8: the BEAD default for most fiber builds">
          NTIA has adopted a set of <strong>47 categorical exclusions</strong>
          for its broadband programs (30 newly established + 6 adopted from
          FirstNet + 11 prior). The CE most BEAD fiber routes rely on is{' '}
          <strong>C-8</strong>, which covers aerial or buried utility /
          communication construction within or adjacent to existing
          rights-of-way. NTIA's published NEPA for BEAD Milestone Schedule
          confirms a 90-day target for CE-eligible projects.
          Source: NTIA Notice of Newly Adopted NEPA Categorical Exclusions
          and Newly Established CEs (VERIFIED-public-source).
        </Callout>

        <p className="mt-2">
          Most project-level NEPA effort is not an EA or EIS — it is{' '}
          <em>demonstrating CE eligibility</em> while ruling out
          "extraordinary circumstances" that would break the CE. NTIA's
          published extraordinary-circumstances list includes:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Threatened or endangered species or critical habitat</li>
          <li>Historic properties listed or eligible for the National Register</li>
          <li>Sensitive habitat (wetlands, floodplains, coastal zones)</li>
          <li>Migratory birds and their nesting habitat</li>
          <li>Traditional cultural properties of Native American tribes</li>
        </ul>

        <Callout kind="field" title="CE eligibility is a checklist, not a given">
          A project that rides entirely in disturbed ROW still has to document
          the extraordinary-circumstances check. If the route touches urban
          tree canopy in NLEB bat range, crosses a wetland, or passes within
          250 feet of a listed building, the CE may not apply without
          additional consultation or project modification. Screening tools:
          NTIA's ESAPTT (Environmental Screening and Permitting Tracking Tool)
          and USFWS IPaC. Run both early.
        </Callout>

        <Callout kind="verify" title="CE C-8 exact wording — confirm against most recent NTIA guidance">
          The controlling text for CE C-8 is in the 2024 NTIA Federal Register
          notice on NEPA procedures. NTIA may issue supplemental guidance or
          waivers. Always confirm the current controlling text from the NTIA
          BroadbandUSA policy page before using CE C-8 in a subgrantee
          environmental determination.
        </Callout>
      </Section>

      <Section title="3.3 Section 106 / NHPA: historic properties and the SHPO clock">
        <p>
          <strong>Section 106 of the National Historic Preservation Act
          (NHPA)</strong> requires federal agencies (and their grantees) to
          take into account the effect of any federal undertaking on properties
          listed or eligible for the National Register of Historic Places. For
          BEAD subgrantees, NTIA is the federal agency of record; the SHPO
          (State Historic Preservation Officer) or THPO (Tribal Historic
          Preservation Officer, on tribal lands) is the consulting party.
        </p>

        <Table
          headers={['Step', 'Responsible party', 'Key timeline', 'Source']}
          rows={[
            ['Initiate consultation — submit initiation letter with route description, APE map, and photos', 'Subgrantee / NTIA', 'As early as possible; runs parallel to CE screening', 'NTIA NHPA Fact Sheet 2024'],
            ['SHPO comment window', 'SHPO', '30 calendar days after adequate submission', 'NTIA Fact Sheet / ACHP procedures (VERIFIED-via-secondary-source)'],
            ['No Historic Properties Affected finding', 'SHPO / NTIA', 'Clock starts on receipt of adequate letter', 'NTIA Section 106 Program Comment Flowchart'],
            ['Adverse effect found — negotiate Memorandum of Agreement (MOA)', 'SHPO + NTIA + ACHP', 'Timeline varies; add 60–90 days minimum', 'ACHP Program Comment Flowchart'],
          ]}
        />

        <Callout kind="book" title="The 30-day window only runs on an adequate package">
          NTIA's NHPA Section 106 Fact Sheet (2024 and 2025 versions) makes
          clear the 30-day SHPO comment window starts only after NTIA
          determines the initiation letter is <em>adequate</em> — meaning it
          includes a defined Area of Potential Effect (APE), supporting photos,
          and any prior records search results. An incomplete letter does not
          start the clock; it gets returned with comments, and the clock starts
          fresh on resubmission. VERIFIED-via-secondary-source.
        </Callout>

        <Callout kind="field" title="The most common outcome — and when it breaks">
          Most fiber routes in disturbed public ROW receive a "no historic
          properties affected" finding, with the SHPO concurring by silence at
          the end of 30 days. The Section 106 process actually slows a build
          when: (1) the route passes through a downtown historic district,
          (2) the route deviates from existing ROW — even a few feet off the
          pavement edge for a utility bore — because that deviation takes the
          project outside the presumed-disturbed area, or (3) the route touches
          a Native American traditional cultural property, which triggers
          THPO consultation and the ACHP Tribal Handbook procedures.
        </Callout>

        <Callout kind="book" title="THPO replaces SHPO on tribal lands">
          Where a fiber route crosses tribal lands, the Tribal Historic
          Preservation Officer (THPO) performs the Section 106 consultation
          role that SHPO performs elsewhere. On non-tribal federal lands that
          may nonetheless affect tribal interests, both SHPO and the relevant
          THPO(s) may be consulting parties. The ACHP Handbook "Consultation
          with Indian Tribes" (June 2021) is the authoritative procedural
          guide. VERIFIED-public-source.
        </Callout>
      </Section>

      <Section title="3.4 ESA: threatened and endangered species, bats, and the IPaC tool">
        <p>
          <strong>Section 7 of the Endangered Species Act (ESA)</strong>
          requires federal agencies to consult with USFWS (or NOAA for marine
          species) when a proposed federal action "may affect" a listed species
          or designated critical habitat. For BEAD subgrantees, NTIA is the
          federal agency; the subgrantee documents the screening.
        </p>
        <p className="mt-2">
          For OSP fiber builds, the most common ESA trigger in the eastern and
          central United States is <strong>bat species</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>Northern Long-Eared Bat (NLEB)</strong> — reclassified as
            Endangered in 2022 (was Threatened). Range covers most of the
            eastern half of the U.S. Urban tree canopy qualifies as roost
            habitat.
          </li>
          <li>
            <strong>Tricolored Bat</strong> — proposed Endangered as of 2022.
            Range covers roughly the eastern two-thirds of the U.S.
          </li>
          <li>
            <strong>Indiana Bat</strong> — listed Endangered since 1966. Range
            covers roughly the eastern half of the U.S.
          </li>
        </ul>
        <p className="text-[11px] text-slate-400 mt-1">
          Species status and listing dates per USFWS program pages and
          secondary sources (law firm and environmental-consultant summaries,
          October 2024). VERIFIED-via-secondary-source.
        </p>

        <Callout kind="field" title="Tree-clearing windows — the most common project-level mitigation">
          The dominant ESA mitigation for fiber OSP is <strong>time-of-year
          tree-clearing restrictions</strong> that protect bat pup season.
          Commonly cited avoidance windows run approximately June 1 – July 31
          for the core pup period, with broader avoidance sometimes framed
          April – October in certain states and ranges. The exact project-
          specific dates come from the USFWS <strong>IPaC range-wide DKey</strong>
          — a public online tool that generates species-specific guidance when
          you enter your project footprint. Run IPaC early; the dates it
          returns are not generic and can differ by county.
          VERIFIED-via-secondary-source (multiple law-firm and consultant
          summaries, October 2024 USFWS final guidance).
        </Callout>

        <Callout kind="field" title="Urban tree canopy is not a safe harbor">
          Students often assume ESA bat triggers only apply to "wild" corridors.
          In practice, urban and suburban tree canopy in NLEB range qualifies
          as roost habitat. Aerial route make-ready involving tree trimming or
          removal in a city — not just in a forest — can be an NLEB/tricolored
          bat trigger. Check IPaC for your county before any tree-clearing
          scope enters the project plan.
        </Callout>

        <Callout kind="verify" title="Bat tree-clearing dates: run IPaC for your specific footprint">
          The dates cited here are derived from secondary sources summarizing
          USFWS guidance. Because USFWS issues project-specific guidance
          through the IPaC DKey (public tool at ipac.ecosphere.fws.gov), the
          IPaC output for your project footprint supersedes any generic date
          range. Do not cite this module's dates in a subgrantee environmental
          determination — cite the IPaC output.
        </Callout>
      </Section>

      <Section title="3.5 Municipal ROW permits: the application packet and realistic timelines">
        <p>
          Municipal right-of-way (ROW) permits govern the use of public
          street corridors for utility construction. There is{' '}
          <strong>no single national standard</strong> for municipal ROW
          permitting — every city has its own ordinance, application form, fee
          schedule, and review timeline. The FCC's Broadband Deployment
          Advisory Committee (BDAC) published a Model Code for Municipalities
          in 2018 that establishes a useful template for what a well-structured
          ROW ordinance should contain, but adoption is voluntary and uneven.
          VERIFIED-public-source.
        </p>

        <p className="mt-2">
          A typical municipal ROW permit packet contains:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Completed application form with applicant and contractor information</li>
          <li>Route map (plan view, often required as PDF + GIS/KMZ — see Section 3.6)</li>
          <li>Traffic control plan (TCP) and flagging / detour information</li>
          <li>Proof of bonding and general liability insurance (minimums vary by city)</li>
          <li>Permit fee (flat or per-linear-foot; varies widely)</li>
          <li>Emergency contact and hours-of-work restrictions</li>
          <li>Pavement restoration plan and any required pavement-cut moratorium waivers</li>
        </ul>

        <Callout kind="book" title="Representative timeline framing (not a national rule)">
          The IMMCO blog "Right of Way Permits in Fiber: Part 1" describes a
          typical three-step municipal application process with a ~60-day
          completion target after all revisions are resolved, including a
          30-day public comment window where required. This is a representative
          description of how many mid-sized U.S. cities are structured —
          not a statutory requirement. VERIFIED-via-secondary-source.
        </Callout>

        <Callout kind="field" title="Real timelines: 30 days to 12 months">
          State broadband playbooks and BroadbandUSA materials document
          permit completion ranging from 30 days (cooperative municipalities,
          simple routes) to 12+ months (historic districts, parallel state-DOT
          permits, city-staff backlog, environmental overlays). "Permitting took
          longer than the build" is a near-universal field complaint on first-
          time builds in a new service territory. Build permitting milestones
          into the project schedule as ranges, not point estimates.
        </Callout>

        <Callout kind="field" title="AHJ override is absolute in municipal permitting">
          The local municipality is the AHJ for its ROW. Its ordinance, fee
          schedule, submittal requirements, and review timeline govern — there
          is no federal floor that guarantees a faster process. The FCC BDAC
          Model Code is advisory; cities are not required to adopt it. In
          practice, the first call on any new municipal project is to the city's
          public works or engineering department to confirm current requirements,
          because requirements change without notice on city websites.
        </Callout>

        <Table
          headers={['Permit layer', 'Who issues it', 'Representative lead time', 'Key document']}
          rows={[
            ['Municipal ROW', 'City / county public works or engineering', '30 days – 12+ months (varies)', 'FCC BDAC Model Code 2018; city ordinance'],
            ['State DOT ROW', 'State DOT district office (TxDOT, FDOT, Caltrans, etc.)', '60 – 180 days typical', 'State DOT ROW manual, e.g. TxDOT ROW Manual §4'],
            ['Railroad crossing', 'Railroad real estate or permits department', '90 – 365 days', 'Railroad-specific license agreement'],
            ['Federal ROW (BLM, USFS, NPS)', 'Federal agency with jurisdiction', '6 months – 2+ years', 'Right-of-Way Grant application; NEPA required'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Lead times are representative of field experience documented in state
          playbooks and BroadbandUSA materials, not guaranteed by any standard.
          Confirm with the issuing authority before scheduling.
        </p>
      </Section>

      <Section title="3.6 AutoCAD and GIS as permit deliverables">
        <p>
          Most OSP permit submittals require construction drawings. The tooling
          behind those drawings — and what the AHJ actually accepts — has
          evolved significantly since the days of paper plan sets.
        </p>

        <p className="mt-2 font-semibold text-slate-100">AutoCAD / Civil 3D: the permit-drawing tool</p>
        <p>
          Large carriers and engineering contractors use{' '}
          <strong>AutoCAD or Civil 3D</strong> to produce the construction-
          document set — plan-and-profile sheets, pole-loading diagrams, splice
          locations. Lumen's published Detail Drawing Standards Manual is a
          real-world example of a carrier-level CAD standard that specifies
          layer naming, sheet format, title-block conventions, and block
          library structure. VERIFIED-public-source.
        </p>

        <Callout kind="field" title="AutoCAD ships with no OSP block library">
          This is a critical field fact that textbooks omit. AutoCAD has no
          built-in block set for OSP symbols (pole, anchor, splice enclosure,
          handhole, etc.). Every carrier or engineering firm either licenses a
          third-party block set or maintains an internal one. The Autodesk
          community forum thread on fiber-optic network diagramming confirms
          this has been true for years. Students who expect to install AutoCAD
          and find an OSP library waiting will be disappointed — and will spend
          their first month on a real OSP team learning the internal standard
          before they can produce a permitted drawing.
        </Callout>

        <Callout kind="field" title="Two parallel systems: CAD for the permit, GIS for the network">
          Modern OSP teams run two parallel systems. The CAD set is the
          <em> permit deliverable</em> — it goes to the municipality,
          the utility, or the DOT. The fiber-management system (3-GIS, VETRO
          FiberMap, IQGeo, Bentley OpenComms, or similar) is the
          <em> operational record</em> — it tracks every fiber strand, splice
          assignment, and trouble ticket. Students who learn AutoCAD without
          learning the parallel fiber-management layer will not survive the
          first month on a real OSP team. Module 7 covers the fiber-management
          system side.
        </Callout>

        <p className="mt-2 font-semibold text-slate-100">GIS as a permit deliverable — a trend, not a standard</p>
        <p>
          A growing number of municipalities and DOTs accept{' '}
          <strong>PDF + KMZ</strong> or <strong>PDF + shapefile</strong> as the
          primary permit deliverable. Concrete examples with published specs:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>City of Pleasanton, CA</strong> — publishes a Digital
            Submittal Requirements document specifying coordinate system, file
            naming, and layer structure for GIS deliverables. VERIFIED-public-source.
          </li>
          <li>
            <strong>Florida Turnpike Authority</strong> — publishes a KMZ
            Deliverable Standard (October 2020) for any project in its ROW.
            VERIFIED-public-source.
          </li>
          <li>
            <strong>NAVFAC UFGS 01 78 30.00 23</strong> — federal specification
            for CADD-to-GIS handoff on federal building and infrastructure
            projects. VERIFIED-public-source.
          </li>
        </ul>

        <Callout kind="field" title="GIS is additional, not a replacement for the stamped PDF">
          Even where a city's website says "we accept GIS," the planning
          department frequently also requires a PDF plan set with a title block,
          signed and sealed by a Professional Engineer licensed in that state.
          The GIS is the <em>operational</em> artifact the city uses for its
          asset management system; the stamped PDF is the <em>legal</em>
          artifact that the city's attorney can point to if there is a
          construction dispute. Do not tell a subgrantee "your city accepts KMZ"
          and stop there. Tell them: verify the current submittal requirements
          in writing, and assume a stamped PDF is also required until you have
          written confirmation otherwise.
        </Callout>

        <Callout kind="verify" title="PE-stamp requirements vary by state">
          Many states require a Professional Engineer's stamp on broadband ROW
          submittals; the threshold varies. Some states require a PE for any
          construction drawing in the public ROW; others only for structural
          work (pole loading, boring plans). Confirm with the state board of
          professional engineers or the issuing AHJ for your project state
          before sealing a design.
        </Callout>
      </Section>

      <Section title="3.7 Make-ready as a project-management problem">
        <p>
          Module 2 covered the design and clearance side of make-ready. This
          section covers the <strong>timeline and project-management side</strong>:
          the FCC-defined shot clocks, why they slip, and how to plan around them.
        </p>
        <p className="mt-2">
          When a new attacher applies to place cable on an existing pole, the
          pole owner and existing attachers must "make ready" by moving any
          attachment that conflicts with the proposed new attachment. The FCC's{' '}
          <strong>One-Touch Make-Ready (OTMR)</strong> framework (FCC 18-111,
          2018) established shot-clock timelines for the simple-make-ready case.
        </p>

        <Table
          headers={['FCC OTMR milestone', 'Party', 'Shot-clock days', 'Source']}
          rows={[
            ['Pole owner accepts / rejects OTMR application', 'Pole owner', '10 business days', 'FCC 18-111 (VERIFIED-public-source)'],
            ['Minimum notice to existing attachers before survey', 'New attacher', '3 business days', 'FCC 18-111 (VERIFIED-public-source)'],
            ['Pole survey and make-ready estimate', 'Pole owner / engineer', '45 days after application', 'FCC 18-111 (VERIFIED-public-source)'],
            ['Simple make-ready performed in one visit by new attacher\'s contractor', 'New attacher contractor', 'Single coordinated visit', 'FCC 18-111 (VERIFIED-public-source)'],
          ]}
        />

        <Callout kind="book" title="What OTMR covers — and what disqualifies a job (see also Module 2)">
          OTMR applies to <em>simple</em> communication-space make-ready: moving
          an existing cable within the comm space without splicing, without
          entering the supply space, and without a reasonable expectation of
          service interruption to an existing attacher. Complex work — cable
          splicing, supply-space work, antenna installation, any job requiring
          the existing attacher's own crews — reverts to sequential make-ready
          with each existing attacher getting its own notice-and-response window.
          Source: FCC 18-111 (VERIFIED-public-source).
        </Callout>

        <Callout kind="field" title="Field reality: make-ready takes longer than the build">
          Pew Charitable Trusts' 2025 issue brief on state pole-attachment
          legislation documents that "make-ready taking longer than the build"
          is a pervasive complaint on BEAD-era deployments. Dominant causes:
          (1) pole-owner survey delays — the 45-day shot clock is frequently
          missed and FCC enforcement alone is too slow for BEAD milestones;
          (2) job reclassification — a "simple" job reclassifies to "complex"
          mid-project when an auditor finds a prior attacher's non-compliant
          installation, and the new attacher inherits the remediation cost;
          (3) state OTMR adoption is incomplete — not all states have adopted
          the FCC framework.
          Source: Pew 2025; CT Mirror; Benton Institute (all public).
        </Callout>

        <Callout kind="field" title="Budget make-ready as a schedule range, not a line item">
          Field practitioners consistently advise: budget make-ready as a
          percentage of the aerial route length (commonly 20–40% of poles will
          need some work) and as a schedule range (optimistic: FCC shot clocks
          hold; realistic: add 60–90 days; pessimistic: add 6 months for
          contested poles or complex reclassifications). The "make-ready
          spreadsheet" tracking every pole, its current attacher set, its
          estimated work scope, and its scheduled visit date is a real PM
          artifact — treat it with the same care as the design drawings.
        </Callout>
      </Section>

      <Section title="3.8 Scenario-Based Exam">
        <InteractiveQuiz title="Module 3 — Permitting & Planning" questions={M3_QUESTIONS} />
      </Section>

      <RefList items={[
        { tag: 'book',   text: 'FCC BDAC Model Code for Municipalities (2018)',
                         url: 'https://www.fcc.gov/sites/default/files/bdac-07-2627-2018-model-code-for-municipalities-approved-rec.pdf' },
        { tag: 'book',   text: 'NTIA Notice of Newly Adopted NEPA Categorical Exclusions',
                         url: 'https://broadbandusa.ntia.gov/funding-programs/policies-waivers/Notice_of_Newly_Adopted_NEPA_Categorical_Exclusions' },
        { tag: 'book',   text: 'NTIA Newly Established NEPA Categorical Exclusions',
                         url: 'https://broadbandusa.ntia.gov/funding-programs/policies-waivers/Notice_of_Newly_Established_NEPA_Categorical_Exclusions' },
        { tag: 'book',   text: 'NTIA NEPA for BEAD Milestone Schedule',
                         url: 'https://broadbandusa.ntia.gov/sites/default/files/2025-05/NEPA_for_BEAD_Milestone_Schedule_NEPA_Timeline.pdf' },
        { tag: 'book',   text: 'NTIA NEPA Categorical Exclusion / Extraordinary Circumstances slide deck',
                         url: 'https://broadbandusa.ntia.gov/sites/default/files/2024-08/NTIA_NEPA_Categorical_Exclusion_Extraordinary_Circumstances_NTIA-BLM_Permitting_Summit_Slides.pdf' },
        { tag: 'book',   text: 'NTIA NHPA Section 106 Consultation Process Fact Sheet (2024)',
                         url: 'https://broadbandusa.ntia.gov/sites/default/files/2024-02/NHPA_Sect_106_Consultation_Process_Fact_Sheet_2024.pdf' },
        { tag: 'book',   text: 'ACHP Section 106 Program Comment Flowchart',
                         url: 'https://broadbandusa.ntia.gov/sites/default/files/2025-06/EHP_NTIA_Section_106_Program_Comment_Flowchart.pdf' },
        { tag: 'book',   text: 'ACHP Consultation with Indian Tribes Handbook (June 2021)',
                         url: 'https://www.achp.gov/sites/default/files/2021-06/ConsultationwithIndianTribesHandbook6-11-21Final.pdf' },
        { tag: 'book',   text: 'USFWS Listed Bats Consultation & Conservation Strategy',
                         url: 'https://www.fws.gov/program/endangered-species/bat-consultation-conservation-strategy' },
        { tag: 'book',   text: 'Lumen Detail Drawing Standards Manual (CAD standard example)',
                         url: 'https://assets.lumen.com/is/content/Lumen/detail-drawing-standards-manualpdf?Creativeid=515b10a8-37eb-4b1b-a0c1-4249e7d5d43e' },
        { tag: 'book',   text: 'City of Pleasanton CA — Digital Submittal Requirements (GIS deliverable example)',
                         url: 'https://www.cityofpleasantonca.gov/assets/our-government/gis-mapping-data/digital-submittal-requirements.pdf' },
        { tag: 'book',   text: 'Florida Turnpike KMZ Deliverable Standards (Oct 2020)',
                         url: 'https://floridasturnpike.com/wp-content/uploads/2020/10/Turnpike-KMZ-Standards.pdf' },
        { tag: 'book',   text: 'TxDOT ROW Manual §4 — Broadband Technical Specifications',
                         url: 'https://www.txdot.gov/manuals/row/utl/appendix-b--broadband-accommodation-process/section-4--broadband-technical-specifications.html' },
        { tag: 'book',   text: 'FCC 18-111 — One-Touch Make-Ready order',
                         url: 'https://docs.fcc.gov/public/attachments/doc-352544a1.pdf' },
        { tag: 'book',   text: 'California Local Jurisdiction Broadband Permitting Playbook',
                         url: 'https://broadbandforall.cdt.ca.gov/wp-content/uploads/sites/19/2022/09/California-Local-Jurisdiction-Permitting-Playbook-1.pdf' },
        { tag: 'book',   text: 'Pew Charitable Trusts — Broadband Expansion May Hinge on States\' Pole-Attachment Processes (March 2025)',
                         url: 'https://www.pew.org/en/research-and-analysis/issue-briefs/2025/03/broadband-expansion-may-hinge-on-states-processes-for-attaching-lines-to-utility-poles' },
        { tag: 'forum',  text: 'IMMCO — Right of Way Permits in Fiber: Part 1 (representative three-step workflow)',
                         url: 'https://www.immcoinc.com/blog/right-of-way-permits-in-fiber-part-1' },
        { tag: 'forum',  text: 'Autodesk community — Symbols for Fiber Optic Network diagramming (no built-in OSP library)',
                         url: 'https://forums.autodesk.com/t5/autocad-electrical-forum/symbols-for-fiber-optic-network-diagramming/td-p/8343712' },
        { tag: 'verify', text: 'NTIA CE C-8 controlling text — confirm from the most current NTIA Federal Register notice before use in a subgrantee environmental determination.' },
        { tag: 'verify', text: 'Bat tree-clearing dates — derived from secondary sources. Run USFWS IPaC for your specific project footprint; do not cite this module\'s dates in an environmental determination.' },
        { tag: 'verify', text: 'PE-stamp requirements for broadband ROW submittals vary by state — confirm with the state board of professional engineers or AHJ.' },
        { tag: 'verify', text: 'AHJ override is universal in permitting — no federal floor guarantees a specific review timeline at the municipal level.' },
      ]}/>
    </article>
  );
}

const M3_QUESTIONS = [
  {
    id: 'm3-q1',
    type: 'mc',
    prompt: 'A BEAD subgrantee is planning a buried fiber route entirely within the shoulder of an existing state highway. The route does not cross any wetlands, historic properties, or listed species habitat. Which NEPA pathway applies?',
    choices: [
      'A full Environmental Impact Statement (EIS) is required because the project uses federal funds.',
      'No NEPA review is required because the route is in existing ROW.',
      'NTIA Categorical Exclusion C-8 likely applies — buried/aerial utility construction within existing ROW — subject to the extraordinary circumstances checklist.',
      'An Environmental Assessment (EA) is required before any buried construction in a state highway corridor.',
    ],
    answerIndex: 2,
    explanation: 'CE C-8 covers aerial or buried utility/communication construction within or adjacent to existing rights-of-way — the classic buried BEAD fiber scenario. The CE eliminates the need for an EA or EIS, but the subgrantee must still document that no extraordinary circumstances (T&E species, historic properties, sensitive habitat, etc.) apply. NEPA is triggered by the federal nexus (BEAD grant), not by the construction method.',
    citation: 'NTIA Notice of Newly Adopted NEPA Categorical Exclusions; NTIA NEPA for BEAD Milestone Schedule (VERIFIED-public-source). CE C-8 controlling text in 2024 NTIA Federal Register notice.',
    fieldNote: 'Most BEAD project NEPA effort is the extraordinary-circumstances screening, not the CE itself. Run NTIA\'s ESAPTT and USFWS IPaC before writing the CE determination.',
  },
  {
    id: 'm3-q2',
    type: 'mc',
    prompt: 'A fiber project submits an initiation letter to the State Historic Preservation Officer (SHPO) for Section 106 review. The letter is missing the Area of Potential Effect (APE) map. How long does the SHPO have to comment, and when does the clock start?',
    choices: [
      '30 calendar days from the date the letter was mailed.',
      '60 calendar days from the date the letter arrived at the SHPO office.',
      'The 30-day comment window does not start until NTIA/the agency determines the initiation letter is adequate — the missing APE map means the clock has not started.',
      '15 business days, regardless of package completeness.',
    ],
    answerIndex: 2,
    explanation: 'The 30-day SHPO comment window under Section 106 starts only after the initiation package is determined adequate — meaning it includes the APE definition, supporting photos, prior-records-search results, and other required elements. An incomplete letter is returned with comments; the clock starts fresh on resubmission. This distinction is the most common cause of Section 106 delays on first-time submittals.',
    citation: 'NTIA NHPA Section 106 Consultation Process Fact Sheet (2024). VERIFIED-via-secondary-source.',
    fieldNote: '"We submitted 30 days ago and haven\'t heard back" almost always means the package was deficient and the SHPO sent a deficiency letter that nobody read. Check the inbox.',
  },
  {
    id: 'm3-q3',
    type: 'mc',
    prompt: 'A project manager says: "Our city accepts KMZ so we don\'t need to produce a CAD drawing set." Which is the most accurate response?',
    choices: [
      'Correct — if the city\'s website says KMZ is accepted, no other deliverable is needed.',
      'Incorrect — municipalities never accept GIS files; a full DWG set is always required.',
      'Likely incomplete — cities that accept KMZ/GIS as a permit deliverable frequently still require a PDF plan set with a title block, stamped and sealed by a licensed PE, as the legal artifact. Verify the submittal requirements in writing.',
      'It depends entirely on the state; there is no general guidance.',
    ],
    answerIndex: 2,
    explanation: 'GIS (KMZ, shapefile, geodatabase) is the operational artifact a city uses for asset management. The stamped PDF is the legal artifact that governs the construction. Cities like Pleasanton, CA and the Florida Turnpike publish explicit GIS submittal requirements — but even those typically also require a PDF set for the permit record. "GIS is additional, not a replacement" is the safe default until you have written confirmation otherwise.',
    citation: 'City of Pleasanton CA Digital Submittal Requirements; Florida Turnpike KMZ Standards (October 2020). Both VERIFIED-public-source. Module 3 editorial guidance.',
    fieldNote: 'A VETRO FiberMap Capterra reviewer noted: even clean GIS internally doesn\'t produce a "nice drawing and legend for city use." The export problem is real.',
  },
  {
    id: 'm3-q4',
    type: 'mc',
    prompt: 'A contractor is scheduling tree-clearing along a suburban aerial route in Virginia for a BEAD project. The route passes through neighborhoods with mature deciduous trees. Which is the most appropriate first action?',
    choices: [
      'Schedule tree-clearing in winter (November–March) and proceed without further review, because the NLEB is only a concern in rural forests.',
      'Run the project footprint through USFWS IPaC to determine project-specific bat species consultation requirements and any applicable time-of-year restrictions before scheduling tree-clearing.',
      'File an ESA Section 7 formal consultation immediately with the USFWS regional office.',
      'Tree-clearing for aerial OSP is explicitly excluded from ESA review because it is in a public ROW.',
    ],
    answerIndex: 1,
    explanation: 'Urban tree canopy in NLEB range qualifies as bat roost habitat — the suburban vs. rural distinction does not provide a safe harbor. The correct first step is to run the project footprint through USFWS IPaC, which generates project-specific species lists and DKey guidance, including any time-of-year restrictions. IPaC output supersedes generic date ranges. Virginia is within NLEB range.',
    citation: 'USFWS Listed Bats Consultation & Conservation Strategy; NLEB reclassified Endangered 2022. VERIFIED-via-secondary-source (law firm and consultant summaries).',
    fieldNote: 'Field crews are frequently surprised to learn that trimming a maple tree on a city street to clear wire clearance can be a federal bat-consultation trigger. The answer is not to avoid the work — it\'s to schedule it outside the restricted window.',
  },
  {
    id: 'm3-q5',
    type: 'dragdrop',
    prompt: 'Match each permitting scenario to the correct regulatory layer or framework that primarily governs it.',
    items: [
      { id: 'nepa',   label: 'NEPA / CE C-8' },
      { id: 's106',   label: 'NHPA Section 106' },
      { id: 'esa',    label: 'ESA Section 7' },
      { id: 'muni',   label: 'Municipal ROW ordinance' },
      { id: 'fcc',    label: 'FCC OTMR (18-111)' },
    ],
    targets: [
      { id: 't1', label: 'BEAD-funded buried fiber route — does the project require an environmental assessment?' },
      { id: 't2', label: 'Route passes through a downtown historic district — does construction affect listed properties?' },
      { id: 't3', label: 'Aerial route make-ready requires trimming urban tree canopy in northern long-eared bat range.' },
      { id: 't4', label: 'Contractor needs permission to bore under Main Street, including a traffic control plan and insurance certificate.' },
      { id: 't5', label: 'New fiber attachment — existing attacher\'s cable must be lowered 6 inches in the comm space without splicing.' },
    ],
    correctMap: {
      t1: 'nepa',
      t2: 's106',
      t3: 'esa',
      t4: 'muni',
      t5: 'fcc',
    },
    explanation: 'NEPA governs federal environmental review for federally funded projects (BEAD = federal nexus). Section 106 governs historic properties on federal undertakings. ESA Section 7 governs T&E species consultation on federal nexus projects. Municipal ROW ordinances govern construction in city streets (traffic plans, bonding, fees) regardless of federal nexus. FCC OTMR governs simple communication-space make-ready on joint-use poles — lowering a cable 6 inches without splicing is textbook OTMR.',
    citation: 'NTIA NEPA CEs (public); NTIA NHPA Fact Sheet 2024; USFWS bat guidance; FCC BDAC Model Code; FCC 18-111.',
    fieldNote: 'Most real projects trigger more than one of these simultaneously. A BEAD aerial route make-ready in a downtown historic district hits NEPA, Section 106, ESA, and the municipal ROW permit all at once.',
  },
  {
    id: 'm3-q6',
    type: 'mc',
    prompt: 'Under FCC One-Touch Make-Ready (OTMR, FCC 18-111), a pole owner misses the 45-day deadline to provide a make-ready survey and estimate. A project manager says "we\'ll just wait for the next BEAD reporting cycle." What is the better field response?',
    choices: [
      'Waiting is correct — FCC shot clocks are advisory, and there is no remedy.',
      'File an FCC complaint immediately; the pole owner loses all rights to the pole.',
      'Document the missed deadline in writing, escalate to the subgrantee\'s state broadband office (which may have faster enforcement leverage than FCC), and evaluate the parallel state pole-attachment statute — many states have adopted stronger timelines than the FCC rules.',
      'Switch to underground construction immediately; aerial permitting is unworkable.',
    ],
    answerIndex: 2,
    explanation: 'The FCC shot clocks are enforceable but FCC enforcement is slow relative to BEAD deployment calendars. Pew\'s 2025 research documents that states are actively legislating to provide faster enforcement. The best field response is to: (1) document the deadline miss in writing to preserve rights, (2) escalate through the state broadband office which has faster political leverage, and (3) check the state\'s pole-attachment statute — several states have adopted timelines stricter than the FCC rules, with faster state-level remedies.',
    citation: 'Pew Charitable Trusts, "Broadband Expansion May Hinge on States\' Processes for Attaching Lines to Utility Poles" (March 2025); Benton Institute FCC pole-attachment rules summary (both public).',
    fieldNote: '"You will spend more time on the make-ready spreadsheet than on the splice plan" — standard field practitioner advice on large aerial deployments.',
  },
];
