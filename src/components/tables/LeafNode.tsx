import * as React from 'react';

export default function LeafNode({ data }: { data: ChildNode }) {
	console.log('\nLeafNode');
	console.log(data);
	if (data.nodeName === '#comment') {
		return <span><i>&lt;--{data.nodeValue}--&gt;</i></span>;
	} else if (data.nodeName === '#text') {
		return <>{trim(data.nodeValue).length && <pre>{data.nodeValue}</pre>}</>;
	} else {
		return (
			<>
				<h4>{data.nodeName}</h4>
				{data.attributes &&
					Array.from(data.attributes).map((attr) => (
						<>
							<span>
								{attr.name}: {attr.value}
							</span>
							<br></br>
						</>
					))}
				{data.nodeValue && <><b>{data.nodeValue}</b><br></br><br></br></>}
				{data.childNodes &&
					Array.from(data.childNodes).map((node, index) => (
						<LeafNode key={index} data={node} />
					))}
			</>
		);
	}
}

function trim(text: string): string {
	try {
		text = text.replace(/^\s+|\s+$/g, '');
		text = text.replace(/(\r\n|\n|\r)/gm, '');
		text = text.replace(/\t/gm, '');
		return text;
	} catch (e) {
		return '';
	}
}
