// T03.L11 — Cable Specification Reading: Real Datasheet
// Source-of-truth: audit-output/osp-rewrite-curriculum/T03_RESEARCH_BRIEF.md (HEAD d83f0bd)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import HotSpot from '../../components/primitives/HotSpot.jsx';

export const meta = {
  id: 'T03.L11',
  course_id: 'T03',
  title: 'Cable Specification Reading — Real Datasheet',
  order: 11,
  lesson_type: 'working',
  prerequisites: [
    'T03.L01', 'T03.L02', 'T03.L03', 'T03.L04',
    'T03.L05', 'T03.L06', 'T03.L07', 'T03.L08',
    'T03.L09', 'T03.L10',
  ],
  vocabulary_introduced: [
    'tolerance band',
    'aging factor',
  ],
  key_terms: [
    {
      term: 'tolerance band',
      definition:
        'The range around a nominal specification value within which a measurement is still conforming. Example: MFD = 9.2 µm ± 0.5 µm means any value between 8.7 µm and 9.7 µm passes the spec. (Source: 7 CFR 1755.902; standard datasheet reading practice)',
    },
    {
      term: 'aging factor',
      definition:
        'A design margin added to attenuation (or other mechanical properties) to account for performance degradation over the 20–40 year cable lifetime. Planning attenuation = spec-max datasheet value + 0.02–0.05 dB/km aging factor. (Source: FOA Reference Guide; Corning cable aging data)',
    },
  ],
  vocabulary_assumed: [
    { term: 'MFD', source_lesson_id: 'T02.L01' },
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'dB/km', source_lesson_id: 'T02.L02' },
    { term: 'MFD tolerance (RUS)', source_lesson_id: 'T03.L10' },
    { term: 'qualification testing', source_lesson_id: 'T03.L10' },
    { term: 'ICEA S-87-640', source_lesson_id: 'T03.L01' },
    { term: 'loose-tube', source_lesson_id: 'T03.L01' },
    { term: 'RTS', source_lesson_id: 'T03.L04' },
    { term: 'EDS', source_lesson_id: 'T03.L04' },
  ],
  estimated_minutes: 30,
};

export default function T03L11_DatasheetReading() {
  return (
    <LessonLayout meta={meta}>

      <section data-tier="foundations">
        <h2>Reading a Cable Datasheet Without Getting Lost</h2>
        <p>
          Every cable you spec on a job has a datasheet — a one- or two-page document from
          the manufacturer that lists every important technical property of that cable. The
          problem is datasheets are dense, and they mix categories together in ways that
          aren't obvious at first glance.
        </p>
        <p className="mt-2">
          This lesson walks you through a representative OSP loose-tube datasheet —
          styled after a Corning SMF-28 Ultra-based OSP cable — and shows you exactly
          what each section means, where the numbers come from, and which ones matter most
          for your job.
        </p>
        <p className="mt-2">
          After this lesson, you should be able to open any cable datasheet and immediately
          find the numbers you need: attenuation, tensile rating, bend radius, MFD, and
          operating temperature range. And — just as important — you should know which numbers
          to trust as-is and which ones need a planning margin applied before you use them.
        </p>

        <h3 className="mt-4">The Datasheet Structure: Six Sections</h3>
        <p>
          Almost all OSP cable datasheets follow the same basic structure, even if the
          formatting varies by manufacturer:
        </p>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>
            <strong>Cable description / construction summary</strong> — fiber count, buffer
            tube arrangement, armor type (if any), jacket material. Tells you what you
            ordered before you read the specs.
          </li>
          <li>
            <strong>Physical specs</strong> — cable outer diameter, weight per unit length.
            Critical for conduit fill calculations and reel weight logistics.
          </li>
          <li>
            <strong>Optical specs</strong> — attenuation at each wavelength, MFD, chromatic
            dispersion, cutoff wavelength. These are the performance numbers you use in link
            budget calculations.
          </li>
          <li>
            <strong>Mechanical specs</strong> — tensile rating (installation and long-term),
            crush resistance, minimum bend radius (installation vs. long-term). These protect
            the fiber during and after installation.
          </li>
          <li>
            <strong>Environmental specs</strong> — operating temperature range, storage
            temperature, water penetration resistance. Tells you where this cable can live.
          </li>
          <li>
            <strong>Compliance declarations</strong> — which standards the cable meets: ICEA
            S-87-640, 7 CFR 1755.902, applicable NEC fire ratings, RoHS, etc.
          </li>
        </ol>
      </section>

      <section data-tier="foundations" className="mt-6">
        <h3>Understanding Tolerance Bands</h3>
        <p>
          Almost every spec on a datasheet has a tolerance band — a range of acceptable values
          rather than a single exact number. This is important to understand because you're
          never getting one exact number in practice; you're getting "somewhere in this range."
        </p>
        <p className="mt-2">
          Example from a typical SMF-28 Ultra OSP cable datasheet:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>MFD at 1310 nm: 9.2 µm ± 0.4 µm → range is 8.8 to 9.6 µm</li>
          <li>Attenuation at 1310 nm: ≤ 0.35 dB/km (a maximum, not a range — anything below this passes)</li>
          <li>Attenuation at 1550 nm: ≤ 0.25 dB/km</li>
          <li>Coating OD: 250 ± 3 µm → range is 247 to 253 µm</li>
        </ul>
        <p className="mt-3">
          Notice that attenuation specs are listed as maximums ("≤"), not as exact values.
          That's because fiber manufacturers guarantee they won't exceed the maximum — they
          don't guarantee you'll get the absolute best possible fiber on every reel. When you
          design a link, you use the specified maximum for worst-case analysis, not the typical
          value from the marketing section.
        </p>
        <p className="mt-2">
          <em>Sanity check:</em> A tolerance band of ± 0.5 µm on a 9.2 µm MFD spec means
          you're working with a precision of about 5%. That sounds small, but at the scale
          of light waves (1310 nm = 1.31 µm), even a 0.5 µm difference in fiber core geometry
          has measurable effects on splice efficiency if the two fibers being joined are at
          opposite ends of the tolerance window.
        </p>
      </section>

      <section data-tier="working" className="mt-6">
        <h3>The Aging Factor: Datasheet Numbers vs. Planning Numbers</h3>
        <p>
          Here's something most people don't think about when they first read a datasheet:
          the attenuation value on the datasheet is the value the cable has right now, when
          it's new. That cable will be in service for 20–40 years. Fiber in OSP cables ages —
          very slowly, but measurably — due to hydrogen diffusion, thermal aging of the
          coating, and long-term mechanical creep.
        </p>
        <p className="mt-2">
          The FOA (Fiber Optic Association) Reference Guide recommends adding an aging
          factor of <strong>0.02–0.05 dB/km</strong> to the datasheet attenuation when
          computing a planning link budget. Which end of the range you use depends on the
          environment:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Underground duct or conduit (stable temperature, low mechanical stress): 0.02 dB/km</li>
          <li>Direct-burial (freeze-thaw cycling, soil movement): 0.03–0.04 dB/km</li>
          <li>Aerial lashed (wind-induced vibration, thermal cycling): 0.04–0.05 dB/km</li>
        </ul>
        <p className="mt-3">
          <em>Field practice note:</em> Most engineers on rural broadband jobs default to
          0.05 dB/km aging factor for all cable types — it's conservative enough to work for
          any environment and simple to remember. The 0.02 dB/km precision isn't worth the
          mental overhead on a 50-reel job. If the link passes with 0.05, you're fine. If
          it only passes at 0.02, you have a marginal link that needs to be redesigned.
        </p>
      </section>

      {/* WORKED EXAMPLE — datasheet step-by-step */}
      <section data-tier="working" className="mt-6">
        <WorkedExample
          title="Datasheet Walk: SMF-28 Ultra OSP 48F Loose-Tube"
          description={
            `Representative datasheet values for a Corning SMF-28 Ultra-based 48-fiber OSP ` +
            `loose-tube cable. You are designing a 35 km feeder route on a RUS project. ` +
            `Calculate the planning attenuation at 1550 nm and verify the cable's RUS compliance.`
          }
          variables={[
            { key: 'km', label: 'Link length', units: 'km', default: 35, min: 1, max: 150, step: 0.5 },
            { key: 'attenSpec', label: 'Datasheet attenuation at 1550 nm (max spec)', units: 'dB/km', default: 0.25, min: 0.18, max: 0.40, step: 0.01 },
            { key: 'aging', label: 'Aging factor', units: 'dB/km', default: 0.05, min: 0.02, max: 0.08, step: 0.01 },
          ]}
          formula={({ km, attenSpec, aging }) => {
            const planningAtten = attenSpec + aging;
            return planningAtten * km;
          }}
          steps={({ km, attenSpec, aging }, totalLoss) => {
            const planningAtten = attenSpec + aging;
            return [
              { expression: `Step 1: Read datasheet spec attenuation at 1550 nm → ${attenSpec} dB/km (this is the maximum, not typical)` },
              { expression: `Step 2: Add aging factor for aerial/OSP environment → ${attenSpec} + ${aging} = ${planningAtten.toFixed(3)} dB/km` },
              { expression: `Step 3: Multiply planning attenuation × length → ${planningAtten.toFixed(3)} dB/km × ${km} km = ${totalLoss.toFixed(2)} dB` },
              { expression: `Step 4: MFD check — datasheet shows 9.2 µm ± 0.4 µm at 1310 nm → within 7 CFR 1755.902's 9.2 µm ± 0.5 µm window → PASS` },
              { expression: `Step 5: Temperature range — datasheet shows −40°C to +70°C → meets ICEA S-87-640 minimum → PASS` },
              { expression: `Step 6: ICEA S-87-640 compliance declaration → present on datasheet → PASS` },
            ];
          }}
          sanityCheck={(totalLoss) =>
            `Planning fiber loss for this link: ${totalLoss.toFixed(2)} dB. This is cable attenuation only — add splice loss, connector loss, and safety margin on top for the full link budget.`
          }
          resultLabel="Planning fiber loss"
          resultUnit="dB"
          resultDecimals={2}
        />
      </section>

      <section data-tier="working" className="mt-6">
        <h3>The Mechanical Specs: Two Tensile Numbers and Two Bend Radius Numbers</h3>
        <p>
          Mechanical specs are the most frequently misread part of a cable datasheet, because
          most of the critical fields come in pairs:
        </p>

        <h4 className="mt-3 font-semibold">Tensile Rating</h4>
        <ul className="list-disc ml-6 mt-1 space-y-1">
          <li>
            <strong>Installation tensile rating</strong> (also called "maximum installation
            load" or "rated tensile strength") — the maximum pulling load allowed during
            installation. For ICEA S-87-640 standard-tier cable: 2,670 N (600 lbf). You never
            exceed this during a pull, conduit or aerial.
          </li>
          <li>
            <strong>Long-term tensile rating</strong> (also called "maximum residual tensile
            load") — typically 25–50% of the installation rating. This is the maximum sustained
            load the cable can carry after installation — for example, the dead weight on an
            aerial strand between poles. On a 250 ft span with a 0.15 kg/m cable, the tension
            works out to roughly 100–200 N, well within long-term limits.
          </li>
        </ul>

        <h4 className="mt-3 font-semibold">Bend Radius</h4>
        <ul className="list-disc ml-6 mt-1 space-y-1">
          <li>
            <strong>Installation bend radius</strong> — the minimum radius allowed during pulling or
            routing. This lesson uses <strong>20× cable OD</strong> as the conservative limit
            for dynamic installation stress. (Some references quote a range of 10–20× OD depending
            on cable design; 20× is the safe upper boundary to plan to.)
            Exceeding this temporarily during installation can stress the fiber.
          </li>
          <li>
            <strong>Long-term (loaded) bend radius</strong> — the minimum radius allowed in the
            permanent installed position, under sustained load (e.g., inside a splice case or duct
            transition). This lesson uses <strong>10× cable OD</strong> as the standard long-term
            limit. (Some references quote 10–15× OD; 10× represents the tightest commonly accepted
            permanent bend.) Tighter than this permanently can cause microbend loss that builds up
            over years.
          </li>
        </ul>
        <p className="mt-3">
          <em>Field practice note:</em> Splice case pigtail management is where long-term bend
          radius violations happen most often. A pigtail looped too tightly around an anchor
          post inside the splice tray may look fine on day one and show up as 0.3 dB of
          unexpected loss at the next OTDR inspection. Route pigtails in gentle coils, always
          greater than the long-term bend radius. See T03.L04 for the ADSS installation context.
        </p>
      </section>

      {/* HOTSPOT — datasheet regions */}
      <section data-tier="working" className="mt-6">
        <HotSpot
          imageUrl="/training/diagrams/cable-datasheet-annotated.svg"
          title="Datasheet Navigation — Click Each Region to Learn What It Means"
          mode="explore"
          hotPoints={[
            {
              id: 'hs-optical',
              x: 22,
              y: 28,
              label: 'Optical Specs',
              description:
                'This section lists attenuation (dB/km) at each wavelength and MFD. Use the spec-max attenuation for link budget analysis. The "typical" attenuation in the marketing copy is NOT what you design to — use the maximum.',
            },
            {
              id: 'hs-mechanical',
              x: 68,
              y: 28,
              label: 'Mechanical Specs',
              description:
                'Find two tensile numbers (installation and long-term) and two bend radius numbers (installation and loaded). Never use the installation bend radius as the long-term limit — they are different numbers for a reason.',
            },
            {
              id: 'hs-environmental',
              x: 22,
              y: 68,
              label: 'Environmental Specs',
              description:
                'Operating temperature range (−40°C to +70°C is the standard ICEA minimum). Storage and shipping temperature may differ. Burial depth affects soil temperature in cold climates — if the cable will see soil temps below −40°C, you need a cold-rated product.',
            },
            {
              id: 'hs-compliance',
              x: 68,
              y: 68,
              label: 'Compliance Declarations',
              description:
                'Look for explicit call-outs: "Meets ICEA S-87-640," "Meets 7 CFR 1755.902," NEC fire rating (OFNR or OFNP if applicable), RoHS status. A datasheet that omits compliance declarations is a red flag — ask the manufacturer for a conformance letter.',
            },
          ]}
        />
      </section>

      <section data-tier="advanced" className="mt-6">
        <h3>Submitting a Cable for RUS Project Approval</h3>
        <p>
          On a RUS-financed project, cable submittals typically require:
        </p>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>
            <strong>Manufacturer's cut sheet (datasheet)</strong> — the technical spec sheet
            showing all parameters and compliance declarations.
          </li>
          <li>
            <strong>Qualification test report</strong> — the results of ICEA S-87-640 type
            testing on this cable design. Not per-lot — per-design.
          </li>
          <li>
            <strong>7 CFR 1755.902 compliance letter</strong> — manufacturer's letter
            confirming the specific part number meets the minimum performance specification
            for RUS-financed projects.
          </li>
          <li>
            <strong>RUS Listed status (if applicable)</strong> — some RUS programs maintain
            an Accepted Materials List (AML). If your program requires AML listing, verify
            the manufacturer and part number appear on the current list before ordering.
          </li>
          <li>
            <strong>Acceptance test reports for each reel</strong> — provided at shipment,
            confirming each reel passed OTDR and mechanical acceptance testing. Archive these;
            they are the as-shipped fiber quality record.
          </li>
        </ol>
        <p className="mt-3">
          <em>Book vs. field practice:</em> Many co-ops and CLECs on rural broadband projects
          work from a pre-approved manufacturer list maintained by their state RUS director.
          In practice, if your cable is from a pre-approved manufacturer and meets the standard
          spec, the submittal process may be streamlined to a one-page declaration. But the
          documentation requirements above represent the full standard — know them even if you
          don't always exercise all of them.
        </p>
      </section>

      {/* FLASHCARDS */}
      <Flashcard
        deckId="T03-L11"
        cards={[
          {
            id: 'T03-L11-fc-tol',
            front: 'What is a tolerance band on a cable datasheet?',
            back: 'The range around a nominal specification value within which a measurement is still conforming. Example: MFD = 9.2 µm ± 0.5 µm means any value between 8.7 µm and 9.7 µm passes the spec. (Source: 7 CFR 1755.902; standard datasheet reading practice)',
          },
          {
            id: 'T03-L11-fc-aging',
            front: 'What is an aging factor and how do you apply it in a link budget?',
            back: 'A design margin added to attenuation to account for performance degradation over the 20–40 year cable lifetime. Add 0.02–0.05 dB/km to the spec-max datasheet value: planning attenuation = spec max + aging factor. Higher end (0.05) for aerial and direct-burial; lower end (0.02) for protected conduit. (Source: FOA Reference Guide; Corning cable aging data)',
          },
        ]}
      />

      {/* QUIZ */}
      <Quiz
        title="L11 Knowledge Check"
        mode="multiple-choice"
        questions={[
          {
            id: 'T03-L11-Q01',
            type: 'mc',
            prompt:
              'A cable datasheet shows attenuation at 1550 nm as "≤ 0.25 dB/km." You are planning a 40 km feeder link with an aging factor of 0.04 dB/km. What planning attenuation value should you use in your link budget?',
            choices: [
              '0.25 dB/km',
              '0.29 dB/km',
              '0.21 dB/km',
              '0.30 dB/km',
            ],
            answerIndex: 1,
            explanation:
              'Planning attenuation = spec max + aging factor = 0.25 + 0.04 = 0.29 dB/km. You always start from the spec maximum (worst-case), not the typical value. The aging factor accounts for performance degradation over the cable\'s 20–40 year life. (Source: FOA Reference Guide)',
          },
          {
            id: 'T03-L11-Q02',
            type: 'mc',
            prompt:
              'A cable datasheet shows MFD = 9.2 µm ± 0.4 µm at 1310 nm. The 7 CFR 1755.902 requirement is 9.2 µm ± 0.5 µm. Does this datasheet spec satisfy the RUS requirement?',
            choices: [
              'No — the tolerance band is tighter than required, so it does not meet the spec',
              'Yes — the tolerance band is tighter than required, meaning this cable is within the RUS window',
              'No — the tolerance is too narrow; only ± 0.5 µm exactly is acceptable',
              'Yes, but only if the cable is also ADSS type',
            ],
            answerIndex: 1,
            explanation:
              'The 7 CFR 1755.902 requirement is 9.2 µm ± 0.5 µm (8.7–9.7 µm range). A datasheet showing ± 0.4 µm (8.8–9.6 µm range) is a tighter specification — all fibers within that band also fall within the RUS band. A tighter tolerance is better, not a disqualification. (Source: 7 CFR 1755.902)',
          },
          {
            id: 'T03-L11-Q03',
            type: 'dragdrop',
            prompt: 'Match each cable datasheet section to what it primarily contains.',
            items: [
              { id: 'optical', label: 'Attenuation at 1310/1550 nm, MFD, chromatic dispersion' },
              { id: 'mechanical', label: 'Tensile rating, crush resistance, minimum bend radius' },
              { id: 'compliance', label: 'ICEA S-87-640 declaration, 7 CFR 1755.902, NEC fire rating' },
            ],
            targets: [
              { id: 'toptical', label: 'Optical specifications' },
              { id: 'tmechanical', label: 'Mechanical specifications' },
              { id: 'tcompliance', label: 'Compliance declarations' },
            ],
            correctMap: { toptical: 'optical', tmechanical: 'mechanical', tcompliance: 'compliance' },
            explanation:
              'Optical specs govern signal performance (link budget use). Mechanical specs govern installation safety and long-term integrity. Compliance declarations are the contractual hook — they are what you verify against project spec requirements and RUS program rules.',
          },
          {
            id: 'T03-L11-Q04',
            type: 'mc',
            prompt:
              'Why does a cable datasheet list two different minimum bend radius values — one for installation and one for long-term?',
            choices: [
              'They are the same value; listing both is just a formatting convention',
              'The installation bend radius is the tighter (smaller) limit; long-term allows a larger radius because permanent bends are under lower load',
              'The installation bend radius requires a larger minimum radius (typically 20× cable OD) because dynamic pulling stress is more damaging; the long-term (loaded) radius allows a tighter (smaller) radius permanently — typically 10× cable OD — because sustained gentle bending is less damaging than dynamic stress',
              'The long-term value applies only to armored cable; unarmored cable uses the installation value for both',
            ],
            answerIndex: 2,
            explanation:
              'The installation bend radius requires a LARGER minimum radius number (e.g., 20× OD) — you cannot bend tighter than this number during the pull. The long-term (loaded) radius allows a SMALLER minimum radius (e.g., 10× OD) in the permanent installed position. Counter-intuitively, the long-term limit is the smaller number: you can route cable in a tighter permanent bend than you can during the dynamic stress of pulling. Violating the long-term limit causes microbend loss that builds up over years of installation.',
          },
          {
            id: 'T03-L11-Q05',
            type: 'fill-in-blank',
            prompt:
              'Standard OSP cable operating temperature range per ICEA S-87-640 and Corning SMF-28 Ultra datasheets is −__°C to +70°C.',
            answer: '40',
            answerDisplay: '−40°C (standard OSP rating per ICEA S-87-640 and Corning SMF-28 Ultra)',
            explanation:
              '−40°C to +70°C is the standard OSP cable operating temperature range confirmed across ICEA S-87-640 and major vendor datasheets including Corning SMF-28 Ultra. Storage temperatures may be rated to −60°C for some products, but the operating (in-service) floor is −40°C. (Source: ICEA S-87-640; Corning SMF-28 Ultra datasheet)',
          },
        ]}
      />

    </LessonLayout>
  );
}
