# 网页版与原生 App 版本说明

更新日期：2026-06-05

## 当前结论

项目现在拆成两个交付形态：

- 网页版：当前 Next.js 应用，支持桌面宽屏网页和移动端网页访问。
- 原生 App 版：新增 Capacitor Android 工程，目录为 `android/`，包名为 `com.deliveryhelper.rider`，应用名为“骑手权益助手”。

这不是两套业务代码。业务功能仍由 Next.js 网页应用承载，Android App 通过 Capacitor 原生容器加载网页版本。这样能最快得到可安装的 App 工程，同时避免重新写一套 React Native UI。

## 为什么采用 Capacitor

Capacitor 官方支持把已有现代 Web 项目接入原生 App 工程；接入条件包括 `package.json`、构建后的 Web 资源目录和入口 `index.html`。当前项目有服务端 API 和流式 AI 路由，不适合直接把整个 Next.js 应用静态导出，所以本轮采用 Capacitor Android 容器 + 已部署网页 URL 的方式。

参考：

- Capacitor Getting Started: https://capacitorjs.com/docs/getting-started
- Capacitor Config: https://capacitorjs.com/docs/config
- Capacitor Android: https://capacitorjs.com/docs/android

## 已落地文件

- `capacitor.config.ts`：Capacitor 配置，读取 `CAPACITOR_SERVER_URL`。
- `native-shell/index.html`：App 壳的占位页面，未配置 URL 时显示提示。
- `android/`：Capacitor 生成的 Android 原生工程。
- `tools/sync_android_app.ps1`：按 URL 同步 Android App 配置。
- `package.json`：新增 Capacitor 依赖和 App 脚本。

## 本地开发运行

先启动网页版本：

```powershell
pnpm dev
```

再同步 Android 调试 App 配置：

```powershell
pnpm app:sync:android:dev
```

默认调试地址是 `http://10.0.2.2:3000`，这是 Android 模拟器访问宿主机 `localhost:3000` 的地址。

如果要指向局域网真机测试地址：

```powershell
powershell -ExecutionPolicy Bypass -File tools/sync_android_app.ps1 -Url "http://192.168.x.x:3000"
```

如果要指向部署后的正式网页：

```powershell
powershell -ExecutionPolicy Bypass -File tools/sync_android_app.ps1 -Url "https://your-domain.example"
```

## Android 打包前置条件

当前机器尚未检测到：

- `java`
- `ANDROID_HOME`
- `ANDROID_SDK_ROOT`

因此本轮已经生成 Android 原生工程，但还不能在这台机器上直接打包 APK。下一步需要安装 JDK 和 Android Studio / Android SDK，然后执行：

```powershell
pnpm app:doctor
pnpm app:open:android
```

或在命令行构建 debug APK：

```powershell
cd android
.\gradlew.bat assembleDebug
```

本轮实测 `.\android\gradlew.bat -p android assembleDebug` 失败原因：

```text
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
```

## 重要边界

- 当前 App 版是 Capacitor 原生容器，不是 React Native 重写版。
- 开发调试时可以加载 `http://10.0.2.2:3000`。
- 正式发布时应指向 HTTPS 域名；如果要上架应用商店，需要再评估远程网页容器策略、隐私合规、图标、启动图和原生权限声明。
- iOS App 需要 macOS + Xcode；当前 Windows 环境只能先落 Android 工程。
