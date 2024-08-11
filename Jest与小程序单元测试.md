### 小程序单元测试文档[miniprogram-simulate](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/unit-test.html)

### jest(ts-jest)搭配 miniprogram-simulate

```js
//<!-- /components/index.wmxl -->
<view class="index">{{prop}}</view>

// /components/index.js
Component({
  properties: {
    prop: {
      type: String,
      value: 'index.properties'
    },
  },
})
/* /components/index.wxss */
.index {
  color: green;
}
```

```js
const simulate = require("miniprogram-simulate");

test("components/index", () => {
	const id = simulate.load("/components/index"); // 此处必须传入绝对路径
	const comp = simulate.render(id); // 渲染成自定义组件树实例

	const parent = document.createElement("parent-wrapper"); // 创建父亲节点
	comp.attach(parent); // attach 到父亲节点上，此时会触发自定义组件的 attached 钩子

	const view = comp.querySelector(".index"); // 获取子组件 view
	expect(view.dom.innerHTML).toBe("index.properties"); // 测试渲染结果
	expect(window.getComputedStyle(view.dom).color).toBe("green"); // 测试渲染结果
});
```

1. 依赖安装

```json
"devDependencies": {
  "@types/jest": "^29.5.0", //类型
  "jest": "^29.5.0",
  "jest-environment-jsdom": "^29.5.0", //jsdom环境
  "miniprogram-simulate": "^1.5.9",//官方组件渲染
  "ts-jest": "^29.1.0" // ts支持
},
```

2. 配置文件

```ts
import type { Config } from '@jest/types';
export default {
	clearMocks: true, //每次测试前自动清除模拟调用、实例、上下文和结果
	testEnvironment: 'jsdom', //测试环境
	collectCoverage: false, //覆盖率报告
	coverageDirectory: 'coverage',
	testMatch: ['<rootDir>/**/*.test.ts'],
	transform: { 
		'\\.ts?$': 'ts-jest' // 添加的 @commitlint/cli @commitlint/load
	}
} satisfies Config.InitialOptions;
```

3. 测试demo(官方demo修改为ESM)

```ts
import simulate from "miniprogram-simulate";
import path from "path";

test("components/index", () => {
	const id = simulate.load(path.resolve(__dirname, "../index")); // 此处必须传入绝对路径
	const comp = simulate.render(id); // 渲染成自定义组件树实例

	const parent = document.createElement("parent-wrapper"); // 创建父亲节点
	comp.attach(parent); // attach 到父亲节点上，此时会触发自定义组件的 attached 钩子
	console.log(comp);
	const view = comp.querySelector(".index"); // 获取子组件 view

	expect(view!.dom!.innerHTML).toBe("index.properties"); // 测试渲染结果
	expect(window.getComputedStyle(view!.dom!).color).toBe("green"); // 测试渲染结果
});
```

4. 运行测试

```package.json
{
    script:{
            "test": "jest",
            "test:watch": "jest --watch",
    }
}
```

### 一些坑

<!-- 1. 当测试中访问了 带有集成的类时，获取不到数据

2. 目录中文件 .json .wxss .js(ts) .wxss(非必须)

3. 添加全局函数

```ts
const wx = ((global as any).wx ||= {});
wx.nextTick = function (callback: () => void) {
	setTimeout(() => {
		callback();
	}, 0);
};
``` -->

### 测试示例

1. spyOn监控console对象的warn方法输出内容

```ts
test("计算属性依赖字段值为undefined", () => {
	const spy = jest.spyOn(console, "warn");
	const message = "输出123";
	console.warn(message);
	expect(spy).toHaveBeenCalledWith(message);
});
```
