var assert = require('assert');
var fixtures = require('regexpu-fixtures');
var regexpu = require('../regexpu.js');

describe('API', function() {
	it('supports loading each API method separately', function() {
		assert.equal(regexpu.rewritePattern, require('regexpu-core'));
		assert.equal(regexpu.transformTree, require('../transform-tree'));
		assert.equal(regexpu.transpileCode, require('../transpile-code'));
	});
});

describe('regexpu.rewritePattern', function() {

	fixtures.forEach(function(fixture) {
		var pattern = fixture.pattern;
		fixture.flags.forEach(function(flag) {
			it('rewrites `/' + pattern + '/' + flag + '` correctly', function() {
				assert.equal(regexpu.rewritePattern(pattern, flag), fixture.transpiled);
			});
		});
	});

});

describe('regexpu.transformTree', function() {

	it('is aliased as `regexpu.transform`', function() {
		assert.equal(regexpu.transform, regexpu.transformTree);
	});

	// Functional tests have been omitted here, because `transformTree` is
	// already tested indirectly through `transpileCode`.

});

describe('regexpu.transpileCode', function() {

	fixtures.forEach(function(fixture) {
		fixture.flags.forEach(function(flag) {
			if (flag.indexOf('u') == -1) {
				// Unlike `rewritePattern` (which rewrites any regular expression you
				// feed it), the transpiler is only supposed to handle regular
				// expressions with the `u` flag set. This one doesn’t, so skip it.
				return;
			}
			var code = 'var x = /' + fixture.pattern + '/' + flag + ';';
			var expected = 'var x = /' + fixture.transpiled + '/' +
				flag.replace('u', '') + ';';
			it('transpiles `' + code + '` correctly', function() {
				assert.equal(regexpu.transpileCode(code), expected);
			});
		});
	});

	it('creates source maps on request', function() {
		var result = regexpu.transpileCode('var x = /[\\u{1D306}-\\u{1D308}]/u;', {
			'sourceFileName': 'es6.js',
			'sourceMapName': 'es6.map',
		});
		assert.equal(result.code, 'var x = /(?:\\uD834[\\uDF06-\\uDF08])/;');
		assert.deepEqual(result.map, {
			'version': 3,
			'file': 'es6.map',
			'sources': ['es6.js'],
			'names': [],
			'mappings': 'AAAA,CAAC,CAAC,EAAE,EAAE,6BAA0B',
			'sourcesContent': [
				'var x = /[\\u{1D306}-\\u{1D308}]/u;'
			]
		});
	});

	it('doesn’t transpile anything else', function() {
		assert.equal(regexpu.transpileCode('var x = /a/;'), 'var x = /a/;');
		assert.equal(regexpu.transpileCode('var x = 42;'), 'var x = 42;');
		assert.equal(regexpu.transpileCode('var x = "abc";'), 'var x = "abc";');
		assert.equal(regexpu.transpileCode('var x = "a/b/u";'), 'var x = "a/b/u";');
		assert.equal(regexpu.transpileCode('var x = true;'), 'var x = true;');
		assert.equal(regexpu.transpileCode('var x = false;'), 'var x = false;');
		assert.equal(regexpu.transpileCode('var x = undefined;'), 'var x = undefined;');
		assert.equal(regexpu.transpileCode('var x = null;'), 'var x = null;');
		assert.equal(regexpu.transpileCode('var x = [];'), 'var x = [];');
		assert.equal(regexpu.transpileCode('var x = {};'), 'var x = {};');
	});

});
