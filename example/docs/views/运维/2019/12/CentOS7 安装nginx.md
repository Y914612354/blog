---
title: CentOS7 安装nginx
date: 2019-12-30
tags:
  - nginx
  - centos
categories:
  - 后端
---

nginx是常用的工具,本文展示在centos下安装nginx

<!-- more -->

## 1.安装编译工具及库文件
```sh
yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
```

## 2.首先要安装 PCRE
PCRE 作用是让 Nginx 支持 Rewrite 功能。
```sh
[root@centos src]# cd /usr/local/src/
[root@centos src]# wget http://downloads.sourceforge.net/project/pcre/pcre/8.35/pcre-8.35.tar.gz
```

2、解压安装包:
```sh
[root@centos src]# tar zxvf pcre-8.35.tar.gz
```
3、进入安装包目录
```sh
[root@centos src]# cd pcre-8.35
```
4、编译安装 
```sh
[root@centos pcre-8.35]# ./configure
[root@centos pcre-8.35]# make && make install
```
5、查看pcre版本
```sh
[root@centos pcre-8.35]# pcre-config --version
```
## 3.安装 Nginx
1、下载 Nginx，下载地址：http://nginx.org/download/nginx-1.6.2.tar.gz
```sh
[root@centos src]# cd /usr/local/src/
[root@centos src]# wget http://nginx.org/download/nginx-1.6.2.tar.gz
```

安装包
```sh
[root@centos src]# tar zxvf nginx-1.6.2.tar.gz
```
3、进入安装包目录
```sh
[root@centos src]# cd nginx-1.6.2
```
4、编译安装
```sh
[root@centos nginx-1.6.2]# ./configure --prefix=/server/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=/server/pcre-8.35 --with-stream
[root@centos nginx-1.6.2]# make
[root@centos nginx-1.6.2]# make install
```
5、查看nginx版本
```sh
[root@centos nginx-1.6.2]# /usr/local/webserver/nginx/sbin/nginx -v
```
