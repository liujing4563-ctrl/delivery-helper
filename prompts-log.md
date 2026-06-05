# Prompts Log

> 用于 06/27-06/30 AI 基础培训素材复盘。只记录关键 prompt、决策和 AI 修正点。

## 2026-06-05

### 接手和审查

用户要求继续项目，并提出：

```text
如果网上有什么来源的agent，skill，mcp或者来源项目或者资料对我们有用的，可以去思考，然后下载过来，
你每次执行完一个计划都要审阅我们的工作和项目，然后继续接着往下执行
```

执行结果：

- 读取项目进展记录和当前文件树。
- 确认 `delivery-helper/` 已经成为主要 Next.js 应用。
- 查询官方资料后判断：当前产品不需要引入 MCP/agent 项目。MCP 适合“给 AI 接工具和数据源”，但本项目当前核心是信息网站和受控问答，引入 MCP 会增加安全和维护复杂度。
- 保留 Vercel AI SDK 作为 AI 流式接口工具；账号系统暂时不应使用 NextAuth 邮件魔法链接，因为 Auth.js 邮件登录需要数据库 adapter 保存验证 token。

### 第一轮修复

目标：

- 不让未核验最低工资数据参与风险判断。
- 把账号系统降级为 MVP 占位，避免假装真实登录和删除账户已完成。

关键修复：

- `lib/calculator.ts`：`lastVerified="待核实"` 的城市最低工资不参与红黄绿判断，返回灰色风险。
- `components/CalculatorForm.tsx` / `components/CalculatorResult.tsx`：展示“暂无已核验数据”。
- `app/login/page.tsx`、`app/account/page.tsx`、`app/account/delete/page.tsx`：改为账号占位和本地数据清除。
- `app/api/auth/[...nextauth]/route.ts`：返回 501，说明 MVP 暂不启用真实登录。
- `app/privacy/page.tsx`、`README.md`：同步真实边界。

验证：

- `pnpm build` 通过。
- `pnpm typecheck` 通过。

### 第三轮修复

目标：

- 法援目录不能只做到“数量正确”，必须避免把占位电话、空地址和泛化时间当成已核验信息。
- 使用官方来源核验上海 12348 热线和 17 个法律援助中心电话。

关键修复：

- `data/legalAidCenters.ts`：把上海 17 个法律援助中心电话改为 12348上海法网列出的官方号码。
- `data/legalAidCenters.ts`：区级地址和接待时间未在当前官方页面确认时不展示。
- `app/legal-aid/page.tsx`：热线文案改为上海公共法律服务热线 `021-12348`，提示法律援助机构查询按 2。
- `README.md`、`docs/source-and-tooling-notes.md`：同步数据核验状态和官方来源。

### 第四轮修复

目标：

- 新闻动态不能继续展示未核验的占位新闻。
- 职业伤害保障政策不能继续停留在旧的待核实链接。

关键修复：

- `data/regulations.ts`：将职业伤害保障政策更新为人社部等九部门 2025 年试点扩围文件，并标记为已核验。
- `data/news.ts`：删除占位新闻，改为 3 条已核验官方政策动态。
- `app/news/page.tsx`：核验状态样式改为已核验绿色、待核实黄色。
- `README.md`、`docs/source-and-tooling-notes.md`：同步权益动态数量和官方来源。

### 第五轮修复

目标：

- AI 接口不能把客户端伪造的 `system` 角色或超长历史直接透传给模型。
- API 输入边界应和隐私/合规说明一致，控制单条问题、总内容和请求体大小。

关键修复：

- `app/api/chat/route.ts`：只接受 `user` / `assistant` 文本消息，过滤其他角色。
- `app/api/chat/route.ts`：限制请求体、单条消息、总文本长度和最多保留最近 8 条消息。
- `app/api/chat/route.ts`：要求最后一条消息必须是用户问题，并统一 JSON 错误响应编码。

### 第六轮修复

目标：

- 薪资计算器不能让未核验城市在下拉框里看起来和已核验城市完全一样。

关键修复：

- `components/CalculatorForm.tsx`：城市下拉中未核验城市显示为“城市（待核实）”。
- `components/CalculatorForm.tsx`：修正已核验布尔判断，避免未找到城市时被误判为已核验。

### 第七轮修复

目标：

- 继续清理最低工资待核实数据，优先只更新能找到官方来源的城市。

关键修复：

- `data/minWage.ts`：使用湖北省人民政府公报核验武汉最低工资，更新为 2024-02-01 起月最低工资 2210 元、小时最低工资 22 元。
- `README.md`、`docs/source-and-tooling-notes.md`：同步最低工资核验数量和官方来源记录。

### 第八轮修复

目标：

- AI 接口的请求体大小限制不能只依赖客户端提供的 `content-length`。

关键修复：

- `app/api/chat/route.ts`：改为先读取请求文本并按实际字节数二次校验，再解析 JSON。
- `app/api/chat/route.ts`：非法 JSON 返回统一中文错误，避免被外层异常处理吞掉具体边界语义。

### 第九轮修复

目标：

- 聊天页遇到服务端 400/413 等错误时，应展示真实边界提示，而不是泛化的“请求失败”。

关键修复：

- `app/chat/page.tsx`：读取 `/api/chat` 的 JSON 错误信息并展示给用户。
- `app/chat/page.tsx`：保留兜底错误文案，避免异常细节透出。

### 第十轮修复

目标：

- 按用户要求继续评估网上 agent、skill、MCP、来源项目和资料，但不盲目下载代码。

关键判断：

- MCP、Agent Skills、OpenAI Agents 当前都属于“后续可用”，但会增加权限和维护复杂度，不适合当前 MVP 直接接入。
- Vercel AI SDK 已满足当前服务端模型调用和流式输出需求，继续保留。
- 新增 `docs/external-resource-review.md`，把外部资料、决策和安全红线沉淀为项目文档。

### 第十一轮修复

目标：

- 修复账号模块重新引入邮箱登录后造成的 typecheck / lint 失败，并恢复 MVP 隐私边界。

关键修复：

- 删除 `auth.ts` 中未完成的 NextAuth 邮箱登录配置，避免无数据库 adapter 的魔法链接登录误导用户。
- `app/api/auth/[...nextauth]/route.ts`：改为固定 501 占位响应，说明 MVP 暂不启用真实账号系统。
- `app/account/page.tsx`、`app/login/page.tsx`、`app/verify-request/page.tsx`、`app/privacy/page.tsx`、`app/account/delete/*`：统一改为本地数据管理和账号功能说明，不再展示邮箱登录、JWT 或 Resend 文案。
- `components/Providers.tsx`：移除 NextAuth `SessionProvider`，当前只做透传。
- `README.md`：同步目录结构和 `pnpm validate:data` 命令。

### 第十二轮修复

目标：

- 清理账号系统关闭后的非包管理残留，并让本地校验能阻止认证边界回退。

关键修复：

- `types/next-auth.d.ts`：移除旧的 NextAuth 类型增强导入，改为空模块占位，避免类型层继续依赖真实账号系统。
- `tools/validate_data.py`：新增源码认证边界检查，扫描 `app/`、`components/`、`lib/`，阻止重新引入 NextAuth、Auth.js、Resend、SessionProvider 或登录函数。
- 保留 `package.json` 和 `pnpm-lock.yaml` 中的旧依赖不动；依赖移除属于包管理变更，需要用户明确确认后再执行。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 第十三轮核验

目标：

- 继续核实成都最低工资数据，避免把二手来源或无法确认区县适用档的数据标为已核验。

关键判断：

- 四川省人民政府文件已确认 2025-01-01 起全省最低工资两档：月标准 2330 元 / 2200 元，小时标准 23 元 / 22 元。
- 该省级文件要求各市州重新选择本地具体档次，但不直接确认成都各区县适用哪一档。
- 成都本地官方页面当前通过工具读取返回 412，不能直接核验原文，因此暂不拆分或更新成都数据。
- 成都继续保持 `lastVerified="待核实"`，不参与薪资风险判断。

### 第十四轮回归

目标：

- 验证账号系统关闭后的前端页面和占位 API 是否与 MVP 隐私边界一致。

验证结果：

- `/login`：展示账号功能说明，不出现邮箱登录、Magic Link、JWT 或 Resend 文案。
- `/account`：展示本地数据管理和账号功能说明，核心功能无需登录。
- `/account/delete`：展示清除本地数据说明，并明确当前没有服务端账户记录。
- `/verify-request`：说明账号功能暂未启用，不发送登录邮件。
- `/privacy`：说明不收集邮箱、手机号、密码，不保存聊天记录到服务器。
- `/api/auth/session`：返回 501 JSON，占位说明 MVP 暂不启用真实账号系统。
- 浏览器控制台未发现错误。

### 第十五轮修复

目标：

- 提升薪资计算器对最低工资核验状态的语义明确性。

关键修复：

- `lib/calculator.ts`：将 `cityMinWage?.lastVerified !== '待核实'` 改为显式 `Boolean(cityMinWage && cityMinWage.lastVerified !== '待核实')`，避免未找到城市时在语义上被当成已核验。
- 不改变当前用户可见结果；未找到城市或城市待核实时仍返回灰色风险。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 第十六轮修复

目标：

- 按用户要求继续评估网上有用的资料，并把 PWA 相关边界沉淀为项目校验，而不是直接下载外部依赖。

外部资料判断：

- Next.js 官方 PWA 指南确认当前 manifest + metadata + public service worker 路线可行。
- web.dev PWA / Service Worker 资料说明 MVP 可先提供离线回退，不必立即接入完整运行时缓存方案。
- Serwist / Workbox 后续可用，但当前会引入包管理变更和缓存复杂度，暂不下载。

关键修复：

- `tools/validate_data.py`：新增 PWA 边界校验，检查 `public/manifest.json` 必填字段、图标文件存在、192/512 图标、maskable 图标、`public/sw.js` 离线页、API 跳过缓存和外部 URL 边界。
- `docs/source-and-tooling-notes.md`：补充 Next.js PWA、web.dev Service Worker 资料和当前不引入 Serwist / Workbox 的原因。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `python -m py_compile tools/validate_data.py` 通过。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 第十七轮修复

目标：

- 审阅法援目录的已核验字段展示，避免用户把“电话已核验”误解为“地址和接待时间也已核验”。

关键修复：

- `components/LegalAidCard.tsx`：当法援中心只有电话、没有已核验地址或接待时间时，卡片底部显示 `✓ 电话 YYYY-MM-DD`。
- 市级法律援助中心因地址和接待时间已核验，继续显示普通核验日期。
- `.gitignore`：补充 Python `__pycache__/` 和 `*.pyc` 忽略规则，避免本地校验工具生成缓存污染工作区。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。
- 浏览器抽查 `/legal-aid`：存在 `✓ 电话 2026-06-05`、边界说明和市级核验日期，控制台无错误。

### 第十八轮修复

目标：

- 继续评估网上 agent、MCP、AI 安全资料，并把适合当前 MVP 的 AI 问答边界固化为本地校验。

外部资料判断：

- OWASP LLM 应用安全资料对提示注入、敏感信息泄露、过度代理权限有参考价值。
- OpenAI Agents Guardrails 适合多 agent / 多工具流程；当前项目没有工具调用、handoff 或外部动作，不引入 Agents SDK。
- 当前继续保留 Vercel AI SDK 服务端文本生成方案，把风险控制放在输入清洗、输出约束和本地校验上。

关键修复：

- `tools/validate_data.py`：新增 AI 问答边界校验，检查请求体大小、单条消息、总上下文、历史条数、真实字节数校验、消息清洗、最后一条必须是用户问题、服务端 API Key、输出长度、低温度、前端 maxLength、敏感信息提醒和服务端错误展示。
- `docs/source-and-tooling-notes.md`：补充 OWASP LLM 应用安全资料、OpenAI Agents Guardrails 和当前 AI 安全边界说明。
- `docs/external-resource-review.md`：记录 OWASP / Guardrails 的评估结论和暂不引入 agent 框架的原因。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `python -m py_compile tools/validate_data.py` 通过。

### 切换账号前交接记录

用户即将切换账号，已新增 `docs/current-handoff.md` 作为当前项目交接入口。

交接内容包括：

- 当前项目位置、技术栈和产品定位。
- 已完成功能状态：薪资计算器、法规库、法援目录、AI 权益助手、账号占位、PWA、本地校验。
- 最近第二十、第二十一轮修复摘要。
- 最近一次完整验证结果。
- 重要边界：不自动提交、不自动清理旧认证依赖、不引入额外 agent / skill / MCP、不用未核验数据驱动风险判断。
- 下一步建议：优先 PWA/图标体验、成都最低工资官方核验、旧认证依赖清理需用户明确确认。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 第十九轮修复

目标：

- 继续按官方来源核验上海区级法律援助办理地点和时间，只更新可明确核验的数据。

关键修复：

- `data/legalAidCenters.ts`：新增徐汇、浦东、普陀、宝山、嘉定、松江、崇明 7 个区级法律援助办理地点和办理时间，来源为上海一网通办事项页并保留 12348 上海法网电话来源。
- `app/legal-aid/page.tsx`：热线卡片统计从“已核验电话”扩展为“已核验电话 + 已核验地址/接待时间”。
- `README.md`：法援中心地址/时间核验状态更新为 8 条已核验、9 条待核实。
- `docs/source-and-tooling-notes.md`：补充 7 个上海一网通办法援事项来源链接和“其余未核实时不展示”的边界。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

- 浏览器抽查 `/legal-aid`：统计显示 17 个电话、8 个地址/接待时间；徐汇、浦东地址可见；电话-only 标签仍存在；控制台无错误。

### 第二十轮修复

目标：

- 继续补齐上海剩余区县法律援助办理地点和接待时间，但只使用官方页面可确认的字段。

关键修复：

- `data/legalAidCenters.ts`：新增黄浦、静安、长宁、虹口、杨浦、闵行、青浦、奉贤、金山 9 个区级法律援助办理地点和统一接待时间，来源为上海一网通办“对公民提供法律援助”事项页，并继续保留 12348 上海法网电话来源。
- `README.md`：法援中心地址/时间核验状态更新为 17 条已核验、0 条待核实；法援目录说明同步包含电话、地址和接待时间。
- `docs/source-and-tooling-notes.md`：补充市级事项页来源和 16 个区级法援办理地点/时间核验结论。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

- 浏览器抽查 `/legal-aid`：统计显示 17 个上海法律援助中心电话、17 个地址/接待时间；黄浦、静安、奉贤地址可见；控制台无错误。

### 第二十一轮修复

目标：

- 执行本轮后审阅项目，把已经完成的上海法援地址/时间补齐结果固化成回归校验。

关键修复：

- `tools/validate_data.py`：新增上海法律援助中心完整性校验，要求当前 MVP 保持 17 条上海法律援助中心、17 个电话、17 个地址/接待时间，且不回退为 `待核实`。
- `.gitignore`：新增 `.playwright-cli/` 和 `.tmp-dev-*.log` 忽略规则，减少后续浏览器抽查和开发服务日志噪音。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `python -m py_compile tools/validate_data.py` 通过。

### 第二十二轮修复

目标：

- 继续审阅最低工资数据，避免分档城市把主城区参考档误展示为全市统一标准。
- 用新的官方来源更新武汉最低工资。

关键修复：

- `data/minWage.ts`：武汉更新为 2025-12-01 起月最低工资 2400 元、小时最低工资 24 元，来源为武汉市人民政府门户网站转载的湖北省政府办公厅通知。
- `data/types.ts`：最低工资数据新增可选 `scopeNote` 字段。
- `components/CalculatorForm.tsx`：城市说明和复制结果新增“适用范围/说明”。
- `tools/validate_data.py`：新增分档城市 `scopeNote` 回归校验，防止后续删除适用范围说明。
- 成都继续保持 `lastVerified="待核实"`，仅记录四川省两档标准和成都区县档次待本地官方原文核准的说明，不参与风险判断。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `python -m py_compile tools/validate_data.py` 通过。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。
- 浏览器抽查 `/calculator`：页面可加载，成都仍显示为待核实城市，控制台无错误；Browser 自动化对原生下拉框选项切换不可靠，未作为交互失败依据。

### 第二十三轮审阅

目标：

- 按用户要求继续评估网上 agent、skill、MCP、来源项目和资料。
- 继续核实成都最低工资，但不把非直接官方原文当作完全核验来源。

关键判断：

- 当前项目仍不下载第三方 agent / skill / MCP 代码；现阶段更需要官方资料核验和本地校验闸门。
- 成府规〔2025〕4号转载原文和成都住房公积金管理中心引用均支持成都 2025 年两档最低工资及区县划分，但成都市政府原通知页面仍未能直接读取。

关键修复：

- `data/minWage.ts`：成都 `scopeNote` 补充分档区县线索，同时保持 `lastVerified="待核实"`，不参与风险判断。
- `docs/source-and-tooling-notes.md`：记录四川省政府文件、成府规〔2025〕4号转载原文和成都住房公积金管理中心官方引用。
- `docs/external-resource-review.md`：补充本轮外部资源审阅结论，说明不下载外部 agent / MCP 的原因。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 第二十四轮修复

目标：

- 继续推进非包管理、低风险的 PWA 体验和边界校验。

关键修复：

- `public/sw.js`：缓存版本升级为 `delivery-helper-v2`，预缓存 `manifest.json`、192 图标和 512 图标。
- `public/sw.js`：新增同源请求限制，避免 Service Worker 处理外部资源。
- `app/offline/page.tsx`：离线页增加法规库和法援目录入口，匹配当前预缓存页面。
- `tools/validate_data.py`：新增 PWA 关键资源预缓存和同源边界校验。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `python -m py_compile tools/validate_data.py` 通过。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 第二十五轮修复

目标：

- 审阅第二十四轮后的交接记录和 PWA 注册实现，继续做非包管理、低风险收口。

关键修复：

- `docs/current-handoff.md`：将“最近完成的四轮”修正为“最近完成的五轮”，并更新下一步建议，明确生产构建 PWA 抽查、成都官方来源核验、模板 SVG 清理需要用户确认等边界。
- `components/ServiceWorkerRegistrar.tsx`：移除生产环境 Service Worker 注册成功日志；注册失败按渐进增强处理，不影响核心功能。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。
- `python -m py_compile tools/validate_data.py tools/monitor_min_wage.py` 通过。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 首次因已有 Next build 锁提示并发构建，等待后重跑通过。
- 生产服务抽查 `http://localhost:3002/offline`：页面可加载，manifest 存在，首页/薪资计算器/法规库/法援目录入口可见，控制台无 `log/warn/error`。
- 生产服务抽查 `http://localhost:3002/calculator`：页面可加载，manifest 存在，城市选择可见，控制台无 `log/warn/error`。
- Browser 只读页面作用域未暴露 `navigator`，本轮未直接读取 Service Worker registration/caches；已停止本次 3002 生产服务。

### 第二十六轮审阅

目标：

- 按当前交接建议继续核实成都最低工资本地官方来源。

关键判断：

- 继续检索 `chengdu.gov.cn`、`cdhrss.chengdu.gov.cn`、`gk.chengdu.gov.cn` 等官方域名，仍未获得可直接读取的成都市政府原文页。
- 第三方政策库和“成都发布”转载内容与既有线索一致，但只能作为线索，不能把成都数据改为已核验。

关键修复：

- `docs/source-and-tooling-notes.md`：补充 2026-06-05 成都来源复检记录，明确第三方政策库和转载内容不驱动 `lastVerified` 更新。
- `data/minWage.ts`：未修改，成都继续保持 `lastVerified="待核实"`。

验证：

- `pnpm validate:data` 通过，仅保留成都最低工资待核实警告。

### 第二十七轮修复

目标：

- 按用户要求继续评估网上 agent、skill、MCP、来源项目和资料，并在每轮后审阅当前项目状态。
- 修复最新代码状态和交接文档之间的不一致。

关键判断：

- 重新查看 MCP、OpenAI Agents SDK、Vercel AI SDK 6 和 Next.js PWA 官方资料；当前仍不下载第三方 agent / skill / MCP 代码。
- MCP / Agents SDK 适合工具调用、多步骤编排、guardrails、handoff 或 human-in-the-loop；当前 MVP 只需要可信静态数据、薪资测算、法援目录和受控服务端问答。
- 成都最低工资当前代码已切到成都市人民政府官方直链并通过结构校验；但本环境直接抓取该 URL 返回 `412 Precondition Failed`，更强证据链仍需要人工浏览器复核留痕。

关键修复：

- `README.md`：同步最低工资核验状态为 15 城市已核验、0 城市待核实，并补充 SEO 模块。
- `docs/current-handoff.md`：同步最新 SEO、成都来源、PWA 抽查和下一步边界。
- `docs/source-and-tooling-notes.md`：更新 MCP、OpenAI Agents SDK、Vercel AI SDK 6 官方资料结论，并修正成都来源记录。
- `docs/external-resource-review.md`：同步本轮外部资源复评结论。
- `docs/review-2026-06-05-round2.md`：补充说明该文件是审阅快照，当前状态以实时 `git status` 和交接文档为准。
- `components/CalculatorForm.tsx`：审阅到已有 localStorage 水合修复后，补上 `storageReady` 保存闸门，避免恢复前把默认值写回本地存储；lint 发现 effect 内同步 setState 后，改为挂载后异步恢复。
- `components/BottomNav.tsx`、`components/FeatureCard.tsx`、`components/ProblemCard.tsx`：审阅到已有可访问性改动后，保留 `aria-label`、`aria-current`、`aria-hidden`，并整理 JSX 换行。

验证：

- `pnpm validate:data` 通过，无警告。
- `python -m py_compile tools/validate_data.py tools/monitor_min_wage.py` 通过。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过，19 条路由生成成功，包含 `/robots.txt` 和 `/sitemap.xml`。

### 第二十八轮修复

目标：

- 回答“当前是不是一个 App，能不能再做网页版”的需求。
- 保留移动端 App/PWA 体验，同时补齐桌面网页版布局。

关键判断：

- 当前项目本质是 Next.js Web App/PWA，只是 UI 优先按手机 App 形态设计。
- 不新建一套重复项目；采用响应式布局，避免双代码路径维护成本。

关键修复：

- `components/DesktopNav.tsx`：新增桌面端顶部导航。
- `app/layout.tsx`：桌面端显示顶部导航，主内容容器从移动端窄屏扩展为桌面宽屏。
- `components/BottomNav.tsx`：底部导航仅在移动端显示。
- `app/page.tsx`：首页 hero 和问题/工具卡片增加桌面端宽屏、多列布局。
- `docs/current-handoff.md`：记录当前形态为移动端 App/PWA + 桌面网页版响应式布局。

验证：

- `pnpm validate:data` 通过；本轮同步补强了 SEO 边界校验，并兼容当前 `app/api/chat/route.ts` 的 `msg.role` 角色过滤写法。
- `python -m py_compile tools/validate_data.py tools/monitor_min_wage.py` 通过。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过，19 条路由生成成功。
- Browser 插件连接超时两次，未取得截图；改用现有 `http://localhost:3000/` 响应和源码断言兜底，确认首页 HTML 包含“桌面主导航 / 薪资测算 / 法援目录 / 权益动态”，并确认 `DesktopNav`、移动端底部导航 `md:hidden`、桌面宽屏容器和多列卡片 class 均已落地。

### 第二十九轮修复

目标：

- 回应“做成一个真正的网页版本，加上一个真正的 App 版本”。
- 保留当前 Next.js 为真实网页版本，同时新增 Android 原生 App 工程。

关键判断：

- 官方 Capacitor 文档支持把已有 Web 项目接入原生 Android/iOS 工程。
- 当前 Next.js 应用包含服务端 API 和 AI 流式路由，不适合直接改成纯静态导出；本轮先用 Capacitor Android 容器承载已部署或本地运行的网页版本。
- Windows 环境可以生成 Android 工程；iOS 仍需要 macOS + Xcode。

关键修复：

- `package.json` / `pnpm-lock.yaml`：新增 `@capacitor/core`、`@capacitor/android`、`@capacitor/cli`，并增加 `app:sync`、`app:sync:android:dev`、`app:doctor`、`app:open:android`、`app:run:android` 脚本。
- `capacitor.config.ts`：新增 Capacitor 配置，应用名“骑手权益助手”，包名 `com.deliveryhelper.rider`，通过 `CAPACITOR_SERVER_URL` 指向网页版本。
- `native-shell/index.html`：新增 App 壳占位页，未配置 URL 时提示设置 `CAPACITOR_SERVER_URL`。
- `android/`：生成 Capacitor Android 原生工程。
- `tools/sync_android_app.ps1`：新增 Android 同步脚本，默认调试 URL 为 `http://10.0.2.2:3000`。
- `android/app/src/androidTest/.../ExampleInstrumentedTest.java`、`android/app/src/test/.../ExampleUnitTest.java`：修正模板测试包名和断言，避免默认 `com.getcapacitor` 包名残留。
- `README.md`、`docs/current-handoff.md`、`docs/native-app.md`：同步网页/App 双形态说明、运行命令和构建前置条件。

验证：

- `pnpm app:sync:android:dev` 通过，Android 调试配置已写入 `http://10.0.2.2:3000`。
- `pnpm app:doctor` 通过，Capacitor 8.4.0 依赖和 Android 工程配置正常。
- 已检查 `android/app/build.gradle`，namespace/applicationId 为 `com.deliveryhelper.rider`。
- 已检查 `android/app/src/main/res/values/strings.xml`，应用名和 activity 标题为“骑手权益助手”。
- `pnpm validate:data`、`python -m py_compile tools/validate_data.py tools/monitor_min_wage.py`、`pnpm typecheck`、`pnpm lint`、`pnpm build` 通过。
- `.\android\gradlew.bat -p android assembleDebug` 未通过，失败原因是本机 `JAVA_HOME` 未设置且没有 `java` 命令；因此本轮已生成 Android 原生工程，但尚不能在本机打包 APK。

### 第三十轮修复

目标：

- 按用户要求下载并使用 `agency-agents`、Elon Musk skill、Andrej Karpathy skills 审查当前项目。
- 把第一性原理工作规则写入 `Claude.md`。
- 修复审查发现的问题，并在每轮后复核项目状态。

外部资料：

- 已下载 `https://github.com/alchaincyf/elon-musk-skill` 到 `reference-skills/elon-musk-skill/`。
- 已下载 `https://github.com/multica-ai/andrej-karpathy-skills` 到 `reference-skills/andrej-karpathy-skills/`。
- 已使用 `C:\Users\Admin\Desktop\Project\agency-agents` 中的工程、测试、安全、产品、法务合规角色做审查。

关键修复：

- 新增 `C:\Users\Admin\Desktop\Project\Claude.md`，写入第一性原理规则和外部资料路径。
- `README.md`、`.env.example`：统一账号边界为 MVP 暂不启用真实账号，并新增 `NEXT_PUBLIC_SITE_URL` / `SITE_URL`。
- `package.json` / `pnpm-lock.yaml`：移除未启用账号系统的 `@auth/core`、`next-auth`、`resend`。
- `pnpm-workspace.yaml`：新增 `postcss: 8.5.15` override，修复生产依赖审计中的 `postcss <8.5.10` 漏洞。
- `android/app/src/main/AndroidManifest.xml`：关闭 `android:allowBackup`。
- `app/legal-aid/page.tsx`、`app/regulations/page.tsx`：筛选控件改为 button + `aria-pressed`。
- `app/api/chat/route.ts`：服务端接管真实模型 `result.textStream`，缺少免责声明时后置追加固定声明。
- `lib/site.ts`、`app/layout.tsx`、`app/sitemap.ts`、`app/robots.ts`：站点 URL 改为环境变量统一注入。
- `tools/validate_data.py`：新增服务端免责声明、SEO URL、Android Manifest、账号占位 API 的边界校验。
- `lib/calculator.test.ts`：补齐测试夹具必填 `sourceUrl`。
- `docs/agency-agents-review-2026-06-05.md`、`docs/current-handoff.md`：同步修复复核和下一步边界。

验证：

- `python -m py_compile tools/validate_data.py tools/monitor_min_wage.py` 通过。
- `pnpm validate:data` 通过。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm test` 通过，1 个测试文件、19 个用例。
- `pnpm build` 通过，18 条 App Router 路由生成成功。
- `pnpm audit --prod` 通过，无已知漏洞。
- `pnpm why postcss` 显示仅剩 `postcss@8.5.15`。
- `pnpm app:doctor` 通过。
- `git diff --check` 通过，仅有 Windows CRLF 提示。
- `.\android\gradlew.bat assembleDebug` 未通过，失败原因仍是本机缺 `JAVA_HOME` / `java`。

### 第三十一轮修复

目标：

- 继续按 `agency-agents` 审查报告推进下一步。
- 优先做不需要系统级安装确认的修复。

关键修复：

- `tools/validate_data.py` 新增可访问性边界校验：
  - `/legal-aid` 和 `/regulations` 筛选控件不得使用不完整 tab 语义。
  - 禁止回退到 `role="tablist"`、`role="tab"`、`aria-selected`。
  - 要求筛选按钮保留 `aria-pressed`，筛选容器保留明确 `aria-label`。

验证：

- `python -m py_compile tools/validate_data.py tools/monitor_min_wage.py` 通过。
- `pnpm validate:data` 通过。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm test` 通过，1 个测试文件、19 个用例。
- `pnpm build` 通过，18 条 App Router 路由生成成功。
- `pnpm audit --prod` 通过，无已知漏洞。
- `git diff --check` 通过，仅有 Windows CRLF 提示。

环境限制：

- 尝试启动 3004 端口做真实浏览器/PWA 抽查。
- `Start-Process` 因 Windows 环境变量 `Path/PATH` 重复键失败。
- `cmd /c start /b` 未成功监听 3004，日志为空。
- 本轮只完成静态可访问性回归闸门，未声明真实浏览器/PWA 抽查完成。

### 第三十二轮修复

目标：

- 继续使用 `agency-agents` 的 Reality Checker / Accessibility Auditor / Frontend Developer 视角补证据。
- 把生产服务/PWA 抽查从一次性命令变成可重复脚本。

关键判断：

- Android APK 打包仍需要 JDK / Android SDK，属于系统配置，不在未确认情况下安装。
- 浏览器/PWA 方向可以先做生产服务烟测：验证服务能启动、核心页面可响应、PWA 关键资源可响应。
- 这不等同于屏幕阅读器或真实 Service Worker 缓存命中测试，不能误报为完整无障碍/PWA 验收。

关键修复：

- `tools/smoke_web.ps1`：新增生产服务/PWA 烟测脚本。
  - 直接调用 `node_modules/.bin/next.cmd start -p 3004`，绕开 `pnpm start -- -p` 参数误传和 job 环境 PATH 问题。
  - 验证 `/`、`/legal-aid`、`/regulations`、`/offline`、`/manifest.json`、`/sw.js`、`/robots.txt`、`/sitemap.xml`。
  - 验证完成后停止后台 job。
- `package.json`：新增 `web:smoke` 脚本。
- `tools/validate_data.py`：把 `tools/smoke_web.ps1` 和 `web:smoke` 纳入边界校验。
- `README.md`：补充 `pnpm web:smoke` 使用方式。
- `docs/current-handoff.md`：记录第三十二轮和最新验证状态。

验证：

- `pnpm web:smoke` 通过。
- `python -m py_compile tools/validate_data.py tools/monitor_min_wage.py` 通过。
- `pnpm validate:data` 通过。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm test` 通过，2 个测试文件、31 个用例。
- `pnpm build` 通过，18 条 App Router 路由生成成功。
- `pnpm audit --prod` 通过，无已知漏洞。
- `git diff --check` 通过，仅有 Windows CRLF 提示。

### 第三十三轮修复

目标：

- 继续使用 `agency-agents` 的 AppSec Engineer / Reality Checker 视角修复剩余安全与证据问题。
- 不安装 JDK / Android SDK，避免未经确认修改系统环境。

关键修复：

- `C:\Users\Admin\Desktop\Project\Claude.md`：纠正项目事实。
  - 认证从 “NextAuth v5” 改为 “MVP 暂不启用真实账号系统”。
  - App 形态从 “Flutter App 版” 改为 “Next.js 网页版/PWA + Capacitor Android App 工程”。
- `app/api/chat/route.ts`：新增 `isAllowedOrigin()`，只允许同源、`NEXT_PUBLIC_SITE_URL` 或 `SITE_URL` 调用聊天 API。
- `app/api/chat/route.ts`：新增 `CHAT_STREAM_TIMEOUT_MS = 30000` 和 `STREAM_TIMEOUT_MESSAGE`，真实模型流式输出超时后返回提示并追加免责声明。
- `tools/validate_data.py`：新增聊天 API Origin 校验、流式超时、公开 AI Key 禁止规则的静态边界检查。
- `tools/smoke_web.ps1`：增强生产烟测稳定性。
  - 用 `.next/BUILD_ID` 判断生产构建是否存在。
  - 默认端口被占用时自动尝试后续端口。

验证：

- `pnpm validate:data` 通过。
- `python -m py_compile tools/validate_data.py tools/monitor_min_wage.py` 通过。
- `pnpm typecheck` 通过。
- `pnpm lint` 通过。
- `pnpm test` 通过，2 个测试文件、31 个用例。
- `pnpm build` 通过，18 条 App Router 路由生成成功。
- `pnpm audit --prod` 通过，无已知漏洞。
- 跨站 POST `/api/chat` 实测返回 403：`Origin: https://evil.example`。
- `pnpm web:smoke` 通过；本轮清理 3004 残留 Next 进程后，默认 3004 端口恢复可用。

