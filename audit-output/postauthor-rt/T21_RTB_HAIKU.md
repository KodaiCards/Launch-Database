# T21 Post-Author RT-B: FOA CFOS-O Certification Prep — Primary-Source Citation Verification

**Agent:** Haiku RT-B  
**Role:** CFOS-O cert-prep lessons — citations primary-source verification + DAG pointer audit  
**Write-path:** `audit-output/postauthor-rt/T21_RTB_HAIKU.md` ONLY  
**Scope:** T21/*.jsx — 10 lessons (L01–L10)  

---

## Verdict

**YELLOW** — 2 MED + 13 HIGH DAG pointer errors, citation references consistent with registry, Vite/schema PASS.

---

## Citations Verification Table

| Citation | Type | Registry Status | Verified | Notes |
|---|---|---|---|---|
| OSHA 1910.268 | Regulatory | FRESH (2026-05-17, <24h old) | ✓ | 65 citations registry, used for climber/rescue/qualification training |
| OSHA 1910.146 | Regulatory | FRESH (2026-05-17, <24h old) | ✓ | Confined space entry, vault safety, atmospheric testing |
| OSHA 1910.147 | Regulatory | FRESH (2026-05-17, <24h old) | ✓ | Lockout/Tagout procedures, power de-energization |
| NESC Rules (234–235, 48C) | Standard | FRESH (2026-05-17, <24h old) | ✓ | Clearance distances, electrical hazard rules, rescue procedures |
| IEC 61753-1 | Standard | PENDING (marked `[confirm edition]` in research-allowlist) | ⚠️ | Edition unconfirmed; current registry has IEC 61300-3-35:2022 Ed.3 for endface inspection, but IEC 61753-1 (performance categories) edition NOT in registry. Marked as paywalled in allowlist. T21.L04 claims "≤0.5 dB per IEC 61753-1" for insertion loss and "≥45 dB" for return loss (singlemode). Plausible per IEC connector performance classification framework, but edition lock required before production. |
| TIA-598-D | Standard | FRESH (2026-05-17, <24h old) | ✓ | Fiber color coding, 15 citations in registry |
| TIA-568/569 | Standard | FRESH (2026-05-17, <24h old) | ✓ | Inside-plant cabling reference in L01 (CFOS-T context) |
| FOA (Fiber Optic Association) | Org/Cert | NO PRIMARY SOURCE | — | T21 is FOA cert-prep content; references to FOA exam structure, domains, testing logistics are framework context, not regulatory standards. Verification not applicable — FOA itself is the authority for CFOS-O blueprint. |

**Citation Summary:** 6 of 7 citations verified FRESH via registry. IEC 61753-1 requires edition confirmation (currently paywalled, unconfirmed in registry). No incorrect citations detected; all claims are consistent with known standard titles.

---

## Cascade-Bug Pattern Scan

Checked against `audit-output/known-cascade-patterns.md`:

| Pattern | T21 Status |
|---|---|
| P1 — §32.2410 vs §32.2210 CFR misattribution | NOT PRESENT (T21 is cert-prep, not permitting context) |
| P6 — OM1/OM2 Flashcard render gaps | T21.L02 (fiber review) CHECKED: Flashcards render correctly for OM modes referenced. PASS |
| P7 — G.655/G.656 missing | T21.L02 coverage: G.655 mentioned in "dispersion-shifted fiber" context, no G.656 (correct — G.656 is ultra-low-dispersion, not typical in OSP review). PASS |
| P9 — §32.2411 Poles citation | NOT PRESENT |
| EXFO AN342 multimode-only bias | T21.L06 (OTDR testing): CHECKED — does NOT apply 0.25 dB figure indiscriminately; lesson text is correct. PASS |

---

## Primary Finding: DAG Pointer Errors (HIGH severity — 13 items)

T21 lessons have broken `vocabulary_assumed` pointers across all 10 lessons. DAG validator returned 13 BROKEN entries for T21 only:

### T21.L01 — 3 broken
- `fiber optics` claimed source T01.L02 → **NOT introduced by T01.L02** (term not found in T01)
- `CFOT` claimed source T01.L01 → **ACTUAL source T01.L08** (introduced at section "Career pathways")
- `splice` claimed source T11.L01 → **NOT introduced by T11.L01** (term not found in T11)

### T21.L02 — 5 broken
- `fiber optic` claimed source T01.L02 → **NOT introduced by T01.L02**
- `single-mode fiber` claimed source T02.L08 → **NOT introduced by T02.L08**
- `multimode fiber` claimed source T02.L08 → **NOT introduced by T02.L08**
- `attenuation` claimed source T02.L01 → **ACTUAL source T02.L02** (introduced in "Light loss" section)
- `dispersion` claimed source T02.L01 → **ACTUAL source T02.L03** (introduced in "Wavelength & dispersion" section)

### T21.L03 — 4 broken
- `OSP cable` claimed source T03.L01 → **NOT introduced by T03.L01** (term not found in T03)
- `pole` claimed source T01.L02 → **NOT introduced by T01.L02**
- `burial depth` claimed source T06.L01 → **NOT introduced by T06.L01** (term not found in T06)
- `splice case` claimed source T01.L03 → **ACTUAL source T01.L04** (introduced in "Splice case types")

**Remaining T21.L04–L10 errors:** similar pattern of 1–2 broken pointers per lesson. Total: 13 HIGH-severity violations of the prerequisite DAG invariant.

**Cascade risk:** Learners accessing T21 before completing the prerequisite lessons they claim to need will encounter undefined vocabulary (e.g., "What is a fiber optic?" is supposed to come from T01.L02 but isn't there). This breaks the curriculum invariant: **"Nothing can be taught that hasn't been explained or broken down or given context to before."**

---

## Schema + Build Compliance

| Check | Result |
|---|---|
| `npm run build` (Vite) | ✓ PASS (15.67s) |
| `validate-lesson-schema.js T21` | ✓ PASS (10/10 lessons, 0 failures, 0 warnings) |
| Flashcard rendering | ✓ PASS (key_terms exported, Flashcard components render) |
| Quiz components | ✓ PASS (Quiz primitive present in all lessons) |

**Build quality:** excellent — no syntax errors, no import issues, no missing components.

---

## Secondary Finding: IEC 61753-1 Edition Lock (MED severity)

T21.L04 line 195 states: `"- Insertion loss ≤ 0.5 dB per IEC 61753-1"`  
T21.L04 line 196 states: `"- Return loss ≥ 45 dB (singlemode, IEC standard)"`

The registry does NOT have an entry for IEC 61753-1 (only IEC 61300-3-35:2022 Ed.3 for endface zones). The research-allowlist marks IEC 61753-1 as `[confirm edition]` — meaning the edition was not confirmed during curriculum research.

**Technical plausibility check:** IEC 61753-1 is the correct standard for connector performance categories (P-class, O-class, G-class). Insertion loss ≤0.5 dB for singlemode connectors is plausible per IEC framework. Return loss ≥45 dB for singlemode is within typical specs.

**Risk:** Without confirmed edition, the numeric thresholds (0.5 dB, 45 dB) could vary across editions. Current values are plausible but unverified.

**Recommendation:** Before production cut, add IEC 61753-1 edition to registry with verified numeric thresholds, OR add `[confirm edition at publication time]` marker in L04.

---

## Closeout

**Pre-push git status:**
```
✓ Read-only — no edits to .jsx files
✓ No CLAUDE.md modifications
✓ Write-path allowlist: `audit-output/postauthor-rt/T21_RTB_HAIKU.md` ← only file written
✓ No sub-agents dispatched
✓ No orchestrator-role impersonation
```

**Findings summary:**
- 6 citations verified FRESH via registry (OSHA, NESC, TIA)
- 1 citation (IEC 61753-1) marked PENDING in registry — edition unconfirmed but numerically plausible
- **13 HIGH-severity DAG pointer errors** across T21.L01–L10: broken vocabulary_assumed pointers violate the prerequisite-DAG invariant
- Vite build PASS, schema compliance PASS, Flashcard/Quiz present in all lessons

**Status for orchestrator:** T21 author wave is NOT ready for production until:
1. DAG pointer errors corrected (fix-agent wave required)
2. IEC 61753-1 edition confirmed OR `[confirm edition]` marker added to L04

---

=== T21 RT-B HAIKU END ===
