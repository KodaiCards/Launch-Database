import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';

/**
 * Module 5 — Networking Blueprints
 *
 * Editorial posture (per docs/research-logs/module05-networking-blueprints-isp.md):
 *  - "Networking Blueprints" is this platform's name for what BICSI and
 *    the field call ISP (Inside Plant). The rename exists because "ISP"
 *    collides with "Internet Service Provider" in every non-telecom context.
 *    The field term is taught alongside the platform term throughout.
 *  - TIA standards are paywalled. Numeric citations come from public vendor
 *    guides (Anixter Standards Reference Guide), FOA TIA-568-C primer page,
 *    university IT infrastructure standards (Montana State, Fresno State,
 *    LSU 271100, WSU TDDG, UNM IT), and NECA/BICSI 607-2011 (free PDF).
 *  - TIA-607-D (July 2019) renamed TMGB → PBB and TGB → SBB. The field
 *    has not fully adopted the new names as of 2026. Both names are taught.
 *  - TBB conductor AWG-by-length table is tagged UNVERIFIED-needs-paid-doc
 *    (TIA-607-D Table; NECA/BICSI 607-2011 is a partial proxy only).
 *  - TR sizing tables (10×8 / 10×9 / 10×11 ft) are UNVERIFIED against
 *    BICSI TDMM 15th Edition (paid) — multiple university specs are used
 *    as secondary sources.
 */
export default function Module05_NetworkingBlueprints() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={5}
        title="Networking Blueprints"
        intro="Structured-cabling design for commercial buildings: spaces (MDF/IDF, EF/ER/TR/TC), backbone vs. horizontal subsystems, work-area outlets, and the ANSI/TIA-568/569/606/607 standard family. This is what BICSI and the field call ISP — Inside Plant — not to be confused with Internet Service Provider. The rename and the dual vocabulary are explained in Section 5.1."
      />

      {/* ------------------------------------------------------------------ */}
      <Section title="5.1  Why We Call This Module 'Networking Blueprints'">
        <p>
          This platform uses <strong>Networking Blueprints</strong> as the title for what
          BICSI's curriculum, TIA standards, and every contractor on the job calls{' '}
          <strong>ISP — Inside Plant</strong>. Reason: in every non-telecommunications
          context a student walks in with — IT, software, procurement, executive — the
          acronym "ISP" reads as <em>Internet Service Provider</em>: Comcast, Verizon,
          AT&T. Platform intake surveys bear this out consistently.
        </p>
        <p className="mt-2">
          The actual subject is the inside-the-building cabling and spaces blueprint that
          a telecom contractor reads from architectural drawings: pathway layout, rack
          elevations, cable routes, cross-connect design. "Networking Blueprints" names
          that deliverable.
        </p>
        <Callout kind="field" title="The field still says ISP">
          On bid documents, RFPs, BICSI exam materials, and job-site conversations,
          you will hear and read <strong>ISP</strong> constantly. This module always
          pairs the platform name with the field name. On first use in each section:{' '}
          <em>Networking Blueprints (what BICSI and the field call ISP — Inside Plant).</em>
        </Callout>
        <Callout kind="book" title="Platform editorial principle">
          This dual-vocabulary approach is part of the platform's core editorial
          signature documented in <em>docs/field-vs-textbook-research.md</em>: wherever
          the textbook answer and the field answer diverge, both are shown and labeled.
          The terminology gap between "ISP" and "Networking Blueprints" is itself an
          instance of that principle.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="5.2  The Four Telecommunications Spaces — and the MDF/IDF Translation">
        <p>
          TIA-568.1 and TIA-569 define spaces by function, not by colloquial nickname.
          The table below gives the formal TIA name, the field/IT synonym(s), and the
          role in the building's cabling hierarchy.
        </p>
        <Table
          headers={['TIA name', 'Field / IT synonym', 'Role']}
          rows={[
            ['Entrance Facility (EF)', 'Demarc room, carrier room', 'Access-provider cable enters the building, demarc (demarcation) equipment and protectors live here. May share space with the ER in small buildings.'],
            ['Equipment Room (ER)', 'MDF — Main Distribution Frame, Main Telecom Room', 'Houses the main cross-connect (MC), core network equipment, and PBX/UC systems. The "heart" of the building cabling plant.'],
            ['Telecommunications Room (TR)', 'IDF — Intermediate Distribution Frame, Wiring Closet, Comm Closet', 'One per floor; houses the horizontal cross-connect (HC) that feeds all work-area outlets on that floor.'],
            ['Telecommunications Enclosure (TE)', 'Telecom Closet, Zone Box', 'Smaller than a full TR; may serve a single zone or open-office area. TIA-569 allows TE as an alternative where a full room is not feasible.'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Source: Anixter Standards Reference Guide, FOA TIA-568-C primer (public);
          field synonyms from Montana State UIT Wiring Guidelines, Reddit r/cabling,
          r/networking (pattern-of-discussion, UNVERIFIED-deep-link-pending).
        </p>

        <Callout kind="book" title="Exam vocabulary: TIA names are the answer">
          BICSI RCDD and FOA CFOS/I exams use the TIA names — Equipment Room, not MDF;
          Telecommunications Room, not IDF. The formal names are also used in the
          ISO/IEC 11801 vocabulary (Main Distributor / Intermediate Distributor / Floor
          Distributor) which BICSI references alongside TIA.
        </Callout>
        <Callout kind="field" title="Job-site vocabulary: MDF/IDF are what you hear">
          Every RFP, every drawing title block, every BOQ on a real project will say
          MDF and IDF. Architects and electrical engineers use the same shortcuts. The
          TIA standard does <em>not</em> use "MDF" or "IDF" as formal terms — but you
          will be laughed at if you say "Equipment Room" when everyone around you says
          "MDF" and you do not immediately know what they mean.
        </Callout>

        <h3 className="text-base font-semibold mt-4">5.2.1  Equipment Room (ER / MDF) sizing</h3>
        <p>
          TIA-569 does not prescribe a fixed ER footprint for the main equipment room —
          it is sized to known equipment plus a growth allowance. Industry practice and
          BICSI TDMM guidance consistently cite <strong>50% future expansion</strong> as
          the planning target: if today's racks fill 200 sq ft of floor, design for 300.
        </p>
        <Callout kind="verify" title="BICSI TDMM 15th Edition — ER sizing">
          The 50% growth figure is widely repeated in university IT infrastructure
          specifications (Fresno State v11, LSU 271100, WSU TDDG) citing BICSI TDMM.
          The authoritative table is in BICSI TDMM 15th Edition (paid). Confirm from
          the paid source before committing to a design submittal.
        </Callout>

        <h3 className="text-base font-semibold mt-4">5.2.2  Telecommunications Room (TR / IDF) sizing</h3>
        <p>
          TIA-569 and BICSI TDMM give a serving-area-based sizing rule for TRs. The
          figures below are cited consistently across multiple university IT
          infrastructure specifications that explicitly reference TIA-569 and BICSI TDMM.
        </p>
        <Table
          headers={['Floor area served', 'Minimum TR footprint', 'Source tag']}
          rows={[
            ['≤ 5,000 sq ft', '10 ft × 8 ft', 'UNVERIFIED-needs-paid-doc — per Tarrant Co. IT, BIDMC IS, LSU 271100, WSU TDDG; primary = BICSI TDMM 15th (paid)'],
            ['5,001 – 8,000 sq ft', '10 ft × 9 ft', 'UNVERIFIED-needs-paid-doc — same secondary sources'],
            ['8,001 – 10,000 sq ft', '10 ft × 11 ft', 'UNVERIFIED-needs-paid-doc — same secondary sources'],
            ['> 10,000 sq ft or runs > 295 ft', 'Add a second TR (split zone)', 'UNVERIFIED-needs-paid-doc — consistent across university specs'],
          ]}
        />
        <Callout kind="verify" title="UNVERIFIED against BICSI TDMM 15th Edition">
          These TR sizing figures are reproduced in every university IT design guide
          reviewed, but the ultimate source (BICSI TDMM 15th Edition) is paywalled.
          Red Team: please confirm against the paid TDMM before this content ships.
        </Callout>

        <h3 className="text-base font-semibold mt-4">5.2.3  TR physical requirements</h3>
        <p>
          Minimum door and ceiling requirements are cited consistently in public
          university IT specifications referencing TIA-569:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>
            <strong>Door:</strong>{' '}
            minimum <strong>910 mm (36 in.) wide × 2,000 mm (80 in.) tall</strong>,
            no threshold sill, lockable, outward-opening where possible.{' '}
            [VERIFIED-via-secondary-source — multiple uni IT specs citing TIA-569]
          </li>
          <li>
            <strong>Ceiling clearance:</strong>{' '}
            minimum <strong>2,440 mm (8 ft)</strong> finished ceiling height, to allow
            overhead cable management ladders and headroom for pulling cable.{' '}
            [VERIFIED-via-secondary-source]
          </li>
          <li>
            <strong>TR stacking:</strong>{' '}
            TRs on successive floors should be stacked vertically so that a single
            riser sleeve serves the whole vertical stack — minimizes backbone
            pathway length and fire-stopping cost.
          </li>
          <li>
            <strong>No plumbing, no sprinkler heads directly over racks:</strong>{' '}
            TIA-569 prohibits water, drain, and steam pipes running through TRs;
            field practice mirrors this universally.
          </li>
        </ul>

        <h3 className="text-base font-semibold mt-4">5.2.4  Entrance Facility (EF) requirements</h3>
        <p>
          The EF must accommodate the access provider's demarc, the protector field
          (primary protection against over-voltage on incoming copper), and any
          carrier-provided equipment (DMARC extension, ONU/ONT). Key design constraints:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Separate from areas with electrical hazards — TIA-569 requires separation from electrical panels and switchgear.</li>
          <li>Access for carrier technician without building escort, if required by carrier agreement.</li>
          <li>Environmental conditioning — EF may be the entry point for outdoor temperature swings; maintain temperature/humidity within TIA ranges (typically 10–35 °C operating) [VERIFIED-via-secondary-source].</li>
          <li>In small buildings, the EF and ER are often physically combined in one room; design standards allow this provided equipment and demarc are clearly separated.</li>
        </ul>
        <Callout kind="field" title="The demarc is the carrier's property line">
          Everything on the carrier side of the demarc is their equipment, their
          responsibility, and — in the event of a problem — their obligation to fix.
          Everything on the customer side is yours. Marking and labeling the demarc
          point clearly on as-built drawings saves significant dispute time later.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="5.3  Backbone vs. Horizontal Cabling — The Hierarchical Star">
        <p>
          TIA-568.1 organizes a building's cabling into two subsystems. Understanding
          the boundary between them is the foundation of every structured-cabling design.
        </p>
        <Callout kind="book" title="The hierarchy: EF → ER → TR(s) → Work Area">
          Backbone cabling connects <strong>EF → ER → TR</strong> (and ER → ER in
          campus settings). Horizontal cabling connects <strong>TR → Work-Area
          Outlet</strong>. Each TR is a star hub for its floor's horizontal runs.
          The overall topology is a <em>hierarchical star</em> — backbone on the
          vertical (or riser) axis, horizontal radiating outward on each floor.
        </Callout>

        <h3 className="text-base font-semibold mt-4">5.3.1  Backbone cabling distances</h3>
        <p>
          Backbone distances in TIA-568.1 are informative guidance; the active
          application (Ethernet standard, protocol, transceiver) is the binding limit.
          The figures below are from Anixter and FOA summaries of TIA-568.1 [VERIFIED-via-secondary-source]:
        </p>
        <Table
          headers={['Media', 'TIA-568.1 informative guidance', 'Common application limit', 'Notes']}
          rows={[
            ['Single-mode fiber (OS1/OS2)', '≤ 3,000 m within cabling scope', '10GBASE-LR ≈ 10 km; 10GBASE-ER ≈ 40 km', 'Application governs; cabling standard is rarely the constraint'],
            ['Multimode OM3', '≤ 300 m backbone', '10GBASE-SR 300 m', 'Per IEEE 802.3ae'],
            ['Multimode OM4', '≤ 550 m backbone', '10GBASE-SR 400 m', 'Per IEEE 802.3by; OM4 longer than OM3 for SR'],
            ['Multimode OM5', '≤ 300 m backbone', '10GBASE-SR 100 m wideband', 'OM5 supports SWDM; SR distance shorter at higher speeds'],
            ['Balanced twisted-pair (voice/data backbone)', '≤ 800 m', 'Protocol-dependent', 'Per TIA-568.1 informative; rarely used for data backbone in new builds'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Source: Anixter Standards Reference Guide (public); FOA Loss Budget page
          (public). OM3/OM4/OM5 SR distances per IEEE 802.3 (VERIFIED-via-secondary-source).
        </p>
        <p className="mt-2">
          Cross-connect jumpers within the hierarchy also have limits:
          MC (Main Cross-connect) ≤ <strong>20 m</strong>;
          IC (Intermediate Cross-connect) ≤ <strong>20 m</strong>;
          equipment cords ≤ <strong>30 m</strong>.{' '}
          [VERIFIED-via-secondary-source — Anixter]
        </p>

        <h3 className="text-base font-semibold mt-4">5.3.2  Horizontal cabling — the famous 90 m / 100 m rule</h3>
        <p>
          The horizontal channel has a <strong>100 m total limit</strong>, broken into
          three segments:
        </p>
        <Table
          headers={['Segment', 'Max length', 'Description']}
          rows={[
            ['Permanent link', '90 m', 'Fixed cable in wall/ceiling/floor from TR HC to the outlet in the wall'],
            ['Work-area cord', '5 m', 'Patch cord from wall outlet to device (workstation, phone, AP)'],
            ['Equipment-room cord', '5 m', 'Patch cord from HC patch panel to switch/router port in TR'],
            ['Total channel', '100 m', '90 + 5 + 5 = 100 m maximum per TIA-568'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Source: Anixter Standards Reference Guide, FOA TIA-568-C primer, Wikipedia
          ANSI/TIA-568 article. [VERIFIED-via-secondary-source]
        </p>
        <Callout kind="book" title="90/100 m is a certification rule, not a physics cliff">
          The 90 m permanent-link limit is where TIA-568 draws the conformance line for
          Cat 5e through Cat 8. A cable run of 110 m may carry data at gigabit speeds
          without obvious errors, but it will <em>not pass certification testing</em>{' '}
          and it is non-conformant. The exam answer is <strong>90 m permanent link /
          100 m channel</strong>.
        </Callout>
        <Callout kind="field" title="Techs run longer; the test tells the truth">
          On the job, you will encounter runs of 105–115 m that have been in service
          for years. The margin that makes them "work" is the same margin TIA built in
          above the physics. The test will still flag them as failing. Field lesson:
          always certify your runs — the failing link is never the one you expect.
        </Callout>

        <h3 className="text-base font-semibold mt-4">5.3.3  The 165 ft / 50 m TR placement rule</h3>
        <p>
          TIA-569 recommends placing a TR at the <strong>center of its served floor area</strong>{' '}
          such that no work-area outlet requires more than approximately{' '}
          <strong>165 ft (50 m) of cable run</strong> from the TR to the outlet.
          This gives the designer half the 90 m permanent-link budget for the pathway
          itself, leaving margin for conduit bends and vertical drops.
          [VERIFIED-via-secondary-source — multiple university IT specs citing TIA-569]
        </p>
        <Callout kind="verify" title="50 m / 165 ft figure — TIA-569 revision check needed">
          This figure is consistently cited in public university IT design guides
          referencing TIA-569-C and -D. Whether TIA-569-E (the current revision)
          modified this language should be confirmed — Red Team, check against
          TIA-569-E (paid) before shipping.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="5.4  Work-Area Outlets and T568A / T568B Wiring">
        <p>
          The work-area outlet — the wall jack, data drop, or faceplate port the end
          user plugs into — is the termination point of the horizontal cabling
          subsystem. TIA-568 requirements for work-area outlets:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>
            <strong>Minimum two ports per work area</strong> — one for data, one for
            voice or secondary data. Mixed media is allowed on the same faceplate
            (e.g., UTP + fiber SC duplex).{' '}
            [VERIFIED-via-secondary-source — Anixter, FOA TIA-568-C primer]
          </li>
          <li>
            <strong>Work-area cord max 5 m</strong> — the cord from outlet to device.{' '}
            [VERIFIED-via-secondary-source]
          </li>
          <li>
            <strong>Outlet to be within reasonable reach of the work area</strong> — TIA
            uses a 3 m reach rule-of-thumb for outlet placement; AHJ / owner's program
            may specify closer spacing.
          </li>
        </ul>

        <h3 className="text-base font-semibold mt-4">5.4.1  T568A vs. T568B pin/pair assignment</h3>
        <p>
          Both T568A and T568B are conformant to TIA-568. The difference is the
          assignment of the orange and green pairs to pins 1–2 and 3–6:
        </p>
        <Table
          headers={['Pin', 'T568A color', 'T568B color', 'Pair']}
          rows={[
            ['1', 'White/Green', 'White/Orange', '2 (T568A) / 3 (T568B)'],
            ['2', 'Green', 'Orange', '2 (T568A) / 3 (T568B)'],
            ['3', 'White/Orange', 'White/Green', '3 (T568A) / 2 (T568B)'],
            ['4', 'Blue', 'Blue', '1'],
            ['5', 'White/Blue', 'White/Blue', '1'],
            ['6', 'Orange', 'Green', '3 (T568A) / 2 (T568B)'],
            ['7', 'White/Brown', 'White/Brown', '4'],
            ['8', 'Brown', 'Brown', '4'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Source: Anixter, FOA TIA-568-C primer, Wikipedia ANSI/TIA-568. [VERIFIED-via-secondary-source]
        </p>
        <Callout kind="book" title="TIA prefers T568A; T568B is widely used in the US">
          TIA-568 recommends T568A as the preferred wiring scheme. T568B is still fully
          conformant and remains the dominant choice in US commercial installations —
          largely for legacy compatibility with AT&T / EIA-568A wiring already in
          buildings.
        </Callout>
        <Callout kind="field" title="Mixing A and B creates a crossover — label it">
          If one end of a cable is punched T568A and the other end is T568B, you have
          made a <em>crossover cable</em>. On a GbE link (which auto-MDI/MDIX handles),
          this usually works. On older 10/100 equipment without auto-MDI/MDIX, it will
          not. Always punch both ends to the same standard on a straight-through link,
          and label any intentional crossover clearly. A mislabeled crossover in a
          patch panel is the source of more "random outage" tickets than any other
          single wiring error.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="5.5  ANSI/TIA-606-D Administration — The Four-Class Model">
        <p>
          <strong>ANSI/TIA-606-D (October 2021)</strong> defines how a cabling
          infrastructure is <em>labeled, documented, and administered</em>. It does not
          mandate a specific label format — it mandates <em>consistency and traceability</em>.
          The standard defines four administration classes based on installation scope:
        </p>
        <Table
          headers={['Class', 'Scope', 'Typical installation']}
          rows={[
            ['Class 1', 'Single equipment room, no backbone', 'Small office or retail; one room with a single patch panel'],
            ['Class 2', 'One building, multiple TRs and backbone', 'Typical commercial building; most mid-size campus deployments'],
            ['Class 3', 'Campus — multiple buildings', 'University quad, corporate campus, hospital campus'],
            ['Class 4', 'Enterprise / multi-site / external connections', 'Multi-building enterprise with WAN ties or data center links'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Source: Brady labeling guide, DuraLabel TIA-606 overview, AnD Cable Products
          Medium post, Silver Fox Labeling guide. [VERIFIED-via-secondary-source]
        </p>
        <Callout kind="verify" title="Mandatory identifier fields per class — UNVERIFIED detail">
          TIA-606-D also specifies which identifier fields are mandatory at each class
          (space ID, cable ID, connector ID, etc.). Red Team: confirm the exact
          minimum-field list against the paid TIA-606-D text before the Class 2+ content
          ships.
        </Callout>

        <h3 className="text-base font-semibold mt-4">5.5.1  Worked identifier example (Class 2 starter scheme)</h3>
        <p>
          The standard does not mandate a format; it requires traceability. A common
          project-starter scheme for a single-building (Class 2) installation:
        </p>
        <div className="mt-2 p-3 bg-white/5 rounded-lg font-mono text-sm text-amber-200 border border-white/10">
          <p><span className="text-slate-400">Format:</span>  [Building]-[Floor]-[Room/Rack]-[Port]</p>
          <p className="mt-1"><span className="text-slate-400">Example:</span> 01-A-12-03</p>
          <p className="mt-2 text-slate-300/70 font-sans text-xs">
            Building 01, Floor A (ground = A, first above grade = B…), Rack 12,
            Port 03. Adapt to project — add zone prefix, panel letter, fiber vs. copper
            suffix as needed.
          </p>
        </div>
        <Callout kind="field" title="Vendor templates are the real starting point">
          In practice, the designer does not invent an ID scheme from scratch. Brady,
          Panduit, HellermannTyton, and Silver Fox each publish a TIA-606-D-aligned
          label template. You download it, customize the prefix fields for the specific
          project, and print. The exam wants you to understand the four-class model and
          what makes an ID scheme "traceable." The job wants you to produce a label set
          the next tech can actually follow.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="5.6  Telecommunications Grounding and Bonding — TIA-607 and the PBB/SBB Rename">
        <p>
          <strong>ANSI/TIA-607</strong> (current revision: -E, with -D as the 2019
          revision that introduced the naming change) governs bonding and grounding for
          telecommunications systems in customer premises. The TBB (Telecommunications
          Bonding Backbone) ties every TR back to the main bonding busbar, keeping all
          telecom equipment at the same ground potential.
        </p>

        <h3 className="text-base font-semibold mt-4">5.6.1  The TMGB/TGB → PBB/SBB rename</h3>
        <p>
          This is one of the cleanest field-vs-textbook gaps in the platform.
          <strong> TIA-607-D (July 2019)</strong> renamed both busbars:
        </p>
        <Table
          headers={['Old name (TIA-607-A through -C, pre-2019)', 'New name (TIA-607-D and -E, 2019–present)', 'Location']}
          rows={[
            ['TMGB — Telecommunications Main Grounding Busbar', 'PBB — Primary Bonding Busbar', 'Equipment Room (ER / MDF); one per building'],
            ['TGB — Telecommunications Grounding Busbar', 'SBB — Secondary Bonding Busbar', 'Telecommunications Room (TR / IDF); one per TR'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Source: PDU Cables "Ken's Korner" (August 2019, TIA-607-D revision article);
          TIA announcement of TIA-607-E. [VERIFIED-via-secondary-source]
        </p>
        <Callout kind="field" title="Drawings, RFPs, and BOMs still say TMGB and TGB in 2026">
          Three reasons the field has not fully adopted PBB/SBB: (1) installed product
          is stamped with the old names; (2) most RCDDs credentialed before 2019;
          (3) the rename is not breaking — the physical object and its spec did not
          change. You will see TMGB and TGB on shop drawings through at least the
          early 2030s on retrofit projects.
        </Callout>
        <Callout kind="book" title="BICSI exam uses PBB/SBB; recognize both">
          Current BICSI RCDD exam content uses PBB and SBB. TMGB and TGB may still
          appear in older question stems — recognize both. When a question asks for
          "the current TIA-607 name," the answer is PBB / SBB.
        </Callout>

        <h3 className="text-base font-semibold mt-4">5.6.2  Busbar physical specifications</h3>
        <p>
          Both PBB and SBB must be copper, non-anodized (so connections can bite into
          bare copper), and predrilled for conductor attachment. Minimum dimensions per
          secondary sources:
        </p>
        <Table
          headers={['Busbar', 'Min thickness', 'Min width', 'Notes']}
          rows={[
            ['PBB (formerly TMGB)', '6.3 mm (¼ in.)', '100 mm (4 in.)', 'Length varies by design; one per building EF/ER. [VERIFIED-via-secondary-source — NECA/BICSI 607-2011, EC&M article, university IT specs]'],
            ['SBB (formerly TGB)', '6.3 mm (¼ in.)', '50 mm (2 in.)', 'Common off-the-shelf length 12 in.; one per TR. [VERIFIED-via-secondary-source — same sources]'],
          ]}
        />
        <Callout kind="book" title="The &lt;300 mV electrochemical-potential rule — exam favorite">
          TIA-607 limits the electrochemical potential difference between a connector
          and the busbar material to <strong>&lt; 300 mV</strong>. The intent: prevent
          galvanic corrosion at the connection point. On copper busbars, copper lugs are
          always acceptable; aluminum lugs are not.{' '}
          [VERIFIED-via-secondary-source — TIA-607-B excerpt at wiki.w9cr.net]
        </Callout>

        <h3 className="text-base font-semibold mt-4">5.6.3  Telecommunications Bonding Backbone (TBB) conductor sizing</h3>
        <p>
          The TBB is the conductor that runs from each SBB (TGB) back to the PBB (TMGB)
          in the ER. NECA/BICSI 607-2011 (free PDF at BICSI) and university IT specs
          cite a <strong>6 AWG copper minimum</strong> with upsizing required as
          backbone length increases per a length-vs-AWG table in TIA-607-D. The
          BCT (Bonding Conductor for Telecommunications) that ties the busbar to the
          building's grounding electrode system follows NEC Article 250 sizing.
        </p>
        <Callout kind="verify" title="UNVERIFIED: TBB AWG-by-length table">
          The exact TBB length-vs-AWG sizing table is in TIA-607-D (paywalled).
          NECA/BICSI 607-2011 contains a similar table, but it is uncertain whether
          TIA-607-D revised those values. This module ships with the{' '}
          <strong>6 AWG minimum</strong> as confirmed from NECA/BICSI 607-2011 and
          university specs; the full table is tagged UNVERIFIED-needs-paid-doc until
          Red Team confirms against TIA-607-D.
        </Callout>
        <Callout kind="field" title="What installers do">
          Field practice: pull the TBB with the backbone fiber in the same riser
          sleeve; size up one gauge from the calculated minimum as a margin against
          future TRs being added to the stack. Most institutional owners spec
          4 AWG or 2 AWG on the TBB regardless of the table, because upsizing once
          is cheaper than a rework pull.
        </Callout>

        <h3 className="text-base font-semibold mt-4">5.6.4  Insulated standoffs and bonding topology</h3>
        <p>
          Both PBB and SBB are mounted on <strong>insulated standoffs</strong> to
          electrically isolate them from the wall/rack. The busbar itself is bonded to
          the building grounding system through its BCT — it is not a floating bus.
          All telecommunications metalwork (cable trays, conduit, rack frames) in a TR
          is bonded to the SBB in that TR, creating a single-point grounding reference
          for the floor.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="5.7  The ANSI/TIA Standard Family — Quick Reference">
        <p>
          The structured-cabling standard family is a set of related documents, each
          governing a different aspect of the installation. This table is the mental
          model BICSI exams expect you to carry:
        </p>
        <Table
          headers={['Standard', 'Current revision', 'Governs', 'Source tag']}
          rows={[
            ['ANSI/TIA-568.0', '-E', 'Generic cabling — media and topology requirements applicable to any building type', 'VERIFIED-via-secondary-source — Anixter, FOA, FOTC summary'],
            ['ANSI/TIA-568.1', '-E', 'Commercial building cabling — the primary standard for structured cabling design and components', 'VERIFIED-via-secondary-source'],
            ['ANSI/TIA-568.2', '-E', 'Balanced twisted-pair cabling components (Cat 3 through Cat 8)', 'VERIFIED-via-secondary-source'],
            ['ANSI/TIA-568.3', '-D', 'Optical fiber cabling components (multimode OM1–OM5, single-mode OS1/OS2)', 'VERIFIED-via-secondary-source'],
            ['ANSI/TIA-569', '-E', 'Telecommunications pathways and spaces (conduit, cable trays, TR/ER sizing, TE)', 'VERIFIED-via-secondary-source — FOTC, CIM article on -E'],
            ['ANSI/TIA-606', '-D (Oct 2021)', 'Administration — labeling, documentation, identifier scheme (4-class model)', 'VERIFIED-via-secondary-source — Brady, DuraLabel, Silver Fox'],
            ['ANSI/TIA-607', '-E (current); -D = July 2019 rename revision', 'Bonding and grounding — PBB/SBB (TMGB/TGB), TBB, BCT', 'VERIFIED-via-secondary-source — PDU Cables Ken\'s Korner, TIA announcement'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          All TIA standards are paywalled. Letter revisions as of mid-2026 per secondary
          sources — confirm current revision at tiaonline.org before citing in a design
          submittal.
        </p>
        <Callout kind="verify" title="TIA-568.0-E vs. 568.1-E — normative scope question">
          Whether TIA-568.0-E (Generic) is informative or normative when TIA-568.1-E
          (Commercial) also applies to a project is a question BICSI RCDD candidates
          debate. The paid standard itself is the only authoritative answer. Red Team:
          flag this for the RCDD-prep annotation layer.
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="5.8  Scenario-Based Exam">
        <InteractiveQuiz title="Module 5 — Networking Blueprints" questions={M5_QUESTIONS} />
      </Section>

      <RefList items={[
        { tag: 'book',   text: 'FOA — TIA-568-C Premises Cabling primer (free)',               url: 'https://www.thefoa.org/tech/ref/premises/TIA568C.html' },
        { tag: 'book',   text: 'Anixter Standards Reference Guide (multi-section PDF)',         url: 'https://corpapps.anixter.com/DocLib1/BCV9E8ZP/$file/8W0091X0_IA_Stand_Ref_Guide.pdf' },
        { tag: 'book',   text: 'Fiber Optics Tech Consortium — TIA-568-1-E update',            url: 'https://www.tiafotc.org/tia-standards-update/tia-568-1-e/' },
        { tag: 'book',   text: 'Fiber Optics Tech Consortium — TIA-569-E update',              url: 'https://www.tiafotc.org/tia-standards-update/tia-569-e/' },
        { tag: 'book',   text: 'Cabling Install & Maint — TIA-569-E publication article',      url: 'https://www.cablinginstall.com/standards/article/14035859/tia-569-e-telecom-pathways-and-spaces-standard-published' },
        { tag: 'book',   text: 'PDU Cables Ken\'s Korner — TIA-607-D TMGB→PBB rename (2019)', url: 'https://www.pducables.com/kens-korners/2019/08/tia-607-d-latest-revision/' },
        { tag: 'book',   text: 'TIA announcement — ANSI/TIA-607-E (current revision)',         url: 'https://tiaonline.org/standardannouncement/tia-publishes-new-standard-ansi-tia-607-e-generic-telecommunications-bonding-and-grounding-earthing-for-customer-premises/' },
        { tag: 'book',   text: 'NECA/BICSI 607-2011 — Bonding and Grounding Methods (free PDF)', url: 'https://aux.bicsi.org/om/NECA-BICSI-607-2011.pdf' },
        { tag: 'book',   text: 'CommScope — Bonding and Grounding NETCONNECT whitepaper',      url: 'https://www.commscope.com/globalassets/digizuite/2075-bonding-and-grounding-netconnect-copper-cabling-systems-wp-111199-en.pdf' },
        { tag: 'book',   text: 'Montana State UIT — Wiring Guidelines: Rooms',                 url: 'https://www.montana.edu/uit/wiringguidelines/rooms.html' },
        { tag: 'book',   text: 'BICSI — Standards FAQ (free)',                                  url: 'https://www.bicsi.org/standards/bicsi-standards/resources/standards-frequently-asked-questions' },
        { tag: 'forum',  text: 'Reddit r/cabling — MDF vs IDF field consensus (UNVERIFIED-deep-link-pending)' },
        { tag: 'forum',  text: 'Reddit r/networking — IDF / wiring closet usage (UNVERIFIED-deep-link-pending)' },
        { tag: 'forum',  text: 'Reddit r/RCDD — TGB/TMGB vs. SBB/PBB on drawings (UNVERIFIED-deep-link-pending)' },
        { tag: 'verify', text: 'TIA-568, TIA-569, TIA-606, TIA-607 absolute table values are paywalled — confirm from paid copy (tiaonline.org) before sealing a design.' },
        { tag: 'verify', text: 'BICSI TDMM 15th Ed. TR sizing tables (10×8 / 10×9 / 10×11 ft) — confirm from paid TDMM before submitting a design.' },
        { tag: 'verify', text: 'TBB AWG-by-length table in TIA-607-D — NECA/BICSI 607-2011 is a partial proxy; confirm paid TIA-607-D table before spec-writing.' },
        { tag: 'verify', text: 'TIA-569-E — confirm whether 50 m / 165 ft TR placement figure persists in the -E revision vs. -D.' },
      ]}/>
    </article>
  );
}

/* ========================================================================= */
/*  Scenario-Based Exam Questions                                             */
/* ========================================================================= */

const M5_QUESTIONS = [
  {
    id: 'm5-q1',
    type: 'mc',
    prompt: 'A contractor\'s drawing labels the main telecom room "MDF" and each floor closet "IDF." Which TIA-569 formal terms do those labels correspond to?',
    choices: [
      'MDF = Entrance Facility (EF); IDF = Telecommunications Enclosure (TE)',
      'MDF = Equipment Room (ER); IDF = Telecommunications Room (TR)',
      'MDF = Main Cross-connect (MC); IDF = Horizontal Cross-connect (HC)',
      'MDF and IDF are formal TIA terms — no translation needed.',
    ],
    answerIndex: 1,
    explanation: 'TIA-568.1 and TIA-569 use Equipment Room (ER) for the main space (what the field calls MDF) and Telecommunications Room (TR) for floor-level closets (what the field calls IDF). MDF and IDF are field/IT vocabulary; they are not formal TIA terms.',
    citation: 'ANSI/TIA-568.1-E; ANSI/TIA-569-E. Anixter Standards Reference Guide (public); FOA TIA-568-C primer (public).',
    fieldNote: 'On the job, always use whatever vocabulary the client\'s RFP uses — saying "ER" when the client says "MDF" and won\'t say ER is more confusing, not less. Know both; use the room.',
  },
  {
    id: 'm5-q2',
    type: 'mc',
    prompt: 'A horizontal cable run measures 95 m from the TR patch panel to the wall outlet. The work-area cord is 5 m. The equipment-room cord is 5 m. Does this installation conform to TIA-568?',
    choices: [
      'Yes. The total channel is 105 m, which is within the 100 m channel limit.',
      'No. The permanent link is 95 m, which exceeds the 90 m permanent-link limit.',
      'Yes. The 100 m limit applies only to the work-area cord, not the fixed cable.',
      'No. The total channel is 105 m, but only by 5 m — this qualifies for a "variance" under TIA-568.',
    ],
    answerIndex: 1,
    explanation: 'TIA-568 limits the permanent link (fixed cable, TR to outlet) to 90 m, with a maximum channel of 100 m (90 + 5 WA cord + 5 ER cord). A 95 m permanent link is non-conformant regardless of cord lengths — it exceeds the 90 m permanent-link limit. There is no variance provision.',
    citation: 'ANSI/TIA-568.1-E, horizontal cabling subsystem. Anixter Standards Reference Guide; FOA TIA-568-C primer. [VERIFIED-via-secondary-source]',
    fieldNote: 'The cable "might work" electrically, but it will fail certification testing and it is non-conformant. On a warranty claim or a DOB inspection, the non-conformant run is the first thing flagged.',
  },
  {
    id: 'm5-q3',
    type: 'mc',
    prompt: 'ANSI/TIA-607-D (July 2019) renamed the main bonding busbar. What is the current name, and what was the previous name?',
    choices: [
      'Current: TMGB (Telecommunications Main Grounding Busbar); Previous: PBB (Primary Bonding Busbar)',
      'Current: PBB (Primary Bonding Busbar); Previous: TMGB (Telecommunications Main Grounding Busbar)',
      'Current: SBB (Secondary Bonding Busbar); Previous: TGB (Telecommunications Grounding Busbar)',
      'The standard has not changed the name — PBB and TMGB are synonyms in TIA-607-D.',
    ],
    answerIndex: 1,
    explanation: 'TIA-607-D (July 2019) renamed TMGB to PBB (Primary Bonding Busbar) for the main busbar in the ER, and TGB to SBB (Secondary Bonding Busbar) for the busbar in each TR. The physical object and its dimensional spec did not change — only the nomenclature.',
    citation: 'PDU Cables Ken\'s Korner, August 2019 (TIA-607-D revision review). TIA announcement for TIA-607-E (current revision). [VERIFIED-via-secondary-source]',
    fieldNote: 'As of 2026, shop drawings and RFPs still overwhelmingly use TMGB and TGB. When you see "TMGB" on a drawing, it means PBB. Both name sets appear on BICSI exam questions — the exam will use the current (PBB/SBB) terminology.',
  },
  {
    id: 'm5-q4',
    type: 'mc',
    prompt: 'A TR busbar (SBB / TGB) must meet minimum physical dimensions. Which option correctly states those minimums?',
    choices: [
      '3.2 mm thick × 100 mm wide, copper, anodized',
      '6.3 mm thick × 100 mm wide, copper, non-anodized',
      '6.3 mm thick × 50 mm wide, copper, non-anodized',
      '12 mm thick × 50 mm wide, aluminum, predrilled',
    ],
    answerIndex: 2,
    explanation: 'The SBB (formerly TGB) minimum is 6.3 mm (¼ in.) thick × 50 mm (2 in.) wide, copper, non-anodized, predrilled. The PBB (formerly TMGB) is wider: 6.3 mm × 100 mm (4 in.). Aluminum is not used — copper is required to avoid galvanic issues and keep electrochemical potential below 300 mV.',
    citation: 'NECA/BICSI 607-2011 (free PDF, BICSI), university IT specs (LSU, WSU, UNM). [VERIFIED-via-secondary-source; ultimate source TIA-607-D, paywalled]',
    fieldNote: 'Off-the-shelf SBBs are sold as "12-inch TGBs" by most distributors — the 12 in. length is common but not a minimum. The exam cares about 6.3 mm × 50 mm.',
  },
  {
    id: 'm5-q5',
    type: 'mc',
    prompt: 'A TIA-606-D Class 2 administration scheme applies to which installation scope?',
    choices: [
      'A single room with one equipment rack and no backbone cabling',
      'One building with multiple TRs and backbone cabling between them',
      'A campus of multiple buildings with inter-building links',
      'An enterprise with multiple sites connected by WAN links',
    ],
    answerIndex: 1,
    explanation: 'Class 1 = single room, no backbone. Class 2 = one building, multiple TRs, with backbone. Class 3 = multi-building campus. Class 4 = multi-site enterprise. Most commercial building projects fall into Class 2.',
    citation: 'ANSI/TIA-606-D (October 2021). Brady, DuraLabel, Silver Fox labeling guides (public). [VERIFIED-via-secondary-source]',
    fieldNote: 'Label vendors publish free Class 2 label templates. On real jobs, the designer downloads the template, customizes the building/floor/rack prefix fields, and hands the print file to the installer. The exam wants you to know the class model; the job wants a printable label set.',
  },
  {
    id: 'm5-q6',
    type: 'dragdrop',
    prompt: 'Match each installation space to the correct term from the TIA-568 / TIA-569 formal vocabulary.',
    items: [
      { id: 'ef',  label: 'Entrance Facility (EF)' },
      { id: 'er',  label: 'Equipment Room (ER)' },
      { id: 'tr',  label: 'Telecommunications Room (TR)' },
      { id: 'te',  label: 'Telecommunications Enclosure (TE)' },
    ],
    targets: [
      { id: 't-demarc', label: 'Room where the carrier\'s cable enters the building and the demarc device is installed' },
      { id: 't-mdf',    label: 'Main cross-connect (MC), core switches, PBX — what the field calls the MDF' },
      { id: 't-idf',    label: 'Floor-level horizontal cross-connect serving all outlets on that floor — what the field calls the IDF' },
      { id: 't-zone',   label: 'Compact alternative to a full TR; may serve a single zone or open-office area' },
    ],
    correctMap: {
      't-demarc': 'ef',
      't-mdf':    'er',
      't-idf':    'tr',
      't-zone':   'te',
    },
    explanation: 'EF = carrier demarc entry. ER = main equipment / MC / MDF. TR = floor closet / HC / IDF. TE = small zone enclosure, subset of TR scope. These four spaces form the physical backbone of a structured-cabling design.',
    citation: 'ANSI/TIA-568.1-E; ANSI/TIA-569-E. Anixter Standards Reference Guide; FOA TIA-568-C primer. [VERIFIED-via-secondary-source]',
    fieldNote: 'You will see all four terms on the BICSI RCDD exam. In the field, you will almost never hear "Equipment Room" — you will hear "MDF," "main room," or "server room." Map them mentally at every job walk.',
  },
];
