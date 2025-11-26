import { teachingStore } from '../../../store/teachingStore'
import type { QuestionCard } from '../../../types/teaching'

Page({
  data: {
    messages: [] as { type: 'ai' | 'user'; content: string }[],
    questionCard: null as QuestionCard | null,
    sessionId: '',
    currentAnswer: '',
    submitting: false,
    scrollToView: ''
  },

  async onLoad() {
    await this.startConversation()
  },

  async startConversation() {
    const response = await teachingStore.startConversation()
    ;(this as any).setData({
      sessionId: response.session_id,
      questionCard: response.question_card,
      messages: [
        { type: 'ai', content: '👋 你好！我是你的 AI 备课助手，让我们一起完成备课吧！' },
        { type: 'ai', content: response.question_card.question }
      ]
    })
    this.scrollToBottom()
  },

  chooseOption(event: any) {
    const value = event.currentTarget.dataset.value
    ;(this as any).setData({ currentAnswer: value })
  },

  onAnswerInput(event: any) {
    const value = event.detail.value
    ;(this as any).setData({ currentAnswer: value })
  },

  scrollToBottom() {
    const len = this.data.messages.length
    if (len > 0) {
      ;(this as any).setData({ scrollToView: `msg-${len - 1}` })
    }
  },

  async submitAnswer() {
    if (!this.data.currentAnswer) {
      wx.showToast({ title: '请选择或填写答案', icon: 'none' })
      return
    }
    ;(this as any).setData({ submitting: true })
    const newMessages = [...this.data.messages, { type: 'user', content: this.data.currentAnswer }]
    ;(this as any).setData({ messages: newMessages })
    this.scrollToBottom()
    
    try {
      const response = await teachingStore.nextQuestion({
        session_id: this.data.sessionId,
        answer: this.data.currentAnswer
      })
      const updatedMessages = [...newMessages]
      if (response.question_card) {
        updatedMessages.push({ type: 'ai', content: response.question_card.question })
      } else {
        updatedMessages.push({ type: 'ai', content: '🎉 太棒了！备课完成，教案已生成。' })
      }
      ;(this as any).setData({
        messages: updatedMessages,
        questionCard: response.question_card ?? null,
        currentAnswer: ''
      })
      this.scrollToBottom()
      
      if (response.lesson_plan) {
        wx.showToast({ title: '生成成功', icon: 'success' })
        setTimeout(() => {
          wx.navigateTo({ url: `/pages/teaching/plan-detail/index?id=${response.lesson_plan?.id}` })
        }, 800)
      }
    } catch (error: any) {
      wx.showToast({ title: error?.message || '提交失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ submitting: false })
    }
  },

  goLessonList() {
    wx.navigateBack({ delta: 1 })
  }
})
