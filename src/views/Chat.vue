<!--
  Chat.vue - AI 极简对话页面
  以极简清晰为核心，聚焦对话本身
-->

<template>
  <div class="chat-page">
    <!-- 导航栏 -->
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

        <!-- 中间区域 -->
        <div class="nav-center">
          <div class="global-search">
            <el-icon class="search-icon"><Search /></el-icon>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索..."
              class="search-input"
              clearable
            />
          </div>
        </div>

        <!-- 右侧操作区域 -->
        <div class="nav-right">
          <!-- 快速操作按钮组 -->
          <div class="quick-actions">
            <el-tooltip content="首页" placement="bottom">
              <el-button class="action-btn" @click="router.push('/home')">
                <el-icon :size="18"><HomeFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="热点资讯" placement="bottom">
              <el-button class="action-btn" @click="router.push('/news')">
                <el-icon :size="18"><Reading /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="笔记" placement="bottom">
              <el-button class="action-btn" @click="router.push('/notes')">
                <el-icon :size="18"><Notebook /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="相册" placement="bottom">
              <el-button class="action-btn" @click="router.push('/gallery')">
                <el-icon :size="18"><Collection /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="清空对话" placement="bottom">
              <el-button class="action-btn" @click="clearChat">
                <el-icon :size="18"><Delete /></el-icon>
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
                <el-dropdown-item command="news">
                  <el-icon><Reading /></el-icon>
                  <span>热点资讯</span>
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

    <!-- 对话区域 -->
    <div class="messages-container" ref="messagesRef">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message-item"
        :class="message.role"
      >
        <!-- 用户消息 -->
        <div v-if="message.role === 'user'" class="message-content user">
          <div class="bubble user-bubble">{{ message.content }}</div>
        </div>

        <!-- AI 消息 -->
        <div v-else class="message-content assistant">
          <div class="avatar ai-avatar">
            <el-icon><Star /></el-icon>
          </div>
          <div class="bubble ai-bubble">
            <div v-if="message.loading" class="loading">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <div v-else class="markdown-text" v-html="renderMarkdown(message.content)"></div>
          </div>
        </div>
      </div>

      <!-- 欢迎消息 -->
      <div v-if="messages.length === 0" class="welcome">
        <div class="welcome-icon">
          <el-icon><Star /></el-icon>
        </div>
        <h2>你好，我是 AI 助手</h2>
        <p>有什么可以帮助你的吗？</p>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <div class="input-wrapper">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="1"
          :autosize="{ minRows: 1, maxRows: 6 }"
          placeholder="输入你的问题..."
          @keydown.enter.exact="sendMessage"
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
          <el-icon><Promotion /></el-icon>
        </el-button>
      </div>
      <div class="input-hint">Enter 发送 · Shift + Enter 换行 · 支持 Markdown</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Star, HomeFilled, Notebook, Collection, ArrowDown, SwitchButton, User,
  Delete, Search, ChatDotRound, Promotion, Reading
} from '@element-plus/icons-vue'
import { logoutApi } from '@/api/login'
import { chatApi } from '@/api/chat'

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 聊天相关
const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const messagesRef = ref(null)

// 用户信息
const userInfo = ref({
  username: 'admin',
  nickname: '管理员',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 发送消息
const sendMessage = async () => {
  const content = inputMessage.value.trim()
  if (!content || isLoading.value) return

  messages.value.push({
    role: 'user',
    content,
    timestamp: Date.now()
  })

  inputMessage.value = ''
  await scrollToBottom()

  const loadingMsg = {
    role: 'assistant',
    content: '',
    loading: true,
    timestamp: Date.now()
  }
  messages.value.push(loadingMsg)
  isLoading.value = true

  try {
    const response = await chatApi(content, messages.value.slice(0, -2))
    messages.value[messages.value.length - 1] = {
      role: 'assistant',
      content: response.data.reply,
      timestamp: Date.now()
    }
  } catch (error) {
    messages.value[messages.value.length - 1] = {
      role: 'assistant',
      content: '抱歉，我遇到了一些问题。请稍后再试。',
      timestamp: Date.now()
    }
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// 渲染 Markdown（轻量实现）
const renderMarkdown = (text) => {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
}

// 清空对话
const clearChat = async () => {
  try {
    await ElMessageBox.confirm('确定要清空对话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    messages.value = []
    ElMessage.success('已清空')
  } catch {
    // 用户取消
  }
}

// 处理下拉菜单
const handleCommand = (command) => {
  switch (command) {
    case 'home':
      router.push('/home')
      break
    case 'chat':
      // 当前页面，无需跳转
      break
    case 'news':
      router.push('/news')
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

// 退出登录
const handleLogout = async () => {
  try {
    await logoutApi()
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.success('退出成功')
    router.push('/login')
  } catch (error) {
    ElMessage.error('退出失败')
  }
}

// 初始化
onMounted(() => {
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }
})
</script>

<style scoped>
/* ========== 页面基础 ========== */
.chat-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

/* ========== 导航栏 ========== */
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
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
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

/* ========== 对话区域 ========== */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.message-item {
  margin-bottom: 32px;
}

.message-content {
  display: flex;
  gap: 12px;
}

.message-content.user {
  justify-content: flex-end;
}

.message-content.assistant {
  justify-content: flex-start;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-avatar {
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: #fff;
}

/* ========== 消息气泡 ========== */
.bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.7;
  word-wrap: break-word;
}

.user-bubble {
  background: #1a1a1a;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.ai-bubble {
  background: #fff;
  color: #333;
  border: 1px solid #eee;
  border-bottom-left-radius: 4px;
}

/* ========== Markdown 样式 ========== */
.markdown-text :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
  color: #e74c3c;
}

.markdown-text :deep(strong) {
  font-weight: 600;
}

.markdown-text :deep(em) {
  font-style: italic;
}

.markdown-text :deep(h1),
.markdown-text :deep(h2),
.markdown-text :deep(h3) {
  margin: 12px 0 8px;
  font-weight: 600;
}

/* ========== 加载动画 ========== */
.loading {
  display: flex;
  gap: 6px;
  padding: 4px 0;
}

.loading .dot {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading .dot:nth-child(1) { animation-delay: -0.32s; }
.loading .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* ========== 欢迎消息 ========== */
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.welcome-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 24px;
}

.welcome h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.welcome p {
  font-size: 15px;
  color: #999;
}

/* ========== 输入区域 ========== */
.input-area {
  padding: 20px 24px 24px;
  background: #fff;
  border-top: 1px solid #eee;
}

.input-wrapper {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
}

.chat-input :deep(.el-textarea__inner) {
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #eee;
  background: #fafafa;
  font-size: 15px;
  line-height: 1.6;
  resize: none;
  transition: all 0.2s ease;
}

.chat-input :deep(.el-textarea__inner:focus) {
  background: #fff;
  border-color: #1a1a1a;
  box-shadow: none;
}

.send-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  border: none;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #333 0%, #1a1a1a 100%);
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #eee;
  color: #ccc;
}

.input-hint {
  text-align: center;
  font-size: 12px;
  color: #bbb;
  margin-top: 12px;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .nav-center {
    display: none;
  }

  .quick-actions {
    gap: 4px;
    padding-right: 8px;
  }

  .action-btn {
    width: 38px;
    height: 38px;
  }

  .user-name {
    display: none;
  }

  .messages-container {
    padding: 24px 16px;
  }

  .bubble {
    max-width: 90%;
  }

  .navbar-content {
    padding: 0 16px;
    height: 56px;
  }

  .input-area {
    padding: 16px;
  }
}
</style>
