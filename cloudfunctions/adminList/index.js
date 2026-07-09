const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

function isAdmin(event) {
  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!expectedUsername || !expectedPassword) {
    return false
  }

  return event.username === expectedUsername && event.password === expectedPassword
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
