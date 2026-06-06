import type { CalculatorResult, CalculatorInput } from '@/data/types';
import Link from 'next/link';

interface Props {
  result: CalculatorResult;
  input: CalculatorInput;
}

const RISK_CONFIG = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: '✅',
    title: '正常参考',
    titleColor: 'text-green-800',
  },
  yellow: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: '⚠️',
    title: '略低于参考线',
    titleColor: 'text-amber-800',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: '🔴',
    title: '明显低于参考线',
    titleColor: 'text-red-800',
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: '⚪',
    title: '无已核验城市数据',
    titleColor: 'text-gray-600',
  },
};

export default function CalculatorResultDisplay({ result, input }: Props) {
  const risk = RISK_CONFIG[result.riskLevel];
  const periodLabel =
    input.period === 'day' ? '日' : input.period === 'week' ? '周' : '月';

  return (
    <div className="space-y-4">
      {/* 风险等级大卡片 */}
      <div className={`rounded-xl border p-4 ${risk.bg} ${risk.border}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{risk.icon}</span>
          <h2 className={`text-lg font-bold ${risk.titleColor}`}>
            {risk.title}
          </h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          {result.riskMessage}
        </p>
      </div>

      {/* 核心数字 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <p className="text-xs text-gray-500">毛收入</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            ¥{result.grossIncome.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            {input.orders}单 × ¥{input.avgIncomePerOrder} + 补贴奖励
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <p className="text-xs text-gray-500">净收入</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            ¥{result.netIncome.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            毛收入 − 扣款 − 成本
          </p>
        </div>
      </div>

      {/* 时薪 — 核心输出 */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 shadow-sm">
        <p className="text-sm font-medium text-blue-700">你的时薪（核心指标）</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-900">
            ¥{result.hourlyRate.toFixed(2)}
          </span>
          <span className="text-sm text-blue-600">/小时</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-gray-600">当地参考线：</span>
          <span className="font-semibold text-gray-900">
            {result.minWageReference > 0
              ? `¥${result.minWageReference} /小时`
              : '暂无已核验数据'}
          </span>
          {result.minWageReference > 0 && (
            <span
              className={`font-medium ${
                result.hourlyRate >= result.minWageReference
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {result.hourlyRate >= result.minWageReference ? '≥' : '<'} 参考线
            </span>
          )}
        </div>
      </div>

      {/* 折算月收入 */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <p className="text-xs text-gray-500">折算月收入（粗略估算，仅供参考）</p>
        <p className="mt-1 text-xl font-bold text-gray-900">
          ¥{result.monthlyEquivalent.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">
          按{periodLabel}收入折算（{input.period === 'day' ? '×26天' : input.period === 'week' ? '×4.33周' : '当月实际'}）
        </p>
      </div>

      {/* 下一步引导：低薪时提供行动入口 */}
      {(result.riskLevel === 'yellow' || result.riskLevel === 'red') && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">下一步可以这样做</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link
              href="/legal-aid"
              className="rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              找法援入口
            </Link>
            <Link
              href="/chat"
              className="rounded-lg border border-blue-300 bg-white px-3 py-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-50"
            >
              问 AI 助手
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
