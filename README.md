# regexpu [![Build status](https://travis-ci.org/mathiasbynens/regexpu.svg?branch=main)](https://travis-ci.org/mathiasbynens/regexpu) [![Code coverage status](https://img.shields.io/codecov/c/github/mathiasbynens/regexpu.svg)](https://codecov.io/gh/mathiasbynens/regexpu) [![regexpu on npm](https://img.shields.io/npm/v/regexpu)](https://www.npmjs.com/package/regexpu)

_regexpu_ is a source code transpiler that enables the use of ES2015 (aka ES6) Unicode regular expressions in ES5. It rewrites regular expressions that make use of [the ES2015 `u` flag](https://mathiasbynens.be/notes/es6-unicode-regex) into equivalent ES5-compatible regular expressions.

[Here’s an online demo.](https://mothereff.in/regexpu)

[Traceur v0.0.61+](https://github.com/google/traceur-compiler), [Babel v1.5.0+](https://github.com/babel/babel), [esnext v0.12.0+](https://github.com/esnext/esnext), and [Bublé v0.12.0+](https://buble.surge.sh/) use _regexpu_ for their `u` regexp transpilation. The REPL demos for [Traceur](https://google.github.io/traceur-compiler/demo/repl.html#%2F%2F%20Traceur%20now%20uses%20regexpu%20%28https%3A%2F%2Fmths.be%2Fregexpu%29%20to%20transpile%20regular%0A%2F%2F%20expression%20literals%20that%20have%20the%20ES2015%20%60u%60%20flag%20set%20into%20equivalent%20ES5.%0A%0A%2F%2F%20Match%20any%20symbol%20from%20U%2B1F4A9%20PILE%20OF%20POO%20to%20U%2B1F4AB%20DIZZY%20SYMBOL.%0Avar%20regex%20%3D%20%2F%5B%F0%9F%92%A9-%F0%9F%92%AB%5D%2Fu%3B%20%2F%2F%20Or%2C%20%60%2F%5Cu%7B1F4A9%7D-%5Cu%7B1F4AB%7D%2Fu%60.%0Aconsole.log%28%0A%20%20regex.test%28'%F0%9F%92%A8'%29%2C%20%2F%2F%20false%0A%20%20regex.test%28'%F0%9F%92%A9'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AA'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AB'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AC'%29%20%20%2F%2F%20false%0A%29%3B%0A%0A%2F%2F%20See%20https%3A%2F%2Fmathiasbynens.be%2Fnotes%2Fes6-unicode-regex%20for%20more%20examples%20and%0A%2F%2F%20info.%0A), [Babel](https://babeljs.io/repl/#?experimental=true&playground=true&evaluate=true&code=%2F%2F%20Babel%20now%20uses%20regexpu%20%28https%3A%2F%2Fmths.be%2Fregexpu%29%20to%20transpile%20regular%0A%2F%2F%20expression%20literals%20that%20have%20the%20ES2015%20%60u%60%20flag%20set%20into%20equivalent%20ES5.%0A%0A%2F%2F%20Match%20any%20symbol%20from%20U%2B1F4A9%20PILE%20OF%20POO%20to%20U%2B1F4AB%20DIZZY%20SYMBOL.%0Avar%20regex%20%3D%20%2F%5B%F0%9F%92%A9-%F0%9F%92%AB%5D%2Fu%3B%20%2F%2F%20Or%2C%20%60%2F%5Cu%7B1F4A9%7D-%5Cu%7B1F4AB%7D%2Fu%60.%0Aconsole.log%28%0A%20%20regex.test%28'%F0%9F%92%A8'%29%2C%20%2F%2F%20false%0A%20%20regex.test%28'%F0%9F%92%A9'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AA'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AB'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AC'%29%20%20%2F%2F%20false%0A%29%3B%0A%0A%2F%2F%20See%20https%3A%2F%2Fmathiasbynens.be%2Fnotes%2Fes6-unicode-regex%20for%20more%20examples%20and%0A%2F%2F%20info.%0A), [esnext](https://esnext.github.io/esnext/#%2F%2F%20esnext%20now%20uses%20regexpu%20%28https%3A%2F%2Fmths.be%2Fregexpu%29%20to%20transpile%20regular%0A%2F%2F%20expression%20literals%20that%20have%20the%20ES2015%20%60u%60%20flag%20set%20into%20equivalent%20ES5.%0A%0A%2F%2F%20Match%20any%20symbol%20from%20U%2B1F4A9%20PILE%20OF%20POO%20to%20U%2B1F4AB%20DIZZY%20SYMBOL.%0Avar%20regex%20%3D%20%2F%5B%F0%9F%92%A9-%F0%9F%92%AB%5D%2Fu%3B%20%2F%2F%20Or%2C%20%60%2F%5Cu%7B1F4A9%7D-%5Cu%7B1F4AB%7D%2Fu%60.%0Aconsole.log%28%0A%20%20regex.test%28'%F0%9F%92%A8'%29%2C%20%2F%2F%20false%0A%20%20regex.test%28'%F0%9F%92%A9'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AA'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AB'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AC'%29%20%20%2F%2F%20false%0A%29%3B%0A%0A%2F%2F%20See%20https%3A%2F%2Fmathiasbynens.be%2Fnotes%2Fes6-unicode-regex%20for%20more%20examples%20and%0A%2F%2F%20info.%0A), and [Bublé](https://buble.surge.sh/#%2F%2F%20Bubl%C3%A9%20now%20uses%20regexpu%20%28https%3A%2F%2Fmths.be%2Fregexpu%29%20to%20transpile%20regular%0A%2F%2F%20expression%20literals%20that%20have%20the%20ES2015%20%60u%60%20flag%20set%20into%20equivalent%20ES5.%0A%0A%2F%2F%20Match%20any%20symbol%20from%20U%2B1F4A9%20PILE%20OF%20POO%20to%20U%2B1F4AB%20DIZZY%20SYMBOL.%0Avar%20regex%20%3D%20%2F%5B%F0%9F%92%A9-%F0%9F%92%AB%5D%2Fu%3B%20%2F%2F%20Or%2C%20%60%2F%5Cu%7B1F4A9%7D-%5Cu%7B1F4AB%7D%2Fu%60.%0Aconsole.log%28%0A%20%20regex.test%28'%F0%9F%92%A8'%29%2C%20%2F%2F%20false%0A%20%20regex.test%28'%F0%9F%92%A9'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AA'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AB'%29%2C%20%2F%2F%20true%0A%20%20regex.test%28'%F0%9F%92%AC'%29%20%20%2F%2F%20false%0A%29%3B%0A%0A%2F%2F%20See%20https%3A%2F%2Fmathiasbynens.be%2Fnotes%2Fes6-unicode-regex%20for%20more%20examples%0A%2F%2F%20and%20info.%0A) let you try `u` regexps as well as other ES.next features.

## Example

Consider a file named `example-es2015.js` with the following contents:

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
$ regexpu < example-es2015.js > example-es5.js
```

`example-es5.js` can now be used in ES5 environments. Its contents are as follows:

```js
var string = 'foo💩bar';
var match = string.match(/foo((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))bar/);
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
2. _regexpu_ doesn’t polyfill [the `RegExp.prototype.unicode` getter](https://mths.be/es6#sec-get-regexp.prototype.unicode) because it’s not possible to do so without side effects.
3. _regexpu_ doesn’t support [canonicalizing the contents of back-references in regular expressions with both the `i` and `u` flag set](https://github.com/mathiasbynens/regexpu/issues/4), since that would require transpiling/wrapping strings.
4. _regexpu_ [doesn’t match lone low surrogates accurately](https://github.com/mathiasbynens/regexpu/issues/17). Unfortunately that is impossible to implement due to the lack of lookbehind support in JavaScript regular expressions.

## Installation

To use _regexpu_ programmatically, install it as a dependency via [npm](https://www.npmjs.com/):

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

### `regexpu.rewritePattern(pattern, flags, options)`

This is an alias for the `rewritePattern` function exported by [_regexpu-core_](https://github.com/mathiasbynens/regexpu-core). Please refer to that project’s documentation for more information.

`regexpu.rewritePattern` uses [regjsgen](https://github.com/d10/regjsgen), [regjsparser](https://github.com/jviereck/regjsparser), and [regenerate](https://github.com/mathiasbynens/regenerate) as internal dependencies. If you only need this function in your program, it’s better to include it directly:

```js
// Instead of…
const rewritePattern = require('regexpu').rewritePattern;

// Use this:
const rewritePattern = require('regexpu-core');
```

This prevents the [Recast](https://github.com/benjamn/recast) and [Esprima](https://github.com/ariya/esprima) dependencies from being loaded into memory.

### `regexpu.transformTree(ast, options)` or its alias `regexpu.transform(ast, options)`

This function accepts an abstract syntax tree representing some JavaScript code, and returns a transformed version of the tree in which any regular expression literals that use the ES2015 `u` flag are rewritten in ES5.

```js
const regexpu = require('regexpu');
const recast = require('recast');
const tree = recast.parse(code); // ES2015 code
const transformedTree = regexpu.transform(tree);
const result = recast.print(transformedTree);
console.log(result.code); // transpiled ES5 code
console.log(result.map); // source map
```

The optional `options` object is passed to _regexpu-core_’s `rewritePattern`. For a description of the available options, [see its documentation](https://github.com/mathiasbynens/regexpu-core#rewritepatternpattern-flags-options).

`regexpu.transformTree` uses [Recast](https://github.com/benjamn/recast), [regjsgen](https://github.com/d10/regjsgen), [regjsparser](https://github.com/jviereck/regjsparser), and [regenerate](https://github.com/mathiasbynens/regenerate) as internal dependencies. If you only need this function in your program, it’s better to include it directly:

```js
const transformTree = require('regexpu/transform-tree');
```

This prevents the [Esprima](https://github.com/ariya/esprima) dependency from being loaded into memory.

### `regexpu.transpileCode(code, options)`

This function accepts a string representing some JavaScript code, and returns a transpiled version of this code tree in which any regular expression literals that use the ES2015 `u` flag are rewritten in ES5.

```js
const es2015 = 'console.log(/foo.bar/u.test("foo💩bar"));';
const es5 = regexpu.transpileCode(es2015);
// → 'console.log(/foo(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uDC00-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF])bar/.test("foo💩bar"));'
```

The optional `options` object recognizes the following properties:

* `sourceFileName`: a string representing the file name of the original ES2015 source file.
* `sourceMapName`: a string representing the desired file name of the source map.
* `dotAllFlag`: a boolean indicating whether to enable [experimental support for the `s` (`dotAll`) flag](https://github.com/mathiasbynens/es-regexp-dotall-flag).
* `unicodePropertyEscape`: a boolean indicating whether to enable [experimental support for Unicode property escapes](https://github.com/mathiasbynens/regexpu-core/blob/master/property-escapes.md).

The `sourceFileName` and `sourceMapName` properties must be provided if you want to generate source maps.

```js
const result = regexpu.transpileCode(code, {
  'sourceFileName': 'es2015.js',
  'sourceMapName': 'es2015.js.map',
});
console.log(result.code); // transpiled source code
console.log(result.map); // source map
```

`regexpu.transpileCode` uses [Esprima](https://github.com/ariya/esprima), [Recast](https://github.com/benjamn/recast), [regjsgen](https://github.com/d10/regjsgen), [regjsparser](https://github.com/jviereck/regjsparser), and [regenerate](https://github.com/mathiasbynens/regenerate) as internal dependencies. If you only need this function in your program, feel free to include it directly:

```js
const transpileCode = require('regexpu/transpile-code');
```

## Transpilers that use regexpu internally

If you’re looking for a general-purpose ES.next-to-ES5 transpiler with support for Unicode regular expressions, consider using one of these:

* [Traceur](https://github.com/google/traceur-compiler) v0.0.61+
* [Babel](https://github.com/babel/babel) v1.5.0+
* [esnext](https://github.com/esnext/esnext) v0.12.0+
* [Bublé](https://gitlab.com/Rich-Harris/buble) v0.12.0+

## For maintainers

### How to publish a new release

1. On the `main` branch, bump the version number in `package.json`:

    ```sh
    npm version patch -m 'Release v%s'
    ```

    Instead of `patch`, use `minor` or `major` [as needed](https://semver.org/).

    Note that this produces a Git commit + tag.

1. Push the release commit and tag:

    ```sh
    git push && git push --tags
    ```

    Our CI then automatically publishes the new release to npm.

## Author

| [![twitter/mathias](https://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](https://mathiasbynens.be/) |

## License

_regexpu_ is available under the [MIT](https://mths.be/mit) license.
