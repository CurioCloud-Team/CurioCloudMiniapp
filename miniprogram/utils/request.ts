import { getEnvConfig } from './env'
import { tokenStorage } from './storage'
import type { ApiError } from '../types/api'

export interface RequestOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: Record<string, any> | string | ArrayBuffer
  header?: Record<string, string>
  showLoading?: boolean
  loadingText?: string
  retry?: number
  suppressToast?: boolean
  transformResponse?: (data: any) => T
}

interface RequestResult<T> {
  data: T
  statusCode: number
  header: Record<string, any>
}

interface WxRequestSuccess<T = any> {
  data: T
  statusCode: number
  header: Record<string, any>
  cookies?: string[]
}

interface WxRequestError {
  errMsg: string
}

const buildUrl = (input: string): string => {
  if (input.startsWith('http')) {
    return input
  }
  const { API_BASE_URL } = getEnvConfig()
  return `${API_BASE_URL}${input}`
}

const defaultHeader = (): Record<string, string> => {
  const token = tokenStorage.get()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

const handleError = (statusCode: number, data: any): ApiError => {
  if (statusCode === 401) {
    tokenStorage.clear()
    wx.showToast({ title: '登录失效，请重新登录', icon: 'none' })
    setTimeout(() => {
      wx.reLaunch({ url: '/pages/auth/login/index' })
    }, 800)
  }
  const error: ApiError = {
    message: data?.message || '请求失败',
    code: statusCode,
    details: data
  }
  return error
}

export const request = <T = any>(options: RequestOptions<T>): Promise<RequestResult<T>> => {
  const {
    url,
    method = 'GET',
    data,
    header,
    showLoading,
    loadingText = '加载中...',
    retry = 0,
    suppressToast,
    transformResponse
  } = options

  if (showLoading) {
    wx.showLoading({ title: loadingText, mask: true })
  }

  const finalHeader = { ...defaultHeader(), ...header }

  return new Promise((resolve, reject) => {
    wx.request({
      url: buildUrl(url),
      method,
      data,
      header: finalHeader,
      success: (res: WxRequestSuccess) => {
        const { statusCode } = res
        if (statusCode >= 200 && statusCode < 300) {
          const payload = transformResponse ? transformResponse(res.data) : res.data
          resolve({ data: payload as T, statusCode, header: res.header })
          return
        }
        const error = handleError(statusCode, res.data)
        if (!suppressToast) {
          wx.showToast({ title: error.message, icon: 'none' })
        }
        reject(error)
      },
  fail: (err: WxRequestError) => {
        if (retry > 0) {
          request({ ...options, retry: retry - 1 })
            .then(resolve)
            .catch(reject)
          return
        }
        if (!suppressToast) {
          wx.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
        }
        reject(err)
      },
      complete: () => {
        if (showLoading) {
          wx.hideLoading()
        }
      }
    })
  })
}
