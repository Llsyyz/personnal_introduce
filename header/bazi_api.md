# 命理大师 API 文档

> 命理大师系统后端接口文档，包含八字计算、八字合婚、每日运势、塔罗牌占卜等功能。

## 基本信息

- **Base URL**: `http://127.0.0.1:8000/api/v1`
- **Content-Type**: `application/json`
- **鉴权**: Bearer Token (使用 accessToken)

---

## API 接口列表

### 1. 八字计算

根据用户输入的出生信息计算八字命盘。

**请求**
```http
POST /bazi/calculate
```

**请求头**
```
Authorization: Bearer {accessToken}
```

**请求体**
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

**请求参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 姓名，2-20 个字符 |
| gender | string | 是 | 性别，`male` 或 `female` |
| inputType | string | 是 | 输入类型，`date`(日期) 或 `bazi`(八字) |
| calendarType | string | 否 | 历法类型，`solar`(阳历) 或 `lunar`(农历)，默认 solar |
| birthDate | string | 否 | 出生日期，格式 `YYYY-MM-DD`，inputType=date 时必填 |
| knowBirthTime | boolean | 否 | 是否知道出生时间，默认 false |
| birthHour | number | 否 | 出生时辰（0-23），knowBirthTime=true 时必填 |
| birthMinute | number | 否 | 出生分钟（0-59），knowBirthTime=true 时必填 |
| birthPlace | string | 是 | 出生地点 |
| useZiHour | boolean | 否 | 是否使用早晚子时，默认 false |

**响应示例**
```json
{
  "code": 200,
  "message": "计算成功",
  "data": {
    "pillars": [
      { "name": "年柱", "heavenly": "庚", "earthly": "午" },
      { "name": "月柱", "heavenly": "甲", "earthly": "申" },
      { "name": "日柱", "heavenly": "丙", "earthly": "子" },
      { "name": "时柱", "heavenly": "戊", "earthly": "戌" }
    ],
    "wuxing": {
      "dayMaster": "丙火",
      "strength": "身旺"
    },
    "shishen": [
      { "name": "正官", "strength": "强" },
      { "name": "正财", "strength": "中" }
    ]
  }
}
```

---

### 2. 八字合婚

分析两个人的八字匹配度。

**请求**
```http
POST /bazi/marriage
```

**请求头**
```
Authorization: Bearer {accessToken}
```

**请求体**
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

**请求参数**

男女方参数相同：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 姓名 |
| gender | string | 是 | 性别 |
| calendarType | string | 否 | 历法类型，`solar` 或 `lunar`，默认 solar |
| birthDate | string | 是 | 出生日期，格式 `YYYY-MM-DD` |
| knowTime | boolean | 是 | 是否知道出生时间 |
| hour | number | 否 | 出生时辰（0-23），knowTime=true 时必填 |
| minute | number | 否 | 出生分钟（0-59），knowTime=true 时必填 |
| birthPlace | string | 是 | 出生地点 |
| ziHour | boolean | 否 | 是否使用早晚子时，默认 false |

**响应示例**
```json
{
  "code": 200,
  "message": "合婚成功",
  "data": {
    "score": 85,
    "level": "上等婚配",
    "analysis": "你们八字匹配度很高，性格互补，相处融洽，是天作之合。双方五行相生相合，婚姻生活将会美满幸福。",
    "malePillars": [
      { "name": "年柱", "heavenly": "庚", "earthly": "午" },
      { "name": "月柱", "heavenly": "甲", "earthly": "申" },
      { "name": "日柱", "heavenly": "丙", "earthly": "子" },
      { "name": "时柱", "heavenly": "戊", "earthly": "戌" }
    ],
    "femalePillars": [
      { "name": "年柱", "heavenly": "壬", "earthly": "申" },
      { "name": "月柱", "heavenly": "己", "earthly": "酉" },
      { "name": "日柱", "heavenly": "甲", "earthly": "午" },
      { "name": "时柱", "heavenly": "己", "earthly": "巳" }
    ],
    "details": {
      "wuxingMatch": "五行相生",
      "di支Match": "地支六合",
      "dayanMatch": "大衍络绎"
    }
  }
}
```

---

### 3. 每日运势

根据用户八字计算指定日期的运势。

**请求**
```http
POST /fortune/daily
```

**请求头**
```
Authorization: Bearer {accessToken}
```

**请求体**
```json
{
  "baziId": "user_bazi_123",
  "date": "2025-01-04"
}
```

**请求参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| baziId | string | 是 | 用户八字信息 ID（需先调用八字计算获取） |
| date | string | 是 | 查询日期，格式 `YYYY-MM-DD` |

**响应示例**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "date": "2025-01-04",
    "totalScore": 85,
    "fortuneTypes": [
      { "name": "综合运势", "score": 85, "desc": "今日运势整体不错，适合开展新计划" },
      { "name": "事业运势", "score": 78, "desc": "工作进展顺利，有机会获得领导认可" },
      { "name": "财运运势", "score": 82, "desc": "财运平稳，不宜进行大额投资" },
      { "name": "爱情运势", "score": 90, "desc": "感情生活甜蜜，适合约会表白" },
      { "name": "健康运势", "score": 75, "desc": "注意休息，避免过度劳累" },
      { "name": "学业运势", "score": 80, "desc": "学习效率高，适合备考进修" }
    ],
    "lucky": {
      "color": "红色",
      "number": "8",
      "direction": "东南"
    }
  }
}
```

---

### 4. 塔罗牌占卜

AI 驱动的塔罗牌解读服务。

**请求**
```http
POST /tarot/draw
```

**请求头**
```
Authorization: Bearer {accessToken}
```

**请求体**
```json
{
  "question": "创业还是留在大公司更适合我？",
  "spread": "three_card"
}
```

**请求参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| question | string | 是 | 占卜问题，1-200 字符 |
| spread | string | 否 | 牌阵类型，默认 `three_card`（三牌阵） |

**响应示例**
```json
{
  "code": 200,
  "message": "抽取成功",
  "data": {
    "question": "创业还是留在大公司更适合我？",
    "cards": [
      {
        "id": 0,
        "name": "愚者",
        "emoji": "🃏",
        "position": "过去",
        "meaning": "新的开始，冒险精神，代表你过去的探索与尝试"
      },
      {
        "id": 1,
        "name": "星星",
        "emoji": "⭐",
        "position": "现在",
        "meaning": "希望与启示，当前你正处于充满希望的阶段"
      },
      {
        "id": 2,
        "name": "太阳",
        "emoji": "🌞",
        "position": "未来",
        "meaning": "成功与喜悦，未来将会迎来成功和喜悦"
      }
    ],
    "interpretation": "根据塔罗牌的指引，您的问题有着积极的发展趋势。过去的经历为您积累了宝贵的经验，现在的您正处于充满希望的阶段，未来将会迎来成功和喜悦。建议您保持乐观的心态，勇敢面对挑战。创业可能更适合你当前的状态。",
    "timestamp": "2025-01-04T16:47:18Z"
  }
}
```

---

## 通用说明

### 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，Token 无效或过期 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 422 | 请求参数验证失败 |
| 500 | 服务器内部错误 |

### 统一响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { }
}
```

### 错误响应格式

```json
{
  "code": 400,
  "message": "参数错误：姓名不能为空",
  "data": null
}
```

---

## 前端集成示例

### 八字计算

```javascript
const response = await fetch('http://127.0.0.1:8000/api/v1/bazi/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
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
console.log(result.data.pillars); // 八字命盘
```

### 八字合婚

```javascript
const response = await fetch('http://127.0.0.1:8000/api/v1/bazi/marriage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  },
  body: JSON.stringify({
    male: { name: '张三', gender: 'male', birthDate: '1990-06-15', ... },
    female: { name: '李四', gender: 'female', birthDate: '1992-08-20', ... }
  })
});

const result = await response.json();
console.log(result.data.score); // 匹配度分数
```

### 每日运势

```javascript
const response = await fetch('http://127.0.0.1:8000/api/v1/fortune/daily', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  },
  body: JSON.stringify({
    baziId: 'user_bazi_123',
    date: '2025-01-04'
  })
});

const result = await response.json();
console.log(result.data.fortuneTypes); // 各项运势
```

### 塔罗牌占卜

```javascript
const response = await fetch('http://127.0.0.1:8000/api/v1/tarot/draw', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  },
  body: JSON.stringify({
    question: '创业还是留在大公司更适合我？'
  })
});

const result = await response.json();
console.log(result.data.cards); // 抽取的塔罗牌
console.log(result.data.interpretation); // 综合解读
```

---

## 注意事项

1. **Token 管理**：所有接口都需要在请求头中携带有效的 accessToken
2. **日期格式**：所有日期参数统一使用 `YYYY-MM-DD` 格式
3. **字符编码**：请求和响应统一使用 UTF-8 编码
4. **时间处理**：出生时辰使用 24 小时制，0-23
5. **地点格式**：出生地点建议使用完整的行政区划名称

---

## 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2025-01-04 | 初始版本，支持八字计算、八字合婚、每日运势、塔罗牌占卜 |
