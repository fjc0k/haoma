#!/usr/bin/env node
import deepmerge from 'deepmerge'
import exec from 'execa'
import globby from 'globby'
import JSON5 from 'json5'
import rimraf from 'rimraf'
import spawn from 'cross-spawn'
import yargs from 'yargs'
import { basename, join, resolve } from 'path'
import { castArray, dedent, uniq } from 'vtils'
import { compile } from './compile'
import { CompileCliConfig } from './types'
import {
  existsSync,
  mkdirSync,
  pathExists,
  readFileSync,
  writeFileSync,
} from 'fs-extra'
import { getBabelConfig } from './getBabelConfig'
import { PackageJson, TsConfigJson } from 'type-fest'

require('@babel/register')({
  ...getBabelConfig({
    typescript: true,
    target: 'node',
  }),
  extensions: ['.js', '.ts'],
})

yargs
  .usage('Usage: $0 <command> [options]')
  .help('help', 'Show help')
  .alias('help', 'h')
  // Show help if no args
  // ref: https://github.com/yargs/yargs/issues/895
  .demandCommand(1, '')
  .command<{ override: boolean; jest: boolean; license: boolean }>(
    'init',
    'Initialize the config files',
    yargs => {
      yargs
        .option('override', {
          alias: 'o',
          type: 'boolean',
          describe: 'Override existing files',
          default: false,
        })
        .option('jest', {
          alias: 'j',
          type: 'boolean',
          describe: 'Install jest',
          default: false,
        })
        .option('license', {
          alias: 'l',
          type: 'boolean',
          describe: 'Generate LICENSE',
          default: false,
        })
    },
    argv => {
      const cwd = process.cwd()
      const {
        name: packageName,
        version: packageVersion,
      } = require('../package.json') as PackageJson

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

        // .gitignore
        const gitignoreFile = join(cwd, '.gitignore')
        const gitignoreContent = existsSync(gitignoreFile)
          ? readFileSync(gitignoreFile, 'utf8')
          : ''
        const gitignoreItems = gitignoreContent.split(/[\r\n]+/g)
        const newGitignoreItems = dedent`
          .DS_Store
          Thumbs.db
          node_modules
          coverage
          lib
          dist
          *.tsbuildinfo
          *.log*
        `.split(/[\r\n]+/g)
        const finalGitignoreItems = uniq([
          ...gitignoreItems,
          ...newGitignoreItems,
        ])
        const finalGitignoreContent = finalGitignoreItems.join('\n')
        writeFileSync(gitignoreFile, finalGitignoreContent)
        console.log(`✔️ Write ${gitignoreFile}`)

        // .gitattributes
        writeable(join(cwd, '.gitattributes'), path => {
          writeFileSync(
            path,
            `${dedent`
              * text eol=lf

              *.png binary
              *.jpg binary
              *.gif binary
              *.jpeg binary
              *.mp3 binary
              *.aac binary
              *.mp4 binary
              *.sketch binary
              *.json linguist-language=JSON-with-Comments
            `}\n`,
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
              /** @type import('${packageName!}').ESLintConfig */
              module.exports = require('${packageName!}').getESLintConfig()
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
              /** @type import('${packageName!}').PrettierConfig */
              module.exports = require('${packageName!}').getPrettierConfig()
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

        if (argv.license) {
          const gitUser =
            spawn
              .sync('git', ['config', '--get', 'user.name'])
              .output.join('')
              .trim() || 'AUTHOR_NAME'
          const gitEmail =
            spawn
              .sync('git', ['config', '--get', 'user.email'])
              .output.join('')
              .trim() || 'AUTHOR_EMAIL'
          // LICENSE
          writeable(join(cwd, 'LICENSE'), path => {
            writeFileSync(
              path,
              `${dedent`
                MIT License

                Copyright (c) ${String(
                  new Date().getFullYear(),
                )}-present ${gitUser} <${gitEmail}>

                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:

                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.

                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
            `}\n`,
            )
          })
        }

        if (argv.jest) {
          writeable(join(cwd, 'jest.config.js'), path => {
            writeFileSync(
              path,
              `${dedent`
                /** @type import('${packageName!}').JestConfig */
                module.exports = require('${packageName!}').getJestConfig()
              `}\n`,
            )
          })
        }

        console.log('✔️ Write config files')
      }

      // ========= 依赖安装 =========
      {
        console.log('Install dependencies...')

        const currentPackageJson = join(cwd, 'package.json')
        const currentTsConfig = join(cwd, 'tsconfig.json')
        const currentPackageInfo: PackageJson = existsSync(currentPackageJson)
          ? JSON.parse(readFileSync(currentPackageJson).toString())
          : {}
        const currentPackageDeps = new Set(
          Object.keys({
            ...currentPackageInfo.dependencies,
            ...currentPackageInfo.devDependencies,
          }),
        )

        const needInstallPackages = ([
          {
            name: packageName!,
            version: `^${packageVersion!.split('.')[0]}`,
          },
          { name: 'typescript', version: '^4' },
          { name: 'eslint', version: '^7' },
          { name: 'prettier', version: '^2' },
          { name: 'husky', version: '^4' },
          { name: 'lint-staged', version: '^10' },
          { name: 'standard-version', version: '^9' },
          ...(!argv.jest
            ? []
            : ([
                { name: 'jest', version: '^26' },
                { name: 'codecov', version: '^3' },
                { name: 'typescript-snapshots-plugin', version: '^1' },
              ] as Array<{ name: string; version: string }>)),
        ] as Array<{ name: string; version: string }>).filter(
          pkg => !currentPackageDeps.has(pkg.name),
        )

        const userAgent = process.env.npm_config_user_agent
        const userAgentX = basename(process.env._ || '')
        const usePackageManager: 'yarn' | 'npm' | 'pnpm' =
          (userAgentX &&
            (userAgentX === 'yarn'
              ? 'yarn'
              : userAgentX === 'pnpx'
              ? 'pnpm'
              : userAgentX === 'npx'
              ? 'npm'
              : '')) ||
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
              env: process.env,
            },
          )
        }

        const nextPackageInfo = JSON.parse(
          readFileSync(currentPackageJson).toString(),
        )

        if (!nextPackageInfo.husky && !nextPackageInfo['lint-staged']) {
          nextPackageInfo.husky = {
            hooks: {
              'pre-commit': 'lint-staged',
            },
          }
          nextPackageInfo['lint-staged'] = {
            '*.{css,less,scss,sass,html,htm,vue,yml,yaml,json,md}': [
              'prettier --write',
            ],
            '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
          }
        }

        const nextTsInfo: TsConfigJson = existsSync(currentTsConfig)
          ? JSON5.parse(readFileSync(currentTsConfig).toString())
          : {}

        if (
          !nextTsInfo.compilerOptions?.plugins?.some(
            plugin => plugin.name === 'typescript-snapshots-plugin',
          )
        ) {
          nextTsInfo.compilerOptions = nextTsInfo.compilerOptions || {}
          nextTsInfo.compilerOptions.plugins =
            nextTsInfo.compilerOptions.plugins || []
          nextTsInfo.compilerOptions.plugins.push({
            name: 'typescript-snapshots-plugin',
            snapshotCallIdentifiers: [
              'toMatchSnapshot',
              'toThrowErrorMatchingSnapshot',
              'toMatchDiffSnapshot',
            ],
          })
        }

        writeFileSync(
          currentPackageJson,
          JSON.stringify(nextPackageInfo, null, 2),
        )
        writeFileSync(currentTsConfig, JSON.stringify(nextTsInfo, null, 2))
        spawn.sync(
          'npx',
          ['prettier', '--write', currentPackageJson, currentTsConfig],
          {
            stdio: 'inherit',
            cwd: cwd,
            env: process.env,
          },
        )

        console.log('✔️ Install dependencies')
      }

      // patch eslint 7 for vscode
      // issue: https://github.com/microsoft/vscode-eslint/issues/972
      {
        const vscodePath = join(cwd, '.vscode')
        const vscodeSettingsFile = join(vscodePath, 'settings.json')
        if (!existsSync(vscodePath)) {
          mkdirSync(vscodePath)
        }
        writeFileSync(
          vscodeSettingsFile,
          JSON.stringify(
            deepmerge(
              existsSync(vscodeSettingsFile)
                ? JSON.parse(readFileSync(vscodeSettingsFile, 'utf8'))
                : {},
              {
                'eslint.options': {
                  resolvePluginsRelativeTo: '.',
                },
              },
            ),
            null,
            2,
          ),
        )
      }
    },
  )
  .command(
    'run',
    'Run a js/ts script',
    () => undefined,
    () => {
      const dotenv = require('dotenv')
      // dotenv 不会覆盖，因此优先级高的放前面
      for (const file of ['.env.local', '.env']) {
        dotenv.config({
          path: join(process.cwd(), file),
        })
      }
      try {
        exec.sync(
          'node',
          [
            '--unhandled-rejections=strict',
            '-r',
            require.resolve('./babelRegister'),
            ...process.argv.slice(3),
          ],
          {
            cwd: process.cwd(),
            env: process.env,
            stdio: 'inherit',
          },
        )
      } catch {}
    },
  )
  .command(
    'compile',
    'Compile files',
    () => undefined,
    async () => {
      const configTsFile = join(process.cwd(), 'haoma-compile.config.ts')
      const configJsFile = join(process.cwd(), 'haoma-compile.config.js')
      const configFile = (await pathExists(configTsFile))
        ? configTsFile
        : configJsFile
      if (!(await pathExists(configFile))) {
        throw new Error('找不到配置文件')
      }
      const config = castArray(
        (require(configFile).default ||
          require(configFile)) as CompileCliConfig,
      )
      for (const configItem of config) {
        const inputFiles = await globby(configItem.inputFiles, {
          cwd: process.cwd(),
          onlyFiles: true,
          absolute: true,
        })
        const outDir = resolve(process.cwd(), configItem.outDir)
        await compile({
          ...configItem,
          inputFiles,
          outDir,
        })
      }
    },
  ).argv
