---
title: swagger生成静态文档
date: 2020-03-25
tags:
  - swagger
categories:
  - 后端
---

企业开发中，很多公司要求是不允许开启线上swagger的，那我们怎么解决文档的问题呢，今天就介绍一下swagger生成静态文档的方法
<!-- more -->

## 什么是swagger


## springboot中使用swagger


## 生成静态文档

pom.xml中添加一下内容
```xml
<properties>
        <swagger2markup.version>1.3.3</swagger2markup.version>
        <asciidoctorj.version>1.5.0-alpha.15</asciidoctorj.version>
        <jruby-complete.version>9.2.11.0</jruby-complete.version>
</properties>

<dependencies>
 <!-- ————————————— swagger2生成html和pdf工具包 ————————————————————— -->
        <dependency>
            <groupId>io.github.swagger2markup</groupId>
            <artifactId>swagger2markup</artifactId>
            <version>${swagger2markup.version}</version>
        </dependency>
        <dependency>
            <groupId>org.asciidoctor</groupId>
            <artifactId>asciidoctorj-pdf</artifactId>
            <version>${asciidoctorj.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.jruby</groupId>
            <artifactId>jruby-complete</artifactId>
            <version>${jruby-complete.version}</version>
        </dependency>
</dependencies>

<build>
        <!-- 项目名称 -->
        <finalName>${project.artifactId}</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
            <!--Maven通过Maven Surefire Plugin插件执行单元测试-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <skipTests>true</skipTests>
                </configuration>
            </plugin>

            <!-- swagger生成adoc -->
            <plugin>
                <groupId>io.github.swagger2markup</groupId>
                <artifactId>swagger2markup-maven-plugin</artifactId>
                <version>1.3.7</version>
                <configuration>
                    <swaggerInput>http://localhost:8082/v2/api-docs</swaggerInput>
                    <outputDir>src/docs/asciidoc/generated</outputDir>
                    <config>
                        <swagger2markup.markupLanguage>ASCIIDOC</swagger2markup.markupLanguage>
                    </config>
                </configuration>
            </plugin>

            <!-- swagger生成HTML -->
            <plugin>
                <groupId>org.asciidoctor</groupId>
                <artifactId>asciidoctor-maven-plugin</artifactId>
                <version>1.6.0</version>
                <!-- Include Asciidoctor PDF for pdf generation -->
                <dependencies>
                    <dependency>
                        <groupId>org.asciidoctor</groupId>
                        <artifactId>asciidoctorj-pdf</artifactId>
                        <version>1.5.0-alpha.15</version>
                    </dependency>
                    <dependency>
                        <groupId>org.jruby</groupId>
                        <artifactId>jruby-complete</artifactId>
                        <!--                        <version>1.7.21</version>-->
                        <version>9.2.11.0</version>
                    </dependency>
                </dependencies>
                <!-- Configure generic document generation settings -->
                <!-- 配置通用文档生成设置 -->
                <configuration>
                    <sourceDirectory>src/docs/asciidoc/generated</sourceDirectory>
                    <outputDirectory>src/docs/asciidoc/html</outputDirectory>
                    <backend>html</backend>
                    <sourceHighlighter>coderay</sourceHighlighter>
                    <attributes>
                        <toc>left</toc>
                    </attributes>
                </configuration>
                <!-- Since each execution can only handle one backend, run
                separate executions for each desired output type -->
                <!--由于每个执行只能处理一个后端，所以为每个所需的输出类型运行单独的执行-->
                <executions>
                    <execution>
                        <id>output-html</id>
                        <phase>generate-resources</phase>
                        <goals>
                            <goal>process-asciidoc</goal>
                        </goals>
                        <configuration>
                            <backend>html5</backend>
                            <outputDirectory>src/docs/asciidoc/html</outputDirectory>
                        </configuration>
                    </execution>

                    <execution>
                        <id>output-pdf</id>
                        <phase>generate-resources</phase>
                        <goals>
                            <goal>process-asciidoc</goal>
                        </goals>
                        <configuration>
                            <backend>pdf</backend>
                            <outputDirectory>src/docs/asciidoc/pdf</outputDirectory>
                        </configuration>
                    </execution>

                </executions>
            </plugin>
        </plugins>
    </build>
```

添加test文件

```java
import io.github.swagger2markup.GroupBy;
import io.github.swagger2markup.Language;
import io.github.swagger2markup.Swagger2MarkupConfig;
import io.github.swagger2markup.Swagger2MarkupConverter;
import io.github.swagger2markup.builder.Swagger2MarkupConfigBuilder;
import io.github.swagger2markup.markup.builder.MarkupLanguage;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.net.URL;
import java.nio.file.Paths;

/**
 * maven下执行以下命令
 * 生成html
 * asciidoctor:process-asciidoc
 *
 * 生成PDF
 * generate-resources
 *
 * @author wangjiahao
 * @date 2020/3/24
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class SwaggerDemoApplicationTests {

	/**
	 * 生成AsciiDocs格式文档
	 *
	 * @throws Exception
	 */
	@Test
	public void generateAsciiDocs() throws Exception {
		//    输出Ascii格式
		Swagger2MarkupConfig config = new Swagger2MarkupConfigBuilder()
				.withMarkupLanguage(MarkupLanguage.ASCIIDOC)
				.withOutputLanguage(Language.ZH)
				.withPathsGroupedBy(GroupBy.TAGS)
				.withGeneratedExamples()
				.withoutInlineSchema()
				.build();

		Swagger2MarkupConverter.from(new URL("http://localhost:8082/v2/api-docs"))
				.withConfig(config)
				.build()
				.toFolder(Paths.get("src/docs/asciidoc/generated"));
	}

	/**
	 * 生成Markdown格式文档
	 * @throws Exception
	 */
	@Test
	public void generateMarkdownDocs() throws Exception {
		//    输出Markdown格式
		Swagger2MarkupConfig config = new Swagger2MarkupConfigBuilder()
				.withMarkupLanguage(MarkupLanguage.MARKDOWN)
				.withOutputLanguage(Language.ZH)
				.withPathsGroupedBy(GroupBy.TAGS)
				.withGeneratedExamples()
				.withoutInlineSchema()
				.build();

		Swagger2MarkupConverter.from(new URL("http://localhost:8082/v2/api-docs"))
				.withConfig(config)
				.build()
				.toFolder(Paths.get("src/docs/markdown/generated"));
	}

	/**
	 * 生成Confluence格式文档
	 * @throws Exception
	 */
	@Test
	public void generateConfluenceDocs() throws Exception {
		//    输出Confluence使用的格式
		Swagger2MarkupConfig config = new Swagger2MarkupConfigBuilder()
				.withMarkupLanguage(MarkupLanguage.CONFLUENCE_MARKUP)
				.withOutputLanguage(Language.ZH)
				.withPathsGroupedBy(GroupBy.TAGS)
				.withGeneratedExamples()
				.withoutInlineSchema()
				.build();

		Swagger2MarkupConverter.from(new URL("http://localhost:8082/v2/api-docs"))
				.withConfig(config)
				.build()
				.toFolder(Paths.get("src/docs/confluence/generated"));
	}

	/**
	 * 生成AsciiDocs格式文档,并汇总成一个文件
	 * @throws Exception
	 */
	@Test
	public void generateAsciiDocsToFile() throws Exception {
		//    输出Ascii到单文件
		Swagger2MarkupConfig config = new Swagger2MarkupConfigBuilder()
				.withMarkupLanguage(MarkupLanguage.ASCIIDOC)
				.withOutputLanguage(Language.ZH)
				.withPathsGroupedBy(GroupBy.TAGS)
				.withGeneratedExamples()
				.withoutInlineSchema()
				.build();

		Swagger2MarkupConverter.from(new URL("http://localhost:8082/v2/api-docs"))
				.withConfig(config)
				.build()
				.toFile(Paths.get("src/docs/asciidoc/generated/all"));
	}

	/**
	 * 生成Markdown格式文档,并汇总成一个文件
	 * @throws Exception
	 */
	@Test
	public void generateMarkdownDocsToFile() throws Exception {
		//    输出Markdown到单文件
		Swagger2MarkupConfig config = new Swagger2MarkupConfigBuilder()
				.withMarkupLanguage(MarkupLanguage.MARKDOWN)
				.withOutputLanguage(Language.ZH)
				.withPathsGroupedBy(GroupBy.TAGS)
				.withGeneratedExamples()
				.withoutInlineSchema()
				.build();

		Swagger2MarkupConverter.from(new URL("http://localhost:8082/v2/api-docs"))
				.withConfig(config)
				.build()
				.toFile(Paths.get("src/docs/markdown/generated/all"));
	}
}
```

打开maven命令 

生成html执行 `asciidoctor:process-asciidoc`

生成PDF`generate-resources`

![https://raw.githubusercontent.com/remember-5/blog/master/images/2020/03/2.png](maven命令)

执行完后请查看docs文件下
