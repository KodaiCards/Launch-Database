---
title: "Lesson 3.8: Crossings — Road, Rail, Water — Bore vs. Aerial vs. Direct"
duration_min: 30
topic: osp-survey-route
order: 8
bicsi_alignment:
  - "OSP-DRD Ch. 3.4: Crossing identification and permit planning"
  - "OSP-DRD Ch. 6.2: Underground crossing construction"
sources:
  - "NESC (National Electrical Safety Code) C2-2023, Rules 232, 234"
  - "ANSI/TIA-758-C §6.3 (underground crossing depth requirements)"
  - "BICSI OSP-DRD Manual, Ch. 3.4 and Ch. 6.2"
  - "RUS Bulletin 1751F-630 §7 (crossing requirements for rural fiber routes)"
  - "USACE Nationwide Permit 12 (utility line activities — publicly available)"
  - "AASHTO Utility Accommodation Policy Manual (public)"
  - "FRA (Federal Railroad Administration) utility crossing regulations (public)"
---

# Crossings — Road, Rail, Water — Bore vs. Aerial vs. Direct

## In Plain English

Every time your fiber route has to cross a road, railroad, or body of water, you have a problem that goes far beyond "just dig under it." You need permission — sometimes from multiple government agencies — and getting that permission can take months. This lesson covers the three types of crossings you'll encounter on rural fiber routes, your installation method options for each (drill under it, hang over it, or cut through it), how deep the cable must go, and what permits are required. The most important takeaway: permits at crossings are almost always on the critical path of your project schedule. If you miss the application deadline, construction waits — and that costs money.

---

## Acronym Quick-Reference

| Acronym | Stands For | What It Means in Plain English |
|---|---|---|
| **NHS** | National Highway System | The network of major U.S. highways (Interstates + key arterials) governed by federal standards — crossings here are the strictest |
| **FHWA** | Federal Highway Administration | The federal agency that sets policy for utility crossings on federally funded roads |
| **AASHTO** | American Association of State Highway and Transportation Officials | Sets the utility accommodation standards most state DOTs follow |
| **HDD** | Horizontal Directional Drilling | The technical name for bore — a drill that goes in from the surface on one side, steers underground, and comes out on the other side |
| **HDPE** | High-Density Polyethylene | The tough plastic pipe (conduit) fiber cable is pulled through; standard OSP conduit material |
| **USACE** | U.S. Army Corps of Engineers | Federal agency that permits crossings of waterways and wetlands under the Clean Water Act |
| **NWP 12** | Nationwide Permit 12 | A pre-approved USACE permit for utility crossings that meet specific size/impact limits — the fast-track option for water crossings |
| **PCN** | Pre-Construction Notification | A notice you send to the USACE before construction, required in certain NWP 12 situations |
| **IP** | Individual Permit | The slow-track USACE permit for crossings too large or sensitive for NWP 12 — takes 9–18 months |
| **ESA** | Endangered Species Act | Federal law that protects critical habitat; if a waterway has ESA designation, NWP 12 may not be available |
| **FRA** | Federal Railroad Administration | Federal agency that oversees railroad safety; utility crossings near signals require FRA coordination |
| **DOT** | Department of Transportation | State or county road authority that issues road crossing permits |
| **Section 404** | Clean Water Act Section 404 | The law requiring a USACE permit for any "discharge of fill material" into waters of the United States |
| **Section 401 WQC** | Section 401 Water Quality Certification | State-level approval required alongside any USACE permit for a water crossing |
| **ROW** | Right of Way | The strip of land where you have legal permission to work — roads, railroads, and utilities all have ROW corridors |

---

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Select the appropriate installation method (bore, aerial span, or open-cut) for a road, rail, or water crossing given agency requirements and site constraints
- State the minimum burial depths for OSP conduit crossing roads, railroads, and under navigable waterways
- Identify the permit class required for each crossing type and the agency responsible for issuing each permit
- Apply NESC Rules 232 and 234 to determine clearance requirements for an aerial crossing over a road or waterway
- Describe the conditions under which USACE Nationwide Permit 12 applies to an OSP water crossing and identify the triggers that require an Individual Permit instead

---

## Reading Content

### Crossings: Why They're the Hardest Part of Any Route

**Here's the thing nobody tells you when you first start designing fiber routes: crossings aren't engineering problems, they're coordination problems that also happen to require engineering.**

Every road, railroad track, and body of water on your route has a government agency that owns it or regulates it. That agency decides whether you can cross it, how you cross it, how deep you go, and what paperwork you have to file. Some agencies give you an answer in a week. Others take six months — or longer.

The direct consequence: **crossing permits sit on the critical path of your project schedule.** The critical path is the sequence of tasks that determines when construction can start. If the slowest permit takes 180 days, construction can't start until you have it in hand. Miss your application deadline, and you push the whole project out.

Three crossing types appear on most rural OSP routes: **roads**, **railroads**, and **water bodies**. Each has its own method options, permit requirements, and timeline.

---

### Road Crossings

#### Bore vs. Open-Cut: The Agency Decides, Not You

**Think of it this way: the road agency owns the road. You're a guest. They tell you how you can work in their space.**

The choice between boring under a road (drilling horizontally under the pavement without disturbing the surface) versus cutting a trench through it is primarily driven by which road agency has jurisdiction, not by which method is cheaper or easier for you.

**Interstate and National Highway System (NHS) routes:**

FHWA policy and most state DOT standards prohibit open-cut on Interstate and NHS highways. Bore is required. Period. The reasoning: cutting through a major highway pavement damages the structural integrity of the road base and creates serious traffic management problems on a road that can't just be closed for a day. [FHWA utility accommodation policy; AASHTO utility accommodation policy manual]

**State arterial roads (non-Interstate):**

Most state DOTs prefer bore; some allow open-cut with a full lane overlay and traffic control. Varies by state. When in doubt, call the DOT district office before you design the crossing — finding out late that bore is required changes your cost estimate significantly.

**County and local roads:**

Highly variable. Many rural county road authorities are fine with open-cut crossing plus standard pavement restoration (saw-cut edges, compact the backfill, patch the surface). Some prohibit open-cut during planting or harvest season because heavy equipment ruts the roadside field access. Always confirm with the county road authority. [RUS Bulletin 1751F-630 §7]

---

#### Burial Depth Under Roads

ANSI/TIA-758-C §6.3 requires a minimum of **36 inches** burial depth for conduit crossing under roads. But for bore crossings under major roads, state DOT standards often require 42–48 inches to clear existing utilities in the road base and provide a comfortable buffer.

**Treat the ANSI/TIA-758-C number as the floor, not the design target. Always check the state DOT specification.**

For bore crossings, most DOT standards also require a **casing pipe** — a larger steel or PVC pipe that the fiber conduit sits inside. Here's why:

- The casing takes the structural load from road traffic above it so the smaller conduit doesn't get crushed
- If the fiber conduit inside ever needs to be replaced, you pull out the old conduit and pull in a new one — without boring again
- The casing is sealed at each end to keep groundwater and soil out

Think of the casing like a protective sleeve: the conduit is the cable inside, and the casing is the armored tube protecting it from the outside world. [AASHTO utility accommodation policy manual; BICSI OSP-DRD Manual, Ch. 6.2]

---

#### Aerial Crossing of Roads

If poles already exist on both sides of the road at the right height, an aerial span (hanging the cable over the road) can be an alternative to bore for short crossings. Two requirements must be met:

1. **NESC Rule 232 clearance:** the cable must hang at least **15.5 ft** above the road surface (see Lesson 3.4 for the sag calculation that verifies this)
2. **DOT permission:** the road agency must allow aerial attachments in their ROW — and many state DOTs prohibit aerial crossings of NHS routes regardless of clearance compliance

On Interstate and NHS routes, bore is standard even when an aerial crossing would technically clear. The visual impact on highway corridors is a separate concern from the clearance calculation. [NESC C2-2023, Rule 232; FHWA utility accommodation policy]

---

#### Road Crossing Permit Timeline: Plan for This Early

State DOT permits for major road crossings typically require **30–90 days** for review and approval — and they need a full engineering drawing package, traffic control plan, and surety bond to go with the application. County road permits are simpler (5–20 days, administrative fee, insurance certificate).

**The practical rule:** Start the DOT permit application as soon as you have a preliminary crossing design, even before construction drawings are final. You cannot pay extra to make a state DOT review go faster. [BICSI OSP-DRD Manual, Ch. 3.4; RUS Bulletin 1751F-630 §7]

---

### Railroad Crossings: The Most Demanding Process in OSP Work

**If road crossings are a scheduling headache, railroad crossings are a project management exam.** They are consistently the most complex, most time-consuming, and most technically demanding crossings you'll encounter.

Here's what every railroad crossing requires — no exceptions:

**1. Written permission from the railroad company itself**

Each railroad maintains its own permits office and its own specification document for utility crossings. The processing time varies dramatically:
- Short-line and regional railroads: 30–60 days
- Class I railroads (BNSF, CSX, Norfolk Southern, Union Pacific, etc.): 90–180 days is typical. Some require a separate right-of-entry agreement from their real estate department before they'll even accept your permit application — add another 30 days for that.

**2. Bore only — no exceptions**

You cannot cut a trench under an active railroad track. This isn't just a preference — it's an FRA safety requirement and a hard rule in every railroad's permit specifications. An open trench under an active track destabilizes the ballast (the gravel bed the ties sit on) and creates a derailment risk. Bore only, always. [FRA utility crossing regulations; BICSI OSP-DRD Manual, Ch. 6.2]

**3. Steel casing pipe**

Most railroad permits require a steel casing pipe of specified wall thickness. The wall thickness is determined by the axle loads of the trains using that track — a coal unit train running 286,000-lb cars needs more casing protection than a light-rail commuter line. The casing must extend the full width of the railroad ROW (not just under the tracks — from property line to property line). HDPE conduit alone is generally not accepted on Class I railroad crossings.

**4. Burial depth: 48 inches minimum under ANSI/TIA-758-C — but the railroad spec usually requires more**

ANSI/TIA-758-C §6.3 sets 48 inches below the top of rail as the minimum. Class I railroads frequently require 60 inches (5 feet). The railroad's permit specification is what you design to; ANSI/TIA-758-C is just the floor. [ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-630 §7]

**5. Horizontal separation and crossing angle**

Your bore must stay at least 5 feet horizontally from the nearest rail. The bore should approach the track as close to perpendicular (90 degrees to the track centerline) as possible — angled crossings are longer, harder to steer accurately, and some railroad permit offices won't accept them.

**6. A railroad flagman during construction**

A flagman is a railroad employee who stands at the crossing site the entire time your crew is working within railroad ROW. Their job is to watch for approaching trains and get your crew clear of the track in an emergency. This is not optional — it's a safety requirement and it's billed to you at the railroad's labor rates.

**The FRA signal system wrinkle:** If your bore or conduit passes within 25 feet of a railroad signal system component (crossing gate motor, signal bungalow, track circuit bond), you may need FRA coordination and a Section 214 excavation clearance. Identify signal system components from the railroad's signal department during the permit process — they're sometimes buried and not visible on the surface. [FRA utility crossing regulations; BICSI OSP-DRD Manual, Ch. 3.4]

---

### Water Crossings: A Different Regulatory World

When your route crosses a stream, drainage ditch, river, or wetland, you're entering federal environmental law territory — specifically the Clean Water Act and the Rivers and Harbors Act, administered by the **U.S. Army Corps of Engineers (USACE)**.

---

#### First Question: Is the Water "Navigable" Under USACE Jurisdiction?

**"Navigable" has a legal meaning that doesn't match common sense.**

A small creek that no boat has traveled in 100 years might still be classified as "navigable waters" under federal law because of historical navigation, tidal influence, or connection to a river the Corps considers navigable. A wide slow-moving agricultural ditch might NOT be navigable.

You cannot guess this. Before assuming a water crossing falls outside USACE jurisdiction, contact the applicable USACE district office and ask. Getting this wrong means discovering mid-project that you needed a federal permit you didn't get — which stops construction. [USACE Nationwide Permit 12; BICSI OSP-DRD Manual, Ch. 3.4]

---

#### The Two USACE Permit Classes

**Option A — Nationwide Permit 12 (NWP 12): The Fast Track**

NWP 12 is a pre-authorized (pre-approved) permit category for utility line crossings — including fiber cable and conduit — that cause limited impact. Think of it as a "standard permit" that already exists; you just have to notify the Corps that you're using it and confirm your project qualifies.

To qualify, the key requirement is: **no more than 0.1 acre of permanent wetland or waterway fill per crossing.** For most bore crossings under small to medium waterbodies, this is easy to satisfy — a bore under a creek leaves zero permanent fill in the waterbody.

**But you still need to notify the Corps (called a PCN — Pre-Construction Notification) in certain situations:**
- The crossing affects more than 0.1 acre of wetlands
- The waterbody has certain sensitive characteristics (critical habitat for a protected species, Wild and Scenic River designation, etc.)
- The USACE district in your region has added local conditions requiring notification for all utility crossings

Also critical: **USACE districts can add regional conditions to NWP 12 that are stricter than the national rules.** Some districts require a PCN for every utility crossing regardless of size. Some districts have suspended NWP 12 entirely for certain waterbody types in their region. Don't assume — call the district. [USACE Nationwide Permit 12]

**Option B — Individual Permit (IP): The Slow Track**

When NWP 12 isn't available, you need an Individual Permit. This means:
- A full permit application to the USACE
- A public notice published to the community with a 30-day comment period
- ESA Section 7 consultation with the US Fish and Wildlife Service if a listed species is involved
- The USACE's independent review of the project's environmental impact
- Processing time: **9–18 months**

**What triggers an IP requirement:**
- The crossing would permanently fill more than 0.1 acre of wetlands
- The waterbody has a federal designation (Critical Habitat, Wild and Scenic River, Essential Fish Habitat)
- The USACE district exercises discretionary authority to require IP review

**The scheduling consequence:** If desk research (from Lesson 3.1) shows your route crosses a potentially sensitive water body, flag it immediately. A 9–18 month IP process means that crossing's permit application might need to be filed before the route design is even final. [USACE Nationwide Permit 12; BICSI OSP-DRD Manual, Ch. 3.4]

---

#### The State 401 Water Quality Certification: The Often-Forgotten Step

**Every USACE permit — NWP 12 or Individual Permit — requires a separate state-level approval: the Section 401 Water Quality Certification.**

This comes from the state environmental agency (state EPA, state DNR, or whatever the equivalent is in your state). The state 401 review runs at the same time as the USACE review, so it doesn't add to your total timeline if you apply for both simultaneously. But if you forget to apply for the 401 until after the USACE permit comes through, you'll be waiting again.

Some states issue 401 certifications programmatically for utility crossings that qualify for NWP 12 — meaning if you qualify for NWP 12, you automatically have the state 401. Others require a separate individual application. Know which type your state is. [USACE Nationwide Permit 12]

---

#### Water Crossing Method Options

Three methods exist:

**Method 1 — Directional Bore (HDD) Under the Streambed**

The preferred method for navigable waters and environmentally sensitive crossings. The bore path passes well below the streambed — typically 5–15 feet under the bottom of the stream, depending on stream width and soil conditions. The surface of the waterway is completely undisturbed during construction. NWP 12 typically applies with minimal documentation for bore crossings because there's no surface fill.

**Method 2 — Aerial Span Over the Waterway**

Where poles exist (or can be set) on both banks, an aerial span is an option. NESC Rule 234 governs clearances:
- Over navigable waters: clearance above the ordinary high-water mark as specified by USACE for that waterway — contact USACE for the regulated elevation
- Over non-navigable waters: **15 ft minimum** above the surface at the highest water level
- Over marshes and wetlands inaccessible to traffic: 12 ft minimum

Be aware: an aerial span over a navigable waterway still requires USACE coordination (Section 10 of the Rivers and Harbors Act) because the span is technically an obstruction to navigation, even if it doesn't physically touch the water. [NESC C2-2023, Rule 234]

**Method 3 — Open-Cut Through the Streambed**

The most disruptive method and the least preferred for any waterbody with environmental sensitivity. For non-navigable drainage ditches and dry channels, open-cut with proper flow control (keeping water flowing during construction with a culvert or bypass pump) is acceptable and fast. Requires full restoration of the streambed and banks after installation — riprap, erosion matting, or bioengineering as required by permit conditions. [USACE Nationwide Permit 12; ANSI/TIA-758-C §6.3]

---

### The Permit Matrix: Your Project Scheduling Tool

Any route with multiple crossings needs a **permit matrix** — a structured table that lists every crossing, the required permits, the responsible agency, and the timeline for each. This document drives the project schedule.

A sample permit matrix:

| # | Station | Crossing type | Method | Permits required | Agency | Typical timeline | Critical path? |
|---|---|---|---|---|---|---|---|
| 1 | 3+40 | County road | Open-cut trench | County road permit | County Road Dept. | 5–15 days | No |
| 2 | 12+80 | State highway | Bore | DOT utility permit | State DOT District | 45–90 days | **Yes** |
| 3 | 18+20 | Class I railroad (BNSF) | Bore + steel casing | Railroad crossing agreement | BNSF Permits | 90–180 days | **Yes** |
| 4 | 24+60 | Navigable creek | Bore (HDD) | NWP 12 PCN; State 401 | USACE District; State ENV | 45–90 days | **Yes** |

**Reading the critical path:** In this example, the BNSF railroad crossing at 180 days is the single longest item. The entire project construction schedule cannot advance on that crossing segment until the BNSF Crossing Agreement is in hand. That means the BNSF permit application needs to be filed during the design phase — possibly before construction drawings are complete. If you file it 60 days into the project instead of day 1, you push construction start out by 60 days with no way to recover the time.

**Station notation:** "Station 18+20" means 1,820 feet along the route from the starting point (18 hundred-foot stations plus 20 feet). This is the same stationing system introduced in Lesson 3.2. [BICSI OSP-DRD Manual, Ch. 3.4; RUS Bulletin 1751F-630 §7]

---

## Key Terms (Flashcard Candidates)

**Bore (horizontal directional drilling / HDD)**
Underground installation method using a drill bit and reamer to create a bore path through the soil, then pulling back an HDPE conduit string through the bore path. Required for Interstate and NHS road crossings, all railroad crossings, and preferred for navigable water crossings. Leaves the surface undisturbed. [AASHTO utility accommodation policy; BICSI OSP-DRD Manual, Ch. 6.2]

**Casing pipe**
A larger-diameter steel or PVC pipe installed by bore under a road or railroad, inside which the OSP HDPE conduit is placed. The casing provides structural support, protects the OSP conduit from surface loading, and allows the OSP conduit to be replaced without re-boring. Required by most DOT and railroad permit specifications for bore crossings. [RUS Bulletin 1751F-630 §7; AASHTO utility accommodation policy]

**Burial depth under railroads**
Minimum 48 in. below the top of rail (ANSI/TIA-758-C §6.3) for OSP conduit crossing railroad ROW. Individual railroad company permit specifications frequently require 60 in. or more. The railroad specification governs; ANSI/TIA-758-C is the absolute floor. [ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-630 §7]

**Railroad flagman**
A railroad employee required to be present during construction within railroad ROW to ensure worker safety and track/signal system integrity. Required on all active railroad crossings. Billed to the utility applicant at railroad-specified rates. [BICSI OSP-DRD Manual, Ch. 3.4]

**USACE Nationwide Permit 12 (NWP 12)**
A pre-authorized Army Corps of Engineers permit for utility line crossings of waters of the United States that cause no more than 0.1 acre of permanent wetland or waterway fill per crossing. The standard permit pathway for OSP bore crossings of small to medium waterbodies. PCN (pre-construction notification) to the USACE district is required when thresholds are met or sensitive features are present. [USACE Nationwide Permit 12]

**Individual Permit (IP)**
A USACE permit required for water crossings that do not qualify for NWP 12 — typically large fill area, sensitive designated waterbody, or USACE discretionary authority. Full public notice and comment period; typical processing time 9–18 months. [USACE Nationwide Permit 12; BICSI OSP-DRD Manual, Ch. 3.4]

**Section 401 Water Quality Certification**
State-level approval required for any USACE-permitted project involving discharge to waters of the United States. Issued by the state environmental agency concurrent with USACE review. Some states certify NWP 12 crossings programmatically; others require individual applications. [USACE Nationwide Permit 12]

**NESC Rule 234 (aerial clearance over waterways)**
Minimum clearance for aerial communication conductors over waterways: over navigable waters, clearance above ordinary high-water mark per USACE specification; over non-navigable water surfaces, 15 ft minimum above the highest water level; over marshes and wetlands inaccessible to traffic, 12 ft minimum. [NESC C2-2023, Rule 234]

**Permit matrix**
A structured table listing every crossing on a route, the required permit for each, the responsible agency, the typical permit timeline, and whether each crossing is on the critical path for the construction schedule. The primary project scheduling tool for multi-crossing routes. [BICSI OSP-DRD Manual, Ch. 3.4; RUS Bulletin 1751F-630 §7]

---

## Interactive: Scenario — Crossing Method, Permits, and Depth Selection

### Scenario

A 4.2-mile rural OSP route has been designed. The field survey and desk research have identified three crossings. For each crossing, the engineer must select: (1) installation method, (2) required permits, and (3) minimum burial depth.

---

**Crossing 1:** A state arterial highway (two-lane state route, 12,000 vehicles/day, NHS designation). The state DOT accommodation manual prohibits open-cut on NHS routes. Existing utility poles on both sides of the road are at a height that would provide only 14 ft of clearance for an aerial span — below the NESC Rule 232 minimum of 15.5 ft.

**Analysis:**
- **Method:** Bore (HDD) — NHS route prohibition on open-cut eliminates open-cut; aerial fails NESC Rule 232 clearance (14 ft < 15.5 ft)
- **Depth:** 36 in. per ANSI/TIA-758-C §6.3 minimum; state DOT specification likely requires 42–48 in. under paved surface — confirm with state DOT
- **Conduit:** HDPE in steel casing pipe per DOT specification; bore to be conducted outside traffic lanes if possible (from the shoulder)
- **Permits:** State DOT utility permit (45–90 days); traffic control plan required; surety bond
- **Critical path?** Yes — DOT permit is the longest road permit process; initiate at design phase [AASHTO utility accommodation policy; ANSI/TIA-758-C §6.3; NESC C2-2023, Rule 232]

---

**Crossing 2:** An active Class I railroad (BNSF main line, 50+ trains/day). No overhead crossing structure exists and aerial crossing of an active Class I main line is not a practical option.

**Analysis:**
- **Method:** Bore (HDD or pneumatic bore) — open-cut is never acceptable under active railroad; aerial not practical on main line
- **Depth:** 60 in. below top of rail (BNSF specification, which exceeds the 48-in. ANSI/TIA-758-C minimum) — confirm with the BNSF Permits department in the permit application; the railroad specification governs
- **Conduit:** HDPE innerduct inside BNSF-specified steel casing pipe (wall thickness per BNSF specification based on axle loading); casing from ROW boundary to ROW boundary
- **Permits:** BNSF Crossing Agreement (90–180 days); BNSF-funded railroad inspector (flagman) required during construction; right-of-entry agreement with BNSF Real Estate may be required before permit application
- **Critical path?** Yes — the longest permit on the route; start the BNSF application process before final design drawings are complete [FRA utility crossing regulations; RUS Bulletin 1751F-630 §7; ANSI/TIA-758-C §6.3]

---

**Crossing 3:** A navigable creek, 30 ft wide, located within a mapped USACE navigable waterway designation. No SFHA or critical habitat designation from desk research. Existing poles are available on each bank at 28 ft attachment height; an aerial span would provide 16 ft clearance above the ordinary high-water mark.

**Analysis:**
- **Method:** Either bore (HDD under the streambed) or aerial span over the creek. Bore is preferred for long-term reliability and is simpler for NWP 12 compliance (no surface disturbance). Aerial span is technically compliant: 16 ft > 15 ft minimum for non-navigable water per NESC Rule 234; however, for navigable waters, USACE specifies the required clearance above the ordinary high-water mark — confirm whether 16 ft meets the USACE clearance specification for this specific creek.
- **Bore depth:** No fixed minimum per NESC Rule 234 for underground crossings; bore path established below streambed at 5–15 ft below bottom of stream (soil conditions dictate bore depth for HDD stability)
- **Permits (bore):** NWP 12 with PCN to USACE district (bore creates no surface fill; PCN required for navigable water crossing confirmation); state 401 Water Quality Certification; state environmental agency notification. USACE district review typically 30–60 days for PCN on NWP 12 with no sensitive features.
- **Permits (aerial):** USACE Section 10 coordination (aerial span over navigable water — obstruction review); state 401 WQC if bank disturbance for poles; NWP 12 if bank poles require any wetland fill. Section 10 adds coordination time; bore with NWP 12 PCN is likely the faster permitting path.
- **Critical path?** Moderate — NWP 12 with PCN, 30–60 days. Less than the railroad. Initiate after the BNSF permit is in process. [NESC C2-2023, Rule 234; USACE Nationwide Permit 12; BICSI OSP-DRD Manual, Ch. 3.4]

---

## Multiple-Choice Quiz

---

**Q1.** An OSP route crosses a National Highway System (NHS) arterial road. The state DOT accommodation manual states: "Open-cut of NHS routes is prohibited; all crossings shall be by bore." The engineer finds that poles on each side of the highway could support an aerial span with 15.8 ft of clearance above the road surface. What is the correct installation method for this crossing?

- A) Aerial span — 15.8 ft exceeds the NESC Rule 232 minimum of 15.5 ft, so the aerial crossing is compliant and should be used as the lower-cost option
- B) Bore — the state DOT accommodation manual prohibits open-cut; the DOT's prohibition on open-cut is construed to apply to aerial attachments within the NHS ROW as well in most state policies, and bore is standard practice on NHS crossings **[CORRECT]**
- C) Open-cut — the DOT prohibition only applies to "open-cut," which by definition is a ground disturbance; an aerial crossing involves no ground disturbance and is therefore not prohibited
- D) Either aerial or bore — the engineer has discretion to select the method that minimizes construction cost, provided NESC clearances are met

*Rationale:*
- **A — Incorrect.** NESC Rule 232 clearance compliance is a necessary but not sufficient condition for selecting an aerial crossing. The state DOT accommodation manual has independent authority over work within state road ROW, and most state DOTs regulate aerial utility attachments within NHS ROW as well as underground crossings. An aerial span between poles set within NHS ROW requires DOT approval regardless of NESC clearance compliance. FHWA utility accommodation policy further limits aerial OSP within Interstate and NHS corridors. [FHWA utility accommodation policy; AASHTO utility accommodation policy]
- **B — Correct.** State DOT accommodation manuals govern all utility work within state road ROW, including aerial attachments. Most DOT accommodation policies that prohibit open-cut also require bore for underground crossings and regulate aerial pole placement within the ROW. Bore is the standard practice on NHS crossings and the expected method in a permit application to the state DOT for an NHS route. Where the DOT's accommodation manual says "all crossings shall be by bore," that directive covers the crossing regardless of whether an aerial option is technically possible. The engineer should comply with the DOT's method requirement and submit a bore design. [FHWA utility accommodation policy; AASHTO utility accommodation policy; BICSI OSP-DRD Manual, Ch. 3.4]
- **C — Incorrect.** This interpretation conflates "open-cut" (a trenching method) with "any surface disturbance." DOT accommodation manuals use "bore" to mean that the crossing shall be underground and bored, not that only trenching is prohibited while aerial is unrestricted. Setting poles within the NHS ROW for an aerial crossing is a physical installation requiring DOT permit approval; the prohibition on "open-cut" is part of a broader bore-only policy for the route crossing, not a narrow restriction limited to the word "cut." [FHWA utility accommodation policy]
- **D — Incorrect.** Engineers do not have discretion to select crossing methods in conflict with the applicable DOT accommodation manual. The accommodation manual is a regulatory document incorporated by reference into the utility permit; deviating from its method requirements requires formal DOT approval, which is effectively a permit modification request, not an engineering discretion call. [AASHTO utility accommodation policy; BICSI OSP-DRD Manual, Ch. 3.4]

---

**Q2.** An OSP bore crossing of a navigable creek is being planned. The project engineer submits a NWP 12 pre-construction notification (PCN) to the USACE district. The USACE district responds that NWP 12 is not available for this crossing because the creek has been designated as Critical Habitat for a federally listed fish species under the Endangered Species Act. What must the project do to proceed with this crossing?

- A) Proceed under NWP 12 — ESA critical habitat designation is a state designation that does not affect federal USACE permitting
- B) Apply for a USACE Individual Permit, which triggers full public notice, ESA Section 7 consultation with the US Fish and Wildlife Service, and typically a 9–18 month review period **[CORRECT]**
- C) Switch to an aerial crossing over the creek, which avoids USACE jurisdiction because the span does not contact the water surface
- D) File for a NWP 12 waiver with the USACE District Commander — waivers are routinely granted for utility crossings of Critical Habitat when the crossing is bored and does not disturb the streambed

*Rationale:*
- **A — Incorrect.** Critical Habitat designation under the Endangered Species Act (ESA) is a federal designation made by the US Fish and Wildlife Service (USFWS) or National Marine Fisheries Service (NMFS). It affects federal permitting, including USACE NWP 12 review. USACE general condition 18 of NWP 12 requires the applicant to comply with the ESA; where a USACE district has determined that NWP 12 is not available in designated Critical Habitat waters, the district is exercising its authority to revoke NWP 12 authorization for that crossing. The designation is not a state action. [USACE Nationwide Permit 12; ESA Section 7]
- **B — Correct.** When NWP 12 is revoked or not available for a specific crossing, the project must obtain an Individual Permit (IP). An IP requires: a full permit application to the USACE, public notice and comment period (30 days), coordination with USFWS or NMFS for ESA Section 7 consultation (informal or formal, depending on the biological assessment findings), and the USACE's independent review of project impacts. Total review time is typically 9–18 months. This should have been identified as a risk during desk research (USFWS critical habitat maps are publicly available) and planned into the project schedule accordingly. [USACE Nationwide Permit 12; BICSI OSP-DRD Manual, Ch. 3.4]
- **C — Incorrect.** An aerial crossing over a navigable creek does not eliminate USACE jurisdiction. Setting poles on the creek banks constitutes a physical alteration of the bank within the USACE riparian zone and may still require USACE Section 10 and Section 404 authorization depending on the bank conditions. Aerial crossings of Critical Habitat waterbodies are also subject to ESA Section 7 consultation if the project has a federal nexus (such as RUS funding). [USACE Nationwide Permit 12; BICSI OSP-DRD Manual, Ch. 3.4]
- **D — Incorrect.** USACE District Commanders can issue "NWP 12 waivers" in limited circumstances, but the process is not routine and is not designed for ESA Critical Habitat situations. The applicable mechanism for proceeding with a crossing where NWP 12 is not available is an Individual Permit application — not a NWP waiver. [USACE Nationwide Permit 12]

---

**Q3.** Using the following data, verify whether an aerial span over a non-navigable agricultural drainage ditch satisfies NESC Rule 234. Attachment height at both poles: 24 ft. Span length: 200 ft. Manufacturer's final sag at NESC Light district loading: 5.2 ft. The ordinary high-water mark of the ditch is 2 ft above the adjacent field grade (the ditch bottom is 4 ft below grade).

- A) Midspan clearance = 18.8 ft above field grade; clearance above high-water mark = 16.8 ft — satisfies NESC Rule 234 (15 ft minimum) with 1.8 ft of margin **[CORRECT]**
- B) Midspan clearance = 5.2 ft — equal to the sag value; NESC clearance is measured from the sag, not from the ground
- C) Midspan clearance = 24 ft — equal to the attachment height; clearance is measured at the poles, not at midspan
- D) The crossing fails NESC Rule 234 because 24-ft attachment height is below the 26.5-ft minimum required over waterways

*Rationale:*
- **A — Correct.** Midspan clearance above field grade = attachment height − sag = 24 ft − 5.2 ft = **18.8 ft**. The ordinary high-water mark of the ditch is 2 ft above field grade; the midspan clearance above the high-water mark = 18.8 ft − 2 ft = **16.8 ft**. NESC Rule 234 requires 15 ft above the surface of non-navigable water at the highest water level. 16.8 ft > 15 ft — the crossing is compliant with 1.8 ft of margin. Note: the field grade reference assumes the ground under the midspan is approximately level with the pole base; if the ditch creates significant ground depression at midspan, recalculate from the actual ground elevation at midspan. [NESC C2-2023, Rule 234; IEEE 1222 §5]
- **B — Incorrect.** Clearance is not the sag value — it is the height of the cable above the ground (or water surface) at the lowest point of the cable (midspan). Sag is the vertical distance the cable drops below the straight chord line between the two attachment points. Clearance = attachment height − sag, not sag itself. [NESC C2-2023, Rule 234]
- **C — Incorrect.** Clearance is measured at midspan (where the cable is lowest), not at the poles. The attachment height is the cable height at the poles — the highest point of the cable. Using the attachment height as the clearance overstates it by the full sag value. [NESC C2-2023, Rule 234]
- **D — Incorrect.** The 26.5-ft clearance requirement applies to railroad crossings (NESC Rule 232), not to waterway crossings. NESC Rule 234 governs waterway clearances; the minimum over non-navigable water surfaces is 15 ft, not 26.5 ft. [NESC C2-2023, Rules 232, 234]

---

## Final Check

Answer before proceeding to Lesson 3.9.

**Pulse 1.** A route has three crossings: a county road (open-cut permitted by county), a Class I railroad (BNSF), and a navigable creek (bore under the streambed planned). List the required permits for each crossing, the responsible agency, and which crossing is on the critical path for the project schedule — and explain why.

*Expected answer:* **County road:** County road permit, issued by the County Road Department, typically 5–20 days — not on critical path. **BNSF railroad:** BNSF Crossing Agreement (railroad's permits department), typically 90–180 days; may also require a BNSF right-of-entry agreement (real estate department) before permit application; railroad flagman required during construction — **this is the critical path.** **Navigable creek (bore):** NWP 12 PCN to the applicable USACE district (30–60 days), plus State 401 Water Quality Certification (concurrent) — not the critical path if BNSF is 90–180 days. The BNSF permit is the critical path because its timeline (90–180 days) is the longest of the three; the project construction schedule cannot advance to the railroad crossing until the BNSF Crossing Agreement is in hand. The BNSF permit application should be initiated at the design phase, before construction drawings are complete. [BICSI OSP-DRD Manual, Ch. 3.4; RUS Bulletin 1751F-630 §7; FRA utility crossing regulations; USACE Nationwide Permit 12]

**Pulse 2.** Under what two conditions would a water crossing require an Individual Permit (IP) rather than Nationwide Permit 12?

*Expected answer:* (1) **Fill exceeds 0.1 acre:** NWP 12 authorizes utility crossings with no more than 0.1 acre of permanent wetland or waterway fill per crossing. An open-cut crossing of a wide wetland or a crossing requiring substantial bank modification may exceed this threshold, triggering the IP requirement. (2) **Sensitive federal designation:** NWP 12 is not available in waters with certain federal designations — Critical Habitat under ESA, Wild and Scenic River designation, or where the USACE district has added regional conditions removing NWP 12 authorization. Any crossing in a federally designated sensitive waterbody should be assumed to require IP review until confirmed otherwise with the USACE district. [USACE Nationwide Permit 12; BICSI OSP-DRD Manual, Ch. 3.4]

---

## Glossary Cross-References

- **Bore (HDD) / casing pipe** → Lesson 3.5 (underground route design — bore conduit material and HDPE selection); Lesson 3.7 (aerial-to-underground transitions — bore exit point uses riser conduit above grade)
- **Burial depth under roads and railroads** → Lesson 3.5 (underground route design — same ANSI/TIA-758-C §6.3 depths for conduit in general ground)
- **NWP 12 / USACE Section 404 / Section 10** → Lesson 3.1 (desk research — NWI wetland mapping flags potential USACE jurisdiction); Lesson 3.11 (route permitting — NWP 12 is part of the full permit matrix for a route)
- **NESC Rules 232, 234 (aerial clearances)** → Lesson 3.3 (NESC clearances — clearance values and formula covered in detail); Lesson 3.4 (aerial route design — sag-tension calculation produces the midspan clearance verified against these rules)
- **Permit matrix / critical path permit** → Lesson 3.11 (route permitting — full permit matrix construction for a multi-crossing route); Lesson 3.12 (as-built documentation — permit copies are part of the project close-out package)
- **Section 401 Water Quality Certification** → Lesson 3.11 (route permitting — state 401 is listed in the permit matrix alongside USACE NWP 12)
