import { requestPasswordResetAPI } from '../../../services/auth'

Page({
  data: {
    email: '',
    loading: false
  },

  onInput(event: any) {
    ;(this as any).setData({ email: event.detail.value })
  },

  async handleSubmit() {
    if (!this.data.email) {
      wx.showToast({ title: '请输入邮箱', icon: 'none' })
      return
    }
    ;(this as any).setData({ loading: true })
    try {
      await requestPasswordResetAPI(this.data.email)
      wx.showToast({ title: '邮件已发送', icon: 'success' })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '发送失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ loading: false })
    }
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})
