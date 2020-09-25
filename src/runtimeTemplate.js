module.exports = function ({ entryPath, graphJSON }) {
  return `(function(modules){
  var installedModules = {};
  function require(moduleId) {
    
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }

    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    }

    modules[moduleId].js.call(module.exports, module, module.exports, function(relativePath) {
      return require(modules[moduleId].dependencies[relativePath])
    });

    module.l = true;

    return module.exports;
  }
  return require('${entryPath}')
})(${graphJSON})
`;
};
