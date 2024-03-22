import { BrowserWindow, dialog } from 'electron';

export function loadFile() {
	const result = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow());
	return result;

	// dialog
	// 	.showOpenDialog(BrowserWindow.getFocusedWindow(), {
	// 		properties: ['openFile', 'openDirectory'],
	// 	})
	// 	.then((result) => {
	// 		console.log(result.canceled);
	// 		console.log(result.filePaths);
	// 		return result.filePaths;
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
}

export function getData() {
	return 'Example data from files.ts';
}
