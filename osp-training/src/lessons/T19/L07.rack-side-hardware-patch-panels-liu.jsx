// Net-new — T19.L07
// T19.L07 — Rack-Side Hardware — Patch Panels and LIU
// Working lesson: ODF, patch panels, LIU, interconnect vs. cross-connect, port density

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import SideBySide from '../../components/primitives/SideBySide.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T19.L07',
  course_id: 'T19',
  title: 'Rack-Side Hardware — Patch Panels and LIU',
  order: 7,
  lesson_type: 'working',
  prerequisites: ['T19.L06'],
  learning_objectives: [
    'Distinguish between a patch panel and a LIU (Light Interface Unit) and explain the role of each in a rack-side fiber termination environment',
    'Explain the difference between an interconnect architecture and a cross-connect architecture in a telecom rack context',
    'Describe what an ODF (Optical Distribution Frame) rack is and why OSP feeder fibers terminate there before reaching active OLT equipment',
    'Identify the function of a splice organizer tray in a LIU and explain its role when OSP cables enter the headend with ribbon or loose-tube fiber',
    'Explain how fiber count planning for OSP feeder routes is affected by the rack-space and LIU-port capacity at the headend',
  ],
  estimated_minutes: 22,
  vocabulary_introduced: [
    'patch panel',
    'LIU',
    'interconnect',
    'cross-connect',
    'ODF rack',
    'splice organizer',
    'pigtail',
    'trunk cable',
  ],
  key_terms: [
    {
      term: 'patch panel',
      definition: 'A passive rack-mounted panel with an array of fiber optic connectors on the front face. Each front-face port connects via pigtail or factory-terminated trunk adapter to either (a) a fusion-splice in the integrated splice tray, or (b) the rear connector on a pre-terminated backbone cable. The technician uses short patch cords to connect any front-face port to any other (for cross-connection) or to active equipment directly (for interconnection). Patch panels are the primary tool for fiber circuit management in a CO or headend.',
    },
    {
      term: 'LIU',
      definition: 'Light Interface Unit — a rack-mounted enclosure or panel that organizes fiber terminations at the OSP-to-ISP boundary, typically at the ODF. An LIU may combine a patch panel (connector front face) with an integrated splice tray in a single 1U or 2U unit. The term is used loosely in the field to mean any rack-mounted fiber termination unit; in some contexts it specifically means the fiber management enclosure at the OLT port-to-feeder connection.',
    },
    {
      term: 'interconnect',
      definition: 'A wiring method where active equipment connects directly to the horizontal or backbone cable without a cross-connect field in between. In an interconnect architecture, the OLT port connects via a single patch cord directly to the OSP feeder fiber at the ODF. Simple, low-loss (one fewer connector pair vs. cross-connect), but less flexible for circuit rearrangement — any move requires physically re-patching at the OLT port. Per TIA-568.3-D [confirm edition] §6, interconnect is acceptable for direct equipment-to-cabling connections.',
    },
    {
      term: 'cross-connect',
      definition: 'A wiring method where active equipment and the horizontal/backbone cable both terminate at separate passive fields (the cross-connect), connected to each other by jumper cords or patch cords. In a cross-connect architecture, OLT ports and OSP feeder fibers both terminate on the ODF patch panel front face — one section for OLT patches, one for feeder patches — connected by jumper cords across the ODF. More flexible (any OLT port can reach any feeder port by changing one jumper) but adds connector-pair loss compared to interconnect. Standard architecture for most CO ODFs.',
    },
    {
      term: 'ODF rack',
      definition: 'Optical Distribution Frame rack — the equipment rack (typically 7-foot, EIA 19-inch wide) that houses the ODF patch panels, LIUs, splice organizers, and fiber management hardware at the CO or headend. The ODF rack is the heart of the OSP-to-ISP handoff. It typically stands near the cable entry point in the MDF room. All OSP feeder fibers terminate on the ODF rack.',
    },
    {
      term: 'splice organizer',
      definition: 'A rack-mounted or wall-mounted enclosure that protects and organizes fusion splices. Splice organizers hold individual splice trays (typically 12 or 24 splices per tray), with the spliced fiber lengths coiled inside. In an integrated LIU or patch panel, the splice organizer is built in — pigtails splice to feeder fibers inside the unit. Standalone splice organizers (e.g., 4U enclosures with 12 trays = 288 splice capacity) are used when the feeder cable count exceeds what a compact LIU can accommodate.',
    },
    {
      term: 'pigtail',
      definition: 'A short factory-terminated fiber segment — one end has a connector (LC, SC, MPO) installed at the factory under controlled conditions; the other end is a bare fiber ready for field fusion splicing. Pigtails are the splice point between inside-plant connectorized patch panels and outside-plant (or inside-plant backbone) fibers. Factory termination yields better optical performance than field-terminated connectors. Pigtail lengths are typically 1–3 meters (enough to reach from splice tray to front-face connector adapter).',
    },
    {
      term: 'trunk cable',
      definition: 'A pre-terminated multi-fiber cable with factory-installed MPO or MTP connectors on both ends. Used for high-density connections between ODF patch panels and OLT equipment or between patch panels in adjacent racks. Trunk cables eliminate the need for field splicing between racks. Common in high-density CO deployments where space and installation time are at a premium. Trunk cables must match the fiber count and connector type on both ends precisely — specify during ODF design.',
    },
  ],
  vocabulary_assumed: [
    { term: 'CO', source_lesson_id: 'T19.L01' },
    { term: 'MDF', source_lesson_id: 'T19.L01' },
    { term: 'OSP termination point', source_lesson_id: 'T19.L01' },
    { term: 'OLT', source_lesson_id: 'T19.L02' },
    { term: 'GPON port', source_lesson_id: 'T19.L02' },
    { term: 'port density', source_lesson_id: 'T19.L02' },
    { term: 'TMGB', source_lesson_id: 'T19.L06' },
  ],
  estimated_minutes: 25,
};

export default function T19L07_RackSideHardwarePatchPanelsLiu() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          The ODF rack is the translation layer between your OSP work and the ISP's
          active equipment. On the OSP side: feeder cables pull in with hundreds of fibers
          in loose tubes. On the ISP side: OLT chassis with neat rows of SFP ports, each
          waiting for a single-fiber patch cord. The ODF takes those loose OSP fibers,
          splices them to factory-terminated pigtails, and presents them as a clean
          connector field that the ISP team can patch to OLT ports.
        </p>
        <p className="mt-2">
          Think of the ODF like the patch bay in a recording studio — an input arrives
          (the OSP feeder fiber), and by plugging a patch cord into the panel, you route
          it to any output (any OLT port) without touching the underlying wiring. The ODF
          makes the network's fiber plant manageable and rearrangeable as the network grows.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ODF</td>
              <td className="px-3 py-2">Optical Distribution Frame</td>
              <td className="px-3 py-2">The rack/frame where OSP fibers terminate and connect to ISP equipment</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">LIU</td>
              <td className="px-3 py-2">Light Interface Unit</td>
              <td className="px-3 py-2">A compact rack-mount unit combining patch panel and splice tray</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MPO/MTP</td>
              <td className="px-3 py-2">Multi-fiber Push-On / Mechanical Transfer Push-On</td>
              <td className="px-3 py-2">A 12- or 24-fiber connector used in high-density trunk cables</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SFP</td>
              <td className="px-3 py-2">Small Form-factor Pluggable</td>
              <td className="px-3 py-2">The hot-swappable optical transceiver that plugs into OLT ports; accepts one LC connector pair</td>
            </tr>
          </tbody>
        </table>

        {/* ── FLASHCARDS ───────────────────────────────────────────────── */}
        <Flashcard
          deckId="T19-L07"
          cards={[
            {
              id: 'T19-L07-fc-patch-panel',
              front: 'What is a patch panel in an ODF?',
              back: 'A passive rack-mounted panel with fiber optic connectors on the front face. Each port connects via pigtail or adapter to either a splice tray or backbone cable on the back. Patch cords connect any port to any other (cross-connect) or directly to equipment (interconnect). Primary tool for fiber circuit management in a CO.',
            },
            {
              id: 'T19-L07-fc-liu',
              front: 'What is an LIU?',
              back: 'Light Interface Unit — a rack-mounted enclosure combining a patch panel (connector front face) with an integrated splice tray. Organizes fiber terminations at the OSP-to-ISP boundary. Term used loosely in the field for any rack-mount fiber termination unit.',
            },
            {
              id: 'T19-L07-fc-interconnect',
              front: 'What is the interconnect wiring method?',
              back: 'Active equipment connects directly to the cable via a single patch cord — no cross-connect field in between. Simple, low-loss (one fewer connector pair vs. cross-connect). Less flexible for rearrangement. Per TIA-568.3-D §6 [confirm edition].',
            },
            {
              id: 'T19-L07-fc-cross-connect',
              front: 'What is the cross-connect wiring method?',
              back: 'Active equipment and cables both terminate at a passive patch panel. A jumper cord connects the two sides. More flexible (any OLT port can reach any feeder by changing one jumper). Adds connector-pair loss vs. interconnect. Standard for most CO ODFs.',
            },
            {
              id: 'T19-L07-fc-splice-organizer',
              front: 'What is a splice organizer?',
              back: 'A rack or wall-mounted enclosure holding fusion-splice trays. Protects and organizes spliced fibers. Typically 12 or 24 splices per tray. Can be built into an LIU/patch panel or standalone (e.g., 4U × 12 trays = 288 splice capacity).',
            },
            {
              id: 'T19-L07-fc-pigtail',
              front: 'What is a pigtail in ODF context?',
              back: 'A short factory-terminated fiber with a connector on one end and bare fiber on the other for field fusion splicing. Factory termination yields better optical performance than field termination. Typically 1–3 m long. Spliced to OSP feeder fiber inside the splice organizer; connector end faces the ODF patch panel front face.',
            },
            {
              id: 'T19-L07-fc-trunk-cable',
              front: 'What is a trunk cable?',
              back: 'A pre-terminated multi-fiber cable with factory MPO/MTP connectors on both ends. Used for high-density connections between adjacent racks without field splicing. Must match fiber count and connector type on both ends exactly.',
            },
            {
              id: 'T19-L07-fc-odf-rack',
              front: 'What is an ODF rack?',
              back: 'Optical Distribution Frame rack — the equipment rack (typically 7-foot, EIA 19-inch wide) that houses the ODF patch panels, LIUs, splice organizers, and fiber management hardware at the CO or headend. The ODF rack is the heart of the OSP-to-ISP handoff. It typically stands near the cable entry point in the MDF room. All OSP feeder fibers terminate on the ODF rack.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>How the ODF Is Built — From Feeder Fiber to OLT Port</h2>

        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3">
          <p className="font-semibold text-blue-300 text-sm mb-2">Quick Refresher: Building and OLT Context from Earlier Lessons</p>
          <ul className="text-sm text-slate-300/90 space-y-1">
            <li><strong>MEF / Main Entrance Facility (from T19.L01):</strong> Where your cable enters the building. Fiber routes from MEF on cable tray to the ODF rack.</li>
            <li><strong>MDF / ODF (from T19.L01):</strong> Main Distribution Frame — your OSP feeder fiber terminates here. For fiber networks, it's an ODF (Optical Distribution Frame).</li>
            <li><strong>OLT ports (from T19.L02):</strong> Each GPON port expects a fiber patch cord routed from the ODF. Your splicing matrix tells the ISP which ODF port feeds which GPON port.</li>
          </ul>
        </div>

        <h3 className="mt-4 font-semibold">ODF construction sequence</h3>
        <p className="mt-2">
          Here's how a 144-fiber feeder cable goes from a loose-tube bundle to a
          clean patch panel ready for OLT connection:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Feeder cable enters building, service loop coiled in MEF.</strong>
            Cable is routed on J-hooks or cable tray from MEF to ODF rack.
          </li>
          <li>
            <strong>Cable enters splice organizer.</strong>
            The cable jacket and armor are stripped back; individual buffer tubes are fanned
            out and routed into the splice organizer's cable entry port. Strength members
            are anchored to the organizer's cable clamp.
          </li>
          <li>
            <strong>Individual fibers are cleaved and fusion-spliced to pigtails.</strong>
            Each of the 144 fibers gets a pigtail splice. The pigtail's factory connector
            end routes to the front-face adapter on the patch panel.
          </li>
          <li>
            <strong>Splice trays organize the splices.</strong>
            Typically 12 splices per tray; 12 trays for 144 fibers. Each splice is
            protected by a heat-shrink sleeve. Excess fiber length is coiled neatly in
            the tray's storage wheel.
          </li>
          <li>
            <strong>Front-face connectors accept patch cords.</strong>
            The 144 pigtail connectors are now accessible on the ODF front face, labeled
            with the OSP fiber ID from the splicing matrix. The ISP team connects patch
            cords from these ports to the OLT GPON ports.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">Interconnect vs. cross-connect — the ODF architecture choice</h3>

        {/* SIDE BY SIDE */}
        <SideBySide
          title="Interconnect vs. Cross-Connect at the ODF"
          leftLabel="Interconnect"
          rightLabel="Cross-Connect"
          rows={[
            {
              label: 'Wiring path',
              left: 'OLT port → [one patch cord] → ODF front face (pigtail spliced to feeder fiber)',
              right: 'OLT port → [patch cord] → ODF section A (OLT field) → [jumper] → ODF section B (feeder field) → pigtail → feeder fiber',
            },
            {
              label: 'Connector pair count',
              left: '1 pair (OLT-to-ODF)',
              right: '2 pairs (OLT-to-ODF-A + ODF-A-to-ODF-B)',
            },
            {
              label: 'Connector loss per pair (planning values)',
              left: '0.30 dB factory pre-terminated pigtail (typical). Use 0.50 dB conservative planning value per TIA-568.3-D maximum for field-polished connectors.',
              right: '0.30 dB per pair × 2 pairs = 0.60 dB typical (factory). 0.50 dB × 2 = 1.00 dB conservative (field-polished) — notable at end-of-link budget.',
            },
            {
              label: 'Circuit rearrangement',
              left: 'Must move the patch cord at the OLT port — requires access to the OLT chassis',
              right: 'Move the jumper on the ODF cross-connect field — no need to access OLT chassis',
            },
            {
              label: 'When to use',
              left: 'Small huts with few OLT ports where rearrangement is rare. OLT chassis is accessible.',
              right: 'Full COs with high port counts and frequent rearrangements. OLT chassis is in a locked cage.',
            },
          ]}
        />

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — Cross-Connect Terminology</p>
          <p className="text-slate-300/90">
            <strong>Book (TIA-568.3-D [confirm edition] §6):</strong> Cross-connect uses a
            passive cross-connect field with patch cords between the equipment and cable side.
            Interconnect connects active equipment directly to the horizontal cable.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> CO and headend technicians call any ODF patch panel a
            "cross-connect" or just "the panel" regardless of whether it technically meets
            TIA-568's cross-connect architecture definition. "I'm going to the cross-connect
            to trace that fiber" means "I'm going to the ODF." The book vocabulary and the
            field shorthand both refer to the same physical space. Know both terms — which one
            you use depends on whether you're talking to an ISP engineer who knows TIA-568 or
            a field tech who has never read a TIA standard.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Port density and ODF planning</h3>
        <p className="mt-2">
          When planning the ODF rack, the OSP engineer needs to account for:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Total fiber count:</strong> Number of OSP feeder fibers terminating on the ODF.
            Each fiber needs one pigtail splice and one front-face connector port.
          </li>
          <li>
            <strong>Rack unit budget:</strong> Standard 1U patch panels hold 12 or 24 LC ports.
            For 144 fibers: 144 ÷ 24 = 6U of patch panel space, plus splice organizer space
            (typically 2–4U per 144 splices).
          </li>
          <li>
            <strong>Growth capacity:</strong> Specify ODF racks with 30–50% empty capacity
            for future feeder cables. Retrofitting rack space is expensive.
          </li>
          <li>
            <strong>Fiber management:</strong> Radius-controlled fiber management panels between
            patch panels prevent micro-bend loss from tight bends on patch cords. Budget 1U
            for every 2–3U of patch panel space.
          </li>
        </ul>
      </section>

      {/* ── LABELED LIST — ODF rack sections ──────────────────────────────── */}
      <div className="lesson-callout">
        <h4>ODF Rack Layout — From Feeder to OLT (OSP to ISP Handoff)</h4>
        <ol>
          <li>
            <strong>Splice Organizer</strong> — Holds the fusion-splice trays where OSP feeder
            fiber meets inside-plant pigtails. The OSP engineer specifies this space and performs
            the splicing. The splice organizer is the OSP engineer's final deliverable inside the
            building — fibers are spliced, managed, and protected here.
          </li>
          <li>
            <strong>Patch Panel — ODF Front Face</strong> — The connector field presenting pigtail
            ends as connectorized ports. Each port is labeled with OSP fiber IDs from the splicing
            matrix. The ISP team patches from here to OLT ports. Each port corresponds to one
            OSP fiber in the feeder cable. <em>OSP/ISP boundary.</em>
          </li>
          <li>
            <strong>Fiber Management Panels</strong> — Radius-controlled panels that guide patch
            cords between the ODF front face and the OLT rack without tight bends. Prevents
            micro-bend loss on patch cords. Plan 1U of fiber management for every 2–3U of patch
            panel space when specifying ODF height.
          </li>
          <li>
            <strong>Patch Cord (to OLT)</strong> — A short factory-terminated cord (typically
            1–3 m, LC/UPC or SC/APC) connecting an ODF front-face port to the corresponding OLT
            GPON port. The ISP team installs and manages patch cords. The OSP engineer's job is
            to ensure the ODF front face is clearly labeled per the splicing matrix so the ISP
            team can patch correctly without ambiguity. <em>ISP territory.</em>
          </li>
        </ol>
      </div>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T19.L07 Check — Patch Panels and LIU"
        mode="multiple-choice"
        questions={[
          {
            id: 'T19-L07-Q1',
            type: 'mc',
            prompt:
              'An OSP engineer completes splicing a 96-fiber feeder cable to pigtails in the splice organizer. The pigtail connectors are now accessible on the ODF front-face patch panel. What is the OSP engineer\'s final deliverable before the ISP team can commission the OLT?',
            choices: [
              'Install patch cords from the ODF front face to the OLT GPON ports',
              'Provide a labeled splicing matrix showing which ODF port corresponds to which OSP feeder fiber, feeder route, and OLT port assignment',
              'Test each OLT port with an OTDR from the ODF front face',
              'Configure the OLT with the fiber port assignments via CLI',
            ],
            answerIndex: 1,
            explanation:
              'The OSP engineer\'s deliverable is a labeled, accurate splicing matrix — the document (or drawing) that shows which ODF front-face port corresponds to which physical feeder fiber, which FDH, which splitter branch, and which subscriber address range. Without this, the ISP team cannot correctly patch OLT ports to the intended service areas. Installing patch cords and configuring the OLT are ISP team tasks.',
          },
          {
            id: 'T19-L07-Q2',
            type: 'mc',
            prompt:
              'A cross-connect ODF architecture adds one additional connector pair in the signal path compared to an interconnect architecture. If each connector pair contributes 0.30 dB loss, and the GPON optical budget is 28 dB, how does the extra connector pair affect the OSP plant design?',
            choices: [
              'No effect — 0.30 dB is within measurement error and can be ignored',
              'The additional 0.30 dB reduces the available OSP plant budget from 28 dB to 27.70 dB — the OSP plant link budget must account for this reduction. On a budget-constrained link (near the 28 dB limit), this 0.30 dB reduction could push the link from passing to failing.',
              'The additional connector pair is only in the ISP-side wiring and is not subtracted from the OSP link budget',
              'Cross-connect architecture adds 1.0 dB (not 0.30 dB) because it requires two connectors instead of one at the ODF',
            ],
            answerIndex: 1,
            explanation:
              'Every connector pair in the signal path subtracts from the 28 dB GPON optical budget. Cross-connect adds one pair at the ODF cross-connect field (OLT side → feeder side) that interconnect does not have. Planning values per connector pair: 0.30 dB typical for factory pre-terminated pigtails; 0.50–0.75 dB maximum per TIA-568.3-D [confirm edition] for field-polished connectors. Use 0.50 dB as the conservative planning value for any field-terminated connector in a link budget. On a 24 km feeder with 1:32 split, the budget may already be tight — 0.30–0.50 dB can be the difference between a passing and failing link budget. Always account for architecture-dependent connector count and termination method when calculating the OSP plant budget.',
            citation: 'TIA-568.3-D [confirm edition] §5.',
          },
          {
            id: 'T19-L07-Q3',
            type: 'fill-in-blank',
            prompt:
              'A pigtail is a short factory-terminated fiber segment with a connector on one end and a bare fiber on the other. The bare fiber end is connected to the OSP feeder fiber by ____.',
            answer: 'fusion splicing',
            answerDisplay: 'fusion splicing',
            explanation:
              'The bare fiber end of a pigtail is fusion-spliced to the corresponding OSP feeder fiber inside the splice organizer. Factory termination of the connector end yields better optical performance than field termination. Fusion splicing provides a low-loss, permanent connection (typically 0.05–0.10 dB per splice) between the pigtail and the OSP feeder fiber.',
          },
          {
            id: 'T19-L07-Q4',
            type: 'mc',
            prompt:
              'Why is a trunk cable (pre-terminated MPO/MTP cable) used for connections between adjacent ODF patch panels in a high-density CO rather than individual pigtail splices?',
            choices: [
              'Trunk cables have lower loss than pigtail splices — MPO connectors outperform fusion splices',
              'Trunk cables eliminate the need for field splicing between adjacent racks — they are faster to install, use less rack space (no splice organizer needed between racks), and maintain organized fiber routing in a high-density environment',
              'Trunk cables are required by TIA-568 between any two adjacent fiber racks',
              'Trunk cables allow technicians to route signals bidirectionally on a single fiber',
            ],
            answerIndex: 1,
            explanation:
              'Trunk cables with factory MPO/MTP connectors eliminate inter-rack splicing entirely. Installing a trunk is a plug-in operation — no fusion splicer, no splice organizer space consumed in the inter-rack run, no field termination errors. In high-density COs with many adjacent ODF racks, trunks significantly reduce installation time and keep the rack space organized. Fusion splice loss (0.05–0.10 dB) is actually lower than MPO connector loss (~0.5–1.0 dB per mated pair), so trunks are NOT a loss-reduction measure — they are an installation-convenience and space-efficiency measure.',
          },
        ]}
      />

    </LessonLayout>
  );
}
