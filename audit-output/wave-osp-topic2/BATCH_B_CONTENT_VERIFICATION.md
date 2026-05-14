# OSP Topic 2 Batch B — Content Verification (Auditor A: Math / Citation / Consistency)

**Role:** Auditor A — math/citation/internal-consistency framing (independent, no Auditor B contact)
**Date:** 2026-05-14
**Branch:** `claude/debug-previous-issues-MoN9D`
**Scope:** `05-mechanical-splicing.md`, `06-splice-closures.md`, `07-splice-trays-buffer-tube-management.md`, `08-termination-methods.md`

---

## Stack Snapshot

Four lessons, ~1,400 lines total. Three confirmed findings: one HIGH (L2.8 APC return-loss table value contradicts its own scenario and Q3 rationale — a direct method-selection trap), one HIGH (L2.5 Fresnel terminology — body text and Q2 rationale teach wrong physics for index-matching gel function), and one MEDIUM (L2.6 IEC 60068-2-14 misapplied — thermal shock standard cited for dynamic water pressure testing). All math verified; tray counts, loss budgets, time calculations all correct. Vendor neutrality maintained across all four lessons.

---

## Findings Table

| # | Severity | Category | Lesson | File | Line Range | Snippet | Issue | Fix Shape | Confidence |
|---|---|---|---|---|---|---|---|---|---|
| B-1 | HIGH | Math / Terminology | 2.5 | `05-mechanical-splicing.md` | 45, 185 | `"0.3–0.4 dB of Fresnel return loss per interface"` (line 45); `"0.3–0.4 dB of return loss and 0.2–0.3 dB of insertion loss"` (line 185) | Two errors compound. (a) Line 45 body text: the 0.3–0.4 dB figure is the insertion loss from **two** glass–air interfaces (~0.31 dB calculated), not "return loss per interface." Return loss (ORL) at a single glass–air interface is ~14.6 dB. (b) Q2 rationale line 185 further splits the single quantity into "0.3–0.4 dB of return loss AND 0.2–0.3 dB of insertion loss" — presenting them as additive. They are not; total insertion loss from two Fresnel interfaces is ~0.31 dB. Learners are taught that the index-matching gel eliminates ~0.5–0.7 dB of combined loss when the actual figure is ~0.31 dB IL and the return-loss concept is misframed. | Line 45: replace "0.3–0.4 dB of Fresnel return loss per interface" with "~0.3 dB of insertion loss at the two-interface gap (0.155 dB per interface × 2)." Line 185: consolidate to "approximately 0.3 dB of insertion loss from the two air-glass interfaces at the gap; back-reflection (ORL) at a bare glass–air interface is ~14.6 dB." | HIGH |
| B-2 | HIGH | Citation + Internal Consistency | 2.8 | `08-termination-methods.md` | 171, 226–227, 277–278 | Table row line 171: `"≥ 45 dB"` (APC column, cleave-and-crimp); scenario line 226: `"typical return loss ≥ 55 dB per Corning product data"`; Q3 rationale line 277: `"typical return loss of ≥55–60 dB"` | Performance summary table (line 171) states cleave-and-crimp APC return loss as `≥ 45 dB`. But the interactive scenario (line 226) and Q3 rationale (line 277) both state `≥ 55–60 dB` for SC-APC cleave-and-crimp — consistent with Corning UniCam SC-APC product specification. The table is the primary reference learners consult for method selection. A learner using the table would incorrectly conclude SC-APC cleave-and-crimp fails a `≥ 55 dB` specification, when both the scenario and Q3 rationale confirm it passes. This is a direct method-selection trap on a common OSP specification threshold. | Update table line 171 APC column from `≥ 45 dB` to `≥ 55 dB` for cleave-and-crimp. The `≥ 45 dB` figure approximates UPC performance range; APC geometry deflects back-reflection regardless of field cleave quality via the factory-polished 8° stub. | HIGH |
| B-3 | MEDIUM | Citation Scope | 2.6 | `06-splice-closures.md` | 80 | `"Dynamic pressure events (water hammer during conduit flushing, hydrostatic surge in flooded vaults) are tested separately under IEC 60068-2-14 thermal shock and related environmental test regimes."` | IEC 60068-2-14 is the **thermal shock** test standard (temperature cycling, not water). Dynamic water pressure ingress testing (water jet, water hammer) is tested under IEC 60529 higher second-digit codes (IP×5, IP×6 for jets) or dedicated hydrostatic pressure methods — not thermal shock. A student researching how closures are qualified for conduit-flush events will not find water pressure tests under IEC 60068-2-14. | Replace IEC 60068-2-14 citation with correct standard (IEC 60529 §14.2.9 for jet resistance, or note the test is a manufacturer-specific hydrostatic method). Remove "thermal shock" from the parenthetical or confine it to a separate sentence about temperature cycling qualification. | HIGH |
| B-4 | LOW | Math Imprecision | 2.8 | `08-termination-methods.md` | 249–250 | `"the fusion splice cycle time (4–6 minutes per fiber × 96 = 6.4–9.6 hours for one technician, or 3.2–4.8 hours for two) is feasible within the 6-hour window."` | The one-technician minimum (6.4 hours) exceeds the stated 6-hour window; the rationale then concludes "feasible" without explicitly anchoring the feasibility claim to the two-technician scenario. A learner who reads the rationale sequentially could conclude one technician is sufficient. The correct answer (C — pigtail + fusion splice) is right; this is a precision gap in the supporting rationale only. | Add explicit qualifier: "With two technicians (3.2–4.8 hours), the work is feasible within the 6-hour window; a single technician would require 6.4–9.6 hours, which marginally or substantially exceeds the window." | MEDIUM |

---

## Negative Findings (Confirmed Clean)

**L2.5 — All quiz math correct.** Interactive scenario: 3.5 dB budget − 2.8 dB current = 0.7 dB remaining; 0.7 − 0.4 = 0.3 dB post-repair. Q5: 3.6 + 0.4 = 4.0 dB (zero margin), 3.6 + 0.05 = 3.65 dB (0.35 dB margin). All arithmetic verified correct.

**L2.5 — Go/no-go framework is internally consistent.** Three conditions correctly stated across body text, decision tree, and Pulse 2 answer. No contradictions found.

**L2.5 — Vendor neutrality.** 3M Fibrlok II and Corning CamSplice cited at parity throughout body text, anatomy section, and key terms. No single-vendor preference.

**L2.6 — IP68 digit definitions correct.** IEC 60529 first digit 6 (dust-tight) and second digit 8 (continuous immersion at manufacturer-specified depth/duration) correctly stated throughout lesson and Q2.

**L2.6 — Tray count math correct.** Q5: 72 fibers ÷ 12 per tray = 6 trays + 1 spare = 7. Pulse 3: 144 ÷ 24 = 6 + 1 spare = 7. Both correct.

**L2.6 — Closure brand parity.** Corning, CommScope, AFL, TE Connectivity/Tyco all cited; no vendor favored across dome/inline/sealing discussions.

**L2.6 — Gel-seal time labels correct in context.** Body text line 102 gives re-entry time (15–30 min); comparison table gives initial installation time (10–20 min). These are distinct operations, both correctly labeled in context.

**L2.7 — Minimum bend radius stated correctly.** OS2 SMF ≥30 mm per ANSI/TIA-758-C §7.2 consistently stated in body, key terms, quiz Q1, and pulse answers. Ribbon fiber ≥37.5 mm correctly distinguished.

**L2.7 — All quiz math and diagnosis chains correct.** Q2 OTDR distance of 0.5 m correctly attributed to macrobend loop contact (not splice point degradation). Q4 distributed-loss pattern correctly attributed to microbend from cover pinching (not splice sleeve degradation). Q5 multi-fiber simultaneous wiping risk correctly identified as incomplete gel removal, not cross-contamination.

**L2.8 — Pigtail + splice total insertion loss math correct.** 0.10–0.20 dB (connector) + 0.02–0.05 dB (splice) = 0.12–0.25 dB. Verified.

**L2.8 — Hot-melt and epoxy time math correct.** Hot-melt 96 connectors: 96×13–20 = 1,248–1,920 min = 20.8–32 hours. Epoxy 96: 96×30–40 = 2,880–3,840 min = 48–64 hours. Both confirmed correct.

**L2.8 — UPC/APC mating incompatibility correctly stated.** ">2 dB insertion loss" from mis-mating is consistent with published data. Q2 correct answer and rationale confirmed.

**L2.8 — Cleave angle cross-lesson consistency.** L2.5 uses ≤1.5° for mechanical splices; L2.8 uses ≤1.0° for cleave-and-crimp connectors. These are legitimately different thresholds for different applications — not a contradiction.

**Cross-lesson Batch A consistency.** Mechanical splice loss 0.3–0.5 dB consistent with Batch A L2.2 table. Cleave angle ≤1.5° for mechanical splice consistent with Batch A L2.1.

---

## Coverage Gaps

**IEC 61753 series** (cited in the Batch B task prompt as a plausible citation for connector performance): not cited in any of the four lesson files. L2.8 uses IEC 61300-3-4 for attenuation measurement and ANSI/TIA-568.3-D §6.5 for insertion loss limits. Whether IEC 61753 should be added is a content-completeness question, not a math/citation error — deferred to Fix Agent judgment.

**Manufacturer source verification**: All cited manufacturer guide sections (3M Fibrlok II Guide §1.1, §2.1, §3.2, §4.1; Corning UniCam Guide §1.1, §4; Corning SCF/SCB Guide §1, §3.1, §4–5; CommScope FOSC-400 Manual §1.2, §2.1, §4; AFL Closure Design Guide §2.2–4.2) are plausible public-edition section numbers but cannot be verified against the actual documents in this read-only audit. If these guides are publicly accessible, cross-check section numbers for the three HIGH findings.

**Return loss for hot-melt APC**: Body text and table both note hot-melt APC is "(limited)" or unavailable as a standard product — this is correct per market reality but was not independently verified against 3M product catalog. Not flagged as an error; flagged as unverified.

---

=== TOPIC 2 BATCH B CONTENT VERIFICATION END ===
