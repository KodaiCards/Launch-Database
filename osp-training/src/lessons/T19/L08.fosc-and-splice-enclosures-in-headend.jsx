// Net-new — T19.L08
// T19.L08 — FOSC and Splice Enclosures in the Headend
// Working lesson: FOSC inside headend vs OSP, rack-mount FOSC, express vs split fiber

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import SideBySide from '../../components/primitives/SideBySide.jsx';
import { Flashcard } from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T19.L08',
  course_id: 'T19',
  title: 'FOSC and Splice Enclosures in the Headend',
  order: 8,
  lesson_type: 'working',
  prerequisites: ['T19.L07'],
  vocabulary_introduced: [
    'FOSC',
    'rack-mount FOSC',
    'express fiber',
    'split fiber',
    'gel-free splice enclosure',
    'organizer tray',
  ],
  key_terms: [
    {
      term: 'FOSC',
      definition: 'Fiber Optic Splice Closure — an enclosure that protects fusion splices from environmental exposure. In the outside plant, FOSCs are weatherproof housings mounted on poles, in vaults, or underground. In a headend, the term refers to any protective enclosure or splice organizer that manages fiber splices. Inside the building, FOSCs take the form of rack-mount splice organizers or dome-style enclosures mounted on cable tray — they are typically gel-free (no filling compound) since they are protected from weather.',
    },
    {
      term: 'rack-mount FOSC',
      definition: 'A FOSC designed to mount in a 19-inch equipment rack, typically 1U–4U in height. Holds splice trays inside a hinged, lockable front-access door. Used inside COs and headends to organize and protect fusion splices where the fiber transitions from OSP cable to inside-plant pigtails or intra-building backbone cable. Preferred over dome-style FOSCs in headend rack environments because they fit neatly in standard equipment racks alongside patch panels.',
    },
    {
      term: 'express fiber',
      definition: 'Fibers in a multi-fiber cable that pass through a splice enclosure or junction point without being broken out or spliced — they continue to the next location with only the fibers needed at that node being accessed. Express fibers are common in ring and bus OSP topologies where a single cable serves multiple FDHs or COs in sequence. At each intermediate node, only the needed fibers are spliced; the rest express through the enclosure untouched.',
    },
    {
      term: 'split fiber',
      definition: 'Fibers in a multi-fiber cable that are broken out at a specific enclosure and spliced to distribution or drop fibers for local service. "Split" at the splice closure means the fiber path ends at that location — the fiber does not express through to a downstream point. In a feeder-to-FDH design, all 144 feeder fibers might split at the FDH (all are accessed and assigned to distribution fibers). In a ring design, only 24 of 144 might split at an intermediate node, with 120 expressing through.',
    },
    {
      term: 'gel-free splice enclosure',
      definition: 'A splice closure designed for use without filling gel or grease compound. Inside-plant splice organizers and rack-mount FOSCs are always gel-free — the controlled indoor environment eliminates the need for gel sealing. Outside-plant FOSCs may be gel-free (using gasket seals and dry-block fill) or gel-filled (traditional flooding compound). Gel-free is preferred even in OSP applications today because gel-free FOSCs are easier to re-enter and cleaner to work with. See T11 for full splice case selection and gel sealing procedures.',
    },
    {
      term: 'organizer tray',
      definition: 'A removable tray inside an FOSC or splice organizer that holds individual fusion splices, coils excess fiber, and protects heat-shrink splice protectors. Standard tray capacities: 12 or 24 splices. Each tray typically holds 12 splice protectors in a comb, with storage wheels on each side for excess fiber coiling. When a splice organizer is full, additional capacity is added by adding trays or adding a second organizer.',
    },
  ],
  vocabulary_assumed: [
    { term: 'CO', source_lesson_id: 'T19.L01' },
    { term: 'MDF', source_lesson_id: 'T19.L01' },
    { term: 'splice organizer', source_lesson_id: 'T19.L07' },
    { term: 'pigtail', source_lesson_id: 'T19.L07' },
    { term: 'ODF rack', source_lesson_id: 'T19.L07' },
    { term: 'feeder', source_lesson_id: 'T01.L08' },
    { term: 'FDH', source_lesson_id: 'T01.L08' },
    { term: 'fusion splice', source_lesson_id: 'T11.L01' },
  ],
  estimated_minutes: 20,
};

export default function T19L08_FoscAndSpliceEnclosuresInHeadend() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A FOSC (Fiber Optic Splice Closure) in the outside plant is a weatherproof dome
          or in-line closure protecting splices from rain, UV, and rodents. Inside the
          headend, you don't need weather protection — you need organization. The indoor
          equivalent is the rack-mount splice organizer or rack-mount FOSC: a tidy 2U or
          4U metal box that holds splice trays inside an equipment rack, right next to the
          patch panels it feeds.
        </p>
        <p className="mt-2">
          This lesson also covers an important concept the OSP engineer must design around:
          express vs. split fibers. When a cable passes through an intermediate splice
          point, some fibers drop off (split) and some continue (express). Getting this
          wrong in the design — splicing express fibers when they should continue, or
          forgetting to account for them — is a real and common error that causes months
          of troubleshooting.
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
              <td className="px-3 py-2 font-mono">FOSC</td>
              <td className="px-3 py-2">Fiber Optic Splice Closure</td>
              <td className="px-3 py-2">Any enclosure protecting fiber splices — from outdoor weatherproof domes to indoor rack-mount organizers</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OSP</td>
              <td className="px-3 py-2">Outside Plant</td>
              <td className="px-3 py-2">Fiber cable infrastructure in the field — not inside a building</td>
            </tr>
          </tbody>
        </table>

        {/* ── FLASHCARDS ───────────────────────────────────────────────── */}
        <Flashcard
          deckId="T19-L08"
          cards={[
            {
              id: 'T19-L08-fc-fosc',
              front: 'What is a FOSC in inside-plant (headend) context?',
              back: 'A rack-mount splice organizer or rack-mount FOSC — a 1U–4U metal enclosure holding splice trays inside an equipment rack. Protects and organizes fusion splices where OSP cable meets inside-plant pigtails or backbone. Gel-free (no filling compound needed — indoor environment). No weatherproofing required.',
            },
            {
              id: 'T19-L08-fc-rack-mount-fosc',
              front: 'What is a rack-mount FOSC?',
              back: 'A FOSC designed for 19-inch equipment racks (1U–4U). Hinged front-access door, holds splice trays. Used inside COs to organize transitions from OSP cable to inside-plant pigtails. Preferred over dome-style in headend rack environments for neat integration with patch panels.',
            },
            {
              id: 'T19-L08-fc-express',
              front: 'What are express fibers?',
              back: 'Fibers that pass through a splice enclosure without being broken out or spliced — they continue to the next downstream location. Only the fibers needed at this node are accessed (split). Express fibers are untouched. Common in ring/bus topologies.',
            },
            {
              id: 'T19-L08-fc-split',
              front: 'What are split fibers?',
              back: 'Fibers broken out at a specific enclosure and spliced to local distribution or drop fibers. The fiber path ends here — it does not express to a downstream point. In a feeder-to-FDH design, all fibers may split; in a ring, only a subset split at each intermediate node.',
            },
            {
              id: 'T19-L08-fc-gel-free',
              front: 'What is a gel-free splice enclosure?',
              back: 'A splice closure without gel or grease filling compound. Indoor organizers are always gel-free — no weather exposure. OSP FOSCs increasingly use gel-free construction with dry-block fill and gasket seals. Gel-free is easier to re-enter and cleaner to work with. See T11 for full splice case selection.',
            },
            {
              id: 'T19-L08-fc-organizer-tray',
              front: 'What is an organizer tray?',
              back: 'A removable tray inside an FOSC or splice organizer holding individual fusion splices, coiled excess fiber, and heat-shrink splice protectors. Standard: 12 or 24 splices per tray. Added as capacity grows.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>OSP FOSC vs. Headend FOSC — Same Function, Different Environment</h2>

        <SideBySide
          title="FOSC in OSP vs. FOSC in Headend"
          leftLabel="OSP FOSC (Outside Plant)"
          rightLabel="Headend FOSC (Inside Plant)"
          rows={[
            {
              label: 'Environment',
              left: 'Outdoor: UV, rain, extreme temperature, ice, rodents, mechanical impact. Must be weatherproof.',
              right: 'Indoor: temperature-controlled, dry, clean. No weatherproofing required.',
            },
            {
              label: 'Physical form factor',
              left: 'Dome (aerial), in-line cylinder (underground), wall-mount enclosure (splice cabinet). Weatherproof gaskets, gel seal or dry-block fill.',
              right: 'Rack-mount enclosure (1U–4U), slide-out tray access. Standard 19-inch rack format. No gel — dust protection only.',
            },
            {
              label: 'Fiber entry',
              left: 'Weatherproof cable entry ports with heat-shrink boots or compression fittings to seal around the cable jacket.',
              right: 'Cable management opening — no sealing needed. Cable tray or J-hook routes OSP cable from MEF to rack-mount FOSC.',
            },
            {
              label: 'Re-entry frequency',
              left: 'Infrequent — ideally sealed for years. Re-entry requires disrupting the seal and resealing.',
              right: 'Frequent — added splices as new feeders terminate. Front-access door opens without any tools (in most designs).',
            },
            {
              label: 'Splice protection',
              left: 'Heat-shrink splice protectors in trays. Tray storage wheels hold excess fiber.',
              right: 'Same heat-shrink protectors and tray design. Identical splice mechanics — environment is the only difference.',
            },
          ]}
        />

        <h3 className="mt-5 font-semibold">Express vs. split — OSP design decision with CO implications</h3>
        <p className="mt-2">
          When a 144-fiber feeder cable runs from the CO to FDH-1 and continues to FDH-2
          (bus topology), the OSP engineer must designate which fibers split at FDH-1 and
          which express to FDH-2. This decision appears in the splice matrix and the FOSC
          design at FDH-1. The implications reach back to the CO headend:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Express fibers at FDH-1</strong> appear at the CO ODF patch panel as
            pass-through connections — they are spliced at FDH-1 in an express splice
            (straight-through, not broken out) and continue to FDH-2. Their CO ODF port
            is assigned to the FDH-2 service area.
          </li>
          <li>
            <strong>Split fibers at FDH-1</strong> terminate at FDH-1 and connect to
            the local splitter cassettes. Their CO ODF port is assigned to the FDH-1
            service area.
          </li>
          <li>
            <strong>Design error consequence:</strong> If the splice matrix says fibers
            1–24 split at FDH-1 but the splicer accidentally spliced them express (connecting
            them to the continuing cable), those fibers are now routed to FDH-2 instead of
            FDH-1. Subscribers in the FDH-1 area have no signal. Troubleshooting requires
            OTDR trace from the CO, opening FDH-1, and finding the splice error — a multi-hour
            event. The splice matrix and the FOSC design must be in precise agreement.
          </li>
        </ul>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — Gel-Free FOSCs in OSP</p>
          <p className="text-slate-300/90">
            <strong>Book (Corning, CommScope, AFL FOSC specifications; industry practice):</strong>{' '}
            Gel-free (dry-block fill) OSP FOSCs are increasingly specified because they are
            easier to re-enter (no gel cleanup) and maintain sealing integrity through the
            dry-block's hygroscopic fill material. TIA-598-D [confirm edition] color codes apply
            to fiber identification inside any FOSC regardless of fill type.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Many splicers prefer gel-filled FOSCs for aerial applications
            because the gel is a time-tested seal against rain infiltration at cable entry ports.
            "Gel-free" dome closures have had failure modes in high-precipitation areas where
            the dry-block fill saturated over years. Field practice in wet climates often retains
            gel-filled for aerial above-grade work. Gel-free is accepted and preferred for
            underground in-conduit applications and always for inside-plant. The book says gel-free;
            field choice depends on climate and location. Know both and spec accordingly.
          </p>
        </div>
      </section>

      {/* ── ANNOTATED DIAGRAM ─────────────────────────────────────────── */}
      <AnnotatedDiagram
        title="Rack-Mount FOSC vs. OSP FOSC"
        description="Click each diagram element to compare the two environments."
        src="/training/diagrams/fosc-comparison.svg"
        alt="Side-by-side diagram of an OSP dome FOSC and a rack-mount headend FOSC, showing physical differences"
        aspectRatio={2.5}
        hotPoints={[
          {
            id: 'osp-dome',
            x: 15,
            y: 40,
            label: 'OSP Dome FOSC',
            type: 'click',
            explanation:
              'Weatherproof dome closure for aerial or pedestal use. Cable entry ports are sealed with heat-shrink boots or gel. Re-entry requires opening the dome and disturbing the seal. Splice trays inside are identical to headend trays — the mechanics are the same.',
          },
          {
            id: 'headend-rack',
            x: 65,
            y: 40,
            label: 'Rack-Mount FOSC',
            type: 'click',
            explanation:
              'Indoor rack-mount enclosure (2U shown). Front-access hinged door. Holds 6–12 splice trays (72–144 splices in 2U). Cable enters through an open management port. No seal, no gel. Fits in a standard ODF rack alongside patch panels.',
          },
          {
            id: 'express-path',
            x: 40,
            y: 75,
            label: 'Express fiber path',
            type: 'click',
            explanation:
              'Express fibers pass through the FOSC in a straight-through express splice tray. They are not broken out to any local connection. In the headend rack-mount FOSC, express fibers at an intermediate FDH appear as through-splices — entering on one cable, continuing on another cable. Their CO ODF port connects to the next downstream FDH.',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T19.L08 Check — FOSC and Splice Enclosures in the Headend"
        mode="multiple-choice"
        questions={[
          {
            id: 'T19-L08-Q1',
            type: 'mc',
            prompt:
              'An OSP engineer specifies a rack-mount FOSC for the CO headend to organize splices from a new 144-fiber feeder cable. The FOSC has 6 splice trays at 24 splices each. How many fibers can this FOSC accommodate?',
            choices: [
              '72 fibers (6 trays × 12 splices per tray)',
              '144 fibers (6 trays × 24 splices per tray)',
              '288 fibers (6 trays × 48 splices per tray)',
              '96 fibers (4 trays occupied, 2 reserved for future)',
            ],
            answerIndex: 1,
            explanation:
              '6 splice trays × 24 splices per tray = 144 splice positions = 144 fibers. A 144-fiber feeder cable requires exactly 144 splice positions (one per fiber, each spliced to a pigtail). This FOSC is precisely sized for the cable. Specify the next size up (or an 8-tray unit) to leave growth capacity for future re-splicing or pigtail additions.',
          },
          {
            id: 'T19-L08-Q2',
            type: 'mc',
            prompt:
              'A 72-fiber feeder cable is designed to serve FDH-1 (24 fibers) and FDH-2 (48 fibers) in a bus topology. At FDH-1, fibers 1–24 are designated to split; fibers 25–72 are designated to express to FDH-2. A splicer accidentally splices fibers 1–24 as express (connecting them to the FDH-2 continuing cable). What happens to FDH-1 service?',
            choices: [
              'FDH-1 service is unaffected — the OLT at the CO will detect the error and reroute signals automatically',
              'FDH-1 service is fully out. Fibers 1–24 now route to FDH-2 instead of FDH-1\'s splitter cassettes. FDH-1\'s splitters have no light signal. All subscribers on FDH-1 are dark.',
              'FDH-1 experiences 50% signal loss but some service continues',
              'FDH-2 service is disrupted because the extra fibers overload the FDH-2 splitter capacity',
            ],
            answerIndex: 1,
            explanation:
              'Express vs. split is a binary choice at the FOSC. If a fiber is spliced express (through to FDH-2) when it should split (to FDH-1\'s local splitters), that fiber does not deliver light to FDH-1. FDH-1\'s assigned splitter inputs have no signal; all ONTs on FDH-1\'s distribution fibers receive no downstream light. Result: complete loss of service for all FDH-1 subscribers. The splicer must re-open FDH-1 and correct the splice to restore service.',
          },
          {
            id: 'T19-L08-Q3',
            type: 'mc',
            prompt:
              'Why is gel filling compound NOT used in rack-mount FOSCs inside a CO headend?',
            choices: [
              'Gel filling is prohibited by TIA-568 for inside-plant enclosures',
              'Gel filling is not needed in a controlled indoor environment (no weather, no moisture intrusion through cable entry ports). The headend FOSC provides dust and mechanical protection only. Gel is an outdoor weatherproofing measure unnecessary inside a building.',
              'Gel filling causes signal loss in optical splices above 20°C',
              'CO headend FOSCs use foam-block fill instead of gel for the same sealing purpose',
            ],
            answerIndex: 1,
            explanation:
              'Gel filling compound in OSP FOSCs serves one purpose: weatherproof sealing against moisture ingress through cable entry ports and the closure body, in outdoor environments with rain, ice, and condensation. Inside a CO headend, the closure is in a controlled, dry, temperature-stable environment. No weather seal is needed. The rack-mount FOSC provides organization (keeping splices protected from accidental pulls), dust protection, and physical organization. Gel would just make future re-entry messy with no benefit.',
          },
          {
            id: 'T19-L08-Q4',
            type: 'fill-in-blank',
            prompt:
              'An organizer tray inside an FOSC or rack-mount splice enclosure typically holds either ____ or ____ fusion splices per tray.',
            answer: '12 or 24',
            answerDisplay: '12 or 24',
            explanation:
              'Standard splice tray capacities are 12 or 24 splices. 12-splice trays are smaller and fit in compact enclosures; 24-splice trays increase density in larger rack-mount organizers. Tray type and quantity determine the total splice capacity of the enclosure. For a 144-fiber cable, you need either 12 × 12-splice trays = 144 positions, or 6 × 24-splice trays = 144 positions.',
          },
        ]}
      />

    </LessonLayout>
  );
}
