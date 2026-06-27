// T14.L07 — Surge Arresters and Lightning Protection
// Working lesson: arrester types, placement rules, protection coordination chain

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T14.L07',
  course_id: 'T14',
  title: 'Surge Arresters and Lightning Protection',
  order: 7,
  lesson_type: 'working',
  prerequisites: ['T14.L05'],
  vocabulary_introduced: [
    'surge arrester',
    'MOV',
    'gas-tube arrester',
    'VPL',
    'ground ring',
  ],
  key_terms: [
    {
      term: 'surge arrester',
      definition:
        'A protective device that clamps a transient overvoltage spike (from lightning or switching) to a safe level by diverting the excess energy to ground. Surge arresters are placed at every aerial-to-underground transition and at every facility entry where the OSP plant enters a building or equipment cabinet.',
    },
    {
      term: 'MOV',
      definition:
        'Metal Oxide Varistor — a solid-state arrester component that clamps voltage surges. An MOV has a non-linear resistance characteristic: it is essentially an open circuit at normal voltages and a very low resistance at surge voltages, rapidly diverting the surge energy to ground. MOVs are the dominant arrester technology in modern communication equipment protectors.',
    },
    {
      term: 'gas-tube arrester',
      definition:
        'A surge arrester using a sealed gas-filled tube that ionizes (becomes conductive) when the voltage across it exceeds a threshold (typically hundreds of volts), creating a short-circuit path to ground that absorbs the first-strike energy. Gas tubes handle very large energy pulses but have slower response than MOVs. Often used as the first stage in a two-stage protection scheme.',
    },
    {
      term: 'VPL',
      definition:
        'Voltage Protection Level — the maximum voltage an arrester lets through to the protected equipment when it clamps a surge. A lower VPL means better protection. For a fiber primary protector, the VPL is the voltage that reaches the equipment side of the protector during a rated surge event. Equipment immunity ratings must exceed the arrester\'s VPL with an adequate margin.',
    },
    {
      term: 'ground ring',
      definition:
        'A bare copper conductor buried around the perimeter of a structure, bonded to all ground electrodes and equipment grounds inside the facility. Provides an equipotential reference plane under the building footprint and ties all building steel and equipment frames to the same potential. At CO/headend sites, the ground ring is the primary GPR mitigation tool. (Sources: NEC §250.52(A)(4); IEEE Std 1100-2005 §8.3 [confirm edition].)',
    },
  ],
  vocabulary_assumed: [
    { term: 'grounding', source_lesson_id: 'T14.L01' },
    { term: 'bonding', source_lesson_id: 'T14.L01' },
    { term: 'ground potential rise', source_lesson_id: 'T14.L01' },
    { term: 'GES', source_lesson_id: 'T01.L08' },
    { term: 'IBT', source_lesson_id: 'T01.L08' },
    { term: 'ring electrode', source_lesson_id: 'T14.L04' },
    { term: 'primary protector', source_lesson_id: 'T19.L06' },
    { term: 'NEC', source_lesson_id: 'T01.L08' },
    { term: 'conduit', source_lesson_id: 'T01.L02' },
    { term: 'headend', source_lesson_id: 'T01.L01' },
  ],
  learning_objectives: [
    'Identify gas-tube, MOV, and combination arrester types and their primary-vs-secondary role',
    'Select correct arrester placement at aerial-to-underground transitions and facility entries',
    'Explain the protection coordination chain: line-side arrester → equipment clamp → equipment immunity',
    'Describe the purpose of a ground ring at a CO or headend and how it relates to GPR',
  ],
  estimated_minutes: 25,
};

export default function T14L07_SurgeArrestersLightning() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Lightning doesn't have to hit your cable directly to cause damage. A strike near your
          aerial plant induces a high-voltage pulse in the cable — a surge. That surge can travel
          dozens of miles on the metallic components of your cable and arrive at the connected
          equipment as a voltage spike that fries electronics.
        </p>
        <p className="mt-2">
          Surge arresters are the gates that stop that spike before it reaches the equipment.
          They work by "clamping" — once the voltage exceeds a threshold, the arrester becomes
          a temporary short circuit to ground, diverting the surge energy into the earth instead
          of into the equipment. When the surge is over, the arrester resets and normal operation
          resumes.
        </p>
        <p className="mt-2">
          Placement is critical: you need an arrester anywhere a cable transitions from the
          exposed outdoor environment (where lightning induction happens) to protected indoor
          equipment (where the damage happens). That means at aerial-to-underground transitions
          and at every building entry.
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500 mt-4">
          <strong>Callback:</strong> Recall from <strong>T14.L01 Why We Ground</strong> — grounding provides a safe path for unwanted electrical energy into the earth. This lesson shows surge arresters — the devices that detect lightning surges and divert them to ground. The arrester's ground path connects to the GES and ground ring covered in T14.L05-L06.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Role in protection chain</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MOV</td>
              <td className="px-3 py-2">Metal Oxide Varistor</td>
              <td className="px-3 py-2">Solid-state clamp; fast response; secondary-stage protection</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">VPL</td>
              <td className="px-3 py-2">Voltage Protection Level</td>
              <td className="px-3 py-2">The voltage the arrester lets through to equipment — must be below equipment immunity rating</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NEC</td>
              <td className="px-3 py-2">National Electrical Code (NFPA 70)</td>
              <td className="px-3 py-2">Art. 770 (optical fiber) and Art. 800 (comm cables) — require primary protectors at building entry</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code</td>
              <td className="px-3 py-2">Rule 97 — lightning protection and arrester placement for communication plant (Source: NESC C2-2023 Rule 97)</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-4">
          <p className="text-sm text-slate-300 font-semibold mb-2">Quick refresher:</p>
          <ul className="text-sm space-y-1 text-slate-300/90">
            <li><strong>Grounding:</strong> Providing a low-resistance path to earth so transient surges drain safely away from equipment. From T14.L01.</li>
            <li><strong>Ground potential rise (GPR):</strong> Why your ground ring and GES matter during lightning strikes — to keep all facility grounds at the same elevated potential. From T14.L01.</li>
            <li><strong>Ring electrode:</strong> A buried copper loop around a facility that equalizes grounding potential and provides a low-impedance discharge path for surges. From T14.L04.</li>
            <li><strong>GES and IBT:</strong> The grounding electrode system and intersystem bonding termination that arresters connect to for surge discharge. From T14.L05.</li>
          </ul>
        </div>

        <h3 className="mt-6 font-semibold">The three arrester types</h3>
        <p className="mt-2">
          Surge arresters for OSP/telecom applications come in three main technologies.
          Understanding which handles what helps you read specifications and choose correctly:
        </p>
        <div className="mt-4 space-y-4">
          <div className="border border-white/10 rounded-lg p-4">
            <p className="font-semibold text-slate-200">Gas-Tube Arrester — First-Strike Energy Absorber</p>
            <p className="text-sm text-slate-300/90 mt-1">
              A sealed gas-filled tube placed in series with the line. When surge voltage exceeds
              the tube's sparkover voltage (typically 230–600 V for telecom applications), the gas
              ionizes and the tube conducts, creating a low-impedance path to ground that dumps
              the large initial energy of a lightning strike into the earth. Very high energy
              capacity. Limitation: slow response (microseconds), so it doesn't catch fast
              electronic transients well. Used as the first stage in a two-stage protection system.
            </p>
          </div>
          <div className="border border-white/10 rounded-lg p-4">
            <p className="font-semibold text-slate-200">MOV — Secondary Clamp, Fast Response</p>
            <p className="text-sm text-slate-300/90 mt-1">
              A metal oxide varistor is a solid-state device with a non-linear voltage-current
              characteristic. At normal operating voltages, its resistance is essentially infinite
              (no current flows). When the surge exceeds the clamping voltage, its resistance drops
              dramatically, shunting current to ground and clamping the voltage to the VPL.
              Response time: nanoseconds. Limitation: lower energy capacity than gas-tube — can be
              damaged by very large strikes. Used as the second stage (after the gas-tube absorbs
              the big energy) to clamp the residual voltage close to the equipment's immunity rating.
            </p>
          </div>
          <div className="border border-white/10 rounded-lg p-4">
            <p className="font-semibold text-slate-200">Combination (Hybrid) — Both Stages in One Device</p>
            <p className="text-sm text-slate-300/90 mt-1">
              A single listed primary protector housing that contains both a gas-tube first stage
              (absorbs the initial large energy) and an MOV second stage (clamps the residual
              voltage). Most modern primary protectors for optical fiber and comm cables are
              combination-type devices. The UL 497B listing for fiber primary protectors covers
              these combination types.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Placement — where an arrester goes</h3>
        <p className="mt-2">
          The rule: place an arrester at every location where aerial (exposed) plant transitions
          to protected (underground or indoor) plant, and at every building entry.
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-slate-300/90">
          <li>
            <strong>Aerial-to-underground transition (riser):</strong> At the point where the
            aerial fiber drops from the pole into conduit underground. The arrester goes on the
            aerial side — before the cable enters the conduit — so the surge is diverted before
            it enters the protected underground portion. (Source: IEEE Std 1100-2005 §8.5 [confirm edition]; NESC
            C2-2023 Rule 97.)
          </li>
          <li>
            <strong>Building entry:</strong> At the primary protector installed per NEC Art. 770
            (fiber) or Art. 800 (comm cables). The protector is on the line side of the
            first electronic termination (OLT, ONT, media converter). (Sources: NEC §770.93;
            NEC §800.93.)
          </li>
          <li>
            <strong>Additional high-exposure locations:</strong> At the top of every tall riser
            transition in areas with high ground-flash density. NESC Rule 97 specifies additional
            ground ring requirements at sites with high lightning incidence. (Source: NESC C2-2023
            Rule 97.)
          </li>
        </ul>

        <div className="mt-5 p-4 border border-slate-600/50 bg-slate-800/40 rounded-lg">
          <h4 className="font-semibold text-slate-200 mb-3">Protection Coordination Chain — Aerial to Building</h4>
          <p className="text-sm text-slate-300/90 mb-4">
            A lightning-induced surge moves through five stages from the exposed aerial plant to
            the protected equipment inside the building. Each stage either absorbs energy or
            clamps voltage; together they coordinate to keep the energy delivered to electronics
            within the equipment's immunity rating.
          </p>
          <div className="space-y-2">
            {[
              {
                label: '① Aerial Plant',
                explanation:
                  'The exposed outdoor portion of the cable. Lightning induction can raise voltages to thousands of volts on the messenger and any metallic sheath components. The surge travels along the cable toward the equipment.',
              },
              {
                label: '② Line-Side Arrester (Riser)',
                explanation:
                  'First-stage arrester at the aerial-to-underground transition. A gas-tube or combination device. Absorbs the large initial energy of the lightning surge before it enters the protected conduit. Grounded to the pole ground rod. (Sources: IEEE Std 1100-2005 §8.5 [confirm edition]; NESC C2-2023 Rule 97.)',
              },
              {
                label: '③ Underground / Conduit Run',
                explanation:
                  'The underground portion of the cable. Protected by the riser arrester from the worst of the surge. However, residual voltage can still travel this section, which is why a second-stage protector at the building entry is also required.',
              },
              {
                label: '④ Primary Protector (Building Entry)',
                explanation:
                  'Combination protector (UL 497B for fiber, UL 497 for comm pairs) at building entry. Clamps residual surge voltage to VPL. Bonded to GES via IBT per NEC §250.94. This is the last stage before the equipment. (Sources: NEC §770.93; NEC §250.94.)',
              },
              {
                label: '⑤ Equipment (OLT / ONT)',
                explanation:
                  'The protected electronic equipment. The equipment\'s immunity rating (surge withstand in the datasheet) must EXCEED the primary protector\'s VPL with a margin. If VPL > equipment immunity → equipment can still be damaged. The protection chain must be designed to match. (Source: IEEE Std 1100-2005 §8.6 [confirm edition].)',
              },
            ].map(({ label, explanation }) => (
              <div key={label} className="p-3 bg-slate-900/40 border border-slate-700/40 rounded">
                <p className="font-semibold text-slate-200 text-sm">{label}</p>
                <p className="text-slate-300/90 text-xs mt-1 leading-relaxed">{explanation}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 italic">
            Surge energy flows left-to-right through the chain. Each downstream stage handles a
            smaller, faster, lower-voltage portion of what the upstream stage couldn't absorb.
          </p>
        </div>

        <h3 className="mt-6 font-semibold">The ground ring at CO and headend sites</h3>
        <p className="mt-2">
          At a central office, headend, or large FDH building, a single driven rod isn't enough.
          The ground ring (a bare copper conductor buried in a ring around the building footprint,
          per NEC §250.52(A)(4) and IEEE Std 1100-2005 §8.3 [confirm edition]) serves two purposes:
        </p>
        <ol className="list-decimal ml-6 mt-2 space-y-1 text-slate-300/90">
          <li>
            <strong>Low-resistance electrode:</strong> The ring's large surface area in contact
            with the earth gives very low ground resistance — often below the 5 Ω GR-1275
            threshold without supplemental rods.
          </li>
          <li>
            <strong>Equipotential platform:</strong> During a GPR event, the entire ring rises to
            the same voltage. Any equipment bonded to the ring is also at that same voltage.
            No dangerous gradients inside the ring's perimeter. This is why IEEE Std 1100-2005 [confirm edition] and
            the Telcordia GR-1275 both require the ring as the foundation for CO/headend
            grounding. (Sources: IEEE Std 1100-2005 §8.3 [confirm edition]; NEC §250.52(A)(4).)
          </li>
        </ol>
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
              id: 'T14L07Q1',
              text: 'An aerial fiber cable transitions into underground conduit at a riser pole. Where should the surge arrester be placed?',
              options: [
                'Inside the building at the first electronic termination',
                'On the aerial side, before the cable enters the conduit (line-side)',
                'At the midpoint of the underground conduit run',
                'At the opposite end of the underground run where the cable exits',
              ],
              correct: 1,
              explanation:
                'The arrester must be on the line (aerial) side — before the cable enters the conduit. Placing it there means the surge is diverted into the ground at the transition point, before it enters the protected underground portion. If placed inside the building, the full surge energy travels through the entire conduit run first. (Sources: IEEE Std 1100-2005 §8.5 [confirm edition]; NESC C2-2023 Rule 97.)',
            },
            {
              id: 'T14L07Q2',
              text: 'What is the main limitation of a gas-tube arrester that makes it unsuitable as the sole protection device for sensitive electronics?',
              options: [
                'Gas tubes operate only on DC circuits, not AC circuits',
                'Gas tubes are slow to respond (microseconds) and have a high residual VPL, so they are not effective against fast electronic transients',
                'Gas tubes can only be used outdoors and degrade rapidly inside buildings',
                'Gas tubes require a separate ground rod and cannot share the building GES',
              ],
              correct: 1,
              explanation:
                'Gas-tube arresters are excellent at absorbing the large initial energy of a direct strike (high energy capacity), but their response time is in the microseconds range. Fast electronic transients (nanosecond-rise-time ESD or switching spikes) can bypass the gas tube before it fires. MOVs respond in nanoseconds and clamp to a lower VPL. The combination design (gas tube first stage for energy absorption + MOV second stage for fast clamping) is the standard for modern primary protectors.',
            },
            {
              id: 'T14L07Q3',
              text: 'At a CO building, a ground ring (bare copper conductor buried around the building footprint) provides:',
              options: [
                'An antenna that dissipates lightning energy before it reaches the building',
                'Both a low-resistance electrode AND an equipotential reference platform during GPR events',
                'A return path for fault current that bypasses the main service entrance GES',
                'Protection against step voltage on the soil surface outside the building',
              ],
              correct: 1,
              explanation:
                'The ground ring serves a dual purpose: its large surface area in contact with the earth gives very low ground resistance (helping meet the 5 Ω GR-1275 threshold); and during a GPR event, the entire ring rises to the same voltage, creating an equipotential surface under the building footprint that prevents dangerous voltage gradients between equipment inside the ring. (Sources: NEC §250.52(A)(4); IEEE Std 1100-2005 §8.3 [confirm edition].)',
            },
            {
              id: 'T14L07Q4',
              text: 'Compared to a gas-tube arrester, a metal oxide varistor (MOV) arrester offers which key operational advantage?',
              options: [
                'Higher peak surge current capacity for direct lightning strikes',
                'Lower purchase cost per unit at equivalent voltage ratings',
                'No power-frequency follow current after the surge clears — the MOV self-resets without conducting at 60 Hz',
                'Higher clamping voltage, providing a wider protection margin',
              ],
              correct: 2,
              explanation:
                'Gas-tube arresters fire (ionize) at a high threshold voltage and, once conducting, continue to pass power-frequency current until the arc is interrupted — this "follow current" can blow fuses or trip breakers. MOV arresters clamp voltage by changing resistance; when the surge passes, the MOV returns to high-impedance without conducting at 60 Hz. This eliminates follow-current problems, making MOVs better suited for protecting sensitive electronics in-line. Trade-off: MOVs degrade with each surge event and have a finite life. (Source: IEEE Std C62.11-2012.)',
            },
          ]}
        />
      </section>

    </LessonLayout>
  );
}
