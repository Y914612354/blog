---
title: 使用CI/CD自动部署流程
author: fly
date: 2021/8/25
tags:
  - GitLab
categories:
  - 运维
---

基于GitLab(CE)的CI/CD自动部署
<!-- more -->


## GitLab-runner 的安装和注册
1. 下载 [gitlab-runner](https://gitlab-ci-multi-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-ci-multi-runner-linux-amd64)

2. 安装程序
```sh
mv gitlab-ci-multi-runner-linux-amd64 /usr/local/bin/gitlab-runner
chmod +x /usr/local/bin/gitlab-runner
useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash
sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/java/gitlab-runner
```

3. 向`gitlab`中注册`runner`
```sh
sudo gitlab-runner register
```

注册过程中根据提示输入如下信息:
 - 输入`gitlab`的服务URL，获取方式参考下图
 - 输入`gitlab-ci`的`Toekn`，获取方式参考下图
 - 关于集成服务中对于这个`runner`的描述
 - 给这个`gitlab-runner`输入一个标记，这个`tag`非常重要，在后续的使用过程中需要使用这个`tag`来指定`gitlab-runner`
 - 是否运行在没有`tag`的`build`上面。在配置`gitlab-ci`的时候，会有很多`job`，每个`job`可以通过`tags`属性来选择`runner`。这里为`true`表示如果`job`没有配置`tags`，也执行
 - 是否锁定`runner`到当前项目
 - 选择执行器，`gitlab-runner`实现了很多执行器，可用在不同场景中运行构建，详情可见`GitLab Runner Executors`，这里选用`Shell`模式

`IP`和`令牌`从下图位置获取
![获取令牌示例图](http://qiniu.remember5.top/images/20210826/6e18397e0be84b3db32d5c420ca1ba33.png)
注册完毕后 输入命令查看
```
cat /etc/gitlab-runner/config.toml
```
![示例图1](http://qiniu.remember5.top/images/20210826/55c806221bb04ab0b235834987456964.png)

同时也可以在`GitLab`页面上查看
![示例图2](http://qiniu.remember5.top/images/20210826/4e252342a18249f7a0ad610d1c2d8e0a.png)

-------------
-------------

## 编写CI脚本文件
在项目的根目录，创建`CI`脚本文件，文件名：`.gitlab-ci.yml`
![示例图3](http://qiniu.remember5.top/images/20210825/0c0d69795eb94de79c2f1436872a6d39.png)

上传`CI`脚本文件后，在GitLab上查看流水线作业
![示例图4](http://qiniu.remember5.top/images/20210826/b7b6fcb439c040f98657d2ef636691ea.png)

若流水线作业暂停，显示暂无可用runner  
需要前往以下地方配置  
![示例图5](http://qiniu.remember5.top/images/20210826/f4aef3f5a56c4a8f9bb70203b3edf51f.png)
![示例图6](http://qiniu.remember5.top/images/20210826/66655746c53e4935929e5c442cc58169.png)

-------------
-------------

## 服务器nginx代理页面配置
前端项目部署需要nginx代理域名
查看nginx配置文件
```sh
cd /usr/local/nginx/conf/   # 切换路径
vim nginx.conf              # 查看配置文件
```

墙裂建议修改配置之前先备份一份配置文件
![修改nginx配置文件示例图](http://qiniu.remember5.top/images/20210826/e8d7465d3d4a40969245501b590a9685.png)


重启nginx
```sh
cd /usr/local/nginx/sbin  # 切换路径
./nginx -t                # 测试
./nginx -s reload         # 重启服务
```

-------------
-------------

## 注意事项
`eladmin-web`项目部署之前的部分修改  
修改访问域名
![修改前端访问域名](http://qiniu.remember5.top/images/20210826/82790ba3a45a4891b8b093e5f77b6e81.png)

修改访问路径
![修改前端访问路径](http://qiniu.remember5.top/images/20210825/6f8f3309fb1041d5a4d9e81d47f35382.png)
路径要和nginx配置中的`location / `对应

-------------
-------------
