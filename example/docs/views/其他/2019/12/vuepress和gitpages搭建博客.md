---
title: vuepress-theme-reco搭建个人博客
date: 2019-04-09
categories:
  - 其他
tags:
  - vuepress

---

``` tip
使用vuepress+github pages打造一款属于你的博客
```
<!-- more -->
## 简介


[vuepress](https://vuepress.vuejs.org/zh/) 由两部分组成：第一部分是一个极简静态网站生成器，它包含由 Vue 驱动的主题系统和插件 API，另一个部分是为书写技术文档而优化的默认主题，它的诞生初衷是为了支持 Vue 及其子项目的文档需求。

[vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com) 是一款vuepress的主题皮肤

github pages 是由github提供的静态页面服务

本文使用vuepress-theme-reco主题直接搭建,vuepress上手简单,可以查看官方文档,这里不再介绍


## 创建博客
1. 下载源码

使用git拉去github上的源码(没安装git的同学可以直接去github下载zip包)
```
git clone https://github.com/vuepress-reco/vuepress-theme-reco.git
```

进入文件夹,使用 `yarn`或者 `cnpm` `npm`等node包管理工具执行
```
yarn install
```

启动项目
```
yarn run dev
```

打开页面访问 [http://localhost:8080](http://localhost:8080) 即可访问服务

2. 添加博客配置
进入 `example/docs/.vurpress/config.js`

```js
module.exports = {
// 博客title
title: "My Blog",
// 博客介绍
description: '为了更美好的明天而战！',
// vuepress 打包后的位置
dest: 'example/docs/public',
themeConfig: {
     // 博客配置
    blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认文案 “分类”
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: 'Tag'      // 默认文案 “标签”
      }
    }
  },
}

```
