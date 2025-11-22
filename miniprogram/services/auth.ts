import { request } from '../utils/request'
import type {
  UserLogin,
  AuthResponse,
  UserCreate,
  UserProfileResponse,
  UserProfileUpdate,
  MessageResponse
} from '../types/auth'

export type { UserLogin, AuthResponse, UserCreate, UserProfileResponse, UserProfileUpdate, MessageResponse }

export const loginAPI = async (credentials: UserLogin): Promise<AuthResponse> => {
  const { data } = await request<AuthResponse>({
    url: '/api/auth/login',
    method: 'POST',
    data: credentials,
    showLoading: true,
    loadingText: '正在登录'
  })
  return data
}

export const registerAPI = async (payload: UserCreate): Promise<AuthResponse> => {
  const { data } = await request<AuthResponse>({
    url: '/api/auth/register',
    method: 'POST',
    data: payload,
    showLoading: true,
    loadingText: '创建账户'
  })
  return data
}

export const getUserProfileAPI = async (): Promise<UserProfileResponse> => {
  const { data } = await request<UserProfileResponse>({
    url: '/api/user/profile',
    method: 'GET',
    showLoading: true,
    loadingText: '同步资料'
  })
  return data
}

export const updateUserProfileAPI = async (payload: UserProfileUpdate): Promise<UserProfileResponse> => {
  const { data } = await request<UserProfileResponse>({
    url: '/api/user/profile',
    method: 'PUT',
    data: payload,
    showLoading: true,
    loadingText: '更新资料'
  })
  return data
}

export const getUserStatusAPI = async (): Promise<MessageResponse> => {
  const { data } = await request<MessageResponse>({
    url: '/api/user/profile/status'
  })
  return data
}

export const requestPasswordResetAPI = async (email: string): Promise<MessageResponse> => {
  const { data } = await request<MessageResponse>({
    url: '/api/auth/forgot-password',
    method: 'POST',
    data: { email },
    showLoading: true,
    loadingText: '发送重置邮件'
  })
  return data
}

export const healthCheckAPI = async (): Promise<MessageResponse> => {
  const { data } = await request<MessageResponse>({
    url: '/api/auth/health'
  })
  return data
}
