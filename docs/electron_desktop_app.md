# Launch Fiber Desktop — Build, Deploy & Troubleshoot Guide

**Version:** 0.1.0 (Internal Beta)  
**Platform:** Windows 10+ (x64)  
**Status:** Scaffold + Login Flow complete; Sync engine in progress

Launch Fiber Desktop is an Electron-based Windows desktop application that connects to the launch-database backend. It provides folder-workspace synchronization, session persistence, and project/workspace tree navigation for Launch Fiber Services operations teams.

---

## What the App Does

**Core Capability:** Connect to a Launch Fiber backend (launch-database) and sync engineering project files & metadata between local folders and the cloud workspace.

**v0.1.0 Scope:**
- Email/password login with configurable backend server URL
- Session persistence (stored locally via `electron-store`)
- Project and workspace tree display
- 5-second countdown sync trigger on network reconnect
- 15-minute automatic sync interval (when logged in + folder selected)
- Conflict detection (renames to `.conflict-<timestamp>.<ext>`)
- Activity log (last 200 events, persisted)

**v0.2+ (Future):**
- Full folder sync engine (push/pull with file watching via `chokidar`)
- Conflict resolution UI
- Code signing (SmartScreen bypass for enterprise deployments)
- Auto-update mechanism

---

## Prerequisites

### System Requirements

- **Windows:** 10 or later (x64 only)
- **Node.js:** 20.x LTS or later (for development builds only)
- **Disk:** ~200 MB for app + dependencies

### Build Machine

For developers building the installer:
- Node.js 20+ with npm 9+
- Windows 10+ (x64)
- Administrator access (optional, for code-signing setup)

### Backend

The app expects a running launch-database server with these endpoints:
- `POST /api/auth/login` — accepts `{ username, password }`, returns `{ user: {...} }` + `Set-Cookie`
- `GET /api/projects?leaves_only=true` — returns `{ success, projects }`
- `GET /api/workspace/tree?root=<root>` — returns `{ success, tree }`

Default backend URL: `https://launchdb-production.up.railway.app` (configurable at login).

---

## Development Setup

### Clone & Install

```bash
cd Launch-Database/desktop
npm install
```

Dependencies installed:
- `electron@^33.0.0` — Electron framework
- `electron-builder@^25.0.0` — NSIS installer generation
- `electron-store@^10.0.0` — IPC-safe persistent storage
- `chokidar@^4.0.0` — File system watcher (for sync engine)
- `form-data@^4.0.0`, `node-fetch@^2.7.0` — Multipart requests + fetch polyfill

### Run Development

```bash
npm start
```

The app launches in a 1200×800 window. On first run, shows the login screen.

**Enable DevTools (for debugging):**
Uncomment line 30 in `main.js`:
```javascript
mainWindow.webContents.openDevTools();
```

### Dev-Mode Environment

Override the backend server:
```bash
BACKEND_URL=http://localhost:3000 npm start
```

---

## Build for Production

### Create Unsigned Installer

```bash
npm run dist
```

Output: `dist/Launch Fiber Desktop Setup 0.1.0.exe` (~150–200 MB)

**Time:** 1–2 minutes on a modern machine.

**What it does:**
1. Bundles Electron + all dependencies
2. Runs `electron-builder` with NSIS (Windows installer) target
3. Generates one-click + custom-path installation options

### Installer Behavior

When users run the `.exe`:

1. **SmartScreen Warning (unsigned):**
   - Windows Defender SmartScreen shows: "Windows protected your PC"
   - User clicks "More info" → "Run anyway"
   - (Code signing in v1+ eliminates this step)

2. **Installation Options:**
   - Start menu shortcut created
   - Desktop shortcut option (default: enabled)
   - Installation directory configurable (default: `C:\Program Files\Launch Fiber Desktop`)
   - Per-machine vs per-user (default: per-user, `%LOCALAPPDATA%`)

3. **Post-Install:**
   - App launches automatically (default, can be unchecked)
   - Session stored in user's `electron-store` (encrypted if configured)
   - Future launches respect remembered session

---

## Distribution & Deployment

### For Internal Teams

1. **Store & Share:**
   - Upload `.exe` to shared network drive or S3
   - Share download link with crew
   - Instruct: "Run installer, click 'Run anyway' on SmartScreen"

2. **Silent Installation (Admin Deployment):**
   ```batch
   "Launch Fiber Desktop Setup 0.1.0.exe" /S /D=C:\Program Files\Launch Fiber Desktop
   ```

### For Enterprise / SmartScreen Bypass

**v0.1 Status:** Not applicable (app is unsigned)

**v1+ Roadmap:**
- Obtain EV code-signing certificate (Sectigo / Digicert / GlobalSign recommended)
- Add to `desktop/package.json` `build.win.certificateFile` + password
- Rebuild with `npm run dist` — installer will be signed
- SmartScreen learns the publisher over 48 hours; warning disappears for reputation-based SmartScreen
- Alternatively, deploy via SCCM/Intune → SmartScreen trust-list on enterprise domain (no user prompt)

---

## Auto-Updater (v0.2+)

**v0.1 Status:** Not yet configured. Manual download required for updates.

**Planned for v0.2:**
- Electron's `electron-updater` with GitHub releases as artifact host
- Check for new versions on app startup
- Download in background, prompt user to restart + install
- Seamless self-update (no .exe re-download needed)

---

## Login Flow & Configuration

### First-Time Login

1. App launches → shows login form
2. User enters:
   - **Email/Username** (from launch-database)
   - **Password**
   - **Backend Server URL** (optional; default shown)
3. Submits → app calls `POST /api/auth/login`
4. On success:
   - Session token stored in `electron-store` (under key `session`)
   - User is redirected to main workspace view
   - Backend URL also stored (key `backendUrl`)

### Session Persistence

- Session stored in `electron-store` (default location: `%APPDATA%\launch-fiber-desktop\`)
- Encrypted if `electron-store` is configured with a secret key (not yet implemented; v0.1 plain-text)
- On app restart: checks for stored session; if valid, skips login screen
- Token **does not expire** in v0.1 (session lifetime = until manual logout)

**v0.2+:** Implement refresh-token rotation + expiry handling

### Configurable Backend Server

Users can override the backend URL at login time. App stores the choice and reuses it on subsequent sessions.

**Programmatic override (dev):**
```bash
BACKEND_URL=https://staging.launch-fiber.com npm start
```

---

## Sync Engine & Workspace

### How Sync Works (v0.1)

1. **User selects a local folder** (via "Pick folder" dialog)
   - Stored in `electron-store` under `localRootPath`
2. **Manual sync trigger** (button or keyboard shortcut)
   - Calls `ipcMain.handle('sync:now', ...)`
   - Instantiates `SyncEngine(backendUrl, sessionCookie)`
   - Runs `syncEngine.runSync(localRootPath)`
3. **Auto-sync interval** (every 15 minutes when logged in)
   - Background `setInterval` at line 286 in `main.js`
   - Runs sync + sends `sync:completed` message to renderer

### Sync Countdown (5s after Network Reconnect)

When the network goes offline → online:
1. Renderer detects and calls `api.sendSyncOnline()`
2. Main process receives `sync:online` event
3. Shows toast in app: "Syncing in 5s... (click to cancel)"
4. After 5s countdown, runs sync automatically
5. Toast dismissed when sync completes

### Sync Status & Activity Log

```javascript
// Check current sync status
const status = await api.syncGetStatus();
// Returns: { lastSyncAt, isRunning, errors, conflicts, events }

// events = array of last 200 sync operations (FIFO)
```

Activity log is persisted to `electron-store` under key `syncEvents` (or similar).

### Conflict Resolution (v0.1)

When a file exists locally AND on backend with different contents:
- **Strategy:** Rename local file to `.conflict-<timestamp>.<ext>`
  - Example: `project.json` → `project.conflict-2026-05-28T142350Z.json`
  - Backend version written to original name
- **Resolution:** User manually reviews `.conflict-*` file + merges if needed
- **v0.2+:** UI for side-by-side conflict viewer + merge assist

---

## Architecture & Key Files

### Main Process (`main.js`)

| Responsibility | Details |
|---|---|
| Window creation | `createWindow(isLogin)` — creates main BrowserWindow with context isolation |
| Menu setup | File → Exit, Help → About (stub) |
| IPC handlers | Auth (login/logout/get-session), Workspace (list-projects, fetch-tree), Sync (pick-folder, run-now, status) |
| Auto-sync loop | 15-min interval at line 286; stores session from `electron-store` |
| Lifecycle events | `app.on('ready')`, `app.on('window-all-closed')`, `app.on('before-quit')` |

**Context isolation:** Enabled. Renderer cannot access Node APIs directly; must use IPC bridge.

### Preload (`preload.js`)

Exposes safe IPC methods to renderer via `window.api` object:
- `login(credentials)` → `auth:login` IPC
- `logout()` → `auth:logout` IPC
- `syncNow()` → `sync:now` IPC
- `onSyncCompleted(callback)` → listens to `sync:completed` IPC events

### Renderer (`renderer/login.js`, `renderer/app.js`)

| File | Purpose |
|---|---|
| `login.html` + `login.js` | Email/password form, backend URL input, login error display |
| `index.html` + `app.js` | Main workspace view, project tree, sync button, activity log |
| `app.css` | Native-looking UI (system font stacks, flat design) |

### Sync Engine (`sync/engine.js`)

Not fully documented here (in-progress feature). Will handle:
- File tree walking (`chokidar` watchers)
- Diff computation (local vs backend)
- Push & pull operations
- Conflict detection & renaming

---

## Debugging & Troubleshooting

### Common Issues

#### App crashes on startup

**Symptom:** Blank window, no error visible, app closes after 2–3 seconds

**Causes:**
- Corrupted `electron-store` data
- Missing backend connectivity (offline network)
- IPC handler exception in main process

**Fixes:**
1. **Clear data:** Delete `%APPDATA%\launch-fiber-desktop\` folder
2. **Check network:** Ensure internet connection + backend reachable
3. **Check logs:** Enable DevTools (uncomment line 30 in `main.js`), look for red errors in Console

#### Login fails with "Failed to fetch"

**Causes:**
- Backend server offline or wrong URL
- CORS issue (backend not accepting requests from Electron app)
- Session cookie not being sent (context isolation issue)

**Fixes:**
1. **Verify backend URL:** User should double-check the server URL in login form
2. **Check backend:** Verify `launch-database` is running and `/api/auth/login` endpoint responds
3. **Check logs:** 
   - Main: DevTools Console tab (click F12 when app is focused)
   - Network: DevTools Network tab shows request + response (should see 200 or clear error code)

#### SmartScreen warning on first run

**Expected behavior** (v0.1). App is unsigned.

**To bypass:** Click "More info" → "Run anyway" (single-click workaround).

**To fix permanently:** Upgrade to v1+ with code-signing certificate.

#### Sync does not trigger automatically

**Causes:**
- App not logged in (check login screen)
- Local folder not selected (no `localRootPath` in store)
- Sync interval not initialized (15-min timer may have stalled)

**Fixes:**
1. **Check session:** Look for login screen. If visible, user must login first.
2. **Check folder:** In app, look for "Select folder" prompt. If no folder selected, sync won't run.
3. **Restart app:** `syncInterval` may be stalled; close + reopen app
4. **Manual trigger:** Use "Sync now" button instead of waiting for interval

#### Files not syncing (manual "Sync now" returns error)

**Causes:**
- Session expired (token no longer valid on backend)
- Backend unreachable
- Sync engine crashed (unhandled exception in `SyncEngine.runSync()`)

**Fixes:**
1. **Logout + login:** In app, click Logout, re-login with fresh credentials
2. **Check backend:** Verify `launch-database` is online (`https://launchdb-production.up.railway.app/api/health` if endpoint exists)
3. **Check console:** Enable DevTools; look for exception in `sync:now` handler

### Viewing Logs

#### Electron Main Process Logs

1. **DevTools Console:** Press F12 when app is focused
2. **System logs (Windows):** Event Viewer → Windows Logs → Application (search for "Launch Fiber")
3. **electron-store logs:** Stored in `%APPDATA%\launch-fiber-desktop\` (plaintext JSON files)

#### Network Debugging

DevTools → Network tab shows:
- All IPC → fetch() conversions (auth, workspace, sync calls)
- Response codes + headers
- Request payloads (POST auth login)

Enable detailed logging in `main.js`:
```javascript
ipcMain.handle('auth:login', async (event, { server, username, password }) => {
  console.log(`[auth:login] Attempting ${server}/api/auth/login`);
  console.log(`[auth:login] Username: ${username}`);
  // ... rest of handler
});
```

### Enabling DevTools (Debug Mode)

Uncomment line 30 in `main.js`:
```javascript
mainWindow.webContents.openDevTools();
```

Then restart app with `npm start`. DevTools opens in a side panel showing:
- Console — JavaScript errors, `console.log()` output
- Network — all fetch requests + responses
- Elements — DOM tree
- Application — electron-store contents, session storage

---

## Code Signing & Distribution (v1+ Roadmap)

### Why Code Signing?

- **Removes SmartScreen warning** (after reputation builds)
- **Enterprise deployment:** Can be deployed via SCCM/Intune without user prompts
- **Trust:** Windows trusts the publisher (signing cert authority)

### Implementation Steps (v1+)

1. **Obtain certificate:**
   - Purchase EV (Extended Validation) or OV (Organization Validation) code-signing cert
   - Recommended vendors: Sectigo, Digicert, GlobalSign
   - Cost: $200–500/year
   - Process: 3–7 days for approval (EV faster than OV)

2. **Configure in `package.json`:**
   ```json
   "build": {
     "win": {
       "certificateFile": "path/to/certificate.pfx",
       "certificatePassword": "process.env.SIGNING_CERT_PASSWORD",
       "signingHashAlgorithms": ["sha256"]
     }
   }
   ```

3. **Build signed installer:**
   ```bash
   SIGNING_CERT_PASSWORD=<password> npm run dist
   ```

4. **Test:** Run installer on clean Windows 10 VM — SmartScreen should NOT appear (or appear only once, then learn reputation)

### Enterprise Deployment (Optional)

- **SCCM/Intune:** Deploy `.exe` via Windows software management → auto-install silently on domain machines
- **Group Policy:** Push app to enterprise domain machines (requires IT setup)
- **Volume licensing:** Not applicable (Electron app is free + internal)

---

## Multi-Platform Support (Mac / Linux — Future)

### Current Scope
**v0.1 is Windows-only** (x64 target in `electron-builder` config).

### Adding macOS Support

In `package.json` `build.mac`:
```json
"mac": {
  "target": ["dmg", "zip"],
  "icon": "renderer/icon.icns",
  "category": "public.app-category.utilities"
}
```

Build:
```bash
npm run dist # On macOS machine
```

Output: `dist/Launch Fiber Desktop.dmg` (Mac installer)

### Adding Linux Support

In `package.json` `build.linux`:
```json
"linux": {
  "target": ["AppImage"],
  "icon": "renderer/icon.png",
  "category": "Utility"
}
```

Build:
```bash
npm run dist # On Linux machine
```

Output: `dist/launch-fiber-desktop-0.1.0.AppImage` (executable)

---

## Development Workflow

### Adding a New IPC Handler

1. **In `main.js`:**
   ```javascript
   ipcMain.handle('myfeature:do-something', async (event, param) => {
     try {
       // Main process work
       return { success: true, result: '...' };
     } catch (err) {
       return { success: false, error: err.message };
     }
   });
   ```

2. **In `preload.js`:**
   ```javascript
   doSomething: (param) => ipcRenderer.invoke('myfeature:do-something', param),
   ```

3. **In renderer (`app.js` / `login.js`):**
   ```javascript
   const result = await window.api.doSomething(param);
   if (result.success) {
     console.log('Success:', result.result);
   } else {
     console.error('Error:', result.error);
   }
   ```

### Adding a New Renderer Event Listener

1. **In `main.js`:**
   ```javascript
   mainWindow.webContents.send('myfeature:event-name', { data: '...' });
   ```

2. **In `preload.js`:**
   ```javascript
   onMyEvent: (callback) => ipcRenderer.on('myfeature:event-name', (event, data) => callback(data)),
   ```

3. **In renderer:**
   ```javascript
   window.api.onMyEvent((data) => {
     console.log('Received:', data);
   });
   ```

### Testing Before Build

```bash
npm start  # Dev mode
# Manually test: login, click buttons, verify logs in DevTools
# Test sync: select folder, click "Sync now"
# Test auto-sync: wait 15 min or trigger via network-reconnect sim
```

### Building & Installing for QA

```bash
npm run dist
# Test on Windows 10+ VM
# Run .exe, test login + sync + logout
# Check for SmartScreen warning (expected)
# Verify no app crashes in Event Viewer
```

---

## Security Considerations (v0.1)

### ✅ Implemented

- **Context Isolation:** Renderer cannot access Node.js APIs (line 19 in main.js: `contextIsolation: true`)
- **No Node Integration:** Node modules not available in renderer (line 20: `nodeIntegration: false`)
- **IPC Preload Bridge:** Renderer communicates via explicit IPC handlers only
- **Cookie-based Auth:** Session token stored in HTTP-only cookie (set by backend)

### ⚠️ Deferred (v0.2+)

- **Code Signing:** App is unsigned (SmartScreen warning expected)
- **Encrypted Storage:** `electron-store` stores session plaintext (should encrypt with DPAPI on Windows)
- **HTTPS Only:** App trusts HTTP backends in dev mode; production should enforce HTTPS
- **Token Expiry:** No refresh-token rotation yet (session valid indefinitely)

### Best Practices

- **Localhost Testing:** For dev, use `BACKEND_URL=http://localhost:3000 npm start`
- **HTTPS Production:** Always use HTTPS URLs for backend (no `http://` in production)
- **Credential Handling:** Never log passwords. Current code logs username (acceptable for debugging; remove in production)

---

## Performance & Optimization

### Current State (v0.1)

- **Startup time:** ~2–3 seconds (Electron framework + Node runtime load)
- **Login roundtrip:** ~1–2 seconds (network + backend response)
- **Workspace tree fetch:** Depends on backend (usually <1s for 100 items)
- **Memory:** ~150–200 MB when idle (Chromium + Node overhead)

### Optimization Roadmap (v0.2+)

- **Lazy-load workspace tree:** Fetch children on expand (not all upfront)
- **Cache workspace tree:** Store + incremental updates (vs full refetch)
- **Worker threads:** Offload sync engine to worker thread (prevent UI freeze)
- **Code splitting:** Split renderer into chunks (faster startup + lower memory)

---

## Contact & Support

For issues or feature requests:
- **Internal:** Post in #engineering-ops Slack channel
- **Bug report:** Include DevTools console errors + event logs
- **Feature request:** Describe use case + priority (now vs future)

---

## Appendix: File Structure

```
desktop/
├── main.js                 # Electron main process, IPC handlers, sync loop
├── preload.js              # Context-isolated IPC bridge for renderer
├── package.json            # Dependencies + build config (electron-builder)
├── renderer/
│   ├── login.html          # Login form UI
│   ├── login.js            # Login form logic
│   ├── index.html          # Main workspace view
│   ├── app.js              # Workspace UI logic
│   ├── app.css             # Shared styles
│   └── icon.ico            # App icon (256×256, can be placeholder)
├── sync/
│   └── engine.js           # Sync engine (file walk, diff, push/pull) — WIP
└── dist/                   # Output folder for built installers
    └── Launch Fiber Desktop Setup 0.1.0.exe
```

---

**Last Updated:** 2026-05-28 | **Status:** v0.1 (Beta) | **Next Sync Engine Wave:** v0.2
