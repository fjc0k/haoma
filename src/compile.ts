// @ts-ignore
import * as babel from '@babel/core'
import color from 'chalk'
import commonDir from 'commondir'
import deleteEmptyDirectories from 'delete-empty'
import exec from 'execa'
import fs from 'fs-extra'
import globby from 'globby'
import ora from 'ora'
import { basename, dirname, join } from 'pathe'
import rimraf from 'rimraf'
import { AsyncOrSync } from 'ts-essentials'
import workerpool from 'workerpool'
import { getBabelConfig } from './getBabelConfig'
import { BabelConfig, CompileConfig } from './types'
import { dedent, EventBus } from './utils'

export async function compile(config: CompileConfig) {
  const startTime = Date.now()

  const {
    name,
    inputFiles,
    copyOnly = () => false,
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
  const inputDir =
    inputFiles.length === 1 ? dirname(inputFiles[0]) : commonDir(inputFiles)
  const tsFiles: string[] = []
  await Promise.all(
    inputFiles.map(async file => {
      const isCopyOnly = copyOnly(file)
      const isDts = /\.d\.ts$/i.test(file)
      const outFile = join(
        outDir,
        isCopyOnly || isDts
          ? file.replace(inputDir, '')
          : file.replace(inputDir, '').replace(/\.[^.]+$/, '.js'),
      )
      if (isCopyOnly) {
        await fs.ensureDir(dirname(outFile))
        await fs.copyFile(file, outFile)
      } else {
        let code = await fs.readFile(file, 'utf8')
        if (isDts) {
          if (emitDts) {
            await fs.outputFile(outFile, code)
          }
        } else {
          const isTs = /\.tsx?$/i.test(file)
          if (isTs) {
            tsFiles.push(file)
          }
          const isVue = /\.vue$/i.test(file)
          if (isVue) {
            const compiler: typeof import('vue-template-compiler') = require('vue-template-compiler')
            const transpile = require('vue-template-es2015-compiler')
            const sfc = compiler.parseComponent(code)
            const vcr = `__vue_component_raw__`
            const vc = `__vue_component__`
            const vs = `__vue_styles__`
            const vsi = `__vue_styles_inject__`
            const styles = sfc.styles
            const templateContent = sfc.template?.content || ''
            const renderFns = compiler.compileToFunctions(templateContent)
            const renderStr = transpile(renderFns.render.toString())
            const staticRenderStr = renderFns.staticRenderFns.map(fn =>
              transpile(fn.toString()),
            )
            let scriptContent = sfc.script?.content || ''
            scriptContent = scriptContent.replace(
              /^\s*export\s+default\s+/m,
              `var ${vcr} = `,
            )
            // https://github.com/vuejs/vue-component-compiler/blob/master/src/assembler.ts#L266
            // https://github.com/vuejs/component-compiler-utils/blob/master/lib/compileTemplate.ts#L158
            scriptContent += dedent`
            ;var ${vc} = (typeof ${vcr} === 'function' ? ${vcr}.options : ${vcr}) || {};
            ${vc}.__file = ${JSON.stringify(basename(file))};
            if (!${vc}.render) {
              ${vc}.render = ${renderStr};
              ${vc}.staticRenderFns = [${staticRenderStr.join(',')}];
              ${vc}._compiled = true;
            }
          `

            if (styles.length) {
              const _vsl: Array<[string, string]> = []
              styles.reverse().forEach((style, index, { length }) => {
                index = length - index
                const styleContent = style.content || ''
                const styleLang = style.lang || 'css'
                const styleIsModule = !!style.module
                const styleModuleName =
                  typeof style.module === 'string' ? style.module : '$style'
                const styleModuleNameRef = `${vs}${index}`
                const styleFileName = basename(file).replace(
                  /\.[^.]+$/,
                  `.${styleLang}`,
                )
                const styleOutFileName = basename(file).replace(
                  /\.[^.]+$/,
                  `${length === 1 ? '' : `_${index}`}.${styleLang}`,
                )
                const styleFile = `./@@LOCAL@@/${encodeURIComponent(
                  styleContent,
                ).replace(
                  /'/g,
                  '%27',
                )}/@@LOCAL@@/./${styleFileName}/@@LOCAL@@/./${styleOutFileName}`
                scriptContent = dedent`
                ${
                  styleIsModule
                    ? `import ${styleModuleNameRef} from '${styleFile}';`
                    : `import '${styleFile}';`
                }
                ${scriptContent}
              `
                if (styleIsModule) {
                  _vsl.unshift([styleModuleName, styleModuleNameRef])
                }
              })
              if (_vsl.length) {
                scriptContent += dedent`
                ;var ${vsi} = function() {
                  ${_vsl
                    .map(
                      item => dedent`
                        Object.defineProperty(this, ${JSON.stringify(
                          item[0],
                        )}, {
                          value: ${item[1]}
                        });
                      `,
                    )
                    .join('\n')}
                };
                ${vc}.beforeCreate = [].concat(${vc}.beforeCreate || [], ${vsi});
              `
              }
            }

            scriptContent += dedent`
            ;export default ${vcr};
          `
            code = scriptContent
          }
          const afterWriteTransformers: Array<
            (content: string) => AsyncOrSync<string>
          > = []
          const bus: NonNullable<BabelConfig['bus']> = new EventBus()
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
        }
      }
    }),
  )
  if (emitDts !== false && tsFiles.length) {
    spinner.text = '生成类型文件...'
    await exec(
      'node',
      [
        require.resolve('typescript').replace(/typescript\.js$/, 'tsc.js'),
        '--strict',
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
      await Promise.all(
        scrappedDtsFiles
          .filter(file => !copyOnly(file))
          .map(file => fs.remove(file)),
      )
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
