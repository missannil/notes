/**
[ts4.5尾递归特性](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types)翻译如下当
TypeScript 检测到可能的无限递归或任何可能需要很长时间并影响编辑器体验的类型扩展时，它通常需要优雅地失败。因此，TypeScript 具有启发式方法，可确保它在尝试分离无限深的类型或处理生成大量中间结果的类型时不会偏离轨道。
type InfiniteBox<T> = { item: InfiniteBox<T> };
type Unpack<T> = T extends { item: infer U } ? Unpack<U> : T;
type Test = Unpack<InfiniteBox<number>>;
上面的示例故意简单且无用，但实际上有很多类型是有用的，不幸的是触发了我们的启发式方法。
例如，以下TrimLeft类型从类似字符串的类型的开头删除空格。如果给定一个开头有空格的字符串类型，它会立即将字符串的其余部分送回TrimLeft.

type TrimLeft<T extends string> =
    T extends ` ${infer Rest}` ? TrimLeft<Rest> : T;
// Test = "hello" | "world"
type Test = TrimLeft<"   hello" | " world">;
这种类型可能很有用，但如果一个字符串有 50 个前导空格，您将得到一个错误。

type TrimLeft<T extends string> =
    T extends ` ${infer Rest}` ? TrimLeft<Rest> : T;
// error: Type instantiation is excessively deep and possibly infinite.
type Test = TrimLeft<"                                                oops">;
这很不幸，因为这些类型在对字符串进行建模操作时往往非常有用——例如，URL 路由器的解析器。更糟糕的是，更有用的类型通常会创建更多的类型实例化，进而对输入长度有更多限制。

但是有一个可取之处：TrimLeft以一种在一个分支中尾递归的方式编写。当它再次调用自身时，它会立即返回结果并且不对其进行任何操作。因为这些类型不需要创建任何中间结果，所以它们可以更快地实现，并且可以避免触发 TypeScript 中内置的许多类型递归试探法。

这就是 TypeScript 4.5 对条件类型执行一些尾递归消除的原因。只要条件类型的一个分支只是另一种条件类型，TypeScript 就可以避免中间实例化。仍然有启发式方法来确保这些类型不会偏离轨道，但它们更加慷慨。

请记住，以下类型不会被优化，因为它通过将条件类型的结果添加到联合来使用它。

type GetChars<S> =
    S extends `${infer Char}${infer Rest}` ? Char | GetChars<Rest> : never;
如果你想让它尾递归，你可以引入一个带有“累加器”类型参数的助手，就像尾递归函数一样。

type GetChars<S> = GetCharsHelper<S, never>;
type GetCharsHelper<S, Acc> =
    S extends `${infer Char}${infer Rest}` ? GetCharsHelper<Rest, Char | Acc> : Acc;
您可以在此处阅读有关实施的更多信息。

下面是官方提交pr的解释。(https://github.com/microsoft/TypeScript/pull/45711)

在#45025中，我们将类型实例化深度限制从 50 增加到 500。随后我们​​看到了多个在编译包含非终止类型的程序期间发生堆栈溢出的示例，特别是当编译器用于浏览器托管环境时（显然，在某些情况下，调用堆栈限制低于 Node.js）。很明显 500 的限制太高了，所以在这个 PR (ts4.5)中我们将最大值降低到 100。

在某些合法情况下，递归条件类型的评估需要超过 100 次迭代才能完成。出于这个原因，这个 PR 实现了条件类型的尾递归评估。具体来说，当条件类型以另一个（或通过递归，相同的另一个实例化）结束时，编译器现在在不消耗额外调用堆栈的循环中执行类型解析。在我们认为类型非终止并发出错误之前，我们允许对此类类型的评估循环 1000 次。

以下条件类型是尾递归的：

type Trim<S extends string> =
    S extends ` ${infer T}` ? Trim<T> :
    S extends `${infer T} ` ? Trim<T> :
    S;
以前，对于包含超过 25 个空格的字符串文字，此类型实例化的解析会出错。我们现在允许最多包含 1000 个空格的字符串。

不是尾递归的条件类型通常可以通过引入“累加器”以尾递归形式编写。例如，这种提取字符串中字符的并集的类型不是尾递归的（因为它通过联合类型递归）

type GetChars<S> = S extends `${infer Char}${infer Rest}` ? Char | GetChars<Rest> : never;
// 但是这个重写的形式是

type GetCharsAAA<S> = GetCharsRec<S, never>;
type GetCharsRec<S, Acc> = S extends `${infer Char}${infer Rest}` ? GetCharsRec<Rest, Char | Acc> : Acc;
// 尾递归条件类型的一些其他示例：

type Reverse<T> = any[] extends T ? T : ReverseRec<T, []>;
type ReverseRec<T, Acc extends unknown[]> = T extends [infer Head, ...infer Tail] ? ReverseRec<Tail, [Head, ...Acc]>: Acc;

type T1 = Reverse<[0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,]>;

//建立N个T类型的元组
type TupleOf<T, N extends number> = number extends N ? T[] : TupleOfRec<T, N, []>;
type TupleOfRec<T, N extends number, Acc extends unknown[]> =
    Acc["length"] extends N ? Acc : TupleOfRec<T, N, [T, ...Acc]>;

type T2 = TupleOf<any, 200>;
上面的例子之前会报错“Type instantiation is excessively deep and possibly infinite”，但现在成功了。

 */

// -------------------------------------总结------------------------------------------
/**
 * 实例化(instantiation)实例化概念
 * js中通过 new 一个类 会得到一个对象，把这个对象叫做这个类的实例化对象。
 * 下面总结下ts的实例化
 */
// ts中的类型声明或在类型推导转变过程中产生的每个“新”类型被ts认为是一次实例化

// type InfiniteBox<T> = { item: InfiniteBox<T> };
// type Unpack<T> = T extends { item: infer U } ? Unpack<U> : T;
// error: Type instantiation is excessively deep and possibly infinite.
// type Test = Unpack<InfiniteBox<number>>;

// User
type User = {
	name: string;
	age: number;
};
//test1 只用到类型User 所以ts记录一次实例化。
const test1: User = {name:'zhao',age:20}

type OnlyName = Omit<User, "age">;
// test2用到了类型OnlyName,而OnlyName是由User推演出的"新"类型。所以ts会记录次过程使用的实例类型为2个 一个为 User  一个为 {name:string}
const test2: OnlyName = { name: 'zhao' }
//为了证明上面 做下面的测试

// type A = User
// type B = OnlyName
// type Last<T extends unknown[], TLast = never> = T extends [infer head, ...infer rest] ? TLast | Last<rest, head> : TLast;

// type AAA = Last<[A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A]>
// const aaa:AAA={name:'z',age:2}

// type BBB = Last<[B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B]>

// const hh:BBB={}

// type A = { name: string; age: number };
// type B = { id: string };
// type AandB = A & B;
// type compute<T> = { [k in keyof T]: T[k] };
// type F = compute<AandB>;
// type lll = { d: F };
// const aaa: User = { name: "zhao", age: 18 };
// 声明常量aaa时,ts会认为User类型被实例化了,因为{name:'zhao',age:number}这个对象非内部存在的基础类型。

// const bbb: OnlyName = { name: "zhao" };
// 常量bbb被约束为OnlyName类型,在使用OnlyName时,ts会检测并记录OnlyName类型的实例化了次数(2次),一次为User(非原始类型),一次为Omit类型。因为Omit类型在User类型上建立新的类型。

// 下面测试想法是否正确

// type compute<T> = T extends unknown ? { [k in keyof T]: T[k] } : never;

// type mergeObject<Result, A> = { [k in keyof A]: k extends keyof Result ? Result[k] | A[k] : A[k] };

// type ddd<T extends unknown[], Result = {}> = T extends [infer head, ...infer rest]
// 	? ddd<rest, mergeObject<Result, head>>
// 	: Result;
// type Last<T extends unknown[], TLast = undefined> = T extends [infer head, ...infer rest] ? Last<rest, head> : TLast;

// type A = { a: string };
// type B = { b: number };
// type C = { a: number };
// type D = { b: string };

// type F = A & B;
// type H = compute<F>;
// type xxx = { a: H };
// type G = C & D;
// type O = { a: string };
// A,A,A,A,A,A,A,A,A,A, 10
// A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A 33
// F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F 33
// G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G 33
// A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,A,
// B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,
// 下面lll类型可以接受48个A,已知最大实例化为100
// type lll = ddd<[F, F, F, F, F, F, F, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G]>;

// type dddsss = compute<lll>;
// const a: dddsss = { a: "zhao", b: 10 };

// type OO = eee<[O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O]>
// type FF = eee<[F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F]>
// type computeO = compute<OO>
// const aa: computeO = { a: '' }
// type computeF = compute<FF>
// const ff:  computeF = { a: 'string',b: 1}



type A = {a:string,b:number}
type B = {a:number,b:string}
type mergeObject<Result, A> =   Omit<Result,keyof A> &    { [k in keyof A]: k extends keyof Result ? Result[k] | A[k] : A[k] };

type foo<T,result={}> = T extends [infer head,...infer rest]?foo<rest,mergeObject<result,head>>:result


type xxx =  foo<[A,B,A,B,A,]>

const aaa: xxx = { a: '', b: '' }

type sss = {
    (p: string):void
    (p:number):void
}

type lllf = Parameters<sss>