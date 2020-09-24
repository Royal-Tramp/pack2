const chokidar = require('chokidar');

module.exports = class Watch {
  constructor(pack2) {
    this.pack2 = pack2;
  }
  addGraph(graph) {
    return chokidar.watch(Object.keys(graph));
  }
};
