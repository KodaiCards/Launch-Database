# T17 DAG Terms Fix — Additions

## Task
Three terms in T17.vocabulary_assumed lacked upstream vocabulary_introduced:
1. `bore`
2. `attachment fee`
3. `pavement restoration`

## Findings + Actions

### 1. "bore" — FIXED
- **Used by:** T17 (estimating module)
- **Proposed home:** T06.L01 (HDD vs. Open-Cut vs. Plowing)
- **Status:** ✓ **ADDED**
- **Action:** Added `bore` to T06.L01 vocabulary_introduced array (4th position). Added Flashcard definition explaining bore as the drilled hole from HDD pilot bore + reaming phases. Term IS discussed in L01 prose (pilot bore, reaming, bore pit).

### 2. "attachment fee" — ALREADY PRESENT
- **Used by:** T17 (estimating, budget breakdown)
- **Found in:** T08.L08 (Attachment Fees and Annual Rents)
- **Status:** ✓ **NO CHANGE NEEDED**
- **Reason:** T08.L08 is ENTIRELY dedicated to attachment fees. Already in vocabulary_introduced with full Flashcard definition. Cross-reference is clean.

### 3. "pavement restoration" — FIXED
- **Used by:** T17 (cost estimating, surface disruption analysis)
- **Proposed home:** T06.L01 (construction methods comparison)
- **Status:** ✓ **ADDED**
- **Action:** Added `pavement restoration` to T06.L01 vocabulary_introduced array (5th position). Added Flashcard definition explaining restoration as post-excavation resurfacing (asphalt/concrete repair), cost range ($20–80/ft for asphalt), and why trenchless methods minimize it. Term IS discussed in L01 scenario prose ("restoration cost" for open-cut and plowing).

## Vite Build Result
✓ Build passes clean. No import errors. 14 assets generated.

## DAG Consistency
Both terms now have upstream vocabulary_introduced sources:
- T06.L01 → T17 (bore, pavement restoration)
- T08.L08 → T17 (attachment fee) — pre-existing

Prerequisite invariant maintained: T17 depends on T06 + T08, both now cover their vocabulary_assumed.

---

= END T17_DAG_TERMS_FIX_NOTES.md =
