---
title: "Lesson 5.11: Storage Hardware — Slack Racks, Snowshoes, Figure-8 Coils, and Vault/Aerial Storage"
duration_min: 20
topic: osp-hardware-accessories
order: 11
bicsi_alignment:
  - "BICSI OSP-DRD Ch. 8.1: Fiber slack storage methods and hardware selection"
sources:
  - "TIA-758-C §6.4 (minimum slack per closure side; bend radius requirements for OSP cable storage)"
  - "BICSI OSP-DRD Manual, Ch. 8.1"
  - "RUS Bulletin 1751F-635 §4 (slack storage requirements for RUS-funded OSP routes)"
---

# Storage Hardware: Slack Racks, Snowshoes, Figure-8 Coils, and Vault/Aerial Storage

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Match the correct slack storage method to each deployment context: vault, buried pedestal, and aerial pole bracket
- State the minimum slack length per closure side and the minimum coil diameter for pole-bracket storage
- Apply the 10× OD bend radius rule for single-mode OSP cable to verify that a storage method is acceptable
- Distinguish between Velcro tie and metal clamp and state which is permitted for fiber storage in vaults and pedestals
- Select the correct storage hardware type for a given installation scenario

---

## Reading Content

### Why Slack Storage Hardware Matters

Fiber slack stored improperly is fiber at risk. The minimum bend radius of a single-mode OSP cable is not a guideline — violating it causes microbend-induced attenuation that degrades the link budget immediately and stress-corrosion fracture that causes failures weeks or months after installation. Every slack storage method covered in this lesson is designed to maintain the minimum static bend radius through the full service life of the stored cable [TIA-758-C §6.4; BICSI OSP-DRD Ch. 8.1; RUS 1751F-635 §4].

**Minimum static bend radius — 10× OD rule:**

> For single-mode OSP cable: minimum static bend radius = **10 × cable outer diameter (OD)**

For a typical 0.63-in. (16 mm) OD distribution cable: minimum static bend radius = 10 × 0.63 in. = **6.3 in. (160 mm)** — approximately a 12.6-in. (320 mm) minimum coil diameter.

For a typical 0.50-in. (12.7 mm) OD drop cable: minimum static bend radius = 10 × 0.50 in. = **5.0 in. (127 mm)** — approximately a 10-in. (254 mm) minimum coil diameter.

**Dynamic bend radius (during installation) is typically 20× OD** — more stringent, applies during pulling or active bending. This lesson focuses on static storage bend radius.

**Minimum slack per closure side — TIA-758-C §6.4:**

> **10 m (approximately 33 ft) of slack per closure side** — minimum length to be stored at each splice closure entry point.

This 10-m minimum ensures adequate re-splice length if the first splice at a given side fails, and provides entry-loop slack to allow the closure to move during re-entry without placing tension on the fiber inside [TIA-758-C §6.4; RUS 1751F-635 §4].

### Vault Storage — Slack Rack

A **slack rack** (also called a cable rack or "Christmas tree" rack) is a rigid ladder-style or bracket-style rack installed inside a splice vault or large handhole. Fiber cable is looped over the horizontal rungs of the rack in circular or figure-8 coils to store the required slack length [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4].

**Construction:** Fiberglass or HDPE horizontal rungs on vertical side rails, typically 12–18 in. wide. Fiberglass is preferred over metal in vaults subject to flooding — metal corrodes, loosens, and can abrade cable jackets as the rack degrades.

**Loop orientation:** Circular coils are preferred when the slack rack rung diameter is large enough to meet the 10× OD minimum. Figure-8 coils are used on smaller rack spans to avoid creating a coil diameter below the minimum bend radius — the figure-8 configuration distributes the cable bend across two loops, keeping each individual loop above the radius minimum.

**Tie method — Velcro only, no metal clamps:**

> **Velcro cable ties (hook-and-loop) are the only approved tie method for fiber coils stored in vaults and pedestals. Metal clamps, metal hose clamps, cable ties with metal teeth, and steel wire lashing are prohibited.**

A metal clamp tightened on a fiber coil creates point loading — a concentrated radial force on the cable jacket at the clamp edge. Under thermal cycling (vault temperature changes), the clamp either loosens (losing its hold) or tightens further (crushing the cable jacket toward the fiber). Both outcomes damage the cable over time. Velcro hook-and-loop ties apply distributed pressure over the full contact width and cannot mechanically over-tighten [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4].

Velcro ties must be re-inspectable without cutting — never use a single-use cable tie (zip tie) with a locking tooth in a vault application where the tie will need to be removed for future re-entry.

### Buried Pedestal Storage — Snowshoe

A **snowshoe** (also called a figure-8 coil holder or pedestal coil bracket) is a rigid oval or figure-8 form installed inside a buried pedestal. The fiber slack is wound around the snowshoe form in a figure-8 pattern to store the required slack length within the limited vertical space of a buried pedestal [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4].

**Why figure-8 in a pedestal?** A pedestal interior is typically 12–24 in. tall. A simple circular coil at the minimum coil diameter for 10× OD would require 13–20 in. of vertical space for a single-layer coil. The figure-8 configuration reduces the effective height by half, allowing the same slack length to be stored in a smaller footprint.

**Material:** High-density polyethylene (HDPE) or fiberglass oval form. Smooth surfaces — no sharp edges that could abrade the cable jacket over thermal cycling. Mounting: clip-mounted to the pedestal interior wall via integral mounting tabs.

**Tie method:** Same as vault — Velcro only. No metal clamps or zip ties with metal locking teeth [BICSI OSP-DRD Ch. 8.1].

**Typical snowshoe size:** Exterior form OD approximately 6–8 in., sized to maintain ≥ 10× OD bend radius for the distribution or drop cable being stored.

### Aerial Pole Bracket Storage — Figure-8 Coil

On aerial plant, slack cable is stored on a **pole-mounted cable storage bracket**. This is a J-bracket or U-bracket bolted to the utility pole body, with a smooth HDPE or polymer coil guide surface. The cable slack is wound in a figure-8 pattern around the bracket form [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4].

**Loop count:** 3 to 5 loops for typical aerial cable slack storage on a pole bracket. The figure-8 winding pattern alternates the cable direction each loop, preventing cable rotation buildup and distributing the slack length evenly.

**Minimum coil diameter:** **18 in. (450 mm)** on pole-mounted bracket storage. This exceeds the 10× OD requirement for cables up to 1.5-in. OD (10 × 1.5 = 15 in.) and provides a design margin for the largest practical OSP cable stored on an aerial pole bracket. Verify against actual cable OD for smaller cables — 18 in. is the minimum; larger is acceptable.

**Tie method — Velcro on aerial pole bracket:** Velcro tie is the required tie method for cables stored on aerial pole brackets. Metal ties or plastic ratchet ties can develop sharp edges as they age in UV and temperature cycling, abrading the cable jacket over time [BICSI OSP-DRD Ch. 8.1].

**Bracket placement:** The pole bracket is installed below the messenger attachment hardware and above the cable drip loop. It must not interfere with the lashing zone or create a trip/snag hazard at the climbing zone of the pole.

### Storage Method Selection Summary

| Deployment context | Storage method | Min. coil diameter | Tie method |
|---|---|---|---|
| Splice vault / large handhole | Slack rack (ladder/bracket rack) | 10× cable OD | Velcro (hook-and-loop) |
| Buried distribution pedestal | Snowshoe (figure-8 coil holder) | 10× cable OD | Velcro (hook-and-loop) |
| Aerial pole-mounted | Figure-8 coil on pole bracket | 18 in. (450 mm) minimum | Velcro (hook-and-loop) |

**Velcro is universal.** No metal clamps in any fiber storage context.

---

## Key Terms (Flashcard Candidates)

**Slack rack**
A rigid ladder-style bracket installed in a splice vault or large handhole for storing fiber cable slack in coils. Fiberglass or HDPE construction; cables looped over horizontal rungs in circular or figure-8 coils. Velcro-only tie method. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]

**Snowshoe**
A rigid oval or figure-8 form installed inside a buried pedestal for compact slack storage. Figure-8 cable winding reduces storage height relative to a circular coil. HDPE or fiberglass; smooth edges; Velcro-only ties. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]

**Figure-8 coil (aerial)**
A cable storage method for aerial pole-bracket applications. The cable is wound in a figure-8 pattern (3–5 loops) around a pole-mounted storage bracket. Minimum coil diameter 18 in. (450 mm). Velcro tie. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]

**Minimum slack per closure side**
TIA-758-C §6.4 requirement: **10 m (approximately 33 ft)** of cable slack must be stored on each side of a splice closure. Provides re-splice margin and entry-loop slack for re-entry without tensioning the splice organizer. [TIA-758-C §6.4; RUS 1751F-635 §4]

**10× OD bend radius rule**
Minimum static bend radius for single-mode OSP cable storage = 10 × cable outer diameter. Example: 0.63-in. OD cable → minimum static bend radius = 6.3 in. → minimum coil diameter = 12.6 in. Determines whether a given slack rack rung diameter or snowshoe form OD is acceptable. [TIA-758-C §6.4; BICSI OSP-DRD Ch. 8.1]

**Velcro (hook-and-loop) cable tie**
The only approved tie method for fiber cable coils stored in vaults, pedestals, and aerial pole brackets. Applies distributed pressure over the full contact width; cannot mechanically over-tighten; re-removable without cutting. Metal clamps, zip ties with metal teeth, and steel wire lashing are prohibited. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]

---

## Interactive: Flashcard Set — Match Storage Scenario to Method

**Card format:** Scenario on front → Correct method + rationale on back.

**Card 1 — Front:** Splice closure at a 4-way conduit cross-connect vault. 10 m of distribution cable slack on each of two feeder cables must be stored.
**Back:** **Slack rack (vault storage).** The vault provides adequate clearance for a ladder-style slack rack. Cable is looped over horizontal rungs in circular or figure-8 coils. Velcro ties only. Minimum coil diameter: 10× cable OD. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]

**Card 2 — Front:** Distribution splice closure inside a 24-in. tall buried HDPE pedestal. 10 m of slack must be stored but vertical clearance is limited.
**Back:** **Snowshoe (figure-8 coil holder).** Figure-8 winding on an oval snowshoe form stores the required slack in half the vertical height of a circular coil. HDPE form; Velcro ties. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]

**Card 3 — Front:** An aerial splice closure on lashed cable requires a 10-m cable loop stored on the adjacent pole. No vault or pedestal available.
**Back:** **Figure-8 coil on pole-mounted bracket.** 3–5 loops of cable on a J-bracket or U-bracket mounted on the pole body. Minimum 18-in. coil diameter. Velcro ties. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]

**Card 4 — Front:** A technician finishes a re-splice in a vault and uses a metal hose clamp to secure the rebuilt cable coil to the slack rack. Is this acceptable?
**Back:** **No — prohibited.** Metal clamps create point loading on the cable jacket. Under thermal cycling, the clamp either loosens (losing hold) or tightens (crushing the jacket toward the fiber). Velcro hook-and-loop ties are the only approved method in any fiber storage context. [BICSI OSP-DRD Ch. 8.1]

---

## Multiple-Choice Quiz

---

**Q1.** According to TIA-758-C §6.4, what is the minimum length of fiber cable slack required per closure side at a splice closure?

- A) 3 m (approximately 10 ft)
- B) 5 m (approximately 16 ft)
- C) 10 m (approximately 33 ft) **[CORRECT]**
- D) 25 ft (approximately 7.6 m)

*Rationale:*
- **A — Incorrect.** 3 m is insufficient slack for reliable re-splicing at most OSP splice closure locations. TIA-758-C §6.4 specifies 10 m per side. [TIA-758-C §6.4]
- **B — Incorrect.** 5 m is below the TIA-758-C §6.4 minimum. This value may be encountered in some vendor installation guides as an absolute physical minimum, but it does not meet the TIA-758-C code requirement. [TIA-758-C §6.4]
- **C — Correct.** TIA-758-C §6.4 requires a minimum of **10 m (approximately 33 ft)** of cable slack on each side of a splice closure. This provides: (a) adequate length for a re-splice if the first splice fails without laying new cable, and (b) entry-loop slack so the closure can be moved during re-entry without placing the splice organizer under tension. [TIA-758-C §6.4; RUS 1751F-635 §4]
- **D — Incorrect.** 25 ft (approximately 7.6 m) is the TIA-758-C §7 below-ground splice slack requirement — but that is the slack stored inside a handhole or vault on each side of the splice point, not the per-closure-side requirement of §6.4. Do not conflate §6.4 (closure-side slack) with §7 (underground junction slack). [TIA-758-C §6.4 vs. §7]

---

**Q2.** A single-mode OSP distribution cable has an OD of 0.75 in. What is the minimum static bend radius for this cable in storage, and what is the minimum acceptable coil diameter?

- A) Static bend radius = 5.0 in.; minimum coil diameter = 10.0 in.
- B) Static bend radius = 7.5 in.; minimum coil diameter = 15.0 in. **[CORRECT]**
- C) Static bend radius = 10.0 in.; minimum coil diameter = 20.0 in.
- D) Static bend radius = 7.5 in.; minimum coil diameter = 7.5 in.

*Rationale:*
- **A — Incorrect.** This result applies the 10× rule to an OD of 0.50 in., not 0.75 in.: 10 × 0.50 = 5.0 in. For the stated 0.75-in. OD cable, the correct result is 10 × 0.75 = 7.5 in. [TIA-758-C §6.4; BICSI OSP-DRD Ch. 8.1]
- **B — Correct.** Minimum static bend radius = 10 × OD = 10 × 0.75 in. = **7.5 in.** Minimum coil diameter = 2 × bend radius = 2 × 7.5 in. = **15.0 in.** A slack rack rung, snowshoe form, or pole bracket coil diameter must be at least 15.0 in. for this cable. Note: the pole bracket minimum of 18 in. is a larger standard and would satisfy this requirement with margin. [TIA-758-C §6.4; BICSI OSP-DRD Ch. 8.1]
- **C — Incorrect.** 10× OD applied to OD of 1.0 in. would yield bend radius = 10.0 in. and coil diameter = 20.0 in. This does not correspond to a 0.75-in. OD cable. The calculation is consistent but the OD used is wrong. [TIA-758-C §6.4]
- **D — Incorrect.** The bend radius calculation is correct (7.5 in.) but the coil diameter is wrong. The minimum coil diameter equals the minimum bend radius times two (radius → diameter). 7.5 in. is the bend radius, not the coil diameter. A storage form with a 7.5-in. diameter would create a 3.75-in. bend radius — half the minimum — violating the standard. [TIA-758-C §6.4; BICSI OSP-DRD Ch. 8.1]

---

**Q3.** Which storage method is specified for fiber cable slack inside a buried pedestal with limited vertical clearance?

- A) Slack rack with horizontal rungs — compact enough for all pedestal heights
- B) Snowshoe (figure-8 coil holder) — stores the required slack in reduced vertical height compared to a circular coil **[CORRECT]**
- C) Aerial pole bracket — the figure-8 coil pattern works in any enclosure type
- D) Direct coil on the pedestal base — no storage hardware required if the cable is carefully laid

*Rationale:*
- **A — Incorrect.** A slack rack with horizontal rungs requires adequate ceiling clearance to loop cable over the rungs in circular or figure-8 configurations — this hardware is designed for vault and large handhole installations, not for compact pedestals with 12–24 in. of vertical clearance. [BICSI OSP-DRD Ch. 8.1]
- **B — Correct.** The snowshoe is designed specifically for buried pedestal slack storage where vertical clearance is limited. The figure-8 winding pattern on the oval snowshoe form stores the required slack length in approximately half the vertical height of a circular coil, making it the correct choice for compact pedestal interiors. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]
- **C — Incorrect.** The aerial pole bracket is designed for mounting on an outside pole — it cannot be used inside a buried pedestal and is specifically designed for aerial slack storage, not buried enclosure applications. [BICSI OSP-DRD Ch. 8.1]
- **D — Incorrect.** Laying fiber slack directly on a pedestal base without storage hardware creates unpredictable bend radii where the cable contacts the base corners, wall edges, and any hardware projections. A flat-lying coil without a form cannot guarantee minimum bend radius compliance. Approved storage hardware is required. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]

---

**Q4.** A technician is storing cable slack on an aerial pole bracket. Which of the following correctly describes the installation requirements?

- A) 2 loops minimum; 12-in. minimum coil diameter; metal zip ties for secure aerial retention
- B) 3–5 loops; 18-in. minimum coil diameter; Velcro (hook-and-loop) ties **[CORRECT]**
- C) 5–8 loops; 18-in. minimum coil diameter; metal hose clamps to prevent wind uplift on aerial plant
- D) 3–5 loops; 10-in. minimum coil diameter; any weather-resistant tie method is acceptable

*Rationale:*
- **A — Incorrect.** Two loops is fewer than the 3-loop minimum; 12-in. coil diameter is below the 18-in. aerial bracket minimum; metal zip ties are prohibited — Velcro is required. This option violates all three parameters. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]
- **B — Correct.** Aerial pole bracket storage requires: **3–5 loops** of cable wound in a figure-8 pattern; minimum **18-in. (450 mm) coil diameter** on the bracket form (exceeds the 10× OD minimum for cables up to 1.5-in. OD and provides design margin); **Velcro hook-and-loop ties** — metal ties and plastic ratchet ties age poorly in UV and temperature cycling and develop sharp edges that abrade the cable jacket. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]
- **C — Incorrect.** Metal hose clamps are explicitly prohibited for fiber storage in any context — vaults, pedestals, or aerial brackets. The point-loading effect of a metal clamp damages the cable jacket under thermal cycling. 5–8 loops is more than specified (3–5); the coil diameter minimum is correct. [BICSI OSP-DRD Ch. 8.1]
- **D — Incorrect.** 10-in. coil diameter is below the 18-in. minimum for aerial pole bracket storage. "Any weather-resistant tie method" is incorrect — only Velcro is approved, not metal or rigid plastic ties. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]

---

**Q5.** A field crew finishes a splice in a large splice vault and needs to store 10 m of slack for each of three cables. Which storage method is correct, and which tie method must be used?

- A) Snowshoe per cable; metal hose clamps for secure vault storage
- B) Slack rack; Velcro (hook-and-loop) ties **[CORRECT]**
- C) Aerial pole bracket; Velcro ties
- D) Direct coil on vault floor; zip ties with locking teeth are acceptable if Velcro is unavailable

*Rationale:*
- **A — Incorrect.** Snowshoe forms are designed for buried pedestals, not vaults. Metal hose clamps are prohibited in all fiber storage contexts. [BICSI OSP-DRD Ch. 8.1]
- **B — Correct.** A large splice vault is the deployment context for a **slack rack** (ladder-style or bracket rack). Cable is looped over horizontal rungs in coils that maintain the 10× OD minimum bend radius. **Velcro hook-and-loop ties** are the required tie method — distributed pressure, no mechanical over-tightening, re-removable for re-entry. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]
- **C — Incorrect.** An aerial pole bracket is designed for outdoor aerial installation — it is not applicable inside a splice vault. [BICSI OSP-DRD Ch. 8.1]
- **D — Incorrect.** Laying cable directly on the vault floor without storage hardware does not maintain minimum bend radius compliance at floor corners and edges. Zip ties with metal locking teeth are prohibited — the tooth applies point loading that damages the cable jacket. Velcro is required and must be available on every job site handling fiber. [BICSI OSP-DRD Ch. 8.1; TIA-758-C §6.4]

---

## Final Check

**Pulse 1.** For each of three deployment contexts (vault, buried pedestal, aerial pole), name the correct storage method, state the minimum coil diameter rule, and state the approved tie method.

*Expected answer:*
- **Vault:** Slack rack (ladder/bracket rack). Minimum coil diameter = 10× cable OD (e.g., 0.63-in. OD cable → 12.6-in. min. coil diameter). Tie method: Velcro hook-and-loop — no metal clamps.
- **Buried pedestal:** Snowshoe (figure-8 coil holder). Minimum coil diameter = 10× cable OD. The figure-8 form stores the required slack in reduced vertical height. Tie method: Velcro — no metal clamps.
- **Aerial pole bracket:** Figure-8 coil on pole-mounted storage bracket. Minimum coil diameter: **18 in. (450 mm)** — this standard minimum exceeds 10× OD for all cables up to 1.5-in. OD. 3–5 loops. Tie method: Velcro — no metal ties or ratchet ties.

[TIA-758-C §6.4; BICSI OSP-DRD Ch. 8.1; RUS 1751F-635 §4]

**Pulse 2.** A 0.50-in. OD drop cable is stored on a snowshoe with a 4.5-in. exterior form diameter. Is this installation acceptable, and why or why not?

*Expected answer:* **Not acceptable.** Minimum static bend radius = 10 × 0.50 in. = 5.0 in. Minimum coil diameter = 10.0 in. A snowshoe with a 4.5-in. diameter would constrain the cable to a 2.25-in. bend radius — less than half the minimum. This violates the 10× OD rule and will cause microbend-induced attenuation and risk stress-corrosion fracture of the fiber over time. Specify a snowshoe with a minimum 10-in. exterior form diameter for this cable OD. [TIA-758-C §6.4; BICSI OSP-DRD Ch. 8.1]

---

## Glossary Cross-References

- **Splice closure architecture** → T2 L2.6 (closure internals and re-entry — the reason 10 m of slack per side must be stored; coil storage is adjacent to the closure)
- **Minimum slack at underground splice points (TIA-758-C §7)** → T4 L4.8 (25 ft below-ground junction slack distinct from §6.4 closure-side slack)
- **Tracer wire and marker post placement adjacent to pull boxes** → T5 L5.7 (marking system at vault/handhole locations)
- **Pedestal and vault enclosure selection (NEMA type)** → T5 L5.8 (the enclosure housing the storage hardware)
- **Aerial pole bracket hardware and clearances** → T5 L5.4 (J-hooks and aerial hanger hardware — bracket mounting shares the pole attachment zone)
