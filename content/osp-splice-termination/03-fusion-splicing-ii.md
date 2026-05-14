---
title: "Lesson 2.3: Fusion Splicing II — Automated Splice Estimation, QA Criteria, and Re-splicing"
duration_min: 25
topic: splice-termination
order: 3
bicsi_alignment:
  - "OSP-DRD 7.4: Fusion splicing — QA, re-splice criteria, and protection sleeve application"
  - "OSP-DRD 7.1: Splice acceptance and as-built documentation"
sources:
  - "IEC 61300-3-4 (attenuation measurement — backscatter method)"
  - "Fujikura FSM-series Fusion Splicer Operation Manual (public training edition)"
  - "Sumitomo Type-82C Field Fusion Splicer Operation Guide"
  - "BICSI OSP-DRD Manual, Ch. 7.4"
  - "AT&T OSP Construction Practices (publicly available subset)"
  - "Corning Cable Systems OSP Splicing Procedures Guide, Rev. 3"
---

# Fusion Splicing II: Automated Splice Estimation, QA Criteria, and Re-splicing

## In Plain English

In Lesson 2.2 you learned how to make a fusion splice — the machine zaps an arc between the two fiber ends and welds them together. This lesson covers what happens right after the weld: **How does the machine decide whether the weld is good enough?** The splicer has a tiny camera inside that looks at the weld zone and scores it — kind of like a quality inspector on an assembly line. The score it gives you is called the *estimated splice loss*. If the score is too high (meaning too much light will be lost at that weld), you have three choices: (1) accept it anyway if it just squeaks under the limit, (2) fire the arc a second time to try to improve it (called a *re-arc*), or (3) throw the weld away and start over (called a *re-splice*). This lesson walks through that decision tree, explains why the machine's score is always slightly optimistic (the camera can't see everything), and covers how to protect the finished weld with a heat-shrink sleeve before you put it in the tray.

---

## Acronym Glossary

Every abbreviation used in this lesson, defined up front so nothing sneaks up on you.

| Acronym | Stands For | What It Means in Plain English |
|---|---|---|
| **OSP** | Outside Plant | Any fiber infrastructure installed outdoors — aerial cables, buried conduit, underground vaults — as opposed to equipment inside a building |
| **SMF** | Single-Mode Fiber | A fiber type with a very narrow core (~9 µm) that carries only one path of light; used for long-distance runs. The "OS2" type in this lesson is SMF. |
| **OS2** | Optical Single-mode 2 | A specific flavor of SMF optimized for low water-peak loss; the standard fiber type for OSP backbone and feeder construction |
| **MFD** | Mode Field Diameter | The effective width of the light beam as it travels through the fiber core. For OS2, MFD ≈ 10.4 µm (roughly the width of a human hair, divided by 8). Matters because misalignment between two fibers wastes light. |
| **PAS** | Profile Alignment System | The alignment method in high-end fusion splicers that uses cameras to look at the fiber cores directly and nudge them into alignment before firing the arc — like a robotic mechanic that lines up two pipes before welding |
| **CCD** | Charge-Coupled Device | The type of camera sensor inside the splicer that takes pictures of the fiber ends and the weld zone. Same basic technology as a digital camera. |
| **QA** | Quality Assurance | The process of checking your work to make sure it meets the standard before you move on |
| **BICSI** | Building Industry Consulting Service International | The organization that publishes the OSP Design Reference and sets the fiber industry's standard practices |
| **OSP-DRD** | Outside Plant Design Reference and Design Manual | BICSI's master reference book for fiber splicing, termination, testing, and documentation |
| **IEC** | International Electrotechnical Commission | International standards body; publishes measurement standards for fiber components and splices |
| **dB** | Decibel | A way to express how much signal is lost or gained. For splices, 0.10 dB is a good weld; 1.0 dB is a terrible weld. Lower is always better. (Think of it like a leak in a water pipe — the dB number tells you how bad the leak is.) |
| **OTDR** | Optical Time-Domain Reflectometer | A test instrument that fires light pulses down a fiber and reads the reflections back, like a sonar for fiber. Used to verify splice quality after the fact. Covered in detail in Lesson 2.10. |
| **IPA** | Isopropyl Alcohol | The cleaning solvent for fiber surfaces. Pure 99% grade only — the same thing as high-purity rubbing alcohol. |
| **RUS** | Rural Utilities Service | USDA agency that funds rural broadband construction through loan programs; sets requirements for how fiber infrastructure must be built and documented |
| **DWDM** | Dense Wavelength Division Multiplexing | A technique for packing many data channels onto a single fiber strand using different light colors (wavelengths). DWDM links use tighter splice tolerances because they're more sensitive to signal loss. |

---

## Reading Content

### How the Splicer Computes Estimated Loss

Think of the fusion splicer like a quality inspector on a welding line. After it fires the arc and fuses the two fiber ends together, it doesn't just hand you the weld and say "good luck." It immediately takes a photo of the weld zone with its built-in cameras (CCD cameras — same technology as a digital camera), analyzes what it sees, and gives you a loss score: the **estimated splice loss**, displayed in dB on the screen within a few seconds of arc completion.

This happens automatically, without you doing anything. Understanding how that score is calculated — and critically, what the camera *cannot* see — is what separates a technician who understands their equipment from one who just blindly trusts the number. [Fujikura FSM-series Manual, §5.1; Sumitomo Type-82C Guide, §4.1]

**What the image processor measures:** After the arc, the splicer's CCD cameras capture an image of the splice zone from two orthogonal angles (two cameras, 90° apart — front-and-side view). The image-processing software analyzes this image for four geometric parameters:

**1. Core offset** — how far apart the two fiber cores are in the weld zone.

Imagine trying to connect two drinking straws by holding them end-to-end. If you hold them perfectly straight, the hole lines up and water flows through easily. If one straw is shifted sideways even a tiny bit, the opening is partially blocked. That blockage is the core offset. Even with PAS alignment doing its best to line things up, a tiny residual offset (typically less than 0.5 µm — about 1/20th of a human hair) often remains.

The amount of light lost due to core offset follows a specific formula. Here's how it works, step by step:

**Formula: Core offset loss contribution**

> **What this calculates:** How much light is lost because the two fiber cores are not perfectly lined up — their centers are shifted sideways by some small amount.
>
> **Why it matters:** Even a tiny offset wastes light because the beam from Fiber A doesn't land perfectly inside the core of Fiber B. Some of that light misses and gets absorbed by the cladding.

$$\text{loss} \approx \left(\frac{\text{offset}}{\text{MFD}}\right)^2 \times 4.34 \text{ dB}$$

**Every variable defined:**
- **loss** = the estimated splice loss contribution from core offset, in **dB** (decibels)
- **offset** = the lateral distance between the two core centers in the weld zone, measured in **µm** (micrometers; 1 µm = 0.000001 meters)
- **MFD** = Mode Field Diameter — the effective width of the light beam as it travels through the fiber core, in **µm**. For OS2 SMF, MFD ≈ **10.4 µm**.
- **4.34** = a conversion factor (it converts from a natural-log ratio to decibels; you don't need to memorize why — just know it's always 4.34)
- The **²** means you square the ratio (multiply it by itself)

**Worked example:** Suppose the splicer measures a core offset of **0.5 µm** on OS2 fiber (MFD = 10.4 µm).

Step 1 — Compute the ratio:
$$\frac{0.5}{10.4} = 0.0481$$

Step 2 — Square it:
$$0.0481^2 = 0.00231$$

Step 3 — Multiply by 4.34:
$$0.00231 \times 4.34 \approx 0.010 \text{ dB}$$

**Sanity check:** A 0.5 µm offset on OS2 contributes about 0.010 dB of loss — roughly 1/10th of the 0.10 dB acceptance threshold. That's actually pretty small, which is why PAS alignment works so well: even at 0.5 µm off-center, the core-offset loss contribution alone wouldn't fail the splice. It's when offsets stack with other defects (deformation, bad cleave) that the total loss climbs above threshold. [Fujikura FSM-series Manual, §5.1]

**2. Core deformation** — whether the arc heated the fiber unevenly, distorting the shape of the core from a perfect circle into an oval or irregular shape. Imagine squeezing a round tube of toothpaste from one side — the opening goes from round to squashed. A squashed core sends light in the wrong direction. Severe deformation (visible as a distorted core shape on the screen) increases loss beyond what core offset alone would predict.

**3. Bubble presence** — a gas pocket trapped in the weld zone. Picture welding two metal pipes and accidentally trapping an air bubble in the molten joint. The bubble blocks part of the connection. Bubbles in fiber form from trapped gas or from contamination on the fiber surface (oil, gel residue, moisture) that vaporizes instantly when hit by the arc. A bubble sitting directly on the fiber core axis is the most serious: the splicer is supposed to automatically reject that splice and refuse to give you a passing score. An off-axis bubble (near the edge of the core) will still show as elevated estimated loss.

**4. End-face angle (cleave residual)** — the splicer also measures the angle of each fiber end before the arc fires (you learned about cleave angles in Lesson 2.1). It factors that measured angle into the estimated loss. A perfect cleave at 0° contributes nothing to loss; a cleave at the maximum allowed limit (~0.5° for SMF) contributes a small but measurable amount. [Fujikura FSM-series Manual, §5.1; Sumitomo Type-82C Guide, §4.1]

**What the image processor cannot measure:** Here's the catch — and it's important. The arc heating doesn't just melt and fuse the glass. It also bakes the chemicals inside the glass: dopants (germanium, fluorine) that are deliberately added to the glass recipe to control how light travels. When the arc fires, those dopants migrate — they spread outward from the core into the surrounding glass (the cladding), slightly blurring the sharp optical boundary that makes the fiber work. This migration is called **dopant diffusion**.

Dopant diffusion is *invisible to the camera*. It changes the optical properties of the glass in the weld zone, but it doesn't change the shape of what the camera sees. It's like internal rust forming inside a metal pipe that looks perfectly clean on the outside — the camera sees a clean-looking weld, but the optical performance is slightly degraded from the inside out.

This is the main reason the splicer's estimated loss almost always *underestimates* the true loss you'll measure with an OTDR later. A splice that shows 0.04 dB estimated on screen will commonly measure 0.06–0.08 dB by OTDR. This is **normal expected behavior**, not a calibration error. Think of the splicer's score like a bathroom scale that always reads about 3 pounds light — useful for trending and comparison, but not the definitive number. [BICSI OSP-DRD Manual, Ch. 7.4; AT&T OSP Construction Practices §7.2]

### Acceptance Thresholds: Three Tiers

Before you can use the accept/re-arc/re-splice decision tree, you need to know your target number — the acceptance threshold. This is the maximum loss (in dB) that a splice is allowed to have. Three tiers show up in OSP work:

| Tier | Estimated loss threshold | OTDR-measured threshold | Applicable standard or source |
|---|---|---|---|
| BICSI default (OSP backbone, RUS, construction) | ≤ 0.10 dB | ≤ 0.10 dB per splice (bidirectional average) | BICSI OSP-DRD Manual, Ch. 7.4 |
| AT&T / Verizon carrier-class (feeder and backbone) | ≤ 0.05 dB | ≤ 0.07 dB (bidirectional avg, from OTDR) | AT&T OSP Construction Practices §7.2 |
| Project-tight (metro DWDM, long-haul backbone) | ≤ 0.05 dB | ≤ 0.05 dB (OTDR-measured) | Project specification (varies) |

*Sources: [BICSI OSP-DRD Manual, Ch. 7.4; AT&T OSP Construction Practices §7.2]*

**Which threshold governs your job:** In the absence of a project-specific spec sheet, BICSI default (≤0.10 dB) applies — it's the industry floor. For government-funded rural broadband (RUS / USDA) projects, BICSI default is typically the floor; some state program offices impose tighter thresholds on trunk (backbone) routes.

**When thresholds conflict:** If your project spec says ≤0.05 dB and the screen shows 0.07 dB estimated — the tighter project spec wins. You can't override a project requirement with the industry default. And the splicer's estimated loss is not a substitute for OTDR measurement when you're near or over the acceptance line. When in doubt, OTDR measures. [BICSI OSP-DRD Manual, Ch. 7.4]

### The QA Decision Tree: Accept / Re-Arc / Re-Splice

After each splice, you run through this decision tree. The logic is: fix the problem at the cheapest level first; only step up to the more expensive option when the cheaper one won't work. [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-series Manual, §5.2]

```
SPLICE COMPLETE
    │
    ▼
[Splicer auto-inspection] ────────────────────────────────────
    │                                                          │
Cleave error detected                                  No cleave error
(angle > threshold, bubble on axis)                          │
    │                                                          ▼
Splicer auto-rejects                              Estimated loss displayed
    │                                                          │
Re-cleave both fibers                              ┌───────────┴──────────┐
and repeat                                         │                       │
                                             Loss ≤ threshold        Loss > threshold
                                             (e.g., ≤ 0.10 dB)      (e.g., > 0.10 dB)
                                                   │                       │
                                             ACCEPT                  RE-ARC eligible?
                                             Apply sleeve             ┌─────┴───────┐
                                                                   Yes              No
                                                                     │              │
                                                             Estimated loss    Core offset visible
                                                             marginally         OR bubble OR
                                                             high (0.10–0.20)   bad end-face:
                                                                     │          RE-SPLICE
                                                              FIRE RE-ARC
                                                                     │
                                                              Re-estimate
                                                              ┌──────┴──────┐
                                                           Improved      Not improved
                                                              │              │
                                                           ACCEPT         RE-SPLICE
```

**ACCEPT:** The score is at or below your threshold, no defects flagged. Grab the sleeve and apply it immediately. Proceed to the next splice.

**RE-ARC — what it is and when to use it**

Re-arc is firing the arc a second time on an already-fused splice. Think of it like a second welding pass on a joint that didn't flow quite right the first time — the extra heat lets the glass relax and settle a little more, which can shave off a few hundredths of a dB in the final score.

Re-arc is useful in a narrow window: the weld looks geometrically good (cores aligned, no bubble, no deformation), but the loss came back slightly high — typically in the 0.10–0.20 dB range. One re-arc, and often the score drops below threshold.

**Re-arc is NOT useful and must NOT be used when:**
- There is visible core offset or a bubble in the splice zone — extra heat doesn't fix a geometry problem. The cores are still misaligned after re-arc; you've just added heat without fixing the root cause.
- You've already done one re-arc on this splice — repeated re-arcs anneal (soften and weaken) the glass in the splice zone. The more you re-arc, the more brittle the joint becomes.
- The end-face had a defect before the arc — re-arc can't undo a bad cleave.

[Fujikura FSM-series Manual, §5.3; Sumitomo Type-82C Guide, §4.2; BICSI OSP-DRD Manual, Ch. 7.4]

**RE-SPLICE — starting over**

Re-splice means pulling the fused splice apart, re-stripping (if you have enough fiber length left), re-cleaning, re-cleaving both ends, and running the full splice cycle again from scratch. It's the equivalent of scrapping the weld and re-doing it.

Re-splice is required when:
- The splicer auto-rejects because of a cleave error or core-axis bubble.
- Re-arc didn't bring the loss below threshold.
- You can see a visible geometric defect (offset, deformation) on the screen.

**The catch: re-splice costs fiber.** Each re-splice attempt consumes 15–25 mm of fiber length. Before you re-splice, confirm you have enough slack remaining. You need at least 50–60 mm of prepared fiber length on each end after the sleeve is removed — roughly 20 mm of bare fiber beyond what the sleeve occupied on each side, plus room to re-strip and re-cleave. If either fiber end is too short, you can't re-splice at the current location — the whole closure has to move to expose more cable slack. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.5]

### Splice Protection Sleeve Application

Once the splice passes QA, the bare glass in the weld zone has zero physical protection — it's naked glass hanging in mid-air. Before you put it in the tray, you have to protect it with a **splice protection sleeve**: a heat-shrink reinforcement sleeve that goes over the weld zone and stiffens it so it won't over-bend when you coil it into the tray.

Think of it like heat-shrink tubing on an electrical splice — same basic idea. You shrink the sleeve around the joint, and it holds everything together and prevents sharp bends.

**Sleeve anatomy:** An outer heat-shrink polymer tube (shrinks when heated) + an inner stainless steel strength rod (rigid — prevents the fiber from bending too sharply at the weld point) + an inner hot-melt adhesive liner (melts during heating, flows around the fiber, re-solidifies as a grip during cooling).

**Application procedure:**
1. **Pre-load the sleeve.** Thread the sleeve onto one of the fibers *before* you cleave that end and make the splice. Once the two fibers are fused together, you can't slide a sleeve on — both ends are joined. If you forget to pre-load the sleeve, you'll have to re-splice. This is one of the most common rookie mistakes.
2. **Center the sleeve** over the weld zone, with equal coating extending on each side.
3. **Place in the splicer's heat oven.** Every field fusion splicer has a built-in oven for this — same machine, different compartment. It's sized exactly for standard protection sleeves.
4. **Run the heat cycle.** Typically 30–60 seconds for a standard 40 mm or 60 mm sleeve. The splicer's programmed oven cycle is calibrated for this — just press the button.
5. **Remove and cool on the cooling shelf.** The splicer also has a small cooling shelf (a flat tray on the outside of the machine). Let the sleeve sit there for 30–60 seconds until the adhesive has re-solidified and the sleeve feels rigid.
6. **Only then** place it in the splice tray.

**The cooling step is not optional.** Here's why: while the sleeve is still hot, the inner adhesive is still liquid — the sleeve is thermally compliant (bendy). If you put it straight into the curved splice tray, the tray forces the fiber into a small-radius bend while the adhesive is still molten. When the adhesive re-solidifies, it locks in that bent shape permanently. A permanent tight bend at the splice zone acts like a hinge — it creates micro-stress concentrations in the glass that can either cause micro-cracks over time or increase optical loss from bend-induced light leakage. Thirty seconds of patience on the cooling shelf prevents that entirely. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]

**Sleeve length selection:** Standard single-fiber sleeves are 40 mm (common — fits most stripped/cleaved fiber sections) or 60 mm (for longer bare fiber sections or when the 40 mm sleeve won't cover the full stripped zone). Ribbon splices use dedicated ribbon protection sleeves — wider, with a multi-fiber strength element. Never use a single-fiber sleeve on a mass-fusion ribbon splice.

### Environmental Factors Affecting Estimation Accuracy

The splicer's score is calibrated for normal conditions — room temperature, properly calibrated electrodes, standard fiber type. Several field conditions can throw it off:

**Electrode wear.** The tungsten electrodes inside the arc chamber erode over thousands of arc cycles — like a spark plug slowly wearing down. As they wear, the arc geometry changes: it becomes slightly asymmetric, heats fibers unevenly, and produces minor deformation that the camera reads as elevated loss. Both Fujikura and Sumitomo splicers include an electrode calibration routine (called "ARC CHECK" on some models) that should be run at the start of each work day — or whenever you notice the arc quality changing. Some Fujikura models adjust automatically. [Fujikura FSM-series Manual, §4.4; Sumitomo Type-82C Guide, §3.5]

**Temperature extremes.** Below freezing, glass is less plastic (less willing to flow during the arc). The same arc energy that fuses fiber perfectly at 70°F might not fully soften the glass at 20°F. Most splicers have cold-weather splice programs that increase arc energy for low-temperature conditions. The opposite happens in heat (above 40°C / 104°F) — glass flows more easily, and you might need a lower-energy program. [Fujikura FSM-series Manual, §4.3]

**Contamination after cleaning.** Any finger contact, gel residue not fully removed, oil from your skin, or moisture condensation on the fiber after cleaning introduces contamination that vaporizes when hit by the arc — creating that bubble discussed above. The camera may not see sub-surface contamination; the splice can pass estimated loss screening while having real degraded performance or long-term reliability problems. Clean twice with IPA, let dry fully, and don't touch the cleaned surface again before loading into the cleaver. [Corning OSP Splicing Guide, §3.3; BICSI OSP-DRD Manual, Ch. 7.3]

---

## Key Terms (Flashcard Candidates)

**Automated splice estimation**
The image-processor function in a fusion splicer that measures geometric parameters of the completed splice zone (core offset, deformation, bubble, cleave residual) and computes an estimated loss value. Displayed on screen within seconds of arc completion. *In plain English: the splicer's built-in quality inspector that looks at the weld with a camera and gives you a loss score.* Not equivalent to OTDR-measured optical loss; used as a field QA screening tool. [Fujikura FSM-series Manual, §5.1]

**Core deformation**
A splice zone defect in which the arc heating produces an elliptical or distorted core cross-section, visible on the splicer's inspection image. *In plain English: the core got squashed or warped by uneven heating — like squeezing a round tube of toothpaste from one side.* Increases mode field mismatch loss beyond the level predicted by core offset alone. [Fujikura FSM-series Manual, §5.1]

**Bubble**
A gas or vaporized-contamination inclusion in the splice zone, visible as a bright or dark circular feature on the splicer's image. *In plain English: a trapped air pocket in the weld — like a gas bubble in a welded metal joint. Blocks light.* A bubble on the core axis is grounds for automatic splice rejection. [Fujikura FSM-series Manual, §5.1; Sumitomo Type-82C Guide, §4.1]

**Re-arc**
A second arc cycle applied to an already-fused splice to supply additional heat, allowing further glass diffusion that can marginally reduce residual stress and slightly lower estimated loss. *In plain English: a second welding pass on the same joint — useful only when the weld looks geometrically good but the score came back slightly too high.* Effective only for marginally elevated loss on geometrically clean splices; ineffective and contraindicated for splices with visible core offset, bubbles, or defects. Limited to one re-arc per splice. [Fujikura FSM-series Manual, §5.3; BICSI OSP-DRD Manual, Ch. 7.4]

**Re-splice**
The process of separating a completed (or failed) fusion splice, re-stripping the fiber (if sufficient length allows), re-cleaning, re-cleaving both ends, and performing a new splice cycle. *In plain English: scrapping the weld and starting over.* Required when splicer auto-rejects, when re-arc fails to bring loss to threshold, or when visible geometric defects are present. Consumes 15–25 mm of fiber per attempt. [BICSI OSP-DRD Manual, Ch. 7.4]

**Splice protection sleeve**
A heat-shrink reinforcement sleeve placed over the bare splice zone after a successful fusion splice. *In plain English: heat-shrink tubing for the fiber weld — it stiffens the joint so it won't break when you coil it into the tray.* Consists of an outer heat-shrink tube, inner steel or ceramic strength rod, and optional adhesive liner. Must cool before placement in splice tray. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]

**Electrode wear compensation**
Splicer function that adjusts arc current to compensate for tungsten electrode erosion. *In plain English: automatic re-calibration as the spark plugs inside the machine wear down.* Implemented as an automatic loop (Fujikura FSM-series) or as a manual ARC CHECK calibration cycle (Sumitomo Type-82C) run at the start of each work session. [Fujikura FSM-series Manual, §4.4; Sumitomo Type-82C Guide, §3.5]

**BICSI default acceptance threshold**
≤0.10 dB estimated (or OTDR-measured bidirectional average) per splice for OS2 SMF fusion splices, per BICSI OSP-DRD Manual, Ch. 7.4. *In plain English: the industry standard "passing grade" for a splice on a normal OSP construction project.* The floor specification for OSP construction and RUS-program projects in the absence of a tighter project-specific criterion.

**Dopant diffusion**
The migration of refractive-index-modifying dopants (germanium, fluorine) across the core/cladding boundary in the heat-affected zone of a fusion splice. *In plain English: the chemical recipe of the glass changes slightly when heated — like dye spreading through water when the water gets warm. The camera can't see this happen, but it does affect how much light is lost.* Produces refractive index profile changes that are invisible to the splicer's camera, explaining the systematic difference between estimated and OTDR-measured splice loss. [AT&T OSP Construction Practices §7.2; BICSI OSP-DRD Manual, Ch. 7.4]

---

## Interactive: Scenario — QA Decision Tree Walkthrough

### Scenario

A field technician is splicing OS2 SMF in a buried closure on a RUS-funded rural broadband feeder route. The project specification requires ≤0.10 dB per splice (BICSI default). After completing Splice 7 in the closure, the splicer screen shows the following:

- Estimated splice loss: **0.18 dB**
- Cleave angle reading: **0.3° / 0.4°** (both fibers — see Lesson 2.1 for cleave angle thresholds; ≤0.5° is the SMF acceptance limit)
- Splicer image: core positions appear aligned; no visible bubble; slight brightness asymmetry at the splice zone suggesting minor electrode asymmetry

Walk through the accept / re-arc / re-splice decision for this splice.

---

**Decision step 1 — Is the estimated loss within the project acceptance threshold?**

No. 0.18 dB exceeds the ≤0.10 dB project threshold. Action required.

**Decision step 2 — Is re-arc appropriate?**

Evaluate re-arc eligibility:
- Cleave angles (0.3° / 0.4°) are within the ≤0.5° single-fiber acceptance limit ✓
- No visible core offset on splicer image ✓
- No bubble visible on core axis ✓
- Estimated loss is in the 0.10–0.20 dB range (marginally elevated, not catastrophically failed) ✓
- This is the first arc on this splice (no previous re-arc applied) ✓

All eligibility criteria for re-arc are met. **Fire re-arc.** [Fujikura FSM-series Manual, §5.3; BICSI OSP-DRD Manual, Ch. 7.4]

**Decision step 3 — Re-arc result: estimated loss improves to 0.07 dB**

0.07 dB < 0.10 dB acceptance threshold. No visible defects on re-inspection. **Accept the splice.** Apply protection sleeve immediately. [BICSI OSP-DRD Manual, Ch. 7.4]

---

**Alternate branch — Re-arc does not improve loss (result: 0.16 dB)**

If re-arc had returned 0.16 dB:
- Re-arc did not reduce loss to threshold.
- Re-arc has now been used once on this splice — additional re-arcs are contraindicated (they weaken the splice zone glass without fixing the problem).
- Core is visually aligned; no geometric defect explains the persistent loss.
- Most likely cause: dopant diffusion or sub-surface contamination that the camera can't see (remember — the camera only measures geometry, not chemistry).

**Action: Re-splice.** Pull the splice, confirm remaining fiber length (at least 20 mm additional bare fiber from each side after sleeve removal). Re-clean and re-cleave. If the fiber is too short, the closure must be repositioned to expose additional slack. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.5]

---

**Alternate branch — Bubble visible on core axis**

If the post-arc image had shown a bubble on the core axis: the splicer should auto-reject. If the operator is working with an older splicer that does not auto-reject, or if the bubble appears on re-arc image inspection: **Re-splice immediately.** Re-arc cannot remove a bubble — you'd just be heating a weld with a trapped pocket of gas in it. More heat does not make the bubble disappear; it may shift it slightly but will not produce a clean splice zone. A core-axis bubble is an optical obstruction and will blow far past any acceptance threshold on OTDR. [Fujikura FSM-series Manual, §5.2; BICSI OSP-DRD Manual, Ch. 7.4]

---

## Multiple-Choice Quiz

---

**Q1.** A splicer displays an estimated splice loss of 0.14 dB on OS2 SMF with no visible core offset, no bubble, and a cleave angle of 0.4°. The project specification is ≤0.10 dB. The technician considers firing a re-arc. Which statement best describes whether re-arc is appropriate?

- A) Re-arc is not appropriate — the cleave angle of 0.4° is the root cause, and the fibers must be re-cleaved
- B) Re-arc is appropriate — the splice is geometrically good and the loss is marginally elevated without visible defects **[CORRECT]**
- C) Re-arc is not appropriate — re-arc is only permitted when estimated loss exceeds 0.20 dB
- D) Re-arc is appropriate — it should always be attempted before re-splicing, regardless of loss level or visible defects

*Rationale:*
- **A — Incorrect.** A cleave angle of 0.4° is within the ≤0.5° acceptance threshold for single-fiber fusion — this is not an out-of-spec cleave. The cleave angle is not the root cause of the elevated loss. Re-cleaving is not warranted based on a compliant cleave angle. [IEC 61300-3-35 §4.1; BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Correct.** Re-arc is appropriate when: the estimated loss is marginally elevated (0.10–0.20 dB range); the cleave angle is within spec; there is no visible core offset or bubble in the splice zone; and this is the first arc attempt. All four conditions are met. Re-arc supplies additional heat to allow further glass diffusion, which can reduce residual stress-related loss in geometrically good splices. [Fujikura FSM-series Manual, §5.3; BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Incorrect.** There is no ">0.20 dB" minimum threshold for re-arc eligibility. Re-arc is appropriate for any marginally elevated loss on a geometrically good splice where it meets the eligibility criteria — the 0.10–0.20 dB range is a typical working guidance for when re-arc is useful, not a hard trigger threshold. [Fujikura FSM-series Manual, §5.3]
- **D — Incorrect.** Re-arc is contraindicated when visible defects are present (core offset, bubble, deformation). Applying re-arc to a splice with a core-axis bubble, for example, does not remove the bubble and further anneals the glass, potentially worsening splice zone integrity. Re-arc is not a universal first step before re-splice. [Fujikura FSM-series Manual, §5.3; BICSI OSP-DRD Manual, Ch. 7.4]

---

**Q2.** Immediately after a re-arc, the splicer displays an estimated splice loss of 0.08 dB — below the project's ≤0.10 dB threshold. The technician removes the splice from the holder and immediately places it in the splice tray. The protection sleeve has been heated but the technician skips the cooling step to save time. What risk does this introduce?

- A) No risk — the acceptance threshold has been met and the sleeve is heated correctly
- B) The sleeve's heat-shrink bond may fail without cooling, causing the sleeve to slide off the splice zone in service
- C) The still-hot sleeve in the curved splice tray can induce a bend set in the glass during cooling, risking micro-crack initiation or elevated bend loss **[CORRECT]**
- D) Skipping cooling only affects sleeve cosmetics (appearance); it has no impact on optical performance

*Rationale:*
- **A — Incorrect.** The acceptance threshold is met, but the protection sleeve application process has not been correctly completed. Skipping the cooling step is a procedure error that introduces a specific mechanical risk. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]
- **B — Incorrect.** A properly heated sleeve that shrinks around the fiber and cools will maintain its grip. The concern is not sleeve bond failure — it is the behavior of the glass while the sleeve is still hot and the fiber is forced into a tray bend radius. [Corning OSP Splicing Guide, §5.1]
- **C — Correct.** If the splice protection sleeve is still hot (and the hot-melt adhesive liner is still fluid) when the spliced fiber is placed in the tray, the fiber can be forced into a small-radius bend by the tray geometry while the glass is still slightly compliant from residual heat. As the sleeve cools in that bent position, it sets a permanent bend at the splice zone — creating a micro-stress concentration that can cause micro-crack initiation over time or elevated bend-loss. The cooling step allows the sleeve to solidify in a straight, unstressed position before the fiber is bent to tray radius. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]
- **D — Incorrect.** Sleeve appearance is not the concern — structural integrity of the glass at the splice zone is. This is not a cosmetic procedure step. [Corning OSP Splicing Guide, §5.1]

---

**Q3.** A technician splices two OS2 fibers and the splicer auto-rejects, displaying "BUBBLE ON AXIS." The technician fires a re-arc to attempt to remove the bubble. After re-arc, the bubble is still visible. What should the technician do?

- A) Fire a second re-arc — repeated re-arcs at increasing energy will eventually vaporize the bubble
- B) Accept the splice if estimated loss is below the project threshold, despite the visible bubble
- C) Re-splice — a core-axis bubble cannot be removed by re-arc and requires a new splice cycle **[CORRECT]**
- D) Apply the protection sleeve and proceed — the bubble will anneal out of the splice zone in service under thermal cycling

*Rationale:*
- **A — Incorrect.** A gas or vaporized-contamination bubble in the glass matrix cannot be removed by re-arcing. Additional heat does not eliminate the bubble — it may cause the bubble to migrate slightly or merge with micro-voids, but it will not produce a clear splice zone. Repeated re-arcs on a splice with a core-axis bubble progressively anneal and weaken the splice zone glass without resolving the defect. [Fujikura FSM-series Manual, §5.2; BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Incorrect.** A core-axis bubble is a structural defect in the splice zone, not merely an elevated loss reading. The splicer auto-rejected this splice for a reason. Even if the estimated loss appears acceptable on re-arc (the bubble might be slightly off-axis post-re-arc), the bubble represents a long-term reliability risk — bubbles introduce stress concentrations that can propagate to fracture under thermal cycling or mechanical loading. [Fujikura FSM-series Manual, §5.2; BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Correct.** A core-axis bubble requires re-splice. The bubble formed from a gas or vaporized contamination inclusion during arc fusion — re-arc does not remove it. The technician must pull the splice, identify the contamination source (inadequate pre-cleave cleaning, gel residue, moisture), re-clean thoroughly, re-cleave, and re-splice. [Fujikura FSM-series Manual, §5.2; BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.5]
- **D — Incorrect.** Bubbles in fused silica glass do not "anneal out" under service temperatures. Optical fiber service temperatures (−40°C to +70°C typical for OSP) are far below the glass softening point (approximately 1900°C for silica). The bubble will remain structurally unchanged throughout the service life of the cable plant. [Fujikura FSM-series Manual, §5.2]

---

**Q4.** A project specification for a government RUS-funded rural broadband route states splice loss ≤0.10 dB (BICSI default). A PAS fusion splicer consistently produces estimated losses of 0.03–0.06 dB per splice throughout the closure. The OTDR operator verifies these splices and reports all bidirectional average losses in the range 0.05–0.09 dB. What conclusion is most accurate?

- A) The splicer is out of calibration — estimated loss should match OTDR loss for a PAS splicer
- B) The OTDR measurements are incorrect — OTDR-measured loss typically equals estimated loss for high-quality PAS splices
- C) This is the expected relationship — estimated loss typically underestimates true optical loss, particularly for good-quality splices; all splices pass the ≤0.10 dB specification **[CORRECT]**
- D) The splices fail — OTDR-measured loss must not exceed estimated loss; splices where OTDR > estimated must be re-done

*Rationale:*
- **A — Incorrect.** The splicer is not out of calibration. Estimated loss systematically underestimates true optical loss because the image processor cannot measure dopant diffusion in the splice zone — a physical phenomenon invisible to the camera. The 0.03–0.06 dB estimates producing 0.05–0.09 dB OTDR measurements is entirely consistent with correct splicer operation. [Fujikura FSM-series Manual, §5.1; BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Incorrect.** OTDR-measured and estimated losses are not expected to match. Estimated loss systematically underestimates, not equals, the optical loss for well-executed splices. The OTDR measurements in this scenario are consistent with the expected relationship, not indicative of error. [Fujikura FSM-series Manual, §5.1; IEC 61300-3-4 §5]
- **C — Correct.** Estimated loss from a PAS splicer systematically underestimates true optical loss because the image processor measures geometric parameters (core offset, deformation) but cannot see dopant diffusion in the splice zone. A splice showing 0.03–0.06 dB estimated frequently measures 0.05–0.09 dB by OTDR. All measurements reported (0.05–0.09 dB OTDR-measured) are below the ≤0.10 dB RUS/BICSI threshold — all splices pass. [Fujikura FSM-series Manual, §5.1; BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-4 §5]
- **D — Incorrect.** There is no requirement that OTDR-measured loss must not exceed estimated loss. Estimated loss is a proxy indicator, not a floor. OTDR > estimated is the normal expected relationship for well-executed splices. The acceptance criterion is whether OTDR-measured loss is within the project threshold, not whether it matches or is below the estimated value. [BICSI OSP-DRD Manual, Ch. 7.4]

---

**Q5.** A splice protection sleeve has been heated and removed from the splicer's oven. The oven cycle completed 15 seconds ago. The technician needs to place the sleeved fiber in the splice tray to complete the closure before an incoming weather front arrives. What should the technician do?

- A) Place the splice in the tray immediately — 15 seconds of cooling is sufficient for standard 40 mm sleeves
- B) Wait the full 30–60 second cooling period on the cooling shelf before placing in the tray **[CORRECT]**
- C) Cool the sleeve under cool water to accelerate cooling and immediately place in the tray
- D) The cooling step applies only to 60 mm sleeves; 40 mm sleeves can be placed in the tray immediately after oven removal

*Rationale:*
- **A — Incorrect.** 15 seconds is insufficient for the hot-melt adhesive liner to solidify and the outer heat-shrink tube to stabilize. The sleeve will still be thermally compliant 15 seconds after oven removal — placing it in a curved tray at this point imposes a bend radius on still-soft material, potentially setting a permanent bend at the splice zone. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]
- **B — Correct.** The standard cooling period is **30–60 seconds** on the integrated cooling shelf before placing the sleeved splice in the tray. This allows the outer heat-shrink tube to fully contract and the inner adhesive liner to solidify, locking the splice zone geometry in a straight, unstressed position. The incoming weather front is not a justification for shortcutting this procedure step — a failed splice from a heat-set bend radius creates far more delay than 45 seconds of cooling time. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]
- **C — Incorrect.** Applying water to a heated splice protection sleeve and fiber assembly is not an approved cooling method. Thermal shock from rapid water cooling can induce micro-fractures in the splice zone glass. This method is not specified by any splicer manufacturer or industry standard. [Fujikura FSM-series Manual; Corning OSP Splicing Guide, §5.1]
- **D — Incorrect.** The cooling requirement applies to all standard splice protection sleeve sizes — 40 mm and 60 mm — and is not sleeve-size dependent. The physical mechanism (hot-melt adhesive solidification, heat-shrink stabilization) applies to both sleeve lengths. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]

---

## Final Check

Answer these three questions before advancing to Lesson 2.4 (Mass-Fusion Splicing).

**Pulse 1.** State the three eligibility conditions that must be met before a re-arc is appropriate, and identify one condition that disqualifies re-arc as an option.

*Expected answer:* Re-arc is appropriate when: (1) estimated loss is marginally elevated (e.g., 0.10–0.20 dB) without visible geometric defects; (2) cleave angles are within spec (≤0.5° for SMF, as established in Lesson 2.1); (3) this is the first arc on this splice (no previous re-arc applied). Re-arc is **disqualified** when any of the following are present: visible core offset, bubble on the core axis, core deformation, or a bad end-face. Re-arc cannot correct geometric defects — only re-splice can. [Fujikura FSM-series Manual, §5.3; BICSI OSP-DRD Manual, Ch. 7.4]

**Pulse 2.** Why does a splicer's estimated splice loss typically underestimate the OTDR-measured optical loss, and what does this mean for field acceptance documentation?

*Expected answer:* Estimated loss is computed from geometric measurements (core offset, deformation, bubble, cleave residual) by the image processor. It cannot see **dopant diffusion** — the migration of refractive index-modifying dopants across the core/cladding boundary during arc heating — which changes the waveguide's optical properties in the splice zone in a way that the camera is blind to. As a result, estimated loss systematically underestimates true optical loss. For acceptance documentation, **OTDR-measured bidirectional average splice loss** is the governing value — not the splicer's estimated loss display. [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-series Manual, §5.1; IEC 61300-3-4 §5]

**Pulse 3.** A splice protection sleeve has been heated in the splicer oven and removed. Describe the two steps remaining before this fiber is ready for placement in the splice tray.

*Expected answer:* (1) **Place the sleeved fiber on the cooling shelf** (integrated into the splicer) for 30–60 seconds to allow the hot-melt adhesive to solidify and the outer heat-shrink tube to stabilize in a straight, unstressed geometry. (2) **Verify the sleeve has cooled** (the adhesive liner is no longer fluid; the sleeve is rigid and holds its shape) before placing the fiber in the tray at the tray's bend radius. Placing a still-hot sleeve in the curved tray can set a permanent bend at the splice zone during cooling. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Splice & Termination topic:

- **Automated splice estimation** → Lesson 2.4 (Mass-Fusion — mass-fusion splicers use an analogous per-fiber estimation algorithm across the ribbon array)
- **Re-arc / re-splice** → foundational decision vocabulary for all fusion splice QA; referenced in Lesson 2.4 and Lesson 2.12 (Acceptance Testing — re-splice rate is a field productivity metric in as-built documentation)
- **Splice protection sleeve** → Lesson 2.4 (ribbon splices use dedicated ribbon protection sleeves — different product, same principle); Lesson 2.7 (Splice Trays — sleeves are placed in trays with minimum bend radius considerations)
- **BICSI default acceptance threshold (≤0.10 dB)** → Lesson 2.10 (OTDR Testing — per-splice event thresholds on the OTDR trace correlate to this acceptance value); Lesson 2.12 (Acceptance Testing — governing criterion for RUS / OSP construction projects)
- **Dopant diffusion** → Lesson 2.2 back-reference for why estimated ≠ measured; forward: Lesson 2.4 (ribbon splicing — dopant diffusion contributes to the per-fiber loss distribution across a mass-fusion array)
- **Electrode wear compensation** → Lesson 2.4 (ribbon splicers use the same electrode calibration requirement; Sumitomo ARC CHECK and Fujikura auto-compensation apply identically to ribbon splicer models)
