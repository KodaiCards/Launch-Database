// T08.L05 — Reframe — Adjusting Without Moving
// Working lesson: reframe vs. transfer distinction, when each applies, hardware involved
// Source: net-new

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import SideBySide from '../../components/primitives/SideBySide.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T08.L05',
  course_id: 'T08',
  title: 'Reframe — Adjusting Without Moving',
  order: 5,
  lesson_type: 'working',
  prerequisites: ['T08.L04'],
  learning_objectives: [
    'Distinguish reframe from transfer: what each action does and when each is used',
    'Identify the conditions under which a reframe is sufficient vs. when a full transfer is required',
    'Explain why reframe is typically faster and cheaper than transfer',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'reframe',
    'rearrangement',
    'existing attachments',
    'new brackets',
    'power-utility-owned attachments',
  ],
  key_terms: [
    {
      term: 'reframe',
      definition:
        'A make-ready action in which existing attachments on a utility pole are adjusted — slid, compressed, or repositioned — within their current mounting space, WITHOUT installing new brackets at a new height. Reframe creates small clearance adjustments (typically a few inches) by compressing the existing cables closer together vertically. It is faster and cheaper than a transfer because no new hardware is added at a different height.',
    },
    {
      term: 'rearrangement',
      definition:
        'An alternate term for reframe used by some pole owners and utilities. Rearrangement implies adjusting the position of existing cables within the current communications space on a pole, not relocating them to a new height with new hardware. Rearrangement is the less-disruptive cousin of transfer.',
    },
    {
      term: 'existing attachments',
      definition:
        'All cables, brackets, hardware, and equipment already installed on a utility pole before the new attacher arrives. In make-ready, "existing attachments" are the parties and cables whose position may need to change to make room for the new fiber cable.',
    },
    {
      term: 'new brackets',
      definition:
        'Hardware installed on a pole to support a cable or attachment at a specific height. Adding new brackets (as in a transfer) changes the vertical position of an attachment permanently and requires new hardware be installed and the old hardware removed. Reframe does not add new brackets — it adjusts existing hardware.',
    },
    {
      term: 'power-utility-owned attachments',
      definition:
        'Cables, neutrals, and equipment owned by the electric utility on a joint-use pole. Power-utility-owned attachments cannot be reframed or transferred by a telecom OTMR contractor — any adjustment to power utility attachments requires the power utility\'s own qualified crew. Even a minor reframe of a power company\'s down-guy or neutral conductor requires power utility involvement.',
    },
  ],
  vocabulary_assumed: [
    { term: 'transfer', source_lesson_id: 'T08.L04' },
    { term: 'OTMR', source_lesson_id: 'T08.L01' },
    { term: 'complex attachment', source_lesson_id: 'T08.L03' },
    { term: 'make-ready cost causation', source_lesson_id: 'T08.L03' },
          ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export default function T08L05_ReframeAdjustingWithoutMoving() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When existing cables on a pole are slightly too close together, a crew can
          sometimes fix the problem by pushing things around without installing new
          hardware at a new height. That's called a <strong>reframe</strong> — squeezing
          the existing cables a few inches closer together, or shifting one cable up or
          down slightly within its existing bracket range, to open a gap for the new
          fiber cable.
        </p>
        <p className="mt-2">
          Think of it like rearranging items in a crowded drawer. You don't need a new
          drawer (that would be a transfer) — you just slide things around until there's
          a gap for the new item. A reframe is faster, cheaper, and less disruptive
          than a full transfer because no new brackets are drilled into the pole and no
          cable is lifted to an entirely new height.
        </p>
        <p className="mt-2">
          The important distinction: reframe works only when the adjustment needed is
          small — a few inches — and when the existing cables have room to compress.
          If the adjustment is large (a foot or more), or if the cables are already
          compressed to their minimum spacing, a reframe won't work and a transfer is
          required.
        </p>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T08-L05"
          cards={[
            {
              id: 'T08-L05-fc-reframe',
              front: 'What is a "reframe" in pole make-ready?',
              back: 'A make-ready action in which existing attachments on a utility pole are adjusted — slid, compressed, or repositioned — within their current mounting space, WITHOUT installing new brackets at a new height. Reframe creates small clearance adjustments (typically a few inches) by compressing the existing cables closer together vertically. It is faster and cheaper than a transfer because no new hardware is added at a different height.',
            },
            {
              id: 'T08-L05-fc-rearrangement',
              front: 'What does "rearrangement" mean in pole attachment work?',
              back: 'An alternate term for reframe used by some pole owners and utilities. Rearrangement implies adjusting the position of existing cables within the current communications space on a pole, not relocating them to a new height with new hardware. Rearrangement is the less-disruptive cousin of transfer.',
            },
            {
              id: 'T08-L05-fc-existing',
              front: 'What are "existing attachments" on a utility pole?',
              back: 'All cables, brackets, hardware, and equipment already installed on a utility pole before the new attacher arrives. In make-ready, "existing attachments" are the parties and cables whose position may need to change to make room for the new fiber cable.',
            },
            {
              id: 'T08-L05-fc-newbrackets',
              front: 'What is the difference between a reframe and adding "new brackets"?',
              back: 'Adding new brackets (as in a transfer) changes the vertical position of an attachment permanently and requires new hardware be installed and the old hardware removed. Reframe does not add new brackets — it adjusts existing hardware. Reframe is faster and cheaper; transfer is required when adjustment needs exceed what existing hardware allows.',
            },
            {
              id: 'T08-L05-fc-powerattach',
              front: 'Who can perform reframe or transfer on power-utility-owned attachments?',
              back: 'Cables, neutrals, and equipment owned by the electric utility on a joint-use pole cannot be reframed or transferred by a telecom OTMR contractor — any adjustment to power utility attachments requires the power utility\'s own qualified crew. Even a minor reframe of a power company\'s down-guy or neutral conductor requires power utility involvement.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Reframe vs. Transfer — When Each Applies</h2>

        <h3 className="mt-4 font-semibold">The core distinction in practice</h3>
        <p>
          The make-ready staker (from T07.L02) determines whether a reframe or a transfer
          is needed when reviewing the vertical spacing between existing attachments and
          the new fiber design height. The key question:
        </p>
        <div className="mt-3 p-4 border border-white/10 bg-white/3 rounded-lg text-sm">
          <p className="font-semibold text-slate-200 mb-2">Decision question:</p>
          <p className="text-slate-300/90">
            "Can the existing cable(s) be adjusted to their new required position by
            re-clamping, re-lashing, or sliding within the existing bracket assembly —
            without drilling new bolt holes or installing brackets at a new height?"
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li className="text-green-400"><strong>Yes</strong> → Reframe (faster, cheaper)</li>
            <li className="text-amber-400"><strong>No</strong> → Transfer (new brackets required)</li>
          </ul>
        </div>

        <SideBySide
          title="Reframe vs. Transfer: Side-by-Side Comparison"
          leftLabel="Reframe"
          rightLabel="Transfer"
          scenarios={[
            {
              id: 'what-it-does',
              aspect: 'What it does',
              left: 'Adjusts existing cables within their current bracket space. No new brackets; no new bolt holes.',
              right: 'Moves an existing cable to a new, higher position with new bracket hardware installed at the new height.',
            },
            {
              id: 'typical-distance',
              aspect: 'Typical adjustment distance',
              left: '1–6 inches. Small gaps opened by compressing existing cable spacing.',
              right: '6 inches to several feet. Larger moves that require new hardware at a materially different height.',
            },
            {
              id: 'time-cost',
              aspect: 'Time and cost',
              left: 'Faster and cheaper — no new hardware procurement, no new bolt holes, less crew time.',
              right: 'Slower and more expensive — new brackets purchased, new bolt holes drilled, old brackets removed, full height verification required.',
            },
            {
              id: 'when-applicable',
              aspect: 'When applicable',
              left: 'When existing cables have room to compress slightly, and the adjustment needed is small enough to achieve within existing bracket range.',
              right: 'When the required adjustment exceeds what existing hardware allows, when cables are already at minimum spacing, or when NESC compliance requires a new compliant height.',
            },
            {
              id: 'power-cables',
              aspect: 'Power utility cable involvement',
              left: 'If a power utility attachment can be reframed, still requires power utility crew — same as transfer.',
              right: 'Always requires power utility crew. No OTMR contractor can touch power attachments under any circumstances.',
            },
            {
              id: 'otmr',
              aspect: 'OTMR eligibility',
              left: 'Yes — reframe of private telecom cables is OTMR-eligible under 47 CFR §1.1411.',
              right: 'Yes for private telecom cables — OTMR applies. Multi-party required for ILEC and power attachments.',
            },
          ]}
        />

        <h3 className="mt-5 font-semibold">Example: when reframe is enough</h3>
        <p>
          Pole 33 has three cables in the communications space:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>Cable TV coax: 19 ft 2 in</li>
          <li>Telco drop wire: 19 ft 9 in</li>
          <li>Available space below cable TV coax: down to 18 ft 6 in (minimum per pole owner's standard)</li>
        </ul>
        <p className="mt-2 text-sm">
          The fiber design calls for an attachment at 18 ft 10 in. The cable TV coax at
          19 ft 2 in is 4 inches above the design height — close, but there's a 4-inch
          gap. If the cable TV coax can slide up 3 inches within its current bracket
          (to 19 ft 5 in), the fiber gets 7 inches of clearance at 18 ft 10 in — plenty.
          No new brackets needed. That's a reframe.
        </p>

        <h3 className="mt-5 font-semibold">Example: when reframe isn't enough and transfer is needed</h3>
        <p>
          On Pole 34, the same three cables exist, but now:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>Cable TV coax: 18 ft 1 in</li>
          <li>Telco drop wire: 18 ft 9 in</li>
          <li>Power neutral: 20 ft 3 in</li>
          <li>The coax bracket is already at its maximum height within the existing hardware</li>
        </ul>
        <p className="mt-2 text-sm">
          The fiber design still needs 18 ft 10 in. The cable TV coax at 18 ft 1 in is
          9 inches below the design height and its bracket is maxed out — reframe cannot
          get it any higher. A new bracket must be installed at 19 ft or higher, and the
          coax relocated to that new bracket. That's a transfer. The reframe window is
          closed; the project requires the full transfer process.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (FCC 18-111, industry practice):</strong> Reframe is a recognized
            make-ready action. The determination of whether reframe vs. transfer is needed
            is made by the make-ready engineer based on the pole audit data and attachment
            agreement specifications.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> "Reframe" and "transfer" aren't always labeled in field
            conversations. Crews often just say "we need to move this cable." The distinction
            matters for billing (reframe is cheaper) and for how the job is classified in the
            make-ready estimate. If an applicant is reviewing an MRE and sees "transfer" billed
            when a reframe would have sufficed, that's a billing dispute worth raising.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Power attachment reframe:</strong> Even if a power company's attachment
            needs only a 2-inch reframe, the power utility's crew must do it. OTMR contractors
            have zero authority to adjust energized conductors regardless of how minor the
            adjustment appears. This is a safety rule (NESC Rule 235 — communication-worker safety zone) and an operational rule
            (utility tariff) — both are enforced.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">The "triple-stack" problem</h3>
        <p>
          On heavily-loaded poles in dense areas, you may encounter a situation where
          multiple cables all need to reframe simultaneously to open space for a new
          attachment. This is sometimes called a "triple-stack" reframe — the telco
          cable slides up 2 inches, the cable TV cable slides up 4 inches, and the
          proposed fiber then fits in the gap at the bottom.
        </p>
        <p className="mt-2 text-sm">
          Triple-stack reframes are more complex to coordinate than simple reframes
          because each adjustment must be verified to not violate the minimum spacing
          requirements between cables. Utilities and cable companies often have attachment
          agreements specifying minimum vertical separation between cables — typically 6 to
          12 inches per the pole owner's attachment standard. Compressing three cables to
          open a 4-inch gap for fiber may violate the minimum separation between the
          top two cables after reframe.
        </p>
        <p className="mt-2 text-sm">
          When minimum separation rules prevent a triple-stack reframe, the options are:
          (1) a partial reframe + transfer of the bottommost cable, (2) a full multi-cable
          transfer, or (3) pole replacement if the height simply isn't available. The staker's
          report should identify which applies before any make-ready estimate is generated.
          (Source: NESC C2-2023 Rule 235, clearance between conductors of different circuits
          [confirm edition]; RUS 1751F-630 §8.)
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T08.L05 Check — Reframe vs. Transfer"
        mode="multiple-choice"
        questions={[
          {
            id: 'T08-L05-Q1',
            type: 'mc',
            prompt:
              'A cable TV coax needs to move up 3 inches to clear a new fiber attachment. The existing bracket can accommodate this adjustment without new hardware. What make-ready action is appropriate?',
            choices: [
              'Transfer — any vertical movement of a cable is a transfer',
              'Reframe — the adjustment can be made within the existing hardware without new brackets',
              'Pole replacement — a 3-inch move indicates the pole is near capacity',
              'No make-ready needed — 3 inches is within acceptable cable placement tolerance',
            ],
            answerIndex: 1,
            explanation:
              'Reframe is appropriate when the existing cable can be repositioned within its current bracket assembly without new hardware at a new height. A 3-inch adjustment that the existing bracket can accommodate is a classic reframe scenario — faster and cheaper than a transfer.',
            citation: 'FCC 18-111 (2018); industry practice.',
          },
          {
            id: 'T08-L05-Q2',
            type: 'mc',
            prompt:
              'A cable TV coax needs to move up 14 inches to clear the new fiber attachment. The existing bracket is already at maximum height. What make-ready action is required?',
            choices: [
              'Reframe — 14 inches is still within the range of what a reframe can accomplish',
              'Transfer — the adjustment exceeds the existing bracket\'s range; new hardware at a higher position is required',
              'Make-good — the cable needs to be replaced rather than moved',
              'No action — the pole owner is responsible for creating space without input from the applicant',
            ],
            answerIndex: 1,
            explanation:
              'When the adjustment required exceeds the existing bracket\'s range (or when the bracket is already at maximum), a transfer is necessary. A 14-inch move that cannot be accomplished within the existing hardware requires new brackets installed at the new height, old hardware removed, and the cable relocated — all the elements of a transfer.',
            citation: 'FCC 18-111 (2018); industry practice.',
          },
          {
            id: 'T08-L05-Q3',
            type: 'mc',
            prompt:
              'A power company neutral conductor needs to be adjusted 2 inches higher on a joint-use pole for a new fiber attachment. Can an OTMR contractor perform this reframe?',
            choices: [
              'Yes — a 2-inch reframe is minor and OTMR contractors are qualified for minor adjustments',
              'Yes — reframe is always OTMR-eligible, regardless of cable owner',
              'No — any adjustment to power utility attachments requires the power utility\'s own qualified crew',
              'No — the OTMR clock must expire before any power adjustment can be made',
            ],
            answerIndex: 2,
            explanation:
              'Power utility attachments — regardless of how small the adjustment — cannot be touched by OTMR telecom contractors. Power conductors are energized or de-energized by qualified utility linemen only. NESC Rule 235 (communication-worker safety zone) and utility tariff obligations both prohibit telecom contractors from adjusting power utility attachments. This rule applies to reframes as much as transfers.',
            citation: 'NESC C2-2023 Rule 235 [confirm edition]; FCC 18-111 (2018).',
          },
          {
            id: 'T08-L05-Q4',
            type: 'mc',
            prompt:
              'The primary reason reframe is faster and cheaper than a transfer is:',
            choices: [
              'Reframe does not require the FCC\'s OTMR approval process',
              'Reframe does not add new brackets or require new bolt holes — it adjusts existing hardware within its current position',
              'Reframe is performed by the pole owner\'s crew for free as part of the attachment agreement',
              'Reframe bypasses the 15-day clock requirement',
            ],
            answerIndex: 1,
            explanation:
              'Reframe is cheaper because it does not require new brackets to be procured and installed, no new bolt holes to be drilled into the pole, and no old hardware to be removed. The crew only needs to re-clamp or re-lash the existing cable at its slightly-adjusted position within the current bracket. Less hardware + less time = lower make-ready cost.',
            citation: 'Industry practice; FCC 18-111 (2018).',
          },
          {
            id: 'T08-L05-Q5',
            type: 'fill-in-blank',
            prompt:
              'The term for adjusting existing pole attachments within their current mounting space without new brackets is called a ____.',
            answer: 'reframe',
            answerDisplay: 'reframe',
            explanation:
              'Reframe (also called rearrangement by some pole owners) describes the process of adjusting existing cable positions within the current pole hardware — no new brackets, no new heights, just repositioning within the existing bracket\'s range. Reframe is the preferred make-ready action when the adjustment is small enough to accomplish without new hardware.',
          },
        ]}
      />


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          A reframe occupies a critical middle ground between simple attachment and full transfer — it resolves a clearance conflict by adjusting hardware position on the pole without moving the wire to a different pole or rerouting it along a new path. Whether a reframe is sufficient or a transfer (<strong>T08.L04</strong>) is required depends on the staker's measured attachment heights from <strong>T07.L04</strong> and the NESC clearance requirements from <strong>T05</strong>: if adjusting the position of a hardware bracket by 6 inches opens enough clearance for the new fiber while keeping the existing wire compliant, that's a reframe; if no position adjustment will satisfy the clearance rules without moving the wire, that's a transfer. The distinction matters under the complex-attachment classification from <strong>T08.L03</strong> because reframes and transfers carry different cost-allocation logic — reframes are generally borne by the entity that caused the conflict, but the hardware adjustment itself is cheaper and faster than a full wire transfer. After a reframe, the inspector in <strong>T13.L03</strong> measures the post-reframe attachment heights to verify compliance before the construction crew installs fiber at that pole.
        </p>
        <p className="text-slate-200 mt-3 text-sm italic">
          Correctly distinguishing a reframe from a transfer saves hours of field time and hundreds of dollars per structure — the staker's initial height measurement is the data that makes that distinction possible.
        </p>
      </section>
    </LessonLayout>
  );
}
