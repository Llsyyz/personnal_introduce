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
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 页面背景样式 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* 去掉链接下划线 */
a {
  text-decoration: none;
}
</style>
