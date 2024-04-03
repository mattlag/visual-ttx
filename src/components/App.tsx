import * as React from 'react';
import { xmlTextToDoc } from '../../src/lib/xmlTextToDoc';
import { FileInfo } from '../../src/main/files';
import CodeEditor from './CodeEditor/CodeEditor';
import DropTarget from './DropTarget';
import TableDisplay from './VisualEditor/TableDisplay';
import TableTabs from './VisualEditor/TableTabs';

export const loadedFileContext = React.createContext(null);

export default function App() {
	// File data
	const [xmlDoc, setXmlDoc] = React.useState(new Document());
	const [loadedFilePath, setLoadedFilePath] = React.useState('');

	// UI states
	const [isFileLoaded, setIsFileLoaded] = React.useState(false);
	const [selectedEditorTab, selectEditorTab] = React.useState('visual');
	const [selectedTableTab, selectTableTab] = React.useState('GlyphOrder');

	/*
		Visual-style editor
	*/
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

	/*
		Code-style editor
	*/
	const xmlTabContents = (
		<CodeEditor ttxData={getXmlAsText()} setTtxData={setXmlDocFromText} />
	);

	function getXmlAsText() {
		const xmlString = new XMLSerializer().serializeToString(xmlDoc);
		return xmlString;
	}

	function setXmlDocFromText(xmlString: string) {
		const xmlDoc = xmlTextToDoc(xmlString);
		setXmlDoc(xmlDoc);
	}

	/*
		Overall app skeleton
	*/
	const appJsx = (
		<>
			<loadedFileContext.Provider value={{ loadFile, setupLoadedFile }}>
				<header>
					<h1 id="app-title" title={loadedFilePath}>
						vttx
					</h1>
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
						<span>&emsp; </span>
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
					{isFileLoaded ? (
						selectedEditorTab === 'visual' ? (
							visualTabContents
						) : (
							xmlTabContents
						)
					) : (
						<DropTarget></DropTarget>
					)}
				</main>
			</loadedFileContext.Provider>
		</>
	);

	/*
		Loading files
	*/
	async function loadFile() {
		const fileInfo = await window.vttxApi.handleLoadFile();
		// console.log(fileInfo);
		await setupLoadedFile(fileInfo);
	}

	async function setupLoadedFile(fileInfo: FileInfo) {
		// console.log(`APP.TSX setupLoadedFile`);
		// console.log(`Passed file:`);
		// console.log(fileInfo);

		// Set the Path
		setLoadedFilePath(fileInfo.path);

		// Set the XML Doc
		const xmlDoc = xmlTextToDoc(fileInfo.content).documentElement;
		setXmlDoc(xmlDoc);

		// Reset UI states
		selectTableTab('GlyphOrder');
		setIsFileLoaded(true);
	}

	/*
		Saving files
	*/
	function saveTTXFile() {
		// console.log('saveTTXFile');
		const loadedFile = React.useContext(loadedFileContext);
		// console.log(loadedFile);
		const saveFile = loadedFile;
		saveFile.content = getXmlAsText();
		const result = window.vttxApi.handleSaveTTXFile(saveFile);
		console.log(result);
	}

	function saveFontFile() {
		// console.log('saveFontFile');
		const loadedFile = React.useContext(loadedFileContext);
		// console.log(loadedFile);
		const saveFile = loadedFile;
		saveFile.content = getXmlAsText();
		const result = window.vttxApi.handleSaveFontFile(saveFile);
		console.log(result);
	}

	return appJsx;
}
