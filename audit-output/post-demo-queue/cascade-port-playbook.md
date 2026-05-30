# Cascade port playbook (W221)

**Goal:** Port admin / design / permitting from inline cascade implementations
to the shared `public/js/project_cascade.js` module shipped in W212.

**Verdict:** Port in this order — **design → permitting → admin**. SKIP
timeclock. Pre-demo deferral of admin port was correct (highest entanglement
risk pre-Monday).

---

## Module API recap

`/home/user/Launch-Database/public/js/project_cascade.js` (584 lines, vanilla
JS, no build step). Exposes:

```js
window.ProjectCascade = {
  mount({ container, prefix, mode, onChange, autoName }) → handle,
  resolveOrCreate(state) → Promise<{ project_id }>,
  _clearCaches(),
};
```

Cascade ladder it owns: Client → Program → EC (or no-EC mode) → Service Area
(dropdown OR free-text) → Job (typeahead). Consumer page provides the DOM
IDs (prefixed e.g. `proj-` / `dp-` / `pp-`) and listens to `onChange` for
state updates. Module-level caches `_ecSaCache` + `_jobsCache` survive
mount/unmount within one page load.

The module is functionally complete and tested. Risk is in entanglement
with each portal's surrounding modal state, not in the module itself.

---

## Per-portal port analysis

### Design portal (`public/design.html`)

| Aspect | Status |
|---|---|
| **Difficulty** | LOW |
| **Cascade DOM IDs** | `dp-client`, `dp-program`, `dp-ec`, `dp-service-area`, `dp-sa-label`, `dp-job-select` |
| **Job picker style** | Plain `<select>` (`dp-job-select`) — matches module's expected `<select>` job picker shape closely (the module wants typeahead but adapter can wrap a select) |
| **Service Area picker** | `<datalist>` typeahead (`dp-sa-list`) — `dp-service-area` is `<input type="text" list="dp-sa-list">` |
| **Entanglements** | Cascade handlers `dpEcChanged()`, `dpCascadeJobChanged()` are inline in `design.html` JS. Modal-state (free-text overrides, edit-mode behavior) is moderate. |
| **Lines touched (est)** | ~200-300 in `design.html`, mostly removal of inline cascade handlers |
| **Recommended approach** | (a) Add `<script src="/js/project_cascade.js" defer>` to head. (b) Replace `<select>` job picker DOM with the module's expected `{p}job-input` + `{p}job-dropdown` + `{p}job` triple OR pass `ids` override map keeping `<select>`. (c) Remove inline `dpEcChanged()` / `dpCascadeJobChanged()` handlers. (d) `ProjectCascade.mount({ prefix: 'dp-', onChange: dpCascadeChanged, autoName: false })` on modal-open. (e) Verify free-text SA path still works via no-EC mode. |

### Permitting portal (`public/permitting.html`)

| Aspect | Status |
|---|---|
| **Difficulty** | LOW (near-identical to design) |
| **Cascade DOM IDs** | `pp-client`, `pp-program`, `pp-ec`, `pp-service-area`, `pp-sa-label`, `pp-job-select` |
| **Job picker style** | Plain `<select>` (`pp-job-select`) — same as design |
| **Service Area picker** | `<datalist>` typeahead (`pp-sa-list`) — same as design |
| **Entanglements** | `ppEcChanged()`, `ppCascadeJobChanged()` inline handlers. Slightly different from design due to potential-permit-specific fields (RNP/RUS work order #s). |
| **Lines touched (est)** | ~200-300, similar to design |
| **Recommended approach** | Mirror design's port verbatim, swap prefix `dp-` → `pp-`. Verify potential-permit-specific fields are NOT lost (they're outside cascade scope — should be untouched, but verify). |

**Cross-cutting design + permitting:** both portals' SA pickers use HTML
`<datalist>` typeahead while the module ships with a custom dropdown
typeahead (`{p}job-input` + `{p}job-dropdown` + hidden `{p}job`). The
module's job picker is more sophisticated; design + permitting's
`<datalist>`-based SA picker is simpler. The cascade module SHOULD work
with `<datalist>` for SA (the SA is just an `<input>` either way — the
`<datalist>` is a hint, not a constraint). VERIFY at port time:
ProjectCascade's SA logic doesn't require the `<datalist>` to be empty
or populated in a specific way. If conflict → pass override IDs map.

### Admin portal (`public/admin.html`)

| Aspect | Status |
|---|---|
| **Difficulty** | HIGH |
| **Cascade DOM IDs** | `proj-client`, `proj-program`, `proj-ec`, `proj-service-area`, `proj-sa` (`<select>` for EC mode), `proj-job-input`, `proj-job`, `proj-job-dropdown` |
| **Job picker style** | Inline custom typeahead with hidden input — MATCHES module's expected shape exactly (this is what `project_cascade.js` was modeled after) |
| **Service Area picker** | TWO modes: `<select id="proj-sa">` in EC mode, `<input id="proj-service-area">` free-text in no-EC mode. Toggled by `proj-ec-row` / `proj-no-ec-row` containers. |
| **Entanglements** | HIGH — `projClientChanged()`, `projEcChanged()`, `projSaChanged()`, cascade name auto-fill via `__projNameManuallyEdited` flag (Wave 1B feature), edit-mode no-clobber semantics, edit-modal load via `editProject()`, `loadExistingProjectsForClient()` modal-internal picker, free-text SA debounce (250ms). |
| **Lines touched (est)** | ~500-800 in `admin.html`, plus modifying or removing inline cascade handlers |
| **Risk** | The admin modal is the most complex consumer. Wave 1B fixes (dark-mode tokens, cascade auto-name, project list breadcrumb) are LIVE in production and Carter notices regressions immediately. |
| **Recommended approach** | LAST. Port design + permitting FIRST as validation that the module API works in production. THEN port admin with extreme care: dedicated wave, full RT, manual Carter walkthrough before merge. |

### Timeclock portal (`public/timeclock.html`) — SKIP

| Aspect | Status |
|---|---|
| **Difficulty** | LOW but ZERO VALUE |
| **Cascade DOM IDs** | `entry-client/program/sa/job`, `ci-client/program/sa/job`, `sw-client/program/sa/job` |
| **Cascade instances per page** | 3 (entry, clock-in, switch) |
| **Current abstraction** | Already abstracted internally via prefix-based `cascadeChanged(prefix, tier)` handler (`public/timeclock.html:1550`). Three instances share one handler. |
| **Why skip** | Porting timeclock to ProjectCascade would be re-abstraction (module vs current prefix-pattern). No bug fix. No behavior change. Pure churn risk. |
| **Recommendation** | SKIP. Revisit only if timeclock acquires a real bug whose fix benefits from ProjectCascade's auto-name / autoNamesake semantics. |

---

## Cross-cutting risks

### Typeahead vs `<datalist>` decision

The module's SA picker treats `{p}service-area` as a plain `<input>`. It
manipulates the input's value + listens to input events. The presence of
a `<datalist>` for design + permitting is browser-side suggestion only;
should not interfere with the module's behavior.

**Verify at port time:** the module doesn't fight the `<datalist>`
suggestions. If it tries to .value the input to a known SA name from its
cache, the datalist suggestion popup might show; harmless if so.

**Job picker:** design + permitting use `<select>`. Module wants
`{p}job-input` + `{p}job-dropdown` + hidden `{p}job`. To port without
changing UX, two options:

1. **(Recommended)** Change design + permitting job picker DOM to match
   the module's expected triple. Larger DOM diff but smaller behavioral
   diff (job picker behavior becomes admin-style).
2. **(Lower diff)** Pass `ids` override map to ProjectCascade.mount() to
   tell it the job picker is a `<select>` and have the module adapt.
   Requires module support for select-style job picker which may not
   exist (verify by reading the module's `_resolveIds()`).

Recommendation: option 1 — change DOM, get behavior parity. Admin port
is easier this way (admin already uses the triple) and design +
permitting users get the upgraded typeahead UX.

### Wave 1B feature parity

Admin's Wave 1B locked these behaviors:

- Auto-name `{SA} — {Job}` unless user manually edited (tracked via
  `__projNameManuallyEdited` window flag)
- Edit-mode no-clobber (don't auto-name when loading existing project)
- Free-text SA debounce 250ms to prevent name flicker

The ProjectCascade module exposes `autoName` option in `mount()` but the
specifics (manual-edit tracking, edit-mode detection, debounce) live in
the consumer page. Admin port MUST preserve all three. Recommend a
dedicated RT pass on admin's name-field behavior post-port.

---

## Sequencing recommendation

| Wave | Portal | Risk | Validates module API for |
|---|---|---|---|
| CP-1 | Design | LOW | The module works in a non-admin consumer at all |
| CP-2 | Permitting | LOW | The module works with two consumers loaded (cache behavior) |
| CP-3 | Admin | HIGH | The complex edit-mode + auto-name path — last because of demo-blocker risk |
| — | Timeclock | SKIP | (no port — already abstracted internally) |

Land each wave with: dedicated branch, manual Carter spot-check before
merge, Playwright cascade specs green on the post-port HEAD.

---

## Why pre-demo admin deferral was correct

Carter's agent flagged admin port "too risky pre-demo" in W212. That call
was correct:

- Admin modal touches PROD-critical project-creation surface
- Wave 1B features (auto-name, edit-mode no-clobber) shipped in spring
  2026; Carter would notice any regression within minutes
- The four Monday-demo flows (admin projects, design/permitting pipeline,
  timeclock/hours, client portal) all walk through the admin Projects
  modal — a busted cascade kills all four

Post-demo (this queue), admin port is fine because: (a) demo pressure
relieved, (b) design + permitting port will have validated the module
API in production, (c) we can take a full RT-pair cycle on admin port
without timeline pressure.
