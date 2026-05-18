import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T21.L06',
  course_id: 'T21',
  title: 'OTDR Testing + Acceptance: Link Characterization and Troubleshooting',
  order: 6,
  lesson_type: 'cert-prep',
  prerequisites: ['T21.L05', 'T12.L01'],
  learning_objectives: [
    'Operate an OTDR in the field: setup, launch conditions, acquisition settings',
    'Interpret OTDR trace: identify splices, connectors, breaks, and loss signatures',
    'Apply acceptance criteria for OSP links (splice loss, total loss, attenuation)',
    'Troubleshoot high-loss signatures on OTDR traces',
    'Use OTDR to validate splicing quality and detect hidden defects',
  ],
  estimated_minutes: 23,
  vocabulary_introduced: [
    'OTDR trace',
    'Launch condition (reference pulse)',
    'Splice signature (positive vs. negative peak)',
    'Connector reflection (reflection peak)',
    'Attenuation coefficient (dB/km)',
    'Loss per unit length',
    'Event loss (splice or connector)',
  ],
  vocabulary_assumed: [
    { term: 'OTDR', source_lesson_id: 'T12.L01' },
    { term: 'attenuation', source_lesson_id: 'T02.L01' },
    { term: 'fusion splice', source_lesson_id: 'T21.L05' },
    { term: 'fiber link', source_lesson_id: 'T01.L07' },
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T21L06_OTDRTesting() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          An OTDR (Optical Time Domain Reflectometer) sends a laser pulse down a fiber and listens for
          echoes. From these echoes, it builds a graph (a "trace") showing distance, loss at each splice
          or event, and the overall attenuation of the fiber. It's like sonar for fiber: you send a signal
          and measure what comes back. For a CFOS-O technician, OTDR is the tool that verifies a cable
          plant meets acceptance criteria before the customer takes ownership.
        </p>

        <h3 className="mt-4 font-semibold">Why OTDR is the standard</h3>
        <p className="mt-2">
          Light-loss measurements with a power meter are quick but don't tell you WHERE the loss is. OTDR
          shows you every loss event — each splice, each connector, even hidden defects like a kink or
          macrobend. This localization is what makes OTDR invaluable for troubleshooting and acceptance.
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
              <td className="px-3 py-2 font-mono">OTDR</td>
              <td className="px-3 py-2">Optical Time Domain Reflectometer</td>
              <td className="px-3 py-2">Laser pulse + receiver measures backscatter; shows fiber events vs. distance.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">dB</td>
              <td className="px-3 py-2">Decibel</td>
              <td className="px-3 py-2">Logarithmic unit; splice loss measured in dB (0.1, 0.5, 1.0 dB, etc.).</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ORL</td>
              <td className="px-3 py-2">Optical Return Loss</td>
              <td className="px-3 py-2">Amount of light reflected back from a connector or break; high = reflective, bad.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Trace</td>
              <td className="px-3 py-2">OTDR graph output</td>
              <td className="px-3 py-2">X-axis = distance (km), Y-axis = power (dB); shows fiber signature from launch to far end.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>OTDR Setup and Operation</h2>

        <h3 className="mt-4 font-semibold">Field setup: launch condition</h3>
        <p className="mt-2">
          Before you take an OTDR reading, establish a <strong>launch condition</strong> — a controlled
          light source feeding the OTDR at a known power level. This typically means using a launch
          box (a separate piece of equipment) that inserts a known signal into the fiber, stabilizing
          the reading.
        </p>
        <p className="mt-3">
          <strong>Why this matters:</strong> Without a launch condition, the OTDR's first 100–500 meters
          of trace is noise — a sharp peak that hides the first few splices. With a launch condition, the
          first splice is clearly visible.
        </p>

        <h3 className="mt-5 font-semibold">OTDR settings: pulse width and averaging</h3>
        <p className="mt-2">
          <strong>Pulse width:</strong> Controls the precision of the OTDR. Narrow pulses (e.g., 10 ns)
          give you fine detail but less range. Wide pulses (e.g., 1 µs) go farther but blur fine details.
          For a short OSP link (10 km), use narrow pulse (10–100 ns). For long links (40+ km), use wider
          pulse (500 ns–1 µs).
        </p>
        <p className="mt-3">
          <strong>Averaging:</strong> OTDR acquires multiple pulses and averages them to reduce noise.
          More averaging = cleaner trace but longer test time. For a 10 km link: 32–64 averages, ~30 sec.
          For a 50 km link: 512+ averages, ~5 min.
        </p>

        <h3 className="mt-5 font-semibold">Acquiring the trace</h3>
        <p className="mt-2">
          Start the OTDR. It sends laser pulses and records the backscatter intensity vs. time. The OTDR
          converts time to distance using the refractive index of the fiber (typically ~1.47). Once
          acquisition is done, the OTDR displays the trace — a curve showing the signature of the entire
          fiber run.
        </p>

        <h2 className="mt-8">Reading the OTDR Trace</h2>

        <h3 className="mt-4 font-semibold">The baseline: attenuation slope</h3>
        <p className="mt-2">
          The overall downward slope of the trace is the fiber's attenuation. A singlemode fiber at 1550 nm
          typical attenuates at <strong>~0.20 dB/km</strong>. The slope of the OTDR trace should match this.
          If the slope is steeper (e.g., 0.35 dB/km), the fiber is lossy — possibly bad material or
          macrobends induced during installation.
        </p>

        <h3 className="mt-5 font-semibold">Splice signatures: positive and negative peaks</h3>
        <p className="mt-2">
          A fusion splice appears as a small <strong>dip (negative peak)</strong> in the trace — the loss
          event. The depth of the dip is the splice loss in dB. A 0.1 dB splice shows a 0.1 dB dip.
        </p>
        <p className="mt-3">
          Some splices show a small <strong>positive peak</strong> just before the dip. This is a reflection
          from the splice interface if there's slight index mismatch. It's not a problem if the splice loss
          is acceptable, but a large peak (large ORL) combined with high loss indicates a bad splice.
        </p>

        <h3 className="mt-5 font-semibold">Connector reflections</h3>
        <p className="mt-2">
          A mechanical connector (LC, SC) appears as a <strong>strong positive peak</strong> (reflection) because
          the connector endface is a abrupt glass-to-air boundary. This reflection shows high ORL — typical
          ≥45 dB, meaning strong reflection. This is normal and expected. The connector also causes loss
          (insertion loss, typically 0.3–0.5 dB), which shows as a small dip in the trace.
        </p>

        <h3 className="mt-5 font-semibold">Breaks and discontinuities</h3>
        <p className="mt-2">
          A broken or cut fiber shows a very sharp positive peak (high reflection) followed by zero backscatter
          beyond that point. The trace just stops. This is an obvious defect.
        </p>

        <h3 className="mt-5 font-semibold">Practical analysis: reading a trace</h3>
        <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 mt-3 font-mono text-xs">
          <p>Distance (km)  Event        Loss (dB)     Notes</p>
          <p>─────────────────────────────────────────</p>
          <p>0.0            Launch       —             Reference pulse</p>
          <p>0.5            Splice 1     +0.08         Small dip → good splice</p>
          <p>2.1            Splice 2     +0.12         Acceptable</p>
          <p>5.3            Connector    +0.35 (peak)  Strong reflection + insertion loss</p>
          <p>7.8            Splice 3     +0.45         Elevated but within 0.5 dB limit</p>
          <p>10.2           Far end      —             End of link; trace stops cleanly</p>
        </div>

        <h2 className="mt-8">Acceptance Criteria and Troubleshooting</h2>

        <h3 className="mt-4 font-semibold">OSP link acceptance (single-mode, 1550 nm)</h3>
        <div className="rounded-lg bg-green-950/30 border border-green-500/20 p-4 mt-3 space-y-2 text-sm">
          <p><strong>Per-splice loss:</strong> ≤0.3 dB (95% of splices)</p>
          <p><strong>Max single splice:</strong> 0.5 dB (outliers acceptable if rare)</p>
          <p><strong>Attenuation coefficient:</strong> ≤0.25 dB/km (verify fiber type)</p>
          <p><strong>Total loss (end-to-end):</strong> &lt; 10 dB for typical 50 km FTTH trunk</p>
          <p><strong>Connector insertion loss:</strong> ≤0.5 dB</p>
        </div>

        <h3 className="mt-5 font-semibold">High-loss splice on OTDR: investigation checklist</h3>
        <p className="mt-2">
          If OTDR shows a splice at 0.8 dB (above the 0.5 dB limit):
        </p>
        <ol className="list-decimal list-inside text-slate-300/90 mt-2 space-y-2 text-sm">
          <li>Check the splice location (distance on OTDR). Navigate to that splice case in the field.</li>
          <li>Visually inspect the splice inside the case — is the heat-shrink damaged?</li>
          <li>Check the splicer's log: did the splicer report high EL (estimated loss) when that splice was made?</li>
          <li>If EL was OK but OTDR is high → splice was damaged after creation. Unseal, re-cleave, re-splice.</li>
          <li>If EL was also high → original splice was bad. Unseal, examine for fiber breaks or contamination, re-splice.</li>
        </ol>

        <h3 className="mt-5 font-semibold">Elevated attenuation coefficient</h3>
        <p className="mt-2">
          If OTDR slope is steeper than expected (e.g., 0.35 dB/km instead of 0.20), the fiber is lossy.
          Possible causes:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Fiber material is poor quality (out-of-spec for attenuation)</li>
          <li>Macrobends induced during installation (cable kink, tight wrap)</li>
          <li>Microbends from buffer tube stress or conduit pulling tension</li>
        </ul>
        <p className="mt-3">
          <strong>Action:</strong> Inspect the cable run for obvious bends or kinks. If you find any, work
          them out gently (straighten conduit, re-drape aerial cable). Re-test. If slope improves, problem
          was installation-induced. If not, the fiber material itself is out of spec — the cable supplier
          is at fault.
        </p>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: OTDR Uncertainties and Limitations</h2>

        <h3 className="mt-4 font-semibold">Reflective events vs. loss events</h3>
        <p className="mt-2">
          OTDR detects two types of events: (1) <strong>reflective</strong> — connectors, open ends, or
          breaks with strong ORL; (2) <strong>non-reflective</strong> — splices and macrobends with loss but
          no reflection. A reflective event blocks the far end from view (the trace stops or reverses at the
          reflection). A non-reflective event (splice) lets the fiber continue visible beyond.
        </p>

        <h3 className="mt-5 font-semibold">Mode filtering and its effects</h3>
        <p className="mt-2">
          OSP fibers are launched with a mode-controlled light source to ensure consistent results. Mode
          filtering (a weighted mix of the fiber modes) changes the attenuation signature. An unfiltered
          launch shows higher loss at the front end due to mode leakage. Proper launch condition (via launch
          box) removes this artifact.
        </p>

        <h3 className="mt-5 font-semibold">Practical exam scenario</h3>
        <p className="mt-2">
          <em>"Your OTDR shows two splices: Splice A at 2.1 km with a loss reading of 0.2 dB (good),
          and Splice B at 5.3 km with a sharp positive peak showing 1.2 dB of reflection plus a loss of
          0.4 dB. The rest of the link looks normal. What's wrong?"</em>
        </p>
        <p className="mt-3">
          <strong>Correct answer:</strong> Splice B is suspect. The high reflection (1.2 dB ORL) suggests
          a partial break or bad index-match at the splice (rare for fusion but possible if contamination
          or improper cleaving led to a gap). The 0.4 dB loss is marginal but combined with the reflection,
          this splice should be unseal and re-done. The reflection is the red flag — normal splices don't
          reflect. This could indicate a micro-fracture or improper fusion on one of the fiber ends.
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
            id: 'T21.L06.Q1',
            type: 'multiple-choice',
            question: 'What is the OSP acceptance criterion for attenuation coefficient (slope) of singlemode fiber at 1550 nm?',
            options: [
              { id: 'a', text: '≤0.15 dB/km' },
              { id: 'b', text: '≤0.25 dB/km', isCorrect: true },
              { id: 'c', text: '≤0.40 dB/km' },
              { id: 'd', text: '≤0.50 dB/km' },
            ],
            rationale: 'Standard singlemode attenuation is ~0.20 dB/km. OSP acceptance is ≤0.25 dB/km, allowing slight margin for aging or installation stress.',
          },
          {
            id: 'T21.L06.Q2',
            type: 'multiple-choice',
            question: 'On an OTDR trace, a fusion splice appears as which characteristic signature?',
            options: [
              { id: 'a', text: 'A sharp positive peak (strong reflection)' },
              { id: 'b', text: 'A dip (negative peak) indicating loss', isCorrect: true },
              { id: 'c', text: 'No visible feature; splices are invisible to OTDR' },
              { id: 'd', text: 'A flat section of the trace' },
            ],
            rationale: 'A fusion splice shows a dip (loss event) in the trace. The depth of the dip equals the splice loss in dB. A positive peak usually indicates a reflective event (connector or break).',
          },
          {
            id: 'T21.L06.Q3',
            type: 'multiple-choice',
            question: 'Your OTDR shows Splice A at 3.5 km with only 0.05 dB loss (excellent), but 6 hours later OTDR re-test shows 0.8 dB at the same location. What is the most likely explanation?',
            options: [
              { id: 'a', text: 'The OTDR calibration drifted between tests' },
              { id: 'b', text: 'The splice was damaged after testing (mechanical stress or thermal shock)', isCorrect: true },
              { id: 'c', text: 'The fiber itself is degrading over time' },
              { id: 'd', text: 'The splicer\'s estimated loss was wrong' },
            ],
            rationale: 'A low loss that becomes high indicates post-test damage. Mechanical strain, temperature fluctuation, or heat-shrink applied too close to the splice can cause micro-cracks.',
          },
          {
            id: 'T21.L06.Q4',
            type: 'multiple-choice',
            question: 'When setting up an OTDR in the field, what is the purpose of establishing a "launch condition"?',
            options: [
              { id: 'a', text: 'To increase the OTDR range by 50%' },
              { id: 'b', text: 'To stabilize the light source and eliminate dead zone artifacts near the start of the trace', isCorrect: true },
              { id: 'c', text: 'To reduce the OTDR test time' },
              { id: 'd', text: 'To improve connector insertion loss measurement' },
            ],
            rationale: 'A launch condition (via launch box) provides a controlled light source, stabilizing the near-end of the OTDR trace and making the first 100+ meters clearly visible instead of noisy.',
          },
        ]}
      />
    </LessonLayout>
  );
}

function getDefinition(term) {
  const defs = {
    'OTDR trace': 'Graph output from OTDR showing power vs. distance; reveals splices, connectors, and fiber attenuation.',
    'Launch condition (reference pulse)': 'Controlled light-source setup (via launch box) that stabilizes OTDR measurement and eliminates near-end noise.',
    'Splice signature (positive vs. negative peak)': 'Dip (negative peak) shows splice loss; small positive peak may appear before dip due to index mismatch reflection.',
    'Connector reflection (reflection peak)': 'Strong positive peak from mechanical connector endface; high ORL (>45 dB) is normal; indicates reflective event.',
    'Attenuation coefficient (dB/km)': 'Rate of fiber loss per kilometer; typical 0.20 dB/km for singlemode at 1550 nm; slope of OTDR trace.',
    'Loss per unit length': 'Fiber attenuation measured as dB/km; used to calculate expected total loss for a given cable run.',
    'Event loss (splice or connector)': 'Discrete loss at a specific distance on OTDR trace; dB value of the loss at that event.',
  };
  return defs[term] || '(definition not found)';
}
