---
title: Docker常用命令
date: 2021-08-25
tags:
  - Docker
categories:
  - 运维
author: 王家豪
---

Docker常用命令大全，妈妈再也不用担心我忘记命令了
<!-- more -->

## 在线安装docker
卸载原有docker
```shell script
yum remove docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine
```

安装docker插件
```shell script
yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
```

设置docker仓库
```shell script
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

安装docker，如果需要指定版本，请更改脚本
```shell script
yum install -y docker-ce-20.10.6 docker-ce-cli-20.10.6 containerd.io
```

启动docker
```shell script
systemctl start docker
```

配置文件
```shell script
touch /etc/docker/daemon.json
```
更改镜像源配置
```json
{
  "registry-mirrors": [
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```
重新加载文件,重启docker
```shell script
systemctl daemon-reload
systemctl restart docker
```


## 离线安装docker
下载地址 [https://download.docker.com/linux/static/stable/x86_64/]() 并解压
```shell script
tar zxvf docker-19.03.12.tgz
cp docker/* /usr/bin/
vim /usr/lib/systemd/system/docker.service
```

新增配置文件
```
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target firewalld.service
Wants=network-online.target

[Service]
Type=notify
ExecStart=/usr/bin/dockerd
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=infinity
LimitNPROC=infinity
TimeoutStartSec=0
Delegate=yes
KillMode=process
Restart=on-failure
StartLimitBurst=3
StartLimitInterval=60s

[Install]
WantedBy=multi-user.target
```

启动服务
```shell script
systemctl daemon-reload
systemctl start docker
# 检验
ps aux | grep docker
# 开机自启
systemctl enable docker.service
```

## 查看docker信息（version、info）

查看docker版本
```docker
docker version
```

显示docker系统的信息
```docker
docker info
```

## 对image的操作（search、pull、images、rmi、history）

检索image
```docker
docker search image_name  
```

下载image
```
docker pull image_name
```

列出镜像列表; -a, --all=false Show all images; --no-trunc=false Don't truncate output; -q, --quiet=false Only show numeric IDs
```
docker images
```

删除一个或者多个镜像; -f, --force=false Force; --no-prune=false Do not delete untagged parents
```
docker rmi image_name
```
提示Error response from daemon: No such image: zookeeper:latest使用docker rmi ID

显示一个镜像的历史; --no-trunc=false Don't truncate output; -q, --quiet=false Only show numeric IDs
```
docker history image_name
```


## 启动容器（run）

docker容器可以理解为在沙盒中运行的进程。这个沙盒包含了该进程运行所必须的资源，包括文件系统、系统类库、shell 环境等等。但这个沙盒默认是不会运行任何程序的。你需要在沙盒中运行一个进程来启动某一个容器。这个进程是该容器的唯一进程，所以当该进程结束的时候，容器也会完全的停止。
在容器中运行"echo"命令，输出"hello word"
```
docker run image_name echo "hello word"
```

交互式进入容器中
```
docker run -i -t image_name /bin/bash
```

在容器中安装新的程序
```
docker run image_name apt-get install -y app_name
```
Note： 在执行apt-get 命令的时候，要带上-y参数。如果不指定-y参数的话，apt-get命令会进入交互模式，需要用户输入命令来进行确认，但在docker环境中是无法响应这种交互的。apt-get 命令执行完毕之后，容器就会停止，但对容器的改动不会丢失。

##  查看容器（ps）

列出当前所有正在运行的container
```
docker ps
```

列出所有的container
```
docker ps -a
```

列出最近一次启动的container
```
docker ps -l
```

保存对容器的修改（commit）
当你对某一个容器做了修改之后（通过在容器中运行某一个命令），可以把对容器的修改保存下来，这样下次可以从保存后的最新状态运行该容器。
保存对容器的修改; -a, --author="" Author; -m, --message="" Commit message
```
docker commit ID new_image_name
```
Note： image相当于类，container相当于实例，不过可以动态给实例安装新软件，然后把这个container用commit命令固化成一个image。
对容器的操作（rm、stop、start、kill、logs、diff、top、cp、restart、attach）

删除所有容器
```
docker rm `docker ps -a -q`
```

删除单个容器; -f, --force=false; -l, --link=false Remove the specified link and not the underlying container; -v, --volumes=false Remove the volumes associated to the container
```
docker rm Name/ID
```

停止、启动、杀死一个容器
```
docker stop Name/ID  
docker start Name/ID  
docker kill Name/ID
```

从一个容器中取日志; -f, --follow=false Follow log output; -t, --timestamps=false Show timestamps
```
docker logs Name/ID
```

列出一个容器里面被改变的文件或者目录，list列表会显示出三种事件，A 增加的，D 删除的，C 被改变的
```
docker diff Name/ID
```

显示一个运行的容器里面的进程信息
```
docker top Name/ID
```

从容器里面拷贝文件/目录到本地一个路径
```
docker cp Name:/container_path to_path  
docker cp ID:/container_path to_path
```

重启一个正在运行的容器; -t, --time=10 Number of seconds to try to stop for before killing the container, Default=10
```
docker restart Name/ID
```

附加到一个运行的容器上面; --no-stdin=false Do not attach stdin; --sig-proxy=true Proxify all received signal to the process
```
docker attach ID
```

进入容器
```
docker exec -it ID /bin/bash
```

Note： attach命令允许你查看或者影响一个运行的容器。你可以在同一时间attach同一个容器。你也可以从一个容器中脱离出来，是从CTRL-C。

保存和加载镜像（save、load）
当需要把一台机器上的镜像迁移到另一台机器的时候，需要保存镜像与加载镜像。

保存镜像到一个tar包; -o, --output="" Write to an file
```
docker save image_name -o file_path
```

加载一个tar包格式的镜像; -i, --input="" Read from a tar archive file
```
docker load -i file_path
```


机器a
```
docker save image_name > /home/save.tar
```

使用scp将save.tar拷到机器b上，然后：
```
docker load < /home/save.tar
```

##  登录registry server（login）

```
docker login
```

##  发布image（push）

发布docker镜像
```
docker push new_image_name
```

##  根据Dockerfile 构建出一个容器#build

```
--no-cache=false Do not use cache when building the image  
-q, --quiet=false Suppress the verbose output generated by the containers  
--rm=true Remove intermediate containers after a successful build  
-t, --tag="" Repository name (and optionally a tag) to be applied to the resulting image in case of success
```

```
docker build -t image_name Dockerfile_path
```


## docker设置代理

```shell script
vim /etc/systemd/system/docker.service.d/http-proxy.conf
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:8822/" "HTTPS_PROXY=http://127.0.0.1:8822/"
systemctl daemon-reload
systemctl restart docker
```


## docker网络模式
### 实现原理

Docker使用Linux桥接（参考 [《Linux虚拟网络技术》](https://www.jianshu.com/p/f86d4b88777d) ），在宿主机虚拟一个Docker容器网桥(docker0)，Docker启动一个容器时会根据Docker网桥的网段分配给容器一个IP地址，称为Container-IP，同时Docker网桥是每个容器的默认网关。因为在同一宿主机内的容器都接入同一个网桥，这样容器之间就能够通过容器的Container-IP直接通信。

Docker网桥是宿主机虚拟出来的，并不是真实存在的网络设备，外部网络是无法寻址到的，这也意味着外部网络无法通过直接Container-IP访问到容器。如果容器希望外部访问能够访问到，可以通过映射容器端口到宿主主机（端口映射），即docker run创建容器时候通过 -p 或 -P 参数来启用，访问容器的时候就通过`宿主机IP`:`容器端口`访问容器。

### 四类网络模式

| Docker网络模式 | 配置                       | 说明                                                                                      |
|:--------------|:--------------------------|:-----------------------------------------------------------------------------------------|
| host模式      | –net=host                 | 容器和宿主机共享Network namespace。                                                          |
| container模式 | –net=container:NAME_or_ID | 容器和另外一个容器共享Network namespace。 kubernetes中的pod就是多个容器共享一个Network namespace。 |
| none模式      | –net=none                 | 容器有独立的Network namespace，但并没有对其进行任何网络设置，如分配veth pair 和网桥连接，配置IP等。    |
| bridge模式    | –net=bridge               | （默认为该模式）                                                                             |

### host模式
如果启动容器的时候使用host模式，那么这个容器将不会获得一个独立的Network Namespace，而是和宿主机共用一个Network Namespace。容器将不会虚拟出自己的网卡，配置自己的IP等，而是使用宿主机的IP和端口。但是，容器的其他方面，如文件系统、进程列表等还是和宿主机隔离的。

使用host模式的容器可以直接使用宿主机的IP地址与外界通信，容器内部的服务端口也可以使用宿主机的端口，不需要进行NAT，host最大的优势就是网络性能比较好，但是docker host上已经使用的端口就不能再用了，网络的隔离性不好。

Host模式如下图所示：

![](http://qiniu.remember5.top/images/20210825/18059d971d794d9fb41a567508766ced.png)

### container模式
这个模式指定新创建的容器和已经存在的一个容器共享一个 Network Namespace，而不是和宿主机共享。新创建的容器不会创建自己的网卡，配置自己的 IP，而是和一个指定的容器共享 IP、端口范围等。同样，两个容器除了网络方面，其他的如文件系统、进程列表等还是隔离的。两个容器的进程可以通过 lo 网卡设备通信。

Container模式示意图：

![](http://qiniu.remember5.top/images/20210825/22efe7584913423c853e58ecd61c73f8.png)



### none模式
使用none模式，Docker容器拥有自己的Network Namespace，但是，并不为Docker容器进行任何网络配置。也就是说，这个Docker容器没有网卡、IP、路由等信息。需要我们自己为Docker容器添加网卡、配置IP等。

这种网络模式下容器只有lo回环网络，没有其他网卡。none模式可以在容器创建时通过--network=none来指定。这种类型的网络没有办法联网，封闭的网络能很好的保证容器的安全性。

None模式示意图:

![](http://qiniu.remember5.top/images/20210825/576691cbc94f48ee9c9fa9d0e87dd595.png)

### bridge模式
当Docker进程启动时，会在主机上创建一个名为docker0的虚拟网桥，此主机上启动的Docker容器会连接到这个虚拟网桥上。虚拟网桥的工作方式和物理交换机类似，这样主机上的所有容器就通过交换机连在了一个二层网络中。

从docker0子网中分配一个IP给容器使用，并设置docker0的IP地址为容器的默认网关。在主机上创建一对虚拟网卡veth pair设备，Docker将veth pair设备的一端放在新创建的容器中，并命名为eth0（容器的网卡），另一端放在主机中，以vethxxx这样类似的名字命名，并将这个网络设备加入到docker0网桥中。可以通过brctl show命令查看。

bridge模式是docker的默认网络模式，不写--net参数，就是bridge模式。使用docker run -p时，docker实际是在iptables做了DNAT规则，实现端口转发功能。可以使用iptables -t nat -vnL查看。

bridge模式如下图所示：

![](http://qiniu.remember5.top/images/20210825/3b65c53a3a614581b0bd933ee36de5ce.png)

作者：王勇1024
链接：https://www.jianshu.com/p/22a7032bb7bd
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
