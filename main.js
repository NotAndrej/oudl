// main.js
const { app, shell, BrowserWindow, dialog, Menu, ipcMain, clipboard } = require('electron')
const Store = require('electron-store').default
const path = require('path')
const fs = require('fs')
const os = require('os')
const discordRPC = require('./discordrpc.js')
const https = require('https')

// Default settings
const store = new Store({
  defaults: {
    discordRPC: true,
    autoUpdate: true,
    confirmQuit: true,
    lastUpdateCheck: null,
    forceHWAccel: false,
    devMode: false
  }
})

// Settings reset handler
ipcMain.handle('reset-settings', () => {
  store.clear()
  app.relaunch()
  app.exit(0)
})

let mainWindow = null
let settingsWin = null
let aboutWin = null

// Update checker
function shouldCheckForUpdates() {
  const last = store.get('lastUpdateCheck')
  if (!last) return true
  const TEN_MIN = 10 * 60 * 1000
  return Date.now() - last > TEN_MIN
}

function checkForUpdates(manual = false) {
  https.get(
    'https://raw.githubusercontent.com/NotAndrej/oudl/refs/heads/main/version.json',
    res => {
      let data = ''
      res.on('data', d => (data += d))
      res.on('end', () => {
        try {
          const remote = JSON.parse(data)
          const local = app.getVersion()
          if (remote.version !== local) {
            dialog.showMessageBox({
              type: 'info',
              title: 'Update available',
              message: `Update available!\n\nInstalled: ${local}\nLatest: ${remote.version}`,
              detail: remote.notes || '',
              buttons: ['Open GitHub', 'Later', 'Never']
            }).then(r => {
              if (r.response === 0) {
                shell.openExternal('https://github.com/NotAndrej/oudl/releases/latest')
              }
              if (r.response === 2) {
                store.set('autoUpdate', false)
              }
            })
          } else if (manual) {
             dialog.showMessageBox({
             type: 'info',
             title: 'No updates available',
              message: "You're already up to date"
          })
        }
          store.set('lastUpdateCheck', Date.now())
        } catch {
          if (manual) dialog.showErrorBox('Update check failed', 'Invalid version data')
        }
      })
    }
  ).on('error', () => {
    if (manual) dialog.showErrorBox('Update check failed', 'Network error')
  })
}

// Runtime info
function showRuntimeInfo() {
  const v = process.versions

  dialog.showMessageBox({
    type: 'info',
    title: 'Runtime Information',
    message: 'OUDL Runtime Info',
    detail:
      `OUDL: ${app.getVersion()}\n` +
      `Electron: ${v.electron}\n` +
      `Chromium: ${v.chrome}\n` +
      `Node.js: ${v.node}\n` +
      `V8: ${v.v8}\n` +
      `OS: ${process.platform} ${process.arch}`
  })
}

// System info dumper
function dumpSystemInfo() {
  const info = {
    app: { name: app.getName(), version: app.getVersion() },
    runtime: process.versions,
    system: {
      platform: process.platform,
      arch: process.arch,
      release: os.release(),
      cpu: os.cpus()[0]?.model,
      cores: os.cpus().length,
      memoryMB: Math.round(os.totalmem() / 1024 / 1024)
    },
    gpu: app.getGPUFeatureStatus(),
    flags: { forceHWAccel: store.get('forceHWAccel') },
    timestamp: new Date().toISOString()
  }

const filePath = path.join(
  app.getPath('documents'),
  'oudl-system-info.json'
)

const json = JSON.stringify(info, null, 2)
fs.writeFileSync(filePath, json)
clipboard.writeText(json)

  dialog.showMessageBox({
    type: 'info',
    message: 'System info dumped',
    detail: 'Saved to Documents and copied to clipboard'
  })
}

// Main Window
const createWindow = () => {
  if (mainWindow) return
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, 'build/icon.png'),
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  })
// Load openfront.io
  mainWindow.loadURL('https://openfront.io/')
  mainWindow.webContents.on('did-fail-load', (_e, errorCode) => {
    if (errorCode !== -3) mainWindow.loadFile('offline.html')
  })
  mainWindow.on('closed', () => (mainWindow = null))
}

// Settings Window
const createSettingsWindow = () => {
  if (settingsWin) return settingsWin.focus()
  settingsWin = new BrowserWindow({
    width: 420,
    height: 500,
    resizable: false,
    title: 'OUDL Settings',
    backgroundColor: '#111',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  })
  settingsWin.loadFile('settings.html')
  settingsWin.on('closed', () => (settingsWin = null))
}

// About Window 
const createAboutWindow = () => {
  if (aboutWin) return aboutWin.focus()
  aboutWin = new BrowserWindow({
    width: 420,
    height: 654,
    resizable: false,
    title: 'About OUDL',
    backgroundColor: '#111',
    webPreferences: {
      contextIsolation: true,
      sandbox: true
    }
  })
  aboutWin.loadFile('about.html')
  aboutWin.on('closed', () => (aboutWin = null))
}

// Start Discord RPC
ipcMain.handle('get-setting', (_, key) => store.get(key))
ipcMain.handle('set-setting', (_, key, value) => {
  store.set(key, value)
  if (key === 'discordRPC') value ? discordRPC.start() : discordRPC.stop()
})

// Options Menu
const template = [
  {
    label: 'Options',
    submenu: [
      { label: 'Settings', accelerator: 'Ctrl+,', click: createSettingsWindow },
      { label: 'Check for Updates', click: () => checkForUpdates(true) },
      { label: 'Refresh', click: () => mainWindow?.webContents.reload() },
      {
        label: 'Toggle Fullscreen',
        accelerator: 'F11',
        click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen())
      },
      { label: 'About', click: createAboutWindow },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click: () => {
          if (!store.get('confirmQuit')) return app.quit()
          const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            buttons: ['Quit', 'Cancel'],
            defaultId: 1,
            cancelId: 1,
            title: 'Quit OUDL',
            message: 'You sure you wanna quit?'
          })
          if (choice === 0) app.quit()
        }
      }
    ]
  }
]

// Developer Menu
const devMenu = {
  label: 'Dev Options',
  submenu: [
    {
      label: 'GPU Information',
      click: () => {
        const win = new BrowserWindow({ width: 800, height: 600 })
        win.loadURL('chrome://gpu')
      }
    },
    {
      label: 'Runtime Info',
      click: () => showRuntimeInfo()
    },
    { type: 'separator' },
    {
      label: 'Clear Cache',
      click: async () => {
        await mainWindow?.webContents.session.clearCache()
      }
    },
    {
      label: 'Dump System Info',
      click: () => dumpSystemInfo()
    },
    { type: 'separator' },
    {
      label: 'Force Hardware Acceleration',
      type: 'checkbox',
      checked: store.get('forceHWAccel', false),
      click: item => {
        store.set('forceHWAccel', item.checked)
         dialog.showMessageBox({
           type: 'info',
           title: 'Restart Required',
            message: 'Restart required to apply changes.'
       })
      }
    }
  ]
}

// Force hardware acceleration
app.whenReady().then(() => {
  if (store.get('forceHWAccel')) {
    app.commandLine.appendSwitch('ignore-gpu-blacklist')
    app.commandLine.appendSwitch('enable-gpu-rasterization')
    app.commandLine.appendSwitch('enable-zero-copy')
  }
  createWindow()
  if (store.get('discordRPC')) discordRPC.start()
  if (store.get('autoUpdate') && shouldCheckForUpdates()) checkForUpdates()

  if (store.get('devMode')) {
    template.push(devMenu)
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
})