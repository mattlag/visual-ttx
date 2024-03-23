import { BrowserWindow, dialog } from 'electron';
import { readFileSync } from 'fs';

export function loadFile() {
	const path = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow());
	console.log(path[0]);
	const content = readFileSync(path[0], { encoding: 'utf8' });
	return content;
}

export function getData() {
	return 'Example data from files.ts';
}
