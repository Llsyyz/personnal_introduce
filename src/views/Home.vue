<!--
  Home.vue - 登录成功后的首页组件
  显示用户信息和退出登录功能
-->

<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="navbar-content">
        <h1 class="navbar-title">首页</h1>
        <!-- 用户信息区域 -->
        <div class="user-info">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar :src="userInfo.avatar" :size="32" />
              <span class="username">{{ userInfo.nickname }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-card">
        <div class="welcome-section">
          <el-icon :size="80" color="#67C23A">
            <CircleCheck />
          </el-icon>
          <h2 class="welcome-title">登录成功！</h2>
          <p class="welcome-text">欢迎来到 Vue 3 + Element Plus 登录示例</p>
        </div>

        <!-- 用户信息卡片 -->
        <div class="info-section">
          <h3 class="section-title">用户信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户名">
              {{ userInfo.username }}
            </el-descriptions-item>
            <el-descriptions-item label="昵称">
              {{ userInfo.nickname }}
            </el-descriptions-item>
            <el-descriptions-item label="Token">
              <el-text type="info" size="small">{{ token }}</el-text>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
          <el-button type="danger" @click="handleLogout">
            退出登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck } from '@element-plus/icons-vue'
import { logoutApi } from '@/api/login'

// ========== 路由实例 ==========
const router = useRouter()

// ========== 响应式数据 ==========

// 用户信息
const userInfo = ref({
  username: '',
  nickname: '',
  avatar: ''
})

// Token
const token = ref('')

// ========== 初始化 ==========
// 组件挂载时获取用户信息
onMounted(() => {
  // 从 localStorage 获取用户信息
  const savedUserInfo = localStorage.getItem('userInfo')
  const savedToken = localStorage.getItem('token')

  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }

  if (savedToken) {
    token.value = savedToken
  }
})

// ========== 处理下拉菜单命令 ==========
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心功能开发中...')
      break
    case 'settings':
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// ========== 退出登录 ==========
const handleLogout = async () => {
  // 确认退出
  await ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )

  try {
    // 调用退出接口
    await logoutApi()

    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')

    ElMessage.success('已退出登录')

    // 跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 500)
  } catch (error) {
    ElMessage.error('退出失败，请重试')
  }
}
</script>

<style scoped>
/* 页面容器 */
.home-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 导航栏 */
.navbar {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

/* 用户信息区域 */
.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: background 0.3s;
}

.user-dropdown:hover {
  background: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #1d1d1f;
}

/* 主要内容区域 */
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 内容卡片 */
.content-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 欢迎区域 */
.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 20px 0 10px;
}

.welcome-text {
  font-size: 14px;
  color: #86868b;
  margin: 0;
}

/* 信息区域 */
.info-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 15px;
}

/* 操作按钮区域 */
.action-section {
  text-align: center;
}
</style>
