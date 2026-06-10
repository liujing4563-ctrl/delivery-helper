'use client';

import { useMemo, useState } from 'react';
import { regulations } from '@/data/regulations';
import type { Regulation } from '@/data/types';

const categories: (Regulation['category'] | '全部类别')[] = [
  '全部类别',
  '劳动报酬',
  '劳动关系',
  '社会保险',
  '工伤职业伤害',
  '法律援助',
  '平台规则',
];

const levelFilters = [
  ['国家法律', 19],
  ['行政法规', 25],
  ['部门规章', 48],
  ['地方性法规', 62],
  ['政策文件', 76],
] as const;

const sceneFilters = [
  ['被扣钱/少发', 48],
  ['未签合同/关系认定', 41],
  ['社保与保障', 33],
  ['工伤事故', 28],
  ['平台处罚/封号', 26],
  ['申诉与法律援助', 31],
] as const;

function SearchIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

function ShieldIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3 5 6v5c0 4.6 2.9 8.6 7 10 4.1-1.4 7-5.4 7-10V6z" strokeLinejoin="round" />
      <path d="m8.5 12 2.2 2.2 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SideCheckbox({
  label,
  count,
  checked,
}: {
  label: string;
  count: number;
  checked?: boolean;
}) {
  return (
    <div className={`flex h-9 items-center justify-between rounded-lg px-3 text-sm ${checked ? 'bg-[#e8f6ee] font-bold text-[#0b7a3b]' : 'text-[#344054]'}`}>
      <span className="flex items-center gap-2">
        <span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? 'border-[#0b7a3b] bg-[#0b7a3b] text-white' : 'border-[#cfd8cf]'}`}>
          {checked ? '✓' : ''}
        </span>
        {label}
      </span>
      <span className="text-[#667085]">{count}</span>
    </div>
  );
}

function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-lg border px-4 text-sm font-bold ${
        active ? 'border-[#0b7a3b] bg-[#0b7a3b] text-white' : 'border-[#eadfce] bg-white text-[#344054]'
      }`}
    >
      {children}
    </button>
  );
}

export default function RegulationsClient() {
  const [selectedCategory, setSelectedCategory] = useState<Regulation['category'] | '全部类别'>('全部类别');

  const filtered = useMemo(
    () =>
      selectedCategory === '全部类别'
        ? regulations
        : regulations.filter((reg) => reg.category === selectedCategory),
    [selectedCategory]
  );

  const shown = filtered.slice(0, 4);

  return (
    <div className="py-6 md:py-7">
      <div className="mb-5 text-sm text-[#667085]">首页  ›  法规库</div>
      <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
        <aside className="rounded-2xl border border-[#eadfce] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#111827]">筛选条件</h2>
            <button className="text-xs text-[#98a2b3]">清空</button>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-bold text-[#344054]">关键词搜索</h3>
            <div className="mt-3 flex h-10 items-center gap-2 rounded-lg border border-[#d8dee8] px-3">
              <input className="min-w-0 flex-1 text-sm outline-none placeholder:text-[#98a2b3]" placeholder="输入法规名称或关键词" />
              <SearchIcon />
            </div>
          </div>

          <FilterGroup title="法规类别">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`flex h-9 w-full items-center justify-between rounded-lg px-3 text-sm ${
                  selectedCategory === category ? 'bg-[#e8f6ee] font-bold text-[#0b7a3b]' : 'text-[#344054]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`flex h-4 w-4 items-center justify-center rounded border ${selectedCategory === category ? 'border-[#0b7a3b] bg-[#0b7a3b] text-white' : 'border-[#cfd8cf]'}`}>
                    {selectedCategory === category ? '✓' : ''}
                  </span>
                  {category}
                </span>
                <span className="text-[#667085]">{index === 0 ? regulations.length : 12 + index * 3}</span>
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="发布层级">
            {levelFilters.map(([label, count]) => (
              <SideCheckbox key={label} label={label} count={count} />
            ))}
          </FilterGroup>

          <FilterGroup title="适用场景">
            {sceneFilters.map(([label, count]) => (
              <SideCheckbox key={label} label={label} count={count} />
            ))}
            <button className="mt-2 text-sm font-bold text-[#0b7a3b]">展开更多 ›</button>
          </FilterGroup>
        </aside>

        <main>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-normal text-[#0b301b]">法规与政策库</h1>
              <p className="mt-3 text-base text-[#475467]">汇集与骑手权益相关的法规、政策与平台规则，来源权威，持续更新。</p>
            </div>
            <div className="pt-3 text-sm text-[#667085]">ⓘ 数据更新于 2024-05-16</div>
          </div>

          <div className="mt-6 flex h-12 items-center gap-3 rounded-xl border border-[#d8dee8] bg-white px-4">
            <input className="min-w-0 flex-1 text-sm outline-none placeholder:text-[#98a2b3]" placeholder="搜索法规名称或关键词，如“最低工资”“工伤认定”" />
            <SearchIcon />
          </div>

          <div className="mt-6">
            <h2 className="text-base font-bold text-[#111827]">按主题浏览</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Pill active={selectedCategory === '全部类别'} onClick={() => setSelectedCategory('全部类别')}>全部</Pill>
              {categories.slice(1).map((category) => (
                <Pill key={category} active={selectedCategory === category} onClick={() => setSelectedCategory(category)}>
                  {category}
                </Pill>
              ))}
              <Pill>更多⌄</Pill>
            </div>
          </div>

          <section className="mt-5 overflow-hidden rounded-2xl border border-[#eadfce] bg-white">
            <div className="flex items-center justify-between border-b border-[#eadfce] px-5 py-4 text-sm text-[#667085]">
              <span>共 {filtered.length} 条法规与政策</span>
              <span>排序： <b className="text-[#111827]">最新发布⌄</b></span>
            </div>
            <div className="divide-y divide-[#eadfce]">
              {shown.map((reg, index) => (
                <article key={reg.id} className="grid gap-6 px-5 py-5 md:grid-cols-[84px_minmax(0,1fr)_190px]">
                  <div className="flex h-24 w-20 flex-col items-center justify-center rounded-xl bg-[#e8f6ee] text-[#0b7a3b]">
                    <DocIcon />
                    <span className="mt-2 text-xs font-bold">{index % 3 === 0 ? '政策文件' : '部门规章'}</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="line-clamp-2 text-lg font-black leading-snug text-[#111827]">{reg.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#667085]">{reg.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {reg.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-md bg-[#e8f6ee] px-2.5 py-1 text-xs font-bold text-[#0b7a3b]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-5 text-xs text-[#667085]">
                      <span>发布机关：{reg.issuer}</span>
                      <span>发布日期：{reg.publishDate}</span>
                    </div>
                  </div>
                  <div className="border-l border-[#eadfce] pl-5 text-sm">
                    <h3 className="font-bold text-[#111827]">适合解决的问题</h3>
                    <ul className="mt-3 space-y-2 text-[#0b7a3b]">
                      <li>✓ 劳动关系如何认定</li>
                      <li>✓ 平台责任与保障</li>
                      <li>✓ 社会保障如何落实</li>
                    </ul>
                    <a
                      href={reg.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex h-10 items-center justify-center rounded-lg bg-[#0b7a3b] font-bold text-white"
                    >
                      查看官方原文 ↗
                    </a>
                    <p className="mt-3 text-xs text-[#667085]">最后核验：{reg.lastVerified}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#eadfce] bg-white p-5">
            <h2 className="text-lg font-black text-[#111827]">🔥 热门法规</h2>
            <div className="mt-4 space-y-4">
              {regulations.slice(0, 8).map((reg, index) => (
                <div key={reg.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-black ${index < 3 ? 'bg-[#fff1dd] text-[#f97316]' : 'bg-[#eef2f6] text-[#667085]'}`}>
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold text-[#111827]">{reg.title}</span>
                  <span className="shrink-0 text-xs text-[#667085]">— {(10.2 - index * 0.7).toFixed(1)}万浏览</span>
                </div>
              ))}
            </div>
            <button className="mt-5 h-10 w-full rounded-lg border border-[#eadfce] text-sm font-bold text-[#0b7a3b]">查看全部热门法规 ›</button>
          </section>

          <section className="rounded-2xl border border-[#eadfce] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#111827]">法律条文解读</h2>
              <button className="text-sm text-[#667085]">更多解读 ›</button>
            </div>
            <div className="mt-4 rounded-xl bg-[#edf8ef] p-4">
              <h3 className="font-bold text-[#0b7a3b]">新就业形态劳动者能否主张加班费？</h3>
              <p className="mt-2 text-sm leading-6 text-[#667085]">解读《劳动法》《劳动合同法》及相关司法实践，明确加班认定重点与证据要求。</p>
              <button className="mt-3 text-sm font-bold text-[#0b7a3b]">查看解读 ›</button>
            </div>
            {['平台以“合作”名义拒绝承担责任，怎么办？', '被罚款、扣款（罚单）是否合法？', '如何认定工伤？新就业形态是否要受工伤保障？'].map((title) => (
              <div key={title} className="border-b border-[#eadfce] py-4 last:border-b-0">
                <h3 className="font-bold text-[#111827]">{title}</h3>
                <p className="mt-1 text-sm text-[#667085]">从法律关系认定、平台责任判断到维权路径，全面理解。</p>
              </div>
            ))}
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-[#dfe8df] bg-[#f7faf7] p-5">
            <h2 className="text-lg font-black text-[#0b7a3b]">需要法律帮助？</h2>
            <p className="mt-2 text-sm leading-6 text-[#344054]">不清楚适用哪条法规？描述你的问题，我们帮你找依据。</p>
            <a href="/chat" className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#0b7a3b] px-5 text-sm font-bold text-white">立即提问</a>
            <div className="absolute bottom-3 right-5 text-6xl text-[#0b7a3b]/20">☏</div>
          </section>
        </aside>
      </div>

      <section className="fixed bottom-0 left-1/2 z-30 hidden w-[min(1120px,calc(100vw-96px))] -translate-x-1/2 rounded-t-2xl border border-[#dfe8df] bg-white/95 px-8 py-3 shadow-lg backdrop-blur lg:grid lg:grid-cols-4">
        {[
          ['权威来源', '官方发布或权威机构发布'],
          ['定期核验', '条文有效性与更新及时核验'],
          ['通俗解读', '用大白话帮你理解法律条文'],
          ['实用指引', '提供维权步骤与证据建议'],
        ].map(([title, desc]) => (
          <div key={title} className="flex items-center gap-3 border-r border-[#dfe8df] px-5 last:border-r-0">
            <ShieldIcon className="h-8 w-8 text-[#0b7a3b]" />
            <div>
              <p className="font-black text-[#111827]">{title}</p>
              <p className="text-xs text-[#667085]">{desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-bold text-[#344054]">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
