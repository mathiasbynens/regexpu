var recast = require('recast');
var rewritePattern = require('./rewrite-pattern.js');
var types = recast.types;

var visitor = types.PathVisitor.fromMethodsObject({
	// This method is called for any AST node whose `type` is `Literal`.
	'visitLiteral': function(path) {
		var node = path.value;

		// Once https://github.com/ariya/esprima/pull/264 lands, we’ll be able to
		// use the `regex` property here instead.
		var match = node.raw.match(/^\/(.+)\/([gimuy]*)$/);
		if (match) {
			var pattern = match[1];
			var flags = match[2];
			if (flags.indexOf('u') != -1) {
				var result = '/' + rewritePattern(pattern, flags) + '/' +
					flags.replace('u', '');
				node.raw = result;
				node.value = {
					'toString': function() {
						return result;
					}
				};
			}
		}

		// Return `false` to indicate that the traversal need not continue any
		// further down this subtree. (`Literal`s don’t have descendants anyway.)
		return false;
	}
});

module.exports = function(node) {
	return types.visit(node, visitor);
};
