module.exports = {
  entry: "./src/index.js",
  output: "./dist",
  parseOptions: {
    plugins: [
      "jsx"
    ]
  },
  babelrc: {
    presets: [
      '@vue/babel-preset-jsx'
    ],
  }
}