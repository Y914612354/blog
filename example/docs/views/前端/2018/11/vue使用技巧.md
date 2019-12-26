---
title: vue使用技巧
date: 2018-11-15
tags:
 - vue
categories:
 -  前端
---

## 配置
### 配置镜像为阿里云
```
npm install --registry=https://registry.npm.taobao.org
```

## 插件

### 清空node_model
```
npm install rimraf -g
rimraf node_modules
npm cache clean --force
```

## 获取当前架构图示；最新版本的vue-cli自带
```
npm install webpack-bundle-analyze
```