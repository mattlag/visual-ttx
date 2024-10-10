import * as React from 'react';
import { getFontTableInformation } from '../../lib/font-tables';

interface FontTableInformation {
	id: string;
	name: string;
	type: string;
	note?: string;
}
export default function InfoDialog({ tableName }: { tableName: string }) {
	const info: FontTableInformation = getFontTableInformation(tableName);

	return (
		<>
			<img
				key={`icon-${tableName}`}
				id={`icon-${tableName}`}
				src="info.svg"
				onClick={showInfoDialog}
			></img>
			<dialog key={`dialog-${tableName}`} id={`dialog-${tableName}`}>
				<div className="info-dialog-actions">
					<button onClick={hideInfoDialog}>✖</button>
				</div>
				<h3>The {tableName} table</h3>
				{info ? (
					<div className="info-dialog-table">
						<label>name:</label>
						<div>{info.name}</div>
						{info.type && (
							<>
								<label>tagged:</label>
								<div>{info.type}</div>
							</>
						)}
						{info.note && (
							<>
								<label>notes:</label>
								<div>{info.note}</div>
							</>
						)}
					</div>
				) : (
					<p>No information is available for this table</p>
				)}
			</dialog>
		</>
	);

	function showInfoDialog() {
		// console.log(`Clicked on info icon for ${tableName}`);
		const dialog: any = document.getElementById(`dialog-${tableName}`); // eslint-disable-line @typescript-eslint/no-explicit-any
		dialog.showModal();
	}

	function hideInfoDialog() {
		// console.log(`Closing dialog for ${tableName}`);
		const dialog: any = document.getElementById(`dialog-${tableName}`); // eslint-disable-line @typescript-eslint/no-explicit-any
		if (dialog.open) dialog.close();
	}
}
