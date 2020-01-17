module.exports = {
  title: "My Blog",
  description: '为了更美好的明天而战！',
  dest: 'example/docs/public',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  // theme: 'reco',
  theme: require.resolve('../../../'),
  themeConfig: {
    nav: [
      { text: '首页', link: '/', icon: 'reco-home' },
      { text: '时轴', link: '/timeLine/', icon: 'reco-date' },
      { text: '关于',
        icon: 'reco-message',
        items: [
          { text: 'GitHub', link: 'https://github.com/remember-5', icon: 'reco-github' },
          { text: 'WeChat', link: 'http://qiniu.remember5.top/85b8e2ae-72ca-4357-9fc4-7fc234db39be', icon: 'reco-wechat' },
        ]
      }
    ],
    type: 'blog',
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: '分类' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: '标签' // 默认 “标签”
      }
    },
    authorAvatar: '/my-head.png',
    logo: '/my-head.png',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    sidebar: 'auto',
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: 'WangJiaHao',
    // 备案号
    record: '豫ICP备18022029',
    // 项目开始时间
    startYear: '2019',
    /**
     * 密钥 (if your blog is private)
     */

    // keyPage: {
    //   keys: ['your password'],
    //   color: '#42b983',
    //   lineColor: '#42b983'
    // },

    /**
     * valine 设置 (if you need valine comment )
     */

    // valineConfig: {
    //   appId: '...',// your appId
    //   appKey: '...', // your appKey
    // }
    vssueConfig: {
      admins: ['recoluan'],
      platform: 'github',
      owner: 'remember-5',
      repo: 'remember-5.github.io',
      clientId: '3c0f0716317e802812ce',
      clientSecret: '20c95dcac4e47c14b20e01674fe270df8ff5665e',
    },
    // keyPage: {
    //   keys: ['123456']
    // },
    friendLink: [
      {
        title: 'mrbird',
        desc: '无敌的鸟哥',
        email: '',
        link: 'https://mrbird.cc/',
        logo: 'https://mrbird.cc/images/blogImage.jpg'
      },
      {
        title: 'yuukiblog',
        desc: '早起的虫儿被鸟吃，还在研究hexo…',
        email: '1915995162@qq.com',
        link: 'https://yuukiblog.top/',
        logo: 'https://avatars1.githubusercontent.com/u/17798853?s=460&v=4'
      },
      {
        title: '落日余晖',
        desc: 'Hi, nice to meet you',
        email: '',
        link: 'https://mgzu.github.io/',
        logo: 'https://mgzu.github.io/img/ma/ma.png'
      },
      {
        title: 'vuepress-theme-reco',
        desc: 'A simple and beautiful vuepress Blog & Doc theme.',
        logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: 'https://vuepress-theme-reco.recoluan.com'
      },
    ]
  },
  markdown: {
    lineNumbers: true
  }
}
