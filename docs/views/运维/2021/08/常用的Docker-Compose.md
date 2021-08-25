---
title: 常用的Docker-Compose
date: 2021-08-25
tags:
  - Docker
categories:
  - 运维
author: 王家豪
---

常用的Docker-Compose
<!-- more -->

本文章代码地址： [https://github.com/remember-5/myshell]()

## 安装Mysql
```yaml
version: '3'
services:
  mysql:
    restart: always
    image: mysql:8.0.20
    container_name: MYSQL8
    ports:
      - 3306:3306
    environment:
#      - MYSQL_USER: user # 创建新用户
      - "MYSQL_ROOT_PASSWORD=123456"
#      - "MYSQL_DATABASE=mydb" # 创建新的库
      - "TZ=Asia/Shanghai"
    volumes:
      - /data/mysql/data:/var/lib/mysql
      - /data/mysql/conf:/etc/mysql/conf.d
      - /data/mysql/logs:/logs
```


## 安装Redis
```yaml
version: '3'
services:
  redis:
    image: redis:6.2.5
    restart: always
    container_name: redis
    ports:
      - 6379:6379
    command:
      ["redis-server", "--requirepass", "12345678", "--appendonly", "yes"]
    volumes:
      - /data/redis/data:/data
#      - /data/redis/conf/redis.conf:/usr/local/etc/redis/redis.conf # 配置文件，暂时不需要
      - /data/redis/logs:/logs
```
## 安装Minio
```yaml
version: '3.0'
services:
  minio:
    image: minio/minio:RELEASE.2021-06-07T21-40-51Z
    container_name: minio
    ports:
      - "9000:9000"
    restart: always
    command: server /data
    environment:
      MINIO_ACCESS_KEY: admin
      MINIO_SECRET_KEY: admin123 # 大于等于8位
#    logging:
#      options:
#        max-size: "50M" # 最大文件上传限制
#        max-file: "10"
#      driver: json-file
    volumes:
      - /data/minio/data:/data # 映射文件路径
      - /data/minio/config:/root/.minio # 映射配置文件
```
## 安装RabbitMQ
```yaml
version: '3'
services:
  rabbitmq:
    image: rabbitmq:3.9.4-management
    container_name: rabbitmq
    restart: always
#    hostname: rabbitmq
    ports:
      - 15672:15672
      - 5672:5672
    volumes:
      - /data/rabbitmq:/var/lib/rabbitmq
    environment:
      - RABBITMQ_DEFAULT_USER=root
      - RABBITMQ_DEFAULT_PASS=root
```
