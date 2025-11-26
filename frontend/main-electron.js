const { app, BrowserWindow, screen } = require('electron/main')
const path = require('node:path')

function createWindow () {
  const size = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width/2,
    height: size.height/2,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    }
  })
  win.loadFile(path.join(__dirname, '../frontend/dist/frontend/browser/index.csr.html'))
  // win.loadURL('http://localhost:4200')
}

app.whenReady().then(() => {
  if (app.isReady()) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
