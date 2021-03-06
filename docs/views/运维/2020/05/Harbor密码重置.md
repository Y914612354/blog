---
title: Harbor密码重置
date: 2020-05-19
tags:
 - Docker
 - Harbor
categories:
 - 后端
---

Harbor密码重置
<!-- more -->


harbor现在是使用postgresql 数据库了。不再支持mysql，网上有N多重置Mysql密码的，可以略过了。
我密码错了默认的Harbor12345 修改为： RedHat12345 然后忘记密码死活登陆不上。
卸载重新重新安装也不可以，原因是没有删除harbor的数据，harbor数据在/data/目录下边，如果真要重新安装需要将这个也删除，备份或者迁移，请使用这个目录的数据。
下面为重置Harbor 仓库密码的方式，这里使用的harbor版本为：1.7.5，其他版本是否支持不保证。
官方的安装包为： harbor-offline-installer-v1.7.5.tgz

具体步骤：
1、进入`harbor-db`容器内部
```sh
docker exec -it harbor-db /bin/bash
```


2、进入postgresql命令行
```sh
psql -h postgresql -d postgres -U postgres  #这要输入默认密码：root123 。
psql -U postgres -d postgres -h 127.0.0.1 -p 5432  #或者用这个可以不输入密码。
```

3、切换到harbor所在的数据库
```sh
\c registry
```
4、查看harbor_user表
```sql
select * from harbor_user;
```

5、例如修改admin的密码，修改为初始化密码Harbor12345 ，修改好了之后再可以从web ui上再改一次。
```sql
 update harbor_user set password='a71a7d0df981a61cbb53a97ed8d78f3e', salt='ah3fdh5b7yxepalg9z45bu8zb36sszmr'  where username='admin';
```
6、退出 \q 退出postgresql，exit退出容器。
```sh
\q 
exit 
```
完成后通过WEB UI，就可以使用admin 、Harbor12345 这个密码登录了，记得修改这个默认密码哦，避免安全问题。
如下，有更加狠点的招数，将admin账户改成别的名字，减少被攻击面：
```sql
update harbor_user set username='Remem' where user_id=1;              #更改admin用户名为Remem
```

