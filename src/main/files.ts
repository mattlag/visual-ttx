import { BrowserWindow, dialog } from 'electron';
import fs from 'fs';
const { ttx } = require('@web-alchemy/fonttools'); // eslint-disable-line

export interface FileInfo {
	content?: string;
	path?: string;
	name?: string;
	message?: string;
	suffix?: string;
}

export async function handleLoadFile() {
	const ttxExtensions = ['ttx', 'otx', 'xml'];
	const fontExtensions = ['otf', 'ttf', 'woff', 'woff2'];
	const result: FileInfo = {};

	const { canceled, filePaths } = await dialog.showOpenDialog({
		title: 'Select a font file or a TTX XML file',
		filters: [
			{ name: 'Font files', extensions: fontExtensions },
			{ name: 'TTX XML files', extensions: ttxExtensions },
		],
	});

	if (canceled) {
		result.message = 'Canceled';
		return result;
	}

	const stringPath = filePaths[0];
	result.path = stringPath;
	console.log(stringPath);

	const suffix = getSuffix(stringPath);
	result.suffix = suffix;
	console.log(`file type: ${suffix}`);

	const name = getFileName(stringPath);
	result.name = name;

	let message = `Unsupported file type ${suffix}`;
	if (ttxExtensions.includes(suffix)) {
		message = 'Identified as ttx';
		result.content = fs.readFileSync(stringPath, { encoding: 'utf8' });
	}

	if (fontExtensions.includes(suffix)) {
		message = 'Identified as font';
		const content = await ttx(stringPath);
		result.content = Buffer.from(content).toString();
	}

	console.log(message);
	result.message = message;
	return result;
}

export async function handleSaveTTXFile(fileInfo: FileInfo) {
	console.log('handleSaveTTXFile');
	console.log(fileInfo);
	const { canceled, filePath } = await dialog.showSaveDialog(
		BrowserWindow.getFocusedWindow(),
		{
			title: 'Save a TTX file',
			defaultPath: fileInfo.name || '',
			filters: [{ name: 'TTX Files', extensions: ['ttx'] }],
		}
	);

	let resolvedFilePath = filePath;
	if (getSuffix(filePath) !== 'ttx') resolvedFilePath += '.ttx';
	if (!canceled) {
		fs.writeFileSync(resolvedFilePath, fileInfo.content);
	}
}

export async function handleSaveFontFile(fileInfo: FileInfo) {
	const { canceled, filePath } = await dialog.showSaveDialog(
		BrowserWindow.getFocusedWindow(),
		{
			title: 'Save a font file',
			defaultPath: fileInfo.name || '',
			filters: [{ name: 'Font Files', extensions: ['ttf', 'otf'] }],
		}
	);

	const fontBuffer = await ttx(Buffer.from(fileInfo.content));

	if (!canceled) {
		fs.writeFileSync(filePath, fontBuffer);
	}
}

function getSuffix(path: string) {
	let suffix = path.split('.').at(-1);
	suffix = suffix.toLowerCase();
	return suffix;
}

function getFileName(path: string) {
	const name = path.split('\\').at(-1).split('.');
	let result = '';
	if (name.length > 1) {
		for (let i = 0; i < name.length - 1; i++) {
			result += name[i];
			if (i < name.length - 2) result += '.';
		}
	} else {
		result = name[0];
	}
	return result;
}
