/**
 * 八字命理相关的 API 接口
 * 连接后端API (Python 后端，端口 8000)
 */

import { chatService } from '@/utils/request'

/**
 * 八字计算
 * @param {Object} data - 八字计算参数
 * @param {string} data.name - 姓名，2-20 个字符
 * @param {string} data.gender - 性别，`male` 或 `female`
 * @param {string} data.inputType - 输入类型，`date`(日期) 或 `bazi`(八字)
 * @param {string} data.calendarType - 历法类型，`solar`(阳历) 或 `lunar`(农历)，默认 solar
 * @param {string} data.birthDate - 出生日期，格式 `YYYY-MM-DD`，inputType=date 时必填
 * @param {boolean} data.knowBirthTime - 是否知道出生时间，默认 false
 * @param {number} data.birthHour - 出生时辰（0-23），knowBirthTime=true 时必填
 * @param {number} data.birthMinute - 出生分钟（0-59），knowBirthTime=true 时必填
 * @param {string} data.birthPlace - 出生地点
 * @param {boolean} data.useZiHour - 是否使用早晚子时，默认 false
 * @returns {Promise} 返回八字计算结果
 */
export const baziCalculateApi = (data) => {
  return chatService({
    url: '/bazi/calculate',
    method: 'post',
    data
  })
}

/**
 * 八字合婚
 * @param {Object} data - 合婚参数
 * @param {Object} data.male - 男方信息
 * @param {Object} data.female - 女方信息
 * @returns {Promise} 返回合婚结果
 */
export const baziMarriageApi = (data) => {
  return chatService({
    url: '/bazi/marriage',
    method: 'post',
    data
  })
}

/**
 * 每日运势
 * @param {Object} data - 运势查询参数
 * @param {string} data.baziId - 用户八字信息 ID
 * @param {string} data.date - 查询日期，格式 `YYYY-MM-DD`
 * @returns {Promise} 返回每日运势结果
 */
export const fortuneDailyApi = (data) => {
  return chatService({
    url: '/fortune/daily',
    method: 'post',
    data
  })
}

/**
 * 塔罗牌占卜
 * @param {Object} data - 塔罗牌参数
 * @param {string} data.question - 占卜问题，1-200 字符
 * @param {string} data.spread - 牌阵类型，默认 `three_card`（三牌阵）
 * @returns {Promise} 返回塔罗牌占卜结果
 */
export const tarotDrawApi = (data) => {
  return chatService({
    url: '/tarot/draw',
    method: 'post',
    data
  })
}
