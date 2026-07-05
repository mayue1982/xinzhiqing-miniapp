const api = require('../../services/api')
const share = require('../../services/share')

Page({
  data: {
    article: null
  },
  async onLoad(options) {
    const res = await api.getArticle(options.id)
    this.setData({ article: res.data })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  onShareAppMessage() {
    const article = this.data.article || {}
    return share.createShareConfig({
      title: article.title ? `心之清文旅｜${article.title}` : '心之清文旅｜成长资讯',
      path: `/pages/news-detail/index?id=${article.id || 'article-healing'}`
    })
  },
  onShareTimeline() {
    return this.onShareAppMessage()
  }
})
