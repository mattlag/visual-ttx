import * as React from 'react';
import TextFileDisplay from './TextFileDisplay';

export default function App() {
	return (
		<>
			<h1>Hello! yep</h1>
			<TextFileDisplay />
			<button onClick={vttxLoadFile}>Load a text file</button>
		</>
	);
}

function vttxLoadFile() {
	const path = window.visualTtxApi.vttxLoadFile();
	console.log(`APP vttxLoadFile returned ${JSON.stringify(path)}`);
}
