### 小程序组件的单元测试工具 [miniprogram-simulate](https://github.com/wechat-miniprogram/miniprogram-simulate)

> 现在市面上流行的测试框架均可使用，只要它能兼顾 nodejs 端和 dom 环境。因为小程序需要依赖到 nodejs 的一些库来完善测试环境，同时需要 dom 环境建成完整的 dom 树结构，才能更好的模拟自定义组件的运行。例如可以选用 mocha + jsdom 的组合,这里记录与 jest 搭配在 ts 项目中如何使用

> jest 对 ts 文件的编译基于 Babel 7,这导致丢失一些 ts 特性(例如类型检查),所以使用[ts-jest](https://kulshekhar.github.io/ts-jest/).
> 测试小程序项目基于 ewm 插件

1. 安装测试依赖

```bash
npm i -D miniprogram-simulate jest ts-jest @types/jest jest-environment-jsdom ts-node
```

package.json

```json
"devDependencies": {
    "@types/jest": "^29.4.0",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "miniprogram-simulate": "^1.5.9",
    "ts-jest": "^29.0.5",
    "ts-node": "^10.9.1"//仅用于解析jest.config.ts文件
}
```

2. 建立配置文件

```bash
npx ts-jest config:init
```

```ts
/*
 * 配置文档:https://jestjs.io/docs/configuration
 */
import type { Config } from 'jest';
export default {
	clearMocks: true, // 清除上下文
	testEnvironment: 'jsdom',
	// collectCoverage: false,//收集覆盖率
	// coverageDirectory: "coverage", //覆盖率文件目录 collectCoverage为false可忽略
	testMatch: [
		// 测试文件的匹配类型
		'<rootDir>/**/*.test.ts' // 根目录下任何文件夹下的 *.test.ts 文件
	],
	// extensionsToTreatAsEsm: [".ts"],
	moduleNameMapper: {
		ewm: '<rootDir>/miniprogram/miniprogram_npm/ewm'
		// "rfdc":"<rootDir>/miniprogram/miniprogram_npm/rfdc",
	},
	transform: {
		'^.+\\.ts?$': ['ts-jest', {}]
	}
} satisfies Config;
```

3. 测试用例

```html
<!-- Components/child/child.wxml -->
<block wx:if="{{bool}}">
	<view id="mark">mark</view>
	<view class="text-red">红色的字</view>
</block>
```

```ts
// Components/child/child.ts
import { DefineComponent, MainComponent } from 'ewm';
const mainComponent = MainComponent({
	properties: {
		bool: Boolean
	}
});
const child = DefineComponent({
	name: 'child',
	mainComponent
});
export type $Child = typeof child;
```

```html
<!-- Components/demo/demo.wxml -->
<view>
	<text id="computedValue">{{ name }}</text>
	<block wx:if="{{ discount !== 10 }}">
		<text id="discount">{{ discount }}</text>
	</block>
	<child id="child" bool="{{bool}}" />
</view>
```

```ts
// Components/demo/demo.ts
import { PropType, DefineComponent, MainComponent } from 'ewm';
import { type $Child } from './Components/child/child';
export type Goods = {
	name: string;
	price: number;
	discount: number;
};
type Main = typeof mainComponent;
const child = SubComponent<Main, $Child>()({
	data: {
		bool: true
	}
});
const mainComponent = MainComponent({
	properties: {
		goods: Object as PropType<Goods>
	},
	computed: {
		name() {
			return this.data.goods?.name || '';
		},
		discount() {
			return this.data.goods?.discount || 10;
		}
	}
});

const demo = DefineComponent({
	name: 'demo',
	mainComponent,
	subComponents: [child]
});

export type $Demo = typeof demo;
```

```ts
//Components/demo/demo.test.ts
import { sleep, load, render } from 'miniprogram-simulate';
import path from 'path';
import { Goods } from './demo';

describe('测试demo', () => {
	//读取组件
	const id = load(path.resolve(__dirname, 'demo'));
	//渲染组件
	const component = render(id, {
		goods: { name: '可乐', price: 10, discount: 8 } satisfies Goods
	});
	//建立dom页面
	const parent = document.createElement('parent-wrapper');
	//挂载组件
	component.attach(parent);

	test('计算属性值的测试', async () => {
		//因为ewm的计算属性完成在nextTick,所以加sleep
		await sleep(0);
		//获取computedValue组件对象
		const computedValue = component.querySelector('#computedValue');
		expect(computedValue?.dom?.textContent).toBe('可乐');
	});
	test('wx:if值判断', async () => {
		//因为ewm的计算属性完成在nextTick,所以加sleep
		await sleep(0);
		//获取discount组件对象 因为组件是否渲染源自判断(wx:if),所以在所有数据都完成后再获取组件dom,避免出现无法找到dom,从而引起测试失败的情况
		const discount = component.querySelector('#discount');
		expect(discount?.dom?.textContent).toBe('8');
	});
	test('自定义组件child测试', async () => {
		const childComp = component.querySelector('#child');text-red
		expect(childComp.querySelector('#mark')?.dom?.textContent).toBe('mark');
		expect(childComp.querySelector('.text-red')?.dom?.textContent).toBe('aaa');
	});
});
```

5. 注意的问题

> tips `await sleep(0)` 要验证 js 的异步数据时,需要加入,因为 test 是顺序执行,所以前面的 test 加入了,后续就不需要加入了,除非等待时间不同(await sleep(1000)).
> 自定义组件即使是 virtualHost 为 true,也通过虚拟组件传值比如示例中的 child,通过 id="child",获取它的dom树对象.通过得到的vm对象还可以通过querySelector找子组件的vm对象。

### vitest 搭配 miniprogram-simulate

1. 安装依赖

```json
"devDependencies": {
    "jsdom": "^21.1.1",
    "miniprogram-simulate": "^1.5.9",
    "typescript": "^5.0.2",
    "vite": "^4.2.1",
    "vitest": "^0.29.5"
}
```

2. 配置文件

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom'
	}
});
```

> 💡: 当配置 globals 字段值为 true 时, 为保证全局 API 具有类型,需要在 tsconfig 增加类型引用

```json
// tsconfig.json
{
	"compilerOptions": {
		// ...
		"types": ["vitest/globals"]
	}
	// ...
}
```

3. 修改 miniprogram-simulate 源文件(当前版本为"1.5.9")

```js
// path: node_modules\miniprogram-simulate\src\utils.js
// 修改 setNodeJsEnv函数 内容 require(filePath) --> require(filePath + '.ts');
// 修改前
function setNodeJsEnv() {
	env = 'nodejs';
	fs = require('fs');
	compiler = require(compilerName);
	runJs = (filePath) => {
		require(filePath); // 需要修改的部分
		delete require.cache[require.resolve(filePath)];
	};
}
// 修改后
function setNodeJsEnv() {
	env = 'nodejs';
	fs = require('fs');
	compiler = require(compilerName);
	runJs = (filePath) => {
		require(filePath + '.ts'); // 修改的部分
		delete require.cache[require.resolve(filePath)];
	};
}
```

> 💡 不修改时,require(filePath) 加载的可能是 组件目录下的 xxx.json 文件而非.ts(js)文件,造成错误。但在使用 jest 搭配 miniprogram-simulate 测试时无需修改。这问题出现在使用 vitest 时。当前的 miniprogram-simulate 为 1.5.9 版本

3. 测试用例 demo

```html
<!--components/demo/demo.wxml-->

<text id="name">{{ name }}</text>
```

```ts
// components/demo/demo.ts

Component({
	properties: {
		name: String
	}
});
```

```ts
// components/demo/demo.test.ts
import { load, render } from 'miniprogram-simulate';
import path from 'path';

describe('demo', () => {
	// 读取组件
	const id = load(path.resolve(__dirname, 'demo'));
	// mock传入的properties
	const properties = {
		name: 'hry'
	};
	// 渲染组件
	const component = render(id, properties);
	// 建立父节点
	const parent = document.createElement('parent-wrapper');
	// 挂载组件到父节点
	component.attach(parent);
	test('渲染值与传入name值相等', async () => {
		const comp = component.querySelector('#name');
		expect(comp!.dom!.textContent).toBe(properties.name);
	});
});
```

4. [demo 代码片段](https://developers.weixin.qq.com/s/ErAvwSmu7YGb)

5. 总结
   vitest 搭配 ts 和 miniprogram-simulate 配置相对简单,运行较快,可兼容 jest 测试用例。但需要改动 miniprogram-simulate(1.5.9)源码。jest 搭配 ts 配置相对复杂(需要插件 ts-jest)。共同问题是 watch 模式下 wxml 文件改动不会自动运行(或许是我没找到对应的配置)。就说这么多吧,理解不到的地方请指正。
