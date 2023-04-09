module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.cjs'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:solid/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'solid'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
