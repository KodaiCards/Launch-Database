// T11.L04 — Fusion Splicing — Step by Step
// Foundation lesson: every step from opening buffer tube to closing splice protector
// Source: M04 §4.2 migrated + step-sequence quiz

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T11.L04',
  course_id: 'T11',
  title: 'Fusion Splicing — Step by Step',
  order: 4,
  lesson_type: 'foundation',
  prerequisites: ['T11.L03'],
  learning_objectives: [
    'Perform (or describe in sequence) every step of a fusion splice from opening the buffer tube to closing the splice protector',
    'Identify the correct tool for each step: buffer tube stripper, fiber stripper, IPA wipe, precision cleaver, fusion splicer, heat oven',
    'Explain the quality checkpoints at each step and what a failure at each step produces',
    'Describe what a splice protector (heat-shrink sleeve) does and where it must be positioned before the splice is made',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'fusion splice',
    'arc discharge',
    'strip',
    'clean',
    'cleave',
    'align',
    'fuse',
    'proof-test',
    'splice protector',
    'splicer display',
    'fiber holder (V-groove assembly)',
    'bidirectional measurement',
  ],
  key_terms: [
    {
      term: 'fusion splice',
      definition:
        'A permanent joint between two optical fibers made by heating the fiber ends until they melt and flow together, forming a continuous glass core. Fusion splicing produces the lowest insertion loss of any fiber joining method (typically ≤0.10 dB) and is the standard for permanent OSP installations.',
    },
    {
      term: 'arc discharge',
      definition:
        'The electrical spark between the splicer\'s two tungsten electrodes that generates the heat to melt and fuse the fiber ends. The arc temperature exceeds 1,700°C — hot enough to flow silica glass. The arc duration and power are controlled by the splicer\'s calibration program for each fiber type.',
    },
    {
      term: 'strip',
      definition:
        'Removing the protective coating from the fiber end to expose the bare glass. Step 1 is stripping the outer buffer tube jacket (mechanical stripping tool). Step 2 is stripping the 250 µm acrylate coating from the individual fiber (precision fiber stripper). Bare fiber is 125 µm cladding diameter — about as thick as a human hair.',
    },
    {
      term: 'clean',
      definition:
        'Wiping the stripped fiber end with a lint-free wipe (dry first, then isopropyl alcohol ≥99%) to remove buffer gel, oil, and dust. Cleaning must happen immediately before cleaving — never wait; contamination redeposits from the air within seconds in a dusty field environment.',
    },
    {
      term: 'cleave',
      definition:
        'Scoring and breaking the stripped, cleaned fiber end using a precision cleaver to produce a flat, perpendicular end-face. A good cleave has a mirror-flat face with ≤0.5° angular deviation from perpendicular. A bad cleave (chipped, angled, hackle) causes elevated splice loss and voids at the fusion joint.',
    },
    {
      term: 'align',
      definition:
        'The splicer\'s cameras and motors position the two fiber ends face-to-face, eliminating lateral offset, angular tilt, and axial separation. Core-align mode finds the actual light-guiding core; cladding-align mode finds the outer cladding surface (faster but less accurate for mismatched fibers). Covered in detail in L05.',
    },
    {
      term: 'fuse',
      definition:
        'Pressing the two aligned fiber ends together while applying the arc discharge. The glass flows together and the cores merge. The splicer displays an estimated insertion loss immediately after fusion, based on the optical intensity through the joint.',
    },
    {
      term: 'proof-test',
      definition:
        'Applying a brief axial tension (typically 1–2 N, about 200–400 grams force) to the completed splice to confirm mechanical integrity. The splice either holds (strong joint — proceed) or breaks (weak joint — strip back and re-splice). Every fusion splicer applies the proof-test automatically before releasing the fiber from the clamps.',
    },
    {
      term: 'splice protector',
      definition:
        'A heat-shrink sleeve (typically 40–60 mm long) that is slid over the splice point after fusion and shrunk in a heat oven to reinforce the joint. The sleeve contains a stainless steel rod (to prevent bending) and hot-melt adhesive. CRITICAL: the splice protector must be threaded onto one fiber BEFORE the splice is made — you cannot add it after.',
    },
    {
      term: 'splicer display',
      definition:
        'The fusion splicer\'s screen that shows a live camera view of the fiber ends during alignment and displays an estimated insertion loss after fusion. The estimated loss is based on optical throughput — it is a diagnostic tool, NOT a substitute for OTDR measurement. The splicer estimate can be optimistic by 0.02–0.05 dB on a well-calibrated machine.',
    },
    {
      term: 'fiber holder (V-groove assembly)',
      definition:
        'The precision V-shaped channel that holds the fiber during cleaving and in the splicer. The V-groove positions the fiber at a consistent height and lateral position so the splicer\'s cameras can find it. Cleanliness of the V-groove is critical — a fiber laid into a dirty V-groove gets contaminated and the alignment is compromised.',
    },
    {
      term: 'bidirectional measurement',
      definition:
        'Running an OTDR test from both ends of a fiber span and averaging the two splice-loss readings for each splice event. Because each fiber\'s backscatter coefficient is slightly different, an OTDR measuring from one end may see a splice as 0.05 dB while the same splice measured from the other end appears as 0.15 dB. Neither reading is wrong — they reflect the backscatter mismatch between the two fibers. The bidirectional average (0.10 dB in this example) is the true optical insertion loss of the splice.',
    },
  ],
  vocabulary_assumed: [
        { term: 'G.652.D', source_lesson_id: 'T02.L01' },
    { term: 'G.657', source_lesson_id: 'T02.L04' },
    { term: 'buffer tube', source_lesson_id: 'T01.L03' },
    { term: 'FOA design target', source_lesson_id: 'T11.L03' },
    { term: 'splice loss acceptance threshold', source_lesson_id: 'T11.L03' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T11L04_FusionSplicingStepByStep() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Fusion splicing is the craft of permanently joining two glass fibers by melting them
          together with an electric arc. Done right, the joint is so clean that light crossing
          it loses less than 2% of its power — roughly the attenuation of 100 meters of
          good-quality fiber. Done wrong, you can lose 20% or more, or break the fiber
          entirely.
        </p>
        <p className="mt-2">
          The steps are not complicated, but they are unforgiving. Skip a step, do it out of
          order, or rush a quality checkpoint, and you'll either get a bad splice or waste
          time re-doing it. This lesson walks every step in sequence with the quality check
          that goes with it.
        </p>

        <p className="text-slate-400 text-sm mb-3 mt-4 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Remember from <strong>T11.L03, splice loss — the four numbers</strong> — your craftsmanship target is ≤0.10 dB per splice (FOA / ITU-T L.400) and the RUS contract rejection threshold is ≤0.30 dB. Every step of the workflow you're about to learn exists to hit that 0.10 dB target consistently. When a step is rushed or skipped, those numbers go up.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T11-L04"
            cards={[
              {
                id: 'T11-L04-fc-fusion',
                front: 'What is a fusion splice and why is it preferred for permanent OSP installations?',
                back: 'A fusion splice permanently joins two fiber ends by melting them together with an electric arc (arc temperature >1,700°C). It produces the lowest insertion loss (≤0.10 dB typical) and a mechanically strong joint with no degradable materials (unlike mechanical splices with index-matching gel). Standard for all permanent RUS and carrier-grade OSP builds.',
              },
              {
                id: 'T11-L04-fc-sequence',
                front: 'What are the 8 steps of a fusion splice in order?',
                back: '1-Strip buffer tube, 2-Strip fiber coating, 3-Clean fiber, 4-Cleave fiber, 5-Load into splicer, 6-Align (splicer automatic), 7-Fuse (arc), 8-Proof-test. After: slide splice protector over joint, heat-shrink in oven. Note: splice protector must be threaded onto fiber BEFORE step 4.',
              },
              {
                id: 'T11-L04-fc-protector',
                front: 'When must the splice protector be placed on the fiber, and why?',
                back: 'Before cleaving (before Step 4). Once the splice is made, there is no way to slide the heat-shrink sleeve over the splice point — the splice itself is in the way. Threading the protector AFTER the splice means the joint has no mechanical protection. This is the most common beginner mistake in fusion splicing.',
              },
              {
                id: 'T11-L04-fc-prooftest',
                front: 'What is a proof-test and what does it confirm?',
                back: 'The fusion splicer automatically applies 1–2 N (200–400 g) of axial tension immediately after fusion to confirm mechanical integrity. A joint that holds the proof-test tension is structurally sound. A joint that breaks indicates a weak fusion (often from a bad cleave or contaminated end-face) and must be re-made.',
              },
              {
                id: 'T11-L04-fc-vgroove',
                front: 'What is the V-groove assembly and why must it be clean?',
                back: 'The V-shaped precision channel that holds the fiber during cleaving and inside the splicer. If the V-groove has dust, gel residue, or fiber fragments, the fiber sits at the wrong height or angle, causing poor alignment and elevated splice loss even when the fiber ends are perfectly cleaved and cleaned. Clean the V-groove with a lint-free wipe + IPA before every splice session.',
              },
              {
                id: 'T11-L04-fc-arc-discharge',
                front: 'What is arc discharge in fusion splicing?',
                back: 'The high-temperature plasma arc fired between the splicer\'s tungsten electrodes that melts the two fiber end-faces together. Temperatures exceed 1,700°C at the fusion point. The arc duration and power are controlled by the splicer profile for each fiber type — too low leaves a weak joint, too high distorts the fiber geometry.',
              },
              {
                id: 'T11-L04-fc-strip',
                front: 'What is the "strip" step in fusion splicing?',
                back: 'Removing the 250 µm acrylate coating from the fiber end to expose the bare 125 µm glass cladding. Performed with a precision fiber stripper (hot or mechanical). Length: 3–4 cm of bare fiber. The resulting surface must be smooth with no coating residue — residue causes contamination at the fusion interface.',
              },
              {
                id: 'T11-L04-fc-clean',
                front: 'What is the "clean" step in fusion splicing?',
                back: 'Removing contamination (dust, oil, gel residue) from the stripped bare fiber surface before cleaving. Sequence: dry lint-free wipe (one direction) to remove bulk debris, then IPA-soaked lint-free wipe (one direction) to dissolve oil and moisture. Never re-wipe with a used surface. Do not touch the cleaned fiber with bare fingers.',
              },
              {
                id: 'T11-L04-fc-cleave',
                front: 'What is the "cleave" step in fusion splicing?',
                back: 'Making a precise perpendicular cut across the stripped, cleaned fiber end-face using a precision cleaver. The cleave angle must be ≤0.5° (target) or ≤1.0° (maximum acceptable). A bad cleave creates a wedge gap between the two end-faces during alignment, causing a bubble void and elevated insertion loss.',
              },
              {
                id: 'T11-L04-fc-align',
                front: 'What is the "align" step in fusion splicing?',
                back: 'The splicer\'s automatic process of positioning the two cleaved fiber ends facing each other with precise lateral and axial alignment before firing the arc. Two modes: core-align (LID — centers the actual light-guiding core) and cladding-align (PAS — centers the outer 125 µm glass boundary). Core-align required for cross-type splices and ≤0.10 dB targets.',
              },
              {
                id: 'T11-L04-fc-fuse',
                front: 'What is the "fuse" step in fusion splicing?',
                back: 'The arc discharge cycle that melts and permanently joins the two aligned fiber ends. Typically two phases: cleaning arc (short, low-power — burns surface contamination) followed by main fuse arc (full-power — achieves glass flow and permanent joint). The splicer displays estimated insertion loss after fusion.',
              },
              {
                id: 'T11-L04-fc-bidir',
                front: 'What is a bidirectional measurement and why does it matter for splice loss?',
                back: 'Running an OTDR test from both ends of a fiber span and averaging the two splice-loss readings for each splice. Because each fiber\'s backscatter coefficient is slightly different, an OTDR measuring from one end may see a splice as 0.05 dB while the same splice measured from the other end appears as 0.15 dB. The bidirectional average (0.10 dB in this example) is the true optical insertion loss. Never re-splice based on a single one-direction OTDR reading showing high loss — check the average first.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The 8-Step Fusion Splice Workflow</h2>

        <div className="p-4 mb-6 rounded-lg border border-blue-400/30 bg-blue-400/5">
          <h3 className="font-semibold text-blue-300 mb-2">Quick Refresher — Key Terms</h3>
          <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
            <li><strong>Attenuation (dB/km):</strong> How fast signal weakens traveling through fiber per kilometer. Higher fiber quality = lower dB/km.</li>
            <li><strong>G.652.D & G.657:</strong> Standard ITU-T single-mode fiber types — G.652.D is the workhorse for OSP, G.657 is bend-tolerant for tight installations.</li>
            <li><strong>FOA design target:</strong> ≤0.10 dB per splice — the quality benchmark for craftsmanship.</li>
            <li><strong>Splice loss acceptance threshold:</strong> ≤0.30 dB per RUS contract — the rejection limit above which a splice fails and must be re-done.</li>
          </ul>
        </div>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Recall from <strong>T11.L03, the four splice loss numbers</strong> — your goal is ≤0.10 dB per splice. Each of these 8 steps directly impacts whether you hit that target. Skip the cleaning or get a bad cleave, and you're immediately above 0.10 dB. From <strong>T01.L03, the buffer tube</strong> — you're starting by opening it to access the individual fibers inside.
        </p>

        <h3 className="mt-4 font-semibold">Before you start: thread the splice protector</h3>
        <p className="mt-1 p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
          <strong>Do this first, every time:</strong> slide the heat-shrink splice protector
          sleeve onto one of the two fibers before you begin. It must be 15–20 cm back from
          where the splice will be made. If you forget and make the splice first, you cannot
          add the protector later without cutting the splice out and starting over.
        </p>

        <div className="mt-4 space-y-3">
          {[
            {
              step: '1',
              name: 'Strip the buffer tube',
              tool: 'Slotted buffer tube stripper or Miller tool',
              action: 'Remove the outer buffer tube jacket to expose the individual 250 µm coated fibers. Length: 3–6 cm of jacket removed. Support the tube at the strip point — don\'t pull at an angle or you crack the tube.',
              check: 'No nicks in the fiber coating. No white stress marks where you grabbed the tube.',
              failure: 'Nicked fiber coating → latent fiber break under thermal cycling. Cracked tube → moisture entry into the splice case.',
            },
            {
              step: '2',
              name: 'Strip the fiber coating',
              tool: 'Precision fiber stripper (hot or mechanical)',
              action: 'Remove the 250 µm acrylate coating from the last 3–4 cm of fiber to expose the bare 125 µm glass. Make one smooth pull — don\'t rock the stripper back and forth.',
              check: 'Bare fiber feels smooth; no coating residue. Length of bare fiber matches your splicer\'s holder specification (typically 30–35 mm of bare glass into the V-groove clamp).',
              failure: 'Coating residue left on the glass → contamination. Stripper nick → stress riser → fiber breaks at proof-test or in service.',
            },
            {
              step: '3',
              name: 'Clean the fiber',
              tool: 'Lint-free wipe + 99% IPA',
              action: 'Dry wipe first (one pass, center-out). Then IPA wet wipe (one pass). Do not re-wipe with a used section of the wipe. Do not touch the bare fiber end with your fingers after cleaning.',
              check: 'Fiber end looks bright and clean under LED. No gel smear visible.',
              failure: 'Gel smear from skipping the dry-wipe step causes contamination at the fusion interface, leading to splice loss above the design target.',
            },
            {
              step: '4',
              name: 'Cleave the fiber',
              tool: 'Precision fiber cleaver',
              action: 'Place the cleaned fiber in the cleaver\'s V-groove, score with the blade, and apply break tension. Most cleavers are semi-automatic; follow the manufacturer\'s sequence. Target angle: ≤0.5°.',
              check: 'Splicer display shows "cleave OK" or the blade counter advances. Never re-use a cleaved fiber end — if you drop it, recleave.',
              failure: 'Cleave angle >1° → elevated splice loss, usually 0.15–0.40 dB. Hackle or chip on the end-face → bubble void at the fusion point, potential break under thermal cycling.',
            },
            {
              step: '5',
              name: 'Load into splicer',
              tool: 'Fusion splicer (V-groove, fiber clamps)',
              action: 'Lay the cleaved fiber into the V-groove and close the fiber clamp. Do not let the end-face contact any surface. Repeat for the second fiber.',
              check: 'Both fibers visible on splicer display with end-faces separated by the appropriate gap (typically 15–25 µm). No contamination visible on screen.',
              failure: 'End-face touching V-groove → contamination. Fiber too short for V-groove → alignment fails.',
            },
            {
              step: '6',
              name: 'Align (automatic)',
              tool: 'Splicer — automatic alignment motors',
              action: 'Press the SPLICE button. The splicer applies a cleaning arc (burns off residue), then moves motors to align the fibers using core-align or cladding-align mode (covered in L05). The display shows live camera images of both fiber ends.',
              check: 'Alignment image shows cores centered on each other. Any "alignment error" message = stop, re-clean, re-cleave, re-load.',
              failure: 'Poor alignment → elevated loss. "Cannot detect core" message usually means contamination on the end-face or wrong fiber type mode.',
            },
            {
              step: '7',
              name: 'Fuse',
              tool: 'Splicer arc discharge',
              action: 'The splicer fires the main arc and presses the fibers together. Glass flows and the cores merge. Estimated insertion loss appears on the display.',
              check: 'Estimated loss ≤0.10 dB (design target). No bubble or void visible in the splice image. The joint looks like a clean, uninterrupted fiber.',
              failure: 'Bubble or void = bad cleave or contamination. High estimated loss (>0.30 dB) = re-splice before proceeding.',
            },
            {
              step: '8',
              name: 'Proof-test',
              tool: 'Splicer — automatic tension fixture',
              action: 'Splicer automatically applies 1–2 N of axial tension for 1–2 seconds. You will feel the fiber pulled taut in the clamps. Do not release the fiber during proof-test.',
              check: 'Fiber holds under tension. "Splice complete" or equivalent message displayed. Estimated loss shown is valid.',
              failure: 'Fiber breaks → weak fusion. Strip back 3–5 cm, re-clean the affected end, recleave, re-splice from Step 2. Do not try to re-fuse broken pieces.',
            },
          ].map(({ step, name, tool, action, check, failure }) => (
            <div key={step} className="p-4 bg-slate-800/50 border border-slate-600/40 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/80 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">
                  {step}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-200">{name}</p>
                  <p className="text-slate-400 text-xs mt-0.5"><span className="text-slate-500">Tool:</span> {tool}</p>
                  <p className="text-slate-300 text-sm mt-1">{action}</p>
                  <p className="text-green-400 text-xs mt-1"><span className="font-semibold">✓ Quality check:</span> {check}</p>
                  <p className="text-red-400 text-xs mt-0.5"><span className="font-semibold">✗ Failure mode:</span> {failure}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="mt-6 font-semibold">After the splice: protect the joint</h3>
        <p>
          Slide the heat-shrink splice protector from where it was parked (15–20 cm back on
          the fiber) to center it over the fused joint. Place in the splicer's heat oven or a
          separate heat gun station. Heat until the sleeve shrinks fully and the adhesive is
          visible flowing from both ends. Let it cool before handling — the sleeve is soft
          and deformable until fully cooled.
        </p>

        {/* Book vs. Field — splice loss measurement reality */}
        <div className="mt-6 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field — Reading Your Test Results</p>

          <p className="text-slate-300/90">
            <strong>Book (IEC 61280-4-2 / TIA-526-7A):</strong> The OTDR measures splice loss
            from one direction. The acceptance criterion is ≤0.10 dB per splice (FOA design
            target) or ≤0.30 dB (RUS rejection threshold). If the OTDR shows 0.18 dB, that
            splice fails. Re-splice it.
          </p>

          <p className="text-slate-300/90 mt-3">
            <strong>Field reality — bidirectional measurement variance:</strong> Measure the same
            fusion splice from two directions and you will often see different numbers. A splice
            that reads 0.05 dB westbound may read 0.15 dB eastbound. Both readings are real —
            they reflect the fact that each fiber has a slightly different backscatter coefficient,
            so the OTDR "sees" more or less apparent loss depending on which end it fires from.
            This is not a defective splice. The true optical insertion loss is the{' '}
            <strong>bidirectional average</strong>: (0.05 + 0.15) ÷ 2 = 0.10 dB.{' '}
            <strong>Never re-splice based on a single one-direction OTDR reading.</strong> Always
            run both directions and average before making the call. Cold weather adds another
            layer: at low temperatures, apparent OTDR loss on a fusion splice can read
            0.03–0.05 dB higher than at room temperature due to fiber coating contraction. A
            splice that looks marginal at 30°F on a December morning may be perfectly fine at
            the 60°F calibration temperature. Warm the splicer and run again before deciding.
          </p>

          <p className="text-slate-300/90 mt-3">
            <strong>Field reality — OTDR vs. OLTS disagreement:</strong> Your OTDR-derived
            total link loss and your OLTS end-to-end insertion loss will not always agree, even
            on a well-built link. The OTDR calculates loss by summing backscatter events — it is
            sensitive to dead zones, backscatter level changes at splice points, and event
            resolution limits. The OLTS measures actual transmitted optical power between the two
            ends. On singlemode plant, the two methods can disagree by 0.5–1.0 dB on the same
            link. When they disagree,{' '}
            <strong>the OLTS is the acceptance test of record</strong> (per TIA-568.3-D and
            TIA-526-7A). The OTDR is a fault-location and event-characterization tool — it tells
            you WHERE loss is occurring, not the precise total that determines pass/fail. Field
            crews who only have an OTDR on the job need to understand that their event-sum total
            is a diagnostic estimate, not a certification measurement.
          </p>
        </div>

        {/* Fusion Splicer Anatomy — component reference */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Fusion Splicer Anatomy</h3>
          <p className="text-sm text-slate-300/90 mb-4">
            Eight components handle the precision work of a fusion splice. Knowing what each one
            does — and what happens when it's dirty, worn, or misused — is the difference between
            a 0.05 dB splice and a 0.30 dB rework.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Left V-groove', description: 'Precision V-shaped channel that holds the left fiber at a defined height. Must be kept clean of dust and gel — contamination here causes alignment errors even with clean fiber ends.' },
              { label: 'Right V-groove', description: 'Precision V-shaped channel for the right fiber. Both V-grooves must be at the same height for the fiber ends to align when the arc fires.' },
              { label: 'Tungsten electrodes', description: 'Two tungsten rods positioned on either side of the fiber splice point. When the arc fires, current jumps between them, generating >1,700°C heat that melts the silica glass fiber ends together.' },
              { label: 'Left fiber clamp', description: 'Spring-loaded clamp that holds the left fiber in the V-groove during alignment and fusion. Releases automatically after the proof-test.' },
              { label: 'Right fiber clamp', description: 'Spring-loaded clamp for the right fiber. The two clamps are driven apart during the proof-test — if the splice holds 1–2 N tension, it passed.' },
              { label: 'Camera assembly', description: 'High-magnification CCD cameras (typically × 200) view the fiber ends from two orthogonal directions (X and Y axes). The splicer uses this image for alignment and displays it on screen for the operator.' },
              { label: 'Wind cover / dust shield', description: 'Protective cover that must be closed before the arc fires. Prevents wind from disturbing the fiber alignment and protects the electrodes from contamination. Always close this before pressing SPLICE.' },
              { label: 'Heat sleeve oven', description: 'The slot where the heat-shrink splice protector is placed after fusion. The oven reaches ~200°C and shrinks the sleeve in 30–60 seconds depending on sleeve type. Integral to most portable splicers.' },
            ].map(({ label, description }) => (
              <div key={label} className="p-3 bg-slate-800/40 border border-slate-600/40 rounded-lg">
                <p className="font-semibold text-slate-200 text-sm">{label}</p>
                <p className="text-slate-300/90 text-xs mt-1 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Component names are common across manufacturers (Fujikura, Sumitomo, AFL, FITEL),
            though physical layout varies. Consult your specific splicer's operator manual for
            component locations and cleaning procedures.
          </p>
        </div>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T11-L04-quiz-1"
            questions={[
              {
                id: 'q1',
                type: 'multiple-choice',
                text: 'A splicer finishes stripping the fiber coating, then realizes they forgot to slide the splice protector onto the fiber first. What must they do?',
                options: [
                  { id: 'a', text: 'Proceed — the splice protector can be applied after the splice is made by sliding it over the fused joint' },
                  { id: 'b', text: 'Slide the protector over the bare fiber end carefully without touching the stripped end-face' },
                  { id: 'c', text: 'Cut back the stripped section and start over from Step 1 so the protector can be properly threaded' },
                  { id: 'd', text: 'Skip the splice protector — the proof-test provides sufficient mechanical protection' },
                ],
                correctId: 'c',
                explanation: 'Once the fiber has been stripped and cleaved, the splice protector cannot be slid over the cleaved end-face without contaminating it. And once the splice is made, the fused joint prevents threading the sleeve from either side. The only correct option is to cut back the stripped section (2–3 cm past the end), re-thread the splice protector, and restart the strip-clean-cleave-align-fuse sequence. This wastes 5–10 minutes; forgetting the protector wastes 15+ minutes.',
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                text: 'After fusion, the splicer display shows 0.08 dB estimated loss but a visible bubble at the splice point on the camera image. What should the splicer do?',
                options: [
                  { id: 'a', text: 'Accept it — the estimated loss (0.08 dB) is below the FOA design target, so the splice is good' },
                  { id: 'b', text: 'Re-splice — the visible void means the joint has a mechanical defect that will fail under thermal cycling, regardless of the estimated loss reading' },
                  { id: 'c', text: 'Accept it — bubbles are normal at the fusion interface and disappear when the fiber cools' },
                  { id: 'd', text: 'Accept it — the proof-test is the only reliable quality check; if the fiber holds tension, the bubble does not matter' },
                ],
                correctId: 'b',
                explanation: 'The splicer\'s estimated loss is an optical measurement, not a mechanical inspection. A bubble or void at the fusion interface means the glass did not fully flow together — there is a mechanical weakness in the joint. Under thermal cycling (daily temperature swings of 20–40°C in an aerial cable), the bubble expands and contracts, stress-cracking the glass. The splice may look fine optically for months and then fail. Any visible bubble or void = re-splice. Do not rely on the loss estimate alone.',
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                text: 'During the proof-test step, the fiber breaks at the splice point. What is the correct next step?',
                options: [
                  { id: 'a', text: 'Re-fuse the broken ends using the arc without re-cleaving' },
                  { id: 'b', text: 'Apply more arc power on the next attempt to create a stronger bond' },
                  { id: 'c', text: 'Strip back 3–5 cm on the affected fiber, re-clean, re-cleave, and re-splice from Step 2' },
                  { id: 'd', text: 'Use a mechanical splice to bridge the two remaining fiber ends to avoid losing more fiber length' },
                ],
                correctId: 'c',
                explanation: 'A fiber breaking at proof-test means the fusion was weak — typically from a bad cleave (chipped or angled end-face) or contamination at the fusion interface. The broken end-face from the break is not a clean cleave — it\'s a stress fracture, unusable for splicing. The correct recovery is: strip back 3–5 cm on the broken fiber to expose fresh fiber past the fracture, re-clean the bare glass, re-cleave with the precision cleaver, then proceed from Step 4 (load into splicer). Do not try to re-fuse a fractured end.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Field Shortcuts That Cause Long-Term Problems</h2>

        <h3 className="mt-4 font-semibold">Skipping the proof-test</h3>
        <p>
          Some splicers disable the automatic proof-test to save 3–4 seconds per splice on a
          large job. Do not do this. The proof-test applies ~200 grams of force — roughly the
          weight of a large apple. A fusion splice that holds this load will survive decades of
          wind-induced vibration and thermal cycling in an aerial cable. A splice that fails the
          proof-test was going to fail in the field anyway, and finding it in the splice case is
          far cheaper than finding it after the plant is buried or hung at height.
        </p>

        <h3 className="mt-4 font-semibold">Re-using a cleaved end</h3>
        <p>
          If you drop a cleaved fiber or set it down in the V-groove too early and it contacts
          a surface, you must re-cleave. The end-face has been contaminated. Re-cleaning a
          cleaved end-face with IPA often makes it worse — the wipe disturbs the fiber and
          contaminates the area you just cleaned. The correct response is to move back 1–2 mm
          on the fiber and make a fresh cleave. The extra fiber length consumed (1–2 mm) is
          nothing compared to the time cost of a bad splice.
        </p>

        <h3 className="mt-4 font-semibold">Reading only the splicer estimate</h3>
        <p>
          The splicer's estimated loss is a useful real-time indicator but it is not the
          official measurement. RUS Bulletin 1753F-401 requires bidirectional OTDR verification
          of every splice before the case is closed. The OTDR measurement is the official value.
          OTDR readings differ from splicer estimates for legitimate physical reasons — MFD
          mismatch makes the loss appear different in each direction, and the bidirectional
          average is the true insertion loss. Always OTDR; never accept only the splicer display.
        </p>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          The 8-step fusion splice workflow synthesizes physics, chemistry, and mechanical precision concepts introduced across multiple prior topics. T02.L02 (single-mode fiber geometry) established that the light-carrying core is 8–9 µm in diameter — a human hair is roughly 70 µm, making the cleave and alignment tolerances here not figurative precision but mandatory precision; a 1 µm lateral offset produces measurable insertion loss. T02.L04 (attenuation mechanisms) explains why the strip-and-clean steps are not optional: organic contamination on the fiber end-face creates a lossy interface that no arc temperature can correct after the fact, which is why the dry-first rule for gel removal (covered in L14) exists as a prerequisite to this workflow. The proof-test at 1–2 N — step 7 of the 8-step sequence — is the mechanical validation rooted in T02.L06 (fiber tensile properties and dynamic fatigue): a splice that fails the proof-test would have failed in the field under thermal cycling, aerial vibration, or burial settling, and the splicer's loss estimate display is not a substitute for the proof-test result nor for the OTDR verification in T12. In T13 (inspection and QA), the inspector cross-checks the splicer's log (alignment method, arc count, estimated loss, protector serial) against the OTDR event file for every splice point — that cross-check is only meaningful because this lesson established what each field means; a splicer log entry showing "core-align, 0.03 dB" but an OTDR event showing 0.18 dB at that location is an inspection flag requiring root-cause investigation, not a shrug.
        </p>
      </section>
    </LessonLayout>
  );
}
