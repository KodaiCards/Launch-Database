const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  logout: () => ipcRenderer.invoke('auth:logout'),
  getSession: () => ipcRenderer.invoke('auth:get-session'),
  listProjects: () => ipcRenderer.invoke('workspace:list-projects'),
  fetchWorkspaceTree: (options = {}) =>
    ipcRenderer.invoke('workspace:fetch-tree', options),
  syncGetLocalRoot: () => ipcRenderer.invoke('sync:get-local-root'),
  syncSetLocalRoot: (path) => ipcRenderer.invoke('sync:set-local-root', path),
  syncPickFolder: () => ipcRenderer.invoke('sync:pick-folder'),
  syncNow: () => ipcRenderer.invoke('sync:now'),
  syncGetStatus: () => ipcRenderer.invoke('sync:status'),
  onSyncCompleted: (callback) => ipcRenderer.on('sync:completed', (event, result) => callback(result)),
  onSyncCountdownStart: (callback) =>
    ipcRenderer.on('sync:countdown-start', (event, data) => callback(data)),
  sendSyncOnline: () => ipcRenderer.send('sync:online'),
});
