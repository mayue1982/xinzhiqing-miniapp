const api = require('../../services/api')

Page({
  data: {
    order: null,
    orders: [],
    selectedOrderId: ''
  },
  async onLoad(options) {
    this.setData({ selectedOrderId: options.id || '' })
    await this.loadOrders(options.id)
  },
  async onShow() {
    await this.loadOrders(this.data.selectedOrderId)
  },
  async loadOrders(id) {
    const res = await api.getOrders()
    const orders = (res.data || []).map(item => ({
      ...item,
      displayTime: item.createdAt ? item.createdAt.replace('T', ' ').slice(0, 16) : ''
    }))
    const order = id ? orders.find(item => item.id === id) : null
    this.setData({ orders, order })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  openOrder(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      selectedOrderId: id,
      order: this.data.orders.find(item => item.id === id) || null
    })
  },
  goHome() {
    wx.switchTab({ url: '/pages/home/index' })
  }
})
