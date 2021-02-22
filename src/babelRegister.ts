import { getBabelConfig } from './getBabelConfig'

require('@babel/register')({
  ...getBabelConfig({
    typescript: true,
    target: 'node',
  }),
  extensions: ['.js', '.ts'],
})
