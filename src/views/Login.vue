<!--
  Login.vue - 登录页面组件
  包含登录表单、表单验证、登录逻辑
-->

<template>
  <div class="login-page">
    <!-- 动态背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- 登录容器 -->
    <div class="login-container">
      <!-- 登录卡片 -->
      <Transition name="card-fade" appear>
        <div class="login-card" :key="isLogin ? 'login' : 'register'">
          <!-- Logo -->
          <div class="login-logo">
            <div class="logo-inner">
              <el-icon :size="32"><Star /></el-icon>
            </div>
          </div>

          <!-- 标题 -->
          <Transition name="title-slide" mode="out-in">
            <h1 class="login-title" :key="isLogin ? 'login' : 'register'">
              {{ isLogin ? '欢迎回来' : '创建账户' }}
            </h1>
          </Transition>
          <Transition name="subtitle-fade" mode="out-in">
            <p class="login-subtitle" :key="isLogin ? 'login' : 'register'">
              {{ isLogin ? '登录 NoteSpace 开启创作之旅' : '注册 NoteSpace 开启创作之旅' }}
            </p>
          </Transition>

          <!-- 登录表单 -->
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
            class="login-form"
          >
            <!-- 用户名输入框 -->
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
                size="large"
                class="modern-input"
              />
            </el-form-item>

            <!-- 密码输入框 -->
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                size="large"
                show-password
                class="modern-input"
                @keyup.enter="isLogin ? handleLogin() : handleRegister()"
              />
            </el-form-item>

            <!-- 确认密码输入框（仅注册模式） -->
            <Transition name="form-slide">
              <el-form-item v-if="!isLogin" prop="confirmPassword">
                <el-input
                  v-model="loginForm.confirmPassword"
                  type="password"
                  placeholder="请确认密码"
                  :prefix-icon="Lock"
                  size="large"
                  show-password
                  class="modern-input"
                  @keyup.enter="handleRegister"
                />
              </el-form-item>
            </Transition>

            <!-- 记住我 & 忘记密码 / 切换注册 -->
            <div class="remember-me">
              <el-checkbox v-if="isLogin" v-model="loginForm.remember" class="modern-checkbox">记住我</el-checkbox>
              <span v-else></span>
              <a href="#" class="forget-link" @click.prevent="toggleMode">
                {{ isLogin ? '还没有账号？立即注册' : '已有账号？立即登录' }}
              </a>
            </div>

            <!-- 登录/注册按钮 -->
            <el-button
              type="primary"
              class="login-button"
              :loading="loading"
              @click="isLogin ? handleLogin() : handleRegister()"
            >
              <template v-if="!loading">
                <span class="btn-text">{{ isLogin ? '登录' : '注册' }}</span>
              </template>
              <template v-else>
                {{ isLogin ? '登录中...' : '注册中...' }}
              </template>
            </el-button>
          </el-form>

          <!-- 测试提示 -->
          <div class="test-tip">
            <p>测试账号：admin / 123456</p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Star } from '@element-plus/icons-vue'
import { loginApi, registerApi } from '@/api/login'

// ========== 路由实例 ==========
// useRouter 用于获取路由实例，进行页面跳转
const router = useRouter()
// useRoute 用于获取当前路由信息，获取查询参数
const route = useRoute()

// ========== 响应式数据 ==========

// 表单引用对象，用于调用表单的验证方法
const loginFormRef = ref(null)

// 登录按钮的加载状态
const loading = ref(false)

// 是否为登录模式（true: 登录, false: 注册）
const isLogin = ref(true)

// 登录表单的数据对象
const loginForm = reactive({
  username: '',           // 用户名
  password: '',           // 密码
  confirmPassword: '',    // 确认密码（注册用）
  remember: false         // 是否记住我
})

// ========== 表单验证规则 ==========
const rules = {
  // 用户名验证规则
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  // 密码验证规则
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  // 确认密码验证规则（仅注册时）
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== loginForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// ========== 登录处理函数 ==========
const handleLogin = async () => {
  // 1. 验证表单
  const valid = await loginFormRef.value.validate().catch(() => false)

  if (!valid) {
    return
  }

  // 2. 开始加载状态
  loading.value = true

  try {
    // 3. 调用登录接口
    const response = await loginApi(loginForm.username, loginForm.password)

    // 4. 登录成功处理
    ElMessage.success(response.message)

    // 存储 accessToken 和 refreshToken 到 localStorage
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)

    // 存储用户信息
    localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))

    // 如果勾选了"记住我"，保存账号
    if (loginForm.remember) {
      localStorage.setItem('rememberUsername', loginForm.username)
    } else {
      localStorage.removeItem('rememberUsername')
    }

    // 5. 跳转到首页或重定向页面
    setTimeout(() => {
      const redirect = route.query.redirect || '/home'
      router.push(redirect)
    }, 500)

  } catch (error) {
    // 6. 登录失败处理
    ElMessage.error(error.message || '登录失败，请重试')
  } finally {
    // 7. 无论成功失败，都关闭加载状态
    loading.value = false
  }
}

// ========== 切换登录/注册模式 ==========
const toggleMode = () => {
  isLogin.value = !isLogin.value
  // 清空表单验证错误
  loginFormRef.value?.clearValidate()
  // 清空确认密码字段
  loginForm.confirmPassword = ''
}

// ========== 注册处理函数 ==========
const handleRegister = async () => {
  // 1. 验证表单
  const valid = await loginFormRef.value.validate().catch(() => false)

  if (!valid) {
    return
  }

  // 2. 开始加载状态
  loading.value = true

  try {
    // 3. 调用注册接口
    const response = await registerApi(loginForm.username, loginForm.password)

    // 4. 注册成功处理
    ElMessage.success(response.message || '注册成功！请登录')

    // 5. 切换到登录模式
    isLogin.value = true
    loginForm.confirmPassword = ''
    loginFormRef.value?.clearValidate()

  } catch (error) {
    // 6. 注册失败处理
    ElMessage.error(error.message || '注册失败，请重试')
  } finally {
    // 7. 无论成功失败，都关闭加载状态
    loading.value = false
  }
}
</script>

<style scoped>
/* ========== 页面容器 - 浅色 Apple 风格 ========== */
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: #f5f5f7;
}

/* ========== 背景装饰 ========== */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: floatCircle 20s ease-in-out infinite;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -50px;
  left: -50px;
  animation-delay: 5s;
}

.circle-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes floatCircle {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(-30px, -20px) scale(1.05); }
}

/* ========== 登录容器 ========== */
.login-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

/* ========== 卡片进入动画 ========== */
.card-fade-enter-active {
  animation: cardFadeIn 0.5s ease-out;
}

.card-fade-leave-active {
  animation: cardFadeOut 0.3s ease-in;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes cardFadeOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
}

/* ========== 标题切换动画 ========== */
.title-slide-enter-active,
.title-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.title-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.title-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.subtitle-fade-enter-active,
.subtitle-fade-leave-active {
  transition: all 0.3s ease;
}

.subtitle-fade-enter-from,
.subtitle-fade-leave-to {
  opacity: 0;
}

/* ========== 表单滑动动画 ========== */
.form-slide-enter-active {
  animation: formSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.form-slide-leave-active {
  animation: formSlideOut 0.3s ease-in;
}

@keyframes formSlideIn {
  from {
    opacity: 0;
    transform: translateY(-15px);
    height: 0;
    margin-bottom: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    height: auto;
    margin-bottom: 18px;
  }
}

@keyframes formSlideOut {
  from {
    opacity: 1;
    transform: translateY(0);
    height: auto;
    margin-bottom: 18px;
  }
  to {
    opacity: 0;
    transform: translateY(-15px);
    height: 0;
    margin-bottom: 0;
  }
}

/* ========== 登录卡片 - 现代简洁风格 ========== */
.login-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: 28px;
  padding: 48px 40px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 12px 48px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* ========== Logo ========== */
.login-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.logo-inner {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.35);
  transition: all 0.3s ease;
}

.logo-inner:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
}

/* ========== 标题样式 ========== */
.login-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

/* ========== 副标题样式 ========== */
.login-subtitle {
  text-align: center;
  font-size: 15px;
  color: #86868b;
  margin-bottom: 36px;
  font-weight: 400;
}

/* ========== 表单项样式 - 现代简洁 ========== */
:deep(.el-input__wrapper) {
  border-radius: 16px;
  padding: 14px 18px;
  box-shadow:
    0 0 0 1px #e5e5ea,
    inset 0 1px 3px rgba(0, 0, 0, 0.02);
  background: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-input__wrapper:hover) {
  box-shadow:
    0 0 0 1px #d1d1d6,
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 3px rgba(0, 0, 0, 0.02);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow:
    0 0 0 2px #0071e3,
    0 4px 16px rgba(0, 113, 227, 0.12);
}

:deep(.el-input__inner) {
  color: #1d1d1f;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: -0.01em;
}

:deep(.el-input__inner::placeholder) {
  color: #86868b;
}

:deep(.el-input__prefix) {
  color: #86868b;
}

/* ========== 表单项间距 ========== */
:deep(.el-form-item) {
  margin-bottom: 18px;
}

/* ========== 记住我区域 ========== */
.remember-me {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

:deep(.modern-checkbox .el-checkbox__label) {
  color: #6e6e73;
  font-size: 14px;
  font-weight: 500;
}

:deep(.modern-checkbox .el-checkbox__inner) {
  border-radius: 6px;
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
}

:deep(.modern-checkbox:hover .el-checkbox__inner) {
  border-color: #0071e3;
}

:deep(.modern-checkbox .el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #0071e3;
  border-color: #0071e3;
}

/* ========== 忘记密码链接 ========== */
.forget-link {
  color: #0071e3;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.forget-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #0071e3;
  transition: width 0.3s ease;
}

.forget-link:hover {
  color: #0077ed;
}

.forget-link:hover::after {
  width: 100%;
}

/* ========== 登录按钮 - 现代简洁风格 ========== */
.login-button {
  width: 100%;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%);
  border: none;
  font-size: 17px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 16px rgba(0, 113, 227, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  background: linear-gradient(135deg, #0077ed 0%, #0066d6 100%);
  transform: translateY(-2px);
  box-shadow:
    0 8px 24px rgba(0, 113, 227, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.login-button:active {
  transform: translateY(0);
  box-shadow:
    0 2px 8px rgba(0, 113, 227, 0.15),
    inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.login-button .btn-text {
  position: relative;
  z-index: 1;
}

/* ========== 测试提示 ========== */
.test-tip {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: #86868b;
  padding: 12px 16px;
  background: rgba(245, 245, 247, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.test-tip p {
  margin: 0;
}

/* ========== 响应式 ========== */
@media (max-width: 480px) {
  .login-card {
    padding: 36px 24px;
    border-radius: 24px;
  }

  .login-title {
    font-size: 28px;
  }

  .login-subtitle {
    font-size: 14px;
  }
}
</style>
