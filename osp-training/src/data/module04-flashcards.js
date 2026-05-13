/**
 * Module 4 — Splicing Specialist flashcards
 *
 * 8 cards covering the key numbers and concepts from Module 4.
 * Each card: { id, front, back, tags }
 *
 * Tags:
 *   'splice-loss'   — per-splice dB values and contexts
 *   'connector'     — connector loss values
 *   'splicer'       — splicer operation and verification
 *   'alignment'     — core vs. cladding alignment
 *   'ribbon'        — mass / ribbon splicing
 *   'mechanical'    — mechanical splice use cases
 *   'closures'      — dome, in-line, butt, express
 *   'arc-test'      — arc-test cadence
 *
 * Editorial note: every numeric claim in these cards is drawn from
 * the tagged sources in Module04_Splicing.jsx. See that file and
 * docs/research-logs/module04-splicing.md for full citations.
 */

export const module04Flashcards = [
  {
    id: 'm4-fc-01',
    front: 'What are the four splice-loss numbers for single-mode fusion splicing, and what is each one used for?',
    back: `• 0.15 dB — FOA planning / loss-budget input (VERIFIED-public-source: FOA loss-est.htm)
• ≤ 0.05 dB — field quality target on splicer estimate; retry up to 3× to achieve this (UNVERIFIED-deep-link-pending: r/fiberoptics consensus)
• ≤ 0.10 dB — ITU-T L.400 population average for ribbon and single-fiber acceptance (VERIFIED-via-secondary-source: Huber+Suhner, STL Tech)
• > 0.30 dB OTDR-measured — mandatory re-splice threshold in most DOT/municipal contracts (VERIFIED-public-source: NY DOT 683.07051210, UTOPIA 2024)

Exam trap: the FOA CFOS/S practical exam threshold is often cited as < 0.15 dB, but this number is UNVERIFIED against the paid FOA blueprint — the true value may be 0.10 dB or examiner discretion.`,
    tags: ['splice-loss'],
  },
  {
    id: 'm4-fc-02',
    front: 'Your fusion splicer reports 0.02 dB estimated loss. The bidirectional OTDR average for the same event is 0.18 dB. Which value goes on the acceptance document?',
    back: `0.18 dB — always use the bidirectional OTDR-averaged measurement.

The splicer's estimated loss is a model output computed from cleave images and core-offset measurements. It predicts loss based on appearance, not power. The bidirectional OTDR is a power-domain measurement that catches mismatches the camera cannot see — for example, mode-field diameter (MFD) mismatch between two fibers that look perfect under the splicer's microscope.

Rule: splicer screen = estimate. Bidirectional OTDR average = the truth. (Source: Fujikura 90S+ manual; Corning WP7114 — VERIFIED-via-secondary-source)`,
    tags: ['splice-loss', 'splicer'],
  },
  {
    id: 'm4-fc-03',
    front: 'When must a fusion splicer arc test be performed?',
    back: `Mandatory arc test occasions (per FOA Worldwide Tech Talk / Jim Hayes — VERIFIED-via-secondary-source):

1. Before each work shift — non-negotiable.
2. After electrode replacement.
3. After any change in elevation or humidity.
4. After a temperature shift greater than 10 °C.
5. After more than 100 consecutive splices.

Skipping the arc test is the single most common cause of mysterious high-loss splices. The arc calibrates to ambient air density and electrode wear; every environmental change shifts the optimal arc energy.`,
    tags: ['arc-test', 'splicer'],
  },
  {
    id: 'm4-fc-04',
    front: 'Core alignment vs. cladding alignment — which splicer type is right for which application?',
    back: `Core alignment (active): real-time dual-axis imaging of the fiber core; aligns directly on the core position. Typical loss ≈ 0.02 dB on premium SMF. Use for: backbone, DWDM, long-haul, anywhere cumulative splice margin is critical. Brands: Fujikura 90S+, Sumitomo TYPE-Q102-CA+. (VERIFIED-via-secondary-source)

Cladding alignment (V-groove): aligns on the outer 125 µm cladding; assumes the core is centered. Typical loss 0.05–0.15 dB on quality fiber. Appropriate for: FTTH drops, ISP patch-and-splice, G.657.A2 fiber where core eccentricity is tiny. Brands: Fujikura 22S, INNO View 3, hobbyist units. (VERIFIED-via-secondary-source)

Key point: cladding alignment on modern G.657.A2 FTTH fiber routinely achieves ≤ 0.05–0.08 dB. Requiring core alignment for residential drops adds cost without meaningful performance gain.`,
    tags: ['alignment'],
  },
  {
    id: 'm4-fc-05',
    front: 'What are the connector loss numbers, and what does each one mean?',
    back: `Three different numbers, three different contexts:

• 0.75 dB — TIA-568.3-D legacy maximum for any mated connector pair. This is the FAIL threshold, not a design target. (VERIFIED-via-secondary-source: Fluke Networks TIA-568.3-D summary)
• 0.50 dB — designer loss-budget rule of thumb for generic mixed plant. (VERIFIED-via-secondary-source)
• 0.30 dB — FOA planning value / typical adhesive-polish or fusion splice-on connector. (VERIFIED-public-source: FOA loss-est.htm)
• ≤ 0.20 dB — TIA-568.3-D reference-grade SM pair. (VERIFIED-via-secondary-source)
• ≤ 0.10 dB — TIA-568.3-D reference-grade MM pair. (VERIFIED-via-secondary-source)

Field reality: a clean, inspected SC/UPC pair should read < 0.20 dB. Reading > 0.30 dB means clean and re-test before accepting.`,
    tags: ['connector'],
  },
  {
    id: 'm4-fc-06',
    front: 'Dome closure vs. in-line closure — what is the structural difference and when do you use each?',
    back: `Dome (butt) closure: all cable ports on one end (the "butt"). Vertical cylinder. All cables enter from below; all fibers must be spliced through — no straight-through express routing is possible without an internal loop. Best for: pedestals, handholes, aerial strand where all cables terminate at one point (neighborhood distribution nodes, branch splices). Named products: Corning FOSC, PLP COYOTE, 3M 2178 family.

In-line closure: elongated housing with ports on both ends. Cable enters one end and exits the other. Supports both butt-spliced and express-fiber (loop-through) configurations. Best for: long aerial spans or underground runs where most fibers pass through and only a few branch off.

Key distinction: dome = butt-termination by geometry; in-line = express-splice capable.
(Source: FOA Splice Closures reference; Corning CRR-1379-AEN — VERIFIED-public-source)`,
    tags: ['closures'],
  },
  {
    id: 'm4-fc-07',
    front: 'Butt splice vs. express (loop) splice — what is the difference and when does it matter?',
    back: `Butt splice: the buffer tube is cut and the fiber is spliced through. All fibers in that tube are permanently committed at this closure. Future adds or changes require re-opening the closure and re-splicing.

Express (loop) splice: the buffer tube passes through the closure intact and uncut — fiber is not spliced at this location. The tube can be revisited later to add a branch without disturbing already-committed fibers. Express loops cost almost nothing extra at install time.

When it matters: on backbone cable passing a location where future branching is possible, specify express loops. On final-distribution cables where all fibers definitely terminate at this node, butt splicing is fine. Converting butt splices to express loops after the fact requires excavation, re-opening, and re-splicing — expensive.

(Source: FOA OSP Splicing & Termination — VERIFIED-via-secondary-source)`,
    tags: ['closures'],
  },
  {
    id: 'm4-fc-08',
    front: 'When is mechanical splicing appropriate, and what products are used?',
    back: `Appropriate use: emergency OSP restoration when no fusion splicer or power is available — a dig-in at 2 a.m., a severed drop, a single-fiber repair in a remote location. The plan must always be to replace mechanical splices with fusion splices at the next maintenance opportunity.

NOT appropriate for: any new permanent OSP plant, backbone installations, or situations where a fusion splicer is available.

Named products:
• 3M Fibrlok II / 2529 — < 0.2 dB typical insertion loss; SM and MM versions. (VERIFIED-via-secondary-source)
• TE Connectivity Corelink — mean < 0.1 dB per datasheet 108-2165. (VERIFIED-via-secondary-source)

TIA-568 generic maximum for a mechanical splice: 0.30 dB. (VERIFIED-via-secondary-source: Fluke Networks)

Field and FOA consensus: "mechanical splices are for restoration only; new OSP is always fusion."`,
    tags: ['mechanical'],
  },
];

export default module04Flashcards;
