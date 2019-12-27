---
title: MySQL主从配置
date: 2019-12-09
categories:
  - 数据库
tags:
 - mysql
---

MySQL 主从复制的方式有多种，本文主要演示基于基于日志（binlog）的主从复制方式。
<!-- more -->

## 介绍
MySQL 主从复制（也称 A/B 复制） 的原理

Master将数据改变记录到二进制日志(binary log)中，也就是配置文件log-bin指定的文件， 
这些记录叫做二进制日志事件(binary log events)；

Slave 通过 I/O 线程读取 Master 中的 binary log events 并写入到它的中继日志(relay log)；

Slave 重做中继日志中的事件， 把中继日志中的事件信息一条一条的在本地执行一次，完 
成数据在本地的存储， 从而实现将改变反映到它自己的数据(数据重放)。

## 主从配置需要注意的点

主从服务器操作系统版本和位数一致；

Master 和 Slave 数据库的版本要一致；

Master 和 Slave 数据库中的数据要一致；

Master 开启二进制日志， Master 和 Slave 的 server_id 在局域网内必须唯一；

## 主从配置的简要步骤 
### Master 上的配置
安装数据库；
修改数据库配置文件， 指明 server_id， 开启二进制日志(log-bin)；
启动数据库， 查看当前是哪个日志， position 号是多少；
登录数据库， 授权数据复制用户（IP 地址为从机 IP 地址， 如果是双向主从， 这里的还需要授权本机的 IP 地址， 此时自己的 IP 地址就是从 IP 地址)；
备份数据库（记得加锁和解锁）；
传送备份数据到 Slave 上；
启动数据库；
以下步骤， 为单向主从搭建成功， 想搭建双向主从需要的步骤：

登录数据库， 指定 Master 的地址、 用户、 密码等信息（此步仅双向主从时需要）；
开启同步， 查看状态；
Slave 上的配置

安装数据库；
修改数据库配置文件， 指明 server_id（如果是搭建双向主从的话， 也要开启二进制 
日志 log-bin）；
启动数据库， 还原备份；
查看当前是哪个日志， position 号是多少（单向主从此步不需要， 双向主从需要）；
指定 Master 的地址、 用户、 密码等信息；
开启同步， 查看状态。
1、主节（Master）点配置

修改 Master 的配置文件/etc/my.cnf
```
vi /etc/my.cnf
```

在my.cnf文件中加入如下配置内容

```
[mysqld]
log-bin=mysql-bin
server-id=1
```





2、从节点（Slave）配置

修改 Slave 的配置文件/etc/my.cnf
```
vi /etc/my.cnf
```

在my.cnf文件中加入如下配置内容
```
[mysqld]
server-id=2
```
3、创建用于复制操作的用户

在主节点创建一个用户repl，用于从节点链接主节点时使用。

```
mysql> CREATE USER 'repl'@'192.168.199.198' IDENTIFIED WITH mysql_native_password BY 'Ron_master_1';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'192.168.199.198';
```

刷新授权表信息

```
mysql> flush privileges;
```

4、获取主节点当前binary log文件名和位置（position）

```
mysql> SHOW MASTER STATUS;
```

 
5、在从（Slave）节点上设置主节点参数
```
mysql> CHANGE MASTER TO
MASTER_HOST='192.168.199.149',
MASTER_USER='repl',
MASTER_PASSWORD='Ron_master_1',
MASTER_LOG_FILE='binlog.000006',
MASTER_LOG_POS=856;
```

6、查看主从同步状态
```
mysql> show slave status\G;
```

7、开启主从同步
```
mysql> start slave;
```

8、再查看主从同步状态
```
mysql> show slave status\G;
```

查看状态时，可能会出现I/O任务启动失败的情况，即如下错误:
```
Last_IO_Error: Fatal error: The slave I/O thread stops because master and slave have equal MySQL server ids; these ids must be different for replication to work (or the –replicate-same-server-id option must be used on slave but this does not always make sense; please check the manual before using it).
```

这是因为在MySQL主从结构中，从机上的server_id和主机上的server_id不能相同，我们可以看一下主机上的server_id和从机上的server_id是否相同。
```
mysql> show variables like 'server_id'; 
```

主机： 
 

从机： 
 

这里我们把从机的server_id改成2
```
mysql> set global server_id=2; #此处的数值和my.cnf里设置的一样就行 
```

9、重新开启同步并查看装态
```
mysql> start slave;
mysql> show slave status\G;
```


开启主从之后，如果状态如上图所示，那么说明主从信息就已经配置好了，接下来我们测试一下在主机上创建一个数据库，然后在从机上是否能够同步创建。

首先看一下我们主机和从机除了MySQL本身自带的数据库之前目前是没有任何数据的。 
 
 
 2.5 主库添加log-bin-index 参数后，从库报这个错误：Got fatal error 1236 from master when reading data from binary log: 'Could not find first log file name in binary log index file'
Got fatal error 1236 from master when reading data from binary log: 'could not find next log'

【如何解决】
```
stop slave;
reset slave;
start slave;
```

