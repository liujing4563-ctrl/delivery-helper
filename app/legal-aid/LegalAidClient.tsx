'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { legalAidCenters } from '@/data/legalAidCenters';
import type { LegalAidCenter } from '@/data/types';

function ShieldIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3 5 6v5c0 4.6 2.9 8.6 7 10 4.1-1.4 7-5.4 7-10V6z" strokeLinejoin="round" />
      <path d="m8.5 12 2.2 2.2 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 21h18M5 21V10l7-4 7 4v11M8 21v-6h8v6M9 12h.01M12 12h.01M15 12h.01" />
    </svg>
  );
}

const ALL_DISTRICTS = '全部区县';
const ALL_TYPES = '全部类型';
const DEFAULT_VISIBLE_COUNT = 6;

type SelectOption = {
  value: string;
  label: string;
};

function isVisibleCenter(center: LegalAidCenter) {
  return center.verifyStatus === 'verified';
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export default function LegalAidClient() {
  const visibleCenters = useMemo(() => legalAidCenters.filter(isVisibleCenter), []);
  const defaultCity = visibleCenters.some((center) => center.city === '上海')
    ? '上海'
    : visibleCenters[0]?.city || '';

  const [city, setCity] = useState(defaultCity);
  const [district, setDistrict] = useState(ALL_DISTRICTS);
  const [type, setType] = useState(ALL_TYPES);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_COUNT);

  const cityCountMap = useMemo(
    () =>
      visibleCenters.reduce<Record<string, number>>((acc, center) => {
        acc[center.city] = (acc[center.city] || 0) + 1;
        return acc;
      }, {}),
    [visibleCenters]
  );

  const cityOptions = useMemo<SelectOption[]>(
    () =>
      unique(visibleCenters.map((center) => center.city)).map((cityName) => ({
        value: cityName,
        label: `${cityName}（${cityCountMap[cityName]}）`,
      })),
    [cityCountMap, visibleCenters]
  );

  const districtOptions = useMemo(() => {
    const cityDistricts = visibleCenters
      .filter((center) => center.city === city)
      .map((center) => center.district)
      .filter((value): value is string => Boolean(value));
    return [ALL_DISTRICTS, ...unique(cityDistricts)];
  }, [city, visibleCenters]);

  const centersForTypeOptions = useMemo(
    () =>
      visibleCenters.filter((center) => {
        const cityOk = !city || center.city === city;
        const districtOk = district === ALL_DISTRICTS || center.district === district;
        return cityOk && districtOk;
      }),
    [city, district, visibleCenters]
  );

  const typeOptions = useMemo(
    () => [ALL_TYPES, ...unique(centersForTypeOptions.map((center) => center.type))],
    [centersForTypeOptions]
  );

  const filtered = useMemo(
    () =>
      visibleCenters.filter((center) => {
        const cityOk = !city || center.city === city;
        const districtOk = district === ALL_DISTRICTS || center.district === district;
        const typeOk = type === ALL_TYPES || center.type === type;
        const keyword = searchQuery.trim();
        const searchOk =
          !keyword ||
          [center.name, center.address, center.sourceName, center.district, center.city].some((value) =>
            value?.includes(keyword)
          );
        return cityOk && districtOk && typeOk && searchOk;
      }),
    [city, district, type, searchQuery, visibleCenters]
  );

  const displayedCenters = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = filtered.length > visibleCount;
  const cityCenters = useMemo(() => visibleCenters.filter((center) => center.city === city), [city, visibleCenters]);
  const shouldShowCoverageNotice = filtered.length > 0 && cityCenters.length <= 2;

  const grouped = useMemo(() => {
    const map = new Map<string, LegalAidCenter[]>();
    displayedCenters.forEach((center) => {
      const key = center.district || '市级';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(center);
    });
    return map;
  }, [displayedCenters]);

  function handleCityChange(nextCity: string) {
    setCity(nextCity);
    setDistrict(ALL_DISTRICTS);
    setType(ALL_TYPES);
    setVisibleCount(DEFAULT_VISIBLE_COUNT);
  }

  function handleDistrictChange(nextDistrict: string) {
    setDistrict(nextDistrict);
    setType(ALL_TYPES);
    setVisibleCount(DEFAULT_VISIBLE_COUNT);
  }

  function handleTypeChange(nextType: string) {
    setType(nextType);
    setVisibleCount(DEFAULT_VISIBLE_COUNT);
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 md:-mx-12 md:px-8">
      <div className="flex min-h-12 items-center justify-between gap-4 rounded-[14px] border border-orange-200 bg-orange-50 px-5 py-3 text-sm text-slate-700">
        <p>
          <b className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">i</b>
          本页展示已核验的法援机构信息。更多地区可拨打全国法律援助热线 12348，或通过 12348 中国法网查询。
        </p>
        <button type="button" aria-label="关闭提示" className="shrink-0 text-xl leading-none text-slate-500">
          ×
        </button>
      </div>

      <section className="relative mt-4 overflow-hidden rounded-[22px] border border-[#eadfce] bg-[#f7efe1] shadow-sm">
        <div className="grid min-h-[196px] lg:grid-cols-[390px_minmax(0,1fr)_340px]">
          <div className="relative flex flex-col justify-center overflow-hidden bg-[#0b7a3b] px-10 py-8 text-white">
            <div className="absolute inset-y-0 right-[-28px] w-20 rotate-6 bg-[#f6c15b]" />
            <p className="relative flex items-center gap-4 text-[72px] font-extrabold leading-none">
              <span className="text-[56px]">☎</span>
              12348
            </p>
            <p className="relative mt-4 text-[28px] font-extrabold leading-none">全国法律援助热线</p>
          </div>
          <div className="flex flex-col justify-center px-10 py-8">
            <h1 className="text-[30px] font-extrabold leading-tight text-[#0b301b]">遇到权益问题，先找法援帮你解决</h1>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#0b7a3b]">
              {['免费咨询', '专业解答', '符合法援条件可申请免费法律援助'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <ShieldIcon className="h-5 w-5" />
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 inline-flex w-fit rounded-lg border border-[#e8d2a8] bg-[#fffaf0] px-6 py-3 text-sm text-slate-700">
              如需人工法律帮助或无法确认适用机构，请拨打全国法律援助热线 12348
            </div>
          </div>
          <div className="relative hidden overflow-hidden lg:block">
            <Image
              src="/legal-aid/hero-rider.png"
              alt="外卖骑手查看手机"
              fill
              priority
              sizes="340px"
              className="object-cover object-center"
            />
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f7efe1] to-transparent" />
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-[18px] border border-[#eadfce] bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[220px_220px_220px_minmax(0,1fr)_130px]">
          <Select label="所在城市" value={city} onChange={handleCityChange} options={cityOptions} />
          <Select label="所在区县" value={district} onChange={handleDistrictChange} options={districtOptions} />
          <Select label="机构类型" value={type} onChange={handleTypeChange} options={typeOptions} />
          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-slate-600">搜索机构</span>
            <div className="flex h-11 overflow-hidden rounded-lg border border-[#d8dee8]">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="min-w-0 flex-1 px-4 text-sm outline-none placeholder:text-slate-400"
                placeholder="搜索机构名称或地址关键词"
              />
              <button type="button" className="h-full bg-[#0b7a3b] px-7 text-sm font-bold text-white">
                搜索
              </button>
            </div>
          </label>
          <button
            type="button"
            onClick={() => {
              setCity(defaultCity);
              setDistrict(ALL_DISTRICTS);
              setType(ALL_TYPES);
              setSearchQuery('');
              setVisibleCount(DEFAULT_VISIBLE_COUNT);
            }}
            className="mt-[27px] h-11 rounded-lg border border-[#d8dee8] bg-white text-sm font-bold text-slate-700"
          >
            ↻ 重置筛选
          </button>
        </div>
      </section>

      <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]">
        <main className="space-y-5 rounded-2xl border border-[#eadfce] bg-white p-5">
          {shouldShowCoverageNotice && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] leading-6 text-emerald-900">
              当前仅展示该城市已核验的法援机构信息。更多区县机构信息可通过 12348 中国法网或全国法律援助热线 12348 查询。
            </div>
          )}

          {Array.from(grouped.entries()).map(([groupName, centers]) => (
            <section key={groupName}>
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-black text-[#111827]">
                <span className="text-[#0b7a3b]">▦</span>
                {groupName}（{centers.length}）
              </h2>
              <div className="space-y-4">
                {centers.map((center) => (
                  <AidCard key={center.id} center={center} />
                ))}
              </div>
            </section>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#eadfce] bg-[#fffdf7] px-6 py-10 text-center text-sm leading-7 text-slate-600">
              暂未找到符合条件的已核验法援机构。你可以调整筛选条件，或拨打全国法律援助热线 12348 咨询。
            </div>
          )}
          {hasMore ? (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + DEFAULT_VISIBLE_COUNT)}
              className="mx-auto flex h-11 items-center justify-center px-8 text-sm font-bold text-[#667085]"
            >
              加载更多⌄
            </button>
          ) : (
            filtered.length > 0 && (
              <p className="text-center text-xs text-[#667085]">已显示当前筛选条件下全部已核验机构。</p>
            )
          )}
        </main>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#dfe8df] bg-[#f7faf7] p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="text-xl font-black text-[#0b7a3b]">正规律所查询入口</h2>
                <p className="mt-3 text-sm leading-7 text-[#344054]">查询律所执业资质、律师信用信息，认准正规法律服务机构。</p>
              </div>
              <ShieldIcon className="h-16 w-16 text-[#0b7a3b]" />
            </div>
            <a
              href="https://credit.acla.org.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex h-11 items-center justify-center rounded-lg border border-[#0b7a3b] font-bold text-[#0b7a3b]"
            >
              全国律师执业诚信信息公示平台 ↗
            </a>
            <p className="mt-3 text-xs text-[#667085]">来源：中华全国律师协会</p>
          </section>

          <section className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-6">
            <h2 className="text-xl font-black text-[#9a3412]">什么时候需要寻求人工帮助？</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#9a3412]">
              <li>● 遭遇欠薪、克扣、拖欠工资</li>
              <li>● 被平台或商家误封、限制接单</li>
              <li>● 发生交通事故，责任与赔偿纠纷</li>
              <li>● 签了合同但权益无法保障</li>
              <li>● 遇到人身侵害、威胁或安全问题</li>
            </ul>
            <div className="mt-5 rounded-xl border border-[#fed7aa] bg-white px-4 py-3 text-sm leading-6 text-[#9a3412]">
              <b>提示</b>
              <br />
              如果不确定问题是否符合法律援助条件，可先拨打 <b>12348</b> 免费咨询，工作人员会为你判断并指引下一步。
            </div>
          </section>

          <section className="rounded-2xl border border-[#dfe8df] bg-[#f7faf7] p-6">
            <h2 className="text-xl font-black text-[#0b7a3b]">法援小贴士</h2>
            <p className="mt-3 text-sm leading-7 text-[#344054]">法律援助是政府提供的公益性法律服务，符合条件的困难群众可申请免费援助。</p>
            <a href="/guide" className="mt-4 inline-flex text-sm font-bold text-[#0b7a3b]">查看申请条件与流程 ›</a>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly (string | SelectOption)[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-[#d8dee8] bg-white px-4 text-sm text-[#111827] outline-none focus:border-[#0b7a3b]"
      >
        {options.map((option) => (
          <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function AidCard({ center }: { center: LegalAidCenter }) {
  const telHref = center.phone ? center.phone.replace(/[^\d+]/g, '') : '';
  const verifiedAt = center.verifiedAt || center.lastVerified;
  return (
    <article className="grid gap-5 rounded-2xl border border-[#eadfce] bg-white p-5 md:grid-cols-[120px_minmax(0,1fr)_160px]">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#edf8ef] text-[#0b7a3b]">
        <BuildingIcon />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-black text-[#111827]">{center.name}</h3>
          <span className="rounded-md bg-[#dff4e8] px-2 py-1 text-xs font-bold text-[#0b7a3b]">已核验</span>
          <span className="rounded-md bg-[#dff4e8] px-2 py-1 text-xs font-bold text-[#0b7a3b]">{center.type}</span>
        </div>
        <div className="mt-3 space-y-2 text-sm leading-6 text-[#667085]">
          {center.address && <p>● {center.city} {center.district} {center.address}</p>}
          {center.phone ? <p>● {center.phone}</p> : <p>● 电话待核验</p>}
          {center.hours && <p>● {center.hours}</p>}
          <p>
            信息来源：
            {center.sourceUrl ? (
              <a href={center.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-[#0b7a3b]">
                {center.sourceName}
              </a>
            ) : (
              <span className="font-bold text-[#667085]">来源待核验</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-3">
        {center.phone ? (
          <a href={`tel:${telHref}`} className="flex h-10 items-center justify-center rounded-lg border border-[#0b7a3b] font-bold text-[#0b7a3b]">
            拨打电话
          </a>
        ) : (
          <span className="flex h-10 items-center justify-center rounded-lg border border-[#d8dee8] text-sm font-bold text-[#667085]">
            电话待核验
          </span>
        )}
        {center.sourceUrl ? (
          <a
            href={center.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center justify-center rounded-lg border border-[#d8dee8] font-bold text-[#344054]"
          >
            查看来源 ↗
          </a>
        ) : (
          <span className="flex h-10 items-center justify-center rounded-lg border border-[#d8dee8] text-sm font-bold text-[#667085]">
            来源待核验
          </span>
        )}
        <span className="text-center text-sm text-[#667085]">最近核验：{verifiedAt}</span>
      </div>
    </article>
  );
}
