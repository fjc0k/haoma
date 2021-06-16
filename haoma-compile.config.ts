// import { basename } from 'path'
import { getCompileConfig } from './lib/index'

export default getCompileConfig([
  // {
  //   name: 'cjs',
  //   inputFiles: ['src/*.ts', '!**/*.test.*'],
  //   outDir: 'lib2',
  //   module: 'cjs',
  //   rollupDts: true,
  //   rollupDtsFiles: ['index.d.ts'],
  //   rollupDtsIncludedPackages: ['vtils'],
  // },
  // {
  //   name: 'esm',
  //   inputFiles: ['src/index.ts'],
  //   outDir: 'lib3',
  //   module: 'esm',
  //   target: 'node',
  //   renameImport: [
  //     {
  //       original: /\.\/getJestConfig/,
  //       replacement: 'llllll',
  //     },
  //   ],
  // },
  // {
  //   name: 'esm',
  //   inputFiles: ['tests/x.tsx'],
  //   outDir: 'lib4',
  //   module: 'esm',
  //   target: 'browser',
  //   getCssModulesScopedName({ className, fileName }) {
  //     return `${basename(fileName).split('.')[0]}_${className}`
  //   },
  // },
  // {
  //   name: 'esm',
  //   inputFiles: ['tests/privateProp.ts'],
  //   outDir: 'lib5',
  //   module: 'esm',
  //   target: 'browser',
  // },
  // {
  //   name: 'esm',
  //   inputFiles: ['tests/babel.ts'],
  //   outDir: 'lib_babel',
  //   module: 'cjs',
  //   target: 'browserslist',
  //   polyfill: file => {
  //     console.log(file)
  //     return false
  //   },
  // },
  {
    name: 'esm',
    inputFiles: ['tests/yy.vue'],
    outDir: 'lib_vue',
    module: 'cjs',
    target: 'browser',
  },
])
