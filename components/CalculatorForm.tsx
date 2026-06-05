'use client';

import { useState, useEffect } from 'react';
import type { CalculatorInput, CalculatorResult } from '@/data/types';
import { minWageData } from '@/data/minWage';
import { calculateSalary } from '@/lib/calculator';
import CalculatorResultDisplay from './CalculatorResult';
import DisclaimerBox from './DisclaimerBox';

const CITY_OPTIONS = minWageData.map((wage) => ({
  city: wage.city,
  isVerified: wage.lastVerified !== '待核实',
}));

const PERIOD_OPTIONS: { value: CalculatorInput['period']; label: string }[] = [
  { value: 'day', label: '按天算' },
  { value: 'week', label: '按周算' },
  { value: 'month', label: '按月算' },
];

const DEFAULT_INPUT: CalculatorInput = {
  city: '上海',
  period: 'day',
  orders: 30,
  avgIncomePerOrder: 7,
  subsidies: 0,
  rewards: 0,
  deductions: 0,
  costs: 0,
  onlineHours: 10,
};

/**
 * 从 localStorage 恢复上次输入。仅在客户端挂载后调用，
 * 避免 SSR/CSR 水合不匹配。
 * 对数字字段做类型校验，防止篡改 localStorage 导致 NaN。
 */
function restoreFromStorage(): CalculatorInput {
  try {
    const saved = localStorage.getItem('calculator-input');
    if (!saved) {
      return DEFAULT_INPUT;
    }

    const parsed = JSON.parse(saved) as Partial<CalculatorInput>;
    const result = { ...DEFAULT_INPUT, ...parsed };

    // 校验数字字段：非 number 或 NaN 时回退到默认值
    const numericKeys: (keyof CalculatorInput)[] = [
      'orders', 'avgIncomePerOrder', 'subsidies',
      'rewards', 'deductions', 'costs', 'onlineHours',
    ];
    for (const key of numericKeys) {
      if (typeof result[key] !== 'number' || Number.isNaN(result[key])) {
        (result as Record<string, unknown>)[key] = DEFAULT_INPUT[key];
      }
    }

    return result;
  } catch {
    return DEFAULT_INPUT;
  }
}

export default function CalculatorForm() {
  // 初始化始终使用默认值，确保 SSR 和 CSR 首次渲染一致
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT);
  const [storageReady, setStorageReady] = useState(false);

  // 客户端挂载后从 localStorage 恢复，避免水合不匹配
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setInput(restoreFromStorage());
      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle'
  );
  const selectedMinWage = minWageData.find((w) => w.city === input.city);
  const selectedMinWageVerified = Boolean(
    selectedMinWage && selectedMinWage.lastVerified !== '待核实'
  );
  const selectedMinWageHasOfficialSource = Boolean(
    selectedMinWageVerified && selectedMinWage?.sourceUrl
  );

  // 保存到 localStorage（可选）
  useEffect(() => {
    if (!storageReady) {
      return;
    }

    try {
      localStorage.setItem('calculator-input', JSON.stringify(input));
    } catch {
      // 忽略
    }
  }, [input, storageReady]);

  const handleCalculate = () => {
    const r = calculateSalary(input, minWageData);
    setResult(r);
    setShowResult(true);
    setCopyStatus('idle');
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResult(null);
    setShowResult(false);
  };

  const updateField = <K extends keyof CalculatorInput>(
    key: K,
    value: CalculatorInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopyResult = async () => {
    if (!result) {
      return;
    }

    const text = formatResultForCopy(result, input);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopyStatus('copied');
      } else {
        const success = copyTextWithTextarea(text);
        setCopyStatus(success ? 'copied' : 'failed');
      }
    } catch {
      const success = copyTextWithTextarea(text);
      setCopyStatus(success ? 'copied' : 'failed');
    }
  };

  return (
    <div className="space-y-4">
      {/* 输入表单 */}
      {!showResult ? (
        <div className="space-y-4">
          {/* 城市 */}
          <div>
            <label
              htmlFor="calc-city"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              所在城市 <span className="text-red-500">*</span>
            </label>
            <select
              id="calc-city"
              value={input.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {CITY_OPTIONS.map((option) => (
                <option key={option.city} value={option.city}>
                  {option.isVerified ? option.city : `${option.city}（待核实）`}
                </option>
              ))}
            </select>
            {selectedMinWage && (
              <div className="mt-1 text-xs leading-5 text-gray-500">
                <p>
                  {selectedMinWageVerified
                    ? `小时最低工资参考线：${selectedMinWage.hourly} 元/小时（生效日期 ${selectedMinWage.effectiveDate}）`
                    : '该城市最低工资数据待核实，暂不参与风险判断。'}
                </p>
                {selectedMinWage.scopeNote && (
                  <p>适用范围/说明：{selectedMinWage.scopeNote}</p>
                )}
                <p>
                  数据核验：
                  {selectedMinWage.lastVerified === '待核实'
                    ? '待核实'
                    : selectedMinWage.lastVerified}
                  {selectedMinWageHasOfficialSource ? (
                    <>
                      {' · '}
                      <a
                        href={selectedMinWage.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 underline underline-offset-2"
                      >
                        {selectedMinWage.sourceName}
                      </a>
                    </>
                  ) : (
                    <>
                      {' · '}
                      <span>官方来源待核实</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* 统计周期 */}
          <fieldset>
            <legend className="mb-1 block text-sm font-medium text-gray-700">
              统计周期 <span className="text-red-500">*</span>
            </legend>
            <div
              className="flex gap-2"
              role="radiogroup"
              aria-label="统计周期"
              onKeyDown={(e) => {
                const options = PERIOD_OPTIONS.map((o) => o.value);
                const currentIndex = options.indexOf(input.period);
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  const next = options[(currentIndex + 1) % options.length];
                  updateField('period', next);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  const prev = options[(currentIndex - 1 + options.length) % options.length];
                  updateField('period', prev);
                }
              }}
            >
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={input.period === opt.value}
                  tabIndex={input.period === opt.value ? 0 : -1}
                  onClick={() => updateField('period', opt.value)}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    input.period === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* 核心输入 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="calc-orders"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                订单数 <span className="text-red-500">*</span>
              </label>
              <input
                id="calc-orders"
                type="number"
                inputMode="numeric"
                min="0"
                max="9999"
                value={input.orders}
                onChange={(e) =>
                  updateField('orders', Math.max(0, Number(e.target.value)))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="calc-avg-income"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                平均每单收入 <span className="text-red-500">*</span>
              </label>
              <input
                id="calc-avg-income"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                max="9999"
                value={input.avgIncomePerOrder}
                onChange={(e) =>
                  updateField(
                    'avgIncomePerOrder',
                    Math.max(0, Number(e.target.value))
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="calc-hours"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              在线接单小时数 <span className="text-red-500">*</span>
            </label>
            <input
              id="calc-hours"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              max={input.period === 'day' ? 24 : input.period === 'week' ? 168 : 744}
              value={input.onlineHours}
              onChange={(e) =>
                updateField(
                  'onlineHours',
                  Math.max(0, Number(e.target.value))
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 可选输入 */}
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-sm font-medium text-gray-700">
              补充信息（可选）
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="calc-subsidies"
                  className="mb-0.5 block text-xs text-gray-500"
                >
                  补贴总额
                </label>
                <input
                  id="calc-subsidies"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={input.subsidies}
                  onChange={(e) =>
                    updateField(
                      'subsidies',
                      Math.max(0, Number(e.target.value))
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="calc-rewards"
                  className="mb-0.5 block text-xs text-gray-500"
                >
                  奖励总额
                </label>
                <input
                  id="calc-rewards"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={input.rewards}
                  onChange={(e) =>
                    updateField(
                      'rewards',
                      Math.max(0, Number(e.target.value))
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="calc-deductions"
                  className="mb-0.5 block text-xs text-gray-500"
                >
                  扣款/罚款
                </label>
                <input
                  id="calc-deductions"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={input.deductions}
                  onChange={(e) =>
                    updateField(
                      'deductions',
                      Math.max(0, Number(e.target.value))
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="calc-costs"
                  className="mb-0.5 block text-xs text-gray-500"
                >
                  成本（油费/电费等）
                </label>
                <input
                  id="calc-costs"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={input.costs}
                  onChange={(e) =>
                    updateField('costs', Math.max(0, Number(e.target.value)))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
            >
              开始测算
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-gray-300 px-4 py-3 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              重置
            </button>
          </div>
        </div>
      ) : (
        /* 结果展示 */
        result && (
          <div className="space-y-4">
            <CalculatorResultDisplay result={result} input={input} />
            <DisclaimerBox />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowResult(false);
                  setCopyStatus('idle');
                }}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                重新填写
              </button>
              <button
                type="button"
                onClick={handleCopyResult}
                className="flex-1 rounded-xl bg-gray-800 px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-gray-900 active:bg-gray-900"
              >
                {copyStatus === 'copied'
                  ? '已复制'
                  : copyStatus === 'failed'
                    ? '复制失败'
                    : '复制结果'}
              </button>
            </div>
            {copyStatus !== 'idle' && (
              <p
                className={`text-center text-sm ${
                  copyStatus === 'copied' ? 'text-green-600' : 'text-red-600'
                }`}
                role="status"
              >
                {copyStatus === 'copied'
                  ? '测算结果已复制，可粘贴到聊天或笔记中。'
                  : '复制失败，请手动选中结果保存。'}
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}

function copyTextWithTextarea(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

function formatResultForCopy(
  result: CalculatorResult,
  input: CalculatorInput
): string {
  const periodLabel =
    input.period === 'day' ? '日' : input.period === 'week' ? '周' : '月';
  const selectedMinWage = minWageData.find((wage) => wage.city === input.city);
  const minWageScopeLine = selectedMinWage?.scopeNote
    ? `\n最低工资适用范围/说明：${selectedMinWage.scopeNote}`
    : '';

  return `【骑手薪资测算结果】

城市：${input.city}
统计周期：按${periodLabel}

毛收入：${result.grossIncome.toFixed(2)} 元
净收入：${result.netIncome.toFixed(2)} 元
时薪：${result.hourlyRate.toFixed(2)} 元/小时
折算月收入：${result.monthlyEquivalent.toFixed(2)} 元（粗略估算，仅供参考）

当地小时最低工资参考线：${
    result.minWageReference > 0
      ? `${result.minWageReference} 元/小时`
      : '暂无已核验数据'
  }${minWageScopeLine}
风险等级：${riskLabel(result.riskLevel)}

${result.riskMessage}

免责声明：本测算结果仅供参考，不构成法律意见。最低工资参考线不代表法律判决或对平台是否违法的认定。具体维权请咨询 12348 或当地法律援助中心。`;
}

function riskLabel(level: CalculatorResult['riskLevel']): string {
  switch (level) {
    case 'green':
      return '✅ 正常参考';
    case 'yellow':
      return '⚠️ 略低于参考线';
    case 'red':
      return '🔴 明显低于参考线';
    case 'gray':
      return '⚪ 无已核验数据';
  }
}
