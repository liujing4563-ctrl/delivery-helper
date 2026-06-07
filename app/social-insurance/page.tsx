'use cache';

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '骑手社保参保指南',
  description:
    '外卖骑手怎么缴养老保险和医疗保险？京东全额承担五险一金，美团饿了么补贴50%，政府补贴10%。灵活就业参保操作指南。',
};

const platformBenefits = [
  {
    platform: '京东外卖',
    coverage: '全职骑手五险一金',
    detail: '平台全额承担，骑手不缴费。已覆盖约 15 万全职骑手。',
    color: 'red' as const,
  },
  {
    platform: '美团',
    coverage: '灵活就业养老保险',
    detail: '骑手以灵活就业身份参保，平台按参保地缴费基数下限补贴 50%。覆盖约 1668 万骑手，年补贴约 25.6 亿元。',
    color: 'yellow' as const,
  },
  {
    platform: '饿了么',
    coverage: '灵活就业养老保险',
    detail: '骑手以灵活就业身份参保，平台补贴 50%。',
    color: 'blue' as const,
  },
  {
    platform: '淘宝闪购',
    coverage: '灵活就业养老保险',
    detail: '"先缴后补"模式，补贴比例 50%～100%。',
    color: 'orange' as const,
  },
];

const colorMap = {
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', title: 'text-red-900' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', title: 'text-yellow-900' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', title: 'text-blue-900' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', title: 'text-orange-900' },
};

export default async function SocialInsurancePage() {
  return (
    <div className="pb-4 md:pb-8">
      <section className="rounded-none bg-green-700 px-4 pb-5 pt-6 text-white md:mt-6 md:rounded-2xl md:px-8 md:py-8">
        <p className="text-sm font-medium text-white/90">社保参保指南</p>
        <h1 className="mt-2 text-2xl font-bold leading-8 md:text-3xl">
          骑手怎么缴养老保险和医保？
        </h1>
        <p className="mt-3 text-sm leading-6 text-green-50 md:text-base">
          2025 年起各大平台陆续推出骑手社保补贴方案。以灵活就业身份参加养老保险，平台最高补贴 100%，政府另补 10%。
        </p>
      </section>

      {/* 各平台补贴方案 */}
      <section className="px-4 pt-5 md:px-0 md:pt-8">
        <h2 className="text-lg font-bold text-gray-900">各平台社保补贴方案</h2>
        <p className="mt-1 text-xs text-gray-500">
          数据来源：新华视点 2026年5月报道 · 最后核实：2026-06-07
        </p>
        <div className="mt-3 space-y-3">
          {platformBenefits.map((item) => {
            const c = colorMap[item.color];
            return (
              <div key={item.platform} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${c.title}`}>{item.platform}</p>
                  <span className={`rounded-full border ${c.border} bg-white px-2 py-0.5 text-xs font-medium ${c.text}`}>
                    {item.coverage}
                  </span>
                </div>
                <p className={`mt-1.5 text-sm ${c.text}`}>{item.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 灵活就业参保操作指南 */}
      <section className="px-4 pt-6 md:px-0 md:pt-8">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-900">灵活就业参保怎么操作？</p>
          <div className="mt-2 space-y-3 text-sm text-green-800">
            <div>
              <p className="font-semibold">第一步：在当地社保局办理灵活就业参保</p>
              <p>携带身份证到户籍地或常住地的社保经办机构办理。2026 年起，凭居住证即可在常住地参保，不再受户籍限制。</p>
            </div>
            <div>
              <p className="font-semibold">第二步：选择缴费基数</p>
              <p>灵活就业养老保险可在当地社保缴费基数下限和上限之间选择。多数骑手选择下限即可，平台补贴按下限计算（如美团补贴 50%）。</p>
            </div>
            <div>
              <p className="font-semibold">第三步：申请平台补贴</p>
              <p>参保后在骑手 APP 内提交社保参保证明，平台审核后按月发放补贴到你的账户。具体入口和流程以各平台 APP 为准。</p>
            </div>
            <div>
              <p className="font-semibold">第四步：政府额外补贴</p>
              <p>部分地区对灵活就业参保人员额外补贴 10%（如江苏试点），直接打入个人社保账户。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 国务院新政 */}
      <section className="px-4 pt-5 md:px-0 md:pt-8">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">2026 年新政：凭居住证享受同城待遇</p>
          <div className="mt-2 space-y-2 text-sm text-blue-800">
            <p>
              国务院 2026 年 5 月 22 日印发《关于推行常住地提供基本公共服务的实施意见》，打破户籍限制：
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>灵活就业人员可自主缴存住房公积金</li>
              <li>凭居住证在常住地参加社保，不受户籍限制</li>
              <li>社保关系转移接续更加便利</li>
              <li>随迁子女可在常住地就读公办学校</li>
            </ul>
            <p className="text-xs text-blue-600">
              覆盖约 2.4 亿灵活就业者，外卖骑手、网约车司机、个体户均适用。
            </p>
          </div>
        </div>
      </section>

      {/* 常见问题 */}
      <section className="px-4 pt-5 md:px-0 md:pt-8">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">常见问题</p>
          <div className="mt-2 space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium">众包/兼职骑手也能参保吗？</p>
              <p className="text-gray-600">可以。灵活就业参保不区分全职还是兼职，只要你在当地以灵活就业身份办理了社保，就可以申请平台补贴。</p>
            </div>
            <div>
              <p className="font-medium">同时在多个平台跑单怎么办？</p>
              <p className="text-gray-600">社保只能在一个地方缴纳，但可以在各平台分别申请补贴。以缴费基数下限为例，美团补贴 50%，如果你同时在饿了么也有活跃记录，可以了解饿了么的补贴方案。</p>
            </div>
            <div>
              <p className="font-medium">养老保险缴多少年才能领退休金？</p>
              <p className="text-gray-600">累计缴费满 15 年（180 个月），达到法定退休年龄后可按月领取养老金。中途断缴不影响已累计的年限。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 底部热线 */}
      <section className="px-4 pt-5 md:px-0 md:pt-8">
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:12333"
            className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center"
          >
            <p className="text-lg font-bold text-blue-900">12333</p>
            <p className="text-xs text-blue-600">人社热线 · 咨询参保</p>
          </a>
          <Link
            href="/injury-insurance"
            className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-center"
          >
            <p className="text-lg font-bold text-orange-900">职业伤害 →</p>
            <p className="text-xs text-orange-600">工伤保障详情</p>
          </Link>
        </div>
      </section>

      <p className="mt-6 px-4 text-center text-xs text-gray-400">
        数据来源：新华视点、国务院政策文件、各平台官方公告 · 最后核实：2026-06-07
      </p>
    </div>
  );
}
