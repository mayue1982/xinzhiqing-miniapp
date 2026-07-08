const api = require('../../services/api')
const share = require('../../services/share')

Page({
  data: {
    route: null,
    isFavorite: false
  },
  async onLoad(options) {
    const res = await api.getRoute(options.id)
    const favoriteRes = await api.isFavorite(res.data.id)
    this.setData({
      route: res.data,
      isFavorite: favoriteRes.data
    })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  goHome() {
    wx.switchTab({ url: '/pages/home/index' })
  },
  startSignup() {
    if (this.data.route && this.data.route.title) {
      wx.setStorageSync('growth_request_prefill', this.data.route.title)
    }
    wx.navigateTo({ url: `/pages/signup/index?id=${this.data.route.id}` })
  },
  async toggleFavorite() {
    if (!this.data.route) return
    const res = await api.toggleFavorite(this.data.route)
    this.setData({ isFavorite: res.data.favorited })
    wx.showToast({
      title: res.data.favorited ? '已收藏' : '已取消',
      icon: 'success'
    })
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
