const mock = require('../mock/data')

const BASE_URL = 'http://127.0.0.1:3001'

function request(path, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${path}`,
      method: method || 'GET',
      data,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }
        reject(new Error((res.data && res.data.message) || `HTTP ${res.statusCode}`))
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

function fallback(data) {
  return Promise.resolve({ ok: true, data })
}

async function safeGet(path, fallbackData) {
  try {
    return await request(path)
  } catch (error) {
    return fallback(fallbackData)
  }
}

async function safePost(path, body, fallbackBuilder) {
  try {
    return await request(path, 'POST', body)
  } catch (error) {
    return fallback({
      ...fallbackBuilder(body),
      createdAt: new Date().toISOString()
    })
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
  return safeGet('/api/bootstrap', bootstrapData)
}

function getRoute(id) {
  return safeGet(`/api/routes/${encodeURIComponent(id)}`, mock.routes.find(item => item.id === id) || mock.routes[0])
}

function getArticles() {
  return safeGet('/api/articles', mock.articles)
}

function getArticle(id) {
  return safeGet(`/api/articles/${encodeURIComponent(id)}`, mock.articles.find(item => item.id === id) || mock.articles[0])
}

function getMine() {
  return safeGet('/api/mine', {
    profile: bootstrapData.profile,
    stats: bootstrapData.stats,
    menus: bootstrapData.menus,
    recentOrders: bootstrapData.recentOrders,
    recentRequests: bootstrapData.recentRequests,
    contact: bootstrapData.contact
  })
}

function getOrder(id) {
  if (id) {
    return safeGet(`/api/orders/${encodeURIComponent(id)}`, mock.order)
  }
  return safeGet('/api/orders/latest', mock.order)
}

function getRequests() {
  return safeGet('/api/requests', [])
}

function getConsultations() {
  return safeGet('/api/consultations', [])
}

function getFavorites() {
  return safeGet('/api/favorites', [])
}

function getContact() {
  return safeGet('/api/contact', bootstrapData.contact)
}

function createRequest(payload) {
  return safePost('/api/requests', payload, body => ({
    id: `REQ-LOCAL-${Date.now()}`,
    type: body.type || '成长定制',
    city: body.city || '',
    destination: body.destination || '',
    groupSize: body.groupSize || '',
    timeWindow: body.timeWindow || '',
    budget: body.budget || '',
    serviceType: body.serviceType || '',
    note: body.note || '',
    status: '已提交，待顾问跟进'
  }))
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
