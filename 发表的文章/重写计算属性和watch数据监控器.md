### 前言

一直在用[官方]插件 miniprogram-computed(当前版本 4.3.8).
细读源码发现一些性能问题,这才有了重写的念头。在这个做个记录贴,欢迎讨论。

### 计算属性的源码分析

1. 初始化时机
   源码截图
   ![](https://mmbiz.qpic.cn/mmbiz_png/8HPupW2e3TG1OueeQEb6ia4ma2XJBf3Lr6GvoAUPSjHNXQ9Sjj6mlfh73pZ3bgiadc1PbdjYRNPYUE492DQx4m3Q/0?wx_fmt=png)
   官方在组件 attached 周期会对配置中 computed 字段做初始化。
   在首屏渲染时,有计算属性的组件都会运行一次 attached 周期,项目中不乏有大量复用的组件或计算属性较多的组件。这显然对首屏渲染速度不是很友好。

   解决思路:在[beforeCreated]周期做初始化,每个组件的计算属性的初始化值只需计算一次,不必担心复用带来的性能问题。

2. 计算属性更新器(computedUpdaters)

   源码截取

   ```ts
   if (computedDef) {
   	observersItems.push({
   		fields: "**",
   		observer(this: BehaviorExtend) {
   			if (!this._computedWatchInfo) return;
   			const computedWatchInfo = this._computedWatchInfo[computedWatchDefId];
   			if (!computedWatchInfo) return;
   			let changed: boolean;
   			do {
   				changed = computedWatchInfo.computedUpdaters.some((func) =>
   					func.call(this)
   				);
   			} while (changed);
   		},
   	});
   }
   ```

   官方初始化计算属性时会在 observers 字段内中添加'\*\*' 字段,在其中循环调用 computedUpdaters 函数,每次会拿出所有缓存中所有计算属性的关联字段,循环对比缓存值和当前实例的新值。来判断是否需要重新初始化对应的计算字段,需要的话, setData对应计算属性新值(不会立即运行,会被收集), 把新的关联和值替换旧的缓存,进入下一次do while循环,直到没有关联的计算属性需要更新后,setData此次do while收集的所有更新的计算字段。这会再一次触发 observers'\*\*' 整体循环。
   <br>
   性能问题。
   1. 计算属性更新后,会再此触发 observers '\*\*'进行一次无意义的 计算属性更新器运行(新旧值检测)。
   2. observers监控很敏感 即使数据没有改变,也会触发计算属性更新器运行。
   3. 即使this.setData 无关计算属性的字段,也会触发计算属性更新器运行。
   4. 若计算属性依赖properties字段且字段类型为对象,那么由于小程序的组件由内而外挂载数据,后代组件会可能接受n多次的 null 或者 空对象{},这都会引起计算属性 计算属性更新器运行毫无意义。

   <br>

   解决思路:劫持 setData,获取到当前 setData 的配置对象,若有字段关联了 计算属性 则更新对应的计算属性(A),若有计算属性B依赖A,再更新B... , 所有计算属性更新验证完毕后,把劫持的的setData配置对象加入需要更新的计算属性字段 一起做一次setData。properties 字段在初始化计算属性时([beforeCreated]周期中),为被计算属性关联的字段加入 observer 函数,针对对象可设置当传入null和空对象直接返回,否则比对新旧值,不同的话收集,全部 关联的properties 都收集完后 统一触发 计算属性更新。

   <br>

3. 关联的路径

   源码

   ```ts
   const wrapData = (
   	data: unknown,
   	relatedPathValues: Array<IRelatedPathValue>,
   	basePath: Array<string>,
   ) => {
   	if (typeof data !== "object" || data === null) return data;
   	const handler = {
   		get(obj: unknown, key: string) {
   			if (key === "__rawObject__") return obj;
   			let keyWrapper = null;
   			const keyPath = basePath.concat(key);
   			const value = obj[key];
   			relatedPathValues.push({
   				path: keyPath,
   				value,
   			});
   			keyWrapper = wrapData(value, relatedPathValues, keyPath);
   			return keyWrapper;
   		},
   	};
   	try {
   		return new Proxy(data, handler);
   	} catch (e) {
   		return new ProxyPolyfill(data, handler);
   	}
   };
   ```

   示例 A

   ```ts
   Component({
   	data: {
   		productInfo: {
   			id: "001",
   			selectedCount: 0,
   			discount: 9,
   			originalPrice: 10,
   		},
   	},
   	computed: {
   		realPrice(data) {
   			return (
   				(data.productInfo.originalPrice * data.productInfo.discount) / 10
   			);
   		},
   		// ...
   	},
   	// ...
   });
   ```

   示例 A 中,官方生成的 realPrice 缓存依赖相关路径为:
   ![](https://mmbiz.qpic.cn/mmbiz_png/8HPupW2e3TG1OueeQEb6ia4ma2XJBf3LrYwNX3rzQiblXKFDpypXeFAKxh4zqj0gBTTaxREEexy12VDguPJu7NCg/0?wx_fmt=png)

   图中可以看出 0 和 2 重复,且这两项不是真正的关联依赖。会导致 50%的性能浪费(二段对象依赖如示例),如果是三段对象依赖会浪费 2/3 的性能...,而且会导致一些情况发生,比如更新的是 `productInfo.selectedCount` 有可能会匹配上这个计算属性导致这个缓存重做,而实际上是没有意义的,浪费更多性能。

   解决办法:

   ```ts
   const handler = {
   	get(obj: unknown, key: string) {
   		if (key === "__rawObject__") return obj;
   		let keyWrapper = null;
   		const keyPath = basePath.concat(key);
   		const value = obj[key];
   		// 去除关联的上一个路径 只要最后一个路径
   		if (basePath.length !== 0) {
   			relatedPathValues.pop();
   		}

   		relatedPathValues.push({
   			path: keyPath,
   			value,
   		});
   		keyWrapper = wrapData(value, relatedPathValues, keyPath);
   		return keyWrapper;
   	},
   };
   ```

   ![](https://mmbiz.qpic.cn/mmbiz_png/8HPupW2e3TG1OueeQEb6ia4ma2XJBf3LrHZ8gkVib9raGKzGJbibIpibm0u8CUnTkICMTFgWTpu1U81nkGAcr6icicpg/0?wx_fmt=png)

   很遗憾的时,使用proxy劫持get函数得到的关联路径是不准确的。因为无法对一些方法返回字段做proxy代理。如下
   ```ts
   data:{
     bool:false,
     list:[1,2,3,4,5]
   },
   computed:{
     listOther(){
       const bool = this.data.bool
       const list = this.data.list.slice() // 得到的list 是无法被prxoy代理的
       if(bool){
          list.splice(2) ///无法获取依赖
          return list 
       }else{
        return  list[4] //无法获取依赖  
       }
     }
   }
   ```
   即使传入克隆的this.data(为了减少一些方法的使用) 也无法保证获取到正确的关联字段。看了其他正则收集依赖等思路都有问题存在。如果您更好收集路径的办法,请留言告诉我。
   所以官方和重写的计算属性当前都存在无法避免的性能浪费。特别是计算属性依赖数组时,很有可能做无意义的触发计算属性更新。很遗憾。

### watch 监控器源码分析

1. 初始化
   [官方]watch 在 created 周期对配置中 watch 字段做了初始化, 如下图:
   ![ ](https://mmbiz.qpic.cn/mmbiz_png/8HPupW2e3TErDOfIaczWLBFwUib7TtDeT5IqRiaocGY5QWYMnU5z5fa1BPOyNUJWuX952M4qXvEGYKZ1ib2HwQf5g/0?wx_fmt=png)
   主要是生成第一次监控字段的值,缓存起来用于后续比对。
   之后会在把每个字段加入到 observers 字段下
2. 触发
   当 observers 对应字段触发时,watch 劫持函数通过对比当前值和旧值(缓存中)是否相等(===)或者严格相等(深度比较)来决定是否触发 watch 对应的函数。触发情况下,会对缓存值更新。
   需要注意的时避免在 watch 函数中使用 setData 触发可能引起自身 watch 字段变换的值。会循环触发,监控函数递归,内存泄露。

3. 已知的不足。

   1. 对 properties 对象类型字段监控时,如果传入的是异步数据,那么在子组件 attach 阶段获取到的数据为"null",一样会触发 watch 的监控。
      示例 C

   ```js
   // 页面 wxml
   <product-item attach productInfo="{{productInfo}}" />;
   // 页面 js
   Component({
   	methods: {
   		onLoad() {
   			console.log("onLoad");
   			// 模拟异步获取数据
   			setTimeout(() => {
   				console.log("异步数据获取成功");
   				this.setData({
   					productInfo: {
   						id: "001",
   						name: "可乐",
   						selectedCount: 0,
   						originalPrice: 10,
   						discount: 5,
   					},
   				});
   			}, 1000);
   		},
   	},
   });
   // product-item js
   Component({
   	properties: {
   		productInfo: Object,
   		// type productInfo = {id:string;name:string;selectedCount:number;originalPrice:number;discount:number}
   	},
   	computed: {
   		realPrice(data) {
   			return data.productInfo?.originalPrice
   				|| 0 * data.productInfo?.discount || 0 / 10;
   		},
   		selectedCount(data) {
   			return data.productInfo?.selectedCount || 0;
   		},
   	},
   	lifetimes: {
   		attach() {
   			console.log(`attach时productInfo的值为${this.data.productInfo}`);
   		},
   	},
   	watch: {
   		productInfo() {
   			// 在created初始化时缓存val为null,在attach时因为页面异步数据未到达,productInfo为undefined强转为null,监控触发。
   		},
   		"productInfo.selectedCount"() { // 避免这么写。
   			// 报错 TypeError: Cannot read property 'selectedCount' of null
   		},
   		"realPrice,selectedCount"() {
   			console.log("realPrice或selectedCount发生改变");
   		},
   	},
   });
   ```

   或许你会说使用"\*\*"啊,那么如果对象有默认值的情况呢?同样会触发导致
   watch 下的"productInfo.selectedCount"字段报错。是由于强转带来的后果(最讨厌的黄字提醒)。从根本上来说是生命周期顺序引起的。回顾下组件加载顺序
   `beforeCreate --> created-->attach -->attached` 其中 attach 周期时 即获取父组件properties的传值可以触发 observers 字段,且 setData 数据是有效的。
   解决思路:watch 劫持函数监控到值为 null 时不触发 watch 函数 更好的办法时 不要对properties中对象字段的子字段做watch处理。

   2. 由于监控器生效在 created 之后(attach 周期就可以触发),而计算属性生效在 attached 周期。如果 watch 字段监控了计算属性,那么在 attached 周期后,watch 会得到计算属性的'无意义'的触发。有人提了 issue #58 官方也做了"修复"。

   官方在 computed 初始化的时候,给计算属性关联字段做了个 mark("\_triggerFromComputedAttached"=true)。
   ![](https://mmbiz.qpic.cn/mmbiz_png/8HPupW2e3TFpzFLjME4kWNyo6r94DDCCiaCOa4Fib7Dmb1Dz4zyE77BgaiaNx62gDJEWYvzu2ELQDmzBXkETxxFbw/0?wx_fmt=png)

   observers 在监控到 comupted 字段改变时,会判断是否为第一次触发(\_triggerFromComputedAttached===true),是的话不许触发 watch 缓存更新和调用 watch 字段函数,把 mark 字段变为 false。
   ![](https://mmbiz.qpic.cn/mmbiz_png/8HPupW2e3TFpzFLjME4kWNyo6r94DDCCzMcD5panP0yTRdprMvnLStk3HAFuwqKXDicjUIcPXgVtWsxSy5qkmFw/0?wx_fmt=png)
   但忽略一个问题 如上面 示例 C 中 watch 字段 "realPrice,selectedCount"不会 1 秒后被触发,但显然他们的值改变了。原因就在 mark 的判断上。因为在第一次 mark 判断时没有对所有字段的 mark 做 false 处理。导致触发时,因为 watch 字段上后面的字段还存在 mark 为 true 的情况。导致整个字段跳过。示例 C 中之所以不触发是因为 selectedCount 字段的 mark 还存在,被误认为第一次触发。而如果只是单独监控一个字段。那么都会被触发。
   解决思路:在 watch 判断计算属性是否为第一次触发时,把整个 watch 字段关联的 mark 都设置为 false。而不是设置第一个后就跳出。

### 重写后的功能实现

1. 解决上面已知问题。
2. computed 和 watch 都在 beforeCreate(主要的) 和 created(辅助的) 周期完成。不涉及 attached 周期,提高效率。
3. computed 改用 this获取data,取消参数传值。主要考虑是 ts 类型可以实现彼此调用提示。当前官方通过参数传值,无法获取其他计算字段的类型提示(ts 的泛型机制问题),this 只提供 data 字段,不喜欢可以自己改为全 this 字段。
4. watch 若监控的是对象或对象子属性时,若新值为null或空对象,不报错,不触发watch, 增加偶数位参数为前一参数的旧值。去除'\*\*',新旧值比较为JSON.stringify。只支持单字段触发(多字段不常用,且可替代,主要为了ts类型性能考虑)
5. 对响应式数据的支持(非官方,新方案)
   <br>
   示例 D

```js
  import { observable, runInAction } from "mobx"; //基于mobx最新版本
  const counter = observable({
          count: 1,
        });    
  setInterval(() => {
    runInAction(() => {
      store.age ++
    });
  }, 1000);

  Component({
    properties:{
      productInfo:Object
      //type:{id:string;name:string;selectedCount:number;originalPrice:number;discount:number}
    },
    data:{
      // 传入响应式数据(新的响应式数据方案)
      responsiveCounter:()=>counter.count
    }
    computed:{
      realPrice(){
        return this.data.productInfo?.originalPrice || 0 * this.data.productInfo?.discount || 0  / 10
      },
      selectedCount(){
        return this.data.productInfo?.selectedCount
      },
      count(){ //支持计算响应式数据
        return this.data.responsiveCounter + 1
      }
    },
    watch:{
      //productInfo为null 或 {} 不报错 不触发
      "productInfo"(newVal,oldVal){
          newVal;
          oldVal;
      },
      //productInfo为null 或 {} 不报错 不触发
      "productInfo.originalPrice"(newVal,oldVal){
          newVal;
          oldVal;
      }
      //对计算属性watch
      "realPrice"(realPriceNewVal,realPriceOldVal){
        //...
      }
    }
  })
```

[代码片段](https://developers.weixin.qq.com/s/or4pp7mP7HAv)
这个计算属性和watch在不断的迭代中
最新behavior[查看源码](https://e.gitee.com/panjinhry/projects/348593/repos/panjinhry/ewm/tree/develop/src/behaviors/computedAndWatch/src)

欢迎留言讨论,指错,如果此文对你有帮助,请点赞支持。

[官方]: https://github.com/wechat-miniprogram/computed
[beforecreated]: https://developers.weixin.qq.com/community/develop/article/doc/00060ca79f005034860edea3156813
