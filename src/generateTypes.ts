import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

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
  `
    import 'jest-chain'

    import 'jest-extended'

    import '@testing-library/jest-dom'

    import 'snapshot-diff'
  `,
)
