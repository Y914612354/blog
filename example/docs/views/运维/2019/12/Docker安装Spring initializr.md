---
title: Docker安装Spring initializr
date: 2019-10-2
tags:
 - Docker
categories: 
 - 后端
---

本地搭建Spring Initializr服务器(运行在docker中)
<!-- more -->



## 拉镜像
```docker
docker pull pollyduan/start_spring_io
```
## 关闭防火墙

## 启动
```docker
docker run --name spring-initializr -p 52957:8500 pollyduan/start_spring_io --server.port=8500
```
## 更改hosts 添加自己公网ip
```sh
vim /etc/hosts
```



