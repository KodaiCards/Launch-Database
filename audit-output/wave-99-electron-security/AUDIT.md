# Wave 99 — Electron Desktop App Security Audit

**Date:** 2026-05-28
**Auditor:** Wave 99 Read-Only Agent
**Scope:** `desktop/` — all source files (main.js, preload.js, renderer/app.js, renderer/login.js, renderer/index.html, renderer/login.html, sync/engine.js, sync/manifest.js, package.json)
**Verdict:** YELLOW — 3 HIGH, 4 MEDIUM, 4 LOW

---

## Findings

### HIGH

---

**H-1 — Server URL accepted from user input with no validation; arbitrary fetch target allows SSRF / credential exfiltration**

Verified by reading: `desktop/main.js:96-128`, `desktop/renderer/login.html:18-26`, `desktop/renderer/login.js:19`

Code snippet:
```js
// main.js:96-100
ipcMain.handle('auth:login', async (event, { server, username, password }) => {
  try {
    const response = await fetch(`${server}/api/auth/login`, {
```
```html
<!-- login.html:24-26 -->
<input type="text" id="server" name="server"
  placeholder="https://launchdb-production.up.railway.app"
  value="https://launchdb-production.up.railway.app" required />
```

The `auth:login` IPC handler concatenates the user-supplied `server` value directly into a fetch URL without any validation. A user (or malicious script that somehow reaches the renderer — unlikely given contextIsolation but defense-in-depth matters) can supply an arbitrary URL. The full username + password are posted to that URL. After a successful response, the `server` value is stored in `electron-store` and reused for ALL subsequent API calls (`workspace:list-projects`, `workspace:fetch-tree`, `sync:now`) and all sync engine operations.

Attack chain: user A socially-engineers user B into typing a rogue server URL → B's credentials and all subsequent session cookies/data go to attacker's server → attacker harvests session cookie + file data indefinitely until user re-logs in.

Also, `sync:set-local-root` (main.js:202-208) stores any string from the renderer into `localRootPath` with no validation. If `server` is later changed via re-login to a valid endpoint, previously stored `localRootPath` is still used blindly by `runSync`.

**Fix shape:** Validate `server` against an allowlist or at minimum enforce `https://` prefix + reject `localhost` / RFC-1918 / file:// / non-HTTPS schemes. Reject URLs with path components (only origin should be configurable). Consider hardcoding the server URL for production builds and making it non-editable in the UI.

---

**H-2 — Session cookie stored in plaintext in electron-store; no encryption; readable by any OS-level process running as same user**

Verified by reading: `desktop/main.js:110-119`, `desktop/main.js:6`

Code snippet:
```js
// main.js:6
const store = new Store();

// main.js:110-119
store.set('session', {
  server,
  username,       // stored in plaintext
  cookie: setCookie,   // full Set-Cookie header value, plaintext
  user: data.user,
  timestamp: Date.now(),
});
```

`electron-store` defaults to no encryption. On Windows the store is at `%APPDATA%\launch-fiber-desktop\config.json` — readable by any process running as the same Windows user (or any admin). The stored value includes:
- `username` (plaintext)
- `cookie` — the raw `Set-Cookie` response header including the session cookie value
- `server` URL

An attacker with filesystem access (malware, shared machine, memory forensics) can harvest the session cookie and replay it against the production server with full authenticated access — no re-authentication needed.

`electron-store` supports an `encryptionKey` option that uses safeStorage (OS credential store on Windows/macOS). It is not used here.

**Fix shape:** Initialize store with `encryptionKey: app.getPath('userData')` or use `safeStorage.encryptString` / `safeStorage.decryptString` on the cookie value before storing. Do not store the raw `username` in persisted state (only needed for display; re-fetch from `/api/auth/me` on session restore).

---

**H-3 — Path traversal in sync pull: server-controlled `relativePath` written to filesystem without canonicalization**

Verified by reading: `desktop/sync/engine.js:130-153`, `desktop/sync/engine.js:49-78`

Code snippet:
```js
// engine.js:143-145
const fullPath = path.join(localRootPath, relativePath);
const dir = path.dirname(fullPath);
await fs.mkdir(dir, { recursive: true });
await fs.writeFile(fullPath, buffer);
```
```js
// engine.js:53
const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;
```

`relativePath` is derived from `item.name` values returned by the server (`/api/workspace/tree` and `/api/workspace/folders/:id/files`). If the server is compromised — or if H-1 is exploited to connect to a malicious server — the server can return `item.name = "../../AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/evil.exe"` or any path outside `localRootPath`. `path.join` will resolve the traversal segments and `writeFile` will write to that arbitrary path.

`resolveConflict` (engine.js:188-208) also calls `pullFile` with a `relativePath` derived from the same server-supplied value, so the same traversal applies to conflict resolution.

`scanLocalFolder` in manifest.js uses `entry.isFile()` (not `entry.isSymbolicLink()`), so symlinks within the local tree are followed — this allows a pre-placed symlink in the sync folder to cause push of files outside the sync root (see L-2 below).

**Fix shape:** After `path.join(localRootPath, relativePath)`, verify `fullPath.startsWith(path.resolve(localRootPath) + path.sep)`. Reject paths that escape the root with an error. Strip any leading `../` or absolute path components from server-returned names before use.

---

### MEDIUM

---

**M-1 — `shell.openExternal` called with server URL from store; if server URL is malicious, opens arbitrary URI scheme**

Verified by reading: `desktop/renderer/app.js:86-89`

Code snippet:
```js
webPortalBtn.addEventListener('click', () => {
  require('electron').shell.openExternal(currentSession.server);
});
```

`shell.openExternal` launches the OS default handler for the URL. `currentSession.server` comes directly from the stored session (set during login from user-supplied server input — H-1 above). If the stored server value is `javascript:alert(1)`, `file:///C:/Windows/System32/cmd.exe`, or `ms-excel://` (or any registered custom protocol), `openExternal` will invoke the OS handler for that scheme. Electron's `shell.openExternal` does not restrict schemes.

Note: this also calls `require('electron')` inside the renderer — this works only because contextIsolation is true and the preload doesn't expose `shell`. However, calling `require` in a renderer with contextIsolation=true works when sandbox=false (Electron 33 default without explicit `sandbox: true`). This is a secondary concern (see M-4).

**Fix shape:** Add `shell.openExternal` to the preload bridge with origin validation. In the IPC handler, validate that the URL starts with `https://` before calling `openExternal`. Alternatively enforce in the login handler that server must be `https://`.

---

**M-2 — No `will-navigate` or `new-window` / `setWindowOpenHandler` guard; renderer can navigate to external URLs**

Verified by reading: `desktop/main.js:13-41` (createWindow — no navigation guards)

Code snippet:
```js
// main.js — entire createWindow function, no will-navigate listener
function createWindow(isLogin = false) {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      ...
    },
  });
  mainWindow.loadFile(filePath);
  // No mainWindow.webContents.on('will-navigate', ...)
  // No mainWindow.webContents.setWindowOpenHandler(...)
```

Electron's security best practices (official docs) recommend attaching `will-navigate` to prevent the renderer from navigating to external URLs, and `setWindowOpenHandler` to block `window.open` calls that target external origins. Neither is present. If any XSS were to occur in the renderer (unlikely but not impossible), or if a future feature introduces a link, the renderer could navigate the main window to an external page that lacks the contextIsolation guarantee.

The current renderer only loads local `file://` HTML, so risk is low today — but the guard is a one-time 5-line addition and is standard practice.

**Fix shape:**
```js
mainWindow.webContents.on('will-navigate', (event, url) => {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'file:') {
    event.preventDefault();
  }
});
mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
```

---

**M-3 — IPC listener `sync:online` registered repeatedly on every `did-finish-load`; listener accumulates without cleanup**

Verified by reading: `desktop/main.js:279-302` (`initializeSyncListeners`)

Code snippet:
```js
// main.js:279-303
function initializeSyncListeners() {
  if (!mainWindow) return;

  ipcMain.on('sync:online', () => {     // ← ipcMain.on, not .once; no removeListener
    showSyncCountdownToast();
  });

  if (!syncInterval) {
    syncInterval = setInterval(async () => { ... }, 15 * 60 * 1000);
  }
}
```

`initializeSyncListeners` is called from `did-finish-load` (main.js:36-38). Each page navigation (login.html → index.html, or a reload) fires `did-finish-load` again. Each call adds ANOTHER `ipcMain.on('sync:online', ...)` listener without removing the previous one. After N navigations, a single `sync:online` IPC send from the renderer triggers N countdown toasts simultaneously.

More significantly: `ipcMain` in Electron has a default `MaxListenersExceededWarning` threshold of 10. At 11+ listeners, Node.js logs a warning that may expose internal paths in logs. Excessive listeners is also a memory leak vector.

**Fix shape:** Use `ipcMain.once` instead of `ipcMain.on`, or store the listener function and call `ipcMain.removeListener` before re-registering. Set an `initialized` flag on `initializeSyncListeners` to guard against re-entry.

---

**M-4 — Renderer uses `require('electron')` directly; `sandbox` is not explicitly enabled**

Verified by reading: `desktop/renderer/app.js:87`, `desktop/main.js:14-23`

Code snippet:
```js
// app.js:87
require('electron').shell.openExternal(currentSession.server);
```
```js
// main.js — no sandbox: true in webPreferences
webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,
  nodeIntegration: false,
  enableRemoteModule: false,
  // sandbox: not set → defaults to false in Electron 33 for file:// pages
}
```

`nodeIntegration: false` prevents direct Node.js APIs in the renderer. However, `require('electron')` in a renderer context accesses Electron's renderer-side modules (like `shell`) via the `electron` built-in module, which is available in non-sandboxed renderers even with nodeIntegration off. This is a partial isolation breach — the preload bridge is correct, but the renderer bypasses it for `shell.openExternal`.

With `sandbox: false` (the current default for `loadFile` pages), the renderer process can also access `process`, `__dirname`, and other Node globals, which weakens the contextIsolation guarantee. Electron's own security checklist (item 5) recommends `sandbox: true` for all renderer processes.

**Fix shape:** Move `shell.openExternal` call to an IPC handler in main.js with URL validation. Add `sandbox: true` to webPreferences. Remove `require('electron')` from renderer code.

---

### LOW

---

**L-1 — No auto-update mechanism; v0.1.0 installed on user machines will never self-update; security fixes require manual reinstall**

Verified by reading: `desktop/package.json` (no `electron-updater` dependency), `desktop/main.js` (no autoUpdater import or usage)

`electron-builder` is present for installer generation but `electron-updater` (the companion auto-update library) is absent. There is no `autoUpdater` initialization in main.js. Users who install v0.1.0 from the NSIS installer will remain on that version indefinitely. Future security patches — including fixes for H-1, H-2, H-3 above — cannot be delivered without the user manually downloading and re-running the installer.

**Fix shape:** Add `electron-updater` dependency, call `autoUpdater.checkForUpdatesAndNotify()` on app ready, configure `publish` target in `package.json` build config pointing to a GitHub Releases endpoint or S3 bucket. Requires code signing (see L-3) to avoid SmartScreen blocking updates.

---

**L-2 — `scanLocalFolder` follows symlinks; symlink in sync root can cause push of arbitrary files outside sync boundary**

Verified by reading: `desktop/sync/manifest.js:22-28`

Code snippet:
```js
for (const entry of entries) {
  const fullPath = path.join(dir, entry.name);
  const relativePath = ...;

  if (entry.isDirectory()) {
    await walk(fullPath, relativePath);
  } else if (entry.isFile()) {     // ← isFile() returns true for symlink-to-file
```

`entry.isFile()` returns `true` for a symlink that points to a file. `entry.isDirectory()` returns `true` for a symlink that points to a directory. `fs.readdir` with `{ withFileTypes: true }` returns `Dirent` objects; without `{ recursive: false }` and explicit `isSymbolicLink()` guard, symlinks are followed transparently. An attacker who gains write access to the sync folder (or a future feature that writes attacker-controlled filenames into the sync folder) could place a symlink targeting `C:\Windows\System32\drivers\etc\hosts` or `%APPDATA%\...` and have those files pushed to the server.

**Fix shape:** Add `if (entry.isSymbolicLink()) continue;` before the isDirectory/isFile checks in `walk`.

---

**L-3 — App is unsigned; SmartScreen blocks installation; supply-chain risk if installer binary is distributed through informal channels**

Verified by reading: `desktop/README.md:29`, `desktop/package.json` build config (no `certificateFile`, no `signingHashAlgorithms`)

The README explicitly documents that SmartScreen shows a warning on first run and instructs users to click "More info → Run anyway." This training teaches users to override security warnings, normalizing the habit. More critically, an unsigned NSIS installer is indistinguishable to the OS from a tampered binary — if the installer is shared via email / Teams / Dropbox rather than a controlled endpoint, a man-in-the-middle or compromised file share can substitute a backdoored binary.

**Fix shape:** Obtain a code-signing certificate (EV OV from DigiCert/Sectigo ~$400/yr) and configure `electron-builder` `win.certificateFile` + `win.certificatePassword` (from env var). This is the prerequisite for auto-update (L-1) since `electron-updater` validates update signatures.

---

**L-4 — `electron-store` instance in `manifest.js` uses name `sync-manifest`; same OS user, different app installations could collide**

Verified by reading: `desktop/sync/manifest.js:6`

Code snippet:
```js
const manifestStore = new Store({ name: 'sync-manifest' });
```

`electron-store` stores data at `%APPDATA%\<productName>\<name>.json`. The `productName` is `Launch Fiber Desktop` from package.json, so the path is `%APPDATA%\Launch Fiber Desktop\sync-manifest.json`. This is fine for single-user single-installation. However, `perMachine: false` in the NSIS config means the app installs per-user, and on a shared Windows machine (common in field offices), each logged-in user has their own `%APPDATA%` — so there is no cross-user collision.

The residual concern: the store contains `serverManifest` (server file listing including file paths and IDs) and `localCache` (sha256 hashes of local files). These are not sensitive credentials but they are operational data. If the APPDATA path is on a network share (uncommon but possible in corporate environments), the manifest is world-readable by anyone on that share.

**Fix shape:** Low priority. Document the APPDATA path dependency. If network-share APPDATA is a concern in Carter's office environment, set a custom `cwd` to `app.getPath('userData')` explicitly (which it already is by default) and confirm it resolves to local disk.

---

## VERIFIED CLEAN

The following areas were checked and found clean:

| Area | Checked | Result |
|---|---|---|
| `contextIsolation` | main.js:19 | `true` — correct |
| `nodeIntegration` | main.js:20 | `false` — correct |
| `enableRemoteModule` | main.js:21 | `false` — correct |
| Preload uses contextBridge | preload.js:1-19 | All 9 channels properly bridged; no direct `ipcRenderer` exposure to window |
| Preload IPC channels enumerated | preload.js + main.js | Every channel in preload has a corresponding `ipcMain.handle` with no extras; no wildcard listeners |
| `webPortalBtn` URL XSS | app.js:87 + main.js | `escapeHtml()` used for all server-returned data in DOM insertions |
| DevTools in production | main.js:29-30 | Commented out; will not open in production builds |
| SQL injection via IPC | main.js | No direct DB access in desktop app; all queries go through the authenticated backend API — trust boundary is correct |
| Session expiry on logout | main.js:130-134 | `store.delete('session')` and `store.delete('backendUrl')` both called; no stale session risk |
| `dialog.showOpenDialog` sandboxing | main.js:211-231 | Native OS dialog; not controllable by renderer beyond triggering it; path returned via IPC — correct |
| Form inputs in login.html | login.html + login.js | Standard form with `event.preventDefault()`; no `innerHTML` injection risk |

---

## GAPS (not auditable from source)

- **Backend `/api/workspace/tree` and `/api/workspace/folders/:id/files` response schemas** are not validated client-side before being walked (engine.js `_walkServerTree`). If the server returns `item.name` with a null byte, Unicode path separator, or device name (e.g., `CON`, `PRN`, `AUX` on Windows), the behavior of `fs.writeFile` is OS-dependent. Could not audit the server-side sanitization of these fields from desktop source alone — recommend auditing routes/workspace.js for output encoding.
- **`node-fetch@2.7.0`** is used in sync/engine.js; Electron 33 bundles a browser-compatible `fetch` already available in the main process. Using the bundled fetch would eliminate a dependency (fewer supply-chain surfaces). Cannot determine from source whether there are known CVEs in node-fetch 2.7.0 without running `npm audit`.
- **`chokidar@^4.0.0`** is listed as a dependency in package.json but is not imported anywhere in the current source. Dead dependency — supply-chain surface for no benefit. Can be removed.

---

## VERDICT: YELLOW

**3 HIGH, 4 MEDIUM, 4 LOW**

The three HIGH findings must be fixed before this app is distributed beyond Carter's own machine:

- **H-1** (arbitrary server SSRF + credential exfiltration) — trivial to exploit socially; credentials + all sync data flow to attacker.
- **H-2** (session cookie plaintext in electron-store) — anyone with read access to `%APPDATA%` harvests a replayable session.
- **H-3** (path traversal via server-controlled filenames) — a compromised or malicious server can write files anywhere the app user has write permission.

The app's Electron security foundations (contextIsolation, nodeIntegration=false, contextBridge) are correctly configured and that is genuine credit. The vulnerabilities are in the application logic layer, not the framework configuration.

=== WAVE 99 ELECTRON SECURITY AUDIT END ===
