import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';

/**
 * Module 9 — OSP Construction
 *
 * Editorial posture (per docs/research-logs/module09-osp-construction.md Section 5):
 *  - Burial depth defaults: 18 in NEC floor (secondary source), 36 in direct-buried
 *    per RUS 1751F-630/-635 and OCC 206-4 (VERIFIED-public-source), 42-48 in for state
 *    DOT ROW per FDOT 18202 and CalTrans encroachment doc (VERIFIED-public-source).
 *    AHJ overrides everything; never design from the textbook number alone.
 *  - NESC IEEE C2 underground sections are paywalled — depth tables cited only via
 *    secondary source (state DOT manuals, RUS bulletins). Marked accordingly.
 *  - TIA-758-C is paywalled — referenced only via secondary source where needed.
 *    Marked UNVERIFIED-needs-paid-doc.
 *  - NEC 830.47 18-in floor is paywalled; widely reproduced in vendor literature.
 *    Cited VERIFIED-via-secondary-source.
 *  - RUS 1751F-643 innerduct color sequence: UNVERIFIED-needs-paid-doc. Innerduct
 *    color is taught as APWA convention (orange surface marker, verified) +
 *    contractor sub-duct convention (supplementary, unverified normative source).
 *  - Conduit fill 40% NEC (secondary source); 25%/40% BICSI/TIA (secondary source).
 *    Jetted microduct reality 50-70%+ cited from Mike Holt forum + vendor pages.
 *  - Pull tension 600 lbf for OSP loose-tube cable: Corning SRP-005-011, OCC 206-2,
 *    ICC article (VERIFIED-public-source). Always verify against the cable datasheet.
 *  - Call 811 / CGA Best Practices v19 and 2024 DIRT Report: VERIFIED-public-source.
 *  - As-built vs. as-designed gap: field-vs-book topic; taught with GIS tools cited.
 *  - Common Ground Alliance / Call 811: public source, cited directly.
 *  - FBA + Cartesian 2025 cost report: VERIFIED-public-source.
 */

export default function Module09_OSPConstruction() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={9}
        title="OSP Construction"
        intro="From the permit to the pull: installation methods (HDD, open trenching, plowing), burial depth rules, conduit fill and innerduct conventions, manhole and handhole placement, vault sizing, pull tension limits, slack loops, locate-before-dig obligations, and the as-built vs. as-designed reconciliation gap. NESC IEEE C2 underground sections and TIA-758-C are paywalled — depth guidance is cited via state DOT manuals (FDOT, VDOT, CalTrans) and RUS bulletins, which are public sources. Where a number is the AHJ's call, we say so."
      />

      {/* ---- Section 9.1 ---- */}
      <Section title="9.1 Locate before you dig — Call 811 and its limits">
        <p>
          The single legally required step before any ground disturbance in the U.S. is
          calling <strong>811</strong> — the national one-call number administered by the{' '}
          <strong>Common Ground Alliance (CGA)</strong>. The 811 system notifies member
          utilities, who then locate and mark their facilities within the applicable state
          notice window (commonly two to three business days). Marking follows the{' '}
          <strong>APWA Uniform Color Code</strong>:
        </p>
        <Table
          headers={['Color', 'Facility type']}
          rows={[
            ['White',  'Proposed excavation area'],
            ['Pink',   'Survey marks'],
            ['Red',    'Electric power lines, cables, conduit'],
            ['Yellow', 'Gas, oil, steam, petroleum'],
            ['Orange', 'Telecommunications and CATV'],
            ['Blue',   'Potable water'],
            ['Purple', 'Reclaimed water / irrigation'],
            ['Green',  'Sewers and drain lines'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Source: APWA color code, per CGA Marking Standards Manual v10 and APWA reference
          (SmartSign / Missouri 811). [VERIFIED-public-source]
        </p>
        <Callout kind="book" title="CGA Best Practices v19 and the 2024 DIRT Report">
          CGA Best Practices Guide v19 defines the complete workflow from ticket placement
          through positive response. The <strong>2024 DIRT Report</strong> recorded{' '}
          <strong>196,977 unique damages</strong> to underground utilities.{' '}
          <strong>Failure to notify 811</strong> was the root cause in <strong>24.5%</strong>{' '}
          of incidents — the single largest root cause category. Telecom facilities
          accounted for <strong>49%</strong> of damaged utilities in the reported subset.
          [VERIFIED-public-source — CGA, dirt.commongroundalliance.com]
        </Callout>
        <Callout kind="field" title="811 is the floor, not the ceiling">
          <strong>811 only locates utility-owned facilities.</strong> Private laterals —
          irrigation lines, electric drops from a meter to a detached garage, propane
          service lines, fire suppression feeds — are not registered in any one-call system
          and will not be marked. Contractors who rely solely on the 811 ticket routinely
          strike private infrastructure on residential jobs.
          <br /><br />
          Standard field practice: <em>pothole (hand-expose) every utility crossing before
          mechanized excavation begins.</em> Many state statutes now require positive marking
          and visual confirmation before running a trencher or drill rig.
          (Per GPRS, CGA Best Practices v19, multiple state one-call statutes.)
        </Callout>
        <Callout kind="verify" title="State-specific notice windows and penalties">
          Required notice periods, tolerance-zone widths, and civil penalties for
          violations vary by state law. Confirm the specific notice window and excavation
          tolerance zone with the applicable state one-call authority before bidding
          a job. [AHJ-dependent — confirm per jurisdiction]
        </Callout>
      </Section>

      {/* ---- Section 9.2 ---- */}
      <Section title="9.2 Installation method decision matrix: HDD, open trenching, and plowing">
        <p>
          Three primary methods place underground OSP conduit and cable. No single method
          dominates — the correct choice depends on soil type, rock content, water table,
          surface restoration cost, permit constraints, and crew equipment.
        </p>
        <Table
          headers={['Method', 'Best-fit conditions', 'Key limitation']}
          rows={[
            [
              'Horizontal Directional Drilling (HDD)',
              'Crossings under roads, rivers, railroads, paved areas; surface restoration is expensive or prohibited',
              'Higher mobilization cost; bore path can deviate from plan; mud management required',
            ],
            [
              'Open Trenching',
              'Short straight runs; conduit counts too high for plowing; existing infrastructure that must be bridged',
              'Maximum surface disruption; highest restoration cost per foot',
            ],
            [
              'Plowing (vibratory)',
              'Long rural runs in cooperative soil (clay, sandy loam, black dirt); single or multi-duct configuration',
              'Fails in rock, ledge, high water table, or near existing utilities; blade can deflect sharply',
            ],
          ]}
        />

        <Callout kind="book" title="FBA / Cartesian 2025 cost report — the ranking changes year to year">
          The <strong>2025 FBA / Cartesian Fiber Deployment Cost Annual Report</strong>{' '}
          reports rural plowing at a median of approximately <strong>$11.88/ft</strong> and
          rural open trenching at approximately <strong>$19.00/ft</strong>. Notably, the
          2023 report showed the reverse ranking — trenching cheaper than plowing — because
          the input data set changed. <em>Do not cite a single cost number as if it were
          fixed.</em> Teach the inputs, not the output. [VERIFIED-public-source — FBA /
          Cartesian reports]
        </Callout>
        <Callout kind="field" title="Iowa vs. Pennsylvania: why method choice is site-specific">
          A 12-mile rural spur in central Iowa black dirt: plowing typically wins by 30%+
          on cost and schedule. The same 12 miles in central Pennsylvania Appalachian shale:
          plowing fails on the first rod — the contractor switches to a rock-saw trencher
          or HDD and the per-foot cost doubles. Soil investigation before bidding is not
          optional.
        </Callout>
        <Callout kind="field" title="HDD bore profile vs. as-built">
          The bore profile on the locator log frequently diverges from the bore profile
          recorded in the as-built. Steering-tool readings are interpolated, not continuous,
          and the drill rod does not always follow the operator's correction inputs exactly
          in hard or uneven soils. This creates a direct as-built reconciliation problem
          (see Section 9.7). (Per Vermeer, Melfred Borzall, Ditch Witch installation guidance.)
        </Callout>
      </Section>

      {/* ---- Section 9.3 ---- */}
      <Section title="9.3 Burial depth — AHJ overrides the textbook number">
        <p>
          Minimum burial depth for direct-buried fiber and conduit is a layered requirement.
          The national reference floor is commonly cited from NEC and RUS. State DOT manuals
          set corridor-specific requirements that routinely exceed those floors. The AHJ's
          permit is what you actually build to.
        </p>
        <Table
          headers={['Context', 'Cited minimum', 'Source']}
          rows={[
            ['Direct-buried fiber, general', '36 in (91 cm)', 'RUS 1751F-630/-635, OCC 206-4 [VERIFIED-public-source]'],
            ['NEC 830.47 network-powered broadband direct burial', '18 in (absolute floor)', 'Widely reproduced in vendor literature [VERIFIED-via-secondary-source — NEC paywalled]'],
            ['FDOT ROW — fiber optic trench', 'Per trench profile in FDOT 18202', 'FDOT Standard Plan 18202 [VERIFIED-public-source]'],
            ['CalTrans state highway ROW', '≈ 42 in from surface; ≈ 4 ft from edge of pavement', 'CalTrans encroachment doc TR-0448 paraphrase [VERIFIED-via-secondary-source]'],
            ['VDOT ROW', 'Per IIM-LD-230 depth, bedding, and warning-tape requirements', 'VDOT IIM-LD-230 [VERIFIED-public-source — full reading required for exact dimension]'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          NESC IEEE C2 underground depth tables are paywalled. The table above uses public
          substitutes (RUS, state DOT manuals). [UNVERIFIED-needs-paid-doc for NESC underground
          sections specifically]
        </p>

        <Callout kind="book" title="AHJ depth bands to memorize for planning">
          A practical planning framework (from RUS bulletins, OCC 206-4, FDOT 18202,
          CalTrans encroachment doc):
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>18 in</strong> — NEC absolute floor for network-powered broadband direct burial (secondary source).</li>
            <li><strong>24–36 in</strong> — typical rural utility easement and general direct-buried fiber; 36 in is the RUS / OCC standard.</li>
            <li><strong>42–48 in</strong> — state DOT primary road ROW; CalTrans cites ~42 in within highway ROW.</li>
            <li><strong>Frost line + 6 in</strong> — governs in northern states when frost line exceeds the above bands.</li>
          </ul>
        </Callout>
        <Callout kind="field" title="Look up the AHJ depth before bidding">
          The textbook number is a starting point. The local construction permit is the
          binding number. Some municipal ROW permits 24 in with warning tape and a concrete
          cap; some county roads require 48 in; the utility easement on the same parcel may
          be 36 in. Depth conflicts between zones on a single route are common. Ask the AHJ
          before you set the blade depth on the plow.
        </Callout>
      </Section>

      {/* ---- Section 9.4 ---- */}
      <Section title="9.4 Conduit fill, innerduct color codes, and pull tension">

        <h3 className="text-base font-semibold mt-2 mb-1">Conduit fill</h3>
        <p>
          Conduit fill limits exist to preserve pulling access for future cables. Two
          reference frameworks are commonly cited:
        </p>
        <Table
          headers={['Standard / framework', 'Maximum fill ratio', 'Applicability', 'Source']}
          rows={[
            ['NEC Chapter 9 Table 1 (three or more conductors)', '40%', 'Electrical conductors in conduit; widely applied to telecom as a floor', 'NEC (paywalled); reproduced by Southwire, TSS, EleCalculator [VERIFIED-via-secondary-source]'],
            ['BICSI / TIA telecom innerduct convention', '25% initial / 40% maximum', 'Telecom sub-ducts pulling fiber cable', 'BICSI ITSIMM (paywalled); reproduced in vendor applications [VERIFIED-via-secondary-source]'],
            ['Jetted microduct (field practice)', '50–70%+ by cross-section', 'Air-blown fiber micro-cable into micro-duct', 'Mike Holt forum, vendor installations; BICSI ITSIMM acknowledges higher ratios for jetting [VERIFIED-via-secondary-source]'],
          ]}
        />
        <Callout kind="field" title="The 40% rule breaks on every microduct job">
          Air-jetting shops routinely load 1–7 microducts into a 1.25-in or 2-in conduit
          well past 40% cross-section fill because the jetting process eliminates the
          pulling-friction constraint the NEC rule was designed to address. The 40%
          NEC / 25–40% BICSI numbers are correct for traditional pull installation and are
          the exam answer. The microduct reality is 50–70%+ and is the job answer. Both
          are true, for different installation methods.
        </Callout>

        <h3 className="text-base font-semibold mt-4 mb-1">Innerduct color codes</h3>
        <p>
          <strong>APWA orange</strong> is the normative surface marking for telecommunications
          facilities. This is the color of the locate paint, flags, and warning tape — not
          necessarily the innerduct itself.
        </p>
        <p className="mt-2">
          Contractor and carrier convention commonly uses <strong>orange</strong> as the
          primary telecom innerduct, with green, blue, red, yellow, and black for
          additional sub-ducts in a multi-carrier conduit bundle. This is a working-practice
          convention, not a national standard.
        </p>
        <Callout kind="verify" title="RUS 1751F-643 innerduct color sequence">
          RUS Bulletin 1751F-643 (Underground Plant Design) covers conduit sections,
          formations, and cable racks for underground central-office vault design. Whether
          it prescribes a normative innerduct color sequence has <strong>not been
          independently verified</strong> at time of writing.{' '}
          [UNVERIFIED-needs-paid-doc for any RUS-prescribed innerduct color sequence]
          <br />
          Teach orange as the APWA-correct surface marker. Teach contractor sub-duct
          convention as supplementary, not normative.
        </Callout>

        <h3 className="text-base font-semibold mt-4 mb-1">Pull tension limits</h3>
        <p>
          Every fiber cable has a maximum installation pull tension specified in the
          manufacturer's datasheet. For a typical OSP loose-tube cable, this is commonly
          cited at <strong>600 lbf (2,670 N)</strong>. This is the exam number. For any
          specific cable on a real job, use the datasheet.
        </p>
        <Callout kind="book" title="600 lbf — the common OSP loose-tube figure">
          Corning SRP-005-011, OCC 206-2 general installation guidelines, and ICC's
          bend-radius / pull-tension reference all cite 600 lbf as a representative
          maximum for OSP loose-tube cable. Cable-specific datasheets may specify more or
          less. [VERIFIED-public-source — Corning, OCC, ICC]
        </Callout>
        <Callout kind="field" title="HDD pullback: the reel-side tension is not the bore-exit tension">
          In an HDD pullback, drag, drilling-mud weight, friction against the bore wall,
          and bore-path curvature all add load between the pull head and the cable reel.
          The tension gauge at the drill rig reads the applied force at the pipe string,
          not the force at the cable jacket.
          <br /><br />
          Standard practice: use a <strong>calibrated breakaway swivel</strong> set to
          the lowest-rated cable or sub-duct in the bundle as the safety device. Use the
          PPI MAB HDD Tensile Loads equations for the engineering calculation when the
          bore is long, curved, or involves multiple sub-ducts. Relying on the rig gauge
          alone is not sufficient. [Per PPI MAB HDD Tensile Loads, Corning SRP-005-011,
          OCC 206-2]
        </Callout>
      </Section>

      {/* ---- Section 9.5 ---- */}
      <Section title="9.5 Manhole, handhole, and vault placement and sizing">

        <h3 className="text-base font-semibold mt-2 mb-1">Placement spacing</h3>
        <p>
          The textbook planning interval for handholes and vaults along a conduit route is
          every <strong>500–1,000 ft</strong>, primarily to stay within pulling distances
          that keep tension below cable limits. This is guidance, not a normative standard.
        </p>
        <Callout kind="field" title="Spacing is geometry and access, not just distance">
          Vault placement is driven by bend-radius geometry, splice-trailer access, and
          AHJ road-cut policy as much as by cable-pulling tension math. A textbook 1,000-ft
          spacing that lands a vault in a four-lane highway median is unusable — the actual
          vault gets pushed to the nearest side street or business driveway where a splice
          trailer can park. Design the spacing as an interval, then move each vault to the
          nearest safe access point.
          <br /><br />
          The axiom: <em>"Plan at 500–1,000 ft, build where the splice trailer can park."</em>
        </Callout>

        <h3 className="text-base font-semibold mt-4 mb-1">Vault and handhole sizing</h3>
        <p>
          Sizing is driven by the number of cables, the number of splice trays, the bend
          radius of the largest cable entering the structure, and the number of conduits
          that must be terminated. OFS IP-079 provides a vendor-published sizing reference
          (not a normative standard):
        </p>
        <Table
          headers={['Handhole size (L×W×D)', 'Approximate cable count capacity', 'Source']}
          rows={[
            ['17 × 30 × 24 in (small)', 'Up to ~144-count', 'OFS IP-079 [VERIFIED-public-source]'],
            ['24 × 36 × 24 in (medium)', '144–288-count range', 'OFS IP-079 [VERIFIED-public-source]'],
            ['48 × 60 × 48 in (large)', '576+-count / multi-cable splice point', 'OFS IP-079 [VERIFIED-public-source]'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Use these as starting-point vendor guidance, not as normative specifications.
          The cable manufacturer's minimum bend radius sets the hard floor on interior
          dimensions. RUS 1751F-643 covers UCV (Underground Cable Vault) types and cable
          racks for central-office underground plant; consult for vault design in
          RUS-financed projects.
        </p>
        <Callout kind="book" title="Vault sizing checklist">
          Before finalizing a vault size, confirm: (1) the largest cable's minimum bend
          radius fits within the vault interior without forcing a tight bend at the
          conduit entrance; (2) enough rack space exists for the planned splice-tray count
          plus a 25% growth reserve; (3) the vault lid can be removed with standard
          equipment at the chosen location; (4) the vault is rated for the traffic loading
          at that location (H-20 for driveways, H-25 for roadways).
        </Callout>
      </Section>

      {/* ---- Section 9.6 ---- */}
      <Section title="9.6 Slack loops at access points">
        <p>
          Slack loops are extra cable coiled and stored inside a handhole or at an
          access point. Their purpose is to provide enough fiber reach — above grade,
          outside the handhole — for a splice technician working from a splice trailer
          parked on the shoulder. Minimum slack is a contract specification, not a
          national standard.
        </p>
        <Table
          headers={['Location', 'Common contract band', 'Rationale']}
          rows={[
            ['Intermediate handhole (no splice)', '50 ft', 'Enough for splice trailer reach if a future mid-span splice is required'],
            ['Designated splice point', '100 ft', 'Allows cable to reach trailer above grade with working length remaining'],
            ['Building entrance handhole', '100–150 ft', 'Extra for demarcation, interior routing, and future re-termination'],
            ['Aerial-to-buried transition', '25–50 ft', 'Absorbs sag differential and provides splice access'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Contract bands sourced from: OFS IP-009 "Placing Fiber Optic Cable in Underground
          Plant," Cabling Installation & Maintenance service-loop articles. [VERIFIED-public-source
          for the 50–100 ft bands; specific contract numbers are UNVERIFIED — the contract
          governing the job specifies the number]
        </p>
        <Callout kind="field" title="Slack at every handhole keeps the trailer off the highway">
          In practice, a 50-ft intermediate loop is the minimum that allows a technician
          to pull the cable out of the handhole and lay it out without entering traffic.
          Skimping on slack to save cable budget routinely costs more in future-splice
          mobilization cost and roadway closure fees than the saved cable was worth.
          (Per OFS IP-009, Cabling Installation & Maintenance.)
        </Callout>
        <Callout kind="verify" title="The right slack number is in your contract">
          There is no single normative national standard specifying slack-loop lengths at
          handholes. BICSI OSPDRM and carrier MSAs specify their own values. If your
          contract says 75 ft at intermediate points, 75 ft is the correct answer on that
          job. The table above gives common industry bands; always read the contract.
          [UNVERIFIED-needs-contract-sample for a normative source]
        </Callout>
      </Section>

      {/* ---- Section 9.7 ---- */}
      <Section title="9.7 As-built vs. as-designed reconciliation (a field-vs-book gap)">
        <p>
          The <strong>as-designed</strong> drawing represents the engineer's intent:
          planned conduit routes, vault locations, bore profiles, and splice-point GPS
          coordinates. The <strong>as-built</strong> drawing represents what was
          actually constructed. In practice, the two are never identical.
        </p>
        <Table
          headers={['As-designed intent', 'Typical as-built deviation', 'Consequence']}
          rows={[
            ['Bore profile depth at centerline', 'Actual depth differs by ±12–24 in or more at any point', 'Future excavation hits cable at unexpected depth'],
            ['Splice point at manhole X', 'Splice moved 50 ft to avoid tree root or wet pocket', 'GIS shows splice at wrong location; trouble tickets mis-dispatched'],
            ['48×60 vault at Station 22+50', 'Vault downsized to fit road-cut permit window', 'Insufficient space for planned splice-tray count at build-out'],
            ['OTDR trace archive', 'Trace file not submitted with as-built deliverable', 'No baseline for future fault comparison (Module 8 linkage)'],
          ]}
        />
        <Callout kind="book" title="The textbook workflow">
          Design in GIS → field crew creates paper or electronic redlines during
          construction → redlines reconciled to the GIS within the contract-specified
          window (commonly 30 days after acceptance) → record drawing frozen → as-designed
          version retained for change-order traceability.
          <br /><br />
          GIS-driven OSP tools commonly used for this workflow: <strong>3-GIS</strong>,{' '}
          <strong>VETRO FiberMap</strong>, <strong>IQGeo</strong>,{' '}
          <strong>ESRI ARCFM</strong>. [VERIFIED-public-source — product documentation
          and 3-GIS, VETRO, Graphical Networks blog content]
        </Callout>
        <Callout kind="field" title="As-builts are the last deliverable and the first to slip">
          In field practice, as-built drawings are notoriously delivered late, incomplete,
          or never — especially on multi-subcontractor spreads where the bore crew, the
          conduit crew, and the cable crew are different companies. Networks with
          unreliable as-built records suffer longer outage durations (trouble-ticket
          mis-dispatch to the wrong segment) and greater risk of third-party cable strikes
          on adjacent future builds.
          <br /><br />
          The OTDR trace archive (Module 8) is a required component of a complete as-built
          deliverable: it establishes the optical baseline against which future faults are
          compared. A network without archived OTDR traces has no benchmark.
          [Per 3-GIS blog, VETRO FiberMap, ARCFM slack-loop GIS documentation,
          CGA DIRT 2024 Report context]
        </Callout>
        <Callout kind="field" title="Field redline discipline is the only solution">
          The root cause is not equipment or software — it is whether the foreman
          marks a field change on the print (or in the mobile app) in real time. Training
          and contract enforcement are the only levers. Including as-built completion as
          a pay-application milestone — withhold the final 5% until GIS records are
          accepted — is the mechanism that actually moves behavior.
        </Callout>
      </Section>

      {/* ---- Section 9.8 Scenario Exam ---- */}
      <Section title="9.8 Scenario-Based Exam">
        <InteractiveQuiz title="Module 9 — OSP Construction" questions={M9_QUESTIONS} />
      </Section>

      <RefList items={[
        { tag: 'book',   text: 'RUS Bulletin 1751F-630 — Design of Buried Plant (Physical Considerations)',       url: 'https://www.rd.usda.gov/files/UTP_Bulletins_1751F-630.pdf' },
        { tag: 'book',   text: 'RUS Bulletin 1751F-635 — Buried Plant — Placing',                                url: 'https://www.rd.usda.gov/files/UTP_Bulletins_1751F-635.pdf' },
        { tag: 'book',   text: 'RUS Bulletin 1751F-643 — Underground Plant Design (vault types, conduit)',        url: 'https://www.rd.usda.gov/files/UTP_Bulletins_1751F-643.pdf' },
        { tag: 'book',   text: 'FDOT Standard Plan 18202 — Fiber Optic Trench Details',                          url: 'https://www.fdot.gov/docs/default-source/roadway/DS/13/IDx/18202.pdf' },
        { tag: 'book',   text: 'VDOT IIM-LD-230 — VDOT Fiber Optics Infrastructure',                            url: 'https://www.vdot.virginia.gov/media/vdotvirginiagov/doing-business/technical-guidance-and-support/technical-guidance-documents/location-and-design/migrated/iim/IIM230_acc04052023_PM.pdf' },
        { tag: 'book',   text: 'CalTrans Encroachment Permit TR-0448 (burial depth reference)',                   url: 'https://dot.ca.gov/-/media/dot-media/programs/traffic-operations/documents/encroachment-permits/tr-0448-ada-a11y-09-25.pdf' },
        { tag: 'book',   text: 'FOA OSP Civil Works Guide',                                                       url: 'https://www.thefoa.org/tech/ref/1pstandards/OSP%20Civil%20Works%20Guide-FOA.pdf' },
        { tag: 'book',   text: 'OCC 206-2 — General Installation Guidelines',                                    url: 'https://www.occfiber.com/wp-content/uploads/2017/06/1384377594_OCC-206-2_Installation-General_Guidelines_Rev_B-1.pdf' },
        { tag: 'book',   text: 'OCC 206-3 — Conduit Guidelines',                                                 url: 'https://www.occfiber.com/wp-content/uploads/2017/06/1384377824_OCC-206-3_Installation-Conduit_Guidelines_Rev_A-1.pdf' },
        { tag: 'book',   text: 'OCC 206-4 — Direct Burial Guidelines',                                           url: 'https://www.occfiber.com/wp-content/uploads/2017/06/1384377921_OCC-206-4_Installation-Direct_Burial_Guidelines_Rev_A-1.pdf' },
        { tag: 'book',   text: 'Corning SRP-005-011 — Duct Installation of Fiber Optic Cable (pull tension)',    url: 'https://www.corning.com/catalog/coc/documents/standard-recommended-procedures/005-011.pdf' },
        { tag: 'book',   text: 'OFS IP-009 — Placing Fiber Optic Cable in Underground Plant (slack loops)',       url: 'https://www.ofsoptics.com/wp-content/uploads/IP009-UG-Cable-Placing-Feb-2020.pdf' },
        { tag: 'book',   text: 'OFS IP-079 — Sizing Handholes for Fiber Optic Cables',                           url: 'https://www.ofsoptics.com/wp-content/uploads/IP079-Sizing-Handholes-for-Fiber-Optic-Cables.pdf' },
        { tag: 'book',   text: 'PPI MAB — HDD Tensile Loads (pullback calculation basis)',                        url: 'https://plasticpipe.org/common/Uploaded%20files/1-PPI/MAB%20Publications/HDD%20tensile%20loads_%20082522.pdf' },
        { tag: 'book',   text: 'CGA — 811 Program page',                                                         url: 'https://commongroundalliance.com/811' },
        { tag: 'book',   text: 'CGA Best Practices Guide v19 portal',                                            url: 'https://bestpractices.commongroundalliance.com/' },
        { tag: 'book',   text: 'CGA 2024 DIRT Report dashboard',                                                 url: 'https://dirt.commongroundalliance.com/' },
        { tag: 'book',   text: 'CGA Marking Standards Manual v10 (APWA color code)',                             url: 'https://missouri-811.org/wp-content/uploads/2023/03/CGA-Marking-Standards-Manual-10.pdf' },
        { tag: 'book',   text: 'FBA + Cartesian Fiber Deployment Cost Annual Report 2025',                       url: 'https://fiberbroadband.org/wp-content/uploads/2026/01/FBA_Cartesian_Fiber-Deployment-Cost-Annual-Report_2025.pdf' },
        { tag: 'book',   text: 'ICC — Minimum Bend Radius / Maximum Pull Tension reference',                     url: 'https://icc.com/help-article/minimum-bend-radius-maximum-pulling-tension-fiber-optic-cables/' },
        { tag: 'forum',  text: 'Mike Holt forum — conduit fill, NEC vs. TIA for telecom',                        url: 'https://forums.mikeholt.com/threads/fiber-optic-cable.119791/' },
        { tag: 'forum',  text: 'GPRS — 811 and private utility locating (private laterals not covered)',         url: 'https://www.gp-radar.com/article/what-to-know-about-811-one-call-services-private-locating' },
        { tag: 'forum',  text: 'Melfred Borzall — HDD guide for rookies (bore profile deviation)',               url: 'https://www.melfredborzall.com/blog/hdd-tips/hdd-guide-for-rookies.html' },
        { tag: 'forum',  text: 'Cabling Installation & Maintenance — service loops in cable runs',               url: 'https://www.cablinginstall.com/home/article/16469021/service-loops-in-horizontal-cable-runs' },
        { tag: 'forum',  text: '3-GIS blog — fiber network construction (as-built workflow)',                    url: 'https://blog.3-gis.com/blog/topic/fiber-network-construction' },
        { tag: 'forum',  text: 'ARCFM — FiberSlackLoop GIS modeling',                                           url: 'https://resources.arcfmsolution.com/10.2.1a/Appendix/FiberSlackLoop.html' },
        { tag: 'verify', text: 'NESC IEEE C2 underground depth tables are paywalled — cited here via state DOT and RUS secondary sources only. Confirm from paid C2-2023 before sealing a design.' },
        { tag: 'verify', text: 'TIA-758-C (Customer-Owned Outside Plant) is paywalled — outside-plant construction requirements referenced via secondary sources only. [UNVERIFIED-needs-paid-doc]' },
        { tag: 'verify', text: 'RUS 1751F-643 normative innerduct color sequence — not independently verified. Teach orange as APWA surface marking only; contractor sub-duct convention is supplementary. [UNVERIFIED-needs-paid-doc]' },
        { tag: 'verify', text: 'Slack-loop contract lengths (50 / 100 / 150 ft) are common industry bands, not a single normative standard. The contract specifies the number for a given job. [UNVERIFIED-needs-contract-sample]' },
      ]}/>
    </article>
  );
}

/* ============================================================
   Module 9 Scenario-Based Exam Questions (4–6 questions)
   ============================================================ */

const M9_QUESTIONS = [
  {
    id: 'm9-q1',
    type: 'mc',
    prompt: 'Your crew has a valid 811 locate ticket, all utilities are marked with APWA paint, and the machine is ready to trench. Before you start, you notice the route crosses what appears to be a private irrigation line feeding a detached garage. What is the correct next step?',
    choices: [
      'Proceed — the 811 ticket covers all underground utilities within the easement.',
      'Call 811 again to update the ticket with the private line.',
      'Pothole (hand-expose) the crossing before running the trencher; private laterals are not located by 811.',
      'Flag the location and skip it; private facilities are the property owner\'s responsibility.',
    ],
    answerIndex: 2,
    explanation: '811 only locates facilities registered by member utilities. Private laterals — irrigation, electric drops, propane service lines — are not registered in any one-call system and will not be marked. The 2024 DIRT Report identifies failure to notify 811 as the #1 root cause of utility damages, but even a clean 811 ticket does not protect against unregistered private infrastructure. Hand-exposing (pothholing) every crossing before mechanized excavation is the field standard.',
    citation: 'CGA Best Practices v19; CGA 2024 DIRT Report (commongroundalliance.com); GPRS private-locating guidance. [VERIFIED-public-source]',
    fieldNote: '"The 811 ticket is the floor, not the ceiling. We still pothole every crossing." — field consensus across GPRS, CGA, and contractor guidance.',
  },
  {
    id: 'm9-q2',
    type: 'mc',
    prompt: 'A contractor quotes a 12-mile rural fiber spur in central Iowa and a 12-mile spur in central Pennsylvania shale. For Iowa, vibratory plowing is the low-cost method. For Pennsylvania, the contractor\'s quote uses HDD and rock-saw trenching at approximately double the Iowa per-foot cost. What is the primary explanation for the cost difference?',
    choices: [
      'HDD is always more expensive than plowing regardless of soil type.',
      'Pennsylvania imposes higher permitting fees for fiber construction.',
      'Soil type determines method feasibility: plowing fails in rock and shale, requiring HDD or rock-saw trenching; in black-dirt Iowa, plowing succeeds.',
      'The Pennsylvania route is longer in road-crossing distance, triggering a different rate schedule.',
    ],
    answerIndex: 2,
    explanation: 'Method choice is driven primarily by soil conditions. Vibratory plowing is highly efficient in cooperative soil (black dirt, sandy loam, clay) but fails on first contact with rock, ledge, or high-water-table conditions. Central Pennsylvania Appalachian shale forces a switch to rock-saw trenching or HDD — both of which are significantly more expensive per foot than plowing. The FBA/Cartesian cost reports show that rural plowing median and rural trenching median change ranking between report years as the input data set changes; the lesson is to price the inputs, not quote a single number.',
    citation: 'FBA + Cartesian Fiber Deployment Cost Annual Report 2025 (~$11.88/ft plowing, ~$19.00/ft trenching rural median). [VERIFIED-public-source] Soil-condition rationale per Ditch Witch, Vermeer, Melfred Borzall HDD guidance.',
    fieldNote: '"The minute you hit a buried boulder field, the trencher goes back on the truck." — implied across FBA cost reports and contractor pages.',
  },
  {
    id: 'm9-q3',
    type: 'mc',
    prompt: 'You are pulling a three-sub-duct bundle through an HDD bore. Sub-duct A has a maximum pull tension rating of 600 lbf, sub-duct B is rated 500 lbf, and sub-duct C is rated 700 lbf. You install a calibrated breakaway swivel between the pull head and the drill pipe. To what tension should the breakaway swivel be set?',
    choices: [
      '700 lbf — the highest-rated sub-duct defines the safe upper limit.',
      '600 lbf — the most common OSP figure.',
      '500 lbf — the lowest-rated sub-duct in the bundle.',
      'The average of the three ratings: 600 lbf.',
    ],
    answerIndex: 2,
    explanation: 'A bundle must be pulled at the tension limit of the weakest component. If the breakaway is set above 500 lbf, sub-duct B will be overstressed before the swivel releases. The breakaway is set to the lowest-rated item in the bundle. This is a direct application of the "worst-case member governs" principle used in structural and cable engineering.',
    citation: 'OCC 206-2 General Installation Guidelines; Corning SRP-005-011; PPI MAB HDD Tensile Loads. [VERIFIED-public-source]',
    fieldNote: 'In HDD pullback, the drill-rig tension gauge reads force at the pipe string, not force at the cable jacket. Bore-path curvature, mud weight, and side-wall friction all add load. The calibrated swivel is the safety device; the datasheet is the spec; the PPI MAB equations are the engineering check.',
  },
  {
    id: 'm9-q4',
    type: 'mc',
    prompt: 'A telecom designer specifies direct-buried fiber in a state highway ROW in Florida. The RUS 1751F-635 and OCC 206-4 documents cite 36 inches as a standard direct-buried depth. The project AHJ is FDOT. Which burial depth governs the design?',
    choices: [
      '36 in — the RUS / OCC standard is nationally applicable and supersedes state DOT requirements.',
      '18 in — the NEC 830.47 floor applies because the state ROW is also a public utility easement.',
      'The FDOT Standard Plan 18202 and FDOT Design Manual chapter 233 requirements govern, which may specify different depths and trench profiles for Florida state highway ROW. Confirm with the FDOT permit.',
      'There is no binding depth standard; the designer chooses based on soil conditions.',
    ],
    answerIndex: 2,
    explanation: 'RUS and OCC guidance establishes a common floor, but the AHJ — FDOT in this case — has independent authority over its own ROW and routinely specifies requirements that differ from national guidance. FDOT Standard Plan 18202 and FDOT Design Manual chapter 233 give specific trench profiles, bedding sand requirements, warning tape placement, and depth call-outs that govern within FDOT ROW. The general principle is: AHJ overrides the textbook number. The permit is the binding document.',
    citation: 'FDOT Standard Plan 18202 [VERIFIED-public-source]; FDOT Design Manual chapter 233 [VERIFIED-public-source]; RUS 1751F-635 [VERIFIED-public-source]. AHJ-overrides principle per VDOT IIM-LD-230, CalTrans TR-0448, and Module 9 research log.',
    fieldNote: 'Always obtain the AHJ\'s permit conditions before setting blade depth. CalTrans wants ~42 in within highway ROW; some county roads require 48 in; a municipal ROW may allow 24 in with a concrete cap. The design is only as safe as the permit it was built to.',
  },
  {
    id: 'm9-q5',
    type: 'mc',
    prompt: 'After cable installation, the as-built drawing is submitted to the owner. The bore contractor\'s locator log shows the HDD bore at 48 in depth throughout the crossing. The as-built shows 48 in. Six months later, during a parallel utility dig, the fiber conduit is struck at 30 in. Which of the following BEST describes the root cause?',
    choices: [
      'The striking contractor failed to call 811.',
      'The bore locator log and the as-built both reflect the operator\'s planned profile, not the measured bore path. Steering-tool readings are interpolated, and the rod deviated from the intended path — a known field-vs-book gap in HDD as-built accuracy.',
      'The fiber was installed too shallow by an unrelated crew after the bore was completed.',
      'FDOT permitted a shallower bore than the standard depth.',
    ],
    answerIndex: 1,
    explanation: 'The bore locator log records the drill-pipe position as interpolated by the steering tool, not as a continuous measured survey. In uneven or resistant soil, the drill rod can deviate significantly from the intended profile without the operator detecting it in real time. The as-built inherits the error from the locator log. This is a documented field-vs-book gap: as-built bore profiles are estimates, not measurements. The consequence is that the fiber is at a different depth than all records indicate, leading to strikes even when 811 was called and the cable was marked. Fixing this requires post-installation ground-penetrating radar (GPR) verification on critical crossings.',
    citation: 'Vermeer Pro Tips — HDD fiber installation process; Melfred Borzall HDD Guide for Rookies; Ditch Witch HDD industry outlook 2025. [VERIFIED-public-source] As-built reconciliation gap per Module 9 research log Section 3.9.',
    fieldNote: '"The bore profile on the as-built never matches the bore profile in the locator log because the rod doesn\'t go where the operator thinks it goes." — paraphrase from Vermeer, Melfred Borzall, Ditch Witch guidance.',
  },
  {
    id: 'm9-q6',
    type: 'dragdrop',
    prompt: 'Match each installation scenario to the most appropriate placement or specification value from industry guidance.',
    items: [
      { id: 'v36in',    label: '36 in depth' },
      { id: 'v500ft',   label: '500–1000 ft spacing' },
      { id: 'v100ft',   label: '100 ft slack loop' },
      { id: 'v40pct',   label: '40% conduit fill (pull)' },
      { id: 'v600lbf',  label: '600 lbf pull tension' },
    ],
    targets: [
      { id: 't-burial',  label: 'Direct-buried OSP fiber depth (RUS/OCC general guidance)' },
      { id: 't-spacing', label: 'Handhole / vault planning interval' },
      { id: 't-slack',   label: 'Slack loop at a designated splice-point handhole' },
      { id: 't-fill',    label: 'Maximum conduit fill for traditional pull installation (NEC secondary source)' },
      { id: 't-tension', label: 'Typical max pull tension for OSP loose-tube cable (Corning/OCC/ICC)' },
    ],
    correctMap: {
      't-burial':  'v36in',
      't-spacing': 'v500ft',
      't-slack':   'v100ft',
      't-fill':    'v40pct',
      't-tension': 'v600lbf',
    },
    explanation: '36 in = RUS 1751F-635 / OCC 206-4 direct-buried depth. 500–1000 ft = vendor/FOA vault planning interval. 100 ft = common contract band for splice-point slack. 40% = NEC Chapter 9 Table 1 (pull installation). 600 lbf = typical OSP loose-tube maximum per Corning SRP-005-011 / OCC 206-2 / ICC. All are starting-point guidance values — AHJ, contract, and cable datasheet govern the actual number.',
    citation: 'RUS 1751F-635, OCC 206-4, FOA OSP Civil Works Guide, OFS IP-009, Corning SRP-005-011, NEC secondary sources. [VERIFIED-public-source or VERIFIED-via-secondary-source as noted in module text]',
    fieldNote: 'These five numbers appear on BICSI OSP and FOA CFOS exams. The exam wants the guidance value; the job wants the AHJ / contract / datasheet value. Both matter.',
  },
];
