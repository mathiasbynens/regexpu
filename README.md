# regexpu [![Build status](https://travis-ci.org/mathiasbynens/regexpu.svg?branch=master)](https://travis-ci.org/mathiasbynens/regexpu) [![Code coverage status](http://img.shields.io/coveralls/mathiasbynens/regexpu/master.svg)](https://coveralls.io/r/mathiasbynens/regexpu) [![Dependency status](https://gemnasium.com/mathiasbynens/regexpu.svg)](https://gemnasium.com/mathiasbynens/regexpu)

_regexpu_ is a source code transpiler that enables the use of ES6 Unicode regular expressions in JavaScript-of-today (ES5). It rewrites regular expressions that make use of [the ES6 `u` flag](https://mathiasbynens.be/notes/javascript-unicode#regex) into equivalent ES5-compatible regular expressions. [Here’s an online demo.](http://mothereff.in/regexpu)

## Example

Consider a file named `example-es6.js` with the following contents:

```js
var string = 'foo💩bar';
var match = string.match(/foo(.)bar/u);
console.log(match[1]);
// → '💩'

// This regex matches any symbol from U+1F4A9 to U+1F4AB, and nothing else.
var regex = /[\u{1F4A9}-\u{1F4AB}]/u;
// The following regex is equivalent.
var alternative = /[💩-💫]/u;
console.log([
  regex.test('a'),  // false
  regex.test('💩'), // true
  regex.test('💪'), // true
  regex.test('💫'), // true
  regex.test('💬')  // false
]);
```

Let’s transpile it:

```bash
$ regexpu -f example-es6.js > example-es5.js
```

`example-es5.js` can now be used in ES5 environments. Its contents are as follows:

```js
var string = 'foo💩bar';
var match = string.match(/foo((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF]))bar/);
console.log(match[1]);
// → '💩'

// This regex matches any symbol from U+1F4A9 to U+1F4AB, and nothing else.
var regex = /(?:\uD83D[\uDCA9-\uDCAB])/;
// The following regex is equivalent.
var alternative = /(?:\uD83D[\uDCA9-\uDCAB])/;
console.log([
  regex.test('a'),  // false
  regex.test('💩'), // true
  regex.test('💪'), // true
  regex.test('💫'), // true
  regex.test('💬')  // false
]);
```

## Known limitations

1. _regexpu_ only transpiles regular expression _literals_, so things like `RegExp('…', 'u')` are not affected.
2. It doesn’t polyfill [the `RegExp.prototype.unicode` getter](http://mths.be/es6#sec-get-regexp.prototype.unicode) because it’s not possible to do so without side effects.

## Installation

To use _regexpu_ programmatically, install it as a dependency via [npm](http://npmjs.org/):

```bash
npm install regexpu --save-dev
```

To use the command-line interface, install _regexpu_ globally:

```bash
npm install regexpu -g
```

## API

### `regexpu.version`

A string representing the semantic version number.

### `regexpu.rewritePattern(pattern, flags)`

This function takes a string that represents a regular expression pattern as well as a string representing its flags, and returns an ES5-compatible version of the pattern.

```js
regexpu.rewritePattern('foo.bar', 'u');
// → 'foo(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])bar'

regexpu.rewritePattern('[\\u{1D306}-\\u{1D308}a-z]', 'u');
// → '(?:[a-z]|\\uD834[\\uDF06-\\uDF08])'

regexpu.rewritePattern('[\\u{1D306}-\\u{1D308}a-z]', 'ui');
// → '(?:[a-z\\u017F\\u212A]|\\uD834[\\uDF06-\\uDF08])'
```

_regexpu_ can rewrite non-ES6 regular expressions too, which is useful to demonstrate how their behavior changes once the `u` and `i` flags are added:

```js
// In ES5, the dot operator only matches BMP symbols:
regexpu.rewritePattern('foo.bar');
// → 'foo(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uFFFF])bar'

// But with the ES6 `u` flag, it matches astral symbols too:
regexpu.rewritePattern('foo.bar', 'u');
// → 'foo(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])bar'
```

### `regexpu.transformTree(ast)`

This function accepts an abstract syntax tree representing some JavaScript code, and returns a transformed version of the tree in which any regular expression literals that use the ES6 `u` flag are rewritten in ES5.

```js
var regexpu = require('regexpu');
var recast = require('recast');
var tree = recast.parse(code); // ES6 code
tree = regexpu.transform(tree);
var result = recast.print(tree);
console.log(result.code); // transpiled ES5 code
console.log(result.map); // source map
```

### `regexpu.transpileCode(code, options)`

This function accepts a string representing some JavaScript code, and returns a transpiled version of this code tree in which any regular expression literals that use the ES6 `u` flag are rewritten in ES5.

```js
var es6 = 'console.log(/foo.bar/u.test("foo💩bar"));';
var es5 = regexpu.transpileCode(es6);
// → 'console.log(/foo(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])bar/.test("foo💩bar"));'
```

The optional `options` object recognizes the following properties:

* `sourceFileName`: a string representing the file name of the original ES6 source file.
* `sourceMapName`: a string representing the desired file name of the source map.

These properties must be provided if you want to generate source maps.

```js
var result = regexpu.transpileCode(code, {
  'sourceFileName': 'es6.js',
  'sourceMapName': 'es6.js.map',
});
console.log(result.code); // transpiled source code
console.log(result.map); // source map
```

## Author

| [![twitter/mathias](https://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](https://mathiasbynens.be/) |

## License

_regexpu_ is available under the [MIT](http://mths.be/mit) license.
