## tailwindcss 与小程序

css 工程化思想有很多(sass,less,css-in-js...),基于原子类书写思想的 taiwindcss(以下用 tw 代替)风头正盛,去年底 tw3 上线,搭配新的引擎让`just-in-time`模式平稳落地。
tw 的思想和好处这里不在赘述,[官网](https://tailwindcss.com/)介绍的很清楚([tw2 中文官网](https://www.tailwindcss.cn/))。
这篇主要描述下小程序书写 tw 的样子。

### 在小程序中书写 tw

tw3 是即时(实时)生成类样式。tw 会根据您的配置文件,匹配您指定文件中包含的关键字,自动生成对应配置的样式。
在小程序中,只需要在 app.wxss 中引入 tw 生成的样式文件(记得组件中配置 addGlobalClass:true),就不必在书写组件时,关心 wxss 文件了。

1. base

   基础类---预设一些样式

   ```css
   /* wxss */
     page {
       height: 100%;
       line-height: 1.2;
       -webkit-text-size-adjust: 100%;
       font-family: "fontFamily.sans", ui-sans-serif, system-ui"
     }
     [class],
     view,
     image,
     ::before,
     ::after{
       box-sizing: border-box;
       border-width: 0;
       border-style: solid;
       border-color: currentColor;
     }
     /* variables */
     page{
       --color-primary:#22c55e;
       --color-primary-dark: #16a34a;
       /* ... */
     }

     @media (prefers-color-scheme: dark) {
       page {
         --color-primary:#ef4444;
         --color-primary-dark: #dc2626;
         /* ... */
       }
     }
   ```

2. utilities(工具类)
   tw 中最核心的思想(工具类 css,也有叫原子化 css)
   Demo1

   ```html
   <view>
     <text class="text-red text-40 ml-10 px-20 ">
       我的字体颜色是红色,大小为40rpx,左外边距10rpx,内边距x轴20rpx</text
     >
   </view>
   <!-- wxss新增

         .text-red{
           color:red
         },
         .text-40{
           font-size: 40rpx
         },
         .ml-10{
           margin-left:10rpx
         }
         .px-20{
           padding: 0 20rpx
         } 

     -->
   ```

3. components(组件类)
   重复出现的公共原子类,我们可以把他们自定义为组件类(比如下面 Demo3 中的`ellipsis`类)
   Demo2

   ```html
   <view>
     <button
       class="bg-primary hover_bg-primary-dark inline-block w-100 h-60
       whitespace-nowrap overflow-hidden overflow-ellipsis"
     >
       工具类写法--按钮1
     </button>
   </view>

   <view>
     <button class="btn ellipsis">组件类写法--按钮2</button>
   </view>
   <!-- wxss新增
          .bg-primary{
            color:var(--color-primary)
          }
          .hover_bg-primary-dark:hover{
            color:var(--color-primary-dark)
          }
          .inline-block {
            display: inline-block;
          }
          .w-100 {
            width: 100rpx;
          }
          .h-60 {
            height: 60rpx;
          }
          .whitespace-nowrap{
            	white-space: nowrap;
          }
          .overflow-hidden{
            overflow: hidden;
          }
          .overflow-ellipsis{
            text-overflow: ellipsis;
          }
          .btn{ // 组件类
            color:var(--color-primary);
            display: inline-block;
            width: 100rpx;
            height: 60rpx;
          }
          .btn:hover{ // 组件类
            color:var(--color-primary-dark);
          }
          .ellipsis { // 组件类
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
      -->
   ```

不必纠结这么多工具类样式很难记,因为这些类都基于原生样式且可以自定义的,搭配官方插件[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)还可以得到代码提示(小程序编辑器也支持)。

先写这么多,不知道是否有人关注tw在小程序中的应用,下篇预期发具体核心类编译配置,如果您感兴趣请点赞支持。

### 核心思想

- **功能类优先**
  示例 1

  ```css
  .bg-red-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 226, 226, var(--tw-bg-opacity));
  }
  .bg-red-200 {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 202, 202, var(--tw-bg-opacity));
  }

  .bg-red-300 {
    --tw-bg-opacity: 1;
    background-color: rgba(252, 165, 165, var(--tw-bg-opacity));
  }
  ```

示例 2

```html
<div class="bg-red-100">红色100</div>
<div class="bg-red-200">红色100</div>
<div class="bg-red-300">红色100</div>
```

示例 1 就是 tw 默认配置下生成的功能类(背景色)一部分,示例 2 在书写 css 时候直接书写功能类类名就可以了。这就是 tw 的核心思想写法。

> 默认配置生成的 css 中 包含字符 `*`和`\` 小程序不允许 通过插件把转换 `*`为`page` `\`自定义

配置

- **响应式设计**
  tw 默认配置了 5 个断点并允许你自定义。(默认连接符是 `:`)

  | 断点前缀 |  最小宽度  |                CSS                 |
  | :--: | :----: | :--------------------------------: |
  |  sm  | 640px  | @media (min-width: 640px) { ... }  |
  |  md  | 768px  | @media (min-width: 768px) { ... }  |
  |  lg  | 1024px | @media (min-width: 1024px) { ... } |
  |  xl  | 1280px | @media (min-width: 1280px) { ... } |
  | 2xl  | 1536px | @media (min-width: 1536px) { ... } |

  ```css
  /* 部分源码 */
  @media (min-width: 768px) {
    /* ... */
    .md\:w-32 {
      width: 8rem;
    }
    /* ... */
  @media (min-width: 640px) {
    /* ... */
    .lg\:w-48 {
      width: 12rem;
    }
    /* ... */
  }
  /*...*/
  ```

  ```html
  <img class="w-16 md:w-32 lg:w-48" src="..." />
  ```

  tw 通过`断点名`+`:`的形式在 html 中书写类名,css 中通过转义符`\`对`:`转移以匹配类名。由于小程序 wxss 类名中不支持除了 `-`和`_`的特殊字符,需要配置中修改连接符

  比如 tw 默认书写 `<div class="md:bg-red-100">TW</div>` 小程序书写为 `<view class="md_bg-red-100">TW</view>`

  适配平板时可以考虑开启此核心功能。

- **悬停、焦点和其他状态**

  hover 示例
  示例 3

  ```html
  <button class="bg-green-500 hover:bg-green-700 active:bg-green-900">
    Hover me
  </button>

  <input class="focus:bg-green-500 " />
  ```

  ```css
  /* button */
  .bg-green-500 {
    --tw-bg-opacity: 1;
    background-color: rgba(16, 185, 129, var(--tw-bg-opacity));
  }
  .hover\:bg-green-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(185, 28, 28, var(--tw-bg-opacity));
  }
  .active\:bg-green-900:active {
    --tw-bg-opacity: 1;
    background-color: rgba(6, 78, 59, var(--tw-bg-opacity));
  }

  /* impute */
  .focus\:bg-green-500:focus {
    --tw-bg-opacity: 1;
    background-color: rgba(254, 226, 226, var(--tw-bg-opacity));
  }
  ```

  tw 为了考虑默认 css 大小,默认配置只开启了一些常用的变体行为,如示例 3 默认情况下`hover:` 和 `focus:` 可以使用,`active:`是需要在配置中开启的。

  ```js
  module.exports = {
  	variants: {
  		extend: {
  			backgroundColor: ["active"], // 为background-color生成 active:前缀和:active后缀
  		},
  	},
  	// content: [],
  	// theme: {
  	//   extend: {},
  	// },
  	// plugins: [],
  };
  ```

  还有一些状态类,如 `Group-focus`、`Focus-within`、`Focus-visible`用到时候在说

  已知小程序支持的选择器有`:hover` 、`:active` 但编译时还要处理转义符 `\`问题。
  在小程序中 由于存在 hover-class 的方式书写 hover 类 所以配置 tw 不生成悬停等类名也可以实现 hover 效果。而且生成模式下 hover-class 中的类名也会被 tw 检出。

### tailwind3.3.0存在的问题

