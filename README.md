# 鬼斩的 Maven 构建页面

此仓库包含构建页面前端代码，以及构建结果（也许以后会搬迁）。

## 关于本项目

Github Actions 提供了一定的自动构建功能，但下载构建结果需要GitHub账号，且构建结果90天后就过期了。  
这可能会难倒部分小白。而且鉴于日益不稳定的 GitHub 访问环境（懂得都懂），某些日期甚至没法访问GitHub。

于是我就搞了一个这样的构建站。使用 Cloudflare 来部署，减少被封锁的可能，且无需 GitHub 账号，构建结果不会过期。

## 接入构建站

要想接入构建站，你可以选择以下任意方式：

* 在本仓库的问题追踪器中提交接入[申请](https://github.com/ybw0014/maven-builds/issues)
* fork 仓库，修改 `/static/repos.json`，添加你的仓库，然后提交 Pull Request

## 接入自动更新

构建站支持自动更新功能，就像 Slimefun 及附属插件的官方版本那样。  
接入构建站并不一定需要接入自动更新功能，这是可选的。  

要接入自动更新，你需要在`pom.xml`中添加[GuizhanLib](https://github.com/ybw0014/GuizhanLib)为前置，并在插件启用时启动自动更新检测。

### 添加前置

你需要在`pom.xml`中添加Jitpack的仓库:

```
    <repositories>
        <repository>
            <id>jitpack.io</id>
            <url>https://jitpack.io</url>
        </repository>
    </repositories>
```

并将GuizhanLib添加为附属:

```
    <dependency>
        <groupId>net.guizhanss</groupId>
        <artifactId>GuizhanLib</artifactId>
        <version>将此处替换为版本号</version>
        <scope>compile</scope>
    </dependency>
```

在`build`中，你需要将GuizhanLib迁移到你的包中，避免与其他插件冲突:

```
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.2.4</version>

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
                                <!-- 重要: 如果你没有用到汉化库的语言功能，请保留下一行，否则请移除 -->
                                <exclude>minecraft.*</exclude>
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

### 添加自动更新类

在插件的启用方法`onEnable`内，添加以下代码：

```java
        if (getConfig().getBoolean("options.auto-update") && // 注意这里，如果config.yml中直接是`auto-config`那就得把前面的`options.`去掉
            getDescription().getVersion().startsWith("Build")) { // 如果你修改了版本格式，按需修改。你也可以去除这一部分
            new GuizhanBuildsUpdater(this, getFile(), "你的用户名", "仓库名", "分支", false).start(); // 必须修改
        }
```

更新模块会：

1. 检查当前版本的格式是否与构建站中设置的格式一致，如果不一致，终止更新检测
2. 获取最新的成功构建的信息，并与当前版本比较，如果版本一致，则输出无需更新
3. 从构建站下载最新版本的jar，存放于`/plugins/updates`目录中，并提示重启后更新

目前更新版本不会更改文件名，所以需要在游戏内使用`/sf versions`来确认版本。
