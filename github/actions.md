### [官方文档](https://docs.github.com/en/actions)

### GitHub Actions 基本概念

GitHub Actions 是一种自动化工具，可以帮助您自动化软件开发过程中的各种任务，例如构建、测试、部署和发布。它可以与 GitHub 存储库集成，并在存储库中的事件发生时触发自动化任务。

使用 GitHub Actions，您可以编写自定义的工作流程，以自动执行各种任务。例如，您可以编写一个工作流程，以在代码推送到存储库时自动构建和测试代码。您还可以编写一个工作流程，以在代码合并到主分支时自动部署代码。

GitHub Actions 还可以与其他工具和服务集成，例如 Docker、AWS、Azure 和 Google Cloud。这使得它非常灵活和强大，并可以适应各种不同的开发场景和需求。

总之，GitHub Actions 是一个非常有用的自动化工具，可以帮助您更好地管理软件开发过程中的各种任务，并提高开发效率和代码质量。

### GitHub Actions 工作流程

GitHub Actions 工作流程是一组自动化任务，可以在 GitHub 存储库中的事件发生时触发。工作流程由一个或多个作业组成，每个作业都包含一个或多个步骤。每个步骤都是一个命令或操作，例如构建代码、运行测试或部署应用程序。

以下是一个简单的 GitHub Actions 工作流程的示例：

```yaml
# 流程名称
name: CI
# 触发条件
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
# 作业配置
jobs:
  # 构建作业
  build:
    # 作业环境
    runs-on: ubuntu-latest
	# 作业步骤
    steps:
	# 引入作业仓库
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
    - name: Test
      run: npm test
```

在此示例中，工作流程名为 `CI`，并在代码推送到 `main` 分支或创建 PR 时触发。工作流程包含一个名为 `build` 的作业，该作业在 Ubuntu 环境中运行。作业包含四个步骤：检出代码、安装依赖项、构建代码和运行测试。

您可以根据自己的需求编写自定义的 GitHub Actions 工作流程，并将其与存储库集成，以自动化各种任务。例如，您可以编写一个工作流程，以在代码推送到存储库时自动构建和测试代码。您还可以编写一个工作流程，以在代码合并到主分支时自动部署代码。

总之，GitHub Actions 工作流程是一个非常有用的自动化工具，可以帮助您更好地管理软件开发过程中的各种任务，并提高开发效率和代码质量。

### pull_request_target 和 pull_request 的区别

当工作流存储库中的拉取请求活动发生时运行工作流。如果没有指定活动类型，则在打开、重新打开拉取请求或更新拉取请求的头分支时运行工作流。

该事件运行在pull请求基的上下文中，而不是像pull_request事件那样运行在合并提交的上下文中。这可以防止从拉取请求的头部执行不安全的代码，这些代码可能会改变您的存储库或窃取您在工作流程中使用的任何秘密。此事件允许您的工作流对来自fork的拉取请求进行标签或评论。如果需要从拉取请求构建或运行代码，请避免使用此事件。

### 检查是否基于最新的提交

GitHub Actions 已经提供了一个默认的行为，会检查 pull request 是否基于最新的提交。当您创建一个 pull request 时，GitHub 会自动检查您的分支是否基于最新的提交，并在 pull request 页面上显示一个警告消息，提示您更新您的分支以基于最新的提交。

因此，您不需要编写一个自定义的 GitHub Actions 工作流程来检查 pull request 是否基于最新的提交。GitHub 已经为您处理了这个问题。

### yml文件中的token设置

