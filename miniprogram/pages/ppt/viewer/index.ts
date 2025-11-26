import { getPPTSlidesAPI } from '../../../services/teaching'

Page({
  data: {
    pptProjectId: '',
    slides: [] as any[],
    loading: true
  },

  async onLoad(options: Record<string, string>) {
    if (!options.pId) {
      wx.showToast({ title: '缺少项目ID', icon: 'none' })
      return
    }
    ;(this as any).setData({ pptProjectId: options.pId })
    await this.fetchSlides()
  },

  goBack() {
    wx.navigateBack()
  },

  async fetchSlides() {
    ;(this as any).setData({ loading: true })
    try {
      const data = await getPPTSlidesAPI(this.data.pptProjectId)
      ;(this as any).setData({ slides: data.slides_data || [], loading: false })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '加载失败', icon: 'none' })
      ;(this as any).setData({ loading: false })
    }
  }
})
