/**
 * Module 8 — Testing: OLTS & OTDR — flashcard bank
 *
 * 7 cards covering the module's key concepts. Each card encodes both the
 * textbook (exam) answer and the field practice where they diverge, per the
 * platform's editorial rules (docs/field-vs-textbook-research.md).
 *
 * Sources: FOA OTDR reference pages, NECA/FOA 301-2016, EXFO anotes 194/296/298,
 * VIAVI macrobend whitepaper, Corning AN3060, CommScope MFD blog,
 * Yamasaki Optical IOR article (2025). Numerical claims are tagged VERIFIED
 * or UNVERIFIED per docs/research-logs/module08-testing-otdr.md.
 */

export const MODULE08_FLASHCARDS = [
  {
    id: 'm8-tier1-vs-tier2',
    front: 'OLTS (tier 1) vs. OTDR (tier 2) — what does each one actually measure?',
    back: 'OLTS: end-to-end inserted power loss in dB — the only true loss measurement. '
        + 'OTDR: backscatter vs. distance — characterizes individual events but introduces '
        + '0.05–0.20 dB systematic error per event. An OTDR trace does NOT substitute for '
        + 'an OLTS measurement. Both tiers are required for full link certification. '
        + '[FOA OTDR reference; Fluke Networks "OLTS + OTDR" — VERIFIED-public-sources]',
    tags: ['M8', 'OLTS', 'OTDR', 'tier1', 'tier2'],
  },
  {
    id: 'm8-pulse-width-tradeoff',
    front: 'OTDR pulse width: what is the fundamental tradeoff?',
    back: 'Short pulse → better dead-zone resolution (finer event spacing), shorter dynamic range (less reach). '
        + 'Long pulse → more energy → longer reach, worse event resolution. '
        + 'Practical bands: 5–30 ns (FTTH/MDU), 100–500 ns (FTTx feeder ≤10 km), '
        + '1–3 µs (metro 10–40 km), 10–20 µs (long-haul >40 km). '
        + '[EXFO anotes 296/298; EXFO reference poster — VERIFIED-public-sources]',
    tags: ['M8', 'OTDR', 'pulse-width', 'dead-zone', 'range'],
  },
  {
    id: 'm8-launch-cable',
    front: 'Why is a launch cable required for OTDR testing, and what is the minimum length for long-haul work?',
    back: 'The launch cable moves the OTDR\'s entry-connector dead zone off the cable under test. '
        + 'Without it, the first real connector is inside the dead zone and its loss is unmeasurable. '
        + 'Minimum lengths: ≥150 m (premises / FTTx, pulse ≤500 ns); ≥500 m (metro); '
        + '≥1 km (long-haul ≥40 km); ~2.5 km for a 20 µs pulse. '
        + 'A 150 m box used with a 10 µs pulse on a 40 km span produces a fictional first-connector reading. '
        + '[EXFO anote 298; VIAVI FAQ — VERIFIED-public-sources]',
    tags: ['M8', 'launch-cable', 'dead-zone', 'OTDR'],
  },
  {
    id: 'm8-bidi-averaging',
    front: 'What is bidirectional OTDR averaging and why is it required at splices with MFD mismatch?',
    back: 'When two fibers of different mode-field diameter (MFD) are spliced, the OTDR reads '
        + 'artificially high loss in one direction and may show a gain ("gainer") in the other '
        + 'due to the backscatter level difference — not a real power change. '
        + 'True splice loss = (A→B reading + B→A reading) / 2. '
        + 'Example: A→B = −0.08 dB (gainer), B→A = 0.28 dB → true loss = 0.10 dB. '
        + 'Standards: TIA-455-61 and IEC 61280-4-2 (both paywalled; referenced via VIAVI 2023). '
        + '[FOA OTDR FAQs; Corning AN3060; CommScope MFD blog — VERIFIED-public-sources]',
    tags: ['M8', 'OTDR', 'bidi', 'gainer', 'MFD', 'splice'],
  },
  {
    id: 'm8-bidi-threshold',
    front: 'What is the bidirectional-averaged splice acceptance threshold?',
    back: 'UNVERIFIED — the authoritative source is paywalled. '
        + '"<0.15 dB bidirectional averaged" is commonly cited as a planning value; '
        + 'the likely authoritative sources are BICSI OSPDRM 6th, Telcordia GR-326, or '
        + 'a carrier OSP construction spec (AT&T TP-76300, Verizon TP-9, etc.). '
        + 'Common contract bands: 0.10 dB (carrier long-haul), 0.15 dB (FTTH / aerial restoration), '
        + '0.20 dB (short-distance restoration). '
        + 'TIA-568.3-D unidirectional cap: 0.3 dB (via secondary sources — TIA-568.3-D is paywalled). '
        + 'ALWAYS confirm from your project\'s construction specification. '
        + '[UNVERIFIED-needs-paid-doc; FOA loss-est page for 0.15 dB planning value — VERIFIED-public-source]',
    tags: ['M8', 'splice', 'acceptance', 'bidi', 'unverified', 'field-vs-book'],
  },
  {
    id: 'm8-macrobend-detection',
    front: 'How does dual-wavelength OTDR testing detect macrobends, and what is the rule-of-thumb threshold?',
    back: 'Bend loss scales with wavelength — longer wavelengths are more sensitive to macrobends '
        + 'because the mode field extends further into the cladding. '
        + 'Compare loss at the same physical location across two wavelengths. '
        + 'Rule of thumb: if the longer-wavelength loss exceeds the shorter by >0.2 dB at the same point, '
        + 'suspect a macrobend. [Vendor heuristic — NOT a normative TIA/IEC threshold.] '
        + 'Recommended wavelengths: 1310 + 1550 nm minimum; 1550 + 1625 nm for in-service spans. '
        + '1625 nm is the macrobend-hunting wavelength — does not disturb live 1310/1550 traffic. '
        + '[VIAVI macrobend whitepaper; EXFO; AFL — VERIFIED-public-sources as vendor heuristic]',
    tags: ['M8', 'macrobend', '1625nm', '1550nm', 'dual-wavelength', 'OTDR'],
  },
  {
    id: 'm8-ior-error',
    front: 'What happens if the OTDR\'s IOR is left at the factory default instead of the cable manufacturer\'s value?',
    back: 'Distance is calculated as d = (c × t) / (2n). An incorrect n introduces a proportional '
        + 'distance error across the full span. '
        + 'Example: default n = 1.4677, true EIOR = 1.4682. '
        + 'Error ≈ ΔN/N × distance ≈ 0.034% × 40 km ≈ ~14 m on a 40 km span. '
        + 'On short premises links, survivable. On long-haul fault location (±5 m dig window), '
        + 'can send a crew to the wrong location. '
        + 'Always enter the EIOR/EGI from the cable datasheet before each test. '
        + '[Yamasaki Optical "IOR and OTDR Testing" 2025 — VERIFIED-public-source]',
    tags: ['M8', 'IOR', 'EIOR', 'distance', 'OTDR', 'field-vs-book'],
  },
];
