# OSP Topic 2 Batch B — Fix Report

**Agent:** Fix Agent (T2B)
**Date:** 2026-05-14
**Branch:** `claude/debug-previous-issues-MoN9D`
**Canonical source:** `audit-output/wave-osp-topic2/BATCH_B_CANONICAL.md`
**Scope:** `content/osp-splice-termination/05-mechanical-splicing.md` through `08-termination-methods.md`

---

## Commit Summary

| Commit | SHA | Tier | Items |
|---|---|---|---|
| 1 | `b7d0410` | CRITICAL | B5, B7 (fold-in) |
| 2 | `f105c19` | HIGH | A-B2/B14, A-B1, B10, B2, B11 |
| 3 | `15ecd13` | MED | A-B3, B6, B1, B4, B15, A-B4, B3, B8, B9, B12, B13, B16, B17 |
| 4 | `d047ffb` | LOW | B18 |

---

## Per-Canonical Status

| # | ID | Severity | Status | Fix summary |
|---|---|---|---|---|
| 1 | B5 | CRITICAL | ADDRESSED | Added "Dome Closure Re-Entry Procedure" subsection to 06-splice-closures.md: 7 ordered steps (lockout/tagout → cable tension relief → gasket inspection → port re-sealing confirmation → tray work → re-test seal → post-re-entry OTDR verification). Cites IEC 61753-1 + BICSI OSP-DRD Ch. 8. |
| 2 | A-B2/B14 | HIGH | ADDRESSED | Performance table L171 APC column: updated `≥ 45 dB` → `≥ 55 dB`. Table-only fix; scenario L227, Q3 rationale L278, and Pulse 3 L329 already correct at ≥55 dB. |
| 3 | A-B1 | HIGH | ADDRESSED | L45 body text: replaced "0.3–0.4 dB of Fresnel return loss per interface" with ~0.3 dB insertion loss from two-interface gap; explained ORL (~14.6 dB at bare glass-air) as a separate quantity. Q2-C rationale updated to match corrected physics. |
| 4 | B10 | HIGH | ADDRESSED | Gel removal step 2: changed "gel removal solvent or IPA" to "IPA only"; added explicit acetone prohibition with acrylate coating damage explanation. Updated Q5-C rationale and buffer-tube gel Key Term with same warning. |
| 5 | B7 | HIGH | ADDRESSED (fold-in) | Pressurized closure CAUTION block integrated as pre-step warning in re-entry procedure subsection (commit 1). Body text in dome closures section does not require a separate callout — the canonical explicitly permitted this fold-in approach. |
| 6 | B2 | HIGH | ADDRESSED | Added field note after temperature range statement in L2.5: aerial closures in direct sun reach +80–85°C, exceeding +70°C gel-rated limit. Reinforces temporary classification for aerial mechanical splices. |
| 7 | B11 | HIGH | ADDRESSED | Added governing-rule clause to buffer tube bend radius bullet: when tube and fiber MBR conflict, fiber's 30 mm minimum governs; 10× tube OD does not protect fibers inside the tube. |
| 8 | A-B3 | MED | ADDRESSED | Fixed IEC 60068-2-14 water-pressure citation at L2.6 L80: replaced with IEC 60529 §14.2.9; clarified IEC 60068-2-14 is thermal, not water-pressure. Updated glossary cross-reference. |
| 9 | B6 | MED | ADDRESSED | Added 3-condition port seal installation check paragraph after IP68 section: full gel compression, no kink at port entry, blank plugs torqued to manufacturer spec (typically 2–4 N·m). |
| 10 | B1 | MED | ADDRESSED | Added re-enterable splice note to clamping mechanism paragraph (AFL FAST Connector, select CamSplice variants). Updated Cam-action clamp Key Term to match. |
| 11 | B4 | MED | ADDRESSED | Scoped Q4-A rationale to "current-generation designs from major vendors (3M Fibrlok II, Corning CamSplice)"; noted other designs may differ while confirming gel migration is the primary documented failure mode. |
| 12 | B15 | MED | ADDRESSED | Added legacy green color-code caution after UPC/APC incompatibility paragraph: green used on legacy multimode SC by some vendors; verify by adapter keyway or inspection scope, not color alone. |
| 13 | A-B4 | MED | ADDRESSED | Updated Q1-C rationale: explicitly anchored feasibility to two-technician deployment (3.2–4.8 hrs within 6-hr window); stated one technician alone (6.4–9.6 hrs) would exceed the window. |
| 14 | B3 | MED | ADDRESSED | Added AFL FAST Connector and Molex LightCrimp Plus to typical device list at L41 intro paragraph. |
| 15 | B8 | MED | ADDRESSED | Added ADSS/OPGW aerial closure note under UV resistance section: distribution-grade HDPE/PC materials not suitable for ADSS/OPGW mid-span; FRP/armored designs required per cable manufacturer spec. |
| 16 | B9 | MED | ADDRESSED | Added fiber slack storage as mandatory closure sizing parameter: 1.0–1.5 m per cable at ≥30 mm bend radius; distinguishes from tray-count/port-count sizing which is already covered. |
| 17 | B12 | MED | ADDRESSED | Added "Fiber Mapping Documentation" subsection with minimum closure manifest contents: closure ID, cable identities, tube-to-tray map, express fiber IDs, splice date/crew, re-entry log, record location. |
| 18 | B13 | MED | ADDRESSED | Updated ribbon MBR table entry: footnoted 37.5 mm as Corning-specific; added note that other manufacturers specify 40–50 mm; instruction to verify tray-manufacturer spec. |
| 19 | B16 | MED | ADDRESSED | Added mandatory pre-use temperature verification paragraph to hot-melt procedure: verify oven at operating temp before first connector each day; covers oven drift in cold/hot field conditions. |
| 20 | B17 | MED | ADDRESSED | Added CommScope OptiSplice and AFL CamLite to cleave-and-crimp product list; added note to follow product-specific installation guides. |
| 21 | B18 | LOW | ADDRESSED | Added IEC 61300-3-35 fail criteria and remediation: Zone A (≤25 µm) scratch = reject; cleaning does not fix scratches; re-polish or replace required. |

---

## Deferrals

None. All 21 canonical items addressed.

---

## Adjacent Observations (not committed — outside canonical scope)

1. **L2.5 Key Term "Mechanical splice" (L104–105):** Uses "v-groove or capillary structure" — capillary is accurate but "ferrule" appears in some product literature. No change made; "capillary" is technically correct for the index-matching gel channel.

2. **L2.6 ground bonding sequence for metallic-element aerial closures:** Noted in canonical adjacent observations (not in canonical list). Not addressed — deferred to future batch per canonical instructions.

3. **L2.7 Pulse 2 expected answer (L290):** Still references IPA broadly without the acetone prohibition. The gel removal procedure step 2 and Key Term were updated (B10 fix), but Pulse 2's expected answer could be tightened to explicitly say "IPA only." This is a polish item not in the canonical list — not committed.

=== BATCH B FIX REPORT END ===
