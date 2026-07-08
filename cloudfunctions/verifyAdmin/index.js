const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async event => {
  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD
  const username = event.username || ''
  const password = event.password || ''

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
