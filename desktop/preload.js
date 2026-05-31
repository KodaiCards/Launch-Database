const { contextBridge, ipcRenderer } = require('electron');

// Preload runs for BOTH the cloud-app BrowserWindow AND the small config window.
// In the cloud-app window, the API surface gives the cloud frontend optional
// hooks (e.g. "open OS file dialog", "trigger sync") without exposing Node.
// In the config window, the same API is used by the lightweight setup UI.
//
// All channels are explicitly allowlisted — no generic invoke/send pass-through.
contextBridge.exposeInMainWorld('launchFiber', {
  // Identifier so cloud-app code can detect it's running inside Electron.
  isDesktop: true,
  platform: process.platform,

  // Sync
  syncRunNow: () => ipcRenderer.invoke('sync:run-now'),
  syncGetStatus: () => ipcRenderer.invoke('sync:status'),
  syncStop: () => ipcRenderer.invoke('sync:stop'),
  syncStart: () => ipcRenderer.invoke('sync:start'),
  syncSetInterval: (minutes) => ipcRenderer.invoke('sync:set-interval', minutes),
  syncGetLocalRoot: () => ipcRenderer.invoke('sync:get-local-root'),
  syncPickFolder: () => ipcRenderer.invoke('sync:pick-folder'),

  // Config
  configGetServerUrl: () => ipcRenderer.invoke('config:get-server-url'),
  configSetServerUrl: (url) => ipcRenderer.invoke('config:set-server-url', url),

  // OS shell
  openExternal: (url) => ipcRenderer.invoke('shell:open-external', url),

  // Sync events from main → renderer (subscribe with callback).
  onSyncCompleted: (callback) => {
    const handler = (_event, result) => callback(result);
    ipcRenderer.on('sync:completed', handler);
    return () => ipcRenderer.removeListener('sync:completed', handler);
  },
});

// Back-compat: the old setup screen used window.api.* — keep a thin shim
// for the small renderer/app.js config screen that still references it.
contextBridge.exposeInMainWorld('api', {
  configGetServerUrl: () => ipcRenderer.invoke('config:get-server-url'),
  configSetServerUrl: (url) => ipcRenderer.invoke('config:set-server-url', url),
  openExternal: (url) => ipcRenderer.invoke('shell:open-external', url),
});
