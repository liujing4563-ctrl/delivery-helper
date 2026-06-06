'use client';

import { useMemo } from 'react';
import { legalAidCenters } from '@/data/legalAidCenters';
import type { LegalAidCenter } from '@/data/types';
import LegalAidCard from '@/components/LegalAidCard';

export default function LegalAidClient() {
  const verifiedCount = useMemo(
    () => legalAidCenters.filter((center) => center.lastVerified !== '待核实').length,
    []
  );

  const cityCount = useMemo(
    () => new Set(legalAidCenters.map((c) => c.city)).size,
    []
  );

  // 按城市分组，城市内按区分组
  const groupedByCity = useMemo(() => {
    const cityMap = new Map<string, Map<string, LegalAidCenter[]>>();
    legalAidCenters.forEach((c) => {
      if (!cityMap.has(c.city)) cityMap.set(c.city, new Map());
      const districtMap = cityMap.get(c.city)!;
      const key = c.district || '市级';
      if (!districtMap.has(key)) districtMap.set(key, []);
      districtMap.get(key)!.push(c);
    });
    return cityMap;
  }, []);

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-xl font-bold text-gray-900">法律援助目录</h1>
      <p className="mt-1 text-sm text-gray-500">
        法律援助中心和正规律所查询入口
      </p>

      {/* 全国法律援助热线 */}
      <div className="mt-4 rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-800">全国法律援助热线</p>
        <a
          href="tel:12348"
          aria-label="拨打全国法律援助热线 12348"
          className="mt-1 inline-flex items-baseline gap-1 text-2xl font-bold text-blue-900 hover:underline"
        >
          <span aria-hidden="true">📞</span> 12348
        </a>
        <p className="mt-1 text-xs text-blue-600">
          全国统一法律援助咨询热线，按语音提示选择当地服务。
        </p>
      </div>

      {/* 数据范围说明 */}
      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        <p className="font-medium"><span aria-hidden="true">⚠️</span> 数据范围说明</p>
        <p className="mt-1">
          当前收录 {cityCount} 个城市共 {legalAidCenters.length} 个法援中心（{verifiedCount} 个已核验）。
          未覆盖城市请拨打 12348 或访问
          {' '}
          <a href="https://www.12348.gov.cn/" target="_blank" rel="noopener noreferrer" className="underline">
            12348中国法网
          </a>
          查询。
        </p>
      </div>

      {/* 法援列表（按城市分组） */}
      <div className="mt-4 space-y-6">
        {Array.from(groupedByCity.entries()).map(([city, districtMap]) => (
          <div key={city}>
            <h2 className="mb-3 text-base font-bold text-gray-900">
              {city}
            </h2>
            <div className="space-y-4">
              {Array.from(districtMap.entries()).map(([district, centers]) => (
                <div key={district}>
                  <h3 className="mb-2 text-sm font-semibold text-gray-500">
                    {district}
                  </h3>
                  <div className="space-y-3">
                    {centers.map((center) => (
                      <LegalAidCard key={center.id} center={center} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 正规律所查询入口（始终显示） */}
      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-gray-500">
          正规律所查询入口
        </h2>
        <p className="mb-2 text-xs text-gray-500">
          本站不推荐具体律所，请通过以下官方渠道查询正规律师和律师事务所
        </p>
        <div className="space-y-3">
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <h3 className="text-sm font-semibold text-purple-900">
              全国律师执业诚信信息公示平台
            </h3>
            <p className="mt-1 text-xs text-purple-600">
              查询全国注册律师和律师事务所的基本信息和诚信记录
            </p>
            <a
              href="https://credit.acla.org.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-purple-800 hover:underline"
            >
              访问平台 →
            </a>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <h3 className="text-sm font-semibold text-purple-900">
              中国法律服务网（12348法网）
            </h3>
            <p className="mt-1 text-xs text-purple-600">
              司法部主办，提供法律咨询、法律援助、人民调解等服务
            </p>
            <a
              href="https://www.12348.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-purple-800 hover:underline"
            >
              访问网站 →
            </a>
          </div>
        </div>
      </div>

      {/* 数据来源说明 */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        法援中心信息来源于各地司法局和 12348 法网，请以官方最新信息为准。
      </p>
    </div>
  );
}
