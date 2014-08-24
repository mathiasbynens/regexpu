module.exports = {
	'rewritePattern': require('./src/rewrite-pattern.js'),
	'transformTree': require('./src/transform-tree.js'),
	'transpileCode': require('./src/transpile-code.js'),
	'version': require('./package.json').version
};
