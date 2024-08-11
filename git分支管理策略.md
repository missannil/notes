### 个人开源（前端node项目）

1. 拉去github(gitee)main分支,
2. 建立开发分支(dev)。
3. 在dev开发测试通过后。
4. 代码评审(可忽略)
5. 修改版本号,打标签, changelog。
6. 合并到main分支。
7. npm发布。
8. push到远程仓库。

release-please 通过解析你的git历史，查找常规提交消息,然后创建一个 release PR。可见它是帮你生成一次新的提交由你来觉得是否把这个提交合并进发布分支(main)。

创建的release pr 为你自动修改版本号,打标签,生成changelog。

使用方法:
1. 在github仓库中建立.github/workflows/release-please.yml
```yml
on:
  push:
    branches:
      - main 
# 当对main分支进行push操作时触发。
permissions:
  contents: write
  pull-requests: write

name: release-please
# github action 名称
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v3
        with:
          release-type: node
          package-name: release-please-action
# 
```
加入main为你的发布分支,那么release-please设置中触发的分支配置应为main,时机可能为push ,此时release-please劫持push操作,

使用release-please的顺序是: 1-2-3-6-触发release-please(它完成5)-7-8.

