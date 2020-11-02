import babelJest from 'babel-jest'
import { TransformOptions } from '@babel/core'

module.exports = babelJest.createTransformer({
  babelrc: false,
  configFile: false,
  plugins: [[require.resolve('@babel/plugin-transform-modules-commonjs')]],
} as TransformOptions)
