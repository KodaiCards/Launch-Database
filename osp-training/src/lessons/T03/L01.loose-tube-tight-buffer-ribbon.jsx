// T03.L01 — Loose-Tube vs. Tight-Buffer vs. Ribbon
// Foundation lesson: cable construction types for OSP

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import SideBySide from '../../components/primitives/SideBySide.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T03.L01',
  course_id: 'T03',
  title: 'Loose-Tube vs. Tight-Buffer vs. Ribbon',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T02.L01'],
  vocabulary_introduced: [
    'loose-tube',
    'tight-buffered',
    'ribbon',
    'rollable ribbon',
  ],
  vocabulary_assumed: [
    { term: 'sheath',       source_lesson_id: 'T01.L03' },
    { term: 'buffer tube',  source_lesson_id: 'T01.L03' },
    { term: 'armor',        source_lesson_id: 'T01.L03' },
    { term: 'SMF',          source_lesson_id: 'T01.L08' },
    { term: 'G.652.D',      source_lesson_id: 'T02.L01' },
    { term: 'macrobend',    source_lesson_id: 'T02.L04' },
    { term: 'MFD',          source_lesson_id: 'T02.L01' },
  ],
  key_terms: [
    {
      term: 'loose-tube',
      definition:
        'A cable construction where individual fibers or small groups of fibers float freely inside a gel-filled or dry-block polymer tube that is larger in inner diameter than the fibers. The oversize tube provides slack that protects fibers from tensile and thermal stress. Standard construction for OSP trunk cables.',
    },
    {
      term: 'tight-buffered',
      definition:
        'A cable construction where each fiber has a secondary coating pressed directly against the 250 µm primary coating, building it up to 900 µm diameter. No free space around the fiber. Used primarily in indoor/premises cables; not the standard for OSP trunk runs.',
    },
    {
      term: 'ribbon',
      definition:
        'A cable construction where 12 (or 4, 6, or 8) fibers are bonded side-by-side into a flat matrix, enabling mass-fusion splicing of all fibers simultaneously. Higher fiber density per tube than loose individual fibers.',
    },
    {
      term: 'rollable ribbon',
      definition:
        'A variant of ribbon where the bonding between fibers in the matrix is intermittent, allowing the ribbon to roll into a cylindrical form for handling but to unroll for splicing. Combines loose-tube-like field handling with mass-splice speed.',
    },
  ],
  estimated_minutes: 22,
};

export default function T03L01_LooseTubeTightBufferRibbon() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Think of a garden hose with a few thin ropes running through it. If the hose's
          inside diameter is bigger than the ropes, the ropes can shift a little as the hose
          bends — they aren't being pulled or crushed. That's the idea behind a
          <strong> loose-tube</strong> fiber cable. The fiber strands float inside an oversize
          tube so bends and temperature changes don't yank on the glass.
        </p>
        <p className="mt-2">
          That one concept — loose-tube — is why OSP cables survive decades outside in all
          weather. Before you can spec a cable for any real project, you need to know how it's
          built inside. This lesson covers the three main construction types you'll encounter.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym/Term</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means on the job</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OSP</td>
              <td className="px-3 py-2">Outside Plant</td>
              <td className="px-3 py-2">Any cable installed outdoors: aerial, direct-burial, underground duct</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ISP</td>
              <td className="px-3 py-2">Inside Plant</td>
              <td className="px-3 py-2">Cables installed inside buildings; different fire-rating and mechanical requirements</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SMF</td>
              <td className="px-3 py-2">Single-Mode Fiber</td>
              <td className="px-3 py-2">The fiber type used in virtually all OSP networks (9 µm core, long distances)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The three construction types — quick picture</h3>
        <ul className="list-disc pl-5 space-y-3 mt-2">
          <li>
            <strong>Loose-tube</strong> — fibers float in an oversize tube. The tube is bigger
            than the fiber bundle on purpose. That slack is what keeps the fibers safe when
            the cable contracts in cold weather or stretches during installation. This is the
            standard for OSP trunks. (Source: ICEA S-87-640; FOA Reference Guide to OSP design)
          </li>
          <li>
            <strong>Tight-buffer</strong> — a thick plastic coating is pressed directly against
            each fiber, building it up to 900 µm (about the size of a mechanical pencil lead).
            No slack. Works fine indoors in a controlled environment, but OSP temperature swings
            would put stress on the glass. You'll find tight-buffer in patch cords, breakout
            cables, and indoor runs.
          </li>
          <li>
            <strong>Ribbon</strong> — instead of fibers loose in a tube, the fibers are bonded
            side-by-side into a flat matrix, like a section of window blinds. The big payoff:
            a splicer can fuse all 12 fibers at once using a mass-fusion splicer. When you're
            building a high-count feeder and need to splice 144 or 288 fibers at a closure,
            ribbon cable cuts splicing time dramatically. (Source: ICEA S-87-640; TIA-598-D)
          </li>
        </ul>

        <h3 className="mt-5 font-semibold">Rollable ribbon — the hybrid</h3>
        <p>
          Standard ribbon is flat and stiff, which makes it awkward to coil in a splice
          enclosure. <strong>Rollable ribbon</strong> solves that by making the bonds
          between fibers intermittent — think of a perforated sheet versus a solid sheet.
          In the tube, it rolls into a cylinder for easy handling. On the splice table, it
          unrolls flat for mass-fusion splicing. You get the density and speed of ribbon
          with the handling of a loose fiber bundle. (Source: OFS Optics rollable ribbon
          documentation — states "doubling fiber density" compared to loose individual fibers)
        </p>
      </section>

      {/* ── CONSTRUCTION TYPE BREAKDOWN ─────────────────────────────────── */}
      <div className="lesson-callout">
        <h4>Cable Construction Types — What It Is and Why It Matters</h4>

        <h5 className="mt-3 font-semibold">1. Loose-Tube</h5>
        <ul>
          <li><strong>Buffer tube:</strong> The polymer buffer tube is intentionally larger in diameter than the fiber bundle inside it. That extra space — plus gel or dry-block water-blocking compound — lets fibers move freely as the cable expands, contracts, or bends. Standard for OSP trunk cables. (ICEA S-87-640)</li>
          <li><strong>Fibers in gel/dry-block:</strong> Typically 2–12 fibers per loose tube, each with its 250 µm primary coating. In gel-filled designs, flooding compound fills the remaining space to block water migration. Dry-block cables substitute SAP (superabsorbent polymer) tape and yarns — faster to splice because there's no gel to clean. (7 CFR 1755.902; ICEA S-87-640)</li>
        </ul>

        <h5 className="mt-3 font-semibold">2. Tight-Buffer</h5>
        <ul>
          <li><strong>900 µm coating:</strong> A secondary plastic jacket is extruded directly onto the 250 µm primary coating, building the fiber up to 900 µm OD. Tough and easy to terminate individually. No slack — suited for indoor or short-run applications where temperature variation is controlled. (FOA Reference Guide; NEC Article 770)</li>
        </ul>

        <h5 className="mt-3 font-semibold">3. Ribbon</h5>
        <ul>
          <li><strong>Ribbon matrix:</strong> Fibers are bonded side-by-side into a flat matrix (typically 12 fibers per ribbon). A mass-fusion splicer clamps the entire ribbon and splices all 12 fibers simultaneously in one cycle, compared to 12 separate cycles for loose fibers. Efficiency gain is significant on high-count splices. (ICEA S-87-640; TIA-598-D)</li>
        </ul>
      </div>

      {/* ── WORKING ──────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Why Construction Type Matters for OSP</h2>

        <h3 className="mt-4 font-semibold">Thermal stress — the reason loose-tube dominates OSP</h3>
        <p>
          Cables expand and contract with temperature. In a direct-burial or aerial
          environment, a cable might experience a temperature range of −40°C to +70°C —
          a swing of 110°C. A typical HDPE jacket expands about 15× more than the glass
          fiber inside it. If the fiber were bonded tightly to the jacket, every cold night
          would put the fiber in tension; every hot day would put it in compression. Over
          20 years, that cycling causes micro-fractures in the glass.
        </p>
        <p className="mt-2">
          The loose-tube design breaks that coupling. The fiber floats free inside the tube.
          When the tube shrinks, the fiber just straightens out the tiny slack built into it
          — the fiber itself is never pulled. That's why <strong>loose-tube is the dominant
          OSP trunk cable construction</strong> worldwide. (Source: FOA Reference Guide to
          OSP design, thefoa.org)
        </p>

        <h3 className="mt-5 font-semibold">Fiber count per tube — RUS color coding</h3>
        <p>
          A typical OSP loose-tube cable holds 2–12 fibers per tube, each with its own
          color following the 12-color scheme from TIA-598-D:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 text-sm font-mono leading-7 mt-3">
          1 Blue · 2 Orange · 3 Green · 4 Brown · 5 Slate · 6 White ·<br/>
          7 Red · 8 Black · 9 Yellow · 10 Violet · 11 Rose · 12 Aqua
        </div>
        <p className="mt-2 text-sm text-slate-300/80">
          Source: 7 CFR 1755.902 (eCFR) — "The cable shall be fully color coded so that each
          fiber is distinguishable from every other fiber. A basic color scheme of twelve colors
          shall be used." (Verified via eCFR public text)
        </p>
        <p className="mt-2">
          For cables with more than 12 fibers per tube, fibers repeat the 12-color sequence
          with a stripe or ring added (confirmed: "dot coding" or "dash coding" methods) to
          distinguish tube-2 from tube-1.
        </p>

        <h3 className="mt-5 font-semibold">When ribbon wins — high-count feeder splicing</h3>
        <p>
          Imagine you're splicing a 288-fiber feeder cable at a closure. With loose
          individual fibers, you splice one fiber at a time: 288 individual splice cycles,
          each taking 1–2 minutes. At 1.5 min/splice, that's 7+ hours of continuous splicing
          just for fiber fusion — before cleanup, tray loading, or closure seal.
        </p>
        <p className="mt-2">
          With a 12-fiber ribbon cable, the same 288 fibers become 24 ribbons. A mass-fusion
          splicer fuses all 12 fibers in one ribbon simultaneously. At 2–3 minutes per ribbon
          cycle (alignment, splice, heat-shrink sleeve), 24 ribbons = roughly 1 hour total.
          The math makes ribbon the obvious choice for high-count feeder infrastructure where
          splice speed is an economic lever.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> ICEA S-87-640 specifies loose-tube buffer tube diameter
            tolerances, fiber count per tube limits, and gel viscosity requirements. The
            standard draws a clear line between loose-tube and tight-buffer as distinct
            construction categories.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> In practice, tight-buffer cable sometimes shows up in
            OSP applications incorrectly — usually when a contractor substitutes an indoor
            breakout cable for a short outdoor run because it was in stock. The cable won't
            fail overnight, but after a few years of temperature cycling it will develop
            excess attenuation on fibers under stress. If you see a cable that looks like a
            bundle of pencil leads instead of a multi-tube design, that's tight-buffer — and
            it probably shouldn't be in an outdoor splice closure.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk of confusing them:</strong> Specifying tight-buffer for an OSP
            application because it was cheaper or immediately available can result in fiber
            failures within 5–10 years, requiring expensive cable replacement on a buried or
            aerial plant.
          </p>
        </div>
      </section>

      {/* ── SIDE-BY-SIDE COMPARISON ──────────────────────────────────────── */}
      <SideBySide
        title="Loose-Tube vs. Ribbon — When to Use Which"
        leftLabel="Loose-Tube"
        rightLabel="Ribbon / Rollable Ribbon"
        rows={[
          {
            attribute: 'Splicing speed (per fiber)',
            left: 'Individual splice per fiber — slower on high-count cables',
            right: 'Mass-fusion: 12 fibers per cycle — ~12× faster on high-count',
          },
          {
            attribute: 'Field handling',
            left: 'Easy — gel or dry-block tubes; fibers are flexible individually',
            right: 'Standard ribbon is stiff and flat; rollable ribbon improves this significantly',
          },
          {
            attribute: 'Moisture migration risk',
            left: 'Gel-filled: gel blocks migration. Dry-block: SAP tape/yarn blocks it',
            right: 'Same gel/dry-block options apply inside the tube; ribbon matrix itself is not gel-filled',
          },
          {
            attribute: 'Fiber density',
            left: 'Good — up to 12 fibers per loose tube in a standard design',
            right: 'Higher — rollable ribbon doubles fiber density vs. loose individual fibers (OFS documentation)',
          },
          {
            attribute: 'Typical OSP use case',
            left: 'Distribution cables, drop cables, low-to-mid count feeder (12F–144F)',
            right: 'High-count feeder (144F–864F+), where splice-closure time is the constraint',
          },
          {
            attribute: 'Gel cleanup at splice?',
            left: 'Gel-filled: yes — requires isopropyl alcohol wipe. Dry-block: no cleanup',
            right: 'Same as loose-tube depending on tube fill method',
          },
        ]}
      />

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Rollable ribbon mechanical design</h3>
        <p>
          The key innovation in rollable ribbon is intermittent bonding: instead of a continuous
          matrix bond running the full length of the ribbon, the bonding agent is applied in
          patches spaced a few millimeters apart. Between patches, the individual fibers are
          free to move relative to each other. This allows the ribbon to curl into a round
          cross-section for storage in a circular tube, then unroll flat on the splice table
          for mass-fusion.
        </p>
        <p className="mt-2">
          From a practical standpoint, rollable ribbon has taken significant market share
          from both conventional ribbon and loose individual fibers in high-count feeder
          builds. A 432-fiber cable in rollable-ribbon construction can fit in a smaller
          conduit than the equivalent loose-tube design because the rollable-ribbon tubes
          pack more densely. (Source: OFS Optics AccuTube+ Rollable Ribbon documentation)
        </p>

        <h3 className="mt-5 font-semibold">Why tight-buffer survives in the industry</h3>
        <p>
          Tight-buffer isn't wrong — it's just context-specific. In an equipment room, a
          tight-buffer breakout cable is the right choice: each 900 µm fiber can be
          directly terminated with a standard LC or SC connector without requiring a fanout
          kit. The extra coating gives the fiber the mechanical durability to survive repeated
          patch-panel movements. For short indoor runs up to maybe 100 m, temperature variation
          is small enough that the stress concern is negligible. The problem is only when
          tight-buffer escapes its intended environment.
        </p>
      </section>

      {/* ── KEY TERMS FLASHCARDS ──────────────────────────────────────────── */}
      <Flashcard
        deckId="T03-L01"
        cards={[
          {
            id: 'T03-L01-fc-lt',
            front: 'What is a loose-tube cable construction?',
            back: 'Fibers float freely inside a gel-filled or dry-block polymer tube that is larger in inner diameter than the fiber bundle. The oversize tube provides slack that protects fibers from tensile and thermal stress. Standard construction for OSP trunk cables. (ICEA S-87-640)',
          },
          {
            id: 'T03-L01-fc-tb',
            front: 'What is a tight-buffer cable construction?',
            back: 'A secondary coating is pressed directly against the 250 µm primary coating, building each fiber up to 900 µm diameter. No free space around the fiber. Used primarily in indoor/premises cables; not the standard for OSP trunk runs. (FOA Reference Guide)',
          },
          {
            id: 'T03-L01-fc-ribbon',
            front: 'What is a ribbon cable construction and its key advantage?',
            back: 'Fibers are bonded side-by-side into a flat matrix (typically 12 fibers), enabling mass-fusion splicing of all fibers simultaneously. Dramatically faster splicing on high-count feeder cables compared to individual splice-per-fiber. (ICEA S-87-640; TIA-598-D)',
          },
          {
            id: 'T03-L01-fc-rollable',
            front: 'What is rollable ribbon and why was it developed?',
            back: 'A ribbon variant with intermittent bonding between fibers, allowing it to roll into a cylindrical form for storage and unroll flat for mass splicing. Combines loose-tube-like field handling with mass-splice speed and higher fiber density than loose individual fibers. (OFS Optics)',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ───────────────────────────────────────────────── */}
      <Quiz
        title="T03.L01 Check — Cable Construction Types"
        mode="multiple-choice"
        questions={[
          {
            id: 'T03-L01-Q1',
            type: 'mc',
            prompt:
              'A 144-fiber OSP trunk cable uses which primary construction type?',
            choices: [
              'Tight-buffer (each fiber individually coated to 900 µm)',
              'Loose-tube (fibers float in gel or dry-block buffer tubes)',
              'Figure-8 (fiber + messenger integrated in one jacket)',
              'Rollable ribbon only (no loose-tube option exists at 144F)',
            ],
            answerIndex: 1,
            explanation:
              'Loose-tube is the dominant OSP trunk cable construction. Fibers float freely in oversize buffer tubes, protecting them from tensile and thermal stress across the temperature range experienced outdoors. Tight-buffer is primarily for indoor/premises use. (Source: FOA Reference Guide to OSP design)',
          },
          {
            id: 'T03-L01-Q2',
            type: 'dragdrop',
            prompt:
              'Match each cable construction type to its key advantage.',
            items: [
              { id: 'lt',  label: 'Loose-tube' },
              { id: 'tb',  label: 'Tight-buffer' },
              { id: 'rib', label: 'Ribbon' },
              { id: 'rr',  label: 'Rollable ribbon' },
            ],
            targets: [
              { id: 'tlt',  label: 'Thermal and tensile protection for outdoor runs' },
              { id: 'ttb',  label: 'Direct fiber termination without fanout kit' },
              { id: 'trib', label: 'Mass-fusion splicing of 12 fibers per cycle' },
              { id: 'trr',  label: 'High fiber density with rollable handling' },
            ],
            correctMap: { tlt: 'lt', ttb: 'tb', trib: 'rib', trr: 'rr' },
            explanation:
              'Loose-tube: thermal/tensile slack protects OSP fibers. Tight-buffer: 900 µm OD allows direct termination. Ribbon: mass-fusion splicing is 12× faster per fiber on high-count cables. Rollable ribbon: combines density of ribbon with easier tube coiling — per OFS documentation "doubling fiber density" vs. loose fibers.',
          },
          {
            id: 'T03-L01-Q3',
            type: 'fill-in-blank',
            prompt:
              'In a loose-tube cable, the buffer tube\'s inner diameter is ________ than the fiber bundle to allow for slack.',
            answer: 'larger',
            answerDisplay: 'larger',
            explanation:
              'The intentional oversize of the buffer tube is the defining feature of loose-tube construction. That extra space — whether filled with gel or dry-block SAP tape — lets fibers move freely when the cable contracts in cold weather or bends during installation, preventing tensile stress on the glass. (ICEA S-87-640)',
          },
          {
            id: 'T03-L01-Q4',
            type: 'mc',
            prompt:
              'You are specifying cable for a 288-fiber feeder route where rapid splice closure is the highest priority. Which construction type provides the greatest splicing speed advantage?',
            choices: [
              'Loose-tube with gel-filled buffer tubes',
              'Tight-buffer breakout cable',
              'Ribbon or rollable ribbon with mass-fusion splicing',
              'Figure-8 self-supporting cable',
            ],
            answerIndex: 2,
            explanation:
              'Ribbon and rollable ribbon enable mass-fusion splicing — 12 fibers per splicer cycle. For 288 fibers: 24 ribbon cycles vs. 288 individual cycles with loose fiber. The time savings at a single splice closure can be 6–8 hours. This is the primary reason high-count feeder cables use ribbon construction. (ICEA S-87-640; TIA-598-D)',
          },
        ]}
      />

    </LessonLayout>
  );
}
