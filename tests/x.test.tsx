import * as _ from 'lodash-es'
import React from 'react'
import { render } from '@testing-library/react'

test('函数', () => {
  expect(function namedFn() {
    return 0
  }).toMatchSnapshot()
})

test('diff', () => {
  expect({ x: 1, y: 2 }).toMatchDiffSnapshot({
    x: 2,
    y: 2,
    z: 9,
  })
})

test('React', () => {
  const { getByText } = render(<button type='reset'>按钮</button>)
  expect(getByText('按钮')).toBeInTheDocument()
  expect(getByText('按钮')).toHaveAttribute('type', 'reset')
})

test('字符串', () => {
  expect('1222').toMatchSnapshot()
})

test('chain', () => {
  expect(1).toBeNumber().toBeLessThan(2).toBe(1)
})

test('esm', () => {
  const xxIgnored = function (_x: any) {
    return 1
  }
  expect(_).toBe(_)
})

test('decorator', () => {
  function DD() {
    return function (..._args: any[]) {
      // ...
    }
  }
  class Test {
    @DD()
    hello() {
      return 1
    }
  }
  new Test().hello()
})
