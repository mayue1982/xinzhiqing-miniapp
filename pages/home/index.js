const api = require('../../services/api')

Page({
  data: {
    featuredRoute: {
      id: 'route-xj-aug',
      image: '/assets/images/route-xinjiang.jpg',
      tag: '精品路线',
      title: '新疆心灵之旅',
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
    insightItems: [
      { label: '01', title: '疗愈', copy: '从身体感受出发，把旅行变成恢复秩序的过程。' },
      { label: '02', title: '自然', copy: '以山川、草原与星空作为场域，重新打开感知。' },
      { label: '03', title: '故事', copy: '每一段路线都保留文化脉络、人物记忆与地方精神。' }
    ],
    routes: []
  },
  onShow() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 0 })
    this.loadPage()
  },
  async loadPage() {
    const res = await api.getBootstrap()
    const routeConfig = [
      { id: 'route-001', image: '/assets/images/route-training.jpg' },
      { id: 'route-003', image: '/assets/images/route-culture.jpg' },
      { id: 'route-002', image: '/assets/images/route-healing.jpg' },
      { id: 'route-004', image: '/assets/images/route-xinjiang.jpg' }
    ]
    const quickIconClasses = ['quick-visual-training', 'quick-visual-renewal', 'quick-visual-healing', 'quick-visual-travel']
    const routesById = (res.data.routes || []).reduce((map, route) => {
      map[route.id] = route
      return map
    }, {})
    const routes = routeConfig
      .map(config => routesById[config.id] && {
        ...routesById[config.id],
        image: config.image
      })
      .filter(Boolean)
    const quickItems = (res.data.quickItems || []).map((item, index) => ({
      ...item,
      iconClass: quickIconClasses[index % quickIconClasses.length],
      routeId: routes[index] && routes[index].id
    }))
    this.setData({
      quickItems,
      levels: res.data.levels || [],
      routes
    })
  },
  openRoute(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({ url: `/pages/route-detail/index?id=${id}` })
  },
  openGrowth() {
    wx.switchTab({ url: '/pages/growth/index' })
  }
})
