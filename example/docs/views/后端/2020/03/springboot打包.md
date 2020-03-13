---
title: SpringBoot打包的两种方式
date: 2020-03-13
tags:
  - spring
categories:
  - 后端
---

最近使用Springboot项目比较多，Springboot项目目前一般都是使用maven进行打包。
<!-- more -->

# maven打包

## 单独jar运行
maven的默认打包插件用的是spring-boot-maven-plugin，这个插件会把项目中的代码和相关依赖一起打包成一个jar包，我们拿到这个jar包就可以去生产环境运行。

在使用IDEA时，我们可以执行maven-> Plugins -> install 即可

## 代码jar+libs运行

以上方式当我们每次进行项目更新的时候，这个jar都特别大，因为包含了所有的依赖。因此我们需要把打包模式修改成，所有的lib文件都放在生成目录的lib/文件夹下，生成的项目jar包里面只包含项目代码部分。

所以我们在不更改pom文件的情况下，可以直接把代码达成jar包方式来运行

第一个插件是指定jar包的启动类，还有lib文件目录，代码如下：
```xml
<plugin>
	  <groupId>org.apache.maven.plugins</groupId>
	  <artifactId>maven-jar-plugin</artifactId>
	  <configuration>
	      <archive>
	          <manifest>
	              <addClasspath>true</addClasspath>
	              <classpathPrefix>lib/</classpathPrefix>
	                  <mainClass>com.bill.cms.GatewayApplication</mainClass>
	          </manifest>
	      </archive>
	  </configuration>
  </plugin>
```

上面代码中classpathPrefix代表了lib文件目录，mainClass是jar包的启动类

第二个插件是maven-dependency-plugin，他的功能是把所有的依赖文件都复制到lib文件夹下，代码如下：


```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <executions>
        <execution>
            <id>copy-dependencies</id>
            <phase>prepare-package</phase>
            <goals>
                <goal>copy-dependencies</goal>
            </goals>
            <configuration>
                <outputDirectory>${project.build.directory}/lib</outputDirectory>
                <overWriteReleases>false</overWriteReleases>
                <overWriteSnapshots>false</overWriteSnapshots>
                <overWriteIfNewer>true</overWriteIfNewer>
            </configuration>
        </execution>
    </executions>
</plugin>
```
`outputDirectory`字段就是代表依赖jar包复制的目录

打包之后文件就如下图：
![打包后](https://raw.githubusercontent.com/remember-5/blog/master/images/2020/03/1.png)

## svn+maven打包

以上两种方式是常见的打包方式，如果服务器拥有互联网(或者有私服maven库)，我们也是可以用svn+maven的方式进行打包的。

思路：svn执行`svn update` 更新代码到最新，然后进入到项目根目录，maven执行`mvn package`即可打包

题外话：可以集成Jenkins来进行自动发布
