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
			<header>
				<h1 id="app-title">vttx</h1>
				<div id="app-tabs"></div>
				<div id="app-actions">
					<button onClick={loadFile}>Load a file</button>
					<span>&emsp;</span>
					<button onClick={saveTTXFile}>Save XML file</button>
					<button onClick={saveFontFile}>Save Font file</button>
				</div>
			</header>
			<main className="scroll-content">
				{loadedFile?.name && <h1>{loadedFile.name}</h1>}
				{xmlDoc?.children &&
					Array.from(xmlDoc.children).map((node) => (
						<TableDisplay key={node.nodeName} data={node} />
					))}
			</main>
		</>
	);

	async function loadFile() {
		setTtxData('<!--Awaiting file...-->');
		loadedFile = await window.vttxApi.handleLoadFile();
		console.log(`APP loadFile returned:`);
		console.log(loadedFile);
		setTtxData(loadedFile.content);
		const xmlDoc = XMLtoJSON(loadedFile.content).documentElement;
		console.log(xmlDoc.children);
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
