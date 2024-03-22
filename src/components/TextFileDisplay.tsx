import * as React from 'react';

export default function TextFileDisplay() {
	const ttxData = '' + window.vttxApi.getData();
	return (
		<>
			<h3>{ttxData}</h3>
		</>
	);
}
