import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PackageJson } from 'type-fest'

const cwd = process.cwd()
const nodeModulesPath = join(cwd, 'node_modules')
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
