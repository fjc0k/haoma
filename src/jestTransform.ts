import babelJest from 'babel-jest'
import { TransformOptions } from '@babel/core'

module.exports = babelJest.createTransformer({
  babelrc: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 'current',
        },
      },
    ],
    [require.resolve('@babel/preset-react')],
    [require.resolve('@babel/preset-typescript')],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-proposal-decorators'),
      {
        legacy: true,
      },
    ],
  ],
} as TransformOptions)
