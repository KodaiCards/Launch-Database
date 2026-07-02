// T03.L03 — Armor and Jacket Selection
// Working lesson: CST, interlocked armor, direct-burial, rodent protection

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T03.L03',
  course_id: 'T03',
  title: 'Armor and Jacket Selection',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T03.L01', 'T03.L02'],
  learning_objectives: [
    'Identify when CST armor vs. interlocked armor vs. no armor is the correct specification',
    'Explain the role of the internal ripcord in CST-armored cable installation',
    'Apply NEC §770.179(B) correctly — it defines cable type designations and marking, not armor configuration rules',
    'Specify cable for a multi-environment route (aerial + direct-burial + building riser) with splice points',
    'Recognize when dielectric cable is preferable over metallic armor in joint-use and corrosive environments',
  ],
  vocabulary_introduced: [
    'corrugated steel tape (CST)',
    'interlocked armor',
    'direct-burial',
    'rodent-proof armor',
  ],
  vocabulary_assumed: [
    { term: 'armor',        source_lesson_id: 'T01.L03' },
    { term: 'sheath',       source_lesson_id: 'T01.L03' },
    { term: 'HDPE',         source_lesson_id: 'T01.L08' },
    { term: 'NEC',          source_lesson_id: 'T01.L08' },
    { term: 'loose-tube',   source_lesson_id: 'T03.L01' },
    { term: 'OFNR',         source_lesson_id: 'T03.L02' },
    { term: 'OFNP',         source_lesson_id: 'T03.L02' },
    { term: 'outdoor-rated', source_lesson_id: 'T03.L02' },
  ],
  key_terms: [
    {
      term: 'corrugated steel tape (CST)',
      definition:
        'A steel armor layer formed into corrugations and wrapped around the inner cable assembly before the outer jacket. Provides rodent protection and crush resistance for direct-burial and some indoor-outdoor applications. The steel is easily removed with an internal ripcord.',
    },
    {
      term: 'interlocked armor',
      definition:
        'An aluminum or steel armor formed by interlocking metal strips in a helical pattern around the cable. Provides crush resistance and rodent protection; common in indoor/outdoor riser cables and campus underground runs. Can be manufactured and marked as OFNR (riser-rated) per the NEC Article 770 type-designation system, enabling use in building risers.',
    },
    {
      term: 'direct-burial',
      definition:
        'Cable rated and constructed for installation directly in the ground without conduit. Requires crush-resistant jacket (usually HDPE + CST or corrugated armor) and gel-filled or water-blocked buffer tubes. (Source: ICEA S-87-640; 7 CFR 1755.902)',
    },
    {
      term: 'rodent-proof armor',
      definition:
        'Any armor type (CST, interlocked, coilable aluminum) providing a mechanical barrier against rodent gnawing. Required for direct-burial applications in areas with documented rodent activity. (Source: ICEA S-87-640; FOA OSP installation guidelines)',
    },
  ],
  estimated_minutes: 22,
};

export default function T03L03_ArmorJacketSelection() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A fiber strand is glass. Glass doesn't like to be crushed by a backhoe bucket,
          chewed by a woodchuck, or kinked by a sharp cable bend. Armor is the metal
          layer inside a cable that takes the abuse so the glass doesn't have to.
        </p>
        <p className="mt-2">
          Not every cable needs armor — aerial cables lashed to a strand just need a
          weatherproof jacket. But the moment cable touches the ground, goes through a
          duct, or has to survive in a building where something heavy might roll over it,
          armor becomes part of the spec conversation.
        </p>
        <p className="mt-2">
          There are two main armor types you'll encounter in OSP work:
          <strong> CST (corrugated steel tape)</strong> and
          <strong> interlocked armor</strong>. Knowing when to use each one — and why —
          is a basic field spec skill.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">What it stands for</th>
              <th className="px-3 py-2 text-left">In the field</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CST</td>
              <td className="px-3 py-2">Corrugated Steel Tape</td>
              <td className="px-3 py-2">The most common OSP armor; a crimped steel wrap around the inner cable</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDPE</td>
              <td className="px-3 py-2">High-Density Polyethylene</td>
              <td className="px-3 py-2">Standard outer jacket for OSP cables; UV-stabilized</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ICEA</td>
              <td className="px-3 py-2">Insulated Cable Engineers Association</td>
              <td className="px-3 py-2">Sets the S-87-640 standard that governs OSP cable construction specs</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NEC</td>
              <td className="px-3 py-2">National Electrical Code (NFPA 70)</td>
              <td className="px-3 py-2">Building code; Article 770 governs optical fiber cables; §770.179(B) covers cable type designations and marking (OFNR, OFNP, OFN)</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── ARMORED CABLE LAYER BREAKDOWN ───────────────────────────────── */}
      <div className="lesson-callout">
        <h4>CST-Armored Direct-Burial Cable — Layer Breakdown (Inside to Outside)</h4>
        <ol>
          <li>
            <strong>Inner cable assembly</strong> — The loose-tube cable core: central strength member, buffer tubes with fibers in gel or dry-block, water-blocking tape or flooding compound, and inner jacket. This is the functional part of the cable — everything else is mechanical protection for it.
          </li>
          <li>
            <strong>CST armor layer</strong> — Corrugated steel tape (CST) is wrapped around the inner assembly in a longitudinal fold. The corrugations give it flexibility to bend while maintaining crush resistance. Steel provides rodent protection — gnawing teeth cannot penetrate the steel before the animal gives up. (OCC D-Series product documentation; ICEA S-87-640)
          </li>
          <li>
            <strong>Ripcord</strong> — An internal ripcord (typically a strong yarn or cord under the steel armor) lets the installer score and split the armor layer without needing metal cutters that could nick the fibers. "The steel-armor is easily removed with an internal ripcord." (OCC D-Series product documentation — verified)
          </li>
          <li>
            <strong>Outer HDPE jacket</strong> — The final outer jacket — HDPE with 2–3% carbon black for UV stabilization. Provides waterproofing, UV resistance, and mechanical abrasion resistance. In a direct-burial application, this is the first line of defense against soil abrasion as the cable shifts. (ICEA S-87-640)
          </li>
        </ol>
      </div>

      {/* ── WORKING ──────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>CST vs. Interlocked Armor — When to Use Each</h2>

        <h3 className="mt-4 font-semibold">CST armor — standard for direct-burial OSP</h3>
        <p>
          CST (corrugated steel tape) armor is the go-to for direct-burial fiber cables.
          The corrugated shape — think of a ridged sheet of metal that's been formed into
          a tube — gives the armor flexibility to bend around curves while maintaining the
          rigidity needed to resist crush loads from soil, frost heave, or accidental
          backhoe contact.
        </p>
        <p className="mt-2">
          <strong>Rodent protection:</strong> In areas with documented rodent activity
          (groundhogs, marmots, gophers, squirrels), CST is the standard defense. Rodents
          gnaw through HDPE jacket relatively easily; steel stops them. Per ICEA S-87-640
          and the FOA installation guide, armor is required when direct-burial cable is
          routed through areas with documented rodent problems. (Source: OCC product
          documentation; ICEA S-87-640 Annex — armor for direct-burial rodent protection)
        </p>
        <p className="mt-2">
          <strong>UL listing and NEC type marking:</strong> CST-armored cables from
          manufacturers like OCC can be manufactured, tested, and marked as OFNR
          (riser-rated) per NEC Article 770's type-designation system — meaning the
          steel armor does not prevent the cable from meeting indoor fire ratings.
          NEC §770.179(B) covers cable type designations and marking requirements
          (what designations like OFNR, OFNP, and OFN mean and how cables must be
          marked), not a separate "permitted armor" rule. (Source: OCC D-Series
          product page: "UL listed in accordance with NEC section 770.179(b)" —
          verified; NEC NFPA 70-2023 Article 770 §770.179)
        </p>

        <h3 className="mt-5 font-semibold">Interlocked armor — indoor-outdoor and campus use</h3>
        <p>
          Interlocked armor is different from CST. Instead of a continuous corrugated tape,
          it's formed from individual metal strips that interlock in a helical winding
          pattern around the cable — similar to the way chain mail works at a larger scale.
          The interlocking provides flexibility with crush resistance.
        </p>
        <p className="mt-2">
          Interlocked armor is common for campus indoor-outdoor riser cables and some
          underground installations. It can be manufactured and marked as OFNR
          (riser-rated) under NEC Article 770's type-designation scheme, making it
          suitable for running from outdoor duct into a building riser shaft without
          a transition. (Source: fiberoptics4sale.com F1-LK12D product
          description: "OFCR Riser Rated, rodent protection suitable for outdoor direct
          burial" — verified via vendor datasheet)
        </p>

        <h3 className="mt-5 font-semibold">No armor — aerial and duct use</h3>
        <p>
          Armor adds weight, cost, and bend stiffness. For aerial cable lashed to a
          messenger, the mechanical threat is tensile (sag and wind load), not crush or
          rodents. An unarmored aerial cable with appropriate strength members and HDPE
          jacket is the correct spec. Similarly, cable in a conduit duct is protected by
          the conduit — armor inside a duct is redundant weight.
        </p>
        <p className="mt-2">
          The exception: if a duct run transitions to a short direct-burial segment (such
          as a duct that ends at a handhole and the cable continues direct-buried to a
          pedestal), that direct-burial section needs armor even if the duct portion doesn't.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Installation Environment</th>
                <th className="px-3 py-2 text-left">Recommended Armor</th>
                <th className="px-3 py-2 text-left">Rationale</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Aerial (lashed to strand)</td>
                <td className="px-3 py-2 font-semibold text-green-300">None</td>
                <td className="px-3 py-2">Mechanical threat is tensile; armor adds weight and cost</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Underground conduit/duct</td>
                <td className="px-3 py-2 font-semibold text-green-300">None (conduit provides protection)</td>
                <td className="px-3 py-2">Conduit handles crush loads; armor is redundant</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Direct-burial (no rodent risk)</td>
                <td className="px-3 py-2 font-semibold text-yellow-300">CST or corrugated armor</td>
                <td className="px-3 py-2">Soil crush, frost heave, accidental dig-in protection</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Direct-burial (rodent-active area)</td>
                <td className="px-3 py-2 font-semibold text-red-300">CST armor required</td>
                <td className="px-3 py-2">Steel barrier against gnawing; HDPE alone is insufficient</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Indoor-outdoor riser</td>
                <td className="px-3 py-2 font-semibold text-yellow-300">Interlocked armor (OFNR-listed)</td>
                <td className="px-3 py-2">Crush resistance + listed indoor fire rating in one cable</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (ICEA S-87-640):</strong> Armor thickness requirements, corrugation
            geometry, and material specs are defined in the standard. CST and interlocked
            armor are described as two distinct construction types with different application
            ranges. The standard is paywalled (2016/2023 editions) — values confirmed via
            the 2006 publicly-accessible archive.org edition and multiple vendor datasheets.
            Mark [confirm against ICEA S-87-640 2023 edition for current thickness
            requirements] when specifying for a contract.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> In practice, RUS project managers often specify "armored
            direct-burial cable per 7 CFR 1755.902" without calling out armor type explicitly.
            That's fine — it puts the armor-type decision on the cable manufacturer to meet
            the performance requirements of the standard. Where field crews go wrong is
            installing unarmored cable in direct-burial segments (usually from leftover
            aerial cable inventory) to avoid ordering the right material. That's how you end
            up replacing a segment four years later because a woodchuck chewed through it.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk:</strong> Rodent damage to direct-buried cable is not covered under
            most cable warranties when armor was omitted where it was required. Beyond
            replacement cost, an unplanned outage during a RUS acceptance inspection can
            jeopardize the project close-out.
          </p>
        </div>
      </section>

      {/* ── BRANCHING SCENARIO ───────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T03-L03-scenario-1"
        title="Armor Selection for a Three-Environment Route"
        description="A 48F cable route crosses three different environments. Select the right cable type for each segment."
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            text: 'Your 48F route has three segments: (A) 1,200 ft aerial lashed to existing utility strand, (B) 400 ft direct-burial through a meadow with known groundhog activity, (C) 50 ft entry into a commercial building riser shaft. Which environment do you tackle first?',
            choices: [
              { label: 'Aerial segment A', nextId: 'aerial' },
              { label: 'Direct-burial segment B', nextId: 'db-rodent' },
              { label: 'Building entry segment C', nextId: 'riser' },
            ],
          },
          aerial: {
            id: 'aerial',
            text: 'Aerial lashed to existing strand: the cable is mechanically supported by the messenger strand. Threat is tensile load and UV exposure — not crush or rodents. Correct spec: loose-tube OSP cable with HDPE jacket and appropriate strength members. No armor needed. CST armor would add unnecessary weight and stiffness for aerial use.',
            choices: [
              { label: 'Now check segment B', nextId: 'db-rodent' },
              { label: 'Start over', nextId: 'start' },
            ],
          },
          'db-rodent': {
            id: 'db-rodent',
            text: 'Direct-burial through a meadow with documented groundhog activity. HDPE jacket alone: insufficient — groundhogs can chew through polyethylene. Correct spec: CST-armored direct-burial cable. The corrugated steel tape creates a gnaw-stop barrier. Also needs gel-filled or dry-block loose-tube construction for moisture protection. (ICEA S-87-640; FOA installation guide)',
            choices: [
              { label: 'Now check segment C', nextId: 'riser' },
              { label: 'Start over', nextId: 'start' },
            ],
          },
          riser: {
            id: 'riser',
            text: 'Building riser shaft entry — 50 ft. Options: (A) Use a dual-rated OSP/OFNR cable with interlocked armor. (B) Transition at the building entry to a listed OFNR cable. Since the run is exactly 50 ft, option B works — the unlisted OSP cable from segments A/B can enter up to 50 ft under NEC §770.48(A), but the riser shaft requires OFNR regardless of length. If the OSP cable enters the riser shaft, it must be OFNR-listed. Use dual-rated interlocked armor cable for the riser portion.',
            choices: [
              { label: 'Summary: what do I order for each segment?', nextId: 'summary' },
              { label: 'Start over', nextId: 'start' },
            ],
          },
          summary: {
            id: 'summary',
            text: 'Complete cable spec: Segment A (aerial) — unarmored OSP loose-tube with HDPE. Segment B (direct-burial, rodent area) — CST-armored direct-burial loose-tube. Segment C (riser) — interlocked armor OFNR-listed cable. Three segments, three different cable types — this is normal on a real-world route. The splice points at each transition become part of the project plan.',
            choices: [{ label: 'Start over', nextId: 'start' }],
          },
        }}
      />

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Dielectric cables — when no metal is the right choice</h3>
        <p>
          A <strong>dielectric cable</strong> has absolutely no metallic components:
          no armor, no messenger wire, no metallic strength members. All strength is
          provided by aramid yarn (Kevlar) or fiberglass rods.
        </p>
        <p className="mt-2">
          Why does this matter? On a joint-use aerial plant with electric utilities, bonding
          and grounding requirements for metallic cable components add engineering and field
          labor cost. ADSS (All-Dielectric Self-Supporting) aerial cables are dielectric —
          no metal means no bonding requirement at every pole, which is a significant
          installation cost reduction. (Source: 7 CFR 1755.902; CommScope ADSS documentation)
        </p>
        <p className="mt-2">
          For underground duct applications, a dielectric cable also avoids the need to
          worry about galvanic corrosion of the armor in high-chloride or high-acidity
          soil environments — a real concern in coastal areas and near industrial sites.
          If the soil conditions are aggressive, dielectric (aramid-reinforced, no armor)
          in conduit is often the right call over armored direct-burial.
        </p>

        <h3 className="mt-5 font-semibold">Corrugated aluminum tape (CAT) — the lighter alternative</h3>
        <p>
          Some indoor-outdoor cables use corrugated aluminum tape (CAT) instead of steel.
          Aluminum is lighter and has better corrosion resistance than bare steel in many
          environments. The tradeoff: aluminum is softer than steel and provides less
          resistance to determined rodents. CAT armor is more common in aerial and conduit
          applications where the primary concern is crush resistance and weight, not rodent
          protection. For direct-burial in rodent-active areas, steel CST is still the
          preferred choice.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Armor and jacket selection cascades through the rest of your design:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T04.L07 Site Selection &amp; Environmental Factors</strong> — Soil conditions (rodent pressure, chloride saturation, pH) and installation method (conduit vs. direct-bury) determine whether armor is needed and which type (CST steel vs. aluminum).</li>
            <li><strong>T06.L04 Underground Make-Ready</strong> — Direct-burial cable reduces the conduit cost; conduit-in-duct allows lighter armor (aluminum) or dielectric. The choice changes your permit scope and crew days-on-site.</li>
            <li><strong>T14.L02 Bonding Metallic Cable Armor</strong> — Every metallic armor at a pole attachment (aerial) or splitter (underground) requires bonding to ground per NEC 770.48 and RUS 1753.18. Dielectric cable completely avoids this cost and labor; metallic armor adds recurring work.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            The armor choice is not cosmetic — it's the primary cost driver for underground installation labor and ongoing bond maintenance.
          </p>
        </section>
      </section>

      {/* ── KEY TERMS FLASHCARDS ──────────────────────────────────────────── */}
      <Flashcard
        deckId="T03-L03"
        cards={[
          {
            id: 'T03-L03-fc-cst',
            front: 'What is CST armor and when is it used?',
            back: 'Corrugated Steel Tape — a steel armor layer formed into corrugations and wrapped around the inner cable assembly before the outer jacket. Provides rodent protection and crush resistance for direct-burial. The steel is easily removed with an internal ripcord. (OCC product documentation; ICEA S-87-640)',
          },
          {
            id: 'T03-L03-fc-interlocked',
            front: 'What is interlocked armor and when is it used?',
            back: 'An aluminum or steel armor formed from interlocking metal strips in a helical pattern around the cable. Provides crush resistance and rodent protection; common in indoor/outdoor riser cables and campus underground runs. Can be manufactured, tested, and marked as OFNR (riser-rated) under NEC Article 770\'s type-designation system, enabling use in building risers without a separate transition.',
          },
          {
            id: 'T03-L03-fc-db',
            front: 'What is direct-burial cable construction?',
            back: 'Cable rated and constructed for installation directly in the ground without conduit. Requires crush-resistant jacket (usually HDPE + CST or corrugated armor) and gel-filled or water-blocked buffer tubes. In rodent-active areas, CST armor is required. (ICEA S-87-640; 7 CFR 1755.902)',
          },
          {
            id: 'T03-L03-fc-ripcord',
            front: 'What does the ripcord inside a CST-armored cable do?',
            back: 'An internal ripcord (strong yarn or cord) under the steel armor lets installers score and remove the armor layer without metal cutters that could nick the fiber bundle. "The steel-armor is easily removed with an internal ripcord." (Source: OCC D-Series product documentation — verified)',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ───────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T03"
        assessmentId="T03-L03"
        title="T03.L03 Check — Armor and Jacket Selection"
        fallback={
        <Quiz
          title="T03.L03 Check — Armor and Jacket Selection"
          mode="multiple-choice"
          questions={[
            {
              id: 'T03-L03-Q1',
              type: 'mc',
              prompt:
                'A cable routed from aerial attachment into an underground duct and then entering a building riser shaft requires which combination of specifications?',
              choices: [
                'HDPE jacket only for all three segments — one cable type fits all',
                'CST armor for the direct-burial segment, unarmored for aerial, OFNR-listed for the riser entry',
                'Interlocked armor throughout — handles all three environments',
                'Tight-buffer construction to allow individual fiber termination in the building',
              ],
              answerIndex: 1,
              explanation:
                'Each environment has different requirements. Aerial: unarmored, weatherproof HDPE. Underground duct: conduit provides protection, so armor is optional/redundant for the duct section. Riser entry: OFNR fire rating is required for the riser shaft — this dictates the cable specification for that segment. Three segments often = three cable specs with splice points at each transition. (ICEA S-87-640; NEC §770)',
            },
            {
              id: 'T03-L03-Q2',
              type: 'dragdrop',
              prompt:
                'Match each armor type to its primary protection role.',
              items: [
                { id: 'cst',    label: 'CST (corrugated steel tape)' },
                { id: 'inter',  label: 'Interlocked armor' },
                { id: 'noarm',  label: 'No armor' },
              ],
              targets: [
                { id: 'tcst',   label: 'Direct burial + rodent protection (gnaw barrier)' },
                { id: 'tinter', label: 'Indoor-outdoor riser with NEC §770.179(B) listing' },
                { id: 'tnoarm', label: 'Aerial lashed to strand (tensile load only)' },
              ],
              correctMap: { tcst: 'cst', tinter: 'inter', tnoarm: 'noarm' },
              explanation:
                'CST: steel gnaw barrier for direct-burial in rodent areas. Interlocked armor: helical metal strips for indoor-outdoor riser crush resistance with fire rating. No armor: aerial cable relies on the messenger for mechanical support — armor adds unnecessary weight.',
            },
            {
              id: 'T03-L03-Q3',
              type: 'fill-in-blank',
              prompt:
                'The ________ inside a CST-armored cable lets installers remove the steel layer without damaging the fiber bundle.',
              answer: 'ripcord',
              answerDisplay: 'ripcord',
              explanation:
                'An internal ripcord (strong yarn or cord) under the corrugated steel armor lets the installer split the armor layer cleanly. This is confirmed in OCC D-Series product documentation: "steel-armor is easily removed with an internal ripcord." Using metal cutters on armored cable without a ripcord risks nicking the inner cable assembly.',
            },
            {
              id: 'T03-L03-Q4',
              type: 'mc',
              prompt:
                'A direct-burial OSP cable route passes through a property with a known woodchuck population. What is the minimum armor specification?',
              choices: [
                'No armor — woodchucks cannot gnaw through HDPE jacket',
                'Corrugated aluminum tape (CAT) — lighter than steel and sufficient for most rodents',
                'CST (corrugated steel tape) armor — steel provides the gnaw-stop barrier',
                'Armor is not required — use double-wall HDPE conduit instead',
              ],
              answerIndex: 2,
              explanation:
                'CST armor is required in rodent-active areas for direct-burial cable. HDPE jacket alone is insufficient — gnawing animals can penetrate polyethylene. Steel creates a mechanical barrier that stops rodent damage. (Source: ICEA S-87-640 Annex; FOA OSP installation guidelines). Double-wall conduit is an alternative but the question specifies direct-burial cable, not conduit.',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
