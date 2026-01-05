# NoteSpace 登录接口文档

## 目录

- [功能概述](#功能概述)
- [双 Token 机制](#双-token-机制)
- [API 接口](#api-接口)
- [错误码说明](#错误码说明)
- [登录功能演进](#登录功能演进)

---

## 功能概述

NoteSpace 后端提供两种登录方式：

1. **用户名密码登录** - 传统的用户名 + 密码登录
2. **手机号验证码登录** - 手机号 + SMS 验证码登录

两种方式均采用**双 Token 机制**（Access Token + Refresh Token）。

---

## 双 Token 机制

### 为什么使用双 Token？

| Token 类型 | 有效期 | 用途 | 存储位置 |
|-----------|--------|------|---------|
| **Access Token** | 24 小时（可配置） | 用于 API 请求认证 | LocalStorage / SessionStorage |
| **Refresh Token** | 7 天（可配置） | 用于刷新 Access Token | HttpOnly Cookie / LocalStorage |

### 双 Token 流程图

```
┌─────────┐                    ┌─────────┐
│  前端   │                    │  后端   │
└────┬────┘                    └────┬────┘
     │                              │
     │  1. POST /auth/login         │
     ├─────────────────────────────>│
     │                              │ 生成 Token 对
     │  2. accessToken + refreshToken│
     │<─────────────────────────────┤
     │                              │
     │  3. 存储 Token               │
     │   accessToken: LS           │
     │   refreshToken: LS          │
     │                              │
     │  4. API 请求 (accessToken)   │
     ├─────────────────────────────>│
     │<─────────────────────────────┤
     │                              │
     │  5. accessToken 过期          │
     │                              │
     │  6. POST /auth/refresh       │
     │     (refreshToken)           │
     ├─────────────────────────────>│
     │  7. 新的 Token 对            │
     │<─────────────────────────────┤
     │                              │
```

### 前端实现建议

```typescript
// 请求拦截器 - 自动携带 Access Token
axios.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 响应拦截器 - 自动刷新 Token
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Access Token 过期，自动刷新
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken });
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return axios(originalRequest);
        } catch {
          // Refresh Token 也过期了，跳转登录页
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);
```

---

## API 接口

### Base URL

```
http://your-domain/api/v1
```

---

### 1. 用户名密码登录

**接口地址：** `POST /auth/login`

**请求参数：**

```json
{
  "username": "testuser",
  "password": "password123"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，3-20 个字符 |
| password | string | 是 | 密码，6-20 个字符 |

**响应示例：**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expireIn": 86400,
    "userInfo": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": null
    }
  }
}
```

---

### 2. 手机号验证码登录

#### 2.1 获取验证码

**接口地址：** `POST /login/verify-code`

**请求参数：**

```json
{
  "phone": "13800138000"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 11 位手机号 |

**响应示例（开发环境）：**

```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": "1234"
}
```

**响应示例（生产环境）：**

```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": ""
}
```

**说明：**
- 开发环境 (`prod-mode: false`) 会返回验证码，方便测试
- 生产环境 (`prod-mode: true`) 验证码通过短信发送，不返回

#### 2.2 验证码登录

**接口地址：** `POST /login`

**请求参数：**

```json
{
  "phone": "13800138000",
  "captcha": "1234"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 11 位手机号 |
| captcha | string | 是 | 6 位验证码 |

**响应示例：**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expireIn": 86400
  }
}
```

---

### 3. 刷新 Token

**接口地址：** `POST /auth/refresh`

**请求参数：**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expireIn": 86400,
    "userInfo": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": null
    }
  }
}
```

**说明：**
- 每次刷新会返回**新的** Access Token 和 Refresh Token
- 旧的 Refresh Token 会立即失效
- 请及时更新本地存储的 Token

---

### 4. 获取用户信息

**接口地址：** `GET /auth/userinfo`

**请求头：**

```
Authorization: Bearer {accessToken}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "testuser",
    "nickname": "测试用户",
    "avatar": null
  }
}
```

---

### 5. 退出登录

**接口地址：** `POST /auth/logout`

**请求头：**

```
Authorization: Bearer {accessToken}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

**说明：**
- 后端会删除 Redis 中的 Token
- 前端需自行清除本地存储的 Token

---

### 6. 用户注册

**接口地址：** `POST /auth/register`

**请求参数：**

```json
{
  "username": "newuser",
  "password": "password123",
  "nickname": "新用户"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，3-20 个字符，唯一 |
| password | string | 是 | 密码，6-20 个字符 |
| nickname | string | 否 | 昵称，默认为用户名 |

**响应示例：**

```json
{
  "code": 200,
  "message": "注册成功",
  "data": null
}
```

---

## 错误码说明

### 通用错误码

| 错误码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，Token 无效或过期 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 业务错误码

| 错误码 | 说明 |
|-------|------|
| 10001 | 手机号格式无效 |
| 10002 | 用户不存在 |
| 10003 | 用户已被禁用 |
| 10004 | 用户名已存在 |
| 10005 | 用户名格式无效 |
| 10006 | 密码格式无效 |
| 10007 | 用户名或密码错误 |
| 11001 | 验证码错误 |
| 11002 | 验证码已过期 |
| 11003 | 短信发送失败 |
| 11004 | 短信发送过于频繁 |
| 12001 | 账号已被冻结 |
| 13001 | Token 无效 |
| 13002 | Token 已过期 |

### 错误响应格式

```json
{
  "code": 401,
  "message": "Token 已失效，请重新登录",
  "data": null
}
```

---

## 登录功能演进

### Version 1.0: 基础 JWT 认证

**特点：**
- 用户名 + 密码登录
- 生成单个 JWT Token
- 前端存储 Token，请求时携带
- 后端只验证 JWT 签名和有效期

**问题：**
- Token 一旦签发，无法主动吊销
- 用户退出登录后，Token 仍然有效（直到过期）
- 存在安全隐患

**流程：**

```
登录 → 生成 JWT → 前端存储 → 请求携带 → 后端验证 JWT 签名
```

---

### Version 2.0: Redis 存储 Token

**改进点：**
- 登录后，Token 存储到 Redis
- 请求时，后端同时验证 JWT 签名 和 Redis 存在性
- 退出登录时，从 Redis 删除 Token
- 实现了 Token 的主动吊销

**流程：**

```
登录 → 生成 JWT → 存储 Redis → 前端存储
                ↓
请求 → 验证 JWT → 验证 Redis → 通过
                ↓
退出 → 删除 Redis → Token 失效
```

---

### Version 3.0: 双 Token 机制（当前版本）

**改进点：**
- Access Token：短期有效（24 小时），用于 API 认证
- Refresh Token：长期有效（7 天），用于刷新 Access Token
- 前端实现自动刷新，用户无感知
- 平衡安全性与用户体验

**流程：**

```
登录 → Access Token (24h) + Refresh Token (7d)
                ↓
API 请求 → Access Token 过期 → 自动刷新 → 新 Token 对
                ↓
Refresh Token 过期 → 重新登录
```

**对比总结：**

| 特性 | V1.0 | V2.0 | V3.0 |
|------|------|------|------|
| JWT 验证 | ✅ | ✅ | ✅ |
| Redis 存储 | ❌ | ✅ | ✅ |
| Token 吊销 | ❌ | ✅ | ✅ |
| 自动刷新 | ❌ | ❌ | ✅ |
| 安全性 | 中 | 高 | 高 |
| 用户体验 | 中 | 中 | 高 |

---

## 前端集成示例

### NoteSpace 前端实现 (Vue 3)

以下是 NoteSpace 项目中实际使用的双 Token 机制实现：

#### 1. API 接口封装 (`src/api/login.js`)

```javascript
/**
 * 登录相关的 API 接口 - 双 Token 机制
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'

const API_BASE = 'http://127.0.0.1:8080/api/v1'

/**
 * 用户登录
 */
export const loginApi = (username, password) => {
  return axios.post(`${API_BASE}/auth/login`, { username, password }).then(res => res.data)
}

/**
 * 刷新 Token
 */
export const refreshTokenApi = (refreshToken) => {
  return axios.post(`${API_BASE}/auth/refresh`, { refreshToken }).then(res => res.data)
}

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => {
  return axios.get(`${API_BASE}/auth/userinfo`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  }).then(res => res.data)
}

/**
 * 退出登录
 */
export const logoutApi = () => {
  return axios.post(`${API_BASE}/auth/logout`, {}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  }).then(res => res.data)
}

/**
 * 用户注册
 */
export const registerApi = (username, password) => {
  return axios.post(`${API_BASE}/auth/register`, { username, password }).then(res => res.data)
}
```

#### 2. Axios 请求拦截器 (`src/utils/request.js`)

```javascript
/**
 * Axios 请求配置 - 双 Token 机制
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { refreshTokenApi } from '@/api/login'

// 是否正在刷新 Token
let isRefreshing = false
// 失败队列
let failedQueue = []

// 处理队列
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 自动携带 Access Token
service.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 自动刷新 Token
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  async error => {
    const originalRequest = error.config

    if (!error.response) {
      ElMessage.error('网络连接失败，请检查后端服务是否启动')
      return Promise.reject(error)
    }

    const { status } = error.response

    // 401: Token 过期，自动刷新
    if (status === 401) {
      // 如果已经有重试标记，说明刷新失败
      if (originalRequest._retry) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // 如果正在刷新，将请求加入队列
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return service(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      // 开始刷新 Token
      isRefreshing = true
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // 调用刷新接口
        const res = await refreshTokenApi(refreshToken)

        // 存储新的 Token
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)

        // 更新用户信息
        if (res.data.userInfo) {
          localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
        }

        // 处理队列中的请求
        processQueue(null, res.data.accessToken)

        // 重试当前请求
        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.accessToken
        return service(originalRequest)

      } catch (refreshError) {
        // 刷新失败，清除存储并跳转登录
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 处理其他错误状态码
    switch (status) {
      case 403:
        ElMessage.error('禁止访问')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器内部错误')
        break
      default:
        ElMessage.error(error.response.data?.message || '请求失败')
    }

    return Promise.reject(error)
  }
)

export default service
```

#### 3. 登录组件 (`src/views/Login.vue`)

```vue
<script setup>
import { loginApi } from '@/api/login'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 登录处理
const handleLogin = async () => {
  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    const response = await loginApi(loginForm.username, loginForm.password)
    ElMessage.success(response.message)

    // 存储 accessToken 和 refreshToken
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)
    localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))

    // 跳转到首页或重定向页面
    const redirect = route.query.redirect || '/home'
    router.push(redirect)

  } catch (error) {
    ElMessage.error(error.message || '登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>
```

#### 4. 路由守卫 (`src/router/index.js`)

```javascript
/**
 * 检查登录状态是否有效（双 Token 机制）
 */
const isAuthenticated = () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (!accessToken || !refreshToken) {
      return false
    }

    // 双 Token 机制由服务端处理过期，前端只检查存在性
    // Token 过期时，axios 拦截器会自动刷新或跳转登录
    return true
  } catch (error) {
    console.error('检查登录状态出错:', error)
    return false
  }
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'NoteSpace'

  if (to.meta.requiresAuth) {
    if (isAuthenticated()) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    if (to.path === '/login' && isAuthenticated()) {
      next('/home')
    } else {
      next()
    }
  }
})
```

#### 5. 退出登录

```javascript
// 退出登录处理
const handleLogout = async () => {
  try {
    await logoutApi()
    // 清除所有认证信息
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch (error) {
    ElMessage.error('退出失败，请重试')
  }
}
```

---

## 联系方式

如有问题，请联系后端开发团队。
