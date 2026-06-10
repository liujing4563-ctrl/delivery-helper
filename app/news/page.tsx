import type { Metadata } from 'next';
import { newsItems } from '@/data/news';

export const metadata: Metadata = {
  title: '新闻资讯',
  description: '关注外卖骑手权益相关的最新政策、行业动态与社会新闻，每条动态保留来源原文链接。',
};

const categories = ['全部', '政策法规', '行业动态', '权益保障', '社会关注', '典型案例'] as const;

const covers = [
  '/news/mhrss-building.svg',
  '/news/conference.svg',
  '/news/rider-street.svg',
  '/news/law-book-gavel.svg',
  '/news/shanghai-skyline.svg',
];

const sourceList = [
  ['人力资源和社会保障部官网', '官方'],
  ['各地人社局官网', '官方'],
  ['最高人民法院官网', '官方'],
  ['中国新闻网', '媒体'],
  ['法治日报', '媒体'],
];

function categoryOf(item: (typeof newsItems)[number], index: number) {
  if (item.tags.some((tag) => tag.includes('职业伤害') || tag.includes('维权'))) return '权益保障';
  if (item.tags.some((tag) => tag.includes('算法') || tag.includes('平台'))) return '行业动态';
  if (item.tags.some((tag) => tag.includes('社保') || tag.includes('公共服务'))) return '社会关注';
  if (index === 3) return '政策法规';
  return index === 4 ? '行业动态' : '政策法规';
}

function secondTag(index: number) {
  return ['平台上线', '政策解读', '政策发布', '新规施行', ''][index] || '';
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function CardShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-[#eadfce] bg-white ${className}`}>{children}</section>;
}

export default async function NewsPage() {
  const visibleNews = newsItems.slice(2, 7);
  const hotNews = visibleNews.slice(0, 5);

  const newsArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: visibleNews.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'NewsArticle',
        headline: item.title,
        datePublished: item.date,
        description: item.summary.slice(0, 100),
        publisher: { '@type': 'Organization', name: item.source },
      },
    })),
  };

  return (
    <div className="py-6 md:py-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />

      <div className="mx-auto max-w-[1280px]">
        <div className="mb-5 text-sm text-[#667085]">首页  ›  新闻资讯</div>
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black tracking-normal text-[#111827]">新闻资讯</h1>
                <p className="mt-3 text-base text-[#475467]">
                  关注外卖骑手权益相关的最新政策、行业动态与社会新闻，每条动态保留来源原文链接。
                </p>
              </div>
              <form className="hidden h-12 w-64 items-center gap-3 rounded-xl border border-[#d8dee8] bg-white px-4 md:flex">
                <SearchIcon />
                <input
                  type="search"
                  placeholder="搜索新闻标题、关键词"
                  className="min-w-0 flex-1 text-sm outline-none placeholder:text-[#98a2b3]"
                />
              </form>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`h-9 rounded-xl px-5 text-sm font-bold ${
                    index === 0
                      ? 'bg-[#0b7a3b] text-white shadow-sm'
                      : 'border border-[#eadfce] bg-white text-[#111827]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <CardShell className="mt-5 overflow-hidden">
              {visibleNews.map((item, index) => {
                const category = categoryOf(item, index);
                const extraTag = secondTag(index);
                return (
                  <article
                    key={item.id}
                    className="grid grid-cols-[220px_minmax(0,1fr)_96px] gap-6 border-b border-[#eadfce] px-5 py-5 last:border-b-0"
                  >
                    <img
                      src={covers[index % covers.length]}
                      alt=""
                      className="h-[120px] w-[220px] rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-md bg-[#dff4e8] px-2.5 py-1 text-xs font-bold text-[#0b7a3b]">
                          {category}
                        </span>
                        {extraTag && (
                          <span className="rounded-md bg-[#fff1dd] px-2.5 py-1 text-xs font-bold text-[#c2410c]">
                            {extraTag}
                          </span>
                        )}
                      </div>
                      <h2 className="mt-3 line-clamp-2 text-xl font-black leading-snug text-[#111827]">
                        {item.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#667085]">{item.summary}</p>
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="font-bold text-[#111827]">{item.source}</span>
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#0b7a3b]"
                        >
                          查看来源
                        </a>
                      </div>
                    </div>
                    <time className="pt-4 text-right text-sm text-[#667085]">{item.date}</time>
                  </article>
                );
              })}

              <div className="flex items-center justify-center gap-3 px-5 py-5 text-sm">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#eadfce] text-[#98a2b3]">‹</button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b7a3b] font-bold text-white">1</button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#eadfce]">2</button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#eadfce]">3</button>
                <span className="px-1 text-[#667085]">…</span>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#eadfce]">12</button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#eadfce]">›</button>
                <span className="ml-3 text-[#667085]">共 58 条</span>
              </div>
            </CardShell>
          </main>

          <aside className="space-y-4">
            <form className="h-11 rounded-full border border-[#eadfce] bg-white px-4">
              <input
                type="search"
                placeholder="搜索新闻标题、关键词"
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#98a2b3]"
              />
            </form>

            <CardShell className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#111827]">热门资讯</h2>
                <button className="text-sm text-[#667085]">更多 ›</button>
              </div>
              <div className="mt-4 space-y-4 rounded-xl bg-white">
                {hotNews.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-[24px_1fr] gap-3 border-b border-[#eadfce] pb-3 last:border-b-0 last:pb-0">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-black ${
                        index < 3 ? 'bg-[#fff1dd] text-[#f97316]' : 'bg-[#eef2f6] text-[#475467]'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="line-clamp-2 text-sm font-bold leading-5 text-[#111827]">
                        {item.title}
                        {index === 0 && <span className="ml-2 text-[#f97316]">●</span>}
                      </p>
                      <time className="mt-1 block text-xs text-[#667085]">{item.date}</time>
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>

            <CardShell className="p-5">
              <h2 className="text-lg font-black text-[#111827]">订阅更新</h2>
              <p className="mt-2 text-sm leading-6 text-[#667085]">订阅后，最新政策法规和权益资讯将通过邮件通知您。</p>
              <div className="mt-4 flex gap-3">
                <input
                  type="email"
                  placeholder="请输入您的邮箱地址"
                  className="min-w-0 flex-1 rounded-lg border border-[#d8dee8] px-3 text-sm outline-none focus:border-[#0b7a3b]"
                />
                <button className="h-10 rounded-lg bg-[#0b7a3b] px-4 text-sm font-bold text-white">订阅资讯</button>
              </div>
              <p className="mt-3 text-xs text-[#667085]">演示版本暂未开通邮件订阅，我们不会保存您的邮箱。</p>
            </CardShell>

            <CardShell className="p-5">
              <h2 className="text-lg font-black text-[#111827]">资讯来源</h2>
              <div className="mt-4 space-y-3">
                {sourceList.map(([source, type]) => (
                  <div key={source} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2 text-[#344054]">
                      <span className="h-5 w-5 rounded-full bg-[#0b7a3b]" />
                      <span className="truncate">{source}</span>
                    </span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${type === '官方' ? 'bg-[#dff4e8] text-[#0b7a3b]' : 'bg-[#efe7ff] text-[#6941c6]'}`}>
                      {type}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-5 h-10 w-full rounded-lg border border-[#eadfce] text-sm font-bold text-[#0b7a3b]">
                查看全部来源  ›
              </button>
            </CardShell>

            <section className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-5">
              <h2 className="text-lg font-black text-[#9a3412]">重要提示</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#c2410c]">
                新闻仅供背景阅读，不作为法律依据。具体维权请以官方法规、12348 或专业律师意见为准。
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
