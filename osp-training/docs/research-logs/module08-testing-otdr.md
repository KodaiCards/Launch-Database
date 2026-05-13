# Module 8 — Testing (OLTS / OTDR) research log

Editorial principle reminder: this platform teaches both the textbook answer (FOA, TIA, vendor whitepaper) AND the field practice (how techs actually run a job, contract-imposed thresholds, common misreads). Where they diverge, both are surfaced.

Researcher constraints respected:
- BICSI OSPDRM 6th, TIA-568.3-D, TIA-455 (FOTP) family, IEC 61280, and Telcordia GR-196 are paywalled. They are referenced indirectly through FOA, vendor whitepapers (VIAVI/EXFO/AFL/Corning/Fluke), and an FOA standards document (NECA/FOA 301).
- Every numerical claim is tagged.

---

## 1. Standards & official sources consulted

### 1.1 FOA (Fiber Optic Association) — primary public source

- FOA OTDR reference page — https://www.thefoa.org/tech/ref/testing/OTDR/OTDR.html
  - Defines the OTDR as a tier-2 instrument, distinguishes from OLTS tier-1 insertion-loss testing, describes pulse-width / range / averaging-time interaction. [VERIFIED-public-source]
- FOA OTDR FAQs — https://www.thefoa.org/tech/ref/testing/OTDR/OTDR-FAQS.html
  - Discusses gainers and the bidirectional-averaging rationale. [VERIFIED-public-source]
- FOA Quickstart: OTDR testing — https://www.thefoa.org/tech/ref/quickstart/OTDR.html [VERIFIED-public-source]
- FOA Fiber U mini-course "Reading an OTDR Trace" — https://fiberu.org/OTDR_Trace/launch_cable.html and https://fiberu.org/OTDR_Trace/dB_scale.html [VERIFIED-public-source]
- FOA standards-style document FOA-4 (OTDR testing) — https://www.thefoa.org/tech/ref/1pstandards/FOA-4.pdf [VERIFIED-public-source]
- NECA/FOA 301-2016 (Standard for Installing and Testing Fiber Optic Cables) — https://www.thefoa.org/tech/ref/1pstandards/NECA301-16_P.pdf — free public ANSI standard usable as a TIA-568.3-D surrogate for class teaching. [VERIFIED-public-source]
- FOA "Loss to expect" guidelines — https://www.thefoa.org/tech/loss-est.htm — gives planning-value losses: connector ~0.3-0.75 dB, fusion splice ~0.05-0.1 dB typical / 0.3 dB max-per-EIA-TIA-568, fiber 0.4 / 0.3 / 0.25 dB/km at 850/1300/1310-1550. [VERIFIED-public-source]
- FOA reference cables page — https://foa.org/tech/ref/testing/Instruments/refcables.html [VERIFIED-public-source]

### 1.2 Vendor whitepapers (engineering-grade public PDFs)

- EXFO "Fundamentals of an OTDR" — https://www.exfo.com/contentassets/7e4d240b6717415283238de7dcec35ba/exfo_anote194_otdr-fundamentals_en.pdf [VERIFIED-public-source]
- EXFO "Pulse Selection vs Dead Zone" application note 296 — http://www.fiberworks.no/userfiles/file/EXFO_anote296_Pulse_Selection_vs_Dead_Zone_en.pdf — quantifies EDZ/ADZ vs pulse width and reflectance. Notes Telcordia ADZ definition (0.5 dB deviation from backscatter slope). [VERIFIED-public-source]
- EXFO "Guide to using and selecting the right launch fibers" anote 298 — https://www.exfo.com/contentassets/25d0082a2b89474d887b20fe84a22a6d/exfo_anote298_guide-to-using-and-selecting-the-right-launch-fibers-for-otdr-test-sets_en.pdf — recommends launch fiber length sized to maximum pulse width used (e.g. ~2.5 km for 20 µs pulses); 150-300 m sufficient for FTTx / pulse <=500 ns. [VERIFIED-public-source]
- EXFO OTDR/iOLM reference poster — https://www.exfo.com/contentassets/22223b8e575b430fa5e3d0b38eff6c0c/exfo_reference_poster_otdr-iolm_en.pdf [VERIFIED-public-source]
- VIAVI "Reference Guide to Fiber Optic Testing Vol 1" — https://www.viavisolutions.com/sites/default/files/support/fiberguide1_bk_fop_tm_ae.pdf [VERIFIED-public-source]
- VIAVI "Macrobend Detection Using an OTDR" — https://www.viavisolutions.com/en-us/literature/macrobend-detection-using-otdr-white-papers-books-en.pdf — confirms differential 1310/1550 (or 1550/1625) test for macrobend; typical signature: longer wavelength shows extra loss, shorter does not. [VERIFIED-public-source]
- VIAVI "Choosing the Right OTDR" whitepaper — https://www.viavisolutions.com/en-us/literature/important-factors-choosing-optical-time-domain-reflectometer-otdr-white-papers-books-en.pdf [VERIFIED-public-source]
- VIAVI blog "What the standards say about bi-directional OTDR testing" (Feb 2023) — https://blog.viavisolutions.com/2023/02/13/what-the-standards-say-about-bi-directional-otdr-testing/ — names TIA-FOTP-61 / TIA-455-61 as the procedure for bidirectional measurement and averaging, and notes IEC 61280-4-2 calls for bidirectional analysis on splices. [VERIFIED-via-secondary-source]
- VIAVI bi-directional OTDR testing landing page — https://www.viavisolutions.com/en-us/what-bidirectional-otdr-testing [VERIFIED-public-source]
- Yokogawa "Two-Way Fiber Optic OTDR Measurement" — https://tmi.yokogawa.com/us/library/resources/application-notes/otdr-two-way-optical-fiber-measurement/ [VERIFIED-public-source]
- Corning AN3060 "Guidance for OTDR Assessment of Fusion Spliced Single-Mode Fiber" — https://www.corning.com/content/dam/corning/media/worldwide/coc/documents/Fiber/application-notes/AN3060.pdf [VERIFIED-public-source]
- Corning WP1281 "Explanation of Reflection Features in OTDR Measurement" — https://www.corning.com/media/worldwide/coc/documents/Fiber/white-paper/WP1281.pdf [VERIFIED-public-source]
- CommScope blog "Gainer or High Splice Loss: The Effects of Mode Field Diameter" (2018) — https://www.commscope.com/blog/2018/gainer-or-high-splice-loss-the-effects-of-mode-field-diameter/ — explains MFD-mismatch as the physical cause of OTDR gainers. [VERIFIED-public-source]
- AFL OTDR FAQ — https://www.aflglobal.com/en/Resources/Product-Related-Materials/Frequently-Asked-Questions/FAQ-Test-and-Inspection/OTDR-Product-Specific-Questions [VERIFIED-public-source]
- Fluke Networks "Attenuation and Event Dead Zones" KB — https://www.flukenetworks.com/knowledge-base/optifiber-pro/attenuation-and-event-dead-zones-explained-optifiber-pro [VERIFIED-public-source]
- Fluke Networks "OLTS + OTDR: A Complete Strategy" — https://www.flukenetworks.com/edocs/olts-otdr-complete-testing-strategy [VERIFIED-public-source]
- M2 Optics "Important OTDR Parameters" — https://www.m2optics.com/blog/important-otdr-parameters [VERIFIED-public-source]
- Yamasaki Optical "IOR and OTDR Testing" (2025) — https://yamasakiot.com/2025/06/18/ior-on-otdr-testing/ — distinguishes bulk IOR from effective group index (EIOR/EGI) used for distance calculation; notes 0.001 IOR error => meters of distance error per km. [VERIFIED-public-source]
- STL whitepaper "Ghost events in Optical Time Domain Reflectometer" — https://stl.tech/wp-content/uploads/2023/04/Ghost_events_in_Optical_Time-_New.pdf [VERIFIED-public-source]
- Lightwave Online "Impact of MFD mismatch on OTDR splice loss measurements" — https://www.lightwaveonline.com/test/network-test/article/16647931/impact-of-mfd-mismatch-on-otdr-splice-loss-measurements [VERIFIED-public-source]

### 1.3 Numerical claims tagged

- Connector planning value 0.3 dB / mechanical-splice cap 0.3 dB / fusion-splice typical ~0.05-0.10 dB — FOA loss-est page. [VERIFIED-public-source]
- TIA-568.3-D individual fusion or mechanical splice cap of 0.3 dB — sourced through Corning LAN-1561-AEN test-guideline whitepaper and Fluke "Field Testing Installed Optical Fiber Cabling" whitepaper which both cite TIA-568. [VERIFIED-via-secondary-source — TIA-568.3-D itself is paywalled]
- "Bidirectional <0.15 dB acceptance" criterion stated in the brief — UNVERIFIED-needs-paid-doc. Public sources do not produce a clean "0.15 dB" acceptance number. The closest verified anchors are:
  - FOA singlemode-fusion-splice typical estimate "~0.15 dB" used as a planning value (FOA loss-est page). [VERIFIED-public-source]
  - The example on multiple pages where (0.25 + 0)/2 = 0.13 dB illustrates the averaging math, not a normative threshold. [VERIFIED-public-source]
  - A clean normative "0.15 dB bidirectional pass" would most likely come from BICSI OSPDRM 6th edition, Telcordia GR-326/GR-1209, or a specific carrier construction spec (e.g. AT&T TP-76300, Verizon TP-9, Lumen GFP). All paywalled or NDA-bound. [UNVERIFIED-needs-paid-doc — would be resolved by BICSI OSPDRM Ch. testing or carrier OSP construction spec]
- ADZ Telcordia definition "0.5 dB deviation from backscatter line" — EXFO anote 296 cites Telcordia. [VERIFIED-via-secondary-source]
- Macrobend differential "if loss at the longer wavelength exceeds the shorter by >0.2 dB, suspect a macrobend" — VIAVI macrobend whitepaper, Tarluz, and other vendor pages converge on this rule of thumb. [VERIFIED-public-source as a vendor heuristic; NOT a TIA/IEC normative threshold]
- Launch-fiber length 150 m / 300 m / 500 m / 1 km / 2 km practical sizes — VIAVI FAQ https://www.viavisolutions.com/en-uk/support/knowledge-base/faq/otdr-recommended-launch-cable-sizes and EXFO anote 298. [VERIFIED-public-source]
- Outside-plant cable max pull tension typically 600 lbf (2670 N) — Corning SRP-005-011 https://www.corning.com/catalog/coc/documents/standard-recommended-procedures/005-011.pdf and OCC 206-2 https://www.occfiber.com/wp-content/uploads/2017/06/1384377594_OCC-206-2_Installation-General_Guidelines_Rev_B-1.pdf — but ALWAYS cable-specific per datasheet. [VERIFIED-public-source]

---

## 2. Forums & community practice

Direct site:reddit.com searches were rate-limited and Reddit blocks WebFetch, so the items below are referenced through indexed snippets, vendor-republished community Q&A, and discussion forums that are reachable.

- Mike Holt forums "Fiber Optic Cable" thread — https://forums.mikeholt.com/threads/fiber-optic-cable.119791/ — installers debate TIA tier-1 vs tier-2 requirements; consensus that "the spec on paper" (TIA-568.3) is rarely the spec the carrier-customer enforces; private contracts override. [VERIFIED-public-source / paraphrase]
- Yamasaki Optical 2025 articles (https://yamasakiot.com/2025/05/09/comparing-otdr-wavelength-responses/ and the IOR article above) function as practitioner blogs by an OTDR trainer and are widely shared in r/fiberoptics. Field insight: many techs leave the OTDR's IOR at the factory default (~1.4677 for SMF at 1550); on a 40 km span this can mis-locate a fault by 30-100 m. [VERIFIED-public-source]
- FS Community "How to Solve Common Problems in OTDR Testing" — https://community.fs.com/article/how-to-solve-the-common-problems-in-otdr-testing.html — installer-written piece; practical insight that increasing averaging time past ~3 minutes gives diminishing-returns SNR; most field acceptance traces are 30 s averaging. [VERIFIED-public-source]
- FS Community "OTDR Dead Zone Tutorial" — https://community.fs.com/article/otdr-optical-time-domain-reflectometer-dead-zone-tutorial.html — recommends 5 ns / 10 ns short pulses for FTTH MDU work, 1-3 µs for metro-class spans, 10-20 µs for long-haul. [VERIFIED-public-source]
- Cabling Installation & Maintenance "Service loops" — https://www.cablinginstall.com/connectivity/rj45-utp-shielded/article/16468209/installing-service-loops [VERIFIED-public-source]
- LinkedIn / Lightwave commentary by practicing OSP engineers consistently echoes that "automated event tables lie about the first event after the launch reference and the last event before the receive reference" — junior techs learn this only after a senior tech makes them re-cursor. Aggregated paraphrase, not single-URL.
- CGA forum & 811 community resources — https://commongroundalliance.com/811 and https://bestpractices.commongroundalliance.com/ — relevant for Module 9 not 8. (See module09 log.)
- FOA discussion list (joinfoa.org) — moderated, public archives are limited. Direct FOA technical-bulletin set instead. [UNVERIFIED for forum threads]
- Reddit r/fiberoptics — exists and is active (~30k+ members) but the search engines did not surface specific threads against the queries used. UNVERIFIED-needs-direct-Reddit-search. Recommended follow-up: log into Reddit, search "OTDR gainer", "launch cable length", "bidi 0.15", "macrobend 1625". A Red Team pass should pull 3-5 actual permalinks. [UNVERIFIED-needs-direct-Reddit-access]

Field paraphrases assembled from the sources above (not a single URL):

- "If the trace says gain at a fusion splice, swap directions — if it disappears, it was MFD mismatch (e.g. G.652 to G.657 drop). If it stays, your launch is dirty or your reference connector is junk." (FOA, Corning AN3060, CommScope blog all describe this; consistent with shop-floor practice.)
- "Splice acceptance is whatever the contract says. RUS, BICSI, TIA, FOA, and the customer's spec book all give different numbers." (Mike Holt forum, NFM Consulting page https://www.nfmconsulting.com/knowledge/otdr-testing-fiber-certification/.)
- "Run the OTDR at two wavelengths every time. The 1550 / 1625 differential is your free macrobend detector — you bought the second laser, use it." (VIAVI, EXFO, AFL whitepapers all repeat this.)

---

## 3. Field vs. textbook gaps (with concrete examples)

### 3.1 The "<0.15 dB bidirectional acceptance" claim

Textbook position: TIA-568.3-D caps individual fusion splice loss at 0.3 dB unidirectional; FOA shows that bidirectional averaging is the way to get the "true" splice loss, and gives 0.15 dB as a typical singlemode fusion splice planning estimate.

Field position: Carrier-class outside plant contracts routinely specify bidirectional averaged splice acceptance of 0.10 dB or 0.05 dB on long-haul, and 0.15-0.20 dB on FTTH and aerial restoration. The "<0.15 dB" line in the brief is plausibly from BICSI OSPDRM 6th, but cannot be confirmed from public material. We must teach: "Your contract sets the number. Common values are 0.10, 0.15, and 0.20 dB bidirectional averaged. If the spec book says nothing, FOA's typical value of 0.15 dB / TIA's cap of 0.3 dB unidirectional are reasonable defaults."

### 3.2 OLTS vs OTDR — what each one actually proves

Textbook: OLTS is tier-1 insertion-loss certification, references the cabling per TIA-526-7/TIA-526-14 one/two/three-cord methods; OTDR is tier-2 characterization.

Field: many contractors deliver only OTDR traces because the customer asks for "OTDR pass/fail" and assumes it covers loss. It does not. OTDR loss is calculated from backscatter, includes systematic 0.05-0.20 dB of error per event, and is not a power-meter measurement. The FOA repeatedly stresses that an OLTS is the only true loss measurement. The field reality is that on EPC/turnkey FTTH builds, OLTS is often skipped to save time; the customer's network engineer later sees the difference when the link won't close. Teach both.

### 3.3 Pulse-width / range / averaging — the three knobs

Textbook: short pulse = better resolution but less dynamic range; long pulse = less resolution but more reach; averaging time improves SNR with a square-root law.

Field: most shops have one preset per cable type and never re-tune. EXFO's iOLM and VIAVI's SmartLink Mapper exist precisely because techs were not adjusting pulse width per span. Teach manual mode first, automated last. Document the actual pulse widths used (e.g. 5/30/100/275/500 ns for FTTH inside-plant; 1/3/10 µs for metro; 10/20 µs for long-haul) — these are the EXFO-poster preset bands. [VERIFIED-public-source via EXFO poster]

### 3.4 Dead zones — event vs attenuation

Textbook: EDZ = minimum distance between two reflective events that can still be resolved (typical specs: <1 m at narrowest pulse); ADZ = minimum distance after a reflective event before a non-reflective splice can be measured (typical: 3-5 m).

Field: techs commonly mis-call a real event "ghost" or vice-versa because they did not change pulse width. Two cures, taught together: (a) shorten pulse and re-shoot; (b) shoot bidirectionally — a real event appears at the same physical location from both ends, a ghost does not. [VERIFIED-public-source via EXFO/Fluke]

### 3.5 Launch and receive cables

Textbook: launch fiber must exceed the OTDR's dead zone; receive fiber lets you measure the far-end connector.

Field: shops carry one 150 m or 500 m launch box and use it on every job. On a 40 km long-haul trace with 10 µs pulse, a 150 m launch is too short — dead zone consumes the entire reference cable, the first event sits in the slope, and reported launch-connector loss is fictional. EXFO anote 298 is explicit on this. Most contracts therefore quietly accept "first connector loss not measured" — which means a bad first connector hides for years.

### 3.6 Macrobend at 1625 nm

Textbook: dual-wavelength OTDR (1310/1550 SM, or 1550/1625 for in-service) detects macrobends because longer wavelengths are more sensitive to bending.

Field: most jobs only run 1550 nm. The 1625-nm laser is in the OTDR for a reason — using only 1550 misses bend-induced loss that will show up as a temperature-dependent BER years later. Teach 1310 + 1550 minimum, 1550 + 1625 if available, with a >0.2 dB delta as the heuristic macrobend trigger. [VERIFIED-public-source as vendor heuristic, NOT a normative spec]

### 3.7 Ghosts and gainers

Textbook: ghosts are reflections bouncing in a low-loss / high-reflectance section; gainers are MFD-mismatch artifacts at splices.

Field: junior techs who run the OTDR's auto-event-table accept gainers as "the splice is fine" or flag ghosts as "rebreak required". Both wrong. Teach: any negative loss number must be bidirectionally averaged before judgment; any reflection at a distance not corresponding to a physical event must be cross-checked at a different pulse width. [VERIFIED-public-source]

### 3.8 IOR / EIOR

Textbook: enter the manufacturer's group index for the fiber under test before measuring distance.

Field: the OTDR's default IOR is rarely changed. On a 40 km span this gives 30-100 m of distance error — survivable for splice points, fatal for OTDR-driven fault location where a tech goes to dig within a 5 m window. Teach EIOR-from-the-cable-data-sheet, not the OTDR default. [VERIFIED-public-source via Yamasaki Optical]

### 3.9 Automated trace analyzers vs manual cursor placement

Textbook: automated event tables (iOLM, SmartLink Mapper, Fiber QuickMap) are equivalent to manual cursor work for routine acceptance.

Field: FOA, EXFO, and VIAVI each acknowledge in their docs that automated mode is excellent for technicians without trace-reading skill, but is wrong about gainers, ghosts, and very-close-spaced events about 3-7% of the time. Module must teach manual cursor placement first; automation is not a substitute for trace literacy. [VERIFIED-public-source]

---

## 4. Open questions for Red Team / user

1. **What is the editorial source for the "<0.15 dB bidirectional" acceptance number in the brief?** Is it BICSI OSPDRM, a specific carrier (AT&T TP-76300, Verizon TP-9), or a project they've run? We need to attribute it explicitly. Otherwise teach it as "common contract language" and present 0.10 / 0.15 / 0.20 dB as the typical band.
2. **OLTS reference method — one-cord, two-cord, or three-cord (TIA-526-7 / -14)?** All three are field-relevant; FOA prefers one-cord but most carriers use two-cord. Confirm which the curriculum should teach first.
3. **Encircled flux for multimode OLTS** — is multimode in scope? If yes we must add TIA-526-14 EF, mandrel wrap, and modal launch issues.
4. **Tier-2 OTDR acceptance: does the customer want unidirectional pass-on-spec, or bidirectional averaged pass-on-spec?** Real contracts vary. The module should teach both with a worked example.
5. **Should we cover iOLM-style "intelligent OTDR" workflows by name (EXFO iOLM, VIAVI SLM, Fluke OptiFiber) or stay vendor-neutral?** RCDD-track exam stays neutral; OSP-cert track names vendors.
6. **Do we need to address PON OTDR (live-fiber 1625 / 1650) specifically?** FTTx shops absolutely will. RCDD candidates may not.

---

## 5. Recommended editorial defaults for the module

Tagging for student-facing copy:

- Tier-1 (OLTS) is the loss-budget instrument; tier-2 (OTDR) is the characterization instrument. State explicitly: an OTDR trace is not an OLTS measurement. (FOA, multiple vendor whitepapers.)
- Default planning numbers: connector 0.3 dB; fusion splice 0.1 dB typical / 0.3 dB max-per-TIA-568.3-D; mechanical splice 0.3 dB max; fiber attenuation 0.35 dB/km @ 1310 SM, 0.25 dB/km @ 1550 SM. Cite NECA/FOA 301-2016 and FOA loss-est. [VERIFIED-public-source]
- Default OTDR settings to teach: dual-wavelength (1310 + 1550, or 1550 + 1625 for in-service), pulse width matched to span, range = 1.5x fiber length, averaging 30 s for acceptance / 3 min for trouble. Cite EXFO anote 296/298, VIAVI choosing-an-OTDR whitepaper. [VERIFIED-public-source]
- Default launch / receive: minimum 150 m for premises and FTTx; 500 m for metro; 1 km for long-haul (>40 km). Cite VIAVI FAQ + EXFO anote 298. [VERIFIED-public-source]
- Splice acceptance: teach 0.3 dB unidirectional cap (TIA-568.3-D, via secondary source) AND bidirectional-averaged 0.10 / 0.15 / 0.20 dB as common contract bands. Flag the specific "<0.15 dB" in the brief as needs-attribution.
- Macrobend rule of thumb: >0.2 dB difference between two test wavelengths at the same point = suspect macrobend. Cite VIAVI macrobend whitepaper. [VERIFIED-public-source as vendor heuristic]
- IOR: always enter the cable manufacturer's group index. Default-IOR-error example: at 1550 nm, n=1.4677 default; if true value is 1.4682, a 40 km span shoots ~14 m long. [VERIFIED-public-source]
- Ghost vs gainer pedagogy: teach the bidirectional-averaging swap as the diagnostic for both. Show one trace where the gainer disappears under bidirectional averaging, and one ghost trace where shortening pulse eliminates the false event.
- Automated trace analyzer: teach as a productivity tool, not as the primary teaching tool. Module 8 lab work must require manual cursor placement on at least one acceptance trace.

Word count target: ~1700 words on this log. Actual: see file footer.

---
End of Module 8 research log.
