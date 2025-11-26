import { createLessonPlanAPI, updateLessonPlanAPI, startConversationAPI, processAnswerAPI } from '../../../services/teaching'
import { teachingStore } from '../../../store/teachingStore'
import type { QuestionCard } from '../../../types/teaching'

Page({
  data: {
    // 模式：'conversation' 对话式新建 | 'edit' 编辑已有教案
    mode: 'conversation' as 'conversation' | 'edit',
    planId: null as number | null,
    loading: false,
    
    // 对话式新建相关
    sessionId: '',
    messages: [] as { type: 'ai' | 'user'; content: string }[],
    questionCard: null as QuestionCard | null,
    currentAnswer: '',
    customInput: '',
    submitting: false,
    scrollToView: '',
    isCompleted: false,
    
    // 编辑模式表单
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
      // 编辑模式
      const plan = await teachingStore.fetchLessonPlan(Number(options.id))
      ;(this as any).setData({
        mode: 'edit',
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
    } else {
      // 对话式新建模式
      ;(this as any).setData({ mode: 'conversation' })
      await this.startConversation()
    }
  },

  // ========== 对话式新建相关方法 ==========
  
  async startConversation() {
    try {
      ;(this as any).setData({ loading: true })
      const response = await startConversationAPI({ use_dynamic_mode: true })
      ;(this as any).setData({
        sessionId: response.session_id,
        questionCard: response.question_card,
        messages: [
          { type: 'ai', content: '👋 你好！我是你的 AI 备课助手，让我们一起完成备课吧！' },
          { type: 'ai', content: response.question_card.question }
        ],
        loading: false
      })
      this.scrollToBottom()
    } catch (error: any) {
      wx.showToast({ title: error?.message || '创建会话失败', icon: 'none' })
      ;(this as any).setData({ loading: false })
    }
  },

  chooseOption(event: any) {
    const value = event.currentTarget.dataset.value
    ;(this as any).setData({ currentAnswer: value })
  },

  onCustomInput(event: any) {
    const value = event.detail.value
    ;(this as any).setData({ customInput: value })
  },

  scrollToBottom() {
    const len = this.data.messages.length
    if (len > 0) {
      setTimeout(() => {
        ;(this as any).setData({ scrollToView: `msg-${len - 1}` })
      }, 100)
    }
  },

  async submitAnswer() {
    // 优先使用自定义输入，否则使用选中的选项
    const answer = this.data.customInput.trim() || this.data.currentAnswer
    if (!answer) {
      wx.showToast({ title: '请选择或填写答案', icon: 'none' })
      return
    }
    
    ;(this as any).setData({ submitting: true })
    const newMessages = [...this.data.messages, { type: 'user', content: answer }]
    ;(this as any).setData({ messages: newMessages })
    this.scrollToBottom()
    
    try {
      const response = await processAnswerAPI({
        session_id: this.data.sessionId,
        answer: answer
      })
      
      const updatedMessages = [...newMessages]
      if (response.question_card) {
        updatedMessages.push({ type: 'ai', content: response.question_card.question })
        ;(this as any).setData({
          messages: updatedMessages,
          questionCard: response.question_card,
          currentAnswer: '',
          customInput: ''
        })
      } else {
        updatedMessages.push({ type: 'ai', content: '🎉 太棒了！备课完成，教案已生成。' })
        ;(this as any).setData({
          messages: updatedMessages,
          questionCard: null,
          currentAnswer: '',
          customInput: '',
          isCompleted: true
        })
      }
      this.scrollToBottom()
      
      if (response.lesson_plan) {
        await teachingStore.fetchLessonPlans(true)
        wx.showToast({ title: '生成成功', icon: 'success' })
        setTimeout(() => {
          wx.redirectTo({ url: `/pages/teaching/plan-detail/index?id=${response.lesson_plan?.id}` })
        }, 1000)
      }
    } catch (error: any) {
      wx.showToast({ title: error?.message || '提交失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ submitting: false })
    }
  },

  // ========== 编辑模式相关方法 ==========

  goBack() {
    wx.navigateBack()
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
      wx.redirectTo({ url: `/pages/teaching/plan-detail/index?id=${plan.id}` })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '保存失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ loading: false })
    }
  }
})
