import { Linter } from 'eslint'
import { LiteralUnion } from 'vtils'

export interface GetESLintConfigPayload {
  /**
   * 项目根目录。
   *
   * @default process.cwd()
   */
  projectRoot?: string

  /**
   * React 标识符。
   *
   * @default 'React'
   */
  reactPragma?: string

  /**
   * React 版本。默认自动检测。
   *
   * @default 'detect'
   */
  reactVersion?: LiteralUnion<'detect', string>
}

export function getESLintConfig({
  projectRoot = process.cwd(),
  reactPragma = 'React',
  reactVersion = 'detect',
}: GetESLintConfigPayload = {}): Linter.Config {
  // This is a workaround for https://github.com/eslint/eslint/issues/3458
  require('@rushstack/eslint-config/patch-eslint6')

  process.env.HAOMA_PROJECT_ROOT = projectRoot

  return {
    root: true,
    extends: [require.resolve('./ESLintConfig')],
    settings: {
      react: {
        pragma: reactPragma,
        version: reactVersion,
      },
    },
  }
}
