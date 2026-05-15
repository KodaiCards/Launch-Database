// T07.L09 — Staking QA — What the Engineer Reviews
// Engineer's review of a staking package: completeness checklist, conflict flags, re-stake triggers.
// Sources: RUS Bulletin 1751F-630 §2; RUS Form 740; field QA practice

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T07.L09',
  course_id: 'T07',
  title: 'Staking QA — What the Engineer Reviews',
  order: 9,
  lesson_type: 'working',
  prerequisites: [
    'T07.L01', 'T07.L02', 'T07.L03', 'T07.L04',
    'T07.L05', 'T07.L06', 'T07.L07', 'T07.L08',
  ],
  learning_objectives: [
    'List the items an engineer checks in a staking package QA review',
    'Identify which documentation gaps trigger a re-stake vs. a field call',
    'Understand why each element of a staking package (photo, measurement, note, flag) has downstream consequence',
    'Apply the QA standard to your own work before submitting a staking package',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'QA review',
    'catch rate',
    'field-vs-design conflict',
    'staking completeness checklist',
    'staking re-do trigger',
  ],
  key_terms: [
    {
      term: 'QA review',
      definition: 'The quality assurance review of a completed staking package performed by the engineer of record before the staking data is used for make-ready engineering, permitting, or construction. A QA review checks that every pole in the route has been visited (confirmed by GPS record or photo with a location-anchored timestamp), all required measurements are recorded with acceptable accuracy, all photos are usable, all make-ready flags are supported by documented evidence, and no design-vs-field conflicts were left unresolved.',
    },
    {
      term: 'catch rate',
      definition: 'In staking QA, the percentage of real make-ready conflicts that the staking crew correctly identified and documented. A catch rate of 100% means every pole that genuinely needed a make-ready flag was flagged. A catch rate of 85% means 15% of real conflicts were missed — and those 15% will be discovered later (during make-ready engineering, construction, or inspection), each triggering a change order or re-stake. A high catch rate is the single most important quality metric for a staking crew.',
    },
    {
      term: 'field-vs-design conflict',
      definition: 'Any difference between what the design plan shows for a pole or underground route and what the staker actually measured or observed in the field. Examples: the design shows a pole at STA 10+50 but the actual pole is at STA 10+35; the design shows a 35-ft pole but the field measurement shows a 30-ft pole; the design assumes the existing wire at 27 ft but the staker measures it at 24 ft. Every field-vs-design conflict must be documented with measurement and photo — not ignored just because the conflict is "small."',
    },
    {
      term: 'staking completeness checklist',
      definition: 'A structured list of deliverables that a staking package must include to be accepted for QA review. Typical items: (1) every pole in the route has a record (no missing pole IDs), (2) every pole has at least two photos (tag + condition overview), (3) attachment heights are recorded for every existing attachment within 5 ft of the design attachment height, (4) make-ready flags are documented with measurement + photo + confidence, (5) underground bore pits and pull pits have location confirmation notes, (6) any design-vs-field conflicts are documented with measurement and photo, (7) GPS record shows progression along the route (no apparent skipped sections).',
    },
    {
      term: 'staking re-do trigger',
      definition: 'A condition found during QA review that requires the staking crew to return to the field and re-stake some or all of a route section. Common triggers: a section of poles missing entirely from the package (GPS record shows the crew didn\'t visit them); attachment height measurements missing for multiple poles (the engineer cannot confirm make-ready requirements without them); photos for a section are missing, blurry, or don\'t show the measurement display; make-ready flags lack supporting measurement evidence. A re-stake adds time and cost to the project — the goal is to catch completeness gaps before leaving the field, not discover them in QA.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const vocabulary_assumed = [
  { term: 'staker', source_lesson_id: 'T07.L01' },
  { term: 'RUS Form 740', source_lesson_id: 'T07.L05' },
  { term: 'make-ready flag', source_lesson_id: 'T07.L06' },
  { term: 'photo-attach', source_lesson_id: 'T07.L08' },
  { term: 'attachment height measurement', source_lesson_id: 'T07.L04' },
  { term: 'staking sheet', source_lesson_id: 'T07.L05' },
];

export const key_terms = meta.key_terms;

export default function T07L09_StakingQAWhatTheEngineerReviews() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          After you stake a route and submit your notes and photos, an engineer reviews
          the package before anyone uses it for make-ready engineering or construction.
          This review is called a QA (Quality Assurance) review — and it's the moment your
          work is either accepted or sent back.
        </p>
        <p className="mt-2">
          Understanding what the engineer is looking for is the fastest way to improve your
          staking quality. The engineer isn't checking your work to be difficult — they're
          checking because every gap you leave in the staking package creates a problem
          downstream: a missed make-ready flag that becomes a change order; a missing photo
          that causes a dispute with the pole owner; a measurement error that puts the fiber
          at the wrong height.
        </p>
        <p className="mt-2">
          The three questions the engineer is answering during QA:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>
            <strong>Is the package complete?</strong> Did the staker visit every pole?
            Is there a record — photo, measurement, note — for every pole on the route?
          </li>
          <li>
            <strong>Are the measurements reliable?</strong> Are attachment heights recorded
            with a method and accuracy the engineer can trust? Are make-ready flags supported
            by actual measurements, not opinions?
          </li>
          <li>
            <strong>Are the conflicts documented?</strong> Every place where the field
            doesn't match the design — different pole height, existing wire in the wrong
            place, terrain different from the profile — must be documented. Ignored conflicts
            do not go away; they become construction surprises.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Relevance</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">QA</td>
              <td className="px-3 py-2">Quality Assurance</td>
              <td className="px-3 py-2">The engineer's structured review of staking completeness and accuracy before the data is used</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MR</td>
              <td className="px-3 py-2">Make-Ready</td>
              <td className="px-3 py-2">Preparatory work on poles that must be priced and scheduled before fiber attachment; staking data drives MR engineering</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RO</td>
              <td className="px-3 py-2">Record of Design</td>
              <td className="px-3 py-2">The engineer's master design document updated to reflect staking findings; what "as-staked" vs. "as-designed" means</td>
            </tr>
          </tbody>
        </table>

        {/* Flashcards */}
        <Flashcard
          deckId="T07-L09"
          cards={[
            {
              id: 'T07-L09-fc-qa',
              front: 'What is a staking QA review?',
              back: 'The quality assurance review of a completed staking package performed by the engineer of record before the staking data is used for make-ready engineering, permitting, or construction. A QA review checks that every pole in the route has been visited, all required measurements are recorded with acceptable accuracy, all photos are usable, all make-ready flags are supported by documented evidence, and no design-vs-field conflicts were left unresolved.',
            },
            {
              id: 'T07-L09-fc-catchrate',
              front: 'What is catch rate in staking QA?',
              back: 'The percentage of real make-ready conflicts that the staking crew correctly identified and documented. A catch rate of 100% means every pole that genuinely needed a make-ready flag was flagged. A catch rate of 85% means 15% of real conflicts were missed — and those 15% will be discovered later (during make-ready engineering, construction, or inspection), each triggering a change order or re-stake.',
            },
            {
              id: 'T07-L09-fc-conflict',
              front: 'What is a field-vs-design conflict in staking?',
              back: 'Any difference between what the design plan shows for a pole or underground route and what the staker actually measured or observed in the field. Every field-vs-design conflict must be documented with measurement and photo — not ignored just because the conflict seems small.',
            },
            {
              id: 'T07-L09-fc-checklist',
              front: 'What does a staking completeness checklist verify?',
              back: 'A structured list of deliverables that a staking package must include to be accepted for QA review. Typical items: every pole has a record; every pole has at least two photos (tag + condition overview); attachment heights recorded for all attachments within 5 ft of design height; make-ready flags documented with measurement + photo + confidence; underground bore pits and pull pits confirmed; design-vs-field conflicts documented; GPS record shows full route coverage.',
            },
            {
              id: 'T07-L09-fc-redo',
              front: 'What is a staking re-do trigger?',
              back: 'A condition found during QA review that requires the staking crew to return to the field and re-stake some or all of a route section. Common triggers: section of poles missing entirely from the package; attachment height measurements missing for multiple poles; photos missing, blurry, or don\'t show the measurement display; make-ready flags without supporting measurement evidence.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Engineer's QA Checklist — Item by Item</h2>
        <p>
          When an engineer opens a staking package, this is what they verify for every
          pole and every route section. Learn this list and check yourself against it
          before you leave the field.
        </p>

        <h3 className="mt-4 font-semibold">Per-pole checklist</h3>
        <ol className="list-decimal pl-5 space-y-3 mt-2 text-slate-300/90">
          <li>
            <strong>Pole record exists.</strong> Every pole in the design route has a
            staking record. No pole ID is missing. If a pole was inaccessible (locked gate,
            flooded road), the record should say "inaccessible — reason" rather than simply
            not existing.
          </li>
          <li>
            <strong>Pole tag photo present and legible.</strong> The photo of the pole tag
            (or SCID) must be clear enough that the engineer can read the pole ID. An
            out-of-focus pole tag photo or a photo where the tag is in shadow is not
            acceptable.
          </li>
          <li>
            <strong>Condition overview photo present.</strong> At least one photo showing
            the full pole from ground to top, taken from a position that shows any condition
            flags (lean, burn, woodpecker damage, existing attachments). Phone or tablet
            photos at 8+ megapixels are usually sufficient.
          </li>
          <li>
            <strong>Attachment heights recorded for all wires within 5 ft of design height.</strong>{' '}
            If the design attachment is 28 ft, the staker must measure every existing wire
            between 22 ft and 33 ft and record each one. A note that says "looks clear"
            without measurements is not acceptable for this range.
          </li>
          <li>
            <strong>Make-ready flags supported by measurement and photo.</strong> Every
            make-ready flag must cite the measurement that caused the flag (supply at 30.5 ft,
            design fiber at 28 ft, clearance = 2.5 ft &lt; required 3.33 ft) and link to
            at least one photo showing the existing wire that needs to move.
          </li>
          <li>
            <strong>Field-vs-design conflicts noted.</strong> If the pole is at a different
            stationing than design, a different height, or shows a different number of
            existing attachments than the design assumed — that delta is documented with
            measurement.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">Per-route-section checklist</h3>
        <ol className="list-decimal pl-5 space-y-3 mt-2 text-slate-300/90">
          <li>
            <strong>GPS record shows continuous progress along the route.</strong> The
            GPS track (from Katapult or a standalone GPS logger) should show a continuous
            path from the first pole to the last. A gap in the GPS track — where the GPS
            shows the staker jumping from pole 8 directly to pole 14 — suggests poles
            9–13 may not have been visited. That triggers an immediate QA question or
            re-stake of that section.
          </li>
          <li>
            <strong>Underground bore pits and pull pits have location confirmation.</strong>{' '}
            For any HDD bore section: the staker's notes confirm the bore pit and pull pit
            locations are accessible and free of the conflicts documented in L07 (overhead
            clearance, traffic clearance, driveway conflicts). If the bore pit has a conflict
            that was found in the field, it must be noted with a location delta and escalated.
          </li>
          <li>
            <strong>Span length spot-checks pass.</strong> The engineer may spot-check
            measured span lengths (distance between poles) against design plan spans.
            A measured span length that differs from design by more than 5% warrants
            explanation — either the design plan is wrong (pole was installed at the wrong
            location) or the staker measured the wrong pair of poles.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">QA verdicts: what happens after review</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">QA verdict</th>
              <th className="px-3 py-2 text-left">Meaning</th>
              <th className="px-3 py-2 text-left">Next step</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 text-green-400 font-semibold">Accepted</td>
              <td className="px-3 py-2">Package is complete and measurements support engineering use</td>
              <td className="px-3 py-2">Make-ready engineering begins; permits submitted</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 text-yellow-400 font-semibold">Conditional</td>
              <td className="px-3 py-2">Minor gaps — engineer needs clarification or one missing photo</td>
              <td className="px-3 py-2">Field call or targeted re-photograph; no full re-stake</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 text-red-400 font-semibold">Re-stake required</td>
              <td className="px-3 py-2">Section has missing poles, missing measurements, or unsupported make-ready flags</td>
              <td className="px-3 py-2">Crew returns to field; re-stakes the flagged section</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — Catch Rate Reality</p>
          <p className="text-slate-300/90">
            <strong>Book expectation:</strong> Staking documentation should capture 100% of
            make-ready conflicts. Every design spec and QA standard is written as if 100%
            catch rate is the floor.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Experienced staking crews typically achieve 85–95%
            catch rate on first pass. The gaps are usually: attachments that are physically
            difficult to photograph (too high, backlighted, obstructed by tree canopy);
            condition issues that aren't visible from the ground (internal rot in a pole that
            looks clean externally); or poles that were added to the design after the staker
            received the plan set (late design changes that weren't communicated to the crew).
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>What the engineer does with a 90% catch rate:</strong> The remaining 10%
            of conflicts get caught during make-ready engineering (when the estimator walks
            the route with the staking package) or during construction (when the crew arrives
            and finds a wire that's too low). Both of those discovery points generate change
            orders. RUS-funded projects have change order processes, but every change order
            takes time and costs money that wasn't in the original budget.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The field discipline that raises catch rate:</strong> Before leaving
            each pole, read your record back to yourself: "I have the pole tag photo, the
            condition photo, measurements for all wires between 22 ft and 33 ft, and any
            make-ready flags are documented." If any item is missing, get it before you walk
            to the next pole. A 30-second self-check at each pole eliminates the majority
            of re-stake triggers.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: Self-QA — Reviewing Your Own Package Before Submitting</h2>
        <p>
          The engineer's QA review is the backstop. The staker's self-QA is the first line
          of defense. Before submitting any staking package, run through this self-check:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>
            <strong>Count poles.</strong> Does your record count match the design's pole
            count for the route? If the design shows 47 poles and you have 44 records, you
            missed 3. Find them before submitting.
          </li>
          <li>
            <strong>Spot-check photos.</strong> Open 10 random pole records and verify each
            has a legible tag photo and at least one condition photo. If any are missing or
            blurry, flag them immediately — same day is always cheaper than a re-stake trip.
          </li>
          <li>
            <strong>Verify make-ready flag support.</strong> For every pole with a
            make-ready flag, confirm the flag record includes: a measurement (not just
            "wire looks low"), at least one photo showing the wire, and a confidence level.
          </li>
          <li>
            <strong>Review GPS track for gaps.</strong> If you're using Katapult or a GPS
            logger, open the GPS track and look for places where the path jumps. A jump of
            more than 200 feet between consecutive pole records (on a 100-ft span route) is
            a gap worth investigating.
          </li>
          <li>
            <strong>Note any design-vs-field conflicts explicitly.</strong> If you found
            that a pole was 20 feet south of where the design showed it, write "Pole 12:
            found at STA 4+30, design shows STA 4+50 — 20 ft south of design. Confirmed
            with laser measure from gas-main crossing stake." Don't trust the reader to
            figure it out from the GPS coordinates alone.
          </li>
        </ul>
      </section>

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        title="Engineer QA Review — 3-Pole Section"
        description="You are the staker reviewing your own work on a 3-pole section before submitting. Evaluate each pole record and decide if it's complete, conditional, or needs re-stake."
        initialState="start"
        states={{
          start: {
            text: 'You just finished staking a 3-pole section (Poles 18, 19, 20) and you\'re about to submit. Before you do, you review each record. Start with Pole 18.',
            choices: [
              { label: 'Review Pole 18', next: 'pole18' },
            ],
          },
          pole18: {
            text: 'Pole 18 record: pole tag photo (clear), condition overview photo (shows full pole), attachment heights: supply at 33.2 ft, telecom at 28.5 ft, CATV at 27.1 ft. Design calls for fiber at 29.0 ft. Make-ready check: telecom at 28.5 ft is only 0.5 ft below design fiber (29.0 − 28.5 = 0.5 ft). Required separation below: 12 inches (1.0 ft). 0.5 ft < 1.0 ft — conflict. Make-ready flag present: "Telecom at 28.5 ft, below required separation from design fiber at 29.0 ft. Transfer required. Measurement: laser, confidence high." 2 photos attached. What\'s your self-QA verdict on Pole 18?',
            choices: [
              { label: 'Complete — everything is documented, flag is supported, submit', next: 'pole18_correct' },
              { label: 'Conditional — the measurement is there but I need one more photo of the telecom wire specifically', next: 'pole18_overcautious' },
              { label: 'Re-stake — I didn\'t measure the CATV at 27.1 ft against the required separation from telecom at 28.5 ft', next: 'pole18_wrong' },
            ],
          },
          pole18_correct: {
            text: 'Correct. Pole 18 has: tag photo, condition photo, attachment heights for all wires within the relevant range, a make-ready flag with measurement + confidence + 2 photos. The flag is complete. The CATV at 27.1 ft is more than 12 inches below the design fiber (29.0 − 27.1 = 1.9 ft — no conflict). You only need to document measurements for wires in conflict range. Pole 18: ACCEPTED. Move to Pole 19.',
            choices: [
              { label: 'Review Pole 19', next: 'pole19' },
            ],
          },
          pole18_overcautious: {
            text: 'The existing 2 photos (pole tag + condition overview) are sufficient to identify which wire is at 28.5 ft — you can see the telecom line in the condition photo and your measurement log shows 28.5 ft for that wire. Adding a third attachment-specific photo is good practice for very high-stakes flags, but it\'s not a conditional gap here. Pole 18 is complete as-is. Move on.',
            choices: [
              { label: 'Accept Pole 18 and review Pole 19', next: 'pole19' },
            ],
          },
          pole18_wrong: {
            text: 'No re-stake needed. CATV at 27.1 ft and telecom at 28.5 ft are both BELOW the design fiber (29.0 ft). The QA check for pole 18 is whether the design fiber at 29.0 ft will have required clearances above (from supply) and below (from telecom/CATV). Supply check: 33.2 − 29.0 = 4.2 ft > 3.33 ft required — OK. Telecom check: 29.0 − 28.5 = 0.5 ft < 1.0 ft required — FLAG. CATV check: 29.0 − 27.1 = 1.9 ft > 1.0 ft required — OK. You already flagged the one conflict. No re-stake. Move to Pole 19.',
            choices: [
              { label: 'Review Pole 19', next: 'pole19' },
            ],
          },
          pole19: {
            text: 'Pole 19 record: 1 photo — a back-angle photo of the pole from 20 feet behind (shows the pole is a wood utility pole, no visible damage). No pole tag photo. Attachment heights: nothing recorded. Note: "existing wire too crowded." Make-ready flag: none. GPS record shows you were at this pole\'s location for about 2 minutes. What\'s your self-QA verdict on Pole 19?',
            choices: [
              { label: 'Complete — the condition photo shows the pole is fine and the note explains the crowding', next: 'pole19_wrong_complete' },
              { label: 'Conditional — I need to call the field to get the pole tag ID and one attachment height, but I might not need to re-stake', next: 'pole19_conditional' },
              { label: 'Re-stake required — no tag photo, no measurements, "crowded" is not a documented flag, 2-minute visit is insufficient', next: 'pole19_correct' },
            ],
          },
          pole19_correct: {
            text: 'Correct. Pole 19 has: 1 back-angle photo (engineer can\'t read the tag or see attachment heights), no pole tag photo (can\'t confirm pole ID), no attachment height measurements (can\'t assess make-ready requirements), and a vague note ("crowded") that is not an actionable make-ready flag. The 2-minute GPS timestamp suggests the visit was brief — consistent with a pass-by rather than a full stake. This pole requires re-stake: tag photo, condition overview from front, attachment heights for all wires, and either a documented make-ready flag or a documented "no conflict" for each wire in the design range. Move to Pole 20.',
            choices: [
              { label: 'Review Pole 20', next: 'pole20' },
            ],
          },
          pole19_wrong_complete: {
            text: 'Not acceptable. A back-angle photo doesn\'t show the pole tag, attachment heights, or condition details that would be visible from the front. "Existing wire too crowded" is an observation, not a documented flag — the engineer has no idea what heights the wires are at, whether the crowding creates a make-ready conflict, or what "crowded" means quantitatively. No measurements + no tag photo + no specific conflict documentation = re-stake required.',
            choices: [
              { label: 'Reclassify as re-stake and review Pole 20', next: 'pole20' },
            ],
          },
          pole19_conditional: {
            text: 'A field call might recover the tag ID if this is a pole where the ID is visible from a neighboring structure or in an aerial photo. But attachment heights cannot be recovered remotely — you need to physically visit the pole with a laser to measure the wires. "Crowded" is not a documented flag without measurements. This is a re-stake, not a conditional. Flag it.',
            choices: [
              { label: 'Reclassify as re-stake and review Pole 20', next: 'pole20' },
            ],
          },
          pole20: {
            text: 'Pole 20 record: tag photo (clear), 2 photos (front and side), attachment heights: supply at 34.0 ft, no other wires visible. Design calls for fiber at 26.0 ft. Measurement note: "pole height approximately 35 ft (estimated visually), leaning approximately 5° toward the road." Make-ready flag: "pole leaning, recommend replacement evaluation. Confidence: medium (visual estimate only, no tape or inclinometer)." GPS record: 8 minutes at this pole\'s location. What\'s your verdict?',
            choices: [
              { label: 'Complete — the flag is documented with a confidence level and the engineer can evaluate from there', next: 'pole20_correct' },
              { label: 'Conditional — the lean angle needs to be measured with an inclinometer, not estimated', next: 'pole20_overcautious' },
              { label: 'Re-stake — I didn\'t photograph the lean from two angles', next: 'pole20_photo' },
            ],
          },
          pole20_correct: {
            text: 'Correct. Pole 20 has: tag photo, 2 directional photos, a documented make-ready flag with a confidence level (medium — visual estimate), and 8 minutes of GPS dwell time indicating a thorough visit. The lean angle is documented as an estimate with honest confidence — the engineer knows this is a visual read, not an inclinometer measurement. For a replacement candidate (not a force pole), this documentation is sufficient for the engineer to decide whether to send a field inspector or accept the flag at face value. The flag quality is acceptable. Self-QA result: Pole 20 ACCEPTED.',
            choices: [
              { label: 'Complete self-QA', next: 'summary' },
            ],
          },
          pole20_overcautious: {
            text: 'An inclinometer or digital level is ideal for lean angle documentation, but it\'s not always available in the field. A visual estimate with honest confidence level ("medium") is acceptable if accompanied by directional photos showing the lean. The engineer reads "medium confidence" and knows to validate with a field inspection. This is not a re-stake trigger — it\'s an appropriate documentation of field uncertainty. Accept Pole 20.',
            choices: [
              { label: 'Accept Pole 20 and complete self-QA', next: 'summary' },
            ],
          },
          pole20_photo: {
            text: 'Two photos (front and side) adequately document a 5° lean for a replacement candidate. A photograph from the front shows the lean direction; a photograph from the side confirms or contradicts the forward-lean interpretation. Two angles are sufficient for the engineer to evaluate. A force pole (imminent failure) would warrant more documentation, but for a replacement candidate with honest confidence notation, this is acceptable.',
            choices: [
              { label: 'Accept Pole 20 and complete self-QA', next: 'summary' },
            ],
          },
          summary: {
            text: 'Self-QA complete. Results: Pole 18 — ACCEPTED (complete documentation, supported flag). Pole 19 — RE-STAKE REQUIRED (missing tag photo, no measurements, unsupported note). Pole 20 — ACCEPTED (complete documentation, confident flag with honest uncertainty). Before submitting: schedule re-stake of Pole 19. The rest of the package can proceed.',
            choices: [],
          },
        }}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T07.L09 Check — Staking QA"
        mode="multiple-choice"
        questions={[
          {
            id: 'T07-L09-Q1',
            type: 'mc',
            prompt: 'An engineer reviewing a staking package finds that poles 23 through 28 have no records in the staking data. The GPS track shows the staker\'s path jumps from pole 22 directly to pole 29. What is the most likely QA verdict for this section?',
            choices: [
              'Accepted — GPS gaps are normal in rural areas without cellular',
              'Conditional — the engineer should call the staker and ask about the missing poles',
              'Re-stake required — six consecutive missing pole records with a GPS gap strongly suggests those poles were not visited',
              'Accepted — the staker probably noted the poles as "no issues" and didn\'t create records',
            ],
            answerIndex: 2,
            explanation: 'Six consecutive missing pole records combined with a GPS track gap is a strong indicator that the section was not staked. "No record" does not mean "no issues" — it means the engineer has no data for those poles. Make-ready engineering cannot proceed for poles without staking data. Re-stake is the correct verdict. A brief field call (conditional) is not sufficient here — the data is entirely missing, not just incomplete.',
          },
          {
            id: 'T07-L09-Q2',
            type: 'mc',
            prompt: 'A staker\'s make-ready flag says "wire looks too low to attach." The engineer\'s QA verdict is "conditional." What specific information does the staker need to provide to upgrade this to "accepted"?',
            choices: [
              'A second photo of the wire from a different angle',
              'A measurement of the wire height, calculation of the clearance delta versus design requirement, and confidence level noting the measurement method',
              'The pole owner\'s name and contact information for the make-ready coordination',
              'A second staker\'s confirmation that the wire is too low',
            ],
            answerIndex: 1,
            explanation: '"Wire looks too low" is an observation without evidence. To be accepted, a make-ready flag must include: the measured wire height, the design fiber height, the calculated clearance (measured − design), the required clearance per NESC Rule 232/235, and the confidence level (method used — laser or tape, accuracy). The engineer needs the math, not the opinion. (Source: RUS 1751F-630 §2; field QA practice.)',
          },
          {
            id: 'T07-L09-Q3',
            type: 'mc',
            prompt: 'Before submitting a staking package, a staker should do a self-QA check. Which of these is the most important single item to verify for every pole?',
            choices: [
              'The GPS coordinate is within 2 meters of the design pole location',
              'The pole tag photo is legible and the attachment heights for all wires within the design attachment range are recorded',
              'The pole condition matches the design plan\'s pole classification (Class 1, Class 2, etc.)',
              'The staker\'s initials and date are written on the staking sheet for this pole',
            ],
            answerIndex: 1,
            explanation: 'The pole tag photo (legible = engineer can confirm pole ID) and attachment heights in the design range (engineer can assess make-ready requirements) are the two most critical elements per pole. GPS accuracy of ±2 m is rarely achievable or required for standard staking. Pole class verification is important but secondary — the staker can note a class mismatch but isn\'t expected to run the full ANSI O5.1 calculation. Initials and date are documentation hygiene but not the priority self-QA item.',
          },
          {
            id: 'T07-L09-Q4',
            type: 'mc',
            prompt: 'The staker notes "pole leaning 5° toward road" with medium confidence and two directional photos. No inclinometer was available. The engineer\'s QA verdict is most likely:',
            choices: [
              'Re-stake required — lean angle must be measured with an inclinometer, not estimated',
              'Accepted — visual estimate with honest confidence level and two directional photos is sufficient documentation for a replacement candidate flag',
              'Rejected — the engineer cannot act on a medium-confidence flag',
              'Conditional — the staker must return and photograph the lean from all four compass directions',
            ],
            answerIndex: 1,
            explanation: 'A visual estimate with honest confidence notation ("medium — visual estimate only, no inclinometer") combined with two directional photos is sufficient for the engineer to evaluate a replacement candidate. The engineer reads "medium" as "I should verify this before committing to replacement cost." That is a valid engineering input. A re-stake is not required for this documentation level; the engineer may choose to send a field inspector rather than trigger a full re-stake. (Source: field QA practice; RUS 1751F-630 §2.)',
          },
        ]}
      />

    </LessonLayout>
  );
}
