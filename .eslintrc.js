module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'airbnb/hooks'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [0],
    'react/prop-types': [0],
    'react/require-default-props': [0],
    'react/jsx-props-no-spreading': [0],
    'array-callback-return': [0],
    'no-param-reassign': [0],
    camelcase: [0],
    'react-hooks/exhaustive-deps': [0],
    'jsx-a11y/no-autofocus': [0],
    'react/jsx-no-useless-fragment': [0],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./', 'src'],
      },
    },
  },
  ignorePatterns: ['serviceWorker.js'],
};
