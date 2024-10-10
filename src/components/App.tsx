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
	let xmlDocError = false;
	const [loadedFilePath, setLoadedFilePath] = React.useState('');
	const [loadedFileName, setLoadedFileName] = React.useState('');

	// UI states
	const [isFileLoaded, setIsFileLoaded] = React.useState(false);
	const [selectedEditorTab, selectEditorTab] = React.useState('visual');
	const [selectedTableTab, selectTableTab] = React.useState('GlyphOrder');

	/*
		Visual-style editor
	*/
	const visualTabContents = !xmlDocError ? (
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
	) : (
		<div className="warning-message">
			There is an XML syntax error that is preventing this data from being
			displayed.
		</div>
	);

	function handleClickOnTabVisual() {
		selectEditorTab('visual');
		document.getElementById('tab-visual').classList.add('selected');
		document.getElementById('tab-xml').classList.remove('selected');
		if (xmlDocError) {
			console.warn(
				'Previous changes were not saved due to the XML document being in a bad state or having a syntax error.'
			);
		}
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
		const sourceNode = xmlDoc.cloneNode(true);
		// @ts-expect-error Technically this is a `Node` but we know it has `Element` properties
		scrubVttxIdsFromNode(sourceNode);
		const xmlString = new XMLSerializer().serializeToString(sourceNode);
		return xmlString;
	}

	function scrubVttxIdsFromNode(node: Element) {
		// console.log(`scrubVttxIdsFromNode START`);
		// console.log(node);
		if (node?.removeAttribute) node.removeAttribute('vttx-node');
		if (node?.children) {
			Array.from(node.children).forEach((child) =>
				scrubVttxIdsFromNode(child)
			);
		}
	}

	function setXmlDocFromText(xmlString: string) {
		let xmlDoc;
		xmlDocError = false;
		try {
			xmlDoc = xmlTextToDoc(xmlString);
		} catch (error) {
			// console.log(`Detected error, setting xmlDocError to True`);
			xmlDocError = true;
		}

		// console.log(`xmlDocError: ${xmlDocError}`);

		if (!xmlDocError) {
			setVttxIds(xmlDoc.documentElement);
			setXmlDoc(xmlDoc.documentElement);
		}
	}

	/*
		Overall app skeleton
	*/
	const appJsx = (
		<>
			<vttxContext.Provider
				value={{
					loadFile,
					setupLoadedFile,
					updateNodeText,
					updateNodeAttribute,
				}}
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
			node.innerHTML = node.innerHTML.replaceAll('                ', '      ');
		}
	}

	function updateNodeAttribute(
		nodeID: string,
		oldAttributeName: string,
		whatToUpdate: string,
		newText: string
	) {
		// console.log(`START updateNodeAttribute`);
		// console.log(nodeID, oldAttributeName, whatToUpdate, newText);
		const node = xmlDoc.querySelectorAll(`[vttx-node="${nodeID}"]`)[0];
		// console.log(node);
		if (whatToUpdate === 'name') {
			const oldValue = node.getAttribute(oldAttributeName);
			node.removeAttribute(oldAttributeName);
			node.setAttribute(newText, oldValue);
		} else {
			node.setAttribute(oldAttributeName, newText);
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
		setVttxIds(xmlDoc);
		setXmlDoc(xmlDoc);
		// console.log(xmlDoc);

		// Reset UI states
		selectTableTab('GlyphOrder');
		setIsFileLoaded(true);

		// console.log(`END App.tsx - setupLoadedFile`);
	}

	function setVttxIds(node: Element) {
		let idNumber = 0;
		let depth = 0;
		function setVttxIdsForNode(node: Element) {
			node.setAttribute('vttx-node', `id-${depth}-${idNumber}`);
			idNumber++;
			depth++;
			Array.from(node.children).forEach((child) => setVttxIdsForNode(child));
			depth--;
		}

		setVttxIdsForNode(node);
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
