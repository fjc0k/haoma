import './jestSetup'
import merge from 'deepmerge'
import { escapeRegExp, omitStrict } from 'vtils'
import { existsSync } from 'fs'
import { JestConfig } from './types'
import { join, relative } from 'path'

export function getJestConfig(
  customConfig: JestConfig = {},
  projectRoot: string = process.cwd(),
): JestConfig {
  process.env.JSX_PRAGMA = customConfig.jsxPragma ?? 'React'

  const paths: string[] = [
    join(__dirname, '../node_modules'),
    join(projectRoot, 'node_modules'),
  ]

  const normalizeFilePath = (filePath: string) => {
    const relativeFilePath = relative(projectRoot, filePath).replace(/\\/g, '/')
    return (
      /^[.]+\//.test(relativeFilePath)
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
      transform:
        customConfig.transformer === 'typescript+babel'
          ? {
              '^.+\\.tsx?$': require.resolve('ts-jest'),
              '^.+\\.jsx?$': normalizeFilePath(
                require.resolve('./jestJavaScriptTransform'),
              ),
            }
          : {
              '^.+\\.[j|t]sx?$': normalizeFilePath(
                require.resolve('./jestJavaScriptTransform'),
              ),
            },
      transformIgnorePatterns: [
        ...transformIgnorePatterns,
        ...(customConfig.transformIgnorePatterns || []),
      ],
      moduleNameMapper: {
        '\\.(css|less|scss|sass|styl|md|html|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          require.resolve('identity-obj-proxy'),
      },
      globals:
        customConfig.transformer === 'typescript+babel'
          ? {
              'ts-jest': {
                packageJson: join(projectRoot, './package.json'),
                // 优先使用 tsconfig.test.json
                tsConfig: existsSync(join(projectRoot, './tsconfig.test.json'))
                  ? join(projectRoot, './tsconfig.test.json')
                  : join(projectRoot, './tsconfig.json'),
              },
            }
          : {},
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
    omitStrict(customConfig, ['transformPackages', 'transformer', 'jsxPragma']),
  )
}
