const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const resolve = require('resolve');
const Module = require('./Module.js');

module.exports = class compiler {
  constructor({ fileName, content, parseOptions, babelrc }) {
    this.fileName = fileName;
    this.content = content;
    this.parseOptions = parseOptions;
    this.babelrc = babelrc;
  }
  compile() {
    const fileName = this.fileName;
    const dirname = path.dirname(fileName);
    const dependencies = {};

    const ast = parser.parse(this.content, this.parseOptions);

    traverse(ast, this.dependenciesCollection(dependencies, dirname));

    const { code } = babel.transformFromAst(ast, null, this.babelrc);

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
