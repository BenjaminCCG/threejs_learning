module.exports = {
  extends: ['alloy', 'alloy/vue', 'alloy/typescript', './.eslintrc-auto-import'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: {
      js: '@babel/eslint-parser',
      jsx: '@babel/eslint-parser',

      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser'

      // Leave the template parser unspecified, so that it could be determined by `<script lang="...">`
    }
  },
  env: {
    // Your environments (which contains several predefined global variables)
    //
    browser: true,
    node: true
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // Your global variables (setting to false means it's not allowed to be reassigned)
    //
    ComponentInstance: true
  },
  rules: {
    // Customize your rules
    //
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-unused-vars': 2,
    // Please keep this rule off because it requiresTypeChecking
    // https://github.com/vuejs/vue-eslint-parser/issues/104
    // https://github.com/typescript-eslint/typescript-eslint/pull/5318
    '@typescript-eslint/prefer-optional-chain': 'off'
  }
};
