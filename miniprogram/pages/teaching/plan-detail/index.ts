import { teachingStore } from '../../../store/teachingStore'

Page({
  data: {
    planId: 0,
    plan: {
      title: '',
      subject: '',
      grade: '',
      teaching_objective: '',
      teaching_outline: '',
      activities: [] as any[]
    },
    outlineParagraphs: [] as string[],
    totalDuration: 0
  },

  async onLoad(options: Record<string, string>) {
    if (!options.id) {
      wx.showToast({ title: '缺少教案ID', icon: 'none' })
      return
    }
    const planId = Number(options.id)
    const plan = await teachingStore.fetchLessonPlan(planId)
    const totalDuration = plan.activities?.reduce((sum: number, act: any) => sum + (act.duration || 0), 0) || 0
    ;(this as any).setData({
      planId,
      plan,
      outlineParagraphs: plan.teaching_outline?.split('\n').filter(Boolean) || [],
      totalDuration
    })
  },

  goBack() {
    wx.navigateBack()
  },

  async generatePPT() {
    try {
      const response = await teachingStore.generatePPT(this.data.planId)
      if (response.ppt_project_id) {
        wx.navigateTo({ url: `/pages/ppt/status/index?pId=${response.ppt_project_id}&planId=${this.data.planId}` })
      }
    } catch (error: any) {
      wx.showToast({ title: error?.message || '生成失败', icon: 'none' })
    }
  },

  openExercises() {
    wx.navigateTo({ url: `/pages/exercise/assistant/index?planId=${this.data.planId}` })
  },

  editPlan() {
    wx.navigateTo({ url: `/pages/teaching/plan-editor/index?id=${this.data.planId}` })
  }
})
