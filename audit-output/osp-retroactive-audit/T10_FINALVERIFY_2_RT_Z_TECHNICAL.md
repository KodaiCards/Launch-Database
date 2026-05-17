# T10 Final-Verify-2 RT-ζ — Technical / Cascade Framing
**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T10_FINALVERIFY_2_RT_Z_TECHNICAL.md` written.**

**HEAD verified:** `5383b81` (Polish-B: H-20 GVW + 1910.146(b) + 1926.651 fixes)
**Pair-mate:** RT-ε `fba2129` GREEN (pedagogy — verified fixes sound, 0 new findings)
**Framing:** technical accuracy / cascade-pattern sweep / internal consistency
**Validator:** 12/12 PASS | Vite build: n/a (read-only RT)
**Token cap:** 80K

---

## 1. Cascade Pattern Step-1 (§14e, §11)

- **P1 §32.2210:** Not present in T10. ✓
- **P2 H₂S IDLH:** T10 no H₂S content. ✓
- **P3 ANSI Z359:** T10 no fall-arrest content. ✓
- **P4 Fabricated numeric:** Polish-B applied H-20 GVW correction. SEE FINDING T10-Z1 below — replacement introduced new internal inconsistency.
- **P7 NESC §-vs-Rule:** T10 has no NESC references. ✓
- **P8 NEC fill:** RT-β confirmed clean prior wave. ✓
- **P9 §1.141x:** Not present in T10. ✓
- **P11 NWP 57:** T10 no HDD/wetland content. ✓

---

## 2. Polish-B Fix Verification (Technical)

### D1 — H-20 GVW correction

**Body (line 252):** "16,000 lb per rear-tandem axle (8,000 lb steer + 32,000 lb rear tandem = 40,000 lb GVW)" ✓ Arithmetic correct. GVW 40,000 lb correct for AASHTO HS-20.

**Flashcard traffic-loading (line 156):** "H-20 (HS-20): 16,000 lb per rear-tandem axle; 40,000 lb GVW (8,000 lb steer + 32,000 lb rear tandem)" — arithmetic correct.

**HOWEVER — internal inconsistency introduced by Polish-B (see §3 Finding T10-Z1 below).**

### D2 — OSHA 1910.146(b) 3-criterion definition

Line 124-129 (foundations note): correctly states three criteria + shallow-handhole carveout + "apply the test." ✓
Line 322-326 (advanced tier): correctly states three criteria + permit-required consequences. ✓
Both locations consistent with each other. Overclaim removed. ✓

### D3 — OSHA 1926.651 below-5ft duties

Line 209-214: "5 feet or deeper → protective system mandatory. Below that threshold, not required by Subpart P — but §1926.651 still requires competent-person inspection daily + water management." ✓
"Anything goes" misconception explicitly corrected. ✓

---

## 3. New Technical Finding

### T10-Z1 — Polish-B introduced Flashcard/vocab inconsistency on H-25 "axle" terminology (LOW)

Polish-B corrected line 156 Flashcard to "16,000 lb per rear-tandem axle" for H-20 and "20,000 lb per rear-tandem axle" for H-25. Three other locations in the same file were NOT updated and now disagree:

| Location | H-20 description | H-25 description |
|---|---|---|
| vocab_introduced (line 51) | "16,000 lb single axle load" | "20,000 lb single axle load" |
| Flashcard frame-cover (line 151) | "16,000 lb" (abbreviated) | "20,000 lb single axle load" |
| body text (line 253) | "16,000 lb per rear-tandem axle" ✓ | "20,000 lb per single axle" |
| Flashcard traffic-loading (line 156) ← Polish-B | "16,000 lb per rear-tandem axle" ✓ | "20,000 lb per rear-tandem axle" |

**The inconsistency:** line 156 says H-25 = "20,000 lb per rear-tandem axle" but line 51, line 151, and line 253 all say H-25 = "20,000 lb single axle" or "20,000 lb per single axle." A learner who reads the vocab_introduced definition and then tests themselves on the Flashcard gets conflicting answers for the same term.

**Severity: LOW.** The operational lesson (H-20 for private / H-25 for public) is correct throughout. The per-axle vs per-tandem-axle wording is a precision inconsistency introduced by Polish-B updating line 156 without propagating the same language to lines 51 and 253. Note: the H-25 body text (line 253) was NOT changed by Polish-B ("20,000 lb per single axle") and is now inconsistent with Polish-B's Flashcard ("20,000 lb per rear-tandem axle").

**Verified by reading:**
- `L07-manhole-and-handhole-installation.jsx:51` — vocab_introduced definition
- `L07-manhole-and-handhole-installation.jsx:151` — frame-cover Flashcard
- `L07-manhole-and-handhole-installation.jsx:156` — traffic-loading Flashcard (Polish-B target)
- `L07-manhole-and-handhole-installation.jsx:253` — body list item

**Fix shape:** harmonize all four locations to the same phrasing. Options: (a) adopt "per rear-tandem axle" everywhere (consistent with HS-20 classification that Polish-B chose) or (b) revert line 156 to "per single axle" (consistent with lines 51/151/253 and the H-20/H-25 frame-cover test-load convention). Either is defensible; pick one and apply uniformly to all four locations.

---

## 4. Negative Findings (Confirmed Clean)

- L03 Polish-B D3 text: "Under 5 feet" duties applied correctly, §1926.651 citation present. ✓
- L07 Polish-B D1 GVW math (8,000 + 32,000 = 40,000 lb): arithmetic correct. ✓
- L07 Polish-B D2 1910.146(b) three-criterion: both locations updated, consistent. ✓
- L07 confined-space atmospheric risks (methane, H₂S, O₂ deficiency, flooding): technically correct. ✓
- L03 soil-type slope ratios (Type A 3/4:1, Type C 1.5:1): correct per 1926 Subpart P App B. ✓
- Schema validator: 12/12 PASS — no regressions. ✓
- No P1–P12 cascade patterns triggered. ✓
- RT-ε (pedagogy) confirmed all three Polish-B fixes pedagogically sound. No need to re-verify. ✓

---

## 5. Coverage Gaps

- L09 traffic control TCP body not re-sampled (RT-β + validator prior, no flags)
- L05 conduit pull tension math not re-derived (covered by RT-B prior wave)

---

## 6. Verdict

**YELLOW** — 1 new LOW (T10-Z1: internal H-25 "axle" terminology inconsistency across lines 51/151/156/253 introduced by Polish-B updating only one of four locations).

**SATURATION VERDICT: T10 NOT YET CLOSEABLE.** RT-ε (pedagogy) returned GREEN. RT-ζ (technical) found 1 LOW internal inconsistency. Requires a single surgical patch at lines 51, 151, and 253 to harmonize H-25 axle terminology with Polish-B's line 156 update, then one final-verify pass.

=== T10 FINALVERIFY 2 RT-Z TECHNICAL REPORT END ===
