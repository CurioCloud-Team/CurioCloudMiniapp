import { userStore } from '../../../store/userStore'

Page({
  data: {
    username: '',
    password: '',
    loading: false
  },

  onInput(event: any) {
    const field = event.currentTarget.dataset.field
    const value = event.detail.value
    ;(this as any).setData({ [field]: value })
  },

  async handleLogin() {
    if (this.data.loading) return
    if (!this.data.username || !this.data.password) {
      wx.showToast({ title: '请输入完整信息', icon: 'none' })
      return
    }

    ;(this as any).setData({ loading: true })
    try {
      await userStore.login({ username: this.data.username, password: this.data.password })
      wx.showToast({ title: '登录成功', icon: 'success' })
      wx.reLaunch({ url: '/pages/dashboard/home/index' })
    } catch (error: any) {
      wx.showToast({ title: error?.message || '登录失败', icon: 'none' })
    } finally {
      ;(this as any).setData({ loading: false })
    }
  },

  gotoRegister() {
    wx.navigateTo({ url: '/pages/auth/register/index' })
  },

  gotoForgot() {
    wx.navigateTo({ url: '/pages/auth/forgot-password/index' })
  }
})
