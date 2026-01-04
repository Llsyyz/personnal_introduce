/**
 * Axios 请求配置
 * 统一的 HTTP 请求封装 - 双 Token 机制
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'
import { refreshTokenApi } from '@/api/login'

// 是否正在刷新 Token
let isRefreshing = false
// 失败队列
let failedQueue = []

// 处理队列
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 accessToken
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  async error => {
    const originalRequest = error.config

    // 如果没有配置，直接拒绝
    if (!error.response) {
      ElMessage.error('网络连接失败，请检查后端服务是否启动')
      return Promise.reject(error)
    }

    const { status } = error.response

    // 401: Token 过期或未登录
    if (status === 401) {
      // 如果已经有重试标记，说明刷新失败，直接跳转登录
      if (originalRequest._retry) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // 如果正在刷新，将请求加入队列
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return service(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      // 开始刷新 Token
      isRefreshing = true
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // 调用刷新接口
        const res = await refreshTokenApi(refreshToken)

        // 存储新的 Token
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)

        // 更新用户信息
        if (res.data.userInfo) {
          localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
        }

        // 处理队列中的请求
        processQueue(null, res.data.accessToken)

        // 重试当前请求
        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.accessToken
        return service(originalRequest)

      } catch (refreshError) {
        // 刷新失败，清除存储并跳转登录
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 处理其他错误状态码
    switch (status) {
      case 403:
        ElMessage.error('禁止访问')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器内部错误')
        break
      default:
        ElMessage.error(error.response.data?.message || '请求失败')
    }

    return Promise.reject(error)
  }
)

// 创建聊天 API 的 axios 实例（Python 后端，端口 8000）
const chatService = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 聊天请求拦截器
chatService.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken
    }
    return config
  },
  error => {
    console.error('聊天请求错误:', error)
    return Promise.reject(error)
  }
)

// 聊天响应拦截器
chatService.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')

      if (res.code === 401) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  error => {
    console.error('聊天响应错误:', error)

    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('userInfo')
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('禁止访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('AI服务连接失败，请检查Python后端是否启动')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default service
export { chatService }
