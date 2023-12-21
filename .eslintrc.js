module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ['**/node_modules', "*.spec.ts", '**/dist', '*.js'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  plugins: ['@typescript-eslint'],
  settings: {
  },
  rules: {
    quotes: ['error', 'single'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/semi': ['error', 'never'],
  },
}
