# T06 Fix Wave A Notes

**Agent role:** Fix-agent  
**Write-path allowlist:** `osp-training/src/lessons/T06/L01.*.jsx` through `L12.*.jsx` and this file.  
**Canonical source:** R-1, R-2 (`7df11fa`), R-3 (`6dd1b8d`), Haiku tiebreaker (`51f4482`)  
**Date:** 2026-05-17  

---

## PRIMARY-SOURCE VERIFICATION LOG

### H-1: NESC §34/§35 framework
- **Verification basis:** Haiku tiebreaker `51f4482` + RUS 1751F-635 (secondary corroboration)
- **Per tiebreaker:** §32 = Underground Conduit Systems (supply infrastructure, not comm); §33 = Supply Cable; §34 = Cable in Underground Structures (both supply + comm); §35 = Direct-Buried Cable and Cable in Duct Not Part of a Conduit System (both supply + comm). Rule 354 governs supply-to-comm separation within §35.
- **Original L09 error:** Taught §32 = comm direct-buried, §35 = comm in conduit — both wrong.

### H-4: 47 CFR §32.2210 → §32.2410
- **Source:** citation-registry.md (pre-verified): §32.2210 = "Central office—switching" (not cable/wire). §32.2410 = "Cable and wire facilities" (correct for OSP as-built plant records).
- **Registry SHA:** confirmed present, last verified within 90 days.

### M-1: NEC fill rule (NEC 770.110(B) exemption)
- **Source:** NEC 770.110(B) (Optical Fiber Cables) and NEC 800.110(B) (Communications Circuits) — both exempt communications cables from NEC Chapter 9 Table 1 fill tables.
- **Cascade pattern P8** confirmed: "40% fill rule" attributed to NEC Ch9 Table 1 as mandate is incorrect for comm cable. The 40% is industry convention per BICSI ITSIMM.
- **Applied:** L04 key_term, inline formula box, Book-practice box.

### M-5: Bentonite classification
- **Source:** 40 CFR Parts 261-262 (RCRA hazardous waste definitions); bentonite is an inorganic naturally occurring mineral, exempt from RCRA hazardous waste classification. CWA §404 / NPDES (40 CFR Part 232) governs slurry discharge into waters of the US.
- **Original error:** L07 said "Bentonite is classified as a controlled waste in most jurisdictions" — wrong. Bentonite is non-hazardous RCRA-exempt; the regulatory concern is CWA §404/NPDES for discharge.

### M-6: H-20 AASHTO HS-20 definition
- **Source:** AASHTO Standard Specifications for Highway Bridges (17th ed.) — H-20 designates the HS-20 truck with 20-ton gross vehicle weight (GVW). Rear axle = 32,000 lb (16 tons). Front axle = 8,000 lb.
- **L05 error:** "20-ton axle" — wrong. Should be "20-ton GVW / 32,000 lb rear axle."
- **L08 error:** "10-ton axle load" — wrong. Same correction applied.

### M-7: NWP 57 for telecom HDD
- **Source:** citation-registry.md (pre-verified): FR 2021-27441 (86 FR 2744) split NWP 12; telecom fiber HDD across waters/wetlands now uses NWP 57.
- **Applied:** L07 frac-out section, branching scenario outcome.

### M-3: CGA v20.0 (2024)
- **Source:** known-cascade-patterns.md P12: CGA Best Practices updated to v20.0 (2024). v19 references are stale.
- **Applied:** L06 key_term, L06 quiz Q1 rationale, L06 field-practice box, L07 header comment, L07 multiple inline references (replace_all applied).

---

## CANONICAL ITEMS APPLIED

| # | Status | File | Change |
|---|--------|------|--------|
| H-1 | ✅ DONE | L09 | Full rewrite of NESC framework: §34/§35 location-based, Rule 354; removed §32 from vocab_introduced, added §34 + Rule 354; updated 6 quiz questions; updated flashcards; updated Working section |
| H-2 | ✅ DONE | L01 | Moved `soil type` from vocabulary_assumed to vocabulary_introduced; added prose definition in Working section; added Flashcard render |
| H-3 | ✅ DONE | L01 | Moved `route alignment` from vocabulary_assumed to vocabulary_introduced; added prose definition in Working section; added Flashcard render |
| H-4 | ✅ DONE | L09 | `47 CFR §32.2210` → `47 CFR §32.2410` in as-built documentation paragraph |
| M-1 | ✅ DONE | L04 | Reframed 40% fill: key_term definition cites NEC 770.110(B) exemption; inline formula box removes "NEC Chapter 9 Table 1 mandates 40%"; Book-practice box correctly distinguishes electrical vs comm cable fill rules |
| M-2 | ✅ DONE | L06 | `NESC §35` → `NESC §35 Rule 354` throughout (key_term, annotated diagram, separation table, book-practice box, worked-example, Q4 rationale) |
| M-3 | ✅ DONE | L06, L07, L12 | `CGA Best Practices v19` → `v20.0` — replace_all applied to L06 + L07; L12 Q16 explanation updated |
| M-4 | ✅ DONE | L01 | `conduit` vocabulary_assumed pointer: `T04.L01` → `T01.L02` |
| M-5 | ✅ DONE | L07 | Bentonite "controlled waste" reframed: non-hazardous RCRA-exempt clay; CWA §404/NPDES regulatory anchor added |
| M-6 | ✅ DONE | L05, L08 | H-20 definition corrected: "20-ton axle" (L05) and "10-ton axle load" (L08) → AASHTO HS-20, 20-ton GVW, 32,000 lb rear axle; quiz rationales corrected in both files |
| M-7 | ✅ DONE | L07 | NWP 12 → NWP 57 for telecom HDD crossings; 86 FR 2744 split cited; frac-out section + branching scenario outcome updated |
| M-8 | ✅ DONE | L06 | 811 ticket lifecycle paragraph added: notice window, validity periods (typically 10–15 working days), pre-marking, tolerance zone, ticket renewal requirements |
| L-1 | ✅ DONE | L06 | DIRT figure "2024 DIRT Report / 196,977" — added "verify at publication for most recent report year" qualifier |
| L-2 | ✅ DONE | L04 | Fill% rounding: 19.2% → 19.25% in Step 4 formula, Step 5 content, and sanityCheck |
| L-3 | ✅ DONE | L06 | Agricultural tile drains added to 811 "what it does NOT cover" bullet list |

### Cascade effects fixed (not in original canonical but required by H-1):
- **L12 Q15** was teaching "NESC §32 applies to direct-buried comm cable" — WRONG per H-1. Fixed: NESC §35 Rule 354 applies to direct-buried comm cable. Answer index unchanged (correct answer was B, remains B but the option text now reads "NESC §35 Rule 354").
- **L12 vocabulary_assumed** updated: `NESC §32` → `NESC §34` + `NESC Rule 354` (since §32 was removed from L09's vocab_introduced and replaced with §34 + Rule 354).
- **L12 branching scenario** + **Q16 explanation**: "NESC §35 minimum" → "NESC §35 Rule 354 minimum" throughout.

---

## VALIDATION RESULTS

- `node scripts/validate-lesson-schema.js T06`: **12/12 PASS, 0 FAIL, 0 WARN**
- `node scripts/build-dag-registry.js`: rebuilt; T06 broken pointers are pre-existing (conduit→T06.L03 cross-lesson pointers exist before this fix wave; no new breakage introduced by this wave except NESC §32 removed from L09 vocab_introduced — fixed by L12 vocabulary_assumed update)
- `npm run build`: **✓ built in 5.68s — zero errors**

---

## NEIGHBORHOOD SCAN (±20-line check per canonical item)

- **L04 around 40% fill**: No adjacent text still incorrectly attributes 40% to NEC Ch9 Table 1 as mandate. Checked lines 420–460.
- **L05 H-20 area**: H-25 definition at line 65 correctly says "25% heavier than HS-20" (no axle tonnage claimed) — clean.
- **L06 around CGA**: APWA table footer at line 309 references "CGA Marking Standards Manual v10" — this is a DIFFERENT CGA document (APWA standards, not Best Practices), correct to leave v10 as that document's version.
- **L07 bentonite key_term** at line 45: still says "Slurry that returns to the surface must be managed as waste — it cannot be left in ditches or waterways" — this is accurate and appropriate, not a RCRA "waste" claim.
- **L09 around §32.2410**: Only one occurrence of CFR Part 32 citation in L09 — the as-built paragraph. No other Part 32 references in neighboring lines.

=== T06 FIX WAVE A REPORT END ===
