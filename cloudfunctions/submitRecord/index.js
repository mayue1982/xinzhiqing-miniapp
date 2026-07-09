const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const ALLOWED_COLLECTIONS = ['orders', 'requests']

exports.main = async event => {
  const wxContext = cloud.getWXContext()
  const collection = event.collection
  const record = event.record || {}

  if (!ALLOWED_COLLECTIONS.includes(collection)) {
    return {
      ok: false,
      reason: 'COLLECTION_NOT_ALLOWED'
    }
  }

  const db = cloud.database()
  const res = await db.collection(collection).add({
    data: {
      ...record,
      _openid: wxContext.OPENID,
      updatedAt: new Date().toISOString()
    }
  })

  return {
    ok: true,
    _id: res._id
  }
}
