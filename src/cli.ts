#!/usr/bin/env node
import yargs from 'yargs'
import { dedent } from 'vtils'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'

yargs
  .usage('Usage: $0 <command> [options]')
  .help('help', 'Show help')
  .alias('help', 'h')
  .command<{ override: boolean }>(
    'init',
    'Initialize the config files',
    yargs => {
      yargs.option('override', {
        alias: 'o',
        type: 'boolean',
        describe: 'Override existing files',
        default: false,
      })
    },
    argv => {
      const cwd = process.cwd()
      const packageName: string = require('../package.json').name

      const writeable = (path: string, writer: (path: string) => unknown) => {
        const existing = existsSync(path)
        if (!existing || (existing && argv.override)) {
          writer(path)
          console.log(`✔️ Write ${path}`)
        }
      }

      // .editorconfig
      writeable(join(cwd, '.editorconfig'), path => {
        writeFileSync(
          path,
          dedent`
            # http://editorconfig.org
            root = true

            [*]
            indent_style = space
            indent_size = 2
            end_of_line = lf
            charset = utf-8
            trim_trailing_whitespace = true
            insert_final_newline = true

            # The JSON files contain newlines inconsistently
            [*.json]
            insert_final_newline = ignore

            # Minified JavaScript files shouldn't be changed
            [**.min.js]
            indent_style = ignore
            insert_final_newline = ignore

            [*.md]
            trim_trailing_whitespace = false
          `,
        )
      })

      // .eslintrc.js
      writeable(join(cwd, '.eslintrc.js'), path => {
        writeFileSync(
          path,
          dedent`
            /** @type import('eslint').Linter.Config */
            module.exports = require('${packageName}').getESLintConfig()
          `,
        )
      })

      // .eslintignore
      writeable(join(cwd, '.eslintignore'), path => {
        writeFileSync(
          path,
          dedent`
            !**/.*
            node_modules
            lib
            dist
          `,
        )
      })

      // .prettierrc.js
      writeable(join(cwd, '.prettierrc.js'), path => {
        writeFileSync(
          path,
          dedent`
            /** @type import('prettier').Options */
            module.exports = require('${packageName}').getPrettierConfig()
          `,
        )
      })

      // .prettierignore
      writeable(join(cwd, '.prettierignore'), path => {
        writeFileSync(
          path,
          dedent`
            package-lock.json
            node_modules
            lib
            dist
          `,
        )
      })
    },
  ).argv
