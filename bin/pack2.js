const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const package = require('../package.json');
const pack2 = require('../src/index.js');
program.version(package.version);

program
  .option('-c, --config <path>', '');

program.parse(process.argv);

const configPath = path.resolve(process.cwd(), program.config ? program.config : './pack.config.js')
const config = fs.existsSync(configPath) ? require(configPath) : {};
const compiler = pack2(config)
compiler.build()

