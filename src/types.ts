import * as babel from '@babel/core'
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

  /**
   * 转换器。
   *
   * - `swc`: 快，但覆盖率有问题
   * - `typescript+babel`: 可以找出类型问题，js 将用 babel 进行简单转义
   * - `babel`: 使用 babel 深度转义，测试 Vue JSX 必须用这个
   *
   * @default swc
   */
  transformer?: 'swc' | 'typescript+babel' | 'babel'

  /**
   * jsx 变种。
   *
   * @default React
   */
  jsxPragma?: 'React' | 'Vue'
}

export interface CompileConfig {
  /**
   * 名称，显示用。
   */
  name: string

  /**
   * 输入文件列表。
   */
  inputFiles: string[]

  /**
   * 输出目录。
   */
  outDir: string

  /**
   * 模块类型。
   */
  module: 'cjs' | 'esm'

  /**
   * 目标类型。
   *
   * @default 'browser'
   */
  target?: 'node' | 'browser'

  /**
   * JSX 变种。
   *
   * @default 'react'
   */
  jsxPragma?: 'react' | 'vue'

  /**
   * 是否编译前清空输出目录。
   *
   * @default true
   */
  clean?: boolean

  /**
   * 是否输出类型定义文件。
   *
   * @default true
   */
  emitDts?: boolean

  /**
   * babel 配置。
   */
  babel?: {
    /**
     * 额外的预设。
     */
    presets?: babel.PluginItem[]

    /**
     * 额外的插件。
     */
    plugins?: babel.PluginItem[]

    /**
     * 内置插件：导入更名。
     */
    renameImports?: Array<{
      /**
       * 要更名的导入，正则。
       */
      original: string

      /**
       * 更名后的替换，支持占位符，如：$1。
       */
      replacement: string
    }>
  }
}

export type CompileCliConfig = CompileConfig | CompileConfig[]
