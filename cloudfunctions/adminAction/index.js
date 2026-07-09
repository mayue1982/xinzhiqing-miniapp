const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const ALLOWED_COLLECTIONS = ['orders', 'requests']
const ACTION_STATUS = {
  confirm: {
    orders: '已确认',
    requests: '已确认，待顾问方案'
  },
  consulted: {
    orders: '已联系咨询',
    requests: '已联系咨询'
  }
}

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

function getCollection(event) {
  const collection = String(event.collection || '').trim()
  return ALLOWED_COLLECTIONS.includes(collection) ? collection : ''
}

function getDocId(event) {
  return String(event._id || event.docId || '').trim()
}

exports.main = async event => {
  const payload = event || {}
  if (!isAdmin(payload)) {
    return {
      ok: false,
      reason: 'UNAUTHORIZED'
    }
  }

  const collection = getCollection(payload)
  const docId = getDocId(payload)
  const action = String(payload.action || '').trim()

  if (!collection || !docId) {
    return {
      ok: false,
      reason: 'INVALID_TARGET'
    }
  }

  const db = cloud.database()
  const now = new Date().toISOString()

  if (action === 'delete') {
    await db.collection(collection).doc(docId).remove()
    return {
      ok: true,
      action,
      deleted: true
    }
  }

  const status = ACTION_STATUS[action] && ACTION_STATUS[action][collection]
  if (!status) {
    return {
      ok: false,
      reason: 'INVALID_ACTION'
    }
  }

  await db.collection(collection).doc(docId).update({
    data: {
      status,
      adminStatus: action,
      updatedAt: now
    }
  })

  return {
    ok: true,
    action,
    status,
    updatedAt: now
  }
}
