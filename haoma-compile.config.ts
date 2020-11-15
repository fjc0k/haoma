import { basename } from 'path'
import { getCompileConfig } from './lib'

export default getCompileConfig([
  {
    name: 'cjs',
    inputFiles: ['src/*.ts', '!**/*.test.*'],
    outDir: 'lib2',
    module: 'cjs',
  },
  {
    name: 'esm',
    inputFiles: ['src/index.ts'],
    outDir: 'lib3',
    module: 'esm',
    target: 'node',
    renameImport: [
      {
        original: '\\./getJestConfig',
        replacement: 'llllll',
      },
    ],
  },
  {
    name: 'esm',
    inputFiles: ['tests/x.tsx'],
    outDir: 'lib4',
    module: 'esm',
    target: 'node',
    getCssModulesScopeName({ className, fileName }) {
      return `${basename(fileName).split('.')[0]}_${className}`
    },
  },
])
