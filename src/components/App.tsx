import * as React from 'react';
import TextFileDisplay from './TextFileDisplay';

export default function App() {
	const [ttxData, setTtxData] = React.useState('(file contents)');

	function loadFile() {
		const path = '' + window.vttxApi.loadFile();
		console.log(`APP loadFile returned ${JSON.stringify(path)}`);
		setTtxData(path);
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
