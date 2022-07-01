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
    - `customDir` *(可选)* 自定义构建目录，如果不指定则会使用默认的`用户名/仓库名/分支`作为构建目录
    - `target` **(必填)** 构建文件设置
        - `name` **(必填)** 构建名称，建议与 `plugin.yml` 中的 `name` 一致
        - `version` **(必填)** 版本格式，目前支持以下变量:
            - `{version}` 数字版本号
            - `{git_commit}` 7位的commit hash
            - `{year}` 构建时间的年份
            - `{month}` 构建时间的月份
            - `{day}` 构建时间为一个月中的第几天
- `dependencies` 为依赖信息，将显示于构建站的下载页面
    - 信息前面的数字为最低版本。例如，样例中的，12及以上的版本会显示Java 16+，而12以下的版本则会显示 Java 11+


## 接入自动更新

构建站支持自动更新功能，就像 Slimefun 及附属插件的官方版本那样。  
接入构建站并不一定需要接入自动更新功能，这是可选的。  

要接入自动更新，你需要在`pom.xml`中添加[GuizhanLib](https://github.com/ybw0014/GuizhanLib)为前置，并在插件启用时启动自动更新检测。

### 添加依赖

#### Maven

你需要添加GuizhanLib为依赖:

最新版本为: [![Maven Central](https://img.shields.io/maven-central/v/net.guizhanss/GuizhanLib.svg?label=Maven%20Central)](https://search.maven.org/search?q=g:%22net.guizhanss%22%20AND%20a:%22GuizhanLib%22)
![GuizhanLib status](https://jitpack.io/v/net.guizhanss/GuizhanLib.svg)

```xml
    <dependency>
        <groupId>net.guizhanss</groupId>
        <artifactId>GuizhanLib</artifactId>
        <version>将此处替换为版本号</version>
        <scope>compile</scope>
    </dependency>
```

在`build`中，你需要将GuizhanLib迁移到你的包中，避免与其他插件冲突（如果已有`maven-shade-plugin`，只需要添加`relocation`即可）:

```xml
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.3.0</version>

                <configuration>
                    <!-- 你可以添加下面这一行，去除所有库中未使用的类，来减少生成jar的大小，非必须，但建议开启 -->
                    <minimizeJar>true</minimizeJar>
                    <relocations>
                        <!-- 重要: 你需要将以下relocation(迁移)部分添加到你的pom.xml中 -->
                        <relocation>
                            <pattern>net.guizhanss.guizhanlib</pattern>
                            <shadedPattern>将此处替换为你的软件包.guizhanlib</shadedPattern>
                        </relocation>
                    </relocations>

                    <filters>
                        <filter>
                            <artifact>*:*</artifact>
                            <excludes>
                                <exclude>META-INF/*</exclude>
                            </excludes>
                        </filter>
                    </filters>
                </configuration>

                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
```

#### Gradle

在`build.gradle`中添加Maven Central：
```groovy
repositories {
    mavenCentral()
}
```

并将GuizhanLib添加为依赖:

最新版本为: [![Maven Central](https://img.shields.io/maven-central/v/net.guizhanss/GuizhanLib.svg?label=Maven%20Central)](https://search.maven.org/search?q=g:%22net.guizhanss%22%20AND%20a:%22GuizhanLib%22)
![GuizhanLib status](https://jitpack.io/v/net.guizhanss/GuizhanLib.svg)

```groovy
dependencies {
    implementation 'net.guizhanss:GuizhanLib:将此处替换为版本号'
}
```

添加`shadowJar`插件，并迁移:

```groovy
plugins {
    id 'com.github.johnrengelman.shadow' version '7.1.2'
    id 'java'
}

shadowJar {
    relocate 'net.guizhanss.guizhanlib', '将此处替换为你的软件包.guizhanlib'
    minimize()
}
```

### 添加自动更新类

在插件的启用方法`onEnable`内，添加以下代码：

```java
        if (getConfig().getBoolean("options.auto-update") && // 注意这里，如果config.yml中直接是`auto-config`那就得把前面的`options.`去掉
            getDescription().getVersion().startsWith("Build")) { // 如果你修改了版本格式，按需修改。你也可以去除这一部分
            new GuizhanBuildsUpdater(this, getFile(), "你的用户名", "仓库名", "分支", false, "zh-CN").start(); // 必须修改
        }
```

更新模块会：

1. 检查当前版本的格式是否与构建站中设置的格式一致，如果不一致，终止更新检测
2. 获取最新的成功构建的信息，并与当前版本比较，如果版本一致，则输出无需更新
3. 从构建站下载最新版本的jar，存放于`/plugins/updates`目录中，并提示重启后更新

目前更新版本不会更改文件名，所以需要在游戏内使用`/sf versions`来确认版本。
