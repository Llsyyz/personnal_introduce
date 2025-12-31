<!--
  Chat.vue - AI 聊天页面
  创新会话管理 · 沉浸式对话体验
-->

<template>
  <div class="chat-page">
    <!-- 动态背景装饰 -->
    <div class="animated-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
    </div>

    <!-- 顶部导航栏 - 与主页一致 -->
    <div class="navbar">
      <div class="navbar-content">
        <!-- 左侧品牌区域 -->
        <div class="nav-left">
          <div class="brand" @click="router.push('/home')">
            <div class="brand-icon">
              <el-icon :size="22"><Star /></el-icon>
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
              placeholder="搜索对话..."
              class="search-input"
              clearable
            />
          </div>
        </div>

        <!-- 右侧操作区域 -->
        <div class="nav-right">
          <!-- 快速操作按钮组 -->
          <div class="quick-actions">
            <el-tooltip content="AI 助手" placement="bottom">
              <el-button class="action-btn active">
                <el-icon :size="18"><ChatDotRound /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="热点资讯" placement="bottom">
              <el-button class="action-btn" @click="router.push('/news')">
                <el-icon :size="18"><Reading /></el-icon>
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
                <el-dropdown-item command="chat">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>AI 助手</span>
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

    <!-- 主内容区域 -->
    <div class="main-container">
      <!-- 左侧会话面板 - 创新设计 -->
      <div class="chat-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <!-- 侧边栏头部 -->
        <div class="sidebar-header">
          <div class="header-title" v-show="!sidebarCollapsed">
            <h3>对话</h3>
            <span class="chat-count">{{ filteredChats.length }}</span>
          </div>
          <div class="header-actions">
            <el-tooltip :content="sidebarCollapsed ? '展开' : '收起'" placement="right">
              <el-button class="icon-btn" @click="toggleSidebar" circle size="small">
                <el-icon><ArrowLeft v-if="!sidebarCollapsed" /><ArrowRight v-else /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>

        <!-- 新建对话按钮 -->
        <div class="new-chat-section" v-show="!sidebarCollapsed">
          <el-button class="new-chat-btn" @click="createNewChat">
            <el-icon><Plus /></el-icon>
            <span>新建对话</span>
          </el-button>
        </div>

        <!-- 会话列表 -->
        <div class="chats-container">
          <!-- 置顶对话 -->
          <div v-if="pinnedChats.length > 0" v-show="!sidebarCollapsed" class="chat-group">
            <div class="group-header">
              <el-icon><Star /></el-icon>
              <span>置顶</span>
            </div>
            <div class="chat-list">
              <div
                v-for="chat in pinnedChats"
                :key="chat.id"
                class="chat-item"
                :class="{ active: currentChatId === chat.id }"
                @click="switchChat(chat.id)"
              >
                <div class="chat-icon">
                  <el-icon><ChatDotRound /></el-icon>
                </div>
                <div class="chat-info">
                  <div class="chat-title">{{ chat.title || '新对话' }}</div>
                  <div class="chat-preview">{{ getPreview(chat) }}</div>
                </div>
                <div class="chat-actions">
                  <el-dropdown trigger="click" @command="(cmd) => handleChatAction(cmd, chat)">
                    <el-icon class="more-icon"><MoreFilled /></el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="unpin">
                          <el-icon><StarFilled /></el-icon>
                          <span>取消置顶</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="rename">
                          <el-icon><Edit /></el-icon>
                          <span>重命名</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="delete" divided>
                          <el-icon><Delete /></el-icon>
                          <span>删除</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>

          <!-- 最近对话 -->
          <div v-if="recentChats.length > 0" v-show="!sidebarCollapsed" class="chat-group">
            <div class="group-header">
              <el-icon><Clock /></el-icon>
              <span>最近</span>
            </div>
            <div class="chat-list">
              <div
                v-for="chat in recentChats"
                :key="chat.id"
                class="chat-item"
                :class="{ active: currentChatId === chat.id }"
                @click="switchChat(chat.id)"
              >
                <div class="chat-icon">
                  <el-icon><ChatDotRound /></el-icon>
                </div>
                <div class="chat-info">
                  <div class="chat-title">{{ chat.title || '新对话' }}</div>
                  <div class="chat-preview">{{ getPreview(chat) }}</div>
                </div>
                <div class="chat-actions">
                  <el-dropdown trigger="click" @command="(cmd) => handleChatAction(cmd, chat)">
                    <el-icon class="more-icon"><MoreFilled /></el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="pin">
                          <el-icon><Star /></el-icon>
                          <span>置顶</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="rename">
                          <el-icon><Edit /></el-icon>
                          <span>重命名</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="delete" divided>
                          <el-icon><Delete /></el-icon>
                          <span>删除</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredChats.length === 0" v-show="!sidebarCollapsed" class="empty-state">
            <div class="empty-icon">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <p>暂无对话</p>
            <p class="empty-hint">点击"新建对话"开始聊天</p>
          </div>
        </div>

        <!-- 侧边栏底部 -->
        <div class="sidebar-footer" v-show="!sidebarCollapsed">
          <div class="footer-info">
            <span>{{ messages.length }} 条消息</span>
          </div>
        </div>
      </div>

      <!-- 右侧对话区域 -->
      <div class="chat-area">
        <!-- 对话头部 -->
        <div class="chat-header" v-if="currentChatId || messages.length > 0">
          <div class="chat-status">
            <div class="status-dot"></div>
            <span class="status-text">{{ currentChatTitle }}</span>
          </div>
          <div class="header-actions">
            <el-tooltip content="清空对话" placement="bottom">
              <el-button class="header-action-btn" @click="clearCurrentChat" circle size="small">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>

        <!-- 消息和输入一体化区域 -->
        <div class="chat-scroll-area" ref="messagesRef">
          <div class="messages-content">
            <div
              v-for="(message, index) in messages"
              :key="index"
              class="message-item"
              :class="message.role"
            >
              <!-- 用户消息 -->
              <div v-if="message.role === 'user'" class="message-user">
                <div class="user-avatar">
                  {{ (userInfo.nickname || 'U').charAt(0).toUpperCase() }}
                </div>
                <div class="message-bubble user">
                  {{ message.content }}
                </div>
              </div>

              <!-- AI 消息 -->
              <div v-else class="message-ai">
                <div class="ai-avatar">
                  <el-icon><Star /></el-icon>
                </div>
                <div class="message-bubble ai">
                  <div v-if="message.loading" class="typing-indicator">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                  </div>
                  <div v-else class="message-text" v-html="renderMarkdown(message.content)"></div>
                </div>
              </div>
            </div>

            <!-- 欢迎界面 -->
            <div v-if="messages.length === 0" class="welcome-screen">
              <div class="welcome-avatar">
                <el-icon><Star /></el-icon>
              </div>
              <h1 class="welcome-title">你好，我是 AI 助手</h1>
              <p class="welcome-subtitle">有什么可以帮助你的吗？</p>
              <div class="quick-prompts">
                <div class="prompt-card" @click="setInput('帮我写一篇文章')">
                  <div class="prompt-icon">
                    <el-icon><EditPen /></el-icon>
                  </div>
                  <div class="prompt-content">
                    <div class="prompt-title">写文章</div>
                    <div class="prompt-desc">帮我创作内容</div>
                  </div>
                </div>
                <div class="prompt-card" @click="setInput('解释机器学习原理')">
                  <div class="prompt-icon">
                    <el-icon><QuestionFilled /></el-icon>
                  </div>
                  <div class="prompt-content">
                    <div class="prompt-title">机器学习</div>
                    <div class="prompt-desc">解释技术概念</div>
                  </div>
                </div>
                <div class="prompt-card" @click="setInput('给我一些编程建议')">
                  <div class="prompt-icon">
                    <el-icon><Document /></el-icon>
                  </div>
                  <div class="prompt-content">
                    <div class="prompt-title">编程建议</div>
                    <div class="prompt-desc">代码相关问题</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 输入区域 - 与消息一体化 -->
            <div class="input-area-integrated">
              <div class="input-container">
                <el-input
                  ref="inputRef"
                  v-model="inputMessage"
                  type="textarea"
                  :rows="1"
                  :autosize="{ minRows: 1, maxRows: 8 }"
                  placeholder="输入你的问题..."
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.prevent
                  :disabled="isLoading"
                  class="chat-input"
                />
                <el-button
                  class="send-btn"
                  :loading="isLoading"
                  :disabled="!inputMessage.trim()"
                  @click="sendMessage"
                >
                  <el-icon v-if="!isLoading"><Promotion /></el-icon>
                </el-button>
              </div>
              <div class="input-footer">
                <span class="footer-hint">Enter 发送 · Shift + Enter 换行</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Star, User, ArrowDown, ArrowLeft, ArrowRight, SwitchButton, ChatDotRound, Reading,
  Notebook, Collection, Search, Plus, MoreFilled, Edit, Delete, Clock, EditPen,
  QuestionFilled, Document, Promotion, HomeFilled, StarFilled
} from '@element-plus/icons-vue'
import { logoutApi } from '@/api/login'
import {
  chatApi, getChatHistoryApi, getChatDetailApi,
  createChatApi, deleteChatApi, clearChatApi
} from '@/api/chat'

const router = useRouter()

// 状态管理
const sidebarCollapsed = ref(false)
const chatList = ref([])
const currentChatId = ref(null)
const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const messagesRef = ref(null)
const inputRef = ref(null)
const searchKeyword = ref('')

const userInfo = ref({
  username: 'admin',
  nickname: '管理员',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 过滤后的对话列表
const filteredChats = computed(() => {
  if (!searchKeyword.value) return chatList.value
  return chatList.value.filter(chat =>
    (chat.title || '新对话').toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 置顶对话
const pinnedChats = computed(() => {
  return filteredChats.value.filter(chat => chat.pinned)
})

// 最近对话
const recentChats = computed(() => {
  return filteredChats.value.filter(chat => !chat.pinned)
})

// 当前会话标题
const currentChatTitle = computed(() => {
  const current = chatList.value.find(c => c.id === currentChatId.value)
  return current?.title || '新对话'
})

// 获取对话预览
const getPreview = (chat) => {
  const lastMsg = chat.messages?.[chat.messages.length - 1]
  if (!lastMsg) return '暂无消息'
  const content = lastMsg.content || ''
  return content.length > 20 ? content.slice(0, 20) + '...' : content
}

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTo({
      top: messagesRef.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

// 创建新对话
const createNewChat = async () => {
  const newChat = {
    id: Date.now(),
    title: '新对话',
    messages: [],
    pinned: false,
    createdAt: new Date().toISOString()
  }
  try {
    const response = await createChatApi('新对话')
    newChat.id = response.data.id || newChat.id
  } catch (err) {}
  chatList.value.unshift(newChat)
  currentChatId.value = newChat.id
  messages.value = []
  saveToLocal()
  await nextTick()
  inputRef.value?.focus()
}

// 切换对话
const switchChat = async (chatId) => {
  if (chatId === currentChatId.value) return
  currentChatId.value = chatId
  const chat = chatList.value.find(c => c.id === chatId)
  if (chat) {
    try {
      const response = await getChatDetailApi(chatId)
      messages.value = response.data.messages || []
    } catch (err) {
      messages.value = chat.messages || []
    }
    await scrollToBottom()
  }
}

// 重命名对话
const renameChat = async (chat) => {
  try {
    const { value } = await ElMessageBox.prompt('新标题', '重命名', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: chat.title,
      inputPattern: /\S+/,
      inputErrorMessage: '标题不能为空'
    })
    const index = chatList.value.findIndex(c => c.id === chat.id)
    if (index !== -1) {
      chatList.value[index].title = value
      saveToLocal()
      ElMessage.success('重命名成功')
    }
  } catch {}
}

// 删除对话
const deleteChat = async (chat) => {
  try {
    await ElMessageBox.confirm('确定删除这个对话吗？', '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const index = chatList.value.findIndex(c => c.id === chat.id)
    if (index !== -1) {
      try { await deleteChatApi(chat.id) } catch (err) {}
      chatList.value.splice(index, 1)
      if (chat.id === currentChatId.value) {
        if (chatList.value.length > 0) {
          switchChat(chatList.value[0].id)
        } else {
          currentChatId.value = null
          messages.value = []
        }
      }
      saveToLocal()
      ElMessage.success('删除成功')
    }
  } catch {}
}

// 清空当前对话
const clearCurrentChat = async () => {
  if (!currentChatId.value) {
    messages.value = []
    return
  }
  try {
    await ElMessageBox.confirm('确定清空当前对话的所有消息吗？', '提示', {
      confirmButtonText: '清空',
      cancelButtonText: '取消',
      type: 'warning'
    })
    messages.value = []
    try { await clearChatApi(currentChatId.value) } catch (err) {}
    const chat = chatList.value.find(c => c.id === currentChatId.value)
    if (chat) {
      chat.messages = []
      saveToLocal()
    }
    ElMessage.success('已清空')
  } catch {}
}

// 处理对话操作
const handleChatAction = (command, chat) => {
  switch (command) {
    case 'pin':
      chat.pinned = true
      saveToLocal()
      ElMessage.success('已置顶')
      break
    case 'unpin':
      chat.pinned = false
      saveToLocal()
      ElMessage.success('已取消置顶')
      break
    case 'rename':
      renameChat(chat)
      break
    case 'delete':
      deleteChat(chat)
      break
  }
}

// 发送消息
const sendMessage = async () => {
  const content = inputMessage.value.trim()
  if (!content || isLoading.value) return
  if (!currentChatId.value) await createNewChat()

  messages.value.push({ role: 'user', content })
  inputMessage.value = ''
  await scrollToBottom()

  const loadingMsg = { role: 'assistant', content: '', loading: true }
  messages.value.push(loadingMsg)
  isLoading.value = true

  try {
    const history = messages.value
      .filter(m => !m.loading)
      .map(m => ({ role: m.role, content: m.content }))
      .slice(0, -1)
    const response = await chatApi(content, history)
    messages.value[messages.value.length - 1] = {
      role: 'assistant',
      content: response.data.reply || response.data.content || ''
    }
    const chat = chatList.value.find(c => c.id === currentChatId.value)
    if (chat && chat.title === '新对话') {
      chat.title = content.slice(0, 20) + (content.length > 20 ? '...' : '')
    }
  } catch (error) {
    messages.value[messages.value.length - 1] = {
      role: 'assistant',
      content: '抱歉，我遇到了一些问题。请稍后再试。'
    }
  } finally {
    isLoading.value = false
    await scrollToBottom()
    saveCurrentMessages()
    await nextTick()
    inputRef.value?.focus()
  }
}

// 设置输入
const setInput = (text) => {
  inputMessage.value = text
  inputRef.value?.focus()
}

// 渲染 Markdown
const renderMarkdown = (text) => {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

// 保存到本地
const saveToLocal = () => {
  localStorage.setItem('chatList', JSON.stringify(chatList.value))
  localStorage.setItem('currentChatId', currentChatId.value?.toString() || '')
}

// 保存当前消息
const saveCurrentMessages = () => {
  const chat = chatList.value.find(c => c.id === currentChatId.value)
  if (chat) {
    chat.messages = [...messages.value]
    saveToLocal()
  }
}

// 加载对话列表
const loadChatList = async () => {
  const saved = localStorage.getItem('chatList')
  if (saved) {
    try { chatList.value = JSON.parse(saved) } catch (e) { chatList.value = [] }
  }
  try {
    const response = await getChatHistoryApi()
    if (response.data?.list) {
      chatList.value = response.data.list
      saveToLocal()
    }
  } catch (err) {}
  const savedCurrentId = localStorage.getItem('currentChatId')
  if (savedCurrentId) {
    const id = parseInt(savedCurrentId)
    const exists = chatList.value.find(c => c.id === id)
    if (exists) {
      currentChatId.value = id
      await switchChat(id)
    } else if (chatList.value.length > 0) {
      currentChatId.value = chatList.value[0].id
    }
  } else if (chatList.value.length > 0) {
    currentChatId.value = chatList.value[0].id
  }
}

// 处理命令
const handleCommand = (command) => {
  if (command === 'home') {
    router.push('/home')
  } else if (command === 'logout') {
    logoutApi().then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      ElMessage.success('退出成功')
      router.push('/login')
    })
  }
}

onMounted(async () => {
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }
  await loadChatList()
})
</script>

<style scoped>
/* ========== 全局样式 ========== */
.chat-page {
  min-height: 100vh;
  background: #f5f5f7;
  position: relative;
  overflow: hidden;
}

/* ========== 动态背景 ========== */
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
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  top: -100px;
  right: -100px;
}

.shape-2 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  bottom: -80px;
  left: -80px;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.05); }
}

/* ========== 导航栏样式 - 与主页一致 ========== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px) saturate(180%);
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
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.01em;
}

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

.action-btn.active {
  background: #0071e3;
  border-color: #0071e3;
  color: #fff;
}

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
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
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

/* ========== 主容器 ========== */
.main-container {
  display: flex;
  max-width: 1600px;
  margin: 0 auto;
  height: calc(100vh - 64px);
  position: relative;
  z-index: 1;
}

/* ========== 左侧会话侧边栏 ========== */
.chat-sidebar {
  width: 260px;
  background: #fff;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.chat-sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}

.chat-count {
  padding: 4px 10px;
  background: #f5f5f7;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #86868b;
}

.icon-btn {
  width: 32px;
  height: 32px;
  background: #f5f5f7;
  border: 1px solid #e5e5ea;
  color: #6e6e73;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: #e5e5ea;
  color: #1d1d1f;
}

/* 新建对话按钮 */
.new-chat-section {
  padding: 12px 16px;
}

.new-chat-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #1d1d1f 0%, #000 100%);
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.new-chat-btn:hover {
  background: linear-gradient(135deg, #2d2d2f 0%, #1a1a1a 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
}

.new-chat-btn:active {
  transform: translateY(0);
}

/* 对话列表 */
.chats-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.chats-container::-webkit-scrollbar {
  width: 4px;
}

.chats-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.chat-group {
  margin-bottom: 20px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 8px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.chat-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: #0071e3;
  border-radius: 0 2px 2px 0;
  transition: height 0.2s ease;
}

.chat-item.active::before {
  height: 28px;
}

.chat-item:hover {
  background: #f5f5f7;
}

.chat-item.active {
  background: linear-gradient(135deg, rgba(0, 113, 227, 0.08) 0%, rgba(0, 113, 227, 0.04) 100%);
}

.chat-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #f5f5f7 0%, #e5e5ea 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6e6e73;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.chat-item.active .chat-icon {
  background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%);
  color: #fff;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-title {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-preview {
  font-size: 12px;
  color: #86868b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-item:hover .chat-actions {
  opacity: 1;
}

.more-icon {
  color: #86868b;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.more-icon:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #1d1d1f;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: #f5f5f7;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #86868b;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
  color: #6e6e73;
  margin: 4px 0;
}

.empty-hint {
  font-size: 12px;
  color: #86868b;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 12px 16px;
}

.footer-info {
  font-size: 12px;
  color: #86868b;
}

/* ========== 右侧对话区域 ========== */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #34c759;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-action-btn {
  width: 36px;
  height: 36px;
  background: #f5f5f7;
  border: 1px solid #e5e5ea;
  color: #6e6e73;
  transition: all 0.2s ease;
}

.header-action-btn:hover {
  background: #e5e5ea;
  color: #1d1d1f;
}

/* ========== 消息区域 - 与输入一体化 ========== */
.chat-scroll-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.chat-scroll-area::-webkit-scrollbar {
  width: 6px;
}

.chat-scroll-area::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.chat-scroll-area::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}

.messages-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.message-item {
  margin-bottom: 24px;
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-user {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.message-bubble.user {
  background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%);
  color: #fff;
  padding: 12px 16px;
  border-radius: 16px 16px 4px 16px;
  max-width: 70%;
  word-wrap: break-word;
}

.message-ai {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1d1d1f 0%, #333 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-bubble.ai {
  background: #fff;
  color: #1d1d1f;
  padding: 12px 16px;
  border-radius: 16px 16px 16px 4px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.message-text :deep(code) {
  background: #f5f5f7;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 13px;
  color: #d73a49;
  font-family: 'SF Mono', monospace;
}

.message-text :deep(strong) {
  font-weight: 600;
  color: #1d1d1f;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  gap: 6px;
  padding: 8px 0;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  background: #0071e3;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 欢迎界面 */
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 100%;
}

.welcome-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #1d1d1f 0%, #333 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.welcome-avatar .el-icon {
  font-size: 40px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.welcome-subtitle {
  font-size: 16px;
  color: #86868b;
  margin-bottom: 40px;
}

.quick-prompts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 600px;
}

.prompt-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.prompt-card:hover {
  background: #f5f5f7;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.prompt-card:active {
  transform: scale(0.96);
}

.prompt-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f5f5f7 0%, #e5e5ea 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0071e3;
  font-size: 20px;
}

.prompt-title {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.prompt-desc {
  font-size: 12px;
  color: #86868b;
}

/* ========== 输入区域 - 与消息一体化 ========== */
.input-area-integrated {
  margin-top: auto;
  padding-top: 16px;
}

.input-container {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
}

.chat-input :deep(.el-textarea__inner) {
  border-radius: 16px;
  padding: 14px 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #f5f5f7;
  font-size: 15px;
  line-height: 1.6;
  resize: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1d1d1f;
}

.chat-input :deep(.el-textarea__inner:hover) {
  border-color: rgba(0, 0, 0, 0.12);
  background: #fff;
}

.chat-input :deep(.el-textarea__inner:focus) {
  background: #fff;
  border-color: #0071e3;
  box-shadow:
    0 0 0 4px rgba(0, 113, 227, 0.08),
    0 0 0 1px rgba(0, 113, 227, 0.1);
}

.send-btn {
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%);
  border: none;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #fff;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow:
    0 4px 16px rgba(0, 113, 227, 0.3),
    0 0 0 4px rgba(0, 113, 227, 0.1);
}

.send-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.send-btn:disabled {
  background: #e5e5ea;
  color: #86868b;
}

.input-footer {
  margin: 10px auto 0;
  text-align: center;
}

.footer-hint {
  font-size: 11px;
  color: #86868b;
  opacity: 0.6;
}

/* ========== 响应式 ========== */
@media (max-width: 1024px) {
  .chat-sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    transform: translateX(-100%);
    box-shadow: 0 0 60px rgba(0, 0, 0, 0.15);
  }

  .chat-sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .chat-sidebar.collapsed {
    width: 60px;
    transform: translateX(0);
  }

  .quick-prompts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 0 16px;
  }

  .nav-center {
    display: none;
  }

  .quick-actions {
    gap: 4px;
    padding-right: 8px;
  }

  .action-btn {
    width: 36px;
    height: 36px;
  }

  .user-name {
    display: none;
  }

  .messages-content {
    padding: 16px;
  }

  .input-area-integrated {
    padding-top: 12px;
  }
}
</style>
