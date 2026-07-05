const api = require('../../services/api')

Page({
  data: {
    quickItems: [],
    levels: [],
    routes: []
  },
  onShow() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 0 })
    this.loadPage()
  },
  async loadPage() {
    const res = await api.getBootstrap()
    this.setData({
      quickItems: res.data.quickItems || [],
      levels: res.data.levels || [],
      routes: res.data.routes || []
    })
  },
  openRoute(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/route-detail/index?id=${id}` })
  }
})
