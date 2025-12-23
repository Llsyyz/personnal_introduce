<!--
  Notes.vue - 笔记管理页面
  支持笔记的增删改查、分类、搜索、颜色标记等功能
-->

<template>
  <div class="notes-page">
    <!-- 动态背景 -->
    <div class="animated-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="navbar-content">
        <div class="logo" @click="router.push('/home')" style="cursor: pointer">
          <el-icon :size="24" color="#fff">
            <Star />
          </el-icon>
          <span class="logo-text">My Notes</span>
        </div>
        <!-- 用户信息区域 -->
        <div class="user-section">
          <el-dropdown @command="handleCommand" trigger="click">
            <div class="user-dropdown">
              <el-avatar :src="userInfo.avatar" :size="40" class="user-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="user-text">
                <div class="user-name">{{ userInfo.nickname }}</div>
                <div class="user-role">笔记达人</div>
              </div>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="home">
                  <el-icon><HomeFilled /></el-icon>
                  <span>返回首页</span>
                </el-dropdown-item>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  <span>个人中心</span>
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
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <h1 class="page-title">
            <el-icon><Notebook /></el-icon>
            我的笔记
          </h1>
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索笔记..."
              :prefix-icon="Search"
              size="large"
              clearable
              class="search-input"
            />
          </div>
        </div>
        <div class="toolbar-right">
          <el-select
            v-model="filterCategory"
            placeholder="全部分类"
            size="large"
            clearable
            class="category-filter"
          >
            <el-option label="全部分类" value="" />
            <el-option label="学习" value="学习" />
            <el-option label="工作" value="工作" />
            <el-option label="生活" value="生活" />
            <el-option label="想法" value="想法" />
            <el-option label="其他" value="其他" />
          </el-select>
          <el-button type="primary" size="large" @click="handleAddNote" class="add-btn">
            <el-icon><Plus /></el-icon>
            新建笔记
          </el-button>
        </div>
      </div>

      <!-- 分类标签 -->
      <div class="category-tabs">
        <div
          class="category-tab"
          :class="{ active: filterCategory === '' }"
          @click="filterCategory = ''"
        >
          <el-icon><Grid /></el-icon>
          <span>全部</span>
          <span class="count">{{ notes.length }}</span>
        </div>
        <div
          class="category-tab"
          :class="{ active: filterCategory === '学习' }"
          @click="filterCategory = '学习'"
        >
          <el-icon><Reading /></el-icon>
          <span>学习</span>
          <span class="count">{{ getCategoryCount('学习') }}</span>
        </div>
        <div
          class="category-tab"
          :class="{ active: filterCategory === '工作' }"
          @click="filterCategory = '工作'"
        >
          <el-icon><Briefcase /></el-icon>
          <span>工作</span>
          <span class="count">{{ getCategoryCount('工作') }}</span>
        </div>
        <div
          class="category-tab"
          :class="{ active: filterCategory === '生活' }"
          @click="filterCategory = '生活'"
        >
          <el-icon><Sunny /></el-icon>
          <span>生活</span>
          <span class="count">{{ getCategoryCount('生活') }}</span>
        </div>
        <div
          class="category-tab"
          :class="{ active: filterCategory === '想法' }"
          @click="filterCategory = '想法'"
        >
          <el-icon><Sunny /></el-icon>
          <span>想法</span>
          <span class="count">{{ getCategoryCount('想法') }}</span>
        </div>
        <div
          class="category-tab"
          :class="{ active: filterCategory === '其他' }"
          @click="filterCategory = '其他'"
        >
          <el-icon><More /></el-icon>
          <span>其他</span>
          <span class="count">{{ getCategoryCount('其他') }}</span>
        </div>
      </div>

      <!-- 笔记卡片网格 -->
      <div class="notes-grid" v-if="filteredNotes.length > 0">
        <div
          class="note-card"
          v-for="note in filteredNotes"
          :key="note.id"
          :style="{ '--note-color': note.color }"
          @click="handleViewNote(note)"
        >
          <div class="note-header">
            <div class="note-category" :style="{ background: note.color + '20', color: note.color }">
              <el-icon><component :is="getCategoryIcon(note.category)" /></el-icon>
              <span>{{ note.category }}</span>
            </div>
            <div class="note-actions" @click.stop>
              <el-button text @click="handleEditNote(note)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button text type="danger" @click="handleDelete(note.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          <h3 class="note-title">{{ note.title }}</h3>
          <p class="note-content">{{ note.content }}</p>
          <div class="note-footer">
            <div class="note-date">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(note.createdAt) }}
            </div>
            <div class="note-tags" v-if="note.tags && note.tags.length">
              <el-tag
                v-for="tag in note.tags.slice(0, 2)"
                :key="tag"
                size="small"
                :style="{ background: note.color + '20', color: note.color, border: 'none' }"
              >
                {{ tag }}
              </el-tag>
              <span v-if="note.tags.length > 2" class="more-tags">+{{ note.tags.length - 2 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <el-icon :size="100" color="rgba(255,255,255,0.2)">
          <Notebook />
        </el-icon>
        <h3>{{ searchKeyword || filterCategory ? '没有找到相关笔记' : '还没有笔记' }}</h3>
        <p>{{ searchKeyword || filterCategory ? '试试其他关键词或分类' : '点击下方按钮创建你的第一篇笔记' }}</p>
        <el-button type="primary" size="large" @click="handleAddNote" v-if="!searchKeyword && !filterCategory">
          <el-icon><Plus /></el-icon>
          创建笔记
        </el-button>
      </div>
    </div>

    <!-- 添加/编辑笔记对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑笔记' : '新建笔记'"
      width="700px"
      :close-on-click-modal="false"
      class="note-dialog"
    >
      <el-form :model="noteForm" label-width="80px">
        <el-form-item label="标题">
          <el-input
            v-model="noteForm.title"
            placeholder="给笔记起个标题..."
            size="large"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="noteForm.category" placeholder="选择分类" size="large" style="width: 100%">
            <el-option label="学习" value="学习">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-icon><Reading /></el-icon>
                <span>学习</span>
              </div>
            </el-option>
            <el-option label="工作" value="工作">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-icon><Briefcase /></el-icon>
                <span>工作</span>
              </div>
            </el-option>
            <el-option label="生活" value="生活">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-icon><Sunny /></el-icon>
                <span>生活</span>
              </div>
            </el-option>
            <el-option label="想法" value="想法">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-icon><Sunny /></el-icon>
                <span>想法</span>
              </div>
            </el-option>
            <el-option label="其他" value="其他">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-icon><More /></el-icon>
                <span>其他</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色">
          <div class="color-picker">
            <div
              class="color-option"
              v-for="color in colors"
              :key="color"
              :style="{ background: color }"
              :class="{ active: noteForm.color === color }"
              @click="noteForm.color = color"
            >
              <el-icon v-if="noteForm.color === color"><Check /></el-icon>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="noteForm.tags"
            multiple
            placeholder="选择标签..."
            size="large"
            style="width: 100%"
            allow-create
            filterable
          >
            <el-option label="重要" value="重要" />
            <el-option label="紧急" value="紧急" />
            <el-option label="待办" value="待办" />
            <el-option label="已完成" value="已完成" />
            <el-option label="参考" value="参考" />
            <el-option label="灵感" value="灵感" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="noteForm.content"
            type="textarea"
            :rows="8"
            placeholder="在这里写下你的想法..."
            size="large"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEdit ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 查看笔记对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="currentNote?.title"
      width="700px"
      class="view-dialog"
    >
      <div class="note-detail" v-if="currentNote">
        <div class="detail-meta">
          <div class="detail-category" :style="{ background: currentNote.color + '20', color: currentNote.color }">
            <el-icon><component :is="getCategoryIcon(currentNote.category)" /></el-icon>
            <span>{{ currentNote.category }}</span>
          </div>
          <div class="detail-date">
            <el-icon><Calendar /></el-icon>
            {{ formatDate(currentNote.createdAt) }}
          </div>
        </div>
        <div class="detail-content">{{ currentNote.content }}</div>
        <div class="detail-tags" v-if="currentNote.tags && currentNote.tags.length">
          <el-tag
            v-for="tag in currentNote.tags"
            :key="tag"
            :style="{ background: currentNote.color + '20', color: currentNote.color, border: 'none' }"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Star, User, ArrowDown, SwitchButton, HomeFilled, Notebook, Search,
  Plus, Edit, Delete, Calendar, Grid, Reading, Briefcase,
  Sunny, More, Check
} from '@element-plus/icons-vue'
import { logoutApi } from '@/api/login'

// ========== 路由实例 ==========
const router = useRouter()

// ========== 响应式数据 ==========

// 用户信息
const userInfo = ref({
  username: 'admin',
  nickname: '管理员',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 搜索关键词
const searchKeyword = ref('')

// 分类筛选
const filterCategory = ref('')

// 对话框状态
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)

// 是否编辑模式
const isEdit = ref(false)

// 当前查看的笔记
const currentNote = ref(null)

// 笔记表单
const noteForm = reactive({
  id: null,
  title: '',
  category: '学习',
  color: '#409EFF',
  content: '',
  tags: []
})

// 颜色选项
const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#722ED1', '#13C2C2', '#F5222D']

// 笔记数据列表
const notes = ref([
  {
    id: 1,
    title: 'Vue 3 学习笔记',
    category: '学习',
    color: '#409EFF',
    content: 'Vue 3 引入了 Composition API，可以更好地组织代码逻辑。setup 语法糖让代码更简洁，ref 和 reactive 用于创建响应式数据。',
    tags: ['前端', 'Vue', '重要'],
    createdAt: '2024-01-15 10:30'
  },
  {
    id: 2,
    title: '项目开发计划',
    category: '工作',
    color: '#67C23A',
    content: '本周需要完成用户模块的开发，包括登录、注册、个人中心等功能。预计需要5个工作日。',
    tags: ['待办', '紧急'],
    createdAt: '2024-03-20 14:20'
  },
  {
    id: 3,
    title: '周末生活安排',
    category: '生活',
    color: '#E6A23C',
    content: '周六去图书馆看书，周日和朋友聚餐。记得提前预约餐厅，还要准备一个小礼物。',
    tags: ['周末'],
    createdAt: '2024-06-01 09:00'
  },
  {
    id: 4,
    title: '产品创意灵感',
    category: '想法',
    color: '#F56C6C',
    content: '做一个可以记录个人历程的应用，结合时间轴的形式展示，支持添加图片和标签分类。界面要简洁美观，交互要流畅。',
    tags: ['灵感', '产品'],
    createdAt: '2024-08-15 16:45'
  },
  {
    id: 5,
    title: '前端面试准备',
    category: '学习',
    color: '#722ED1',
    content: '需要复习的内容：\n1. JavaScript 基础\n2. Vue/React 框架原理\n3. 前端工程化\n4. 性能优化\n5. 算法和数据结构',
    tags: ['面试', '重要'],
    createdAt: '2024-09-01 11:20'
  }
])

// ========== 计算属性 ==========

// 过滤后的笔记列表
const filteredNotes = computed(() => {
  return notes.value.filter(note => {
    const matchCategory = !filterCategory.value || note.category === filterCategory.value
    const matchSearch = !searchKeyword.value ||
      note.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      note.content.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()))
    return matchCategory && matchSearch
  })
})

// ========== 生命周期 ==========

onMounted(() => {
  // 获取用户信息
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }

  // 获取存储的笔记数据
  const savedNotes = localStorage.getItem('notes')
  if (savedNotes) {
    notes.value = JSON.parse(savedNotes)
  }
})

// ========== 方法 ==========

// 获取分类数量
const getCategoryCount = (category) => {
  return notes.value.filter(note => note.category === category).length
}

// 获取分类图标
const getCategoryIcon = (category) => {
  const iconMap = {
    '学习': 'Reading',
    '工作': 'Briefcase',
    '生活': 'Sunny',
    '想法': 'Sunny',
    '其他': 'More'
  }
  return iconMap[category] || 'More'
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

// 添加笔记
const handleAddNote = () => {
  isEdit.value = false
  noteForm.id = null
  noteForm.title = ''
  noteForm.category = '学习'
  noteForm.color = '#409EFF'
  noteForm.content = ''
  noteForm.tags = []
  dialogVisible.value = true
}

// 编辑笔记
const handleEditNote = (note) => {
  isEdit.value = true
  noteForm.id = note.id
  noteForm.title = note.title
  noteForm.category = note.category
  noteForm.color = note.color
  noteForm.content = note.content
  noteForm.tags = [...(note.tags || [])]
  dialogVisible.value = true
}

// 查看笔记
const handleViewNote = (note) => {
  currentNote.value = note
  viewDialogVisible.value = true
}

// 提交笔记
const handleSubmit = () => {
  if (!noteForm.title || !noteForm.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  if (isEdit.value) {
    // 编辑模式
    const index = notes.value.findIndex(n => n.id === noteForm.id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        title: noteForm.title,
        category: noteForm.category,
        color: noteForm.color,
        content: noteForm.content,
        tags: noteForm.tags,
        updatedAt: new Date().toISOString()
      }
    }
    ElMessage.success('保存成功')
  } else {
    // 新建模式
    const newNote = {
      id: Date.now(),
      title: noteForm.title,
      category: noteForm.category,
      color: noteForm.color,
      content: noteForm.content,
      tags: noteForm.tags,
      createdAt: new Date().toISOString()
    }
    notes.value.unshift(newNote)
    ElMessage.success('创建成功')
  }

  // 持久化存储
  localStorage.setItem('notes', JSON.stringify(notes.value))
  dialogVisible.value = false
}

// 删除笔记
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定要删除这篇笔记吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  notes.value = notes.value.filter(note => note.id !== id)
  localStorage.setItem('notes', JSON.stringify(notes.value))
  ElMessage.success('删除成功')
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'home':
      router.push('/home')
      break
    case 'profile':
      ElMessage.info('个人中心功能开发中...')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = async () => {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  try {
    await logoutApi()
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.success('已退出登录')
    setTimeout(() => router.push('/login'), 500)
  } catch (error) {
    ElMessage.error('退出失败，请重试')
  }
}
</script>

<style scoped>
/* ========== 页面基础样式 ========== */
.notes-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* ========== 动态背景 ========== */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: #667eea;
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: #f093fb;
  bottom: -50px;
  left: -50px;
  animation-delay: 5s;
}

.shape-3 {
  width: 350px;
  height: 350px;
  background: #4facfe;
  top: 50%;
  left: 50%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(-30px, -20px) scale(1.05); }
}

/* ========== 导航栏 ========== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 用户下拉区域 */
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-dropdown:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.user-text {
  text-align: left;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.dropdown-icon {
  color: rgba(255, 255, 255, 0.6);
  transition: transform 0.3s;
}

.user-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* ========== 主要内容区域 ========== */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 30px;
}

/* ========== 工具栏 ========== */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  white-space: nowrap;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input {
  --el-input-bg-color: rgba(255, 255, 255, 0.1);
  --el-input-border-color: rgba(255, 255, 255, 0.2);
  --el-input-text-color: #fff;
  --el-input-placeholder-color: rgba(255, 255, 255, 0.5);
}

.search-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
}

.search-input :deep(.el-input__wrapper:hover),
.search-input :deep(.el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.category-filter {
  width: 140px;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  height: 40px;
  padding: 0 24px;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* ========== 分类标签 ========== */
.category-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.category-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.category-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
}

.category-tab .count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

/* ========== 笔记网格 ========== */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.note-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.note-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--note-color);
}

.note-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.note-category {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.note-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.note-card:hover .note-actions {
  opacity: 1;
}

.note-actions .el-button {
  color: rgba(255, 255, 255, 0.6);
}

.note-actions .el-button:hover {
  color: #fff;
}

.note-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-content {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 88px;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.note-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.note-tags {
  display: flex;
  gap: 6px;
  align-items: center;
}

.more-tags {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* ========== 空状态 ========== */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state .el-icon {
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 30px;
}

/* ========== 颜色选择器 ========== */
.color-picker {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #fff;
}

.color-option .el-icon {
  color: #fff;
  font-size: 20px;
}

/* ========== 笔记详情 ========== */
.note-detail {
  padding: 10px;
}

.detail-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-category {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.detail-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
}

.detail-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
}

.detail-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .toolbar-right {
    flex-direction: column;
  }

  .category-filter {
    width: 100%;
  }

  .notes-grid {
    grid-template-columns: 1fr;
  }

  .category-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* ========== 下拉菜单样式覆盖 ========== */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-select) {
  --el-select-bg-color: rgba(255, 255, 255, 0.1);
  --el-select-border-color: rgba(255, 255, 255, 0.2);
  --el-select-input-color: #fff;
}
</style>
