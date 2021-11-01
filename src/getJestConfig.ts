import merge from 'deepmerge'
import { escapeRegExp } from 'lodash-uni'
import { existsSync } from 'fs'
import { JestConfig } from './types'
import { join, relative } from 'path'
import { omitStrict } from './utils'

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

  const transformPackages = [
    ...(customConfig.transformPackages || []),
    '@babel/runtime/helpers/esm',
    '@babel/runtime-corejs3/helpers/esm',
  ]

  let supportVueTemplate = false
  try {
    require.resolve('vue')
    require.resolve('vue-template-compiler')
    supportVueTemplate = true
  } catch {
    supportVueTemplate = false
  }

  return merge<JestConfig>(
    {
      rootDir: projectRoot,
      testEnvironment: customConfig.testEnvironment || 'node',
      moduleFileExtensions: [
        'ts',
        'js',
        'tsx',
        'jsx',
        'json',
        ...(supportVueTemplate ? ['vue'] : []),
      ],
      transform: {
        '\\.(css|less|scss|sass|styl|md|html|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          require.resolve('jest-transform-stub'),
        ...(customConfig.transformer === 'typescript+babel'
          ? {
              '^.+\\.tsx?$': require.resolve('ts-jest'),
              '^.+\\.jsx?$': normalizeFilePath(
                require.resolve('./jestJavaScriptTransform'),
              ),
            }
          : customConfig.transformer === 'esbuild'
          ? {
              '^.+\\.[j|t]sx?$': [
                require.resolve('esbuild-jest'),
                {
                  target: 'es2019',
                  sourcemap: 'inline',
                },
              ],
            }
          : {
              '^.+\\.[j|t]sx?$': normalizeFilePath(
                require.resolve('./jestJavaScriptTransform'),
              ),
            }),
        ...(supportVueTemplate
          ? { '^.+\\.vue$': require.resolve('vue-jest') }
          : {}),
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transformIgnorePatterns: [
        // 兼容 pnpm: node_modules/.pnpm/xxx/node_modules/xx
        `<rootDir>/.+/node_modules/(?!(${transformPackages
          .map(pkg => escapeRegExp(pkg))
          .join('|')})/)`,
      ],
      globals: {
        ...(supportVueTemplate
          ? {
              'vue-jest': {
                transform:
                  customConfig.transformer === 'typescript+babel'
                    ? {
                        '^(javascript|jsx?)$': require.resolve(
                          './jestJavaScriptTransform',
                        ),
                        '^(typescript|tsx?)$': require.resolve('ts-jest'),
                      }
                    : customConfig.transformer === 'esbuild'
                    ? {
                        '^(javascript|jsx?|typescript|tsx?)$':
                          require.resolve('esbuild-jest'),
                      }
                    : {
                        '^(javascript|jsx?|typescript|tsx?)$': require.resolve(
                          './jestJavaScriptTransform',
                        ),
                      },
              },
            }
          : {}),
        ...(customConfig.transformer === 'typescript+babel'
          ? {
              'ts-jest': {
                packageJson: join(projectRoot, './package.json'),
                // 优先使用 tsconfig.test.json
                tsConfig: existsSync(join(projectRoot, './tsconfig.test.json'))
                  ? join(projectRoot, './tsconfig.test.json')
                  : join(projectRoot, './tsconfig.json'),
              },
            }
          : {}),
      },
      collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts,tsx}',
        '!<rootDir>/src/**/__*__/**/*',
        '!<rootDir>/src/**/*.test.*',
      ],
      setupFilesAfterEnv: [normalizeFilePath(require.resolve('./jestSetup'))],
      snapshotSerializers: [
        ...(supportVueTemplate
          ? [
              // 适用 Vue
              normalizeFilePath(
                require.resolve('jest-serializer-vue/index.js', { paths }),
              ),
            ]
          : []),
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
    omitStrict(customConfig, [
      'testEnvironment',
      'transformPackages',
      'transformer',
      'jsxPragma',
    ]),
  )
}
