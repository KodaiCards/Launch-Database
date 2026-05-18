# SPLASH_ARCH_V3 — Top-level Product Chooser

## Current state (v2)
- Single splash page (`Splash.jsx`) lists 18 general + 4 cert topics mixed
- Routes: `/` (splash) → `/course/:courseId` → `/course/:courseId/lesson/:lessonOrder`
- Data: `courses` array mixed `section:'general'` + `section:'cert'` entries

## v3 Requirements
1. **Top-level chooser** — 3 product categories, not mixed
2. **ISP placeholder** — future product, labeled "Coming in [date]"
3. **Cert tracks** — separate product category, optional entry point
4. **OSP final exam** — 60-Q timed exam at end of T17 (OSP course flow, not separate cert track)
5. **Backward-compatible URLs** — existing deep links (e.g., `/course/T02/lesson/3`) must not break

## Architecture v3

### 1. Routing changes (App.jsx)
- `/` → **ProductChooser** component (NEW) — displays 3 tiles: OSP / ISP / Cert Tracks
- `/training/osp` → **CourseView** with T01 auto-selected (or `/training/osp?start=T01`)
- `/training/isp` → **ISP Placeholder** (locked, date TBD)
- `/training/cert` → **CertTrackChooser** (NEW) — lists BICSI OSP Designer, FOA CFOS-O, BICSI RCDD
- `/training/cert/:certSlug` → existing **CertTrack** component
- `/training/osp/course/:courseId` → CourseView (NEW nesting)
- `/training/osp/course/:courseId/lesson/:lessonOrder` → LessonRouter (NEW nesting)
- **Backward compat:** keep `/course/:courseId` + `/course/:courseId/lesson/:lessonOrder` with client-side redirect to `/training/osp/course/...`

### 2. Component changes
| File | Change | Reason |
|---|---|---|
| `App.jsx` | Add ProductChooser, CertTrackChooser routes | Top-level navigation |
| `pages/ProductChooser.jsx` | NEW | 3 tiles: OSP / ISP / Cert, styling consistent w/ course tiles |
| `pages/CertTrackChooser.jsx` | NEW | Lists C01–C04 as opt-in entry points (NOT mixed into course list) |
| `pages/Splash.jsx` | Rename → `pages/CourseSplash.jsx`, remove cert section | Only shows general topics T01–T18 |
| `pages/CertTrack.jsx` | No change | Reused, linked from CertTrackChooser |

### 3. Data model changes (course-catalog.js)
- Keep `courses` array as-is (T01–T18 + T10–T17 placeholders, `section: 'general'`)
- Keep `certTracks` array (C01–C04, `section: 'cert'`)
- NO DATA CHANGES — v3 is purely UI/routing reorganization

### 4. Cert track structure
- 4 entries in `certTracks` (OSP Designer, FOA CFOS-O, BICSI RCDD, Exam Bank)
- Each entry has `slug: 'osp-designer'` + `title` + `description` + `lesson_count` + `exam_questions`
- CertTrackChooser maps over array, links to `/training/cert/:slug`
- CertTrack component reads `slug` from URL params, loads from `certTracks` array

### 5. OSP final exam placement
- **NOT a separate cert track** — exam is T17's capstone quiz (60 questions, 80% pass required, timed)
- T17 lesson schema includes `is_final_exam: true` marker
- LessonRouter detects marker, shows timed exam UI + result scoring
- Completion unlocks "OSP Course Complete" badge on splash
- Cert tracks are OPTIONAL advanced specializations (not the main course exit point)

### 6. Migration sequence (build-green guarantees)
1. **Commit 1:** Rename `pages/Splash.jsx` → `pages/CourseSplash.jsx`, update import in App.jsx (only remove cert section from CourseSplash render). Vite build clean.
2. **Commit 2:** Create `pages/ProductChooser.jsx` + `pages/CertTrackChooser.jsx` (NEW). No route changes yet.
3. **Commit 3:** Update `App.jsx` routes: add `/` → ProductChooser, `/cert` → CertTrackChooser, nest course routes under `/osp`. Add redirect `useEffect` from legacy `/course/:courseId` → `/osp/course/:courseId`. Vite build clean.
4. **Commit 4:** (Optional polish) Update nav header to include ProductChooser context ("← All Products" link on CourseView).

---

**Build validation per commit:** `cd osp-training && npm run build` must succeed. No uncommitted state.
