import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';

/**
 * Module 10 — Data Center Standards
 *
 * Editorial posture (per docs/research-logs/module10-data-center.md §5):
 *  - "2026 TIA Quality Standards" from the brief does not match any published TIA
 *    document. The research log identifies two likely candidates:
 *      (a) TIA QuEST Forum DCE 9000 — data-center QMS standard, draft Sept 2026,
 *          full publication targeted 2027. [VERIFIED-public-source via two press
 *          releases: Data Centre Magazine + PRNewswire]
 *      (b) ANSI/TIA-942-C AI Addendum — GPU-cluster density, liquid cooling,
 *          very-high-speed cabling; target publication mid-2027. [VERIFIED-public-
 *          source via TelecomReseller, March 2026]
 *    Both are marked forthcoming / not yet binding throughout this module.
 *  - ANSI/TIA-942-C published May 2024 (current). ANSI/BICSI 002-2024 published
 *    May 2024. Both paywalled. Clause-level claims tagged UNVERIFIED.
 *  - Uptime Institute "Tier" and TIA-942 "Rated" are DIFFERENT systems despite
 *    sharing the Roman-vs-Arabic-numeral 1-4 scale. Every mention disambiguates.
 *  - Availability percentages (99.671 / 99.741 / 99.982 / 99.995) come from a
 *    historical Uptime white paper, NOT from the current Tier Standard or TIA-942-C.
 *    Displayed only with that caveat.
 *  - Cabinet width 800 mm used as new-build MDA/IDA/HDA default; 600 mm noted
 *    as widely deployed in existing facilities (no retroactive de-cert).
 *  - Base-8 MPO/MTP is the default for 100G/400G/800G parallel-optic examples;
 *    Base-12 presented as the legacy/duplex-breakout case.
 *  - Hot-aisle/cold-aisle always taught with containment (CAC/HAC), not standalone.
 */

export default function Module10_DataCenter() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={10}
        title="Data Center Standards"
        intro="TIA-942 Rated 1–4, Uptime Tier I–IV (and why they are not the same), high-density cabling (MPO/MTP, Base-8 vs Base-12, 100G/400G/800G), hot-aisle/cold-aisle containment, cabinet/rack standards, ANSI/BICSI 002-2024, and the forthcoming DCE 9000 / TIA-942-C AI Addendum. ANSI/TIA-942-C (May 2024) and ANSI/BICSI 002-2024 are paywalled — clause-level claims are tagged. Every number carries a source."
      />

      {/* ------------------------------------------------------------------ */}
      <Section title="10.1 Two Frameworks, One Number Scale — Clearing Up 'Tier vs. Rated'">
        <p>
          The single largest source of confusion in data-center design is the
          collision of two independent four-level classification systems that
          both happen to use the number range 1–4:
        </p>

        <Table
          headers={['Property', 'Uptime Institute Tier (I–IV)', 'ANSI/TIA-942 Rated (1–4)']}
          rows={[
            ['Owner / author', 'Uptime Institute (private)', 'TIA TR-42.1 / ANSI (standards body)'],
            ['Numerals used', 'Roman (I, II, III, IV)', 'Arabic (1, 2, 3, 4)'],
            ['Philosophy', 'Performance-based; assesses actual operational resilience', 'Prescriptive; specifies infrastructure components and redundancy configurations'],
            ['Certification body', 'Uptime Institute exclusively (trademark enforced)', 'TIA-accredited third-party assessors (e.g., EPI, Bureau Veritas)'],
            ['Published availability %?', 'No — Uptime explicitly removed % targets from the current Tier Standard', 'No — TIA-942-C does not publish a single SLA %'],
            ['Current edition', 'Tier Standard: Topology + Operational Sustainability (2015/2016 revisions, regularly updated)', 'ANSI/TIA-942-C, May 2024 [VERIFIED-public-source]'],
            ['Legal note', '"Tier" is a registered trademark of Uptime Institute', 'No trademark restriction on "Rated"'],
          ]}
        />

        <Callout kind="verify" title="'TIA-942 Tier III' is not a thing">
          RFPs and vendor decks routinely write "TIA-942 Tier III" — a phrase that does
          not appear in either standard. TIA-942-C says "Rated-3." If you see "Tier III"
          in a document, ask the author whether they mean Uptime Tier III (certification
          by Uptime Institute) or TIA-942 Rated-3 (certification by a TIA-recognised
          assessor). The answer changes the certification process and cost.
        </Callout>

        <Callout kind="field" title="Dual certification is common in the colo market">
          Operators of colocation facilities serving hyperscale tenants frequently carry
          both a TIA-942 Rated-3 certificate and an Uptime Institute Tier III certificate
          because insurers and large enterprise customers recognise different credentials.
          "We have the TIA cert in the lobby and Uptime gets brought up on every tour"
          is a recurring practitioner observation (r/datacenter threads, 2024–2025). Dual
          certification is not unusual; it is commercially rational.
        </Callout>

        <p className="mt-3">
          <strong>About availability percentages:</strong> You will encounter a table
          citing 99.671% / 99.741% / 99.982% / 99.995% mapped to Tier I–IV. That table
          originated in an early Uptime Institute white paper from the 1990s. The current
          Uptime Tier Standard does <em>not</em> include those figures. TIA-942-C similarly
          does not publish a single availability percentage per Rating. When those numbers
          appear in vendor slides or study guides, they carry an important label:
        </p>
        <Callout kind="verify" title="Availability % table — historical, not current">
          The 99.671 / 99.741 / 99.982 / 99.995% figures are from a historical Uptime
          Institute white paper and are <strong>not part of the current Tier Standard or
          ANSI/TIA-942-C.</strong> Uptime explicitly removed single-percentage SLA targets
          from the current standard. These numbers continue to circulate because they are
          memorable and widely reproduced in vendor marketing, but they do not describe
          what any certification body actually tests against today.
          [Source: Uptime Institute — "Myths and Misconceptions" journal article,
          VERIFIED-public-source]
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="10.2 TIA-942 Rated 1–4 — Infrastructure Classifications">
        <p>
          <strong>ANSI/TIA-942-C</strong> (published May 2024, developed by TIA TR-42.1)
          is the current revision of the Telecommunications Infrastructure Standard for
          Data Centers. It defines four <em>Ratings</em> covering four infrastructure
          domains: telecommunications, architectural, electrical, and mechanical.
          [VERIFIED-public-source — TIA product page and 2024 white paper]
        </p>
        <p className="mt-2">
          Key changes in the -C revision (from secondary trade-press sources, since the
          full standard is paywalled at approximately US$799):
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Minimum cabinet width in MDA/IDA/HDA raised to <strong>800 mm</strong>
            (up from 600 mm in prior editions). [VERIFIED-via-secondary-source —
            Belden, Data Center Frontier, Cabling Installation &amp; Maintenance]</li>
          <li>Single balanced twisted-pair (sBTP) now recognised for horizontal
            cabling. [VERIFIED-via-secondary-source]</li>
          <li>Expanded fiber connectivity guidance for high-density and spine-leaf
            topologies. [VERIFIED-via-secondary-source]</li>
          <li>Edge data center content folded in from TIA-942-B-1. [VERIFIED-via-secondary-source]</li>
        </ul>

        <Table
          headers={['Rating', 'Redundancy level', 'Concurrent maintainability', 'Fault tolerance', 'Typical use case']}
          rows={[
            ['Rated-1', 'Single path; no redundant components', 'No', 'No', 'Small enterprise; tolerance for planned and unplanned downtime'],
            ['Rated-2', 'Single path; some redundant components (N+1)', 'No', 'No', 'Medium enterprise; limited maintenance windows'],
            ['Rated-3', 'Multiple paths; active path + independent maintenance path', 'Yes — all components maintainable without downtime', 'No', 'Large enterprise, carrier-neutral, most colo'],
            ['Rated-4', 'Multiple active paths simultaneously; fully fault-tolerant', 'Yes', 'Yes — single fault in any system does not impact IT load', 'Tier-1 financial, government, mission-critical'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Source: TIA-942-C (paywalled). Table structure corroborated by TIA 2024 white paper
          [VERIFIED-public-source] and multiple secondary trade sources [VERIFIED-via-secondary-source].
          Exact threshold values (e.g., fuel-storage hours) require the paid document.
        </p>

        <Callout kind="verify" title="96-hour fuel storage for Rated-4 — unverified exact figure">
          A frequently quoted claim is that TIA-942-C Rated-4 requires 96 hours of on-site
          generator fuel storage. This figure appears in multiple vendor decks but the exact
          value varies between secondary sources. The authoritative figure is in TIA-942-C
          Annex F (paywalled). [UNVERIFIED — confirm from paid document before citing in
          a design specification.]
        </Callout>

        <Callout kind="field" title="Cabinet width in retrofits">
          TIA-942-C's 800 mm minimum cabinet width applies to new builds and upgrades.
          It does not retroactively de-certify a facility whose legacy MDA rows were
          designed around 600 mm cabinets. In practice, operating 600 mm cabinets remain
          widespread; the AHJ or assessor will note the deviation if a Rating assessment
          is sought. Do not write "600 mm cabinets are non-compliant" without the qualifier
          "under TIA-942-C for new construction." [Source: Data Center Frontier and Cabling
          Installation &amp; Maintenance retrofit coverage, VERIFIED-via-secondary-source]
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="10.3 Uptime Institute Tier I–IV — Performance Framework">
        <p>
          The Uptime Institute Tier Standard is owned exclusively by the Uptime Institute,
          which separated definitively from TIA's certification program in 2014 and holds
          the "Tier" trademark. The standard has two parts:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Tier Standard: Topology</strong> — evaluates the physical
            infrastructure design for concurrent maintainability (Tier III) and fault
            tolerance (Tier IV).</li>
          <li><strong>Tier Standard: Operational Sustainability</strong> — evaluates
            whether the staff, processes, and management practices can sustain the
            designed level of resilience over time. A building can have Tier III topology
            but fail Operational Sustainability.</li>
        </ul>

        <Table
          headers={['Tier', 'Redundancy concept', 'Concurrent maintainability', 'Fault tolerant', 'Informal description']}
          rows={[
            ['Tier I',  'Non-redundant (N)', 'No', 'No', 'Basic: single utility feed, single UPS string, one cooling path'],
            ['Tier II', 'Redundant capacity (N+1)', 'No', 'No', 'Some redundant components but still one distribution path'],
            ['Tier III', '2N (active + standby distribution)', 'Yes', 'No', '"Concurrently maintainable": every component maintainable without IT shutdown; most colos target this'],
            ['Tier IV', '2N+1 or higher, fully fault-tolerant active paths', 'Yes', 'Yes', 'Any single fault — including on an active path — does not interrupt IT load'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Source: Uptime Institute public press release (separation from TIA, 2014) and Uptime Journal
          article on Tier misconceptions [VERIFIED-public-source]. TechTarget summary
          [VERIFIED-via-secondary-source]. Tier Standard documents themselves are sold by Uptime Institute.
        </p>

        <Callout kind="book" title="Tier is performance-based, not prescriptive">
          Unlike TIA-942-C (which specifies components and configurations), the Uptime Tier
          Standard evaluates whether the installed system <em>can perform</em> at the claimed
          level. Two facilities with very different equipment configurations can both achieve
          Tier III certification if both demonstrate concurrent maintainability. This is
          the fundamental architectural difference between the two frameworks.
          [Source: Uptime Institute "Myths and Misconceptions" journal article, VERIFIED-public-source]
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="10.4 High-Density Cabling — MPO/MTP, Base-8 vs Base-12, and the Speed Math">
        <p>
          Modern data center horizontal cabling is dominated by multi-fiber push-on / multi-fiber
          termination push-on (<strong>MPO/MTP</strong>) connectors carrying 8, 12, 16, or 24
          fibers per ferrule. The choice of ferrule geometry directly affects whether a parallel-optic
          transceiver will have 100% fiber utilization or leave fibers dark — and therefore affects
          trunk cost, patch-panel port density, and migration headroom.
        </p>

        <h3 className="text-base font-semibold mt-4 mb-2">Why the lane count of the transceiver determines the base</h3>
        <p>
          Parallel-optic transceivers for 100G, 400G, and 800G Ethernet use an 8-lane architecture
          (4 transmit + 4 receive) as the dominant building block at the structured-cabling interface.
          Representative examples from IEEE 802.3 [VERIFIED-public-source]:
        </p>
        <Table
          headers={['Speed', 'Example IEEE type', 'Tx lanes', 'Rx lanes', 'Total fibers per link', 'Efficient base']}
          rows={[
            ['100G',  '100GBASE-SR4',  '4', '4', '8',  'Base-8'],
            ['400G',  '400GBASE-SR4',  '4', '4', '8',  'Base-8 (one MPO per link)'],
            ['400G',  '400GBASE-DR4',  '4', '4', '8',  'Base-8'],
            ['800G',  '800GBASE-DR8',  '8', '8', '16', 'Base-16 (or 2× Base-8)'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Lane counts: IEEE 802.3 standard (freely downloadable from ieee802.org) [VERIFIED-public-source].
          Structured-cabling implementation per vendor whitepapers (Corning, CommScope, FS, Belden, Wolontek)
          [VERIFIED-via-secondary-source].
        </p>

        <h3 className="text-base font-semibold mt-4 mb-2">The Base-8 / Base-12 arithmetic</h3>
        <p>
          A <strong>Base-8</strong> MPO trunk has 8 fibers. Each 8-fiber transceiver consumes exactly
          one MPO connector — <strong>100% utilization</strong>.
        </p>
        <p className="mt-2">
          A <strong>Base-12</strong> MPO trunk has 12 fibers. When used with an 8-fiber transceiver,
          4 fibers per connector are dark: <strong>8/12 = 67% utilization</strong>. At scale, a 1,000-port
          100G spine layer wastes 4,000 fibers in Base-12 trunking that would be fully used in Base-8.
        </p>
        <p className="mt-2">
          The exception: Base-12 makes sense where the end devices use duplex LC connectors (1 Tx + 1 Rx).
          One Base-12 MPO breaks out to six LC-duplex pairs, fully utilizing all 12 fibers. This is the
          standard breakout model for legacy 10G/40G SFP+/QSFP+ plants.
        </p>

        <Table
          headers={['Scenario', 'Best base', 'Utilization', 'Notes']}
          rows={[
            ['100G/400G parallel optic (SR4, DR4, QSFP-DD)', 'Base-8', '100%', 'Native 8-fiber transceiver; one MPO per link'],
            ['800G 8-lane parallel optic (DR8)', 'Base-16 or 2× Base-8', '100%', 'Base-16 ferrules now appearing in spec sheets; Base-8 pairs are the building block'],
            ['LC-duplex breakout for 10G/40G SFP+/QSFP+', 'Base-12', '100%', '6 LC-duplex pairs per MPO; entire ferrule used'],
            ['Mixed 10G legacy + 100G upgrade (brown-field)', 'Base-12 (short-term) → Base-8 (long-term)', 'Varies', 'Practical compromise; plan fiber management carefully'],
          ]}
        />

        <Callout kind="book" title="TIA-568.3-D governs structured-cabling optical components">
          TIA-568.3-D specifies optical cabling components and connector mating at the structured-cabling
          level. Clause-level MPO specifications are in that document (paywalled). Vendor whitepapers from
          Corning, CommScope, FS, and Belden converge on the utilization arithmetic above and are consistent
          across multiple independent sources. [UNVERIFIED at clause level — TIA-568.3-D paywalled; use
          vendor whitepapers as planning guidance and confirm against the standard for design submittals.]
        </Callout>

        <Callout kind="field" title="Green-field is Base-8; brown-field is mixed">
          Practitioner consensus on r/cabling (2023–2025): "If your switch port is QSFP-DD DR4, you want
          Base-8 trunks. If you're pulling LC-duplex breakouts to legacy ports, you can still get value
          from Base-12." New builds designed for 100G+ from day one are overwhelmingly Base-8. Brown-field
          upgrades from 10/40G often retain Base-12 trunk infrastructure and manage the 4-dark-fiber waste
          as a migration cost.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="10.5 Thermal Management — Hot-Aisle/Cold-Aisle and Containment">
        <p>
          <strong>Hot-aisle/cold-aisle (HACA)</strong> is a rack-layout principle: alternate rows of
          cabinets face front-to-front (cold aisle) and back-to-back (hot aisle), with perforated raised
          floor tiles supplying cool air only in the cold aisle. This reduces direct hot-exhaust
          recirculation compared to random rack orientation.
        </p>
        <p className="mt-2">
          <strong>Containment</strong> is the additional step of physically enclosing either the cold aisle
          (cold-aisle containment, CAC) or the hot aisle (hot-aisle containment, HAC) to prevent bypass
          mixing of supply and return air. ASHRAE TC 9.9 modern guidance consistently identifies containment
          as the primary efficiency lever; uncontained HACA still allows significant air bypass that
          reduces effective cooling capacity. [VERIFIED-via-secondary-source — ASHRAE TC 9.9 public
          white papers and third-party summaries]
        </p>

        <Table
          headers={['Approach', 'What it does', 'Limitation', 'Typical PUE impact']}
          rows={[
            ['Basic HACA (no containment)', 'Reduces hotspot recirculation vs random layout', 'Bypass air mixing still significant; hot and cold air meet at aisle ends and above racks', 'Modest'],
            ['Cold-aisle containment (CAC)', 'Encloses cold aisle; forces all supply air through server intakes', 'Return air (hot) still mixes in open room; requires sufficient CRAC/CRAH capacity above and around', 'Significant'],
            ['Hot-aisle containment (HAC)', 'Encloses hot aisle and ducts directly to CRAH return; room stays cool', 'Higher overhead infrastructure cost; preferred for high rack densities', 'Significant; preferred in dense deployments'],
            ['In-row / rear-door cooling', 'Places cooling at the rack row; eliminates long air paths', 'Higher infrastructure cost; liquid connections at each row', 'Highest efficiency at density'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          PUE impact characterisations from ASHRAE TC 9.9 public white papers and widely-cited engineering
          summaries [VERIFIED-via-secondary-source]. Exact PUE thresholds by class require ASHRAE 2024
          Technical Bulletin (paywalled) [UNVERIFIED for verbatim numeric thresholds].
        </p>

        <Callout kind="book" title="ASHRAE TC 9.9 — A1 through A4 and H1 classes">
          ASHRAE TC 9.9 defines server inlet temperature and humidity envelopes by equipment class:
          A1 (tightest, legacy servers), A2, A3, A4 (progressively more tolerant), and the newer H1 class
          for high-density AI/GPU equipment. The A4 and H1 classes enable higher supply air temperatures
          that improve free-cooling hours and PUE. Exact inlet temperature ranges are in the TC 9.9
          Thermal Guidelines document (available from ASHRAE bookstore) and in publicly accessible
          engineering summaries. [VERIFIED-via-secondary-source — CKY Engineering TC 9.9 summary;
          ASHRAE public white papers for storage and power equipment]
        </Callout>

        <Callout kind="field" title="Teach containment, not just orientation">
          A student who passes the "hot-aisle/cold-aisle" question but does not understand containment
          will design a layout that performs significantly below its potential. HACA orientation is the
          prerequisite; containment is the efficiency multiplier. Modern data-center design specifications
          — including ANSI/BICSI 002-2024 — address both [UNVERIFIED at clause level — paywalled].
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="10.6 ANSI/BICSI 002-2024 vs ANSI/TIA-942-C — Scope Comparison">
        <p>
          Both ANSI/BICSI 002-2024 and ANSI/TIA-942-C (May 2024) are valid U.S. data-center standards
          and are routinely cited together in RFPs. They are <em>not</em> interchangeable or redundant:
          they address different scopes, and a well-written specification uses both deliberately.
        </p>

        <Table
          headers={['Dimension', 'ANSI/BICSI 002-2024', 'ANSI/TIA-942-C (May 2024)']}
          rows={[
            ['Scope emphasis', 'Design + operations + commissioning + energy + lifecycle; broad', 'Infrastructure specifications (telecom, arch, electrical, mechanical); narrow'],
            ['Chapter/section count', 'Approximately 17 chapters, 12 appendices, ≈575 pages [VERIFIED-via-secondary-source]', 'Not publicly confirmed without paid document [UNVERIFIED]'],
            ['Rating/certification path', 'Does not itself carry an infrastructure "Rating" system equivalent to TIA-942 Rated 1–4', 'Defines Rated 1–4; third-party assessors certify against it'],
            ['Liquid cooling / immersion', 'Expanded section in 2024 edition [VERIFIED-via-secondary-source]', 'Addressed; AI Addendum (2027) will expand further [VERIFIED-public-source]'],
            ['Site selection / energy', 'Included', 'Not primary focus'],
            ['Primary exam relevance', 'BICSI RCDD, BICSI DC specialist exams', 'TIA-942 Rating assessments; also referenced in BICSI exam blueprints'],
            ['Paywalled?', 'Yes (~US$650 BICSI member price) [VERIFIED-public-source — BICSI storefront]', 'Yes (~US$799) [VERIFIED-public-source — TIA storefront]'],
          ]}
        />

        <Callout kind="book" title="The standard practitioner framing">
          Senior RCDDs and TIA assessors consistently describe the pairing as: BICSI 002 supplies
          process and design breadth (operations, commissioning, energy, site); TIA-942 supplies
          the infrastructure conformance criteria you certify against. In a U.S. RFP, expect
          to see both cited. If only one is cited, ask why.
          [Source: BICSI Community practitioner discussions; BICSI public white papers and webinars;
          Let's Talk Cabling podcast — Chuck Bowser RCDD — VERIFIED-via-secondary-source]
        </Callout>

        <Callout kind="field" title="RFP language watch">
          The phrase "per ANSI/BICSI 002 and TIA-942 Rated-3" is well-formed and specific.
          The phrase "per TIA-942 Tier III" is malformed (Tier is Uptime's term).
          The phrase "per current data center standards" is meaningless — always push
          back for the specific edition and certification tier/rating.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="10.7 Forthcoming Standards — DCE 9000 and the TIA-942-C AI Addendum">
        <p>
          The mission brief for this module referenced "2026 TIA Quality Standards."
          That exact phrase does not match any published TIA document. The research log
          (§1, §5) identifies the two forthcoming standards that were almost certainly
          intended. <strong>Both are non-binding until formally published.</strong>
        </p>

        <h3 className="text-base font-semibold mt-4 mb-2">
          TIA QuEST Forum DCE 9000 — Data Center Excellence QMS
        </h3>
        <p>
          DCE 9000 is a quality management system standard for data center operations, modelled
          on ISO 9001, TL 9000, IATF 16949, and AS 9100. It is being developed by the TIA
          QuEST Forum. Target timeline: draft September 2026, full publication 2027.
          [VERIFIED-public-source — Data Centre Magazine and PRNewswire press releases, confirmed
          independently]
        </p>
        <Callout kind="verify" title="DCE 9000 — forthcoming, not yet binding">
          DCE 9000 has not been published as of this module's writing (May 2026). Do not treat
          it as a current compliance requirement. Watch the TIA QuEST Forum announcement channel
          for draft release; public comment periods will precede final publication.
        </Callout>

        <h3 className="text-base font-semibold mt-4 mb-2">
          ANSI/TIA-942-C Addendum 1: Artificial Intelligence (AI Addendum)
        </h3>
        <p>
          TIA TR-42.1 is developing an addendum to TIA-942-C specifically addressing GPU-cluster
          density, liquid and immersion cooling, and very-high-speed cabling requirements driven
          by AI workloads. Target publication: mid-2027.
          [VERIFIED-public-source — TelecomReseller, March 2026]
        </p>
        <Callout kind="verify" title="AI Addendum — forthcoming, not yet binding">
          The TIA-942-C AI Addendum is announced but unpublished. Current module content is
          based on ANSI/TIA-942-C (May 2024) only. When the Addendum publishes, its provisions
          on GPU density, liquid cooling, and high-speed cabling will supersede or supplement the
          base standard's guidance on those topics.
        </Callout>

        <Callout kind="field" title="Why this matters now">
          Data-center designers specifying GPU-cluster infrastructure in 2026 are already working
          beyond the published standard. The AI Addendum is being developed <em>because</em> the
          market outran TIA-942-C. This is the normal pattern: standards codify proven practice;
          they do not lead it. Design to the published standard (TIA-942-C, May 2024) and document
          any deviations from it explicitly.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="10.8 Scenario-Based Exam">
        <InteractiveQuiz title="Module 10 — Data Center Standards" questions={M10_QUESTIONS} />
      </Section>

      <RefList items={[
        { tag: 'book',   text: 'TIA — ANSI/TIA-942-C product page (current revision, May 2024)',                url: 'https://tiaonline.org/products-and-services/tia942certification/ansi-tia-942-standard/' },
        { tag: 'book',   text: 'TIA — TIA-942-C white paper (2024, publicly hosted PDF)',                       url: 'https://tiaonline.org/wp-content/uploads/2024/05/TIA-942-C-DC-infrastructure-stadard_TIA-white-paper.pdf' },
        { tag: 'book',   text: 'Uptime Institute — Press release: Uptime / TIA separation (2014)',              url: 'https://uptimeinstitute.com/about-ui/press-releases/uptime-tia' },
        { tag: 'book',   text: 'Uptime Journal — Myths and Misconceptions Regarding the Tier System',           url: 'https://journal.uptimeinstitute.com/myths-and-misconceptions-regarding-the-uptime-institutes-tier-certification-system/' },
        { tag: 'book',   text: 'BICSI — ANSI/BICSI 002-2024 standard store (paywalled)',                        url: 'https://www.bicsi.org/standards/available-standards-store/single-purchase/ansi-bicsi-002-the-standard-for-data-center-design' },
        { tag: 'book',   text: 'ASHRAE TC 9.9 — Committee landing page',                                        url: 'https://tpc.ashrae.org/?cmtKey=fd4a4ee6-96a3-4f61-8b85-43418dfa988d' },
        { tag: 'book',   text: 'IEEE 802.3 — Standard landing page (100G/400G/800G Ethernet)',                  url: 'https://www.ieee802.org/3/' },
        { tag: 'book',   text: 'Data Centre Magazine — TIA DCE 9000 announcement',                              url: 'https://datacentremagazine.com/news/tia-new-data-center-quality-standard-arriving-in-2026' },
        { tag: 'book',   text: 'PRNewswire — TIA QuEST Forum DCE 9000 progress announcement',                   url: 'https://www.prnewswire.com/news-releases/tia-quest-forum-to-present-dce-9000-quality-standard-progress-at-data-center-world-webinar-sub-teams-accelerate-draft-development-302756644.html' },
        { tag: 'book',   text: 'TelecomReseller — TIA-942-C AI Addendum announcement (March 2026)',             url: 'https://telecomreseller.com/2026/03/26/tia-advances-ai-ready-data-centers-with-new-ansitia942-addendum-global-certification-leadership-and-expanded-industry-quality-initiative/' },
        { tag: 'forum',  text: 'Belden — Introducing ANSI/TIA-942-C: recent updates',                           url: 'https://www.belden.com/blog/introducing-ansi-tia-942-c-recent-updates-to-data-center-standards' },
        { tag: 'forum',  text: 'Data Center Frontier — TIA-942-C covers fiber connectivity, cabinet widths',    url: 'https://www.datacenterfrontier.com/design/article/33037194/c-revision-of-tia-942-data-center-standard-specifies-for-fiber-connectivity-cabinet-widths' },
        { tag: 'forum',  text: 'Cabling Installation & Maintenance — TIA-942-C changes overview',               url: 'https://www.cablinginstall.com/standards/article/55245177/tia-942-c-data-center-standard-brings-a-host-of-changes-and-updates' },
        { tag: 'forum',  text: 'Cabling Installation & Maintenance — ANSI/BICSI 002-2024 press release',        url: 'https://www.cablinginstall.com/standards/press-release/55056414/updated-bicsi-data-center-standard-prescribes-design-and-implementation-best-practices' },
        { tag: 'forum',  text: 'EPI — Uptime Tier vs TIA-942: a short history',                                 url: 'https://www.epi-ap.com/content/28/291/Uptime_vs_TIA-942:_A_short_history' },
        { tag: 'forum',  text: 'TechTarget — Uptime data center tier standards definition',                     url: 'https://www.techtarget.com/searchdatacenter/definition/Uptime-data-center-tier-standards' },
        { tag: 'forum',  text: 'Wolontek — Base-8 vs Base-12 MPO fiber cabling',                                url: 'https://www.wolontek.com/base-8-vs-base-12-mpo-fiber-cabling/' },
        { tag: 'forum',  text: 'FS.com — Base-8 vs Base-12 MTP/MPO cabling system',                            url: 'https://community.fs.com/article/base-8-vs-base-12-mtp-mpo-cabling-system.html' },
        { tag: 'forum',  text: 'Network-Switch — MPO/MTP 8 vs 12 vs 24: the 2026 guide',                       url: 'https://network-switch.com/blogs/networking/mtpmpo-8-vs-12-vs-24-the-2026-guide' },
        { tag: 'forum',  text: 'CKY Engineering — ASHRAE TC 9.9 data center thermal guidelines',                url: 'https://www.cky.com.tw/en/insights/ashrae-tc9-datacenter-thermal-guidelines' },
        { tag: 'forum',  text: 'Let\'s Talk Cabling (Chuck Bowser RCDD) — data center episodes',                url: 'https://letstalkcabling.com/' },
        { tag: 'verify', text: 'ANSI/TIA-942-C clause-level values (fuel storage hours, exact redundancy thresholds, Annex F) — paywalled (~US$799). Confirm from paid document before sealing design specifications.' },
        { tag: 'verify', text: 'ANSI/BICSI 002-2024 clause-level values (PUE thresholds by class, exact chapter citations) — paywalled (~US$650 member price). Confirm from paid document.' },
        { tag: 'verify', text: 'TIA-568.3-D MPO/MTP clause-level specifications — paywalled. Vendor whitepapers used as proxies throughout Section 10.4.' },
        { tag: 'verify', text: 'TIA QuEST Forum DCE 9000 and TIA-942-C AI Addendum — forthcoming; not yet published as of May 2026. Do not cite as binding requirements.' },
      ]} />
    </article>
  );
}

/* ===================================================================
   QUESTION BANK — Module 10
   =================================================================== */

const M10_QUESTIONS = [
  {
    id: 'm10-q1',
    type: 'mc',
    prompt: 'An RFP specifies "TIA-942 Tier III certification." What is the most accurate response to this requirement?',
    choices: [
      '"TIA-942 Tier III" is valid terminology; proceed with a TIA-942 Rated-3 assessment.',
      '"TIA-942 Tier III" does not exist as a standard phrase. TIA-942-C uses "Rated-3"; "Tier III" is Uptime Institute terminology. The RFP author must clarify which certification body and framework is required.',
      'The facility must obtain both Uptime Tier III and TIA-942 Rated-3 certificates to comply.',
      'TIA-942 superseded the Uptime Tier Standard in 2024; they are now equivalent.',
    ],
    answerIndex: 1,
    explanation: '"TIA-942 Tier III" is a malformed phrase. ANSI/TIA-942-C uses "Rated" with Arabic numerals (Rated-3). "Tier III" is a trademark of the Uptime Institute, which separated from TIA\'s program in 2014. They are different certification programs, different organizations, and different assessment methodologies. The correct action is to push back on the RFP and get a clarification.',
    citation: 'ANSI/TIA-942-C (May 2024) [VERIFIED-public-source — TIA product page]; Uptime Institute press release on separation from TIA (2014) [VERIFIED-public-source]; EPI — Uptime vs TIA-942 history [VERIFIED-via-secondary-source].',
    fieldNote: 'This scenario happens on real RFPs. Colo operators routinely hold both certificates because customers, insurers, and hyperscale tenants each recognize different credentials. When you see the mixed phrase, it is almost always a copywriter error or a legacy template — clarify before pricing.',
  },
  {
    id: 'm10-q2',
    type: 'mc',
    prompt: 'A vendor slide deck states "Tier III data centers guarantee 99.982% uptime per Uptime Institute standards." Which statement best evaluates this claim?',
    choices: [
      'Accurate — 99.982% is the published Uptime Tier III SLA target.',
      'Accurate for TIA-942 Rated-3, not for Uptime Tier III.',
      'The 99.982% figure comes from a historical Uptime white paper. The current Uptime Tier Standard does not publish a single availability percentage, and TIA-942-C does not either. This figure is historical and no longer represents what either certification body tests against.',
      'Accurate, but only applies to facilities certified before 2014.',
    ],
    answerIndex: 2,
    explanation: 'The 99.671 / 99.741 / 99.982 / 99.995% table originates from an early Uptime Institute white paper (1990s). The current Uptime Tier Standard and ANSI/TIA-942-C both explicitly do not publish single SLA percentages as certification criteria. These historical numbers continue to circulate in vendor marketing and are widely reproduced, but they do not describe what certification bodies assess against today.',
    citation: 'Uptime Journal — "Myths and Misconceptions" article [VERIFIED-public-source]; r/datacenter and r/networking practitioner commentary on vendor deck attribution errors [field insight].',
    fieldNote: 'Expect to see these numbers in every third vendor presentation. The correct exam posture: label them "historical Uptime white paper, not current standard." The correct job posture: do not commit an SLA to a tenant based on these figures without verifying what the facility\'s actual operational resilience achieves.',
  },
  {
    id: 'm10-q3',
    type: 'mc',
    prompt: 'You are designing a new MDA (Main Distribution Area) in a TIA-942-C compliant data center. What minimum cabinet width does ANSI/TIA-942-C specify for cabinets in the MDA, IDA, and HDA?',
    choices: [
      '600 mm — the historical industry standard',
      '700 mm — the compromise between 600 mm legacy and new-build requirements',
      '800 mm — per the -C revision (May 2024)',
      '1000 mm — required for high-density cable management',
    ],
    answerIndex: 2,
    explanation: 'ANSI/TIA-942-C (May 2024) raises the minimum cabinet width requirement for MDA, IDA, and HDA areas to 800 mm. The previous 600 mm standard persists in many existing installations, but a new build targeting TIA-942 compliance must specify 800 mm cabinets in those areas. Note: 600 mm cabinets in existing facilities are not retroactively de-certified by this change.',
    citation: 'ANSI/TIA-942-C (May 2024), corroborated by Belden blog, Data Center Frontier, and Cabling Installation & Maintenance [VERIFIED-via-secondary-source]. Clause-level language paywalled [UNVERIFIED at clause level].',
    fieldNote: 'The 800 mm requirement is a real retrofit pain point. LinkedIn discussions on the -C release noted that a literal reading forces cabinet replacement in existing MDA rows, but assessors evaluate new construction. Many operating facilities will remain at 600 mm indefinitely because the standard does not require retroactive replacement.',
  },
  {
    id: 'm10-q4',
    type: 'mc',
    prompt: 'A new 400G spine-leaf deployment uses 400GBASE-DR4 transceivers (QSFP-DD, 4 Tx + 4 Rx, 8-fiber parallel optic). Which MPO/MTP trunk base maximizes fiber utilization for these transceivers?',
    choices: [
      'Base-12 — the standard for all data center structured cabling',
      'Base-8 — matches the 8-fiber transceiver lane count exactly, yielding 100% utilization',
      'Base-24 — provides headroom for future expansion',
      'Base-12 — because 400G requires more fibers than Base-8 can support per link',
    ],
    answerIndex: 1,
    explanation: '400GBASE-DR4 uses 4 transmit + 4 receive lanes = 8 fibers per link. A Base-8 MPO trunk carries exactly 8 fibers, so one MPO connector supports one 400G link at 100% fiber utilization. A Base-12 trunk would leave 4 fibers dark per link (8/12 = 67% utilization). At spine-leaf scale with hundreds of links, Base-12 wastes thousands of fibers. Base-8 is the engineered choice for parallel-optic parallel transceiver deployments.',
    citation: 'IEEE 802.3 (400GBASE-DR4 lane count) [VERIFIED-public-source]; Corning, CommScope, FS, Belden, Wolontek vendor whitepapers on Base-8 vs Base-12 [VERIFIED-via-secondary-source].',
    fieldNote: 'The only good reason to use Base-12 trunks in a 400G-native design is if the existing building fiber plant is Base-12 and replacement is out of scope. In that case, document the 4-dark-fiber waste per link in the fiber management system and plan the next truck-roll as a Base-8 replacement.',
  },
  {
    id: 'm10-q5',
    type: 'mc',
    prompt: 'ANSI/BICSI 002-2024 and ANSI/TIA-942-C are both cited in a U.S. data-center RFP. Which statement best describes the correct way to use them together?',
    choices: [
      'They are redundant — meeting one standard means meeting both.',
      'BICSI 002 governs cabling; TIA-942-C governs electrical and mechanical systems.',
      'TIA-942-C provides infrastructure conformance criteria (telecom, arch, electrical, mechanical Ratings 1–4); BICSI 002-2024 provides broader design, operations, commissioning, and energy guidance. Both are cited together because they complement rather than duplicate each other.',
      'BICSI 002-2024 supersedes TIA-942-C for new construction after May 2024.',
    ],
    answerIndex: 2,
    explanation: 'ANSI/BICSI 002-2024 is a broad design and operations standard (~575 pages, 17 chapters) covering site selection, commissioning, energy, and lifecycle. ANSI/TIA-942-C is narrower: it specifies infrastructure configurations and defines the Rated 1–4 conformance criteria that third-party assessors certify against. Senior RCDDs consistently describe the pairing as BICSI 002 for process/breadth and TIA-942 for certifiable conformance criteria. Neither supersedes the other.',
    citation: 'BICSI storefront — ANSI/BICSI 002-2024 description [VERIFIED-public-source]; Cabling Installation & Maintenance BICSI 002-2024 press release [VERIFIED-via-secondary-source]; BICSI Community and Let\'s Talk Cabling podcast practitioner framing [VERIFIED-via-secondary-source].',
    fieldNote: 'When only one is cited in an RFP, push back. An RFP that cites TIA-942 Rated-3 but not BICSI 002 may be under-specifying operational requirements. An RFP that cites only BICSI 002 may not be able to offer TIA-certified infrastructure.',
  },
  {
    id: 'm10-q6',
    type: 'dragdrop',
    prompt: 'Match each transceiver / deployment scenario (left) to the MPO/MTP base that delivers 100% fiber utilization (right). Drag each scenario to its efficient base.',
    items: [
      { id: 'i-100g-sr4',  label: '100GBASE-SR4 (4+4 lane, 8-fiber)' },
      { id: 'i-400g-dr4',  label: '400GBASE-DR4 (4+4 lane, 8-fiber)' },
      { id: 'i-800g-dr8',  label: '800GBASE-DR8 (8+8 lane, 16-fiber)' },
      { id: 'i-lc-duplex', label: 'LC-duplex breakout for 10G SFP+' },
    ],
    targets: [
      { id: 't-base8',  label: 'Base-8 MPO (8-fiber ferrule)' },
      { id: 't-base12', label: 'Base-12 MPO (12-fiber ferrule)' },
      { id: 't-base16', label: 'Base-16 MPO (16-fiber ferrule)' },
    ],
    correctMap: {
      't-base8':  'i-100g-sr4',
      't-base12': 'i-lc-duplex',
      't-base16': 'i-800g-dr8',
    },
    explanation: '100GBASE-SR4 and 400GBASE-DR4 both use 8 fibers (4 Tx + 4 Rx) — Base-8 MPO gives 100% utilization for both. 800GBASE-DR8 uses 16 fibers (8 Tx + 8 Rx) — Base-16 MPO is the native match (or two Base-8 connectors). LC-duplex breakout for 10G SFP+ uses 2 fibers per link; one Base-12 MPO breaks to 6 LC-duplex pairs, consuming all 12 fibers at 100% efficiency. Note: because the drag-drop exercise has one slot per target and both 100G-SR4 and 400G-DR4 map to Base-8, the exercise places 100G-SR4 as the Base-8 answer to keep one-to-one pairing.',
    citation: 'IEEE 802.3 lane counts [VERIFIED-public-source]; vendor whitepapers (Corning, FS, Wolontek, Belden) [VERIFIED-via-secondary-source].',
    fieldNote: 'In real deployments, both 100G-SR4 and 400G-DR4 use Base-8. The Base-16 MPO ferrule is a newer specification entering data-sheet language as 800G deployments scale; verify availability from your structured-cabling vendor before specifying it.',
  },
];
