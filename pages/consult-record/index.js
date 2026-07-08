const api = require('../../services/api')

Page({
  data: {
    consultations: [],
    contact: null
  },
  async onShow() {
    const [consultRes, contactRes] = await Promise.all([
      api.getConsultations(),
      api.getContact()
    ])
    this.setData({
      consultations: consultRes.data || [],
      contact: contactRes.data || null
    })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  copyWechat() {
    const advisor = this.data.contact && this.data.contact.advisor
    if (!advisor || !advisor.wechat) return
    wx.setClipboardData({ data: advisor.wechat })
  },
  copyPhone() {
    const advisor = this.data.contact && this.data.contact.advisor
    if (!advisor || !advisor.phone) return
    wx.setClipboardData({ data: advisor.phone })
  }
})
