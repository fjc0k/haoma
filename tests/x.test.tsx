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
