import { getPPTSlidesAPI } from '../../../services/teaching'

Page({
  data: {
    pptProjectId: '',
    slides: [] as any[]
  },

  async onLoad(options: Record<string, string>) {
    if (!options.pId) {
      wx.showToast({ title: '缺少项目ID', icon: 'none' })
      return
    }
    ;(this as any).setData({ pptProjectId: options.pId })
    await this.fetchSlides()
  },

  async fetchSlides() {
    try {
      const data = await getPPTSlidesAPI(this.data.pptProjectId)
      ;(this as any).setData({ slides: data.slides_data || [] })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '加载失败', icon: 'none' })
    }
  }
})
