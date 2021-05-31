module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],

  rules: {
    //'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off',
    'vue/no-unused-vars': 'off',
    'vue/no-unused-components': 'off',
    'no-undef': 'off',
    'no-redeclare': 'off',
    'no-useless-escape': 'off',
    'no-extra-boolean-cast': 'off',
  },

  parserOptions: {
    parser: '@typescript-eslint/parser'
  },

  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript'
  ]
}
