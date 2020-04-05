import { existsSync } from 'fs'
import { join } from 'path'
import { Linter } from 'eslint'

export interface GetESLintConfigPayload {
  /**
   * 项目根目录。
   *
   * @default process.cwd()
   */
  projectRoot?: string
}

export function getESLintConfig({
  projectRoot = process.cwd(),
}: GetESLintConfigPayload = {}): Linter.Config {
  // This is a workaround for https://github.com/eslint/eslint/issues/3458
  require('@rushstack/eslint-config/patch-eslint6')

  return {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: ['eslint:recommended'],
    env: {
      browser: true,
      node: true,
      commonjs: true,
      es6: true,
      jest: true,
    },
    plugins: ['sort-imports-es6-autofix', 'import', 'react'],
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'default-case': 'error',
      'no-else-return': 'error',
      'no-floating-decimal': 'error',
      'no-return-await': 'error',
      'no-unneeded-ternary': 'error',
      'no-irregular-whitespace': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-eq-null': 'off',
      'eqeqeq': ['error', 'smart'],
      'eol-last': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
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
      'react/react-in-jsx-scope': 'error',
      'react/jsx-boolean-value': ['error', 'always'],
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'react/jsx-pascal-case': 'error',
      'react/jsx-key': 'error',
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
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        // @ts-ignore
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        parserOptions: {
          sourceType: 'module',
          project: existsSync(join(projectRoot, 'tsconfig.eslint.json'))
            ? './tsconfig.eslint.json'
            : './tsconfig.json',
          tsconfigRootDir: projectRoot,
        },
        extends: [
          'plugin:@typescript-eslint/eslint-recommended',
          'plugin:@typescript-eslint/recommended',
          'plugin:@typescript-eslint/recommended-requiring-type-checking',
        ],
        rules: {
          '@typescript-eslint/ban-ts-ignore': 'off',
          '@typescript-eslint/await-thenable': 'off',
          '@typescript-eslint/member-delimiter-style': 'off',
          '@typescript-eslint/explicit-function-return-type': 'off',
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/consistent-type-assertions': [
            'error',
            {
              assertionStyle: 'as',
              objectLiteralTypeAssertions: 'allow',
            },
          ],
        },
      },
    ],
  }
}
