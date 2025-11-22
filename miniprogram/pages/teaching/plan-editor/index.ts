import { createLessonPlanAPI, updateLessonPlanAPI } from '../../../services/teaching'
import { teachingStore } from '../../../store/teachingStore'

Page({
  data: {
    planId: null as number | null,
    loading: false,
    form: {
      title: '',
      subject: '',
      grade: '',
      teaching_objective: '',
      teaching_outline: '',
      activities: [] as any[]
    }
  },

  async onLoad(options: Record<string, string>) {
    if (options.id) {
      const plan = await teachingStore.fetchLessonPlan(Number(options.id))
      ;(this as any).setData({
        planId: Number(options.id),
        form: {
          title: plan.title,
          subject: plan.subject,
          grade: plan.grade,
          teaching_objective: plan.teaching_objective,
          teaching_outline: plan.teaching_outline,
          activities: plan.activities
        }
      })
    }
  },

  onInput(event: any) {
    const field = event.currentTarget.dataset.field
    ;(this as any).setData({ [`form.${field}`]: event.detail.value })
  },

  onActivityInput(event: any) {
    const field = event.currentTarget.dataset.field
    const index = Number(event.currentTarget.dataset.index)
    const value = field === 'duration' ? Number(event.detail.value) : event.detail.value
    ;(this as any).setData({ [`form.activities[${index}].${field}`]: value })
  },

  addActivity() {
    const list = [...this.data.form.activities, { activity_name: '', description: '', duration: 10, order_index: this.data.form.activities.length + 1 }]
    ;(this as any).setData({ 'form.activities': list })
  },

  removeActivity(event: any) {
    const index = Number(event.currentTarget.dataset.index)
    const list = this.data.form.activities.filter((_: any, i: number) => i !== index)
    ;(this as any).setData({ 'form.activities': list })
  },

  async handleSubmit() {
    const requiredFields = ['title', 'subject', 'grade']
    for (const field of requiredFields) {
      if (!(this.data.form as any)[field]) {
        wx.showToast({ title: '请填写完整信息', icon: 'none' })
        return
      }
    }
    ;(this as any).setData({ loading: true })
    try {
      let plan
      if (this.data.planId) {
        plan = await updateLessonPlanAPI(this.data.planId, this.data.form as any)
      } else {
        plan = await createLessonPlanAPI(this.data.form as any)
      }
      wx.showToast({ title: '保存成功', icon: 'success' })
      await teachingStore.fetchLessonPlans(true)
      wx.navigateTo({ url: `/pages/teaching/plan-detail/index?id=${plan.id}` })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '保存失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ loading: false })
    }
  }
})
