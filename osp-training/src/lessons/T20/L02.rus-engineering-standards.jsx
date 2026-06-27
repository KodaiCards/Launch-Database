import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T20.L02',
  course_id: 'T20',
  title: 'RUS Engineering Standards: Bulletins 1751F-630/635/810',
  order: 2,
  lesson_type: 'working',
  prerequisites: ['T01.L01', 'T04.L01', 'T05.L01', 'T06.L01', 'T14.L01', 'T18.L01'],
  learning_objectives: [
    'Identify RUS Bulletins 1751F-630, 1751F-635, and 1751F-810',
    'Explain RUS adoption of NESC with RUS-specific extensions',
    'Understand Form 219 grounding testing requirement (RUS-only)',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'RUS Bulletin 1751F-630',
    'RUS Bulletin 1751F-635',
    'RUS Bulletin 1751F-810',
    'Form 219',
    'design certification',
  ],
  vocabulary_assumed: [
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'grounding', source_lesson_id: 'T14.L01' },
  ],
};

export const key_terms = [
  {
    term: 'RUS Bulletin 1751F-630',
    definition: 'Aerial Plant: covers poles, NESC clearance, make-ready, and Form 219 testing for RUS-funded aerial construction.',
  },
  {
    term: 'RUS Bulletin 1751F-635',
    definition: 'Underground: covers duct, conduit, burial depth, and cable terminations for RUS-funded underground construction.',
  },
  {
    term: 'RUS Bulletin 1751F-810',
    definition: 'Electrical Protection: covers grounding, bonding, primary protectors, and Form 219 testing for RUS-funded projects.',
  },
  {
    term: 'Form 219',
    definition: 'RUS-required form documenting ground-rod resistance testing per IEEE 81, proving resistance meets RUS threshold, with engineer sign-off before acceptance. RUS-only — non-RUS projects do not mandate Form 219.',
  },
  {
    term: 'design certification',
    definition: 'Engineer sign-off confirming design meets RUS Bulletins. Required before RUS releases loan funds for construction.',
  },
];

export default function T20L02_RUSEngineeringStandards() {
  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>RUS adopted NESC as baseline engineering standard. RUS Bulletins clarify which NESC sections apply and where RUS adds stricter requirements. Three main Bulletins: 1751F-630 (Aerial), 1751F-635 (Underground), 1751F-810 (Electrical Protection). Understanding these is the difference between designing "to NESC" and "to RUS."</p>

        <h3 className="mt-4 font-semibold">Three foundational RUS Bulletins</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-300/90">
          <div className="rounded bg-white/5 p-3">
            <p className="font-mono font-semibold">1751F-630 — Aerial Plant</p>
            <p>Poles, NESC clearance, make-ready, form 219 testing</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-mono font-semibold">1751F-635 — Underground</p>
            <p>Duct, conduit, burial depth, cable terminations</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-mono font-semibold">1751F-810 — Electrical Protection</p>
            <p>Grounding, bonding, primary protectors, Form 219 testing</p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">RUS-specific: Form 219 grounding test</h3>
        <p className="mt-2">NESC doesn't mandate measured ground-rod testing. RUS requires Form 219: (1) measure ground-rod resistance per IEEE 81, (2) prove resistance &lt;5Ω (varies by region), (3) engineer sign-off before acceptance. This is RUS-only — non-RUS projects don't mandate Form 219.</p>
      </section>

      <Flashcard
        deckId="T20-L02"
        cards={[
          {
            id: 'T20-L02-fc-630',
            front: 'What does RUS Bulletin 1751F-630 cover?',
            back: 'Aerial Plant: covers poles, NESC clearance, make-ready, and Form 219 testing for RUS-funded aerial construction.',
          },
          {
            id: 'T20-L02-fc-635',
            front: 'What does RUS Bulletin 1751F-635 cover?',
            back: 'Underground: covers duct, conduit, burial depth, and cable terminations for RUS-funded underground construction.',
          },
          {
            id: 'T20-L02-fc-810',
            front: 'What does RUS Bulletin 1751F-810 cover?',
            back: 'Electrical Protection: covers grounding, bonding, primary protectors, and Form 219 testing for RUS-funded projects.',
          },
          {
            id: 'T20-L02-fc-219',
            front: 'What is RUS Form 219 and what makes it RUS-specific?',
            back: 'RUS-required form documenting ground-rod resistance testing per IEEE 81, proving resistance meets RUS threshold, with engineer sign-off before acceptance. RUS-only — non-RUS projects do not mandate Form 219.',
          },
          {
            id: 'T20-L02-fc-cert',
            front: 'What is design certification on an RUS project?',
            back: 'Engineer sign-off confirming design meets RUS Bulletins. Required before RUS releases loan funds for construction.',
          },
        ]}
      />

      <section data-tier="working">
        <h2>When RUS Standards Apply</h2>
        <p className="mt-2">On RUS-funded projects: RUS takes precedence. If NESC, BICSI, and RUS diverge, follow RUS. Example: NESC doesn't require optical fiber testing. RUS requires OLTS test before acceptance. On RUS project: do the test.</p>

        <h3 className="mt-4 font-semibold">Bulletin Detail: 1751F-630 Aerial Plant</h3>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm space-y-2">
          <p>1751F-630 is the primary aerial OSP engineering document. Key requirements:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-300/90">
            <li><strong>Pole loading:</strong> Uses NESC Grade B loading (medium-loading district default for rural areas) with RUS-specific pole-class tables based on span length, cable type, and ice/wind zone.</li>
            <li><strong>Make-ready:</strong> Defines minimum clearances for new telecom attachments on joint-use poles (typically 40 in. minimum between electric and telecom, plus per NESC Rule 232 horizontal clearances).</li>
            <li><strong>Span length limits:</strong> Maximum span by pole class and loading zone. Exceeding span limits requires a larger pole class or intermediate pole — both require cost justification in Form 307.</li>
            <li><strong>Staking sheets:</strong> 1751F-630 specifies what must appear on staking sheets: pole number, class, height, span length, loading calc, attachment height, ground clearance, and PE certification.</li>
            <li><strong>Form 219 requirement:</strong> Aerial ground rod measured within 6 months of construction. If result ≥25 Ω at an aerial location, supplemental electrode required before acceptance.</li>
          </ul>
        </div>

        <h3 className="mt-4 font-semibold">Bulletin Detail: 1751F-810 Electrical Protection</h3>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm space-y-2">
          <p>1751F-810 covers grounding and electrical protection. Critical items:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-300/90">
            <li><strong>Ground rod spacing:</strong> Minimum one ground rod per mile (1,320 ft) on aerial plant, with rod at every terminal and every splice closure.</li>
            <li><strong>Resistance threshold:</strong> Aerial rod ≤25 Ω; CO/vault ≤5 Ω (per IEEE 81-2012 fall-of-potential method).</li>
            <li><strong>Primary protectors:</strong> Required at every subscriber drop; protector must be bonded to GES. Spec in 1751F-810 references TIA-968-A-compatible protectors.</li>
            <li><strong>Form 219 logging:</strong> Each measured rod gets a Form 219 entry: GPS coordinates, measured resistance, test method, date, and engineer signature.</li>
            <li><strong>Corrective action:</strong> If rod exceeds threshold, two options: (1) drive a second rod ≥8 ft away, parallel-bond both (re-test combined); (2) chemical ground enhancement (not preferred by RUS in most soils).</li>
          </ul>
        </div>

        <h3 className="mt-4 font-semibold">Bulletin Detail: 1751F-635 Underground Plant</h3>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm space-y-2">
          <p>1751F-635 covers underground conduit and direct-buried cable. Key items:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-300/90">
            <li><strong>Burial depth:</strong> RUS specifies minimum 36 in. under paved roads, 24 in. under non-paved areas, 18 in. under driveways. Note: some state DOTs require deeper (e.g., 48 in. under state highways) — use the stricter.</li>
            <li><strong>Conduit type:</strong> HDPE (Schedule 40) preferred for direct buried runs. PVC Schedule 40 acceptable for shorter runs. SDR-rated HDPE for HDD (directional bore) pulls.</li>
            <li><strong>Bore tolerances:</strong> HDD bore depth vs. planned depth, bore radius vs. minimum bend, exit angle — all must be documented. RUS requires as-built bore profile for any bore &gt;200 ft.</li>
            <li><strong>Handhole/vault placement:</strong> Maximum pull-length between handholes determined by conduit inner diameter and cable pulling tension calculation. 1751F-635 specifies max pulling tension by cable type.</li>
          </ul>
        </div>

        <h3 className="mt-4 font-semibold">Book vs. Field: Form 219 Testing</h3>
        <div className="rounded bg-amber-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-amber-300">Book</p>
          <p className="text-slate-300/90 mt-1">IEEE 81-2012 fall-of-potential method: drive current probe 100 ft from ground rod, potential probe at 62% (62 ft) between rod and current probe. Measure V/I = resistance. Simple.</p>
        </div>
        <div className="rounded bg-green-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-green-300">Field</p>
          <p className="text-slate-300/90 mt-1">Real rural OSP: pole in rocky soil, 2 ft of topsoil then granite — ground rod may only penetrate 4 ft. Resistance reads 180 Ω. RUS Form 219 requires ≤25 Ω. Options: drive second rod (rocky soil — nearly impossible), chemical enhancement, or relocate ground point to a nearby area with deeper soil. All three options must be documented on Form 219 with a corrective action note. Never just fill in a passing number — RUS auditors compare Form 219 dates to contractor daily logs.</p>
        </div>
      </section>

      {/* ── TYING IT TOGETHER ──────────────────────────────────────────────────── */}
      <section className="mt-8 rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-slate-200">Tying It Together</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Earlier you learned about <strong>NESC</strong> (T05), <strong>grounding</strong> (T14), and <strong>safety protocols</strong> (T18).
          RUS takes those base standards and tightens them. Form 219 grounding testing exemplifies this: NESC sets the pole loading rules,
          RUS says "plus measured ground-rod verification." The RUS Bulletins (1751F-630/635/810) are essentially "NESC + RUS additions."
          When you're designing an RUS project, you're not abandoning NESC — you're meeting NESC PLUS the RUS-specific requirements on top.
        </p>
      </section>

      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T20-L02-Q1',
            type: 'mc',
            prompt: 'What does RUS Bulletin 1751F-630 cover?',
            options: [
              { key: 'a', text: 'Electrical protection' },
              { key: 'b', text: 'Aerial plant engineering' },
              { key: 'c', text: 'Underground burial' },
              { key: 'd', text: 'Cost accounting' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L02-Q2',
            type: 'mc',
            prompt: 'RUS Form 219 is used for documenting:',
            options: [
              { key: 'a', text: 'Ground-rod resistance testing' },
              { key: 'b', text: 'Contractor qualifications' },
              { key: 'c', text: 'Project budgets' },
              { key: 'd', text: 'Cable inventory' },
            ],
            correct: 'a',
          },
          {
            id: 'T20-L02-Q3',
            type: 'mc',
            prompt: 'Which RUS Bulletin covers underground conduit and cable burial depth?',
            options: [
              { key: 'a', text: '1751F-630 (Aerial Plant)' },
              { key: 'b', text: '1751F-635 (Underground Plant)' },
              { key: 'c', text: '1751F-810 (Electrical Protection)' },
              { key: 'd', text: 'Form 219' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L02-Q4',
            type: 'mc',
            prompt: 'On an RUS-funded project, "design certification" means:',
            options: [
              { key: 'a', text: 'The contractor stamps the staking sheets with a PE seal' },
              { key: 'b', text: "The borrower's engineer signs off that the design meets RUS Bulletins, which is required before RUS releases loan funds for construction" },
              { key: 'c', text: 'USDA-RUS field inspectors walk the route before approving construction' },
              { key: 'd', text: 'The contractor certifies that subcontractors carry the required insurance' },
            ],
            correct: 'b',
          },
        ]}
      />
    </LessonLayout>
  );
}
