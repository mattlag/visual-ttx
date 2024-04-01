import * as React from 'react';
import { xmlTextToDoc } from '../../src/lib/xmlTextToDoc';
import { FileInfo } from '../../src/main/files';
import CodeEditor from './CodeEditor/CodeEditor';
import TableDisplay from './tables/TableDisplay';
import TableTabs from './tables/TableTabs';

let loadedFile: FileInfo;
export default function App() {
	const [ttxData, setTtxData] = React.useState('<!-- load a file -->');
	const [xmlDoc, setXmlDoc] = React.useState(new Document());
	const [selectedEditorTab, selectEditorTab] = React.useState('visual');
	const [selectedTableTab, selectTableTab] = React.useState('_load_file_');

	const visualTabContents = (
		<>
			<div className="table-layout">
				<TableTabs
					xmlDoc={xmlDoc}
					selectedTableTab={'' + selectedTableTab}
					selectTableTab={selectTableTab}
				/>
				<TableDisplay
					xmlDoc={xmlDoc}
					selectedTableTab={'' + selectedTableTab}
				/>
			</div>
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
					<button onClick={loadFile} title="Load a file">
						<img src="action_open_file.svg"></img>
					</button>
					<span>&emsp;</span>
					<button onClick={saveTTXFile} title="Save XML file">
						<img src="action_save_ttx.svg"></img>
					</button>
					<button onClick={saveFontFile} title="Save Font file">
						<img src="action_save_otf.svg"></img>
					</button>
				</div>
			</header>
			<main>
				{selectedEditorTab === 'visual' ? visualTabContents : xmlTabContents}
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
		selectTableTab('GlyphOrder');
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
		selectEditorTab('visual');
		document.getElementById('tab-visual').classList.add('selected');
		document.getElementById('tab-xml').classList.remove('selected');
	}
	function handleClickOnTabXML() {
		selectEditorTab('xml');
		document.getElementById('tab-xml').classList.add('selected');
		document.getElementById('tab-visual').classList.remove('selected');
	}

	return appJsx;
}
