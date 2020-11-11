import { BabelConfig } from './types'

export function getBabelConfig(config: BabelConfig): BabelConfig {
  const hasFileName = !!config.filename
  const isTs = hasFileName && /\.tsx?/i.test(config.filename!)
  const isJsx = hasFileName && /\.[j|t]sx/i.test(config.filename!)

  const {
    module = 'cjs',
    target = 'browser',
    typescript = isTs,
    jsx = (isJsx && 'react') || undefined,
    legacyDecorator = false,
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
      ...(jsx
        ? [
            jsx === 'vue'
              ? require.resolve('@vue/babel-plugin-jsx')
              : require.resolve('@babel/plugin-transform-react-jsx'),
          ]
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
      ...(plugins || []),
    ],
  }
}
