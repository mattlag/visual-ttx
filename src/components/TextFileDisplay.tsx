import * as React from 'react';
// import { ttxJsonData } from '../renderer';

export default function TextFileDisplay() {
	// const ttxData = React.useContext(ttxJsonData);
	const ttxData = 'Example';
	console.log(ttxData);
	return (
		<>
			<textarea value={ttxData} disabled></textarea>
		</>
	);
}
