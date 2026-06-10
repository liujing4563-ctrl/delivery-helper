'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CalculatorInput, CalculatorResult } from '@/data/types';
import { minWageData } from '@/data/minWage';
import { calculateSalary } from '@/lib/calculator';
import CalculatorResultDisplay from './CalculatorResult';

const periodOptions: { value: CalculatorInput['period']; label: string }[] = [
  { value: 'day', label: '按天' },
  { value: 'week', label: '按周' },
  { value: 'month', label: '按月' },
];

const defaultInput: CalculatorInput = {
  city: '北京',
  period: 'day',
  totalEarnings: 279,
  subsidies: 60,
  rewards: 35,
  deductions: 17,
  costs: 30,
  onlineHours: 9.5,
};

type ExtraInput = {
  orders: number;
  avgOrderIncome: number;
  activeHours: number;
};

const defaultExtra: ExtraInput = {
  orders: 45,
  avgOrderIncome: 6.2,
  activeHours: 7.8,
};

function restoreFromStorage(): { input: CalculatorInput; extra: ExtraInput } {
  try {
    const saved = localStorage.getItem('calculator-input-green');
    if (!saved) return { input: defaultInput, extra: defaultExtra };
    const parsed = JSON.parse(saved) as Partial<{ input: CalculatorInput; extra: ExtraInput }>;
    return {
      input: { ...defaultInput, ...parsed.input },
      extra: { ...defaultExtra, ...parsed.extra },
    };
  } catch {
    return { input: defaultInput, extra: defaultExtra };
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

function SectionTitle({ number, title }: { number: number; title: string }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-black text-[#111827]">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b7a3b] text-xs font-black text-white">
        {number}
      </span>
      {title}
    </h2>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  step = 0.1,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[#344054]">
        {label} <span className="text-[#98a2b3]">ⓘ</span>
      </span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        step={step}
        value={value}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
        className="h-11 w-full rounded-lg border border-[#d8dee8] bg-white px-4 text-base text-[#111827] outline-none focus:border-[#0b7a3b] focus:ring-2 focus:ring-[#dff4e8]"
      />
    </label>
  );
}

function SideCard({
  title,
  children,
  tone = 'green',
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'green' | 'amber';
}) {
  return (
    <section className={`rounded-2xl border p-6 ${tone === 'green' ? 'border-[#dfe8df] bg-white' : 'border-[#fed7aa] bg-[#fff7ed]'}`}>
      <h2 className="flex items-center gap-3 text-xl font-black text-[#111827]">
        <ShieldIcon className={`h-7 w-7 ${tone === 'green' ? 'text-[#0b7a3b]' : 'text-[#b45309]'}`} />
        {title}
      </h2>
      <div className="mt-4 text-sm leading-7 text-[#344054]">{children}</div>
    </section>
  );
}

export default function CalculatorForm() {
  const [input, setInput] = useState(defaultInput);
  const [extra, setExtra] = useState(defaultExtra);
  const [storageReady, setStorageReady] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const restored = restoreFromStorage();
      setInput(restored.input);
      setExtra(restored.extra);
      setStorageReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem('calculator-input-green', JSON.stringify({ input, extra }));
    } catch {
      // 本地存储失败时不影响测算
    }
  }, [input, extra, storageReady]);

  const selectedMinWage = useMemo(
    () => minWageData.find((item) => item.city === input.city),
    [input.city]
  );

  const derivedInput = useMemo<CalculatorInput>(
    () => ({
      ...input,
      totalEarnings: Number((extra.orders * extra.avgOrderIncome).toFixed(2)),
      onlineHours: input.onlineHours,
    }),
    [input, extra]
  );

  const updateInput = <K extends keyof CalculatorInput>(key: K, value: CalculatorInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const updateExtra = <K extends keyof ExtraInput>(key: K, value: ExtraInput[K]) => {
    setExtra((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = () => {
    setResult(calculateSalary(derivedInput, minWageData));
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleReset = () => {
    setInput(defaultInput);
    setExtra(defaultExtra);
    setResult(null);
  };

  if (result) {
    return <CalculatorResultDisplay result={result} input={derivedInput} />;
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_430px]">
      <form
        className="rounded-2xl border border-[#d8dee8] bg-white p-6 md:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          handleCalculate();
        }}
      >
        <section>
          <SectionTitle number={1} title="基本信息" />
          <div className="mt-5 grid gap-7 md:grid-cols-3">
            <label htmlFor="calc-city" className="block">
              <span className="mb-2 block text-sm font-medium text-[#344054]">所在城市</span>
              <select
                id="calc-city"
                value={input.city}
                onChange={(event) => updateInput('city', event.target.value)}
                className="h-11 w-full rounded-lg border border-[#d8dee8] bg-white px-4 text-base text-[#111827] outline-none focus:border-[#0b7a3b] focus:ring-2 focus:ring-[#dff4e8]"
              >
                {minWageData.map((wage) => (
                  <option key={wage.city} value={wage.city}>
                    {wage.city}
                  </option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-[#344054]">统计周期</legend>
              <div className="grid h-11 grid-cols-3 overflow-hidden rounded-lg border border-[#d8dee8]">
                {periodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateInput('period', option.value)}
                    className={`border-r border-[#d8dee8] text-sm font-bold last:border-r-0 ${
                      input.period === option.value ? 'bg-[#e8f6ee] text-[#0b7a3b]' : 'bg-white text-[#344054]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <label htmlFor="calc-date" className="block">
              <span className="mb-2 block text-sm font-medium text-[#344054]">统计日期</span>
              <input
                id="calc-date"
                type="date"
                defaultValue="2024-05-16"
                className="h-11 w-full rounded-lg border border-[#d8dee8] bg-white px-4 text-base text-[#344054] outline-none focus:border-[#0b7a3b]"
              />
            </label>
          </div>
        </section>

        <div className="my-7 h-px bg-[#eadfce]" />

        <section>
          <SectionTitle number={2} title="收入（税前）" />
          <div className="mt-5 grid gap-7 md:grid-cols-4">
            <Field id="calc-orders" label="完成订单数（单）" value={extra.orders} onChange={(value) => updateExtra('orders', value)} step={1} />
            <Field id="calc-avg" label="平均每单收入（元）" value={extra.avgOrderIncome} onChange={(value) => updateExtra('avgOrderIncome', value)} />
            <Field id="calc-subsidy" label="基础补贴（元）" value={input.subsidies} onChange={(value) => updateInput('subsidies', value)} />
            <Field id="calc-rewards" label="额外奖励/活动奖励（元）" value={input.rewards} onChange={(value) => updateInput('rewards', value)} />
          </div>
        </section>

        <section className="mt-8">
          <SectionTitle number={3} title="扣除项" />
          <div className="mt-5 grid gap-7 md:grid-cols-3">
            <Field id="calc-deductions" label="平台罚款 / 扣款（元）" value={input.deductions} onChange={(value) => updateInput('deductions', value)} />
            <Field id="calc-complaint" label="投诉扣款（元）" value={0} onChange={() => undefined} />
            <Field id="calc-deposit" label="物品赔付 / 垫付（元）" value={0} onChange={() => undefined} />
          </div>
        </section>

        <section className="mt-8">
          <SectionTitle number={4} title="成本支出（可选，帮助更准确）" />
          <div className="mt-5 grid gap-7 md:grid-cols-4">
            <Field id="calc-food" label="餐饮 / 饮水等（元）" value={15} onChange={() => undefined} />
            <Field id="calc-traffic" label="交通 / 电动车相关（元）" value={10} onChange={() => undefined} />
            <Field id="calc-costs" label="装备 / 耗材（元）" value={input.costs} onChange={(value) => updateInput('costs', value)} />
            <Field id="calc-other" label="其他支出（元）" value={0} onChange={() => undefined} />
          </div>
        </section>

        <section className="mt-8">
          <SectionTitle number={5} title="在线时长" />
          <div className="mt-5 grid gap-7 md:grid-cols-[1fr_1fr_300px]">
            <Field id="calc-hours" label="在线时长（小时）" value={input.onlineHours} onChange={(value) => updateInput('onlineHours', value)} />
            <Field id="calc-active-hours" label="其中接单时长（小时，选填）" value={extra.activeHours} onChange={(value) => updateExtra('activeHours', value)} />
            <div className="rounded-xl border border-[#fed7aa] bg-[#fffaf0] px-5 py-4 text-sm leading-6 text-[#9a3412]">
              在线时长：从上线接单到下线的时间总和，包括等待、接单、送达等全过程。
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-[1fr_240px]">
          <button
            type="submit"
            className="h-14 rounded-xl bg-[#0b7a3b] text-lg font-black text-white shadow-lg shadow-[#0b7a3b]/20"
          >
            ▣ 计算真实时薪
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="h-14 rounded-xl border border-[#667085] bg-white text-lg font-bold text-[#344054]"
          >
            ↻ 重置
          </button>
        </div>
        <p className="mt-5 text-sm text-[#667085]">🔒 数据默认仅在本地处理，不上传，不保留。</p>
      </form>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-[#dfe8df] bg-[#f7faf7] p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="flex items-center gap-3 text-xl font-black text-[#111827]">
                <ShieldIcon className="h-8 w-8 text-[#0b7a3b]" />
                测算结果（实时参考）
              </h2>
              <p className="mt-1 text-sm text-[#667085]">以下为初步测算结果，仅供参考</p>
            </div>
            <div className="h-24 w-24 rounded-2xl bg-[#dff4e8]" />
          </div>
          <div className="mt-5 text-[#0b7a3b]">
            <span className="text-2xl font-black">¥ </span>
            <span className="text-5xl font-black">{(derivedInput.totalEarnings + input.subsidies + input.rewards - input.deductions - input.costs > 0 ? (derivedInput.totalEarnings + input.subsidies + input.rewards - input.deductions - input.costs) / input.onlineHours : 0).toFixed(1)}</span>
            <span className="ml-2 text-2xl font-bold">/ 小时</span>
          </div>
          <div className="mt-5 space-y-3 border-t border-[#dfe8df] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[#667085]">当地最低工资参考（小时）</span>
              <b className="text-[#0b7a3b]">¥ {selectedMinWage?.hourly.toFixed(1) || '-'}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">对比结果</span>
              <span className="rounded-md bg-[#dff4e8] px-2 py-1 text-xs font-bold text-[#0b7a3b]">实时测算</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#98a2b3]">
            * 参考{input.city}市小时最低工资标准（¥ {selectedMinWage?.hourly.toFixed(1) || '-'} /小时）
          </p>
        </section>

        <SideCard title="建议保留材料">
          <ul className="space-y-2">
            <li>✓ 订单明细截图（含日期、收入、补贴、奖励）</li>
            <li>✓ 平台收入 / 账单明细</li>
            <li>✓ 罚款 / 扣款通知或申诉记录</li>
            <li>✓ 在线时长记录（截图或系统记录）</li>
            <li>✓ 沟通记录（与平台或站点的聊天记录等）</li>
          </ul>
          <a href="/evidence" className="mt-3 inline-flex font-bold text-[#0b7a3b]">查看示例材料 ›</a>
        </SideCard>

        <SideCard title="需要人工咨询时优先拨打">
          <div className="grid grid-cols-[1fr_1fr] gap-4">
            <div>
              <p className="text-3xl font-black text-[#0b7a3b]">12348</p>
              <p className="font-bold text-[#0b7a3b]">全国法律援助热线</p>
            </div>
            <ul className="space-y-1 text-[#344054]">
              <li>免费咨询</li>
              <li>专业解答</li>
              <li>保护隐私</li>
            </ul>
          </div>
          <a href="tel:12348" className="mt-4 flex h-11 items-center justify-center rounded-xl border border-[#0b7a3b] font-bold text-[#0b7a3b]">
            拨打 12348
          </a>
        </SideCard>

        <SideCard title="重要提示" tone="amber">
          <ul className="list-disc space-y-1 pl-5 text-[#9a3412]">
            <li>本工具仅提供测算参考，不构成法律意见。</li>
            <li>各地最低工资标准可能不同，请以当地最新政策为准。</li>
            <li>如遇权益受损，建议及时留存证据并咨询专业机构帮助。</li>
          </ul>
        </SideCard>
      </aside>
    </div>
  );
}
