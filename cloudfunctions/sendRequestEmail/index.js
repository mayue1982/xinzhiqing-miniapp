const cloud = require('wx-server-sdk')
const nodemailer = require('nodemailer')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

function getMailConfig() {
  return {
    host: process.env.SMTP_HOST || 'smtp.163.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') !== 'false',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    to: process.env.ADMIN_EMAIL || 'MAYUE1982@163.COM'
  }
}

function buildMailText(request) {
  return [
    '心之清文旅收到新的报名需求：',
    '',
    `编号：${request.id || request._id || ''}`,
    `类型：${request.serviceType || request.type || ''}`,
    `联系人：${request.contactName || request.name || ''}`,
    `联系电话：${request.phone || ''}`,
    `出发城市：${request.city || ''}`,
    `目的地方向：${request.destination || ''}`,
    `人数：${request.groupSize || ''}`,
    `时间：${request.timeWindow || ''}`,
    `预算：${request.budget || ''}`,
    `备注：${request.note || ''}`,
    `提交时间：${request.createdAt || ''}`
  ].join('\n')
}

exports.main = async event => {
  const request = event.request || {}
  const config = getMailConfig()

  if (!config.user || !config.pass) {
    console.warn('SMTP_USER or SMTP_PASS is not configured.')
    return {
      ok: false,
      skipped: true,
      reason: 'SMTP_NOT_CONFIGURED'
    }
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    }
  })

  const info = await transporter.sendMail({
    from: `"心之清文旅" <${config.user}>`,
    to: config.to,
    subject: `新的报名需求：${request.serviceType || request.type || '成长定制'}`,
    text: buildMailText(request)
  })

  return {
    ok: true,
    messageId: info.messageId
  }
}
