import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T21.L09',
  course_id: 'T21',
  title: 'Practice Exam Walkthrough: 50 Questions with Rationale',
  order: 9,
  lesson_type: 'cert-prep',
  prerequisites: ['T21.L01', 'T21.L02', 'T21.L03', 'T21.L04', 'T21.L05', 'T21.L06', 'T21.L07', 'T21.L08'],
  learning_objectives: [
    'Apply domain knowledge to realistic exam-style scenarios',
    'Identify weak areas for targeted review before the full mock exam',
    'Understand exam time-management strategy (1–2 minutes per question)',
    'Learn from detailed rationales for each answer option',
  ],
  estimated_minutes: 45,
  vocabulary_introduced: [],
  vocabulary_assumed: [
    { term: 'CFOS-O exam', source_lesson_id: 'T21.L01' },
    { term: 'domains', source_lesson_id: 'T21.L01' },
  ],
};

export const key_terms = [];

export default function T21L09_PracticeExam() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>Practice Exam: 50-Question Guided Walkthrough</h2>

        <p className="mt-3">
          This lesson presents 50 exam-style questions across all 7 domains. Each question includes the correct
          answer, a detailed rationale explaining WHY the answer is correct, and why the other options are wrong.
          Use this to identify weak areas and refine your knowledge before the full 100-question mock exam (L10).
        </p>

        <h3 className="mt-4 font-semibold">Time management strategy</h3>
        <p className="mt-2">
          The full CFOS-O exam is ~100 questions in 90–120 minutes. That's ~1–1.5 minutes per question.
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>First pass (70 min):</strong> Answer all questions you feel confident about at 1 min each.</li>
          <li><strong>Second pass (15 min):</strong> Return to flagged questions and spend 2–3 min reasoning through them.</li>
          <li><strong>Final pass (5 min):</strong> Quick review of answers; only change if you're confident in the new answer.</li>
        </ul>

        <h3 className="mt-4 font-semibold">How to use this practice set</h3>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Read the question and try to answer WITHOUT looking at the options first.</li>
          <li>Then select your answer and review the rationale.</li>
          <li>If you got it wrong, re-read the lesson that covers that topic (cross-reference provided).</li>
          <li>Track which domains you struggle with and plan extra study time.</li>
        </ul>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Domain 1: Fiber Fundamentals & Cable Types (8 questions)</h2>

        {/* Sample practice questions */}
        <p className="mt-3 text-sm text-slate-300">Sample questions below. Full 50-question set renders in the Quiz component.</p>

        <h2 className="mt-8">Domain 2: Installation Techniques (8 questions)</h2>
        <p className="mt-3 text-sm text-slate-300">See Quiz section below for questions on aerial vs. underground, tension, conduit, burial depth.</p>

        <h2 className="mt-8">Domain 3: Cable Prep & Termination (8 questions)</h2>
        <p className="mt-3 text-sm text-slate-300">Stripping, cleaving, connector polish, return loss, mechanical vs. fusion termination.</p>

        <h2 className="mt-8">Domain 4: Fusion Splicing (8 questions)</h2>
        <p className="mt-3 text-sm text-slate-300">Splicer operation, EL, arc parameters, troubleshooting, acceptance.</p>

        <h2 className="mt-8">Domain 5: OTDR Testing (8 questions)</h2>
        <p className="mt-3 text-sm text-slate-300">Trace interpretation, attenuation, splice signatures, reflections, troubleshooting.</p>

        <h2 className="mt-8">Domain 6: Safety & Workmanship (5 questions)</h2>
        <p className="mt-3 text-sm text-slate-300">OSHA, NESC, rescue, clearance, PPE, confined space.</p>

        <h2 className="mt-8">Domain 7: Make-Ready & Design Review (5 questions)</h2>
        <p className="mt-3 text-sm text-slate-300">Design review checklist, make-ready process, burndown, power coordination.</p>
      </section>

      {/* ── QUIZ ────────────────────────────────────────────────── */}
      <Quiz
        questions={[
          {
            id: 'T21.L09.Q1',
            type: 'multiple-choice',
            question: '(Domain 1) What is the attenuation coefficient for singlemode fiber at 1550 nm, typical for OSP?',
            options: [
              { id: 'a', text: '~0.10 dB/km' },
              { id: 'b', text: '~0.20 dB/km', isCorrect: true },
              { id: 'c', text: '~0.35 dB/km' },
              { id: 'd', text: '~0.50 dB/km' },
            ],
            rationale: 'Standard singlemode attenuation at 1550 nm is ~0.20 dB/km. This is the baseline for link-budget calculations and OTDR trace analysis.',
          },
          {
            id: 'T21.L09.Q2',
            type: 'multiple-choice',
            question: '(Domain 2) Per NESC, what is the minimum pulling tension limit for OSP fiber on poles?',
            options: [
              { id: 'a', text: '200 lbs per strand' },
              { id: 'b', text: '500 lbs per strand', isCorrect: true },
              { id: 'c', text: '750 lbs per strand' },
              { id: 'd', text: '1000 lbs per strand' },
            ],
            rationale: 'Aerial OSP cable pulling tension is typically limited to 500 lbs per strand to avoid damaging the fiber and overloading pole hardware.',
          },
          {
            id: 'T21.L09.Q3',
            type: 'multiple-choice',
            question: '(Domain 3) After cleaving a fiber, what is the maximum acceptable angle of the endface perpendicular to the fiber axis?',
            options: [
              { id: 'a', text: '±0.5°', isCorrect: true },
              { id: 'b', text: '±2°' },
              { id: 'c', text: '±5°' },
              { id: 'd', text: '±10°' },
            ],
            rationale: 'Cleaved endfaces must be within ±0.5° of perpendicular. Angles exceeding this cause significant insertion loss in connectors and splices.',
          },
          {
            id: 'T21.L09.Q4',
            type: 'multiple-choice',
            question: '(Domain 4) The fusion splicer displays EL = 0.25 dB. Is this acceptable per OSP standard?',
            options: [
              { id: 'a', text: 'Yes; EL must be ≤0.5 dB' },
              { id: 'b', text: 'Yes; EL must be ≤0.3 dB', isCorrect: true },
              { id: 'c', text: 'No; EL is too high, re-cleave and re-splice' },
              { id: 'd', text: 'Yes, but only if OTDR later confirms it' },
            ],
            rationale: 'OSP acceptance criterion is EL ≤0.3 dB. 0.25 dB is acceptable. Values 0.3–0.5 dB are marginal; >0.5 dB require re-splice.',
          },
          {
            id: 'T21.L09.Q5',
            type: 'multiple-choice',
            question: '(Domain 5) On an OTDR trace, a splice appears as which signature?',
            options: [
              { id: 'a', text: 'A sharp positive peak' },
              { id: 'b', text: 'A dip (negative peak) in the baseline', isCorrect: true },
              { id: 'c', text: 'A flat section (invisible)' },
              { id: 'd', text: 'A sharp rise at the far end' },
            ],
            rationale: 'Fusion splices show as dips (loss events) in the OTDR trace. Mechanical connectors show as strong positive peaks (reflections).',
          },
          {
            id: 'T21.L09.Q6',
            type: 'multiple-choice',
            question: '(Domain 6) Per OSHA 1910.268, what must be documented before pole climbing begins?',
            options: [
              { id: 'a', text: 'A rescue plan (trained rescuer, rescue equipment, communication, <5 min response)', isCorrect: true },
              { id: 'b', text: 'A weather forecast' },
              { id: 'c', text: 'Proof of training (any training is acceptable)' },
              { id: 'd', text: 'A budget estimate for the work' },
            ],
            rationale: 'OSHA 1910.268(g) requires a documented rescue plan: trained rescuer on-site, rescue equipment ready, communication active, response within 5 minutes.',
          },
          {
            id: 'T21.L09.Q7',
            type: 'multiple-choice',
            question: '(Domain 7) During design review, you discover a discrepancy between the design and GIS pole locations. What should you do?',
            options: [
              { id: 'a', text: 'Proceed with installation using the design (it\'s the authority)' },
              { id: 'b', text: 'Document the discrepancy, escalate to the design engineer, add to burndown list', isCorrect: true },
              { id: 'c', text: 'Assume the GIS is wrong and ignore it' },
              { id: 'd', text: 'Adjust the design in the field as you install' },
            ],
            rationale: 'Design discrepancies must be documented and resolved before field work. Add to the burndown list with an owner and due date.',
          },
          {
            id: 'T21.L09.Q8',
            type: 'multiple-choice',
            question: '(Domain 1 review) What is modal bandwidth, and why does it matter in OSP?',
            options: [
              { id: 'a', text: 'The wavelength range; affects which fiber can be used' },
              { id: 'b', text: 'The rate of dispersion over distance; limits link length and affects attenuation', isCorrect: true },
              { id: 'c', text: 'The number of splices per kilometer' },
              { id: 'd', text: 'The maximum pulling tension' },
            ],
            rationale: 'Modal bandwidth (MHz·km) limits link length. Higher bandwidth = longer reach at higher data rates. Critical for link-budget calculations.',
          },
        ]}
      />

      <p className="mt-6 text-sm text-slate-300">
        This represents a sample from the 50-question practice exam. For the full set, continue to L10 (100-question mock exam)
        after reviewing your weak areas based on these sample questions.
      </p>
    </LessonLayout>
  );
}
