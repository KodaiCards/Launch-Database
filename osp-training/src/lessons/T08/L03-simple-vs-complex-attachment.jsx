// T08.L03 — Simple vs. Complex Attachment
// Working lesson: determination criteria, cost causation, and who pays
// Source: net-new (no prior module equivalent; FCC 18-111 + RUS 1751F-630 §8)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Sortable from '../../components/primitives/Sortable.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T08.L03',
  course_id: 'T08',
  title: 'Simple vs. Complex Attachment',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T08.L01', 'T08.L02'],
  learning_objectives: [
    'Apply the simple vs. complex attachment determination to real pole-audit scenarios',
    'Explain the cost-causation rule: who pays for make-ready work in each case',
    'Identify which scenario triggers OTMR eligibility and which requires multi-party coordination',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'simple attachment',
    'complex attachment',
    'make-ready cost causation',
    'determination criteria',
  ],
  key_terms: [
    {
      term: 'simple attachment',
      definition:
        'An attachment that can be installed without requiring any existing utility or telecom attachments to be moved, raised, or adjusted. In a simple attachment, the new cable fits within the design space without disturbing any existing cables. Simple attachments proceed faster and typically cost less because no coordination with other parties is needed.',
    },
    {
      term: 'complex attachment',
      definition:
        'An attachment that requires one or more existing cables or attachments on a pole to be moved, raised, or otherwise adjusted to make room for the new cable. Complex attachments trigger the make-ready process — the existing cables must be relocated before the new cable can be installed. Cost of the relocation is governed by the cost-causation rule.',
    },
    {
      term: 'make-ready cost causation',
      definition:
        'The principle that governs who pays for make-ready work on a utility pole. Under FCC rules and RUS guidance, the party that causes the need for make-ready bears the cost: if an existing attachment is already out of compliance (e.g., too low per NESC clearance rules), the pole owner or that attachment\'s owner pays. If the attachment is in compliance but must move solely because the new attacher needs the space, the new attacher (applicant) pays.',
    },
    {
      term: 'determination criteria',
      definition:
        'The factors used to classify an attachment as simple or complex. Per FCC 18-111, the key criteria are: (1) Does the new attachment require moving any existing attachment? (2) Does the work involve any de-energized power conductor? (3) Does the make-ready require any specialized power utility crews? If the answer to any of these is yes, the attachment is complex; otherwise it is simple.',
    },
  ],
  vocabulary_assumed: [
    { term: 'OTMR', source_lesson_id: 'T08.L01' },
    { term: 'pole owner', source_lesson_id: 'T05.L03' },
    { term: 'attachment applicant', source_lesson_id: 'T08.L01' },
    { term: 'multi-party make-ready', source_lesson_id: 'T08.L01' },
    { term: 'pole audit', source_lesson_id: 'T07.L02' },
    { term: 'existing attachments', source_lesson_id: 'T07.L02' },
    { term: 'clearance', source_lesson_id: 'T05.L02' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export default function T08L03_SimpleVsComplexAttachment() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When you submit an attachment application for a new fiber cable, the first
          question the pole owner asks is: "Does anything on this pole have to move to
          make room for your cable?" If the answer is no, your attachment is{' '}
          <strong>simple</strong>. If the answer is yes, it's <strong>complex</strong>.
        </p>
        <p className="mt-2">
          Simple attachments are faster, cheaper, and have less regulatory friction.
          Complex attachments require the make-ready process — existing wires need to move,
          which means coordination, costs, and time. Knowing how to read a pole audit
          (from T07.L02) and quickly categorize an attachment as simple or complex is
          an essential skill for project engineers and stakers.
        </p>
        <p className="mt-2">
          The other piece of the puzzle is <strong>who pays</strong> for the make-ready
          work when it's complex. The FCC's cost-causation rule governs this — and it's
          not always "the new guy pays." If an existing attachment is already out of
          compliance with safety rules, the cost falls on the pole owner or the existing
          attacher, not the newcomer.
        </p>

        <h3 className="mt-5 font-semibold">The quick test: is this simple or complex?</h3>
        <p className="mt-2">
          Ask yourself three questions when reviewing a pole audit:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Does any existing cable need to move for the new cable to fit?</strong>{' '}
            If no → likely simple. If yes → complex.
          </li>
          <li>
            <strong>Does the make-ready involve any de-energized or energized power conductors?</strong>{' '}
            If yes → complex (requires specialized power utility crews, regardless of everything else).
          </li>
          <li>
            <strong>Can an FCC-approved telecom contractor do all the work alone?</strong>{' '}
            If yes → potentially simple. If specialized power crews are needed → complex.
          </li>
        </ol>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T08-L03"
          cards={[
            {
              id: 'T08-L03-fc-simple',
              front: 'What is a "simple attachment" on a utility pole?',
              back: 'An attachment that can be installed without requiring any existing utility or telecom attachments to be moved, raised, or adjusted. In a simple attachment, the new cable fits within the design space without disturbing any existing cables. Simple attachments proceed faster and typically cost less because no coordination with other parties is needed.',
            },
            {
              id: 'T08-L03-fc-complex',
              front: 'What is a "complex attachment" on a utility pole?',
              back: 'An attachment that requires one or more existing cables or attachments on a pole to be moved, raised, or otherwise adjusted to make room for the new cable. Complex attachments trigger the make-ready process — the existing cables must be relocated before the new cable can be installed. Cost of the relocation is governed by the cost-causation rule.',
            },
            {
              id: 'T08-L03-fc-causation',
              front: 'What is "make-ready cost causation"?',
              back: 'The principle that governs who pays for make-ready work on a utility pole. Under FCC rules and RUS guidance, the party that causes the need for make-ready bears the cost: if an existing attachment is already out of compliance (e.g., too low per NESC clearance rules), the pole owner or that attachment\'s owner pays. If the attachment is in compliance but must move solely because the new attacher needs the space, the new attacher (applicant) pays.',
            },
            {
              id: 'T08-L03-fc-criteria',
              front: 'What are the "determination criteria" for simple vs. complex?',
              back: 'The factors used to classify an attachment as simple or complex. Per FCC 18-111, the key criteria are: (1) Does the new attachment require moving any existing attachment? (2) Does the work involve any de-energized power conductor? (3) Does the make-ready require any specialized power utility crews? If the answer to any of these is yes, the attachment is complex; otherwise it is simple.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The FCC Definition and Cost Rules</h2>

        <h3 className="mt-4 font-semibold">FCC's formal simple vs. complex distinction (FCC 18-111)</h3>
        <p>
          FCC Order 18-111 defines the two categories to determine which OTMR procedures apply:
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">FCC Definition</th>
                <th className="px-3 py-2 text-left">Who can perform the work</th>
                <th className="px-3 py-2 text-left">OTMR applicability</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium text-green-400">Simple</td>
                <td className="px-3 py-2">No existing attachment needs to move; work is limited to installing the new cable and its hardware</td>
                <td className="px-3 py-2">Any FCC-approved contractor</td>
                <td className="px-3 py-2">OTMR fully applies; 15-day clock governs access</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium text-amber-400">Complex — telecom-only</td>
                <td className="px-3 py-2">Existing telecom/cable cables must move, but no power conductor is involved</td>
                <td className="px-3 py-2">FCC-approved telecom contractor; OTMR applies to private cables, multi-party required for ILECs</td>
                <td className="px-3 py-2">OTMR applies for eligible cables; multi-party for ILECs</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium text-red-400">Complex — power involvement</td>
                <td className="px-3 py-2">Power company conductors must be moved or de-energized; or work within power space</td>
                <td className="px-3 py-2">Power utility crew required; OTMR does NOT apply to the power work</td>
                <td className="px-3 py-2">Multi-party coordination required; no OTMR self-help on power work</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: FCC 18-111 (2018); 47 CFR §1.1411; RUS Bulletin 1751F-630 §8.
        </p>

        <h3 className="mt-5 font-semibold">Cost causation: who pays for complex make-ready?</h3>
        <p>
          This is where many engineers get confused. The default assumption is "the new
          fiber company always pays." That's wrong. The FCC and RUS follow a{' '}
          <strong>cost-causation principle</strong>: the party who causes the need for
          the work pays for it.
        </p>
        <div className="mt-3 space-y-3">
          <div className="p-3 border border-green-400/30 bg-green-400/5 rounded-lg text-sm">
            <p className="font-semibold text-green-300 mb-1">Scenario A — Existing cable is out of compliance → Pole owner or existing attacher pays</p>
            <p className="text-slate-300/90">
              The cable TV coax is hanging at 16 ft. NESC §232 requires a minimum 15.5 ft
              clearance over the road in this district, so it's technically compliant —
              but the pole owner's own standard says 17 ft minimum for this pole class.
              The cable has to move regardless of whether the fiber company shows up.
              In this case, the cable owner (cable TV company) or the pole owner absorbs
              the cost of raising the coax. The fiber applicant does not pay for bringing
              the existing cable into compliance.
            </p>
          </div>
          <div className="p-3 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
            <p className="font-semibold text-amber-300 mb-1">Scenario B — Existing cable is compliant but in the way → Fiber applicant pays</p>
            <p className="text-slate-300/90">
              The cable TV coax is at 18 ft — fully compliant with NESC and the pole
              owner's standards. The fiber design needs 17 ft 6 in. The coax has to move
              up 6 inches to give the fiber room. The coax would NOT have moved at all
              without the fiber company's attachment. The fiber applicant caused the need
              for the move, so the fiber applicant pays for the transfer.
            </p>
          </div>
          <div className="p-3 border border-sky-400/30 bg-sky-400/5 rounded-lg text-sm">
            <p className="font-semibold text-sky-300 mb-1">Scenario C — Mixed (partly compliance, partly new attachment) → Split cost</p>
            <p className="text-slate-300/90">
              The coax is at 16 ft. NESC minimum is 15.5 ft. The fiber design needs 15 ft.
              The coax has to move up 1.5 ft total — but 0.5 ft of that move is just to
              bring it back into a reasonable safety margin (not strictly required by NESC
              but good practice), and 1 ft is to clear the fiber attachment. In practice,
              the cost is negotiated or split proportionally. The FCC doesn't prescribe an
              exact formula for split-cause scenarios; expect negotiation and document the
              agreement.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Reading the pole audit for simple vs. complex</h3>
        <p>
          The staker's report (from T07) tells you everything you need to make the
          simple vs. complex determination. The key columns to check:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Existing attachment heights</strong> — Is your design height above or
            below any existing attachment? If your fiber goes at 18 ft and everything else
            is above 20 ft, you're simple.
          </li>
          <li>
            <strong>Owner of each attachment</strong> — Private telecom (OTMR-eligible),
            ILEC (multi-party), power company (multi-party + power crew).
          </li>
          <li>
            <strong>NESC compliance of each existing attachment</strong> — Is the existing
            attachment already out of compliance? If yes, document it — it affects cost
            allocation.
          </li>
          <li>
            <strong>Available space in the comm zone</strong> — Is there a gap between the
            lowest existing comms attachment and the next-higher attachment where your fiber
            fits without displacing anything?
          </li>
        </ol>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (FCC 18-111):</strong> Simple vs. complex is determined by the
            make-ready survey data before any work begins. The pole owner makes the
            determination; if the applicant disputes it, the FCC arbitrates.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Stakers and project engineers do this determination in
            the field during the pole survey — sometimes on the spot at the base of each
            pole. An experienced staker can look at a pole, see where all the cables are,
            and immediately call "simple" or "complex." The formal determination then gets
            documented in the make-ready report. In field practice, most poles on a new
            fiber build end up complex because the existing cable TV coax is almost always
            within a foot or two of the fiber design height.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Contesting a simple vs. complex determination</h3>
        <p>
          The pole owner makes the initial simple vs. complex call. If the applicant
          disagrees — for example, if the pole owner classifies something as complex
          that the applicant believes is simple, potentially to slow the process or
          inflate costs — the applicant can dispute the determination.
        </p>
        <p className="mt-2 text-sm">
          Disputes go through a two-step process under 47 CFR §1.1414:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Informal negotiation:</strong> The applicant requests a written
            explanation from the pole owner. The pole owner must justify the complex
            determination with reference to the make-ready survey data and the FCC's
            criteria. Most disputes resolve here.
          </li>
          <li>
            <strong>FCC complaint:</strong> If informal negotiation fails, the applicant
            can file a complaint with the FCC under 47 U.S.C. §224(f). The FCC reviews
            the make-ready data and determines whether the complex classification was
            justified. This is slow (months) but available.
          </li>
        </ol>
        <p className="mt-2 text-sm">
          In RUS-funded projects, the RUS field representative is an additional oversight
          resource — if a pole owner's classification appears inconsistent with RUS
          construction practices, the field rep can raise the issue informally. (Source:
          RUS 1751F-630 §8, coordination requirements.)
        </p>
      </section>

      {/* ── SORTABLE EXERCISE ───────────────────────────────────────────── */}
      <Sortable
        title="Sort These Scenarios: Simple or Complex?"
        instructions="Each card describes a pole-audit finding. Sort them into the correct category — Simple Attachment (green) or Complex Attachment (red)."
        items={[
          {
            id: 'scenario-a',
            label: 'New fiber at 17 ft. Existing cables: cable TV at 21 ft, telco at 24 ft, power at 28 ft. No cables at or below 17 ft.',
            category: 'simple',
          },
          {
            id: 'scenario-b',
            label: 'New fiber at 18 ft. Existing cable TV coax at 18 ft 6 in. Coax must move up 6 inches.',
            category: 'complex',
          },
          {
            id: 'scenario-c',
            label: 'New fiber at 16 ft. No existing comms cables below 20 ft. Power conductors at 25 ft. No movement needed.',
            category: 'simple',
          },
          {
            id: 'scenario-d',
            label: 'New fiber at 19 ft. ILEC copper drop at 19 ft 4 in. ILEC copper must move up 4 inches.',
            category: 'complex',
          },
          {
            id: 'scenario-e',
            label: 'New fiber at 17 ft. Power neutral conductor at 18 ft. Power company must de-energize and raise their conductor.',
            category: 'complex',
          },
          {
            id: 'scenario-f',
            label: 'New fiber at 20 ft. Existing space at 19 ft 8 in to 22 ft is empty. No cables need to move.',
            category: 'simple',
          },
        ]}
        categories={[
          { id: 'simple', label: 'Simple Attachment', color: 'green' },
          { id: 'complex', label: 'Complex Attachment', color: 'red' },
        ]}
        explanations={{
          'scenario-a': 'Simple — all existing cables are above the new fiber height. Nothing needs to move.',
          'scenario-b': 'Complex — the cable TV coax at 18 ft 6 in is only 6 inches above the design height and must be raised. This triggers the make-ready process.',
          'scenario-c': 'Simple — no existing comms cables below 20 ft. The power conductors are above and not involved in the attachment work.',
          'scenario-d': 'Complex — ILEC copper must move. Additionally, ILEC ownership means multi-party coordination is required (not OTMR-eligible for that cable).',
          'scenario-e': 'Complex — power company involvement immediately makes this complex. Power crew required; OTMR does not apply to power conductor work.',
          'scenario-f': 'Simple — the 20 ft attachment point is in an empty space. No existing cable needs to move.',
        }}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T08.L03 Check — Simple vs. Complex Attachment"
        mode="multiple-choice"
        questions={[
          {
            id: 'T08-L03-Q1',
            type: 'mc',
            prompt:
              'A pole audit shows an existing cable TV coax at 18 ft 3 in. The fiber design calls for an attachment at 18 ft. The coax must be raised 3 inches. How is this classified?',
            choices: [
              'Simple — 3 inches is a minor adjustment, not a full make-ready action',
              'Complex — any movement of an existing cable makes the attachment complex',
              'Simple — only power conductor involvement triggers complex classification',
              'It depends on whether the cable TV company is an ILEC',
            ],
            answerIndex: 1,
            explanation:
              'Any movement of an existing cable — even 3 inches — makes the attachment complex under FCC 18-111. Complex means the make-ready process must be followed: the cable TV cable must be moved first, cost causation rules apply, and OTMR coordination applies to this private telecom cable.',
            citation: 'FCC 18-111 (2018); 47 CFR §1.1411.',
          },
          {
            id: 'T08-L03-Q2',
            type: 'mc',
            prompt:
              'An existing cable TV coax is hanging at 15 ft 8 in on a road crossing where NESC requires a minimum of 17 ft. The fiber design needs 15 ft. The cable TV coax must be raised to comply with NESC. Who is responsible for the cost?',
            choices: [
              'The fiber applicant — they are causing a change to an existing cable',
              'The cable TV company or pole owner — the coax was already out of NESC compliance before the fiber project existed',
              'The local government — NESC is a public safety standard, making compliance a public cost',
              'The FCC — they set the NESC rules and must fund compliance corrections',
            ],
            answerIndex: 1,
            explanation:
              'The cost-causation principle: if the existing cable is already out of compliance (15 ft 8 in is below the 17 ft NESC road crossing minimum), the pole owner or the cable owner is responsible for correcting that non-compliance. The fiber applicant did not cause the violation. The fiber project simply revealed it. The cable TV company or pole owner absorbs the cost of NESC compliance.',
            citation: 'FCC 18-111 (2018); NESC C2-2023 §232 [confirm edition]; RUS 1751F-630 §8.',
          },
          {
            id: 'T08-L03-Q3',
            type: 'mc',
            prompt:
              'During a pole survey, the staker finds that a power company neutral conductor must be de-energized and raised to make room for a new fiber attachment. How does this affect the OTMR process?',
            choices: [
              'OTMR applies fully — all cables including power conductors are eligible under FCC 18-111',
              'OTMR does not apply to the power conductor work; the power company must send their own crew to handle the de-energization and raise',
              'OTMR applies, but the applicant must pay a premium rate for power company contractor involvement',
              'The fiber applicant can skip the power conductor move because NESC prevents power conductors from interfering with fiber',
            ],
            answerIndex: 1,
            explanation:
              'Power conductor work is never OTMR-eligible, regardless of who owns the pole. Energized power conductors require qualified power utility linemen — not telecom contractors — to de-energize, move, and re-energize. This triggers complex, multi-party make-ready involving the power company\'s crew.',
            citation: 'FCC 18-111 (2018); NESC C2-2023 §23, §24 [confirm edition].',
          },
          {
            id: 'T08-L03-Q4',
            type: 'mc',
            prompt:
              'A fiber applicant\'s design requires attachment at 18 ft. The existing cable TV coax is at 18 ft 4 in, fully NESC-compliant. The coax must move up 4 inches so the fiber fits. Who pays for the transfer?',
            choices: [
              'The cable TV company — they own the cable and must maintain it',
              'The pole owner — they are responsible for all make-ready costs',
              'The fiber applicant — the existing cable is compliant, so the applicant caused the need for the move',
              'Cost is split 50/50 between the applicant and the pole owner by FCC rule',
            ],
            answerIndex: 2,
            explanation:
              'The cost-causation rule: the cable TV coax is already NESC-compliant and would not need to move at all without the fiber applicant\'s project. The fiber applicant is the sole cause of the need for the 4-inch raise. Therefore the fiber applicant pays for the transfer of the coax.',
            citation: 'FCC 18-111 (2018); 47 CFR §1.1413 [confirm section].',
          },
          {
            id: 'T08-L03-Q5',
            type: 'drag-match',
            prompt: 'Match each scenario to who pays for the make-ready work under the FCC cost-causation rule.',
            items: [
              { id: 'item-a', label: 'Existing coax already below NESC minimum — must move' },
              { id: 'item-b', label: 'Existing coax is compliant but blocks new fiber height' },
              { id: 'item-c', label: 'Power conductor must be raised to clear fiber — pole owner built the pole undersize' },
            ],
            targets: [
              { id: 'target-applicant', label: 'Fiber applicant pays' },
              { id: 'target-existing', label: 'Existing cable owner / pole owner pays' },
              { id: 'target-existing2', label: 'Existing cable owner / pole owner pays (pole deficiency)' },
            ],
            correctMap: {
              'target-applicant': 'item-b',
              'target-existing': 'item-a',
              'target-existing2': 'item-c',
            },
            explanation: 'Cost causation: (A) the coax was already non-compliant before the fiber project — the existing cable owner or pole owner bears the compliance cost; (B) the compliant coax would never have moved without the fiber project — the fiber applicant caused the move and pays; (C) a pole built below standard is a pole-owner deficiency — not the applicant\'s cost. FCC 18-111 cost-causation framework; 47 CFR §1.1411.',
          },
          {
            id: 'T08-L03-Q6',
            type: 'fill-in-blank',
            prompt:
              'An attachment that requires no existing cables to move is called a ____ attachment.',
            answer: 'simple',
            answerDisplay: 'simple',
            explanation:
              'A simple attachment fits within the design space without disturbing any existing cables. Simple attachments proceed faster and typically cost less because no make-ready work — and therefore no multi-party coordination — is required.',
          },
        ]}
      />

    </LessonLayout>
  );
}
