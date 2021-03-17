/** @type import('./lib').JestConfig */
module.exports = require('./lib').getJestConfig({
  transformPackages: ['lodash-es'],
  transformer: 'babel',
  jsxPragma: 'React',
})
