// T14.L01 — Why We Ground: The Drain Analogy
// Foundation lesson: grounding vs. bonding definitions, fault current, equipotential, ground potential rise

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T14.L01',
  course_id: 'T14',
  title: 'Why We Ground — The Drain Analogy',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01', 'T01.L02', 'T01.L03'],
  vocabulary_introduced: [
    'grounding',
    'bonding',
    'fault current',
    'equipotential',
    'ground potential rise',
  ],
  key_terms: [
    {
      term: 'grounding',
      definition:
        'The intentional connection of conductive OSP components to the earth through a grounding electrode, providing a low-impedance path for fault current so it flows into the ground instead of through crew or equipment.',
    },
    {
      term: 'bonding',
      definition:
        'Electrically connecting conductive components — messenger, armor, closures, cabinets — so they are all at the same electrical potential. Bonding prevents voltage differences between metallic components that could arc or shock when you touch two of them at once.',
    },
    {
      term: 'fault current',
      definition:
        'Unwanted electrical current that flows through a path other than the intended circuit — for example, through a cable sheath or messenger wire that has come into contact with a distribution line. Fault current can be thousands of amperes and is lethal if it flows through a person.',
    },
    {
      term: 'equipotential',
      definition:
        'The condition where two or more conductive components are at the same voltage relative to ground. When everything you can touch is at the same potential, no current flows through your body even if you touch two components simultaneously. Bonding creates equipotential; grounding sets that common potential to zero (earth).',
    },
    {
      term: 'ground potential rise',
      definition:
        'The temporary increase in voltage across the ground electrode during a fault event. When a large fault current flows into the earth, the soil around the electrode rises in voltage relative to true remote earth. GPR is why a ground ring at a central office is required — it keeps everything within the facility at the same elevated potential so no dangerous voltage gradient exists inside the building.',
    },
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'fiber', source_lesson_id: 'T01.L03' },
    { term: 'sheath', source_lesson_id: 'T01.L03' },
    { term: 'messenger', source_lesson_id: 'T01.L03' },
    { term: 'armor', source_lesson_id: 'T01.L03' },
    { term: 'joint-use', source_lesson_id: 'T01.L02' },
    { term: 'NEC', source_lesson_id: 'T01.L08' },
    { term: 'NESC', source_lesson_id: 'T01.L02' },
    { term: 'pole', source_lesson_id: 'T01.L02' },
  ],
  learning_objectives: [
    'Distinguish grounding from bonding using plain-English definitions and a concrete analogy',
    'Explain the path fault current takes when a distribution line contacts an ungrounded messenger, and describe the danger to crew',
    'Define equipotential and explain how bonding creates it',
    'Describe what ground potential rise is and why it matters at facility sites',
  ],
  estimated_minutes: 20,
};

export default function T14L01_WhyWeGround() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Every piece of metal in your OSP plant — the messenger wire, the cable armor, the
          splice-closure clamps, the cabinet frame — can become energized if something goes
          wrong nearby. A distribution line could contact your messenger. Lightning could
          strike the pole. Stray current could travel from a nearby utility. When that happens,
          you need a way to send that unwanted electricity somewhere safe — into the ground —
          before it goes through you.
        </p>
        <p className="mt-2">
          That's the entire point of grounding and bonding. Not code compliance for its own
          sake. Keeping electricity on a safe path so crew members don't become that path.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NEC</td>
              <td className="px-3 py-2">National Electrical Code (NFPA 70)</td>
              <td className="px-3 py-2">The rulebook for electrical installations inside buildings and at the service entrance</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code (IEEE C2)</td>
              <td className="px-3 py-2">The rulebook for utility-side work — poles, aerial plant, supply lines, and communications plant on those poles</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GPR</td>
              <td className="px-3 py-2">Ground Potential Rise</td>
              <td className="px-3 py-2">A temporary voltage jump at the ground electrode during a fault; matters most at FDH sites and central offices</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GES</td>
              <td className="px-3 py-2">Grounding Electrode System</td>
              <td className="px-3 py-2">All the rods, conductors, and clamps that together create the building's connection to earth — introduced fully in L05</td>
            </tr>
          </tbody>
        </table>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500 mt-4">
          <strong>Callback:</strong> Recall from <strong>T01.L02 Joint-Use and Utility Coordination</strong> — the messenger wire and cable armor are communication company assets on a shared pole with power and other utilities. T01.L03 introduced cable sheath and metallic components. This lesson now explains why those metallic components must be electrically connected to ground — the safety mechanism that protects crew members.
        </p>

        <h3 className="mt-5 font-semibold">The sink-drain analogy</h3>
        <p className="mt-2">
          Think of stray electrical energy the way you think of water in a sink. If the drain
          is open, water flows down and away — the sink empties safely. If you block the drain,
          water overflows across the counter, the floor, whoever is standing nearby. A ground
          electrode is the drain. When fault current (the "water") arrives at your metallic
          plant, a proper ground gives it a low-resistance path straight into the earth instead
          of through the first crew member who touches the energized cable.
        </p>
        <p className="mt-2">
          That analogy also explains why resistance matters. A clogged drain (high ground
          resistance) slows the flow — some of the current still looks for another path. A wide
          open drain (low resistance) pulls everything away quickly. NEC §250.56 sets 25 Ω as
          the maximum single-rod resistance for aerial plant precisely because above that
          threshold the "drain" is too narrow to safely handle typical fault events.
          (Source: NEC NFPA 70-2023 §250.56.)
        </p>

        <h3 className="mt-5 font-semibold">Grounding vs. bonding — the critical distinction</h3>
        <p className="mt-2">
          These two words get used interchangeably in the field, but they mean different things:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-slate-300/90">
          <li>
            <strong>Grounding</strong> connects a conductive component to the earth through an
            electrode (a driven rod, a buried conductor, or a building's concrete foundation).
            It establishes a voltage reference — the component is at "zero volts" relative to earth.
          </li>
          <li>
            <strong>Bonding</strong> connects two or more conductive components to each other
            so they are at the same voltage. It doesn't matter what voltage that is —
            bonding prevents a difference between them.
          </li>
        </ul>
        <p className="mt-2">
          The combination is what protects you. Bonding makes sure you can't be the path
          between two differently-charged pieces of metal. Grounding makes sure that common
          voltage is earth (zero), so if something does go wrong, current flows into the ground,
          not through you.
        </p>
        <p className="mt-2">
          <em>
            Field shortcut to remember the difference: bonding is about equality between
            components; grounding is about connection to earth.
          </em>
        </p>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h3 className="mt-6 font-semibold">What happens when grounding is missing</h3>
        <p className="mt-2">
          Here is the scenario: a distribution primary line (say, 7,200 V phase-to-ground)
          contacts your aerial fiber messenger through a broken cross-arm or a failed insulator.
          No fault current yet — because there is no return path. Now a lineman's helper,
          working on the splice closure, grabs the messenger with one hand and steadies himself
          against the pole hardware with the other hand.
        </p>
        <p className="mt-2">
          At that moment, the crew member IS the return path. Fault current flows through both
          hands, across the heart, and into the ground through the feet. That is a cardiac event.
        </p>
        <p className="mt-2">
          Now run the same scenario with a properly grounded messenger:
        </p>
        <ol className="list-decimal ml-6 mt-2 space-y-1 text-slate-300/90">
          <li>The distribution line contacts the messenger.</li>
          <li>Fault current immediately sees the low-resistance path: messenger → bond clamp → #6 AWG copper downlead → ground rod → earth.</li>
          <li>Current flows that path. The fault is large enough to trip the distribution circuit breaker upstream.</li>
          <li>Power goes out for that section. The messenger returns to zero volts. No one gets hurt.</li>
        </ol>
        <p className="mt-2">
          The ground "drain" did its job. The trip-breaker response is part of the system —
          a properly sized and low-resistance ground creates enough fault current to operate the
          overcurrent protection.
        </p>

        <h3 className="mt-5 font-semibold">Equipotential — why bonding protects even when there's no ground</h3>
        <p className="mt-2">
          There is a subtler protection mechanism called equipotential. Imagine you are standing
          inside a metal cage. Lightning strikes the cage. As long as the entire cage is at the
          same voltage (equipotential), no current flows through you — because current only flows
          when there's a voltage <em>difference</em>. You'd need to be touching the cage AND
          something at a different voltage for current to flow through you.
        </p>
        <p className="mt-2">
          This is why a properly bonded vehicle is safer than an unbonded one during a fault —
          and it's why a central-office ground ring bonds every piece of equipment inside the
          building to the same point. Even if GPR temporarily raises the facility to thousands of
          volts above remote earth during a utility fault, everyone and everything inside is at
          the same voltage. No dangerous gradient inside the building.
        </p>

        <h3 className="mt-5 font-semibold">Ground potential rise — when the "drain" itself rises</h3>
        <p className="mt-2">
          GPR (ground potential rise) happens during a high-fault-current event. When thousands
          of amperes flow into a single ground electrode, the soil around that electrode rises
          in voltage — like a big rock dropped in water pushes the water level up around it.
          The voltage decays as you move away from the electrode (called the "step voltage
          gradient").
        </p>
        <p className="mt-2">
          At a headend or FDH with multiple pieces of equipment, GPR is why IEEE Std 1100-2005 [confirm edition] and
          NEC Article 250 both require all service types (power, telephone, cable TV, fiber)
          to bond to the same ground electrode system. If the power service's electrode rises
          to 5,000 V during a fault and the fiber's electrode is still at 0 V, there is
          5,000 V of potential difference between the power equipment and the fiber equipment —
          across a path that includes technicians, connectors, and cable sheaths.
          (Sources: IEEE Std 1100-2005 §1.2–1.3 [confirm edition]; NEC §250.94.)
        </p>
        <p className="mt-2">
          The headend-entry hardware that directly addresses GPR — the primary protector,
          the IBT-entry bonding bar, and the GES tie-in at the building entry — is covered in
          detail in T19.L06 (Headend Grounding: Where the OSP/MGN Terminates). That lesson
          explains how the OSP feeder cable's messenger and armor bond to the GES at the
          building entry, and why the primary protector is mandatory at every CO cable entry.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h3 className="mt-6 font-semibold">Regulatory framework overview</h3>
        <p className="mt-2">
          Two codes govern OSP grounding and bonding. They don't conflict, but they govern
          different sides of the demarcation point:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-2 text-slate-300/90">
          <li>
            <strong>NESC C2-2023 Section 09 (Rules 92–99):</strong> Governs grounding of
            communication systems on utility poles and in underground plant up to the building
            entry. Sets the grounds-per-mile requirement, conductor sizing for downleads, and
            the bonding relationship between the comm messenger and the supply neutral.
          </li>
          <li>
            <strong>NEC NFPA 70-2023 Articles 250, 770, 800:</strong> Governs from the building
            entry inward. Sets electrode types and acceptance thresholds (§250.52, §250.56),
            the IBT (intersystem bonding termination) requirement (§250.94), and the primary
            protector bonding requirements for optical fiber cables (Art. 770) and communications
            cables (Art. 800).
          </li>
        </ul>
        <p className="mt-2">
          RUS Bulletin 1751F-630 §7 summarizes the applicable NESC grounding requirements for
          aerial RUS plant in field-friendly language. RUS Bulletin 1751F-635 §5 covers the
          underground equivalent. These are your practical anchors for documentation on RUS jobs.
          (Sources: RUS 1751F-630 §7; RUS 1751F-635 §5; NESC C2-2023 Section 09.)
        </p>
        <p className="mt-2">
          <em>
            Book vs. field note: NEC §250.56 says ≤25 Ω for a single rod. In the field,
            RUS crews often test every pole electrode and record results in a ground test log
            per the RUS close-out documentation requirement (covered in T14.L10). The 25 Ω
            NEC threshold applies to the aerial pole; the 5 Ω threshold from Telcordia GR-1275
            applies to FDH and CO equipment rooms. Knowing which threshold applies where
            prevents a common inspection failure.
          </em>
        </p>
      </section>

      {/* ── FLASHCARDS ───────────────────────────────────────────────────── */}
      <section data-tier="foundations" className="mt-8">
        <h3 className="font-semibold mb-3">Key Terms — Flashcards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <Quiz
          questions={[
            {
              id: 'T14L01Q1',
              text: 'A messenger wire becomes energized when a distribution primary contacts it. No ground rod is installed. What is the most likely path for fault current?',
              options: [
                'Through the fiber strands inside the cable to the far-end splice location',
                'Through the first crew member who touches the messenger and makes contact with a grounded surface',
                'Through the air as visible arc back to the distribution line',
                'The current dissipates harmlessly because fiber is non-conductive',
              ],
              correct: 1,
              explanation:
                'Fiber strands are non-conductive glass — fault current does not travel through them. Without a ground rod providing a low-resistance path to earth, the crew member who bridges the gap between the energized messenger and a grounded surface (their feet, a grounded pole bolt, etc.) becomes the fault path. This is why grounding is life-safety, not just code compliance.',
            },
            {
              id: 'T14L01Q2',
              text: 'Bonding protects a crew member who touches two metallic components simultaneously by:',
              options: [
                'Raising both components to earth potential so neither is energized',
                'Ensuring both components are at the same voltage, so no current flows through the crew member between them',
                'Limiting current flow to less than 5 mA through any bonding conductor',
                'Providing a fuse that blows when the crew member is the fault path',
              ],
              correct: 1,
              explanation:
                'Bonding creates equipotential — the same voltage across all bonded components. Current only flows when there is a voltage difference. If both components the crew member touches are at the same voltage (bonded together), there is no difference, and no current flows through the crew member between them. Bonding does not necessarily bring either component to earth voltage — that is the job of grounding.',
            },
            {
              id: 'T14L01Q3',
              text: 'NEC §250.56 sets a maximum single-rod ground resistance of 25 Ω. Why does resistance matter for crew safety?',
              options: [
                'Higher resistance means more heat in the ground rod, which causes it to corrode faster',
                'Higher resistance creates a higher voltage on the electrode, which the crew can measure with a voltmeter',
                'Higher resistance limits fault current, which may prevent the overcurrent protection from tripping and leaves the energized fault on the plant longer',
                'Higher resistance makes the ground rod more effective at absorbing lightning energy',
              ],
              correct: 2,
              explanation:
                'For overcurrent protection (circuit breakers, fuses) to trip, fault current must be large enough to operate the device. A high ground resistance limits fault current. If fault current is too low to trip the upstream breaker, the energized conductor stays energized — and the fault remains on the plant until a crew member or equipment becomes the lower-resistance path. Low resistance = high fault current = fast trip = safer plant. (Source: NEC §250.56.)',
            },
            {
              id: 'T14L01Q4',
              text: 'Ground potential rise (GPR) is most dangerous when:',
              options: [
                'A single aerial pole electrode reads 18 Ω on the fall-of-potential test',
                'Multiple service types at a CO or FDH bond to different, separate ground electrodes instead of one common system',
                'A messenger is bonded to the distribution neutral at every splice closure',
                'A ground rod is installed in sandy, high-resistivity soil',
              ],
              correct: 1,
              explanation:
                'GPR is a temporary rise in electrode voltage during a fault. If different service types (power, fiber, telephone) bond to different electrodes, their electrodes may rise to different voltages during a fault event — creating dangerous potential differences between services. IEEE Std 1100-2005 §1.2–1.3 [confirm edition] and NEC §250.94 require all services to bond to one common GES to keep everything at the same elevated potential during GPR events. (Sources: IEEE Std 1100-2005 §1.2–1.3 [confirm edition]; NEC §250.94.)',
            },
          ]}
        />
      </section>

    </LessonLayout>
  );
}
