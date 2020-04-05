import { Options } from 'prettier'

export function getPrettierConfig(): Options {
  return {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: true,
    quoteProps: 'consistent',
    jsxSingleQuote: true,
    trailingComma: 'all',
    bracketSpacing: true,
    jsxBracketSameLine: true,
    arrowParens: 'avoid',
    endOfLine: 'lf',
  }
}
