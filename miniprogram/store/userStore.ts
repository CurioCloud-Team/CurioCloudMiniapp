import { loginAPI, registerAPI, getUserProfileAPI, type UserLogin, type UserCreate, type UserProfileResponse } from '../services/auth'
import { userProfileStorage } from '../utils/storage'

export type UserListener = (profile: UserProfileResponse | null) => void

class UserStore {
  private listeners: Set<UserListener> = new Set()

  get profile(): UserProfileResponse | null {
    return getApp<IAppOption>().globalData.userProfile || null
  }

  subscribe(listener: UserListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    const profile = this.profile
    this.listeners.forEach((listener) => listener(profile))
  }

  private updateProfile(profile: UserProfileResponse | null) {
    getApp<IAppOption>().globalData.userProfile = profile
    if (profile) {
      userProfileStorage.set(profile)
    } else {
      userProfileStorage.clear()
    }
    this.notify()
  }

  async login(credentials: UserLogin) {
    const { token, user } = await loginAPI(credentials)
    getApp<IAppOption>().setToken(token.access_token)
    this.updateProfile(user)
  }

  async register(payload: UserCreate) {
    const { token, user } = await registerAPI(payload)
    getApp<IAppOption>().setToken(token.access_token)
    this.updateProfile(user)
  }

  async fetchProfile(force = false) {
    if (this.profile && !force) {
      return this.profile
    }
    const profile = await getUserProfileAPI()
    this.updateProfile(profile)
    return profile
  }

  logout() {
    getApp<IAppOption>().setToken(null)
    this.updateProfile(null)
    getApp<IAppOption>().clearSession()
    wx.reLaunch({ url: '/pages/auth/login/index' })
  }
}

export const userStore = new UserStore()
