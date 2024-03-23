import * as React from 'react';
import TextFileDisplay from './TextFileDisplay';

export default function App() {
	const [ttxData, setTtxData] = React.useState('loading...');

	function loadFile() {
		const path = '' + window.vttxApi.loadFile();
		console.log(`APP loadFile returned ${JSON.stringify(path)}`);
		setTtxData(path);
	}

	return (
		<>
			<h1>Hello! yep</h1>
			<TextFileDisplay content={ttxData} />
			<button onClick={loadFile}>Load a text file</button>
		</>
	);
}
