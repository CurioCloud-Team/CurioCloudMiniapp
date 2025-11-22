const TOKEN_KEY = 'curiocloud_token'
const USER_PROFILE_KEY = 'curiocloud_user_profile'

export const storage = {
  get<T = any>(key: string): T | null {
    try {
      return wx.getStorageSync(key) ?? null
    } catch (error) {
      console.warn('storage.get error', error)
      return null
    }
  },
  set<T = any>(key: string, value: T): void {
    try {
      wx.setStorageSync(key, value)
    } catch (error) {
      console.warn('storage.set error', error)
    }
  },
  remove(key: string): void {
    try {
      wx.removeStorageSync(key)
    } catch (error) {
      console.warn('storage.remove error', error)
    }
  },
  clear(): void {
    wx.clearStorage()
  }
}

export const tokenStorage = {
  get(): string | null {
    return storage.get<string>(TOKEN_KEY)
  },
  set(token: string): void {
    storage.set(TOKEN_KEY, token)
  },
  clear(): void {
    storage.remove(TOKEN_KEY)
  }
}

export const userProfileStorage = {
  get<T>(): T | null {
    return storage.get<T>(USER_PROFILE_KEY)
  },
  set<T>(profile: T): void {
    storage.set(USER_PROFILE_KEY, profile)
  },
  clear(): void {
    storage.remove(USER_PROFILE_KEY)
  }
}
