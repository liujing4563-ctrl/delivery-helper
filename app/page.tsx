import Link from 'next/link';
import Image from 'next/image';
import { newsItems } from '@/data/news';
import { minWageData } from '@/data/minWage';

type Tone = 'green' | 'orange' | 'blue' | 'purple';
type GlyphName = 'money' | 'bandage' | 'contract' | 'lock' | 'yen' | 'people' | 'folder' | 'building' | 'book' | 'link' | 'user' | 'privacy' | 'scooter';

function Icon({ children, tone = 'green', large = false }: { children: React.ReactNode; tone?: Tone; large?: boolean }) {
  const tones = {
    green: 'bg-[#dff4e8] text-[#0b7a3b]',
    orange: 'bg-[#fff1dd] text-[#f97316]',
    blue: 'bg-[#e7f0ff] text-[#2563eb]',
    purple: 'bg-[#f0e9ff] text-[#7c3aed]',
  };
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-xl ${large ? 'h-16 w-16' : 'h-12 w-12'} ${tones[tone]}`}>
      {children}
    </span>
  );
}

function GlyphIcon({ name, className = 'h-7 w-7' }: { name: GlyphName; className?: string }) {
  const common = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'money':
      return <svg {...common}><path d="M7 7h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z" /><path d="M12 10v6M9.5 12h5M9.5 14h5" /></svg>;
    case 'bandage':
      return <svg {...common}><path d="m8.5 15.5 7-7a4 4 0 0 1 5.7 5.7l-7 7a4 4 0 0 1-5.7-5.7z" /><path d="m2.8 9.8 7-7a4 4 0 0 1 5.7 5.7l-7 7a4 4 0 0 1-5.7-5.7z" /><path d="M8 8h.01M11 11h.01M13 6h.01M6 13h.01" /></svg>;
    case 'contract':
      return <svg {...common}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5M10 12h6M10 16h6" /></svg>;
    case 'lock':
      return <svg {...common}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v2" /></svg>;
    case 'yen':
      return <svg {...common}><path d="m6 4 6 8 6-8M12 12v8M8 13h8M8 17h8" /></svg>;
    case 'people':
      return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-8 0v2" /><circle cx="12" cy="8" r="4" /><path d="M22 21v-2a3 3 0 0 0-2-2.8M2 21v-2a3 3 0 0 1 2-2.8" /></svg>;
    case 'folder':
      return <svg {...common}><path d="M3 7h6l2 2h10v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" /><path d="M7 13h10" /></svg>;
    case 'building':
      return <svg {...common}><path d="M4 21h16M6 18V8l6-4 6 4v10M9 18v-6M15 18v-6M8 8h8" /></svg>;
    case 'book':
      return <svg {...common}><path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" /><path d="M7 4v14M10 8h5" /></svg>;
    case 'link':
      return <svg {...common}><path d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1L10.6 5" /><path d="M14 11a5 5 0 0 0-7.1 0l-1.4 1.4a5 5 0 0 0 7.1 7.1l.8-.8" /></svg>;
    case 'user':
      return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></svg>;
    case 'privacy':
      return <svg {...common}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
    case 'scooter':
      return <svg {...common}><path d="M5 17a3 3 0 1 0 6 0H5zM17 17a3 3 0 1 0 3-3h-3z" /><path d="M8 14h5l3-6h3M13 14l2 3" /></svg>;
  }
}

function ShieldIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3 5 6v5c0 4.6 2.9 8.6 7 10 4.1-1.4 7-5.4 7-10V6z" strokeLinejoin="round" />
      <path d="m8.5 12 2.2 2.2 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2" strokeLinecap="round" />
    </svg>
  );
}

function HeroRider() {
  return (
    <div className="relative hidden min-h-[330px] overflow-hidden rounded-r-[18px] bg-[#fffdf7] lg:block">
      <Image
        src="/home/hero-rider.png"
        alt="外卖骑手查看手机"
        fill
        priority
        sizes="54vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fffdf7] to-transparent" />
    </div>
  );
}

const problems = [
  ['被扣钱了', '订单、罚款、保证金等被扣，想要问公道', 'orange', 'money'],
  ['送餐受伤', '配送途中受伤，想要保障治疗和赔偿', 'blue', 'bandage'],
  ['没签劳动合同', '没有合同，担心权益得不到保障', 'green', 'contract'],
  ['被封号了', '账号被封禁，想了解原因并申诉解封', 'orange', 'lock'],
  ['工资太低', '实际收入与平台说明不符，想重算收入', 'orange', 'yen'],
  ['申请法援', '经济困难，申请法律援助帮助', 'purple', 'people'],
] as const;

const tools = [
  ['算实际时薪', '计算每小时真实收入，看清自己的劳动价值', '/calculator', '立即测算', 'green', 'yen'],
  ['整理证据', '拍照上传，按时间线归拢证据材料', '/evidence', '去整理', 'green', 'folder'],
  ['找法援机构', '查找就近的法律援助机构，获取专业帮助', '/legal-aid', '去查找', 'orange', 'building'],
  ['查法规依据', '快速查找相关法律法规，了解你的权利', '/regulations', '去查询', 'blue', 'book'],
] as const;

export default async function Home() {
  const wageCities = ['北京', '上海', '深圳', '广州', '杭州', '成都'];
  const wageRows = wageCities
    .map((city) => minWageData.find((item) => item.city === city))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div className="pb-6 md:pb-10">
      <section className="overflow-hidden rounded-b-[18px] border border-t-0 border-[#eadfce] bg-white md:-mx-12 md:min-h-[330px] 2xl:-mx-[76px]">
        <div className="grid md:grid-cols-[46%_54%]">
          <div className="px-5 py-8 md:px-32 md:py-11">
            <h1 className="max-w-xl text-4xl font-black leading-[1.06] text-[#0b301b] md:text-[56px]">
              先算清收入，<br />
              再决定怎么维权
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-[#344054]">
              帮助你测算真实时薪、整理证据，并找到合适的法律援助渠道。
            </p>
            <div className="mt-7 flex flex-wrap gap-9">
              <Link
                href="/calculator"
                className="inline-flex h-[72px] min-w-[270px] items-center justify-center gap-4 rounded-2xl bg-[#0b7a3b] px-8 text-xl font-bold text-white shadow-lg shadow-[#0b7a3b]/20"
              >
                <CalculatorIcon />
                <span>
                  开始测算
                  <span className="block text-xs font-medium text-white/80">算清真实时薪与收入</span>
                </span>
              </Link>
              <a
                href="tel:12348"
                className="inline-flex h-[72px] min-w-[270px] items-center justify-center gap-4 rounded-2xl border border-[#0b7a3b] bg-white px-8 text-xl font-bold text-[#0b7a3b]"
              >
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z" />
                </svg>
                <span>
                  拨打 12348
                  <span className="block text-xs font-medium text-[#344054]">全国法律援助热线</span>
                </span>
              </a>
            </div>
          </div>
          <HeroRider />
        </div>
      </section>

      <section className="mx-auto mt-5 grid max-w-[1344px] gap-5 rounded-2xl border border-[#dfe8df] bg-white px-6 py-5 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        {[
          ['为什么不用直接问通用 AI?', '专业团队人工核验信息', 'privacy'],
          ['官方来源可查', '引用法律法规与权威渠道', 'link'],
          ['人工核验信息', '减少误导与错漏', 'user'],
          ['本地处理 · 默认不保存', '数据仅在本地处理', 'lock'],
          ['适合骑手实际问题', '聚焦骑手高频权益场景', 'scooter'],
        ].map(([title, desc, icon]) => (
          <div key={title} className="flex items-center gap-4">
            <Icon>
              <GlyphIcon name={icon as GlyphName} className="h-6 w-6" />
            </Icon>
            <div>
              <h2 className="text-base font-bold text-[#111827]">{title}</h2>
              <p className="mt-1 text-sm leading-5 text-[#667085]">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-5 max-w-[1344px]">
        <h2 className="text-2xl font-bold text-[#111827]">你现在遇到什么？</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {problems.map(([title, desc, tone, icon]) => (
            <Link key={title} href={title === '工资太低' ? '/calculator' : title === '申请法援' ? '/legal-aid' : '/chat'} className="flex min-h-[96px] items-center gap-4 rounded-2xl border border-[#eadfce] bg-white px-4 transition hover:border-[#0b7a3b]">
              <Icon tone={tone}>
                <GlyphIcon name={icon} className="h-7 w-7" />
              </Icon>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-[#667085]">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-5 max-w-[1344px]">
        <h2 className="text-2xl font-bold text-[#111827]">常用工具</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-4">
          {tools.map(([title, desc, href, action, tone, icon]) => (
            <Link key={title} href={href} className={`flex min-h-[118px] items-center justify-between rounded-2xl border p-5 transition hover:border-[#0b7a3b] ${title === '算实际时薪' ? 'border-[#b9dec9] bg-[#eef9f1]' : 'border-[#eadfce] bg-white'}`}>
              <div>
                <h3 className="text-xl font-bold text-[#111827]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">{desc}</p>
                <span className="mt-3 inline-block text-sm font-bold text-[#0b7a3b]">{action} ›</span>
              </div>
              <Icon tone={tone} large>
                <GlyphIcon name={icon} />
              </Icon>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-5 grid max-w-[1344px] gap-5 md:grid-cols-[1fr_1fr_1.2fr]">
        <div className="rounded-2xl border border-[#eadfce] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111827]">最新资讯</h2>
            <Link href="/news" className="text-sm font-semibold text-[#0b7a3b]">更多 ›</Link>
          </div>
          <div className="mt-4 space-y-3">
            {newsItems.slice(0, 4).map((item) => (
              <Link key={item.id} href="/news" className="flex items-center justify-between gap-4 text-sm">
                <span className="min-w-0 truncate text-[#344054]">{item.title}</span>
                <span className="shrink-0 text-[#667085]">{item.date.slice(5)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#eadfce] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111827]">各地最低工资参考（小时）</h2>
            <Link href="/calculator" className="text-sm font-semibold text-[#0b7a3b]">更多 ›</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">
            {wageRows.map((item) => item && (
              <div key={item.city} className="flex justify-between text-sm">
                <span className="text-[#344054]">{item.city}</span>
                <span className="font-bold text-[#0b7a3b]">{item.hourly.toFixed(1)} 元/小时</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#98a2b3]">数据来源：各地人社局公示标准</p>
        </div>

        <div className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-5">
          <h2 className="text-lg font-bold text-[#9a3412]">重要提示</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#b45309]">
            <li>本站提供的信息仅供参考，不构成法律意见。</li>
            <li>权益维护注意保存证据，必要时及时寻求专业帮助。</li>
            <li>如遇紧急情况或人身安全受到威胁，请立即拨打 110。</li>
            <li>拨打 12348 可咨询法律援助相关问题。</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-5 grid max-w-[1344px] gap-5 rounded-2xl border border-[#eadfce] bg-white px-8 py-5 md:grid-cols-4">
        {[
          ['信息人工核实', '专业团队人工核验信息'],
          ['不强制注册', '部分功能可匿名使用'],
          ['默认本地处理', '数据仅在本地处理，不上传'],
          ['隐私保护', '严格保护用户隐私安全'],
        ].map(([title, desc]) => (
          <div key={title} className="flex items-center gap-4">
            <ShieldIcon className="h-8 w-8 shrink-0 text-[#0b7a3b]" />
            <div>
              <h2 className="font-bold text-[#111827]">{title}</h2>
              <p className="text-sm text-[#667085]">{desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
