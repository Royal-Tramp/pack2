module.exports = class PluginSystem {
  constructor(pack2) {
    this.pack2 = pack2;
    this.plugins = pack2.options.plugins;
  }
  init() {
    this.plugins.map((hooks) => {
      Object.keys(hooks).map((hookName) => {
        this.pack2.on(hookName, hooks[hookName].bind(hooks));
      });
    });
  }
};
