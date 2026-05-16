// Net-new — T19.L01
// T19.L01 — CO / Hut / Headend — What the Building Is
// Foundation lesson: building types, floor plan anatomy, where OSP plant terminates

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import { Flashcard } from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T19.L01',
  course_id: 'T19',
  title: 'CO / Hut / Headend — What the Building Is',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01', 'T05.L01', 'T06.L01', 'T18.L01'],
  vocabulary_introduced: [
    'CO',
    'hut',
    'headend',
    'MDF',
    'IDF',
    'equipment room',
    'main entrance facility',
    'OSP termination point',
  ],
  key_terms: [
    {
      term: 'CO',
      definition: 'Central Office — a telephone company facility where outside plant cables terminate on inside-plant equipment. A full CO may serve tens of thousands of subscribers, contains battery plant, large HVAC, and multiple equipment bays. In modern FTTH deployments, "CO" is used loosely to mean any facility housing the OLT or CMTS where feeder cables converge.',
    },
    {
      term: 'hut',
      definition: 'A small, prefabricated shelter — often 10×12 ft to 16×24 ft — used as a remote headend for a localized FTTH or cable TV service area. The hut contains an OLT shelf, a battery plant, HVAC, and the OSP fiber entry point. Common on RUS-program rural builds where a central CO is too far away. Sometimes called a "remote node hut," "OLT hut," or "node building."',
    },
    {
      term: 'headend',
      definition: 'The facility where content originates and distribution equipment lives in a cable TV or hybrid fiber-coax (HFC) network. In modern usage, "headend" is often applied broadly to any building where an ISP\'s active transport equipment (OLTs, CMTS, routers) is housed and where OSP fiber terminates. The term comes from cable TV — the headend was literally the "head" (source) of the cable distribution system.',
    },
    {
      term: 'MDF',
      definition: 'Main Distribution Frame — the primary cross-connect point in a CO or headend where outside plant cables terminate and are connected (via patch cords or jumper wires) to inside-plant equipment. In a fiber network, the MDF is typically an Optical Distribution Frame (ODF) — a rack or frame holding fusion-splice trays and connector panels. All OSP feeder fibers land at the MDF first.',
    },
    {
      term: 'IDF',
      definition: 'Intermediate Distribution Frame — a secondary cross-connect point within a building, serving a floor or a wing. The IDF is connected back to the MDF via backbone cabling. In small huts and headends, there is no IDF — the MDF is the only frame. IDFs appear in larger CO buildings with multiple equipment rooms.',
    },
    {
      term: 'equipment room',
      definition: 'A dedicated room within a CO or headend that houses active network equipment — OLT shelves, CMTS chassis, routers, battery plant, HVAC equipment. Equipment rooms are distinct from the entrance facility (where OSP cables enter) and from administrative areas. Access is restricted to authorized personnel.',
    },
    {
      term: 'main entrance facility',
      definition: 'The physical location — typically a room, closet, or designated wall space — where OSP cables enter a building, transition from outside-plant to inside-plant protection, and connect to the building\'s grounding system. Sometimes abbreviated MEF or MPOE (Minimum Point of Entry). The main entrance facility is where primary protectors, bonding hardware, and the cable-to-conduit transition are located.',
    },
    {
      term: 'OSP termination point',
      definition: 'The physical location inside a CO, hut, or headend where an outside plant cable ends its run and hands off to the inside-plant cabling and equipment. For fiber, this is the ODF or splice organizer in the MDF bay. The OSP engineer\'s responsibility ends at this point — everything from the OSP termination point inward is the ISP/inside-plant engineer\'s domain.',
    },
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'ISP', source_lesson_id: 'T01.L01' },
    { term: 'OLT', source_lesson_id: 'T01.L08' },
    { term: 'FDH', source_lesson_id: 'T01.L08' },
    { term: 'feeder', source_lesson_id: 'T01.L08' },
    { term: 'ONT', source_lesson_id: 'T01.L08' },
    { term: 'conduit', source_lesson_id: 'T06.L01' },
    { term: 'aerial cable', source_lesson_id: 'T05.L01' },
  ],
  estimated_minutes: 20,
};

export default function T19L01_CoHutHeadendLayout() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Every fiber you pull, every conduit you bore, every aerial strand you hang —
          it all goes somewhere. That somewhere is a building: a CO, a hut, or a headend.
          Understanding what's inside that building, and where your cable terminates inside
          it, is the difference between an OSP design that hands off cleanly and one that
          leaves the ISP team confused about what they're connecting to. This lesson maps
          the building layout and establishes the boundary between your work and theirs.
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
              <td className="px-3 py-2 font-mono">CO</td>
              <td className="px-3 py-2">Central Office</td>
              <td className="px-3 py-2">The main ISP building where feeder cables terminate on active equipment</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MDF</td>
              <td className="px-3 py-2">Main Distribution Frame</td>
              <td className="px-3 py-2">The first cross-connect point inside — where your OSP fibers land</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IDF</td>
              <td className="px-3 py-2">Intermediate Distribution Frame</td>
              <td className="px-3 py-2">A secondary frame in larger buildings; rarely exists in rural huts</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MEF / MPOE</td>
              <td className="px-3 py-2">Main Entrance Facility / Minimum Point of Entry</td>
              <td className="px-3 py-2">The wall or room where OSP cable physically enters the building</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ODF</td>
              <td className="px-3 py-2">Optical Distribution Frame</td>
              <td className="px-3 py-2">The fiber-specific version of an MDF — a rack holding splice trays and patch panels</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Three buildings, one concept</h3>
        <p className="mt-2">
          OSP engineers encounter three building types as their downstream terminus:
        </p>

        <div className="mt-3 space-y-3">
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-blue-300">CO — Central Office</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              The full-sized carrier facility. Think of a phone company building: brick exterior,
              reinforced walls, 2,000+ sq ft of equipment space, multiple power feeds, a large
              battery plant that could power the building for 8 hours. Multiple feeder cables
              arrive through conduit banks below grade. The MDF (in fiber deployments, typically
              an ODF) spans an entire wall or row of racks. This is the hub of the network.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-green-300">Hut — Remote Node Building</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              A prefab shelter, typically 10×12 ft to 16×24 ft, placed at a strategic location
              to serve a cluster of subscribers. Common in rural FTTH builds on RUS-program
              contracts. The hut has one or two OLT shelves, a small battery plant, one HVAC
              unit, and a single conduit entry from the OSP side. The MDF may be just a 1U
              patch panel in an equipment rack. The OSP designer often specifies the hut
              building itself — it's part of the engineering package.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-purple-300">Headend — Origination and Distribution Facility</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              In cable TV and HFC (Hybrid Fiber-Coax) networks, the headend is the facility
              where video content is received, processed, and sent out to distribution nodes
              over fiber. Modern headends also house CMTS (cable modem termination systems)
              for broadband. In FTTH contexts, "headend" is often used interchangeably with
              "CO" or "hub" — it means the building with the active core equipment where
              OSP feeder fiber terminates.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">The OSP boundary — where your job ends</h3>
        <p className="mt-2">
          Regardless of which building type, the OSP engineer's responsibility ends at the
          <strong> OSP termination point</strong> — the ODF or splice tray inside the MDF
          bay where the OSP cable is broken out and connected to inside-plant pigtails or
          patch cords. Everything from the conduit entry through the building wall to the
          OSP termination point is <em>your territory</em>. Everything from the OSP
          termination point inward — the patch cords, the OLT, the router — is the
          inside-plant team's.
        </p>
        <p className="mt-2 text-sm text-amber-300/80">
          Key design implication: If you don't specify the conduit-entry bonding hardware,
          the primary protector, and the service loop inside the building, nobody will.
          The ISP team commissions the active equipment. The civil crew builds the conduit.
          There is no default owner for the building-entry details — that's OSP work.
        </p>

        {/* ── FLASHCARDS ───────────────────────────────────────────────── */}
        <Flashcard
          deckId="T19-L01"
          cards={[
            {
              id: 'T19-L01-fc-co',
              front: 'What is a CO in OSP context?',
              back: 'Central Office — a telephone company or ISP facility where outside plant cables terminate on inside-plant equipment. A full CO serves tens of thousands of subscribers, contains battery plant, large HVAC, and multiple equipment bays.',
            },
            {
              id: 'T19-L01-fc-hut',
              front: 'What is a "hut" in a rural FTTH network?',
              back: 'A small prefabricated shelter (10×12 ft to 16×24 ft) used as a remote headend. Contains an OLT shelf, battery plant, HVAC, and OSP fiber entry. Common on RUS-program rural builds. The OSP designer typically specifies the hut building itself.',
            },
            {
              id: 'T19-L01-fc-headend',
              front: 'What is a headend?',
              back: 'The facility where content originates and distribution equipment lives (cable TV/HFC) or, more broadly, any building where an ISP\'s active transport equipment is housed and OSP fiber terminates. The term comes from cable TV — the "head" (source) of the distribution system.',
            },
            {
              id: 'T19-L01-fc-mdf',
              front: 'What is an MDF?',
              back: 'Main Distribution Frame — the primary cross-connect point in a CO or headend where OSP cables terminate and connect to inside-plant equipment. In a fiber network, the MDF is typically an ODF (Optical Distribution Frame) with splice trays and connector panels. All OSP feeder fibers land at the MDF first.',
            },
            {
              id: 'T19-L01-fc-idf',
              front: 'What is an IDF and when does it appear?',
              back: 'Intermediate Distribution Frame — a secondary cross-connect point within a building, serving a floor or wing. Connected back to the MDF via backbone cabling. IDFs appear in larger CO buildings. Small huts and headends typically have no IDF — the MDF is the only frame.',
            },
            {
              id: 'T19-L01-fc-mef',
              front: 'What is the Main Entrance Facility (MEF/MPOE)?',
              back: 'The physical location — room, closet, or designated wall space — where OSP cables enter a building, transition from outside-plant to inside-plant protection, and connect to the building\'s grounding system. Where primary protectors, bonding hardware, and cable-to-conduit transitions are located.',
            },
            {
              id: 'T19-L01-fc-osp-termination',
              front: 'What is the OSP termination point?',
              back: 'The physical location inside a CO, hut, or headend where an OSP cable ends its run and hands off to inside-plant cabling and equipment. For fiber, this is the ODF or splice organizer in the MDF bay. The OSP engineer\'s responsibility ends here.',
            },
            {
              id: 'T19-L01-fc-equipment-room',
              front: 'What is an equipment room in a CO or headend?',
              back: 'A dedicated room within a CO or headend that houses active network equipment — OLT shelves, CMTS chassis, routers, battery plant, HVAC equipment. Distinct from the entrance facility (where OSP cables enter) and administrative areas. Access is restricted to authorized personnel.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Floor Plan Anatomy — Room by Room</h2>

        <p>
          A CO or headend isn't just one open room of equipment. It's organized into
          functional zones. Understanding these zones helps the OSP engineer specify
          where the conduit should terminate, where the primary protector goes, and
          how to label the cable for the ISP team.
        </p>

        <h3 className="mt-4 font-semibold">Standard zones in a full CO</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Zone</th>
                <th className="px-3 py-2 text-left">What's here</th>
                <th className="px-3 py-2 text-left">OSP interface?</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">MEF / MPOE</td>
                <td className="px-3 py-2">Cable entry sleeves, duct seal, primary protectors, bonding hardware, initial service loops</td>
                <td className="px-3 py-2 text-green-400">YES — OSP deliverable</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">MDF / ODF Room</td>
                <td className="px-3 py-2">Splice trays, patch panels, feeder-to-pigtail splices, distribution frames</td>
                <td className="px-3 py-2 text-yellow-400">SHARED — OSP terminates here, ISP patches out</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Equipment Room (MER)</td>
                <td className="px-3 py-2">OLT shelves, CMTS, routers, switches, servers</td>
                <td className="px-3 py-2 text-slate-400">ISP only</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Battery Room / Power Plant</td>
                <td className="px-3 py-2">VRLA battery strings, rectifiers, power distribution unit (PDU), DC distribution panel</td>
                <td className="px-3 py-2 text-slate-400">ISP only</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">HVAC Equipment Area</td>
                <td className="px-3 py-2">CRAC units, precision air handlers, supplemental cooling</td>
                <td className="px-3 py-2 text-slate-400">ISP/facilities</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Generator Room / Pad</td>
                <td className="px-3 py-2">Emergency generator, ATS (automatic transfer switch), fuel tank</td>
                <td className="px-3 py-2 text-slate-400">ISP/facilities</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-5 font-semibold">Where the conduit lands</h3>
        <p className="mt-2">
          The OSP conduit bank enters the building below grade (or through a wall sleeve
          for above-grade entry). It terminates in the MEF. The cable is then routed
          inside the building — typically on cable tray or J-hooks — from the MEF to
          the MDF. This inside-building run is usually 5–50 feet; it's interior to the
          building, so it uses plenum-rated or riser-rated cable jacket, NOT OSP gel-filled
          loose-tube. The OSP cable end is pulled through; excess is coiled as a service loop.
        </p>
        <p className="mt-2 text-sm text-blue-300/90">
          <strong>NEC §770.26 — The 50-Foot Transition Rule (forward reference to T19.L08):</strong>{' '}
          NEC NFPA 70-2023 Art. 770.26 requires that optical fiber cables with non-conductive
          (dielectric) construction that enter a building and run more than 50 feet inside the
          building must use listed indoor (plenum or riser) cable. An OSP gel-filled loose-tube
          cable must transition to inside-plant cable within 50 feet of the building entry point.
          This is the code basis for the MEF-to-MDF cable transition the OSP engineer must specify
          on every building-entry drawing. Full treatment of NEC §770.26 placement, enforcement, and
          exceptions is in T19.L08.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (TIA-569-E [confirm edition]):</strong> Pathways and spaces standard
            defines the MEF, MER, TR, and EDA zones with minimum size requirements and routing
            rules. All conduit entries should be in the MEF with sleeves and duct seal.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> On rural hut builds, there is no MEF and MER as distinct
            rooms — it's all one 12×20 ft building. The conduit enters through a floor sleeve,
            the cable runs 3 feet to a wall-mounted ODF, and the OLT shelf is right next to
            it. The "zones" are the same physical space. The OSP engineer still needs to seal
            the sleeve, bond the armor, and leave a service loop — the physical steps don't
            change just because the building is small.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Small hut vs. full CO — spec differences</h3>
        <p className="mt-2">
          When an OSP engineer on a RUS-program build specifies a remote hut, the building
          spec is part of the engineering package. Key elements the OSP engineer controls:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Building footprint and structure:</strong> prefab, poured concrete, or
            block. NFPA 110 [confirm edition — applicable to standby power in the building]
            and local building code apply.
          </li>
          <li>
            <strong>Conduit entry sleeves:</strong> size, quantity, and location. Oversized
            for future cables. Sealed with duct mastic or expandable foam after installation.
          </li>
          <li>
            <strong>Service loop space:</strong> cable tray or J-hooks from the entry sleeve
            to the ODF, with a designated coil point. Minimum 15 ft of service loop on each
            OSP cable entering the building — enough for future re-terminations.
          </li>
          <li>
            <strong>Grounding electrode:</strong> building ground rod(s) and conductor sizing.
            This feeds the bonding point where OSP armor and messenger bond in. (Covered
            in depth in T19.L06 — we'll connect those dots there.)
          </li>
          <li>
            <strong>HVAC and generator:</strong> equipment specs and redundancy level. The
            OSP designer who omits these is setting the ISP team up for a hot-standby failure.
            (Covered in T19.L04 and T19.L05.)
          </li>
        </ul>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — TIA-942 Space Taxonomy for Larger Facilities</h2>
        <p>
          TIA-942-C [confirm edition] defines four telecom spaces that OSP engineers
          will encounter at larger CO and headend facilities:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>MEET (Main Equipment Entry for Telecommunications):</strong> The first
            point inside the building where service providers' cables converge — equivalent
            to the MEF in smaller facilities but potentially a dedicated room with conduit
            stub-ups from multiple carriers.
          </li>
          <li>
            <strong>MER (Main Equipment Room):</strong> Primary equipment room — equivalent
            to what a traditional CO calls the "main floor." OLT, router, and core switching
            equipment live here. This is where the ODF most commonly sits.
          </li>
          <li>
            <strong>TR (Telecommunications Room):</strong> Secondary equipment room on a
            different floor or wing. Connected to MER via backbone cabling. OSP cables
            rarely terminate directly in a TR.
          </li>
          <li>
            <strong>EDA (Equipment Distribution Area):</strong> The zone at the edge of a
            TR serving individual equipment racks. This is entirely inside-plant scope.
          </li>
        </ul>
        <p className="mt-3 text-sm text-slate-300/70">
          Source: TIA-942-C [confirm edition — awareness level]. OSP engineers need to know
          these space names to read a CO floor plan handed to them by the ISP team. You don't
          need to design to TIA-942 rated requirements — that is ISP/RCDD scope.
        </p>
      </section>

      {/* ── ANNOTATED DIAGRAM ────────────────────────────────────────────── */}
      <AnnotatedDiagram
        title="Headend / CO Building Layout — Floor Plan"
        description="Click any labeled zone to see what's in it and whether it's OSP or ISP territory."
        src="/training/diagrams/headend-floor-plan.svg"
        alt="Floor plan diagram of a CO/headend showing MEF, MDF/ODF room, equipment room, battery room, HVAC area, and generator pad"
        aspectRatio={1.8}
        hotPoints={[
          {
            id: 'mef',
            x: 8,
            y: 50,
            label: 'MEF',
            type: 'click',
            explanation:
              'Main Entrance Facility — where OSP conduit enters the building. OSP engineer specifies the conduit sleeves, duct seal, service loops, and bonding hardware here. Primary protectors mount here or immediately adjacent.',
          },
          {
            id: 'mdf',
            x: 25,
            y: 50,
            label: 'MDF / ODF',
            type: 'click',
            explanation:
              'Main Distribution Frame (fiber version: ODF). OSP feeder cables are routed from the MEF to here, broken out into individual fibers, and fusion-spliced to factory-terminated pigtails. The OSP termination point is at the ODF splice organizer. Everything right of this point is ISP territory.',
          },
          {
            id: 'mer',
            x: 50,
            y: 35,
            label: 'Equipment Room',
            type: 'click',
            explanation:
              'The MER (Main Equipment Room) — where OLT shelves, CMTS, routers, and switches live. ISP territory. OSP engineers typically access this area only to trace a cable from the ODF to the OLT, or to hand off as-built documentation.',
          },
          {
            id: 'battery',
            x: 75,
            y: 35,
            label: 'Battery Plant',
            type: 'click',
            explanation:
              'The DC power plant — battery strings, rectifiers, and distribution bus. Typically –48 VDC system (covered in T19.L03). ISP territory, but the OSP engineer needs to know it exists, what it powers, and that it is the reason the CO stays alive during a power outage.',
          },
          {
            id: 'hvac',
            x: 75,
            y: 70,
            label: 'HVAC',
            type: 'click',
            explanation:
              'Precision cooling equipment (CRAC units or split systems). ISP/facilities territory. On rural hut builds, the OSP engineer specifies HVAC as part of the headend building spec. (Covered in T19.L05.)',
          },
          {
            id: 'generator',
            x: 92,
            y: 50,
            label: 'Generator',
            type: 'click',
            explanation:
              'Emergency generator and ATS (automatic transfer switch). Outdoor pad or adjacent room. ISP/facilities territory, but the OSP engineer specifies generator size and ATS type on RUS-program hut builds. (Covered in T19.L04.)',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T19.L01 Check — CO / Hut / Headend Layout"
        mode="multiple-choice"
        questions={[
          {
            id: 'T19-L01-Q1',
            type: 'mc',
            prompt:
              'An OSP crew pulls a 96-fiber OS2 feeder cable through a conduit into a rural FTTH hut. Where does the OSP engineer\'s responsibility end inside the building?',
            choices: [
              'At the OLT shelf, when the fiber is plugged into the OLT port',
              'At the ODF (Optical Distribution Frame) splice organizer in the MDF bay, where OSP fibers are broken out and spliced to inside-plant pigtails',
              'At the building wall, where the conduit enters',
              'At the MEF primary protector — anything past the protector is ISP work',
            ],
            answerIndex: 1,
            explanation:
              'The OSP termination point is the ODF splice organizer — where the OSP feeder cable\'s individual fibers are broken out and connected (by fusion splice) to inside-plant pigtails. The conduit entry through the wall (MEF) is also OSP work, but the final handoff point is the ODF. The patch cord from the ODF to the OLT is inside-plant work.',
            citation: 'TIA-569-E [confirm edition] — pathways and spaces.',
            fieldNote:
              'In practice, OSP engineers often assist the ISP team with the ODF-to-OLT patch cords during commissioning — but it\'s not their deliverable. On RUS-funded builds, the as-built drawing must show every fiber labeled at the ODF, or the final inspection can fail.',
          },
          {
            id: 'T19-L01-Q2',
            type: 'mc',
            prompt:
              'A rural ISP is building a FTTH network to serve 600 subscribers spread across a 15-mile radius from a small town. The nearest carrier CO is 35 miles away. What building type is most appropriate for the OSP headend termination point?',
            choices: [
              'A full telephone company CO with 10,000 sq ft of equipment space',
              'A prefab hut (12×20 ft or similar) placed centrally in the service area, containing an OLT shelf, small battery plant, and HVAC',
              'A standard office building with the OLT in a server closet',
              'No building — the OLT should be mounted on a pole in a weatherproof enclosure',
            ],
            answerIndex: 1,
            explanation:
              'For 600 subscribers in a rural FTTH deployment, a prefab hut is the standard solution. It provides the controlled environment (temperature, security, power) needed for OLT equipment without the cost of a full CO building. Pole-mounted OLTs exist for very small deployments but are not standard for 600-subscriber service areas. RUS-program engineering packages routinely include prefab hut specifications.',
            citation: 'RUS Bulletin 1751F-810 §3 [RUS program practice]; industry standard FTTH hut design.',
          },
          {
            id: 'T19-L01-Q3',
            type: 'mc',
            prompt:
              'The MEF (Main Entrance Facility) at a CO is most accurately described as:',
            choices: [
              'The room where the OLT equipment is installed',
              'The location where OSP cables enter the building, primary protectors are mounted, bonding hardware is installed, and service loops are coiled',
              'The outdoor pad where the generator and ATS are located',
              'The battery room containing rectifiers and DC distribution panels',
            ],
            answerIndex: 1,
            explanation:
              'The MEF (also called MPOE — Minimum Point of Entry) is the physical location where OSP cables transition from the outside plant into the building. Primary protectors mount here (or immediately adjacent), bonding hardware connects OSP armor to the building grounding system, and service loops are coiled to allow future re-terminations. The OSP engineer owns this zone.',
            citation: 'TIA-569-E [confirm edition]; NEC NFPA 70-2023 Art. 770.',
          },
          {
            id: 'T19-L01-Q4',
            type: 'fill-in-blank',
            prompt:
              'In a fiber network, the MDF (Main Distribution Frame) is often called an ____ (Optical Distribution Frame) because it holds fiber splice trays and connector panels rather than copper termination blocks.',
            answer: 'ODF',
            answerDisplay: 'ODF',
            explanation:
              'An ODF (Optical Distribution Frame) is the fiber-specific equivalent of the traditional MDF. Where a copper MDF held 66-blocks and 110-blocks, an ODF holds splice organizers with fusion-splice trays and connector panels (LC, SC, MPO) on the front face. All OSP feeder fibers land at the ODF first.',
          },
          {
            id: 'T19-L01-Q5',
            type: 'mc',
            prompt:
              'An OSP project manager reviews a hut building specification for a RUS-funded FTTH build. The spec includes the OLT shelf, battery plant, and HVAC — but says nothing about conduit entry sleeves, duct seal, or service loops. What is the most likely consequence?',
            choices: [
              'No consequence — the ISP team will handle conduit entry details during commissioning',
              'The building will be installed without sealed conduit entries and without service loops. When the cable arrives, there may be no clear path to route it, moisture can migrate through unsealed conduit into the building, and the OSP crew may have to cut through finished wall to route service loops',
              'The RUS inspector will catch the omission during the design review and automatically add the missing spec',
              'The general contractor will default to code-minimum conduit sealing, which is sufficient for a hut',
            ],
            answerIndex: 1,
            explanation:
              'Conduit entry sealing, duct seal, and service loop routing are OSP deliverables that must be specified at design time. Nobody else defaults to specifying them. Unsealed conduit entries are a known moisture-ingress and rodent-intrusion path in rural huts. Missing service loops mean the first cable re-termination requires pulling new cable. These omissions are a common failure mode on rural FTTH builds when the OSP engineer treats the building spec as ISP work.',
          },
        ]}
      />

    </LessonLayout>
  );
}
