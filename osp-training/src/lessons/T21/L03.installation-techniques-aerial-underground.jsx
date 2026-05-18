import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T21.L03',
  course_id: 'T21',
  title: 'Installation Techniques: Aerial vs. Underground OSP Cable',
  order: 3,
  lesson_type: 'cert-prep',
  prerequisites: ['T21.L02', 'T03.L01', 'T05.L01', 'T06.L01'],
  learning_objectives: [
    'Compare aerial and underground installation methods and when each applies in OSP deployments',
    'Identify critical clearance requirements, burial depth, and conduit specifications per NESC',
    'Understand cable pulling practices, tension limits, and bend-radius compliance in the field',
    'Distinguish between direct-burial and conduit-based underground methods',
    'Apply this knowledge to practical exam scenarios involving site-specific installation choices',
  ],
  estimated_minutes: 22,
  vocabulary_introduced: [
    'Aerial installation',
    'Underground installation',
    'Direct burial',
    'Conduit-based installation',
    'Cable pulling tension',
    'Bend radius (field context)',
    'Clearance (NESC)',
  ],
  vocabulary_assumed: [
    { term: 'OSP cable', source_lesson_id: 'T03.L01' },
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'pole', source_lesson_id: 'T01.L02' },
    { term: 'burial depth', source_lesson_id: 'T06.L01' },
    { term: 'splice case', source_lesson_id: 'T01.L03' },
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T21L03_InstallationTechniques() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Most fiber OSP installations in rural America use one of two strategies: run the cable
          on poles (aerial), or bury it in the ground (underground). Each has different rules for
          clearance, pulling tension, conduit use, and burial depth. The CFOS-O exam tests whether
          you know when to use which method and what the field requirements are for each.
        </p>

        <h3 className="mt-4 font-semibold">Aerial installation: cable on poles</h3>
        <p className="mt-2">
          Aerial fiber is lashed or strapped to an existing pole plant. The pole already carries
          power and other utilities. Your fiber joins them on the same pole. Why? Fast to deploy,
          minimal ground-disturbance, ROW acquisition is already done (power crossed these routes
          decades ago). Downsides: clearance to power and other utilities is strict, and weather
          (ice load, wind) can stress the cable if not designed correctly.
        </p>

        <h3 className="mt-5 font-semibold">Underground installation: cable in the ground</h3>
        <p className="mt-2">
          Underground fiber is placed in a trench at a specified depth, either direct-buried or
          inside a conduit. Why? Eliminates clearance issues, hides the infrastructure, protects
          from weather and third-party damage (animal bites, third-party trenching). Downsides:
          higher installation cost (excavation), longer permitting (call-811), and repair is disruptive
          if the cable gets damaged.
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
              <td className="px-3 py-2 font-mono">DNB</td>
              <td className="px-3 py-2">Direct-Buried cable</td>
              <td className="px-3 py-2">Fiber placed straight in ground without conduit. Cheap, fast, vulnerable.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PVC</td>
              <td className="px-3 py-2">Polyvinyl Chloride conduit</td>
              <td className="px-3 py-2">Plastic tube protecting fiber in ground. Cheap, rigid, long-lived.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDPE</td>
              <td className="px-3 py-2">High-Density Polyethylene conduit</td>
              <td className="px-3 py-2">Plastic tube, more flexible than PVC. Cost premium but handles soil movement better.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Lashing</td>
              <td className="px-3 py-2">Mechanical binding method</td>
              <td className="px-3 py-2">Wire or strap wrapping fiber to pole. Requires periodic re-tension as cable settles.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Aerial Installation — Engineering Requirements</h2>

        <h3 className="mt-4 font-semibold">Clearance to electrical power</h3>
        <p className="mt-2">
          NESC Rule 234 and 235 specify minimum horizontal and vertical clearance from power lines.
          For a 0–750V circuit, clearance is typically <strong>12 inches horizontal</strong> or
          <strong> 18 inches vertical</strong> when the fiber is on the same pole. Why these limits?
          If the power line falls or breaks, the gap must be wide enough to prevent contact with fiber.
          If the fiber falls, it shouldn't touch the power line.
        </p>
        <p className="mt-3">
          In practice, crews measure this with a ruler or measuring tape at multiple points along the
          pole. If clearance is violated, the design is wrong — power must be relocated (expensive) or
          your fiber must be underground instead. No shortcuts.
        </p>

        <h3 className="mt-5 font-semibold">Sag and tension in the field</h3>
        <p className="mt-2">
          Aerial fiber is subject to ice load, wind, and gravity. Sag is the vertical drop of the cable
          at midspan between two poles. Too much sag → clearance is lost or cable hits other utilities.
          Too little → tension is high, stressing the cable and the pole hardware.
        </p>
        <p className="mt-3">
          For OSP fiber on poles, pulling tension is typically kept below <strong>500 lbs per strand</strong>.
          This is enforced during installation: a dynamometer measures the tension on the pulling rope.
          If tension exceeds the limit, the crew stops, uses a different pulling method (more sheaves,
          less vertical rise, shorter span), and tries again at lower tension.
        </p>

        <h3 className="mt-5 font-semibold">Lashing vs. strapping</h3>
        <p className="mt-2">
          <strong>Lashing:</strong> Steel wire spiral-wrapped tightly around fiber and pole. Very secure,
          standard in high-wind areas. Requires special equipment (lashing machine on a bucket truck).
          Tightness degrades over time; field crews periodically re-tension.
        </p>
        <p className="mt-3">
          <strong>Strapping:</strong> Polymer or stainless-steel bands (like giant zip-ties) clipped around
          fiber and pole at intervals (~4 ft apart). Faster than lashing, less labor-intensive. Popular
          in moderate-wind areas where cost matters more than maximum security.
        </p>

        <h3 className="mt-5 font-semibold">Practical exam focus: aerial design checklist</h3>
        <div className="rounded-lg bg-blue-950/30 border border-blue-500/20 p-4 mt-3 space-y-2 text-sm">
          <p>✓ Clearance to power verified at all poles</p>
          <p>✓ Sag calculated and compliant with NESC loading district</p>
          <p>✓ Pulling tension ≤ manufacturer limit (usually 500 lbs OSP)</p>
          <p>✓ Lashing or strapping method chosen per site wind exposure</p>
          <p>✓ Attachment hardware rated for expected load</p>
        </div>

        <h2 className="mt-8">Underground Installation — Burial Depth + Conduit</h2>

        <h3 className="mt-4 font-semibold">Direct-burial cable (DNB)</h3>
        <p className="mt-2">
          Direct-buried fiber is placed straight into a trench, no conduit, at a specified depth.
          Depth is typically <strong>18–24 inches</strong> in areas with no farming or construction
          risk; <strong>30+ inches</strong> where heavy machinery operates.
        </p>
        <p className="mt-3">
          Why the depth? Shallow burial risks third-party damage (lawn tractor, digger). Deeper burial
          is safer but more expensive (more excavation). RUS Bulletin 1753 specifies depth by soil
          type and risk category. You must verify the design matches the site conditions before installation.
        </p>
        <p className="mt-3">
          Direct-burial <strong>advantage:</strong> low cost. <strong>Disadvantage:</strong> once buried,
          you can't easily repair. If the cable is damaged in the field, the only fix is excavate, splice
          (if possible), and bury again. Many operators avoid DNB for that reason.
        </p>

        <h3 className="mt-5 font-semibold">Conduit-based burial</h3>
        <p className="mt-2">
          Fiber inside a conduit (PVC, HDPE, etc.) is protected from soil pressure and chemical exposure.
          Standard materials:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>PVC:</strong> 4-inch ID typical; rigid; 50-year life in good soil</li>
          <li><strong>HDPE:</strong> 3.5-inch ID typical; flexible; handles soil movement; slightly more cost</li>
        </ul>
        <p className="mt-3">
          Conduit is placed at the same burial depth (18–30 inches). Fiber is pulled through after conduit
          is set. This allows future replacement: if the fiber is damaged, you can pull it out and replace
          without digging.
        </p>

        <h3 className="mt-5 font-semibold">Cable pulling in conduit</h3>
        <p className="mt-2">
          Pulling fiber through conduit requires lubrication (soap or specialized duct lube) and attention
          to bend radius at entry/exit points. Pulling tension is kept low because the conduit adds friction.
          Typical maximum pulling tension in conduit: <strong>200–300 lbs</strong> (lower than aerial).
        </p>
        <p className="mt-3">
          If tension exceeds the limit partway through, the crew must (a) stop and wait for the lube to set,
          (b) pull from both ends (mechanical advantage), or (c) install intermediate splice cases to shorten
          the pull distance. No shortcuts — exceeding tension risks damaging the fiber.
        </p>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: Installation Method Trade-offs</h2>

        <h3 className="mt-4 font-semibold">Decision factors: aerial vs. underground</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5">
            <tr className="border-b border-white/10">
              <th className="px-3 py-2 text-left">Factor</th>
              <th className="px-3 py-2 text-left">Aerial</th>
              <th className="px-3 py-2 text-left">Underground</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-b border-white/10">
              <td className="px-3 py-2 font-semibold">Cost per mile</td>
              <td className="px-3 py-2">$15K–$25K</td>
              <td className="px-3 py-2">$25K–$50K+</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="px-3 py-2 font-semibold">Deployment time</td>
              <td className="px-3 py-2">Days to weeks</td>
              <td className="px-3 py-2">Weeks to months</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="px-3 py-2 font-semibold">ROW acquisition</td>
              <td className="px-3 py-2">Already exists (power pole)</td>
              <td className="px-3 py-2">Requires new easement or permit</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="px-3 py-2 font-semibold">Clearance complexity</td>
              <td className="px-3 py-2">High (power, comms)</td>
              <td className="px-3 py-2">Low (no overhead)</td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="px-3 py-2 font-semibold">Repair/maintenance</td>
              <td className="px-3 py-2">Visible, accessible</td>
              <td className="px-3 py-2">Buried, disruptive to repair</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-semibold">Weather exposure</td>
              <td className="px-3 py-2">High (ice, wind)</td>
              <td className="px-3 py-2">Low (protected)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 font-semibold">Hybrid approaches</h3>
        <p className="mt-2">
          Real-world projects often mix methods. Example: backbone on poles from the CO to the first
          intersection, then underground to avoid a power-line conflict, then back to poles in a rural
          cluster. Each segment gets the method best-suited to its constraints.
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
            id: 'T21.L03.Q1',
            type: 'multiple-choice',
            question: 'NESC Rule 234 specifies minimum clearance from power lines. For 0–750V, what is the typical vertical clearance on a joint-use pole?',
            options: [
              { id: 'a', text: '6 inches' },
              { id: 'b', text: '12 inches' },
              { id: 'c', text: '18 inches', isCorrect: true },
              { id: 'd', text: '24 inches' },
            ],
            rationale: 'NESC Rule 235 specifies 18 inches vertical clearance for 0–750V circuits. This protects against power-line sag or fiber drop.',
          },
          {
            id: 'T21.L03.Q2',
            type: 'multiple-choice',
            question: 'What is the typical maximum pulling tension for OSP fiber during aerial installation on poles?',
            options: [
              { id: 'a', text: '200 lbs per strand' },
              { id: 'b', text: '350 lbs per strand' },
              { id: 'c', text: '500 lbs per strand', isCorrect: true },
              { id: 'd', text: '750 lbs per strand' },
            ],
            rationale: '500 lbs is the typical maximum for aerial OSP cable. Exceeding this risks damage to the fiber and overloading pole hardware.',
          },
          {
            id: 'T21.L03.Q3',
            type: 'multiple-choice',
            question: 'Direct-buried fiber is typically buried at what depth in areas with no heavy machinery traffic?',
            options: [
              { id: 'a', text: '6–12 inches' },
              { id: 'b', text: '18–24 inches', isCorrect: true },
              { id: 'c', text: '30–36 inches' },
              { id: 'd', text: '48+ inches' },
            ],
            rationale: 'Standard depth is 18–24 inches in low-risk areas. Deeper burial (30+ inches) is required where heavy equipment operates.',
          },
          {
            id: 'T21.L03.Q4',
            type: 'multiple-choice',
            question: 'What is the main advantage of conduit-based underground installation over direct-burial?',
            options: [
              { id: 'a', text: 'Lower initial cost' },
              { id: 'b', text: 'Faster installation' },
              { id: 'c', text: 'Easier future fiber replacement without excavation', isCorrect: true },
              { id: 'd', text: 'Shallower burial depth allowed' },
            ],
            rationale: 'Conduit allows the fiber to be pulled out and replaced if damaged, avoiding full excavation and disruption.',
          },
        ]}
      />
    </LessonLayout>
  );
}

function getDefinition(term) {
  const defs = {
    'Aerial installation': 'Fiber cable placed on poles using lashing or strapping; subject to clearance and ice-load rules.',
    'Underground installation': 'Fiber buried in ground, either direct-buried or in conduit; requires excavation and burial-depth compliance.',
    'Direct burial': 'Fiber placed straight in ground without protective conduit; low cost, high damage risk.',
    'Conduit-based installation': 'Fiber pulled through protective plastic tube (PVC/HDPE) in ground; allows future replacement.',
    'Cable pulling tension': 'Force exerted during fiber installation; must stay below manufacturer/standard limits to avoid damage.',
    'Bend radius (field context)': 'Minimum radius a fiber can bend without microbend loss; critical at conduit entry/exit and on poles.',
    'Clearance (NESC)': 'Minimum distance between fiber and electrical/communications lines to prevent hazardous contact.',
  };
  return defs[term] || '(definition not found)';
}
