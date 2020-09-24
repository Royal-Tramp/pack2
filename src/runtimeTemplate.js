module.exports = function ({ entryPath, graphJSON }) {
  return `(function(graph){
  function require(module) {
    function localRequire(relativePath) {
      return require(graph[module].dependencies[relativePath])
    }
    var exports = {};
    (function(require, exports, js){
      js(require,exports)
    })(localRequire, exports, graph[module].js)
    return exports;
  }
  require('${entryPath}')
})(${graphJSON})
`;
};
