// Net-new — T19.L02
// T19.L02 — OLT and CMTS as Black Boxes
// Foundation lesson: what active equipment does, from the OSP engineer's perspective

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import SideBySide from '../../components/primitives/SideBySide.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T19.L02',
  course_id: 'T19',
  title: 'OLT and CMTS as Black Boxes',
  order: 2,
  lesson_type: 'foundation',
  prerequisites: ['T19.L01'],
  vocabulary_introduced: [
    'OLT',
    'CMTS',
    'GPON port',
    'upstream',
    'downstream',
    'DOCSIS',
    'line card',
    'chassis',
    'port density',
  ],
  key_terms: [
    {
      term: 'OLT',
      definition: 'Optical Line Terminal — the active equipment in a GPON or XGS-PON FTTH headend that drives the downstream optical signal to subscribers and receives the upstream signal from ONTs. An OLT chassis holds multiple line cards, each with multiple GPON ports. Each GPON port typically feeds up to 32 or 64 subscriber ONTs through a passive optical splitter network in the outside plant. The OLT is the ISP\'s "end of the line" — OSP feeder fiber connects to it.',
    },
    {
      term: 'CMTS',
      definition: 'Cable Modem Termination System — the active equipment in a cable TV (HFC) headend that communicates with subscriber cable modems over a hybrid fiber-coax distribution plant. The CMTS modulates downstream data onto RF carriers and demodulates upstream RF signals from modems. CMTS is to HFC networks what OLT is to GPON/PON networks. OSP engineers who work on HFC plant termination need to understand what the fiber node feeds into at the headend.',
    },
    {
      term: 'GPON port',
      definition: 'A physical optical port on an OLT line card that terminates a single PON (Passive Optical Network) tree. Each GPON port connects to one upstream fiber run that fans out through passive splitters to serve multiple ONTs. A GPON port\'s maximum optical budget is typically 28 dB (Class B+, per ITU-T G.984.2), which determines how many splitter stages and how much fiber distance the OSP plant can include. The OSP engineer\'s link budget calculation must close against this 28 dB figure.',
    },
    {
      term: 'upstream',
      definition: 'Signal traveling from the subscriber (ONT) toward the network (OLT). In GPON, upstream uses the 1310 nm wavelength. In HFC DOCSIS, upstream uses the 5–85 MHz (or 5–204 MHz in DOCSIS 3.1 Extended Spectrum) band on the coax. "Upstream" always means traffic moving from the edge toward the core equipment.',
    },
    {
      term: 'downstream',
      definition: 'Signal traveling from the network (OLT or CMTS) toward the subscriber (ONT or cable modem). In GPON, downstream uses the 1490 nm wavelength. In HFC DOCSIS, downstream uses the 108–1002 MHz (or higher in DOCSIS 3.1) band on the coax. "Downstream" always means traffic moving from the core equipment toward the subscriber.',
    },
    {
      term: 'DOCSIS',
      definition: 'Data Over Cable Service Interface Specification — the set of standards (maintained by CableLabs) that governs how cable modems communicate with a CMTS over HFC coax plant. DOCSIS versions (1.0 through 3.1 and the in-development DOCSIS 4.0) define modulation schemes, channel widths, and maximum downstream/upstream speeds. OSP engineers on HFC builds need DOCSIS version awareness because it affects the optical node design and downstream split ratios.',
    },
    {
      term: 'line card',
      definition: 'A replaceable module inside an OLT or CMTS chassis that provides the active optical (or RF) ports. An OLT line card typically provides 8–16 GPON ports. A CMTS line card provides downstream and upstream RF channels for a segment of subscribers. When a line card fails, that port group goes dark — the OSP engineer needs to know which line card serves which feeder when troubleshooting.',
    },
    {
      term: 'chassis',
      definition: 'The rack-mounted enclosure that holds OLT or CMTS line cards, a shared switching fabric, power modules, and cooling fans. OLT chassis come in small (2–4 line cards, 4U) to large (16+ line cards, 10–20U) form factors. The chassis is typically NEBS-rated (per ANSI/ATIS-0600336) for CO environments. An OSP engineer reviewing a headend specification should note how many chassis slots the OLT has and how many are populated — that determines the available fiber port count for the OSP plant.',
    },
    {
      term: 'port density',
      definition: 'The number of active ports (GPON ports for OLT, RF ports for CMTS) available in a given rack space. Higher port density means more subscriber feeder fibers can be connected per rack unit. Port density is relevant to the OSP engineer because it determines how many ODF patch connections terminate in each rack — which affects ODF layout, fiber management, and the amount of inter-rack cabling between ODF and OLT.',
    },
  ],
  vocabulary_assumed: [
    { term: 'CO', source_lesson_id: 'T19.L01' },
    { term: 'headend', source_lesson_id: 'T19.L01' },
    { term: 'MDF', source_lesson_id: 'T19.L01' },
    { term: 'OSP termination point', source_lesson_id: 'T19.L01' },
    { term: 'OLT', source_lesson_id: 'T01.L08' },
    { term: 'ONT', source_lesson_id: 'T01.L08' },
    { term: 'feeder', source_lesson_id: 'T01.L08' },
    { term: 'GPON', source_lesson_id: 'T01.L08' },
    { term: 'splitter', source_lesson_id: 'T01.L08' },
    { term: 'link budget', source_lesson_id: 'T02.L06' },
  ],
  estimated_minutes: 20,
};

export default function T19L02_OltAndCmtsAsBlackBoxes() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          As an OSP engineer, you design the pipe — the fiber, the conduit, the aerial
          strand — that carries the signal from the headend to the subscriber. But the
          thing that actually generates and receives that signal? That's inside the headend
          in a rack. You need to know what it is, what it does, and what it expects from
          your fiber plant — not because you configure it, but because your OSP design
          must close against its optical budget specifications.
        </p>
        <p className="mt-2">
          Think of the OLT as a bank of laser transceivers in a box. Each transceiver
          port shoots a downstream signal down one feeder fiber toward a splitter
          network that fans it out to dozens of subscribers. The subscribers' ONTs
          send their upstream signals back on the same fiber at a different wavelength.
          The OLT receives all those upstream signals, sorts them by time slot, and
          hands the data to the ISP's router. Your job: make sure the fiber plant between
          the OLT and the ONT closes the link budget. That's it. The OLT is a black box —
          you care about its optical interface specs, not its software.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OLT</td>
              <td className="px-3 py-2">Optical Line Terminal</td>
              <td className="px-3 py-2">The box in the headend that drives fiber to GPON subscribers</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CMTS</td>
              <td className="px-3 py-2">Cable Modem Termination System</td>
              <td className="px-3 py-2">The box in the headend that drives HFC coax to cable modem subscribers</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GPON</td>
              <td className="px-3 py-2">Gigabit Passive Optical Network</td>
              <td className="px-3 py-2">The FTTH technology standard; one OLT port serves up to 64 ONTs</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">DOCSIS</td>
              <td className="px-3 py-2">Data Over Cable Service Interface Specification</td>
              <td className="px-3 py-2">The standard governing cable modem communications over HFC coax</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HFC</td>
              <td className="px-3 py-2">Hybrid Fiber-Coax</td>
              <td className="px-3 py-2">Cable TV architecture: fiber from headend to a node, coax from node to subscribers</td>
            </tr>
          </tbody>
        </table>

        {/* ── FLASHCARDS ───────────────────────────────────────────────── */}
        <Flashcard
          deckId="T19-L02"
          cards={[
            {
              id: 'T19-L02-fc-olt',
              front: 'What is an OLT and what does it do?',
              back: 'Optical Line Terminal — the active equipment in a GPON/XGS-PON headend that drives downstream optical signal to subscribers and receives upstream from ONTs. Each GPON port feeds up to 64 ONTs through passive splitters. OSP feeder fiber connects to OLT ports.',
            },
            {
              id: 'T19-L02-fc-cmts',
              front: 'What is a CMTS?',
              back: 'Cable Modem Termination System — the HFC headend equivalent of an OLT. Communicates with subscriber cable modems over hybrid fiber-coax plant via DOCSIS protocol. The CMTS is to HFC networks what OLT is to GPON networks.',
            },
            {
              id: 'T19-L02-fc-gpon-port',
              front: 'What is a GPON port and what is its optical budget?',
              back: 'A physical optical port on an OLT line card that terminates one PON tree. Typical maximum optical budget: 28 dB (Class B+, per ITU-T G.984.2). The OSP engineer\'s link budget must close within this 28 dB figure including splitter loss, fiber loss, connector loss, and splice loss.',
            },
            {
              id: 'T19-L02-fc-upstream',
              front: 'What does "upstream" mean in a GPON network?',
              back: 'Signal traveling from the subscriber (ONT) toward the network (OLT). In GPON, upstream uses 1310 nm wavelength. Always means traffic moving from the edge toward the core equipment.',
            },
            {
              id: 'T19-L02-fc-downstream',
              front: 'What does "downstream" mean in a GPON network?',
              back: 'Signal traveling from the network (OLT) toward the subscriber (ONT). In GPON, downstream uses 1490 nm wavelength. Always means traffic moving from the core equipment toward the subscriber.',
            },
            {
              id: 'T19-L02-fc-line-card',
              front: 'What is a line card in an OLT chassis?',
              back: 'A replaceable module inside an OLT chassis that provides the active optical ports. Typically 8–16 GPON ports per line card. When a line card fails, that port group goes dark. The OSP engineer needs to know which line card serves which feeder cable for troubleshooting.',
            },
            {
              id: 'T19-L02-fc-chassis',
              front: 'What is an OLT chassis?',
              back: 'The rack-mounted enclosure holding OLT line cards, switching fabric, power modules, and cooling. Sizes from 2–4 line cards (small CO) to 16+ line cards (large CO). NEBS-rated for CO environments (per ANSI/ATIS-0600336). The chassis slot count determines available port capacity for the OSP plant.',
            },
            {
              id: 'T19-L02-fc-port-density',
              front: 'What is port density and why does an OSP engineer care?',
              back: 'The number of active optical ports available per rack unit. Higher density = more feeder fibers per rack. Relevant to OSP because it determines how many ODF patch connections terminate near each OLT rack — affecting ODF layout, fiber management, and inter-rack cabling design.',
            },
            {
              id: 'T19-L02-fc-docsis',
              front: 'What is DOCSIS?',
              back: 'Data Over Cable Service Interface Specification — CableLabs standard governing how cable modems communicate with a CMTS over HFC coax. Versions 1.0 through 3.1 (and DOCSIS 4.0 in development). Relevant to OSP engineers on HFC builds because DOCSIS version affects optical node design and downstream split ratios.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>How the OLT Interfaces with OSP Plant</h2>

        <h3 className="mt-4 font-semibold">The GPON optical path — step by step</h3>
        <p>
          Here's the signal path from the OLT port to the subscriber, and back. Every
          element in this path is something the OSP engineer either designs or specifies:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>OLT GPON port (headend) → ODF patch panel (headend MDF):</strong>
            A short factory-terminated patch cord (LC or SC, OS2, typically 1–3 m) connects
            the OLT port to the ODF front-face connector. This patch cord is inside-plant work.
          </li>
          <li>
            <strong>ODF connector → OSP feeder fiber splice (ODF splice tray):</strong>
            Inside the ODF, the pigtail from the front-face connector is fusion-spliced to
            the OSP feeder fiber. This splice is in the OSP engineer's scope — it's typically
            specified in the splicing matrix.
          </li>
          <li>
            <strong>OSP feeder fiber (underground or aerial) → FDH splitter:</strong>
            The feeder runs through conduit or on aerial strand from the headend to the
            Fiber Distribution Hub (FDH). This is the main OSP plant section.
          </li>
          <li>
            <strong>FDH passive splitter (1:32 or 1:64) → distribution fibers:</strong>
            The passive splitter in the FDH divides the single OLT signal into 32 or 64
            signals for individual subscriber drops. OSP design.
          </li>
          <li>
            <strong>Distribution fiber → subscriber ONT:</strong>
            Drop fiber from FDH to ONT at the subscriber's premises. OSP design.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">What the OLT tells the OSP engineer</h3>
        <p className="mt-2">
          When designing the OSP plant for a GPON network, the critical OLT specifications
          are:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">OLT spec</th>
                <th className="px-3 py-2 text-left">Typical value</th>
                <th className="px-3 py-2 text-left">How OSP design uses it</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Optical budget class</td>
                <td className="px-3 py-2">Class B+ = 28 dB max (Source: ITU-T G.984.2)</td>
                <td className="px-3 py-2">Total allowable loss from OLT port to ONT — drives splitter stage count + fiber distance + connector count in the OSP link budget</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Downstream wavelength</td>
                <td className="px-3 py-2">1490 nm (GPON)</td>
                <td className="px-3 py-2">Use 1490 nm attenuation spec (≤0.35 dB/km on G.652.D) in the link budget calculation</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Upstream wavelength</td>
                <td className="px-3 py-2">1310 nm (GPON)</td>
                <td className="px-3 py-2">Same fiber, WDM filter separates upstream/downstream at OLT and ONT</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Max split ratio</td>
                <td className="px-3 py-2">1:32 or 1:64 (varies by platform)</td>
                <td className="px-3 py-2">Determines how many subscribers can share one GPON port; drives FDH splitter design</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Connector type at OLT port</td>
                <td className="px-3 py-2">LC/UPC or SC/APC (varies by OLT)</td>
                <td className="px-3 py-2">OSP termination must match — SC/APC is preferred for GPON (lower reflection); verify with ISP before splicing pigtails</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SIDE BY SIDE: OLT vs CMTS */}
        <SideBySide
          title="OLT vs. CMTS — Two Technologies, Same Role"
          leftLabel="OLT (GPON / FTTH)"
          rightLabel="CMTS (DOCSIS / HFC)"
          rows={[
            {
              label: 'Technology',
              left: 'All-fiber: GPON (G.984), XGS-PON (G.9807), NG-PON2 (G.989)',
              right: 'Hybrid: Fiber to optical node, coax from node to subscriber. DOCSIS 3.0 / 3.1 / 4.0.',
            },
            {
              label: 'OSP fiber connection',
              left: 'One feeder fiber per GPON port (goes to passive splitter → subscribers)',
              right: 'One feeder fiber per HFC node (goes to optical node which converts to RF coax)',
            },
            {
              label: 'Active in the OSP plant?',
              left: 'No — all splits are passive (splitter cassettes in FDH or pedestal). No active electronics in the OSP feeder path.',
              right: 'Yes — the HFC optical node is an active device powered in the OSP plant (requires powering via coax or separate AC circuit). The node converts fiber to coax and amplifies RF.',
            },
            {
              label: 'OSP fiber count',
              left: 'Scales 1:1 with GPON ports on the OLT. 8-port line card = 8 feeder fibers.',
              right: 'Scales with node count. Each node gets 1–4 fibers (depending on node architecture).',
            },
            {
              label: 'OSP link budget constraint',
              left: '28 dB (Class B+) from OLT port to ONT. Typically covers 20 km + 1:32 split.',
              right: 'Optical budget from CMTS to optical node is typically 15–20 dB over 40–80 km (DWDM-enhanced). Node-to-subscriber coax budget is RF-calculated separately.',
            },
            {
              label: 'Wavelength(s)',
              left: 'DS: 1490 nm / US: 1310 nm (GPON). Video overlay optional: 1550 nm.',
              right: 'Analog / digital RF over coax after node conversion. Fiber to node can be CWDM or DWDM.',
            },
          ]}
        />

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — OLT Connector Types</p>
          <p className="text-slate-300/90">
            <strong>Book (ITU-T G.984.2):</strong> GPON specifies SC/APC connectors for the OLT
            optical interface (APC = angled physical contact, −65 dB reflectance). SC/APC is the
            standard for GPON because the high reflectance of SC/UPC connectors degrades GPON upstream
            link performance.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Many OLT vendors ship with LC/UPC SFP transceivers installed in
            LC ports. The ODF patch cord between OLT and ODF then uses LC/UPC, not SC/APC. The
            inside-plant SFP is designed to tolerate the LC/UPC reflectance because the OLT's receiver
            is already on the other side of the WDM filter. Always verify connector type with the ISP
            team before specifying ODF pigtail connector types — mismatched connectors are a common
            commissioning headache.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — XGS-PON and What It Means for OSP Plant</h2>
        <p>
          GPON (ITU-T G.984) is being supplemented and replaced by XGS-PON (ITU-T G.9807.1),
          which delivers 10 Gb/s symmetric. For the OSP engineer, the key point is that
          XGS-PON runs on the same G.652.D single-mode fiber as GPON — the OSP plant is
          completely reusable. The optical budget class (B+) and maximum split ratio (1:64)
          are similar. The upgrade from GPON to XGS-PON is a headend equipment swap, not
          an outside-plant rebuild.
        </p>
        <p className="mt-2">
          NG-PON2 (ITU-T G.989) uses TWDM (Time and Wavelength Division Multiplexing),
          carrying 4 GPON wavelengths simultaneously on one fiber pair. For the OSP engineer,
          NG-PON2 raises the question of wavelength compatibility at the splitter. NG-PON2
          requires wideband or wavelength-agnostic splitters (transparent from 1260 to 1600 nm)
          rather than GPON-optimized filters. Always confirm with the ISP team which PON
          generation is planned before specifying splitter types in the OSP plant — a GPON-only
          splitter can block NG-PON2 wavelengths.
        </p>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: ITU-T G.9807.1 (XGS-PON); ITU-T G.989.2 (NG-PON2). Both documents are
          paywalled — confirm specifications with OLT vendor documentation.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T19.L02 Check — OLT and CMTS as Black Boxes"
        mode="multiple-choice"
        questions={[
          {
            id: 'T19-L02-Q1',
            type: 'mc',
            prompt:
              'An OSP engineer is designing the feeder plant for a GPON FTTH network. The OLT vendor specs state the optical budget is Class B+. What does this tell the OSP engineer?',
            choices: [
              'The OLT requires B+ rated fiber cable jackets in the conduit',
              'The total optical loss from the OLT port to the subscriber ONT cannot exceed 28 dB — this budget must cover fiber loss, splitter loss, splice loss, and connector loss',
              'The downstream transmission speed is limited to B+ tier (100 Mb/s per subscriber)',
              'The OLT can only serve subscribers within a Class B service area (within city limits)',
            ],
            answerIndex: 1,
            explanation:
              'Class B+ is an ITU-T G.984.2 optical budget class specifying a maximum 28 dB loss from OLT port to ONT. This is the fundamental constraint on the OSP link budget. The OSP engineer must ensure that fiber attenuation + splitter loss + connector loss + splice loss + margin all fit within 28 dB.',
            citation: 'ITU-T G.984.2 — Gigabit-Capable Passive Optical Networks (GPON): Physical Media Dependent (PMD) Layer Specification.',
          },
          {
            id: 'T19-L02-Q2',
            type: 'mc',
            prompt:
              'In a GPON network, which wavelength does the OLT use to transmit data to subscribers (downstream)?',
            choices: [
              '850 nm', '1310 nm', '1490 nm', '1550 nm',
            ],
            answerIndex: 2,
            explanation:
              'GPON uses 1490 nm downstream (OLT → ONT) and 1310 nm upstream (ONT → OLT). Both signals travel on the same single fiber simultaneously — WDM (Wavelength Division Multiplexing) filters at each end separate the two wavelengths. An optional third wavelength (1550 nm) can carry CATV video overlay.',
            citation: 'ITU-T G.984.2.',
          },
          {
            id: 'T19-L02-Q3',
            type: 'mc',
            prompt:
              'An OLT line card fails at the headend, taking down service for 200 subscribers. An OSP technician is asked to help troubleshoot. What should they check in the OSP plant?',
            choices: [
              'Nothing — the line card is inside-plant equipment. OSP plant has no role in a line card failure.',
              'Check the feeder fiber OTDR trace for a break that may have caused the line card to fail due to high-power reflection',
              'Verify which feeder fibers are affected (matching the failed line card\'s ports on the ODF splice matrix), then trace those feeder runs for any OSP-side faults (break, macro-bend, water intrusion at splice case)',
              'Replace the OLT chassis with a backup unit',
            ],
            answerIndex: 2,
            explanation:
              'Even though the failure was a line card, the OSP technician should verify whether any OSP-side fault contributed. Check the splice matrix to identify which OSP feeder fibers connect to the failed line card\'s ports, then OTDR those feeders to confirm no OSP plant fault exists. Unrelated OSP plant issues (water intrusion, break) can cause OLT port events that are misdiagnosed as line card failures.',
            fieldNote:
              'A common troubleshooting mistake: treating every OLT alarm as an inside-plant problem. Always rule out an OSP fault first with an OTDR trace before dispatching a headend technician.',
          },
          {
            id: 'T19-L02-Q4',
            type: 'fill-in-blank',
            prompt:
              'An OLT line card typically provides ____ to ____ GPON ports, with each port serving up to 32 or 64 subscribers through passive splitters in the OSP plant.',
            answer: '8 to 16',
            answerDisplay: '8 to 16',
            explanation:
              'OLT line cards typically provide 8–16 GPON ports. A fully loaded OLT with 8 line cards × 16 ports per card = 128 GPON ports, each capable of serving up to 64 subscribers = up to 8,192 subscribers from a single OLT chassis. Note: the 8×16=128 calculation is an illustrative example based on common mid-range OLT configurations. Actual port counts are vendor- and model-specific — always verify the OLT specification sheet for the equipment being deployed.',
          },
          {
            id: 'T19-L02-Q5',
            type: 'mc',
            prompt:
              'An ISP is planning a new FTTH build and tells the OSP engineer that they plan to use XGS-PON (10 Gb/s symmetric). The OSP engineer has already designed the feeder plant using standard G.652.D OS2 fiber with 1:32 splitters in the FDH. Does the OSP plant need to be redesigned?',
            choices: [
              'Yes — XGS-PON requires a completely different fiber type (G.654.E) with lower attenuation',
              'Yes — the splitter ratio must change from 1:32 to 1:8 because XGS-PON cannot support more than 8 subscribers per port',
              'No — XGS-PON runs on the same G.652.D single-mode fiber with the same optical budget class. The OSP plant is compatible. The OLT equipment swap at the headend is sufficient.',
              'No — but all SC/UPC connectors must be replaced with SC/APC before XGS-PON can be used',
            ],
            answerIndex: 2,
            explanation:
              'XGS-PON (ITU-T G.9807.1) uses the same G.652.D OS2 single-mode fiber as GPON, with a similar optical budget and the same wavelength plan (1270 nm US, 1577 nm DS for XGS-PON US/DS bands — verify with vendor). The OSP plant upgrade from GPON to XGS-PON is a headend swap, not an outside-plant rebuild. This is one of the key long-term value propositions of the passive fiber OSP architecture — the outside plant is generation-agnostic.',
            citation: 'ITU-T G.9807.1 [confirm edition].',
          },
        ]}
      />

    </LessonLayout>
  );
}
