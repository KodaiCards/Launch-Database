// T11.L01 — Why We Color-Code Fibers
// Foundation lesson: TIA-598 system concept, 12-color sequence, mnemonic, color-blind accommodation
// Source: M07 §7.4 (migrated + expanded) | TIA-598-D

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T11.L01',
  course_id: 'T11',
  title: 'Why We Color-Code Fibers',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L03', 'T01.L04', 'T03.L01'],
  learning_objectives: [
    'Recite the 12-color TIA-598 sequence in order from position 1 to position 12',
    'Explain the field mnemonic used to remember the color sequence without looking it up',
    'Describe how a color-blind crew member safely identifies fibers using position counting and tube sequencing instead of hue',
    'Explain the tube-within-tube color system and how it extends to cables with more than 12 fibers',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'TIA-598 color sequence',
    '12-color system',
    'mnemonic',
    'color-blind crew accommodation',
    'tube-within-tube system',
  ],
  key_terms: [
    {
      term: 'TIA-598 color sequence',
      definition:
        'The Telecommunications Industry Association standard (TIA-598-D) that defines a 12-color system for identifying individual optical fibers within a cable. The 12 colors in order are: Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua. Every fiber plant uses this sequence — it is the universal language of fiber identification.',
    },
    {
      term: '12-color system',
      definition:
        'The TIA-598-D scheme where fibers are assigned a color based on their position number: fiber 1 = Blue, fiber 2 = Orange, fiber 3 = Green, fiber 4 = Brown, fiber 5 = Slate, fiber 6 = White, fiber 7 = Red, fiber 8 = Black, fiber 9 = Yellow, fiber 10 = Violet, fiber 11 = Rose, fiber 12 = Aqua. The sequence repeats in subsequent buffer tubes for cables with more than 12 fibers.',
    },
    {
      term: 'mnemonic',
      definition:
        'A memory device that helps you recall a sequence. The most common field mnemonic for the TIA-598 color sequence is "BROther OG\'s BRown Slaw Wins, Roads Block Yellow Violins, RoAce" — each word or syllable cues the next color. Different crews use slightly different versions; any reliable version that sticks in your head is acceptable.',
    },
    {
      term: 'color-blind crew accommodation',
      definition:
        'The field practice for crew members with color vision deficiency: instead of relying on hue identification, use position counting (fiber 1 is always at the reference position in the V-groove holder) and tube sequencing (tube 1 is always the first tube encountered when unrolling from the reference point on the cable). Position counting is 100% reliable regardless of color vision.',
    },
    {
      term: 'tube-within-tube system',
      definition:
        'The TIA-598-D extension for cables with more than 12 fibers. Each buffer tube holds up to 12 fibers (colored 1-12 within that tube). The tubes themselves are also colored using the same 12-color sequence. Fiber identification therefore requires two steps: (1) identify the tube color/position, then (2) identify the fiber color/position within that tube.',
    },
  ],
  vocabulary_assumed: [
    { term: 'buffer tube', source_lesson_id: 'T01.L03' },
    { term: 'fiber', source_lesson_id: 'T01.L03' },
    { term: 'loose-tube', source_lesson_id: 'T03.L01' },
    { term: 'ribbon', source_lesson_id: 'T03.L01' },
    { term: 'TIA-598-D', source_lesson_id: 'T03.L01' },
    { term: 'splice tray', source_lesson_id: 'T01.L04' },
    { term: 'splice case', source_lesson_id: 'T01.L04' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T11L01_WhyWeColorCodeFibers() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Imagine opening a 144-fiber cable at a splice case. Inside are 144 individual glass
          strands, each thinner than a human hair. You need to connect fiber 37 from this cable
          to fiber 37 from the cable coming in from the other direction — without connecting the
          wrong ones. Get it wrong and you've spent hours in a manhole making an expensive mess.
        </p>
        <p className="mt-2">
          The color code is what makes this possible. Every fiber in every cable you'll ever
          touch in North America follows the same 12-color sequence defined by TIA-598-D. The
          colors repeat across buffer tubes in a predictable pattern. Know the sequence, and you
          can identify any fiber in any cable by counting colors — no label printer needed.
        </p>
        <p className="mt-2">
          This lesson teaches the sequence, the mnemonic that keeps it in your head, and the
          position-counting technique that lets a color-blind crew member work just as safely as
          anyone else.
        </p>

        <p className="text-slate-400 text-sm mb-3 mt-6 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Recall from <strong>T01.L03 Cable Construction</strong> — a buffer tube is the protective layer that wraps individual optical fibers inside the cable sheath. The TIA-598 color code applies to fibers within each buffer tube, making it the key to identifying fibers once you've opened the cable.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
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
              <td className="px-3 py-2 font-mono">TIA</td>
              <td className="px-3 py-2">Telecommunications Industry Association</td>
              <td className="px-3 py-2">The standards body that publishes TIA-598 (color coding), TIA-568 (structured cabling), and many other telecom standards</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">TIA-598-D</td>
              <td className="px-3 py-2">Optical Fiber Cable Color Coding</td>
              <td className="px-3 py-2">The specific TIA standard that defines the 12-color sequence. "-D" is the current revision. This is THE authoritative source for fiber color coding in North America.</td>
            </tr>
          </tbody>
        </table>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T11-L01"
            cards={[
              {
                id: 'T11-L01-fc-tia598',
                front: 'What is the TIA-598 color sequence and what standard defines it?',
                back: 'TIA-598-D defines 12 colors in order: Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua. This sequence is the universal language for fiber identification in North America — every OSP cable you will ever touch follows it.',
              },
              {
                id: 'T11-L01-fc-12color',
                front: 'What are the 12 TIA-598 colors in order from position 1 to position 12?',
                back: '1-Blue, 2-Orange, 3-Green, 4-Brown, 5-Slate, 6-White, 7-Red, 8-Black, 9-Yellow, 10-Violet, 11-Rose, 12-Aqua. Mnemonic: "Big Orange Gorillas Browse Slowly While Reading Books — You\'re Very Relaxed Always"',
              },
              {
                id: 'T11-L01-fc-mnemonic',
                front: 'What is a mnemonic for the TIA-598 color sequence?',
                back: 'One common version: "Big Orange Gorillas Browse Slowly While Reading Books — You\'re Very Relaxed Always" (Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua). Any reliable version your crew uses consistently is acceptable.',
              },
              {
                id: 'T11-L01-fc-colorblind',
                front: 'How does a color-blind crew member safely identify fibers without relying on hue?',
                back: 'Position counting: fiber 1 is always at the reference position in the V-groove holder; tube 1 is always the first tube encountered at the cable reference point. Position counting is 100% reliable regardless of color vision and is the professional backup method even for crew members with full color vision.',
              },
              {
                id: 'T11-L01-fc-tube-within-tube',
                front: 'What is the tube-within-tube color system?',
                back: 'For cables with more than 12 fibers, each buffer tube holds up to 12 fibers (colored 1-12 within the tube), and the tubes themselves are colored using the same 12-color sequence. To identify fiber 23: tube 2 (Orange tube), fiber 11 (Rose fiber within that tube).',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The 12-Color Sequence</h2>
        <p>
          The TIA-598-D sequence is: <strong>Blue → Orange → Green → Brown → Slate → White →
          Red → Black → Yellow → Violet → Rose → Aqua</strong>. Twelve colors, in that exact
          order. Every time you open a buffer tube, you'll see the fibers arranged in that
          sequence starting from position 1 (Blue).
        </p>

        <h3 className="mt-4 font-semibold">The mnemonic — pick one and stick with it</h3>
        <p>
          Experienced splicers don't look up the color order; they know it cold from repetition.
          A mnemonic accelerates that learning. Here's one version that's widely taught:
        </p>
        <div className="mt-3 p-4 bg-slate-800/60 border border-slate-600/40 rounded-lg font-mono text-sm">
          <p className="text-slate-200 font-bold">B-O-G-B-S-W | R-B-Y-V-R-A</p>
          <p className="mt-2 text-slate-300">
            <span className="text-blue-400">B</span>ig{' '}
            <span className="text-orange-400">O</span>range{' '}
            <span className="text-green-400">G</span>orillas{' '}
            <span className="text-yellow-700">B</span>rowse{' '}
            <span className="text-slate-400">S</span>lowly{' '}
            <span className="text-white">W</span>hile{' '}
            <span className="text-red-400">R</span>eading{' '}
            <span className="text-gray-900 bg-white rounded px-1">B</span>ooks —{' '}
            <span className="text-yellow-400">Y</span>ou're{' '}
            <span className="text-violet-400">V</span>ery{' '}
            <span className="text-pink-400">R</span>elaxed{' '}
            <span className="text-cyan-400">A</span>lways
          </p>
          <p className="mt-2 text-slate-400 text-xs">
            Blue · Orange · Green · Brown · Slate · White · Red · Black · Yellow · Violet · Rose · Aqua
          </p>
        </div>
        <p className="mt-3 text-slate-400 text-sm">
          Different crews use slightly different versions. Whatever version your shop uses
          consistently is the right one — consistency prevents errors.
        </p>

        {/* AnnotatedDiagram — color tube/fiber map */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">TIA-598 Color Position Map</h3>
          <AnnotatedDiagram
            imageUrl={null}
            alt="TIA-598 12-color fiber position diagram"
            width={700}
            height={300}
            annotations={[
              { id: 'c1', x: 60, y: 60, label: '1 — Blue', description: 'Position 1. Blue fiber. The reference fiber and starting point for all counting. In any buffer tube, Blue is always position 1.' },
              { id: 'c2', x: 130, y: 60, label: '2 — Orange', description: 'Position 2. Orange fiber. Immediately clockwise (or next in sequence) after Blue.' },
              { id: 'c3', x: 200, y: 60, label: '3 — Green', description: 'Position 3. Green fiber. Note: do not confuse Green fiber with Green connector (APC connector), which is a different thing taught in L02.' },
              { id: 'c4', x: 270, y: 60, label: '4 — Brown', description: 'Position 4. Brown fiber. A darker, warm-toned color — not to be confused with Orange (position 2).' },
              { id: 'c5', x: 340, y: 60, label: '5 — Slate', description: 'Position 5. Slate fiber. A medium gray. Distinct from Black (position 8) — Slate is lighter.' },
              { id: 'c6', x: 410, y: 60, label: '6 — White', description: 'Position 6. White fiber. Sometimes the hardest to see in a dirty field environment — keep splice areas clean.' },
              { id: 'c7', x: 60, y: 180, label: '7 — Red', description: 'Position 7. Red fiber. This is the second half of the sequence. Red = 7 is a reliable anchor point: if you\'re at Red, you\'re at position 7.' },
              { id: 'c8', x: 130, y: 180, label: '8 — Black', description: 'Position 8. Black fiber. Darker than Slate (position 5). In high-fiber-count cables, Black fibers are common because the sequence repeats across multiple tubes.' },
              { id: 'c9', x: 200, y: 180, label: '9 — Yellow', description: 'Position 9. Yellow fiber. Bright and distinctive — hard to confuse with other colors.' },
              { id: 'c10', x: 270, y: 180, label: '10 — Violet', description: 'Position 10. Violet (purple) fiber.' },
              { id: 'c11', x: 340, y: 180, label: '11 — Rose', description: 'Position 11. Rose (pink) fiber. Lighter than Violet, distinct from Red.' },
              { id: 'c12', x: 410, y: 180, label: '12 — Aqua', description: 'Position 12. Aqua (light blue/teal) fiber. The last position in the 12-count. Distinguishable from Blue (position 1) by its greenish-blue tint vs. pure blue.' },
            ]}
          />
          <p className="text-sm text-slate-400 mt-2">
            Source: TIA-598-D Optical Fiber Cable Color Coding. Color positions are the same in every North American OSP cable.
          </p>
        </div>

        <h3 className="mt-6 font-semibold">How the tube-within-tube system works</h3>
        <p>
          A 12-fiber cable has one buffer tube with 12 fibers inside. Easy. But a 144-fiber
          cable has 12 buffer tubes, each containing 12 fibers. How do you know which fiber
          is which?
        </p>
        <p className="mt-2">
          The tube color tells you which group of 12 you're in. The fiber color within the
          tube tells you the position within that group. The tubes follow the SAME 12-color
          sequence as the fibers:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Tube</th>
                <th className="px-3 py-2 text-left">Tube color</th>
                <th className="px-3 py-2 text-left">Fiber positions in this tube</th>
                <th className="px-3 py-2 text-left">Example: fiber 37</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              {[
                ['1', 'Blue', '1–12', '—'],
                ['2', 'Orange', '13–24', '—'],
                ['3', 'Green', '25–36', '—'],
                ['4', 'Brown', '37–48', 'Fiber 37 = Brown tube, Blue fiber (position 1 within tube 4)'],
                ['5', 'Slate', '49–60', '—'],
                ['6', 'White', '61–72', '—'],
                ['7', 'Red', '73–84', '—'],
                ['8', 'Black', '85–96', '—'],
                ['9', 'Yellow', '97–108', '—'],
                ['10', 'Violet', '109–120', '—'],
                ['11', 'Rose', '121–132', '—'],
                ['12', 'Aqua', '133–144', '—'],
              ].map(([tube, color, range, note]) => (
                <tr key={tube} className={`border-t border-white/10 ${note !== '—' ? 'bg-amber-900/20' : ''}`}>
                  <td className="px-3 py-2">{tube}</td>
                  <td className="px-3 py-2">{color}</td>
                  <td className="px-3 py-2">{range}</td>
                  <td className="px-3 py-2 text-amber-300 text-xs">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-slate-300">
          <strong>Fiber 37:</strong> Which tube? Tube 4 (Brown). Which position within tube
          4? Position 1 (37 − 36 = 1). So fiber 37 = Brown tube, Blue fiber. Check: tube 4
          covers positions 37–48. Position 37 = first fiber in tube 4 = Blue. ✓
        </p>

        <h3 className="mt-6 font-semibold">Color-blind accommodation — position counting</h3>
        <p>
          Red-green color deficiency affects roughly 8% of men. In a splice crew, that's
          statistically at least one person in any reasonable crew size. Color-blind crew
          members are not disqualified from splice work — they use position counting.
        </p>
        <p className="mt-2">
          <strong>Position counting rule:</strong> every buffer tube has a reference mark (a
          thin stripe, a slightly stiffer fiber, or the manufacturer's declared reference
          position at the factory). Position 1 (Blue) is the reference. Count clockwise from
          the reference. Fiber 1 = 0 positions from reference. Fiber 7 = 6 positions clockwise.
          No hue required.
        </p>
        <p className="mt-2">
          <strong>Tube sequencing rule:</strong> the tubes themselves follow the 12-color
          sequence starting at the reference mark on the cable's interior. Tube 1 (Blue) is
          always the tube immediately at the reference mark. Count clockwise for subsequent
          tubes. Same principle, no color reading required.
        </p>
        <p className="mt-2 p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
          <strong>Field practice:</strong> even crew members with full color vision use position
          counting as a verification step, not just those with color deficiency. Colors can
          fade, get dirty, or be ambiguous (Rose vs. Red, Slate vs. Black) in poor light.
          Count to verify — never rely on color alone when the stakes are high.
        </p>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T11-L01-quiz-1"
            questions={[
              {
                id: 'q1',
                type: 'drag-match',
                text: 'Match each fiber position number to its TIA-598 color name.',
                pairs: [
                  { left: 'Position 1', right: 'Blue' },
                  { left: 'Position 5', right: 'Slate' },
                  { left: 'Position 7', right: 'Red' },
                  { left: 'Position 9', right: 'Yellow' },
                  { left: 'Position 12', right: 'Aqua' },
                ],
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                text: 'A crew member with red-green color deficiency cannot distinguish Slate from Black fibers by hue. Which method allows them to correctly identify fiber positions without relying on color vision?',
                options: [
                  { id: 'a', text: 'Ask a colleague to verbally identify each fiber color' },
                  { id: 'b', text: 'Count fiber positions from the reference point in the buffer tube instead of reading color' },
                  { id: 'c', text: 'Use a different cable standard that codes by stripe pattern instead of color' },
                  { id: 'd', text: 'Skip fibers that are ambiguous and only splice the ones with clear colors' },
                ],
                correctId: 'b',
                explanation: 'Position counting from the reference mark is the professional standard for color-blind accommodation. Every buffer tube has a defined reference position (position 1 = Blue). Counting clockwise from that position gives an unambiguous fiber identity regardless of color vision. This is also used as a verification step by crew members with normal color vision — color alone is not reliable in poor light or on aged/dirty fiber.',
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                text: 'In a 144-fiber loose-tube cable with 12 buffer tubes of 12 fibers each, what is the identity of fiber number 85?',
                options: [
                  { id: 'a', text: 'Tube 7 (Red), fiber 1 (Blue) within that tube' },
                  { id: 'b', text: 'Tube 8 (Black), fiber 1 (Blue) within that tube' },
                  { id: 'c', text: 'Tube 8 (Black), fiber 12 (Aqua) within that tube' },
                  { id: 'd', text: 'Tube 7 (Red), fiber 12 (Aqua) within that tube' },
                ],
                correctId: 'b',
                explanation: 'Tube 8 covers fibers 85–96 (tubes 1-7 cover positions 1-84: 7 × 12 = 84). Fiber 85 is the FIRST fiber in tube 8 → position 1 within that tube → Blue fiber. So: Black tube (tube 8), Blue fiber (position 1). The arithmetic: 85 − 84 = 1 → position 1 within tube 8.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Book vs. Field: When Color Coding Gets Ambiguous</h2>
        <h3 className="mt-4 font-semibold">The book standard</h3>
        <p>
          TIA-598-D specifies the 12-color sequence and requires that each color be distinct
          from every other color under normal illumination. The standard also covers ribbon
          fiber matrices (each fiber position in a 12-fiber ribbon has a designated color),
          optical connectors (APC = green, UPC = blue — covered in L02), and buffer tube
          identification for multi-tube cables.
        </p>

        <h3 className="mt-4 font-semibold">Field reality: aged cables, poor lighting, gel contamination</h3>
        <p>
          After years in the field — especially in buried gel-filled cables — fiber coatings
          can discolor. Slate (5) can look like Black (8). Rose (11) can look like Red (7) or
          Violet (10) under a headlamp in a manhole. Buffer gel contamination makes everything
          look like a brownish smear.
        </p>
        <p className="mt-2">
          Experienced splicers use color AND position for every identification. They clean the
          fiber, note the color, then count from the reference mark to verify. If the color
          and position count agree → proceed. If they disagree → stop and re-verify before
          making any splice.
        </p>

        <h3 className="mt-4 font-semibold">Non-standard cable exceptions</h3>
        <p>
          Not all cables follow TIA-598. Older cables may use numbering rings on bare fibers
          instead of color, or a proprietary identification system from an international
          manufacturer. Military-specification fiber may use completely different color systems.
          When you open an unfamiliar cable, check the manufacturer's data sheet BEFORE assuming
          TIA-598 applies. A splice based on a wrong color assumption in a non-TIA-598 cable
          will cross-connect fibers and cause outages.
        </p>
        <p className="mt-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-200 text-sm">
          <strong>Professional practice:</strong> on any unfamiliar cable plant (acquired from
          another carrier, inherited with a property, or from a legacy network), trace one
          complete tube with a light source before splicing. Inject a visible light at position
          1 of the source cable, confirm the fiber that illuminates at the destination matches
          what the color sequence predicts. If it doesn't, you have a non-standard or
          mis-labeled cable. Document it before you touch anything.
        </p>
      </section>

    </LessonLayout>
  );
}
