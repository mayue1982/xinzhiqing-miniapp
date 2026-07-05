const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')

const PORT = Number(process.env.PORT || 3001)
const STATE_FILE = path.join(__dirname, 'data', 'state.json')

function readState() {
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8')
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  res.end(JSON.stringify(payload))
}

function notFound(res, message) {
  sendJson(res, 404, { ok: false, message: message || 'Not Found' })
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => {
      if (!chunks.length) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function findById(list, id) {
  return list.find(item => item.id === id)
}

function getBootstrap(state) {
  return {
    ok: true,
    data: {
      brandName: state.brandName,
      profile: state.profile,
      stats: state.stats,
      contact: state.contact,
      hero: state.hero,
      quickItems: state.quickItems,
      levels: state.levels,
      routes: state.routes,
      articles: state.articles,
      orders: state.orders,
      requests: state.requests,
      consultations: state.consultations || [],
      menus: state.menus,
      recentOrders: state.recentOrders,
      recentRequests: state.recentRequests,
      favorites: state.favorites || []
    }
  }
}

function nextRequestId(state) {
  const nextNumber = String(state.requests.length + 1).padStart(3, '0')
  return `REQ-${nextNumber}`
}

async function handleRequest(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`)
  const { pathname } = requestUrl

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  const state = readState()

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { ok: true, data: { status: 'healthy', time: new Date().toISOString() } })
    return
  }

  if (req.method === 'GET' && pathname === '/api/bootstrap') {
    sendJson(res, 200, getBootstrap(state))
    return
  }

  if (req.method === 'GET' && pathname === '/api/routes') {
    sendJson(res, 200, { ok: true, data: state.routes })
    return
  }

  if (req.method === 'GET' && pathname.startsWith('/api/routes/')) {
    const id = decodeURIComponent(pathname.split('/').pop())
    const route = findById(state.routes, id)
    if (!route) {
      notFound(res, 'Route not found')
      return
    }
    sendJson(res, 200, { ok: true, data: route })
    return
  }

  if (req.method === 'GET' && pathname === '/api/articles') {
    sendJson(res, 200, { ok: true, data: state.articles })
    return
  }

  if (req.method === 'GET' && pathname.startsWith('/api/articles/')) {
    const id = decodeURIComponent(pathname.split('/').pop())
    const article = findById(state.articles, id)
    if (!article) {
      notFound(res, 'Article not found')
      return
    }
    sendJson(res, 200, { ok: true, data: article })
    return
  }

  if (req.method === 'GET' && pathname === '/api/mine') {
    sendJson(res, 200, {
      ok: true,
      data: {
        profile: state.profile,
        stats: state.stats,
        menus: state.menus,
        recentOrders: state.recentOrders,
        recentRequests: state.recentRequests,
        contact: state.contact
      }
    })
    return
  }

  if (req.method === 'GET' && pathname === '/api/orders') {
    sendJson(res, 200, { ok: true, data: state.orders })
    return
  }

  if (req.method === 'GET' && pathname === '/api/orders/latest') {
    const order = state.orders[0] || null
    if (!order) {
      notFound(res, 'Order not found')
      return
    }
    sendJson(res, 200, { ok: true, data: order })
    return
  }

  if (req.method === 'GET' && pathname.startsWith('/api/orders/')) {
    const id = decodeURIComponent(pathname.split('/').pop())
    const order = findById(state.orders, id)
    if (!order) {
      notFound(res, 'Order not found')
      return
    }
    sendJson(res, 200, { ok: true, data: order })
    return
  }

  if (req.method === 'GET' && pathname === '/api/requests') {
    sendJson(res, 200, { ok: true, data: state.requests })
    return
  }

  if (req.method === 'GET' && pathname.startsWith('/api/requests/')) {
    const id = decodeURIComponent(pathname.split('/').pop())
    const request = findById(state.requests, id)
    if (!request) {
      notFound(res, 'Request not found')
      return
    }
    sendJson(res, 200, { ok: true, data: request })
    return
  }

  if (req.method === 'GET' && pathname === '/api/consultations') {
    sendJson(res, 200, { ok: true, data: state.consultations || [] })
    return
  }

  if (req.method === 'GET' && pathname === '/api/favorites') {
    sendJson(res, 200, { ok: true, data: state.favorites || [] })
    return
  }

  if (req.method === 'GET' && pathname === '/api/contact') {
    sendJson(res, 200, { ok: true, data: state.contact || {} })
    return
  }

  if (req.method === 'POST' && pathname === '/api/requests') {
    const body = await parseBody(req)
    const request = {
      id: nextRequestId(state),
      type: body.type || '成长定制',
      city: body.city || '',
      destination: body.destination || '',
      groupSize: body.groupSize || '',
      timeWindow: body.timeWindow || '',
      budget: body.budget || '',
      serviceType: body.serviceType || '',
      note: body.note || '',
      status: '已提交，待顾问跟进',
      createdAt: new Date().toISOString()
    }

    state.requests.unshift(request)
    state.stats.requests = state.requests.length
    state.recentRequests = [
      {
        id: request.id,
        title: request.serviceType || request.type,
        status: request.status
      },
      ...state.recentRequests
    ].slice(0, 3)
    writeState(state)

    sendJson(res, 201, { ok: true, data: request })
    return
  }

  sendJson(res, 404, { ok: false, message: 'Unknown endpoint' })
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(error => {
    console.error(error)
    sendJson(res, 500, { ok: false, message: error.message || 'Internal Server Error' })
  })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Xinzhiqing backend listening on http://127.0.0.1:${PORT}`)
})

