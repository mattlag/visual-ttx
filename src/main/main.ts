import { app, BrowserWindow, ipcMain, session } from 'electron';
import os from 'node:os';
import path from 'path';
import {
	FileInfo,
	handleLoadFile,
	handleSaveFontFile,
	handleSaveTTXFile,
} from './files';

declare global {
	interface Window {
		vttxApi?: {
			handleLoadFile?: (filePath?: string) => FileInfo;
			handleSaveTTXFile?: (fileInfo: FileInfo) => void;
			handleSaveFontFile?: (fileInfo: FileInfo) => void;
		};
	}
}

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
			preload: path.join(__dirname, '../../src/preload.js'),
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
app.whenReady().then(async () => {
	// const extensionResult = await session.defaultSession.loadExtension(
	// 	path.join(
	// 		os.homedir(),
	// 		'AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\5.0.2_0'
	// 	)
	// );
	// console.log(extensionResult);

	/*
	 * IPC Handlers
	 */
	ipcMain.handle('handleLoadFile', async (event, args) => {
		// console.log(`START main.ts - handleLoadFile`);
		// console.log(args);
		const result = await handleLoadFile(args);
		// console.log(result.content.length);
		// console.log(`END main.ts - handleLoadFile`);
		return result;
	});
	ipcMain.handle('handleSaveTTXFile', async (event, args) => {
		return await handleSaveTTXFile(args);
	});
	ipcMain.handle('handleSaveFontFile', async (event, args) => {
		return await handleSaveFontFile(args);
	});

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
