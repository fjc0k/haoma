import merge from 'deepmerge'
import { join } from 'path'
import { PrettierConfig } from './types'

export function getPrettierConfig(
  customConfig: PrettierConfig = {},
  projectRoot: string = process.cwd(),
): PrettierConfig {
  const paths: string[] = [
    join(__dirname, '../node_modules'),
    join(projectRoot, 'node_modules'),
  ]

  return merge<PrettierConfig>(
    {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: false,
      singleQuote: true,
      quoteProps: 'consistent',
      jsxSingleQuote: true,
      trailingComma: 'all',
      bracketSpacing: true,
      jsxBracketSameLine: true,
      arrowParens: 'avoid',
      endOfLine: 'lf',
      vueIndentScriptAndStyle: true,
      plugins: [
        require.resolve('prettier-plugin-packagejson', { paths }),
        require.resolve('prettier-plugin-sh', { paths }),
      ],
      overrides: [
        {
          files: ['.npmrc', '.yarnrc'],
          options: {
            // @ts-ignore
            parser: 'sh',
          },
        },
      ],
    },
    customConfig,
  )
}
