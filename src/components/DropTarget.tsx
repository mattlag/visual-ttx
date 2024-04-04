import * as React from 'react';
import { vttxContext } from './App';

export default function DropTarget() {
	const vttxCtx = React.useContext(vttxContext);
	return (
		<div
			id="load-file-drop-area"
			onDragOver={handleDragOver}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<img id="file-icon" src="action_closed_file.svg"></img>
			<br></br>
			<div>
				To load a file, drag+drop one here,
				<br></br>
				or&nbsp;
				<a href="" onClick={vttxCtx.loadFile}>
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

	async function handleDrop(event?: React.DragEvent) {
		// console.log(`DropTarget.TSX handleDrop`);
		event.preventDefault();
		event.stopPropagation();

		const pathResult = event?.dataTransfer?.files[0]?.path;
		let fileResult;
		// console.log(pathResult);
		if (pathResult) {
			// console.log(`starting handleLoadFile...`);
			fileResult = await window.vttxApi.handleLoadFile(pathResult);
		} else {
			fileResult = await window.vttxApi.handleLoadFile();
		}

		// console.log(`fileResult:`);
		// console.log(fileResult);
		if (fileResult) {
			vttxCtx.setupLoadedFile(fileResult);
		}
	}

	function handleDragOver(event: React.DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		// console.log('File is OVER the Drop Space');
		document
			.getElementById('file-icon')
			.setAttribute('src', 'action_open_file.svg');
	}

	function handleDragEnter(event: React.DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		// console.log('File has ENTERED the Drop Space');
		document
			.getElementById('file-icon')
			.setAttribute('src', 'action_open_file.svg');
	}

	function handleDragLeave(event: React.DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		// console.log('File has left the Drop Space');
		document
			.getElementById('file-icon')
			.setAttribute('src', 'action_closed_file.svg');
	}
}
