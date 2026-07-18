module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'i18next'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'i18next/no-literal-string': [
      'warn',
      {
        markupOnly: true,
        ignoreComponent: ['Trans'],
        ignore: ['className', 'id', 'type', 'htmlFor', 'aria-*', 'data-*', 'key', 'role'],
      },
    ],
  },
}



