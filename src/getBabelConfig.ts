/* eslint-disable prefer-const */
import { BabelConfig } from './types'
import { getProcessCssPlugin } from './babelPlugins'
import { isFunction, mapValues } from 'vtils'

export function getBabelConfig(config: BabelConfig): BabelConfig {
  const hasFileName = !!config.filename
  const isTs = hasFileName
    ? /\.tsx?/i.test(config.filename!)
    : !!config.typescript
  const isJsx = hasFileName ? /\.[j|t]sx/i.test(config.filename!) : !!config.jsx
  const isTestEnv =
    process.env.JEST_WORKER_ID != null || process.env.NODE_ENV === 'test'

  let {
    fromConfigFile = false,
    module = 'cjs',
    target = isTestEnv ? 'node' : 'browser',
    typescript = isTs,
    jsx = 'react',
    polyfill = false,
    runtime = !isTestEnv,
    legacyDecorator = false,
    projectRoot,
    outDir,
    getCssModulesScopedName,
    bus,
    alias = {},
    modularImport = [],
    environmentVariables = [],
    presets = [],
    plugins = [],
    ...babelConfig
  } = config

  module = isFunction(module) ? module(config.filename!) : module
  target = isFunction(target) ? target(config.filename!) : target
  typescript = isFunction(typescript)
    ? typescript(config.filename!)
    : typescript
  jsx = isFunction(jsx) ? jsx(config.filename!) : jsx
  polyfill = isFunction(polyfill) ? polyfill(config.filename!) : polyfill
  legacyDecorator = isFunction(legacyDecorator)
    ? legacyDecorator(config.filename!)
    : legacyDecorator

  return {
    ...(fromConfigFile
      ? {}
      : {
          babelrc: false,
          configFile: false,
        }),
    ...babelConfig,
    // babel 的 preset 执行顺序是倒置的，即从后往前，
    // 因此，此处应将 typescript 放在 env 后，
    // 避免 class 构造函数的 private 等属性被移除
    // https://babeljs.io/docs/en/presets#preset-ordering
    presets: [
      ...(presets || []),
      [
        require.resolve('@babel/preset-env'),
        {
          loose: true,
          bugfixes: true,
          modules: module === 'esm' ? false : 'cjs',
          targets:
            target === 'node'
              ? {
                  node: '12',
                }
              : target === 'browser'
              ? {
                  ios: '8',
                  android: '4',
                }
              : {},
          ...(polyfill
            ? {
                useBuiltIns: 'usage',
                corejs: {
                  version: require(require.resolve('core-js/package.json'))
                    .version,
                  proposals: true,
                },
              }
            : {}),
        },
      ],
      ...(typescript ? [[require.resolve('@babel/preset-typescript')]] : []),
      ...(!isJsx
        ? []
        : jsx === 'vue2'
        ? [
            [
              require.resolve('@vue/babel-preset-jsx'),
              {
                compositionAPI: true,
              },
            ],
          ]
        : []),
    ],
    // babel 中 plugin 会在 preset 前执行，
    // plugin 的执行顺序是正序的，即从前往后
    // https://babeljs.io/docs/en/plugins#plugin-ordering
    plugins: [
      ...(legacyDecorator
        ? [
            [
              require.resolve('@babel/plugin-proposal-decorators'),
              {
                legacy: true,
              },
            ],
          ]
        : []),
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
      ...(!isJsx
        ? []
        : jsx === 'react'
        ? [require.resolve('@babel/plugin-transform-react-jsx')]
        : jsx === 'vue'
        ? [require.resolve('@vue/babel-plugin-jsx')]
        : []),
      ...(!runtime
        ? []
        : [
            [
              require.resolve('@babel/plugin-transform-runtime'),
              {
                regenerator: !polyfill,
                useESModules: module === 'esm',
                version: require('@babel/runtime/package.json').version,
              },
            ],
          ]),
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          alias: {
            '@': './src',
            ...mapValues(alias, value =>
              typeof value === 'string'
                ? value.replace(/\$(\d+)/g, '\\$1')
                : value,
            ),
          },
        },
      ],
      ...(modularImport.length
        ? modularImport.map((item, index) => [
            require.resolve('babel-plugin-import'),
            item,
            `${item.libraryName}_${index}`,
          ])
        : []),
      ...(environmentVariables.length
        ? [
            [
              require.resolve(
                'babel-plugin-transform-inline-environment-variables',
              ),
              {
                include: environmentVariables,
              },
            ],
          ]
        : []),
      ...(projectRoot && outDir && bus
        ? [
            getProcessCssPlugin({
              projectRoot: projectRoot,
              outDir: outDir,
              getCssModulesScopedName: getCssModulesScopedName,
              bus: bus,
            }),
          ]
        : []),
      ...(plugins || []),
    ],
  }
}
