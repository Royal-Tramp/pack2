const Compiler = require('./Compiler.js');
const { DEPEND_GRAPH } = require('./hookNames.js');

module.exports = class Dependencies {
	constructor(pack2) {
		this.pack2 = pack2;
	}
	make(entryPath) {
		const hasAnalyseFileMap = {};
		const entryModule = this.moduleAnalyser(entryPath);
		const graphList = [entryModule];
		for (let i = 0; i < graphList.length; i++) {
			const module = graphList[i];
			const { dependencies } = module;
			if (dependencies) {
				for (let j in dependencies) {
					if (this.pack2.options.debug) {
						console.log(dependencies[j]);
					}
					if (!hasAnalyseFileMap[j]) {
						hasAnalyseFileMap[j] = true;
						graphList.push(this.moduleAnalyser(dependencies[j]));
					}
				}
			}
		}

		return graphList.reduce(
			([graph, sourceMap], module) => {
				graph[module.fileName] = {
					dependencies: module.dependencies,
					js: `__${module.fileName}__`,
				};
				sourceMap[module.fileName] = {
					code: `function(module, exports, require, process) {\n${module.code}\n}`,
				};
				return [graph, sourceMap];
			},
			[{}, {}]
		);
	}
	moduleAnalyser(fileName) {
		const content = this.pack2.fileSystem.read(fileName);
		const compiler = new Compiler({
			pack2: this.pack2,
			fileName,
			content,
			parseOptions: this.pack2.options.parseOptions,
			babelrc: this.pack2.options.babelrc,
		});
		return compiler.compile();
	}
	createGraphJSON(graph, sourceMap) {
		this.pack2.emit(DEPEND_GRAPH, graph, sourceMap);
		let graphJSON = JSON.stringify(graph, null, 2);
		return Object.keys(graph).reduce((graphJSON, fileName) => {
			return graphJSON.replace(`"__${fileName}__"`, () => sourceMap[fileName].code);
		}, graphJSON);
	}
};
