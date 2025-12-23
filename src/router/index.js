/**
 * 路由配置文件
 * 用于管理页面之间的跳转
 */

import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
// 使用懒加载方式，只有访问时才加载对应组件，提高性能
const Login = () => import('@/views/Login.vue')
const Home = () => import('@/views/Home.vue')
const Notes = () => import('@/views/Notes.vue')

// 定义路由配置
const routes = [
  {
    path: '/',           // URL 路径
    redirect: '/login'   // 重定向到登录页
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      requiresAuth: true  // 需要登录才能访问
    }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: Notes,
    meta: {
      title: '我的笔记',
      requiresAuth: true  // 需要登录才能访问
    }
  }
]

// 创建路由实例
const router = createRouter({
  // 使用 history 模式，URL 不带 # 号
  history: createWebHistory(),
  routes
})

/**
 * 检查登录状态是否有效
 * @returns {boolean} 登录状态是否有效
 */
const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token')

    // 没有 token
    if (!token) {
      return false
    }

    // 检查登录时间（可选：添加过期机制）
    const loginTime = localStorage.getItem('loginTime')
    if (loginTime) {
      const now = Date.now()
      const diff = now - parseInt(loginTime)
      // 7 天过期（单位：毫秒）
      const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000

      if (diff > EXPIRY_TIME) {
        // 登录过期，清除数据
        localStorage.removeItem('token')
        localStorage.removeItem('loginTime')
        localStorage.removeItem('userInfo')
        return false
      }
    }

    return true
  } catch (error) {
    // localStorage 访问出错
    console.error('检查登录状态出错:', error)
    return false
  }
}

// 全局前置守卫
// 在每次路由跳转前执行
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'Vue 3 登录示例'

  // 检查该路由是否需要登录
  if (to.meta.requiresAuth) {
    if (isAuthenticated()) {
      // 已登录，允许访问
      next()
    } else {
      // 未登录，跳转到登录页
      // 保存目标路径，登录后可以跳回
      if (to.path !== '/login') {
        next({
          path: '/login',
          query: { redirect: to.fullPath } // 携带重定向信息
        })
      } else {
        next('/login')
      }
    }
  } else {
    // 不需要登录，直接访问
    // 如果已登录访问登录页，跳转到首页
    if (to.path === '/login' && isAuthenticated()) {
      next('/home')
    } else {
      next()
    }
  }
})

export default router
