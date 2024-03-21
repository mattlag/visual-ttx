import * as React from 'react';
import { ttxJsonData } from '../renderer';

export default function TextFileDisplay() {
	const ttxData = React.useContext(ttxJsonData);
	console.log(ttxData);
	return (
		<>
			<textarea value={ttxData.valueOf()} disabled></textarea>
		</>
	);
}

