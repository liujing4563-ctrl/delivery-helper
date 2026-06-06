'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * PWA 安装提示 — 监听 beforeinstallprompt 事件，展示自定义安装横幅
 *
 * 仅在生产环境、支持 PWA 且尚未安装的浏览器中显示。
 * 用户可关闭提示，关闭后本次会话不再弹出（无 localStorage 依赖）。
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<ReturnType<typeof Object> | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 如果已安装为 PWA，不显示提示
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as unknown as Record<string, unknown>);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    const prompt = deferredPrompt as { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed inset-x-0 bottom-16 z-50 mx-auto max-w-lg px-4 md:bottom-4 md:px-6"
    >
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-white p-4 shadow-lg">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">安装骑手权益助手</p>
          <p className="mt-0.5 text-xs text-gray-500">
            添加到主屏幕，离线也能查法规、用计算器
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={handleInstall}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            安装
          </button>
          <button
            onClick={handleDismiss}
            aria-label="关闭安装提示"
            className="rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700"
          >
            稍后
          </button>
        </div>
      </div>
    </div>
  );
}
