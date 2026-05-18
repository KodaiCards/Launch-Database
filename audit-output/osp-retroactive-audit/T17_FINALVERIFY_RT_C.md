# T17 Final-Verify RT-C (Haiku) — 2026-05-18

**Verdict: RED**

**Critical Gap:** T17.L05 LACKS Davis-Bacon wage requirements (40 USC §3141) and bid/performance bond language (FAR 28.102). Dispatch premise "Davis-Bacon + bonds fix landed at 9cc7d13" is false — that commit exists on agent branches only, NOT on main. Current HEAD `4cf7de5` has no bond/wage content.

**Findings:**
1. **HIGH — T17.L05 missing Davis-Bacon (40 USC §3141):** RUS projects ≥$2000 require Davis-Bacon prevailing wages. L05 discusses contract types but omits wage/bond compliance.
2. **HIGH — T17.L05 missing bid bond + performance bond (FAR 28.102):** RUS construction contracts typically require contractor bonds. Not mentioned in L05 anywhere.
3. **Schema ✅ 10/10 PASS.** Vite build ✅ clean (6.64s).
4. **L01-L10 no regressions** — prior quiz/scenario/vocab intact.
5. **Cascade scan:** No numeric/citation errors detected in present content.

**Cause:** Dispatch referenced a non-landed fix. The Davis-Bacon + bonds content was authored on agent branches but never merged to main.

**Recommendation:** T17.L05 requires fix-agent dispatch to add §3141 wages + FAR 28.102 bonds to the RUS section before final-verify can close GREEN.

=== T17_FINALVERIFY_RT_C END ===
