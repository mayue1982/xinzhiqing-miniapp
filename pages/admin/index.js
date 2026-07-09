const { ADMIN_EMAIL } = require('../../services/cloud-config')

function formatTime(value) {
  if (!value) return ''
  return value.replace('T', ' ').replace('.000Z', '').slice(0, 16)
}

Page({
  data: {
    authed: false,
    loading: false,
    requests: [],
    orders: [],
    adminEmail: ADMIN_EMAIL,
    loginForm: {
      username: '',
      password: ''
    }
  },
  onShow() {
    if (this.data.authed) this.loadRequests()
  },
  updateLoginField(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`loginForm.${field}`]: e.detail.value
    })
  },
  loginAdmin() {
    const { username, password } = this.data.loginForm
    if (!username || !password) {
      wx.showToast({ title: '请输入账号和密码', icon: 'none' })
      return
    }
    this.verifyAdmin(username, password)
  },
  async verifyAdmin(username, password) {
    this.setData({ loading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'verifyAdmin',
        data: { username, password }
      })
      if (res.result && res.result.ok) {
        this.setData({ authed: true, loading: false })
        wx.showToast({ title: '已进入后台', icon: 'success' })
        this.loadRequests()
        return
      }
      this.setData({ loading: false })
      wx.showToast({ title: '账号或密码不正确', icon: 'none' })
    } catch (error) {
      this.setData({ loading: false })
      wx.showToast({ title: '后台验证未部署', icon: 'none' })
      console.warn('[cloud] verifyAdmin failed:', error)
    }
  },
  logoutAdmin() {
    this.setData({
      authed: false,
      orders: [],
      requests: [],
      loginForm: {
        username: '',
        password: ''
      }
    })
  },
  async loadRequests() {
    if (!this.data.authed) return
    this.setData({ loading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'adminList',
        data: {
          username: this.data.loginForm.username,
          password: this.data.loginForm.password
        }
      })
      if (!res.result || !res.result.ok) {
        this.setData({ loading: false })
        wx.showToast({ title: '后台列表未授权', icon: 'none' })
        return
      }
      const requests = (res.result.requests || []).map(item => ({
        ...item,
        displayTime: formatTime(item.createdAt)
      }))
      const orders = (res.result.orders || []).map(item => ({
        ...item,
        displayTime: formatTime(item.createdAt)
      }))
      this.setData({ requests, orders, loading: false })
    } catch (error) {
      this.setData({ loading: false })
      wx.showToast({ title: '后台列表未部署', icon: 'none' })
    }
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  copyEmail() {
    wx.setClipboardData({ data: this.data.adminEmail })
  }
})
