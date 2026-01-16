# NoteSpace - Vue 3 个人应用

一个基于 Vue 3 + Element Plus 的个人应用，包含登录认证、AI 聊天、笔记、相册和新闻功能。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **UI 组件**: Element Plus
- **路由**: Vue Router 4
- **HTTP 请求**: Axios
- **富文本编辑**: WangEditor
- **构建工具**: Vite

## 功能特性

- 双 Token 认证机制 (accessToken + refreshToken)
- 自动刷新 Token
- AI 智能聊天
- 笔记管理（富文本编辑）
- 相册展示
- 新闻资讯

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 部署

### 方式一：传统部署 (Nginx)

1. 构建项目
```bash
npm run build
```

2. 复制 `dist/` 目录到服务器

3. 配置 Nginx (参考 `nginx.conf`)

### 方式二：Docker 部署

```bash
# 构建镜像
docker build -t notespace-frontend:latest .

# 运行容器
docker run -d -p 80:80 notespace-frontend:latest
```

### 方式三：Docker Compose (完整部署)

```bash
docker-compose up -d
```

### 方式四：云平台部署

- **Vercel**: 连接 Git 仓库自动部署
- **Netlify**: 拖拽 `dist/` 目录上传

## 环境变量

创建 `.env.production` 文件：

```env
VITE_API_BASE_URL=http://your-server.com:8080/api/v1
VITE_CHAT_API_URL=http://your-server.com:8000/api/v1
```

## 后端服务

项目需要两个后端服务：

- **主 API 服务** (端口 8080): 认证、笔记等功能
- **Chat API 服务** (端口 8000): AI 聊天功能

确保部署时修改 `src/utils/request.js` 中的 API 地址。

## 项目结构

```
.
├── src/
│   ├── api/          # API 模块
│   ├── components/   # 公共组件
│   ├── router/       # 路由配置
│   ├── utils/        # 工具函数
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   └── main.js       # 入口文件
├── backend/          # 后端 API 文档
├── header/           # API 文档
├── public/           # 静态资源
├── index.html        # HTML 模板
├── vite.config.js    # Vite 配置
└── package.json      # 依赖配置
```

## 常见问题

### 1. 跨域问题

在 `vite.config.js` 中配置代理：

```js
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true
    }
  }
}
```

### 2. 路由刷新 404

使用 Nginx 的 `try_files` 配置，所有请求重定向到 `index.html`

### 3. Token 刷新失败

检查 `refreshToken` 是否正确设置，以及刷新接口是否正常

## License

MIT
