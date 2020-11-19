import * as babel from '@babel/core'
import color from 'chalk'
import deleteEmptyDirectories from 'delete-empty'
import exec from 'execa'
import fs from 'fs-extra'
import globby from 'globby'
import ora from 'ora'
import rimraf from 'rimraf'
import { BabelConfig, CompileConfig } from './types'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import { getBabelConfig } from './getBabelConfig'
import { join } from 'path'

// @ts-ignore
import commonDir from 'common-dir'
import { AsyncOrSync, Defined } from 'vtils/types'
import { EventBus, noop } from 'vtils'

export async function compile(config: CompileConfig) {
  const startTime = Date.now()

  const {
    name,
    inputFiles,
    outDir,
    emitDts,
    rollupDts,
    rollupDtsFiles = ['index.d.ts'],
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
      const code = await fs.readFile(file, 'utf8')
      const isTs = /\.tsx?/i.test(file)
      if (isTs) {
        tsFiles.push(file)
      }
      const afterWriteTransformers: Array<(
        content: string,
      ) => AsyncOrSync<string>> = []
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
      })
      const consoleLog = console.log
      console.log = noop
      await Promise.all(
        _rollupDtsFiles.map(async dtsFile => {
          const config = ExtractorConfig.prepare({
            configObjectFullPath: join(process.cwd(), './api-extractor.json'),
            configObject: {
              projectFolder: process.cwd(),
              mainEntryPointFilePath: dtsFile,
              bundledPackages: rollupDtsIncludedPackages,
              apiReport: { enabled: false, reportFileName: 'report.api.md' },
              dtsRollup: { enabled: true, untrimmedFilePath: dtsFile },
              tsdocMetadata: { enabled: false },
              docModel: { enabled: false },
              compiler: {
                tsconfigFilePath: join(process.cwd(), './tsconfig.json'),
              },
              newlineKind: 'lf',
            },
            packageJsonFullPath: join(process.cwd(), './package.json'),
            packageJson: {
              name: 'hello',
            } as any,
          })
          Extractor.invoke(config, {
            localBuild: true,
          })
        }),
      )
      console.log = consoleLog
      const scrappedDtsFiles = await globby('**/*.d.ts', {
        cwd: outDir,
        absolute: true,
        ignore: rollupDtsFiles,
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
