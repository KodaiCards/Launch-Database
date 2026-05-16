# Pending Dispatches (pre-written for timer wake-up)

> Pre-written prompts ready to copy into Agent dispatch when 2-hour throttle timer fires.
> Saves think-time at wake-up.

---

## T18 polish-3 (highest priority at wake)

**Trigger:** timer fired, RT-G + RT-H both flagged Z359.4 citation regression.

**Agent role:** polish-agent (fresh, narrow scope)
**Model:** sonnet
**Description:** "T18 polish-3 Z359 + CO IDLH"

**Prompt:**
```
T18 POLISH-3 (fresh polish-role per locked 5-role roster). Apply 1 MED + 1 LOW from T18 final-verify-2 RT pair (RT-G `3dbdd18` + RT-H `397f54b`). Senior OSP engineer + field safety officer framing. <1% accuracy bar.

## CRITICAL: VERIFY CORRECTED CITATION AGAINST PRIMARY SOURCE BEFORE APPLYING

Polish-2 fix-agent introduced the Z359.4 regression by trusting the canonical's suggestion without primary-source verification. DO NOT repeat that pattern. Before applying the citation fix, READ the actual ANSI Z359 family title for Z359.2 (or Z359.1 + Z359.11) from a primary-source reference and confirm it matches the lesson's described scope. State the verified title in your closeout.

## Apply (2 items)

1. **NEW-G1 MED — L04 ANSI Z359.4 wrong title (3 locations):** Polish-2 incorrectly replaced Z359.1 with Z359.4. Z359.4-2013 is "Assisted-Rescue and Self-Rescue Systems" — NOT the use/inspection/maintenance content described. Correct standard for the described content (managed fall protection program / use+inspection+maintenance): ANSI **Z359.2** ("Minimum Requirements for a Comprehensive Managed Fall Protection Program"). Alternative simpler citation: keep Z359.1 (umbrella) + Z359.11 (full-body harness specifications). Pick Z359.2 unless your primary-source check shows otherwise. Fix all 3 L04 locations (Book/Field prose, SideBySide leftValue, Q2 citation).

2. **NEW-G2 LOW — L03 CO IDLH wording creates competing exit signal:** Current text in L03 atmospheric table Action column reads "NIOSH IDLH = 1,200 ppm — at IDLH, immediate threat to life; exit immediately with no delay." This competes with column 4's 25 ppm exit threshold. Soften so the IDLH context is informational, not a competing trigger: e.g., "Exit at 25 ppm per column 4 (ACGIH TLV-TWA); for context, NIOSH IDLH = 1,200 ppm = immediate threat." OR move IDLH context to a footnote.

## Neighborhood scan after each fix

Per fix-agent rule: scan ±20 lines OR same array for same-pattern bugs. **Surface but do NOT fix** unscoped items.

## STRICT WRITE-PATH ALLOWLIST

- `osp-training/src/lessons/T18/L03.*.jsx`
- `osp-training/src/lessons/T18/L04.*.jsx`
- `audit-output/osp-retroactive-audit/T18_FIX_CANONICAL.md`

DO NOT touch any other file. Acknowledge constraints in FIRST line of result.

## Closeout REQUIRED

1. `git log -N --format='%H %s'` paste
2. `git status` clean tree
3. **Primary-source verification:** quote the verified title of the citation you chose (Z359.2 or whichever) from a primary-source URL you read
4. BEFORE → AFTER for each fix
5. Neighborhood scan findings (do NOT fix)
6. Update T18_FIX_CANONICAL.md status

Result first line: acknowledge write-path constraints.
Result ≤300 words.
```

---

## T18 final-verify-3 RT pair (after polish-3 lands)

Sequential. RT-I pedagogy first, RT-J technical after. Same strict-constraints template as RT-G/RT-H. Verify the Z359 citation chosen by polish-3 is primary-source correct. Verify NEW-G2 LOW is resolved. Independent gap research from yet-different framing if possible.

---

## T05 polish-3 + final-verify-2 RT pair

After T18 closes:
1. T05 polish-3: 1-line fix for T07/L02 `existing utilities` source_lesson_id (flagged during T05 polish-2 neighborhood scan)
2. T05 final-verify-2 RT pair: confirm T05 truly closes

---

## T04 polish (P9 §32.2210 → §32.2410 citation fix)

After T05 + T18 close, before moving to T06:
- T04 L07 §32.2210 reference → §32.2410 (Haiku ground-truth `a42e9f8` confirmed §32.2210 = Central office—switching; §32.2410 = Cable and wire facilities; lesson teaches Cable & Wire content, so use §32.2410)
- Then T04 final-verify RT pair confirming clean

---

## After all topic-closures: full back-fill verification

- T01 retroactive re-audit under NEW pipeline (was completed under old rules)
- T19 retroactive verify (was completed under THIS session's pipeline but cross-check)
- T07 + T08 re-audit under new pipeline (touched by T05 cross-topic DAG fixes, originally COMPLETE under old rules)

---

## Then: forward authoring + remaining queue

- T06 retroactive audit (full pipeline)
- T09 author wave (brief landed `6950a94`)
- T14 author wave (brief landed `4e087d6`)
- T10-T13, T15-T17, T20-T22 in DAG order
- Cert prep tracks (OSP Designer + FOA CFOS/CFOT)
- Moodle teardown (OSP-RW.6)
- E2E QA + production cut (OSP-RW.7)
- Launch-DB queue Phases 1-11
- Future builds (attenuation calc, client portal v1, ISP course)
