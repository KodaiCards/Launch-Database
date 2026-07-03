# 13 — Files / photos / DWG / workspace — ✅ COMPLETE

> Mapped 2026-06-29. The file/attachment layer — and it's **six distinct file subsystems**. **Mystery SOLVED: `service-area-job-documents` lives in `project_documents.js`** (keystone doc routes). **Headline: O28 — the UPLOAD_DIR volume-mount risk is real, confirmed by a built-in health check; if unmounted in prod, ALL uploaded docs (incl 2GB DWG client deliverables) vanish on every redeploy.**

## The six file subsystems
| Subsystem | Module | Table(s) | Keyed to | Purpose |
|---|---|---|---|---|
| **Project/SA documents** | `project_documents.js` (465) | `permit_documents` (dual-keyed!) | legacy `project_id` OR keystone `service_area_job_id` | PDF/DWG/etc attachments. Legacy route 50MB; **keystone route 2GB** (DWG deliverables) + status/doc_type tags. |
| **Workspace (Drive-like)** | `folder_workspace.js` (1550) | `workspace_folders`/`workspace_files`/`workspace_folder_shares` | optional `project_id` | Personal + shared file tree (user/shared roots), per-user share permissions. Surfaced in client_portal_v2 (chunk 10). |
| **Field photos** | `project_photos.js` (389) | `project_photos` | legacy `project_id` | Geotagged field photos (gps_lat/lon/accuracy, caption, taken_at); storageKey `project-photos/<pid>/<id>`. |
| **DWG offline sync** | `dwg_sync.js` (368) + `dwg_two_way_sync.js` | `project_dwg_sync_state` (cursors) reads `permit_documents` | legacy `project_id` | Manifest + ETag/304 binary streaming + per-user sync cursors for the desktop/offline app (DWG/DXF only). Migration 0044. |
| **Installer downloads** | `downloads.js` (354) | filesystem (installers dir) | — | Serves the Electron DESKTOP-APP installers (`/api/downloads/manifest`, admin upload/delete). Ties chunk 19. NOT project files. |
| **File activity log** | `file_activity.js` (189) | (activity rows) | — | Activity feed for file ops. |

## ⭐⭐ O28 (HIGH — operational/data-loss): verify the UPLOAD_DIR volume mount in prod
- All uploads write to `uploadDir` = `process.env.UPLOAD_DIR` (keystone docs up to **2 GB** for DWG deliverables).
- **`GET /api/_debug/uploads` (admin) is a built-in detector** — compares files-on-disk vs `permit_documents` rows, reports orphan + **missing** files, and its own hint says verbatim: *"Files in DB but not on disk → Railway volume is NOT mounted at UPLOAD_DIR. Set UPLOAD_DIR to your volume mount path (e.g. /data/uploads) and redeploy."*
- **Risk (memory `project_documents_storage` CONFIRMED):** Railway containers are ephemeral; migrations + code redeploy frequently. If a persistent **volume is not mounted at UPLOAD_DIR**, every uploaded document/photo/DWG is **silently lost on the next redeploy** — these are real client + government (RUS) deliverables. **ACTION: run `/api/_debug/uploads` on prod (or check Railway volume config) to confirm `missing_file_count=0` + a volume is mounted.** Highest operational risk found tonight. → open_items O28.

## Findings
- **service-area-job-documents = project_documents.js** (chunk-05 mystery closed). `permit_documents` is the UNIFIED doc table, **dual-keyed** (`project_id` legacy / `service_area_job_id` keystone) — better than the hours split-brain (one table, two FK columns) but queries still must pick the column. Keystone route = 2GB + status/doc_type; legacy = 50MB.
- **O28 (high):** UPLOAD_DIR volume mount must be verified in prod or uploads vanish on redeploy. Built-in detector exists (`/api/_debug/uploads`).
- **Upload security is STRONG** (Wave 178): extension allowlist + MIME allowlist + **magic-byte verification** (reads first 12 bytes — a renamed `.exe` won't pass) + IDOR team-scope guards on every op + uploaded_by from session. One of the better-hardened areas.
- **Most file subsystems are legacy-`project_id`** (photos, dwg_sync, workspace folders) — only permit_documents has a keystone path. A cutover surface (O18 facet) but lower stakes than money/hours.
- **TWO file models coexist:** `permit_documents` (attachments) vs `workspace_folders/files` (Drive-like). Possible future consolidation; low priority.
- `downloads.js` = desktop installer serving (not docs) → ties chunk 19 desktop.

## Reapproach-if
- Chunk 19 (desktop): dwg_sync (manifest/ETag/cursors) + downloads.js (installers) are the desktop app's backend — cross-map there. The offline-sync (project_dwg_sync_state) is how field DWG works offline.
- Chunk 10 reapproach: client_portal_v2 `workspace-files` + `documents` read `workspace_folders` + `permit_documents` — the client doc-exchange uses these tables (now mapped).
- Chunk 18 (migrations): confirm permit_documents has BOTH project_id + service_area_job_id columns (dual-key); migration 0044 (dwg sync); workspace_* schema.
- **O28 is verify-now-class** — surface to Carter early; data-loss risk on real deliverables. Could run /api/_debug/uploads via the live preview harness if standing DB access permits.