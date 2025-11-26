import { userStore } from '../../../store/userStore'
import { teachingStore } from '../../../store/teachingStore'

Page({
  data: {
    userProfile: {
      username: '',
      full_name: ''
    },
    metrics: {
      lessonCount: 0,
      pptCount: 0,
      exerciseCount: 0
    },
    lessonPlans: [] as any[]
  },

  async onShow() {
    const token = getApp<IAppOption>().globalData.token
    if (!token) {
      wx.reLaunch({ url: '/pages/auth/login/index' })
      return
    }

    const profile = await userStore.fetchProfile()
    ;(this as any).setData({ userProfile: profile })

    const lessonPlans = await teachingStore.fetchLessonPlans()
    ;(this as any).setData({
      lessonPlans: lessonPlans.slice(0, 3),
      metrics: {
        lessonCount: lessonPlans.length,
        pptCount: Math.max(lessonPlans.length - 2, 0),
        exerciseCount: lessonPlans.length * 2
      }
    })
  },

  navigateTo(event: any) {
    const url = event.currentTarget.dataset.url
    wx.navigateTo({ url })
  },

  createPlan() {
    wx.navigateTo({ url: '/pages/teaching/plan-editor/index' })
  },

  openLesson(event: any) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/teaching/plan-detail/index?id=${id}` })
  }
})
