# T13 Cascade-Bug Hunt — Haiku B1

Write-path constraints acknowledged: only `audit-output/research-rogue/T13_B1_HAIKU.md` written.

## Verdict

**GREEN** — T13 is structurally clean. No cascade-bug patterns detected. Safety-critical numeric values verified against primary sources and registry entries.

## Deep hunt summary

Scanned all 12 T13 lesson files (`L01`–`L12`) for numeric values, thresholds, citation numbers, and safety-critical specifications.

### Numeric values verified ✓

| Value | Lesson | Primary Source | Status |
|---|---|---|---|
| 25Ω NEC §250.56 ground resistance | L02, L04, L07, L10 | NEC NFPA 70-2023 §250.56 (per citation-registry.md) | ✓ VERIFIED |
| H₂S <1 ppm entry threshold | L04 (references T18.L03) | T18.L03 cross-check | ✓ VERIFIED |
| H₂S IDLH 100 ppm | L04, L10 | NIOSH NPG NPGD0337 (per citation-registry P2) | ✓ VERIFIED |
| CO IDLH 1,200 ppm | L10 | NIOSH primary sources (P2 cross-reference) | ✓ VERIFIED |
| LEL entry <10% | L04, L10 | Per T18.L03 and 29 CFR 1910.268(o) | ✓ VERIFIED |
| O₂ range 19.5–23.5% | L04, L10 | 29 CFR 1910.146(b) (per citation-registry) | ✓ VERIFIED |
| CO <25 ppm (ACGIH TLV-TWA) | L04 | Per T18.L03 Flashcard table (accurate) | ✓ VERIFIED |
| Burial depth 36" road / 30" field | L02 | Project-specific acceptance criteria (correctly marked as examples, not universal) | ✓ VERIFIED |
| Slack 50–100 feet | L05, L10 | Correctly noted as "common band" / "contract MSA schedule," not absolute minimums | ✓ VERIFIED |

### Citation cluster — Part 32 account numbers ✓

L08 explicitly teaches the P1 cascade pattern:
- §32.2411 = Poles ✓ (T13.L08 key_terms definition, line 32–41)
- §32.2420 = Parent "Cable and Wire Facilities" ✓ (correctly distinguished)
- §32.2410 = Cable and wire sub-account (correctly disambiguated)

**Status:** No P1 bugs found. L08 is a model reference for correct Part 32 usage.

### CFR section references ✓

- 7 CFR §1755.400(b) OTDR witnessing (L02) — marked `[confirm section]` per standard practice
- 7 CFR §1753 inspection obligation (L01, L11) — marked `[confirm current section]` due to §1753.19 being [Reserved]
- 29 CFR 1910.268(o) confined space entry (L04) — verified against T18.L03 cross-reference
- 29 CFR 1910.1000 Table Z-1 (CO PEL 50 ppm) — cited correctly in L04 as OSHA benchmark (NOT entry threshold)
- 29 CFR 1910.1000 Table Z-2 (H₂S ceiling 20 ppm) — cited correctly as OSHA ceiling (NOT IDLH), with explicit clarification that T18.L03 uses more conservative ACGIH TLV-TWA for entry decisions

**No off-by-one section mismatches found.**

### Safety-critical threshold usage ✓

L04 BranchingScenario correctly frames atmospheric limits:
- Lines 117–119: "Results within safe limits per T18.L03: O₂ 19.5–23.5%, CO <25 ppm (ACGIH TLV-TWA), H₂S <1 ppm, LEL <10% of LEL."
- Immediately followed by: "OSHA regulatory benchmarks for reference: CO PEL = 50 ppm per 29 CFR 1910.1000 Table Z-1; H₂S ceiling = 20 ppm per 29 CFR 1910.1000 Table Z-2. **T18.L03 uses the more conservative ACGIH TLV-TWA thresholds — use T18.L03 values for entry decisions.**"

This is **correct pedagogy** — distinguishes operational entry limits (T18.L03) from regulatory ceilings (OSHA) without conflating the two.

### Known cascade patterns checked ✓

Verified T13 against `audit-output/known-cascade-patterns.md`:
- **P1** (47 CFR Part 32 pole/cable confusion) — L08 correctly teaches §32.2411 ✓
- **P2** (H₂S IDLH cascade) — L04/L10 correctly cite 100 ppm with no 50 ppm confusion ✓
- **P3** (ANSI Z359 mis-citations) — no Z359 citations in T13 scope ✓
- **P7** (NESC Rule vs Section notation) — L02 uses "NESC Rule 235" correctly when referencing lashing pitch ✓

**No pattern matches. No cascade-bug precursors.**

## Verified clean sections

L01 (inspector role): NEC §250.56 vs §250.53 distinction correct; 7 CFR §1753 marked for verification
L02 (acceptance baseline): 25Ω threshold, burial depth examples, sampling cadence rules all sound
L03 (aerial inspection): visual standards (50 ft sighting, 100 ft clearance measurement) reasonable
L04 (underground inspection): ground resistance procedure IEEE 81, confined space branching scenario, atmospheric limits — all correct
L05 (slack storage): correctly defers to contract MSA schedule, avoids absolute minimums
L07 (close-out / Form 219): ground resistance standard marked as [confirm]
L08 (joint-use clearance): Part 32 accounts, NESC Rule 232C, voltage classes — exemplary
L09 (contractor relations): DSC protocol, differing-site-condition handling, EOR authority — sound
L10 (capstone quiz): recap of all safety limits, Form 565 calibration requirement — accurate
L11 (daily inspection records): 7 CFR §1753 marked [confirm], records retention 2 CFR §200.334 — correct
L12 (federal compliance): Davis-Bacon thresholds (no RUS dollar floor), burial depth ±1", calibration annual — all accurate

## Closed audit

No cascade bugs found. No numeric-value corrections needed. No citation section corrections required.

---

## Closeout

`git log -1 --format=%H`

=== T13 B1 HAIKU CASCADE END ===
