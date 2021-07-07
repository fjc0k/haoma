// @ts-ignore
import * as yup2 from 'yup/es'
import { getPrettierConfig } from '../src/getPrettierConfig'
import { yup } from './es'

test('hello', () => {
  expect(yup).toBe(yup)
  expect(yup2.string).toBe(yup2.string)
  expect(getPrettierConfig()).toEqual(getPrettierConfig())
})
