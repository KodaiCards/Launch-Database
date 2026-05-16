// Net-new — T18.L09 Incident Reporting & OSHA 300
// Foundation lesson: recordable incidents, OSHA 300 log, 300A summary, near-miss

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Sortable from '../../components/primitives/Sortable.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T18.L09',
  course_id: 'T18',
  title: 'Incident Reporting & OSHA 300',
  order: 9,
  lesson_type: 'foundation',
  prerequisites: ['T18.L01'],
  vocabulary_introduced: [
    'OSHA 300 log',
    'recordable incident',
    'near-miss',
    'DART',
  ],
  key_terms: [
    {
      term: 'OSHA 300 log',
      definition:
        'OSHA Form 300 — the employer\'s running log of work-related injuries and illnesses for the calendar year. Must be maintained throughout the year and kept for five years. The annual summary (OSHA Form 300A) must be posted from February 1 through April 30 each year. Governed by 29 CFR 1904.',
    },
    {
      term: 'recordable incident',
      definition:
        'A work-related injury or illness that results in any of the following: death, days away from work, restricted duty, job transfer, medical treatment beyond first aid, loss of consciousness, or diagnosis of a significant injury or illness by a licensed health care professional. Defined in 29 CFR 1904.7.',
    },
    {
      term: 'near-miss',
      definition:
        'An unplanned event that did not result in injury, illness, or damage but had the potential to do so. Near-miss reporting is voluntary (OSHA does not require a near-miss log), but reporting is strongly encouraged as a leading indicator of hazards before they cause recordable incidents. OSHA cannot use voluntary near-miss reports against an employer in enforcement.',
    },
    {
      term: 'DART',
      definition:
        'Days Away, Restricted, or Transferred — the OSHA metric that counts incidents resulting in days away from work, restricted work activity, or job transfer. The DART rate is a key benchmark for comparing injury rates across employers and industry sectors. Used in OSHA 300 recordkeeping and benchmarking.',
    },
  ],
  vocabulary_assumed: [
    { term: 'hazard recognition', source_lesson_id: 'T18.L01' },
    { term: '1910.268', source_lesson_id: 'T18.L01' },
  ],
  estimated_minutes: 20,
};

export default function T18L09_IncidentReportingOSHA300() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When someone gets hurt on your job site, there are two separate obligations: the
          immediate human response (first aid, medical care, securing the scene) and the
          legal documentation response. This lesson covers the documentation side — which
          incidents OSHA requires you to record, what forms are used, and what the reporting
          timelines are. Getting this wrong after an incident adds a paperwork violation on top
          of whatever caused the incident.
        </p>
        <p className="mt-2">
          There's also a section on near-misses — events where no one got hurt but someone
          almost did. Near-miss reporting is voluntary, but it's one of the most valuable
          safety practices a field crew can have: a near-miss that gets reported can lead to
          a hazard fix before the next one results in a recordable incident.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym/Term</th>
              <th className="px-3 py-2 text-left">What it means</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OSHA 300</td>
              <td className="px-3 py-2">The employer's annual log of work-related injuries and illnesses (Form 300)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OSHA 300A</td>
              <td className="px-3 py-2">The annual summary of the OSHA 300 log — posted Feb 1–Apr 30 each year</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OSHA 301</td>
              <td className="px-3 py-2">The incident investigation report — one per recordable event, with details of what happened</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">DART</td>
              <td className="px-3 py-2">Days Away, Restricted, or Transferred — the primary injury severity metric in OSHA recordkeeping</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">29 CFR 1904</td>
              <td className="px-3 py-2">The OSHA regulation governing all recording and reporting of occupational injuries and illnesses</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The Three OSHA Recordkeeping Forms</h3>
        <p className="mt-2">
          Three forms make up the OSHA recordkeeping system, governed by 29 CFR 1904:
        </p>
        <div className="mt-3 space-y-3">
          <div className="p-3 bg-sky-400/10 border border-sky-400/20 rounded-lg text-sm">
            <p className="font-semibold text-sky-300">OSHA Form 300 — Log of Work-Related Injuries and Illnesses</p>
            <p className="text-slate-300/90 mt-1">
              The running log maintained throughout the year. One row per recordable incident.
              Columns capture: employee name, job title, date, location, description, injury type,
              and outcome (DART days, restricted duty days, transfer). Must be maintained and
              kept for 5 years at the establishment.
            </p>
          </div>
          <div className="p-3 bg-sky-400/10 border border-sky-400/20 rounded-lg text-sm">
            <p className="font-semibold text-sky-300">OSHA Form 300A — Annual Summary</p>
            <p className="text-slate-300/90 mt-1">
              A summary of the Form 300 entries for the calendar year. Must be posted in a
              visible location from February 1 through April 30 following the year of record.
              Must be signed by a company executive certifying accuracy. Workers have the right
              to review both the Form 300 and the 300A.
            </p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm">
            <p className="font-semibold text-slate-200">OSHA Form 301 — Incident Report</p>
            <p className="text-slate-300/90 mt-1">
              A detailed narrative report for each recordable incident — what happened, where,
              what the employee was doing, what led to the injury. Must be completed within 7
              days of the recordable incident. Companies may use an equivalent workers'
              compensation first report of injury form if it captures equivalent information.
            </p>
          </div>
        </div>

        {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
        <Flashcard
          deckId="T18-L09"
          cards={[
            {
              id: 'T18-L09-fc-300',
              front: 'What is the OSHA 300 log?',
              back: 'OSHA Form 300 — the employer\'s annual running log of work-related injuries and illnesses. One row per recordable incident. Maintained throughout the year; kept for 5 years. The annual summary (Form 300A) is posted Feb 1–Apr 30. Governed by 29 CFR 1904.',
            },
            {
              id: 'T18-L09-fc-recordable',
              front: 'What makes an incident "recordable" under 29 CFR 1904.7?',
              back: 'A work-related injury or illness resulting in: (1) death, (2) days away from work, (3) restricted duty, (4) job transfer, (5) medical treatment beyond first aid, (6) loss of consciousness, or (7) diagnosis of a significant condition by a licensed HCP. First-aid-only incidents (bandages, OTC meds, non-prescription doses) are NOT recordable.',
            },
            {
              id: 'T18-L09-fc-dart',
              front: 'What does DART stand for and why does it matter?',
              back: 'Days Away, Restricted, or Transferred. The DART rate measures incidents with lost time or job transfer — the more serious end of recordable incidents. Used by OSHA and employers to benchmark injury severity across industry. A high DART rate can trigger OSHA targeted inspections.',
            },
            {
              id: 'T18-L09-fc-nearmiss',
              front: 'Is near-miss reporting required by OSHA?',
              back: 'No — near-miss reporting is voluntary under federal OSHA rules. However, OSHA strongly encourages it and has stated that voluntary near-miss reports cannot be used against an employer in enforcement. Many employers maintain internal near-miss programs as a leading-indicator safety tool.',
            },
            {
              id: 'T18-L09-fc-severe',
              front: 'What are the reporting timelines for severe injuries under 29 CFR 1904.39?',
              back: 'Fatality: report to OSHA within 8 hours. In-patient hospitalization, amputation, or loss of an eye: report to OSHA within 24 hours. These timelines apply to ALL employers regardless of size — even employers exempt from routine 300 log recordkeeping.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Recordable vs. Not Recordable — The Line That Matters</h2>

        <p>
          The single most common confusion in OSHA recordkeeping is the boundary between
          "first aid" (not recordable) and "medical treatment beyond first aid" (recordable).
          29 CFR 1904.7(a) defines this boundary. Key distinction:
        </p>

        <div className="mt-3 space-y-3">
          <div className="p-4 bg-green-400/10 border border-green-400/30 rounded-lg text-sm">
            <p className="font-semibold text-green-300">NOT Recordable — First Aid Only (29 CFR 1904.7(a))</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300/90 mt-1">
              <li>Non-prescription medications at non-prescription strength</li>
              <li>Bandaging, wound closure with butterfly strips/Steri-Strips</li>
              <li>Hot/cold therapy</li>
              <li>Non-rigid means of support (elastic bandages)</li>
              <li>Temporary immobilization device for transport to medical facility only</li>
              <li>Drilling a nail to relieve pressure under a bruised nail</li>
              <li>Eye patch</li>
              <li>Removal of splinters or foreign objects from the eye using irrigation or cotton swabs</li>
            </ul>
          </div>
          <div className="p-4 bg-red-400/10 border border-red-400/30 rounded-lg text-sm">
            <p className="font-semibold text-red-300">RECORDABLE — Medical Treatment Beyond First Aid (29 CFR 1904.7(a))</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300/90 mt-1">
              <li>Prescription medications (even a one-time dose)</li>
              <li>Sutures / staples (wound closure)</li>
              <li>Rigid means of support (splint, cast, brace — even a temporary one)</li>
              <li>Hospitalization (even for observation only)</li>
              <li>Amputation (any level)</li>
              <li>Loss of consciousness (even briefly)</li>
              <li>Diagnosis of a significant injury by a licensed HCP (even if no lost time)</li>
            </ul>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Severe Incident Reporting — 1904.39 Timelines</h3>
        <p className="mt-2">
          Separate from the 300 log, some incidents require direct notification to OSHA
          within strict timeframes per 29 CFR 1904.39. These timelines apply to ALL employers
          regardless of size — even small firms exempt from routine 300 log recordkeeping:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Incident type</th>
                <th className="px-3 py-2 text-left">Report to OSHA within</th>
                <th className="px-3 py-2 text-left">How to report</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10 bg-red-400/5">
                <td className="px-3 py-2">Work-related fatality</td>
                <td className="px-3 py-2 font-semibold">8 hours</td>
                <td className="px-3 py-2">OSHA hotline (1-800-321-OSHA) or nearest OSHA area office</td>
              </tr>
              <tr className="border-t border-white/10 bg-amber-400/5">
                <td className="px-3 py-2">Any in-patient hospitalization (whether for treatment or observation) per 29 CFR 1904.39(a)(3)</td>
                <td className="px-3 py-2 font-semibold">24 hours</td>
                <td className="px-3 py-2">OSHA hotline or area office</td>
              </tr>
              <tr className="border-t border-white/10 bg-amber-400/5">
                <td className="px-3 py-2">Amputation</td>
                <td className="px-3 py-2 font-semibold">24 hours</td>
                <td className="px-3 py-2">OSHA hotline or area office</td>
              </tr>
              <tr className="border-t border-white/10 bg-amber-400/5">
                <td className="px-3 py-2">Loss of an eye</td>
                <td className="px-3 py-2 font-semibold">24 hours</td>
                <td className="px-3 py-2">OSHA hotline or area office</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-1">
            Source: 29 CFR 1904.39 (ecfr.gov) — VERIFIED primary source.
          </p>
        </div>

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — The Small-Employer Misunderstanding</p>
          <p className="text-slate-300/90">
            <strong>Book (1904.1):</strong> Employers with 10 or fewer employees are partially
            exempt from routine OSHA 300 log recordkeeping. This exemption applies to maintaining
            the daily log and posting the 300A summary.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Many small telecom contractors (including RUS
            contractors) have ≤ 10 employees and believe they're exempt from ALL recordkeeping
            requirements. Wrong. The 1904.39 severe incident reporting requirement — fatality,
            hospitalization, amputation, eye loss — applies to every employer regardless of size,
            including sole proprietors. Workers' compensation insurers also typically require
            incident reports that functionally mirror the OSHA 300/301. The small-employer
            exemption covers the routine log, not the severe-event notification obligation.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Near-Miss Reporting — Why It Matters</h3>
        <p className="mt-2">
          A near-miss is an unplanned event that didn't cause injury — but could have. Examples
          on OSP jobs: a vehicle drifting into the work zone but missing the crew, a strand
          slip-line that snaps but no one is in the swing path, a manhole cover dropped back
          into the hole as a worker ascends the ladder.
        </p>
        <p className="mt-2">
          OSHA does not require near-miss logs, and voluntary reports cannot be used in
          enforcement. The value is internal: near-misses are the cheapest safety data you can
          collect — no injury, but real evidence that a hazard exists. A field crew that
          reports near-misses catches hazards before the next event is a recordable incident.
          A crew that doesn't report near-misses finds out about hazards the hard way.
        </p>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: OSHA Near Miss Reporting Systems (osha.gov/near-miss-reporting) —
          VERIFIED free public source.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Recordkeeping Exemptions — What They Cover and What They Don't</h2>
        <p>
          29 CFR 1904 has two exemption categories that affect small telecom contractors:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-2 text-sm text-slate-300/90">
          <li>
            <strong>Size exemption (≤ 10 employees):</strong> Employers with 10 or fewer
            employees at all times during the previous calendar year are exempt from routine
            1904 recordkeeping (maintaining the 300 log and posting the 300A). They must still
            report severe incidents (1904.39) and must still provide injury/illness records to
            OSHA on request.
          </li>
          <li>
            <strong>Low-hazard industry exemption:</strong> Employers in certain North American
            Industry Classification System (NAICS) codes classified as low-hazard industries
            (retail trade, services, finance) are also partially exempt. Telecom construction
            (NAICS 237130 — Power and Communication Line Construction) is NOT a low-hazard
            industry and is NOT exempt. This is true regardless of employer size.
          </li>
        </ol>
        <p className="mt-3 text-sm">
          Bottom line: the size exemption may let a small OSP contractor skip the daily 300 log,
          but it does NOT exempt them from severe incident reporting, and it does NOT exempt
          them from industry-specific safety standards (1910.268, 1910.147, 1910.269).
        </p>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: 29 CFR 1904.1–1904.2 (size and industry exemptions); 29 CFR 1904.39
          (severe incident reporting — all employers); ecfr.gov — VERIFIED primary sources.
        </p>
      </section>

      {/* ── SORTABLE — Classify the Incident ────────────────────────────── */}
      <Sortable
        title="Sort It: Recordable, First-Aid Only, or Severe-Reportable?"
        prompt="Drag the five incident descriptions into the correct OSHA classification order — from least severe (First Aid Only) through Recordable to Severe-Reportable (1904.39). Place them so the mildest is at the top and the most serious reporting obligation is at the bottom."
        items={[
          { id: 'fatality',    label: 'A crew member is fatally injured when a bucket lift strikes a power line.' },
          { id: 'hospitalize', label: 'A technician falls from a ladder and is admitted to the hospital.' },
          { id: 'restricted',  label: 'A tech sprains their wrist and is placed on restricted duty (light work only) for three days.' },
          { id: 'rx',          label: 'A worker cuts their hand; the doctor prescribes a course of antibiotics.' },
          { id: 'bandage',     label: 'A technician gets a minor cut; the foreman applies a bandage and the worker continues without restriction.' },
        ]}
        correctOrder={['bandage', 'rx', 'restricted', 'hospitalize', 'fatality']}
        explanation="First Aid Only (bandage — 1904.7(a)) → Recordable/prescription Rx (any prescription medication is recordable) → Recordable/DART (restricted duty = DART outcome) → Recordable + 24-hr 1904.39 report (in-patient hospitalization) → Recordable + 8-hr 1904.39 report (fatality). Knowing where each event lands tells you both your 300 log obligation and your OSHA notification obligation."
        citation="29 CFR 1904.7(a) — First aid definition; 29 CFR 1904.39 — Severe incident reporting timelines (ecfr.gov)."
        fieldNote="The prescription-medication trigger catches a lot of crews off-guard. One Rx antibiotic for an infected cut = recordable, even if the worker never missed a day. The treatment determines recordability, not the injury's appearance."
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T18.L09 Check — Incident Reporting &amp; OSHA 300"
        mode="multiple-choice"
        questions={[
          {
            id: 'T18-L09-Q1',
            type: 'mc',
            prompt:
              'A technician cuts their hand on a strand wire. The foreman applies a bandage on site; the technician works the rest of the day without restriction. Is this incident recordable on the OSHA 300 log?',
            choices: [
              'Yes — any cut requiring a bandage is recordable',
              'No — bandaging alone is first aid and does not meet the recordable threshold',
              'Yes — any hand injury on an OSP job is automatically recordable',
              'No — only injuries requiring hospital treatment are recordable',
            ],
            answerIndex: 1,
            explanation:
              'Bandaging (wound closure with adhesive bandages or Steri-Strips) is explicitly listed as a first-aid measure in 29 CFR 1904.7(a). First-aid-only treatment does not meet the recordable threshold. If the same cut required sutures, staples, or prescription medication, it would be recordable. The distinction is the treatment, not the severity of the injury by appearance.',
            citation: '29 CFR 1904.7(a) — Definition of first aid (ecfr.gov).',
          },
          {
            id: 'T18-L09-Q2',
            type: 'mc',
            prompt:
              'A field technician falls from a bucket lift and is transported to the hospital for an overnight observation stay. Per 29 CFR 1904.39, when must the employer report this to OSHA?',
            choices: [
              'Within 8 hours of the incident',
              'Within 24 hours of the incident',
              'Within 7 days — only fatalities are 8-hour reportable',
              'No reporting required unless the worker cannot return to work within 7 days',
            ],
            answerIndex: 1,
            explanation:
              '29 CFR 1904.39 requires in-patient hospitalization to be reported to OSHA within 24 hours. A fatality is 8-hour reportable. Amputations and loss of an eye are also 24-hour reportable. These timelines apply to ALL employers regardless of size — including firms with ≤ 10 employees who are otherwise exempt from routine 300 log recordkeeping.',
            citation: '29 CFR 1904.39 (ecfr.gov) — VERIFIED primary source.',
          },
          {
            id: 'T18-L09-Q3',
            type: 'mc',
            prompt:
              'A technician\'s vehicle drifts into a cone taper but misses the crew by 10 feet. No one is hurt and no equipment is damaged. Under OSHA rules, the employer must:',
            choices: [
              'File an OSHA 300 entry — a near-miss is recordable',
              'Nothing — OSHA has no near-miss reporting requirement',
              'Report the near-miss to OSHA within 24 hours',
              'Complete an OSHA 301 incident investigation report',
            ],
            answerIndex: 1,
            explanation:
              'Near-miss reporting is voluntary under federal OSHA rules. An event with no injury, illness, or death does not meet the 29 CFR 1904.7 recordable threshold, and it does not trigger 1904.39 severe incident reporting. However, most safety-conscious employers maintain voluntary near-miss programs as a leading-indicator tool. OSHA has explicitly stated that voluntary near-miss reports cannot be used against an employer in enforcement proceedings.',
            citation:
              'OSHA Near Miss Reporting Systems (osha.gov/near-miss-reporting); 29 CFR 1904.7(a) (recordable definition).',
            fieldNote:
              'Even though it\'s not legally required, report it internally. That near-miss just told you the work zone setup isn\'t providing adequate protection — fix it before the next event is a recordable.',
          },
          {
            id: 'T18-L09-Q4',
            type: 'fill-in-blank',
            prompt:
              'The OSHA metric that counts incidents resulting in days away from work, restricted work activity, or job transfer to another position is called the ____ rate.',
            answer: 'DART',
            answerDisplay: 'DART (Days Away, Restricted, or Transferred)',
            explanation:
              'The DART rate is calculated from the OSHA 300 log entries that involve DART outcomes — the most serious tier of recordable incidents. It is calculated as: (Number of DART incidents × 200,000) / Total hours worked. The 200,000 normalizes to a rate per 100 full-time equivalent workers. OSHA and industry benchmarks use DART rates to compare safety performance across employers.',
            citation: '29 CFR 1904 — Recording and Reporting Occupational Injuries and Illnesses (ecfr.gov).',
          },
          {
            id: 'T18-L09-Q5',
            type: 'mc',
            prompt:
              'An OSP contractor has 8 employees. They believe they are completely exempt from OSHA recordkeeping because they have fewer than 10 employees. This belief is:',
            choices: [
              'Correct — firms with ≤ 10 employees have no OSHA recordkeeping obligations',
              'Partially correct — they are exempt from routine 300 log maintenance but must still report fatalities, hospitalizations, amputations, and eye loss within the 1904.39 timelines',
              'Incorrect — all employers regardless of size must maintain the full OSHA 300 log',
              'Correct — but only if they are in a low-hazard NAICS code',
            ],
            answerIndex: 1,
            explanation:
              'The ≤ 10 employee size exemption under 29 CFR 1904.1 covers routine recordkeeping — maintaining the 300 log and posting the 300A summary. It does NOT exempt employers from severe incident reporting under 29 CFR 1904.39 (fatality, hospitalization, amputation, eye loss). The severe reporting requirement applies to every employer regardless of size. Additionally, a telecom construction firm is not in a low-hazard NAICS code — the exemption would not apply even if other conditions were met.',
            citation: '29 CFR 1904.1 (size exemption); 29 CFR 1904.39 (severe incident reporting — all employers); ecfr.gov.',
          },
        ]}
      />

    </LessonLayout>
  );
}
