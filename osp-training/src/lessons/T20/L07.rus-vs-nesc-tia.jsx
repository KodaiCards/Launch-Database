import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
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
  vocabulary_introduced: [
    'RUS precedence',
    'standards reconciliation',
    'stricter standard rule',
    'joint-use pole',
  ],
  vocabulary_assumed: [
    { term: 'NESC', source_lesson_id: 'T05.L01' },
  ],
};

export const key_terms = [
  {
    term: 'RUS precedence',
    definition: 'On RUS-funded projects, RUS takes precedence when RUS, NESC, and TIA diverge. RUS is the authoritative source because the loan covenant requires design to RUS Bulletins.',
  },
  {
    term: 'standards reconciliation',
    definition: 'The process of resolving conflicts when multiple standards (NESC, TIA-607, RUS Bulletins) all apply to the same project element. Rule: if NESC or TIA exceeds RUS, do the stricter standard; if RUS exceeds NESC/TIA, do RUS.',
  },
  {
    term: 'stricter standard rule',
    definition: 'When two applicable standards differ, implement the stricter one. On RUS projects: if NESC or TIA provides more safety margin than RUS requires, apply the stricter version. If RUS requires more than NESC/TIA, apply RUS.',
  },
  {
    term: 'joint-use pole',
    definition: 'A pole shared by both electric and telecom utilities. Joint-use poles require compliance with NESC (applies to both electric and telecom sides) plus any RUS requirements on the telecom side if the telecom project is RUS-funded.',
  },
];

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

      <Flashcard
        deckId="T20-L07"
        cards={[
          {
            id: 'T20-L07-fc-precedence',
            front: 'Which standard takes precedence on an RUS-funded project when NESC, TIA, and RUS conflict?',
            back: 'On RUS-funded projects, RUS takes precedence when RUS, NESC, and TIA diverge. RUS is the authoritative source because the loan covenant requires design to RUS Bulletins.',
          },
          {
            id: 'T20-L07-fc-reconcile',
            front: 'What is standards reconciliation?',
            back: 'The process of resolving conflicts when multiple standards (NESC, TIA-607, RUS Bulletins) all apply to the same project element. Rule: if NESC or TIA exceeds RUS, do the stricter standard; if RUS exceeds NESC/TIA, do RUS.',
          },
          {
            id: 'T20-L07-fc-stricter',
            front: 'What is the stricter standard rule?',
            back: 'When two applicable standards differ, implement the stricter one. On RUS projects: if NESC or TIA provides more safety margin than RUS requires, apply the stricter version. If RUS requires more than NESC/TIA, apply RUS.',
          },
          {
            id: 'T20-L07-fc-jointuse',
            front: 'What is a joint-use pole?',
            back: 'A pole shared by both electric and telecom utilities. Joint-use poles require compliance with NESC (applies to both electric and telecom sides) plus any RUS requirements on the telecom side if the telecom project is RUS-funded.',
          },
        ]}
      />

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

      <section className="mt-6 rounded-lg bg-white/5 p-4 text-sm">
        <h3 className="font-semibold text-slate-200">Standards Reconciliation Decision Matrix</h3>
        <table className="w-full text-xs border border-white/10 rounded mt-3">
          <thead className="bg-white/5">
            <tr>
              <th className="px-2 py-2 text-left">Project element</th>
              <th className="px-2 py-2 text-left">NESC</th>
              <th className="px-2 py-2 text-left">TIA-607</th>
              <th className="px-2 py-2 text-left">RUS Bulletin</th>
              <th className="px-2 py-2 text-left">Apply</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-2 py-2">Pole clearance</td>
              <td className="px-2 py-2">3 ft horizontal (Rule 232)</td>
              <td className="px-2 py-2">n/a</td>
              <td className="px-2 py-2">Same or adds loading class</td>
              <td className="px-2 py-2 text-green-300">NESC clearance + RUS load table</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-2 py-2">Ground rod resistance</td>
              <td className="px-2 py-2">Not tested (NESC sets geometry)</td>
              <td className="px-2 py-2">≤5 Ω at CO/vault</td>
              <td className="px-2 py-2">≤25 Ω aerial / ≤5 Ω CO (Form 219)</td>
              <td className="px-2 py-2 text-green-300">TIA target at CO (5 Ω stricter); Form 219 required by RUS</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-2 py-2">Fiber OLTS testing</td>
              <td className="px-2 py-2">Not required</td>
              <td className="px-2 py-2">TIA-568 + TIA-526</td>
              <td className="px-2 py-2">Required before acceptance</td>
              <td className="px-2 py-2 text-green-300">RUS requires OLTS (stricter than NESC)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-2 py-2">Messenger bonding</td>
              <td className="px-2 py-2">NESC Rule 215D every 1,320 ft</td>
              <td className="px-2 py-2">n/a</td>
              <td className="px-2 py-2">Same or more frequent</td>
              <td className="px-2 py-2 text-green-300">Use RUS interval if stricter</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-2 py-2">Design certification</td>
              <td className="px-2 py-2">PE seal per state law</td>
              <td className="px-2 py-2">n/a</td>
              <td className="px-2 py-2">Borrower's engineer certifies to RUS</td>
              <td className="px-2 py-2 text-green-300">Both: PE seal + RUS certification letter</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Book vs. Field: When Standards Conflict</h3>
        <div className="rounded bg-amber-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-amber-300">Book</p>
          <p className="text-slate-300/90 mt-1">Clean hierarchy: NESC baseline → TIA where applicable → RUS adds/overrides. Apply stricter standard when they differ. RUS wins when RUS and others conflict on RUS projects.</p>
        </div>
        <div className="rounded bg-green-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-green-300">Field</p>
          <p className="text-slate-300/90 mt-1">Engineer sees a pole with 2.5 ft horizontal clearance from electric — non-compliant with NESC Rule 232 but the rural electric co-op says "we've always done it that way." On an RUS project, you can't accept this: NESC applies, and RUS adopts NESC. Non-compliant existing conditions discovered during staking must be documented, and make-ready costs (moving the attachment to achieve 3 ft clearance) go into the project scope. RUS does not accept a variance because the utility "always did it that way."</p>
        </div>
      </section>

      <section className="mt-8 rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-slate-200">Tying It Together</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          In <strong>T05</strong> you learned NESC (pole loading, clearance, safety). In <strong>T14</strong> you learned TIA-607 (grounding, bonding, electrode resistance). Both of those standards exist independently of RUS.
          RUS doesn't replace them — it adopts NESC as a floor and adds Form 219 testing, pole-loading tables, and design certification on top.
          TIA-607's 5 Ω target at the CO is stricter than most RUS aerial thresholds, so TIA-607 wins at the building even on an RUS project.
          The lesson: you need to know all three standards well enough to spot where they agree, where one is stricter, and what the resolution is — without having to look up the hierarchy every time.
          In practice, 90% of the time all three standards align. The 10% where they diverge (Form 219 testing, fiber OLTS requirement, CO grounding threshold) are precisely the items that trip up contractors who only know NESC.
        </p>
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
          {
            id: 'T20-L07-Q3',
            type: 'mc',
            prompt: 'TIA-607-D requires a 5 Ω ground electrode at a CO building. RUS Form 219 lists a ≤25 Ω threshold for aerial poles. A CO building on an RUS-funded project — which threshold controls?',
            options: [
              { key: 'a', text: '25 Ω — that is the NEC §250.56 requirement that RUS defers to for buildings' },
              { key: 'b', text: '5 Ω — TIA-607-D is stricter than the RUS general threshold, and the stricter standard applies' },
              { key: 'c', text: 'Either; the engineer chooses the threshold based on site conditions' },
              { key: 'd', text: 'No threshold applies to CO buildings; only pole grounding is Form 219 tested' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L07-Q4',
            type: 'mc',
            prompt: 'On a joint-use pole, NESC and RUS both apply. Which best describes their respective scope?',
            options: [
              { key: 'a', text: 'NESC governs pole geometry (loading, clearance); RUS governs the telecom design and testing (materials, grounding, Form 219)' },
              { key: 'b', text: 'NESC governs underground conduit; RUS governs aerial plant exclusively' },
              { key: 'c', text: 'RUS supersedes NESC on joint-use poles, so NESC can be disregarded' },
              { key: 'd', text: 'NESC sets the construction budget; RUS sets the engineering specification' },
            ],
            correct: 'a',
          },
        ]}
      />
    </LessonLayout>
  );
}
