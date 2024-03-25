// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Shows as an error for some reason
// eslint-disable-next-line
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vttxApi', {
	handleLoadFile: () => ipcRenderer.invoke('handleLoadFile'),
});
