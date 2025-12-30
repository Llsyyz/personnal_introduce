<!--
  NewsDetail.vue - 资讯详情页
  展示完整资讯内容、互动数据和跨平台推荐
-->

<template>
  <div class="news-detail-page">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navbar-content">
        <div class="nav-left">
          <div class="brand" @click="router.push('/home')">
            <div class="brand-icon">
              <el-icon :size="22"><Star /></el-icon>
            </div>
            <span class="brand-name">NoteSpace</span>
          </div>
        </div>

        <div class="nav-center">
          <div class="global-search">
            <el-icon class="search-icon"><Search /></el-icon>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索热点资讯..."
              class="search-input"
              clearable
            />
          </div>
        </div>

        <div class="nav-right">
          <div class="quick-actions">
            <el-tooltip content="首页" placement="bottom">
              <el-button class="action-btn" @click="router.push('/home')">
                <el-icon :size="18"><HomeFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="资讯" placement="bottom">
              <el-button class="action-btn" @click="router.push('/news')">
                <el-icon :size="18"><Reading /></el-icon>
              </el-button>
            </el-tooltip>
          </div>

          <el-dropdown @command="handleCommand" trigger="click">
            <div class="user-dropdown">
              <el-avatar :src="userInfo.avatar" :size="36" class="user-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="user-name">{{ userInfo.nickname }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 返回按钮 -->
      <div class="back-header">
        <el-button class="back-btn" @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回资讯列表</span>
        </el-button>
      </div>

      <!-- 骨架屏 -->
      <div v-if="loading" class="detail-skeleton">
        <div class="skeleton-cover"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-meta"></div>
        <div class="skeleton-content"></div>
      </div>

      <!-- 详情内容 -->
      <div v-else class="detail-layout">
        <!-- 主内容区 -->
        <div class="detail-main">
          <!-- 文章头部 -->
          <div class="article-header">
            <div class="platform-badge" :style="{ background: newsDetail.platformColor }">
              <el-icon>
                <component :is="newsDetail.platformIcon" />
              </el-icon>
              <span>{{ newsDetail.platform }}</span>
            </div>
            <h1 class="article-title">{{ newsDetail.title }}</h1>
            <div class="article-meta">
              <span class="author">
                <el-icon><User /></el-icon>
                {{ newsDetail.author }}
              </span>
              <span class="publish-time">
                <el-icon><Clock /></el-icon>
                {{ newsDetail.publishTime }}
              </span>
              <span class="views">
                <el-icon><View /></el-icon>
                {{ newsDetail.views }}
              </span>
            </div>
          </div>

          <!-- 封面图 -->
          <div class="article-cover">
            <img :src="newsDetail.cover" :alt="newsDetail.title" />
          </div>

          <!-- 摘要 -->
          <div class="article-summary">
            <p>{{ newsDetail.summary }}</p>
          </div>

          <!-- 正文内容 -->
          <div class="article-content" v-html="newsDetail.content"></div>

          <!-- 互动数据 -->
          <div class="article-actions">
            <div class="action-item" @click="toggleLike">
              <el-icon :class="{ liked: isLiked }"><Heart /></el-icon>
              <span>{{ newsDetail.likeCount }}</span>
            </div>
            <div class="action-item" @click="scrollToComments">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ newsDetail.commentCount }}</span>
            </div>
            <div class="action-item" @click="handleShare">
              <el-icon><Share /></el-icon>
              <span>分享</span>
            </div>
            <div class="action-item" @click="handleCollect">
              <el-icon :class="{ collected: isCollected }"><Star /></el-icon>
              <span>{{ isCollected ? '已收藏' : '收藏' }}</span>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="comments-section" ref="commentsRef">
            <h3 class="comments-title">
              评论 ({{ newsDetail.commentCount }})
            </h3>
            <div class="comment-input">
              <el-avatar :src="userInfo.avatar" :size="40">
                <el-icon><User /></el-icon>
              </el-avatar>
              <el-input
                v-model="commentText"
                type="textarea"
                :rows="3"
                placeholder="发表你的看法..."
                class="comment-textarea"
              />
              <el-button type="primary" @click="submitComment" :disabled="!commentText.trim()">
                发表评论
              </el-button>
            </div>
            <div class="comment-list">
              <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <el-avatar :src="comment.avatar" :size="40">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.author }}</span>
                    <span class="comment-time">{{ comment.time }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                  <div class="comment-actions">
                    <span class="comment-action" @click="likeComment(comment.id)">
                      <el-icon><Heart /></el-icon>
                      {{ comment.likeCount }}
                    </span>
                    <span class="comment-action">回复</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="detail-sidebar">
          <!-- 相关推荐 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">
              <el-icon><Star /></el-icon>
              相关推荐
            </h4>
            <div class="related-list">
              <div
                v-for="item in relatedNews"
                :key="item.id"
                class="related-item"
                @click="goToDetail(item.id)"
              >
                <img :src="item.cover" :alt="item.title" class="related-cover" />
                <div class="related-info">
                  <h5 class="related-title">{{ item.title }}</h5>
                  <span class="related-platform">{{ item.platform }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 跨平台同类热点 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">
              <el-icon><Connection /></el-icon>
              跨平台相关
            </h4>
            <div class="cross-platform-list">
              <div
                v-for="item in crossPlatformNews"
                :key="item.id"
                class="cross-platform-item"
                @click="openExternal(item.url)"
              >
                <div class="platform-icon" :style="{ background: item.platformColor }">
                  <el-icon>
                    <component :is="item.platformIcon" />
                  </el-icon>
                </div>
                <div class="cross-platform-info">
                  <h5 class="cross-platform-title">{{ item.title }}</h5>
                  <span class="cross-platform-hot">{{ item.hotValue }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 热门话题 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">
              <el-icon><TrendCharts /></el-icon>
              热门话题
            </h4>
            <div class="hot-topics">
              <el-tag
                v-for="topic in hotTopics"
                :key="topic"
                class="topic-tag"
                @click="handleSearchTopic(topic)"
              >
                {{ topic }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Star, HomeFilled, ArrowLeft, SwitchButton, User, Search, Reading,
  Clock, View, Heart, ChatDotRound, Share, Connection, TrendCharts
} from '@element-plus/icons-vue'
import {
  ChatLineSquare, Share as ShareIcon, Camera
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 用户信息
const userInfo = ref({
  nickname: '管理员',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 搜索关键词
const searchKeyword = ref('')

// 加载状态
const loading = ref(true)

// 资讯详情
const newsDetail = ref({})

// 互动状态
const isLiked = ref(false)
const isCollected = ref(false)

// 评论
const commentText = ref('')
const commentsRef = ref(null)
const comments = ref([])

// 相关推荐
const relatedNews = ref([])

// 跨平台热点
const crossPlatformNews = ref([])

// 热门话题
const hotTopics = ref(['AI大模型', '新能源', '芯片', '元宇宙', '量子计算', '自动驾驶'])

// 模拟详情数据
const mockDetailData = {
  id: 1,
  title: '2024年最值得关注的技术趋势：AI 大模型的突破性进展',
  summary: '随着 GPT-4、Claude 等大模型的持续迭代，人工智能领域正在迎来前所未有的发展机遇。本文将深入分析当前 AI 大模型的技术突破、应用场景以及未来发展方向。',
  cover: 'https://picsum.photos/800/450?random=1',
  content: `
    <p>人工智能领域在过去一年取得了令人瞩目的成就。以 GPT-4、Claude、Gemini 等为代表的大型语言模型，在自然语言理解、代码生成、多模态处理等方面展现出了惊人的能力。</p>
    <h2>技术突破</h2>
    <p>目前大模型的主要技术突破体现在以下几个方面：</p>
    <ul>
      <li><strong>参数规模持续增长</strong>：从千亿级迈向万亿级参数</li>
      <li><strong>上下文窗口扩展</strong>：支持更长的输入输出</li>
      <li><strong>多模态融合</strong>：文本、图像、音频、视频的统一处理</li>
      <li><strong>推理能力提升</strong>：复杂逻辑问题的解决能力显著增强</li>
    </ul>
    <h2>应用场景</h2>
    <p>AI 大模型已经在多个领域展现出巨大的应用潜力：</p>
    <ul>
      <li>智能客服和虚拟助手</li>
      <li>内容创作和辅助写作</li>
      <li>代码开发和调试辅助</li>
      <li>教育和知识普及</li>
      <li>科学研究和数据分析</li>
    </ul>
    <h2>未来展望</h2>
    <p>尽管取得了显著进展，AI 大模型仍面临着诸多挑战，包括能耗控制、安全性保障、可解释性提升等。未来，随着技术的不断发展，我们有理由相信 AI 将为人类社会带来更多福祉。</p>
  `,
  platform: '知乎',
  platformIcon: ChatLineSquare,
  platformColor: '#0084ff',
  author: '科技观察者',
  publishTime: '2024-12-30 14:30',
  views: '123.4万',
  likeCount: 8543,
  commentCount: 1234,
  related: [
    { id: 2, title: 'GPT-5 即将发布？OpenAI 官方回应', cover: 'https://picsum.photos/200/120?random=2', platform: '微博' },
    { id: 3, title: 'Claude 4 超越 GPT-4 的深度评测', cover: 'https://picsum.photos/200/120?random=3', platform: '知乎' },
    { id: 4, title: '国产大模型迎来爆发期', cover: 'https://picsum.photos/200/120?random=4', platform: '抖音' }
  ],
  crossPlatform: [
    { id: 5, title: 'AI 大模型最新进展盘点', platform: '微博', platformIcon: ShareIcon, platformColor: '#ff8200', hotValue: '856万', url: '#' },
    { id: 6, title: '从零开始理解大模型', platform: 'B站', platformIcon: Camera, platformColor: '#00a1d6', hotValue: '654万', url: '#' },
    { id: 7, title: '大模型应用实战教程', platform: '知乎', platformIcon: ChatLineSquare, platformColor: '#0084ff', hotValue: '523万', url: '#' }
  ],
  comments: [
    { id: 1, author: 'AI爱好者', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', time: '2小时前', content: '这篇文章写得非常好，深入浅出地讲解了 AI 大模型的发展现状。', likeCount: 234 },
    { id: 2, author: '技术达人', avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png', time: '3小时前', content: '期待国产大模型能有更多突破！', likeCount: 156 },
    { id: 3, author: '产品经理', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', time: '5小时前', content: 'AI 技术的发展确实很快，但商业化应用还有很长的路要走。', likeCount: 89 }
  ]
}

// 加载详情数据
const loadDetailData = () => {
  const id = route.params.id
  // 实际项目中这里应该调用接口获取数据
  setTimeout(() => {
    newsDetail.value = mockDetailData
    relatedNews.value = mockDetailData.related
    crossPlatformNews.value = mockDetailData.crossPlatform
    comments.value = mockDetailData.comments
    loading.value = false
  }, 500)
}

// 点赞
const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    newsDetail.value.likeCount++
    ElMessage.success('已点赞')
  } else {
    newsDetail.value.likeCount--
  }
}

// 收藏
const handleCollect = () => {
  isCollected.value = !isCollected.value
  if (isCollected.value) {
    ElMessage.success('已收藏')
  } else {
    ElMessage.info('已取消收藏')
  }
}

// 分享
const handleShare = () => {
  ElMessage.success('链接已复制到剪贴板')
}

// 滚动到评论区
const scrollToComments = () => {
  commentsRef.value?.scrollIntoView({ behavior: 'smooth' })
}

// 提交评论
const submitComment = () => {
  if (!commentText.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  comments.value.unshift({
    id: Date.now(),
    author: userInfo.value.nickname,
    avatar: userInfo.value.avatar,
    time: '刚刚',
    content: commentText.value,
    likeCount: 0
  })
  newsDetail.value.commentCount++
  commentText.value = ''
  ElMessage.success('评论发表成功')
}

// 评论点赞
const likeComment = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.likeCount++
  }
}

// 跳转其他详情
const goToDetail = (id) => {
  router.push(`/news/${id}`)
  window.scrollTo(0, 0)
  loadDetailData()
}

// 打开外部链接
const openExternal = (url) => {
  window.open(url, '_blank')
}

// 搜索话题
const handleSearchTopic = (topic) => {
  router.push('/news')
}

// 处理下拉菜单
const handleCommand = (command) => {
  if (command === 'logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.success('退出成功')
    router.push('/login')
  }
}

// 初始化
onMounted(() => {
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }
  loadDetailData()
})
</script>

<style scoped>
/* ========== 页面基础 ========== */
.news-detail-page {
  min-height: 100vh;
  background: #f5f5f7;
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
  max-width: 1200px;
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
  max-width: 400px;
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
  transition: all 0.25s ease;
}

.global-search :deep(.el-input__wrapper:hover),
.global-search :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  border-color: #0071e3;
}

.global-search :deep(.el-input__inner) {
  color: #1d1d1f;
  font-size: 14px;
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
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #fff;
  border-color: #d1d1d6;
  color: #0071e3;
  transform: translateY(-2px);
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  border-radius: 14px;
  background: #f5f5f7;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e5ea;
}

.user-dropdown:hover {
  background: #fff;
  border-color: #d1d1d6;
}

.user-avatar {
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
}

/* ========== 主内容区 ========== */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 40px;
}

.back-header {
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

/* ========== 详情布局 ========== */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

.detail-main {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* 文章头部 */
.article-header {
  margin-bottom: 24px;
}

.platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1.4;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #86868b;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 文章封面 */
.article-cover {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: auto;
  display: block;
}

/* 文章摘要 */
.article-summary {
  padding: 20px;
  background: #f5f5f7;
  border-left: 4px solid #1a1a1a;
  border-radius: 8px;
  margin-bottom: 24px;
}

.article-summary p {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin: 0;
}

/* 文章正文 */
.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: #1d1d1f;
}

.article-content :deep(h2) {
  font-size: 22px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 32px 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f5f7;
}

.article-content :deep(p) {
  margin-bottom: 16px;
}

.article-content :deep(ul) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.article-content :deep(li) {
  margin-bottom: 8px;
}

/* 互动操作 */
.article-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
  margin: 32px 0;
  border-top: 1px solid #f5f5f7;
  border-bottom: 1px solid #f5f5f7;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: #f5f5f7;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 14px;
  color: #666;
}

.action-item:hover {
  background: #e5e5ea;
  color: #1d1d1f;
}

.action-item .el-icon.liked {
  color: #ff6b6b;
}

.action-item .el-icon.collected {
  color: #ffb347;
}

/* 评论区 */
.comments-section {
  margin-top: 32px;
}

.comments-title {
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 20px;
}

.comment-input {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.comment-textarea {
  flex: 1;
}

.comment-textarea :deep(.el-textarea__inner) {
  border-radius: 12px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-author {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
  font-size: 13px;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s ease;
}

.comment-action:hover {
  color: #1d1d1f;
}

/* ========== 侧边栏 ========== */
.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f5f7;
}

/* 相关推荐 */
.related-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.related-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.related-item:hover {
  transform: translateX(4px);
}

.related-cover {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.related-info {
  flex: 1;
}

.related-title {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-platform {
  font-size: 12px;
  color: #999;
}

/* 跨平台相关 */
.cross-platform-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cross-platform-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f7;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.cross-platform-item:hover {
  background: #e5e5ea;
}

.platform-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #fff;
  flex-shrink: 0;
}

.cross-platform-info {
  flex: 1;
}

.cross-platform-title {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.cross-platform-hot {
  font-size: 12px;
  color: #ff6b6b;
}

/* 热门话题 */
.hot-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topic-tag {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.topic-tag:hover {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}

/* ========== 骨架屏 ========== */
.detail-skeleton {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
}

.skeleton-cover {
  height: 400px;
  background: linear-gradient(90deg, #f5f5f7 25%, #f0f0f0 50%, #f5f5f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
  margin-bottom: 24px;
}

.skeleton-title {
  height: 32px;
  background: linear-gradient(90deg, #f5f5f7 25%, #f0f0f0 50%, #f5f5f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 16px;
}

.skeleton-meta {
  height: 20px;
  width: 300px;
  background: linear-gradient(90deg, #f5f5f7 25%, #f0f0f0 50%, #f5f5f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 24px;
}

.skeleton-content {
  height: 300px;
  background: linear-gradient(90deg, #f5f5f7 25%, #f0f0f0 50%, #f5f5f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ========== 响应式 ========== */
@media (max-width: 1024px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .detail-main {
    padding: 24px;
  }

  .article-title {
    font-size: 22px;
  }

  .nav-center {
    display: none;
  }

  .user-name {
    display: none;
  }
}
</style>
