---
name: jcp-stock-analysis
description: A股智能分析系统，使用多Agent协作提供技术面、基本面、风险分析。需要韭菜盘桌面应用运行并启用OpenClaw服务。
metadata:
  openclaw:
    requires:
      env: ["JCP_API_URL"]
---

# JCP Stock Analysis

AI驱动的A股智能分析系统，通过多专家Agent协作提供全面的投资分析。

## 前置条件

1. 运行韭菜盘桌面应用
2. 在设置中启用 OpenClaw 服务并配置端口（默认 51888）
3. 设置环境变量：`export JCP_API_URL=http://localhost:51888`

## 使用方式

分析股票时，调用 API：

```bash
curl -X POST $JCP_API_URL/analyze \
  -H "Content-Type: application/json" \
  -d '{"stockCode": "600519", "query": "分析投资价值"}'
```

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| /health | GET | 健康检查 |
| /status | GET | 服务状态 |
| /agents | GET | 可用专家列表 |
| /analyze | POST | 股票分析 |

## 分析请求参数

```json
{
  "stockCode": "600519",
  "query": "分析这只股票的投资价值",
  "agentIds": ["agent1", "agent2"]  // 可选，指定专家
}
```

## 示例对话

用户: 帮我分析一下贵州茅台
助手: [调用 /analyze 接口，stockCode=600519]
