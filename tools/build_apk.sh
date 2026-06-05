#!/usr/bin/env bash
# 骑手权益助手 APK 打包脚本
# 用法: bash tools/build_apk.sh
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
JAVA_HOME="${JAVA_HOME:-$PROJECT_ROOT/../jdk21/jdk-21.0.11+10}"
ANDROID_HOME="${ANDROID_HOME:-$PROJECT_ROOT/../android-sdk}"

export JAVA_HOME
export ANDROID_HOME
export PATH="$JAVA_HOME/bin:$PATH"

echo "=== 骑手权益助手 APK 打包 ==="
echo "JAVA_HOME: $JAVA_HOME"
echo "ANDROID_HOME: $ANDROID_HOME"
echo ""

# 1. 验证 Java
echo ">>> 验证 JDK..."
java -version

# 2. 静态导出 Next.js
echo ""
echo ">>> 构建静态导出..."
cd "$PROJECT_ROOT"
BUILD_MODE=static NEXT_PUBLIC_API_BASE_URL=https://delivery-helper.vercel.app npx next build

# 3. 同步到 Capacitor
echo ""
echo ">>> 同步到 Capacitor..."
BUILD_MODE=static npx cap sync android

# 4. 构建 APK
echo ""
echo ">>> 构建 debug APK..."
cd android
./gradlew assembleDebug

# 5. 复制 APK 到项目根目录
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
OUTPUT="$PROJECT_ROOT/骑手权益助手-v1.0-debug.apk"
cp "$APK_PATH" "$OUTPUT"

echo ""
echo "=== 打包完成 ==="
echo "APK 位置: $OUTPUT"
ls -lh "$OUTPUT"
