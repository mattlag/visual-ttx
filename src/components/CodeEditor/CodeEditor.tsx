import { xml } from '@codemirror/lang-xml';
import CodeMirror from '@uiw/react-codemirror';
import React from 'react';

interface CodeEditor {
	ttxData: string;
	setTtxData: (value: string) => void;
}

export default function CodeEditor({ ttxData, setTtxData }: CodeEditor) {
	// console.log(`CodeEditor got ${ttxData}`);

	return (
		<div className="scroll-content">
			<br></br>
			<CodeMirror
				value={ttxData}
				height="100%"
				extensions={[xml()]}
				onChange={(value) => {
					setTtxData(value);
				}}
			/>
		</div>
	);
}
