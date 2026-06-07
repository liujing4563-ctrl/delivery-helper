import { describe, it, expect } from 'vitest';
import {
  searchRegulations,
  getMinimumWage,
  findLegalAid,
  calculateHourlyRate,
} from './chat-tools';

// 工具测试：直接调用 execute 函数
describe('searchRegulations', () => {
  it('搜索"工伤"返回相关法规', async () => {
    const result = await searchRegulations.execute(
      { keyword: '工伤' },
      { abortSignal: new AbortController().signal, toolCallId: 'test-1', messages: [] },
    );
    expect(result).toContain('工伤');
    expect(result.length).toBeGreaterThan(50);
  });

  it('搜索不存在的关键词返回提示', async () => {
    const result = await searchRegulations.execute(
      { keyword: 'xyzabc不存在' },
      { abortSignal: new AbortController().signal, toolCallId: 'test-2', messages: [] },
    );
    expect(result).toContain('未找到');
  });

  it('搜索"最低工资"返回相关法规', async () => {
    const result = await searchRegulations.execute(
      { keyword: '最低工资' },
      { abortSignal: new AbortController().signal, toolCallId: 'test-3', messages: [] },
    );
    expect(result).toContain('最低工资');
  });
});

describe('getMinimumWage', () => {
  it('查询"上海"返回最低工资数据', async () => {
    const result = await getMinimumWage.execute(
      { city: '上海' },
      { abortSignal: new AbortController().signal, toolCallId: 'test-4', messages: [] },
    );
    expect(result).toContain('上海');
    expect(result).toContain('元');
    expect(result).toContain('已核验');
  });

  it('查询不存在的城市返回提示和可用城市列表', async () => {
    const result = await getMinimumWage.execute(
      { city: '不存在的城市' },
      { abortSignal: new AbortController().signal, toolCallId: 'test-5', messages: [] },
    );
    expect(result).toContain('未找到');
    expect(result).toContain('12333');
  });
});

describe('findLegalAid', () => {
  it('查询"北京"返回法援中心信息', async () => {
    const result = await findLegalAid.execute(
      { city: '北京' },
      { abortSignal: new AbortController().signal, toolCallId: 'test-6', messages: [] },
    );
    expect(result).toContain('北京');
    expect(result).toContain('已核验');
  });

  it('查询不存在的城市返回提示和12348热线', async () => {
    const result = await findLegalAid.execute(
      { city: '不存在的城市' },
      { abortSignal: new AbortController().signal, toolCallId: 'test-7', messages: [] },
    );
    expect(result).toContain('未找到');
    expect(result).toContain('12348');
  });
});

describe('calculateHourlyRate', () => {
  it('计算日薪并返回时薪', async () => {
    const result = await calculateHourlyRate.execute(
      {
        city: '上海',
        totalEarnings: 300,
        onlineHours: 10,
        period: 'day',
        subsidies: 0,
        rewards: 0,
        deductions: 0,
        costs: 0,
      },
      { abortSignal: new AbortController().signal, toolCallId: 'test-8', messages: [] },
    );
    expect(result).toContain('时薪');
    expect(result).toContain('30.00');
    expect(result).toContain('green');
    expect(result).toContain('达标');
  });

  it('低于最低工资返回红色风险', async () => {
    const result = await calculateHourlyRate.execute(
      {
        city: '上海',
        totalEarnings: 50,
        onlineHours: 10,
        period: 'day',
        subsidies: 0,
        rewards: 0,
        deductions: 10,
        costs: 5,
      },
      { abortSignal: new AbortController().signal, toolCallId: 'test-9', messages: [] },
    );
    expect(result).toContain('red');
    expect(result).toContain('低于');
  });

  it('无城市数据时返回灰色风险', async () => {
    const result = await calculateHourlyRate.execute(
      {
        city: '未知城市',
        totalEarnings: 200,
        onlineHours: 8,
        period: 'day',
        subsidies: 0,
        rewards: 0,
        deductions: 0,
        costs: 0,
      },
      { abortSignal: new AbortController().signal, toolCallId: 'test-10', messages: [] },
    );
    expect(result).toContain('gray');
    expect(result).toContain('暂无');
  });
});
