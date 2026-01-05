<!--
  StreamingResult.vue - 流式输出结果组件
  用于八字计算、合婚、运势等功能的流式展示
-->

<template>
  <div class="streaming-result">
    <!-- 计算中状态 -->
    <Transition name="fade">
      <div v-if="isCalculating" class="calculating-state">
        <div class="calculation-animation">
          <div class="calc-ring"></div>
          <div class="calc-ring"></div>
          <div class="calc-ring"></div>
        </div>
        <div class="calculation-text">
          <p class="main-text">{{ currentStep }}</p>
          <p class="sub-text">{{ progressText }}</p>
        </div>
      </div>
    </Transition>

    <!-- 流式输出结果 -->
    <Transition name="result-slide">
      <div v-if="showResult && !isCalculating" class="result-container">
        <!-- 八字计算结果 -->
        <div v-if="type === 'bazi'" class="bazi-result">
          <h3 class="result-title">八字命盘</h3>
          <div class="pillar-grid">
            <div
              v-for="(pillar, index) in displayPillars"
              :key="index"
              class="pillar-card"
              :class="{ 'pillar-show': pillar.show }"
            >
              <div class="pillar-name">{{ pillar.name }}</div>
              <div class="pillar-content">
                <div class="pillar-char">{{ pillar.heavenly }}</div>
                <div class="pillar-char">{{ pillar.earthly }}</div>
              </div>
            </div>
          </div>

          <!-- 五行分析 -->
          <Transition name="fade-up">
            <div v-if="wuxingData" class="wuxing-analysis">
              <h4 class="section-subtitle">五行分析</h4>
              <div class="wuxing-info">
                <span class="wuxing-label">日主:</span>
                <span class="wuxing-value">{{ wuxingData.dayMaster }}</span>
                <span class="wuxing-label">身强:</span>
                <span class="wuxing-value">{{ wuxingData.strength }}</span>
              </div>
            </div>
          </Transition>

          <!-- 十神分析 -->
          <Transition name="fade-up">
            <div v-if="shishenData && shishenData.length" class="shishen-analysis">
              <h4 class="section-subtitle">十神分析</h4>
              <div class="shishen-grid">
                <div
                  v-for="(item, index) in displayShishen"
                  :key="index"
                  class="shishen-item"
                  :class="{ 'shishen-show': item.show }"
                >
                  <span class="shishen-name">{{ item.name }}</span>
                  <span class="shishen-strength" :class="getStrengthClass(item.strength)">
                    {{ item.strength }}
                  </span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- 合婚结果 -->
        <div v-else-if="type === 'marriage'" class="marriage-result">
          <h3 class="result-title">合婚结果</h3>

          <!-- 匹配度分数 - 动画效果 -->
          <div class="marriage-score">
            <span class="score-label">综合匹配度</span>
            <div class="score-circle">
              <svg class="score-svg" viewBox="0 0 100 100">
                <circle
                  class="score-bg"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#444"
                  stroke-width="8"
                />
                <circle
                  class="score-progress"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#fff"
                  stroke-width="8"
                  :stroke-dasharray="scoreCircumference"
                  :stroke-dashoffset="scoreOffset"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span class="score-number">{{ displayScore }}</span>
            </div>
          </div>

          <!-- 合婚等级 -->
          <Transition name="fade-up">
            <div v-if="levelData" class="marriage-level">
              <span class="level-badge" :class="getLevelClass(levelData)">
                {{ levelData }}
              </span>
            </div>
          </Transition>

          <!-- 详细分析 - 打字机效果 -->
          <Transition name="fade-up">
            <div v-if="analysisText" class="marriage-analysis">
              <h4 class="section-subtitle">详细分析</h4>
              <p class="analysis-text">{{ displayAnalysis }}</p>
            </div>
          </Transition>

          <!-- 八字对比 -->
          <Transition name="fade-up">
            <div v-if="pillarsData" class="pillars-comparison">
              <div class="comparison-section">
                <h4 class="section-subtitle">男方八字</h4>
                <div class="mini-pillars">
                  <span v-for="(p, i) in pillarsData.male" :key="i" class="mini-pillar">
                    {{ p.heavenly }}{{ p.earthly }}
                  </span>
                </div>
              </div>
              <div class="comparison-section">
                <h4 class="section-subtitle">女方八字</h4>
                <div class="mini-pillars">
                  <span v-for="(p, i) in pillarsData.female" :key="i" class="mini-pillar">
                    {{ p.heavenly }}{{ p.earthly }}
                  </span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- 每日运势结果 -->
        <div v-else-if="type === 'fortune'" class="fortune-result">
          <h3 class="result-title">每日运势</h3>
          <div class="fortune-date">{{ fortuneDate }}</div>

          <!-- 综合分数 -->
          <div class="fortune-score">
            <span class="score-label">综合运势</span>
            <span class="score-number">{{ displayTotalScore }}</span>
          </div>

          <!-- 各项运势卡片 - 逐个显示 -->
          <div class="fortune-grid">
            <div
              v-for="(item, index) in displayFortuneTypes"
              :key="index"
              class="fortune-card"
              :class="{ 'fortune-show': item.show }"
            >
              <div class="fortune-header">
                <span class="fortune-name">{{ item.name }}</span>
                <span class="fortune-score">{{ item.score }}分</span>
              </div>
              <p class="fortune-desc">{{ item.desc }}</p>
            </div>
          </div>

          <!-- 幸运信息 -->
          <Transition name="fade-up">
            <div v-if="luckyData" class="lucky-info">
              <div class="lucky-item">
                <span class="lucky-icon">🎨</span>
                <div class="lucky-content">
                  <span class="lucky-label">幸运色</span>
                  <span class="lucky-value">{{ luckyData.color }}</span>
                </div>
              </div>
              <div class="lucky-item">
                <span class="lucky-icon">🔢</span>
                <div class="lucky-content">
                  <span class="lucky-label">幸运数字</span>
                  <span class="lucky-value">{{ luckyData.number }}</span>
                </div>
              </div>
              <div class="lucky-item">
                <span class="lucky-icon">🧭</span>
                <div class="lucky-content">
                  <span class="lucky-label">幸运方位</span>
                  <span class="lucky-value">{{ luckyData.direction }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- 塔罗牌结果 -->
        <div v-else-if="type === 'tarot'" class="tarot-result">
          <h3 class="result-title">塔罗解读</h3>

          <!-- 塔罗牌逐张翻转 -->
          <div class="tarot-cards">
            <div
              v-for="(card, index) in displayCards"
              :key="index"
              class="tarot-card-wrapper"
              :class="{ 'card-show': card.show }"
            >
              <div class="tarot-card" :class="{ 'card-flip': card.flipped }">
                <div class="card-face card-back">
                  <div class="card-pattern"></div>
                </div>
                <div class="card-face card-front">
                  <span class="card-emoji">{{ card.emoji }}</span>
                  <span class="card-name">{{ card.name }}</span>
                  <span class="card-position">{{ card.position }}</span>
                  <p class="card-meaning">{{ card.meaning }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 综合解读 - 打字机效果 -->
          <Transition name="fade-up">
            <div v-if="interpretationText" class="tarot-interpretation">
              <h4 class="section-subtitle">综合解读</h4>
              <p class="interpretation-text">{{ displayInterpretation }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'bazi' // bazi, marriage, fortune, tarot
  },
  data: {
    type: Object,
    default: null
  },
  isCalculating: {
    type: Boolean,
    default: false
  }
})

// 计算步骤文本
const currentStep = ref('正在计算...')
const progressText = ref('')
const calculationSteps = {
  bazi: ['正在解析出生信息...', '正在推算天干地支...', '正在分析五行强弱...', '正在计算十神关系...', '计算完成！'],
  marriage: ['正在解析双方信息...', '正在推算八字命盘...', '正在分析五行匹配...', '正在计算合婚指数...', '合婚完成！'],
  fortune: ['正在加载八字信息...', '正在推算当日运势...', '正在分析各项指标...', '正在计算幸运信息...', '运势分析完成！'],
  tarot: ['正在洗牌...', '正在抽取塔罗牌...', '正在解读牌面含义...', '正在综合分析...', '占卜完成！']
}

// 结果展示
const showResult = ref(false)
const displayPillars = ref([])
const displayShishen = ref([])
const wuxingData = ref(null)
const shishenData = ref(null)

// 合婚相关
const displayScore = ref(0)
const targetScore = ref(0)
const levelData = ref('')
const analysisText = ref('')
const displayAnalysis = ref('')
const pillarsData = ref(null)
const scoreCircumference = 2 * Math.PI * 45

// 运势相关
const fortuneDate = ref('')
const displayTotalScore = ref(0)
const displayFortuneTypes = ref([])
const luckyData = ref(null)

// 塔罗相关
const displayCards = ref([])
const interpretationText = ref('')
const displayInterpretation = ref('')

// 计算分数动画
const scoreOffset = computed(() => {
  const progress = displayScore.value / 100
  return scoreCircumference * (1 - progress)
})

// 监听计算状态
watch(() => props.isCalculating, (newVal) => {
  if (newVal) {
    showResult.value = false
    startCalculationAnimation()
  }
})

// 监听数据变化
watch(() => props.data, (newData) => {
  if (newData) {
    showResult.value = true
    displayResult(newData)
  }
})

// 开始计算动画
const startCalculationAnimation = async () => {
  const steps = calculationSteps[props.type] || calculationSteps.bazi
  for (let i = 0; i < steps.length; i++) {
    currentStep.value = steps[i]
    progressText.value = `${Math.round((i + 1) / steps.length * 100)}%`
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

// 显示结果
const displayResult = async (data) => {
  if (props.type === 'bazi') {
    await displayBaziResult(data)
  } else if (props.type === 'marriage') {
    await displayMarriageResult(data)
  } else if (props.type === 'fortune') {
    await displayFortuneResult(data)
  } else if (props.type === 'tarot') {
    await displayTarotResult(data)
  }
}

// 八字结果展示
const displayBaziResult = async (data) => {
  displayPillars.value = (data.pillars || []).map(p => ({ ...p, show: false }))
  wuxingData.value = data.wuxing || null
  shishenData.value = data.shishen || null
  displayShishen.value = (data.shishen || []).map(s => ({ ...s, show: false }))

  // 逐个显示柱
  for (let i = 0; i < displayPillars.value.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 300))
    displayPillars.value[i].show = true
  }

  // 显示十神
  await new Promise(resolve => setTimeout(resolve, 400))
  for (let i = 0; i < displayShishen.value.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 200))
    displayShishen.value[i].show = true
  }
}

// 合婚结果展示
const displayMarriageResult = async (data) => {
  targetScore.value = data.score || 0
  levelData.value = data.level || ''
  analysisText.value = data.analysis || ''
  displayAnalysis.value = ''
  pillarsData.value = {
    male: data.malePillars || [],
    female: data.femalePillars || []
  }

  // 分数动画
  const duration = 2000
  const steps = 60
  const increment = targetScore.value / steps
  for (let i = 0; i <= steps; i++) {
    displayScore.value = Math.round(increment * i)
    await new Promise(resolve => setTimeout(resolve, duration / steps))
  }

  // 打字机效果显示分析
  await typeWriter(analysisText.value, (text) => {
    displayAnalysis.value = text
  })
}

// 运势结果展示
const displayFortuneResult = async (data) => {
  fortuneDate.value = data.date || ''
  displayTotalScore.value = 0
  const targetScore = data.totalScore || 85

  displayFortuneTypes.value = (data.fortuneTypes || []).map(f => ({ ...f, show: false }))
  luckyData.value = data.lucky || null

  // 分数动画
  for (let i = 0; i <= targetScore; i += 2) {
    displayTotalScore.value = i
    await new Promise(resolve => setTimeout(resolve, 30))
  }

  // 逐个显示运势卡片
  for (let i = 0; i < displayFortuneTypes.value.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 200))
    displayFortuneTypes.value[i].show = true
  }
}

// 塔罗结果展示
const displayTarotResult = async (data) => {
  displayCards.value = (data.cards || []).map(c => ({ ...c, show: false, flipped: false }))
  interpretationText.value = data.interpretation || ''
  displayInterpretation.value = ''

  // 逐张翻牌
  for (let i = 0; i < displayCards.value.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 300))
    displayCards.value[i].show = true
    await new Promise(resolve => setTimeout(resolve, 200))
    displayCards.value[i].flipped = true
  }

  // 打字机效果
  await typeWriter(interpretationText.value, (text) => {
    displayInterpretation.value = text
  })
}

// 打字机效果
const typeWriter = async (text, callback) => {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += text[i]
    callback(result)
    await new Promise(resolve => setTimeout(resolve, 30))
  }
}

// 获取强度样式类
const getStrengthClass = (strength) => {
  const map = { '强': 'strong', '中': 'medium', '弱': 'weak' }
  return map[strength] || 'medium'
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
  max-width: 720px;
  margin: 0 auto;
}

/* ========== 计算中动画 ========== */
.calculating-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #333 0%, #555 100%);
  border-radius: 20px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.calculation-animation {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 32px;
}

.calc-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.calc-ring:nth-child(1) { animation-delay: 0s; }
.calc-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  animation-delay: 0.15s;
  animation-direction: reverse;
}
.calc-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  animation-delay: 0.3s;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.calculation-text {
  text-align: center;
}

.calculation-text .main-text {
  font-size: 18px;
  color: #fff;
  margin: 0 0 8px;
  font-weight: 600;
}

.calculation-text .sub-text {
  font-size: 14px;
  color: #ccc;
  margin: 0;
}

/* ========== 结果容器 ========== */
.result-container {
  padding: 40px;
  background: linear-gradient(135deg, #333 0%, #555 100%);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
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

/* ========== 八字结果 ========== */
.pillar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 550px;
  margin: 0 auto 32px;
}

.pillar-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pillar-card.pillar-show {
  opacity: 1;
  transform: translateY(0);
}

.pillar-name {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
  letter-spacing: 1px;
}

.pillar-content {
  display: flex;
  gap: 8px;
}

.pillar-char {
  flex: 1;
  font-size: 32px;
  font-weight: 700;
  color: #000;
}

.section-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px;
  letter-spacing: 0.5px;
}

/* 五行分析 */
.wuxing-analysis {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 20px;
}

.wuxing-info {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.wuxing-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.wuxing-value {
  font-size: 14px;
  color: #000;
  font-weight: 600;
}

/* 十神分析 */
.shishen-analysis {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
}

.shishen-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.shishen-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 10px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.shishen-item.shishen-show {
  opacity: 1;
  transform: translateX(0);
}

.shishen-name {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.shishen-strength {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.shishen-strength.strong {
  background: #d4edda;
  color: #155724;
}

.shishen-strength.medium {
  background: #fff3cd;
  color: #856404;
}

.shishen-strength.weak {
  background: #f8d7da;
  color: #721c24;
}

/* ========== 合婚结果 ========== */
.marriage-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.score-label {
  font-size: 14px;
  color: #fff;
  margin-bottom: 16px;
  font-weight: 500;
}

.score-circle {
  position: relative;
  width: 140px;
  height: 140px;
}

.score-svg {
  width: 100%;
  height: 100%;
}

.score-progress {
  transition: stroke-dashoffset 2s ease-out;
}

.score-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  font-weight: 700;
  color: #fff;
}

.marriage-level {
  text-align: center;
  margin-bottom: 24px;
}

.level-badge {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
}

.level-badge.level-high {
  background: #d4edda;
  color: #155724;
}

.level-badge.level-medium {
  background: #fff3cd;
  color: #856404;
}

.level-badge.level-low {
  background: #f8d7da;
  color: #721c24;
}

.marriage-analysis {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
}

.analysis-text {
  font-size: 16px;
  color: #000;
  line-height: 1.8;
  margin: 0;
}

.pillars-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.comparison-section {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
}

.comparison-section .section-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.mini-pillars {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.mini-pillar {
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

/* ========== 运势结果 ========== */
.fortune-result .result-title {
  margin-bottom: 8px;
}

.fortune-date {
  text-align: center;
  font-size: 14px;
  color: #ccc;
  margin-bottom: 24px;
}

.fortune-score {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.fortune-score .score-label {
  font-size: 16px;
}

.fortune-score .score-number {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
}

.fortune-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.fortune-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fortune-card.fortune-show {
  opacity: 1;
  transform: scale(1);
}

.fortune-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.fortune-name {
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

.fortune-score {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.fortune-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.lucky-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.lucky-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.lucky-icon {
  font-size: 24px;
}

.lucky-content {
  display: flex;
  flex-direction: column;
}

.lucky-label {
  font-size: 11px;
  color: #999;
  margin-bottom: 4px;
}

.lucky-value {
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

/* ========== 塔罗结果 ========== */
.tarot-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.tarot-card-wrapper {
  aspect-ratio: 3/4;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.5s ease;
}

.tarot-card-wrapper.card-show {
  opacity: 1;
  transform: translateY(0);
}

.tarot-card {
  width: 100%;
  height: 100%;
  position: relative;
  perspective: 1000px;
  cursor: pointer;
}

.tarot-card.card-flip .card-back {
  transform: rotateY(180deg);
}

.tarot-card.card-flip .card-front {
  transform: rotateY(0deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.card-back {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-pattern {
  width: 80%;
  height: 80%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 20px
  );
}

.card-front {
  background: #fff;
  transform: rotateY(-180deg);
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 20px;
  text-align: center;
}

.card-emoji {
  font-size: 48px;
  margin-bottom: 12px;
}

.card-name {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
}

.card-position {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.card-meaning {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.tarot-interpretation {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
}

.interpretation-text {
  font-size: 15px;
  color: #000;
  line-height: 1.8;
  margin: 0;
}

/* ========== 过渡动画 ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-up-enter-active {
  transition: all 0.5s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.result-slide-enter-active {
  transition: all 0.5s ease;
}

.result-slide-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .pillar-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .fortune-grid {
    grid-template-columns: 1fr;
  }

  .tarot-cards {
    grid-template-columns: 1fr;
  }

  .pillars-comparison {
    grid-template-columns: 1fr;
  }

  .lucky-info {
    grid-template-columns: 1fr;
  }

  .result-container {
    padding: 24px;
  }
}
</style>
