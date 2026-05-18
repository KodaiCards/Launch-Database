// T12.L14 — Test Documentation and Reports
// Working lesson: SOR file, loss report, test report components, record-keeping
// Source: Bellcore GR-196 | TIA-455-61 | RUS 1753F-401 | NECA/FOA 301-2016

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T12.L14',
  course_id: 'T12',
  title: 'Test Documentation and Reports',
  order: 14,
  lesson_type: 'working',
  prerequisites: ['T12.L02', 'T12.L07', 'T12.L13'],
  learning_objectives: [
    'List the required components of a complete fiber optic test report for an OSP acceptance test',
    'Explain what a Bellcore SOR file contains and why it is the required OTDR trace format',
    'Describe how OLTS and OTDR report data is combined in a final acceptance package',
    'Identify common documentation deficiencies that cause acceptance test rejection',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'SOR file',
    'loss report',
    'test report components',
    'as-tested fiber record',
  ],
  vocabulary_assumed: [
    { term: 'OLTS', source_lesson_id: 'T01.L08' },
    { term: 'OTDR', source_lesson_id: 'T01.L08' },
    { term: 'bidirectional OTDR', source_lesson_id: 'T12.L07' },
    { term: 'event table', source_lesson_id: 'T12.L08' },
    { term: 'acceptance threshold', source_lesson_id: 'T12.L13' },
  ],
  key_terms: [
    {
      term: 'SOR file',
      definition:
        'The standard binary file format for storing OTDR traces, defined by Bellcore (now Telcordia) in GR-196-CORE (also referenced as SR-NWT-001756). Stands for Standard OTDR Record. SOR files contain the raw trace data, measurement parameters (wavelength, pulse width, EIOR, averaging time, range), event table, instrument identification, and test date/time. All major OTDR manufacturers produce SOR-format files. SOR files can be replayed in independent viewers (EXFO FastReporter, Greenlee, VIAVI SmartOTDR Viewer) for third-party review — critical for acceptance documentation where the owner verifies the contractor\'s data.',
    },
    {
      term: 'loss report',
      definition:
        'The output of an OLTS measurement documenting end-to-end channel insertion loss. A complete loss report includes: test date/time, fiber ID, wavelength(s) tested, reference method used (one-cord, two-cord, or three-cord), measured insertion loss in dB, reference cord calibration values, pass/fail status vs. threshold, and technician signature. For RUS builds, loss reports accompany the OTDR SOR files as the Tier-1 acceptance document.',
    },
    {
      term: 'test report components',
      definition:
        'The set of documents required for a complete fiber optic acceptance test package. Minimum for OSP acceptance: (1) as-built reel record (manufacturer, reel number, EIOR, attenuation coefficient per reel), (2) OLTS loss report (Tier 1, bidirectional, 1310 nm + 1550 nm), (3) OTDR SOR files (Tier 2, bidirectional, 1310 nm + 1550 nm), (4) OTDR event table summary (per fiber, per direction), (5) splice loss record with bidirectional averages (per splice), (6) connector end-face inspection records (VIP grade per IEC 61300-3-35), (7) technician credentials and test date.',
    },
    {
      term: 'as-tested fiber record',
      definition:
        'The permanent record associating each fiber strand in each cable segment with its test data. Includes: cable ID, fiber count, fiber color/tube assignment, splice point locations and IDs, reel numbers, measured attenuation per reel, splice loss per location, end-to-end loss by fiber, and OTDR trace file references. The as-tested record is the primary deliverable for OSP closeout documentation. Without it, future maintenance and troubleshooting teams have no baseline to compare against.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T12L14_TestDocumentation() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ── */}
      <section data-tier="foundations">
        <h2>Why Documentation Is as Important as the Test Itself</h2>

        <p>
          You can run perfect OLTS and OTDR measurements, get excellent results, and still fail
          the acceptance test — if you can't prove what you measured. Owners, engineers, and
          carriers need documentation to verify:
        </p>
        <ul>
          <li>The right fibers were tested (each fiber identified, not just "all fibers in the cable")</li>
          <li>The right parameters were set (correct wavelength, correct EIOR, correct pulse width)</li>
          <li>The right acceptance thresholds were used (correct standard applied)</li>
          <li>The results actually match the submitted report (SOR files allow independent trace replay)</li>
          <li>The test was performed by qualified personnel on a specific date</li>
        </ul>
        <p>
          On a RUS project, acceptance test documentation is a contractual deliverable — it must
          be submitted before invoice payment is approved. Missing documentation = no payment.
          Wrong documentation = re-test and re-submit. Complete, organized documentation = faster
          payment and fewer disputes.
        </p>
      </section>

      {/* ── WORKING ── */}
      <section data-tier="working">
        <h2>The SOR File — Why It's the Required OTDR Trace Format</h2>

        <p>
          When you press "save" on an OTDR after a measurement, the instrument saves the trace in
          a binary file. The universal standard for that file format is the
          <strong> Bellcore SOR (Standard OTDR Record)</strong>, defined in GR-196-CORE.
        </p>
        <p>
          Why SOR matters for documentation:
        </p>
        <ul>
          <li>
            <strong>Portability:</strong> SOR files can be opened by any SOR-compatible viewer —
            not just the brand of OTDR that created them. The reviewer doesn't need to own the same
            OTDR model. Free viewers are available (VIAVI SmartOTDR Viewer, EXFO FastReporter
            Lite).
          </li>
          <li>
            <strong>Completeness:</strong> the SOR file contains the entire measurement context —
            wavelength, pulse width, EIOR, averaging time, instrument model and serial number,
            test date/time. A PDF screenshot of the OTDR screen doesn't contain this metadata.
          </li>
          <li>
            <strong>Tamper-evident:</strong> SOR files carry a checksum. If the trace data is
            modified after the fact, the checksum changes and the file appears as modified in
            compliant viewers. PDFs are easily edited. SOR files are not.
          </li>
          <li>
            <strong>Cursor verification:</strong> the reviewer can see exactly where the
            measurement cursors were placed and verify that loss readings were calculated correctly.
          </li>
        </ul>
        <p>
          <strong>What to deliver:</strong> one SOR file per fiber per direction per wavelength.
          A 48-fiber cable tested bidirectionally at 1310 nm and 1550 nm = 48 × 2 × 2 = 192 SOR
          files. File naming convention: typically `CableID_FiberNN_Dir_WavelengthNM.sor`.
        </p>

        <h3>Required components of a complete acceptance test package</h3>
        <table>
          <thead>
            <tr><th>#</th><th>Document / deliverable</th><th>Required for RUS?</th><th>Format</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>As-built reel record (manufacturer, reel ID, EIOR, attenuation per reel, meter marks)</td>
              <td>Yes</td>
              <td>Spreadsheet or PDF from cable manufacturer</td>
            </tr>
            <tr>
              <td>2</td>
              <td>OLTS loss report — bidirectional, 1310 nm + 1550 nm, per fiber</td>
              <td>Yes</td>
              <td>OTDR/OLTS-generated PDF or Excel, with pass/fail</td>
            </tr>
            <tr>
              <td>3</td>
              <td>OTDR SOR files — bidirectional, 1310 nm + 1550 nm, per fiber</td>
              <td>Yes</td>
              <td>Binary .sor files, organized by cable ID</td>
            </tr>
            <tr>
              <td>4</td>
              <td>OTDR event table summary — per fiber, per direction</td>
              <td>Yes</td>
              <td>Exported from OTDR software; PDF or spreadsheet</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Splice loss record — bidirectional averages per splice per fiber</td>
              <td>Yes</td>
              <td>Spreadsheet with A→B, B→A, and average columns</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Connector end-face inspection records — VIP grade per connector</td>
              <td>Yes (for connectorized ends)</td>
              <td>VIP-generated PDF or photo grid with pass/fail grade</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Technician credentials and test date</td>
              <td>Yes</td>
              <td>Cover sheet with signature, FOA/BICSI certification if required</td>
            </tr>
          </tbody>
        </table>

        <h3>Common documentation deficiencies that cause rejection</h3>
        <ul>
          <li>
            <strong>Wrong wavelength documented:</strong> OTDR SOR files saved at only one wavelength,
            not both 1310 nm and 1550 nm. Missing the second wavelength = re-test.
          </li>
          <li>
            <strong>Unidirectional-only OTDR data on RUS builds:</strong> No B→A traces. Contractor
            must re-test from the far end.
          </li>
          <li>
            <strong>EIOR not documented:</strong> Reviewer can't verify distance accuracy. Extract
            from SOR metadata or document separately in the reel record.
          </li>
          <li>
            <strong>Fiber IDs missing or inconsistent:</strong> Report says "Fiber 1" but the as-built
            drawings use tube/fiber color codes. Every fiber needs both naming conventions documented.
          </li>
          <li>
            <strong>No splice loss averages calculated:</strong> Contractor submits two SOR files
            (one per direction) per fiber but no spreadsheet computing the bidirectional averages.
            The reviewer should not have to calculate this manually.
          </li>
          <li>
            <strong>PDF screenshots instead of SOR files:</strong> Photos of the OTDR screen are not
            acceptable replacements for SOR files. Reject and require re-submission of actual SOR files.
          </li>
        </ul>

        <h3>Field record-keeping habits that prevent rejection</h3>
        <p>
          Before leaving the test site:
        </p>
        <ol>
          <li>Name all SOR files with a consistent convention that includes cable ID + fiber number + direction + wavelength.</li>
          <li>Export the event table from each SOR file while the OTDR is still connected and the trace is fresh.</li>
          <li>Complete the splice loss spreadsheet on-site — fill in bidirectional averages while both directional readings are in front of you.</li>
          <li>Photograph each VIP inspection screen for each connector (date/time stamp from VIP is sufficient for documentation).</li>
          <li>Verify the reel serial numbers recorded during construction match the SOR-file EIOR values used.</li>
        </ol>
      </section>

      {/* ── ADVANCED ── */}
      <section data-tier="advanced">
        <h2>Advanced: Digital Asset Management for Multi-Build Projects</h2>
        <p>
          On a multi-mile, multi-route RUS build with hundreds of fibers and dozens of splice
          locations, the test data can easily exceed 10,000 individual files. Without a systematic
          naming and filing structure, finding a specific fiber's traces during a future maintenance
          event becomes a hours-long exercise.
        </p>
        <p>
          Recommended folder structure:
        </p>
        <pre>
          {`ProjectID/
  Testing/
    Route_A/
      Cable_A-001/
        F01_AtoB_1310nm.sor
        F01_BtoA_1310nm.sor
        F01_AtoB_1550nm.sor
        F01_BtoA_1550nm.sor
        ...
      Splice_01/
        OLTS_Loss_Report.pdf
        Splice_Loss_Record.xlsx
    Route_B/
      ...
  As-Built/
    Reel_Records/
    Splice_Maps/`}
        </pre>
        <p>
          Cloud storage with version control (Google Drive, SharePoint, or a simple Git repository
          for text-based records) preserves the archive and allows remote access for the engineer
          reviewing the package without requiring physical file transfer.
        </p>
        <p>
          Some carriers and government owners now require direct upload to their own project
          management systems. Confirm the required submission format before starting the test —
          re-formatting 500 files after the fact is expensive.
        </p>
      </section>

      {/* ── QUIZ ── */}
      <section data-tier="quiz">
        <Quiz
          id="T12L14-quiz"
          questions={[
            {
              id: 'q1',
              type: 'multiple-choice',
              text: 'Why are SOR files required for OTDR trace submission rather than PDF screenshots of the OTDR display?',
              options: [
                { id: 'a', text: 'SOR files are a smaller file size than PDFs, reducing storage requirements' },
                { id: 'b', text: 'SOR files contain full trace data, measurement parameters, and a tamper-evident checksum — the reviewer can replay the trace, verify cursor positions, and validate measurement settings' },
                { id: 'c', text: 'PDFs cannot display OTDR traces; only SOR viewers can render the data' },
                { id: 'd', text: 'SOR files are required by the OTDR manufacturer\'s warranty terms, not by any industry standard' },
              ],
              correct: 'b',
              explanation: 'SOR files (Bellcore GR-196-CORE format) contain the complete trace data, all measurement parameters (wavelength, pulse width, EIOR, averaging time), instrument identification, and a checksum. Reviewers can replay the file in independent viewers to verify cursor positions and recalculate losses. PDFs are easily edited and contain no measurement metadata. SOR files are tamper-evident — any modification changes the checksum, which compliant viewers flag.',
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              text: 'A contractor submits OTDR SOR files for a 36-fiber, 8 km OSP build with bidirectional measurement at 1310 nm only. The acceptance engineer should:',
              options: [
                { id: 'a', text: 'Accept it — bidirectional at one wavelength meets the TIA-526-7 minimum for single-mode testing' },
                { id: 'b', text: 'Accept it for the fiber loss verification, but require supplemental macrobend check by visual inspection' },
                { id: 'c', text: 'Reject it — dual-wavelength testing (1310 nm + 1550 nm) is required; missing 1550 nm traces means the acceptance test is incomplete' },
                { id: 'd', text: 'Accept it if the 1310 nm results show adequate margin (>2 dB) since the 1550 nm results would be better' },
              ],
              correct: 'c',
              explanation: 'Dual-wavelength testing (1310 nm + 1550 nm minimum) is required for singlemode OSP acceptance per NECA/FOA 301 and good practice. The 1310 nm test does not reveal macrobends that will affect the 1550 nm performance of the link under actual traffic conditions. The 1550 nm OTDR traces are missing — the acceptance test is incomplete and must be re-done.',
            },
            {
              id: 'q3',
              type: 'multiple-choice',
              text: 'Which of the following documentation deficiencies would be the most difficult to resolve after the test crew has demobilized from the field?',
              options: [
                { id: 'a', text: 'Missing the reel serial number for one cable segment' },
                { id: 'b', text: 'OTDR SOR files missing because traces were saved as JPG screenshots on-site' },
                { id: 'c', text: 'Splice loss spreadsheet uses abbreviations the reviewer doesn\'t recognize' },
                { id: 'd', text: 'Report cover page has the wrong project address' },
              ],
              correct: 'b',
              explanation: 'JPG screenshots are not equivalent to SOR files — they lack trace data, measurement metadata, and cursor positions. The only fix is to re-mobilize and re-test. A missing reel serial number (A) can often be resolved from manufacturer shipping records or the as-built cable route. Abbreviation confusion (C) and address errors (D) are clerical fixes. Missing SOR files require physical re-testing, which is expensive and time-consuming after demobilization.',
            },
          ]}
        />
      </section>

      {/* ── FLASHCARDS ── */}
      <section data-tier="flashcards">
        <h2>Key Terms</h2>
        {meta.key_terms.map((kt) => (
          <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
        ))}
      </section>

    </LessonLayout>
  );
}
