const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  ipcMain,
  dialog,
  shell,
  safeStorage,
  session,
} = require('electron');
const path = require('path');
const Store = require('electron-store');
const SyncEngine = require('./sync/engine');

const store = new Store();

// Persistent session partition — cookies, localStorage, IndexedDB survive across launches.
// Same partition used by main window + sync engine cookie reads.
const SESSION_PARTITION = 'persist:launch-fiber';

// Default cloud production URL. Overridden by SERVER_URL env var OR stored config.
const DEFAULT_SERVER_URL = 'https://launchfiberadminportal.xyz';

// CDNs the cloud app references — must be allowed through navigation + resource policies.
const ALLOWED_CDN_HOSTS = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  // GitHub Releases (desktop download link in launcher)
  'github.com',
  'objects.githubusercontent.com',
  'github-releases.githubusercontent.com',
  'codeload.github.com',
]);

// H-1 (Wave 99): validate that a user-supplied server URL is safe before use.
// Enforces https:// (or http://localhost / http://127.0.0.1 for local dev),
// rejects RFC-1918 + link-local addresses, and disallows path components so
// the stored value is always a clean origin.
function validateServerUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    if (
      u.protocol !== 'https:' &&
      !(u.protocol === 'http:' && (u.hostname === 'localhost' || u.hostname === '127.0.0.1'))
    ) {
      return {
        ok: false,
        error: 'Server URL must use https:// (http:// is allowed only for localhost)',
      };
    }
    const host = u.hostname;
    const isPrivate =
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[01])\./.test(host) ||
      /^169\.254\./.test(host) ||
      host === '0.0.0.0';
    if (isPrivate) {
      return { ok: false, error: 'Private/internal IP addresses are not allowed as server URL' };
    }
    if (u.pathname && u.pathname !== '/' && u.pathname !== '') {
      return {
        ok: false,
        error:
          'Server URL must not include a path component — provide the origin only (e.g. https://example.com)',
      };
    }
    return { ok: true, origin: u.origin };
  } catch (err) {
    return { ok: false, error: 'Invalid URL: ' + err.message };
  }
}

// H-2 (Wave 99): encrypt/decrypt small secrets via OS credential store.
// Still used here for any sensitive bits we persist (config flags etc.); session
// cookies now live in the Electron session partition rather than electron-store.
function encryptCookie(raw) {
  if (safeStorage.isEncryptionAvailable()) {
    return { encrypted: true, data: safeStorage.encryptString(raw).toString('base64') };
  }
  console.warn(
    '[security] safeStorage unavailable — value stored in plaintext. ' +
      'Install a secrets manager (gnome-keyring, kwallet) for encrypted storage on Linux.'
  );
  return { encrypted: false, data: raw };
}

function decryptCookie(stored) {
  if (!stored) return null;
  if (stored.encrypted) {
    try {
      return safeStorage.decryptString(Buffer.from(stored.data, 'base64'));
    } catch (err) {
      console.error('[security] Failed to decrypt stored value:', err.message);
      return null;
    }
  }
  return stored.data;
}

// --- Module state ----------------------------------------------------------

let mainWindow = null;
let configWindow = null;
let tray = null;
let syncEngine = null;
let syncInterval = null;
let serverUrl = null; // resolved at startup (env > store > prompt)
let isQuittingExplicitly = false;

// Sync interval in minutes. Default 5; user-overridable via stored config.
function getSyncIntervalMinutes() {
  const v = store.get('syncIntervalMinutes');
  return typeof v === 'number' && v >= 1 ? v : 5;
}

function getAutoSyncEnabled() {
  const v = store.get('autoSyncEnabled');
  return v === undefined ? true : !!v;
}

// --- URL / origin helpers --------------------------------------------------

function getServerOrigin() {
  if (!serverUrl) return null;
  try {
    return new URL(serverUrl).origin;
  } catch (_) {
    return null;
  }
}

function isAllowedNavigationUrl(navUrl) {
  try {
    const parsed = new URL(navUrl);
    if (parsed.protocol === 'about:' || parsed.protocol === 'data:') return false;
    if (parsed.protocol === 'file:') return true; // local config screens
    const origin = parsed.origin;
    const allowedOrigin = getServerOrigin();
    if (allowedOrigin && origin === allowedOrigin) return true;
    if (ALLOWED_CDN_HOSTS.has(parsed.hostname)) return true;
    return false;
  } catch (_) {
    return false;
  }
}

// --- First-run config window ----------------------------------------------

function createConfigWindow() {
  configWindow = new BrowserWindow({
    width: 520,
    height: 420,
    resizable: false,
    title: 'Launch Fiber Desktop — Setup',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  configWindow.setMenuBarVisibility(false);
  configWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  configWindow.webContents.on('will-navigate', (event, navUrl) => {
    if (!navUrl.startsWith('file://')) {
      event.preventDefault();
    }
  });
  configWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  configWindow.on('closed', () => {
    configWindow = null;
  });
}

// --- Main cloud-wrapping window -------------------------------------------

function createMainWindow() {
  const partitionSession = session.fromPartition(SESSION_PARTITION, { cache: true });

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Launch Fiber Desktop',
    icon: path.join(__dirname, 'renderer', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      partition: SESSION_PARTITION,
    },
  });

  mainWindow.loadURL(serverUrl);

  // Navigation policy: same origin OR allowlisted CDN OK; everything else blocked.
  mainWindow.webContents.on('will-navigate', (event, navUrl) => {
    if (!isAllowedNavigationUrl(navUrl)) {
      event.preventDefault();
      console.warn('[security] Blocked navigation to:', navUrl);
      // External links open in the OS browser only if user-initiated AND http(s).
      try {
        const parsed = new URL(navUrl);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          shell.openExternal(navUrl);
        }
      } catch (_) {}
    }
  });

  // window.open / target=_blank handler — same allowlist; external opens in OS browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedNavigationUrl(url)) {
      // Allow same-origin popups inside Electron only if they're our origin.
      try {
        const parsed = new URL(url);
        if (parsed.origin === getServerOrigin()) {
          return {
            action: 'allow',
            overrideBrowserWindowOptions: {
              webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: true,
                partition: SESSION_PARTITION,
              },
            },
          };
        }
      } catch (_) {}
    }
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        shell.openExternal(url);
      }
    } catch (_) {}
    return { action: 'deny' };
  });

  // Loading errors -> friendly message + retry hint.
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    // -3 = ABORTED (often from in-progress redirect); ignore.
    if (errorCode === -3) return;
    console.error('[main] did-fail-load', errorCode, errorDescription, validatedURL);
  });

  // Notify sync that we're back online + window is ready.
  mainWindow.webContents.on('did-finish-load', () => {
    notifySyncWindowReady();
  });

  // Close-to-tray on Windows/Linux; macOS uses dock convention.
  mainWindow.on('close', (event) => {
    if (!isQuittingExplicitly && process.platform !== 'darwin') {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createApplicationMenu();
}

// --- Native application menu ----------------------------------------------

function createApplicationMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow && mainWindow.webContents.reload(),
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => mainWindow && mainWindow.webContents.reloadIgnoringCache(),
        },
        { type: 'separator' },
        {
          label: 'Sync Now',
          accelerator: 'CmdOrCtrl+S',
          click: () => triggerManualSync(),
        },
        {
          label: 'Change Server URL...',
          click: () => promptChangeServerUrl(),
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit', label: 'Exit', accelerator: 'CmdOrCtrl+Q' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        ...(isMac ? [{ role: 'zoom' }, { type: 'separator' }, { role: 'front' }] : [{ role: 'close' }]),
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Launch Fiber Desktop',
          click: () =>
            dialog.showMessageBox(mainWindow || undefined, {
              type: 'info',
              title: 'About Launch Fiber Desktop',
              message: 'Launch Fiber Desktop',
              detail:
                `Version ${app.getVersion()}\n` +
                `Server: ${serverUrl || '(unset)'}\n` +
                `Electron ${process.versions.electron}\n` +
                `Node ${process.versions.node}`,
            }),
        },
        {
          label: 'GitHub',
          click: () => shell.openExternal('https://github.com/KodaiCards/launch-database'),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// --- System tray ----------------------------------------------------------

function createTray() {
  const trayModule = require('./sync/tray');
  tray = trayModule.create({
    iconPath: path.join(__dirname, 'renderer', 'icon.png'),
    onShow: () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
      }
    },
    onSyncNow: () => triggerManualSync(),
    onQuit: () => {
      isQuittingExplicitly = true;
      app.quit();
    },
    getStatus: () => (syncEngine ? syncEngine.getSyncStatus() : { lastSyncAt: null, isRunning: false }),
  });
}

function updateTrayStatus(status) {
  if (tray && typeof tray.updateStatus === 'function') {
    tray.updateStatus(status);
  }
}

// --- Sync engine integration ----------------------------------------------

/**
 * Read the Cookie header value to use against the launch-fiber backend.
 * Pulled from the persistent session partition where the main window logs in.
 */
async function getSessionCookieHeader() {
  const origin = getServerOrigin();
  if (!origin) return '';
  const ses = session.fromPartition(SESSION_PARTITION);
  try {
    const cookies = await ses.cookies.get({ url: origin });
    if (!cookies || cookies.length === 0) return '';
    return cookies.map((c) => `${c.name}=${c.value}`).join('; ');
  } catch (err) {
    console.warn('[sync] Failed to read session cookies:', err.message);
    return '';
  }
}

async function ensureSyncEngine() {
  if (!syncEngine) {
    const cookieHeader = await getSessionCookieHeader();
    syncEngine = new SyncEngine(getServerOrigin(), cookieHeader);
  } else {
    // Refresh cookie in case the user re-logged in.
    syncEngine.cookie = await getSessionCookieHeader();
  }
  return syncEngine;
}

async function triggerManualSync() {
  try {
    const localRootPath = store.get('localRootPath');
    if (!localRootPath) {
      if (mainWindow) {
        const choice = await dialog.showMessageBox(mainWindow, {
          type: 'question',
          buttons: ['Choose folder...', 'Cancel'],
          defaultId: 0,
          cancelId: 1,
          title: 'Choose Sync Folder',
          message: 'Pick a local folder to sync with Launch Fiber.',
        });
        if (choice.response === 0) {
          const pick = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
            message: 'Select a folder to sync with Launch Fiber',
          });
          if (!pick.canceled && pick.filePaths[0]) {
            store.set('localRootPath', pick.filePaths[0]);
            return triggerManualSync();
          }
        }
      }
      return { success: false, error: 'No local sync folder configured' };
    }
    const cookieHeader = await getSessionCookieHeader();
    if (!cookieHeader) {
      return { success: false, error: 'Not signed in — log in via the main window first' };
    }
    const engine = await ensureSyncEngine();
    const result = await engine.runSync(localRootPath);
    const status = engine.getSyncStatus();
    updateTrayStatus(status);
    if (mainWindow) {
      mainWindow.webContents.send('sync:completed', result);
    }
    return result;
  } catch (err) {
    console.error('[sync] manual sync failed:', err);
    return { success: false, error: err.message };
  }
}

function startSyncTimer() {
  if (syncInterval) clearInterval(syncInterval);
  if (!getAutoSyncEnabled()) return;
  const minutes = getSyncIntervalMinutes();
  syncInterval = setInterval(async () => {
    try {
      const localRootPath = store.get('localRootPath');
      if (!localRootPath) return;
      const cookieHeader = await getSessionCookieHeader();
      if (!cookieHeader) return;
      const engine = await ensureSyncEngine();
      const result = await engine.runSync(localRootPath);
      const status = engine.getSyncStatus();
      updateTrayStatus(status);
      if (mainWindow) {
        mainWindow.webContents.send('sync:completed', result);
      }
    } catch (err) {
      console.warn('[sync] scheduled sync error:', err.message);
    }
  }, minutes * 60 * 1000);
}

function notifySyncWindowReady() {
  // Hook for renderer-side coordination (toast etc.). Currently a no-op
  // because we delegate UI to the cloud app's own toasts.
}

// --- Change-server flow ---------------------------------------------------

async function promptChangeServerUrl() {
  if (!mainWindow) return;
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    buttons: ['Change Server', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
    title: 'Change Server URL',
    message: 'Changing the server URL signs you out and reopens the app at the new URL.',
  });
  if (result.response !== 0) return;
  // Clear cookies for current partition, then reopen config window.
  try {
    const ses = session.fromPartition(SESSION_PARTITION);
    await ses.clearStorageData({ storages: ['cookies', 'localstorage', 'indexdb'] });
  } catch (_) {}
  store.delete('serverUrl');
  serverUrl = null;
  if (mainWindow) {
    isQuittingExplicitly = true;
    mainWindow.close();
  }
  startupResolveServerUrl().then(() => {
    isQuittingExplicitly = false;
    createMainWindow();
  });
}

// --- Startup URL resolution ----------------------------------------------

async function startupResolveServerUrl() {
  // Priority: SERVER_URL env > stored config > default production URL.
  const envUrl = process.env.SERVER_URL;
  const stored = store.get('serverUrl');
  const candidate = envUrl || stored || DEFAULT_SERVER_URL;
  const validation = validateServerUrl(candidate);
  if (validation.ok) {
    serverUrl = validation.origin;
    store.set('serverUrl', serverUrl);
    return serverUrl;
  }
  // Invalid — fall back to default + warn.
  console.warn('[startup] Stored/env server URL invalid:', validation.error);
  const fallback = validateServerUrl(DEFAULT_SERVER_URL);
  if (fallback.ok) {
    serverUrl = fallback.origin;
    store.set('serverUrl', serverUrl);
    return serverUrl;
  }
  throw new Error('Cannot resolve a valid server URL');
}

// --- App lifecycle --------------------------------------------------------

app.on('ready', async () => {
  try {
    await startupResolveServerUrl();
  } catch (err) {
    dialog.showErrorBox('Launch Fiber Desktop', `Startup failed: ${err.message}`);
    app.quit();
    return;
  }
  createMainWindow();
  try {
    createTray();
  } catch (err) {
    console.warn('[startup] Tray init failed (non-fatal):', err.message);
  }
  startSyncTimer();
});

app.on('window-all-closed', () => {
  // Keep app alive in tray on Windows/Linux; quit on macOS only if user quit explicitly.
  if (process.platform === 'darwin' && isQuittingExplicitly) {
    app.quit();
  } else if (process.platform !== 'darwin' && isQuittingExplicitly) {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  } else {
    mainWindow.show();
  }
});

app.on('before-quit', () => {
  isQuittingExplicitly = true;
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
});

// --- IPC: sync ------------------------------------------------------------

ipcMain.handle('sync:run-now', async () => {
  return triggerManualSync();
});

ipcMain.handle('sync:status', () => {
  if (!syncEngine) {
    return { lastSyncAt: null, isRunning: false, errors: [], conflicts: [], events: [] };
  }
  return syncEngine.getSyncStatus();
});

ipcMain.handle('sync:stop', () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  store.set('autoSyncEnabled', false);
  return { success: true };
});

ipcMain.handle('sync:start', () => {
  store.set('autoSyncEnabled', true);
  startSyncTimer();
  return { success: true, intervalMinutes: getSyncIntervalMinutes() };
});

ipcMain.handle('sync:set-interval', (event, minutes) => {
  const n = parseInt(minutes, 10);
  if (!Number.isFinite(n) || n < 1) {
    return { success: false, error: 'Interval must be ≥ 1 minute' };
  }
  store.set('syncIntervalMinutes', n);
  startSyncTimer();
  return { success: true };
});

ipcMain.handle('sync:get-local-root', () => store.get('localRootPath') || null);

ipcMain.handle('sync:pick-folder', async () => {
  if (!mainWindow) return { success: false, error: 'No window' };
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      message: 'Select a folder to sync with Launch Fiber',
    });
    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'No folder selected' };
    }
    store.set('localRootPath', result.filePaths[0]);
    return { success: true, path: result.filePaths[0] };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// --- IPC: config / shell --------------------------------------------------

ipcMain.handle('config:get-server-url', () => serverUrl || null);

ipcMain.handle('config:set-server-url', async (event, newUrl) => {
  const validation = validateServerUrl(newUrl);
  if (!validation.ok) {
    return { success: false, error: validation.error };
  }
  store.set('serverUrl', validation.origin);
  return { success: true, origin: validation.origin };
});

ipcMain.handle('shell:open-external', async (event, url) => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { success: false, error: 'Only http(s) URLs may be opened externally' };
    }
    await shell.openExternal(url);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// --- Exports for unit testing --------------------------------------------

if (typeof module !== 'undefined') {
  module.exports = {
    validateServerUrl,
    encryptCookie,
    decryptCookie,
    isAllowedNavigationUrl,
  };
}
