import { BrowserWindow, dialog } from 'electron';

export function vttxLoadFile() {
	const result = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow());
	console.log(result);
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
	console.log(`FILES.TS > getData()`);
	return 'Example data from files.ts';
}
