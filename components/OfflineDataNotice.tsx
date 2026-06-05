'use client';

import { useEffect, useState } from 'react';

export default function OfflineDataNotice() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const updateOnlineState = () => {
      setIsOffline(!navigator.onLine);
    };

    updateOnlineState();
    window.addEventListener('online', updateOnlineState);
    window.addEventListener('offline', updateOnlineState);

    return () => {
      window.removeEventListener('online', updateOnlineState);
      window.removeEventListener('offline', updateOnlineState);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium leading-5 text-amber-900"
    >
      当前处于离线状态，页面内容可能来自缓存，法规、最低工资和法援信息可能已过期；联网后请以页面来源链接为准。
    </div>
  );
}
