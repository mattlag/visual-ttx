

/**
 * XML to JSON does exactly what it sounds like.
 * Feed it an XML string, and it converts the data
 * to JSON format.
 * @param {String} inputXML - XML data
 * @return {Object} - Javascript object
 */
export function XMLtoJSON(inputXML = '') {
	// const console_debug = false;
	// log('XMLtoJSON - start');
	// log(inputXML);
	let XMLdoc;
	let XMLerror;

	if (typeof window.DOMParser !== 'undefined') {
		XMLdoc = new window.DOMParser().parseFromString(inputXML, 'text/xml');
	} else if (
		typeof window.ActiveXObject !== 'undefined' &&
		new window.ActiveXObject('Microsoft.XMLDOM')
	) {
		XMLdoc = new window.ActiveXObject('Microsoft.XMLDOM');
		XMLdoc.async = 'false';
		XMLdoc.loadXML(inputXML);
	} else {
		console.warn('No XML document parser found.');
		XMLerror = new SyntaxError('No XML document parser found.');
		throw XMLerror;
	}

	const error = XMLdoc.getElementsByTagName('parserError'.toLowerCase());
	if (error.length) {
		const message = XMLdoc.getElementsByTagName('div')[0].innerHTML;
		XMLerror = new SyntaxError(message);
		throw XMLerror;
	}

	// const result = {
	// 	name: XMLdoc.documentElement.nodeName,
	// 	attributes: tag_getAttributes(XMLdoc.documentElement.attributes),
	// 	content: tag_getContent(XMLdoc.documentElement),
	// };
	// log(result);
	// log('XMLtoJSON - end');
	return XMLdoc;
}
	/*

	interface xmlFragment {
		childNodes: xmlFragment[];
		nodeName: string;
		nodeValue: string;
		attributes: [];
	}

	function tag_getContent(
		parent: xmlFragment
	): (xmlNodeData | string)[] | string {
		const kids = parent.childNodes;
		// log(`\ntag_getContent - ${parent.nodeName}`);
		// log(kids);



		const result = [];
		let tagResult: xmlNodeData | string;
		let tagContent: (xmlNodeData | string)[] | string;
		let tagAttributes;

		for (const node of kids) {
			tagResult = {};
			tagContent = tag_getContent(node);
			tagAttributes = tag_getAttributes(node.attributes);
			if (node.nodeName === '#text') {
				tagResult.name = '#text';
				tagResult.content = trim('' + tagContent);
			} else if (node.nodeName === '#comment') {
				tagResult.name = '#comment';
				tagResult.content = `<!-- ${trim('' + tagContent)} -->`;
			} else {
				tagResult.name = node.nodeName;
				tagResult.attributes = tagAttributes;
				tagResult.content = tagContent;
			}

			if (tagResult !== '') result.push(tagResult);
		}

		// log(`tag_getContent - ${parent.nodeName} \n`);
		return result;
	}

	function tag_getAttributes(
		attributes: { name: string; value: string }[]
	): object {
		if (!attributes || !attributes.length) return {};

		// log('\ntag_getAttributes');
		// log(attributes);

		const result = {};

		for (const attribute of attributes) {
			// log(`\t${attribute.name} : ${attribute.value}`);
			result['' + attribute.name] = trim(attribute.value);
		}

		// log('tag_getAttributes\n');
		return result;
	}

	function trim(text: string): string {
		try {
			if (trimWhitespace) text = text.replace(/^\s+|\s+$/g, '');
			if (trimNewlines) text = text.replace(/(\r\n|\n|\r)/gm, '');
			if (trimTabs) text = text.replace(/\t/gm, '');
			return text;
		} catch (e) {
			return '';
		}
	}

	function log(text: string) {
		if (console_debug) console.log(text);
	}
}
*/