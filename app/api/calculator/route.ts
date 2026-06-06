import { calculateSalary } from '@/lib/calculator';
import { minWageData } from '@/data/minWage';
import type { CalculatorInput } from '@/data/types';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<CalculatorInput>;

    // 必填字段校验
    if (!body.city || !body.period || typeof body.orders !== 'number') {
      return NextResponse.json(
        { error: '缺少必填字段：city, period, orders' },
        { status: 400 }
      );
    }

    const input: CalculatorInput = {
      city: body.city,
      period: body.period,
      orders: Math.max(0, body.orders),
      avgIncomePerOrder: Math.max(0, body.avgIncomePerOrder ?? 0),
      subsidies: Math.max(0, body.subsidies ?? 0),
      rewards: Math.max(0, body.rewards ?? 0),
      deductions: Math.max(0, body.deductions ?? 0),
      costs: Math.max(0, body.costs ?? 0),
      onlineHours: Math.max(0, body.onlineHours ?? 0),
    };

    const result = calculateSalary(input, minWageData);

    return NextResponse.json({
      data: result,
      input,
    });
  } catch {
    return NextResponse.json(
      { error: '请求格式不正确' },
      { status: 400 }
    );
  }
}
