import * as eslint from 'eslint'
import * as jest from '@jest/types'
import * as prettier from 'prettier'
import { LiteralUnion } from 'vtils/types'

export type ESLintConfig = eslint.Linter.Config & {
  settings?: {
    // ref: https://github.com/yannickcr/eslint-plugin-react#configuration
    react?: {
      /**
       * Regex for Component Factory to use
       *
       * @default 'createReactClass'
       */
      createClass?: LiteralUnion<'createReactClass', string>

      /**
       * Pragma to use
       *
       * @default 'React'
       */
      pragma?: LiteralUnion<'React' | 'Taro', string>

      /**
       * React version
       *
       * @default 'detect'
       */
      version?: LiteralUnion<'detect', string>

      /**
       * Flow version
       */
      flowVersion?: string
    }
    vue?: {
      enabled?: boolean
    }
    [key: string]: any
  }
}

export type PrettierConfig = prettier.Options & {
  overrides?: Array<{
    files: string | string[]
    options: prettier.Options
  }>
}

export type JestConfig = Partial<jest.Config.InitialOptions> & {
  /**
   * 要转换的包的名称列表。
   *
   * @example ['lodash-es']
   */
  transformPackages?: string[]
}
