---
title: CentOS7 二进制安装MySQL
date: 2019-12-30
tags:
  - mysql
  - centos
categories:
  - 后端
---

mysql安装方式

<!-- more -->


## 1.安装依赖包
MySQL依赖于libaio 库。如果这个库没有在本地安装，数据目录初始化和后续的服务器启动步骤将会失败。请使用适当的软件包管理器进行安装。例如，在基于Yum的系统上：

```sh
yum search libaio
yum install libaio
```

注意
SLES 11：从MySQL 5.7.19开始，Linux通用tar包的格式是EL6而不是EL5。以致于MySQL客户端bin / mysql需要libtinfo.so.5。
解决方法是创建软链接，例如64位系统上的ln -s libncurses.so.5.6 /lib64/libtinfo.so.5或32 位系统上的ln -s libncurses.so.5.6 /lib/libtinfo.so.5。
## 2.创建一个mysql用户和组
```sh
groupadd mysql
useradd -r -g mysql -s /bin/false mysql
```

注意
此用户仅用于运行mysql服务，而不是登录，因此使用useradd -r和-s /bin/false命令选项来创建对服务器主机没有登录权限的用户。
## 3.解压到指定目录
```sh
tar -zxvf mysql-5.7.26-linux-glibc2.12-x86_64.tar.gz
mv  mysql-5.7.26-linux-glibc2.12-x86_64    /usr/local/
ln -s  mysql-5.7.26-linux-glibc2.12-x86_64 /usr/local/mysql
```


## 4.配置环境变量
```sh
touch  /etc/profile.d/mysql.sh
echo "export PATH=$PATH:/usr/local/mysql/bin" >> /etc/profile.d/mysql.sh
```

## 5.配置数据库目录

数据目录：/data/mysqldb/  
参数文件my.cnf：/etc/my.cnf   
错误日志log-error：/data/dblogs/mysql_error.log   
二进制日志log-bin：/data/dblogs/mysql_bin.log   
慢查询日志slow_query_log_file：/data/dblogs/mysql_slow_query.log  
套接字socket文件：/data/dbrun/mysql.sock  
pid文件：/data/dbrun/mysql.pid  
创建目录：
```sh
mkdir -p /data/{mysqldb,dblogs,dbrun}
chown -R mysql:mysql /usr/local/mysql
chown -R mysql:mysql /data/mysqldb
chown -R mysql:mysql /data/dbrun
chown -R mysql:mysql /data/dblogs
chmod -R 775 /data/dbrun
chmod -R 775 /data/dblogs
chmod 775 /data
```

## 6.配置my.cnf文件
在/etc/下创建my.cnf文件，加入如下参数，其他参数根据需要配置
```sh
touch /etc/my.cnf
chown mysql:mysql /etc/my.cnf
```

```
[client]
port = 3306
socket = /data/dbrun/mysql.sock

[mysqld]
port = 3306
socket = /data/dbrun/mysql.sock
pid_file = /data/dbrun/mysql.pid
datadir = /data/mysqldb/
default_storage_engine = InnoDB
max_allowed_packet = 128M
max_connections = 2048
open_files_limit = 65535
skip-name-resolve
lower_case_table_names=1
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'
innodb_buffer_pool_size = 128M
innodb_log_file_size = 128M
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit = 0
key_buffer_size = 16M
log-error = /data/dblogs/mysql_error.log
log-bin = /data/dblogs/mysql_bin.log
slow_query_log = 1
slow_query_log_file = /data/dblogs/mysql_slow_query.log
long_query_time = 5
tmp_table_size = 16M
max_heap_table_size = 16M
server-id=1
```


## 7.初始化
```sh
/usr/local/mysql/bin/mysqld --initialize --user=mysql --basedir=/usr/local/mysql/ --datadir=/data/mysqldb/
```

```sh
grep 'temporary password' /data/dblogs/mysql_error.log
```
此时会生成一个临时密码，可以在mysql_error.log文件找到

生成ssl
```sh
/usr/local/mysql/bin/mysql_ssl_rsa_setup --basedir=/usr/local/mysql/ --datadir=/data/mysqldb/
```

## 8.配置服务，使用systemctl管理


```sh
cd /usr/lib/systemd/system
touch mysqld.service
```

文件内容如下

```sh
# Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; version 2 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA
#
# systemd service file for MySQL forking server
#
[Unit]
Description=MySQL Server
Documentation=man:mysqld(8)
Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html
After=network.target
After=syslog.target
[Install]
WantedBy=multi-user.target
[Service]
User=mysql
Group=mysql
Type=forking
PIDFile=/data/dbrun/mysql.pid
# Disable service start and stop timeout logic of systemd for mysqld service.
TimeoutSec=0
# Execute pre and post scripts as root
PermissionsStartOnly=true
# Needed to create system tables
#ExecStartPre=/usr/bin/mysqld_pre_systemd
# Start main service
ExecStart=/usr/local/mysql/bin/mysqld --daemonize -u mysql --pid-file=/data/dbrun/mysql.pid $MYSQLD_OPTS
# Use this to switch malloc implementation
EnvironmentFile=-/etc/sysconfig/mysql
# Sets open_files_limit
LimitNOFILE = 65535
Restart=on-failure
RestartPreventExitStatus=1
PrivateTmp=false
```



让systemctl加载配置服务
```sh
systemctl daemon-reload
systemctl enable mysqld.service
systemctl is-enabled mysqld
```


## 9.启动MySQL服务
```sh
systemctl start mysqld.service
```


## 10.MySQL用户初始化
重置密码(上一步已经重置过了 这次可以忽略)
删除匿名用户
关闭root用户的远程登录
删除测试数据库
```sh
/usr/local/mysql/bin/mysql_secure_installation


Securing the MySQL server deployment.
Enter password for user root: 
The existing password for the user account root has expired. Please set a new password.
New password: 
Re-enter new password: 

VALIDATE PASSWORD PLUGIN can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD plugin?

Press y|Y for Yes, any other key for No: Y

There are three levels of password validation policy:

LOW    Length >= 8
MEDIUM Length >= 8, numeric, mixed case, and special characters
STRONG Length >= 8, numeric, mixed case, special characters and dictionary                  file

Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 2
Using existing password for root.

Estimated strength of the password: 100 
Change the password for root ? ((Press y|Y for Yes, any other key for No) : N

 ... skipping.
By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them. This is intended only for
testing, and to make the installation go a bit smoother.
You should remove them before moving into a production
environment.

Remove anonymous users? (Press y|Y for Yes, any other key for No) : Y
Success.


Normally, root should only be allowed to connect from
'localhost'. This ensures that someone cannot guess at
the root password from the network.

Disallow root login remotely? (Press y|Y for Yes, any other key for No) : Y
Success.

By default, MySQL comes with a database named 'test' that
anyone can access. This is also intended only for testing,
and should be removed before moving into a production
environment.


Remove test database and access to it? (Press y|Y for Yes, any other key for No) : Y
 - Dropping test database...
Success.

 - Removing privileges on test database...
Success.

Reloading the privilege tables will ensure that all changes
made so far will take effect immediately.

Reload privilege tables now? (Press y|Y for Yes, any other key for No) : Y
Success.

All done!
```


## 11.导入时区
```sh
/usr/local/mysql/bin/mysql_tzinfo_to_sql /usr/share/zoneinfo | /usr/local/mysql/bin/mysql -uroot -p mysql

```

## 12.验证安装
同步时间timezone
```sh
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql -p

```

## 13.开区远程访问
更改localhost账户密码

```sh
ALTER USER 'root'@'localhost' IDENTIFIED BY 'mysqladmindba';

select host,user from mysql.user;
update mysql.user set host='%' where user='root';
flush privileges;

ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'mysqladmindba';
```
