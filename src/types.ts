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

export interface BabelConfig extends babel.TransformOptions {
  /**
   * 模块类型。
   *
   * @default 'cjs'
   */
  module?: 'cjs' | 'esm'

  /**
   * 目标类型。
   *
   * @default 'browser'
   */
  target?: 'node' | 'browser'

  /**
   * 是否启用 JSX。
   */
  jsx?: 'react' | 'vue'

  /**
   * 是否启用 TypeScript 支持。
   */
  typescript?: boolean

  /**
   * 是否启用初版装饰器支持。
   */
  legacyDecorator?: boolean

  /**
   * 是否启用导入更名插件。
   */
  renameImport?: Array<{
    /**
     * 要更名的导入，正则。
     */
    original: string

    /**
     * 更名后的替换，支持占位符，如：$1。
     */
    replacement: string
  }>

  /**
   * 是否启用按需导入。
   */
  modularImport?: Array<{
    /**
     * 包名。
     */
    libraryName: string

    /**
     * 包产物路径。
     *
     * @default 'lib'
     */
    libraryDirectory?: string

    /**
     * 是否将驼峰命名转换为横线命名。比如：`TimePicker -> time-picker`
     *
     * @default true
     */
    camel2DashComponentName?: boolean

    customName?: (name: string, file: Object) => string

    style?: 'css' | true | ((name: string, file: Object) => string | false)

    styleLibraryDirectory?: string

    customStyleName?: (name: string, file: Object) => string

    transformToDefaultImport?: boolean
  }>
}

export interface CompileConfig extends BabelConfig {
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
}

export type CompileCliConfig = CompileConfig | CompileConfig[]
