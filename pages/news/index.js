const api = require('../../services/api')

Page({
  data: {
    chips: ['成长', '疗愈', '自然', '故事'],
    articles: []
  },
  onShow() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 2 })
    this.loadArticles()
  },
  async loadArticles() {
    const res = await api.getArticles()
    this.setData({ articles: res.data || [] })
  },
  openArticle(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/news-detail/index?id=${id}` })
  }
})
