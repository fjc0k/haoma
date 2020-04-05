#!/usr/bin/env node
import spawn from 'cross-spawn'
import yargs from 'yargs'
import { dedent } from 'vtils'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PackageJson } from 'type-fest'

yargs
  .usage('Usage: $0 <command> [options]')
  .help('help', 'Show help')
  .alias('help', 'h')
  // Show help if no args
  // ref: https://github.com/yargs/yargs/issues/895
  .demandCommand(1, '')
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

      // ========= 文件写入 =========
      {
        console.log('Write config files...')

        const writeable = (path: string, writer: (path: string) => any) => {
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
            `${dedent`
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
            `}\n`,
          )
        })

        // .eslintrc.js
        writeable(join(cwd, '.eslintrc.js'), path => {
          writeFileSync(
            path,
            `${dedent`
              /** @type import('${packageName}').ESLintConfig */
              module.exports = require('${packageName}').getESLintConfig()
            `}\n`,
          )
        })

        // .eslintignore
        writeable(join(cwd, '.eslintignore'), path => {
          writeFileSync(
            path,
            `${dedent`
              !**/.*
              node_modules
              lib
              dist
            `}\n`,
          )
        })

        // .prettierrc.js
        writeable(join(cwd, '.prettierrc.js'), path => {
          writeFileSync(
            path,
            `${dedent`
              /** @type import('${packageName}').PrettierConfig */
              module.exports = require('${packageName}').getPrettierConfig()
            `}\n`,
          )
        })

        // .prettierignore
        writeable(join(cwd, '.prettierignore'), path => {
          writeFileSync(
            path,
            `${dedent`
              package-lock.json
              node_modules
              lib
              dist
            `}\n`,
          )
        })

        console.log('✔️ Write config files')
      }

      // ========= 依赖安装 =========
      {
        console.log('Install dependencies...')

        const currentPackageJson = join(cwd, 'package.json')
        const currentPackageInfo: PackageJson = existsSync(currentPackageJson)
          ? JSON.parse(readFileSync(currentPackageJson).toString())
          : {}
        const currentPackageDeps = new Set(
          Object.keys({
            ...currentPackageInfo.dependencies,
            ...currentPackageInfo.devDependencies,
          }),
        )

        const needInstallPackages = [
          packageName,
          'eslint',
          'prettier',
          'husky',
          'lint-staged',
        ].filter(name => !currentPackageDeps.has(name))

        if (needInstallPackages.length > 0) {
          const useYarn = existsSync(join(cwd, 'yarn.lock'))
          if (useYarn) {
            spawn.sync('yarn', ['add', ...needInstallPackages, '-D'], {
              stdio: 'inherit',
            })
          } else {
            spawn.sync('npm', ['i', ...needInstallPackages, '-D'], {
              stdio: 'inherit',
            })
          }
        }

        if (!currentPackageInfo.husky && !currentPackageInfo['lint-staged']) {
          const currentPackageInfo = JSON.parse(
            readFileSync(currentPackageJson).toString(),
          )
          currentPackageInfo.husky = {
            hooks: {
              'pre-commit': 'lint-staged',
            },
          }
          currentPackageInfo['lint-staged'] = {
            '*.{css,less,scss,sass,html,htm,vue,yml,yaml,json,md}': [
              'prettier --write',
            ],
            '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
          }
          writeFileSync(
            currentPackageJson,
            JSON.stringify(currentPackageInfo, null, 2),
          )
        }

        console.log('✔️ Install dependencies')
      }
    },
  ).argv
