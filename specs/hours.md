# SPEC — Hours capture: the linchpin (PLAN 2.6, System D)

> ✔ **RATIFIED** — Carter, 2026-07-13 (succession-sprint session, sample delivered). Verbatim rulings:
> "not everyone uses the job right which is why its important to log peoples hours on each actual job and cross refrence it to this and whats left over is marked as unbilled hours. Make sure people can add hours to their job after the fact but cant edit or take away without requesting a chaange through the app which goes to admins computer"
> Standing inputs already law: L-004 (job / area-WO / overhead attribution), L-014 (0.25 snap), the mini-jobs clock (2.15), the low-key time layer (draft-and-confirm, no stopwatch, private-by-default), manager overrides + notifications (permissions spec).

## The two-source truth model (Carter's design)
- **In-app attribution = billing truth.** The mini-jobs clock (2.15) + manual entries put hours on actual jobs. This is what billing consumes.
- **Workforce CSV = payroll truth.** Monthly export (sample: `timesheet_report_2026-06-01_thru_2026-06-30.csv`). Import parses the jobcode hierarchy — jobcode_1 company · _2 client ("Public Service Communication") · _3 program/EC ("RUS 515 (Reconnect)") · _4 area/SA ("Reynolds", "Knoxville") · _5 job/task ("Permitting", "WO #16298") — mapping to keystone entities via a **saved mapping table** (data not code; unmatched codes queue for admin mapping, never silently guessed).
- **Reconciliation per person-day:** CSV total vs in-app job-attributed total. **The leftover = UNBILLED HOURS** — a visible per-person-day bucket. Admin can later re-attribute unbilled hours to a job / area-WO / overhead; until then they count as cost (people were paid) and never as billable. Rows with jobcode_4 but no _5 auto-suggest area-WO attribution (L-004); "Miscellaneous" rows land straight in unbilled.
- **Negative deltas flag:** in-app hours EXCEEDING payroll hours for a person-day = anomaly (can't bill more than was worked) → confirm-loop queue.

## Append-only integrity (Carter's ruling)
- Employees can **ADD** hours to their jobs after the fact (manual entry stays first-class).
- Employees **CANNOT edit or delete** their own logged hours. Fixing a mistake = a **change request in the app** (what + why) → lands in the admin approval queue (notification center + the mobile Approve-hours tab). Admin approves → change applies, change-logged; denies → stays, with a note back.
- Managers/admins retain direct edit powers per the permissions spec (`hours.edit_subordinates` / `hours.edit_all`) — always change-logged + owner notified.

## Scope
- The clock + segments live in 2.15 (mini-jobs) — this spec adds: manual add-hours flow · the change-request flow + admin queue · Workforce CSV import (upload now; desktop watched-folder parse rides D-later) + jobcode mapping table · the reconciliation view (per person-day: payroll vs attributed vs unbilled) · the weekly confirm loop + anomaly queue · the 1099 daily card (L-009 one flow: clock + daily card together, mobile 2.14).
- Import fixture: the foreman gets the June sample with names/emails scrubbed; the raw file stays OFF the repo (PII).

## Done-when
- Import the June CSV → every row lands (mapped or queued-for-mapping); per person-day reconciliation shows payroll vs attributed vs unbilled; "Miscellaneous" rows sit in unbilled; a WO-only row suggests area-WO.
- Employee adds hours → appears; tries to edit/delete → blocked, offered the change request; request → admin queue → approve applies + logs + notifies.
- In-app > payroll day flags; all figures quarter-snapped; a no-permission user sees no one else's hours (wire-checked).

## VO lenses
Money adjacency (unbilled never reaches billing; reattribution is change-logged) · append-only enforced at the API (PUT/DELETE on own entries = 403, not hidden buttons) · import idempotent (re-upload same file ≠ double hours — hash the file + row identity) · mapping table only grows by admin action · L-014 snap on every path in this spec.
