import type { Regulation } from '@/data/types';

const CATEGORY_COLORS: Record<Regulation['category'], string> = {
  劳动报酬: 'bg-emerald-100 text-emerald-700',
  劳动关系: 'bg-blue-100 text-blue-700',
  社会保险: 'bg-purple-100 text-purple-700',
  工伤职业伤害: 'bg-red-100 text-red-700',
  法律援助: 'bg-amber-100 text-amber-700',
  平台规则: 'bg-gray-100 text-gray-700',
};

export default function RegulationCard({ reg }: { reg: Regulation }) {
  const colorClass = CATEGORY_COLORS[reg.category] || 'bg-gray-100 text-gray-700';
  const hasOfficialUrl = Boolean(reg.officialUrl);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* 标题 + 分类标签 */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-gray-900 leading-snug">
          {reg.title}
        </h2>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
          {reg.category}
        </span>
      </div>

      {/* 摘要 */}
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {reg.summary}
      </p>

      {/* 标签 */}
      <div className="mt-2 flex flex-wrap gap-1">
        {reg.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 底部：发布机构 + 日期 */}
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <span>{reg.issuer}</span>
        <span>·</span>
        <span>{reg.publishDate}</span>
      </div>

      {/* 底部：官方链接 + 核验状态 */}
      <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
        {hasOfficialUrl ? (
          <a
            href={reg.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
          >
            查看官方原文
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        ) : (
          <span className="text-sm font-medium text-gray-400">
            官方链接待核实
          </span>
        )}
        <span className="text-xs text-amber-600">
          {reg.lastVerified === '待核实'
            ? '⚠️ 待核实'
            : `✓ ${reg.lastVerified}`}
        </span>
      </div>
    </div>
  );
}
