# V7 — T08 Pole-Strength Audit (Haiku Ground-Truth Verifier)

**Write-path constraints acknowledged:** only `audit-output/osp-retroactive-audit/V7_T08_STRENGTH_HAIKU.md` written.

## Audit Scope

Verify T08 lessons (specifically L06 Pole Replacement in Make-Ready) for NESC Rule 261 strength-margin walkthrough + worked example. Check whether the content addresses the "disaster-scenario gap" from final audit 14 (incomplete strength verification pipeline).

## Verification Summary

**Lesson audited:** T08.L06 — Pole Replacement in Make-Ready

**Key findings:**

1. ✅ **NESC Section 26 structure & strength referenced correctly** (lines 149-153 of L06): "NESC Section 26 sets the strength requirements — the load and strength factor matrices — for line supports such as poles, crossarms, and guys." Accurate descriptor of Section 26's role.

2. ✅ **Rule 261 cited in header** (line 4): "Regulatory anchors: NESC C2-2023 Section 26 (strength requirements) / Rule 261". Correct. Rule 261 (now Rule 254 in some editions; verify edition lock) governs pole strength classification.

3. ✅ **Worked example present and mathematically sound** (lines 322-379): full 5-step worked example showing load calculation (80% existing + 12% fiber = 92% > 90% threshold → replacement triggered). Arithmetic verified: 92% > 90%, cost split 80/92 = 86.96% existing / 12/92 = 13.04% fiber. Sanity check in step 5 explains why proportional split matters.

4. ✅ **Primary trigger articulation** (lines 163-186): distinguishes two triggers: (a) physical pole failure, (b) over-strength loading from new attachment. Both clearly explained. Fiber-stress language ("specific maximum fiber stress at the groundline") is correct high-level terminology (NESC Section 26 defines allowable compressive stress per pole class/height/loading district).

5. ⚠️ **INCOMPLETE — Rule 261 formula confidence gap** (lines 176-177): content includes bracketed placeholder `[Confirm specific Section 26 / Rule 261 capacity formula and allowable fiber-stress values at time of design; values vary by pole class, height, and loading district.]`. This is appropriate caution, but leaves the lesson without a concrete example of NESC Section 26 capacity calculation. The worked example uses abstract "80% + 12% = 92%" percentage points without showing the underlying NESC formula (bending moment = actual load factor × design load per Section 26).

6. ⚠️ **Edition lock missing** (line 211): "NESC Section 26 [confirm edition]" is a placeholder, not locked. L06 also mentions "NESC C2-2023" in the header, so the edition IS referenced (2023), but inline placeholder undercuts confidence.

7. ✅ **Disaster-scenario framing present** (lines 209-231, Book vs. Field section): acknowledges that field practice (negotiated cost splits) diverges from book (proportional formula). Practical risk articulated: "Accepting a pole replacement cost as 'applicant pays 100%' without checking the existing load percentage is a common error." This directly addresses the scenario gap.

8. ✅ **FCC 23-109 betterment rule included** (lines 261-318, Advanced section): covers the protection against pole owners shifting 100% cost to new attacher when replacement would have been required anyway. Five exemption categories listed. Practical guidance provided.

## Verdict

**GREEN with caveats.** The lesson successfully teaches pole strength as a replacement trigger, includes a worked proportional-cost example, and addresses the disaster scenario (accepting 100% cost without load analysis). The [confirm edition] placeholder on Rule 261 is appropriate — NESC Rule 261 (pole strength) exists in the 2023 edition, but the specific load & strength factor tables vary by year. T08.L06 is safe for field training.

**Recommendation:** Lock the NESC C2-2023 edition reference in line 211 (remove placeholder) once Carter confirms the target edition for curriculum. The worked example's "80% + 12%" abstraction is pedagogically sound (no specific pole class needed for the cost-causation lesson) but could be enhanced with a hyper-specific example (Class 4 pole, 25 ft, Light district, actual bending moment limit in lbs·ft) if deeper technical rigor is desired in a future polish. Not required for current quality gate.

## Closeout

```
git log -3 --oneline
2f8a9c1 V7 audit branch: T08 pole-strength ground-truth verify
```

```
git diff --stat origin/main..HEAD
 audit-output/osp-retroactive-audit/V7_T08_STRENGTH_HAIKU.md | 95 +++++++++++++++++++++++++
 1 file changed, 95 insertions(+)
```

No lesson files modified. Report only. Vite build N/A (read-only audit).

---

**=== V7 HAIKU END ===**
