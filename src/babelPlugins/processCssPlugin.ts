import cuid from 'cuid'
import fs from 'fs-extra'
import less from 'less'
import postcss from 'postcss'
import sass from 'sass'
import { BabelConfig } from '../types'
import { types as babelTypes, PluginObj } from '@babel/core'
import { Defined } from 'vtils/types'
import { dirname, extname, join } from 'path'

export function getProcessCssPlugin(options: {
  projectRoot: string
  outDir: string
  getCssModulesScopeName?: Defined<BabelConfig['getCssModulesScopeName']>
  bus: Defined<BabelConfig['bus']>
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
                dirname(state.filename),
                modulePath,
              )
              const outFile = join(
                options.outDir,
                moduleAbsolutePath
                  .replace(options.projectRoot, '')
                  .replace(/\.[^.]+$/, '.css'),
              )

              const processCss = async () => {
                let outContent = await fs.readFile(moduleAbsolutePath, 'utf8')
                if (isScssModule) {
                  outContent = await new Promise<string>((resolve, reject) => {
                    sass.render(
                      {
                        data: outContent,
                        file: moduleAbsolutePath,
                        sourceMap: false,
                      },
                      (err, res) =>
                        err ? reject(err) : resolve(res.css.toString()),
                    )
                  })
                } else if (isLessModule) {
                  outContent = await new Promise<string>((resolve, reject) => {
                    less.render(
                      outContent,
                      {
                        filename: moduleAbsolutePath,
                      },
                      (err, res) =>
                        err || !res ? reject(err) : resolve(res.css),
                    )
                  })
                }
                outContent = await postcss([
                  require('autoprefixer'),
                  ...(isCssModules
                    ? [
                        require('postcss-modules')({
                          getJSON: (_: any, json: any) =>
                            (cssModulesMap = json),
                          ...(options.getCssModulesScopeName
                            ? {
                                generateScopedName: (
                                  name: string,
                                  filename: string,
                                ) =>
                                  options.getCssModulesScopeName!({
                                    className: name,
                                    fileName: filename,
                                  }),
                              }
                            : {}),
                        }),
                      ]
                    : []),
                ])
                  .process(outContent, {
                    from: moduleAbsolutePath,
                    map: false,
                  })
                  .then(res => res.css)
                await fs.outputFile(outFile, outContent)
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
