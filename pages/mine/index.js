const api = require('../../services/api')
const share = require('../../services/share')

Page({
  data: {
    profile: {
      name: '微信用户',
      subtitle: '查看订单、成长需求与顾问记录。',
      avatar: '心'
    },
    stats: {
      orders: 0,
      requests: 0,
      saved: 0
    },
    menus: [],
    recentOrder: null,
    recentRequest: null,
    contact: {
      title: '联系顾问',
      description: ''
    }
  },
  onShow() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 3 })
    this.loadMine()
  },
  async loadMine() {
    const res = await api.getMine()
    this.setData({
      profile: res.data.profile || this.data.profile,
      stats: res.data.stats || this.data.stats,
      menus: res.data.menus || [],
      recentOrder: (res.data.recentOrders || [])[0] || null,
      recentRequest: (res.data.recentRequests || [])[0] || null,
      contact: res.data.contact || this.data.contact
    })
  },
  handleMenuTap(e) {
    const { title } = e.currentTarget.dataset
    const pageMap = {
      我的订单: '/pages/order-detail/index',
      成长定制: '/pages/request-list/index',
      咨询记录: '/pages/consult-record/index',
      我的收藏: '/pages/favorites/index',
      联系顾问: '/pages/contact/index'
    }
    const url = pageMap[title]
    if (url) {
      wx.navigateTo({ url })
    }
  },
  openRecentOrder() {
    wx.navigateTo({ url: '/pages/order-detail/index' })
  },
  openRecentRequest() {
    wx.navigateTo({ url: '/pages/request-list/index' })
  },
  onShareAppMessage() {
    return share.createShareConfig()
  },
  onShareTimeline() {
    return share.createShareConfig()
  }
})
