// T03.L06 — Cable Sheath & Jacket Material Selection
// Working lesson: HDPE, LSZH, flooding compound, dry-block, carbon black

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T03.L06',
  course_id: 'T03',
  title: 'Cable Sheath & Jacket Material Selection',
  order: 6,
  lesson_type: 'working',
  prerequisites: ['T03.L02', 'T03.L03'],
  learning_objectives: [
    'State why HDPE with 2–3% carbon black loading is the standard OSP jacket material',
    'Distinguish between LSZH jacket chemistry and OFNR/OFNP NEC fire-performance listing — they are independent requirements',
    'Explain the difference between gel-filled (flooding compound) and dry-block (SAP tape/yarn) water-blocking and the field implications for splice prep time',
    'Select the correct jacket material for aerial, direct-burial, and indoor-rated applications',
    'Identify when LSZH is required vs. when standard HDPE is sufficient',
  ],
  vocabulary_introduced: [
    'LSZH',
    'flooding compound',
    'water-blocking tape',
    'dry-block',
    'carbon black loading',
  ],
  vocabulary_assumed: [
    { term: 'sheath',        source_lesson_id: 'T01.L03' },
    { term: 'HDPE',          source_lesson_id: 'T01.L08' },
    { term: 'OFNR',          source_lesson_id: 'T03.L02' },
    { term: 'OFNP',          source_lesson_id: 'T03.L02' },
    { term: 'outdoor-rated', source_lesson_id: 'T03.L02' },
    { term: 'dual-rated',    source_lesson_id: 'T03.L02' },
    { term: 'loose-tube',    source_lesson_id: 'T03.L01' },
  ],
  key_terms: [
    {
      term: 'LSZH',
      definition:
        'Low Smoke Zero Halogen. A jacket material that produces minimal smoke and no halogen gases when burned. Required in public buildings, healthcare facilities, and transportation environments where smoke toxicity is a regulatory concern. Not the default for outdoor-only OSP runs (HDPE is standard OSP).',
    },
    {
      term: 'flooding compound',
      definition:
        'A gel (typically petroleum-based or non-petroleum synthetic) filling the cable core to block water migration longitudinally. Standard in gel-filled loose-tube cables. Requires cleaning with isopropyl alcohol before splicing.',
    },
    {
      term: 'water-blocking tape',
      definition:
        'SAP (superabsorbent polymer) tapes and yarns wrapped around the cable core that swell on contact with water to block migration. Used in dry-block cable designs as an alternative to flooding compound gel.',
    },
    {
      term: 'dry-block',
      definition:
        'A cable water-blocking design using SAP tapes or yarns instead of petroleum gel. Requires no gel cleanup at splice prep — typically achievable in approximately one-third the time of gel-filled tube prep. Also called "gel-free" construction.',
    },
    {
      term: 'carbon black loading',
      definition:
        '2–3% carbon black added to polyethylene jacket compound to absorb UV radiation and prevent oxidative degradation from sunlight. Standard in all outdoor OSP cable jackets. The primary reason OSP cables are black.',
    },
  ],
  estimated_minutes: 22,
};

export default function T03L06_CableSheathJacketMaterial() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Think of cable jacket material selection the same way you'd pick clothing for
          different weather conditions. HDPE (High-Density Polyethylene) is your outdoor
          work jacket — tough, UV-resistant, handles rain and cold. LSZH is your
          fire-retardant coverall for working in a building where smoke could be lethal.
          The wrong jacket for the environment means either the cable degrades prematurely
          or it violates a fire code.
        </p>
        <p className="mt-2">
          The other material decision that directly affects your splice time is what's
          <em>inside</em> the buffer tubes: <strong>flooding compound (gel)</strong> or
          <strong> dry-block (SAP tapes)</strong>. Both keep water out. But gel cables
          require cleanup before you can splice; dry-block cables don't. That's a real
          productivity difference on large splice closures.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">Stands for</th>
              <th className="px-3 py-2 text-left">In the field</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDPE</td>
              <td className="px-3 py-2">High-Density Polyethylene</td>
              <td className="px-3 py-2">Standard black OSP cable jacket; UV-stabilized with carbon black</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">LSZH</td>
              <td className="px-3 py-2">Low Smoke Zero Halogen</td>
              <td className="px-3 py-2">Fire-safe jacket for hospitals, airports, public buildings</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SAP</td>
              <td className="px-3 py-2">Superabsorbent Polymer</td>
              <td className="px-3 py-2">Gel-replacement in dry-block cables; swells to block water on contact</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IPA</td>
              <td className="px-3 py-2">Isopropyl Alcohol</td>
              <td className="px-3 py-2">Used to clean flooding compound off fibers before fusion splicing</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Jacket Materials — Matching the Compound to the Environment</h2>

        <h3 className="mt-4 font-semibold">HDPE with carbon black — the outdoor standard</h3>
        <p>
          HDPE is the default jacket material for virtually all OSP cables. Its properties
          make it well-suited to outdoor OSP environments:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>UV resistance via carbon black:</strong> 2–3% carbon black is added
            to the HDPE compound specifically to absorb UV radiation. Without it, the HDPE
            would oxidize and become brittle within a few years of sun exposure. This is
            why all outdoor OSP cables are black. (Source: bwnfiber.com HDPE vs. LDPE
            comparison; shobeirshimi.com: "carbon black (2–3%) is added to both MDPE and
            HDPE for UV stabilization")
          </li>
          <li>
            <strong>Crush resistance:</strong> HDPE's semi-crystalline structure gives it
            good compressive strength, which matters for direct-burial applications where
            soil loads act on the cable jacket. (Source: ICEA S-87-640; Corning SMF-28
            Ultra datasheet)
          </li>
          <li>
            <strong>Operating temperature:</strong> Standard OSP HDPE jackets are rated
            −40°C to +70°C. (Source: ICEA S-87-640; Corning SMF-28 Ultra datasheet —
            confirmed as −40°C to +70°C via vendor datasheets)
          </li>
          <li>
            <strong>Not fire-rated for indoor use:</strong> HDPE can burn and produce
            significant smoke. It does not pass NEC Article 770 fire tests (UL 910 or UL
            1666). Standard OSP HDPE cable is unlisted for indoor use beyond the 50-ft
            exemption. (T03.L02 covered this in full.)
          </li>
        </ul>

        <h3 className="mt-5 font-semibold">LSZH — when halogen-free matters</h3>
        <p>
          Low Smoke Zero Halogen (LSZH) jacket compounds are formulated to produce:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>Minimal smoke volume when burning (reduces visual impairment during evacuation)</li>
          <li>No halogen gases (no hydrogen chloride, no hydrogen fluoride — both are acutely toxic in fire atmospheres)</li>
        </ul>
        <p className="mt-2">
          LSZH is required where halogen-free mandates apply: hospitals, airports, train
          stations, public assembly buildings. In some European standards, LSZH is the
          default for any indoor cable regardless of space type. (Source: cbcables.com LSZH
          guide; comms-express.com LSZH article)
        </p>
        <p className="mt-2 text-sm text-amber-300/90 border-l-4 border-amber-400/30 pl-3">
          <strong>Important distinction:</strong> LSZH is a <em>material property</em>, not
          an NEC fire rating. An LSZH cable can be listed as OFNR, OFNP, or neither
          depending on whether it also passes the relevant UL flame test. "LSZH" on a spec
          sheet does NOT automatically mean OFNP. When a spec requires both LSZH and OFNP,
          confirm the cable carries both designations.
        </p>

        <h3 className="mt-5 font-semibold">Gel-filled vs. dry-block — the splice time decision</h3>
        <p>
          Inside a loose-tube cable, the space between fibers and the tube wall is filled
          with one of two things:
        </p>

        <div className="mt-3 space-y-3">
          <div className="border border-white/10 rounded-lg p-4 bg-white/3">
            <p className="font-semibold text-slate-100">Flooding compound (gel)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              A petroleum-based or synthetic gel fills every void inside the tube. The gel
              is highly viscous — it flows slowly to plug any water entry point while the
              cable is stationary, then sets around the fibers. Gel-filled cables have been
              the industry standard for decades: highly reliable water blocking, excellent
              long-term performance.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>The tradeoff:</strong> The gel must be cleaned off every fiber before
              splicing. Gel clings tenaciously and requires isopropyl alcohol (IPA) wipes,
              sometimes multiple passes. On a 288-fiber closure with 24 gel-filled tubes,
              gel cleanup is a significant fraction of total splice time.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>High-count tubes:</strong> "When working with buffer tubes that have
              more than 12 fibers in the same tube, the gel acts as an adhesive by keeping
              the fiber bundles grouped." (Source: stl.tech dry vs. gel comparison)
            </p>
          </div>

          <div className="border border-blue-400/20 rounded-lg p-4 bg-blue-400/5">
            <p className="font-semibold text-blue-300">Dry-block / gel-free (SAP tapes and yarns)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              SAP (superabsorbent polymer) tape and yarns are wrapped in and around the
              fiber bundle inside the tube. On contact with water, SAP absorbs it
              rapidly — swelling to many times its dry volume — and physically blocks
              further migration. No liquid gel, no cleanup.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>Splice speed:</strong> "Accomplished in approximately one third the
              time required for the same operation in a 'wet' tube cable." (Source:
              remee.com gel-free loose-tube article)
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>The tradeoff:</strong> Dry-block cables can be slightly more
              sensitive to water vapor (vs. liquid water) in high-humidity environments
              over multi-decade lifespans. For most U.S. OSP deployments, dry-block
              performance is fully acceptable and increasingly preferred.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (ICEA S-87-640):</strong> Specifies flooding compound viscosity,
            coverage requirements, and dry-block SAP tape minimum swell specifications.
            The 2016/2023 editions are paywalled — core requirements are drawn from the 2006
            archive.org edition and multiple vendor datasheets. Confirm exact compound
            specs against the ICEA S-87-640 current edition for formal contract specifications.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> The dry-block vs. gel decision is increasingly
            made by the engineer during design, not in the field. But splicers need to
            know what they're working with when they open a tube: gel-filled tubes get
            the IPA bottle; dry-block tubes get the dry wipe. Treating a gel tube as
            dry will leave gel residue under the splice sleeve, which can cause elevated
            splice loss or moisture contamination over time.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk:</strong> The most common gel-related field problem is
            incomplete gel removal before fusion splicing. Gel residue on the fiber end
            doesn't always show up immediately in the splicer's loss estimate — it can
            develop into elevated loss as the residue thermally cycles at the splice.
            Clean until the fiber shows no gel sheen under the scope, not just until the
            wipe looks clean.
          </p>
        </div>
      </section>

      {/* ── BRANCHING SCENARIO ───────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T03-L06-scenario-1"
        title="Jacket and Fill Material Decision Tree"
        description="Specify the jacket and fill material for three different cable applications."
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            text: 'You\'re specifying cable material for three separate applications. Which do you want to work through first?',
            choices: [
              { label: 'Direct-burial FTTH feeder in an open rural field', nextId: 'db-rural' },
              { label: 'Indoor-outdoor run through a hospital building', nextId: 'hospital' },
              { label: 'High-count aerial feeder — splicer time is the constraint', nextId: 'aerial-dry' },
            ],
          },
          'db-rural': {
            id: 'db-rural',
            text: 'Direct-burial FTTH feeder in a rural field. No indoor routing. Exposed to UV, soil moisture, temperature swings. Correct spec: HDPE jacket with 2–3% carbon black for UV resistance + gel-filled or dry-block loose-tube construction for moisture protection. No LSZH needed (no indoor use). No special fire rating.',
            choices: [
              { label: 'What if the route passes through a wooded area with known woodchuck activity?', nextId: 'db-rodent' },
              { label: 'Back to start', nextId: 'start' },
            ],
          },
          'db-rodent': {
            id: 'db-rodent',
            text: 'In rodent-active areas, add CST armor (from T03.L03). Final spec: HDPE-jacketed, CST-armored, direct-burial, gel or dry-block loose-tube. The HDPE outer jacket still provides UV protection on any above-grade portion; the CST handles rodent gnawing underground.',
            choices: [{ label: 'Back to start', nextId: 'start' }],
          },
          hospital: {
            id: 'hospital',
            text: 'Hospital building — indoor-outdoor route. HDPE alone won\'t pass fire or halogen requirements. The hospital likely requires both: (1) LSZH (no halogen gases in a healthcare environment — patients and staff on life support can\'t tolerate toxic smoke), and (2) OFNR if running vertically in a riser shaft, OFNP if running in an air-handling plenum. You need a cable carrying all three designations: OSP-rated + LSZH + OFNR (or OFNP). Confirm the cable\'s UL listing explicitly.',
            choices: [{ label: 'Back to start', nextId: 'start' }],
          },
          'aerial-dry': {
            id: 'aerial-dry',
            text: 'High-count aerial feeder with large splice closures. The single biggest lever on splice time is gel-filled vs. dry-block. Dry-block SAP tubes reduce per-tube prep time to ~1/3 of gel-filled time. For a 288F or 432F closure, that\'s measured in hours saved. If splice labor cost is significant in the project budget, specify dry-block (gel-free) loose-tube cable. HDPE jacket is still correct for the aerial environment.',
            choices: [{ label: 'Back to start', nextId: 'start' }],
          },
        }}
      />

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">MDPE vs. HDPE — when medium-density polyethylene appears</h3>
        <p>
          Some older cable specs reference MDPE (Medium-Density Polyethylene) instead of
          HDPE. MDPE has slightly lower crystallinity — it's more flexible than HDPE but
          has lower compressive strength. For aerial cables where flexibility at cold
          temperatures is important, MDPE is sometimes preferred. For direct-burial where
          crush resistance matters, HDPE is the better choice. Both require 2–3% carbon
          black for outdoor UV stabilization. Modern specifications typically call out HDPE
          or MDPE explicitly; don't assume one when the other is specified.
        </p>

        <h3 className="mt-5 font-semibold">Gel compound types — petroleum vs. non-petroleum</h3>
        <p>
          Traditional flooding gel is petroleum-based (similar to a very thick grease).
          Non-petroleum gels (silicone-based or synthetic) are used in applications where
          compatibility with certain sleeve materials or environmental regulations is a
          concern. Non-petroleum gels are also easier to clean in some formulations.
          For most OSP work, either type performs equivalently — but if a contract spec
          calls out "non-petroleum gel," substitute carefully and verify compatibility
          with the splice case manufacturer's materials.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Jacket material specifications cascade through environmental and performance analysis:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>Environmental Factors &amp; Temperature Extremes</strong> — MDPE vs. HDPE choice depends on the deployment: MDPE for aerial where cold-temperature flexibility matters; HDPE for buried where crush resistance is the constraint. The material properties directly affect real-world failure modes.</li>
            <li><strong>Pole Loading &amp; Cable Sag</strong> — Jacket stiffness (HDPE is stiffer) affects how the cable hangs on a span. Stiffer jackets reduce initial sag but can increase micro-bend loss if the fiber inside is over-bent. Flex-favorable designs (MDPE) may require larger sag allowances.</li>
            <li><strong>Material &amp; Hardware Acceptance</strong> — During construction closeout, you verify that received cable matches spec — HDPE vs. MDPE is a first-sight inspection item, and gel type (petroleum vs. non-petroleum) matters if the splice case or heat-shrink has specific material compatibility requirements.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            Jacket material is not a fine-print detail — it's a performance and compatibility lever that affects decades of field behavior.
          </p>
        </section>
      </section>

      {/* ── KEY TERMS FLASHCARDS ──────────────────────────────────────────── */}
      <Flashcard
        deckId="T03-L06"
        cards={[
          {
            id: 'T03-L06-fc-lszh',
            front: 'What does LSZH mean and where is it required?',
            back: 'Low Smoke Zero Halogen. A jacket material that produces minimal smoke and no halogen gases when burned. Required in hospitals, airports, and public buildings where halogen-free fire environments are mandated. Not the same as an NEC fire rating — an LSZH cable must also carry OFNR or OFNP listing to be used in risers or plenums.',
          },
          {
            id: 'T03-L06-fc-flooding',
            front: 'What is flooding compound (gel) in a loose-tube cable?',
            back: 'A petroleum-based or synthetic gel filling the cable core to block water migration longitudinally. Standard in gel-filled loose-tube designs. Requires isopropyl alcohol cleaning before splicing — gel must be completely removed from fibers before fusion. High-count tubes: gel also keeps fiber bundles grouped. (stl.tech; remee.com)',
          },
          {
            id: 'T03-L06-fc-waterblocking',
            front: 'What is a water-blocking tape in an OSP cable?',
            back: 'SAP (superabsorbent polymer) tape or yarn wrapped around the cable core that swells on contact with water, blocking longitudinal water migration. Used in dry-block (gel-free) cable designs as an alternative to flooding compound. The water-blocking tape is the key component that eliminates the need for gel cleanup at splice prep.',
          },
          {
            id: 'T03-L06-fc-dryblock',
            front: 'What is a dry-block cable and its main field advantage?',
            back: 'SAP (superabsorbent polymer) tapes and yarns replace gel in the buffer tubes, swelling on contact with water to block migration. No gel cleanup needed before splicing — prep time is approximately 1/3 of gel-filled cable. Increasingly preferred on high-count closures where splice labor time is significant. (remee.com)',
          },
          {
            id: 'T03-L06-fc-carbon',
            front: 'Why is carbon black added to HDPE cable jacket?',
            back: '2–3% carbon black is added to HDPE jacket compound to absorb UV radiation and prevent oxidative photodegradation. Without it, the polyethylene jacket would become brittle and crack within a few years of sun exposure. This is the primary reason all outdoor OSP cables are black. (bwnfiber.com; shobeirshimi.com)',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ───────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T03"
        assessmentId="T03-L06"
        title="Check — Cable Sheath & Jacket Material"
        fallback={
        <Quiz
          title="Check — Cable Sheath & Jacket Material"
          mode="multiple-choice"
          questions={[
            {
              id: 'T03-L06-Q1',
              type: 'mc',
              prompt:
                'Which jacket type is standard for outdoor OSP cables exposed to direct sunlight?',
              choices: [
                'PVC (polyvinyl chloride) — low cost and widely available',
                'LSZH (Low Smoke Zero Halogen) — required for all outdoor applications',
                'HDPE with 2–3% carbon black — UV-stabilized, standard for all OSP',
                'LDPE (Low-Density Polyethylene) — most flexible option',
              ],
              answerIndex: 2,
              explanation:
                'HDPE with 2–3% carbon black is the standard outdoor OSP jacket. The carbon black absorbs UV radiation to prevent oxidative degradation. PVC is a common indoor jacket but poor for outdoor UV. LSZH is a fire-safety material choice, not an UV-resistance solution. LDPE has lower compressive strength than HDPE. (Source: ICEA S-87-640; bwnfiber.com; shobeirshimi.com)',
            },
            {
              id: 'T03-L06-Q2',
              type: 'mc',
              prompt:
                'A gel-free dry-block cable\'s main installation advantage over gel-filled is:',
              choices: [
                'Higher fiber count per tube',
                'Faster splice prep — approximately 1/3 the prep time (no gel cleanup required)',
                'Better UV resistance from the carbon black SAP combination',
                'Longer span capability due to lower cable weight',
              ],
              answerIndex: 1,
              explanation:
                'Dry-block (gel-free) cables eliminate gel cleanup from splice prep. "Accomplished in approximately one third the time required for the same operation in a \'wet\' tube cable." (Source: remee.com gel-free loose-tube article). On a high-count 288F or 432F closure, the time savings per tube adds up to hours.',
            },
            {
              id: 'T03-L06-Q3',
              type: 'dragdrop',
              prompt:
                'Match each application to the correct jacket material specification.',
              items: [
                { id: 'hospital', label: 'Indoor cable in hospital riser shaft' },
                { id: 'db',       label: 'OSP direct-burial in rural field' },
                { id: 'plenum',   label: 'Cable in data center air-handling plenum' },
              ],
              targets: [
                { id: 'tlszh',  label: 'LSZH + OFNR listed' },
                { id: 'thdpe',  label: 'HDPE with carbon black (outdoor-rated)' },
                { id: 'tofnp',  label: 'OFNP plenum-rated jacket (UL 910 / NFPA 262)' },
              ],
              correctMap: { tlszh: 'hospital', thdpe: 'db', tofnp: 'plenum' },
              explanation:
                'Hospital riser: LSZH (no halogen in healthcare) + OFNR listed for the riser shaft. OSP direct burial: HDPE with carbon black — UV resistance and outdoor durability. Data center plenum: OFNP-listed plenum material is required regardless of LSZH designation. (NEC Art. 770; ICEA S-87-640; NEC §770.48)',
            },
            {
              id: 'T03-L06-Q4',
              type: 'fill-in-blank',
              prompt:
                'The chemical additive in an HDPE outer jacket that prevents UV photodegradation is called ________ ________.',
              answer: 'carbon black',
              answerDisplay: 'carbon black',
              explanation:
                '2–3% carbon black is compounded into the HDPE jacket. Carbon black absorbs UV radiation, shielding the polymer chains from the oxidative damage that sunlight would otherwise cause. It is why all OSP cables are black — not for looks, but for longevity. (bwnfiber.com; shobeirshimi.com)',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
