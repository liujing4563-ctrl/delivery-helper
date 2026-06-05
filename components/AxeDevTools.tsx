'use client';

import { useEffect } from 'react';

/**
 * 仅在开发模式下启用 axe-core 运行时无障碍检测。
 * 违规信息会输出到浏览器控制台，不影响生产构建。
 */
export default function AxeDevTools() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    Promise.all([
      import('@axe-core/react'),
      import('react'),
      import('react-dom'),
    ])
      .then(([axe, React, ReactDOM]) => {
        axe.default(React, ReactDOM, 1000);
      })
      .catch(() => {
        // axe-core 加载失败不影响应用运行
      });
  }, []);

  return null;
}
