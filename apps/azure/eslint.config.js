const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  { rules: {} },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
    languageOptions: { parserOptions: { project: ['azure/tsconfig.*?.json'] } },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
