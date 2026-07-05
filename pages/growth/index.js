const api = require('../../services/api')
const share = require('../../services/share')

const DRAFT_KEY = 'growth_request_draft'
const LAST_REQUEST_KEY = 'latest_growth_request'
const PREFILL_KEY = 'growth_request_prefill'

function createEmptyForm(serviceType) {
  return {
    city: '',
    destination: '',
    groupSize: '',
    timeWindow: '',
    budget: '',
    serviceType: serviceType || '成长定制',
    note: ''
  }
}

Page({
  data: {
    chips: ['培训', '游学', '线路', '定制'],
    selectedChip: '培训',
    form: createEmptyForm('培训'),
    submitting: false
  },
  onShow() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 1 })

    const draft = wx.getStorageSync(DRAFT_KEY)
    const prefill = wx.getStorageSync(PREFILL_KEY)
    const nextForm = draft && Object.keys(draft).length ? draft : createEmptyForm(this.data.selectedChip)

    if (prefill) {
      nextForm.note = nextForm.note ? `${nextForm.note}\n意向路线：${prefill}` : `意向路线：${prefill}`
      wx.removeStorageSync(PREFILL_KEY)
    }

    this.setData({
      form: nextForm,
      selectedChip: nextForm.serviceType || '培训'
    })
  },
  selectChip(e) {
    const chip = e.currentTarget.dataset.value
    this.setData({
      selectedChip: chip,
      'form.serviceType': chip
    })
  },
  updateField(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`form.${field}`]: e.detail.value
    })
  },
  saveDraft() {
    wx.setStorageSync(DRAFT_KEY, this.data.form)
    wx.showToast({ title: '已保存', icon: 'success' })
  },
  async submitRequest() {
    if (this.data.submitting) return

    const { city, destination, groupSize, timeWindow, budget, serviceType, note } = this.data.form
    if (!city || !destination || !groupSize || !timeWindow || !budget || !serviceType || !note) {
      wx.showToast({ title: '请先填写完整信息', icon: 'none' })
      return
    }

    this.setData({ submitting: true })
    try {
      const res = await api.createRequest({
        type: '成长定制',
        city,
        destination,
        groupSize,
        timeWindow,
        budget,
        serviceType,
        note
      })
      wx.setStorageSync(LAST_REQUEST_KEY, res.data)
      wx.removeStorageSync(DRAFT_KEY)
      this.setData({
        submitting: false,
        form: createEmptyForm(this.data.selectedChip)
      })
      wx.navigateTo({ url: '/pages/growth-success/index' })
    } catch (error) {
      this.setData({ submitting: false })
      wx.showToast({ title: '提交失败，请稍后重试', icon: 'none' })
    }
  },
  onShareAppMessage() {
    return share.createShareConfig({
      title: '心之清文旅｜定制你的成长旅程',
      path: '/pages/growth/index'
    })
  },
  onShareTimeline() {
    return share.createShareConfig({
      title: '心之清文旅｜成长定制',
      path: '/pages/growth/index'
    })
  }
})
