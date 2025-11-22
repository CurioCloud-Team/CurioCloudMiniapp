import { teachingStore } from '../../../store/teachingStore'

const subjects = ['全部学科', '语文', '数学', '英语', '物理', '化学']
const grades = ['全部年级', '小学', '初中', '高中']

Page({
  data: {
    subjects,
    grades,
    subjectIndex: 0,
    gradeIndex: 0,
    plans: [] as any[],
    filteredPlans: [] as any[]
  },

  async onShow() {
    await this.loadPlans()
  },

  async loadPlans() {
    const plans = await teachingStore.fetchLessonPlans(true)
    ;(this as any).setData({ plans })
    this.applyFilter()
  },

  applyFilter() {
    const subject = this.data.subjects[this.data.subjectIndex]
    const grade = this.data.grades[this.data.gradeIndex]
    const filtered = this.data.plans.filter((plan: any) => {
      const subjectMatch = subject === '全部学科' || plan.subject === subject
      const gradeMatch = grade === '全部年级' || plan.grade === grade
      return subjectMatch && gradeMatch
    })
    ;(this as any).setData({ filteredPlans: filtered })
  },

  onSubjectChange(event: any) {
    ;(this as any).setData({ subjectIndex: Number(event.detail.value) })
    this.applyFilter()
  },

  onGradeChange(event: any) {
    ;(this as any).setData({ gradeIndex: Number(event.detail.value) })
    this.applyFilter()
  },

  openConversation() {
    wx.navigateTo({ url: '/pages/teaching/conversation/index' })
  },

  createPlan() {
    wx.navigateTo({ url: '/pages/teaching/plan-editor/index' })
  },

  viewDetail(event: any) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/teaching/plan-detail/index?id=${id}` })
  },

  async generatePPT(event: any) {
    const planId = event.currentTarget.dataset.id
    try {
      wx.showLoading({ title: '创建PPT' })
      const response = await teachingStore.generatePPT(planId)
      if (response.ppt_project_id) {
        wx.navigateTo({
          url: `/pages/ppt/status/index?pId=${response.ppt_project_id}&planId=${planId}`
        })
      } else {
        wx.showToast({ title: response.message || '生成失败', icon: 'none' })
      }
    } catch (error: any) {
      wx.showToast({ title: error?.message || '生成失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  async deletePlan(event: any) {
    const planId = event.currentTarget.dataset.id
    wx.showModal({
      title: '删除教案',
      content: '确定要删除该教案吗？此操作不可恢复',
      success: async (res: any) => {
        if (res.confirm) {
          await teachingStore.removeLessonPlan(planId)
          wx.showToast({ title: '已删除', icon: 'success' })
          this.loadPlans()
        }
      }
    })
  }
})
