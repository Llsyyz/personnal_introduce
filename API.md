# NoteSpace 后端 API 接口文档

> 前端项目基于 Vue 3 + Element Plus 开发的个人笔记管理系统

## 基础信息

### 服务器地址
```
http://127.0.0.1:8080/api/v1
```

### 通用请求头
```
Content-Type: application/json
Authorization: Bearer {token}  // 需要认证的接口
```

### 统一响应格式
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 响应状态码
| Code | 说明 |
|------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或 Token 过期 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 一、认证接口 (Auth)

### 1.1 用户注册
```
POST /api/v1/auth/register
```

**请求参数：**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应示例：**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": null
}
```

---

### 1.2 用户登录
```
POST /api/v1/auth/login
```

**请求参数：**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应示例：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "testuser",
    "nickname": "测试用户",
    "avatar": "https://example.com/avatar.png"
  }
}
```

**Token 存储说明：**
- 前端将 token 存储在 `localStorage` 中，key 为 `token`
- 每次请求会在 Header 中携带 `Authorization: Bearer {token}`
- 用户信息存储在 `localStorage` 中，key 为 `userInfo`

---

### 1.3 获取用户信息
```
GET /api/v1/auth/userinfo
```

**请求头：**
```
Authorization: Bearer {token}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "nickname": "测试用户",
    "email": "test@example.com",
    "avatar": "https://example.com/avatar.png",
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

---

### 1.4 退出登录
```
POST /api/v1/auth/logout
```

**请求头：**
```
Authorization: Bearer {token}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

---

## 二、笔记接口 (Notes)

### 2.1 获取笔记列表
```
GET /api/v1/notes?page=1&size=20&category=学习&keyword=Vue
```

**请求头：**
```
Authorization: Bearer {token}
```

**Query 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| size | number | 否 | 每页数量，默认 20 |
| category | string | 否 | 分类筛选：学习/工作/生活/想法/其他 |
| keyword | string | 否 | 搜索关键词（标题和内容模糊查询） |

**响应示例：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 15,
    "list": [
      {
        "id": 1735027200000,
        "title": "Vue 3 学习笔记",
        "category": "学习",
        "color": "#409EFF",
        "content": "<p>Vue 3 是...</p>",
        "tags": ["前端", "Vue"],
        "createdAt": "2024-12-24T10:00:00",
        "updatedAt": "2024-12-24T15:30:00"
      }
    ]
  }
}
```

---

### 2.2 获取笔记详情
```
GET /api/v1/notes/{id}
```

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 笔记 ID |

**响应示例：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1735027200000,
    "title": "Vue 3 学习笔记",
    "category": "学习",
    "color": "#409EFF",
    "content": "<p>Vue 3 是...</p>",
    "tags": ["前端", "Vue"],
    "createdAt": "2024-12-24T10:00:00",
    "updatedAt": "2024-12-24T15:30:00"
  }
}
```

---

### 2.3 创建笔记
```
POST /api/v1/notes
```

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**
```json
{
  "title": "Vue 3 学习笔记",
  "category": "学习",
  "color": "#409EFF",
  "content": "<p>Vue 3 是...</p>",
  "tags": ["前端", "Vue"]
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 笔记标题 |
| category | string | 是 | 分类：学习/工作/生活/想法/其他 |
| color | string | 否 | 颜色标记，如 #409EFF |
| content | string | 是 | 富文本内容（HTML 格式） |
| tags | array | 否 | 标签数组，如 ["前端", "Vue"] |

**响应示例：**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1735027200000
  }
}
```

---

### 2.4 更新笔记
```
PUT /api/v1/notes/{id}
```

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 笔记 ID |

**请求参数：**
```json
{
  "title": "更新后的标题",
  "category": "工作",
  "color": "#67C23A",
  "content": "<p>更新后的内容</p>",
  "tags": ["更新"]
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

---

### 2.5 删除笔记
```
DELETE /api/v1/notes/{id}
```

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 笔记 ID |

**响应示例：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

### 2.6 获取笔记统计
```
GET /api/v1/notes/stats
```

**请求头：**
```
Authorization: Bearer {token}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 15,
    "学习": 5,
    "工作": 3,
    "生活": 4,
    "想法": 2,
    "其他": 1
  }
}
```

---

## 三、AI 聊天接口 (Chat)

### 3.1 发送聊天消息
```
POST /api/v1/chat
```

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**
```json
{
  "message": "你好，请帮我写一篇学习笔记",
  "history": [
    { "role": "user", "content": "之前的消息" },
    { "role": "assistant", "content": "之前的回复" }
  ]
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | string | 是 | 用户消息内容 |
| history | array | 否 | 历史消息记录，用于上下文理解 |

**响应示例：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "reply": "你好！我很乐意帮助你...",
    "chatId": 12345
  }
}
```

---

### 3.2 获取对话历史列表
```
GET /api/v1/chat/history
```

**请求头：**
```
Authorization: Bearer {token}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 5,
    "list": [
      {
        "id": 12345,
        "title": "关于 Vue 3 的讨论",
        "createdAt": "2024-12-24T10:00:00",
        "updatedAt": "2024-12-24T15:30:00"
      }
    ]
  }
}
```

---

### 3.3 获取对话详情
```
GET /api/v1/chat/{chatId}
```

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chatId | number | 是 | 对话 ID |

**响应示例：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 12345,
    "title": "关于 Vue 3 的讨论",
    "messages": [
      {
        "id": 1,
        "role": "user",
        "content": "Vue 3 有什么新特性？",
        "createdAt": "2024-12-24T10:00:00"
      },
      {
        "id": 2,
        "role": "assistant",
        "content": "Vue 3 引入了 Composition API...",
        "createdAt": "2024-12-24T10:00:05"
      }
    ]
  }
}
```

---

### 3.4 创建新对话
```
POST /api/v1/chat
```

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数：**
```json
{
  "title": "新对话"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 对话标题 |

**响应示例：**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 12346,
    "title": "新对话"
  }
}
```

---

### 3.5 删除对话
```
DELETE /api/v1/chat/{chatId}
```

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chatId | number | 是 | 对话 ID |

**响应示例：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

### 3.6 清空对话消息
```
POST /api/v1/chat/{chatId}/clear
```

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chatId | number | 是 | 对话 ID |

**响应示例：**
```json
{
  "code": 200,
  "message": "清空成功",
  "data": null
}
```

---

## 四、数据库表结构建议

### 用户表 (user)
```sql
CREATE TABLE user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL COMMENT 'SHA-256 加密',
  email VARCHAR(100),
  nickname VARCHAR(50),
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 笔记表 (note)
```sql
CREATE TABLE note (
  id BIGINT PRIMARY KEY COMMENT '时间戳作为 ID',
  user_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(20) NOT NULL COMMENT '学习/工作/生活/想法/其他',
  color VARCHAR(20) DEFAULT '#409EFF',
  content MEDIUMTEXT COMMENT '富文本 HTML',
  tags JSON COMMENT '标签数组',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id)
);
```

### 对话表 (chat)
```sql
CREATE TABLE chat (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id)
);
```

### 聊天消息表 (chat_message)
```sql
CREATE TABLE chat_message (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  chat_id BIGINT NOT NULL,
  role VARCHAR(20) NOT NULL COMMENT 'user/assistant',
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
);
```

---

## 五、前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4+ | 前端框架 |
| Element Plus | Latest | UI 组件库 |
| Vue Router | 4.2+ | 路由管理 |
| Axios | Latest | HTTP 请求 |
| Pinia | Latest | 状态管理 |

---

## 六、注意事项

1. **Token 认证**：除注册和登录接口外，所有接口都需要在 Header 中携带 Token
2. **时间格式**：所有时间字段使用 ISO 8601 格式 (YYYY-MM-DDTHH:mm:ss)
3. **富文本内容**：笔记的 content 字段存储的是 HTML 格式的富文本
4. **密码加密**：前端发送的密码是明文，后端需要使用 SHA-256 加密存储
5. **CORS 配置**：后端需要配置允许跨域访问
6. **分页参数**：page 从 1 开始，不是从 0 开始
7. **错误处理**：所有错误响应都应该包含明确的错误信息
