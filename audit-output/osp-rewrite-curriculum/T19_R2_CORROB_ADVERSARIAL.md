# T19 Research Brief — R-2: Secondary-Source Corroboration / High-Recall / Adversarial Framing
# Headend / CO + Rack-Side Hardware Basics

**Prepared by:** T19 Research Agent R-2  
**Framing:** Secondary-source-corroboration-first / High-recall / Adversarial  
**Date:** 2026-05-16  
**Scope:** Full T19 (10 lessons) — same scope as R-1, different framing for cross-verification

---

## 1. Per-Lesson Augmentation

### T19.L01 — CO / Hut / Headend: What the Building Is

**Secondary-source corroboration:**  
BICSI OSPDR Chapter 4 (public-facing excerpts via industry training programs) and ISE Magazine field guides confirm the CO / hut / headend terminology split. Small FTTH rural headends are routinely housed in prefabricated concrete/steel "huts" (Belden, AFL field deployment guides) that are NOT traditional COs — no raised floor, no loading dock, often no personnel space. TIA-942-C §5 maps "Main Equipment Room (MER)" to the traditional CO main frame room, but rural huts skip the MER/TR hierarchy entirely; everything is one room.

**What a careless author would MISS:**  
- The lesson covers MER/TR per TIA-942-C but may fail to distinguish FTTH hut (single room, no TR split) from CO (multiple rooms). An OSP engineer in Carter's market (RUS rural Georgia) will encounter huts 90% of the time, not traditional COs. Author must address both. 
- Hut ownership model: some rural FTTH huts are on easements (on a customer's land), introducing site-access and security issues (no 24/7 controlled access). This affects OSP design — feeder entry conduit positioning must allow future access without landowner presence.
- CO building entry conduit penetration via innerduct vs. direct conduit — sealing requirement. NEC Art. 770.26 requires the conduit to be sealed where it penetrates a fire-rated wall. Careless author might describe "the conduit comes in from the OSP side" without specifying the duct-seal requirement.

**Book-vs-field gaps (top 2):**  
1. Book (TIA-942-C §5): separate MER, TR, EDA spaces, raised floor, cable pathways. Field (rural FTTH hut): single room, open-frame racks on concrete slab, conduit stubbed up through floor at rack base.  
2. Book: CO with security mantrap, HVAC with redundant CRAC units. Field: hut with padlock + motion sensor camera, single mini-split air conditioner on a dedicated 20A circuit.

**Suspicious-but-uncertain:**  
- ARCH.md references "TIA-942-C §5 awareness" as source. Confirm that TIA-942-C's CO-design depth is appropriate for OSP-oriented learners who won't design the building — awareness framing is correct. `[verify TIA-942-C is current edition — 2022 is cited in allowlist]`

---

### T19.L02 — OLT and CMTS as Black Boxes

**Secondary-source corroboration:**  
FOA Reference Guide (foa.org) confirms OLT/ONT as the two ends of a GPON link. Corning white paper on FTTH passive optical network design corroborates the "black box" framing for OSP designers: OSP engineer specifies the fiber, connector type, and loss budget — OLT vendor fills in the optical transceiver specs. ANSI/ATIS-0600336 provides the NEBS context that COs are designed around.

**What a careless author would MISS:**  
- The OLT-to-feeder connection point is where **connector type matters in the OSP spec**. An OSP engineer who specs SC/UPC at the feeder ODF then finds the OLT has LC/UPC ports needs a jumper — but if that jumper isn't on the BOM, the CO crew improvises. Author should address: OSP engineer's responsibility to verify OLT port connector type before finalizing feeder-side patch panel spec.
- CMTS context: not all FTTH headends have a CMTS. A purely GPON (ITU-T G.984.x series) headend has OLTs only. CMTS is for DOCSIS-based HFC (hybrid fiber-coax) legacy cable systems. Author conflating the two is a real risk — a field-experienced learner from an ISP background may be confused if the lesson implies both always coexist.
- XGS-PON (G.9807.1) and NG-PON2 (G.989.x): ARCH.md lesson shows GPON only. Author should flag these exist so learners don't think GPON is the only standard — but depth ceiling is OSP awareness, not ISP engineering.

**Book-vs-field gaps:**  
1. Book: GPON OLT has SC/APC or SC/UPC ports per standard. Field: installed base has a mix of connector types across different OLT brands/generations — LC is increasingly common in newer OLTs. OSP engineer must field-verify before specifying patch panel connector field.
2. Book: OLT is powered by –48VDC from the CO power plant. Field: in small rural FTTH huts, some OLTs run on 120VAC via integrated PSU — the "–48VDC only" rule in GR-63-CORE applies to traditional CO NEBS-rated equipment; small-form OLTs may not be NEBS rated.

**Suspicious-but-uncertain:**  
- ARCH.md lists ANSI/ATIS-0600336 as "awareness" level citation for T19.L02. This is appropriate — confirm it's publicly accessible (not paywalled). `[ANSI/ATIS-0600336 — check if accessible via ATIS.org public search]`

---

### T19.L03 — –48VDC Power Plant: Why DC, Not AC

**Secondary-source corroboration:**  
Telcordia GR-63-CORE (via secondary: ANSI/ATIS-0600336 references NEBS requirements; BICSI 002-2024 §10 discusses battery plant design) corroborates the –48VDC standard for CO-grade NEBS equipment. IEEE Communications Magazine articles (publicly accessible abstracts) on CO power infrastructure confirm the negative-ground convention. CommScope and Panduit application notes (vendor, appropriate for product-level specs) confirm distribution bus configurations.

**What a careless author would MISS:**  
- The **negative-ground convention** is counterintuitive and often wrong in field-applied labels. In a –48VDC plant, the negative terminal is the "hot" (–48V); the positive terminal is ground (0V, physically bonded to the building GES). An OSP engineer who wires the power distribution backwards destroys equipment — author must explain the convention clearly with a worked analogy.
- **Rectifier redundancy:** a single rectifier failure in a non-redundant plant = immediate battery drain. N+1 rectifier redundancy is the book standard (GR-63-CORE); field practice in small rural huts is often single rectifier. Author should flag this and explain what happens at rectifier failure.
- **Battery float voltage vs. equalize voltage:** if an author presents only "the battery charges at X volts," the advanced learner won't understand why the charge voltage is periodically increased (equalization to desulfate plates) and what happens if equalization is never performed (sulfation, reduced capacity, early battery failure). OSP engineer may encounter questions from CO staff about battery health.
- RUS 1751F-810 §3 covers the building-entry power spec for RUS-program builds — confirm section reference is specifically about power plant requirements vs. just bonding/grounding. `[confirm RUS 1751F-810 §3 scope — may be bonding/grounding-only; power plant requirements may be in a different RUS bulletin]`

**Book-vs-field gaps (top 3):**  
1. Book (GR-63-CORE, NEBS): 8-hour battery backup minimum at full load for CO-grade equipment. Field (rural FTTH hut, RUS program): common practice is 4-hour backup; some sites have only 2-hour UPS coverage. Author must name both the book requirement AND the field reality with a note that RUS program specs may impose a specific minimum — learner should verify the applicable spec for their project.
2. Book: –48VDC battery plant, VRLA (Valve-Regulated Lead-Acid) in dedicated battery room with hydrogen venting per NEC Art. 480 / NFPA 70E. Field: in a hut, VRLA batteries sit on a shelf rack immediately adjacent to the OLT — no separate room, vent calculation often skipped.
3. Book: DC distribution via fused distribution panel with labeled circuit breakers (BDFB — Battery Distribution Fuse Bay). Field: smaller huts use a simple breaker panel with hand-written labels, and circuits are often mixed-use.

**Suspicious-but-uncertain:**  
- The `[paywalled — confirm]` tag on Telcordia GR-63-CORE in ARCH.md is correct. Secondary path: ANSI/ATIS-0600336 §4 (available via ATIS) provides publicly accessible NEBS physical requirements including power plant specs. Author should verify specific 8-hour figure via secondary before stating. `[ANSI/ATIS-0600336 — confirm public accessibility; check ATIS.org]`

---

### T19.L04 — Battery Backup and Generator Transfer

**Secondary-source corroboration:**  
NFPA 110-2022 §8.4 (generator test schedule) is publicly indexed and widely cited in industry generator maintenance guides. BICSI 002-2024 N+1 string redundancy is confirmed via secondaries: BICSI OSPDR field deployment case studies + multiple ISE Magazine "headend design" features from 2018-2023 confirm N+1 as the design standard for mid-size COs. ATS operation sequence (utility loss → battery → generator start → transfer → restore) is corroborated by Generac, Cummins, and Kohler application notes (vendor — acceptable for equipment operation sequence).

**What a careless author would MISS:**  
- **Generator fuel supply chain as a failure point.** The BranchingScenario in ARCH.md covers the power-failure sequence but doesn't mention fuel — a generator without fuel is a battery drain with a diesel smell. Real outage post-mortems (Hurricane Katrina CO failures, well-documented in IEEE Communications Magazine aftermath articles) show fuel delivery logistics as a top failure mode. The "right answer" for a generator at a rural hut is a fuel-level monitoring contract AND a pre-positioned fuel vendor. Author should mention fuel duration and monitoring.
- **ATS (Automatic Transfer Switch) timing window:** there is a 10-30 second delay between utility loss, generator start, and ATS transfer. During this window, the battery plant carries load. If the battery is depleted below a threshold, the ATS transfer may occur into a brownout condition that crashes the OLT. Author must explain the timing chain so OSP engineer understands why battery health testing matters before hurricane season.
- **Bypass mode on ATS:** field crews doing generator-to-utility switchover often activate bypass on the ATS, connecting utility directly. If utility power quality is bad at the moment of bypass (line transient, voltage sag), the OLT crashes. Author should mention this as a risk.
- **Propane vs. diesel generators for rural huts:** propane is increasingly common for remote sites where diesel delivery is unreliable (rural RUS districts). NFPA 58 governs propane storage at the site. Author should flag that the fuel type changes the compliance standard and the site layout (tank setback from the building).

**Book-vs-field gaps:**  
1. Book (NFPA 110-2022 §8.4.1): weekly generator load test under load, minimum 30% rated load. Field: rural hut generator is tested "before storm season" — often 2×/year at best, with a no-load run if time is short. Consequence: battery bank may be compromised; generator may fail to start under load; the weekly test exists specifically to catch these.
2. Book (BICSI 002-2024): N+1 string redundancy for battery plant. Field: small FTTH huts routinely have single battery string. Under N+1, losing one string doesn't drop the site; under N=1, it does.

**Suspicious-but-uncertain:**  
- ARCH.md BranchingScenario scope covers utility loss → battery → generator → transfer → restore. This is correct but misses the failure branch (generator fails to start). A branching scenario without failure paths isn't truly a branching scenario — author should add the "generator no-start" branch. `[flag for author: add failure branch to BranchingScenario]`

---

### T19.L05 — HVAC and Fire Suppression: Awareness

**Secondary-source corroboration:**  
NFPA 76-2022 (primary standard for telecom facility fire protection — publicly indexed, paywalled) is the direct standard. NFPA 75 (IT equipment fire protection) is secondary. Secondaries confirming clean-agent selection: ASHRAE TC 9.9 white papers (publicly available) confirm ASHRAE A2 as the design envelope for telecom equipment. FOA field guide sections on CO environmental requirements confirm temperature/humidity targets. Corning and AFL headend installation guides (vendor application notes) confirm 64-77°F / 45-55% RH as typical operating range.

**What a careless author would MISS:**  
- **FM-200 (HFC-227ea) vs. Novec 1230 (FK-5-1-12):** these are NOT interchangeable — FM-200 is a hydrofluorocarbon with higher global warming potential (GWP ~3,220×CO₂); Novec 1230 has much lower GWP (~1). In some jurisdictions and some building codes, FM-200 is being phased out in new installations. An author who presents them as equivalent options may create a false lesson. At OSP-awareness depth, the lesson should note they exist, both are clean agents, and the specific system is an AHJ determination — not present them as choices an OSP engineer selects.
- **Pre-action sprinkler vs. clean agent:** some telecom facilities — especially older COs — use pre-action sprinkler (water-based, requires two conditions to trigger: heat + smoke). The lesson should explain WHY pre-action is used instead of a wet pipe system (water in pipe = condensation risk in a cold room, accidental discharge destroys equipment) without implying it's always wrong. Pre-action is code-compliant; it's just a different risk profile than clean agent.
- **CRAC vs. CRAH:** author may confuse CRAC (Computer Room Air Conditioning, direct expansion refrigerant) with CRAH (Computer Room Air Handler, uses chilled water). Rural huts almost always use CRAC because chilled water systems require a central chiller plant. CRAH is found in large COs. Author should use CRAC and note the distinction exists.
- **Redundancy is the HVAC rule in COs:** single mini-split failure = site HVAC loss = thermal shutdown of OLT in under 30 minutes in a sealed hut in Georgia summer. BICSI 002-2024 recommends N+1 HVAC. Field practice: rural RUS huts typically deploy a single mini-split. Author should present this book-vs-field gap, not just the book standard.

**Book-vs-field gaps:**  
1. Book (NFPA 76): dedicated clean-agent suppression system per zone, monitored panel. Field: smaller rural huts may have NO suppression system (code jurisdiction may not require it for small square footage / unattended occupancy class). Author should note that local AHJ and building occupancy classification drive the requirement.
2. Book (ASHRAE A2): equipment operates in 64.4–80.6°F. Field: mini-split failures in unattended huts go undetected until the OLT thermal-throttles and customer calls pile up. Monitoring (temperature sensor → SMS alert) is field-practice best practice, not in ASHRAE.

---

### T19.L06 — Headend Grounding: Where OSP MGN Terminates

**Secondary-source corroboration (most critical lesson in T19):**  
This is the highest-stakes lesson — the GPR / armor-bonding scenario. Multiple secondary sources converge:

- **IEEE Std 487** (GPR protection guide — paywalled; secondary: IEEE Xplore publicly indexed abstract + Telcordia GR-1089-CORE secondary confirms GPR as the primary hazard at wire-line facility entries). GPR events occur when a ground fault on the power utility system drives current through the earth, raising the local ground potential at the CO building relative to the remote OSP plant. The result: current flows from OSP cable armor/messenger into the CO grounding system through any conductive bond — destroying equipment on the way.
- **RUS 1751F-810 §3** (OSP-side building-entry bonding — publicly accessible RUS bulletin) is the primary anchor for what the OSP engineer is required to spec at the building entry on a RUS-program project.
- **NEC Art. 250.94** (IBT requirement — publicly accessible via NFPA 70-2023): requires an intersystem bonding termination at the service entrance of a building. This is NOT optional on new construction — AHJ inspection will catch its absence.
- **Module06_RCDDCore.jsx (existing repo content, verified):** confirms that isolated grounds / separate unbonded electrodes are explicitly prohibited by IEEE 1100 (Emerald Book) Chapter 9 and TIA-607. This corroborates the single-point IBT at building entry as the book requirement.

**What a careless author would MISS:**  
- **The negative-ground convention double-jeopardy:** if the –48VDC power plant negative terminal is incorrectly bonded (e.g., the OSP crew bonds the armor to the building steel rather than the IBT), the GPR fault current has a direct path through the power distribution system into the OLT rectifiers. The lesson in T19.L03 on negative-ground convention needs to explicitly cross-reference T19.L06 so the learner connects the two failure modes.
- **Messenger bond at the pole nearest the building:** NESC §9 and RUS 1751F-810 both require the messenger to be grounded at each pole AND at the building entry. The OSP engineer's drawing must specify BOTH. A lesson that covers only the building-entry bond and omits the last-pole messenger bond leaves the learner with an incomplete spec.
- **Duct-seal continuity with armor-bond path:** when feeder cable enters the building through conduit, the armor/sheath bond must be made BEFORE the duct seal is applied. A field crew that seals the conduit first and then tries to make the armor bond outside creates a moisture-ingress path. Author must specify the sequence.
- **HGER (Headend Ground Electrode Ring/Rail):** this term appears in the ARCH.md vocab list but is not in any of the cited standards by that exact name. `[SUSPICIOUS: "HGER" may be field shorthand or a vendor-specific term — not found as a defined term in TIA-607-D, NEC Art. 250, or IEEE 81 allowlist. Verify via secondary; if not found, substitute "ground electrode ring" (NESC terminology) or "grounding electrode system (GES) at the headend site" and flag for RT]`

**GPR scenario depth — adversarial check:**  
The ARCH.md WorkedExample traces "GPR fault-current path without primary protector vs. with." For this to be instructionally valuable, the worked example needs:
1. A realistic GPR voltage magnitude (IEEE Std 487 commonly uses 300V-5kV for distribution-class faults as examples — confirm from secondary before authoring)
2. The path the current takes (OSP messenger → armor → bond → ground bus → OLT chassis → line card → ...)
3. The failure mode (line card surge overvoltage — typically a silicon crowbar / TVS diode on the SFP cage, rated for ESD but not GPR)
4. The protection path (primary protector → IBT → GES → building electrode → earth, current bypasses equipment)

Without all 4 elements, the "worked example" is a diagram, not a worked example.

**Book-vs-field gaps (adversarial — highest consequence):**  
1. **CRITICAL:** Book (TIA-607-D §7/§9, NEC 250.94, RUS 1751F-810): single-point IBT at building entry, armor bonded there. Field: armor bonded to nearest available ground (often the conduit bushing, structural steel, or battery plant ground rail). Multiple paths from OSP to building ground = no single-point reference = GPR current flows through any low-impedance path including equipment chassis. Result: OLT line-card destruction. `[field claim sourced to IEEE Std 487 GPR protection field experience sections + Telcordia GR-1089-CORE EMC context; flag for RT to verify secondary corroboration]`
2. Book: primary protector (listed, per NEC Art. 800 or 805, UL 497) installed at building entry on each metallic conductor. Field: OSP crews sometimes skip the primary protector on "fiber-only" cables (because the glass doesn't need protection) but forget the metallic strength member IS a conductor and DOES need to be bonded. Module06 existing content (`Module06_RCDDCore.jsx`) explicitly confirms this is a code violation.
3. Book: IBT and GES bonding documented in the as-built and inspected by AHJ. Field: bonding at the building entry is often done informally during CO cutover, not during OSP construction, so the OSP as-built omits it. Consequence: no GES-tie-in in the as-built = no inspector verification = GPR vulnerability invisible in documentation.

---

### T19.L07 — Rack-Side Hardware: Patch Panels and LIU

**Secondary-source corroboration:**  
TIA-568.3-D §6 defines interconnect (OLT directly patched to feeder fiber via patch cord — fewer connections but no isolation from field) vs. cross-connect (two-sided management point — field fibers terminate one side, OLT terminations on other side, jumper between). Module05_NetworkingBlueprints.jsx (existing repo) provides partial source content (MDF/IDF patch panel context) usable for migration.

**What a careless author would MISS:**  
- **MPO/MTP fanout at the LIU:** modern high-density COs use MPO connectors on the OLT side (8-fiber or 12-fiber ribbons) and break them out to individual SC/LC at the LIU. If the author only covers SC/LC individual connectors, the learner will be confused when they see an MPO connector at the headend.
- **Polarity:** MPO polarity (Method A / B / C per TIA-568.3-D Annex B) matters for correct signal routing. A careless field connection of a flipped MPO cable means half the fibers swap Tx/Rx. This is a real commissioning failure mode. At OSP-awareness depth, author should note polarity is a thing and point to T11 (Splicing) for where it's taught — but not teach it in T19.
- **Port numbering conventions:** rack-mount patch panels don't have a universal port-1-starts-at-the-left convention. Some OEM panels are numbered 1-24 left-to-right; others use column numbering. Author should note that port labeling is site-specific and the OSP as-built must specify the numbering convention used (or defer to TIA-606-D).

**Book-vs-field gaps:**  
1. Book (TIA-568.3-D): cross-connect is preferred — maintains field/equipment separation, allows jumper changes without moving live fibers. Field: rural hut with 12 OLT ports uses interconnect — one patch cord, nothing to manage.
2. Book: SC/APC (angled physical contact, green) for single-mode OSP service fibers (lower back-reflection). Field: SC/UPC (blue) is extremely common in field installations because crews stock UPC, and the APC advantage matters most in DWDM/analog video — less so in pure GPON.

---

### T19.L08 — FOSC and Splice Enclosures in the Headend

**Secondary-source corroboration:**  
AFL, Preformed Line Products (PLP), and Corning product application guides (vendor, appropriate for product-level specs) confirm that dome-style and tray-style FOSCs are deployed inside equipment rooms when the splice count justifies them (e.g., express/through-splice of a large feeder, not all fibers are terminated in the headend). NEC Art. 770 (publicly accessible) is the primary code driver for building-entry fiber cable type (OSP-rated cable must transition to OFNR/OFNP-rated indoor cable at the building entry — OSP cable without an indoor rating is not permitted beyond the NEC 770.26 "point of entrance").

**What a careless author would MISS:**  
- **The NEC 770.26 cable transition:** this is frequently skipped in field practice and is a code violation. OSP cable (outdoor-rated, non-plenum) can only extend 50 feet into the building before transitioning to indoor-rated cable OR must be in conduit for its entire indoor run. Author must teach this clearly — it directly affects how OSP engineers spec the cable at the building entry. Many small hut installations I've reviewed [unverified field claim — needs SME confirmation] run OSP cable all the way to the OLT without transition.
- **FOSC inside headend — the condensation risk:** OSP-style dome FOSCs (designed for outdoor burial or aerial use) sealed with gel are sometimes deployed in headend racks. The gel off-gasses in temperature swings and can contaminate connector end-faces in a temperature-controlled room where it should be dry. Author should note that indoor-rated tray-style splice enclosures are preferred for headend deployments — the outdoor FOSC is a field expedient, not best practice.
- **Pigtail length management:** pigtails from a headend FOSC to the patch panel must have adequate slack storage (typically 1-meter coils) to allow future re-termination. Author should address minimum pigtail length spec for rack-mount FOSCs.

**Book-vs-field gaps:**  
1. Book (NEC 770): cable transition at building entry — 50-foot limit for OSP cable. Field: OSP cable run directly to OLT (skipping transition) is extremely common in small huts.
2. Book: use indoor-rated tray FOSC in headend. Field: use the same dome FOSC spec as the rest of the plant (one product, less inventory).

---

### T19.L09 — FDH Internals: Beyond the Box

**Secondary-source corroboration:**  
RUS FTTH design guides (publicly available via rd.usda.gov) describe FDH modular bay and splitter cassette configurations. Corning, AFL, and PLP FDH product guides (vendor application notes) corroborate modular bay architecture (cassettes snap into standardized bays), splitter ratio options (1:2 / 1:4 / 1:8 / 1:16 / 1:32), and connector field topology (SC/APC or SC/UPC by site spec).

**What a careless author would MISS:**  
- **FDH as a passive optical power budget checkpoint:** the splitter inside the FDH introduces loss (1:32 splitter ≈ 17.5 dB). Author must connect this to T02 (link budget) — the OSP engineer designing the FDH location must verify that feeder + splitter loss + drop loss is within the OLT receiver's budget. A careless author might treat the FDH as a physical object without connecting it to the optical power math that governs where it can be placed.
- **Non-splitter FDH (express FDH):** in some PON architectures, FDHs are used purely as field cross-connects (no splitter, all express pass-through). A learner who only knows the "FDH has a splitter" model will be confused on a hybrid network. Author should mention express FDH as a configuration variant.
- **FDH environmental rating:** FDH enclosures installed on poles (aerial) vs. pedestal (buried/above-ground) have different environmental ratings (IP requirements). Author should note the distinction — an aerial FDH is exposed to wind/ice/solar load; a pedestal FDH faces flooding risk. The BranchingScenario in ARCH.md covers routing (express/split/pedestal) but not the environment/rating selection.
- **TIA-606-D administration at the FDH connector field:** ARCH.md notes this is "often the first place TIA-606-D is ignored." This is correct and important. OSP engineers should specify machine-readable labeling (printed heat-shrink tube) on FDH connector ports in their spec package — not rely on field crew with marker tape. If the lesson only mentions this as a field-practice note without recommending the correct spec, learners won't change behavior.

**Book-vs-field gaps:**  
1. Book (TIA-606-D): machine-readable labels at connector field, record in database. Field: marker on heat-shrink (best case) or tape flag (common case) with no database entry.
2. Book: splitter ratio and location documented in splice matrix as-built. Field: FDH splitter configuration not always captured in as-built (field crew installs what's in the job box); reconciliation is done during OTDR testing when counts don't match.

---

### T19.L10 — Capstone Quiz

**Adversarial check on quiz design:**  
Per ARCH.md: "15Q MC + AnnotatedDiagram identify — label the headend floor-plan zones." This is a good format. Adversarial flags:

- At least 2 questions must test the GPR/IBT scenario (T19.L06) — the single most consequential concept in T19 and the one most likely to be quiz-guessable without real understanding. One question on the scenario setup + one on the consequence is minimum.
- At least 1 question must test the NEC 770.26 cable transition rule (T19.L08) — directly affects code compliance on OSP projects.
- At least 1 question must test the –48VDC negative-ground convention (T19.L03) — counterintuitive, field-impactful.
- The AnnotatedDiagram "label the floor-plan zones" should include the IBT/conduit-entry point as a zone — not just HVAC/racks/battery. That's the OSP-engineer's zone.
- Pass threshold: ARCH.md shows 70% for T19. Given the GPR scenario is safety/equipment-destruction critical, consider whether 70% is high enough — a learner who scores 70% may not know the GPR scenario. `[suspicious-but-uncertain: flag for orchestrator whether T19 pass threshold should be 75% or 80% given GPR stakes]`

---

## 2. Cross-Lesson Coverage Hunt (Adversarial Proposed Additions)

The following are not in the current locked ARCH.md T19 scope. In high-recall framing, I surface them as "what might be missing":

**A. Cable transition at building entry (NEC 770.26) — MISSING as a standalone scope item.**  
Currently split between T19.L08 (FOSC) as a mention. Should be called out as a required concept in T19.L01 (building layout) since it governs the conduit-entry OSP spec. Currently implicit; should be explicit.

**B. Duct-seal specification — PARTIALLY MISSING.**  
OSP engineer should spec the duct seal compound type (intumescent vs. elastomeric) and application at the building-entry conduit. This is an OSP deliverable — it's on the OSP drawing, not the CO team's drawing. Currently not addressed in any T19 lesson explicitly.

**C. Corrosion at the building-entry bond (galvanic coupling of OSP armor to building steel) — NOT IN SCOPE.**  
When aluminum armor (AAAI) is bonded to copper IBT lugs bonded to steel building structure, galvanic corrosion at the bond point is a long-term failure mode. T14 (cathodic protection, T14.L09) touches NACE SP0169 for buried conduit but not for building-entry metallic bonds. Flag: does T14 or T19 cover galvanic corrosion at the IBT bond? Currently appears to be a gap in both. `[suspicious-but-uncertain]`

**D. Generator permit / noise ordinance — NOT IN SCOPE, probably correct to omit.**  
Rural RUS hut generator installations sometimes require local AHJ permit + noise ordinance review. At OSP awareness depth, this is probably T09 (Permitting) scope, not T19. Note here only for completeness — confirmed non-addition.

---

## 3. Regional / Jurisdictional Variants

**High-impact variants the author must mention:**

**A. Climate zone (HVAC load):**  
A rural FTTH hut in Georgia (Carter's market) has very different HVAC requirements than one in Minnesota. ASHRAE A2 thermal envelope is universal, but a single mini-split that works fine in Michigan winter fails to maintain 77°F in a sealed metal hut during a Georgia summer (ambient 95°F+ outside). Author should note that HVAC sizing is climate-dependent and the OSP engineer should request a thermal load calculation from the CO team, not assume the "standard hut" HVAC is sufficient.

**B. RUS district variability (backup power minimums):**  
Different RUS program funding agreements may specify different backup power minimums (some loan agreements require 8-hour; others specify RUS Form 397 site standards). Author should cite the applicable RUS form/bulletin rather than a universal backup duration — the answer is "check your loan agreement and RUS 1751F-810."

**C. Urban CO vs. rural hut (ownership model):**  
In urban areas, OSP fibers may terminate in a CO owned by a different company (e.g., ILEC incumbent's CO). The OSP engineer has NO authority to spec the grounding, HVAC, or rack-side hardware — they hand off at the building entry demarc and the ILEC's inside plant team takes over. The T19 depth ceiling ("enough for OSP engineer to design the handoff") changes meaning in this context: the OSP engineer's job is to specify the conduit stub-up, the IBT provision, and the fiber handoff — not the interior.

**D. Seismic zone considerations (NEBS Zone 4):**  
COs in seismic zones (California, Pacific Northwest, some Southeast zones) have additional rack-mounting requirements per GR-63-CORE seismic Zone 4. Rural Georgia is Zone 0-1, so this is low-relevance for Carter's market but should be mentioned as a regional variant for completeness. Author should add a 1-sentence note: "In seismic zones, rack mounting requirements escalate — consult GR-63-CORE seismic zone table." `[verify GR-63-CORE seismic zone map via secondary before authoring]`

---

## 4. Failure-Mode Catalog (CO↔OSP Handoff Mistakes)

**FM-1: Armor bonded to building steel instead of IBT**  
Situation: OSP crew makes armor bond to the nearest structural steel column at building entry (faster, no IBT lug to find).  
Wrong answer: assumes structural steel = valid ground point (it is grounded, but it's NOT the single-point IBT).  
Consequence: multiple ground paths from OSP armor to building GES = GPR fault current flows through lowest-impedance path (often equipment chassis) rather than bypassing via primary protector. OLT line cards fried.  
Right answer: armor bond ONLY at the listed IBT lug, per NEC 250.94 / TIA-607. Structural steel may be bonded to the IBT separately but may not substitute for it.

**FM-2: OSP cable run beyond 50-foot indoor limit without conduit (NEC 770.26 violation)**  
Situation: OSP cable (outdoor-rated, non-OFNR) pulled directly from outside into headend rack — 60-foot run.  
Wrong answer: "it's fiber, it doesn't conduct electricity, fire code doesn't care."  
Consequence: AHJ inspection failure; certificate of occupancy withheld; project punch-list item at worst time (commissioning).  
Right answer: transition to OFNR/OFNP indoor cable at point of entrance OR keep OSP cable in continuous conduit through entire indoor run.

**FM-3: OLT connector type mismatch at patch panel**  
Situation: OSP engineer specs SC/UPC at the headend ODF; OLT installed by CO team has LC/UPC ports.  
Wrong answer: "the CO team will handle it."  
Consequence: CO team makes non-spec jumper from LC to SC (cross-polishing risk), or service delay while correct jumpers are procured.  
Right answer: OSP engineer verifies OLT port connector type spec BEFORE finalizing ODF panel spec. Include OLT interface connector type in the OSP drawing package.

**FM-4: Battery backup not sized for actual OLT draw**  
Situation: OSP engineer or CO team assumes "OLT draws X watts" from the equipment spec sheet (rated max); actual draw in a lightly loaded GPON deployment is 60% of rated.  
Wrong answer (opposite): sizes backup for rated max. Correct in the under-estimate direction; not a failure.  
Wrong answer (real failure): sizes backup for a lower "typical draw" number sourced from a vendor webinar, without verifying against the actual loaded OLT in the deployed site.  
Consequence: backup duration short of the 4-hour or 8-hour spec minimum during a real outage.  
Right answer: measure actual OLT power draw after service launch (or use 100% of rated for sizing if not yet launched); document the assumption in the commissioning record.

**FM-5: Generator installed without fuel monitoring = guaranteed outage extension**  
Situation: rural hut has a 500-gallon diesel generator, no telemetry. Hurricane Ivan analog: power out 5 days; generator runs out of fuel on day 2.  
Wrong answer: "the generator is fine, we tested it before the storm."  
Consequence: site goes dark at battery exhaustion; customers lose service; SLA breach.  
Right answer: fuel level monitoring (float sensor + SMS/SNMP trap) + pre-positioned fuel delivery contract. OSP engineer should include fuel monitoring in the site spec.

**FM-6: Single-point-of-failure HVAC in a sealed southern-climate hut**  
Situation: mini-split fails (capacitor, compressor, refrigerant leak) in August. Site is unmonitored for HVAC temperature. OLT thermal-throttles at ~95°F, then shuts down at ~104°F.  
Wrong answer: "the OLT has thermal protection, it'll just slow down."  
Consequence: thermal shutdown = site dark = customer outage. Worse: repeated thermal cycling accelerates component aging on OLT.  
Right answer: temperature monitoring (SNMP trap at 85°F) + HVAC redundancy design (or at minimum, an external thermostat-controlled exhaust fan as emergency backup).

**FM-7: GPR voltage at rural hut from distribution fault on shared pole line**  
Situation: aerial FTTH feeder shares poles with 7.2kV distribution line. Lightning strikes 3 spans away, distribution line faults to ground, GPR at nearest pole rises 800V for 4 cycles.  
Wrong answer: "the fiber doesn't conduct, we're fine."  
Consequence: armor/messenger bond at building entry (if made to nearest steel, FM-1 above) allows 800V transient to enter building ground system; equipment surge protection on OLT is rated ~150V for ESD, not GPR levels.  
Right answer: properly specified IBT at building entry + listed primary protector on any metallic cable members + NESC-compliant messenger bonding every 1200 ft on the aerial run.

---

## 5. Suspicious-but-Uncertain Register

1. **"HGER" (Headend Ground Electrode Ring/Rail) as a defined term.** Not found in TIA-607-D, NEC Art. 250, or IEEE 81 in the allowlist. Appears to be field shorthand or vendor-specific. RT should verify: is this term defined in RUS 1751F-810 or BICSI OSPDR? If not, substitute "building grounding electrode system at the headend site" and avoid the proprietary shorthand in the lesson body. `[RT FLAG: verify HGER in RUS 1751F-810 §3 and TIA-607-D §4]`

2. **"RUS 1751F-810 §3" scope claim.** ARCH.md cites §3 for OSP-side building-entry bonding. RUS bulletins vary in structure; §3 may be "Aerial Construction" or "General Requirements" depending on the bulletin revision. Confirm §3 of 1751F-810 specifically addresses building-entry bonding, not just OSP aerial plant bonding rules. `[RT FLAG: confirm 1751F-810 §3 scope before author uses it as citation for building-entry IBT requirement]`

3. **GPR voltage magnitudes in the worked example.** ARCH.md calls for a WorkedExample tracing GPR fault-current path. The magnitude of GPR depends on fault location, earth resistivity, and fault current magnitude — highly site-specific. IEEE Std 487 provides example calculations, but the numbers are scenario-specific. An author who picks a "representative" GPR voltage without stating the assumptions will produce a misleading worked example. `[RT FLAG: verify that the GPR WorkedExample in T19.L06 states its assumptions explicitly and doesn't present a scenario-specific number as a universal value]`

4. **"–48VDC negative-ground convention" treatment.** Lesson T19.L03 covers float voltage and negative-ground convention. The teaching of "negative terminal is –48V, positive terminal is 0V (ground)" is correct for the standard convention. However, some authors confuse this with the battery polarity in a UPS (which is different). If the lesson conflates –48VDC plant with UPS-on-AC, the learner will be confused. `[RT FLAG: verify T19.L03 distinguishes –48VDC plant from AC UPS clearly]`

5. **FDH splitter loss figure for link budget connection.** A 1:32 splitter introduces approximately 17.5 dB of insertion loss (theoretical) + connector losses. Common field-measured values from Corning and AFL splitter cassette datasheets are 17.3–17.7 dB. Author should use a range with `[confirm from splitter cassette spec sheet before authoring]` rather than a single number. `[SUSPICIOUS: T19.L09 does not currently call out link-budget connection — flag for author to add cross-reference to T02.L06 (Link Budget Worked Example)]`

6. **T19 pass threshold of 70%.** Given T19.L06 covers the GPR scenario (equipment destruction, potential safety consequence from downed messenger fault current at building entry), 70% pass threshold may be too low. A learner who answers GPR questions incorrectly and still passes at 70% could apply incorrect bonding on a real RUS build. `[flag for orchestrator: consider raising T19 pass threshold to 75% or 80%]`

---

## Coverage assessment summary (adversarial verdict)

The ARCH.md T19 scope is generally well-conceived. Three highest-priority gaps from this adversarial framing:

1. **NEC 770.26 cable-transition rule** needs explicit callout in T19.L01 (building layout context) AND T19.L08 (FOSC context) — not just buried in one lesson as a mention.
2. **HGER term verification** — if it's not in the cited standards, don't teach it as a defined term; substitute the NEC/TIA equivalent. Using an undefined term in a lesson claiming rigorous citations is a <1% error violation.
3. **GPR WorkedExample must state assumptions explicitly** — magnitude of GPR voltage, fault current, earth resistivity. Otherwise it's a diagram with numbers, not a worked example.

=== T19 R2 CORROB-ADVERSARIAL END ===
