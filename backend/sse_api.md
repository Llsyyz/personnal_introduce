# SSE 流式接口文档

## 概述

命理大师 API 提供了基于 Server-Sent Events (SSE) 的流式输出接口，让用户可以实时看到 LLM 生成的内容，无需等待完整响应。

## 流式接口列表

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v1/bazi/calculate/stream` | POST | 八字计算流式输出 |
| `/api/v1/bazi/marriage/stream` | POST | 八字合婚流式输出 |

## SSE 事件类型

### 1. start - 开始生成
```json
{
  "type": "start",
  "data": {
    "request_id": "a1b2c3d4",
    "service": "八字"
  }
}
```

### 2. chunk - 内容块（实时推送）
```json
{
  "type": "chunk",
  "data": {
    "content": "{",
    "chunk_index": 1,
    "content_length": 1
  }
}
```

### 3. validation_start - 开始结构化验证
```json
{
  "type": "validation_start",
  "data": {
    "content_length": 1500
  }
}
```

### 4. complete - 完成
```json
{
  "type": "complete",
  "data": {
    "result": {
      "pillars": [...],
      "wuxing": {...},
      "shishen": [...]
    }
  }
}
```

### 5. error - 错误
```json
{
  "type": "error",
  "data": {
    "error": "错误信息"
  }
}
```

---

## 前端调用示例

### 1. 原生 JavaScript (Fetch API)

```javascript
/**
 * 八字计算流式接口调用
 * @param {Object} requestData - 请求数据
 * @param {Object} callbacks - 回调函数
 */
async function streamBaziCalculate(requestData, callbacks = {}) {
  const {
    onStart = () => {},
    onChunk = (content) => {},
    onValidationStart = () => {},
    onComplete = (result) => {},
    onError = (error) => {}
  } = callbacks;

  try {
    const response = await fetch('/api/v1/bazi/calculate/stream', {
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
      const lines = buffer.split('\n\n');
      buffer = lines.pop(); // 保留未完成的行

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event = JSON.parse(line.slice(6));

            switch (event.type) {
              case 'start':
                console.log('[SSE] 开始生成:', event.data.request_id);
                onStart(event.data);
                break;

              case 'chunk':
                onChunk(event.data.content);
                break;

              case 'validation_start':
                console.log('[SSE] 开始验证结构...');
                onValidationStart(event.data);
                break;

              case 'complete':
                console.log('[SSE] 完成');
                onComplete(event.data.result);
                break;

              case 'error':
                console.error('[SSE] 错误:', event.data.error);
                onError(event.data.error);
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
    onError(error.message);
  }
}

// 使用示例
streamBaziCalculate(
  {
    name: "张三",
    gender: "男",
    birthDate: "1990-01-01",
    knowBirthTime: true,
    birthHour: 10,
    birthMinute: 30,
    birthPlace: "北京市",
    calendarType: "solar",
    useZiHour: false,
    inputType: "date"
  },
  {
    onStart: (data) => {
      console.log('开始计算，请求ID:', data.request_id);
      showLoadingSpinner();
    },
    onChunk: (content) => {
      // 实时显示生成的内容
      appendContentToDisplay(content);
    },
    onValidationStart: () => {
      console.log('开始验证数据结构...');
      showValidationMessage();
    },
    onComplete: (result) => {
      console.log('计算完成:', result);
      hideLoadingSpinner();
      renderBaziResult(result);
    },
    onError: (error) => {
      console.error('发生错误:', error);
      showErrorMessage(error);
    }
  }
);
```

### 2. Vue 3 Composition API

```vue
<template>
  <div class="bazi-calculator">
    <div v-if="loading" class="streaming-output">
      <div class="status">{{ status }}</div>
      <div class="content">{{ streamingContent }}</div>
    </div>

    <div v-if="result" class="bazi-result">
      <!-- 显示最终结果 -->
    </div>

    <button @click="startCalculation">开始计算</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);
const status = ref('');
const streamingContent = ref('');
const result = ref(null);

async function startCalculation() {
  loading.value = true;
  status.value = '正在生成...';
  streamingContent.value = '';
  result.value = null;

  const requestData = {
    name: "张三",
    gender: "男",
    birthDate: "1990-01-01",
    knowBirthTime: true,
    birthHour: 10,
    birthMinute: 30,
    birthPlace: "北京市",
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
      const lines = buffer.split('\n\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const event = JSON.parse(line.slice(6));

          switch (event.type) {
            case 'start':
              status.value = '开始计算...';
              break;

            case 'chunk':
              streamingContent.value += event.data.content;
              break;

            case 'validation_start':
              status.value = '验证数据结构...';
              break;

            case 'complete':
              result.value = event.data.result;
              loading.value = false;
              break;

            case 'error':
              console.error('错误:', event.data.error);
              status.value = '发生错误: ' + event.data.error;
              loading.value = false;
              break;
          }
        }
      }
    }
  } catch (error) {
    console.error('请求失败:', error);
    status.value = '请求失败: ' + error.message;
    loading.value = false;
  }
}
</script>
```

### 3. React Hook

```javascript
import { useState, useCallback, useRef } from 'react';

function useSSEStream() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const stream = useCallback(async (url, requestData) => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setStatus('正在连接...');
    setContent('');
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

      setStatus('正在生成...');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const event = JSON.parse(line.slice(6));

            switch (event.type) {
              case 'start':
                setStatus('开始计算...');
                break;

              case 'chunk':
                setContent(prev => prev + event.data.content);
                break;

              case 'validation_start':
                setStatus('验证数据结构...');
                break;

              case 'complete':
                setResult(event.data.result);
                setLoading(false);
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

  return { loading, status, content, result, error, stream, abort };
}

// 使用示例
function BaziCalculator() {
  const { loading, status, content, result, error, stream, abort } = useSSEStream();

  const handleCalculate = async () => {
    await stream('/api/v1/bazi/calculate/stream', {
      name: "张三",
      gender: "男",
      birthDate: "1990-01-01",
      knowBirthTime: true,
      birthHour: 10,
      birthMinute: 30,
      birthPlace: "北京市",
      calendarType: "solar",
      useZiHour: false,
      inputType: "date"
    });
  };

  return (
    <div>
      <button onClick={handleCalculate} disabled={loading}>
        {loading ? '计算中...' : '开始计算'}
      </button>
      {loading && <button onClick={abort}>取消</button>}

      <div>状态: {status}</div>
      <div>内容: {content}</div>
      {result && <div>结果: {JSON.stringify(result, null, 2)}</div>}
      {error && <div>错误: {error}</div>}
    </div>
  );
}
```

### 4. Axios (不支持原生 SSE)

Axios 不支持 SSE 流式响应，请使用原生 fetch API。

---

## 请求数据格式

### 八字计算请求

```json
{
  "name": "张三",
  "gender": "男",
  "birthDate": "1990-01-01",
  "knowBirthTime": true,
  "birthHour": 10,
  "birthMinute": 30,
  "birthPlace": "北京市",
  "calendarType": "solar",
  "useZiHour": false,
  "inputType": "date"
}
```

### 合婚请求

```json
{
  "male": {
    "name": "张三",
    "gender": "男",
    "birthDate": "1990-01-01",
    "knowTime": true,
    "hour": 10,
    "minute": 30,
    "birthPlace": "北京市",
    "calendarType": "solar",
    "ziHour": false
  },
  "female": {
    "name": "李四",
    "gender": "女",
    "birthDate": "1992-05-15",
    "knowTime": true,
    "hour": 14,
    "minute": 20,
    "birthPlace": "上海市",
    "calendarType": "solar",
    "ziHour": false
  }
}
```

---

## 完整示例 HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>八字计算 - 流式接口示例</title>
  <style>
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .form-group { margin-bottom: 15px; }
    label { display: inline-block; width: 100px; }
    input { width: 300px; padding: 5px; }
    button { padding: 10px 20px; cursor: pointer; }
    .output {
      margin-top: 20px;
      padding: 15px;
      border: 1px solid #ddd;
      min-height: 100px;
      background: #f5f5f5;
      white-space: pre-wrap;
      font-family: monospace;
    }
    .result { margin-top: 20px; padding: 15px; background: #e8f5e9; }
  </style>
</head>
<body>
  <div class="container">
    <h1>八字计算 (流式接口)</h1>

    <div class="form-group">
      <label>姓名:</label>
      <input type="text" id="name" value="张三">
    </div>

    <div class="form-group">
      <label>性别:</label>
      <select id="gender">
        <option value="男">男</option>
        <option value="女">女</option>
      </select>
    </div>

    <div class="form-group">
      <label>生日:</label>
      <input type="date" id="birthDate" value="1990-01-01">
    </div>

    <div class="form-group">
      <label>地点:</label>
      <input type="text" id="birthPlace" value="北京市">
    </div>

    <button onclick="calculate()">开始计算</button>

    <div class="output" id="output"></div>
    <div class="result" id="result" style="display:none;"></div>
  </div>

  <script>
    async function calculate() {
      const output = document.getElementById('output');
      const resultDiv = document.getElementById('result');

      output.textContent = '';
      resultDiv.style.display = 'none';

      const requestData = {
        name: document.getElementById('name').value,
        gender: document.getElementById('gender').value,
        birthDate: document.getElementById('birthDate').value,
        knowBirthTime: true,
        birthHour: 10,
        birthMinute: 0,
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

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const event = JSON.parse(line.slice(6));

              if (event.type === 'chunk') {
                output.textContent += event.data.content;
              } else if (event.type === 'complete') {
                resultDiv.innerHTML = '<pre>' + JSON.stringify(event.data.result, null, 2) + '</pre>';
                resultDiv.style.display = 'block';
              } else if (event.type === 'error') {
                output.textContent = '错误: ' + event.data.error;
              }
            }
          }
        }
      } catch (error) {
        output.textContent = '请求失败: ' + error.message;
      }
    }
  </script>
</body>
</html>
```

---

## 注意事项

1. **连接保持**: SSE 连接会保持打开状态，直到服务器发送完成事件或发生错误
2. **自动重连**: 如果连接断开，前端可以实现自动重连机制
3. **取消请求**: 使用 `AbortController` 可以取消正在进行的请求
4. **CORS**: 确保后端已配置 CORS 允许前端域名访问
5. **Nginx 配置**: 如果使用 Nginx 反向代理，需要添加 `X-Accel-Buffering: no` 头部禁用缓冲

## Nginx 配置示例

```nginx
location /api/ {
    proxy_pass http://backend;
    proxy_set_header Connection '';
    proxy_cache off;
    proxy_buffering off;
    chunked_transfer_encoding on;
}
```

## 错误处理

| 错误类型 | 说明 | 处理方式 |
|---------|------|---------|
| 网络错误 | 连接失败 | 显示网络错误提示，允许重试 |
| 超时错误 | 请求超时 | 显示超时提示，允许重新请求 |
| API 错误 | 业务错误 | 显示错误信息，引导用户修正输入 |
| 解析错误 | 数据格式错误 | 记录日志，使用兜底方案 |
