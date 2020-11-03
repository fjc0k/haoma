module.exports = require('./lib').getCompileConfig([
  {
    inputFiles: ['src/*.ts', '!**/*.test.*'],
    outDir: 'lib2',
    module: 'cjs',
  },
  {
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
