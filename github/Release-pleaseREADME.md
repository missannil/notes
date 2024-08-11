## [release-please]README翻译(谷歌翻译)

### [release-please]

Release Please 自动生成 CHANGELOG，创建 GitHub 发布，以及项目的版本升级。

它通过解析您的 git 历史记录、查找常规提交消息和创建发布 PR 来实现。

它不处理对包管理器的发布或处理复杂的分支管理。

### 什么是发布 PR？

release-please 维护 Release PR，而不是持续发布登陆到默认分支的内容：

![avatar](./screen.png)

随着其他工作的合并，这些发布 PR 会保持最新。当您准备好标记发布时，只需合并发布 PR。squash-merge 和 merge 提交都适用于 Release PR。

当合并 Release PR 时，release-please 会进行以下步骤：

更新您的更改日志文件（例如CHANGELOG.md）以及其他语言特定文件（例如package.json）。
用版本号标记提交
根据标签创建 GitHub Release
您可以通过 PR 本身的状态标签来判断 Release PR 在其生命周期中的位置：

autorelease: pending是合并前Release PR的初始状态
autorelease: tagged意味着 Release PR 已经被合并，并且发布已经在 GitHub 中被标记了
autorelease: snapshot是快照版本颠簸的特殊状态
autorelease: published表示已基于 Release PR 发布了 GitHub 版本（release-please 不会自动添加此标签，但我们建议将其作为发布工具的约定）。

### 我应该如何编写我的提交？

Release Please 假定您使用的是[传统提交消息]。

您应该记住的最重要的前缀是：

fix:它代表错误修复，并与 [SemVer] 补丁相关联。
feat:它代表一个新功能，并与 SemVer minor 相关联。
feat!:, 或fix!:,refactor!:等, 代表一个破坏性的变化 (用 表示!) 并将导致 SemVer 专业。

### 线性 git 提交历史（使用 squash-merge）

我们强烈建议您在合并拉取请求时使用 squash-merges。线性的 git 历史使它更容易：

遵循历史 - 提交按合并日期排序，并且不会在拉取请求之间混合
查找和恢复错误 -git bisect有助于跟踪哪个更改引入了错误
控制 release-please 变更日志——当你合并一个 PR 时，你可能有在 PR 范围内有意义的提交消息，但在合并到主分支时就没有意义了。例如，你 make have feat: introduce feature A然后fix: some bugfix introduced in the first commit。提交fix实际上与发行说明无关，因为在主分支中从未遇到过错误。
保持一个干净的主分支——如果你使用类似红/绿开发的东西（在提交 A 中创建一个失败的测试，然后在提交 B 中修复）并合并（或 rebase-merge），那么你的主分支中会有时间点测试没有通过的地方。

### 如果我的 PR 包含多个修复或功能怎么办？

Release Please 允许您使用页脚在单个提交中表示多个更改：

feat: adds v4 UUID to crypto

This adds support for v4 UUIDs to the library.

fix(utils): unicode no longer throws exception
PiperOrigin-RevId: 345559154
BREAKING-CHANGE: encode method no longer throws.
Source-Link: googleapis/googleapis@5e0dcb2

feat(utils): update encode to support unicode
PiperOrigin-RevId: 345559182
Source-Link: googleapis/googleapis@e5eef86
上面的提交消息将包含：

“将 v4 UUID 添加到加密”功能的条目。
修复“unicode 不再抛出异常”的条目，以及它是重大更改的注释。
功能“更新编码以支持 unicode”的条目。
⚠️ 重要提示：附加消息必须添加到提交的底部。

### 如何更改版本号？

当对主分支的提交在提交主体Release-As: x.x.x中有（不区分大小写）时，Release Please 将为指定版本打开一个新的拉取请求。

空提交示例：

git commit --allow-empty -m "chore: release 2.0.0" -m "Release-As: 2.0.0"导致以下提交消息：

chore: release 2.0.0

Release-As: 2.0.0

### 如何修复发行说明？

如果您合并了拉取请求并想要修改用于生成该提交的发行说明的提交消息，您可以编辑合并的拉取请求的主体并添加如下部分：

BEGIN_COMMIT_OVERRIDE
feat: add ability to override merged commit message

fix: another message
chore: a third message
END_COMMIT_OVERRIDE
下次 Release Please 运行时，它将使用该覆盖部分作为提交消息而不是合并的提交消息。

⚠️ 重要提示：此功能不适用于普通合并，因为请发布不知道要将覆盖应用到哪个提交。[我们建议改用 squash-merge]。

### Release Please bot 不会创建发布 PR。为什么？

Release Please 在注意到默认分支包含自上次发布以来的“可发布单元”后创建发布拉取请求。可发布单元是对具有以下前缀之一的分支的提交：“feat”、“fix”和“deps”。（“杂务”或“构建”提交不是可发布的单元。）

某些语言有其特定的可发布单元配置。例如，“docs”是 Java 和 Python 中可发布单元的前缀。

如果您认为 Release Please 错过了在合并带有可发布单元的拉取请求后创建发布 PR，请重新运行release-please。如果您使用的是 GitHub 应用程序，请将release-please:force-run标签添加到合并的拉取请求中。如果您正在使用该操作，请查找失败的调用并重试工作流运行。Release Please 将立即处理拉取请求以找到可发布的单元。

### 请设置发布

有多种方式可以部署 release-please：

### GitHub 操作（推荐）

运行 Release Please 的最简单方法是作为 GitHub 操作。有关安装和配置说明，请参阅[google-github-actions/release-please-action]。

### 作为 CLI 运行

有关所有配置选项，请参阅运行 [release-please CLI] 。

### 安装 GitHub 应用程序

有一个可用的 probot 应用程序，它允许您将 Release Please 部署为 GitHub 应用程序。 有关安装和配置说明，请参阅 github.com/googleapis/repo-automation-bots 。

### 引导您的存储库

发布 请查看自上次发布标签以来的提交。它可能会也可能不会找到您以前的版本。载入存储库的最简单方法是 [引导清单配置]。

### 请定制发布

Release Please 提供了几个配置选项以允许自定义您的发布过程。有关详细信息，请参阅[customizing].md 。

### 通过清单配置支持 Monorepos

Release Please 还支持从同一存储库发布多个工件。在manifest-releaser.md中查看更多信息。

### 支持的 Node.js 版本

我们的客户端库遵循Node.js 发布时间表。库与 Node.js 的所有当前活动和维护版本兼容。

针对某些 Node.js 生命周期终止版本的客户端库可用，并且可以通过 npm dist-tags安装。[dist-tags] 遵循命名约定legacy-(version)。

尽最大努力支持旧版 Node.js：

遗留版本不会在持续集成中进行测试。
某些安全补丁可能无法向后移植。
依赖项不会保持最新，功能也不会向后移植。
**旧版标签可用**

- legacy-8：从这个 dist-tag 安装与 Node.js 8 兼容的版本的客户端库

版本控制
该库遵循[语义版本]控制。


[SemVer]:https://semver.org/
[常规提交消息]: https://www.conventionalcommits.org/
[我们建议改用 squash-merge]: https://github.com/googleapis/release-please#linear-git-commit-history-use-squash-merge
[引导清单配置]: https://github.com/googleapis/release-please/blob/main/docs/cli.md#bootstrapping
[语义版本]: https://semver.org/
[github.com/googleapis/repo-automation-bots]: https://github.com/googleapis/repo-automation-bots
[customizing]: https://github.com/googleapis/release-please/blob/main/docs/customizing.md
[release-please]: https://github.com/googleapis/release-please
[dist-tags]: https://docs.npmjs.com/cli/v9/commands/npm-dist-tag/
[google-github-actions/release-please-action]: https://github.com/google-github-actions/release-please-action
[release-please CLI]: https://github.com/googleapis/release-please/blob/main/docs/cli.md
[传统提交消息]:https://www.conventionalcommits.org/