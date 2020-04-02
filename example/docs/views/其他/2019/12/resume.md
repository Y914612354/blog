---
title: 个人简历
date: 2019-12-01
categories:
  - 其他
keys:
  - 'resume'
---

# 简历

## 个人信息

- 王家豪/男/1996
- 本科/黄河科技学院
- 工作年限：3年
- 期望职位：Java高级程序员
- 期望薪资：税后月薪17k~22k，特别喜欢的公司可例外
- 期望城市：上海
- Blog：[https://blog.remember5.top](https://blog.remember5.top) 采用Github Pages搭建，访问会比较慢
- Github：https://github.com/remember-5
- CSND：https://blog.csdn.net/weixin_41413820
- 网页版简历：[https://blog.remember5.top/views/其他/2019/12/resume.html](https://blog.remember5.top/views/其他/2019/12/resume.html) 密码为resume
---

## 联系方式

- 手机：17600277246 （`同微信`）
- Email：1332661444@qq.com
- QQ：1332661444

---

## 技能清单

喜欢开源技术，经常活跃开源社区，代码风格遵守阿里巴巴规范，对代码质量要求高，熟悉中间件安装、部署以及高可用方案

以下均为我熟练使用的技术
- 语言: Java/Python
- 框架: SpringCloud/SpringBoot/SpringWebFlux/Jfinal/Django/Mina(NIO)
- 前端: Vue/Vue-cli/Jquery/Echarts/Electron
- 前端UI: Element/Antd/Layui
- 数据库/缓存: MySQL/Oracle/Redis
- CI/CD: SVN/Git/Mavne/Swagger/Jenkins/Harbor/Prometheus/Garfana
- 云和开放平台: 微信公众号/小程序(uni-app)/mpvue
- 权限控制: Shiro/OAuth2/Jwt
- 测试: Junit/Postman/Jmeter/Mock
- 微服务: Nacos/RabbitMQ/ELK/Skywalking/Zipkin/Sentinel/Fegin/Dubbo
- 服务器: Linux/K8s/Docker/Nginx/Tomcat/Undertow/Jetty

---

## 工作经历

### 上海速林网络科技有限公司(2019年2月 ~ 2020年4月)

#### 工作职责

带领4人团队，主要负责系统设计、项目搭建和模块划分，进行快速开发项目，在公司引进SpringCloud中间件、设计模式,提出使用主流高效的组件和系统设计(缓存集群,数据库集群,分库分表,读写分离,数据离线同步,任务调度等等),也解决了中间件常见问题,如(缓存雪崩,分布式事物/锁,Quartz集群调度等等),最新引入nacos做注册中心和动态配置,使得配置更加方便和强扩展,做了数据可视化监控平台,减少运维人员工作时间,系统性能从100QPS提升到2000QPS,同事和领导对此非常认可！ 

### 河南云端信息有限公司(2017年6月 ~ 2019年2月)

#### 工作职责

完成软件的设计、开发、测试、修改bug等工作，包括业务需求的沟通，功能模块详细设计，业务功能实现与单元测试，系统维护；参与产品构思和架构设计；撰写相关的技术文档；支持售前技术服务；支持项目对产品的应用服务。

---

## 项目经历
### 上海电信热地图

#### 项目介绍
上海电信为疫情开发的热地图，Web使用java，python处理大量复杂数据，地址[https://sh.189.cn/map](https://sh.189.cn/map)

#### 项目技术	
`SpringBoot` `Vue`  `Reids` `Guava` `Echarts` `Python`

#### 责任描述
搭建了前台+后台，为用户提供上海市交通枢纽的人流量热地图，实时更新

#### 负责模块
1. 微信认证：校验用户是否关注公众号
2. pvuv：统计日pvuv
3. 前台页面展示

### 上海电信积分平台

#### 项目介绍
现有架构不满足新业务需求，进行项目重构。前台使用uni-app实现了前台一套代码发布多平台，后台采用微服务架构，集成了插件ELK/Skywalking/Prometheus/Sentinel，同时集成Svn+Maven+Jenkins+Harbor+Docker自动部署和回滚

#### 项目技术	
`SpringCloud` `SpringBoot` `Mysql` `MybatisPlus` `Vue` `OAuth2` `Jwt` `Reids` `Guava` `ElasticSearch` `RabbtiMQ` `EasyExcel` `Feign` `Nacos` `Docker`  `Sentinel` `ELK` `Quartz` `uniapp` `SpringBootAdmin` `FastDFS`

#### 责任描述
负责搭建springcloud + nacos + Feign微服务架构，负责带领团队按照规划进行日常开发，协助解决团队开发中出现的问题，技术上对微服务/中间件有更深入的了解，对团队管理的沟通和任务分配、日常问题的解决有更多的心得

#### 负责模块
1. 框架搭建：基于SpringCloud + Nacos的微服务框架，集成各种插件
2. 认证模块：采用RBAC模型，OAuth2+Jwt方式做认证
3. es搜索：采用es官方提供的ik分词器和pinyi插件
4. 下单模块：使用rabbitmq异步下单，手动ack+死信队列解决消息可靠性
5. 定时任务模块：基于Quartz实现

### 上海益农信息平台

#### 项目介绍
上海农业信息委员会为村委会打造提供信息发布(通知),便民服务,涉农账单查询的一个综合的信息展示平台(门户网站、APP、一点通),需要对接多个平台,接口统一为RESTful风格，此项目中包含了后台，门户，和接口模块，所以采用前后端分离 + 分布式,拆分了后台、接口、定时任务项目，地址[http://yn12316.shac.cn/yn_gateway/page/index](http://yn12316.shac.cn/yn_gateway/page/index)

#### 项目技术	
`SpringBoot` `Python` `Mysql` `MybatisPlus` `Jwt` `Reids` `ElasticSearch` `EasyExcel` `Quartz` `FTP` `Nginx`

#### 责任描述
负责后台的文章和文件管理两个大模块(包含前端代码)，以及对外提供该功能的服务能力。文章检索采用ES解决,点赞、浏览量、留言等要求时效性的采用redis,爬虫使用python3，bs4+requests+PyMySQL完成多线程爬虫任务

#### 负责模块
1. 文章模块： 包含了发布，文件上传，敏感校验，审核，点赞留言，及对外接口的搜索(es)，推送等 
2. 文件管理： FTP + Nginx形式,上传到资源服务器，后台用户分享，修改，在线预览，下载文件
3. 爬虫模块： 应甲方要求，需要用爬虫爬去上海各区门户网站上对内容，对以分类并收录门户网站


### 云端微商城

#### 项目介绍
公司多于旅游景区合作,为解决景区纪念品和特产线上销售而整合研发的B2C电商平台，依托本网站实现了网上购物与网上支付等多项功能,地址[http://wx.v4.yunyouyuanfang.com/seller/login](http://wx.v4.yunyouyuanfang.com/seller/login)

#### 项目技术	
`SpringBoot` `Mysql` `Vue` `JWT` `Redis` `JustAuth` `ES` `Quartz` `Echarts`

#### 责任描述
在项目中,发票管理遇到图片合成以及压缩的问题，后采用java原生的方式来完成java图片合成和压缩，秒杀采用redis列队解决，对redis的数据结构和高级用法有更多认识，集成了三方登陆(使用JustAuth)，封装了三方平台支付API，方便后期使用

#### 负责模块
1. 商品类别模块：新商品类别的发布、商品类别信息的修改、过时商品类别下线、商品类别的展示
2. 商品浏览模块：最新商品发布、商品价格查看、商品详细信息管理
3. 购物模块：模拟真实购物场景实现网上购物功能。如：购物车功能。
4. 商品管理模块：实现了商品的入库、下线、修改、展示、查看详细信息等功能。
5. 支付模块：客户通过支付宝/微信等三方支付功能。
6. 会员留言模块：客户对商品的反馈信息，以及客户要求订购的新商品信息。
7. 商品销售统计模块：对网上交易的商品进行统计，对统计结果进行分析，根据结果采取相关措施对网上商品进行适当的调整。 
8. 活动游戏：秒杀活动，转盘游戏，抽奖游戏等


### 少林寺智慧监管平台

#### 项目介绍
为少林寺打造的管控系统,包含售票系统，系统对接了景区现有的硬件设备以及人员，实现智慧景区管理系统，推出电子导览方便游客了解景区文化，SOS救助会通知附近的工作人员前往帮助，另外会调用所有可用监控第一时间抓取画面。

#### 项目技术	
`SpringBoot` `Mysql` `Vue` `Shiro` `Redis` `JustAuth` `Echarts` `3DGis` `MINA` `POI`

#### 责任描述
主要负责微信对接和硬件对接，微信卡包和消息推送等功能实现，人脸识别、入口闸机、身份证阅读器集成到后台，硬件为TCP和UDP通信比较多，采用了Apache Mina框架(NIO)、加深TCP/UDP交互,监控(m3u8)在web播放困难，最终采用github开源项目解决，也首次对3DGis网页技术有了新的认识

#### 负责模块
1. SOS救助：用户在公众号上发起救援（帮助），系统会将情况通知到附近的工作人员
2. 电子导览：主要是前端页面，使用3DGis技术实现
3. 硬件对接(TCP/UDP),监控实时预览(m3u8)

### 洪洞大槐树公众号

#### 项目介绍
项目是景区为了推广姓氏起源，让四海的同胞了解自己的祖先，了解姓氏文化的平台,地址[http://jz.sxhtdhs.com](http://jz.sxhtdhs.com)

#### 项目技术	
`Spring-boot` `MPVue` `Elasticsearch` `Vue-Copper` `Redis`

#### 责任描述	
首次熟悉和认识小程序和公众号的开发,集成三方支付模块,首次用java异步图片修改合成,减小主线程的压力和响应时间,推出根据用户上传图片，识别图片内容来匹配内部诗词资料。

#### 负责模块
1. 姓氏介绍模块
2. 贡品管理
3. 敏感词模块
4. 海报生成
5. 微信授权&支付

### 皇城相府小诗机(小程序)

#### 项目介绍
皇城相府推出根据用户上传图片，识别图片内容来匹配内部诗词资料。可搜索皇城诗仙小程序查看

#### 项目技术	
`Spring-boot` `MPVue` `Elasticsearch` `Vue-Copper` `Redis`

#### 责任描述	
首次熟悉和认识小程序和公众号的开发,首次认识微信模块,首次用java异步图片修改合成,减小主线程的压力和响应时间,推出根据用户上传图片，识别图片内容来匹配内部诗词资料。

#### 负责模块
1. 诗词管理：管理所有诗词库以及展示效果(生成海报)
2. 标签分级：诗词所对应的标签，多级标签库
3. 关键词搜索引擎：用户可以用关键词搜索标签(es))
4. 物体识别：根据用户上传的图片解析图片内容，以便来匹配诗词
5. 匹配诗词：根据关键词和算法计算找到相应的诗文
6. 用户管理：管理已经授权过的微信小程序用户
7. 海报生成分享：根据用户上传的图片和匹配到的诗文，来生成不同风格的海报，以便分享

### 开源项目

#### 参与
<p>
	<a href='https://github.com/wuyouzhuguli/FEBS-Cloud'>
		 FEBS-Cloud
	</a>
	<a href='https://github.com/wuyouzhuguli/FEBS-Cloud'>
		<img src="https://img.shields.io/github/stars/wuyouzhuguli/FEBS-Cloud.svg?style=social" alt="github star"/>
	</a>
	使用Spring Cloud、Spring Cloud OAuth2 & Spring Cloud Alibaba构建的低耦合权限管理系统，前端采用vue element admin构建
</p>

---

## 自我评价
1、能吃苦耐劳，善于总结。
2、具有较强的自学能力、适应能力、抗压能力和团队协作能力，不排斥加班。
3、对软件有浓厚的兴趣，渴望学习更多的编程思想和新的技术，喜欢编程带来的成就感。
4、为人真诚守信，做事持之以恒。
5、拥有良好的职业素质和较强的责任心和目标导向。

--- 

## 致谢
感谢您花时间阅读我的简历，期待能有机会和您共事。
