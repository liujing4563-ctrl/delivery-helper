import { describe, it, expect } from 'vitest';
import { calculateSalary } from '../calculator';
import type { CalculatorInput, MinWage } from '@/data/types';

const mockMinWageData: MinWage[] = [
  {
    city: '上海',
    monthly: 2690,
    hourly: 24,
    effectiveDate: '2023-07-01',
    sourceName: '上海市人社局',
    sourceUrl: 'https://example.com',
    lastVerified: '2026-06-01',
  },
  {
    city: '待核实城市',
    monthly: 2000,
    hourly: 20,
    effectiveDate: '2023-01-01',
    sourceName: '待核实',
    sourceUrl: '',
    lastVerified: '待核实',
  },
];

function makeInput(overrides: Partial<CalculatorInput> = {}): CalculatorInput {
  return {
    city: '上海',
    period: 'day',
    orders: 30,
    avgIncomePerOrder: 7,
    subsidies: 0,
    rewards: 0,
    deductions: 0,
    costs: 0,
    onlineHours: 10,
    ...overrides,
  };
}

describe('calculateSalary', () => {
  it('基本日收入计算', () => {
    const result = calculateSalary(makeInput(), mockMinWageData);
    expect(result.grossIncome).toBe(210); // 30 * 7
    expect(result.netIncome).toBe(210); // 无扣款
    expect(result.hourlyRate).toBe(21); // 210 / 10
    expect(result.minWageReference).toBe(24);
    expect(result.riskLevel).toBe('yellow'); // 21 >= 24*0.8=19.2, < 24
  });

  it('带扣款和成本', () => {
    const result = calculateSalary(
      makeInput({ deductions: 30, costs: 20 }),
      mockMinWageData
    );
    expect(result.grossIncome).toBe(210);
    expect(result.netIncome).toBe(160); // 210 - 30 - 20
    expect(result.hourlyRate).toBe(16); // 160 / 10
    expect(result.riskLevel).toBe('red'); // 16 < 24*0.8=19.2
  });

  it('带补贴和奖励', () => {
    const result = calculateSalary(
      makeInput({ subsidies: 50, rewards: 30 }),
      mockMinWageData
    );
    expect(result.grossIncome).toBe(290); // 210 + 50 + 30
    expect(result.netIncome).toBe(290);
    expect(result.hourlyRate).toBe(29);
    expect(result.riskLevel).toBe('green'); // 29 >= 24
  });

  it('零小时不除零', () => {
    const result = calculateSalary(
      makeInput({ onlineHours: 0 }),
      mockMinWageData
    );
    expect(result.hourlyRate).toBe(0);
    expect(result.riskLevel).toBe('red'); // 0 < 24
  });

  it('零订单', () => {
    const result = calculateSalary(
      makeInput({ orders: 0 }),
      mockMinWageData
    );
    expect(result.grossIncome).toBe(0);
    expect(result.netIncome).toBe(0);
    expect(result.hourlyRate).toBe(0);
  });

  it('月收入折算 — 按天', () => {
    const result = calculateSalary(makeInput({ period: 'day' }), mockMinWageData);
    expect(result.monthlyEquivalent).toBe(210 * 26);
  });

  it('月收入折算 — 按周', () => {
    const result = calculateSalary(makeInput({ period: 'week' }), mockMinWageData);
    expect(result.monthlyEquivalent).toBeCloseTo(210 * 4.33, 1);
  });

  it('月收入折算 — 按月', () => {
    const result = calculateSalary(makeInput({ period: 'month' }), mockMinWageData);
    expect(result.monthlyEquivalent).toBe(210);
  });

  it('待核实城市返回 gray', () => {
    const result = calculateSalary(
      makeInput({ city: '待核实城市' }),
      mockMinWageData
    );
    expect(result.minWageReference).toBe(0);
    expect(result.riskLevel).toBe('gray');
  });

  it('不存在的城市返回 gray', () => {
    const result = calculateSalary(
      makeInput({ city: '不存在的城市' }),
      mockMinWageData
    );
    expect(result.minWageReference).toBe(0);
    expect(result.riskLevel).toBe('gray');
  });

  it('负净收入保持 red', () => {
    const result = calculateSalary(
      makeInput({ deductions: 500 }),
      mockMinWageData
    );
    expect(result.netIncome).toBe(-290);
    expect(result.hourlyRate).toBe(-29);
    expect(result.riskLevel).toBe('red');
  });

  it('恰好等于最低工资返回 green', () => {
    const result = calculateSalary(
      makeInput({ orders: 40, avgIncomePerOrder: 6, onlineHours: 10 }),
      mockMinWageData
    );
    // 40*6 = 240, 240/10 = 24, == minWage
    expect(result.hourlyRate).toBe(24);
    expect(result.riskLevel).toBe('green');
  });
});
