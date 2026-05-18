# T17 L05 Contract Types — Davis-Bacon + Bonds Fix

**Applied 2 canonical fixes to `T17.L05-contract-types.jsx` lines 330–365:**

1. **HIGH: Davis-Bacon Act Prevailing Wage Distinction.** Added §4 "Davis-Bacon Act Prevailing Wages — RUS Grants vs. Loans" with:
   - RUS grants (BEAD) require 40 USC §3141+ prevailing wages
   - RUS direct loans typically don't trigger Davis-Bacon
   - Inspector/PM must verify applicability at award time per funding source
   - Non-compliance voids federal funding

2. **MED: Bid Bonds + Performance Bonds.** Added §5 "Bid Bonds and Performance Bonds":
   - Bid bond: 5-10% of bid price, due at submission
   - Performance bond: 100% of contract value, due at execution
   - Federal (FAR 28.102) mandates both above thresholds
   - Private practice varies by owner

**Verification:**
- ✓ Vite build clean (8.47s)
- ✓ T17 schema validation: 10/10 PASS

**Branch:** `agent/t17-fix-dba-bonds-bi19`
