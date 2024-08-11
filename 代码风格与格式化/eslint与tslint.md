## ESlint

ESLint是一种JavaScript代码检查工具，它可以帮助开发者找出问题并提高代码质量。它的特点是可以让开发者定制自己的检测规则并使用内置的规则，是一个基于Node.js编写、易于安装和使用的工具。
1.  [全部规则](https://cn.eslint.org/docs/rules/)

3.  安装和使用

    先决条件：Node.js (>=6.14), npm version 3+。

    你可以使用 npm 安装 ESLint：

    $ npm install eslint --save-dev
    紧接着你应该设置一个配置文件：

    $ ./node_modules/.bin/eslint --init
    之后，你可以在任何文件或目录上运行 ESLint 如下：

    $ ./node_modules/.bin/eslint yourfile.js
    也可以在全局而不是本地安装 ESLint (使用 npm install eslint --global)。但是，你使用的任何插件或可共享配置都必须安装在本地。

    Configuration
    注意：如果你之前使用的版本低于 1.0.0，请查看 迁移指南。

    运行 eslint --init 之后，.eslintrc 文件会在你的文件夹中自动创建。你可以在 .eslintrc 文件中看到许多像这样的规则：

    {
    "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
    }
    }
    "semi" 和 "quotes" 是 ESLint 中 规则 的名称。第一个值是错误级别，可以使下面的值之一：

    "off" or 0 - 关闭规则
    "warn" or 1 - 将规则视为一个警告（不会影响退出码）
    "error" or 2 - 将规则视为一个错误 (退出码为 1)
    这三个错误级别可以允许你细粒度的控制 ESLint 是如何应用规则（更多关于配置选项和细节的问题，请查看配置文件）

    你的 .eslintrc 配置文件可以包含下面的一行：

         "extends": "eslint:recommended"

    由于这行，所有在 规则页面 被标记为 "" 的规则将会默认开启。另外，你可以在 npmjs.com 搜索 “eslint-config” 使用别人创建好的配置。只有在你的配置文件中扩展了一个可分享的配置或者明确开启一个规则，ESLint 才会去校验你的代码。

5.  可惜的是,小程序编辑器不支持向 vscode 那样,通过插件 eslint,就可以在书写代码时(而不是再运行 npx 命令时)就完成对代码的检查并提示。即使你在小程序拓展插件中加入 vscode 中的 eslint 插件。

## TSlint

1. 介绍

   tslint 曾经是针对 typescript 的代码检查工具。因为 tslint 项目在 19 年 1 月官方就宣布以插件的形式转移到 eslint 项目中。转移过去的项目叫 typescript-eslint, 所以想要使用 tslint 就需要安装 eslint。

2. 安装和使用

   在安装了 eslint 后,在其配置文件(.eslintrc.json)配置如下

   ```json
   {
     "extends": ["
         eslint:recommended",//ESLint团队为所有项目推荐的规则集,配置中的所有规则都无需进行类型检查即可运行。这意味着它们更轻巧，运行速度更快。
        "plugin:@typescript-eslint/recommended"
        ],
     "parser": "@typescript-eslint/parser",

     "plugins": ["@typescript-eslint"]
   }
   ```

3. git 地址 [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)

## prettier 格式化

有个性的格式化工具 1000 万 star
给出我的配置恭参考
```js
module.exports = {
printWidth: 100, // 一行最多 100 字符

    tabWidth: 4, // 使用 4 个空格缩进

    useTabs: false, // 不使用缩进符，而使用空格

    semi: true, // 行尾需要有分号

    singleQuote: false, // 使用单引号

    quoteProps: "as-needed", // 对象的 key 仅在必要时用引号

    trailingComma: "none", // 末尾去掉逗号

    bracketSpacing: true, // 大括号内的首尾需要空格

    rangeStart: 0, // 每个文件格式化的范围是文件的全部内容
    rangeEnd: Infinity,
    overrides: [
        {
        files: "*.wxml",
        options: { parser: "html" },
        },
        {
        files: "*.wxss",
        options: { parser: "css" },
        },
        {
        files: "*.wxs",
        options: { parser: "babel", quoteProps: "preserve" },
        },
    ],

    proseWrap: "preserve", // 使用默认的折行标准

    htmlWhitespaceSensitivity: "css", // 根据显示样式决定 html 要不要折行

    endOfLine: "lf", // 换行符使用 lf

    "editor.defaultFormatter": "esbenp.prettier-vscode", // 设置编辑默认的格式化工具为prettier
    };
    ```

## husky

在你使用 git commit 和 push 代码之前执行 eslint 和 prettier

```json

  // package.json
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged" //直接指向下面的lint-staged了!当然可以是任何
        }
    }

```

## lint-staged

使代码检查更加快捷，只检查 staged 数据

```json
// package.json
   "lint-staged": {
        "*.ts": "eslint --cache --fix", //.eslintcache文件忽略
        "*.{ts,wxss,wxml,json,md}": "prettier --write" //针对小程序文件进行格式化 当然如果你在书写代码后，手动或者设置了保存代码时自动格式化，这里可能重复,主要是避免没有格式化的代码进入仓库。
    }
```
