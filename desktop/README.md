# Launch Fiber Desktop

A Windows-first Electron desktop app for Launch Fiber Services that connects to the launch-database backend for file sync and workspace management.

**Status:** v0.1.0 (Scaffold + Login Flow) — Internal Beta

## Build & Run

### Development

```bash
cd desktop
npm install
npm start
```

The app will launch with DevTools available (uncomment in `main.js` line 27 to enable).

### Production Build (Windows Installer)

```bash
cd desktop
npm install
npm run dist
```

This generates an unsigned Windows installer at `dist/Launch Fiber Desktop Setup 0.1.0.exe`.

**SmartScreen Warning:** When users first run the unsigned installer, Windows SmartScreen will show a warning. Users should click "More info" → "Run anyway" to proceed. (Code signing is deferred for v1.)

## App Architecture

- **Main Process** (`main.js`): Window management, IPC handlers for auth + workspace API calls
- **Preload** (`preload.js`): Context-isolated IPC bridge
- **Renderer** (`renderer/app.js` + `renderer/login.js`): UI logic for login + main workspace
- **Styles** (`renderer/app.css`): Native-looking cross-platform styling

## Features (v0.1.0)

- ✅ First-launch login flow (email/password + server URL)
- ✅ Session persistence (electron-store)
- ✅ Backend API integration (IPC handlers for auth + workspace endpoints)
- ✅ Basic workspace tree UI (placeholder)
- ✅ Logout + error handling
- ⏳ **Folder sync engine** — follow-on wave

## Configuration

Backend URL defaults to `https://launchdb-production.up.railway.app`. Override with:

```bash
BACKEND_URL=https://your-server.com npm start
```

Or via the login form (users can input custom server URL).

## Icon

The installer will use `renderer/icon.ico` if present. To add a real icon:

1. Create or download a 256×256 ICO file
2. Place it at `desktop/renderer/icon.ico`
3. Rebuild the installer

For now, Electron uses a default icon.

## Dependencies

- `electron@^33.0.0` — Desktop app framework
- `electron-builder@^25.0.0` — Installer generation
- `electron-store@^10.0.0` — Persistent session storage

## Security Notes (v0.1.0)

- ✅ Context isolation enabled
- ✅ Node integration disabled
- ✅ Preload bridge (IPC) used for backend calls
- ⚠️ App is **unsigned** (internal beta only)
- ⏳ Code signing for v1+ once stable

## Next Steps (v0.2+)

- Folder sync engine (push/pull with local file watching)
- Conflict resolution UI
- Progress indicators
- More sophisticated workspace tree rendering
- Code signing + SmartScreen bypass
