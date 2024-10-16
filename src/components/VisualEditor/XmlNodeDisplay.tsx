import * as React from 'react';
import { getFontTableInformation } from '../../lib/font-tables';
import { vttxContext } from '../App';
/*eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"]*/

export default function XmlNodeDisplay({ data }: { data: Element }) {
	// console.log(data);
	if(!data) return null;
	// console.log(`\nXmlNodeDisplay: ${data.nodeName}`);

	const [isCollapsed, setCollapsed] = React.useState(false);

	if (data.nodeName === '#comment') {
		// Comments
		return (
			<div className="xml-node xml-comment">&lt;!--{data.nodeValue}--&gt;</div>
		);
	} else if (data.nodeName === '#cdata-section') {
		// CDATA
		const value = trim('' + data.nodeValue);
		return (
			<span>
				<div className="xml-node xml-cdata">&lt;![CDATA[</div>
				<TextNodeEditable
					isCdata={true}
					value={value}
					nodeID={data.parentElement.getAttribute('vttx-node')}
				></TextNodeEditable>
				<div className="xml-node xml-cdata">]]&gt;</div>
			</span>
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
					isCdata={false}
				></TextNodeEditable>
			);
		} else if (!value.length) return null;
		else
			return (
				<TextNodeEditable
					value={value}
					nodeID={data.parentElement.getAttribute('vttx-node')}
					isCdata={false}
				></TextNodeEditable>
			);
	} else {
		// Elements
		const attributes = Array.from(data.attributes || []) || [];
		const childNodes = Array.from(data.childNodes || []) || [];
		const isCollapsible =
			childNodes.length > 1 && !getFontTableInformation(data.nodeName);
		return (
			<article className="xml-node">
				{isCollapsible ? (
					<button
						onClick={() => setCollapsed(!isCollapsed)}
						className="collapse-control"
					>
						<svg width={14} height={14} viewBox="0 0 14 14">
							<rect x="3" y="6" width="8" height="2" />
							{isCollapsed ? <rect x="6" y="3" width="2" height="8" /> : null}
						</svg>
					</button>
				) : (
					<span className="collapse-control">&nbsp;</span>
				)}
				<h3 className={isCollapsible ? 'collapsible' : 'not-collapsible'}>
					{data.nodeName}
				</h3>
				{attributes.length
					? attributes.map(
							(attr) =>
								attr.name !== 'vttx-node' && (
									<Attribute
										key={`${data.id}-attribute-${attr.name}`}
										name={attr.name}
										value={attr.value}
										nodeID={data.getAttribute('vttx-node')}
									/>
								)
					  )
					: null}
				{childNodes.length && !isCollapsed
					? childNodes.map((node: Element, index: number) => (
							<XmlNodeDisplay key={index} data={node} />
					  ))
					: null}
			</article>
		);
	}
}

const TextNodeEditable = ({
	value = '',
	nodeID = '',
	isCdata = false,
}: {
	value: string;
	nodeID: string;
	isCdata: boolean;
}) => {
	const vttxCtx = React.useContext(vttxContext);
	return (
		<div
			className="xml-value"
			contentEditable="true"
			suppressContentEditableWarning={true}
			onBlur={(event) => {
				let newValue = event.currentTarget.textContent.trim();
				if (isCdata) {
					newValue = `<![CDATA[${newValue}]]>`;
				}
				vttxCtx.updateNodeText(nodeID, newValue);
			}}
		>
			{value.trim()}
		</div>
	);
};

const Attribute = ({
	name = '',
	value = '',
	nodeID = '',
}: {
	name: string;
	value: string;
	nodeID: string;
}) => {
	const vttxCtx = React.useContext(vttxContext);
	return (
		<span className="xml-attribute">
			<span
				className="xml-attribute-piece"
				contentEditable="true"
				suppressContentEditableWarning={true}
				onBlur={(event) => {
					const newName = event.currentTarget.textContent.trim();
					vttxCtx.updateNodeAttribute(nodeID, name, 'name', newName);
				}}
			>
				{name}
			</span>
			<span className="xml-attribute-separator">:</span>
			<span
				className="xml-attribute-piece"
				contentEditable="true"
				suppressContentEditableWarning={true}
				onBlur={(event) => {
					const newValue = event.currentTarget.textContent.trim();
					vttxCtx.updateNodeAttribute(nodeID, name, 'value', newValue);
				}}
			>
				{value}
			</span>
		</span>
	);
};

/*
	Helper functions
*/
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
