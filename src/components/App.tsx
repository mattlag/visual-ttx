import * as React from 'react';
import { XMLtoJSON } from '../../src/lib/XMLtoJSON';
import { FileInfo } from '../../src/main/files';

let loadedFile: FileInfo;
export default function App() {
	const [ttxData, setTtxData] = React.useState('<!--file contents-->');
	const [jsonData, setJsonData] = React.useState({
		name: 'test',
		attributes: {},
		content: [],
	});

	const appJsx = (
		<>
			<h1>vttx</h1>
			<br></br>
			<button onClick={loadFile}>Load a file</button>
			<span>&emsp;</span>
			<button onClick={saveTTXFile}>Save XML file</button>
			<button onClick={saveFontFile}>Save Font file</button>
			<br></br>
			<br></br>
			{/*<CodeEditor ttxData={ttxData} setTtxData={setTtxData} />*/}
			<div id="table-wrapper">
				{jsonData.content.map(table => <h1 key={table.name}>{table.name}</h1>)}
			</div>
		</>
	);

	async function loadFile() {
		setTtxData('<!--Awaiting file...-->');
		loadedFile = await window.vttxApi.handleLoadFile();
		console.log(`APP loadFile returned:`);
		console.log(loadedFile);
		document.querySelector('h1').innerHTML = `vttx: ${loadedFile.name}`;
		setTtxData(loadedFile.content);
		const loadedData = XMLtoJSON(loadedFile.content);
		console.log(loadedData);
		setJsonData(loadedData);
		console.log(jsonData);
		const tableWrapper = document.getElementById('table-wrapper');
		loadedData.content.forEach((tlNode) => {
			console.log(tlNode.name);
		});
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

	return appJsx;
}
