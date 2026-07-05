const api = require('../../services/api')

Page({
  data: {
    order: null
  },
  async onLoad(options) {
    const res = await api.getOrder(options.id)
    this.setData({ order: res.data })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})
