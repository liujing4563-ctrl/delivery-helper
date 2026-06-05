# agency-agents 项目审查报告

审查日期：2026-06-05

## 使用的 agency-agents 角色

来源目录：`C:\Users\Admin\Desktop\Project\agency-agents`

- `engineering/engineering-code-reviewer.md`
- `engineering/engineering-frontend-developer.md`
- `engineering/engineering-mobile-app-builder.md`
- `testing/testing-accessibility-auditor.md`
- `testing/testing-reality-checker.md`
- `testing/testing-test-results-analyzer.md`
- `security/security-appsec-engineer.md`
- `product/product-manager.md`
- `support/support-legal-compliance-checker.md`

## 初始审查证据命令

- `pnpm validate:data`：通过
- `pnpm typecheck`：通过
- `pnpm lint`：通过
- `pnpm build`：通过，19 条 App Router 路由生成成功
- `pnpm app:doctor`：通过，Capacitor 8.4.0 Android 工程配置正常
- `pnpm audit --prod`：未通过，发现 1 个 moderate、1 个 low 依赖漏洞
- `.\android\gradlew.bat -p android assembleDebug`：未通过，失败原因是本机缺 `JAVA_HOME` / `java`
- `git diff --check`：通过

## 2026-06-06 修复复核

已修复：

- 账号边界统一为 MVP 暂不启用真实账号；`@auth/core`、`next-auth`、`resend` 已从生产依赖移除。
- `pnpm audit --prod` 已通过；`postcss` 通过 `pnpm-workspace.yaml` override 固定到 `8.5.15`。
- Android `allowBackup` 已改为 `false`，并纳入 `tools/validate_data.py` 校验。
- 法援和法规筛选控件已从不完整 tab 语义改为普通 button + `aria-pressed`。
- `tools/validate_data.py` 已加入筛选控件可访问性回归闸门，禁止回退到不完整 tab 语义。
- AI 真实模型流式回答已由服务端接管 `result.textStream`，缺少免责声明时后置追加固定声明。
- SEO 站点 URL 已改为 `lib/site.ts` 统一读取 `NEXT_PUBLIC_SITE_URL` / `SITE_URL`，部署说明同步更新。
- `/api/auth/[...nextauth]` 仍保留为 501 占位 API，并已纳入校验，防止半套认证回归。

复核命令：

- `python -m py_compile tools/validate_data.py tools/monitor_min_wage.py`：通过
- `pnpm validate:data`：通过
- `pnpm typecheck`：通过
- `pnpm lint`：通过
- `pnpm test`：通过，1 个测试文件、19 个用例
- `pnpm build`：通过，19 条 App Router 路由生成成功
- `pnpm audit --prod`：通过，无已知漏洞
- `pnpm why postcss`：仅剩 `postcss@8.5.15`
- `pnpm app:doctor`：通过
- `.\android\gradlew.bat assembleDebug`：仍未通过，原因是本机缺 `JAVA_HOME` / `java`
- `git diff --check`：通过，仅有 Windows CRLF 提示

## 总体判断

当前项目已经具备两个交付形态：

- 网页版：Next.js 16 应用，可构建、可运行。
- Android App 工程：Capacitor 原生工程已生成，配置和同步脚本可用。

本轮修复后，网页版主链路、依赖审计和边界校验已经收口；仍不能称为完整生产就绪。剩余原因是 Android APK 尚未能在本机打包，发布版 App 还需要在正式 HTTPS 域名下重新同步并验证。

## 发现的问题

以下为 2026-06-05 初始审查发现；当前修复状态以上方“2026-06-06 修复复核”为准。

### P1 文档声称真实账号已完成，但代码明确禁用真实账号

证据：

- `README.md:35` 写“用户登录：NextAuth v5 邮箱魔法链接，纯 JWT 无数据库，✅”。
- `README.md:50` 写认证栈为 `NextAuth v5 + Resend`。
- `.env.example:10-19` 提供 NextAuth / Resend 邮件登录配置。
- `app/api/auth/[...nextauth]/route.ts:1-11` 实际对 GET/POST 返回 501，占位说明 MVP 不启用真实账号。
- `app/login/page.tsx:8`、`app/privacy/page.tsx:10` 也说明不启用真实账号、不收集邮箱手机号密码。

影响：

- 产品、隐私和部署说明互相矛盾。
- 用户或部署者可能以为账号登录已经完成，实际访问认证 API 会得到 501。
- 安全审计中 `@auth/core` / `next-auth` 也继续引入依赖风险。

建议：

- 如果当前仍保持 MVP 无账号：把 README 和 `.env.example` 回退到账号占位说明，并删除或后续清理未使用认证依赖。
- 如果要做真实账号：需要补完整 NextAuth 邮件登录实现、隐私说明、账户删除、邮件发送和端到端验证。

### P1 依赖安全审计未通过

证据：

- `pnpm audit --prod` 报告 `postcss <8.5.10` moderate XSS，路径包括 `.>next>postcss` 和 `.>next-auth>next>postcss`。
- 同一审计报告还发现 `cookie <0.7.0` low，路径为 `.>@auth/core>cookie`。
- `package.json:20`、`package.json:25` 仍包含 `@auth/core` 和 `next-auth`。

影响：

- AppSec 维度不能标记为 clean。
- 其中 `cookie` 风险来自当前业务未启用的认证依赖，属于可清理风险。

建议：

- 先统一账号边界。
- 若继续禁用账号，优先移除 `@auth/core`、`next-auth`、`resend` 并复跑 `pnpm audit --prod`。
- 对 `postcss` 风险，确认是否有 Next.js 可升级版本或可用 overrides；不要盲目改锁文件。

### P1 Android App 工程已生成，但 APK 尚未可构建

证据：

- `pnpm app:doctor` 通过。
- `android/app/build.gradle:4` 和 `android/app/build.gradle:7` 的 namespace/applicationId 为 `com.deliveryhelper.rider`。
- `.\android\gradlew.bat -p android assembleDebug` 失败：`JAVA_HOME is not set and no 'java' command could be found in your PATH`。
- `docs/native-app.md:64-85` 已记录缺 `java`、`ANDROID_HOME`、`ANDROID_SDK_ROOT`。

影响：

- 当前是“Android 原生工程完成”，还不是“APK 已产出”。
- 不能把 App 版视为发布可用。

建议：

- 安装 JDK 17+ 和 Android Studio / Android SDK。
- 设置 `JAVA_HOME`、`ANDROID_HOME` 或 `ANDROID_SDK_ROOT`。
- 再跑 `pnpm app:doctor` 和 `.\android\gradlew.bat -p android assembleDebug`。

### P1 当前同步到 Android 的配置是本地调试 URL，不是发布配置

证据：

- `android/app/src/main/assets/capacitor.config.json:9-10` 当前为 `http://10.0.2.2:3000` 且 `cleartext: true`。
- `capacitor.config.ts:12-20` 允许本地调试地址启用 cleartext。

影响：

- 如果直接打包并分发，App 会尝试加载 Android 模拟器访问宿主机的开发地址，不会加载正式网站。
- 发布版 App 还没有完成 HTTPS 域名同步验证。

建议：

- 发布前用正式 HTTPS 域名执行：
  `powershell -ExecutionPolicy Bypass -File tools/sync_android_app.ps1 -Url "https://正式域名"`
- 复查生成后的 `android/app/src/main/assets/capacitor.config.json`，确保 `url` 为 HTTPS，且不需要 cleartext。

### P2 Android 默认允许备份，需要发布前确认

证据：

- `android/app/src/main/AndroidManifest.xml:5` 为 `android:allowBackup="true"`。

影响：

- 目前业务主要用网页和 localStorage，移动端后续可能保存计算器输入或 WebView 状态。
- 发布版如继续允许备份，需要明确隐私边界；否则建议关闭。

建议：

- 发布前评估并改为 `android:allowBackup="false"`，或提供明确的数据备份说明。

### P2 筛选控件使用 tab 角色，但没有实现完整键盘模式

证据：

- `app/legal-aid/page.tsx:68-85` 使用 `role="tablist"` / `role="tab"` / `aria-selected`。
- `app/regulations/page.tsx:56-73` 使用同样模式。
- 本地搜索未发现 `onKeyDown` 或 `tabIndex`。

影响：

- Accessibility Auditor 维度下，ARIA tab 模式应支持方向键等键盘交互。
- 当前更像“筛选 chip/segmented control”，用 tab 语义会提高屏幕阅读器预期，但实现不完整。

建议：

- 简化：移除 `role="tablist"` / `role="tab"`，保留 button + `aria-pressed`。
- 或补完整 tab 键盘行为和面板关联。

### P2 AI 真实模型回答的免责声明只靠提示词和 UI 兜底

证据：

- `data/prompts.ts:14`、`data/prompts.ts:31-39` 要求免责声明。
- `app/api/chat/route.ts:48-49` 明确“流式输出暂不做后置追加，前端 UI 已固定展示 DisclaimerBox 作为兜底保障”。
- `app/api/chat/route.ts:108` 直接返回 `result.toTextStreamResponse()`。
- mock 回答在 `app/api/chat/route.ts:145` 有硬编码免责声明。

影响：

- mock 模式合规边界强；真实模型模式仍可能不按提示词输出免责声明。
- 对法律信息助手，建议服务端后置兜底比只靠 prompt 更稳。

建议：

- 流式完成后追加固定免责声明，或改用可控格式流并在服务端保证尾部声明。
- 保留前端 `DisclaimerBox`，但不要把它当作唯一兜底。

### P2 SEO 域名硬编码，部署到其他域名后容易错

证据：

- `app/layout.tsx:9` metadataBase 固定为 `https://delivery-helper.vercel.app`。
- `app/sitemap.ts:3`、`app/robots.ts:3` 固定 `BASE_URL`。

影响：

- 如果最终部署域名不同，sitemap、robots、OpenGraph 绝对 URL 会不一致。

建议：

- 用环境变量 `NEXT_PUBLIC_SITE_URL` 或 `SITE_URL` 注入。
- `validate_data.py` 增加站点 URL 边界检查。

## 正向发现

- `pnpm validate:data` 已覆盖静态数据、账号边界、PWA、AI、SEO 和原生 App 基础边界。
- AI API 有请求体大小、消息长度、角色过滤、总上下文长度、服务端 API key、输出 token 限制。
- 所有已检出的 `target="_blank"` 外部链接均带 `rel="noopener noreferrer"`。
- Capacitor Android 的 appId、应用名、MainActivity 包名和 Gradle applicationId 基本一致。
- 网页版构建稳定，19 条路由全部生成成功。

## 建议修复顺序

1. 安装 JDK / Android SDK，打出 debug APK。
2. 用 HTTPS 正式域名重新同步 Android App 配置。
3. 对筛选控件做一次键盘和屏幕阅读器抽查。
4. 如要启用真实账号，重新做完整认证方案、隐私说明、账户删除和端到端验证；不要半接入。
5. 部署前设置 `NEXT_PUBLIC_SITE_URL` / `SITE_URL`，并复跑 `build`、`audit`、`validate:data`。
