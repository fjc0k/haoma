require('@swc-node/register/lib/register').register({
  target: 'es2019',
  module: 'commonjs',
  moduleResolution: 'node',
  esModuleInterop: true,
  sourceMap: false,
})
