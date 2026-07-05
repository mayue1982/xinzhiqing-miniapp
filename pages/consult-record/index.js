const api = require('../../services/api')

Page({
  data: {
    consultations: []
  },
  async onShow() {
    const res = await api.getConsultations()
    this.setData({ consultations: res.data || [] })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})
