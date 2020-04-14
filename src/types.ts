import { Linter } from 'eslint'
import { Options } from 'prettier'

export type ESLintConfig = Linter.Config

export type PrettierConfig = Options & {
  overrides?: Array<{
    files: string | string[]
    options: Options
  }>
}
