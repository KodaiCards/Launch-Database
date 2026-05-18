// T07.L05 — Staking Notes — RUS Form 740
// Working lesson: completing RUS Form 740, field annotation conventions, design delta
// Sources: RUS Form 740 (public USDA form), RUS Bulletin 1751F-630 §2, industry staking practice

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T07.L05',
  course_id: 'T07',
  title: 'Staking Notes — RUS Form 740',
  order: 5,
  lesson_type: 'working',
  prerequisites: ['T07.L01', 'T07.L02', 'T07.L03', 'T07.L04'],
  learning_objectives: [
    'Identify the required fields on RUS Form 740 and explain what each captures',
    'Complete a staking note entry for a pole with a field condition that differs from design',
    'Write a clear, data-rich design delta that an engineer can act on without a site visit',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'RUS Form 740',
    'staking sheet',
    'field annotation convention',
    'design delta',
    'staking packet',
  ],
  vocabulary_assumed: [
    { term: 'site walk', source_lesson_id: 'T04.L01' },
    { term: 'call-out', source_lesson_id: 'T07.L01' },
    { term: 'measurement tolerance', source_lesson_id: 'T07.L01' },
    { term: 'field verification', source_lesson_id: 'T07.L01' },
    { term: 'stationing', source_lesson_id: 'T07.L02' },
    { term: 'offset', source_lesson_id: 'T07.L02' },
    { term: 'height delta', source_lesson_id: 'T07.L04' },
    { term: 'photo measurement log', source_lesson_id: 'T07.L04' },
    { term: 'SCID', source_lesson_id: 'T07.L03' },
  ],
  key_terms: [
    {
      term: 'RUS Form 740',
      definition:
        'A USDA Rural Development form used on RUS-funded projects to document staking data: pole locations, attachment heights, field conditions, and design-versus-field deltas. [confirm official form title — commonly referenced as "Contractor\'s Statement and Acknowledgment" but verify against current USDA RD form catalog] Form 740 is a required deliverable on RUS telephone and broadband programs — missing or incomplete Form 740 documentation can trigger program compliance findings during audit. (Source: USDA Rural Development public form)',
    },
    {
      term: 'staking sheet',
      definition:
        'A completed page of RUS Form 740 covering one or more poles in sequence. Each staking sheet records: project name and number, route section, date, staker name, and for each pole: pole number, station, offset, existing wire heights, design wire heights, height delta, call-out notation, and make-ready flag. A complete staking packet for a route is the collection of all staking sheets for every pole on the route.',
    },
    {
      term: 'field annotation convention',
      definition:
        'A set of standard symbols, abbreviations, and notation formats used consistently across all staking notes on a project so that any engineer or crew member can interpret any staker\'s notes without a key. Common conventions: "OK" = within tolerance, "MR" = make-ready required, "REP" = pole replacement recommended, "CALL" = call-out to engineer, "EST" = estimated (not measured), "LAS" = laser measured, "TAPE" = tape measured.',
    },
    {
      term: 'design delta',
      definition:
        'The as-staked vs. as-designed difference for a specific field value — pole location, attachment height, or grade — documented in the staking notes. A design delta is a call-out: it tells the engineer exactly how the field condition differs from the design so the engineer can update the design or confirm acceptability without a site visit. Format: "Field: [measured value]. Design: [assumed value]. Delta: [difference]. Action: [call-out or OK]."',
    },
    {
      term: 'staking packet',
      definition:
        'The complete documentation deliverable from a staking field walk, submitted to the engineer and filed with the project record. A staking packet includes: all completed RUS Form 740 staking sheets (one per route section), the photo measurement log, GPS coordinate file, and a cover summary listing all call-outs and make-ready flags by pole number. Required for RUS program engineering sign-off.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T07L05_StakingNotesRUSForm740() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Think of RUS Form 740 as a field report card. After you walk a pole, you fill in
          a row on the card: where it is, what you found, and whether it matches what the
          design expected. When you're done with a route, you hand in a packet of those
          report cards — that's your staking submission.
        </p>
        <p className="mt-2">
          The form isn't paperwork for the sake of paperwork. On RUS-funded projects
          (the federal program that pays for rural broadband and telephone buildouts), the
          staking documentation is what proves that the engineering was actually done in
          the field before construction started. Without it, the project's RUS reimbursement
          can be challenged during an audit.
        </p>
        <p className="mt-2">
          The form is also the primary communication tool between you (the staker) and
          the engineer. The engineer isn't going to walk every pole you walked — they're
          going to read your Form 740 and make design decisions from it. The better your
          notes, the fewer questions they have to call you back about.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym/Term</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MR</td>
              <td className="px-3 py-2">Make-Ready</td>
              <td className="px-3 py-2">Work needed on the pole before new fiber can attach — flagged by the staker</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">REP</td>
              <td className="px-3 py-2">Replacement</td>
              <td className="px-3 py-2">Staker recommends the pole be replaced due to condition — engineer decides</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CALL</td>
              <td className="px-3 py-2">Call-out</td>
              <td className="px-3 py-2">Field condition requires engineer decision before construction proceeds</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">LAS</td>
              <td className="px-3 py-2">Laser measured</td>
              <td className="px-3 py-2">Measurement method — laser accuracy ±0.1 ft</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">EST</td>
              <td className="px-3 py-2">Estimated</td>
              <td className="px-3 py-2">No measurement tool available — flagged so engineer knows accuracy is reduced</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The key fields on RUS Form 740</h3>
        <p className="mt-2">
          RUS Form 740 has sections for project-level data (project name, contract number,
          date) and pole-by-pole data. The pole-level fields you fill in for every pole:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Field</th>
              <th className="px-3 py-2 text-left">What you enter</th>
              <th className="px-3 py-2 text-left">Example</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Pole No.</td>
              <td className="px-3 py-2">Project pole number (your SCID sequence, not the owner's tag)</td>
              <td className="px-3 py-2">P-047</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Station</td>
              <td className="px-3 py-2">Design stationing of the pole</td>
              <td className="px-3 py-2">7+25</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Offset</td>
              <td className="px-3 py-2">Distance and direction from centerline</td>
              <td className="px-3 py-2">3 ft N</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Existing H</td>
              <td className="px-3 py-2">Measured height of each existing attachment (label wire type)</td>
              <td className="px-3 py-2">Comm: 27.0 ft (LAS)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Design H</td>
              <td className="px-3 py-2">Design's assumed height for that attachment</td>
              <td className="px-3 py-2">30.0 ft</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Delta</td>
              <td className="px-3 py-2">Measured − assumed (negative = lower than assumed)</td>
              <td className="px-3 py-2">−3.0 ft</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Call-out</td>
              <td className="px-3 py-2">Flag and description of any non-conformance</td>
              <td className="px-3 py-2">CALL: design update needed, see notes</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MR Flag</td>
              <td className="px-3 py-2">Make-ready needed? Yes/No + type if yes</td>
              <td className="px-3 py-2">No (clearances pass at revised heights)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Notes</td>
              <td className="px-3 py-2">Any additional field condition, recommendation, or clarification</td>
              <td className="px-3 py-2">Pole leaning 2° east; still usable; photo attached</td>
            </tr>
          </tbody>
        </table>

        {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
        <Flashcard
          deckId="T07-L05"
          cards={[
            {
              id: 'T07-L05-fc-740',
              front: 'What is RUS Form 740?',
              back: 'The Contractor\'s Statement and Acknowledgment form used on RUS-funded projects to document staking data: pole locations, attachment heights, field conditions, and design-versus-field deltas. Required deliverable on RUS telephone and broadband programs — missing Form 740 documentation can trigger compliance findings during audit.',
            },
            {
              id: 'T07-L05-fc-sheet',
              front: 'What is a staking sheet?',
              back: 'A completed page of RUS Form 740 covering one or more poles in sequence. Each staking sheet records project name, route section, date, staker name, and for each pole: pole number, station, offset, existing wire heights, design wire heights, height delta, call-out notation, and make-ready flag.',
            },
            {
              id: 'T07-L05-fc-convention',
              front: 'What are field annotation conventions in staking notes?',
              back: 'Standard symbols, abbreviations, and notation formats used consistently across all staking notes so any engineer or crew member can interpret any staker\'s notes. Examples: "OK" = within tolerance, "MR" = make-ready required, "REP" = pole replacement recommended, "CALL" = call-out to engineer, "LAS" = laser measured, "TAPE" = tape measured.',
            },
            {
              id: 'T07-L05-fc-delta',
              front: 'What is a design delta in staking documentation?',
              back: 'The as-staked vs. as-designed difference for a specific field value — pole location, attachment height, or grade — documented in the staking notes. Format: "Field: [measured value]. Design: [assumed value]. Delta: [difference]. Action: [call-out or OK]." Gives the engineer enough data to update the design without a site visit.',
            },
            {
              id: 'T07-L05-fc-packet',
              front: 'What is a staking packet?',
              back: 'The complete documentation deliverable from a staking field walk. Includes: all completed RUS Form 740 staking sheets, the photo measurement log, GPS coordinate file, and a cover summary listing all call-outs and make-ready flags by pole number. Required for RUS program engineering sign-off.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Writing a Design Delta That Engineers Can Use</h2>

        <h3 className="mt-4 font-semibold">The anatomy of a good design delta</h3>
        <p>
          A design delta isn't just "something was different." It's a structured note that
          gives the engineer four things:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li><strong>What the design said</strong> — the assumed value from the design drawings</li>
          <li><strong>What the field showed</strong> — your measured or observed value</li>
          <li><strong>The numeric difference</strong> — so the engineer doesn't have to calculate it</li>
          <li><strong>Your assessment</strong> — does this require action, or is it within tolerance?</li>
        </ol>
        <p className="mt-2">
          Compare these two ways of writing the same finding:
        </p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 border border-red-400/30 bg-red-400/5 rounded-lg">
            <p className="font-semibold text-red-300 mb-1">Weak design delta (avoid)</p>
            <p className="text-slate-300/80">
              "Pole 47 — wire was different height than expected. May need make-ready.
              Pole was leaning."
            </p>
            <p className="text-slate-400/70 mt-2 italic">
              The engineer can't act on this. "Different height" — how different? "May need
              make-ready" — based on what calculation? "Leaning" — how much?
            </p>
          </div>
          <div className="p-3 border border-green-400/30 bg-green-400/5 rounded-lg">
            <p className="font-semibold text-green-300 mb-1">Strong design delta (use this)</p>
            <p className="text-slate-300/80">
              "P-047, STA 7+25, 3 ft N. Existing comm wire: field 27.0 ft (LAS), design 30.0 ft,
              delta −3.0 ft. New fiber at revised height 22.5 ft — road clearance 22.5 ft &gt; 15.5 ft
              NESC Rule 232 comm min (supply conductors require 18 ft — this is fiber) — OK. Design update required: revise all heights at this pole. Pole leaning
              2° east, photo attached, condition acceptable. MR: No. CALL: Design update only."
            </p>
            <p className="text-slate-400/70 mt-2 italic">
              The engineer knows exactly what happened, has the numbers they need, knows whether
              action is required, and knows the photo exists. This can be resolved from the desk.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Common field conditions and how to annotate them</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Field condition</th>
              <th className="px-3 py-2 text-left">Annotation</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Wire within tolerance of design assumption</td>
              <td className="px-3 py-2">OK, delta shown</td>
              <td className="px-3 py-2">None — record and move on</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Wire significantly below design assumption, clearances still pass</td>
              <td className="px-3 py-2">CALL: Design update needed</td>
              <td className="px-3 py-2">Record delta, verify clearances pass, flag for design revision</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Wire too low, clearances fail with new fiber at design height</td>
              <td className="px-3 py-2">MR: Transfer required (specify wire)</td>
              <td className="px-3 py-2">Make-ready flag — existing wire needs height adjustment</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Pole significantly out of position (&gt;3 ft from design station)</td>
              <td className="px-3 py-2">CALL: Position delta [value] ft [direction]</td>
              <td className="px-3 py-2">Engineer decides: use the offset pole or design a new location</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Pole leaning &lt;5°</td>
              <td className="px-3 py-2">Lean [angle]° [direction], photo attached</td>
              <td className="px-3 py-2">Document, usually acceptable — engineer decides</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Pole leaning &gt;10° or visibly damaged</td>
              <td className="px-3 py-2">REP: Pole condition — recommend replacement</td>
              <td className="px-3 py-2">Flag for make-ready crew to assess — engineer decides replacement</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Rocky ground at stake location — bore may be needed</td>
              <td className="px-3 py-2">CALL: Rock encountered at [depth], bore or alternate siting</td>
              <td className="px-3 py-2">Engineer revises design or accepts alternate location</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — Form 740 vs. Digital Tools</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> RUS Form 740 is a paper form with specific fields. On an
            RUS-funded project, a signed paper Form 740 is part of the engineering deliverable.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> On many current projects, stakers use a digital tool
            (Katapult, FieldCom, Datafield) that captures all the same fields electronically.
            The digital system auto-generates a Form 740 equivalent as a PDF for submission.
            The staker still fills in every field — the tool just organizes and formats it.
            Some pole owners (especially larger electric utilities) REQUIRE digital staking
            with their specific platform, so paper-only stakers are at a disadvantage.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk:</strong> Treating the digital tool as a replacement for understanding
            what Form 740 requires. If the tool crashes or a field is auto-filled incorrectly,
            a staker who doesn't know the underlying form requirements won't catch the error.
            Know the form first, then use the tool to fill it efficiently.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Assembling a Staking Packet for Engineering Sign-Off</h2>

        <h3 className="mt-4 font-semibold">The staking packet as a project record</h3>
        <p>
          A staking packet isn't just a work product for the immediate project — it becomes
          part of the permanent record for that infrastructure. When a new carrier wants to
          attach to the same poles 10 years from now, the make-ready estimator may pull your
          staking packet to understand the baseline configuration. When a dispute arises about
          who placed what attachment, your photos and measurements are the baseline.
        </p>

        <h3 className="mt-5 font-semibold">Cover summary — the navigator's tool</h3>
        <p>
          The cover summary at the front of a staking packet is a one-page (or few-page)
          index of all call-outs and make-ready flags from the entire route. It lists:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li>Total poles staked and route length</li>
          <li>Number of make-ready flags (by type: transfer, replacement, force pole)</li>
          <li>Number of call-outs requiring engineer decision</li>
          <li>List of specific poles with flags: pole number, flag type, brief description</li>
          <li>Staker name, date range, and measurement tool used</li>
        </ul>
        <p className="mt-2 text-sm">
          The cover summary lets the engineer go directly to the poles that need attention
          without reading every row of every staking sheet. A 200-pole route with 15 call-outs
          and 8 make-ready flags can be reviewed in 30 minutes if the cover summary is clean.
          Without it, reviewing the same data takes 3–4 hours.
        </p>

        <h3 className="mt-5 font-semibold">What happens if staking documentation is incomplete</h3>
        <p>
          On RUS-funded projects, the engineering certification requires that staking was
          performed and documented per RUS Bulletin 1751F-630 §2. If the staking packet is
          incomplete at the time of engineering certification:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li>The engineer cannot certify the design, which delays construction authorization</li>
          <li>If construction has already started, an audit may flag the missing documentation as a compliance finding</li>
          <li>In the worst case, RUS can require retroactive field verification — which means re-walking poles that may have already been modified by construction</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: RUS Bulletin 1751F-630 §2 — Engineering and construction documentation requirements.
        </p>
      </section>

      {/* ── WORKED EXAMPLE ──────────────────────────────────────────────── */}
      <WorkedExample
        title="Complete a Staking Note Entry — Pole 47 Scenario"
        description="Walk through filling in a complete RUS Form 740 entry for a pole with a field condition that differs from design."
        variables={[
          { symbol: 'P', label: 'Pole number (project SCID)', value: 'P-047', unit: '', description: 'Sequential project pole ID, not the pole owner\'s tag' },
          { symbol: 'STA', label: 'Stationing', value: '7+25', unit: 'ft-format', description: 'Design-specified station for this pole (725 feet from route start)' },
          { symbol: 'OFF', label: 'Offset', value: 3, unit: 'ft north', description: 'Pole is 3 feet north of the route centerline per design' },
          { symbol: 'H_existing', label: 'Existing comm wire (measured)', value: 27.0, unit: 'ft', description: 'Laser measurement of the existing communication wire attachment' },
          { symbol: 'H_design_existing', label: 'Design assumed (existing wire)', value: 30.0, unit: 'ft', description: 'What the design expected the existing comm wire height to be' },
          { symbol: 'H_new_design', label: 'Proposed new fiber height (design)', value: 25.5, unit: 'ft', description: 'Where the design planned to attach the new fiber (4.5 ft below existing)' },
        ]}
        steps={[
          {
            label: 'Step 1 — Calculate the height delta for the existing wire',
            formula: 'delta = H_existing − H_design_existing',
            substitution: 'delta = 27.0 − 30.0',
            result: 'delta = −3.0 ft',
            explanation: 'Negative delta: the existing comm wire is 3 feet lower than design assumed. This is significant — well outside the ±0.5 ft measurement tolerance. Requires a design call-out.',
          },
          {
            label: 'Step 2 — Recalculate the new fiber\'s actual position',
            formula: 'H_new_actual = H_existing − 4.5 (design placed new fiber 4.5 ft below existing)',
            substitution: 'H_new_actual = 27.0 − 4.5',
            result: 'H_new_actual = 22.5 ft',
            explanation: 'New fiber will actually attach at 22.5 ft, not 25.5 ft as designed. This is 3 feet lower than the design shows — a design update is needed.',
          },
          {
            label: 'Step 3 — Verify road clearance (span crosses county road, fiber/comm cable)',
            formula: 'clearance = H_new_actual vs. NESC Rule 232 Table 232-1 comm minimum 15.5 ft [confirm NESC C2-2023 edition]',
            substitution: 'clearance = 22.5 ft vs. 15.5 ft minimum (communications cable over truck-accessible road)',
            result: '22.5 ft > 15.5 ft — clearance OK',
            explanation: '22.5 feet above the road is 7 feet above the 15.5-foot NESC Rule 232 Table 232-1 minimum for communications cables over roads accessible to truck traffic [confirm NESC C2-2023 edition]. No make-ready work required for this reason. Note: supply conductors (power lines) require 18 ft over the same road — the comm cable row is the applicable row here, not the supply row.',
          },
          {
            label: 'Step 4 — Write the staking note entry',
            formula: 'Form 740 entry format: [Pole No.] / [STA] / [OFF] / [Existing H] / [Design H] / [Delta] / [Call-out] / [MR Flag] / [Notes]',
            substitution: 'P-047 / 7+25 / 3 ft N / Comm: 27.0 ft (LAS) / 30.0 ft / −3.0 ft / CALL / No / ...',
            result: 'Form 740 entry complete',
            explanation: 'Full entry: "P-047, STA 7+25, OFF 3 ft N. Existing comm wire: 27.0 ft (LAS). Design: 30.0 ft. Delta: −3.0 ft. New fiber revised to 22.5 ft. Road clr 22.5 ft > 15.5 ft NESC Rule 232 comm min — OK. Pole lean 2° east, photo P047-A+B attached. MR: No. CALL: Design update required at this pole — revise all heights."',
          },
          {
            label: 'Step 5 — Add to cover summary',
            formula: 'Cover summary call-out entry: [Pole] / [Type] / [Brief description]',
            substitution: 'P-047 / CALL / Comm wire 3 ft below design (27.0 vs 30.0 ft); all clearances pass; design update needed',
            result: 'Cover summary updated',
            explanation: 'The cover summary entry lets the engineer find this specific issue instantly without searching through 47 rows of staking data. One line captures the key facts: which pole, what kind of issue, and whether it\'s blocking construction.',
          },
        ]}
        sanityCheck="The final staking note gives the engineer everything they need: the measured height (27.0 ft), the design assumption (30.0 ft), the delta (−3.0 ft), the recalculated new fiber position (22.5 ft), the clearance check result (22.5 ft > 15.5 ft NESC Rule 232 comm min — OK), and the action required (design update — no make-ready). The engineer can close this call-out from their desk in 5 minutes. The 15.5 ft minimum applies here because this is a communications cable over a truck-accessible road — supply conductors over the same road require 18 ft, but that row does not apply to fiber."
      />

      {/* ── PER-LESSON QUIZ ─────────────────────────────────────────────── */}
      <Quiz
        title="T07.L05 Check — Staking Notes and RUS Form 740"
        mode="multiple-choice"
        questions={[
          {
            id: 'T07-L05-Q1',
            type: 'mc',
            prompt:
              'Why is completing RUS Form 740 non-optional on a RUS-funded broadband project?',
            choices: [
              'It is required by OSHA 1910.268 as a safety documentation form',
              'It is a required program deliverable per RUS Bulletin 1751F-630 §2 — missing documentation can trigger compliance findings during an audit',
              'It is required by the contractor\'s insurance company for liability coverage',
              'It is only required if make-ready work is flagged during staking',
            ],
            answerIndex: 1,
            explanation:
              'RUS Form 740 is a required deliverable on RUS-funded projects, documented in RUS Bulletin 1751F-630 §2. Missing or incomplete Form 740 documentation can trigger compliance findings during a program audit, potentially affecting project reimbursement. It\'s program compliance, not just good practice.',
            citation: 'RUS Bulletin 1751F-630 §2 — Engineering and construction documentation requirements.',
          },
          {
            id: 'T07-L05-Q2',
            type: 'mc',
            prompt:
              'A staker writes in their Form 740 notes: "Pole 63 — wire was lower than expected. Might need make-ready." What is wrong with this entry?',
            choices: [
              'Nothing — this is sufficient information for the engineer to act on',
              'The entry lacks specific measurements (actual height, design height, delta), a clearance check result, and a clear action determination',
              'The staker should not mention make-ready in staking notes',
              'The entry should be written in full sentences, not abbreviations',
            ],
            answerIndex: 1,
            explanation:
              '"Wire was lower than expected" without a measured height, design assumption, and calculated delta forces the engineer to visit the site to get the numbers they need to make a decision. A strong design delta includes: field measurement, design assumption, numeric delta, clearance check result, and action determination (MR yes/no, CALL or OK).',
          },
          {
            id: 'T07-L05-Q3',
            type: 'mc',
            prompt:
              'What is the primary purpose of the cover summary at the front of a staking packet?',
            choices: [
              'To list the GPS coordinates of every pole on the route',
              'To provide a one-page index of all call-outs and make-ready flags so the engineer can go directly to the poles requiring attention',
              'To certify that the staker climbed and measured every pole',
              'To list the pole owners and their contact information for make-ready permitting',
            ],
            answerIndex: 1,
            explanation:
              'The cover summary indexes all call-outs and make-ready flags from the entire route, allowing the engineer to prioritize review and go directly to the poles requiring decisions without reading every row of every staking sheet. On a 200-pole route, a good cover summary can cut engineer review time from 3–4 hours to 30 minutes.',
          },
          {
            id: 'T07-L05-Q4',
            type: 'fill-in-blank',
            prompt:
              'The as-staked vs. as-designed difference for a specific field value — documented so the engineer can update the design without a site visit — is called a design ____.',
            answer: 'delta',
            answerDisplay: 'delta',
            explanation:
              'A design delta documents the exact difference between the design\'s assumed value and the staker\'s measured value. A complete design delta includes: what the design said, what the field showed, the numeric difference, and the staker\'s assessment of whether action is required.',
          },
          {
            id: 'T07-L05-Q5',
            type: 'mc',
            prompt:
              'In the staking notes, what does the abbreviation "REP" conventionally mean?',
            choices: [
              'Report — the staker filed a full report on this pole',
              'Repeat — the staker measured this pole twice to confirm accuracy',
              'Replacement — the staker recommends the pole be replaced due to condition',
              'Resolved — the field condition was resolved without engineering review',
            ],
            answerIndex: 2,
            explanation:
              '"REP" in field annotation conventions stands for Replacement — the staker is flagging that the pole\'s condition warrants replacement rather than standard make-ready work. This is a recommendation, not a determination — the engineer and make-ready crew ultimately decide whether replacement is required.',
          },
          {
            id: 'T07-L05-Q6',
            type: 'mc',
            prompt:
              'What does the field annotation convention "EST" mean in a staking note, and what is the implication?',
            choices: [
              'Estimated — measurement was not possible or tool was unavailable; the recorded value has reduced accuracy and the engineer should verify if critical',
              'Established — this pole is an established existing utility and cannot be moved',
              'East — the offset direction is toward the east',
              'Emergency stop — construction must halt at this pole pending review',
            ],
            answerIndex: 0,
            explanation:
              '"EST" means the value was estimated rather than directly measured (e.g., laser line-of-sight blocked, tool ran out of battery). The implication is that the accuracy is reduced — typically ±2–5 feet for visual estimates vs. ±0.1 feet for laser. The engineer knows to verify this measurement if it affects a clearance calculation or make-ready decision.',
          },
        ]}
      />


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          The staking data you learned here doesn't stand alone — it interlocks with:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T04.L01 Route Survey Overview</strong> — The survey route data that T04 produced is the baseline — staking verifies if conditions have changed since the survey.</li>
    <li><strong>T07.L01 T07.L01</strong> — Connects to the broader OSP workflow.</li>
    <li><strong>T07.L01 T07.L01</strong> — Connects to the broader OSP workflow.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Accurate staking is the bridge between design intent and field reality — every downstream crew depends on it.
        </p>
      </section>
    </LessonLayout>
  );
}
