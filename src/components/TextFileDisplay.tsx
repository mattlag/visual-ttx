import * as React from 'react';

export default function TextFileDisplay({ content }: { content: string }) {
	return (
		<>
			<pre>{content}</pre>
		</>
	);
}
