module.exports = {
  rootPath: '',
  entry: 'src/index.js',
  output: 'dist',
  watch: false,
  server: false,
  evaluation: false,
  compress: false,
  parseOptions: {
    sourceType: 'module',
    plugins: [],
  },
  babelrc: {
    presets: ['@babel/preset-env'],
  },
};
