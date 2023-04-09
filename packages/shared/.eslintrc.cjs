module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
