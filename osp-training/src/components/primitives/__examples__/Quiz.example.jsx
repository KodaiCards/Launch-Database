import React from 'react';
import Quiz from '../Quiz.jsx';

/**
 * Quiz.example — Fiber physics multiple-choice + drag-match demo.
 * Shows both live modes so authoring agents can see the prop contract in
 * action. `fill-in-blank` is retired platform-wide (Carter's typed-answer
 * ban, 2026-07-01) and intentionally has no example here.
 */

const MC_QUESTIONS = [
  {
    id: 'fp-mc-1',
    type: 'mc',
    prompt:
      'A single-mode fiber (SMF) has a core diameter of approximately how many micrometers?',
    choices: ['50 µm', '62.5 µm', '9 µm', '125 µm'],
    answerIndex: 2,
    explanation:
      'SMF core is ~9 µm — narrow enough that only one light path (mode) fits. Multimode cores are 50 or 62.5 µm.',
    citation: 'ITU-T G.652.D — Standard SMF specification.',
    fieldNote:
      'On the reel label, "SM" means single-mode. The 125 µm number is the outer cladding diameter — same for both fiber types.',
  },
  {
    id: 'fp-mc-2',
    type: 'mc',
    prompt:
      'Which wavelength window is preferred for long-haul single-mode transmission because it has the lowest attenuation?',
    choices: ['850 nm', '1310 nm', '1550 nm', '1625 nm'],
    answerIndex: 2,
    explanation:
      '1550 nm sits in the third window where silica glass has its minimum absorption (~0.20 dB/km for G.652.D). 1310 nm is the second window (used for shorter spans); 850 nm is multimode territory.',
    citation: 'ITU-T G.652.D §6 — Attenuation coefficient.',
  },
];

const DRAG_QUESTIONS = [
  {
    id: 'fp-drag-1',
    type: 'drag-match',
    prompt: 'Match each cable component to its function.',
    items: [
      { id: 'core',     label: 'Core' },
      { id: 'cladding', label: 'Cladding' },
      { id: 'buffer',   label: 'Buffer coating' },
      { id: 'jacket',   label: 'Outer jacket' },
    ],
    targets: [
      { id: 't-light',   label: 'Carries the light signal' },
      { id: 't-reflect', label: 'Reflects light back into the core' },
      { id: 't-protect', label: 'Protects the glass from moisture' },
      { id: 't-env',     label: 'Environmental protection (UV, crush)' },
    ],
    correctMap: {
      't-light':   'core',
      't-reflect': 'cladding',
      't-protect': 'buffer',
      't-env':     'jacket',
    },
    explanation:
      'Total internal reflection at the core/cladding boundary is what keeps the light inside the fiber rather than leaking out the sides.',
    citation: 'FOA Reference Guide to Fiber Optics — Chapter 2.',
  },
];

export default function QuizExample() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold text-amber-300">Quiz — Example Usage</h1>

      <section>
        <h2 className="text-lg font-semibold text-slate-300 mb-3">
          Mode: multiple-choice
        </h2>
        <Quiz
          title="Fiber Physics Check"
          mode="multiple-choice"
          questions={MC_QUESTIONS}
          onComplete={r => console.log('MC done', r)}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-300 mb-3">
          Mode: drag-match
        </h2>
        <Quiz
          title="Cable Anatomy Match"
          mode="drag-match"
          questions={DRAG_QUESTIONS}
          onComplete={r => console.log('Drag done', r)}
        />
      </section>
    </div>
  );
}
