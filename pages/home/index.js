const api = require('../../services/api')

Page({
  data: {
    featuredRoute: {
      id: 'route-xj-aug',
      image: '/assets/images/route-xinjiang.jpg',
      tag: '8月主推',
      title: '新疆心灵成长班',
      desc: '天山草原、文化游学与身心成长体验',
      meta: 'Xinjiang · August'
    },
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
      '/assets/images/route-training.jpg',
      '/assets/images/route-healing.jpg',
      '/assets/images/route-culture.jpg',
      '/assets/images/route-xinjiang.jpg'
    ]
    const quickIconClasses = ['quick-visual-training', 'quick-visual-renewal', 'quick-visual-healing', 'quick-visual-travel']
    const quickItems = (res.data.quickItems || []).map((item, index) => ({
      ...item,
      iconClass: quickIconClasses[index % quickIconClasses.length]
    }))
    const routes = (res.data.routes || [])
      .filter(item => item.id !== this.data.featuredRoute.id)
      .map((item, index) => ({
        ...item,
        image: routeImages[index % routeImages.length]
      }))
    this.setData({
      quickItems,
      levels: res.data.levels || [],
      routes
    })
  },
  openRoute(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/route-detail/index?id=${id}` })
  }
})
