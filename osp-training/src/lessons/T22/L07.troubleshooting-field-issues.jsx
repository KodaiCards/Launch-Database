// T22 CFOT Lesson 7 — Troubleshooting Field Issues

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T22.L07',
  course_id: 'T22',
  title: 'Troubleshooting Field Issues',
  order: 7,
  lesson_type: 'advanced',
  prerequisites: ['T22.L03', 'T22.L04', 'T22.L05'],
  vocabulary_introduced: [
    'fault isolation',
    'non-destructive testing',
    'OTDR signature',
    'intermittent failure',
    'fiber break (hard break)',
    'signal degradation',
    'splice loss spike',
  ],
  vocabulary_assumed: [],
  estimated_minutes: 20,
  learning_objectives: [
    'Diagnose common field failures using OTDR and non-destructive tests',
    'Distinguish between hard breaks, soft breaks, and intermittent signal degradation',
    'Develop a systematic troubleshooting approach for fiber links',
    'Know when to replace a cable section vs. re-splicing',
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T22L07_Troubleshooting() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When a fiber link stops working or loses signal, the fix starts with understanding what
          broke. OTDR is your primary diagnostic tool — it tells you the location and type of failure.
          Once you know what broke, deciding whether to re-splice, patch, or replace a cable section
          is a matter of economics and risk.
        </p>

        <h3 className="mt-4 font-semibold">Common Failure Modes</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Failure type</th>
              <th className="px-3 py-2 text-left">OTDR signature</th>
              <th className="px-3 py-2 text-left">Field sign</th>
              <th className="px-3 py-2 text-left">Typical fix</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Hard break (open circuit)</td>
              <td className="px-3 py-2">Flat line (no signal return past the break)</td>
              <td className="px-3 py-2">No light at far end. Possible kink or rodent damage.</td>
              <td className="px-3 py-2">Locate and replace the damaged section</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Fiber crimp / micro-fracture</td>
              <td className="px-3 py-2">Gradual loss increase over 10–50 m, may show small reflections</td>
              <td className="px-3 py-2">Cable looks okay but OTDR shows loss at one location</td>
              <td className="px-3 py-2">Often time-dependent; monitor. If progressive, cut out section.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">High-loss splice</td>
              <td className="px-3 py-2">Sharp downward step > 0.2 dB at a splice location</td>
              <td className="px-3 py-2">OTDR shows event at the known splice location</td>
              <td className="px-3 py-2">Re-splice: clean fiber, cleave fresh, re-fuse</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Intermittent connection</td>
              <td className="px-3 py-2">OTDR measurements vary from test to test; may show temporary break then recovery</td>
              <td className="px-3 py-2">Signal drops in and out. Not always reproducible.</td>
              <td className="px-3 py-2">Likely a loose connector. Re-seat or replace. Check for oxidation.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Macrobend loss</td>
              <td className="px-3 py-2">Elevated baseline loss over a 100–500 m section; no obvious event</td>
              <td className="px-3 py-2">OTDR total loss is higher than expected; physical cable looks normal</td>
              <td className="px-3 py-2">Locate tight coil and straighten it. Measurable improvement when done.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-4 font-semibold">Systematic Troubleshooting Approach</h3>
        <ol className="space-y-2 text-sm text-slate-300/90 list-decimal pl-5">
          <li><strong>Verify the failure is real.</strong> Test from both ends. Intermittent failures may reproduce only under load or thermal stress.</li>
          <li><strong>OTDR from both directions.</strong> Dead zone effects are different; a fault may show clearly from one end but not the other.</li>
          <li><strong>Isolate the failure point.</strong> If OTDR shows loss but no break, measure from the suspected location. Can you isolate the problem to 100 m? 10 m?</li>
          <li><strong>Inspect the cable physically.</strong> Follow the cable from the OTDR's failure point. Look for kinks, crushed sections, vehicle damage, or animal damage.</li>
          <li><strong>Decide: replace vs. repair.</strong> A small section with a hard break may be faster to replace. A known high-loss splice is faster to re-splice.</li>
        </ol>

        <div className="mt-3 p-3 border border-amber-400/30 bg-amber-400/5 rounded-lg">
          <p className="font-semibold text-amber-300 text-sm">Book vs. Field</p>
          <p className="text-slate-300/90 text-sm">
            <strong>Book:</strong> Troubleshoot methodically with all tests documented.
            <strong>Field:</strong> Time is money. If an OTDR shows a break at location X, crews
            sometimes just replace the section without further inspection. Often the right call —
            but if the break was caused by a sharp rock or protruding conduit, replacing the cable
            puts it right back in danger. Take time to understand the ROOT CAUSE.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced Failure Analysis</h2>

        <h3 className="font-semibold">Intermittent Failures and Temperature Sensitivity</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Some failures appear only under stress: thermal cycling, fiber vibration from wind,
          or load changes (network traffic). An intermittent high-loss splice may show 0.05 dB
          at 20°C but 0.4 dB at 50°C. To diagnose:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Monitor the link during temperature extremes (early morning cold, afternoon heat)</li>
          <li>Document when signal drops occur</li>
          <li>Re-OTDR under the same thermal condition</li>
        </ul>

        <h3 className="mt-3 font-semibold">Splice Loss Verification</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          An OTDR may show a 0.3 dB loss at a splice, but this is a POINT measurement. The actual loss
          of the individual splice may be lower — the 0.3 dB may include some baseline loss variation
          from the cable itself. To verify the splice is actually bad:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Measure the cable loss 100 m before the splice (baseline)</li>
          <li>Measure at the splice</li>
          <li>Measure 100 m after the splice</li>
          <li>Calculate the actual splice loss: (before + after) / 2 – at-splice</li>
        </ol>
      </section>

      {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
      <Flashcard
        deckId="T22-L07"
        cards={[
          { id: 'T22-L07-FC-1', front: 'Fault isolation', back: 'The process of identifying the location and type of failure in a fiber link using OTDR and physical inspection.' },
          { id: 'T22-L07-FC-2', front: 'Hard break', back: 'A complete fiber fracture (open circuit). OTDR shows a flat line (no signal) beyond the break location.' },
          { id: 'T22-L07-FC-3', front: 'Signal degradation', back: 'Loss of signal strength or increase in attenuation without a complete break. May be caused by macrobend, micro-fracture, or high-loss splice.' },
          { id: 'T22-L07-FC-4', front: 'Splice loss spike', back: 'An unexpected high loss (> 0.2 dB) at a fusion splice location, visible as a downward step on OTDR.' },
          { id: 'T22-L07-FC-5', front: 'Intermittent failure', back: 'A failure that appears and disappears unpredictably, often caused by loose connections or temperature-sensitive micro-fractures.' },
          { id: 'T22-L07-FC-6', front: 'OTDR signature', back: 'The characteristic pattern of loss and reflections shown on an OTDR trace, used to diagnose failure type and location.' },
          { id: 'T22-L07-FC-7', front: 'Non-destructive testing', back: 'Measurement techniques (like OTDR) that diagnose faults without cutting or physically damaging the cable.' },
          { id: 'T22-L07-FC-8', front: 'Macrobend loss', back: 'Attenuation caused by excessive coiling or bending of the cable, detectable on OTDR but not visible as physical damage.' },
          { id: 'T22-L07-FC-9', front: 'Root cause analysis', back: 'Understanding why a failure occurred (e.g., sharp rock puncturing the cable) so the fix prevents recurrence.' },
          { id: 'T22-L07-FC-10', front: 'Fiber crimp', back: 'A partial fracture or stress zone in the fiber that increases loss. May progress to a hard break over time if not monitored.' },
        ]}
      />

      {/* ── QUIZ ────────────────────────────────────────────────────────── */}
      <Quiz
        title="T22.L07 Check — Troubleshooting"
        mode="multiple-choice"
        questions={[
          {
            id: 'T22-L07-Q1',
            type: 'mc',
            prompt:
              'An OTDR measurement shows a flat line (no return signal) starting at distance 3.2 km. What does this indicate?',
            choices: [
              'The cable is perfectly aligned and has no loss',
              'A hard break (open circuit) at or near 3.2 km',
              'A connector reflection',
              'The OTDR is broken',
            ],
            answerIndex: 1,
            explanation:
              'A flat line means no light is returning — the fiber is open-circuit. The break is at or very close to 3.2 km (accounting for dead zone effects).',
          },
          {
            id: 'T22-L07-Q2',
            type: 'mc',
            prompt:
              'An OTDR shows a known fusion splice with 0.3 dB loss. Before deciding to re-splice, what should you do?',
            choices: [
              'Re-splice immediately — 0.3 dB is too high',
              'Measure the baseline loss before and after the splice to calculate the actual splice loss',
              'Ask the customer if they want it fixed',
              'Replace the entire cable section',
            ],
            answerIndex: 1,
            explanation:
              'OTDR point measurements can include baseline variation. Calculate actual splice loss by comparing before and after sections. If the splice is genuinely > 0.2 dB, then re-splice.',
          },
          {
            id: 'T22-L07-Q3',
            type: 'fill-in-blank',
            prompt:
              'An intermittent failure that appears only in afternoon heat is likely caused by a ____ in the fiber that becomes sensitive at high temperature.',
            answer: 'micro-fracture',
            answerDisplay: 'micro-fracture or crimp or stress zone',
            explanation:
              'Thermal stress on a partial fracture can cause temporary loss. Temperature-dependent failures are classic micro-fracture signatures.',
          },
          {
            id: 'T22-L07-Q4',
            type: 'mc',
            prompt:
              'You measure a cable from direction A and see a 0.4 dB event at 500 m. You measure from direction B (the other end) and see no loss at that location. What is the most likely explanation?',
            choices: [
              'The OTDR at direction B is broken',
              'The event is directionally sensitive due to dead zone effects or a cable bend',
              'The cable was spliced at 500 m and the splice is open-circuit from one end',
              'This is impossible — all OTDR measurements from both ends are identical',
            ],
            answerIndex: 1,
            explanation:
              'Dead zone effects and directional asymmetry in cable bends can cause an event to be visible from one direction but not the other. Measure from both directions as standard practice.',
          },
          {
            id: 'T22-L07-Q5',
            type: 'mc',
            prompt:
              'You have located a break in the cable at 2 km. The cable run is 8 km total. What is the next step?',
            choices: [
              'Replace the entire 8 km cable run',
              'Locate and inspect the break physically to understand the root cause before deciding whether to replace a section or repair',
              'Just re-splice at the break location',
              'Mark the location and ignore it until the full link fails',
            ],
            answerIndex: 1,
            explanation:
              'Understanding the ROOT CAUSE (rock puncture, vehicle damage, animal damage, etc.) determines the fix. If a rock caused the break, simply patching puts it back in danger.',
          },
        ]}
      />

    </LessonLayout>
  );
}
