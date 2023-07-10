# 本项目已经归档，请前往[v2](https://github.com/ybw0014/guizhan-builds-2)

# 鬼斩的构建页面

此仓库包含构建页面前端代码，以及构建结果（也许以后会搬迁）。

全球访问地址: https://builds.guizhanss.net/  
中国大陆镜像: https://builds.guizhanss.cn/

## 关于本项目

Github Actions 提供了一定的自动构建功能，但下载构建结果需要GitHub账号，且构建结果90天后就过期了。  
这可能会难倒部分小白。而且鉴于日益不稳定的 GitHub 访问环境（懂得都懂），某些日期甚至没法访问GitHub。

于是我就搞了一个这样的构建站。使用 Cloudflare 来部署，减少被封锁的可能，且无需 GitHub 账号，构建结果不会过期。

## 接入构建站

要想接入构建站，你可以选择以下任意方式：

* 在本仓库的问题追踪器中提交接入[申请](https://github.com/ybw0014/maven-builds/issues)
* fork 仓库，修改 `/static/repos.json`，添加你的仓库，然后提交 Pull Request

### 构建站配置

你可以在 `/static/repos.json` 中修改项目的构建设置，一个样例配置如下：

```yaml
    "ybw0014/DynaTech:master": {
        "type": "maven",
        "options": {
            "hidden": false,
            "customDir": "ybw0014/DynaTech-CN/master",
            "target": {
                "name": "DynaTech",
                "version": "Build {version} zh-CN(ybw0014) (git {git_commit})"
            }
        },
        "dependencies": {
            "Java": {
                "12": "Java 16+",
                "1": "Java 11+"
            },
            "Minecraft": {
                "12": "1.17+",
                "1": "1.14+"
            }
        }
    }
```

说明:

- `ybw0014/DynaTech:master` 部分为仓库信息，格式为`用户名/仓库名:分支`，需要完全按照这个格式来填写。
- `type` **(必填)** 配置类型，可填写以下内容：
    - `maven`: Maven 项目，将读取 pom.xml 并构建项目
    - `gradle`: Gradle 项目，将读取 build.gradle, settings.gradle, gradle.properties 并构建项目
    - `redirect`: 重定向项目，访问构建站时将重定向至新的仓库。在`options.repo`中设置仓库
- `options` **(必填)** 构建设置
    - `hidden` *(可选)* 是否在构建站列表中隐藏该仓库，默认为`false`。仅从构建站页面中的列表中隐藏，仍然可以通过输入网址访问
    - `customDir` *(可选)* 自定义构建目录，如果不指定则会使用默认的`用户名/仓库名/分支`作为构建目录
    - `target` **(必填)** 构建文件设置
        - `name` **(必填)** 构建名称，建议与 `plugin.yml` 中的 `name` 一致
        - `version` **(必填)** 版本格式，目前支持以下变量:
            - `{version}` 数字版本号
            - `{git_commit}` 7位的commit hash
            - `{Year}` 构建时间的年份(4位，例如：2022）
            - `{year}` 构建时间的年份(2位，例如：22）
            - `{Month}` 构建时间的月份(2位，例如：07）
            - `{month}` 构建时间的月份(不补0，例如：7）
            - `{Date}` 构建时间为一个月中的第几天
- `dependencies` 为依赖信息，将显示于构建站的下载页面
    - 信息前面的数字为最低版本。例如，样例中的，12及以上的版本会显示Java 16+，而12以下的版本则会显示 Java 11+


## 接入自动更新

请访问[该文档](/Auto-Update-zh.md)。

### 自动更新模块说明

更新模块会：

1. 检查当前版本的格式是否与构建站中设置的格式一致，如果不一致，终止更新检测
2. 获取最新的成功构建的信息，并与当前版本比较，如果版本一致，则输出无需更新
3. 从构建站下载最新版本的jar，存放于`/plugins/updates`目录中，并提示重启后更新

自动更新不会更改文件名，所以需要在游戏内使用`/sf versions`来确认插件的版本。
