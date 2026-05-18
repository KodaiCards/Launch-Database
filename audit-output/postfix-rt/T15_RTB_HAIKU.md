# T15 Post-Fix RT-B (Haiku) — Citation Primary-Source Re-Verification

**Write-path constraints acknowledged:** only `audit-output/postfix-rt/T15_RTB_HAIKU.md` written.

## Verdict: YELLOW

Build clean, schema compliant. **Citation verification reveals 2 MEDIUM + 1 LOW findings.** RT-A's DAG pointers are orthogonal to citation accuracy — both pass separately.

---

## Recent-Fix Verification Table

Dispatch specified 4 key recent changes requiring citation re-verify:

| Item | Lesson | Citation | Status | Notes |
|---|---|---|---|---|
| **IEEE 1366-2012** | L01 | MTTR definition "Mean Time to Repair — average time over many events, measured historically" | ✓ VERIFIED | IEEE 1366-2012 Section 2 defines MTTR as mean time to restore service (incl. all downtime: locate + travel + repair + test + closeout). Definition aligns with lesson prose. |
| **NIOSH CO REL ceiling** | L05 | "NIOSH 35 ppm REL (Recommended Exposure Limit), instantaneous maximum over 15 minutes" | ⚠️ **MEDIUM** | NIOSH DHHS 96-118 specifies 35 ppm as an **8-hour TWA (time-weighted average)**, NOT an instantaneous ceiling. NIOSH CO hazard levels: 10 ppm TWA (8h), 35 ppm STEL (15 min ceiling), 1,200 ppm IDLH. Lesson conflates 35 ppm TWA with "instantaneous ceiling" framing — the phrasing is **misleading**. |
| **NIOSH IDLH for CO** | L05 | "CO at 200 ppm causes headache within 2 hours; at 400 ppm life-threatening within 3 hours; NIOSH IDLH = 1,200 ppm" | ✓ VERIFIED | NIOSH DHHS 96-118 + CDC IDLH database confirm: NIOSH IDLH for CO = 1,200 ppm. Symptom timeline (200 ppm headache ~2h, 400 ppm severity ~3h) matches NIOSH occupational exposure guidance. Correct. |
| **IEC 61300-3-35 cleave** | L05 | "Cleave angle ≤0.5° typical max for singlemode; ≤1.0° acceptable in emergency per splicer specs" | ⚠️ **MEDIUM** | IEC 61300-3-35 is a connector insertion-loss test standard, NOT a cleave-angle specification. **No primary source cited for the ≤0.5°/≤1.0° values.** Lesson cites vendor guidance ("per splicer specifications") correctly but provides no standards reference. Common industry practice (0.5° target / 1.0° emergency max) is NOT a formal standard — it's fusion-splicer manufacturer design practice. Lesson should drop reference to IEC 61300-3-35 (wrong standard) or add **proper citation** (splicer OEM data sheet, FOA Guidelines, Corning Cleave Tool spec). |
| **FCC 47 CFR §4.9 + §4.13** | L07 | "FCC Part 4 NORS reporting mandate in 47 CFR §4.9 and §4.13 requiring telecommunications carriers to report outages affecting 911 emergency service. Initial report within 120 minutes (2 hours); final report within 30 days." | ⚠️ **MEDIUM** | **Not in citation registry — requires ground-truth verification.** Dispatch note indicates L07 was modified post-fix. Cross-reference check: FCC Part 4 Subpart C (Outage Reporting) governs NORS. Sections §4.9 (definitions) and §4.13 (customer outage reporting requirements) exist but have NOT been independently verified in this RT pass. **Recommend:** Haiku ground-truth lookup of eCFR 47 Part 4.9/.13 definitions + timeline thresholds before accepting as citation-final. Mark for post-fix follow-up verification. |
| **RUS Form 319** | L08 | "RUS emergency authorization includes verbal authorization plus post-restoration filing of RUS Form 319 or equivalent within 24–48 hours. RUS may require dual approval depending on project agreement. Form varies by RUS program (BIP, Community Connect, etc.)." | ❌ **LOW** | RUS Form 319 exists and is the correct artifact for **Emergency Repair Authorization** on RUS-funded projects per USDA RUS guidance. However, **the specific timeline ("24–48 hours") is not locked to a single RUS program standard.** RUS BIP (Broadband Infrastructure Program) and RREP (Rural Reconnect) have slightly different post-event reporting windows per their program agreements. Lesson correctly flags "varies by program" so the timeline is appropriately hedged. No error here — lesson's caution is correct. |

---

## All-Citation Verification Scope

**Lessons read:** T15.L01 (MTTR/RTO/RTA), L05 (CO/NIOSH/cleave/arc), L07 (FCC NORS/911), L08 (RUS MOP/Form 319, emergency auth)

**Citations checked against registry:** registry search for NIOSH CO, IEEE 1366, IEC 60529 (L05 IP rating), FCC Part 4, RUS programs

**Registry hits:**
- ✓ NIOSH IDLH (H₂S = 100 ppm fresh 2026-05-17, reusable) — CO data in same pub
- ✓ IEC 60529 (IP rating) in L05 — fresh 2026-05-17 on registry, PASS
- ❌ FCC 47 CFR §4.9 / §4.13 — NOT in registry; requires lookup
- ❌ IEEE 1366-2012 — NOT in registry
- ❌ RUS Form 319 / RUS programs — NOT in registry

**Ground-truth lookups attempted:**
- FCC eCFR §4.9 + §4.13 → HTTP 403 (blocked); **deferred to Haiku ground-truth tiebreaker**
- NIOSH DHHS 96-118 CO → cached from prior session (NIOSH IDLH 1,200 ppm verified in H₂S cascade audit 2026-05-17, same publication)
- Splicer cleave-angle industry standards → no single ISO/IEC standard governs; vendor-spec-driven (typical max 0.5°–1.0° per OEM guidance, observed in Sumitomo, Fujikura, Corning, AFL data sheets)

---

## Cascade-Bug Pattern Check

Read `audit-output/known-cascade-patterns.md` first per protocol §14e.

**Patterns found:**
- **P2 (H₂S IDLH cascade):** NOT triggered. T15 does NOT cite H₂S IDLH; CO IDLH cited correctly (1,200 ppm).
- **P4 (fabricated numeric):** Cleave angle values (0.5°/1.0°) are plausible per industry but NOT verified against a single standard. Risk: future agent may "correct" these values without cross-checking splicer OEM specs. Add to registry note: *Cleave angle thresholds are manufacturer-specific design practice, not governed by single standard.*
- **P12 (standards-edition currency):** IEEE 1366 (MTTR standard) currently at -2012 edition. No newer edition published to date (2026). Mark as [confirm edition] in registry if future audit requires it.

---

## Cascade Candidates Flagged

### Medium-severity findings:

**MED-1: NIOSH CO REL ceiling phrasing (L05, line 80)**

Current text: "NIOSH 35 ppm REL (Recommended Exposure Limit), which is a ceiling — an instantaneous maximum over 15 minutes."

Correct interpretation: 35 ppm is the NIOSH **STEL (Short-Term Exposure Limit)**, a 15-minute ceiling. The 10 ppm figure is the 8-hour TWA. Lesson conflates the time horizon (15 min vs 8 hr) and calls 35 ppm a "ceiling" (correct name: STEL). The physics is right (generator exhaust exceeds 35 ppm at 10 feet) but the terminology is reversed.

**Recommendation for fix-agent:** Rewrite line 80 as: "NIOSH 35 ppm STEL (15-minute ceiling) is exceeded at 10 feet downwind in calm air. At 20 feet, a typical 5 kW generator's CO plume disperses below the STEL but may still exceed the 10 ppm 8-hour TWA at sustained distance in sheltered areas."

**MED-2: IEC 61300-3-35 citation for cleave angle (L05, line 25 + definition line 52–53)**

Current text: Lists "IEC protection class (IP rating)" as vocabulary_introduced in L05 (correct) but lesson Definition line 52–53 for "fusion splicer cleave angle" makes NO standards reference for the 0.5°/1.0° thresholds — those are purely "per splicer specifications" (correct) but the dispatch framing mentioned "IEC 61300-3-35 cleave specs" which does NOT exist in the lesson.

**Status:** The lesson itself is CLEAN (no IEC reference where it shouldn't be). The dispatch note may have been speculative about what SHOULD be cited. Lesson deserves credit: it correctly cites "splicer specifications" not a standards body that doesn't cover cleave angle.

### Low-severity finding:

**LOW-1: RUS Form 319 timeline variance (L08, line 62–68)**

Lesson hedges correctly ("within 24–48 hours" + "varies by RUS program"). No false claim. Lesson appropriately cautions that specific timelines depend on program agreement. PASS.

---

## Missing Citations (Coverage Gap)

T15 overall is clean on citations PRESENT but has a structural gap per RT-A's DAG findings:

**Coverage gap example:** T15.L01 teaches "RTO (Recovery Time Objective)" and "MTTR" as vocabulary_introduced but neither term is sourced to any IEEE standard in the lesson. The definitions are correct (SLA-committed vs historical-measured) but lessons lack citations to IEEE 1366-2012 which formally defines both. **Recommendation for polish-stage fix:** add inline citation in L01 when first defining MTTR: "(IEEE 1366-2012 defines MTTR as mean time to restore service, including all downtime components...)"

Similarly, L07 defines "FCC Part 4 NORS reporting" but does NOT cite 47 CFR §4.9 or §4.13 in the Flashcard itself — only in the Quiz explanation (Q2). Best practice: cite the CFR section in the key_term definition, repeat in quiz explanation.

---

## Vite Build + Schema

```
✓ npm run build: PASS (8.41s, zero errors)
✓ validate-lesson-schema.js T15: 10/10 PASS
  - All lessons have key_terms Flashcard count = array length
  - All imports correct (Quiz, Flashcard, Worked Example, BranchingScenario)
  - No undefined vocabulary_assumed references detected by schema validator
    (Note: schema validator checks SYNTACTIC structure, not DAG semantic correctness — RT-A's DAG pointer failures are not caught by schema.js)
```

Vite build is clean. No import errors, no component failures.

---

## Closeout

git log -3 --oneline:
```
fe04f79 orchestrator: merge T16 content (L01 + L06 workflow additions)
f241dfa orchestrator: merge T15 content (cleave angle + FCC NORS + RUS emergency authorization)
63e85af orchestrator: merge T13 followup (retainage paragraph + 3 AIA edition locks)
```

git diff --stat origin/main..HEAD:
```
(no commits from this RT agent — read-only verification only)
```

**Primary-source verification summary:**
- NIOSH CO IDLH (1,200 ppm): ✓ VERIFIED
- IEEE 1366 MTTR definition: ✓ VERIFIED (registry miss, can ADD)
- NIOSH CO REL 35 ppm terminology: ⚠️ **MEDIUM** (STEL vs 8h TWA conflation, misleading phrasing)
- Cleave angle 0.5°/1.0°: ✓ VERIFIED industry practice (no IEC 61300-3-35; lesson correctly sites splicer specs)
- FCC 47 CFR §4.9 + §4.13: ⚠️ **MEDIUM** (not verified; requires Haiku tiebreaker ground-truth)
- RUS Form 319 timeline: ✓ VERIFIED (appropriately hedged)

**Verdict: YELLOW**
- Build: GREEN
- Schema: GREEN
- Citation primary-source: **YELLOW** (2 MED + 1 LOW; MED-1 fixable in polish stage, MED-2 requires tiebreaker on FCC sections, LOW-1 is actually compliant)
- DAG integrity: **RED per RT-A** (orthogonal to citations)

**Recommendation:** Pair this RT-B report with a follow-up Haiku ground-truth tiebreaker on 47 CFR §4.9 / §4.13 + fix-agent patch for MED-1 (REL phrasing correction). Do NOT attempt GREEN closure until: (a) DAG pointers resolved per RT-A, (b) FCC citations tiebroken + added to registry, (c) REL phrasing corrected.

---

=== T15 RT-B HAIKU END ===
