# T01+T02 Post-Patch Verification RT

**Date:** 2026-05-16
**Verifier:** Post-patch RT (strict read-only)
**Patches reviewed:** 5 commits — bd3b32e, 2cae3f2, 669114b (T01); 3915b6a, 6efa1d1 (T02)
**Build state verified:** Vite build clean ✓ (2.72s, 0 errors, chunk warning only — pre-existing)

---

## Verdict (≤80 words)

YELLOW. 9 of 11 patches applied correctly. Two issues found: T02 PATCH 1 (G.657.A1 mandrel) is a PARTIAL fix — the first table row still shows "10 turns, 10 mm radius" (the original error); the patch added a second row with "1 turn, 15 mm radius" but did not correct the first row and the footnote calls "10 turns at 10 mm" a valid condition. Additionally, T01 L07 body text at line 195–196 has a residual "15.5 dB" reference inconsistent with the updated 15–17 dB range.

---

## Per-patch verification (11 rows)

| Patch | SHA | Original finding | Fix applied? | Regression? | Build? | Status |
|---|---|---|---|---|---|---|
| T01 PATCH 1 — L01 FCC Part 32 accounts | bd3b32e | Account numbers wrong (2411/2421/2441 vs correct 2421/2422/2423) | YES — body text updated to 2421/2422/2423; 2411=Poles and 2441=Conduit now clarified | NONE | PASS | GREEN |
| T01 PATCH 1 — L01 BICSI/FOA (same commit) | bd3b32e | BICSI row incorrectly attributed CFOS/CFOT | YES — "RCDD and OSP Designer (CFOS/CFOT are FOA credentials, not BICSI)" now correct | NONE | PASS | GREEN |
| T01 PATCH 2 — L08 BICSI/FOA credentials | 2cae3f2 | BICSI table row listed CFOS, CFOT as BICSI certifications | YES — row now reads "RCDD, OSP Designer, ITS Installer, ITS Technician" + explicit "CFOS and CFOT are FOA credentials" | NONE | PASS | GREEN |
| T01 PATCH 3 — L09 33 CFR vs 36 CFR | 2cae3f2 | CFR flashcard said "36 CFR (Corps of Engineers Section 404)" — wrong title | YES — flashcard and USACE flashcard both updated to "33 CFR Part 323" with note that 36 CFR = NHPA/NPS | NONE | PASS | GREEN |
| T01 PATCH 4 — L09 G.657 2024 edition | 2cae3f2 | G.657 citation locked to 2016 edition without noting 2024 revision | YES — quiz Q3 citation updated to "G.657 (2024 edition; most recently revised November 2024)" | NONE | PASS | GREEN |
| T01 PATCH 5 — L07 splitter loss range | 669114b | "~15.5 dB" understated field values (should be 15–17 dB) | PARTIAL — body and flashcard updated to 15–17 dB range; but line 195–196 body text still says "reach every ONT through 15.5 dB of splitter loss" — stale reference inconsistent with the updated range | FLAGGED: line 195–196 residual | PASS | YELLOW |
| T01 PATCH 7 — L09 NWP 57 2026 reissuance | 669114b | NWP 57 cited as "post-2021 USACE reissuance" (stale, 2026 package now in effect) | YES — acronym table, body text, USACE flashcard, reference table, and quiz citation all updated to "2026 NWP package effective March 15, 2026; core scope unchanged" | NONE | PASS | GREEN |
| T02 PATCH 1 — L04 G.657.A1 mandrel test | 3915b6a | Table showed "10 turns, 10 mm radius" for G.657.A1 — wrong (should be 1 turn) | PARTIAL — patch ADDED a second G.657.A1 row (1 turn, 15 mm radius) but did NOT change the first row from "10 turns, 10 mm radius" to "1 turn, 10 mm radius". The footnote at line 166 calls the "10 turns/10 mm test" a distinct valid condition — but public spec data shows 10 turns at 10 mm appears in NO G.657.A1 source. Original MEDIUM finding is NOT resolved. | REGRESSION: footnote now legitimizes the wrong value | PASS | RED |
| T02 PATCH 4 — L03 limit_40g comment | 3915b6a | Code comment implied 10%-of-bit-period PMD rule applies to CD | YES — comment updated to clarify limit_40g is CD-only budget (~0.7 × bit period); explicit note that 10%-of-bit-period is the PMD rule, not CD | NONE | PASS | GREEN |
| T02 PATCH 2 — L10 dispersion attribution | 6efa1d1 | "17 ± 4 ps/(nm·km)" stated as direct G.652.D clause — wrong attribution and wrong ±spread | YES — prose now correctly states G.652.D specifies via λ₀ + S₀; ~17 ps/(nm·km) described as derived approximation; range given as "approximately 16.7–18.0 ps/(nm·km)"; no quiz used ±4 framing so no quiz update needed | NONE | PASS | GREEN |
| T02 PATCH 3 — L01 MFD range | 6efa1d1 | MFD range "8.6–9.2 µm" too narrow vs. spec 9.2 ± 0.4 µm = 8.8–9.6 µm | YES — prose updated to "8.8–9.6 µm (9.2 ± 0.4 µm per ITU-T G.652.D)"; no MFD flashcard in L01 so no flashcard regression possible | NONE | PASS | GREEN |

---

## Cross-lesson consistency check

### T01 L01 quiz/body/flashcard alignment on FCC Part 32 numbers

Body text at lines 239–253 now correctly shows 2421/2422/2423 for aerial/underground/buried. No quiz in L01 directly tests Part 32 account numbers. No flashcard entry on FCC Part 32 in L01. CONSISTENT.

### T01 L09 all CFR citations consistency

All four citation surfaces verified:
- Acronym table → "33 CFR Part 323 (Corps of Engineers Section 404)" ✓
- USACE flashcard → "33 CFR Part 323" with NHPA/36 CFR distinction note ✓  
- Body text (NWP 57 section) → updated to 2026 package ✓
- Quiz Q1 citation → "2026 NWP package effective March 15, 2026" ✓  
CONSISTENT.

### T01 L08 acronym table — no other miscredits

FOA row unchanged: still correctly lists CFOT, CFOS. BICSI row now correctly lists RCDD, OSP Designer, ITS Installer, ITS Technician. Spot-checked 8 other rows: ITU-T, TIA, IEEE, NFPA, OSHA, ANSI, FCC, NESC — all attributions correct. NO OTHER MISCREDITS FOUND.

### T02 L10 dispersion citations consistency

Body text updated to λ₀/S₀ derivation framing. Quiz Q1 cites "ITU-T G.652.D; ITU-T G.Sup39" — no dispersion range in the quiz body or answer choices. No instance of "17 ± 4" remains in L10. CONSISTENT.

### T02 L04 mandrel test internal consistency

INCONSISTENT — see Findings. The table's first G.657.A1 row ("10 turns, 10 mm") and the footnote's reference to "the tighter 10-turn/10 mm test" conflict with every public source showing the 10 mm radius condition uses 1 turn. The second row added by the patch ("1 turn, 15 mm radius") is the 15 mm condition — correctly valued. But presenting "10 turns, 10 mm" as a valid separate test condition introduces a new misleading claim that did not exist in the prior version.

---

## Findings (severity-ranked)

### RED — T02 PATCH 1 G.657.A1 table PARTIAL fix; footnote introduces new false claim (L04)

**Status:** Patch PARTIAL and regression present.

**What happened:** Commit `3915b6a` added a second G.657.A1 row for "1 turn, 15 mm radius" but LEFT the first row as "10 turns, 10 mm radius" — the original error. The commit message says "Fixed: 1 turn at 10 mm radius (not 10 turns)" but the JSX at line 145 still shows "10 turns, 10 mm radius."

**New regression:** The footnote added at line 165–167 says "The G.657.A1 specification includes two test conditions: the tighter 10-turn/10 mm test is commonly confused with the 1-turn/15 mm condition — they are separate tests at different bend severities." This is wrong — there is NO 10-turn/10 mm test in G.657.A1. The footnote now presents the original error as a legitimate standard test condition and falsely calls it "tighter."

**Required fix:** Change line 145 from "10 turns, 10 mm radius" to "1 turn, 10 mm radius". Update line 165–167 footnote to remove reference to "10-turn/10 mm test" — the correct two conditions are 1 turn @ 10 mm and 10 turns @ 15 mm (or 1 turn @ 15 mm per some sources; `[confirm edition]` appropriate).

**Impact:** A learner or engineer reading this table would conclude that G.657.A1 fiber can withstand 10 wraps at a 10 mm radius — which is NOT what the standard tests. This could lead to under-conservative bend radius application in FTTH drop cable routing.

---

### YELLOW — T01 L07 body text residual "15.5 dB" at line 195–196

**Status:** Partial fix; residual inconsistency.

**Issue:** The patch correctly updated the opening sentence (15–17 dB range) and the flashcard. However the sentence at line 195–196 still reads: "the OLT must launch enough power to reach every ONT through **15.5 dB** of splitter loss plus all the fiber and connector losses along the route." This contradicts the updated range immediately above it in the same paragraph.

**Required fix:** Change "through 15.5 dB of splitter loss" to "through up to 17 dB of splitter loss" (or "through the splitter loss") at line 195–196.

**Severity:** MEDIUM within this patch context — a learner reading this paragraph in sequence will see "15–17 dB" then immediately "15.5 dB" as if 15.5 is the canonical planning value.

---

## Verdict: YELLOW

9 of 11 patches clean and correctly applied. Vite build passes. Two fixes required before T02 can be declared patch-complete: (1) T02 L04 G.657.A1 first row still shows "10 turns, 10 mm" — critical correction needed; (2) T01 L07 line 195–196 stale "15.5 dB" reference — minor consistency fix. The T02 L04 issue is the more urgent: the added footnote actively introduces a new false claim that wasn't in the pre-patch file.

=== T01+T02 POST-PATCH VERIFICATION END ===
