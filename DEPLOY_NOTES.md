# Deploy Notes — when you're ready

These are the manual steps to bring this session's waves live in production. NOT done yet. Run when convenient.

## 1. Run migrations on Railway (in order)

Numbered 0046 through 0054. Each is idempotent (CREATE TABLE IF NOT EXISTS / ALTER TABLE ADD COLUMN IF NOT EXISTS pattern) so re-running is safe.

| Migration | Adds | From wave |
|---|---|---|
| 0046_audit_log.sql | `audit_log` table + DELETE trigger | 38 |
| 0047_client_portal_v1.sql | `client_organizations`, `client_users`, `client_tokens` + `engineering_contracts.client_org_id` | 39 |
| 0048_audit_log_retention.sql | `audit_log.archived_at` column + `audit_retention_config` singleton | 47 |
| 0049_client_documents_approvals.sql | `client_documents`, `client_approvals` | 49 |
| 0050_audit_log_drop_immutability.sql | drops DELETE trigger (makes audit_log fully editable/deletable per your 5/28 directive) | 51 |
| 0051_dwg_two_way_sync.sql | `dwg_canonical_files`, `dwg_versions`, `dwg_staging` — SUPERSEDED by 0053, can skip if you want | 52 |
| 0052_project_photos.sql | `project_photos` | 55 |
| 0053_folder_workspace.sql | `workspace_folders`, `workspace_files`, `workspace_file_versions`, `workspace_folder_shares` + 2 shared root rows | 57 |
| 0054_workspace_trash.sql | `deleted_at` + `deleted_by` columns on workspace_files/folders + trash indexes | 68 |

Run from Railway shell:
```
npm run migrate
# or whatever the migration runner is — check package.json
```

## 2. Drop the doc-scanner vendor libs

Sandbox couldn't fetch them (CDN proxy blocked). You need to manually download + commit:

- `public/photos/vendor/opencv.min.js` (~10MB) — from https://docs.opencv.org/4.x/opencv.js OR https://cdn.jsdelivr.net/npm/@techstark/opencv-js@latest/dist/opencv.js
- `public/photos/vendor/jscanify.min.js` (~50KB) — from https://cdn.jsdelivr.net/npm/jscanify@latest/dist/jscanify.min.js

Until these land, the doc scanner UI (`/photos/scanner.html`) will load but edge detection won't work.

## 3. Optional env flags on Railway

| Flag | What it does |
|---|---|
| `AUDIT_AUTO_ARCHIVE_ENABLED=true` | Daily job that soft-archives audit_log rows older than 730 days (RUS retention) |
| `WORKSPACE_AUTO_PURGE_ENABLED=true` | Daily job that hard-deletes workspace trash items older than 30 days |
| `UPLOAD_DIR=/path/to/storage` | Where multer puts uploaded files (defaults to `./uploads`; you probably want a Railway volume mount) |

Default = both off if not set. Safe to leave off until you want them.

## 4. Electron desktop app build (optional, internal beta)

```
cd desktop
npm install
npm run dist        # produces dist/Launch Fiber Desktop Setup 0.1.0.exe
```

Installer is **unsigned** — Windows SmartScreen will warn users on first run. Click "More info" → "Run anyway" to install. That's fine for internal use; we'll sign when external folks need it.

Configure backend URL via env var or the login form on first launch.

## 5. PSC onboarding (when you're ready to flip the switch)

```
node scripts/onboard_client.js \
  --name "PSC" --short-name "psc" --theme-color "#1B5FA0" \
  --user "carter@psc.com:Carter Trantham:primary" \
  --user "ops@psc.com:Ops Team" \
  --link-ec-program "rus" \
  --dry-run
```

Drop `--dry-run` when you want it to actually fire. Prints magic-link URLs once — never stored, never recoverable. Copy and send via your secure channel.

Full runbook at `docs/client_portal_onboarding.md`.
