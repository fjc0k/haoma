// @ts-ignore
import * as yup2 from 'yup/es'
import { getPrettierConfig } from '../src/getPrettierConfig'
import { yup } from './es'

test('hello', () => {
  expect(1).toBe(1).toBeLessThan(2)
  expect(yup).toBe(yup)
  expect(yup2.string).toBe(yup2.string)
  expect(getPrettierConfig()).toEqual(getPrettierConfig())
  expect(Promise.resolve(1))
    .resolves.toBe(1)
    .resolves.toBeLessThan(2)
    .resolves.not.toBe(2)
})
