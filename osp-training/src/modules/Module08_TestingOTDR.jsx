import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';
import OTDRTraceViewer from '../components/OTDRTraceViewer.jsx';

/**
 * Module 8 — Testing: OLTS & OTDR
 *
 * Editorial posture (per docs/research-logs/module08-testing-otdr.md):
 *  - BICSI OSPDRM 6th, TIA-455 (FOTP) family, TIA-568.3-D, IEC 61280-4-2,
 *    and Telcordia GR-196/GR-326 are paywalled. They are referenced
 *    indirectly through FOA, NECA/FOA 301-2016, EXFO, VIAVI, Corning, and
 *    CommScope public engineering documents.
 *  - Every numerical claim is tagged per docs/field-vs-textbook-research.md.
 *  - The "<0.15 dB bidirectional" threshold in the course brief is flagged
 *    UNVERIFIED — see Section 8.4 and the Callout below.
 *  - Fiber attenuation planning values: 0.35 dB/km @ 1310 nm,
 *    0.25 dB/km @ 1550 nm — per NECA/FOA 301-2016 and FOA loss-est page.
 *  - Loss planning values: connector 0.3 dB, fusion splice 0.05–0.10 dB
 *    typical / 0.3 dB max per TIA-568.3-D (cited via secondary sources;
 *    TIA-568.3-D itself is paywalled).
 */

// ─── Synthetic trace for the interactive viewer ──────────────────────────────
// Represents a 20 km single-mode span.  Events:
//   0.30 km  — launch connector (reflective)
//   0.50 km  — end of launch-cable dead zone  (not a real event)
//   4.20 km  — fusion splice (low-loss, non-reflective)
//   9.10 km  — macrobend (non-reflective, significant loss)
//   12.60 km — fusion splice (normal)
//   17.00 km — ghost reflection (appears at double the 8.5 km round-trip)
//   19.70 km — receive connector (reflective)
//   20.00 km — end of fiber
const M8_TRACE_EVENTS = [
  { kind: 'launch',     km: 0,     lossDb: 0    },
  { kind: 'connector',  km: 0.30,  lossDb: 0.30 },   // entry connector
  { kind: 'splice',     km: 4.20,  lossDb: 0.06 },   // clean fusion splice
  { kind: 'macrobend',  km: 9.10,  lossDb: 0.45 },   // suspect — re-test at 1625 nm
  { kind: 'splice',     km: 12.60, lossDb: 0.08 },   // normal fusion splice
  { kind: 'reflective', km: 17.00, lossDb: 0.00 },   // ghost — same distance = 2× round-trip off connector @ 8.5 km
  { kind: 'connector',  km: 19.70, lossDb: 0.30 },   // far-end (receive cable)
  { kind: 'end',        km: 20.00, lossDb: 0    },
];

export default function Module08_TestingOTDR() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={8}
        title="Testing: OLTS &amp; OTDR"
        intro="Tier-1 insertion-loss certification with an OLTS, tier-2 characterization with an OTDR, dead-zone physics, pulse-width selection, bidirectional averaging, macrobend detection, ghost reflections, gainer events, IOR accuracy, and the limits of automated trace analyzers. Every numeric claim is sourced; BICSI OSPDRM 6th, TIA-568.3-D, and IEC 61280-4-2 are paywalled and are cited here through FOA, NECA/FOA 301-2016, and major vendor engineering documents."
      />

      {/* ── Section 1 ─────────────────────────────────────────────────────────── */}
      <Section title="8.1 OLTS (Tier 1) vs. OTDR (Tier 2) — what each one actually proves">
        <p>
          The fiber-testing world divides into two tiers, each answering a
          different question:
        </p>

        <Table
          headers={['Tier', 'Instrument', 'What it measures', 'Governing reference']}
          rows={[
            [
              'Tier 1',
              'OLTS (Optical Loss Test Set) — light source + power meter',
              'End-to-end insertion loss in dB; the only true power-measurement of link loss',
              'TIA-526-7 / TIA-526-14 (one-, two-, three-cord reference methods); NECA/FOA 301-2016',
            ],
            [
              'Tier 2',
              'OTDR (Optical Time-Domain Reflectometer)',
              'Backscatter vs. distance; characterizes individual events (splice loss, connector loss, bends, faults)',
              'TIA-455-61 (FOTP-61) bidirectional procedure; IEC 61280-4-2; NECA/FOA 301-2016',
            ],
          ]}
        />

        <Callout kind="verify" title="Critical distinction: OTDR loss ≠ OLTS loss">
          An OTDR calculates loss from the change in Rayleigh backscatter level.
          That calculation introduces systematic error of <strong>0.05–0.20 dB per
          event</strong> depending on pulse width, cursor placement, and fiber
          uniformity. An OTDR trace is <em>not</em> a substitution for an OLTS
          measurement. The FOA states this explicitly, and every major vendor
          whitepaper repeats it. A link that "passes" on OTDR can still fail at
          the optical-budget margin if OLTS was never run.{' '}
          [FOA OTDR reference page; Fluke Networks "OLTS + OTDR: A Complete
          Strategy" — VERIFIED-public-source]
        </Callout>

        <Callout kind="field" title="What actually happens on many FTTH builds">
          Many contractors deliver only OTDR traces because the customer asked
          for "OTDR certification" and assumed it covered loss. It does not.
          On EPC / turnkey FTTH projects, OLTS is sometimes skipped to save
          time. The network engineer later discovers the difference when the
          link won't close at the OLT. <strong>Both tiers are required for full
          certification.</strong> If the contract says only "OTDR," push back — or
          note the gap in writing. [Mike Holt forum installer discussion;
          Fluke "OLTS + OTDR" doc — paraphrased from VERIFIED-public-source]
        </Callout>

        <p>
          <strong>OLTS reference methods</strong> (TIA-526-7 for singlemode,
          TIA-526-14 for multimode — both paywalled, referenced here via
          NECA/FOA 301-2016 and FOA documentation):
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>One-cord method</strong> — lowest uncertainty; reference cord
            launches directly into the link. Preferred by FOA for premises links.
          </li>
          <li>
            <strong>Two-cord method</strong> — includes one connector pair in the
            reference. Most common carrier / ILM method for outside-plant
            acceptance.
          </li>
          <li>
            <strong>Three-cord method</strong> — includes two connector pairs;
            highest uncertainty but accounts for the most end-connections. Rarely
            used on OSP, common in data centers.
          </li>
        </ul>

        <Callout kind="book" title="Planning-value loss numbers (NECA/FOA 301-2016; FOA loss-est page)">
          These are the defaults the platform's link-budget calculator uses.
          Confirm actual values against your cable/connector datasheets and your
          contract's acceptance spec.
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Connector pair: <strong>0.3 dB</strong> planning value (FOA field rule of thumb; TIA-568.3-D max cited via secondary sources is 0.75 dB general / tighter for reference-grade)</li>
            <li>Fusion splice typical: <strong>≈ 0.05–0.10 dB</strong> [VERIFIED-public-source, FOA]</li>
            <li>Fusion splice max (TIA-568.3-D cap, cited via Corning + Fluke secondary sources): <strong>0.3 dB</strong> [VERIFIED-via-secondary-source]</li>
            <li>Mechanical splice max: <strong>0.3 dB</strong> [FOA — VERIFIED-public-source]</li>
            <li>Fiber attenuation: <strong>0.35 dB/km @ 1310 nm</strong>, <strong>0.25 dB/km @ 1550 nm</strong> (SMF planning values) [NECA/FOA 301-2016 — VERIFIED-public-source]</li>
          </ul>
        </Callout>
      </Section>

      {/* ── Section 2 ─────────────────────────────────────────────────────────── */}
      <Section title="8.2 OTDR fundamentals — the instrument and its limits">
        <p>
          An OTDR injects a narrow laser pulse into one end of the fiber and
          measures the tiny fraction of light that scatters back toward the
          source (Rayleigh backscatter). The time between injection and return
          translates to distance via the fiber's <strong>group index of
          refraction (IOR / EIOR)</strong>. The decay of the backscatter level
          (in dB) vs. distance (in km) is the "trace."
        </p>

        <p>
          Three instrument parameters interact and define what the OTDR can and
          cannot see:
        </p>

        <Table
          headers={['Parameter', 'Effect of increasing', 'Effect of decreasing', 'Tradeoff']}
          rows={[
            [
              'Pulse width',
              'More energy → longer range, lower noise floor',
              'Less energy → shorter range, better event resolution',
              'You cannot have both long range and fine resolution on the same shot',
            ],
            [
              'Range setting',
              'Wider horizontal scale; OTDR allocates more sample time',
              'Compressed scale; OTDR can sample more densely over a short span',
              'Set range ≈ 1.5× fiber length to ensure end reflection is captured [EXFO anote 296]',
            ],
            [
              'Averaging time',
              'More pulses averaged → better SNR (√N law); noise floor drops ≈ 0.5–1 dB per 2× time',
              'Faster completion, more noise',
              'Diminishing returns beyond ~3 min; 30 s is typical for acceptance [FS Community]',
            ],
          ]}
        />

        <Callout kind="book" title="Pulse width vs. application — recommended starting points">
          The EXFO Application Note 296 and EXFO reference poster define practical
          pulse-width bands by application type [VERIFIED-public-source]:
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>5–30 ns</strong> — FTTH premises / MDU inside plant (best dead-zone resolution, short reach)</li>
            <li><strong>100–500 ns</strong> — FTTx feeder and short OSP runs (≤ 10 km)</li>
            <li><strong>1–3 µs</strong> — Metro / regional spans (10–40 km)</li>
            <li><strong>10–20 µs</strong> — Long-haul backbone (&gt; 40 km)</li>
          </ul>
          Short pulse = better dead-zone resolution + worse range.
          Long pulse = better range + worse resolution. Never use a long-haul
          preset on an MDU job — you will blind yourself to the first few
          connectors.
        </Callout>

        <Callout kind="field" title="Most shops use one preset and never change it">
          Real field practice: the OTDR is set to a "metro" or "long-haul" preset
          at the start of the job and never adjusted. EXFO iOLM and VIAVI
          SmartLink Mapper exist precisely because manual pulse-width selection
          was not happening. <strong>Learn manual mode first; treat automation as a
          productivity aid, not a substitute for trace literacy.</strong>{' '}
          [EXFO, VIAVI whitepapers — paraphrased from VERIFIED-public-sources]
        </Callout>
      </Section>

      {/* ── Section 3 ─────────────────────────────────────────────────────────── */}
      <Section title="8.3 Dead zones — event dead zone vs. attenuation dead zone">
        <p>
          Every reflective event (connector, mechanical splice, open end) creates
          a <em>saturation region</em> — a zone immediately after the reflection
          where the detector is still recovering and cannot accurately measure a
          second event.
        </p>

        <Table
          headers={['Dead zone type', 'Abbreviation', 'Definition', 'Typical value (narrow pulse)']}
          rows={[
            [
              'Event dead zone',
              'EDZ',
              'Minimum distance between two reflective events that can still be independently detected',
              '< 1 m at narrowest pulse (5–10 ns) [Fluke Networks KB]',
            ],
            [
              'Attenuation dead zone',
              'ADZ',
              'Minimum distance after a reflective event before a non-reflective event (fusion splice) can be accurately measured. Telcordia definition: ≥ 0.5 dB deviation from backscatter slope [EXFO anote 296, citing Telcordia — VERIFIED-via-secondary-source]',
              '3–5 m at narrowest pulse; 10–50 m at 1 µs pulse; scales roughly with pulse width',
            ],
          ]}
        />

        <Callout kind="verify" title="ADZ Telcordia definition is cited via EXFO, not from the original GR">
          The "0.5 dB deviation from backscatter slope" ADZ definition appears in
          EXFO Application Note 296, which credits Telcordia. The Telcordia GR
          documents are paywalled. Use this as an engineering-grade definition
          (vendor-sourced) and confirm against your project's test spec if
          ADZ is a contractual parameter.
        </Callout>

        <p>
          <strong>Ghost reflections</strong> are false events that appear at
          integer multiples of the round-trip distance to a strong reflector.
          If a connector at 4 km reflects strongly, a ghost often appears at
          8 km — the pulse has bounced back, reflected off the launch port,
          and traveled out again. Ghost signatures:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Appear at exact multiples of the round-trip distance to a real connector</li>
          <li>Show <em>no loss step</em> (the fiber "comes back" to the same backscatter level)</li>
          <li>Disappear or shift when you shorten the pulse width</li>
          <li>Do not appear at the same physical location when you test from the other end</li>
        </ul>

        <Callout kind="field" title="Practical ghost diagnosis: change pulse width, then go bidirectional">
          Shorten the pulse — the ghost should either disappear or move. If it
          moves, it is a ghost. If it stays in the same place from both
          directions, it is a real event. Junior techs frequently accept an
          auto-event-table's "end of fiber" at the ghost location and ship the
          trace — a bad outcome because the real end of fiber has then never
          been measured. [Corning WP1281; STL whitepaper; EXFO —
          paraphrased from VERIFIED-public-sources]
        </Callout>
      </Section>

      {/* ── Section 4 ─────────────────────────────────────────────────────────── */}
      <Section title="8.4 Launch &amp; receive cables, bidirectional averaging, and splice acceptance">
        <p>
          <strong>Launch cable</strong> (also called a launch fiber or OTDR launch
          box): a known-good fiber of defined length connected between the OTDR
          port and the cable under test. It moves the OTDR's entry connector and
          its dead zone <em>off</em> the cable under test, so the first real
          event (the cable's entry connector) appears in clean backscatter.
        </p>
        <p>
          <strong>Receive cable</strong>: a similar known-good fiber on the far
          end, which lets the OTDR see the receive connector as a measurable event
          rather than the abrupt end of the trace.
        </p>

        <Callout kind="book" title="Minimum launch-cable length by application [EXFO anote 298; VIAVI FAQ — VERIFIED-public-sources]">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>≥ 150 m</strong> — premises / FTTx, pulse ≤ 500 ns</li>
            <li><strong>≥ 500 m</strong> — metro / short OSP</li>
            <li><strong>≥ 1 km</strong> — long-haul (≥ 40 km spans); size to the maximum pulse width used (e.g., ~2.5 km launch for 20 µs pulse per EXFO anote 298)</li>
          </ul>
        </Callout>

        <Callout kind="field" title="The 150 m launch box used everywhere">
          Most shops own one 150 m launch box and use it on every job. On a
          40 km span tested with a 10 µs pulse, the dead zone consumes the entire
          150 m reference cable, and the first connector's reported loss is
          fictional. The contract then quietly accepts "entry connector not
          measured" — which means a dirty or damaged connector hides for years
          until the link degrades. Match launch-cable length to pulse width.
          [EXFO anote 298 — VERIFIED-public-source]
        </Callout>

        <h3 className="font-semibold mt-4 mb-2">Bidirectional averaging and gainer events</h3>
        <p>
          An OTDR measures splice loss from <em>one direction only</em>. When two
          fiber segments of slightly different <strong>mode-field diameter
          (MFD)</strong> are fusion-spliced, the OTDR reading depends on which
          fiber the pulse travels through first:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            Pulse traveling from narrower MFD → wider MFD: backscatter level
            jumps upward — the splice appears as a <em>gain</em> event
            ("gainer"). This is physically impossible; it is an artifact of MFD
            mismatch. [CommScope blog; Corning AN3060 — VERIFIED-public-sources]
          </li>
          <li>
            Pulse traveling from wider MFD → narrower MFD: the splice appears to
            have artificially high loss.
          </li>
        </ul>
        <p>
          <strong>Bidirectional averaging</strong> removes this asymmetry:
          the true splice loss is the arithmetic mean of the two unidirectional
          measurements:
        </p>
        <div className="mt-2 bg-black/30 rounded p-3 font-mono text-sm text-slate-200">
          True loss = (loss<sub>A→B</sub> + loss<sub>B→A</sub>) / 2
        </div>
        <p className="mt-2 text-sm text-slate-300/80">
          Example: if A→B reads +0.02 dB (gainer) and B→A reads 0.28 dB,
          bidirectional average = (0.02 + 0.28) / 2 = 0.15 dB.
          [FOA OTDR FAQs — VERIFIED-public-source]
        </p>
        <p className="mt-2 text-sm text-slate-300/80">
          Standards that reference bidirectional measurement procedure: TIA-455-61
          (FOTP-61) and IEC 61280-4-2. Both are paywalled; VIAVI's blog post
          (Feb 2023) names both standards in context.
          [VERIFIED-via-secondary-source]
        </p>

        <Callout kind="verify" title="The '&lt;0.15 dB bidirectional acceptance' threshold — source needed">
          The course brief states a bidirectional splice acceptance criterion of
          <strong> &lt;0.15 dB</strong>. The research log cannot confirm this
          specific threshold from public documents. The most likely authoritative
          sources are BICSI OSPDRM 6th edition, Telcordia GR-326 or GR-1209, or
          carrier construction specifications (AT&amp;T TP-76300, Verizon TP-9,
          or similar) — all paywalled or NDA-bound.{' '}
          <strong>&lt;0.15 dB is commonly cited as a planning value; the
          authoritative source is paywalled — confirm from your project's
          construction specification.</strong>{' '}
          Common contract bands in OSP work: 0.10 dB (long-haul / carrier-class),
          0.15 dB (FTTH feeder / typical aerial restoration), 0.20 dB
          (short-distance restoration acceptance). TIA-568.3-D's unidirectional
          cap is 0.3 dB (cited via secondary sources; TIA-568.3-D is paywalled).{' '}
          [UNVERIFIED-needs-paid-doc — BICSI OSPDRM 6th / carrier OSP spec]
        </Callout>

        <Callout kind="field" title="'Splice acceptance is whatever the contract says'">
          FOA, BICSI, TIA, RUS, and each carrier all give different thresholds.
          The contract spec book is the governing document, not a training
          platform. When no spec is given, 0.15 dB bidirectional average is a
          reasonable default starting point — but get it confirmed in writing.
          [Mike Holt forum; NFM Consulting OTDR page — paraphrased from
          VERIFIED-public-sources]
        </Callout>
      </Section>

      {/* ── Section 5 — Interactive OTDR Trace ───────────────────────────────── */}
      <Section title="8.5 Interactive OTDR trace — read the synthetic 20 km span">
        <p>
          The viewer below renders a synthetic single-mode trace at 0.22 dB/km
          (1550 nm planning value). It is a <em>teaching tool</em>, not a
          calibrated instrument. Use it to practice manual cursor placement and
          to identify each event type before reading the field notes below.
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 mb-4">
          <li>
            <strong>0.30 km</strong> — entry connector (reflective spike + loss step).
            The amber shaded band is the <em>attenuation dead zone</em>; any
            fusion splice within that band would be hard to resolve cleanly.
          </li>
          <li>
            <strong>4.20 km</strong> — fusion splice (non-reflective step, ~0.06 dB).
            Clean; within FOA typical range.
          </li>
          <li>
            <strong>9.10 km</strong> — macrobend event (non-reflective, 0.45 dB).
            This amount of loss at a single non-reflective point should trigger
            a dual-wavelength re-test. If the 1625 nm trace shows significantly
            more loss at this location than the 1550 nm trace, a macrobend is
            the likely cause.
          </li>
          <li>
            <strong>12.60 km</strong> — normal fusion splice (~0.08 dB).
          </li>
          <li>
            <strong>17.00 km</strong> — ghost reflection. Distance ≈ 2 × 8.5 km
            round-trip from the entry connector. Notice there is no loss step —
            the trace returns to the expected backscatter slope. A changed pulse
            width would shift or remove this artifact.
          </li>
          <li>
            <strong>19.70 km</strong> — receive connector (reflective spike).
          </li>
        </ul>

        <OTDRTraceViewer
          totalKm={20}
          dbPerKm={0.22}
          startDb={0}
          events={M8_TRACE_EVENTS}
        />

        <Callout kind="book" title="Manual cursor placement — the correct procedure">
          Place the <em>left cursor</em> on the backscatter slope just before
          the event and the <em>right cursor</em> on the slope just after the
          event (past the dead zone for connectors). The loss reading is the
          vertical difference between the two cursor positions, extrapolated
          from the linear backscatter slope — not from the peak of the spike.
          Automated event tables frequently mis-place the left cursor inside
          the dead zone of the preceding event, producing an artificially low
          loss reading. [FOA Fiber U mini-course; EXFO poster —
          VERIFIED-public-sources]
        </Callout>

        <Callout kind="field" title="'The auto table lied about the first and last connector'">
          Experienced OSP technicians consistently report that the automated
          event table is unreliable for (1) the first event after the launch
          reference and (2) the last event before the receive reference — the
          two connectors you most need to measure accurately. Always manually
          verify these two cursor positions. [Field paraphrase assembled from
          FOA, EXFO, and VIAVI documentation; Lightwave Online commentary]
        </Callout>
      </Section>

      {/* ── Section 6 ─────────────────────────────────────────────────────────── */}
      <Section title="8.6 Macrobend detection and dual-wavelength testing">
        <p>
          Macrobends — excessive bends in the fiber path (pulled tight around a
          corner, kinked in a splice enclosure, over-bent at a service loop) —
          increase attenuation by allowing the fiber's guided mode to couple into
          the cladding. The critical property for OTDR detection:{' '}
          <strong>bend loss scales with wavelength</strong>. Longer wavelengths
          are more sensitive to bending because the mode field extends further
          into the cladding.
        </p>

        <Table
          headers={['Test wavelength', 'Bend sensitivity', 'Primary use']}
          rows={[
            ['1310 nm', 'Lowest', 'Short-reach / premises baseline; standard acceptance wavelength'],
            ['1550 nm', 'Moderate', 'Long-haul baseline; lowest Rayleigh attenuation on G.652 SMF'],
            ['1625 nm', 'Highest (in-service window)', 'Macrobend hunting; used on live fibers carrying 1310/1550 traffic without disturbing service [VIAVI macrobend whitepaper]'],
          ]}
        />

        <Callout kind="book" title="Macrobend heuristic: &gt;0.2 dB wavelength differential [VIAVI whitepaper — VERIFIED-public-source as vendor heuristic; NOT a normative TIA/IEC threshold]">
          If the loss reading at a specific location is &gt;0.2 dB higher at the
          longer wavelength than at the shorter wavelength, suspect a macrobend.
          Example: 1550 nm shows 0.10 dB at km 9.1; 1625 nm shows 0.38 dB at
          the same location — the 0.28 dB differential exceeds the heuristic
          threshold. Practical minimum: always test at 1310 + 1550 nm.
          If a 1625 nm laser is available, use it — you already paid for it.
          [VIAVI macrobend detection whitepaper; EXFO; AFL — VERIFIED-public-sources]
        </Callout>

        <Callout kind="field" title="Most crews only run 1550 nm">
          Standard field practice on smaller jobs is to run only 1550 nm (or
          1310 + 1550 if the OTDR has two lasers). The 1625 nm test is often
          omitted unless the customer explicitly specified it. A bend that
          shows 0.10 dB at 1550 can show 0.35 dB at 1625 and represent a
          temperature-dependent BER failure years later. If your contract scope
          includes macrobend testing, verify which wavelengths are required
          before starting. [docs/field-vs-textbook-research.md §2.4;
          VIAVI macrobend whitepaper — VERIFIED-public-source]
        </Callout>

        <p>
          <strong>G.652.D vs. G.657</strong>: Modern FTTH drop cables and indoor
          risers are often G.657.A1 or G.657.A2 (bend-insensitive). These fibers
          show much lower macrobend loss at 1625 nm than standard G.652.D, which
          can mask an otherwise tight bend. The heuristic thresholds above apply
          to G.652.D; confirm against the cable datasheet for G.657 variants.
        </p>
      </Section>

      {/* ── Section 7 ─────────────────────────────────────────────────────────── */}
      <Section title="8.7 IOR accuracy, distance errors, and trace interpretation pitfalls">
        <h3 className="font-semibold mb-2">Index of refraction (IOR / EIOR)</h3>
        <p>
          The OTDR translates round-trip travel time to distance using:{' '}
          <code className="bg-black/30 px-1 rounded text-amber-200">d = (c × t) / (2 × n)</code>,
          where <em>n</em> is the effective group index of refraction
          (also called EIOR or EGI). The OTDR's factory default is typically
          <strong> 1.4677</strong> for singlemode fiber at 1550 nm
          [Yamasaki Optical 2025 — VERIFIED-public-source].
        </p>

        <Callout kind="verify" title="IOR error → distance error: always use cable manufacturer's value">
          If the true group index is 1.4682 and the OTDR is left at its factory
          default of 1.4677, a 40 km span will be reported as approximately
          14 m too long (error ≈ ΔN / N × distance). On a 40 km fault-location
          job where the dig window is ±5 m, this matters.{' '}
          <strong>Always enter the IOR from the cable manufacturer's datasheet
          before starting any acceptance or fault-location test.</strong>{' '}
          [Yamasaki Optical "IOR and OTDR Testing" (2025) —
          VERIFIED-public-source] The bulk IOR and the effective group index
          (EIOR) can differ; the EIOR / EGI value from the datasheet is the
          correct input.
        </Callout>

        <Callout kind="field" title="Nobody changes the default IOR">
          The OTDR's default IOR is rarely changed in the field. On
          short-distance acceptance testing (premises, FTTH) the error is
          survivable — a few meters over 1 km. On long-haul fault location
          a 30–100 m error sends a tech to the wrong field location. Set the
          IOR for every new cable type tested. [Yamasaki Optical;
          FS Community — paraphrased from VERIFIED-public-sources]
        </Callout>

        <h3 className="font-semibold mt-4 mb-2">Gainer events — diagnosis and resolution</h3>
        <p>
          A "gainer" is a splice that appears on the OTDR trace as a gain (upward
          step) rather than a loss. It is physically impossible for a passive
          splice to add power. The cause is always <strong>mode-field diameter
          (MFD) mismatch</strong> between the two fiber segments:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            Typical scenario: G.652.D (MFD ≈ 10.4 µm) spliced to G.657.A2
            (MFD ≈ 9.2 µm). Testing from the G.652 end, the pulse enters a
            region of higher backscatter, producing an apparent gain.
            [CommScope blog; Lightwave Online — VERIFIED-public-sources]
          </li>
          <li>
            <strong>Diagnosis</strong>: measure from the other direction. A true
            gainer (MFD artifact) will either disappear or become a modest loss
            when tested B→A. A gainer that persists from both directions indicates
            a dirty launch connector or a calibration issue, not MFD mismatch.
          </li>
          <li>
            <strong>Resolution</strong>: bidirectional average the two readings.
            The average is the true splice loss regardless of which direction
            reads high. [FOA OTDR FAQs; Corning AN3060 —
            VERIFIED-public-sources]
          </li>
        </ul>

        <h3 className="font-semibold mt-4 mb-2">Automated vs. manual cursor placement</h3>
        <p>
          Modern OTDRs offer automated event detection (EXFO iOLM, VIAVI
          SmartLink Mapper, Fluke OptiFiber Pro's QuickMap). These tools correctly
          identify and measure the majority of events on clean, well-prepared
          spans. They fail predictably in:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>The first event after the launch reference (cursor often inside the dead zone)</li>
          <li>The last event before the receive reference (same problem, far end)</li>
          <li>Gainer events (may be reported as near-zero loss without a bidirectional flag)</li>
          <li>Ghost reflections close to real events (difficult to distinguish algorithmically)</li>
          <li>Very closely-spaced events (two connectors within 3–5 m of each other)</li>
        </ul>

        <Callout kind="book" title="Module 8 lab requirement: manual cursor placement">
          Automated tools are a productivity feature for technicians who already
          understand traces. Module 8 lab work requires manual cursor placement
          on at least one full acceptance trace before using automated mode.
          [FOA; EXFO; VIAVI — consistent position across public documents —
          VERIFIED-public-sources]
        </Callout>
      </Section>

      {/* ── Section 8 — Scenario-Based Exam ──────────────────────────────────── */}
      <Section title="8.8 Scenario-Based Exam">
        <InteractiveQuiz title="Module 8 — Testing: OLTS &amp; OTDR" questions={M8_QUESTIONS} />
      </Section>

      <RefList items={[
        { tag: 'book',   text: 'FOA — OTDR reference page (tier-1 vs tier-2, pulse width, range, averaging)', url: 'https://www.thefoa.org/tech/ref/testing/OTDR/OTDR.html' },
        { tag: 'book',   text: 'FOA — OTDR FAQs (gainers, bidirectional averaging)', url: 'https://www.thefoa.org/tech/ref/testing/OTDR/OTDR-FAQS.html' },
        { tag: 'book',   text: 'FOA — Fiber U mini-course: Reading an OTDR Trace', url: 'https://fiberu.org/OTDR_Trace/launch_cable.html' },
        { tag: 'book',   text: 'FOA standards document FOA-4 (OTDR testing procedure)', url: 'https://www.thefoa.org/tech/ref/1pstandards/FOA-4.pdf' },
        { tag: 'book',   text: 'NECA/FOA 301-2016 — Standard for Installing and Testing Fiber Optic Cables (public ANSI standard)', url: 'https://www.thefoa.org/tech/ref/1pstandards/NECA301-16_P.pdf' },
        { tag: 'book',   text: 'FOA — Loss to expect (planning values: connector, splice, fiber dB/km)', url: 'https://www.thefoa.org/tech/loss-est.htm' },
        { tag: 'book',   text: 'FOA — Launch/receive reference cables', url: 'https://foa.org/tech/ref/testing/Instruments/refcables.html' },
        { tag: 'book',   text: 'EXFO Application Note 194 — Fundamentals of an OTDR', url: 'https://www.exfo.com/contentassets/7e4d240b6717415283238de7dcec35ba/exfo_anote194_otdr-fundamentals_en.pdf' },
        { tag: 'book',   text: 'EXFO Application Note 296 — Pulse Selection vs. Dead Zone (EDZ/ADZ, Telcordia ADZ definition)', url: 'http://www.fiberworks.no/userfiles/file/EXFO_anote296_Pulse_Selection_vs_Dead_Zone_en.pdf' },
        { tag: 'book',   text: 'EXFO Application Note 298 — Guide to Using and Selecting Launch Fibers for OTDR', url: 'https://www.exfo.com/contentassets/25d0082a2b89474d887b20fe84a22a6d/exfo_anote298_guide-to-using-and-selecting-the-right-launch-fibers-for-otdr-test-sets_en.pdf' },
        { tag: 'book',   text: 'VIAVI — Reference Guide to Fiber Optic Testing Vol 1', url: 'https://www.viavisolutions.com/sites/default/files/support/fiberguide1_bk_fop_tm_ae.pdf' },
        { tag: 'book',   text: 'VIAVI — Macrobend Detection Using an OTDR (1310/1550/1625 wavelength differential, >0.2 dB heuristic)', url: 'https://www.viavisolutions.com/en-us/literature/macrobend-detection-using-otdr-white-papers-books-en.pdf' },
        { tag: 'book',   text: 'VIAVI blog — What the standards say about bi-directional OTDR testing (TIA-455-61, IEC 61280-4-2)', url: 'https://blog.viavisolutions.com/2023/02/13/what-the-standards-say-about-bi-directional-otdr-testing/' },
        { tag: 'book',   text: 'Corning AN3060 — Guidance for OTDR Assessment of Fusion Spliced Single-Mode Fiber', url: 'https://www.corning.com/content/dam/corning/media/worldwide/coc/documents/Fiber/application-notes/AN3060.pdf' },
        { tag: 'book',   text: 'Corning WP1281 — Explanation of Reflection Features in OTDR Measurement (ghost events)', url: 'https://www.corning.com/media/worldwide/coc/documents/Fiber/white-paper/WP1281.pdf' },
        { tag: 'book',   text: 'CommScope blog — Gainer or High Splice Loss: The Effects of Mode Field Diameter (MFD mismatch)', url: 'https://www.commscope.com/blog/2018/gainer-or-high-splice-loss-the-effects-of-mode-field-diameter/' },
        { tag: 'book',   text: 'Yamasaki Optical — IOR and OTDR Testing: bulk IOR vs. EIOR/EGI; distance error example', url: 'https://yamasakiot.com/2025/06/18/ior-on-otdr-testing/' },
        { tag: 'book',   text: 'STL whitepaper — Ghost Events in Optical Time Domain Reflectometer', url: 'https://stl.tech/wp-content/uploads/2023/04/Ghost_events_in_Optical_Time-_New.pdf' },
        { tag: 'book',   text: 'Fluke Networks KB — Attenuation and Event Dead Zones Explained', url: 'https://www.flukenetworks.com/knowledge-base/optifiber-pro/attenuation-and-event-dead-zones-explained-optifiber-pro' },
        { tag: 'book',   text: 'Fluke Networks — OLTS + OTDR: A Complete Testing Strategy', url: 'https://www.flukenetworks.com/edocs/olts-otdr-complete-testing-strategy' },
        { tag: 'forum',  text: 'FS Community — How to Solve Common Problems in OTDR Testing (averaging-time diminishing returns, field practice)', url: 'https://community.fs.com/article/how-to-solve-the-common-problems-in-otdr-testing.html' },
        { tag: 'forum',  text: 'FS Community — OTDR Dead Zone Tutorial (pulse-width bands by application)', url: 'https://community.fs.com/article/otdr-optical-time-domain-reflectometer-dead-zone-tutorial.html' },
        { tag: 'forum',  text: 'Mike Holt forum — fiber optic cable install / OLTS vs OTDR certification discussion', url: 'https://forums.mikeholt.com/threads/fiber-optic-cable.119791/' },
        { tag: 'verify', text: 'TIA-455-61 (FOTP-61) — bidirectional OTDR procedure: paywalled; referenced via VIAVI blog (2023).' },
        { tag: 'verify', text: 'IEC 61280-4-2 — bidirectional splice analysis: paywalled; referenced via VIAVI blog (2023).' },
        { tag: 'verify', text: 'TIA-568.3-D — splice/connector loss caps: paywalled; cited here via Corning and Fluke secondary sources.' },
        { tag: 'verify', text: '"<0.15 dB bidirectional acceptance" — authoritative source likely BICSI OSPDRM 6th, Telcordia GR-326, or carrier OSP construction spec. All paywalled/NDA. Confirm from your project\'s construction specification before using as a contractual threshold.' },
      ]}/>
    </article>
  );
}

// ─── Quiz questions ────────────────────────────────────────────────────────────
const M8_QUESTIONS = [
  {
    id: 'm8-q1',
    type: 'mc',
    prompt: 'A customer asks for "OTDR certification" of their new SMF outside-plant span. After you deliver clean OTDR traces showing all events within spec, the network engineer reports that the link will not close at the optical-budget margin. What is the most likely explanation?',
    choices: [
      'The OTDR traces must have been measured at the wrong wavelength.',
      'OTDR loss readings, derived from backscatter, can carry 0.05–0.20 dB of systematic error per event and are not a substitute for OLTS insertion-loss measurement. The OLTS tier-1 test was never performed.',
      'The OTDR averaging time was too short, producing a noisy measurement.',
      'The IOR was set incorrectly, causing distance errors that shifted the loss readings.',
    ],
    answerIndex: 1,
    explanation: 'OTDR measures backscatter; OLTS measures actual inserted power. The two can differ by the sum of per-event systematic errors — easily 0.5–1 dB on a multi-event link. OTDR traces do not substitute for OLTS tier-1 certification. Both tiers are required for complete fiber link acceptance.',
    citation: 'FOA OTDR reference page; Fluke Networks "OLTS + OTDR: A Complete Testing Strategy" [VERIFIED-public-sources].',
    fieldNote: 'On EPC/FTTH builds, OLTS is often skipped because the customer only specified OTDR. The gap shows up at the OLT during commissioning.',
  },
  {
    id: 'm8-q2',
    type: 'mc',
    prompt: 'You are testing a 40 km OSP span with a 10 µs OTDR pulse. The only launch cable available in the truck is 150 m. What problem does this create for the first connector measurement?',
    choices: [
      'No problem — 150 m is always sufficient.',
      'The 150 m launch cable is too long; it will introduce extra loss into the reading.',
      'The 10 µs pulse generates an attenuation dead zone that is longer than 150 m, placing the entry connector inside the dead zone. Its loss reading will be unreliable or absent.',
      'The IOR setting will drift over 40 km of fiber.',
    ],
    answerIndex: 2,
    explanation: 'A 10 µs pulse produces an attenuation dead zone that is far longer than 150 m. The entry connector lands inside the dead zone, and the reported loss is meaningless. EXFO Application Note 298 recommends approximately 2.5 km of launch cable for a 20 µs pulse; a 1 km launch cable is the practical minimum for long-haul work. The 150 m launch box should be reserved for FTTx / short-pulse applications.',
    citation: 'EXFO Application Note 298 — launch cable selection [VERIFIED-public-source].',
    fieldNote: 'Most field shops use one 150 m launch box regardless of pulse width. On long-haul work, this means the first connector is never actually measured — a problem that hides until the span degrades.',
  },
  {
    id: 'm8-q3',
    type: 'mc',
    prompt: 'An OTDR trace shows a fusion splice at 9.1 km reading −0.08 dB (a gainer) when tested from end A. Tested from end B, the same splice reads +0.28 dB. What is the correct bidirectional-averaged loss, and what caused the gainer?',
    choices: [
      'True loss = 0.20 dB; caused by a dirty connector on the launch cable.',
      'True loss = 0.10 dB; caused by a short averaging time producing noise.',
      'True loss = 0.10 dB; caused by mode-field diameter mismatch between the two fiber segments creating an apparent backscatter increase from one direction.',
      'True loss = 0.28 dB; the gainer reading should be discarded as invalid.',
    ],
    answerIndex: 2,
    explanation: 'Bidirectional average uses the signed values: (−0.08 + 0.28) / 2 = 0.20 / 2 = 0.10 dB. The negative sign in the A→B reading is the algebraic signature of the gainer — including it rather than taking the absolute value is the correct procedure, and it is how the bidirectional average eliminates the MFD-mismatch artifact. The gainer occurs because the fiber on the far side of the splice has a larger mode-field diameter, which increases backscatter level and makes the OTDR perceive an apparent gain; neither the −0.08 dB nor the +0.28 dB reading alone represents the true splice loss.',
    citation: 'CommScope blog; Corning AN3060; FOA OTDR FAQs [VERIFIED-public-sources].',
    fieldNote: 'Junior technicians who accept the gainer as "splice is fine" or flag the 0.28 dB reading as "failed" without bidirectional testing are both making errors.',
  },
  {
    id: 'm8-q4',
    type: 'mc',
    prompt: 'An OTDR event table shows a reflection at 17.0 km on a 20 km span. The strongest real connector is at 8.5 km. The event at 17.0 km shows no loss step — the trace returns to the expected backscatter slope immediately after. What is the most likely explanation?',
    choices: [
      'A mechanical splice with high reflectance at exactly 17.0 km.',
      'A ghost reflection: the pulse bounced off the 8.5 km connector, reflected from the OTDR launch port, and re-entered the fiber, appearing at 2 × 8.5 = 17 km round-trip distance.',
      'A macrobend at 17.0 km creating a reflective event.',
      'An IOR error causing the far-end connector to appear at the wrong distance.',
    ],
    answerIndex: 1,
    explanation: 'Ghosts appear at integer multiples of the round-trip distance to a strong reflective event. A connector at 8.5 km (round-trip 17 km) is a textbook ghost candidate. The key diagnostic: no loss step (the trace level returns to slope), and the event disappears or moves when the pulse width is changed. Bidirectional testing confirms — a ghost does not appear at the same physical distance from the opposite end.',
    citation: 'Corning WP1281; STL whitepaper on ghost events [VERIFIED-public-sources].',
    fieldNote: 'Automated event tables frequently flag ghosts as "end of fiber," causing technicians to truncate their analysis and miss the actual far-end reflection.',
  },
  {
    id: 'm8-q5',
    type: 'dragdrop',
    prompt: 'Match each OTDR scenario to the correct pulse-width or wavelength choice. Drag each selection to its scenario.',
    items: [
      { id: 'short-pulse',   label: '5–30 ns pulse' },
      { id: 'long-pulse',    label: '10–20 µs pulse' },
      { id: 'wl-1310',       label: '1310 nm only' },
      { id: 'wl-1625',       label: '1625 nm (in-service)' },
      { id: 'bidi-avg',      label: 'Bidirectional average' },
    ],
    targets: [
      { id: 't-ftth-mdu',    label: 'Testing an FTTH MDU building — best event resolution, span < 2 km' },
      { id: 't-longhaul',    label: 'Locating a fault on a 120 km long-haul backbone' },
      { id: 't-macrobend',   label: 'Confirming a suspected macrobend on a live in-service span carrying 1310/1550 traffic' },
      { id: 't-gainer',      label: 'Resolving a gainer event at a G.652/G.657 splice to get the true loss' },
      { id: 't-premises-sml',label: 'Quick premises acceptance test, no macrobend suspicion (minimum wavelength)' },
    ],
    correctMap: {
      't-ftth-mdu':     'short-pulse',
      't-longhaul':     'long-pulse',
      't-macrobend':    'wl-1625',
      't-gainer':       'bidi-avg',
      't-premises-sml': 'wl-1310',
    },
    explanation: 'Short pulses (5–30 ns) give best dead-zone resolution for dense FTTH/MDU work. Long pulses (10–20 µs) give the dynamic range needed for 100+ km backbones. 1625 nm is the in-service macrobend-detection wavelength (does not disrupt 1310/1550 traffic). Bidirectional averaging is the only correct method for resolving gainers from MFD mismatch. 1310 nm alone meets the minimum single-wavelength premise acceptance floor where no macrobend suspicion exists.',
    citation: 'EXFO anotes 296/298; VIAVI macrobend whitepaper; FOA OTDR FAQs; EXFO reference poster [VERIFIED-public-sources].',
    fieldNote: 'In practice: always test 1310 + 1550 minimum on any SMF acceptance job. The 1625 nm laser you already paid for on a dual-wavelength module costs nothing to run.',
  },
  {
    id: 'm8-q6',
    type: 'mc',
    prompt: 'Your contract specifies a bidirectional splice acceptance threshold. The course brief mentions "<0.15 dB bidirectional averaged." Which of the following is the most accurate statement about this number?',
    choices: [
      '0.15 dB bidirectional average is a normative requirement in TIA-568.3-D and can be cited as such.',
      '0.15 dB is a common planning value and plausibly originates from BICSI OSPDRM, Telcordia GR-326, or a carrier construction spec — sources that are paywalled. Confirm the authoritative threshold from your project\'s construction specification before using it as a contractual acceptance criterion.',
      '0.15 dB is the TIA-455-61 maximum allowable bidirectional splice loss for all outside-plant applications.',
      '0.15 dB applies only to FTTH splices; long-haul acceptance uses 0.30 dB.',
    ],
    answerIndex: 1,
    explanation: '0.15 dB bidirectional averaged appears throughout the industry as a common planning and acceptance value. It cannot be attributed to a specific freely-available standard. The most likely authoritative sources (BICSI OSPDRM 6th, Telcordia GR-326, carrier OSP construction specs) are all paywalled or NDA-bound. Common OSP contract bands range from 0.10 dB (carrier long-haul) to 0.20 dB (FTTH restoration). Always confirm from the project spec book.',
    citation: 'docs/research-logs/module08-testing-otdr.md §3.1 — UNVERIFIED-needs-paid-doc; FOA loss-est page (0.15 dB as a planning estimate) [VERIFIED-public-source]; TIA-568.3-D unidirectional cap 0.3 dB [VERIFIED-via-secondary-source].',
    fieldNote: '"Splice acceptance is whatever the contract says." — consensus from Mike Holt forum, NFM Consulting, and every carrier PM ever encountered.',
  },
];
