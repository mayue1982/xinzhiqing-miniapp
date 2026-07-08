const api = require('../../services/api')

const LAST_ORDER_KEY = 'latest_route_order'

Page({
  data: {
    route: null,
    submitting: false,
    form: {
      name: '',
      phone: '',
      city: '',
      groupSize: '',
      timeWindow: '',
      note: ''
    }
  },
  async onLoad(options) {
    const res = await api.getRoute(options.id)
    this.setData({ route: res.data })
  },
  updateField(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`form.${field}`]: e.detail.value
    })
  },
  async submitSignup() {
    if (this.data.submitting) return

    const { name, phone, city, groupSize, timeWindow, note } = this.data.form
    if (!name || !phone || !city || !groupSize) {
      wx.showToast({ title: '请填写姓名、电话、城市和人数', icon: 'none' })
      return
    }

    this.setData({ submitting: true })
    try {
      const res = await api.createOrder({
        routeId: this.data.route.id,
        routeTitle: this.data.route.title,
        name,
        phone,
        city,
        groupSize,
        timeWindow,
        note
      })
      wx.setStorageSync(LAST_ORDER_KEY, res.data)
      this.setData({ submitting: false })
      wx.redirectTo({ url: `/pages/order-detail/index?id=${res.data.id}` })
    } catch (error) {
      this.setData({ submitting: false })
      wx.showToast({ title: '提交失败，请稍后重试', icon: 'none' })
    }
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})
