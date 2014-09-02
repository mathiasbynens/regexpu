var assert = require('assert');
var regexpu = require('../regexpu.js');

var FLAGS_WITH_UNICODE = 'u ui ug um uy uig uim uigm uigmy'.split(' ');
var FLAGS_WITH_UNICODE_WITH_I = 'ui uig uim uigm uigmy'.split(' ');
var FLAGS_WITH_UNICODE_WITHOUT_I = 'u ug um uy ugm ugmy'.split(' ');
// Note: the leading space is important.
var FLAGS_WITHOUT_UNICODE = ' i g m y ig im igm igmy'.split(' ');
var FLAGS = FLAGS_WITH_UNICODE.concat(FLAGS_WITHOUT_UNICODE);

var fixtures = [
	{
		'pattern': '.',
		'flags': FLAGS_WITHOUT_UNICODE,
		'transpiled': '[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uFFFF]'
	},
	{
		'pattern': '.',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])'
	},
	{
		'pattern': '\\s',
		'flags': FLAGS_WITHOUT_UNICODE,
		'transpiled': '[\\t-\\r \\xA0\\u1680\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF]'
	},
	{
		'pattern': '\\s',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '[\\t-\\r \\xA0\\u1680\\u2000-\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF]'
	},
	{
		'pattern': '\\S',
		'flags': FLAGS_WITHOUT_UNICODE,
		'transpiled': '[\\0-\\x08\\x0E-\\x1F!-\\x9F\\xA1-\\u167F\\u1681-\\u1FFF\\u200B-\\u2027\\u202A-\\u202E\\u2030-\\u205E\\u2060-\\u2FFF\\u3001-\\uFEFE\\uFF00-\\uFFFF]'
	},
	{
		'pattern': '\\S',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '(?:[\\0-\\x08\\x0E-\\x1F!-\\x9F\\xA1-\\u167F\\u1681-\\u1FFF\\u200B-\\u2027\\u202A-\\u202E\\u2030-\\u205E\\u2060-\\u2FFF\\u3001-\\uD7FF\\uDC00-\\uFEFE\\uFF00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])'
	},
	{
		'pattern': '[\\s\\S]',
		'flags': FLAGS_WITHOUT_UNICODE,
		'transpiled': '[\\0-\\uFFFF]'
	},
	{
		'pattern': '[\\s\\S]',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '(?:[\\0-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])'
	},
	{
		'pattern': '\\d',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '[0-9]'
	},
	{
		'pattern': '\\D',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '(?:[\\0-/:-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])'
	},
	{
		'pattern': '[\\d\\D]',
		'flags': FLAGS_WITHOUT_UNICODE,
		'transpiled': '[\\0-\\uFFFF]'
	},
	{
		'pattern': '[\\d\\D]',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '(?:[\\0-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])'
	},
	{
		'pattern': '\\w',
		'flags': FLAGS_WITH_UNICODE_WITHOUT_I,
		'transpiled': '[0-9A-Z_a-z]'
	},
	{
		'pattern': '\\w',
		'flags': FLAGS_WITH_UNICODE_WITH_I,
		// Must match U+017F and U+212A.
		'transpiled': '[0-9A-Z_a-z\\u017F\\u212A]'
	},
	{
		'pattern': '\\W',
		'flags': FLAGS_WITH_UNICODE_WITHOUT_I,
		'transpiled': '(?:[\\0-/:-@\\[-\\^`\\{-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])'
	},
	{
		'pattern': '\\W',
		'flags': FLAGS_WITH_UNICODE_WITH_I,
		// Must match U+017F, U+212A, and, surprisingly, `K` and `S`.
		'transpiled': '(?:[\\0-/:-@KS\\[-\\^`\\{-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])'
	},
	{
		'pattern': '[\\w\\W]',
		'flags': FLAGS_WITHOUT_UNICODE,
		'transpiled': '[\\0-\\uFFFF]'
	},
	{
		'pattern': '[\\w\\W]',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '(?:[\\0-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])'
	},
	{
		'pattern': '[\uD834\uDF06-\uD834\uDF08a-z]',
		'flags': FLAGS_WITH_UNICODE_WITHOUT_I,
		'transpiled': '(?:[a-z]|\\uD834[\\uDF06-\\uDF08])'
	},
	{
		'pattern': '[\\u{1D306}-\\u{1D308}a-z]',
		'flags': FLAGS_WITH_UNICODE_WITHOUT_I,
		'transpiled': '(?:[a-z]|\\uD834[\\uDF06-\\uDF08])'
	},
	{
		'pattern': '[\\u{1D306}-\\u{1D308}a-z]+',
		'flags': FLAGS_WITH_UNICODE_WITHOUT_I,
		'transpiled': '(?:[a-z]|\\uD834[\\uDF06-\\uDF08])+'
	},
	{
		// `s` and `k` case-fold to U+017F and U+212A.
		'pattern': '[\\u{1D306}-\\u{1D308}a-z]',
		'flags': FLAGS_WITH_UNICODE_WITH_I,
		'transpiled': '(?:[a-z\\u017F\\u212A]|\\uD834[\\uDF06-\\uDF08])'
	},
	{
		// `s` and `k` case-fold to U+017F and U+212A.
		'pattern': '[\\u{1D306}-\\u{1D308}a-z]+',
		'flags': FLAGS_WITH_UNICODE_WITH_I,
		'transpiled': '(?:[a-z\\u017F\\u212A]|\\uD834[\\uDF06-\\uDF08])+'
	},
	{
		// `s` and `k` case-fold to U+017F and U+212A.
		'pattern': '[a-z]',
		'flags': FLAGS_WITH_UNICODE_WITH_I,
		'transpiled': '[a-z\\u017F\\u212A]'
	},
	{
		// `s` and `k` case-fold to U+017F and U+212A.
		'pattern': '[A-Z]',
		'flags': FLAGS_WITH_UNICODE_WITH_I,
		'transpiled': '[A-Z\\u017F\\u212A]'
	},
	{
		'pattern': '[\\u017F\\u212A]',
		'flags': FLAGS_WITH_UNICODE_WITHOUT_I,
		'transpiled': '[\\u017F\\u212A]'
	},
	{
		'pattern': '[\\u017F\\u212A]',
		'flags': FLAGS_WITH_UNICODE_WITH_I,
		'transpiled': '[KS\\u017F\\u212A]'
	},
	{
		'pattern': '\\uD806\\uDCDF',
		'flags': FLAGS_WITH_UNICODE_WITHOUT_I,
		'transpiled': '(?:\\uD806\\uDCDF)'
	},
	{
		// U+118DF case-folds to U+118BF.
		'pattern': '\\uD806\\uDCDF',
		'flags': FLAGS_WITH_UNICODE_WITH_I,
		'transpiled': '(?:\\uD806[\\uDCBF\\uDCDF])'
	},
	{
		'pattern': '[^a]',
		'flags': FLAGS_WITHOUT_UNICODE,
		'transpiled': '[\\0-`b-\\uFFFF]'
	},
	{
		'pattern': '[^a]',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '(?:[\\0-`b-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])'
	},
	{
		'pattern': '[ab]+',
		'flags': FLAGS,
		'transpiled': '[ab]+'
	},
	{
		'pattern': '^(?:ab|cd)$',
		'flags': FLAGS,
		'transpiled': '^(?:ab|cd)$'
	},
	{
		'pattern': '\uD834\uDF06+',
		'flags': FLAGS_WITHOUT_UNICODE,
		'transpiled': '\\uD834\\uDF06+'
	},
	{
		// Without the `u` flag, the character class contains two entries: one for
		// each surrogate half.
		'pattern': '[\uD834\uDF06]',
		'flags': FLAGS_WITHOUT_UNICODE,
		'transpiled': '[\\uD834\\uDF06]'
	},
	{
		// With the `u` flag, the character class contains a single entry: one for
		// each code point.
		'pattern': '[\uD834\uDF06]',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '(?:\\uD834\\uDF06)'
	},
	{
		'pattern': '\uD834\uDF06+',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '(?:\\uD834\\uDF06)+'
	},
	{
		'pattern': '\uD834\uDF06{2,4}',
		'flags': FLAGS_WITHOUT_UNICODE,
		'transpiled': '\\uD834\\uDF06{2,4}'
	},
	{
		'pattern': '\uD834\uDF06{2,4}',
		'flags': FLAGS_WITH_UNICODE,
		'transpiled': '(?:\\uD834\\uDF06){2,4}'
	},
	{
		'pattern': '(a)\\1',
		'flags': FLAGS_WITH_UNICODE_WITHOUT_I,
		'transpiled': '(a)\\1'
	}
];

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

xdescribe('regexpu.transformTree', function() {

	// TODO
	// For now, `transformTree` is tested indirectly through `transpileCode`.

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
	});

});
