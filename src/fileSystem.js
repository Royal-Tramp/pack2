const fse = require('fs-extra');

module.exports = class FileSystem {
  constructor(pack2) {
    this.options = {
      encode: 'utf-8',
    };
    this.pack2 = pack2;
  }
  write(path, content) {
    fse.ensureFileSync(path);
    return fse.writeFileSync(path, content, this.options.encode);
  }
  remove(path) {
    return fse.removeSync(path);
  }
  read(path) {
    return fse.readFileSync(path, this.options.encode);
  }
};
