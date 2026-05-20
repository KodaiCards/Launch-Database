// T12.L01 — Tier 1 vs. Tier 2: OLTS vs. OTDR
// Foundation lesson: two-tier testing hierarchy, VFL as Tier 0, OLTS vs OTDR distinction
// Source: M08 §8.1 (migrated + expanded) | NECA/FOA 301-2016 | TIA-526-7A/14B | IEC 61280-4-2

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T12.L01',
  course_id: 'T12',
  title: 'Tier 1 vs. Tier 2 — OLTS vs. OTDR',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T02.L02', 'T02.L05', 'T02.L06', 'T11.L12'],
  learning_objectives: [
    'Explain what each instrument measures and state why OLTS and OTDR measurements are not interchangeable',
    'Identify the three-tier tool progression: VFL (continuity/routing) → OLTS (acceptance certification) → OTDR (event characterization)',
    'State the governing test standards for Tier-1 and Tier-2 testing on OSP cable plant',
    'Identify when each tier is required on an OSP acceptance job and explain what happens when a contractor delivers only OTDR results',
    'State the two-wavelength minimum (1310 nm + 1550 nm) for singlemode OSP acceptance testing',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'OLTS',
    'OTDR',
    'VFL',
    'TIA-526',
    'dual-wavelength acceptance testing',
  ],
  key_terms: [
    {
      term: 'OLTS',
      definition:
        'A two-piece instrument — a calibrated light source on one end and an optical power meter on the other — that measures how much light actually travels from one end of a fiber to the other. The result is the true end-to-end insertion loss in dB. This is the Tier-1 certification measurement. OLTS is the only instrument that directly measures optical power loss; all other tools are diagnostic.',
    },
    {
      term: 'OTDR',
      definition:
        'An instrument that injects a short laser pulse into one end of a fiber and measures the tiny fraction of light that scatters back (Rayleigh backscatter) over time, producing a graph of backscatter level vs. distance. OTDRs characterize individual events — splice loss, connector loss, macrobends, fiber breaks — and locate them by distance. OTDR is a Tier-2 diagnostic tool. Because OTDR estimates loss indirectly from backscatter rather than measuring transmitted power directly, OTDR-derived loss values are not equivalent to OLTS insertion loss. On singlemode plant the measurement approaches agree closely when a proper bidirectional average is used; however, OTDR still does not replace OLTS as the acceptance certification measurement (TIA-526-7A).',
    },
    {
      term: 'VFL',
      definition:
        'A handheld tool that injects visible red laser light (typically 650 nm) into a fiber. The red glow is visible through the cable jacket at breaks, tight bends, or macrobend sites within roughly 5 km. A VFL is the first field verification step — it confirms continuity (does ANY light come out the far end?) and helps identify which fiber in a bundle you are touching. VFL is not a certification instrument but is the fastest, cheapest starting point. Called Tier 0 in this course: VFL → OLTS → OTDR.',
    },
    {
      term: 'TIA-526',
      definition:
        'The ANSI/TIA series of standards for OLTS optical power loss measurements of installed fiber cable plant. TIA-526-7A governs singlemode measurements; TIA-526-14B governs multimode measurements. Both define the one-cord, two-cord, and three-cord reference methods. Paywalled — cite edition at publication time. [confirm edition]',
    },
    {
      term: 'dual-wavelength acceptance testing',
      definition:
        'The industry-standard practice of performing OLTS and OTDR measurements at both 1310 nm and 1550 nm on all singlemode OSP fiber plant. The two wavelengths reveal different loss characteristics: a fiber may pass at 1310 nm but fail at 1550 nm due to a macrobend (1550 nm is more sensitive to bending). RUS-program and TIA-568 acceptance both require dual-wavelength testing on singlemode plant. For suspected macrobend locations, add 1625 nm (see T12.L09).',
    },
  ],
  vocabulary_assumed: [
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'dB', source_lesson_id: 'T02.L05' },
    { term: 'dBm', source_lesson_id: 'T02.L05' },
    { term: 'link budget', source_lesson_id: 'T02.L06' },
    { term: 'insertion loss (IL)', source_lesson_id: 'T11.L12' },
    { term: 'return loss (RL)', source_lesson_id: 'T11.L12' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T12L01_TierVsTier() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          You've just spliced the last fiber on a 10-mile OSP run. The contractor hands you
          a USB drive with OTDR traces and says "all fibers certified." Your project manager
          says "great, bill it." Six weeks later the telecom company fires up the OLT and
          half the paths are below their optical budget. Everyone starts asking why.
        </p>
        <p className="mt-2">
          The answer is almost always the same: the contractor delivered Tier-2 only (OTDR
          event characterization) when the contract required Tier-1 (OLTS insertion loss
          certification). These are different instruments measuring different things. They
          are not interchangeable — period.
        </p>
        <p className="mt-2">
          This lesson teaches the three-tool progression every OSP acceptance job follows,
          what each instrument actually measures, and why you need all three for a complete
          acceptance package.
        </p>

        <p className="text-slate-400 text-sm mb-3 mt-6 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Recall from <strong>T02.L06 Link Budget</strong> — the optical budget defines how much loss the link can tolerate. Testing with both OLTS and OTDR ensures the plant actually meets that budget. OTDR alone cannot prove the cable is acceptable; only OLTS measurements match the link budget tier requirements.
        </p>

        <div className="mt-4 p-4 border border-blue-400/30 bg-blue-400/5 rounded-lg text-sm">
          <p className="font-semibold text-blue-300 mb-2">Refresher: Prerequisites for this lesson</p>
          <ul className="text-slate-300/90 space-y-1 list-disc pl-5">
            <li><strong>Attenuation:</strong> Signal loss as light travels through fiber (from T02.L02)</li>
            <li><strong>dB and dBm:</strong> Units for expressing optical power and loss (from T02.L05)</li>
            <li><strong>Link budget:</strong> The contract-specified maximum allowable loss from source to receiver (from T02.L06)</li>
            <li><strong>Insertion loss:</strong> The total end-to-end power loss measured by an OLTS (from T11.L12)</li>
          </ul>
        </div>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it does</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OLTS</td>
              <td className="px-3 py-2">Optical Loss Test Set</td>
              <td className="px-3 py-2">Light source + power meter — measures actual power loss end-to-end (Tier-1 certification)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OTDR</td>
              <td className="px-3 py-2">Optical Time-Domain Reflectometer</td>
              <td className="px-3 py-2">Pulse-and-listen instrument — finds and measures individual events by distance (Tier-2 diagnostics)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">VFL</td>
              <td className="px-3 py-2">Visual Fault Locator</td>
              <td className="px-3 py-2">Red laser pointer — confirms continuity, finds breaks and bends visually (Tier-0 field check)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">TIA-526</td>
              <td className="px-3 py-2">TIA Standard 526</td>
              <td className="px-3 py-2">The ANSI/TIA standard that defines how to do OLTS measurements correctly</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IEC 61280-4-2</td>
              <td className="px-3 py-2">International Electrotechnical Commission standard</td>
              <td className="px-3 py-2">IEC standard covering field measurement of fiber attenuation; references bidirectional OTDR procedure</td>
            </tr>
          </tbody>
        </table>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T12-L01"
            cards={[
              {
                id: 'T12-L01-fc-olts',
                front: 'What does an OLTS measure and what tier is it?',
                back: 'OLTS = Optical Loss Test Set. Tier-1 certification instrument. A calibrated light source on one end + a power meter on the other. Directly measures how much optical power is lost traveling end-to-end through the fiber. This is the TRUE insertion loss — the number that determines whether a link will carry traffic reliably.',
              },
              {
                id: 'T12-L01-fc-otdr',
                front: 'What does an OTDR measure and how does its reading differ from OLTS?',
                back: 'OTDR = Optical Time-Domain Reflectometer. Tier-2 diagnostic instrument. Injects a pulse and measures backscattered light to characterize individual events (splices, connectors, bends) by distance. OTDR does NOT replace OLTS — OTDR estimates loss from backscatter rather than measuring transmitted power, so OTDR-derived results are not equivalent to OLTS insertion loss. TIA-526-7A requires OLTS as the acceptance certification measurement regardless of OTDR results.',
              },
              {
                id: 'T12-L01-fc-vfl',
                front: 'What is a VFL and when do you use it?',
                back: 'VFL = Visual Fault Locator. A handheld red laser (650 nm) that makes visible light leak out at breaks, tight bends, or damaged spots within ~5 km. Use FIRST before deploying OLTS or OTDR: confirm continuity (does ANY light come out?), identify which fiber you are touching in a bundle, find gross damage. Tier 0 — not a certification tool.',
              },
              {
                id: 'T12-L01-fc-tia526',
                front: 'What is TIA-526 and what does it cover?',
                back: 'ANSI/TIA-526 series governs OLTS power loss measurements: TIA-526-7A for singlemode, TIA-526-14B for multimode. Defines one-cord, two-cord, and three-cord reference methods. Paywalled — cite edition at publication time. [confirm edition]',
              },
              {
                id: 'T12-L01-fc-dualwavelength',
                front: 'Why must singlemode OSP acceptance testing be done at both 1310 nm AND 1550 nm?',
                back: 'A fiber may pass at 1310 nm but fail at 1550 nm — macrobend loss increases with wavelength, so 1550 nm catches bends that 1310 nm misses. RUS-program and TIA-568 acceptance both require dual-wavelength testing on singlemode plant. If macrobend is suspected, add 1625 nm (see T12.L09).',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-10">
        <h2>The Three-Tool Progression</h2>
        <p>
          Every OSP acceptance job follows the same tool progression. Think of it as a funnel
          from rough-to-precise:
        </p>

        <div className="mt-4 rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Tier</th>
                <th className="px-3 py-2 text-left">Tool</th>
                <th className="px-3 py-2 text-left">What it answers</th>
                <th className="px-3 py-2 text-left">Used for</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Tier 0</td>
                <td className="px-3 py-2">VFL</td>
                <td className="px-3 py-2">"Is the fiber continuous? Is this the right fiber?"</td>
                <td className="px-3 py-2">Field continuity check; fiber identification; gross damage hunt</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Tier 1</td>
                <td className="px-3 py-2">OLTS</td>
                <td className="px-3 py-2">"Does this link lose too much power end-to-end?"</td>
                <td className="px-3 py-2">Acceptance certification; pass/fail per contract spec; both wavelengths</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Tier 2</td>
                <td className="px-3 py-2">OTDR</td>
                <td className="px-3 py-2">"Where are the events and how much does each one cost?"</td>
                <td className="px-3 py-2">Event characterization; splice loss verification; macrobend location; documentation package</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 font-semibold">Why they are not interchangeable</h3>
        <p className="mt-2">
          The OLTS is a <em>direct power measurement</em>. Light goes in one end; you measure
          how much comes out the other end. The math is simple and definitive: if 1.00 mW went
          in and 0.794 mW came out, the insertion loss is exactly 1.0 dB (recall from T02.L05 that <strong>dB</strong> is how we express optical power ratios). No interpretation
          required.
        </p>
        <p className="mt-2">
          The OTDR is an <em>indirect backscatter measurement</em>. It sends a pulse and
          listens for the echo. Each event (splice, connector, bend) reflects or scatters a
          tiny amount of light back. The OTDR estimates the event's loss from those backscatter
          signals — but this is an indirect calculation, not a direct power measurement. For
          singlemode plant, a properly executed bidirectional OTDR average will come close to
          the true insertion loss for most links; however, OTDR-derived results are still not
          equivalent to OLTS and do not substitute for Tier-1 certification (per TIA-526-7A).
          OTDR measurements can diverge from OLTS on links with MFD-mismatched splices
          (gainer artifacts) or unusual backscatter coefficients — exactly the cases where
          an independent power measurement matters most.
        </p>

        <h3 className="mt-6 font-semibold">When is each tier required?</h3>
        <p className="mt-2">
          <strong>Tier-1 (OLTS) is required for acceptance certification on all OSP projects.</strong>{' '}
          TIA-568.3-D and NECA/FOA 301-2016 both specify OLTS as the measurement method for
          cable plant acceptance. RUS-financed projects additionally require bidirectional OTDR
          (Tier-2) per RUS 1753F-401 §5. The two tiers complement each other — as you learned in T02.L06, the <strong>link budget</strong> governs which tier you need: OLTS proves the plant meets the budget; OTDR identifies the specific events causing loss.
        </p>
        <p className="mt-2">
          Tier-2 alone is NOT sufficient for acceptance. A contractor who delivers only OTDR
          traces has not completed Tier-1 certification. This happens constantly on smaller jobs.
          When the OLT comes online and paths fail, the missing OLTS data means no one knows the
          actual insertion loss of the link — just the estimated loss from backscatter.
        </p>

        <h3 className="mt-6 font-semibold">Dual-wavelength: the singlemode minimum</h3>
        <p className="mt-2">
          All singlemode OSP acceptance testing — both OLTS and OTDR — must be performed at
          <strong> 1310 nm AND 1550 nm</strong>. The two wavelengths behave differently at the
          same physical defect. A tight bend that barely registers at 1310 nm can cause 0.5 dB
          extra loss at 1550 nm. Without dual-wavelength testing, macrobend problems hide in the
          data until the OLT commissioning reveals them.
        </p>
        <p className="mt-2">
          When macrobend is specifically suspected, add a third wavelength: 1625 nm. At 1625 nm,
          bend loss is 3–5× larger than at 1550 nm, making even small bends visible in the OTDR
          trace. See T12.L09 for the dual-wavelength macrobend detection method.
        </p>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────────── */}
      <section data-tier="advanced" className="mt-10">
        <h2>Book vs. Field: The Certification Gap</h2>

        <div className="rounded-xl border border-white/10 overflow-hidden mt-4">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Book (standard/correct)</th>
                <th className="px-3 py-2 text-left">Field reality</th>
                <th className="px-3 py-2 text-left">Consequence</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Tier-1 OLTS + Tier-2 OTDR required for acceptance; both at 1310 nm + 1550 nm</td>
                <td className="px-3 py-2">Contractor delivers OTDR traces only; customer asks for "OTDR certification"</td>
                <td className="px-3 py-2">Link fails optical budget at OLT commissioning; no OLTS data to diagnose cause; re-test required</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">VFL used first to confirm continuity and fiber identification before deploying OLTS/OTDR</td>
                <td className="px-3 py-2">VFL skipped; tech goes straight to OTDR assuming fibers are the ones they think</td>
                <td className="px-3 py-2">Time wasted measuring the wrong fiber; wrong-fiber splices shipped as certified</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 font-semibold">Standards references</h3>
        <ul className="list-disc ml-6 text-slate-300/90 space-y-1 mt-2 text-sm">
          <li><strong>TIA-526-7A</strong> — OLTS measurement procedure for singlemode installed plant [paywalled — confirm edition]; cited via NECA/FOA 301-2016</li>
          <li><strong>TIA-526-14B</strong> — OLTS measurement procedure for multimode installed plant [paywalled — confirm edition]; cited via NECA/FOA 301-2016</li>
          <li><strong>IEC 61280-4-2</strong> — Field measurement of optical attenuation of installed singlemode plant; references bidirectional OTDR [paywalled — confirm edition]</li>
          <li><strong>NECA/FOA 301-2016</strong> — Standard for Installing and Testing Fiber Optics; public PDF at thefoa.org; §1 covers tier definitions and dual-wavelength requirements</li>
          <li><strong>EXFO Application Note 342</strong> — Link loss measurement uncertainties: OTDR vs. OLTS; public at exfo.com; discusses measurement difference sources between OTDR and OLTS. Note: systematic bias effects documented in AN342 are predominantly a multimode concern; singlemode plant with bidirectional OTDR averaging shows much closer agreement with OLTS.</li>
        </ul>
      </section>

      {/* ── QUIZ ──────────────────────────────────────────────────────────── */}
      <section data-tier="quiz" className="mt-10">
        <Quiz
          lessonId="T12.L01"
          questions={[
            {
              id: 'T12-L01-Q1',
              type: 'mc',
              question:
                'A contractor delivers a USB drive with OTDR trace files for every fiber on a 10-mile OSP run and calls the job "certified." What is missing from a complete acceptance package per TIA-526-7A and NECA/FOA 301-2016?',
              choices: [
                'The OTDR traces need to be printed on paper instead of digital files',
                'Tier-1 OLTS insertion loss measurements — OTDR traces alone do not constitute acceptance certification',
                'The traces need to be signed by a PE',
                'Nothing is missing — OTDR traces are sufficient for OSP acceptance',
              ],
              correct: 1,
              explanation:
                'TIA-526-7A and NECA/FOA 301-2016 require OLTS measurements for acceptance certification. OTDR traces are Tier-2 diagnostic data — valuable for locating events but not a substitute for actual power loss measurement. The contractor has delivered Tier-2 only.',
            },
            {
              id: 'T12-L01-Q2',
              type: 'mc',
              question:
                'Before deploying an OTDR on a new splice job, a technician wants to quickly confirm that the fiber run has continuity and identify which fiber in a 48-count cable they are working on. The fastest and cheapest tool for this first step is:',
              choices: [
                'OTDR at short range',
                'OLTS with the light source only',
                'VFL (Visual Fault Locator)',
                'Call the other end of the cable',
              ],
              correct: 2,
              explanation:
                'The VFL (Tier 0) is designed exactly for this: inject visible red light, look for the glow at the far end or at the break/bend. It confirms continuity and helps identify which fiber you are touching within seconds and at a fraction of the cost of deploying OTDR.',
            },
            {
              id: 'T12-L01-Q3',
              type: 'mc',
              question:
                'Why must singlemode OSP acceptance testing be done at BOTH 1310 nm and 1550 nm rather than just one wavelength?',
              choices: [
                'The two wavelengths serve different traffic; one for voice, one for data',
                'A macrobend that passes at 1310 nm may still cause significant loss at 1550 nm — the two wavelengths reveal different defect signatures',
                'Regulations require two wavelengths only for underground cable, not aerial',
                'OTDR equipment cannot test both wavelengths simultaneously so one is a backup',
              ],
              correct: 1,
              explanation:
                'Bend loss scales with wavelength — longer wavelengths are more sensitive to macrobends. A tight bend that barely registers at 1310 nm can cause 0.5 dB extra loss at 1550 nm. Testing at both wavelengths catches what a single-wavelength test would miss. This dual-wavelength requirement is specified in NECA/FOA 301-2016 and TIA-526-7A.',
            },
            {
              id: 'T12-L01-Q4',
              type: 'drag-match',
              question: 'Match each tool to its primary purpose:',
              pairs: [
                { item: 'VFL', match: 'Continuity check and fiber identification — visible red light shows breaks within ~5 km' },
                { item: 'OLTS', match: 'Acceptance certification — directly measures true end-to-end insertion loss in dB' },
                { item: 'OTDR', match: 'Event characterization — finds splice locations, measures individual event losses, produces trace documentation' },
              ],
            },
          ]}
        />
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          This lesson builds on:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T02.L02</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T02.L05</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T02.L05</strong> — Part of the broader OSP workflow.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Each step in the OSP process feeds into the next — understanding these connections strengthens your grasp of the whole system.
        </p>
      </section>
    </LessonLayout>
  );
}
