/**
 * 登录相关的 API 接口
 * 这里使用模拟数据，实际项目中会替换成真实的接口调用
 */

/**
 * 模拟登录接口
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} 返回登录结果
 */
export const loginApi = (username, password) => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟 1 秒
    setTimeout(() => {
      // 模拟验证逻辑
      if (username === 'admin' && password === '123456') {
        // 登录成功
        resolve({
          code: 200,
          message: '登录成功',
          data: {
            token: 'mock-token-' + Date.now(), // 生成一个唯一 token
            userInfo: {
              username: username,
              nickname: '管理员',
              avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            }
          }
        })
      } else {
        // 登录失败
        reject({
          code: 401,
          message: '用户名或密码错误'
        })
      }
    }, 1000)
  })
}

/**
 * 获取用户信息接口（模拟）
 * @returns {Promise} 返回用户信息
 */
export const getUserInfoApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          username: 'admin',
          nickname: '管理员',
          avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        }
      })
    }, 500)
  })
}

/**
 * 退出登录接口（模拟）
 * @returns {Promise} 返回退出结果
 */
export const logoutApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '退出成功'
      })
    }, 300)
  })
}
