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
  vocabulary_introduced: [],
  vocabulary_assumed: [
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'grounding', source_lesson_id: 'T14.L01' },
  ],
};

export const key_terms = [];

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

      <section data-tier="working">
        <h2>When RUS Standards Apply</h2>
        <p className="mt-2">On RUS-funded projects: RUS takes precedence. If NESC, BICSI, and RUS diverge, follow RUS. Example: NESC doesn't require optical fiber testing. RUS requires OLTS test before acceptance. On RUS project: do the test.</p>
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
        ]}
      />
    </LessonLayout>
  );
}
