module.exports = require('./lib').getCompileConfig([
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
    babel: {
      renameImports: [
        {
          original: '\\./getJestConfig',
          replacement: 'llllll',
        },
      ],
    },
  },
])
