import type { CompileCliConfig } from './src'

export default {
  name: 'cjs',
  inputFiles: ['src/**/*'],
  outDir: 'lib',
  module: 'cjs',
  target: 'node',
} as CompileCliConfig
