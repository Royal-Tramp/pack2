const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const resolve = require('resolve');
const Module = require('./Module.js');

module.exports = class compiler {
  constructor({ fileName, content }) {
    this.fileName = fileName;
    this.content = content;
  }
  compile() {
    const fileName = this.fileName;
    const dirname = path.dirname(fileName);
    const dependencies = {};

    const ast = parser.parse(this.content, {
      sourceType: 'module',
    });

    traverse(ast, this.dependenciesCollection(dependencies, dirname));

    const { code } = babel.transformFromAst(ast, null, {
      presets: ['@babel/preset-env'],
    });

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
    }
  }
};
