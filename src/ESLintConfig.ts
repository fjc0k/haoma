import { ESLintConfig as ESLintConfigTypes } from './types'

const ESLintConfig: ESLintConfigTypes = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['eslint:recommended', 'prettier'],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  plugins: ['sort-imports-es6-autofix'],
  rules: {
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'default-case': 'error',
    'no-else-return': 'error',
    'no-return-await': 'error',
    'no-unneeded-ternary': 'error',
    'no-irregular-whitespace': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-eq-null': 'off',
    'eqeqeq': ['error', 'smart'],
    'new-cap': [
      'error',
      {
        newIsCap: true,
        capIsNew: false,
        properties: true,
      },
    ],
    'sort-imports-es6-autofix/sort-imports-es6': [
      'error',
      {
        ignoreCase: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'],
      },
    ],
    'no-control-regex': 'off',
    'no-case-declarations': 'off',
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '[iI]gnored$',
        argsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      parserOptions: {
        sourceType: 'module',
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            varsIgnorePattern: '[iI]gnored$',
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'as',
            objectLiteralTypeAssertions: 'allow',
          },
        ],
        '@typescript-eslint/no-empty-interface': [
          'error',
          {
            allowSingleExtends: true,
          },
        ],
        '@typescript-eslint/ban-types': 'off',
      },
    },
    {
      files: ['*.jsx', '*.tsx'],
      plugins: ['react'],
      extends: ['plugin:react/recommended', 'prettier/react'],
      rules: {
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/jsx-boolean-value': ['error', 'always'],
        'react/self-closing-comp': [
          'error',
          {
            component: true,
            html: true,
          },
        ],
        'react/jsx-pascal-case': 'error',
        'react/no-array-index-key': 'error',
        'react/jsx-sort-props': [
          'error',
          {
            callbacksLast: true,
            noSortAlphabetically: true,
            reservedFirst: true,
          },
        ],
      },
    },
    {
      files: ['*.vue'],
      plugins: ['vue'],
      extends: ['plugin:vue/recommended', 'prettier/vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
      },
      rules: {
        'vue/html-self-closing': 'error',
      },
    },
  ],
}

module.exports = ESLintConfig
