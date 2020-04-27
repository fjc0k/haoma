import merge from 'deepmerge'
import { ESLintConfig } from './types'

export function getESLintConfig(customConfig: ESLintConfig = {}): ESLintConfig {
  // This is a workaround for https://github.com/eslint/eslint/issues/3458
  require('@rushstack/eslint-config/patch-eslint6')

  return merge<ESLintConfig>(
    {
      root: true,
      extends: [require.resolve('./ESLintConfig')],
    },
    customConfig,
  )
}
