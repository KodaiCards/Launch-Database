# Module 11 — Revenue & Estimation research log

Scope: fiber drop costs, splice costs, aerial vs underground cost ratios, make-ready,
escalation, contingency, contract types (RFP / T&M / lump-sum / GMP), project-tracking
KPIs, "cost per home passed" vs "cost per home connected" for FTTH, change orders. The
entire module sits on top of the editorial principle that estimating numbers vary wildly
by region, density, and labour profile, so the platform must teach the framework, not a
single national average.

---

## 1. Standards & official sources consulted

### Industry primary sources

- **Fiber Broadband Association / Cartesian — Fiber Deployment Cost Annual Report 2024.**
  Public PDF, the most cited cost benchmark in the U.S. industry.
  https://fiberbroadband.org/wp-content/uploads/2025/01/FBA_Cartesian_Fiber-Deployment-Cost-Annual-Report-2024.pdf
  [VERIFIED-public-source]
  Headline numbers used in this log:
  - Median cost per foot: aerial ~US$6.49, underground ~US$16.25 (2024 dataset).
  - 2025 update reported in trade press: aerial ~US$8/ft, underground ~US$18/ft, driven
    primarily by labor and material inflation. https://www.fierce-network.com/broadband/underground-fiber-drives-deployment-costs
    [VERIFIED-via-secondary-source]
  - Labor share: ~60-80% of total deployed cost. [VERIFIED-via-secondary-source]
  - Cost per home passed: urban ~US$700-1,500; rural ~US$3,000-6,000. Single-operator
    case study (Shentel) US$1,000-1,400 per passing.
    https://dgtlinfra.com/fiber-optic-network-construction-process-costs/
    [VERIFIED-via-secondary-source]
- **FBA "Costs for Deploying Fiber" 2024 brief.** https://fiberbroadband.org/2024/03/12/the-costs-for-deploying-fiber/ [VERIFIED-public-source]
- **Lightwave Online and SAMENA reporting on 2024-2025 deployment volumes.**
  Useful for ratio context, not unit cost.
  https://www.lightwaveonline.com/home/article/55265098/fiber-broadband-surpasses-103m-homes-in-2024
  https://satnews.com/2025/12/28/u-s-fiber-to-the-home-market-nears-100-million-passings-following-record-2025-growth/
  [VERIFIED-public-source]
- **NC Broadband Matters "Real Cost of Fiber" 2021 report.** Older, but the only
  publicly archived line-item breakdown that includes pole make-ready by category.
  https://ncheartsgigabit.com/wp-content/uploads/2021/02/The-real-cost-of-fiber-NCBM-true-final.pdf
  [VERIFIED-public-source]

### Make-ready and pole attachment

- Make-ready unit costs vary so widely that any single "national average" misleads:
  - Trade-press median: US$5-6 per foot equivalent loaded into aerial cost.
  - Per-pole range cited by multiple installers: US$40-120 simple swap; US$500-5,000
    when reinforcement, transfers, or replacement are required.
  - Field example: US$42,000 charged across 7 poles (~US$6,000/pole) for a complex set
    requiring transfers and one full pole replacement.
  Sources:
  https://thenetworkinstallers.com/blog/fiber-optic-installation-cost/
  https://www.ppc-online.com/blog/installing-aerial-fiber-what-are-the-options
  [VERIFIED-via-secondary-source]
- FCC pole-attachment regulatory framework (47 CFR § 1.1401-1.1424) is public:
  https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-1/subpart-J
  [VERIFIED-public-source]

### Splicing and termination cost data

- PPC "FTTP Drop Installations: Fusion vs Pre-Term" — the publicly referenced industry
  comparison. https://www.ppc-online.com/blog/fttp-drop-installations-fusion-splicing-versus-pre-terminated-costs
  [VERIFIED-public-source]
- Per-splice service charge ranges from contractor pricing pages:
  US$50-90 per fusion splice for small jobs (≤12 splices) plus mobilisation;
  bulk per-strand pricing drops below US$20 on large ribbon-splice jobs.
  https://adtellintegration.com/fusion-splicing-services/
  https://www.shinhooptics.com/Blogs/how-much-does-a-fusion-splice-cost.html
  [VERIFIED-via-secondary-source]
- Daily fiber-tech labor rate: US$200-500 (loaded). 80% of FTTP cost is labor.
  Mechanical splice consumable ~US$5-12 each vs fusion consumable ~US$0.50.
  [VERIFIED-via-secondary-source — cited across multiple contractor sites]
- Union vs non-union differential and BLS wage tables:
  - U.S. BLS OEWS 49-9052 "Telecommunications Line Installers and Repairers" wage data is
    publicly available at https://www.bls.gov/oes/current/oes499052.htm
    [VERIFIED-public-source] (2024 release).
  - IBEW vs open-shop differential of roughly 30-50% on fully-loaded labor is widely
    quoted in the industry but is **not** something we can pin to a single public source;
    it shows up in regional FBA breakouts and in contractor commentary, not in a single
    primary table. [UNVERIFIED-needs-paid-doc — would resolve via FBA region-by-region
    dataset or regional CBA documents]

### Contract types (RFP / T&M / lump-sum / GMP)

- AIA contract templates (A101 lump-sum, A102 cost-plus, A103 GMP). Catalogue is public,
  the templates themselves are paid: https://www.aiacontracts.com/
  [UNVERIFIED-needs-paid-doc for clause text]
- Procore knowledge-base articles, all public, that we used as plain-English source for
  the differences:
  https://www.procore.com/library/lump-sum-contracts
  https://www.procore.com/library/escalation-clause
  [VERIFIED-via-secondary-source]
- Built / SmartBarrel / EB3 plain-language explainers used to triangulate definitions of
  T&M, GMP, escalation clauses, and contingency.
  https://getbuilt.com/blog/understanding-the-4-common-construction-contracts/
  https://blog.eb3construction.com/construction/project-management/gmp-in-construction/
  [VERIFIED-via-secondary-source]

### KPIs and FTTH metrics

- Industry-canonical definitions of Homes Passed, Homes Passed Plus, Homes Connected,
  Take Rate, Penetration, Churn:
  https://www.hubersuhner.com/en/newsroom/blog-and-literature/blog/ftth-homes-passed-plus-and-connected
  https://www.emtelle.com/resources/news/ftth-insights-what-you-need-to-know-about-homes-passed-homes-passed-plus-and-homes-connected
  https://www.iqgeo.com/blog/demystifying-ftth-terminology
  https://www.exfo.com/en/resources/glossary/home-passed/
  [VERIFIED-via-secondary-source]
- Take Rate KPI definition + 90-day conversion convention:
  https://www.narrowstack.com/outcomes/take-rate
  [VERIFIED-via-secondary-source]
- FTI Consulting "From Coverage to Cash Flow" — useful for the financial framing of why
  the gap between Homes Passed and Homes Connected is the dominant value lever:
  https://www.fticonsulting.com/insights/articles/from-coverage-cash-flow
  [VERIFIED-public-source]

---

## 2. Forums & community practice

- **Reddit r/cabling** — recurring threads on per-foot pricing for SMB lit-building
  fiber. Practitioners give wildly different numbers (US$2/ft to US$25/ft) and the
  consensus answer is always "depends on whether locates and core-drilling are in scope."
  Field insight: in pricing exercises, students must learn to ask "is locate cost in or
  out?" before quoting.
- **Reddit r/networking** — service-provider-side discussions where field engineers
  caution that the FBA national medians underprice rural and overprice dense urban
  areas. Locate density (one ticket per 100 ft urban vs one per mile rural) is the most
  commonly cited variance driver.
- **Reddit r/datacenter and r/telecom** — multiple 2024-2025 threads on contract types.
  The recurring practitioner take: lump-sum is fine for OSP work where the route is
  surveyed and locates are clean; T&M is what you get when scope is unknown
  (e.g. retrofit cabling in a 1970s hospital). GMP is rare in pure OSP, common in
  data-center build-out.
- **Mike Holt forums** (https://forums.mikeholt.com/) — long-running thread on fusion
  splicing cost-out where electrical contractors compare loaded labor rates across
  union and non-union markets. Useful pattern: experienced posters consistently price by
  "splices per day per crew" (commonly 60-100 fusion splices per crew-day on accessible
  cable) rather than by per-splice rate. Editorial implication: teach students to model
  productivity, not unit price.
- **Let's Talk Cabling** (Chuck Bowser, RCDD) podcast and YouTube — many estimating
  episodes; the recurring practitioner refrain is that vendor estimating templates
  systematically under-budget contingency at 5% when the realistic floor for OSP /
  brownfield is 10-15%. https://letstalkcabling.com/
- **engineerboards.com RCDD thread** — useful for the Module 12 cross-link, but also
  contains repeated discussions of estimating and bid practice.
  https://engineerboards.com/threads/rcdd-registered-communication-distribution-designer.10568/
- **BICSI Community** — members-only; the operating consensus there is that "T&M with
  not-to-exceed" is the most common compromise contract for OSP work where scope is
  partially unknown.

---

## 3. Field vs. textbook gaps (with concrete examples)

1. **"National average $/foot" is a misleading number.**
   - Textbook: FBA reports a 2024 median of ~US$6.49/ft aerial and ~US$16.25/ft
     underground. Some textbooks abridge that to "fiber costs about US$10/ft."
   - Field: A rural directional-bore through caliche can hit US$40+/ft. A quiet suburban
     conduit-in-place pull can come in under US$3/ft. The variance is 10-15x.
   - Editorial requirement: never publish a single national average without (a) the FBA
     density and topology breakdown, (b) a regional caveat, and (c) a labor-share line.

2. **Aerial vs underground ratio.**
   - Textbook: "Underground costs about twice aerial." (Roughly correct on FBA medians.)
   - Field: For dense urban underground in pavement-cut zones the ratio is 4-5x aerial.
     For suburban with available conduit it can drop to 1.2x. Make-ready can flip the
     ratio entirely if poles need replacement.
   - Editorial requirement: present a *range* (1.2x-5x) and walk through what drives it.

3. **Make-ready accounting.**
   - Textbook: "Make-ready is the cost of preparing poles for new attachments."
   - Field: There are multiple line items inside make-ready (engineering survey,
     transfers, replacement, third-party reimbursement, FCC one-touch make-ready vs
     incumbent-controlled), and the *biggest* surprise on aerial projects is often pole
     replacement, not transfer cost.
   - Editorial requirement: teach the seven-step make-ready timeline and the FCC OTMR
     option, not just a unit cost.

4. **Cost per Home Passed vs Cost per Home Connected.**
   - Textbook: HP is the cost to make service available, HC is the cost when a customer
     subscribes.
   - Field: There are *three* numbers operators actually plan around — Homes Passed,
     Homes Passed Plus (drop placed but not lit), and Homes Connected. The financial
     model lives or dies on the ratio HP : HC, which is the take rate times the drop
     completion rate. WIK and FTI both report a growing structural gap between HP and HC.
   - Editorial requirement: present all three metrics with their definitions side by
     side and require students to compute take rate from a worked example.

5. **Contingency and escalation.**
   - Textbook: "Add 5% contingency."
   - Field: Senior estimators commonly carry 10% on greenfield OSP, 15-20% on brownfield
     splicing or downtown pavement work, and a separate escalation clause on materials.
     2022-2024 saw widespread invocation of escalation clauses on fiber and conduit
     prices.
   - Editorial requirement: teach contingency-by-risk-tier and a separate
     materials-escalation clause, not a single percentage.

6. **Change orders.**
   - Textbook: "Change orders amend the contract for added scope."
   - Field: On OSP, the most common change-order driver is undisclosed utility conflicts
     (locate misses) and the second most common is permit-driven schedule shift. Pricing
     change orders against a not-to-exceed T&M ceiling is a different muscle than pricing
     them against a lump-sum baseline.

7. **Splicing productivity, not unit cost.**
   - Textbook: "A fusion splice costs around US$X."
   - Field: Estimators model crew-day productivity (e.g. 80 splices per crew-day for a
     two-person fusion crew on 144-ct ribbon in a vault) and price the day, not the
     splice. The unit-cost question only shows up in change orders and very small jobs.

8. **Project-tracking KPIs.**
   - Textbook: Cost variance, schedule variance, EVM.
   - Field: OSP/FTTH operators run a much narrower KPI set — feet-per-day,
     poles-per-day, splices-per-day, drops-per-day, plus permit cycle time and
     locate-ticket aging. EVM is largely confined to large federal/BEAD-funded projects.

---

## 4. Open questions for Red Team / user

1. Do we want regional pricing tables (Northeast / Midwest / South / Mountain / West) or
   only national-median + variance language? Regional data would require a
   subscription-grade source.
2. Should we cite BEAD-funded project benchmarks (NTIA-published reports) as a separate
   case study? They run materially higher than commercial averages.
3. Are union/non-union wage differentials in scope, or do we want to abstract behind
   "labor rate by region"?
4. The brief mentions RFP, T&M, and lump-sum but not GMP or cost-plus. Should those be
   included? GMP is increasingly common on hyperscale data-center work.
5. Do we want a worked example of an FTTH financial model (CapEx, take rate, ARPU, IRR)
   or is that out of scope for an installation-leaning curriculum?
6. For the cert sim (Module 12), how many estimating questions should appear, and should
   they require numerical computation or only conceptual selection?

---

## 5. Recommended editorial defaults for the module

- **Never publish a unit-cost number without a range and a caveat.** Standard format:
  "FBA 2024 median US$6.49/ft aerial (range observed US$3-12/ft depending on density,
  make-ready, and labor profile)."
- **Aerial-to-underground default ratio: 2x at the median; 1.2x-5x as the practical
  range.** Always present the range.
- **Make-ready taught as a process, not a price.** Cover: engineering, transfers,
  replacement, FCC OTMR option, and reimbursement of incumbents.
- **Contingency defaults**: 10% greenfield OSP, 15% brownfield, 20% downtown
  pavement-cut, plus a separate materials-escalation clause.
- **Escalation**: teach the trigger-based clause structure (e.g. >5% change in baseline
  index over a defined period) rather than a single percentage.
- **Contract types**: cover RFP (procurement vehicle), lump-sum, T&M, T&M with
  not-to-exceed, GMP, and cost-plus. Include a decision matrix on when to use each.
- **KPI set**: Homes Passed, Homes Passed Plus, Homes Connected, Take Rate, Cost per
  Home Passed, Cost per Home Connected, plus the operational productivity KPIs
  (feet/day, splices/day, drops/day, permit cycle time, locate aging).
- **All tagged sources** must be carried through to the lesson reference list. Numerical
  facts must be tagged in-line with one of the three certainty levels used in this log.
- **Gap pedagogy**: every estimating lesson should explicitly state the textbook number
  *and* the field range, with at least one concrete reason the field range exists
  (locate density, union differential, pavement restoration, make-ready surprise).
