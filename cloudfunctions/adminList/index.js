const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

function isAdmin(event) {
  const expectedUsername = String(process.env.ADMIN_USERNAME || '').trim().toLowerCase()
  const expectedPassword = String(process.env.ADMIN_PASSWORD || '').trim()
  const username = String(event.username || '').trim().toLowerCase()
  const password = String(event.password || '').trim()

  if (!expectedUsername || !expectedPassword) {
    return false
  }

  return username === expectedUsername && password === expectedPassword
}

async function getCollection(name) {
  const db = cloud.database()
  const res = await db.collection(name).orderBy('createdAt', 'desc').limit(100).get()
  return res.data || []
}

exports.main = async event => {
  if (!isAdmin(event || {})) {
    return {
      ok: false,
      reason: 'UNAUTHORIZED'
    }
  }

  const [orders, requests] = await Promise.all([
    getCollection('orders'),
    getCollection('requests')
  ])

  return {
    ok: true,
    orders,
    requests
  }
}
