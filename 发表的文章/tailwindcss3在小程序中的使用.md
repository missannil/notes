### 前言

本文讲述了 tailwindcss3 在小程序中使用的基本方法,阐述 tailwindcss 思想和如何配置 tailwind.config 文件,让您快速了解和使用 tailwindcss(以下简称 tw)目的,相比[官方文档]希望给您带来更好的阅读体验。

[miniprogram-tailwind-preset](https://github.com/missannil/miniprogram-tailwind-preset),这是github开源地址
当前为初稿,后续会持续更新,欢迎 star 和 issue。

### 安装

1. 安装 tailwindcss(当前版本:3.3.2)
   `npm i tailwindcss -D`
2. 初始化配置文件

   > tw 3.3 版本开始支持 ESM/TS 了,初始化参数分别为 `--esm`和 `--ts`。
   > 初始化配置文件 `npx tailwindcss init --esm`.
   > 根目录生成的 tailwind.config.js 内容如下:

   ```js
   /** @type {import('tailwindcss').Config} */
   export default {
   	content: [],
   	theme: {
   		extend: {},
   	},
   	plugins: [],
   };
   ```

> 命令行加入参数 `--full`可生成带有全部默认设置的配置文件,可做为自定义配置时的参考。

### vscode 插件

- `Tailwind CSS IntelliSense` 官方插件,方便书写 tw 时有代码提示和悬停提示等功能
  相关配置

  ```json
  // settings.json
  {
    // 识别wxml
    "tailwindCSS.includeLanguages": {
      "wxml": "html"
    },
    // 定义关联的关键字, 比如在wxml中书写组件时 <button class="这里有tw提示" className="这里也有提示" hover-class="同样有提示" ></button>,需要注意的这里定义的关键字必须接 " = "号才有效。
    "tailwindCSS.classAttributes": [
      "class", // 默认
      "className", // 默认
      "ngClass", // 默认
      "hover-class",
      "classes"
    ],
    // 可选 使用Emmet风格的语法时支持tw提示。 例如view.text-100 生成 <view class="text-100"></view>
    "tailwindCSS.emmetCompletions": true,
    // 总是以tailwindcss模式打开wxss文件。
    "files.associations": {
      "*.wxss": "tailwindcss",
      "*.css": "tailwindcss"
    },
    // 可选 在书写字符串时,命中关键字会有只能提示(主要针对jsx文件) 如:const foo = `<view class="w-10"  />`在书写`w-10`时会有tw提示
    "editor.quickSuggestions": {
      "strings": true
    },
    // 可选 针对上面classAttributes只能接`=`号的情况,可通过正则来自定义触发提示的关键字。例如下面正则会让properties的value字段有提示, index.js: Component({properties:{classes:{type:String,value:'这里有tw提示'}}})
    "tailwindCSS.experimental.classRegex": [
      ["value:([^)]*)", "'([^']*)'"],
      ["value:([^)]*)", "\"([^\"]*)\""]
    ],
    // 可选 开启颜色装饰器,前提是"editor.colorDecorators": true //默认true
    "tailwindCSS.colorDecorators": true, // 默认
    // 可选 手动指定tw配置文件,默认是根目录的tailwind.config,当你想把所有配置文件放在一个目录中方便代码整齐时。
    "tailwindCSS.experimental.configFile": ".config/tailwind.config.js",
    // 可选 多个配置时,写成对象,key为配置路径，value为应用的文件目录
    "tailwindCSS.experimental.configFile": {
      "themes/simple/tailwind.config.js": "themes/simple/**",
      "themes/neon/tailwind.config.js": [
        "themes/neon/**",
        "other/path/to/**"
      ]
    }
  }
  ```

  如果插件无效,请检测下面设置

  1. 确保 tailwindcss 正确安装。
  2. 确保您的工作区中有一个 Tailwind 配置文件。
  3. 确保您的 VS Code 设置不会导致您的 Tailwind 配置文件被隐藏/忽略，例如 files.exclude 或 files.watcherExclude 。
  4. 如果配置了 tailwindCSS.experimental.configFile 字段,确保其正确性
  5. 由于 vscode 的工作区配置优先级更高。确保工作区 workspace.json 无覆盖用户 setting.json。
  6. 在命令行(F1)中运行 Tailwind CSS: Show Output,可查看插件运行是否有错误。

- `Tailwind Documentation` 显示官方文档,通过 ctrl+alt+t 触发。
- `Tailwind Fold` 有时过多的原子类会让人感觉眼花缭乱,此插件折叠(隐藏)原子类,在点击时自动打开。
  相关配置
  ```json
  // settings.json
  {
    "tailwind-fold.autoFold": true, // 自动折叠 默认true
    "tailwind-fold.supportedLanguages": ["wxml"], // 启用扩展的语言数组
    "tailwind-fold.foldStyle": "QUOTES", // 定义折叠样式 默认"all"
    "tailwind-fold.unfoldIfLineSelected": true, // 如果选择了行，则展开类属性 默认false
    "tailwind-fold.showTailwindImage": false, // 显示/隐藏折叠内容前面的顺风标志
    "tailwind-fold.foldedTextColor": "#ff00ff" // 折叠时文本的颜色 默认#7cdbfe7e
    // "tailwind-fold.foldedText":"...", //折叠类属性时显示的文本 默认...
    // "tailwind-fold.foldedTextBackgroundColor":"#52b7ee09", //折叠时文本的背景颜色#52b7ee09
    // "tailwind-fold.unfoldedTextOpacity":0.9, //展开类属性的不透明度 默认1
  }
  ```
- `Tailwind Config Viewer`可在侧边栏生成 tailwindcss 配置内容，并提供搜索功能，方便快速查找配置内容。(当前插件测试阶段,很多 bug)

### 核心名词概念

1. **功能类(utility)**:功能类好比键值对,唯一类名(key)对应唯一 css 样式(value),例如我们定义类名`text-center`对应唯一 css 样式`.text-center { text-align:center }`,就构成了一个功能类,习惯上把类名(key)做为功能类的名字。
2. **主题(theme)**: 当我们定义多个相近 css 样式的功能类时,tw 把它叫做主题。比如 width 主题,它包含多个以`w-`开头的功能类。比如`w-10`对应 css`width:10rpx`,`w-1/2`对应 css`width:50%`,`w-full`对应 css`width:100%`.tw 默认的大多数主题都有核心插件(生成 css 的规则函数),个别主题(如'spacing')无核心插件,是用来辅助其他主题的(通用配置对象),后续会讲解。
3. **组件类(componets)** 有时我们可能遇到部分不同主题的功能类经常出现在一起,例如要让不同文本元素都做溢出打点效果时,我们可能要在各自的 class 中重复书写一组相同的功能类,tw 允许我们把多个功能类组合为一个**组件类**来避免重复代码的书写,例如我们可定义`ellipsis` **组件类**来完成上述需求。

```css
/*文本溢出打点 */
.ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
```

4. **基础样式(base)**:实际项目中往往会预先定义一些基础样式用于全局或继承的样式,tw 把这些预定义好的样式叫做 base(基础)样式。
5. **层级和功能类优先**:在最终的 css 文件中,可能存在基础样式,组件类样式和功能类样式,组件类和功能类样式都为类选择器,基础样式中也或可能出现权重与类样式相同的选择器,这就导致了一个问题,谁应该优先呢？tw 给出了答案:**[功能类优先]**,即应该把功能类生成的样式放在输出 css 文件的最下面，中间为组件类样式,基础样式在最上面。层级概念由此而来。
6. **定制化**: tw 提供默认主题,核心插件(对应主题编译规则)等配置,为了让 tw 可在多框架模式下应用,tw 给出了高度定制化方案,通过配置文件可关闭默认主题,核心插件,可自定义主题,样式生成规则(自定义插件),可以说 tw 提供了基础样式,组件类和功能类生成 css 样式文件的框架结构,使用者可通过配置文件高度自定义转换逻辑。

7. **指令**:除了通过`taiwind.config.js`来配置 tw,tw 还允许我们通过命令行参数(`-i input.wxss`)来指定一个 css 格式的配置文件(此文件的后缀名并不重要(不写都行),写 css 或 wxss 时为了编辑器或插件识别格式,方便书写时有代码提示)。[指令]就是为这个 css 配置文件提供的`配置关键字`,相当于 css 的`At Rules`。例如`@tailwind`指令,当 tw 运行时若识别到此[指令]会读取后面的参数运行对应的内部函数。当命令行无输入这个配置文件时,当前 tw 运行时会加载默认的 input 文件配置`@tailwind base;@tailwind components;@tailwind utilities`,下面只介绍默认配置中指令含义:
   ![默认input截图][图片1]

```css
/* input.wxss */
/*
 * 通过@import 引入基础文件 这或许是
 */
@import './base.wxss';
/**
 * 建立base层(生成的样式位于输出文件最上方),在配置自定义插件时可通过addBase函数把拓展的基础样式写入到base层中(无此指令addBase函数无效)。
 */
@tailwind base;
/**
 * 建立components层(生成的样式在输出文件的中间),在配置自定义插件时可通过addComponents函数把拓展的基础样式写入到components层中(无此指令addComponents函数无效)。。
 */
@tailwind components;
/**
 * 建立utilities层(生成的样式在输出文件最下方),在配置自定义插件时可通过addUtilities函数把拓展的基础样式写入到utilities层中(无此指令addUtilities函数无效)。
 */
@tailwind utilities;

/*@layer指令用法*/

/* @layer base {
    view,
    ::before,
    ::after {
        box-sizing: border-box;
        border-width: 0;
        border-style: solid;
        border-color: currentColor;
    }
  }
  
  @layer components {
    .ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .btn-blue {
      @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
    }
  }
  
  @layer utilities {
    .filter-none {
      filter: none;
    }
  } */
```

> tw 还有一些[指令],如上面示例中注释部分`@layer`(层)指令,通过`@layer`可以直接在 input.wxss 中注入各个层级的默认 css 样式,但由于官方插件——`Tailwind CSS IntelliSense`当前无法感知这些类名(无法自动提示)且可通过 tailwind.config.js 文件的 plugins(自定义插件)字段满足这些需求(`IntelliSense`插件支持自动提示),所以在无需引入预设基础样式(`@import "./base.wxss"`)和其他指令的情况下,可不建立此配置文件,那么命令行中也就无需`-i input.wxss`参数了。

### 示例[代码片段]目录结构

```
|--components
|  |-- demoComp
|      |--demoComp.json
|      |--demoComp.wxml
|      |--demoComp.js
|
|--pages
|  |-- index
|      |--index.json
|      |--index.wxml
|      |--index.js
|
|--style
|  |--customBase.wxss
|  |--iconfont.wxss
|  |--tailwind.wxss
|  |--themeColor.wxss
|
|--app.wxss
|
|--tailwind-presets
|  |--base.wxss
|  |--input.wxss
|  |--presets.js
|
|--tailwind.config.js
|
|--package.json
|-- ...
```

### app.wxss

```css
/*app.wxss  */
@import './style/customBase.wxss';
@import './style/iconfont.wxss';
@import './style/themeColor.wxss';
@import './style/tailwind.wxss';
```

> 有可能你的项目使用的 tw 配置是预设定好的,你可以使用@import 规则,来引入你自定义的基础样式,注意引入的先后顺序,避免样式冲突。

### 脚本命令

```json
// package.json
{
  "script": {
    //  -o 输出样式文件路径 --watch 启动即时编译模式
    "tw": "tailwindcss -i ./tailwind-presets/input.wxss -o ./style/tailwind.wxss --watch "
    // 默认加载根目录tailwind.config.js(ts)配置文件,也可通过 --config 或者 -c  后接路径来指定配置文件; -i 指定一个css配置文件路径(当你在做一个公共的tw预配置文件且需要引入基本样式的css文件时)
  }
}
```

### [预设文件]

配置文件的 presets 字段可以加载一组之前的配置文件——预设文件, 这使得使配置文件拥有跨项目复用能力。预配置文件会智能覆盖引入它的配置文件各个字段,就像配置文件会覆盖默认配置一样。

```ts
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import { presets } from "./tailwind-presets";
export default {
	content: [
		"./miniprogram/components/**/*.{wxml,ts}",
		"./miniprogram/pages/**/*.{wxml,ts}",
		// ...
	],
	presets: [presets],
};
```

### 配置预设文件(presets)

在具体配置开始前,简单描述下 tw 的编译逻辑。当监控到内容文件(`class='w-10'`)中包含了主题关键字时(如'w'),tw 会找到关联主题('width')的核心插件( css 生成规则函数),在[核心插件]开启的情况下,运行插件函数并根据主题配置(主题参数和 css 值的对象),把主题参数(`10`)对应的值生成 css,写入对应的层级区。现在你应该了解了这几个关键点：主题关键字、主题核心插件、核心插件的开闭、主题配置。
当生成的 css 结果不符合预期情况(出现了小程序不兼容的 css),应该先查看核心插件的编译逻辑,看是否可通过改变默认主题配置,达到预期,如无法实现,可关闭主题和核心插件,通过 plugins 字段配置自己的主题和核心函数(生成 css 逻辑)。原则上应尽量使用 tw 默认主题。

- **关闭核心主题**
  通过[官方文档]可知`preflight`主题是 tw 内置的预置 css 样式。小程序不支持该主题生成的 css。可通过`corePlugins`字段关闭主题。

  ```js
  const presets = {
  	constent: [],
  	corePlugins: [
  		"width", // 要开启的默认主题保留
  		// 'preflight' 不写字段即关闭主题
  		// ...
  	],
  };
  ```

- **重写主题配置**

  `spacing`是较为特殊的主题,它与大多数有核心插件的主题不同,它是一个通用对象(可在[默认配置]中查看)。多个主题('witdh','padding'等)都使用它做为部分映射规则。

  ```js
  const presets = {
  	constent: [],
  	theme: {
  		// 默认配置
  		spacing: {
  			px: "1px",
  			0: "0px",
  			0.5: "0.125rem",
  			1: "0.25rem",
  			1.5: "0.375rem",
  			// ...
  		},
  	},
  };
  ```

  默认 spacing 主题显然不符合小程序 rpx 规则。替换掉它

  ```js
  const presets = {
  	constent: [],
  	theme: {
  		spacing: {
  			px: "1px",
  			0: "0px",
  			1: "1rpx",
  			2: "2rpx",
  			3: "3rpx",
  			// ...
  		},
  	},
  };
  ```

  `width`主题默认配置还引入了如`1/2:50%;`这样的规则,也不满足小程序(小程序不识别'/'符号),需要重写 width 配置

  ```js
  const presets = {
  	constent: [],
  	theme: {
  		spacing: {
  			px: '1px',
  			0: '0px',
  			1: '1rpx',
  			2: '2rpx',
  			3: '3rpx'
  			//...
  		},
  		width:({theme})=>({
  			//以函数形式的配置可从一参中获取tw提供的工具函数
  		    ...theme('spacing'),//获取当前配置中的spacing字段
  			'1F2':'50%', //例子这里用`F`替代`/`表示`分之`,
  			'1F3': '33.333333%';
  			'2F3': '66.666666%'
  			//...
  		})
  	},
  };
  ```

- **colors 主题配置**
  tw 提供了[内置调色板],tw 的默认主题配置就是内置调色板,这种配置 css 生成的颜色样式为具体的颜色,如果你要项目适配不同的主题颜色(light,dark),你可以自定义配置为主题变量,在基础样式(base)中定义不同主题的颜色变量即可。

```css
/* base.wxss*/
page {
	--inherit: 'inherit';
	--current: 'currentColor';
	--transparent: 'transparent';
	--black: #000;
	--white: #fff;
	--primary-light: #7dc89b;
	--primary: #18b357;
	--primary-dark: #02722f;
	--bg-dark: #f0f0f0;
	--bg: #f5f5f5;
	--bg-light: #f9f9f9;
	--font-dark: #333;
	--font: #666;
	--font-light: #999;
	--embellish-dark: #f52b0c;
	--embellish: #ff4a2f;
	--embellish: #f2634e;
	--red: #f00;
}

@media (prefers-color-scheme: dark) {
	/* 黑白反转,bg与font反转 */
	page {
		--inherit: 'inherit';
		--current: 'currentColor';
		--transparent: 'transparent';
		--black: #fff;
		--white: #000;
		--primary-light: #7dc89b;
		--primary: #18b357;
		--primary-dark: #02722f;
		--bg-dark: #333;
		--bg: #666;
		--bg-light: #999;
		--font-dark: #f0f0f0;
		--font: #f5f5f5;
		--font-light: #f9f9f9;
		--embellish-dark: #f52b0c;
		--embellish: #ff4a2f;
		--embellish: #f2634e;
		--red: #f00;
	}
}
```

- **自定义插件**
  在默认主题的核心插件不满足编译逻辑时,可通过 plugins 字段配置自定义插件。自定义插件会被`Tailwind CSS IntelliSense`插件感知,在书写工具类时有智能提示。自定义插件配置需要引入 tw 提供的 plugin 函数(引入位置为'tailwindcss/plugin')。plugin 函数要求你传入一个函数,运行时会给函数的一参提供内部 api 使用,在函数内通过 addBase,addComponents,addUtilities 函数加入自定义映射对象。

      ```js
      import plugin from 'tailwindcss/plugin';
      const presets = {
      	constent: [],
      	plugins: [
      		plugin( ({ addBase, addComponents }) => {
      			addBase({
      				view: {
      					'box-sizing': 'border-box',
      					borderWidth: '0', //可写小驼峰最终生成:border-width
      					'border-style': 'solid'
      				},
      				'::before,::after': { lineHeight: '1.25em' },
      				'[class]': { fontSize: '32rpx' }
      			});

      			addComponents({
      				'.ellipsis': {
      					'white-space': 'nowrap',
      					overflow: 'hidden',
      					'text-overflow': 'ellipsis'
      				},
      				'.absolute-full': {
      					position: 'absolute',
      					left: '0',
      					top: '0',
      					width: '100%',
      					height: '100%'
      				}
      			});
      		}),
      		plugin( ({ addUtilities }) => {
      			addUtilities({
      				'.content-auto': {
      					'content-visibility': 'auto'
      				},
      				'.content-hidden': {
      					'content-visibility': 'hidden'
      				},
      				'.content-visible': {
      					'content-visibility': 'visible'
      				}
      			});
      		})
      	]
      };
      ```

  > 注意的是,无论加入到哪层的类选择器样式都只会在命中关键字时才会生成 css。

- **完整的配置文件**

````ts
// tailwind-presets/presets.ts
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
export const presets: Config = {
	/**
	 * @default false
	 * @description 当值为true时 生成的css有 !important 后缀
	 * @test
	 * ```wxml
	 *  <view class="w-10" />
	 * ```
	 * 生成的wxss如下
	 * ```css
	 *  w-10 {
	 * 	  width:10rpx !important;
	 *  }
	 * ```
	 */
	important: false,
	//空合并后无影响
	content: [],
	/**
	 * @description tw在实用hover focus时默认分隔符为:如:<div class=" hover_text-1 focus_text-2" />
	 * 但在小程序中有hover-class属性可自行选择。这里设置为 `_`
	 * @test
	 * ```html
	 * <view class="focus_text-10" hover-class="text-10" />
	 * ```
	 */
	separator: '_',
	/**
	 * @type string[]|{string:boolean}
	 * @link https://tailwindcss.com/docs/configuration#core-plugins
	 * @description 启用哪些内部核心插件。默认的核心插件仅部分适用小程序。类型可为{string:boolean} | [string]
	 */
	 */
	corePlugins:[
	"width",
	"height"
	"zIndex",
	"flex",
	"flexDirection",
	"flexGrow",
	"flexShrink",
	"flexWrap",
	"float",
	"fontFamily",
	"fontSize",
	"fontSmoothing",
	"fontStyle",
	"fontVariantNumeric",
	"fontWeight",
	]
	darkMode: 'media'
};
```

[官方文档]: https://tailwindcss.com/docs/installation
[默认配置]: https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
[接口类型]: https://github.com/tailwindlabs/tailwindcss/blob/master/types/config.d.ts
[核心插件]: https://github.com/tailwindlabs/tailwindcss/blob/master/src/corePlugins.js
[指令]: https://tailwindcss.com/docs/functions-and-directives#tailwind
[功能类优先]: https://tailwindcss.com/docs/utility-first
[预设文件]: https://tailwindcss.com/docs/presets
[内置调色板]: https://tailwindcss.com/docs/customizing-colors
````
