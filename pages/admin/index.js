const api = require('../../services/api')
const { ADMIN_EMAIL } = require('../../services/cloud-config')

function formatTime(value) {
  if (!value) return ''
  return value.replace('T', ' ').replace('.000Z', '').slice(0, 16)
}

Page({
  data: {
    loading: false,
    requests: [],
    adminEmail: ADMIN_EMAIL
  },
  onShow() {
    this.loadRequests()
  },
  async loadRequests() {
    this.setData({ loading: true })
    try {
      const res = await api.getRequests()
      const requests = (res.data || []).map(item => ({
        ...item,
        displayTime: formatTime(item.createdAt)
      }))
      this.setData({ requests, loading: false })
    } catch (error) {
      this.setData({ loading: false })
      wx.showToast({ title: '读取失败', icon: 'none' })
    }
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  copyEmail() {
    wx.setClipboardData({ data: this.data.adminEmail })
  }
})
