# 外部资料与工具判断记录

更新日期：2026-06-05

## 当前结论

当前版本不引入额外 agent、skill、MCP 服务或来源项目。

原因：

- 产品当前核心是信息展示、薪资测算、法援目录和受控 AI 问答，不需要 AI 调用外部工具。
- 法规、最低工资和法援数据属于高可信要求内容，应该人工核验官方来源，不应由 agent 自动抓取后直接入库。
- MCP 适合把外部工具、数据库或系统能力暴露给模型。当前 MVP 不需要这个复杂度，且会增加安全审查成本。
- 继续保留 Vercel AI SDK，因为它已经用于服务端 AI 文本生成和流式输出，符合当前需求。

更完整的外部资源评估见 `docs/external-resource-review.md`。

## 已参考的官方资料

- Next.js 环境变量文档：服务端环境变量不加 `NEXT_PUBLIC_` 时不会暴露到浏览器。AI API Key 应只在服务端读取。
  - https://nextjs.org/docs/15/app/guides/environment-variables
- Vercel AI SDK 6：统一 TypeScript SDK，支持文本生成、流式输出、工具调用、MCP 和多模型供应商；当前继续只使用服务端文本生成/流式能力。
  - https://ai-sdk.dev/docs/introduction
- Model Context Protocol：MCP 是连接 AI 应用与外部系统、数据源和工具的开放标准；当前不需要把项目工具暴露给 AI。
  - https://modelcontextprotocol.io/docs/getting-started/intro
- Next.js / NextAuth 学习文档：NextAuth 可用于 App Router 认证，但真实邮件登录需要完整认证方案和环境配置。
  - https://nextjs.org/learn/dashboard-app/adding-authentication
- Next.js PWA 指南：Next.js App Router 可通过 manifest、metadata 和 public service worker 支持 PWA。
  - https://nextjs.org/docs/app/guides/progressive-web-apps
- web.dev PWA / Service Worker 资料：PWA 可按需求提供离线回退，不必在 MVP 阶段实现完整运行时缓存。
  - https://web.dev/learn/pwa/service-workers
- OWASP LLM 应用安全资料：提示注入、敏感信息泄露和过度代理权限是 AI 应用重点风险；当前通过低权限 API、输入长度限制和边界校验处理。
  - https://owasp.org/www-project-top-10-for-large-language-model-applications/
- OpenAI Agents SDK：适合需要 agent loop、工具调用、guardrails、handoff、MCP 和 human-in-the-loop 的多步骤工作流；当前项目没有工具调用和外部动作，不引入 agent 框架。
  - https://openai.github.io/openai-agents-python/

## 数据来源核验记录

- 上海最低工资：上海市人力资源和社会保障局通知确认 2025-07-01 起月最低工资 2740 元、小时最低工资 25 元。
  - https://rsj.sh.gov.cn/tgzfl_17732/20250714/t0035_1434097.html
- 北京最低工资：北京市人力资源和社会保障局页面确认 2025-09-01 起月最低工资 2540 元、小时最低工资 27.7 元。
  - https://rsj.beijing.gov.cn/weimenhu/wmtgz/202507/t20250724_4157298.html
- 广州最低工资：广州市政府/人社局页面确认 2025-03-01 起月最低工资 2500 元、小时最低工资 23.7 元。
  - https://www.gz.gov.cn/xw/tzgg/content/post_10134789.html
- 深圳最低工资：深圳政府在线/深圳人社局页面确认 2025-03-01 起月最低工资 2520 元、小时最低工资 23.7 元。
  - https://www.sz.gov.cn/szzt2010/wgkzl/jcgk/jcygk/zdzcjc/content/post_12014799.html
- 武汉最低工资：武汉市人民政府门户网站转载湖北省政府办公厅通知，确认 2025-12-01 起全省月最低工资按 2400 元、2130 元、1970 元三档执行，小时最低工资按 24 元、21.5 元、20 元三档执行；当前武汉按一档参考展示。
  - https://www.wuhan.gov.cn/zwgk/tzgg/202512/t20251227_2703389.shtml
- 成都最低工资：四川省人民政府文件确认 2025-01-01 起全省月最低工资两档为 2330 元、2200 元，小时最低工资两档为 23 元、22 元；成都市人民政府直链已记录为当前 `sourceUrl`，项目数据已按成府规〔2025〕4号更新为第一档参考展示并通过结构校验。多处转载信息一致显示：四川天府新区、成都东部新区、成都高新区、锦江、青羊、金牛、武侯、成华、龙泉驿、青白江、新都、温江、双流、郫都、新津执行第一档，简阳、都江堰、彭州、邛崃、崇州、金堂、大邑、蒲江执行第二档。本环境直接抓取成都市政府 URL 返回 `412 Precondition Failed`，后续如需更强证据链，应人工浏览器复核原文并留痕。
  - https://www.chengdu.gov.cn/gkml/cdsrmzfbgt/xzgfxwj/1380564429229260800.shtml
  - https://www.sc.gov.cn/10462/zfwjts/2025/1/2/60841bcf38d844fb80ad1ea0b2d74e24/files/%E5%B7%9D%E5%BA%9C%E8%A7%844%E5%8F%B7%E5%85%AC%E5%BC%80%E7%89%88.pdf
  - https://finance.sina.com.cn/jjxw/2025-06-06/doc-inezcrkf5452982.shtml?froms=ggmp
  - https://cdzfgjj.chengdu.gov.cn/cdgjj/c1156360/2025-07/30/content_6b795176b53d4bc6a5661330470d14a0.shtml
- 2026-06-05 复检成都来源：继续检索 `chengdu.gov.cn`、`cdhrss.chengdu.gov.cn`、`gk.chengdu.gov.cn` 官方域名，并用本机请求复查成都市政府 URL；官方 URL 存在但本环境返回 `412 Precondition Failed`。第三方政策库和“成都发布”转载内容只作为一致性线索，不作为自动联网校验依据。
  - https://zc.51shebao.com/detail/836465
  - https://finance.sina.com.cn/stock/estate/integration/2025-06-06/doc-inezcriy2485645.shtml
  - https://finance.sina.com.cn/jjxw/2025-06-06/doc-inezcrkf5452982.shtml?froms=ggmp
- 分档最低工资展示：对重庆、郑州、西安、合肥等存在区县分档的城市，计算器展示主城区或市区参考档，并附适用范围说明；不把分档标准表述为全市统一标准。
- 上海 12348 公共法律服务：12348上海法网确认上海热线拨打方式为 `021-12348`，并列出全市 17 个法律援助中心及联系电话。
  - https://sh.12348.gov.cn/sites/12348/index/index-advice.jsp
  - https://sh.12348.gov.cn/sites/12348/service-help.jsp
- 上海市法律援助中心迁址公告：上海市司法局确认上海市法律援助中心地址为中山西路1538号，接待时间为周一至周五 9:00-11:30、13:30-16:30。
  - https://sfj.sh.gov.cn/2020zwdt_bmts/20241125/28b02378369d421e8cee0bb7bb901a0d.html
- 上海一网通办法援事项：核验全市 16 个区级法律援助办理地点和办理时间；其中黄浦、静安、长宁、虹口、杨浦、闵行、青浦、奉贤、金山来自市级“对公民提供法律援助”事项页统一列表，徐汇、浦东、普陀、宝山、嘉定、松江、崇明来自区级事项页。
  - https://zwdt.sh.gov.cn/govPortals/bsfw/item/ee293aeb-c5ca-4392-adc6-333dc7685e74
  - https://zwdt.sh.gov.cn/govPortals/bsfw/item/f9f1bc65-353e-4a3a-94d5-ad9e89822511
  - https://zwdt.sh.gov.cn/govPortals/bsfw/item/fdf0237e-e5db-4841-babf-78d79a6674dc
  - https://zwdt.sh.gov.cn/govPortals/bsfw/item/96643a18-98c9-4c60-a015-9691ed85047e
  - https://zwdt.sh.gov.cn/govPortals/bsfw/item/dce378bb-f8ff-4c04-bdd1-1802eb3ffcca
  - https://zwdt.sh.gov.cn/govPortals/bsfw/item/3eb47015-17cb-4768-830f-9a78b268430d
  - https://zwdt.sh.gov.cn/govPortals/bsfw/item/01fdeb28-481b-42ab-a12c-f11af13ff6f5
  - https://zwdt.sh.gov.cn/govPortals/bsfw/item/9c4da2fc-f01f-4056-8457-998a5689d1f1
- 新就业形态劳动者权益保障三项指引：中国政府网确认文件标题、发文机关、成文日期和三项指引内容。
  - https://www.gov.cn/zhengce/zhengceku/202402/content_6933822.htm
- 新就业形态人员职业伤害保障试点扩围：国家税务总局政策法规库确认人社部发〔2025〕24号、成文日期 2025-04-22、试点扩围安排和职业伤害保障办法。
  - https://jiangsu.chinatax.gov.cn/art/2025/4/22/art_23636_5882.html
- 上海职业伤害保障试点扩围：上海市人力资源和社会保障局确认沪人社规〔2025〕17号，自 2025-07-01 起施行，适用于出行、即时配送、同城货运等新就业形态人员。
  - https://rsj.sh.gov.cn/tjypx_17728/20250819/t0035_1434960.html
- Capacitor Android App：官方文档确认 Capacitor 可接入现有 Web 项目，配置文件包含 `appId`、`appName`、`webDir` 等字段，Android 平台通过安装 `@capacitor/android` 并执行 `npx cap add android` 生成；本轮已按该路线新增 Android 原生工程。
  - https://capacitorjs.com/docs/getting-started
  - https://capacitorjs.com/docs/config
  - https://capacitorjs.com/docs/android

## 后续可考虑但暂不引入

- MCP：当需要把官方数据核验、知识库检索或内部后台工具接入 AI 时再评估。
- 账号系统：如必须启用，优先选择带数据库 adapter 的完整认证方案，并同步隐私政策和账户删除能力。
- 本地校验：`pnpm validate:data` 同时检查静态数据和 MVP 账号边界，避免源码重新引入真实登录、邮件认证或 Session Provider。
- PWA：当前保留手写 Service Worker 和 manifest；`pnpm validate:data` 会检查离线页、manifest、关键图标、API 不缓存、同源请求边界和外部 URL 边界。
- Serwist / Workbox：如 PWA 离线能力成为真实需求，再接入成熟 Service Worker 工具；当前不安装，避免包管理和缓存策略复杂度。
- AI 安全：`pnpm validate:data` 检查 AI API 的请求体上限、角色过滤、最后一条用户消息、服务端 API Key、输出长度、敏感信息提醒和不保存聊天记录边界。
