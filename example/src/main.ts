import { app, Menu, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'

let win
let count = 0

function increment() {
	win.webContents.send('SEND_COUNT', ++count)
}

function decrement() {
	win.webContents.send('SEND_COUNT', --count)
}

function setAppMenu() {
	const template = [
		{
			label: 'Count',
			submenu: [
				{ label: 'Increment', accelerator: 'CmdOrCtrl+U', click: () => increment() },
				{ label: 'Decrement', accelerator: 'CmdOrCtrl+D', click: () => decrement() },
				{ label: 'Reset', accelerator: 'CmdOrCtrl+R', enabled: false, click: () => {} }
			]
		},
		{
			label: 'View',
			submenu: [
				{
					accelerator: 'Alt+Command+I',
					click: () => win.webContents.toggleDevTools(),
					label: 'Toggle Developer Tools'
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
			nodeIntegration: true,
		},
	})

	win.loadURL(
		// this.browserWindow.loadURL(`file://${__dirname}/../../../index.html`)
		url.format({
			pathname: path.join(__dirname, '../index.html'),
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
