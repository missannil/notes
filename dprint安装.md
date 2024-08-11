## dprint 安装

1. 下载并安装https://dprint.dev/install/
   记住dprint目录

2. 安装vscode插件 Dprint Code Formatter

3. 控制台 生成配置文件`dprint init` (根目录 手动创建或之前已有dprint.json  可跳过)

```json
{
  "incremental": true,
  "typescript": {
    "useTabs": true
  },
  "json": {
  },
  "markdown": {
  },
  "includes": ["**/*.{ts,tsx,js,jsx,cjs,mjs,json,md}"],
  "excludes": [
    "**/node_modules",
    "**/*-lock.json"
  ],
  "plugins": [
    "https://plugins.dprint.dev/typescript-0.68.2.wasm",
    "https://plugins.dprint.dev/json-0.15.2.wasm",
    "https://plugins.dprint.dev/markdown-0.13.2.wasm"
  ]
}
```

4. 根据插件说明配置 vscode setting.json文件 如下

```json
{
  // dprint.exe 路径
  "dprint.path": "C:\\Users\\missa\\.dprint\\bin\\dprint.exe",
  // all user dprint
  "editor.defaultFormatter": "dprint.dprint",
  // or specify per language, for example
  "[javascript]": {
    "editor.defaultFormatter": "dprint.dprint"
  }
}
```
5. 完成

6. 更新依赖 `drpint --help`