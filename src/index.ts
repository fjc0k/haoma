import { Linter } from 'eslint'
import { Options } from 'prettier'

export type ESLintConfig = Linter.Config
export type PrettierConfig = Options

// @index('./get*', f => `export * from '${f.path}'`)
export * from './getESLintConfig'
export * from './getPrettierConfig'
// @endindex
