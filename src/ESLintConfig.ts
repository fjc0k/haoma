import { Linter } from 'eslint'

const ESLintConfig: Linter.Config = {
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
      pragma: process.env.HAOMA_REACT_PRAGMA,
      version: process.env.HAOMA_REACT_VERSION,
    },
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  plugins: ['sort-imports-es6-autofix', 'import'],
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
    'import/newline-after-import': 'error',
    'sort-imports-es6-autofix/sort-imports-es6': [
      'error',
      {
        ignoreCase: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      // @ts-ignore
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      parserOptions: {
        sourceType: 'module',
        // NOTE: 性能问题，去掉
        // ref: https://github.com/typescript-eslint/typescript-eslint/issues/1132
        // project: existsSync(
        //   join(process.env.HAOMA_PROJECT_ROOT!, 'tsconfig.eslint.json'),
        // )
        //   ? './tsconfig.eslint.json'
        //   : './tsconfig.json',
        // tsconfigRootDir: process.env.HAOMA_PROJECT_ROOT!,
      },
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        // NOTE: 性能问题，去掉
        // ref: https://github.com/typescript-eslint/typescript-eslint/issues/1132
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier/@typescript-eslint',
      ],
      rules: {
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
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
      },
    },
    {
      files: ['*.jsx', '*.tsx'],
      // @ts-ignore
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
  ],
}

module.exports = ESLintConfig
