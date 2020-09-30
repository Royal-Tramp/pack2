function getUMDTemplate(content, { library }) {
	return `(function packUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
      module.exports = factory();
    else if(typeof define === 'function' && define.amd)
      define([], factory);
    else if(typeof exports === 'object')
      exports["${library}"] = factory();
    else
      root["${library}"] = factory();
      if (root["${library}"].__esModule) {
        root["${library}"] = root["${library}"].default
      }
  })(window, function() {
    return ${content};
  })
  `;
}

module.exports = function ({ entryPath, graphJSON, env, library, libraryTarget }) {
	const defaultTemplate = `(function(modules){
    var installedModules = {};
    var process = ${JSON.stringify({ env })}
    
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
      }, process);
  
      module.l = true;
  
      return module.exports;
    }
    return require('${entryPath}')
  })(${graphJSON})
  `;
	if (libraryTarget === 'umd') {
		return getUMDTemplate(defaultTemplate, { library });
	}
	return defaultTemplate;
};
