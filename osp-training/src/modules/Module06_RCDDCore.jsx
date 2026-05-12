import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';

/**
 * Module 6 — RCDD Prep: Core Building Systems
 *
 * Editorial posture (per docs/research-logs/module06-rcdd-core.md §5):
 *  - BICSI TDMM 15th is paywalled ($300+); referenced by topic, never quoted.
 *  - TIA-569-E and TIA-607-E are paywalled; values sourced from public
 *    secondary sources (Winnie Industries, Border States, EC&M, NECA/BICSI 607-2011 PDF).
 *  - UL 1479 system listings are publicly searchable at UL Product iQ
 *    (free account); exact second/third-letter mapping table is paywalled.
 *  - IEEE 1100 full text is paywalled; abstract/overview are free.
 *  - FCC 47 CFR Part 15 Subpart B is public law (eCFR); values cited direct.
 *  - Every numeric claim tagged per docs/field-vs-textbook-research.md rules.
 */
export default function Module06_RCDDCore() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={6}
        title="RCDD Prep: Building ICT Systems"
        intro="ICT distribution architecture, firestopping (UL 1479 / ASTM E814 ratings, listed systems, Engineering Judgment), electromagnetic compatibility (FCC Part 15), power/telecom separation (TIA-569), grounding and bonding (TIA-607 / IEEE 1100), surge protection and primary protectors (UL 497/497A/497B). Topical scope mirrors the RCDD exam blueprint for building telecom infrastructure. TDMM 15th is paywalled — every numeric claim is sourced to a public document or tagged UNVERIFIED."
      />

      {/* ------------------------------------------------------------------ */}
      <Section title="6.1 ICT Distribution — TR to Work Area">
        <p>
          The RCDD exam tests your ability to design the{' '}
          <strong>horizontal distribution system</strong> from a{' '}
          <strong>Telecommunications Room (TR)</strong> to work-area outlets,
          and the <strong>backbone cabling</strong> that connects TRs to the
          main distribution frame (MDF) or entrance facility (EF).
          TIA-568 governs the cabling; TIA-569 governs the pathways and spaces
          those cables run through.
        </p>

        <p className="mt-2">
          Key topology rules that appear on the exam:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>Horizontal channel max length: 100 m</strong> (Cat 6A / OM4
            / OM5), broken down as 90 m permanent link + 10 m for equipment and
            patch cords. This is a TIA-568 figure and is well-established in
            public summaries.
          </li>
          <li>
            <strong>TR sizing:</strong> TIA-569 prescribes minimum floor area
            based on served floor area — one TR per floor per 1,000 m² (≈ 10,000 ft²)
            of served area is a frequently cited planning benchmark.
          </li>
          <li>
            <strong>Backbone topology:</strong> star topology required (no daisy
            chain). Each TR connects to the MDF/EF; TRs do not connect to each
            other in the distribution system.
          </li>
        </ul>

        <Callout kind="book" title="TIA-568 / TIA-569 public framing">
          The 100 m channel / 90 m permanent-link values are universally
          reproduced in public vendor literature (CommScope, Panduit, Belden)
          and FOA reference material — treat them as well-verified.
          TIA-569-E for pathway sizing is paywalled; the 1,000 m² figure
          appears in multiple independent design guides.
        </Callout>

        <Callout kind="field" title="What designers actually size TRs for">
          The 10,000 ft² rule is a starting point. In practice, high-density
          floors (trading floors, open-plan offices, healthcare nursing
          stations) push the ratio to one TR per 5,000–7,000 ft² because of
          port density, not cable length. Size the TR for the equipment and
          cooling that will actually live there, not just the cable count.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="6.2 Firestopping — UL 1479 / ASTM E814 Ratings">
        <p>
          Every cable penetration through a <strong>fire-rated barrier</strong>{' '}
          (fire wall, floor, fire partition, smoke barrier) must be sealed with a{' '}
          <strong>listed firestop system</strong> tested under{' '}
          <strong>UL 1479</strong> (ANSI/UL 1479, Fire Tests of
          Through-Penetration Firestops) or the equivalent{' '}
          <strong>ASTM E814</strong>. The IBC and NFPA 101 both invoke these
          tests. UL-listed systems are publicly searchable at{' '}
          <a href="https://productiq.ulprospector.com/en" target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-amber-200">
            UL Product iQ
          </a>{' '}
          (free account, free PDF download per system).
        </p>

        <h3 className="font-semibold mt-4 mb-2 text-slate-100">The four ratings — F, T, L, W</h3>

        <Table
          headers={['Rating', 'What it measures', 'Typical requirement', 'Source tag']}
          rows={[
            [
              'F — Flame',
              'Hours the assembly resists passage of flame through the barrier',
              'Required on all through-penetrations in fire-rated barriers; must equal or exceed the barrier\'s fire rating',
              'VERIFIED-via-secondary-source: IFC PEN2 primer; Unique Fire Stop Products',
            ],
            [
              'T — Temperature',
              'Hours that the unexposed-side temperature rise stays ≤ 325 °F (181 °C) above ambient',
              'Required for fire walls and horizontal floor penetrations wherever combustibles can contact the unexposed face',
              'VERIFIED-via-secondary-source: same sources; T ≤ F always',
            ],
            [
              'L — Smoke/Air Leakage',
              'cfm of air leakage at ambient and at 400 °F through the sealed penetration',
              'Mandatory in smoke-resistive assemblies under IBC / NFPA 101 for certain occupancies (e.g., I-2 healthcare)',
              'VERIFIED-via-secondary-source: Unique Fire Stop Products',
            ],
            [
              'W — Water',
              'Withstands a 3-ft water column for 72 hours, followed by UL 1479 fire and hose-stream test. Introduced 2004.',
              'Required for floor penetrations subject to sprinkler discharge or mop water; exterior wall penetrations',
              'VERIFIED-via-secondary-source: Unique Fire Stop Products',
            ],
          ]}
        />

        <Callout kind="verify" title="F is the universal floor; L and W are conditional">
          On most commercial jobs, the spec says "F-rating = T-rating = barrier
          rating" and stops there. L-rating is added when the building code
          requires a smoke-resistive assembly (look for "S" designation on the
          architectural drawings). W-rating appears on floor slabs near mechanical
          areas. Field crews who don't read the spec's rating requirement before
          installing caulk systems get called back for L-rated re-dos in healthcare.
        </Callout>

        <h3 className="font-semibold mt-4 mb-2 text-slate-100">Reading a UL system number</h3>
        <p>
          UL system numbers follow a structured naming scheme. For
          through-penetration cable firestops, the most-cited prefixes are:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>W</strong> — <em>wall</em> barrier (fire-resistive wall
            assembly).
          </li>
          <li>
            <strong>F</strong> — <em>floor</em> only.
          </li>
          <li>
            <strong>C</strong> — <em>floor or wall</em> (most versatile;
            commonly specified).
          </li>
        </ul>
        <p className="mt-2">
          The second and third letters encode barrier construction and penetrant
          family respectively. For example,{' '}
          <strong>W-L-3025</strong> is a wall penetration through a listed
          assembly, L-series (cable tray/cable bundles through gypsum-board wall).{' '}
          <strong>C-AJ-1xxx</strong> covers cables through concrete floor/wall.
          The full second/third-letter legend lives in UL's Fire Resistance
          Directory (paywalled), but individual system PDFs are free via
          UL Product iQ.
        </p>

        <Callout kind="book" title="How to actually find a system number on a job (UL Product iQ)">
          Navigate to productiq.ulprospector.com → Fire Resistance → Through
          Penetration Firestop Systems. Filter by: (1) barrier construction
          (concrete slab, gypsum board, CMU), (2) penetrant type (cable bundle,
          cable tray, conduit), (3) required F-rating. Download the system PDF.
          It specifies annular space limits, fill material, fill depth, cable
          load factor, and minimum lateral separation — all of which must be
          matched <em>exactly</em> for the listing to apply.
        </Callout>

        <Callout kind="verify" title="UL Product iQ second/third-letter mapping table: UNVERIFIED-needs-paid-doc">
          The consolidated legend for UL's second and third position codes is in
          the UL Fire Resistance Directory Vol. 2A/2B (paid). Free Product iQ
          shows individual systems but not a consolidated key. For exam purposes,
          know the first-letter W/F/C meaning; for job purposes, search by
          filter rather than trying to decode the full alphanumeric.
        </Callout>

        <h3 className="font-semibold mt-4 mb-2 text-slate-100">Cable load and annular space limits</h3>
        <p>
          Every listed UL firestop system specifies a maximum{' '}
          <strong>cable fill percentage</strong> and a permitted range of{' '}
          <strong>annular space</strong> (the gap between the cable bundle and
          the edge of the opening). Violating either parameter voids the listing.
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            Hilti engineering guidance: aggregate cable cross-sectional area
            inside a sleeve should not exceed{' '}
            <strong>60% of the sleeve's cross-sectional area</strong>.{' '}
            (VERIFIED-via-secondary-source: Hilti Engineering Q&amp;A.)
          </li>
          <li>
            Cable trays: aggregate cable fill separately limited to{' '}
            <strong>67% of the tray's cross-section</strong>.{' '}
            (VERIFIED-via-secondary-source: Hilti Engineering Q&amp;A.)
          </li>
          <li>
            Adjacent penetrations require a minimum{' '}
            <strong>3-inch lateral separation</strong> between penetrants in
            most listed systems — a recurring AHJ write-up when cable bundles
            are crammed into one rough opening.{' '}
            (VERIFIED-via-secondary-source: Building Code Forum thread.)
          </li>
        </ul>

        <Callout kind="field" title="Engineering Judgment (EJ) — the real world">
          The IBC requirement is clear: every penetration must match a tested,
          listed assembly <em>exactly</em>. Field reality: almost no installation
          matches the listed system perfectly. Common mismatches include:
          annular space outside the listed range, mineral wool density different
          from what was tested, or more cable rows than the listing allows.
          When this happens, the firestop manufacturer's technical service can
          issue an <strong>Engineering Judgment (EJ)</strong> — a written
          document stating that the unlisted variation is, in the manufacturer's
          engineering opinion, at least as effective as the tested assembly.
          An EJ is <em>not</em> a UL listing. AHJs vary widely in whether they
          accept EJs; the time to find out is before the pour, not at inspection.
          Teaching point: the EJ process is your fallback, but designing to the
          listing from the start is cheaper.
        </Callout>

        <Callout kind="field" title="Putty pads vs. caulk — designing for re-entry">
          The listed assembly is the assembly — cut into cured caulk and you
          void the listing. Field consensus: specify{' '}
          <strong>re-enterable systems</strong> (3M Fire Barrier Pillows, STI
          SpecSeal SSP putty pads) wherever future cable adds are likely. These
          are marketed explicitly as re-enterable; STI, for example, calls SSP
          "the most versatile firestopping product" partly for this reason.
          The exam answer is "follow the listing." The job answer is "design
          for the second cable run on day one."
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="6.3 Electromagnetic Compatibility — FCC Part 15">
        <p>
          ICT equipment sold or operated in the U.S. must comply with{' '}
          <strong>FCC Part 15</strong> (<strong>47 CFR Part 15</strong>),
          which regulates unintentional radiators. Two classes apply to
          building infrastructure:
        </p>

        <Table
          headers={['Class', 'Intended environment', 'Test distance', 'Relative stringency', 'Source tag']}
          rows={[
            [
              'Class A',
              'Commercial / industrial — equipment not intended for residential use',
              '10 m',
              'Less stringent baseline',
              'VERIFIED-public-source: 47 CFR §15.109, eCFR',
            ],
            [
              'Class B',
              'Residential — equipment may be used in a home',
              '3 m',
              '≈ 6–10 dB more stringent than Class A',
              'VERIFIED-public-source: 47 CFR §15.109, eCFR; cross-confirmed by Compliance Testing Inc.',
            ],
          ]}
        />

        <Callout kind="book" title="The 6–10 dB Class B advantage (VERIFIED-public-source)">
          The Class B limits in 47 CFR §15.109 Table 1 are roughly{' '}
          <strong>6–10 dB lower</strong> (more restrictive) than Class A at
          comparable frequencies, and the test is conducted at{' '}
          <strong>3 m</strong> rather than 10 m. Because a 3 m measurement
          captures more of the near-field, the effective design margin for a
          Class B product is significantly tighter. The RCDD exam expects you
          to know: Class A = commercial/industrial, 10 m; Class B = residential,
          3 m, ~6–10 dB tighter.
        </Callout>

        <p className="mt-2">
          For the ICT designer, FCC Part 15 matters most when:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            Selecting active equipment for a space — a Class A switch in a
            mixed-use building that includes residential units may fail FCC
            compliance or cause interference complaints.
          </li>
          <li>
            Routing structured cabling near potential emission sources —
            power-line harmonics, fluorescent ballasts, UPS units, and motor
            drives all generate conducted and radiated EMI that can couple
            onto unshielded telecom cables.
          </li>
          <li>
            Specifying shielded vs. unshielded cabling — shielded cable (F/UTP,
            S/FTP) provides an additional ~20–40 dB of isolation against
            external EMI, at the cost of requiring proper termination of the
            drain wire at both ends.
          </li>
        </ul>

        <Callout kind="field" title="Shielded cable requires a bonded drain — half the field forgets this">
          Shielded cable's EMI benefit is real only if the shield is properly
          bonded at both ends. A shield terminated at one end only is an
          antenna, not a shield. The field shortcut — "we'll use shielded
          cable just in case" without a proper drain-wire termination plan —
          often makes EMI worse, not better. Address it in the design spec or
          it becomes a commissioning surprise.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="6.4 Power / Telecom Separation — TIA-569">
        <p>
          The separation distances most ICT designers cite come from{' '}
          <strong>ANSI/TIA-569</strong> (Commercial Building Standard for
          Telecommunications Pathways and Spaces, currently TIA-569-E with
          Addendum 1). The table has carried forward with minor changes from
          TIA-569-A through 569-E.
        </p>

        <h3 className="font-semibold mt-4 mb-2 text-slate-100">
          TIA-569 cable separation table (VERIFIED-via-secondary-source)
        </h3>
        <p className="text-xs text-slate-300/60 mb-2">
          Source: Winnie Industries separation guide; Border States summary; Elliott Electric TIA-569 reference;
          CommScope SYSTIMAX TP-106296. Exact TIA-569-E wording is paywalled — treat
          these as planning values verified across four independent public summaries.
        </p>

        <Table
          headers={['Power circuit (unshielded)', 'Separation — open pathway', 'Separation — telecom in grounded metallic conduit', 'Separation — both in grounded metallic conduit']}
          rows={[
            ['< 2 kVA (unshielded)', '5 in. (≈ 127 mm)', '2.5 in. (≈ 64 mm)', '0 in. (no separation required)'],
            ['2–5 kVA (unshielded)', '12 in. (≈ 305 mm)', '6 in. (≈ 152 mm)', '0 in.'],
            ['> 5 kVA (unshielded)', '24 in. (≈ 610 mm)', '12 in. (≈ 305 mm)', '0 in.'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          "Reduce by half" when telecom is in a grounded metallic conduit.
          Separation reduces to zero when both telecom <em>and</em> power are
          in their own separate grounded metallic conduits. UNVERIFIED for
          exact TIA-569-E wording — values confirmed across multiple
          independent public summaries.
        </p>

        <Callout kind="book" title="RCDD exam answer: use the TIA-569 numbers">
          The exam will present a scenario involving power and telecom in the
          same cable tray or conduit space and ask for the required separation.
          The expected answer is the TIA-569 table above. Know the three
          circuit-size breakpoints (2 kVA, 5 kVA) and the three separation
          values (5&quot;, 12&quot;, 24&quot;) for the open-pathway / unshielded case.
        </Callout>

        <Callout kind="field" title="NEC vs. TIA-569 — the enforcement trap">
          NEC (Article 800 / 805) is largely silent on separation inches for
          telecom and power in the same pathway — it mostly requires that
          telecom conductors not be in the same raceway as power conductors
          above 300 V (with exceptions). The exact TIA-569 distances apply
          only when the project specification <em>references</em> TIA-569.
          On public projects, specs vary; some invoke TIA, many do not.
          Field reality: GCs and inspectors will write up violations citing
          "NEC" when the number actually comes from TIA-569, which is
          voluntary unless adopted in the spec. The trap on the RCDD exam
          is a question that expects the TIA-569 number — that is also the
          correct answer for any job with a TIA-compliant spec.
          (Source: Mike Holt forum — "Power &amp; Communication Separation" thread.)
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="6.5 Grounding and Bonding — TIA-607 / IEEE 1100">
        <p>
          The two standards that govern ICT grounding and bonding at customer
          premises are:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>ANSI/TIA-607-D / 607-E</strong> (2019/2022) — Generic
            Telecommunications Bonding and Grounding (Earthing) for Customer
            Premises. TIA-607-D (2019) renamed TMGB → PBB (Primary Bonding
            Busbar) and TGB → SBB (Secondary Bonding Busbar). Defines the
            PBB (TMGB) / SBB (TGB) / TBB hierarchy and conductor sizing.
          </li>
          <li>
            <strong>IEEE Std 1100-2005 ("Emerald Book")</strong> — Recommended
            Practice for Powering and Grounding Electronic Equipment. Chapter 9
            covers distributed computing / telecom systems. Core principle:
            single, common bonded grounding system for power, SPD, and telecom.
          </li>
        </ul>

        <h3 className="font-semibold mt-4 mb-2 text-slate-100">
          TIA-607 hierarchy: PBB (TMGB) → TBB → SBB (TGB)
        </h3>
        <p className="text-sm text-slate-300/80 mb-2">
          TIA-607-D (2019) renamed the busbars: TMGB → <strong>PBB</strong> (Primary Bonding Busbar)
          and TGB → <strong>SBB</strong> (Secondary Bonding Busbar). Both names appear on hardware labels and
          in field documentation; the current standard term and the exam expectation is PBB/SBB.
          See Module 5 for the full rename context.
        </p>
        <Table
          headers={['Element', 'Current name (TIA-607-D/E)', 'Former name', 'Location', 'Purpose']}
          rows={[
            ['Primary Bonding Busbar', 'PBB', 'TMGB', 'One per building, usually in the EF or MDF room', 'Primary bonding point; connected to the building\'s grounding electrode system (GES)'],
            ['Telecommunications Bonding Backbone', 'TBB', 'TBB (unchanged)', 'Runs vertically from PBB to each SBB', 'Bonds all SBBs to the PBB; sized by length (see below)'],
            ['Secondary Bonding Busbar', 'SBB', 'TGB', 'One per TR / telecom room', 'Local bonding point for equipment, cable shields, and SPDs in that TR'],
          ]}
        />

        <h3 className="font-semibold mt-3 mb-1 text-slate-100">TBB conductor sizing — TIA-607-D rule</h3>
        <p>
          TIA-607-D introduced a distance-proportional sizing rule:{' '}
          <strong>2 kcmil per linear foot of TBB length, maximum 750 kcmil</strong>.
          This replaced the older 3/0 AWG cap from TIA-607-B.
          (VERIFIED-via-secondary-source: NECA/BICSI 607-2011 free PDF; EC&M
          "Guidelines for Grounding and Bonding Telecom Systems.")
        </p>

        <Callout kind="book" title="2 kcmil/ft sizing rule (VERIFIED-via-secondary-source)">
          A TBB run of <strong>100 ft</strong> requires 2 × 100 = 200 kcmil
          (approximately 4/0 AWG). A 375 ft run requires 750 kcmil (the cap).
          In practice, most short TBBs (under 3 floors) calculate out to a
          conductor smaller than 6 AWG minimum, so the minimum wins. The
          exam wants the formula; the field installs the minimum for most
          buildings.
        </Callout>

        <Callout kind="field" title="Most short-run TBBs end up at the 6 AWG minimum">
          The math rarely justifies upsizing on typical commercial buildings of
          3–5 floors. A 30 ft TBB calculates to 60 kcmil — about 2 AWG — but
          the TIA minimum conductor applies and most installers default to 6 AWG
          (sometimes 4 AWG for future margin). The sizing formula exists for
          high-rise or data-center applications where the TBB is long.
        </Callout>

        <h3 className="font-semibold mt-4 mb-2 text-slate-100">
          Single-point bonded grounding — the IEEE 1100 principle
        </h3>
        <p>
          IEEE 1100 Chapter 9 is explicit:{' '}
          <strong>all grounding subsystems — power, lightning/SPD, and telecom —
          must be connected to a single, common bonded grounding system</strong>.
          Isolated or "clean" grounds for telecom or IT equipment are{' '}
          <strong>not recommended</strong> and the standard considers them unsafe.
          (VERIFIED-public-source: IEEE 1100 abstract, IEEE Standards Association
          page; EC&M Emerald Book overview.)
        </p>

        <Callout kind="warn" title="The isolated-ground myth — call it out explicitly">
          A persistent field misconception: run a separate "clean" earth electrode
          for the computer room or telecom equipment so it is not "polluted" by
          the building's ground. This is wrong for two reasons:
          <ol className="list-decimal pl-4 mt-1 space-y-1">
            <li>
              A separate, unbonded electrode creates a <em>ground potential
              difference</em> between the telecom system and everything else in
              the building — exactly the condition that drives damaging surge
              current through equipment.
            </li>
            <li>
              IEEE 1100 and TIA-607 both prohibit it. An AHJ can reject the
              installation.
            </li>
          </ol>
          The only legitimate isolated concept is a{' '}
          <strong>single-point grounded reference plane (SPGRP)</strong> — and
          even that must be <em>bonded back</em> to the building GES. If a
          customer insists on an "isolated" ground rod for their server room,
          the correct response is: explain the ground-potential-difference hazard,
          show them IEEE 1100, and propose a properly bonded common reference
          instead.
        </Callout>

        <Callout kind="field" title="Bonding PBB (formerly TMGB) to structural steel">
          TIA-607-D specifies that the PBB must be bonded to the building's
          grounding electrode system. Field practice is to also bond to
          building structural steel using an irreversible compression connection.
          Most AHJs accept this; TIA-607-D provides more specific guidance.
          Mike Holt forum consensus: bond to steel with a compression lug, and
          also run the NEC-required connection to the GES.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="6.6 Surge Protection and Primary Protectors — UL 497 Series">
        <p>
          The NEC (Article 800 in the 2020 code; reorganized to Article 805 in
          the 2023 NEC) requires a{' '}
          <strong>listed primary protector</strong> on any aerial
          telecommunications conductor entering a building, and on buried
          conductors that share or cross power facilities.
          (VERIFIED-via-secondary-source: Mike Holt forum, NEC Art. 800/805
          public summaries; NFPA free read-only viewer.)
        </p>

        <p className="mt-2">
          The UL 497 product family covers the three tiers of protection in the
          telecom circuit:
        </p>

        <Table
          headers={['UL Standard', 'Protector type', 'Where used', 'Typical technology']}
          rows={[
            [
              'UL 497',
              'Primary (listed primary protector)',
              'At the entrance facility (EF) / network demarcation, on every aerial or exposed buried telco pair',
              'Gas-tube arrester, carbon-block arrester — designed to clamp to earth in the presence of high voltage',
            ],
            [
              'UL 497A',
              'Secondary protector',
              'Downstream of a UL 497 primary, on distribution circuits < 150 V rms to ground',
              'Solid-state / gas-tube, lower let-through voltage; protects equipment after the primary has acted',
            ],
            [
              'UL 497B',
              'Isolated-loop protector',
              'Isolated-loop (current-loop) circuits',
              'Designed for the low-voltage / low-current characteristics of isolated-loop signaling circuits',
            ],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          VERIFIED-via-secondary-source: Transtector product literature;
          Eaton white paper SA01005003E. Exact UL 497 requirements paywalled
          at UL CSDS.
        </p>

        <Callout kind="book" title="NEC 2023 Article 800 → 805 reorganization">
          The 2023 NEC reorganized Chapter 8 (Communications Systems). What was
          Article 800 (Communications Circuits) is now Article 805 in most
          2023-edition jurisdictions. The substantive requirement — listed
          primary protector at every aerial entry — has not changed. RCDD exam
          questions written against the 2020 NEC still expect "Article 800";
          questions written against 2023 expect "Article 805." Know both.
        </Callout>

        <Callout kind="field" title="Primary protection on fiber — a common misconception">
          A surprising number of installers attempt to install a primary
          protector on a fiber cable at the EF, reasoning that "it's OSP, so
          it needs protection." This is incorrect for the fiber strands
          themselves: <strong>optical fiber carries no power</strong> and
          cannot conduct surge current. Per NEC, no electrical primary
          protector is required or meaningful on the glass.
          <br /><br />
          However: if the fiber cable has a{' '}
          <strong>metallic strength member</strong> (common in armored OSP
          cables), that metallic element <em>must</em> be bonded to the primary
          protector's grounding electrode (or directly to the GES) at the EF
          when it enters the building. The fiber doesn't get a protector; the
          metal does. Confusing these two is a recurring field error.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="6.7 Putting It Together — Design Checklist">
        <p>
          For an RCDD exam scenario involving a new multi-floor building ICT
          system, the key decision points and their governing standards:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong>Horizontal channel ≤ 100 m</strong> from TR to outlet
            (90 m permanent link + 10 m cords) → TIA-568.
          </li>
          <li>
            <strong>Every fire-wall / floor penetration</strong> must have a
            UL 1479-listed firestop system specifying F-rating, T-rating (floor
            penetrations), L-rating (smoke-resistive occupancies), W-rating
            (wet areas). Find system at UL Product iQ. EJ if field conditions
            deviate from listing.
          </li>
          <li>
            <strong>Power/telecom separation</strong>: 5&quot; / 12&quot; / 24&quot; per TIA-569
            (open pathway, unshielded power). Halved in grounded metallic
            conduit; zero if both in separate grounded metallic conduits.
          </li>
          <li>
            <strong>Equipment EMC class</strong>: Class A (commercial, 10 m
            test) or Class B (residential, 3 m test, ~6–10 dB tighter) per
            FCC Part 15 / 47 CFR §15.109.
          </li>
          <li>
            <strong>Grounding hierarchy</strong>: PBB / TMGB (bonded to GES) →
            TBB (2 kcmil/ft, 750 kcmil max) → SBB / TGB (per TR) → bond every
            equipment frame, cable shield, and SPD. No isolated grounds.
          </li>
          <li>
            <strong>Primary protection</strong>: UL 497 at every aerial telco
            entry per NEC Art. 800/805. UL 497A secondary downstream. UL 497B
            for isolated loops. Fiber strands: no protector needed; metallic
            strength members: bond to GES at EF.
          </li>
        </ul>

        <Callout kind="field" title="The order that gets things built right">
          Grounding and bonding must be designed before pathways are installed —
          not after. The TBB route, the TMGB location, and the GES bonding
          point are structural decisions. Trying to retrofit a compliant TBB
          after the building is closed in is expensive. Same for firestop:
          the AHJ wants to inspect before the opening is sealed, not after.
          Schedule the inspections into the construction sequence.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="6.8 Scenario-Based Exam">
        <InteractiveQuiz title="Module 6 — RCDD Core" questions={M6_QUESTIONS} />
      </Section>

      <RefList items={[
        { tag: 'book',   text: 'UL Solutions firestopping overview',                     url: 'https://www.ul.com/services/firestopping-joint-protection-and-perimeter-fire-containment-testing' },
        { tag: 'book',   text: 'UL Product iQ — free public firestop system database',   url: 'https://productiq.ulprospector.com/en' },
        { tag: 'book',   text: 'UL Solutions numbering systems explainer',                url: 'https://www.ul.com/thecodeauthority/knowledge/ul-solutions-numbering-systems' },
        { tag: 'book',   text: 'IFC PEN2 Firestop Basics Primer (PDF)',                  url: 'https://firestop.org/wp-content/uploads/2025/07/Firestop_basics_penetrations_PEN2-.pdf' },
        { tag: 'book',   text: 'Unique Fire Stop — F/T/L/W rating explainer',            url: 'https://www.uniquefirestop.com/what-do-the-ul-systems-acronyms-stand-for/' },
        { tag: 'book',   text: 'Cabling Install & Maint — UL 1479 through-penetration overview', url: 'https://www.cablinginstall.com/standards/cabling-standards/article/16465957/through-penetration-firestop-systems-and-ul-1479' },
        { tag: 'book',   text: 'Hilti — firestopping products and systems',              url: 'https://www.hilti.com/c/CLS_FIRESTOP_PROTECTION_7131' },
        { tag: 'book',   text: 'Hilti Engineering Q&A — annular space and cable fill (60%)', url: 'https://www.hilti.com/engineering/question/annular-space-query-and-general-clarification/0hthvy' },
        { tag: 'book',   text: 'STI Firestop Systems portal',                            url: 'https://systems.stifirestop.com/' },
        { tag: 'book',   text: 'STI — re-enterable putty/pillow systems',               url: 'https://www.stifirestop.com/news/whats-the-most-versatile-firestopping-product' },
        { tag: 'book',   text: '47 CFR Part 15 Subpart B — FCC unintentional radiator limits (eCFR, public law)', url: 'https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15/subpart-B' },
        { tag: 'book',   text: 'FCC Part 15 Class A / Class B explainer — Compliance Testing Inc.', url: 'https://compliancetesting.com/fcc-part-15-class-a-class-b-limits/' },
        { tag: 'book',   text: 'IEEE 1100 ("Emerald Book") standard page',              url: 'https://standards.ieee.org/ieee/1100/3055/' },
        { tag: 'book',   text: 'EC&M — overview of IEEE 1100 Emerald Book',             url: 'https://www.ecmweb.com/content/article/20887203/an-overview-of-ieee-1100-the-emerald-book' },
        { tag: 'book',   text: 'EC&M — guidelines for grounding and bonding telecom systems', url: 'https://www.ecmweb.com/basics/bonding-grounding/article/20896447/guidelines-for-grounding-and-bonding-telecom-systems' },
        { tag: 'book',   text: 'NECA/BICSI 607-2011 free PDF (TIA-607 bonding/grounding summary)', url: 'https://aux.bicsi.org/om/NECA-BICSI-607-2011.pdf' },
        { tag: 'book',   text: 'Winnie Industries — cable separation guide (TIA-569)',  url: 'https://winnieindustries.com/resources/knowledge_center/guides_main/cable_separation/' },
        { tag: 'book',   text: 'Border States — separation from sources of interference (TIA-569 summary)', url: 'https://solutions.borderstates.com/resources/separation-from-sources-of-interference/' },
        { tag: 'book',   text: 'Elliott Electric — TIA-569 cable separation reference',  url: 'https://www.elliottelectric.com/StaticPages/ElectricalReferences/DataComm/separation_interference.aspx' },
        { tag: 'book',   text: 'CommScope SYSTIMAX TP-106296 — power separation guidelines', url: 'https://www.commscope.com/globalassets/digizuite/3164-power-separation-guidelines-tp-106296-en.pdf' },
        { tag: 'book',   text: 'Eaton white paper SA01005003E — SPD/primary protection UL standards', url: 'https://www.eaton.com/content/dam/eaton/services/eess/eess-documents/sa01005003e.pdf' },
        { tag: 'forum',  text: 'Mike Holt forum — "Power & Communication Separation" (NEC vs. TIA-569 debate)', url: 'https://forums.mikeholt.com/threads/power-communication-separation.115529/' },
        { tag: 'forum',  text: 'Mike Holt forum — "Telecommunications grounding/bonding requirements"', url: 'https://forums.mikeholt.com/threads/telecommunications-grounding-bonding-requirements.141602/' },
        { tag: 'forum',  text: 'Mike Holt forum — "Telecomm bonding to steel"',          url: 'https://forums.mikeholt.com/threads/telecomm-bonding-to-steel.2551615/' },
        { tag: 'forum',  text: 'Building Code Forum — "Spacing of Through Penetration Firestop System" (3-inch AHJ debate)', url: 'https://www.thebuildingcodeforum.com/forum/threads/spacing-of-through-penetration-firestop-system.33832/' },
        { tag: 'verify', text: 'TIA-569-E exact wording and table values are paywalled (TIA store). Separation values verified across four independent public summaries; UNVERIFIED for exact revision-specific language.' },
        { tag: 'verify', text: 'TIA-607-E (2022) exact clause text is paywalled. Sizing rule (2 kcmil/ft, 750 kcmil max) verified via NECA/BICSI 607-2011 free PDF and EC&M secondary source.' },
        { tag: 'verify', text: 'UL 497 / 497A / 497B exact requirements are paywalled at UL CSDS. Values confirmed via Eaton white paper and Transtector product documentation.' },
        { tag: 'verify', text: 'IEEE 1100-2005 full text is paywalled. "Single bonded system" principle confirmed via free abstract at IEEE SA page and EC&M overview.' },
        { tag: 'verify', text: 'UL Fire Resistance Directory second/third-letter mapping table is paywalled. Individual systems freely searchable at UL Product iQ.' },
      ]}/>
    </article>
  );
}

/* =========================================================
   MODULE 6 EXAM QUESTIONS
   ========================================================= */
const M6_QUESTIONS = [
  {
    id: 'm6-q1',
    type: 'mc',
    prompt: 'A floor slab penetration for a cable bundle runs through a 2-hour fire-rated floor in a hospital (I-2 occupancy). The architect\'s life-safety drawings call for an "S" rating on all penetrations in this corridor. Which UL 1479 rating is MOST directly required by the "S" designation, in addition to the standard F-rating?',
    choices: [
      'T-rating (temperature rise on the unexposed side)',
      'L-rating (air/smoke leakage)',
      'W-rating (water tightness)',
      'No additional rating — F-rating alone satisfies "S".',
    ],
    answerIndex: 1,
    explanation: 'The "S" designation on an architectural drawing indicates a smoke-resistive assembly. The UL 1479 L-rating measures air/smoke leakage (in cfm) through the sealed penetration and is the rating mandated for smoke-resistive assemblies. IBC and NFPA 101 require L-rated firestop systems in smoke-resistive barriers for occupancies such as I-2 (healthcare). The T-rating applies to temperature rise in floors and certain walls — important but not what "S" uniquely triggers.',
    citation: 'UL 1479 L-rating: VERIFIED-via-secondary-source — IFC PEN2 primer; Unique Fire Stop Products F/T/L/W explainer. I-2 L-rating requirement: confirmed in multiple independent building-code summaries.',
    fieldNote: 'The most common field re-do: crew uses a caulk system listed for F = T only, then discovers at inspection that the smoke-compartment drawings required an L-rated assembly. STI and 3M both offer combined F/T/L systems; specify them up front in healthcare.',
  },
  {
    id: 'm6-q2',
    type: 'mc',
    prompt: 'A firestop installer seals a cable-bundle penetration through a concrete floor using a listed UL system that specifies a maximum annular space of 0.6 inches. The as-built annular space is 1.4 inches. The installer adds extra sealant to fill the gap. Which statement is correct?',
    choices: [
      'The installation is code-compliant because more sealant provides more protection.',
      'The installation voids the UL listing. The listed system must be installed as tested. If field conditions differ, the manufacturer\'s technical service must issue a written Engineering Judgment (EJ).',
      'The installation is acceptable under ASTM E814 because annular space over 1 inch is always permitted.',
      'The installer should have used a W-rated system instead.',
    ],
    answerIndex: 1,
    explanation: 'A UL 1479 listed firestop system is only valid when installed exactly as tested — including the stated annular space range. The listing specifies a minimum and maximum annular space; exceeding either parameter voids the listing. "More sealant" does not save the listing. When field conditions deviate from the tested parameters, the correct process is to obtain a written Engineering Judgment (EJ) from the manufacturer\'s technical service, which documents that the deviation is at least as effective. The EJ is not itself a UL listing, and AHJ acceptance of EJs varies.',
    citation: 'UL 1479 listing requirements: VERIFIED-public-source — UL Product iQ, IFC PEN2 primer. EJ process: VERIFIED-via-secondary-source — Hilti Engineering Ask; module06-rcdd-core research log §3.',
    fieldNote: 'Call the manufacturer\'s technical hotline before the penetration is sealed, not after. Most Hilti, 3M, and STI technical reps can issue a conditional EJ within 24–48 hours if you describe the deviation accurately. The phone call is free; the re-do is not.',
  },
  {
    id: 'm6-q3',
    type: 'mc',
    prompt: 'An unshielded 208 V / 3-phase branch circuit (3.8 kVA load) and a Cat 6A horizontal run share the same open cable tray for 60 feet. Per TIA-569, what is the minimum required separation between the power cable and the telecom cable in this open (non-metallic, unshielded) tray?',
    choices: [
      '5 inches (127 mm) — the < 2 kVA threshold applies.',
      '12 inches (305 mm) — the 2–5 kVA threshold applies.',
      '24 inches (610 mm) — the > 5 kVA threshold applies.',
      'No separation is required if the power cable has an outer jacket.',
    ],
    answerIndex: 1,
    explanation: '3.8 kVA falls in the 2–5 kVA band of the TIA-569 separation table. For an open (non-metallic, unshielded) pathway, TIA-569 requires 12 inches (≈ 305 mm) of separation. The 5-inch rule applies to circuits under 2 kVA; 24 inches applies to circuits over 5 kVA. Having an outer jacket on the power cable does not eliminate the TIA-569 separation requirement in an unshielded open tray.',
    citation: 'TIA-569 separation values: VERIFIED-via-secondary-source — Winnie Industries; Border States; Elliott Electric; CommScope TP-106296. Exact TIA-569-E wording: UNVERIFIED-needs-paid-doc.',
    fieldNote: 'The most common field violation in commercial construction: power circuits and Cat 6 sharing a wide cable tray with no divider, because no one in the coordination meeting read the TIA-569 table. Add a metal divider at mid-tray; dividers eliminate the separation requirement when both sides are in their own grounded metallic sections.',
  },
  {
    id: 'm6-q4',
    type: 'mc',
    prompt: 'A customer insists on installing a dedicated, unbonded grounding rod specifically for the new server room\'s PDUs and network switches, separate from the building\'s grounding electrode system (GES). They believe this "clean earth" will eliminate electrical noise. What should the RCDD communicate?',
    choices: [
      'Approve it — a dedicated earth improves signal quality and is a recognized design practice.',
      'Approve it with the condition that the rod must be at least 10 feet from the building foundation.',
      'Reject it — an unbonded separate electrode creates a ground potential difference between the telecom system and the rest of the building, increasing surge hazard. IEEE 1100 and TIA-607 prohibit isolated grounds. All subsystems must bond to a single common GES.',
      'Approve it — the NEC does not restrict the number of grounding electrodes.',
    ],
    answerIndex: 2,
    explanation: 'IEEE 1100 (Emerald Book) Chapter 9 explicitly recommends against isolated or "clean" grounds for electronic equipment. A separate, unbonded electrode introduces a ground potential difference between the server room equipment and the rest of the building — this is exactly the condition that allows damaging surge current to flow through equipment chassis and data ports. TIA-607 reinforces this: all telecommunications bonding and grounding must connect back to the building GES via the PBB (formerly TMGB) → TBB → SBB (formerly TGB) hierarchy. The correct alternative is a properly bonded common reference plane — still one bonding point back to the GES.',
    citation: 'IEEE 1100-2005 "single bonded system" principle: VERIFIED-public-source — IEEE SA abstract; EC&M Emerald Book overview. TIA-607: VERIFIED-via-secondary-source — NECA/BICSI 607-2011 PDF.',
    fieldNote: 'Every RCDD with 10+ years of field experience has met at least one customer who insists on the isolated ground rod. The teaching script: "The rod doesn\'t eliminate noise — it creates a path for surge. I can show you the IEEE 1100 abstract right now. Here\'s what we do instead."',
  },
  {
    id: 'm6-q5',
    type: 'mc',
    prompt: 'An armored OSP fiber cable (containing both glass fibers and a steel strength member) enters a building through the entrance facility conduit. Per NEC Article 800 / 805, which of the following is required at the entrance facility?',
    choices: [
      'A UL 497-listed primary protector installed on each fiber strand.',
      'A UL 497B isolated-loop protector on the cable.',
      'No action required — fiber cables are fully exempt from NEC primary protection requirements.',
      'The metallic strength member must be bonded to the building\'s grounding electrode system (or to the primary protector ground); the optical fibers themselves require no primary protector.',
    ],
    answerIndex: 3,
    explanation: 'NEC Article 800/805 requires a listed primary protector on aerial telecom conductors — "conductors" being the operative word. Optical fiber strands carry no electrical energy and cannot conduct surge current; no primary protector is required or meaningful on the glass. However, a steel (or other metallic) strength member in the cable jacket is a metallic conductor and must be bonded to ground at the entrance facility, per NEC requirements for metallic members of optical fiber cables. Failing to bond the strength member is a code violation and a real surge hazard.',
    citation: 'NEC Art. 800/805 primary protection requirement: VERIFIED-via-secondary-source — Mike Holt forum; NFPA 70 free read-only viewer. Fiber protector misconception: module06-rcdd-core research log §3 item 7; §5 editorial note.',
    fieldNote: 'A crew that installs a "fiber primary protector" at every OSP entry is wasting hardware and demonstrating a conceptual error on their as-builts. The write-up is: TMGB bonding lug, sized per TIA-607, connected to the metallic strength member by a listed compression fitting — nothing on the glass.',
  },
  {
    id: 'm6-q6',
    type: 'dragdrop',
    prompt: 'Match each field situation to the standard (or standard family) that primarily governs the required action.',
    items: [
      { id: 'tia569',   label: 'TIA-569' },
      { id: 'ul1479',   label: 'UL 1479' },
      { id: 'ieee1100', label: 'IEEE 1100' },
      { id: 'fccpt15',  label: 'FCC Part 15' },
      { id: 'ul497',    label: 'UL 497' },
    ],
    targets: [
      { id: 't1', label: 'A 4 kVA power circuit shares an open cable tray with Cat 6A — how many inches of separation?' },
      { id: 't2', label: 'A cable bundle penetrates a 2-hour fire-rated floor slab — what listing governs the sealant system?' },
      { id: 't3', label: 'Customer requests an isolated grounding electrode for server room equipment — which standard prohibits it?' },
      { id: 't4', label: 'A new network switch causes interference in adjacent radios — which FCC rule classifies the device?' },
      { id: 't5', label: 'Aerial copper telco pair enters the building entrance facility — what listing must the protector carry?' },
    ],
    correctMap: {
      t1: 'tia569',
      t2: 'ul1479',
      t3: 'ieee1100',
      t4: 'fccpt15',
      t5: 'ul497',
    },
    explanation: 'TIA-569 = pathway separation (5/12/24 in.). UL 1479 = fire test for through-penetration firestop listings. IEEE 1100 = Emerald Book, single-bonded grounding principle. FCC Part 15 = unintentional-radiator emission classes (Class A commercial, Class B residential). UL 497 = listed primary telecom protector at every aerial entry (required by NEC Art. 800/805).',
    citation: 'All values and standards verified per module06-rcdd-core.md research log §1–2. TIA-569 separation: VERIFIED-via-secondary-source (four public summaries). IEEE 1100 principle: VERIFIED-public-source (IEEE SA abstract). FCC §15.109: VERIFIED-public-source (eCFR).',
    fieldNote: 'On a real project these five standards all fire at once during the ICT coordination meeting. The RCDD\'s job is to know which standard "owns" each question, answer it with the right number, and tell the GC which of the five is enforceable under the spec they signed.',
  },
];
