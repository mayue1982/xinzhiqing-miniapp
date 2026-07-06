const mock = require('../mock/data')

const REQUESTS_KEY = 'xinzhiqing_requests'
const ORDERS_KEY = 'xinzhiqing_orders'

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

const bootstrapData = {
  brandName: '心之清文旅',
  profile: {
    name: '微信用户',
    subtitle: '查看订单、成长需求与顾问记录。',
    avatar: '心'
  },
  stats: {
    orders: 1,
    requests: 2,
    saved: 3
  },
  contact: {
    title: '联系顾问',
    description: '当前版本先由顾问承接，后续可接入在线咨询。',
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
    { title: '咨询记录', meta: '查看' },
    { title: '我的收藏', meta: '查看' },
    { title: '联系顾问', meta: '进入' }
  ],
  recentOrders: [{ id: mock.order.id, title: mock.order.routeTitle, status: mock.order.status }],
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

function getMine() {
  const requests = readList(REQUESTS_KEY)
  const orders = readList(ORDERS_KEY)
  return fallback({
    profile: bootstrapData.profile,
    stats: {
      orders: orders.length,
      requests: requests.length,
      saved: bootstrapData.stats.saved
    },
    menus: bootstrapData.menus,
    recentOrders: orders.length ? orders.slice(0, 1) : bootstrapData.recentOrders,
    recentRequests: requests.length ? requests.slice(0, 1) : bootstrapData.recentRequests,
    contact: bootstrapData.contact
  })
}

function getOrder(id) {
  const orders = readList(ORDERS_KEY)
  return fallback((id && orders.find(item => item.id === id)) || orders[0] || mock.order)
}

function getRequests() {
  return fallback(readList(REQUESTS_KEY))
}

function getConsultations() {
  return fallback([])
}

function getFavorites() {
  return fallback([])
}

function getContact() {
  return fallback(bootstrapData.contact)
}

function createRequest(payload) {
  const now = new Date().toISOString()
  const request = {
    id: `REQ-LOCAL-${Date.now()}`,
    type: payload.type || '成长定制',
    city: payload.city || '',
    destination: payload.destination || '',
    groupSize: payload.groupSize || '',
    timeWindow: payload.timeWindow || '',
    budget: payload.budget || '',
    serviceType: payload.serviceType || '',
    note: payload.note || '',
    status: '已提交，待顾问跟进',
    createdAt: now
  }
  prependRecord(REQUESTS_KEY, request)
  return fallback(request)
}

module.exports = {
  getBootstrap,
  getRoute,
  getArticles,
  getArticle,
  getMine,
  getOrder,
  getRequests,
  getConsultations,
  getFavorites,
  getContact,
  createRequest
}
