<!--
  ChatCommonStyles.vue - 聊天页面通用样式组件
  提供可复用的样式定义和混入
-->

<script setup>
defineProps({
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div :class="['chat-common-styles', customClass]">
    <slot />
  </div>
</template>

<style>
/* ========== 页面基础 ========== */
.chat-page {
  display: flex;
  min-height: 100vh;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
}

/* ========== 右侧内容区 ========== */
.main-content {
  flex: 1;
  padding: 60px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  animation: fadeInContent 0.5s ease-out;
}

@keyframes fadeInContent {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.main-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

.page-header {
  text-align: center;
  margin-bottom: 72px;
  max-width: 800px;
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-title {
  font-size: 48px;
  font-weight: 600;
  color: #000;
  margin: 0 0 20px;
  letter-spacing: -1px;
  line-height: 1.1;
  text-transform: uppercase;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 17px;
  color: #666;
  margin: 0;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0.5px;
}

/* ========== 表单通用样式 ========== */
.form-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #000;
  margin: 0 0 24px;
  letter-spacing: -0.5px;
  text-transform: uppercase;
}

.form-label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* 开关切换 */
.toggle-switch {
  width: 56px;
  height: 32px;
  background: #e5e5e5;
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.toggle-switch.active {
  background: linear-gradient(135deg, #333 0%, #555 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.toggle-slider {
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 4px;
  left: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-slider {
  left: 28px;
  transform: scale(1.1);
}

/* 提交按钮 */
.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, #333 0%, #555 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
}

.btn-submit:active {
  transform: translateY(0);
}

/* ========== 结果展示 ========== */
.result-section,
.marriage-result,
.tarot-result {
  width: 100%;
  max-width: 720px;
  margin: 56px auto 0;
  padding: 40px;
  background: linear-gradient(135deg, #333 0%, #555 100%);
  border-radius: 20px;
  animation: fadeInUp 0.5s ease-out;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 24px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ========== 页面底部 ========== */
.page-footer {
  text-align: center;
  padding: 80px 0 0;
  border-top: 1px solid #ddd;
  margin-top: 64px;
}

.footer-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin: 0 0 8px;
  letter-spacing: 0.5px;
}

.footer-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
  font-weight: 400;
}

/* ========== Element Plus 样式覆盖 ========== */
:deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: none !important;
  border: 1px solid #ddd;
  background: #fafafa;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper):hover {
  border-color: #bbb;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #333;
  background: #fff;
}

:deep(.el-select .el-input__wrapper) {
  cursor: pointer;
}

:deep(.el-button) {
  font-weight: 600;
}

:deep(.el-date-editor.el-input__wrapper) {
  width: 100%;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .main-content {
    padding: 32px 20px;
  }

  .page-header {
    margin-bottom: 48px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 15px;
  }

  .result-section,
  .marriage-result,
  .tarot-result {
    padding: 28px;
    border-radius: 16px;
  }
}
</style>
