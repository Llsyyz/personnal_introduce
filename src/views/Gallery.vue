<!--
  Gallery.vue - 相册页面
  杂志风格照片展示，全屏灯箱查看
-->

<template>
  <div class="gallery-page">
    <!-- 动态背景装饰 -->
    <div class="animated-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

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
              placeholder="搜索照片..."
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
            <el-tooltip content="笔记" placement="bottom">
              <el-button class="action-btn" @click="router.push('/notes')">
                <el-icon :size="18"><Notebook /></el-icon>
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
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <h1 class="page-title-full">我的相册</h1>
          <span class="photo-count">{{ photos.length }} 张照片</span>
        </div>
        <div class="toolbar-right">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeUpload"
            accept="image/*"
            :auto-upload="false"
          >
            <el-button type="primary" class="upload-btn" :icon="Plus">
              添加照片
            </el-button>
          </el-upload>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="category-filter">
        <div
          class="filter-item"
          :class="{ active: selectedCategory === '全部' }"
          @click="selectedCategory = '全部'"
        >
          全部
          <span class="count">{{ photos.length }}</span>
        </div>
        <div
          class="filter-item"
          v-for="cat in categories"
          :key="cat"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
          <span class="count">{{ getCategoryCount(cat) }}</span>
        </div>
      </div>

      <!-- 杂志风格照片网格 -->
      <div class="magazine-grid" v-if="filteredPhotos.length > 0">
        <div
          v-for="(photo, index) in filteredPhotos"
          :key="photo.id"
          class="magazine-item"
          :class="getSizeClass(index)"
          @click="openLightbox(index)"
        >
          <div class="photo-wrapper">
            <img :src="photo.url" :alt="photo.description || photo.title" />
            <div class="photo-overlay">
              <div class="photo-info">
                <h3 class="photo-title">{{ photo.title }}</h3>
                <p class="photo-desc" v-if="photo.description">{{ photo.description }}</p>
                <div class="photo-meta">
                  <span class="photo-category">{{ photo.category }}</span>
                  <span class="photo-date">{{ formatDate(photo.date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-icon :size="64" color="#c7c7cc"><Collection /></el-icon>
        <h3>还没有照片</h3>
        <p>点击"添加照片"按钮上传您的第一张照片</p>
      </div>
    </div>

    <!-- 添加照片对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="添加照片"
      width="500px"
      :close-on-click-modal="false"
      class="upload-dialog"
    >
      <el-form :model="photoForm" label-width="80px">
        <el-form-item label="照片">
          <div class="upload-preview" @click="triggerFileInput">
            <img v-if="previewUrl" :src="previewUrl" />
            <div v-else class="upload-placeholder">
              <el-icon :size="40"><Plus /></el-icon>
              <span>点击上传照片</span>
            </div>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileSelect"
            />
          </div>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="photoForm.title" placeholder="照片标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="photoForm.description"
            type="textarea"
            :rows="3"
            placeholder="添加描述..."
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="photoForm.category" placeholder="选择分类" style="width: 100%">
            <el-option label="生活" value="生活" />
            <el-option label="旅行" value="旅行" />
            <el-option label="风景" value="风景" />
            <el-option label="人物" value="人物" />
            <el-option label="美食" value="美食" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePhoto">保存</el-button>
      </template>
    </el-dialog>

    <!-- 全屏灯箱 -->
    <Transition name="lightbox">
      <div v-if="lightboxVisible" class="lightbox" @click.self="closeLightbox">
        <div class="lightbox-close" @click="closeLightbox">
          <el-icon :size="24"><Close /></el-icon>
        </div>

        <div class="lightbox-nav prev" @click="prevPhoto" v-if="filteredPhotos.length > 1">
          <el-icon :size="32"><ArrowLeft /></el-icon>
        </div>

        <div class="lightbox-content">
          <img :src="currentPhoto?.url" :alt="currentPhoto?.title" />
          <div class="lightbox-info">
            <h3 class="lightbox-title">{{ currentPhoto?.title }}</h3>
            <p class="lightbox-desc" v-if="currentPhoto?.description">{{ currentPhoto.description }}</p>
            <div class="lightbox-meta">
              <span class="lightbox-category">{{ currentPhoto?.category }}</span>
              <span class="lightbox-date">{{ formatDate(currentPhoto?.date) }}</span>
            </div>
          </div>
        </div>

        <div class="lightbox-nav next" @click="nextPhoto" v-if="filteredPhotos.length > 1">
          <el-icon :size="32"><ArrowRight /></el-icon>
        </div>

        <!-- 底部缩略图 -->
        <div class="lightbox-thumbs" v-if="filteredPhotos.length > 1">
          <div
            v-for="(photo, index) in filteredPhotos"
            :key="photo.id"
            class="thumb-item"
            :class="{ active: currentIndex === index }"
            @click="goToPhoto(index)"
          >
            <img :src="photo.url" :alt="photo.title" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Star, HomeFilled, Notebook, ArrowDown, SwitchButton, User,
  Plus, Collection, Close, ArrowLeft, ArrowRight, Search
} from '@element-plus/icons-vue'
import { logoutApi } from '@/api/login'

const router = useRouter()

// 用户信息
const userInfo = ref({
  username: 'admin',
  nickname: '管理员',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 照片数据
const photos = ref([])
const selectedCategory = ref('全部')
const categories = ref(['生活', '旅行', '风景', '人物', '美食'])

// 搜索关键词
const searchKeyword = ref('')

// 上传对话框
const uploadDialogVisible = ref(false)
const previewUrl = ref('')
const fileInputRef = ref(null)

// 照片表单
const photoForm = reactive({
  title: '',
  description: '',
  category: '生活',
  file: null
})

// 灯箱
const lightboxVisible = ref(false)
const currentIndex = ref(0)

// 计算属性
const filteredPhotos = computed(() => {
  if (selectedCategory.value === '全部') {
    return photos.value
  }
  return photos.value.filter(p => p.category === selectedCategory.value)
})

const currentPhoto = computed(() => {
  return filteredPhotos.value[currentIndex.value]
})

// 获取分类数量
const getCategoryCount = (category) => {
  return photos.value.filter(p => p.category === category).length
}

// 获取网格大小类（杂志风格）
const getSizeClass = (index) => {
  const pattern = ['large', 'medium', 'medium', 'small', 'small', 'medium', 'large', 'small', 'medium', 'small']
  return pattern[index % pattern.length]
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

// 上传前处理
const beforeUpload = () => {
  uploadDialogVisible.value = true
  return false
}

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }

  photoForm.file = file
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
    if (!photoForm.title) {
      photoForm.title = file.name.split('.')[0]
    }
  }
  reader.readAsDataURL(file)
}

// 保存照片
const handleSavePhoto = () => {
  if (!previewUrl.value) {
    ElMessage.warning('请先上传照片')
    return
  }

  const newPhoto = {
    id: Date.now(),
    title: photoForm.title,
    description: photoForm.description,
    category: photoForm.category,
    url: previewUrl.value,
    date: new Date().toISOString()
  }

  photos.value.unshift(newPhoto)
  localStorage.setItem('gallery_photos', JSON.stringify(photos.value))

  ElMessage.success('添加成功')
  uploadDialogVisible.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  photoForm.title = ''
  photoForm.description = ''
  photoForm.category = '生活'
  photoForm.file = null
  previewUrl.value = ''
}

// 打开灯箱
const openLightbox = (index) => {
  currentIndex.value = index
  lightboxVisible.value = true
}

// 关闭灯箱
const closeLightbox = () => {
  lightboxVisible.value = false
}

// 上一张
const prevPhoto = () => {
  currentIndex.value = (currentIndex.value - 1 + filteredPhotos.value.length) % filteredPhotos.value.length
}

// 下一张
const nextPhoto = () => {
  currentIndex.value = (currentIndex.value + 1) % filteredPhotos.value.length
}

// 跳转到指定照片
const goToPhoto = (index) => {
  currentIndex.value = index
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
      logout()
      break
  }
}

// 退出登录
const logout = async () => {
  try {
    await logoutApi()
    localStorage.removeItem('isLogin')
    ElMessage.success('退出成功')
    router.push('/login')
  } catch (error) {
    ElMessage.error('退出失败')
  }
}

// 初始化
onMounted(() => {
  // 获取用户信息
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }

  const saved = localStorage.getItem('gallery_photos')
  if (saved) {
    photos.value = JSON.parse(saved)
  } else {
    // 示例数据
    photos.value = [
      {
        id: 1,
        title: '日落时分',
        description: '美丽的日落景色',
        category: '风景',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        date: new Date().toISOString()
      },
      {
        id: 2,
        title: '咖啡时光',
        description: '享受午后咖啡',
        category: '生活',
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
        date: new Date().toISOString()
      },
      {
        id: 3,
        title: '山间小径',
        description: '宁静的山间小路',
        category: '旅行',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        date: new Date().toISOString()
      }
    ]
    localStorage.setItem('gallery_photos', JSON.stringify(photos.value))
  }
})
</script>

<style scoped>
/* ========== 页面基础样式 ========== */
.gallery-page {
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

/* ========== 导航栏 - 现代简洁 ========== */
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
}

.toolbar-left {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.page-title-full {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

.photo-count {
  font-size: 14px;
  color: #86868b;
}

.upload-btn {
  background: linear-gradient(135deg, #1d1d1f 0%, #000 100%);
  border: none;
  height: 42px;
  padding: 0 28px;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-btn:hover {
  background: linear-gradient(135deg, #2d2d2f 0%, #1a1a1a 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
}

/* ========== 分类筛选 - 现代简洁 ========== */
.category-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  color: #6e6e73;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
}

.filter-item:hover {
  background: #f5f5f7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.1);
}

.filter-item.active {
  background: linear-gradient(135deg, #1d1d1f 0%, #000 100%);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.filter-item .count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.filter-item:not(.active) .count {
  background: #f5f5f7;
  color: #86868b;
}

/* ========== 杂志风格网格 - 现代简洁 ========== */
.magazine-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  gap: 18px;
}

.magazine-item {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.magazine-item:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* 杂志风格：不同大小的格子 */
.magazine-item.large {
  grid-column: span 2;
  grid-row: span 2;
}

.magazine-item.medium {
  grid-column: span 2;
  grid-row: span 1;
}

.magazine-item.small {
  grid-column: span 1;
  grid-row: span 1;
}

.photo-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.photo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.magazine-item:hover .photo-wrapper img {
  transform: scale(1.08);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.magazine-item:hover .photo-overlay {
  opacity: 1;
}

.photo-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}

.photo-desc {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.photo-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  opacity: 0.8;
}

/* ========== 空状态 ========== */
.empty-state {
  text-align: center;
  padding: 100px 20px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 20px 0 10px;
}

.empty-state p {
  font-size: 14px;
  color: #86868b;
}

/* ========== 上传对话框 - 现代简洁 ========== */
.upload-dialog :deep(.el-dialog) {
  border-radius: 24px;
}

.upload-preview {
  width: 100%;
  height: 200px;
  border: 2px dashed #e5e5ea;
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.upload-preview:hover {
  border-color: #0071e3;
  background: rgba(0, 113, 227, 0.02);
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #86868b;
}

/* ========== 全屏灯箱 ========== */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.lightbox-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.25s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.25s ease;
}

.lightbox-nav.prev {
  left: 24px;
}

.lightbox-nav.next {
  right: 24px;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-content {
  max-width: 80vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.lightbox-info {
  margin-top: 24px;
  text-align: center;
  color: #fff;
}

.lightbox-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
}

.lightbox-desc {
  font-size: 16px;
  opacity: 0.8;
  margin: 0 0 12px;
}

.lightbox-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  opacity: 0.6;
}

.lightbox-thumbs {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  max-width: 80vw;
  overflow-x: auto;
  padding: 8px;
}

.thumb-item {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.25s ease;
  border: 2px solid transparent;
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-item:hover,
.thumb-item.active {
  opacity: 1;
  border-color: #fff;
}

/* 灯箱动画 */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .magazine-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .magazine-item.large {
    grid-column: span 2;
  }

  .magazine-item.medium {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px 16px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .magazine-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 250px;
  }

  .magazine-item.large,
  .magazine-item.medium,
  .magazine-item.small {
    grid-column: span 1;
    grid-row: span 1;
  }

  .lightbox {
    padding: 16px;
  }

  .lightbox-nav {
    width: 44px;
    height: 44px;
  }

  .lightbox-nav.prev {
    left: 8px;
  }

  .lightbox-nav.next {
    right: 8px;
  }
}
</style>
