# pack2

[![Version](https://img.shields.io/badge/version-0.1.1-blue.svg)]()
[![Language](https://img.shields.io/badge/language-javascript-blue.svg)]()
[![License: MIT](https://img.shields.io/badge/license-MIT-purple.svg)](https://opensource.org/licenses/MIT)

## Overview

Pack2 is a mini module bundler for JavaScript, the name comes from my favorite rapper Tupac.

## Install

```bash
$ npm install -g https://github.com/Royal-Tramp/pack2
```

## Usage

Commands

```bash
$ pack2 -h
Usage: pack2 [options]

Options:
  -V, --version        output the version number
  -c, --config <path>  
  -h, --help           display help for command
```

Modules

```js
const pack2 = require('pack2');
const config = require('./pack.config.js');

const compiler = pack2(config);
compiler.build();
```

## Config

Pack2 will search by default `pack.config.js` In your project root directory.

#### `rootPath`
default: `''`

`rootPath` allows you to specify the base path for all the assets within your application.

#### `entry`
default: `'src/index.js'`

Your entry file path, eg:

```js
module.exports = {
  entry: 'src/index.js'
};
```

#### `output`
default: `'dist'`

Write the compiled files to disk, eg:

```js
module.exports = {
  output: 'dist'
};
```

#### `library`
default: `''`

How the value of the `library` is used depends on the value of the `libraryTarget`; please refer to that section for the complete details. eg:

```js
module.exports = {
  library: 'MyLibrary',
  libraryTarget: 'umd',
};
```

#### `libraryTarget`
default: `''`

These options assign the return value of the entry point to a specific object under the name defined by `library`

#### `watch`
default: `false`

Listen for file changes and rebuild.

#### `compress`
default: `false`

Compress generated files.

#### `env`
default: `{}`

You can configure environment variables to make distinctions in your code. eg:

`pack.config.js`
```js
module.exports = {
  env: {
    NODE_ENV: 'production'
  },
};
```

`src/index.js`
```js
const isProd = process.env.NODE_ENV === 'production'
```

#### `alias`
default: `{}`

Create aliases to `import` or `require` certain modules more easily. eg:

```js
module.exports = {
  alias: {
    component: path.resolve(__dirname, 'src/component/'),
  },
};
```

Now, instead of using relative paths when importing like so:

```js
import Button from '../../component/Button';
```

you can use the alias:

```js
import Button from 'component/Button';
```

#### `debug`
default: `false`

Display the relevant build information.

## Plug-in

We provide plug-in so that you can make more extensions to pack2.

example:

```js
const path = require('path');

const CSSPlugin = (options) => ({
  COMPILER_PARSE_BEFORE(compiler) {
    if (path.extname(compiler.fileName) === '.css') {
      compiler.content = `export default '${compiler.content}'`
    }
  }
})

module.exports = {
  plugins: [
    CSSPlugin({})
  ]
}
```

## Hooks

| HookName                 | Description               |
| :----------------------- | :------------------------ |
| BUILD_START              | build start               |
| BUILD_END                | build end                 |
| BUILD_CHANGE             | source files changed      |
| COMPILER_PARSE_BEFORE    | compiler parse before     |
| COMPILER_PARSE_AFTER     | compiler parse after      |
| COMPILER_TRANSFORM_BEFORE| compiler transform before |
| COMPILER_TRANSFORM_AFTER | compiler transform before |
| COMPRESS_BEFORE          | compress before           |
| COMPRESS_AFTER           | compress after            |
| DEPEND_GRAPH             | create depend graph before|
| LIFE_GOES_ON             | easter egg                |

## Other

You can look at the example, which shows some different uses.

## License

[MIT](LICENSE)
