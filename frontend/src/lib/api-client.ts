import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/authStore'

interface PendingRequest {
  config: InternalAxiosRequestConfig
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: PendingRequest[] = []

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 with token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Skip refresh logic for auth endpoints — those 401s are legitimate failures
    const skipRefreshUrls = ['/auth/login', '/auth/register', '/auth/refresh']
    const requestUrl = originalRequest.url ?? ''
    const isAuthEndpoint = skipRefreshUrls.some((url) => requestUrl.endsWith(url))

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            config: originalRequest,
            resolve,
            reject,
          })
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true
      originalRequest._retry = true

      try {
        await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true })

        failedQueue.forEach(({ config, resolve }) => resolve(''))
        failedQueue = []
        isRefreshing = false

        return apiClient(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().clearAuth()
        failedQueue = []
        isRefreshing = false
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
