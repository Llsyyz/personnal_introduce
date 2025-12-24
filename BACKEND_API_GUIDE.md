# NoteSpace 后端 API 开发指南

> 本文档专为后端开发 AI 助手设计，提供完整的 API 接口规范、数据结构和实现说明。

---

## 项目概述

**项目名称**: NoteSpace
**前端框架**: Vue 3 + Element Plus
**后端框架**: Spring Boot
**数据存储**: 当前使用 localStorage，需迁移至后端数据库

**核心功能模块**:
1. 用户认证（登录/登出）
2. 个人历程管理（时间轴）
3. 笔记管理（富文本）
4. 相册管理（照片上传）

---

## 统一响应格式

所有 API 接口应遵循以下响应格式：

### 成功响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { }
}
```

### 失败响应

```json
{
  "code": 400/401/403/404/500,
  "message": "错误描述",
  "data": null
}
```

### 常用状态码

| Code | 说明 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token 过期 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 认证机制

### Token 认证

前端在请求头中携带 Token：

```http
Authorization: Bearer {token}
```

### Token 过期时间

- 有效期：7 天
- 过期后返回 401，前端需跳转登录页

---

## 数据库表设计

### 1. 用户表 (user)

```sql
CREATE TABLE `user` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  `nickname` VARCHAR(50) COMMENT '昵称',
  `avatar` VARCHAR(500) COMMENT '头像URL',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 2. 历程表 (experience)

```sql
CREATE TABLE `experience` (
  `id` BIGINT PRIMARY KEY COMMENT '历程ID（使用时间戳）',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `date` DATE NOT NULL COMMENT '日期',
  `content` TEXT COMMENT '富文本内容（HTML）',
  `tags` JSON COMMENT '标签数组',
  `color` VARCHAR(20) DEFAULT '#409EFF' COMMENT '颜色标记',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='历程表';
```

### 3. 笔记表 (note)

```sql
CREATE TABLE `note` (
  `id` BIGINT PRIMARY KEY COMMENT '笔记ID（使用时间戳）',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `category` VARCHAR(20) NOT NULL COMMENT '分类：学习/工作/生活/想法/其他',
  `color` VARCHAR(20) DEFAULT '#409EFF' COMMENT '颜色标记',
  `content` MEDIUMTEXT COMMENT '富文本内容（HTML）',
  `tags` JSON COMMENT '标签数组',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='笔记表';
```

### 4. 照片表 (photo)

```sql
CREATE TABLE `photo` (
  `id` BIGINT PRIMARY KEY COMMENT '照片ID（使用时间戳）',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `title` VARCHAR(200) NOT NULL COMMENT '照片标题',
  `description` TEXT COMMENT '照片描述',
  `category` VARCHAR(20) NOT NULL COMMENT '分类：生活/旅行/风景/人物/美食',
  `url` VARCHAR(1000) NOT NULL COMMENT '图片URL',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='照片表';
```

---

## API 接口规范

### 基础路径

```
/api/v1
```

---

## 1. 认证模块

### 1.1 用户登录

**接口**: `POST /api/v1/auth/login`

**请求参数**:

```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "avatar": "https://example.com/avatar.png"
    }
  }
}
```

**验证规则**:
- 用户名：3-20 字符
- 密码：6-20 字符

---

### 1.2 获取用户信息

**接口**: `GET /api/v1/auth/userinfo`

**请求头**:
```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "avatar": "https://example.com/avatar.png"
  }
}
```

---

### 1.3 退出登录

**接口**: `POST /api/v1/auth/logout`

**请求头**:
```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "退出成功"
}
```

---

## 2. 历程模块

### 2.1 获取历程列表

**接口**: `GET /api/v1/experiences`

**请求头**:
```
Authorization: Bearer {token}
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Integer | 否 | 页码，默认 1 |
| size | Integer | 否 | 每页数量，默认 20 |
| tag | String | 否 | 标签筛选 |
| keyword | String | 否 | 关键词搜索 |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "total": 10,
    "list": [
      {
        "id": 1735027200000,
        "title": "开始学习 Vue 3",
        "date": "2024-12-24",
        "content": "<p>今天开始学习 Vue 3...</p>",
        "tags": ["学习", "前端"],
        "color": "#409EFF",
        "createdAt": "2024-12-24T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 2.2 创建历程

**接口**: `POST /api/v1/experiences`

**请求头**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "title": "开始学习 Vue 3",
  "date": "2024-12-24",
  "content": "<p>今天开始学习 Vue 3...</p>",
  "tags": ["学习", "前端"],
  "color": "#409EFF"
}
```

**响应示例**:

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

### 2.3 更新历程

**接口**: `PUT /api/v1/experiences/{id}`

**请求头**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 历程ID |

**请求参数**: 同创建历程

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功"
}
```

---

### 2.4 删除历程

**接口**: `DELETE /api/v1/experiences/{id}`

**请求头**:
```
Authorization: Bearer {token}
```

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 历程ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 3. 笔记模块

### 3.1 获取笔记列表

**接口**: `GET /api/v1/notes`

**请求头**:
```
Authorization: Bearer {token}
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Integer | 否 | 页码，默认 1 |
| size | Integer | 否 | 每页数量，默认 20 |
| category | String | 否 | 分类筛选 |
| keyword | String | 否 | 关键词搜索（标题/内容/标签） |

**响应示例**:

```json
{
  "code": 200,
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
        "createdAt": "2024-12-24T10:00:00.000Z",
        "updatedAt": "2024-12-24T15:30:00.000Z"
      }
    ]
  }
}
```

---

### 3.2 创建笔记

**接口**: `POST /api/v1/notes`

**请求头**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求参数**:

```json
{
  "title": "Vue 3 学习笔记",
  "category": "学习",
  "color": "#409EFF",
  "content": "<p>Vue 3 是...</p>",
  "tags": ["前端", "Vue"]
}
```

**响应示例**:

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

### 3.3 获取笔记详情

**接口**: `GET /api/v1/notes/{id}`

**请求头**:
```
Authorization: Bearer {token}
```

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 笔记ID |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": 1735027200000,
    "title": "Vue 3 学习笔记",
    "category": "学习",
    "color": "#409EFF",
    "content": "<p>Vue 3 是...</p>",
    "tags": ["前端", "Vue"],
    "createdAt": "2024-12-24T10:00:00.000Z",
    "updatedAt": "2024-12-24T15:30:00.000Z"
  }
}
```

---

### 3.4 更新笔记

**接口**: `PUT /api/v1/notes/{id}`

**请求头**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 笔记ID |

**请求参数**: 同创建笔记

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功"
}
```

---

### 3.5 删除笔记

**接口**: `DELETE /api/v1/notes/{id}`

**请求头**:
```
Authorization: Bearer {token}
```

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 笔记ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

### 3.6 获取分类统计

**接口**: `GET /api/v1/notes/stats`

**请求头**:
```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
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

## 4. 相册模块

### 4.1 获取照片列表

**接口**: `GET /api/v1/photos`

**请求头**:
```
Authorization: Bearer {token}
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | Integer | 否 | 页码，默认 1 |
| size | Integer | 否 | 每页数量，默认 20 |
| category | String | 否 | 分类筛选 |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "total": 12,
    "list": [
      {
        "id": 1735027200000,
        "title": "海边日落",
        "description": "美丽的日落景色",
        "category": "风景",
        "url": "https://example.com/photos/sunset.jpg",
        "createdAt": "2024-12-24T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 4.2 上传照片

**接口**: `POST /api/v1/photos`

**请求头**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**表单参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 图片文件 |
| title | String | 是 | 照片标题 |
| description | String | 否 | 照片描述 |
| category | String | 是 | 分类：生活/旅行/风景/人物/美食 |

**响应示例**:

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "id": 1735027200000,
    "url": "https://example.com/photos/sunset.jpg"
  }
}
```

**文件上传限制**:
- 支持格式：jpg, jpeg, png, gif, webp
- 文件大小：最大 10MB

---

### 4.3 获取照片详情

**接口**: `GET /api/v1/photos/{id}`

**请求头**:
```
Authorization: Bearer {token}
```

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 照片ID |

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": 1735027200000,
    "title": "海边日落",
    "description": "美丽的日落景色",
    "category": "风景",
    "url": "https://example.com/photos/sunset.jpg",
    "createdAt": "2024-12-24T10:00:00.000Z"
  }
}
```

---

### 4.4 更新照片信息

**接口**: `PUT /api/v1/photos/{id}`

**请求头**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 照片ID |

**请求参数**:

```json
{
  "title": "海边日落",
  "description": "美丽的日落景色",
  "category": "风景"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "更新成功"
}
```

---

### 4.5 删除照片

**接口**: `DELETE /api/v1/photos/{id}`

**请求头**:
```
Authorization: Bearer {token}
```

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | Long | 照片ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

### 4.6 获取分类统计

**接口**: `GET /api/v1/photos/stats`

**请求头**:
```
Authorization: Bearer {token}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "total": 12,
    "生活": 3,
    "旅行": 2,
    "风景": 4,
    "人物": 2,
    "美食": 1
  }
}
```

---

## 数据结构说明

### 日期格式

所有日期字段使用 **ISO 8601** 格式：

```
2024-12-24T10:00:00.000Z
```

### JSON 字段

`tags` 字段存储为 JSON 数组：

```json
["学习", "前端", "Vue"]
```

在 MySQL 中使用 `JSON` 类型，Spring Boot 中使用 `JDBC` 或 `JPA` 的 JSON 处理。

### ID 生成策略

建议使用 **雪花算法（Snowflake）** 或 **时间戳** 作为 ID：

```java
// 示例：使用时间戳作为 ID
Long id = System.currentTimeMillis();
```

---

## Spring Boot 实现建议

### 1. 依赖配置

```xml
<dependencies>
    <!-- Spring Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- MySQL -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>

    <!-- 文件上传 -->
    <dependency>
        <groupId>commons-fileupload</groupId>
        <artifactId>commons-fileupload</artifactId>
        <version>1.4</version>
    </dependency>
</dependencies>
```

### 2. 统一响应封装

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result<T> {
    private Integer code;
    private String message;
    private T data;

    public static <T> Result<T> success(T data) {
        return new Result<>(200, "操作成功", data);
    }

    public static <T> Result<T> error(String message) {
        return new Result<>(400, message, null);
    }
}
```

### 3. JWT 工具类

```java
@Component
public class JwtUtil {
    private String secret = "your-secret-key";
    private long expiration = 7 * 24 * 60 * 60 * 1000; // 7天

    public String generateToken(User user) {
        // 实现 JWT 生成逻辑
    }

    public Claims parseToken(String token) {
        // 实现 JWT 解析逻辑
    }
}
```

### 4. 拦截器配置

```java
@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request,
                            HttpServletResponse response,
                            Object handler) {
        // 验证 Token
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            // 验证逻辑
            return true;
        }
        response.setStatus(401);
        return false;
    }
}
```

---

## 开发优先级

### 第一阶段（基础功能）
1. 用户认证（登录/登出）
2. 历程 CRUD
3. 笔记 CRUD

### 第二阶段（完整功能）
1. 照片上传与管理
2. 搜索与筛选
3. 统计接口

### 第三阶段（优化）
1. 图片云存储集成
2. 数据导出功能
3. 性能优化

---

**文档版本**: 1.0.0
**创建日期**: 2024-12-24
**维护者**: AI Assistant
