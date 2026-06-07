import { describe, it, expect } from 'vitest';
import { regulations } from './regulations';
import { minWageData } from './minWage';
import { legalAidCenters } from './legalAidCenters';
import { newsItems } from './news';
import { injuryInsurancePlatforms } from './injuryInsurance';

// ========== 法规数据 ==========
describe('regulations', () => {
  it('至少有10条法规', () => {
    expect(regulations.length).toBeGreaterThanOrEqual(10);
  });

  it('每条法规都有必填字段', () => {
    for (const reg of regulations) {
      expect(reg.id).toBeTruthy();
      expect(reg.title).toBeTruthy();
      expect(reg.issuer).toBeTruthy();
      expect(reg.publishDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(reg.summary.length).toBeGreaterThan(20);
      expect(reg.tags.length).toBeGreaterThanOrEqual(1);
      expect(reg.lastVerified).toBeTruthy();
    }
  });

  it('法规ID不重复', () => {
    const ids = regulations.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('officialUrl使用https或为空', () => {
    for (const reg of regulations) {
      if (reg.officialUrl) {
        expect(reg.officialUrl).toMatch(/^https:\/\//);
      }
    }
  });

  it('category在允许值范围内', () => {
    const allowed = [
      '劳动报酬',
      '劳动关系',
      '社会保险',
      '工伤职业伤害',
      '法律援助',
      '平台规则',
    ];
    for (const reg of regulations) {
      expect(allowed).toContain(reg.category);
    }
  });
});

// ========== 最低工资数据 ==========
describe('minWageData', () => {
  it('至少覆盖25个城市', () => {
    expect(minWageData.length).toBeGreaterThanOrEqual(25);
  });

  it('每条记录有必填字段', () => {
    for (const item of minWageData) {
      expect(item.city).toBeTruthy();
      expect(item.hourly).toBeGreaterThanOrEqual(0);
      expect(item.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(item.sourceName).toBeTruthy();
      expect(item.sourceUrl).toMatch(/^https:\/\//);
      expect(item.lastVerified).toBeTruthy();
    }
  });

  it('城市名不重复', () => {
    const cities = minWageData.map((w) => w.city);
    expect(new Set(cities).size).toBe(cities.length);
  });

  it('所有城市都已核验', () => {
    const unverified = minWageData.filter((w) => w.lastVerified === '待核实');
    expect(unverified).toHaveLength(0);
  });

  it('小时工资大于0', () => {
    for (const item of minWageData) {
      expect(item.hourly).toBeGreaterThan(0);
    }
  });
});

// ========== 法律援助中心 ==========
describe('legalAidCenters', () => {
  it('至少覆盖25个城市', () => {
    const cities = new Set(legalAidCenters.map((c) => c.city));
    expect(cities.size).toBeGreaterThanOrEqual(25);
  });

  it('每条记录有必填字段', () => {
    for (const center of legalAidCenters) {
      expect(center.id).toBeTruthy();
      expect(center.name).toBeTruthy();
      expect(center.city).toBeTruthy();
      expect(center.sourceName).toBeTruthy();
      expect(center.sourceUrl).toMatch(/^https:\/\//);
      expect(center.lastVerified).toBeTruthy();
    }
  });

  it('ID不重复', () => {
    const ids = legalAidCenters.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('所有中心都已核验', () => {
    const unverified = legalAidCenters.filter(
      (c) => c.lastVerified === '待核实',
    );
    expect(unverified).toHaveLength(0);
  });

  it('最低工资城市全部有法援覆盖', () => {
    const minWageCities = new Set(minWageData.map((w) => w.city));
    const legalAidCities = new Set(legalAidCenters.map((c) => c.city));
    const uncovered = [...minWageCities].filter((c) => !legalAidCities.has(c));
    expect(uncovered).toHaveLength(0);
  });
});

// ========== 政策动态 ==========
describe('newsItems', () => {
  it('至少有5条新闻', () => {
    expect(newsItems.length).toBeGreaterThanOrEqual(5);
  });

  it('每条新闻有必填字段', () => {
    for (const item of newsItems) {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.source).toBeTruthy();
      expect(item.sourceUrl).toBeTruthy();
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(item.summary.length).toBeGreaterThan(20);
      expect(item.tags.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('ID不重复', () => {
    const ids = newsItems.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('按日期降序排列', () => {
    for (let i = 1; i < newsItems.length; i++) {
      expect(newsItems[i].date <= newsItems[i - 1].date).toBe(true);
    }
  });
});

// ========== 职业伤害保障平台 ==========
describe('injuryInsurancePlatforms', () => {
  it('至少有20家平台', () => {
    expect(injuryInsurancePlatforms.length).toBeGreaterThanOrEqual(20);
  });

  it('每条记录有必填字段', () => {
    for (const p of injuryInsurancePlatforms) {
      expect(p.name).toBeTruthy();
      expect(p.industry).toBeTruthy();
      expect(p.batch).toBeTruthy();
      expect(p.startDate).toBeTruthy();
    }
  });

  it('平台名不重复', () => {
    const names = injuryInsurancePlatforms.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
