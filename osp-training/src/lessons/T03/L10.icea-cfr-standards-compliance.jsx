// T03.L10 — ICEA S-87-640 & 7 CFR 1755.902 Standards Compliance
// Source-of-truth: audit-output/osp-rewrite-curriculum/T03_RESEARCH_BRIEF.md (HEAD d83f0bd)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';

export const meta = {
  id: 'T03.L10',
  course_id: 'T03',
  title: 'ICEA S-87-640 & 7 CFR 1755.902 — Standards Compliance',
  order: 10,
  lesson_type: 'working',
  prerequisites: [
    'T03.L01', 'T03.L02', 'T03.L03', 'T03.L04',
    'T03.L05', 'T03.L06', 'T03.L07', 'T03.L08', 'T03.L09',
  ],
  learning_objectives: [
    'Explain the difference between qualification testing (per design) and acceptance testing (per lot)',
    'State the RUS MFD tolerance requirement under 7 CFR 1755.902 and why it prevents splice-loss spikes',
    'Identify the ICEA S-87-640 standard installation tensile rating and lower-tier rating',
    'Verify a cable datasheet for ICEA S-87-640 and 7 CFR 1755.902 compliance using a structured checklist',
    'Distinguish the roles of ICEA S-87-640 (construction standard) and 7 CFR 1755.902 (federal compliance requirement)',
  ],
  vocabulary_introduced: [
    'qualification testing',
    'acceptance testing',
    'MFD tolerance (RUS)',
  ],
  key_terms: [
    {
      term: 'qualification testing',
      definition:
        'Factory tests performed on a new cable design to prove it meets the applicable standard before any production batches ship. Done once per design, not per lot. (Source: 7 CFR 1755.902; ICEA S-87-640)',
    },
    {
      term: 'acceptance testing',
      definition:
        'Testing performed on each production lot (or a statistical sample) of cable before delivery to verify ongoing conformance to the specification. Done per shipment, not per design. (Source: 7 CFR 1755.902; RUS 1753F-201)',
    },
    {
      term: 'MFD tolerance (RUS)',
      definition:
        'Under 7 CFR 1755.902, all single-mode fiber on a RUS-financed project must be manufactured to a mode field diameter of 9.2 µm ± 0.5 µm at 1310 nm unless the buyer specifies otherwise. This prevents splice-loss spikes when reels from different production runs are joined. (Source: 7 CFR 1755.902 via eCFR)',
    },
  ],
  vocabulary_assumed: [
    { term: 'loose-tube', source_lesson_id: 'T03.L01' },
    { term: 'tight-buffered', source_lesson_id: 'T03.L01' },
    { term: 'ribbon', source_lesson_id: 'T03.L01' },
    { term: 'RTS', source_lesson_id: 'T03.L04' },
    { term: 'ICEA S-87-640', source_lesson_id: 'T03.L01' },
    { term: 'MFD', source_lesson_id: 'T02.L01' },
  ],
  estimated_minutes: 28,
};

export default function T03L10_StandardsCompliance() {
  return (
    <LessonLayout meta={meta}>

      <section data-tier="foundations">
        <h2>Why Standards Exist — and Why They Matter on Every RUS Job</h2>
        <p>
          Think of cable standards the same way you think of material specs on a construction
          job: the spec tells you exactly what the product has to do before you're allowed to
          put it in the ground. ICEA S-87-640 is the industry standard that defines how OSP
          fiber cable must be built — buffer tube sizes, jacket thickness, tensile ratings,
          armor requirements. 7 CFR 1755.902 is the federal regulation that says "if you're
          spending RUS loan money, every cable on the project must meet these minimum numbers."
        </p>
        <p className="mt-2">
          Without standards, every manufacturer could ship whatever they felt like and you'd
          have no recourse when a cable failed in the field two years later. With standards,
          you have a contract: the cable either meets ICEA S-87-640 or it doesn't go in the
          ground.
        </p>

        <h3 className="mt-4">The Two Standards You Need to Know</h3>
        <p>
          <strong>ICEA S-87-640</strong> — published by the Insulated Cable Engineers
          Association. This is the construction standard. It covers physical dimensions,
          materials, mechanical performance (tensile, crush, impact), optical performance
          (attenuation, bandwidth), and environmental performance (temperature, water
          penetration). Every OSP fiber cable sold in the US is built to some version of
          this standard.
        </p>
        <p className="mt-2">
          <strong>7 CFR 1755.902</strong> — a section of the Code of Federal Regulations
          published by the USDA Rural Utilities Service. Title 7 is Agriculture; Part 1755 is
          RUS Telecommunications; Section 902 is the Minimum Performance Specification for
          Fiber Optic Cables. It's publicly available at eCFR.gov. On any RUS-financed
          project, this regulation is the legal minimum floor — ICEA S-87-640 compliance
          alone is not sufficient if the cable doesn't also meet 7 CFR 1755.902's specific
          requirements.
        </p>

        <h3 className="mt-4">Two Types of Testing — Know the Difference</h3>
        <p>
          Standards testing happens in two stages, and confusing them can cost you on a
          project submittal:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>Qualification testing</strong> — happens once per new cable design, before
            production starts. The manufacturer builds a prototype, runs every test in the
            standard, and submits the results to prove the design is sound. Think of it as
            the "type approval" for that design. If they change the armor type or the jacket
            compound, they re-qualify.
          </li>
          <li>
            <strong>Acceptance testing</strong> — happens on every production lot (or a
            statistical sample of it) before shipment to you. This is the ongoing quality
            check. RUS Bulletin 1753F-201 (Acceptance Tests and Measurements for
            Telecommunications Plant) covers the acceptance side. When you get a cable reel
            on site, the paperwork showing it passed acceptance testing is what you're
            verifying when you review the cable test reports before sign-off.
          </li>
        </ul>
        <p className="mt-3">
          <em>Book vs. field practice:</em> In theory, a project manager reviews acceptance
          test reports for every reel. In practice on rural aerial jobs, this verification
          often gets skipped under schedule pressure. The risk: a defective reel makes it
          into the trench or onto the strand, and you find out when the OTDR shows an
          anomalous splice loss at a factory splice — or worse, a break during initial
          operation. Get in the habit of asking for test reports; it costs five minutes and
          can save days of troubleshooting.
        </p>
      </section>

      <section data-tier="foundations" className="mt-6">
        <h3>Key Numbers from 7 CFR 1755.902</h3>
        <p>
          These values are directly from the eCFR public text — they're enforceable on every
          RUS project:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>MFD specification:</strong> Single-mode fiber must be manufactured to a
            mode field diameter (MFD) of <strong>9.2 µm ± 0.5 µm at 1310 nm</strong>, unless
            the buyer specifies otherwise. Values between 8.7 µm and 9.7 µm are conforming.
          </li>
          <li>
            <strong>Coating OD:</strong> The fiber coating must have an outside diameter of
            250 ± 15 µm (10 ± 0.6 mils).
          </li>
          <li>
            <strong>Color coding:</strong> Cable must be "fully color coded so that each fiber
            is distinguishable from every other fiber" using a 12-color scheme. (Blue, orange,
            green, brown, slate, white, red, black, yellow, violet, rose, aqua.)
          </li>
        </ul>
        <p className="mt-3 text-sm text-gray-600">
          Source: 7 CFR 1755.902 (eCFR.gov)
        </p>
      </section>

      <section data-tier="working" className="mt-6">
        <h3>Why MFD Tolerance Matters at Splices</h3>
        <p>
          Here's the practical reason the RUS cares about a ± 0.5 µm window on MFD: when
          you fusion-splice two fibers, the splice loss depends partly on how well the two
          mode fields match in size. If Reel 1 has fiber at MFD = 9.0 µm and Reel 2 has
          fiber at MFD = 9.6 µm, those fibers will splice with additional mismatch loss even
          if your splicer is perfectly aligned.
        </p>
        <p className="mt-2">
          On a large RUS project, you might have reels from multiple production runs, possibly
          from multiple manufacturers' sub-contractors. The 9.2 ± 0.5 µm specification keeps
          all fibers within a narrow enough window that worst-case mismatch loss stays below
          the detection threshold of normal OTDR acceptance testing (~0.1 dB).
        </p>
        <p className="mt-3">
          <em>Field practice note:</em> Most modern G.652.D production fiber lands around
          9.1–9.3 µm MFD. The tolerance is generous enough that you rarely see mismatch
          problems. But on a 500-reel project where you have no control over the manufacturer's
          production history, specifying 7 CFR 1755.902 compliance is the contractual
          protection that keeps the splice budget honest.
        </p>
      </section>

      <section data-tier="working" className="mt-6">
        <h3>ICEA S-87-640 Tensile Ratings</h3>
        <p>
          ICEA S-87-640 defines two tensile load tiers for OSP fiber cable:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>Standard installation tensile rating: 2,670 N (600 lbf).</strong> This is
            the maximum tensile load you can apply to the cable during installation — whether
            you're pulling it through conduit, lashing it to a messenger, or plowing it in.
            Exceeding this risks fiber breakage or permanent elongation.
          </li>
          <li>
            <strong>Lower-tier rating: 1,330 N (300 lbf).</strong>{' '}
            Some lighter-duty cable constructions carry this lower rating. A specification
            that calls for "600 lbf rated" cable explicitly requires the higher tier.
          </li>
        </ul>
        <p className="mt-3">
          <em>Book vs. field practice:</em> The rated tensile strength is the maximum — not the
          typical working load. A well-run job keeps actual pulling tension well below the
          limit by using proper lubricant, correct reel setup, and intermediate pull points on
          long conduit runs. Hitting 2,670 N during a pull isn't a win; it means you pushed
          the design to its edge. The tensile limit is the guard rail, not the target.
        </p>

        {/* WORKED EXAMPLE — datasheet walk */}
        <WorkedExample
          title="Datasheet Walk: Verifying ICEA & RUS Compliance"
          description={
            `You receive a sample Corning SMF-28 Ultra 48F OSP loose-tube cable datasheet. ` +
            `Walk through the key fields to verify ICEA S-87-640 and 7 CFR 1755.902 compliance ` +
            `before approving the submittal for a RUS project.`
          }
          variables={[
            { key: 'mfd', label: 'MFD at 1310 nm (µm)', units: 'µm', default: 9.2, min: 8.5, max: 10.0, step: 0.1 },
            { key: 'tensile', label: 'Max installation tensile (N)', units: 'N', default: 2670, min: 1000, max: 4000, step: 10 },
            { key: 'tempMin', label: 'Min operating temperature (°C)', units: '°C', default: -40, min: -60, max: 0, step: 1 },
            { key: 'tempMax', label: 'Max operating temperature (°C)', units: '°C', default: 70, min: 40, max: 90, step: 1 },
          ]}
          formula={({ mfd, tensile, tempMin, tempMax }) => {
            const mfdOk = mfd >= 8.7 && mfd <= 9.7 ? 1 : 0;
            const tensileOk = tensile >= 2670 ? 1 : 0;
            const tempOk = tempMin <= -40 && tempMax >= 70 ? 1 : 0;
            return mfdOk + tensileOk + tempOk;
          }}
          steps={({ mfd, tensile, tempMin, tempMax }, score) => {
            const mfdOk = mfd >= 8.7 && mfd <= 9.7;
            const tensileOk = tensile >= 2670;
            const tempOk = tempMin <= -40 && tempMax >= 70;
            return [
              {
                expression: `Step 1: MFD check — datasheet shows ${mfd} µm at 1310 nm`,
                value: undefined,
                unit: '',
              },
              {
                expression: `RUS 7 CFR 1755.902 requires 9.2 µm ± 0.5 µm → range 8.7–9.7 µm → ${mfdOk ? 'PASS ✓' : 'FAIL — outside tolerance ✗'}`,
              },
              {
                expression: `Step 2: Tensile rating check — datasheet shows ${tensile} N installation rating`,
              },
              {
                expression: `ICEA S-87-640 standard tier = 2,670 N (600 lbf) → ${tensileOk ? 'PASS ✓' : 'FAIL — below standard tier ✗'}`,
              },
              {
                expression: `Step 3: Temperature range check — ${tempMin}°C to +${tempMax}°C`,
              },
              {
                expression: `ICEA S-87-640 requires −40°C to +70°C minimum → ${tempOk ? 'PASS ✓' : 'FAIL — inadequate range ✗'}`,
              },
              {
                expression: `Overall score: ${score} of 3 checks passed`,
              },
            ];
          }}
          sanityCheck={(score) =>
            score === 3
              ? 'All 3 checks pass — this cable meets ICEA S-87-640 and 7 CFR 1755.902 minimums. Proceed with submittal approval.'
              : score === 2
              ? '2 of 3 checks pass. Review the failing check — substitution or clarification from the manufacturer required before approval.'
              : 'Multiple checks fail. Do not approve this submittal. Contact the manufacturer for a conforming data sheet or alternative cable.'
          }
          resultLabel="Checks passed"
          resultUnit="/ 3"
          resultDecimals={0}
        />
      </section>

      <section data-tier="advanced" className="mt-6">
        <h3>Reading a Qualification Test Report</h3>
        <p>
          When you're evaluating a new cable manufacturer or a new cable design for a project,
          you may need to review a full ICEA S-87-640 qualification test report. Here's what
          you're looking for:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <strong>Test standard version:</strong> Confirm the report references ICEA S-87-640
            (not an obsolete predecessor or a different standard). Check that the edition year
            is recent enough for your project's AHJ.
          </li>
          <li>
            <strong>Scope of testing:</strong> Qualification testing covers mechanical tests
            (tensile, crush, impact, repeated bending), environmental tests (temperature
            cycling, water penetration), and optical tests (attenuation at all specified
            wavelengths, bandwidth for MMF). Verify that all required test categories are
            present, not just the optical tests.
          </li>
          <li>
            <strong>Pass/fail column:</strong> Every test should have a "PASS" against the
            specified limit. A "PASS" with a result that barely clears the limit on a
            mechanical test is a yellow flag — the margin may erode on aged production cable.
          </li>
          <li>
            <strong>Test lab accreditation:</strong> Third-party labs must be accredited
            (e.g., NVLAP or equivalent). In-house manufacturer test reports carry less
            independent weight.
          </li>
        </ul>
        <p className="mt-3">
          For ongoing RUS projects, RUS Bulletin 1753F-201 (Acceptance Tests and Measurements)
          defines what the telephone company (or CLEC/co-op) must verify for each cable
          shipment, including OTDR testing at 1310 and 1550 nm on all reels, and verification
          that measured attenuation doesn't exceed the cable's specified maximum.
        </p>
        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Standards compliance is not a paperwork box — it's the legal requirement for RUS funding:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T04.L09 RUS-Eligible Projects &amp; Funding</strong> — All RUS-funded cable must meet ICEA S-87-640 as incorporated in 7 CFR 1755.902. Non-compliant cable makes the entire project ineligible for RUS reimbursement — a six-figure financial hit.</li>
            <li><strong>T13.L05 Material &amp; Hardware Acceptance Testing</strong> — During construction, every cable spool is verified against ICEA S-87-640 specs. Tensile strength, jacket thickness, water-blocking performance testing confirms compliance before installation.</li>
            <li><strong>T19.L10 Project Closeout &amp; Certification</strong> — Final as-built paperwork includes cable certifications (ICEA compliance + fiber-count + attenuation verification). The RUS inspector reviews these to sign off on project completion and trigger reimbursement.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            One non-compliant cable spool can disqualify millions of dollars in RUS funding. Standards are the safety net for your project economics.
          </p>
        </section>
      </section>

      {/* FLASHCARDS */}
      <Flashcard
        deckId="T03-L10"
        cards={[
          {
            id: 'T03-L10-fc-qual',
            front: 'What is qualification testing for OSP cable?',
            back: 'Factory tests performed on a new cable design to prove it meets the applicable standard before any production batches ship. Done once per design, not per lot. (Source: 7 CFR 1755.902; ICEA S-87-640)',
          },
          {
            id: 'T03-L10-fc-accept',
            front: 'What is acceptance testing for OSP cable?',
            back: 'Testing performed on each production lot (or a statistical sample) of cable before delivery to verify ongoing conformance to the specification. Done per shipment, not per design. (Source: 7 CFR 1755.902; RUS 1753F-201)',
          },
          {
            id: 'T03-L10-fc-mfd',
            front: 'What MFD tolerance does 7 CFR 1755.902 require on RUS-financed projects?',
            back: 'All single-mode fiber must be manufactured to 9.2 µm ± 0.5 µm at 1310 nm unless the buyer specifies otherwise. This keeps all reels within 8.7–9.7 µm and prevents splice-loss spikes when reels from different production runs are joined. (Source: 7 CFR 1755.902 via eCFR)',
          },
        ]}
      />

      {/* QUIZ */}
      <GatedAssessment
        courseId="T03"
        assessmentId="T03-L10"
        title="L10 Knowledge Check"
        fallback={
        <Quiz
          title="L10 Knowledge Check"
          mode="multiple-choice"
          questions={[
            {
              id: 'T03-L10-Q01',
              type: 'mc',
              prompt:
                'On a RUS-financed project, if the buyer does not specify MFD, all single-mode fiber must be manufactured to what MFD at 1310 nm?',
              choices: [
                '8.6 µm ± 0.4 µm',
                '9.2 µm ± 0.5 µm',
                '10.0 µm ± 0.5 µm',
                '9.0 µm ± 1.0 µm',
              ],
              answerIndex: 1,
              explanation:
                '7 CFR 1755.902 specifies 9.2 µm ± 0.5 µm at 1310 nm as the default unless the buyer specifies otherwise. This keeps all reels within a 8.7–9.7 µm window, limiting splice mismatch loss across a multi-reel project. (Source: 7 CFR 1755.902 via eCFR)',
            },
            {
              id: 'T03-L10-Q02',
              type: 'mc',
              prompt:
                'ICEA S-87-640\'s standard installation tensile rating for OSP fiber cable is:',
              choices: [
                '2,670 N (600 lbf)',
                '1,000 N (225 lbf)',
                '5,340 N (1,200 lbf)',
                '890 N (200 lbf)',
              ],
              answerIndex: 0,
              explanation:
                'ICEA S-87-640 defines 2,670 N (600 lbf) as the standard installation tensile rating for OSP fiber cable. A lower-tier rating of 1,330 N (300 lbf) exists for lighter constructions. Exceeding the rated tensile during a pull risks fiber damage. (Source: ICEA S-87-640 via archive.org + secondary sources)',
            },
            {
              id: 'T03-L10-Q03',
              type: 'mc',
              prompt:
                'What is the key difference between qualification testing and acceptance testing?',
              choices: [
                'Qualification is done in the field; acceptance is done in the factory',
                'Qualification is done once per cable design; acceptance is done on each production lot',
                'Qualification tests optical performance; acceptance tests mechanical performance only',
                'Qualification is required by ICEA; acceptance is required only by RUS',
              ],
              answerIndex: 1,
              explanation:
                'Qualification testing proves the design itself meets the standard — it is done once per new design before production begins. Acceptance testing verifies that each production lot of cable (or a statistical sample of it) continues to conform. Both are required on RUS projects. (Source: 7 CFR 1755.902; ICEA S-87-640)',
            },
            {
              id: 'T03-L10-Q04',
              type: 'dragdrop',
              prompt:
                'Match each cable parameter to its correct requirement from 7 CFR 1755.902.',
              items: [
                { id: 'mfd', label: '9.2 µm ± 0.5 µm at 1310 nm' },
                { id: 'coating', label: '250 ± 15 µm OD' },
                { id: 'colors', label: '12-color scheme' },
              ],
              targets: [
                { id: 'tmfd', label: 'Single-mode fiber mode field diameter (default)' },
                { id: 'tcoating', label: 'Fiber coating outside diameter' },
                { id: 'tcolors', label: 'Fiber color coding (so each fiber is distinguishable)' },
              ],
              correctMap: { tmfd: 'mfd', tcoating: 'coating', tcolors: 'colors' },
              explanation:
                'All three values are direct requirements from 7 CFR 1755.902 (eCFR): MFD 9.2 µm ± 0.5 µm at 1310 nm; fiber coating OD 250 ± 15 µm; 12-color coding so every fiber is individually identifiable. These are the enforceable minimums on RUS-financed projects.',
            },
            {
              id: 'T03-L10-Q05',
              type: 'fill-in-blank',
              prompt:
                'A cable coating diameter reads 242 µm on a production test report. Is this within the 7 CFR 1755.902 tolerance of 250 ± 15 µm? The lower limit is ____µm.',
              answer: '235',
              answerDisplay: '235 µm (lower limit = 250 − 15 = 235 µm)',
              explanation:
                '250 − 15 = 235 µm (lower limit); 250 + 15 = 265 µm (upper limit). A measurement of 242 µm is within the 235–265 µm range, so it conforms. (Source: 7 CFR 1755.902)',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
