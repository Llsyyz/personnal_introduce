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
const Gallery = () => import('@/views/Gallery.vue')
const Chat = () => import('@/views/Chat.vue')
const News = () => import('@/views/News.vue')
const NewsDetail = () => import('@/views/NewsDetail.vue')

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
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery,
    meta: {
      title: '相册',
      requiresAuth: true  // 需要登录才能访问
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: {
      title: 'AI 助手',
      requiresAuth: true  // 需要登录才能访问
    }
  },
  {
    path: '/news',
    name: 'News',
    component: News,
    meta: {
      title: '热点资讯',
      requiresAuth: true
    }
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: NewsDetail,
    meta: {
      title: '资讯详情',
      requiresAuth: true
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
 * 检查登录状态是否有效（双 Token 机制）
 * @returns {boolean} 登录状态是否有效
 */
const isAuthenticated = () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    // 没有 token
    if (!accessToken || !refreshToken) {
      return false
    }

    // 双 Token 机制由服务端处理过期，前端只检查存在性
    // Token 过期时，axios 拦截器会自动刷新或跳转登录
    return true
  } catch (error) {
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
