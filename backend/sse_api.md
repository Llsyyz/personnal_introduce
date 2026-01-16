# SSE 流式接口文档

> 命理大师 API - Server-Sent Events 流式输出接口完整文档

## 目录

- [概述](#概述)
- [SSE 事件类型](#sse-事件类型)
- [接口列表](#接口列表)
- [前端集成示例](#前端集成示例)
- [技术原理](#技术原理)
- [部署配置](#部署配置)
- [错误处理](#错误处理)

---

## 概述

命理大师 API 提供了基于 **Server-Sent Events (SSE)** 的流式输出接口，让用户可以实时看到 LLM 生成的内容，无需等待完整响应。

### SSE 优势

| 特性 | 普通 API | SSE 流式 API |
|------|---------|-------------|
| 首屏时间 | 等待全部生成（30秒） | 0.5秒开始输出 |
| 用户体验 | 长时间白屏 | 实时看到生成过程 |
| 连接方式 | 短连接 | 长连接 |
| 适用场景 | 小数据量 | 大文本生成 |

### 技术架构

```
前端 ←SSE→ FastAPI Handler ←asyncio.Queue→ BaziService ←LLM Stream→ ChatOpenAI
```

---

## SSE 事件类型

### 完整事件流

```
start → stream_start → stream_chunk (多次) → stream_complete → structure_start → complete
                                                              ↓
                                                          error (异常时)
```

### 1. start - 开始处理

**触发时机**: 请求开始，分配 request_id

```json
{
  "type": "start",
  "data": {
    "request_id": "a1b2c3d4",
    "service": "八字"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| request_id | string | 唯一请求标识（8位） |
| service | string | 服务类型：八字/合婚 |

---

### 2. stream_start - 流式生成开始

**触发时机**: LLM 开始流式生成

```json
{
  "type": "stream_start",
  "data": {
    "service": "八字",
    "request_id": "a1b2c3d4"
  }
}
```

---

### 3. stream_chunk - 内容块（实时推送）

**触发时机**: 每次从 LLM 获取到新的内容块

```json
{
  "type": "stream_chunk",
  "data": {
    "content": "姓名：张三\n",
    "chunk_index": 5,
    "content_length": 20
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| content | string | 当前内容块文本 |
| chunk_index | number | 内容块序号（从1开始） |
| content_length | number | 累计内容长度 |

---

### 4. stream_complete - 流式生成完成

**触发时机**: LLM 流式生成全部完成

```json
{
  "type": "stream_complete",
  "data": {
    "content_length": 520,
    "stage": "structure_start"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| content_length | number | 完整内容长度 |
| stage | string | 下一阶段：structure_start |

---

### 5. structure_start - 结构化开始

**触发时机**: 开始将流式内容转换为结构化 JSON

```json
{
  "type": "structure_start",
  "data": {
    "message": "正在转换为结构化数据..."
  }
}
```

---

### 6. complete - 完成（返回最终结果）

**触发时机**: 结构化处理完成，返回最终结果

```json
{
  "type": "complete",
  "data": {
    "result": {
      "pillars": [
        {
          "name": "年柱",
          "heavenly": "庚",
          "earthly": "午"
        },
        {
          "name": "月柱",
          "heavenly": "甲",
          "earthly": "申"
        },
        {
          "name": "日柱",
          "heavenly": "丙",
          "earthly": "子"
        },
        {
          "name": "时柱",
          "heavenly": "戊",
          "earthly": "戌"
        }
      ],
      "wuxing": {
        "dayMaster": "丙火",
        "strength": "身旺"
      },
      "shishen": [
        {
          "name": "正官",
          "strength": "强"
        },
        {
          "name": "正财",
          "strength": "中"
        }
      ]
    },
    "is_mock": false
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| result | object | 结构化的八字计算结果 |
| is_mock | boolean | 是否为模拟数据（API 失败时为 true） |

---

### 7. error - 错误

**触发时机**: 发生异常时

```json
{
  "type": "error",
  "data": {
    "error": "API 调用超时，使用模拟数据"
  }
}
```

---

## 接口列表

### 1. 八字计算（流式）

```
POST /api/v1/bazi/calculate/stream
Content-Type: application/json
```

#### 请求示例

```json
{
  "name": "张三",
  "gender": "male",
  "inputType": "date",
  "calendarType": "solar",
  "birthDate": "1990-06-15",
  "knowBirthTime": true,
  "birthHour": 14,
  "birthMinute": 30,
  "birthPlace": "北京市朝阳区",
  "useZiHour": false
}
```

#### SSE 事件流示例

```
data: {"type":"start","data":{"request_id":"abc123","service":"八字"}}

data: {"type":"stream_start","data":{"service":"八字","request_id":"abc123"}}

data: {"type":"stream_chunk","data":{"content":"姓名：张三\n","chunk_index":1}}

data: {"type":"stream_chunk","data":{"content":"性别：男\n","chunk_index":2}}

data: {"type":"stream_chunk","data":{"content":"出生日期：1990年6月15日\n","chunk_index":3}}

data: {"type":"stream_complete","data":{"content_length":520,"stage":"structure_start"}}

data: {"type":"structure_start","data":{"message":"正在转换为结构化数据..."}}

data: {"type":"complete","data":{"result":{...},"is_mock":false}}
```

---

### 2. 八字合婚（流式）

```
POST /api/v1/bazi/marriage/stream
Content-Type: application/json
```

#### 请求示例

```json
{
  "male": {
    "name": "张三",
    "gender": "male",
    "birthDate": "1990-06-15",
    "knowTime": true,
    "hour": 14,
    "minute": 30,
    "birthPlace": "北京市朝阳区",
    "calendarType": "solar",
    "ziHour": false
  },
  "female": {
    "name": "李四",
    "gender": "female",
    "birthDate": "1992-08-20",
    "knowTime": true,
    "hour": 10,
    "minute": 0,
    "birthPlace": "上海市浦东新区",
    "calendarType": "solar",
    "ziHour": false
  }
}
```

#### SSE 事件流示例

```
data: {"type":"start","data":{"request_id":"def456","service":"合婚"}}

data: {"type":"stream_start","data":{"service":"合婚","request_id":"def456"}}

data: {"type":"stream_chunk","data":{"content":"正在分析男女双方八字...\n","chunk_index":1}}

...

data: {"type":"complete","data":{"result":{"score":85,"level":"上等婚配",...},"is_mock":false}}
```

---

## 前端集成示例

### 1. 原生 JavaScript (Fetch API)

```javascript
/**
 * SSE 流式请求封装
 * @param {string} url - 接口地址
 * @param {object} requestData - 请求数据
 * @param {object} callbacks - 回调函数
 */
async function sseRequest(url, requestData, callbacks = {}) {
  const {
    onStart = (data) => {},
    onStreamStart = (data) => {},
    onChunk = (content) => {},
    onStreamComplete = (data) => {},
    onStructureStart = (data) => {},
    onComplete = (result) => {},
    onError = (error) => {}
  } = callbacks;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event = JSON.parse(line.slice(6));

            switch (event.type) {
              case 'start':
                onStart(event.data);
                break;

              case 'stream_start':
                onStreamStart(event.data);
                break;

              case 'stream_chunk':
                onChunk(event.data);
                break;

              case 'stream_complete':
                onStreamComplete(event.data);
                break;

              case 'structure_start':
                onStructureStart(event.data);
                break;

              case 'complete':
                onComplete(event.data);
                break;

              case 'error':
                onError(event.data);
                break;
            }
          } catch (e) {
            console.error('[SSE] 解析事件失败:', e, line);
          }
        }
      }
    }
  } catch (error) {
    console.error('[SSE] 请求失败:', error);
    onError({ error: error.message });
  }
}

// 使用示例
sseRequest('/api/v1/bazi/calculate/stream',
  {
    name: "张三",
    gender: "male",
    birthDate: "1990-06-15",
    knowBirthTime: true,
    birthHour: 14,
    birthMinute: 30,
    birthPlace: "北京市朝阳区",
    calendarType: "solar",
    useZiHour: false,
    inputType: "date"
  },
  {
    onStart: (data) => {
      console.log('开始处理，请求ID:', data.request_id);
      showLoading();
    },
    onStreamStart: (data) => {
      console.log('开始流式生成');
      updateStatus('正在生成内容...');
    },
    onChunk: (data) => {
      // 实时追加内容
      appendContent(data.content);
    },
    onStreamComplete: (data) => {
      console.log('流式生成完成，内容长度:', data.content_length);
      updateStatus('正在转换为结构化数据...');
    },
    onStructureStart: (data) => {
      console.log(data.message);
    },
    onComplete: (data) => {
      console.log('完成，结果:', data.result);
      hideLoading();
      renderResult(data.result, data.is_mock);
    },
    onError: (data) => {
      console.error('错误:', data.error);
      showError(data.error);
    }
  }
);
```

---

### 2. Vue 3 Composition API

```vue
<template>
  <div class="bazi-calculator">
    <div v-if="loading" class="status-bar">
      <div class="status">{{ status }}</div>
      <div class="progress">{{ progress }}%</div>
    </div>

    <div v-if="streamingContent" class="streaming-output">
      <div class="output-content">{{ streamingContent }}</div>
    </div>

    <div v-if="result" class="bazi-result">
      <h3>计算结果</h3>
      <div v-if="result.is_mock" class="mock-badge">模拟数据</div>
      <pre>{{ JSON.stringify(result.result, null, 2) }}</pre>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <button @click="startCalculation" :disabled="loading">
      {{ loading ? '计算中...' : '开始计算' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);
const status = ref('');
const progress = ref(0);
const streamingContent = ref('');
const result = ref(null);
const error = ref(null);
const requestId = ref('');

async function startCalculation() {
  loading.value = true;
  status.value = '正在连接...';
  progress.value = 0;
  streamingContent.value = '';
  result.value = null;
  error.value = null;

  const requestData = {
    name: "张三",
    gender: "male",
    birthDate: "1990-06-15",
    knowBirthTime: true,
    birthHour: 14,
    birthMinute: 30,
    birthPlace: "北京市朝阳区",
    calendarType: "solar",
    useZiHour: false,
    inputType: "date"
  };

  try {
    const response = await fetch('/api/v1/bazi/calculate/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const event = JSON.parse(line.slice(6));

          switch (event.type) {
            case 'start':
              requestId.value = event.data.request_id;
              status.value = '开始计算...';
              progress.value = 5;
              break;

            case 'stream_start':
              status.value = '正在生成内容...';
              progress.value = 10;
              break;

            case 'stream_chunk':
              streamingContent.value += event.data.content;
              progress.value = Math.min(50, progress.value + 2);
              break;

            case 'stream_complete':
              status.value = '正在转换为结构化数据...';
              progress.value = 70;
              break;

            case 'structure_start':
              status.value = event.data.message;
              progress.value = 80;
              break;

            case 'complete':
              result.value = event.data;
              loading.value = false;
              status.value = '完成!';
              progress.value = 100;
              break;

            case 'error':
              error.value = event.data.error;
              loading.value = false;
              break;
          }
        }
      }
    }
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
}
</script>

<style scoped>
.bazi-calculator {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 15px;
}

.streaming-output {
  padding: 15px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  white-space: pre-wrap;
  margin-bottom: 15px;
}

.bazi-result {
  padding: 15px;
  background: #e8f5e9;
  border-radius: 4px;
  margin-bottom: 15px;
}

.mock-badge {
  display: inline-block;
  padding: 4px 8px;
  background: #ff9800;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
}

.error-message {
  padding: 15px;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
  margin-bottom: 15px;
}

button {
  padding: 10px 20px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
```

---

### 3. React Hook

```javascript
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * SSE 流式请求 Hook
 */
function useSSEStream() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [streamingContent, setStreamingContent] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [requestId, setRequestId] = useState('');
  const abortControllerRef = useRef(null);

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const stream = useCallback(async (url, requestData) => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setStatus('正在连接...');
    setProgress(0);
    setStreamingContent('');
    setResult(null);
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const event = JSON.parse(line.slice(6));

            switch (event.type) {
              case 'start':
                setRequestId(event.data.request_id);
                setStatus('开始计算...');
                setProgress(5);
                break;

              case 'stream_start':
                setStatus('正在生成内容...');
                setProgress(10);
                break;

              case 'stream_chunk':
                setStreamingContent(prev => prev + event.data.content);
                setProgress(p => Math.min(50, p + 2));
                break;

              case 'stream_complete':
                setStatus('正在转换为结构化数据...');
                setProgress(70);
                break;

              case 'structure_start':
                setStatus(event.data.message);
                setProgress(80);
                break;

              case 'complete':
                setResult(event.data);
                setLoading(false);
                setStatus('完成!');
                setProgress(100);
                break;

              case 'error':
                setError(event.data.error);
                setLoading(false);
                break;
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('请求已取消');
      } else {
        setError(err.message);
        setLoading(false);
      }
    }
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStreamingContent('');
    setResult(null);
    setError(null);
    setProgress(0);
    setStatus('');
  }, []);

  return {
    loading,
    status,
    progress,
    streamingContent,
    result,
    error,
    requestId,
    stream,
    abort,
    reset
  };
}

// 使用示例
function BaziCalculator() {
  const {
    loading,
    status,
    progress,
    streamingContent,
    result,
    error,
    stream,
    abort,
    reset
  } = useSSEStream();

  const handleCalculate = async () => {
    reset();
    await stream('/api/v1/bazi/calculate/stream', {
      name: "张三",
      gender: "male",
      birthDate: "1990-06-15",
      knowBirthTime: true,
      birthHour: 14,
      birthMinute: 30,
      birthPlace: "北京市朝阳区",
      calendarType: "solar",
      useZiHour: false,
      inputType: "date"
    });
  };

  return (
    <div className="bazi-calculator">
      <div className="controls">
        <button
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? '计算中...' : '开始计算'}
        </button>
        {loading && (
          <button onClick={abort}>取消</button>
        )}
        {streamingContent && (
          <button onClick={reset}>重置</button>
        )}
      </div>

      {loading && (
        <div className="status-bar">
          <span>{status}</span>
          <span>{progress}%</span>
        </div>
      )}

      {streamingContent && (
        <div className="streaming-output">
          <h3>生成内容</h3>
          <pre>{streamingContent}</pre>
        </div>
      )}

      {result && (
        <div className="result">
          <h3>计算结果</h3>
          {result.is_mock && (
            <span className="mock-badge">模拟数据</span>
          )}
          <pre>{JSON.stringify(result.result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="error">
          错误: {error}
        </div>
      )}
    </div>
  );
}

export default BaziCalculator;
```

---

### 4. TypeScript 类型定义

```typescript
/**
 * SSE 事件类型定义
 */

// 事件数据类型
interface SSEStartData {
  request_id: string;
  service: string;
}

interface SSEStreamStartData {
  service: string;
  request_id: string;
}

interface SSEStreamChunkData {
  content: string;
  chunk_index: number;
  content_length?: number;
}

interface SSEStreamCompleteData {
  content_length: number;
  stage: string;
}

interface SSEStructureStartData {
  message: string;
}

interface SSECompleteData<T = any> {
  result: T;
  is_mock: boolean;
}

interface SSErrorData {
  error: string;
}

// 事件类型联合
type SSEEventData =
  | { type: 'start'; data: SSEStartData }
  | { type: 'stream_start'; data: SSEStreamStartData }
  | { type: 'stream_chunk'; data: SSEStreamChunkData }
  | { type: 'stream_complete'; data: SSEStreamCompleteData }
  | { type: 'structure_start'; data: SSEStructureStartData }
  | { type: 'complete'; data: SSECompleteData }
  | { type: 'error'; data: SSErrorData };

// 回调函数类型
type SSECallbacks<T = any> = {
  onStart?: (data: SSEStartData) => void;
  onStreamStart?: (data: SSEStreamStartData) => void;
  onChunk?: (data: SSEStreamChunkData) => void;
  onStreamComplete?: (data: SSEStreamCompleteData) => void;
  onStructureStart?: (data: SSEStructureStartData) => void;
  onComplete?: (data: SSECompleteData<T>) => void;
  onError?: (data: SSErrorData) => void;
};

// SSE 请求函数
async function sseRequest<T = any>(
  url: string,
  requestData: any,
  callbacks: SSECallbacks<T>
): Promise<void> {
  const {
    onStart,
    onStreamStart,
    onChunk,
    onStreamComplete,
    onStructureStart,
    onComplete,
    onError
  } = callbacks;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const event: SSEEventData = JSON.parse(line.slice(6));

        switch (event.type) {
          case 'start':
            onStart?.(event.data as any);
            break;
          case 'stream_start':
            onStreamStart?.(event.data as any);
            break;
          case 'stream_chunk':
            onChunk?.(event.data as any);
            break;
          case 'stream_complete':
            onStreamComplete?.(event.data as any);
            break;
          case 'structure_start':
            onStructureStart?.(event.data as any);
            break;
          case 'complete':
            onComplete?.(event.data as any);
            break;
          case 'error':
            onError?.(event.data as any);
            break;
        }
      }
    }
  }
}

// 使用示例
interface BaziResult {
  pillars: Array<{ name: string; heavenly: string; earthly: string }>;
  wuxing: { dayMaster: string; strength: string };
  shishen: Array<{ name: string; strength: string }>;
}

sseRequest<BaziResult>('/api/v1/bazi/calculate/stream',
  { name: "张三", gender: "male", birthDate: "1990-06-15", ... },
  {
    onStart: (data) => console.log('Request ID:', data.request_id),
    onComplete: (data) => {
      console.log('Result:', data.result);
      if (data.is_mock) {
        console.warn('Using mock data');
      }
    }
  }
);
```

---

## 技术原理

### SSE 工作原理

```
客户端                              服务器
  │                                   │
  │ ─── POST /api/v1/bazi/calculate/stream ──> │
  │                                   │
  │ <─────── HTTP 200 OK ────────────────── │
  │ <─────── Content-Type: text/event-stream │
  │                                   │
  │ <─────── data: {"type":"start",...} ───── │
  │ <─────── data: {"type":"stream_chunk",...} │
  │ <─────── data: {"type":"stream_chunk",...} │
  │                                    │
  │                                    │
  │ (持续接收事件...)                     │
  │                                    │
  │ <─────── data: {"type":"complete",...} ── │
  │                                   │
  │ ──────── 连接关闭 ─────────────────> │
```

### 后端实现原理

```python
# FastAPI Handler
async def calculate_bazi_stream_handler(request):
    async def event_stream():
        # 1. 创建异步队列
        callback_queue = asyncio.Queue()

        # 2. 启动后台任务（生产者）
        processing_task = asyncio.create_task(
            bazi_service.calculate_bazi_stream(
                stream_callback=stream_callback  # 写入队列
            )
        )

        # 3. 主协程（消费者）从队列读取
        while True:
            data = await callback_queue.get()
            if data is None:
                break
            yield f"data: {json.dumps(data)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream"
    )
```

### 关键技术点

| 技术 | 作用 | 说明 |
|------|------|------|
| async/await | 异步协程 | 单线程处理多请求 |
| AsyncGenerator | 异步生成器 | 逐块产出数据 |
| asyncio.Queue | 异步队列 | 生产者-消费者通信 |
| SSE | Server-Sent Events | HTTP 长连接推送 |

---

## 部署配置

### Nginx 配置

SSE 需要禁用缓冲才能实时推送：

```nginx
location /api/ {
    proxy_pass http://backend;

    # SSE 关键配置
    proxy_set_header Connection '';
    proxy_cache off;
    proxy_buffering off;
    chunked_transfer_encoding on;

    # 超时配置
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
}

# 或者使用 X-Accel-Buffering
location /api/v1/bazi/calculate/stream {
    proxy_pass http://backend;
    proxy_set_header X-Accel-Buffering no;
    proxy_cache off;
}
```

### 环境变量

```bash
# .env
LLM_TIMEOUT=180  # LLM 超时时间（秒）
```

---

## 错误处理

### 错误类型

| 错误类型 | 原因 | 处理方式 |
|---------|------|---------|
| 网络错误 | 连接失败 | 显示错误提示，允许重试 |
| 超时错误 | LLM 响应超时 | 返回模拟数据（is_mock=true） |
| API 错误 | 参数错误 | 返回 error 事件 |
| 解析错误 | JSON 格式错误 | 记录日志，显示友好提示 |

### 错误处理示例

```javascript
try {
  await sseRequest(url, data, {
    onError: (errorData) => {
      if (errorData.error.includes('超时')) {
        showTimeoutWarning();
      } else if (errorData.error.includes('模拟数据')) {
        showMockDataWarning();
      } else {
        showGenericError(errorData.error);
      }
    },
    onComplete: (resultData) => {
      if (resultData.is_mock) {
        showMockDataBadge();
      }
      renderResult(resultData.result);
    }
  });
} catch (error) {
  // 捕获未处理的错误
  showNetworkError(error.message);
}
```

### 重试策略

```javascript
async function sseRequestWithRetry(url, data, callbacks, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await sseRequest(url, data, callbacks);
      return; // 成功，退出
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error; // 最后一次重试失败
      }
      console.log(`重试 ${i + 1}/${maxRetries}...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## 附录

### A. 完整 HTML 示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>八字计算 - SSE 流式接口</title>
  <style>
    .container { max-width: 900px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
    .form { display: grid; grid-template-columns: 100px 1fr; gap: 15px; margin-bottom: 20px; }
    label { font-weight: bold; }
    input, select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    button { padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; cursor: not-allowed; }

    .status-bar { display: flex; justify-content: space-between; padding: 10px; background: #e3f2fd; border-radius: 4px; margin-bottom: 15px; }
    .streaming-output { padding: 15px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; min-height: 150px; white-space: pre-wrap; margin-bottom: 15px; }
    .result { padding: 15px; background: #e8f5e9; border-radius: 4px; }
    .mock-badge { display: inline-block; padding: 4px 8px; background: #ff9800; color: white; border-radius: 4px; font-size: 12px; }
    .error { padding: 15px; background: #ffebee; color: #c62828; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>八字计算（SSE 流式）</h1>

    <div class="form">
      <label>姓名:</label>
      <input type="text" id="name" value="张三">

      <label>性别:</label>
      <select id="gender">
        <option value="male">男</option>
        <option value="female">女</option>
      </select>

      <label>出生日期:</label>
      <input type="date" id="birthDate" value="1990-06-15">

      <label>出生地点:</label>
      <input type="text" id="birthPlace" value="北京市朝阳区">
    </div>

    <button onclick="calculate()" id="submitBtn">开始计算</button>

    <div id="statusBar" class="status-bar" style="display:none;"></div>
    <div id="streamingOutput" class="streaming-output" style="display:none;"></div>
    <div id="result" class="result" style="display:none;"></div>
    <div id="error" class="error" style="display:none;"></div>
  </div>

  <script>
    async function calculate() {
      const submitBtn = document.getElementById('submitBtn');
      const statusBar = document.getElementById('statusBar');
      const streamingOutput = document.getElementById('streamingOutput');
      const resultDiv = document.getElementById('result');
      const errorDiv = document.getElementById('error');

      // 重置状态
      submitBtn.disabled = true;
      statusBar.style.display = 'none';
      streamingOutput.style.display = 'none';
      streamingOutput.textContent = '';
      resultDiv.style.display = 'none';
      errorDiv.style.display = 'none';

      const requestData = {
        name: document.getElementById('name').value,
        gender: document.getElementById('gender').value,
        birthDate: document.getElementById('birthDate').value,
        knowBirthTime: true,
        birthHour: 14,
        birthMinute: 30,
        birthPlace: document.getElementById('birthPlace').value,
        calendarType: "solar",
        useZiHour: false,
        inputType: "date"
      };

      try {
        const response = await fetch('/api/v1/bazi/calculate/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let content = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const event = JSON.parse(line.slice(6));

              switch (event.type) {
                case 'start':
                  statusBar.style.display = 'flex';
                  statusBar.textContent = `请求ID: ${event.data.request_id} - 开始计算`;
                  break;

                case 'stream_start':
                  statusBar.textContent = '正在生成内容...';
                  streamingOutput.style.display = 'block';
                  break;

                case 'stream_chunk':
                  content += event.data.content;
                  streamingOutput.textContent = content;
                  break;

                case 'stream_complete':
                  statusBar.textContent = '正在转换为结构化数据...';
                  break;

                case 'structure_start':
                  statusBar.textContent = event.data.message;
                  break;

                case 'complete':
                  resultDiv.innerHTML = `
                    <h3>计算结果</h3>
                    ${event.data.is_mock ? '<span class="mock-badge">模拟数据</span>' : ''}
                    <pre>${JSON.stringify(event.data.result, null, 2)}</pre>
                  `;
                  resultDiv.style.display = 'block';
                  statusBar.textContent = '完成!';
                  break;

                case 'error':
                  errorDiv.textContent = '错误: ' + event.data.error;
                  errorDiv.style.display = 'block';
                  break;
              }
            }
          }
        }
      } catch (err) {
        errorDiv.textContent = '请求失败: ' + err.message;
        errorDiv.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
      }
    }
  </script>
</body>
</html>
```

---

## 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.1 | 2025-01-09 | 更新 SSE 事件类型，添加 stream_start、stream_complete、structure_start |
| v1.0 | 2025-01-04 | 初始版本 |
