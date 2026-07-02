// T03.L12 — T03 Capstone Review: Cable Selection & Materials
// D031: graded inline Quiz retired — the T03-final pool is the graded capstone gate now.
// Source-of-truth: audit-output/osp-rewrite-curriculum/T03_RESEARCH_BRIEF.md (HEAD d83f0bd)
// Capstone-review type — no Flashcard, vocabulary_introduced: []

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';

export const meta = {
  id: 'T03.L12',
  course_id: 'T03',
  title: 'T03 Capstone Review — Cable Selection & Materials',
  order: 12,
  lesson_type: 'capstone-review',
  completesOnView: true,
  prerequisites: [
    'T03.L01', 'T03.L02', 'T03.L03', 'T03.L04',
    'T03.L05', 'T03.L06', 'T03.L07', 'T03.L08',
    'T03.L09', 'T03.L10', 'T03.L11',
  ],
  vocabulary_introduced: [],
  vocabulary_assumed: [
    { term: 'NEC', source_lesson_id: 'T01.L08' },
    { term: 'FOA', source_lesson_id: 'T01.L08' },
    { term: 'RUS', source_lesson_id: 'T01.L01' },
    { term: 'ITU-T', source_lesson_id: 'T01.L09' },
    { term: 'NESC', source_lesson_id: 'T01.L02' },
    { term: 'loose-tube', source_lesson_id: 'T03.L01' },
    { term: 'tight-buffered', source_lesson_id: 'T03.L01' },
    { term: 'ribbon', source_lesson_id: 'T03.L01' },
    { term: 'rollable ribbon', source_lesson_id: 'T03.L01' },
    { term: 'OFNR', source_lesson_id: 'T03.L02' },
    { term: 'OFNP', source_lesson_id: 'T03.L02' },
    { term: 'outdoor-rated', source_lesson_id: 'T03.L02' },
    { term: 'dual-rated', source_lesson_id: 'T03.L02' },
    { term: 'corrugated steel tape (CST)', source_lesson_id: 'T03.L03' },
    { term: 'interlocked armor', source_lesson_id: 'T03.L03' },
    { term: 'direct-burial', source_lesson_id: 'T03.L03' },
    { term: 'rodent-proof armor', source_lesson_id: 'T03.L03' },
    { term: 'ADSS', source_lesson_id: 'T01.L08' },
    { term: 'messenger', source_lesson_id: 'T01.L03' },
    { term: 'lashing wire', source_lesson_id: 'T03.L04' },
    { term: 'EDS', source_lesson_id: 'T03.L04' },
    { term: 'RTS', source_lesson_id: 'T03.L04' },
    { term: 'figure-8 cable', source_lesson_id: 'T03.L04' },
    { term: 'G.657.A1', source_lesson_id: 'T03.L05' },
    { term: 'G.657.A2', source_lesson_id: 'T03.L05' },
    { term: 'G.657.B3', source_lesson_id: 'T03.L05' },
    { term: 'trench-assisted profile', source_lesson_id: 'T03.L05' },
    { term: 'LSZH', source_lesson_id: 'T03.L06' },
    { term: 'flooding compound', source_lesson_id: 'T03.L06' },
    { term: 'water-blocking tape', source_lesson_id: 'T03.L06' },
    { term: 'dry-block', source_lesson_id: 'T03.L06' },
    { term: 'carbon black loading', source_lesson_id: 'T03.L06' },
    { term: 'corrugated aluminum tape (CAT)', source_lesson_id: 'T03.L07' },
    { term: 'dielectric cable', source_lesson_id: 'T03.L07' },
    { term: 'distribution cable', source_lesson_id: 'T03.L08' },
    { term: 'feeder cable', source_lesson_id: 'T03.L08' },
    { term: 'dark fiber', source_lesson_id: 'T03.L08' },
    { term: 'growth margin', source_lesson_id: 'T03.L08' },
    { term: 'NESC loading district', source_lesson_id: 'T03.L09' },
    { term: 'Extreme Wind loading', source_lesson_id: 'T03.L09' },
    { term: 'radial ice thickness', source_lesson_id: 'T03.L09' },
    { term: 'wind pressure', source_lesson_id: 'T03.L09' },
    { term: 'qualification testing', source_lesson_id: 'T03.L10' },
    { term: 'acceptance testing', source_lesson_id: 'T03.L10' },
    { term: 'MFD tolerance (RUS)', source_lesson_id: 'T03.L10' },
    { term: 'tolerance band', source_lesson_id: 'T03.L11' },
    { term: 'aging factor', source_lesson_id: 'T03.L11' },
  ],
  learning_objectives: [
    'Evaluate cable type selection (ADSS, lashed, armored) for specific OSP deployment scenarios considering joint-use pole constraints and environmental hazards',
    'Apply knowledge of cable construction, fiber grades, and armor types to route-specification decisions across aerial, underground, and indoor segments',
    'Integrate NESC loading district requirements, span length limitations, and penetration-protection standards to make compliant cable choices',
    'Synthesize cost, installation complexity, and regulatory constraints to justify cable selections in a multi-segment design',
  ],
  estimated_minutes: 35,
};

export default function T03L12_CapstoneQuiz() {
  return (
    <LessonLayout meta={meta}>

      <section data-tier="foundations">
        <h2>T03 Capstone Review — Cable Selection &amp; Materials</h2>
        <p>
          This review spans all of T03 (L01–L11). The branching scenario below is a full
          route-specification exercise that pulls together cable construction, fiber grades,
          jacket/armor selection, ADSS/loading, and standards compliance into one real-world
          decision. The graded T03 capstone assessment — drawn from the full T03 pool — is the
          gate for the topic; this page is reading/review material, not a graded quiz.
        </p>
      </section>

      {/* BRANCHING SCENARIO — 96F RUS Georgia route */}
      <section data-tier="foundations" className="mt-4">
        <BranchingScenario
          scenarioId="T03-L12-scenario-1"
          title="Route Specification: 96F RUS Cable — Georgia"
          description={
            `You are specifying a 96-fiber cable system for a hybrid aerial-to-direct-burial run ` +
            `on a RUS project in central Georgia. The route has three segments: ` +
            `(1) an aerial section spanning 250 ft between poles in a residential neighborhood, ` +
            `(2) a direct-burial section crossing a 0.4-acre field with documented woodchuck ` +
            `activity, and (3) a building entry and 100-ft riser run inside a hospital ` +
            `communications room. Make the right cable selection at each decision point.`
          }
          startNodeId="start"
          nodes={{
            'start': {
              id: 'start',
              prompt:
                'Segment 1 — Aerial span: 250 ft between poles, residential neighborhood. ' +
                'The poles are joint-use with the electric utility. What cable type do you specify for the aerial segment?',
              choices: [
                {
                  label: 'ADSS all-dielectric — no metal components, no bonding required at each pole',
                  consequence:
                    'Correct. ADSS is ideal here — no metal components means no bonding at each pole, ' +
                    'simplified permitting on joint-use poles, and no risk of induced voltage on the fiber strand. ' +
                    'At 250 ft and 96F, ADSS is well within standard span length capability.',
                  nextId: 'burial-question',
                  isOptimal: true,
                },
                {
                  label: 'Lashed OSP cable + galvanized steel messenger — standard aerial method',
                  consequence:
                    'Lashed + messenger works, but on joint-use poles with electric utility infrastructure, ' +
                    'you now have a galvanized steel messenger that must be bonded and grounded at every pole. ' +
                    'This adds bonding hardware cost and permitting complexity. On a joint-use route, ADSS ' +
                    'is the preferred choice precisely to avoid metallic infrastructure near energized conductors. ' +
                    'Lashed OSP with separate messenger is a legitimate choice on routes without joint-use complications — ' +
                    'but for this scenario, ADSS is preferred.',
                  nextId: 'burial-question',
                },
                {
                  label: 'Armored OSP direct-burial cable lashed to the electric utility messenger',
                  consequence:
                    'Armored direct-burial cable is NOT the right choice for an aerial span. ' +
                    'Direct-burial cable lacks the tensile strength members needed for aerial self-support, ' +
                    'and lashing it to the utility messenger violates NESC clearance rules for fiber attached ' +
                    'to a power utility strand.',
                  nextId: 'start',
                },
              ],
            },
            'burial-question': {
              id: 'burial-question',
              prompt:
                'Segment 2 — Direct burial across a field with active woodchuck population. ' +
                'What armor type do you require for this segment?',
              choices: [
                {
                  label: 'Corrugated steel tape (CST) armor — industry-standard rodent protection for direct-burial',
                  consequence:
                    'Correct. CST (corrugated steel tape) armor is the standard direct-burial armor for ' +
                    'rodent protection. The corrugated steel sheath resists gnawing better than jacket ' +
                    'material alone, and it is the armor type explicitly recommended in ICEA S-87-640 ' +
                    'for direct-burial rodent-active environments.',
                  nextId: 'riser-question',
                  isOptimal: true,
                },
                {
                  label: 'No armor — dry-block construction provides sufficient protection underground',
                  consequence:
                    'Incorrect. Dry-block construction prevents longitudinal water migration — it has nothing ' +
                    'to do with rodent protection. Woodchucks (groundhogs) can and will chew through HDPE ' +
                    'jacket and even gel-filled buffer tubes if there is no armor layer. ' +
                    'In a documented rodent-active environment, CST or equivalent armor is required ' +
                    'for direct-burial cable.',
                  nextId: 'burial-question',
                },
                {
                  label: 'Interlocked armor — provides the best rodent protection',
                  consequence:
                    'Interlocked armor is primarily designed for indoor-outdoor riser applications ' +
                    '(see T03.L07) — it provides good mechanical protection but is heavier and more ' +
                    'expensive than CST for a direct-burial field crossing. CST is the standard ' +
                    'choice for direct-burial rodent protection. Interlocked armor in a direct-burial ' +
                    'trench also raises ICEA compatibility questions for that application.',
                  nextId: 'burial-question',
                },
              ],
            },
            'riser-question': {
              id: 'riser-question',
              prompt:
                'Segment 3 — Building entry and riser: The cable enters the hospital and runs 100 ft ' +
                'vertically inside a riser shaft before terminating in a communications room. ' +
                'The outer OSP jacket is unlisted (no NEC fire rating). ' +
                'What is the correct fire rating for the 100 ft vertical riser run?',
              choices: [
                {
                  label: 'OFNR (riser-rated) — required for the 100 ft vertical riser shaft; transition from outdoor cable at building entry',
                  consequence:
                    'Correct. A 100 ft vertical run inside a riser shaft exceeds the NEC §770.48(A) ' +
                    '[NEC 2023 edition — confirm edition applicable to your jurisdiction] ' +
                    '50 ft rule for unlisted OSP cable inside a building. A riser shaft is a vertical ' +
                    'pathway — OFNR (Optical Fiber Non-conductive Riser, listed to UL 1666) is the ' +
                    'minimum required rating. Transition the outdoor cable to OFNR indoor fiber at the ' +
                    'building entry, inside a transition enclosure or splice case at the building penetration point.',
                  nextId: 'mfd-question',
                  isOptimal: true,
                },
                {
                  label: 'OFNP (plenum-rated) — always required inside any commercial building',
                  consequence:
                    'OFNP (plenum-rated) is required for air-handling spaces — plenum ceilings and raised ' +
                    'access floors where HVAC air circulates. A riser shaft is NOT a plenum space; it is ' +
                    'a vertical fire-stopped pathway. OFNR is sufficient and less expensive. Specifying ' +
                    'OFNP for a riser is over-specification — OFNP can substitute for OFNR per NEC §770.154 ' +
                    '[NEC 2023 edition — confirm edition applicable to your jurisdiction], ' +
                    'but it is unnecessary cost.',
                  nextId: 'mfd-question',
                },
                {
                  label: 'No rating needed — the cable is fiber optic, which is not a fire hazard',
                  consequence:
                    'Incorrect. NEC Article 770 requires listed fire-rated cable inside buildings regardless ' +
                    'of fiber optic\'s non-conductive nature. The fire rating isn\'t about electrical hazard — ' +
                    'it\'s about combustion and smoke toxicity of the cable jacket and buffer materials. ' +
                    'An unlisted OSP cable in a 100 ft riser shaft is a code violation.',
                  nextId: 'riser-question',
                },
              ],
            },
            'mfd-question': {
              id: 'mfd-question',
              prompt:
                'Final check — RUS fiber specification: This is a RUS-financed project. Must all ' +
                '96 fibers on every cable reel be manufactured to the same MFD specification?',
              choices: [
                {
                  label: 'Yes — unless the buyer specifies otherwise, 7 CFR 1755.902 requires 9.2 µm ± 0.5 µm at 1310 nm for all SMF reels',
                  consequence:
                    'Correct. 7 CFR 1755.902 requires all single-mode fiber on a RUS-financed project ' +
                    'to be manufactured to 9.2 µm ± 0.5 µm at 1310 nm unless the buyer specifies otherwise. ' +
                    'This applies to feeder, distribution, and drop cables equally — any RUS-funded fiber.',
                  nextId: 'end',
                  isOptimal: true,
                },
                {
                  label: 'No — MFD specification only applies to the feeder cable, not drop or distribution',
                  consequence:
                    'Incorrect. 7 CFR 1755.902 applies to any fiber optic cable purchased with RUS funds — ' +
                    'there is no carve-out for drop or distribution cable. The MFD tolerance requirement ' +
                    'ensures that all reels spliced together on the project have compatible fiber geometry, ' +
                    'regardless of which tier of the network they serve.',
                  nextId: 'mfd-question',
                },
              ],
            },
            'end': {
              id: 'end',
              isEnd: true,
              prompt: 'Scenario complete.',
              endMessage:
                'You correctly specified: ADSS aerial for joint-use poles, ' +
                'CST-armored direct-burial for rodent protection, OFNR transition at building entry ' +
                'for the 100 ft riser run, and 7 CFR 1755.902 MFD compliance for all reels. ' +
                'Summary: Aerial — ADSS all-dielectric, 96F, sized for 250 ft spans. ' +
                'Direct burial — CST-armored loose-tube, 96F, dry-block or gel-filled. ' +
                'Building riser — transition to OFNR-rated indoor fiber at building entry; 100 ft riser run. ' +
                'All SMF — 7 CFR 1755.902 conforming, 9.2 µm ± 0.5 µm MFD. ' +
                'This specification is complete and defensible for a RUS project in Georgia. ' +
                'That reasoning is exactly what the graded T03 capstone assessment draws on.',
              choices: [],
            },
          }}
        />
      </section>


    </LessonLayout>
  );
}
