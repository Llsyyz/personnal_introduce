// main.js 是整个 Vue 应用的入口文件
// 所有的全局配置都在这里完成

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 创建 Vue 应用实例
const app = createApp(App)

// 注册所有 Element Plus 图标
// 遍历图标库，将每个图标注册为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 使用插件
app.use(router)           // 路由插件
app.use(ElementPlus)      // Element Plus UI 组件库

// 挂载应用到 DOM
app.mount('#app')
