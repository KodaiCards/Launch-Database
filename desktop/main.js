const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
let backendUrl = process.env.BACKEND_URL || 'https://launchdb-production.up.railway.app';

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

  mainWindow.on('closed', () => {
    mainWindow = null;
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
    const response = await fetch(`${server}/api/auth/login`, {
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

    // Store session info
    store.set('session', {
      server,
      username,
      cookie: setCookie,
      user: data.user,
      timestamp: Date.now(),
    });

    // Store backend URL for future requests
    store.set('backendUrl', server);

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
  }
  return session || null;
});

ipcMain.handle('workspace:list-projects', async (event) => {
  try {
    const session = store.get('session');
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
    const session = store.get('session');
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
