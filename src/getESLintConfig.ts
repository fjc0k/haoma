import merge from 'deepmerge'
import { ESLintConfig } from './types'

export function getESLintConfig(customConfig: ESLintConfig = {}): ESLintConfig {
  if (customConfig.settings?.vue?.enabled === false) {
    process.env.VUE_DISABLED = '1'
  }

  return merge<ESLintConfig>(
    {
      root: true,
      extends: [require.resolve('./ESLintConfig')],
    },
    customConfig,
  )
}
