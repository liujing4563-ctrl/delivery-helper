'use client';

import { useEffect, useState } from 'react';

/**
 * Capacitor 原生功能初始化组件。
 * 仅在 Capacitor 环境中生效（APK），网页版自动跳过。
 */
export default function NativeBridge() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as unknown as Record<string, unknown>).Capacitor) {
      return;
    }

    let networkCleanup: (() => void) | undefined;

    async function init() {
      // SplashScreen: 延迟隐藏
      try {
        const { SplashScreen } = await import('@capacitor/splash-screen');
        await SplashScreen.hide({ fadeOutDuration: 300 });
      } catch { /* 非 Capacitor 环境 */ }

      // StatusBar: 设置颜色和样式
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setBackgroundColor({ color: '#2563eb' });
        await StatusBar.setStyle({ style: Style.Light });
      } catch { /* 静默忽略 */ }

      // Network: 监听网络状态
      try {
        const { Network } = await import('@capacitor/network');
        const status = await Network.getStatus();
        setIsOffline(!status.connected);

        const handler = await Network.addListener('networkStatusChange', (s) => {
          setIsOffline(!s.connected);
        });
        networkCleanup = () => handler.remove();
      } catch { /* 静默忽略 */ }
    }

    init();

    return () => {
      networkCleanup?.();
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[60] bg-amber-500 px-4 py-1.5 text-center text-xs font-medium text-white"
      role="alert"
    >
      当前处于离线状态，AI 聊天功能不可用
    </div>
  );
}
