import * as React from 'react';
import TextFileDisplay from './TextFileDisplay';

export default function App() {
	const [ttxData, setTtxData] = React.useState('(file contents)');

	async function loadFile() {
		setTtxData('Awaiting file...');
		const result = '' + await window.vttxApi.handleLoadFile();
		console.log(`APP loadFile returned ${result}`);
		setTtxData(result);
	}

	return (
		<>
			<h1>vttx</h1>
			<br></br>
			<button onClick={loadFile}>Load a file</button>
			<br></br><br></br>
			<TextFileDisplay content={ttxData} />
		</>
	);
}
