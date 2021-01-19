import { types as babelTypes, PluginObj } from '@babel/core'

export function defineBabelPlugin(
  plugin: (types: typeof babelTypes) => PluginObj,
) {
  return ({ types }: any) => plugin(types)
}
