// T14.L03 — Messenger Bonding Rules
// Working lesson: NESC Rule 215D, bond clamp + downlead assembly, ADSS exemption

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T14.L03',
  course_id: 'T14',
  title: 'Messenger Bonding Rules',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T14.L02', 'T05.L02'],
  vocabulary_introduced: [
    'messenger bond',
    'bond clamp',
    'downlead',
    'NESC Rule 215D',
    'bonded-messenger separation',
    'ADSS exemption',
  ],
  key_terms: [
    {
      term: 'messenger bond',
      definition:
        'The electrical connection between the steel messenger wire and the grounding system at a pole, made via a listed bond clamp and a downlead conductor to the ground rod. Required at every splice closure per NESC Rule 215D on joint-use poles with an MGN distribution system.',
    },
    {
      term: 'bond clamp',
      definition:
        'A listed mechanical connector that clamps to the messenger wire and accepts a downlead conductor. Must be listed for the messenger diameter and the downlead gauge. The clamp creates the low-impedance electrical path from the messenger to the downlead.',
    },
    {
      term: 'downlead',
      definition:
        'The conductor that runs from the bond clamp (or from the messenger through the clamp) down the pole to the ground rod. Minimum #6 AWG bare soft-drawn copper for most OSP applications per NESC Rule 96. Protected from mechanical damage from grade to 8 feet above grade.',
    },
    {
      term: 'NESC Rule 215D',
      definition:
        'The NESC rule (C2-2023, Part 2 §21 — Grounding and Bonding) that requires bonding of messengers, supply neutrals, and metallic poles on joint-use aerial plant. Rule 215D requires the communication messenger to be bonded to the supply system MGN at every splice closure (or at equivalent intervals). This is the primary authority for messenger bonding intervals. (Source: NESC C2-2023 Rule 215D.)',
    },
    {
      term: 'bonded-messenger separation',
      definition:
        'A reduced clearance distance allowed between a bonded fiber messenger and the distribution neutral conductor because, when the messenger is bonded to the neutral, both are at the same potential — no arc risk. Specifically, NESC permits reduced vertical separation for a bonded messenger because bonding eliminates the voltage difference that the standard clearance is designed to manage.',
    },
    {
      term: 'ADSS exemption',
      definition:
        'All-dielectric self-supporting cable has no metallic armor, no messenger wire, and no conductive component — it cannot carry fault current or accumulate charge. ADSS cable is therefore exempt from the messenger bonding requirement. There is nothing to bond.',
    },
  ],
  vocabulary_assumed: [
    { term: 'grounding', source_lesson_id: 'T14.L01' },
    { term: 'bonding', source_lesson_id: 'T14.L01' },
    { term: 'fault current', source_lesson_id: 'T14.L01' },
    { term: 'MGN', source_lesson_id: 'T01.L08' },
    { term: 'neutral wire', source_lesson_id: 'T14.L02' },
    { term: 'messenger', source_lesson_id: 'T01.L03' },
    { term: 'armor', source_lesson_id: 'T01.L03' },
    { term: 'span', source_lesson_id: 'T01.L02' },
    { term: 'clearance', source_lesson_id: 'T01.L02' },
    { term: 'joint-use', source_lesson_id: 'T01.L02' },
    { term: 'NESC', source_lesson_id: 'T01.L02' },
  ],
  learning_objectives: [
    'Specify the complete messenger bond assembly at a joint-use pole: bond clamp, downlead conductor size, and ground rod',
    'Identify the NESC rule that governs messenger bonding intervals',
    'Explain the ADSS exemption and why it exists',
    'Describe the bonded-messenger reduced-separation benefit and when it applies',
  ],
  estimated_minutes: 25,
};

export default function T14L03_MessengerBondingRules() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> You learned in <strong>T14.L01</strong> that the goal of grounding is to give fault current a path to earth, and in <strong>T14.L02</strong> that MGN systems achieve that by bonding the distribution neutral at every pole. This lesson specifies HOW to bond the communications side to maintain that equipotential.
        </p>
        <p>
          Your lashed fiber cable rides on a steel messenger strand. That messenger is conductive
          metal. Under normal conditions it sits at near-earth potential because it's grounded
          at poles. But if you leave a span of messenger ungrounded — say at a mid-span splice
          closure that hasn't been properly bonded — that section can "float" and accumulate
          voltage from nearby distribution lines through inductive coupling. A crew member
          who touches a floating messenger without testing it first is at risk.
        </p>
        <p className="mt-2">
          NESC Rule 215D solves this by requiring the messenger to be bonded at every splice
          closure. This lesson covers exactly what that bond assembly looks like, how to install
          it, and the one big exception: ADSS (all-dielectric self-supporting) cable, which has
          no metal at all and therefore needs no bond.
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500 mt-4">
          <strong>Callback:</strong> Recall from <strong>T14.L02 Multi-Grounded Neutral</strong> — the neutral wire is grounded at frequent intervals (every pole) to keep it near earth potential. <strong>T14.L01 Why We Ground</strong> — bonding creates equipotential so no voltage differences cause arcing or shocking. This lesson operationalizes those principles: the messenger bond clamp + downlead assembly is how you achieve bonding of your metallic messenger to the MGN system at every splice closure.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Relevance here</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ADSS</td>
              <td className="px-3 py-2">All-Dielectric Self-Supporting</td>
              <td className="px-3 py-2">Fiber cable with no metal components — exempt from all bonding requirements</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code</td>
              <td className="px-3 py-2">Sets the bonding rules for comm plant on joint-use poles; Rule 215D is the key messenger-bonding rule</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MGN</td>
              <td className="px-3 py-2">Multi-Grounded Neutral</td>
              <td className="px-3 py-2">The distribution system your messenger bonds TO; defined in T14.L02</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">AWG</td>
              <td className="px-3 py-2">American Wire Gauge</td>
              <td className="px-3 py-2">Wire size standard — lower number = larger conductor; #6 AWG is the minimum downlead size here</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-4">
          <p className="text-sm text-slate-300 font-semibold mb-2">Quick refresher:</p>
          <ul className="text-sm space-y-1 text-slate-300/90">
            <li><strong>Bonding:</strong> Connecting conductive components to the same electrical potential so no voltage difference exists between them. From T14.L01.</li>
            <li><strong>Grounding:</strong> Connecting that common potential to the earth through an electrode. From T14.L01.</li>
            <li><strong>Neutral wire:</strong> The grounded conductor on the MGN distribution system, bonded to earth at frequent intervals. From T14.L02.</li>
            <li><strong>Messenger:</strong> The steel strand supporting the cable — metallic and must be bonded to keep it at the same potential as the neutral. From T01.L03.</li>
          </ul>
        </div>

        <h3 className="mt-6 font-semibold">The complete bond assembly — three parts</h3>
        <p className="mt-2">
          Every messenger bond at a splice closure or dead-end has three components. All three
          must be present:
        </p>
        <ol className="list-decimal ml-6 mt-2 space-y-2 text-slate-300/90">
          <li>
            <strong>Bond clamp (listed):</strong> A mechanical clamp sized for the messenger
            diameter that also accepts a downlead conductor. Must be listed (UL or equivalent)
            for the application. Common bond clamps for 6M or 10M strand accept #6 or #4 AWG
            bare copper downlead.
          </li>
          <li>
            <strong>Downlead conductor:</strong> Minimum #6 AWG bare soft-drawn copper for most
            OSP applications. This conductor runs from the bond clamp down the pole face to the
            ground rod. Protected from mechanical damage (conduit or guard strip) from grade to
            8 feet above grade. Length = distance from messenger attachment to top of ground rod,
            typically 20–35 feet depending on pole height.
            (Source: NESC C2-2023 Rule 96; RUS 1751F-630 §7.)
          </li>
          <li>
            <strong>Ground rod:</strong> 5/8-in. × 8-ft copper-clad steel rod driven at the
            pole base. The downlead terminates at a ground rod clamp on the rod. The same rod
            may serve both the distribution neutral bond and the communications downlead if both
            terminate here — that shared electrode is the correct approach (keeps everything at
            the same reference). (Source: NEC §250.52(A)(5); RUS 1751F-630 §7.)
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">NESC Rule 215D — when and where to bond</h3>
        <p className="mt-2">
          NESC Rule 215D requires the communication messenger to be bonded to the supply system
          MGN at every splice closure. In practice on a joint-use pole run, that means:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-slate-300/90">
          <li>At every mid-span splice closure on the lashed-strand cable.</li>
          <li>At dead-end poles where the messenger terminates.</li>
          <li>At every pole where a downlead is installed (which, combined with the closure requirement, typically means every 1,000–2,000 ft depending on span count between closures).</li>
        </ul>
        <p className="mt-2">
          <em>
            Book vs. field note: Some joint-use attachment agreements specify a less-frequent
            bonding interval (e.g., "every other pole" or "every 1,000 ft"). The NESC Rule 215D
            is the MINIMUM — if the joint-use agreement specifies every splice closure and NESC
            requires every splice closure, you're aligned. If the agreement says every 2,000 ft
            but splice closures are at 1,200 ft intervals, NESC requires the bond at the closure
            regardless. The stricter requirement controls.
            (Source: NESC C2-2023 Rule 215D; RUS 1751F-630 §7.)
          </em>
        </p>

        <h3 className="mt-5 font-semibold">The ADSS exemption — why it exists</h3>
        <p className="mt-2">
          ADSS cable — all-dielectric self-supporting — is made entirely of non-conductive
          materials: glass fibers, aramid (Kevlar) strength members, and a polyethylene jacket.
          There is no steel messenger, no aluminum armor, no metallic sheath. Nothing to bond.
        </p>
        <p className="mt-2">
          Because ADSS has no metallic components, it cannot accumulate charge, cannot carry
          fault current, and presents no electrical hazard from an ungrounded conductor.
          The bonding requirement simply doesn't apply. ADSS is self-supporting — the dielectric
          strength members in the cable carry the mechanical load that a separate steel messenger
          would otherwise carry.
        </p>
        <p className="mt-2">
          If your job uses ADSS cable, you will NOT install bond clamps, downleads, or ground
          rods for the cable itself. You may still need ground rods for other reasons (pole
          equipment, distribution plant), but the fiber plant itself has no bonding requirement.
        </p>

        <h3 className="mt-5 font-semibold">Bonded-messenger reduced separation</h3>
        <p className="mt-2">
          Here is a useful consequence of proper bonding: when the fiber messenger is bonded to
          the distribution neutral per Rule 215D, both the messenger and the neutral are at the
          same electrical potential. Since there is no voltage difference between them, the
          standard NESC vertical-separation requirement between "communications" and "neutral"
          conductors can be reduced.
        </p>
        <p className="mt-2">
          NESC permits reduced vertical separation for a bonded messenger on the same pole as
          the neutral because the normal purpose of that separation — preventing arcing between
          conductors at different potentials — is already satisfied by the bond.
          (Source: NESC C2-2023 Rule 232; also RUS 1751F-630 §7 which references this reduction
          in context of aerial RUS design.)
        </p>
        <p className="mt-2">
          In practice, this means a properly bonded lashed-fiber system can sit closer to the
          distribution neutral than an unbonded ADSS system. That's one reason some designers
          prefer lashed-strand with a bonded messenger on poles with tight vertical space.
        </p>
      </section>

      {/* ── WORKED EXAMPLE ───────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-6">
        <WorkedExample
          title="Specify the Complete Messenger Bond Assembly"
          description="Given a joint-use pole with a 230-ft span and a lashed-fiber splice closure, specify all components of the required messenger bond assembly at the pole."
          variables={[
            { key: 'span_ft', label: 'Span length', units: 'ft', default: 230, min: 50, max: 1000, step: 10 },
            { key: 'pole_height_ft', label: 'Pole height above grade', units: 'ft', default: 40, min: 20, max: 60, step: 5 },
            { key: 'attachment_height_ft', label: 'Messenger attachment height above grade', units: 'ft', default: 28, min: 15, max: 55, step: 1 },
          ]}
          formula={(v) => v.attachment_height_ft + 2}
          steps={(v) => [
            { expression: 'Step 1: Confirm cable type has a metallic messenger (not ADSS)', value: null },
            { expression: 'Step 2: Bond clamp — select listed clamp for messenger size (6M strand → 0.198-in. diameter)', value: null },
            { expression: 'Step 3: Downlead conductor — minimum #6 AWG bare soft-drawn copper', value: null },
            {
              expression: `Step 4: Downlead length = attachment height + below-grade rod depth stub`,
              value: v.attachment_height_ft + 2,
              unit: 'ft (approx)',
            },
            { expression: 'Step 5: Ground rod — 5/8-in. × 8-ft copper-clad steel, driven at pole base', value: null },
            { expression: 'Step 6: Protect downlead from grade to 8 ft above grade (conduit or guard strip)', value: null },
            { expression: 'Result: Bond assembly is complete. Meets NESC Rule 215D + RUS 1751F-630 §7.', value: null },
          ]}
          sanityCheck={(result) =>
            `Downlead length ≈ ${result} ft — covers the ${result - 2}-ft pole-face run plus the ~2-ft stub to the rod connection. Confirm the clamp is listed for the specific messenger size; unlisted hardware can cause high-resistance connections that degrade over time.`
          }
        />
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────────── */}
      <section data-tier="advanced" className="mt-8">
        <h2>Advanced: Messenger Bonding in System Design</h2>

        <p>
          Building on the foundations of grounding (<strong>T14.L01</strong>) and multi-grounded neutral systems
          (<strong>T14.L02</strong>), this section ties messenger bonding into the broader OSP plant strategy and
          shows when the bonding decision affects design choices.
        </p>

        <h3 className="mt-5 font-semibold">Messenger Bond as an Equipment Protection Layer</h3>

        <p>
          From T14.L01, you learned that grounding exists to give fault current a safe path to earth, protecting
          equipment and crew. The MGN system in T14.L02 does this for the distribution plant. Messenger bonding
          is the communications plant's connection into that equipotential: when the fiber messenger is bonded
          at splice closures, you're tying your cable sheath and any connected metallic components (closures,
          pedestals, service-drop cable armor) into the same reference potential as the utility's grounded neutral.
        </p>

        <p className="mt-3">
          This has a practical field consequence: if a distribution line breaks and falls across your joint-use pole,
          the fault current seeks the best ground path. If your messenger is bonded per NESC Rule 215D, the fault
          current flows through your cable sheath → downlead → ground rod → earth, which also means the fault
          energy is distributed among multiple paths (the utility's ground rods AND your downleads at adjacent poles).
          If your messenger is NOT bonded, the fault current that contacts your cable has nowhere to go except
          through your equipment (closure, splicer's hands, pedestals) to ground — a potentially lethal path. The
          bonding rule exists to prevent this.
        </p>

        <h3 className="mt-5 font-semibold">Design Scenario: Lashed Strand vs. ADSS Choice</h3>

        <p>
          Messenger bonding is a key input into the cable selection decision (T03). Some projects have a choice
          between lashed-strand cable (with a steel messenger that requires bonding at every closure) or ADSS
          (self-supporting, no bonding required). Here's when each choice makes sense:
        </p>

        <ul className="list-disc ml-6 mt-2 space-y-2 text-slate-300/90">
          <li>
            <strong>Lashed-strand on joint-use poles:</strong> The messenger bond strategy is already in place
            (the utility has ground rods every pole or every few poles for the MGN). Your downlead can use
            the shared ground rod, reducing cost. Vertical separation from distribution neutrals can be reduced
            per T14.L03's bonded-messenger rule (closer routing = tighter conduit runs = easier make-ready).
            Trade-off: you must install bond clamps at every splice closure — recurring labor cost, but one-time
            material cost per project.
          </li>
          <li>
            <strong>ADSS on joint-use poles with poor grounding:</strong> If the joint-use pole's ground rod
            is inadequate or far from your cable route (e.g., the pole is on sand where deep-driving is required),
            adding a downlead to a remote ground rod becomes expensive. ADSS sidesteps this: no bonding required,
            no downlead cost, no dependency on the utility's grounding infrastructure. Trade-off: ADSS cable
            is more expensive than lashed-strand; you lose the reduced-separation benefit, so your clearance
            from distribution neutrals must meet the standard separation (larger). Larger clearance may mean
            higher pole heights or new poles — assess the trade-off on your project.
          </li>
          <li>
            <strong>ADSS on solo fiber routes (no joint-use):</strong> No bonding rules apply because there is
            no MGN system on the pole. ADSS is the standard choice here. Lashed-strand would still require a
            bonding strategy (ground rod at every closure) per the broader NESC Rule 215D principle, even though
            there is no joint-use partner. ADSS eliminates that cost.
          </li>
        </ul>

        <h3 className="mt-5 font-semibold">Restoration Scenario: Bonding After Cable Damage</h3>

        <p>
          From T15 (Restoration & Outage Response), when a joint-use cable is damaged and must be spliced in the field,
          the messenger bonding rule creates a hard constraint: your splice closure MUST be bonded per Rule 215D, even
          in an emergency. This means the restoration team must:
        </p>

        <ol className="list-decimal ml-6 mt-2 space-y-2 text-slate-300/90">
          <li>
            Locate or drive a new ground rod at the splice location (if no existing rod is within bonding distance).
          </li>
          <li>
            Install a downlead from the splice closure's bond point to the ground rod.
          </li>
          <li>
            Verify the downlead is protected from grade to 8 feet above grade.
          </li>
        </ol>

        <p className="mt-2">
          This is not optional even for a "quick temporary splice." A temporary closure without a proper downlead
          bond is a floating conductor that will accumulate voltage from nearby distribution lines, creating a shock
          hazard during the follow-up permanent repair work. The team doing the permanent restoration will discover
          an ungrounded closure and must stop, drive a ground rod, install a downlead, and only then finish the splice
          installation. Planning for the ground rod and downlead before the splice starts saves hours of downstream work.
        </p>

        <h3 className="mt-5 font-semibold">Cross-Topic Integration: Bonding + Impedance</h3>

        <p>
          T14.L01 introduced grounding resistance (Rg) as a measure of how effectively an electrode gets fault current
          into the earth. A typical pole ground rod at 5/8-in. × 8-ft driven in soil yields Rg ≈ 10–25 Ω. T14.L02
          explained that the MGN system bonds the distribution neutral at frequent intervals to keep it at low impedance
          to ground. When your messenger downlead connects to that same ground rod, you're sharing the Rg. If the rod is
          already bonded to the MGN system, both the distribution neutral and your fiber cable are at the same reference
          potential — exactly the goal. If the rod is not yet bonded (perhaps it's a new pole), your downlead is the FIRST
          bond from that rod to the distribution system, and you become the low-impedance path for distribution fault current.
          This is fine (the rod performs its intended function), but it underscores why the bonding decision is not cosmetic:
          it determines the fault-current flow path in your plant.
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
              id: 'T14L03Q1',
              text: 'A crew is installing lashed-fiber cable on a joint-use pole. Per NESC Rule 215D, when is a messenger bond required?',
              options: [
                'Only at dead-end poles where the messenger terminates',
                'Only at the first and last poles of each cable segment',
                'At every splice closure and at dead-end poles',
                'Every 5,000 feet, regardless of splice closure location',
              ],
              correct: 2,
              explanation:
                'NESC Rule 215D requires the communication messenger to be bonded to the supply system MGN at every splice closure. Dead-end poles also require a bond because the messenger terminates there and would otherwise become a floating conductor segment. (Source: NESC C2-2023 Rule 215D.)',
            },
            {
              id: 'T14L03Q2',
              text: 'A job specification calls for ADSS fiber cable on joint-use poles. How does the messenger bonding requirement change?',
              options: [
                'ADSS still requires a bond clamp, but no downlead or ground rod',
                'ADSS requires bonding only at dead-end poles, not at splice closures',
                'ADSS is exempt from all messenger bonding requirements because it has no metallic components',
                'ADSS requires bonding every 2,500 ft instead of at every closure',
              ],
              correct: 2,
              explanation:
                'ADSS (all-dielectric self-supporting) cable has no metallic components — no steel messenger, no armor, no conductive sheath. There is nothing to bond. The bonding requirement exists because metallic conductors can accumulate charge and carry fault current. ADSS cannot do either, so it is fully exempt from all messenger bonding requirements.',
            },
            {
              id: 'T14L03Q3',
              text: 'What is the minimum conductor size for the downlead connecting the bond clamp to the ground rod on most OSP applications?',
              options: [
                '#10 AWG bare copper',
                '#6 AWG bare soft-drawn copper',
                '#2 AWG bare copper',
                '#14 AWG stranded copper-clad steel',
              ],
              correct: 1,
              explanation:
                'NESC Rule 96 specifies the minimum conductor size for the communications grounding conductor (downlead). For most OSP applications, the minimum is #6 AWG bare soft-drawn copper. In high-fault-current environments, NESC Rule 96C may require #4 AWG. Using a smaller conductor risks the downlead melting or failing during a fault event. (Source: NESC C2-2023 Rule 96; RUS 1751F-630 §7.)',
            },
          ]}
        />
      </section>

    </LessonLayout>
  );
}
