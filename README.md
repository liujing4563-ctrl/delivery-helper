# 外卖骑手劳动权益助手

一个面向外卖骑手的工时薪资测算、法规查询、法援导航和 AI 权益信息问答平台。

## 项目定位

**公益型 MVP，不做"大而全法律平台"**，而是提供一个能跑通的信息工具：

```
用户输入收入和工时
  ↓
系统计算每小时收入
  ↓
提示是否低于当地最低工资参考线
  ↓
给出相关法规链接
  ↓
生成证据清单
  ↓
跳转 12348 / 法援中心 / 正规律所查询入口
  ↓
AI 只做解释和路径引导
```

## 功能模块

| 模块 | 描述 | 状态 |
|------|------|------|
| 首页 | 问题导向入口（被扣钱/工资太低/送餐受伤/被封号/没签合同/想申请法援） | ✅ |
| 薪资计算器 | 算毛收入、净收入、时薪，对比当地小时最低工资参考线 | ✅ |
| 法规库 | 10条核心法规，分类筛选+搜索，每条都有官方链接和核验时间 | ✅ |
| 法援目录 | 上海17个法律援助中心官方电话、地址和接待时间，城市筛选+按区分组，一键拨号 | ✅ |
| AI权益助手 | 基于 Vercel AI SDK + DeepSeek，流式输出，固定输出格式+免责声明 | ✅ |
| 权益动态 | 3条已核验官方政策动态，附免责声明 | ✅ |
| 用户登录 | MVP 阶段暂不启用真实账号，核心功能无需登录 | 规划中 |
| 账号管理 | 清除当前浏览器保存的本地计算器输入 | ✅ |
| 本地数据管理 | 清除当前浏览器保存的计算器输入 | ✅ |
| 免责声明 | 全站法律边界说明 | ✅ |
| 隐私说明 | 数据收集和存储说明 | ✅ |
| PWA 支持 | 可添加到手机桌面，离线访问基础页面 | ✅ |
| SEO | sitemap.xml、robots.txt、站点元数据 | ✅ |
| 桌面网页版 | 顶部导航、宽屏容器、首页多列布局 | ✅ |
| Android App 工程 | Capacitor 原生 Android 工程，包名 `com.deliveryhelper.rider` | ✅ |

## 技术栈

- **框架**: Next.js 16 App Router + TypeScript
- **样式**: Tailwind CSS 4
- **AI**: Vercel AI SDK + 阿里云 Qwen（OpenAI 兼容）
- **认证**: NextAuth v5 + Resend（邮箱魔法链接，纯 JWT）
- **数据**: `data/*.ts` 静态文件（人工整理+官方链接）
- **原生 App**: Capacitor 8 + Android 工程
- **部署**: Vercel

## 目录结构

```
delivery-helper/
├── app/
│   ├── layout.tsx         # 全局布局+底部导航
│   ├── page.tsx           # 问题导向首页
│   ├── not-found.tsx      # 自定义 404 页面
│   ├── sitemap.ts         # 自动生成 sitemap.xml
│   ├── robots.ts          # 自动生成 robots.txt
│   ├── calculator/        # 薪资计算器
│   ├── regulations/       # 法规库
│   ├── legal-aid/         # 法援目录
│   ├── chat/              # AI权益助手
│   ├── news/              # 新闻动态
│   ├── account/           # 本地数据管理
│   ├── disclaimer/        # 免责声明
│   ├── privacy/           # 隐私说明
│   ├── offline/           # PWA 离线页
│   └── api/
│       ├── auth/[...nextauth]/  # 账号功能占位 API
│       └── chat/                # AI 流式 API
│
├── data/
│   ├── types.ts           # 类型定义
│   ├── regulations.ts     # 法规数据（10 条）
│   ├── legalAidCenters.ts # 法援数据（上海 17 个）
│   ├── minWage.ts         # 最低工资数据（15 城市）
│   ├── news.ts            # 新闻数据（3 条）
│   └── prompts.ts         # AI系统提示词
│
├── components/            # UI组件
│   ├── BottomNav.tsx      # 底部导航（5 项）
│   ├── CalculatorForm.tsx # 计算器表单（含 localStorage 持久化）
│   ├── CalculatorResult.tsx # 计算结果展示
│   ├── RegulationCard.tsx # 法规卡片
│   ├── LegalAidCard.tsx   # 法援卡片
│   ├── DisclaimerBox.tsx  # 免责声明
│   ├── ProblemCard.tsx    # 问题入口卡片
│   ├── FeatureCard.tsx    # 功能入口卡片
│   └── ServiceWorkerRegistrar.tsx # PWA Service Worker 注册
│
├── lib/
│   └── calculator.ts      # 薪资计算逻辑 + 风险等级判断
│
├── public/
│   ├── manifest.json      # PWA 配置
│   ├── sw.js              # Service Worker（离线缓存）
│   └── icons/             # 应用图标（8 种尺寸 SVG）
│
├── android/               # Capacitor Android 原生工程
├── native-shell/          # Capacitor 未配置 URL 时的占位页
├── capacitor.config.ts    # Capacitor App 配置
├── docs/                  # 审阅报告与数据来源记录
├── vercel.json            # Vercel 部署配置
├── .env.example           # 环境变量模板
└── .env.local             # 本地环境变量（不提交）
```

## 本地运行

```bash
# 安装依赖
pnpm install

# 开发模式（默认 http://localhost:3000）
pnpm dev

# 构建
pnpm build

# 启动生产服务器
pnpm start

# 生产服务/PWA 烟测（需先 pnpm build）
pnpm web:smoke
```

## 网页版与 App 版

当前是两个交付形态：

- **网页版**：Next.js 应用，桌面端显示顶部导航，移动端仍保留底部导航。
- **Android App 版**：Capacitor 原生工程位于 `android/`，应用名“骑手权益助手”，包名 `com.deliveryhelper.rider`。

本地 Android 调试流程：

```powershell
# 先启动网页版本
pnpm dev

# 同步 Android 调试 App，默认指向 http://10.0.2.2:3000
pnpm app:sync:android:dev

# 检查 Capacitor/Android 环境
pnpm app:doctor

# 用 Android Studio 打开原生工程
pnpm app:open:android
```

当前 Windows 机器已可使用本地 JDK / Android SDK 目录完成 debug APK 构建。已生成的公开网页版容器 APK：

- `骑手权益助手-v1.2-public-debug.apk`
- APK 内部 `server.url` 指向 `https://delivery-helper.vercel.app`
- `cleartext=false`，不会指向本机 `10.0.2.2` 开发服务

### 演示路径

启动后按以下路径体验核心功能：

1. **首页** → `http://localhost:3000` — 问题导向入口，6 个问题 + 5 个工具卡片
2. **薪资测算** → `/calculator` — 选择城市、输入订单/收入/工时，测算时薪并对比最低工资参考线
3. **法规查询** → `/regulations` — 10 条核心法规，支持分类筛选和关键词搜索
4. **法援导航** → `/legal-aid` — 上海 17 个法律援助中心，一键拨号、地址和接待时间
5. **AI 问答** → `/chat` — 输入劳动权益问题，AI 流式输出证据清单、法规引用和下一步建议
6. **权益动态** → `/news` — 3 条已核验政策动态
7. **PWA** → 在手机浏览器访问后可"添加到主屏幕"，离线时显示离线提示页

## 环境变量

复制 `.env.example` 为 `.env.local` 并填入配置：

```env
# AI 配置
AI_API_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-chat
AI_API_KEY=your_deepseek_api_key_here

# SEO / 部署域名
NEXT_PUBLIC_SITE_URL=https://delivery-helper.vercel.app
SITE_URL=https://delivery-helper.vercel.app

# 认证配置
# 当前 MVP 不启用真实账号系统，不需要认证相关环境变量。
```

- 无 AI API Key 时，AI 接口会返回暂不可用提示
- 自定义域名或部署平台变更时，只更新 `NEXT_PUBLIC_SITE_URL` / `SITE_URL`
- 当前 MVP 版本不需要认证相关环境变量

## 重要边界

### AI 不是律师

- ✅ 定位为"AI 骑手权益信息助手"，不替代律师
- ✅ 只基于内置法规摘要回答
- ✅ 不承诺胜诉，不判断赔偿金额
- ✅ 不编造法条
- ✅ 每次回答都有免责声明和下一步建议

### 数据准确性

- ✅ 所有法规必须来自官方来源（人社部、全国人大、司法部等）
- ✅ 每条数据都有 `lastVerified` 核验时间
- ✅ `lastVerified="待核实"` 表示尚未人工核验
- ✅ 对存在区县分档的最低工资数据展示适用范围说明
- ✅ 不爬虫、不转载全文，只放摘要+官方链接

### 用户隐私

- ✅ MVP 不启用真实注册
- ✅ 不保存聊天记录到服务器
- ✅ 计算器结果只在浏览器本地生成
- ✅ 不上传身份证、合同、医疗材料
- ✅ 不收集邮箱、手机号或密码

## 数据核验状态

| 数据类型 | 已核验 | 待核实 | 来源 |
|----------|--------|--------|------|
| 法规 | 10条 | 0条 | 中国政府网/国务院公报、全国人大、人社部等 |
| 最低工资 | 15城市 | 0城市 | 各地政府、人社局；分档城市附适用范围说明 |
| 法援中心电话 | 17条 | 0条 | 12348上海法网 |
| 法援中心地址/时间 | 17条 | 0条 | 上海市司法局、上海一网通办、12348上海法网 |
| 权益动态 | 3条 | 0条 | 中国政府网/国务院公报、上海市人社局 |

## 开源资源使用

本项目使用了以下开源资源：

| 资源 | 用途 | 来源 |
|------|------|------|
| Vercel AI SDK | AI 流式输出 | https://sdk.vercel.ai |
| Capacitor | Android 原生 App 容器 | https://capacitorjs.com |

## 部署

项目已配置好 `vercel.json`，可直接部署到 Vercel：

1. 推送代码到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入仓库
3. 在 Vercel 项目设置中添加环境变量 `AI_API_KEY`（不配置则 AI 接口返回暂不可用提示）
4. 如有自定义域名，设置 `NEXT_PUBLIC_SITE_URL` / `SITE_URL`，不要修改 `app/sitemap.ts` 和 `app/robots.ts`

## 待完成

- [ ] 定期复核最低工资、法规和法援官方来源
- [ ] 定期复核上海各区法律援助中心地址和接待时间
- [ ] 替换 PWA 图标为正式设计
- [ ] 如离线能力成为核心需求，再评估 Serwist / Workbox
- [ ] 如确需账号系统，再接入带数据库 adapter 的真实认证方案

## 许可证

公益项目，代码开源，内容仅供参考。

---

**免责声明**：本站提供的内容仅为法律信息和一般性指引，不构成律师法律意见。具体维权请咨询 12348 或当地法律援助中心。
