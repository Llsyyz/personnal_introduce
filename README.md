# Vue 3 + Element Plus 个人历程记录系统

一个大胆创新的 Vue 3 项目，包含完整的登录功能和个人历史经历时间轴展示。

## 项目预览

- **登录页**：Apple 风格的渐变背景 + 毛玻璃效果
- **首页**：深色主题 + 动态背景 + 浮动卡片 + 时间轴展示

## 项目结构

```
vue-login-demo/
├── public/                 # 静态资源目录
├── src/
│   ├── api/               # API 接口目录
│   │   └── login.js       # 登录相关接口（模拟）
│   ├── assets/            # 资源文件目录
│   ├── components/        # 公共组件目录
│   ├── router/            # 路由配置目录
│   │   └── index.js       # 路由配置 + 路由守卫
│   ├── views/             # 页面组件目录
│   │   ├── Login.vue      # 登录页面
│   │   └── Home.vue       # 首页（时间轴）
│   ├── App.vue            # 根组件
│   └── main.js            # 应用入口
├── index.html             # HTML 入口文件
├── vite.config.js         # Vite 配置文件
└── package.json           # 项目依赖配置
```

## 如何运行

### 1. 安装依赖

```bash
cd vue-login-demo
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:3000`

### 3. 构建生产版本

```bash
npm run build
```

## 测试账号

- 用户名：`admin`
- 密码：`123456`

## 核心功能

### 登录功能
- 表单验证（用户名、密码格式验证）
- 记住我功能
- 登录状态加载动画
- 错误提示

### 路由功能
- 登录页 `/login`
- 首页 `/home`
- 路由守卫（未登录自动跳转到登录页）

### 首页功能
- 动态渐变背景 + 浮动动画
- 英雄区域（欢迎信息）
- 统计卡片（总历程、成就达成、本月记录）
- **个人历程时间轴**
  - 左右交替布局
  - 添加新经历
  - 删除经历
  - 标签分类（学习、工作、旅行、成就等）
  - 数据持久化（localStorage）

## 首页设计亮点

### 1. 动态背景
- 深色渐变背景 `#1a1a2e → #16213e → #0f3460`
- 三个浮动的模糊圆形，持续动画
- 创造深度感和活力

### 2. 玻璃态设计
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### 3. 时间轴效果
- 中心线渐变
- 左右交替布局
- 悬停缩放效果
- 彩色节点 + 标签

### 4. 统计卡片
- 渐变图标背景
- 数字动态显示
- 悬停上浮效果

## 代码详解

### 一、响应式数据管理

```javascript
// 经历数据列表
const experiences = ref([
  {
    id: 1,
    title: '开始学习 Vue 3',
    date: '2024-01-15',
    description: '今天开始系统学习 Vue 3 框架...',
    tags: ['学习'],
    color: '#409EFF'
  }
])

// 统计数据（计算属性）
const stats = computed(() => [
  {
    icon: 'TrendCharts',
    label: '总历程',
    value: experiences.value.length,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
])
```

### 二、添加经历功能

```javascript
const handleSubmit = () => {
  // 验证表单
  if (!experienceForm.title || !experienceForm.date) {
    ElMessage.warning('请填写完整信息')
    return
  }

  // 创建新经历
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C']
  const newExp = {
    id: Date.now(),
    ...experienceForm,
    color: colors[Math.floor(Math.random() * colors.length)]
  }

  // 添加到列表开头
  experiences.value.unshift(newExp)

  // 持久化存储
  localStorage.setItem('experiences', JSON.stringify(experiences.value))

  ElMessage.success('添加成功')
  dialogVisible.value = false
}
```

### 三、时间轴布局

```vue
<template>
  <div class="timeline-item" :class="{ 'left': index % 2 === 0, 'right': index % 2 === 1 }">
    <div class="timeline-dot" :style="{ background: exp.color }"></div>
    <div class="timeline-content">
      <div class="timeline-date">{{ exp.date }}</div>
      <h3 class="timeline-title">{{ exp.title }}</h3>
      <p class="timeline-desc">{{ exp.description }}</p>
    </div>
  </div>
</template>
```

```css
/* 中心线 */
.timeline-container::before {
  content: '';
  position: absolute;
  left: 50%;
  width: 3px;
  background: linear-gradient(180deg, transparent, rgba(102, 126, 234, 0.5), transparent);
}

/* 左右布局 */
.timeline-item.left .timeline-content {
  margin-right: calc(50% + 40px);
  text-align: right;
}

.timeline-item.right .timeline-content {
  margin-left: calc(50% + 40px);
  text-align: left;
}
```

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4+ | 渐进式 JavaScript 框架 |
| Vue Router | 4.2+ | Vue 官方路由管理器 |
| Element Plus | 2.5+ | Vue 3 组件库 |
| Vite | 5.0+ | 下一代前端构建工具 |

## Vue 3 核心概念

### 1. setup 语法糖

```vue
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

const count = ref(0)
const user = reactive({ name: 'admin' })

const doubleCount = computed(() => count.value * 2)

onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

### 2. 响应式数据

```javascript
// ref：用于简单类型
const count = ref(0)
console.log(count.value)  // 读取值需要 .value

// reactive：用于对象类型
const user = reactive({ name: 'admin' })
console.log(user.name)    // 直接访问属性
```

### 3. 计算属性

```javascript
const stats = computed(() => {
  return {
    total: experiences.value.length,
    achievements: experiences.value.filter(e => e.tags?.includes('成就')).length
  }
})
```

### 4. 生命周期

```javascript
onMounted(() => {
  // 组件挂载后执行
  const data = localStorage.getItem('experiences')
  if (data) experiences.value = JSON.parse(data)
})

onUnmounted(() => {
  // 组件卸载前执行
  clearInterval(timer)
})
```

## 学习建议

1. **理解项目结构**：先熟悉各个文件的作用
2. **运行项目**：实际操作，观察页面效果
3. **添加新功能**：
   - 添加经历编辑功能
   - 添加经历搜索/筛选功能
   - 添加图片上传功能
   - 添加经历导出功能
4. **接入真实接口**：将模拟接口替换成真实的后端 API

## 常见问题

### 1. npm install 很慢？
```bash
npm config set registry https://registry.npmmirror.com
```

### 2. 端口被占用？
修改 `vite.config.js` 中的 `server.port` 配置

### 3. 如何部署？
运行 `npm run build` 后，将 `dist` 目录部署到服务器

### 4. 数据存在哪里？
目前使用 `localStorage` 存储在浏览器本地，刷新页面数据不会丢失

## 未来扩展

- [ ] 经历编辑功能
- [ ] 图片上传支持
- [ ] 数据导出（PDF/Excel）
- [ ] 主题切换（深色/浅色）
- [ ] 后端 API 接入
- [ ] 用户个人中心
- [ ] 数据可视化图表
