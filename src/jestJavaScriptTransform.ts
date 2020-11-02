import babelJest from 'babel-jest'
import { TransformOptions } from '@babel/core'

module.exports = babelJest.createTransformer({
  babelrc: false,
  configFile: false,
  presets: [
    [require.resolve('@babel/preset-typescript')],
    [
      require.resolve('@babel/preset-env'),
      {
        loose: true,
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-proposal-decorators'),
      {
        legacy: true,
      },
    ],
    [
      process.env.JSX_PRAGMA === 'Vue'
        ? require.resolve('@vue/babel-plugin-jsx')
        : require.resolve('@babel/plugin-transform-react-jsx'),
    ],
  ],
} as TransformOptions)
