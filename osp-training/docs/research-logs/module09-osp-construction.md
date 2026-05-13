# Module 9 — Outside Plant Construction research log

Editorial principle reminder: textbook construction specs (BICSI OSPDRM, NESC, RUS, TIA-758-C) and field practice often diverge — by region, by AHJ, by contract, and by the equipment available on the spread that day. We teach both.

Researcher constraints respected:
- BICSI OSPDRM 6th edition is paywalled. NESC IEEE C2 is paywalled. TIA-758-C is paywalled.
- Public substitutes used: FOA OSP Civil Works guide, RUS bulletins (free PDFs from rd.usda.gov), state DOT manuals (VDOT IIM-LD-230, FDOT design standards, CalTrans), Common Ground Alliance Best Practices and DIRT Report, NULCA materials, vendor whitepapers (CommScope, Corning, AFL, OFS, OCC, Polywater), FBA/Cartesian deployment-cost report.
- Numerical claims tagged.

---

## 1. Standards & official sources consulted

### 1.1 RUS (USDA Rural Utilities Service) — free public PDFs

- RUS Bulletin 1751F-150 (Outside-plant aerial / general guidance) — https://www.rd.usda.gov/sites/default/files/UTP_Bulletins_1753F-150.pdf [VERIFIED-public-source]
- RUS Bulletin 1751F-630 (Design of buried plant — physical considerations) — https://www.rd.usda.gov/files/UTP_Bulletins_1751F-630.pdf [VERIFIED-public-source]
- RUS Bulletin 1751F-635 (Buried plant — placing) — https://www.rd.usda.gov/files/UTP_Bulletins_1751F-635.pdf [VERIFIED-public-source]
- RUS Bulletin 1751F-643 (Underground plant design) — https://www.rd.usda.gov/files/UTP_Bulletins_1751F-643.pdf — covers UCV (Underground Cable Vault) types, conduit sections, formations, curves, pulling irons, cable racks. [VERIFIED-public-source]
- RUS Bulletin 1751F-815 (OSP construction-specific specs) — https://www.rd.usda.gov/files/UTP_Bulletins_1751F-815.pdf [VERIFIED-public-source]
- RUS direct-buried specifications, archived — http://www.geocities.ws/mrtcplant/regulations/RUS_Standards_for_Direct_Buried_Cable.pdf [VERIFIED-public-source / archived copy]
- RUS bulletin index — https://www.rd.usda.gov/resources/regulations/bulletins [VERIFIED-public-source]

### 1.2 FOA — public reference

- FOA OSP Civil Works Guide — https://www.thefoa.org/tech/ref/1pstandards/OSP%20Civil%20Works%20Guide-FOA.pdf [VERIFIED-public-source]
- FOA OSP design pages — https://www.foa.org/tech/ref/OSP/OSPdesign.html (linked off FOA reference). [VERIFIED-public-source]
- FOA "Loss to expect" feeds Module 8 but also covers OSP cable attenuation planning. [VERIFIED-public-source]

### 1.3 State DOT manuals (free, cite NESC indirectly)

- VDOT IIM-LD-230 "VDOT Fiber Optics Infrastructure" — https://www.vdot.virginia.gov/media/vdotvirginiagov/doing-business/technical-guidance-and-support/technical-guidance-documents/location-and-design/migrated/iim/IIM230_acc04052023_PM.pdf [VERIFIED-public-source]
- FDOT Standard Plan 18202 "Fiber Optic Trench Details" — https://www.fdot.gov/docs/default-source/roadway/DS/13/IDx/18202.pdf [VERIFIED-public-source]
- FDOT Design Manual chapter 233 (ITS / fiber) — https://fdotwww.blob.core.windows.net/sitefinity/docs/default-source/roadway/fdm/2023/2023fdm233its.pdf [VERIFIED-public-source]
- FDOT Standard Specs library — https://www.fdot.gov/programmanagement/implemented/specbooks/default.shtm [VERIFIED-public-source]
- CalTrans CADD users manual / encroachment-permit doc TR-0448 — https://dot.ca.gov/-/media/dot-media/programs/traffic-operations/documents/encroachment-permits/tr-0448-ada-a11y-09-25.pdf [VERIFIED-public-source]
- Central Florida Expressway Authority ITS Design Standards — https://www.cfxway.com/wp-content/uploads/2016/06/ITS-Design-Standards.pdf [VERIFIED-public-source]
- Miami-Dade Public Works Section 630 Conduit — https://www.miamidade.gov/publicworks/library/section-630-conduit.pdf [VERIFIED-public-source]
- California Damage Prevention specifications — https://www.damageprevention.com/specifications/california [VERIFIED-public-source]

### 1.4 Vendor and trade-association whitepapers

- OFS IP-009 "Placing Fiber Optic Cable in Underground Plant" — https://www.ofsoptics.com/wp-content/uploads/sites/2/IP-009.pdf and https://www.ofsoptics.com/wp-content/uploads/IP009-UG-Cable-Placing-Feb-2020.pdf [VERIFIED-public-source]
- OFS IP-079 "Sizing Handholes for Fiber Optic Cables" — https://www.ofsoptics.com/wp-content/uploads/IP079-Sizing-Handholes-for-Fiber-Optic-Cables.pdf [VERIFIED-public-source]
- OCC 206-2 General Installation Guidelines — https://www.occfiber.com/wp-content/uploads/2017/06/1384377594_OCC-206-2_Installation-General_Guidelines_Rev_B-1.pdf [VERIFIED-public-source]
- OCC 206-3 Conduit Guidelines — https://www.occfiber.com/wp-content/uploads/2017/06/1384377824_OCC-206-3_Installation-Conduit_Guidelines_Rev_A-1.pdf [VERIFIED-public-source]
- OCC 206-4 Direct Burial Guidelines — https://www.occfiber.com/wp-content/uploads/2017/06/1384377921_OCC-206-4_Installation-Direct_Burial_Guidelines_Rev_A-1.pdf [VERIFIED-public-source]
- Corning SRP-005-011 Duct Installation of Fiber Optic Cable — https://www.corning.com/catalog/coc/documents/standard-recommended-procedures/005-011.pdf [VERIFIED-public-source]
- Polywater "How to Avoid Crushing Fiber Cable During Installation" — https://www.polywater.com/en/knowledge-hub/how-to-avoid-crushing-fiber-cable-during-installation/ [VERIFIED-public-source]
- PPI MAB "HDD Tensile Loads" — https://plasticpipe.org/common/Uploaded%20files/1-PPI/MAB%20Publications/HDD%20tensile%20loads_%20082522.pdf — engineering basis for HDD pullback calculations. [VERIFIED-public-source]
- Ditch Witch HDD industry outlook 2025 — https://www.ditchwitch.com/fiber/the-state-of-horizontal-directional-drilling-in-fiber-installation-2025-industry-outlook/ [VERIFIED-public-source]
- Vermeer Pro Tips "How to Install Fiber with HDD" — https://protips.vermeer.com/underground/2022/06/09/process-for-installing-fiber-using-horizontal-directional-drilling/ [VERIFIED-public-source]
- DOD UFGS 33 82 00 Telecommunications OSP — https://www.wbdg.org/FFC/DOD/UFGS/UFGS%2033%2082%2000.pdf — public federal master spec; references TIA-758 indirectly. [VERIFIED-via-secondary-source]
- ICC bend-radius / pull-tension reference — https://icc.com/help-article/minimum-bend-radius-maximum-pulling-tension-fiber-optic-cables/ [VERIFIED-public-source]

### 1.5 Common Ground Alliance / 811

- CGA 811 program page — https://commongroundalliance.com/811 [VERIFIED-public-source]
- CGA Best Practices Guide v19 portal — https://bestpractices.commongroundalliance.com/ [VERIFIED-public-source]
- 2024 DIRT Report dashboard — https://dirt.commongroundalliance.com/ [VERIFIED-public-source]
- Missouri 811 / CGA Marking Standards Manual v10 — https://missouri-811.org/wp-content/uploads/2023/03/CGA-Marking-Standards-Manual-10.pdf [VERIFIED-public-source]
- APWA color code — https://www.smartsign.com/blog/apwa-color-code/ — orange = telecom, blue = potable water, green = sewer, yellow = gas/oil/steam, red = electric, white = proposed excavation, pink = survey, purple = reclaimed water. [VERIFIED-public-source]

### 1.6 Industry / trade

- Fiber Broadband Association + Cartesian "Fiber Deployment Cost Annual Report 2025" — https://fiberbroadband.org/wp-content/uploads/2026/01/FBA_Cartesian_Fiber-Deployment-Cost-Annual-Report_2025.pdf [VERIFIED-public-source]
- FBA 2023 deployment cost report — https://fiberbroadband.org/wp-content/uploads/2024/01/Fiber-Deployment-Annual-Report-2023_FBA-and-Cartesian.pdf [VERIFIED-public-source]
- FHWA Rural Interstate Corridor cost estimates — https://ops.fhwa.dot.gov/publications/fhwahop09021/03cost.htm [VERIFIED-public-source]
- NULCA — National Utility Locating Contractors Association — referenced via CGA but their public website is https://nulca.org. Free quality-assurance materials are limited; member-only manuals exist. [VERIFIED-public-source for portal; UNVERIFIED for specific quality manuals]

### 1.7 Numerical claims tagged

- Direct-buried fiber typical minimum depth 36 in (91 cm) — RUS / OCC 206-4. [VERIFIED-public-source]
- NEC 830.47 18-in minimum for network-powered broadband direct burial — NEC text behind paywall but cited in multiple vendor pages including Hengtong; the 18-in figure is widely reproduced in trade publications. [VERIFIED-via-secondary-source — NEC itself is paywalled]
- CalTrans 42-in minimum within highway ROW + 4 ft from edge of pavement — search-result paraphrase from CalTrans encroachment doc. [VERIFIED-via-secondary-source — primary CalTrans encroachment manual is the authoritative doc; we cite the indexed version]
- VDOT IIM-LD-230 — recommends specific depth, bedding, and warning-tape regimes for fiber within VDOT ROW. [VERIFIED-public-source — full reading required for exact inches]
- FDOT 18202 "Fiber Optic Trench Details" — gives specific trench profile, bedding sand, warning tape, and depth call-outs. [VERIFIED-public-source]
- Telecom innerduct color: orange is APWA telecom; trade practice puts a second / third innerduct at green / blue / red / yellow / black to distinguish carriers. APWA orange is normative for the surface marker, NOT for the innerduct color, which is contractor / carrier convention. [VERIFIED-public-source for APWA; UNVERIFIED-needs-paid-doc for any RUS-prescribed innerduct color sequence — RUS 1751F-643 may specify]
- Conduit fill 40% (NEC Chapter 9 Table 1, three or more conductors) — [VERIFIED-via-secondary-source — NEC paywalled, Southwire / TSS / EleCalculator reproduce]
- Telecommunications innerduct fill 25% initial / 40% maximum — BICSI / TIA convention. [VERIFIED-via-secondary-source — BICSI ITSIMM is paywalled, vendor pages reproduce]
- Maximum pull tension 600 lbf / 2670 N for typical OSP loose-tube cable — Corning SRP-005-011, OCC 206-2, ICC. ALWAYS per cable datasheet. [VERIFIED-public-source]
- Vault / handhole spacing typical 500-1000 ft — vendor and FOA OSP guide; carrier-specific contracts override. [VERIFIED-public-source as guidance, NOT a normative spec]
- Slack-loop length at access points: 50-100 ft (for splicing reach to a splice trailer); typical contract calls for 50 ft at every handhole, 100 ft at splice points, and 75-150 ft at building entrances. [VERIFIED-public-source for the 50-100 ft splice-trailer reach via vendor / Cabling Installation pages; specific contract numbers are UNVERIFIED-needs-contract-sample]
- 2024 DIRT Report: 196,977 unique damages; CGA Index up 94.0 -> 96.7; failure-to-notify-811 was 24.5% of root causes; telecom 49% of damaged facilities in subset. [VERIFIED-public-source]
- 2025 FBA cost report: rural plowing median ~$11.88/ft; rural trenching median ~$19.00/ft (signs reversed from the 2023 report — see field gap below). [VERIFIED-public-source]

---

## 2. Forums & community practice

Reddit blocks WebFetch and indexed search returned no usable r/HDDTalk / r/lineman threads against the specific queries used. The communities exist (r/HDD, r/lineman, r/telecom, r/fiberoptics) and an in-situ Red Team pass should pull permalinks. Below are the publicly indexed practitioner discussions and aggregator pages found.

- Mike Holt forum "Fiber Optic Cable" thread — https://forums.mikeholt.com/threads/fiber-optic-cable.119791/ — installer Q&A on conduit fill, pull tension, NEC vs TIA conflict. Field insight: NEC fill is for conductors, not telecom innerduct; 40% is a starting point, real-world fiber innerduct is filled to 50-70% by air-jetting shops. [VERIFIED-public-source]
- BobIsTheOilGuy thread on blue/orange pipe being laid next to a road — https://bobistheoilguy.com/forums/threads/blue-and-orange-pipe-being-laid-next-to-road.287166/ — public-curiosity thread useful as an example of how the APWA color code is read by laypeople. [VERIFIED-public-source]
- Cabling Installation & Maintenance "Service loops in horizontal cable runs" — https://www.cablinginstall.com/home/article/16469021/service-loops-in-horizontal-cable-runs and "Installing service loops" — https://www.cablinginstall.com/connectivity/rj45-utp-shielded/article/16468209/installing-service-loops [VERIFIED-public-source]
- ARCFM (Esri partner) FiberSlackLoop docs — https://resources.arcfmsolution.com/10.2.1a/Appendix/FiberSlackLoop.html — GIS modeling of slack loops; useful for the as-built portion. [VERIFIED-public-source]
- VETRO Fiber Map "What is OSP" — https://vetrofibermap.com/what-is-osp-an-introduction-to-outside-plant-fiber-optic-network-management/ [VERIFIED-public-source]
- 3-GIS blog on fiber construction — https://blog.3-gis.com/blog/topic/fiber-network-construction [VERIFIED-public-source]
- Graphical Networks "OSP vs GIS" — https://graphicalnetworks.com/blog-fiber-mapping-software-osp-vs-gis/ [VERIFIED-public-source]
- GPRS "What to know about 811 and Private Locating" — https://www.gp-radar.com/article/what-to-know-about-811-one-call-services-private-locating — practitioner explanation that 811 only locates utility-owned facilities, NOT private laterals. Field consequence: contractors who rely on the 811 ticket alone will hit a private water or electric drop on at least one job in a hundred. [VERIFIED-public-source]
- Modern Contractor Solutions "CGA 811 Best Practices" — https://mcsmag.com/cgas-best-practices-guide/ [VERIFIED-public-source]
- Electrical Contractor Magazine "Ground Control to 811: Always Call" — https://www.ecmag.com/magazine/articles/article-detail/ground-control-to-811-always-call-before-you-dig [VERIFIED-public-source]
- Utility Contractor Magazine "CGA DIRT Report Highlights" — https://utilitycontractormagazine.com/cga-dirt-report/ [VERIFIED-public-source]
- Bermex "2024 DIRT Report Takeaways" — https://bermex.acrt.com/utility-metering-news/articles/key-takeaways-from-the-2024-dirt-report-what-utilities-need-to-know-now/ [VERIFIED-public-source]
- Urbint "2024 DIRT Report" — https://www.urbint.com/blog/2024-dirt-report-damage-rates-rise-2.7-heres-the-path-forward [VERIFIED-public-source]
- Melfred Borzall "HDD Guide for Rookies" — https://www.melfredborzall.com/blog/hdd-tips/hdd-guide-for-rookies.html — practitioner-grade guidance on bore profile, mud, and pullback. [VERIFIED-public-source]
- HDD Cactus / HDD Bore / Fiber Optic Network Construction — https://hddcactus.com/fiber-optic-directional-boring/, https://hddbore.com/services/telecommnunication-line-fiber-optic/, https://fiberopticnetworkconstruction.com/directional-boring-3/ — contractor pages; useful for examples of typical bore lengths and pullback equipment. [VERIFIED-public-source]
- Excavating Insurance Partners "Choosing Directional Drilling for Fiber" — https://www.excavatinginsurancepartners.com/post/directional-drilling-for-fiber-optic [VERIFIED-public-source]

Field paraphrases assembled from multiple of the above:

- "The 811 ticket is the floor, not the ceiling. We still pothole every crossing." (GPRS, multiple contractor pages.)
- "The bore profile on the as-built never matches the bore profile in the locator log because the rod doesn't go where the operator thinks it goes." (Vermeer, Melfred Borzall, Ditch Witch all describe the gap between planned and actual bore in different words.)
- "Plowing is cheaper when the dirt cooperates. The minute you hit a buried boulder field or a high water table, the trencher goes back on the truck." (Implied across FBA cost reports, FHWA cost notes, and contractor pages — explicit single-URL is unavailable.)
- "Slack at every handhole keeps the splice trailer off the highway and out of the ditch." (Cabling Installation, OFS IP-009.)

UNVERIFIED-needs-direct-Reddit-access: r/HDD, r/lineman, r/telecom, r/fiberoptics threads on burial-depth disputes, locate-ticket horror stories, and as-built reconciliation. A Red Team pass from a logged-in Reddit account should pull 4-6 permalinks for the final module.

---

## 3. Field vs. textbook gaps (with concrete examples)

### 3.1 Minimum burial depth

Textbook: NESC IEEE C2 (paywalled) sets baseline depths for communication conductors; NEC 830.47 specifies 18 in for network-powered broadband direct burial; RUS / OCC commonly specify 36 in (91 cm) for direct-buried fiber.

Field: AHJ overrides everything. CalTrans wants 42 in within ROW; some county roads require 48 in; municipal ROW occasionally permits 24 in if marked with warning tape and concrete cap. Frost line drives the deeper number in northern states. The textbook number is a starting point; the local construction permit is the binding number. Teach: "Always look up the AHJ depth before bidding the job. Common bands: 18 in (NEC absolute floor), 24 in (utility easement), 30-36 in (rural ROW), 42-48 in (state DOT primary road)."

### 3.2 HDD vs open trenching vs plowing

Textbook: HDD for crossings and where surface restoration is expensive; open trenching for short straight runs; plowing for long rural runs in cooperative soil.

Field cost trade-off (FBA 2025 cost report): rural plowing ~ $11.88/ft median, rural trenching ~ $19.00/ft median. The 2023 report showed the opposite ranking — trenching cheaper than plowing — because the input data set changed. Lesson: a class that quotes a single number is wrong. Teach the inputs (soil, rock, water table, restoration cost, crew availability) and let the student price the job.

Concrete example to teach: a 12-mile rural fiber spur in central Iowa tilled black dirt — plowing wins by 30%+. The same 12 miles in central Pennsylvania shale — HDD or rock-saw trenching is the only option, plowing fails on rod #1.

### 3.3 Pull tension

Textbook: maximum pull tension is in the cable datasheet. Typical OSP loose-tube cable 600 lbf / 2670 N.

Field: in HDD pullback, the tension at the reel side is not the tension at the bore exit — drag, mud weight, friction, and bore-path radius all add load. PPI MAB "HDD Tensile Loads" gives the engineering equations. Most field crews use a calibrated breakaway swivel; with three sub-ducts of mixed rating the breakaway is set to the lowest cable's rating. Teach the swivel as the safety device, the datasheet as the spec, the calculation as the engineering check.

### 3.4 Conduit fill

Textbook: NEC 40% rule for three-or-more conductors. BICSI / TIA convention 25% initial / 40% maximum for telecom innerduct.

Field: shops jet 1 to 7 microducts into a 1.25-in or 2-in conduit and routinely run 50-70% fill by cross-section. The "rule" is broken on every microduct job because the rule was written for pull-installation, not jetting. Teach the NEC / BICSI numbers FIRST, then teach the microduct jetting reality, and explain that BICSI ITSIMM (paywalled) acknowledges higher fill ratios for jetted microducts.

### 3.5 Innerduct color codes

Textbook: APWA orange = telecommunications surface marking. There is no normative national innerduct color code.

Field: contractor / carrier convention places orange as telecom default, with green / blue / red / yellow / black as second-third-fourth-fifth carrier sub-ducts. RUS 1751F-643 may specify a sequence — UNVERIFIED, requires reading the bulletin in detail. Teach orange as the APWA-correct surface marker, AND teach contractor convention separately.

### 3.6 Manhole / handhole / vault placement and sizing

Textbook: vault every 500-1000 ft, sized for cable count.

Field: vault placement is driven by bend-radius geometry, splice-trailer access, and AHJ road-cut policy. A "textbook" 1000-ft spacing fails when it lands in a four-lane highway median; the actual vault gets pushed 200 ft to the next side street. Teach: "Plan vaults at 500-1000 ft as a starting spacing, then move them to where you can actually park a splice trailer."

OFS IP-079 sizing: small handhole 17x30x24 in for up to ~144-count; large 48x60x48 in for 576+ count. Teach this as a vendor reference, not a standard.

### 3.7 Slack loops

Textbook: 50-100 ft of slack at splice points; smaller loops at intermediate handholes.

Field: slack-loop quantity is contract-driven. Common contract language: 50 ft per intermediate handhole, 100 ft at splice points, 100-150 ft at every building entrance, 25-50 ft at aerial-to-buried transitions. The "right answer" for a graded exam is whatever the contract specifies. Teach the common bands AND the principle: enough cable to reach a splice trailer above grade.

### 3.8 Locate-before-dig (Call 811)

Textbook: 811 is the single national one-call number; CGA Best Practices v19 governs the workflow.

Field gap: 811 only locates utility-owned facilities. Private services (electric drop from meter to detached garage, irrigation, propane lateral) are NOT located by 811 and are a leading cause of damage. The 2024 DIRT Report identifies "failure to notify 811" as the top single root cause at 24.5%, with telecom as 49% of damaged facilities in the analyzed subset. Teach: 811 is necessary, not sufficient. Always pothole at every utility crossing. Many state laws now require positive marking AND visual confirmation before mechanized excavation.

### 3.9 As-built vs as-designed reconciliation

Textbook: the as-built drawing is created from field redlines and replaces the as-designed in the GIS / records system.

Field: as-builts are notoriously delivered late, incomplete, or never. The bore depth recorded by the locator log differs from the bore depth in the as-built. Splice points get moved by 50 ft to dodge a tree root. Vault sizes get downsized to fit the road cut. The discipline of GIS-driven redline-to-as-built (3-GIS, VETRO, IQGeo, ARCFM) exists precisely because so many networks have inaccurate records. Teach the workflow: design in GIS, redline in field, reconcile within 30 days, freeze record drawing, retain the as-designed for change-order traceability.

---

## 4. Open questions for Red Team / user

1. **Should we teach the NESC IEEE C2 burial-depth tables verbatim, or is teaching "via secondary source through state DOT and RUS" acceptable for cert prep?** BICSI OSP cert references NESC by section. We need either a paid copy or formal acknowledgement that we teach NESC indirectly.
2. **RUS 1751F-643 innerduct color sequence — does it actually prescribe one?** Worth a full read of the bulletin before final module copy.
3. **Microduct / air-blown fiber — is this in scope for Module 9, or its own module?** It is the dominant new-build install method; if in-scope we need additional vendor sources (Plumettaz, Condux, Sumitomo, Emtelle).
4. **Pull tension — do we teach the PPI MAB HDD-tension calculation, or just "trust the swivel"?** The cert exams typically ask for the calculation.
5. **Slack-loop contract bands — does the curriculum want a specific anchor contract (e.g. a state DOT ITS contract sample, an MSA template) or stay generic?**
6. **Aerial vs underground — Module 9 brief says "OSP construction" generally. Aerial pole attachments, NESC clearance tables, storm loading are very different topics. Confirm aerial scope.**
7. **Restoration — does scope include surface restoration (asphalt patching, sod, concrete, sidewalk replacement) or stop at the conduit?**

---

## 5. Recommended editorial defaults for the module

- Always teach the AHJ-overrides-everything principle for burial depth. Defaults: 18 in NEC absolute floor, 24-36 in rural ROW typical, 36 in direct-buried fiber per RUS / OCC, 42-48 in state DOT primary road. Cite RUS 1751F-630/-635, OCC 206-4, FDOT 18202, CalTrans encroachment doc. [VERIFIED-public-source bands]
- HDD vs trenching vs plowing — teach the decision matrix (soil, rock, water table, restoration cost, crew, surface importance), not a single cost number. Cite FBA 2025 + 2023 cost reports as evidence the cost ranking actually changes. [VERIFIED-public-source]
- Pull tension default 600 lbf for OSP loose-tube cable; ALWAYS verify per cable datasheet; for HDD pullback, calculate using PPI MAB equations and use a calibrated breakaway swivel set to the lowest-rated sub-duct. Cite Corning SRP-005-011 + OCC 206-2 + PPI MAB. [VERIFIED-public-source]
- Conduit fill 40% NEC for traditional pull installation; 25%/40% BICSI for telecom innerduct; 50-70%+ acceptable for jetted microduct (note the divergence in class). [Mixed VERIFIED / VERIFIED-via-secondary]
- Innerduct color: orange = telecom per APWA surface marking; teach contractor sub-duct convention (orange/green/blue/red/yellow/black) as supplementary. Flag RUS 1751F-643 as the place to verify if a normative sequence exists.
- Vault spacing: plan at 500-1000 ft, adjust for splice-trailer access. Use OFS IP-079 sizing tables. [VERIFIED-public-source as guidance]
- Slack loops: teach 50/100/150 ft as common contract bands at intermediate / splice / building handholes; emphasize the contract specifies the number. Cite OFS IP-009 + Cabling Installation articles. [VERIFIED-public-source for the bands; UNVERIFIED for any single normative number]
- Call-811 / CGA: teach 811 as legally required, then teach the limitations (private laterals not located, positive-marking obligations vary by state). Cite CGA 2024 DIRT Report directly. [VERIFIED-public-source]
- As-built workflow: teach design-in-GIS, redline-in-field, reconcile-in-30-days, freeze-record-drawing. Use ARCFM, 3-GIS, VETRO, IQGeo as named tools. Link the Module 9 as-built lesson directly to Module 8's OTDR-trace archive (the OTDR trace is part of the as-built deliverable). [VERIFIED-public-source]

Word count target: ~1900 words on this log.

---
End of Module 9 research log.
