/**
 * SSE (Server-Sent Events) 流式请求工具
 * 用于处理命理大师 API 的流式输出
 */

/**
 * 从 markdown 代码块中提取 JSON 内容
 * 处理 LLM 返回的 ```json ... ``` 格式
 */
function extractJSONFromMarkdown(text) {
  // 匹配 ```json ... ``` 或 ``` ... ``` 格式
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)```/
  const match = text.match(codeBlockRegex)

  if (match && match[1]) {
    return match[1].trim()
  }

  // 如果没有代码块，尝试直接解析
  return text.trim()
}

/**
 * 尝试解析 JSON，支持 markdown 代码块格式
 */
function tryParseJSON(text) {
  // 先尝试直接解析
  try {
    return JSON.parse(text)
  } catch (e) {
    // 失败则尝试提取 markdown 代码块中的 JSON
    const extracted = extractJSONFromMarkdown(text)
    try {
      return JSON.parse(extracted)
    } catch (e2) {
      console.error('[SSE] JSON 解析失败:', e2)
      return null
    }
  }
}

/**
 * SSE 流式请求
 * @param {string} url - 请求 URL
 * @param {Object} data - 请求数据
 * @param {Object} callbacks - 回调函数
 * @param {Function} callbacks.onStart - 开始生成回调
 * @param {Function} callbacks.onChunk - 内容块回调
 * @param {Function} callbacks.onValidationStart - 验证开始回调
 * @param {Function} callbacks.onComplete - 完成回调
 * @param {Function} callbacks.onError - 错误回调
 * @returns {Object} - 包含 abort 方法的对象
 */
export async function streamRequest(url, data, callbacks = {}) {
  const {
    onStart = () => {},
    onChunk = () => {},
    onValidationStart = () => {},
    onComplete = () => {},
    onError = () => {}
  } = callbacks

  const abortController = new AbortController()

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(data),
      signal: abortController.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n\n')
      buffer = lines.pop() // 保留未完成的行

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event = JSON.parse(line.slice(6))

            switch (event.type) {
              case 'start':
                console.log('[SSE] 开始生成:', event.data.request_id)
                onStart(event.data)
                break

              case 'chunk':
                console.log('[SSE] 收到 chunk:', event.data.content)
                onChunk(event.data.content, event.data)
                break

              case 'validation_start':
                console.log('[SSE] 开始验证结构...')
                onValidationStart(event.data)
                break

              case 'complete':
                console.log('[SSE] 完成，result:', event.data.result)
                // 尝试解析 result，可能包含 markdown 代码块
                let result = event.data.result
                if (typeof result === 'string') {
                  const parsed = tryParseJSON(result)
                  if (parsed) {
                    result = parsed
                  }
                }
                onComplete(result)
                break

              case 'error':
                console.error('[SSE] 错误:', event.data.error)
                onError(event.data.error)
                break

              default:
                console.log('[SSE] 未知事件类型:', event.type)
            }
          } catch (e) {
            console.error('[SSE] 解析事件失败:', e, line)
          }
        }
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('[SSE] 请求已取消')
    } else {
      console.error('[SSE] 请求失败:', error)
      onError(error.message || '请求失败')
    }
  }

  return {
    abort: () => abortController.abort()
  }
}

/**
 * 八字计算流式请求
 */
export function streamBaziCalculate(data, callbacks) {
  return streamRequest(
    'http://127.0.0.1:8000/api/v1/bazi/calculate/stream',
    data,
    callbacks
  )
}

/**
 * 八字合婚流式请求
 */
export function streamBaziMarriage(data, callbacks) {
  return streamRequest(
    'http://127.0.0.1:8000/api/v1/bazi/marriage/stream',
    data,
    callbacks
  )
}

/**
 * 每日运势流式请求
 */
export function streamFortuneDaily(data, callbacks) {
  return streamRequest(
    'http://127.0.0.1:8000/api/v1/fortune/daily/stream',
    data,
    callbacks
  )
}

/**
 * 塔罗牌流式请求
 */
export function streamTarotDraw(data, callbacks) {
  return streamRequest(
    'http://127.0.0.1:8000/api/v1/tarot/draw/stream',
    data,
    callbacks
  )
}
