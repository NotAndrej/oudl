// preload.js
const { contextBridge, ipcRenderer } = require('electron')

// Update check context bridge 
contextBridge.exposeInMainWorld('api', {
  checkForUpdates: () => ipcRenderer.send('check-for-updates')
})

// Settings context bridge 
contextBridge.exposeInMainWorld('settings', {
  get: (key) => ipcRenderer.invoke('get-setting', key),
  set: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  reset: () => ipcRenderer.invoke('reset-settings')
})