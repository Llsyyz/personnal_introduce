/**
 * 笔记相关的 API 接口
 * 连接后端真实接口
 */

import request from '@/utils/request'

/**
 * 获取笔记列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @param {string} params.category - 分类筛选
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise} 返回笔记列表
 */
export const getNotesApi = (params) => {
  return request({
    url: '/notes',
    method: 'get',
    params
  })
}

/**
 * 获取笔记详情
 * @param {number} id - 笔记 ID
 * @returns {Promise} 返回笔记详情
 */
export const getNoteDetailApi = (id) => {
  return request({
    url: `/notes/${id}`,
    method: 'get'
  })
}

/**
 * 创建笔记
 * @param {Object} data - 笔记数据
 * @param {string} data.title - 标题
 * @param {string} data.category - 分类
 * @param {string} data.color - 颜色
 * @param {string} data.content - 富文本内容
 * @param {Array<string>} data.tags - 标签数组
 * @returns {Promise} 返回创建结果
 */
export const createNoteApi = (data) => {
  return request({
    url: '/notes',
    method: 'post',
    data
  })
}

/**
 * 更新笔记
 * @param {number} id - 笔记 ID
 * @param {Object} data - 更新数据
 * @returns {Promise} 返回更新结果
 */
export const updateNoteApi = (id, data) => {
  return request({
    url: `/notes/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除笔记
 * @param {number} id - 笔记 ID
 * @returns {Promise} 返回删除结果
 */
export const deleteNoteApi = (id) => {
  return request({
    url: `/notes/${id}`,
    method: 'delete'
  })
}

/**
 * 获取笔记统计
 * @returns {Promise} 返回统计数据
 */
export const getNotesStatsApi = () => {
  return request({
    url: '/notes/stats',
    method: 'get'
  })
}
