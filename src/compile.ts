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

  const { name, inputFiles, outDir, emitDts, clean, ...babelConfig } = config

  const spinner = ora({
    prefixText: `[${name}]: `,
  })

  if (!inputFiles.length) {
    spinner.fail('输入文件列表为空！')
    return
  }

  spinner.start('编译中...')

  if (clean !== false) {
    spinner.text = '清空输出目录...'
    await new Promise(resolve =>
      rimraf(
        outDir,
        {
          disableGlob: true,
        },
        resolve,
      ),
    )
  }

  spinner.text = '编译文件...'
  const inputDir = commonDir(inputFiles)
  const tsFiles: string[] = []
  await Promise.all(
    inputFiles.map(async file => {
      const code = await fs.readFile(file, 'utf8')
      const isTs = /\.tsx?/i.test(file)
      if (isTs) {
        tsFiles.push(file)
      }
      const res = await babel.transformAsync(
        code,
        getBabelConfig({
          ...babelConfig,
          legacyDecorator: babelConfig.legacyDecorator ?? true,
          filename: file,
        }),
      )
      if (res) {
        const outFile = join(
          outDir,
          file.replace(inputDir, '').replace(/\.[^.]+$/, '.js'),
        )
        await fs.outputFile(outFile, res.code)
      }
    }),
  )
  if (emitDts !== false && tsFiles.length) {
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
        '--target',
        'ESNext',
        '--moduleResolution',
        'node',
        '--jsx',
        'preserve',
        '--outDir',
        outDir,
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
