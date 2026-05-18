# T15 Research Brief — R-2 (Corroboration-Adversarial)
**Topic:** T15 — Restoration & Outage Response  
**Framing:** Corroboration-first / High-recall / Adversarial (find what R-1 missed or got imprecise)  
**Cross-checking:** R-1 brief at `audit-output/osp-rewrite-curriculum/T15_BRIEF_R1.md`

---

## R-1 Corroboration Findings

**AGREE — confirmed accurate:**
- OTDR fault-locate formula: `Distance = (IOR × t_return) / (2 × c)` — confirmed standard OTDR physics (FOA reference + basic optics). OTDR displays this as "distance to event" using stored IOR.
- IOR for G.652.D at 1550 nm: 1.4681 ± manufacturer variation — R-1's "verify from manufacturer datasheet" caveat is correct. Corning's typical value is ~1.4682; the ±0.001 variance is real. R-1 handled this correctly.
- OSHA 1926.651(b) hand-dig/tolerance zone: confirmed as the correct 24-inch hand-dig requirement near marked utilities. The "soft dig" (vacuum excavation) equivalence is widely accepted by state CGA-member jurisdictions, though individual states vary.
- OSHA 1926 Subpart P shoring: 5-ft threshold, Type C soil 1½:1 slope — confirmed in Table B-1. R-1's note that emergency does NOT exempt from shoring is correct and critical.
- MOP elements framework from Telcordia/ATIS: confirmed applicable. SR-4422 covers emergency restoration for network elements; the MOP structure R-1 describes matches industry-standard practice.
- RTO vs. MTTR distinction: confirmed. RTO is SLA target; MTTR is empirical average. Important pedagogy — many OSP crew conflate the two.

**CORROBORATE WITH REFINEMENT:**

1. **OTDR dead zone specificity (R-1 said "0.8–2.5 m"):** Adversarial framing — R-1's range is reasonable but the author should distinguish two dead zone types:
   - **Event dead zone (EDZ):** minimum distance between two events that the OTDR can resolve as separate events. Typically 2–10 m depending on pulse width. (For ultra-short pulse: ~0.8–2 m. For standard trace pulse: 3–10 m.)
   - **Attenuation dead zone (ADZ):** distance after a reflection event before the OTDR can make accurate loss measurements. Typically 10–25 m.
   For fault-locate training, the EDZ is the relevant concept (can the OTDR resolve a connector vs. break in close proximity?). R-1 conflated the two slightly by saying "0.8–2.5 m" as a single range — that's EDZ-range for short-pulse instruments only. The author should specify which dead zone type and note that real fault locate at a splice-closure (e.g., 1 m after the last fusion splice) may fall within ADZ of the closure.

2. **OTDR slack factor (R-1 said "2–4% excess"):** Adversarial framing — R-1 says "2–4% excess" for cable slack factor. This is approximately right for aerial construction but UG cable (direct-buried or conduit) installed with controlled pulling tension typically has 0.5–1.5% slack factor (ICEA/manufacturer guidance). Aerial cable has higher slack (sag + loops + coils) yielding 2–5% slack factor on typical routes. The author should present both contexts.

3. **Emergency MOP approval authority:** R-1 says "emergency MOP with fewer approval steps is accepted by most carriers." This is accurate for carrier practice but the author should add the specific point: many carrier change-control policies require a "verbal authorization" from a network manager or NOC supervisor, which is then documented post-fact in the MOP. The key phrase is "who is the emergency authorization authority and what does that verbal authorization accomplish?" This is a high-value field-practice detail for learners who will be in the field calling a NOC for emergency authorization.

4. **Generator CO risk citation:** R-1 flagged that OSHA 1910.94(a) is the wrong citation for generator CO risk. Correct: NIOSH recommendations call for 20 ft minimum generator separation and exhaust directed away from air intakes. CDC "Carbon Monoxide Poisoning Prevention" and NIOSH alert DHHS (NIOSH) Publication 96-118 are better primary sources. R-2 **confirms** R-1's precision note is correct — the 10-ft distance in R-1 is actually below NIOSH's 20-ft recommendation. **Flag for author: use 20 ft (NIOSH minimum) in T15.L05, not 10 ft.**

---

## R-2 New Findings (what R-1 did not cover)

### GAP-1 — Fiber type confirmation during emergency restoration
R-1 mentions confirming fiber type (OS2 G.652.D) before splice but doesn't detail the confirm procedure. The field method:
- Check cable label (sheath printing) for fiber type designation.
- If sheath is damaged, cut sample: count fibers, count tubes, check for waterblock gel vs. dry. If no label visible: OTDR the intact fiber at 1550 nm — G.652.D shows very low loss at 1550 nm; multi-mode fiber shows dramatically higher loss at 1550 nm than 850 nm.
- **Critical:** splicing G.652.D to G.652.B (older, higher PMD) or G.654 (submarine) is mechanically possible but may not meet loss budgets for high-speed transmission. Emergency splice between mismatched fiber types should be documented and flagged for permanent fix.

### GAP-2 — Cable identification in multi-conduit environments
R-1 doesn't cover the scenario where multiple cables share a conduit or duct bank and the break is in one cable but you can't visually distinguish which cable. Field method: use OTDR from BOTH ends to confirm the damaged cable by distance cross-match. If cables run parallel and are similarly labeled: a flashlight/wand test (inject light at one end, see which cable glows at the other) identifies the specific cable. This is a common source of field delay — author should cover it explicitly in L02 or L03.

### GAP-3 — Splice closure reinstallation on emergency repairs
R-1 discusses splicing but not the closure reinstallation requirements. For buried splice: any opened closure must be re-sealed per the manufacturer's installation guide AND per RUS Bulletin 1751F-630 §7.4 (closure installation). The closure seal is the primary water-exclusion mechanism — an improperly re-sealed closure during an emergency restore will develop water ingress within months, causing another outage. Emergency restores with inadequate closure seals are a documented pattern (FOA restoration case studies). Author should include in L04 (permanent repair) or L05.

### GAP-4 — Catv/telecom pole clearing requirements during aerial restoration
For aerial emergency restoration (damaged aerial cable from vehicle strike, ice loading, etc.), NESC Part 4 Rule 420-435 governs worker approach to energized conductors. R-1 mentions NESC Rules but T15 should specifically cover: if an aerial cable is on a joint-use pole and the incident caused damage to the pole or other attachments, the OSP crew cannot approach until:
- Electric utility has been notified and arrived (or confirmed no grounded conductors in the work zone)
- Minimum approach distances per T18.L07 (MAD/MAB — vocabulary_assumed for T15.L03 aerial scenarios)
This is a safety prerequisite for aerial restoration — T15.L03 should include it explicitly or add a vocabulary_assumed reference to T18.L07.

### GAP-5 — Post-restoration OTDR trace labeling convention
R-1 covers OTDR trace archiving but doesn't specify the industry-standard file naming convention. FOA recommends: `[ProjectID]_[RouteSegment]_[Date]_[Wavelength]_[Technician].sor`. The `.sor` format (Bellcore SR-4731) is the standard binary OTDR data file format supported by virtually all OTDR vendors. T15.L09 should teach this: archive the `.sor` file, not just a screenshot. Screenshots are non-reproducible; `.sor` files can be re-analyzed with any compatible viewer.

---

## R-2 Precision Corrections to R-1

| R-1 Claim | Status | Correction |
|---|---|---|
| Generator: "10-ft separation" | **INCORRECT** | NIOSH recommendation = 20 ft minimum. Correct in L05 before authoring. |
| OTDR dead zone: "0.8–2.5 m" | **IMPRECISE** | EDZ and ADZ are distinct concepts. Specify EDZ ≈ 0.8–5 m (pulse-dependent), ADZ ≈ 5–25 m. |
| Slack factor: "2–4% excess" | **IMPRECISE for UG** | UG: 0.5–1.5%; aerial: 2–5%. Context matters. |
| All other R-1 claims | CONFIRMED | IOR, shoring, 811 emergency, MOP structure, RTO/MTTR, customer communication. |

---

## Updated DAG Vocabulary List

R-2 adds to R-1's list:

**Additional vocabulary_introduced for T15:**
- `event dead zone (EDZ)` (T15.L02)
- `attenuation dead zone (ADZ)` (T15.L02)
- `emergency MOP` (T15.L08)
- `.sor file format` (T15.L09)
- `verbal emergency authorization` (T15.L08)
- `cable identification (multi-conduit)` (T15.L03)
- `splice closure reinstallation` (T15.L04 or L05)

**Additional vocabulary_assumed for T15.L03 aerial scenarios:**
- `MAD, MAB` → `source_lesson_id: 'T18.L07'` (aerial emergency with joint-use pole damage)

---

## Lesson Risk Assessment (for author attention)

| Lesson | Risk | Mitigation |
|---|---|---|
| L02 | IOR precision — readers may hard-code 1.4681 as universal | Author to note "verify from manufacturer spec" prominently |
| L02 | EDZ vs ADZ confusion | Author to define both terms explicitly at first use |
| L05 | Generator CO — 10 ft is wrong | Author to use 20 ft (NIOSH) |
| L03 | Multi-conduit identification gap | Add GAP-2 content |
| L04 | Mismatched fiber type on emergency splice | Add GAP-1 content |
| L04/L05 | Closure reinstallation quality | Add GAP-3 content |
| L03 | Aerial restoration joint-use safety | Add T18.L07 vocabulary_assumed + brief coverage |

=== T15 RESEARCH BRIEF R-2 END ===
