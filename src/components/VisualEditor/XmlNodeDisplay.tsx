import * as React from 'react';
import { vttxContext } from '../App';
/*eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"]*/

export default function XmlNodeDisplay({ data }: { data: Element }) {
	// console.log(`\nXmlNodeDisplay: ${data.nodeName}`);
	// console.log(data);

	if (data.nodeName === '#comment') {
		// Comments
		return (
			<div className="xml-node xml-comment">&lt;!--{data.nodeValue}--&gt;</div>
		);
	} else if (data.nodeName === '#text') {
		// Text
		const value = trim('' + data.nodeValue);

		if (
			value.length === 0 &&
			tablesThatShouldHaveWhitespace.includes(data.parentElement.nodeName)
		) {
			return (
				<TextNodeEditable
					value={''}
					nodeID={data.parentElement.getAttribute('vttx-node')}
				></TextNodeEditable>
			);
		} else if (!value.length) return null;
		else
			return (
				<TextNodeEditable
					value={value}
					nodeID={data.parentElement.getAttribute('vttx-node')}
				></TextNodeEditable>
			);
	} else {
		// Elements
		const attributes = Array.from(data.attributes || []) || [];
		const childNodes = Array.from(data.childNodes || []) || [];
		return (
			<article className="xml-node">
				<h3>{data.nodeName}</h3>
				{attributes.length
					? attributes.map(
							(attr) =>
								attr.name !== 'vttx-node' && (
									<span key={attr.name} className="xml-attribute">
										<span className="xml-attribute-piece">{attr.name}</span>
										<span className="xml-attribute-separator">:</span>
										<span className="xml-attribute-piece">{attr.value}</span>
									</span>
								)
					  )
					: null}
				{childNodes.length
					? childNodes.map((node: Element, index: number) => (
							<XmlNodeDisplay key={index} data={node} />
					  ))
					: null}
			</article>
		);
	}
}

const TextNodeEditable = ({
	value,
	nodeID,
}: {
	value: string;
	nodeID: string;
}) => {
	const [content, setContent] = React.useState(value);
	const vttxCtx = React.useContext(vttxContext);
	return (
		<textarea
			className="xml-value"
			value={content}
			onChange={(event) => {
				const newValue = event.currentTarget.value;
				setContent(newValue);
				vttxCtx.updateNodeText(nodeID, newValue);
			}}
			rows={(value.split('\n').length)}
		/>
	);
};

function trim(text: string): string {
	const trimNewlines = false;
	try {
		text = text.replaceAll('          ', '');
		text = text.replace(/^\s+|\s+$/g, '');
		text = text.replace(/\t/gm, '');
		if (trimNewlines) text = text.replace(/(\r\n|\n|\r)/gm, '');
		return text;
	} catch (e) {
		return '';
	}
}

// cSpell:disable
const tablesThatShouldHaveWhitespace = ['namerecord'];
