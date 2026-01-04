# Chat API 文档

> 基于 LangGraph Agent 的聊天服务 API，支持工具调用和多步推理。

## 基本信息

- **Base URL**: `http://your-domain.com/api/v1/chat`
- **Content-Type**: `application/json`
- **鉴权**: 无需鉴权（当前版本）

---

## API 接口列表

### 1. 发送聊天消息

发送消息给 AI 助手，获取回复。

**请求**
```http
POST /api/v1/chat
```

**请求体**
```json
{
  "message": "你好，帮我计算 123 * 456",
  "session_id": "user_123",
  "history": [
    {"role": "user", "content": "之前的消息"},
    {"role": "assistant", "content": "之前的回复"}
  ]
}
```

**请求参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | string | 是 | 用户消息内容 |
| session_id | string | 否 | 会话 ID，用于保持上下文（不传则使用默认值） |
| history | array | 否 | 历史消息记录 |

**history 数组项**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| role | string | 是 | `user` 或 `assistant` |
| content | string | 是 | 消息内容 |

**响应**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "reply": "123 * 456 = 56088",
    "chatId": 1
  }
}
```

**响应参数**

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 状态码，200 表示成功 |
| message | string | 提示信息 |
| data.reply | string | AI 助手的回复内容 |
| data.chatId | int | 对话 ID |

**Agent 能力**

- 💬 自然对话
- 🔢 数学计算（调用计算器工具）
- 🕐 获取当前时间
- 🌤️ 查询城市天气（模拟数据）

---

### 2. 获取对话历史列表

获取用户的所有对话列表。

**请求**
```http
GET /api/v1/chat/history
```

**响应**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 2,
    "list": [
      {
        "id": 1,
        "title": "对话 user_123",
        "createdAt": "2025-12-31T10:30:00",
        "updatedAt": "2025-12-31T12:00:00"
      },
      {
        "id": 2,
        "title": "我的新对话",
        "createdAt": "2025-12-31T08:00:00",
        "updatedAt": "2025-12-31T08:15:00"
      }
    ]
  }
}
```

**响应参数**

| 字段 | 类型 | 说明 |
|------|------|------|
| data.total | int | 对话总数 |
| data.list | array | 对话列表 |
| list[].id | int | 对话 ID |
| list[].title | string | 对话标题 |
| list[].createdAt | string | 创建时间（ISO 8601 格式） |
| list[].updatedAt | string | 更新时间（ISO 8601 格式） |

---

### 3. 获取对话详情

获取指定对话的所有消息。

**请求**
```http
GET /api/v1/chat/{chatId}
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chatId | int | 是 | 对话 ID |

**响应**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "title": "对话 user_123",
    "messages": [
      {
        "id": 1,
        "role": "user",
        "content": "你好",
        "createdAt": "2025-12-31T10:00:00"
      },
      {
        "id": 2,
        "role": "assistant",
        "content": "你好！很高兴为你服务！",
        "createdAt": "2025-12-31T10:00:05"
      }
    ],
    "createdAt": "2025-12-31T10:00:00",
    "updatedAt": "2025-12-31T10:00:05"
  }
}
```

**响应参数**

| 字段 | 类型 | 说明 |
|------|------|------|
| data.id | int | 对话 ID |
| data.title | string | 对话标题 |
| data.messages | array | 消息列表 |
| messages[].id | int | 消息 ID |
| messages[].role | string | `user` 或 `assistant` |
| messages[].content | string | 消息内容 |
| messages[].createdAt | string | 消息创建时间 |
| data.createdAt | string | 对话创建时间 |
| data.updatedAt | string | 对话更新时间 |

**错误响应** (404)
```json
{
  "detail": "对话不存在"
}
```

---

### 4. 创建新对话

创建一个新的对话。

**请求**
```http
POST /api/v1/chat/create
```

**请求体**
```json
{
  "title": "我的新对话"
}
```

**请求参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 对话标题（1-200 字符） |

**响应**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 3,
    "title": "我的新对话",
    "createdAt": "2025-12-31T12:00:00"
  }
}
```

---

### 5. 删除对话

删除指定的对话及其所有消息。

**请求**
```http
DELETE /api/v1/chat/{chatId}
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chatId | int | 是 | 对话 ID |

**响应**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

**错误响应** (404)
```json
{
  "detail": "对话不存在"
}
```

---

### 6. 清空对话消息

清空指定对话的所有消息（保留对话本身）。

**请求**
```http
POST /api/v1/chat/{chatId}/clear
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chatId | int | 是 | 对话 ID |

**响应**
```json
{
  "code": 200,
  "message": "清空成功",
  "data": null
}
```

**错误响应** (404)
```json
{
  "detail": "对话不存在"
}
```

---

## 通用说明

### 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 404 | 资源不存在 |
| 422 | 请求参数验证失败 |
| 500 | 服务器内部错误 |

### 统一响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

### Session ID 说明

- `session_id` 用于标识和保持对话上下文
- 相同的 `session_id` 会关联到同一个对话
- 不传 `session_id` 时，系统会自动生成默认值
- 前端可使用用户 ID 或唯一标识作为 `session_id`

---

## 前端集成示例

### 发送消息

```javascript
const response = await fetch('/api/v1/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: '你好，帮我计算 100 * 200',
    session_id: 'user_123'
  })
});

const result = await response.json();
console.log(result.data.reply); // "100 * 200 = 20000"
console.log(result.data.chatId); // 1
```

### 获取对话历史

```javascript
const response = await fetch('/api/v1/chat/history');
const result = await response.json();
console.log(result.data.list); // 对话列表
```

### 获取对话详情

```javascript
const chatId = 1;
const response = await fetch(`/api/v1/chat/${chatId}`);
const result = await response.json();
console.log(result.data.messages); // 消息列表
```

---

## 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2025-12-31 | 初始版本，基于 LangGraph Agent 实现 |
