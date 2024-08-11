# 袁进老师 TS 课程笔记 {ignore=true}

[toc]

# **一、概述**

## js 语言的问题

- 使用了不存在的变量，函数，成员方法 (比如写错变量名 函数名 方法名)
- 把一个不确定的类型当作一个确定的类型处理 (因为没有类型约束，变量可以是任何类型导致)
- 存在使用 null 或 undefiend 的成员风险(调用函数的返回值有可能是 null 或 undefined 时候，调用其内部方法可能导致错误)
- js 的原罪
  1. js 是半个月完成的语言，设计之初不是为大型项目做的。
  2. 是弱类型(变量可以赋值任何类型)
  3. 解释性语言(只有在运行时才能知道他的错误)
  4. js 开发会导致大部分时间都在排错(浪费时间)

## ts 语言的特点

    TypeScript是JS的超集，是一个可选的，静态的类型系统，解释性语言

1. JS 的超集
2. 静态的 类型检查发生在编译阶段 类型错误会被报出 不参与运行时
3. 解释性 tsc:编译 TS 文件为 JS 文件

## TS 的常识

1. 2012 年微软发布的
2. 开源的
3. 官网 : https://www.typescriptlang.org/
4. 中文网: https://www.tslang.cn/ 不准确
5. 为面向对象思想提供更好的支持 因为有了类型检查

# **二、在 node 中搭建 ts 开发坏境**

## 安装 typescript

1. 安装 TypeScript
   `npm i -g typescript`
2. 编译 tsc 文件名.ts(无 tsconfig.json 情况下需要制定文件，不指定文件就会在 tsconfig.json 配置文件中找设置了)
3. 默认环境是 dom(无 tsconfig.json)
4. 编译目标代码是 es3
5. ts 代码中没有模块化语句(import,export),便认为代码是全局执行
6. 使用配置文件来更改编译选项(推荐)

## ts 的配置文件(tsconfig.json)

1. 手动建立一个 tsconfig.json
2. 命令行运行 `tsc --init`

```json
{
  // 更多compilerOption参照 https://www.tslang.cn/docs/handbook/compiler-options.html
  "compilerOption": {
    // 编译选项
    "target": "es2016", // 编译目标版本 默认es3 node默认es2016
    "module": "es6", // 编译结果中的模块化标准
    "lib": ["es2016"], // 当前环境 默认dom，没有node坏境console都会报错因为console是环境全局变量 需要安装第三方库@types/node，@types是官方库，包含了很多不是ts写的第三方库的类型声明文件，如果要在ts中使用这些第三方js开发的库，比如jquery，我们要在ts中使用它，我们就需要安装@types/jquery库 它实际上就是描述jquery库的类型声明文件 如果要使用node环境，就需要安装@types/node 这样就可以使用node环境的变量，比如console 在小程序也有环境变量 所以要加入声明文件，因为微软@types里面没有，所以要加入小程序环境变量(比如wx.xxx),需要在下面配置中
    "typeRoots": ["./typings"], // 拓展的声明文件位置，这里写的是小程序声明文件位置
    "outDir": "./dist", // 编译输出文件的目录位置
    "strictNullChecks": true, // 取消空类型能赋给任意类型，只能给自己，但是undefined 可以赋给void
    "noEmitOnError": true, // 当有错误的时候不编译
    "moduleResolution": "node", // 模块解析策略
    "noImplicitUseStrict": true, // 不显示上方的"use strict"
    "noImplicitAny": true, // 开启对隐士any类型额严格检查，隐士的any将报错
    "noImplicitThis": true, // this类型不可以是隐式any
    "experimentalDecorators": true, // 实验性装饰器
    "allowJs": true
  },
  "include": ["./src"], // 编译原*.ts目录 默认是所有更目录下 “*/**/*.ts”
  "files": ["./src/index.ts"] // 编译文件位置 和上面同意思 这里是指定了文件
}
```

## 使用第三方库简化流程

- 默认情况下我们需要运行 tsc 编译，然后在 node xxx.js 运行 js 代码，这样很不方便
- 使用第三方库优化

  1. ts-node 库 : 将 ts 代码在内存中完成编译并运行,而无需编译出 js 文件在去运行，省去编译文件的过程
     1） 安装 `npm i -g ts-node` 全局安装才能使用 ts-node 命令 2) 运行 ```ts-node src/index.ts

  2. nodemon 库 : 用于监控文件变化，同时可以运行文件 默认监控全目录
     1） 安装 `npm i -g nodemon` 2) 执行 `nodemon --watch src -e ts --exec ts-node src/index.ts` 意思是监控当前更目录下所有文件变化，有变化就执行 ts-node src/index.ts,但是这样监控了太多文件，可以只用参数 -e ts 来指定监控的文件根目录下的.ts 文件。但还是多监控了，因为根目录下的所有 ts 文件都被监控了，如果想指定监控目录可以通过参数 --watch src 来指定只监控 src 目录下的 ts 文件

- 当 powershell 中执行 tsc 时提示 `因为在此系统中禁止执行脚本。有关详细信息，请参阅 "get-help about_signing"`可使用命令解禁

## 模块化

1.

# **三、基本类型**

## 如何进行类型约束

1. 约束对象 变量、函数的参数、函数的返回值
2. 在约束的位置 加上`:类型`
3. 具体写法

- 基本类型

```js
let num: number = 18;
let str: string = "20";
let bool: boolean = true;
```

- 约束数组

```js
let arr: any[] = []; //不够约束，因为内容是any
let arr: number[] = []; //每项是number
let arr: string[] = []; //每项是字符串
```

- 对象的约束 (不够约束，一般不这么用，一般和接口或类型别名联用，之后再深入说)

```js
let obj: object = {}; //有问题,因为object包含了数组[],对象{},和函数function(){},不够约束
obj = []; //不报错的
obj = {}; //不报错的
obj = function () {}; //不报错的
```

- 约束函数(参数和返回值)void 、never

```js
function test(a: string): void {
  console.log(a);
  //无return值
} //函数结束无返回值用void
function test(a: string[] = ["1", "2"]): string[] {
  console.log(a);
  return a;
} //默认变量复制同js一样
function throwError(msg: string): never {
  throw new Error(msg);
} //函数不会停止一般报错函数用
function printValues(obj: object) {
  const vals = Object.values(obj);
  console.log(vals);
}
printValues({
  name: "zhao",
  age: 19,
});
```

4. 由于 ts 中的函数名不可以重新赋值，所以可以通过 F2 来改变一个函数名(变量也一样) 从而自动改变所有原先的名字
5. F12 转到定义
6. 类型推导 没有推导出来的变量名 下面有... 三个小点， 这个时候可能需要手动约束类型了
   > 小知识: 如何来判断变量应该是字符串还是数字呢?? 根据读法 读成数字就是数字，反之字符串，老师的说法 比如手机号应该是字符串

- undefined 、null (无开启 strictNullChecks 是任何子集,开启后 null 只能赋给自己，undefined 能自己和 void)

1. undefined 和 null 被认作是所有类型的子集，所以它们可以约束任何类型(开启严格类型检查会失效)

```js
let arr: number[] = undefined; //不报错 当未开启严格类型检查时  "strictNullChecks": false,
let arr1: string[] = null; //报错 开启严格检查时  "strictNullChecks": true,
let arr1: string[] | undefined = undefined; //这样可以，因为是联合类型，看下面
```

2. 不常用情况 undefined 可以给 void 赋值 (开启严格空检查)

```js
function test(a: string, b: string): void {
  console.log(a + b);
}
let aaa: void = test("1", "2");
let aaa: void = null; //报错 null不能赋值给void类型
let aaa: void = undefined; //不会报错
```

## 联合类型约束 或符号 |

```js
let name: string | undefined;
let arr: number[] | string[] = [];
let arr: (number | string)[] = ["1", 2];
```

## 元组类型 Tuple (偶尔也有用)

```js
let arr:[string,number]:[]
```

## 字面量约束 (了解，不可以用它,很少用)

```js
let gender: "男" | "女";
gender = "男"; //ok
gender = "女"; //ok
```

## any 类型 (有时候为了绕过检查选择用一下，有隐患的)

```js 例子不太好
let name: any = 123;
let num: string = name; //不会报错 因为any可以复制给任何类型
```

## 类型别名 type (alias) 类型变量

1. 类型别名不会出现在编译结果当中，好比把一些字面量约束变成变量

```js
type Gender = '男' |'女'
let gender:Gender = '男'
gender = '女'
type User = {
    name:string
    id:string
    age:number
    gender:'男'|'女'
}
const user:User = {
    name:'zhao',
    id:'1110011',
    age:18,
    gender:'男'
}
```

## 函数重载

    在函数实现之前，对函数调用的多种情况进行声明

```js
    function combine(a:number,b:number);
    function combine(a:string,b:string);
    function combine(a:number|string,b:number|string):number|string{
        if(typeof a === "number" && typeof b === "number"){
            return a * b
        }
        else if(typeof a ==="string" && typeof b === "string"){
            return a + b

        }
        throw new Error('参数a和b必须为相同类型')
    }

    let result = combine(11,22)//ok
    let result1 = combine("11","22")//ok
    let result2 = combine(11,"22")//报错
```

## 可选参数 ? 没有输入默认 undefined，虽然表面看和赋默认值 undefined 一样，但是开启了 null 检查后，赋 undefined 会报错，所以多用?吧 不怕在 strictNullCheck = true 下

    在参数后面加上?既可以表示是可选参数，但如果是函数参数，一定要是最后或者后面也是可选的参数才可以

```js
function sum(a: number, b: number, c?: number): number {
  if (c) {
    return a + b + c;
  } else {
    return a + b;
  }
}
let result = sum(10, 20, 30);
```

## 扑克牌小练习

    目标：创建一副扑克牌(不包括大小王)，打印扑克牌

```js
```

# **四、枚举类型**

## 枚举类型 enum (enumerable)

1. 写法

```js
enum Gender { //类型别名有=号 这里没有
    male = '男',//类型别名无真实值
    remale = '女'
}
let gender:Gender; //表示变量gender是枚举Gender中的一个属性值
gender = Gender.male //只可以是Gender下的属性 其他会报错
```

2. 相比较基本类型 枚举类型可以动态使用 因为会出现在编译结果中,就是一个对象

```js
 enum Gender {
    male = '男',
    remale = '女'
}
let gender:Gender = Gender.male
gender = Gender.remale
```

3. 一般情况下枚举值全部为数字或字符串，不会出现混用情况，那将失去意义

4. 属性是数字类型的枚举,值和属性名互为值的

```js
 enum Level {
    level0,//如果不写值 又是第一个属性，默认值为number 0
    level1,//如果不写值 默认由上面数字递增 这里应该是number 1
    level2 = 10 //
}
let level0 = Level.level0 //0
let prop= level[Level.level0]//'level0'
console.log(level0,prop,Level.level1) //0 'level0' 1
```

5. 枚举的好处
   把逻辑值和真实值分开，使用逻辑值表示真实值，这样以后改真实值，只需要改定义的地方就可以了，太好了！
6. 扑克牌例子

```js
type pai = {
    huase: Color
    paimian: Mark
}
type Poker = pai[]
enum Color {
    hongtao = '♥',
    heitao = '♠',
    fangpian = '♦',
    meihua = '♣'
}
enum Mark {
    'one' = 'A',
    'two' = '2',
    'three' = '3',
    'four' = '4',
    'five' = '5',
    'six' = '6',
    'sever' = '7',
    'eight' = '8',
    'nine' = '9',
    'ten' = '10',
    'jack' = 'J',
    'queen' = 'Q',
    'king' = 'K'
}
function creatPoker(): Poker {
    let poker: Poker = [];
    let color = Object.values(Color)
    let mark = Object.values(Mark)
    color.forEach(huase => {
        mark.forEach(paimian => {
            let obj: pai = {
                huase,
                paimian,
            }
            poker.push(obj)
        })
    })
    return poker
}
function printPoker(pok: Poker): void {
    let str: string = '\n';
    pok.forEach((ele, i) => {
        str += ele.huase + ele.paimian + '\t'
        if ((i + 1) % 6 === 0) {
            str += '\n'
        }
    })
    console.log(str)
}
let pok = creatPoker()
printPoker(pok)
```

# **五、模块化**

## ts 中的模块化

1. 就使用 es6 的模块化标准
2. 自动提示前提是导出模块不是 module default{}模式
3. 不要加后缀名字，因为编译后输出的文件为 js,其实不认识.ts 文件
4. 如果在 tsconfig.json 里面配置了"removeComments":true,那么 ts 中的注释不会编译到 js 文件中
5. 如果编译结果的模块化标准是 es6，那么没有区别
6. 如果编译结果是 commonjs 那么导出的声明会变成 exports 的属性，默认导出会变成 exorts 的 default 属性
7. 一些 node 下的模块如 fs 不是 es6 标准导出的模块，导入时要用 {属性}导入或\* as 'xxx'的方式

```js
// 导入
import { readFileSync } from "fs";
// 使用
readFileSync("...");
// 导入
import * as fs from "fs";
// 使用
fs.readFileSync("...");
```

8. 如果非要使用 import fs from 'fs'这种方式，需要在 tsconfig.json 里面配置 esModuleInterop:true,不推荐这么用,编译结果会生产辅助函数
9. 模块解析策略
   - classic 经典策略
   - node mode 解析策略(ts 变 js)
     1. 相对路径 ./
     2. 非相对路径 找模块 一步一步向上找

# **六、接口和类型兼容性**

## 接口 interface

1. 和类型别名(alias)的写法区别 少一个等号

```js
    //alias写法
    type user = {
       name:string
       age:number
       sayHello():void //约束方法es6写法
       print:()=>void// 约束方法es5写法
    }
       //接口的写法
    interface user {
       name:string
       age:number
        sayHello():void //约束方法es6写法
       print:()=>void// 约束方法es5写法
    }
     //alias写法 约束单独的函数
    type Callback = { //alias 大括号没有成员名 那么大括号好比定界附 相当于这么写 type Callback = (n:number)=>boolean
        (n: number): boolean
    }
    interface Callback1 { //接口这么写
        (n: number): boolean
    }

    function sum(n: number[], callback: Callback1 | Callback) {
        let num: number = 0
        n.forEach(ele => {
            if (callback(ele)) {
                num += ele
            }
        })
        console.log(num)
    }
    sum([1, 2, 3, 4], (n) => n % 2 > 0)
```

2. 通过 extends 继承，达到多个接口组合的目的

```js
//接口的写法
interface A {
  num: number;
}
interface B {
  str: string;
}
interface C extends A, B {
  bool: boolean;
}
const obj: C = {
  // c里面必须有A和B中的所有属性
  num: 19,
  str: "zhao",
  bool: true,
};
//类型别名的写法
type A = {
  num: number,
};
type B = {
  str: string,
};
type C = {
  bool: boolean,
} & A &
  B;
const obj: C = {
  num: 19,
  str: "zhao",
  bool: true,
};
```

3. 结构子类型不能覆盖父类的属性,type 也一样会属性会变为 never 类型 无法赋值，永远报错

```js
interface A {
  name: string;
}
interface B extends A {
  name: number; //报错 因为继承的父类的name为字符串，type也不行的 不要这么做；
}
```

4. 接口不在编译结果中 和 type 一样的 编译后看不到了 不同 enum

## readonly 修饰符(不在编译结果中)

```js
    //例子1 约束数组
    let arr:readonly string[] = [] //把索引项的值修饰为只读属性了
    arr = ['1','2','3']//这是可以的，因为修改的是整个数组而不是修饰符修饰的索引项的值
    arr[0] = '10'//这是不允许的 因为索引项的值是只读的 报错
    arr = ['2','3','4'] //这样是可以的，因为修饰符修饰的索引值 而不是arr数组


    //例子2 约束属性
    interface User {
    readonly id: string
    name: string
    age: number,
    readonly arr:readonly string[]
    }
    let user:User = {
        id:'001',
        name:'zhao',
        age:18,
        arr:['1','22','2233']
    }
    user.id = '002' //报错，id是只读的
    user.arr=['223','32']//报错 因为都被约束只读了
```

## 类型的兼容性

1. 鸭子辩型法

```js
    interface User{
        name:string,
        readonly id:string,
        age:number
    }

    let obj = {
        name:'zhao',
        id:'19991',
        age:18,
        province:'辽宁'
    }
    let user:User = obj //这里的obj是模拟调取服务器或者api得到的一个对象,只要里面有User必要的属性，就可以给User约束的变量赋值
    let user1 :User = { //字面量就不可以了，因为系统知道是你自己写的对象，会认为你瞎几把写，明明已经约束了类型,还多写不行
        name:'zhao',
        id:'19991',
        age:18,
        province:'辽宁' //报错 多属性 不符合约束的类型 不会开启兼容模式
    }
```

2. 类型断言 as (不出现在编译结果中)
   当有些时候系统推导不是你确定的类型 可以用 as 来断言类型

```js
interface Deck{
    sound:'嘎嘎嘎'
    swin()
}
let person = {
    name:"模仿为鸭子的人"
    sound:'嘎嘎嘎' as '嘎嘎嘎'// 不加as sound由自动推导得到类型是字符串而不是字面量类型 通过类型断言，让sound变为字面量类型，as后面的嘎嘎嘎是作为字面量类型的，与Deck的sound类型一致，那么person赋值给被Deck约束的变量就可以了
    swin()
}
let duck:Deck = person //不会报错，因为person下面的变量类型与Deck下面的类型相同 不加as断言 就报错了 因为推导是字符串类型
```

3. 函数的参数 可以少，不可以多 返回值要求返回必须返回，类型要一致，不要求返回 void 随便你了
   好比 Array.forEach 中间的回调函数 写 3 个参数可以写任意个，用不到的可以不写

# **七、类型别名 枚举 接口 的总结**

## 各自特点

1. alias 可以声明基本类型别名，联合类型，元组等类型 (由此判断 在定义单个变量类型时候 用 type)

   ```js
   //基本类型别名
   type Name = string;
   function print Parameter(param:Name){
       console.log(param)
   }
   //联合类型
   interface dog{
   wong():void
   name:string
   }
   interface cat{
       miao():void
       name:string
   }
   type Pet = dog | cat ;

   let cat:Pet = {
       name:'小猫',
       miao(){
           console.log('wangwang')
       }
   }
   let dog:Pet = {
       name:'小狗',
       wong(){
           console.log('wangwang')
       }
   }
   //元祖类型
   type PetList = [Dog,Cat];

   let petlist:PetList = [dog,cat]
   console.log(petlist)
   //定义的类型,可以通过typeof来得到其他变量的类型
   type A = typeof cat
   let a:A = {
       miao(){},
       name:'小猫猫'
   }
   ```

2. interface 可以类型合并 (好像对版本升级 拓展有用吧 自己猜的)

```js
interface User {
  name: string;
}
interface User {
  age: number;
}
let user: User = {
  name: "zhao",
  age: 18, //这里必须写，不然报错，因为第二次的 类型User 已经合并了 age属性
};
```

3. 枚举 enumerable 主要是为了把物理值变成逻辑变量 写代码的时候用逻辑变量从而避免全盘改变物理值费事，而且他会出现在编译结果中

# **八、TS 中的类**

## 新增类的语法

1. 属性的写法，向 js 中那样写 constructor 是会报错因为一个类的属性在 ts 中认为，创建对象或类的时候就应该清楚属性了，不能动态添加，所以要创建的时候就要有所有的属性，constructor 只是作为外部赋值给内部的过程而不是定义属性值的地方

```js
    class User {
        constructor (name:string,age:number){
            this.name= name
            this.age = age
        }
    }
    //上面代码在js中是正常的，但在ts中会报错，因为你没有规定类中的属性，而直接给类中属性动态赋值是不可以的
    //下面是ts中的写法
    class User {
    gender:'男'|'女' = '男' //初始化可以在属性列表完成 也可以在构造函数里面写默认值 这里的字面量应该用枚举类型 这里为了省事
    readonly myname //类型推导为string,不然要写约束类型
    myage //类型推导为name,不然要写约束类型
    id?:string //可选属性加? 不写这个属性，下面的user.id会报错，加了以后默认undefined 类型要写上
    constructor(name: string, age: number) { //表示 myname 和age myage(new)会给name和age赋值
        this.myname = name
        this.myage = age
        }
    }
    const user = new User( 'zhao',18 )
    console.log(user.id) //属性里有id没有初始值的话 默认为 undefined
    user.id = '1001'//上面属性列表中如果没有id属性，这了会报错，因为类中没有id整个属性，你就不能给他赋值这个属性
   //属性的初始化值

   //在有些时候为了避免属性列表写了属性(name:string)但是constructor内却忘记赋值了，那么就会出现初始值是undefined的情况，为了避免这种情况，需要配置 strictPropertyInitialization:true 表示 严格的初始化属性检查 当出现初始化值为undefined的情况会提示报错
```

2. 属性简写

```js
//实际上内部属性列表默认有public修饰符，表示公共属性，而公共属性就可以简写，直接在构造函数参数中加public就可以免去在 内部属性列表声明了，如下
class User{
    constructor (public name:string,public age:number,public id?:string){}
    }
const user = new User('zhao',18)
user.id = '10001'
```

3. 修饰符 private 私有的属性 ts3.8 开始 private 可以用# 代替了

```js
class User{
    private id:string = '10001' // 私有属性必须内部初始化，因为外部无法读取和设定属性
    #name:string = 'zhao'  //ts3.8开始 如果一个属性以#开头表示 它是私有属性 好比在前面加上了 private 但是#号是一部分，所以使用时候 需要#name
    aaa(){
        return this.#name //带#表示好比  private #name
    }
    constructor (public name:string,public age:number){}
}
const user= new User('zhao','age')
let id = user.id //报错的，私有属性外部无法访问
```

4. 访问器属性 get 和 set 同 js 一样 不写 set 属性就自动变为只读了

```js
class User {
    constructor (public name:string,public age:number){}
    get name() {
        return this.name
    }
    set age(data){
        this.age = data
    }
}
const user = new User('zhao',18)
console.log(user.age)//报错
```

5. tsconfig 配置严格的初始化属性值 "strictPropertyInitialization" : true,初始化可以在内部属性列表完成，也可以在构造函数里完成，但必须完成

```js
class User{
    name:string
    age:number  //它会报错
    gender:'男'|'女'='男'
    pid:string |undefined //undefined的默认值是undefined null的话就得赋值为null
    vpid?:string //可选属性就不会有初始化要求了，因为他默认有undefined
    spid:string | null = null //null必须要赋值null
    constructor (name:string,age:number){
        this.name = name
        // this.age = age //不写这个会报错，因为开启了初始化检查后，不可以没有初始化值
    }
}
```

# **九、泛型**

## 泛型的使用

1. 什么叫泛型，泛型是类型的变量，比如一个函数或类或接口,想要兼容更多的类型参数，想要返回输入的类型，这时用类型变量表示输入的类型，返回也使用类型变量，那么我们把拥有类型变量的函数(类）叫泛型函数(类);

```js
//输入一个对象，改变对象的name属性，并返回对象
function change(n: number): number {
  return n;
}
//上面函数的问题是，参数和返回值的类型被固定了，无法把次函数应用到更多的情况当中
function change(n: any): any {
  return n;
}
//使用any虽然可以使得输入更广泛，但是返回的类型any却无法得到输入的类型，类型无法传递
function change<T>(n: T): T {
  return n;
}
//我们使用一个类型变量T表示输入类型，返回也是T类型，这样返回的类型与输入的类型就联系起来了使用了类型变量的这个函数就是泛型函数，因为他可以兼容更多的类型输入(广泛的类型都可以输入)
function test<T>(arr: T[]): T[] {
  arr.shift();
  return arr;
}
```

2. 多泛型的使用

```js
function test<T, N>(arr: T[], arr1: N[]): (T | N)[] {
  let newArr = [...arr, ...arr1];
  return newArr;
}
```

3. 练习写一个 dictionary

# **十、深入理解类和接口**

## 类的继承

- 继承的作用:可以描述类与类之间的关系，如果 A 继承 B 那么 A 拥有 B 中所有的属性和方法
- 成员的重写:override(重载,覆盖)

  1. 子类可以重写父类的属性和方法，但是不能更改类型

  ```js
  class A {
    name: string = "zhao";
  }
  class B extends A {
    name: string = "li"; //这是可以的，但是不能改变name的类型
  }
  ```

  2. 如果父类属性是私有属性，子类不可以重写父类(可以重写父类的公共和受保护类型 public 和 protected)
     ```js
     class A {
         private name:string='zhao'
     }
     class B extends A {
         private  name:string = 'li' //不可以更改父类的私有属性
     }
     ```
  3. 子类调用方法时，this 指向是动态的，子类调用的父类方法中如果有 this,那么 this 指向的是调用者，就是子类，其实这个和正常调用一样。

     ```js
     class A {
       name: string = "坦克";
       sayhello() {
         console.log(`${this.name}`);
       }
     }
     class B extends A {
       name: string = "玩家坦克";
     }
     let b = new B();
     b.sayhello(); // 调用时候的this和原来一样，函数虽然是父类的，但是调用者是b 所以this是子类对象b 结果是 “玩家坦克”
     ```

  4. 子类中使用 super 关键字代表调用的父类的方法

  ```js
  class A {
    name: string = "我是父类";
    sayhello() {
      console.log("调用的是父类的sayhello", this.name);
    }
  }
  class B extends A {
    name: string = "我是子类";
    sayhello() {
      console.log("调用的是子类的sayhello");
    }
    test() {
      this.sayhello();
      console.log(1111111);
      super.sayhello(); //调用的是父类的方法，但是this指向是子类的 因为super不改变this指向，这里的环境this就是子类
    }
  }
  let b = new B();
  b.test();
  ```

- 里氏替换替换元组，父类类型包含子类，那么可以把一个子类类型的对象赋值给父类类型的对象 不报错
  ```js
  class A {
    //我是父类
    name: string = "zhao";
  }
  class B extends A {
    //我是子类
    name: string = "li";
  }
  let person: A = new B(); // 这里把子类对象 赋值给定义了父类的变量 是可以的，因为父类包含子类
  ```
- 如果一个父类类型，要判断具体是哪个子类(因为这个父类有可能是子类赋给他的)，可以用 instanceOf 来判断 会触发 类型保护

  ```js
  class A{ //父类
      name:string ='zhao'
  }
  class B extends A{  //子类B
      name:string = 'li'
      life:number = 5
  }
  class C extends A{ //子类 C
      name:string = 'li'
      laugh:number = 5
  }
  let person:A = new B() // 不报错的 子类可以赋值给父类 但是person只能使用父类的方法，不可以使用子类中的方法哦
  person.life // 会报错，因为person的类型是A而A中没有life 所以不能调用，如果想知道A是不是B类型，下面方法过类型保护
  if(person instanceOf B){//判断person对象是不是具体的子类类型，可以使用instanceof

  console.log('person属于B类',person.life) //不会报错的 因为person在过了上面判断，可以被认为是B类型，所以可以有life属性

  }
  ```

- protected 受保护的属性 只能在父类或子类中使用，外部无法调用属性，比 private 宽松些，private 只能自己内部使用，子类也不能使用的

  ```js
  class Father {
      public name:string = 'zhao'
      protected age:number = 18
      private secret:string = '秘密'
  }
  class Son extends Father{
      getSecret(){
         return this.secret //undefined吧 因为找不到父类的这个属性，私有了
      }
      getAge(){
          return this.age //内部可以使用age 但是外部直接获取一定不行
      }
  }
  let son = new Son()
  son.name // 'zhao' 公共属性可以直接获取
  son.age //保护属性 只能内部使用
  son.getAge() //公共方法 中可以获取使用保护protected属性，因为方法属于内部方法嘛
  son.secret // 私有属性，不可外部调用
  son.getSecret() //内部方法也不可以掉用private私有属性
  ```

- 传递性和单根性
  1. 每个类只能拥有一个父类 单根性
  2. 传递性，如果 A 是 B 的父类，B 是 C 的父类 ，那么 C 中可以拥有 A 中的所有属性和方法，好比 A 是 C 的父类
- 子类中可以使用 super 关键字代表父类对象

## 抽象类 abstract 主要用于提取子类中的共有成员

1. 在类的前面加上 `abstract`关键字 就表示这个类是一个抽象类 且不能通过 new 创建实例

```js
abstract class A{
    name:string = 'zhao'
}
 let obj = new A() //报错 无法创建抽象类实例
```

2. 抽象类中可以有抽象成员，抽象成员必须在子类中实现赋值，在属性前面加 abstract

```js
abstract class A{
    abstract name:string
}
```

4. 子类中必须实现父类中的抽象成员 如果子类调用 constructor 必须先调用 super() 为子类注入父类的意思
5. 方法也可以抽象 在方法前面加 abstract,也是子类必须实现父类的抽象方法
6. 模板模式
   有些方法，所有子类实现流程完全一致，只是流程中的某个步骤的具体实现不一致，可以将方法提取到父类，在父类中完成整个流程的实现，遇到不一致的方法时，将该方法做出抽象方法

   ```js
   abstract class Chess{ //所有子类的move方法流程一致，只是其中的规则不一致，那么把move写在父类中，子类实现各自的rule方法
       abstract name:string
       private isOut(){
           console.log('边界判断')
       }
       private hasChess(){
           console.log('位置上是否有棋子')
       }
       abstract rule():void
       move(){
       this.isOut()//先判断是否超出边界
       this.hasChess()//位置是否有旗子
       this.rule()//移动规则
       }
   }
   class king extends Chess{
       name: string = '将'
       rule(): void {
       console.log('将的移动规则')
       }

   }
   let k = new king()
   k.move()
   ```

## 静态成员 static

1. 属性前面加 static 属性变成静态的，是附属在类上的，是通过类调用的，而不是用 new 出来的对象来调用
2. 静态方法的 this 指向类
3. 单例模式 有些时候只可以创建一个实例的情况下。如下

```js
class A{
    private constructor(){}
    static ins:A
    static create(){
        if(!this.ins){
            this.ins = new A()
        }
        return this.ins
    }
    name:string ='zhao'
}
console.log(A.ins)
let a = A.create()
let b = A.create()
console.log(a === b)
console.log(A.ins)
```

## 再谈接口

1. 类中使用接口在前面加上关键字 implementsd 表示类实现了某种接口

```js
abstract class Animal { //抽象类 动物  有打招呼方法
    sayhello(){
        console.log('hello,I am a '+ this.name)
    }
  abstract name:string
}
interface IFire{ //接口 IFire 拥有者要实现属性
    simpleFire():void
}
class Lion extends Animal implements IFire{ // 子类Lion继承Animal拥有Animal的方法且要实现Animal的抽象方法和接口中的属性方法
    name:string = 'lion' //name是父类的抽象属性，必须要在子类中实现
    simpleFire(){ // 这是拥有接口中的方法实现
        console.log('i can simpleFire')
    }
}
const lion = new Lion()
lion.sayhello() // 可以使用父类中的打招呼方法
lion.simpleFire()//可以使用接口中的方法
```

2. 类型保护函数
   马戏团例子中，想要让查找有跳火圈能力的动物时候 需要使用到类型保护函数

```js
abstract class Animal{
    abstract name:string;
    sayhello(){
        console.log(this.name)
    }
}
interface IFire{
    simpleFire():void;
}
interface zougangsi{ //走钢丝
    zougangsi():void;
}
class Lion extends Animal implements IFire{
    name='Lion'
    simpleFire(){
        console.log('I can simpleFire')
    }
}
    class Monkey extends Animal implements zougangsi{
    name='Lion'
    zougangsi(){
        console.log('I can zougangsi')
    }
}
let animalArr:Animal[] = []
animalArr.push(new Lion)
animalArr.push(new Monkey)
animalArr.forEach(animal=>{
    if(hasFire(animal)){
        animal.sayhello()
        animal.simpleFire()
    }
    // if(animal instancOf Ifire){  //在c#和java中 对象和接口可以是通过instanceOf来判断，Ts则要用到类型保护函数hasFire(animal)
    // }
})

function hasFire(animal:any) :animal is IFire{//类型保护函数的写法 返回boolean
   return animal.simpleFire
}
```

3. 接口和类型别名最大的区别是 接口可以继承类也可以被类的继承, 类型别名不行
4. 接口可以继承类，表示该类的所有成员都在接口中

```js
class A {
    a1: string = 'zhao'
    a(){}
}
class B {
    b1: number = 1
    b(){}
}
interface C extends A, B {
    c1: string
    c():void
}
let obj: C = {
    a1: 'zhao',
    a(){},
    b1: 10,
    b(){},
    c1: 'string',
    c(){}
}
```

5. 类型和接口感觉都是玩对象的，多用于对对象的约束 类在接口的基础上可以实现一个实例，互相可以继承，implements 和 extends 而类型别名 好像是之前 ts 版本的遗留产物 主要对单独一个属性进行约束的，慢慢理解吧

## 索引器属性

1. 默认情况下 不给变量类型约束 变量会有隐式的类型 any，如果严格要求就要开启 noImplicitAny": true,
   在使用[] 属性读取值或赋值的时候，如果[]内是字符串，ts 当然会判断所在对象中是否有这个类型属性，有的话，ts 会推断得到这个属性值的类型，不会报错，但是[ ]中有可能是变量或者函数返回值等等情况，所以 ts 在对象中找不到[]内的索引值的时候，就会把这个索引值类型推断为 any ，开启了上面的配置后，就会报错 下面例子中的 c 和 d 都会是 any 类型，而这样会带来类型的缺失，有时候我们不希望这样，就会在 tsconfig.json 中设置 "noImplicitAny": true, (隐式的 any 类型将报错)，这样可以避免 any 类型，当出现隐式的 any 类型时候会报错，可是的确有的时候我们要这样赋值啊，那么我们只能在对象中加入索引器属性 比如注释的部分或者给对象加入类型约束{[prop:string]:any},当然如果你不想这样写，又想用[]的形式，那么可以通过配置"suppressImplicitAnyIndexErrors": true,抑制隐式索引 any 类型错误 这样如果在一个变量不设置类型的时候系统会把他推导为 any 类型时，会报错，但是用[]而产生的 any 就不会报错，不过好像不推荐哦 还是乖乖的写类型约束好一些，这样不用打开"suppressImplicitAnyIndexErrors": true

```js
class A {
  // [prop:string]:any
  name: string = "zhao";
  age: number = 18;
}
let a = new A();
const b = a["name"]; //不会报错 因为ts在A中遭到了name的类型 即使在开启了noImplicitAny": true,
const c = a["fda"]; // 报错 因为开了noImplicitAny": true后 ts在这里会推断出c是隐式的any类型，如果不想报错，2中方式 1是乖乖的写  [prop:string]:any 2是开启"suppressImplicitAnyIndexErrors": true,不推荐
let obj: { [prop: string]: any } = {
  //不写类型 d隐式any类型 会报错 写上:{[prop:string]:any}不报错
  a: 1,
  b: 2,
  c: 3,
};
for (let prop in obj) {
  const d = obj[prop];
}
```

2. 索引器在类中应该写在最上面 升级到了新版本也可以写下面了，无所谓了！

```js
class A {
    [index:number]:string
    0 : '123'
    1 :'123234'
}
```

3. 索引器只可以是 number 和 string
4. 索引器的作用 可以为类动态添加成员了，
5. 可以写 2 个索引器，但是值类型必须一致或者继承关系

## this 的约束

1. "noImplicitThis":true this 类型不可以是隐式 any
2. 声明 this 指向，在函数第一个参数写

```js
interface User{
    name:string
    age:number
    sayhello(this:User):void //过去用写，现在不用了 默认指向自己了，
}
const u :User = {
    name:'zhao',
    age:19,
    sayhello(){
        console.log(this.name,this.age)
    }
}
u.sayhello()
const say = u.sayhello
say()  //过去(报错，因为这个方法中的this与定义的this不一致) 现在 升级了 默认指向自己，不提示错误，但实际上是错误的 和类一样了
```

## 装饰器 (用来修饰类、类的属性的)

- 在 java 中叫注解，在 c#中叫特征，在 ts 中叫 decorator 装饰者 js
- 作用是为了描述数据信息的数据(元数据 meta) 比如电话号码这个属性 要求 11 位数字组成的字符串 那么可以用装饰来验证修饰这个它
- 使用装饰器要开启 "experimentalDecorators": true, //实验性的装饰器 因为 es 还没有通过这个提案
- 装饰本质是一个函数(创建数据后运行)通过函数运行来修饰数据
- 语法@ xxx xxx 如果是一个函数 那么叫 func 为修饰器函数 如果 xxx 是一个 aaa()运行(必须返回一个函数),我们叫 aaa 为修饰器工厂(生产装饰器的，可以带不同参数)
- 约束类

1. 如何约束一个函数的参数是一个类: 通过 new(...arg:any[])=>object 来约束变量参数是一个类
2. 类装饰器的返回值要么是空，要么是一个类，如果是一个类，他会覆盖取代约束的类
3. 通过修饰器函数来修饰类

```js
function addDescription(A: new (...arg: any[]) => object) {
    //A 参数传进来的是约束的类
    A.prototype.description = '我是这个类的描述属性'
}
@addDescription
class User {
    constructor(public name:string,age:number) { }
}
let a = new User('zhao',18)
console.log((a as any).description)// '我是这个类的描述属性'
```

4. 通过修饰器工厂来修饰类

```js
function addDescription(des:string){
    return function(cls:new (...arg:any[])=>object){
            cls.prototype.description = des
    }
}
@addDescription('这是一个用户类')
class User {
    constructor(name:string,age:number){}
}
let user = new User('zhao',18)
console.log((user as any).description)//这是一个用户类
```

6. 装饰器下面的类定义后就会运行装饰器而且是重下到上的运行,装饰器好比立即执行函数，而不是等待建立对象后才运行

```js
function decorator1(target:new()=>object){console.log('decorator1')}
function decorator2(target:new()=>object){console.log('decorator2')}
@decorator2 //后上
@decorator1 //先下
class A{}
// const a = new A() //不需要创建对象修饰器就运行的 立即执行函数
//运行结果是decorator1  decorator2
好比下面的写法
A = function A(){}
A = _decorator({decorator1},A)
 A = _decorator({decorator2},A)
```

    但是如果写的是装饰器函数工厂 那么就会如下展示

```js
function decorator1(str: string) {
    console.log(str)
    return function (target: new (...arg: any[]) => object) {
        console.log('decorator1')
    }
}
function decorator2(str: string) {
    console.log(str)
    return function (target: new (...arg: any[]) => object) {
        console.log('decorator2')
    }
}
@decorator2('2') //装饰器函数工厂 是从上到下    运行装饰器函数是从下到上
@decorator1('1')
class A {}
//运行结果是 2
//          1
//          decorator1
//          decorator2
```

8. 属性装饰器
   也是一个函数，写在属性的上面 @xxx 函数 调用时会传 2 个参数
   如果属性是实例属性，那么 1 参 是类的 prototype 2 参是修饰的属性名
   如果属性是静态属性,那么 1 参是类 2 参是修饰的属性名
   ```js
   function decorator1(target: any, name: string) {
     console.log(target === A.prototype, name); //实例属性传入的是类的原型(对象的__proto__)
   }
   function decorator2(target: any, name: string) {
     //静态属性传入的是类
     console.log(target === A, name);
   }
   class A {
     @decorator1
     aaa: string = "aaa";
     @decorator2
     static bbb: string = "bbb";
   }
   ```
9. 方法修饰符
   也是一个函数 只不过有 3 个参数
   1 参 2 参同上 3 参是属性描述符 descriptor 注意默认修饰符是不让方法遍历的 原来也是
   ```js
   function decorator(target:any,name:string,descriptor:PropertyDescriptor){
       console.log(target,name,descriptor)
       //   默认 descriptor = {
       //         writable:true,
       //         enumerable:false,
       //         configurable:true
       //        }
       }
   }
   class A{
       @decorator
       aaa(){}
   }
   ```
10. 修饰符练习

```js
    function classDecorator(description:string){
        return function (target:new()=>void){
            target.prototype.$classDescription = description
        }
    }
    function propertyDecorator(description:string){
        return function (target:any,propName:string){
            target.__proto__.$propertyDescription =  target.__proto__.$propertyDescription || []
            target.__proto__.$propertyDescription.push({
                propName,
                description
            })
        }

    }


    @classDecorator('用户')
    class User {
        @propertyDecorator('名字')
        name:string = ''
        @propertyDecorator('年龄')
        age:number = 0
    }
    const u = new User()
    function print(obj:any){
    console.log(obj.__proto__.$classDescription)
    console.log(obj.__proto__.$propertyDescription)
    }
    print(u)
```

11. 修饰器 插件之 reflect-metaData
12. 作用:代替你自己写装饰器函数
13. 安装 npm install reflect-metaData
14. 引入 import "reflet-metaData"
15. 使用 以上面的例子使用

```js
@Reflect.metadata("metaKey", "用户") //可以对类加注元数据
class User {
  @Reflect.metadata("metaKey", "名字") //可以对属性加注元数据
  name: string = "zhao";
  @Reflect.metadata("metaKey", "年龄") //可以对属性加注元数据
  age: number = 18;
  @Reflect.metadata("metaKey", "打招呼") //可以对方法加注元数据
  sayhello() {
    console.log(this.name);
  }
}
const u = new User();
function print(obj: any) {
  console.log(Reflect.getMetadata("metaKey", User)); //取类二参传类名
  console.log(Reflect.getMetadata("metaKey", obj, "name")); //取属性 二参对象 三参 属性名
  console.log(Reflect.getMetadata("metaKey", obj, "sayhello")); //取属性 二参对象 三参 函数名
}
print(u);
```

12. 验证库 class-validator claas-transformer 库
    validator 是做验证的，transformer 是做平面对象变成类对象的
13. myjson 虚拟服务器返回 json 对象的

## 类型演算

- ### 三个关键字

1. typeof xx 得到的是和 xx 一样的类型 这里的 xx 必须是一个值或一个类

```js
let a:string;
let a1:typeof a; //表示a1的类型是a的类型
a1 = '123'//a1的类型必然是字符串
class A {}
let B:new () =>object = A; //过去表示一个类的类型可以用new()=>object
let b_obj = new B()
let C:typeof A = A
let c_obj = new C ()
```

2. keyof xxx 表示获取 xxx 类型的索引值 "aaa" | "bbb" |"ccc"

```js
interface User{
    name:string
    age:number
}
function aaa(obj:User,prop:keyof User){ //prop的类型是 "name"|"age"
    console.log(obj[prop])//prop只能是"name"|"age"
}
let obj:User = {
    name:'zhao',
    age:19
}
aaa(obj,'name') //第二个属性只能是User中的key
aaa(obj,'age') //第二个属性只能是User中的key
```

3. in 常与 keyof 联用 约束某个索引类型的取值范围

```js
    interface User{
        name:string
        age:number
    }
    type O = {
        [prop in 'name'|'age']:User[prop] //这里的属性只能是user中的属性
    }
    let obj:O = {
        name:'zhao', //name是User下的属性之一
        age:19
    }
    type Obj = {
        [prop in keyof User]:User[prop]
    }
    let obj1:Obj = {
        name:'zhao',
        age:20
}
```

- ### 预定义类型演算

1. Partial<T> T 中的所有属性变为可选

```js
interface User{
    name:string
    age:number
}
let u:Partial<User>;
u = {
    name:'zhao'
}
```

2. Required<T> T 中的所有属性变为必选

```js
interface User{
    name:string
    age:number
}
let u:Required<User>;
u = {
    name:'zhao',
    age:20
}
```

3. Readonly<T> 所有属性变为只读

```js
interface User{
    name:string
    age:number
}
let u:Readonly<User>;
u = {
    name:'zhao',
    age:20
}
u.age = 30 //报错,属性只读
```

4. Exclude<T,U> 把 T 中包含 U 中的类型剔除 针对联合类型

```js
    let gender: Exclude<'男'|'女','男'|null|undefined>;
    gender = '女'

//===========================//
    interface User{
    name:string
    age:number
    }
    interface Obj {
        age:number
    }

    let  gender : Exclude<keyof User,keyof Obj>;
    gender = 'name'
```

5. Extract<T,U> 保留 T 中可以赋值给 U 的类型(好比 T 和 U 的交集)

```js
let gender: Extract<"男" | "女", "男" | null | undefined>;
gender = "男";
```

6. NonNullable<T> 剔除可为空的类型 non(非 不的意思) Nullable(可为空的)

```js
type aaa = string | number | null | undefined;
let b: NonNullable<aaa> = "string" || 20;
```

7. ReturnType<T> 得到 T 的返回类型 一般 T 为函数 Inter 关键词

```js
function aaa(): number {
  return 20;
}
let num: ReturnType<typeof aaa> = 20;
```

8. InstanceType<T> 获取类的返回类型

```js
class A {
  name: string = "zhao";
  age: number = 20;
}
let a: InstanceType<typeof A> = {
  name: "li",
  age: 30,
};
```

## 声明文件 (declare)

声明文件就是

1. 什么是声明文件 以 `**.d.ts`结尾的文件
2. 作用 为 js 代码提供类型声明
   当你使用 ts 开发项目的时候，可能会引入其他的库，因为你使用的是 ts，所以引入的库必须是 ts 的库(有类型检查),如果这个库是用 ts 开发的，那么他在发布的时候会把开发中使用的类型归纳出来一个文件(或多个文件，一个入口文件),这个文件就是这个库的类型声明文件，为什么要这样做呢，因为过去的库都是 js 开发的，别人用的时候也是按 js 库引入的，为了兼容之前，那么就不能以.ts 的文件类型发布(ts 文件中包含类型声明，js 看不懂),所以就把库分开两个文件，一个 js 文件，一个声明文件，这样，库可以提供给 js 项目和 ts 项目同时使用了。
   如果过去 jquery 是用 js 开发的库，后来 ts 项目中想要使用它，那么就需要它的类型声明文件，源代码如果发布成.ts 文件，js 项目又无法引入，所以他就弄了个声明文件方便 ts 项目也可以使用库。

3. 声明文件如何加载
   1. 默认情况下(无配置"typeRoots":[] )
      会加载"include":["./src"] 这个配置中的目录下面的所有(包含子目录里面).d.ts 文件
      还会加载放置在 node_modules/@types 中的声明文件也可以
   2. 手动配置"typeRoots":["./src",'node_modules/@types'] 但是写了这个，前面 2 个就失效了
   3. 与 js 代码同目录
4. 编写声明文件

   1. 自动生成 配置 declaration:true
   2. 配置 souceMap:true 就会有.map 文件，报错时指向 ts 文件位置

5. 手动编写 一般是在已有 js 库，但是用 Ts 重写代价过高 就添加手动声明文件

   1. 全局声明 declare namespace { 类型声明} 这里声明的 namespace 是对全局的声明，任何模块可以直接使用 无需引入 好比声明了一个全局变量对象 里面是各个属性 变量 对象的声明 说白了避免命名冲突(多人协作时候)

   ```js
   //index.d.ts
   declare namespace zhangsan {
       '一个对象': object
   }
   declare namespace lisi {
       "add"(sum:number):void
   }
   //调用文件下
   let add:lisi.add=(){}        //意思是变量约束add变量的类型是 从全局中的lisi类型对象中的add类型
   ```

   2. 模块声明
      为一个模块声明的类型 当引入这个模块的时候，就会读取这个模块的声明文件(文件名和引入的模块名字一样 lodash.d.ts)

   ```js
   declare module "lodash"{
       export function console(message?='default'):void
   }
   ```

   3. 三斜线指令 在声明文件中引入其他的声明文件(好比 import)

   ```js
   /// <reference path ="../../index.d.ts> 在没有es6模块化标准前 聚合多个声明文件为一个文件的时候使用
   ```

   4. 如何引入
      1）默认 tsconfig 不配置的情况下，即 include 为空。默认加载类型文件（d.ts)的位置是 node_module 的@types 下面的项目和项目根目录下的所有 d.ts
      2）手动指定编译文件位置 include:['./src'] 这时 tsc 只编译./src 下的 ts 文件和要编译的 ts 引用位置的 ts 文件(即使不在./src 目录下也编译) 只加载./src 下的 d.ts 文件。

   3) include:['./src',global.d.ts]意思是加载./src 目录下 ts 文件 和 global.d.ts 文件

6. 声明文件的发布
   1. 当前用 Ts 开发的直接配置就会有声明文件
   2. 为其他 js 库开发的，需要提交到@type/中去审核

————————————————————————————————————————————————————————————————————————————————————————————————————————

## 重学类型

### 枚举类型

1. 数字枚举类型

```ts
enum Color {
	Red,
	Green,
	Blue,
}

let col = Color.Red;
col = 0; // 有效的，这也是 Color.Red
```

## 指定编译阶段错误信息语言类型

`tsc --locale zh-CN`

## 常量枚举 在 enum 前面加上 const 就会在编译结果中去除掉枚举，不然会被编译为双向枚举，即可通过索引拿到值，也可以通过值拿到索引。

## 深度递归 Partial

```ts
type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends { [k: string]: any } ? DeepPartial<T[P]> : T[P];
};
```

## 非空类型(即去除 null 或者 undefiend)

```ts
type NonNullable<T> = T extends null | undefined ? never : T; //  type test = NonNullable<undefined|number> // test = number
```

## diff

```ts
type Diff<T, U> = T extends U ? never : T; // 找出T(前面的类型)中比U多出的类型,会把 T的每一个类型拿出来看是否被包含在U中，即是U的子类型，是就不要了，不是的留下，最后组成联合类型 x | y 注意前后类型不能调换
type Filter<T, U> = T extends U ? T : never; // 和上面diff正好相反,上面是不一样的留下，下面是不一样的丢掉。 是取T和U的交集 无所谓前后了。

type T30 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">; // => "b" | "d"
// <"a" | "b" | "c" | "d", "a" | "c" | "f">
// 相当于
// <'a', "a" | "c" | "f"> |
// <'b', "a" | "c" | "f"> |
// <'c', "a" | "c" | "f"> |
// <'d', "a" | "c" | "f">
type T31 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">; // => "a" | "c"  U和T 前后无所谓了。
// <"a" | "b" | "c" | "d", "a" | "c" | "f"> 同上

let demo1: Diff<number, string>; // => number
```

## 深度理解 typescript

1. 用接口声明一个类
   类实现接口 是实例部分实现，接口继承类也是继承实例部分
   约束实例部分用 new 函数返回
   约束静态部分直接写字段

```ts
interface User {
	name: string;
	age: number;
}

// 示例A
interface CommonUser {
	new(name: string, age: number): User; // 约束实例部分的返回类型
	str: string; // 约束静态部分字段
	Func: () => string;
}

const aaa: CommonUser = class implements User {
	static str: string; // 静态部分字段
	static Func() {
		return "";
	}
	constructor(public name: string, public age: number) {}
};

const commonUser = new aaa("zhao", 23);

// 示例B

interface VipUser {
	new(): User; // 约束实例部分的返回类型
	str: string; // 约束静态部分字段
	Func: () => string;
}
const bbb: VipUser = class implements User {
	name: string = "zhao";
	age: number = 23;
	static str: string; // 静态部分字段
	static Func() {
		return "";
	}
};

const vipUser = new bbb();
```

2. enumerate 应用

```ts
// 示例A
enum GoodsFlags {
	standardGoods,
	subGoods,
	hasSubGoods,
}
abstract class Goods {
	_id: string = "";
	name: string = "";
	flag: GoodsFlags = GoodsFlags.standardGoods;
}
class StandardGoods extends Goods {
	flag = GoodsFlags.standardGoods;
	price: number = 10;
}
class subGoods extends Goods {
	flag = GoodsFlags.subGoods;
	hasGoods = 10;
}
class hasSubGoods extends Goods {
	flag = GoodsFlags.hasSubGoods;
	printGoods() {
		return "";
	}
}

function isStandardGoods(aaa: Goods): aaa is StandardGoods {
	return aaa.flag === GoodsFlags.standardGoods;
}
function isHasSubGoods(aaa: Goods): aaa is hasSubGoods {
	return aaa.flag === GoodsFlags.hasSubGoods;
}
function isSubGoods(aaa: Goods): aaa is subGoods {
	return aaa.flag === GoodsFlags.subGoods;
}
function bbb(goods: Goods) {
	if (isStandardGoods(goods)) {
		console.log(goods.price);
	} else if (isHasSubGoods(goods)) {
		console.log(goods.printGoods());
	} else if (isSubGoods(goods)) {
		console.log(goods.hasGoods);
	}
}

// 示例B
enum AnimalFlags {
	None = 0,
	HasClaws = 1 << 0,
	CanFly = 1 << 1,
}

interface Animal {
	flags: AnimalFlags;
	[key: string]: any;
}

function printAnimalAbilities(animal: Animal) {
	var animalFlags = animal.flags;
	if (animalFlags & AnimalFlags.HasClaws) {
		console.log("animal has claws");
	}
	if (animalFlags & AnimalFlags.CanFly) {
		console.log("animal can fly");
	}
	if (animalFlags == AnimalFlags.None) {
		console.log("nothing");
	}
}

var animal = { flags: AnimalFlags.None };
printAnimalAbilities(animal); // nothing
animal.flags |= AnimalFlags.HasClaws;
printAnimalAbilities(animal); // animal has claws
animal.flags &= ~AnimalFlags.HasClaws;
printAnimalAbilities(animal); // nothing
animal.flags |= AnimalFlags.HasClaws | AnimalFlags.CanFly;
printAnimalAbilities(animal); // animal has claws, animal can fly

// 示例C
enum AnimalFlags {
	None = 0,
	HasClaws = 1 << 0,
	CanFly = 1 << 1,
	EatsFish = 1 << 2,
	Endangered = 1 << 3,

	EndangeredFlyingClawedFishEating = HasClaws | CanFly | EatsFish | Endangered,
}
```

## 宝典

1. `keyof never = string | number | symbol`
2. `keyof {} = never`
3. `keyof unknown = never`
4. `keyof string = number | typeof Symbol.iterator | "toString" | "charAt" | "charCodeAt" | "concat" | "indexOf" | "lastIndexOf" | "localeCompare" | "match" | "replace" | "search" | "slice" | ... 35 more ... | "matchAll"`
5. `any[][number] =any , unknown[number] = unknown, [][number] = never`,`[{name:string},{age:number}][number] = {name:string}|{age:number}`
6. 继承 extends 优先 返回 =>
7. 提取的泛型属性没写对应字段的话,为默认的约束类型。没有写默认约束则为 unknown
8. unknown | AnyType = unknown
   never | AnyType = AnyType
9. unknown & AnyType = AnyType
   never & AnyType = never

### 跳过 module 检查 skiplibcheck

有时 可能要编译一个 ts 文件,`tsc ./xxx/abc.ts` 这种编译忽略了 tsconfig.json 文件是使用默认的配置文件的，会检查 modules 中的 lib 内容，如果有冲突会提示。如`Cannot redeclare block-scoped variable 'console'.`

解决办法 1: `npx tsc --skipLibCheck --lib es2020,dom ./xxx/abc.ts`
2: 加 tsconfig.json `npx tsc -p ./xxx` or `npx tsc -p ./xxx/tsconfig.json` 如果在当前目录可以`npx tsc -p ./`

### ewm 遇到的问题

1. ifequals 不计算 导致 预期不一样。

```ts
type Equals<A1, A2> = (<A>() => A extends A2 ? 1 : 0) extends <
	A,
>() => A extends A1 ? 1 : 0 ? 1
	: 0;

type IfEquals<A1, A2, Equality = 1, Inequality = 0> = Equals<A1, A2> extends 1
	? Equality
	: Inequality;

type omit<T, S extends string> = IfEquals<T, unknown, unknown, Omit<T, S>>;
// 测试
// type test_omit1 = omit<Foo,'xxx'>  // expect => {}  ok
// type test_omit2 = omit<unknown,'xxx'> // expect => unknown  ok
interface Foo {
	xxx: string;
}
type res1 = IfEquals<omit<Foo, "xxx">, {}>; // expect  1  ok
function Func1(): IfEquals<omit<Foo, "xxx">, {}> {
	return "" as any;
}
const func1 = Func1(); // func1  ==> 1   ok

function Func2<T extends Foo = Foo>(): IfEquals<omit<T, "xxx">, {}> {
	return "" as any;
}
const func2 = Func2(); // func2  ==> 0   why is 0 ??

function Func3<T extends Foo>(foo: Foo): IfEquals<omit<T, "xxx">, {}> {
	return "" as any;
}
const foo = { xxx: "string" };

const func3 = Func3(foo); // func3  ==> 0   why is 0 ??
```

[playground](https://www.typescriptlang.org/play?ts=4.6.4#code/C4TwDgpgBAogjgVwIYBsDOAeAggRgDRRYBMAfFALxQAU2JVAlBWVlBAB7AQB2AJmoUSgB+KDigAuKAAZG7Tr340sdRuWasO3PoTEixkmcNETpAbgCwAKCtXQkKAEkAZvGTps+AQVeoAlqApRAgcuCEQ-AMopMkpYcPdcAmIyOS1+XTi3fxATELCs0AtrYrtoAHsAW38MABU8AGUNeW00YAAnXy4AcxjHF3jMOqgELgBrLjKAdy4CEfGpmagAeSrgWoJ6khIigHodqEBpW0BV6Ks9qFLziFaAfUr-MUo7tYAxMrK8AHI2b4+yKDP2JAAMbAJhQADeAF8oFAyqNTvsLpwbk9BI9Vhg5hNpp9vmxfv99oCICCwViFjC4VZOpw2k4kEDoK8yhCrDC8ZJWh1ukVIbZwNA2lcHn0fO4nhhmbifiQ8FC-oTiaTjLDRlArE4RiDfGUuFBnlqcAxJM4xZgJVKvjKCPLWZYYULgAg2nqAESuqBIfhILggXlWIG61pQTVcIEig1ho30UyEkOGmHkNQq1U2Syh7W6-Vaoi1JppfVvQLMlQm-puc0YupW-GyiGQsjgtlQR3Ot0er2e33+yyBrjBjNo7NhogMWNnQeJ5NSGFQSYACxyvn4M6EQjTGeAOr1kaBAGY86kFIWWXQnG9xMz6GWzRgJdW8b8bQ27Q6IE6XVB3Z7vd2rHzeyDUFzxZShwQ5D4uU6LoPgAgMgPjMM92LLU9yoECYzjDNkIoadZwXJcV2EIQgA)

2. 约束导致 data 字段 返回字面量类型变为 上级类型 比如 应该返回 123 结果返回 number
   原因 其他定义泛型约束 影响了 data类型。

```ts
// 返回输入的对象类型。如果对象中val为函数，则返回它的函数返回类型。
type foo<T extends object> = T extends unknown
	? { [k in keyof T]: T[k] extends () => void ? ReturnType<T[k]> : T[k] }
	: never;

function Func1<TData extends Record<string, unknown>>(obj: {
	data: TData;
}): foo<TData> {
	return obj.data as any;
}
const res1 = Func1({ data: { a: () => 123 } }); // => a:123 ok

function Func2<TData extends Record<string, unknown>, res = foo<TData>>(obj: {
	data: TData;
}): res {
	return obj.data as any;
}
const res2 = Func2({ data: { a: () => 123 } }); // => a:123  ok

function Func3<
	TData extends Record<string, unknown>,
	res extends Record<string, unknown> = foo<TData>,
>(obj: { data: TData }): res {
	return obj.data as any;
}
const res3 = Func3({ data: { a: () => 123 } }); // => a:number  no expect  why???

function Func4<
	TData extends Record<string, unknown>,
	res extends Record<string, unknown> = foo<TData>,
>(obj: { data: TData }): foo<TData> {
	return obj.data as any;
}
const res4 = Func4({ data: { a: () => 123 } }); // => a:number  no expect  why???
```

### 如何给多个文件导出的类型 加统一的命名(如:Schemas)让调用时 通过 Schemas.xxx的形式来调用。如下示例

比如我有一个 Schemas 文件夹里面有 User.ts 和 Order.ts 内部分别 导出各自类型 如下

```ts
// User.ts
export interface User {
	_id: string;
	// ...
}
// Order.ts
export interface Order {
	_id: string;
	// ...
}
```

我想在其他文件使用 User 或 Order 类型时 通过 Schemas.User 或 Schemas.Order 形式来调用

当前使用的方法是 在 Schemas 文件夹中建立一个转接 文件 convert.ts

```ts
// convert.ts
export type { Order } from "./Order";
export type { User } from "./User";
```

再在 Schemas 文件夹下的 index.d.ts中如下 导出

```ts
// index.d.ts
export * as Schemas from "./convert";
```

这样在其他文件中使用类型时, 可以实现 键入Schemas时自动生成导入 `import { Schemas } from "../Schemas"`, 输入 . 后有类型提示。

```ts
// xxx.ts
import { Schemas } from "../Schemas";

type yyy = Schemas.User;
```

但是 单独的那个 convert.ts 太不优雅了。 能不能通过 一个 index.d.ts文件 得到上面所述效果? 不考虑 nameSpace

我开始以为 这样可以

```ts
import
```

### 在注释中写链接

```ts
/**
 *  这是一个讨论的 {@link https://github.com/sindresorhus/type-fest/issues/436 issue}
 * @see
 * @link
 */
type ddd = string;
```

### Function类型和 (...args:any[])=>any 的区别

```ts
type res = Function extends (...args: any[]) => any ? true : false;

// res => false        error reason:      Function 的函数签名和内容 无法继承 ((...args: any[]) => any) 类型。
type res1 = ((...args: any[]) => any) extends Function ? true : false;

// res1 => true
```

