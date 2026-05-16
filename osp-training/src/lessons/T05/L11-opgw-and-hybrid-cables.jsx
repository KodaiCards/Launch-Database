// Net-new — T05.L11 OPGW and Hybrid Cables
// Advanced lesson: OPGW structure, where it's used, fault current, hybrid OSP concepts

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import SideBySide from '../../components/primitives/SideBySide.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T05.L11',
  course_id: 'T05',
  title: 'OPGW and Hybrid Cables',
  order: 11,
  lesson_type: 'advanced',
  prerequisites: ['T05.L10'],
  learning_objectives: [
    'Explain what OPGW is, where it is used, and why it is not a joint-use attachment product',
    'Describe how OPGW serves dual functions as both a lightning shield wire and a fiber carrier',
    'Explain why OPGW must handle fault current and how the cable design accommodates that requirement',
    'Distinguish OPGW from ADSS and lashed plant for the purpose of OSP design decisions',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'OPGW',
    'shield wire',
    'overhead ground wire (OGW)',
    'ground fault current',
    'transmission structure',
    'hybrid cable',
  ],
  vocabulary_assumed: [
    { term: 'ADSS', source_lesson_id: 'T03.L04' },
    { term: 'EDS (Everyday Stress)', source_lesson_id: 'T05.L10' },
    { term: 'RTS (Rated Tensile Strength)', source_lesson_id: 'T05.L10' },
    { term: 'joint use', source_lesson_id: 'T05.L08' },
    { term: 'messenger', source_lesson_id: 'T03.L04' },
    { term: 'sag (s)', source_lesson_id: 'T05.L07' },
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'span', source_lesson_id: 'T01.L02' },
    { term: 'attachment', source_lesson_id: 'T01.L02' },
  ],
  key_terms: [
    {
      term: 'OPGW',
      definition:
        'Optical Ground Wire — a cable that simultaneously performs two functions: it acts as the overhead ground (shield) wire on a high-voltage transmission structure, protecting the power conductors from lightning strikes, AND carries a fiber optic core inside a protective metallic tube. OPGW replaces the conventional steel shield wire on transmission towers, adding fiber capacity at minimal additional structural cost.',
    },
    {
      term: 'shield wire',
      definition:
        'Also called an overhead ground wire (OGW or OHGW) — a conductor that runs along the top of a transmission structure, above the phase conductors, and is bonded to the tower structure and grounded at every tower. Its purpose is to intercept lightning strikes before they hit the phase conductors. Shield wires run the full length of a transmission line and are shunted to ground at each structure. OPGW replaces this wire while adding fiber.',
    },
    {
      term: 'overhead ground wire (OGW)',
      definition:
        'The traditional steel or ACSR (Aluminum Conductor Steel Reinforced) shield wire on a transmission line. OGW is a purely structural and electrical device — it carries ground fault current and lightning energy to the tower ground. When utilities decide to add fiber to an existing transmission corridor, replacing OGW with OPGW is the standard approach.',
    },
    {
      term: 'ground fault current',
      definition:
        'The large transient electrical current that flows through the shield wire and tower ground when a fault occurs on the transmission line (for example, a phase conductor contacts a tree, causing a short circuit). Ground fault currents on transmission lines can be thousands to tens of thousands of amperes for a brief period (typically milliseconds to cycles). OPGW must carry this current without damaging the fiber core — the metallic strands in the OPGW are sized to handle the fault current thermally.',
    },
    {
      term: 'transmission structure',
      definition:
        'A lattice steel tower, H-frame structure, or monopole used to support high-voltage transmission lines (typically 69 kV and above). Transmission structures are larger, taller, and more heavily engineered than distribution poles. OPGW is installed on transmission structures, not on the distribution or joint-use poles where most OSP lashed plant and ADSS is installed.',
    },
    {
      term: 'hybrid cable',
      definition:
        'A cable that combines fiber optic elements with copper conductors (and/or metallic strength members) in a single sheath. Hybrid cables are used when fiber communications and copper power or signal delivery must run the same physical path — for example, powering remote sensing equipment along a fiber route. Hybrid cables are less common in pure OSP fiber distribution but appear in some specialty applications (direct-buried combined service drops, remote terminal power).',
    },
  ],
};

export const key_terms = meta.key_terms;

export default function T05L11_OPGWAndHybridCables() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Every high-voltage transmission line (the big steel towers you see crossing
          open fields and rivers) has a wire running along the very top of the structure,
          above all the phase conductors. It's called the <strong>shield wire</strong> or
          overhead ground wire. Its job is to act as a lightning rod for the whole
          transmission line — if lightning strikes anywhere near the line, it's supposed
          to hit the shield wire and be conducted safely down the tower and into the ground,
          instead of blowing out the phase conductors and taking down the grid.
        </p>
        <p className="mt-2">
          Now imagine you're an electric utility and you need fiber connectivity between
          substations — maybe for SCADA control signals, protection relay communication,
          or to carry internet traffic. You already have a transmission corridor. You
          already have shield wires. The question is: can you put fiber inside those
          shield wires?
        </p>
        <p className="mt-2">
          Yes — and <strong>OPGW (Optical Ground Wire)</strong> is exactly that.
          OPGW looks like a steel cable on the outside, but inside there's a stainless
          steel or aluminum tube containing a fiber optic core. It replaces the conventional
          shield wire with one that does everything the old shield wire did (conducts lightning,
          carries ground fault current) PLUS carries fiber.
        </p>
        <p className="mt-2">
          For most OSP designers working on distribution-level aerial fiber, OPGW is not
          something you'll install. But you'll encounter it when a project involves using
          the electric utility's transmission infrastructure for a fiber backbone segment,
          or when you're reading a network diagram and need to recognize what an OPGW
          segment represents.
        </p>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T05-L11"
          cards={[
            {
              id: 'T05-L11-fc-opgw',
              front: 'What is OPGW and what two functions does it serve?',
              back: 'OPGW (Optical Ground Wire) is a cable installed at the top of high-voltage transmission structures that: (1) acts as the overhead ground (shield) wire, intercepting lightning and carrying ground fault current to the tower ground system, AND (2) carries a fiber optic core inside a protected metallic tube. It replaces the conventional steel shield wire while adding fiber capacity.',
            },
            {
              id: 'T05-L11-fc-fault',
              front: 'Why must OPGW handle ground fault current, and how does the cable design accommodate this?',
              back: 'When a fault occurs on the transmission line (a phase conductor shorts to ground or structure), the fault current flows through the shield wire path to the tower ground. On large transmission systems, this can be thousands to tens of thousands of amps for milliseconds. OPGW\'s outer metallic strands (steel, aluminum, or alloy) are sized to carry this thermal energy pulse without heating the inner fiber tube to a temperature that damages the fiber core.',
            },
            {
              id: 'T05-L11-fc-vs-adss',
              front: 'OPGW vs ADSS — what\'s the key structural difference and where is each used?',
              back: 'ADSS is all-dielectric (no metal) and designed for joint-use distribution poles — it avoids induced voltages near power lines and doesn\'t need grounding. OPGW is primarily metallic (steel/aluminum outer strands with a fiber core inside) and is designed for the top of transmission towers where being metallic and grounded is required for lightning and fault protection. ADSS = distribution/joint-use. OPGW = transmission corridor.',
            },
            {
              id: 'T05-L11-fc-hybrid',
              front: 'What is a hybrid cable and where is it typically used in OSP?',
              back: 'A hybrid cable combines fiber optic elements with copper conductors (and/or metallic strength members) in a single sheath. It\'s used where the same physical run must deliver both fiber communications and copper-based power or signal. Examples: powering remote sensors on a fiber route, combined service drops where both internet (fiber) and phone (copper) must be delivered on one cable. Less common in pure distribution fiber than in specialty applications.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>OPGW Structure and How It Works</h2>
        <p>
          OPGW is built as a series of concentric layers:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Inner fiber tube:</strong> A stainless steel or aluminum tube containing
            the fiber optic elements (typically 12–96 fibers, gel-filled or dry). The tube
            is designed to protect the fibers from the mechanical and thermal stresses of the
            outer layers.
          </li>
          <li>
            <strong>Metallic outer strands:</strong> One or more layers of steel or
            aluminum-clad steel (ACS) or aluminum alloy (AA) wires stranded around the inner
            tube. These strands provide: (a) the tensile strength to hang the cable on tower
            spans (which can exceed 1,000 ft on transmission lines), (b) the electrical
            conductivity path for fault current and lightning, and (c) the mechanical
            protection for the inner fiber tube.
          </li>
          <li>
            <strong>No outer jacket:</strong> Unlike ADSS or lashed plant, OPGW typically has
            no polymeric outer jacket. The metallic strands are the outer surface. The cable
            is bonded to each tower structure and grounded.
          </li>
        </ol>

        <SideBySide
          title="OPGW vs. ADSS — Key Differences at a Glance"
          leftLabel="OPGW"
          rightLabel="ADSS"
          rows={[
            {
              attribute: 'Outer construction',
              left: 'Metallic strands (steel, aluminum alloy) — must be grounded',
              right: 'All-dielectric sheath (polyethylene or similar) — no grounding needed',
            },
            {
              attribute: 'Where it goes on the pole/structure',
              left: 'Top of the structure — replaces the shield wire',
              right: 'Communication space on joint-use distribution poles',
            },
            {
              attribute: 'Who typically installs it',
              left: 'Electric utility transmission crew (supply-space work)',
              right: 'OSP contractor / telecom company crew (comm-space work)',
              highlight: 'right',
            },
            {
              attribute: 'Lightning and fault handling',
              left: 'Required — must conduct fault current thermally',
              right: 'No — designed to be isolated from power induction',
            },
            {
              attribute: 'Attachment method',
              left: 'Bonded to tower structure and grounded at each tower',
              right: 'Suspended from pole using deadend/suspension clamps; no grounding required',
            },
            {
              attribute: 'Span length',
              left: 'Can exceed 1,000 ft on large transmission corridors',
              right: 'Typically 100–400 ft per manufacturer span rating',
            },
            {
              attribute: 'Design discipline',
              left: 'Electric utility / transmission engineering',
              right: 'OSP / telecommunications engineering (your job)',
              highlight: 'right',
            },
          ]}
        />

        <h3 className="mt-6 font-semibold">OPGW and OSP project overlap — what the OSP designer needs to know</h3>
        <p className="mt-2">
          In most OSP projects, OPGW is not something you design — it's something you
          connect to. Common scenarios:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Backhaul segment:</strong> The electric utility's OPGW provides
            a fiber backbone between two substations. Your network design uses fiber
            from a splice point at substation A, runs through the utility's OPGW to
            substation B, and then distributes from there using conventional aerial
            lashed plant or ADSS. Your design draws show an "OPGW segment (partner
            utility)" for the transmission section.
          </li>
          <li>
            <strong>IRU (Indefeasible Right of Use):</strong> The electric utility
            leases fiber strands inside their OPGW to your company under an IRU
            agreement. You pay a recurring fee for the fiber strands; they maintain
            the OPGW. Your job is to understand what fiber count you're leasing,
            what the span loss is, and how to splice to it at the handoff locations.
          </li>
          <li>
            <strong>Joint project:</strong> Some rural broadband deployments involve
            a co-op that owns both the transmission infrastructure and the OSP fiber
            distribution. In those cases, the OPGW engineer and the OSP designer
            must coordinate the transition point (typically at the substation or at a
            dedicated splice enclosure mounted on the transmission structure) and agree
            on the fiber count handed off to the distribution side.
          </li>
        </ul>
        <p className="mt-3 text-sm text-slate-300/80">
          Sources: RUS Bulletin 1751F-630 (scope references OPGW in backbone context);
          FOA Reference Guide to Fiber Optics (OPGW section); AFL/Prysmian OPGW
          product documentation (public datasheets). OPGW fault current sizing is
          a transmission engineering calculation, not an OSP/telecom calculation —
          your electrical colleagues handle that side.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — OPGW Identification Risk</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> OPGW is structurally engineered for transmission spans and
            is electrically live — it carries ground fault current and is bonded to the tower
            at every structure. It must be treated as an energized conductor for clearance and
            grounding purposes, following OSHA 1910.269 and NESC Section 43 rules for supply
            facilities.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> From the ground, OPGW looks nearly identical to
            a conventional steel overhead ground wire (OGW) or, depending on the stranding,
            can be mistaken for a messenger cable. Both run near the top of structures. An OSP
            crew approaching a transmission corridor to splice to a leased IRU segment can
            mistake the OPGW for a messenger and attempt to work it using comm-space procedures —
            a serious safety hazard.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The risk:</strong> Any unannounced contact with an energized OPGW by an
            OSP crew working in comm-space mode could result in electrocution. Before any work
            near a transmission structure, identify which cable is OPGW (typically top-mounted,
            labeled on the structure or in utility drawings), verify it is de-energized and
            grounded by the facility owner's qualified electrical crew, and do not touch it
            otherwise. When in doubt, treat every metallic cable at or above the supply space
            as energized until confirmed otherwise by the responsible utility.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>A Note on Hybrid Cables in OSP</h2>
        <p>
          Hybrid cables — combining fiber and copper in the same sheath — occasionally
          appear in OSP applications. Common examples:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Remote radio unit power + fiber:</strong> Some distributed antenna
            system (DAS) and small cell deployments route both power and fiber to a
            remote unit on a single cable to avoid running separate conduits.
          </li>
          <li>
            <strong>Legacy combined drop:</strong> Some older copper-pair-plus-fiber
            drops existed in early FttX deployments, though these are now rare.
          </li>
          <li>
            <strong>Rural electric cooperative combined service:</strong> A few co-ops
            have explored delivering both broadband (fiber) and low-voltage power
            monitoring (copper) on a single hybrid cable to reduce installation cost.
          </li>
        </ul>
        <p className="mt-3 text-sm text-slate-300/80">
          For mainstream OSP fiber distribution (FTTH, middle mile), hybrid cables are
          uncommon. The engineering complexity of combining metallic and fiber elements
          — and the need to ground the copper — usually makes a separate fiber build
          simpler and safer. When a hybrid cable is specified, the design must address
          both the fiber optical budget and the copper conductors' electrical parameters
          (current capacity, voltage drop, NEC compliance for the conductive elements).
          Treat any hybrid cable that carries voltage as a mixed-use design requiring
          both electrical and telecom engineering review.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T05.L11 Check — OPGW and Hybrid Cables"
        mode="multiple-choice"
        questions={[
          {
            id: 'T05-L11-Q1',
            type: 'mc',
            prompt:
              'OPGW is most commonly found on which type of structure?',
            choices: [
              '40-ft joint-use distribution poles in residential neighborhoods',
              '115-kV or higher transmission towers, running at the top above the phase conductors',
              'Underground conduit runs through congested urban areas',
              'Service drop poles at residential property boundaries',
            ],
            answerIndex: 1,
            explanation:
              'OPGW replaces the overhead ground wire at the very top of transmission towers — above all phase conductors. It is a transmission-structure product, not a distribution product. You would not see OPGW on a 40-ft joint-use distribution pole; you\'d see ADSS, lashed plant, or conventional coax there.',
          },
          {
            id: 'T05-L11-Q2',
            type: 'mc',
            prompt:
              'Why must OPGW\'s metallic outer strands be sized to handle ground fault current?',
            choices: [
              'To prevent aeolian vibration from damaging the fiber core',
              'To conduct the large transient current from a transmission fault without thermally damaging the inner fiber tube',
              'To provide the low electrical resistance needed for SCADA data communication',
              'To satisfy NESC Rule 250 ice loading requirements for heavy district installations',
            ],
            answerIndex: 1,
            explanation:
              'When a fault occurs on the transmission line, the ground fault current flows through the shield wire (OPGW) to the tower ground system. This can be thousands of amps for milliseconds. The metallic strands are sized to absorb the thermal energy of that fault pulse without the inner core temperature rising enough to damage the fiber. This is called the fault current rating of the OPGW.',
          },
          {
            id: 'T05-L11-Q3',
            type: 'mc',
            prompt:
              'Your company is leasing fiber strands inside an electric utility\'s OPGW for a 12-mile backbone segment. As the OSP designer, what is your primary responsibility for the OPGW portion of the design?',
            choices: [
              'Design the OPGW cable\'s fault current rating and metallic strand sizing',
              'Specify the OPGW hardware and grounding at each transmission tower',
              'Understand the fiber count, span loss, and handoff/splice locations; leave OPGW structural design to the electric utility',
              'Obtain a joint-use pole attachment agreement for each tower in the corridor',
            ],
            answerIndex: 2,
            explanation:
              'When leasing fiber in someone else\'s OPGW (an IRU arrangement), your job is the fiber network side: how many strands you have, what the optical loss budget is over the 12-mile segment, and where you\'ll splice or handoff to your distribution network. The OPGW structural design, fault current sizing, and grounding are the utility\'s responsibility. Attachment agreements for OPGW are handled at the utility-to-utility level, not the pole-attachment level.',
          },
          {
            id: 'T05-L11-Q4',
            type: 'mc',
            prompt:
              'Why is ADSS preferred over OPGW for joint-use distribution pole attachments?',
            choices: [
              'ADSS has higher fiber count capacity than OPGW',
              'ADSS has no metallic elements, eliminating induced voltage hazards and grounding requirements in the communication space',
              'OPGW is prohibited by NESC Rule 235 from being installed below the neutral conductor',
              'ADSS is less expensive per foot than OPGW in all applications',
            ],
            answerIndex: 1,
            explanation:
              'ADSS is "all dielectric" — no metal. On a joint-use distribution pole, this means the fiber attachment doesn\'t require grounding hardware, doesn\'t pick up induced voltages from adjacent phase conductors, and can be safely worked on by comm-space crews. OPGW requires grounding at every structure and carries fault current — it belongs at the top of transmission structures, not in the comm space below a distribution neutral.',
          },
        ]}
      />

    </LessonLayout>
  );
}
