## Agency-Agents 多视角审查报告

**审查日期**: 2026-06-06
**审查方法**: 使用 agency-agents 项目中的 Code Reviewer、Accessibility Auditor、AppSec Engineer 三个代理定义对项目进行并行审查
**项目版本**: 0.1.0 MVP（Vercel 部署后）

---

## 审查概览

| 视角 | Critical/Blocker | 建议 | 细节/加固 | 整体评价 |
|------|:-:|:-:|:-:|------|
| 代码审查 | 3 | 10 | 7 | 工程质量高于典型 MVP，零测试是最大风险 |
| 无障碍性 | 2 | 3 | 3 + 2 Minor | 基础扎实，聊天界面和 radiogroup 需修复 |
| 安全审查 | 0 | 4 | 4 + 4 通过 | 代码安全意识好，配置安全需补强 |

---

## 最高优先级修复清单（P0/P1）

### P0 — 立即修复

| # | 来源 | 问题 | 工作量 |
|---|------|------|--------|
| 1 | 代码 | `onlineHours` max=24 在周/月模式下阻止正确输入 | 15 分钟 |
| 2 | 无障碍 | Radiogroup 缺少箭头键导航（WCAG 2.1.1） | 30 分钟 |
| 3 | 无障碍 | 聊天界面缺少 aria-live（WCAG 4.1.3） | 20 分钟 |
| 4 | 安全 | 缺少安全 HTTP 头（X-Frame-Options 等） | 30 分钟 |
| 5 | 代码 | 零测试覆盖（至少补齐 calculateSalary 和 sanitizeMessages） | 2-3 小时 |

### P1 — 本周修复

| # | 来源 | 问题 | 工作量 |
|---|------|------|--------|
| 6 | 无障碍 | 缺少 Skip Navigation 链接 | 15 分钟 |
| 7 | 无障碍 | 多处交互元素缺少可见焦点指示器 | 1 小时 |
| 8 | 无障碍 | 装饰性 SVG 缺少 aria-hidden | 15 分钟 |
| 9 | 代码 | `appendDisclaimerIfMissing` 检测字符串脆弱 | 10 分钟 |
| 10 | 代码 | rateLimitStore 缺少大小上限 | 10 分钟 |
| 11 | 无障碍 | `prefers-reduced-motion` 未支持 | 10 分钟 |
| 12 | 无障碍 | Hero 区域 text-blue-100 对比度不足（2.89:1） | 10 分钟 |

### P2 — 下个迭代

| # | 来源 | 问题 | 工作量 |
|---|------|------|--------|
| 13 | 安全 | 速率限制在 Vercel Serverless 上无效，迁 Upstash | 2 小时 |
| 14 | 安全 | AI 提示词注入无防御 | 1 小时 |
| 15 | 代码 | 聊天流式读取无超时保护 | 1 小时 |
| 16 | 代码 | Service Worker 离线回退缺少"数据可能过期"提示 | 30 分钟 |

---

## 做得好的地方（三视角共识）

- TypeScript strict 模式 + 完整类型定义
- `sanitizeMessages` 严格校验、截断、防御
- 免责声明三层兜底设计（系统提示词 + 流式追加 + 前端 DisclaimerBox）
- SSR 水合处理方案（CalculatorForm localStorage 恢复）
- 所有外部链接均已 `rel="noopener noreferrer"`
- 语义 HTML 使用规范、heading 层级正确
- React JSX 自动转义、无 dangerouslySetInnerHTML
- 生产环境隐藏错误堆栈
- 依赖数量极少（生产依赖仅 7 个），无已知漏洞
- Service Worker 安全策略正确（排除 API、同源检查）

---

## 修复执行记录（2026-06-06）

### 已修复（本轮）

| # | 问题 | 修改文件 | 状态 |
|---|------|---------|------|
| 1 | `onlineHours` max 根据 period 动态调整（day=24, week=168, month=744） | `components/CalculatorForm.tsx` | ✅ |
| 2 | Radiogroup 添加箭头键导航 + tabIndex 管理 | `components/CalculatorForm.tsx` | ✅ |
| 3 | 聊天界面添加 aria-live / role="status" / role="alert" | `app/chat/page.tsx` | ✅ |
| 4 | 添加安全 HTTP 头（X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy） | `next.config.ts` | ✅ |
| 5 | calculateSalary 添加 12 个单元测试 | `lib/__tests__/calculator.test.ts` | ✅ |
| 6 | 添加 Skip Navigation 链接 | `app/layout.tsx` | ✅ |
| 7 | BottomNav/DesktopNav 添加 focus-visible 焦点指示器 | `components/BottomNav.tsx`, `components/DesktopNav.tsx` | ✅ |
| 8 | 装饰性 SVG 添加 aria-hidden | `LegalAidCard.tsx`, `RegulationCard.tsx`, `news/page.tsx` | ✅ |
| 9 | `appendDisclaimerIfMissing` 改为检测 `'不构成律师法律意见'` | `app/api/chat/route.ts` | ✅ |
| 10 | rateLimitStore 添加 10000 条上限 | `app/api/chat/route.ts` | ✅ |
| 11 | 添加 `prefers-reduced-motion` 全局 CSS | `app/globals.css` | ✅ |
| 12 | Hero 区域副标题 `text-blue-100` → `text-white/90`（对比度提升） | `app/page.tsx` | ✅ |
| 13 | AI 聊天 API 增加 Origin 来源校验，跨站 POST 返回 403 | `app/api/chat/route.ts`, `tools/validate_data.py` | ✅ |
| 14 | 聊天流式输出增加 30 秒超时兜底 | `app/api/chat/route.ts`, `tools/validate_data.py` | ✅ |
| 附 | `text-gray-400` → `text-gray-500` 提升辅助文本对比度 | `news/page.tsx`, `regulations/page.tsx`, `legal-aid/page.tsx`, `RegulationCard.tsx` | ✅ |
| 附 | 新增生产服务/PWA 烟测入口 `pnpm web:smoke`，并支持端口占用时自动避让 | `tools/smoke_web.ps1`, `package.json`, `tools/validate_data.py` | ✅ |

### 待后续迭代

| # | 问题 | 建议 |
|---|------|------|
| 13 | 速率限制迁 Upstash/Vercel KV | 流量增长前处理 |
| 14 | AI 提示词注入防御 | 正式版本前处理 |
| 15 | 聊天流式读取超时保护 | 已修复 |
| 16 | Service Worker 离线数据过期提示 | 下一迭代 |
| 17 | CSP 头（需 Next.js nonce 方案） | 第二阶段安全加固 |
| 18 | CSRF Origin 校验 | 已修复 |
| 19 | 外部链接 sr-only "新窗口打开" 提示 | 低优先级 |

### 构建验证

- `next build`: ✅ 编译成功，TypeScript 无错误，18 条路由生成
- `vitest run`: ✅ 31 个测试全部通过（12 新增 + 19 已有）
- `pnpm web:smoke`: ✅ 生产服务启动成功，核心页面和 PWA 关键资源响应正常
- 跨站 POST `/api/chat`: ✅ `Origin: https://evil.example` 返回 403
