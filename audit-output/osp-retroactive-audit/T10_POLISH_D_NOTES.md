# T10 Polish-D Notes

**Wave:** T10 Polish-D  
**Commit:** `92030fd`  
**Triggered by:** RT-θ `0b93e0a` finding — L12 capstone quiz lines 212-213, 217 still used "single axle" framing after Polish-C scoped to L07 only.

## Changes Applied

**File:** `osp-training/src/lessons/T10/L12-t10-capstone-quiz.jsx`

| Location | Before | After |
|---|---|---|
| Line 212 (option b) | `H-20 (16,000 lb single axle — private driveways and parking lots).` | `H-20 (16,000 lb per rear-tandem axle — private driveways and parking lots).` |
| Line 213 (option c) | `H-25 (20,000 lb single axle — all public roadways and many commercial driveways).` | `H-25 (20,000 lb per rear-tandem axle — all public roadways and many commercial driveways).` |
| Line 217 (explanation) | `H-20 (AASHTO H-20 loading = 16,000 lb single-axle, 32,000 lb tandem axle) is...` | `H-20 (AASHTO H-20 loading = 16,000 lb per rear-tandem axle) is...` |

## Full-sweep result

Grep of all T10 lessons for `single.axle` / `single-axle` before fix: 3 occurrences, all in L12 at the lines above. Zero occurrences in L01-L11. Sweep complete.

## Terminology justification

AASHTO HS-20/HS-25 loads apply to the rear-tandem axle group (dual rear axle assembly), not a single individual axle. L07 (after Polish-C) consistently uses "rear-tandem axle" throughout (lines 51, 151, 156, 252, 253, 309). L12 now matches. The old explanation also incorrectly stated "16,000 lb single-axle, 32,000 lb tandem axle" — that conflates two separate rating notations. Correct: 16,000 lb per rear-tandem axle for H-20; 20,000 lb per rear-tandem axle for H-25.

## Validator + Build

- Validator T10: 12/12 PASS, 0 FAIL, 0 WARN
- Vite build: ✓ clean (built in 6.61s)

=== T10 POLISH-D NOTES END ===
