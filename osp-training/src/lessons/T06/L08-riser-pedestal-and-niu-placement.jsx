// Net-new — T06.L08 Riser, Pedestal, and NIU Placement
// Working lesson: riser (pedestal mast), terminal pedestal, NIU placement,
// vaulted NIU, pedestal spacing, slack-loop storage.
// Sources: RUS 1751F-635 §7; net-new hardware details

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T06.L08',
  course_id: 'T06',
  title: 'Riser, Pedestal, and NIU Placement',
  order: 8,
  lesson_type: 'working',
  prerequisites: ['T06.L01', 'T06.L02', 'T06.L03', 'T06.L04', 'T06.L05', 'T06.L06', 'T06.L07'],
  learning_objectives: [
    'Explain the difference between a riser, a terminal pedestal, and a vault NIU',
    'Apply RUS spacing rules for pedestal placement on an underground route',
    'Describe how slack-loop storage works inside a pedestal and why it matters for future splicing',
    'Choose between a standard pedestal and a vaulted NIU for flooding-zone applications',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'riser',
    'terminal pedestal',
    'NIU',
    'vaulted NIU',
    'pedestal spacing',
    'slack-loop storage',
  ],
};

export const vocabulary_introduced = {
  'riser': 'A vertical conduit assembly that transitions the underground conduit route from below grade up to a surface-mounted pedestal or above-grade terminal. The riser protects the cable where it exits the ground and passes through the pedestal base. Risers are typically Schedule 80 PVC or HDPE to withstand the mechanical stress of the grade transition. A damaged or missing riser leaves the cable exposed to lawn equipment, water intrusion, and physical damage at the ground entry point.',
  'terminal pedestal': 'A surface-mounted enclosure that provides a splice point, slack-loop storage, and splitter/terminal mounting for fiber distribution along an underground route. Terminal pedestals are used at service branch points, splice locations, and route midpoints where technicians need access to the cable plant. In RUS-funded systems, terminal pedestals are typically placed every 250–330 feet along the route and at every branch to a service address. Contrast with a pass-through (no splice) vs. terminal (has splice access).',
  'NIU': 'Network Interface Unit — the demarcation device installed at the customer\'s premises where the provider\'s network meets the customer\'s equipment. In fiber-to-the-home designs, the NIU is typically a weatherproof outdoor unit mounted on the side of the building or on a pedestal near the property line. The NIU holds the fiber termination (SC/APC connectors), an optical power test port, and sometimes the ONT (optical network terminal) if the provider includes it in the NIU enclosure.',
  'vaulted NIU': 'A below-grade NIU installation where the NIU enclosure is placed in a small underground vault or traffic-rated box instead of a surface-mounted pedestal. Vaulted NIUs are used where surface conditions make a pedestal impractical: high-traffic commercial areas, manicured landscapes where the property owner rejects visible pedestals, or flood-prone areas where a surface pedestal would be submerged regularly. The vault must be H-20 load-rated if it can be driven over.',
  'pedestal spacing': 'The maximum distance between successive terminal pedestals along an underground fiber route, measured along the cable route (not in a straight line). RUS 1751F-635 §7 specifies a maximum spacing of 330 feet (100 m) between terminal pedestals in residential underground plant. Spacing beyond 330 feet creates access problems: technicians cannot efficiently pull slack or locate a splice point by routing the route between accessible points that are too far apart.',
  'slack-loop storage': 'Extra cable length coiled and stored inside a pedestal or splice enclosure beyond what is needed for the active splices. Standard practice is to store at minimum 20–30 feet of slack on each cable end entering a pedestal. This slack serves two purposes: (1) allows a damaged splice to be re-made without having to pull a new cable, and (2) allows the pedestal to be relocated 15–20 feet if a service requirement or property issue demands it. Slack is coiled in a figure-8 pattern on the pedestal tray to prevent kinks.',
};

export const vocabulary_assumed = [
  { term: 'conduit', source_lesson_id: 'T06.L03' },
  { term: 'Schedule 80 PVC', source_lesson_id: 'T06.L03' },
  { term: 'HDPE', source_lesson_id: 'T06.L03' },
  { term: 'manhole', source_lesson_id: 'T06.L05' },
  { term: 'handhole', source_lesson_id: 'T06.L05' },
  { term: 'H-20 live loading', source_lesson_id: 'T06.L05' },
  { term: 'ONT', source_lesson_id: 'T01.L01' },
];

export const key_terms = Object.entries(vocabulary_introduced).map(([term, definition]) => ({
  term,
  definition,
}));

export default function T06L08_RiserPedestalAndNIUPlacement() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          At every point where your underground fiber network needs to be accessed —
          to make a splice, to branch off to a customer, or to hand off to the customer's
          equipment — you need an enclosure at or near the surface. For underground fiber
          networks, that enclosure is almost always a <strong>pedestal</strong>: a plastic
          or metal box that sits on the ground, anchored to the conduit riser coming up
          from below.
        </p>
        <p className="mt-2">
          Think of a pedestal like a junction box for underground cable. Inside is where
          technicians access the fiber, make splices, install splitters, store slack cable,
          and test the link. On the outside, the pedestal has a locking cover to keep out
          weather and unauthorized access.
        </p>
        <p className="mt-2">
          Where pedestals can't go — because the ground floods, or a property owner won't
          allow a surface box, or the area gets heavy vehicle traffic — you use a vault
          below grade instead. And at the customer's building, you mount a small NIU (network
          interface unit) on the wall or on a pedestal to mark where your network ends and
          the customer's equipment begins.
        </p>
        <p className="mt-2">
          This lesson covers how to place these access points correctly: how far apart,
          where to position them on the lot, how to store slack, and when to choose a
          vault instead of a pedestal.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means on the job</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NIU</td>
              <td className="px-3 py-2">Network Interface Unit</td>
              <td className="px-3 py-2">The box at the customer's premises where your network ends and theirs begins</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ONT</td>
              <td className="px-3 py-2">Optical Network Terminal</td>
              <td className="px-3 py-2">The modem-like device that converts fiber optic signal to Ethernet for the customer</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service</td>
              <td className="px-3 py-2">Federal program that funds rural broadband and sets design standards</td>
            </tr>
          </tbody>
        </table>

        {/* Key Terms Flashcards */}
        <Flashcard
          deckId="T06-L08"
          cards={[
            {
              id: 'T06-L08-fc-riser',
              front: 'What is a riser in underground fiber plant?',
              back: 'A vertical conduit assembly that transitions the underground conduit route from below grade up to a surface-mounted pedestal or above-grade terminal. The riser protects the cable where it exits the ground and passes through the pedestal base. Risers are typically Schedule 80 PVC or HDPE to withstand the mechanical stress of the grade transition. A damaged or missing riser leaves the cable exposed to lawn equipment, water intrusion, and physical damage at the ground entry point.',
            },
            {
              id: 'T06-L08-fc-terminal',
              front: 'What is a terminal pedestal?',
              back: 'A surface-mounted enclosure that provides a splice point, slack-loop storage, and splitter/terminal mounting for fiber distribution along an underground route. Terminal pedestals are used at service branch points, splice locations, and route midpoints where technicians need access to the cable plant. In RUS-funded systems, terminal pedestals are typically placed every 250–330 feet along the route and at every branch to a service address.',
            },
            {
              id: 'T06-L08-fc-niu',
              front: 'What is an NIU (Network Interface Unit)?',
              back: 'Network Interface Unit — the demarcation device installed at the customer\'s premises where the provider\'s network meets the customer\'s equipment. In fiber-to-the-home designs, the NIU is typically a weatherproof outdoor unit mounted on the side of the building or on a pedestal near the property line. The NIU holds the fiber termination (SC/APC connectors), an optical power test port, and sometimes the ONT if the provider includes it in the NIU enclosure.',
            },
            {
              id: 'T06-L08-fc-vault',
              front: 'What is a vaulted NIU and when is it used?',
              back: 'A below-grade NIU installation where the NIU enclosure is placed in a small underground vault or traffic-rated box instead of a surface-mounted pedestal. Vaulted NIUs are used where surface conditions make a pedestal impractical: high-traffic commercial areas, manicured landscapes where the property owner rejects visible pedestals, or flood-prone areas where a surface pedestal would be submerged regularly. The vault must be H-20 load-rated if it can be driven over.',
            },
            {
              id: 'T06-L08-fc-spacing',
              front: 'What is the RUS maximum pedestal spacing for residential underground plant?',
              back: 'Pedestal spacing is the maximum distance between successive terminal pedestals along an underground fiber route, measured along the cable route (not in a straight line). RUS 1751F-635 §7 specifies a maximum spacing of 330 feet (100 m) between terminal pedestals in residential underground plant. Spacing beyond 330 feet creates access problems: technicians cannot efficiently pull slack or locate a splice point by routing the route between accessible points that are too far apart.',
            },
            {
              id: 'T06-L08-fc-slack',
              front: 'What is slack-loop storage and why is it required?',
              back: 'Extra cable length coiled and stored inside a pedestal or splice enclosure beyond what is needed for the active splices. Standard practice is to store at minimum 20–30 feet of slack on each cable end entering a pedestal. This slack serves two purposes: (1) allows a damaged splice to be re-made without having to pull a new cable, and (2) allows the pedestal to be relocated 15–20 feet if a service requirement or property issue demands it. Slack is coiled in a figure-8 pattern on the pedestal tray to prevent kinks.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Pedestal and NIU Placement Rules</h2>

        <h3 className="mt-4 font-semibold">The riser: protecting the grade transition</h3>
        <p>
          Every pedestal sits at the top of a riser. The riser is the vertical conduit section
          that carries the cable from the burial depth (typically 18–36 inches underground,
          depending on cover requirements — see T06.L02) up through the pedestal base and
          into the pedestal housing.
        </p>
        <p className="mt-2">
          The riser must be the strongest conduit in your installation because it takes the
          most mechanical stress: the ground settling, lawn mowing equipment bumping the
          pedestal, freeze-thaw cycles pulling on the conduit entry, and the full weight of
          the pedestal itself bearing down on the grade transition. That's why risers are
          typically Schedule 80 PVC or HDPE rather than the Schedule 40 PVC you might use
          for the buried run.
        </p>
        <p className="mt-2">
          The conduit seal at the pedestal base must be watertight. Water that enters the
          conduit can wick along the cable for hundreds of feet, causing moisture damage at
          splice points far from the pedestal. Apply conduit sealant (mastic putty or
          heat-shrink end-seal) at every conduit entry into the pedestal base.
          (Source: RUS 1751F-635 §7; field practice.)
        </p>

        <h3 className="mt-5 font-semibold">Pedestal spacing: the 330-foot rule</h3>
        <p>
          RUS 1751F-635 §7 specifies that terminal pedestals in residential underground
          distribution plant shall be placed at a maximum spacing of <strong>330 feet
          (100 meters)</strong> measured along the cable route. This rule exists for
          a practical reason: when a technician needs to access the cable plant — to make
          a splice, add a service tap, or pull slack for a damaged section — they need
          to be able to reach a pedestal within a reasonable walking distance along the
          route.
        </p>
        <p className="mt-2">
          Pedestals are always placed at:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-300/90">
          <li>Every branch point (where the route splits to serve a sub-group of addresses)</li>
          <li>Every service drop location (the pedestal closest to a customer's property line)</li>
          <li>Every mid-route access point at or before the 330-foot maximum</li>
          <li>At the end of every dead-end leg (the furthest point of the route leg)</li>
        </ul>
        <p className="mt-2">
          When laying out pedestal placement on a design drawing, count along the cable
          route (following the actual conduit path, including bends and offsets), not in a
          straight-line distance between two points. A route that goes around a property
          corner has a longer actual cable path than its straight-line distance would suggest.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> RUS 1751F-635 §7 states 330-foot maximum spacing for terminal
            pedestals in residential underground plant.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Most experienced designers place pedestals at 250–280
            feet as a working rule, keeping the 330-foot maximum as a hard limit that is never
            exceeded. The reasoning: on a new subdivision, lot lines often don't line up
            exactly with the 330-foot rule, and placing a pedestal "at the lot line" rather
            than "exactly at 330 feet" makes future service drops cleaner. Saving 50–80 feet
            of spacing on every pedestal also gives you budget slack for an extra pedestal at
            a problem spot without exceeding the total pedestal count in your materials estimate.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Slack-loop storage inside the pedestal</h3>
        <p>
          Every cable end that enters a pedestal must have a slack loop stored inside the
          enclosure before the splice is made. Standard practice: store a minimum of
          <strong> 20–30 feet of slack</strong> on each cable end. The slack is coiled in a
          figure-8 pattern on the pedestal cable tray to prevent the coil from developing
          kinks (a circular coil under tension will kink at the top of the loop; figure-8
          coiling distributes the bend).
        </p>
        <p className="mt-2">
          The 20–30 foot minimum serves two functions:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2">
          <li>
            <strong>Re-splice margin.</strong> If a splice fails and must be re-made, each
            re-splice consumes 1–2 feet of fiber. With 20–30 feet of slack, a pedestal can
            be re-spliced 10–15 times before the cable is too short to reach the splice tray.
          </li>
          <li>
            <strong>Relocation margin.</strong> If the pedestal must be moved — property
            owner dispute, utility conflict, road widening — the slack allows the pedestal
            to be repositioned up to 15–20 feet without pulling a new cable.
          </li>
        </ol>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: RUS 1751F-635 §7; BICSI OSPDR (field chapter); field practice.
          [confirm current RUS 1751F-635 slack requirement in your project's standard.]
        </p>

        <h3 className="mt-5 font-semibold">NIU placement at the customer premises</h3>
        <p>
          The NIU (network interface unit) is the physical end of your network at the
          customer's property. Its placement determines how the drop cable runs from the
          distribution route to the building.
        </p>
        <p className="mt-2">
          Standard NIU placement rules:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong>Location:</strong> Exterior wall of the building, within 2 feet of where
            the cable enters the structure, or on a separate pedestal/post at the property line
            if the cable does not enter the building directly (example: when the ONT is on the
            building and the NIU is at the demarcation point near the meter).
          </li>
          <li>
            <strong>Height:</strong> Typically 4–6 feet above finished grade, accessible for
            a technician standing on the ground. High enough to avoid lawn equipment damage;
            low enough to work on without a ladder.
          </li>
          <li>
            <strong>Weatherproofing:</strong> All NIU enclosures rated NEMA 3R or better
            (weatherproof, rain-deflecting lid). In coastal or severe-weather zones, NEMA 4X
            (waterproof) is common.
          </li>
          <li>
            <strong>Optical test port:</strong> The NIU must have an accessible SC/APC (or
            equivalent) test port that allows a technician to test the incoming fiber signal
            without entering the customer's premises or disconnecting customer equipment.
            (Source: RUS 1751F-635 §7; field practice.)
          </li>
        </ul>

        <h3 className="mt-5 font-semibold">Vaulted NIU: when surface placement isn't possible</h3>
        <p>
          In commercial zones, high-end residential developments, or flood-prone areas,
          a surface-mounted NIU pedestal may be rejected by the property owner or impractical
          due to site conditions. In these cases, a vaulted NIU replaces the surface pedestal.
        </p>
        <p className="mt-2">
          A vaulted NIU uses a pre-cast concrete or polymer vault box buried flush with the
          grade (like a standard electric service handhole). Inside is the NIU enclosure,
          splice tray, and slack loops. The vault lid must be:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-300/90">
          <li>H-20 load-rated (rated for a 10-ton axle load) if installed in any area that can be driven over — driveways, parking lots, lawn areas reachable by service vehicles</li>
          <li>Labeled with a utility marker on the surface ("FIBER — CALL BEFORE DIG")</li>
          <li>Set at finished grade, not above grade (a proud lid is a trip hazard and will be hit by mowers)</li>
          <li>Accessible without equipment: a hand key or standard security bit opens it, not a backhoe</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: RUS 1751F-635 §7; NFPA 70 §830 (communications cable installation at buildings);
          field practice.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: Flood Zone Pedestal Design</h2>

        <h3 className="mt-4 font-semibold">Flood zone considerations</h3>
        <p>
          In areas with seasonal flooding (river floodplains, coastal lowlands, storm-surge
          zones), standard surface-mounted pedestals are routinely submerged. Two design
          strategies apply:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Flood-rated pedestals.</strong> Sealed-base pedestals with no conduit
            entry openings below the local base flood elevation (BFE). Cable enters from the
            top of the riser in a watertight conduit seal. The pedestal body is sealed against
            submersion to a specified depth (typically 3–6 feet) per NEMA rating. This approach
            keeps a surface-accessible pedestal while reducing water intrusion. (Field practice;
            RUS 1751F-635 §7.)
          </li>
          <li>
            <strong>Vaulted NIU with drain sump.</strong> Install a vault below grade with
            a drainage sump at the bottom. The vault is not waterproof — instead, water that
            enters drains through the sump. The NIU and equipment inside must be rated for
            temporary submersion (NEMA 6P or equivalent), and the splice enclosure must use
            gel-filled or heat-shrink closure to prevent wicking. The vault lid and locking
            hardware must not rust or corrode.
          </li>
        </ol>
        <p className="mt-2 text-sm text-slate-300/70">
          Design decision: if the site is in a FEMA Special Flood Hazard Area (SFHA / Zone AE
          or V), document your design choice and the BFE reference in the project's engineering
          package. If the customer later claims the pedestal was improperly sited, the documented
          flood zone assessment and design rationale protects the engineering firm.
          [confirm local floodplain ordinance with AHJ before finalizing design]
        </p>
      </section>

      {/* ── ANNOTATED DIAGRAM ────────────────────────────────────────────── */}
      <AnnotatedDiagram
        title="Inside a Terminal Pedestal — Fiber Underground Access Point"
        description="Click any labeled point to learn what that component does. This diagram shows the interior of a standard fiber terminal pedestal installed on a residential underground route."
        src="/training/diagrams/fiber-pedestal-interior.svg"
        alt="Cross-section diagram of a fiber terminal pedestal showing cable tray, splice enclosure, slack coil, riser, and cover latch"
        aspectRatio={1.4}
        hotPoints={[
          {
            id: 'cover',
            x: 50,
            y: 5,
            label: 'Locking cover',
            type: 'click',
            explanation:
              'The hinged or removable cover keeps weather and unauthorized access out of the pedestal. Most field-install pedestals use a standard security bit (not a padlock) so any technician with the right bit can access the terminal without carrying keys for every pedestal on the route.',
          },
          {
            id: 'splice',
            x: 50,
            y: 32,
            label: 'Splice enclosure / terminal tray',
            type: 'click',
            explanation:
              'The splice enclosure or terminal tray is where the fiber splices are made and the individual fiber strands are secured. Fibers are routed from the cable into the splice tray, spliced or terminated, and protected by foam or gel-filled trays. The splice enclosure re-entry seal must be watertight after every opening.',
          },
          {
            id: 'slack',
            x: 25,
            y: 55,
            label: 'Slack-loop coil (figure-8)',
            type: 'click',
            explanation:
              'At least 20–30 feet of slack is coiled in a figure-8 pattern on each cable end before it enters the splice enclosure. Figure-8 coiling prevents the cable from kinking at the top of the coil — circular coiling under tension will kink eventually. The slack provides margin for re-splicing (10–15 future repairs) and for relocating the pedestal up to 15–20 feet.',
          },
          {
            id: 'riser',
            x: 50,
            y: 85,
            label: 'Conduit riser with seal',
            type: 'click',
            explanation:
              'The riser is the vertical conduit section that brings the cable up from burial depth to the pedestal interior. At the pedestal base, a mastic or heat-shrink conduit seal prevents water from wicking up the conduit and into the pedestal interior. The riser should be Schedule 80 PVC or HDPE to withstand mechanical stress at the grade transition.',
          },
          {
            id: 'base',
            x: 75,
            y: 92,
            label: 'Pedestal base / anchor',
            type: 'click',
            explanation:
              'The pedestal base anchors the enclosure to the ground and connects to the riser conduit. Most residential pedestals use a screw-in anchor that drives into the soil around the conduit; some utility-grade pedestals use a concrete pad for permanence. The base must be level so the pedestal stands plumb — a leaning pedestal puts lateral stress on the riser conduit.',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T06.L08 Check — Riser, Pedestal, and NIU Placement"
        mode="multiple-choice"
        questions={[
          {
            id: 'T06-L08-Q1',
            type: 'mc',
            prompt: 'What is the maximum pedestal spacing specified by RUS 1751F-635 §7 for residential underground plant?',
            choices: [
              '500 feet (150 m)',
              '250 feet (76 m)',
              '330 feet (100 m)',
              '400 feet (122 m)',
            ],
            answerIndex: 2,
            explanation: 'RUS 1751F-635 §7 specifies a maximum spacing of 330 feet (100 m) between terminal pedestals in residential underground distribution plant. Most experienced designers use 250–280 feet as a working rule, keeping 330 feet as the hard maximum. Spacing is measured along the cable route, not in a straight line. (Source: RUS 1751F-635 §7.)',
          },
          {
            id: 'T06-L08-Q2',
            type: 'mc',
            prompt: 'Slack loops inside a pedestal are coiled in a figure-8 pattern rather than a circular coil because:',
            choices: [
              'Figure-8 coiling fits more cable in the same pedestal interior space',
              'Circular coiling under tension will eventually kink at the top of the loop; figure-8 distributes the bend and prevents kinking',
              'Figure-8 coiling is required by NEC Article 830 for all fiber pedestal installations',
              'Circular coiling is only permitted in manholes, not pedestals',
            ],
            answerIndex: 1,
            explanation: 'A circular coil stores tension as a loop — the cable at the top of the loop is under constant lateral force trying to straighten it, which eventually causes a kink at that point. A figure-8 coil alternates the direction of each loop, distributing tension evenly around the coil and preventing the kink-at-the-top failure mode. (Source: RUS 1751F-635 §7; field practice.)',
          },
          {
            id: 'T06-L08-Q3',
            type: 'mc',
            prompt: 'A vaulted NIU is installed flush with the finished grade in a commercial parking lot. What load rating must the vault lid have?',
            choices: [
              'H-10 (5-ton axle load)',
              'H-20 (10-ton axle load)',
              'NEMA 3R (weather-resistant)',
              'No load rating required since it is in a parking lot, not on a road',
            ],
            answerIndex: 1,
            explanation: 'Any vault installed where it can be driven over — driveways, parking lots, or any lawn area reachable by service vehicles — must have an H-20 load-rated lid (rated for a 10-ton axle load, the standard for commercial vehicle design loading). A non-rated lid in a parking lot will fail under a delivery truck, creating a safety hazard and damaging the equipment inside. (Source: RUS 1751F-635 §7; NFPA 70 §830.)',
          },
          {
            id: 'T06-L08-Q4',
            type: 'mc',
            prompt: 'The minimum slack stored on each cable end in a terminal pedestal is:',
            choices: [
              '5–10 feet',
              '10–15 feet',
              '20–30 feet',
              '50 feet',
            ],
            answerIndex: 2,
            explanation: 'Standard practice per RUS 1751F-635 §7 is a minimum of 20–30 feet of slack stored in a figure-8 coil on each cable end before splicing. This provides margin for 10–15 future re-splices (each consuming 1–2 feet) and for relocating the pedestal up to 15–20 feet without pulling new cable. (Source: RUS 1751F-635 §7; BICSI OSPDR; field practice.)',
          },
          {
            id: 'T06-L08-Q5',
            type: 'mc',
            prompt: 'Why must all conduit entries into a pedestal base be sealed with mastic putty or heat-shrink conduit seal?',
            choices: [
              'To prevent cable theft through the conduit opening',
              'Water that enters the conduit at the pedestal base can wick along the cable for hundreds of feet and cause moisture damage at distant splice points',
              'To prevent gas build-up inside the pedestal from underground methane sources',
              'Because RUS requires sealed pedestals for all conduit diameters larger than 2 inches',
            ],
            answerIndex: 1,
            explanation: 'Water enters a conduit at low points — including the pedestal base where the riser transitions from below grade. Once inside the conduit, water wicks along the fiber cable\'s interstitial spaces (between the buffer tubes and the sheath) for hundreds of feet. When it reaches a splice point, the moisture degrades the splice closure\'s gel and eventually causes fiber damage. A watertight conduit seal at the pedestal base stops the entry path. (Source: RUS 1751F-635 §7; field practice.)',
          },
        ]}
      />

    </LessonLayout>
  );
}
