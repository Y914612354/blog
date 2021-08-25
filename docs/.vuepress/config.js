module.exports = {
  dest: 'blog',
  theme: 'reco',
  title: " ",
  description: ' ',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    // ['link', { rel: 'manifest', href: '/manifest.json' }],
    // ['meta', { name: 'theme-color', content: '#FF66CC' }],
    // ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    // ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    // ['link', { rel: 'apple-touch-icon', href: '/icons/LatteAndCat.png' }],
    // ['link', { rel: 'mask-icon', href: '/icons/LatteAndCat.svg', color: '#FF66CC' }],
    // ['meta', { name: 'msapplication-TileImage', content: '/icons/LatteAndCat.png' }],
    // ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  themeConfig: {
    type: 'blog',
    huawei: false,
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
    // 友情链接
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
        }
    ],
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
    logo: '/head.png',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    subSidebar: 'auto',
    sidebarDepth: 1,
    displayAllHeaders: false,
    // sidebar: {
    //   '/note/': [
    //     {
    //       title: 'HTML5',
    //       collapsable: true,
    //       children: [
    //         'html5/HTML5的语义元素',
    //         'html5/HTML5多媒体标签',
    //         'html5/HTML5表单元素',
    //         'html5/HTML5中的API',
    //         'html5/Canvas'
    //       ]
    //     },
    //     {
    //       title: 'CSS',
    //       collapsable: true,
    //       children: [
    //         'css/css3新特性',
    //         'css/css3Flip'
    //       ]
    //     },
    //     {
    //       title: 'JS',
    //       collapsable: true,
    //       children: [
    //         'js/js数据类型',
    //         'js/js对象',
    //         'js/js继承',
    //         'js/js原型链、闭包',
    //         'js/js函数的四种调用方式'
    //       ]
    //     },
    //     {
    //       title: 'Vue.js',
    //       collapsable: true,
    //       children: [
    //         'Vue/Vue基础笔记',
    //         'Vue/Vue组件'
    //       ]
    //     },
    //     {
    //       title: '前端单元测试',
    //       collapsable: true,
    //       children: [
    //         'fe-unit-test/chai',
    //         'fe-unit-test/mocha',
    //         'fe-unit-test/vueTestUtils'
    //       ]
    //     },
    //     {
    //       title: '微信小程序',
    //       collapsable: true,
    //       children: [
    //         'wechat-mini-program/初识微信小程序',
    //       ]
    //     }
    //   ]
    // },
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: 'Remember',
    authorAvatar: '/head.png',
    // 备案号
    record: '豫ICP备18022029号',
    recordLink: 'http://www.beian.miit.gov.cn/',
    cyberSecurityRecord: '豫ICP备18022029号',
    cyberSecurityLink: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41172602000151',
    // 项目开始时间
    startYear: '2019',
    /**
     * valine 设置 (if you need valine comment )
     */
    valineConfig: {
      appId: 'uohdkKFUJP6JbsqXXAE62mgR-gzGzoHsz',// your appId
      appKey: 'uBzIGaKyjmGni6vmLu4gw0UF', // your appKey
      placeholder: '是时候展现真正的技术了',
      avatar: 'wavatar',
      // serverUrl: 'https://leanserver.smallsunnyfox.com'
    },
    // vssueConfig: {
    //   admins: ['recoluan'],
    //   platform: 'github',
    //   owner: 'remember-5',
    //   repo: 'remember-5.github.io',
    //   clientId: '3c0f0716317e802812ce',
    //   clientSecret: '20c95dcac4e47c14b20e01674fe270df8ff5665e',
    // },
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    /* [
      require('./plugins/KanBanNiang'),
      {
        theme: ['blackCat'],
        width: 200,
        height: 400,
        modelStyle: {
          position: 'fixed',
          right: '70px',
          bottom: '50px',
          opacity: '0.9'
        },
        messageStyle: {
          position: 'fixed',
          right: '70px',
          bottom: '380px'
        },
        btnStyle: {
          bottom: '60px',
          right: '80px'
        }
      }
    ], */
    // 背景音乐
    [
      require('./plugins/BgMusic'),
      {
        audios: [
          {
            name: '我再没见过 像你一般的星空',
            artist: 'Seto',
            url: 'https://assets.smallsunnyfox.com/music/Seto我再没见过像你一般的星空.mp3',
            cover: 'https://assets.smallsunnyfox.com/music/1.png'
          },
          {
            name: '萤火之森',
            artist: 'CMJ',
            url: 'https://assets.smallsunnyfox.com/music/CMJ萤火之森.mp3',
            cover: 'https://assets.smallsunnyfox.com/music/2.png'
          }
        ]
      }
    ],
      // pwa
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: {
          message: "发现新内容可用",
          buttonText: "刷新"
        }
      }
    ],
    [
      'permalink-pinyin',
      {
        lowercase: true,
        separator: '-'
      }
    ]
  ]
}
