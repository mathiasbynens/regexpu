'use strict;'

const recast = require('recast');
const rewritePattern = require('regexpu-core');
const types = recast.types;

module.exports = function(node, rewritePatternOptions) {
	return types.visit(node, types.PathVisitor.fromMethodsObject({
		// This method is called for any AST node whose `type` is `Literal`.
		'visitLiteral': function(path) {
			const node = path.value;

			if (!node.regex) {
				return false;
			}

			const flags = node.regex.flags;
			if (!flags.includes('u')) {
				return false;
			}

			const newPattern = rewritePattern(
				node.regex.pattern,
				flags,
				rewritePatternOptions
			);
			const newFlags = rewritePatternOptions.useUnicodeFlag ?
				flags :
				flags.replace('u', '');
			const result = `/${ newPattern }/${ newFlags }`;
			node.regex = {
				'pattern': newPattern,
				'flags': newFlags
			};
			node.raw = result;
			node.value = {
				'toString': () => result
			};

			// Return `false` to indicate that the traversal need not continue any
			// further down this subtree. (`Literal`s don’t have descendants anyway.)
			return false;
		}
	}));
};
