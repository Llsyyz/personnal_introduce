/**
 * 路由配置文件
 * 用于管理页面之间的跳转
 */

import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
// 使用懒加载方式，只有访问时才加载对应组件，提高性能
const Login = () => import('@/views/Login.vue')
const Home = () => import('@/views/Home.vue')

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
  }
]

// 创建路由实例
const router = createRouter({
  // 使用 history 模式，URL 不带 # 号
  history: createWebHistory(),
  routes
})

// 全局前置守卫
// 在每次路由跳转前执行
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'Vue 3 登录示例'

  // 检查该路由是否需要登录
  if (to.meta.requiresAuth) {
    // 获取本地存储的 token
    const token = localStorage.getItem('token')

    if (token) {
      // 有 token，允许访问
      next()
    } else {
      // 没有 token，跳转到登录页
      next('/login')
    }
  } else {
    // 不需要登录，直接访问
    next()
  }
})

export default router
