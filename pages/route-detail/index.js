const api = require('../../services/api')
const share = require('../../services/share')

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
  },
  onShareAppMessage() {
    const route = this.data.route || {}
    return share.createShareConfig({
      title: route.title ? `心之清文旅｜${route.title}` : '心之清文旅｜精品路线',
      path: `/pages/route-detail/index?id=${route.id || 'route-xj-aug'}`
    })
  },
  onShareTimeline() {
    return this.onShareAppMessage()
  }
})
