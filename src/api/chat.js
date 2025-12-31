/**
 * AI 聊天相关的 API 接口
 */

import { chatService } from '@/utils/request'

/**
 * 发送聊天消息
 * @param {string} message - 用户消息内容
 * @param {Array} history - 历史消息记录
 * @returns {Promise} 返回 AI 回复
 */
export const chatApi = (message, history = []) => {
  return chatService({
    url: '/chat',
    method: 'post',
    data: {
      message,
      history
    }
  })
}

/**
 * 获取对话历史列表
 * @returns {Promise} 返回对话列表
 */
export const getChatHistoryApi = () => {
  return chatService({
    url: '/chat/history',
    method: 'get'
  })
}

/**
 * 获取对话详情
 * @param {number} chatId - 对话 ID
 * @returns {Promise} 返回对话详情和消息记录
 */
export const getChatDetailApi = (chatId) => {
  return chatService({
    url: `/chat/${chatId}`,
    method: 'get'
  })
}

/**
 * 创建新对话
 * @param {string} title - 对话标题
 * @returns {Promise} 返回新对话信息
 */
export const createChatApi = (title) => {
  return chatService({
    url: '/chat',
    method: 'post',
    data: { title }
  })
}

/**
 * 删除对话
 * @param {number} chatId - 对话 ID
 * @returns {Promise} 返回删除结果
 */
export const deleteChatApi = (chatId) => {
  return chatService({
    url: `/chat/${chatId}`,
    method: 'delete'
  })
}

/**
 * 清空对话消息
 * @param {number} chatId - 对话 ID
 * @returns {Promise} 返回清空结果
 */
export const clearChatApi = (chatId) => {
  return chatService({
    url: `/chat/${chatId}/clear`,
    method: 'post'
  })
}
