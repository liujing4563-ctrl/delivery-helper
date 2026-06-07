/**
 * 职业伤害保障试点平台名单
 *
 * 数据来源：人社部 2026年4月28日新闻发布会
 * 制度说明：无需个人缴费，由平台企业按单计费、按月缴纳
 * 待遇涵盖：医疗、伤残、死亡、生活保障
 * 新职伤与商业意外险可双重理赔
 */

export interface PlatformEntry {
  name: string;
  industry: '出行' | '即时配送' | '同城货运';
  batch: 1 | 2 | 3;
  startDate: string;
}

export const injuryInsurancePlatforms: PlatformEntry[] = [
  // 第一步：2022年7月首批试点（7省7平台）
  { name: '曹操出行', industry: '出行', batch: 1, startDate: '2022-07-01' },
  { name: '美团', industry: '即时配送', batch: 1, startDate: '2022-07-01' },
  { name: '饿了么', industry: '即时配送', batch: 1, startDate: '2022-07-01' },
  { name: '达达快送', industry: '即时配送', batch: 1, startDate: '2022-07-01' },
  { name: '闪送', industry: '即时配送', batch: 1, startDate: '2022-07-01' },
  { name: '货拉拉', industry: '同城货运', batch: 1, startDate: '2022-07-01' },
  { name: '快狗打车', industry: '同城货运', batch: 1, startDate: '2022-07-01' },

  // 第二步：2025年7月扩围
  { name: '滴滴出行', industry: '出行', batch: 2, startDate: '2025-07-01' },
  { name: '顺丰同城', industry: '即时配送', batch: 2, startDate: '2025-07-01' },
  { name: '滴滴货运', industry: '同城货运', batch: 2, startDate: '2025-07-01' },
  { name: '满帮省省', industry: '同城货运', batch: 2, startDate: '2025-07-01' },

  // 第三步：2026年7月1日全国推行（新增14家）
  // 出行
  { name: 'T3出行', industry: '出行', batch: 3, startDate: '2026-07-01' },
  { name: '花小猪出行', industry: '出行', batch: 3, startDate: '2026-07-01' },
  { name: '阳光出行', industry: '出行', batch: 3, startDate: '2026-07-01' },
  { name: '如祺出行', industry: '出行', batch: 3, startDate: '2026-07-01' },
  { name: '享道出行', industry: '出行', batch: 3, startDate: '2026-07-01' },
  { name: '及时用车', industry: '出行', batch: 3, startDate: '2026-07-01' },
  { name: '风韵出行', industry: '出行', batch: 3, startDate: '2026-07-01' },
  { name: '首汽约车', industry: '出行', batch: 3, startDate: '2026-07-01' },
  { name: '美团打车', industry: '出行', batch: 3, startDate: '2026-07-01' },
  // 即时配送
  { name: '小象超市', industry: '即时配送', batch: 3, startDate: '2026-07-01' },
  { name: '盒马鲜生', industry: '即时配送', batch: 3, startDate: '2026-07-01' },
  { name: '叮咚买菜', industry: '即时配送', batch: 3, startDate: '2026-07-01' },
  { name: '朴朴超市', industry: '即时配送', batch: 3, startDate: '2026-07-01' },
  { name: 'UU跑腿', industry: '即时配送', batch: 3, startDate: '2026-07-01' },
];

export const batchLabels: Record<number, string> = {
  1: '2022年7月首批试点（7省7平台）',
  2: '2025年7月扩围',
  3: '2026年7月1日全国推行',
};

export const batchGroups = Object.keys(batchLabels).map(Number);
