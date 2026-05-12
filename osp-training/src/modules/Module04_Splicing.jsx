import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';

/**
 * Module 4 — Splicing Specialist
 *
 * Editorial posture (per docs/research-logs/module04-splicing.md §5):
 *  - Splice loss: textbook planning 0.15 dB (FOA loss-est.htm); field target
 *    ≤0.05 dB on splicer estimate; OTDR-accepted ≤0.10 dB bidirectional average;
 *    hard re-splice threshold >0.30 dB (NY DOT, UTOPIA contracts).
 *  - Splicer-screen "estimated" loss is a camera/image-derived model output,
 *    NOT a power-domain measurement. Bidirectional OTDR is the truth.
 *  - Connector loss: FOA field 0.30 dB / designer planning 0.50 dB /
 *    TIA-568.3-D legacy max 0.75 dB.
 *  - FOA CFOS/S "<0.15 dB" practical-exam line is UNVERIFIED — the exam
 *    blueprint is member-only; multiple training partners cite the number but
 *    its exact source is unclear.
 *  - TIA, IEC, and ITU-T documents are paywalled; cited via Fluke Networks,
 *    Huber+Suhner, STL Tech, and Corning whitepapers.
 *  - Every numeric claim is tagged with a <Callout kind="book"|"field"|"verify">.
 */
export default function Module04_Splicing() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={4}
        title="Splicing Specialist"
        intro="Fusion vs. mechanical splicing, core vs. cladding alignment, ribbon (mass) splicing, closure types, tray management, slack storage, and acceptance criteria. This module always shows two columns — textbook answer and what you will actually do in a bucket truck — and explains when they diverge."
      />

      {/* ─────────────────────── 4.1 Why splice loss is three numbers ─────────────────────── */}
      <Section title="4.1 Why splice loss is three different numbers">
        <p>
          Students routinely arrive at the cert exam with one number in their head
          and find out on the job that the field uses a different one. For fusion
          splicing on single-mode fiber, there are actually four numbers worth
          knowing — and they serve four different purposes.
        </p>

        <Table
          headers={['Purpose', 'Value', 'Source / tag']}
          rows={[
            ['FOA planning / loss-budget input',     '0.15 dB per SM fusion splice',   'VERIFIED-public-source (FOA loss-est.htm)'],
            ['ITU-T L.400 population average',        '≤ 0.10 dB average; ≤ 0.20 dB at 97th percentile', 'VERIFIED-via-secondary-source (Huber+Suhner, STL Tech)'],
            ['Field quality target (splicer estimate)', '≤ 0.05 dB — retry up to 3×', 'UNVERIFIED-deep-link-pending (r/fiberoptics consensus, paraphrase)'],
            ['Hard re-splice threshold (municipal contracts)', '> 0.30 dB measured by OTDR', 'VERIFIED-public-source (NY DOT 683.07051210, UTOPIA 2024)'],
          ]}
        />

        <Callout kind="book" title="FOA planning value: 0.15 dB">
          The FOA's public loss-estimation page (<code>thefoa.org/tech/loss-est.htm</code>)
          lists <strong>0.15 dB per fusion splice</strong> as the number to put into a
          loss budget. Use this when you are designing a link and need a conservative
          per-splice allowance. It is also the figure most commonly cited by FOA
          training partners as the CFOS/S practical-exam threshold — but see the
          Verify callout below.
        </Callout>

        <Callout kind="field" title="What field techs actually target: ≤ 0.05 dB">
          Most US fusion-splice contractors aim for a splicer-reported estimate of
          <strong> ≤ 0.05 dB</strong>. They will re-splice up to three times to hit
          it. The working rule is: accept 0.10 dB only if the splicer reports a
          perfect cleave-score and the bidirectional OTDR trace confirms it.
          Anything above 0.30 dB on the OTDR triggers a mandatory re-splice under
          most DOT and municipal contracts. This community consensus is drawn from
          r/fiberoptics threads (2023–2025); specific deep-links are pending
          verification.
        </Callout>

        <Callout kind="verify" title="FOA CFOS/S practical-exam threshold — UNVERIFIED">
          Multiple FOA training partners and study guides cite <strong>&lt; 0.15 dB</strong>{' '}
          per splice as the CFOS/S practical-exam pass criterion. However, the FOA
          curriculum blueprint and official exam standards are member-only documents.
          The true source — and whether the number is 0.15 dB, 0.10 dB, or examiner
          discretion — has not been independently verified against the paid FOA
          blueprint. Treat this as a planning target, not a confirmed exam rule, until
          someone with FOA membership confirms the exact wording.
        </Callout>
      </Section>

      {/* ─────────────────────── 4.2 Splicer estimate vs. OTDR measurement ─────────────────────── */}
      <Section title="4.2 Splicer estimate vs. OTDR measurement — a critical distinction">
        <p>
          One of the most common field errors — and a frequent trap on BICSI OSP
          exams — is treating the splicer's on-screen loss number as a measurement.
          It is not. Understanding the difference will save you from accepting a
          splice that will fail the link budget.
        </p>

        <p className="mt-2">
          <strong>Splicer "estimated" loss</strong> is computed by the machine's image
          processor. The splicer photographs both fiber ends before the arc, calculates
          core offset and cleave angle from the microscope image, and runs those
          numbers through a manufacturer-specific algorithm. The output is a prediction
          of splice loss, not a power measurement. A Fujikura 90S+ running Active Fusion
          Control (AFC) can report "0.01 dB" on a splice that an OTDR measures at
          0.18 dB — this is a known phenomenon when the two fiber ends have mismatched
          mode-field diameters (MFDs), even when both fibers appear visually perfect.
        </p>

        <Callout kind="book" title="Why MFD mismatch fools the splicer">
          The splicer's image sees the 125 µm cladding and infers core position from
          it. If the two fibers have the same nominal cladding diameter but different
          core sizes (different MFDs — e.g., splicing G.652.D to a bend-insensitive
          G.657.A2 with a slightly different mode-field), the mechanical alignment can
          look perfect while the optical mode fields are mismatched. The OTDR, which
          measures actual transmitted power, catches the mismatch. Source: Fujikura
          90S+ user manual (Inlec UK hosting); Corning whitepaper WP7114
          (VERIFIED-via-secondary-source).
        </Callout>

        <Callout kind="field" title="The authoritative number is always the bidirectional OTDR average">
          In OSP acceptance testing, the only number that counts is the
          <strong> bidirectional OTDR-averaged loss</strong> — measure from end A, then
          from end B, and average the two event readings for each splice. The
          bidirectional average cancels out the ghost gain/loss artifacts that arise
          when fiber A and fiber B have slightly different backscatter coefficients.
          A splicer estimate of 0.02 dB paired with a bidirectional OTDR average of
          0.18 dB means the splice is 0.18 dB. Full stop.
        </Callout>

        <Callout kind="book" title="Arc-test cadence (per FOA Worldwide Tech Talk)">
          A fusion splicer must run an arc test before each shift. Repeat the arc test
          after any of the following: electrode replacement, more than 100 consecutive
          splices, any change in elevation or humidity, or any temperature shift
          greater than <strong>10 °C</strong>. Skipping the arc test is the single
          most common cause of mysteriously high splice loss in the field. Source: FOA
          Worldwide Tech Talk archives / Jim Hayes (VERIFIED-via-secondary-source).
        </Callout>
      </Section>

      {/* ─────────────────────── 4.3 Core alignment vs. cladding alignment ─────────────────────── */}
      <Section title="4.3 Core alignment vs. cladding alignment">
        <p>
          All fusion splicers belong to one of two alignment families. The family
          determines how accurately the splicer positions the two fiber ends before
          the arc fires — and therefore what loss you can realistically expect.
        </p>

        <Table
          headers={['Alignment type', 'How it works', 'Typical SMF loss', 'Common brands / models', 'Tag']}
          rows={[
            [
              'Core alignment (active)',
              'Real-time dual-axis imaging of the fiber core profile; machine moves to minimize core offset directly',
              '≈ 0.02 dB on premium SMF',
              'Fujikura 90S+, 86S; Sumitomo TYPE-Q102-CA+; AFL high-end',
              'VERIFIED-via-secondary-source',
            ],
            [
              'Cladding alignment (V-groove)',
              'Aligns on the outer 125 µm cladding surface; assumes core is centered in the cladding',
              '≈ 0.05–0.15 dB on quality fiber',
              'Fujikura 22S; INNO View 3; Signal Fire; Tumtec; most hobbyist-grade units',
              'VERIFIED-via-secondary-source',
            ],
          ]}
        />

        <Callout kind="book" title="Textbook says: core alignment is always better">
          The standard curriculum statement is that core alignment produces lower loss
          because it directly minimizes core offset rather than relying on the
          assumption that the core sits perfectly centered in the cladding. This is
          correct for fibers with significant core eccentricity.
        </Callout>

        <Callout kind="field" title="Field reality: cladding align is fine for most FTTH work">
          Modern G.652.D and G.657.A2 fibers are manufactured to ITU-T specifications
          that hold core eccentricity to fractions of a micron. On these fibers, a
          well-maintained cladding-alignment splicer in good working condition will
          routinely hit <strong>≤ 0.05–0.08 dB</strong> per splice — perfectly
          acceptable for FTTH drops, ISP patch-and-splice work, and restoration.
          Core alignment earns its higher cost on backbone, DWDM, and submarine links
          where every 0.02 dB of margin matters over hundreds of splices.
          Using a cladding-align unit on a DWDM backbone is the engineering mistake;
          insisting on core-align for every residential drop is an unnecessary cost.
        </Callout>

        <Callout kind="verify" title="Cleave angle tolerances — splicer manufacturer specs">
          Most premium splicer manufacturers (Fujikura, Sumitomo, INNO) target a
          cleave angle of <strong>≤ 0.5°</strong> for single-mode work and will
          automatically reject a cleave above approximately <strong>1.0°</strong> in
          Auto mode. These thresholds come from the Fujikura 90S+ manual and secondary
          cleaver guides (VERIFIED-via-secondary-source). If your splicer starts
          rejecting more than roughly 10% of cleaves, rotate or replace the cleaver
          blade — blade wear is the primary suspect before arc parameters.
        </Callout>
      </Section>

      {/* ─────────────────────── 4.4 Ribbon (mass) splicing ─────────────────────── */}
      <Section title="4.4 Ribbon and rollable-ribbon (mass) splicing">
        <p>
          When a cable contains 12f, 24f, 96f, or 288f ribbon fiber, making splices
          one fiber at a time would be economically absurd. Mass fusion splicers fire
          all 4, 8, or 12 fibers in a ribbon simultaneously in a single arc cycle.
          Newer rollable-ribbon units (Fujikura 90R, Sumitomo Q102M-V) handle 16f
          rollable ribbon in a single pass.
        </p>

        <Callout kind="book" title="Mass splicers use cladding alignment — by necessity">
          A ribbon splicer cannot independently steer 12 fiber cores. Every production
          ribbon splicer uses cladding (V-groove) alignment across the full ribbon
          width. This is an engineering constraint, not a cost decision.
          Source: Corning AEN 171; Huber+Suhner mass-splice whitepaper
          (VERIFIED-via-secondary-source).
        </Callout>

        <Callout kind="book" title="ITU-T L.400 mass-splice acceptance criteria">
          ITU-T L.400 family (cited via Huber+Suhner and STL Tech whitepapers):
          ribbon splice acceptance = <strong>average ≤ 0.10 dB</strong> per splice
          across the ribbon, with <strong>≤ 0.20 dB at the 97th percentile</strong>.
          These numbers are VERIFIED-via-secondary-source; the exact ITU-T subclause
          (L.163 / L.400 series) requires a paid document to confirm the precise
          wording — the module uses the secondary-source paraphrase.
        </Callout>

        <Callout kind="field" title="Real-world mass-splice results and the re-splice workflow">
          In the field (per STL Tech and Belden whitepapers), a well-executed 12f
          mass splice typically delivers <strong>0.04–0.08 dB average</strong>, with
          one or two fibers per ribbon hitting <strong>0.10–0.15 dB</strong>.
          The standard crew workflow is: run the whole ribbon first, then pull out
          any individual fiber that the splicer or OTDR flags above threshold, protect
          that slice of ribbon with a heat-shrink sleeve, and re-run the outlier as a
          single-fiber splice. This avoids re-splicing an entire ribbon because two
          fibers were marginal.
        </Callout>

        <p>
          Productivity note: a two-person splice crew with a ribbon splicer can
          complete a 288f cable cross-connect in hours that would take days with
          individual-fiber splicing. Mass splicing is the economic engine behind
          high-count OSP builds.
        </p>
      </Section>

      {/* ─────────────────────── 4.5 Mechanical splicing ─────────────────────── */}
      <Section title="4.5 Mechanical splicing — restoration and emergency use">
        <p>
          A mechanical splice holds two cleaved fiber ends together with a gel-filled
          or index-matching-fluid housing that brings the refractive index of the
          air gap up to approximately that of the glass. No arc is required. The
          splice can be made with a simple cleaver and no power source.
        </p>

        <Table
          headers={['Product', 'Typical insertion loss', 'Notes', 'Tag']}
          rows={[
            ['3M Fibrlok II / 2529', '< 0.2 dB typical', 'SM and MM versions; angle version for higher return loss', 'VERIFIED-via-secondary-source'],
            ['TE Connectivity Corelink', 'mean < 0.1 dB', 'Per TE datasheet 108-2165', 'VERIFIED-via-secondary-source'],
            ['TIA-568 generic maximum', '0.30 dB per mechanical splice', 'Via Fluke Networks summary of TIA-568.3-D', 'VERIFIED-via-secondary-source'],
          ]}
        />

        <Callout kind="field" title="Mechanical splices: restoration and emergency only">
          The field consensus — and the FOA's editorial position — is that mechanical
          splices are for emergency restoration and temporary fixes: a dig-in repair
          at 2 a.m. where you have no power and no splicer available, a single-drop
          extension that will be replaced at next maintenance. No responsible OSP
          designer specs mechanical splices for new permanent plant. The r/fiberoptics
          and r/cabling community is consistent on this: "if you're doing it for a
          permanent install, you're doing it wrong."
        </Callout>

        <Callout kind="book" title="When the exam asks about mechanical splices">
          Cert exams (BICSI OSP, FOA CFOS/S) expect you to know both types.
          Know that mechanical splice loss is higher and less predictable than fusion,
          that temperature cycling causes gel-fill degradation over time, and that the
          standard acceptance maximum for a mechanical splice under TIA is
          <strong> 0.30 dB</strong> (VERIFIED-via-secondary-source). A question that
          asks "which splice method do you use for permanent OSP backbone?" expects
          "fusion splicing" — full stop.
        </Callout>
      </Section>

      {/* ─────────────────────── 4.6 Splice closures and management trays ─────────────────────── */}
      <Section title="4.6 Splice closures, management trays, and slack storage">
        <p>
          The splice closure protects the spliced fibers from the environment — water,
          mechanical stress, temperature cycling, rodents. The internal tray system
          organizes the spliced fibers with enough slack to allow future maintenance
          without re-splicing. Choosing the wrong closure for the application is the
          second most common splicing failure (after bad technique).
        </p>

        <h3 className="font-semibold mt-4 mb-2">Closure types</h3>

        <Table
          headers={['Closure type', 'Physical description', 'Common applications', 'Named examples']}
          rows={[
            [
              'Dome (butt) closure',
              'Vertical cylinder; all cable ports on one end (the "butt"). Rounded or tapered dome top.',
              'Handhole, pedestal, aerial strand, buried direct; suits branch splices where all cables enter/exit at one elevation',
              'Corning FOSC family, PLP COYOTE, 3M 2178 family',
            ],
            [
              'In-line (horizontal) closure',
              'Elongated, ports on both ends. Cable passes through from one end to the other.',
              'Aerial express-splice spans; long underground runs where most fibers pass through and only a few branch off',
              'OCC, Splice-Net, Tyco OTDR-style in-line housings',
            ],
            [
              'Modular / wall-mount (indoor)',
              'Chassis-style; rack or wall mount. Trays slide out like drawers.',
              'Central office, data center, MTU telco room; not OSP',
              'Corning CCH, Panduit FiberRunner',
            ],
          ]}
        />

        <Callout kind="book" title="Dome vs. in-line: the textbook distinction">
          Dome closures accept cables from one end only (butt termination); all fibers
          must be spliced — you cannot route a fiber straight through without looping
          it into the tray. In-line closures allow cables to enter from both ends and
          support both butt-spliced and express-fiber configurations.
          Source: FOA Reference — Splice Closures (thefoa.org/tech/ref/install/closures.html);
          Corning FOSC brochure CRR-1379-AEN (VERIFIED-public-source).
        </Callout>

        <h3 className="font-semibold mt-4 mb-2">Butt splice vs. express splice</h3>
        <p>
          Inside any multi-fiber closure, individual fibers can be handled in one of
          two ways:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>Butt splice</strong> — the fiber's buffer tube is cut and the
            fiber is spliced through. All fibers in that tube terminate at this
            closure. Future adds/changes require re-splicing.
          </li>
          <li>
            <strong>Express splice (express loop)</strong> — the buffer tube passes
            through the closure intact; the fiber is not cut. If it ever needs to
            branch at this location, the installer can open the closure and splice
            without disturbing already-committed fibers. Express loops are the
            preferred practice on backbone cables where future branching is
            anticipated. Source: FOA OSP Splicing &amp; Termination page
            (VERIFIED-via-secondary-source).
          </li>
        </ul>

        <Callout kind="field" title="Express loops are cheap insurance">
          Adding an express loop at a buried closure costs almost nothing extra
          during the original install — a few inches of slack and one extra bend in
          the tray. Coming back later to excavate, open the closure, and add a splice
          branch on a butt-spliced fiber costs a crew-day. Express loops everywhere
          is the working OSP designer's default on backbone cable.
        </Callout>

        <h3 className="font-semibold mt-4 mb-2">Management trays and bend radius</h3>
        <p>
          Each splice tray holds a fixed number of splice protectors (heat-shrink
          sleeves) and routes the fiber leads in controlled loops. The tray's
          specified minimum loop diameter is the most important mechanical parameter:
          violating it creates microbend loss that the OTDR may not catch for weeks
          or months, after thermal cycling works the fiber against the constraint.
        </p>

        <Callout kind="verify" title="Bend radius numbers — vendor literature vs. ITU-T G.652/G.657">
          Widely cited in vendor literature: <strong>30 mm minimum bend radius</strong>
          for G.652.D standard SMF; <strong>10–15 mm</strong> for G.657.A1/A2
          bend-insensitive fiber. These figures appear in Corning, OFS, and Fujikura
          datasheets and are broadly consistent. The authoritative source is ITU-T
          G.652 and G.657 (paid), not vendor literature. Additionally, cable slack
          requirements for handholes and pull boxes are frequently cited at
          <strong> 1–3 m per cable side</strong> — but the exact value depends on
          cable outer diameter and the specific TIA-758 / Telcordia GR-771 clause
          (both paywalled). Confirm from the applicable spec before designing.
          (VERIFIED-via-secondary-source on the fiber radii; UNVERIFIED-needs-paid-doc
          on the slack-storage number.)
        </Callout>
      </Section>

      {/* ─────────────────────── 4.7 Connector loss — the three numbers ─────────────────────── */}
      <Section title="4.7 Connector loss — the number depends on who is asking">
        <p>
          Just as splice loss has multiple accepted values depending on context,
          connector loss is cited at three materially different figures in three
          different authoritative contexts. Getting this wrong on a loss budget —
          or on a cert exam — has real consequences.
        </p>

        <Table
          headers={['Context', 'Value', 'Source', 'Tag']}
          rows={[
            ['TIA-568.3-D legacy maximum (mated pair, any connector)', '0.75 dB', 'Fluke Networks summary of TIA-568.3-D', 'VERIFIED-via-secondary-source'],
            ['TIA-568.3-D ref-to-standard pair, single-mode', '≤ 0.50 dB', 'Fluke Networks, TIA-568.3-D summary', 'VERIFIED-via-secondary-source'],
            ['TIA-568.3-D ref-to-standard pair, multimode', '≤ 0.30 dB', 'Fluke Networks, TIA-568.3-D summary', 'VERIFIED-via-secondary-source'],
            ['TIA-568.3-D reference-grade pair, single-mode', '≤ 0.20 dB', 'Fluke Networks, TIA-568.3-D summary', 'VERIFIED-via-secondary-source'],
            ['TIA-568.3-D reference-grade pair, multimode', '≤ 0.10 dB', 'Fluke Networks, TIA-568.3-D summary', 'VERIFIED-via-secondary-source'],
            ['FOA planning / typical installed value', '0.30 dB per connector pair', 'FOA loss-est.htm', 'VERIFIED-public-source'],
            ['Designer loss-budget rule of thumb (generic mixed plant)', '0.50 dB per connector pair', 'Common planning practice, secondary sources', 'VERIFIED-via-secondary-source'],
          ]}
        />

        <Callout kind="book" title="The 0.75 dB number: maximum, not target">
          TIA-568.3-D's legacy 0.75 dB maximum is the absolute worst-case ceiling for
          a mated connector pair. The standard does not suggest that you should budget
          0.75 dB per connector and call it a day. It says "if you measure worse than
          0.75 dB, the connector fails." This number is routinely miscited in the field
          as a planning value — treat it as a fail threshold, not a design target.
          Source: Fluke Networks TIA-568.3-D summary (VERIFIED-via-secondary-source).
        </Callout>

        <Callout kind="field" title="Clean connector, clean reading — the field correction cycle">
          A freshly cleaned, freshly inspected SC/UPC or LC/UPC connector pair
          should read under <strong>0.20 dB</strong>. If it reads above 0.30 dB,
          the field tech cleans both end-faces (IEC 61300-3-35 compliant wipe, or
          ferrule cleaning pen), inspects both faces under a fiber microscope, and
          re-mates before accepting the result. Nobody accepts 0.50–0.75 dB on a
          clean installed connector in production; that number means something is
          wrong with the polish or the face.
        </Callout>

        <Callout kind="verify" title="TIA-568.3-D revision status">
          The values cited here are from public Fluke Networks summaries of
          TIA-568.3-D. A subsequent revision (-E) is referenced in some industry
          materials. The exact normative vs. informative status of the 0.75 dB
          figure in the current revision has not been confirmed against the paid
          TIA document. Confirm before writing a spec that cites TIA-568.3-D
          connector loss by subclause number.
        </Callout>
      </Section>

      {/* ─────────────────────── 4.8 Scenario-Based Exam ─────────────────────── */}
      <Section title="4.8 Scenario-Based Exam">
        <InteractiveQuiz title="Module 4 — Splicing Specialist" questions={M4_QUESTIONS} />
      </Section>

      <RefList items={[
        { tag: 'book',   text: 'FOA Reference: Fusion Splicing',                         url: 'https://www.thefoa.org/tech/ref/termination/fusion.html' },
        { tag: 'book',   text: 'FOA Reference: OSP Splicing & Termination',              url: 'https://www.thefoa.org/tech/ref/OSP/term.html' },
        { tag: 'book',   text: 'FOA Reference: Splice Closures',                         url: 'https://www.thefoa.org/tech/ref/install/closures.html' },
        { tag: 'book',   text: 'FOA — Guidelines on what loss to expect (loss-est.htm)', url: 'https://www.thefoa.org/tech/loss-est.htm' },
        { tag: 'book',   text: 'NECA/FOA 301-2016 — Standard for Installing and Testing Fiber Optic Cables (free PDF)', url: 'https://www.thefoa.org/tech/ref/1pstandards/NECA301-16_P.pdf' },
        { tag: 'book',   text: 'Corning WP7114 — Setting Splice Specifications for Single-Mode Fiber', url: 'https://www.corning.com/media/worldwide/coc/documents/Fiber/white-paper/WP7114.pdf' },
        { tag: 'book',   text: 'Corning AEN 171 — Mass Fusion Splicing of 200-Micron Fibers',          url: 'https://www.corning.com/catalog/coc/documents/application-engineering-notes/AEN171.pdf' },
        { tag: 'book',   text: 'Corning CRR-1379-AEN — Fiber Dome Closure Family brochure',            url: 'https://www.corning.com/catalog/coc/documents/brochures/CRR-1379-AEN.pdf' },
        { tag: 'book',   text: 'Huber+Suhner — Ultra-Low Splice Loss: Mass Fusion Splicing',           url: 'https://www.hubersuhner.com/en/newsroom/blog-and-literature/blog/ultralow-splice-loss-mass-fusion-splicing' },
        { tag: 'book',   text: 'STL Tech — Mass Fusion Splicing of Optical Fiber Ribbon Cables',       url: 'https://stl.tech/wp-content/uploads/2025/03/Mass-Fusion-Splicing-of-Optical-Fiber-Ribbon-Cable.pdf' },
        { tag: 'book',   text: 'Fluke Networks — TIA-568 cable testing 101 (0.75 dB summary)',         url: 'https://www.flukenetworks.com/blog/cabling-chronicles/cable-testing-101-standard-says-075-db' },
        { tag: 'book',   text: 'Fluke Networks — TIA-568.3-D reference-grade loss values',             url: 'https://www.flukenetworks.com/knowledge-base/certifiber-pro/new-loss-budget-values-reference-grade-connectors-ansitia-5683-d' },
        { tag: 'book',   text: 'NY DOT spec 683.07051210 — 12-fiber arterial drop cable splice (re-splice >0.3 dB)', url: 'https://www.dot.ny.gov/spec-repository-us/683.07051210.pdf' },
        { tag: 'verify', text: 'UTOPIA Fiber 2024 Splicing Standards — Attachment 3 (re-splice >0.30 dB) — URL not publicly available at time of authoring; confirm from UTOPIA Fiber directly.' },
        { tag: 'forum',  text: 'r/fiberoptics — recurring threads on field splice loss targets (paraphrase; deep-links pending UNVERIFIED)' },
        { tag: 'forum',  text: 'EEVblog forum — Fiber Optic Equipment thread (cladding-align hobbyist units in OSP context)', url: 'https://www.eevblog.com/forum/reviews/fiber-optic-equipment-cleaver-splicer-and-more/' },
        { tag: 'verify', text: 'FOA CFOS/S practical-exam pass threshold (<0.15 dB) — cited by training partners; not confirmed against paid FOA blueprint.' },
        { tag: 'verify', text: 'ITU-T L.163 / L.400 exact subclause for ≤0.10 dB average / ≤0.20 dB 97th-percentile ribbon splice — paywalled; used via Huber+Suhner and STL Tech secondary sources.' },
        { tag: 'verify', text: 'TIA-568.3-D revision status (-D vs. -E) and exact normative wording for the 0.75 dB connector-pair ceiling — confirm against current paid TIA document.' },
        { tag: 'verify', text: 'Bend radius authoritative values (30 mm G.652.D / 10–15 mm G.657) — confirm from ITU-T G.652 and G.657 (paywalled).' },
        { tag: 'verify', text: 'Slack-storage quantity per cable side (1–3 m) — confirm from TIA-758 / Telcordia GR-771 (both paywalled).' },
      ]}/>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Module 4 Quiz Questions
   Mix: 4 mc + 1 dragdrop (closure types ↔ applications) + 1 dragdrop (splice methods ↔ acceptance criteria)
   ═══════════════════════════════════════════════════════════════ */

const M4_QUESTIONS = [
  /* ── Q1 mc — splicer estimate vs. OTDR ─────────────────────── */
  {
    id: 'm4-q1',
    type: 'mc',
    prompt: 'After a fusion splice, your splicer reports an estimated loss of 0.02 dB. The bidirectional OTDR average for the same splice event is 0.18 dB. Which value do you record on the acceptance document, and why?',
    choices: [
      "0.02 dB — the splicer's real-time image processing is more accurate than the OTDR.",
      '0.10 dB — average the two values for the most defensible number.',
      "0.18 dB — the bidirectional OTDR measures actual transmitted power; the splicer's number is a model output from cleave images, not a power measurement.",
      '0.02 dB — the OTDR value is unreliable because of ghosting artifacts in bidirectional mode.',
    ],
    answerIndex: 2,
    explanation: 'The splicer\'s estimated loss is derived from a camera image of core offset and cleave angle — it is a prediction, not a measurement. The bidirectional OTDR average is the power-domain measurement that governs acceptance. A 0.02 dB estimate paired with a 0.18 dB OTDR reading is a known phenomenon when the two fiber ends have mismatched mode-field diameters; the OTDR wins.',
    citation: 'Fujikura 90S+ user manual (VERIFIED-via-secondary-source); Corning WP7114 (VERIFIED-public-source). Editorial default per module04-splicing.md §5.9.',
    fieldNote: '"Trust the OTDR, not the splicer screen" is the first thing a field mentor tells a new splicer trainee. The machine can lie; the OTDR doesn\'t.',
  },

  /* ── Q2 mc — FOA planning vs. hard reject threshold ────────── */
  {
    id: 'm4-q2',
    type: 'mc',
    prompt: 'You are writing a loss budget for a 24-fiber OSP backbone. Which per-splice value should you use as your planning allowance for each SM fusion splice?',
    choices: [
      '0.05 dB — the field target on the splicer estimate.',
      '0.10 dB — the ITU-T L.400 population average.',
      '0.15 dB — the FOA planning value for a loss-budget input.',
      '0.30 dB — the municipal-contract re-splice threshold.',
    ],
    answerIndex: 2,
    explanation: '0.15 dB is the FOA\'s stated planning value for a single-mode fusion splice when building a loss budget (thefoa.org/tech/loss-est.htm). The 0.05 dB figure is the field quality target (what a tech aims for, not a budget input). The 0.10 dB figure is the ITU-T acceptance average. The 0.30 dB figure is the threshold above which many contracts mandate a re-splice — not a planning value.',
    citation: 'FOA loss-est.htm (VERIFIED-public-source). The four-number framework is the editorial core of Module 4 §4.1.',
    fieldNote: 'If you budget 0.05 dB per splice and the contractor delivers 0.12 dB, you have a budget problem that isn\'t actually a performance problem. Use 0.15 dB in the design, be pleased when the crew beats it.',
  },

  /* ── Q3 mc — core vs. cladding alignment ───────────────────── */
  {
    id: 'm4-q3',
    type: 'mc',
    prompt: 'A contractor proposes a cladding-alignment splicer for a new FTTH drop-cable installation on G.657.A2 bend-insensitive fiber. Your project manager says "we need core alignment everywhere." Which response is most technically correct?',
    choices: [
      'The PM is right — core alignment is always required for any single-mode work.',
      'Core alignment is required only if the fiber is G.652.D; G.657.A2 needs cladding alignment.',
      'A well-maintained cladding-alignment splicer is appropriate for G.657.A2 FTTH drops; the core eccentricity in modern G.657.A2 fiber is small enough that cladding alignment typically achieves ≤ 0.05–0.08 dB. Core alignment is recommended for backbone, DWDM, and long-haul links where cumulative margin is critical.',
      'Mechanical splicing is preferred for G.657.A2 fiber because it is bend-insensitive.',
    ],
    answerIndex: 2,
    explanation: 'Modern G.657.A2 fiber is manufactured to tight core-eccentricity tolerances. On this fiber, a cladding-alignment splicer in good condition routinely achieves ≤ 0.05–0.08 dB — well within the FOA 0.15 dB planning budget. Requiring core alignment for every residential drop adds cost without meaningful performance benefit. Core alignment earns its premium on backbone, DWDM, and long-haul links where every 0.02 dB across hundreds of splices adds up.',
    citation: 'Module04-splicing.md §3.4 and §5.4 editorial defaults (VERIFIED-via-secondary-source: Fujikura manuals, field practice).',
    fieldNote: '"Core align everywhere" is a safe policy but an expensive one. The right answer is match the splicer to the application.',
  },

  /* ── Q4 mc — mechanical splice use case ────────────────────── */
  {
    id: 'm4-q4',
    type: 'mc',
    prompt: 'At 2 a.m. a backhoe severs a 12-fiber OSP cable serving a commercial building. You have no power at the jobsite and no fusion splicer available. Which splice method is appropriate, and what is its long-term disposition?',
    choices: [
      'Mechanical splicing (3M Fibrlok or TE Corelink) — appropriate for emergency restoration; replace with fusion splices at next maintenance visit.',
      'Mechanical splicing — preferred over fusion for underground work because gel-fill improves long-term moisture resistance.',
      'Wait for a fusion splicer; mechanical splices are not permitted under any circumstances on commercial OSP.',
      'Install a new connector pair at the break; fusion splicing is only for factory conditions.',
    ],
    answerIndex: 0,
    explanation: 'Mechanical splicing is the OSP emergency restoration method when a fusion splicer is unavailable. Products like the 3M Fibrlok II (< 0.2 dB typical) or TE Corelink (mean < 0.1 dB) can be installed with only a good cleaver. The key point: mechanical splices are temporary / restoration only; the long-term plan is to replace them with fusion splices. New permanent OSP plant is never designed with mechanical splices.',
    citation: 'FOA editorial position (thefoa.org/tech/ref/OSP/term.html); 3M Fibrlok and TE Corelink datasheets (VERIFIED-via-secondary-source); r/fiberoptics field consensus (UNVERIFIED-deep-link-pending).',
    fieldNote: '"Fibrlok in the truck, fusion in the plan" is a reasonable summary of the field consensus on mechanical splices.',
  },

  /* ── Q5 dragdrop — closure types ↔ applications ─────────────── */
  {
    id: 'm4-q5',
    type: 'dragdrop',
    prompt: 'Match each closure type or splice configuration to the application where it is most commonly the right choice.',
    items: [
      { id: 'dome',    label: 'Dome (butt) closure' },
      { id: 'inline',  label: 'In-line closure' },
      { id: 'express', label: 'Express (loop) splice' },
      { id: 'butt',    label: 'Butt splice' },
      { id: 'mech',    label: 'Mechanical splice' },
    ],
    targets: [
      { id: 't-aerial',     label: 'Aerial span: most fibers pass through; a few branch off to a cell site' },
      { id: 't-pedestal',   label: 'Underground pedestal: six cables all terminate at a neighborhood distribution node' },
      { id: 't-backbone',   label: 'Backbone cable passing a location where future branching may be needed someday' },
      { id: 't-allterm',    label: 'All fibers in this buffer tube terminate permanently at this splice location' },
      { id: 't-emergency',  label: '2 a.m. emergency restoration of a severed aerial drop — no power available' },
    ],
    correctMap: {
      't-aerial':    'inline',
      't-pedestal':  'dome',
      't-backbone':  'express',
      't-allterm':   'butt',
      't-emergency': 'mech',
    },
    explanation: 'In-line closures suit aerial express configurations where cable passes through and only a few fibers branch. Dome closures work best where all cables enter from one end (butt termination, pedestal or handhole). Express loops preserve uncut buffer tubes at a closure for future branching — cheap insurance on backbone. Butt splices terminate all fibers in a tube permanently. Mechanical splices are the emergency restoration tool when no fusion splicer is available.',
    citation: 'FOA Splice Closures reference (thefoa.org/tech/ref/install/closures.html); Corning FOSC brochure; FOA OSP Splicing page (VERIFIED-public-source / VERIFIED-via-secondary-source).',
    fieldNote: 'Express loops vs. butt splices is a design decision made on paper before the first shovel hits the ground. Trying to convert butt splices to express loops in the field is expensive.',
  },

  /* ── Q6 dragdrop — splice methods ↔ acceptance criteria ─────── */
  {
    id: 'm4-q6',
    type: 'dragdrop',
    prompt: 'Match each splice-related value or criterion to the context in which it is the authoritative number.',
    items: [
      { id: 'v015',  label: '0.15 dB' },
      { id: 'v005',  label: '≤ 0.05 dB' },
      { id: 'v030',  label: '> 0.30 dB' },
      { id: 'v010',  label: '≤ 0.10 dB average' },
      { id: 'v075',  label: '0.75 dB' },
    ],
    targets: [
      { id: 'ctx-budget',   label: 'FOA planning loss-budget input per SM fusion splice' },
      { id: 'ctx-target',   label: 'Field quality target on splicer estimate before OTDR acceptance' },
      { id: 'ctx-reject',   label: 'Municipal contract (NY DOT, UTOPIA) mandatory re-splice threshold' },
      { id: 'ctx-ribbon',   label: 'ITU-T L.400 ribbon mass-splice population average acceptance' },
      { id: 'ctx-connmax',  label: 'TIA-568.3-D legacy maximum for a mated connector pair' },
    ],
    correctMap: {
      'ctx-budget':  'v015',
      'ctx-target':  'v005',
      'ctx-reject':  'v030',
      'ctx-ribbon':  'v010',
      'ctx-connmax': 'v075',
    },
    explanation: '0.15 dB = FOA planning number for loss budgets. ≤ 0.05 dB = the field quality target a crew aims for on the splicer screen. > 0.30 dB OTDR-measured = the hard re-splice trigger in most DOT and municipal contracts. ≤ 0.10 dB average = ITU-T L.400 ribbon acceptance standard. 0.75 dB = TIA-568.3-D legacy maximum for a mated connector pair (a fail threshold, not a design target).',
    citation: 'FOA loss-est.htm; NY DOT 683.07051210; UTOPIA 2024; Huber+Suhner/STL Tech on ITU-T L.400; Fluke Networks on TIA-568.3-D (all sourced and tagged in Module 4 body text).',
    fieldNote: 'Five numbers, five contexts — this is the most common exam trap in the splicing domain. The same student who can execute a perfect splice sometimes writes the wrong number on the test.',
  },
];
