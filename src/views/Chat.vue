<!--
  Chat.vue - 命理大师页面
  黑白简约风格，两栏布局
  包含：每日运势、八字计算、八字合婚、塔罗牌
-->

<template>
  <div class="chat-page">
    <!-- 左侧边栏 -->
    <ChatSidebar
      v-model="activeTab"
      :user-info="userInfo"
      @unlock="handleUnlock"
      @logout="handleCommand('logout')"
    />

    <!-- 右侧内容区 -->
    <div class="main-content">
      <!-- 八字计算页面 -->
      <div v-if="activeTab === 'calculate'" class="content-calculate">
        <div class="page-header">
          <h1 class="page-title">八字计算</h1>
          <p class="page-subtitle">精准解析生辰八字，揭示命盘奥秘</p>
        </div>

        <div class="form-container">
          <!-- 基本信息 -->
          <div class="form-section">
            <h3 class="section-title">基本信息</h3>
            <div class="form-row-inline">
              <div class="form-group-inline">
                <label class="form-label">姓名</label>
                <el-input v-model="calculateForm.name" placeholder="请输入姓名" />
              </div>
              <div class="form-group-inline">
                <label class="form-label">性别</label>
                <el-select v-model="calculateForm.gender" style="width: 100%">
                  <el-option label="男" value="male" />
                  <el-option label="女" value="female" />
                </el-select>
              </div>
            </div>
          </div>

          <!-- 时间信息 -->
          <div class="form-section">
            <h3 class="section-title">时间信息</h3>

            <!-- 日期/八字切换 + 阳历/农历 -->
            <div class="date-options-row">
              <div class="input-type-tabs-inline">
                <div
                  class="type-tab"
                  :class="{ active: calculateForm.inputType === 'date' }"
                  @click="calculateForm.inputType = 'date'"
                >日期</div>
                <div
                  class="type-tab"
                  :class="{ active: calculateForm.inputType === 'bazi' }"
                  @click="calculateForm.inputType = 'bazi'"
                >八字</div>
              </div>

              <div v-if="calculateForm.inputType === 'date'" class="calendar-type-toggle-inline">
                <span :class="{ active: calculateForm.calendarType === 'solar' }" @click="calculateForm.calendarType = 'solar'">阳历</span>
                <span :class="{ active: calculateForm.calendarType === 'lunar' }" @click="calculateForm.calendarType = 'lunar'">农历</span>
              </div>
            </div>

            <!-- 出生日期 + 出生时间开关 -->
            <div v-if="calculateForm.inputType === 'date'" class="form-row-inline">
              <div class="form-group-inline">
                <el-date-picker
                  v-model="calculateForm.birthDate"
                  type="date"
                  placeholder="选择出生日期"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </div>
              <div class="form-group-inline toggle-inline">
                <div class="toggle-label-inline">
                  <span>我知道出生时间</span>
                  <div class="toggle-switch" :class="{ active: calculateForm.knowBirthTime }" @click="calculateForm.knowBirthTime = !calculateForm.knowBirthTime">
                    <div class="toggle-slider"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 时分选择 + 出生地点 + 早晚子时 -->
            <div v-if="calculateForm.knowBirthTime && calculateForm.inputType === 'date'" class="form-row-inline">
              <div class="form-group-inline">
                <el-select v-model="calculateForm.birthHour" placeholder="时" style="width: 100%">
                  <el-option v-for="h in 24" :key="h" :label="`${h-1}时`" :value="h-1" />
                </el-select>
              </div>
              <div class="form-group-inline">
                <el-select v-model="calculateForm.birthMinute" placeholder="分" style="width: 100%">
                  <el-option v-for="m in 60" :key="m" :label="`${m-1}分`" :value="m-1" />
                </el-select>
              </div>
              <div class="form-group-inline">
                <el-input v-model="calculateForm.birthPlace" placeholder="搜索并选择出生地">
                  <template #suffix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </div>
              <div class="form-group-inline toggle-inline">
                <div class="toggle-label-inline">
                  <span>早晚子时</span>
                  <div class="toggle-switch" :class="{ active: calculateForm.useZiHour }" @click="calculateForm.useZiHour = !calculateForm.useZiHour">
                    <div class="toggle-slider"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="calculateForm.inputType === 'date'" class="form-row-inline">
              <div class="form-group-inline">
                <el-input v-model="calculateForm.birthPlace" placeholder="搜索并选择出生地">
                  <template #suffix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </div>
              <div class="form-group-inline toggle-inline">
                <div class="toggle-label-inline">
                  <span>早晚子时</span>
                  <div class="toggle-switch" :class="{ active: calculateForm.useZiHour }" @click="calculateForm.useZiHour = !calculateForm.useZiHour">
                    <div class="toggle-slider"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-button class="btn-submit" :loading="calculating" @click="handleCalculate">
            开始计算八字
          </el-button>
        </div>

        <!-- 计算结果 -->
        <Transition name="result-fade">
          <div v-if="baziResult" class="result-section">
            <h3 class="result-title">八字命盘</h3>
            <div class="pillar-grid">
              <div v-for="(pillar, index) in baziResult.pillars" :key="index" class="pillar-card">
                <div class="pillar-name">{{ pillar.name }}</div>
                <div class="pillar-content">
                  <div class="pillar-char">{{ pillar.heavenly }}</div>
                  <div class="pillar-char">{{ pillar.earthly }}</div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 八字合婚页面 -->
      <div v-else-if="activeTab === 'marriage'" class="content-marriage">
        <div class="page-header">
          <h1 class="page-title">八字合婚</h1>
          <p class="page-subtitle">基于传统命理学，分析双方婚姻匹配度</p>
        </div>

        <div class="marriage-form-container">
          <div class="dual-form">
            <!-- 男方信息 -->
            <div class="person-form male">
              <div class="person-header">
                <span class="person-icon">👨</span>
                <span class="person-title">男方信息</span>
              </div>
              <div class="form-fields">
                <div class="form-field">
                  <label>姓名</label>
                  <el-input v-model="marriageForm.male.name" placeholder="请输入姓名" />
                </div>
                <div class="form-field">
                  <label>性别</label>
                  <el-select v-model="marriageForm.male.gender" style="width: 100%">
                    <el-option label="男" value="male" />
                    <el-option label="女" value="female" />
                  </el-select>
                </div>
                <div class="form-field">
                  <label>出生日期</label>
                  <div class="calendar-type-toggle">
                    <span :class="{ active: marriageForm.male.calendarType === 'solar' }" @click="marriageForm.male.calendarType = 'solar'">阳历</span>
                    <span :class="{ active: marriageForm.male.calendarType === 'lunar' }" @click="marriageForm.male.calendarType = 'lunar'">农历</span>
                  </div>
                  <el-date-picker
                    v-model="marriageForm.male.birthDate"
                    type="date"
                    format="YYYY年MM月DD日"
                    value-format="YYYY-MM-DD"
                    style="width: 100%; margin-top: 8px"
                  />
                </div>
                <div class="form-field">
                  <div class="toggle-label">
                    <span>知道出生时间</span>
                    <div class="toggle-switch" :class="{ active: marriageForm.male.knowTime }" @click="marriageForm.male.knowTime = !marriageForm.male.knowTime">
                      <div class="toggle-slider"></div>
                    </div>
                  </div>
                </div>
                <div v-if="marriageForm.male.knowTime" class="form-field-row">
                  <el-select v-model="marriageForm.male.hour" placeholder="时" style="flex: 1">
                    <el-option v-for="h in 24" :key="h" :label="`${h-1}时`" :value="h-1" />
                  </el-select>
                  <el-select v-model="marriageForm.male.minute" placeholder="分" style="flex: 1">
                    <el-option v-for="m in 60" :key="m" :label="`${m-1}分`" :value="m-1" />
                  </el-select>
                </div>
                <div class="form-field full-width">
                  <label>出生地点</label>
                  <el-input v-model="marriageForm.male.birthPlace" placeholder="搜索并选择出生地">
                    <template #suffix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                </div>
                <div class="form-field">
                  <div class="toggle-label">
                    <span>早晚子时</span>
                    <div class="toggle-switch" :class="{ active: marriageForm.male.ziHour }" @click="marriageForm.male.ziHour = !marriageForm.male.ziHour">
                      <div class="toggle-slider"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 女方信息 -->
            <div class="person-form female">
              <div class="person-header">
                <span class="person-icon">👩</span>
                <span class="person-title">女方信息</span>
              </div>
              <div class="form-fields">
                <div class="form-field">
                  <label>姓名</label>
                  <el-input v-model="marriageForm.female.name" placeholder="请输入姓名" />
                </div>
                <div class="form-field">
                  <label>性别</label>
                  <el-select v-model="marriageForm.female.gender" style="width: 100%">
                    <el-option label="男" value="male" />
                    <el-option label="女" value="female" />
                  </el-select>
                </div>
                <div class="form-field">
                  <label>出生日期</label>
                  <div class="calendar-type-toggle">
                    <span :class="{ active: marriageForm.female.calendarType === 'solar' }" @click="marriageForm.female.calendarType = 'solar'">阳历</span>
                    <span :class="{ active: marriageForm.female.calendarType === 'lunar' }" @click="marriageForm.female.calendarType = 'lunar'">农历</span>
                  </div>
                  <el-date-picker
                    v-model="marriageForm.female.birthDate"
                    type="date"
                    format="YYYY年MM月DD日"
                    value-format="YYYY-MM-DD"
                    style="width: 100%; margin-top: 8px"
                  />
                </div>
                <div class="form-field">
                  <div class="toggle-label">
                    <span>知道出生时间</span>
                    <div class="toggle-switch" :class="{ active: marriageForm.female.knowTime }" @click="marriageForm.female.knowTime = !marriageForm.female.knowTime">
                      <div class="toggle-slider"></div>
                    </div>
                  </div>
                </div>
                <div v-if="marriageForm.female.knowTime" class="form-field-row">
                  <el-select v-model="marriageForm.female.hour" placeholder="时" style="flex: 1">
                    <el-option v-for="h in 24" :key="h" :label="`${h-1}时`" :value="h-1" />
                  </el-select>
                  <el-select v-model="marriageForm.female.minute" placeholder="分" style="flex: 1">
                    <el-option v-for="m in 60" :key="m" :label="`${m-1}分`" :value="m-1" />
                  </el-select>
                </div>
                <div class="form-field full-width">
                  <label>出生地点</label>
                  <el-input v-model="marriageForm.female.birthPlace" placeholder="搜索并选择出生地">
                    <template #suffix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                </div>
                <div class="form-field">
                  <div class="toggle-label">
                    <span>早晚子时</span>
                    <div class="toggle-switch" :class="{ active: marriageForm.female.ziHour }" @click="marriageForm.female.ziHour = !marriageForm.female.ziHour">
                      <div class="toggle-slider"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-button class="btn-submit" :loading="marrying" @click="handleMarriage" style="margin-top: 24px">
            开始合婚
          </el-button>
        </div>

        <!-- 合婚结果 -->
        <Transition name="result-fade">
          <div v-if="marriageResult" class="marriage-result">
            <h3 class="result-title">合婚结果</h3>
            <div class="marriage-score">
              <span class="score-label">综合匹配度</span>
              <span class="score-value">{{ marriageResult.score }}%</span>
            </div>
            <div class="marriage-analysis">
              <p>{{ marriageResult.analysis }}</p>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 每日运势页面 -->
      <div v-else-if="activeTab === 'daily'" class="content-daily">
        <div class="page-header">
          <h1 class="page-title">每日运势</h1>
          <p class="page-subtitle">精准解析每日运程，把握吉凶趋势</p>
        </div>

        <!-- 未添加八字状态 -->
        <div v-if="!baziInfo" class="empty-state">
          <div class="empty-icon">
            <el-icon :size="64"><Calendar /></el-icon>
          </div>
          <h3 class="empty-title">请先添加八字</h3>
          <p class="empty-desc">添加您的八字信息后，即可查看每日运势分析</p>
          <el-button class="btn-add" @click="activeTab = 'calculate'">
            立即添加
          </el-button>
        </div>

        <!-- 运势内容 -->
        <Transition name="fortune-fade" mode="out-in">
          <div v-if="baziInfo" :key="selectedDate" class="fortune-content">
            <div class="fortune-header">
              <div class="date-info">
                <el-icon class="date-nav" @click="changeDate(-1)"><ArrowLeft /></el-icon>
                <span class="date-text">{{ formatDate(selectedDate) }}</span>
                <el-icon class="date-nav" @click="changeDate(1)"><ArrowRight /></el-icon>
              </div>
              <div class="fortune-score">
                <span class="score-label">综合运势</span>
                <span class="score-number">{{ dailyFortune.totalScore }}</span>
              </div>
            </div>

            <div class="fortune-grid">
              <FortuneCard
                v-for="(item, index) in fortuneTypes"
                :key="index"
                :name="item.name"
                :icon="item.icon"
                :score="item.score"
                :desc="item.desc"
              />
            </div>

            <div class="fortune-extra">
              <div class="lucky-item">
                <span class="lucky-label">幸运色</span>
                <span class="lucky-value">{{ dailyFortune.luckyColor }}</span>
              </div>
              <div class="lucky-item">
                <span class="lucky-label">幸运数字</span>
                <span class="lucky-value">{{ dailyFortune.luckyNumber }}</span>
              </div>
              <div class="lucky-item">
                <span class="lucky-label">幸运方位</span>
                <span class="lucky-value">{{ dailyFortune.luckyDirection }}</span>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 页面底部 -->
        <div class="page-footer">
          <h3 class="footer-title">每日运势智能分析系统</h3>
          <p class="footer-subtitle">结合传统命理与现代 AI 技术，为您提供精准的每日运势预测</p>
        </div>
      </div>

      <!-- 塔罗牌页面 -->
      <div v-else-if="activeTab === 'tarot'" class="content-tarot">
        <div class="page-header">
          <h1 class="page-title">AI 塔罗牌占卜</h1>
          <p class="page-subtitle">人工智能驱动的专业塔罗牌解读，探索生命的奥秘，寻找内心的答案</p>
        </div>

        <TarotForm
          v-model="tarotQuestion"
          :suggested-questions="suggestedQuestions"
          :loading="drawing"
          @draw="handleDrawTarot"
        />

        <!-- 塔罗牌结果 -->
        <Transition name="result-fade">
          <div v-if="tarotResult" class="tarot-result">
            <h3 class="result-title">塔罗解读</h3>
            <div class="tarot-cards">
              <TarotCard
                v-for="(card, index) in tarotResult.cards"
                :key="index"
                :card="card"
                :auto-flip="true"
                :ref="el => { if (el) tarotCardRefs[index] = el }"
              />
            </div>
            <div class="tarot-interpretation">
              <h4>综合解读</h4>
              <p>{{ tarotResult.interpretation }}</p>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Calendar, Sunny, Star, ArrowLeft, ArrowRight,
  TrendCharts, Coin, Briefcase, Reading, Search
} from '@element-plus/icons-vue'
import { logoutApi } from '@/api/login'
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import FortuneCard from '@/components/chat/FortuneCard.vue'
import TarotCard from '@/components/chat/TarotCard.vue'
import TarotForm from '@/components/chat/TarotForm.vue'

const router = useRouter()

// 状态管理
const userInfo = ref({
  username: 'admin',
  nickname: '管理员',
  avatar: ''
})

const activeTab = ref('calculate')
const calculating = ref(false)
const marrying = ref(false)
const drawing = ref(false)
const tarotCardRefs = ref([])

// 八字计算表单
const calculateForm = reactive({
  name: '',
  gender: 'male',
  inputType: 'date',
  calendarType: 'solar',
  birthDate: '',
  knowBirthTime: false,
  birthHour: 12,
  birthMinute: 0,
  birthPlace: '',
  useZiHour: false
})

// 八字合婚表单
const marriageForm = reactive({
  male: {
    name: '',
    gender: 'male',
    calendarType: 'solar',
    birthDate: '',
    knowTime: false,
    hour: 12,
    minute: 0,
    birthPlace: '',
    ziHour: false
  },
  female: {
    name: '',
    gender: 'female',
    calendarType: 'solar',
    birthDate: '',
    knowTime: false,
    hour: 12,
    minute: 0,
    birthPlace: '',
    ziHour: false
  }
})

// 每日运势
const baziInfo = ref(null)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const dailyFortune = ref({
  totalScore: 85,
  luckyColor: '红色',
  luckyNumber: '8',
  luckyDirection: '东南'
})

const fortuneTypes = ref([
  { name: '综合运势', icon: TrendCharts, score: 85, desc: '今日运势整体不错' },
  { name: '事业运势', icon: Briefcase, score: 78, desc: '工作进展顺利' },
  { name: '财运运势', icon: Coin, score: 82, desc: '财运平稳' },
  { name: '爱情运势', icon: Star, score: 90, desc: '感情生活甜蜜' },
  { name: '健康运势', icon: Sunny, score: 75, desc: '注意休息' },
  { name: '学业运势', icon: Reading, score: 80, desc: '学习效率高' }
])

// 塔罗牌
const tarotQuestion = ref('')
const suggestedQuestions = ref([
  '创业还是留在大公司更适合我？',
  '对方不喜欢我，我该如何让自己放下？',
  '为何我在社交场合难以做真实的自己？'
])

// 结果
const baziResult = ref(null)
const marriageResult = ref(null)
const tarotResult = ref(null)

// 处理八字计算
const handleCalculate = () => {
  if (!calculateForm.name || !calculateForm.birthDate) {
    ElMessage.warning('请填写完整信息')
    return
  }

  calculating.value = true

  setTimeout(() => {
    baziResult.value = {
      pillars: [
        { name: '年柱', heavenly: '甲', earthly: '辰' },
        { name: '月柱', heavenly: '丁', earthly: '卯' },
        { name: '日柱', heavenly: '壬', earthly: '申' },
        { name: '时柱', heavenly: '乙', earthly: '巳' }
      ]
    }
    baziInfo.value = { name: calculateForm.name }
    calculating.value = false
    ElMessage.success('计算成功')
  }, 1500)
}

// 处理八字合婚
const handleMarriage = () => {
  if (!marriageForm.male.name || !marriageForm.male.birthDate ||
      !marriageForm.female.name || !marriageForm.female.birthDate) {
    ElMessage.warning('请填写完整信息')
    return
  }

  marrying.value = true

  setTimeout(() => {
    const score = Math.floor(Math.random() * 30) + 70
    marriageResult.value = {
      score,
      analysis: score >= 80
        ? '你们八字匹配度很高，性格互补，相处融洽，是天作之合。'
        : '你们八字有一定匹配度，需要互相包容理解，用心经营感情。'
    }
    marrying.value = false
    ElMessage.success('合婚完成')
  }, 1500)
}

// 处理塔罗牌抽取
const handleDrawTarot = () => {
  if (!tarotQuestion.value.trim()) {
    ElMessage.warning('请输入您的问题')
    return
  }

  drawing.value = true

  setTimeout(() => {
    tarotResult.value = {
      cards: [
        { emoji: '🃏', name: '愚者', position: '过去', meaning: '新的开始，冒险精神' },
        { emoji: '⭐', name: '星星', position: '现在', meaning: '希望与启示' },
        { emoji: '🌞', name: '太阳', position: '未来', meaning: '成功与喜悦' }
      ],
      interpretation: '根据塔罗牌的指引，您的问题有着积极的发展趋势。过去的经历为您积累了宝贵的经验，现在的您正处于充满希望的阶段，未来将会迎来成功和喜悦。建议您保持乐观的心态，勇敢面对挑战。'
    }
    drawing.value = false
    ElMessage.success('塔罗牌抽取完成')

    // 触发翻转动画
    nextTick(() => {
      tarotCardRefs.value.forEach((cardRef, index) => {
        setTimeout(() => {
          cardRef?.flip()
        }, index * 300)
      })
    })
  }, 1500)
}

// 日期切换
const changeDate = (days) => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + days)
  selectedDate.value = date.toISOString().split('T')[0]
  loadDailyFortune()
}

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

// 加载每日运势
const loadDailyFortune = () => {
  const scores = [75, 78, 82, 85, 88, 90]
  const randomScore = scores[Math.floor(Math.random() * scores.length)]
  dailyFortune.value.totalScore = randomScore
  fortuneTypes.value.forEach(item => {
    item.score = randomScore - Math.floor(Math.random() * 10)
  })
}

const handleUnlock = () => {
  ElMessage.info('请联系管理员解锁全部功能')
}

const handleCommand = (command) => {
  if (command === 'logout') {
    logoutApi().then(() => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      ElMessage.success('退出成功')
      router.push('/login')
    })
  }
}

onMounted(() => {
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }
  loadDailyFortune()
})
</script>

<style scoped>
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

/* ========== 表单容器 ========== */
.form-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
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

.form-row-inline {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-end;
}

.form-group-inline {
  flex: 1;
}

.form-group-inline.toggle-inline {
  flex: 0 0 auto;
}

.toggle-label-inline {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #000;
  font-weight: 500;
  white-space: nowrap;
}

/* 选项行 */
.date-options-row {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.input-type-tabs-inline {
  display: flex;
  gap: 2px;
  background: #666;
  padding: 3px;
  border-radius: 12px;
  flex: 0 0 auto;
}

.calendar-type-toggle-inline {
  display: flex;
  gap: 2px;
  background: #e5e5e5;
  border-radius: 10px;
  padding: 3px;
  flex: 0 0 auto;
}

/* 类型标签 */
.type-tab {
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  text-align: center;
  letter-spacing: 1px;
  white-space: nowrap;
}

.type-tab.active {
  background: #fff;
  color: #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.type-tab:hover {
  transform: scale(1.05);
}

/* 日历类型切换标签 */
.calendar-type-toggle-inline span {
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.calendar-type-toggle-inline span.active {
  background: #666;
  color: #fff;
}

.calendar-type-toggle-inline span:hover {
  transform: scale(1.05);
}

/* ========== 八字合婚 ========== */
.marriage-form-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
}

.dual-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.person-form {
  background: #fafafa;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #ccc;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: fit-content;
}

.person-form:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #aaa;
}

.person-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.person-icon {
  font-size: 32px;
}

.person-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-fields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  align-items: start;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.form-field-row {
  display: flex;
  gap: 16px;
}

/* 日历类型切换 (八字合婚用) */
.calendar-type-toggle {
  display: flex;
  gap: 2px;
  background: #e5e5e5;
  border-radius: 10px;
  padding: 3px;
  margin-bottom: 8px;
}

.calendar-type-toggle span {
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.calendar-type-toggle span.active {
  background: #666;
  color: #fff;
}

.calendar-type-toggle span:hover {
  transform: scale(1.05);
}

/* toggle label (八字合婚用) */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #000;
  font-weight: 500;
}

/* ========== 每日运势 ========== */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.empty-state .empty-icon {
  color: #000;
  margin-bottom: 32px;
}

.empty-title {
  font-size: 28px;
  font-weight: 600;
  color: #000;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.empty-desc {
  font-size: 18px;
  color: #666;
  margin: 0 0 40px;
}

.btn-add {
  background: linear-gradient(135deg, #333 0%, #555 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 18px 48px;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.btn-add:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
}

.fortune-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 56px;
}

.fortune-fade-enter-active,
.fortune-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fortune-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fortune-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.fortune-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px;
  background: linear-gradient(135deg, #333 0%, #555 100%);
  border-radius: 16px;
  margin-bottom: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.date-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.date-nav {
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 8px;
  border-radius: 50%;
}

.date-nav:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.2);
}

.date-text {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.fortune-score {
  text-align: right;
}

.score-label {
  font-size: 14px;
  color: #fff;
  margin-right: 12px;
  font-weight: 600;
  letter-spacing: 1px;
}

.score-number {
  font-size: 48px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -2px;
}

.fortune-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.fortune-extra {
  display: flex;
  justify-content: center;
  gap: 64px;
  padding: 32px;
  background: linear-gradient(135deg, #333 0%, #555 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.lucky-item {
  text-align: center;
}

.lucky-label {
  font-size: 11px;
  color: #fff;
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.lucky-value {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ========== 结果过渡动画 ========== */
.result-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-fade-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
}

.result-fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* ========== 八字命盘 ========== */
.pillar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 550px;
  margin: 0 auto;
}

.pillar-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pillar-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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

/* ========== 合婚结果 ========== */
.marriage-score {
  text-align: center;
  margin-bottom: 32px;
}

.marriage-score .score-label {
  font-size: 14px;
  color: #fff;
  margin-right: 12px;
  font-weight: 500;
  letter-spacing: 1px;
}

.marriage-score .score-value {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -1px;
}

.marriage-analysis {
  text-align: center;
  padding: 28px;
  background: #fff;
  border-radius: 14px;
}

.marriage-analysis p {
  font-size: 18px;
  color: #000;
  line-height: 1.6;
  margin: 0;
  font-weight: 600;
}

/* ========== 塔罗牌结果 ========== */
.tarot-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.tarot-interpretation {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
}

.tarot-interpretation h4 {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 12px;
  letter-spacing: 0.5px;
}

.tarot-interpretation p {
  font-size: 14px;
  color: #000;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .dual-form {
    grid-template-columns: 1fr;
  }

  .fortune-grid {
    grid-template-columns: 1fr;
  }

  .pillar-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tarot-cards {
    grid-template-columns: 1fr;
  }

  .form-row-inline {
    flex-wrap: wrap;
  }

  .form-group-inline {
    min-width: 100%;
  }

  .fortune-extra {
    flex-direction: column;
    gap: 24px;
  }
}

/* ========== Element Plus 样式覆盖 ========== */
:deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: none !important;
  border: 1px solid #ddd;
  background: #fafafa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
</style>
