<!--
  StreamingResult.vue - 古风流式输出组件
  包含传统阴阳鱼动画和实时流式内容块
-->

<template>
  <div class="streaming-result">
    <!-- 计算中状态 - 传统阴阳鱼动画 -->
    <Transition name="ancient-fade">
      <div v-if="isCalculating" class="calculating-state">
        <div class="yinyang-fish-wrapper">
          <svg class="yinyang-fish-svg" viewBox="0 0 100 100">
            <g class="yinyang-group">
              <!-- 白色背景圆 -->
              <circle cx="50" cy="50" r="48" fill="white"/>
              <!-- 黑色S形区域 -->
              <path d="M 50 2
                       A 48 48 0 0 1 50 98
                       A 24 24 0 0 1 50 50
                       A 24 24 0 0 0 50 2"
                    fill="black"/>
              <!-- 阳中的黑点 -->
              <circle cx="50" cy="26" r="6" fill="black"/>
              <!-- 阴中的白点 -->
              <circle cx="50" cy="74" r="6" fill="white"/>
            </g>
          </svg>
        </div>
        <div class="calculating-text">{{ thinkingText }}</div>
      </div>
    </Transition>

    <!-- 实时流式内容块 -->
    <Transition name="slide-in">
      <div v-if="(isCalculating && streamingContent) || (displayData && Object.keys(displayData).length)" class="flowing-container">
        <!-- 流式原始内容 -->
        <div v-if="isCalculating && streamingContent" class="streaming-block">
          <div class="streaming-header">
            <span class="streaming-icon">✧</span>
            <span class="streaming-title">实时生成中...</span>
            <span class="streaming-dot">●</span>
          </div>
          <div class="streaming-body">
            <pre class="streaming-content-text">{{ streamingContent }}</pre>
          </div>
        </div>

        <!-- 结构化结果展示 -->
        <div v-if="displayData && Object.keys(displayData).length && !isCalculating" class="result-flow">
          <!-- 八字计算流式展示 -->
          <template v-if="type === 'bazi'">
            <!-- 八字命盘 -->
            <template v-if="displayData.pillars && displayData.pillars.length">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">命</span>
                  <h3>八字命盘</h3>
                  <span class="title-seal">盘</span>
                </div>
                <div class="pillars-scroll">
                  <div class="pillar-row">
                    <div
                      v-for="(pillar, index) in displayData.pillars"
                      :key="index"
                      class="pillar-box"
                    >
                      <div class="pillar-name">{{ pillar.name }}</div>
                      <div class="pillar-pillar">
                        <span class="heavenly">{{ pillar.heavenly }}</span>
                        <span class="earthly">{{ pillar.earthly }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 五行分析 -->
            <template v-if="displayData.wuxing">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">五</span>
                  <h3>五行分析</h3>
                  <span class="title-seal">行</span>
                </div>
                <div class="wuxing-text">
                  <span class="wuxing-label">日主：</span>
                  <span class="wuxing-value">{{ displayData.wuxing.dayMaster }}</span>
                  <span class="wuxing-divider">·</span>
                  <span class="wuxing-label">身强：</span>
                  <span class="wuxing-value">{{ displayData.wuxing.strength }}</span>
                </div>
              </div>
            </template>

            <!-- 十神分析 -->
            <template v-if="displayData.shishen && displayData.shishen.length">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">十</span>
                  <h3>十神分析</h3>
                  <span class="title-seal">神</span>
                </div>
                <div class="shishen-flow">
                  <span
                    v-for="(item, index) in displayData.shishen"
                    :key="index"
                    class="shishen-item"
                  >
                    {{ item.name }}
                    <span class="strength-mark">{{ item.strength }}</span>
                  </span>
                </div>
              </div>
            </template>
          </template>

          <!-- 合婚流式展示 -->
          <template v-else-if="type === 'marriage'">
            <template v-if="displayData.score !== undefined">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">合</span>
                  <h3>婚姻匹配</h3>
                  <span class="title-seal">婚</span>
                </div>
                <div class="marriage-score-display">
                  <div class="score-circle-ancient">
                    <div class="score-number">{{ displayData.score }}</div>
                    <div class="score-label">分</div>
                  </div>
                  <div v-if="displayData.level" class="level-text" :class="getLevelClass(displayData.level)">
                    {{ displayData.level }}
                  </div>
                </div>
              </div>
            </template>

            <template v-if="displayData.analysis">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">批</span>
                  <h3>命理解读</h3>
                  <span class="title-seal">注</span>
                </div>
                <div class="analysis-text">{{ displayData.analysis }}</div>
              </div>
            </template>

            <template v-if="displayData.malePillars || displayData.femalePillars">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">双</span>
                  <h3>八字对照</h3>
                  <span class="title-seal">方</span>
                </div>
                <div class="comparison-pair">
                  <div class="compare-item">
                    <span class="compare-tag">男</span>
                    <span class="compare-pillars">
                      {{ displayData.malePillars?.map(p => p.heavenly + p.earthly).join(' ') || '-' }}
                    </span>
                  </div>
                  <div class="compare-divider">❧</div>
                  <div class="compare-item">
                    <span class="compare-tag">女</span>
                    <span class="compare-pillars">
                      {{ displayData.femalePillars?.map(p => p.heavenly + p.earthly).join(' ') || '-' }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </template>

          <!-- 每日运势流式展示 -->
          <template v-else-if="type === 'fortune'">
            <template v-if="displayData.totalScore !== undefined">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">运</span>
                  <h3>今日运势</h3>
                  <span class="title-seal">势</span>
                </div>
                <div class="fortune-total">
                  <span class="fortune-big-score">{{ displayData.totalScore }}</span>
                  <span class="fortune-unit">分</span>
                </div>
              </div>
            </template>

            <template v-if="displayData.fortuneTypes && displayData.fortuneTypes.length">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">诸</span>
                  <h3>各项运势</h3>
                  <span class="title-seal">事</span>
                </div>
                <div class="fortune-items">
                  <div
                    v-for="(item, index) in displayData.fortuneTypes"
                    :key="index"
                    class="fortune-item-ancient"
                  >
                    <span class="fortune-name-ancient">{{ item.name }}</span>
                    <div class="fortune-bar-ancient">
                      <div class="fortune-fill" :style="{ width: item.score + '%' }"></div>
                    </div>
                    <span class="fortune-score-ancient">{{ item.score }}</span>
                  </div>
                </div>
              </div>
            </template>

            <template v-if="displayData.lucky">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">吉</span>
                  <h3>幸运指引</h3>
                  <span class="title-seal">祥</span>
                </div>
                <div class="lucky-ancient">
                  <span class="lucky-ancient-item">
                    <span class="lucky-icon">色</span>
                    {{ displayData.lucky.color }}
                  </span>
                  <span class="lucky-ancient-item">
                    <span class="lucky-icon">数</span>
                    {{ displayData.lucky.number }}
                  </span>
                  <span class="lucky-ancient-item">
                    <span class="lucky-icon">位</span>
                    {{ displayData.lucky.direction }}
                  </span>
                </div>
              </div>
            </template>
          </template>

          <!-- 塔罗牌流式展示 -->
          <template v-else-if="type === 'tarot'">
            <template v-if="displayData.cards && displayData.cards.length">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">塔</span>
                  <h3>塔罗解读</h3>
                  <span class="title-seal">罗</span>
                </div>
                <div class="tarot-ancient-list">
                  <div
                    v-for="(card, index) in displayData.cards"
                    :key="index"
                    class="tarot-ancient-card"
                  >
                    <div class="tarot-emoji-ancient">{{ card.emoji }}</div>
                    <div class="tarot-details">
                      <div class="tarot-name-ancient">{{ card.name }}</div>
                      <div class="tarot-position-ancient">{{ card.position }}</div>
                      <div class="tarot-meaning-ancient">{{ card.meaning }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-if="displayData.interpretation">
              <div class="ancient-section">
                <div class="ancient-title">
                  <span class="title-seal">奥</span>
                  <h3>奥义解读</h3>
                  <span class="title-seal">秘</span>
                </div>
                <div class="interpretation-ancient">{{ displayData.interpretation }}</div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'bazi'
  },
  data: {
    type: Object,
    default: null
  },
  isCalculating: {
    type: Boolean,
    default: false
  },
  streamingContent: {
    type: String,
    default: ''
  }
})

// 状态
const thinkingText = ref('推演中...')
const displayData = ref({})

// 思考文本映射
const thinkingTexts = {
  bazi: ['正在推算八字...', '正在解析天干...', '正在参悟地支...'],
  marriage: ['正在合算八字...', '正在推演姻缘...', '正在验证命格...'],
  fortune: ['正在观星测运...', '正在推演吉凶...', '正在解析运势...'],
  tarot: ['正在洗牌...', '正在抽取牌阵...', '正在解读神谕...']
}

// 监听计算状态
watch(() => props.isCalculating, (newVal) => {
  if (newVal) {
    displayData.value = {}
    startThinkingAnimation()
  } else {
    thinkingText.value = '推演完成'
  }
})

// 监听流式内容
watch(() => props.streamingContent, (newContent) => {
  if (newContent) {
    console.log('[StreamingResult] 流式内容更新:', newContent.substring(0, 100))
    // 尝试解析 JSON
    try {
      let parsed = JSON.parse(newContent)
      if (parsed && typeof parsed === 'object') {
        console.log('[StreamingResult] JSON 解析成功:', parsed)
        displayData.value = parsed
      }
    } catch {
      try {
        const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)```/
        const match = newContent.match(codeBlockRegex)
        if (match && match[1]) {
          const parsed = JSON.parse(match[1].trim())
          console.log('[StreamingResult] 从 markdown 提取成功:', parsed)
          displayData.value = parsed
        }
      } catch {
        console.log('[StreamingResult] JSON 未完成，继续累积...')
      }
    }
  }
})

// 监听最终数据
watch(() => props.data, (newData) => {
  if (newData && !props.isCalculating) {
    console.log('[StreamingResult] 收到最终数据:', newData)
    displayData.value = newData
  }
})

// 思考动画
const startThinkingAnimation = () => {
  const texts = thinkingTexts[props.type] || thinkingTexts.bazi
  let index = 0
  const interval = setInterval(() => {
    if (props.isCalculating) {
      thinkingText.value = texts[index % texts.length]
      index++
    } else {
      clearInterval(interval)
    }
  }, 1500)
}

// 获取等级样式类
const getLevelClass = (level) => {
  if (level.includes('上等')) return 'level-high'
  if (level.includes('中等')) return 'level-medium'
  return 'level-low'
}
</script>

<style scoped>
/* ========== 容器 ========== */
.streaming-result {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ========== 传统阴阳鱼 Loading 动画 ========== */
.calculating-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
}

.yinyang-fish-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.yinyang-fish-svg {
  width: 100%;
  height: 100%;
  animation: fish-spin 8s linear infinite;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}

.yinyang-group {
  transform-origin: center;
}

@keyframes fish-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.calculating-text {
  font-size: 14px;
  color: #000;
  font-weight: 500;
  letter-spacing: 1px;
}

/* ========== 流式容器 ========== */
.flowing-container {
  width: 100%;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 实时流式内容块 ========== */
.streaming-block {
  margin-bottom: 20px;
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
}

.streaming-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #f5f5f5;
}

.streaming-icon {
  font-size: 14px;
  color: #999;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.streaming-title {
  flex: 1;
  font-size: 13px;
  color: #666;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.streaming-dot {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.streaming-body {
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: auto;
}

.streaming-body::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.streaming-body::-webkit-scrollbar-track {
  background: transparent;
}

.streaming-body::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.streaming-body::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

.streaming-content-text {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

/* ========== 结果流 ========== */
.result-flow {
  width: 100%;
}

.ancient-section {
  margin-bottom: 50px;
  animation: ancient-appear 0.6s ease-out;
}

@keyframes ancient-appear {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 古风标题 ========== */
.ancient-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 35px;
  padding: 20px 0;
  position: relative;
}

.ancient-title::before,
.ancient-title::after {
  content: '';
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8b4513, transparent);
}

.title-seal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #8b4513 0%, #cd853f 100%);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
  border: 2px solid #daa520;
}

.ancient-title h3 {
  font-size: 32px;
  font-weight: 700;
  color: #2c1810;
  margin: 0;
  letter-spacing: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

/* ========== 八字命盘 ========== */
.pillars-scroll {
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
  border: 3px solid #8b4513;
  border-radius: 4px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(139, 69, 19, 0.15);
}

.pillar-row {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.pillar-box {
  text-align: center;
}

.pillar-name {
  font-size: 14px;
  color: #8b4513;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 2px;
}

.pillar-pillar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.heavenly,
.earthly {
  font-size: 42px;
  font-weight: 700;
  color: #2c1810;
  letter-spacing: 8px;
  line-height: 1;
}

.heavenly {
  color: #8b0000;
}

.earthly {
  color: #00008b;
}

/* ========== 五行分析 ========== */
.wuxing-text {
  text-align: center;
  font-size: 20px;
  line-height: 2;
  color: #2c1810;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
  border: 2px solid #8b4513;
  border-radius: 4px;
  padding: 25px;
  letter-spacing: 2px;
}

.wuxing-label {
  color: #8b4513;
  font-weight: 600;
}

.wuxing-value {
  color: #8b0000;
  font-weight: 700;
  font-size: 22px;
}

.wuxing-divider {
  color: #daa520;
  margin: 0 20px;
}

/* ========== 十神分析 ========== */
.shishen-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.shishen-item {
  padding: 15px 30px;
  background: linear-gradient(135deg, #8b4513 0%, #cd853f 100%);
  color: #fff;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
  border: 2px solid #daa520;
}

.strength-mark {
  margin-left: 10px;
  font-size: 14px;
  opacity: 0.9;
}

/* ========== 合婚分数 ========== */
.marriage-score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  padding: 40px;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
  border: 3px solid #8b4513;
  border-radius: 4px;
}

.score-circle-ancient {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b4513 0%, #cd853f 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(139, 69, 19, 0.4);
  border: 4px solid #daa520;
}

.score-number {
  font-size: 56px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.score-label {
  font-size: 18px;
  color: #fff;
  margin-top: 5px;
}

.level-text {
  padding: 12px 35px;
  border-radius: 4px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 4px;
  border: 2px solid #daa520;
}

.level-text.level-high {
  background: linear-gradient(135deg, #228b22 0%, #32cd32 100%);
  color: #fff;
}

.level-text.level-medium {
  background: linear-gradient(135deg, #daa520 0%, #ffd700 100%);
  color: #2c1810;
}

.level-text.level-low {
  background: linear-gradient(135deg, #8b0000 0%, #cd5c5c 100%);
  color: #fff;
}

/* ========== 分析文字 ========== */
.analysis-text,
.interpretation-ancient {
  text-align: center;
  font-size: 18px;
  line-height: 2;
  color: #2c1810;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
  border: 2px solid #8b4513;
  border-radius: 4px;
  padding: 30px;
  letter-spacing: 2px;
  white-space: pre-wrap;
}

/* ========== 八字对照 ========== */
.comparison-pair {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
  border: 2px solid #8b4513;
  border-radius: 4px;
}

.compare-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.compare-tag {
  padding: 10px 20px;
  background: linear-gradient(135deg, #8b4513 0%, #cd853f 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  border-radius: 4px;
  border: 2px solid #daa520;
}

.compare-pillars {
  font-size: 24px;
  font-weight: 700;
  color: #2c1810;
  letter-spacing: 4px;
}

.compare-divider {
  font-size: 32px;
  color: #daa520;
}

/* ========== 运势分数 ========== */
.fortune-total {
  text-align: center;
  padding: 40px;
  background: linear-gradient(135deg, #8b0000 0%, #cd5c5c 100%);
  border-radius: 4px;
  border: 3px solid #daa520;
  box-shadow: 0 8px 32px rgba(139, 0, 0, 0.3);
}

.fortune-big-score {
  font-size: 80px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.fortune-unit {
  font-size: 24px;
  color: #fff;
  margin-left: 10px;
}

/* ========== 各项运势 ========== */
.fortune-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fortune-item-ancient {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
  border: 2px solid #8b4513;
  border-radius: 4px;
}

.fortune-name-ancient {
  min-width: 100px;
  font-size: 18px;
  font-weight: 600;
  color: #8b4513;
  letter-spacing: 2px;
}

.fortune-bar-ancient {
  flex: 1;
  height: 12px;
  background: #e8e0d5;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.fortune-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b4513 0%, #cd853f 50%, #daa520 100%);
  border-radius: 6px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
}

.fortune-score-ancient {
  min-width: 50px;
  text-align: right;
  font-size: 22px;
  font-weight: 700;
  color: #8b0000;
}

/* ========== 幸运指引 ========== */
.lucky-ancient {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
  border: 2px solid #8b4513;
  border-radius: 4px;
}

.lucky-ancient-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  color: #2c1810;
  font-weight: 600;
  letter-spacing: 2px;
}

.lucky-icon {
  padding: 8px 12px;
  background: linear-gradient(135deg, #8b4513 0%, #cd853f 100%);
  color: #fff;
  border-radius: 4px;
  font-size: 16px;
  border: 2px solid #daa520;
}

/* ========== 塔罗牌 ========== */
.tarot-ancient-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.tarot-ancient-card {
  display: flex;
  gap: 25px;
  padding: 30px;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
  border: 2px solid #8b4513;
  border-radius: 4px;
  align-items: flex-start;
}

.tarot-emoji-ancient {
  font-size: 60px;
  line-height: 1;
}

.tarot-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tarot-name-ancient {
  font-size: 24px;
  font-weight: 700;
  color: #8b0000;
  letter-spacing: 2px;
}

.tarot-position-ancient {
  font-size: 14px;
  color: #8b4513;
  font-weight: 600;
  letter-spacing: 2px;
}

.tarot-meaning-ancient {
  font-size: 16px;
  color: #2c1810;
  line-height: 1.8;
  letter-spacing: 1px;
}

/* ========== 过渡动画 ========== */
.ancient-fade-enter-active,
.ancient-fade-leave-active {
  transition: all 0.5s ease;
}

.ancient-fade-enter-from,
.ancient-fade-leave-to {
  opacity: 0;
}

.slide-in-enter-active {
  transition: all 0.4s ease;
}

.slide-in-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .pillar-row {
    flex-wrap: wrap;
    justify-content: center;
  }

  .pillar-box {
    min-width: 45%;
  }

  .heavenly,
  .earthly {
    font-size: 32px;
  }

  .compare-pillars {
    font-size: 18px;
  }

  .fortune-item-ancient {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .fortune-bar-ancient {
    width: 100%;
  }

  .lucky-ancient {
    flex-direction: column;
    gap: 15px;
  }

  .comparison-pair {
    flex-direction: column;
    gap: 20px;
  }

  .ancient-title h3 {
    font-size: 24px;
    letter-spacing: 4px;
  }

  .title-seal {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .streaming-body {
    width: 100%;
  }
}
</style>
