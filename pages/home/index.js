const api = require('../../services/api')

Page({
  data: {
    carouselItems: [
      {
        image: '/assets/images/carousel-stars.jpg',
        title: '星空成长旅程',
        subtitle: 'MIND JOURNEY'
      },
      {
        image: '/assets/images/carousel-healing.jpg',
        title: '自然疗愈恢复',
        subtitle: 'NATURE HEALING'
      },
      {
        image: '/assets/images/carousel-culture.jpg',
        title: '文化游学体验',
        subtitle: 'CULTURAL STUDY'
      }
    ],
    quickItems: [],
    levels: [],
    routes: []
  },
  onShow() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 0 })
    this.loadPage()
  },
  async loadPage() {
    const res = await api.getBootstrap()
    const routeImages = [
      '/assets/images/carousel-stars.jpg',
      '/assets/images/carousel-healing.jpg',
      '/assets/images/carousel-culture.jpg',
      '/assets/images/carousel-stars.jpg'
    ]
    this.setData({
      quickItems: res.data.quickItems || [],
      levels: res.data.levels || [],
      routes: (res.data.routes || []).map((item, index) => ({
        ...item,
        image: routeImages[index % routeImages.length]
      }))
    })
  },
  openRoute(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/route-detail/index?id=${id}` })
  }
})
