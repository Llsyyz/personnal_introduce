<!-- App.vue 是应用的根组件 -->
<!-- 所有页面组件都会渲染在这里 -->

<template>
  <!-- 路由视图：根据 URL 显示不同的页面 -->
  <router-view />
</template>

<script setup>
// 使用 Vue 3 的 setup 语法糖
// 这里可以写全局的逻辑代码
</script>

<style>
/* ========== 全局样式重置 ========== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ========== 页面背景样式 - 浅色 Apple 风格 ========== */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f5f7;
  background-image:
    linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  min-height: 100vh;
  color: #1d1d1f;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 去掉链接下划线 */
a {
  text-decoration: none;
  color: inherit;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f5f7;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c7c7cc;
  border-radius: 4px;
  transition: background 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a6;
}
</style>
