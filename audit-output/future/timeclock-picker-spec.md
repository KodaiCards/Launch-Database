# Timeclock Project Picker — Rebuild Spec

> **Status:** Design captured 2026-05-13. Build deferred until Phase 2 (projection wave) and Wave 2 FE-Crit remainder ship.
> Daily-use bug + UX rework. Single source of truth for the picker rebuild.

---

## 1. User's complaint (verbatim 2026-05-13)

> "In the timeclock the projects dont come up properly, It picks a leaf from existing projects when really it needs to pick creatia and the logic matches it. For example Job would be the available jobs and client, then optionally add the different WO# that populate from that client, jobs that populate from that client"

## 2. Today's behavior (what's wrong)

**Files:** `timeclock_module.js` (~791 LOC), `public/js/project_picker.js`, `public/timeclock*.html` and the embedded picker in `public/admin.html`.

Today's flow:

1. User opens timeclock → loads ALL projects user can see into a global `projectsCache`
2. UI shows a single `<select id="ci-project">` dropdown populated with leaf-only projects (rollup containers excluded)
3. User optionally filters by client first, which narrows the project list
4. User picks a leaf project → `entryProjectChanged()` fires → job dropdown populates based on the picked project's team
5. User picks a job → clocks in

**Why it's wrong for daily workflow:**
- User has to find the EXACT leaf project. With many projects per client, the dropdown is long and unstable.
- If the right project doesn't exist yet, the user has to leave timeclock, create a project in admin, then return. Friction kills daily clock-in time.
- The mental model is inverted — workers think "I'm doing Inspection work on the WHE-2024-001 work order for PSC," not "I am clocking into project UUID xyz."

## 3. Standing user decisions (2026-05-13)

1. **Auto-create with existing rollup structure for organization.** When `(client, job, WO#)` selected and no matching project exists, system auto-creates a new leaf project, slotted into the appropriate rollup containers (client-level → team-level → service-area-level whatever exists for this client). Doesn't require the user to leave timeclock.
2. **WO# is optional.** Blank WO# allowed. Hours land in a "no WO#" project per `(client, job)` combo. Common for overhead, training, internal work.
3. **One Job dropdown** filtered by the selected client. NOT two separate filters.
4. **Dropdown sources (2026-05-13 follow-up):**
   - **Client dropdown** — pulled from admin clients (active clients the user has access to).
   - **Job dropdown** — pulled from all jobs that apply to the selected client (filtered by client's program / EC / job availability).
   - **WO# dropdown** — pulled from WO#s under the selected client. **Display format: `{service_area_name} - {wo_number}` (e.g., `"Crossroad School - 16300"`).** Service area is the WO's grouping context; showing both helps the user pick the right WO# at a glance when one client has many.

## 4. New behavior — picker UX

Replace the project leaf-select with three cascading dropdowns:

```
┌─ Clock In ─────────────────────────────────────────────────────┐
│                                                                │
│  Client:  [PSC ▾]                       ← Required             │
│  Job:     [Inspection ▾]                ← Required             │
│  WO# :    [Crossroad School - 16300 ▾]  ← Optional (blank OK)  │
│                                                                │
│  ▶ Will clock into: PSC / Inspection / Crossroad School-16300 │
│    (auto-created if needed)                                    │
│                                                                │
│  [Clock In]                                                    │
└────────────────────────────────────────────────────────────────┘
```

- **Client dropdown:** lists clients user has access to. Source = admin clients table (same as the existing client filter).
- **Job dropdown:** lists jobs available for the selected client (filtered by program / EC / job availability). Disabled until client is picked.
- **WO# dropdown:** lists work orders under the selected client. **Each option displays as `"{service_area_name} - {wo_number}"`** (e.g., `"Crossroad School - 16300"`). Source: join `engineering_contracts` (or `service_areas`) with WO# table, scoped to selected client. Includes blank/"— No WO# —" option. Disabled until client is picked.
- **Will clock into preview line:** real-time text showing the resolved project — name, status (existing vs new), rollup ancestors.

## 5. Resolution logic — `resolveOrCreateProject({client_id, job_id, work_order_number})`

New server-side helper. Called by `POST /api/timeclock/clock-in` and the existing `POST /api/timeclock/switch`.

```
1. Look up existing leaf project where:
   - client_id matches
   - job_id matches (via projects.job_id or projects.team aligning with job's team)
   - work_order_number matches (or both NULL/blank)
   - is_rollup = FALSE
   - status IN ('active', 'in_progress')   // not 'completed' / 'billed' / 'archived'

2. If exactly 1 match → return that project_id. Done.

3. If 0 matches → auto-create:
   a. Resolve EC: find the active engineering_contract for (client_id, program) where program
      matches the job's program_scope. If multiple, prefer the one matching work_order_number;
      else most-recently-started.
   b. Find rollup container chain for this (client, EC, team):
      - client rollup (is_rollup=TRUE, rollup_key='client', client_id matches)
      - team rollup (rollup_key='team', team matches job.team)
      - service_area rollup (rollup_key='service_area') if EC has service areas configured
      Create any missing rollup containers (existing patterns: routes/projects.js
      bulk_create_projects style). All rollup containers get is_rollup=TRUE.
   c. Create the leaf project under the appropriate parent rollup:
      - name = generated from "{client.name} {job.name}{wo_suffix}" (or whatever the user-facing
        convention is — e.g., "PSC Inspection — SE-2025-014" or "PSC Inspection — General")
      - client_id = client_id
      - job_id = job_id
      - team = job.team
      - work_order_number = work_order_number (or NULL)
      - status = 'active'
      - billing_type, billing_rate, billing_cadence: inherit defaults from EC or job-type defaults
      - parent_id = lowest-level rollup
      - engineering_contract_id = resolved EC
   d. Return the new project_id.

4. If 2+ matches → pick the most-recently-active OR surface a UI conflict.
   PREFER: return the most recently-updated active project; log a warning to audit_logs
   for admin review. Do NOT prompt the user (kills the daily workflow).
```

## 6. Endpoints affected

- **NEW:** `POST /api/timeclock/resolve-or-create-project` — admin/user-gated. Body: `{client_id, job_id, work_order_number}`. Response: `{project_id, project_name, was_created: bool, rollup_path: ['PSC', 'Construction', 'East Service Area', 'PSC Inspection — SE-2025-014'], action_summary: 'Existing project found' | 'Auto-created project under PSC / Construction'}`.
- **MODIFY:** `POST /api/timeclock/clock-in` — now accepts `{client_id, job_id, work_order_number}` instead of (or in addition to, for backward compat) `{project_id, job_id}`. Internally calls resolve-or-create. Returns the resolved project_id + a `created` flag for UI feedback.
- **MODIFY:** `POST /api/timeclock/switch` — same shape change.
- **MODIFY:** `GET /api/timeclock/recent` — already returns project_id + job_id + client_name + work_order_number. No change needed; quick-clock buttons still work.
- **NEW:** `GET /api/timeclock/picker-data?client_id=X` — returns `{jobs: [...], work_orders: [...]}` for the client. Single call to populate both filtered dropdowns.

## 7. Frontend changes

- **Remove:** `populateProjectSelect()` and the `<select id="ci-project">` element from the clock-in UI.
- **Add:** Three new `<select>` elements (`ci-client`, `ci-job`, `ci-wo`) with cascading population.
- **Add:** "Will clock into" preview computed reactively.
- **Modify:** `ciClockIn()` to send `{client_id, job_id, work_order_number}` instead of `project_id`.
- **Keep:** Quick-clock recent buttons (they already use `project_id` + `job_id` directly).
- **Preserve:** Manual entry tab uses the same pattern.

## 8. Edge cases + open questions

- **What if user clocks in to a tuple that creates a project, then SWITCHES to a different job with same client+WO#?** Two leaf projects under the same rollup, distinguished by `job_id`. Fine, intentional.
- **What if a project exists but has `status = 'completed'`?** Resolution treats it as no-match → auto-create. Old completed work doesn't accumulate new hours. Confirm with user.
- **What if `(client, job)` has no EC for the program?** Auto-create still needs an EC linkage for billing rollup integrity. Options: (a) create the project with `engineering_contract_id = NULL` (already supported per migration 0023), surface a warning chip; (b) refuse the clock-in with "No active EC for this client + program. Set one up first." Recommend (a) — don't block daily clock-in. Surface in admin alerts.
- **Audit trail:** Auto-create writes an `audit_logs` entry with `actor=user, action='timeclock_autocreate_project'`. Admins can spot accidental project creation.
- **Permission:** Can any user with timeclock access auto-create projects? Or only admin/manager? Probably: yes any user, since the daily friction is the point. But surface in admin alerts.
- **Rollback:** What if auto-create fails mid-flight (e.g., EC lookup OK, rollup creation fails)? The whole resolve-or-create call must be wrapped in a transaction; partial creates are bugs.

## 9. Pre-build checklist

- [ ] Confirm `jobs` table has the right shape: does each job row have a `team` column? `program_scope`? Verify via schema audit.
- [ ] Confirm `engineering_contracts.work_order_number` is the right WO# source (Wave 7f3b6cb added EC WO# + service areas) — or is there a `projects.work_order_number`? Probably both — clarify hierarchy.
- [ ] Decide: rollup path generation defaults (which rollup levels are always created vs optional)
- [ ] Test plan: unit test for `resolveOrCreateProject` covering match / no-match / multi-match
- [ ] Decide whether to keep the OLD `project_id`-based clock-in API path for backward compat or hard-cutover

## 10. Sequencing

**Recommended pipeline (after current Phase 2 projection wave + Wave 2 FE-Crit remainder land):**

1. **Discovery wave** — short read of jobs / projects / engineering_contracts schemas, confirm field availability for the resolution logic.
2. **Backend wave** — implement `resolveOrCreateProject` helper, new `/api/timeclock/picker-data` + `/api/timeclock/resolve-or-create-project` endpoints, modify clock-in/switch endpoints. Full audit/verify/fix pipeline.
3. **Frontend wave** — rebuild picker UI with cascading dropdowns + preview line. Update manual-entry tab same shape. Audit/verify/fix.
4. **Polish + smoke test wave** — admin alert surface for auto-create events, audit trail rendering, edge cases.

**Effort estimate:** 3-4 fix-agent dispatches across the pipeline. ~1 week of orchestration at current pace.

=== TIMECLOCK PICKER SPEC END ===
