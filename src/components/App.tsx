import * as React from 'react';
import { xmlTextToDoc } from '../../src/lib/xmlTextToDoc';
import { FileInfo } from '../../src/main/files';
import CodeEditor from './CodeEditor/CodeEditor';
import DropTarget from './DropTarget';
import TableDisplay from './VisualEditor/TableDisplay';
import TableTabs from './VisualEditor/TableTabs';

export const vttxContext = React.createContext(null);

export default function App() {
	// File data
	const [xmlDoc, setXmlDoc] = React.useState(new Document());
	const [loadedFilePath, setLoadedFilePath] = React.useState('');
	const [loadedFileName, setLoadedFileName] = React.useState('');

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

	function getXmlAsText(scrubVttxIds = false) {
		let exportDoc:Document = xmlDoc;

		function scrubVttxIdsFromNode(node: Element) {
			node.removeAttribute('vttx-node');
			Array.from(node.children).forEach((child) => scrubVttxIdsFromNode(child));
		}

		if (scrubVttxIds) {
			exportDoc = xmlDoc.cloneNode(true).ownerDocument;
			scrubVttxIdsFromNode(exportDoc.documentElement);
		}
		const xmlString = new XMLSerializer().serializeToString(exportDoc);
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
			<vttxContext.Provider
				value={{ loadFile, setupLoadedFile, updateNodeText }}
			>
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
			</vttxContext.Provider>
		</>
	);

	function updateNodeText(nodeID: string, newText: string) {
		const node = xmlDoc.querySelectorAll(`[vttx-node="${nodeID}"]`)[0];
		const depth = parseInt(node.getAttribute('vttx-node').split('-')[1]);
		let indent = ''; 
		for (let i = 0; i < depth; i++) indent += '  ';
		node.innerHTML = `\n${indent}  ${newText}\n${indent}`;
		if (node.nodeName === 'CharString') {
			node.innerHTML = node.innerHTML.replaceAll('\n', '\n          ');
			node.innerHTML = node.innerHTML.replaceAll(
				'                ',
				'      '
			);
		}
	}
 
	/*
		Loading files
	*/
	async function loadFile() {
		// console.log(`START App.tsx - loadFile`);
		const fileInfo = await window.vttxApi.handleLoadFile();
		// console.log(fileInfo);
		await setupLoadedFile(fileInfo);
		// console.log(`END App.tsx - loadFile`);
	}

	async function setupLoadedFile(fileInfo: FileInfo) {
		// console.log(`START App.tsx - setupLoadedFile`);
		// console.log(`Passed file:`);
		// console.log(fileInfo);

		// Set the Path and Name
		setLoadedFilePath(fileInfo.path);
		setLoadedFileName(fileInfo.name);

		// Set the XML Doc
		const xmlDoc = xmlTextToDoc(fileInfo.content).documentElement;
		let idNumber = 0;
		let depth = 0;
		function setVttxIdsForNode(node: Element) {
			node.setAttribute('vttx-node', `id-${depth}-${idNumber}`);
			idNumber++;
			depth++;
			Array.from(node.children).forEach((child) => setVttxIdsForNode(child));
			depth--;
		}
		setVttxIdsForNode(xmlDoc);
		setXmlDoc(xmlDoc);
		// console.log(xmlDoc);

		// Reset UI states
		selectTableTab('GlyphOrder');
		setIsFileLoaded(true);

		// console.log(`END App.tsx - setupLoadedFile`);
	}

	/*
		Saving files
	*/
	function saveTTXFile() {
		// console.log('saveTTXFile');
		const saveFile = {
			content: getXmlAsText(true),
			name: loadedFileName,
			path: loadedFilePath,
		};
		const result = window.vttxApi.handleSaveTTXFile(saveFile);
		// console.log(result);
		return result;
	}

	function saveFontFile() {
		// console.log('saveFontFile');
		const saveFile = {
			content: getXmlAsText(true),
			name: loadedFileName,
			path: loadedFilePath,
		};
		const result = window.vttxApi.handleSaveFontFile(saveFile);
		// console.log(result);
		return result;
	}

	return appJsx;
}
