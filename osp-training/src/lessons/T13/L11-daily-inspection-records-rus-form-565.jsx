// T13.L11 — Daily Inspection Records: RUS Form 565
// NEW lesson per R-9-H1/H2: Form 565 fields, federal advance chain,
// competent-resident-inspection obligation, loan advance suspension trigger
// Standards: 7 CFR §1753.19, §1753.22; RUS Forms 565, 7d, 553a; 2 CFR §200.334

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';

export const meta = {
  id: 'T13.L11',
  course_id: 'T13',
  title: 'Daily Inspection Records: RUS Form 565',
  order: 2,
  lesson_type: 'standards',
  prerequisites: ['T13.L01'],
  learning_objectives: [
    'Complete every required field of RUS Form 565 accurately for a hypothetical construction day',
    'Explain the Form 565 → Form 7d → Form 553a → Form 219 federal advance chain and the inspector\'s role in each link',
    'Define "competent resident inspection at all times" per 7 CFR §1753.19 and apply it to multi-crew scenarios',
    'State the inspector transition protocol (vacation/illness gap) that prevents loan advance suspension',
    'Identify two actions the GFR may take when Form 565 records are missing',
  ],
  estimated_minutes: 28,
  vocabulary_introduced: [
    'RUS Form 565 (Inspector\'s Daily Report)',
    '7 CFR §1753.19 inspection obligation',
    'loan advance suspension trigger',
    'competent resident inspection',
    'RUS Form 553a (Contractor\'s Certificate)',
    'RUS Form 7d (advance authorization)',
    'construction advance chain',
    'federal advance certification',
  ],
  key_terms: [
    {
      term: 'RUS Form 565 (Inspector\'s Daily Report)',
      definition:
        'The official daily record kept by the RUS borrower\'s field inspector on every construction day. Required by 7 CFR §1753.19. Contains: date, project and contract identifiers, weather conditions, contractor crew size and equipment present, description of work performed, measurements taken (depth, lashing pitch, ground resistance), deficiencies noted with location references, and inspector signature. Form 565 is not optional — it is the evidentiary basis for all loan advance requests and the primary document reviewed during GFR audits.',
    },
    {
      term: '7 CFR §1753.19 inspection obligation',
      definition:
        'The federal regulation that mandates "competent resident inspection at all times" during construction of RUS-financed telephone plant. This means the inspector must be physically present during active construction — not a drive-by once per week. The requirement cannot be satisfied by relying on contractor quality control; it requires an independent, owner-employed or owner-hired inspector. Failure to maintain continuous qualified inspection is a loan condition default.',
    },
    {
      term: 'loan advance suspension trigger',
      definition:
        'An event or documentation deficiency that causes the GFR (Government Field Representative) to suspend the borrower\'s ability to request loan advance draws from the RUS. Common triggers: missing Form 565 weeks during active construction, unresolved punch-list items exceeding a percentage of contract value, or construction proceeding without approved engineer-of-record oversight. Suspension is resolved only by submitting the missing documentation and demonstrating corrective action.',
    },
    {
      term: 'competent resident inspection',
      definition:
        'Under 7 CFR §1753.19, an inspection performed by a qualified individual with sufficient technical knowledge to evaluate OSP construction against contract documents, applicable standards (NESC, RUS bulletins, project specifications), and regulatory requirements. "Resident" means on-site during active construction. "Competent" means technically qualified — not just any available employee. If the designated inspector is absent (vacation, illness), a qualified substitute must be designated in writing and their Form 565 entries must identify them by name and qualification.',
    },
    {
      term: 'RUS Form 553a (Contractor\'s Certificate)',
      definition:
        'The contractor\'s formal certification at project close-out that all work was completed in conformance with the contract documents, specifications, and applicable standards. Form 553a is submitted PARALLEL to the inspector\'s Form 219 — both are required before the GFR will process final close-out. The inspector\'s role: confirm that Form 553a is submitted by the contractor before signing Form 219, and that the work actually matches the contractor\'s certification.',
    },
    {
      term: 'RUS Form 7d (advance authorization)',
      definition:
        'The RUS form by which the borrower requests authorization from the GFR to make a loan advance draw. Form 7d is supported by the inspector\'s Form 565 records (documenting completed, conforming work), the contractor\'s pay application, and the engineer\'s certification of progress. Without complete Form 565 records for the period claimed, the GFR will not process the Form 7d. This is why missing Form 565 entries directly freeze the borrower\'s cash flow.',
    },
    {
      term: 'construction advance chain',
      definition:
        'The sequence of documentation required for a RUS borrower to receive loan advance payments: (1) Inspector completes Form 565 daily, documenting conforming construction. (2) Contractor submits pay application with work quantities. (3) Engineer certifies progress. (4) Borrower submits Form 7d advance request to GFR. (5) GFR reviews Form 565 records and approves or suspends. (6) At close-out: contractor submits Form 553a, inspector signs Form 219, GFR processes final close-out. Each link requires the prior link to be complete.',
    },
    {
      term: 'federal advance certification',
      definition:
        'The act of a responsible official (the inspector signing Form 219, the contractor signing Form 553a) certifying to the federal government that construction was completed in conformance with contract documents and applicable standards. Federal certification carries legal weight under the False Claims Act (31 USC §3729) — a material false statement in a federal certification can result in civil liability of up to three times the fraudulently claimed amount plus penalties. The inspector who signs Form 219 knowing that work is deficient may face personal liability.',
    },
  ],
  vocabulary_assumed: [
    { term: 'inspector (OSP)', source_lesson_id: 'T01.L06' },
    { term: 'RUS Form 219', source_lesson_id: 'T01.L05' },
    { term: 'punch list', source_lesson_id: 'T10.L11' },
    { term: 'inspector-arrival workflow', source_lesson_id: 'T13.L01' },
    { term: 'QA/QC', source_lesson_id: 'T13.L01' },
    { term: 'material deficiency', source_lesson_id: 'T13.L01' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T13L11DailyInspectionRecords() {
  const missingFormsScenario = {
    id: 'missing-565s',
    title: 'GFR Audit: Two Weeks of Missing Form 565s',
    description:
      'Your borrower is requesting a $180,000 loan advance draw covering three weeks of construction work. The GFR calls you and says: "I\'m reviewing your advance package. I can find Form 565s for Week 1, but Weeks 2 and 3 are missing. I cannot process the advance request."',
    startNode: 'start',
    nodes: {
      start: {
        text: 'Construction was actually happening during Weeks 2 and 3 — the inspector just forgot to complete Form 565. The contractor\'s pay application documents the work quantities. What do you do?',
        choices: [
          { label: 'Submit the advance without Form 565s — the pay application proves the work was done', nextNode: 'wrong_payapp' },
          { label: 'Reconstruct Form 565s from memory and submit them backdated', nextNode: 'wrong_backdate' },
          { label: 'Notify the GFR that Form 565s are missing; identify the inspection gap; prepare a corrective action memo; delay the advance request until documentation is complete', nextNode: 'correct' },
          { label: 'Ask the contractor to write the inspection reports on your behalf', nextNode: 'wrong_contractor' },
        ],
      },
      wrong_payapp: {
        text: '❌ The pay application documents what the contractor SAYS was done. Form 565 documents what the INSPECTOR CONFIRMED was done. They are not equivalent. The GFR requires independent inspector verification — the advance will be denied without Form 565s.',
        choices: [{ label: 'Try again', nextNode: 'start' }],
      },
      wrong_backdate: {
        text: '⚠️ Backdating federal records is document falsification. This is worse than the missing records — it is a potential False Claims Act violation and grounds for immediate loan default. Do NOT reconstruct or backdate Form 565s to cover a documentation gap.',
        choices: [{ label: 'Try again', nextNode: 'start' }],
      },
      correct: {
        text: '✅ Correct procedure: (1) Notify the GFR immediately — do not try to hide the gap. (2) Document in writing which dates are missing and why. (3) If the work is physically verifiable (depth, lashing, etc.), send a qualified inspector to verify existing work NOW and document what is observable — this is NOT a retroactive Form 565, it is a "verification of in-place work" memo. (4) Prepare a corrective action plan: how will you prevent this gap in future weeks? (5) Submit the advance for Week 1 only; resubmit for Weeks 2-3 after completing the verification memo. This approach is transparent and defensible.',
        choices: [{ label: 'Continue', nextNode: 'lesson' }],
      },
      wrong_contractor: {
        text: '❌ The inspector\'s records must be independently prepared by the inspector. Having the contractor prepare your inspection reports destroys the independence that makes the records credible. The GFR will reject such records, and this would be a violation of 7 CFR §1753.19\'s independent-inspection requirement.',
        choices: [{ label: 'Try again', nextNode: 'start' }],
      },
      lesson: {
        text: 'The lesson: missing Form 565s create a documentation gap that cannot be cleanly filled after the fact. Transparent reporting + verification of in-place work is the only defensible path. The real lesson: don\'t create the gap in the first place. Every construction day gets a Form 565.',
        choices: [],
      },
    },
  };

  const quizQuestions = [
    {
      id: 'q1',
      question: 'Under 7 CFR §1753.19, "competent resident inspection at all times" means:',
      type: 'multiple-choice',
      options: [
        'The inspector must be on-site every day construction is active, and must be technically qualified',
        'The inspector should visit the site at least twice per week',
        'The inspector may rely on the contractor\'s QC program as a substitute for independent inspection',
        'Inspection is required only during underground installation — aerial work can be self-inspected by the contractor',
      ],
      correct: 0,
      explanation:
        '"Competent" = technically qualified (not just available). "Resident" = on-site during active construction (not periodic visits). Neither the contractor\'s QC program nor periodic drive-bys satisfy this requirement. Missing inspection days on active construction days is a loan condition default.',
    },
    {
      id: 'q2',
      question: 'The correct Form 565 → Form 7d → Form 219 sequence is:',
      type: 'multiple-choice',
      options: [
        'Form 219 is signed first, then Form 7d advance requests are submitted, then Form 565 records are assembled',
        'Form 565 daily records document conforming work → Form 7d advance requests are supported by Form 565 → Form 219 certifies close-out',
        'Form 7d is submitted first to request construction funding, then Form 565 records are created, then Form 219 closes out',
        'Form 565 and Form 7d are the same document; Form 219 closes the project',
      ],
      correct: 1,
      explanation:
        'The construction advance chain flows: Form 565 (daily inspector record, documents conforming work) → supports Form 7d (advance authorization request) → at close-out: contractor submits Form 553a and inspector signs Form 219. Each step depends on the prior step being complete. Missing Form 565s break the chain at the first link.',
    },
    {
      id: 'q3',
      question: 'The designated inspector goes on vacation for two weeks during active aerial construction. The correct procedure is:',
      type: 'multiple-choice',
      options: [
        'Halt all construction until the designated inspector returns',
        'Designate a qualified substitute inspector in writing; the substitute completes Form 565 entries under their own name and credentials',
        'Have the contractor self-inspect using their own QC program during the absence',
        'Submit Form 565s for the vacation period as "no work performed" even if construction continues',
      ],
      correct: 1,
      explanation:
        'A qualified substitute inspector must be designated in writing before the absence. The substitute completes Form 565 under their own name and qualifications — they do not use the absent inspector\'s credentials. Falsifying Form 565 entries is a federal certification violation. Option A (halt construction) is an option but has significant schedule and cost implications — designating a substitute is the preferred solution when available.',
    },
    {
      id: 'q4',
      question: 'Form 553a (Contractor\'s Certificate) must be submitted:',
      type: 'multiple-choice',
      options: [
        'Only if the inspector requests it',
        'In parallel with the inspector\'s Form 219 at close-out — both are required before the GFR processes final close-out',
        'Before construction begins, as a pre-qualification document',
        'After Form 219 is signed, to confirm the inspector\'s findings',
      ],
      correct: 1,
      explanation:
        'Form 553a (contractor\'s certification of conforming completion) and Form 219 (inspector\'s close-out certification) are submitted in parallel at project close-out. Both are required. The inspector verifies that Form 553a has been submitted by the contractor AND that the work actually matches the contractor\'s certification before signing Form 219.',
    },
    {
      id: 'q5',
      question: 'Two weeks of Form 565 records are missing. The GFR will most likely:',
      type: 'multiple-choice',
      options: [
        'Ignore the gap if the pay application shows work was performed',
        'Suspend loan advance requests until the documentation deficiency is resolved',
        'Allow the contractor to reconstruct the missing records from their own daily logs',
        'Issue a warning letter but process the advance anyway',
      ],
      correct: 1,
      explanation:
        'Missing Form 565 records are a loan advance suspension trigger. The GFR cannot verify that independent inspection occurred for that period and will suspend advance processing. Resolution requires transparent reporting of the gap, a corrective action plan, and (where physically possible) a verification memo for in-place work — NOT backdated Form 565 entries.',
    },
  ];

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Think of RUS Form 565 as the inspector's daily timecard, field notebook, and legal
          affidavit all rolled into one document. Every day construction is active, you fill one
          out. It records what happened, who was there, what you measured, and what was
          deficient. The federal government uses these records to decide whether the borrower gets
          their loan advance money.
        </p>
        <p>
          Missing a Form 565 is not a paperwork inconvenience — it can freeze the rural
          cooperative's cash flow until the documentation gap is resolved. Understanding WHY
          Form 565 matters makes it much easier to fill it out every day without exception.
        </p>
      </section>

      {/* ── Flashcards ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>Key Terms</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── WORKING ────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Required Fields on RUS Form 565</h2>
        <p>
          Form 565 is a structured document. Every line has a purpose. The following fields are
          required on every completed Form 565:
        </p>
        <ol>
          <li>
            <strong>Project and contract identifiers:</strong> Borrower name, RUS loan account
            number, contract number, and the specific work order or segment identifier for
            today's work.
          </li>
          <li>
            <strong>Date and weather:</strong> Full date (month/day/year), temperature (high/low
            or range), precipitation (yes/no/type), wind conditions if relevant to cable work.
          </li>
          <li>
            <strong>Contractor crew information:</strong> Contractor name, foreman name, crew
            count, and equipment present (trencher model, cable reel trailer, etc.).
          </li>
          <li>
            <strong>Description of work performed:</strong> What was installed, where (station
            numbers or GPS coordinates), and how much (linear feet, number of splices, structures).
          </li>
          <li>
            <strong>Inspection measurements:</strong> Specific measurements taken — burial depth
            (depth probe readings at intervals), lashing pitch (count per distance), ground
            resistance readings (ohms), OTDR test witnessing (record instrument serial number
            and pass/fail verdict — see L07 for witnessing protocol).
          </li>
          <li>
            <strong>Deficiencies:</strong> Every material deficiency documented with location,
            description, spec clause violated, and required corrective action.
          </li>
          <li>
            <strong>Inspector signature and credentials:</strong> Full name, organization, any
            relevant license or certification number. The inspector's signature is a federal
            certification that the recorded observations are accurate.
          </li>
          <li>
            <strong>Contractor representative acknowledgment:</strong> Contractor representative
            signature confirming they received the deficiency notifications (if any). Note: their
            signature acknowledges receipt, not agreement.
          </li>
        </ol>

        <h3>Defensible Record Standards</h3>
        <p>
          Form 565 entries must meet these standards to hold up in a GFR audit or litigation:
        </p>
        <ul>
          <li>
            <strong>Timestamps:</strong> GPS-synchronized time preferred; at minimum, record
            time of key observations (depth check at Station 45+20 at 10:15 AM).
          </li>
          <li>
            <strong>Corrections:</strong> Single-line strike-through only — no white-out. Write
            the correction with initials and date next to the strike-through. Do NOT erase.
          </li>
          <li>
            <strong>Significant digits:</strong> Match instrument precision. A depth probe reads
            to the nearest inch — record "36 inches," not "36.000 inches." An OTDR reads to
            0.01 dB — record "0.23 dB," not "0.2 dB."
          </li>
          <li>
            <strong>Media durability:</strong> Weatherproof paper or digital records with secure
            backup. Pencil on copy paper that smears in rain is not acceptable for federal records.
          </li>
        </ul>

        <h3>The Federal Advance Chain</h3>
        <p>
          Understanding the chain makes each link's importance clear:
        </p>
        <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px', padding: '1rem', margin: '1rem 0' }}>
          <p style={{ margin: '0.25rem 0', fontFamily: 'monospace' }}>
            Form 565 daily (inspector) → documents conforming work
          </p>
          <p style={{ margin: '0.25rem 0', fontFamily: 'monospace' }}>
            ↓
          </p>
          <p style={{ margin: '0.25rem 0', fontFamily: 'monospace' }}>
            Form 7d (advance request) → supported by Form 565 records
          </p>
          <p style={{ margin: '0.25rem 0', fontFamily: 'monospace' }}>
            ↓
          </p>
          <p style={{ margin: '0.25rem 0', fontFamily: 'monospace' }}>
            GFR review → advance approved or suspended
          </p>
          <p style={{ margin: '0.25rem 0', fontFamily: 'monospace' }}>
            ↓
          </p>
          <p style={{ margin: '0.25rem 0', fontFamily: 'monospace' }}>
            Close-out: Form 553a (contractor) + Form 219 (inspector) → final close-out
          </p>
        </div>
        <p>
          If your Form 565 records are missing for Week 2 and the borrower submits a Form 7d
          claiming Week 2 progress, the GFR has no independent verification of that work. The
          advance is suspended. The borrower's contractor is not getting paid. The cooperative
          board is calling the engineer. All because Form 565 wasn't filled out.
        </p>

        <h3>Competent Resident Inspection — Multi-Crew Reality</h3>
        <p>
          On large RUS projects, a single contractor may run three crews simultaneously: one
          HDD bore crew, one aerial lashing crew, and one splicing crew. "Competent resident
          inspection at all times" does not mean one inspector can watch three crews at once —
          it means the borrower must provide adequate inspection coverage for each active
          crew. In practice, this means:
        </p>
        <ul>
          <li>One inspector per active crew (or a documented sampling plan approved by the engineer of record)</li>
          <li>Each inspector completes their own Form 565 for their crew's work</li>
          <li>If only one inspector is available and multiple crews are working, the inspector must document which crew they were observing at each time and which periods had reduced coverage</li>
        </ul>
        <p>
          The critical rule: if coverage was reduced for a period, document it honestly. "I was
          with the bore crew from 0800-1200. The aerial crew worked unsupervised 0800-1200;
          depth checks were performed at 1300 on completed work." That is defensible. Fabricating
          coverage you didn't provide is not.
        </p>
      </section>

      {/* ── Scenario ───────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Scenario: Missing Form 565s</h2>
        <BranchingScenario scenario={missingFormsScenario} />
      </section>

      {/* ── ADVANCED ───────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Federal Advance Certification and Legal Exposure</h2>
        <p>
          When you sign Form 219 at project close-out, you are making a federal certification.
          The same False Claims Act (31 USC §3729) that applies to contractors also applies to
          any individual who knowingly submits or causes to be submitted a false or fraudulent
          claim to the federal government. The civil penalty is up to three times the falsely
          claimed amount plus $27,894 per violation (2023 inflation adjustment — verify current
          figure at publication time).
        </p>
        <p>
          <strong>Practical implication:</strong> if you sign Form 219 certifying that a project
          is complete and compliant when you know it is not — perhaps because the borrower
          pressured you to sign so the final advance could be released — you have personal
          liability exposure. "I was told to sign it" is not a defense to an FCA claim.
        </p>
        <p>
          <strong>Book vs. Field Practice:</strong> Textbook guidance says refuse to sign Form
          219 until all deficiencies are resolved. In practice, on complex projects there are
          sometimes minor punch-list items that take months to close (a landowner access dispute,
          a permit condition that requires seasonal vegetation replanting). The accepted field
          practice is "substantial completion with conditions" — Form 219 is signed with an
          attached list of outstanding items and a completion schedule. The inspector and engineer
          document exactly what is incomplete. This is legally defensible ONLY if the outstanding
          items are minor and documented — it is NOT acceptable to sign Form 219 knowing there
          are material deficiencies.
        </p>

        <h3>Inspector Transition Protocol</h3>
        <p>
          When the designated inspector leaves mid-project (vacation, illness, job change), a
          documented handoff is required:
        </p>
        <ol>
          <li>Outgoing inspector documents all open punch items and their status</li>
          <li>Incoming inspector reviews all prior Form 565 records before assuming responsibility</li>
          <li>A transition memo is created: date of transition, names and credentials of both inspectors, a statement that the incoming inspector has reviewed prior records</li>
          <li>The borrower notifies the GFR of the inspector change</li>
          <li>The incoming inspector's Form 565 entries begin on the date they assumed responsibility — they do not backfill or sign entries for periods they were not present</li>
        </ol>
        <p>
          The incoming inspector cannot certify work they did not observe. If they discover,
          through records review, that prior periods have documentation gaps, they document
          the gap honestly and follow the missing-Form-565 procedure described in the scenario above.
        </p>

        <h3>Records Retention: 2 CFR §200.334</h3>
        <p>
          Federal grant regulations (2 CFR §200.334) require retention of all project records
          for a minimum of three years after the final expenditure report is submitted to the
          federal agency. For RUS projects, the final expenditure report is tied to the final
          close-out audit. In practice this means Form 565s from a project that closed out in
          2026 must be retained through at least 2029, potentially longer if there is active
          litigation or audit.
        </p>
        <p>
          <strong>The inspector's obligation:</strong> transfer the complete Form 565 record set
          to the borrower at close-out. Do not personally retain the only copy. The borrower is
          the "non-Federal entity" responsible for the retention obligation under 2 CFR §200.334.
          If you keep the forms and then leave that job, the borrower may have no records when
          the GFR audits three years later.
        </p>
      </section>

      {/* ── QUIZ ───────────────────────────────────────────────────────── */}
      <section data-tier="assessment">
        <h2>Lesson Quiz</h2>
        <Quiz questions={quizQuestions} />
      </section>

    </LessonLayout>
  );
}
