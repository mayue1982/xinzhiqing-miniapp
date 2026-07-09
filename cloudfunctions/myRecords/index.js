const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

async function getMine(collection, openid) {
  const db = cloud.database()
  const res = await db.collection(collection)
    .where({
      _openid: openid
    })
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get()
  return res.data || []
}

exports.main = async () => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const [orders, requests] = await Promise.all([
    getMine('orders', openid),
    getMine('requests', openid)
  ])

  return {
    ok: true,
    orders,
    requests
  }
}
