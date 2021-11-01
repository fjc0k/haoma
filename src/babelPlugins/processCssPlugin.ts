/* eslint-disable prefer-const */
import cuid from 'cuid'
import fs from 'fs-extra'
import { BabelConfig } from '../types'
import { types as babelTypes, PluginObj } from '@babel/core'
import { dirname, extname, join } from 'path'
import { renderStyle } from '../renderStyle'

export function getProcessCssPlugin(options: {
  projectRoot: string
  outDir: string
  getCssModulesScopedName?: NonNullable<BabelConfig['getCssModulesScopedName']>
  bus: NonNullable<BabelConfig['bus']>
}) {
  return function processCssPlugin({
    types: t,
  }: {
    types: typeof babelTypes
  }): PluginObj {
    return {
      visitor: {
        ImportDeclaration: {
          exit(path, state) {
            const modulePath = path.node.source.value
            const moduleExt = extname(modulePath)
            const isCssModule = moduleExt === '.css'
            const isScssModule = moduleExt === '.scss'
            const isLessModule = moduleExt === '.less'
            if (
              (isCssModule || isScssModule || isLessModule) &&
              modulePath.startsWith('.')
            ) {
              const isLocalCss = modulePath.startsWith('./@@LOCAL@@/')
              let [
                ,
                localStyleContent,
                localStyleFilePath,
                localStyleOutFilePath,
              ] = isLocalCss
                ? modulePath.match(
                    /^\.\/@@LOCAL@@\/(.+)\/@@LOCAL@@\/(.+)\/@@LOCAL@@\/(.+)$/,
                  )!
                : []
              localStyleContent = decodeURIComponent(localStyleContent)
              if (isLocalCss) {
                path.node.source.value = localStyleOutFilePath
              }

              const isCssModules = path.node.specifiers.length > 0
              let cssModulesMap: Record<string, string> = {}

              const moduleId = `__${getProcessCssPlugin.name}_${cuid()}__`
              path.node.source.value += `?${moduleId}`
              if (isCssModules) {
                path.insertAfter(
                  t.variableDeclaration('var', [
                    t.variableDeclarator(
                      t.identifier(path.node.specifiers[0].local.name),
                      t.stringLiteral(moduleId),
                    ),
                  ]),
                )
                path.node.specifiers = []
              }

              const moduleAbsolutePath = join(
                dirname(state.filename!),
                isLocalCss ? localStyleFilePath : modulePath,
              )
              const moduleOutAbsolutePath = join(
                dirname(state.filename!),
                isLocalCss ? localStyleOutFilePath : modulePath,
              )
              const outFile = join(
                options.outDir,
                moduleOutAbsolutePath
                  .replace(options.projectRoot, '')
                  .replace(/\.[^.]+$/, '.css'),
              )

              const processCss = async () => {
                const outContent = isLocalCss
                  ? localStyleContent
                  : await fs.readFile(moduleAbsolutePath, 'utf8')
                const { css, cls } = await renderStyle({
                  filePath: moduleAbsolutePath,
                  fileContent: outContent,
                  lang: isScssModule ? 'scss' : isLessModule ? 'less' : 'css',
                  cssModules: isCssModules,
                  cssModulesScopedName:
                    options.getCssModulesScopedName &&
                    (payload =>
                      options.getCssModulesScopedName!({
                        fileName: payload.filePath,
                        className: payload.className,
                      })),
                })
                cssModulesMap = cls
                await fs.outputFile(outFile, css)
              }

              const processCssResult = processCss()

              options.bus.emit('addAfterWriteTransformer', async content => {
                await processCssResult
                return content
                  .replace(`${moduleExt}?${moduleId}`, '.css')
                  .replace(`"${moduleId}"`, JSON.stringify(cssModulesMap))
              })
            }
          },
        },
      },
    }
  }
}
