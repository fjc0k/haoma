import * as babel from '@babel/core'
import exec from 'execa'
import fs from 'fs-extra'
import rimraf from 'rimraf'
import { CompileConfig } from './types'
import { join } from 'path'

// @ts-ignore
import commonDir from 'common-dir'

export async function compile(config: CompileConfig) {
  if (!config.inputFiles.length) return

  if (config.clean !== false) {
    rimraf.sync(config.outDir, {
      disableGlob: true,
    })
  }

  const inputDir = commonDir(config.inputFiles)
  const tsFiles: string[] = []
  await Promise.all(
    config.inputFiles.map(async file => {
      const code = await fs.readFile(file, 'utf8')
      const isTs = /\.tsx?/i.test(file)
      const isJsx = /\.[j|t]sx/i.test(file)
      if (isTs) {
        tsFiles.push(file)
      }
      const res = await babel.transformAsync(code, {
        filename: file,
        babelrc: false,
        configFile: false,
        presets: [
          ...(isTs ? [require.resolve('@babel/preset-typescript')] : []),
          [
            require.resolve('@babel/preset-env'),
            {
              loose: true,
              modules: config.module === 'esm' ? false : 'cjs',
              targets:
                config.target === 'node'
                  ? {
                      node: '12',
                    }
                  : {
                      ios: '8',
                      android: '4',
                    },
            },
          ],
          ...(config.babel?.presets || []),
        ],
        plugins: [
          ...(isJsx
            ? [
                config.jsxPragma === 'vue'
                  ? require.resolve('@vue/babel-plugin-jsx')
                  : require.resolve('@babel/plugin-transform-react-jsx'),
              ]
            : []),
          [require.resolve('@babel/plugin-transform-runtime')],
          ...(config.babel?.renameImports?.length
            ? [
                [
                  require.resolve('babel-plugin-transform-rename-import'),
                  {
                    replacements: config.babel.renameImports,
                  },
                ],
              ]
            : []),
          ...(config.babel?.plugins || []),
        ],
      })
      if (res) {
        const outFile = join(
          config.outDir,
          file.replace(inputDir, '').replace(/\.[^.]+$/, '.js'),
        )
        await fs.outputFile(outFile, res.code)
      }
      if (config.emitDts !== false && tsFiles.length) {
        await exec(
          'npx',
          [
            'tsc',
            '--declaration',
            '--emitDeclarationOnly',
            '--skipLibCheck',
            '--esModuleInterop',
            '--allowSyntheticDefaultImports',
            '--outDir',
            config.outDir,
            ...tsFiles,
          ],
          {
            cwd: process.cwd(),
            stdio: 'inherit',
          },
        )
      }
    }),
  )
}
