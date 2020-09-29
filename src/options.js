module.exports = {
  rootPath: '',
  entry: 'src/index.js',
  output: 'dist',
  library: 'CubeSdk',
  libraryTarget: 'umd',
  watch: false,
  server: false,
  evaluation: false,
  compress: false,
  env: {},
  alias: {},
  parseOptions: {
    sourceType: 'module',
    plugins: [],
  },
  babelrc: {
    presets: ['@babel/preset-env'],
  },
  plugins: [],
  debug: false,
};
