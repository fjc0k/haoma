import './jestSetup'
import merge from 'deepmerge'
import { escapeRegExp, omit } from 'vtils'
import { JestConfig } from './types'
import { join, relative } from 'path'

export function getJestConfig(
  customConfig: JestConfig = {},
  projectRoot: string = process.cwd(),
): JestConfig {
  const paths: string[] = [
    join(__dirname, '../node_modules'),
    join(projectRoot, 'node_modules'),
  ]

  const normalizeFilePath = (filePath: string) => {
    const relativeFilePath = relative(projectRoot, filePath).replace(/\\/g, '/')
    return (/^[.]+\//.test(relativeFilePath)
      ? relativeFilePath
      : `./${relativeFilePath}`
    ).replace(/\/{2,}/g, '/')
  }

  const transformIgnorePatterns: string[] =
    customConfig.transformPackages && customConfig.transformPackages.length > 0
      ? [
          `<rootDir>/node_modules/(?!.*/(${customConfig.transformPackages
            .map(pkg => escapeRegExp(pkg))
            .join('|')})/)`,
        ]
      : ['<rootDir>/node_modules/']

  return merge<JestConfig>(
    {
      rootDir: projectRoot,
      transform: {
        '^.+\\.[t|j]sx?$': normalizeFilePath(
          require.resolve('./jestTransform'),
        ),
      },
      transformIgnorePatterns: [
        ...transformIgnorePatterns,
        ...(customConfig.transformIgnorePatterns || []),
      ],
      collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts,tsx}',
        '!<rootDir>/src/**/__*__/**/*',
        '!<rootDir>/src/**/*.test.*',
      ],
      setupFilesAfterEnv: [normalizeFilePath(require.resolve('./jestSetup'))],
      snapshotSerializers: [
        // 使用函数名称作为快照
        normalizeFilePath(
          require.resolve('jest-snapshot-serializer-function-name/index.js', {
            paths,
          }),
        ),
        // 漂亮的 html 快照
        normalizeFilePath(
          require.resolve('jest-serializer-html/index.js', { paths }),
        ),
        // 移除 jest 包裹在 diff 快照两边的引号
        normalizeFilePath(
          require.resolve('snapshot-diff/serializer.js', { paths }),
        ),
      ],
      cacheDirectory: '<rootDir>/node_modules/.cache/jest',
    },
    omit(customConfig, ['transformPackages']),
  )
}
