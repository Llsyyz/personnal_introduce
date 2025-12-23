# Vue 3 + Element Plus 登录功能示例

一个标准的 Vue 3 项目，包含完整的登录功能和 Apple 风格设计，适合初学者学习。

## 项目结构

```
vue-login-demo/
├── public/                 # 静态资源目录
├── src/
│   ├── api/               # API 接口目录
│   │   └── login.js       # 登录相关接口
│   ├── assets/            # 资源文件目录
│   │   └── css/           # 样式文件
│   ├── components/        # 公共组件目录
│   ├── router/            # 路由配置目录
│   │   └── index.js       # 路由配置文件
│   ├── views/             # 页面组件目录
│   │   ├── Login.vue      # 登录页面
│   │   └── Home.vue       # 首页
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

### 1. 登录功能
- 表单验证（用户名、密码格式验证）
- 记住我功能
- 登录状态加载动画
- 错误提示

### 2. 路由功能
- 登录页 `/login`
- 首页 `/home`
- 路由守卫（未登录自动跳转到登录页）

### 3. 用户信息
- 登录成功后保存 token 和用户信息
- 首页展示用户信息
- 退出登录功能

## 代码详解

### 一、入口文件 index.html

这是应用的 HTML 入口，只包含一个挂载点：

```html
<div id="app"></div>
<script type="module" src="/src/main.js"></script>
```

### 二、应用入口 main.js

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
```

**解释**：
- `createApp(App)`：创建 Vue 应用实例
- `app.use(router)`：注册路由插件
- `app.use(ElementPlus)`：注册 Element Plus 组件库
- `app.mount('#app')`：挂载到 DOM

### 三、根组件 App.vue

```vue
<template>
  <router-view />
</template>
```

**解释**：`<router-view />` 是路由出口，根据 URL 显示对应页面

### 四、路由配置 router/index.js

```javascript
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home, meta: { requiresAuth: true } }
]
```

**解释**：
- `/` 重定向到 `/login`
- `/home` 设置了 `requiresAuth: true`，需要登录才能访问

### 五、登录页面 Login.vue

#### 1. 响应式数据

```javascript
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})
```

#### 2. 表单验证规则

```javascript
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}
```

#### 3. 登录处理

```javascript
const handleLogin = async () => {
  // 1. 验证表单
  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return

  // 2. 调用接口
  const response = await loginApi(loginForm.username, loginForm.password)

  // 3. 保存 token
  localStorage.setItem('token', response.data.token)

  // 4. 跳转首页
  router.push('/home')
}
```

### 六、API 接口 api/login.js

```javascript
export const loginApi = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        resolve({ code: 200, message: '登录成功', data: {...} })
      } else {
        reject({ message: '用户名或密码错误' })
      }
    }, 1000)
  })
}
```

**解释**：这是模拟的异步接口，实际项目中会替换成真实的 API 请求

## Vue 3 核心概念

### 1. setup 语法糖

```vue
<script setup>
import { ref, reactive, onMounted } from 'vue'

const count = ref(0)
const user = reactive({ name: 'admin' })

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

### 3. 路由使用

```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转页面
router.push('/home')

// 带参数跳转
router.push({ path: '/user', query: { id: 1 } })
```

### 4. 组件通信

```vue
<!-- 父组件传递数据 -->
<Child :message="parentMsg" />

<!-- 子组件接收 -->
<script setup>
const props = defineProps({
  message: String
})
</script>
```

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4+ | 渐进式 JavaScript 框架 |
| Vue Router | 4.2+ | Vue 官方路由管理器 |
| Element Plus | 2.5+ | Vue 3 组件库 |
| Vite | 5.0+ | 下一代前端构建工具 |

## 学习建议

1. **理解项目结构**：先熟悉各个文件的作用
2. **运行项目**：实际操作，观察页面效果
3. **修改样式**：尝试修改 CSS，理解样式作用
4. **添加功能**：尝试添加注册页面、修改密码等功能
5. **接入真实接口**：将模拟接口替换成真实的后端 API

## 常见问题

### 1. npm install 很慢？
可以使用国内镜像：
```bash
npm config set registry https://registry.npmmirror.com
```

### 2. 端口被占用？
修改 `vite.config.js` 中的 `server.port` 配置

### 3. 如何部署？
运行 `npm run build` 后，将 `dist` 目录部署到服务器
