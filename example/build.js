const pack2 = require('../src/index.js');
const {
  BUILD_START,
  BUILD_END
} = pack2;
const config = require('./pack.config.js');

const CustomPlugin = (options) => ({
  [BUILD_START]() {
    console.log('BUILD_START')
  },
  [BUILD_END]() {
    console.log('BUILD_END')
  },
  COMPILER_PARSE_BEFORE(code) {
    console.log('COMPILER_PARSE_BEFORE')
  },
  COMPILER_PARSE_AFTER(ast) {
    console.log('COMPILER_PARSE_AFTER')
  }
})

config.plugins = [
  CustomPlugin()
]

const compiler = pack2(config);
compiler.build();