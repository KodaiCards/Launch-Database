import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T15.L09',
  course_id: 'T15',
  title: 'Post-Restoration As-Built Update',
  order: 9,
  prerequisites: ['T15.L08'],
  learning_objectives: [
    'Identify the required elements of a post-restoration as-built update',
    'Apply the FOA-standard .sor file naming convention and explain why .sor archiving is superior to screenshot archiving',
    'Describe the MTTR calculation using concurrent documentation timestamps',
    'Explain the RUS documentation requirements following an emergency restoration on an RUS-funded network',
    'Describe the typical 24-hour post-restoration documentation closeout sequence',
  ],
  estimated_minutes: 18,
  vocabulary_introduced: [
    'post-restoration as-built',
    '.sor file (OTDR standard format)',
    'OTDR trace file naming convention',
    'MTTR calculation',
    'post-incident RCA (Root Cause Analysis)',
  ],
  vocabulary_assumed: [
    { term: 'as-built', source_lesson_id: 'T01.L05' },
    { term: 'OTDR trace', source_lesson_id: 'T12.L08' },
    { term: 'concurrent documentation', source_lesson_id: 'T15.L08' },
    { term: 'MOP (Method of Procedure)', source_lesson_id: 'T15.L08' },
    { term: 'splice closure reinstallation', source_lesson_id: 'T15.L04' },
    { term: 'MTTR (Mean Time to Repair)', source_lesson_id: 'T15.L01' },
    { term: 'RTO (Recovery Time Objective)', source_lesson_id: 'T15.L01' },
    { term: 'ETR (Estimated Time to Restore)', source_lesson_id: 'T15.L07' },
  ],
  key_terms: [
    {
      term: 'post-restoration as-built',
      definition: 'The updated record of the physical plant following an emergency restoration — capturing new splice point GPS coordinates, closure type and model, cover depth, cable section affected, OTDR baseline traces, and any temporary conditions requiring follow-up. Becomes the new as-built of record for the restored section.',
    },
    {
      term: '.sor file (OTDR standard format)',
      definition: 'The binary OTDR data file format defined by Bellcore SR-4731 and supported by virtually all OTDR vendors. A .sor file contains the complete trace data, event table, cable parameters (IOR, backscatter coefficient), and instrument settings — allowing full re-analysis with any compatible viewer. Superior to screenshots, which capture only a static image of the display.',
    },
    {
      term: 'OTDR trace file naming convention',
      definition: 'FOA-recommended standard: [ProjectID]_[RouteSegment]_[Date]_[Wavelength]_[Technician].sor. Example: RUS-PSC-2026_Segment-A-to-B_20260518_1550nm_JSmith.sor. Enables unambiguous trace identification during RCA without opening the file.',
    },
    {
      term: 'MTTR calculation',
      definition: 'Mean Time to Repair, calculated for this incident as: (Time of service restoration) − (Time of fault confirmation). Uses concurrent documentation timestamps. The MTTR for a single incident is an empirical data point; the organization\'s MTTR metric is the rolling average across all incidents.',
    },
    {
      term: 'post-incident RCA (Root Cause Analysis)',
      definition: 'The formal analysis completed within 24–72 hours of a major outage that documents the root cause (physical damage, equipment failure, etc.), contributing factors, timeline, and corrective/preventive actions. Dependent on concurrent documentation, MOP closeout, and OTDR trace archives from the restoration.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

// ─── Quiz questions ──────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'After an emergency restoration, a technician saves only a screenshot of the OTDR display instead of the .sor file. What capability is lost by using a screenshot instead of the .sor file?',
    options: [
      'Nothing — a screenshot contains the same data as a .sor file',
      'The ability to re-analyze the trace with different parameters, zoom into event detail, and produce reports; screenshots are non-reproducible static images',
      'The screenshot cannot be attached to an email, while .sor files can',
      'Screenshots do not capture the wavelength setting; .sor files do',
    ],
    correct: 1,
    explanation: 'A .sor file (Bellcore SR-4731 format) contains the complete raw OTDR trace data — not just the displayed image. From a .sor file, any compatible OTDR software can: re-analyze with different thresholds, zoom into event detail that wasn\'t visible on the original display settings, recalculate event loss with different methods, and produce standardized reports. A screenshot is a static image of the display at one zoom level and one set of display parameters. During RCA, if a question arises about a specific event (e.g., "was that reflection a connector or a break?"), a .sor file can answer it; a screenshot cannot. Archive the .sor file, not the screenshot.',
  },
  {
    id: 'q2',
    question: 'Using the FOA-recommended file naming convention, which of the following is the correctly formatted name for an OTDR trace file taken on a restoration on May 18, 2026, by technician R. Thompson, on Route Segment C-to-D, at 1550 nm, on project RUS-FLB-2026?',
    options: [
      'trace_1550_05182026.sor',
      'RUS-FLB-2026_Segment-C-to-D_20260518_1550nm_RThompson.sor',
      'RThompson_20260518_OTDR.sor',
      '1550nm_restoration_segment_CD.sor',
    ],
    correct: 1,
    explanation: 'The FOA-recommended naming convention is: [ProjectID]_[RouteSegment]_[Date]_[Wavelength]_[Technician].sor. Applied: ProjectID = RUS-FLB-2026, RouteSegment = Segment-C-to-D, Date = 20260518 (YYYYMMDD format for sort order), Wavelength = 1550nm, Technician = RThompson. This convention allows unambiguous identification without opening the file — critical when searching an archive of hundreds of traces during a future RCA or maintenance review.',
  },
  {
    id: 'q3',
    question: 'Concurrent documentation during the restoration records the following times: fault confirmed at 01:32, ETR given at 01:58, crew arrived on-site at 02:15, splicing complete at 04:10, customer confirmed service restored at 04:42. What is the MTTR for this incident?',
    options: [
      '2 hours 27 minutes (01:32 to 03:59)',
      '3 hours 10 minutes (01:32 to 04:42)',
      '2 hours 44 minutes (02:15 to 04:59)',
      '1 hour 55 minutes (02:15 to 04:10)',
    ],
    correct: 1,
    explanation: 'MTTR is calculated as (Time of service restoration) − (Time of fault confirmation). Service restoration is when the customer confirmed service restored: 04:42. Fault confirmation was at 01:32. 04:42 − 01:32 = 3 hours 10 minutes. The MTTR clock starts when the fault is confirmed (not when the crew arrives on-site), and stops when service is confirmed restored by the customer (not when splicing is physically complete). The difference between "splicing complete" (04:10) and "customer confirmed" (04:42) represents 32 minutes of routing restoration, customer notification, and verification — this is real outage time that must be included in the MTTR calculation.',
  },
  {
    id: 'q4',
    question: 'Which element is required in a post-restoration as-built update but is often skipped under time pressure?',
    options: [
      'The crew lead\'s signature on the closeout form',
      'GPS coordinates of the new splice point, closure type and model, and the updated cover depth',
      'A color photograph of the closure before burial',
      'The serial number of the fusion splicer used',
    ],
    correct: 1,
    explanation: 'GPS coordinates of the new splice point, the closure type and model number, and the cover depth are required as-built elements that become the permanent record for the restored section. These are routinely skipped under time pressure ("I know where it is") and later cause problems: crews responding to a future issue can\'t find the splice without GPS; the wrong closure type is listed in the network record; depth variances from the original installation are unknown. The closure photograph and splicer serial number are useful but typically not required. The signature is part of the formal closeout but not the as-built record itself.',
  },
];

export default function L09PostRestorationAsBuiltUpdate() {
  return (
    <LessonLayout meta={meta}>
      <h1>T15.L09 — Post-Restoration As-Built Update</h1>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section className="lesson-section foundations">
        <h2>In Plain English</h2>
        <p>
          Every emergency restoration changes the physical plant. A new splice point exists at a
          location that wasn't in the original design. A new closure of a specific model sits at a
          specific GPS coordinate. The burial depth may be different from the original installation.
          If none of that gets recorded, the next engineer to work on this cable is starting from
          bad information.
        </p>
        <p>
          Post-restoration documentation is often skipped or abbreviated because the crew is tired
          and the immediate crisis is over. This is exactly backward: the documentation becomes most
          critical when the repair is done and everyone wants to go home. That's when the temptation
          to reconstruct from memory (rather than from concurrent notes) is highest.
        </p>
        <p>
          This lesson covers: what goes into the post-restoration as-built, how to archive OTDR traces
          correctly (.sor format vs. screenshots), how to calculate MTTR from concurrent documentation,
          and what the 24-hour closeout sequence looks like.
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500 mt-4">
          <strong>Callback:</strong> Recall from <strong>T10.L12 Design Documentation and Record Drawings</strong> — as-built drawing standards, GPS coordinates, closure models. <strong>T12.L08 Post-Splice Testing</strong> — OTDR trace archival and .sor file format. <strong>T15.L08 Method of Procedure</strong> — concurrent documentation during the repair. This lesson ties the threads together: consolidate your concurrent notes into a final as-built + OTDR traces + calculate MTTR + close the incident formally within 24 hours.
        </p>
      </section>

      {/* ── AS-BUILT UPDATE ───────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3 rounded text-sm">
          <strong>Quick Refresher:</strong> Post-restoration documentation connects back to foundational topics:
          <ul className="mt-2 space-y-1 ml-4 list-disc text-slate-600">
            <li><strong>As-Built Drawings</strong> (T10.L11) — the record you relied on during fault locate (T15.L02–L03). Now you update the as-built to include the new splice point and closure for the next crew.</li>
            <li><strong>OTDR Trace (Event Table)</strong> (T12.L07) — the post-splice OTDR trace is archived in .sor format (binary, not screenshots). Future crews can load your trace and compare against it if the circuit shows new loss.</li>
            <li><strong>Fusion Splice</strong> (T11.L04) — the splice loss measurement from your post-splice OTDR becomes part of the as-built record. Baseline loss is documented so changes indicate future degradation.</li>
            <li><strong>Reconciling As-Built to As-Designed</strong> (T16.L06) — your post-restoration update IS reconciliation: "we originally designed it for a splice at mile 7.2; the actual break was at mile 7.1; we spliced at 7.1 and updated the record."</li>
            <li><strong>Emergency MOP</strong> (T15.L01 + T15.L08) — the MOP documents the temporary or permanent nature of the repair. The as-built records the location, closure, and baseline loss.</li>
          </ul>
        </div>

        <h2>Required Post-Restoration As-Built Elements</h2>
        <p>
          The post-restoration as-built update creates the new record of record for the restored section.
          Required elements:
        </p>
        <ul>
          <li>
            <strong>New splice point GPS coordinates</strong> (decimal degrees, sub-10-meter accuracy)
            — this is the single most important field. Without it, the splice is effectively lost in
            the network record.
          </li>
          <li>
            <strong>Closure type and model number</strong>: the exact closure installed (e.g.,
            "Corning FOSC-400 Type A4, 144-fiber capacity, 4 ports"). Future crew needs to know
            what they're opening and what hardware to bring.
          </li>
          <li>
            <strong>Cover depth</strong>: measured depth of burial over the closure. If this differs
            from the original installation depth (e.g., original spec was 36 in; actual burial
            was 32 in due to utility conflicts), the variance is documented.
          </li>
          <li>
            <strong>Cable section affected</strong>: the specific cable, buffer tube, and fiber range
            involved in the restoration (e.g., "12F G.652.D, tubes 1–2, fibers 1–12").
          </li>
          <li>
            <strong>Temporary conditions</strong>: any aspects of the repair that are temporary and
            require follow-up (temporary closure seal, temporary patch, displaced locate marks),
            with the scheduled follow-up date.
          </li>
          <li>
            <strong>OTDR trace file names and archive location</strong>: so future crews can pull
            the baseline trace for comparison.
          </li>
        </ul>
      </section>

      {/* ── SOR FILE ARCHIVING ─────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>OTDR Trace Archiving: .sor Format</h2>
        <p>
          The Bellcore SR-4731 standard defines the .sor binary file format for OTDR trace data.
          Every major OTDR manufacturer (EXFO, VIAVI, Yokogawa, Anritsu, AFL) produces .sor files
          that can be opened by any compatible viewer — including the vendor's own software, third-party
          analyzers, and free FOA-endorsed viewers.
        </p>

        <div className="callout important">
          <strong>Archive the .sor file, not the screenshot.</strong> A screenshot is a static image
          of the display at one zoom level and one set of display parameters. A .sor file contains the
          complete raw trace data, event table, instrument settings, and cable parameters. During RCA,
          a .sor file can be re-analyzed with different thresholds; a screenshot cannot. If the original
          OTDR display showed a clean trace at the default zoom, but a closer zoom would reveal a small
          reflection at a splice point — the .sor file shows it; the screenshot doesn't.
        </div>

        <h3>FOA-Recommended File Naming Convention</h3>
        <p>
          The FOA recommends the following naming convention for OTDR trace archives:
        </p>
        <div className="code-block">
          <code>[ProjectID]_[RouteSegment]_[Date]_[Wavelength]_[Technician].sor</code>
        </div>
        <p>Example:</p>
        <div className="code-block">
          <code>RUS-PSC-2026_Segment-A-to-B_20260518_1550nm_JSmith.sor</code>
        </div>
        <p>
          Elements explained:
        </p>
        <ul>
          <li><strong>ProjectID</strong>: the project or network identifier (e.g., RUS contract number, route code)</li>
          <li><strong>RouteSegment</strong>: the specific route section or splice point (e.g., Segment-A-to-B, SP-Milepost-7.1)</li>
          <li><strong>Date</strong>: YYYYMMDD format — sorts chronologically in any directory listing</li>
          <li><strong>Wavelength</strong>: 1310nm, 1550nm, or 850nm — one file per wavelength per trace</li>
          <li><strong>Technician</strong>: initials or last name — enables traceability for RCA questions</li>
        </ul>
        <p>
          This convention allows unambiguous identification of any trace without opening the file.
          During an RCA where you're searching through 200 trace files, naming conventions are
          the difference between a 10-minute search and a 2-hour search.
        </p>

        <h3>Two Baseline Traces Required After Each Restoration</h3>
        <p>
          After every emergency restoration, archive at minimum two traces:
        </p>
        <ol>
          <li><strong>Post-splice verification trace</strong>: taken after splicing but before closing the closure — this is the "did the splice work?" trace. Includes the new splice event(s) in the trace.</li>
          <li><strong>Post-restoration baseline trace</strong>: taken after closure and backfill — this becomes the new baseline for future monitoring comparisons. If loss creeps up over the next 6 months, this baseline shows what "normal" looked like immediately after the repair.</li>
        </ol>
        <p>
          Both traces archived with distinct names (e.g., "pre-closure" vs. "post-restoration").
        </p>
      </section>

      {/* ── MTTR CALCULATION ──────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>MTTR Calculation</h2>
        <p>
          The MTTR (Mean Time to Repair) for an individual incident is calculated as:
        </p>
        <div className="formula-block">
          <p><strong>MTTR (this incident) = Time of customer-confirmed service restoration − Time of fault confirmation</strong></p>
        </div>
        <p>
          Two important calibrations:
        </p>
        <ul>
          <li>
            The clock starts at <strong>fault confirmation</strong> — not at the time the customer
            reported the outage (which may be minutes or hours earlier), and not at the time the crew
            arrived on-site. Fault confirmation is when the NOC or field crew has confirmed that an
            outage is in progress and dispatched to respond.
          </li>
          <li>
            The clock stops at <strong>customer-confirmed service restoration</strong> — not at the
            time splicing was physically complete. The time between splicing complete and customer
            confirmation includes routing restoration, equipment re-sync, and customer-side verification.
            This is real outage time.
          </li>
        </ul>
        <p>
          This single incident's MTTR feeds into the rolling organizational MTTR metric. That metric
          is tracked against the carrier's SLA and against historical performance. Concurrent
          documentation with accurate timestamps is the only way to produce a reliable MTTR — because
          post-hoc reconstruction systematically underestimates the time spent at each step.
        </p>
      </section>

      {/* ── 24-HOUR CLOSEOUT SEQUENCE ─────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>24-Hour Documentation Closeout Sequence</h2>
        <p>
          The following steps complete the post-restoration documentation cycle within 24 hours:
        </p>
        <ol>
          <li>
            <strong>Hour 0 (on-site):</strong> concurrent MOP log finalized. OTDR traces transferred
            from instrument to laptop/field tablet. File naming applied. GPS coordinates recorded.
          </li>
          <li>
            <strong>Hour 1–2 (post-site):</strong> .sor files uploaded to project archive. Post-restoration
            as-built data (GPS, closure type, depth) entered into the GIS or network record system.
            Temporary conditions documented with follow-up dates.
          </li>
          <li>
            <strong>Hour 4–6 (morning, after rest):</strong> MOP closeout completed. Deviations from
            the planned procedure documented with reasons. MTTR calculated from concurrent timestamps.
            MOP closeout submitted to NOC/network management for file.
          </li>
          <li>
            <strong>Hour 24:</strong> RCA summary submitted (for major outages — carriers typically
            define "major" by customer tier, circuit count, or outage duration). RCA references
            the concurrent documentation, MOP closeout, and .sor archives as source materials.
          </li>
        </ol>

        <div className="callout field-note">
          <strong>Field Note — RUS Documentation Requirements:</strong> For restorations on RUS-funded
          networks, the as-built update requirements are embedded in the RUS construction contract
          and the applicable RUS Bulletins (typically RUS 1751F-630 for buried plant, 1751F-635 for
          aerial). The as-built update is typically due within 30–60 days of the work (check the specific
          contract terms), but best practice is same-day or next-day for emergency restorations while
          the information is fresh. The as-built update on RUS-funded plant is not optional — it is a
          contract deliverable.
        </div>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────────── */}
      <section className="lesson-section advanced">
        <h2>Advanced: OTDR Bidirectional Baseline and Monitoring</h2>
        <p>
          The post-restoration OTDR baseline trace is used for two purposes: (1) immediate verification
          that the splice meets the loss budget, and (2) long-term monitoring comparison. For monitoring
          comparison, the baseline trace must be taken at the same instrument settings (IOR, pulse width,
          range, averaging time) as future monitoring traces, or the comparison will produce false
          alarms from instrument-setting differences rather than actual loss changes.
        </p>
        <p>
          For carrier-class monitoring, the post-restoration baseline is typically taken bidirectionally
          (from both ends of the affected segment) and the event table is compared against the
          pre-incident baseline. The difference trace (post-incident minus pre-incident) should show
          only the new splice events and no other changes. If the difference trace shows loss changes
          elsewhere on the route (at other existing splice points, at connectors), this indicates
          additional damage that was not addressed in the restoration — a finding that must be reported
          to the NOC immediately.
        </p>
      </section>

      {/* ── FLASHCARDS ────────────────────────────────────────────────────── */}
      <section className="lesson-section flashcards">
        <h2>Key Terms</h2>
        <div className="flashcard-grid">
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── QUIZ ──────────────────────────────────────────────────────────── */}
      <section className="lesson-section quiz">
        <h2>Lesson Quiz</h2>
        <Quiz questions={QUIZ_QUESTIONS} lessonId={meta.id} />
      </section>
    </LessonLayout>
  );
}
