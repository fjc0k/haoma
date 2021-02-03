# 好码

使用 **[EditorConfig](https://editorconfig.org/)** + **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)**，助你写出漂亮的前端代码。

## 安装

```bash
# npm
npm i haoma -D

# or pnpm
# 必须启用 shamefully-hoist 配置
# https://pnpm.js.org/en/npmrc#shamefully-hoist
pnpm add haoma -D

# or yarn
yarn add haoma -D
```

## 使用

使用以下命令初始化 `.gitignore`、 `.gitattributes`、`.editorconfig`、`.eslintrc.js`、`.eslintignore`、`.prettierrc.js`、`.prettierignore`、`tsconfig.json` 配置文件并安装 `haoma`、`typescript`、`eslint`、`prettier`、`husky`、`lint-staged` 依赖：

```bash
# npm
npx haoma init

# or pnpm
pnpx haoma init

# or yarn
yarn haoma init
```

## 限制

`compile` browser 时对 ts 的 `constructor(private x: xxx)` 不支持，原因未知。

## 许可

Jay Fong (c) MIT
