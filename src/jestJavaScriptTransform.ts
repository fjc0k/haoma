import babelJest from 'babel-jest'
import { getBabelConfig } from './getBabelConfig'

module.exports = babelJest.createTransformer!(
  getBabelConfig({
    target: 'node',
    typescript: true,
    legacyDecorator: true,
    jsx: process.env.JSX_PRAGMA === 'Vue' ? 'vue' : 'react',
  }),
)
