import * as React from 'react';
import XmlNodeDisplay from './XmlNodeDisplay';

export default function TableDisplay({
	xmlDoc,
	selectedTableTab,
}: {
	xmlDoc: Document;
	selectedTableTab: string;
}) {
	if (selectedTableTab === '_load_file_') {
		return <div style={{ margin: '30px' }}>Load&nbsp;a&nbsp;file</div>;
	} else {
		const children = Array.from(xmlDoc.children);
		let displayedTable;
		for (let i = 0; i < children.length; i++) {
			if (children[i].nodeName === selectedTableTab) {
				displayedTable = children[i];
				break;
			}
		}
		return (
			<div className="table-layout-table scroll-content">
				<XmlNodeDisplay key="displayedTable" data={displayedTable} />
			</div>
		);
	}
}
