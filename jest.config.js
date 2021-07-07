/** @type import('./lib').JestConfig */
module.exports = require('./lib').getJestConfig({
  testEnvironment: 'jsdom',
  transformPackages: ['lodash-es', 'yup'],
  transformer: 'esbuild',
  jsxPragma: 'React',
})
