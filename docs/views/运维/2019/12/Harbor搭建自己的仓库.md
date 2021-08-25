---
title: Harbor搭建自己的仓库
date: 2019-10-21
tags:
 - Docker
 - Harbor
categories: 
 - 运维
---

Harbor搭建自己的仓库
<!-- more -->

## 搭建harbor仓库

## 上传镜像

### 拉取
```sh
docker pull elasticsearch:latest
```



### 打包
```sh
docker save -o elasticsearch.tar elasticsearch:latest
```

### 解压
```sh
docker load < elasticsearch.tar
```

## 更换标签
```sh
docker tag elasticsearch:6.4.1 docker.telecom.com/integral/elasticsearch:6.4.1
```

## 推送
```sh
docker push docker.telecom.com/integral/elasticsearch:6.4.1
```


## 拉去镜像


## 远程下载
```sh
docker pull docker.telecom.com/integral/elasticsearch:6.4.1

```

添加如下解析：

```sh
vim /etc/hosts
192.168.33.11 docker.telecom.com
```
添加如下内容：
```sh
vi /etc/docker/daemon.json
"insecure-registries": ["docker.mrbird.cc"]
```

## 忘记密码








