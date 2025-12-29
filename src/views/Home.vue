<!--
  Home.vue - 登录成功后的首页
  大胆创新的视觉设计，包含个人历史经历展示
-->

<template>
  <div class="home-page">
    <!-- 动态背景装饰 -->
    <div class="animated-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

    <!-- 顶部导航栏 - Notion 风格 -->
    <div class="navbar">
      <div class="navbar-content">
        <!-- 左侧品牌区域 -->
        <div class="nav-left">
          <div class="brand">
            <div class="brand-icon">
              <el-icon :size="22">
                <Star />
              </el-icon>
            </div>
            <span class="brand-name">NoteSpace</span>
          </div>
        </div>

        <!-- 中间搜索区域 -->
        <div class="nav-center">
          <div class="global-search">
            <el-icon class="search-icon"><Search /></el-icon>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索历程..."
              class="search-input"
              clearable
            />
          </div>
        </div>

        <!-- 右侧操作区域 -->
        <div class="nav-right">
          <!-- 快速操作按钮组 -->
          <div class="quick-actions">
            <el-tooltip content="快速添加" placement="bottom">
              <el-button class="action-btn" @click="handleAddExperience">
                <el-icon :size="18"><Plus /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="查看笔记" placement="bottom">
              <el-button class="action-btn" @click="router.push('/notes')">
                <el-icon :size="18"><Notebook /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="相册" placement="bottom">
              <el-button class="action-btn" @click="router.push('/gallery')">
                <el-icon :size="18"><Collection /></el-icon>
              </el-button>
            </el-tooltip>
          </div>

          <!-- 用户下拉区域 -->
          <el-dropdown @command="handleCommand" trigger="click">
            <div class="user-dropdown">
              <el-avatar :src="userInfo.avatar" :size="36" class="user-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="user-name">{{ userInfo.nickname }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="home">
                  <el-icon><HomeFilled /></el-icon>
                  <span>首页</span>
                </el-dropdown-item>
                <el-dropdown-item command="notes">
                  <el-icon><Notebook /></el-icon>
                  <span>笔记</span>
                </el-dropdown-item>
                <el-dropdown-item command="gallery">
                  <el-icon><Collection /></el-icon>
                  <span>相册</span>
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 英雄区域 - 大胆的设计 -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <el-icon><Trophy /></el-icon>
            <span>欢迎回来</span>
          </div>
          <h1 class="hero-title">
            你好，<span class="highlight">{{ userInfo.nickname }}</span>
          </h1>
          <p class="hero-subtitle">每一次登录，都是新的开始。记录你的精彩历程。</p>
          <div class="hero-actions">
            <el-button size="large" class="hero-btn secondary" @click="scrollToTimeline">
              <el-icon><Compass /></el-icon>
              <span>查看历程</span>
            </el-button>
            <el-button size="large" class="hero-btn primary" @click="handleAddExperience">
              <el-icon><Plus /></el-icon>
              <span>添加经历</span>
            </el-button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-card card-1">
            <el-icon :size="32" color="#67C23A"><SuccessFilled /></el-icon>
            <div class="card-label">登录成功</div>
          </div>
          <div class="floating-card card-2">
            <el-icon :size="32" color="#409EFF"><Clock /></el-icon>
            <div class="card-label">{{ currentTime }}</div>
          </div>
          <div class="floating-card card-3">
            <el-icon :size="32" color="#E6A23C"><Star /></el-icon>
            <div class="card-label">{{ experiences.length }} 篇历程</div>
          </div>
        </div>
      </section>

      <!-- 统计卡片区域 -->
      <section class="stats-section">
        <div class="stat-card" v-for="(stat, index) in stats" :key="index" :style="{ '--delay': index * 0.1 + 's' }">
          <div class="stat-icon" :style="{ background: stat.color }">
            <el-icon :size="28" color="#fff">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <!-- 个人历史经历时间轴 -->
      <section class="timeline-section" ref="timelineRef">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon><Collection /></el-icon>
            我的历程
          </h2>
          <el-button class="add-experience-btn" @click="handleAddExperience">
            <el-icon><Plus /></el-icon>
            <span>添加经历</span>
          </el-button>
        </div>

        <!-- 时间轴组件 -->
        <div class="timeline-container" v-if="experiences.length > 0">
          <div
            class="timeline-item"
            v-for="(exp, index) in experiences"
            :key="exp.id"
            :class="{ 'left': index % 2 === 0, 'right': index % 2 === 1 }"
          >
            <div class="timeline-dot" :style="{ background: exp.color }"></div>
            <div class="timeline-content">
              <div class="timeline-date" :style="{ color: exp.color }">
                <el-icon><Calendar /></el-icon>
                {{ exp.date }}
              </div>
              <h3 class="timeline-title">{{ exp.title }}</h3>
              <div class="timeline-desc" v-html="exp.content || exp.description"></div>
              <div class="timeline-tags" v-if="exp.tags && exp.tags.length">
                <el-tag
                  v-for="tag in exp.tags"
                  :key="tag"
                  size="small"
                  :type="getTagType(index)"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="timeline-actions">
                <el-button text type="primary" size="small">
                  <el-icon><View /></el-icon>
                  查看详情
                </el-button>
                <el-button text type="danger" size="small" @click="handleDelete(exp.id)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty
          v-else
          description="还没有记录任何历程"
          :image-size="200"
        >
          <el-button class="add-experience-btn" @click="handleAddExperience">
            <el-icon><Plus /></el-icon>
            <span>添加第一篇历程</span>
          </el-button>
        </el-empty>
      </section>
    </div>

    <!-- 添加经历侧边抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      direction="rtl"
      :size="'85%'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="experience-drawer"
      destroy-on-close
    >
      <template #header>
        <div class="drawer-header">
          <div class="header-left">
            <el-icon :size="20"><EditPen /></el-icon>
            <span>添加经历</span>
          </div>
          <div class="header-right">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
          </div>
        </div>
      </template>

      <div class="experience-editor-container">
        <div class="editor-header">
          <el-input
            v-model="experienceForm.title"
            placeholder="给经历起个标题..."
            size="large"
            class="title-input"
          />
          <div class="editor-meta">
            <el-date-picker
              v-model="experienceForm.date"
              type="date"
              placeholder="选择日期"
              size="large"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
            <el-select
              v-model="experienceForm.tags"
              multiple
              placeholder="标签..."
              size="large"
              style="width: 200px"
              allow-create
              filterable
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option label="学习" value="学习" />
              <el-option label="工作" value="工作" />
              <el-option label="旅行" value="旅行" />
              <el-option label="成就" value="成就" />
              <el-option label="其他" value="其他" />
            </el-select>
          </div>
        </div>

        <!-- 富文本编辑器 -->
        <div class="rich-editor-wrapper">
          <Toolbar
            class="editor-toolbar"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            mode="default"
          />
          <Editor
            class="editor-content"
            v-model="experienceForm.content"
            :defaultConfig="editorConfig"
            mode="default"
            @onCreated="handleEditorCreated"
          />
        </div>
      </div>
    </el-drawer>

    <!-- 退出登录确认对话框 -->
    <el-dialog
      v-model="logoutDialogVisible"
      width="400px"
      :show-close="false"
      class="logout-dialog"
      align-center
      destroy-on-close
    >
      <div class="logout-content">
        <div class="logout-icon">
          <el-icon :size="48"><SwitchButton /></el-icon>
        </div>
        <h3 class="logout-title">退出登录</h3>
        <p class="logout-desc">确定要退出当前账号吗？</p>
        <div class="logout-actions">
          <el-button class="logout-btn cancel" @click="logoutDialogVisible = false">
            取消
          </el-button>
          <el-button class="logout-btn confirm" @click="confirmLogout">
            确认退出
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, shallowRef, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Star, User, ArrowDown, SwitchButton, Trophy,
  Compass, Plus, SuccessFilled, Clock, Collection,
  Calendar, View, Delete, TrendCharts, Medal, Document, Notebook, Search, EditPen, HomeFilled
} from '@element-plus/icons-vue'
import { logoutApi } from '@/api/login'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// ========== 路由实例 ==========
const router = useRouter()

// ========== 响应式数据 ==========

// 用户信息
const userInfo = ref({
  username: 'admin',
  nickname: '管理员',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 当前时间
const currentTime = ref('')

// 搜索关键词
const searchKeyword = ref('')

// 时间轴引用
const timelineRef = ref(null)

// 编辑器相关
const editorRef = shallowRef()

// 编辑器配置
const toolbarConfig = {
  toolbarKeys: [
    'headerSelect',
    'bold',
    'italic',
    'underline',
    'through',
    '|',
    'bulletedList',
    'numberedList',
    'todo',
    '|',
    'fontSize',
    'lineHeight',
    'color',
    'bgColor',
    '|',
    'divider',
    '|',
    'undo',
    'redo'
  ]
}

const editorConfig = {
  placeholder: '记录这段经历...',
  MENU_CONF: {}
}

// 抽屉状态
const drawerVisible = ref(false)

// 是否编辑模式
const isEditMode = ref(false)

// 经历表单
const experienceForm = reactive({
  id: null,
  title: '',
  date: '',
  content: '',
  tags: []
})

// 经历数据列表 - 初始为空，避免显示跳动
const experiences = ref([])

// 默认示例数据（仅在首次使用时展示）
const defaultExperiences = [
  {
    id: 1,
    title: '开始学习 Vue 3',
    date: '2024-01-15',
    description: '今天开始系统学习 Vue 3 框架，从基础语法到组件开发，感受前端技术的新变化。',
    tags: ['学习'],
    color: '#409EFF'
  },
  {
    id: 2,
    title: '完成第一个项目',
    date: '2024-03-20',
    description: '使用 Vue 3 + Element Plus 完成了第一个完整的登录系统，收获满满！',
    tags: ['成就', '学习'],
    color: '#67C23A'
  },
  {
    id: 3,
    title: '获得实习机会',
    date: '2024-06-01',
    description: '成功获得一家科技公司的前端开发实习机会，开启职业新篇章。',
    tags: ['工作', '成就'],
    color: '#E6A23C'
  },
  {
    id: 4,
    title: '技术分享会',
    date: '2024-08-15',
    description: '在公司内部技术分享会上做了 Vue 3 最佳实践的分享，获得同事好评。',
    tags: ['工作'],
    color: '#F56C6C'
  }
]

// 统计数据
const stats = computed(() => [
  {
    icon: 'TrendCharts',
    label: '总历程',
    value: experiences.value.length,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    icon: 'Medal',
    label: '成就达成',
    value: experiences.value.filter(e => e.tags?.includes('成就')).length,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    icon: 'Document',
    label: '本月记录',
    value: experiences.value.filter(e => {
      const expDate = new Date(e.date)
      const now = new Date()
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()
    }).length,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
])

// ========== 生命周期 ==========

let timer = null

onMounted(() => {
  // 获取用户信息
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }

  // 获取存储的经历数据，如果没有则使用默认数据
  const savedExperiences = localStorage.getItem('experiences')
  if (savedExperiences) {
    experiences.value = JSON.parse(savedExperiences)
  } else {
    // 首次使用，展示默认数据
    experiences.value = [...defaultExperiences]
    localStorage.setItem('experiences', JSON.stringify(defaultExperiences))
  }

  // 更新时间
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  // 销毁编辑器实例
  if (editorRef.value) {
    editorRef.value.destroy()
  }
})

// ========== 方法 ==========

// 更新当前时间
const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

// 滚动到时间轴
const scrollToTimeline = () => {
  if (timelineRef.value) {
    timelineRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'home':
      router.push('/home')
      break
    case 'notes':
      router.push('/notes')
      break
    case 'gallery':
      router.push('/gallery')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 添加经历
const handleAddExperience = () => {
  isEditMode.value = false
  experienceForm.id = null
  experienceForm.title = ''
  experienceForm.date = ''
  experienceForm.content = ''
  experienceForm.tags = []
  drawerVisible.value = true
}

// 取消编辑
const handleCancel = () => {
  if (editorRef.value) {
    editorRef.value.clear()
  }
  drawerVisible.value = false
}

// 提交经历
const handleSubmit = () => {
  if (!experienceForm.title || !experienceForm.date) {
    ElMessage.warning('请填写标题和日期')
    return
  }

  // 获取编辑器的 HTML 内容
  const content = editorRef.value?.getHtml() || ''
  if (!content || content === '<p><br></p>') {
    ElMessage.warning('请填写内容')
    return
  }

  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  const newExp = {
    id: Date.now(),
    title: experienceForm.title,
    date: experienceForm.date,
    description: '', // 保持兼容，显示时使用 content
    content: content,
    tags: experienceForm.tags,
    color: colors[Math.floor(Math.random() * colors.length)]
  }

  experiences.value.unshift(newExp)
  localStorage.setItem('experiences', JSON.stringify(experiences.value))

  ElMessage.success('添加成功')
  drawerVisible.value = false
}

// 编辑器创建完成
const handleEditorCreated = (editor) => {
  editorRef.value = editor
}

// 删除经历
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定要删除这篇历程吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  experiences.value = experiences.value.filter(e => e.id !== id)
  localStorage.setItem('experiences', JSON.stringify(experiences.value))
  ElMessage.success('删除成功')
}

// 获取标签类型
const getTagType = (index) => {
  const types = ['primary', 'success', 'warning', 'info', 'danger']
  return types[index % types.length]
}

// 退出登录对话框状态
const logoutDialogVisible = ref(false)

// 退出登录
const handleLogout = () => {
  logoutDialogVisible.value = true
}

// 确认退出
const confirmLogout = async () => {
  try {
    await logoutApi()
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.success('已退出登录')
    logoutDialogVisible.value = false
    setTimeout(() => router.push('/login'), 500)
  } catch (error) {
    ElMessage.error('退出失败，请重试')
  }
}
</script>

<style scoped>
/* ========== 页面基础样式 - 浅色 Apple 风格 ========== */
.home-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: #f5f5f7;
}

/* ========== 动态背景装饰 ========== */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  animation: float 25s ease-in-out infinite;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -150px;
  right: -150px;
  animation-delay: 0s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -100px;
  left: -100px;
  animation-delay: 8s;
}

.shape-3 {
  width: 450px;
  height: 450px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  left: 50%;
  animation-delay: 15s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(40px, -40px) scale(1.1); }
  50% { transform: translate(-30px, 30px) scale(0.9); }
  75% { transform: translate(-40px, -30px) scale(1.05); }
}

/* ========== 导航栏 - 现代简洁风格 ========== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}

.navbar-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

/* 左侧品牌区域 */
.nav-left {
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 6px 12px;
  border-radius: 10px;
}

.brand:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: scale(1.02);
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.01em;
}

/* 中间搜索区域 */
.nav-center {
  flex: 1;
  max-width: 500px;
}

.global-search {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: #86868b;
  z-index: 1;
}

.global-search .search-input {
  width: 100%;
}

.global-search :deep(.el-input__wrapper) {
  background: #f5f5f7;
  border: 1px solid #e5e5ea;
  border-radius: 12px;
  padding-left: 42px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.25s ease;
}

.global-search :deep(.el-input__wrapper:hover),
.global-search :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  border-color: #0071e3;
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}

.global-search :deep(.el-input__inner) {
  color: #1d1d1f;
  font-size: 14px;
}

.global-search :deep(.el-input__inner::placeholder) {
  color: #86868b;
}

.global-search :deep(.el-input__clear) {
  color: #86868b;
}

/* 右侧操作区域 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.quick-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 16px;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

/* 确保 tooltip 不会影响按钮间距 */
.quick-actions :deep(.el-tooltip__trigger) {
  display: flex;
}

.action-btn {
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 12px;
  background: #f5f5f7;
  border: 1px solid #e5e5ea;
  color: #1d1d1f;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
  background: #fff;
  border-color: #d1d1d6;
  color: #0071e3;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 用户下拉区域 */
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  border-radius: 14px;
  background: #f5f5f7;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e5ea;
}

.user-dropdown:hover {
  background: #fff;
  border-color: #d1d1d6;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.user-avatar :deep(.el-icon) {
  font-size: 18px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  color: #86868b;
  transition: transform 0.3s;
  font-size: 14px;
}

.user-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* ========== 主要内容区域 ========== */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}

/* ========== 英雄区域 ========== */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 60px;
  min-height: 400px;
}

.hero-content {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f5f5f7;
  border-radius: 50px;
  color: #6e6e73;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid #e5e5ea;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  color: #1d1d1f;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: -0.03em;
}

.hero-title .highlight {
  color: #6e6e73;
  -webkit-text-fill-color: initial;
}

.hero-subtitle {
  font-size: 18px;
  color: #6e6e73;
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.hero-btn {
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hero-btn .el-icon {
  font-size: 18px;
}

.hero-btn.primary {
  background: linear-gradient(135deg, #1d1d1f 0%, #000 100%);
  border: none;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.hero-btn.primary:hover {
  background: linear-gradient(135deg, #2d2d2f 0%, #1a1a1a 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.hero-btn.primary:active {
  transform: translateY(-1px) scale(1.01);
}

.hero-btn.secondary {
  background: #fff;
  border: 1px solid #e5e5ea;
  color: #1d1d1f;
}

.hero-btn.secondary:hover {
  background: #f5f5f7;
  border-color: #d1d1d6;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.hero-btn.secondary:active {
  transform: translateY(-1px) scale(1.01);
}

/* ========== 视觉装饰区域 ========== */
.hero-visual {
  position: relative;
  height: 350px;
}

.floating-card {
  position: absolute;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1d1d1f;
  animation: floatCard 6s ease-in-out infinite;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-1 {
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.card-2 {
  top: 50%;
  right: 0;
  animation-delay: 2s;
}

.card-3 {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  animation: floatCardCenter 6s ease-in-out infinite;
  animation-delay: 4s;
}

@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes floatCardCenter {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-20px); }
}

.card-label {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
}

/* ========== 统计卡片区域 ========== */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 60px;
}

.stat-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  animation: fadeInUp 0.8s ease-out backwards;
  animation-delay: var(--delay);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #1d1d1f;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #86868b;
  font-weight: 500;
}

/* ========== 时间轴区域 ========== */
.timeline-section {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

/* ========== 添加经历按钮 ========== */
.add-experience-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #1d1d1f 0%, #000 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.add-experience-btn .el-icon {
  font-size: 16px;
}

.add-experience-btn:hover {
  background: linear-gradient(135deg, #2d2d2f 0%, #1a1a1a 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
}

.add-experience-btn:active {
  transform: translateY(0) scale(1);
}

/* ========== 时间轴样式 ========== */
.timeline-container {
  position: relative;
  padding: 40px 0;
}

/* 时间轴中心线 */
.timeline-container::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
}

.timeline-item.left {
  flex-direction: row;
}

.timeline-item.right {
  flex-direction: row-reverse;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

/* 时间轴节点 */
.timeline-dot {
  position: absolute;
  left: 50%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transform: translateX(-50%);
  border: 4px solid #fff;
  box-shadow: 0 0 0 3px var(--dot-color, #667eea), 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.timeline-item.left .timeline-content {
  margin-right: calc(50% + 40px);
  margin-left: 0;
  text-align: right;
}

.timeline-item.right .timeline-content {
  margin-left: calc(50% + 40px);
  margin-right: 0;
  text-align: left;
}

.timeline-content {
  flex: 1;
  max-width: calc(50% - 40px);
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 24px;
  padding: 28px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.timeline-content:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.timeline-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.timeline-title {
  font-size: 22px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 12px;
}

.timeline-desc {
  font-size: 14px;
  color: #6e6e73;
  line-height: 1.6;
  margin-bottom: 16px;
  max-height: 120px;
  overflow: hidden;
  position: relative;
}

/* 富文本内容样式 */
.timeline-desc :deep(p) {
  margin: 8px 0;
}

.timeline-desc :deep(h1),
.timeline-desc :deep(h2),
.timeline-desc :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  margin: 12px 0 8px;
  color: #1d1d1f;
}

.timeline-desc :deep(ul),
.timeline-desc :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.timeline-desc :deep(li) {
  margin: 4px 0;
}

.timeline-desc :deep(code) {
  background: #f0f0f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #d73a49;
  font-family: 'SF Mono', monospace;
}

.timeline-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.timeline-item.right .timeline-tags {
  justify-content: flex-start;
}

.timeline-item.left .timeline-tags {
  justify-content: flex-end;
}

.timeline-actions {
  display: flex;
  gap: 8px;
}

.timeline-item.right .timeline-actions {
  justify-content: flex-start;
}

.timeline-item.left .timeline-actions {
  justify-content: flex-end;
}

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-visual {
    display: none;
  }

  .hero-title {
    font-size: 36px;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .timeline-container::before {
    left: 20px;
  }

  .timeline-dot {
    left: 20px;
  }

  .timeline-item.left .timeline-content,
  .timeline-item.right .timeline-content {
    max-width: calc(100% - 60px);
    margin-left: 60px;
    margin-right: 0;
    text-align: left;
  }

  .timeline-item.left .timeline-tags,
  .timeline-item.left .timeline-actions {
    justify-content: flex-start;
  }
}

/* ========== 下拉菜单样式覆盖 ========== */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-empty) {
  --el-empty-description-color: #86868b;
}

/* ========== 经历编辑抽屉样式 ========== */
.experience-drawer :deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 0;
}

.experience-drawer :deep(.el-drawer__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e5ea;
  background: #fff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
}

.header-right {
  display: flex;
  gap: 12px;
}

.experience-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f7;
}

.editor-header {
  padding: 20px 24px;
  background: #fff;
  border-bottom: 1px solid #e5e5ea;
}

.title-input {
  margin-bottom: 16px;
}

.title-input :deep(.el-input__wrapper) {
  border: none;
  box-shadow: none;
  background: transparent;
  padding: 0;
}

.title-input :deep(.el-input__inner) {
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
}

.editor-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.rich-editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin: 16px 24px 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.editor-toolbar {
  border-bottom: 1px solid #e5e5ea;
  background: #f9f9f9;
}

.editor-toolbar :deep(.w-e-toolbar) {
  border: none;
  background: transparent;
  padding: 10px 20px;
  flex-wrap: wrap;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
}

.editor-content :deep(.w-e-text-container) {
  background: #fff;
}

.editor-content :deep(.w-e-text-placeholder) {
  color: #86868b;
  font-style: normal;
}

/* ========== 退出登录对话框样式 - 现代简洁 ========== */
.logout-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.logout-dialog :deep(.el-dialog) {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.15);
}

.logout-content {
  padding: 32px 24px 24px;
  text-align: center;
}

.logout-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, rgba(245, 108, 108, 0.1) 0%, rgba(245, 108, 108, 0.05) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f56c6c;
}

.logout-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 8px;
}

.logout-desc {
  font-size: 14px;
  color: #86868b;
  margin: 0 0 24px;
}

.logout-actions {
  display: flex;
  gap: 12px;
}

.logout-btn {
  flex: 1;
  height: 44px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.25s ease;
}

.logout-btn.cancel {
  background: #f5f5f7;
  border: 1px solid #e5e5ea;
  color: #1d1d1f;
}

.logout-btn.cancel:hover {
  background: #e5e5ea;
  transform: translateY(-1px);
}

.logout-btn.confirm {
  background: linear-gradient(135deg, #f56c6c 0%, #e85d5d 100%);
  border: none;
  color: #fff;
  box-shadow: 0 4px 16px rgba(245, 108, 108, 0.3);
}

.logout-btn.confirm:hover {
  background: linear-gradient(135deg, #e85d5d 0%, #d94f4f 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(245, 108, 108, 0.35);
}
</style>
