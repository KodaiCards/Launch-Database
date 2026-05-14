# Wave 3 FE-A11y — Auditor A (Broad Fresh-Eyes)

## Stack Snapshot

Six portals audited: admin.html (8478 lines), permitting.html, design.html, timeclock.html, splice.html, launcher.html. Prior wave shipped role=dialog + aria-modal on all 34 static modals and overlay_modal.js with full focus trap. Remaining open work confirmed: ~281 unlabeled inputs, focus trap missing on all static-HTML modals, dynamic account modals missing full ARIA, aria-selected stale in permitting/design tab switch, color contrast failures, and several icon buttons missing aria-label.

---

## Findings

| # | Severity | Category | File | Line Range | Snippet | Issue | Fix Shape | Confidence |
|---|---|---|---|---|---|---|---|---|
| 1 | HIGH | Focus Trap | admin.html | 7889–7890 | `function openModal(id) { document.getElementById(id).classList.add('open'); }` | openModal() adds .open class only — no focus movement into modal, no Tab trap, no focus-return on close. All 25 static modals in admin are affected. Screen-reader users can Tab out of the modal into background content. | On open: move focus to first focusable child; add keydown Tab/Shift+Tab trap; on close: return focus to trigger element. | HIGH |
| 2 | HIGH | Focus Trap | permitting.html, design.html | 670–671 (permitting) | `function om(id){document.getElementById(id).classList.add('open')}` | om()/cm() in permitting + design: same gap as admin openModal. 2 static modals per portal. No ESC handler exists at all in either file (admin has one at line 7895; permitting/design have zero keydown listeners). | Same as #1; also add ESC dismiss equivalent to admin line 7895. | HIGH |
| 3 | HIGH | Focus Trap | timeclock.html | 1060, 1081, 1084–1085 | `document.getElementById('entry-modal').style.display = 'flex';` | openEntryModal / openEditEntryModal set display:flex directly, no focus management. closeEntryModal sets display:none. 2 static modals in timeclock (entry-modal, rnp-modal). No ESC keydown handler found anywhere in timeclock.html. | Move focus to modal on open, trap Tab, return focus on close, add ESC listener. | HIGH |
| 4 | HIGH | Dynamic Modal ARIA | permitting.html, design.html, timeclock.html | 1770–1803 (permitting), 1733–1804 (design), 600–630 (timeclock) | `overlay.className = 'modal-overlay'; overlay.style.display = 'flex';` | showAccountMenu() in all three portals creates a div.modal-overlay with NO role="dialog", NO aria-modal, NO aria-labelledby, close button has NO aria-label, NO focus trap, NO focus return. | Set role="dialog", aria-modal="true", aria-labelledby pointing at title span (give it an id), add aria-label to close btn, move focus in, trap Tab, add ESC handler. | HIGH |
| 5 | HIGH | Missing aria-label | admin.html | 1419 | `<button onclick="toggleAI()" style="background:none;border:none;..."><i class="fa-solid fa-xmark"></i></button>` | AI panel close button: no aria-label, no title. Icon-only button is unlabeled for AT. | Add aria-label="Close AI assistant" | HIGH |
| 6 | HIGH | Form Labels | admin.html | 784–789, 1063–1067, 1471–1472 | `<label>Engineering Contract</label><select id="prp-ec"...>` | 112 `<label>` elements in admin.html have no for= attribute. Labels are visually adjacent but programmatically unassociated — VoiceOver/NVDA announces inputs as unlabeled. Top instance clusters: psc-rus-pdf modal (prp-ec, prp-job), project-modal (~30 inputs), time-entry modal. | Add matching id= to each input and for= to each sibling label. | HIGH |
| 7 | HIGH | Form Labels | splice.html | 669, 677, 683, 717–718, 1262–1263 | `<label style="...">Color</label><input type="color" id="se-color"...>` | 83 label elements in splice.html with no for= — same pattern as admin. Affects the style-editor panel, layer-create form, closure/cable/splice modals. Splice is the primary contractor-facing surface; contractor accessibility is a stated product goal. | Same as #6. | HIGH |
| 8 | MEDIUM | Tab ARIA Stale | permitting.html, design.html | 693–699 (permitting), 706–712 (design) | `function sv(v){ document.querySelectorAll('.nav-tab').forEach(t=>t.classList.toggle('active',...)); }` | sv() toggles CSS .active class but never updates aria-selected on role="tab" elements. The initial HTML sets aria-selected="true" on the pipeline tab and "false" on potential — those values never change. Screen readers announce wrong selected state when switching tabs. | Add `t.setAttribute('aria-selected', t.dataset.view === v ? 'true' : 'false')` inside sv() forEach. | HIGH |
| 9 | MEDIUM | Missing aria-label | admin.html | 1168 | `<button class="btn btn-icon btn-secondary" onclick="closeAuditDrawer()" title="Close">` | Audit drawer close button uses title= only. title is not reliably announced by all AT (especially mobile screen readers). No aria-label. | Replace title="Close" with aria-label="Close audit log". | MEDIUM |
| 10 | MEDIUM | Missing aria-label | admin.html | 1445 | `<button class="btn btn-sm btn-icon" onclick="clearAIFile()" style="width:20px;height:20px;font-size:10px"><i class="fa-solid fa-xmark"></i></button>` | AI file-clear button has no aria-label or title. | Add aria-label="Remove uploaded file". | MEDIUM |
| 11 | MEDIUM | Missing aria-label | admin.html | 603 | `<button onclick="hideUndoBar()" title="Dismiss" style="...">×</button>` | Undo-bar dismiss button uses title="Dismiss" only; no aria-label. Same title-only issue as #9. | Add aria-label="Dismiss". Already has title; easiest to add aria-label in parallel. | MEDIUM |
| 12 | MEDIUM | Missing aria-label | admin.html | 1453 | `<button class="ai-toggle" onclick="toggleAI()"><i class="fa-solid fa-robot"></i></button>` | Mobile AI toggle FAB (visible <900px) has no aria-label. | Add aria-label="Open AI assistant". | MEDIUM |
| 13 | MEDIUM | Color Contrast | All portals (light) | admin.html:44, permitting.html (inherits) | `--text-muted:#6C757D` on `--surface-1:#F5F7FA` | Computed ratio 4.37:1 — fails WCAG AA 4.5:1. Used for all label text, table header text, stat-label, form-hint, filter labels. This CSS variable cascades to every portal. | Darken to #5A6370 (≈4.9:1) in the :root block. Verify dark-mode --text-muted:#9BA1A8 on --surface-1:#1A1F26 is not also affected. | HIGH |
| 14 | MEDIUM | Color Contrast | All portals (dark) | admin.html:78 | `--primary:#4A90D9` on `--surface-2:#242B36` | Computed ratio 4.26:1 — fails WCAG AA. Used for active nav links, link text, accent elements in dark mode. | Lighten to #5A9FE0 (≈4.7:1) or use #6BAAE4 (≈5.1:1). Recheck button text (white on primary) still passes after change. | MEDIUM |
| 15 | MEDIUM | Chart Accessibility | admin.html (rendered by public/js/revenue_tab.js) | revenue_tab.js:212–226 | `document.getElementById('rev-trend-body').innerHTML = monthly.map((mo, i) => { ... <div ...>` | Monthly Earnings Trend chart renders as raw divs with no role, no aria-label, no sr-only data table. Screen readers receive no data. | Add role="img" + aria-label="Monthly earnings trend chart" to the container; add a visually-hidden `<table>` with month/amount rows inside the same container (or append after). | MEDIUM |
| 16 | LOW | Form Labels | design.html, permitting.html | 21 (design), 17 (permitting) unlabeled | `<label>Project Name *</label><input type="text" id="proj-name"...>` | Project-modal and settings-modal inputs use sibling labels with no for=. Lower count than admin/splice but same root issue. | Add for= to each label matching each input id. | MEDIUM |
| 17 | LOW | Focus Indicator | splice.html | 5890–5924 | `function showModal(...)` | showModal() renders content and relies on autofocus attr on individual inputs (e.g., id="m-name" autofocus). autofocus works on first open but fails when modal is reused without page reload in some AT. No explicit focus() call post-render. | After innerHTML is set, call `host.querySelector('[autofocus], button, input, select, textarea')?.focus()` explicitly. | LOW |

---

## Negative Findings (Confirmed Clean)

- All 34 static modals (25 admin, 2 permitting, 2 design, 2 timeclock, 3 splice-via-showModal) have role="dialog", aria-modal="true", aria-labelledby pointing at valid title ids. Temp-Claude wave landed this correctly.
- All static modal close buttons have aria-label="Close dialog" with `<i aria-hidden="true">`. (Dynamic account modals are the exception — flagged in #4.)
- overlay_modal.js: full Tab focus trap, focus-return, ESC dismiss, MutationObserver cleanup. Fully compliant.
- dialog.js (confirmDialog/alertDialog): role, modal, labelledby, ESC, click-outside, initial focus. Compliant.
- admin.html showView() correctly toggles aria-selected on all nav tabs (lines 3092–3108). permitting/design sv() does not — flagged as #8.
- Skip-nav link present in admin, permitting, design, timeclock, launcher. visually hidden until focused; correct.
- All `<img>` tags across all portals have alt= text. FA icons use aria-hidden="true" consistently.
- login.html: both inputs have `<label for=>`. Error region has role="alert" + aria-live="assertive". Clean.
- launcher.html: `<main id="main-content">` landmark present, all buttons labeled, skip-nav wired. Clean.
- Undo bar in admin + timeclock: role="status" + aria-live="polite" + aria-atomic. Clean.
- No `outline:none` or `outline:0` in any audited file. Focus rings preserved (2px solid var(--primary) on inputs; browser default on buttons).
- timeclock.html: entry-modal and rnp-modal both have role="dialog", aria-modal, aria-labelledby, close button aria-label. ARIA attributes correct; focus trap is the missing piece (flagged in #3).
- cp-search input (admin line 1273): inside a display:none container — not reachable by keyboard/AT; not a live a11y issue.

---

## Coverage Gaps

Did not audit `splice_view.html` (public contractor token view — separate scope warranted for a dedicated audit). Did not audit JS modules beyond `overlay_modal.js`, `dialog.js`, and `revenue_tab.js` (checked for chart rendering only). Did not audit `public/css/` files beyond variables embedded in HTML `<style>` blocks. Dynamic content rendered by projects_tab.js, billing_tab.js, permits_tab.js (data-display rows) not checked for ARIA — lower risk as they are display-only not form controls. `customer.html` covered by prior wave (1 modal, fully compliant); not re-audited here.

---

=== WAVE 3 FE-A11Y AUDITOR A REPORT END ===
