import * as React from 'react';
import { vttxContext } from './App';

export default function DropTarget({
	initialLoadState = 'waiting',
}: {
	initialLoadState: string;
}) {
	const vttxCtx = React.useContext(vttxContext);
	const [loadState, setLoadState] = React.useState(initialLoadState);
	return (
		<div
			id="load-file-drop-area"
			onDragOver={handleDragOver}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<img id="file-icon" src={getFileIconSrc()}></img>
			<br></br>
			<div>
				To load a file, drag+drop one here,
				<br></br>
				or&nbsp;
				<a onClick={handleClickOpenFileChooser}>launch a file chooser</a>.
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

	function getFileIconSrc() {
		if (loadState === 'hovering') return 'action_open_file.svg';
		if (loadState === 'loading') return 'action_loading.svg';
		return 'action_closed_file.svg';
	}

	function handleClickOpenFileChooser() {
		// console.log(`START DropTarget.tsx - handleClickOpenFileChooser`);
		vttxCtx.loadFile();

		// console.log(`END DropTarget.tsx - handleClickOpenFileChooser`);
	}

	async function handleDrop(event?: React.DragEvent) {
		// console.log(`DropTarget.TSX handleDrop`);
		event.preventDefault();
		event.stopPropagation();

		setLoadState('loading');
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
		setLoadState('hovering');
	}

	function handleDragEnter(event: React.DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		// console.log('File has ENTERED the Drop Space');
		setLoadState('hovering');
	}

	function handleDragLeave(event: React.DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		// console.log('File has left the Drop Space');
		setLoadState('waiting');
	}
}
