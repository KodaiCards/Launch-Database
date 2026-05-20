# Cascade Picker UX Spec — Phase B1 (Timeclock)

## Surfaces

| Surface | Prefix | Elements |
|---|---|---|
| Clock-in card | `ci` | `#ci-client`, `#ci-program`, `#ci-sa`, `#ci-job` (input+`#ci-job-list` datalist) |
| Switch modal | `sw` | `#sw-client`, `#sw-program`, `#sw-sa`, `#sw-job` (input+`#sw-job-list` datalist) |
| Entry modal | `entry` | `#entry-client`, `#entry-program`, `#entry-sa`, `#entry-job` (input+`#entry-job-list` datalist) + `#entry-resolved-project-id` (hidden) |

## 4-step Fetch Sequence

1. **Client** — populated from `projectsCache` (active leaves) + `projectsCacheWithCompleted` on `mountCascade`. No API hit.
2. **Program** — `GET /api/engineering-contracts?client_id=X` → filter unique `program` values. Cached in `_cascadeEcCache`.
3. **Service Area** — `GET /api/clients/:id/service-areas` → filter by EC ids matching chosen program. Cached in `_cascadeSaCache`.
4. **Job** — `GET /api/projects?parent_id=<sa_folder_id>&leaves_only=true&limit=all[&status=active]`. Cached in `_cascadeJobCache`.

## sessionStorage Key Convention

```
lf_tc_{prefix}_{field}
```

Fields: `client`, `program`, `sa_id`, `job`.

Cleared on `cascadeChanged()` downstream tiers, and on `signOut()`.

## Resolve-or-Create Flow

On submit (`clockIn`, `doSwitch`, `saveEntry`):

1. `resolveOrCreateFromCascade(prefix)` validates all four fields filled.
2. Reads `data-sa-uuid` from selected `<option>` in `#prefix-sa` (= `ec_service_areas.id` / `rollup_key`).
3. `POST /api/projects/resolve-or-create { client_id, program, service_area_id, job_name }` → returns `{ id, name, created }`.
4. Returns resolved project id; caller passes it to the clock-in / switch / save API.

Edit modal fallback: if cascade is incomplete when saving (e.g., user opened edit but didn't change cascade), `#entry-resolved-project-id` (pre-filled with existing `project_id` on `openEditEntryModal`) is used as fallback.

## Visual Feedback

- Disabled elements: `opacity: 0.45; cursor: not-allowed`.
- `#prefix-job-hint`: populated as cascade-hint text when SA has no active jobs.
- `#cascade-error` class on validation failures.

## Phase B2 Extension

Same engine (`mountCascade`, `cascadeChanged`, `resolveOrCreateFromCascade`) applies to design.html (prefix `dp`) and permitting.html (prefix `pp`) — different prefix, same DOM shape and JS API.
