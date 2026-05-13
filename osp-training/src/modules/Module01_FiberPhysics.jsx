import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import LinkBudgetCalculator from '../components/LinkBudgetCalculator.jsx';
import { ModuleHeader, Section, Callout, RefList } from '../components/ModuleLayout.jsx';

/**
 * Module 1 — Fiber Physics
 *
 * Editorial rules (Agent C / QA):
 *   - Numeric specs cite their source (ITU-T G.652.D, FOA, TIA-568.3-D, etc.).
 *   - Field rules-of-thumb are tagged "Field" and explicitly described as approximate.
 *   - Anything we are not certain of is tagged "Verify" with what to confirm.
 *   - We do NOT cite NESC clearance values in this module — those belong in Module 2.
 */
export default function Module01_FiberPhysics() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={1}
        title="Fiber Physics"
        intro="Wavelengths, attenuation, dispersion, and the difference between what datasheets specify and what crews actually plan around in the field. Where a number depends on the fiber type, datasheet, or AHJ, we say so rather than pretending there is one universal answer."
      />

      <Section title="1.1 Why these wavelengths?">
        <p>
          Single-mode optical fiber is engineered around three low-loss
          "windows" in fused-silica glass. Each window has different
          attenuation and dispersion behavior, which is why a 1310 nm laser
          and a 1550 nm laser don't reach the same distance over the same
          cable.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong>1310 nm (O-band)</strong> — historically the
            "zero-dispersion" window for standard single-mode fiber. Low
            chromatic dispersion makes it forgiving for shorter, lower-cost
            runs and for transceivers that can't tolerate a wide pulse spread.
          </li>
          <li>
            <strong>1550 nm (C-band)</strong> — minimum attenuation window in
            standard SMF. Used for long-haul, DWDM, and most metro/access
            transport. Pays for that low loss with much higher chromatic
            dispersion.
          </li>
          <li>
            <strong>1625 nm (L-band)</strong> — primarily used for in-service
            fiber monitoring and as the OTDR test wavelength to expose
            macrobends, because bend loss grows with wavelength.
          </li>
        </ul>

        <Callout kind="field" title="What the field actually does">
          On most live PON / metro builds, splicing crews shoot OTDR traces at
          <em> two </em> wavelengths — typically <strong>1310 + 1550</strong> for SMF, or
          <strong> 1550 + 1625</strong> if they specifically want to hunt
          macrobends. The "1310/1550/1625 trio" you see in textbooks is a
          superset; an actual contract often calls out only the pair the
          customer wants to certify.
        </Callout>
      </Section>

      <Section title="1.2 Attenuation — what the spec says vs. what designers plan around">
        <p>
          Attenuation is the loss of optical power per unit length, expressed
          in dB/km. Real-world loss in a cable plant is the sum of fiber loss,
          splice loss, connector loss, and any patch / WDM components.
        </p>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Wavelength</th>
                <th className="px-3 py-2 text-left">ITU-T G.652.D max</th>
                <th className="px-3 py-2 text-left">Typical datasheet</th>
                <th className="px-3 py-2 text-left">Designer planning value</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">1310 nm</td>
                <td className="px-3 py-2">≤ 0.4 dB/km</td>
                <td className="px-3 py-2">≈ 0.32–0.35 dB/km</td>
                <td className="px-3 py-2">0.35 dB/km (with margin)</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">1550 nm</td>
                <td className="px-3 py-2">≤ 0.3 dB/km</td>
                <td className="px-3 py-2">≈ 0.18–0.22 dB/km</td>
                <td className="px-3 py-2">0.22–0.25 dB/km</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">1625 nm</td>
                <td className="px-3 py-2">≤ 0.4 dB/km</td>
                <td className="px-3 py-2">≈ 0.20–0.23 dB/km</td>
                <td className="px-3 py-2">0.25 dB/km (bend-sensitive)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Sources: ITU-T G.652 (max attenuation values); typical vendor
          datasheets (Corning SMF-28, Prysmian, OFS) for "typical" column.
          Designer planning values are approximations widely used by the
          author; <em>always</em> use the worst-case value from the project's
          actual fiber datasheet.
        </p>

        <Callout kind="book" title="Textbook framing (BICSI OSPDRM / FOA)">
          Loss budget = (fiber length × dB/km) + (connector count × per-connector loss)
          + (splice count × per-splice loss) + safety margin. Textbooks normally
          plug in 0.35 / 0.25 dB/km for 1310 / 1550 SMF and 0.75 dB per
          connector (TIA-568.3 max).
        </Callout>

        <Callout kind="field" title="What a splicing/test crew uses on the truck">
          Field rules of thumb you'll hear regularly: <strong>0.15 dB per fusion
          splice</strong> (the FOA loss-budget planning value; field quality target
          is ≤ 0.05 dB on the splicer estimate, and acceptance is often ≤ 0.10 dB
          bidirectional — real fusion splicers routinely produce ≤ 0.05 dB on a good
          day), 0.3 dB per fusion splice-on connector (per FOA guidance — well below
          the TIA max), and a flat 3 dB safety pad at the end of the link budget.
          These are <em>internal company numbers</em>, not standards. Vendors and
          POPs may impose tighter ones.
        </Callout>

        <Callout kind="warn" title="Where the numbers get fuzzy">
          The "0.75 dB per connector" maximum from TIA-568 is what textbooks
          quote, but TIA-568.3-D introduced a <em>reference-grade</em>
          connector category whose value is much tighter. If the spec sheet
          you're handed just says "TIA-568" without a revision letter, ask
          which revision and which connector grade — the loss budget can
          differ by a factor of two.
        </Callout>
      </Section>

      <Section title="1.3 Dispersion — why 1550 nm goes further but smears more">
        <p>
          Dispersion is pulse spreading. In single-mode fiber the dominant
          mechanism is <strong>chromatic dispersion (CD)</strong>: different
          wavelengths inside the same pulse travel at slightly different
          speeds. Standard G.652 fiber has its zero-dispersion wavelength
          near 1310 nm and roughly <strong>17 ps/(nm·km) at 1550 nm</strong>
          — that's why 10 G / 100 G systems on long 1550 nm runs need
          dispersion compensation while 10 km 1310 nm links don't.
        </p>
        <p className="mt-2">
          A second mechanism, <strong>polarization-mode dispersion (PMD)</strong>,
          becomes relevant on aged or poorly-installed fiber and on coherent
          systems above ~10 Gb/s. ITU-T G.652.D caps PMD at ~0.2 ps/√km on
          new cable.
        </p>

        <Callout kind="book" title="The exam-style framing">
          1310 nm = low dispersion, higher attenuation. 1550 nm = lowest
          attenuation, highest dispersion in G.652. 1625 nm = bend-sensitive,
          used for OTDR fault location.
        </Callout>

        <Callout kind="field" title="What it sounds like on the truck">
          "1310 for short, 1550 for long, 1625 to hunt the kink." That's an
          oversimplification but it's the version a crew lead will say. The
          real choice is dictated by the optics already in the customer's
          equipment and the OTDR's installed laser modules, not by an
          abstract preference.
        </Callout>
      </Section>

      <Section title="1.4 Macrobend & microbend loss">
        <p>
          A macrobend is a tight bend you can see (a fiber pinched in a
          tray, a kink behind a patch panel). A microbend is a sub-millimeter
          deformation, often from poorly-installed or over-tensioned cable.
          Both add wavelength-dependent loss — and both get worse as
          wavelength increases, which is why 1625 nm is the diagnostic
          wavelength.
        </p>
        <p className="mt-2">
          ITU-T G.652.D limits macrobend loss for a <strong>100-turn,
          30 mm-radius mandrel test at 1625 nm to 0.5 dB</strong>. G.657
          bend-insensitive variants tolerate much tighter bends — that's
          why FTTH drop cable is almost always G.657, not G.652.
        </p>

        <Callout kind="warn" title="Verify before designing">
          The minimum bend radius rules-of-thumb you'll see ("10× cable OD
          loaded, 20× unloaded") are <em>cable-specific</em>, not fiber-specific.
          Pull from the cable manufacturer's installation guide for the
          actual cable on the reel — these vary widely between loose-tube
          OSP cable, ribbon cable, and indoor riser.
        </Callout>
      </Section>

      <Section title="1.5 Decibels — why we add losses, not multiply">
        <p>
          Optical power is logarithmic. dB = 10·log<sub>10</sub>(P<sub>out</sub>/P<sub>in</sub>).
          A loss of 3 dB ≈ half power; 10 dB = one-tenth; 20 dB = one-hundredth.
          Because the math is logarithmic, total link loss is a simple sum of
          all the dB losses on the path — fiber + splices + connectors +
          margin.
        </p>
        <p className="mt-2">
          dBm is dB referenced to 1 mW. A transmitter at +3 dBm puts out
          ~2 mW; a receiver sensitivity of −28 dBm tolerates ~1.6 µW.
          Subtract them and you have the optical budget the cable plant has
          to fit inside.
        </p>
      </Section>

      <Section title="1.6 Putting it together — a worked link budget">
        <pre className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200 whitespace-pre overflow-x-auto">
{`Tx power . . . . . . . . . . . . . . . . . . . +3.0 dBm
Rx sensitivity . . . . . . . . . . . . . . . −24.0 dBm
Available budget . . . . . . . . . . . . . . 27.0 dB

Fiber: 18 km × 0.25 dB/km @ 1550 . . . . . .  4.5 dB
Fusion splices: 6 × 0.15 dB . . . . . . . .  0.9 dB    ← FOA planning value
Connectors: 4 × 0.30 dB . . . . . . . . . .  1.2 dB    ← FOA field default
Safety / aging margin . . . . . . . . . . .  3.0 dB
Total expected loss . . . . . . . . . . . .  9.6 dB

Headroom = 27.0 − 9.6 . . . . . . . . . . . 17.4 dB ✓`}
        </pre>
        <p className="text-[11px] text-slate-400 mt-2">
          This platform defaults to <strong>0.30 dB/connector</strong> — the
          FOA field rule of thumb for adhesive-polish or fusion splice-on
          connectors. Most textbooks and "designer planning" tables you'll
          see in practice use <strong>0.50 dB</strong> as a conservative
          mid-value, and TIA-568 has historically allowed up to{' '}
          <strong>0.75 dB</strong> as a maximum. All three numbers refer to
          the same physical thing — the gap between them is the gap between
          field practice, designer convention, and standards ceiling.
        </p>
      </Section>

      <Section title="1.7 Try it — link budget calculator">
        <LinkBudgetCalculator />
      </Section>

      <Section title="1.8 Scenario-Based Exam">
        <InteractiveQuiz
          title="Module 1 — Scenario Exam"
          questions={MODULE1_QUESTIONS}
        />
      </Section>

      <RefList items={[
        { tag: 'book',   text: 'ITU-T G.652 (08/2024) — single-mode fiber attributes', url: 'https://www.itu.int/rec/T-REC-G.652' },
        { tag: 'book',   text: 'FOA Reference Guide — Fiber Optics (free public)', url: 'https://www.thefoa.org/tech/ref/contents.html' },
        { tag: 'book',   text: 'Fluke Networks — TIA-568.3-D reference-grade connector loss', url: 'https://www.flukenetworks.com/knowledge-base/certifiber-pro/new-loss-budget-values-reference-grade-connectors-ansitia-5683-d' },
        { tag: 'field',  text: 'FOA — Guidelines on what loss to expect when testing fiber', url: 'https://www.thefoa.org/tech/loss-est.htm' },
        { tag: 'verify', text: 'Worst-case attenuation at 1625 nm and reference-grade connector exact dB depend on the standard revision and connector class — confirm with the project spec.' },
      ]}/>
    </article>
  );
}

/* ----------------- Quiz Bank ----------------- */

const MODULE1_QUESTIONS = [
  {
    id: 'm1-q1',
    type: 'mc',
    prompt: 'A G.652.D fiber link is being budgeted at 1550 nm. Which "fiber attenuation per km" number is most defensible to use without consulting the actual cable datasheet?',
    choices: [
      '0.18 dB/km — that is what the Corning SMF-28 typical figure shows.',
      '0.22–0.25 dB/km — slightly above the typical datasheet number to leave margin.',
      '0.30 dB/km — the ITU-T G.652.D maximum at 1550 nm.',
      '0.50 dB/km — a safe round figure for any single-mode fiber.',
    ],
    answerIndex: 1,
    explanation:
      'Designers usually plan around a value slightly above the datasheet-typical and well below the ITU spec maximum. Using the 0.30 dB/km spec maximum is overly conservative; using the 0.18 dB/km vendor "typical" leaves no margin for aging or splice contribution.',
    citation: 'ITU-T G.652.D caps attenuation at ≤ 0.30 dB/km @ 1550 nm. Most vendor SMF datasheets list ~0.18–0.22 dB/km typical.',
    fieldNote: '0.22 or 0.25 dB/km is the value almost every OSP designer I have worked with plugs in by default for 1550 nm budgeting on G.652.D outside plant.',
  },
  {
    id: 'm1-q2',
    type: 'mc',
    prompt: 'You are writing the OTDR test plan for a metro single-mode link. The customer wants both a baseline trace and a future-fault diagnostic. Which wavelength pair is most defensible?',
    choices: [
      '850 nm and 1300 nm.',
      '1310 nm and 1490 nm.',
      '1550 nm and 1625 nm.',
      '1310 nm and 1550 nm only — nothing else is needed.',
    ],
    answerIndex: 2,
    explanation:
      '1550 nm gives the lowest-loss baseline; 1625 nm exaggerates macrobend loss, which is exactly what you want for diagnosing in-service problems. 850/1300 nm are multimode wavelengths.',
    citation: 'OTDR best practice (FOA, BICSI OSPDRM): 1550 + 1625 nm for SMF macrobend hunting.',
    fieldNote: 'Many crews do 1310 + 1550 for acceptance testing and only add 1625 nm if the customer paid for it or if a fault is suspected — the second laser module is not free.',
  },
  {
    id: 'm1-q3',
    type: 'mc',
    prompt: 'A junior designer asks why 1550 nm has the lowest fiber attenuation but is not always the best choice for a short 5 km link. The most accurate answer is:',
    choices: [
      '1550 nm transceivers are always more expensive, period.',
      'At 1550 nm, chromatic dispersion in G.652 is around 17 ps/(nm·km) — over short links the lower attenuation barely matters but the dispersion penalty does.',
      '1550 nm cannot be used over single-mode fiber under 10 km.',
      '1310 nm is required by TIA standards for any link under 10 km.',
    ],
    answerIndex: 1,
    explanation:
      'On short SMF links, the attenuation difference between 1310 and 1550 nm is small in absolute terms (a few tenths of a dB), but the dispersion penalty at 1550 nm and the higher transceiver cost can outweigh that savings.',
    citation: 'G.652 zero-dispersion wavelength is in the 1300–1324 nm range; CD at 1550 nm ≈ 17 ps/(nm·km).',
    fieldNote: 'On short campus runs, designers default to 1310 nm "BiDi" or "LR" optics because they are cheaper, plentiful, and don\'t need dispersion compensation. 1550 nm shows up when DWDM, long-haul, or amplification enters the picture.',
  },
  {
    id: 'm1-q4',
    type: 'dragdrop',
    prompt: 'Match each measurement situation to the wavelength most commonly used for it. (Drag the wavelength tag onto the correct port.)',
    items: [
      { id: 'w1310', label: '1310 nm' },
      { id: 'w1550', label: '1550 nm' },
      { id: 'w1625', label: '1625 nm' },
    ],
    targets: [
      { id: 't1', label: 'Long-haul / DWDM transport — lowest fiber loss' },
      { id: 't2', label: 'In-service macrobend & fault location with OTDR' },
      { id: 't3', label: 'Standard short-reach SMF transceivers (LR-style)' },
    ],
    correctMap: {
      t1: 'w1550',
      t2: 'w1625',
      t3: 'w1310',
    },
    explanation:
      '1550 nm has the lowest attenuation (long haul / DWDM); 1625 nm exaggerates bend loss (macrobend hunting); 1310 nm is the historic short-reach SMF wavelength and is what almost all "10GBASE-LR" / "1000BASE-LX" optics use.',
    citation: 'ITU-T G.652 / G.657, IEEE 802.3 LR/LX optics specifications.',
    fieldNote: 'You\'ll hear the pattern stated as "55 for distance, 25 for bend, 10 for normal." It\'s a simplification — the actual pick depends on the optics and the OTDR module installed.',
  },
  {
    id: 'm1-q5',
    type: 'mc',
    prompt: 'A spec sheet just says "TIA-568 compliant" for the patch cords. Why should you push back before signing off?',
    choices: [
      'Because TIA-568 is the wrong document for fiber patch cords.',
      'Because the maximum connector loss has changed across TIA-568 revisions and connector grades — without the revision letter and grade, the loss number you can plan around is ambiguous.',
      'Because TIA-568 only covers copper.',
      'Because all TIA-568 patch cords have to be tested against NESC requirements.',
    ],
    answerIndex: 1,
    explanation:
      'TIA-568.3 has been revised multiple times, and the current revision distinguishes "standard" and "reference-grade" connector loss values. Without specifying which revision and which connector grade, "TIA-568 compliant" is too vague to use as a planning input.',
    citation: 'TIA-568.3-D introduced reference-grade connector categories with loss values significantly tighter than the legacy 0.75 dB max.',
    fieldNote: 'In practice, ask the vendor for a tested loss certificate per cord and stop trying to derive it from the spec name. That sidesteps the ambiguity entirely.',
  },
];
