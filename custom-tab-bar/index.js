Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/home/index', text: '首页', iconClass: 'tab-home' },
      { pagePath: '/pages/growth/index', text: '成长定制', iconClass: 'tab-grow' },
      { pagePath: '/pages/news/index', text: '资讯', iconClass: 'tab-news' },
      { pagePath: '/pages/mine/index', text: '我的', iconClass: 'tab-mine' }
    ]
  },
  methods: {
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      this.setData({ selected: index })
      wx.switchTab({ url: path })
    }
  }
})
