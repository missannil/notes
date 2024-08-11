### 读后感

1. 版本管理器: updateManager.ts

```ts
export default () => {
	if (!wx.canIUse("getUpdateManager")) {
		return;
	}
	const updateManager = wx.getUpdateManager();

	updateManager.onCheckForUpdate(function(res) {
		// 请求完新版本信息的回调
		console.log("版本信息", res);
	});

	updateManager.onUpdateReady(function() {
		wx.showModal({
			title: "更新提示",
			content: "新版本已经准备好，是否重启应用？",
			success(res) {
				if (res.confirm) {
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate();
				}
			},
		});
	});

	updateManager.onUpdateFailed(function() {
		// 新版本下载失败
	});
};
```

使用方法

```ts
import updateManager from "./common/updateManager";

App({
	onLaunch: function() {},
	onShow: function() {
		updateManager();
	},
});
```

2. 下拉刷新

   1. 开启页面下拉刷新 : json(自身页面开启) 或 app.json中设置(全部页面都开启)
      页面事件: onPullDownRefresh
      停止动画: stopPullDownRefresh
	2. scroll-view 下拉刷新:

		设置字段有: 开启 状态控制 