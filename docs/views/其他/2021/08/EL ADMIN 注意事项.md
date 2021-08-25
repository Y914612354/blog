---
title: eladmin 注意事项
author: fly
date: 2021/08/25
tags:
  - eladmin
categories:
  - 其他
---

eladmin 开发时需注意事项(权限，日志，代码生成等)
<!-- more -->


## 第一次使用EL-ADMIN
[EL-ADMIN官网](https://el-admin.vip/)  
[教程1:初始化并启动EL-ADMIN](https://blog.csdn.net/ws6afa88/article/details/108369339?utm_medium=distribute.pc_relevant.none-task-blog-baidujs_title-0&spm=1001.2101.3001.4242)  
[教程2:利用代码生成器生第一个CRUD界面](https://blog.csdn.net/ws6afa88/article/details/108410886?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-3.channel_param&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-3.channel_param)  
[教程3:代码生器生成的CRUD界面中的一个坑处理](https://blog.csdn.net/ws6afa88/article/details/108438051?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-2.control&dist_request_id=1328767.69652.16176784557328847&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-2.control)  
[教程4:代码生成器形成的页面的修改](https://blog.csdn.net/ws6afa88/article/details/108460962?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-3.control&dist_request_id=1328767.69652.16176784557328847&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-3.control)  
[教程5:后端权限控制](https://blog.csdn.net/ws6afa88/article/details/108497785?utm_medium=distribute.pc_relevant.none-task-blog-baidujs_title-5&spm=1001.2101.3001.4242)  
[教程6:前端权限控制](https://blog.csdn.net/ws6afa88/article/details/108507826?utm_medium=distribute.pc_relevant.none-task-blog-baidujs_title-1&spm=1001.2101.3001.4242)  
[教程7:异常控制](https://blog.csdn.net/ws6afa88/article/details/108536812?utm_medium=distribute.pc_relevant.none-task-blog-baidujs_title-4&spm=1001.2101.3001.4242)

## 权限
权限是很重要的一块，由于开发测试时经常使用admin账号，忽视权限相关问题  
导致后续部署测试时经常出现未配权限，查看权限不够等问题  
权限相关：`用户、角色、菜单、部门`
- 用户——>一个或多个角色
- 用户——>部门
- 角色——>配置菜单
### 数据权限
用户查看数据的权限，是基于角色的  
配置角色的时候有选项选择数据权限  
数据权限分三种：
1. **全部** 、可以查看全部的部门数据，相当于管理员级别
2. **本级** 、只能查看自己所在部门的数据，上级部门和下级部门都无法查看
3. **自定义** 、部分推荐使用这种，可以随意定义可查看部门的数据，比如本级部门以及下级所有部门

![数据权限示例图](http://qiniu.remember5.top/images/20210825/bf129582e61a49709a45d422f3a46339.png)

#### 角色级别问题
如果拥有角色管理菜单权限，低级别角色无法操作高级别角色  
比如：角色级别为2的账号进入角色管理页面，无法修改角色级别为1的角色的菜单权限

![角色级别示例图](http://qiniu.remember5.top/images/20210825/7e5ea2f6ed32406184f94cc38f0f21fb.png)

-------------
-------------

### 菜单权限
菜单也是需要配置权限的，如果没有配置菜单权限，只是配置了可查看到菜单，就无法访问查看菜单下的数据  
菜单配置分三级：
1. **目录** 、一级目录，不需要配权限标识，下面可容纳多个菜单
2. **菜单** 、配置对应的页面，权限标识，组件
3. **按钮** 、配置菜单下的按钮权限，无权限则不显示按钮


![菜单权限示例图](http://qiniu.remember5.top/images/20210825/11a78071a0504219833dfeedaab25107.png)


**注：** 开发时需注意前端页面的权限和后端接口的权限对应  
后端代码：
![后端权限配置示例图](http://qiniu.remember5.top/images/20210825/73517a4cdd244ba5afa524658183d4ea.png)
前端代码：
![前端权限配置示例图](http://qiniu.remember5.top/images/20210825/b69206f17c094c0db4cb292f0ef78768.png)


-------------
-------------

## 代码生成
使用系统工具→代码生成→选择一张表 通过配置 生成一套CRUD代码  
![代码生成示例图](http://qiniu.remember5.top/images/20210825/1911c85ca8114221baf40e1de99fa49f.png)

先进行字段配置:
- **列表**：如果勾选会显示在前端的table中
- **表单**：如果勾选会显示在新增和编辑的form表单中
- **日期注解**：可以配置自动创建时间
- **数据字段**：一般用于单选、多选、下拉列表

![代码生成配置示例图1](http://qiniu.remember5.top/images/20210825/26dc0254ae064751982aa2f7cc78a6d4.png)

然后是生成信息配置
![代码生成配置示例图2](http://qiniu.remember5.top/images/20210825/5a51685a0d3348dbb160c6cb4279d847.png)

最后点击保存并生成或生成即可
![代码生成配置示例图3](http://qiniu.remember5.top/images/20210825/58e2afdc167e43c3af02f9ec69a33199.png)
![代码生成配置示例图4](http://qiniu.remember5.top/images/20210825/d649e4ed5de444c783f0dc6ae1b8e490.png)


[生成代码参考文章](https://blog.csdn.net/ws6afa88/article/details/108410886?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-3.channel_param&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-3.channel_param)

-------------
-------------

## 日志记录

### 操作日志
查看操作日志:
![查看操作日志示例图](http://qiniu.remember5.top/images/20210825/a49b051860d347bb9028e616dc75e17f.png)


后端记录操作日志:
![后端记录操作日志示例图](http://qiniu.remember5.top/images/20210825/48a448d3c8794c848bb3e01d11768b97.png)
如图 在后端接口处添加`@Log`注解即可记录操作日志


后端日志模块，`@Log`注解代码所在处:
![后端日志模块示例图](http://qiniu.remember5.top/images/20210825/b412fd427bff4a1e9ad3b4bbcfce56f6.png)

### 异常日志
如后端操作异常(比如sql异常),会记录异常日志

异常日志查看处:
![异常日志查看示例图](http://qiniu.remember5.top/images/20210825/b0e635a1e7b747c3a300f46cf43a787f.png)

-------------
-------------
