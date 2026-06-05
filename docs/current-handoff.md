# 当前项目交接记录

更新日期：2026-06-05

## 项目位置

- 工作区：`C:\Users\Admin\Desktop\Project`
- 主项目：`C:\Users\Admin\Desktop\Project\delivery-helper`
- 技术栈：Next.js 16 App Router + TypeScript + Tailwind CSS 4 + Vercel AI SDK + Capacitor 8
- 当前产品定位：公益型外卖骑手劳动权益信息助手，核心功能无需登录。

## 当前已完成状态

- 薪资计算器：可计算毛收入、净收入、时薪和最低工资参考风险；`lastVerified="待核实"` 的城市不参与红黄绿风险判断；分档最低工资城市会展示适用范围说明。
- 法规库：10 条核心法规均有官方来源和核验时间。
- 法援目录：上海 17 个法律援助中心电话、地址、接待时间已补齐并核验。
- AI 权益助手：服务端流式问答已接入，定位为“AI 骑手权益信息助手”，不是律师；已限制请求体、角色、历史长度、输出长度和敏感信息边界。
- 账号系统：MVP 阶段不启用真实账号；登录、账户和删除账户页面均为占位/本地数据管理说明。
- PWA：已有 manifest、图标和手写 Service Worker；当前只做基础离线页，不引入 Serwist / Workbox。
- SEO：已有 `app/sitemap.ts`、`app/robots.ts`、`metadataBase`、站点标题/描述/关键词和 OpenGraph 基础元数据。
- 网页版：移动端继续保留底部导航和 App/PWA 体验；桌面端新增顶部导航和宽屏内容容器，首页问题卡片/工具卡片在桌面端按多列展示。
- 原生 App 版：已新增 Capacitor Android 工程 `android/`，应用名“骑手权益助手”，包名 `com.deliveryhelper.rider`；本机当前缺 JDK / Android SDK，尚未生成 APK。
- 本地校验：`tools/validate_data.py` 已覆盖静态数据、账号边界、PWA 边界、AI 问答边界、SEO 边界和上海法援完整性。

## 最近完成的十轮

### 第二十轮

- 补齐上海剩余 9 个区级法律援助中心地址和接待时间：
  - 黄浦、静安、长宁、虹口、杨浦、闵行、青浦、奉贤、金山。
- 来源为上海一网通办“对公民提供法律援助”事项页：
  - `https://zwdt.sh.gov.cn/govPortals/bsfw/item/ee293aeb-c5ca-4392-adc6-333dc7685e74`
- `README.md` 数据状态已更新为：
  - 法援中心电话：17 条已核验、0 条待核实。
  - 法援中心地址/时间：17 条已核验、0 条待核实。
- `docs/source-and-tooling-notes.md` 已记录 16 个区级法援办理地点/时间核验结论。

### 第二十一轮

- `tools/validate_data.py` 新增上海法援完整性校验：
  - 上海法律援助中心必须保持 17 条。
  - 上海法律援助中心电话必须保持 17 个。
  - 上海法律援助中心地址/接待时间必须保持 17 个。
  - 上海法律援助中心不得回退为 `待核实`。
- `.gitignore` 新增：
  - `/.playwright-cli/`
  - `.tmp-dev-*.log`
- `prompts-log.md` 已记录第二十、第二十一轮修复和验证结果。

### 第二十二轮

- `data/minWage.ts` 更新武汉最低工资为 2025-12-01 起一档参考标准：月最低工资 2400 元、小时最低工资 24 元，来源为武汉市人民政府门户网站转载的湖北省政府办公厅通知。
- `data/types.ts` 为最低工资数据增加 `scopeNote` 可选字段。
- `components/CalculatorForm.tsx` 在城市说明和复制结果中展示最低工资适用范围/说明。
- 对成都、武汉、重庆、郑州、西安、合肥等存在分档或仍需区县核准的数据补充说明，避免把主城区参考档误呈现为全市统一标准。

### 第二十三轮

- 继续联网评估外部 agent、skill、MCP、来源项目和资料；结论仍是不下载第三方 agent / MCP 代码，当前收益不如官方资料核验。
- 重新检索成都最低工资来源，查到成府规〔2025〕4号转载原文和成都住房公积金管理中心对该文件的官方引用。
- 当时因成都市政府原通知页面仍未能直接读取，成都保持 `lastVerified="待核实"`，但 `scopeNote` 补充了第一档/第二档区县范围线索；当前状态见第二十六轮。

### 第二十四轮

- `public/sw.js` 升级缓存版本为 `delivery-helper-v2`，预缓存 `manifest.json` 和 192/512 图标。
- Service Worker 新增同源请求限制，避免误处理外部资源。
- `/offline` 离线页增加法规库、法援目录入口，和当前预缓存页面保持一致。
- `tools/validate_data.py` 增加 PWA 关键资源预缓存和同源边界校验。

### 第二十五轮

- `docs/current-handoff.md` 修正最近完成轮次数量，并更新 PWA/成都来源/模板 SVG 清理边界。
- `components/ServiceWorkerRegistrar.tsx` 移除生产环境注册成功日志，注册失败按渐进增强静默处理。
- 生产服务抽查 `/offline` 和 `/calculator`：页面可加载，manifest 存在，控制台无 `log/warn/error`。

### 第二十六轮

- `data/minWage.ts` 已将成都切换为成都市人民政府官方直链，`lastVerified` 更新为 `2026-06-05`，15 个最低工资城市均通过结构校验。
- 新增 `app/sitemap.ts`、`app/robots.ts`，并增强 `app/layout.tsx` 元数据。
- 注意：本环境直接请求成都政府 URL 返回 `412 Precondition Failed`，建议后续用人工浏览器复核留痕；当前自动校验只做结构和域名边界检查，不做联网内容判断。

### 第二十七轮

- 复评 MCP、OpenAI Agents SDK、Vercel AI SDK 6 和 Next.js PWA 官方资料；当前仍不下载第三方 agent / skill / MCP 代码。
- `components/CalculatorForm.tsx` 补上 `storageReady` 保存闸门，避免 localStorage 恢复前把默认值写回本地存储。
- `docs/source-and-tooling-notes.md`、`docs/external-resource-review.md`、`docs/review-2026-06-05-round2.md` 同步外部资源复评和当前状态边界。

### 第二十八轮

- 明确当前项目是 Next.js Web App/PWA，原 UI 偏手机 App 形态。
- 新增 `components/DesktopNav.tsx`，桌面端使用顶部导航；`components/BottomNav.tsx` 保留为移动端底部导航。
- `app/layout.tsx` 将桌面主内容扩展为宽屏容器；`app/page.tsx` 为首页 hero、问题卡片和工具卡片补齐桌面多列布局。
- `tools/validate_data.py` 新增 SEO 边界校验，并兼容当前聊天 API 的 `msg.role` 角色过滤写法。

### 第二十九轮

- 按用户要求把“真正网页版本 + 真正 App 版本”拆成两个交付形态：Next.js 负责网页，Capacitor 负责 Android 原生容器。
- 安装 `@capacitor/core`、`@capacitor/android`、`@capacitor/cli`，新增 `capacitor.config.ts`、`native-shell/index.html` 和 `android/` 原生工程。
- 新增 `tools/sync_android_app.ps1` 和 `pnpm app:sync:android:dev`，默认把 Android 调试 App 指向 `http://10.0.2.2:3000`。
- 已修正 Capacitor 模板测试里的默认包名，避免继续引用 `com.getcapacitor.myapp`。
- 本机未检测到 `java`、`ANDROID_HOME`、`ANDROID_SDK_ROOT`；`.\android\gradlew.bat -p android assembleDebug` 实测失败于 `JAVA_HOME is not set`，因此 APK 打包需要先安装 JDK 与 Android Studio / Android SDK。

## 已通过验证

最近一次完整验证结果：

- `pnpm --dir "delivery-helper" validate:data` 通过。
- `python -m py_compile "tools/validate_data.py" "tools/monitor_min_wage.py"` 通过。
- `pnpm --dir "delivery-helper" typecheck` 通过。
- `pnpm --dir "delivery-helper" lint` 通过。
- `pnpm --dir "delivery-helper" build` 通过，19 条路由生成成功。
- 首页响应抽查 `http://localhost:3000/`：HTML 包含“骑手权益助手”“桌面主导航”“薪资测算”“法援目录”“权益动态”。
- Browser 插件本轮连接超时两次，未取得桌面截图；已用 HTML 响应和源码断言确认桌面导航、移动端 `md:hidden` 底部导航、宽屏容器和首页多列布局已落地。
- `pnpm app:sync:android:dev` 通过，Android 调试配置已同步到 `http://10.0.2.2:3000`。
- `pnpm app:doctor` 通过，Capacitor 8.4.0 依赖和 Android 工程配置正常。
- Android 原生工程关键文件已检查：`android/app/build.gradle` 的 namespace/applicationId 为 `com.deliveryhelper.rider`，`strings.xml` 应用名为“骑手权益助手”。
- `.\android\gradlew.bat -p android assembleDebug` 未通过，失败原因是本机缺 `JAVA_HOME` / `java`，尚未生成 APK。
- 生产服务抽查 `http://localhost:3002/offline`：页面可加载，manifest 存在，首页/薪资计算器/法规库/法援目录入口可见，控制台无 `log/warn/error`。
- 生产服务抽查 `http://localhost:3002/calculator`：页面可加载，manifest 存在，城市选择可见，控制台无 `log/warn/error`。
- Browser 只读页面作用域未暴露 `navigator`，本轮未直接读取 Service Worker registration/caches；后续如要验证缓存命中，可用完整 Playwright CLI 或浏览器 DevTools 做专项检查。
- 浏览器抽查 `/calculator`：页面可加载，城市选择可见，控制台无错误。当前 Browser 自动化对原生下拉框选项切换不可靠，未把该交互作为失败依据。
- 浏览器抽查 `/legal-aid`：显示 17 个上海法律援助中心电话、17 个地址/接待时间；黄浦、静安、奉贤地址可见；控制台无错误。

## 重要边界和不要做的事

- 不要在用户未明确要求时执行 `git commit`、`git push`、`git reset` 或创建分支。
- 不要把“继续”理解为包管理清理确认。
- 旧认证依赖仍存在于 `package.json` / `pnpm-lock.yaml`：
  - `@auth/core`
  - `next-auth`
  - `resend`
- 清理旧认证依赖属于包管理变更，只有用户明确说 `确认清理旧认证依赖` 后才执行。
- 不要引入额外 agent、skill、MCP 或来源项目；当前判断是 MVP 不需要，且会增加权限和维护成本。
- 法规、最低工资、法援数据只允许使用可核验官方来源；不得用未核验资料驱动风险判断。
- 成都最低工资当前使用成都市人民政府官方直链并已通过结构校验；但本环境直接抓取该链接返回 `412 Precondition Failed`，如要做更严格证据链，需人工浏览器复核原文并留痕。

## 当前工作区注意事项

- 当前 `git status --short --untracked-files=all` 显示 `.env.example`、`README.md` 有未提交改动；这两处偏向真实账号/邮件配置说明，和交接文档里的 MVP 账号占位边界存在不一致，后续应先确认账号边界再改文档或实现。
- 本轮不要擅自回滚 `.env.example`、`README.md` 的外部改动；如要统一账号文档和代码，需要单独审阅。
- 最近变更集中在：
  - `tools/validate_data.py`
  - `docs/current-handoff.md`
  - `prompts-log.md`
  - `app/layout.tsx`
  - `app/page.tsx`
  - `components/DesktopNav.tsx`
  - `components/BottomNav.tsx`
  - `capacitor.config.ts`
  - `native-shell/index.html`
  - `android/`
  - `tools/sync_android_app.ps1`
  - `docs/native-app.md`

## 下一步建议

1. 优先做非包管理、低风险改进：同步文档和真实代码状态后，继续跑 `validate:data`、`typecheck`、`lint`、`build`。
2. 原生 App 下一步需要安装 JDK 与 Android Studio / Android SDK，然后运行 `pnpm app:doctor` 和 Android debug APK 构建。
3. PWA 如需继续深化，下一步应专项验证 Service Worker registration/caches 和正式图标显示；不要在未确认前引入 Serwist / Workbox。
4. 成都最低工资如要形成更强证据链，建议人工浏览器打开成都市政府原文并保存核验留痕。
5. 默认 Next.js 模板 SVG 资源疑似未使用，但删除属于文件系统变更；只有用户明确确认后再清理。
6. 如要清理旧认证依赖，先让用户明确输入 `确认清理旧认证依赖`，再改 `package.json` 和锁文件。
7. 如要提交代码，先让用户明确要求提交；提交前重新运行 `validate:data`、`typecheck`、`lint`、`build`。
