// T22 CFOT Lesson 5 — Installation Techniques
// Cable pulling, slack management, termination

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T22.L05',
  course_id: 'T22',
  title: 'Installation Techniques',
  order: 5,
  lesson_type: 'working',
  prerequisites: ['T22.L02', 'T06.L01', 'T10.L01'],
  vocabulary_introduced: [
    'cable pulling',
    'pulling tension (maximum allowable)',
    'slack storage',
    'bend radius (installation vs. long-term)',
    'termination',
    'polishing (fiber end prep)',
    'cleaver (mechanical)',
    'polishing pad',
  ],
  vocabulary_assumed: [
    { term: 'fiber', source_lesson_id: 'T01.L03' },
  ],
  estimated_minutes: 22,
  learning_objectives: [
    'Execute safe cable pulling procedures within manufacturer pulling tension limits',
    'Manage excess slack in conduit and at termination points',
    'Maintain bend radius during installation (installation: 10×OD, long-term: 20×OD)',
    'Prepare fiber ends for termination (cleaving, polishing)',
    'Identify and prevent installation damage (kinks, over-tension, contamination)',
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T22L05_Installation() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Cable pulling is about getting the fiber from point A to point B without breaking it.
          Fiber is strong, but it can't handle sharp bends or excessive pulling force. The rules are:
          never exceed pulling tension (typically 600–1000 lbs depending on cable type), always maintain
          minimum bend radius, and keep excess cable organized so it doesn't kink.
        </p>

        <h3 className="mt-4 font-semibold">Maximum Pulling Tension</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Every fiber cable has a maximum pulling tension spec, usually printed on the cable jacket.
          Typical ranges:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-slate-300/90">
          <li><strong>Loose-tube armored:</strong> 600–800 lbs</li>
          <li><strong>Non-aramid single-tube:</strong> 300–500 lbs</li>
          <li><strong>Ribbon cable:</strong> 200–400 lbs (more fragile)</li>
        </ul>
        <p className="text-sm text-slate-300/90 mt-2">
          Use a dynamometer (pulling-force meter) on long pulls. Mark the cable at 50-foot intervals
          so you can pull steadily without jerks. Jerks or sudden stops can break fibers inside the
          cable even if the outer tension is within spec.
        </p>

        <h3 className="mt-4 font-semibold">Bend Radius: Installation vs. Long-Term</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Phase</th>
              <th className="px-3 py-2 text-left">Bend radius rule</th>
              <th className="px-3 py-2 text-left">Example (¾" cable)</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">During pulling</td>
              <td className="px-3 py-2">10× cable OD (temporary, under tension)</td>
              <td className="px-3 py-2">¾" (19 mm) OD × 10 = 7.5" (191 mm) minimum radius</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">After installation (at rest)</td>
              <td className="px-3 py-2">20× cable OD (permanent, no tension)</td>
              <td className="px-3 py-2">¾" × 20 = 15" (381 mm) minimum radius</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-3 p-3 border border-amber-400/30 bg-amber-400/5 rounded-lg">
          <p className="font-semibold text-amber-300 text-sm">Book vs. Field</p>
          <p className="text-slate-300/90 text-sm">
            <strong>Book:</strong> Bend radius is a hard rule from the cable manufacturer.
            <strong>Field:</strong> Crews sometimes coil cable tighter than spec to save space.
            This creates macrobend loss (especially in single-mode singlemode)—often not discovered
            until OTDR testing weeks later. The rule exists for a reason: follow it.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Slack Management at Termination Points</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          At each end of a run, you need organized slack to allow for termination prep,
          splicing, and future growth. Typical slack allocation:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li><strong>At a pole pedestal or terminal:</strong> 15–25 feet of organized coil</li>
          <li><strong>In a handheld slack loop (mid-span):</strong> 10–15 feet per cable</li>
          <li><strong>At a customer termination:</strong> 6–10 feet inside the customer's location</li>
        </ul>
        <p className="text-sm text-slate-300/90 mt-2">
          Coil slack in 3–4 foot loops, secure with velcro (not ties — ties can crush buffer tubes).
          Label the coil with cable ID and destination.
        </p>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Fiber End Preparation for Termination</h2>
        <p>
          Before a fiber can be spliced or terminated, both ends must be precisely cleaved perpendicular
          to the fiber axis. This is done in two steps: cutting and polishing.
        </p>

        <h3 className="mt-3 font-semibold">Cleaving (Cutting)</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          A mechanical fiber cleaver scribes a tiny groove across the fiber, then applies precise tension
          to snap the fiber cleanly. A good cleave is flat, perpendicular, and glassy-looking.
        </p>
        <p className="text-sm text-slate-300/90 mt-2">
          <strong>Cleaver maintenance:</strong> The blade develops microchips over time (100–200 cleaves).
          Replace the blade or swap to a fresh cleaver when cleaves start to show "hackle" (fuzzy edges).
        </p>

        <h3 className="mt-3 font-semibold">Polishing (for Connector Termination)</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          For connectors (like LC, SC, or APC), the fiber end is further polished to a mirror finish
          on a ceramic polishing pad with progressively finer grits (typically 12 µm → 5 µm → 1 µm).
          This reduces reflection and loss at the connector interface. <em>(Fusion splicing does NOT
          require polishing — the arc fuses bare fibers together.)</em>
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Installation Damage and Prevention</h2>
        <h3 className="font-semibold">Common Damage Modes</h3>
        <ul className="space-y-2 text-sm text-slate-300/90 list-disc pl-5">
          <li><strong>Kinks:</strong> A sharp crease in the cable. Fiber inside is usually broken. Prevent by avoiding tight coils and never forcing cable around corners.</li>
          <li><strong>Over-tension:</strong> Pulling above spec. May break fibers internally or stretch the central member. Use a dynamometer.</li>
          <li><strong>Macrobend loss:</strong> Too-tight coil during slack storage. Causes attenuation without visible damage. Detect with OTDR.</li>
          <li><strong>Crushed buffer tubes:</strong> Velcro tied too tight or cable run over by a vehicle. The buffer protects the fiber; if crushed, the fiber is unprotected.</li>
          <li><strong>Environmental damage:</strong> UV exposure (daylight), temperature extremes, or chemical exposure (fuel, solvents). Use conduit or protective sleeving in harsh environments.</li>
        </ul>

        <h3 className="mt-5 font-semibold">Connector Types: Field Reference</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Connector</th>
              <th className="px-3 py-2 text-left">End face</th>
              <th className="px-3 py-2 text-left">Typical IL</th>
              <th className="px-3 py-2 text-left">Typical RL</th>
              <th className="px-3 py-2 text-left">Common use</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">SC/UPC</td>
              <td className="px-3 py-2">Flat-polished (blue)</td>
              <td className="px-3 py-2">≤0.3 dB</td>
              <td className="px-3 py-2">≥−45 dB</td>
              <td className="px-3 py-2">OLT ports, patch panels</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">SC/APC</td>
              <td className="px-3 py-2">8° angled polish (green)</td>
              <td className="px-3 py-2">≤0.3 dB</td>
              <td className="px-3 py-2">≥−65 dB</td>
              <td className="px-3 py-2">PON drops, CATV, high-RL systems</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">LC/UPC</td>
              <td className="px-3 py-2">Flat-polished, small form</td>
              <td className="px-3 py-2">≤0.2 dB</td>
              <td className="px-3 py-2">≥−45 dB</td>
              <td className="px-3 py-2">SFP transceivers, dense equipment</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">FC/UPC</td>
              <td className="px-3 py-2">Screw-on, flat-polished</td>
              <td className="px-3 py-2">≤0.3 dB</td>
              <td className="px-3 py-2">≥−45 dB</td>
              <td className="px-3 py-2">OTDR ports, lab equipment, legacy OSP</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm text-slate-300/90 mt-2">
          <strong>Critical: Never mate APC to UPC.</strong> Mismatching APC (green, 8° angle) and UPC (blue, flat) connectors physically damages the angled face and generates ~3–4 dB insertion loss. Always visually confirm color before mating.
        </p>

        <h3 className="mt-5 font-semibold">Aerial vs. Underground: Key Installation Differences</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Parameter</th>
              <th className="px-3 py-2 text-left">Aerial (lashed or ADSS)</th>
              <th className="px-3 py-2 text-left">Underground (conduit or direct-buried)</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Pulling method</td>
              <td className="px-3 py-2">Lashing machine (cable lashed to messenger wire) or self-supporting ADSS</td>
              <td className="px-3 py-2">Winch or jet (air-blown) through conduit</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Max pulling tension</td>
              <td className="px-3 py-2">ADSS rated by span; lashed cable rated by central member</td>
              <td className="px-3 py-2">600–1000 lbs for armored; lower for non-armored</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Key hazard</td>
              <td className="px-3 py-2">Proximity to power lines (NESC clearances), fall hazard on poles</td>
              <td className="px-3 py-2">Over-tension in long runs, abrasion on conduit sweeps</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Slack storage</td>
              <td className="px-3 py-2">Figure-8 loops at terminals; mid-span slack loops at poles</td>
              <td className="px-3 py-2">Coiled in handholes and splice vaults</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Worked Scenario: Conduit Pull</h3>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm space-y-2 text-slate-300/90">
          <p><strong>Route:</strong> 800 ft of 1.25" HDPE conduit with three 90° sweeps. Pulling 288-ct SMF cable (max pulling tension: 600 lbs).</p>
          <p><strong>Setup:</strong> Attach Kellems grip to cable pulling eye. Attach dynamometer between winch and grip. Pre-lubricate conduit with cable pulling gel (not soap — soap dries and increases friction). Mark cable every 50 ft.</p>
          <p><strong>During pull:</strong> Winch at 30 ft/min. Dynamometer reads 180 lbs at start (friction in bends). At 400 ft, tension spikes to 520 lbs — 87% of the 600 lb limit. Stop. Add more lubricant at the nearest handhole. Tension drops to 320 lbs. Complete the pull.</p>
          <p><strong>After pull:</strong> Leave 25 ft slack at each end, coiled and secured with velcro. Verify no kinks or sharp bends. OTDR the cable: 0.20 dB/km @ 1550 nm across all fibers. No events. Accept.</p>
          <p><strong>Lesson:</strong> A tension reading above 80% of max (480 lbs) is a warning — add lube rather than continuing. Exceeding the limit at the next sweep could break fibers with no visible external damage.</p>
        </div>
      </section>

      {/* ── TYING IT TOGETHER ───────────────────────────────────────────── */}
      <section className="mt-8 rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-slate-200">Tying It Together</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Installation techniques connect design intent (T06, T07) to working fiber (T22.L03 splicing, T22.L04 testing).
          A poorly pulled cable — one that exceeded tension limits, has a tight coil, or was kinked — will test poorly or fail early.
          The rules (600 lb limit, 20× OD bend radius, 15–25 ft slack) are derived from real failure modes in production deployments.
          For the CFOT exam, know the numbers: 10× OD during pull, 20× OD at rest, ≤0.2 dB splice loss acceptance, APC/UPC never mated together.
          These appear both as direct-recall questions and as scenario questions where you must identify what went wrong on a job.
        </p>
      </section>

      {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
      <Flashcard
        deckId="T22-L05"
        cards={[
          { id: 'T22-L05-FC-1', front: 'Cable pulling', back: 'The process of installing fiber cable from one point to another. Must respect maximum pulling tension and maintain minimum bend radius.' },
          { id: 'T22-L05-FC-2', front: 'Pulling tension (maximum allowable)', back: 'The maximum force that can safely be applied to a cable during installation, typically 600–1000 lbs depending on cable type. Measured with a dynamometer.' },
          { id: 'T22-L05-FC-3', front: 'Slack storage', back: 'Organized coils of excess cable at termination points, providing room for splicing, future repairs, and network growth. Typically 15–25 feet at a terminal.' },
          { id: 'T22-L05-FC-4', front: 'Bend radius (installation)', back: 'Temporary minimum bend radius during cable pulling: 10× cable OD. For a ¾" cable, minimum radius is 7.5 inches.' },
          { id: 'T22-L05-FC-5', front: 'Bend radius (long-term)', back: 'Permanent minimum bend radius after installation: 20× cable OD. For a ¾" cable, minimum radius is 15 inches.' },
          { id: 'T22-L05-FC-6', front: 'Termination', back: 'The process of preparing a fiber end for connection (splicing or connector termination), including cleaving and polishing.' },
          { id: 'T22-L05-FC-7', front: 'Polishing (fiber end prep)', back: 'Using progressively finer ceramic pads to smooth a fiber end to a mirror finish. Required for connector termination; NOT required for fusion splicing.' },
          { id: 'T22-L05-FC-8', front: 'Cleaver (mechanical)', back: 'A hand tool that cleanly cuts a fiber perpendicular to its axis by scribing a groove and applying tension.' },
          { id: 'T22-L05-FC-9', front: 'Polishing pad', back: 'A ceramic substrate with a specific grit size (12 µm, 5 µm, 1 µm) used to progressively smooth a cleaved fiber end.' },
          { id: 'T22-L05-FC-10', front: 'Macrobend loss', back: 'Signal loss caused by too-tight coiling of fiber cable, even though no visible damage is present. Detected by OTDR.' },
        ]}
      />

      {/* ── QUIZ ────────────────────────────────────────────────────────── */}
      <Quiz
        title="T22.L05 Check — Installation Techniques"
        mode="multiple-choice"
        questions={[
          {
            id: 'T22-L05-Q1',
            type: 'mc',
            prompt:
              'A ¾" fiber cable has a maximum pulling tension of 800 lbs. What is the minimum bend radius during pulling?',
            choices: [
              '2.4 inches (4× OD)',
              '7.5 inches (10× OD)',
              '15 inches (20× OD)',
              'There is no minimum bend radius during pulling, only after installation',
            ],
            answerIndex: 1,
            explanation:
              '10× cable OD is the installation bend radius rule. For a ¾" (19 mm) cable, 10 × 0.75 = 7.5 inches. 20× OD applies after installation when the cable is at rest.',
          },
          {
            id: 'T22-L05-Q2',
            type: 'mc',
            prompt:
              'You are pulling a cable and notice it starts to kink at a corner. You apply more pulling force to work it through. What should you happen?',
            choices: [
              'Continue pulling — kinks straighten out once the cable is fully deployed',
              'Stop immediately. A kink indicates the fiber inside is probably broken. Cut out the kinked section.',
              'Slow down and apply a gradual steady pull instead of jerks',
              'Reduce pulling force and use a gentler radius through the corner',
            ],
            answerIndex: 1,
            explanation:
              'A kink is a hard failure — fiber inside is almost certainly broken. Once kinked, the cable is compromised. The only fix is to cut out the kinked section and re-pull from that point forward.',
          },
          {
            id: 'T22-L05-Q3',
            type: 'fill-in-blank',
            prompt:
              'At a pole terminal, you should organize ____ feet of slack cable for splicing and future growth.',
            answer: '15-25',
            answerDisplay: '15–25 feet',
            explanation:
              'Standard practice is 15–25 feet at a terminal or pedestal. This provides room for the splicing process and future cable additions.',
          },
          {
            id: 'T22-L05-Q4',
            type: 'mc',
            prompt:
              'You are coiling excess cable at a termination point. What should you use to secure the coils?',
            choices: [
              'Zip ties (tight)',
              'Velcro straps (snug but not crushing)',
              'Fiber optic cable grips (mechanical clamps)',
              'Electrical tape wrapped around the bundle',
            ],
            answerIndex: 1,
            explanation:
              'Velcro is the standard — it provides support without crushing the buffer tubes. Zip ties are too rigid and can crush tubes. Grips and tape are overkill and damage the cable.',
          },
          {
            id: 'T22-L05-Q5',
            type: 'mc',
            prompt:
              'Polishing a fiber end (on ceramic pads with progressively finer grits) is required for which type of termination?',
            choices: [
              'Fusion splicing',
              'Mechanical splicing',
              'Connector termination (LC, SC, APC)',
              'All of the above',
            ],
            answerIndex: 2,
            explanation:
              'Polishing is required for connectors — it creates a mirror finish that minimizes reflection and loss at the interface. Fusion splicing and mechanical splicing do NOT require polishing; the cleaved end is used as-is.',
          },
        ]}
      />

    </LessonLayout>
  );
}
