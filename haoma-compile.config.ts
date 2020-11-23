import { basename } from 'path'
import { getCompileConfig } from './lib/index'

export default getCompileConfig([
  {
    name: 'cjs',
    inputFiles: ['src/*.ts', '!**/*.test.*'],
    outDir: 'lib2',
    module: 'cjs',
    rollupDts: true,
    rollupDtsFiles: ['index.d.ts'],
    rollupDtsIncludedPackages: ['vtils'],
  },
  {
    name: 'esm',
    inputFiles: ['src/index.ts'],
    outDir: 'lib3',
    module: 'esm',
    target: 'node',
    renameImport: [
      {
        original: /\.\/getJestConfig/,
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
    getCssModulesScopedName({ className, fileName }) {
      return `${basename(fileName).split('.')[0]}_${className}`
    },
  },
])
