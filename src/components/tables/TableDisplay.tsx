import * as React from 'react';
import XmlNodeDisplay from './XmlNodeDisplay';

export default function TableDisplay({ data }: { data: Element }) {
	console.log('\nTableDisplay');
	console.log(
		Array.from(data.children).filter((node) => node.nodeName !== '#text')
	);

	return (
		<section className="xml-table-wrapper">
			<h2>{data.nodeName}</h2>
			{data.children &&
				Array.from(data.children)
					.filter((node) => node.nodeName !== '#text')
					.map((node, index) => <XmlNodeDisplay key={index} data={node} />)}
		</section>
	);
}
