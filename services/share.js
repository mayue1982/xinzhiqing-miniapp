const DEFAULT_SHARE = {
  title: '心之清文旅｜以人文之心探索世界文明',
  path: '/pages/home/index',
  imageUrl: '/assets/images/share-logo-card.jpg'
}

function createShareConfig(options = {}) {
  return {
    ...DEFAULT_SHARE,
    ...options
  }
}

module.exports = {
  createShareConfig,
  DEFAULT_SHARE
}
