const LAST_REQUEST_KEY = 'latest_growth_request'

Page({
  data: {
    request: null
  },
  onShow() {
    const request = wx.getStorageSync(LAST_REQUEST_KEY)
    this.setData({ request: request || null })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  goHome() {
    wx.switchTab({ url: '/pages/home/index' })
  },
  goRequests() {
    wx.navigateTo({ url: '/pages/request-list/index' })
  }
})
