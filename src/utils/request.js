/**
 * Axios 请求配置
 * 统一的 HTTP 请求封装
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/v1',  // 后端基础地址
  timeout: 10000,  // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      // 设置 Authorization 请求头
      config.headers['Authorization'] = 'Bearer ' + token
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

    // 如果响应码不是 200，视为错误
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')

      // 401: Token 过期或未登录
      if (res.code === 401) {
        // 清除本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('loginTime')

        // 跳转到登录页
        window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  error => {
    console.error('响应错误:', error)

    // 处理网络错误
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          localStorage.removeItem('loginTime')
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
      ElMessage.error('网络连接失败，请检查后端服务是否启动')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

// 创建聊天 API 的 axios 实例（Python 后端，端口 8000）
const chatService = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 30000,  // 聊天请求可能需要更长时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 聊天请求拦截器
chatService.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
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
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('loginTime')
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
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          localStorage.removeItem('loginTime')
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
