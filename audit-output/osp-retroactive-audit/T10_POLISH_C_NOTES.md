# T10 Polish-C Notes — L07 Axle Load Harmonization

**Wave:** T10 Polish-C  
**Trigger:** RT-ζ `937878b` flagged lines 51/151/253 inconsistent with line 156  
**Commit:** `d173b54`

## Changes Applied

File: `osp-training/src/lessons/T10/L07-manhole-and-handhole-installation.jsx`

| Location | Before | After |
|---|---|---|
| L51 (vocab_introduced definition) | "20,000 lb single axle load" | "20,000 lb per rear-tandem axle" |
| L151 (Flashcard frame-cover back) | "20,000 lb single axle load" | "20,000 lb per rear-tandem axle" |
| L253 (body text H-25 bullet) | "20,000 lb per single axle" | "20,000 lb per rear-tandem axle" |
| L309 (quiz rationale — neighborhood scan catch) | "16,000 lb single axle" + "H-25 (20,000 lb)" | "16,000 lb per rear-tandem axle" + "H-25 (20,000 lb per rear-tandem axle)" |

Note: line 309 was NOT in the original RT-ζ scope but was caught during neighborhood scan. Applied in same commit.

## Technical Basis

AASHTO HS-25 (equivalent to H-25): GVW = 50,000 lb; steer axle = 10,000 lb; rear tandem = 40,000 lb; per-rear-tandem-axle design load = 20,000 lb. The "single axle" phrasing was incorrect — AASHTO H/HS classifications are defined by rear-tandem-axle load, not total single-axle load.

## Neighborhood Scan Result

All H-20/H-25/axle references in L07 now consistent. No other inconsistencies found.

## Build Status

Vite build: ✓ clean (6.20s, 131 modules)  
T10 lesson count: 12/12 ✓

=== T10 POLISH-C NOTES END ===
