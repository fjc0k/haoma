// NOTE: 解决未知原因导致的 expect 未定义问题
if (typeof expect === 'undefined') {
  // @ts-ignore
  global.expect = {
    extend: () => 0,
  }
}

import './jestPlugins/chain'

import 'jest-extended'

import '@testing-library/jest-dom'

import 'snapshot-diff/extend-expect'

// 仅仅为了类型定义
import 'snapshot-diff'
