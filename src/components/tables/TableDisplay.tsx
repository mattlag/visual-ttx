import * as React from 'react';
import LeafNode from './LeafNode';

export default function TableDisplay({ data }: { data: ChildNode }) {
	console.log('\nTableDisplay');
	console.log(
		Array.from(data.childNodes).filter((node) => node.nodeName !== '#text')
	);

	return (
		<>
			<br></br><br></br>
			<h2>{data.nodeName}</h2>
			{data.childNodes &&
				Array.from(data.childNodes)
					.filter((node) => node.nodeName !== '#text')
					.map((node, index) => <LeafNode key={index} data={node} />)}
		</>
	);
}
