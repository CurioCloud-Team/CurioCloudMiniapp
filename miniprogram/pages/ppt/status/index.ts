import { getPPTStatusAPI } from '../../../services/teaching'

const statusMap: Record<string, { title: string; desc: string; type: string }> = {
  pending: { title: '等待开始', desc: 'PPT 任务已创建，即将开始生成', type: 'waiting' },
  processing: { title: '正在生成', desc: '正在为您生成 PPT，请稍候...', type: 'processing' },
  completed: { title: '生成完成', desc: 'PPT 已生成完毕，可以查看内容', type: 'completed' },
  error: { title: '生成失败', desc: '生成过程中出现问题，请重试', type: 'error' }
}

Page({
  data: {
    pptProjectId: '',
    planId: '',
    statusLabel: '等待开始',
    statusTitle: '等待开始',
    statusDesc: 'PPT 任务已创建，即将开始生成',
    statusType: 'waiting',
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

  goBack() {
    wx.navigateBack()
  },

  async refresh() {
    ;(this as any).setData({ loading: true })
    try {
      const status = await getPPTStatusAPI(this.data.pptProjectId)
      const currentStatus = status.status?.state || 'processing'
      const canPreview = currentStatus === 'completed'
      const statusInfo = statusMap[currentStatus] || statusMap.pending
      
      ;(this as any).setData({
        statusLabel: currentStatus,
        statusTitle: statusInfo.title,
        statusDesc: statusInfo.desc,
        statusType: statusInfo.type,
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
