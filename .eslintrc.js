module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true,
    es2020: true
  },
  globals: {
    'require': 'readonly',
    'module': 'readonly',
    'exports': 'writable'
  },
  extends: [
    "plugin:prettier/recommended"
  ]
};
