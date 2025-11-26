type TabItem = {
  value: string
  label: string
  path: string
  icon: {
    name: string
  }
}

const TAB_ITEMS: TabItem[] = [
  {
    value: 'dashboard',
    label: '首页',
    path: '/pages/dashboard/home/index',
    icon: { name: 'analytics' }
  },
  {
    value: 'teaching',
    label: '教学',
    path: '/pages/teaching/design/index',
    icon: { name: 'book' }
  },
  {
    value: 'exercise',
    label: '习题',
    path: '/pages/exercise/assistant/index',
    icon: { name: 'assignment' }
  },
  {
    value: 'analysis',
    label: '学情',
    path: '/pages/analysis/entry/index',
    icon: { name: 'chart-bar' }
  },
  {
    value: 'ppt',
    label: 'PPT',
    path: '/pages/ppt/status/index',
    icon: { name: 'app' }
  }
]

const normalizeRoute = (route: string) => route.replace(/^\//, '')

Component({
  options: {
    addGlobalClass: true,
    styleIsolation: 'shared'
  },
  properties: {
    active: {
      type: String,
      value: TAB_ITEMS[0].value
    }
  },
  data: {
    tabs: TAB_ITEMS
  },
  methods: {
    onChange(event: WechatMiniprogram.CustomEvent<{ value: string }>) {
      const { value } = event.detail
      const target = TAB_ITEMS.find((item) => item.value === value)

      if (!target) {
        return
      }

      const pages = getCurrentPages()
      const currentRoute = pages[pages.length - 1]?.route
      const targetRoute = normalizeRoute(target.path)

      if (currentRoute === targetRoute) {
        return
      }

      wx.reLaunch({ url: target.path })
    }
  }
})
