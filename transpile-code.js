'use strict';

const recast = require('recast');
const transform = require('./transform-tree.js');

module.exports = function(input, options) {
	options || (options = {});
	const sourceFileName = options.sourceFileName || '';
	const sourceMapName = options.sourceMapName || '';
	const enableDotAllFlag = options.dotAllFlag || false;
	const enableUnicodePropertyEscapes = options.unicodePropertyEscape || false;
	const useUnicodeFlag = options.useUnicodeFlag || false;
	const createSourceMap = sourceFileName && sourceMapName;
	const tree = recast.parse(input, {
		'sourceFileName': sourceFileName
	});
	const transformed = transform(tree, {
		'dotAllFlag': enableDotAllFlag,
		'unicodePropertyEscape': enableUnicodePropertyEscapes,
		'useUnicodeFlag': useUnicodeFlag
	});
	if (createSourceMap) {
		// If a source map was requested, return an object with `code` and `map`
		// properties.
		return recast.print(transformed, {
			'sourceMapName': sourceMapName
		});
	}
	// If no source map was requested, return the transpiled code directly.
	return recast.print(transformed).code;
};
