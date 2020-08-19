const { app, Menu, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

let win

function saveFile() {
  const folderPath = path.join(__dirname, 'sandbox')
  fs.mkdirSync(folderPath,{recursive:true})
  fs.writeFileSync(path.join(folderPath, 'test.txt'), 'test')
}

function setAppMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => saveFile() },
        {
          accelerator: 'CmdOrCtrl+O',
          click: () => {},
          enabled: false,
          label: 'Open'
        }
      ]
    }
  ]
  if (process.platform === 'darwin') {
    template.unshift({
      label: 'Test',
      submenu: [{ label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }]
    })
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
  }
  })
  win.loadURL('about:blank')

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  )
  setAppMenu()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
