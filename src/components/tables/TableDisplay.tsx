import * as React from 'react';
import { loadedFileContext } from '../App';
import XmlNodeDisplay from './XmlNodeDisplay';

export default function TableDisplay({
	xmlDoc,
	selectedTableTab,
}: {
	xmlDoc: Document;
	selectedTableTab: string;
}) {
	const fileCtx = React.useContext(loadedFileContext);
	if (selectedTableTab === '_load_file_') {
		return (
			<div
				id="load-file-drop-area"
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<img src="action_open_file.svg"></img>
				<br></br>
				<div>
					To load a file, drag+drop one here, or
					<br></br>
					<a href="" onClick={fileCtx.loadFile}>
						launch a file chooser
					</a>
					.
				</div>
				<br></br>
				<div>
					<code>.otf</code>
					<code>.ttf</code>
					<code>.woff</code>
					<code>.woff2</code>
					<br></br>
					<code>.ttx</code>
					<code>.otx</code>
				</div>
			</div>
		);
	} else {
		const children = Array.from(xmlDoc.children);
		let displayedTable;
		for (let i = 0; i < children.length; i++) {
			if (children[i].nodeName === selectedTableTab) {
				displayedTable = children[i];
				break;
			}
		}
		return (
			<div className="table-layout-table scroll-content">
				<XmlNodeDisplay key="displayedTable" data={displayedTable} />
			</div>
		);
	}

	async function handleDrop(event?: React.DragEvent) {
		console.log(`TABLEDISPLAY.TSX handleDrop`);
		event.preventDefault();
		event.stopPropagation();

		const pathResult = event?.dataTransfer?.files[0]?.path;
		let fileResult;
		console.log(pathResult);
		if (pathResult) {
			console.log(`starting handleLoadFile...`);
			fileResult = await window.vttxApi.handleLoadFile(pathResult);
		} else {
			fileResult = await window.vttxApi.handleLoadFile();
		}

		console.log(`fileResult:`);
		console.log(fileResult);
		if (fileResult) {
			console.log(fileCtx);
			fileCtx.markAsLoadedFile(fileResult);
		}
	}

	function handleDragOver(event: React.DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		console.log('File is OVER the Drop Space');
	}

	function handleDragEnter(event: React.DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		console.log('File has ENTERED the Drop Space');
	}

	function handleDragLeave(event: React.DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		console.log('File has left the Drop Space');
	}
}
