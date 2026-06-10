'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWA 安装提示 — 监听 beforeinstallprompt 事件，展示自定义安装横幅
 *
 * 在支持 PWA 且尚未安装的浏览器中显示。
 * 用户可关闭提示，关闭后本次会话不再弹出。
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const installBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // 横幅出现时将焦点移至安装按钮
  useEffect(() => {
    if (visible) installBtnRef.current?.focus();
  }, [visible]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
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
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-16 z-50 mx-auto max-w-lg px-4 md:hidden"
    >
      <div className="flex items-start gap-3 rounded-xl border border-[#bfe7cf] bg-white p-4 shadow-lg">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">安装骑手权益助手</p>
          <p className="mt-0.5 text-xs text-gray-600">
            添加到主屏幕，离线也能查法规、用计算器
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            ref={installBtnRef}
            onClick={handleInstall}
            className="rounded-lg bg-[#0b7a3b] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#075f2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7a3b]"
          >
            安装
          </button>
          <button
            onClick={handleDismiss}
            aria-label="关闭安装提示"
            className="rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:text-[#0b7a3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7a3b]"
          >
            稍后
          </button>
        </div>
      </div>
    </div>
  );
}
