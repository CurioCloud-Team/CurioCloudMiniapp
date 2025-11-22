import { teachingStore } from '../../../store/teachingStore'

Page({
  data: {
    lessonPlan: {},
    outlineParagraphs: [] as string[]
  },

  async onLoad(options: Record<string, string>) {
    if (!options.id) {
      wx.showToast({ title: '缺少参数', icon: 'none' })
      return
    }
    const lessonPlan = await teachingStore.fetchLessonPlan(Number(options.id))
    ;(this as any).setData({
      lessonPlan,
      outlineParagraphs: lessonPlan.teaching_outline?.split('\n').filter(Boolean) || []
    })
  }
})
