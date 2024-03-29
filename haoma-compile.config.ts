// import { basename } from 'path'
import { getCompileConfig } from './src'

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
  //   inputFiles: ['tests/alias.ts'],
  //   outDir: 'lib3',
  //   module: 'esm',
  //   target: 'node',
  //   // renameImport: [
  //   //   {
  //   //     original: /\.\/getJestConfig/,
  //   //     replacement: 'llllll',
  //   //   },
  //   // ],
  //   alias: {
  //     'yup/es': 'yup/lib',
  //     'date-fns/esm': 'date-fns',
  //   },
  // },
  // {
  //   name: 'esm',
  //   inputFiles: ['tests/x.tsx'],
  //   outDir: 'lib_style',
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
    copyOnly: file => file.includes('.vue'),
    outDir: 'lib_vue',
    module: 'cjs',
    target: 'browser',
  },
])
