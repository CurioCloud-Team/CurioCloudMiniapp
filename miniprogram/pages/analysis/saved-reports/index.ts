import { getSavedReportsAPI } from '../../../services/analysis'
import type { SavedReportSummary } from '../../../types/analysis'

Page({
  data: {
    loading: true,
    reports: [] as SavedReportSummary[]
  },

  onShow() {
    this.fetchReports()
  },

  async onPullDownRefresh() {
    await this.fetchReports()
    wx.stopPullDownRefresh()
  },

  async fetchReports() {
    ;(this as any).setData({ loading: true })
    try {
      const reports = await getSavedReportsAPI()
      ;(this as any).setData({ reports })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '加载失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ loading: false })
    }
  },

  openReport(event: any) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({ url: `/pages/analysis/result/index?reportId=${id}` })
  },

  backToEntry() {
    wx.navigateBack({ delta: 1 })
  }
})
