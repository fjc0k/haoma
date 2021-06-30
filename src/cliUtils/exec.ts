import execa, { Options } from 'execa'

function stripQuote(str: string): string {
  return str.replace(/^'(.*)'$/g, '$1').replace(/^"(.*)"$/g, '$1')
}

async function exec(
  options: Options,
  literals: TemplateStringsArray,
  ...interpolations: any[]
): Promise<string> {
  const cmds: string[] = []
  for (let i = 0; i < interpolations.length; i++) {
    const literal = literals[i]
    const interpolation = interpolations[i]
    cmds.push(
      ...literal
        .split(/\s+/g)
        .map(item => item.trim())
        .filter(Boolean)
        .map(stripQuote),
    )
    if (Array.isArray(interpolation)) {
      cmds.push(...interpolation)
    } else {
      cmds.push(interpolation)
    }
  }
  cmds.push(
    ...literals[literals.length - 1]
      .split(/\s+/g)
      .map(item => item.trim())
      .filter(Boolean)
      .map(stripQuote),
  )
  const res = await execa(cmds[0], cmds.slice(1), options)
  return res.stdout
}

export function $(
  literals: TemplateStringsArray,
  ...interpolations: any[]
): Promise<string>

export function $(
  options: Options,
): (literals: TemplateStringsArray, ...interpolations: any[]) => Promise<string>

export function $(literalsOrOptions: any, ...interpolations: any[]): any {
  if (Array.isArray(literalsOrOptions)) {
    return exec({}, literalsOrOptions as any, ...interpolations)
  }
  return exec.bind(null, literalsOrOptions)
}

export function $$(
  literals: TemplateStringsArray,
  ...interpolations: any[]
): Promise<string>

export function $$(
  options: Options,
): (literals: TemplateStringsArray, ...interpolations: any[]) => Promise<string>

export function $$(literalsOrOptions: any, ...interpolations: any[]): any {
  if (Array.isArray(literalsOrOptions)) {
    return exec(
      {
        stdio: 'inherit',
      },
      literalsOrOptions as any,
      ...interpolations,
    )
  }
  return exec.bind(null, {
    stdio: 'inherit',
    ...literalsOrOptions,
  })
}
