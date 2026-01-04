<!--
  TarotForm.vue - 塔罗牌表单组件
  包含问题输入和建议问题选择
-->

<template>
  <div class="tarot-container">
    <div class="question-section">
      <h3 class="section-title">提出您的问题</h3>
      <p class="section-desc">请输入一个明确的问题，AI 将为您抽取三张塔罗牌并提供专业解读</p>

      <div class="suggested-questions">
        <div
          v-for="(q, index) in suggestedQuestions"
          :key="index"
          class="question-chip"
          :class="{ selected: modelValue === q }"
          @click="$emit('update:modelValue', q)"
        >
          {{ q }}
        </div>
      </div>

      <div class="question-input">
        <el-input
          :model-value="modelValue"
          @update:model-value="$emit('update:modelValue', $event)"
          type="textarea"
          :rows="3"
          placeholder="在此输入您想要占卜的问题..."
        />
      </div>

      <el-button class="btn-draw" :loading="loading" @click="$emit('draw')">
        <el-icon><Star /></el-icon>
        抽取塔罗牌
      </el-button>
    </div>

    <div class="tarot-footer">
      <p>选择您的塔罗体验</p>
    </div>
  </div>
</template>

<script setup>
import { Star } from '@element-plus/icons-vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  suggestedQuestions: {
    type: Array,
    default: () => [
      '创业还是留在大公司更适合我？',
      '对方不喜欢我，我该如何让自己放下？',
      '为何我在社交场合难以做真实的自己？'
    ]
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'draw'])
</script>

<style scoped>
.tarot-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.question-section {
  text-align: center;
  padding: 40px 0;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #000;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-desc {
  font-size: 16px;
  color: #666;
  margin: 12px 0 40px;
  line-height: 1.6;
}

.suggested-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
}

.question-chip {
  padding: 12px 24px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 24px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.question-chip::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #333;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-chip:hover,
.question-chip.selected {
  background: #333;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.question-chip.selected::before {
  transform: translateX(0);
}

.question-input {
  margin-bottom: 32px;
}

.question-input :deep(.el-textarea__inner) {
  border-radius: 16px;
  padding: 20px;
  font-size: 16px;
  background: #fafafa;
  border: 1px solid #ddd;
  font-weight: 600;
  transition: all 0.3s ease;
  resize: none;
}

.question-input :deep(.el-textarea__inner):focus {
  background: #fff;
  border-color: #333;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.btn-draw {
  background: linear-gradient(135deg, #333 0%, #555 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 18px 64px;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.btn-draw:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
}

.btn-draw:active {
  transform: translateY(0) scale(0.98);
}

.btn-draw .el-icon {
  margin-right: 8px;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
}

.tarot-footer {
  margin-top: 64px;
  padding-top: 32px;
  border-top: 1px solid #ddd;
}

.tarot-footer p {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin: 0;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .section-title {
    font-size: 24px;
  }

  .suggested-questions {
    gap: 8px;
  }

  .question-chip {
    padding: 10px 20px;
    font-size: 13px;
  }

  .btn-draw {
    padding: 16px 48px;
    font-size: 15px;
  }
}
</style>
