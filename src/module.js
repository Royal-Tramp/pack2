module.exports = class Module {
  constructor({
    fileName,
    dependencies,
    code,
  }) {
    this.fileName = fileName
    this.dependencies = dependencies
    this.code = code
  }
}