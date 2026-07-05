const api = require('../../services/api')

Page({
  data: {
    chips: [
      { title: '疗愈', articleId: 'article-healing' },
      { title: '自然', articleId: 'article-nature' },
      { title: '故事', articleId: 'article-story' }
    ],
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
  openChip(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({ url: `/pages/news-detail/index?id=${id}` })
  },
  openArticle(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/news-detail/index?id=${id}` })
  }
})
