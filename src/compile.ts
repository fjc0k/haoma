import * as babel from '@babel/core'
import color from 'chalk'
import exec from 'execa'
import fs from 'fs-extra'
import ora from 'ora'
import rimraf from 'rimraf'
import { CompileConfig } from './types'
import { getBabelConfig } from './getBabelConfig'
import { join } from 'path'

// @ts-ignore
import commonDir from 'common-dir'

export async function compile(config: CompileConfig) {
  const startTime = Date.now()

  const spinner = ora({
    prefixText: `[${config.name}]: `,
  })

  if (!config.inputFiles.length) {
    spinner.fail('输入文件列表为空！')
    return
  }

  spinner.start('编译中...')

  if (config.clean !== false) {
    spinner.text = '清空输出目录...'
    await new Promise(resolve =>
      rimraf(
        config.outDir,
        {
          disableGlob: true,
        },
        resolve,
      ),
    )
  }

  spinner.text = '编译文件...'
  const inputDir = commonDir(config.inputFiles)
  const tsFiles: string[] = []
  await Promise.all(
    config.inputFiles.map(async file => {
      const code = await fs.readFile(file, 'utf8')
      const isTs = /\.tsx?/i.test(file)
      if (isTs) {
        tsFiles.push(file)
      }
      const res = await babel.transformAsync(
        code,
        getBabelConfig({
          filename: file,
          module: config.module || 'cjs',
          target: config.target || 'browser',
          legacyDecorator: true,
          jsx: config.jsxPragma || 'react',
          presets: config.babel?.presets || [],
          plugins: config.babel?.plugins || [],
        }),
      )
      if (res) {
        const outFile = join(
          config.outDir,
          file.replace(inputDir, '').replace(/\.[^.]+$/, '.js'),
        )
        await fs.outputFile(outFile, res.code)
      }
    }),
  )
  if (config.emitDts !== false && tsFiles.length) {
    spinner.text = '生成类型文件...'
    await exec(
      'node',
      [
        require.resolve('typescript').replace(/typescript\.js$/, 'tsc.js'),
        '--declaration',
        '--emitDeclarationOnly',
        '--skipLibCheck',
        '--esModuleInterop',
        '--allowSyntheticDefaultImports',
        '--jsx',
        'preserve',
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

  const endTime = Date.now()
  spinner.succeed(
    `编译完成，用时 ${color.green(
      ((endTime - startTime) / 1000).toFixed(1),
    )} 秒`,
  )
}
