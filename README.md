# NoteSpace - 个人历程与笔记系统

一个精致的 Vue 3 单页应用，采用浅色 Apple 风格设计，包含个人历程时间轴、富文本笔记管理和个性化相册功能。

## 设计风格

- **浅色 Apple 风格**：干净优雅的浅色系配色
- **毛玻璃效果**：backdrop-filter 带来的视觉层次
- **线条装饰**：精致的边框和分隔线设计
- **杂志风格布局**：相册页采用不规则网格布局

## 项目预览

- **登录页**：浅色网格背景 + 浮动装饰圆球 + Logo 图标
- **首页**：历程时间轴 + 富文本编辑 + 统计卡片
- **笔记页**：卡片网格 + Medium 风格阅读体验 + 富文本编辑
- **相册页**：杂志风格布局 + 全屏灯箱 + 分类筛选

## 项目结构

```
D:\header\personnal_introduce\
├── src/
│   ├── api/               # API 接口目录
│   │   └── login.js       # 登录相关接口（模拟）
│   ├── router/            # 路由配置目录
│   │   └── index.js       # 路由配置 + 路由守卫
│   ├── views/             # 页面组件目录
│   │   ├── Login.vue      # 登录页面
│   │   ├── Home.vue       # 首页（时间轴）
│   │   ├── Notes.vue      # 笔记管理页面
│   │   └── Gallery.vue    # 相册页面
│   ├── App.vue            # 根组件
│   └── main.js            # 应用入口
├── index.html             # HTML 入口文件
├── vite.config.js         # Vite 配置文件
├── package.json           # 项目依赖配置
├── README.md              # 用户文档
└── AI_PROJECT_GUIDE.md    # AI 项目指南
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
- 表单验证（用户名 3-20 字符、密码 6-20 字符）
- 记住我功能（localStorage 存储用户名）
- 登录状态加载动画
- 错误提示

### 首页功能（历程时间轴）
- 浅色网格背景 + 浮动装饰圆球
- 英雄区域（欢迎信息 + 统计卡片）
- **个人历程时间轴**
  - 左右交替布局
  - 富文本编辑（侧边抽屉 + WangEditor）
  - 删除经历
  - 标签分类（学习、工作、旅行、成就等）
  - 数据持久化（localStorage）

### 笔记功能
- **笔记卡片网格布局**
- **分类管理**
  - 学习、工作、生活、想法、其他
  - 分类标签快速筛选
- **富文本编辑**
  - 侧边抽屉编辑器
  - WangEditor 简洁工具栏
- **阅读体验**
  - Medium/Notion 风格全屏阅读
  - 优雅的排版和字体
  - 首段放大引导
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

### 相册功能
- **杂志风格网格布局**
  - 大图 (2x2)、中图 (2x1)、小图 (1x1) 混合
  - CSS Grid 响应式布局
- **分类管理**
  - 生活、旅行、风景、人物、美食
  - 分类标签快速筛选
- **照片上传**
  - 支持标题、描述、分类
  - Base64 格式存储
- **全屏灯箱查看**
  - 左右切换浏览
  - 底部缩略图导航
  - 照片信息展示

## 页面设计

### 设计系统 - 浅色 Apple 风格

```css
/* 主色调 */
--primary-color: #1d1d1f;        /* 主按钮/选中状态 */
--bg-primary: #f5f5f7;           /* 主背景 */
--bg-white: #ffffff;             /* 卡片背景 */

/* 文字色 */
--text-primary: #1d1d1f;         /* 主要文字 */
--text-secondary: #6e6e73;       /* 次要文字 */

/* 边框色 */
--border-light: #e5e5ea;         /* 浅色边框 */
```

### 毛玻璃效果

```css
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.08);
}
```

### 首页设计亮点

#### 1. 浅色网格背景
- 浅灰色背景 `#f5f5f7` + 网格纹理
- 低透明度装饰圆球浮动动画

#### 2. 白色卡片设计
- 白色背景 + 浅色边框
- 悬停阴影效果

#### 3. 时间轴效果
- 左右交替布局
- 悬停缩放效果
- 彩色节点 + 标签

### 笔记页设计亮点

#### 1. 浅色主题
- 干净的白色卡片背景
- 精致的边框线条

#### 2. Medium/Notion 风格阅读
- 大标题（48px）
- 首段放大（22px）
- 优雅的行高和字间距
- 最大宽度 720px 居中

#### 3. 侧边抽屉编辑器
- 85% 宽度，从右侧滑出
- WangEditor 富文本编辑
- 简洁工具栏配置

### 相册页设计亮点

#### 1. 杂志风格网格
- CSS Grid 布局
- 大图 (2x2)、中图 (2x1)、小图 (1x1) 混合排列
- 响应式适配

#### 2. 全屏灯箱
- 大图居中展示
- 左右切换箭头
- 底部缩略图导航条

## 代码详解

### 一、数据结构

#### 历程记录 (experience)
```javascript
{
  id: 1234567890,              // 时间戳
  title: '开始学习 Vue 3',      // 标题
  date: '2024-12-24',          // 日期
  content: '<p>富文本内容...</p>',  // 富文本 HTML
  tags: ['学习', '前端'],       // 标签数组
  color: '#409EFF'             // 颜色标记
}
```

#### 笔记记录 (note)
```javascript
{
  id: 1234567890,              // 时间戳
  title: 'Vue 3 学习笔记',     // 标题
  category: '学习',            // 分类
  color: '#409EFF',           // 颜色标记
  content: '<p>笔记内容...</p>',  // 富文本 HTML
  tags: ['前端', 'Vue'],       // 标签数组
  createdAt: '2024-12-24T10:00:00.000Z'  // ISO 8601 时间戳
}
```

#### 照片记录 (photo)
```javascript
{
  id: 1234567890,              // 时间戳
  title: '海边日落',           // 照片标题
  description: '美丽的日落景色',  // 描述
  category: '风景',             // 分类
  url: 'data:image/jpeg;base64,...',  // Base64 图片
  date: '2024-12-24T10:00:00.000Z'    // ISO 8601 时间戳
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

### 三、WangEditor 富文本编辑器

```javascript
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 简洁工具栏配置
const toolbarConfig = {
  toolbarKeys: [
    'headerSelect', 'bold', 'italic', 'underline', 'through',
    'bulletedList', 'numberedList', 'todo',
    'fontSize', 'lineHeight', 'color', 'bgColor',
    'divider', 'undo', 'redo'
  ]
}

const editorConfig = {
  placeholder: '开始记录...',
  MENU_CONF: {}
}
```

### 四、分类统计

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

### 五、时间格式化

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
| WangEditor | 5.x | 富文本编辑器 |
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
| `/gallery` | 相册页 | 相册管理 |

## 未来扩展

- [x] 历程富文本编辑
- [x] 笔记富文本编辑
- [x] Medium 风格阅读体验
- [x] 相册功能
- [ ] Markdown 编辑模式
- [ ] 图片云存储（当前使用 Base64）
- [ ] 数据导出（PDF/Excel）
- [ ] 后端 API 接入
- [ ] 用户个人中心
- [ ] 数据可视化图表
- [ ] 笔记分享功能
- [ ] 全文搜索优化
- [ ] 暗色模式切换
