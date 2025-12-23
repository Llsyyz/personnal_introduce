# Vue 3 + Element Plus 个人历程与笔记系统

一个大胆创新的 Vue 3 项目，包含完整的登录功能、个人历史经历时间轴展示、以及功能丰富的笔记管理系统。

## 项目预览

- **登录页**：Apple 风格的渐变背景 + 毛玻璃效果
- **首页**：深色主题 + 动态背景 + 浮动卡片 + 时间轴展示
- **笔记页**：卡片式笔记管理 + 分类筛选 + 搜索功能 + 颜色标记

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
│   │   ├── Home.vue       # 首页（时间轴）
│   │   └── Notes.vue      # 笔记管理页面
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

### 首页功能（历程时间轴）
- 动态渐变背景 + 浮动动画
- 英雄区域（欢迎信息）
- 统计卡片（总历程、成就达成、本月记录）
- **个人历程时间轴**
  - 左右交替布局
  - 添加新经历
  - 删除经历
  - 标签分类（学习、工作、旅行、成就等）
  - 数据持久化（localStorage）

### 笔记功能
- **笔记卡片网格布局**
- **分类管理**
  - 学习、工作、生活、想法、其他
  - 分类标签快速筛选
- **搜索功能**
  - 支持标题、内容、标签搜索
  - 实时过滤结果
- **颜色标记**
  - 8 种预设颜色可选
  - 左侧彩色边框标识
- **标签系统**
  - 自定义标签
  - 多标签支持
- **CRUD 操作**
  - 创建笔记
  - 查看详情
  - 编辑内容
  - 删除笔记
- **数据持久化**（localStorage）

## 页面设计

### 首页设计亮点

#### 1. 动态背景
- 深色渐变背景 `#1a1a2e → #16213e → #0f3460`
- 三个浮动的模糊圆形，持续动画
- 创造深度感和活力

#### 2. 玻璃态设计
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

#### 3. 时间轴效果
- 中心线渐变
- 左右交替布局
- 悬停缩放效果
- 彩色节点 + 标签

### 笔记页设计亮点

#### 1. 深紫色主题
- 渐变背景 `#0f0c29 → #302b63 → #24243e`
- 更有神秘感和专注感

#### 2. 工具栏设计
- 搜索框：圆角设计，毛玻璃效果
- 分类下拉：快速筛选
- 新建按钮：渐变色，悬停上浮

#### 3. 分类标签栏
- 横向滚动标签
- 带数量统计
- 激活状态高亮

#### 4. 笔记卡片
- 响应式网格布局
- 左侧彩色边框
- 悬停上浮 + 阴影
- 分类徽章
- 标签展示（最多显示 2 个）
- 相对时间显示（今天/昨天/N天前）

## 代码详解

### 一、笔记数据结构

```javascript
const note = {
  id: 1,                      // 唯一标识
  title: 'Vue 3 学习笔记',     // 标题
  category: '学习',            // 分类
  color: '#409EFF',           // 颜色标记
  content: '笔记内容...',      // 内容
  tags: ['前端', 'Vue'],       // 标签数组
  createdAt: '2024-01-15'     // 创建时间
}
```

### 二、搜索与筛选

```javascript
// 过滤笔记列表
const filteredNotes = computed(() => {
  return notes.value.filter(note => {
    // 分类筛选
    const matchCategory = !filterCategory.value || note.category === filterCategory.value
    // 关键词搜索（标题、内容、标签）
    const matchSearch = !searchKeyword.value ||
      note.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      note.content.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()))
    return matchCategory && matchSearch
  })
})
```

### 三、分类统计

```javascript
// 获取各分类数量
const getCategoryCount = (category) => {
  return notes.value.filter(note => note.category === category).length
}

// 分类图标映射
const getCategoryIcon = (category) => {
  const iconMap = {
    '学习': 'Reading',
    '工作': 'Briefcase',
    '生活': 'Sunny',
    '想法': 'Lightbulb',
    '其他': 'More'
  }
  return iconMap[category] || 'More'
}
```

### 四、时间格式化

```javascript
// 格式化日期为相对时间
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
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
  const data = localStorage.getItem('notes')
  if (data) notes.value = JSON.parse(data)
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
   - 历程：编辑功能、图片上传、数据导出
   - 笔记：笔记分享、Markdown 支持、附件上传
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

## 路由说明

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | - | 重定向到登录页 |
| `/login` | 登录页 | 用户登录 |
| `/home` | 首页 | 历程时间轴 |
| `/notes` | 笔记页 | 笔记管理 |

## 未来扩展

- [ ] 历程编辑功能
- [ ] 笔记 Markdown 编辑器
- [ ] 图片/附件上传
- [ ] 数据导出（PDF/Excel）
- [ ] 主题切换（深色/浅色）
- [ ] 后端 API 接入
- [ ] 用户个人中心
- [ ] 数据可视化图表
- [ ] 笔记分享功能
- [ ] 全文搜索优化
