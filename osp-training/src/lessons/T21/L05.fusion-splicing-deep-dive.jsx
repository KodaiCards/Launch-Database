import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T21.L05',
  course_id: 'T21',
  title: 'Fusion Splicing Deep Dive: Field Equipment, Process, Acceptance',
  order: 5,
  lesson_type: 'cert-prep',
  prerequisites: ['T21.L02', 'T21.L04', 'T11.L02'],
  learning_objectives: [
    'Understand fusion splicer operation and maintenance in the field',
    'Execute a consistent fusion-splice process: prep, align, heat, cool',
    'Interpret fusion splicer loss estimates and verify against OTDR measurements',
    'Troubleshoot common splicing defects (misalignment, contamination, fiber ends)',
    'Apply field acceptance criteria for splices (loss ≤0.3 dB for OSP single-mode)',
  ],
  estimated_minutes: 24,
  vocabulary_introduced: [
    'Arc discharge (fusion heating)',
    'Splicer alignment mode',
    'Estimated loss (splicer display)',
    'Splice loss verification',
    'Micromotion compensation',
    'Contamination detection',
    'Splice enclosure / heat-shrink sleeve',
  ],
  vocabulary_assumed: [
    { term: 'fusion splicing', source_lesson_id: 'T11.L02' },
    { term: 'fiber alignment', source_lesson_id: 'T11.L01' },
    { term: 'cleaving', source_lesson_id: 'T21.L04' },
    { term: 'splice case', source_lesson_id: 'T01.L03' },
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T21L05_FusionSplicingDeepDive() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Fusion splicing is the gold standard for joining two fibers in the field. A fusion splicer
          uses an electrical arc to melt the two fiber ends together, creating a permanent, low-loss
          bond. This is different from mechanical splices (which are temporary or lower-quality) or
          connector pigtails (which are pre-made). For a CFOS-O technician, fusion splicing is a core
          skill — you'll do it dozens of times in a project.
        </p>

        <h3 className="mt-4 font-semibold">Why fusion splicing matters in OSP</h3>
        <p className="mt-2">
          Fusion splices typically have <strong>lower loss (≤0.3 dB)</strong> than mechanical connectors
          or fusion pigtails. Over a long link with many splices, this adds up. A project with 100 splices
          at 0.1 dB each loses only 10 dB total; at 0.5 dB each, 50 dB — unacceptable. Fusion splicing
          discipline is the difference between a link that works and a link that fails.
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
              <td className="px-3 py-2 font-mono">FTTH</td>
              <td className="px-3 py-2">Fiber-to-the-Home</td>
              <td className="px-3 py-2">Residential fiber deployment; splices at every distribution point.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">V-groove</td>
              <td className="px-3 py-2">Fiber alignment mechanism</td>
              <td className="px-3 py-2">Curved groove on splicer holds fibers; arc heats them where they meet at the groove bottom.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OTDR</td>
              <td className="px-3 py-2">Optical Time Domain Reflectometer</td>
              <td className="px-3 py-2">Measures splice loss; reference standard for field acceptance.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">EL</td>
              <td className="px-3 py-2">Estimated Loss (splicer display)</td>
              <td className="px-3 py-2">Splicer's real-time prediction of splice loss after arc. Verify against OTDR post-test.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Fusion Splicer Operation: The Five-Step Process</h2>

        <h3 className="mt-4 font-semibold">Step 1: Fiber prep (cleaving)</h3>
        <p className="mt-2">
          Both fibers must be freshly cleaved with perpendicular, pit-free endfaces (within ±0.5°).
          Cleave length: typically 8–10 mm of bare fiber, with the rest coated. This gives the splicer
          room to position the fibers in the V-groove without the coating interfering.
        </p>
        <p className="mt-3">
          <strong>Why this matters:</strong> A fiber end with pits, bevels, or coating touching the splicer
          will cause alignment errors and high loss. Freshness also matters — a cleaved end left exposed
          picks up humidity and dust. Splice within 5 minutes of cleaving when possible.
        </p>

        <h3 className="mt-5 font-semibold">Step 2: Cleaver calibration check</h3>
        <p className="mt-2">
          Before splicing a critical section, test the cleaver on a scrap fiber and measure the endface
          angle with the splicer's built-in microscope. If the cleaver is producing angled ends, recalibrate
          it or replace the cutting blade. A bad cleaver will cause 10+ splices to fail.
        </p>

        <h3 className="mt-5 font-semibold">Step 3: Fiber insertion and alignment</h3>
        <p className="mt-2">
          Insert both cleaved fibers into the splicer's V-groove. The splicer positions them with
          micro-precision (typically ±1 µm). The splicer displays a real-time view of the fiber ends
          under magnification. You align them until the splicer says "ready" — fiber ends touching
          or nearly touching, centered in the groove.
        </p>
        <p className="mt-3">
          <strong>Alignment modes:</strong>
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>Core-to-core alignment:</strong> Splicer measures the fiber core using light and aligns them. Best for low loss.</li>
          <li><strong>Cladding alignment:</strong> Splicer uses the cladding edges (easier to see). Acceptable but slightly higher loss risk.</li>
        </ul>
        <p className="mt-3">
          Wait for the splicer's alignment confirmation before proceeding. A manual "force" splice on
          misaligned fibers will cause 1–5 dB loss — unacceptable.
        </p>

        <h3 className="mt-5 font-semibold">Step 4: Arc and fusion</h3>
        <p className="mt-2">
          The splicer applies a high-voltage pulse (~3–4 kV) between two electrodes near the fiber
          ends. This creates a plasma arc that melts the glass. The fibers soften and fuse together
          as the arc heats them.
        </p>
        <p className="mt-3">
          <strong>Arc parameters</strong> are programmed into the splicer based on fiber type
          (singlemode vs. multimode, G.652 vs. G.655, etc.). A singlemode program uses a shorter,
          more precise arc than a multimode program. Using the wrong program causes inconsistent fusion.
        </p>
        <p className="mt-3">
          <strong>What you see:</strong> The splicer displays a live arc (bright light), then a few
          seconds of heating. You'll hear a faint pop if the arc is strong. The splicer then backs off
          the electrodes and displays the <strong>Estimated Loss (EL)</strong> on the screen.
        </p>

        <h3 className="mt-5 font-semibold">Step 5: Cooling and removal</h3>
        <p className="mt-2">
          The splicer holds the fibers in the V-groove for 10–20 seconds to cool. The fused glass hardens.
          Once the splicer signals "cool done," you carefully remove the fibers from the groove. Place
          the splice immediately into a heat-shrink sleeve or protective splice enclosure.
        </p>
        <p className="mt-3">
          <strong>Heat-shrink sleeve:</strong> A small tube (typically 40–50 mm long) that slides over
          the splice. When heated with a match or lighter, it shrinks to create a protective seal. This
          protects the splice from contamination and mechanical stress in the field.
        </p>

        <h2 className="mt-8">Splice Loss Assessment</h2>

        <h3 className="mt-4 font-semibold">Estimated Loss (EL) display</h3>
        <p className="mt-2">
          The splicer displays EL immediately after the arc. This is the splicer's prediction of splice
          loss based on the alignment and arc quality. Typical values: 0.01–0.5 dB.
        </p>
        <p className="mt-3">
          <strong>Interpretation:</strong>
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>EL &lt; 0.1 dB: Excellent splice; accept.</li>
          <li>EL 0.1–0.3 dB: Good splice; acceptable per OSP standard.</li>
          <li>EL 0.3–0.5 dB: Marginal; investigate alignment and cleaver quality.</li>
          <li>EL &gt; 0.5 dB: Reject; cleave again and re-splice. Problem is usually misalignment or bad cleave.</li>
        </ul>

        <h3 className="mt-5 font-semibold">Verification with OTDR</h3>
        <p className="mt-2">
          The EL display is a real-time estimate. The true splice loss is measured later with an OTDR.
          OTDR looks for reflections at each splice location and calculates loss from the amplitude change.
          For a link with 50 splices, OTDR gives you a per-splice loss profile.
        </p>
        <p className="mt-3">
          <strong>Expected discrepancy:</strong> EL and OTDR loss sometimes differ by ±0.1 dB due to the
          difference in measurement method. If they differ by &gt;0.2 dB, something is wrong with either
          the splice or the OTDR measurement.
        </p>

        <h3 className="mt-5 font-semibold">Field acceptance criteria</h3>
        <div className="rounded-lg bg-blue-950/30 border border-blue-500/20 p-4 mt-3 space-y-2 text-sm">
          <p><strong>Single splice (immediate):</strong> EL ≤ 0.3 dB</p>
          <p><strong>Full link (OTDR):</strong> 95% of splices ≤ 0.3 dB; max single splice 0.5 dB</p>
          <p><strong>Concatenation (splices in series):</strong> Total loss &lt; 10 dB for 50 splices</p>
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: Troubleshooting Common Splice Defects</h2>

        <h3 className="mt-4 font-semibold">High estimated loss (EL &gt; 0.5 dB)</h3>
        <p className="mt-2">
          <strong>Most common cause: lateral misalignment.</strong> The splicer's alignment algorithm
          saw the cores off-center. Likely sources:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Fiber not straight in the V-groove (fiber bent or kinked)</li>
          <li>Cleaver producing angled or eccentric endfaces</li>
          <li>Splicer alignment motor drive stuck or calibration drift</li>
        </ul>
        <p className="mt-3">
          <strong>Fix:</strong> (1) Cleave fresh fibers from the backup section. (2) Check the cleaver
          with the splicer's microscope. (3) Use the splicer's "manual align" mode if available (slower
          but more reliable). (4) If still high, the splicer itself may need service.
        </p>

        <h3 className="mt-5 font-semibold">Arc strike failure or "no arc"</h3>
        <p className="mt-2">
          The splicer tried to apply arc but failed. Symptoms: splicer displays "arc error" or "no arc."
          Likely causes:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Contamination on the electrodes (dirt, fiber fragments)</li>
          <li>Fibers too far apart (gap &gt; 20 µm) so arc can't bridge</li>
          <li>High humidity or altitude affecting arc characteristics</li>
        </ul>
        <p className="mt-3">
          <strong>Fix:</strong> (1) Clean the electrodes with a soft cloth. (2) Re-insert fibers and re-align.
          (3) If persistent, increase the splicer's arc power setting slightly (if the splicer allows manual
          adjustment). (4) Check weather — high humidity can affect arc; wait for drier conditions or move
          to a sheltered work area.
        </p>

        <h3 className="mt-5 font-semibold">Contamination detection</h3>
        <p className="mt-2">
          Dust or fibers left on the cleaved end will scatter light during the arc and cause high loss.
          Contamination is visible in the splicer's microscope view — look for particles near the fiber ends.
          Clean with a lint-free swab and isopropyl alcohol before re-inserting.
        </p>

        <h3 className="mt-5 font-semibold">Practical exam scenario</h3>
        <p className="mt-2">
          <em>"You splice two fibers in the field. EL = 0.08 dB (excellent). You heat-shrink and continue.
          Later, OTDR shows that same splice at 0.6 dB. What happened?"</em>
        </p>
        <p className="mt-3">
          <strong>Correct answer:</strong> The splice was damaged after creation — likely the heat-shrink
          was applied with excessive heat (too close to the flame) and micro-cracked the fused region, or
          the splice was mechanically stressed (bent, pulled). Inspect the heat-shrink visually and,
          if possible, gently tap the splice case to confirm no internal movement. The splice itself may
          be salvageable but requires investigation.
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
            id: 'T21.L05.Q1',
            type: 'mc',
            prompt: 'What is the OSP standard field acceptance criterion for a single fusion splice?',
            options: [
              { id: 'a', text: 'EL ≤ 0.1 dB' },
              { id: 'b', text: 'EL ≤ 0.3 dB', isCorrect: true },
              { id: 'c', text: 'EL ≤ 0.5 dB' },
              { id: 'd', text: 'EL ≤ 1.0 dB' },
            ],
            rationale: 'OSP standard is ≤0.3 dB per splice. A 50-splice link at this rate yields ~15 dB total loss, which is acceptable for a typical OSP span.',
          },
          {
            id: 'T21.L05.Q2',
            type: 'mc',
            question: 'You insert two cleaved fibers into the splicer and see they are misaligned on the microscope display. What should you do?',
            options: [
              { id: 'a', text: 'Force the splice anyway; alignment can be close enough' },
              { id: 'b', text: 'Wait for the splicer alignment algorithm to auto-correct' },
              { id: 'c', text: 'Manually adjust the fibers or re-insert and wait for alignment confirmation', isCorrect: true },
              { id: 'd', text: 'Increase the arc power to compensate for misalignment' },
            ],
            rationale: 'Never force a misaligned splice. Wait for the splicer\'s alignment confirmation, adjust fibers manually if needed, or re-cleave and re-insert.',
          },
          {
            id: 'T21.L05.Q3',
            type: 'mc',
            question: 'A splice shows EL = 0.08 dB in the field (excellent), but OTDR later shows 0.6 dB at that location. What is the most likely cause?',
            options: [
              { id: 'a', text: 'The OTDR is miscalibrated' },
              { id: 'b', text: 'The splice was damaged after creation (heat-shrink burn, mechanical stress, etc.)', isCorrect: true },
              { id: 'c', text: 'The EL display was wrong' },
              { id: 'd', text: 'The splicer arc power was too low' },
            ],
            rationale: 'A low EL that becomes high in OTDR indicates post-splice damage. Excessive heat from heat-shrink, mechanical bending, or pulling can micro-crack the fused region.',
          },
          {
            id: 'T21.L05.Q4',
            type: 'mc',
            question: 'What should you do if the fusion splicer displays 'no arc" error when attempting to fuse two fibers?',
            options: [
              { id: 'a', text: 'Immediately increase the arc power setting to maximum' },
              { id: 'b', text: 'Clean the electrodes and check fiber alignment; re-try', isCorrect: true },
              { id: 'c', text: 'Replace the fibers with new ones' },
              { id: 'd', text: 'Assume the splicer is broken and send it for repair' },
            ],
            rationale: 'No arc typically means contaminated electrodes or poor fiber alignment. Clean and re-insert before adjusting power or assuming equipment failure.',
          },
        ]}
      />
    </LessonLayout>
  );
}

function getDefinition(term) {
  const defs = {
    'Arc discharge (fusion heating)': 'High-voltage electrical arc between splicer electrodes that heats and melts fiber glass for fusion.',
    'Splicer alignment mode': 'Splicer\'s algorithm for centering two fibers (core-to-core or cladding alignment) to minimize loss.',
    'Estimated loss (splicer display)': 'Real-time prediction by the splicer of splice loss after the arc, displayed immediately; typical 0.01–0.5 dB.',
    'Splice loss verification': 'OTDR measurement of actual splice loss post-installation; reference standard for field acceptance.',
    'Micromotion compensation': 'Splicer\'s automatic adjustment of fiber position during cooling to compensate for thermal stress.',
    'Contamination detection': 'Visual inspection of fiber ends in splicer microscope for dust, glass fragments, or residue before splicing.',
    'Splice enclosure / heat-shrink sleeve': 'Protective tube applied over a splice to shield it from contamination and mechanical stress in the field.',
  };
  return defs[term] || '(definition not found)';
}
