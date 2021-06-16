// @ts-ignore
import commonDir from 'common-dir'

import * as babel from '@babel/core'
import color from 'chalk'
import deleteEmptyDirectories from 'delete-empty'
import exec from 'execa'
import fs from 'fs-extra'
import globby from 'globby'
import ora from 'ora'
import rimraf from 'rimraf'
import workerpool from 'workerpool'
import { AsyncOrSync, Defined } from 'vtils/types'
import { BabelConfig, CompileConfig } from './types'
import { EventBus } from 'vtils'
import { getBabelConfig } from './getBabelConfig'
import { join } from 'path'

export async function compile(config: CompileConfig) {
  const startTime = Date.now()

  const {
    name,
    inputFiles,
    outDir,
    emitDts,
    rollupDts,
    rollupDtsFiles = ['index.d.ts'],
    rollupDtsExcludeFiles = [],
    rollupDtsIncludedPackages = [],
    clean,
    ...babelConfig
  } = config

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
      const outFile = join(
        outDir,
        file.replace(inputDir, '').replace(/\.[^.]+$/, '.js'),
      )
      let code = await fs.readFile(file, 'utf8')
      const isTs = /\.tsx?$/i.test(file)
      if (isTs) {
        tsFiles.push(file)
      }
      const isVue = /\.vue$/i.test(file)
      if (isVue) {
        const compiler: typeof import('vue-template-compiler') = require('vue-template-compiler')
        const sfc = compiler.parseComponent(code)
        // https://github.com/vuejs/rollup-plugin-vue/blob/next/src/index.ts
        // const templateContent = sfc.template?.content || ''
        const scriptContent = sfc.script?.content || ''
        // const styleContent = sfc.styles.map(style => style.content).join('\n')
        // const renderFn = templateContent
        //   ? compiler.compile(templateContent)
        //   : 'null'
        code = scriptContent
      }
      const afterWriteTransformers: Array<
        (content: string) => AsyncOrSync<string>
      > = []
      const bus: Defined<BabelConfig['bus']> = new EventBus()
      bus.on('addAfterWriteTransformer', transformer =>
        afterWriteTransformers.push(transformer),
      )
      const res = await babel.transformAsync(
        code,
        getBabelConfig({
          ...babelConfig,
          legacyDecorator: babelConfig.legacyDecorator ?? true,
          filename: file,
          projectRoot: inputDir,
          outDir: outDir,
          bus: bus,
        }),
      )
      let content = res?.code || ''
      for (const transformer of afterWriteTransformers) {
        content = await transformer(content)
      }
      await fs.outputFile(outFile, content)
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
    if (rollupDts) {
      spinner.text = '打包类型文件...'
      const _rollupDtsFiles = await globby(rollupDtsFiles, {
        cwd: outDir,
        absolute: true,
        ignore: rollupDtsExcludeFiles,
      })
      const pool = workerpool.pool(require.resolve('./rollupDts'))
      await pool.exec('rollupDts', [_rollupDtsFiles, rollupDtsIncludedPackages])
      await pool.terminate()
      const scrappedDtsFiles = await globby('**/*.d.ts', {
        cwd: outDir,
        absolute: true,
        ignore: [...rollupDtsFiles, ...rollupDtsExcludeFiles],
      })
      await Promise.all(scrappedDtsFiles.map(file => fs.remove(file)))
    }
  }

  spinner.text = '删除空文件夹...'
  await deleteEmptyDirectories(outDir)

  const endTime = Date.now()
  spinner.succeed(
    `编译完成，用时 ${color.green(
      ((endTime - startTime) / 1000).toFixed(1),
    )} 秒`,
  )
}
