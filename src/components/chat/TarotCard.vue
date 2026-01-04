<!--
  TarotCard.vue - 塔罗牌卡片组件
  显示单张塔罗牌，包含图案、名称、位置和含义
-->

<template>
  <div
    class="tarot-card"
    :class="{ flipped: isFlipped, hover: isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleFlip"
  >
    <div class="card-inner">
      <div class="card-front">
        <div class="card-back-pattern">🃏</div>
      </div>
      <div class="card-back">
        <div class="card-image">{{ card.emoji }}</div>
        <div class="card-name">{{ card.name }}</div>
        <div class="card-position">{{ card.position }}</div>
        <div class="card-meaning">{{ card.meaning }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  autoFlip: {
    type: Boolean,
    default: false
  }
})

const isFlipped = ref(false)
const isHovered = ref(false)

const handleFlip = () => {
  if (!props.autoFlip) {
    isFlipped.value = !isFlipped.value
  }
}

const flip = () => {
  isFlipped.value = true
}

defineExpose({ flip })
</script>

<style scoped>
.tarot-card {
  background: transparent;
  border-radius: 16px;
  perspective: 1000px;
  cursor: pointer;
  animation: dealCard 0.6s ease-out backwards;
}

@keyframes dealCard {
  from {
    opacity: 0;
    transform: translateY(-50px) rotateY(-180deg) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateY(0) scale(1);
  }
}

.tarot-card:nth-child(1) { animation-delay: 0.2s; }
.tarot-card:nth-child(2) { animation-delay: 0.4s; }
.tarot-card:nth-child(3) { animation-delay: 0.6s; }

.tarot-card.hover {
  transform: translateY(-8px);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.tarot-card.flipped .card-inner,
.tarot-card.hover .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-front {
  background: linear-gradient(135deg, #333 0%, #555 100%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.card-back-pattern {
  font-size: 80px;
  opacity: 0.9;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.card-back {
  background: #fff;
  transform: rotateY(180deg);
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 2px solid #eee;
}

.card-image {
  font-size: 64px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.tarot-card.hover .card-image {
  transform: scale(1.1);
}

.card-name {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.card-position {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 12px;
}

.card-meaning {
  font-size: 13px;
  color: #000;
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .card-inner {
    min-height: 240px;
  }

  .card-back {
    padding: 20px;
  }

  .card-image {
    font-size: 48px;
  }
}
</style>
