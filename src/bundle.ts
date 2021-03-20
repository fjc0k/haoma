import * as esbuild from 'esbuild'

export async function bundle(payload: {
  input: string
  output: string
  format?: 'cjs' | 'esm' | 'iife'
  externals?: string[]
  minify?: boolean
  nodeEnv?: string
}) {
  await esbuild.build({
    entryPoints: [payload.input],
    bundle: true,
    outfile: payload.output,
    platform: 'node',
    target: 'node10.4',
    external: payload.externals,
    minify: payload.minify,
    format: payload.format,
    define: {
      ...(payload.nodeEnv != null
        ? {
            'process.env.NODE_ENV': JSON.stringify(payload.nodeEnv),
          }
        : {}),
    },
  })
}
