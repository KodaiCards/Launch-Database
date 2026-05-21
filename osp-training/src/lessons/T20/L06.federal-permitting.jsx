import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T20.L06',
  course_id: 'T20',
  title: 'Federal Permitting Integration: NEPA, §106, USACE, BLM',
  order: 6,
  prerequisites: ['T09.L01'],
  learning_objectives: [
    'Explain RUS-triggered federal permitting (NEPA, Section 106, wetlands)',
    'Identify when USACE Nationwide Permit 57, BLM, or USFS approval required',
    'Understand RUS environmental worksheet role',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'RUS environmental worksheet',
    'categorical exclusion',
    'environmental assessment',
    'Section 106',
    'NWP 57',
  ],
  vocabulary_assumed: [
    { term: 'NEPA', source_lesson_id: 'T01.L08' },
  ],
};

export const key_terms = [
  {
    term: 'RUS environmental worksheet',
    definition: 'First NEPA screening tool. RUS borrower completes worksheet documenting project scope, environmental setting, and potential impacts (wetlands, endangered species, historic sites, Indian lands). Worksheet determines whether NEPA goes to Categorical Exclusion or Environmental Assessment.',
  },
  {
    term: 'categorical exclusion',
    definition: 'NEPA review level for projects under $300K in low-impact areas where the worksheet shows no wetlands, no endangered species, no historic sites. RUS approves with NEPA coverage closed.',
  },
  {
    term: 'environmental assessment',
    definition: 'Deeper NEPA review for projects $300K or higher or in sensitive areas. RUS prepares EA, issues Finding of No Significant Impact (FONSI) or refers to Environmental Impact Statement.',
  },
  {
    term: 'Section 106',
    definition: 'Federal historic preservation law (54 USC 306108). Required if project crosses federal land, affects historic properties, or triggers federal permits. Requires consultation with state historic preservation office (SHPO).',
  },
  {
    term: 'NWP 57',
    definition: 'USACE Nationwide Permit 57 (33 CFR Part 330). Applies when aerial/underground construction crosses federal jurisdictional wetlands (within 500 ft of OHWM). Telecom projects often qualify; minimal paperwork if conditions met.',
  },
];

export default function T20L06_FederalPermitting() {
  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>RUS funding triggers federal compliance obligations that OSP projects might not face otherwise. Three big ones: NEPA (environmental review), Section 106 (historic preservation), and USACE permitting (wetlands). T09 covers general permitting. This lesson adds the RUS-specific overlay: what makes a project "federal" and which agencies you'll deal with.</p>

        <h3 className="mt-4 font-semibold">Why RUS funding = federal permitting</h3>
        <p className="mt-2">RUS is a federal agency. Loans/grants = federal funding. When federal dollars flow, federal environmental law kicks in (NEPA = 40 CFR 1500-1508). Your design must demonstrate environmental compliance before RUS releases funds.</p>

        <h3 className="mt-4 font-semibold">Three main federal overlays</h3>
        <div className="space-y-3 mt-3 text-sm">
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-blue-300">NEPA (7 CFR Part 1b — RUS environmental review)</p>
            <p className="text-slate-300/90 mt-1">Applies to RUS projects 300K or higher or in sensitive environmental areas. RUS environmental worksheet required. If project affects wetlands, water quality, endangered species, historic sites: deeper environmental assessment needed. [confirm edition]</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-green-300">Section 106 (54 USC 306108)</p>
            <p className="text-slate-300/90 mt-1">Federal historic preservation law. If project: crosses federal land, affects historic properties, or triggers federal permits, Section 106 review required. Consult with state historic preservation office (SHPO).</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-purple-300">USACE Nationwide Permit 57 (33 CFR Part 330)</p>
            <p className="text-slate-300/90 mt-1">If aerial/underground crosses federal jurisdictional wetlands (within 500 ft of OHWM), NWP 57 applies. Telecom projects often qualify; minimal paperwork if conditions met. RUS coordinates with USACE.</p>
          </div>
        </div>
      </section>

      <Flashcard
        deckId="T20-L06"
        cards={[
          {
            id: 'T20-L06-fc-worksheet',
            front: 'What is the RUS environmental worksheet?',
            back: 'First NEPA screening tool. RUS borrower completes worksheet documenting project scope, environmental setting, and potential impacts (wetlands, endangered species, historic sites, Indian lands). Worksheet determines whether NEPA goes to Categorical Exclusion or Environmental Assessment.',
          },
          {
            id: 'T20-L06-fc-ce',
            front: 'What is a categorical exclusion in RUS NEPA review?',
            back: 'NEPA review level for projects under $300K in low-impact areas where the worksheet shows no wetlands, no endangered species, no historic sites. RUS approves with NEPA coverage closed.',
          },
          {
            id: 'T20-L06-fc-ea',
            front: 'What is an environmental assessment in RUS NEPA review?',
            back: 'Deeper NEPA review for projects $300K or higher or in sensitive areas. RUS prepares EA, issues Finding of No Significant Impact (FONSI) or refers to Environmental Impact Statement.',
          },
          {
            id: 'T20-L06-fc-s106',
            front: 'When does Section 106 apply to an RUS project?',
            back: 'Federal historic preservation law (54 USC 306108). Required if project crosses federal land, affects historic properties, or triggers federal permits. Requires consultation with state historic preservation office (SHPO).',
          },
          {
            id: 'T20-L06-fc-nwp57',
            front: 'What is USACE Nationwide Permit 57?',
            back: 'USACE Nationwide Permit 57 (33 CFR Part 330). Applies when aerial/underground construction crosses federal jurisdictional wetlands (within 500 ft of OHWM). Telecom projects often qualify; minimal paperwork if conditions met.',
          },
        ]}
      />

      <section data-tier="working">
        <h2>RUS Environmental Worksheet</h2>
        <p className="mt-2">First screening tool. RUS borrower completes worksheet documenting: project scope, environmental setting, potential impacts (wetlands? endangered species? historic sites? Indian lands?). Worksheet determines whether NEPA goes to Categorical Exclusion (CE, minimal docs) or Environmental Assessment (EA, deeper review).</p>

        <h3 className="mt-4 font-semibold">Review levels</h3>
        <div className="bg-white/5 rounded p-3 mt-3 text-sm space-y-2">
          <p><strong>Categorical Exclusion (CE):</strong> Project under $300K in low-impact area. Worksheet shows no wetlands, no endangered species, no historic sites. RUS approves with NEPA coverage closed.</p>
          <p><strong>Environmental Assessment (EA):</strong> Project $300K or higher OR sensitive area. RUS prepares EA, issues Finding of No Significant Impact (FONSI) or refers to Environmental Impact Statement (EIS).</p>
          <p><strong>EIS (rare):</strong> Major impacts. Requires 6+ months, multi-agency coordination.</p>
        </div>
      </section>

      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T20-L06-Q1',
            type: 'mc',
            prompt: 'RUS-funded projects trigger federal permitting because:',
            options: [
              { key: 'a', text: 'RUS is a private lender' },
              { key: 'b', text: 'Federal funding invokes federal environmental law (NEPA)' },
              { key: 'c', text: 'NESC requires it' },
              { key: 'd', text: 'State law mandates federal coordination' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L06-Q2',
            type: 'mc',
            prompt: 'What does USACE Nationwide Permit 57 authorize?',
            options: [
              { key: 'a', text: 'All federal land crossings' },
              { key: 'b', text: 'Electric utility and telecom activities in jurisdictional wetlands' },
              { key: 'c', text: 'Historic property preservation' },
              { key: 'd', text: 'Emergency response projects only' },
            ],
            correct: 'b',
          },
        ]}
      />
    </LessonLayout>
  );
}
