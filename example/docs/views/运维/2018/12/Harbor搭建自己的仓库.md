---
title: Harbor搭建自己的仓库
date: 2018-12-21
tags:
 - Docker
categories: 
 - 后端
---

Harbor搭建自己的仓库
<!-- more -->

拉取
docker pull elasticsearch:latest

打包
docker save -o elasticsearch.tar elasticsearch:latest

解压
docker load < elasticsearch.tar

更换标签
docker tag elasticsearch:6.4.1 docker.telecom.com/integral/elasticsearch:6.4.1



推送
docker push docker.telecom.com/integral/elasticsearch:6.4.1

远程下载
docker pull docker.telecom.com/integral/elasticsearch:6.4.1


添加如下解析：
vi /etc/hosts


192.168.33.11 docker.telecom.com


添加如下内容：
vi /etc/docker/daemon.json
"insecure-registries": ["docker.mrbird.cc"]




