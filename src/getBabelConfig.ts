import { BabelConfig } from './types'
import { getProcessCssPlugin } from './babelPlugins'

export function getBabelConfig(config: BabelConfig): BabelConfig {
  const hasFileName = !!config.filename
  const isTs = hasFileName && /\.tsx?/i.test(config.filename!)
  const isJsx = hasFileName && /\.[j|t]sx/i.test(config.filename!)

  const {
    module = 'cjs',
    target = 'browser',
    typescript = isTs,
    jsx = 'react',
    legacyDecorator = false,
    projectRoot,
    outDir,
    getCssModulesScopedName,
    bus,
    renameImport = [],
    modularImport = [],
    presets = [],
    plugins = [],
    ...babelConfig
  } = config

  return {
    babelrc: false,
    configFile: false,
    ...babelConfig,
    presets: [
      ...(typescript ? [require.resolve('@babel/preset-typescript')] : []),
      [
        require.resolve('@babel/preset-env'),
        {
          loose: true,
          modules: module === 'esm' ? false : 'cjs',
          targets:
            target === 'node'
              ? {
                  node: '12',
                }
              : {
                  ios: '8',
                  android: '4',
                },
        },
      ],
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
      ...(presets || []),
    ],
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
          useESModules: module === 'esm',
          version: require('@babel/runtime/package.json').version,
        },
      ],
      ...(renameImport.length
        ? [
            [
              require.resolve('babel-plugin-transform-rename-import'),
              {
                replacements: renameImport,
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
