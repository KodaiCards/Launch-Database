import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T20.L08',
  course_id: 'T20',
  title: 'RUS Broadband Programs & Borrower Decision-Making',
  order: 8,
  prerequisites: ['T20.L01'],
  learning_objectives: [
    'Distinguish RUS broadband programs (ReConnect, Community Connect)',
    'Understand broadband-eligible vs. non-eligible cost definitions',
    'Recognize program impact on OSP scope and funding',
  ],
  estimated_minutes: 15,
  vocabulary_introduced: [
    'ReConnect Program',
    'Community Connect',
    'broadband-eligible cost',
    'match requirement',
  ],
  vocabulary_assumed: [],
};

export const key_terms = [
  {
    term: 'ReConnect Program',
    definition: 'Dedicated RUS broadband grant/loan (7 CFR Part 1744). Post-2018 expansion. Funds FTTH, wireless, and other broadband technologies in underserved rural areas. Match requirement: 10–20%.',
  },
  {
    term: 'Community Connect',
    definition: 'RUS broadband program (7 CFR Part 1703) combining broadband, distance-learning, and telemedicine grants. Smaller awards with a 25% match requirement (higher than ReConnect).',
  },
  {
    term: 'broadband-eligible cost',
    definition: 'Plant capable of delivering ≥25 Mbps download and funded under broadband program rules. Older cable, legacy equipment, or non-broadband-capable plant may be classified as non-eligible and not funded by RUS.',
  },
  {
    term: 'match requirement',
    definition: 'The percentage of total project cost the borrower must contribute from non-RUS sources. ReConnect requires 10–20%; Community Connect requires 25%.',
  },
];

export default function T20L08_BroadbandPrograms() {
  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>RUS expanded broadband authorities post-2018. Borrowers now have access to dedicated broadband programs (ReConnect, Community Connect) that differ from the traditional Telecommunications Loan. Your job: understand which program finances your project and how it affects cost-per-mile and scope.</p>

        <h3 className="mt-4 font-semibold">Two main broadband programs</h3>
        <div className="space-y-3 mt-3 text-sm">
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-blue-300">ReConnect (7 CFR Part 1744)</p>
            <p className="text-slate-300/90 mt-1">Dedicated RUS broadband grant/loan. Post-2018 expansion. Funds FTTH, wireless, other broadband tech in underserved rural areas. Cost-per-mile cap: varies (higher than traditional Telecom Loan for broadband-capable plant). Match requirement: 10-20%.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-green-300">Community Connect (7 CFR Part 1703)</p>
            <p className="text-slate-300/90 mt-1">Older program (DLT history). Combines broadband, distance-learning, and telemedicine grants. Smaller awards. Match requirement: 25% (higher than ReConnect).</p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Broadband-eligible cost</h3>
        <p className="mt-2">Not all OSP costs are broadband-eligible under these programs. Broadband programs require plant capable of delivering ≥25 Mbps download. If your design specifies older cable, legacy equipment, or non-broadband-capable plant: those costs may be classified as non-eligible and not funded by RUS (borrower absorbs).</p>

        <p className="mt-2"><strong>Impact on your design:</strong> If borrower is on a broadband program with limited budget, you may need to optimize fiber count, minimize splice-point equipment, defer non-critical upgrades — to stay within the broadband-eligible cost cap.</p>
      </section>

      <Flashcard
        deckId="T20-L08"
        cards={[
          {
            id: 'T20-L08-fc-reconnect',
            front: 'What is the ReConnect Program?',
            back: 'Dedicated RUS broadband grant/loan (7 CFR Part 1744). Post-2018 expansion. Funds FTTH, wireless, and other broadband technologies in underserved rural areas. Match requirement: 10–20%.',
          },
          {
            id: 'T20-L08-fc-community',
            front: 'What is Community Connect?',
            back: 'RUS broadband program (7 CFR Part 1703) combining broadband, distance-learning, and telemedicine grants. Smaller awards with a 25% match requirement (higher than ReConnect).',
          },
          {
            id: 'T20-L08-fc-eligible',
            front: 'What is a broadband-eligible cost?',
            back: 'Plant capable of delivering ≥25 Mbps download and funded under broadband program rules. Older cable, legacy equipment, or non-broadband-capable plant may be classified as non-eligible and not funded by RUS.',
          },
          {
            id: 'T20-L08-fc-match',
            front: 'What is a match requirement in RUS broadband programs?',
            back: 'The percentage of total project cost the borrower must contribute from non-RUS sources. ReConnect requires 10–20%; Community Connect requires 25%.',
          },
        ]}
      />

      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T20-L08-Q1',
            type: 'mc',
            prompt: 'ReConnect is a RUS program for:',
            options: [
              { key: 'a', text: 'Electric utility loans only' },
              { key: 'b', text: 'Dedicated broadband grant/loan post-2018' },
              { key: 'c', text: 'Distance learning and telemedicine only' },
              { key: 'd', text: 'Wireless networks only' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L08-Q2',
            type: 'mc',
            prompt: 'What does "broadband-eligible cost" mean?',
            options: [
              { key: 'a', text: 'Any cost in a broadband project' },
              { key: 'b', text: 'Plant capable of ≥25 Mbps and funded under broadband program rules' },
              { key: 'c', text: 'Costs over the RUS allowance' },
              { key: 'd', text: 'Equipment purchased from approved vendors' },
            ],
            correct: 'b',
          },
        ]}
      />
    </LessonLayout>
  );
}
