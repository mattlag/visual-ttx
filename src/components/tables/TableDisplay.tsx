import * as React from 'react';
import XmlNodeDisplay from './XmlNodeDisplay';

export default function TableDisplay({ data }: { data: Element }) {
	console.log(`\nTableDisplay: ${data.nodeName}`);

	return (
		<section className="xml-table">
			<h2>{data.nodeName}</h2>
			{data.children &&
				Array.from(data.children).map((node, index) => (
					<XmlNodeDisplay key={index} data={node} />
				))}
		</section>
	);
}
