# npm笔记 {ignore=true}

[toc]

## 包的安装

1. 淘宝镜像地址

```bash
npm config set registry https://registry.npm.taobao.org
```

2. 查看当前npm下载地址

```bash
npm config get registry # https://registry.npm.taobao.org
```

3. 本地安装包

```bash
npm install jquery # npm i jquery
#安装中出现warn没关系，不出现error就ok
#安装完会在同目录下的node_module文件夹下出现包的所有文件,不希望git监控node_modules文件夹 需要加入.gitignore文件，并在其中加入 node_modules字样就可忽略
#如果下载的包中还依赖别的依赖包，npm会自动下载，所以有可能下载一个包，npm会下载很多包加入在node_modules里面
# 如果下载的自带一些命令，可以通过npx 命令 来调用，npx是npm全局命令，当调用npx的时候，npm工具会在当前目录下的node_modules/.bin下面寻找这个命令，也就是说，下载的包如果自带命令会自动加入到当前node_modules/.bin目录下面 比如npx mocha
```

4. 全局安装

```bash
npm i -g jquery
# 查看全局目录 npm config get prefix
# 基本不用全局安装
```

## 配置文件package.json

1. 创建配置文件

```bash
npm init
#name 默认名字是当前文件夹名字，但是不能是中文
#version 版本号  主版本  次版本  补丁版本
#description 包的描述
#main: 默认indexjs
#repository: git地址
#author: 作者
#homepage: 官网地址
#license:许可协议
npm init --yes 或  npm init -y
```

2. 包的依赖
   dependencies 环境依赖(开发和生产都需要的依赖)
   devdependencies 开发依赖(只在开发环境的时候用,生产坏境不用)
3. 安装依赖
   ```bash
       npm i #安装package.json中所有的依赖(包含开发和坏境依赖)

       npm i --production #只安装环境依赖 就是dependencies里面的依赖

       npm i -D 包名 或 npm --save-dev 包名 都是把包当做开发依赖
   ```

## 包的使用

导入规则 (node规则)
相对路径 ./ ../xxx 先找路径下的xxx.js找不到就把xxx当文件夹如果有就看文件夹下面的package.json的main路径，没有package.json或者没有main配置就默认找文件夹下面的index.js

非相对路径 没有./ ../ 就会先在当前的node_modules目录下找模块名.js如果没有就看有没有同名文件夹,有的话读取文件夹中package.json的main的文件没有main配置找index.js，上述没有就 一级一级向上找 同规则；

内置模块 require(fs) 直接引入不会找

## npm配置 script

1. 配置script
   {
   "dev":"node index.js"
   "build:"npx nodemon index.js" 脚本中可以省略npx
   }
2. 运行方法 npm run dev 或 npm run build

3. 省略run 关键字
   当脚本名称是 test start stop时候 可以直接 运行 npm test npm start npm stop 省略中间的run

4. 省略npx 关键字
   脚本中的npx 可以省略掉

5. 如果脚本中没有配置start脚本，那么默认npm start 运行的是 当前目录下server.js文件 其实就是默认start脚本为node server.js

## 运行环境配置

1. 开发环境
2. 生产环境
3. 测试环境

## 其他npm命令

1. 安装指定版本包 `npm i xxx@3.1.2`
2. 查看包的安装路径

- 全局的 `npm root xxx -g`
- 开发环境(development) `npm root xxx`

3. 查看远程包的详细信息 `npm show(info) xxx`
4. 查看远程包的版本

- 最新版本 `npm show(info) xxx version`
- 全部版本 `npm show(info) xxx versions` 比上面多一个s

4. 查看本地包的信息

- 全局的加
  `npm ls -g` 查看所有包版本和所有包含的依赖
  `npm ls -g --depth=0` 查看所有包版本不包含依赖
  `npm ls -g --depth=1` 查看所有包版本包含一级依赖
- 开发环境(本地的) 去掉-g

1. 检查哪些包需要更新
   `npm outdated`
2. 更新包
   `npm update -g` 全局全部更新
   `npm update -g xxx`更新指定包
3. 更新npm本身
   `npm i -g npm`安装新的npm
4. 卸载指定包
   `npm un -g 包名`删除包
5. 查看npm的配置
   `npm config ls` ;分号打头的是注释
   `npm config ls --json`

## 包的发布

1. 把npm registry改为npm原地址
   `npm config delete registry`
2. 注册一个npm账号并完成邮箱认证
3. 登录 `npm login`
4. 查看登录账号`npm whoami`
5. 注销`npm logout`
6. 建立工程
7. 发布

## npm 安装错误

`npm i -g dprint`

`npm ERR!  disabled on this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=`

是因为这个包dprint的安全策略没有通过系统默认策略。win10拒绝它安装.

用管理员权限运行powershell `Set-ExecutionPolicy -ExecutionPolicy Unrestricted`

弹出的执行策略更改，先都关闭 选择A 安装完， 再改回N

### npm中的script字段

> Windows 系统使用cmd.exe执行 npm 脚本。类 Unix 系统使用/bin/sh执行 npm 脚本

1. **将 Windows 系统下 npm 脚本的默认 shell 修改为bash**
   `npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"`  
2. **将 Windows 系统下 npm 脚本的默认 shell 修改为powershell**

   `npm config set script-shell C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`

3. **恢复默认设置**

> `npm config delete script-shell`

> 注意：也可以通过手动修改.npmrc配置来指定 script-shell `script-shell=C:\Windows\System32\bash.exe`

4. bash & 同时 && 继续    powershell 1.0 使用 -and | -or 避免冲突前后表达式用括号括起来 (最新的powershell要实现用 && 和 || )
