// T03.L07 — Armor Selection Deep-Dive
// Advanced lesson: CST vs interlocked vs CAT, dielectric cables, NEC §770.179(B)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import ReferencesBlock from '../../components/ReferencesBlock.jsx';

export const meta = {
  id: 'T03.L07',
  course_id: 'T03',
  title: 'Armor Selection Deep-Dive',
  order: 7,
  lesson_type: 'advanced',
  prerequisites: ['T03.L03', 'T03.L04'],
  learning_objectives: [
    'Describe the corrugated aluminum tape (CAT) armor and when it is preferred over CST',
    'Define dielectric cable and explain why it eliminates bonding/grounding requirements at poles',
    'Correctly interpret NEC §770.179(B) as listing the permitted armor configurations for indoor fiber cable in riser applications, enabling UL-listed CST-armored cables to be installed in building riser shafts',
    'Select the appropriate armor type for corrosive soil environments vs. standard direct-burial vs. aerial applications',
    'Explain the galvanic corrosion risk of CST/interlocked armor in coastal or industrial soil environments',
  ],
  vocabulary_introduced: [
    'corrugated aluminum tape (CAT)',
    'dielectric cable',
    'NEC §770.179(B)',
  ],
  vocabulary_assumed: [
    { term: 'corrugated steel tape (CST)',  source_lesson_id: 'T03.L03' },
    { term: 'interlocked armor',            source_lesson_id: 'T03.L03' },
    { term: 'direct-burial',               source_lesson_id: 'T03.L03' },
    { term: 'rodent-proof armor',          source_lesson_id: 'T03.L03' },
    { term: 'ADSS',                         source_lesson_id: 'T01.L08' },
    { term: 'NEC',                          source_lesson_id: 'T01.L08' },
    { term: 'NESC',                         source_lesson_id: 'T01.L02' },
  ],
  key_terms: [
    {
      term: 'corrugated aluminum tape (CAT)',
      definition:
        'A variant of metallic cable armor using aluminum corrugations instead of steel. Lighter than CST, with better corrosion resistance in many environments. Used in aerial and conduit applications where the primary concern is crush resistance and weight, not rodent protection.',
    },
    {
      term: 'dielectric cable',
      definition:
        'A cable with NO metallic components whatsoever — no armor, no messenger, no metallic strength members. All-dielectric cables require no bonding or grounding. ADSS is the aerial dielectric type; some underground cables are also fully dielectric when run in conduit.',
    },
    {
      term: 'NEC §770.179(B)',
      definition:
        'The NEC provision listing permitted armor types for indoor fiber optic cable in vertical riser shafts. CST-armored cables UL-listed per this section can be used in building risers despite containing metal armor.',
    },
  ],
  estimated_minutes: 22,
};

export default function T03L07_ArmorDeepDive() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          The Armor and Jacket Selection lesson introduced the two main armor types — CST
          for direct-burial and interlocked for indoor-outdoor riser. This lesson goes
          deeper: three armor types total (adding corrugated aluminum tape), plus the
          important cases where <em>no armor at all</em> is the right answer.
        </p>
        <p className="mt-2">
          The core skill here is matching armor to environment without over-specifying.
          Armor adds cost, weight, and installation complexity. Use it when the threat
          justifies it; skip it when conduit or cable type handles the load.
        </p>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Three Armor Types + No Armor — The Full Matrix</h2>

        <h3 className="mt-4 font-semibold">Quick review: CST and interlocked armor (recap)</h3>
        <p className="text-sm text-slate-300/80">
          From the Armor and Jacket Selection lesson: CST (corrugated steel tape) wraps
          around the cable longitudinally; best for direct-burial and rodent protection.
          Interlocked armor uses helical metal strips; best for indoor-outdoor riser with
          NEC §770.179(B) listing. Both provide crush resistance and rodent protection.
        </p>

        <h3 className="mt-5 font-semibold">Corrugated aluminum tape (CAT) — the lighter option</h3>
        <p>
          CAT replaces steel with aluminum in the corrugated armor design. Aluminum is:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li><strong>Lighter</strong> — about 1/3 the density of steel; meaningful for aerial and long cable reels</li>
          <li><strong>Better corrosion resistance</strong> — aluminum forms a passive oxide layer; no rust in moist soil or coastal environments</li>
          <li><strong>Softer</strong> — less rodent resistance than steel; a determined gnawing animal can penetrate aluminum more easily than steel</li>
        </ul>
        <p className="mt-2">
          CAT is common in aerial applications (where weight matters) and conduit runs
          (where the conduit already handles the mechanical threat, and aluminum's lighter
          weight and corrosion resistance are advantages). For direct-burial in rodent-active
          areas, steel CST remains the preferred choice over CAT.
        </p>

        <h3 className="mt-5 font-semibold">No armor — when dielectric wins</h3>
        <p>
          A <strong>dielectric cable</strong> has zero metallic content: no steel armor,
          no aluminum, no copper ground wire, no steel strength members. Aramid yarn
          (Kevlar) or fiberglass rods provide all the structural function.
        </p>
        <p className="mt-2">
          <strong>Why this matters:</strong> With no metal in the cable, no bonding or
          grounding is required anywhere along the route. Bonding every dead-end pole is a
          real labor and material cost. On a new
          FTTH aerial build with 150 poles, each bonding assembly (ground rod, clamp, bond
          wire) might cost $50–$150 in materials and 30–60 minutes of labor. That's $7,500–
          $22,500 in bonding alone — before counting the inspection and documentation for
          each ground. Dielectric cable eliminates all of that.
        </p>
        <p className="mt-2">
          Beyond ADSS aerial cables, dielectric duct cables (loose-tube, no armor,
          aramid/fiberglass strength members only) are also used for underground conduit
          runs where:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>The conduit provides all mechanical protection (no crush or rodent threat)</li>
          <li>Soil chemistry is aggressive (high chloride, low pH) — no steel means no corrosion risk</li>
          <li>Bonding avoidance is a priority (joint-use telecom on electric-utility-owned conduit)</li>
        </ul>

        <h3 className="mt-5 font-semibold">NEC §770.179(B) — the indoor riser armor rule</h3>
        <p>
          When an armored cable enters a building riser shaft, a question arises: does
          the metal armor disqualify the cable from the NEC Article 770 fire rating?
        </p>
        <p className="mt-2">
          NEC §770.179(B) answers this directly: it lists the permitted armor configurations
          for indoor fiber cable in riser applications. CST-armored cables that are UL-listed
          per this section can be used in building risers despite containing metal.
        </p>
        <p className="mt-2 text-sm">
          Example from real product documentation: some manufacturers' CST-armored cables
          (e.g., OCC's D-Series) are UL listed specifically in accordance with NEC section
          770.179(b). This means the steel armor + HDPE jacket combination has been tested
          and passes the riser flame-spread requirement alongside the armor.
        </p>
        <p className="mt-2 text-sm text-amber-300/90 border-l-4 border-amber-400/30 pl-3">
          <strong>Note:</strong> Governing code — NEC §770.179(B) (NFPA 70-2023).
        </p>

        <h3 className="mt-5 font-semibold">Armor selection matrix — complete picture</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Armor type</th>
                <th className="px-3 py-2 text-left">Material</th>
                <th className="px-3 py-2 text-left">Best for</th>
                <th className="px-3 py-2 text-left">Avoid when</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">CST</td>
                <td className="px-3 py-2">Corrugated steel tape</td>
                <td className="px-3 py-2">Direct-burial, rodent areas, indoor-outdoor riser (NEC 770.179(B) listed)</td>
                <td className="px-3 py-2">Aerial (adds weight); dielectric-required joint-use</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Interlocked</td>
                <td className="px-3 py-2">Helical aluminum or steel strips</td>
                <td className="px-3 py-2">Indoor-outdoor riser with OFNR/OFCR listing; campus underground</td>
                <td className="px-3 py-2">High-rodent areas (steel CST is stronger gnaw barrier)</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">CAT</td>
                <td className="px-3 py-2">Corrugated aluminum tape</td>
                <td className="px-3 py-2">Aerial/conduit where weight and corrosion matter more than rodent resistance</td>
                <td className="px-3 py-2">Rodent-active direct-burial (steel CST required)</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">None (dielectric)</td>
                <td className="px-3 py-2">No metal</td>
                <td className="px-3 py-2">ADSS aerial; duct cable where conduit provides protection; joint-use no-bond scenarios; corrosive soils</td>
                <td className="px-3 py-2">Direct-burial without conduit in rodent or crush environments</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (ICEA S-87-640):</strong> Defines armor geometry, material grades,
            corrosion protection requirements, and minimum coverage for each armor type.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> The most common armor mistake isn't the wrong type —
            it's armor on the wrong segment. A common scenario: a crew installs the same
            CST-armored direct-burial cable for the entire route including the aerial section,
            because that's what was on the truck. CST aerial cable works, but it's heavier
            than necessary, which increases sag and may require a heavier messenger strand.
            If the poles weren't engineered for that load, you've just exceeded the design
            loading.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk of over-specifying armor on aerial:</strong> Every extra lb/ft of
            cable weight increases sag for a given span. An over-heavy aerial cable can
            push midspan sag below NESC clearance requirements — requiring either additional
            poles (shortening span) or heavier messenger strand — both of which are expensive
            field corrections.
          </p>
        </div>
      </section>

      {/* ── INSTALLATION ERROR QUIZ ──────────────────────────────────────── */}
      <Quiz
        title="Spot the Armor Installation Error"
        mode="multiple-choice"
        questions={[
          {
            id: 'T03-L07-HS-Q1',
            type: 'mc',
            prompt:
              'A splicer needs to open a CST-armored cable at the building entry point. Rather than using the internal ripcord, they cut across the armor with a utility blade. The outer jacket shows a small nick at the entry. Which best describes the consequence?',
            choices: [
              { text: 'No consequence — the armor is the last layer, so a nick on the jacket does not affect the fibers.', correct: false },
              { text: 'The nick allows water to wick into the cable and creates a stress concentration point over the inner assembly, risking fiber damage over time.', correct: true },
              { text: 'The nick only matters if the cable is buried — on aerial cable, the jacket nick is acceptable.', correct: false },
              { text: 'The utility blade technique is the field-standard method; the ripcord is only for factory use.', correct: false },
            ],
            rationale:
              'Nicked jackets allow water ingress and stress-concentrate on the underlying fibers. Always use the internal ripcord to open CST armor. Never cut across the armor with a blade that can reach the inner assembly.',
          },
          {
            id: 'T03-L07-HS-Q2',
            type: 'mc',
            prompt:
              'A CST-armored direct-burial cable transitions from the buried section to a building entry. At the transition point, the installer bent the cable sharply (well under the 10× OD minimum bend radius) to route it through the wall conduit. The jacket looks undamaged. What is the likely outcome?',
            choices: [
              { text: 'No issue — only the jacket needs to be intact; the fibers inside are protected by the armor.', correct: false },
              { text: 'The sharp bend can fracture fibers inside the inner assembly even when the jacket appears undamaged; OTDR testing is required.', correct: true },
              { text: 'The bend is only a problem if ice loading is present; in a building entry environment it is acceptable.', correct: false },
              { text: 'CST armor prevents any bend-induced stress from reaching the fibers; a visual jacket check is sufficient.', correct: false },
            ],
            rationale:
              'A sharp bend at the armor termination concentrates mechanical stress on the cable. Kinking at the armor end can fracture fibers even when the jacket appears undamaged. Always maintain the minimum bend radius (at least 10× cable OD for installation).',
          },
          {
            id: 'T03-L07-HS-Q3',
            type: 'mc',
            prompt:
              'A CST-armored cable enters a building. The installer attached a bonding clamp to the CST armor and connected it to the building\'s grounding system. A coworker says this is unnecessary and should be removed. Who is correct?',
            choices: [
              { text: 'The coworker is correct — bonding is only required for power cables, not fiber cables.', correct: false },
              { text: 'The installer is correct — any metallic cable component entering a building must be bonded to the building grounding system per NEC Article 770.', correct: true },
              { text: 'Both are correct — bonding is optional for CST armor in low-lightning areas.', correct: false },
              { text: 'The coworker is correct — bonding creates a ground loop that can interfere with fiber signals.', correct: false },
            ],
            rationale:
              'The bonding clamp is required. Any metallic cable component (including CST armor) entering a building must be bonded to the building grounding system. The clamp provides a low-impedance path to ground for lightning-induced surge currents. Dielectric ADSS cable would not require this — but CST armor does.',
          },
        ]}
      />

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">How armor selection ripples through design and field work</h3>
        <p>
          The armor type you pick in this lesson connects to three downstream phases: (a) the strength-member and messenger selection covered in Messenger Cable — Lashed vs. ADSS (armored cables are heavier → higher sag → may require heavier messenger), (b) underground routing decisions covered in OSP Design — Underground (CST armor in corrosive soil → long-term reliability risk), and (c) bonding and grounding practice covered in Bonding, Grounding &amp; Electrical Protection (armored CST entering a building must be bonded per NEC 770.48 — but THAT bond is exactly where galvanic corrosion becomes a hidden 30-year problem if the armor touches dissimilar metals in the conduit).
        </p>
        <p className="mt-2">
          Consider a real scenario: an aerial cable transitions to a direct-burial conduit run under a city street. The design calls for CST-armored cable (good for rodents in the burial section). But the conduit also carries a copper grounding wire (installed decades ago for water main bonding). Over time, the steel CST and copper wire corrode galvanically in wet soil. The armor loses strength silently. Twenty years later, a road cut cracks the conduit, water infiltrates, and the cable fails — far downstream of the original design decision. Designers and crew leads who understand armor selection tradeoffs catch this risk at design time: either isolate the armor from the copper wire, or spec aluminum (CAT) armor or fully dielectric cable in corrosive environments.
        </p>
        <p className="mt-2">
          This Advanced section explores the physics and field consequences so you understand why "armor selection" is not a spec detail — it's a decision that shapes 30-year plant reliability.
        </p>

        <h3 className="mt-5 font-semibold">Galvanic corrosion — when steel armor meets dissimilar metals</h3>
        <p>
          In a buried environment, steel CST armor can corrode galvanically when it comes
          into contact with a dissimilar metal through a common electrolyte (wet soil). The
          practical concern: if a CST-armored cable share a conduit or handhole with copper
          grounding wire and the two touch in wet soil, the steel armor becomes the
          sacrificial anode and corrodes preferentially. This is rarely catastrophic (the
          outer jacket is the first barrier), but on a 30-year plant it can become a factor.
        </p>
        <p className="mt-2">
          Mitigation: keep the CST armor electrically isolated from dissimilar metals in
          the conduit system, or specify aluminum (CAT) armor or dielectric cable in
          high-corrosion environments where the long-term galvanic concern outweighs the
          rodent-protection advantage of steel.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Galvanic corrosion knowledge connects to long-term plant reliability:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>Route Survey &amp; Pre-Engineering</strong> — Soil conductivity and pH testing should feed armor material selection. High-chloride coastal soil (like sea-salt spray zones) → aluminum armor or dielectric. Neutral pH agricultural soil with rodent pressure → steel CST.</li>
            <li><strong>Bonding, Grounding &amp; Electrical Protection</strong> — Bonding metallic armor to ground is mandatory per NEC 770.48; but THAT BOND is where galvanic corrosion becomes a 30-year problem if the armor touches dissimilar metals in the conduit. Proper isolation sleeves and material selection prevent it.</li>
            <li><strong>Underground Construction Inspection</strong> — During construction inspection, verify that buried conduit configuration matches the approved design. CST armor in a conduit shared with copper grounding wire (without isolation) is a hidden corrosion time-bomb that won't fail for 10+ years.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            The armor you choose today determines whether a 30-year plant stays reliable or degrades silently into failure.
          </p>
        </section>
      </section>

      <ReferencesBlock
        items={[
          { citation: 'ICEA S-87-640', note: 'Defines armor geometry, material grades, corrosion protection requirements, and minimum coverage for CST, interlocked, and CAT armor.' },
          { citation: 'NEC (NFPA 70) §770.179(B)', note: 'Lists the permitted armor configurations for indoor fiber cable in riser applications.' },
          { citation: '7 CFR 1755.902', note: 'RUS minimum performance specification, referenced for dielectric/ADSS cable on RUS-financed projects.' },
        ]}
      />

      {/* ── KEY TERMS FLASHCARDS ──────────────────────────────────────────── */}
      <Flashcard
        deckId="T03-L07"
        cards={[
          {
            id: 'T03-L07-fc-cat',
            front: 'What is CAT armor and how does it differ from CST?',
            back: 'Corrugated Aluminum Tape. Uses aluminum instead of steel for the corrugated armor layer. Lighter and better corrosion resistance than steel CST, but softer — less effective against determined rodent gnawing. Best for aerial and conduit applications; not the first choice for rodent-active direct-burial. (ICEA S-87-640)',
          },
          {
            id: 'T03-L07-fc-dielectric',
            front: 'What is a dielectric cable and why is it used?',
            back: 'A cable with NO metallic components — no armor, no messenger, no metallic strength members. Aramid yarn or fiberglass rods provide all structural function. Key advantage: no bonding or grounding required at any attachment point. Used for ADSS aerial cables, duct cables in corrosive soils, and joint-use scenarios where bonding adds cost. (7 CFR 1755.902; CommScope)',
          },
          {
            id: 'T03-L07-fc-nec770',
            front: 'What does NEC §770.179(B) govern?',
            back: 'The NEC provision listing permitted armor configurations for indoor fiber optic cable in building riser shafts. CST-armored cables UL-listed per §770.179(B) can be installed in risers despite containing metal armor — the armor + jacket combination has passed the UL 1666 riser flame test. (OCC D-Series product documentation)',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ───────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T03"
        assessmentId="T03-L07"
        title="Check — Armor Selection Deep-Dive"
        fallback={
        <Quiz
          title="Check — Armor Selection Deep-Dive"
          mode="multiple-choice"
          questions={[
            {
              id: 'T03-L07-Q1',
              type: 'mc',
              prompt:
                'Which armor type is preferred for a direct-burial route in a coastal area where soil pH is low and corrosion is a concern, but no rodent activity has been documented?',
              choices: [
                'CST (corrugated steel tape) — highest rodent protection',
                'Interlocked armor — best for all underground applications',
                'CAT (corrugated aluminum tape) — lighter and better corrosion resistance than steel',
                'No armor — conduit eliminates all mechanical risk',
              ],
              answerIndex: 2,
              explanation:
                'In a corrosive soil environment (low pH, coastal chlorides) with no documented rodent activity, aluminum armor (CAT) is preferred over steel CST. Aluminum forms a passive oxide layer that resists corrosion, whereas steel will rust if the outer jacket is breached. Without a rodent threat, the softer aluminum is acceptable. (ICEA S-87-640 armor options)',
            },
            {
              id: 'T03-L07-Q2',
              type: 'mc',
              prompt:
                'A CST-armored cable with NEC §770.179(B) UL listing is being installed in a building riser shaft. The contractor asks whether the metal armor requires bonding to the building ground. The correct answer is:',
              choices: [
                'No — the UL listing exempts the armor from NEC bonding requirements',
                'No — riser shaft cables never require bonding regardless of armor type',
                'Yes — any metallic component entering the building must be bonded to the building grounding system',
                'Only if the cable is also carrying electrical power alongside fiber',
              ],
              answerIndex: 2,
              explanation:
                'Any metallic cable component — including CST armor — must be bonded to the building\'s grounding electrode system at the building entry. The UL listing confirms the cable is suitable for riser use, but it does not exempt the armor from the NEC bonding requirement. (NEC Art. 770 bonding requirements)',
            },
            {
              id: 'T03-L07-Q3',
              type: 'fill-in-blank',
              prompt:
                'A cable with no metallic components whatsoever — relying on aramid yarn or fiberglass for structural support — is called a ________ cable.',
              answer: 'dielectric',
              answerDisplay: 'dielectric',
              explanation:
                'A dielectric cable has zero metal content. No bonding or grounding is required at any attachment or entry point. ADSS aerial cables are dielectric. Dielectric duct cables are also available for underground runs in conduit where no bonding is desired and the conduit provides mechanical protection. (7 CFR 1755.902; CommScope ADSS documentation)',
            },
            {
              id: 'T03-L07-Q4',
              type: 'mc',
              prompt:
                'A project engineer specifies CST-armored cable for an aerial lashed section. What is the practical risk of this over-specification?',
              choices: [
                'CST armor provides less UV protection than unarmored HDPE on aerial cable',
                'The extra weight of CST armor increases sag, potentially violating NESC clearance requirements without heavier messenger strand',
                'CST armor is not UL listed for outdoor use',
                'There is no risk — CST armor is always acceptable regardless of installation environment',
              ],
              answerIndex: 1,
              explanation:
                'CST armor adds significant weight per unit length compared to unarmored cable. Increased cable weight means increased midspan sag for a given span and messenger tension. If the poles were engineered for unarmored cable weight, the CST version may push sag below NESC clearance requirements. The fix (shorter spans or heavier messenger) is expensive. Specify armor only where the threat justifies it.',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
