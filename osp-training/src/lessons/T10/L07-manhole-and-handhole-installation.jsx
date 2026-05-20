// T10.L07 — Manhole and Handhole Installation
// Working lesson: structure types, H-20/H-25 loading, spacing intervals, cast-in-place vs. pre-cast
// Source: M09 §9.5 + OFS IP-079 + FOA OSP Civil Works Guide + AASHTO H-20/H-25

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T10.L07',
  course_id: 'T10',
  title: 'Manhole and Handhole Installation',
  order: 7,
  lesson_type: 'working',
  prerequisites: ['T10.L03', 'T10.L04', 'T06.L05', 'T18.L03'],
  learning_objectives: [
    'Distinguish a handhole, a manhole, and a vault by size, access type, and typical use case',
    'State the 500–1,000 ft planning interval for handholes and explain why the as-built location often differs',
    'Apply H-20 and H-25 traffic loading ratings to structure selection',
    'Compare cast-in-place versus pre-cast handholes and identify the trade-offs',
    'Describe the vault sizing checklist: bend radius of largest cable, splice-tray count, lid removal clearance, traffic rating',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'cast-in-place',
    'pre-cast',
    'frame-and-cover',
    'traffic loading',
  ],
  key_terms: [
    {
      term: 'cast-in-place',
      definition:
        'A handhole or manhole formed by pouring concrete around forms that define the walls, bottom, and entry-port locations. Done on-site after excavation. Advantages: can accommodate tight ROW where a delivery truck cannot stage a pre-cast unit; custom dimensions possible. Disadvantages: slower, requires curing time, and finished dimensions are less predictable than factory-formed pre-cast.',
    },
    {
      term: 'pre-cast',
      definition:
        'A factory-manufactured handhole or manhole delivered to the site as a finished unit — typically reinforced concrete or fiberglass. Installation requires lowering the pre-cast unit into the prepared excavation. Advantages: faster, more consistent quality, predictable dimensions. Dominates new construction where ROW allows staging.',
    },
    {
      term: 'frame-and-cover',
      definition:
        'The lid assembly placed over the vault or manhole opening — typically cast iron or ductile iron with a steel frame that seats in the vault wall. Rated for traffic loading (H-20 or H-25) and must match the roadway surface if the structure is in a paved area. The frame anchors in the vault walls; the cover rests in the frame.',
    },
    {
      term: 'traffic loading',
      definition:
        'The vehicle load classification that a buried structure must withstand without deformation or failure. H-20 (HS-20) rating: 16,000 lb per rear-tandem axle — suitable for driveways, parking lots, and private access roads. H-25 (HS-25) rating: 20,000 lb per rear-tandem axle — required for any structure in a public roadway or under a traffic lane.',
    },
  ],
  vocabulary_assumed: [
    { term: 'manhole', source_lesson_id: 'T06.L05' },
    { term: 'handhole', source_lesson_id: 'T06.L05' },
    { term: 'vault', source_lesson_id: 'T06.L05' },
    { term: 'conduit', source_lesson_id: 'T01.L02' },
    { term: 'bend radius', source_lesson_id: 'T02.L04' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'confined space', source_lesson_id: 'T18.L03' },
    { term: 'shoring', source_lesson_id: 'T10.L03' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const key_terms = meta.key_terms;

export default function T10L07_ManholeHandholeInstallation() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Underground fiber runs through conduit — but every 500–1,000 feet, it needs
          a place to access. That place is a handhole (small, requires kneeling), a manhole
          (large enough to climb into), or a vault (the catch-all term for a buried structure
          with a lid). These structures are where splices happen, slack loops are stored,
          and technicians work on the cable.
        </p>
        <p className="mt-2">
          The structure has to be strong enough not to collapse when a utility truck drives
          over it. That's the traffic loading rating. It has to be big enough for the cable
          and splice trays inside it. And it has to be placed somewhere a splice truck can
          actually park without blocking traffic. Getting any of these wrong creates either
          a safety hazard or an expensive future problem.
        </p>

        <h3 className="mt-5 font-semibold">Structure type overview</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Size</th>
              <th className="px-3 py-2 text-left">Access</th>
              <th className="px-3 py-2 text-left">Typical use</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Handhole</td>
              <td className="px-3 py-2">12×18 in to 24×36 in</td>
              <td className="px-3 py-2">Remove lid, reach in from surface</td>
              <td className="px-3 py-2">Intermediate pull-through and slack storage; no person entry</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Manhole</td>
              <td className="px-3 py-2">36+ in wide, 48+ in deep</td>
              <td className="px-3 py-2">Crew member climbs in; OSHA confined space entry</td>
              <td className="px-3 py-2">Splice-point structures on major routes; cable racking; duct distribution</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Vault</td>
              <td className="px-3 py-2">Variable — often 48×48 in to 6×8 ft</td>
              <td className="px-3 py-2">Remove lid, may or may not require confined-space entry depending on depth</td>
              <td className="px-3 py-2">Splice points, distribution nodes, FDH (fiber distribution hub) housing</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-sm text-slate-400">
          Safety note: manholes and deep vaults frequently qualify as permit-required confined spaces
          under OSHA 1910.146(b) — three criteria all apply: (1) large enough for a worker to bodily
          enter, (2) limited means of entry or egress, and (3) not designed for continuous occupancy.
          Shallow handholes (typically accessed by hand only) generally do not satisfy all three
          criteria and are not confined spaces. When in doubt, apply the 1910.146(b) test before
          sending a crew member in. See T18.L05 for the full confined-space entry protocol.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T10-L07"
            cards={[
              {
                id: 'T10-L07-fc-cast-in-place',
                front: 'What is a cast-in-place handhole and when is it used?',
                back: 'A handhole formed by pouring concrete on-site around forms. Used when ROW is too tight for a delivery truck to stage a pre-cast unit, or when custom dimensions are required. Slower and less dimensionally consistent than pre-cast.',
              },
              {
                id: 'T10-L07-fc-pre-cast',
                front: 'What is a pre-cast handhole and why does it dominate new construction?',
                back: 'A factory-manufactured handhole delivered as a finished unit and lowered into the excavation. Faster installation, consistent quality, predictable dimensions. Dominates new construction where ROW allows truck staging.',
              },
              {
                id: 'T10-L07-fc-frame-cover',
                front: 'What is a frame-and-cover and what traffic rating must it have in a public roadway?',
                back: 'The lid assembly placed over a vault or manhole — typically cast iron with a steel frame seating in the vault wall. In a public roadway under a traffic lane, it must be rated H-25 (20,000 lb per rear-tandem axle). H-20 (16,000 lb per rear-tandem axle) is acceptable for driveways and private access roads.',
              },
              {
                id: 'T10-L07-fc-traffic-loading',
                front: 'What is the difference between H-20 and H-25 traffic loading ratings?',
                back: 'H-20 (HS-20): 16,000 lb per rear-tandem axle; 40,000 lb GVW (8,000 lb steer + 32,000 lb rear tandem) — for driveways, parking lots, and private access roads. H-25 (HS-25): 20,000 lb per rear-tandem axle — required for any structure in a public roadway or under a traffic lane.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Structure Placement, Sizing, and Installation</h2>

        <h3 className="mt-4 font-semibold">Planning interval vs. as-built placement</h3>
        <p>
          The design standard calls for handholes at 500–1,000 ft intervals (OFS IP-079;
          FOA OSP Civil Works Guide). This interval keeps splice-truck reach within the
          slack loop length specified at each structure. But the planned location is a
          starting point, not a fixed point.
        </p>
        <p className="mt-2">
          The as-built location is wherever the structure can actually be placed. In practice,
          a handhole positioned at station 750+00 on the plan might end up at 748+50 because:
        </p>
        <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300 text-sm">
          <li>The planned spot is in a traffic-signal intersection with no shoulder for splice-truck parking</li>
          <li>The planned spot is over an existing utility that would conflict with the structure depth</li>
          <li>The planned spot is in a driveway apron where the DOT permit requires no structure</li>
          <li>The nearest safe parking pull-off for the splice truck is 100 ft back from the planned spot</li>
        </ul>
        <p className="mt-2">
          The design rule: place the structure at the planned interval. Move each structure
          to the nearest location where (a) the structure can be safely excavated, (b) the
          splice truck can park with safe access, and (c) the AHJ permit allows a structure.
          Document the deviation on the plan-and-profile as-built redline.
        </p>

        {/* AnnotatedDiagram — manhole cross-section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Manhole Assembly — Cross-Section</h3>
            </div>

        <h3 className="mt-6 font-semibold">Traffic loading: H-20 vs. H-25</h3>
        <p>
          Every buried structure with a lid must be rated for the anticipated vehicle load
          above it. The two standard ratings:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
          <li><strong>H-20 (HS-20):</strong> 16,000 lb per rear-tandem axle (8,000 lb steer + 32,000 lb rear tandem = 40,000 lb GVW per the AASHTO HS-20 classification). Acceptable for private driveways, parking lots, and private access roads where heavy delivery trucks don't commonly drive.</li>
          <li><strong>H-25 (HS-25):</strong> 20,000 lb per rear-tandem axle. Required for any structure in or under a public roadway where utility trucks, delivery vehicles, or transit buses travel. Most state DOT permits specify H-25 for any work within the paved ROW.</li>
        </ul>
        <p className="mt-2 p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
          <strong>Common installation error:</strong> A contractor installs an H-20 structure in a location that will be under a paved road after subdivision development. Initial installation is fine. Road is built over it later. A delivery truck parks over the lid and the vault collapses. The contractor is liable. Always spec H-25 for any structure that might ever be in or adjacent to a paved roadway.
        </p>

        <h3 className="mt-6 font-semibold">Vault sizing checklist</h3>
        <p>
          Before specifying a vault size, verify:
        </p>
        <ol className="list-decimal list-inside mt-2 space-y-1 text-slate-300 text-sm">
          <li>Minimum bend radius of the largest cable entering the vault (typically 20× cable OD for installation) — the vault must be wide enough to form a full bend without exceeding this radius</li>
          <li>Number of splice trays to be housed — each tray requires brackets and clearance; a 12-tray splice case needs a wider vault than a 4-tray case</li>
          <li>Lid removal clearance — the lid must be removable with available tools in the as-installed location; a lid over a tight sidewalk may need a smaller diameter</li>
          <li>Traffic rating — confirm H-25 for any public roadway location</li>
          <li>Conduit entry count and size — the vault walls must have enough knock-out locations for all incoming/outgoing conduit runs</li>
        </ol>
        <p className="mt-2">
          OFS IP-079 provides a sizing nomograph: based on cable count, bend radius, and
          slack loop requirements. For most 48F–144F route cables with 100-ft slack loops,
          a 24×36 in handhole or 36×48 in vault covers most intermediate applications.
          For splice-point vaults with multiple cable entries and large slack coils,
          a 48×48 in structure is typical.
        </p>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T10-L07-quiz-1"
            questions={[
              {
                id: 'q1',
                text: 'You are designing a handhole placement for a new fiber route. The plan shows station 1250+00 as the location. At that station, the ROW is only 3 ft wide and a traffic signal pole is directly at the proposed location. The next available shoulder pull-off where a splice truck can park is at station 1248+25. What do you do?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Install the handhole at station 1250+00 per the plan — design controls' },
                  { id: 'b', text: 'Move the handhole to station 1248+25 (nearest safe access location), document the deviation as an as-built redline' },
                  { id: 'c', text: 'Skip the handhole at this location — the 175 ft gap will be covered by slack loops at adjacent structures' },
                  { id: 'd', text: 'Install the handhole at 1248+25 only if the AHJ inspector approves the change order first' },
                ],
                correctId: 'b',
                explanation:
                  'The planned interval is a design starting point. The structure goes at the nearest practical location where the splice truck can park safely and the AHJ permit allows a structure. Station 1248+25 (nearest shoulder pull-off, 175 ft from the planned station) is the correct as-built location. Document the deviation on the plan-and-profile redline so the as-built drawing accurately reflects what was installed.',
              },
              {
                id: 'q2',
                text: 'A subdivision is being built along your fiber route. The developer is paving a new access road over one of your H-20 handholes. Does the structure need to be upgraded?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'No — H-20 covers standard passenger vehicle loads and the access road will only have light traffic' },
                  { id: 'b', text: 'Yes — once the structure is under a paved road where utility or delivery trucks will travel, H-25 is required' },
                  { id: 'c', text: 'Only if the road will carry trucks over 10,000 lbs' },
                  { id: 'd', text: 'No — traffic loading only applies to state highway ROW, not private subdivision roads' },
                ],
                correctId: 'b',
                explanation:
                  'H-20 is rated for 16,000 lb per rear-tandem axle — a typical utility truck or loaded delivery vehicle can exceed this. H-25 (20,000 lb per rear-tandem axle) is required for any structure under a paved road surface where utility or commercial vehicles will travel. Once the structure is under paving that sees truck traffic, the H-20 rating is inadequate. The structure must be replaced or reinforced to H-25 before the road opens to truck traffic.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Confined Space Entry and Pre-Cast Logistics</h2>

        <h3 className="mt-4 font-semibold">Manhole entry as a confined space operation</h3>
        <p>
          Manholes and most deep vaults satisfy all three criteria of OSHA 1910.146(b) for
          a confined space: (1) large enough for a worker to bodily enter and perform work,
          (2) limited means of entry or egress (ladder access through a ring opening), and
          (3) not designed for continuous employee occupancy. When all three criteria are met
          and atmospheric hazards are present or possible, the structure is a permit-required
          confined space. This means: atmospheric testing before entry (oxygen, combustibles,
          H₂S), attendant stationed at the surface, retrieval equipment on site, and a
          signed entry permit. See T18.L05 for the full confined-space entry protocol.
        </p>
        <p className="mt-2">
          The specific risks in underground telecom structures: methane (from organic
          decomposition in adjacent soil), H₂S (from nearby sewer systems), oxygen
          deficiency (water displacement in sealed structures), and flooding (high water
          table or storm infiltration). Never enter without testing.
        </p>

        <h3 className="mt-4 font-semibold">Pre-cast logistics: delivery truck access is the constraint</h3>
        <p>
          Pre-cast vaults are heavy — a standard 24×36 in handhole runs 150–400 lbs
          depending on material (concrete vs. HDPE fiberglass composite); a 48×48 in
          concrete vault can exceed 1,500 lbs. A flat-bed truck with a crane or boom
          delivers and places them. The truck needs:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300 text-sm">
          <li>Access to within 20–30 ft of the vault location for the boom to reach</li>
          <li>Ground bearing capacity to support the loaded truck (typically 10 tons minimum)</li>
          <li>Overhead clearance for the boom (typically 30+ ft for crane trucks)</li>
        </ul>
        <p className="mt-2">
          In tight urban ROW, alleys, or locations with low overhead utilities, pre-cast
          delivery isn't feasible. Cast-in-place is the only option. On large rural builds
          (typical RUS route), pre-cast dominates because delivery access is rarely
          constrained.
        </p>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          Manhole and handhole installation is where OSP design decisions made in T06 become concrete
          — literally. The structure type (handhole vs. manhole vs. vault), its dimensions, and its
          traffic loading rating were all specified during the underground design phase in T06.L05;
          the installation crew executes against that spec, not the other way around. The H-20 vs.
          H-25 traffic loading distinction you learned here traces directly to the encroachment permit
          conditions set in T09.L06 — most state DOT permits for primary-road ROW specify H-25 as a
          minimum, and installing an H-20 structure in that location is a permit violation that requires
          excavation and replacement. Confined-space entry procedures from T18.L03 govern any work
          inside a manhole — the structure you install here is a confined space the moment a worker
          enters it, and the atmospheric and ventilation requirements apply before the lid closes for
          the first time. The vault dimensions must also accommodate the cable bend radius from T02.L04
          and the slack loop quantities from T10.L06, so the construction superintendent must verify
          that the structure spec sheet matches the design's cable geometry before the concrete is poured.
        </p>
      </section>
    </LessonLayout>
  );
}
