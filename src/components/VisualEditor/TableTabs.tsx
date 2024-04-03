import * as React from 'react';

export default function TableTabs({
	xmlDoc,
	selectedTableTab,
	selectTableTab,
}: {
	xmlDoc: Document;
	selectedTableTab: string;
	selectTableTab: (tabName: string) => void;
}) {
	if (selectedTableTab === '_load_file_') {
		return <span></span>;
	} else {
		return (
			<div className='table-layout-tabs'>
				{xmlDoc.children &&
					Array.from(xmlDoc.children).map((node, index) => (
						<button
							onClick={() => {
								selectTableTab(node.nodeName);
								document.querySelector('.table-layout-table').scrollTop = 0;
							}}
							className={
								node.nodeName === selectedTableTab
									? 'table-tab table-tab-selected'
									: 'table-tab'
							}
							key={index}
						>
							{node.nodeName}
						</button>
					))}
			</div>
		);
	}
}
