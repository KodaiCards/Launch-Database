---
title: "Lesson 5.12: Identification and Labeling — Cable Tags, Route Markers, RFID, and Physical Attachment"
duration_min: 20
topic: osp-hardware-accessories
order: 12
bicsi_alignment:
  - "BICSI OSP-DRD Ch. 10.2: Outside plant identification and labeling hardware"
sources:
  - "TIA-758-C §9 (outside plant identification requirements — labeling and marking)"
  - "BICSI OSP-DRD Manual, Ch. 10.2"
  - "RUS Bulletin 1751F-630 §9 (identification and marking requirements for RUS-funded OSP routes)"
---

# Identification and Labeling: Cable Tags, Route Markers, RFID, and Physical Attachment

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- State the T5 L5.12 scope boundary: physical hardware only (tag material, attachment method, marker post intervals, BOM placement)
- Specify the correct cable tag material and attachment method for buried, pedestal, and aerial applications
- Apply the TIA-758-C §9 marker post interval requirements to a multi-segment route
- Describe the RFID enhancement for above-grade marker posts and state what data the RFID chip stores
- Place labels correctly on the BOM for a multi-segment route scenario

---

## Reading Content

### Scope Boundary — Read Before Proceeding

**T5 L5.12 owns PHYSICAL hardware only:**
- Cable tag material and construction
- Tag attachment method (what you attach it with and how)
- Marker post intervals (where posts go)
- BOM placement (which BOM items carry identification hardware)

**T4 L4.10 owns CODE BASIS — do NOT re-teach here:**
- TIA-606-C identifier hierarchy (campus, route, cable, tube, fiber)
- TIA-598-D fiber color codes (buffer tube and fiber strand color sequences)
- Identifier construction format

**T3 L3.12 owns RECORDS — do NOT re-teach here:**
- As-built drawings and documentation
- RUS Forms 515c and 219 (record submission)
- Record linkage from physical labels to the as-built database

If you need to build a TIA-606-C path ID for a given route, the structure taught in T4 L4.10 applies. This lesson shows you where and how to attach the tag that carries that ID — not how to construct the ID itself.

### Cable Tags — Material and Construction

A cable tag is a permanent label attached directly to the cable jacket or conduit at intervals and at every splice, junction, and termination point. The function is direct physical identification of the cable in the field — "what is this cable and where does it go?" — without requiring a database lookup [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2; RUS 1751F-635 §9].

**Approved tag materials:**

| Material | Application context | Service life |
|---|---|---|
| **316 Stainless steel (SS)** | Buried, vault, aerial — high-durability applications | 40+ years |
| **UV-resistant polyester (e.g., Dymo-type industrial label, UV-stabilized)** | Above-grade pedestal, aerial — shorter service life acceptable | 15–20 years with UV stabilization |

No paper labels, standard vinyl labels, or non-UV-rated adhesive labels — these degrade in outdoor and buried environments within 2–3 years. RUS 1751F-630 §9 requires durable, weatherproof labels for all RUS-funded OSP routes. [RUS 1751F-630 §9; TIA-758-C §9]

**Tag content:** The tag carries the path ID (TIA-606-C hierarchy — see T4 L4.10) and, where required by project specification, the owner contact information and installation date. The tag does not need to repeat information legible from the physical route marking posts (APWA color, utility type) — that is the marker post's function.

### Tag Attachment Method

**Approved method: lashing wire loop.**

Tags are secured to cable jackets using a small-diameter stainless steel wire (typically 24 AWG or 26 AWG) looped through the tag eyelet or hole and twisted closed — forming a continuous loop that encircles the cable jacket [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2].

**Why lashing wire loop, not adhesive:**

> **No adhesive attachment in buried or wet environments.**

Adhesive labels fail in buried and wet applications. Soil contact, temperature cycling, and hydrostatic pressure all degrade adhesive bond strength. A label that falls off in the vault five years after installation is worse than no label at all — it creates a false "unlabeled cable" condition in the as-built record. Lashing wire loops maintain positive mechanical attachment through the full service life of the installation [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2; RUS 1751F-630 §9].

**Aerial applications:** Same lashing wire loop method. Do not use adhesive cable labels on aerial cable in direct UV and rain exposure.

**Pedestal interior applications:** Lashing wire loop preferred. UV-resistant polyester adhesive label is acceptable inside a NEMA 4 sealed pedestal (protected from rain and direct UV) only if the project specification permits — otherwise default to lashing wire loop.

**Loop sizing:** The lashing wire loop should be loose enough to allow slight movement of the tag along the cable (not constricting the cable jacket) but tight enough that the tag cannot slide more than 6 in. from its target location. A loop tightened to the cable jacket creates the same point-loading risk as a metal clamp on fiber storage (Lesson 5.11 Velcro rule analogy) — do not cinch the wire tight.

### Marker Post Placement — BOM Integration

Marker posts are above-grade physical route markers (L5.7 established the TIA-758-C §6.4 placement intervals: route start, route end, every 500 ft of continuous run, every direction change, every crossing approach). This lesson addresses the identification data on those posts — not the intervals, which are L5.7 scope.

**Marker post label content:**

Each above-grade marker post carries:
1. **Utility type:** "FIBER OPTIC CABLE" (or equivalent per APWA convention)
2. **Owner/operator name and emergency contact number**
3. **Route ID** (where required by project specification): the TIA-606-C campus or route identifier (see T4 L4.10) assigned to the OSP route segment
4. **Installation year** (optional, some project specifications require)

The label on the post must be durable for the service life of the post — UV-resistant polyester or engraved/printed HDPE post body. No paper or standard vinyl labels on above-grade posts exposed to direct sunlight.

### RFID Integration in Marker Posts

An emerging physical identification enhancement for above-grade marker posts is an embedded **RFID (Radio Frequency Identification) chip** within the post body [CGA Best Practices v18; BICSI OSP-DRD Ch. 10.2].

**What the RFID chip stores:**
- Route ID (TIA-606-C route identifier)
- Installation date
- Owner/operator contact data
- GPS coordinates of the post location (where programmed at installation)
- Work order or project ID

**How it is read:** A handheld RFID reader (passive UHF RFID, typically 900 MHz range) held within 12–18 in. of the above-grade post reads the chip data without physical contact or visual alignment. This allows utility locating personnel to identify the route and owner from the post without removing the post or requiring clear weather conditions to read the printed label.

**RUS applicability:** RFID-enhanced marker posts are consistent with RUS 1751F-630 §9 identification requirements. RFID is an enhancement, not a replacement for the printed label — the post must carry a durable printed label as the primary identification in addition to any RFID chip.

### BOM Placement Summary

The identification and labeling BOM items appear in the following locations on a typical OSP route project:

| BOM location | Identification hardware |
|---|---|
| Each cable at every splice closure entry | Stainless steel or UV-polyester cable tag (lashing wire loop attached) |
| Each cable at every handhole / pull box access | Cable tag (lashing wire loop) |
| Each cable at conduit entry/exit points at building entry | Cable tag (lashing wire loop) |
| Above-grade marker posts (at TIA-758-C §6.4 intervals) | Durable printed label (APWA color body) ± RFID chip |
| Pedestal interior — splice closure housing the FDH or MST | Cable tag (lashing wire loop) on each cable entering closure |

---

## Key Terms (Flashcard Candidates)

**Cable tag**
A permanent physical label attached to a cable jacket or conduit at splice points, junctions, and terminations. Material: 316 SS (buried/aerial, high-durability) or UV-resistant polyester (above-grade enclosed applications). Attachment: lashing wire loop — no adhesive in buried or wet environments. Content: TIA-606-C path ID per T4 L4.10 hierarchy. [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2; RUS 1751F-630 §9]

**Lashing wire loop attachment**
The approved physical method for securing cable tags to cable jackets. A small-gauge stainless steel wire (24–26 AWG) is looped through the tag eyelet and twisted closed around the cable jacket. Maintains mechanical attachment through temperature cycling and buried/wet conditions where adhesive fails. Loop must not constrict the cable jacket. [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2]

**UV-resistant polyester label**
An approved cable tag material for above-grade and pedestal interior applications. Must be UV-stabilized; rated for 15–20 years outdoor service. Not acceptable as the sole label material in buried or continuously wet environments. [TIA-758-C §9; RUS 1751F-630 §9]

**RFID marker post**
An above-grade marker post with an embedded passive UHF RFID chip that stores route ID, installation date, owner contact, and GPS coordinates. Read by a handheld reader within 12–18 in. Enhancement to (not a replacement for) the durable printed surface label. [CGA Best Practices v18; BICSI OSP-DRD Ch. 10.2]

**T5 L5.12 scope boundary**
T5 L5.12 owns physical hardware: tag material, attachment method, marker post identification content, BOM placement. T4 L4.10 owns code basis (TIA-606-C identifier hierarchy, TIA-598-D color codes). T3 L3.12 owns records (as-built drawings, RUS Forms 515c + 219). Do not re-teach color codes or identifier structure in this lesson. [T4 L4.10; T3 L3.12]

---

## Interactive: Scenario — Multi-Segment Route Labeling BOM

**Scenario prompt:**

A 1,200-ft OSP route includes: one splice closure in a buried vault (3 cables entering), one buried distribution pedestal (2 cables entering), and one aerial MST (1 distribution cable entering, 4 drop cables). The route has one direction change and two road crossings.

**Part A — Cable tag count:**
- Vault (3 cables at closure entry): 3 tags
- Pedestal (2 cables at closure entry): 2 tags
- Aerial MST (1 distribution + 4 drops): 5 tags
- Total cable tags: **10 tags**

**Part B — Tag material:**
- Vault cables: **316 stainless steel** — buried, wet environment
- Pedestal cables (NEMA 4 sealed): **316 SS preferred; UV-polyester acceptable if project spec permits**
- Aerial MST cables: **316 SS or UV-polyester** — aerial outdoor, direct UV

**Part C — Marker post count (TIA-758-C §6.4 — placement is L5.7 scope; this scenario applies the interval rule to size the BOM):**
- Route start: 1
- Route end: 1
- Direction change: 1
- Road crossing 1 (both approach sides): 2
- Road crossing 2 (both approach sides): 2
- Intermediate posts (1,200 ft ÷ 500 ft = 2.4 intervals → 1 intermediate post after accounting for fixed-post coverage): 1
- Total marker posts: **8**

**Part D — Attachment method for all cable tags:** Lashing wire loop (24–26 AWG SS wire). No adhesive.

---

## Multiple-Choice Quiz

---

**Q1.** What is the approved cable tag material for a cable tag attached to an OSP feeder cable inside a buried splice vault?

- A) Standard vinyl adhesive label — widely available and adequate for enclosed vault environments
- B) UV-resistant polyester adhesive label — acceptable for any OSP application
- C) 316 stainless steel tag with lashing wire loop attachment **[CORRECT]**
- D) Paper tag with lamination — cost-effective for permanent installations

*Rationale:*
- **A — Incorrect.** Standard vinyl adhesive labels degrade in buried and wet environments within 2–3 years. Adhesive bond fails under temperature cycling and hydrostatic pressure. A label that falls off leaves an unlabeled cable in the as-built record — a worse outcome than not labeling at all. [TIA-758-C §9; RUS 1751F-630 §9]
- **B — Incorrect.** UV-resistant polyester adhesive labels are acceptable in above-grade enclosed applications (e.g., sealed NEMA 4 pedestal interior) where there is no buried/wet exposure. They are not the approved material for a buried splice vault where hydrostatic pressure and groundwater contact are expected. [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2]
- **C — Correct.** 316 stainless steel tags with lashing wire loop attachment are the correct specification for buried and vault OSP applications. SS is corrosion-resistant in buried/wet environments and has a service life of 40+ years. The lashing wire loop (24–26 AWG SS wire) provides positive mechanical attachment without adhesive. [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2; RUS 1751F-630 §9]
- **D — Incorrect.** Paper tags with lamination are not approved for any OSP outdoor or buried application. Laminate delaminate in wet conditions; paper tags become unreadable within months in a buried vault environment. No paper tags in OSP. [TIA-758-C §9; RUS 1751F-630 §9]

---

**Q2.** Why is adhesive attachment prohibited for cable tags in buried and wet OSP environments?

- A) Adhesive labels cannot be printed with TIA-606-C path IDs in the field
- B) Adhesive bond strength degrades under temperature cycling, soil contact, and hydrostatic pressure, causing the label to fall off — a worse outcome than not labeling **[CORRECT]**
- C) Adhesive attachment violates TIA-598-D color code requirements for cable identification
- D) Adhesive is prohibited only for aerial applications where UV degrades the adhesive; buried environments are acceptable

*Rationale:*
- **A — Incorrect.** Field printing capability is a procurement issue, not the reason adhesive is prohibited. TIA-606-C path IDs can be printed on adhesive labels; the label's failure mode is the issue, not its content. [TIA-758-C §9]
- **B — Correct.** Adhesive labels fail in buried and wet environments because: (1) soil contact abrades and lifts label edges; (2) temperature cycling (warm/cold seasonal swings in buried environments) creates differential expansion between the label and cable jacket, peeling the adhesive; (3) hydrostatic pressure in flooded vaults forces water under the label, degrading the adhesive bond. A label that falls off is worse than no label — it creates a false "unlabeled cable" condition and removes the identification data from the physical plant while leaving no record of the failure. Lashing wire loops do not rely on adhesive and maintain attachment through all these conditions. [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2]
- **C — Incorrect.** TIA-598-D governs fiber and buffer tube color codes, not label attachment method. There is no TIA-598-D prohibition on adhesive labels. The prohibition on adhesive comes from the failure mode analysis in TIA-758-C §9 and BICSI OSP-DRD Ch. 10.2. [TIA-758-C §9; T4 L4.10]
- **D — Incorrect.** Adhesive is prohibited in buried environments as well as aerial UV-exposed applications. Both environments create adhesive bond failure, albeit through different mechanisms (UV/rain for aerial; soil contact/hydrostatic pressure for buried). [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2]

---

**Q3.** An above-grade marker post has an embedded RFID chip. What data does the RFID chip store, and what is the primary identification requirement the chip supplements (but does not replace)?

- A) RFID stores GPS coordinates only; it replaces the printed label entirely
- B) RFID stores route ID, installation date, owner contact, and GPS coordinates; it supplements but does not replace the durable printed surface label **[CORRECT]**
- C) RFID stores the TIA-598-D fiber color sequence for all fibers in the route; it is required by TIA-758-C §9
- D) RFID stores only the installation work order number; the post print label carries all route identification

*Rationale:*
- **A — Incorrect.** RFID stores route ID, installation date, owner contact, and GPS coordinates — not GPS alone. More importantly, RFID does not replace the printed label — a durable printed label is still the primary required identification on the post. [CGA Best Practices v18; BICSI OSP-DRD Ch. 10.2]
- **B — Correct.** The RFID chip embedded in an enhanced marker post stores: route ID (TIA-606-C route identifier), installation date, owner/operator contact data, and GPS coordinates of the post location. It is read by a handheld passive UHF RFID reader within 12–18 in. RFID is an enhancement to the primary identification system — the post must still carry a durable printed surface label (UV-resistant polyester or engraved HDPE body) that provides visual identification without electronic equipment. [CGA Best Practices v18; BICSI OSP-DRD Ch. 10.2]
- **C — Incorrect.** RFID chips on marker posts do not store TIA-598-D fiber color sequences — that data belongs in the as-built database (T3 L3.12 scope). Fiber color coding is not post-level identification data. TIA-758-C §9 does not require RFID — it is an enhancement per CGA Best Practices. [CGA Best Practices v18; T3 L3.12; T4 L4.10]
- **D — Incorrect.** The work order number alone is insufficient route identification data for a utility locating request. Route ID, owner contact, and GPS coordinates are the primary data stored. The work order may be stored as additional data but is not the primary purpose. [CGA Best Practices v18; BICSI OSP-DRD Ch. 10.2]

---

**Q4.** Which of the following correctly describes the scope of T5 L5.12 vs. T4 L4.10 for OSP identification?

- A) T5 L5.12 owns fiber color codes and identifier hierarchy; T4 L4.10 owns tag material and attachment method
- B) T5 L5.12 owns physical hardware (tag material, attachment method, marker post intervals, BOM placement); T4 L4.10 owns code basis (TIA-606-C identifier hierarchy and TIA-598-D color codes) **[CORRECT]**
- C) Both T5 L5.12 and T4 L4.10 teach the same content; the scope boundary only applies to field work, not training
- D) T5 L5.12 owns the identifier hierarchy because it covers the hardware where labels are placed; T4 L4.10 is irrelevant once T5 is complete

*Rationale:*
- **A — Incorrect.** The scopes are reversed. T5 L5.12 owns physical hardware; T4 L4.10 owns the code basis (color codes and identifier hierarchy). Teaching fiber color codes or identifier hierarchy in T5 L5.12 would re-teach T4 scope — specifically prohibited. [T4 L4.10; Brief §T5 L5.12 boundary]
- **B — Correct.** The boundary is explicit: T5 L5.12 = physical hardware (what the tag is made of, how it is attached, where marker posts go, what goes on the BOM). T4 L4.10 = code basis (TIA-606-C identifier structure, TIA-598-D color codes). Building a TIA-606-C path ID uses T4-taught structure; attaching the tag that carries that ID uses T5-taught method. [T4 L4.10; T3 L3.12; Brief §T5 L5.12 boundary]
- **C — Incorrect.** The scope boundary applies to training content — re-teaching T4 content in T5 L5.12 creates duplication, learner confusion, and potential contradictions if the content ever diverges between topics. The boundary is structural and content-enforced, not just a field-work distinction. [Brief §T5 L5.12 boundary]
- **D — Incorrect.** The identifier hierarchy is established once in T4 L4.10 and cross-referenced thereafter. T5 L5.12 cross-references T4 L4.10 for the hierarchy and applies T5-scope physical attachment. Completing T5 does not make T4 L4.10 irrelevant — the T4 structure is required to understand what to write on the T5-specified tags. [T4 L4.10; T5 L5.12]

---

**Q5.** At which locations on an OSP route does the project BOM include cable tags?

- A) At route start and route end only — intermediate cable tags are optional
- B) At every marker post location only — marker posts and cable tags are co-located
- C) At every splice closure entry, every handhole and pull box access, and every conduit entry/exit at building entry **[CORRECT]**
- D) Only at above-grade locations — buried cables do not require tags because they are inaccessible

*Rationale:*
- **A — Incorrect.** TIA-758-C §9 requires cable tags at all access points and splice locations — not only at route start and end. Intermediate splice closures, handholes, and conduit entry points are where cables are most likely to be worked on; these are the locations where positive cable identification is most critical. [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2]
- **B — Incorrect.** Marker posts and cable tags are separate BOM items with different placement logic. Marker posts are at above-grade locations defined by TIA-758-C §6.4 intervals and route geometry. Cable tags are at access points (splice closures, handholes, conduit entry/exits). They often do not co-locate. [TIA-758-C §9; TIA-758-C §6.4]
- **C — Correct.** Cable tags belong at every location where a field technician may interact with the cable: (1) every splice closure entry (each cable entering the closure), (2) every handhole and pull box access (so cables can be identified during maintenance or repair without tracing the full route), and (3) every conduit entry/exit at building entries (building-side demarcation). These are the locations where "what is this cable?" is most frequently asked during the service life of the plant. [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2; RUS 1751F-630 §9]
- **D — Incorrect.** Buried cables require tags at all buried access points (handholes, vaults, splice closures) — these are buried locations that are accessed for maintenance. The prohibition on adhesive (in this lesson) addresses the material selection for buried tags — it does not exempt buried cables from tagging requirements. [TIA-758-C §9; RUS 1751F-630 §9]

---

## Final Check

**Pulse 1.** State the T5 L5.12 scope boundary in one sentence, then name the cross-reference lessons for the two topics that T5 L5.12 explicitly does NOT own.

*Expected answer:* T5 L5.12 owns **physical hardware** — cable tag material, tag attachment method, marker post identification content, and BOM placement. It does NOT own: (1) **TIA-606-C identifier hierarchy and TIA-598-D color codes** — that is T4 L4.10 scope; (2) **As-built records and RUS Forms 515c + 219** — that is T3 L3.12 scope. Both must be cross-referenced at the open of this lesson. [Brief §T5 L5.12 boundary; T4 L4.10; T3 L3.12]

**Pulse 2.** A cable tag must be attached to a distribution cable inside a buried handhole. Specify the tag material, the attachment method, and why adhesive is prohibited at this location.

*Expected answer:* **Tag material:** 316 stainless steel — corrosion-resistant for buried/wet environments; 40+ year service life. **Attachment method:** Lashing wire loop — 24–26 AWG SS wire looped through the tag eyelet and twisted closed around the cable jacket; loose enough not to constrict the cable, tight enough to prevent sliding more than 6 in. **Why not adhesive:** Adhesive bond degrades under soil contact, temperature cycling, and hydrostatic pressure in buried environments — the label falls off and leaves an unlabeled cable in the as-built record, which is worse than not labeling. [TIA-758-C §9; BICSI OSP-DRD Ch. 10.2; RUS 1751F-630 §9]

---

## Glossary Cross-References

- **TIA-606-C identifier hierarchy and path ID construction** → T4 L4.10 (identifier structure taught there; tags in this lesson carry those IDs)
- **TIA-598-D fiber color codes** → T4 L4.10 (color coding for buffer tubes and fibers; not re-taught here)
- **As-built records, RUS Forms 515c + 219** → T3 L3.12 (physical labels feed the record system; record system scope is T3, not T5)
- **Marker post placement intervals** → T5 L5.7 (TIA-758-C §6.4 intervals established there; this lesson covers what goes on the post, not where the post goes)
- **RFID as a damage-prevention tool** → CGA Best Practices v18 (broader utility locating context for RFID integration)
- **Pedestal and cabinet NEMA rating** → T5 L5.8 (the enclosure type affects tag material choice — NEMA 4 sealed pedestal may permit UV-polyester label inside)
