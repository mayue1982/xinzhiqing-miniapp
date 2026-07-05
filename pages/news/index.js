const api = require('../../services/api')
const share = require('../../services/share')

Page({
  data: {
    chips: [
      { title: '疗愈', category: 'healing' },
      { title: '自然', category: 'nature' },
      { title: '故事', category: 'story' }
    ],
    selectedCategory: 'healing',
    selectedCategoryTitle: '疗愈文章',
    articles: [],
    visibleArticles: []
  },
  onShow() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 2 })
    this.loadArticles()
  },
  async loadArticles() {
    const res = await api.getArticles()
    const articles = res.data || []
    this.setData({ articles }, () => this.updateVisibleArticles())
  },
  selectCategory(e) {
    const { category } = e.currentTarget.dataset
    if (!category) return
    const matched = this.data.chips.find(item => item.category === category)
    this.setData({
      selectedCategory: category,
      selectedCategoryTitle: matched ? `${matched.title}文章` : '文章列表'
    }, () => this.updateVisibleArticles())
  },
  updateVisibleArticles() {
    const visibleArticles = this.data.articles.filter(item => item.category === this.data.selectedCategory)
    this.setData({ visibleArticles })
  },
  openArticle(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/news-detail/index?id=${id}` })
  },
  onShareAppMessage() {
    return share.createShareConfig({
      title: '心之清文旅｜疗愈、自然与文明故事',
      path: '/pages/news/index'
    })
  },
  onShareTimeline() {
    return share.createShareConfig({
      title: '心之清文旅｜成长资讯',
      path: '/pages/news/index'
    })
  }
})
