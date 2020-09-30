const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const resolve = require('resolve');
const { getAliasPath } = require('./utils');
const Module = require('./Module.js');
const {
	COMPILER_PARSE_BEFORE,
	COMPILER_PARSE_AFTER,
	COMPILER_TRANSFORM_BEFORE,
	COMPILER_TRANSFORM_AFTER,
} = require('./hookNames.js');

module.exports = class compiler {
	constructor({ pack2, fileName, content, parseOptions, babelrc }) {
		this.pack2 = pack2;
		this.fileName = fileName;
		this.content = content;
		this.parseOptions = parseOptions;
		this.babelrc = babelrc;
		this.parse = parser.parse;
		this.traverse = traverse;
		this.transformFromAst = babel.transformFromAst;
	}
	compile() {
		const fileName = this.fileName;
		const dirname = path.dirname(fileName);
		const dependencies = {};

		this.pack2.emit(COMPILER_PARSE_BEFORE, this);

		this.ast = this.parse(this.content, this.parseOptions);

		this.pack2.emit(COMPILER_PARSE_AFTER, this);

		this.traverse(
			this.ast,
			this.dependenciesCollection(dependencies, dirname, this.pack2.options.alias)
		);

		this.pack2.emit(COMPILER_TRANSFORM_BEFORE, this);

		const { code } = this.transformFromAst(this.ast, null, this.babelrc);

		this.pack2.emit(COMPILER_TRANSFORM_AFTER, this);

		return new Module({
			fileName,
			dependencies,
			code,
		});
	}
	dependenciesCollection(dependencies, dirname, alias) {
		function moduleASTHandler(moduleId) {
			let modulePath = '';
			const [aliasKey, aliasPath] = getAliasPath(moduleId, alias);
			if (aliasPath) {
				if (path.extname(aliasPath)) {
					modulePath = aliasPath;
				} else {
					modulePath = path.join(aliasPath, moduleId.slice(aliasKey.length));
					modulePath = resolve.sync(modulePath, { basedir: dirname });
				}
			} else {
				modulePath = resolve.sync(moduleId, { basedir: dirname });
			}
			dependencies[moduleId] = modulePath;
		}
		return {
			ImportDeclaration({ node }) {
				moduleASTHandler(node.source.value);
			},
			CallExpression({ node }) {
				if (node.callee.name === 'require') {
					moduleASTHandler(node.arguments[0].value);
				}
			},
		};
	}
};
