---
title: CentOS7 安装svn
date: 2019-12-30
tags:
  - svn
  - centos
categories:
  - 后端
---



## 安装
使用yum安装非常简单：
```sh
yum install subversion
```

## 配置
2.1. 创建仓库
我们这里在/home下建立一个名为svn的仓库（repository），以后所有代码都放在这个下面，创建成功后在svn下面多了几个文件夹。
```sh
[root@localhost /]# cd /home
[root@localhost home]# mkdir svn
[root@localhost home]# svnadmin create /home/svn
[root@localhost home]# ls svn
conf  db  format  hooks  locks  README.txt
```


我们这里特别关注一下conf文件夹，这个是存放配置文件的
```sh
[root@localhost home]# cd svn/conf
[root@localhost conf]# ls
authz  passwd  svnserve.conf
```
其中：
authz 是权限控制文件
passwd 是帐号密码文件
svnserve.conf 是SVN服务配置文件
接下来我们依次修改这3个文件。
2.2. 配置passwd
```sh
[root@localhost conf]# vi passwd 
[users]
test1=123456
test2=123456

```


上面的例子中我们创建了2个用户，一个test1，一个test2

2.3. 配置authz
```
[root@localhost conf]# vi authz 
[/] # 仓库下所有文件
liuxianan=rw # 可读可写
test1=r # 只读
test2=r
*= # 其他用户无任何权限
```

上面配置的含义是，liuxianan对/home/svn/下所有文件具有可读可写权限，test只有只读权限，除此之外，其它用户均无任何权限，最后一行*=很重要不能少。

2.3.1. 拓展：使用用户分组
这个我一般不用，但是记录下来。
还是这个文件：
```sh
[root@localhost conf]# vi authz
[groups]
group1 = liuxianan
group2 = test1,test2
[/]
@group1 = rw
@group2 = r
* =
```


上面配置中创建了2个分组，分组1的用户可读可写，分组2的用户只读。
格式说明：
版本库目录格式：
```
[<版本库>:/项目/目录]
@<用户组名> = <权限>
<用户名> = <权限>

```

2.4. 配置svnserve.conf
```sh
[root@localhost conf]# vi svnserve.conf 
```

打开下面的5个注释
anon-access = read #匿名用户可读
auth-access = write #授权用户可写
password-db = passwd #使用哪个文件作为账号文件
authz-db = authz #使用哪个文件作为权限文件
realm = /home/svn # 认证空间名，版本库所在目录

2点注意：
最后一行的realm记得改成你的svn目录
打开注释时切记前面不要留有空格，否则可能有问题（网上说的，我没有亲测）

## 启动与停止
```sh
[root@localhost conf]# svnserve -d -r /home/svn（启动）
[root@localhost conf]#killall svnserve（停止）
```



上述启动命令中，-d表示守护进程， -r 表示在后台执行。停止还可以采用杀死进程的方式：
```sh
[root@localhost conf]# ps -ef|grep svnserve
root      4908     1  0 21:32 ?        00:00:00 svnserve -d -r /home/svn
root      4949  4822  0 22:05 pts/0    00:00:00 grep svnserve
[root@localhost conf]# kill -9 4908
```


客户端连接
这里使用TortoiseSVN，输入地址svn://你的IP 即可，不出意外输入用户名和密码就能连接成功了。
默认端口3690，如果你修改了端口，那么要记得加上端口号。

## 总结
总的来说，如果你不需要杂七杂八的权限配置只是自己一个人用的话，安装配置还是比较简单的，并不像网上说的那么麻烦，我按照网上的方法一次性成功了。
扩展：yum安装路径
以svn为例：
```sh
# rpm -qa | grep subversion
subversion-1.6.11-15.el6_7.x86_64
# rpm -ql subversion-1.6.11-15.el6_7.x86_64
...
/usr/share/doc/subversion-1.6.11
/usr/share/doc/subversion-1.6.11/BUGS
/usr/share/doc/subversion-1.6.11/CHANGES
...
```


## 说明：
rpm -qa 查询所有安装的rpm包，可以配合grep命令。
rpm -qi 查询某个具体包的介绍。
rpm -ql 列出某个具体包的所有文件
rpm几个默认安装路径：
/etc    一些设置文件放置的目录
/usr/bin    一些可执行文件
/usr/lib64  一些程序使用的动态函数库
/usr/share/doc  一些基本的软件使用手册与帮助文档
/usr/share/man  一些man page文件





