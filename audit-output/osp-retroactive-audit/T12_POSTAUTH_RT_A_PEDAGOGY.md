# T12 Post-Auth RT-α — Pedagogy / Compliance Verification
**Topic:** T12 — Testing (OLTS / OTDR / Inspection)  
**Lessons audited:** L01–L15 (15 lessons at `4397def`)  
**Framing:** skeptical-of-rogue-author; T02-template compliance; DAG; schema; rogue-claimed corrections  
**Write-path:** `audit-output/osp-retroactive-audit/T12_POSTAUTH_RT_A_PEDAGOGY.md` ONLY

---

## Structured Findings

| # | Sev | Category | Lesson | Location | Issue | Fix shape |
|---|---|---|---|---|---|---|
| F-1 | **MED** | Cross-curriculum content error | L13 | Lines 106 + 210 | Claims "ITU-T G.652.D maximum (≤ 0.35 dB/km at 1310 nm, ≤ 0.20 dB/km at 1550 nm)." T02.L02 (post-saturation, authoritative) states spec max = ≤0.40 dB/km @ 1310 nm and ≤0.30 dB/km @ 1550 nm; 0.35/0.20 are typical/datasheet values. Using wrong spec maxes causes underestimated budget headroom in planning. | Line 106: change "typically ≤ 0.35 dB/km at 1310 nm and ≤ 0.20 dB/km at 1550 nm" → "spec max ≤ 0.40 dB/km @ 1310 nm and ≤ 0.30 dB/km @ 1550 nm (ITU-T G.652.D); typical measured values ≤ 0.35 and ≤ 0.22 dB/km". Same fix at line 210 — remove "maximum" framing from 0.20 value. |
| F-2 | **LOW** | Schema — missing Flashcard | L03 | key_terms vs rendered deck | `key_terms` has 5 terms (Rayleigh backscatter, pulse width, **dynamic range**, averaging time, EIOR). Flashcard deck renders only 4 cards (`T12-L03-fc-rayleigh`, `fc-pulsewidth`, `fc-averaging`, `fc-eior`). `dynamic range` Flashcard card is missing. Validator WARN at L03 confirms. | Add `T12-L03-fc-dynamicrange` card to the `cards={[...]}` array matching the `dynamic range` key_terms definition. |
| F-3 | **LOW** | DAG — systemic naming mismatch | L01–L15 | 45 BROKEN pointers via `build-dag-registry.js` | All T12 intra-course DAG pointers are BROKEN due to naming convention inconsistency: `vocabulary_introduced` uses long form ("OLTS (Optical Loss Test Set)", "EDZ (Event Dead Zone)", "ADZ (Attenuation Dead Zone)") while downstream `vocabulary_assumed` uses abbreviated form ("OLTS", "EDZ", "ADZ"). The DAG validator cannot match them. Real prerequisites ARE covered — this is a string-mismatch, not a missing-concept issue. | Normalize: either (a) add abbreviated alias entries, or (b) update all `vocabulary_assumed` entries to match the exact long-form string used in `vocabulary_introduced`. Option (b) is safer — touch 14 lessons once. |

---

## Rogue-Claimed Corrections — Verification Results

| Claim | Lesson | Verdict | Evidence |
|---|---|---|---|
| L11 Zone B = 110 µm (2022 ed., was 120 µm) | L11 line 109–113 | **PLAUSIBLE — NOT REGISTRY-VERIFIED** | IEC 61300-3-35 absent from citation registry. L11 content is internally consistent and matches VIAVI/Fluke KB secondary sources. Primary-source (IEC paywall) verification required before accepting as confirmed. FLAG for RT-β. |
| L11 Zones C/D informational only in 2022 | L11 throughout | **PLAUSIBLE — same caveat** | L11 correctly notes pre-2022 editions had mandatory C/D criteria. Consistent with industry adoption of 2022 Ed.3 among VIAVI and Fluke documentation. Same primary-source verification needed. |
| L03 OTDR systematic bias ~0.25 dB whole-link | L01 key_terms + line 222 | **VERIFIED via EXFO AN342 citation in L01 line 292** | L01 cites "EXFO Application Note 342 — quantifies ~0.25 dB whole-link systematic bias." Framing is correct (backscatter-based measurement ≠ direct insertion loss). Value is a "up to ~0.25 dB" range, which is defensible. |
| L12 G.652.D PMD = 0.2 ps/√km | L12 key_terms + table | **CORRECT** | Matches T02.L09 (PMD lesson) and registry G.652.D entry. Math re-derived: PMD_total = 0.2 × √(80) = 1.79 ps ✓; 0.2 × √(120) = 1.97 ps ✓. Sanity check (10/0.2)² = 2500 km ✓. |
| L10 multi-reel IOR variation + EIOR formula | L10 definitions | **CORRECT** | ΔD = (ΔN / N_true) × D = (0.0005/1.4677) × 40000 = 13.6 m ✓. Typical range ±0.0002–0.0005 is field-accurate. |
| L01 dual-wavelength 1310+1550 baseline | L01 key_terms + learning objectives | **CORRECT** | Consistent with T12.L13, NECA/FOA 301, and TIA-568 requirements. All math passes independently. |

---

## Schema / T02-Template Compliance

| Check | Result |
|---|---|
| foundations/working/advanced tiers | PASS — all 15 lessons have all three sections |
| `meta` export with required fields | PASS — all 15 lessons have id, course_id, title, order, prerequisites, learning_objectives, estimated_minutes, vocabulary_introduced, vocabulary_assumed, key_terms |
| `key_terms` named export | PASS (all 15) |
| `<Quiz>` component per lesson | PASS — all 15 have Quiz sections |
| `<Flashcard>` per vocab_introduced term | FAIL L03 — missing dynamic range card (F-2) |
| Vite build | PASS (build clean at current HEAD, `4397def` committed clean) |
| Schema validator | 14 PASS + 1 WARN (L03) |

---

## What I Checked and Confirmed Clean

- All PMD/CD math in L12: independently re-derived, all correct
- Bidirectional averaging formula and all quiz numerics: correct
- TIA-568.3-D channel model formula (0.75 dB/conn + 0.4 dB/km): correct for planning values
- RUS 1753F-401 §5 splice limit 0.30 dB: consistent across L07, L13, L15
- Launch cable minimum lengths by pulse width (L04/L06): correct and internally consistent
- L10 distance error formula: re-derived, correct
- G.652.D PMD coefficient 0.2 ps/√km vs legacy G.652A/C 0.5 ps/√km: correct and consistent with T02
- Dead zone (EDZ/ADZ) definitions and scale with pulse width: correct
- Capstone Q4 bidirectional average (-0.08 + 0.22)/2 = 0.07 dB: correct
- All vocabulary_assumed DAG pointers: logically correct (prerequisites ARE covered); only BROKEN due to naming mismatch (F-3)

## Coverage Gaps (Independent Research)

- **IEC 61300-3-35:2022 Edition 3 primary source**: absent from citation registry. T12.L11 uses the 2022 edition values (Zone B = 110 µm, Zones C/D informational) with plausible secondary-source support, but no primary-source entry in registry. RT-β should do the primary-source lookup or flag for citation registry addition.
- **TIA-526-7A edition**: L01 key_terms includes `[confirm edition]` marker — correct, but means acceptance-test standard reference is soft. Field-accurate but not pinned.
- **EXFO AN342**: referenced in L01 line 292 for 0.25 dB systematic bias claim. Not in citation registry. Low risk (EXFO AN citations are stable public documents) but should be added.

---

## Verdict

**YELLOW**

2 real bugs confirmed: F-1 (MED — G.652.D spec max values wrong in L13, contradicts T02.L02) and F-2 (LOW — missing dynamic range Flashcard in L03). F-3 (LOW — systemic DAG naming mismatch across all 15 lessons) is structural.

All math correct. Template compliance near-complete. IEC 61300-3-35 Zone B = 110 µm is plausible but unregistered — RT-β should primary-source verify before fix-agent treats it as confirmed.

**Saturation hint for RT-β:** Cover (a) IEC 61300-3-35:2022 Zone B primary-source verification, (b) G.652.D 1310 nm spec max confirmation (0.40 vs 0.35 dB/km — T12.L13 line 106 says 0.35 which is TYPICAL, not max), (c) TIA-526-7A citation pinning. Different technical-accuracy framing — don't re-verify the PMD math RT-α already confirmed.

=== T12 POSTAUTH RT-A PEDAGOGY REPORT END ===
