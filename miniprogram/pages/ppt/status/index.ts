import { getPPTStatusAPI } from '../../../services/teaching'

Page({
  data: {
    pptProjectId: '',
    planId: '',
    statusLabel: '等待开始',
    canPreview: false,
    loading: false
  },

  onLoad(options: Record<string, string>) {
    if (!options.pId) {
      wx.showToast({ title: '缺少项目ID', icon: 'none' })
      return
    }
    ;(this as any).setData({ pptProjectId: options.pId, planId: options.planId || '' })
    this.refresh()
  },

  async refresh() {
    ;(this as any).setData({ loading: true })
    try {
      const status = await getPPTStatusAPI(this.data.pptProjectId)
      const currentStatus = status.status?.state || 'processing'
      const canPreview = currentStatus === 'completed'
      ;(this as any).setData({
        statusLabel: currentStatus,
        canPreview
      })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '刷新失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ loading: false })
    }
  },

  openViewer() {
    wx.navigateTo({ url: `/pages/ppt/viewer/index?pId=${this.data.pptProjectId}` })
  }
})
