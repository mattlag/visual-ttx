import { dialog } from 'electron';
import fs from 'fs';
const { ttx } = require('@web-alchemy/fonttools');

export async function handleLoadFile() {
	const ttxExtensions = ['ttx', 'otx', 'xml'];
	const fontExtensions = ['otf', 'ttf', 'woff', 'woff2'];
	// const path = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		title: 'Select a font file or a TTX XML file',
		filters: [
			{ name: 'Font files', extensions: fontExtensions },
			{ name: 'TTX XML files', extensions: ttxExtensions },
		],
	});

	if (canceled) return 'CANCELED';

	const stringPath = filePaths[0];
	const suffix = stringPath.split('.').at(-1).toLowerCase();
	console.log(stringPath);
	console.log(`file type: ${suffix}`);

	let content = `unsupported file type ${suffix}`;
	if (ttxExtensions.includes(suffix)) {
		console.log('Identified as ttx');
		content = fs.readFileSync(stringPath, { encoding: 'utf8' });
	}

	if (fontExtensions.includes(suffix)) {
		console.log('Identified as font');
		content = await ttx(stringPath);
		content = Buffer.from(content).toString();
	}

	return content;
}
