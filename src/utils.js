const pipe = (fn) => (x) => fn.reduce((x, f) => f(x), x);
const through = (handle = () => {}) => (params) => {
	handle(params);
	return params;
};
const getAliasPath = (path, alias) => {
	for (let aliasKey in alias) {
		if (path.startsWith(aliasKey)) {
			return [aliasKey, alias[aliasKey]];
		}
	}
	return [null, null];
};

module.exports = {
	pipe,
	through,
	getAliasPath,
};
