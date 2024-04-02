import * as React from 'react';
import { xmlTextToDoc } from '../../src/lib/xmlTextToDoc';
import { FileInfo } from '../../src/main/files';
import CodeEditor from './CodeEditor/CodeEditor';
import TableDisplay from './tables/TableDisplay';
import TableTabs from './tables/TableTabs';

export const loadedFileContext = React.createContext(null);

const defaultFileInfo: FileInfo = {
	message: '-not-loaded-',
};

export default function App() {
	const [isFileLoaded, setIsFileLoaded] = React.useState(false);
	const [ttxData, setTtxData] = React.useState('<!-- load a file -->');
	const [xmlDoc, setXmlDoc] = React.useState(new Document());
	const [selectedEditorTab, selectEditorTab] = React.useState('visual');
	const [selectedTableTab, selectTableTab] = React.useState('_load_file_');

	const [loadedFile, setLoadedFile] = React.useState(defaultFileInfo);

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
			<loadedFileContext.Provider value={{ loadFile, markAsLoadedFile }}>
				<header>
					<h1 id="app-title">vttx</h1>
					<div id="app-tabs">
						{isFileLoaded && (
							<>
								<button
									id="tab-visual"
									className="tab selected"
									onClick={handleClickOnTabVisual}
								>
									Visual
								</button>
								<button
									id="tab-xml"
									className="tab"
									onClick={handleClickOnTabXML}
								>
									XML
								</button>
							</>
						)}
					</div>
					<div id="app-actions">
						<button onClick={loadFile} title="Load a file">
							<img src="action_open_file.svg"></img>
						</button>
						<span>&emsp;</span>
						<button
							onClick={saveTTXFile}
							disabled={!isFileLoaded}
							title="Save XML file"
						>
							<img src="action_save_ttx.svg"></img>
						</button>
						<button
							onClick={saveFontFile}
							disabled={!isFileLoaded}
							title="Save Font file"
						>
							<img src="action_save_otf.svg"></img>
						</button>
					</div>
				</header>
				<main>
					{selectedEditorTab === 'visual' ? visualTabContents : xmlTabContents}
				</main>
			</loadedFileContext.Provider>
		</>
	);

	async function loadFile() {
		const fileResult = await window.vttxApi.handleLoadFile();
		console.log(fileResult);
		await markAsLoadedFile(fileResult);
	}

	function saveTTXFile() {
		console.log('saveTTXFile');
		const loadedFile = React.useContext(loadedFileContext);
		console.log(loadedFile);
		const saveFile = loadedFile;
		saveFile.content = ttxData;
		const result = window.vttxApi.handleSaveTTXFile(saveFile);
		console.log(result);
	}

	function saveFontFile() {
		console.log('saveFontFile');
		const loadedFile = React.useContext(loadedFileContext);
		console.log(loadedFile);
		const saveFile = loadedFile;
		saveFile.content = ttxData;
		const result = window.vttxApi.handleSaveFontFile(saveFile);
		console.log(result);
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

	async function markAsLoadedFile(file: FileInfo) {
		console.log(`APP.TSX markAsLoadedFile`);
		console.log(`Passed file:`);
		console.log(file);
		setLoadedFile({ ...file });
		console.log(`after setLoadedFile:`);
		console.log(loadedFile);
		setTtxData(loadedFile.content);
		const xmlDoc = xmlTextToDoc(loadedFile.content).documentElement;
		console.log(xmlDoc.children);
		setXmlDoc(xmlDoc);
		selectTableTab('GlyphOrder');
		setIsFileLoaded(true);
	}

	return appJsx;
}
