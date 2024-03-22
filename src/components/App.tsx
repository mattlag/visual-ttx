import * as React from 'react';
import TextFileDisplay from './TextFileDisplay';

export default function App() {
	return (
		<>
			<h1>Hello! yep</h1>
			<TextFileDisplay />
			<button onClick={loadFile}>Load a text file</button>
		</>
	);
}

function loadFile() {
	const path = window.vttxApi.loadFile();
	console.log(`APP loadFile returned ${JSON.stringify(path)}`);
}
