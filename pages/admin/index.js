const { ADMIN_EMAIL } = require('../../services/cloud-config')

function formatTime(value) {
  if (!value) return ''
  return String(value).replace('T', ' ').replace('.000Z', '').slice(0, 16)
}

function buildContactText(item) {
  return [
    `联系人：${item.name || item.contactName || '未填写'}`,
    `电话：${item.phone || '未填写'}`,
    `城市：${item.city || '未填写'}`,
    `人数：${item.groupSize || '未填写'}`,
    `时间：${item.timeWindow || '未填写'}`,
    `备注：${item.note || '无'}`
  ].join('\n')
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
        contactText: buildContactText(item),
        displayTime: formatTime(item.createdAt)
      }))
      const orders = (res.result.orders || []).map(item => ({
        ...item,
        contactText: buildContactText(item),
        displayTime: formatTime(item.createdAt)
      }))
      this.setData({ requests, orders, loading: false })
    } catch (error) {
      this.setData({ loading: false })
      wx.showToast({ title: '后台列表未部署', icon: 'none' })
      console.warn('[cloud] adminList failed:', error)
    }
  },
  async runAdminAction(collection, item, action) {
    if (!item || !item._id) {
      wx.showToast({ title: '缺少云端记录编号', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'adminAction',
        data: {
          username: this.data.loginForm.username,
          password: this.data.loginForm.password,
          collection,
          _id: item._id,
          action
        }
      })
      if (!res.result || !res.result.ok) {
        this.setData({ loading: false })
        wx.showToast({ title: '操作未授权或未部署', icon: 'none' })
        return
      }
      wx.showToast({ title: action === 'delete' ? '已删除' : '已更新', icon: 'success' })
      await this.loadRequests()
    } catch (error) {
      this.setData({ loading: false })
      wx.showToast({ title: '管理操作未部署', icon: 'none' })
      console.warn('[cloud] adminAction failed:', error)
    }
  },
  getListItem(collection, index) {
    const list = collection === 'orders' ? this.data.orders : this.data.requests
    return list[Number(index)]
  },
  confirmRecord(e) {
    const { collection, index } = e.currentTarget.dataset
    this.runAdminAction(collection, this.getListItem(collection, index), 'confirm')
  },
  markConsulted(e) {
    const { collection, index } = e.currentTarget.dataset
    this.runAdminAction(collection, this.getListItem(collection, index), 'consulted')
  },
  deleteRecord(e) {
    const { collection, index } = e.currentTarget.dataset
    const item = this.getListItem(collection, index)
    if (!item) return

    wx.showModal({
      title: '确认删除',
      content: `确定删除「${item.routeTitle || item.serviceType || item.type || item.name || '这条记录'}」吗？删除后无法恢复。`,
      confirmText: '删除',
      confirmColor: '#d93025',
      success: modal => {
        if (modal.confirm) {
          this.runAdminAction(collection, item, 'delete')
        }
      }
    })
  },
  copyContact(e) {
    const { collection, index } = e.currentTarget.dataset
    const item = this.getListItem(collection, index)
    if (!item) return
    wx.setClipboardData({ data: item.contactText || buildContactText(item) })
  },
  callPhone(e) {
    const { collection, index } = e.currentTarget.dataset
    const item = this.getListItem(collection, index)
    const phone = item && item.phone
    if (!phone) {
      wx.showToast({ title: '用户未填写电话', icon: 'none' })
      return
    }
    wx.makePhoneCall({ phoneNumber: String(phone) })
  },
  goBack() {
    wx.navigateBack({ delta: 1 })
  },
  copyEmail() {
    wx.setClipboardData({ data: this.data.adminEmail })
  }
})
