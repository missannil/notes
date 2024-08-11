## 建立远程仓库

1. 在 gitee.com 上面注册账号，直接创建一个远程库

2. 本地建立仓库并关联远程库

   ```bash
   # 初始化一个仓库 默认分支master
   git init
   # 关联远程仓库地址
   git remote add origin git@gitee:<remoteRepositoryName>
   # 定义当前分支的上游为哪个远程分支,方便当前分支push pull等。
   git branch --set-upstream-to=origin/<branch>  master

   git pull

   # 若没有关联上游分支，只能pit pull <remoteName> <branch>
   # `git switch -t origin/dev` 建立一个新分支 并同步 origin 库下的 dev 分支
   ```

## 一些必要的配置

1. 配置本地 name 和 email(访问远程库的时候让人知道你是谁)

```bash
git config --global user.name "missannil"
   git config --global user.email "missannil@163.com"
```

2. 通讯协议配置 生成 ssh 协议秘钥，秘钥文件在用户根目录的.ssh 目录(私钥 id_rsa 公钥 id_rsa.pub)

```bash
ssh-keygen -t rsa -C "panjinhry@163.com"
```

4. 测试链接 (有询问 选 yes 或 enter)

```bash
ssh -T git@gitee.com
# Hi missannil! You've successfully authenticated, but GITEE.COM does not provide shell access.
```

5. 如果是私有项目 需要在 gitee 仓库中上加入这个计算机的公钥， 这样此计算机可以通过验证,访问 gitee 上仓库。

## 同一台电脑使用多个公钥 clone pull push 对应 git 仓库

ssh-keygen -t rsa -C "panjinhry@163.com" 生成密钥 默认 2 个文件 `~/.ssh/id_rsa 和 id_rsa.pub`
gitee 不允许 多个账户使用同一公钥 比如 自己的 gitee 账户(missannil@163.com)和公司的账户(pjhry@163.com)
默认情况下只有`~/.ssh/id_rsa.pub`一个公钥，添加到一个 gitee 账户后，后续无法添加
所以目标是 同一电脑 生成多个公钥，分别添加对应的 gitee 账户，实现正常 clone push pull 等

1. 建立各自的 gitee 账户的公钥

```bash
#个人账户的密钥
ssh-keygen -t rsa -C "missannil@163.com" -f ~/.ssh/missannil_rsa
#公司账户的密钥
ssh-keygen -t rsa -C "pjhry@163com" -f ~/.ssh/pjhry_rsa
```

![生成ssh-keygen](./%E7%94%9F%E6%88%90ssh-keygen.png) 2. 建立/修改.ssh 的配置文件
在`~/.ssh/`下建立 config 文件(无需后缀)如下

```bash
# 个人配置
    # 别名
    Host missannil
    # gitee或github网站
    HostName gitee.com
    # 认证 公钥
    PreferredAuthentications publickey
    # 公钥文件 地址
    IdentityFile ~/.ssh/missannil_rsa
    # 用户名
    User missannil
# 公司配置
    Host pjhry
    HostName gitee.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/pjhry_rsa
    User pjhry
```

3. 测试

```bash
$ ssh -T git@missannil
# Hi missannil! You've successfully authenticated, but GITEE.COM does not provide shell access.
$ ssh -T git@pjhry
# Hi pjhry! You've successfully authenticated, but GITEE.COM does not provide shell access.
```

3. 克隆项目
   把 gitee.com 变为对应 ssh config 中的别名 即可实现对应的公钥验证

```bash
$ git clone git@missannil:xxx/yyy.git
# or
$ git clone git@pjhry:aaa/bbb.git
```

4. 修改已有项目的 remote 实现 pull 和 push 等

```bash
# origin = git@gitee.com:missannil/notes.git
git remote remove origin

git remote add origin git@missannil:missannil/notes.git
```

5. 如果项目中有子项目，还可以为子项目设置对应的 Host 别名 或者 把公司或个人的名字设置为默认的 id_rsa 这样别名也可以映射到 id_rsa,默认的也可以找到公钥(默认为 id_rsa)

## 克隆远程仓库(分支)

1. 自动建立本地仓库，并拉去远程库的默认分支(HEAD 所在分支)到本地。默认 directory 为远程库名字
   `git clone git@gitee:<remoteRepositoryName> [directory]`

2. 克隆远程库指定分支

`git clone -b <branch> git@gihub:<remoteRepositoryName> [directory]`

3. 自动拉取全部子模块

`git clone  git@gihub:<remoteRepositoryName> [directory]  --recurse-submodules`

## 建立分支

```bash
git branch -c <branchName>  #建立新分支
  git switch -t origin/dev    #建立一个新分支 并同步 origin 库下的 dev 分支
```

## 跳转分支

```bash
git switch <branchName>    [-c 没有自动建立分支并跳转]
```

## 删除分支

```bash
git branch -d <branchName> #如果有改动会删除不了
   git branch -D <branchName> #强行删除分支
   git push origin --delete <branchName> #删除远程分支，慎用啊
```

## 提交分支

```bash
# 提交本地分支到远程分支上 如下

      git push <remoteName> <localBranceName>:<remoteBranchName> #如果没有关联过，以后在push的时候想要默认上游 就在第一次push的时候加上关联 git push --set-upstream origin master

      # 例如再master分支下提交代码本地init分支到远程dev分支
      git push origin init:dev

      # 如果就是想提交当前所在分支 好比上方 不再master分支下提交，而是再init分支提交 如下

      git push origin HEAD:dev   # HEAD表示当前指针所在分支

      # 如果想推送当前分支到远程的同名分支 如下

      git push origin

      # 如果想推送到的远程库名字是默认名(假设 默认关联的远程库名字为 origin)

      git push  # 表示推送 当前分支到默认关联的远程库中的同名分支下
```

## fetch merge 分支

当你 pull
远程分支后，修改分支后，想提交的时候，发现别人已经对远程分支提交了，那么你需要把远程最新提交的分支改变内容加入到你当前要提交的分支下，才可以提交，这时候可以先
fetch 看下远程最新提交了什么和你的提交是否有重图，修改过后再 merge 到你的分支，最后再提交到远程分支

```bash
git fetch origin <branchName> #多人开发，合并前查看远程分支更改情况时使用,会得到FETCH_HEAD
   git log -p FETCH_HEAD #查看fetch得到的分支最新更改 会有提示对比当前的更改
   git merge FETCH_HEAD # 如果分支更改和当前不冲突 合并分支
```

## push 推送分支到远程分支

```bash
push <remoteResponName> <localBranchName> <remoteBranchName> # push
```

## git restore 工作区的恢复还原

```bash
git restore --staged |-S  <fileName> # (git restore -S .)
   #  将提交到暂存区的修改撤出，但不会撤销文件的更改 与add相反

   git restore <fileName>   # (git restore .)
   #  将不在暂存区的文件(未add的文件)的更改撤销 (未 trace 的管不到)
```

## git clean [官方](https://git-scm.com/docs/git-clean)

> 递归删除(当前目录下)未追踪的文件(不删除.gitignore 忽略的文件)

```bash
git clean [-d] [-f] [-i] [-n] [-q] [-e <pattern>] [-x | -X] [--] [<pathspec>…​]
```

- -n `显示将要删除的文件,但不会执行`

- -x `包含在.gitignore忽略的文件`

- -f `强制删除`

- -d `目录也删`

## gitee commit 相关

1. 要关联哪个 issue 就需要带 #issue_ident 会在 issue 的动态提示中新增提交 id
2. 要修改 issue 状态 就在 #issue_ident 前面加上 状态关键字 closed
3. 要把 commit message 信息带到评论里面，就在前面加上 comment

   ```bash
   git commit -am 'closed commet #issue_ident 这段信息会出现在issue的评论中'
   ```

   ````bash
                                                                                                                           git commit -m 'fix #issue_identity'  # 把issue状态改为 完成

                                                                                                                           # 状态关键字  完成：close fix

                                                                                                                           git commit -m 'comment #issue_identity' # 带comment
                                                                                                                           # 评论关键字 comment, reply
                                                                                                                           ```
   ````

- git push <远程主机名> <本地分支名> <远程分支名>

1. git push origin dev

   省略远程分支名，表示推送到 origin 上与本地分支同名分支，没有会自动创建，例子中本地 dev 分支将推送到 origin 对应的 dev
   分支，如果没有，会在 origin 上建立 dev 分支

2. git push origin --delete master

   删除远程 origin 分支的 master 分支

3. git push origin

   将当前分支推送到 origin 关联的分支上，前提要 git remote add origin

4. git push

如果当前分支只关联一个远程库 都可以省略了。git2.0 之后就是只会把当前分支推送到远程库对应的分支(这种方式叫 simple)，2.0
之前是会把当前仓库所有分支都推送到远程库(这种方式叫 matching)。想要改变方式看下面 命令 5

如果多个远程关联库,第一次 push 时候加上-u(git push -u origin master)
会自动把当前推送的远程库作为默认远程关联库，以后就直接 git push 就可以了

5. git config --global push.default matching

   git config --global push.default simple

   改变 push 时候默认方式 2.0 之后默认 simple 方式知推送当前分支 2.0 之前时 matching 都推送

6. git config -l 看到 push 设置

7. git push -u origin

8. git push --all origin

推送当前所有分支到 origin 没有对应的远程分支就会自动建立远程分支

9. git push origin --tags

想要推送分支而且还推送标签 用--tags 不带时不会推送 tags 的

- git fetch <远程库名> <分支名>

1. git fetch origin master

获取远程关联库 origin 的 master 分支 commit，但是不会 merge 到当前库的 master

2. git fetch origin

获取远程关联库 origin 所有的分支 commit 不会 merge

3. git log -p FETCH_HEAD

查看 fetch 取回的 commit 有什么改变 判断是否 merge 或修改

- git pull <远程主机名> <远程分支名>:<本地分支名>

1. git pull origin master:dev

把远程 origin 库的 master 分支拉取并 merge 到本地 dev 分支上 省略本地分支会默认 merge 到当前分支上 比如 git
pull origin master 会 merge 当当前分支上，git pull origin 就是把默认分支拉去过来了。不一定是 master。

```bash
   git pull origin aaa:bbb  拉去origin库的aaa分支合并到本地的bbb分支上 记得如果已#号等非法字符开头 需要加引号才可以

   git pull origin '#1F3FJ':#1F3FJ  这样是可以的
```

## git reset

git reset 命令用于回退版本，可以指定退回某一次提交的版本。

git reset 命令语法格式如下：

```bash
git reset [--soft | --mixed | --hard] [HEAD]
```

- --soft 保留最近一次暂存区记录,工作区不变。

- --mixed 为默认参数,清空暂存区工作区不变,好比--soft 后多了一个`restore -S .`.
  实例:

```bash
$ git reset HEAD^            # 回退所有内容到上一个版本
$ git reset HEAD^ hello.php  # 回退 hello.php 文件的版本到上一个版本
$ git  reset  052e           # 回退到指定版本
```

- --hard 清空暂存区(staged)和工作区,好比--mixed 后接 `git restore .`

## git cherry-pick

对于多分支的代码库，将代码从一个分支转移到另一个分支是常见需求。

这时分两种情况。一种情况是，你需要另一个分支的所有代码变动，那么就采用合并（git merge）。另一种情况是，你只需要部分代码变动（某几个提交），这时可以采用
Cherry pick。

![cherry-pick](./商家端/123.png)

1. 在当前分支上提交选中的提交 `$ git cherry-pick <commitHash>`
2. 在当前分支上提交某个分支的最新提交 `$ git cherry-pick feature`
3. 在当前分支上提交多个提交 `$ git cherry-pick <HashA> <HashB>`这会在当前分支生成两个对应的新提交
4. `$ git cherry-pick A..B`这个命令可以转移从 A 到 B 的所有提交。它们必须按照正确的顺序放置：提交 A 必须早于提交
   B，否则命令将失败，但不会报错。 注意，使用上面的命令，提交 A 将不会包含在 Cherry pick 中。如果要包含提交 A，可以使用下面的语法。
   `$ git cherry-pick A^..B`
5. 配置项 git cherry-pick 命令的常用配置项如下。

（1）-e，--edit

打开外部编辑器，编辑提交信息。

（2）-n，--no-commit

只更新工作区和暂存区，不产生新的提交。

（3）-x

在提交信息的末尾追加一行(cherry picked from commit ...)，方便以后查到这个提交是如何产生的。

（4）-s，--signoff

在提交信息的末尾追加一行操作者的签名，表示是谁进行了这个操作。

（5）-m parent-number，--mainline parent-number

如果原始提交是一个合并节点，来自于两个分支的合并，那么 Cherry pick 默认将失败，因为它不知道应该采用哪个分支的代码变动。

-m 配置项告诉 Git，应该采用哪个分支的变动。它的参数 parent-number 是一个从 1 开始的整数，代表原始提交的父分支编号。

$ git cherry-pick -m 1 <commitHash> 上面命令表示，Cherry pick 采用提交 commitHash 来自编号 1
的父分支的变动。

一般来说，1 号父分支是接受变动的分支（the branch being merged into），2 号父分支是作为变动来源的分支（the branch
being merged from）。

6. 代码冲突 如果操作过程中发生代码冲突，Cherry pick 会停下来，让用户决定如何继续操作。

（1）--continue

用户解决代码冲突后，第一步将修改的文件重新加入暂存区（git add .），第二步使用下面的命令，让 Cherry pick 过程继续执行。

$ git cherry-pick --continue （2）--abort

发生代码冲突后，放弃合并，回到操作前的样子。

（3）--quit

发生代码冲突后，退出 Cherry pick，但是不回到操作前的样子。

7. 转移到另一个代码库 Cherry pick 也支持转移另一个代码库的提交，方法是先将该库加为远程仓库。

$ git remote add target git://gitUrl 上面命令添加了一个远程仓库 target。

然后，将远程代码抓取到本地。

$ git fetch target 上面命令将远程代码仓库抓取到本地。

接着，检查一下要从远程仓库转移的提交，获取它的哈希值。

$ git log target/master 最后，使用 git cherry-pick 命令转移提交。

$ git cherry-pick <commitHash>

## git revert 重做之前 commit 做一次新的提交 保留之后 commit

比如 log 里面有 5 次提交，发现第二次提交出现 bug 那么想修复第二次提交又不影响后面的提交，用 revert

`git revert -n <commit_id>` -n 代表不自动提交，当返回到的 commit 和当前没有冲突就会自动出现 vim 框，esc :wq
可快速提交

`git revert --quit` 退出 revert 状态 但是保留了更改，需要 `git restore -S .`
并且`git restore .`回到当初状态

当你修改 bug 或者提交一个任务的时候，可能在任务分支上提交了多次，当你直接 merge 当开发分支时候，开发分支就有很多你的提交记录，不够清晰，通过
rebase 可以把多次分支进行合并管理

```bash
git rebase -i <commit_id>  #从HEAD到 commit_id进行管理 进入到vim edit 页面  更加下面的提示 通过在头部 表明 p s r 等完成编辑 编辑后，所有选中的提交就变为一次更改了，还需要git rebase --continue 编辑提交信息
  git rebase --continue  编辑提交信息
```

## 修改文件的提交

加入 此次修改了加入 git 的文件 xxx 那么 无需 git add xxx 直接执行下面即可提交对 xxx 的更改

```git
git commit -am 'git add. && git commit -m'
```

但是如果时新增文件 即 git 没有追踪过的,-am 无法在提交中加入新文件 还需要 git add newfile 或 git add .

## 修改上一次提交信息

```
git commit --amend -m '用这个提交信息把上一次提交信息覆盖'
```

## git clean 清除未 track 的文件或文件夹

1. `git clean -n` 显示将要删除的当前目录新增的文件 不包含新增的文件夹和其内部的文件
2. `git clean -f <path>`将会删除新增的文件，但不会删除新增的文件夹（包括这个文件下的文件）
3. `git clean -df` 使用些命令则会删除新增的文件和新增的文件夹
4. `git clean -xdf` 使用此命令则会删除新增的文件和新增的文件夹，包括被.ignore 文件过滤文件或文件夹，所以这个命令最好是不要用。

## git stash

当我们当前工作只完成了部分,而要转去别的分支或提交去修复bug等事情。可以通过stach命令对修改的代码做存储(stash)

```bash
git stash list [<log-options>]
git stash show [-u | --include-untracked | --only-untracked] [<diff-options>] [<stash>]
git stash drop [-q | --quiet] [<stash>]
git stash pop [--index] [-q | --quiet] [<stash>]
git stash apply [--index] [-q | --quiet] [<stash>]
git stash branch <branchname> [<stash>]
git stash [push [-p | --patch] [-S | --staged] [-k | --[no-]keep-index] [-q | --quiet]
      [-u | --include-untracked] [-a | --all] [(-m | --message) <message>]
      [--pathspec-from-file=<file> [--pathspec-file-nul]]
      [--] [<pathspec>…​]]
git stash save [-p | --patch] [-S | --staged] [-k | --[no-]keep-index] [-q | --quiet]
      [-u | --include-untracked] [-a | --all] [<message>]
git stash clear
git stash create [<message>]
git stash store [(-m | --message) <message>] [-q | --quiet] <commit>
```

简单用法:

当手头工作没有完成时，先把工作现场 git stash 一下，然后去修复 bug，修复后，再 git stash pop，回到工作现场；

在 master 分支上修复的 bug，想要合并到当前 dev 分支，可以用 git cherry-pick <commit>命令，把 bug
提交的修改“复制”到当前分支，避免重复劳动。

- 暂存当前分支 git stash save 'message'
- 查看暂存分支 git stash list
- 恢复暂存 git stash apply 默认 stash@{0} 应用某个存储,但不会把存储从存储列表中删除，默认使用第一个存储,即
  stash@{0}，如果要使用其他个，git stash apply stash@{$num} ， 比如第二个：git stash apply
  stash@{1}
- 删除暂存 git stash drop stash@{$num} ：丢弃stash@{$num}存储，从列表中删除这个存储
- 恢复暂存并删除 git stash pop
- 多个暂存恢复 git stash apply stash@{0}
- 当前分支添加一次 其他分支的 commit git cherry-pick 4c805e2

- git stash clear ：删除所有缓存的 stash

## 相关的 shell 命令

1. mkdir xxx 建立目录 make directory
2. rmdir xxx 删除目录 不为空 需要加 -rf
3. touch aaa.txt 创建一个空文件
4. vim aaa.txt 打开编辑器
5. ssh-keygen -t rsa -C "missannil@163.com"
6. 查看 ssh 公钥
   - cd ~/.ssh 进入 ssh 目录
   - ls or dir 查看文件
   - cat id_rsa.pub 或 vim id_rsa.pub 打开:q! 退出

## git config --global core.autocrlf false

当你提交的时候 会出现

```bash
warning: LF will be replaced by CRLF in README.md.
   The file will have its original line endings in your working directory
```

看下面有关 git config --global core.autocrlf false 的讲解

window 换行和 lunix os 不一样， window 结尾用 CRLF 表示 lunix os 用 LF 当你保存 git 文件时，git
默认(true)会把 windows 的 crlf 保存为 lf 方便 lunix os 在取出时候没问题，而 windows 取出时，会在转变过来 如果改为
input 就是进转变，出不转变 改为 false 就是 不转变，适合都在 windows 上办公 不存在兼容问题了！

## git config --global --add safe.directory "\*"

好像最新版本的 git 增加了安全性 在操作 git 仓库时 需要授权 \* 是全部 也可分别制定。`git config --global --add safe.directory D:/Desktop/xixi-xuanxuan/miniprogram/h-components`

## 禁用 Fast forward

    准备合并dev分支，请注意--no-ff参数，表示禁用

     ```git merge --no-ff -m "merge with no-ff" dev```

## tag

git tag <tagname>用于新建一个标签，默认为 HEAD，也可以指定一个 commit id；

git tag -a <tagname> -m "message" commit_id 其中-a 是标签名 -m 是标签描述

git tag 可以查看所有标签。

git show <tagname> | 空 标签不是按时间顺序列出，而是按字母排序的。可以用查看标签信息：

## gitignore 失效的问题 删除 git 缓存

当我们将 .gitignore 文件配置好后，却往往不能生效。这是因为 .gitignore 只能忽略那些没有被追踪(track)的文件， 因为 git
存在本地缓存，如果文件已经纳入了版本管理，那么修改 .gitignore 是不能失效的。那么解决方案就是要将 git 的本地缓存删除，然后重新提交。

```bash
# 删除已跟踪的目录或文件的缓存,但不会删掉你的文件
git rm  --cached <dir | file>
# -r 表示递归(recursive)删除,即目录下的所有目录和文件都会被删除
git rm -r --cached <dir >
# . 表示删除所有缓存的目录和文件
git rm  --cached .
```

### 合并多次提交为一次提交

加入要修复一个 bug 你把 dev 分支 pull 下来，建立了 fixBug 分支 然后再 fixbug 上面进行了多次提交，bug 修复后，你想
merge 到 dev 分支时候

```bash
git merge --squash fixBug # 这只是把所有的更改都拿过来了
  git commit -m '我修复了bug' #做一次重新提交
```

这样，就把在分支里做的全部修改合并成一次提交 merge 到 dev 上面了。

### git submodule 总结

#### 准备工作.

1. 在 gitee 上建主库 main 路径为 https://gitee.com/missannil/main.git 包含默认 README.md 在
   gitee 上建子库 sub 路径为 https://gitee.com/missannil/sub.git 包含默认 README.md

2. 克隆 main 项目到本地 `git clone https://gitee.com/missannil/main.git`

#### 项目中加入一个子项目(模块)

`git submodule add [repository path]`

进入 main 文件夹,加入子模块 sub

```bash
$ git submodule add git@gitee.com:missannil/sub.git
Cloning into 'C:/Users/missannil/Desktop/testdd/main/sub'...
remote: Enumerating objects: 10, done.
remote: Counting objects: 100% (10/10), done.
remote: Compressing objects: 100% (8/8), done.
remote: Total 10 (delta 1), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (10/10), done.
Resolving deltas: 100% (1/1), done.
warning: LF will be replaced by CRLF in .gitmodules.
The file will have its original line endings in your working directory
```

默认情况下,git 会在主项目目录下创建与存储库同名的目录，在本例中为“sub”。并拉取 sub 的远程提交到此目录下。

main 目录下会有 2 个更改

```
missannil@DESKTOP-PQSO1I8 MINGW64 ~/Desktop/testdd/main (master)
$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   .gitmodules
        new file:   sub
```

.gitmodules 中 写着所有子项目的 名字 路径和 url
`[submodule "sub"] path = sub url = https://gitee.com/missannil/sub.git`

sub 为子模块同名目录 里面是远程的最新提交

接下来我们提交主项目

```bash
missannil@DESKTOP-PQSO1I8 MINGW64 ~/Desktop/testdd/main (master)
$ git add .

missannil@DESKTOP-PQSO1I8 MINGW64 ~/Desktop/testdd/main (master)
$ git commit -m 'add sub'
[master f4f7dae] add sub
 2 files changed, 4 insertions(+)
 create mode 100644 .gitmodules
 create mode 160000 sub

missannil@DESKTOP-PQSO1I8 MINGW64 ~/Desktop/testdd/main (master)
$ git push
Enumerating objects: 4, done.
Counting objects: 100% (4/4), done.
Delta compression using up to 12 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 359 bytes | 359.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
remote: Powered by GITEE.COM [GNK-6.2]
To gitee.com:missannil/main
   3e56a65..f4f7dae  master -> master
```

为了方便后续操作，先删除本地 main 项目目录

#### 克隆一个有子模块的项目

1. 克隆主项目

```bash
missannil@DESKTOP-PQSO1I8 MINGW64 ~/Desktop/testdd
$ git clone git@gitee.com:missannil/main
Cloning into 'main'...
remote: Enumerating objects: 9, done.
remote: Counting objects: 100% (9/9), done.
remote: Compressing objects: 100% (8/8), done.
remote: Total 9 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (9/9), done.
```

查看 main 目录,会发现.gitmodules 文件 和 sub 目录 ,但 sub 目录中无文件,这是因为 clone 命令 不会自动把子模块代码拉取下来。
你还需要通过 submodule init 和 submodule update 完成子项目的初始化和拉取提交

2. 初始化和更新子模块

```bash
missannil@DESKTOP-PQSO1I8 MINGW64 ~/Desktop/testdd/main (master)
$ git submodule init
Submodule 'sub' (git@gitee.com:missannil/sub.git) registered for path 'sub'

missannil@DESKTOP-PQSO1I8 MINGW64 ~/Desktop/testdd/main (master)
$ git submodule update
Cloning into 'C:/Users/missannil/Desktop/testdd/main/sub'...
Submodule path 'sub': checked out '8b01b65cc2848bd8377e99aed763cee67b2b4053'
```

上述两个操作可以简化为 `git submodule update --init`

这里要注意的是 git submodule update 拉取的是当前主项目中记录的子模块提交记录。很有可能不是子模块的最新提交。
如果你要想拉取子项目的最新提交 需要使用 `git submodule update --init --remote`

还有些问题,假如子模块还有自己的子模块，那么上述操作无法生效,你不得不进入子模块,再进行上述的操作
假如还有子模块的子模块还有还子模块呢？git 已经为我们准备好了 --recursive 参数。

```bash
$ git submodule update --init --remote --recursive
Submodule 'sub' (git@gitee.com:missannil/sub.git) registered for path 'sub'
Cloning into 'C:/Users/missannil/Desktop/testdd/main/sub'...
Submodule path 'sub': checked out '8b01b65cc2848bd8377e99aed763cee67b2b4053'
```

这样就完成了所有子模块的 init 和 update 了。

3. 更方便的 clone

克隆时

```bash
$  git clone --recursive git@gitee.com:missannil/main
```

可配置全局 在 pull 时自动更新子模块
`git config --global submodule.recurse true`

相当于 在每个有子模块的项目下都进行一个 `git submodule update --init` 注意:不是拉取远程最新的提交,而是主项目的子项目提交记录。
如果想更新远程最新提交,还需要在对应目录 `git submodule update --remote`.

4. 游离的 HEAD 在克隆了一个有子模块的项目后,进入子模块目录 查看分支会看到下面情形:

```bash
missannil@DESKTOP-PQSO1I8 MINGW64 ~/Desktop/testdd/main (master)
$ cd sub

missannil@DESKTOP-PQSO1I8 MINGW64 ~/Desktop/testdd/main/sub ((8b01b65...))
$ git branch
* (HEAD detached at 8b01b65) # 游离分支指向子模块的提交。
  master  # 拉取数据时远程库的master
```

5. 设置全局配置 diff.submodule log 在 main 中运行 git diff 看不到子模块提交的更改 如不想每次都运行 git diff
   --submodule 可以将 diff.submodule 设置为 “log” 来将其作为默认行为
   `git config --global diff.submodule log`

6. 指定子模块关联的分支 在使用`git submodule update --remote`时,默认拉取远程的 master 分支到子模块
   你可以设定你关联的拉取分支向下面这样
   ```bash
   $ git config -f .gitmodules submodule.sub.branch dev
   ```
   查看.gitmodules 文件
   ```
   [submodule "sub"]
      path = sub
      url = git@gitee.com:missannil/sub.git
      branch = dev
   ```
7. 子模块提要 `$ git config status.submodulesummary true` 在主模块运行 git status
   会看到子模块的改动提要 可以设置值为 1 2 3 代表提要行数。true 代表全部

#### 子模块的提交

1. 如果在游离分支上做 add 和 commit 后,可以通过 `git push origin HEAD:master`来提交

2. 当你修改了子模块，忘记提交，但是主模块却提交了，别人克隆你的主模块后，无法获取到对应的子模块提交， 要避免这样的错误
   可以让 git 在推送前对子模块是否已经推送做检查,如果有未推送的，就停止。
   `git config push.recurseSubmodules check`
   或让 git 在推送前对没有推送的子模块推送一边,这样有无法推送的也会停止,好处在于会自动推送子模块一次。而不是单纯的检查

`git config push.recurseSubmodules on-demand`

#### 更换仓库地址

1. 如果子仓库在 github 上，想换到 gitee 上，。。。待续！

### 删除子模块

1. 删除子模块文件夹

```git
$ git rm --cached assets
$ rm -rf assets
```

2. 删除.gitmodules 文件中相关子模块信息

```
[submodule "assets"]
  path = assets
  url = https://github.com/maonx/vimwiki-assets.git
```

3. 删除.git/config 中的相关子模块信息

```
[submodule "assets"]
  url = https://github.com/maonx/vimwiki-assets.git
```

4. 删除.git 文件夹中的相关子模块文件

```
$ rm -rf .git/modules/assets
```

### 标签 tag

1. 创建标签 `git tag -a v1.4 -m 'create v1.4 version`
2. 列出标签 `git tag` 列出所有标签 or `git tag -l "v1.4*"` 列出指定通配符标签 需要加 -l
3. 追加标签 `git tag -a v1.2 9fceb02` 给某个之前的提交追加标签
4. 共享标签 `git push origin v1.5` 推送单个标签到远程 `git push origin --tags` 推送所有标签到远程

5. 删除标签 `git tag -d <tagname>`本地删除 `git push origin --delete <tagname>` 远程删除

```
```

## vscode 设置默认终端为 bash

```json
{
  "terminal.integrated.profiles.windows": {
    "GitBash": {
      "path": "D:\\Program Files\\Git\\bin\\bash.exe"
    }
  },
  "terminal.integrated.defaultProfile.windows": "GitBash"
}
```

### git add

1. git add . : 会将当前工作区中当前目录(包括子目录)下的所有新文件和对已有文件的改动提交至暂存区，但不包括被删除的文件。
2. git add -u : git add --update 的简写形式，它只会监控当前整个工作区中之前已被 add 的文件，即已被跟踪(tracked)的文件，也就是只会将当前整个工作区中被修改和被删除的文件提交至暂存区。而新文件因为未被跟踪(untracked)，所以不会被提交至暂存区。
3. git add -A: git add --all 的简写形式，它会将当前整个工作区中所有的文件改动提交至暂存区，包括新增、修改和被删除的文件，不受当前所在目录限制。

注意：你会看到有些文章说 git add -A 属于 git add . 和 git add -u 功能的合集，这是不对的。因为 git add . 只会提交当前目录(包括子目录)下的新文件和对已有文件的改动，而 git add -A 不受当前目录限制。也就是说，git add . 和 git add -u 功能的合集只能属于 git add -A 功能的子集。
