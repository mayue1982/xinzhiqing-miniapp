const mock = require('../mock/data')
const { CLOUD_ENV_ID } = require('./cloud-config')

const REQUESTS_KEY = 'xinzhiqing_requests'
const ORDERS_KEY = 'xinzhiqing_orders'
const FAVORITES_KEY = 'xinzhiqing_favorites'

function fallback(data) {
  return Promise.resolve({ ok: true, data })
}

function readList(key) {
  const value = wx.getStorageSync(key)
  return Array.isArray(value) ? value : []
}

function writeList(key, list) {
  wx.setStorageSync(key, list)
}

function prependRecord(key, record) {
  const nextList = [record, ...readList(key)]
  writeList(key, nextList)
  return nextList
}

function canUseCloud() {
  return Boolean(CLOUD_ENV_ID && wx.cloud)
}

function getDb() {
  return wx.cloud.database({ env: CLOUD_ENV_ID })
}

async function submitCloudRecord(collection, record) {
  const res = await wx.cloud.callFunction({
    name: 'submitRecord',
    data: {
      collection,
      record
    }
  })
  if (!res.result || !res.result.ok) {
    throw new Error((res.result && res.result.reason) || 'SUBMIT_RECORD_FAILED')
  }
  return {
    ...record,
    _id: res.result._id
  }
}

async function getCloudMyRecords() {
  const res = await wx.cloud.callFunction({
    name: 'myRecords'
  })
  if (!res.result || !res.result.ok) {
    throw new Error((res.result && res.result.reason) || 'MY_RECORDS_FAILED')
  }
  return res.result
}

function normalizeRequest(item) {
  return {
    ...item,
    id: item.id || item._id
  }
}

function normalizeOrder(item) {
  return {
    ...item,
    id: item.id || item._id
  }
}

const bootstrapData = {
  brandName: '心之清文旅',
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
  contact: {
    title: '顾问咨询',
    description: '当前版本先由顾问承接，小程序客服与报名信息会形成第一阶段咨询记录。',
    advisor: {
      name: '林清顾问',
      role: '成长路线顾问',
      avatar: '顾',
      wechat: 'xinzhiqing-advisor',
      phone: '400-860-2026',
      hours: '09:00 - 21:00',
      responseTime: '24 小时内首次联系'
    }
  },
  hero: {
    badge: 'Global Mind Growth Journey',
    titleEn: 'Xinzhiqing\nCultural Tourism',
    titleZh: '心 之 清 文 旅 · 入 道 调 心 境',
    copy: '在星空与自然之间，回到更清楚、更纯粹的自己。',
    copyEn: 'A mindful path shaped by nature, stillness, and long-term inner clarity.'
  },
  quickItems: [
    { icon: '调', title: '心灵培训' },
    { icon: '养', title: '心灵保养' },
    { icon: '愈', title: '心灵疗愈' },
    { icon: '旅', title: '心灵旅游' }
  ],
  levels: ['初级', '中级', '高级', '使命'],
  routes: mock.routes,
  articles: mock.articles,
  orders: [mock.order],
  requests: [],
  consultations: [],
  menus: [
    { title: '我的订单', meta: '查看' },
    { title: '成长定制', meta: '查看' },
    { title: '顾问咨询', meta: '进入' },
    { title: '我的收藏', meta: '查看' }
  ],
  recentOrders: [],
  recentRequests: [{ id: 'REQ-LOCAL-001', title: '心灵疗愈', status: '希望恢复平衡状态' }],
  favorites: []
}

function getBootstrap() {
  return fallback(bootstrapData)
}

function getRoute(id) {
  return fallback(mock.routes.find(item => item.id === id) || mock.routes[0])
}

function getArticles() {
  return fallback(mock.articles)
}

function getArticle(id) {
  return fallback(mock.articles.find(item => item.id === id) || mock.articles[0])
}

async function getMine() {
  const requestsRes = await getRequests()
  const requests = requestsRes.data || []
  const ordersRes = await getOrders()
  const orders = ordersRes.data || []
  const favorites = readList(FAVORITES_KEY)
  return fallback({
    profile: bootstrapData.profile,
    stats: {
      orders: orders.length,
      requests: requests.length,
      saved: favorites.length
    },
    menus: bootstrapData.menus,
    recentOrders: orders.slice(0, 1),
    recentRequests: requests.length ? requests.slice(0, 1) : bootstrapData.recentRequests,
    contact: bootstrapData.contact
  })
}

async function getOrders() {
  if (canUseCloud()) {
    try {
      const res = await getCloudMyRecords()
      const cloudOrders = (res.orders || []).map(normalizeOrder)
      const localOrders = readList(ORDERS_KEY)
      const merged = mergeById(cloudOrders, localOrders)
      return fallback(merged)
    } catch (error) {
      console.warn('[cloud] getOrders fallback:', error)
    }
  }
  return fallback(readList(ORDERS_KEY))
}

async function getOrder(id) {
  const ordersRes = await getOrders()
  const orders = ordersRes.data || []
  return fallback((id && orders.find(item => item.id === id)) || orders[0] || null)
}

async function getRequests() {
  if (canUseCloud()) {
    try {
      const res = await getCloudMyRecords()
      const cloudRequests = (res.requests || []).map(normalizeRequest)
      const localRequests = readList(REQUESTS_KEY)
      const merged = mergeById(cloudRequests, localRequests)
      return fallback(merged)
    } catch (error) {
      console.warn('[cloud] getRequests fallback:', error)
    }
  }
  return fallback(readList(REQUESTS_KEY))
}

async function getConsultations() {
  const requestsRes = await getRequests()
  const ordersRes = await getOrders()
  const requests = (requestsRes.data || []).map(item => ({
    id: item.id,
    title: item.serviceType || item.type || '成长定制',
    status: item.status || '已提交',
    summary: `${item.city || '未填写出发地'} / ${item.destination || '未填写目的地'} / ${item.note || '暂无备注'}`,
    updatedAt: item.createdAt || ''
  }))
  const orders = (ordersRes.data || []).map(item => ({
    id: item.id,
    title: item.routeTitle || '路线报名',
    status: item.status || '已报名',
    summary: `${item.name || '未填写姓名'} / ${item.phone || '未填写电话'} / ${item.note || '暂无备注'}`,
    updatedAt: item.createdAt || ''
  }))
  return fallback([...orders, ...requests].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))))
}

function getFavorites() {
  return fallback(readList(FAVORITES_KEY))
}

function getContact() {
  return fallback(bootstrapData.contact)
}

function mergeById(primary, secondary) {
  const map = {}
  return [...primary, ...secondary]
    .filter(item => item && item.id)
    .filter(item => {
      if (map[item.id]) return false
      map[item.id] = true
      return true
    })
}

async function notifyRequestByEmail(request) {
  if (!canUseCloud()) return
  try {
    await wx.cloud.callFunction({
      name: 'sendRequestEmail',
      data: { request }
    })
  } catch (error) {
    console.warn('[cloud] sendRequestEmail skipped:', error)
  }
}

async function createRequest(payload) {
  const now = new Date().toISOString()
  const request = {
    id: `REQ-${Date.now()}`,
    type: payload.type || '成长定制',
    city: payload.city || '',
    destination: payload.destination || '',
    groupSize: payload.groupSize || '',
    timeWindow: payload.timeWindow || '',
    budget: payload.budget || '',
    serviceType: payload.serviceType || '',
    note: payload.note || '',
    status: '已提交，待顾问跟进',
    createdAt: now,
    source: 'miniapp'
  }

  if (canUseCloud()) {
    try {
      const savedRequest = await submitCloudRecord('requests', request)
      prependRecord(REQUESTS_KEY, savedRequest)
      await notifyRequestByEmail(savedRequest)
      return fallback(savedRequest)
    } catch (error) {
      console.warn('[cloud] createRequest fallback:', error)
    }
  }

  prependRecord(REQUESTS_KEY, request)
  return fallback(request)
}

async function createOrder(payload) {
  const now = new Date().toISOString()
  const order = {
    id: `ORD-${Date.now()}`,
    routeId: payload.routeId || '',
    routeTitle: payload.routeTitle || '路线报名',
    name: payload.name || '',
    phone: payload.phone || '',
    city: payload.city || '',
    groupSize: payload.groupSize || '',
    timeWindow: payload.timeWindow || '',
    note: payload.note || '',
    status: '已报名，待顾问确认',
    createdAt: now,
    source: 'miniapp'
  }

  if (canUseCloud()) {
    try {
      const savedOrder = await submitCloudRecord('orders', order)
      prependRecord(ORDERS_KEY, savedOrder)
      await notifyRequestByEmail({
        ...savedOrder,
        type: '路线报名',
        serviceType: savedOrder.routeTitle,
        destination: savedOrder.routeTitle,
        budget: '',
        contactName: savedOrder.name
      })
      return fallback(savedOrder)
    } catch (error) {
      console.warn('[cloud] createOrder fallback:', error)
    }
  }

  prependRecord(ORDERS_KEY, order)
  return fallback(order)
}

function isFavorite(routeId) {
  return fallback(readList(FAVORITES_KEY).some(item => item.routeId === routeId))
}

function toggleFavorite(route) {
  const list = readList(FAVORITES_KEY)
  const exists = list.some(item => item.routeId === route.id)
  if (exists) {
    const nextList = list.filter(item => item.routeId !== route.id)
    writeList(FAVORITES_KEY, nextList)
    return fallback({ favorited: false, favorites: nextList })
  }

  const record = {
    id: `FAV-${Date.now()}`,
    routeId: route.id,
    title: route.title,
    subtitle: route.subtitle,
    desc: route.desc,
    tag: route.id === 'route-xj-aug' ? '即将启程' : '已收藏',
    createdAt: new Date().toISOString()
  }
  const nextList = [record, ...list]
  writeList(FAVORITES_KEY, nextList)
  return fallback({ favorited: true, favorites: nextList })
}

module.exports = {
  getBootstrap,
  getRoute,
  getArticles,
  getArticle,
  getMine,
  getOrders,
  getOrder,
  getRequests,
  getConsultations,
  getFavorites,
  getContact,
  createRequest,
  createOrder,
  isFavorite,
  toggleFavorite
}
