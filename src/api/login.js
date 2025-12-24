/**
 * 登录相关的 API 接口
 * 连接后端真实接口
 */

import request from '@/utils/request'

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} 返回登录结果
 */
export const loginApi = (username, password) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取用户信息
 * @returns {Promise} 返回用户信息
 */
export const getUserInfoApi = () => {
  return request({
    url: '/auth/userinfo',
    method: 'get'
  })
}

/**
 * 退出登录
 * @returns {Promise} 返回退出结果
 */
export const logoutApi = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
