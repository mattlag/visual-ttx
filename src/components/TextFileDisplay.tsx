import * as React from 'react';

export default function TextFileDisplay() {
	console.log(`TEXTFILEDISPLAY.tsx > calling getData`);
	const ttxData = window.visualTtxApi.getData();
	console.log(ttxData);
	return (
		<>
			<textarea value={ttxData} disabled></textarea>
		</>
	);
}
