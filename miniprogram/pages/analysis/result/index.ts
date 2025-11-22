import { getAnalysisReportAPI } from '../../../services/analysis'
import type { AnalysisReport } from '../../../types/analysis'

Page({
  data: {
    report: null as AnalysisReport | null,
    loading: true
  },

  onLoad(query: Record<string, string>) {
    const channel = (this as any).getOpenerEventChannel ? (this as any).getOpenerEventChannel() : null
    if (channel) {
      channel.on('report:payload', (report: AnalysisReport) => {
        ;(this as any).setData({ report, loading: false })
      })
    }

    if (!channel) {
      if (query?.reportId) {
        this.fetchReport(query.reportId)
      } else {
        ;(this as any).setData({ loading: false })
      }
    }
  },

  async fetchReport(reportId: string) {
    ;(this as any).setData({ loading: true })
    try {
      const report = await getAnalysisReportAPI(reportId)
      ;(this as any).setData({ report })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '加载失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ loading: false })
    }
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})
