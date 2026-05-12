import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';
import TopologyCanvas from '../components/TopologyCanvas.jsx';

/**
 * Module 7 — Fiber Topology & Matrix
 *
 * Editorial posture (per docs/research-logs/module07-fiber-topology.md, Section 5):
 *  - TIA-598 12-color sequence taught from vendor-republished form; VERIFIED
 *    via FOA, Brady, Broadband Library, and Wikipedia cross-confirmation.
 *  - Jacket/boot color codes VERIFIED via FOA, Brady, Corning, CommScope.
 *  - Splice matrix layout has no ANSI/TIA standard; Splice.me history post
 *    is the primary source for "row-per-fiber" convention origin.
 *  - Synchronoss Spatial Suite and ARAMIS are cited with UNVERIFIED flags
 *    (product lines in flux as of 2026).
 *  - TDMM edition reference: OSPDRM 6th is current per platform brief;
 *    whether TDMM 14th or 15th is in use for the cert cohort is UNVERIFIED —
 *    confirm before citing edition-specific page numbers.
 *  - "16 north / 6 south Excel files" anecdote from Splice.me blog
 *    (origins-of-fiber-optic-splice-sheets-part-1) is cited as an
 *    illustrative field reality, not a statistic.
 */
export default function Module07_FiberTopology() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={7}
        title="Fiber Topology & Matrix"
        intro="Nodes and connections engine, splice matrix tracking, fiber pathing (finding fiber 73), TIA-598 color codes, jacket and connector boot colors, vendor tools from VETRO to netTerrain, and the honest Excel reality. The textbook says 'use a fiber management system.' The field says 'we have 22 Excel files on a shared drive.' This module teaches both."
      />

      {/* ── 7.1 Nodes, Connections, and the Topology Engine ── */}
      <Section title="7.1 Nodes, connections, and the topology engine">
        <p>
          A <strong>fiber topology</strong> describes the network as a graph:
          nodes (discrete points of termination, splicing, or splitting) connected
          by edges (cable runs carrying one or more fiber strands). Every serious
          fiber management tool — VETRO, 3-GIS, IQGeo, Bentley OpenComms Designer —
          represents the network this way internally. The node types you encounter
          in OSP work are:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>POP / Central Office / Hut</strong> — the origination point; houses OLTs, patch panels, and the transport equipment.</li>
          <li><strong>Fiber Distribution Hub (FDH) / Cabinet</strong> — mid-network aggregation; splitter trays live here in PON designs.</li>
          <li><strong>Splice Closure</strong> — a sealed enclosure in the aerial or underground plant; it is a node because fiber routing changes here.</li>
          <li><strong>Tap / NAP / Pedestal</strong> — customer-side distribution point; connects the distribution cable to drop cables.</li>
          <li><strong>Customer ONT / NID</strong> — the terminal node; fiber terminates on the customer premises.</li>
        </ul>
        <p className="mt-2">
          A <strong>connections engine</strong> is the data model that links these
          nodes and records which fiber strands traverse each edge. It is the thing
          Excel cannot natively be — a graph database that knows "if I follow fiber
          5 in tube 3 of cable NE-047 through the splice closure on Oak Ave, where
          does it terminate?" Without a connections engine, answering that question
          requires hunting through a series of hand-linked spreadsheet tabs.
        </p>
        <Callout kind="field" title="What most small ISPs actually have">
          The topology engine is frequently the last thing a growing ISP buys.
          A 2013 Slashdot thread — dated but durable — found that virtually
          every respondent working at a small ISP or muni said they tried a
          vendor product and went back to Excel. By 2026 the tools are better
          and cheaper, but the transition is still a project, not a purchase.
        </Callout>
        <Callout kind="book" title="The splice.me 'origins' anecdote">
          A Splice.me blog post on the history of splice sheets describes a
          real mid-size ISP with <strong>16 Excel files in a "north" folder
          and 6 in a "south" folder</strong>, each file representing a fiber
          cluster, each tab representing one splice closure. This is not a
          cautionary tale — it is a working network someone manages every day.
          Teaching fiber topology means meeting students in that reality.
        </Callout>
        <Callout kind="verify" title="TDMM edition note">
          BICSI OSPDRM 6th edition is the current platform reference. Whether
          the active cert cohort is being examined against TDMM 14th or 15th
          is UNVERIFIED at time of writing — confirm with the exam blueprint
          before relying on edition-specific page or table citations.
        </Callout>
      </Section>

      {/* ── 7.2 Splice Matrix Tracking ── */}
      <Section title="7.2 Splice matrix tracking — the fundamental document">
        <p>
          A <strong>splice matrix</strong> (also called a splice sheet or splice
          schedule) is a table that maps every fiber in one cable to the fiber
          it is joined to at a given splice point. It is the primary signed-off
          record of the physical plant. The GIS map and the Visio diagram are
          customer-facing artifacts; the splice matrix is the splicer's sworn
          statement.
        </p>
        <p className="mt-2">
          There is <strong>no ANSI/TIA standard</strong> that prescribes the
          layout of a splice matrix. Common industry layouts:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Row-per-fiber</strong> — each row is one fiber strand, with columns for tube, position, color, destination cable, destination tube, destination position, loss, and notes. This is the dominant Excel format.</li>
          <li><strong>Two-cable side-by-side</strong> — left columns are the incoming cable; right columns are the outgoing cable; the row number is the tray position. Convenient for straight-through splices.</li>
          <li><strong>Splice-closure cassette layout</strong> — the rows mirror the physical tray order inside the closure; the form factor matches the hardware.</li>
        </ul>
        <p className="mt-2">
          Vendor splice closure manufacturers (CommScope FOSC, Sumitomo,
          Fujikura) ship pre-printed splice sheets. Crews fill them out by hand
          during the splice. These hand-marked sheets are often the only
          contemporaneous, field-verified record of what went where.
        </p>

        <Callout kind="book" title="Platform canonical CSV schema (editorial recommendation, not a standard)">
          For exercises and tool exports, this platform uses the following
          column set:
          <code className="block bg-black/30 rounded mt-2 p-2 text-xs font-mono leading-relaxed">
            cable_id, tube_color, fiber_position, fiber_color,
            splice_point_id, splice_position,
            peer_cable_id, peer_tube_color, peer_fiber_position,
            peer_fiber_color, loss_db, notes
          </code>
          This is an <em>editorial default</em>. No standard mandates it.
          A real project's schema is whatever the owner's data model requires.
        </Callout>

        <Callout kind="field" title="Pain points in the real-world splice matrix lifecycle">
          Splice.me's comparison of documentation tools names four chronic
          failures of the Excel/Visio/AutoCAD stack: (a) Excel can't represent
          a 1×8 splitter without introducing phantom "virtual fibers"; (b) Visio
          loses backward links when a stencil is copied; (c) AutoCAD splice
          diagrams are drawn but not searchable; (d) handing off to a field
          tech means printing 30 PDFs, and the hand-marked corrections never
          make it back to the master. A topology engine resolves (a), (c), and
          (d). It makes (b) irrelevant by eliminating Visio.
        </Callout>

        <Callout kind="field" title="As-built drift — the real maintenance task">
          Textbook: keep the as-built current. Field: the contractor closes out,
          hands over an Excel + Visio package, and within six months the customer
          has done four patches that never went into the package. By year two the
          as-built is decorative. The audit-cycle — not the initial drawing — is
          the actual maintenance work.
        </Callout>
      </Section>

      {/* ── 7.3 Fiber Pathing — "Where Does Fiber 73 Go?" ── */}
      <Section title="7.3 Fiber pathing — &quot;where does fiber 73 go?&quot;">
        <p>
          Finding a specific fiber from end to end is the field's most common
          topology task. The right approach is a three-level identification
          tree:
        </p>

        <Table
          headers={['Level', 'Identifier', 'How it is encoded']}
          rows={[
            ['1 — Cable',    'Cable ID / route segment',      'Printed on the cable sheath every meter; in the splice sheet header'],
            ['2 — Tube',     'Buffer tube color',             'TIA-598 12-color sequence; repeats with tracer above 12 tubes'],
            ['3 — Fiber',    'Fiber position within tube',    'TIA-598 12-color sequence for 1–12F tubes; position count for larger'],
          ]}
        />

        <p className="mt-3">
          <strong>Textbook workflow (topology engine):</strong> enter the cable
          ID and fiber position into the system's trace function; the engine
          walks the graph through all intermediate splice points and returns
          the end node and port assignment.
        </p>
        <p className="mt-2">
          <strong>Field workflow (Excel/splice sheet stack):</strong>
        </p>
        <ol className="list-decimal pl-5 space-y-1 mt-2">
          <li>Identify the cable and tube: look at the sheath print and the tube color.</li>
          <li>Open the splice sheet for the downstream splice closure on that cable segment.</li>
          <li>Find the row for that tube + fiber position; read the peer cable ID and peer fiber position.</li>
          <li>Repeat for the next closure until you reach an active port or a dead fiber.</li>
          <li>Sanity-check against the OTDR distance — if the system says the far splice is 2.3 km away and the OTDR shows an event at 2.3 km, you have found the right splice.</li>
        </ol>
        <Callout kind="field" title="The fiber-number trap">
          "Fiber 73" is not a complete address. A 144F cable has 12 tubes of
          12 fibers each. Fiber 73 is tube 7 (brown), fiber 1 (blue). But at
          the splice, the splicer may have "started over" at position 1 in the
          next cable, so fiber 73 incoming becomes fiber 1 in the outgoing
          cable. The splice sheet is the translation table. Without it, the
          fiber number alone is meaningless.
        </Callout>
        <Callout kind="field" title="Color-blind splicers use position, not color">
          Red-green color deficiency is common enough in the general population
          (≈ 8 % of males) that any splice crew has a reasonable probability of
          including a color-blind splicer. Position counting — "fifth fiber in
          this tube, count from the tracer" — is a real field skill. Teach it
          alongside the color sequence.
        </Callout>

        <h3 className="text-base font-semibold mt-4 mb-2">Worked example: locating fiber 73 in a 144F loose-tube cable</h3>
        <p>
          A 144F cable has 12 buffer tubes, each holding 12 fibers.
          To find position 73:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Divide: 73 ÷ 12 = 6 full tubes (72 fibers), remainder 1.</li>
          <li>Tube 7 (position 1 into the 7th tube) = <strong>red tube</strong> (color #7 in TIA-598).</li>
          <li>Fiber 1 within that tube = <strong>blue fiber</strong> (color #1 in TIA-598).</li>
          <li>Full address: Cable NE-047 / Tube 7 (Red) / Fiber 1 (Blue).</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/80">
          This is the math to verify on the splice sheet. If the splice sheet
          says tube 7 / fiber 1 maps to tube 3 / fiber 5 in cable NE-048,
          you have your next hop.
        </p>
      </Section>

      {/* ── 7.4 TIA-598 Color Codes ── */}
      <Section title="7.4 TIA-598 color codes — fiber, jacket, and connector boot">

        <h3 className="text-base font-semibold mb-2">7.4.1 The 12-color fiber sequence</h3>
        <p>
          <strong>ANSI/TIA-598-D</strong> (current; -C was the prior revision
          widely cited because -D was re-affirmed without numerical change to
          the sequence) defines the color order for fibers within a tube, tubes
          within a cable, and ribbons within a ribbon cable.
          Status: <strong>VERIFIED-via-secondary-source</strong> — the sequence
          below is confirmed by the FOA color code reference page, the Brady
          fiber color code guide, the Broadband Library decoding article, and
          the Wikipedia TIA-598-C summary, all of which publish the identical
          sequence.
        </p>

        {/* Color swatch table */}
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left w-12">Pos.</th>
                <th className="px-3 py-2 text-left">Color name</th>
                <th className="px-3 py-2 text-left">Swatch</th>
                <th className="px-3 py-2 text-left">Field notes</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              {TIA598_COLORS.map(({ pos, name, hex, note, textDark }) => (
                <tr key={pos} className="border-t border-white/10">
                  <td className="px-3 py-2 font-mono text-center">{pos}</td>
                  <td className="px-3 py-2 font-semibold">{name}</td>
                  <td className="px-3 py-2">
                    <span
                      className="inline-block px-4 py-1 rounded text-xs font-bold"
                      style={{
                        backgroundColor: hex,
                        color: textDark ? '#1e293b' : '#f8fafc',
                        border: hex === '#ffffff' ? '1px solid #475569' : 'none',
                      }}
                    >
                      {name}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-300/70">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Source: ANSI/TIA-598-D (paywalled). Sequence confirmed via FOA,
          Brady, Broadband Library, Wikipedia (TIA-598-C) — all four show the
          identical order.
        </p>

        <h3 className="text-base font-semibold mt-5 mb-2">7.4.2 Multi-tube and high-count cables</h3>
        <p>
          For cables with more than 12 fibers in a single tube or more than 12
          tubes, the 12 colors repeat. The second group (positions 13–24) uses
          the same colors but each fiber or tube carries a
          <strong> tracer stripe</strong>. Status: VERIFIED via FOA, Brady,
          Wikipedia.
        </p>
        <Callout kind="field" title="Tracer color is NOT standardized the same way">
          TIA-598 does not prescribe a single tracer color with the same
          authority as the base color sequence. Corning's standard uses a black
          stripe (with yellow tracer on the black-base tube). Other vendors use
          red or yellow. <strong>Exam answer:</strong> the tracer convention
          distinguishes groups 13–24. <strong>Field answer:</strong> read the
          vendor cable legend — the manufacturer prints it on the sheath.
        </Callout>
        <Callout kind="field" title="Ribbon and rollable ribbon cable">
          Modern high-count cables (288F, 864F, 1728F) are ribbon or
          rollable-ribbon. The unit is a 12-fiber ribbon, and ribbons stack
          inside the tube. TIA-598 color coding still applies to the
          individual fibers within a ribbon and to the tube colors — but the
          physical identification workflow is different. The exam may not yet
          cover rollable ribbon explicitly; the field most certainly does.
        </Callout>

        <h3 className="text-base font-semibold mt-5 mb-2">7.4.3 Cable jacket colors by fiber type</h3>
        <p>
          TIA-598 specifies cable jacket colors for premises cable. Status:
          VERIFIED via Corning, CommScope product catalogs and the Wikipedia
          TIA-598 page.
        </p>
        <Table
          headers={['Jacket color', 'Fiber type', 'Notes']}
          rows={[
            ['Yellow',     'OS1 / OS2 (single-mode)',          'UPC and APC connectors; standard OSP and premises SMF'],
            ['Orange',     'OM1 (62.5/125 µm) or OM2 (50/125 µm)', 'Legacy multimode; OM1 = 62.5, OM2 = 50/125 laser-rated'],
            ['Aqua',       'OM3 / OM4 (50/125 laser-optimized)', 'Primary data-center multimode cable color'],
            ['Lime green', 'OM5 (wideband multimode)',          'Added in TIA-598 update; sometimes called "ericalime"'],
          ]}
        />

        <h3 className="text-base font-semibold mt-5 mb-2">7.4.4 Connector boot and housing colors</h3>
        <p>
          Connector boot and housing colors follow TIA-568/TIA-598-aligned
          conventions. Status: VERIFIED via FOA and Brady references; field
          practice is consistent except in cheap imported assemblies.
        </p>
        <Table
          headers={['Boot/housing color', 'Fiber type / polish', 'Notes']}
          rows={[
            ['Beige',      'OM1 multimode',      'Legacy 62.5/125 µm'],
            ['Black',      'OM2 multimode',      '50/125 µm, pre-laser-optimized'],
            ['Aqua',       'OM3 / OM4 multimode','Matches jacket color'],
            ['Lime green', 'OM5 multimode',      'Matches OM5 jacket'],
            ['Blue',       'Single-mode UPC',    'Ultrapolished; most common SMF connector color'],
            ['Green',      'Single-mode APC',    'Angled polish; PON and DWDM; never mate green to blue'],
          ]}
        />
        <Callout kind="field" title="Green-to-blue mating destroys the APC ferrule end-face">
          An APC connector mated to a UPC connector introduces high
          back-reflection and can chip the angled ferrule. The color convention
          (green = APC, blue = UPC) is the visual lock-out. Never mate them.
          If a connector arrives in a cheap black or grey boot, check the
          end-face angle under an inspection scope before assuming it is UPC.
        </Callout>
      </Section>

      {/* ── 7.5 Industry Tools — Survey ── */}
      <Section title="7.5 Industry tools — a tool-agnostic survey">
        <p>
          No single tool dominates the market at all tiers. The platform does not
          endorse one; it equips you to evaluate them against your workflow.
          Where source verification is incomplete, the flag is explicit.
        </p>

        <Table
          headers={['Tool', 'Primary use case', 'Typical buyer', 'Verification status']}
          rows={[
            ['VETRO FiberMap',              'Cloud GIS fiber mapping, splice diagrams, inventory, field collection',            'Muni / co-op, Tier-2/3 ISP',               'Verified — vendor page current as of 2026'],
            ['3-GIS',                       'Fiber design + lifecycle; copper + fiber harmonized; multi-product suite',          'Incumbent telco, large utility build',      'Verified — vendor page current'],
            ['IQGeo Network Manager',       'Geospatial "digital twin"; planning / design / build / operate lifecycle',          'Tier-1 carrier; expensive',                 'Verified — vendor page + blog current'],
            ['Bentley OpenComms Designer',  'CAD/MicroStation-based; successor to Bentley Fiber + Expert Designer',              'Cable MSO, utility on Bentley stack',       'Verified — Bentley docs current'],
            ['Splice.me',                   'Purpose-built splice diagram & matrix; "spreadsheet replacement"',                  'Small-to-mid ISP, contractor',             'Verified — vendor page + blog current'],
            ['OZmap',                       'Fiber mapping + splice diagramming; Brazilian-origin',                              'ISPs globally; strong in LATAM',            'Verified — vendor page current'],
            ['netTerrain OSP',              'DCIM-adjacent OSP with splice diagram generation (Graphical Networks)',              'Mid-market, facilities + OSP overlap',      'Verified — vendor page current'],
            ['CircuitVision cvFiber',       'Fiber-optic mapping, splice, inventory',                                            'Mid-market',                                'Verified — vendor page current'],
            ['Render Networks',             'Construction workflow + as-built capture',                                           'Build contractors',                         'Appears in roundups; detailed feature set UNVERIFIED'],
            ['Biarri Networks',             'Network design optimization + build sequencing',                                     'Large build programs',                      'Appears in roundups; detailed feature set UNVERIFIED'],
            ['Synchronoss Spatial Suite',   'Portfolio shifted ownership multiple times (formerly Intec/Setics Sttar)',           'Cited in RFPs; product in flux',            '⚠ UNVERIFIED — brand may not match current 2026 product offering; confirm before quoting features'],
            ['ARAMIS',                      'Build management / as-built capture (now reportedly part of Render Networks)',       'Build contractors',                         '⚠ UNVERIFIED — current ownership unconfirmed; vendor page year unclear'],
          ]}
        />
        <Callout kind="field" title="The Excel + Visio + Bluebeam stack is still the de facto standard">
          Reddit r/fiberoptics and r/networking threads since 2018 consistently
          land on the same answer: small contractors use Excel + Visio +
          Bluebeam; mid-size ISPs may buy VETRO or netTerrain; Tier-1 carriers
          buy IQGeo or Bentley. Teaching the tool the employer actually has is
          more useful than teaching to a generic TMS. This platform teaches
          concepts first, so the student can operate in any stack.
        </Callout>
        <Callout kind="field" title="Cross-vendor data exchange: the practical state of the art">
          There is no widely adopted interchange format for fiber topology.
          GeoJSON for geometry, CSV for splice matrix, PDF for close-out, and
          optionally KMZ for visual handoff: that is the working state of
          interoperability in 2026. Anything richer (SHP, FGDB) is locked to
          a vendor stack.
        </Callout>
        <Callout kind="book" title="Why Visio is not a topology tool">
          Splice.me's free Visio stencil pack is widely used. Those stencils
          look good. They have zero data model: moving a stencil does not move
          its data; copying a stencil duplicates a label, not a fiber link.
          "Fiber 73" in Visio is text. The phantom fiber-73 problem — where
          the diagram says the fiber exists but the physical plant disagrees —
          is a direct consequence of treating Visio as a system of record.
        </Callout>
      </Section>

      {/* ── 7.6 Field Hygiene Checklist ── */}
      <Section title="7.6 Field hygiene checklist — keeping the matrix alive">
        <p>
          The splice matrix is only useful if it reflects the current physical
          plant. These practices reduce the gap between what the document says
          and what the fiber does:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>
            <strong>Single source of truth designation.</strong> Name one file
            (or one system) as the master. Every other copy is read-only.
            If you have 22 Excel files, one of them is master and the rest
            are archives. Write it on the file.
          </li>
          <li>
            <strong>Version control for the master Excel.</strong> Even a manual
            "v2026-05-08" suffix in the filename beats no versioning. A
            SharePoint or Git repo is better; at minimum, the file name encodes
            the date the splicer signed off.
          </li>
          <li>
            <strong>Sign-off at the splice closure.</strong> The splicer who
            did the work initials the splice sheet before the closure is sealed.
            That initialed sheet — scanned into the project folder — is the
            contemporaneous record.
          </li>
          <li>
            <strong>Patch changes go into the matrix same day.</strong> A
            connector moved in the FDH is a topology change. Leaving it for
            "next month's update" produces as-built drift. The closer to real-time
            the matrix is, the less audit pain later.
          </li>
          <li>
            <strong>Annual audit cycle.</strong> Walk the path from splice sheet
            to physical plant at least once per year. OTDR from both ends of
            every active fiber segment; compare to the loss budget. Discrepancies
            reveal either splice degradation or undocumented changes.
          </li>
          <li>
            <strong>Migration checklist when switching tools.</strong> Before
            importing an old Excel splice sheet into VETRO or Splice.me, validate
            that every cable_id, tube_color, and fiber_position field is present
            and consistent. Garbage-in from the old stack becomes structural
            garbage in the new system.
          </li>
        </ul>
        <Callout kind="field" title="The audit is the maintenance task">
          Most OSP problems that surface as outages or capacity disputes trace
          back to as-built drift that accumulated over 12–24 months. The initial
          as-built drawing is easy. Keeping it current is the discipline that
          separates a well-run network from a network held together by oral
          tradition.
        </Callout>
      </Section>

      {/* ── 7.7 Build Your Own Topology ── */}
      <Section title="7.7 Build your own topology — interactive canvas">
        <p>
          The canvas below is a simplified nodes-and-connections engine: the
          same data model that VETRO, 3-GIS, and IQGeo use under the hood,
          stripped to its teaching essentials.
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 mb-4 text-sm">
          <li>Add node types with the buttons above the canvas.</li>
          <li>Click one node, then click another to draw a fiber run between them.</li>
          <li>Set the strand count before connecting to represent a specific cable count.</li>
          <li>Click any run to remove it. Right-click (or Shift-click) a node to delete it.</li>
          <li>Your sketch persists in browser local storage — it will be here next time.</li>
        </ul>
        <p className="text-sm text-slate-300/70 mb-4">
          <strong>Exercise:</strong> Reproduce the "16 north / 6 south" scenario.
          Build a POP node, then add 4–5 splice closures branching north, and
          3 FDH cabinets branching south. Assign fiber counts that mirror a real
          FTTH distribution (144F backbone → 48F distribution → 12F drop). Notice
          where the topology graph reveals handoff points that an Excel tab
          would hide.
        </p>
        <TopologyCanvas />
        <Callout kind="field" title="This is a teaching aid, not a fiber management system">
          The canvas does not import KMZ, does not hold a splice matrix, and
          does not export to an outside-plant database. It reproduces the core
          interaction of a connections engine so you know what it is supposed
          to do when you open the real tool on the job. The platform's
          value is meeting you in your actual workflow and showing you the
          path out of it.
        </Callout>
      </Section>

      {/* ── 7.8 Scenario-Based Exam ── */}
      <Section title="7.8 Scenario-based exam">
        <InteractiveQuiz title="Module 7 — Fiber Topology &amp; Matrix" questions={M7_QUESTIONS} />
      </Section>

      <RefList items={[
        { tag: 'book',   text: 'TIA-598-C Wikipedia summary (sequence confirmed)',                  url: 'https://en.wikipedia.org/wiki/TIA-598-C' },
        { tag: 'book',   text: 'FOA — Fiber optic color codes reference',                           url: 'https://www.thefoa.org/tech/ColCodes.htm' },
        { tag: 'book',   text: 'Brady — Fiber optic color code guide',                              url: 'https://www.bradyid.com/resources/fiber-optic-color-code' },
        { tag: 'book',   text: 'Broadband Library — Decoding the fiber optic color codes',          url: 'https://broadbandlibrary.com/decoding-the-fiber-optic-color-codes/' },
        { tag: 'book',   text: 'Splice.me — Origins of fiber optic splice sheets (Part 1)',         url: 'https://splice.me/blog/origins-of-fiber-optic-splice-sheets-part-1/' },
        { tag: 'book',   text: 'Splice.me — CAD vs Visio vs Excel vs the world',                   url: 'https://splice.me/blog/problems-of-fiber-splice-documentation-management-in-different-software-autocad-vs-ms-visio-vs-excel-vs-the-world-vs-splice-me/' },
        { tag: 'book',   text: 'Splice.me — Fiber mapping: how to make a fiber network map',       url: 'https://splice.me/blog/fiber-mapping-how-to-make-a-fiber-network-map/' },
        { tag: 'book',   text: 'Splice.me — 2025 fiber network management software solutions',     url: 'https://splice.me/blog/fiber-network-management-software-solutions-how-to-streamline-your-fiber-optic-network-in-2024/' },
        { tag: 'book',   text: 'Splice.me — Visio fiber stencils (free pack)',                     url: 'https://splice.me/blog/visio-fiber-stencils-fiber-cables-odfs-cabinets/' },
        { tag: 'book',   text: 'VETRO FiberMap homepage',                                          url: 'https://vetrofibermap.com/' },
        { tag: 'book',   text: 'VETRO — What is OSP? Introduction to outside plant fiber management', url: 'https://vetrofibermap.com/what-is-osp-an-introduction-to-outside-plant-fiber-optic-network-management/' },
        { tag: 'book',   text: '3-GIS fiber network planning and management software',              url: 'https://www.3-gis.com/en/fiber-network-planning-management-software-3-gis' },
        { tag: 'book',   text: 'IQGeo — Exploring OSP: a guide to outside plant fiber optic networks', url: 'https://www.iqgeo.com/blog/exploring-osp-a-guide-to-outside-plant-fiber-optic-networks' },
        { tag: 'book',   text: 'Bentley OpenComms Designer product page',                          url: 'https://www.bentley.com/software/opencomms-designer/' },
        { tag: 'book',   text: 'Bentley OpenComms Designer — intro doc',                           url: 'https://docs.bentley.com/LiveContent/web/OpenComms%20Designer-v1/en/GUID-DB6BB673-078C-4D09-8379-9700F573F16E.html' },
        { tag: 'book',   text: 'OZmap homepage',                                                   url: 'https://ozmap.com/en/' },
        { tag: 'book',   text: 'Graphical Networks — netTerrain OSP',                              url: 'https://graphicalnetworks.com/outside-plant/' },
        { tag: 'book',   text: 'Graphical Networks — fiber mapping software: OSP vs GIS',          url: 'https://graphicalnetworks.com/blog-fiber-mapping-software-osp-vs-gis/' },
        { tag: 'book',   text: 'CircuitVision cvFiber product page',                               url: 'https://www.circuitvision.com/products/cvfiber/' },
        { tag: 'book',   text: 'Cabling Install — manage fiber-optic network using software',      url: 'https://www.cablinginstall.com/cable/fiber/article/16465451/manage-your-fiber-optic-network-using-software' },
        { tag: 'book',   text: 'Cabling Install — simple Excel for cable management',              url: 'https://www.cablinginstall.com/home/article/16467488/simple-excel-spreadsheet-program-can-help-with-cable-management' },
        { tag: 'forum',  text: 'Slashdot — Best software for tracking fiber optic networks? (2013; field practice is durable)', url: 'https://tech.slashdot.org/story/13/06/08/1627245/ask-slashdot-best-software-for-tracking-fiber-optic-networks' },
        { tag: 'book',   text: 'WiFiTalents — industry roundup of fiber mapping software',         url: 'https://wifitalents.com/best/fiber-mapping-software/' },
        { tag: 'verify', text: 'ANSI/TIA-598-D table values are paywalled. The 12-color sequence is confirmed via FOA, Brady, Broadband Library, and Wikipedia. Confirm edition-specific notes from the paid document for formal design submittals.' },
        { tag: 'verify', text: 'Synchronoss Spatial Suite and ARAMIS: product line ownership is in flux as of 2026. Confirm current product names and features before citing in any procurement document or RFP response.' },
        { tag: 'verify', text: 'BICSI TDMM edition (14th vs 15th): confirm the current cert-exam blueprint targets before citing edition-specific page or table references in any module update.' },
      ]}/>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
   TIA-598 color data (used in the swatch table above)
───────────────────────────────────────────────────────────── */
const TIA598_COLORS = [
  { pos: 1,  name: 'Blue',   hex: '#2563eb', textDark: false, note: 'Most common first fiber; easy reference point' },
  { pos: 2,  name: 'Orange', hex: '#f97316', textDark: false, note: 'Distinct from brown/rose in good lighting' },
  { pos: 3,  name: 'Green',  hex: '#16a34a', textDark: false, note: 'May read gray to red-green colorblind splicers; use position' },
  { pos: 4,  name: 'Brown',  hex: '#92400e', textDark: false, note: 'Warm brown; distinct from slate under good light' },
  { pos: 5,  name: 'Slate',  hex: '#64748b', textDark: false, note: 'Field crews say "gray." Exam answer: slate. Same fiber.' },
  { pos: 6,  name: 'White',  hex: '#ffffff', textDark: true,  note: 'Can yellow slightly with age; position counting advised' },
  { pos: 7,  name: 'Red',    hex: '#dc2626', textDark: false, note: 'Clear distinction; no significant field ambiguity' },
  { pos: 8,  name: 'Black',  hex: '#1e293b', textDark: false, note: 'Strong contrast; look for tracer stripe in second-group tubes' },
  { pos: 9,  name: 'Yellow', hex: '#eab308', textDark: true,  note: 'Bright; can fade to cream in old cables' },
  { pos: 10, name: 'Violet', hex: '#7c3aed', textDark: false, note: 'Also called purple in some field contexts; exam answer: violet' },
  { pos: 11, name: 'Rose',   hex: '#f472b6', textDark: true,  note: 'Field name: pink. Exam answer: rose. Same fiber.' },
  { pos: 12, name: 'Aqua',   hex: '#06b6d4', textDark: true,  note: 'Also called cyan/turquoise; matches OM3/OM4 jacket convention' },
];

/* ─────────────────────────────────────────────────────────────
   Quiz questions
───────────────────────────────────────────────────────────── */
const M7_QUESTIONS = [
  {
    id: 'm7-q1',
    type: 'mc',
    prompt: 'A 144F loose-tube OSP cable has 12 tubes of 12 fibers each. Using TIA-598, what is the correct identification for fiber position 73?',
    choices: [
      'Tube 6 (White), Fiber 1 (Blue)',
      'Tube 7 (Red), Fiber 1 (Blue)',
      'Tube 7 (Red), Fiber 2 (Orange)',
      'Tube 6 (White), Fiber 12 (Aqua)',
    ],
    answerIndex: 1,
    explanation: '73 ÷ 12 = 6 full tubes (72 fibers), remainder 1. The 7th tube is Red (position 7 in TIA-598). The 1st fiber within that tube is Blue (position 1). Full address: Tube 7 (Red) / Fiber 1 (Blue).',
    citation: 'ANSI/TIA-598-D; sequence confirmed via FOA, Brady, Broadband Library, Wikipedia.',
    fieldNote: 'On the job, confirm against the cable\'s printed legend and the splice sheet — a few vendors and legacy cables use non-TIA sequences.',
  },
  {
    id: 'm7-q2',
    type: 'mc',
    prompt: 'A technician refers to the fiber as "position 5" but calls it "gray" rather than by its TIA-598 name. Which statement is most correct?',
    choices: [
      'The technician is wrong; the fiber is white.',
      '"Gray" is an incorrect field term; the splicer should be corrected.',
      '"Slate" (TIA-598 position 5) is what the industry commonly calls "gray." The exam expects "slate"; field crews say "gray." Both refer to the same fiber.',
      '"Gray" is only correct for ribbon cable; loose-tube uses "slate."',
    ],
    answerIndex: 2,
    explanation: 'TIA-598 names position 5 "slate," which is a gray tone. Field crews universally call it "gray." Neither usage is wrong in context — but the certification exam expects "slate." Position counting eliminates ambiguity for color-blind splicers.',
    citation: 'ANSI/TIA-598-D (paywalled); confirmed via FOA, Brady, Broadband Library.',
    fieldNote: 'Red-green colorblind splicers rely on position counting rather than color naming. Teaching position as the primary address and color as a secondary label is the field-correct approach.',
  },
  {
    id: 'm7-q3',
    type: 'mc',
    prompt: 'A technician opens a splice closure and finds the outgoing cable has aqua-colored fibers. What does the aqua jacket on the cable most likely indicate?',
    choices: [
      'Single-mode OS2 cable',
      'OM1 62.5/125 µm multimode',
      'OM3 or OM4 laser-optimized 50/125 µm multimode',
      'OM5 wideband multimode',
    ],
    answerIndex: 2,
    explanation: 'Aqua is the TIA-598 jacket color for OM3 and OM4 laser-optimized 50/125 µm multimode cable. Yellow = single-mode. Orange = OM1/OM2. Lime green = OM5.',
    citation: 'ANSI/TIA-598-D; confirmed via Corning, CommScope product catalogs and Wikipedia TIA-598 article.',
    fieldNote: 'Cheap imported assemblies sometimes use the wrong jacket color. Verify with a VFL and an end-face inspection if the fiber type matters for the link budget.',
  },
  {
    id: 'm7-q4',
    type: 'mc',
    prompt: 'A field tech needs to find "fiber 73" in a cable but has only the splice sheet from the downstream closure, not a topology engine. Which workflow best describes the correct field approach?',
    choices: [
      'Query the GIS map and use the route layer to trace the fiber geometrically.',
      'Open the splice sheet, locate the row for tube 7 (Red) / fiber 1 (Blue), read the peer cable and fiber address, then repeat for each downstream splice until reaching an active port or dead end — sanity-checking OTDR distances at each hop.',
      'Use the fiber number alone (73) as a search key in AutoCAD layer properties.',
      'Send the fiber number to the NOC and wait for them to query the topology system.',
    ],
    answerIndex: 1,
    explanation: 'The field workflow is: resolve fiber 73 to its tube/strand address (tube 7 Red / fiber 1 Blue), then walk the splice sheet hop by hop, verifying OTDR distances. The topology engine is the textbook answer; the splice sheet is the field answer when no engine is available.',
    citation: 'Splice.me — Origins of fiber optic splice sheets; module 7 research log Section 3.',
    fieldNote: '"Fiber 73" is not a complete address. At the splice, the splicer may have renumbered. The splice sheet is the translation table.',
  },
  {
    id: 'm7-q5',
    type: 'dragdrop',
    prompt: 'Match each cable jacket or connector boot color to its fiber type. (Drag each color chip to the correct fiber type target.)',
    items: [
      { id: 'col-yellow',     label: 'Yellow jacket' },
      { id: 'col-orange',     label: 'Orange jacket' },
      { id: 'col-aqua',       label: 'Aqua jacket' },
      { id: 'col-limegreen',  label: 'Lime green jacket' },
      { id: 'col-blue-boot',  label: 'Blue boot' },
      { id: 'col-green-boot', label: 'Green boot' },
    ],
    targets: [
      { id: 't-os2',    label: 'OS1 / OS2 single-mode' },
      { id: 't-om1om2', label: 'OM1 / OM2 multimode' },
      { id: 't-om3om4', label: 'OM3 / OM4 laser-optimized MM' },
      { id: 't-om5',    label: 'OM5 wideband multimode' },
      { id: 't-upc',    label: 'Single-mode UPC connector' },
      { id: 't-apc',    label: 'Single-mode APC connector' },
    ],
    correctMap: {
      't-os2':    'col-yellow',
      't-om1om2': 'col-orange',
      't-om3om4': 'col-aqua',
      't-om5':    'col-limegreen',
      't-upc':    'col-blue-boot',
      't-apc':    'col-green-boot',
    },
    explanation: 'Yellow = OS1/OS2 SM. Orange = OM1/OM2. Aqua = OM3/OM4. Lime green = OM5. Blue boot = UPC SM connector. Green boot = APC SM connector. Mixing green (APC) and blue (UPC) damages the APC ferrule and causes reflections.',
    citation: 'ANSI/TIA-598-D; confirmed via FOA, Brady, Corning, CommScope catalogs.',
    fieldNote: 'APC (green boot) must never be mated to UPC (blue boot). The color convention is the visual lock-out. Always inspect connector end-faces before mating, especially when using assemblies from unfamiliar suppliers.',
  },
  {
    id: 'm7-q6',
    type: 'dragdrop',
    prompt: 'Match each vendor tool to its primary use case or characteristic. (Drag each tool name to the correct description.)',
    items: [
      { id: 'tool-vetro',   label: 'VETRO FiberMap' },
      { id: 'tool-bentley', label: 'Bentley OpenComms' },
      { id: 'tool-splice',  label: 'Splice.me' },
      { id: 'tool-iqgeo',   label: 'IQGeo Network Mgr' },
      { id: 'tool-3gis',    label: '3-GIS' },
      { id: 'tool-ozmap',   label: 'OZmap' },
    ],
    targets: [
      { id: 'uc-cloudgis',    label: 'Cloud GIS fiber mapping; strong in muni / co-op ISPs' },
      { id: 'uc-cadmso',      label: 'CAD/MicroStation-based; popular in cable MSO and utility' },
      { id: 'uc-splicediag',  label: 'Purpose-built splice diagram + matrix; marketed as the spreadsheet replacement' },
      { id: 'uc-digitaltwin', label: 'Geospatial "digital twin"; planning–build–operate lifecycle; common at Tier-1 carriers' },
      { id: 'uc-inctelco',    label: 'Fiber design + lifecycle; harmonizes copper and fiber; heavy use among incumbent telcos' },
      { id: 'uc-latam',       label: 'Brazilian-origin fiber mapping + splice diagramming; strong in LATAM ISP market' },
    ],
    correctMap: {
      'uc-cloudgis':    'tool-vetro',
      'uc-cadmso':      'tool-bentley',
      'uc-splicediag':  'tool-splice',
      'uc-digitaltwin': 'tool-iqgeo',
      'uc-inctelco':    'tool-3gis',
      'uc-latam':       'tool-ozmap',
    },
    explanation: 'VETRO = cloud GIS, muni/co-op. Bentley OpenComms = CAD/MicroStation, MSO/utility. Splice.me = splice diagrams, spreadsheet replacement. IQGeo = digital twin, Tier-1. 3-GIS = copper+fiber lifecycle, incumbents. OZmap = Brazilian-origin, LATAM market.',
    citation: 'Vendor product pages (VETRO, 3-GIS, IQGeo, Bentley, Splice.me, OZmap); industry roundups at WiFiTalents and Splice.me blog (all current as of 2026).',
    fieldNote: 'No one tool wins at all tiers. The key decision factor is usually who else at the ISP already uses it — data migration cost is often higher than license cost.',
  },
];
