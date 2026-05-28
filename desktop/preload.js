const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  logout: () => ipcRenderer.invoke('auth:logout'),
  getSession: () => ipcRenderer.invoke('auth:get-session'),
  listProjects: () => ipcRenderer.invoke('workspace:list-projects'),
  fetchWorkspaceTree: (options = {}) =>
    ipcRenderer.invoke('workspace:fetch-tree', options),
});
