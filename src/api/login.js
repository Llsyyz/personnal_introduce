/**
 * 登录相关的 API 接口
 * 连接后端真实接口 - 双 Token 机制
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'

const API_BASE = 'http://127.0.0.1:8080/api/v1'

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} 返回登录结果
 */
export const loginApi = (username, password) => {
  return axios.post(`${API_BASE}/auth/login`, { username, password }).then(res => res.data)
}

/**
 * 刷新 Token
 * @param {string} refreshToken - 刷新令牌
 * @returns {Promise} 返回新的 token 对
 */
export const refreshTokenApi = (refreshToken) => {
  return axios.post(`${API_BASE}/auth/refresh`, { refreshToken }).then(res => res.data)
}

/**
 * 获取用户信息
 * @returns {Promise} 返回用户信息
 */
export const getUserInfoApi = () => {
  return axios.get(`${API_BASE}/auth/userinfo`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  }).then(res => res.data)
}

/**
 * 退出登录
 * @returns {Promise} 返回退出结果
 */
export const logoutApi = () => {
  return axios.post(`${API_BASE}/auth/logout`, {}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  }).then(res => res.data)
}

/**
 * 用户注册
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} 返回注册结果
 */
export const registerApi = (username, password) => {
  return axios.post(`${API_BASE}/auth/register`, { username, password }).then(res => res.data)
}
