const api = require('../../services/api')

Page({
  data: {
    favorites: []
  },
  async onShow() {
    const res = await api.getFavorites()
    this.setData({ favorites: res.data || [] })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  openRoute(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/route-detail/index?id=${id}` })
  }
})
