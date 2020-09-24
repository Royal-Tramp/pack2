const path = require('path');
const UglifyJS = require("uglify-js");
const chalk = require('chalk');
const defaultOptions = require('./options.js');
const { pipe } = require('./utils.js');
const FileSystem = require('./fileSystem.js');
const Dependencies = require('./dependencies.js');
const Watch = require('./Watch.js');
const runtimeTemplate = require('./runtimeTemplate.js');

class Pack2 {
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options
    }
    this.fileSystem = new FileSystem(this);
    this.dependencies = new Dependencies(this);
    this.watch = new Watch(this);
  }
  build() {
    const entryPath = path.resolve(this.options.rootPath, this.options.entry)
    return pipe([
      this.analyseDependencies.bind(this),
      this.options.watch ? this.pass(([ graph, sourceMap ]) => this.watchDependencies([ graph, sourceMap ])) : this.pass(),
      this.generateCode.bind(this),
      this.options.compress ? this.compressCode.bind(this) : this.pass(),
      this.pass(() => this.removeDist()),
      this.pass((code) => this.generateBundle(code)),
    ])(entryPath)
  }
  pass(handle) {
    return (params) => {
      handle && handle(params)
      return params
    }
  }
  analyseDependencies(entryPath) {
    return this.dependencies.make(entryPath)
  }
  watchDependencies([ graph, sourceMap ]) {
    this.watch.addGraph(graph).on('change', () => {
      console.log(chalk.blue('dependencies changed!'))
      const entryPath = path.resolve(this.options.rootPath, this.options.entry)
      return pipe([
        this.analyseDependencies.bind(this),
        this.generateCode.bind(this),
        this.options.compress ? this.compressCode.bind(this) : this.pass(),
        this.pass((code) => this.generateBundle(code)),
      ])(entryPath)
    })
  }
  generateCode([ graph, sourceMap ]) {
    const entryPath = path.resolve(this.options.rootPath, this.options.entry)
    const graphJSON = this.dependencies.createGraphJSON(graph, sourceMap)
    return runtimeTemplate({
      entryPath,
      graphJSON
    });
  }
  compressCode(code) {
    const result = UglifyJS.minify(code);
    return result.code;
  }
  removeDist() {
    const distPath = path.resolve(this.options.rootPath, this.options.output)
    this.fileSystem.remove(distPath)
  }
  generateBundle(code) {
    const bundlePath = path.resolve(this.options.rootPath, this.options.output, './bundle.js')
    this.fileSystem.write(bundlePath, code)
  }
}

module.exports = function pack2(options) {
  return new Pack2(options);
};