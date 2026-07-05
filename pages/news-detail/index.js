const api = require('../../services/api')

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
  }
})
