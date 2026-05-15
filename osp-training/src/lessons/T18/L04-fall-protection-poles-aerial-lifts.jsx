// Net-new — T18.L04 Fall Protection — Poles & Aerial Lifts
// Working lesson: 1910.268(g), positioning system vs PFAS, aerial lifts 1910.67

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import SideBySide from '../../components/primitives/SideBySide.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T18.L04',
  course_id: 'T18',
  title: 'Fall Protection — Poles & Aerial Lifts',
  order: 4,
  lesson_type: 'working',
  prerequisites: ['T18.L01'],
  vocabulary_introduced: [
    'lanyard',
    'self-retracting lifeline (SRL)',
    '100% tie-off',
    'positioning system',
    'aerial lift',
  ],
  key_terms: [
    {
      term: 'lanyard',
      definition:
        'The energy-absorbing connector between a worker\'s harness and an anchor point. Limits fall arrest forces to no more than 1,800 lbf at the body. Twin-leg lanyards (two lanyards in a Y-shape) allow 100% tie-off during transitions between anchor points.',
    },
    {
      term: 'self-retracting lifeline (SRL)',
      definition:
        'A fall protection device that automatically extends and retracts with worker movement and locks within 2–3 feet of a fall — limiting fall distance significantly compared to a standard 6-foot lanyard. Used where conventional lanyards create too much free-fall distance.',
    },
    {
      term: '100% tie-off',
      definition:
        'A policy requiring workers to maintain continuous connection to a fall protection anchor at all times — including during transitions between anchor points. Achieved with twin-leg lanyards or an SRL plus positioning strap combination: one connection is established before the other is released.',
    },
    {
      term: 'positioning system',
      definition:
        'A combination of a body belt or harness and a positioning lanyard (pole strap) that supports the worker at a work position on a pole, tower, or structure. Holds the worker in place for hands-free work. NOT a fall arrest device — it prevents falling while at the work position, but does not catch a fall. A separate PFAS (personal fall arrest system) is required if free-fall is possible.',
    },
    {
      term: 'aerial lift',
      definition:
        'Any vehicle-mounted or self-propelled extensible or articulating device used to elevate workers, including bucket trucks, boom lifts, and scissor lifts. Governed by 29 CFR 1910.67. Workers in aerial lift baskets must be attached to the basket or boom with a fall protection device at all times while elevated.',
    },
  ],
  vocabulary_assumed: [
    { term: 'hazard recognition', source_lesson_id: 'T18.L01' },
    { term: 'hierarchy of controls', source_lesson_id: 'T18.L01' },
    { term: '1910.268', source_lesson_id: 'T18.L01' },
  ],
  estimated_minutes: 25,
};

export default function T18L04_FallProtectionPolesAerialLifts() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Falls are the leading cause of death in construction and field work. On a pole, 30
          feet of air separates you from the ground. A misstep, a gaff that doesn't bite, a
          slipped strap — any of those can become a fatal fall in a fraction of a second. The
          right equipment, rigged correctly and used every time, is what separates a close call
          from a funeral.
        </p>
        <p className="mt-2">
          Two distinct situations call for fall protection on an OSP job: <strong>pole
          climbing</strong> and <strong>aerial lift (bucket truck) work</strong>. The rules
          are different for each. This lesson covers both — what the standard requires, what
          the equipment is, and the critical distinction between a positioning strap (which holds
          you at the work position) and a fall arrest system (which catches you if you fall).
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it does</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PFAS</td>
              <td className="px-3 py-2">Personal Fall Arrest System</td>
              <td className="px-3 py-2">Catches you after a fall — harness + lanyard/SRL + anchor. Limits arrest forces to ≤1,800 lbf.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SRL</td>
              <td className="px-3 py-2">Self-Retracting Lifeline</td>
              <td className="px-3 py-2">Auto-extends/retracts with movement; locks within 2–3 ft of a fall. Shorter fall distance than a 6-ft lanyard.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CFR 1910.268(g)</td>
              <td className="px-3 py-2">Telecom standard — fall protection on poles</td>
              <td className="px-3 py-2">Requires fall protection when working more than 4 ft above ground on poles and towers</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CFR 1910.67</td>
              <td className="px-3 py-2">Aerial lift standard</td>
              <td className="px-3 py-2">Requires PFAS or travel restraint system when elevated in an aerial lift basket or on a boom</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The 4-foot rule — when protection is required on poles</h3>
        <p className="mt-2">
          Under 29 CFR 1910.268(g)(1), fall protection is required when working more than
          <strong> 4 feet above ground</strong> on a pole, tower, or structure. That's the
          general-industry trigger for telecom work. (For comparison: the construction standard
          under 29 CFR 1926 Subpart M triggers fall protection at 6 feet — a different number
          for a different industry classification.)
        </p>
        <p className="mt-2">
          The "4-foot above ground" trigger for fall protection at the work position does NOT
          mean you must be tied off every step of the climb. OSHA's interpretation letter
          dated 2012-08-27 clarifies that 1910.268 generally permits employees to free-climb to
          their work position on a pole — the fall protection requirement applies AT the work
          position, where the worker stops and performs their task.
        </p>

        {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
        <Flashcard
          deckId="T18-L04"
          cards={[
            {
              id: 'T18-L04-fc-lanyard',
              front: 'What is a lanyard in fall protection?',
              back: 'The energy-absorbing connector between a worker\'s harness and an anchor point. Limits fall arrest forces to no more than 1,800 lbf. Twin-leg lanyards allow 100% tie-off during transitions between anchor points.',
            },
            {
              id: 'T18-L04-fc-srl',
              front: 'What is a self-retracting lifeline (SRL)?',
              back: 'A fall protection device that automatically extends and retracts with worker movement and locks within 2–3 feet of a fall — limiting fall distance significantly compared to a standard 6-foot lanyard.',
            },
            {
              id: 'T18-L04-fc-100-tieoff',
              front: 'What is 100% tie-off?',
              back: 'A policy requiring continuous connection to a fall protection anchor at all times, including during transitions. Achieved with twin-leg lanyards: one leg connects to the new anchor before the other disconnects from the old anchor — no gap in fall protection.',
            },
            {
              id: 'T18-L04-fc-positioning',
              front: 'What is a positioning system, and why is it NOT a fall arrest system?',
              back: 'A combination of a body belt/harness and positioning lanyard (pole strap) that holds the worker at a work position on a pole. It supports the worker hands-free at the position but does NOT catch a fall — if the strap or gaff slips and the worker falls, a separate PFAS is required to arrest the fall.',
            },
            {
              id: 'T18-L04-fc-aerial-lift',
              front: 'What is an aerial lift, and what does 29 CFR 1910.67 require?',
              back: 'Any vehicle-mounted or self-propelled device used to elevate workers (bucket truck, boom lift, scissor lift). 29 CFR 1910.67(c)(2)(v) requires workers to be attached to the basket or boom with a PFAS or travel restraint system at all times while elevated.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Positioning System vs. Personal Fall Arrest System</h2>

        <p>
          This is the most critical distinction in pole fall protection. Many telecom crews
          have used body belts and pole straps for decades without incident — but there is a
          specific scenario where the positioning strap fails to protect a worker, and it
          happens often enough to be worth understanding precisely.
        </p>

        <p className="mt-2">
          A <strong>positioning system</strong> (body belt + pole strap) works by holding you
          against the pole at your work position. The pole strap wraps around the pole and
          attaches to D-rings on your body belt. As long as you're leaning back against the
          strap with your weight on it, you're supported. But if you lose your footing (a gaff
          slips, the wood is rotten, an insect distraction), your weight suddenly shifts — and
          if the strap itself slips or the gaff puncture doesn't hold, you are in free fall
          before the positioning system can do anything. The positioning strap was never
          designed to catch a fall from a pole — it was designed to prevent one by keeping you
          in contact with the pole.
        </p>

        <p className="mt-2">
          A <strong>PFAS (Personal Fall Arrest System)</strong> arrests a fall after it starts.
          It consists of a full-body harness, an energy-absorbing lanyard or SRL, and an anchor
          point. If you fall, the system stops your descent within the system's maximum free-fall
          distance (typically 6 feet for a standard lanyard), with the shock-absorbing lanyard
          limiting the peak force on your body to no more than 1,800 lbf.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (29 CFR 1910.268(g) + ANSI Z359 standards):</strong> The modern standard
            recommends full-body harnesses over body belts for fall arrest because body belts can
            cause serious internal injuries during a long fall arrest — the body folds over the
            belt, concentrating force on the abdomen. Body belts are still allowed for positioning
            (holding the worker at the work position) but not for fall arrest.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Most OSP telecom crews use the body belt + pole strap
            combination that has been standard for 40+ years. Many experienced climbers have never
            worn a full-body harness on a pole. The body belt is comfortable, efficient, and
            familiar. The gap: when using only a body belt and pole strap, you have a positioning
            system — not a fall arrest system. If you fall (gaff slip, bad wood, loss of balance),
            the body belt will either: (a) hold you if the pole strap catches the fall (which it
            can do at short distances but may concentrate force on the abdomen), or (b) fail to
            arrest the fall if the strap also slips. Crews who upgrade to a harness + pole strap
            + secondary PFAS lanyard have both positioning AND fall arrest capability. OSHA
            1910.268(g) technically still allows the body belt for positioning work. The safety
            community increasingly recommends the harness-and-secondary-arrest combination.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Aerial lifts — 29 CFR 1910.67 rules</h3>
        <p className="mt-2">
          29 CFR 1910.67(c)(2)(v) requires workers to wear and be attached to a PFAS or travel
          restraint system when elevated in an aerial lift basket or on a boom. The key rules:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm text-slate-300/90">
          <li>
            <strong>Attachment point:</strong> PFAS attaches to the boom or basket — NOT to a
            fixed structure adjacent to the work area. Attaching to a fixed structure would pull
            the worker out of the basket if the truck moves.
          </li>
          <li>
            <strong>Body belt vs. harness:</strong> Body belts are not acceptable for aerial lift
            fall arrest — they do not distribute arrest forces properly. Full-body harness is required.
          </li>
          <li>
            <strong>Never belt off to the pole:</strong> Attaching a lanyard from the basket to the
            pole you're working on is a common but illegal shortcut. If the truck shifts or the boom
            retracts while you're attached to the pole, you can be pulled out of the basket or crushed.
          </li>
          <li>
            <strong>Travel restraint alternative:</strong> A travel restraint system prevents the
            worker from reaching the edge of the basket — it's shorter than a fall arrest lanyard
            and is sized to prevent a fall from occurring rather than arrest one after it starts.
          </li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: 29 CFR 1910.67(c)(2)(v) — Aerial lifts (ecfr.gov); 29 CFR 1910.268(g)(1) —
          Pole climbing fall protection (osha.gov + OSHA interpretation letter 2012-08-27).
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Free-Climb Allowance — Where It Starts and Stops</h2>
        <p>
          The 2012 OSHA interpretation letter makes this explicit: "1910.268 generally permits
          employees to free climb to work locations on poles and towers without the use of fall
          protection equipment." This means climbing the pole to reach the work position does not
          require fall protection to be applied during the climb itself.
        </p>
        <p className="mt-2">
          The protection requirement begins AT the work position — when the worker stops climbing
          and begins performing their task. At that point, fall protection (positioning strap,
          or positioning + PFAS) must be in place before work begins.
        </p>
        <p className="mt-2">
          Common misreading: "free climb permitted" means no fall protection is ever needed on a
          pole. That is wrong. Free-climb permission covers the movement up the pole; fall protection
          is required at the work station. If a crew member is performing any hands-on task at a
          position more than 4 feet above ground without fall protection, that is an OSHA violation —
          even if the task is only expected to take 30 seconds.
        </p>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: 29 CFR 1910.268(g)(1) (osha.gov); OSHA interpretation letter 2012-08-27
          (osha.gov/laws-regs/standardinterpretations/2012-08-27).
        </p>
      </section>

      {/* ── ANNOTATED DIAGRAM ────────────────────────────────────────────── */}
      <AnnotatedDiagram
        title="Pole Worker Fall Protection Setup"
        description="A utility pole climber at a work position showing both positioning system components and PFAS. Click each labeled element to understand its function and requirements."
        src="/training/diagrams/pole-fall-protection.svg"
        alt="Diagram of a worker on a utility pole showing body harness, positioning strap (pole strap), secondary fall arrest lanyard, gaff spurs, and anchor points"
        aspectRatio={1.4}
        hotPoints={[
          {
            id: 'harness',
            x: 50,
            y: 28,
            label: 'Full-body harness',
            type: 'click',
            explanation:
              'Distributes fall arrest forces across the chest, shoulders, and thighs. Required for fall arrest applications (body belts are not acceptable for arrest — only for positioning). The harness connects to both the positioning strap and the PFAS lanyard via separate D-rings.',
          },
          {
            id: 'pole-strap',
            x: 35,
            y: 45,
            label: 'Positioning strap (pole strap)',
            type: 'click',
            explanation:
              'A leather or synthetic strap that wraps around the pole and attaches to the harness D-rings. Holds the worker against the pole for hands-free work at the work position. This is a POSITIONING device — it supports you while you\'re at the work station. It is NOT a fall arrest device by itself.',
          },
          {
            id: 'pfas-lanyard',
            x: 65,
            y: 48,
            label: 'PFAS lanyard (secondary)',
            type: 'click',
            explanation:
              'A secondary connection above the positioning strap anchor, connected to the harness\'s dorsal D-ring. This is the fall ARREST connection. If the positioning strap slips or a gaff pull-out occurs, the PFAS lanyard limits the free-fall distance and absorbs the arrest force.',
          },
          {
            id: 'gaffs',
            x: 50,
            y: 82,
            label: 'Gaff spurs',
            type: 'click',
            explanation:
              'Metal spurs strapped to the lower leg and boot that bite into the pole wood to support the worker\'s weight during climbing and at the work position. Gaff pull-out (the gaff losing its bite in the wood) is a common cause of falls. Inspect for sharpness before each climb; blunt gaffs are a primary fall hazard.',
          },
        ]}
      />

      {/* ── SIDE-BY-SIDE COMPARISON ──────────────────────────────────────── */}
      <SideBySide
        title="Positioning System vs. Personal Fall Arrest System (PFAS)"
        description="Both protect workers at height, but they work differently and cover different scenarios. Most pole workers should use both together."
        leftTitle="Positioning System (pole strap + belt)"
        rightTitle="Personal Fall Arrest System (PFAS)"
        highlight="Falls from work position"
        comparisonRows={[
          {
            label: 'Purpose',
            leftValue: 'Holds worker in place at the work position for hands-free work. Prevents the worker from moving out of position.',
            rightValue: 'Arrests a fall after it begins. Stops descent within the system\'s rated free-fall distance.',
          },
          {
            label: 'Body attachment',
            leftValue: 'Body belt (traditional) or body harness. Belt distributes force at waist.',
            rightValue: 'Full-body harness required. Distributes arrest forces across chest, shoulders, and thighs.',
          },
          {
            label: 'Falls from work position',
            leftValue: 'NOT designed to arrest a fall. If positioning strap slips, worker is in free fall.',
            rightValue: 'YES — designed to stop a fall. Limits free-fall to ≤6 ft (lanyard) or 2–3 ft (SRL). Limits peak force to ≤1,800 lbf.',
            note: 'This is the critical distinction. A positioning strap that slips does not catch you — only a PFAS does.',
          },
          {
            label: 'OSHA acceptability (1910.268)',
            leftValue: 'Still allowed for positioning work under 1910.268(g). Body belt acceptable for positioning.',
            rightValue: 'Required if free-fall arrest is needed. Body belt NOT acceptable for fall arrest.',
          },
          {
            label: 'Field practice',
            leftValue: 'Body belt + pole strap is the 40-year OSP standard. Widely used, comfortable, efficient.',
            rightValue: 'Full-body harness + pole strap + PFAS lanyard is the modern recommended combination. Provides both positioning and fall arrest.',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T18.L04 Check — Fall Protection"
        mode="multiple-choice"
        questions={[
          {
            id: 'T18-L04-Q1',
            type: 'mc',
            prompt:
              'Under 29 CFR 1910.268(g)(1), fall protection is required when working on a pole at what height above ground?',
            choices: [
              '6 feet (same as construction industry)',
              '10 feet',
              '4 feet',
              'Fall protection is required only when using a bucket truck',
            ],
            answerIndex: 2,
            explanation:
              '29 CFR 1910.268(g)(1) — the telecommunications standard — triggers the fall protection requirement at more than 4 feet above ground. This differs from 29 CFR 1926 Subpart M (construction), which triggers at 6 feet. Telecom OSP work falls under 1910 (general industry), not 1926 (construction), so the 4-foot trigger applies.',
            citation: '29 CFR 1910.268(g)(1) (osha.gov; OSHA interpretation letter 2012-08-27).',
          },
          {
            id: 'T18-L04-Q2',
            type: 'mc',
            prompt:
              'A worker\'s body belt and pole strap are the ONLY fall protection they\'re using at the work position on a 40-foot pole. The gaff on the right leg pulls out of the rotten pole wood. What happens?',
            choices: [
              'The pole strap (positioning system) automatically arrests the fall by holding the worker against the pole',
              'The body belt automatically deploys an energy-absorbing lanyard to arrest the fall',
              'The positioning system may not catch the fall — only a PFAS (full-body harness + arrest lanyard) provides fall arrest protection',
              'The 4-foot rule means fall protection isn\'t required at 40 feet — the height threshold is for when to start using gear, not for the type of gear',
            ],
            answerIndex: 2,
            explanation:
              'A positioning system (body belt + pole strap) is designed to hold the worker at the work position — not to arrest a fall. If the gaff pulls out and the body shifts suddenly, the positioning strap may slip rather than catch the fall. Only a PFAS — full-body harness connected to an energy-absorbing lanyard or SRL anchored above the worker — is designed to arrest a fall and limit the arrest force to ≤1,800 lbf.',
            citation: '29 CFR 1910.268(g)(1); ANSI Z359.11 body belt restrictions.',
          },
          {
            id: 'T18-L04-Q3',
            type: 'fill-in-blank',
            prompt:
              'When working in a bucket truck aerial lift, OSHA 29 CFR 1910.67 requires that the worker\'s fall protection lanyard be attached to the ____.',
            answer: 'boom or basket',
            answerDisplay: 'boom or basket (of the aerial lift)',
            explanation:
              'Attaching to the boom or basket (not to an external structure) ensures the fall protection travels with the worker if the truck moves. Attaching to a fixed structure (pole, crossarm, anchor outside the basket) can pull the worker out of the basket if the truck repositions — a common and fatal error. The attachment point must stay with the lift.',
            citation: '29 CFR 1910.67(c)(2)(v) (ecfr.gov).',
          },
          {
            id: 'T18-L04-Q4',
            type: 'mc',
            prompt:
              'OSHA\'s 2012 interpretation letter on 29 CFR 1910.268 states that telecom workers "generally may free-climb" to their work position. This means:',
            choices: [
              'No fall protection is required at any point on a utility pole',
              'Fall protection is required at all times during both climbing and at the work position',
              'Fall protection is required at the work position but climbing to reach the position may be done without fall protection',
              'Free-climbing is permitted only for poles shorter than 30 feet',
            ],
            answerIndex: 2,
            explanation:
              'The OSHA 2012 interpretation letter is explicit: 1910.268 permits employees to free-climb to work positions on poles without fall protection during the climb itself. However, fall protection is required at the work position — where the worker stops and performs their task — if that position is more than 4 feet above ground. Free-climb covers movement; protection is required at the station.',
            citation: 'OSHA interpretation letter 2012-08-27 (osha.gov/laws-regs/standardinterpretations/2012-08-27).',
          },
        ]}
      />

    </LessonLayout>
  );
}
