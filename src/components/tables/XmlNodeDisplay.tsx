import * as React from 'react';
/*eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"]*/

export default function XmlNodeDisplay({ data }: { data: Element }) {
	console.log('\nXmlNodeDisplay');
	console.log(data);

	const value = trim(data.nodeValue);
	const attributes = Array.from(data.attributes || []) || [];
	const childNodes = Array.from(data.children || []) || [];

	if (data.nodeName === '#comment') {
		return (
			<div className="xml-node-wrapper xml-comment-wrapper">
				&lt;!--{data.nodeValue}--&gt;
			</div>
		);
	} else if (data.nodeName === '#text') {
		if (!value.length) return null;
		else return <pre className="xml-value-wrapper">{value}</pre>;
	} else {
		return (
			<article className="xml-node-wrapper">
				<h3>{data.nodeName}</h3>
				{attributes.length
					? attributes.map((attr) => (
							<span key={attr.name} className="xml-attribute-wrapper">
								{attr.name}: {attr.value}
							</span>
					  ))
					: null}
				{childNodes.length
					? childNodes.map((node, index) => (
							<XmlNodeDisplay key={index} data={node} />
					  ))
					: null}
			</article>
		);
	}
}

function trim(text: string): string {
	const trimNewlines = false;
	try {
		text = text.replaceAll('          ', '');
		text = text.replace(/^\s+|\s+$/g, '');
		text = text.replace(/\t/gm, '');
		if(trimNewlines) text = text.replace(/(\r\n|\n|\r)/gm, '');
		return text;
	} catch (e) {
		return '';
	}
}
