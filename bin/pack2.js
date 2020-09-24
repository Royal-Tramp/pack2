const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const pkg = require('../package.json');
const pack2 = require('../src/index.js');
program.version(pkg.version);

program.option('-c, --config <path>', '');

program.parse(process.argv);

const configPath = path.resolve(
  process.cwd(),
  program.config ? program.config : './pack.config.js'
);
const config = fs.existsSync(configPath) ? require(configPath) : {};
const compiler = pack2(config);
compiler.build();
