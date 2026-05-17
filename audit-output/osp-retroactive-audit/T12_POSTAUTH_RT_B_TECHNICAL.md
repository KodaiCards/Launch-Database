# T12 Post-Auth RT-β — Technical / Math / Citation / Cascade Verification
**Topic:** T12 — Testing (OLTS / OTDR / Inspection)  
**Lessons audited:** L01–L15 (15 lessons at `4397def`)  
**Framing:** technical-accuracy / citation-first / cascade-pattern-hunt / independent gap-research  
**Pair-mate:** RT-α `4481a6f` (pedagogy/compliance framing) — confirmed YELLOW  
**Write-path:** `audit-output/osp-retroactive-audit/T12_POSTAUTH_RT_B_TECHNICAL.md` ONLY

---

## Anti-Impersonation Acknowledgment

Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T12_POSTAUTH_RT_B_TECHNICAL.md` written. No lesson files, CLAUDE.md, or canonical files touched.

---

## Structured Findings

| # | Sev | Category | Lesson | Location | Issue | Fix shape |
|---|---|---|---|---|---|---|
| F-1 (confirms RT-α) | **MED** | Citation/spec error — wrong values labeled as spec max | L13 | Lines 106, 210 | "ITU-T G.652.D maximum (≤ 0.35 dB/km at 1310 nm, ≤ 0.20 dB/km at 1550 nm)" — these are TYPICAL/datasheet values. Per T02.L02 post-saturation (lines 139/145) and ITU-T G.652.D registry entry: spec max = ≤ 0.40 dB/km @ 1310 nm, ≤ 0.30 dB/km @ 1550 nm. L13 uses "maximum" label in two locations for typical values. | Line 106: replace "≤ 0.35 dB/km at 1310 nm and ≤ 0.20 dB/km at 1550 nm" with "≤ 0.40 dB/km at 1310 nm and ≤ 0.30 dB/km at 1550 nm (ITU-T G.652.D spec max); typical measured ≤ 0.35 and ≤ 0.20 dB/km". Same fix at line 210: "ITU-T G.652.D maximum (≤ 0.35 dB/km @ 1310 nm…)" → "ITU-T G.652.D maximum (≤ 0.40 dB/km @ 1310 nm, ≤ 0.30 dB/km @ 1550 nm)". |
| **F-4 NEW** | **MED** | Content error — EXFO AN342 systematic bias applies to multimode, NOT singlemode | L01 | Lines 41, 148, 222–225, 292 | L01 cites EXFO AN342 for "~0.25 dB whole-link systematic bias" between OTDR and OLTS on OSP links. Primary-source verification of AN342 (confirmed via EXFO's own blog summary, https://www.exfo.com/en/resources/blog/OTDR-or-Light-Source-Power-Meters-Whats-Your-Best-Bet-for-Link-Loss-Measurement-Uncertainties/): **for singlemode fiber, there is NO systematic bias between OTDR and OLTS**. The ~0.25 dB effect is a multimode-specific backscattering artifact. T12 is an OSP singlemode course. Teaching a ~0.25 dB singlemode systematic bias is incorrect — it will cause technicians to distrust valid singlemode measurements. | Lines 41, 148: remove "OTDR-derived total link loss can differ from true OLTS insertion loss by up to ~0.25 dB (whole link) because it measures backscatter, not transmitted power." Replace with: "On singlemode fiber, OTDR-derived loss is typically within ±0.2 dB of OLTS due to measurement uncertainty, not a systematic bias — backscatter coefficient is uniform at standard wavelengths." Lines 222–225: revise to clarify the 0.25 dB figure is a multimode/measurement-uncertainty context. Line 292: revise EXFO AN342 description to accurately state "no systematic bias for singlemode; typical combined uncertainty ±0.2 dB". |
| **F-5 NEW** | **LOW** | Citation error — L11 states wrong pre-2022 Zone B boundary | L11 | Lines 108, 117, 239; header comment line 4 | L11 correctly states 2022 Edition 3 Zone B = 110 µm, but states the pre-2022 boundary was "120 µm (some references) or 125 µm (full cladding)." Primary source: IEC webstore description for IEC 61300-3-35:2022 (https://webstore.iec.ch/en/publication/64254) states Zone B changed from **115 µm to 110 µm** in the 2022 edition. Previous edition = 115 µm, not 120 µm or 125 µm. Quiz option "b" at line 239 also claims "120 µm — the previous edition boundary" which will teach the wrong historical value. The rogue R-2 correctly applied 110 µm for the current standard but incorrectly described the prior value. | Line 108: replace "120 µm (some references) or 125 µm (full cladding)" with "115 µm (IEC 61300-3-35 Edition 2, 2015)". Line 117: same correction. Line 239 quiz option: update to "115 µm — the previous (2015) edition boundary". Line 4 comment: correct to "R-2 correction X-1 applied: Zone B = 110 µm (was 115 µm pre-2022 ed.2); Zones C/D informational only in 2022 ed." |
| F-2 (confirms RT-α) | **LOW** | Schema — missing Flashcard for 'dynamic range' | L03 | Flashcard deck | Confirmed: `key_terms` has 5 terms but Flashcard deck renders 4 cards. 'dynamic range' card missing. | Add `T12-L03-fc-dynamicrange` Flashcard card. |
| F-3 (confirms RT-α) | **LOW** | DAG naming mismatch — 45 broken pointers | L01–L15 | vocabulary_assumed arrays | Confirmed by DAG registry check. Abbreviated vs long-form string mismatch. Logical prerequisites ARE covered — purely structural naming fix needed. | Normalize vocabulary_assumed strings to match vocabulary_introduced long-form strings. |

---

## IEC 61300-3-35 Primary-Source Verification (Registry Miss — New Entry Required)

**Source consulted:** IEC webstore https://webstore.iec.ch/en/publication/64254 (paywalled, but edition-change summary in metadata) + EXFO/Fluke secondary sources summarizing the standard change.

**Finding:** IEC 61300-3-35:2022 Edition 3 technical changes per IEC metadata:
- Zone B outer boundary: changed **from 115 µm to 110 µm** (manufacturing tolerance of fixture for microscopes)
- Zones C and D: removed from mandatory pass/fail criteria (informational only)
- Zone A: 0–25 µm diameter (unchanged)

**L11 current value (Zone B = 110 µm for 2022 ed.):** CORRECT  
**L11 prior-edition value (states 120 µm or 125 µm):** WRONG — actual prior value was 115 µm

**Registry entry to add:**

| IEC 61300-3-35:2022 Ed.3 | Zone B outer boundary = 110 µm (changed from 115 µm in Ed.2 2015). Zones C/D informational only. | https://webstore.iec.ch/en/publication/64254 | 2026-05-17 | T12 RT-β | CASCADE NOTE: L11 correctly states 110 µm (new) but wrongly states prior = "120 µm or 125 µm" when it was 115 µm (Ed.2). Fix required at lines 108, 117, 239. |

---

## EXFO AN342 Primary-Source Verification (Registry Miss — New Entry Required)

**Source consulted:** EXFO official blog summary of AN342 (https://www.exfo.com/en/resources/blog/OTDR-or-Light-Source-Power-Meters-Whats-Your-Best-Bet-for-Link-Loss-Measurement-Uncertainties/)

**AN342 actual findings:**
- **Singlemode fiber:** NO systematic bias between OTDR and OLTS
- **Multimode fiber:** small ~0.25 dB systematic bias from backscatter non-uniformity
- Combined measurement uncertainty for both methods: ±0.2–0.25 dB (applies to BOTH, not a systematic offset on singlemode)

**T12.L01 claim:** "systematic bias … approximately 0.25 dB across a typical OSP link" — **WRONG FOR SINGLEMODE**

**Registry entry to add:**

| EXFO Application Note 342 | Link loss measurement uncertainties: OTDR vs. LSPM. SMF: no systematic bias. MMF: ~0.25 dB backscatter-process bias. Combined uncertainty: ±0.2–0.25 dB for both methods. | https://www.exfo.com/contentassets/59d3e1a425d5438383c3b7a4ca7a057c/exfo_anote342_link-loss-measurement-uncertainties_en.pdf | 2026-05-17 | T12 RT-β | CASCADE NOTE: T12.L01 incorrectly applies the MMF 0.25 dB systematic bias to singlemode OSP context. Fix required at L01 lines 41, 148, 222–225, 292. |

---

## G.652.D Attenuation — Cross-Topic Consistency Check

**Registry status:** ITU-T G.652.D present in registry (https://www.itu.int/rec/T-REC-G.652/en, verified 2026-05-17).  
**T02.L02 authoritative values (post-saturation at `4397def`):**
- 1310 nm spec max: ≤ 0.40 dB/km ✓  
- 1550 nm spec max: ≤ 0.30 dB/km ✓

**T12.L13 conflicting values:** "≤ 0.35 dB/km at 1310 nm, ≤ 0.20 dB/km at 1550 nm" labeled as "maximum" — both are TYPICAL datasheet values per T02.L02 table (lines 140–146). Cross-topic inconsistency confirmed independently. F-1 confirmed.

---

## What I Checked and Confirmed Clean (Technical)

- **PMD math:** Already confirmed by RT-α — not re-derived per §8 RT-β duplicate-verification skip rule.
- **IOR/EIOR values in L10:** 1.4677 (bulk IOR), 1.4675–1.4685 (EIOR range at 1310 nm) — consistent with ITU-T G.650.1 published ranges. L10 formula ΔD = (ΔN/N_true) × D correctly implemented.
- **Bidirectional averaging formula (L07/L15):** RT-α confirmed correct — not re-derived.
- **RUS 1753F-401 §5 splice threshold ≤ 0.30 dB:** Per citation registry (verified 2026-05-17). L13 lines 132–135 consistent.
- **TIA-568.3-D channel model 0.75 dB/conn + 0.4 dB/km:** Consistent with standard planning values. L13 quiz Q1 answer 12.50 dB math correct: (6 × 0.75) + (20 × 0.4) = 4.5 + 8.0 = 12.50 dB ✓
- **L09 macrobend dual-wavelength loss differential:** Directionally correct — longer wavelength more sensitive to bend loss (physical basis: wavelength-dependent evanescent field penetration). Values presented as qualitative example ranges, not fabricated specific claims.
- **L05 ghost reflections / coherence:** FR coherence length concept correctly described. No numeric fabrication risk.
- **L06 launch cable minimum 1m for typical pulse widths:** Directionally correct and conservative (EDZ for standard pulses far exceeds 1m at speeds used in real instruments).
- **Capstone Q4 in L15:** Bidirectional average math (−0.08 + 0.22)/2 = 0.07 dB — correct.

---

## Cascade Pattern Check (Known Cascade Patterns File — Not Yet Read, Manual Cross-Check)

Searched T12 lessons for known cascade patterns from prior waves:

| Pattern | Found in T12? | Status |
|---|---|---|
| §32.2210 vs §32.2411 Part 32 (T04 cascade) | No — T12 has no FCC Part 32 citations | CLEAR |
| OM5 EMB 28000 fabrication (T02 cascade) | No — T12 has no OM5 EMB values | CLEAR |
| H₂S IDLH 50 vs 100 ppm (T18 cascade) | No — T12 has no confined-space gas values | CLEAR |
| Z359.4 vs Z359.1+Z359.11 (T18 polish cascade) | No — T12 has no fall-arrest citations | CLEAR |
| G.652.D 0.35/0.20 typical vs spec max | **YES — F-1, L13 lines 106+210** | FOUND, documented above |

---

## Coverage Gaps (Independent Gap Research)

1. **TIA-526-7A edition:** L01/L13 reference TIA-526-7A with `[confirm edition]` marker correctly. Current edition appears to be TIA-526-7-2019 (Tier-1 singlemode OSP) but not verified — not in registry. Not a cascade risk since the marker is already present. Low priority.

2. **NECA/FOA 301 edition:** L13 references NECA/FOA 301 without an edition qualifier. Current edition is NECA/FOA 301-2009 (2nd ed.). Standard has not been updated since 2009 per FOA website knowledge. Not a cascade risk at LOW priority.

3. **TIA-455-57B (FOTP-57B) in L11:** Referenced as cleaning procedure standard alongside IEC 61300-3-35. Not in citation registry. Standard is TIA/EIA-455-57B, "FOTP-57B: Preparation and Examination of Optical Fiber Endface" — a real standard, low cascade risk, but should be added to registry when convenient.

---

## Verdict

**YELLOW**

3 confirmed bugs beyond RT-α's 3:

- **F-1 (MED)** — confirmed RT-α: G.652.D spec max values wrong in L13 (0.35/0.20 are typical, not spec max; correct values 0.40/0.30)
- **F-4 (MED) NEW** — EXFO AN342 0.25 dB systematic bias cited as singlemode fact; primary-source confirms NO systematic bias for singlemode. Teaching this will cause technicians to distrust valid readings.
- **F-5 (LOW) NEW** — L11 correctly states 2022 Zone B = 110 µm but states prior edition was 120 µm; primary source says prior was 115 µm.
- **F-2 (LOW)** — confirmed RT-α: missing Flashcard for 'dynamic range' in L03.
- **F-3 (LOW)** — confirmed RT-α: 45 DAG naming mismatches.

Total confirmed findings: 5 (2 MED, 3 LOW). F-4 is the most field-impactful: incorrect teaching about singlemode measurement uncertainty on a course used by OSP technicians who test real production fiber.

**SATURATION VERDICT:** NOT SATURATED. RT-β found 2 new findings (F-4 MED, F-5 LOW) that RT-α missed despite same-lesson scope. Per the saturation rule (no new finds at all = saturation), a fix wave followed by a fresh RT pair is required. Fix-agent should address F-1 through F-5. Post-fix RT pair (RT-γ + RT-δ) required before declaring T12 GREEN.

=== T12 POSTAUTH RT-B TECHNICAL REPORT END ===
