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

    <!-- 全屏编辑弹窗 -->
    <el-drawer
      v-model="dialogVisible"
      :title="isEdit ? '编辑笔记' : '新建笔记'"
      direction="btt"
      :size="'95%'"
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
            <!-- 装饰背景 -->
            <div class="detail-bg-decoration"></div>

            <!-- 顶部导航 -->
            <div class="detail-navbar">
              <div class="navbar-left">
                <div class="detail-category">
                  <el-icon><component :is="getCategoryIcon(currentNote.category)" /></el-icon>
                  <span>{{ currentNote.category }}</span>
                </div>
                <span class="detail-date">{{ formatDate(currentNote.createdAt) }}</span>
              </div>
              <div class="navbar-right">
                <el-icon class="close-icon" @click="viewDialogVisible = false">
                  <Close />
                </el-icon>
              </div>
            </div>

            <!-- 内容滚动区域 -->
            <div class="detail-scroll-area">
              <!-- 标题 -->
              <h1 class="note-title-view">{{ currentNote.title }}</h1>

              <!-- 正文内容 -->
              <div class="detail-content" v-html="currentNote.content"></div>

              <!-- 标签 -->
              <div class="detail-tags-wrapper" v-if="currentNote.tags && currentNote.tags.length">
                <div class="detail-tags">
                  <span v-for="tag in currentNote.tags" :key="tag" class="tag-item">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Star, User, ArrowDown, SwitchButton, HomeFilled, Notebook, Search,
  Plus, Edit, Delete, Calendar, Grid, Reading, Briefcase,
  Sunny, More, Check, EditPen, Bell, Setting, Close
} from '@element-plus/icons-vue'
import { logoutApi } from '@/api/login'
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
    'fontFamily',
    'lineHeight',
    'color',
    'bgColor',
    '|',
    'link',
    'uploadImage',
    'insertTable',
    'codeBlock',
    'divider',
    '|',
    'undo',
    'redo',
    'fullScreen'
  ]
}

// 编辑器配置
const editorConfig = {
  placeholder: '开始写作...支持 Markdown 语法',
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
        { text: 'C#', value: 'csharp' },
        { text: 'Go', value: 'go' },
        { text: 'Rust', value: 'rust' },
        { text: 'PHP', value: 'php' },
        { text: 'SQL', value: 'sql' },
        { text: 'Bash', value: 'bash' },
        { text: 'JSON', value: 'json' },
        { text: 'Markdown', value: 'markdown' },
        { text: 'YAML', value: 'yaml' },
        { text: 'Text', value: 'text' }
      ]
    }
  }
}

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
    const plainContent = getPlainText(note.content)
    const matchSearch = !searchKeyword.value ||
      note.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      plainContent.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
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
const handleSubmit = () => {
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

  if (isEdit.value) {
    // 编辑模式
    const index = notes.value.findIndex(n => n.id === noteForm.id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        title: noteForm.title,
        category: noteForm.category,
        color: noteForm.color,
        content: content,
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
      content: content,
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
  background: rgba(15, 12, 41, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
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
  transition: all 0.3s;
  padding: 6px 12px;
  border-radius: 10px;
}

.brand:hover {
  background: rgba(255, 255, 255, 0.1);
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
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
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
  color: rgba(255, 255, 255, 0.5);
  z-index: 1;
}

.global-search .search-input {
  width: 100%;
}

.global-search :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding-left: 42px;
  box-shadow: none;
  transition: all 0.3s;
}

.global-search :deep(.el-input__wrapper:hover),
.global-search :deep(.el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.global-search :deep(.el-input__inner) {
  color: #fff;
  font-size: 14px;
}

.global-search :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

.global-search :deep(.el-input__clear) {
  color: rgba(255, 255, 255, 0.5);
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
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.badge-item {
  display: flex;
  align-items: center;
}

.badge-item :deep(.el-badge__content) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.4);
}

/* 用户下拉区域 */
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-dropdown:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  color: rgba(255, 255, 255, 0.6);
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
  color: #fff;
  margin: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
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
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  gap: 12px;
}

.note-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7fa;
}

.editor-header {
  padding: 20px 24px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
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
  font-weight: bold;
  color: #303133;
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
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.color-option-inline:hover {
  transform: scale(1.1);
}

.color-option-inline.active {
  border-color: #409EFF;
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
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.editor-toolbar {
  border-bottom: 1px solid #e4e7ed;
  background: #fafafa;
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
  color: #999;
  font-style: normal;
}

/* 代码块高亮样式 */
.editor-content :deep(pre) {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  overflow-x: auto;
}

.editor-content :deep(code) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
}

/* Markdown 内容预览样式 */
.detail-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
  overflow-x: auto;
}

.detail-content :deep(h1) {
  font-size: 28px;
  font-weight: 700;
  margin: 20px 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #eee;
}

.detail-content :deep(h2) {
  font-size: 24px;
  font-weight: 600;
  margin: 18px 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
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
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: #e83e8c;
}

.detail-content :deep(pre) {
  background: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
}

.detail-content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
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
  padding-left: 16px;
  margin: 12px 0;
  color: #666;
  background: #f9f9f9;
  padding: 12px 16px;
  border-radius: 4px;
}

.detail-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.detail-content :deep(th),
.detail-content :deep(td) {
  border: 1px solid #ddd;
  padding: 10px 14px;
  text-align: left;
}

.detail-content :deep(th) {
  background: #f5f7fa;
  font-weight: 600;
}

.detail-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 12px 0;
}

.detail-content :deep(hr) {
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
}

/* ========== 笔记详情 - 全屏浅色风格 ========== */
/* 全屏容器 */
.note-fullscreen {
  --note-color: #409EFF;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #f0f0f5;
  background-image:
    linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  display: flex;
  flex-direction: column;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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
}

/* 装饰背景 */
.detail-bg-decoration {
  position: absolute;
  top: -150px;
  right: -150px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--note-color) 0%, transparent 70%);
  opacity: 0.06;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(100px);
}

.detail-bg-decoration::before {
  content: '';
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--note-color) 0%, transparent 70%);
  opacity: 0.04;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}

/* 顶部导航栏 */
.detail-navbar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  background: #fff;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
  z-index: 10;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.detail-category {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  background: var(--note-color);
  color: #fff;
  box-shadow: 0 2px 12px var(--note-color);
}

.detail-category .el-icon {
  font-size: 16px;
}

.detail-date {
  color: #86868b;
  font-size: 14px;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.close-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  color: #86868b;
  font-size: 22px;
  transition: all 0.3s ease;
  background: #f5f5f7;
  border: 2px solid #e5e5ea;
}

.close-icon:hover {
  background: #e5e5ea;
  border-color: #d1d1d6;
  color: #1d1d1f;
  transform: rotate(90deg) scale(1.05);
}

/* 内容滚动区域 */
.detail-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 50px 100px 80px;
  position: relative;
  background: #fff;
  margin: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

/* 左侧装饰线 */
.detail-scroll-area::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--note-color) 0%, transparent 100%);
  border-radius: 2px;
  opacity: 0.6;
}

/* 滚动条样式 */
.detail-scroll-area::-webkit-scrollbar {
  width: 8px;
}

.detail-scroll-area::-webkit-scrollbar-track {
  background: #f5f5f7;
  border-radius: 4px;
}

.detail-scroll-area::-webkit-scrollbar-thumb {
  background: #c7c7cc;
  border-radius: 4px;
}

.detail-scroll-area::-webkit-scrollbar-thumb:hover {
  background: #a1a1a6;
}

/* 标题 */
.note-title-view {
  font-size: 46px;
  font-weight: 700;
  color: #1d1d1f;
  text-align: left;
  margin: 0 0 40px;
  padding-left: 20px;
  line-height: 1.2;
  letter-spacing: -0.04em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
  border-left: 4px solid var(--note-color);
}

/* 内容区域 */
.detail-content {
  font-size: 17px;
  line-height: 1.85;
  color: #1d1d1f;
  margin-bottom: 50px;
  padding-left: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
  letter-spacing: -0.005em;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
}

/* 内容样式 */
.detail-content :deep(h1) {
  font-size: 36px;
  font-weight: 700;
  margin: 44px 0 22px;
  color: #1d1d1f;
  letter-spacing: -0.02em;
  line-height: 1.2;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
}

.detail-content :deep(h2) {
  font-size: 28px;
  font-weight: 600;
  margin: 36px 0 18px;
  color: #1d1d1f;
  letter-spacing: -0.015em;
  line-height: 1.3;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.detail-content :deep(h3) {
  font-size: 24px;
  font-weight: 600;
  margin: 28px 0 14px;
  color: #1d1d1f;
  letter-spacing: -0.01em;
  line-height: 1.35;
}

.detail-content :deep(p) {
  margin: 16px 0;
  line-height: 1.85;
  color: #1d1d1f;
}

.detail-content :deep(code) {
  background: #f0f0f5;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Cascadia Code', monospace;
  font-size: 14px;
  color: #d73a49;
  border: 1px solid #e5e5ea;
}

.detail-content :deep(pre) {
  background: #1d1d1f;
  color: #f5f5f7;
  padding: 20px 24px;
  border-radius: 10px;
  overflow-x: auto;
  margin: 24px 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.detail-content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: 14px;
  border: none;
}

.detail-content :deep(ul),
.detail-content :deep(ol) {
  padding-left: 24px;
  margin: 16px 0;
}

.detail-content :deep(li) {
  margin: 10px 0;
  line-height: 1.85;
  color: #1d1d1f;
}

.detail-content :deep(blockquote) {
  border-left: 4px solid var(--note-color);
  padding: 16px 20px;
  margin: 24px 0;
  color: #6e6e73;
  background: #f5f5f7;
  border-radius: 0 8px 8px 0;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.detail-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.detail-content :deep(th),
.detail-content :deep(td) {
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 12px 16px;
  text-align: left;
}

.detail-content :deep(th) {
  background: #f5f5f7;
  font-weight: 600;
  color: #1d1d1f;
  font-size: 14px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.detail-content :deep(td) {
  background: #fff;
  color: #1d1d1f;
}

.detail-content :deep(img) {
  max-width: 100%;
  border-radius: 12px;
  margin: 24px 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.detail-content :deep(hr) {
  border: none;
  border-top: 2px solid rgba(0, 0, 0, 0.08);
  margin: 36px 0;
}

.detail-content :deep(a) {
  color: var(--note-color);
  text-decoration: none;
  transition: all 0.2s;
  border-bottom: 1px solid transparent;
}

.detail-content :deep(a:hover) {
  color: #0077ed;
  border-bottom-color: var(--note-color);
}

/* 标签区域 */
.detail-tags-wrapper {
  display: flex;
  justify-content: flex-start;
  padding: 28px 20px 0;
  margin-left: 20px;
  border-top: 2px solid rgba(0, 0, 0, 0.08);
}

.detail-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tag-item {
  display: inline-block;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: all 0.3s;
  background: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #e5e5ea;
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #e5e5ea;
  border-color: #d1d1d6;
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
  .detail-navbar {
    padding: 16px 20px;
  }

  .detail-scroll-area {
    padding: 40px 24px 60px;
  }

  .note-title-view {
    font-size: 32px;
    margin-bottom: 24px;
  }

  .detail-content {
    font-size: 16px;
  }

  .detail-content :deep(h1) {
    font-size: 28px;
  }

  .detail-content :deep(h2) {
    font-size: 24px;
  }

  .detail-content :deep(h3) {
    font-size: 20px;
  }

  .detail-bg-decoration {
    top: -80px;
    right: -80px;
    width: 250px;
    height: 250px;
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
