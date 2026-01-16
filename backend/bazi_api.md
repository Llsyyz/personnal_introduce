# 八字计算 API 接口文档

> 命理大师系统 - 八字计算和合婚服务后端接口文档

## 基本信息

| 项目 | 说明 |
|------|------|
| **Base URL** | `http://localhost:8000` |
| **API Prefix** | `/api/v1/bazi` |
| **Content-Type** | `application/json` |
| **响应格式** | JSON / SSE (Server-Sent Events) |
| **FastAPI 版本** | 0.122.0 |

## 统一响应格式

### 成功响应

```json
{
    "code": 200,
    "message": "操作成功",
    "data": { ... }
}
```

### 错误响应

```json
{
    "code": 500,
    "message": "错误描述",
    "data": null
}
```

---

## API 接口列表

### 1. 八字计算（普通）

#### 基本信息

```
POST /api/v1/bazi/calculate
```

#### 功能描述

根据用户输入的出生信息或直接输入的八字四柱，计算八字命盘并进行五行、十神分析。

支持两种输入方式：
- **inputType="date"**: 根据出生日期计算八字
- **inputType="bazi"**: 直接输入八字四柱进行分析

#### 请求参数

##### Header

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Content-Type | string | 是 | 固定值: `application/json` |

##### Body

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 姓名，2-20 个字符 |
| gender | string | 是 | 性别，可选值: `male`, `female` |
| inputType | string | 是 | 输入类型，可选值: `date`, `bazi` |
| calendarType | string | 否 | 历法类型，可选值: `solar`（阳历）, `lunar`（农历），默认 `solar` |
| birthDate | string | 条件 | 出生日期，格式 `YYYY-MM-DD`，inputType=date 时必填 |
| knowBirthTime | boolean | 否 | 是否知道出生时间，默认 `false` |
| birthHour | number | 条件 | 出生时辰（0-23），knowBirthTime=true 时必填 |
| birthMinute | number | 条件 | 出生分钟（0-59），knowBirthTime=true 时必填 |
| birthPlace | string | 是 | 出生地点 |
| useZiHour | boolean | 否 | 是否使用早晚子时，默认 `false` |
| yearPillar | object | 条件 | 年柱，inputType=bazi 时必填 |
| monthPillar | object | 条件 | 月柱，inputType=bazi 时必填 |
| dayPillar | object | 条件 | 日柱，inputType=bazi 时必填 |
| hourPillar | object | 否 | 时柱，inputType=bazi 时可选 |

**Pillar 对象结构**:

```json
{
    "heavenly": "甲",   // 天干：甲乙丙丁戊己庚辛壬癸
    "earthly": "子"     // 地支：子丑寅卯辰巳午未申酉戌亥
}
```

#### 请求示例

##### 示例 1: 根据出生日期计算

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

##### 示例 2: 直接输入八字

```json
{
    "name": "张三",
    "gender": "male",
    "inputType": "bazi",
    "yearPillar": {
        "heavenly": "庚",
        "earthly": "午"
    },
    "monthPillar": {
        "heavenly": "甲",
        "earthly": "申"
    },
    "dayPillar": {
        "heavenly": "丙",
        "earthly": "子"
    },
    "hourPillar": {
        "heavenly": "戊",
        "earthly": "戌"
    }
}
```

#### 响应示例

##### 成功响应 (200 OK)

```json
{
    "code": 200,
    "message": "计算成功",
    "data": {
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
    }
}
```

##### 模拟数据响应 (200 OK)

```json
{
    "code": 200,
    "message": "计算成功（模拟数据）",
    "data": { ... }
}
```

##### 错误响应 (500 Internal Server Error)

```json
{
    "code": 500,
    "message": "计算失败: API 调用超时",
    "data": null
}
```

---

### 2. 八字合婚（普通）

#### 基本信息

```
POST /api/v1/bazi/marriage
```

#### 功能描述

分析男女双方八字的匹配度，给出合婚分数、等级和详细分析。

#### 请求参数

##### Body

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| male | object | 是 | 男方信息对象 |
| female | object | 是 | 女方信息对象 |

**PersonInfo 对象结构**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 姓名 |
| gender | string | 是 | 性别，`male` 或 `female` |
| calendarType | string | 否 | 历法类型，`solar` 或 `lunar`，默认 `solar` |
| birthDate | string | 是 | 出生日期，格式 `YYYY-MM-DD` |
| knowTime | boolean | 是 | 是否知道出生时间 |
| hour | number | 条件 | 出生时辰（0-23），knowTime=true 时必填 |
| minute | number | 条件 | 出生分钟（0-59），knowTime=true 时必填 |
| birthPlace | string | 是 | 出生地点 |
| ziHour | boolean | 否 | 是否使用早晚子时，默认 `false` |

#### 请求示例

```json
{
    "male": {
        "name": "张三",
        "gender": "male",
        "calendarType": "solar",
        "birthDate": "1990-06-15",
        "knowTime": true,
        "hour": 14,
        "minute": 30,
        "birthPlace": "北京市朝阳区",
        "ziHour": false
    },
    "female": {
        "name": "李四",
        "gender": "female",
        "calendarType": "solar",
        "birthDate": "1992-08-20",
        "knowTime": true,
        "hour": 10,
        "minute": 0,
        "birthPlace": "上海市浦东新区",
        "ziHour": false
    }
}
```

#### 响应示例

##### 成功响应 (200 OK)

```json
{
    "code": 200,
    "message": "合婚成功",
    "data": {
        "score": 85,
        "level": "上等婚配",
        "analysis": "八字匹配度较高，性格互补，相处融洽。",
        "malePillars": [
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
        "femalePillars": [
            {
                "name": "年柱",
                "heavenly": "壬",
                "earthly": "申"
            },
            {
                "name": "月柱",
                "heavenly": "己",
                "earthly": "酉"
            },
            {
                "name": "日柱",
                "heavenly": "甲",
                "earthly": "午"
            },
            {
                "name": "时柱",
                "heavenly": "己",
                "earthly": "巳"
            }
        ],
        "details": {
            "wuxingMatch": "五行相生",
            "dizhiMatch": "地支相合",
            "dayanMatch": "大衍吉"
        }
    }
}
```

---

### 3. 八字计算（流式 SSE）

#### 基本信息

```
POST /api/v1/bazi/calculate/stream
```

#### 功能描述

流式八字计算，使用 Server-Sent Events (SSE) 实时推送 LLM 生成内容。用户可以实时看到八字分析过程，最后返回结构化结果。

#### 请求参数

与普通八字计算接口相同。

#### 响应格式

**Content-Type**: `text/event-stream`

#### SSE 事件类型

| 事件类型 | 说明 | 数据结构 |
|---------|------|---------|
| `start` | 开始处理 | `{request_id, service}` |
| `stream_start` | 流式生成开始 | `{service, request_id}` |
| `stream_chunk` | 内容块（实时推送） | `{content, chunk_index}` |
| `stream_complete` | 流式生成完成 | `{content_length, stage}` |
| `structure_start` | 结构化开始 | `{message}` |
| `complete` | 完成并返回结果 | `{result, is_mock}` |
| `error` | 错误 | `{error}` |

#### SSE 事件流示例

```
data: {"type":"start","data":{"request_id":"abc123","service":"八字"}}

data: {"type":"stream_start","data":{"service":"八字","request_id":"abc123"}}

data: {"type":"stream_chunk","data":{"content":"姓名","chunk_index":1}}

data: {"type":"stream_chunk","data":{"content":"：张三\n性","chunk_index":2}}

data: {"type":"stream_chunk","data":{"content":"别：男\n出生","chunk_index":3}}

data: {"type":"stream_chunk","data":{"content":"日期：1990年6月15日","chunk_index":4}}

...

data: {"type":"stream_complete","data":{"content_length":520,"stage":"structure_start"}}

data: {"type":"structure_start","data":{"message":"正在转换为结构化数据..."}}

data: {"type":"complete","data":{"result":{"pillars":[...],"wuxing":{...},"shishen":[...]},"is_mock":false}}
```

---

### 4. 八字合婚（流式 SSE）

#### 基本信息

```
POST /api/v1/bazi/marriage/stream
```

#### 功能描述

流式八字合婚，使用 Server-Sent Events (SSE) 实时推送合婚分析过程。

#### 请求参数

与普通合婚接口相同。

#### SSE 事件类型

与八字计算流式接口相同，但 `service` 字段值为 `"合婚"`。

#### SSE 事件流示例

```
data: {"type":"start","data":{"request_id":"def456","service":"合婚"}}

data: {"type":"stream_start","data":{"service":"合婚","request_id":"def456"}}

data: {"type":"stream_chunk","data":{"content":"正在分析男女双方八字...","chunk_index":1}}

...

data: {"type":"complete","data":{"result":{"score":85,"level":"上等婚配",...},"is_mock":false}}
```

---

## 错误码说明

| HTTP 状态码 | 业务 code | 说明 |
|------------|----------|------|
| 200 | 200 | 请求成功 |
| 400 | 400 | 请求参数错误 |
| 422 | 422 | 参数验证失败 |
| 500 | 500 | 服务器内部错误 |

---

## 前端集成示例

### 普通 API 调用

#### 八字计算

```javascript
const response = await fetch('http://localhost:8000/api/v1/bazi/calculate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: '张三',
        gender: 'male',
        inputType: 'date',
        calendarType: 'solar',
        birthDate: '1990-06-15',
        knowBirthTime: true,
        birthHour: 14,
        birthMinute: 30,
        birthPlace: '北京市朝阳区'
    })
});

const result = await response.json();
console.log(result.data.pillars);  // 八字命盘
```

#### 八字合婚

```javascript
const response = await fetch('http://localhost:8000/api/v1/bazi/marriage', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        male: {
            name: '张三',
            gender: 'male',
            birthDate: '1990-06-15',
            knowTime: true,
            hour: 14,
            minute: 30,
            birthPlace: '北京市朝阳区'
        },
        female: {
            name: '李四',
            gender: 'female',
            birthDate: '1992-08-20',
            knowTime: true,
            hour: 10,
            minute: 0,
            birthPlace: '上海市浦东新区'
        }
    })
});

const result = await response.json();
console.log(result.data.score);  // 匹配分数
```

### SSE 流式调用

#### 八字计算（流式）

```javascript
const response = await fetch('http://localhost:8000/api/v1/bazi/calculate/stream', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: '张三',
        gender: 'male',
        inputType: 'date',
        birthDate: '1990-06-15',
        knowBirthTime: true,
        birthHour: 14,
        birthMinute: 30,
        birthPlace: '北京市朝阳区'
    })
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
            const data = JSON.parse(line.slice(6));
            handleSSEEvent(data);
        }
    }
}

function handleSSEEvent(event) {
    switch (event.type) {
        case 'start':
            console.log('开始处理:', event.data.request_id);
            break;
        case 'stream_chunk':
            // 实时显示生成内容
            console.log(event.data.content);
            break;
        case 'complete':
            console.log('完成，结果:', event.data.result);
            break;
        case 'error':
            console.error('错误:', event.data.error);
            break;
    }
}
```

#### React Hook 示例

```javascript
import { useState, useCallback } from 'react';

function useBaziStream() {
    const [content, setContent] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const calculate = useCallback(async (params) => {
        setLoading(true);
        setContent('');
        setResult(null);

        try {
            const response = await fetch('http://localhost:8000/api/v1/bazi/calculate/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
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

                        if (event.type === 'stream_chunk') {
                            setContent(prev => prev + event.data.content);
                        } else if (event.type === 'complete') {
                            setResult(event.data.result);
                        }
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return { content, result, loading, calculate };
}

// 使用示例
function BaziCalculator() {
    const { content, result, loading, calculate } = useBaziStream();

    return (
        <div>
            <button onClick={() => calculate({...})}>
                开始计算
            </button>
            {loading && <div>生成中...</div>}
            <div>{content}</div>
            {result && <div>结果: {JSON.stringify(result)}</div>}
        </div>
    );
}
```

---

## 技术实现说明

### 后端技术栈

- **FastAPI 0.122.0**: 异步 Web 框架
- **LangGraph 1.0.4**: LLM 工作流编排
- **LangChain 1.1.0**: LLM 统一接口
- **Pydantic 2.12.5**: 数据验证
- **asyncio**: 异步协程支持

### 流式输出原理

流式输出使用以下技术组合：

1. **async/await**: 异步协程，实现并发执行
2. **AsyncGenerator**: 异步生成器，逐块产出内容
3. **asyncio.Queue**: 异步队列，生产者-消费者通信
4. **SSE**: Server-Sent Events，HTTP 长连接推送

```python
# 后端实现概览
async def event_stream() -> AsyncGenerator[str, None]:
    # 1. 创建异步队列
    callback_queue = asyncio.Queue()

    # 2. 启动后台任务（生产者）
    processing_task = asyncio.create_task(
        bazi_service.calculate_bazi_stream(
            stream_callback=stream_callback  # 写入队列
        )
    )

    # 3. 主协程（消费者）从队列读取并推送
    while True:
        data = await callback_queue.get()
        if data is None:
            break
        yield send_sse(data["type"], data)
```

### 处理流程

```
用户请求
    │
    ├─> 1. 生成提示词
    │
    ├─> 2. LLM 流式生成文本
    │       │
    │       └─> 实时推送 stream_chunk 事件
    │
    ├─> 3. 文本转换为结构化数据
    │       │
    │       └─> 推送 structure_complete 事件
    │
    └─> 4. 返回最终结果
```

---

## 附录

### A. Pydantic 数据模型

#### BaziCalculateRequest

```python
class BaziPillarInput(BaseModel):
    heavenly: str  # 天干
    earthly: str   # 地支

class BaziCalculateRequest(BaseModel):
    name: str                    # 姓名
    gender: Literal["male", "female"]
    inputType: Literal["date", "bazi"]
    calendarType: Literal["solar", "lunar"] = "solar"
    birthDate: Optional[str]
    knowBirthTime: bool = False
    birthHour: Optional[int]
    birthMinute: Optional[int]
    birthPlace: str
    useZiHour: bool = False
    yearPillar: Optional[BaziPillarInput]
    monthPillar: Optional[BaziPillarInput]
    dayPillar: Optional[BaziPillarInput]
    hourPillar: Optional[BaziPillarInput]
```

#### BaziMarriageRequest

```python
class BaziPersonInfo(BaseModel):
    name: str
    gender: Literal["male", "female"]
    calendarType: Literal["solar", "lunar"] = "solar"
    birthDate: str
    knowTime: bool
    hour: Optional[int]
    minute: Optional[int]
    birthPlace: str
    ziHour: bool = False

class BaziMarriageRequest(BaseModel):
    male: BaziPersonInfo
    female: BaziPersonInfo
```

### B. 状态码参考

| 场景 | HTTP Code | 说明 |
|------|----------|------|
| 正常返回 | 200 | 请求成功 |
| 参数缺失 | 400 | 必填参数未提供 |
| 参数验证失败 | 422 | Pydantic 验证失败 |
| LLM 超时 | 500 | API 调用超时，返回模拟数据 |
| 服务器错误 | 500 | 其他异常 |

### C. 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2025-01-09 | 初始版本，八字计算和合婚接口 |
