import * as React from 'react';
import { xmlTextToDoc } from '../../src/lib/xmlTextToDoc';
import { FileInfo } from '../../src/main/files';
import CodeEditor from './CodeEditor/CodeEditor';
import TableDisplay from './tables/TableDisplay';

let loadedFile: FileInfo;
export default function App() {
	const [ttxData, setTtxData] = React.useState('<!--file contents-->');
	const [xmlDoc, setXmlDoc] = React.useState(new Document());
	const [selectedTab, selectTab] = React.useState('visual');

	const visualTabContents = (
		<>
			{loadedFile?.name && <h1>{loadedFile.name}</h1>}
			{xmlDoc?.children &&
				Array.from(xmlDoc.children).map((node) => (
					<TableDisplay key={node.nodeName} data={node} />
				))}
		</>
	);

	const xmlTabContents = (
		<CodeEditor ttxData={ttxData} setTtxData={setTtxData} />
	);

	const appJsx = (
		<>
			<header>
				<h1 id="app-title">vttx</h1>
				<div id="app-tabs">
					<button
						id="tab-visual"
						className="tab selected"
						onClick={handleClickOnTabVisual}
					>
						Visual
					</button>
					<button id="tab-xml" className="tab" onClick={handleClickOnTabXML}>
						XML
					</button>
				</div>
				<div id="app-actions">
					<button onClick={loadFile}>Load a file</button>
					<span>&emsp;</span>
					<button onClick={saveTTXFile}>Save XML file</button>
					<button onClick={saveFontFile}>Save Font file</button>
				</div>
			</header>
			<main className="scroll-content">
				{selectedTab === 'visual' ? visualTabContents : xmlTabContents}
			</main>
		</>
	);

	async function loadFile() {
		setTtxData('<!--Awaiting file...-->');
		loadedFile = await window.vttxApi.handleLoadFile();
		console.log(`APP loadFile returned:`);
		console.log(loadedFile);
		setTtxData(loadedFile.content);
		const xmlDoc = xmlTextToDoc(loadedFile.content).documentElement;
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

	function handleClickOnTabVisual() {
		selectTab('visual');
		document.getElementById('tab-visual').classList.add('selected');
		document.getElementById('tab-xml').classList.remove('selected');
	}
	function handleClickOnTabXML() {
		selectTab('xml');
		document.getElementById('tab-xml').classList.add('selected');
		document.getElementById('tab-visual').classList.remove('selected');
	}

	return appJsx;
}
