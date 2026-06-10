'use client';

import { useEffect } from 'react';

/**
 * Capacitor 原生功能初始化组件。
 * 仅在 Capacitor 环境中生效（APK），网页版自动跳过。
 */
export default function NativeBridge() {
  useEffect(() => {
    if (typeof window === 'undefined' || !(window as unknown as Record<string, unknown>).Capacitor) {
      return;
    }

    async function init() {
      // SplashScreen: 延迟隐藏
      try {
        const { SplashScreen } = await import('@capacitor/splash-screen');
        await SplashScreen.hide({ fadeOutDuration: 300 });
      } catch { /* 非 Capacitor 环境 */ }

      // StatusBar: 设置颜色和样式
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setBackgroundColor({ color: '#0b7a3b' });
        await StatusBar.setStyle({ style: Style.Light });
      } catch { /* 静默忽略 */ }
    }

    init();
  }, []);

  return null;
}
