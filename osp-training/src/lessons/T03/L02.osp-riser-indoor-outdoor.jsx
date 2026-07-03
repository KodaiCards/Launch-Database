// T03.L02 — OSP vs. Riser vs. Indoor/Outdoor Rating
// Foundation lesson: fire ratings, dual-rated cables, NEC 50-ft rule

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Sortable from '../../components/primitives/Sortable.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T03.L02',
  course_id: 'T03',
  title: 'OSP vs. Riser vs. Indoor/Outdoor Rating',
  order: 2,
  lesson_type: 'working',
  prerequisites: ['T03.L01'],
  learning_objectives: [
    'Define the NEC fire-rating designations OFNR and OFNP and the test standards each must pass',
    'Apply the NEC §770.48(A) 50-ft unlisted cable entry rule to real building-entry scenarios',
    'Distinguish between outdoor-rated (UV-stable) and indoor fire-rated cable properties',
    'Specify the correct cable type for aerial, underground, and building-entry segments of a route',
    'Recognize when a dual-rated cable eliminates the need for a building-entry transition splice',
  ],
  vocabulary_introduced: [
    'OFNR',
    'OFNP',
    'outdoor-rated',
    'dual-rated',
  ],
  vocabulary_assumed: [
    { term: 'OSP',      source_lesson_id: 'T01.L01' },
    { term: 'sheath',   source_lesson_id: 'T01.L03' },
    { term: 'NEC',      source_lesson_id: 'T01.L08' },
    { term: 'loose-tube', source_lesson_id: 'T03.L01' },
    { term: 'ICEA S-87-640', source_lesson_id: 'T03.L01' },
  ],
  key_terms: [
    {
      term: 'OFNR',
      definition:
        'Optical Fiber Nonconductive Riser. NEC Article 770 fire rating for vertical runs in building shafts; cable must not propagate flame floor-to-floor. Must pass UL 1666 vertical flame propagation test.',
    },
    {
      term: 'OFNP',
      definition:
        'Optical Fiber Nonconductive Plenum. Highest NEC fire rating for air-handling plenums; cable must produce low smoke and no halogen gases when burned. Must pass UL 910 / NFPA 262 flame and smoke test.',
    },
    {
      term: 'outdoor-rated',
      definition:
        'A cable with UV-stabilized jacket (typically carbon-black-loaded polyethylene) suitable for direct sun exposure without degradation. All OSP cables are inherently outdoor-rated. Indoor fire ratings and outdoor UV resistance are separate properties that a dual-rated cable combines.',
    },
    {
      term: 'dual-rated',
      definition:
        'A cable with both an OSP-rated outer jacket and an indoor fire rating (OFNR or OFNP), allowing it to enter a building without transition at the building entry point. Allowed to run up to 50 ft inside a building without a listed indoor-only transition under NEC §770.48(A).',
    },
  ],
  estimated_minutes: 20,
};

export default function T03L02_OSPRiserIndoorOutdoor() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Every cable has at least two independent sets of requirements: can it survive
          outdoors (UV, moisture, temperature), and can it survive in a fire without
          killing people inside a building?
        </p>
        <p className="mt-2">
          Most OSP cables are built for the outdoors but are not rated for indoor fire
          safety. That's fine — until the cable has to cross into a building. At that
          moment, the National Electrical Code (NEC) steps in with fire rating requirements.
          Get this wrong and you might be ripping out cable during a building inspection,
          or worse.
        </p>
        <p className="mt-2">
          This lesson covers the three fire-rating levels you'll encounter — OFNG (unlisted),
          OFNR (riser), and OFNP (plenum) — and the practical rule that determines when you
          need each one.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Quick meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OFNG</td>
              <td className="px-3 py-2">Optical Fiber Nonconductive General-use</td>
              <td className="px-3 py-2">No specific fire rating — unlisted; limited indoor use</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OFNR</td>
              <td className="px-3 py-2">Optical Fiber Nonconductive Riser</td>
              <td className="px-3 py-2">Passes vertical flame test; OK in risers (stairwells, elevator shafts)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OFNP</td>
              <td className="px-3 py-2">Optical Fiber Nonconductive Plenum</td>
              <td className="px-3 py-2">Low smoke + low flame; required in air-handling plenums</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NEC</td>
              <td className="px-3 py-2">National Electrical Code (NFPA 70)</td>
              <td className="px-3 py-2">The U.S. standard that sets electrical and cabling requirements for buildings</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDPE</td>
              <td className="px-3 py-2">High-Density Polyethylene</td>
              <td className="px-3 py-2">Standard OSP outer jacket material; UV-stabilized with carbon black</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The 50-foot rule — memorize this</h3>
        <p>
          Under NEC Article 770 §770.48(A), an unlisted OSP cable (no indoor fire rating)
          can enter a building and run up to <strong>50 feet</strong> before it must transition
          to a cable with the appropriate indoor fire rating. Beyond 50 ft, you need either a
          listed transition fitting, an innerduct rated for the space, or a cable that carries
          the indoor rating as well as the outdoor rating.
        </p>
        <p className="mt-2 text-sm text-slate-300/80">
          Source: NEC NFPA 70-2023 §770.48(A) — confirmed via multiple public NEC commentary
          sources. The 50 ft value is paywalled in the NEC full text but widely cited by
          industry sources including cabling industry technical guides.
        </p>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Three Fire Rating Levels</h2>

        <h3 className="mt-4 font-semibold">Why fire ratings matter for cable</h3>
        <p>
          When a building is on fire, the biggest immediate threat to occupants isn't always
          the flame itself — it's smoke. Burning PVC jacket (used in older cables) produces
          thick toxic smoke that incapacitates people before they can evacuate. The NEC fire
          ratings exist to force cables in occupied buildings to use low-smoke, low-toxicity
          jacket materials.
        </p>
        <p className="mt-2">
          The three levels (lowest to highest protection):
        </p>

        <div className="mt-3 space-y-4">
          <div className="border border-white/10 rounded-lg p-4 bg-white/3">
            <p className="font-semibold text-slate-100">OFNG — Unlisted (no indoor rating)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              Standard OSP cable. May be used in limited indoor runs up to 50 ft under
              §770.48(A). Cannot be used in risers or plenums regardless of distance.
              Jacket is typically HDPE — excellent outdoors but may produce more smoke
              and flame than rated indoor cable if exposed to fire.
            </p>
          </div>
          <div className="border border-blue-400/20 rounded-lg p-4 bg-blue-400/5">
            <p className="font-semibold text-blue-300">OFNR — Riser rated</p>
            <p className="text-sm text-slate-300/90 mt-1">
              Required for vertical runs in building riser shafts (between floors). Must
              pass the UL 1666 vertical flame propagation test — the cable must not carry
              flame upward more than a specified distance when a burner is applied at the
              bottom. Typically uses LSZH (Low Smoke Zero Halogen) or similar low-smoke
              jacket compound. (Source: NEC Art. 770 — confirmed via public NEC commentary)
            </p>
          </div>
          <div className="border border-amber-400/20 rounded-lg p-4 bg-amber-400/5">
            <p className="font-semibold text-amber-300">OFNP — Plenum rated (highest)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              Required for any cable run through an air-handling plenum — the space above
              dropped ceilings or below raised floors that HVAC air circulates through.
              Must pass UL 910 / NFPA 262 test: both flame spread and smoke density are
              measured. Plenum jacket compounds are the most restrictive and most expensive.
              (Source: NEC Art. 770 — confirmed via public NEC commentary; UL 910 test standard)
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>OFNP can substitute for OFNR</strong> — a higher-rated cable can
              always replace a lower-rated one. The substitution hierarchy: OFNP can go
              anywhere; OFNR can go in risers and general areas but not plenums; OFNG
              goes only in limited unlisted locations. (Source: NEC Art. 770 substitution
              hierarchy — confirmed via industry commentary)
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">OSP jacket and UV protection</h3>
        <p>
          Standard OSP cables use HDPE (High-Density Polyethylene) jacket with 2–3% carbon
          black added. That carbon black absorbs UV radiation from sunlight, preventing the
          photodegradation of the polymer that would otherwise cause the jacket to crack and
          crumble over years of sun exposure.
        </p>
        <p className="mt-2">
          This carbon-black loading is mandatory for any cable exposed to direct sunlight.
          It's one reason OSP cables are black. (Source: bwnfiber.com HDPE vs. LDPE
          comparison; shobeirshimi.com: "carbon black (2–3%) is added to both MDPE and
          HDPE for UV stabilization")
        </p>
        <p className="mt-2">
          A dual-rated cable adds an indoor fire-rated jacket compound (LSZH or plenum
          material) to the OSP UV-stabilized design. The cable meets both outdoor UV
          requirements AND the NEC indoor fire test. This lets the cable cross the building
          entry without a transition — helpful when the splice point or termination panel is
          more than 50 ft inside the building.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> NEC §770.48(A) says unlisted OSP cable can go up to 50 ft
            inside a building. Period. No interpretation needed — the code is clear.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> In practice, on rural FTTH builds the splice point is
            often in a pedestal outside the building, and only a short 2–4F drop enters the
            home. With a 20 ft in-home run to the ONT, the 50 ft rule is never even close
            to a concern. But on commercial buildings — especially when running feeder cable
            to a communications room several floors up — the 50 ft limit can be exceeded on
            a single riser run, and that's where contractors get caught.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk:</strong> Failing the building inspection for using unlisted OSP
            cable in a riser means removing and replacing the cable — pulling the route
            again at full labor cost. A dual-rated cable spec on the front end costs maybe
            $0.10/ft more; the inspection failure costs several times that in rework.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>AHJ override risk:</strong> Local Authorities Having Jurisdiction (AHJ) — your city or county building official — can and sometimes do impose stricter requirements than the NEC minimum. In some jurisdictions, any unlisted OSP cable entering the building requires transition at the entry point regardless of the 50 ft NEC provision. Confirm with the local AHJ on commercial projects before relying on the 50 ft exemption.
          </p>
        </div>
      </section>

      {/* ── BRANCHING SCENARIO ───────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T03-L02-scenario-1"
        title="Building Entry Decision Tree"
        description="A 96F OSP feeder cable needs to enter a multi-story building. Walk through the decisions."
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            text: 'Your 96F OSP feeder (unlisted HDPE jacket) needs to enter a commercial building. Where does the cable terminate inside the building?',
            choices: [
              { label: 'Demarcation point 20 ft from building entry (same floor)', nextId: 'short-run' },
              { label: 'Communications room on the 4th floor — about 80 ft of cable run inside', nextId: 'long-run' },
              { label: 'Plenum space above the 2nd floor ceiling — cable runs 30 ft through the ceiling cavity', nextId: 'plenum-run' },
            ],
          },
          'short-run': {
            id: 'short-run',
            text: '20 ft is under the 50 ft limit in NEC §770.48(A). Your unlisted OSP cable is permitted for this run without a transition or indoor fire-rated cable. No change to cable spec required.',
            choices: [
              { label: 'What if the AHJ (Authority Having Jurisdiction) interprets the 50 ft rule differently?', nextId: 'ahj-note' },
              { label: 'Start over', nextId: 'start' },
            ],
          },
          'long-run': {
            id: 'long-run',
            text: '80 ft exceeds the 50 ft limit. You have two options: (A) Use a dual-rated OSP/OFNR cable for the entire run — no transition needed. (B) Run standard OSP cable to 50 ft, then splice or connect to a listed OFNR-rated indoor cable for the remaining 30 ft. Option A is cleaner — one cable, no mid-run splice.',
            choices: [
              { label: 'Does the riser shaft require OFNP instead of OFNR?', nextId: 'riser-vs-plenum' },
              { label: 'Start over', nextId: 'start' },
            ],
          },
          'plenum-run': {
            id: 'plenum-run',
            text: 'Air-handling plenum space requires OFNP — the highest fire rating. Even though the run is only 30 ft, the NEC does not allow any cable not rated OFNP in a plenum, regardless of distance. You must spec an OSP/OFNP dual-rated cable or run standard OSP to the plenum edge and transition to OFNP.',
            choices: [
              { label: 'Can OFNR substitute for OFNP here?', nextId: 'no-ofnr-in-plenum' },
              { label: 'Start over', nextId: 'start' },
            ],
          },
          'ahj-note': {
            id: 'ahj-note',
            text: 'The 50 ft rule is from NEC §770.48(A), but the AHJ has authority to impose stricter requirements locally. In some jurisdictions, any OSP cable inside the building requires an indoor rating regardless of length. Always confirm with the local AHJ before assuming the 50 ft exemption applies. If in doubt, spec the rated cable.',
            choices: [{ label: 'Back to start', nextId: 'start' }],
          },
          'riser-vs-plenum': {
            id: 'riser-vs-plenum',
            text: 'A riser shaft between floors is a riser environment — OFNR is required. The space above dropped ceilings where HVAC air circulates is a plenum — OFNP is required. These are distinct spaces with distinct NEC requirements. Know which you\'re routing through before specifying.',
            choices: [{ label: 'Back to start', nextId: 'start' }],
          },
          'no-ofnr-in-plenum': {
            id: 'no-ofnr-in-plenum',
            text: 'No. OFNR cannot substitute for OFNP in an air-handling plenum. The substitution hierarchy goes UP only: OFNP can replace OFNR; OFNR cannot replace OFNP. The plenum requires the highest-rated cable. (NEC Art. 770 substitution hierarchy)',
            choices: [{ label: 'Back to start', nextId: 'start' }],
          },
        }}
      />

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">UL test methods — what they actually measure</h3>
        <p>
          <strong>UL 1666 (OFNR test):</strong> A cable sample is run vertically. A
          propane burner is applied to the bottom for 30 minutes. The cable must not carry
          flame more than 4.6 m (15 ft) above the burner ignition point. This simulates a
          fire in the lower portion of a riser shaft that could spread to upper floors via
          a burning cable jacket.
        </p>
        <p className="mt-2">
          <strong>UL 910 / NFPA 262 (OFNP test):</strong> The Steiner tunnel test. A cable
          is installed horizontally in a 25 ft duct with forced air flow. A gas flame is
          applied. Both flame-spread index (≤ 0.5) and smoke development index (≤ 0.15 peak
          optical density) must be met. The plenum test is far stricter than the riser test
          because HVAC air circulation would carry smoke throughout a building quickly if the
          cable burned and produced toxic smoke in the air-handling system.
        </p>

        <h3 className="mt-5 font-semibold">LSZH — a fourth option in specific markets</h3>
        <p>
          Low Smoke Zero Halogen (LSZH) jackets are required in some European standards and
          in U.S. applications where halogen exposure is a particular concern (hospitals,
          aircraft hangars, transportation terminals). LSZH doesn't map directly to the
          OFNR/OFNP hierarchy — it's a material property specification, not an NEC fire
          rating. An LSZH cable can be listed as OFNR, OFNP, or neither depending on
          whether it passes the relevant UL test. When a spec says "LSZH," confirm whether
          it also requires OFNR or OFNP listing. The two are not the same thing.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            The fire ratings you learned here connect to your broader design practice:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T04.L05 Indoor Cable Routing</strong> — When you design the interior portion of a project (cables entering the CO/hut), fire ratings determine which cables you can run through plenums vs. riser shafts vs. conduit in open areas.</li>
            <li><strong>T06.L02 Underground Cable Fill &amp; Conduit</strong> — Underground cable selection parallels the indoor logic: the protection method (direct bury vs. conduit) influences cost and NEC compliance categories.</li>
            <li><strong>T08.L07 Make-Ready &amp; Pole Attachment</strong> — On joint-use poles, cable routing around power and telephone lines comes with specific clearance rules and fire-rating implications if the plant is near structures.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            Fire ratings are not theoretical — they're the legal boundary between a code-compliant design and a safety liability.
          </p>
        </section>
      </section>

      {/* ── SORTABLE: fire rating hierarchy ─────────────────────────────── */}
      <Sortable
        title="Rank Cable Fire Ratings — Lowest to Highest Protection"
        instructions="Drag the cable ratings into order from lowest fire protection (top) to highest (bottom)."
        items={[
          { id: 'ofnp', label: 'OFNP — Optical Fiber Nonconductive Plenum' },
          { id: 'ofng', label: 'OFNG — Unlisted / General-use (no indoor fire rating)' },
          { id: 'ofnr', label: 'OFNR — Optical Fiber Nonconductive Riser' },
        ]}
        correctOrder={['ofng', 'ofnr', 'ofnp']}
        explanation="From lowest to highest: OFNG (no indoor rating, ≤50 ft unlisted use) → OFNR (passes UL 1666 riser test, used in vertical shafts) → OFNP (passes UL 910 plenum test, required in air-handling spaces). A higher-rated cable can always substitute downward: OFNP can go anywhere OFNR or OFNG is required. (NEC Art. 770 substitution hierarchy)"
      />

      {/* ── KEY TERMS FLASHCARDS ──────────────────────────────────────────── */}
      <Flashcard
        deckId="T03-L02"
        cards={[
          {
            id: 'T03-L02-fc-ofnr',
            front: 'What does OFNR mean and where is it required?',
            back: 'Optical Fiber Nonconductive Riser. Required for vertical runs in building riser shafts (stairwells, elevator shafts, between floors). Must pass UL 1666 vertical flame propagation test. Cannot propagate flame floor-to-floor. (NEC Article 770)',
          },
          {
            id: 'T03-L02-fc-ofnp',
            front: 'What does OFNP mean and where is it required?',
            back: 'Optical Fiber Nonconductive Plenum. Required in air-handling plenums (above dropped ceilings or below raised floors where HVAC air circulates). Highest NEC fire rating. Must pass UL 910 / NFPA 262 for both flame spread AND smoke density. (NEC Article 770)',
          },
          {
            id: 'T03-L02-fc-50ft',
            front: 'How far can unlisted OSP cable run inside a building under NEC Article 770?',
            back: 'Up to 50 feet under NEC §770.48(A). Beyond 50 ft, the cable must transition to a listed indoor-rated cable (OFNR or OFNP depending on the space type), or a dual-rated OSP/OFNR or OSP/OFNP cable must be used for the entire run.',
          },
          {
            id: 'T03-L02-fc-dual',
            front: 'What is a dual-rated cable?',
            back: 'A cable combining an OSP outer jacket (UV-stabilized HDPE with carbon black) and an indoor fire rating (OFNR or OFNP). Allows the cable to cross the building entry without a transition fitting, and to run more than 50 ft inside the building while remaining NEC-compliant.',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ───────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T03"
        assessmentId="T03-L02"
        title="Check — OSP vs. Riser vs. Indoor/Outdoor"
        fallback={
        <Quiz
          title="Check — OSP vs. Riser vs. Indoor/Outdoor"
          mode="multiple-choice"
          questions={[
            {
              id: 'T03-L02-Q1',
              type: 'mc',
              prompt:
                'Which fiber optic cable type is required for installation in an air-handling plenum?',
              choices: [
                'OFNR — passes the riser vertical flame test',
                'OFNG — unlisted general use',
                'OFNP — passes UL 910 / NFPA 262 flame and smoke test',
                'Any cable rated OSP with UV-stabilized HDPE jacket',
              ],
              answerIndex: 2,
              explanation:
                'OFNP (Optical Fiber Nonconductive Plenum) is required in air-handling plenums. It must pass UL 910 / NFPA 262 for both low flame spread and low smoke density. OFNR can be used in riser shafts but NOT in plenums. (NEC Article 770)',
              citation: 'NEC NFPA 70-2023 §770; UL 910 / NFPA 262.',
            },
            {
              id: 'T03-L02-Q2',
              type: 'mc',
              prompt:
                'An unlisted outdoor OSP cable enters a commercial building at grade level. The termination panel is 35 ft from the building entry. What is required?',
              choices: [
                'Transition to OFNP immediately at the building entry',
                'No additional action — 35 ft is under the 50 ft limit in NEC §770.48(A)',
                'Transition to OFNR at the 25 ft mark',
                'The cable cannot enter a building at all without a transition',
              ],
              answerIndex: 1,
              explanation:
                '35 ft is within the 50 ft unlisted entry allowance under NEC §770.48(A). No transition is required. The 50 ft limit applies to the total run of unlisted cable inside the building from the building entry point. (Source: NEC §770.48 — confirmed via public NEC commentary)',
              fieldNote:
                'Always confirm with the local AHJ — some jurisdictions require indoor fire-rated cable for any interior run regardless of the 50 ft federal code provision.',
            },
            {
              id: 'T03-L02-Q3',
              type: 'fill-in-blank',
              prompt:
                'The carbon black content in HDPE OSP jacket material provides ________ resistance.',
              answer: 'UV',
              answerDisplay: 'UV (ultraviolet)',
              explanation:
                '2–3% carbon black is added to HDPE jacket compound specifically to absorb UV radiation and prevent oxidative photodegradation. Without it, the HDPE jacket would become brittle and crack within a few years of sun exposure. (Source: bwnfiber.com; shobeirshimi.com)',
            },
            {
              id: 'T03-L02-Q4',
              type: 'mc',
              prompt:
                'Which cable type can legally substitute for OFNR cable in a building riser shaft?',
              choices: [
                'OFNG (unlisted general-use)',
                'Standard OSP with HDPE jacket',
                'OFNP (plenum-rated)',
                'No cable can substitute — only OFNR is permitted in riser shafts',
              ],
              answerIndex: 2,
              explanation:
                'OFNP is a higher fire rating than OFNR and can substitute downward. A plenum-rated cable exceeds the riser requirement. The NEC Article 770 substitution hierarchy: OFNP can go anywhere; OFNR can go in risers and general areas (but not plenums); OFNG is limited to unlisted locations only.',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
