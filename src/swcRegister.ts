import { TsConfigJson } from 'vtils/types'

require('@swc-node/register/lib/register').register({
  compilerOptions: {
    target: 'es2019',
    module: 'commonjs',
    moduleResolution: 'node',
    esModuleInterop: true,
    sourceMap: true,
  },
} as TsConfigJson)
