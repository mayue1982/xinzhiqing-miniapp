const api = require('../../services/api')

function formatTime(value) {
  if (!value) return ''
  return value.replace('T', ' ').replace('.000Z', '').slice(0, 16)
}

Page({
  data: {
    requests: []
  },
  async onShow() {
    const res = await api.getRequests()
    const requests = (res.data || []).map(item => ({
      ...item,
      displayTime: formatTime(item.createdAt)
    }))
    this.setData({ requests })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  goGrowth() {
    wx.switchTab({ url: '/pages/growth/index' })
  }
})
