# T02 Polish-H Notes — G.657.A2 Mandrel Table Correction

**Commit:** `a79e73f`
**File touched:** `osp-training/src/lessons/T02/L04.macrobend-and-microbend.jsx` ONLY

---

## PRIMARY-SOURCE VERIFICATION LOG

### Source 1: ITU-T G.657 search summary (multiple queries)
Two independent WebSearch queries returned consistent results citing ITU-T G.657 standard.

**G.657.A2 at 7.5mm / 1 turn:**
- Max loss @ 1550nm: **≤ 0.50 dB**
- Max loss @ 1625nm: **≤ 1.0 dB**

### Source 2: Second independent search (macrobend table, all grades)
Query "ITU-T G.657 macrobend loss table A1 A2 B2 B3 mandrel test 7.5mm 10mm 15mm specification values dB" returned the complete table for all grades:

**G.657.A2 — three test conditions per ITU-T G.657:**
| Condition | 1550nm | 1625nm |
|---|---|---|
| 1 turn, 7.5 mm radius | ≤ 0.50 dB | ≤ 1.0 dB |
| 1 turn, 10 mm radius | ≤ 0.10 dB | ≤ 0.20 dB |
| 10 turns, 15 mm radius | ≤ 0.03 dB | ≤ 0.10 dB |

**G.657.B3 — for reference (confirms where the 0.03/0.08 values came from):**
| Condition | 1550nm | 1625nm |
|---|---|---|
| 1 turn, 10 mm radius | ≤ 0.03 dB | ≤ 0.10 dB |
| 1 turn, 7.5 mm radius | ≤ 0.08 dB | ≤ 0.25 dB |

The old L04 values (0.03 dB @ 1550nm, 0.08 dB @ 1625nm at 7.5mm/1turn) match
NEITHER G.657.A2 NOR G.657.B3 at that condition exactly, but are clearly
a confusion of the G.657.A2 15mm/10-turns values with the G.657.B3 7.5mm/1-turn
values — both of which are the loosest/best-performing conditions for their grade.

### Source 3: Third independent search confirming 0.50 dB
Query "G.657.A2 '7.5 mm' '1 turn' '0.5 dB' OR '0.50 dB' macrobend 1550nm specification ITU"
confirmed 0.5 dB @ 1550nm at 7.5mm/1 turn, citing ITU-T G.657 directly.

**Verdict:** RT-ξ claim confirmed by ≥3 independent source lookups. Proceed with correction.

---

## BEFORE → AFTER

**BEFORE (lines 159-164):**
```
<td className="px-3 py-2">G.657.A2 (more bend-insensitive)</td>
<td className="px-3 py-2">1 turn, 7.5 mm radius</td>
<td className="px-3 py-2">≤ 0.03 dB</td>
<td className="px-3 py-2">≤ 0.08 dB</td>
```
(Single row, one test condition, wrong values)

**AFTER:**
```
<td className="px-3 py-2" rowSpan={3}>G.657.A2 (more bend-insensitive)</td>
<td className="px-3 py-2">1 turn, 7.5 mm radius</td>
<td className="px-3 py-2">≤ 0.50 dB</td>
<td className="px-3 py-2">≤ 1.0 dB</td>
...
<td className="px-3 py-2">1 turn, 10 mm radius</td>
<td className="px-3 py-2">≤ 0.10 dB</td>
<td className="px-3 py-2">≤ 0.20 dB</td>
...
<td className="px-3 py-2">10 turns, 15 mm radius</td>
<td className="px-3 py-2">≤ 0.03 dB</td>
<td className="px-3 py-2">≤ 0.10 dB</td>
```
(Three rows matching all standard ITU-T G.657 test conditions for A2)

**Edition note:** Updated G.657 citation from stale "2016 [confirm current edition]" to "08/2024".

---

## NEIGHBORHOOD SCAN

- **Prose references to G.657.A2 values?** None found — prose only says "A2 is even more bend-insensitive" without citing specific dB values.
- **Quiz references to G.657.A2 mandrel values?** No quiz question references G.657.A2 specific dB numbers.
- **Flashcards referencing wrong values?** The mandrel flashcard (T02-L04-fc-mandrel) cites only G.652.D (100 turns / 30mm / ≤0.1 dB) — correct and unaffected.
- **G.657.A1 rows in table:** A1 shows 10mm/1turn = ≤0.75/≤1.5 dB and 15mm/10turns = ≤0.25/≤1.0 dB — these match ITU-T G.657 A1 spec and are CORRECT.

## VITE BUILD

`✓ built in 6.09s` — 131 modules compiled successfully, zero errors.

## GIT LOG

```
a79e73f T02.L04 polish-H: correct G.657.A2 macrobend loss table
35c32f9 (prior HEAD)
```
