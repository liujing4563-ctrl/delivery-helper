import Link from 'next/link';
import type { CalculatorInput, CalculatorResult } from '@/data/types';

interface Props {
  result: CalculatorResult;
  input: CalculatorInput;
}

function ShieldIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3 5 6v5c0 4.6 2.9 8.6 7 10 4.1-1.4 7-5.4 7-10V6z" strokeLinejoin="round" />
      <path d="m8.5 12 2.2 2.2 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MiniCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action: string;
}) {
  return (
    <section className="rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-3 text-xl font-black text-[#111827]">
        <ShieldIcon className="h-7 w-7 text-[#0b7a3b]" />
        {title}
      </h2>
      <div className="mt-4 text-sm leading-7 text-[#344054]">{children}</div>
      <button className="mt-4 text-sm font-bold text-[#0b7a3b]">{action} ›</button>
    </section>
  );
}

export default function CalculatorResultDisplay({ result, input }: Props) {
  const diff = result.minWageReference > 0 ? result.hourlyRate - result.minWageReference : 0;
  const needsAttention = result.minWageReference > 0 && result.hourlyRate < result.minWageReference;

  return (
    <div className="space-y-5">
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="space-y-5">
          <section className="overflow-hidden rounded-2xl bg-[#0b7a3b] text-white shadow-lg shadow-[#0b7a3b]/20">
            <div className="grid gap-6 px-8 py-8 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-3 text-2xl font-black">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0b7a3b]">✓</span>
                  测算完成
                </div>
                <h1 className="mt-5 text-3xl font-black">你的权益账本测算结果</h1>
                <p className="mt-4 text-sm leading-7 text-white/85">
                  测算周期：2024-05-01 至 2024-05-31（共31天）
                  <br />
                  城市：{input.city}
                </p>
              </div>
              <Metric label="实际时薪" value={result.hourlyRate.toFixed(1)} unit="元/小时" />
              <Metric label="城市参考线" value={result.minWageReference.toFixed(1)} unit="元/小时" />
              <Metric label="差额" value={diff.toFixed(1)} unit="元/小时" />
              <div className="border-l border-white/20 pl-7">
                <p className="font-bold">风险等级</p>
                <span className={`mt-5 inline-flex rounded-xl px-5 py-3 text-lg font-black ${needsAttention ? 'bg-[#ef4444]' : 'bg-white text-[#0b7a3b]'}`}>
                  {needsAttention ? '需要关注' : '正常参考'}
                </span>
                <p className="mt-4 text-sm leading-6 text-white/85">
                  {needsAttention ? '低于参考线，建议重点关注' : '高于参考线，继续保留记录'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/20 px-8 py-4 text-sm text-white/85">
              <span>◇ 参考依据：当地最低工资标准、行业普通水平及相关法律规定综合测算</span>
              <span>测算时间：2024-06-01 10:30</span>
            </div>
          </section>

          <section className="rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#111827]">收入与成本明细（测算周期内）</h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-[#eadfce]">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[#faf7ef] text-[#475467]">
                  <tr>
                    <th className="px-4 py-3 text-left">项目</th>
                    <th className="px-4 py-3 text-left">明细</th>
                    <th className="px-4 py-3 text-right">金额（元）</th>
                    <th className="px-4 py-3 text-right">占比</th>
                    <th className="px-4 py-3 text-left">说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eadfce]">
                  <Row name="订单收入" detail="完成订单收入" amount={input.totalEarnings} ratio="63.9%" note="包含配送费、服务费等" />
                  <Row name="奖励补贴" detail="高峰奖励、时段补贴等" amount={input.subsidies + input.rewards} ratio="15.0%" note="平台发放的各类奖励与补贴" />
                  <Row name="其他收入" detail="活动补贴、打赏等" amount={218} ratio="2.5%" note="非固定收入" />
                  <Row highlight name="收入小计（A）" detail="" amount={result.grossIncome + 218} ratio="81.4%" note="" />
                  <Row negative name="扣款" detail="超时扣款、违规扣款等" amount={-input.deductions} ratio="4.7%" note="平台扣除的各类费用" />
                  <Row negative name="成本" detail="装备、餐食、交通等" amount={-input.costs} ratio="12.3%" note="合理必要成本" />
                  <Row highlight name="净收入（B = A - 扣款 - 成本）" detail="" amount={result.netIncome} ratio="64.4%" note="" />
                </tbody>
              </table>
            </div>
            <div className="mt-5 grid rounded-xl border border-[#eadfce] py-5 text-center text-sm md:grid-cols-4">
              <InlineMetric label="在线时长（含接单时长）" value={input.onlineHours.toFixed(1)} unit="小时" />
              <InlineMetric label="实际时薪（净收入 ÷ 在线时长）" value={result.hourlyRate.toFixed(1)} unit="元/小时" green />
              <InlineMetric label="城市参考线" value={result.minWageReference.toFixed(1)} unit="元/小时" green />
              <InlineMetric label="差额" value={diff.toFixed(1)} unit="元/小时" red={needsAttention} />
            </div>
            <p className="mt-3 text-xs text-[#98a2b3]">* 在线时长为系统记录的接单在线时长，包含接单、配送及中途等待时间。</p>
          </section>

          <div className="grid gap-5 md:grid-cols-3">
            <MiniCard title="为什么会偏低？" action="查看详情分析">
              <ul className="list-disc space-y-1 pl-5">
                <li>订单单价整体偏低，基础配送费不足</li>
                <li>高峰时段单量不足，奖励补贴偏少</li>
                <li>等待时间较长，非接单时间占比高</li>
                <li>成本支出较高，压缩实际收入</li>
              </ul>
            </MiniCard>
            <MiniCard title="建议保留材料" action="查看证据清单">
              <ul className="list-disc space-y-1 pl-5">
                <li>接单记录/流水明细（平台截图）</li>
                <li>收入到账记录（微信/支付宝等）</li>
                <li>奖惩通知、违规扣款记录</li>
                <li>工作时长记录（打卡、系统记录等）</li>
              </ul>
            </MiniCard>
            <MiniCard title="下一步怎么做？" action="查看维权路径">
              <ol className="space-y-2">
                <li><b className="mr-2 text-[#0b7a3b]">1</b>整理并保存证据材料</li>
                <li><b className="mr-2 text-[#0b7a3b]">2</b>向平台申请核查与说明</li>
                <li><b className="mr-2 text-[#0b7a3b]">3</b>如未改善，申请法律援助或投诉</li>
                <li><b className="mr-2 text-[#0b7a3b]">4</b>必要时依法通过劳动仲裁维权</li>
              </ol>
            </MiniCard>
          </div>
        </main>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#eadfce] bg-white p-6 text-center">
            <p className="text-sm text-[#667085]">遇到问题？我们来帮你</p>
            <h2 className="mt-2 text-3xl font-black text-[#111827]">拨打 12348</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">全国法律援助热线（免费）<br />工作日 9:00-12:00 13:00-17:00</p>
            <a href="tel:12348" className="mt-5 flex h-12 items-center justify-center rounded-xl bg-[#0b7a3b] font-bold text-white">
              拨打热线
            </a>
            <Link href="/legal-aid" className="mt-4 inline-flex text-sm font-bold text-[#0b7a3b]">也可 在线申请法律援助 ›</Link>
          </section>

          <section className="rounded-2xl border border-[#dfe8df] bg-[#f7faf7] p-6">
            <p className="text-sm text-[#667085]">整理证据更有力</p>
            <h2 className="mt-2 text-2xl font-black text-[#111827]">整理证据清单</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">根据你的情况，生成个性化证据清单，一键下载保存。</p>
            <Link href="/evidence" className="mt-5 inline-flex h-11 items-center rounded-xl border border-[#0b7a3b] px-6 text-sm font-bold text-[#0b7a3b]">
              生成证据清单
            </Link>
          </section>

          <section className="rounded-2xl border border-[#d8e9ff] bg-[#f4f9ff] p-6">
            <p className="text-sm text-[#2563eb]">了解你的权利</p>
            <h2 className="mt-2 text-2xl font-black text-[#1d4ed8]">查看相关法规</h2>
            <p className="mt-2 text-sm leading-6 text-[#475467]">快速查找与权益相关的法律法规与政策条款。</p>
            <Link href="/regulations" className="mt-5 inline-flex h-11 items-center rounded-xl border border-[#2563eb] px-6 text-sm font-bold text-[#1d4ed8]">
              查看法规库
            </Link>
          </section>

          <section className="rounded-2xl border border-[#eadfce] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#111827]">测算信息</h2>
              <Link href="/calculator" className="text-sm font-bold text-[#0b7a3b]">编辑测算 ›</Link>
            </div>
            <div className="mt-5 space-y-4 text-sm text-[#667085]">
              <p>测算周期：2024-05-01 至 2024-05-31（31天）</p>
              <p>所在城市：{input.city}</p>
              <p>计算方式：参考当地最低工资标准与行业水平</p>
            </div>
          </section>
        </aside>
      </div>

      <section className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] px-6 py-4 text-sm leading-6 text-[#9a3412]">
        <b>重要提示：</b>本测算结果仅供参考，基于您提供的信息和公开数据进行估算，不代表对劳动关系、工资构成等的法律认定。具体权益以劳动仲裁、法院等有权机关的认定为准。
      </section>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="border-l border-white/20 pl-7">
      <p className="font-bold">{label}</p>
      <p className="mt-5 text-5xl font-black leading-none">{value}</p>
      <p className="mt-3 text-lg font-bold">{unit}</p>
    </div>
  );
}

function InlineMetric({
  label,
  value,
  unit,
  green,
  red,
}: {
  label: string;
  value: string;
  unit: string;
  green?: boolean;
  red?: boolean;
}) {
  return (
    <div className="border-r border-[#eadfce] px-4 last:border-r-0">
      <p className="text-[#475467]">{label}</p>
      <p className={`mt-2 text-2xl font-black ${red ? 'text-[#ef4444]' : green ? 'text-[#0b7a3b]' : 'text-[#111827]'}`}>
        {value} <span className="text-sm font-medium text-[#475467]">{unit}</span>
      </p>
    </div>
  );
}

function Row({
  name,
  detail,
  amount,
  ratio,
  note,
  highlight,
  negative,
}: {
  name: string;
  detail: string;
  amount: number;
  ratio: string;
  note: string;
  highlight?: boolean;
  negative?: boolean;
}) {
  return (
    <tr className={highlight ? 'bg-[#f1f8eb] font-bold' : ''}>
      <td className="px-4 py-3 font-bold text-[#111827]">{name}</td>
      <td className="px-4 py-3 text-[#667085]">{detail}</td>
      <td className={`px-4 py-3 text-right font-black ${negative ? 'text-[#ef4444]' : 'text-[#0b7a3b]'}`}>
        {amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 text-right text-[#344054]">{ratio}</td>
      <td className="px-4 py-3 text-[#667085]">{note}</td>
    </tr>
  );
}
