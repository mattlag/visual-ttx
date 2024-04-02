// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// preload.ts, specifying (args: any) was throwing a compilation error, and 
// (args) was throwing a ts type warning... So now it's preload.js

const { contextBridge, ipcRenderer } = require('electron'); //eslint-disable-line

const api = {
	handleLoadFile: (args) => ipcRenderer.invoke('handleLoadFile', args),
	handleSaveTTXFile: (args) => ipcRenderer.invoke('handleSaveTTXFile', args),
	handleSaveFontFile: (args) => ipcRenderer.invoke('handleSaveFontFile', args),
};

contextBridge.exposeInMainWorld('vttxApi', api);
