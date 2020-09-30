module.exports = class Module {
	constructor({ fileName, dependencies, importedValues, code }) {
		this.fileName = fileName;
		this.dependencies = dependencies;
		this.importedValues = importedValues;
		this.code = code;
	}
};
