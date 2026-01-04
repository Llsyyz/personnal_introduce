<!--
  ChatSidebar.vue - 命理大师左侧边栏组件
  黑白简约风格，包含导航菜单和用户操作
-->

<template>
  <div class="sidebar">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-text">Fate</span>
      </div>
    </div>

    <!-- 导航菜单 -->
    <div class="nav-menu">
      <!-- 八字算命 -->
      <div class="menu-category">八字算命</div>
      <div
        v-for="item in baziMenuItems"
        :key="item.key"
        class="menu-item"
        :class="{ active: modelValue === item.key }"
        @click="$emit('update:modelValue', item.key)"
      >
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.label }}</span>
      </div>

      <!-- 塔罗牌 -->
      <div class="menu-category">塔罗牌</div>
      <div
        v-for="item in tarotMenuItems"
        :key="item.key"
        class="menu-item"
        :class="{ active: modelValue === item.key }"
        @click="$emit('update:modelValue', item.key)"
      >
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="sidebar-footer">
      <el-button class="btn-logout" @click="$emit('logout')">
        <el-icon><User /></el-icon>
        <span>退出</span>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { User, Calendar, Star, Sunny } from '@element-plus/icons-vue'

defineProps({
  modelValue: {
    type: String,
    default: 'calculate'
  },
  userInfo: {
    type: Object,
    default: () => ({ nickname: '用户' })
  }
})

defineEmits(['update:modelValue', 'logout'])

const baziMenuItems = [
  { key: 'calculate', label: '八字计算', icon: Calendar },
  { key: 'marriage', label: '八字合婚', icon: Star },
  { key: 'daily', label: '每日运势', icon: Sunny }
]

const tarotMenuItems = [
  { key: 'tarot', label: '塔罗牌', icon: Star }
]
</script>

<style scoped>
/* ========== 左侧边栏 ========== */
.sidebar {
  width: 280px;
  height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid #e8e8e8;
  animation: slideInLeft 0.4s ease-out;
  position: sticky;
  top: 0;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.sidebar-header {
  padding: 40px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  letter-spacing: -1px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  flex: 1;
  padding: 24px 12px;
  overflow-y: auto;
}

.nav-menu::-webkit-scrollbar {
  width: 4px;
}

.nav-menu::-webkit-scrollbar-track {
  background: transparent;
}

.nav-menu::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.menu-category {
  padding: 16px 20px 10px;
  font-size: 11px;
  color: #999;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  margin: 4px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: #000;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: #000;
  transform: scaleY(0);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover {
  background: #f0f0f0;
  transform: translateX(4px);
}

.menu-item.active {
  background: #e0e0e0;
  color: #000;
}

.menu-item.active::before {
  transform: scaleY(1);
}

.menu-item .el-icon {
  font-size: 20px;
  transition: transform 0.25s ease;
}

.menu-item:hover .el-icon {
  transform: scale(1.1);
}

.menu-item span {
  font-weight: 700;
}

.sidebar-footer {
  padding: 20px;
  margin: 20px;
  background: transparent;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  animation: fadeInUp 0.5s ease-out 0.3s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-logout {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  padding: 18px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  background: #333;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: none;
}

.btn-logout:hover {
  background: #444;
  transform: scale(1.02);
}

.btn-logout:active {
  transform: scale(0.98);
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar.show {
    transform: translateX(0);
  }
}
</style>
