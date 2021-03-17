import dotenv from 'dotenv'
import exec from 'execa'
import { join } from 'path'

export async function run(payload: {
  transformer: 'babel' | 'swc' | 'esbuild'
  args: string[]
  cwd: string
  env: NodeJS.ProcessEnv
}): Promise<void> {
  // dotenv 不会覆盖，因此优先级高的放前面
  for (const file of ['.env.local', '.env']) {
    dotenv.config({
      path: join(payload.cwd, file),
    })
  }
  try {
    await exec(
      'node',
      [
        '--unhandled-rejections=strict',
        '-r',
        payload.transformer === 'swc'
          ? require.resolve('./swcRegister')
          : payload.transformer === 'esbuild'
          ? require.resolve('./esbuildRegister')
          : require.resolve('./babelRegister'),
        ...payload.args,
      ],
      {
        cwd: payload.cwd,
        env: payload.env,
        stdio: 'inherit',
      },
    )
  } catch {}
}
