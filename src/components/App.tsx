import * as React from 'react';
import CodeEditor from './CodeEditor/CodeEditor';
import { FileInfo } from '../../src/main/files';

let loadedFile:FileInfo;
export default function App() {
	const [ttxData, setTtxData] = React.useState('<!--file contents-->');

	async function loadFile() {
		setTtxData('<!--Awaiting file...-->');
		loadedFile = await window.vttxApi.handleLoadFile();
		console.log(`APP loadFile returned:`);
		console.log(loadedFile);
		document.querySelector('h1').innerHTML = `vttx: ${loadedFile.name}`;
		setTtxData(loadedFile.content);
	}

	function saveTTXFile() {
		console.log('saveTTXFile');
		console.log(loadedFile);
		const saveFile = loadedFile;
		saveFile.content = ttxData;
		window.vttxApi.handleSaveTTXFile(saveFile);
	}

	function saveFontFile() {
		console.log('saveFontFile');
		console.log(loadedFile);
		const saveFile = loadedFile;
		saveFile.content = ttxData;
		window.vttxApi.handleSaveFontFile(saveFile);
	}

	return (
		<>
			<h1>vttx</h1>
			<br></br>
			<button onClick={loadFile}>Load a file</button>
			<span>&emsp;</span>
			<button onClick={saveTTXFile}>Save XML file</button>
			<button onClick={saveFontFile}>Save Font file</button>
			<br></br>
			<br></br>
			<CodeEditor ttxData={ttxData} setTtxData={setTtxData} />
		</>
	);
}
