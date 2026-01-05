<!--
  Chat.vue - 命理大师页面
  黑白简约风格，两栏布局
  包含：每日运势、八字计算、八字合婚、塔罗牌
-->

<template>
  <div class="chat-page">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="navbar-content">
        <!-- 左侧品牌区域 -->
        <div class="nav-left">
          <div class="brand">
            <div class="brand-icon">
              <el-icon :size="22">
                <Star />
              </el-icon>
            </div>
            <span class="brand-name">NoteSpace</span>
          </div>
        </div>

        <!-- 中间搜索区域 -->
        <div class="nav-center">
          <div class="global-search">
            <el-icon class="search-icon"><Search /></el-icon>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索..."
              class="search-input"
              clearable
            />
          </div>
        </div>

        <!-- 右侧操作区域 -->
        <div class="nav-right">
          <!-- 快速操作按钮组 -->
          <div class="quick-actions">
            <el-tooltip content="首页" placement="bottom">
              <el-button class="action-btn" @click="router.push('/home')">
                <el-icon :size="18"><HomeFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="AI 助手" placement="bottom">
              <el-button class="action-btn active" @click="router.push('/chat')">
                <el-icon :size="18"><ChatDotRound /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="热点资讯" placement="bottom">
              <el-button class="action-btn" @click="router.push('/news')">
                <el-icon :size="18"><Reading /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="查看笔记" placement="bottom">
              <el-button class="action-btn" @click="router.push('/notes')">
                <el-icon :size="18"><Notebook /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="相册" placement="bottom">
              <el-button class="action-btn" @click="router.push('/gallery')">
                <el-icon :size="18"><Collection /></el-icon>
              </el-button>
            </el-tooltip>
          </div>

          <!-- 用户下拉区域 -->
          <el-dropdown @command="handleCommand" trigger="click">
            <div class="user-dropdown">
              <el-avatar :src="userInfo.avatar" :size="36" class="user-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="user-name">{{ userInfo.nickname }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="home">
                  <el-icon><HomeFilled /></el-icon>
                  <span>首页</span>
                </el-dropdown-item>
                <el-dropdown-item command="chat">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>AI 助手</span>
                </el-dropdown-item>
                <el-dropdown-item command="news">
                  <el-icon><Reading /></el-icon>
                  <span>热点资讯</span>
                </el-dropdown-item>
                <el-dropdown-item command="notes">
                  <el-icon><Notebook /></el-icon>
                  <span>笔记</span>
                </el-dropdown-item>
                <el-dropdown-item command="gallery">
                  <el-icon><Collection /></el-icon>
                  <span>相册</span>
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-wrapper">
      <!-- 左侧边栏 -->
      <ChatSidebar
        v-model="activeTab"
        :user-info="userInfo"
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

        <!-- 流式计算结果 -->
        <StreamingResult
          v-if="calculating || baziResult"
          type="bazi"
          :data="baziResult"
          :is-calculating="calculating"
        />
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

        <!-- 流式合婚结果 -->
        <StreamingResult
          v-if="marrying || marriageResult"
          type="marriage"
          :data="marriageResult"
          :is-calculating="marrying"
        />
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
                :icon="fortuneIcons[item.name]"
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

        <!-- 流式塔罗结果 -->
        <StreamingResult
          v-if="drawing || tarotResult"
          type="tarot"
          :data="tarotResult"
          :is-calculating="drawing"
        />
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Calendar, Sunny, Star, ArrowLeft, ArrowRight,
  TrendCharts, Coin, Briefcase, Reading, Search,
  HomeFilled, ChatDotRound, Collection, User, ArrowDown, SwitchButton
} from '@element-plus/icons-vue'
import { logoutApi } from '@/api/login'
import { baziCalculateApi, baziMarriageApi, fortuneDailyApi, tarotDrawApi } from '@/api/bazi'
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import FortuneCard from '@/components/chat/FortuneCard.vue'
import TarotForm from '@/components/chat/TarotForm.vue'
import StreamingResult from '@/components/chat/StreamingResult.vue'

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

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
  { name: '综合运势', score: 85, desc: '今日运势整体不错，适合开展新计划' },
  { name: '事业运势', score: 78, desc: '工作进展顺利，有机会获得领导认可' },
  { name: '财运运势', score: 82, desc: '财运平稳，不宜进行大额投资' },
  { name: '爱情运势', score: 90, desc: '感情生活甜蜜，适合约会表白' },
  { name: '健康运势', score: 75, desc: '注意休息，避免过度劳累' },
  { name: '学业运势', score: 80, desc: '学习效率高，适合备考进修' }
])

// 图标映射
const fortuneIcons = {
  '综合运势': TrendCharts,
  '事业运势': Briefcase,
  '财运运势': Coin,
  '爱情运势': Star,
  '健康运势': Sunny,
  '学业运势': Reading
}

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
const handleCalculate = async () => {
  // 验证必填字段
  if (!calculateForm.name) {
    ElMessage.warning('请输入姓名')
    return
  }
  if (calculateForm.inputType === 'date' && !calculateForm.birthDate) {
    ElMessage.warning('请选择出生日期')
    return
  }
  if (!calculateForm.birthPlace) {
    ElMessage.warning('请输入出生地点')
    return
  }
  if (calculateForm.knowBirthTime && (calculateForm.birthHour === undefined || calculateForm.birthMinute === undefined)) {
    ElMessage.warning('请选择完整的出生时间')
    return
  }

  calculating.value = true

  try {
    const response = await baziCalculateApi(calculateForm)
    baziResult.value = response.data
    // 保存八字信息用于每日运势
    baziInfo.value = {
      name: calculateForm.name,
      id: response.data.id || Date.now().toString()
    }
    ElMessage.success(response.message || '计算成功')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '计算失败，请重试')
  } finally {
    calculating.value = false
  }
}

// 处理八字合婚
const handleMarriage = async () => {
  // 验证必填字段
  if (!marriageForm.male.name || !marriageForm.male.birthDate || !marriageForm.male.birthPlace) {
    ElMessage.warning('请填写完整的男方信息')
    return
  }
  if (!marriageForm.female.name || !marriageForm.female.birthDate || !marriageForm.female.birthPlace) {
    ElMessage.warning('请填写完整的女方信息')
    return
  }
  if (marriageForm.male.knowTime && (marriageForm.male.hour === undefined || marriageForm.male.minute === undefined)) {
    ElMessage.warning('请选择完整的男方出生时间')
    return
  }
  if (marriageForm.female.knowTime && (marriageForm.female.hour === undefined || marriageForm.female.minute === undefined)) {
    ElMessage.warning('请选择完整的女方出生时间')
    return
  }

  marrying.value = true

  try {
    const requestData = {
      male: {
        name: marriageForm.male.name,
        gender: marriageForm.male.gender,
        calendarType: marriageForm.male.calendarType,
        birthDate: marriageForm.male.birthDate,
        knowTime: marriageForm.male.knowTime,
        hour: marriageForm.male.hour,
        minute: marriageForm.male.minute,
        birthPlace: marriageForm.male.birthPlace,
        ziHour: marriageForm.male.ziHour
      },
      female: {
        name: marriageForm.female.name,
        gender: marriageForm.female.gender,
        calendarType: marriageForm.female.calendarType,
        birthDate: marriageForm.female.birthDate,
        knowTime: marriageForm.female.knowTime,
        hour: marriageForm.female.hour,
        minute: marriageForm.female.minute,
        birthPlace: marriageForm.female.birthPlace,
        ziHour: marriageForm.female.ziHour
      }
    }
    const response = await baziMarriageApi(requestData)
    marriageResult.value = response.data
    ElMessage.success(response.message || '合婚完成')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '合婚失败，请重试')
  } finally {
    marrying.value = false
  }
}

// 处理塔罗牌抽取
const handleDrawTarot = async () => {
  if (!tarotQuestion.value.trim()) {
    ElMessage.warning('请输入您的问题')
    return
  }

  drawing.value = true

  try {
    const response = await tarotDrawApi({
      question: tarotQuestion.value,
      spread: 'three_card'
    })
    tarotResult.value = response.data
    ElMessage.success(response.message || '塔罗牌抽取完成')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '抽取失败，请重试')
  } finally {
    drawing.value = false
  }
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
const loadDailyFortune = async () => {
  if (!baziInfo.value?.id) {
    return
  }

  try {
    const response = await fortuneDailyApi({
      baziId: baziInfo.value.id,
      date: selectedDate.value
    })

    // 更新运势数据
    dailyFortune.value.totalScore = response.data.totalScore || 85

    // 更新各项运势
    if (response.data.fortuneTypes && Array.isArray(response.data.fortuneTypes)) {
      fortuneTypes.value = response.data.fortuneTypes.map(item => ({
        name: item.name,
        icon: getFortuneIcon(item.name),
        score: item.score,
        desc: item.desc
      }))
    }

    // 更新幸运信息
    if (response.data.lucky) {
      dailyFortune.value.luckyColor = response.data.lucky.color || '红色'
      dailyFortune.value.luckyNumber = response.data.lucky.number || '8'
      dailyFortune.value.luckyDirection = response.data.lucky.direction || '东南'
    }
  } catch (error) {
    console.error('加载运势失败:', error)
    // 失败时使用默认数据
    const scores = [75, 78, 82, 85, 88, 90]
    const randomScore = scores[Math.floor(Math.random() * scores.length)]
    dailyFortune.value.totalScore = randomScore
    fortuneTypes.value.forEach(item => {
      item.score = randomScore - Math.floor(Math.random() * 10)
    })
  }
}

// 根据运势名称获取对应图标
const getFortuneIcon = (name) => {
  return fortuneIcons[name] || TrendCharts
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
  } else if (command === 'home') {
    router.push('/home')
  } else if (command === 'chat') {
    router.push('/chat')
  } else if (command === 'news') {
    router.push('/news')
  } else if (command === 'notes') {
    router.push('/notes')
  } else if (command === 'gallery') {
    router.push('/gallery')
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
/* ========== 导航栏 ========== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.brand:hover {
  transform: scale(1.02);
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.nav-center {
  flex: 1;
  max-width: 400px;
  margin: 0 32px;
}

.global-search {
  display: flex;
  align-items: center;
  background: #f5f5f7;
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.global-search:hover {
  background: #f0f0f2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.global-search .search-icon {
  color: #999;
  margin-right: 8px;
}

.global-search :deep(.el-input__wrapper) {
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.global-search :deep(.el-input__inner) {
  color: #333;
  font-size: 14px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.quick-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #666;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #f5f5f7;
  color: #333;
  transform: scale(1.05);
}

.action-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
}

.user-dropdown:hover {
  background: #f5f5f7;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  font-size: 14px;
  color: #999;
  transition: transform 0.3s ease;
}

.user-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* ========== 主内容包装器 ========== */
.main-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ========== 页面基础 ========== */
.chat-page {
  display: flex;
  flex-direction: column;
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
  .navbar-content {
    padding: 10px 16px;
  }

  .nav-center {
    display: none;
  }

  .user-name {
    display: none;
  }

  .quick-actions .action-btn:nth-child(1),
  .quick-actions .action-btn:nth-child(3),
  .quick-actions .action-btn:nth-child(4),
  .quick-actions .action-btn:nth-child(5) {
    display: none;
  }

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
