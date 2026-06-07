import { describe, it, expect } from 'vitest';
import {
  searchRegulations,
  getMinimumWage,
  findLegalAid,
  calculateHourlyRate,
} from './chat-tools';

// 工具测试：直接调用 execute 函数
// execute 在 AI SDK 中类型为可选，但我们的工具始终定义了它
const exec = async <T extends { execute?: Function }>(
  tool: T,
  input: Record<string, unknown>,
) => {
  const ctx = {
    abortSignal: new AbortController().signal,
    toolCallId: `test-${Math.random().toString(36).slice(2)}`,
    messages: [] as never[],
  };
  const result = await tool.execute!(input, ctx);
  return String(result);
};

describe('searchRegulations', () => {
  it('搜索"工伤"返回相关法规', async () => {
    const result = await exec(searchRegulations, { keyword: '工伤' });
    expect(result).toContain('工伤');
    expect(result.length).toBeGreaterThan(50);
  });

  it('搜索不存在的关键词返回提示', async () => {
    const result = await exec(searchRegulations, { keyword: 'xyzabc不存在' });
    expect(result).toContain('未找到');
  });

  it('搜索"最低工资"返回相关法规', async () => {
    const result = await exec(searchRegulations, { keyword: '最低工资' });
    expect(result).toContain('最低工资');
  });
});

describe('getMinimumWage', () => {
  it('查询"上海"返回最低工资数据', async () => {
    const result = await exec(getMinimumWage, { city: '上海' });
    expect(result).toContain('上海');
    expect(result).toContain('元');
    expect(result).toContain('已核验');
  });

  it('查询不存在的城市返回提示和可用城市列表', async () => {
    const result = await exec(getMinimumWage, { city: '不存在的城市' });
    expect(result).toContain('未找到');
    expect(result).toContain('12333');
  });
});

describe('findLegalAid', () => {
  it('查询"北京"返回法援中心信息', async () => {
    const result = await exec(findLegalAid, { city: '北京' });
    expect(result).toContain('北京');
    expect(result).toContain('已核验');
  });

  it('查询不存在的城市返回提示和12348热线', async () => {
    const result = await exec(findLegalAid, { city: '不存在的城市' });
    expect(result).toContain('未找到');
    expect(result).toContain('12348');
  });
});

describe('calculateHourlyRate', () => {
  it('计算日薪并返回时薪', async () => {
    const result = await exec(calculateHourlyRate, {
      city: '上海',
      totalEarnings: 300,
      onlineHours: 10,
      period: 'day',
      subsidies: 0,
      rewards: 0,
      deductions: 0,
      costs: 0,
    });
    expect(result).toContain('时薪');
    expect(result).toContain('30.00');
    expect(result).toContain('green');
    expect(result).toContain('达标');
  });

  it('低于最低工资返回红色风险', async () => {
    const result = await exec(calculateHourlyRate, {
      city: '上海',
      totalEarnings: 50,
      onlineHours: 10,
      period: 'day',
      subsidies: 0,
      rewards: 0,
      deductions: 10,
      costs: 5,
    });
    expect(result).toContain('red');
    expect(result).toContain('低于');
  });

  it('无城市数据时返回灰色风险', async () => {
    const result = await exec(calculateHourlyRate, {
      city: '未知城市',
      totalEarnings: 200,
      onlineHours: 8,
      period: 'day',
      subsidies: 0,
      rewards: 0,
      deductions: 0,
      costs: 0,
    });
    expect(result).toContain('gray');
    expect(result).toContain('暂无');
  });
});
