import { join } from 'path'
import { read } from 'fs'
import { sum } from 'vtils'

console.log(
  process.env.NODE_ENV,
  sum([1, 2]),
  global?.xdescribe,
  join(__dirname, 'lll'),
  read,
)
