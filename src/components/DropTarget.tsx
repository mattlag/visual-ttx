import { dialog } from 'electron';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DropTarget() {
	const onDrop = useCallback((acceptedFiles: []) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();

			reader.onabort = () => console.log('file reading was aborted');
			reader.onerror = () => console.log('file reading has failed');
			reader.onload = () => {
				// Do whatever you want with the file contents
				const readerResult = reader.result;
				console.log(readerResult);
			};
			// reader.readAsArrayBuffer(file);
			console.log(file);
			reader.readAsText(file);
		});
	}, []);
	const { getRootProps, getInputProps } = useDropzone({ onDrop });
	return (
		<>
			<div {...getRootProps()}>
				<input {...getInputProps()} />
				<p>Drag 'n' drop some files here, or click to select files</p>
			</div>
			<br>
				<br></br>
			</br>
			<button onClick={handleShowOpenDialog}>Electron File Picker</button>
		</>
	);
}

function handleShowOpenDialog() {
	dialog
		.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
		.then((result) => {
			console.log(result.canceled);
			console.log(result.filePaths);
		})
		.catch((err) => {
			console.log(err);
		});
}
