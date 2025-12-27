# NoteSpace Backend

一个基于 Spring Boot 的个人笔记管理系统后端 API。

## 项目简介

NoteSpace 是一个全功能的个人笔记管理平台，支持历程记录、笔记管理和照片管理等功能。本项目是其后端服务，采用 RESTful API 设计。

## 技术栈

- **Java 17** - 编程语言
- **Spring Boot 3.2.0** - 应用框架
- **Spring Data JPA** - 数据持久化
- **MySQL** - 数据库
- **JWT (JJWT)** - 认证授权
- **Lombok** - 代码简化
- **Maven** - 项目构建

## 项目结构

```
notespace-backend/
├── src/main/java/com/notespace/backend/
│   ├── NoteSpaceApplication.java    # 主程序入口
│   ├── common/                      # 通用组件
│   │   └── Result.java              # 统一响应格式
│   ├── config/                      # 配置类
│   │   └── WebMvcConfig.java
│   ├── controller/                  # 控制器层
│   │   └── AuthController.java
│   ├── dto/                         # 数据传输对象
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   └── RegisterRequest.java
│   ├── entity/                      # 实体类
│   │   └── User.java
│   ├── exception/                   # 异常处理
│   │   └── GlobalExceptionHandler.java
│   ├── interceptor/                 # 拦截器
│   │   └── AuthInterceptor.java
│   ├── repository/                  # 数据访问层
│   │   └── UserRepository.java
│   ├── service/                     # 业务逻辑层
│   │   └── UserService.java
│   └── util/                        # 工具类
│       ├── JwtUtil.java
│       └── PasswordUtil.java
└── src/main/resources/
    ├── application.yml              # 应用配置
    └── schema.sql                   # 数据库架构
```

## 功能模块

### 已实现
- 用户注册
- 用户登录（JWT 令牌认证）
- 用户信息获取
- 退出登录
- 笔记管理（CRUD + 统计）

### 规划中
- 历程记录管理
- 照片管理

## 数据库设计

### 用户表 (user)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| username | VARCHAR | 用户名（唯一） |
| password | VARCHAR | 密码（SHA-256 加密） |
| email | VARCHAR | 邮箱 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 历程表 (experience)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| user_id | BIGINT | 用户 ID |
| title | VARCHAR | 标题 |
| content | TEXT | 富文本内容 |
| tags | JSON | 标签数组 |
| color | VARCHAR | 颜色标记 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 笔记表 (note)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键（时间戳） |
| user_id | BIGINT | 用户 ID |
| category | VARCHAR | 分类（学习/工作/生活/想法/其他） |
| title | VARCHAR | 标题 |
| color | VARCHAR | 颜色标记 |
| content | MEDIUMTEXT | 富文本内容 |
| tags | JSON | 标签数组 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 照片表 (photo)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| user_id | BIGINT | 用户 ID |
| category | VARCHAR | 分类（生活/旅行/风景/人物/美食） |
| url | VARCHAR | 照片 URL |
| description | TEXT | 描述 |
| created_at | TIMESTAMP | 创建时间 |

## 快速开始

### 前置要求
- JDK 17 或更高版本
- Maven 3.6+
- MySQL 8.0+

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/your-username/notespace-backend.git
cd notespace-backend
```

2. 创建数据库
```sql
CREATE DATABASE notespace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. 修改配置
编辑 `src/main/resources/application.yml`，配置数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/notespace
    username: your_username
    password: your_password
```

4. 构建项目
```bash
mvn clean install
```

5. 运行应用
```bash
mvn spring-boot:run
```

应用将在 `http://localhost:8080` 启动。

## API 文档

### 认证接口

#### 用户注册
```
POST 
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com"
}
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "username": "testuser"
  }
}
```

#### 获取用户信息
```
GET /api/auth/me
Authorization: Bearer {token}
```

#### 退出登录
```
POST /api/auth/logout
Authorization: Bearer {token}
```

### 笔记接口

#### 获取笔记列表
```
GET /api/v1/notes?page=1&size=20&category=学习&keyword=Vue
Authorization: Bearer {token}
```

响应：
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

#### 获取笔记详情
```
GET /api/v1/notes/{id}
Authorization: Bearer {token}
```

#### 创建笔记
```
POST /api/v1/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Vue 3 学习笔记",
  "category": "学习",
  "color": "#409EFF",
  "content": "<p>Vue 3 是...</p>",
  "tags": ["前端", "Vue"]
}
```

#### 更新笔记
```
PUT /api/v1/notes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "更新后的标题",
  "category": "工作",
  "content": "<p>更新后的内容</p>"
}
```

#### 删除笔记
```
DELETE /api/v1/notes/{id}
Authorization: Bearer {token}
```

#### 获取笔记统计
```
GET /api/v1/notes/stats
Authorization: Bearer {token}
```

响应：
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

## 开发计划

- [ ] 完善历程记录功能
- [ ] 实现照片管理功能
- [ ] 添加单元测试
- [ ] 添加文件上传功能

## 许可证

[MIT License](LICENSE)
