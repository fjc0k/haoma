/** @type import('./lib').ESLintConfig */
module.exports = require('./lib/index').getESLintConfig({
  settings: {
    vue: {
      enabled: false,
    },
  },
})
