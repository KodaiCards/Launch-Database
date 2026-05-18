import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T21.L04',
  course_id: 'T21',
  title: 'Cable Preparation & Termination: Field Strip, Cleave, Connector Attach',
  order: 4,
  lesson_type: 'cert-prep',
  prerequisites: ['T21.L02', 'T03.L01'],
  learning_objectives: [
    'Execute proper cable-end preparation (jacket stripping, buffer removal, cleaving)',
    'Apply termination methods: mechanical connectors vs. fusion-spliced pigtails',
    'Identify common defects in cable prep and termination quality',
    'Understand connector types (LC, SC, MU) and their field-install requirements',
    'Apply quality-control checks during field termination work',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'Cable jacket stripping',
    'Buffer removal',
    'Cleaving (fiber end preparation)',
    'Mechanical connector',
    'Pigtail termination',
    'Connector polish (endface quality)',
    'Return loss (connector quality metric)',
  ],
  vocabulary_assumed: [
    { term: 'buffer tube', source_lesson_id: 'T01.L03' },
    { term: 'fiber stripping', source_lesson_id: 'T04.L01' },
    { term: 'splice', source_lesson_id: 'T11.L02' },
    { term: 'fusion splicer', source_lesson_id: 'T11.L02' },
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T21L04_CableTermination() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          You've pulled fiber through conduit and spliced it at splice cases. Now the fiber arrives
          at an equipment building. It has to connect to an optical receiver or a patch panel. The
          connection happens in one of two ways: (1) a mechanical connector pushed onto the fiber end,
          or (2) a fusion-spliced pigtail (a short pre-terminated patch cord fused to the end of the
          main cable). Both require careful prep and quality control in the field.
        </p>

        <h3 className="mt-4 font-semibold">Why proper prep matters</h3>
        <p className="mt-2">
          A sloppy cable-end means high loss or a broken connection. Loss comes from air gaps, misaligned
          fiber, or a scratched endface. A broken connection happens if the fiber breaks during stripping
          or the connector fails under tension. This lesson covers the steps to prevent both.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">Meaning</th>
              <th className="px-3 py-2 text-left">In the field</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">LC</td>
              <td className="px-3 py-2">Lucent Connector</td>
              <td className="px-3 py-2">Small, snap-in fiber connector. OSP standard for FTTH equipment.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SC</td>
              <td className="px-3 py-2">Subscriber Connector</td>
              <td className="px-3 py-2">Larger push-pull fiber connector. Less common in modern OSP but still in legacy equipment.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RL</td>
              <td className="px-3 py-2">Return Loss</td>
              <td className="px-3 py-2">Measure of endface quality (dB). Higher = better. OSP standard ≥45 dB.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IEC</td>
              <td className="px-3 py-2">International Electrotechnical Commission</td>
              <td className="px-3 py-2">Standards body; IEC 61753 = fiber connector test standard.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Cable-End Preparation: Step by Step</h2>

        <h3 className="mt-4 font-semibold">Step 1: Jacket stripping</h3>
        <p className="mt-2">
          The cable's outer jacket (typically PVC or polyethylene) must be removed to expose the fiber
          layers inside. A cable stripper tool (essentially a rotary cutter) cuts the jacket along its
          length. You pull the jacket off by hand, typically 2–3 inches length.
        </p>
        <p className="mt-3">
          <strong>Critical:</strong> Do NOT cut through the aramid reinforcement (Kevlar) threads inside.
          Those threads protect the fiber from pulling forces. Cutting them weakens the cable. A good
          cable stripper is calibrated to cut only the jacket, not the aramid or fiber layers.
        </p>

        <h3 className="mt-5 font-semibold">Step 2: Aramid (Kevlar) thread removal</h3>
        <p className="mt-2">
          Once the jacket is off, you see 2–3 aramid threads running along the cable. These are tensile
          strength. Cut them with scissors or a specialized blade, leaving ~1 inch sticking out. You'll
          bundle these and anchor them to the cable when you attach the connector (they provide the
          strain relief).
        </p>

        <h3 className="mt-5 font-semibold">Step 3: Tube (buffer) removal</h3>
        <p className="mt-2">
          Inside most OSP cables is a loose tube containing multiple fibers (e.g., 4-tube with 4 fibers
          per tube). You must remove the tube to access the individual fiber you want to use. Tubes are
          held in place with a water-blocking gel or paper wrapping.
        </p>
        <p className="mt-3">
          Use a tube removal tool (a small knife or specialized stripper) to slit the tube length-wise,
          then peel it off the fiber. Clean any gel residue with isopropyl alcohol. The fiber should be
          bare and shiny.
        </p>

        <h3 className="mt-5 font-semibold">Step 4: Fiber stripping</h3>
        <p className="mt-2">
          The fiber is surrounded by a color-coded plastic coating (typically 250 µm thick). A fiber
          stripper (a precision cutter) removes this coating to expose the cladding. Standard strip length
          is 1–1.5 inches.
        </p>
        <p className="mt-3">
          <strong>Defects to watch for:</strong>
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Nicks or score marks on the cladding (weaken the fiber and cause breakage later)</li>
          <li>Uneven stripping (coating left on one side)</li>
          <li>The fiber itself visible or chipped during stripping</li>
        </ul>

        <h3 className="mt-5 font-semibold">Step 5: Fiber cleaving</h3>
        <p className="mt-2">
          The bare fiber is cleaved to create a flat endface perpendicular to the fiber axis. A fiber
          cleaver uses a scoring blade + a mechanical snap to break the fiber cleanly. The cleaved end
          should be perpendicular (within 0.5°) to the fiber axis.
        </p>
        <p className="mt-3">
          <strong>Why this matters:</strong> An angled endface causes loss when light enters a connector
          or pigtail. An 8° angle can cause 1–2 dB of loss — unacceptable in a fiber system.
        </p>

        <h2 className="mt-8">Termination Methods</h2>

        <h3 className="mt-4 font-semibold">Method 1: Mechanical connector termination</h3>
        <p className="mt-2">
          The cleaved fiber is inserted into a ferrule (a ceramic or plastic tube) and secured. The
          ferrule is polished to create a smooth, low-loss surface. The ferrule is then pushed into a
          connector body (LC, SC, etc.) and locked into place.
        </p>
        <p className="mt-3">
          <strong>Polishing steps:</strong>
        </p>
        <ol className="list-decimal list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Coarse grit (8–12 µm) to remove ferrule sanding marks</li>
          <li>Medium grit (1–3 µm) to refine the surface</li>
          <li>Fine grit (0.5 µm) for final finish and low loss</li>
        </ol>
        <p className="mt-3">
          After polishing, the endface is inspected under a microscope. Acceptable endfaces show a
          scratch pattern radiating from the fiber center — a sign of proper polishing. Unacceptable:
          pits, chips, lint, or a beveled edge.
        </p>

        <h3 className="mt-5 font-semibold">Method 2: Pigtail termination (fusion-spliced)</h3>
        <p className="mt-2">
          A pre-terminated patch cord (pigtail) with a factory-polished connector on one end is
          fusion-spliced to the main cable. This transfers the high-loss burden to the splice instead
          of a field-installed connector.
        </p>
        <p className="mt-3">
          <strong>Advantage:</strong> Field splice quality is easier to control than field connector polish.
          <strong>Disadvantage:</strong> slightly higher cost, and you have a splice case at the demarcation point
          instead of a clean connector.
        </p>

        <h3 className="mt-5 font-semibold">Quality acceptance criteria</h3>
        <div className="rounded-lg bg-green-950/30 border border-green-500/20 p-4 mt-3 space-y-2 text-sm">
          <p><strong>Mechanical connector:</strong></p>
          <p>- Insertion loss ≤ 0.5 dB per IEC 61753-1</p>
          <p>- Return loss ≥ 45 dB (singlemode, IEC standard)</p>
          <p>- Endface microscope inspection: no pits, chips, or bevels</p>
          <p className="mt-3"><strong>Pigtail splice:</strong></p>
          <p>- Splice loss ≤ 0.3 dB per industry standard</p>
          <p>- Pigtail connector meets IEC 61753 acceptance</p>
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: Return Loss and Connector Type Selection</h2>

        <h3 className="mt-4 font-semibold">Return loss (RL) — why it matters</h3>
        <p className="mt-2">
          Return loss is the amount of light reflected back toward the source when light encounters
          a connector endface. High RL (≥45 dB) means almost no light reflects back. Low RL (≤20 dB)
          means a lot of light bounces back, which can interfere with data transmission and degrade
          the receiver's signal.
        </p>
        <p className="mt-3">
          An improperly polished connector endface has a high reflection coefficient. Polishing at the
          correct angle (8° for singlemode) reduces reflection to acceptable levels.
        </p>

        <h3 className="mt-5 font-semibold">Connector types and their use</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5">
            <tr className="border-b border-white/10">
              <th className="px-3 py-2 text-left">Connector</th>
              <th className="px-3 py-2 text-left">Form factor</th>
              <th className="px-3 py-2 text-left">OSP use</th>
              <th className="px-3 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-b border-white/10">
              <td className="px-3 py-2 font-semibold">LC</td>
              <td className="px-3 py-2">1.25 mm ferrule</td>
              <td className="px-3 py-2">Modern standard</td>
              <td className="px-3 py-2">Compact, snap-lock, dual-fiber variants exist</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="px-3 py-2 font-semibold">SC</td>
              <td className="px-3 py-2">2.5 mm ferrule</td>
              <td className="px-3 py-2">Legacy / test equipment</td>
              <td className="px-3 py-2">Larger, push-pull, still used in older CO equipment</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-semibold">MU</td>
              <td className="px-3 py-2">1.25 mm ferrule</td>
              <td className="px-3 py-2">Rare in OSP; telco datacom</td>
              <td className="px-3 py-2">Smaller than LC; most fiber networks prefer LC</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 font-semibold">Practical exam scenario</h3>
        <p className="mt-2">
          <em>"You've stripped and cleaved a fiber at the CO. A microscope inspection shows 3 small
          pits on the endface. What's your next step?"</em>
        </p>
        <p className="mt-3">
          <strong>Correct answer:</strong> Recleve the fiber to remove the pits and re-inspect. Pits
          cause light scattering and high return loss. If pits remain after recleaving, the fault may be
          in the fiber itself (unlikely) or the stripper is damaged (more likely).
        </p>
      </section>

      {/* ── FLASHCARDS ──────────────────────────────────────────────── */}
      <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
        <h3 className="text-sm font-semibold text-slate-200">Key terms</h3>
        {key_terms.map((term, idx) => (
          <Flashcard key={idx} term={term} definition={getDefinition(term)} />
        ))}
      </div>

      {/* ── QUIZ ────────────────────────────────────────────────── */}
      <Quiz
        questions={[
          {
            id: 'T21.L04.Q1',
            type: 'mc',
            prompt: 'During cable jacket stripping, what critical component should you NOT cut?',
            choices: [
              'The outer PVC',
              'The water-blocking gel',
              'The aramid (Kevlar) reinforcement threads',
              'The loose tube',
            ],
            answerIndex: 2,
            explanation: 'Cutting aramid threads weakens the cable. A calibrated cable stripper cuts only the jacket, protecting the internal elements.',
          },
          {
            id: 'T21.L04.Q2',
            type: 'mc',
            prompt: 'What is the acceptable angle tolerance for a cleaved fiber endface?',
            choices: [
              '±2°',
              '±0.5°',
              '±5°',
              '±10°',
            ],
            answerIndex: 1,
            explanation: 'Endface angle must be within ±0.5° perpendicular to the fiber axis. Angles >1° cause significant insertion loss.',
          },
          {
            id: 'T21.L04.Q3',
            type: 'mc',
            prompt: 'A microscope inspection of a polished connector endface shows pits. What should you do?',
            choices: [
              'Install it anyway; pits are cosmetic',
              'Recleve the fiber and re-polish',
              'Replace the entire cable',
              'Use a protective cap to cover the pits',
            ],
            answerIndex: 1,
            explanation: 'Pits cause light scattering and high loss. Recleaving and re-polishing removes them. If pits persist, the stripper may be damaged.',
          },
          {
            id: 'T21.L04.Q4',
            type: 'mc',
            prompt: 'What is the minimum return loss (RL) acceptance criterion for a singlemode connector in OSP?',
            choices: [
              '≥20 dB',
              '≥35 dB',
              '≥45 dB',
              '≥55 dB',
            ],
            answerIndex: 2,
            explanation: 'IEC 61753-1 specifies ≥45 dB RL for singlemode connectors. Lower values indicate poor polishing or endface defects.',
          },
        ]}
      />
    </LessonLayout>
  );
}

function getDefinition(term) {
  const defs = {
    'Cable jacket stripping': 'Removal of the outer protective PVC/PE coating to expose internal cable layers.',
    'Buffer removal': 'Stripping the plastic coating from the fiber to expose bare cladding.',
    'Cleaving (fiber end preparation)': 'Creating a flat, perpendicular endface using a fiber cleaver tool.',
    'Mechanical connector': 'Field-installable connector (LC, SC, MU) secured with a ferrule and polished endface.',
    'Pigtail termination': 'Pre-terminated patch cord fused to the main cable instead of using a field-installed connector.',
    'Connector polish (endface quality)': 'Process of refining the ferrule surface through successive grit stages for low loss and high return loss.',
    'Return loss (connector quality metric)': 'Measure of reflected light at a connector endface (dB); higher = better; ≥45 dB is OSP standard.',
  };
  return defs[term] || '(definition not found)';
}
