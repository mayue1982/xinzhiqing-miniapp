const api = require('../../services/api')

Page({
  data: {
    route: null
  },
  async onLoad(options) {
    const res = await api.getRoute(options.id)
    this.setData({ route: res.data })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  goHome() {
    wx.switchTab({ url: '/pages/home/index' })
  },
  startConsult() {
    if (this.data.route && this.data.route.title) {
      wx.setStorageSync('growth_request_prefill', this.data.route.title)
    }
    wx.switchTab({ url: '/pages/growth/index' })
  }
})
