import babelJest from 'babel-jest'
import { TransformOptions } from '@babel/core'

module.exports = babelJest.createTransformer({
  babelrc: false,
  presets: [[require.resolve('@babel/preset-typescript')]],
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
    [require.resolve('@babel/plugin-transform-modules-commonjs')],
  ],
} as TransformOptions)
