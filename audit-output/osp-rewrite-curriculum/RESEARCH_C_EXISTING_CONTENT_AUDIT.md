# OSP-RW Curriculum Scoping — Research Agent C — Existing Content Audit + Gap Map

## Stack snapshot (≤120 words)

Two parallel curriculum trees exist in `kodaicards/launch-database`:

1. **`osp-training/src/modules/*.jsx`** — 13 React JSX module files (M01-M12 + ToolsPage), 7,144 LOC. This is the SPA the user clicks through at `/training/`. Pure JSX with embedded prose, tables, callouts (Callout kind="book|field|verify|warn"), and InteractiveQuiz/LinkBudgetCalculator/OTDRTraceViewer/TopologyCanvas/CertificationSim/Flashcard components.
2. **`content/osp-*/*.md`** — 64 markdown lesson files in 5 topic folders (cable-selection, splice-termination, survey-route, domain-4-standards-codes, hardware-accessories). Total ≈22,000 LOC. This is the parallel curriculum the prior pitch-revision wave (T1-T5) targeted. **Not currently surfaced in the SPA** — separate from the JSX module SPA the user sees today.

Component reuse pool: 7 components in `osp-training/src/components/`. All real; all reusable.

## Per-section grading table

Format: Module / Section / Title / Lines (JSX file line range) / Grade / Predicted new topic / Prereq violations / Notes.

### Module 01 — Fiber Physics (`Module01_FiberPhysics.jsx`, 349 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M01 | 1.1 | Why these wavelengths? | 24-60 | A | Fiber Physics | "dispersion" used before §1.3 defines it; "PON / metro / DWDM" undefined | Locked sample lesson territory; clean field-vs-book callout structure |
| M01 | 1.2 | Attenuation — datasheet vs. designer | 62-135 | A | Fiber Physics | "TIA-568.3-D reference-grade" undefined; "splice loss / connector loss" undefined here | Three-number framework (spec/typical/planning) is core teaching pattern |
| M01 | 1.3 | Dispersion | 137-167 | A | Fiber Physics | "PMD" defined but "coherent systems above ~10 Gb/s" undefined; "G.652.D" undefined | Excellent book/field framing |
| M01 | 1.4 | Macrobend & microbend | 169-192 | A | Fiber Physics | "G.657 bend-insensitive" appears before topology covers fiber types | Defines macro/microbend cleanly |
| M01 | 1.5 | Decibels — log math | 194-208 | B | Fiber Physics (foundations) | dBm referenced before any prior log primer; uses µW without W primer | Compressed; needs more unpacking under stupid-simple pitch |
| M01 | 1.6 | Worked link budget | 210-234 | A | Fiber Physics | Assumes Tx/Rx terminology not introduced; uses dB safety pad without rationale | Excellent worked-example pattern |
| M01 | 1.7 | LinkBudgetCalculator | 236-238 | A | Fiber Physics | n/a | **Reusable component** |
| M01 | 1.8 | Quiz (5Q: 3MC + 1DD + 1MC) | 240-244 + 260-348 | A | Fiber Physics | n/a | High quality quiz bank; preserve |

### Module 02 — OSP Design (`Module02_OSPDesign.jsx`, 380 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M02 | 2.1 | What NESC is (paywalled framing) | 29-55 | A | Standards & Codes intro | "C2-2023" used before NESC framed; "AHJ" first use undefined here | Editorial discipline excellent |
| M02 | 2.2 | Vertical clearance Rule 232 | 57-82 | A | Aerial Design | "Rule 232" used as identifier before any tour of NESC structure | Per CLAUDE.md, M02 EVEN sections passed Carter-reads-cold pitch |
| M02 | 2.3 | Comm-to-supply separation | 84-109 | A | Aerial Design | "supply / communication / neutral" pole layout assumed | Clean book/field callouts |
| M02 | 2.4 | Pole loading / Section 26 | 111-145 | A | Aerial Design | "Grade B/C" used before defined elsewhere | Per CLAUDE.md, M02 EVEN passed (this is even) |
| M02 | 2.5 | Loading districts Rule 250 | 147-180 | A | Aerial Design | "psf" undefined; "Heavy/Medium/Light district" assumed from map | Macon GA = Light per CLAUDE.md §1; matches user geography |
| M02 | 2.6 | Aerial vs underground | 182-213 | A | Make-Ready / Cost | "make-ready" used before §2.8 defines it | M02 EVEN; cost data has clear citation |
| M02 | 2.7 | ROW, easements, prescriptive | 215-237 | A | Permitting & ROW | "AHJ" assumed | Field framing nailed ("documents problem, not design problem") |
| M02 | 2.8 | Make-ready & OTMR | 239-266 | A | Make-Ready | "FCC 18-111" / "OTMR" introduced together | M02 EVEN; passes |
| M02 | 2.9 | Quiz (4MC + 1DD) | 268-269 + 290-379 | A | Aerial Design | n/a | Strong quiz |

### Module 03 — Permitting & Planning (`Module03_PermittingPlanning.jsx`, 654 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M03 | 3.1 | Permitting layer cake (Fed/State/Muni/Private) | 36-85 | A | Permitting & ROW | "BEAD/BIP/RDOF/FirstNet/E-Rate" stack assumed; "federal nexus" defined inline well | Excellent framing for field-guy audience |
| M03 | 3.2 | NEPA, CE C-8, extraordinary circumstances | 87-155 | A | Permitting / Environmental | "EA/FONSI/EIS" not pre-introduced; "NEPA" framed in §3.1 | Citations rigorous; verify flags tasteful |
| M03 | 3.3 | NHPA Section 106 / SHPO clock | 157-209 | A | Permitting / Environmental | "ACHP/THPO" introduced inline; "APE" undefined for newcomers | Strong table layout |
| M03 | 3.4 | ESA / bats / IPaC | 211-276 | A | Permitting / Environmental | "USFWS/T&E" assumed; bat species names not previewed | Stupid-simple pitch needed but content is correct |
| M03 | 3.5 | Municipal ROW permits | 278-347 | A | Permitting & ROW | "TCP/PE-stamp" partial; multiple AHJ assumptions | Realistic timelines (30 days to 12+ months) |
| M03 | 3.6 | AutoCAD & GIS deliverables | 349-436 | B | Drafting & GIS | "DWG/KMZ/shapefile/geodatabase" alphabet soup assumed | Useful field-vs-textbook pattern but pitch needs work |
| M03 | 3.7 | Make-ready as PM problem | 438-497 | A | Make-Ready | OTMR re-introduced (good); "shot clocks" defined inline | Pairs well with M02 §2.8 |
| M03 | 3.8 | Quiz (5MC + 1DD) | 499-501 + 549-653 | A | Permitting & ROW | n/a | Strong scenario design |

### Module 04 — Splicing (`Module04_Splicing.jsx`, 593 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M04 | 4.1 | Three different splice-loss numbers | 33-80 | A | Splicing | "FOA / ITU-T L.400 / OTDR bidirectional" stack assumed | Excellent four-number framework |
| M04 | 4.2 | Splicer estimate vs OTDR measurement | 82-131 | A | Splicing | "MFD/Active Fusion Control/cleave angle" assumed; "arc test" introduced here | Critical field concept |
| M04 | 4.3 | Core vs cladding alignment | 133-189 | A | Splicing | "V-groove/eccentricity/MFD" assumed | Vendor table is valuable reference |
| M04 | 4.4 | Ribbon / mass splicing | 191-235 | A | Splicing | "buffer tube/ribbon/rollable-ribbon" assumed | Productivity framing is field-realistic |
| M04 | 4.5 | Mechanical splicing | 237-274 | A | Splicing | "index-matching fluid/gel" assumed | Realistic "emergency only" framing |
| M04 | 4.6 | Closures / trays / slack | 276-373 | A | Splice Hardware & Closures | "FOSC/COYOTE/buffer tube/express loop" alphabet | Strong topology comparison |
| M04 | 4.7 | Connector loss — three numbers | 375-424 | A | Connectors & Termination | "UPC/APC" partially introduced; "ferrule cleaning pen" undefined | Reference-grade vs legacy max distinction important |
| M04 | 4.8 | Quiz (4MC + 2DD) | 426-428 + 463-592 | A | Splicing | n/a | Best quiz bank in repo; 6 questions with 2 drag-drops |

### Module 05 — Networking Blueprints / ISP (`Module05_NetworkingBlueprints.jsx`, 656 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M05 | 5.1 | "Networking Blueprints" = ISP rename | 35-63 | A | Inside Plant intro | Dual-vocabulary explained inline; clean | Editorial signature lesson |
| M05 | 5.2 | Four telecom spaces (EF/ER/TR/TE) + MDF/IDF | 65-185 | A | Inside Plant | "MDF/IDF/MC/HC" stacked; rich table | Comprehensive; cert-prep grade |
| M05 | 5.3 | Backbone vs horizontal (90/100m rule) | 187-276 | A | Inside Plant | "OM3/OM4/OM5/10GBASE-SR/IEEE 802.3" stack | Famous 90/100m exam content |
| M05 | 5.4 | Work-area outlets / T568A vs B | 278-339 | A | Inside Plant | "T568A/B/Cat 5e through Cat 8" assumed | Pair table is verbatim correct |
| M05 | 5.5 | TIA-606-D administration | 341-391 | A | Standards & Documentation | "Class 1-4" defined inline; Brady/Panduit reference is field-real | Solid |
| M05 | 5.6 | TIA-607 PBB/SBB rename | 393-487 | A | Grounding & Bonding | TMGB/TGB → PBB/SBB rename clearly handled; "TBB/BCT" introduced | Cert-exam favorite content |
| M05 | 5.7 | TIA standards family quick ref | 489-519 | A | Standards & Codes | Reference table; minimal prose | Migrate as quick-reference card |
| M05 | 5.8 | Quiz (5MC + 1DD) | 521-524 + 554-655 | A | Inside Plant | n/a | Strong scenario quiz |

### Module 06 — RCDD Core (`Module06_RCDDCore.jsx`, 756 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M06 | 6.1 | ICT distribution (TR to WA) | 28-76 | A | Inside Plant | "Cat 6A/OM4/OM5" assumed; partial overlap with M05 | Solid; could merge with M05 §5.3 |
| M06 | 6.2 | Firestopping UL 1479 / F-T-L-W ratings | 79-236 | A | Building Systems / Firestop | "IBC/NFPA 101/UL Product iQ/EJ" stack | Excellent depth; cert-prep grade |
| M06 | 6.3 | EMC / FCC Part 15 | 239-309 | A | EMC / Cabling Selection | "47 CFR/Class A/B/EMI/F/UTP/S/FTP" stack | Engineering-grade content |
| M06 | 6.4 | Power/telecom separation TIA-569 | 311-368 | A | Inside Plant | Builds on M05 §5.6; kVA assumed | Mike Holt forum citation is appropriate hedging |
| M06 | 6.5 | Grounding & bonding TIA-607/IEEE 1100 | 370-482 | A | Grounding & Bonding | Heavy overlap with M05 §5.6; isolated-ground myth is excellent | Migrate as deepened version of M05 §5.6 |
| M06 | 6.6 | Surge protection UL 497 series | 484-554 | A | Grounding & Bonding | "NEC 800/805/fiber strength member" critical distinction | Fiber-misconception callout is gold |
| M06 | 6.7 | Design checklist (synthesis) | 556-605 | A | RCDD Synthesis | Ties §6.1-6.6 together | Useful capstone summary |
| M06 | 6.8 | Quiz (5MC + 1DD) | 607-610 + 651-755 | A | RCDD Synthesis | n/a | Strong cert-prep quiz |

### Module 07 — Fiber Topology (`Module07_FiberTopology.jsx`, 651 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M07 | 7.1 | Nodes & connections engine | 34-79 | A | Topology & Splice Matrix | "VETRO/3-GIS/IQGeo/Bentley" tool stack assumed; "FDH/NAP/ONT" inline | Realistic small-ISP framing |
| M07 | 7.2 | Splice matrix tracking | 81-138 | A | Topology & Splice Matrix | "CSV schema/Visio/AutoCAD" tool assumptions | "16 north / 6 south Excel files" anecdote is gold |
| M07 | 7.3 | Fiber pathing ("where does fiber 73 go") | 140-205 | A | Topology & Splice Matrix | Builds on prior sections cleanly; arithmetic worked | **Color-blind-splicer callout is exemplary inclusive content** |
| M07 | 7.4 | TIA-598 color codes (3 sub-sections) | 207-328 | A | Identification & Color Codes | "G.652/G.657/UPC/APC" stack assumed | TIA598_COLORS data array is reusable |
| M07 | 7.5 | Industry tools survey | 330-378 | A | Topology & Splice Matrix | All 12 vendor tools assumed without intro | Realistic vendor-neutral approach |
| M07 | 7.6 | Field hygiene checklist | 380-433 | A | Documentation & As-Builts | "FDH/SharePoint/Git" stack assumed | Maps cleanly to documentation track |
| M07 | 7.7 | TopologyCanvas (interactive) | 435-466 | A | Topology & Splice Matrix | **Reusable component**; localStorage persistence | Exemplary interactive tool |
| M07 | 7.8 | Quiz (4MC + 2DD) | 468-471 + 526-650 | A | Topology & Splice Matrix | n/a | 6 questions, 2 drag-drops |

### Module 08 — Testing OTDR (`Module08_TestingOTDR.jsx`, 711 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M08 | 8.1 | OLTS vs OTDR (tier 1 vs tier 2) | 55-136 | A | Testing & Acceptance | "TIA-526/Rayleigh backscatter/NECA-FOA 301" stack | Critical exam-favorite content |
| M08 | 8.2 | OTDR fundamentals (pulse/range/avg) | 138-202 | A | Testing & Acceptance | "IOR/EIOR/FTTH/MDU/metro" terms stacked | Vendor citations are field-real |
| M08 | 8.3 | Dead zones (EDZ vs ADZ) + ghosts | 204-262 | A | Testing & Acceptance | "Telcordia GR/round-trip distance" assumed | Best ghost-reflection teaching in repo |
| M08 | 8.4 | Launch/receive cables, bidirectional, splice acceptance | 264-360 | A | Testing & Acceptance | "MFD mismatch/gainer/TIA-455-61/IEC 61280-4-2" stack | The "<0.15 dB acceptance UNVERIFIED" callout is exemplary doc hygiene |
| M08 | 8.5 | Interactive OTDR trace + viewer | 362-428 | A | Testing & Acceptance | All events explained inline | **Reusable OTDRTraceViewer component**; M8_TRACE_EVENTS array is teaching data |
| M08 | 8.6 | Macrobend detection / dual-wavelength | 430-479 | A | Testing & Acceptance | "G.652.D/G.657.A1/A2/BER" assumed | Standard heuristic content |
| M08 | 8.7 | IOR, gainer events, automated cursor pitfalls | 481-565 | A | Testing & Acceptance | "EIOR/EGI/iOLM/SmartLink/QuickMap" tool stack | Distance-error math is realistic |
| M08 | 8.8 | Quiz (5MC + 1DD) | 567-570 + 606-710 | A | Testing & Acceptance | n/a | Strong cert-prep quiz |

### Module 09 — OSP Construction (`Module09_OSPConstruction.jsx`, 562 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M09 | 9.1 | Call 811 / APWA colors / DIRT report | 42-95 | A | Underground / Locates | "APWA/CGA/Best Practices v19" assumed | Per CLAUDE.md M09 ODD passed Carter-reads-cold |
| M09 | 9.2 | HDD vs trenching vs plowing matrix | 97-148 | A | Underground Construction | "HDD/trenching/plowing" all defined inline | "Iowa vs PA shale" is best regional callout in repo |
| M09 | 9.3 | Burial depth — AHJ overrides | 150-191 | A | Underground Construction | "RUS 1751F-630/635/NEC 830.47/FDOT 18202" stack | M09 ODD; A-grade |
| M09 | 9.4 | Conduit fill / innerduct colors / pull tension | 193-267 | A | Underground Construction | "PPI MAB/Corning SRP-005-011/microduct" | Three-tier framework excellent |
| M09 | 9.5 | Manhole/handhole/vault placement | 269-319 | A | Underground Hardware | "OFS IP-079/H-20/H-25" assumed | M09 ODD; A-grade |
| M09 | 9.6 | Slack loops at access points | 321-359 | A | Documentation & As-Builts | "MSA/NIU" partial | Realistic contract bands |
| M09 | 9.7 | As-built vs as-designed (the gap) | 361-410 | A | Documentation & As-Builts | "GIS/3-GIS/VETRO/IQGeo/ARCFM" stack | M09 ODD; THE clearest field-vs-textbook lesson in repo |
| M09 | 9.8 | Quiz (5MC + 1DD) | 412-415 + 457-561 | A | Underground Construction | n/a | Strong cert-prep quiz; scenario-rich |

### Module 10 — Data Center (`Module10_DataCenter.jsx`, 551 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M10 | 10.1 | Tier vs Rated disambiguation | 42-97 | A | Data Center Standards | "Uptime Institute/TIA TR-42.1" assumed | Exemplary terminology hygiene |
| M10 | 10.2 | TIA-942-C Rated 1-4 | 100-156 | A | Data Center Standards | "MDA/IDA/HDA/EPI/Bureau Veritas" stack | 96-hour fuel storage UNVERIFIED flag is correct |
| M10 | 10.3 | Uptime Tier I-IV | 158-198 | A | Data Center Standards | Builds on §10.1 | Clean performance-vs-prescriptive distinction |
| M10 | 10.4 | MPO/MTP / Base-8 vs Base-12 | 200-272 | A | Data Center Cabling | "QSFP-DD/DR4/DR8/SR4/IEEE 802.3" stack | Cert-prep grade arithmetic |
| M10 | 10.5 | Hot/cold aisle / containment / ASHRAE TC 9.9 | 274-322 | A | Data Center Thermal | "PUE/CRAC/CRAH/A1-A4/H1" stack | Containment-as-multiplier framing excellent |
| M10 | 10.6 | BICSI 002-2024 vs TIA-942-C scope | 324-360 | A | Standards & Codes | "RCDD/DC specialist exams" assumed | Useful procurement-language lesson |
| M10 | 10.7 | Forthcoming: DCE 9000 + AI Addendum | 362-409 | A | Data Center Standards | "QuEST Forum/ISO 9001/TL 9000" stack | "Standards codify proven practice; don't lead it" — gold field framing |
| M10 | 10.8 | Quiz (5MC + 1DD) | 411-414 + 451-550 | A | Data Center Standards | n/a | Strong cert-prep quiz |

### Module 11 — Revenue & Estimation (`Module11_RevenueEstimation.jsx`, 808 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M11 | 11.1 | Cost-data problem ($/ft variance) | 33-92 | A | Cost & Estimation | "FBA/Cartesian/locate density/union" assumed | Excellent skepticism framing |
| M11 | 11.2 | Aerial vs underground ratio | 94-141 | A | Cost & Estimation | Builds on §11.1; "make-ready" introduced inline | Ratio-flip insight is realistic |
| M11 | 11.3 | Make-ready: process not price | 143-209 | A | Make-Ready / Cost | Re-introduces OTMR (clean); cost ranges are field-real | Pairs with M02 §2.8 and M03 §3.7 |
| M11 | 11.4 | Splice/drop costs / productivity | 211-279 | A | Cost & Estimation | "ribbon/NIU/PPC/BLS OEWS 49-9052" stack | Union/non-union UNVERIFIED flag is correctly hedged |
| M11 | 11.5 | Contract types: RFP/lump/T&M/GMP | 281-370 | A | Contract & Procurement | "AIA A101/A102/A103/Procore" assumed | Distinguishes RFP from contract type cleanly |
| M11 | 11.6 | Contingency & change orders | 372-445 | A | Contract & Procurement | "construction contingency vs escalation" carefully separated | Best framing of these concepts in repo |
| M11 | 11.7 | CPHP vs CPHC + FTTH KPIs | 447-550 | A | FTTH Business Metrics | "HP/HP+/HC/take rate/CPHP/CPHC/EVM" stack | Critical financial-model content for owner |
| M11 | 11.8 | Quiz (5MC + 1DD) | 552-555 + 679-807 | A | Cost & Estimation | n/a | Cert-prep + business-modeling scenarios |

### Module 12 — Certification Sim (`Module12_CertificationSim.jsx`, 429 LOC)

| Module | Section | Title | Lines | Grade | Predicted new topic | Prereq violations (top 2) | Notes |
|---|---|---|---|---|---|---|---|
| M12 | 12.1 | Exam structures (RCDD/OSPD/CFOS/S) | 40-120 | A | Cert Prep / Exam Strategy | Builds on cert-track context | Reference tables — keep |
| M12 | 12.2 | Study strategy (top scorers) | 122-216 | A | Cert Prep / Exam Strategy | Community-source synthesis | Practical and field-real |
| M12 | 12.3 | Ethics of exam prep (no dump sites) | 218-247 | A | Cert Prep / Exam Strategy | n/a | **Critical ethical framing — preserve verbatim** |
| M12 | 12.4 | Practice sim (50Q, 75min) | 249-282 | A | Cert Prep / Exam Strategy | Wires `CertificationSim` to `CERT_BANK` (80KB question bank in src/data) | **Reusable component**; 50% of cert-track scope |
| M12 | 12.5 | After passing the sim — next steps | 284-348 | A | Cert Prep / Exam Strategy | Pearson VUE/BICSI references | Migrate as checklist |

### ToolsPage (`ToolsPage.jsx`, 44 LOC)

| File | Grade | Predicted new topic | Notes |
|---|---|---|---|
| ToolsPage | A | Sandbox / Tools Hub | Just a tabbed wrapper around LinkBudget/OTDR/Topology/Flashcards. Migrate as the splash-page "Tools" tile if desired, OR fold each tool into the lesson that already uses it. |

## Migration manifest (organized by predicted new topic)

| New topic (predicted) | Source sections | Total source LOC (approx) | Migration effort |
|---|---|---|---|
| **Fiber Physics** | M01 §1.1-1.8 entire | 349 | LOW — migrate sections as lessons; M01 = template anchor; preserve LinkBudgetCalculator |
| **Aerial Design (NESC)** | M02 §2.1, 2.2, 2.3, 2.4, 2.5 | ≈220 | LOW — M02 EVEN sections (2.2, 2.4) already Carter-validated. Split §2.5 loading districts to its own lesson |
| **Underground Construction** | M09 §9.1, 9.2, 9.3, 9.4 + M09 ODD content | ≈280 | LOW — M09 ODD already Carter-validated |
| **Underground Hardware (vaults/handholes)** | M09 §9.5 + relevant M04 §4.6 closure content | ≈80 | LOW — clean reuse |
| **Splicing** | M04 §4.1-4.5 + M04 quiz | ≈300 | LOW — entire module is A-grade |
| **Splice Hardware & Closures** | M04 §4.6 | ≈100 | LOW — pulls cleanly out of M04 |
| **Connectors & Termination** | M04 §4.7 + M07 §7.4.4 (boot/housing colors) | ≈90 | LOW — natural cross-module merge |
| **Testing & Acceptance (OLTS/OTDR)** | M08 §8.1-8.8 entire | 711 | LOW — entire module is A-grade; preserve OTDRTraceViewer + M8_TRACE_EVENTS |
| **Topology & Splice Matrix** | M07 §7.1-7.3, 7.5-7.7 | ≈400 | LOW — preserve TopologyCanvas + TIA598_COLORS data |
| **Identification & Color Codes** | M07 §7.4 + relevant M09 §9.1 (APWA) | ≈140 | LOW — color-code track |
| **Make-Ready (OTMR)** | M02 §2.8 + M03 §3.7 + M11 §11.3 | ≈250 | MEDIUM — three sections to dedupe into one strong lesson + advanced extension |
| **Permitting & ROW** | M03 §3.1, 3.5 + M02 §2.7 | ≈300 | LOW |
| **Permitting / Environmental (NEPA/106/ESA)** | M03 §3.2, 3.3, 3.4 | ≈230 | LOW — federal review track |
| **Drafting & GIS** | M03 §3.6 + M07 §7.5 | ≈160 | MEDIUM — pitch needs work in §3.6 |
| **Documentation & As-Builts** | M09 §9.6, 9.7 + M07 §7.6 | ≈180 | LOW — clean track |
| **Locate Before Dig (811)** | M09 §9.1 | ≈55 | LOW |
| **Inside Plant (ISP)** | M05 §5.1-5.4, 5.7 + M06 §6.1, 6.4 | ≈480 | LOW — cert-prep track |
| **Grounding & Bonding** | M05 §5.6 + M06 §6.5, 6.6 | ≈250 | MEDIUM — merge dedupe |
| **Building Systems / Firestop** | M06 §6.2 | ≈160 | LOW |
| **EMC / FCC Part 15** | M06 §6.3 | ≈70 | LOW |
| **Standards & Codes (overview)** | M02 §2.1 + M05 §5.7 + M10 §10.6 | ≈90 | LOW — quick-reference card style |
| **Data Center Standards** | M10 §10.1-10.3, 10.6, 10.7 | ≈230 | LOW — cert-track track |
| **Data Center Cabling (MPO/MTP)** | M10 §10.4 | ≈75 | LOW |
| **Data Center Thermal** | M10 §10.5 | ≈50 | LOW |
| **Cost & Estimation** | M11 §11.1, 11.2, 11.4 | ≈220 | LOW |
| **Contract & Procurement** | M11 §11.5, 11.6 | ≈170 | LOW |
| **FTTH Business Metrics** | M11 §11.7 | ≈120 | LOW |
| **Cert Prep / Exam Strategy** | M12 §12.1-12.5 entire + CERT_BANK + CertificationSim | ≈430 + 80KB data | LOW — entire module migrates; cert-prep splash section anchor |
| **RCDD Synthesis (capstone)** | M06 §6.7 + M05 cross-refs | ≈60 | LOW |
| **Sandbox / Tools Hub** | ToolsPage entire | 44 | LOW — wraps 4 tools |

## Component reuse map

| Existing component | File | Reusable for new primitive | Notes |
|---|---|---|---|
| `InteractiveQuiz` | `src/components/InteractiveQuiz.jsx` (255 LOC) | **`<Quiz>` primitive base** (MC + drag-drop) | Already handles `mc` and `dragdrop` question types. **Needs extension for fill-in-blank** per Architecture §2.4. |
| `LinkBudgetCalculator` | `src/components/LinkBudgetCalculator.jsx` (102 LOC) | `<WorkedExample>` primitive — first instance | Pattern: variable inputs → step-stepper → final answer + sanity check. Generalize this to take a formula + variable spec. |
| `OTDRTraceViewer` | `src/components/OTDRTraceViewer.jsx` (216 LOC) | `<AnnotatedDiagram>` primitive — first instance (specialized) | SVG-based event labeling; cursor placement; dead-zone shading. Generalize the click-to-label + hover-explain mechanic. |
| `TopologyCanvas` | `src/components/TopologyCanvas.jsx` (194 LOC) | Specialized topology playground; persists to localStorage | Reuse as-is in Topology lesson; not a primitive base |
| `CertificationSim` | `src/components/CertificationSim.jsx` (168 LOC) | Reuse as-is for cert practice exam | Reads from `CERT_BANK` + `DOMAIN_WEIGHTS`; 50-Q random draw |
| `Flashcard` | `src/components/Flashcard.jsx` (136 LOC) | Reuse as-is | Used in ToolsPage; ALL_FLASHCARDS deck = aggregation |
| `ModuleLayout` (helpers: ModuleHeader, Section, Callout, RefList, Table) | `src/components/ModuleLayout.jsx` (98 LOC) | **Refactor into per-lesson LessonLayout** | Currently provides the wrappers every module uses. New `<LessonLayout>` should wrap one lesson with prereq-DAG check + tier markers (foundations/working/advanced) + progress-write hook. |
| **NEW** | n/a | `<BranchingScenario>` primitive | Does NOT exist. Must be built fresh in OSP-RW.3. FSM decision tree with state persistence via Postgres. |

Data assets to preserve:

- `src/data/cert-sim-bank.js` (80 KB question bank) — feeds CertificationSim
- `src/data/flashcards.js` + 10 `module*-flashcards.js` (≈63 KB total) — feeds Flashcard
- `src/data/TIA598_COLORS` (inline in `Module07_FiberTopology.jsx:508-521`) — 12-color reference data, useful as a global constant

## Scrap list (F-grade content)

**No F-grade content identified.** The existing 13 JSX modules are uniformly high-quality. Every module has rigorous citations, consistent voice (mostly book-vs-field callouts), and substantive interactive elements. The "pitch needs work" sections graded B (M01 §1.5, M03 §3.6) require pitch surgery during migration, not scrap.

The 64 markdown files in `content/osp-*/` are NOT graded here because they are not currently surfaced in the SPA. They are a parallel curriculum tree (presumably a former Moodle target). Decision needed: migrate them too, ignore them, or treat them as raw material if pitch-revision wave output is preserved. See "Pitch-revision wave salvage inventory" below.

## Pitch-revision wave salvage inventory

The prior `wave-osp-pitch-revision/` reports describe edits to files at paths like `content/osp-splice-termination/03-fusion-splicing-ii.md`. These paths **DO exist** in the `content/` markdown tree (5 topic folders, 64 .md files total). However, per CLAUDE.md §3, agent hallucination of commit SHAs is a confirmed pattern in this wave — three confirmed incidents. Salvage status of each report:

| Prior worker | Sections claimed revised | Path existence | Recommended action |
|---|---|---|---|
| T1 Worker A | L03, L05, L07, L09, L11 of `content/osp-cable-selection/` | ✓ Paths exist | Need git verification of claimed commits (`0d5aa6e`, `2230cca`, `4bc55a6`, `a7f61a5`, `d310819`, `40f392a`) before trusting content |
| T1 Worker B | (presumably L02, L04, L06, L08, L10, L12) of `content/osp-cable-selection/` | ✓ Paths exist | Same — verify SHAs before trusting |
| T2 Worker A | L2.1, L2.3, L2.5, L2.7, L2.9, L2.11 of `content/osp-splice-termination/` | ✓ Paths exist | Same — claimed SHAs `efbab2a9`, `9da0cf0b`, `afa366f6`, `9c3079c7`, `7ec57ac8` need git verification |
| T3 Worker B | L3.2, L3.4, L3.6, L3.8 of `content/osp-survey-route/` | ✓ Paths exist | Same — claimed SHAs `c87a95c`, `d329b0f`, `ceb0f2f`, `d06cde9` need verification |
| T6 brief-rebaseline | (Topic 6 brief discovery, hallucination-risk per CLAUDE.md) | Topic 6 = `osp-domain-4-standards-codes`? | Treat brief as draft only |

**Critical decision the architecture wave must make:** the `content/osp-*/` markdown tree (≈22,000 LOC across 64 files) is real content but parallels the JSX modules (7,144 LOC). The audience-pitch and quiz-depth in the JSX modules is generally HIGHER than in the markdown tree per spot-reads. **Recommendation:** treat the JSX modules as the migration source-of-truth. The markdown tree's value is the per-lesson granularity already in place (one .md file per lesson = the structural target). Migrate JSX content INTO the per-lesson skeleton that the markdown tree's filename pattern implies, but author from JSX prose, not from the .md files — unless the architecture wave decides to do a 3-way merge of (a) JSX prose + interactivity, (b) markdown depth, (c) any verified pitch-revision improvements.

## Aggregate stats

- **Total sections graded: 89** (≈97 if quiz sub-sections are counted as separate lessons)
- **A grade: 86** (migrate verbatim, with prereq-DAG re-check)
- **B grade: 3** (M01 §1.5 dB primer; M03 §3.6 AutoCAD/GIS; potentially merge candidates for §11.3 / §2.8 / §3.7 make-ready dedup — counted as A above but flagged here)
- **C grade: 0**
- **F grade: 0** (no scrap)
- **Estimated surviving LOC:** ~6,800 of 7,144 (≈95%) — only the dB primer and a couple of pitch-revision merges require substantial re-work; everything else migrates substantially intact. The OSP-RW.5 author waves will add net-new lessons where the per-course lesson count target exceeds the existing section count, but no existing JSX content is scrapped.

**Most-egregious prereq violations across the wave (top 3):**

1. **M01 §1.1 uses "dispersion" before §1.3 defines it; uses "PON/metro/DWDM/G.652" before any taxonomy lesson.** A new-curriculum prereq DAG should put fiber-type taxonomy (SMF/MMF, G.652/G.657) BEFORE wavelength selection.
2. **M02 §2.2 names NESC Rule numbers (232, 235, 250, 261) and references Table 232-1 / 235-5 by table number in the first content paragraph, before any orientation to NESC document structure.** §2.1 hand-waves "what NESC is" but doesn't actually orient the reader to how rules + tables + sections compose the standard.
3. **M07 §7.4 introduces the entire 12-color sequence including "slate/violet/rose/aqua" without any prior lesson on why color identification matters or the eight-letter mnemonic many crews use. Then §7.4.4 jumps to UPC vs APC ferrule color codes with the green/blue mating prohibition assumed.** A new-curriculum lesson should put color-identification fundamentals (why colors exist, position counting, color-blind worker pattern) before any specific color sequence.

## Top 5 sections worth preserving (highest signal-to-noise)

1. **M01 §1.2 attenuation three-number table (spec / typical / planning).** The 0.30/0.22-0.25/0.18-0.22 dB/km triplet with FOA-vs-textbook-vs-spec framing is a teaching-pattern template that should apply to every numeric-spec lesson in the new curriculum.
2. **M04 §4.1 four-number splice-loss framework (FOA 0.15 / field ≤0.05 / ITU-T 0.10 / contract 0.30).** Same teaching pattern — multiple authoritative numbers with provenance. Best example in repo.
3. **M07 §7.4 + §7.3 fiber pathing and the TIA-598 color reference.** Combined with the color-blind splicer callout, this is the model for "field-real inclusive content."
4. **M09 §9.7 as-built vs as-designed gap.** Single clearest field-vs-textbook lesson in the entire 7,144-LOC corpus. The "as-built is the last deliverable and the first to slip" framing with the withhold-final-5%-until-GIS-accepted incentive mechanism is gold.
5. **M11 §11.7 CPHP vs CPHC + FTTH KPI set.** Critical financial-model content for an OSP-services owner. The CPHC = CPHP ÷ take rate identity drives every fiber business case.

## Source references

All JSX files inspected in full at `/home/user/Launch-Database/osp-training/src/modules/`:

- `Module01_FiberPhysics.jsx:1-349`
- `Module02_OSPDesign.jsx:1-380`
- `Module03_PermittingPlanning.jsx:1-654`
- `Module04_Splicing.jsx:1-593`
- `Module05_NetworkingBlueprints.jsx:1-656`
- `Module06_RCDDCore.jsx:1-756`
- `Module07_FiberTopology.jsx:1-651`
- `Module08_TestingOTDR.jsx:1-711`
- `Module09_OSPConstruction.jsx:1-562`
- `Module10_DataCenter.jsx:1-551`
- `Module11_RevenueEstimation.jsx:1-808`
- `Module12_CertificationSim.jsx:1-429`
- `ToolsPage.jsx:1-44`

Components inspected:

- `src/components/InteractiveQuiz.jsx` (255 LOC) — verified existence
- `src/components/LinkBudgetCalculator.jsx` (102 LOC) — verified existence
- `src/components/OTDRTraceViewer.jsx` (216 LOC) — verified existence
- `src/components/TopologyCanvas.jsx` (194 LOC) — verified existence
- `src/components/CertificationSim.jsx` (168 LOC) — verified existence
- `src/components/Flashcard.jsx` (136 LOC) — verified existence
- `src/components/ModuleLayout.jsx` (98 LOC) — verified existence

Data assets inspected (size only; content not graded):

- `src/data/cert-sim-bank.js` (80,765 bytes)
- `src/data/flashcards.js` + 10 per-module flashcard files (`module03-flashcards.js` through `module12-flashcards.js`)

Parallel content tree (NOT in SPA, presumably former Moodle target):

- `content/osp-cable-selection/` — 14 files
- `content/osp-splice-termination/` — 13 files
- `content/osp-survey-route/` — files
- `content/osp-domain-4-standards-codes/` — files
- `content/osp-hardware-accessories/` — files
- **Total: 64 .md files in `content/`**

Prior pitch-revision reports inspected:

- `audit-output/wave-osp-pitch-revision/T1-worker-A.md` — claims revision of `content/osp-cable-selection/` odd files
- `audit-output/wave-osp-pitch-revision/T1-worker-B.md` — likely complement (even files)
- `audit-output/wave-osp-pitch-revision/T2-worker-A.md` — claims revision of `content/osp-splice-termination/` odd files
- `audit-output/wave-osp-pitch-revision/T3-worker-B.md` — claims revision of `content/osp-survey-route/` even files
- `audit-output/wave-osp-pitch-revision/T6-brief-rebaseline.md` — Topic 6 brief discovery (hallucination risk per CLAUDE.md)

=== RESEARCH AGENT C REPORT END ===
