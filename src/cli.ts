#!/usr/bin/env node
import rimraf from 'rimraf'
import spawn from 'cross-spawn'
import yargs from 'yargs'
import { dedent } from 'vtils'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PackageJson, TsConfigJson } from 'type-fest'

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
      const { name: packageName, version: packageVersion } =
        require('../package.json') as PackageJson

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

        // .gitattributes
        writeable(join(cwd, '.gitattributes'), path => {
          writeFileSync(
            path,
            dedent`
              * text eol=lf

              *.png binary
              *.jpg binary
              *.gif binary
              *.jpeg binary
              *.mp3 binary
              *.aac binary
              *.mp4 binary
              *.json linguist-language=JSON-with-Comments
            `,
          )
        })

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
              node_modules
              package-lock.json
              yarn.lock
              pnpm-lock.yaml
              lib
              dist
            `}\n`,
          )
        })

        // tsconfig.json
        writeable(join(cwd, 'tsconfig.json'), path => {
          writeFileSync(
            path,
            JSON.stringify(
              {
                compilerOptions: {
                  strict: true,
                  target: 'ESNext',
                  module: 'ESNext',
                  moduleResolution: 'node',
                  declaration: true,
                  removeComments: false,
                  esModuleInterop: true,
                  allowSyntheticDefaultImports: true,
                  experimentalDecorators: true,
                  skipLibCheck: true,
                  sourceMap: false,
                  preserveSymlinks: true,
                  incremental: true,
                  tsBuildInfoFile: './node_modules/.cache/tsbif',
                  newLine: 'LF',
                  jsx: 'react',
                  lib: ['esnext', 'dom'],
                },
              } as TsConfigJson,
              null,
              2,
            ),
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

        const needInstallPackages = (
          [
            {
              name: packageName!,
              version: `^${packageVersion!.split('.')[0]}`,
            },
            { name: 'typescript', version: '^3' },
            { name: 'eslint', version: '^6' },
            { name: 'prettier', version: '^2' },
            { name: 'husky', version: '^4' },
            { name: 'lint-staged', version: '^10' },
          ] as Array<{ name: string; version: string }>
        ).filter(pkg => !currentPackageDeps.has(pkg.name))

        const userAgent = process.env.npm_config_user_agent
        const usePackageManager: 'yarn' | 'npm' | 'pnpm' =
          (userAgent &&
            (userAgent.startsWith('yarn')
              ? 'yarn'
              : userAgent.startsWith('pnpm')
              ? 'pnpm'
              : userAgent.startsWith('npm')
              ? 'npm'
              : '')) ||
          (existsSync(join(cwd, 'yarn.lock'))
            ? 'yarn'
            : existsSync(join(cwd, 'pnpm-lock.yaml'))
            ? 'pnpm'
            : existsSync(join(cwd, 'package-lock.json'))
            ? 'npm'
            : '') ||
          'npm'

        if (usePackageManager === 'pnpm') {
          const currentNpmrc = join(cwd, '.npmrc')
          const currentNpmrcInfo: string = existsSync(currentNpmrc)
            ? readFileSync(currentNpmrc).toString()
            : ''
          if (!currentNpmrcInfo.includes('shamefully-hoist')) {
            const currentNodeModules = join(cwd, 'node_modules')
            rimraf.sync(currentNodeModules)
            writeFileSync(
              currentNpmrc,
              currentNpmrcInfo
                .split('\n')
                .filter(Boolean)
                .concat('shamefully-hoist=true', '')
                .join('\n'),
            )
          }
        }

        if (needInstallPackages.length > 0) {
          spawn.sync(
            usePackageManager,
            [
              'add',
              ...needInstallPackages.map(pkg => `${pkg.name}@${pkg.version}`),
              '-D',
            ],
            {
              stdio: 'inherit',
              cwd: cwd,
            },
          )
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
          spawn.sync(
            'node',
            [
              join(cwd, './node_modules/prettier/bin-prettier.js'),
              '--write',
              currentPackageJson,
            ],
            {
              stdio: 'inherit',
              cwd: cwd,
            },
          )
        }

        console.log('✔️ Install dependencies')
      }
    },
  ).argv
