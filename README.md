# latte and cat

> study programs and record life

博客搭建工具: [VuePress](https://vuepress.vuejs.org/zh/)  
博客使用主题: [vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)  
主题作者: [reco_luan](https://github.com/recoluan)

编写博客时添加标签、日期和分类
```
---
title: xxxxxxxxxxxxx
date: xxxx-xx-xx
sidebar: auto
tags:
 - xxx
categories:
 - xxx
---
```

# dev

需要拉取reco主题代码到.vuepress/theme




# 标签说明

## md文件中
| 标签     | 可选值      | 说明                      |
|:--------|:-----------|:-------------------------|
| keys    | 无         | 文章加密密码。使用小写md5加密 |
| publish | true,false | 文章是否发布               |
|  sticky       |    文章置顶        |       降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级                   |






# 注意事项
1. 新建文章需要重新启动
2. 更新`more`标签以上的内容都需要重启 `title`除外
3. JB全家桶markdown插件地址https://plugins.jetbrains.com/plugin/7896-markdown-navigator-enhanced/
