import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl">📡</div>
      <h1 className="mt-4 text-xl font-bold text-gray-900">当前无网络连接</h1>
      <p className="mt-2 text-sm text-gray-500">
        请检查网络设置后重试。部分已缓存的页面仍可使用，但数据可能已过期。
        联网后请以页面来源链接为准。
      </p>
      <div className="mt-6 space-y-3">
        <Link
          href="/"
          className="block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white"
        >
          返回首页
        </Link>
        <Link
          href="/calculator"
          className="block rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700"
        >
          薪资计算器（离线可用）
        </Link>
        <Link
          href="/regulations"
          className="block rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700"
        >
          法规库（缓存后可读）
        </Link>
        <Link
          href="/legal-aid"
          className="block rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700"
        >
          法援目录（缓存后可读）
        </Link>
      </div>
      <p className="mt-6 text-xs text-gray-400">
        骑手权益助手 · 公益项目
      </p>
    </div>
  );
}
