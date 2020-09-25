const pack2 = require('../src/index.js');
const config = require('./pack.config.js');
const compiler = pack2(config);
compiler.build();