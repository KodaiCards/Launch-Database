// Migrated from M01 §1.4 (macrobend/microbend content preserved; AnnotatedDiagram and BranchingScenario are net-new)
// T02.L04 — Macrobend and Microbend

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T02.L04',
  course_id: 'T02',
  title: 'Macrobend and Microbend Loss',
  order: 4,
  lesson_type: 'working',
  prerequisites: ['T02.L01'],
  vocabulary_introduced: ['macrobend', 'microbend', 'bend radius', 'mandrel test', 'G.657', 'bend-insensitive fiber'],
  key_terms: [
    { term: 'macrobend', definition: 'Loss from a bend you can see with your eyes — a loop or kink in the fiber. A fiber coiled too tightly around a post, a kink behind a patch panel, a loop sitting on a sharp corner in a handhole. The bend radius is measurable in centimeters. Detectable as a discrete loss event on an OTDR trace.' },
    { term: 'microbend', definition: 'Loss from microscopic deformations you cannot see — usually sub-millimeter irregularities from improper installation, excessive cable tension, or poor buffer tube support. Shows up as elevated background attenuation on an OTDR trace rather than a discrete event.' },
    { term: 'bend radius', definition: 'The minimum radius of curvature a fiber cable can follow before the geometry breaks down enough to cause meaningful signal loss. Determined by the cable manufacturer\'s installation guide. Common rules of thumb: 20× cable OD while pulling (dynamic), 10× cable OD after installation (static).' },
    { term: 'mandrel test', definition: 'The standard qualification test for macrobend performance — wrapping fiber around a cylinder (mandrel) of specified diameter for a specified number of turns, then measuring added loss. Used to compare G.652.D and G.657 fiber bend tolerance.' },
    { term: 'G.657', definition: 'ITU-T standard defining bend-insensitive single-mode fiber. Uses a trench or ring in the cladding index profile to better confine the mode field and resist macrobend loss. G.657.A1 is compatible with G.652.D for splicing; G.657.B2/B3 may have MFD mismatch issues.' },
    { term: 'bend-insensitive fiber', definition: 'Fiber designed to resist macrobend loss at tighter bend radii than standard G.652.D SMF. Defined by ITU-T G.657. Common in FTTH drop cables that go around corners, through staples, and into tight entry conduits.' },
  ],
  vocabulary_assumed: [
    { term: 'total internal reflection', source_lesson_id: 'T02.L01' },
    { term: 'critical angle', source_lesson_id: 'T02.L01' },
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'dB/km', source_lesson_id: 'T02.L02' },
    { term: 'SMF', source_lesson_id: 'T01.L08' },
  ],
  estimated_minutes: 20,
};

export default function T02L04_MacrobendAndMicrobend() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          You learned in T02.L01 that total internal reflection (TIR) keeps light inside
          the fiber. TIR works perfectly when the fiber is straight. But bend the fiber,
          and you're changing the geometry at the core-cladding boundary — some rays hit at
          angles that no longer satisfy TIR, and light leaks out. The result: extra loss
          that wouldn't be there on a straight run.
        </p>
        <p className="mt-2">
          There are two types of bend loss:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong>Macrobend loss</strong> — loss from a bend you can see with your eyes.
            A fiber coiled too tightly around a post, a kink behind a patch panel, a loop
            sitting on a sharp corner in a handhole. The bend radius is measurable in
            centimeters.
          </li>
          <li>
            <strong>Microbend loss</strong> — loss from microscopic deformations you
            cannot see — usually sub-millimeter irregularities from improper installation,
            excessive cable tension, or poor buffer tube support. Looks like the fiber is
            straight but there are tiny waves along its length.
          </li>
        </ul>
        <p className="mt-2">
          Both grow worse as wavelength increases. That's why 1625 nm is the diagnostic
          wavelength for hunting bends: at 1625 nm, bend loss is exaggerated compared to
          1550 nm, making small bends visible on an OTDR trace.
        </p>

        <h3 className="mt-5 font-semibold">The clothesline analogy for bend radius</h3>

        <p className="mt-2">
          Think about a garden hose: you can bend it gently in a wide arc and water flows
          fine. But kink it sharply and the hose collapses — water flow stops. Fiber is
          similar. There's a minimum bend radius — the tightest arc the fiber can follow
          before the geometry breaks down enough to cause meaningful signal loss.
          Below that radius, loss climbs rapidly. Unlike the hose, there's no audible
          "snap" to warn you — the fiber looks intact but the signal is being lost.
        </p>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T02-L04"
          cards={[
            { id: 'T02-L04-fc-macrobend', front: 'What is macrobend loss?', back: 'Loss from a bend you can see with your eyes — a loop or kink in the fiber. Common causes: tight coils in a handhole, fiber pinched behind a patch panel, loops on sharp corners. The bend radius is measurable in centimeters. Shows as a discrete loss event on an OTDR trace.' },
            { id: 'T02-L04-fc-microbend', front: 'What is microbend loss?', back: 'Loss from microscopic deformations you cannot see — usually sub-millimeter irregularities from improper installation, excessive cable tension, or poor buffer tube support. Shows up as elevated background attenuation across a section of OTDR trace, not a discrete event.' },
            { id: 'T02-L04-fc-bendradius', front: 'What is the minimum bend radius for fiber cable?', back: 'The tightest arc the cable can follow before causing meaningful signal loss. Common rules of thumb: 20x cable outer diameter while pulling (dynamic), 10x cable OD after installation (static). Always verify against the specific cable manufacturer\'s installation guide.' },
            { id: 'T02-L04-fc-mandrel', front: 'What is the mandrel test for fiber?', back: 'The standard qualification test for macrobend performance -- wrapping fiber around a cylinder (mandrel) of specified diameter for a specified number of turns, then measuring added loss. G.652.D: 100 turns at 30 mm radius, max <= 0.5 dB added loss @ 1625 nm.' },
            { id: 'T02-L04-fc-g657', front: 'What is ITU-T G.657?', back: 'The standard for bend-insensitive single-mode fiber. Uses a trench or ring in the cladding index profile to better confine the mode field and resist macrobend loss. G.657.A1 is backward-compatible with G.652.D for splicing. Common in FTTH drop cables.' },
            { id: 'T02-L04-fc-bif', front: 'What is bend-insensitive fiber?', back: 'Fiber designed to resist macrobend loss at tighter bend radii than standard G.652.D SMF (per ITU-T G.657). Common in FTTH drop cables that go around corners, through staples, and into tight entry conduits. Does NOT mean abuse-proof -- mechanical bend limits still apply.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Bend Radius Rules — Book vs. Field</h2>

        <h3 className="mt-4 font-semibold">Macrobend loss — the physics</h3>
        <p>
          When a fiber is bent, the optical path on the outside of the bend is longer than
          on the inside. The light traveling along the outside edge must effectively travel
          "faster" to keep up — and at tight enough bends, the phase velocity required exceeds
          what's physically possible for TIR-bound light, so energy radiates out. The tighter
          the bend, the more energy escapes.
        </p>
        <p className="mt-2">
          Macrobend loss is highly wavelength-dependent — it grows approximately as
          exp(−C / R) where R is bend radius. The longer the wavelength, the larger the
          "evanescent field" that extends into the cladding, and the more susceptible the
          fiber is to macrobend loss. This is the physics behind why 1625 nm exaggerates
          bend events on an OTDR.
        </p>

        <h3 className="mt-5 font-semibold">The ITU-T mandrel test</h3>
        <p>
          The standard qualification test for macrobend performance wraps fiber around
          a mandrel (a cylinder of specified diameter) for a specified number of turns,
          then measures added loss. Key values from ITU-T G.652.D and G.657:
        </p>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Fiber type</th>
                <th className="px-3 py-2 text-left">Test condition</th>
                <th className="px-3 py-2 text-left">Max added loss @ 1625 nm</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">G.652.D (standard SMF)</td>
                <td className="px-3 py-2">100 turns, 30 mm radius</td>
                <td className="px-3 py-2">≤ 0.5 dB</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">G.657.A1 (bend-insensitive)</td>
                <td className="px-3 py-2">10 turns, 10 mm radius</td>
                <td className="px-3 py-2">≤ 0.75 dB</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">G.657.A2 (more bend-insensitive)</td>
                <td className="px-3 py-2">1 turn, 7.5 mm radius</td>
                <td className="px-3 py-2">≤ 0.5 dB</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Source: ITU-T G.652 (2024 edition — [confirm edition]) and ITU-T G.657 (2016 — [confirm
          current edition]). Test conditions are per the respective standard.
        </p>

        <h3 className="mt-5 font-semibold">Bend radius in practice — cable vs. fiber</h3>
        <p>
          The minimum bend radius you'll see in installation specs is for the <em>cable</em>,
          not the bare fiber. Cable specs include the jacket, buffer tubes, and any armor —
          all of which affect how the inner fiber experiences the bend. Common rules-of-thumb:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>While pulling (dynamic):</strong> Typically 20× cable outer diameter (OD)
            to prevent damage during installation.
          </li>
          <li>
            <strong>After installation (static):</strong> Typically 10× cable OD — the minimum
            long-term bend radius once the cable is at rest.
          </li>
        </ul>

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> The 10×OD / 20×OD rule-of-thumb appears in FOA guides and
            most training materials as a universal shortcut.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Pull the actual installation guide for the specific cable
            on the reel. A 288-count loose-tube OSP cable has a different minimum bend radius
            than a 12-count indoor riser cable with tight buffers. The 10×/20×OD rules are
            starting points — the cable manufacturer's data sheet is what goes in the as-built
            documentation and what matters if there's a warranty claim.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Practical tip:</strong> In handholes, the most common macrobend failure
            point is the slack loop — coiled too tightly inside a small vault. Standard practice
            is to coil slack in loops no tighter than 12-inch (30 cm) diameter. Some specs
            call for 24 inches. Check the contract.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Microbend loss</h3>
        <p>
          Microbend loss comes from deformations too small to see — typically caused by:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>Over-tensioned lashing wire crushing the cable</li>
          <li>Loose-tube cables installed in cold temperatures (cable shortens, fiber buckles inside the buffer tube)</li>
          <li>Conduit fill too tight — inner cables pressing against each other</li>
          <li>Rodents gnawing into non-armored cable (creates localized stress concentrations)</li>
          <li>Poorly packed splice trays with unsupported fiber pigtails</li>
        </ul>
        <p className="mt-2">
          Microbend loss typically shows up as elevated background attenuation on an OTDR trace
          rather than a discrete event — the fiber just looks "lossier than expected" over a section.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — G.657 Bend-Insensitive Fiber</h2>
        <p>
          ITU-T G.657 defines bend-insensitive single-mode fiber. The optical design uses a
          trench or ring in the cladding index profile to better confine the mode field and
          resist macrobend loss. There are two sub-categories:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>G.657.A1</strong> — compatible with G.652.D for splicing and system use.
            Drop cables, inside-the-home wiring. Tolerates tighter bends than G.652.D.
          </li>
          <li>
            <strong>G.657.A2 / B2 / B3</strong> — even tighter bend tolerance. A2 is still
            backward-compatible with G.652 for splicing. B2 and B3 are optimized purely for
            bend performance; MFD can differ from G.652.D, introducing splice loss if mixed.
          </li>
        </ul>
        <p className="mt-2">
          <strong>Field rule:</strong> For OSP trunk cable (aerial, underground OSP runs),
          use G.652.D. For FTTH drop cables from the tap to the ONT on the side of a house,
          G.657.A1 or A2 is standard — the drops go around corners, through staples, and into
          tight entry conduits that would cause unacceptable loss on G.652.D.
        </p>
        <p className="mt-2">
          Never mix G.657.B2/B3 into a link with G.652.D without accounting for splice loss
          at the fiber-type boundary — the MFD mismatch generates inherent loss even with
          perfect core alignment.
        </p>
      </section>

      {/* ── ANNOTATED DIAGRAM ──────────────────────────────────────────── */}
      <AnnotatedDiagram
        title="Macrobend vs. Microbend — Where Loss Occurs"
        description="Click each labeled point to understand where each bend type occurs and what causes it."
        src="/training/diagrams/fiber-bend-types.svg"
        alt="Diagram showing a fiber with a visible macrobend loop and a section with microscopic microbend deformations"
        aspectRatio={2.5}
        hotPoints={[
          {
            id: 'macro',
            x: 30,
            y: 40,
            label: 'Macrobend',
            type: 'click',
            explanation:
              'A visible bend — a loop or kink in the fiber. Loss increases rapidly as the bend radius decreases below the minimum spec. Common causes: tight coils in a handhole slack loop, fiber pinched behind a patch panel, or a kink from careless installation. Detectable as a discrete loss event on an OTDR trace.',
          },
          {
            id: 'micro',
            x: 70,
            y: 60,
            label: 'Microbend',
            type: 'click',
            explanation:
              'Microscopic lateral deformations — not visible to the eye. Common causes: over-tensioned lashing wire, conduit overfill, temperature-induced buckling of fiber inside loose-tube cable. Shows up as elevated background attenuation on OTDR, not a discrete event. Requires careful installation practices to prevent.',
          },
          {
            id: 'normal',
            x: 50,
            y: 20,
            label: 'Normal fiber',
            type: 'click',
            explanation:
              'A straight fiber run with no unusual bends. TIR is fully effective — essentially all light bouncing stays inside the core. This is the baseline: loss is purely from the glass\'s intrinsic attenuation (Rayleigh scattering + infrared absorption), with no bend contribution.',
          },
        ]}
      />

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T02-L04-scenario-1"
        title="Field Scenario: High OTDR Loss on a New Splice"
        description="You've just completed a 24-fiber fusion splice in a handhole. OTDR readings show 0.8 dB of extra loss on fibers 13–18 starting about 2 meters from the splice case — but splice losses on those fibers are all good (≤ 0.05 dB each). What do you investigate first?"
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            prompt: 'Fibers 13–18 show 0.8 dB of extra loss starting 2 m from the splice case. Splice losses are clean. Where do you look first?',
            choices: [
              {
                label: 'Re-fuse all six bad splices — the splicer display must have been wrong',
                consequence: 'Splice losses are confirmed good on both a re-read and a bidirectional OTDR sweep. You\'ve spent an hour re-doing work that didn\'t need doing. The 0.8 dB loss is still there.',
                nextId: 'checkInsideCase',
                isOptimal: false,
              },
              {
                label: 'Open the splice case and inspect the fiber routing inside — look for tight bends on the affected fibers',
                consequence: 'Inside the case, fibers 13–18 are routed to a tray on the far side. Someone coiled the excess 2 meters into a loop about 3 cm in diameter around a retaining post. That\'s a 15 mm bend radius — well below the 30 mm minimum for G.652.D. Classic macrobend.',
                nextId: 'found-macro',
                isOptimal: true,
              },
              {
                label: 'Assume the cable was damaged during pulling and request a cable replacement',
                consequence: 'Cable damage would show up on all fibers, not just 13–18. And it would appear as a distributed loss or reflection — not a clean 2 m offset from the splice case. This is a premature conclusion.',
                nextId: 'checkInsideCase',
                isOptimal: false,
              },
            ],
          },
          checkInsideCase: {
            id: 'checkInsideCase',
            prompt: 'After your first step didn\'t resolve it, you open the splice case to inspect the fiber routing inside. What do you see?',
            choices: [
              {
                label: 'Fibers 13–18 are coiled tightly around a retaining post inside the tray — 2 m of excess, about 3 cm loop diameter',
                consequence: 'That\'s a macrobend. 3 cm loop diameter = 15 mm bend radius. G.652.D minimum for static installation is typically 30 mm. You\'ve found the cause.',
                nextId: 'found-macro',
                isOptimal: true,
              },
            ],
          },
          'found-macro': {
            id: 'found-macro',
            prompt: 'You\'ve confirmed a macrobend — 2 m of excess fiber coiled to a 15 mm bend radius. What\'s the fix?',
            choices: [
              {
                label: 'Re-route the excess fiber into the tray using a gentle figure-eight coil at the proper minimum radius (≥ 30 mm for G.652.D)',
                consequence: 'Fiber re-routed. OTDR re-run — the 0.8 dB event is gone. All 24 fibers now measure within spec. Job complete.',
                nextId: 'done',
                isOptimal: true,
              },
              {
                label: 'Cut the excess 2 m and re-splice — that fiber is too short to re-route',
                consequence: 'Cutting and re-splicing adds two more splices and loses 2 m of slack. Slack in a splice case is a feature, not a problem — it lets you re-splice in the future if needed. Re-routing was the right move.',
                nextId: 'done',
                isOptimal: false,
              },
            ],
          },
          done: {
            id: 'done',
            isEnd: true,
            endMessage: 'Key lesson: a 0.8 dB loss event starting 2 m past a splice case, on a subset of fibers, is a classic macrobend signature inside the splice case. Always inspect fiber routing inside the case before re-doing splices. Slack loops inside splice trays should follow the cable manufacturer\'s minimum bend radius — not whatever fits in the tray.',
          },
        }}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T02.L04 Check — Macrobend and Microbend"
        mode="multiple-choice"
        questions={[
          {
            id: 'T02-L04-Q1',
            type: 'mc',
            prompt:
              'Why is 1625 nm the preferred OTDR wavelength for detecting macrobend loss on an in-service SMF link?',
            choices: [
              'Because 1625 nm is in the water-peak absorption window, which highlights bends',
              'Because macrobend loss grows with wavelength — 1625 nm exaggerates bend events compared to 1310 or 1550 nm, making them easier to detect',
              'Because OTDR instruments can only generate 1625 nm for in-service testing',
              'Because 1625 nm has the lowest background attenuation in G.652.D fiber',
            ],
            answerIndex: 1,
            explanation:
              'Macrobend loss is wavelength-dependent and grows as wavelength increases. At 1625 nm, bend events that are barely visible at 1550 nm are clearly visible — making 1625 nm the diagnostic wavelength of choice for macrobend hunting without interrupting 1310/1550 nm service.',
            citation:
              'ITU-T G.652.D mandrel test conditions; OTDR best practice (FOA Reference Guide).',
            fieldNote:
              'This is why "1310/1550 for acceptance, 1625 to hunt the kink" is the field rule. You don\'t always pay for the 1625 nm module unless you need to troubleshoot a suspected bend or confirm slack-loop installation.',
          },
          {
            id: 'T02-L04-Q2',
            type: 'fill-in-blank',
            prompt:
              'The minimum bend radius rule-of-thumb during cable pulling (dynamic) is typically ____ times the cable outer diameter.',
            answer: '20',
            answerDisplay: '20',
            explanation:
              '20× OD during pulling (dynamic condition) prevents the fiber from experiencing excessive stress during installation. After installation, the static minimum is typically 10× OD. Always verify against the specific cable manufacturer\'s installation guide — these are rules of thumb, not universal specs.',
          },
          {
            id: 'T02-L04-Q3',
            type: 'mc',
            prompt:
              'An OTDR trace shows elevated background loss (higher dB/km than expected) across a 200 m section of a conduit run, with no discrete events. The most likely cause is:',
            choices: [
              'A macrobend — a visible kink somewhere in that section',
              'Microbend loss — likely from conduit overfill or over-tensioned pulling',
              'A bad fusion splice in the middle of that section',
              'The OTDR pulse width setting is too narrow for that section length',
            ],
            answerIndex: 1,
            explanation:
              'Elevated distributed loss without discrete events is the signature of microbend loss. Macrobends show as discrete events. Splice loss shows as a point event. Microbends from conduit overfill or cable tension cause the fiber to experience many tiny deformations along a length, raising the effective dB/km in that section.',
            fieldNote:
              'This is a common conduit-fill problem. If you pull six cables through a 4-inch conduit designed for four, the inner cables get compressed. Fix: check conduit fill percentages before pull planning. NEC 358/352 and cable manufacturer guides specify maximum fill.',
          },
        ]}
      />

    </LessonLayout>
  );
}
