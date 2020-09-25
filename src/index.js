const path = require('path');
const { EventEmitter } = require('events')
const UglifyJS = require('uglify-js');
const chalk = require('chalk');
const mergeOptions = require('merge-options');
const defaultOptions = require('./options.js');
const { pipe, through } = require('./utils.js');
const PluginSystem = require('./pluginSystem.js');
const FileSystem = require('./fileSystem.js');
const Dependencies = require('./dependencies.js');
const Watch = require('./Watch.js');
const runtimeTemplate = require('./runtimeTemplate.js');
const hookNames  = require('./hookNames.js');
const {
  BUILD_START,
  BUILD_END,
  BUILD_CHANGE
} = hookNames;

class Pack2 extends EventEmitter {
  constructor(options = {}) {
    super()
    this.options = mergeOptions.call(
      {
        concatArrays: true,
        ignoreUndefined: true,
      },
      defaultOptions,
      options
    );
    this.entryPath = path.resolve(this.options.rootPath, this.options.entry);
    this.pluginSystem = new PluginSystem(this);
    this.fileSystem = new FileSystem(this);
    this.dependencies = new Dependencies(this);
    this.watch = new Watch(this);
    this.init();
  }
  init() {
    this.pluginSystem.init()
  }
  build() {
    return pipe([
      through(() => this.emit(BUILD_START)),
      this.analyseDependencies.bind(this),
      this.options.watch
        ? through(([graph, sourceMap]) => this.watchDependencies([graph, sourceMap]))
        : through(),
      this.generateCode.bind(this),
      this.options.compress ? this.compressCode.bind(this) : through(),
      through(() => this.removeDist()),
      through((code) => this.generateBundle(code)),
      through(() => this.emit(BUILD_END)),
    ])(this.entryPath);
  }
  analyseDependencies(entryPath) {
    return this.dependencies.make(entryPath);
  }
  watchDependencies([graph, sourceMap]) {
    this.watch.addGraph(graph).on('change', () => {
      console.log(chalk.blue('dependencies changed!'));
      this.emit(BUILD_CHANGE);
      return pipe([
        through(() => this.emit(BUILD_START)),
        this.analyseDependencies.bind(this),
        this.generateCode.bind(this),
        this.options.compress ? this.compressCode.bind(this) : through(),
        through((code) => this.generateBundle(code)),
        through(() => this.emit(BUILD_END)),
      ])(this.entryPath);
    });
  }
  generateCode([graph, sourceMap]) {
    const graphJSON = this.dependencies.createGraphJSON(graph, sourceMap);
    return runtimeTemplate({
      entryPath: this.entryPath,
      graphJSON,
    });
  }
  compressCode(code) {
    const result = UglifyJS.minify(code);
    return result.code;
  }
  removeDist() {
    const distPath = path.resolve(this.options.rootPath, this.options.output);
    this.fileSystem.remove(distPath);
  }
  generateBundle(code) {
    const bundlePath = path.resolve(this.options.rootPath, this.options.output, './bundle.js');
    this.fileSystem.write(bundlePath, code);
  }
}

function pack2(options) {
  return new Pack2(options);
}

Object.keys(hookNames).map((name) => pack2[name] = name)

module.exports = pack2;
