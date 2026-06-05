import type { LegalAidCenter } from '@/data/types';

const TYPE_COLORS: Record<LegalAidCenter['type'], string> = {
  法律援助中心: 'bg-green-100 text-green-700',
  公共法律服务中心: 'bg-blue-100 text-blue-700',
  正规律所查询入口: 'bg-purple-100 text-purple-700',
};

export default function LegalAidCard({ center }: { center: LegalAidCenter }) {
  const colorClass = TYPE_COLORS[center.type] || 'bg-gray-100 text-gray-700';
  const hasSourceUrl = Boolean(center.sourceUrl);
  const isVerified = center.lastVerified !== '待核实';
  const verificationClass = isVerified ? 'text-green-600' : 'text-amber-600';
  const verificationLabel =
    !isVerified
      ? '⚠️ 待核实'
      : center.address || center.hours
        ? `✓ ${center.lastVerified}`
        : `✓ 电话 ${center.lastVerified}`;
  const telHref = center.phone ? center.phone.replace(/[^\d+]/g, '') : '';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* 名称 + 类型标签 */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-gray-900">
          {center.name}
        </h2>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
          {center.type}
        </span>
      </div>

      {/* 详细信息 */}
      <div className="mt-3 space-y-1.5 text-sm">
        {center.address && (
          <p className="flex items-center gap-1.5 text-gray-600">
            <span className="text-base" aria-hidden="true">📍</span>
            <span>{center.city} {center.district} {center.address}</span>
          </p>
        )}
        {center.phone && (
          <p className="flex items-center gap-1.5">
            <span className="text-base" aria-hidden="true">📞</span>
            <a
              href={`tel:${telHref}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {center.phone}
            </a>
            <span className="text-xs text-gray-400">（点击拨号）</span>
          </p>
        )}
        {center.hours && (
          <p className="flex items-center gap-1.5 text-gray-600">
            <span className="text-base" aria-hidden="true">🕐</span>
            <span>{center.hours}</span>
          </p>
        )}
        {center.type === '正规律所查询入口' && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-2 text-xs text-purple-700">
            本站不推荐具体律所。请通过以下官方渠道查询正规律师和律所：
            <a
              href={center.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block font-medium text-purple-800 hover:underline"
            >
              {center.sourceName} →
            </a>
          </div>
        )}
      </div>

      {/* 底部：来源链接 + 核验状态 */}
      {center.type !== '正规律所查询入口' && (
        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
          {hasSourceUrl ? (
            <a
              href={center.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            >
              查看来源
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          ) : (
            <span className="text-sm font-medium text-gray-400">
              来源待核实
            </span>
          )}
          <span className={`text-xs ${verificationClass}`}>
            {verificationLabel}
          </span>
        </div>
      )}
    </div>
  );
}
