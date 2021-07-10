// @ts-nocheck

// https://github.com/mattphillips/jest-chain/blob/master/types/index.d.ts
/// <reference types="jest" />
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace jest {
  interface ChainedMatchers<T>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extends jest.JestMatchersShape<
      Matchers<ChainedMatchers<T>, T>,
      // https://github.com/mattphillips/jest-chain/pull/11/files
      Matchers<Promise<ChainedMatchers<T>> & ChainedMatchers<T>, T>
    > {}

  interface Expect {
    /**
     * The `expect` function is used every time you want to test a value.
     * You will rarely call `expect` by itself.
     *
     * @param actual The value to apply matchers against.
     */
    <T = any>(actual: T): ChainedMatchers<T>
  }
}

// https://github.com/mattphillips/jest-chain/blob/master/src/chain.js
class JestAssertionError extends Error {
  constructor(result, callsite) {
    super(
      // fix: TypeError: result.message is not a function
      typeof result.message === 'function' ? result.message() : result.message,
    )
    this.matcherResult = result

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite)
    }
  }
}

// https://github.com/mattphillips/jest-chain/pull/11/files
const chainMatchers = (
  matchers,
  originalMatchers = matchers,
  value = undefined,
) => {
  const mappedMatchers = Object.keys(matchers).map(name => {
    const matcher = matchers[name]
    if (typeof matcher === 'function') {
      const newMatcher = (...args) => {
        try {
          const v = matcher(...args) // run matcher
          return chainMatchers(originalMatchers, originalMatchers, v) // chain the original matchers again
        } catch (error) {
          // fix: https://github.com/mattphillips/jest-chain/pull/24/files
          if (error.matcherResult) {
            throw new JestAssertionError(error.matcherResult, newMatcher)
          }

          throw error // throw error if it isn't a match error
        }
      }
      return { [name]: newMatcher }
    }
    return {
      [name]: chainMatchers(matcher, originalMatchers), // recurse on .not/.resolves/.rejects
    }
  })
  const result = Promise.resolve(
    value && typeof value.then === 'function' ? value : undefined,
  )
  return Object.assign(result, ...mappedMatchers)
}

const chain = expect => {
  // proxy the expect function
  let expectProxy = Object.assign(
    (...args) => chainMatchers(expect(...args)), // partially apply expect to get all matchers and chain them
    expect, // clone additional properties on expect
  )

  expectProxy.extend = o => {
    expect.extend(o) // add new matchers to expect
    expectProxy = Object.assign(expectProxy, expect) // clone new asymmetric matchers
  }

  return expectProxy
}

global.expect = chain(global.expect)
