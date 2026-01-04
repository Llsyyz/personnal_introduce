<!--
  FortuneCard.vue - 运势卡片组件
  显示单项运势信息，包含图标、名称、分数和描述
-->

<template>
  <div class="fortune-card" :class="{ hover: isHovered }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div class="fortune-icon">
      <el-icon :size="28">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="fortune-info">
      <div class="fortune-name">{{ name }}</div>
      <div class="fortune-score" :style="{ color: scoreColor }">{{ score }}分</div>
      <div class="fortune-desc">{{ desc }}</div>
    </div>
    <div class="fortune-indicator" :style="{ width: `${score}%` }"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    required: true
  },
  score: {
    type: Number,
    default: 80
  },
  desc: {
    type: String,
    default: ''
  }
})

const isHovered = ref(false)

const scoreColor = computed(() => {
  if (props.score >= 90) return '#00c853'
  if (props.score >= 80) return '#64dd17'
  if (props.score >= 70) return '#ffab00'
  if (props.score >= 60) return '#ff6d00'
  return '#d50000'
})
</script>

<style scoped>
.fortune-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: #fafafa;
  border-radius: 16px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #ddd;
  position: relative;
  overflow: hidden;
  animation: scaleIn 0.4s ease-out backwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fortune-card:nth-child(1) { animation-delay: 0.05s; }
.fortune-card:nth-child(2) { animation-delay: 0.1s; }
.fortune-card:nth-child(3) { animation-delay: 0.15s; }
.fortune-card:nth-child(4) { animation-delay: 0.2s; }
.fortune-card:nth-child(5) { animation-delay: 0.25s; }
.fortune-card:nth-child(6) { animation-delay: 0.3s; }

.fortune-card.hover {
  transform: translateY(-6px);
  box-shadow: 6px 6px 0 #ccc, 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: #bbb;
}

.fortune-card:hover .fortune-icon {
  transform: rotate(5deg) scale(1.1);
}

.fortune-icon {
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  flex-shrink: 0;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.fortune-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.fortune-name {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.fortune-score {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
  transition: color 0.3s ease;
}

.fortune-desc {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.fortune-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #666 0%, #999 100%);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0 3px 3px 0;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .fortune-card {
    padding: 20px;
    gap: 16px;
  }

  .fortune-icon {
    width: 50px;
    height: 50px;
  }

  .fortune-score {
    font-size: 20px;
  }
}
</style>
