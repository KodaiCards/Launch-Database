/**
 * Cross-module flashcard bank. Tagged by module so per-module decks can be
 * filtered out as more modules ship. Field-vs-textbook distinctions are
 * intentionally encoded so that flipping the card teaches both numbers.
 *
 * Sources are documented in docs/research-logs/. Anything not yet
 * source-checked at writing time is omitted, not invented.
 */

export const ALL_FLASHCARDS = [
  // ---- Module 1 ----
  {
    id: 'm1-att-1310',
    front: 'ITU-T G.652.D maximum attenuation at 1310 nm?',
    back: '≤ 0.40 dB/km (spec ceiling). Datasheet typical ≈ 0.32–0.35 dB/km. Designer planning ≈ 0.35 dB/km.',
    tags: ['M1', 'attenuation'],
  },
  {
    id: 'm1-att-1550',
    front: 'ITU-T G.652.D maximum attenuation at 1550 nm?',
    back: '≤ 0.30 dB/km (spec ceiling). Datasheet typical ≈ 0.18–0.22 dB/km. Designer planning ≈ 0.22–0.25 dB/km.',
    tags: ['M1', 'attenuation'],
  },
  {
    id: 'm1-cd-1550',
    front: 'Approximate chromatic dispersion of G.652 at 1550 nm?',
    back: '≈ 17 ps/(nm·km). Zero-dispersion wavelength is 1300–1324 nm, which is why long 1550 nm runs need dispersion compensation.',
    tags: ['M1', 'dispersion'],
  },
  {
    id: 'm1-conn-loss',
    front: 'Per-connector loss: book vs. field number?',
    back: 'Field (FOA): 0.30 dB. Textbook / designer planning: 0.50 dB. TIA-568 legacy max: 0.75 dB. Reference-grade is tighter still — confirm the connector grade specified.',
    tags: ['M1', 'connector', 'field-vs-book'],
  },
  {
    id: 'm1-otdr-pair',
    front: 'OTDR wavelengths for SMF — purpose of each?',
    back: '1310 nm: short-reach baseline. 1550 nm: lowest-loss baseline / DWDM. 1625 nm: macrobend hunting (bend loss grows with wavelength).',
    tags: ['M1', 'OTDR'],
  },
  {
    id: 'm1-fusion-splice',
    front: 'Typical fusion splice loss — book vs. field acceptance?',
    back: 'FOA planning / loss-budget input: 0.15 dB. ITU-T L.400 acceptance average: ≤ 0.10 dB. Field quality target: ≤ 0.05 dB (real fusion splicers routinely produce ≤ 0.05 dB on a good day; field acceptance often ≤ 0.10 dB bidirectional). Mandatory re-splice (DOT/municipal contracts): > 0.30 dB. Splicer-screen "estimate" is camera-derived, not measured — bidirectional OTDR is the truth.',
    tags: ['M1', 'splice', 'field-vs-book'],
  },
  {
    id: 'm1-bend-radius',
    front: 'Cable minimum bend radius — what determines it?',
    back: 'The cable manufacturer\'s installation guide. Common rules of thumb (10× OD loaded, 20× unloaded) are heuristics, not standards. Loose-tube OSP, ribbon, and indoor riser cables differ widely.',
    tags: ['M1', 'bend', 'verify'],
  },
];
