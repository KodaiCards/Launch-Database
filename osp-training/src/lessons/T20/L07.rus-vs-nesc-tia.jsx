import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T20.L07',
  course_id: 'T20',
  title: 'RUS vs. NESC/TIA Reconciliation: When All Three Apply',
  order: 7,
  prerequisites: ['T05.L01', 'T06.L01', 'T14.L01', 'T19.L01'],
  learning_objectives: [
    'Resolve conflicts when NESC, TIA-607, and RUS all apply',
    'Understand RUS precedence on RUS-funded projects',
    'Apply reconciliation to joint-use pole + grounding scenario',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [],
  vocabulary_assumed: [
    { term: 'NESC', source_lesson_id: 'T05.L01' },
  ],
};

export const key_terms = [];

export default function T20L07_Reconciliation() {
  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>Real projects often have multiple standards layers: NESC (electrical safety), TIA-607 (fiber grounding), RUS Bulletins (rural telecom practices). When they diverge, RUS wins on RUS-funded projects. This lesson teaches you how to spot conflicts and resolve them using RUS as the authoritative source.</p>

        <h3 className="mt-4 font-semibold">Three standards, one project</h3>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm">
          <p className="font-semibold">NESC (electrical safety, T05 prereq)</p>
          <p className="text-slate-300/90 mt-1">Sets minimum electrical clearance, pole loading, grounding principles. Applies to all poles (electric, telecom, joint-use). NESC does not mandate fiber testing or Form 219.</p>
        </div>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm">
          <p className="font-semibold">TIA-607 (grounding + bonding, T14 prereq)</p>
          <p className="text-slate-300/90 mt-1">Fiber-specific grounding standard. Sets electrode resistance targets, bonding hardware specs, surge protection principles. TIA-607 is agnostic to RUS.</p>
        </div>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm">
          <p className="font-semibold">RUS Bulletins (RUS requirement, T20)</p>
          <p className="text-slate-300/90 mt-1">Adopt NESC as minimum. Add RUS-specific testing (Form 219), RUS pole-loading tables, RUS certification workflows. RUS does not contradict NESC/TIA; RUS adds.</p>
        </div>

        <h3 className="mt-5 font-semibold">Reconciliation rule on RUS projects</h3>
        <p className="mt-2"><strong>Hierarchy: RUS takes precedence.</strong> If all three agree: implement all. If NESC or TIA exceeds RUS: do the stricter standard (more safety). If RUS exceeds NESC/TIA: do RUS (loan covenant). Example: TIA-607 says ground electrode under 5Ω optimal. RUS Form 219 requires under 5Ω. Both agree: install under 5Ω. No conflict.</p>
      </section>

      <section data-tier="working">
        <h2>Worked Scenario: Joint-Use Pole + RUS</h2>

        <p className="mt-2"><strong>Setup:</strong> Rural telephone coop builds FTTH on wooden poles shared with electric co-op. Both telecom (RUS-funded) and electric sides are in place. Design must satisfy: NESC (applies to all), TIA-607 (fiber side), RUS Bulletins (RUS project).</p>

        <h3 className="mt-4 font-semibold">Checkpoint 1: Pole Clearance (NESC Rule 232)</h3>
        <div className="space-y-2 text-sm">
          <div className="rounded bg-blue-900/30 p-3">
            <p className="font-semibold text-blue-300">NESC Rule 232 (T05 prereq)</p>
            <p className="text-slate-300/90 mt-1">3 ft horizontal clearance from electric to telecom. NESC minimum applies.</p>
          </div>
          <div className="rounded bg-purple-900/30 p-3">
            <p className="font-semibold text-purple-300">RUS 1751F-630 pole-loading table</p>
            <p className="text-slate-300/90 mt-1">RUS table assumes rural telecom cable bundle (heavier than residential). Pole class selection may differ from NESC minimum. RUS table: use this one for load calculations.</p>
          </div>
          <p className="mt-2 text-slate-300/90"><strong>Resolution:</strong> Use NESC clearance (3 ft); use RUS pole-loading table for class selection.</p>
        </div>

        <h3 className="mt-4 font-semibold">Checkpoint 2: Grounding (TIA-607 + RUS Form 219)</h3>
        <div className="space-y-2 text-sm">
          <div className="rounded bg-green-900/30 p-3">
            <p className="font-semibold text-green-300">TIA-607 (T14 prereq)</p>
            <p className="text-slate-300/90 mt-1">Recommends ground electrode under 5Ω. Sets bonding copper sizing. Requires service loop for future rework.</p>
          </div>
          <div className="rounded bg-purple-900/30 p-3">
            <p className="font-semibold text-purple-300">RUS Form 219</p>
            <p className="text-slate-300/90 mt-1">REQUIRES measured ground electrode under or equal to RUS limit (typically under 5Ω for new aerial). Engineer signature required pre-acceptance.</p>
          </div>
          <p className="mt-2 text-slate-300/90"><strong>Resolution:</strong> Design to TIA-607 (5Ω target). Measure per IEEE 81 (Form 219). Document in Form 219. Both standards aligned.</p>
        </div>
      </section>

      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T20-L07-Q1',
            type: 'mc',
            prompt: 'On an RUS-funded project, if RUS and NESC diverge, which applies?',
            options: [
              { key: 'a', text: 'NESC (federal electrical standard)' },
              { key: 'b', text: 'RUS (loan covenant)' },
              { key: 'c', text: 'Whichever is less costly' },
              { key: 'd', text: 'Engineer discretion' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L07-Q2',
            type: 'mc',
            prompt: 'On a joint-use pole, NESC Rule 232 sets clearance at 3 ft. RUS Bulletin says use RUS pole-loading table (heavier than NESC minimum). How do you resolve?',
            options: [
              { key: 'a', text: 'Ignore NESC, use RUS pole table only' },
              { key: 'b', text: 'Use NESC clearance (3 ft); use RUS table for pole class selection' },
              { key: 'c', text: 'Negotiate with electric co-op for waiver' },
              { key: 'd', text: 'Pick the larger clearance' },
            ],
            correct: 'b',
          },
        ]}
      />
    </LessonLayout>
  );
}
