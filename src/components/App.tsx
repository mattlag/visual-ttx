import * as React from 'react';
import { XMLtoJSON } from '../../src/lib/XMLtoJSON';
import { FileInfo } from '../../src/main/files';
import TableDisplay from './tables/TableDisplay';

let loadedFile: FileInfo;
export default function App() {
	const [ttxData, setTtxData] = React.useState('<!--file contents-->');
	const [xmlDoc, setXmlDoc] = React.useState(new Document());

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
			<div className="table-wrapper">
				{xmlDoc?.childNodes &&
					Array.from(xmlDoc.childNodes)
						.filter((node) => node.nodeName !== '#text')
						.map((node) => <TableDisplay key={node.nodeName} data={node} />)}
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
		const xmlDoc = XMLtoJSON(loadedFile.content).documentElement;
		console.log(xmlDoc.childNodes);
		setXmlDoc(xmlDoc);
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
