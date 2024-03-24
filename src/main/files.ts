import { BrowserWindow, dialog } from 'electron';
import { readFileSync } from 'fs';

export function loadFile() {
	const path = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
		title: 'Select a font file or a TTX XML file',
		filters: [
			{ name: 'Font files', extensions: ['otf', 'ttf', 'woff', 'woff2'] },
			{ name: 'TTX XML files', extensions: ['ttx', 'otx', 'xml'] },
		],
	});
	console.log(path[0]);
	const content = readFileSync(path[0], { encoding: 'utf8' });
	return content;
}

export function getData() {
	return 'Example data from files.ts';
}
