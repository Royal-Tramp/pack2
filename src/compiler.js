const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const packageNameRegex = require('package-name-regex');
const findNodeModules = require('find-node-modules');
const Module = require('./Module.js');

module.exports = class compiler {
  constructor({ fileName, content }) {
    this.fileName = fileName;
    this.content = content;
  }
  compile() {
    const fileName = this.fileName;
    const dependencies = {};
    const ast = parser.parse(this.content, {
      sourceType: 'module',
    });
    traverse(ast, {
      ImportDeclaration({ node }) {
        const dirName = path.dirname(fileName);
        if (path.extname(node.source.value)) {
          if (node.source.value.charAt(0) === '.' || node.source.value.charAt(0) === '/') {
            const depPath = path.join(dirName, node.source.value);
            dependencies[node.source.value] = depPath;
          } else {
            const [nodeModulesPath] = findNodeModules({ cwd: process.cwd(), relative: false });
            const moduleRootPath = path.resolve(nodeModulesPath, node.source.value);
            dependencies[node.source.value] = moduleRootPath;
          }
        }
        if (packageNameRegex.test(node.source.value)) {
          const [nodeModulesPath] = findNodeModules({ cwd: process.cwd(), relative: false });
          const moduleRootPath = path.resolve(nodeModulesPath, node.source.value);
          const modulePackagePath = path.join(moduleRootPath, 'package.json');
          const moduleEntryFilePath = require(modulePackagePath).main;
          dependencies[node.source.value] = path.join(moduleRootPath, moduleEntryFilePath);
        }
      },
    });
    const { code } = babel.transformFromAst(ast, null, {
      presets: ['@babel/preset-env'],
    });
    return new Module({
      fileName,
      dependencies,
      code,
    });
  }
};
