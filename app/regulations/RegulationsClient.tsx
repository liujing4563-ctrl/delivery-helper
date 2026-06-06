'use client';

import { useState } from 'react';
import { regulations } from '@/data/regulations';
import type { Regulation } from '@/data/types';
import RegulationCard from '@/components/RegulationCard';

const ALL_CATEGORIES: Regulation['category'][] = [
  '劳动报酬',
  '劳动关系',
  '社会保险',
  '工伤职业伤害',
  '法律援助',
  '平台规则',
];

export default function RegulationsClient() {
  const [selectedCategory, setSelectedCategory] = useState<Regulation['category'] | 'all'>('all');

  const filtered = selectedCategory === 'all'
    ? regulations
    : regulations.filter((reg) => reg.category === selectedCategory);

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-bold text-gray-900">法规与政策库</h1>
      <p className="mt-1 text-sm text-gray-500">
        与外卖骑手劳动权益相关的法规和政策
      </p>

      {/* 分类筛选 */}
      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide" aria-label="法规分类">
        <button
          aria-pressed={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            aria-pressed={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 法规列表 */}
      <div className="mt-4 space-y-3">
        {filtered.length > 0 ? (
          filtered.map((reg) => (
            <RegulationCard key={reg.id} reg={reg} />
          ))
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            没有找到匹配的法规
          </div>
        )}
      </div>

      {/* 数据来源说明 */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        法规摘要由本站整理，具体内容以官方原文为准。
        每条法规均附有官方链接，请点击“查看官方原文”阅读完整内容。
      </p>
    </div>
  );
}
