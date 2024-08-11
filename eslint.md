### Eslint

[ESLint] 是一个开源的 JavaScript 代码检查工具,初衷是为了让程序员可以创建自己的检测规则。[ESLint] 的所有规则都被设计成可插入的。[ESLint] 的默认规则与其他的插件并没有什么区别，规则本身和测试可以依赖于同样的模式。为了便于人们使用，[ESLint] 可继承配置好的规则(内置或指定)，当然，你可以在使用自定义规则(会覆盖继承的规则)。[ESLint] 使用 Node.js 编写.

#### 安装

通过 npm 安装 `npm i eslint -D`

#### 配置

    ```bash
    $ npx eslint --init
    You can also run this command directly using 'npm init @eslint/config'.
    √ How would you like to use ESLint? · problems\
    √ What type of modules does your project use? · esm
    √ Which framework does your project use? · none
    √ Does your project use TypeScript? · No / Yes
    √ Where does your code run? · node
    √ What format do you want your config file to be in? · JavaScript
    The config that you've selected requires the following dependencies:

    @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
    √ Would you like to install them now? · No / Yes
    √ Which package manager do you want to use? · npm
    Installing @typescript-eslint/eslint-plugin@latest, @typescript-eslint/parser@latest

    up to date, audited 131 packages in 3s

    33 packages are looking for funding
    run `npm fund` for details

    found 0 vulnerabilities
    Successfully created .eslintrc.js file in C:\Users\missannil\Desktop\test-eslint
    ```

根目录生成配置文件如下

```js
module.exports = {
	env: {
		es2021: true,
		node: true
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint'],
	rules: {
		//覆盖默认规则
		indent: ['error', 4],
		'no-trailing-spaces': ['error'],
		semi: ['off'],
		'@typescript-eslint/semi': ['error', 'never'],
		'@typescript-eslint/no-extra-semi': ['error'],
		quotes: ['off'],
		'@typescript-eslint/quotes': ['error', 'single'],
		'@typescript-eslint/ban-ts-comment': ['off'],
		'@typescript-eslint/adjacent-overload-signatures': ['error'],
		'@typescript-eslint/ban-types': [
			'error',
			{
				extendDefaults: true,
				types: {
					/**
					 * we are using `{}` as noop
					 * e.g. `type A<P> = B & (P extends Q ? C : {})`
					 * will get `B & C` when `P extends Q` and `B` otherwise
					 */
					'{}': false,
					/**
					 * we actually need a type accepting any function-like value
					 * e.g. `type Methods = Record<string, Function>`
					 */
					Function: false
				}
			}
		],
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'none',
					requireLast: false
				},
				singleline: {
					delimiter: 'comma',
					requireLast: false
				}
			}
		],
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'enum',
				format: ['PascalCase', 'UPPER_CASE'],
				leadingUnderscore: 'forbid',
				trailingUnderscore: 'forbid'
			},
			{
				selector: 'typeLike',
				format: ['PascalCase'],
				leadingUnderscore: 'forbid',
				trailingUnderscore: 'forbid'
			}
		],
		'@typescript-eslint/array-type': [
			'error',
			{
				default: 'array-simple',
				readonly: 'array-simple'
			}
		],
		'@typescript-eslint/no-unnecessary-qualifier': ['error']
	}
};
```

#### .eslintignore

忽略的文件,使用 node-glob 标准 优先级高于配置文件中的 ignorePatterns 字段

#### 命令行检查运行

更多[命令](http://eslint.cn/docs/user-guide/command-line-interface)

```bash
$ npx eslint **/*.ts

```

#### 插件的使用

命令行检查一般用于 git 提交之前。平时在编写代码时方便及时了解 lint 错误,一般都搭配官方的 vscode [ESlint 插件](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

vscode setting [相关配置](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint#settings-options):

```json
	//在触发vscode保存时运行eslint修复所有错误,无法监控到自动保存，需要手动ctrl+s
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
```

#### 一些坑

-   报错:Parsing error: ESLint was configured to run on `<tsconfigRootDir>/.eslintrc.js` using `parserOptions.project`: <tsconfigRootDir>/tsconfig.json However, that TSConfig does not include this file
    解释:配置文件未指定当前文件忽略或包含。
    原因: vscode tslint 插件启用后会对所有的 js,ts 文件进行 lint 检查,当检查`xxx.js`文件时若配置文件中(.eslintrc.js)未忽略或未包含此文件都会在`xxx.js`文件头部位置报此错误.
    解决方法:
    1. 在.eslintignore 中添加忽略 `xxx.js` 或 在修改.eslintrc.js 配置在 ignorePatterns 字段下加入`xxx.js`示例: `ignorePatterns: ['xxx.js']`
    2. 修改 tsconfig 文件中包含.eslintrc.js 文件 例如 `"include": ["./test/*.ts","xxx.js"]`
        > ⚠ 使用方法 2 时需要让`eslin插件`重新加载`.eslintrc.js`文件,重启 vscode 或修改配置文件中任意规则在 ctrl+z(目的时为了让插件配置被重新读取)。

#### 总结

eslint是微软维护的和vscode是一家,还需要prettier么?

[eslint]: https://eslint.bootcss.com/
