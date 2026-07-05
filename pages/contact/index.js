const api = require('../../services/api')

Page({
  data: {
    contact: {
      title: '联系顾问',
      description: '',
      advisor: null
    }
  },
  async onShow() {
    const res = await api.getContact()
    this.setData({ contact: res.data || this.data.contact })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  copyWechat() {
    const advisor = this.data.contact.advisor
    if (!advisor || !advisor.wechat) return
    wx.setClipboardData({ data: advisor.wechat })
  },
  copyPhone() {
    const advisor = this.data.contact.advisor
    if (!advisor || !advisor.phone) return
    wx.setClipboardData({ data: advisor.phone })
  }
})
