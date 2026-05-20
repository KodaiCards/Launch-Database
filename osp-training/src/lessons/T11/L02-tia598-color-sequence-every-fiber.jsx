// T11.L02 — TIA-598 Color Sequence — Every Fiber
// Working lesson: full 12-color mapping, fiber-within-tube arithmetic, APC/UPC connector colors
// Source: M07 §7.4 + TIA-598-D + net-new WorkedExample

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T11.L02',
  course_id: 'T11',
  title: 'TIA-598 Color Sequence — Every Fiber',
  order: 2,
  lesson_type: 'working',
  prerequisites: ['T11.L01'],
  learning_objectives: [
    'Map any fiber position number in a cable to its tube and fiber-within-tube identity using TIA-598 arithmetic',
    'Explain why UPC-to-APC mating is prohibited and what physical consequence it causes',
    'Identify the connector color convention: APC = green body, UPC = blue body',
    'Calculate fiber position arithmetic for cables up to 288F using the mod/div method',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'all 12 colors (Blue/Orange/Green/Brown/Slate/White/Red/Black/Yellow/Violet/Rose/Aqua)',
    'fiber-within-tube counting',
    'APC (Angle Physical Contact)',
    'UPC (Ultra Physical Contact)',
    'APC/UPC mating prohibition',
  ],
  key_terms: [
    {
      term: 'all 12 colors (Blue/Orange/Green/Brown/Slate/White/Red/Black/Yellow/Violet/Rose/Aqua)',
      definition:
        'The complete TIA-598-D 12-color sequence: 1-Blue, 2-Orange, 3-Green, 4-Brown, 5-Slate, 6-White, 7-Red, 8-Black, 9-Yellow, 10-Violet, 11-Rose, 12-Aqua. This sequence repeats for each successive buffer tube in the cable.',
    },
    {
      term: 'fiber-within-tube counting',
      definition:
        'The two-step arithmetic process for identifying any fiber in a multi-tube cable: Step 1 — divide the absolute fiber number by 12 to find the tube number (round up). Step 2 — find the remainder (fiber number minus (tube number − 1) × 12) to find the fiber position within that tube. Example: fiber 73 in a 144F cable → tube 7 (Red), fiber 1 (Blue) within tube 7.',
    },
    {
      term: 'APC (Angle Physical Contact)',
      definition:
        'A fiber optic connector with an 8° angled end-face polish. The angled polish causes back-reflections to exit the fiber core at an angle (rather than returning toward the source), achieving return loss ≥60 dB. APC connectors are color-coded GREEN by TIA-598-D convention. Used in high-performance PON and CATV applications where back-reflection causes significant signal degradation.',
    },
    {
      term: 'UPC (Ultra Physical Contact)',
      definition:
        'A fiber optic connector with a flat (0°) polished end-face, but with an ultra-smooth polish finish that achieves very low insertion loss. UPC connectors are color-coded BLUE by TIA-598-D convention. Standard connector for most telecom and data applications. Return loss typically ≥55 dB.',
    },
    {
      term: 'APC/UPC mating prohibition',
      definition:
        'APC and UPC connectors MUST NOT be mated together. Physical reason: the 8° angled end-face of the APC, when forced against the flat end-face of a UPC, creates an air gap and severe angular misalignment, causing insertion loss of 3–5 dB and potential physical damage to both ferrules. The green (APC) vs. blue (UPC) color convention is the physical safeguard against accidental mismating.',
    },
  ],
  vocabulary_assumed: [
    { term: 'TIA-598 color sequence', source_lesson_id: 'T11.L01' },
    { term: 'tube-within-tube system', source_lesson_id: 'T11.L01' },
    { term: 'buffer tube', source_lesson_id: 'T01.L03' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T11L02_TIA598ColorSequenceEveryFiber() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Remember from <strong>T11.L01, the TIA-598 color sequence</strong> — Blue through Aqua in positions 1-12. This lesson applies that sequence to the tube-within-tube arithmetic you'll do every day on multi-fiber cables.
        </p>
        <p>
          In the last lesson you learned that fibers are colored 1–12 (Blue through Aqua) and
          that tubes in a multi-tube cable follow the same sequence. Now let's turn that into
          a math skill you can use in the field without a calculator: given any fiber number,
          tell me exactly which tube and which fiber-within-tube it is.
        </p>
        <p className="mt-2">
          We'll also cover one important connector convention that TIA-598-D defines: APC
          connectors are green, UPC connectors are blue — and you must never accidentally
          mate them together.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T11-L02"
            cards={[
              {
                id: 'T11-L02-fc-colors',
                front: 'Write out the complete TIA-598 color sequence from position 1 to 12.',
                back: '1-Blue, 2-Orange, 3-Green, 4-Brown, 5-Slate, 6-White, 7-Red, 8-Black, 9-Yellow, 10-Violet, 11-Rose, 12-Aqua.',
              },
              {
                id: 'T11-L02-fc-apc',
                front: 'What is APC and what color is an APC connector?',
                back: 'APC = Angle Physical Contact. The connector end-face is polished at 8° to deflect back-reflections out of the fiber core. APC connectors are GREEN per TIA-598-D. Return loss ≥60 dB. Used in PON, CATV, and high-performance fiber applications.',
              },
              {
                id: 'T11-L02-fc-upc',
                front: 'What is UPC and what color is a UPC connector?',
                back: 'UPC = Ultra Physical Contact. The connector end-face is flat but ultra-smooth polished. UPC connectors are BLUE per TIA-598-D. Return loss ≥55 dB. Standard for most telecom and data applications.',
              },
              {
                id: 'T11-L02-fc-mating',
                front: 'Why is APC-to-UPC mating prohibited?',
                back: 'The 8° angled end-face of the APC creates an air gap and severe angular misalignment when mated against the flat UPC end-face. This causes 3–5 dB insertion loss and can physically damage both ferrule end-faces. Green vs. blue color coding prevents accidental mismating.',
              },
              {
                id: 'T11-L02-fc-arithmetic',
                front: 'How do you find the tube and fiber-within-tube for any fiber position number?',
                back: 'Step 1: Tube number = ⌈position ÷ 12⌉ (round up). Step 2: fiber-within-tube = position − (tube − 1) × 12. Example: fiber 73 → tube 7 (Red), fiber 1 (Blue) because 73 ÷ 12 = 6.08 → tube 7; 73 − 72 = 1 → Blue.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Fiber-Within-Tube Arithmetic</h2>

        <div className="p-4 mb-6 rounded-lg border border-blue-400/30 bg-blue-400/5">
          <h3 className="font-semibold text-blue-300 mb-2">Quick Refresher — Key Terms</h3>
          <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
            <li><strong>Buffer tube:</strong> The protective plastic tube inside the cable that holds up to 12 fibers and protects them from mechanical damage during installation.</li>
            <li><strong>Tube-within-tube system:</strong> TIA-598-D extension for cables with >12 fibers: tubes themselves are colored 1-12, and fibers within each tube are also colored 1-12.</li>
          </ul>
        </div>

        <p>
          The arithmetic follows a simple pattern. Tubes hold 12 fibers each. To find
          which tube a fiber lives in, divide the fiber number by 12 and round up. To find
          its position within the tube, subtract the positions consumed by all prior tubes.
        </p>

        {/* WorkedExample — fiber position in 144F cable */}
        <div className="mt-4">
          <WorkedExample
            id="T11-L02-we-fiber-position"
            title="Which tube and fiber-within-tube is fiber 73 in a 144-fiber cable?"
            variables={[
              { symbol: 'N', value: '73', unit: '', description: 'Absolute fiber number we want to identify' },
              { symbol: 'fibers_per_tube', value: '12', unit: 'fibers/tube', description: 'TIA-598-D tube capacity (standard 12F tubes)' },
            ]}
            steps={[
              {
                label: 'Step 1 — Find the tube number',
                expression: 'tube = ⌈N ÷ fibers_per_tube⌉ = ⌈73 ÷ 12⌉',
                result: '⌈6.083⌉ = 7',
                note: 'Round UP to the next whole number. Fiber 73 is in tube 7.',
              },
              {
                label: 'Step 2 — Find the fiber position within the tube',
                expression: 'position_in_tube = N − (tube − 1) × 12 = 73 − (7−1) × 12',
                result: '73 − 72 = 1',
                note: 'Tubes 1–6 consume positions 1–72. Fiber 73 is the FIRST fiber in tube 7.',
              },
              {
                label: 'Step 3 — Name the tube color and fiber color',
                expression: 'Tube 7 = Red (7th color in TIA-598 sequence). Position 1 in tube = Blue (1st color).',
                result: 'Fiber 73 = Red tube, Blue fiber',
                note: 'Sanity check: Tube 7 covers positions 73–84. Fiber 73 is the first, so position 1 (Blue) makes sense.',
              },
            ]}
            sanityCheck="Red tube, Blue fiber = fiber 73. Double-check: 7 tubes before this one × 12 fibers each = 72 fibers. Fiber 73 must be the 1st (Blue) fiber in tube 7 (Red). ✓"
          />
        </div>

        <div className="mt-6">
          <WorkedExample
            id="T11-L02-we-fiber-position-2"
            title="Which tube and fiber is fiber 107 in a 144-fiber cable?"
            variables={[
              { symbol: 'N', value: '107', unit: '', description: 'Absolute fiber number' },
              { symbol: 'fibers_per_tube', value: '12', unit: 'fibers/tube', description: 'Standard 12F tube capacity' },
            ]}
            steps={[
              {
                label: 'Step 1 — Find the tube number',
                expression: 'tube = ⌈107 ÷ 12⌉ = ⌈8.917⌉',
                result: '9',
                note: 'Fiber 107 is in tube 9.',
              },
              {
                label: 'Step 2 — Find position within tube',
                expression: 'position = 107 − (9−1) × 12 = 107 − 96',
                result: '11',
                note: 'Position 11 within tube 9.',
              },
              {
                label: 'Step 3 — Name the colors',
                expression: 'Tube 9 = Yellow (9th color). Position 11 = Rose (11th color).',
                result: 'Fiber 107 = Yellow tube, Rose fiber',
                note: 'Tube 9 covers fibers 97–108. 107 − 96 = 11. Rose is position 11 in the sequence. ✓',
              },
            ]}
            sanityCheck="Yellow tube (position 9), Rose fiber (position 11) = absolute fiber 107. The arithmetic says tubes 1-8 cover fibers 1-96 (8 × 12 = 96). Fiber 107 is position 11 within tube 9. ✓"
          />
        </div>

        <h3 className="mt-6 font-semibold">APC vs. UPC connectors — the color safeguard</h3>
        <p>
          When you see a green-bodied connector, that's an APC. When you see a blue-bodied
          connector, that's a UPC. TIA-598-D uses these colors specifically as a physical
          mismating guard.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Connector type</th>
                <th className="px-3 py-2 text-left">Body color</th>
                <th className="px-3 py-2 text-left">End-face angle</th>
                <th className="px-3 py-2 text-left">Return loss (typical)</th>
                <th className="px-3 py-2 text-left">Common application</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold text-green-400">APC</td>
                <td className="px-3 py-2 text-green-400">Green</td>
                <td className="px-3 py-2">8° angled</td>
                <td className="px-3 py-2">≥60 dB</td>
                <td className="px-3 py-2">PON (GPON/XGS-PON), CATV, RF-over-fiber</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold text-blue-400">UPC</td>
                <td className="px-3 py-2 text-blue-400">Blue</td>
                <td className="px-3 py-2">0° flat</td>
                <td className="px-3 py-2">≥55 dB</td>
                <td className="px-3 py-2">Data, voice, most telecom applications</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-sm">
          <strong>⚠ Never mate APC to UPC.</strong> The 8° angle of the APC end-face creates a
          physical gap when pressed against a flat UPC ferrule. Result: 3–5 dB insertion loss
          (where you expect ≤0.3 dB) and potential physical damage to both ferrules. The
          green/blue color difference is your safeguard — respect it.
        </p>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T11-L02-quiz-1"
            questions={[
              {
                id: 'q1',
                type: 'multiple-choice',
                text: 'A 144F cable has 12 buffer tubes with 12 fibers each. A technician needs to splice to fiber number 86. Which tube (and what tube color) and which fiber position (and what fiber color) is fiber 86?',
                options: [
                  { id: 'a', text: 'Tube 7 (Red), fiber 12 (Aqua)' },
                  { id: 'b', text: 'Tube 8 (Black), fiber 2 (Orange)' },
                  { id: 'c', text: 'Tube 8 (Black), fiber 1 (Blue)' },
                  { id: 'd', text: 'Tube 7 (Red), fiber 1 (Blue)' },
                ],
                correctId: 'b',
                explanation: 'Step 1: ⌈86 ÷ 12⌉ = ⌈7.17⌉ = tube 8 (Black). Step 2: 86 − (8−1) × 12 = 86 − 84 = 2 → position 2 = Orange fiber. Fiber 86 = Black tube, Orange fiber. Sanity check: Tube 8 covers fibers 85-96. Fiber 86 is the second (Orange) in tube 8. ✓',
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                text: 'A technician finds a green-bodied SC connector in a patch panel. A customer-provided blue-bodied SC connector needs to be mated to it. What should happen?',
                options: [
                  { id: 'a', text: 'Mate them — both are SC connectors so they are physically compatible' },
                  { id: 'b', text: 'Do not mate them — the green connector is APC, the blue is UPC, and mating them causes 3-5 dB insertion loss and possible physical damage' },
                  { id: 'c', text: 'Mate them temporarily to test, then replace with matching connectors' },
                  { id: 'd', text: 'The colors are for aesthetics only; mating is safe regardless of color' },
                ],
                correctId: 'b',
                explanation: 'Green = APC (8° angled end-face). Blue = UPC (flat end-face). Mating APC to UPC creates a severe angular misalignment at the ferrule interface, causing 3–5 dB insertion loss and potential physical damage to both ferrules. The green/blue color convention per TIA-598-D exists specifically to prevent this. Stop and procure matching connector types.',
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                text: 'What is the return loss advantage of an APC connector over a UPC connector, and why does it matter for GPON systems?',
                options: [
                  { id: 'a', text: 'APC has lower insertion loss (0.1 dB vs. 0.3 dB); GPON needs low insertion loss to reach ONTs at extended distances' },
                  { id: 'b', text: 'APC has higher return loss (≥60 dB vs. ≥55 dB); GPON uses RF wavelengths that are sensitive to back-reflections disrupting the OLT laser' },
                  { id: 'c', text: 'APC and UPC have the same return loss; APC is used in GPON only because of the color convention' },
                  { id: 'd', text: 'APC has higher return loss (≥60 dB vs. ≥55 dB); the 5 dB advantage prevents back-reflection from damaging the fiber end-face' },
                ],
                correctId: 'b',
                explanation: 'APC achieves ≥60 dB return loss vs. ≥55 dB for UPC — a 5 dB improvement in suppressing back-reflections. GPON OLTs are laser-based and the returning optical power from a low-return-loss connector can cause laser instability, noise, and bit errors at the OLT receiver. GPON and CATV systems mandate APC for this reason. The 8° angle deflects back-reflections out of the fiber core entirely rather than sending them back toward the source.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Extending to 288F, 432F, and Beyond</h2>
        <p>
          For cables with more than 144 fibers, the TIA-598-D system uses binder grouping:
          each group of 12 tubes is wrapped in a binder with its own color code, and then the
          sequence repeats. A 288F cable has two binder groups of 12 tubes each. Fiber
          identification requires three steps: (1) binder group, (2) tube within group,
          (3) fiber within tube.
        </p>
        <p className="mt-2">
          Some manufacturers also add a stripe to differentiate second-round tubes — a Blue tube
          with a stripe means it's tube 13 (second occurrence of Blue), not tube 1. The
          manufacturer's data sheet specifies the identification scheme. Always consult the
          data sheet for cables above 144F before beginning splice work.
        </p>

        <h3 className="mt-4 font-semibold">Ribbon fiber color coding</h3>
        <p>
          TIA-598-D also defines fiber positions in ribbon cables. A 12-fiber ribbon has
          12 fibers side by side, numbered 1–12 following the same color sequence. For a
          144-fiber ribbon cable (12 ribbons of 12 fibers), the ribbon number identifies the
          group and the fiber-within-ribbon identifies the individual fiber. The arithmetic is
          identical to the loose-tube calculation.
        </p>
        <p className="mt-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-200 text-sm">
          <strong>Advanced context:</strong> In a mass fusion ribbon splice, all 12 fibers in
          a ribbon are spliced simultaneously. The splicer aligns all 12 at once and applies a
          single arc. TIA-598-D's consistent color-to-position mapping is what makes this
          reliable — if fibers were randomly colored, the mass-fusion alignment would require
          manual sort-and-verify before every splice, defeating the productivity advantage.
          The standard pays dividends in ribbon work.
        </p>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          This lesson builds on:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T11.L01</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T11.L01</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T01.L03</strong> — Part of the broader OSP workflow.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Each step in the OSP process feeds into the next — understanding these connections strengthens your grasp of the whole system.
        </p>
      </section>
    </LessonLayout>
  );
}
