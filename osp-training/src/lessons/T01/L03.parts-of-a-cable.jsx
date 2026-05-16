// Net-new — T01 Fundamentals & Vocabulary, Lesson 3
// T01.L03 — Parts of a Cable
// Foundation lesson: OSP cable anatomy — sheath, buffer tube, ripcord, armor, messenger, fiber

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T01.L03',
  course_id: 'T01',
  title: 'Parts of a Cable',
  order: 3,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01'],
  vocabulary_introduced: [
    'sheath',
    'buffer tube',
    'ripcord',
    'armor',
    'messenger',
    'fiber',
    'central member',
    'water-blocking gel',
    'jacket',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'ISP', source_lesson_id: 'T01.L01' },
    { term: 'span', source_lesson_id: 'T01.L02' },
  ],
  estimated_minutes: 20,
  learning_objectives: [
    'Identify the layers of a standard loose-tube OSP cable from the optical fiber core outward to the outer jacket',
    'Distinguish between lashed aerial, ADSS, and direct-buried cable configurations and explain when each is used',
    'Decode a cable jacket print to determine fiber count, cable type, and material specifications',
    'Explain why LSZH and colored jacket variants exist and where each is applied in OSP installations',
  ],
};

export default function T01L03_PartsOfACable() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          An OSP fiber cable looks like a plain black cylinder from the outside. But cut it open
          and you'll find six or eight distinct layers, each doing a specific job. Knowing what
          each layer does — and what it's called — is fundamental to splicing, troubleshooting,
          and specifying the right cable for a job.
        </p>
        <p className="mt-2">
          Think of a fiber cable like a well-designed pipe. The outer jacket keeps water and
          UV radiation out. The layers underneath protect the actual fiber strands from
          bending, crushing, rodents, and temperature swings. The fibers themselves —
          thinner than a human hair — carry the light. Every layer earns its place.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms and terms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">What it is</th>
              <th className="px-3 py-2 text-left">Why it matters</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Sheath / Jacket</td>
              <td className="px-3 py-2">The outer plastic skin of the cable</td>
              <td className="px-3 py-2">First barrier against UV, moisture, physical damage. Color indicates cable type.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Buffer tube</td>
              <td className="px-3 py-2">Plastic tube holding 2–12 fibers, filled with gel or dry-block</td>
              <td className="px-3 py-2">Protects fibers from bending; color-coded to identify which fibers are inside</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Ripcord</td>
              <td className="px-3 py-2">A string or cord inside the jacket for easy opening</td>
              <td className="px-3 py-2">Pull the ripcord to slit the jacket without cutting into the buffer tubes inside</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Armor</td>
              <td className="px-3 py-2">Steel tape or corrugated steel layer inside the jacket</td>
              <td className="px-3 py-2">Protects buried cable from rodent gnawing and dig-in damage; some cables are dielectric (no metal)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Messenger</td>
              <td className="px-3 py-2">A separate steel or fiberglass strand that supports the cable's weight in aerial applications</td>
              <td className="px-3 py-2">The messenger carries the tension between poles; the fiber cable is lashed to it (or it's integral in ADSS cable)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Central member</td>
              <td className="px-3 py-2">A steel wire or fiberglass rod down the center of the cable</td>
              <td className="px-3 py-2">Gives the cable its shape and prevents kinking; buffer tubes are stranded around it</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">From outside in — the standard loose-tube OSP cable</h3>
        <p className="mt-2">
          The most common OSP cable design is the <strong>loose-tube</strong> cable. Here's
          what you find, layer by layer, from outside to inside:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-2 text-slate-300/90">
          <li>
            <strong>Outer jacket (sheath):</strong> Black HDPE (High-Density Polyethylene) is the standard for
            direct-buried and aerial cable. HDPE resists UV radiation and moisture for 20–30
            years without degrading. Jacket color varies by application: black is standard for aerial and direct-buried OSP; orange or yellow jackets indicate conduit-application or LSZH (Low-Smoke Zero-Halogen) variants used in conduit systems where fire-smoke toxicity is a concern. If you encounter a non-black OSP cable, check the jacket print for the cable designation and rating.
            This is the only layer most people ever see on a cable reel.
          </li>
          <li>
            <strong>Ripcord:</strong> A nylon string inside the jacket, typically orange or white.
            Grab it, pull lengthwise, and it cuts through the outer jacket in a clean slit —
            no blade needed (though a slitting tool is faster and safer). Lets you open the
            cable without crushing the buffer tubes inside.
          </li>
          <li>
            <strong>Armor (if present):</strong> A layer of steel tape or corrugated steel
            (sometimes aluminum) bonded to the inside of the jacket. Armored cables resist
            rodent gnawing, dig-in damage, and crushing. Cables without metal armor are
            called <em>dielectric</em> (all-glass or all-plastic) — used when a non-metallic
            cable is required (e.g., aerial in certain lightning-prone environments or where no
            grounding continuity is wanted on the cable itself).
          </li>
          <li>
            <strong>Strength members / rip cords:</strong> Aramid yarn (Kevlar) or fiberglass
            rods stranded around the central member. These carry pulling tension during
            installation so the tension doesn't reach the fragile buffer tubes.
          </li>
          <li>
            <strong>Buffer tubes:</strong> Plastic tubes (usually blue, orange, green, brown,
            slate, white — the 12-color sequence up to the tube count). Each tube holds
            2–12 individual fibers, typically floating in water-blocking gel. The color of the
            tube identifies which group of fibers is inside.
          </li>
          <li>
            <strong>Water-blocking gel (or dry water block):</strong> A petroleum-based gel
            filling the buffer tube, preventing water from migrating along the cable length
            even if the jacket is damaged. Gel is messy but effective. Dry water-block
            alternatives use swelling tape instead of gel — cleaner to work with.
          </li>
          <li>
            <strong>Individual fibers:</strong> Each fiber is a glass strand with a 250-µm
            colored plastic coating (12-color sequence within the tube). The coating protects
            the glass during handling. The actual glass — core and cladding — is only
            125 µm in diameter. Strip the coating off and you have bare glass thin enough
            to cut skin.
          </li>
          <li>
            <strong>Central member:</strong> A steel wire or dielectric glass-reinforced
            plastic rod running down the center of the cable. The buffer tubes are stranded
            around it. Anchored inside the splice case to prevent the cable from pulling out.
          </li>
        </ol>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Standards describe the cable anatomy in detail. ICEA S-87-640 [confirm edition]
            (OSP fiber cable construction) and TIA-598-D (fiber color coding) define what goes
            where and how it's labeled.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> The first thing every new splicer learns is how to strip a
            cable without nicking the buffer tubes — and how to deal with the gel. Gel gets
            everywhere. Crews use isopropyl alcohol and paper towels to clean gel off fibers
            before splicing. Always wear nitrile gloves — some filling compounds cause skin
            irritation with repeated exposure.
          </p>
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Aerial Cable Configurations</h2>
        <p>
          Aerial OSP cable has an additional consideration: it must support its own weight
          across the span between poles. There are two main ways to solve this:
        </p>
        <div className="mt-3 space-y-4">
          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-200">Figure-8 (lashed messenger)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              The fiber cable and a separate steel messenger wire are lashed together with
              stainless steel lashing wire, forming a figure-8 cross-section. The steel
              messenger carries all the mechanical tension between poles; the fiber cable
              carries zero tension. Common in most aerial OSP deployments in the US.
              Disadvantage: metallic messenger must be bonded and grounded at each pole.
            </p>
          </div>
          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-200">ADSS — All-Dielectric Self-Supporting</p>
            <p className="text-sm text-slate-300/90 mt-1">
              The strength members are built into the cable itself (typically fiberglass rods
              and aramid yarn). No separate messenger wire — the cable is self-supporting.
              Fully dielectric (no metal). Advantage: no bonding/grounding requirement;
              can be installed in the supply space under certain conditions; lighter.
              Disadvantage: higher cost; more sensitive to span length and wind/ice loading.
              ADSS is common in RUS-program rural deployments. (Details in T03 + T05.)
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Cable identification — reading the jacket print</h3>
        <p className="mt-2 text-sm text-slate-300/90">
          Every OSP cable jacket is printed with identifying information. Typical print line:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-3 font-mono text-sm text-slate-200 my-3">
          CORNING 144F SMF-28e+ G.652.D OSP LOOSE TUBE ARMORED 2024 [footage markings]
        </div>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300/90 mt-1">
          <li><strong>Fiber count:</strong> 144F = 144 fibers</li>
          <li><strong>Fiber type:</strong> SMF-28e+ G.652.D = single-mode fiber, ITU-T G.652.D spec</li>
          <li><strong>Construction:</strong> OSP Loose Tube Armored = outdoor, loose-tube design with armor</li>
          <li><strong>Year:</strong> 2024 = year of manufacture (not of installation)</li>
          <li><strong>Footage marks:</strong> Printed every foot (or every 2 feet) so you can measure how much cable remains on the reel or in a run</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/90">
          Footage marks are critical for splice planning. A splicer needs to know how much
          cable slack is available at each end before opening the cable in the splice case.
          Document the footage mark at each end in your splice record.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — Ribbon Cable</h2>
        <p>
          Ribbon cable is an alternative construction where 12 fibers are bonded side-by-side
          into a flat ribbon, rather than floating individually in a round buffer tube. Multiple
          ribbons stack inside a single tube.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Advantages: mass-fusion splicing — a special splicer can fusion-splice all 12 fibers
          in a ribbon simultaneously. One ribbon splice = 12 individual fiber splices in about
          10 seconds. In a 432-fiber cable (36 ribbons × 12 fibers), a skilled splicer can
          complete all 432 fiber splices in under an hour. Traditional loose-tube would take
          5-10× longer.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Disadvantage: the ribbon bond weakens with temperature cycling and gel exposure,
          causing individual fibers to debond from the ribbon — called "rollable ribbon" when
          done intentionally as a design feature, but undesirable delamination when it happens
          in legacy ribbon cable. Rollable ribbon (intentionally flexible bonding) is a newer
          format that gives mass-splice speed with the handling flexibility of loose-tube.
          (Details in T03.L01.)
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Source: TIA-598-D (color code for ribbon fiber); ICEA S-87-640 [confirm edition] (construction standards).
        </p>
      </section>

      {/* ── KEY TERMS FLASHCARDS ────────────────────────────────────────── */}
      <Flashcard
        deckId="T01-L03"
        cards={[
          { id: 'T01-L03-FC-sheath', front: 'Sheath / Jacket', back: 'The outer plastic skin of an OSP cable — black HDPE for direct-buried and aerial cable. First barrier against UV radiation and moisture. Color indicates cable type.' },
          { id: 'T01-L03-FC-jacket', front: 'Jacket', back: 'Same as sheath — the outer HDPE skin of the cable. UV-resistant and moisture-resistant. For direct-buried cable this is the primary moisture barrier; for aerial cable it resists UV for 20+ years.' },
          { id: 'T01-L03-FC-buffer-tube', front: 'Buffer tube', back: 'A plastic tube (color-coded) holding 2–12 individual fibers in water-blocking gel. Protects fibers from bending and mechanical stress. Tube color identifies which group of fibers is inside.' },
          { id: 'T01-L03-FC-ripcord', front: 'Ripcord', back: 'A nylon string inside the cable jacket — grab it and pull lengthwise to slit the jacket open without cutting into buffer tubes. Every splicer\'s first move when opening a cable.' },
          { id: 'T01-L03-FC-armor', front: 'Armor', back: 'A steel tape or corrugated steel layer inside the jacket that protects buried cable from rodent gnawing and dig-in damage. Cables without metal armor are called dielectric.' },
          { id: 'T01-L03-FC-messenger', front: 'Messenger', back: 'A separate steel or fiberglass strand that supports an aerial cable\'s weight between poles. The messenger carries all the mechanical tension; the fiber cable carries zero tension. Lashed alongside the cable in figure-8 aerial installations.' },
          { id: 'T01-L03-FC-fiber', front: 'Fiber', back: 'Each individual glass strand inside a buffer tube. 250 µm with colored coating — about 3× the width of a human hair. Core + cladding glass is 125 µm. Strip the coating for splicing; handle bare glass carefully — it can puncture skin.' },
          { id: 'T01-L03-FC-central-member', front: 'Central member', back: 'A steel wire or glass-reinforced plastic rod running down the center of the cable. Buffer tubes are stranded around it. Must be anchored inside the splice case — failure to anchor allows cable tension to pull the tubes through and break all the splices.' },
          { id: 'T01-L03-FC-water-blocking-gel', front: 'Water-blocking gel', back: 'Petroleum-based gel filling buffer tubes that prevents water from migrating along the cable length even if the jacket is damaged. Gets everywhere — use isopropyl alcohol and nitrile gloves to clean. Dry water-block (swelling tape) is a cleaner alternative.' },
        ]}
      />

      {/* ── ANNOTATED DIAGRAM ────────────────────────────────────────────── */}
      <AnnotatedDiagram
        title="OSP Loose-Tube Cable — Cross Section"
        description="Click any labeled layer to learn what it does. This is a typical 72-fiber armored OSP cable cut open to show all layers."
        src="/training/diagrams/osp-cable-cross-section.svg"
        alt="Cross-section of a 72-fiber OSP loose-tube armored cable showing outer jacket, armor, buffer tubes, central member, and fiber strands"
        aspectRatio={1.2}
        hotPoints={[
          {
            id: 'jacket',
            x: 50,
            y: 5,
            label: 'Outer jacket',
            type: 'click',
            explanation:
              'Black HDPE (High-Density Polyethylene) outer jacket. UV-resistant and moisture-resistant. For direct-buried cable, this is the primary moisture barrier. For aerial cable, it must also resist UV exposure for 20+ years.',
          },
          {
            id: 'armor',
            x: 80,
            y: 20,
            label: 'Armor',
            type: 'click',
            explanation:
              'Corrugated steel or aluminum tape bonded to the inside of the jacket. Protects against rodent damage and direct dig-in. Cables without this layer are dielectric (no metal). Armored cables require bonding and grounding at each splice case.',
          },
          {
            id: 'ripcord',
            x: 20,
            y: 15,
            label: 'Ripcord',
            type: 'click',
            explanation:
              'A nylon string embedded inside the jacket. Grab it and pull lengthwise to slit the jacket open without cutting into buffer tubes. Every splicer\'s first move when opening a cable.',
          },
          {
            id: 'buffer-tube',
            x: 65,
            y: 50,
            label: 'Buffer tube',
            type: 'click',
            explanation:
              'Plastic tube (color-coded by position) holding 6–12 individual fibers in water-blocking gel. The tube protects fibers from bending and mechanical stress. Buffer tube colors follow the 12-color sequence: blue, orange, green, brown, slate, white, red, black, yellow, violet, rose, aqua.',
          },
          {
            id: 'central',
            x: 50,
            y: 50,
            label: 'Central member',
            type: 'click',
            explanation:
              'A steel wire or glass-reinforced plastic rod down the center. Buffer tubes are stranded around it. Must be anchored inside the splice case — failure to anchor it allows the cable to pull back through the case entry, destroying the splice.',
          },
          {
            id: 'fiber',
            x: 75,
            y: 65,
            label: 'Individual fiber',
            type: 'click',
            explanation:
              'Each colored glass strand inside a buffer tube. 250 µm with coating — about 3x the thickness of a human hair. Core + cladding glass is 125 µm. Strip the 250 µm coating for splicing, leaving the bare glass. Handle with care — bare glass can puncture skin.',
          },
        ]}
      />

      {/* ── PRACTICE QUIZ ───────────────────────────────────────────────── */}
      <Quiz
        title="T01.L03 Check — Parts of a Cable"
        mode="multiple-choice"
        questions={[
          {
            id: 'T01-L03-Q1',
            type: 'mc',
            prompt:
              'A splicer needs to open a loose-tube OSP cable to begin work. What is the correct tool or method for slitting the outer jacket without damaging the buffer tubes inside?',
            choices: [
              'A sharp knife — score along the length with light pressure',
              'A cable stripper or the ripcord — the ripcord slits the jacket cleanly without risking damage to buffer tubes below',
              'A hacksaw — the steel armor below the jacket protects the buffer tubes',
              'Diagonal cutters — snip the end of the jacket and peel it back',
            ],
            answerIndex: 1,
            explanation:
              'The ripcord is designed for this purpose — grab it and pull lengthwise to slit the jacket cleanly. A ring-type cable slitting tool is the purpose-built alternative. Using a knife risks cutting into buffer tubes, which would damage the fibers inside. Diagonal cutters can crush buffer tubes.',
            fieldNote:
              'Always find and test the ripcord before buying a cable on a job site. Some older cable (or poorly stored cable) may have a ripcord that\'s already been partially pulled, making it short. Know where it is before you need it.',
          },
          {
            id: 'T01-L03-Q2',
            type: 'mc',
            prompt:
              'What is the purpose of water-blocking gel inside a buffer tube?',
            choices: [
              'To lubricate the fibers during fusion splicing',
              'To prevent water from migrating along the cable length if the jacket is breached',
              'To act as an electrical insulator between fibers',
              'To cushion the fibers against impact damage',
            ],
            answerIndex: 1,
            explanation:
              'Water-blocking gel is a petroleum-based thixotropic compound that fills the buffer tube. If the jacket and armor are damaged (say, from a dig-in), the gel physically blocks water from migrating through the air gap along the cable to the splice case. Without gel (or dry water-block), a single jacket breach can flood a splice case miles away via capillary action along the buffer tubes.',
          },
          {
            id: 'T01-L03-Q3',
            type: 'fill-in-blank',
            prompt:
              'In a figure-8 aerial cable installation, the component that carries all the mechanical tension between poles (so the fiber cable does not) is called the ____.',
            answer: 'messenger',
            answerDisplay: 'messenger',
            explanation:
              'The steel messenger wire is lashed alongside the fiber cable. At each pole, the messenger is clamped and attached — all the aerial tension loads go through the messenger. The fiber cable hangs from the messenger with no tension. This protects the fibers from the bending and stretching that tension would cause.',
          },
          {
            id: 'T01-L03-Q4',
            type: 'mc',
            prompt:
              'A job spec requires "dielectric cable" for an aerial installation. Which of the following is a reason this requirement might be specified?',
            choices: [
              'Dielectric cable has lower attenuation than metallic-armored cable',
              'Dielectric cable contains no metal, so it does not require bonding and grounding at each pole — useful where no ground continuity on the cable is desired or where the installation is near high-voltage lines',
              'Dielectric cable is cheaper than armored cable for aerial use',
              'Dielectric cable is required by RUS for all aerial fiber installations',
            ],
            answerIndex: 1,
            explanation:
              'Dielectric cable (ADSS or dielectric-armored) contains no metal conductor. This means no bonding/grounding requirement at each pole, no induced voltage path, and in some designs the ability to be strung in closer proximity to high-voltage supply conductors (with engineering sign-off). The tradeoff is that dielectric cable cannot carry grounding continuity along the messenger — each splice case is an isolated island electrically. RUS does not mandate dielectric for all aerial — cable type selection is a design decision based on the route conditions.',
          },
        ]}
      />

    </LessonLayout>
  );
}
