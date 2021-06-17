# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/fjc0k/haoma/compare/v2.31.0...v3.0.0) (2021-06-17)

### ⚠ BREAKING CHANGES

- 不再支持 swc

### Features

- jest 升级到 27, testEnvironment 默认为 node ([d679bf9](https://github.com/fjc0k/haoma/commit/d679bf932e69c02b46ba180de59e2da1c9740ca5))
- 去除 swc ([3733dcd](https://github.com/fjc0k/haoma/commit/3733dcda73b4ad35eb625b71507e07e27454fd52))
- 支持编译 .vue 单文件 ([9e6bf18](https://github.com/fjc0k/haoma/commit/9e6bf18959e12990c896d7a8e68af0ffcdf4bc78))

### Bug Fixes

- .vue 编译 beforeCreate 问题 ([f092696](https://github.com/fjc0k/haoma/commit/f0926962fd898dba50fd831a64348c974b0f9f5f))

## [2.31.0](https://github.com/fjc0k/haoma/compare/v2.30.0...v2.31.0) (2021-03-20)

### Features

- **bundle:** format ([0ece3a7](https://github.com/fjc0k/haoma/commit/0ece3a7235cd7bd0e6c91afabf1691aaf8b257e8))

## [2.30.0](https://github.com/fjc0k/haoma/compare/v2.29.0...v2.30.0) (2021-03-17)

### Features

- **cli:** add bundle ([86af9e6](https://github.com/fjc0k/haoma/commit/86af9e6ad49fd2935649a62917a5b4143b206cf6))

## [2.29.0](https://github.com/fjc0k/haoma/compare/v2.28.0...v2.29.0) (2021-03-17)

### Features

- **cli:** add runs, rune ([5dfc963](https://github.com/fjc0k/haoma/commit/5dfc96359b559efad99dd7800a5afb087ca07b70))

### Bug Fixes

- **babel:** decorators before class properties ([ffdcd18](https://github.com/fjc0k/haoma/commit/ffdcd18aed3c2b73c4d3a9fae3740bdf15a82301))

## [2.28.0](https://github.com/fjc0k/haoma/compare/v2.27.0...v2.28.0) (2021-02-22)

### Features

- babelRegister ([8a18b5f](https://github.com/fjc0k/haoma/commit/8a18b5f4241cdec9c774efb35e5ff2ebc598b119))

## [2.27.0](https://github.com/fjc0k/haoma/compare/v2.26.1...v2.27.0) (2021-02-22)

### Features

- BabelConfigDynamicallyItem ([279a51a](https://github.com/fjc0k/haoma/commit/279a51a1cee5742edb01a85d18c7159ac5dd2e4c))

### [2.26.1](https://github.com/fjc0k/haoma/compare/v2.26.0...v2.26.1) (2021-02-21)

### Bug Fixes

- regenerator: !polyfill ([88a7f42](https://github.com/fjc0k/haoma/commit/88a7f423c8d27033e8efec787e60497f1940e358))

## [2.26.0](https://github.com/fjc0k/haoma/compare/v2.25.1...v2.26.0) (2021-02-21)

### Features

- environmentVariables ([326b611](https://github.com/fjc0k/haoma/commit/326b61184e9d601635f24124f8f48e1527f5a4d2))
- polyfill ([172d985](https://github.com/fjc0k/haoma/commit/172d9853ef8f7d8e3fee27be6aa224d9d5c4f127))

### [2.25.1](https://github.com/fjc0k/haoma/compare/v2.25.0...v2.25.1) (2021-02-18)

### Bug Fixes

- **run:** 透传参数 ([c17656c](https://github.com/fjc0k/haoma/commit/c17656c73a41d19cbf821c82b866d01532ec4364))

## [2.25.0](https://github.com/fjc0k/haoma/compare/v2.24.0...v2.25.0) (2021-02-08)

### Features

- typescript-snapshots-plugin ([3c1443a](https://github.com/fjc0k/haoma/commit/3c1443a75fa7ec86e36ae41f4e2c41909f22d12f))
- 升级依赖 ([b339135](https://github.com/fjc0k/haoma/commit/b339135c6e0c91bd1961748a6d0911c90a0b31ee))

### Bug Fixes

- babel 的 preset 执行顺序是倒置的 ([0f5facd](https://github.com/fjc0k/haoma/commit/0f5facd8d21d9eea441b6fef97c6859aa13cef00))
- sketch binary ([1ad92b0](https://github.com/fjc0k/haoma/commit/1ad92b0fbdea30994722b35bfe3444d3984d7a02))

## [2.24.0](https://github.com/fjc0k/haoma/compare/v2.23.2...v2.24.0) (2021-01-19)

### Features

- defineBabelPlugin ([63e98c1](https://github.com/fjc0k/haoma/commit/63e98c1ade4eb6947f44b2bc33f280ddf0e7955d))

### [2.23.2](https://github.com/fjc0k/haoma/compare/v2.23.1...v2.23.2) (2020-12-18)

### Bug Fixes

- **run:** 不抛出 execa 的错误 ([064f747](https://github.com/fjc0k/haoma/commit/064f7477b3b83873a685428fd2d5bf9d9b624a77))

### [2.23.1](https://github.com/fjc0k/haoma/compare/v2.23.0...v2.23.1) (2020-12-12)

### Bug Fixes

- **getBabelConfig:** 修复 ts、jsx 识别问题 ([fd24ce7](https://github.com/fjc0k/haoma/commit/fd24ce714c753c2cd964219bea72d96c08869339))

## [2.23.0](https://github.com/fjc0k/haoma/compare/v2.22.0...v2.23.0) (2020-12-11)

### Features

- **run:** 支持 .env.local ([4159d90](https://github.com/fjc0k/haoma/commit/4159d90833ec693fcebec978486bec7576a225a5))

## [2.22.0](https://github.com/fjc0k/haoma/compare/v2.21.0...v2.22.0) (2020-12-11)

### Features

- **run:** 支持 .env ([d4bb1ce](https://github.com/fjc0k/haoma/commit/d4bb1ce586f38411ff90b2d075d3e2466210103f))

## [2.21.0](https://github.com/fjc0k/haoma/compare/v2.20.1...v2.21.0) (2020-12-08)

### Features

- rollupDtsExcludeFiles ([4ffa115](https://github.com/fjc0k/haoma/commit/4ffa11507cc8028839a7afcc4fcf77276ddbd876))

### [2.20.1](https://github.com/fjc0k/haoma/compare/v2.20.0...v2.20.1) (2020-11-23)

### Bug Fixes

- renameImport ([67aee85](https://github.com/fjc0k/haoma/commit/67aee852cd4e744918f3303311efe298758ac8ef))

## [2.20.0](https://github.com/fjc0k/haoma/compare/v2.19.0...v2.20.0) (2020-11-23)

### Features

- renameImport ([36cb7ae](https://github.com/fjc0k/haoma/commit/36cb7aeacd1317e48d84c4e63acd9cdcabac31ae))

## [2.19.0](https://github.com/fjc0k/haoma/compare/v2.18.2...v2.19.0) (2020-11-19)

### Features

- 引入 workerpool ([b162fb7](https://github.com/fjc0k/haoma/commit/b162fb7e2a1d6df54f42e3c9ad38a4989eaee8c3))

### [2.18.2](https://github.com/fjc0k/haoma/compare/v2.18.1...v2.18.2) (2020-11-19)

### Bug Fixes

- tslib ([980fb92](https://github.com/fjc0k/haoma/commit/980fb92ebe072f6eb405b379637c4d2646af1498))

### [2.18.1](https://github.com/fjc0k/haoma/compare/v2.18.0...v2.18.1) (2020-11-19)

### Bug Fixes

- add @babel/plugin-proposal-class-properties ([a454e8c](https://github.com/fjc0k/haoma/commit/a454e8cda25466126a55a86a566c668acf63462e))

## [2.18.0](https://github.com/fjc0k/haoma/compare/v2.17.1...v2.18.0) (2020-11-19)

### Features

- **compile:** 支持打包类型文件 ([91a01f6](https://github.com/fjc0k/haoma/commit/91a01f6cb3e6a1f35e819ed332ff69eee2fef79a))

### [2.17.1](https://github.com/fjc0k/haoma/compare/v2.17.0...v2.17.1) (2020-11-18)

### Bug Fixes

- swc ([1b076c2](https://github.com/fjc0k/haoma/commit/1b076c208a83cd32137e9aaed2a8942c985f5c45))

## [2.17.0](https://github.com/fjc0k/haoma/compare/v2.16.2...v2.17.0) (2020-11-17)

### Features

- 优化 run ([dc80004](https://github.com/fjc0k/haoma/commit/dc80004503993c8200852ddac0375b1a2d398827))

### [2.16.2](https://github.com/fjc0k/haoma/compare/v2.16.1...v2.16.2) (2020-11-16)

### Bug Fixes

- getCssModulesScopedName ([4ef7487](https://github.com/fjc0k/haoma/commit/4ef7487a8860bdf22f3ea134ce3115ed770b0020))

### [2.16.1](https://github.com/fjc0k/haoma/compare/v2.16.0...v2.16.1) (2020-11-16)

### Bug Fixes

- target ([beaa583](https://github.com/fjc0k/haoma/commit/beaa58322b4058cff965ac19dbdf57e1fd1a64e9))

## [2.16.0](https://github.com/fjc0k/haoma/compare/v2.15.0...v2.16.0) (2020-11-15)

### Features

- **compile:** 支持编译 CSS 文件 ([c243945](https://github.com/fjc0k/haoma/commit/c243945b922f7f5e4e8241e73d1580ed49d2fe6b))

### Bug Fixes

- dts ([e10367a](https://github.com/fjc0k/haoma/commit/e10367a97b604e67e4a345217cef40f09351742f))

## [2.15.0](https://github.com/fjc0k/haoma/compare/v2.14.0...v2.15.0) (2020-11-12)

### Features

- **compile:** 支持 vue2 JSX ([bab4837](https://github.com/fjc0k/haoma/commit/bab4837050fb3d7aa66262db539674086c0314bc))

## [2.14.0](https://github.com/fjc0k/haoma/compare/v2.13.3...v2.14.0) (2020-11-11)

### Features

- **compile:** 新增 modularImport 选项 ([413909b](https://github.com/fjc0k/haoma/commit/413909ba07df2223aeac3b08c7e0643cb4575510))

### [2.13.3](https://github.com/fjc0k/haoma/compare/v2.13.2...v2.13.3) (2020-11-10)

### Bug Fixes

- babel ([ab91fbd](https://github.com/fjc0k/haoma/commit/ab91fbd1d6be68a73d83712e78fad60b54ea1e39))

### [2.13.2](https://github.com/fjc0k/haoma/compare/v2.13.1...v2.13.2) (2020-11-10)

### Bug Fixes

- 透传 babel 配置 ([fd832cb](https://github.com/fjc0k/haoma/commit/fd832cbeb50a9f78329758d0de8d1390c4d84340))

### [2.13.1](https://github.com/fjc0k/haoma/compare/v2.13.0...v2.13.1) (2020-11-10)

### Bug Fixes

- 修正 babel 配置 ([8d3ff92](https://github.com/fjc0k/haoma/commit/8d3ff92d48ae9b76af1f57ba55c8f1f5621f5ffd))

## [2.13.0](https://github.com/fjc0k/haoma/compare/v2.12.3...v2.13.0) (2020-11-04)

### Features

- 提出 getBabelConfig ([d347683](https://github.com/fjc0k/haoma/commit/d347683ca9dcaf86b747304af1f94762eb77f87e))

### [2.12.3](https://github.com/fjc0k/haoma/compare/v2.12.2...v2.12.3) (2020-11-03)

### [2.12.2](https://github.com/fjc0k/haoma/compare/v2.12.1...v2.12.2) (2020-11-03)

### Bug Fixes

- swc ([97c5c99](https://github.com/fjc0k/haoma/commit/97c5c991d526408d83cb595836df3ac487fcf5f1))

### [2.12.1](https://github.com/fjc0k/haoma/compare/v2.12.0...v2.12.1) (2020-11-03)

### Bug Fixes

- tsc ([bae1795](https://github.com/fjc0k/haoma/commit/bae179580e6cf15fc4c51bdc11443aa2c0815bff))

## [2.12.0](https://github.com/fjc0k/haoma/compare/v2.11.0...v2.12.0) (2020-11-03)

### Features

- **compile:** 支持 ts 配置文件 ([3af7cfb](https://github.com/fjc0k/haoma/commit/3af7cfba3e754a51d2d3d54dc39aa6be3c0d9b6c))

## [2.11.0](https://github.com/fjc0k/haoma/compare/v2.10.2...v2.11.0) (2020-11-03)

### Features

- **compile:** 优化提示 ([16ef5b0](https://github.com/fjc0k/haoma/commit/16ef5b01a705b7d3f57eea3198ebda6c3c96de8e))

### [2.10.2](https://github.com/fjc0k/haoma/compare/v2.10.1...v2.10.2) (2020-11-03)

### Bug Fixes

- compile ([75342bb](https://github.com/fjc0k/haoma/commit/75342bb48861f89abdb90ef8c7ee82871d87493e))

### [2.10.1](https://github.com/fjc0k/haoma/compare/v2.10.0...v2.10.1) (2020-11-03)

### Bug Fixes

- jsx preserve ([8b8e8ea](https://github.com/fjc0k/haoma/commit/8b8e8ea7a4560a9b8d542ca5ffe268d2498fd837))

## [2.10.0](https://github.com/fjc0k/haoma/compare/v2.9.0...v2.10.0) (2020-11-03)

### Features

- 优化 compile ([c2fbec1](https://github.com/fjc0k/haoma/commit/c2fbec11e488a5061193fea436fa86e26b94bfb1))

## [2.9.0](https://github.com/fjc0k/haoma/compare/v2.8.1...v2.9.0) (2020-11-02)

### Features

- **compile:** 支持生成 dts ([bdee2c2](https://github.com/fjc0k/haoma/commit/bdee2c22667271071a16067303f895c6895e4172))

### [2.8.1](https://github.com/fjc0k/haoma/compare/v2.8.0...v2.8.1) (2020-11-01)

## [2.8.0](https://github.com/fjc0k/haoma/compare/v2.7.2...v2.8.0) (2020-11-01)

### Features

- 增加 compile 命令 ([dea5bee](https://github.com/fjc0k/haoma/commit/dea5bee4c56fcd73e8ba5676588bc149d10eff47))

### [2.7.2](https://github.com/fjc0k/haoma/compare/v2.7.1...v2.7.2) (2020-10-29)

### Bug Fixes

- 解决 babel 问题 ([7f685a5](https://github.com/fjc0k/haoma/commit/7f685a5f142130033c445917abacb6bd749ef07d))

### [2.7.1](https://github.com/fjc0k/haoma/compare/v2.7.0...v2.7.1) (2020-10-29)

### Bug Fixes

- 调整 @babel/plugin-transform-modules-commonjs 的位置 ([f901f9f](https://github.com/fjc0k/haoma/commit/f901f9f0f5eda8ecb4bfff8ff59654d09b175a70))

## [2.7.0](https://github.com/fjc0k/haoma/compare/v2.6.0...v2.7.0) (2020-10-27)

### Features

- 支持 Vue JSX ([0e35994](https://github.com/fjc0k/haoma/commit/0e359949083884aa5b319ea67aad134e2c034827))
- 支持文件 ([5e0897f](https://github.com/fjc0k/haoma/commit/5e0897f26345c18d19c5157be0b1a631a5e47ed9))

## [2.6.0](https://github.com/fjc0k/haoma/compare/v2.5.0...v2.6.0) (2020-10-11)

### Features

- --unhandled-rejections=strict ([4198fa3](https://github.com/fjc0k/haoma/commit/4198fa3e3c453c8ddf92ad10b3da246b65668dd6))

## [2.5.0](https://github.com/fjc0k/haoma/compare/v2.4.4...v2.5.0) (2020-09-16)

### Features

- 新增 run 命令 ([101b271](https://github.com/fjc0k/haoma/commit/101b2714dc43085349ce7ded3f8e425a1e74bec8))

### [2.4.4](https://github.com/fjc0k/haoma/compare/v2.4.3...v2.4.4) (2020-09-16)

### [2.4.3](https://github.com/fjc0k/haoma/compare/v2.4.2...v2.4.3) (2020-08-19)

### [2.4.2](https://github.com/fjc0k/haoma/compare/v2.4.1...v2.4.2) (2020-08-18)

### [2.4.1](https://github.com/fjc0k/haoma/compare/v2.4.0...v2.4.1) (2020-08-15)

## [2.4.0](https://github.com/fjc0k/haoma/compare/v2.3.0...v2.4.0) (2020-08-15)

### Features

- vue ([81a20a6](https://github.com/fjc0k/haoma/commit/81a20a6442836ed053b58893db61537be8134cde))

## [2.3.0](https://github.com/fjc0k/haoma/compare/v2.2.0...v2.3.0) (2020-07-20)

### Features

- disable @typescript-eslint/ban-types ([bea8c9f](https://github.com/fjc0k/haoma/commit/bea8c9f3f387a6a06516170b2084311b203e0a13))

## [2.2.0](https://github.com/fjc0k/haoma/compare/v2.1.0...v2.2.0) (2020-06-16)

### Features

- off explicit-module-boundary-types ([ecc7eb0](https://github.com/fjc0k/haoma/commit/ecc7eb0a279f7ace7849b0b000f2694559c264cd))

## [2.1.0](https://github.com/fjc0k/haoma/compare/v2.0.2...v2.1.0) (2020-06-15)

### Features

- **jest:** ts 使用 ts-jest, js 使用 babel-jest ([012da23](https://github.com/fjc0k/haoma/commit/012da23bf7dedbaa646d42d7fe235fb9b41f35bd))

### [2.0.2](https://github.com/fjc0k/haoma/compare/v2.0.1...v2.0.2) (2020-06-15)

### Bug Fixes

- 更新 babel 和 eslint 配置 ([836c683](https://github.com/fjc0k/haoma/commit/836c683b56c36b61fd1b6fc1d50fb58dc41c8bb0))

### [2.0.1](https://github.com/fjc0k/haoma/compare/v2.0.0...v2.0.1) (2020-06-14)

### Bug Fixes

- eslint 7 ([465944e](https://github.com/fjc0k/haoma/commit/465944e79ca5bc4eea3cb47bdead6c4ac42c7b36))

## [2.0.0](https://github.com/fjc0k/haoma/compare/v2.0.0-beta.2...v2.0.0) (2020-06-14)

### Features

- 升级到 eslint 7 ([346d398](https://github.com/fjc0k/haoma/commit/346d398e548f4cf32f85a67a3eca6e5776dd0939))

## [2.0.0-beta.2](https://github.com/fjc0k/haoma/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2020-05-30)

### Features

- 完善 ESLint 规则 ([6c72514](https://github.com/fjc0k/haoma/commit/6c72514d96838cc058eb72629cbc4fcbff7715a3))

## [2.0.0-beta.1](https://github.com/fjc0k/haoma/compare/v2.0.0-beta.0...v2.0.0-beta.1) (2020-05-27)

## [2.0.0-beta.0](https://github.com/fjc0k/haoma/compare/v1.13.0...v2.0.0-beta.0) (2020-05-27)

### Features

- 升级 jest 到 26 ([38f55ff](https://github.com/fjc0k/haoma/commit/38f55ffe42eeb9aa7ece1236289aba30b2a5e655))

## [1.13.0](https://github.com/fjc0k/haoma/compare/v1.12.4...v1.13.0) (2020-05-06)

### Features

- 禁用 no-var-requires ([9269ee5](https://github.com/fjc0k/haoma/commit/9269ee53cbd6a128fe00b01785bb7287a039e38b))

### [1.12.4](https://github.com/fjc0k/haoma/compare/v1.12.3...v1.12.4) (2020-04-30)

### Bug Fixes

- 删除遗留的 jest 代码 ([a6c07f5](https://github.com/fjc0k/haoma/commit/a6c07f52202fd3a6ca3c264c3cb14eb5f33eb241))

### [1.12.3](https://github.com/fjc0k/haoma/compare/v1.12.2...v1.12.3) (2020-04-30)

### Bug Fixes

- 导出第三方类型定义 ([f93fffc](https://github.com/fjc0k/haoma/commit/f93fffc1f949380ef1a90aa116c7b323d9d58ebc))

### [1.12.2](https://github.com/fjc0k/haoma/compare/v1.12.1...v1.12.2) (2020-04-29)

### Bug Fixes

- 修复 jest 路径解析 ([56c618b](https://github.com/fjc0k/haoma/commit/56c618b5de9c376ec95e7bff4cdbf1d134c9fb90))

### [1.12.1](https://github.com/fjc0k/haoma/compare/v1.12.0...v1.12.1) (2020-04-29)

## [1.12.0](https://github.com/fjc0k/haoma/compare/v1.11.5...v1.12.0) (2020-04-28)

### Features

- **jest:** 添加 jest-serializer-html ([16eac3d](https://github.com/fjc0k/haoma/commit/16eac3ddc70f9a8cc22eb55ad13a74a83772fb72))

### [1.11.5](https://github.com/fjc0k/haoma/compare/v1.11.4...v1.11.5) (2020-04-27)

### [1.11.4](https://github.com/fjc0k/haoma/compare/v1.11.3...v1.11.4) (2020-04-27)

### Bug Fixes

- 查找应用根目录 ([58f60a8](https://github.com/fjc0k/haoma/commit/58f60a8e644f300b50543849ecbc85e074a18d18))

### [1.11.3](https://github.com/fjc0k/haoma/compare/v1.11.2...v1.11.3) (2020-04-27)

### Bug Fixes

- 生产 jest 类型 ([d261611](https://github.com/fjc0k/haoma/commit/d2616111b2ed85e9607854dd5702f5976bc1c904))

### [1.11.2](https://github.com/fjc0k/haoma/compare/v1.11.1...v1.11.2) (2020-04-27)

### Bug Fixes

- 去除 postinstall ([abfcb00](https://github.com/fjc0k/haoma/commit/abfcb002dac9df5ddc5ac703868a33d1d44c7cb6))

### [1.11.1](https://github.com/fjc0k/haoma/compare/v1.11.0...v1.11.1) (2020-04-27)

### Bug Fixes

- 导出 jestTypes ([52b7595](https://github.com/fjc0k/haoma/commit/52b7595b9466ca29ebad298674b5cd8c514bc114))

## [1.11.0](https://github.com/fjc0k/haoma/compare/v1.10.0...v1.11.0) (2020-04-27)

### Features

- 添加 jest-chain, jest-extended，并生成全局 types ([9c90268](https://github.com/fjc0k/haoma/commit/9c9026870fee6cc8c1430be81a3507d71e205dac))

## [1.10.0](https://github.com/fjc0k/haoma/compare/v1.9.1...v1.10.0) (2020-04-27)

### Features

- 集成 jest ([aaeedc8](https://github.com/fjc0k/haoma/commit/aaeedc86e55faacb1e25491801e068217484cfe7))

### [1.9.1](https://github.com/fjc0k/haoma/compare/v1.9.0...v1.9.1) (2020-04-19)

## [1.9.0](https://github.com/fjc0k/haoma/compare/v1.8.0...v1.9.0) (2020-04-19)

### Features

- 完善包管理工具检测 ([a464b9d](https://github.com/fjc0k/haoma/commit/a464b9da052a8e9299e32cbfa1c3a7f140b0fd76))
- 添加 .gitignore, LICENSE ([bccadb4](https://github.com/fjc0k/haoma/commit/bccadb407bfb95939c60374260d50339e2f0905c))

## [1.8.0](https://github.com/fjc0k/haoma/compare/v1.7.0...v1.8.0) (2020-04-16)

### Features

- 新增 jest ([f12d81a](https://github.com/fjc0k/haoma/commit/f12d81ac4cd508fc38c7c499ff93ceb50857356c))

## [1.7.0](https://github.com/fjc0k/haoma/compare/v1.6.0...v1.7.0) (2020-04-14)

### Features

- 新增 prettier-plugin-sh ([e8bbb0a](https://github.com/fjc0k/haoma/commit/e8bbb0a372d41e38d13d9f3888e5fbfee9584cf0))

## [1.6.0](https://github.com/fjc0k/haoma/compare/v1.5.0...v1.6.0) (2020-04-11)

### Features

- 性能优化 ([26bdb2b](https://github.com/fjc0k/haoma/commit/26bdb2b10b815bd5a267a88940fdd2fdcc60904d))

## [1.5.0](https://github.com/fjc0k/haoma/compare/v1.4.1...v1.5.0) (2020-04-10)

### Features

- 增加 .gitattributes ([7a39493](https://github.com/fjc0k/haoma/commit/7a394937002425cde35eaa5875c3485ecde8d554))
- 完善包管理器检测 ([7602973](https://github.com/fjc0k/haoma/commit/7602973794354786785cf48e7f872a038e3ce597))
- 指定依赖版本 ([e7b56b6](https://github.com/fjc0k/haoma/commit/e7b56b6cc231149322498401325125bba77dce60))
- 新增 tsconfig.json ([d752d33](https://github.com/fjc0k/haoma/commit/d752d33f3e0717836ec682a25ce2e96995f9e57f))

### [1.4.1](https://github.com/fjc0k/haoma/compare/v1.4.0...v1.4.1) (2020-04-09)

### Bug Fixes

- 使用 pnpm 的 shamefully-hoist 前删除 node_modules ([3242dc4](https://github.com/fjc0k/haoma/commit/3242dc4c4dd8e72c996d8d533d35dd2ee388e5ee))

## [1.4.0](https://github.com/fjc0k/haoma/compare/v1.3.0...v1.4.0) (2020-04-09)

### Features

- 初始化安装 typescript, 当为 pnpm 时检查 npmrc ([be666bf](https://github.com/fjc0k/haoma/commit/be666bfede2709b43fdd178ba4c317dba918e563))

## [1.3.0](https://github.com/fjc0k/haoma/compare/v1.2.0...v1.3.0) (2020-04-08)

### Features

- 将 React 配置移入 ESLintConfig 文件 ([2c5f19e](https://github.com/fjc0k/haoma/commit/2c5f19e1e695da1baa1c885436704c6a55e4ad03))
- 改进配置结构 ([6555447](https://github.com/fjc0k/haoma/commit/6555447e275033c78f72127327d2f34301ad91c4))
- 禁用 @typescript-eslint/no-misused-promises ([40a3a2f](https://github.com/fjc0k/haoma/commit/40a3a2f67bcd37ea184706ef7bddd4635aff09c1))

## [1.2.0](https://github.com/fjc0k/haoma/compare/v1.1.0...v1.2.0) (2020-04-07)

### Features

- 添加 reactPragma, reactVersion 配置项 ([87a6e19](https://github.com/fjc0k/haoma/commit/87a6e195f8f3e94ff0e211cb3c20b77aec73655c))

## [1.1.0](https://github.com/fjc0k/haoma/compare/v1.0.0...v1.1.0) (2020-04-06)

### Features

- 禁用 react/display-name ([c78c40b](https://github.com/fjc0k/haoma/commit/c78c40bcadce885c3919b78502312f1c84f4cf53))

## [1.0.0](https://github.com/fjc0k/haoma/compare/v0.0.3...v1.0.0) (2020-04-05)

### Features

- 完善 .prettierignore ([dbe35b3](https://github.com/fjc0k/haoma/commit/dbe35b3df669d7cdb88d99789b61ba374637d140))

### [0.0.3](https://github.com/fjc0k/haoma/compare/v0.0.2...v0.0.3) (2020-04-05)

### Features

- 支持 pnpm ([dc3d413](https://github.com/fjc0k/haoma/commit/dc3d413c33011cdacaabb9e5278327c865d4552f))

### [0.0.2](https://github.com/fjc0k/haoma/compare/v0.0.1...v0.0.2) (2020-04-05)

### 0.0.1 (2020-04-05)

### Features

- 完善 ESLint 实现 ([8c47500](https://github.com/fjc0k/haoma/commit/8c475003019f2608ca6bfeac301c0e02f4604c89))
- 完成初始版本 ([12ce6e2](https://github.com/fjc0k/haoma/commit/12ce6e2eff9ba3d30dd0d85ca2548a52654555ae))
- 导出 ESLintConfig, PrettierConfig ([8978211](https://github.com/fjc0k/haoma/commit/8978211c94502d772023aa91d4e23e66684f3abd))
- 新增 prettier-plugin-packagejson ([cd99424](https://github.com/fjc0k/haoma/commit/cd99424bd91bdd5ce5cc911595d4bc99f8ee6667))
- **cli:** 依赖安装 ([f5ce8e7](https://github.com/fjc0k/haoma/commit/f5ce8e7dab8287319c07711d74da511e1345a2e8))
