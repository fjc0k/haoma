import * as babel from '@babel/core'
import * as eslint from 'eslint'
import * as jest from '@jest/types'
import * as prettier from 'prettier'
import { AsyncOrSync, LiteralUnion, Merge } from 'vtils/types'
import { EventBus } from 'vtils'

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

export type JestConfig = Merge<
  Partial<jest.Config.InitialOptions>,
  {
    /**
     * 测试环境。
     *
     * @default 'node'
     */
    testEnvironment?: 'jsdom' | 'node'

    /**
     * 要转换的包的名称列表。
     *
     * @example ['lodash-es']
     */
    transformPackages?: string[]

    /**
     * 转换器。
     *
     * - `typescript+babel`: 可以找出类型问题，js 将用 babel 进行简单转义
     * - `babel`: 使用 babel 深度转义，测试 Vue JSX 必须用这个
     *
     * @default babel
     */
    transformer?: 'typescript+babel' | 'babel'

    /**
     * jsx 变种。
     *
     * @default React
     */
    jsxPragma?: 'React' | 'Vue'
  }
>

export type BabelConfigDynamicallyItem<T> = T | ((file: string) => T)

export interface BabelConfig extends babel.TransformOptions {
  /**
   * @default false
   */
  fromConfigFile?: boolean

  /**
   * 模块类型。
   *
   * @default 'cjs'
   */
  module?: BabelConfigDynamicallyItem<'cjs' | 'esm'>

  /**
   * 目标类型。
   *
   * @default 'browser'
   */
  target?: BabelConfigDynamicallyItem<'node' | 'browser' | 'browserslist'>

  /**
   * 是否启用 JSX。
   */
  jsx?: BabelConfigDynamicallyItem<'react' | 'vue' | 'vue2'>

  /**
   * 是否启用 core-js 垫片。
   *
   * @default false
   */
  polyfill?: BabelConfigDynamicallyItem<boolean>

  /**
   * 是否引入 @babel/runtime。
   *
   * @default true
   */
  runtime?: boolean

  /**
   * 是否启用 TypeScript 支持。
   */
  typescript?: BabelConfigDynamicallyItem<boolean>

  /**
   * 是否启用初版装饰器支持。
   */
  legacyDecorator?: BabelConfigDynamicallyItem<boolean>

  /**
   * 项目根目录。（处理 CSS 有用）
   */
  projectRoot?: string

  /**
   * 输出目录。（处理 CSS 有用）
   */
  outDir?: string

  /**
   * CSSModules 名称。
   */
  getCssModulesScopedName?: (payload: {
    className: string
    fileName: string
  }) => string

  /**
   * 别名。
   *
   * 键以 `^` 开头或以 `$` 结尾时会被认为是正则。
   *
   * 值为字符串时支持占位符，如：$1。
   *
   * 值为函数时第一个参数是所有匹配的数组。
   */
  alias?: Record<string, string | ((matches: string[]) => string)>

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

  /**
   * 是否启用环境变量替换。
   *
   * @example ['NODE_ENV']
   */
  environmentVariables?: string[]

  bus?: EventBus<{
    addAfterWriteTransformer: (
      transformer: (content: string) => AsyncOrSync<string>,
    ) => any
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

  /**
   * 是否打包类型定义文件。
   */
  rollupDts?: boolean

  /**
   * 打包类型定义文件列表。
   *
   * @default ['index.d.ts']
   */
  rollupDtsFiles?: string[]

  /**
   * 打包类型定义排除文件列表。
   */
  rollupDtsExcludeFiles?: string[]

  /**
   * 打包类型定义文件包括的包。
   */
  rollupDtsIncludedPackages?: string[]
}

export type CompileCliConfig = CompileConfig | CompileConfig[]
