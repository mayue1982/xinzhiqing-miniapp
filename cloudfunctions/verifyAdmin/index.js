const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async event => {
  const expectedUsername = String(process.env.ADMIN_USERNAME || '').trim().toLowerCase()
  const expectedPassword = String(process.env.ADMIN_PASSWORD || '').trim()
  const username = String(event.username || '').trim().toLowerCase()
  const password = String(event.password || '').trim()

  if (!expectedUsername || !expectedPassword) {
    console.warn('ADMIN_USERNAME or ADMIN_PASSWORD is not configured.')
    return {
      ok: false,
      reason: 'ADMIN_AUTH_NOT_CONFIGURED'
    }
  }

  return {
    ok: username === expectedUsername && password === expectedPassword
  }
}
