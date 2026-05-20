// T13.L07 — Close-Out Documentation: Form 219 and the RUS Form Chain
// 7 CFR §1753.21, §1753.22, §1755.404, §1755.407, §1755.400(b); 2 CFR §200.334; 31 USC §3729 (FCA)
// H-05: FCA cross-ref; H-17: Form 553a; H-19: OTDR archive; H-21/H-22: calibration; L-03: 1753F-401; L-07: defensible records

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T13.L07',
  course_id: 'T13',
  title: 'Close-Out Documentation: Form 219 and the RUS Form Chain',
  order: 7,
  lesson_type: 'standards',
  prerequisites: ['T13.L06'],
  learning_objectives: [
    'Assemble the complete RUS Form 219 close-out package with all required components',
    'Verify the OTDR archive checklist (bidirectional, SOR format, launch cable subtracted, delivered to owner)',
    'Explain the False Claims Act (FCA) §3729 exposure for a materially false Form 219 certification',
    'Confirm OTDR and OLTS instrument calibration before accepting final test results',
    'Apply defensible record standards (timestamps, strike-through corrections, significant digits) to Form 565 and Form 219',
  ],
  estimated_minutes: 35,
  vocabulary_introduced: [
    'OTDR archive verification checklist',
    'records package handoff',
    'Form 219 certification scope',
  ],
  key_terms: [
    {
      term: 'OTDR archive verification checklist',
      definition:
        'The inspector\'s pre-close-out checklist to verify that OTDR acceptance testing records meet the requirements of 7 CFR §1755.404 and §1755.407 (Format V). Required elements: (1) Bidirectional traces present for every fiber tested — one trace in each direction. (2) Files in SOR (Standard OTDR Record) format — not PDF-only. (3) Launch cable length confirmed subtracted from the trace — the launch-fiber dead zone must not include billable plant. (4) Archive delivered to the borrower/owner (not retained by the contractor or test technician). (5) Chain of custody documented: who delivered the archive, to whom, on what date, in what format (USB, cloud link, etc.).',
    },
    {
      term: 'records package handoff',
      definition:
        'The transfer of the complete project inspection and test records from the inspector to the borrower at project close-out, as required by 2 CFR §200.334 (federal grant records retention). The handoff is documented: inspector prepares a transmittal letter listing every document in the package, the borrower signs receipt. The borrower then becomes the responsible records custodian for the minimum 3-year retention period (longer if audit or litigation is pending). The inspector retains copies but is not the official custodian.',
    },
    {
      term: 'Form 219 certification scope',
      definition:
        'RUS Form 219 is the Inspector\'s Certificate of Construction for the project. By signing, the inspector certifies that: (1) the work was performed in accordance with the contract documents, (2) materials used conform to project specifications, (3) construction meets applicable standards (NESC, NEC, RUS bulletins), and (4) all required inspection and testing was completed and documented. The certification is a federal statement subject to the False Claims Act (31 USC §3729). The inspector should only sign Form 219 when all material deficiencies have been resolved (or have been formally documented as outstanding with a resolution plan) and all required records are complete.',
    },
  ],
  vocabulary_assumed: [
    { term: 'inspector (OSP)', source_lesson_id: 'T01.L06' },
    { term: 'RUS Form 219', source_lesson_id: 'T01.L05' },
    { term: 'RUS Form 553a (Contractor\'s Certificate)', source_lesson_id: 'T13.L11' },
    { term: 'construction advance chain', source_lesson_id: 'T13.L11' },
    { term: 'federal advance certification', source_lesson_id: 'T13.L11' },
    { term: 'FCA implied certification', source_lesson_id: 'T04.L09' },
    { term: 'OTDR', source_lesson_id: 'T12.L07' },
    { term: 'OLTS', source_lesson_id: 'T12.L06' },
    { term: 'material lot traceability', source_lesson_id: 'T13.L06' },
    { term: '2 CFR §200.334 records retention', source_lesson_id: 'T13.L12' },
    { term: 'ground resistance threshold (25Ω, NEC §250.56)', source_lesson_id: 'T14.L06' },
    { term: 'NEPA condition of approval', source_lesson_id: 'T13.L12' },
    { term: 'inspection cadence', source_lesson_id: 'T13.L02' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T13L07CloseOutDocumentation() {
  const quizQuestions = [
    {
      id: 'q1',
      question: 'Before accepting final OTDR acceptance test results, the inspector must verify:',
      type: 'multiple-choice',
      options: [
        'OTDR calibration label is current (annual per Telcordia GR-196-CORE) and the launch cable reference check was run and documented',
        'The OTDR was manufactured within the last 5 years',
        'The OTDR brand matches what was specified in the contract',
        'OTDR tests were witnessed by the engineer of record',
      ],
      correct: 0,
      explanation:
        'Per Telcordia GR-196-CORE §5.5, OTDR instruments require annual calibration. The inspector\'s pre-test checklist: (1) calibration label present and current (not expired), (2) instrument serial number logged on Form 565, (3) launch fiber reference check run before the first test fiber — confirms the instrument is reading correctly. An OTDR with an expired calibration or a failed reference check produces results that cannot be accepted. The inspector SHALL witness OTDR testing per 7 CFR §1755.400(b) — mandatory attendance, not optional.',
    },
    {
      id: 'q2',
      question: 'OTDR archive files must be delivered in which format to satisfy 7 CFR §1755.407 (Format V)?',
      type: 'multiple-choice',
      options: [
        'PDF report — human-readable format is sufficient',
        'SOR (Standard OTDR Record) format — machine-readable format compatible with OTDR analysis software',
        'Excel spreadsheet with event table',
        'Printed paper trace attached to Form 219',
      ],
      correct: 1,
      explanation:
        'SOR (Standard OTDR Record) format is the machine-readable standard (Bellcore/Telcordia TR-NWT-001138). 7 CFR §1755.407 Format V requires the traces in SOR format, not PDF-only. SOR files can be re-analyzed years later as technology changes; PDF screenshots cannot. The borrower may also require SOR files for their OSS (Operations Support System) import. Printed traces and Excel summaries may supplement but do not replace SOR.',
    },
    {
      id: 'q3',
      question: 'False Claims Act (31 USC §3729) applies to Form 219 because:',
      type: 'multiple-choice',
      options: [
        'Form 219 is a federal tax document',
        'Signing Form 219 is a federal certification — a knowingly false certification is a federal false claim subject to treble damages and civil penalties',
        'Form 219 is only signed by the contractor; the inspector\'s signature is advisory',
        'FCA applies only if the project received more than $100,000 in federal funds',
      ],
      correct: 1,
      explanation:
        'Form 219 is a federal certification — the inspector certifies to the U.S. government that construction was completed per contract documents and specifications. Under the FCA (31 USC §3729), a knowingly false federal certification subjects the certifier to civil liability of up to three times the amount of any fraudulent claim plus statutory penalties. There is no dollar threshold — the FCA applies regardless of project size. "Implied certification" means that each request for a loan advance impliedly certifies that all conditions (including complete inspection) were met.',
    },
    {
      id: 'q4',
      question: 'Form 553a (Contractor\'s Certificate) must be received by the inspector:',
      type: 'multiple-choice',
      options: [
        'After Form 219 is signed — it is the contractor\'s confirmation of the inspector\'s findings',
        'In parallel with Form 219 submission — both are required before the GFR processes final close-out',
        'Only when the contractor disputes the inspector\'s findings',
        'It is optional for projects under 2 miles in length',
      ],
      correct: 1,
      explanation:
        'Form 553a and Form 219 are parallel submissions at close-out. The GFR requires BOTH before processing final close-out and releasing the remaining retainage. The inspector verifies that Form 553a has been submitted by the contractor AND that the contractor\'s certification (that all work is conforming) matches the inspector\'s findings. If the contractor certifies conforming completion but the inspector has outstanding punch-list items, the discrepancy must be resolved before either document is accepted.',
    },
    {
      id: 'q5',
      question: 'Inspector\'s personal field notes are discoverable under FRCP Rule 34. The practical implication is:',
      type: 'multiple-choice',
      options: [
        'Destroy all personal notes before close-out to avoid liability',
        'Write notes as if opposing counsel will read them — facts only, no personal commentary about contractor personnel',
        'Personal notes are protected as attorney-client privilege',
        'Only notes made on official forms are discoverable; personal notebooks are exempt',
      ],
      correct: 1,
      explanation:
        'Under FRCP Rule 34, any document (including personal notebooks) created in connection with a project can be subpoenaed in litigation. Write facts, not opinions: "String line measured 78 inches at Station 45+20, 1:15 PM" is a fact. "Crew seemed lazy and rushed" is an opinion that will embarrass you at deposition. Personal notebooks are NOT privileged and are NOT exempt from discovery. Write every entry as a professional technical record.',
    },
    {
      id: 'q6',
      question: 'The SOR archive chain of custody record must document:',
      type: 'multiple-choice',
      options: [
        'Who made the OTDR — model and serial number',
        'Who delivered the SOR archive files, to whom, on what date, and in what format (USB, cloud link, email)',
        'The test technician\'s certification level',
        'The fiber count and route length tested',
      ],
      correct: 1,
      explanation:
        'Chain of custody for the OTDR SOR archive: document who physically delivered or transmitted the archive files, to whom (name, title, organization), on what date, and in what format (USB drive, encrypted file transfer, cloud link). This proves the owner/borrower has the archive — that it didn\'t stay with the contractor or test vendor. The form 565 entry at close-out: "SOR archive for all fibers (12 routes × 48 fibers = 576 fibers) delivered on USB drive to [Name, Title, Organization] on [date]. Delivery confirmed by signature on transmittal letter #[X]."',
    },
  ];

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Form 219 is the finish line of the inspection job. When you sign it, you are telling
          the federal government that the project is done and done right. That signature has
          legal weight — the False Claims Act means a knowingly false certification has
          financial consequences.
        </p>
        <p>
          This lesson covers what has to be true before you sign Form 219, how to verify the
          OTDR test records meet federal requirements, and how to assemble the records package
          that gets handed off to the borrower. The bridge from L06: the material acceptance
          records you assembled during construction are one component of the Form 219 package.
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
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3">
          <h3 className="text-blue-900 font-semibold mb-2">Quick Refresher</h3>
          <ul className="text-sm space-y-1">
            <li><strong>RUS Form 219:</strong> The Inspector's Final Certification of Completion certifying the project is done and conforms to specification.</li>
            <li><strong>RUS Form 565:</strong> The daily construction record documenting weather, crew, work completed, and inspection findings.</li>
            <li><strong>OTDR:</strong> The Optical Time-Domain Reflectometer instrument that measures fiber attenuation.</li>
          </ul>
        </div>

        <h2>The Form 219 Close-Out Package</h2>
        <p>
          Assembling the Form 219 package is the final inspector deliverable. Every component
          must be present and verified before Form 219 is signed. The package includes:
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Component</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Source / Standard</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Inspector Verification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Form 219 signed by inspector</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>7 CFR §1753.21</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Review all outstanding punch items resolved first</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Form 553a signed by contractor</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>7 CFR §1753.22</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Confirm received and matches inspector findings</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>OTDR acceptance test records</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>7 CFR §1755.404 + §1755.407 (Format V); RUS 1753F-401</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>OTDR archive checklist (SOR, bidirectional, launch-cable subtracted, delivered to owner)</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Material certification letters</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Lot/batch traceability from L06</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Three-way match verified during construction</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>All Form 565 daily reports</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>7 CFR §1753 [confirm current section]; 2 CFR §200.334</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>No gaps in coverage for active construction days</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Compaction test reports</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>ASTM D1557; project spec</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>All required test locations documented, all pass</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Ground resistance test records</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>NEC §250.56; IEEE 81</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>All rods ≤25Ω, instrument calibration verified</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>WH-347 certified payrolls</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>40 USC §3142 (Davis-Bacon); T13.L12</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>All weeks covered, no gaps, rates verified</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Environmental compliance logs</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>NEPA conditions; T13.L12</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>All conditions documented, no unresolved events</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Slack location register</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>T13.L05 close-out requirement</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>GPS coordinates, access info, slack lengths complete</td>
            </tr>
          </tbody>
        </table>

        <h3>OTDR Archive Verification Checklist</h3>
        <p>
          Per 7 CFR §1755.404 (test acceptance) and §1755.407 Format V (SOR archive
          requirement), the inspector shall witness OTDR testing AND verify the archive.
          "Shall" in a federal regulation means mandatory. Use this checklist before
          accepting the OTDR records as close-out complete:
        </p>
        <ol>
          <li>
            <strong>Bidirectional traces:</strong> Is there a trace in EACH direction for
            every fiber tested? Two files per fiber (A→B and B→A) are required. Unidirectional
            testing is not acceptable for RUS acceptance.
          </li>
          <li>
            <strong>SOR format:</strong> Are the files in SOR format (not PDF-only)? Open
            one file in an OTDR viewer software to confirm it is a valid SOR file.
          </li>
          <li>
            <strong>Launch cable subtracted:</strong> Verify the launch cable dead zone is
            accounted for. The first event visible on the trace (after the launch cable) should
            be the beginning of the billable plant, not the end of the test instrument.
          </li>
          <li>
            <strong>Archive delivered to borrower:</strong> The SOR files are delivered to
            the OWNER/BORROWER's designated records custodian — not retained by the contractor
            or test vendor. Document the delivery (transmittal letter signed by recipient).
          </li>
          <li>
            <strong>Calibration verified:</strong> OTDR calibration label current (annual per
            Telcordia GR-196-CORE §5.5). OLTS power meter and light source calibration current
            (TIA-526-7 §8). Serial numbers logged. Reference measurement documented.
          </li>
        </ol>

        <h3>Instrument Calibration — OTDR and OLTS</h3>
        <p>
          The inspector must verify calibration BEFORE accepting any test results. A test
          instrument with an expired calibration tag produces measurements that cannot be
          certified — the close-out package cannot include acceptance test results from an
          out-of-calibration instrument.
        </p>
        <p>
          <strong>OTDR:</strong> Annual calibration per Telcordia GR-196-CORE §5.5. Inspector
          checks: calibration label on instrument (sticker with expiration date), serial number
          confirmed matches the instrument. Inspector Form 565 entry before testing begins:
          "OTDR serial# [XXXX], cal label exp [date], within annual calibration. Launch fiber
          reference check: pass."
        </p>
        <p>
          <strong>OLTS (power meter + light source):</strong> Calibration per TIA-526-7 §8.
          Inspector witnesses the calibration-reference jumper measurement at the start of the
          test session. Record the meter reading versus manufacturer calibration record and
          confirm within TIA-526-7 tolerance before accepting any OLTS measurements.
        </p>
      </section>

      {/* ── ADVANCED ───────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>FCA Exposure — The Inspector's Personal Risk</h2>
        <p>
          The False Claims Act (31 USC §3729) civil penalty structure (at 2023 adjustment
          rates — verify current rates at publication time): up to three times the amount of
          any fraudulently claimed federal funds, plus $13,947–$27,894 per false statement.
          Personal liability, not just corporate.
        </p>
        <p>
          <strong>Implied certification:</strong> Even if Form 219 is technically truthful
          in each individual statement, the act of submitting a close-out package to support
          a final loan advance impliedly certifies that all material conditions have been met.
          If the inspector knew of unresolved material deficiencies that were not disclosed,
          the submission may be an implied false claim.
        </p>
        <p>
          <strong>Practical protection:</strong> Document everything. If there are outstanding
          items at the time of Form 219 signing, they must be explicitly identified in the
          Form 219 cover letter with a resolution plan. The inspector who transparently discloses
          known outstanding items is protected. The inspector who signs Form 219 without
          disclosing known deficiencies is not.
        </p>

        <h3>Defensible Record Standards — Summary</h3>
        <p>
          All inspector records (Form 565, personal notebooks, transmittal letters) must meet
          these standards for legal defensibility:
        </p>
        <ul>
          <li><strong>Timestamps:</strong> GPS-synchronized preferred; at minimum, record observation time.</li>
          <li><strong>Identity:</strong> Full name, organization, and license/certification if applicable on every document.</li>
          <li><strong>Corrections:</strong> Single-line strike-through only. No white-out. Initial and date the strike-through.</li>
          <li><strong>Significant digits:</strong> Match instrument precision. Depth probe to nearest inch; OTDR to 0.01 dB.</li>
          <li><strong>Media:</strong> Weatherproof paper or digital with secure backup.</li>
          <li><strong>Content:</strong> Facts, not opinions. "Measured 34 inches" not "seemed too shallow."</li>
        </ul>

        <h3>Records Retention and Handoff</h3>
        <p>
          At close-out, the inspector prepares a transmittal letter listing every document in
          the records package, the borrower signs receipt. 2 CFR §200.334 requires 3-year minimum
          retention after the final expenditure report. The inspector retains copies; the
          BORROWER is the official custodian. Do not allow the contractor to retain the only
          copy of any project record.
        </p>
      </section>

      {/* ── QUIZ ───────────────────────────────────────────────────────── */}
      <section data-tier="assessment">
        <h2>Lesson Quiz</h2>
        <Quiz questions={quizQuestions} />
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          This lesson builds on:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T01.L06</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T01.L05</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T13.L11</strong> — Part of the broader OSP workflow.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Each step in the OSP process feeds into the next — understanding these connections strengthens your grasp of the whole system.
        </p>
      </section>
    </LessonLayout>
  );
}
