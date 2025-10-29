module.exports = {
  root: true,
  env: { node: true, es2020: true },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'no-console': 'off',
  },
}
