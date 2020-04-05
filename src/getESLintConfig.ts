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

  process.env.HAOMA_PROJECT_ROOT = projectRoot

  return {
    root: true,
    extends: [require.resolve('./ESLintConfig')],
  }
}
