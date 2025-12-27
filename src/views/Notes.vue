<!--
  Notes.vue - 笔记管理页面
  支持笔记的增删改查、分类、搜索、颜色标记、富文本编辑等功能
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
        <!-- 左侧品牌区域 -->
        <div class="nav-left">
          <div class="brand" @click="router.push('/home')">
            <div class="brand-icon">
              <el-icon :size="22">
                <Notebook />
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
              placeholder="搜索笔记..."
              class="search-input"
              clearable
            />
          </div>
        </div>

        <!-- 右侧操作区域 -->
        <div class="nav-right">
          <!-- 快速操作按钮组 -->
          <div class="quick-actions">
            <el-tooltip content="快速新建" placement="bottom">
              <el-button class="action-btn" @click="handleAddNote">
                <el-icon :size="18"><Plus /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="相册" placement="bottom">
              <el-button class="action-btn" @click="router.push('/gallery')">
                <el-icon :size="18"><Collection /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="通知" placement="bottom">
              <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="badge-item">
                <el-button class="action-btn">
                  <el-icon :size="18"><Bell /></el-icon>
                </el-button>
              </el-badge>
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
                  <span>返回首页</span>
                </el-dropdown-item>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  <span>设置</span>
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
        </div>
        <div class="toolbar-right">
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
          <p class="note-content">{{ getPlainText(note.content) }}</p>
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

    <!-- 编辑笔记侧边抽屉 -->
    <el-drawer
      v-model="dialogVisible"
      direction="rtl"
      :size="'85%'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="note-editor-drawer"
      destroy-on-close
    >
      <template #header>
        <div class="drawer-header">
          <div class="header-left">
            <el-icon :size="20"><EditPen /></el-icon>
            <span>{{ isEdit ? '编辑笔记' : '新建笔记' }}</span>
          </div>
          <div class="header-right">
            <el-button @click="handleCancel" size="default">取消</el-button>
            <el-button type="primary" @click="handleSubmit" size="default">
              {{ isEdit ? '保存' : '创建' }}
            </el-button>
          </div>
        </div>
      </template>

      <div class="note-editor-container">
        <div class="editor-header">
          <el-input
            v-model="noteForm.title"
            placeholder="给笔记起个标题..."
            size="large"
            class="title-input"
            :input-style="{ fontSize: '24px', fontWeight: 'bold', border: 'none', background: 'transparent' }"
          />
          <div class="editor-meta">
            <el-select v-model="noteForm.category" placeholder="选择分类" size="large">
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
            <div class="color-picker-inline">
              <div
                class="color-option-inline"
                v-for="color in colors"
                :key="color"
                :style="{ background: color }"
                :class="{ active: noteForm.color === color }"
                @click="noteForm.color = color"
                :title="color"
              >
                <el-icon v-if="noteForm.color === color"><Check /></el-icon>
              </div>
            </div>
            <el-select
              v-model="noteForm.tags"
              multiple
              placeholder="标签..."
              size="large"
              style="width: 200px"
              allow-create
              filterable
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option label="重要" value="重要" />
              <el-option label="紧急" value="紧急" />
              <el-option label="待办" value="待办" />
              <el-option label="已完成" value="已完成" />
              <el-option label="参考" value="参考" />
              <el-option label="灵感" value="灵感" />
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
            v-model="noteForm.content"
            :defaultConfig="editorConfig"
            mode="default"
            @onCreated="handleCreated"
          />
        </div>
      </div>
    </el-drawer>

    <!-- 查看笔记全屏层 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="viewDialogVisible" class="note-fullscreen" :style="{ '--note-color': currentNote?.color || '#409EFF' }" @click.self="viewDialogVisible = false">
          <div class="note-fullscreen-content" v-if="currentNote">
            <!-- 关闭按钮 -->
            <div class="detail-close-btn" @click="viewDialogVisible = false">
              <el-icon :size="20"><Close /></el-icon>
            </div>

            <!-- 文章容器 -->
            <div class="article-container">
              <article class="article">
                <!-- 元信息 -->
                <header class="article-header">
                  <div class="article-meta">
                    <span class="article-category" :style="{ color: currentNote.color }">
                      <el-icon><component :is="getCategoryIcon(currentNote.category)" /></el-icon>
                      {{ currentNote.category }}
                    </span>
                    <span class="article-dot">·</span>
                    <span class="article-date">{{ formatFullDate(currentNote.createdAt) }}</span>
                  </div>
                  <h1 class="article-title">{{ currentNote.title }}</h1>
                  <div class="article-tags" v-if="currentNote.tags && currentNote.tags.length">
                    <span v-for="tag in currentNote.tags" :key="tag" class="article-tag">#{{ tag }}</span>
                  </div>
                </header>

                <!-- 文章内容 -->
                <div class="article-body" v-html="currentNote.content"></div>

                <!-- 文章底部装饰 -->
                <div class="article-footer">
                  <div class="footer-line"></div>
                  <div class="footer-icon" :style="{ color: currentNote.color }">
                    <el-icon :size="24"><Notebook /></el-icon>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, shallowRef, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Star, User, ArrowDown, SwitchButton, HomeFilled, Notebook, Search,
  Plus, Edit, Delete, Calendar, Grid, Reading, Briefcase,
  Sunny, More, Check, EditPen, Bell, Setting, Close, Collection
} from '@element-plus/icons-vue'
import { logoutApi } from '@/api/login'
import { getNotesApi, createNoteApi, updateNoteApi, deleteNoteApi } from '@/api/notes'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Boot } from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'

// 注册 Markdown 插件（代码块是内置功能）
Boot.registerModule(markdownModule)

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

// 通知数量
const notificationCount = ref(0)

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

// 富文本编辑器相关
const editorRef = shallowRef()
const editorHeight = ref('500px')

// 工具栏配置
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

// 编辑器配置
const editorConfig = {
  placeholder: '开始写作...',
  MENU_CONF: {
    // 上传图片配置
    uploadImage: {
      customUpload: async (file, insertFn) => {
        // 本地预览模式
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target.result
          insertFn(url, file.name, url)
        }
        reader.readAsDataURL(file)
      }
    },
    // 代码块配置
    codeSelect: {
      codeLangs: [
        { text: 'JavaScript', value: 'javascript' },
        { text: 'TypeScript', value: 'typescript' },
        { text: 'Vue', value: 'vue' },
        { text: 'React', value: 'react' },
        { text: 'HTML', value: 'html' },
        { text: 'CSS', value: 'css' },
        { text: 'Python', value: 'python' },
        { text: 'Java', value: 'java' },
        { text: 'C++', value: 'cpp' },
        { text: 'Go', value: 'go' },
        { text: 'Rust', value: 'rust' },
        { text: 'PHP', value: 'php' },
        { text: 'SQL', value: 'sql' },
        { text: 'Bash', value: 'bash' },
        { text: 'JSON', value: 'json' },
        { text: 'Markdown', value: 'markdown' },
        { text: 'Text', value: 'text' }
      ]
    }
  }
}

// 颜色选项
const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#722ED1', '#13C2C2', '#F5222D']

// 笔记数据列表
const notes = ref([])

// 加载状态
const loading = ref(false)

// ========== 计算属性 ==========

// 过滤后的笔记列表（直接使用后端返回的数据，前端不再过滤）
const filteredNotes = computed(() => notes.value)

// ========== 监听筛选条件变化 ==========
watch([filterCategory, searchKeyword], () => {
  fetchNotes()
})

// ========== 生命周期 ==========

onMounted(() => {
  // 获取用户信息
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }

  // 从接口获取笔记数据
  fetchNotes()
})

// ========== 方法 ==========

// 获取笔记列表
const fetchNotes = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterCategory.value) {
      params.category = filterCategory.value
    }
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }
    const res = await getNotesApi(params)
    notes.value = res.data.list || []
  } catch (error) {
    console.error('获取笔记列表失败:', error)
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  // 销毁编辑器实例
  if (editorRef.value) {
    editorRef.value.destroy()
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

// 格式化完整日期（用于文章头部）
const formatFullDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]

  return `${year}年${month}月${day}日 ${weekday}`
}

// 提取纯文本（用于卡片预览）
const getPlainText = (html) => {
  if (!html) return ''
  // 创建临时 DOM 元素提取纯文本
  const temp = document.createElement('div')
  temp.innerHTML = html

  // 处理块级元素，在它们后面添加换行
  const blockElements = temp.querySelectorAll('p, div, li, h1, h2, h3, h4, h5, h6, br')
  blockElements.forEach(el => {
    if (el.tagName !== 'BR') {
      el.after('\n')
    }
  })

  let text = temp.textContent || temp.innerText || ''
  // 保留换行，只清理多余的连续空格
  text = text.replace(/[ \t]+/g, ' ').replace(/[ \t]*\n[ \t]*/g, '\n').trim()
  return text
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

  // 等待 DOM 更新后设置编辑器内容
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.setHtml(note.content || '')
    }
  })
}

// 查看笔记
const handleViewNote = (note) => {
  currentNote.value = note
  viewDialogVisible.value = true
}

// 编辑器创建完成
const handleCreated = (editor) => {
  editorRef.value = editor
}

// 取消编辑
const handleCancel = () => {
  if (editorRef.value) {
    // 清空编辑器内容
    editorRef.value.clear()
  }
  dialogVisible.value = false
}

// 提交笔记
const handleSubmit = async () => {
  if (!noteForm.title) {
    ElMessage.warning('请填写标题')
    return
  }

  // 获取编辑器的 HTML 内容
  const content = editorRef.value?.getHtml() || ''
  if (!content || content === '<p><br></p>') {
    ElMessage.warning('请填写内容')
    return
  }

  try {
    const data = {
      title: noteForm.title,
      category: noteForm.category,
      color: noteForm.color,
      content: content,
      tags: noteForm.tags
    }

    if (isEdit.value) {
      // 编辑模式 - 调用更新接口
      await updateNoteApi(noteForm.id, data)
      ElMessage.success('保存成功')
    } else {
      // 新建模式 - 调用创建接口
      await createNoteApi(data)
      ElMessage.success('创建成功')
    }

    // 刷新笔记列表
    await fetchNotes()
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error(isEdit.value ? '保存失败' : '创建失败')
  }
}

// 删除笔记
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定要删除这篇笔记吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  try {
    await deleteNoteApi(id)
    ElMessage.success('删除成功')
    // 刷新笔记列表
    await fetchNotes()
  } catch (error) {
    ElMessage.error('删除失败')
  }
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
    case 'settings':
      ElMessage.info('设置功能开发中...')
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
/* ========== 页面基础样式 - 浅色 Apple 风格 ========== */
.notes-page {
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
  opacity: 0.12;
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

/* ========== 导航栏 - Apple 风格 ========== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
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

.action-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 10px;
  background: #f5f5f7;
  border: 1px solid #e5e5ea;
  color: #1d1d1f;
  transition: all 0.25s ease;
}

.action-btn:hover {
  background: #e5e5ea;
  border-color: #d1d1d6;
  color: #0071e3;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.badge-item {
  display: flex;
  align-items: center;
}

.badge-item :deep(.el-badge__content) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

/* 用户下拉区域 */
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 12px;
  background: #f5f5f7;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #e5e5ea;
}

.user-dropdown:hover {
  background: #e5e5ea;
  border-color: #d1d1d6;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 30px;
  position: relative;
  z-index: 1;
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
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.add-btn {
  background: #1d1d1f;
  border: none;
  height: 40px;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.add-btn:hover {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
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
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  color: #6e6e73;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.category-tab:hover {
  background: #f5f5f7;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.category-tab.active {
  background: #1d1d1f;
  border-color: transparent;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
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
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
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
  transition: opacity 0.25s ease;
}

.note-card:hover .note-actions {
  opacity: 1;
}

.note-actions .el-button {
  color: #86868b;
}

.note-actions .el-button:hover {
  color: #0071e3;
}

.note-title {
  font-size: 20px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-content {
  font-size: 14px;
  color: #6e6e73;
  line-height: 1.6;
  margin-bottom: 16px;
  max-height: 88px;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-word;
  position: relative;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.note-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #86868b;
}

.note-tags {
  display: flex;
  gap: 6px;
  align-items: center;
}

.more-tags {
  font-size: 12px;
  color: #86868b;
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
  color: #1d1d1f;
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 14px;
  color: #86868b;
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
  transition: all 0.25s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #1d1d1f;
}

.color-option .el-icon {
  color: #fff;
  font-size: 20px;
}

/* ========== 笔记详情 ========== */
.note-detail {
  padding: 10px;
}

/* ========== 富文本编辑器样式 ========== */
.note-editor-drawer :deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 0;
}

.note-editor-drawer :deep(.el-drawer__body) {
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

.note-editor-container {
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

.color-picker-inline {
  display: flex;
  gap: 6px;
  align-items: center;
}

.color-option-inline {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border: 2px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.color-option-inline:hover {
  transform: scale(1.1);
}

.color-option-inline.active {
  border-color: #0071e3;
}

.color-option-inline .el-icon {
  color: #fff;
  font-size: 18px;
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

/* 代码块高亮样式 */
.editor-content :deep(pre) {
  background: #f5f5f7;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  overflow-x: auto;
  border: 1px solid #e5e5ea;
}

.editor-content :deep(code) {
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.6;
}

/* Markdown 内容预览样式 */
.detail-content {
  font-size: 16px;
  line-height: 1.8;
  color: #1d1d1f;
  margin-bottom: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid #e5e5ea;
}

.detail-content :deep(h1) {
  font-size: 28px;
  font-weight: 700;
  margin: 20px 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e5ea;
}

.detail-content :deep(h2) {
  font-size: 24px;
  font-weight: 600;
  margin: 18px 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e5ea;
}

.detail-content :deep(h3) {
  font-size: 20px;
  font-weight: 600;
  margin: 16px 0 8px;
}

.detail-content :deep(p) {
  margin: 12px 0;
}

.detail-content :deep(code) {
  background: #f0f0f5;
  padding: 3px 8px;
  border-radius: 6px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  font-size: 14px;
  color: #d73a49;
  border: 1px solid #e5e5ea;
}

.detail-content :deep(pre) {
  background: #1d1d1f;
  color: #f5f5f7;
  padding: 16px;
  border-radius: 10px;
  overflow-x: auto;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.detail-content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
}

.detail-content :deep(ul),
.detail-content :deep(ol) {
  padding-left: 24px;
  margin: 12px 0;
}

.detail-content :deep(li) {
  margin: 6px 0;
}

.detail-content :deep(blockquote) {
  border-left: 4px solid #409EFF;
  padding: 12px 16px;
  margin: 12px 0;
  color: #6e6e73;
  background: #f5f5f7;
  border-radius: 0 8px 8px 0;
  border: 1px solid #e5e5ea;
  border-left: 4px solid #409EFF;
}

.detail-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e5ea;
}

.detail-content :deep(th),
.detail-content :deep(td) {
  border: 1px solid #e5e5ea;
  padding: 10px 14px;
  text-align: left;
}

.detail-content :deep(th) {
  background: #f5f5f7;
  font-weight: 600;
}

.detail-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.detail-content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e5ea;
  margin: 20px 0;
}

/* ========== 笔记详情 - Medium/Notion 风格 ========== */
.note-fullscreen {
  --note-color: #409EFF;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.note-fullscreen-content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
}

/* 关闭按钮 */
.detail-close-btn {
  position: fixed;
  top: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e5e5ea;
  border-radius: 50%;
  cursor: pointer;
  z-index: 100;
  transition: all 0.25s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.detail-close-btn:hover {
  background: #f5f5f7;
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* 文章容器 - Medium 风格 */
.article-container {
  flex: 1;
  overflow-y: auto;
  padding: 60px 0 100px;
  scroll-behavior: smooth;
}

.article-container::-webkit-scrollbar {
  width: 6px;
}

.article-container::-webkit-scrollbar-track {
  background: transparent;
}

.article-container::-webkit-scrollbar-thumb {
  background: #e5e5ea;
  border-radius: 3px;
}

.article-container::-webkit-scrollbar-thumb:hover {
  background: #d1d1d6;
}

.article {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 40px;
}

/* 文章头部 */
.article-header {
  margin-bottom: 56px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.article-category {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.article-category .el-icon {
  font-size: 16px;
}

.article-dot {
  color: #c7c7cc;
  font-weight: 500;
}

.article-date {
  color: #86868b;
  font-weight: 500;
}

.article-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.04em;
  color: #1d1d1f;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
}

.article-tags {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.article-tag {
  font-size: 14px;
  color: #86868b;
  font-weight: 500;
  transition: color 0.2s ease;
}

.article-tag:hover {
  color: var(--note-color);
}

/* 文章内容 - Notion 风格排版 */
.article-body {
  font-size: 18px;
  line-height: 1.9;
  color: #37352f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
  letter-spacing: -0.003em;
}

/* 标题样式 */
.article-body :deep(h1) {
  font-size: 38px;
  font-weight: 700;
  margin: 56px 0 20px;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: #1d1d1f;
}

.article-body :deep(h2) {
  font-size: 30px;
  font-weight: 700;
  margin: 48px 0 16px;
  letter-spacing: -0.025em;
  line-height: 1.25;
  color: #1d1d1f;
}

.article-body :deep(h3) {
  font-size: 24px;
  font-weight: 600;
  margin: 36px 0 14px;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: #1d1d1f;
}

.article-body :deep(h4) {
  font-size: 20px;
  font-weight: 600;
  margin: 28px 0 12px;
  letter-spacing: -0.015em;
  line-height: 1.35;
  color: #1d1d1f;
}

/* 段落 */
.article-body :deep(p) {
  margin: 20px 0;
  line-height: 1.9;
  color: #37352f;
}

.article-body :deep(p:first-of-type) {
  font-size: 22px;
  line-height: 1.6;
  color: #5a5a5a;
  font-weight: 400;
}

/* 行内代码 */
.article-body :deep(code) {
  background: rgba(135, 131, 120, 0.15);
  color: #eb5757;
  padding: 3px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Cascadia Code', monospace;
  font-size: 85%;
  font-weight: 500;
}

/* 代码块 */
.article-body :deep(pre) {
  background: #1d1d1f;
  color: #f5f5f7;
  padding: 18px 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 24px 0;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.article-body :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: inherit;
  font-weight: 400;
}

/* 列表 */
.article-body :deep(ul),
.article-body :deep(ol) {
  padding-left: 24px;
  margin: 20px 0;
}

.article-body :deep(li) {
  margin: 8px 0;
  line-height: 1.8;
  color: #37352f;
}

.article-body :deep(li::marker) {
  color: var(--note-color);
}

/* 引用块 */
.article-body :deep(blockquote) {
  border-left: 3px solid var(--note-color);
  padding: 16px 0 16px 20px;
  margin: 28px 0;
  color: #6e6e73;
  font-style: italic;
  background: linear-gradient(to right, rgba(135, 131, 120, 0.08), transparent);
}

/* 表格 */
.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 28px 0;
  font-size: 16px;
}

.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid #e5e5ea;
  padding: 12px 14px;
  text-align: left;
}

.article-body :deep(th) {
  background: #f5f5f7;
  font-weight: 600;
  color: #1d1d1f;
}

.article-body :deep(td) {
  color: #37352f;
}

.article-body :deep(tr:hover td) {
  background: #f9f9f9;
}

/* 图片 */
.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 32px 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* 分割线 */
.article-body :deep(hr) {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e5ea, transparent);
  margin: 48px 0;
}

/* 链接 */
.article-body :deep(a) {
  color: var(--note-color);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.article-body :deep(a:hover) {
  border-bottom-color: var(--note-color);
}

/* 待办事项 */
.article-body :deep(input[type="checkbox"]) {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  accent-color: var(--note-color);
}

/* 文章底部装饰 */
.article-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  padding-top: 40px;
}

.footer-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--note-color), transparent);
  margin-bottom: 20px;
}

.footer-icon {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.footer-icon:hover {
  opacity: 1;
}

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
  }

  .notes-grid {
    grid-template-columns: 1fr;
  }

  .category-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* 笔记详情全屏响应式 */
  .article {
    padding: 0 24px;
  }

  .article-title {
    font-size: 36px;
  }

  .article-body {
    font-size: 17px;
  }

  .article-body :deep(h1) {
    font-size: 30px;
  }

  .article-body :deep(h2) {
    font-size: 24px;
  }

  .article-body :deep(h3) {
    font-size: 20px;
  }

  .detail-close-btn {
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
  }
}

/* ========== 下拉菜单样式覆盖 ========== */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-select) {
  --el-select-bg-color: #f5f5f7;
  --el-select-border-color: #e5e5ea;
  --el-select-input-color: #1d1d1f;
}
</style>
