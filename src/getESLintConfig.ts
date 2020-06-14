import merge from 'deepmerge'
import { ESLintConfig } from './types'

export function getESLintConfig(customConfig: ESLintConfig = {}): ESLintConfig {
  return merge<ESLintConfig>(
    {
      root: true,
      extends: [require.resolve('./ESLintConfig')],
    },
    customConfig,
  )
}
