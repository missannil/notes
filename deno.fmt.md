## 使用demo内置的格式化工具用于小程序ts开发的格式化(vscode)

[deno官方文档](https://deno.land/manual@v1.16.1/getting_started/installation)

1. 先安装demo

Using PowerShell (Windows):

`iwr https://deno.land/x/install/install.ps1 -useb | iex`

2. 安装vscode 插件 deno

3. vscode中指定配置文件路径(deno.json or deno.jsonc) 不指定路径为默认配置 ctrl+,打开设置

`"deno.config": "D:\\Desktop\\enhanced-miniprogram\\deno.jsonc"`
[官方模板](https://deno.land/x/deno@v1.16.1/cli/schemas/config-file.v1.json)

```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "lint": {
    "files": {
      "include": ["src/"],
      "exclude": ["src/testdata/"]
    },
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  },
  "fmt": {
    "files": {
      "include": ["src/"],
      "exclude": ["src/testdata/"]
    },
    "options": {
      "useTabs": true,
      "lineWidth": 80,
      "indentWidth": 4,
      "singleQuote": true,
      "proseWrap": "preserve"
    }
  }
}
```
