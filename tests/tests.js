'use strict';

const assert = require('assert');
const fixtures = require('regexpu-fixtures');
const regexpu = require('../regexpu.js');

describe('API', function() {
	it('supports loading each API method separately', function() {
		assert.equal(regexpu.rewritePattern, require('regexpu-core'));
		assert.equal(regexpu.transformTree, require('../transform-tree'));
		assert.equal(regexpu.transpileCode, require('../transpile-code'));
	});
});

describe('regexpu.rewritePattern', function() {

	for (const fixture of fixtures) {
		const pattern = fixture.pattern;
		for (const flag of fixture.flags) {
			it('rewrites `/' + pattern + '/' + flag + '` correctly', function() {
				assert.equal(
					regexpu.rewritePattern(pattern, flag),
					fixture.transpiled
				);
			});
		}
	}

});

describe('regexpu.transformTree', function() {

	it('is aliased as `regexpu.transform`', function() {
		assert.equal(regexpu.transform, regexpu.transformTree);
	});

	// Functional tests have been omitted here, because `transformTree` is
	// already tested indirectly through `transpileCode`.

});

describe('regexpu.transpileCode', function() {

	for (const fixture of fixtures) {
		for (const flag of fixture.flags) {
			if (!flag.includes('u')) {
				// Unlike `rewritePattern` (which rewrites any regular expression you
				// feed it), the transpiler is only supposed to handle regular
				// expressions with the `u` flag set. This one doesn’t, so skip it.
				continue;
			}
			const code = `var x = /${ fixture.pattern }/${ flag };`;
			const expected = `var x = /${ fixture.transpiled }/${
				flag.replace('u', '') };`;
			it('transpiles `' + code + '` correctly', function() {
				assert.equal(regexpu.transpileCode(code), expected);
			});
		}
	}

	it('creates source maps on request', function() {
		const result = regexpu.transpileCode('var x = /[\\u{1D306}-\\u{1D308}]/u;', {
			'sourceFileName': 'es2015.js',
			'sourceMapName': 'es2015.map',
		});
		assert.equal(result.code, 'var x = /(?:\\uD834[\\uDF06-\\uDF08])/;');
		assert.deepEqual(result.map, {
			'version': 3,
			'file': 'es2015.map',
			'sources': ['es2015.js'],
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

	it('passes its `options` argument to `rewritePattern`', function() {
		assert.equal(
			regexpu.transpileCode('var x = /\\p{ASCII}/u;', {
				'unicodePropertyEscape': true
			}),
			'var x = /[\\0-\\x7F]/;'
		);
		assert.equal(
			regexpu.transpileCode('var x = /\\p{Script_Extensions=Anatolian_Hieroglyphs}/u;', {
				'unicodePropertyEscape': true
			}),
			'var x = /(?:\\uD811[\\uDC00-\\uDE46])/;'
		);
		assert.equal(
			regexpu.transpileCode('var x = /\\p{Script_Extensions=Anatolian_Hieroglyphs}/u;', {
				'unicodePropertyEscape': true,
				'useUnicodeFlag': true
			}),
			'var x = /[\\u{14400}-\\u{14646}]/u;'
		);
		assert.equal(
			regexpu.transpileCode('var x = /./s;', {
				'dotAllFlag': true
			}),
			'var x = /[\\s\\S]/;'
		);
		assert.equal(
			regexpu.transpileCode('var x = /./u;', {
				'dotAllFlag': true
			}),
			'var x = /(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uE000-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF])/;'
		);
		assert.equal(
			regexpu.transpileCode('var x = /./su;', {
				'dotAllFlag': true
			}),
			'var x = /(?:[\\0-\\uD7FF\\uE000-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF])/;'
		);
	});

});
