// Vite 配置文件
// Vite 是新一代前端构建工具，启动快、更新快

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 导出配置对象
export default defineConfig({
  // 插件配置
  plugins: [
    // Vue 3 插件，支持 .vue 文件
    vue()
  ],
  // 路径别名配置
  // 使用 @ 代表 src 目录，方便引入文件
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 开发服务器配置
  server: {
    port: 3000,      // 开发服务器端口
    open: true       // 自动打开浏览器
  }
})
