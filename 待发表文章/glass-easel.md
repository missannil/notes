### [glass-easel]与[exparser]区别

1. 新框架在created生命周期中允许使用this.setDa改变实例数据并渲染,老框架只改变实例数据而不渲染。
2. 新框架setData是异步一起的,老框架是实时的。即：同步代码存在多次setData时,新框架是一起渲染,老框架是多次渲染
3. 首屏渲染都在onLoad之前(即所有attached完成后)
[exparser]: (https://juejin.cn/post/7140509513852911647)
[glass-easel]: (https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/glass-easel/introduction.html)
