import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';

/**
 * Module 11 — Fiber Project Estimation & Revenue Metrics
 *
 * Editorial posture (per docs/research-logs/module11-revenue-estimation.md §5):
 *  - Cost numbers vary wildly by region, density, and labor profile.
 *    NEVER print a bare $/ft without range + caveat.
 *  - FBA/Cartesian cost figures: the "2024 report" (published Jan 2024) covers
 *    the 2023 dataset ($6.49/ft aerial, $16.25/ft underground); the "2025 report"
 *    (published Feb 2025) covers the 2024 dataset ($6.55/ft aerial, $18.25/ft
 *    underground). Both are VERIFIED via Fierce Network and FBA.
 *    Cite both with dataset year for attribution accuracy.
 *  - Union vs. non-union differential of 30-50% on loaded labor is tagged
 *    UNVERIFIED — field-observed but no single public primary table.
 *  - Contingency defaults: 10% greenfield, 15% brownfield, 20% downtown
 *    pavement-cut, plus a separate materials-escalation clause.
 *  - CPHP vs CPHC distinction is editorial mandate: they are NOT the same.
 *  - Change orders are where projects bleed; teach drivers, not just process.
 */
export default function Module11_RevenueEstimation() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={11}
        title="Fiber Project Estimation & Revenue Metrics"
        intro="Unit costs, contract types, contingency, change orders, and the FTTH KPIs that actually matter on a financial model. This module teaches the estimating framework, not a single national average — because no such number is defensible."
      />

      {/* ── 11.1 The Cost-Data Problem ── */}
      <Section title="11.1 The cost-data problem: why a single $/ft is misleading">
        <p>
          Every year, the{' '}
          <strong>Fiber Broadband Association (FBA)</strong> and Cartesian
          publish a national fiber deployment cost report. Two recent editions
          are widely cited in the U.S. industry. Their headline numbers:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>FBA/Cartesian 2023 Annual Report</strong> (published January 2024,
            covering 2023 data): Aerial median <strong>≈ US$6.49/ft</strong>;
            underground median <strong>≈ US$16.25/ft</strong>.
          </li>
          <li>
            <strong>FBA/Cartesian 2024 Annual Report</strong> (published February 2025,
            covering 2024 data): Aerial median <strong>≈ US$6.55/ft</strong> (+1%);
            underground median <strong>≈ US$18.25/ft</strong> (+12%, driven by
            labor and material inflation).
          </li>
          <li>
            Labor share: roughly <strong>60–80%</strong> of total deployed cost.
          </li>
        </ul>

        <Callout kind="warn" title="These medians mask a 10–15× variance">
          A rural directional bore through caliche can hit{' '}
          <strong>US$40+/ft</strong>. A quiet suburban conduit-in-place pull
          can come in under <strong>US$3/ft</strong>. Locate density (one
          ticket per 100 ft urban vs. one per mile rural), pavement
          restoration, union/non-union labor, and make-ready complexity are
          the primary drivers. Always present the FBA number alongside a
          range and a list of what moves it.
        </Callout>

        <Callout kind="field" title="What field estimators actually do">
          Experienced estimators do not start from the national median. They
          start from their last three comparable jobs in the same region,
          adjust for density and union presence, and treat the FBA report as
          a sanity-check ceiling — not as an input. The first question on
          any bid is: "Are locate costs in scope or excluded?"
        </Callout>

        <Table
          headers={['Scenario', 'Typical observed range', 'Primary driver']}
          rows={[
            ['Dense urban — pavement cut', 'US$25–60/ft', 'Pavement restoration, bore permits, traffic control'],
            ['Suburban — no existing conduit', 'US$8–18/ft', 'Bore cost, locate density, make-ready'],
            ['Suburban — conduit in place', 'US$2–6/ft', 'Pull cost only; conduit already amortized'],
            ['Rural — open-cut or bore', 'US$15–40+/ft', 'Long haul, rocky terrain, mobilization'],
            ['Aerial — clean poles', 'US$4–9/ft', 'Strand, lashing, labor; FBA 2023-dataset median ≈ $6.49; 2024-dataset median ≈ $6.55'],
            ['Aerial — heavy make-ready', 'US$12–25+/ft', 'Pole replacement, transfers, re-inspection'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Ranges drawn from FBA/Cartesian 2023 and 2024 annual reports, NC Broadband Matters 2021,
          and practitioner community commentary (r/cabling, r/telecom). These
          are planning references, not bid prices — confirm from local bids
          and recent as-builts.
        </p>
      </Section>

      {/* ── 11.2 Aerial vs Underground ── */}
      <Section title="11.2 Aerial vs. underground cost ratio">
        <p>
          The textbook shorthand is "underground costs about{' '}
          <strong>twice aerial</strong>." At the FBA 2023-dataset medians
          ($16.25 ÷ $6.49) the ratio is ≈ 2.5×; at the 2024-dataset medians
          ($18.25 ÷ $6.55) the ratio is ≈ 2.8×. Both are useful reference
          points — and neither is a reliable endpoint for any specific project.
        </p>

        <Callout kind="book" title="Textbook ratio (FBA national medians)">
          Underground-to-aerial ratio at the national median:{' '}
          <strong>≈ 2.5×</strong> (FBA 2023-dataset: US$16.25/ft ÷ US$6.49/ft)
          to <strong>≈ 2.8×</strong> (FBA 2024-dataset: US$18.25/ft ÷ US$6.55/ft).
          Rounded to "about 2×" in most study guides. Source: FBA/Cartesian
          Fiber Deployment Cost Annual Reports 2023 and 2024, reported by Fierce Network.
        </Callout>

        <Callout kind="field" title="Practical range: 1.2× to 5×">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>1.2×</strong> — suburban corridor with conduit already
              in place; underground is barely more expensive than aerial lashing.
            </li>
            <li>
              <strong>2–3×</strong> — standard bore/trench with no conduit;
              matches the national median.
            </li>
            <li>
              <strong>4–5×</strong> — dense urban pavement-cut zones with
              traffic control, full restoration, and permit fees.
            </li>
            <li>
              <strong>Ratio flips</strong> — when poles need replacement,
              make-ready cost on an aerial build can exceed underground cost
              on the same route. "Aerial is half the price" is only true if
              the poles are clean.
            </li>
          </ul>
        </Callout>

        <p className="mt-2">
          When presenting aerial vs. underground options to a customer, always
          qualify: route survey performed? Make-ready estimate in hand?
          Existing conduit confirmed? The cost comparison is not meaningful
          without those answers.
        </p>
      </Section>

      {/* ── 11.3 Make-Ready ── */}
      <Section title="11.3 Make-ready: a process, not a price">
        <p>
          Make-ready is the work required to prepare poles for a new
          attachment. Textbooks define it in a sentence. Field budgets treat
          it as the primary schedule and cost risk on aerial projects. The
          difference matters because make-ready is billed separately —
          usually by the pole owner — and it appears as a surprise cost on
          projects that budgeted from per-foot aerial rates alone.
        </p>

        <p className="mt-2 font-semibold text-slate-100">Seven-step make-ready timeline (typical):</p>
        <ol className="list-decimal pl-5 space-y-1 mt-1">
          <li>New attacher submits an attachment application with a field survey.</li>
          <li>Pole owner performs an engineering audit (often 45–90 days).</li>
          <li>Pole owner issues a make-ready estimate to the applicant.</li>
          <li>Applicant accepts or contests the estimate.</li>
          <li>Existing attachers are notified and given time to perform
            their own transfers (or approve OTMR).</li>
          <li>Make-ready work is performed (transfers, reinforcements,
            replacements).</li>
          <li>New attacher's contractor performs the attachment and
            post-make-ready inspection.</li>
        </ol>

        <Callout kind="book" title="FCC One-Touch Make-Ready (OTMR) — FCC 18-111">
          For <em>simple</em> make-ready work in the communications space,
          FCC 18-111 allows a new attacher's approved contractor to complete
          all transfers in a single visit. The pole owner has{' '}
          <strong>10 days</strong> to accept or reject the OTMR application;
          existing attachers must be notified at least{' '}
          <strong>3 days</strong> before survey. Anything involving cable
          splicing, supply-space work, or risk of customer outage is
          classified <em>complex</em> and reverts to sequential make-ready.
        </Callout>

        <Callout kind="field" title="Make-ready cost ranges — use as risk flags, not bid inputs">
          <ul className="list-disc pl-5 space-y-1">
            <li>Simple transfer / rearrangement: <strong>US$40–120 per pole</strong>.</li>
            <li>Reinforcement or guying: <strong>US$200–800 per pole</strong>.</li>
            <li>Full pole replacement: <strong>US$1,500–5,000+ per pole</strong>
              (more in urban or difficult-access areas).</li>
            <li>
              Field example: US$42,000 charged across 7 poles (~US$6,000/pole)
              for a complex set requiring transfers and one full pole replacement.
            </li>
            <li>
              Trade-press loaded average: US$5–6 per linear foot (loaded into
              aerial cost) — but this collapses the variance entirely.
            </li>
          </ul>
          Sources: installer pricing pages (VERIFIED-via-secondary-source);
          the per-pole ranges are consistent across multiple contractor sites.
          The loaded $/ft figure varies by corridor — use a pole-count
          estimate, not a per-foot average, for any project with older
          infrastructure.
        </Callout>

        <Callout kind="verify" title="FCC pole-attachment regulatory framework">
          FCC pole-attachment rules (47 CFR § 1.1401–1.1424) govern pricing
          formulas and timelines for ILECs, cable companies, and
          competitive providers. Telecom rate and cable rate formulas differ.
          Confirm the applicable rate formula with the pole owner before
          budgeting attachment fees; the FCC formula is a floor, not a ceiling,
          for non-covered pole owners.
        </Callout>
      </Section>

      {/* ── 11.4 Splicing & Drop Costs ── */}
      <Section title="11.4 Splice costs, drop costs, and productivity modeling">
        <p>
          Textbooks quote a per-splice price. Field estimators price a
          crew-day and divide. The distinction matters because mobilization
          cost, vault access, traffic control, and ribbon vs. single-fiber
          technique all show up at the crew-day level — not at the
          per-splice level.
        </p>

        <p className="mt-2 font-semibold text-slate-100">Fusion splicing cost components:</p>
        <Table
          headers={['Component', 'Range', 'Notes']}
          rows={[
            ['Fusion splice — small job (≤12 splices)', 'US$50–90/splice + mobilization', 'Contractor list pricing; VERIFIED-via-secondary-source'],
            ['Fusion splice — bulk ribbon job', 'Below US$20/strand', 'Volume-rate on large ribbon jobs'],
            ['Mechanical splice consumable', 'US$5–12 each', 'vs. fusion consumable ≈ US$0.50'],
            ['Fiber-tech daily labor (loaded)', 'US$200–500/day', 'VERIFIED-via-secondary-source; wide regional variance'],
            ['Crew productivity — ribbon in a vault', '≈ 60–100 splices/crew-day', 'Field consensus from Mike Holt / practitioner forums'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Splice productivity data from PPC "FTTP Drop Installations"
          (VERIFIED-public-source) and practitioner commentary (Mike Holt
          forums, Let's Talk Cabling). Daily labor rate from multiple
          contractor sites (VERIFIED-via-secondary-source).
        </p>

        <Callout kind="field" title="Model productivity, not unit cost">
          A two-person fusion crew on 144-count ribbon in an accessible vault
          can complete ≈ 80 splices per crew-day. At a loaded crew-day rate
          of US$700–900 plus materials, the per-splice cost works out to
          roughly US$9–12 — far below small-job contractor pricing. Unit
          cost is a change-order number; crew-day cost is the bid number.
        </Callout>

        <p className="mt-3 font-semibold text-slate-100">Fiber drop costs (FTTH terminal drop to NIU):</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>
            Aerial drop installation: <strong>US$75–200 per drop</strong>
            (labor + material); lower end for pre-terminated, higher for
            fusion-spliced field termination.
          </li>
          <li>
            Underground drop (bore or plow): <strong>US$150–400+ per drop</strong>;
            driven by bore length, pavement, or frozen ground.
          </li>
          <li>
            Pre-terminated vs. fusion: pre-terminated drop connectors
            reduce splice labor at the terminal but cost more per foot of
            cable; fusion offers lower material cost but higher labor. The
            PPC comparison (VERIFIED-public-source) shows the break-even
            varies by volume and crew wage rate.
          </li>
        </ul>

        <Callout kind="verify" title="Union vs. non-union labor differential — UNVERIFIED">
          The industry frequently cites a <strong>30–50%</strong> difference
          in fully-loaded labor cost between IBEW-represented crews and
          open-shop crews. This range appears in regional FBA breakouts and
          contractor commentary but is <strong>not pinned to a single public
          primary table</strong>. BLS OEWS 49-9052 (Telecommunications Line
          Installers and Repairers) provides wage percentiles by region
          (VERIFIED-public-source at bls.gov/oes) but does not isolate
          union vs. non-union. Treat the 30–50% figure as a planning
          signal, not a verified differential — confirm with the applicable
          CBA or prevailing-wage schedule for the project jurisdiction.
        </Callout>
      </Section>

      {/* ── 11.5 Contract Types ── */}
      <Section title="11.5 Contract types: RFP, lump-sum, T&M, GMP">
        <p>
          The contract vehicle determines who carries cost risk and where
          change orders bleed. Matching contract type to scope certainty is
          a core estimating skill.
        </p>

        <p className="mt-2 font-semibold text-slate-100">
          The four structures you will encounter on OSP work:
        </p>

        <Table
          headers={['Type', 'Who carries cost risk', 'Best fit', 'Danger zone']}
          rows={[
            [
              'Lump-sum (fixed-price)',
              'Contractor',
              'Well-surveyed route, clean locates, defined scope',
              'Scope creep; contractor will protect margin with change orders',
            ],
            [
              'T&M (time & materials)',
              'Owner',
              'Unknown scope; retrofit in old infrastructure; small jobs',
              'Budget overruns with no ceiling; owner bears all risk',
            ],
            [
              'T&M with not-to-exceed (NTE)',
              'Shared',
              'Partially known scope; most common OSP compromise',
              'Contractor hits NTE and stops — unfinished work unless NTE is amended',
            ],
            [
              'GMP (guaranteed maximum price)',
              'Contractor to the max; owner below max',
              'Data-center build-out; large phased OSP programs',
              'GMP negotiation is complex; rare on pure OSP lateral builds',
            ],
          ]}
        />

        <Callout kind="book" title="RFP is a procurement vehicle, not a contract type">
          An <strong>RFP (Request for Proposals)</strong> is the document
          an owner issues to solicit competitive bids. The resulting award
          will be a lump-sum, T&M, or GMP contract — the RFP just specifies
          which type is desired. Conflating RFP with contract type is a
          common exam-prep error. Sources: Procore library (lump-sum, T&M,
          GMP definitions — VERIFIED-via-secondary-source); AIA contract
          catalogue (A101 lump-sum, A102 cost-plus, A103 GMP —
          UNVERIFIED for specific clause text, paywalled).
        </Callout>

        <Callout kind="field" title="What practitioners actually use on OSP">
          Practitioner consensus (r/telecom, BICSI Community, Let's Talk
          Cabling): lump-sum is preferred when the route is surveyed and
          locates are clean; T&M-NTE is the most common compromise when
          scope is partially unknown (e.g., older conduit system with
          uncertain pull tension or splice count); GMP is rare on lateral
          OSP but common on greenfield data-center campus builds.
        </Callout>

        <p className="mt-3 font-semibold text-slate-100">Escalation clauses</p>
        <p>
          On projects lasting more than 3–4 months, material prices can move
          materially. A well-drafted escalation clause defines:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>
            A <strong>baseline index</strong> (e.g., Producer Price Index for
            fiber-optic cable, or a named commodity price).
          </li>
          <li>
            A <strong>trigger threshold</strong> (e.g., index moves more than
            5% from baseline date).
          </li>
          <li>
            A <strong>pass-through formula</strong> (e.g., 80% of the index
            change applied to remaining material quantities).
          </li>
        </ul>
        <Callout kind="field" title="2022–2024: escalation clauses were invoked widely">
          The fiber-optic cable market saw significant price moves in
          2022–2024 driven by supply-chain disruptions and demand from BEAD
          and RDOF programs. Contractors who did not include escalation
          clauses on multi-year lump-sum contracts absorbed material cost
          increases directly. Teaching escalation is not theoretical —
          it is recent history.
        </Callout>
      </Section>

      {/* ── 11.6 Contingency ── */}
      <Section title="11.6 Contingency and change orders">
        <p>
          Textbooks often suggest adding <strong>5%</strong> contingency.
          Senior OSP estimators carry materially more — and they treat
          materials escalation as a separate line item, not part of
          construction contingency.
        </p>

        <Table
          headers={['Project type', 'Contingency floor (construction)', 'Rationale']}
          rows={[
            ['Greenfield aerial, clean poles', '10%', 'Standard permit and weather buffer'],
            ['Greenfield underground, greenfield bore', '10–12%', 'Unknown soil, rock probability'],
            ['Brownfield — overlay on old aerial infrastructure', '15%', 'Make-ready surprises, pole condition unknowns'],
            ['Brownfield — splicing inside existing infrastructure', '15%', 'Hidden conflict count, vault access complexity'],
            ['Downtown pavement-cut zone', '20%', 'Permit delays, unmarked utilities, restoration cost variability'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Defaults from Let's Talk Cabling practitioner consensus and
          field commentary. 5% is the vendor-template default, not the
          field floor. These are minimums; project-specific risk may warrant
          more.
        </p>

        <Callout kind="field" title="Contingency ≠ escalation — carry them separately">
          Construction contingency covers scope uncertainty and site
          conditions. Materials escalation covers future price moves on
          commodities (cable, conduit, hardware). Combining them into a
          single percentage makes it impossible to track whether cost growth
          is a design problem (contingency) or a market problem (escalation).
          Best practice: carry them as separate line items with separate
          triggers.
        </Callout>

        <p className="mt-3 font-semibold text-slate-100">Change orders: where projects bleed</p>
        <p>
          Change orders amend a contract for added scope, changed conditions,
          or scope deletions. On OSP, the most common drivers are:
        </p>
        <ol className="list-decimal pl-5 space-y-1 mt-1">
          <li>
            <strong>Undisclosed utility conflicts</strong> (locate misses) —
            the #1 driver. A conflict found at the boring head is a change
            order that suspends the job.
          </li>
          <li>
            <strong>Permit-driven schedule shifts</strong> — a delayed ROW
            permit changes the labor schedule, potentially pushing work into
            overtime or a different season.
          </li>
          <li>
            <strong>Pole condition surprises</strong> — poles that passed a
            desktop audit fail a close-up engineering inspection; replacement
            is added scope.
          </li>
          <li>
            <strong>Quantity changes</strong> — actual cable pull footage
            exceeds design due to conduit routing revisions or splice point
            relocations.
          </li>
        </ol>

        <Callout kind="field" title="Lump-sum change orders vs. T&M-NTE change orders">
          On a lump-sum contract, every change order is a negotiation: the
          contractor prices from scratch, the owner needs independent cost
          validation, and delay is common. On a T&M-NTE contract, change
          orders are simpler (invoice actuals to a new NTE line) but require
          close owner oversight to avoid scope creep. Neither type is free —
          change-order management hours are a real project cost that
          under-resourced owners routinely forget to budget.
        </Callout>
      </Section>

      {/* ── 11.7 CPHP, CPHC, and KPIs ── */}
      <Section title="11.7 CPHP vs. CPHC and the FTTH KPI set">
        <p>
          FTTH operators live and die by a small set of metrics. The most
          frequently confused pair is{' '}
          <strong>Cost per Home Passed (CPHP)</strong> vs.{' '}
          <strong>Cost per Home Connected (CPHC)</strong>. They are
          fundamentally different numbers and must never be presented
          interchangeably.
        </p>

        <p className="mt-2 font-semibold text-slate-100">The three homes metrics — defined side by side:</p>

        <Table
          headers={['Metric', 'Definition', 'What it includes', 'Typical range (U.S., 2024)']}
          rows={[
            [
              'Homes Passed (HP)',
              'Service is technically available — fiber on the street or in the building riser; customer can order.',
              'Backbone + distribution; no drop cable installed',
              'Urban US$700–1,500/HP; rural US$3,000–6,000/HP',
            ],
            [
              'Homes Passed Plus (HP+)',
              'Drop cable placed (trenched or aerial to the NIU location) but not yet activated.',
              'HP cost + drop cable to NIU; service can be lit quickly',
              'Adds US$75–400/drop to HP cost depending on topology',
            ],
            [
              'Homes Connected (HC)',
              'Customer has active service — provisioned, tested, and billing.',
              'HP cost + drop + ONT + install labor + activation',
              'CPHC = CPHP ÷ take rate (see below)',
            ],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          HP/HP+/HC definitions per FBA, Huber+Suhner, Emtelle, and iQGEO
          FTTH glossaries (VERIFIED-via-secondary-source). HP cost ranges per
          FBA/Cartesian 2024 and dgtlinfra.com case-study data
          (VERIFIED-via-secondary-source).
        </p>

        <Callout kind="book" title="The CPHC formula">
          <strong>CPHC = CPHP ÷ Take Rate</strong>
          <br />
          If you spent US$1,200 per home passed and your take rate is 40%,
          your cost per home <em>connected</em> is US$3,000. The financial
          model lives or dies on closing that ratio — which is why raising
          take rate from 35% to 50% has a larger IRR impact than reducing
          CPHP by 10%.
        </Callout>

        <Callout kind="field" title="Three metrics operators actually plan around">
          Operators track HP for CapEx milestone reporting, HP+ for
          construction-readiness (can light quickly on demand), and HC for
          revenue recognition. The structural gap between HP and HC is the
          dominant value lever in FTTH financial models (per FTI Consulting,
          "From Coverage to Cash Flow" — VERIFIED-public-source). WIK and
          FTI both report a growing HP-to-HC gap as build programs outpace
          marketing and sales capacity.
        </Callout>

        <p className="mt-3 font-semibold text-slate-100">Take rate and 90-day conversion:</p>
        <p>
          <strong>Take rate</strong> = homes connected ÷ homes passed (at a
          given point in time). Industry planning benchmarks vary widely:
          competitive overbuilds in dense urban markets may plan for 25–35%;
          rural incumbents often target 50–70% based on limited competition.
          The <strong>90-day conversion</strong> metric tracks what percentage
          of homes passed convert to connected within 90 days of service
          availability — a leading indicator of whether marketing and
          installation capacity are aligned with the build schedule.
        </p>

        <p className="mt-3 font-semibold text-slate-100">Operational productivity KPIs (field-level):</p>
        <Table
          headers={['KPI', 'Typical target range', 'Why it matters']}
          rows={[
            ['Feet of fiber placed per crew-day', '1,000–3,000 ft/day (aerial); 300–800 ft/day (bore)', 'Schedule milestone and productivity benchmark'],
            ['Poles completed per day', '4–10 poles/day for lashing; 1–3/day for make-ready-heavy', 'Controls aerial build schedule'],
            ['Splices per crew-day', '60–100 (ribbon, accessible vault)', 'Drives splicing labor budget'],
            ['Drops completed per day', '8–20 drops/day per crew', 'Revenue activation pacing'],
            ['Permit cycle time (days)', 'Target < 30 days; reality often 60–120 days', 'The most common schedule risk outside of make-ready'],
            ['Locate ticket aging (days open)', 'Target < 5 business days', 'Expired tickets halt boring; track actively'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          KPI targets from practitioner community and field commentary
          (VERIFIED-via-secondary-source). Ranges reflect differing crew
          sizes, terrain, and scope.
        </p>

        <Callout kind="field" title="EVM vs. OSP field KPIs">
          Earned Value Management (EVM) — cost variance, schedule variance,
          CPI — is the textbook project-control framework and appears on
          large federal/BEAD-funded project reports. In practice, day-to-day
          OSP field management runs off a much narrower dashboard: feet per
          day, splices per day, drops per day, permit aging, and locate
          ticket count. If your project requires federal EVM reporting,
          you need a project controls specialist; if you are running a
          commercial FTTH build, you need a production-rate tracker.
        </Callout>
      </Section>

      {/* ── 11.8 Scenario-Based Exam ── */}
      <Section title="11.8 Scenario-Based Exam">
        <InteractiveQuiz title="Module 11 — Fiber Project Estimation" questions={M11_QUESTIONS} />
      </Section>

      <RefList items={[
        {
          tag: 'book',
          text: 'FBA / Cartesian — Fiber Deployment Cost Annual Report 2023 (published January 2024; 2023 dataset: $6.49/ft aerial, $16.25/ft underground)',
          url: 'https://fiberbroadband.org/wp-content/uploads/2025/01/FBA_Cartesian_Fiber-Deployment-Cost-Annual-Report-2024.pdf',
        },
        {
          tag: 'book',
          text: 'FBA / Cartesian — Fiber Deployment Cost Annual Report 2024 (published February 2025; 2024 dataset: $6.55/ft aerial, $18.25/ft underground)',
          url: 'https://fiberbroadband.org/wp-content/uploads/2026/01/FBA_Cartesian_Fiber-Deployment-Cost-Annual-Report_2025.pdf',
        },
        {
          tag: 'book',
          text: 'Fierce Network — Underground fiber drives deployment costs (2024/2025 update)',
          url: 'https://www.fierce-network.com/broadband/underground-fiber-drives-deployment-costs',
        },
        {
          tag: 'book',
          text: 'FBA — The Costs for Deploying Fiber (2024 brief)',
          url: 'https://fiberbroadband.org/2024/03/12/the-costs-for-deploying-fiber/',
        },
        {
          tag: 'book',
          text: 'NC Broadband Matters — The Real Cost of Fiber (2021; line-item make-ready breakdown)',
          url: 'https://ncheartsgigabit.com/wp-content/uploads/2021/02/The-real-cost-of-fiber-NCBM-true-final.pdf',
        },
        {
          tag: 'book',
          text: 'PPC — FTTP Drop Installations: Fusion Splicing vs. Pre-Terminated Costs',
          url: 'https://www.ppc-online.com/blog/fttp-drop-installations-fusion-splicing-versus-pre-terminated-costs',
        },
        {
          tag: 'book',
          text: 'PPC — Installing Aerial Fiber: What Are the Options?',
          url: 'https://www.ppc-online.com/blog/installing-aerial-fiber-what-are-the-options',
        },
        {
          tag: 'book',
          text: 'FTI Consulting — From Coverage to Cash Flow',
          url: 'https://www.fticonsulting.com/insights/articles/from-coverage-cash-flow',
        },
        {
          tag: 'book',
          text: 'FCC — One-Touch Make-Ready order (FCC 18-111)',
          url: 'https://docs.fcc.gov/public/attachments/doc-352544a1.pdf',
        },
        {
          tag: 'book',
          text: 'FCC — Pole-attachment regulations, 47 CFR § 1.1401–1.1424',
          url: 'https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-1/subpart-J',
        },
        {
          tag: 'book',
          text: 'BLS OEWS 49-9052 — Telecom Line Installers and Repairers wage data',
          url: 'https://www.bls.gov/oes/current/oes499052.htm',
        },
        {
          tag: 'book',
          text: 'Procore library — Lump-sum contracts',
          url: 'https://www.procore.com/library/lump-sum-contracts',
        },
        {
          tag: 'book',
          text: 'Procore library — Escalation clause',
          url: 'https://www.procore.com/library/escalation-clause',
        },
        {
          tag: 'book',
          text: 'Huber+Suhner — Homes Passed Plus and Connected (FTTH terminology)',
          url: 'https://www.hubersuhner.com/en/newsroom/blog-and-literature/blog/ftth-homes-passed-plus-and-connected',
        },
        {
          tag: 'book',
          text: 'iQGEO — Demystifying FTTH Terminology',
          url: 'https://www.iqgeo.com/blog/demystifying-ftth-terminology',
        },
        {
          tag: 'book',
          text: 'Narrowstack — Take Rate KPI definition',
          url: 'https://www.narrowstack.com/outcomes/take-rate',
        },
        {
          tag: 'book',
          text: 'dgtlinfra.com — Fiber optic network construction process & costs (Shentel case study)',
          url: 'https://dgtlinfra.com/fiber-optic-network-construction-process-costs/',
        },
        {
          tag: 'forum',
          text: 'Let\'s Talk Cabling (Chuck Bowser, RCDD) — estimating episodes; 10–15% contingency floor for OSP',
          url: 'https://letstalkcabling.com/',
        },
        {
          tag: 'forum',
          text: 'Mike Holt forums — fusion splicing cost-out; crew-day productivity modeling',
          url: 'https://forums.mikeholt.com/',
        },
        {
          tag: 'forum',
          text: 'r/cabling, r/telecom — practitioner commentary on $/ft variance and contract types',
          url: 'https://www.reddit.com/r/cabling/',
        },
        {
          tag: 'verify',
          text: 'Union vs. non-union labor differential (30–50% on loaded labor) — field-observed and cited in regional FBA breakouts but NOT pinned to a single public primary table. Confirm against project-specific CBA or prevailing-wage schedule.',
        },
        {
          tag: 'verify',
          text: 'AIA contract templates (A101, A102, A103) — catalogue is public; clause text is paywalled. Definitions used here are sourced from Procore and public plain-English explainers.',
        },
        {
          tag: 'verify',
          text: 'Operational KPI targets (ft/day, splices/day, drops/day) are practitioner consensus ranges — actual targets depend on contract scope, crew size, and terrain. Confirm against your organization\'s historical productivity data.',
        },
      ]}/>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Scenario-Based Exam Questions
   ───────────────────────────────────────────────────────────────────────── */

const M11_QUESTIONS = [
  {
    id: 'm11-q1',
    type: 'mc',
    prompt:
      'A sales engineer tells a customer: "The FBA national median is $16.25/ft underground and $6.49/ft aerial, so your 2-mile aerial route should cost about $68,600." Which is the most accurate critique of this estimate?',
    choices: [
      'The FBA numbers are wrong; the correct industry figures are $10/ft for all fiber.',
      'The numbers are technically correct national medians, but they omit make-ready cost, regional labor variance, and locate cost — the actual project cost could be 2–4× higher or 50% lower depending on pole condition and union presence.',
      'Aerial fiber should always be priced from underground rates to be conservative.',
      'The estimate is valid as long as it is presented as a lump-sum bid.',
    ],
    answerIndex: 1,
    explanation:
      'The FBA/Cartesian medians ($6.49/ft aerial and $16.25/ft underground from the 2023-dataset report; $6.55/ft aerial and $18.25/ft underground from the 2024-dataset report) are VERIFIED public benchmarks — but they are national medians that mask a 10–15× field variance. Make-ready, regional labor, locate density, and pavement restoration are not captured in a $/ft backbone number. Presenting a bare median as a project estimate without caveats is a classic budgeting error.',
    citation:
      'FBA/Cartesian Fiber Deployment Cost Annual Report 2023 (published January 2024) and 2024 (published February 2025) (both VERIFIED); Fierce Network reporting on 2024/2025 updates (VERIFIED-via-secondary-source).',
    fieldNote:
      '"Are locate costs in scope or excluded?" is the first question an experienced estimator asks before quoting a $/ft number.',
  },
  {
    id: 'm11-q2',
    type: 'mc',
    prompt:
      'Your FTTH project has passed 5,000 homes and connected 1,750 of them. Your total backbone + distribution CapEx was $6,500,000. What is the Cost per Home Passed (CPHP) and Cost per Home Connected (CPHC)?',
    choices: [
      'CPHP = $1,300; CPHC = $1,300 (they are the same metric).',
      'CPHP = $1,300; CPHC = $3,714 (CPHP ÷ take rate of 35%).',
      'CPHP = $3,714; CPHC = $1,300 (CPHC is always lower because fewer homes are billed).',
      'CPHP = $1,300; CPHC = $1,300 because drop cost is billed separately to the subscriber.',
    ],
    answerIndex: 1,
    explanation:
      'CPHP = $6,500,000 ÷ 5,000 = $1,300/HP. Take rate = 1,750 ÷ 5,000 = 35%. CPHC = CPHP ÷ take rate = $1,300 ÷ 0.35 = ≈$3,714/HC. CPHC is always higher than CPHP because not every passed home subscribes — the capital is spread across fewer revenue-generating connections.',
    citation:
      'CPHP/CPHC framework: FTI Consulting "From Coverage to Cash Flow" (VERIFIED-public-source); iQGEO FTTH terminology glossary (VERIFIED-via-secondary-source).',
    fieldNote:
      'Raising take rate from 35% to 50% on this example reduces CPHC from $3,714 to $2,600 — a larger financial improvement than most CapEx reduction initiatives.',
  },
  {
    id: 'm11-q3',
    type: 'mc',
    prompt:
      'A contractor bids your aerial FTTH build at $7.20/ft using a lump-sum contract. Three months in, a make-ready inspection reveals 14 poles that require full replacement. The contractor submits a change order for $62,000. Which contract condition made this outcome likely?',
    choices: [
      'T&M contracts always produce change orders; lump-sum would have prevented this.',
      "The contractor's lump-sum bid was based on available desktop data; pole replacement discovered in the field is new scope not in the original contract, and a lump-sum contract requires a change order for any scope outside the defined work.",
      'Change orders are not allowed on lump-sum contracts; the contractor must absorb the cost.',
      'The $62,000 is within normal 5% contingency and should have been pre-funded.',
    ],
    answerIndex: 1,
    explanation:
      'A lump-sum contract is based on the scope defined at bid time. Pole condition discovered during engineering inspection that was not visible in the desktop survey is new scope — it triggers a change order regardless of contract type. Lump-sum does not eliminate change orders; it just means every change is a separate negotiation. This is the most common change-order driver on aerial OSP builds.',
    citation:
      'Procore library — lump-sum contracts (VERIFIED-via-secondary-source); FCC 18-111 OTMR framework (make-ready process context).',
    fieldNote:
      '$62,000 across 14 poles is ≈$4,400/pole — within the US$1,500–5,000+ full-replacement range. An adequate contingency (10–15% for brownfield aerial) would partially absorb this; a 5% contingency on a $500K contract is only $25,000.',
  },
  {
    id: 'm11-q4',
    type: 'mc',
    prompt:
      'You are selecting a contract type for a splice-and-extend job inside an existing 1970s conduit system in a downtown core. Conduit fill is unknown, permits are uncertain, and locate density is high. Which contract structure is most appropriate and why?',
    choices: [
      'Lump-sum, because it transfers all risk to the contractor and protects your budget.',
      'T&M with a not-to-exceed (NTE) ceiling, because scope is partially unknown — you want actual-cost billing for discovered conditions while capping your maximum exposure.',
      'GMP, because downtown work always requires a guaranteed maximum price.',
      'RFP, because competitive bidding always produces the lowest cost.',
    ],
    answerIndex: 1,
    explanation:
      'When scope is partially unknown — conduit fill unknown, locate density high, permits uncertain — T&M with an NTE ceiling is the most common field compromise. It lets you pay actuals for what is discovered while capping your budget exposure. Lump-sum on unknown scope either produces an over-padded bid (contractor protects margin) or a change-order war. GMP is appropriate for larger capital programs but uncommon on a single splice-and-extend job. RFP is a procurement vehicle, not a contract type.',
    citation:
      'Practitioner consensus: r/telecom, BICSI Community, Let\'s Talk Cabling; Procore T&M and GMP definitions (VERIFIED-via-secondary-source).',
    fieldNote:
      '"T&M-NTE is what you get when scope is unknown" is the recurring practitioner take across multiple community forums. The NTE ceiling is what protects the owner; without it, T&M is a blank check.',
  },
  {
    id: 'm11-q5',
    type: 'mc',
    prompt:
      'Your underground FTTH build in a downtown pavement-cut zone is over budget at 70% completion. The project manager proposes adding 5% contingency to close the gap. A senior estimator pushes back. What is the most likely basis for the pushback?',
    choices: [
      '5% is too much contingency for a downtown project; the correct figure is 2%.',
      '5% contingency is the vendor-template default. Downtown pavement-cut work typically warrants 20% construction contingency plus a separate materials-escalation line — at 70% completion, the remaining 30% of scope is what needs contingency, not the whole project.',
      'Contingency should only be added at the start of a project, not mid-project.',
      'The correct response is to file a change order against the owner, not add internal contingency.',
    ],
    answerIndex: 1,
    explanation:
      'The editorial default for downtown pavement-cut work is 20% construction contingency (per Let\'s Talk Cabling practitioner consensus, not 5%). More importantly, at 70% completion, adding contingency to the total project cost is wrong — the remaining exposure applies only to the remaining 30% of scope. The 5% figure also conflates materials escalation (a market risk) with construction contingency (a scope-uncertainty risk); they should be tracked separately.',
    citation:
      'Let\'s Talk Cabling — contingency floor for OSP/brownfield (forum consensus, VERIFIED-via-secondary-source); Procore escalation clause article (VERIFIED-via-secondary-source).',
    fieldNote:
      '"Vendor estimating templates systematically under-budget contingency at 5% when the realistic floor for OSP / brownfield is 10–15%" — recurring finding from Chuck Bowser (RCDD) and the Let\'s Talk Cabling podcast community.',
  },
  {
    id: 'm11-q6',
    type: 'dragdrop',
    prompt:
      'Match each FTTH metric or KPI to its correct definition. Drag each term to the description that fits it.',
    items: [
      { id: 'hp',        label: 'Homes Passed (HP)' },
      { id: 'hpplus',    label: 'Homes Passed Plus (HP+)' },
      { id: 'hc',        label: 'Homes Connected (HC)' },
      { id: 'takerate',  label: 'Take Rate' },
      { id: 'cphc',      label: 'CPHC' },
    ],
    targets: [
      { id: 't1', label: 'Fiber is on the street or in the riser; customer can order service but no drop installed.' },
      { id: 't2', label: 'Drop cable placed to the NIU; service can be lit quickly on demand.' },
      { id: 't3', label: 'Customer has active service — provisioned, tested, and billing.' },
      { id: 't4', label: 'Homes Connected ÷ Homes Passed at a given point in time.' },
      { id: 't5', label: 'Total CapEx ÷ Homes Connected (always higher than CPHP).' },
    ],
    correctMap: {
      t1: 'hp',
      t2: 'hpplus',
      t3: 'hc',
      t4: 'takerate',
      t5: 'cphc',
    },
    explanation:
      'HP = available, no drop. HP+ = drop placed, not lit. HC = active subscriber. Take Rate = HC/HP. CPHC = CapEx ÷ HC = CPHP ÷ take rate (always exceeds CPHP because not all passed homes subscribe).',
    citation:
      'FBA/Cartesian 2024; Huber+Suhner FTTH terminology; iQGEO glossary; FTI Consulting "From Coverage to Cash Flow" (all VERIFIED).',
    fieldNote:
      'The HP → HP+ → HC pipeline is a revenue-activation funnel. Operators who build fast but market slowly accumulate HP cost without generating HC revenue — the structural gap that WIK and FTI both flag as the dominant financial risk in scaled FTTH programs.',
  },
];
