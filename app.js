const { CLOUD_ENV_ID } = require('./services/cloud-config')

App({
  onLaunch() {
    if (wx.cloud && CLOUD_ENV_ID) {
      wx.cloud.init({
        env: CLOUD_ENV_ID,
        traceUser: true
      })
    }
  },
  globalData: {
    brandName: '心之清文旅',
    cloudEnvId: CLOUD_ENV_ID
  }
})
