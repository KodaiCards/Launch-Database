// Net-new — T06.L09 NESC Underground Rules §32, §35
// Advanced lesson: NESC §32 (direct-buried cable), §35 (cables in conduit),
// supply-communication separation underground, communication-to-ground clearance.
// Sources: RUS 1751F-635 (summarizes NESC clauses); NESC C2-2023 §32/§35 [confirm edition]

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T06.L09',
  course_id: 'T06',
  title: 'NESC Underground Rules — §32 and §35',
  order: 9,
  lesson_type: 'advanced',
  prerequisites: [
    'T06.L01', 'T06.L02', 'T06.L03',
    'T06.L04', 'T06.L05', 'T06.L06',
    'T06.L07', 'T06.L08',
  ],
  learning_objectives: [
    'Identify the two NESC underground rules and what each covers',
    'Explain why cable in conduit (§35) is more permissive than direct-buried cable (§32)',
    'Apply the supply-to-communication separation requirement for underground crossings and parallel runs',
    'Recognize when a field crew should call for a locate even when NESC technically allows close separation',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'NESC §32',
    'NESC §35',
    'supply-communication separation',
    'communication-to-ground clearance',
  ],
};

export const vocabulary_introduced = {
  'NESC §32': 'The section of the National Electrical Safety Code (NESC C2 [confirm edition]) that governs direct-buried communication cable — cable installed in the ground without a conduit. §32 sets minimum cover depths for direct-buried cable, required mechanical protection at road crossings and grade changes, and minimum separation distances from electric supply cables that are also direct-buried. Direct-buried communication cable is inherently more vulnerable to damage than cable in conduit, so §32 imposes stricter rules than §35.',
  'NESC §35': 'The section of the NESC (C2 [confirm edition]) that governs communication cables installed in conduit. Because the conduit provides a physical barrier between the communication cable and the surrounding environment (including electric supply cables), §35 is more permissive than §32 in several areas: shallower separation from direct-buried supply cables is permitted at crossings, because the conduit reduces the contact risk. §35 also specifies rules for conduit markers and bore-path documentation.',
  'supply-communication separation': 'The minimum horizontal or vertical distance required between an electric supply cable and a communication cable when they are installed underground in the same corridor. NESC defines two situations: (1) crossing — supply and communication cross each other at approximately 90°; (2) parallel run — supply and communication run alongside each other in the same trench or corridor. Separation requirements differ for each situation and depend on whether the communication cable is direct-buried (§32) or in conduit (§35).',
  'communication-to-ground clearance': 'The minimum depth at which a communication cable or conduit must be installed below finished grade to provide protection from surface disturbance (lawn aeration, agricultural tilling, frost heave, construction activity). NESC and RUS 1751F-635 both specify cover requirements; the AHJ (authority having jurisdiction) may require greater depth for local conditions. [confirm current NESC C2 edition clause with AHJ at time of design]',
};

export const vocabulary_assumed = [
  { term: 'NESC', source_lesson_id: 'T05.L01' },
  { term: 'conduit', source_lesson_id: 'T06.L03' },
  { term: 'AHJ', source_lesson_id: 'T06.L02' },
  { term: 'minimum cover', source_lesson_id: 'T06.L02' },
  { term: 'foreign utility', source_lesson_id: 'T06.L06' },
];

export const key_terms = Object.entries(vocabulary_introduced).map(([term, definition]) => ({
  term,
  definition,
}));

export default function T06L09_NESCUndergroundRules() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When you install fiber underground, you are working in the same space as electric
          power cables. Some of those power cables are just a few inches away from where your
          conduit or direct-buried fiber runs. The NESC (National Electrical Safety Code)
          sets the rules for how close is too close.
        </p>
        <p className="mt-2">
          Two NESC sections matter for underground fiber design:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>
            <strong>§32 — Direct-buried cable.</strong> This is fiber (or any communication
            cable) laid directly in the ground without a conduit. Stricter rules apply because
            there's nothing between the cable and a nearby power line except dirt.
          </li>
          <li>
            <strong>§35 — Cable in conduit.</strong> This is fiber inside a plastic conduit.
            The conduit acts as a physical barrier, which is why §35 is somewhat more permissive
            — the conduit adds protection. Most OSP fiber installations today use conduit, so
            §35 is the more common rule in practice.
          </li>
        </ul>
        <p className="mt-2">
          Both sections specify: how deep the cable must be buried, how far it must stay from
          electric supply cables, and what marking or protection is required.
        </p>
        <p className="mt-2 text-sm text-slate-300/70">
          Note: NESC is a paywalled standard (NESC C2 [confirm edition] published by IEEE).
          The values and rules referenced in this lesson are derived from RUS 1751F-635,
          which summarizes the applicable NESC requirements for RUS-funded projects.
          Designers working on non-RUS projects should verify directly against the current
          NESC edition. [confirm edition with AHJ at time of design]
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in context</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code</td>
              <td className="px-3 py-2">The code that sets safety rules for electric utility construction, including underground separation</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">AHJ</td>
              <td className="px-3 py-2">Authority Having Jurisdiction</td>
              <td className="px-3 py-2">The local agency (state DOT, county, utility commission) that can impose requirements stricter than NESC minimums</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service</td>
              <td className="px-3 py-2">Federal program; RUS 1751F-635 summarizes NESC underground rules for RUS-funded projects</td>
            </tr>
          </tbody>
        </table>

        {/* Key Terms Flashcards */}
        <Flashcard
          deckId="T06-L09"
          cards={[
            {
              id: 'T06-L09-fc-s32',
              front: 'What does NESC §32 cover?',
              back: 'The section of the National Electrical Safety Code (NESC C2 [confirm edition]) that governs direct-buried communication cable — cable installed in the ground without a conduit. §32 sets minimum cover depths for direct-buried cable, required mechanical protection at road crossings and grade changes, and minimum separation distances from electric supply cables that are also direct-buried. Direct-buried communication cable is inherently more vulnerable to damage than cable in conduit, so §32 imposes stricter rules than §35.',
            },
            {
              id: 'T06-L09-fc-s35',
              front: 'What does NESC §35 cover and why is it more permissive than §32?',
              back: 'The section of the NESC (C2 [confirm edition]) that governs communication cables installed in conduit. Because the conduit provides a physical barrier between the communication cable and the surrounding environment (including electric supply cables), §35 is more permissive than §32 in several areas: shallower separation from direct-buried supply cables is permitted at crossings, because the conduit reduces the contact risk. §35 also specifies rules for conduit markers and bore-path documentation.',
            },
            {
              id: 'T06-L09-fc-sep',
              front: 'What is supply-communication separation underground?',
              back: 'The minimum horizontal or vertical distance required between an electric supply cable and a communication cable when they are installed underground in the same corridor. NESC defines two situations: (1) crossing — supply and communication cross each other at approximately 90°; (2) parallel run — supply and communication run alongside each other in the same trench or corridor. Separation requirements differ for each situation and depend on whether the communication cable is direct-buried (§32) or in conduit (§35).',
            },
            {
              id: 'T06-L09-fc-cover',
              front: 'What is communication-to-ground clearance for underground cable?',
              back: 'The minimum depth at which a communication cable or conduit must be installed below finished grade to provide protection from surface disturbance (lawn aeration, agricultural tilling, frost heave, construction activity). NESC and RUS 1751F-635 both specify cover requirements; the AHJ (authority having jurisdiction) may require greater depth for local conditions. [confirm current NESC C2 edition clause with AHJ at time of design]',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>NESC §32 and §35 — What They Actually Require</h2>

        <h3 className="mt-4 font-semibold">§32: Direct-buried communication cable</h3>
        <p>
          NESC §32 applies when your fiber or communication cable has no conduit — the cable
          jacket is in direct contact with the soil. In RUS-program work, direct-buried cable
          is less common than conduit installs, but it does occur for short drops to premises
          (the service drop from the distribution pedestal to the house) and for some budget
          distribution routes in areas with low construction cost.
        </p>
        <p className="mt-2">
          Key §32 requirements (per RUS 1751F-635, which references NESC C2 [confirm current
          edition] for direct-buried communication work):
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>
            <strong>Minimum cover:</strong> 12 inches for direct-buried communication cable
            in non-traffic areas. This is a NESC floor — RUS 1751F-635 and most AHJs require
            18–24 inches in practice. Under roads: typically 24–36 inches.
            [confirm current NESC C2 §32 cover clause]
          </li>
          <li>
            <strong>Separation from direct-buried electric supply at crossings:</strong> Where
            a direct-buried communication cable crosses a direct-buried supply cable, NESC §32
            requires at minimum 12 inches of vertical separation. In practice, a protective
            board (6-inch concrete board or plastic channel cover) over the communication cable
            at the crossing is standard protection.
            [confirm current NESC C2 §32 crossing separation clause]
          </li>
          <li>
            <strong>Parallel separation from electric supply:</strong> In the same trench
            or within the same ROW corridor, direct-buried communication cables should be
            placed a minimum of 12 inches horizontally from direct-buried electric supply
            cables. In a shared trench, the communication cable is typically placed in a
            separate sub-trench or on the opposite side of the trench from supply.
            [confirm current NESC C2 §32 parallel separation clause]
          </li>
          <li>
            <strong>Road and driveway crossings:</strong> Direct-buried communication cable
            must be in conduit for road crossings (most AHJs require this regardless of NESC
            minimum cover). The conduit provides the physical protection that the cable's
            jacket alone cannot.
          </li>
        </ul>

        <h3 className="mt-5 font-semibold">§35: Communication cables in conduit</h3>
        <p>
          NESC §35 applies when your fiber cable is inside a conduit — the standard for the
          vast majority of RUS-program underground distribution plant. The conduit wall
          provides physical isolation from surrounding utilities, which is why §35 has
          somewhat more relaxed separation requirements than §32.
        </p>
        <p className="mt-2">
          Key §35 requirements (per RUS 1751F-635 [confirm current NESC C2 §35]):
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>
            <strong>Minimum cover for conduit:</strong> 18 inches in most residential
            non-traffic areas. Conduit's plastic wall provides some protection that direct-buried
            cable does not, but cover depth is still required for frost protection and equipment
            damage protection. Under roads: 24–36 inches, same as direct-buried.
            [confirm current NESC C2 §35 cover clause]
          </li>
          <li>
            <strong>Separation at crossings from direct-buried supply:</strong> At a crossing,
            the communication conduit's plastic wall provides separation. NESC §35 allows
            closer separation at crossings compared to §32 for direct-buried cable, because
            the conduit prevents direct contact. A protective separation board is still
            recommended practice even where §35 doesn't strictly require it.
            [confirm current NESC C2 §35 crossing separation clause]
          </li>
          <li>
            <strong>Separation in parallel runs:</strong> When communication conduit runs
            parallel to electric supply (same trench or adjacent), NESC §35 requires that
            the conduits be separated by at least 6 inches at parallel runs in the same
            corridor. This is the most common design situation for fiber distribution routes
            that share a road ROW with existing electric plant.
            [confirm current NESC C2 §35 parallel separation clause]
          </li>
          <li>
            <strong>Conduit marking:</strong> §35 requires that conduit installed underground
            be identifiable at service access points. In practice: warning tape buried 6–12
            inches above the conduit at all installations (red for electric, yellow for gas,
            orange for telecom/fiber — APWA Uniform Color Code), and conduit markings (printed
            text on HDPE conduit identifying the owner and cable type). (Source: APWA
            Utility Color Code; RUS 1751F-635 §6.)
          </li>
        </ul>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> NESC §35 allows communication conduit and direct-buried
            supply cable to be as close as 6 inches at a crossing, because the conduit reduces
            the contact risk. [confirm current edition]
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Most RUS and utility-program field crews use 12 inches
            of vertical separation as a working minimum at crossings, even when §35 technically
            allows less. The reasoning: locates are not always accurate (±18-inch tolerance
            is typical for most locate services), and the crew on the bore can't see the
            existing supply cable. Running 12 inches instead of 6 inches at a crossing is
            cheap insurance against a utility strike. The extra 6 inches of separation costs
            nothing on a conduit bore — adjust the bore profile slightly, and you're done.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The risk of confusing them:</strong> If a designer assumes "6 inches is
            fine per §35" and the bore crew doesn't have an accurate locate, the bore could
            run at 6 inches from an unlabeled supply conductor. A frac-out at that point
            could bring the drill bit into contact with the power cable — a potentially
            fatal utility strike. Designing to 12 inches as the minimum covers the locate
            error tolerance and the NESC minimum simultaneously.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Marking and documentation requirements</h3>
        <p>
          Both §32 and §35 require that the installed cable or conduit be documented so
          that future excavators can locate it. The documentation chain includes:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Warning tape.</strong> Orange or white warning tape ("CAUTION —
            COMMUNICATION CABLE BELOW") buried 6–12 inches above the conduit or cable run.
            Tape intercepts a shovel before it hits the cable. (Orange = telecom per APWA
            Color Code; white = proposed installation marker during design.) (Source: APWA
            Utility Color Code; CGA Best Practices v19.)
          </li>
          <li>
            <strong>Conduit printing.</strong> HDPE conduit is typically printed with the
            owner's name, cable type ("FIBER OPTIC"), and year of installation at regular
            intervals on the conduit exterior. This identifies the conduit when it's
            encountered during excavation — even years after installation.
          </li>
          <li>
            <strong>As-built documentation.</strong> The designer must provide as-built
            drawings showing the final installed route, depth at key points (road crossings,
            utility crossings, changes in cover depth), and the location of all pedestals
            and splice points. As-builts are submitted to the client, to the state
            one-call center (for 811 locate records), and to any applicable RUS loan
            documentation package. (Source: RUS 1751F-635 §11; 47 CFR §32.2210 for plant
            account records.)
          </li>
        </ol>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: When Supply and Communication Must Share Space</h2>

        <h3 className="mt-4 font-semibold">Shared-trench design for joint-use corridors</h3>
        <p>
          Some RUS projects install both electric and fiber plant simultaneously in a joint
          trench. This reduces ROW disturbance and construction cost but requires careful
          design to meet both NESC §32/§35 and RUS 1751F-635 separation requirements
          simultaneously.
        </p>
        <p className="mt-2">
          In a shared trench, the standard approach is:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>Electric supply at maximum trench depth (deepest zone — typically 24–36 inches in residential)</li>
          <li>Communication conduit at the minimum allowable depth above the supply, with the required separation maintained</li>
          <li>Warning tape at 6–12 inches above each cable type separately</li>
          <li>No crossings of supply over communication within the trench — maintain parallel separation from the entry to the exit pit</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          Important: shared trenches require coordination with the electric utility before
          construction. They must approve the trench design, specify their own required depths,
          and confirm that their cables' insulation rating is compatible with the shared trench.
          Do not assume shared-trench approval just because the physical space is available.
          [confirm with AHJ and electric utility before design]
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T06.L09 Check — NESC Underground Rules"
        mode="multiple-choice"
        questions={[
          {
            id: 'T06-L09-Q1',
            type: 'mc',
            prompt: 'NESC §32 applies to which type of communication cable installation?',
            choices: [
              'Communication cable installed in a conduit',
              'Communication cable installed directly in the ground without conduit',
              'Communication cable attached to aerial poles',
              'Communication cable inside a manhole or vault',
            ],
            answerIndex: 1,
            explanation: 'NESC §32 governs direct-buried communication cable — cable in direct contact with the soil, without a conduit. §35 covers cable in conduit. Most OSP fiber distribution uses conduit (§35), but service drops and some distribution routes may be direct-buried (§32). (Source: RUS 1751F-635, referencing NESC C2 [confirm edition].)',
          },
          {
            id: 'T06-L09-Q2',
            type: 'mc',
            prompt: 'Why is NESC §35 (cable in conduit) more permissive than §32 (direct-buried) for supply-communication separation at crossings?',
            choices: [
              'Because conduit installations are always deeper than direct-buried installations',
              'Because the conduit wall provides a physical barrier that reduces the risk of contact between the communication cable and nearby supply cables',
              'Because §35 covers only low-voltage supply environments',
              'Because conduit installations require warning tape, which reduces the need for physical separation',
            ],
            answerIndex: 1,
            explanation: 'The conduit is a physical barrier. If a supply cable and a communication conduit are 6 inches apart at a crossing, the plastic conduit wall prevents the communication fiber from coming into contact with the supply cable\'s insulation or sheath. Without conduit (§32), the communication cable\'s jacket is the only separator — which provides far less protection. (Source: RUS 1751F-635; NESC C2 [confirm edition].)',
          },
          {
            id: 'T06-L09-Q3',
            type: 'mc',
            prompt: 'A bore crew is installing communication conduit under a road where a direct-buried electric supply cable crosses at a 90° angle. What is the MINIMUM field practice separation recommended at this crossing?',
            choices: [
              '3 inches',
              '6 inches',
              '12 inches',
              '24 inches',
            ],
            answerIndex: 2,
            explanation: 'While NESC §35 may permit as little as 6 inches at a crossing for conduit (conduit provides the barrier), field practice is to maintain 12 inches of vertical separation at crossings. The reasoning: utility locate tolerance is typically ±18 inches, meaning the existing supply cable could be 6–18 inches from where it\'s marked. Designing to 12 inches covers the locate error plus the NESC minimum simultaneously. (Source: field practice per CGA Best Practices v19; RUS 1751F-635.)',
          },
          {
            id: 'T06-L09-Q4',
            type: 'mc',
            prompt: 'APWA orange warning tape buried above a communication conduit serves what purpose?',
            choices: [
              'It conducts electricity to the surface so locate equipment can find the conduit',
              'It intercepts a shovel or drill bit before it hits the conduit, warning the excavator that communication infrastructure is below',
              'It provides the minimum required separation between the communication conduit and electric supply cables',
              'It marks the conduit entry points for future HDD re-bore operations',
            ],
            answerIndex: 1,
            explanation: 'Warning tape is buried 6–12 inches above the conduit (much shallower than the conduit itself). If an excavator is digging and hits the tape, they see "CAUTION — COMMUNICATION CABLE BELOW" before the shovel or bucket reaches the actual conduit. The tape doesn\'t provide separation or electrical conductivity — it\'s a visual warning intercepting the excavation before it reaches the cable. (Source: APWA Utility Color Code; CGA Best Practices v19.)',
          },
          {
            id: 'T06-L09-Q5',
            type: 'mc',
            prompt: 'A designer is laying out an underground fiber route that will run parallel to an existing direct-buried electric supply cable for 400 feet in the same ROW corridor. Both are under a residential street ROW. Which NESC section primarily governs the separation requirement, and why?',
            choices: [
              'NESC §32, because the existing electric supply cable is direct-buried — both cables\' installation types define which section applies',
              'NESC §35, because the communication cable is in conduit — the communication cable\'s installation type determines which NESC section applies to it',
              'NESC §23, because this is an aerial clearance situation, not an underground one',
              'Neither section applies to parallel runs — NESC only governs crossings',
            ],
            answerIndex: 1,
            explanation: 'The NESC section applied to a communication cable is determined by how the COMMUNICATION cable is installed — not by how the nearby supply cable is installed. Since the fiber is in conduit, §35 applies to the fiber installation. §35 governs the minimum separation between the communication conduit and any supply infrastructure (direct-buried or in conduit) that runs parallel or crossing it. (Source: RUS 1751F-635; NESC C2 [confirm edition].)',
          },
          {
            id: 'T06-L09-Q6',
            type: 'mc',
            prompt: 'Scenario: You\'re reviewing a design where communication conduit runs in the same trench as a residential electric supply at 18 inches cover. The designer shows 4 inches of horizontal separation in the parallel trench. Is this acceptable per NESC §35 and field best practice?',
            choices: [
              'Yes — 4 inches is acceptable because NESC §35 only requires 3 inches for conduit-to-conduit',
              'No — NESC §35 requires at minimum 6 inches of separation for parallel conduit runs in the same corridor, and field practice recommends 12 inches',
              'Yes — separation only matters at crossings, not parallel runs',
              'No — communication conduit cannot share a trench with electric supply under any circumstances',
            ],
            answerIndex: 1,
            explanation: 'NESC §35 requires at minimum 6 inches of horizontal separation for communication conduit running parallel to electric supply in the same corridor. At 4 inches, this design is non-compliant. Additionally, field best practice (driven by locate tolerance and damage prevention) calls for 12 inches or more. The fix is easy: re-route the trench or add a separation board between the two conduits. (Source: RUS 1751F-635; NESC C2 §35 [confirm edition].)',
          },
        ]}
      />

    </LessonLayout>
  );
}
