# 接入自动更新

构建站支持自动更新功能，就像 Slimefun 及附属插件的官方版本那样。  
接入构建站并不一定需要接入自动更新功能，这是可选的。  

要接入自动更新，你需要在`pom.xml`中添加[GuizhanLib](https://github.com/ybw0014/GuizhanLib)为依赖，并在插件启用时启动自动更新检测。  
GuizhanLib目前已提供插件版本，因此也可以将插件版本[GuizhanLibPlugin](https://github.com/ybw0014/GuizhanLibPlugin)作为依赖。

## 使用 GuizhanLib 作为依赖

**注意：** 这是将GuizhanLib代码打包到你的插件中的方法。

### 添加依赖

#### Maven

如果你只需要自动更新模块，那么你需要添加`GuizhanLib-updater`为依赖。  
否则，添加所有需要的子模块作为依赖。  
你还可以添加`GuizhanLib-api`为依赖，这包含了所有的子模块。

需要将`scope`设置为`compile`来将 GuizhanLib 引入并打包到你的插件中。

GuizhanLib已发布到Maven Central，因此你不需要添加额外的仓库。  
如果你所处的地区访问Maven Central缓慢，可以自行搜索*使用Maven Central镜像*解决方案。

GuizhanLib的最新版本为: [![Maven Central](https://img.shields.io/maven-central/v/net.guizhanss/GuizhanLib.svg?label=Maven%20Central)](https://search.maven.org/search?q=g:%22net.guizhanss%22%20AND%20a:%22GuizhanLib%22)


```xml
    <dependency>
        <groupId>net.guizhanss</groupId>
        <artifactId>GuizhanLib-updater</artifactId>
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
                <version>3.4.0</version>

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

GuizhanLib的最新版本为: [![Maven Central](https://img.shields.io/maven-central/v/net.guizhanss/GuizhanLib.svg?label=Maven%20Central)](https://search.maven.org/search?q=g:%22net.guizhanss%22%20AND%20a:%22GuizhanLib%22)

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
        if (getConfig().getBoolean("options.auto-update") && // 注意这里，需要与config.yml中配置项的路径一致
            getDescription().getVersion().startsWith("Build")) { // 如果你修改了版本格式，按需修改。你也可以去除这一部分
            new GuizhanBuildsUpdater(this, getFile(), "你的用户名", "仓库名", "分支", false).start(); // 必须修改
        }
```


## 使用 GuizhanLib 插件版作为依赖

**注意：** 该方法需要用户安装 GuizhanLib 插件版，可[在此](https://builds.guizhanss.net/ybw0014/GuizhanLibPlugin/master)下载。

### 添加依赖

#### Maven

你需要添加`GuizhanLibPlugin`作为依赖。

将`scope`设置为`provided`，你不需要将 GuizhanLib 的内容打包到你的插件中。

GuizhanLib已发布到Maven Central，因此你不需要添加额外的仓库。  
如果你所处的地区访问Maven Central缓慢，可以自行搜索*使用Maven Central镜像*解决方案。

GuizhanLibPlugin的最新版本为: [![Maven Central](https://img.shields.io/maven-central/v/net.guizhanss/GuizhanLibPlugin.svg?label=Maven%20Central)](https://search.maven.org/search?q=g:%22net.guizhanss%22%20AND%20a:%22GuizhanLibPlugin%22)


```xml
    <dependency>
        <groupId>net.guizhanss</groupId>
        <artifactId>GuizhanLibPlugin</artifactId>
        <version>将此处替换为版本号</version>
        <scope>provided</scope>
    </dependency>
```


#### Gradle

在`build.gradle`中添加Maven Central：

```groovy
repositories {
    mavenCentral()
}
```

并将GuizhanLibPlugin添加为依赖:

GuizhanLibPlugin的最新版本为: [![Maven Central](https://img.shields.io/maven-central/v/net.guizhanss/GuizhanLibPlugin.svg?label=Maven%20Central)](https://search.maven.org/search?q=g:%22net.guizhanss%22%20AND%20a:%22GuizhanLibPlugin%22)

```groovy
dependencies {
    compileOnly 'net.guizhanss:GuizhanLibPlugin:将此处替换为版本号'
}
```

### 添加自动更新类

在插件的启用方法`onEnable`内，添加以下代码：

```java
        if (getConfig().getBoolean("options.auto-update") && // 注意这里，需要与config.yml中配置项的路径一致
            getDescription().getVersion().startsWith("Build")) { // 如果你修改了版本格式，按需修改。你也可以去除这一部分
            GuizhanBuildsUpdaterWrapper.start(this, getFile(), "你的用户名", "仓库名", "分支", false); // 必须修改
        }
```

