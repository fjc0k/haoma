import pkgDir from 'pkg-dir'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PackageJson } from 'type-fest'

const appRoot = pkgDir.sync(join(__dirname, '../..'))

if (appRoot) {
  const nodeModulesPath = join(appRoot, 'node_modules')
  const typesPath = join(nodeModulesPath, '@types')
  const generatedHaomaTypesPath = join(typesPath, 'generated__haoma')

  for (const path of [nodeModulesPath, typesPath, generatedHaomaTypesPath]) {
    if (!existsSync(path)) {
      mkdirSync(path)
    }
  }

  writeFileSync(
    join(generatedHaomaTypesPath, 'index.d.ts'),
    `import 'haoma/lib/jestSetup'`,
  )

  writeFileSync(
    join(generatedHaomaTypesPath, 'package.json'),
    JSON.stringify(
      {
        name: '@types/generated__haoma',
        version: '0.0.0',
        main: '',
        types: 'index.d.ts',
      } as PackageJson,
      null,
      2,
    ),
  )
}
