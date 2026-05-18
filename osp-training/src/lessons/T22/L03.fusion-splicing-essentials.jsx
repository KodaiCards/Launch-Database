// T22 CFOT Lesson 3 — Fusion Splicing Essentials
// Field technician focus: machine operation, loss acceptance, documentation

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T22.L03',
  course_id: 'T22',
  title: 'Fusion Splicing Essentials',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T22.L02', 'T11.L01', 'T11.L05'],
  vocabulary_introduced: [
    'fusion splicer',
    'cleave',
    'stripper',
    'splice loss',
    'ARC time',
    'oven mode',
    'real-time monitor',
    'heat-shrink sleeve',
    'splice protector sleeve',
    'mechanical splice',
  ],
  vocabulary_assumed: [
    { term: 'fiber', source_lesson_id: 'T01.L03' },
    { term: 'buffer tube', source_lesson_id: 'T01.L03' },
    { term: 'single-mode fiber', source_lesson_id: 'T02.L01' },
    { term: 'multimode fiber', source_lesson_id: 'T02.L02' },
    { term: 'fusion splice', source_lesson_id: 'T01.L04' },
    { term: 'splice loss', source_lesson_id: 'T11.L01' },
    { term: 'OTDR', source_lesson_id: 'T12.L01' },
  ],
  estimated_minutes: 28,
  learning_objectives: [
    'Operate a fusion splicer to join two fibers with acceptable loss (< 0.1 dB typical)',
    'Understand the cleave, alignment, and fusion workflow',
    'Recognize acceptable vs. unacceptable splice loss from splicer feedback',
    'Apply heat-shrink sleeves to protect splices from mechanical damage',
    'Troubleshoot common fusion splicer errors (contamination, cleave angle, misalignment)',
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T22L03_FusionSplicingEssentials() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A fusion splicer is a precision machine that joins two bare fiber strands by
          melting them together with an electric arc. The machine does most of the thinking—
          it measures the gap between the fibers, adjusts the arc, and tells you the splice loss.
          Your job is to prep the fiber (strip, cleave, clean), load it into the machine,
          and trust the process. If you do it right, the machine will show you a loss under
          0.1 dB—nearly invisible.
        </p>

        <h3 className="mt-4 font-semibold">The Fusion Splicer: What It Does</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          A fusion splicer holds two fiber strands end-to-end and strikes an electric arc between them.
          The arc heats the fiber glass to over 2000°C, softening the ends. The machine then
          pushes them together (fusion), cooling instantly as the arc stops. The result: a permanent
          glass-to-glass bond with just a tiny loss—typically under 0.1 dB.
        </p>

        <h3 className="mt-5 font-semibold">The Splicing Workflow — Step by Step</h3>
        <ol className="space-y-3 mt-3 text-sm text-slate-300/90 list-decimal pl-5">
          <li>
            <strong>Strip the jacket and buffer:</strong> Use a wire stripper to remove the
            outer plastic jacket and colored buffer tube. Leave 1–2 cm of bare fiber.
          </li>
          <li>
            <strong>Clean the fiber:</strong> Wipe the bare fiber with a lint-free cloth and
            isopropyl alcohol (IPA). Any dust, gel residue, or oil will cause a bad splice.
            This is the most common cause of high loss—a dirty fiber.
          </li>
          <li>
            <strong>Cleave the fiber:</strong> Use a mechanical fiber cleaver to cut the fiber
            end perpendicular to the axis. A good cleave looks flat and glassy under magnification.
            A bad cleave (angled, chipped, or "hackle-frayed") will cause high loss or complete failure.
          </li>
          <li>
            <strong>Load into the splicer:</strong> Insert each fiber into a V-groove in the
            splicer's alignment mechanism. The machine uses video cameras to see the fiber ends
            and measure the gap.
          </li>
          <li>
            <strong>Run the splicer:</strong> Press the arc button. The splicer measures the gap,
            strikes an arc to fuse the fibers, then counts down as the arc cools. This takes 5–15 seconds.
          </li>
          <li>
            <strong>Read the loss:</strong> The splicer display shows the estimated splice loss
            in dB. Typical single-mode: 0.01–0.1 dB. If higher, the cleave or alignment may be bad.
          </li>
          <li>
            <strong>Protect the splice:</strong> Slide a heat-shrink sleeve over the splice,
            center it, and heat with the splicer's oven or a hand heat gun. The sleeve shrinks
            around the splice, protecting the fragile glass.
          </li>
        </ol>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Splice loss should be under 0.1 dB for single-mode fiber.
            All splices are documented with measured loss values.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> When the splicer shows 0.2 dB, crew members sometimes
            accept it ("close enough") and move on. In high-loss network designs, these
            "close enough" splices add up—10 splices at 0.2 dB each = 2 dB cumulative loss,
            which can push your link budget over the edge. The right move: reject the splice,
            clean the fiber, re-cleave, and try again. One extra minute now saves a callback later.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">The Three Reasons for High Splice Loss</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Root cause</th>
              <th className="px-3 py-2 text-left">What it looks like</th>
              <th className="px-3 py-2 text-left">Fix</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Dirty fiber</td>
              <td className="px-3 py-2 text-xs">Loss jumps from 0.05 dB (good) to 0.3+ dB (bad) on second try</td>
              <td className="px-3 py-2 text-xs">Wipe with fresh IPA cloth, re-cleave, re-splice</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Bad cleave (angled or chipped)</td>
              <td className="px-3 py-2 text-xs">Splicer shows misalignment alert or high loss; fiber end looks rough under mag</td>
              <td className="px-3 py-2 text-xs">Throw away the bad cleave, re-strip fiber, use a fresh cleaver, new cleave</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Core mismatch (SMF ↔ MMF, or different grades)</td>
              <td className="px-3 py-2 text-xs">Loss is consistently high (0.3–1.0 dB) even with perfect cleave and clean fiber</td>
              <td className="px-3 py-2 text-xs">Check the cable jackets. If the fibers are different types, high loss is expected. Use a mechanical splice instead, or accept the loss.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Splicer Settings and Modes</h2>
        <p>
          Modern fusion splicers have two main operating modes: <strong>ARC mode</strong> and
          <strong>OVEN mode</strong>. Both fuse the fibers, but they differ in how they protect
          the splice during heat-shrink.
        </p>

        <div className="mt-3 space-y-3">
          <div className="p-3 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-200">ARC mode</p>
            <p className="text-sm text-slate-300/90 mt-1">
              The splicer fuses the fibers with the arc, then protects the splice from moving by
              continuing a weak heating arc while you slide the heat-shrink sleeve over the splice.
              Once the sleeve is positioned, the splicer releases the arc and you move the sleeve
              to the oven for final heating. <strong>Fast</strong> — typical workflow is 30–45 seconds per splice.
            </p>
          </div>
          <div className="p-3 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-200">OVEN mode</p>
            <p className="text-sm text-slate-300/90 mt-1">
              After the fusion arc completes, the splicer automatically retracts the fibers into
              a heated oven chamber that shrink-wraps the protection sleeve. You don't have to
              manually slide or heat the sleeve—the splicer does it. <strong>Slower</strong> but
              <strong>more hands-off</strong> — typical workflow is 60–90 seconds per splice.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Acceptance Criteria for Splice Loss</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          The CFOT exam focuses on industry-standard loss acceptance:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Fiber type</th>
              <th className="px-3 py-2 text-left">Typical target</th>
              <th className="px-3 py-2 text-left">Acceptable range</th>
              <th className="px-3 py-2 text-left">Reject</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Single-mode (G.652)</td>
              <td className="px-3 py-2">0.05 dB</td>
              <td className="px-3 py-2">0.0–0.1 dB</td>
              <td className="px-3 py-2">&gt; 0.15 dB</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Multimode (OM3/OM4)</td>
              <td className="px-3 py-2">0.1 dB</td>
              <td className="px-3 py-2">0.0–0.2 dB</td>
              <td className="px-3 py-2">&gt; 0.3 dB</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Splicing SMF ↔ MMF (bad idea)</td>
              <td className="px-3 py-2">Expected high loss</td>
              <td className="px-3 py-2">0.5–2.0 dB typical</td>
              <td className="px-3 py-2">Use mechanical splice or accept high loss</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Splicer Maintenance and Cleaner Cassettes</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Fusion splicers come with <strong>cleaner cassettes</strong> — small plastic cartridges
          filled with isopropyl alcohol-soaked ribbons. After every 100–200 splices, insert a new
          cassette and run a cycle to clean the V-grooves where the fibers sit. Dirty grooves cause
          misalignment and high loss. Check the splicer's display or manual for the cassette
          replacement interval.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Troubleshooting High-Loss Splices</h2>
        <p>
          When a splicer shows loss &gt; 0.15 dB on what should be a good splice, follow a
          methodical troubleshooting flow:
        </p>
        <ol className="space-y-2 mt-3 text-sm text-slate-300/90 list-decimal pl-5">
          <li>
            <strong>Check the display:</strong> Does the splicer show any error codes or
            misalignment alerts? If so, check the user manual.
          </li>
          <li>
            <strong>Inspect the cleave under magnification:</strong> A 10× hand magnifier or
            splicer-built-in camera should show a flat, glassy end. Angled, chipped, or
            "hackle-frayed" ends must be discarded and re-done.
          </li>
          <li>
            <strong>Clean the fiber again:</strong> Use a fresh IPA cloth. Old cloth may have
            absorbed dust or dried residue.
          </li>
          <li>
            <strong>Clean the splicer grooves:</strong> Insert a cleaner cassette if the last
            one was used &gt; 100 splices ago.
          </li>
          <li>
            <strong>Re-cleave with a fresh cleaver:</strong> Old cleavers develop microchips.
            If the cleaver blade looks worn or scratched, replace it (or use a different cleaver).
          </li>
          <li>
            <strong>Try one more splice:</strong> If all above steps pass, retry. If still high,
            the fiber itself may be defective or the cores are incompatible.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">Mechanical Splices as a Backup</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          When fusion splicing fails repeatedly (e.g., core mismatch, incompatible fiber grades,
          or contamination that won't clear), the field solution is a <strong>mechanical splice</strong>—
          a small connector that aligns fibers without glass-to-glass fusion. Mechanical splices have
          higher loss (typically 0.2–0.5 dB) and require more maintenance, but they work when
          fusion won't. CFOT and CFOS certifications expect technicians to know when to use them.
        </p>
      </section>

      {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
      <Flashcard
        deckId="T22-L03"
        cards={[
          { id: 'T22-L03-FC-1', front: 'Fusion splicer', back: 'A precision machine that joins two fiber strands by striking an electric arc to melt and fuse the glass together. Measures splice loss and can apply heat-shrink sleeves in oven mode.' },
          { id: 'T22-L03-FC-2', front: 'Cleave', back: 'To cut a fiber end perpendicular to the axis using a mechanical fiber cleaver. A good cleave is flat and glassy; a bad cleave (angled or chipped) causes high splice loss.' },
          { id: 'T22-L03-FC-3', front: 'Splice loss', back: 'The measured signal loss (in dB) at a fusion splice. Typical single-mode: 0.05 dB. Acceptable range: 0.0–0.1 dB. Loss > 0.15 dB should be rejected and re-spliced.' },
          { id: 'T22-L03-FC-4', front: 'ARC mode', back: 'A fusion splicer setting where the machine fuses the fibers, then maintains a weak heating arc while the technician slides the heat-shrink sleeve over the splice. Fast (30–45 sec per splice).' },
          { id: 'T22-L03-FC-5', front: 'OVEN mode', back: 'A fusion splicer setting where the machine fuses the fibers and automatically retracts them into a heated oven to apply the heat-shrink sleeve. Slower (60–90 sec per splice) but more hands-off.' },
          { id: 'T22-L03-FC-6', front: 'Real-time monitor (RTM)', back: 'A camera inside the fusion splicer that watches the fiber ends during arc. Used to measure core diameter, gap, and alignment before and after fusion. Displays on splicer screen.' },
          { id: 'T22-L03-FC-7', front: 'Heat-shrink sleeve', back: 'A plastic tube placed over a fusion splice before heating. Contains internal reinforcement (rod and solder ring in some designs). When heated, shrinks around the splice to protect the fragile glass.' },
          { id: 'T22-L03-FC-8', front: 'Splice protector sleeve', back: 'Same as heat-shrink sleeve — protects the fusion splice from mechanical stress and contamination. Each splice in a splice case gets one.' },
          { id: 'T22-L03-FC-9', front: 'Mechanical splice', back: 'A connector that aligns two fiber cores using precision grooves or lenses, without fusing glass. Higher loss (0.2–0.5 dB) than fusion, but useful when fusion fails.' },
          { id: 'T22-L03-FC-10', front: 'Stripper (fiber stripper)', back: 'A hand tool that removes the buffer tube and outer jacket from a fiber. Similar to a wire stripper but calibrated to fiber diameters (250 µm, 900 µm, 2 mm).' },
        ]}
      />

      {/* ── QUIZ ────────────────────────────────────────────────────────── */}
      <Quiz
        title="T22.L03 Check — Fusion Splicing Essentials"
        mode="multiple-choice"
        questions={[
          {
            id: 'T22-L03-Q1',
            type: 'mc',
            prompt:
              'You fusion splice two single-mode fibers. The splicer displays 0.05 dB loss. You apply the heat-shrink sleeve and move to the next splice. Is this acceptable?',
            choices: [
              'No — 0.05 dB is too low; it indicates under-fusion',
              'Yes — 0.05 dB is well within the 0.0–0.1 dB range and is excellent work',
              'No — you must heat the sleeve before moving on',
              'No — single-mode fibers always show at least 0.1 dB loss',
            ],
            answerIndex: 1,
            explanation:
              '0.05 dB is a textbook good splice for single-mode. Acceptable range is 0.0–0.1 dB, and 0.05 dB indicates excellent core alignment and clean fibers. Heat-shrinking can wait — you don\'t have to do it immediately, as long as the splice is protected from contamination in storage.',
          },
          {
            id: 'T22-L03-Q2',
            type: 'mc',
            prompt:
              'A fusion splicer shows 0.3 dB loss on a single-mode splice. You inspect the cleave under magnification and it looks flat and glassy. You wipe the fiber with a fresh IPA cloth and re-splice — still 0.3 dB. What is the most likely explanation?',
            choices: [
              'The splicer is broken and needs calibration',
              'The two fibers are different types (e.g., SMF and MMF, or different core sizes) and 0.3 dB is expected',
              'The splicer is running out of battery and cannot fuse properly',
              'The heat-shrink sleeve is interfering with the arc and must be removed',
            ],
            answerIndex: 1,
            explanation:
              'If cleave and cleaning are good but loss remains high and consistent, core mismatch is the culprit. Check the cable jackets — are they the same type? Different fiber grades (OM3 vs. OM4, SMF vs. MMF) cause inherent loss. Splicer battery does not affect arc quality in this way.',
          },
          {
            id: 'T22-L03-Q3',
            type: 'fill-in-blank',
            prompt:
              'The three main causes of high splice loss are: dirty fiber, ____ cleave, and core ____.',
            answer: 'bad mismatch',
            answerDisplay: 'bad and core mismatch (or: bad and mismatch)',
            explanation:
              'The three troubleshooting pillars are dirty fiber (clean it), bad cleave (re-cleave or use a fresh cleaver), and core mismatch (check fiber types). Each has a specific fix.',
          },
          {
            id: 'T22-L03-Q4',
            type: 'mc',
            prompt:
              'In OVEN mode, the fusion splicer automatically applies the heat-shrink sleeve after fusion. What is the main advantage of OVEN mode over ARC mode?',
            choices: [
              'Faster — OVEN mode is always 30 seconds faster per splice',
              'Lower loss — OVEN mode produces lower splice loss than ARC mode',
              'Hands-off — the splicer applies the sleeve for you, reducing the chance of misplacing or misaligning the sleeve',
              'Cheaper — OVEN mode uses no heat-shrink material',
            ],
            answerIndex: 2,
            explanation:
              'OVEN mode is attractive because the splicer handles the sleeve placement and heating automatically. This removes human error from the sleeve-positioning step. ARC mode is faster (you do the positioning manually), but requires more skill. Both modes produce equivalent splice loss if done correctly.',
          },
          {
            id: 'T22-L03-Q5',
            type: 'mc',
            prompt:
              'You\'ve spliced 150 fibers with your fusion splicer today without changing the cleaner cassette. Your next splice shows 0.25 dB loss. The cleave and fiber both look good. What should you do?',
            choices: [
              'Accept the 0.25 dB and move on — it\'s within 0.3 dB tolerance for multimode',
              'Replace the cleaner cassette and re-splice after running a cleaning cycle',
              'Clean the fiber with IPA one more time and try again',
              'Switch to a mechanical splice because the splicer is worn out',
            ],
            answerIndex: 1,
            explanation:
              'After ~100–200 splices, the splicer\'s V-grooves accumulate microscopic dust. A new cleaner cassette and a cleaning cycle restore alignment accuracy. This is preventive maintenance that resolves the high loss quickly.',
          },
        ]}
      />

    </LessonLayout>
  );
}
