const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const resolve = require('resolve');
const Module = require('./Module.js');
const {
  COMPILER_PARSE_BEFORE,
  COMPILER_PARSE_AFTER,
  COMPILER_TRANSFORM_BEFORE,
  COMPILER_TRANSFORM_AFTER
} = require('./hookNames.js');

module.exports = class compiler {
  constructor({ pack2, fileName, content, parseOptions, babelrc }) {
    this.pack2 = pack2;
    this.fileName = fileName;
    this.content = content;
    this.parseOptions = parseOptions;
    this.babelrc = babelrc;
  }
  compile() {
    const fileName = this.fileName;
    const dirname = path.dirname(fileName);
    const dependencies = {};
    this.pack2.emit(COMPILER_PARSE_BEFORE, this.content)
    const ast = parser.parse(this.content, this.parseOptions);
    this.pack2.emit(COMPILER_PARSE_AFTER, ast)

    traverse(ast, this.dependenciesCollection(dependencies, dirname));

    this.pack2.emit(COMPILER_TRANSFORM_BEFORE, ast)
    const { code } = babel.transformFromAst(ast, null, this.babelrc);
    this.pack2.emit(COMPILER_TRANSFORM_AFTER, code)

    return new Module({
      fileName,
      dependencies,
      code,
    });
  }
  dependenciesCollection(dependencies, dirname) {
    return {
      ImportDeclaration({ node }) {
        const moduleId = node.source.value;
        const modulePath = resolve.sync(moduleId, { basedir: dirname });
        dependencies[moduleId] = modulePath;
      },
    };
  }
};
