import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { getData, vttxLoadFile } from './files';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1920,
		height: 1080,
		autoHideMenuBar: true,
		icon: path.join(__dirname, '../../public/icon.ico'),
		webPreferences: {
			preload: path.join(__dirname, '../../src/preload.ts'),
		},
	});

	// and load the index.html of the app.
	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile(
			path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
		);
	}
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	// installExtension(REACT_DEVELOPER_TOOLS)
	// 	.then((name) => console.log(`Added Extension:  ${name}`))
	// 	.catch((err) => console.log('An error occurred: ', err));

	/*
	 * IPC Handlers
	 */
	ipcMain.handle('getData', () => {
		console.log(`MAIN.TS > ipcMain.handle('getData'`);
		getData();
	});
	ipcMain.on('getData', (event, arg) => {
		console.log(`MAIN.TS > ipcMain.on('getData')`);
		const result = getData();
		console.log(`MAIN.TS > ${result}`);
		event.returnValue = result;
	});
	// ipcMain.handle('vttxLoadFile', vttxLoadFile);
	ipcMain.on('vttxLoadFile', vttxLoadFile);

	/*
	 * Create Window
	 */
	createWindow();
	BrowserWindow.getFocusedWindow().webContents.openDevTools();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
