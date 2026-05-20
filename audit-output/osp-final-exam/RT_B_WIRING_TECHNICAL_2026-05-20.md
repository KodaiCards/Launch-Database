# RT-B Technical / Integration Audit — OSP Final Exam (C05.L01)
**File:** `osp-training/src/lessons/C05/L01.osp-final-exam.jsx` (commit `bf42544`)
**Date:** 2026-05-20
**Framing:** Senior code reviewer + integration QA
**Write-path constraint acknowledged:** only `audit-output/osp-final-exam/RT_B_WIRING_TECHNICAL_2026-05-20.md` written.

---

## Executive Summary

The component builds clean (Vite ✓, 84.70 kB chunk), is correctly registered in the course catalog, and integrates with LessonRouter via `lessonFileIndex`. Timer logic, pass-threshold math, and core scoring are correct. However, **one HIGH defect** and **four MED defects** were found. The HIGH defect means T19 (Headend/CO) has zero questions in the 60-question exam despite being listed in the topic distribution, and T18 is halved — a structural content coverage failure that directly contradicts the exam's stated scope.

**Overall verdict: YELLOW — fix the slice/distribution before release.**

---

## Findings

### HIGH-1 — T19 has 0 questions in the exam; T18 halved — distribution/implementation mismatch
**File:** `L01.osp-final-exam.jsx:1244-1245`
**Severity:** HIGH
**Verified by reading:** lines 1244-1245, and confirmed by counting question IDs F01-F64 by topic.

```js
const TOTAL_QUESTIONS = QUESTIONS.length; // 64 authored, slice to 60 below
const EXAM_QUESTIONS  = QUESTIONS.slice(0, 60); // 60-question exam
```

The distribution comment at line 46-48 states:

```
// Distribution: T01×4, T02×5, T03×3, T04×3, T05×5, T06×4, T07×2, T08×4,
//               T09×4, T10×3, T11×4, T12×4, T13×3, T14×4, T15×2, T16×2,
//               T17×2, T18×4, T19×2 = 64 written → trim T07, T15, T16, T17 by 1 each = 60.
```

**Actual behavior of `slice(0, 60)`:** questions are ordered T01 through T19 sequentially in the QUESTIONS array. The last 4 positions in the 64-element array are:
- Index 60 (F61): T18.L07 — OSHA 1910.269 MAD (excluded)
- Index 61 (F62): T18.L02 — LOTO -48VDC (excluded)
- Index 62 (F63): T19.L06 — GPR bonding at headend (excluded)
- Index 63 (F64): T19.L07 — Interconnect vs cross-connect (excluded)

**Result in delivered exam:**
| Topic | Comment claims | Actual in exam |
|-------|---------------|----------------|
| T07 | 2 | 2 (all retained) |
| T15 | 2 | 2 (all retained) |
| T16 | 2 | 2 (all retained) |
| T17 | 2 | 2 (all retained) |
| T18 | 4 | **2** (F61/F62 excluded) |
| T19 | 2 | **0** (F63/F64 excluded) |

T19 (Headend/CO + Rack-Side Hardware) is a completed, closed topic that represents a non-trivial portion of the OSP engineer's knowledge domain. Zero coverage in the final exam is a material content gap.

**Fix:** Either (a) move F63/F64 to earlier positions in QUESTIONS (before index 60), or (b) remove the slice entirely and trim F61/F62 by moving them later, or (c) restructure the distribution to actually trim T07/T15/T16/T17 as the comment claims by repositioning those questions at the end of the array.

---

### MED-1 — cert_track semantic mismatch: course final posted to certification endpoint
**File:** `L01.osp-final-exam.jsx:1305, routes/training.js:147`
**Severity:** MED
**Verified by reading:** L01.osp-final-exam.jsx lines 1302-1325, routes/training.js lines 140-196.

```js
// L01.osp-final-exam.jsx:1305
cert_track: 'OSP-Designer',
```

```js
// routes/training.js:147
const validTracks = ['OSP-Designer', 'RCDD', 'CFOT', 'CFOS-O'];
```

The value `'OSP-Designer'` is accepted by the backend (no 400), so there is no runtime error. However, `training_cert_attempts` is semantically designed for BICSI/FOA certification prep mock exams. A course mastery final exam stored there will appear in the user's cert-attempt history alongside actual BICSI OSP Designer mock exam attempts, conflating two different assessment types. This affects reporting accuracy in any future admin view querying `cert_track = 'OSP-Designer'`.

The lesson already posts to `/api/training/progress` (line 1329-1345) which correctly records course completion. The cert-attempt post is additive and semantically wrong.

**Fix options:** (a) Add a new `cert_track` value like `'OSP-Final'` or `'course-final-osp'` to both the allowed list and this call, or (b) remove the `persistCertAttempt` call entirely and rely solely on `persistLessonComplete`, or (c) add a `total_items`/`correct_items` column to `training_progress` to carry the score through the progress endpoint.

---

### MED-2 — Course catalog description and prerequisites reference T20 (not yet authored, not in exam)
**File:** `osp-training/src/data/course-catalog.js:363-365`
**Severity:** MED
**Verified by reading:** course-catalog.js lines 355-366, L01.osp-final-exam.jsx lines 22-24.

```js
// course-catalog.js:363-365
prerequisites: ['T01','T02','T03','T04','T05','T06','T07','T08','T09','T10','T11','T12','T13','T14','T15','T16','T17','T18','T19','T20'],
description:
  '60-question comprehensive final exam covering all general OSP topics T01–T20. ...',
```

```js
// lesson meta:22-24
prerequisites: [
  'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09',
  'T10', 'T11', 'T12', 'T13', 'T14', 'T15', 'T16', 'T17', 'T18', 'T19',
],
```

T20 is listed as a prerequisite in the catalog entry (meaning a learner cannot access the exam until T20 is complete) but T20 does not exist yet and has zero questions in the exam. This creates a learner-visible gate on a non-existent topic.

**Fix:** Remove T20 from catalog prerequisites and change description from "T01–T20" to "T01–T19" to match actual exam scope.

---

### MED-3 — No exam-session persistence (tab close / accidental refresh loses 90 minutes of work)
**File:** `L01.osp-final-exam.jsx:1496-1648` (ExamView component)
**Severity:** MED
**Verified by reading:** ExamView lines 1496-1649 — no sessionStorage, no beforeunload handler, no persistence of answers state.

There is no `sessionStorage` checkpoint of `answers` and `timeLeft` state, and no `beforeunload` warning event. If a learner accidentally closes the browser tab, navigates away, or experiences a crash during the 90-minute exam, all selected answers and the timer state are lost. The learner must restart from scratch.

```js
// ExamView: no beforeunload handler, no sessionStorage save
const [answers, setAnswers] = useState({});
const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_S);
```

**Fix:** Add `useEffect` that writes `answers` + `startTime` to `sessionStorage` on every answer change, and restores on mount. Add a `beforeunload` listener with a warning message. This is especially important for a timed, high-stakes 90-minute assessment.

---

### MED-4 — Silent persistence failure on session expiry (no user feedback when score save fails)
**File:** `L01.osp-final-exam.jsx:1322-1325, 1342-1345`
**Severity:** MED
**Verified by reading:** lines 1302-1345.

```js
// persistCertAttempt:
  } catch {
    // Non-blocking — exam result is still shown even if persistence fails
  }
// persistLessonComplete:
  } catch {
    // Non-blocking
  }
```

Both persistence calls fail silently. A 90-minute exam session outlasts typical session token lifetimes if the user started without recent activity. If the `lfs_session` cookie expires mid-exam, both POST calls will receive a 401 and the score will not be saved — but the user sees the results view with no indication that their attempt was not recorded.

**Fix:** Catch the response status in each persist call. If a 401 or 500 is returned, show a toast/warning message telling the user to screenshot their results or contact support, since the save failed.

---

## Confirmed Correct (negative findings)

1. **Component integration:** `LessonLayout` import at line 11 is the only external component dependency. No `Quiz`, `FinalExam`, or other missing import — the exam is self-contained. Import is correct.
2. **Course catalog registration:** `C05.L01` correctly registered in `lessonFileIndex` at `course-catalog.js:735`. `LessonRouter` uses `import.meta.glob('../lessons/**/*.jsx')` which matches the C05 subdirectory. Route is wired correctly.
3. **API endpoint match:** `persistCertAttempt` POSTs to `/api/training/cert-attempt` with `cert_track: 'OSP-Designer'`. The backend at `routes/training.js:147` accepts `'OSP-Designer'` — no 400 error.
4. **Score fields wiring:** `score`, `passed`, `time_taken_seconds`, `total_items`, `correct_items`, `domain_scores` all populated and field-named to match backend expectations (lines 1304-1317 vs routes/training.js:144-145).
5. **Pass threshold math:** `48/60 = 0.80 = 80%` exact. `Math.round(48/60*100) = 80 ≥ 80` → pass. `Math.round(47/60*100) = 78 < 80` → fail. Integer arithmetic is exact.
6. **Timer implementation:** `setTimeout` chain decrementing `timeLeft` via functional update `s => s - 1` (line 1504) avoids stale closure issues. Stop condition `if (timeLeft <= 0) return` (line 1503) correctly halts. Auto-submit fires in `useEffect([timeLeft])` when `timeLeft === 0` (line 1518-1520). `handleSubmit` is memoized via `useCallback([answers, onComplete])` ensuring latest answer state is submitted.
7. **Auto-submit submits last-selected state:** `handleSubmit` captures `answers` at memoization time; since `answers` is a dependency, the `useCallback` is updated whenever any answer changes. The submitted state is the most recent selection. Correct.
8. **No FinalExam component introduced:** the agent did not create a separate `FinalExam` primitive — the exam is implemented entirely as local components within this file (LandingView, ExamView, ResultsView, ScoreBar). This is acceptable for a standalone exam and avoids adding an untested new primitive.
9. **Per-domain pct computation:** `Math.round((v.correct / v.total) * 100)` (line 1313) — no division by zero risk. T19 (0 questions in exam) never enters `domainScores`, so its entry never gets a total of 0. The TOPIC_ORDER `if (!d) return null` guard (line 1400) handles the absent T19 cleanly.
10. **Keyboard navigation:** Radio inputs (`<input type="radio">`) handle arrow-key navigation natively. Question navigator buttons have `aria-label` and `aria-current` attributes (lines 1561-1563). Correct.
11. **Pass/fail text indicators:** `✓ PASSED` and `○ Below 80%` both provide text equivalents (lines 1379-1381) — not color-only signals.
12. **Vite build:** `npm run build` succeeds, produces `L01.osp-final-exam-C89Mrclc.js` (84.70 kB). Zero compilation errors.
13. **lessonOrder padding in LessonRouter:** URL param `lessonOrder` is padded to 2 digits (`L01`), matching `lessonFileIndex` key `C05.L01`. Routing resolves correctly.

---

## Lower-Severity Notes (not blocking)

- **LOW:** No question or answer-choice shuffle. Fixed order enables answer-position memorization on retake. For a course final this is an acceptable tradeoff over complexity, but a cert exam should shuffle.
- **LOW:** `TOTAL_QUESTIONS` (line 1244) is declared but never used (it resolves to 64, not 60, and no code references it after declaration).
- **LOW:** Double-submit race: if the timer fires at the exact instant the user clicks "Submit Exam", `handleSubmit` can be called twice, producing two records in `training_cert_attempts`. The window is ~1ms; negligible in practice but could be guarded with a `submittedRef`.
- **LOW:** `ScoreBar` uses color-only encoding (green/amber/rose) for domain score levels. The numeric `d.correct / d.total` text next to each bar provides a text alternative, so this is low severity.

---

## Verdict: YELLOW

**Must fix before release:**
1. HIGH-1: T19 has 0 questions in delivered exam — fix slice or repositioning
2. MED-2: Remove T20 from catalog prerequisites and description

**Should fix before release:**
3. MED-1: cert_track semantic mismatch (course final ≠ cert attempt)
4. MED-3: No session persistence for 90-minute exam
5. MED-4: Silent persistence failure — add user-visible error toast

=== RT-B WIRING TECHNICAL REPORT END ===
