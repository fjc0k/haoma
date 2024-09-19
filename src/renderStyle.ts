import less from 'less'
import postcss from 'postcss'
import sass from 'sass'

export async function renderStyle(payload: {
  filePath: string
  fileContent: string
  lang?: 'css' | 'less' | 'scss'
  cssModules?: boolean
  cssModulesScopedName?: (payload: {
    className: string
    filePath: string
  }) => string
}): Promise<{
  css: string
  cls: Record<string, string>
}> {
  const {
    filePath,
    fileContent,
    lang = filePath.endsWith('.scss')
      ? 'scss'
      : filePath.endsWith('.less')
        ? 'less'
        : 'css',
    cssModules = false,
    cssModulesScopedName = payload => payload.className,
  } = payload
  let css = ''
  let cls = {}
  if (lang === 'scss') {
    css = await new Promise<string>((resolve, reject) => {
      sass.render(
        {
          data: fileContent,
          file: filePath,
          sourceMap: false,
        },
        (err, res) => (err ? reject(err) : resolve(res!.css.toString())),
      )
    })
  } else if (lang === 'less') {
    css = await new Promise<string>((resolve, reject) => {
      less.render(
        fileContent,
        {
          filename: filePath,
        },
        (err, res) => (err || !res ? reject(err) : resolve(res.css)),
      )
    })
  } else {
    css = fileContent
  }
  css = await postcss([
    require('autoprefixer'),
    ...(cssModules
      ? [
          require('postcss-modules')({
            getJSON: (_: any, json: any) => (cls = json),
            generateScopedName: (name: string, filename: string) =>
              cssModulesScopedName({
                className: name,
                filePath: filename,
              }),
          }),
        ]
      : []),
  ])
    .process(css, {
      from: filePath,
      map: false,
    })
    .then(res => res.css)
  return {
    css,
    cls,
  }
}
