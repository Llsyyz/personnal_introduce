<!--
  News.vue - 热点资讯页面
  多平台热点资讯聚合，支持平台切换和搜索
-->

<template>
  <div class="news-page">
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
              @keyup.enter="handleSearch"
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
            <el-tooltip content="AI 助手" placement="bottom">
              <el-button class="action-btn" @click="router.push('/chat')">
                <el-icon :size="18"><ChatDotRound /></el-icon>
              </el-button>
            </el-tooltip>
          </div>

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

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 平台分类导航 -->
      <div class="platform-nav">
        <div
          v-for="platform in platforms"
          :key="platform.key"
          class="platform-item"
          :class="{ active: currentPlatform === platform.key }"
          @click="switchPlatform(platform.key)"
        >
          <el-icon>
            <component :is="platform.icon" />
          </el-icon>
          <span>{{ platform.name }}</span>
          <span v-if="platform.count" class="count">{{ platform.count }}</span>
        </div>
      </div>

      <!-- 焦点区域 -->
      <div class="focus-section" v-if="!loading">
        <!-- 左侧 TOP1 大卡片 -->
        <div class="top-card" @click="goToDetail(topNews.id)" v-if="topNews">
          <div class="top-cover">
            <img :src="topNews.cover" :alt="topNews.title" />
            <div class="top-badge">
              <el-icon><Trophy /></el-icon>
              <span>全网 TOP1</span>
            </div>
          </div>
          <div class="top-content">
            <h2 class="top-title">{{ topNews.title }}</h2>
            <p class="top-summary">{{ topNews.summary }}</p>
            <div class="top-meta">
              <span class="platform-tag" :style="{ background: topNews.platformColor }">
                <el-icon><component :is="topNews.platformIcon" /></el-icon>
                {{ topNews.platform }}
              </span>
              <span class="hot-value">
                <el-icon><Star /></el-icon>
                {{ topNews.hotValue }}
              </span>
            </div>
          </div>
        </div>

        <!-- 右侧热点列表 -->
        <div class="top-list">
          <div
            v-for="(item, index) in topList"
            :key="item.id"
            class="top-list-item"
            @click="goToDetail(item.id)"
          >
            <span class="top-rank" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
            <div class="top-list-content">
              <h4 class="top-list-title">{{ item.title }}</h4>
              <div class="top-list-meta">
                <span class="platform">{{ item.platform }}</span>
                <span class="hot-value">{{ item.hotValue }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 骨架屏 -->
      <div class="focus-section skeleton" v-else>
        <div class="top-card skeleton-card"></div>
        <div class="top-list">
          <div v-for="i in 3" :key="i" class="top-list-item skeleton-item"></div>
        </div>
      </div>

      <!-- 内容区：新闻列表 + 侧边栏 -->
      <div class="content-layout">
        <!-- 新闻列表 -->
        <div class="news-list">
          <div class="section-title">
            <h3>热点榜单</h3>
            <span class="subtitle">实时更新 · 按热度排序</span>
          </div>

          <!-- 列表骨架屏 -->
          <div v-if="loading" class="list-skeleton">
            <div v-for="i in 8" :key="i" class="news-item-skeleton"></div>
          </div>

          <!-- 新闻列表 -->
          <div v-else class="news-items">
            <div
              v-for="item in newsList"
              :key="item.id"
              class="news-item"
              @click="goToDetail(item.id)"
            >
              <div class="news-left">
                <div class="platform-icon" :style="{ background: item.platformColor }">
                  <el-icon>
                    <component :is="item.platformIcon" />
                  </el-icon>
                </div>
                <img class="news-thumb" :src="item.cover" :alt="item.title" />
              </div>
              <div class="news-right">
                <h3 class="news-title">{{ item.title }}</h3>
                <p class="news-summary">{{ item.summary }}</p>
                <div class="news-meta">
                  <span class="source">{{ item.platform }}</span>
                  <span class="time">{{ item.publishTime }}</span>
                  <span class="hot-value">
                    <el-icon><Star /></el-icon>
                    {{ item.hotValue }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载更多 -->
          <div class="load-more" v-if="!loading && hasMore">
            <el-button @click="loadMore" :loading="loadingMore">
              加载更多
            </el-button>
          </div>
        </div>

        <!-- PC 端侧边栏 -->
        <div class="sidebar">
          <!-- 平台热度榜 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">
              <el-icon><TrendCharts /></el-icon>
              平台热度榜
            </h4>
            <div class="platform-rank">
              <div
                v-for="(item, index) in platformRank"
                :key="item.key"
                class="rank-item"
              >
                <span class="rank-num" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
                <el-icon class="rank-icon">
                  <component :is="item.icon" />
                </el-icon>
                <span class="rank-name">{{ item.name }}</span>
                <span class="rank-value">{{ item.value }}</span>
              </div>
            </div>
          </div>

          <!-- 热点订阅 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">
              <el-icon><Bell /></el-icon>
              热点订阅
            </h4>
            <div class="subscribe-tags">
              <el-tag
                v-for="tag in subscribeTags"
                :key="tag"
                :class="{ subscribed: subscribedTags.includes(tag) }"
                @click="toggleSubscribe(tag)"
              >
                {{ tag }}
                <el-icon v-if="subscribedTags.includes(tag)"><Check /></el-icon>
              </el-tag>
            </div>
          </div>

          <!-- 关联推荐 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">
              <el-icon><Star /></el-icon>
              关联推荐
            </h4>
            <div class="recommend-list">
              <div
                v-for="item in recommendList"
                :key="item.id"
                class="recommend-item"
                @click="goToDetail(item.id)"
              >
                <span class="recommend-dot"></span>
                <span class="recommend-title">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Star, HomeFilled, Notebook, Collection, ArrowDown, SwitchButton, User,
  Search, ChatDotRound, Trophy, TrendCharts, Bell, Check
} from '@element-plus/icons-vue'
import {
  ChatLineSquare, Camera, Share, Promotion
} from '@element-plus/icons-vue'

const router = useRouter()

// 用户信息
const userInfo = ref({
  nickname: '管理员',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 搜索关键词
const searchKeyword = ref('')

// 平台列表
const platforms = ref([
  { key: 'all', name: '全网', icon: Star, count: 128 },
  { key: 'weibo', name: '微博', icon: Share, count: 45 },
  { key: 'zhihu', name: '知乎', icon: ChatLineSquare, count: 32 },
  { key: 'douyin', name: '抖音', icon: Camera, count: 28 },
  { key: 'bilibili', name: 'B站', icon: Promotion, count: 23 }
])

// 当前平台
const currentPlatform = ref('all')

// 加载状态
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)

// TOP1 热点
const topNews = ref(null)

// 右侧热点列表
const topList = ref([])

// 新闻列表
const newsList = ref([])

// 平台热度榜
const platformRank = ref([
  { key: 'weibo', name: '微博', icon: Share, value: '2.3亿' },
  { key: 'zhihu', name: '知乎', icon: ChatLineSquare, value: '1.8亿' },
  { key: 'douyin', name: '抖音', icon: Camera, value: '1.5亿' },
  { key: 'bilibili', name: 'B站', icon: Promotion, value: '9800万' }
])

// 订阅标签
const subscribeTags = ref(['科技', '娱乐', '体育', '财经', '汽车', '游戏'])
const subscribedTags = ref(['科技', '财经'])

// 关联推荐
const recommendList = ref([])

// 模拟数据
const mockNewsData = {
  all: {
    top: {
      id: 1,
      title: '2024年最值得关注的技术趋势：AI 大模型的突破性进展',
      summary: '随着 GPT-4、Claude 等大模型的持续迭代，人工智能领域正在迎来前所未有的发展机遇...',
      cover: 'https://picsum.photos/600/400?random=1',
      platform: '知乎',
      platformIcon: ChatLineSquare,
      platformColor: '#0084ff',
      hotValue: '1234万',
      publishTime: '2小时前'
    },
    topList: [
      { id: 2, title: '新能源汽车销量再创新高，市场格局生变', platform: '微博', platformIcon: Share, hotValue: '856万' },
      { id: 3, title: '国产大飞机 C919 获得百架订单', platform: '抖音', platformIcon: Camera, hotValue: '723万' },
      { id: 4, title: '量子计算取得重大突破', platform: 'B站', platformIcon: Promotion, hotValue: '654万' }
    ],
    list: [
      { id: 5, title: '全球首个 AI 医生通过执业考试', summary: '人工智能医疗领域迎来里程碑...', cover: 'https://picsum.photos/200/150?random=5', platform: '知乎', platformIcon: ChatLineSquare, platformColor: '#0084ff', publishTime: '3小时前', hotValue: '567万' },
      { id: 6, title: '苹果发布首款折叠屏手机', summary: '科技圈期待已久的苹果折叠屏终于来了...', cover: 'https://picsum.photos/200/150?random=6', platform: '微博', platformIcon: Share, platformColor: '#ff8200', publishTime: '4小时前', hotValue: '489万' },
      { id: 7, title: '马斯克宣布火星计划新进展', summary: 'SpaceX 星舰发射时间表确定...', cover: 'https://picsum.photos/200/150?random=7', platform: '抖音', platformIcon: Camera, platformColor: '#000', publishTime: '5小时前', hotValue: '432万' },
      { id: 8, title: '华为鸿蒙系统用户突破 10 亿', summary: '国产操作系统生态建设取得重大成就...', cover: 'https://picsum.photos/200/150?random=8', platform: 'B站', platformIcon: Promotion, platformColor: '#00a1d6', publishTime: '6小时前', hotValue: '398万' },
      { id: 9, title: '量子芯片实现商业化量产', summary: '中国科技公司联合攻关取得突破...', cover: 'https://picsum.photos/200/150?random=9', platform: '知乎', platformIcon: ChatLineSquare, platformColor: '#0084ff', publishTime: '7小时前', hotValue: '356万' },
      { id: 10, title: '全球首台 6G 原型机亮相', summary: '通信技术再上新台阶...', cover: 'https://picsum.photos/200/150?random=10', platform: '微博', platformIcon: Share, platformColor: '#ff8200', publishTime: '8小时前', hotValue: '312万' }
    ],
    recommend: [
      { id: 11, title: 'AI 绘画技术全面解析' },
      { id: 12, title: '2024 年最佳编程语言排行' },
      { id: 13, title: '自动驾驶技术发展现状' }
    ]
  }
}

// 切换平台
const switchPlatform = (key) => {
  currentPlatform.value = key
  loading.value = true
  // 模拟加载
  setTimeout(() => {
    loadNewsData()
    loading.value = false
  }, 500)
}

// 加载新闻数据
const loadNewsData = () => {
  const data = mockNewsData.all
  topNews.value = data.top
  topList.value = data.topList
  newsList.value = data.list
  recommendList.value = data.recommend
}

// 搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  ElMessage.success(`搜索：${searchKeyword.value}`)
  // 实际项目中这里应该调用搜索接口
}

// 加载更多
const loadMore = () => {
  loadingMore.value = true
  setTimeout(() => {
    // 模拟加载更多数据
    hasMore.value = false
    loadingMore.value = false
  }, 1000)
}

// 订阅标签切换
const toggleSubscribe = (tag) => {
  const index = subscribedTags.value.indexOf(tag)
  if (index > -1) {
    subscribedTags.value.splice(index, 1)
    ElMessage.info(`已取消订阅 ${tag}`)
  } else {
    subscribedTags.value.push(tag)
    ElMessage.success(`已订阅 ${tag}`)
  }
}

// 跳转详情页
const goToDetail = (id) => {
  router.push(`/news/${id}`)
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'home':
      router.push('/home')
      break
    case 'chat':
      router.push('/chat')
      break
    case 'notes':
      router.push('/notes')
      break
    case 'gallery':
      router.push('/gallery')
      break
    case 'logout':
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      ElMessage.success('退出成功')
      router.push('/login')
      break
  }
}

// 初始化
onMounted(() => {
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }
  // 模拟加载
  setTimeout(() => {
    loadNewsData()
    loading.value = false
  }, 800)
})
</script>

<style scoped>
/* ========== 页面基础 ========== */
.news-page {
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

.global-search :deep(.el-input__inner) {
  color: #1d1d1f;
  font-size: 14px;
}

.global-search :deep(.el-input__inner::placeholder) {
  color: #86868b;
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

/* ========== 主内容区 ========== */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 20px 40px;
}

/* ========== 平台导航 ========== */
.platform-nav {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.platform-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #fff;
  border: 1px solid #e5e5ea;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.platform-item:hover {
  background: #f5f5f7;
  border-color: #d1d1d6;
  transform: translateY(-2px);
}

.platform-item.active {
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.platform-item .count {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.platform-item.active .count {
  background: rgba(255, 255, 255, 0.2);
}

/* ========== 焦点区域 ========== */
.focus-section {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

/* TOP1 大卡片 */
.top-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.top-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.top-cover {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.top-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.top-card:hover .top-cover img {
  transform: scale(1.05);
}

.top-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.top-content {
  padding: 20px;
}

.top-title {
  font-size: 20px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 12px;
  line-height: 1.4;
}

.top-summary {
  font-size: 14px;
  color: #86868b;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.top-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.platform-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
}

.hot-value {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ff6b6b;
  font-size: 14px;
  font-weight: 600;
}

/* 右侧热点列表 */
.top-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.top-list-item:hover {
  background: linear-gradient(135deg, #f5f5f7 0%, #fff 100%);
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.top-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #86868b;
}

.top-rank.rank-1 {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: #fff;
}

.top-rank.rank-2 {
  background: linear-gradient(135deg, #ff9a3d 0%, #ffb347 100%);
  color: #fff;
}

.top-rank.rank-3 {
  background: linear-gradient(135deg, #ffd93d 0%, #ffea5e 100%);
  color: #fff;
}

.top-list-content {
  flex: 1;
}

.top-list-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 6px;
  line-height: 1.4;
}

.top-list-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.top-list-meta .platform {
  color: #86868b;
}

.top-list-meta .hot-value {
  color: #ff6b6b;
  font-weight: 600;
}

/* ========== 内容布局 ========== */
.content-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

/* ========== 新闻列表 ========== */
.news-list {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f7;
}

.section-title h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
}

.subtitle {
  font-size: 13px;
  color: #86868b;
}

/* 新闻列表项 */
.news-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

.news-item:hover {
  background: #f5f5f7;
  border-color: #e5e5ea;
}

.news-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.platform-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #fff;
}

.news-thumb {
  width: 140px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
}

.news-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1.5;
  margin-bottom: 8px;
}

.news-summary {
  font-size: 13px;
  color: #86868b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
}

.news-meta .source {
  color: #666;
}

.news-meta .time {
  color: #999;
}

.news-meta .hot-value {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ff6b6b;
  font-weight: 600;
  margin-left: auto;
}

/* 加载更多 */
.load-more {
  margin-top: 24px;
  text-align: center;
}

.load-more :deep(.el-button) {
  width: 200px;
  border-radius: 12px;
}

/* ========== 侧边栏 ========== */
.sidebar {
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

/* 平台热度榜 */
.platform-rank {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  transition: background 0.2s ease;
}

.rank-item:hover {
  background: #f5f5f7;
}

.rank-num {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #86868b;
}

.rank-num.rank-1 {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: #fff;
}

.rank-num.rank-2 {
  background: linear-gradient(135deg, #ff9a3d 0%, #ffb347 100%);
  color: #fff;
}

.rank-num.rank-3 {
  background: linear-gradient(135deg, #ffd93d 0%, #ffea5e 100%);
  color: #fff;
}

.rank-icon {
  font-size: 18px;
  color: #666;
}

.rank-name {
  flex: 1;
  font-size: 14px;
  color: #1d1d1f;
}

.rank-value {
  font-size: 13px;
  color: #ff6b6b;
  font-weight: 600;
}

/* 热点订阅 */
.subscribe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.subscribe-tags :deep(.el-tag) {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #e5e5ea;
}

.subscribe-tags :deep(.el-tag:hover) {
  border-color: #1a1a1a;
  background: #f5f5f7;
}

.subscribe-tags :deep(.el-tag.subscribed) {
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  border-color: transparent;
  color: #fff;
}

.subscribe-tags :deep(.el-tag .el-icon) {
  margin-left: 4px;
}

/* 关联推荐 */
.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.recommend-item:hover {
  background: #f5f5f7;
}

.recommend-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1a1a1a;
  flex-shrink: 0;
}

.recommend-title {
  font-size: 14px;
  color: #1d1d1f;
  line-height: 1.5;
}

/* ========== 骨架屏 ========== */
.skeleton {
  pointer-events: none;
}

.skeleton-card {
  height: 400px;
  background: linear-gradient(90deg, #f5f5f7 25%, #f0f0f0 50%, #f5f5f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 16px;
}

.skeleton-item {
  height: 80px;
  background: linear-gradient(90deg, #f5f5f7 25%, #f0f0f0 50%, #f5f5f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}

.news-item-skeleton {
  height: 120px;
  background: linear-gradient(90deg, #f5f5f7 25%, #f0f0f0 50%, #f5f5f7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
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
@media (max-width: 1200px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .focus-section {
    grid-template-columns: 1fr;
  }

  .platform-nav {
    gap: 8px;
  }

  .platform-item {
    padding: 8px 14px;
    font-size: 13px;
  }

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

  .news-thumb {
    width: 100px;
    height: 80px;
  }

  .news-title {
    font-size: 14px;
  }
}
</style>
