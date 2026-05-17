// Migrated from M01 §1.1 + M03 §3.6 partial (SMF/MMF fiber type selection content)
// T02.L08 — Single-Mode vs. Multimode: Choosing the Right Fiber

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import SideBySide from '../../components/primitives/SideBySide.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T02.L08',
  course_id: 'T02',
  title: 'Single-Mode vs. Multimode — Choosing the Right Fiber',
  order: 8,
  lesson_type: 'working',
  prerequisites: ['T02.L01', 'T02.L07'],
  vocabulary_introduced: ['OM1', 'OM2', 'OM3', 'OM4', 'OM5', 'OS2', 'reach table', 'laser-optimized MMF', 'G.655 (NZ-DSF)'],
  key_terms: [
    { term: 'OM1', definition: 'Multimode fiber grade: 62.5 µm core, 200 MHz-km bandwidth @ 850 nm, max 33 m at 10GbE. Orange jacket. Legacy grade -- do not specify for new 10G+ installations.' },
    { term: 'OM2', definition: 'Multimode fiber grade: 50 µm core, 500 MHz-km bandwidth @ 850 nm, max 82 m at 10GbE. Orange jacket. Legacy grade -- use OM3 or OM4 for modern 10G+ data center work.' },
    { term: 'OM3', definition: 'Multimode fiber grade: 50 µm laser-optimized core. EMB (Effective Modal Bandwidth) = 2000 MHz·km @ 850 nm — the value that governs 10G/40G/100G reach. OFL (Overfilled Launch) = 1500 MHz·km — legacy LED test, not used for modern laser applications. Max reach: 300 m at 10GbE. Aqua jacket.' },
    { term: 'OM4', definition: 'Multimode fiber grade: 50 µm laser-optimized core, 4700 MHz-km bandwidth @ 850 nm, max 400 m at 10GbE. Aqua jacket (sometimes magenta in some regions). Use when run distance exceeds OM3\'s 300 m limit.' },
    { term: 'OM5', definition: 'Multimode fiber grade: 50 µm laser-optimized core. EMB = 28000 MHz·km @ 850 nm (primary spec per TIA-492AAAE); also rated 2470 MHz·km @ 953 nm for SWDM4 short-wavelength WDM. Lime green jacket. Rate-specific reach: 10GbE up to ~400 m, 25GbE up to ~200 m, 100GbE SWDM4 up to ~150 m (per IEEE 802.3bs). Designed for short-wavelength WDM at data center distances.' },
    { term: 'OS2', definition: 'Single-mode fiber grade corresponding to ITU-T G.652.D -- the current standard OSP SMF. Maximum attenuation 0.4 dB/km @ 1310 nm, 0.3 dB/km @ 1550 nm. Reduced water peak. When a spec says "SMF" in an OSP context, it almost always means OS2/G.652.D. Yellow jacket.' },
    { term: 'reach table', definition: 'A table showing the maximum distance a given fiber type (OM1-OM5, OS2) can support for a specific Ethernet speed (1GbE, 10GbE, 40GbE, 100GbE) per IEEE 802.3. Used to quickly determine if MMF or SMF is required for a given application and distance.' },
    { term: 'laser-optimized MMF', definition: 'OM3/OM4/OM5 multimode fiber with a graded-index core profile specifically optimized for 850 nm VCSEL launch conditions. OM3/OM4 are optimized for 850 nm VCSEL; OM5 additionally supports 953 nm VCSEL for SWDM4 short-wavelength wavelength-division multiplexing. This reduces modal dispersion by restricting which modes are excited, dramatically increasing effective bandwidth vs. older LED-compatible OM1/OM2.' },
    { term: 'G.655 (NZ-DSF)', definition: 'ITU-T G.655 Non-Zero Dispersion-Shifted SMF — a single-mode fiber used in carrier DWDM backbones where the zero-dispersion wavelength is intentionally shifted away from 1550 nm to suppress four-wave mixing at high channel counts. OSP engineers specify G.652.D (OS2); G.655 is a carrier-side fiber they coordinate with at the OSP↔carrier handoff point.' },
  ],
  vocabulary_assumed: [
    { term: 'SMF', source_lesson_id: 'T01.L08' },
    { term: 'MMF', source_lesson_id: 'T01.L08' },
    { term: 'total internal reflection', source_lesson_id: 'T02.L01' },
    { term: 'NA', source_lesson_id: 'T02.L01' },
    { term: 'modal dispersion', source_lesson_id: 'T02.L03' },
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'wavelength window', source_lesson_id: 'T02.L07' },
  ],
  estimated_minutes: 25,
};

export default function T02L08_SMFvsMMFChoosing() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          You've been hearing "SMF" (single-mode fiber) and "MMF" (multimode fiber) since T01.
          Now that you know the physics (total internal reflection, attenuation, dispersion,
          wavelengths), you can understand WHY you'd choose one over the other — and what goes
          wrong when you mix them up.
        </p>
        <p className="mt-2">
          The simplest decision rule: <strong>OSP runs longer than a few hundred meters → SMF.
          Data center / campus runs under 400 m → MMF.</strong> That covers 95% of the
          decisions you'll face in the field. The rest of this lesson gives you the reasoning
          behind the rule so you can handle the exceptions.
        </p>

        <h3 className="mt-5 font-semibold">The fundamental tradeoff</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Property</th>
              <th className="px-3 py-2 text-left">Single-Mode (SMF)</th>
              <th className="px-3 py-2 text-left">Multimode (MMF)</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Core diameter</td>
              <td className="px-3 py-2">~9 µm</td>
              <td className="px-3 py-2">50 µm (OM3/4/5) or 62.5 µm (OM1/2)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Cladding diameter</td>
              <td className="px-3 py-2">125 µm (standard for all)</td>
              <td className="px-3 py-2">125 µm (same — they look identical outside)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Number of modes</td>
              <td className="px-3 py-2">One (fundamental)</td>
              <td className="px-3 py-2">Hundreds to thousands</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Modal dispersion</td>
              <td className="px-3 py-2">None (zero by definition)</td>
              <td className="px-3 py-2">Limits bandwidth — MHz·km rating</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Max practical reach</td>
              <td className="px-3 py-2">Tens to hundreds of km</td>
              <td className="px-3 py-2">Tens to ~400 m (OM4 at 40GbE)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Transceiver cost</td>
              <td className="px-3 py-2">Higher (DFB lasers, precise alignment)</td>
              <td className="px-3 py-2">Lower (VCSEL sources, tolerant of alignment)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Primary application</td>
              <td className="px-3 py-2">OSP, long-haul, FTTH</td>
              <td className="px-3 py-2">Data center, campus, in-building</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-sm text-slate-300/80">
          Note: SMF and MMF cables look the same from the outside. Both use 125 µm cladding
          diameter. You CANNOT tell them apart by looking at the jacket — you need to read
          the print on the cable sheath or the markings on patch cords. This is why mixing them
          up (and having a total signal loss) is more common than you'd think.
        </p>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T02-L08"
          cards={[
            { id: 'T02-L08-fc-om1', front: 'What is OM1 fiber?', back: 'Multimode fiber grade: 62.5 µm core, 200 MHz-km bandwidth @ 850 nm, max 33 m at 10GbE. Orange jacket. Legacy grade -- do not specify for new 10G+ installations.' },
            { id: 'T02-L08-fc-om2', front: 'What is OM2 fiber?', back: 'Multimode fiber grade: 50 µm core, 500 MHz-km bandwidth @ 850 nm, max 82 m at 10GbE. Orange jacket. Legacy grade -- use OM3 or OM4 for modern 10G+ data center work.' },
            { id: 'T02-L08-fc-os2', front: 'What is OS2 fiber?', back: 'Single-mode fiber grade per ITU-T G.652.D -- the current standard for OSP work. Max attenuation 0.4 dB/km @ 1310 nm and 0.3 dB/km @ 1550 nm. Reduced water peak. Yellow patch cord jacket. When a spec says "SMF" in an OSP context, it almost always means OS2/G.652.D.' },
            { id: 'T02-L08-fc-om3', front: 'What is OM3 fiber, and what do EMB vs. OFL mean?', back: 'Multimode fiber grade: 50 µm laser-optimized core, max 300 m at 10GbE. Aqua jacket. EMB (Effective Modal Bandwidth) = 2000 MHz·km — measured with a laser/VCSEL launch; the spec that governs 10G/40G/100G applications. OFL (Overfilled Launch) = 1500 MHz·km — measured with a legacy LED launch; lower number, not relevant for modern transceivers. Not usable for OSP runs over a few hundred meters.' },
            { id: 'T02-L08-fc-om4', front: 'What is OM4 fiber?', back: 'Multimode fiber grade: 50 µm laser-optimized core, 4700 MHz-km bandwidth @ 850 nm, max 400 m at 10GbE. Aqua jacket. Use when OM3\'s 300 m limit is insufficient. Still only for data center/campus -- not OSP.' },
            { id: 'T02-L08-fc-om5', front: 'What is OM5 fiber, and what are its EMB specs?', back: 'Multimode fiber grade: 50 µm laser-optimized core, lime green jacket. EMB = 28000 MHz·km @ 850 nm (primary spec per TIA-492AAAE); also rated 2470 MHz·km @ 953 nm for SWDM4 short-wavelength WDM. Rate-specific reach: 10GbE up to ~400 m, 25GbE up to ~200 m, 100GbE SWDM4 up to ~150 m (per IEEE 802.3bs). Not for OSP runs.' },
            { id: 'T02-L08-fc-laseropt', front: 'What does "laser-optimized" mean for MMF?', back: 'OM3/OM4 fiber has a graded-index core profile optimized for 850 nm VCSEL launch conditions. OM5 additionally supports 953 nm VCSEL for SWDM4 short-wavelength wavelength-division multiplexing. All three grades restrict which modes are excited, reducing modal dispersion and dramatically increasing bandwidth vs. older LED-compatible OM1/OM2.' },
            { id: 'T02-L08-fc-g655', front: 'What is ITU-T G.655 (NZ-DSF)?', back: 'ITU-T G.655 Non-Zero Dispersion-Shifted SMF — a single-mode fiber used in carrier DWDM backbones where the zero-dispersion wavelength is intentionally shifted away from 1550 nm to suppress four-wave mixing at high channel counts. OSP engineers specify G.652.D (OS2); G.655 is a carrier-side fiber they coordinate with at the OSP↔carrier handoff point.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The OM and OS Rating Systems</h2>
        <p>
          Fiber has a classification system for both multimode (OM) and single-mode (OS) types:
        </p>

        <h3 className="mt-4 font-semibold">Multimode grades: OM1 through OM5</h3>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Grade</th>
                <th className="px-3 py-2 text-left">Core</th>
                <th className="px-3 py-2 text-left">Bandwidth (@ 850 nm)</th>
                <th className="px-3 py-2 text-left">Max reach: 10GbE</th>
                <th className="px-3 py-2 text-left">Common color</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">OM1</td>
                <td className="px-3 py-2">62.5 µm</td>
                <td className="px-3 py-2">200 MHz·km</td>
                <td className="px-3 py-2">33 m</td>
                <td className="px-3 py-2">Orange</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">OM2</td>
                <td className="px-3 py-2">50 µm</td>
                <td className="px-3 py-2">500 MHz·km</td>
                <td className="px-3 py-2">82 m</td>
                <td className="px-3 py-2">Orange</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">OM3</td>
                <td className="px-3 py-2">50 µm (laser-opt.)</td>
                <td className="px-3 py-2">
                  2000 MHz·km (EMB)&thinsp;/&thinsp;1500 MHz·km (OFL)
                  <span className="block text-xs text-slate-400 mt-1">
                    EMB = Effective Modal Bandwidth (laser/VCSEL launch — the value that matters for 10G/40G/100G).
                    OFL = Overfilled Launch (legacy LED test — lower number, not relevant for modern transceivers).
                  </span>
                </td>
                <td className="px-3 py-2">300 m</td>
                <td className="px-3 py-2">Aqua</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">OM4</td>
                <td className="px-3 py-2">50 µm (laser-opt.)</td>
                <td className="px-3 py-2">4700 MHz·km</td>
                <td className="px-3 py-2">400 m</td>
                <td className="px-3 py-2">Aqua (magenta in some regions)</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">OM5</td>
                <td className="px-3 py-2">50 µm (laser-opt.)</td>
                <td className="px-3 py-2">
                  28000 MHz·km @ 850 nm; 2470 MHz·km @ 953 nm (SWDM4)
                  <span className="block text-xs text-slate-400 mt-1">
                    Per TIA-492AAAE: primary EMB spec is 28000 MHz·km at 850 nm.
                    The 953 nm EMB (2470 MHz·km) enables SWDM4 short-wavelength WDM for 100G on one pair.
                  </span>
                </td>
                <td className="px-3 py-2">400 m (supports SWDM4)</td>
                <td className="px-3 py-2">Lime green</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Source: TIA-492AAAD (OM4), TIA-492AAAE (OM5) [confirm current editions];
          IEEE 802.3 standard for reach values. Reach values are at a specific data rate
          per standard — check the applicable IEEE 802.3 annex for your specific transceiver.
        </p>

        <h3 className="mt-5 font-semibold">Single-mode grades: OS1 and OS2</h3>
        <p>
          Single-mode fiber has two standard grades:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>OS1</strong> — specified in ITU-T G.652.B/C (older). Maximum attenuation
            1.0 dB/km @ 1310 nm. Primarily for indoor/tight-buffer cable.
          </li>
          <li>
            <strong>OS2</strong> — specified in ITU-T G.652.D (current standard). Maximum
            attenuation 0.4 dB/km @ 1310 nm, 0.3 dB/km @ 1550 nm. Reduced water peak
            (1383 nm). This is the standard OSP SMF grade — when a spec says "SMF" in
            an OSP context, it almost always means OS2/G.652.D.
          </li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/80">
          The jacket color for OS2 patch cords is yellow (in North America and most of
          the world). OS1 is also typically yellow. Don't rely on color alone to distinguish
          OS1 from OS2 — read the label.
        </p>

        <h3 className="mt-5 font-semibold">A note on G.655 — Non-Zero Dispersion-Shifted SMF</h3>
        <p className="text-sm mt-2">
          You will occasionally see <strong>ITU-T G.655 (NZ-DSF)</strong> referenced in carrier network
          specs. This is a single-mode fiber type used in long-haul DWDM carrier backbones. G.655
          shifts the zero-dispersion wavelength slightly away from 1550 nm (to approximately
          1500–1600 nm) so that chromatic dispersion never reaches zero at the operating wavelength
          — this intentional residual dispersion suppresses four-wave mixing, a nonlinear effect
          that degrades DWDM systems at high channel counts. (Source: ITU-T G.655 [confirm edition].)
        </p>
        <p className="text-sm mt-2">
          <strong>Why you need to know this:</strong> If your feeder connects to a carrier's
          long-haul backbone, the carrier may be running G.655 fiber on their end. Your OSP
          feeder is still G.652.D (OS2) — the distinction matters if you're performing link-budget
          coordination across the OSP↔carrier handoff. G.655 behaves differently from G.652.D
          at high bit rates. The long-haul and DWDM context is covered in T02.L07 (Wavelength
          Windows — Advanced section).
        </p>
        <p className="text-sm mt-2 text-slate-400">
          <strong>OSP default:</strong> Specify G.652.D (OS2) for every OSP run you design.
          G.655 is a carrier-side fiber type. You do not select it; you coordinate with it
          at the handoff point.
        </p>

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — What Actually Gets Mixed Up</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> "Use SMF for OSP, MMF for data center. They're different."
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Two common mistakes in the field:
          </p>
          <ol className="list-decimal pl-4 space-y-1 mt-1 text-slate-300/90">
            <li>
              <strong>SMF patch cord connected to MMF jack (or vice versa):</strong> Think of it
              like cramming a fire hose into a drinking straw. The single-mode core is only 9 µm
              wide; multimode is 50 or 62.5 µm. Connect a 50 µm MMF output into a 9 µm SMF input
              and you're throwing away roughly 97% of the light — that's where the 20+ dB loss
              comes from. In the other direction (SMF into MMF), almost no light couples usefully
              into the MMF modes at high bit rates. Either way: complete link failure that looks
              like a bad splice or dead transceiver.
            </li>
            <li>
              <strong>OM3 labeled as OM4 or OM5:</strong> The jacket color is the same (aqua).
              If you grab the wrong reel from the truck and build a 350 m 40GbE link with OM3
              instead of OM4, it may fail intermittently (OM3's 300 m limit is exceeded).
              Always check the reel label and the print on the cable, not just the jacket color.
            </li>
          </ol>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — Laser-Optimized MMF and VCSELS</h2>
        <p>
          OM1/OM2 were designed for LED sources (overfilled launch). OM3/OM4/OM5 are
          <strong> laser-optimized</strong> — specifically profiled for 850 nm VCSELs
          (vertical-cavity surface-emitting lasers). VCSELs produce a more concentrated
          launch pattern than LEDs. This allows higher effective bandwidth from the fiber
          because the VCSEL's launch profile excites fewer modes (reduces modal dispersion).
        </p>
        <p className="mt-2">
          The "VCSEL-compatible" or "laser-optimized" distinction matters when you're
          upgrading from OM1/OM2 to OM3: you can't always predict whether the OM3 fiber
          bandwidth spec (measured with a VCSEL) applies to your specific VCSEL transceiver.
          Some transceivers perform slightly above or below the spec on specific fiber
          batches. This is why installed system testing (insertion loss + OTDR, and sometimes
          bandwidth verification) is required on high-density data center deployments.
        </p>
      </section>

      {/* ── SIDE BY SIDE ─────────────────────────────────────────────────── */}
      <SideBySide
        title="SMF vs. MMF — When to Use Which"
        leftLabel="Choose SMF when…"
        rightLabel="Choose MMF when…"
        rows={[
          {
            left: 'The run is longer than 500 m',
            right: 'The run is under 400 m in a data center or campus',
          },
          {
            left: 'The application is OSP (aerial, underground, drop to home)',
            right: 'The application is data center horizontal or backbone cabling',
          },
          {
            left: 'You need to use DWDM or CWDM wavelength stacking',
            right: 'Cost is the primary driver and 10GbE or 25GbE at short reach is sufficient',
          },
          {
            left: 'The customer is a telecom carrier, ISP, or government entity (RUS, BEAD)',
            right: 'You\'re cabling inside a building for enterprise IT',
          },
          {
            left: 'Future upgrades to 100G+ are expected on the same cable',
            right: 'The application is OM5 SWDM4 for 100G at ≤ 150 m',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T02.L08 Check — SMF vs. MMF"
        mode="multiple-choice"
        questions={[
          {
            id: 'T02-L08-Q1',
            type: 'mc',
            prompt:
              'A technician accidentally connects a yellow OS2 SMF patch cord to an aqua OM4 MMF patch panel port. What is the most likely result?',
            choices: [
              'The link works fine — both have 125 µm cladding diameter so they\'re compatible',
              'The link experiences massive signal loss (likely 20+ dB) because the 9 µm SMF core doesn\'t fill the 50 µm MMF core, so most light from the MMF misses the SMF core',
              'The link works at reduced speed (downgrade from 10GbE to 1GbE)',
              'The OM4 cable converts the 1310 nm SMF wavelength to 850 nm automatically',
            ],
            answerIndex: 1,
            explanation:
              'The 9 µm SMF core is far smaller than the 50 µm MMF core. Light coming from the MMF spreads across the full 50 µm — but only a tiny fraction of it falls within the 9 µm SMF core. Result: 20–30 dB of loss at the interface, effectively killing the link. The reverse (SMF into MMF) also fails, but for the opposite reason: the SMF\'s tiny core launches a beam much smaller than the MMF accepts well at high bit rates.',
            fieldNote:
              'Color is your friend: yellow jacket = SMF, aqua = OM3/OM4, lime = OM5, orange = OM1/OM2. But don\'t trust jacket color alone — always read the print on the cable.',
          },
          {
            id: 'T02-L08-Q2',
            type: 'mc',
            prompt:
              'For a 12 km OSP fiber run connecting a rural OLT headend to a remote distribution hub, which fiber type is required?',
            choices: [
              'OM4 multimode — it supports higher bandwidth',
              'OS2 single-mode (G.652.D) — 12 km is far beyond any MMF reach limit',
              'OM5 multimode — it supports SWDM4 and can handle the distance',
              'Either SMF or MMF — the distance is within OM3 spec',
            ],
            answerIndex: 1,
            explanation:
              'OM3 MMF tops out at ~300 m for 10GbE at 850 nm. OM4 at ~400 m. OM5 doesn\'t extend reach significantly beyond OM4 for standard applications. 12 km requires OS2 SMF. No multimode fiber reaches beyond ~550 m for any standard Ethernet application.',
          },
          {
            id: 'T02-L08-Q3',
            type: 'fill-in-blank',
            prompt:
              'The current standard OSP single-mode fiber grade is ____.',
            answer: /os2|g\.652\.d|g652d|g652\.d/i,
            answerDisplay: 'OS2 (ITU-T G.652.D)',
            explanation:
              'OS2 corresponds to ITU-T G.652.D — the "water-peak reduced" standard SMF with ≤ 0.40 dB/km @ 1310 nm and ≤ 0.30 dB/km @ 1550 nm. OS1 (G.652.B/C) is the older, less performant variant. Almost all new OSP deployments specify OS2/G.652.D.',
          },
          {
            id: 'T02-L08-Q4',
            type: 'mc',
            prompt:
              'Why does OM3/OM4/OM5 fiber have a higher bandwidth rating than OM1/OM2, even though all are 50 µm core multimode?',
            choices: [
              'OM3/OM4/OM5 uses a graded-index core profile optimized for 850 nm VCSEL launch conditions — this reduces modal dispersion by restricting which modes are excited',
              'OM3/OM4/OM5 uses single-mode glass chemistry even though the core is larger',
              'OM3/OM4/OM5 is manufactured at lower attenuation, which automatically increases bandwidth',
              'OM3 was retroactively renamed from OM1 — it\'s the same fiber with a new label',
            ],
            answerIndex: 0,
            explanation:
              'OM3/OM4/OM5 are "laser-optimized" — the graded-index profile is tailored for 850 nm VCSEL sources. VCSEL launch characteristics excite fewer high-order modes than an LED overfilled launch. Fewer modes → less modal dispersion → more bandwidth at a given length. This is why the effective modal bandwidth (EMB) test metric was introduced for OM3+ instead of the older overfilled launch bandwidth test.',
            citation: 'TIA-492AAAD (OM4) [confirm edition]; IEEE 802.3 — effective modal bandwidth methodology.',
          },
        ]}
      />

    </LessonLayout>
  );
}
