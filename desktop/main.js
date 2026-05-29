const { app, BrowserWindow, Menu, ipcMain, dialog, safeStorage } = require('electron');
const path = require('path');
const Store = require('electron-store');
const SyncEngine = require('./sync/engine');

const store = new Store();

// H-1 (Wave 99): validate that a user-supplied server URL is safe before use.
// Enforces https:// (or http://localhost / http://127.0.0.1 for local dev),
// rejects RFC-1918 + link-local addresses, and disallows path components so
// the stored value is always a clean origin.
function validateServerUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    // Allow https:// for production; allow http:// only for explicit localhost dev.
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
    // Reject RFC-1918 + link-local + unspecified (except explicit localhost above).
    const isPrivate =
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[01])\./.test(host) ||
      /^169\.254\./.test(host) ||
      host === '0.0.0.0';
    if (isPrivate) {
      return { ok: false, error: 'Private/internal IP addresses are not allowed as server URL' };
    }
    // Only an origin is valid — no path component beyond '/'.
    if (u.pathname && u.pathname !== '/' && u.pathname !== '') {
      return {
        ok: false,
        error: 'Server URL must not include a path component — provide the origin only (e.g. https://example.com)',
      };
    }
    return { ok: true, origin: u.origin };
  } catch (err) {
    return { ok: false, error: 'Invalid URL: ' + err.message };
  }
}

// H-2 (Wave 99): encrypt a string value using the OS credential store
// (Windows DPAPI / macOS Keychain / Linux Secret Service via safeStorage).
// Falls back to plain storage with a startup warning when safeStorage is
// unavailable (e.g. Linux without a password manager).
function encryptCookie(raw) {
  if (safeStorage.isEncryptionAvailable()) {
    return { encrypted: true, data: safeStorage.encryptString(raw).toString('base64') };
  }
  console.warn('[security] safeStorage unavailable — session cookie stored in plaintext. ' +
    'Install a secrets manager (gnome-keyring, kwallet) for encrypted storage on Linux.');
  return { encrypted: false, data: raw };
}

function decryptCookie(stored) {
  if (!stored) return null;
  if (stored.encrypted) {
    try {
      return safeStorage.decryptString(Buffer.from(stored.data, 'base64'));
    } catch (err) {
      console.error('[security] Failed to decrypt session cookie:', err.message);
      return null;
    }
  }
  // Legacy plaintext value or unavailable safeStorage path.
  return stored.data;
}

let mainWindow;
let backendUrl = process.env.BACKEND_URL || 'https://launchdb-production.up.railway.app';
let syncEngine = null;
let syncInterval = null;

function createWindow(isLogin = false) {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  const file = isLogin ? 'login.html' : 'index.html';
  const filePath = path.join(__dirname, 'renderer', file);
  mainWindow.loadFile(filePath);

  // Open DevTools in development (comment out for production)
  // mainWindow.webContents.openDevTools();

  // M-2 (Wave 99): prevent renderer from navigating to external URLs.
  // All legitimate navigation (login -> index) uses window.location.href with
  // local file:// paths.  Block anything that isn't a file:// URL.
  mainWindow.webContents.on('will-navigate', (event, navUrl) => {
    try {
      const parsed = new URL(navUrl);
      if (parsed.protocol !== 'file:') {
        event.preventDefault();
        console.warn('[security] Blocked navigation to non-file URL:', navUrl);
      }
    } catch (_) {
      event.preventDefault();
    }
  });

  // M-2 (Wave 99): block window.open() calls that would open external windows.
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    initializeSyncListeners();
  });

  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Launch Fiber Desktop',
          click: () => {
            // Could show an about dialog here
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
  const session = store.get('session');
  const isLogin = !session;
  createWindow(isLogin);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    const session = store.get('session');
    const isLogin = !session;
    createWindow(isLogin);
  }
});

// IPC Handlers

ipcMain.handle('auth:login', async (event, { server, username, password }) => {
  try {
    // H-1 (Wave 99): validate the user-supplied server URL before any fetch.
    // Rejects non-https, RFC-1918 addresses, and URLs with path components.
    const validation = validateServerUrl(server);
    if (!validation.ok) {
      return { success: false, error: validation.error };
    }
    // Use only the validated origin for all subsequent operations — not the raw input.
    const safeServer = validation.origin;

    const response = await fetch(`${safeServer}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      return { success: false, error: 'Login failed' };
    }

    const data = await response.json();
    const setCookie = response.headers.get('set-cookie');

    // H-2 (Wave 99): encrypt session cookie at rest using the OS credential store.
    // encryptCookie() uses safeStorage (DPAPI/Keychain) when available and falls
    // back to plaintext with a warning when unavailable (e.g. headless Linux).
    const encryptedCookie = encryptCookie(setCookie || '');

    // Migrate any pre-existing plaintext cookie on first login after upgrade.
    const existingSession = store.get('session');
    if (existingSession && existingSession.cookie && typeof existingSession.cookie === 'string') {
      // Old plaintext format — re-encrypt in place before overwriting.
      store.set('session', {
        ...existingSession,
        cookie: encryptCookie(existingSession.cookie),
      });
    }

    // Store session — safeServer (validated origin) replaces raw user input.
    store.set('session', {
      server: safeServer,
      username,
      cookie: encryptedCookie,
      user: data.user,
      timestamp: Date.now(),
    });

    // Store validated backend URL for future requests.
    store.set('backendUrl', safeServer);

    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('auth:logout', () => {
  store.delete('session');
  store.delete('backendUrl');
  return { success: true };
});

ipcMain.handle('auth:get-session', () => {
  const session = store.get('session');
  if (session) {
    backendUrl = store.get('backendUrl') || backendUrl;
    // H-2: decrypt the cookie before returning to the renderer (renderer only
    // ever sees the decrypted string; it never touches the encrypted object).
    if (session.cookie && typeof session.cookie === 'object' && 'encrypted' in session.cookie) {
      return { ...session, cookie: decryptCookie(session.cookie) };
    }
  }
  return session || null;
});

// H-2: helper to read the session from store and return a decrypted cookie string.
// All IPC handlers that need to send the cookie to the backend use this so they
// never accidentally send the raw encrypted object as a Cookie header value.
function getSessionWithDecryptedCookie() {
  const session = store.get('session');
  if (!session) return null;
  const rawCookie = session.cookie;
  const cookieStr =
    rawCookie && typeof rawCookie === 'object' && 'encrypted' in rawCookie
      ? decryptCookie(rawCookie)
      : rawCookie || '';
  return { ...session, cookie: cookieStr };
}

ipcMain.handle('workspace:list-projects', async (event) => {
  try {
    const session = getSessionWithDecryptedCookie();
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const url = `${session.server}/api/projects?leaves_only=true`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie: session.cookie || '',
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch projects' };
    }

    const projects = await response.json();
    return { success: true, projects };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('workspace:fetch-tree', async (event, { root = 'user' }) => {
  try {
    const session = getSessionWithDecryptedCookie();
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const url = `${session.server}/api/workspace/tree?root=${root}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie: session.cookie || '',
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch workspace tree' };
    }

    const tree = await response.json();
    return { success: true, tree };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Sync handlers

ipcMain.handle('sync:get-local-root', () => {
  return store.get('localRootPath') || null;
});

ipcMain.handle('sync:set-local-root', async (event, folderPath) => {
  try {
    store.set('localRootPath', folderPath);
    return { success: true, path: folderPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('sync:pick-folder', async () => {
  if (!mainWindow) {
    return { success: false, error: 'No window' };
  }

  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      message: 'Select a folder to sync with Launch Fiber',
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'No folder selected' };
    }

    const folderPath = result.filePaths[0];
    store.set('localRootPath', folderPath);
    return { success: true, path: folderPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('sync:now', async () => {
  try {
    const session = getSessionWithDecryptedCookie();
    const localRootPath = store.get('localRootPath');

    if (!session || !localRootPath) {
      return {
        success: false,
        error: 'Not authenticated or no folder selected',
      };
    }

    if (!syncEngine) {
      syncEngine = new SyncEngine(session.server, session.cookie);
    }

    const result = await syncEngine.runSync(localRootPath);

    if (mainWindow) {
      mainWindow.webContents.send('sync:completed', result);
    }

    return result;
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('sync:status', () => {
  if (!syncEngine) {
    return {
      lastSyncAt: null,
      isRunning: false,
      errors: [],
      conflicts: [],
      events: [],
    };
  }

  return syncEngine.getSyncStatus();
});

// M-3 (Wave 99): guard against re-registering the sync:online listener on
// every did-finish-load event (login->index navigation fires it twice).
// Using a module-level flag and ipcMain.once prevents listener accumulation
// and the resulting MaxListenersExceededWarning / multiple-toast bug.
let syncOnlineListenerRegistered = false;

/**
 * Initialize sync listeners and timers.
 * Safe to call multiple times -- guarded against duplicate registration.
 */
function initializeSyncListeners() {
  if (!mainWindow) return;

  // M-3: Only register sync:online once; subsequent did-finish-load calls skip.
  if (!syncOnlineListenerRegistered) {
    syncOnlineListenerRegistered = true;
    ipcMain.on('sync:online', () => {
      showSyncCountdownToast();
    });
  }

  if (!syncInterval) {
    syncInterval = setInterval(async () => {
      const session = getSessionWithDecryptedCookie();
      const localRootPath = store.get('localRootPath');

      if (session && localRootPath) {
        if (!syncEngine) {
          syncEngine = new SyncEngine(session.server, session.cookie);
        }

        const result = await syncEngine.runSync(localRootPath);
        if (mainWindow) {
          mainWindow.webContents.send('sync:completed', result);
        }
      }
    }, 15 * 60 * 1000);
  }
}

/**
 * Show countdown toast for sync
 */
function showSyncCountdownToast() {
  if (!mainWindow) return;

  mainWindow.webContents.send('sync:countdown-start', {
    seconds: 5,
    message: 'Syncing in 5s... (click to cancel)',
  });
}

// Clean up interval on app quit
app.on('before-quit', () => {
  if (syncInterval) {
    clearInterval(syncInterval);
  }
});

// Export security functions for unit testing (main.js is not require()'d in
// production -- Electron loads it as the entry point -- but tests can exercise
// the pure validation logic by requiring this file with Electron mocked).
if (typeof module !== 'undefined') {
  module.exports = { validateServerUrl, encryptCookie, decryptCookie };
}
