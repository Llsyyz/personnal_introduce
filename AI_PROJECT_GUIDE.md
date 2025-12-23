# AI 项目指南 - NoteSpace

> 专为 AI 助手设计的项目指南，包含完整的技术细节、代码规范和架构说明，便于 AI 快速理解和跟进项目开发。

---

## 项目概述

**项目名称**: NoteSpace
**项目类型**: Vue 3 单页应用（SPA）
**核心功能**: 个人历程管理 + 富文本笔记系统
**设计风格**: Notion 风格 + 毛玻璃效果 + 深色主题

### 技术栈总览

```yaml
框架: Vue 3.4+ (Composition API + <script setup>)
路由: Vue Router 4.2+ (History 模式)
UI库: Element Plus 2.5+
编辑器: WangEditor 5.x + @wangeditor/plugin-md
构建: Vite 5.0+
包管理: npm
```

---

## 目录结构详解

```
D:\header\personnal_introduce\
├── src/
│   ├── api/
│   │   └── login.js              # 登录 API 模拟接口
│   ├── router/
│   │   └── index.js              # 路由配置 + beforeEach 守卫
│   ├── views/
│   │   ├── Login.vue            # 登录页 (Apple 风格)
│   │   ├── Home.vue             # 首页 (时间轴 + Notion 导航)
│   │   └── Notes.vue            # 笔记页 (富文本 + 全屏编辑)
│   ├── App.vue                  # 根组件 (全局样式)
│   └── main.js                  # 应用入口
├── index.html                    # HTML 模板
├── vite.config.js               # Vite 配置 (端口 3000, 自动打开)
├── package.json                 # 依赖配置
├── README.md                    # 用户文档
└── AI_PROJECT_GUIDE.md          # 本文档
```

---

## 路由配置

### 路由表

| 路径 | 组件 | 认证 | 说明 |
|------|------|------|------|
| `/` | - | - | 重定向到 `/login` |
| `/login` | Login.vue | 否 | 登录页，已登录则跳转首页 |
| `/home` | Home.vue | 是 | 首页，历程时间轴 |
| `/notes` | Notes.vue | 是 | 笔记管理页 |

### 路由守卫逻辑

```javascript
// src/router/index.js
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 需要登录的页面
  if (to.meta.requiresAuth) {
    if (token && !isTokenExpired(token)) {
      next()
    } else {
      next('/login')
    }
  } else {
    // 已登录用户访问登录页，跳转首页
    if (to.path === '/login' && token) {
      next('/home')
    } else {
      next()
    }
  }
})
```

---

## 组件架构

### 1. Login.vue - 登录页

**关键元素**:
- 动态渐变背景 + 3 个浮动动画圆球
- 毛玻璃卡片容器
- 表单验证规则
- 记住我功能 (localStorage 存储用户名)

**状态管理**:
```javascript
const loginForm = reactive({
  username: localStorage.getItem('rememberedUser') || '',
  password: '',
  remember: !!localStorage.getItem('rememberedUser')
})
```

**验证规则**:
- 用户名: 3-20 字符
- 密码: 6-20 字符

### 2. Home.vue - 首页

**布局结构**:
```
┌─────────────────────────────────────┐
│  Notion 导航栏                       │
├─────────────────────────────────────┤
│  英雄区域 (欢迎卡片)                 │
│  统计卡片 (3个浮动的数据卡片)        │
├─────────────────────────────────────┤
│  历程时间轴                          │
│   ┌────┐    ┌────┐    ┌────┐       │
│   │ L1 │    │ R1 │    │ L2 │       │
│   └────┘    └────┘    └────┘       │
└─────────────────────────────────────┘
```

**核心数据**:
- `experiences`: 历程数组 (localStorage: 'experiences')
- `currentTime`: 实时时间更新
- `timelineRef`: 时间轴 DOM 引用

**方法列表**:
- `handleAddExperience()` - 打开添加对话框
- `handleSubmit()` - 提交新历程
- `handleDelete(id)` - 删除历程
- `scrollToTimeline()` - 滚动到时间轴
- `updateTime()` - 更新当前时间

### 3. Notes.vue - 笔记页

**布局结构**:
```
┌─────────────────────────────────────┐
│  Notion 导航栏                       │
├─────────────────────────────────────┤
│  分类标签栏 (横向滚动)               │
├─────────────────────────────────────┤
│  笔记卡片网格 (响应式布局)           │
│   ┌──────┐  ┌──────┐  ┌──────┐    │
│   │ 卡片1│  │ 卡片2│  │ 卡片3│    │
│   └──────┘  └──────┘  └──────┘    │
└─────────────────────────────────────┘

全屏编辑抽屉 (95% 高度):
┌─────────────────────────────────────┐
│  ✏️ 编辑笔记    [取消] [保存]       │
├─────────────────────────────────────┤
│  标题输入框 (无边框大字体)           │
│  [分类] [颜色选择器] [标签]         │
├─────────────────────────────────────┤
│  WangEditor 工具栏                   │
├─────────────────────────────────────┤
│                                      │
│       富文本编辑区域 (自适应)         │
│                                      │
└─────────────────────────────────────┘
```

**核心数据**:
```javascript
// 笔记列表
const notes = ref([])  // localStorage: 'notes'

// 搜索和筛选
const searchKeyword = ref('')
const filterCategory = ref('')

// 编辑器
const editorRef = shallowRef()  // WangEditor 实例
const editorHeight = ref('500px')  // 未使用，现在是自适应

// 表单
const noteForm = reactive({
  id: null,
  title: '',
  category: '学习',
  color: '#409EFF',
  content: '',  // HTML 内容
  tags: []
})
```

**WangEditor 配置**:
```javascript
// 工具栏配置
const toolbarConfig = {
  toolbarKeys: [
    'headerSelect', 'bold', 'italic', 'underline', 'through',
    'bulletedList', 'numberedList', 'todo',
    'fontSize', 'fontFamily', 'lineHeight', 'color', 'bgColor',
    'link', 'uploadImage', 'insertTable', 'codeBlock', 'divider',
    'undo', 'redo', 'fullScreen'
  ]
}

// 编辑器配置
const editorConfig = {
  placeholder: '开始写作...支持 Markdown 语法',
  MENU_CONF: {
    uploadImage: {
      customUpload: (file, insertFn) => {
        // Base64 本地预览
        const reader = new FileReader()
        reader.onload = (e) => insertFn(e.target.result, file.name, e.target.result)
        reader.readAsDataURL(file)
      }
    },
    codeSelect: {
      codeLangs: [/* 18+ 语言支持 */]
    }
  }
}
```

---

## 数据结构规范

### 用户信息 (userInfo)
```javascript
{
  username: String,    // 用户名
  nickname: String,    // 昵称
  avatar: String       // 头像 URL
}
```

### 历程记录 (experience)
```javascript
{
  id: Number,          // 时间戳
  title: String,       // 标题
  date: String,        // YYYY-MM-DD 格式
  description: String, // 描述文本
  tags: Array<String>, // 标签数组
  color: String        // 颜色值 #HEX
}
```

### 笔记记录 (note)
```javascript
{
  id: Number,              // 时间戳
  title: String,           // 标题
  category: String,        // 分类: 学习/工作/生活/想法/其他
  color: String,           // 颜色值 #HEX
  content: String,         // 富文本 HTML
  tags: Array<String>,     // 标签数组
  createdAt: String,       // ISO 8601 时间戳
  updatedAt: String        // ISO 8601 时间戳 (可选)
}
```

---

## 设计规范

### 色彩系统
```css
/* 主色调 */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--primary-color: #667eea;

/* 背景色 */
--bg-dark: #0f0c29;
--bg-gradient: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);

/* 毛玻璃 */
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-blur: blur(20px) saturate(180%);
--glass-border: 1px solid rgba(255, 255, 255, 0.1);

/* 文字色 */
--text-white: #ffffff;
--text-white-70: rgba(255, 255, 255, 0.7);
--text-white-50: rgba(255, 255, 255, 0.5);

/* 颜色选项 */
--color-blue: #409EFF;
--color-green: #67C23A;
--color-orange: #E6A23C;
--color-red: #F56C6C;
--color-gray: #909399;
--color-purple: #722ED1;
--color-cyan: #13C2C2;
--color-rose: #F5222D;
```

### 圆角规范
```css
--radius-sm: 6px;   /* 小元素 */
--radius-md: 10px;  /* 按钮 */
--radius-lg: 12px;  /* 输入框 */
--radius-xl: 20px;  /* 卡片 */
--radius-full: 50%; /* 圆形 */
```

### 导航栏规范
```css
.navbar {
  height: 64px;
  background: rgba(15, 12, 41, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}
```

### 悬停效果规范
```css
/* 按钮悬停 */
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* 卡片悬停 */
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}
```

---

## 代码规范

### 导入顺序
```javascript
// 1. Vue 核心
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. UI 组件库
import { ElMessage, ElMessageBox } from 'element-plus'
import { IconName1, IconName2 } from '@element-plus/icons-vue'

// 3. 项目模块
import { logoutApi } from '@/api/login'

// 4. 编辑器
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
```

### 命名规范
```javascript
// 组件: PascalCase
const UserProfile = ref(null)

// 变量/函数: camelCase
const searchKeyword = ref('')
const handleSubmit = () => {}

// 常量: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10 * 1024 * 1024

// 布尔值: is/has 前缀
const isEdit = ref(false)
const hasErrors = ref(false)
```

### 响应式数据选择
```javascript
// 基本类型用 ref
const count = ref(0)
const title = ref('')

// 对象用 reactive
const form = reactive({
  username: '',
  password: ''
})

// 组件引用用 shallowRef (避免深层响应)
const editorRef = shallowRef()
```

---

## 已知问题和注意事项

### 1. WangEditor 依赖
- WangEditor 不支持 SSR（本项目无影响）
- 代码块插件包名 `@wangeditor/plugin-code-ee` 不存在，使用内置功能

### 2. 样式深度选择器
```vue
<style scoped>
/* 使用 :deep() 修改子组件样式 */
.wrapper :deep(.child-class) {
  color: red;
}
</style>
```

### 3. 路由跳转
```javascript
// 使用 useRouter 而非 <router-link>
const router = useRouter()
router.push('/path')
```

### 4. localStorage 操作
```javascript
// 读取时做 JSON 解析校验
const data = localStorage.getItem('notes')
if (data) {
  try {
    notes.value = JSON.parse(data)
  } catch (e) {
    console.error('数据解析失败', e)
  }
}

// 保存时确保数据可序列化
localStorage.setItem('notes', JSON.stringify(notes.value))
```

---

## 常见任务指南

### 添加新页面
1. 在 `src/views/` 创建 Vue 文件
2. 在 `src/router/index.js` 添加路由
3. 在导航栏添加入口（如需要）

### 添加新 API
1. 在 `src/api/` 创建模块文件
2. 导出 API 函数
3. 在组件中导入使用

### 修改主题颜色
1. 修改 CSS 变量 `--primary-gradient`
2. 全局搜索替换相关颜色值

### 添加新的笔记分类
1. 修改 `Notes.vue` 中的分类选项
2. 更新 `getCategoryIcon` 映射
3. 添加对应的 Element Plus 图标

---

## 后续开发建议

### 高优先级
- [ ] 接入真实后端 API
- [ ] 添加用户设置页面
- [ ] 实现笔记分享功能
- [ ] 添加数据导出（Markdown/PDF）

### 中优先级
- [ ] 添加图片压缩上传
- [ ] 实现笔记回收站
- [ ] 添加键盘快捷键
- [ ] 优化移动端适配

### 低优先级
- [ ] 多语言支持
- [ ] 主题切换（深/浅）
- [ ] 数据可视化
- [ ] 协作功能

---

## 快速命令参考

```bash
# 开发
npm run dev          # 启动开发服务器 (端口 3000)

# 构建
npm run build        # 生产构建
npm run preview      # 预览构建结果

# 依赖
npm install          # 安装依赖
npm install <pkg>    # 安装新包
```

---

**文档版本**: 1.0.0
**最后更新**: 2024-12-23
**维护者**: AI Assistant
