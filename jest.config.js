/** @type import('./lib').JestConfig */
module.exports = require('./lib').getJestConfig({
  transformPackages: ['lodash-es'],
  transformer: 'swc',
})
