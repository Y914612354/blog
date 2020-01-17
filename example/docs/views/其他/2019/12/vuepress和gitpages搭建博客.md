---
title: vuepress-theme-reco搭建个人博客
date: 2019-12-19
categories:
  - 其他
tags:
  - vuepress
sticky: 2
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
### 下载源码

使用git拉去github上的源码(没安装git的同学可以直接去github下载zip包)
```bash
git clone https://github.com/vuepress-reco/vuepress-theme-reco.git
```

进入文件夹,使用 `yarn`或者 `cnpm` `npm`等node包管理工具执行
```bash
yarn install
```

启动项目
```bash
yarn run dev
```

打开页面访问 [http://localhost:8080](http://localhost:8080) 即可访问服务

### 添加博客配置
进入 `example/docs/.vurpress/config.js`

```javascript
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


### 开启评论

评论插件有两种，本文选择`Vssue`


Valine

```javascript
module.exports = {
  theme: 'reco',
  themeConfig: {
    valineConfig: {
      appId: '...',// your appId
      appKey: '...', // your appKey
    }
  }  
}

```
其他参数参考 [Valine 官网](https://valine.js.org/configuration.html)

> 如果 valine 的获取评论的接口报 404 错误的话，不用担心，这是因为你还没有添加评论，只要存在1条评论，就不会报错了，这是 leanCloud 的请求处理操作而已；


Vssue

```javascript
module.exports = {
  theme: 'reco',
  themeConfig: {
    vssueConfig: {
      platform: 'github',
      owner: 'OWNER_OF_REPO',
      repo: 'NAME_OF_REPO',
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
    }
  }  
}
```

查看[官网](https://vssue.js.org/zh/guide/github.html#%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%96%B0%E7%9A%84-oauth-app)教程


## 打包推送

### 创建项目
在github上创建新的仓库, 仓库名字用`<USERNAME>.github.io`来定义,USERNAME请进入github查看右上角的名字

### 创建自动推送脚本
在项目根目录下创建`deploy.sh`文件,并添加以下内容:

```sh
# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd example/docs/public

# 如果是发布到自定义域名
# echo 'www.baidu.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```

如果你用的 MAC，在项目根目录借助 终端 执行 `bash deploy.sh` 即可；

如果你使用的是 WINDOWS，在项目根目录借助 Git Bash 执行 `bash deploy.sh `即可。










