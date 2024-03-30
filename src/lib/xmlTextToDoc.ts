/**
 * XML to JSON does exactly what it sounds like.
 * Feed it an XML string, and it converts the data
 * to JSON format.
 * @param {String} inputXML - XML data
 * @return {Object} - Javascript object
 */
export function xmlTextToDoc(inputXML = '') {
	// const console_debug = false;
	// log('xmlTextToDoc - start');
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

	// log(result);
	// log('xmlTextToDoc - end');
	return XMLdoc;
}
