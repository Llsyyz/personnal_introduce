<!--
  Login.vue - 登录页面组件
  包含登录表单、表单验证、登录逻辑
-->

<template>
  <div class="login-page">
    <!-- 登录容器 -->
    <div class="login-container">
      <!-- 登录卡片 -->
      <div class="login-card">
        <!-- 标题 -->
        <h1 class="login-title">欢迎回来</h1>
        <p class="login-subtitle">请登录您的账户</p>

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
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <!-- 记住我 & 忘记密码 -->
          <div class="remember-me">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <a href="#" class="forget-link">忘记密码？</a>
          </div>

          <!-- 登录按钮 -->
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form>

        <!-- 测试提示 -->
        <div class="test-tip">
          <p>测试账号：admin / 123456</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { loginApi } from '@/api/login'

// ========== 路由实例 ==========
// useRouter 用于获取路由实例，进行页面跳转
const router = useRouter()

// ========== 响应式数据 ==========

// 表单引用对象，用于调用表单的验证方法
const loginFormRef = ref(null)

// 登录按钮的加载状态
const loading = ref(false)

// 登录表单的数据对象
const loginForm = reactive({
  username: '',      // 用户名
  password: '',      // 密码
  remember: false    // 是否记住我
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
  ]
}

// ========== 登录处理函数 ==========
const handleLogin = async () => {
  // 1. 验证表单
  // validate 是 Element Plus 提供的表单验证方法
  const valid = await loginFormRef.value.validate().catch(() => false)

  if (!valid) {
    // 表单验证不通过，直接返回
    return
  }

  // 2. 开始加载状态
  loading.value = true

  try {
    // 3. 调用登录接口
    const response = await loginApi(loginForm.username, loginForm.password)

    // 4. 登录成功处理
    ElMessage.success(response.message)

    // 存储 token 到 localStorage
    localStorage.setItem('token', response.data.token)

    // 存储用户信息
    localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))

    // 如果勾选了"记住我"，保存账号
    if (loginForm.remember) {
      localStorage.setItem('rememberUsername', loginForm.username)
    } else {
      localStorage.removeItem('rememberUsername')
    }

    // 5. 跳转到首页
    setTimeout(() => {
      router.push('/home')
    }, 500)

  } catch (error) {
    // 6. 登录失败处理
    ElMessage.error(error.message || '登录失败，请重试')
  } finally {
    // 7. 无论成功失败，都关闭加载状态
    loading.value = false
  }
}
</script>

<style scoped>
/* 页面容器 */
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* 登录容器 */
.login-container {
  width: 100%;
  max-width: 400px;
}

/* 登录卡片 - Apple 风格 */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* 标题样式 */
.login-title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 10px;
}

/* 副标题样式 */
.login-subtitle {
  text-align: center;
  font-size: 14px;
  color: #86868b;
  margin-bottom: 40px;
}

/* 表单项样式 */
:deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 12px 15px;
  box-shadow: 0 0 0 1px #d2d2d7;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #86868b;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #0071e3;
}

/* 表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

/* 记住我区域 */
.remember-me {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

/* 忘记密码链接 */
.forget-link {
  color: #0071e3;
  font-size: 14px;
  transition: opacity 0.3s;
}

.forget-link:hover {
  opacity: 0.7;
}

/* 登录按钮 - Apple 风格 */
.login-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: #0071e3;
  border: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: #0077ed;
}

.login-button:active {
  background: #0062cc;
}

/* 测试提示 */
.test-tip {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #86868b;
}

.test-tip p {
  margin: 0;
}
</style>
