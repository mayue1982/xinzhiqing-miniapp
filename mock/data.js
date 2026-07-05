const routes = [
  {
    id: 'route-xj-aug',
    title: '8月新疆心灵成长班',
    subtitle: 'xinjiang august',
    desc: '天山草原、文化游学与身心成长体验。',
    longDesc: '面向8月出发的新疆成长班，以天山草原、自然场域与文化体验为主线，结合身心状态整理、团队陪伴与顾问引导，让旅程从观光升级为一次清晰、舒展、有记忆点的成长体验。',
    audience: '适合希望在暑期参加新疆主题游学、自然疗愈与身心成长体验的家庭、青年与团队。',
    highlights: '新疆草原、天山雪山、文化游学、成长陪伴、8月班期'
  },
  {
    id: 'route-001',
    title: '初级心灵培训线',
    subtitle: 'mind training',
    desc: '建立自我意识，进入成长主线。',
    longDesc: '以自然环境体验为基础，帮助参与者建立正确自我意识，并在真实旅程中逐步进入长期成长主线。',
    audience: '适合希望进行初级心灵训练、状态整理与方向建立的人群。',
    highlights: '自然感受、自我认知、系统化提升、主线建立'
  },
  {
    id: 'route-002',
    title: '自然疗愈恢复线',
    subtitle: 'healing route',
    desc: '释放情绪，恢复平衡与稳定。',
    longDesc: '借助自然与安静环境，帮助用户释放长期积累的负面情绪，逐步恢复平衡、稳定与呼吸感。',
    audience: '适合高压、疲惫、情绪长期紧绷的人群。',
    highlights: '情绪释放、环境修复、恢复平衡、状态稳定'
  },
  {
    id: 'route-003',
    title: '心灵保养静修线',
    subtitle: 'maintenance',
    desc: '长期维护身心清净与松弛。',
    longDesc: '通过规律性的保养式旅程，维持长期平衡、清净与松弛状态，让内在系统不被反复消耗。',
    audience: '适合已经建立基础，但希望长期保养的人群。',
    highlights: '长期保养、清净感、平衡感、持续维护'
  },
  {
    id: 'route-004',
    title: '成长定制体验线',
    subtitle: 'bespoke',
    desc: '根据个人状态匹配路径。',
    longDesc: '根据用户的当前状态、成长目标、时间与预算，定制更适合的培训、疗愈或旅游路径。',
    audience: '适合需求更个性化、更需要顾问匹配的人群。',
    highlights: '个性定制、顾问匹配、成长目标、灵活路径'
  }
]

const articles = [
  {
    id: 'article-healing',
    category: 'healing',
    title: '疗愈：先让身心重新安静下来',
    desc: '从呼吸、环境与节奏开始，慢慢恢复内在稳定。',
    image: '/assets/images/route-healing.jpg',
    content: '疗愈不是立刻解决所有问题，而是先让人从高压、疲惫和混乱的信息里退出来。心之清文旅会把自然场域、行程节奏和顾问陪伴结合起来，让用户在旅途中逐步恢复呼吸感、松弛感和清晰感。'
  },
  {
    id: 'article-nature',
    category: 'nature',
    title: '自然：山川是最好的课堂',
    desc: '在草原、雪山和星空之间，重新打开感知。',
    image: '/assets/images/route-training.jpg',
    content: '自然不是旅程的背景，而是学习和成长本身。人在开阔的山川、草原、湖泊和星空之下，更容易从日常惯性中抽离出来，重新感受身体、关系和方向。'
  },
  {
    id: 'article-story',
    category: 'story',
    title: '故事：每条路线都有文明的来处',
    desc: '在地方人物、文化遗产与生活现场里理解世界。',
    image: '/assets/images/route-culture.jpg',
    content: '旅行真正动人的部分，常常藏在一个地方的故事里。建筑、饮食、信仰、手艺与人物记忆共同构成文明的纹理。心之清文旅希望让用户不只是抵达目的地，也能理解目的地。'
  }
]

const order = {
  id: 'XZQ-202606-001',
  routeTitle: '初级心灵培训旅游线路',
  status: '待顾问确认',
  contact: '微信用户',
  note: '当前为静态演示数据，后续接真实订单接口。'
}

module.exports = {
  routes,
  articles,
  order
}
