---
title: 修改Centos7的yum源
date: 2019-12-30
tags:
  - centos
categories:
  - 运维
---

## 1. 备份原镜像文件，便于后期恢复
```sh
[root@keepmydream ~]# mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```
 
## 2.下载新的CentOS-Base.repo 到/etc/yum.repos.d/
```sh
Centos5地址：
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-5.repo

Centos6地址：
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo

Centos7地址：
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
``` 

## 3. 清除缓存
```sh
yum clean all
```

## 4. 生成缓存
```sh
yum makecache
```

## 5.更新系统
更新系统时间可能会比较久取决于服务器网速
```sh
yum -y update
```


