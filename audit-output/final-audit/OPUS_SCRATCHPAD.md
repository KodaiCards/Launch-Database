# OPUS LEARNING SIMULATION — Scratchpad

> Notes accumulated sequentially as I read lessons. NO REWIND. NO GREP.
> This file IS my memory during the exam.

## Master Reading List (DAG order, T01 → T19 per C05 prereqs)

Teaching order from course-catalog.js:
T01 → T18 → T02 → T03 → T04 → T09 → T05 → T06 → T19 → T14 → T07 → T08 → T10 → T11 → T12 → T13 → T15 → T16 → T17 → C05

Per directive 36: C05 prereqs = T01-T19 only (T20-T22 NOT prereqs). I read T01-T19 only.

Per-topic lesson counts:
- T01: 10, T02: 12, T03: 12, T04: 10, T05: 15, T06: 12, T07: 10, T08: 12, T09: 12, T10: 12, T11: 15, T12: 15, T13: 13, T14: 12, T15: 10, T16: 10, T17: 10, T18: 10, T19: 11
Total: 207 lessons + C05 exam.

---

## NOTES BY TOPIC

### T01 Fundamentals & Vocabulary

**L01 OSP vs ISP:**
- OSP = Outside Plant (between buildings, aerial poles, buried conduit, manholes, FDH, drop cables, splices). ISP = Inside Plant (inside buildings, NEC Article 770, TIA-568).
- Signal path: OLT (headend) → feeder (72-288 fibers) → FDH (splitters) → distribution (12-48 fibers) → NAP → drop (1-4 fibers) → ONT (customer demarc).
- Demarcation point = boundary between OSP/ISP. In FTTH = the ONT.
- OLT = Optical Line Terminal (provider/headend, originates signal). ONT = Optical Network Terminal (customer side, demarc).
- OSP rated cable: UV-resistant, outdoor, waterproof. ISP needs riser (OFNR) or plenum (OFNP) per NEC 770.
- FCC Part 32 accounts: 2411 Poles, 2421 Cable aerial, 2422 Cable underground, 2423 Cable buried, 2441 Conduit. (Note: 2410 = Cable & wire facilities; 32.2210 = Central office switching, NOT cable.)
- RUS = Rural Utilities Service (USDA, funds rural telecom, publishes 1751F bulletins).
- BICSI = Building Industry Consulting Service International (RCDD, OSP Designer certs). FOA = CFOS/CFOT certs.

**L02 Parts of a Pole:**
- 3 vertical zones top-down: Supply (4-35kV primary), Climbing space (mandatory gap, NO attachments), Communication space (telecom, fiber at bottom).
- NESC = National Electrical Safety Code (IEEE-published).
- Span = horizontal distance between 2 poles (150-300 ft suburban, up to 600+ ft rural). Midspan = middle of span (max sag, lowest cable point, where ground clearance is measured).
- Sag: gravity droops cable below straight line; tight = less sag, more tension. Loose = more sag, less tension.
- Ground clearance measured AT MIDSPAN, not at attachment.
- NESC Rule 232/Table 232-1: ~15.5 ft min for telecom over traffic lanes.
- Pole class: ANSI O5.1 strength classification by circumference 6 ft from butt; Class 1 strongest, Class 10 weakest; H1-H6 extra-heavy.
- Pole length common: 30/35/40/45/50/55/60 ft. Setting depth = 10% of length + 2 ft.
- Joint-use = pole shared by multiple companies (electric owns, telecom = attachers).
- 47 CFR 1.1411 = FCC pole attachment fee rules. Telecom pays annual fees.
- Grades of construction: Grade B (power lines, stringent), Grade C (less stringent, many telecom).
- Neutral = return conductor below primary, can be MGN (Multi-Grounded Neutral, grounded every pole, common in RUS).
- Conduit types: Schedule 40 PVC (buried, economical), HDPE (UV-resistant, exposed risers, HDD), innerduct (sub-conduit).

**L03 Parts of a Cable:**
- Layers outside-in: Outer jacket (HDPE, black, UV-resistant) → Ripcord (nylon, slit jacket) → Armor (steel tape, rodent protection; dielectric = no metal) → Strength members (aramid/Kevlar) → Buffer tubes (color-coded, 2-12 fibers, gel-filled) → Water-blocking gel → Individual fibers (250 µm coated, 125 µm glass) → Central member (steel/FRP rod).
- Fiber: 125 µm glass (core + cladding), 250 µm with colored coating.
- TIA-598 12-color sequence: Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua (BOG-BSW-RBY-VRA).
- Aerial configs: Figure-8 lashed (steel messenger carries tension, fiber zero tension) vs ADSS (All-Dielectric Self-Supporting, no metal, no grounding needed, higher cost).
- Jacket print: fiber count + fiber type + construction + year + footage marks (every 1-2 ft, critical for splice planning).
- Standards: ICEA S-87-640 (OSP cable construction), TIA-598-D (color codes).
- Ribbon cable: 12 fibers bonded flat, mass-fusion splicing (12 fibers in ~10 sec), 432F cable can be fully spliced in <1 hr.

**L04 Inside a Splice Case:**
- Splice case = weatherproof enclosure for fusion splices, 25-40 yr life.
- Splice tray holds 12-24 splices, maintains bend radius (typically 30mm min).
- 2 case shapes: Dome (cables enter one end, pole-mount/pedestal common) vs Inline (cables enter both ends, pass-through mid-route splices in manholes).
- Components inside: cable entry/port → central member anchor (CRITICAL: failure pulls buffer tubes through case, breaks all splices) → fan-out (strip jacket, organize tubes) → splice trays → slack storage (gentle loops, min bend radius).
- Fusion splice loss typical: under 0.1 dB.
- Macrobend after closure = #1 cause of post-splice OTDR surprise (slack pinched against tray edge). Always OTDR with case closed but before sealing.
- Re-enterable closures (gel/mechanical seal) more common than non-re-enterable (heat-shrink, epoxy).
- Splice records (required by RUS Form 219) preserve forever: cable IDs, buffer tube colors, fiber numbers, splice loss, date/tech.

**L05 OSP Project Lifecycle:**
- 7 stages in order: Survey → Design → Permitting → Make-Ready → Construction → Testing → As-Built/Close-Out.
- OTMR (One-Touch Make-Ready) per 47 CFR 1.1411: new attacher can hire qualified contractor to do all make-ready in single visit. 15-business-day deadline for simple make-ready per §1.1411(h)(2)(ii). NOTE: §1.1413 was the OLD section number — current is §1.1411.
- Testing tiers per TIA-568: Tier 1 = OLTS (loss test set, end-to-end insertion loss). Tier 2 = OTDR (full trace, locates every event).
- RUS Form 219 = USDA project completion certification, PE-signed, required at close-out for RUS-funded telecom (governed by 7 CFR Part 1753 telecom — NOT 1726 which is electric).
- As-built = updated drawings showing what was actually built (vs as-designed). Permanent record.

**L06 Who Does What:**
- Roles: Surveyor/Staker → OSP Designer → Permitting Specialist → Make-Ready Crew → Construction Crew → Splicer → Test Technician → Inspector → As-Built Drafter.
- PE = Professional Engineer (state-licensed, stamps drawings, required for RUS-program designs, signs RUS Form 219, personally liable).
- PM = Project Manager (coordinates stages, runs permitting+make-ready in parallel).
- ROW = Right-of-Way (legal corridor where fiber installs).
- OTDR = Optical Time-Domain Reflectometer (primary fiber test instrument, sends light pulse, measures reflection).
- Splicer ≠ Test Technician. Splicer's OTDR checks during work ≠ final acceptance test. Test tech does Tier 1 (OLTS) + Tier 2 (OTDR) end-to-end on every fiber.
- Inspector job = identify+document non-conformances, NOT fix them (punch list to PM). Inspector adjusts nothing.

**L07 Strand Map:**
- Strand map = fiber network wiring diagram (which fiber serves which customer).
- FTTH hierarchy: OLT (headend, port per feeder fiber) → Feeder cable (72-288F) → FDH (Fiber Distribution Hub, contains 1:32 or 1:64 splitters) → Distribution cable (12-48F) → NAP (Network Access Point, 1-4 customers) → Drop cable (1-2F) → ONT (customer demarc).
- PON = Passive Optical Network (one OLT port serves many customers, no powered electronics in distribution). GPON = Gigabit PON (2.5 Gb/s downstream shared). XGS-PON = 10G successor.
- Notation: BT = Buffer Tube, F = Fiber. "BT4-F7" = Buffer Tube 4 Fiber 7.
- Splitter loss: 1:32 ≈ 15-17 dB (theoretical min 10×log(32) = 15.05 dB, +0.5-1.5 dB insertion). Use 17 dB worst-case planning. 1:64 ≈ 18-20 dB.
- "Passive" means no powered electronics, NOT no loss.
- GIS integration via TIA-606-D (administration standard).

**L08 Acronyms Reference:**
- SMF (Single-Mode Fiber): 9 µm core, one mode, OSP long-distance, FTTH default. ITU-T G.652/G.657.
- MMF (Multi-Mode Fiber): 50 or 62.5 µm core, multi-mode, short building runs, NOT standard for FTTH OSP. OM3/OM4/OM5 grades.
- OS2 = ISO/IEC 11801 designation for G.652.D SMF (low-water-peak, mainstream OSP trunk). OS1 = older G.652.A/B/C. G.657.A2 = bend-insensitive, used for drops.
- ADSS = All-Dielectric Self-Supporting (no metal, no grounding, built-in strength).
- OTDR = Optical Time-Domain Reflectometer (Tier 2 per TIA-568, locates events).
- OLTS = Optical Loss Test Set (Tier 1, end-to-end loss, source+meter).
- MGN = Multi-Grounded Neutral (rural electric neutral, grounded every pole).
- IBT = Insulated Bonding Transformer (bonds messenger to MGN but isolates from AC).
- GES = Grounding Electrode System (NEC Article 250).
- NEC = National Electrical Code (NFPA 70, inside-building, grounding/bonding/entries).
- NESC = National Electrical Safety Code (IEEE C2, aerial OSP). NEC ≠ NESC.
- TIA = Telecommunications Industry Association (568 cabling, 598 colors, 606 admin, 942 data centers).
- BICSI: RCDD, OSP Designer, ITS Installer/Technician. OSPDRM = Outside Plant Design Reference Manual.
- FOA: CFOT (entry-level), CFOS/O (specialist, requires CFOT + 2yr exp).
- AHJ = Authority Having Jurisdiction (regulator enforcing code locally).
- HDD = Horizontal Directional Drilling (boring under roads/rivers).
- ROW = Right-of-Way.
- GIS = Geographic Information System (Esri ArcGIS, QGIS, Katapult).
- LiDAR = Light Detection and Ranging.
- HDPE = High-Density Polyethylene (conduit + jacket, UV-resistant).
- PVC = Polyvinyl Chloride (Schedule 40/80, NOT UV-rated, buried use only; use HDPE for exposed risers).
- LOTO = Lockout/Tagout (OSHA 1910.147).
- PPE = Personal Protective Equipment.
- MUTCD = Manual on Uniform Traffic Control Devices (FHWA).
- NEPA = National Environmental Policy Act (Categorical Exclusion CE C-8 for telecom).
- NHPA = National Historic Preservation Act (Section 106, SHPO/THPO).
- ESA = Endangered Species Act (§7 consultation, FWS IPaC tool).
- FTTH = Fiber to the Home.
- GPON = Gigabit PON (2.5 Gb/s down shared). XGS-PON = 10G symmetric next-gen.
- USDA = Department of Agriculture (parent of RUS).
- PE = Professional Engineer.

**L09 OSP Standards Landscape:**
- Standards bodies: IEEE (NESC C2), NFPA (NEC 70), ITU-T (G-series fiber: G.652.D SMF, G.657.A1/A2 bend-insensitive, G.984 GPON), ICEA (S-87-640 OSP cable construction), TIA (cabling), ANSI (O5.1 wood poles).
- FCC = pole attachment per 47 CFR Part 1.1411 (OTMR rules, 15 business day timeline simple make-ready).
- USACE = US Army Corps of Engineers. NWP 57 (Nationwide Permit 57, "Electric Utility Line and Telecom Activities") authorizes telecom water crossings. REPLACES old NWP 12 for telecom. NWP 12 now only oil/gas. 2026 NWP package effective March 15, 2026.
- CFR titles: 47 (FCC telecom), 7 (USDA RUS), 29 (OSHA), 33 (Corps), 36 (NPS / NHPA §106).
- 33 CFR Part 330 = Nationwide Permits. 33 CFR Part 323 = individual Section 404 permits.
- RUS bulletins: 1751F-630 (aerial + general OSP), 1751F-635 (underground), 1753F-201 (materials acceptance/listing, references ICEA S-87-640).
- TIA standards: TIA-568 (cabling), TIA-568.3-D (fiber Tier 1/2 testing), TIA-598-D (color codes), TIA-606-D (administration/labeling), TIA-942 (data centers).
- IEC 61300-3-35 = connector end-face inspection.
- NEC Article 770 = optical fiber cables/raceways. NEC Article 250 = GES.
- Code adoption: standards become law when adopted by state/jurisdiction. NESC editions can vary by state.
- Standards conflict resolution: Federal > State > AHJ > RUS (more stringent) > project specs. Apply most stringent + document rationale.
- RUS Forms: 307 (Bid Bond), 524 (Plans+Specs Approval), 565 (Compliance Statement), 740 (Construction Contract), 740c (Contractor Closeout), 219 (Final Inspection Report), 1744 (Loan Agreement Certs), 1755-A (Materials Approval).

### T18 Safety & OSHA

**L01 Hazard Awareness & Risk Hierarchy:**
- 29 CFR 1910.268 (Subpart R, Telecommunications) = primary OSHA standard for OSP telecom field work.
- General Duty Clause = OSH Act §5(a)(1) (catch-all when no specific regulation).
- Hierarchy of Controls (most → least effective): 1. Elimination, 2. Substitution, 3. Engineering Controls, 4. Administrative Controls, 5. PPE (last — least reliable).
- SDS = Safety Data Sheet (replaced MSDS under OSHA HazCom 2012, 29 CFR 1910.1200).
- Competent person = trained to ID hazards + AUTHORITY to stop work (29 CFR 1926.32(f)).
- Hazard categories: Physical, Electrical, Chemical, Environmental.
- Required for trenching/excavation (1926 Subpart P) and confined space.

**L02 LOTO (29 CFR 1910.147):**
- LOTO = Lockout/Tagout. Physical padlock on Energy Isolating Device (EID) prevents re-energization. Lockout preferred over tagout (tag can be removed in seconds).
- 6-step sequence: 1. Notify affected employees, 2. Identify all energy sources, 3. Shut down equipment normally, 4. Isolate energy at EID (open breaker/valve), 5. Apply personal padlock to EID, 6. Release/restrain stored energy + VERIFY zero energy by attempting operation.
- Entry gate = Step 6 verification. DO NOT enter danger zone until verified.
- Authorized employee = applies own personal lock + does servicing. Each worker their own lock.
- Affected employee = operator/area worker. Notified before LOTO applied and after release.
- Re-energization sequence per 1910.147(e): remove tools → confirm clear → each worker removes own lock → notify affected employees → restore energy.
- Group LOTO per 1910.147(f)(3): use group hasp accepting multiple locks. Last person removes last lock.
- NEVER use tape or zip-ties — illegal. Lockout always over tagout when possible.

**L03 Confined Space (29 CFR 1910.146 + 1910.268(o)):**
- Confined space = (1) large enough to enter, (2) NOT designed for continuous occupancy, (3) limited entry/exit.
- PRCS = Permit-Required Confined Space (has hazardous atmosphere, engulfment risk, converging walls, or other serious hazard).
- Every telecom manhole = confined space. Atmospheric testing REQUIRED EVERY TIME before entry per 1910.268(o)(2).
- Acceptable ranges for entry:
  - O₂: 19.5%-23.5% (normal 20.9%). <19.5% = oxygen-deficient. <16% = unconsciousness no warning. IDLH below 19.5% or above 23.5%.
  - LEL: <10% acceptable. 10-25% = ventilate+re-test. >25% = do not enter, call gas utility.
  - CO: <25 ppm acceptable (ACGIH TLV-TWA). NIOSH IDLH = 1,200 ppm.
  - H₂S: <1 ppm acceptable. NIOSH IDLH = 100 ppm (NOT 50 — STEL is 50 not IDLH).
- 1910.268(o) (telecom-specific) supersedes general 1910.146 PRCS for routine telecom manholes — under §1910.5(c)(1) specific standards beat general. Routine telecom manhole work = no written permit if testable + ventilatable safely.
- Attendant = topside person; monitors entrant; DOES NOT ENTER (rescue from outside via retrieval line).
- Multi-employer worksites per 29 CFR 1910.146(d)(11): host + contractor must coordinate.
- Process: vent passively 2-5 min → lower monitor → test → if good enter → forced ventilation if needed → attendant maintains contact → guard opening per 1910.268(o)(1) → ladder required if >4 ft depth per 1910.268(h)(8).

**L04 Fall Protection (29 CFR 1910.268(g), 1910.67):**
- Positioning System (body belt/harness + pole strap) = holds at work position, NOT fall arrest. PFAS catches a fall.
- PFAS = Personal Fall Arrest System (harness + lanyard/SRL + anchor). Lanyard limits fall arrest force to 1,800 lbf max at body. ANSI Z359 standards.
- Lanyard typical 6 ft. SRL (Self-Retracting Lifeline) locks within 2-3 ft of fall, limits arrest force to ~500 lbf, preferred for long pole climbs.
- 100% tie-off = continuous connection during transitions. Twin-leg lanyard (Y-shape) for one-anchor-released-only-after-other-engaged.
- Fall protection required >4 ft on a pole per 29 CFR 1910.268(g).
- Aerial lifts (bucket trucks, boom, scissor) per 29 CFR 1910.67. Workers attached to basket/boom at all times.
- Body belt alone NEVER used as fall arrest — only as positioning. Full body harness for fall arrest per ANSI Z359.11.

**L05 PPE (29 CFR 1910.132, 1910.137):**
- Rubber insulating glove classes (ASTM D120): Class 00 ≤500V, Class 0 ≤1,000V, Class 1 ≤7,500V, Class 2 ≤17,000V, Class 3 ≤26,500V, Class 4 ≤36,000V.
- Hard hat classes (ANSI/ISEA Z89.1): Class E (Electrical) = up to 20,000V phase-to-ground (required near distribution). Class G (General) = up to 2,200V. Class C (Conductive) = no electrical rating.
- Dielectric boots = EH rated (ASTM F2412/F2413), resists circuit through sole, required for linework / ground rod work.
- Hi-vis vest per ANSI/ISEA 107: Class 2 minimum daytime roadway. Class 3 for night or >50 mph.

**L06 Traffic Control (MUTCD Part 6):**
- MUTCD = Manual on Uniform Traffic Control Devices (FHWA). Part 6 = temporary traffic control (TTC).
- TCP = Traffic Control Plan (site-specific drawing of devices).
- Work zone has 4 sections: advance warning → transition (taper) → activity → termination.
- Taper = lane reduction with cones at diagonal. MUTCD prescribes minimum taper length by lane width × speed.
- Buffer = vehicle recovery space (lateral + longitudinal). Workers DON'T stand in buffer.
- Flagger certification = state-required (ATSSA, ACCES, state DOT training).

**L07 Working Near Energized Conductors (29 CFR 1910.269):**
- MAD = Minimum Approach Distance (qualified electrical workers, calculated via 1910.269 App B formula, not a table). Use OSHA MAD calculator.
- MAB = Minimum Approach Boundary (visual boundary at or beyond MAD; unqualified workers stay outside MAB).
- Most OSP telecom workers are NOT 1910.269-qualified. They must stay outside MAB. If work requires getting closer → STOP, call utility.
- Flashover = arc jumping through air; can kill at distance — don't have to touch.

**L08 Hazardous Materials:**
- PEL = Permissible Exposure Limit (OSHA, legally enforceable, 8-hr TWA, 29 CFR 1910.1000 Table Z-1).
- TLV = Threshold Limit Value (ACGIH, recommended, not legal, often more conservative than PEL).
- GHS = Globally Harmonized System (OSHA HazCom 2012, 29 CFR 1910.1200, 16-section SDS format with pictograms).
- Common OSP hazards: fill gel (petroleum), HDPE/conduit fumes, silica dust (concrete cutting), battery acid, diesel fuel, splice cement.

**L09 Incident Reporting & OSHA 300:**
- OSHA Form 300 = log of recordable incidents (29 CFR 1904). Form 300A = annual summary posted Feb 1 - Apr 30. Kept 5 years.
- Recordable = death, days away, restricted, transfer, treatment beyond first aid, LOC, significant diagnosis (29 CFR 1904.7).
- Near-miss = potential incident, voluntary reporting.
- DART = Days Away, Restricted, or Transferred (rate metric for benchmarking).
- Severe incident reporting per 29 CFR 1904.39: Fatality = 8 hours to OSHA. Hospitalization/amputation/eye loss = 24 hours.

**L10 T18 Capstone Quiz** (no new content).

### T02 Fiber Physics

**L01 Why Light Travels in Glass:**
- TIR = Total Internal Reflection (light bounces off core-cladding boundary; nothing escapes).
- Core = inner glass (9 µm SMF, 50/62.5 µm MMF). Cladding = outer glass, lower index. Both glass; 125 µm total cladding diameter.
- Index of refraction: vacuum=1.0, air≈1.0, glass≈1.46-1.50.
- Critical angle: TIR happens for rays hitting boundary at angle ≥ critical angle from normal. G.652.D: sin(θc)=n2/n1 ≈ 0.9966, θc ≈ 85.3° from normal.
- NA = Numerical Aperture = sin of acceptance cone half-angle. NA = √(n1² - n2²). G.652 SMF NA ≈ 0.12-0.14.
- G.652.D = standard SMF (low water-peak, tight chromatic dispersion). Most common ITU-T SMF.
- MFD = Mode Field Diameter (effective beam diameter, slightly larger than core because evanescent field extends into cladding). G.652.D at 1310nm = 8.8-9.6 µm (9.2 ± 0.4 nominal). MFD mismatch causes splice loss.

**L02 Attenuation Three Numbers:**
- Attenuation = signal loss measured in dB/km.
- Three numbers framework: (1) Spec maximum (ITU-T G.652.D), (2) Typical datasheet, (3) Designer planning value.
- G.652.D attenuation table:
  - 1310 nm: ≤0.40 spec / 0.32-0.36 datasheet / 0.35 planning
  - 1550 nm: ≤0.30 spec / 0.18-0.22 datasheet / 0.22-0.25 planning
  - 1625 nm: ≤0.40 spec / 0.20-0.23 datasheet / 0.25 planning
- Loss mechanisms: Rayleigh scattering (∝1/λ⁴, drops as wavelength rises), Infrared absorption (>1700nm), OH⁻ water peak at 1383nm.
- G.652.D = low-water-peak (suppressed 1383nm peak). G.652.B has large water peak.
- Connector loss: TIA-568 legacy max 0.75 dB; typical 0.30-0.50 dB.
- Fusion splice loss: planning 0.15 dB; field target ≤0.05 dB; acceptance ≤0.10 dB bidirectional average.
- Mechanical splice: 0.30-0.50 dB typical (avoid in OSP except emergency).

**L03 Dispersion:**
- Dispersion = pulse smearing in time (different from attenuation = signal loss).
- Chromatic dispersion (CD) = dominant in SMF. Different wavelengths travel at different speeds. Units: ps/(nm·km).
- Zero-dispersion wavelength: G.652 = 1300-1324 nm. Near 1310 nm = low CD = forgiving for short links.
- Modal dispersion = in MMF (different mode paths arrive at different times). Why MMF has bandwidth limits (MHz·km).
- PMD = Polarization Mode Dispersion (two polarization orientations travel differently). Only matters >10 Gb/s on older fiber.

**L04 Macrobend/Microbend:**
- Macrobend = visible bend (kink, tight loop). Discrete OTDR event. Bend radius cm-scale.
- Microbend = invisible micro-deformations (sub-mm). Elevated background attenuation on OTDR.
- Bend radius rules of thumb: 20× cable OD dynamic (pulling), 10× cable OD static (after install).
- G.657 = bend-insensitive SMF (trench/ring profile). G.657.A1 splices to G.652.D. G.657.B2/B3 may have MFD mismatch.
- Mandrel test = qualification test (wrap around specified cylinder, measure added loss).

**L05 Decibels:**
- dB = decibels (relative). dBm = absolute (referenced to 1 mW). 0 dBm = 1 mW.
- 3 dB = half power. 10 dB = 1/10 power. 20 dB = 1/100 power.
- Tx range typical: -5 to +10 dBm. Rx sensitivity typical: -20 to -35 dBm.
- Formula: dBm = 10×log10(P_mW).

**L06 Link Budget:**
- Link budget = Tx power - Rx sensitivity (total dB you can spend).
- Total losses: fiber attenuation × distance + connectors + splices + safety margin.
- Safety margin = 3 dB standard (covers aging, thermal, future re-splices).
- Optical headroom = budget - total loss. Must be positive. >6-8 dB comfortable.

**L07 Wavelength Windows:**
- Main OSP wavelengths: 1310, 1490, 1550, 1625 nm. 850 nm = MMF.
- O-band (Original): 1260-1360 nm. Near zero-dispersion. GPON upstream 1310. Spec ≤0.40 dB/km.
- C-band (Conventional): 1530-1565 nm. Lowest attenuation in G.652.D. DWDM workhorse. Higher CD (~17 ps/nm-km).
- L-band: 1565-1625 nm. In-service OTDR testing (1625 nm reveals macrobend better than 1550).
- WDM = Wavelength Division Multiplexing. CWDM = 20 nm spacing (18 channels). DWDM = 0.8 nm or 0.4 nm spacing in C-band (80-96 channels), used long-haul.
- EDFA = Erbium-Doped Fiber Amplifier (boosts C-band). Why DWDM can span hundreds of km.
- PON wavelengths: GPON downstream 1490, upstream 1310, RF video 1550.

**L08 SMF vs MMF:**
- OM grades (MMF): all 50 µm except OM1=62.5 µm.
- OM1: 200 MHz·km @ 850. 10GbE max 33 m. Orange. Legacy.
- OM2: 500 MHz·km @ 850. 10GbE max 82 m. Orange. Legacy.
- OM3: EMB 2,000 MHz·km @ 850 (laser-optimized). 10GbE max 300 m. Aqua.
- OM4: EMB 4,700 MHz·km @ 850. 10GbE max 400 m. Aqua.
- OM5: EMB 4,700 MHz·km @ 850 (same as OM4) + 2,470 MHz·km @ 953 nm (SWDM4). Lime green. 10GbE ~400 m, 25GbE ~100 m, 100GbE SWDM4 ~150 m.
- OS2 = G.652.D SMF. Max attenuation 0.4 dB/km @ 1310, 0.3 @ 1550. Yellow.
- OS1 = older G.652.A/B/C (higher water peak, rare new).
- G.655 (NZ-DSF) = Non-Zero Dispersion Shifted SMF, used in carrier DWDM backbones (suppresses four-wave mixing).
- Laser-optimized MMF: OM3/OM4 for 850 nm VCSEL; OM5 adds 953 nm VCSEL (SWDM4).

**L09 PMD:**
- PMD = Polarization Mode Dispersion. DGD = Differential Group Delay (ps).
- PMD accumulates as √(length), units ps/√km. G.652.D max = 0.2 ps/√km.
- Birefringence = different refractive indices for different polarizations → root cause of PMD.
- PMD-limited spans: older fiber at 40+ Gb/s, or mechanically stressed fiber.

**L10 Fiber Characterization:**
- Beyond standard acceptance testing. CD measurement, PMD measurement, cut-back method (destructive, lab gold-standard for attenuation), OTDR characterization (multi-wavelength: 1310/1550/1625).
- Dispersion slope = how CD changes with wavelength (ps/nm²/km), important for DWDM compensation.

**L11 Fiber Physics Field vs Book:**
- Temperature affects attenuation (cold +0.01-0.05 dB/km @ -40C).
- Aging loss: gradual increase over 20-30 yr (connectors degrade, splice case stress, lashing corrosion).
- G.657.A1 splices fine to G.652.D (<0.05 dB additional). G.657.B2/B3 MFD mismatch with G.652.D.
- Field margin: add 0.5-1.5 dB above theoretical loss for aging+temperature.

**L12 T02 Capstone Quiz** (integrative).

### T03 Cable Selection & Materials

**L01 Cable construction types:**
- Loose-tube = dominant in OSP trunk. Fibers float in gel-filled tubes.
- Tight-buffered = ISP indoor (tightly bonded buffer around each fiber). MISUSE: tight-buffered in OSP = water ingress + fiber stress failures.
- Ribbon = 12 fibers bonded flat. Mass-fusion splicing (1 ribbon = 12 fibers in 10 sec).
- Rollable ribbon = intentionally flexible bonding, modern.
- TIA-598-D 12-color: Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua.
- ICEA S-87-640 = OSP fiber cable construction standard.

**L02 OSP/Riser/Indoor-Outdoor:**
- OFNR = Riser (NEC Article 770). OFNP = Plenum (more stringent fire). NEC 50-ft rule (§770.48(A)): unlisted OSP cable may not extend more than 50 ft into a building.
- Outdoor-rated = UV-stable, moisture-resistant. Dual-rated cable = OSP + OFNR/OFNP, eliminates building-entry transition splice.

**L03 Armor & Jacket Selection:**
- CST = Corrugated Steel Tape armor (most common, rodent protection). Interlocked armor = continuous spiral steel/aluminum. CAT = Corrugated Aluminum Tape (no galvanic issues in corrosive soils).
- Direct-burial cable rated for soil contact.
- NEC §770.179(B) = permitted indoor armor configurations for riser.

**L04 Lashed vs ADSS:**
- Lashed = separate steel messenger + lashing wire. ADSS = self-supporting all-dielectric. OPGW = Optical Ground Wire (combines optical fiber + electrical ground wire, high-voltage transmission).
- EDS = Everyday Stress (typical operating tension). RTS = Rated Tensile Strength. EDS target: 16-25% of RTS.
- Figure-8 cable = pre-fab messenger + fiber in one. Cheaper than lashing for short runs.
- Lashing wire = stainless steel, attached via lashing machine.

**L05 G.652 vs G.657:**
- G.652.D = standard SMF. G.657 = bend-insensitive.
- G.657.A1 splice-compatible with G.652.D. G.657.A2 = tighter bends (7.5-10mm). G.657.B3 = ultra-tight (≤5mm) NOT guaranteed splice-compatible with G.652.D (MFD mismatch).
- Trench-assisted profile = depressed index ring in cladding = better confinement.
- Bend radius decision tree: ≥30mm = G.652.D, 10-30mm = A1, 7.5-10mm = A2, ≤5mm = B3.
- FOA bend rule: 20× OD dynamic, 10× OD static (OD = cable outer diameter NOT fiber coating).
- 2024 ITU-T merged B2 into A2.
- G.656 = wideband NZ-DSF.

**L06 Sheath & Jacket Materials:**
- HDPE with 2-3% carbon black = standard OSP jacket (UV protection).
- LSZH = Low-Smoke Zero-Halogen (chemistry, NOT a fire rating). Independent from OFNR/OFNP NEC listing.
- Flooding compound = gel-filled (water-blocking). Dry-block (SAP tape/yarn) = cleaner alternative, faster splice prep.

**L07 Armor Deep Dive:**
- CAT preferred in corrosive soils (no galvanic corrosion). CST cheaper.
- Dielectric cable = no metal = no bonding/grounding required at poles.

**L08 Drop Cable:**
- Feeder (72-288F) → Distribution (12-48F) → Drop (1-2F).
- Dark fiber = unused fibers reserved for future activation (growth margin).
- Drop types: figure-8 (steel messenger built-in), ADSS, lashed.

**L09 ADSS Span/Wind/Ice:**
- NESC loading districts: Heavy / Medium / Light.
- MAT = Maximum Allowable Tension.
- Parabolic sag formula: sag = (w × L²) / (8 × H) where w=weight per unit length, L=span, H=horizontal tension.
- Extreme Wind loading (NESC Rule 250C) supplements three-district table for hurricane-prone zones.
- Macon, GA = Light loading district.

**L10 ICEA S-87-640 & 7 CFR 1755.902:**
- Qualification testing = per design type (one-time, full battery). Acceptance testing = per lot (production).
- 7 CFR 1755.902 = RUS materials compliance (MFD tolerance requirements).
- ICEA S-87-640 = construction standard. 7 CFR 1755.902 = federal compliance.

**L11 Cable Spec Reading:**
- Tolerance band concept for measured attenuation.
- Aging factor added to datasheet for link budget planning.
- TIA-526 = optical loss measurement test conditions.

**L12 T03 Capstone Quiz.**

### T04 Route Survey & Pre-Engineering

**L01 Site Walk:** structured field inspection. Hazard ID, photo log, existing utilities. Inputs to design.

**L02 Drone/LiDAR:**
- LiDAR = Light Detection and Ranging (pulsed laser, 3D point cloud, sees through tree canopy).
- Drone = UAS (Unmanned Aerial System), FAA Part 107 governs commercial.
- RTK GNSS = Real-Time Kinematic GPS (cm-accuracy positioning).
- GSD = Ground Sample Distance (resolution per pixel).
- Photogrammetry = 3D model from overlapping photos.

**L03 GIS Landbase:**
- Shapefile (.SHP) = Esri vector format. Geodatabase = newer Esri DB format. KMZ/KML = Google Earth.
- Coordinate systems: UTM, NAD83 (US datum). Datum mismatch = position errors of 1-2 m.

**L04 Pole Audit:**
- Field measurement of pole class/height + attachment heights + existing occupancy.
- Make-ready flag = pole needs adjustment before new attachment.
- Records vs reality often diverge — pole audit is the truth.

**L05 Route Alternatives:**
- Cost-effectiveness, constructability, permitting risk = scoring dimensions.
- Aerial cheaper to build but storm-prone. Underground more expensive but more reliable long-term.

**L06 KMZ/Shapefile/PDF Deliverables:**
- KMZ = compressed KML (Google Earth, visual share).
- .SHP = Esri shapefile (vector with attributes, for GIS analysis).
- Geotiff = georeferenced image. PDF/A = archival PDF.
- DWG = AutoCAD format.

**L07 47 CFR Part 32 Record-Keeping:**
- 47 CFR Part 32 = FCC Uniform System of Accounts (plant accounting).
- Plant accounts: §32.2411 Poles, §32.2421 Cable aerial, §32.2422 Cable underground, §32.2423 Cable buried, §32.2441 Conduit, §32.2410 Cable & wire facilities (parent), §32.2210 Central office switching, §32.2411 Poles. (NOT §32.2210 = Land — that's wrong; §32.2210 = Central office switching.)
- RUS Form 1755-A = materials approval.
- Record retention rules for RUS borrowers.

**L08 Handoff to Design:**
- Survey package: as-surveyed (field) → as-designed (engineered). Quality gate before design.
- Gap analysis = identifying missing data before design begins.

**L09 RUS Pre-Engineering:**
- RUS construction unit codes for materials/labor estimation.
- RUS field engineering data sheets.
- Construction package conventions per 7 CFR Part 1753.

**L10 T04 Capstone Quiz.**

### T09 Permitting & Environmental

**L01 Permitting Layer Cake:** Federal nexus triggers NEPA/§106/ESA. AHJ = Authority Having Jurisdiction. BEAD = Broadband Equity, Access, and Deployment (NTIA program).

**L02 NEPA CE/EA/EIS:**
- 3 NEPA tiers: CE (Categorical Exclusion, streamlined), EA (Environmental Assessment, leads to FONSI), EIS (full Environmental Impact Statement).
- CE C-8 = telecom categorical exclusion (used by RUS, but NTIA BEAD uses Commerce-level CEs, NOT C-8).
- 42 USC §4321 = NEPA statutory anchor.
- 40 CFR Part 1500-1508 = CEQ rules (REMOVED effective Jan 8, 2026).
- 7 CFR Part 1b (effective April 3, 2026, replaces 7 CFR Part 1970) = RUS NEPA procedures.
- Extraordinary circumstances elevate CE → EA.
- FONSI = Finding of No Significant Impact.

**L03 Section 106:**
- NHPA §106 (54 USC §306108). 36 CFR Part 800 (ACHP regulations).
- SHPO = State Historic Preservation Officer. APE = Area of Potential Effect.
- 30-day SHPO clock starts on RECEIPT of adequate package (not submission).
- Adverse effect = changes that diminish historic property qualities.

**L04 ESA Bats IPaC:**
- ESA = Endangered Species Act, 16 USC §1536 §7 consultation.
- IPaC = Information for Planning and Consultation (USFWS tool, ipac.ecosphere.fws.gov).
- DKey = Determination Key in IPaC.
- T&E = Threatened & Endangered species.
- Bats: standard mitigation = tree-clearing avoidance window (typically Nov-Mar for hibernating bats).
- NLEB (Northern Long-Eared Bat) = endangered (87 FR 73488 reclass).

**L05 USACE Wetlands NWP 57:**
- USACE NWP 57 = telecom water crossings (replaced NWP 12 for telecom post-2021). NWP 12 now only oil/gas. NWP 57 reissued in 2026 NWP package effective March 15, 2026.
- CWA §404 = Clean Water Act dredge/fill. RHA §10 = Rivers and Harbors Act (navigable waters).
- PCN = Pre-Construction Notification (required under NWP 57 above certain thresholds).
- Post-Sackett (2023) jurisdictional determination changed WOTUS scope.

**L06 State DOT Encroachment:**
- Encroachment permit packet: PE-stamped drawings, TCP, surety bond, as-built obligation.
- State DOT review timelines vary. TxDOT ROW Manual §4 = example.

**L07 ROW & Easements:**
- 4 private-property access instruments: prescriptive easement (legal risk on legacy routes), express easement (recorded, best), license (revocable), fee-simple acquisition, dedication.
- Grantor = property owner granting easement.

**L08 Municipal ROW:**
- Franchise agreement = master ROW use authorization. ROW encroachment permit = per-job. New ISP needs franchise.
- FCC BDAC 60-day shot clock for ROW permit decisions (FCC 18-111).
- 47 USC §253(a) = federal preemption of barriers to telecom entry.
- Pavement cut moratorium = post-paving restriction window.

**L09 Tribal Coordination:**
- THPO = Tribal Historic Preservation Officer (replaces SHPO on tribal lands).
- NHO = Native Hawaiian Organization.
- Government-to-government consultation per 36 CFR §800.2(c)(2)(ii). Can extend timeline >30 days.
- ACHP Tribal Handbook.

**L10 Permit Tracking PM:**
- Permit matrix shows parallel/sequential dependencies.
- Critical-path permit = the long pole determining construction start date.

**L11 RUS Environmental Review:**
- 7 CFR Part 1b = current RUS NEPA (replaces Part 1970, effective April 3, 2026).
- CE checklist for routine projects. EIM = Environmental Impact Memorandum (when CE checklist insufficient but no full EA needed).
- RUS Form 307 = environmental compliance documentation.
- NTIA BEAD uses Commerce-level CEs, NOT RUS's C-8 nomenclature.

**L12 T09 Capstone Quiz.**

### T05 OSP Design — Aerial

**L01 What NESC Is:** IEEE C2. Structure: Parts, Sections, Rules. Adopted by states.
**L02 Rule 232 Vertical Clearance:** Table 232-1. ~15.5 ft for telecom over road traffic. Lowest point at FINAL sag under loading. Design margin 1-2 ft above min.
**L03 Rule 235 Comm-to-Supply Separation:** Table 235-5. ~40 inches at pole; less at midspan often acceptable. Joint-use zones.
**L04 Grades of Construction (Rule 261):** Grade B (most stringent, for crossings/critical), Grade C (less, common telecom), Grade N (least, special). Section 26 = load/strength factors.
**L05 Pole Loading:** Wind span (horizontal force span) vs weight span (vertical force span). Pole-loading SW (O-Calc Pro, SPIDAcalc) for designs.
**L06 Rule 250 Loading Districts:** 4 districts: Light (0", 9 psf, +30°F), Medium (0.25", 4 psf, +15°F), Heavy (0.5", 4 psf, 0°F), Extreme Wind (varies). Ice load w_ice = 1.244 × t × (D+t) where t=ice thickness, D=cable OD. Vector sum: w_resultant = √(w_v² + w_h²). Macon GA = Light district.
**L07 Sag-Tension:** Catenary curve, parabolic approximation good when sag < 5% span. Sag formula: s = (w × L²) / (8 × H). Initial sag (just installed) < Final sag (after creep). Use Final for clearance.
**L08 Joint Use:** ILA = Interagency Licensing Agreement. Overlashing rights per 47 CFR Part 1 Subpart J.
**L09 OTMR (47 CFR §1.1411):** FCC 18-111. Simple vs complex make-ready. Timeline clocks: 15 business days for simple make-ready (post 2018 rules); 90 day completion deadline once attacher exercises OTMR.
**L10 ADSS Aerial Design:** EDS 16-25% of RTS (rated tensile strength). Aeolian vibration = wind-induced vibration → dampeners. Span tables from manufacturer.
**L11 OPGW:** Optical Ground Wire. Combined fiber + ground/shield wire on transmission. NOT a joint-use product. Handles fault current.
**L12 PON/FTTH Aerial Topology:** GPON, EPON, XGS-PON. Splitter loss (1:32 ≈ 15-17 dB, 1:64 ≈ 18-20 dB). FDH placement balances feeder length and distribution.
**L13 Make-Ready in Design:** 3 conflict types: attachment height, midspan, transfer. Make-ready cost estimate. Design holds when uncertain.
**L14 Aerial Design QA Checklist:** Common errors that cause permit rejections.
**L15 T05 Capstone Quiz.**

### T06 OSP Design — Underground

**L01 Methods:** HDD (bore under obstacle), open-cut (trench), plowing (vibratory plow). Decision matrix per route profile.
**L02 Burial Depth:** Tier: RUS (1751F-635) → NEC 830.47 floor → AHJ override. AHJ permit always binding. Common min cover 24-36" under roads, 18-24" lawn.
**L03 Conduit selection:** Schedule 40 PVC (thinner wall, economical), Schedule 80 PVC (thicker wall, mechanical/UV exposure). HDPE for HDD (continuous, fused joints). Innerduct = sub-conduit inside larger bore. Microduct = small for blown fiber.
**L04 Conduit Fill / Pull Tension:** 40% fill rule (cable cross-section ≤40% of conduit ID area). Exceeding causes jam ratio issues. Pull tension with friction factor. Mid-assist pulling for long runs.
**L05 Manhole/Handhole/Vault:** Manhole=person-entry, Handhole=arm-entry only. H-20 loading = AASHTO 20-ton (highway), H-25 = 25-ton (newer/heavier). Vault = larger structure for splices+slack.
**L06 Separation from Foreign Utilities:** APWA color codes 8 colors:
- Red = Electric
- Yellow = Gas/oil/steam
- Orange = Communications/telecom
- Blue = Potable water
- Green = Sewer/drain
- Purple = Reclaimed water/irrigation
- White = Proposed excavation
- Pink = Temporary survey markings
- 811 = Call Before You Dig (national locate service). Doesn't include private laterals.
**L07 Directional Boring (HDD):** 3-phase: pilot bore → reaming (1-3 passes) → product pullback. Bentonite slurry for lubrication, cuttings removal, hole stability. Ground heave risk = inadvertent return (frac-out).
**L08 Riser/Pedestal/NIU:** Riser = vertical conduit transition (underground to aerial). Pedestal = above-grade splice/storage box. NIU = Network Interface Unit (drop demarc). Vaulted NIU for flood zones.
**L09 NESC §34/§35:** §34 = Cable in Underground Structures (supply+comm). §35 = Direct-buried + Cable in Duct (supply+comm). §32 = Underground Conduit Systems (supply infra). §33 = Supply Cable. Communication/supply separation via Rules 320, 353, 354.
**L10 RUS 1751F-643:** Innerduct qualification standard.
**L11 Underground QA Checklist.**
**L12 T06 Capstone Quiz.**

### T19 Headend/CO + Rack-Side Hardware Basics

**L01 CO/Hut/Headend:** CO = Central Office (large). OLT hut = small remote (FTTH). Headend = cable TV/hybrid. MDF/ODF = OSP-to-ISP handoff.
**L02 OLT/CMTS as Black Boxes:** OLT = GPON line-card host. CMTS = Cable Modem Termination System (HFC, DOCSIS). Downstream = OLT→ONT. Upstream = ONT→OLT.
**L03 -48VDC Power Plant:** Telecom DC. Rectifiers (AC→DC). Float voltage ~54V. VRLA (valve-regulated lead-acid) vs lithium batteries.
**L04 Battery Backup & Generator:** ATS = Automatic Transfer Switch. Transfer time matters. Load testing required. Fuel polishing for remote sites.
**L05 HVAC & Fire Suppression:** CRAC = Computer Room Air Conditioner. Clean-agent fire suppression (FM-200, Novec) preferred over water. Pre-action sprinkler systems. ASHRAE thermal envelope.
**L06 Headend Grounding (OSP↔ISP boundary):**
- Primary protector = clamps incoming OSP overvoltage (~600V from MGN faults).
- IBT = Intersystem Bonding Termination (NEC Art. 250.94, required tie-in point).
- TBB = Telecommunications Bonding Backbone (TIA-607).
- TMGB = Telecommunications Main Grounding Busbar.
- TGB = Telecommunications Grounding Busbar.
- GES = Grounding Electrode System.
**L07 Rack-Side Hardware:**
- Patch panel vs LIU (Light Interface Unit).
- ODF = Optical Distribution Frame.
- Interconnect (direct port-to-port) vs Cross-connect (intermediate frame with jumpers).
**L08 FOSC in Headend:** Fiber Optic Splice Closure. Rack-mount FOSC. Gel-free preferred. Express fiber vs split fiber.
**L09 FDH Internals:** Modular bays, splitter cassettes, connector fields. Demarcation between OSP distribution and drop sides.
**L10 T19 Capstone Quiz.**
**L11 OSP↔ISP Handoff Walkthrough:** Demarcation point and responsibility boundaries.

### T14 Bonding, Grounding & Electrical Protection

**L01 Why Ground (Drain Analogy):**
- Grounding = connection to earth via electrode (drain).
- Bonding = connection of two metal parts to equalize potential.
- Fault current = abnormal current flowing during fault.
- GPR = Ground Potential Rise (voltage rise of grounded structure during fault).
- Equipotential = all bonded parts at same voltage.

**L02 MGN (Multi-Grounded Neutral):**
- Neutral wire grounded at multiple points per mile.
- NESC requires minimum grounds per mile (typ 4 per mile + 1 at every transformer).
- Neutral-to-ground bond at every grounding point.

**L03 Messenger Bonding:**
- NESC Rule 215D (NOT 96F — that's fabricated). Bond clamp + downlead.
- ADSS exempt (no metal).
- Bonded-messenger separation rules.

**L04 NEC 250.52 Electrodes:**
- Allowed electrodes: ground rod (5/8" × 8 ft copper-clad), Ufer (concrete-encased ≥20 ft bare ≥4 AWG copper or ½" rebar), water pipe (≥10 ft contact + supplemental), ring electrode, plate.
- Supplemental rod rule: ground rod alone needs supplemental electrode (NEC 250.53(A)(2)) unless measured ≤25Ω.

**L05 IBT & GES:**
- IBT = Intersystem Bonding Termination (NEC 250.94 — required at building service for telecom bonding).
- GES = Grounding Electrode System.
- PBB = Primary Bonding Busbar (TIA-607-D, in main telecom room).
- SBB = Secondary Bonding Busbar (in subordinate telecom rooms).
- TBB = Telecom Bonding Backbone (between PBB and SBB).
- TMGB/TGB = older TIA-607 names = current PBB/SBB.

**L06 Ground Resistance Testing (IEEE 81):**
- Fall-of-Potential method: drive current probe far away, potential probe at 62% of distance to current probe.
- Clamp-on method = no probes, uses induced current.
- Soil resistivity affects readings.
- Acceptance: NEC ≤25Ω (with supplemental rule). RUS GR-1275 may require ≤5Ω.

**L07 Surge Arresters:**
- MOV = Metal-Oxide Varistor (most common). Gas-tube arrester.
- VPL = Voltage Protection Level.
- Ground ring = perimeter buried conductor at facility.

**L08 Stray Voltage:**
- Induced AC voltage from parallel power lines on messenger.
- Floating messenger = not bonded to MGN/GES.
- LOTO sequence before work near stray voltage.
- Contact-voltage test instrument.

**L09 Cathodic Protection:**
- Corrosion cell = anode/cathode/electrolyte/circuit. Sacrificial anode protects buried metal.
- Dielectric flange = isolates dissimilar metals (NACE SP0169).

**L10 RUS Bonding & Grounding:**
- Bonding schedule = list of every electrode on aerial plant route with measured resistance.
- Ground test log for close-out.
- Part of RUS Form 219 close-out.

**L11 NESC §9 Grounds-Per-Mile:**
- Maximum spacing between successive ground electrodes.
- NESC §9 + RUS 1751F-630 §7 — controlling requirement is shorter interval.

**L12 T14 Capstone Quiz.**


### T07 Staking

**L01 What a Staker Does:** Precision data-capture. 4 outputs: pole ID, attachment heights, span measurements, make-ready notes.
**L02 Reading Plans in Field.**
**L03 Photographing/Coding Pole Tags.**
**L04 Measuring Existing Attachments:** Tape, laser rangefinder, height stick.
**L05 Staking Notes - RUS Form 740:** Field deltas vs design.
**L06 Make-Ready Data Collection.**
**L07 Underground Staking - Marking Route:** APWA colors. White = proposed excavation.
**L08 Katapult & GIS Staking Tools.**
**L09 Staking QA:** Engineer review.
**L10 T07 Capstone Quiz.**

### T08 Make-Ready & Pole Attachment

**L01 OTMR vs Multi-Party (47 CFR §1.1411, FCC 18-111):**
- OTMR = attacher hires single contractor to do all make-ready (faster, simpler attachments).
- Multi-party = each existing attacher does own moves (complex make-ready).

**L02 The 15-Day Clock:**
- FCC 15-day completion deadline for simple make-ready.
- Self-help remedy = attacher can hire own contractor after deadline (§1.1411(i)).
- §1.1404 = complaint proceedings.
- Clock starts on application acceptance.

**L03 Simple vs Complex Attachment:** Simple = within existing safe envelope, no other moves needed. Complex = requires moves of other attachments.
**L04 Transfer:** Moving someone else's wire to make room.
**L05 Reframe:** Adjusting without moving (re-tensioning, re-clamping).
**L06 Pole Replacement:** When existing pole insufficient.
**L07 Reading Make-Ready Estimate:** Cost breakdown line items.
**L08 Attachment Fees:** Annual rents per FCC formula (47 CFR 1.1409). Cable formula vs telecom formula (Cable formula = lower; FCC eliminated distinction in 2018 → unified rate for all telecom services).
**L09 Application→Permit→Inspection:** Application sequence and timelines.
**L10 As-Built Notification:** Notify pole owner after construction with as-built data.
**L11 Make-Ready as PM Problem:** Schedule + cost management.
**L12 T08 Capstone Quiz.**

### T10 OSP Construction

**L01 Call 811 Before You Dig:** 811 = national locate hotline. State 1-Call laws. 48-72 hr advance notice typical. Failure = serious safety + legal issue.
**L02 HDD Execution:** Pilot bore → reaming → pullback. Bentonite slurry. Inadvertent return (frac-out) detection.
**L03 Open-Cut & Plow:** Trenching, vibratory plowing.
**L04 Burial Depth Verification:** Probe rod, inspection during backfill.
**L05 Conduit Pull Tension:** Force monitoring. 600 lbf typical limit for fiber.
**L06 Slack Loops:** Storage at each splice case. Typical 30-50 ft slack.
**L07 Manhole & Handhole Installation:** H-20 GVW (Gross Vehicle Weight, AASHTO H-20 = 32,000 lb axle, 20-ton load rating typical). H-25 newer. Confined space safety per 29 CFR 1910.146(b) + 1926.651 (excavation 4-ft trench protection).
**L08 Pavement & Sod Restoration:** Match existing pavement spec. Sod restoration timing.
**L09 Traffic Control:** MUTCD Part 6 in field.
**L10 Daily Field Reporting:** Daily logs.
**L11 Field QA & Inspector Interface.**
**L12 T10 Capstone Quiz.**

### T11 Splicing

**L01 Why We Color-Code Fibers:** Identification.
**L02 TIA-598 12-Color Sequence:** Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua (BOG-BSW-RBY-VRA).
**L03 Splice Loss 4 Numbers:** Fusion machine estimate, OTDR estimate, bidirectional OTDR average, optical power meter.
**L04 Fusion Splicing Step-by-Step:** Strip → clean → cleave → arc fusion → protector sleeve → tray.
**L05 Core-Align vs Cladding-Align:** Core-align splicers (more expensive, used for high-loss-critical splices). Cladding-align splicers (cheaper, suitable for low-tolerance applications).
**L06 Cleave Angle:** Target ≤0.5°. >1° = poor splice.
**L07 Ribbon/Mass Fusion Splicing:** 12 fibers at once. ~10 sec per ribbon.
**L08 Mechanical Splicing:** Mechanical alignment + gel. 0.3-0.5 dB loss. Emergency or temporary only.
**L09 Splice Case Types:** Dome vs inline. Re-enterable vs heat-shrink.
**L10 Gel-Seal vs Heat-Shrink vs Re-enterable:** Sealing methods.
**L11 Splice Tray Loading & Fiber Management:** Bend radius (30mm typical). Slack storage.
**L12 Connector Loss 3 Numbers:** Standards max (0.75 dB legacy TIA-568), reference grade (tighter), typical field (0.30-0.50 dB).
**L13 Splicer Maintenance Schedule.**
**L14 Field Hygiene Before First Cleave:** Cleaning isopropyl alcohol, lint-free wipes.
**L15 T11 Capstone Quiz.**

### T12 Testing — OLTS, OTDR, Inspection

**L01 Tier 1 vs Tier 2 (OLTS vs OTDR):**
- Tier 1 (OLTS) = end-to-end insertion loss. Faster, simpler. Source + meter.
- Tier 2 (OTDR) = full trace, locates events (splices, bends, breaks, connectors).

**L02 OLTS Reference Methods & Bidirectional Loss:**
- 1-jumper, 2-jumper, 3-jumper reference methods (TIA-568.3-D).
- 1-jumper = most accurate (includes both connector pairs).
- Bidirectional loss = average of A→B and B→A measurements.

**L03 OTDR Fundamentals:**
- Pulse width: short pulse (narrow dead zone, low dynamic range), long pulse (wider dead zone, high dynamic range).
- Range: must exceed fiber length.
- Averaging: more averages = less noise, longer test time. 30 sec typical.

**L04 Dead Zones (EDZ and ADZ):**
- EDZ = Event Dead Zone (can detect events after this distance from a reflection).
- ADZ = Attenuation Dead Zone (can measure loss after this distance).
- EDZ < ADZ. Use launch cable to push first connector beyond OTDR dead zone.

**L05 Ghost Reflections:** Echo of strong reflection appearing later in trace. Use long-enough range. Use APC connectors.

**L06 Launch & Receive Cables, MFD Matching:**
- Launch cable = pushes first connector past dead zone (~100-500 m typical).
- Receive cable = allows measurement of last connector.
- MFD mismatch causes false splice loss.

**L07 Bidirectional OTDR — When & Why:**
- Splice can appear as gain (apparent negative loss) due to backscatter mismatch.
- Bidirectional average reveals true loss.
- Always required for acceptance testing per TIA-568.3-D.

**L08 Reading OTDR Trace:** Event types: connector (sharp reflection), splice (small step, no reflection), break (large reflection + end of trace), macrobend (small step, no reflection at long wavelength only).

**L09 Macrobend Detection (Dual Wavelength):**
- Test at 1310 + 1550 + 1625 nm.
- Macrobend loss higher at longer wavelengths (1625 > 1550 > 1310).
- 1625 nm reveals bends invisible at 1310.

**L10 IOR Distance Errors & Cursor Pitfalls:**
- IOR = Index of Refraction. OTDR uses IOR to convert time to distance.
- Wrong IOR = wrong distance. G.652.D IOR ~1.467 @ 1550, ~1.466 @ 1310. Common default 1.4677.
- Cursor placement matters; document.

**L11 End-Face Inspection (IEC 61300-3-35):**
- Standard for connector cleanliness.
- Zones A/B/C/D = core/cladding/contact/outside.
- Pass/fail criteria for SM connectors:
  - Zone A (core, 0-25µm): no scratch >0; no defect.
  - Zone B (cladding, 25-115µm or 25-120µm 2022 update for SM connectors): no scratch >3µm; ≤5 defects 2-5µm; no defect >5µm.
  - Zone C (contact, 115/120-130µm or to 250µm): scratches OK; ≤5 defects 5-10µm; no defect >10µm.
  - Zone D (outside, 130/250+µm): no impact.

**L12 PMD and CD Measurement:** Specialized instruments. Required for high-speed activation on legacy fiber.
**L13 Acceptance Testing — What Passes:** Compare to design loss budget. TIA-568.3-D criteria.
**L14 Test Documentation & Reports.**
**L15 T12 Capstone Quiz.**

### T13 Inspection & QA

**L01 Inspector Role & QA/QC Framework:** QA = quality assurance (system). QC = quality control (testing). Independence from contractor.
**L02 Pre-Construction Acceptance Baseline:** Confirms site conditions before work.
**L03 Aerial Construction Inspection:** Attachment heights, sag, bonding.
**L04 Underground Construction Inspection:** Burial depth, conduit, restoration. ASCE 38 SUE (Subsurface Utility Engineering) quality levels A/B/C/D.
**L05 Slack Storage & Pedestal Inspection.**
**L06 Material & Hardware Acceptance:** Compare to spec, RUS-listed materials.
**L07 Close-Out Documentation Form 219:** RUS final inspection report. PE-signed.
**L08 Joint-Use & Clearance Compliance.**
**L09 Contractor Relations & Dispute Resolution.**
**L10 T13 Capstone Quiz.**
**L11 Daily Inspection Records (RUS Form 565):** Compliance documentation. (Note: Form 565 = Compliance Statement, not specifically a daily record. There's overlap in usage between L11 and L07.)
**L12 Federal Compliance Monitoring — Davis-Bacon:** Davis-Bacon Act = prevailing wages on federally funded construction. Certified payroll required. WH-347 form.
**L13 Inspection Day Field Decision Workflow:** Field punch-list workflow.

### T15 Restoration & Outage Response

**L01 First 30 Minutes:** Triage, identify scope, dispatch.
**L02 Fault Locate with OTDR:**
- OTDR uses IOR to convert time→distance. IOR for G.652.D typically 1.4677 @ 1550.
- Direction matters: from headend out, OR from customer back to fault.
**L03 Physical Route Walk:** After OTDR locate, walk to find physical damage.
**L04 Temporary vs Permanent Repair:** Drop-and-splice temporary (mechanical splice acceptable). Permanent re-splice with fusion.
**L05 Splice Trailer Setup:** Mobile splicing van.
**L06 Emergency Civil Work:** Coordinating excavation crew.
**L07 Customer Communication:** ETR = Estimated Time to Restore.
**L08 Method of Procedure (MOP):** Documented sequence of steps for complex outage response.
**L09 Post-Restoration As-Built Update:** Update strand map + GIS.
**L10 T15 Capstone Quiz.**

### T16 As-Built Documentation & GIS

**L01 What Is an As-Built:** Final permanent record. Differs from as-designed.
**L02 Splice Matrix Schema:** Cable A buffer tube X fiber Y → Cable B BT P fiber Q. At each splice case.
**L03 TIA-606-C Administration Classes:** Class 1-4. Class 1 = single building. Class 2 = single building with multiple admin areas. Class 3 = campus. Class 4 = multi-campus.
**L04 Administration Records:** Links, pathways, locations.
**L05 GIS Formats for As-Built:** SHP (Esri shapefile), GDB (geodatabase), KML/KMZ (Google Earth), DWG.
**L06 Reconciling As-Built to As-Designed:** Document deltas.
**L07 RUS Form 219 Documentation Package:** PE-signed certification + splice records + test records + permits.
**L08 Part 32 Plant Accounting:** Map as-built to plant accounts (§32.2411 Poles, §32.2421 Cable aerial, §32.2422 Cable underground, §32.2423 Cable buried, §32.2441 Conduit).
**L09 Fiber Topology Canvas:** Schematic showing complete network topology.
**L10 T16 Capstone Quiz.**

### T17 Project Estimation & Revenue

**L01 Estimating Mindset - Why Medians Lie:** Use percentiles, not averages. Project variance is huge.
**L02 Aerial vs Underground Cost Components:**
- Aerial cheaper to build (~$30-50K/mi distribution). Storm risk.
- Underground more expensive ($100-300K/mi), more reliable.
**L03 Productivity Modeling:** Footage/day per crew. Weather, terrain, urban density factors.
**L04 Bill of Materials (BOM):** Itemized materials list.
**L05 Contract Types:** Lump-sum (fixed price, contractor risk), T&M (time + materials, owner risk), GMP (guaranteed maximum price, hybrid), Unit price (per ft, per ea).
**L06 Change Orders:** Scope change request, cost+schedule adjustment, signed.
**L07 Contingency & Escalation:**
- Contingency = % reserved for unknown unknowns (10-25% typical).
- Escalation = price increases over time (3-5%/yr typical material/labor).
- Worked example: contingency on contingency-inclusive subtotal vs on bare cost.
**L08 CPHP/CPHC KPIs:**
- CPHP = Cost Per Home Passed (FTTH metric).
- CPHC = Cost Per Home Connected (only customers who subscribe).
- Both ÷ FTTH built mileage = key benchmarks.
**L09 Revenue Modeling - ARPU:**
- ARPU = Average Revenue Per User (monthly).
- MRR = Monthly Recurring Revenue.
- Payback period = capex ÷ (ARPU × take rate × months).
**L10 T17 Capstone Quiz.**

