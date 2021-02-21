import { BabelConfig } from './types'
import { getProcessCssPlugin } from './babelPlugins'
import { isRegExp } from 'vtils'

export function getBabelConfig(config: BabelConfig): BabelConfig {
  const hasFileName = !!config.filename
  const isTs = hasFileName
    ? /\.tsx?/i.test(config.filename!)
    : !!config.typescript
  const isJsx = hasFileName ? /\.[j|t]sx/i.test(config.filename!) : !!config.jsx

  const {
    module = 'cjs',
    target = 'browser',
    typescript = isTs,
    jsx = 'react',
    polyfill = false,
    legacyDecorator = false,
    projectRoot,
    outDir,
    getCssModulesScopedName,
    bus,
    renameImport = [],
    modularImport = [],
    environmentVariables = [],
    presets = [],
    plugins = [],
    ...babelConfig
  } = config

  return {
    babelrc: false,
    configFile: false,
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
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
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
      ...(!isJsx
        ? []
        : jsx === 'react'
        ? [require.resolve('@babel/plugin-transform-react-jsx')]
        : jsx === 'vue'
        ? [require.resolve('@vue/babel-plugin-jsx')]
        : []),
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          regenerator: !polyfill,
          useESModules: module === 'esm',
          version: require('@babel/runtime/package.json').version,
        },
      ],
      ...(renameImport.length
        ? [
            [
              require.resolve('babel-plugin-transform-rename-import'),
              {
                replacements: renameImport.map(item => ({
                  ...item,
                  original: isRegExp(item.original)
                    ? String(item.original).replace(/^\/(.+)\/\w*$/, '$1')
                    : item.original,
                })),
              },
            ],
          ]
        : []),
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
