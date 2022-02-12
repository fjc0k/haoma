import * as babel from '@babel/core'
import * as esbuild from 'esbuild'
import fs from 'fs-extra'
import { getBabelConfig } from './getBabelConfig'

export async function bundle(payload: {
  input: string
  output: string
  format?: 'cjs' | 'esm' | 'iife'
  externals?: string[]
  minify?: boolean
  nodeEnv?: string
  target?: string
  sourcemap?: 'inline' | 'external'
}) {
  await esbuild.build({
    entryPoints: [payload.input],
    bundle: true,
    outfile: payload.output,
    platform: 'node',
    target:
      payload.target === 'es5'
        ? 'es2015'
        : payload.target || `node${process.version.slice(1)}`,
    external: payload.externals,
    minify: payload.minify,
    format: payload.format,
    sourcemap: payload.sourcemap,
    define: {
      ...(payload.nodeEnv != null
        ? {
            'process.env.NODE_ENV': JSON.stringify(payload.nodeEnv),
          }
        : {}),
    },
  })

  // esbuild 不支持 es5，用 babel 再转下
  // https://github.com/evanw/esbuild/issues/297
  if (payload.target === 'es5') {
    const res = await babel.transformFileAsync(
      payload.output,
      getBabelConfig({
        target: 'browser',
        module: payload.format === 'esm' ? 'esm' : 'cjs',
      }),
    )
    await fs.outputFile(payload.output, res?.code || '')
  }
}
