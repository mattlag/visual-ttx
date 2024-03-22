// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Shows as an error for some reason
// eslint-disable-next-line
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vttxApi', {
	getData: () => {
		const result = ipcRenderer.sendSync('getData');
		return result;
	},
	loadFile: () => {
		const result = ipcRenderer.sendSync('loadFile');
		return result;
	},
});
