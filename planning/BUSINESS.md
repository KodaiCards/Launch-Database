# Launch Fiber — Business & Vision (Planning's knowledge base)

> Owned by Planning. The living record of **what the company is, who Carter is, the clients, how money flows, and the vision for the software** — captured directly from Carter. Started in the deep-dive **2026-06-28**. READ-ONLY to agents (useful context for everyone). Prior founder-validated snapshot: `docs/PRODUCT_PLAN.md`.

## Carter — role & how he operates
- The internal **owner/driver of this software**.
- Handles **billing, design, and permitting**; manages the **smaller (non-RUS) clients**. The rest of the team manages the biggest client, **PSC**.
- **"The guy with the numbers in office"** — the connecting piece between field work and the offsite accounting team. Does **not** handle payroll or send invoices.
- Billing flow: Carter submits a **recap/overview (hours + billables, RUS codes if applicable)** → the **accounting team sends the invoices**.
- ⚠️ **Bus-factor = Carter.** Only he can bill; only he has the maps + the knowledge. If he's out of office, no one can replace him.

## The company — structure & work
- **Subcontracting company, NO PE on staff** → **not the prime on RUS** (subs under a prime). **Prime on normal (non-RUS) work.**
- Small projects **all over GA + some FL**.
- **PSC** (biggest client): **BAU + RUS, mostly RUS**. Team is **mostly inspectors**.
- **~70% of revenue = PSC RUS work.**
- Non-RUS: **mostly permitting**, with **neighborhood/zone design** occasionally. Many small permits/projects across the state.

## ⚠️ Strategic reality (reframes priorities)
- **RUS will likely END in ~6 months** (≈ end of 2026); hoping for another project. **Currently in DOWNTIME** — office cut to **20 hrs/week**, waiting on the next **CC (construction contract)** from RUS to be approved.
- **The downtime is why the training pivot exists** (train people while slow).
- **Implication:** the software must **scale beyond RUS.** RUS is the urgent, complicated case to handle *now* (70% of revenue + the biggest pain), but **longevity = the non-RUS small-permit/design world + a general "toolkit a new company needs."** Don't over-invest in RUS-only tooling that dies with RUS — build RUS as a **configurable case**.

## RUS construction-side disciplines (stage-based, different rates)
**Inspection · Resident Engineer · Dailies & As-builts · Final Records.** Each happens at a different project stage with its own rate. (These are the concrete RUS job types behind the per-job billing model.)

## The RUS daily field workflow (production tracking)
- Each **inspector watches 1 crew**.
- Inspector submits paperwork that **they + the foreman sign** → agrees on **units complete that day** (the signed doc = the agreement record).
- **Photo of the doc + redlines → the "office lady"** → she works the **Coda doc**: tracks **materials used** + **where to provide the As-built**.
- Serves as **(a) backup to verify contractor pay** and **(b) a live field update for the Client**.

## Pain points (what the software must kill)
1. **Billing memory across many small projects** — Carter forgets **whether he billed** and **how much**. The "did I bill this?" problem. *(High value, NOT RUS-dependent → serves the durable future.)*
2. **Maps / bus-factor** — maps live with Carter; if he's out, no one steps in; no one else can bill. Company is hostage to his presence + knowledge.
3. **RUS complexity** — the biggest pain, but temporary.
4. **Team not knowledgeable / struggles with tech** — desperately needs training; processes must be dead-simple for new people.

## Vision & quality bar (his words)
- **Scales with the company**; handles complicated stuff (RUS); solves day-to-day hassles.
- **"So nice other companies would be jealous"** — owners might even **sell the software**. **Wow factor.** Present to the CEO/owner and **amaze him**.
- **The most useful product in the office; used DAILY by everyone.**
- **Clean, visually pleasing documents = the #1 priority.**
- **Never a time-waster — quick & easy is critical.** Team struggles with tech → **dead simple.**
- **Full solution for what a new company needs, with EMPHASIS ON ORGANIZATION.**

## File sharing / maps goal
- Carter started a **file-share system** so **maps are always available** (de-risk the bus-factor).
- Goal: work toward **merging files into a large ACAD + KMZ with (somewhat) live editing**.
- **Minimum bar:** files they can **copy-paste into**.

## Planning's synthesis (my read — to verify with Carter)
- **The core "why" for Carter personally = de-risk the bus-factor:** make **billing + maps + knowledge transferable** so the company isn't hostage to him. Billing-tracking, file-share/maps, and training all serve this.
- **Two jobs for the software:** (1) handle RUS's complexity *now*; (2) be the durable, general, **sellable-grade** toolkit for the post-RUS future. Favor **configurable/data-driven over hard-coded** so RUS is a case, not the foundation — and so it's generalizable enough to sell.
- **"Wow" comes through simplicity, not feature breadth** (low-tech team, can't be a time-waster). Polish + elegantly solving real pain = the wow (matches `PRODUCT_PLAN`).
- **Durable near-term wins that outlive RUS:** the "did I bill this?" billing-tracker + file-share/maps availability — both high value, both non-RUS-dependent.
- **Sequencing flag:** the current `IMPLEMENTATION_PLAN` center of gravity is fairly RUS/map-heavy; the 6-month sunset may warrant re-weighting toward the durable/general wins. Revisit after training.

## Open questions / to revisit
- ~~**RUS-sunset weighting**~~ **RESOLVED 2026-06-28:** build **configurable / data-driven across the whole platform** (decisions **D013**); RUS = the first configured profile, not the foundation. Handles RUS now + stays versatile for constant change. Configurability is now a first-class, cross-cutting principle (Carter: "versatility is important for everything").
- **Bus-factor intent:** build so **anyone** can bill / access maps, vs just make Carter faster?
- **"Sellable":** design general/configurable from the start, or Launch-first then generalize?
- **Timing:** what does "the next CC approved" unlock — when does RUS work resume/ramp, and how does that change the training runway?

---
*Cross-refs: `docs/PRODUCT_PLAN.md`, `docs/IMPLEMENTATION_PLAN.md`, `INVENTORY.md`.*
